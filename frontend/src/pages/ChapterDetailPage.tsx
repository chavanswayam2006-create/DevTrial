import React, { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { LOCAL_CURRICULUM_NODES } from '../data/curriculumData';

interface ChapterDetailPageProps {
  nodeId?: string;
  onNavigate: (path: string, param?: string) => void;
}

export const ChapterDetailPage: React.FC<ChapterDetailPageProps> = ({
  nodeId = 'node_d',
  onNavigate,
}) => {
  const {
    studentState,
    toggleAssignment,
    passDiagnostic,
    markNodeMastered,
    canUnlockNode,
    getChapterProgress,
  } = useStudent();

  const [activeNodeId, setActiveNodeId] = useState<string>(nodeId);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [showDiagnosticModal, setShowDiagnosticModal] = useState(false);
  const [diagnosticAnswers, setDiagnosticAnswers] = useState<Record<string, number>>({});
  const [diagnosticResult, setDiagnosticResult] = useState<{ score: number; passed: boolean } | null>(null);

  // Microtask quiz state
  const [selectedQuizOpt, setSelectedQuizOpt] = useState<string>('');
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  const node = LOCAL_CURRICULUM_NODES[activeNodeId] || LOCAL_CURRICULUM_NODES['node_d'];
  const progressPercent = getChapterProgress(node.id);
  const isUnlocked = canUnlockNode(node.id);
  const isMastered =
    studentState.mastered_nodes.includes(node.id) || studentState.bypassed_nodes.includes(node.id);

  // Run the code terminal walkthrough
  const handleRunCode = () => {
    setIsRunningCode(true);
    setTerminalOutput(['[00:00.00] Initializing V8 JavaScript runtime context...']);

    setTimeout(() => {
      setTerminalOutput(prev => [
        ...prev,
        '[00:00.15] Call Stack: Evaluating synchronous top-level statements...',
        '[00:00.30] Scheduling Microtask 1: queueMicrotask(() => console.log("A"))',
        '[00:00.45] Scheduling Macrotask 1: setTimeout(() => console.log("B"), 0)',
        '[00:00.60] Scheduling Microtask 2: Promise.resolve().then(() => console.log("C"))',
        '[00:00.75] Call stack empty! Draining Microtask FIFO queue before rendering frame...',
        '[00:00.90] > Console Output: A',
        '[00:01.05] > Console Output: C',
        '[00:01.20] Microtask queue empty. Processing next Macrotask from Timer queue...',
        '[00:01.35] > Console Output: B',
        '[00:01.50] Execution completed successfully (2 microtasks drained before 1 macrotask).',
      ]);
      setIsRunningCode(false);
    }, 600);
  };

  // Submit Microtask quiz
  const handleQuizSubmit = () => {
    if (selectedQuizOpt === 'opt3') {
      setQuizFeedback('Correct! Microtask FIFO queue drains completely before macrotasks (Output: A, C, B).');
    } else {
      setQuizFeedback('Incorrect. Remember: Promise microtasks drain before setTimeout macrotasks.');
    }
  };

  // Submit Fast-Track Diagnostic
  const handleDiagnosticSubmit = () => {
    let correct = 0;
    const questions = node.diagnostic_quiz;
    if (questions.length === 0) return;

    questions.forEach(q => {
      if (diagnosticAnswers[q.id] === q.correct_index) {
        correct += 1;
      }
    });

    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= 80;
    setDiagnosticResult({ score, passed });

    if (passed) {
      passDiagnostic(node.id, score);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="px-space-lg py-space-md flex flex-col gap-space-lg max-w-7xl mx-auto w-full">
        {/* Breadcrumb Navigation & Chapter Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
          <nav className="flex items-center gap-space-xs text-on-surface-variant font-label-code-sm text-label-code-sm">
            <button onClick={() => onNavigate('dashboard')} className="hover:text-primary transition-colors">
              Curriculum
            </button>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-semibold">Node {node.code}</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-on-surface font-semibold truncate max-w-xs">{node.title}</span>
          </nav>

          {/* Quick Chapter Selector Pills */}
          <div className="flex items-center gap-1 overflow-x-auto py-1">
            {['node_a', 'node_b', 'node_c', 'node_d', 'node_e', 'node_f', 'node_g'].map(nid => {
              const n = LOCAL_CURRICULUM_NODES[nid];
              const isDone = studentState.mastered_nodes.includes(nid) || studentState.bypassed_nodes.includes(nid);
              const isActive = activeNodeId === nid;
              return (
                <button
                  key={nid}
                  onClick={() => {
                    setActiveNodeId(nid);
                    setTerminalOutput([]);
                    setDiagnosticResult(null);
                    setDiagnosticAnswers({});
                  }}
                  className={`px-2.5 py-1 rounded-md font-label-code-sm text-label-code-sm font-bold transition-all ${
                    isActive
                      ? 'bg-primary text-on-primary ring-2 ring-primary/40'
                      : isDone
                      ? 'bg-secondary-container text-on-secondary-container'
                      : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {n.code}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Header Banner Card */}
        <div className="relative overflow-hidden bg-surface-container-lowest rounded-xl p-space-lg shadow-sm">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-secondary-container/20 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative flex flex-col lg:flex-row lg:items-start lg:justify-between gap-space-lg">
            <div className="flex flex-col gap-space-sm max-w-3xl">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-space-xs">
                <span className="px-space-sm py-0.5 rounded-full bg-primary-container text-on-primary font-label-caps text-label-caps tracking-wider font-bold">
                  NODE {node.code} • {node.category.toUpperCase()} • {progressPercent}% COMPLETED
                </span>
                <span className="px-space-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-code-sm text-label-code-sm flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[15px]">verified</span>
                  {node.prerequisites.length === 0
                    ? 'Root Milestone (No Prereqs)'
                    : `Prerequisites: ${node.prerequisites.map(p => LOCAL_CURRICULUM_NODES[p]?.code).join(', ')}`}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mt-space-xs font-bold">
                Chapter {node.code}: {node.title}
              </h1>

              {/* Tagline */}
              <p className="font-body-md text-body-md text-on-surface-variant">
                {node.summary}
              </p>

              {/* Verification Ribbon */}
              <div className="flex items-center gap-space-sm p-space-sm bg-surface-container-low rounded-lg text-secondary">
                <span className="material-symbols-outlined text-[18px]">task_alt</span>
                <span className="font-body-sm text-body-sm text-on-surface">
                  <strong>Prerequisite Rules Status:</strong> {isUnlocked ? 'All required dependencies satisfied. Chapter unlocked.' : 'Prerequisites incomplete. Complete earlier chapters to unlock.'}
                </span>
              </div>
            </div>

            {/* Action Buttons Group */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-space-sm shrink-0 lg:w-72">
              <button
                onClick={() => markNodeMastered(node.id)}
                disabled={!isUnlocked}
                className={`flex items-center justify-center gap-space-xs px-space-md py-space-sm rounded-lg font-headline-sm text-body-md font-semibold transition-all ${
                  isMastered
                    ? 'bg-secondary text-on-secondary shadow-sm'
                    : isUnlocked
                    ? 'bg-primary-container text-on-primary hover:bg-primary shadow-sm'
                    : 'bg-surface-container-high text-outline cursor-not-allowed'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isMastered ? 'check_circle' : isUnlocked ? 'done' : 'lock'}
                </span>
                <span>{isMastered ? 'Chapter Mastered' : 'Mark Chapter Complete'}</span>
              </button>

              {/* Fast-Track Diagnostic Button */}
              {node.diagnostic_quiz.length > 0 && (
                <button
                  onClick={() => setShowDiagnosticModal(true)}
                  className="mt-space-xs flex flex-col items-start gap-1 p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container shadow-sm transition-all text-left group"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-1.5 text-tertiary">
                      <span className="material-symbols-outlined text-[20px] text-tertiary">bolt</span>
                      <span className="font-label-caps text-label-caps uppercase text-tertiary font-bold">
                        Fast-Track Test
                      </span>
                    </div>
                    <span className="font-label-code-sm text-label-code-sm text-primary font-semibold group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                    Already Know This? Take Diagnostic
                  </span>
                  <span className="font-label-code-sm text-label-code-sm text-on-surface-variant">
                    Pass our diagnostic (≥80%) to skip remaining lessons. Saves {node.estimated_hours} hrs.
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Chapter Objectives & Learning Outcomes */}
        <div className="flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Mastery Objectives</h2>
            <span className="font-label-code-sm text-label-code-sm text-on-surface-variant">
              {node.competencies.length} Core Competencies
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
            {node.competencies.map((comp, idx) => (
              <div
                key={idx}
                className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm relative overflow-hidden group hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-1.5 h-full absolute left-0 top-0 ${
                    isMastered ? 'bg-secondary' : idx === 0 ? 'bg-primary-container' : 'bg-surface-container-high'
                  }`}
                ></div>
                <div className="flex items-center justify-between pl-space-xs">
                  <span className="w-7 h-7 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-code-sm text-label-code-sm font-bold">
                    0{idx + 1}
                  </span>
                  <span className="material-symbols-outlined text-secondary text-[20px]">
                    {isMastered ? 'check_circle' : 'radio_button_checked'}
                  </span>
                </div>
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase pl-space-xs font-bold">
                  Competency 0{idx + 1}
                </span>
                <p className="font-body-sm text-body-sm text-on-surface pl-space-xs font-medium">
                  {comp}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Interactive Code Laboratory Console & Checkpoints Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* Interactive Code Console (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[22px]">terminal</span>
                <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                  Live Code Studio: Event Loop Execution
                </h2>
              </div>
              <span className="font-label-code-sm text-label-code-sm px-space-xs py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">
                Interactive Console
              </span>
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-col gap-space-md">
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Single-threaded JavaScript prioritizes the <strong>Microtask Queue</strong> (Promises, queueMicrotask) over the <strong>Macrotask Queue</strong> (setTimeout, setInterval). Run the evaluation harness below:
              </p>

              {/* Dark Terminal Frame */}
              <div className="rounded-lg overflow-hidden shadow-sm flex flex-col bg-[#090d16] text-[#eef0ff]">
                {/* Terminal Header */}
                <div className="bg-[#131b2e] px-space-md py-space-xs flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <div className="w-3 h-3 rounded-full bg-[#ba1a1a]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#ffb95f]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#006a61]"></div>
                    <span className="ml-space-xs font-label-code-sm text-label-code-sm text-[#dad7ff]">
                      event-loop-harness.js
                    </span>
                  </div>
                  <button
                    onClick={handleRunCode}
                    disabled={isRunningCode}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-primary text-on-primary font-label-code-sm text-label-code-sm font-semibold hover:bg-primary-container transition-all active:scale-95"
                  >
                    <span className={`material-symbols-outlined text-[14px] ${isRunningCode ? 'animate-spin' : ''}`}>
                      {isRunningCode ? 'refresh' : 'play_arrow'}
                    </span>
                    <span>{isRunningCode ? 'Evaluating...' : 'Run Console'}</span>
                  </button>
                </div>

                {/* Code Window */}
                <div className="p-space-md font-label-code-md text-label-code-md overflow-x-auto leading-relaxed border-b border-white/10">
                  <pre className="text-sm font-mono text-[#dad7ff]">
{`// 1. Queue Microtask
queueMicrotask(() => console.log('A'));

// 2. Schedule Macrotask Timer
setTimeout(() => console.log('B'), 0);

// 3. Queue Promise Microtask
Promise.resolve().then(() => console.log('C'));`}
                  </pre>
                </div>

                {/* Terminal Output */}
                <div className="p-space-md min-h-[140px] max-h-[220px] overflow-y-auto font-mono text-xs text-secondary-fixed bg-[#04060b]">
                  <div className="text-outline text-[11px] mb-1">=== Virtual V8 Console Output ===</div>
                  {terminalOutput.length === 0 ? (
                    <div className="text-outline italic">Click 'Run Console' to execute the snippet.</div>
                  ) : (
                    terminalOutput.map((line, idx) => (
                      <div key={idx} className="leading-snug">{line}</div>
                    ))
                  )}
                </div>
              </div>

              {/* Multiple Choice Comprehension Check */}
              <div className="flex flex-col gap-space-xs pt-space-xs border-t border-surface-container-high">
                <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
                  Checkpoint Comprehension Check
                </span>
                <p className="font-body-sm text-body-sm font-semibold text-on-surface">
                  Given the microtask specification above, what is the output sequence?
                </p>

                <div className="flex flex-col gap-1.5 mt-1">
                  {[
                    { id: 'opt1', text: 'A, B, then C' },
                    { id: 'opt2', text: 'B, then A and C simultaneously' },
                    { id: 'opt3', text: 'A, C, then B (Microtask FIFO drain precedes Macrotask timer)' },
                    { id: 'opt4', text: 'B, C, then A' },
                  ].map(opt => (
                    <label
                      key={opt.id}
                      className="flex items-center gap-space-sm p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors"
                    >
                      <input
                        type="radio"
                        name="event-loop-quiz"
                        value={opt.id}
                        checked={selectedQuizOpt === opt.id}
                        onChange={() => setSelectedQuizOpt(opt.id)}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="font-body-sm text-body-sm text-on-surface">{opt.text}</span>
                    </label>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-space-xs">
                  <span className="font-label-code-sm text-label-code-sm text-primary font-semibold">
                    {quizFeedback || 'Select an option and submit to verify comprehension'}
                  </span>
                  <button
                    onClick={handleQuizSubmit}
                    disabled={!selectedQuizOpt}
                    className="px-space-md py-1.5 bg-primary text-on-primary rounded-lg font-body-sm text-body-sm font-semibold hover:bg-primary-container transition-all active:scale-95 shadow-sm disabled:opacity-50"
                  >
                    Submit Answer
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Assignment Deliverables Checklist (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                Assignment Checkpoints
              </h2>
              <span className="font-label-code-sm text-label-code-sm text-on-surface-variant">
                {node.assignments.length} Deliverables
              </span>
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-col gap-space-sm">
              {node.assignments.map(assn => {
                const isDone = !!studentState.completed_assignments[assn.id];
                const score = studentState.assignment_scores[assn.id] || (isDone ? 100 : 0);
                return (
                  <div
                    key={assn.id}
                    onClick={() => toggleAssignment(assn.id, node.id, 95)}
                    className={`p-space-sm rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                      isDone
                        ? 'bg-secondary-container/20 border-secondary-container'
                        : 'bg-surface-container-low border-transparent hover:border-surface-container-high'
                    }`}
                  >
                    <div className="flex items-center gap-space-sm">
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                          isDone ? 'bg-secondary text-on-secondary' : 'border border-outline bg-surface-container-lowest'
                        }`}
                      >
                        {isDone && <span className="material-symbols-outlined text-[16px]">check</span>}
                      </div>
                      <div className="flex flex-col">
                        <span className={`font-body-sm text-body-sm font-semibold ${isDone ? 'text-on-surface line-through text-outline' : 'text-on-surface'}`}>
                          {assn.title}
                        </span>
                        <span className="font-label-code-sm text-[11px] text-on-surface-variant">
                          {assn.required ? 'Required Milestone' : 'Elective Enrichment'} • {assn.points} pts
                        </span>
                      </div>
                    </div>

                    <span
                      className={`font-label-code-sm text-label-code-sm font-bold px-2 py-0.5 rounded ${
                        isDone
                          ? 'bg-secondary text-on-secondary'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {isDone ? `${score} pts` : 'Pending'}
                    </span>
                  </div>
                );
              })}

              <div className="p-space-sm bg-surface-container-low rounded-lg mt-space-xs flex items-center justify-between font-label-code-sm text-label-code-sm">
                <span className="text-on-surface-variant">Mastery Requirement:</span>
                <span className="font-bold text-primary">All required checkpoints or ≥80% diagnostic</span>
              </div>
            </div>

            {/* Diagnostic Bridge Info Card */}
            <div className="bg-gradient-to-br from-surface-container-lowest via-surface-container-low to-tertiary-fixed/30 rounded-xl shadow-sm p-space-md flex flex-col gap-space-sm">
              <div className="flex items-center gap-1.5 text-tertiary">
                <span className="material-symbols-outlined text-[20px]">speed</span>
                <span className="font-label-caps text-label-caps font-bold uppercase tracking-wider">
                  Verified Adaptive Bypass
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Fast-Track Diagnostic Bridge
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Want to test out of this chapter's lessons? Launch the verified diagnostic evaluation. Passing at ≥80% unlocks subsequent nodes immediately and saves study hours.
              </p>
              <button
                onClick={() => setShowDiagnosticModal(true)}
                className="w-full py-2 px-space-md rounded-lg bg-primary-container text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span>Launch Chapter Diagnostic</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fast-Track Diagnostic Modal */}
      {showDiagnosticModal && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-space-md">
          <div className="bg-surface-container-lowest max-w-2xl w-full rounded-2xl p-space-lg shadow-2xl flex flex-col gap-space-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
                  <span className="material-symbols-outlined text-[20px]">bolt</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Fast-Track Diagnostic: Chapter {node.code}
                  </h3>
                  <span className="font-label-code-sm text-label-code-sm text-outline">
                    Threshold: ≥80% Clean Pass • No Prerequisite Bypassing
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowDiagnosticModal(false)}
                className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {diagnosticResult ? (
              <div className="flex flex-col gap-space-md items-center text-center py-space-md">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold ${
                    diagnosticResult.passed
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-error-container text-on-error-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-[36px]">
                    {diagnosticResult.passed ? 'verified' : 'priority_high'}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="font-headline-md text-headline-md text-on-surface font-bold">
                    {diagnosticResult.passed ? 'Diagnostic Passed!' : 'Benchmark Not Met'}
                  </h4>
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">
                    {diagnosticResult.score}% Score
                  </span>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                    {diagnosticResult.passed
                      ? `Congratulations! You scored ${diagnosticResult.score}% (Threshold ≥80%). Chapter ${node.code} is marked satisfied and you saved ${node.estimated_hours} study hours.`
                      : `You scored ${diagnosticResult.score}%. Retain full lesson access and review the checkpoints before re-attempting.`}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowDiagnosticModal(false);
                    setDiagnosticResult(null);
                  }}
                  className="px-space-lg py-2 rounded-lg bg-primary-container text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary transition-all shadow-sm"
                >
                  Return to Chapter
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-space-md">
                {node.diagnostic_quiz.map((q, qIdx) => (
                  <div key={q.id} className="p-space-md bg-surface-container-low rounded-xl flex flex-col gap-space-xs">
                    <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
                      Question 0{qIdx + 1}
                    </span>
                    <p className="font-body-md text-body-md font-semibold text-on-surface">
                      {q.question}
                    </p>
                    <div className="flex flex-col gap-1.5 mt-space-xs">
                      {q.options.map((opt, optIdx) => (
                        <label
                          key={optIdx}
                          className="flex items-center gap-space-sm p-space-sm rounded-lg bg-surface-container-lowest hover:bg-surface-container cursor-pointer transition-colors"
                        >
                          <input
                            type="radio"
                            name={`diag-${q.id}`}
                            checked={diagnosticAnswers[q.id] === optIdx}
                            onChange={() =>
                              setDiagnosticAnswers(prev => ({ ...prev, [q.id]: optIdx }))
                            }
                            className="w-4 h-4 text-primary focus:ring-primary"
                          />
                          <span className="font-body-sm text-body-sm text-on-surface">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-end gap-space-sm pt-space-xs border-t border-surface-container-high">
                  <button
                    onClick={() => setShowDiagnosticModal(false)}
                    className="px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDiagnosticSubmit}
                    disabled={Object.keys(diagnosticAnswers).length < node.diagnostic_quiz.length}
                    className="px-space-lg py-2 rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary-container transition-all active:scale-95 shadow-sm disabled:opacity-50"
                  >
                    Submit Diagnostic Assessment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
