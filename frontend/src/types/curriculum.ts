export interface Assignment {
  id: string;
  title: string;
  points: number;
  required: boolean;
}

export interface DiagnosticQuestion {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export interface CurriculumNode {
  id: string;
  code: string;
  title: string;
  category: 'core' | 'elective' | 'capstone';
  tier: number;
  tier_name: string;
  estimated_hours: number;
  heuristic_cost: number;
  summary: string;
  prerequisites: string[];
  competencies: string[];
  assignments: Assignment[];
  diagnostic_quiz: DiagnosticQuestion[];
}

export interface CurriculumEdge {
  from_node: string;
  to_node: string;
  weight: number;
  is_core: boolean;
}

export interface StudentState {
  student_name: string;
  track: string;
  cohort: string;
  license: string;
  mastered_nodes: string[];
  bypassed_nodes: string[];
  completed_assignments: Record<string, boolean>;
  assignment_scores: Record<string, number>;
  current_target_node: string;
  pace_preference: 'comprehensive' | 'accelerated' | 'aggressive';
  diagnostic_auto_skip: boolean;
  hours_invested: number;
  hours_bypassed: number;
  history_logs: HistoryLog[];
}

export interface HistoryLog {
  id: string;
  timestamp: string;
  type: 'assignment' | 'diagnostic' | 'lab';
  title: string;
  details: string;
  score: string;
  status: 'passed' | 'completed' | 'in_progress';
}

export interface RouteResponse {
  algorithm: string;
  success: boolean;
  path: string[];
  explored_order: string[];
  nodes_visited_count: number;
  path_length?: number;
  total_cost?: number;
  baseline_cost?: number;
  savings_hours?: number;
  explanation: string;
  error?: string;
}

export interface LabMetadata {
  id: string;
  number: number;
  title: string;
  domain: 'search' | 'logic' | 'fuzzy' | 'neural';
  domain_label: string;
  summary: string;
  formula: string;
}
