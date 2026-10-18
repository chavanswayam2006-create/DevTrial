import React, { createContext, useContext, useState, useEffect } from 'react';
import type { StudentState } from '../types/curriculum';
import { INITIAL_STUDENT_STATE, LOCAL_CURRICULUM_NODES } from '../data/curriculumData';
import { checkBackendHealth } from '../services/api';

interface StudentContextType {
  studentState: StudentState;
  backendConnected: boolean;
  refreshBackendStatus: () => Promise<void>;
  toggleAssignment: (assignmentId: string, nodeId: string, points?: number) => void;
  passDiagnostic: (nodeId: string, score: number) => void;
  markNodeMastered: (nodeId: string) => void;
  setTargetNode: (nodeId: string) => void;
  setPacePreference: (pace: 'comprehensive' | 'accelerated' | 'aggressive') => void;
  setDiagnosticAutoSkip: (enabled: boolean) => void;
  resetProgress: () => void;
  canUnlockNode: (nodeId: string) => boolean;
  getChapterProgress: (nodeId: string) => number;
  overallMasteryPercent: number;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

const STORAGE_KEY = 'devtrail_ai_student_state_v1';

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [studentState, setStudentState] = useState<StudentState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error reading localStorage:', e);
    }
    return INITIAL_STUDENT_STATE;
  });

  const [backendConnected, setBackendConnected] = useState<boolean>(true);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(studentState));
    } catch (e) {
      console.error('Error writing to localStorage:', e);
    }
  }, [studentState]);

  // Periodic health check
  const refreshBackendStatus = async () => {
    const isOnline = await checkBackendHealth();
    setBackendConnected(isOnline);
  };

  useEffect(() => {
    refreshBackendStatus();
    const interval = setInterval(refreshBackendStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  // Helper: check if all prerequisites of a node are met
  const canUnlockNode = (nodeId: string): boolean => {
    const node = LOCAL_CURRICULUM_NODES[nodeId];
    if (!node || node.prerequisites.length === 0) return true;
    const satisfied = new Set([...studentState.mastered_nodes, ...studentState.bypassed_nodes]);
    return node.prerequisites.every(p => satisfied.has(p));
  };

  // Helper: get progress % of chapter based on its assignments
  const getChapterProgress = (nodeId: string): number => {
    if (studentState.mastered_nodes.includes(nodeId) || studentState.bypassed_nodes.includes(nodeId)) {
      return 100;
    }
    const node = LOCAL_CURRICULUM_NODES[nodeId];
    if (!node || node.assignments.length === 0) return 0;
    const completedCount = node.assignments.filter(a => studentState.completed_assignments[a.id]).length;
    return Math.round((completedCount / node.assignments.length) * 100);
  };

  // Toggle individual assignment checkpoint
  const toggleAssignment = (assignmentId: string, nodeId: string, points: number = 100) => {
    setStudentState(prev => {
      const isCurrentlyDone = !!prev.completed_assignments[assignmentId];
      const newDone = !isCurrentlyDone;
      const updatedAssignments = {
        ...prev.completed_assignments,
        [assignmentId]: newDone,
      };
      const updatedScores = {
        ...prev.assignment_scores,
        [assignmentId]: newDone ? points : 0,
      };

      // Check if all required assignments for this node are now complete
      const node = LOCAL_CURRICULUM_NODES[nodeId];
      let newMastered = [...prev.mastered_nodes];
      if (node && node.assignments.length > 0) {
        const allRequiredDone = node.assignments
          .filter(a => a.required)
          .every(a => updatedAssignments[a.id]);

        if (allRequiredDone && !newMastered.includes(nodeId)) {
          newMastered.push(nodeId);
        } else if (!allRequiredDone && newMastered.includes(nodeId) && !prev.bypassed_nodes.includes(nodeId)) {
          newMastered = newMastered.filter(n => n !== nodeId);
        }
      }

      // Add a history log
      const newLog = {
        id: `log_${Date.now()}`,
        timestamp: 'Just now',
        type: 'assignment' as const,
        title: `${node ? node.title : nodeId} Checkpoint`,
        details: newDone ? `Completed assignment with score ${points} pts.` : 'Marked assignment incomplete.',
        score: newDone ? `${points} / 100` : '0 / 100',
        status: newDone ? ('passed' as const) : ('in_progress' as const),
      };

      return {
        ...prev,
        completed_assignments: updatedAssignments,
        assignment_scores: updatedScores,
        mastered_nodes: newMastered,
        history_logs: [newLog, ...prev.history_logs.slice(0, 15)],
      };
    });
  };

  // Student passed a diagnostic test for a chapter
  const passDiagnostic = (nodeId: string, score: number) => {
    const node = LOCAL_CURRICULUM_NODES[nodeId];
    const hoursSaved = node ? node.estimated_hours : 4.0;

    setStudentState(prev => {
      const newMastered = prev.mastered_nodes.includes(nodeId)
        ? prev.mastered_nodes
        : [...prev.mastered_nodes, nodeId];

      const newBypassed = prev.bypassed_nodes.includes(nodeId)
        ? prev.bypassed_nodes
        : [...prev.bypassed_nodes, nodeId];

      // Mark all assignments in this node as completed
      const updatedAssignments = { ...prev.completed_assignments };
      const updatedScores = { ...prev.assignment_scores };
      if (node) {
        node.assignments.forEach(a => {
          updatedAssignments[a.id] = true;
          updatedScores[a.id] = Math.max(score, updatedScores[a.id] || 0);
        });
      }

      const log = {
        id: `diag_${Date.now()}`,
        timestamp: 'Just now',
        type: 'diagnostic' as const,
        title: `Fast-Track Diagnostic: ${node ? node.title : nodeId}`,
        details: `Scored ${score}% (Threshold >= 80%). Automated bypass granted. Saved ${hoursSaved} hrs.`,
        score: `PASSED (${score}%)`,
        status: 'passed' as const,
      };

      return {
        ...prev,
        mastered_nodes: newMastered,
        bypassed_nodes: newBypassed,
        completed_assignments: updatedAssignments,
        assignment_scores: updatedScores,
        hours_bypassed: Math.round((prev.hours_bypassed + hoursSaved) * 10) / 10,
        history_logs: [log, ...prev.history_logs.slice(0, 15)],
      };
    });
  };

  const markNodeMastered = (nodeId: string) => {
    setStudentState(prev => {
      if (prev.mastered_nodes.includes(nodeId)) return prev;
      return {
        ...prev,
        mastered_nodes: [...prev.mastered_nodes, nodeId],
      };
    });
  };

  const setTargetNode = (nodeId: string) => {
    setStudentState(prev => ({ ...prev, current_target_node: nodeId }));
  };

  const setPacePreference = (pace: 'comprehensive' | 'accelerated' | 'aggressive') => {
    setStudentState(prev => ({ ...prev, pace_preference: pace }));
  };

  const setDiagnosticAutoSkip = (enabled: boolean) => {
    setStudentState(prev => ({ ...prev, diagnostic_auto_skip: enabled }));
  };

  const resetProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    // Baseline state: reset to Node A with zero completed checkpoints
    const baseline: StudentState = {
      ...INITIAL_STUDENT_STATE,
      mastered_nodes: [],
      bypassed_nodes: [],
      completed_assignments: {},
      assignment_scores: {},
      current_target_node: 'node_a',
      hours_invested: 0.0,
      hours_bypassed: 0.0,
      history_logs: [
        {
          id: `reset_${Date.now()}`,
          timestamp: 'Just now',
          type: 'diagnostic',
          title: 'Curriculum Baseline Reset',
          details: 'Demo progression reset to initial Node A baseline.',
          score: 'RESET',
          status: 'completed',
        },
      ],
    };
    setStudentState(baseline);
  };

  // Calculate overall core completion percentage (nodes A-G, total 7 nodes)
  const coreNodes = ['node_a', 'node_b', 'node_c', 'node_d', 'node_e', 'node_f', 'node_g'];
  const masteredCoreCount = coreNodes.filter(n => studentState.mastered_nodes.includes(n) || studentState.bypassed_nodes.includes(n)).length;
  const overallMasteryPercent = Math.round((masteredCoreCount / coreNodes.length) * 100);

  return (
    <StudentContext.Provider
      value={{
        studentState,
        backendConnected,
        refreshBackendStatus,
        toggleAssignment,
        passDiagnostic,
        markNodeMastered,
        setTargetNode,
        setPacePreference,
        setDiagnosticAutoSkip,
        resetProgress,
        canUnlockNode,
        getChapterProgress,
        overallMasteryPercent,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};
