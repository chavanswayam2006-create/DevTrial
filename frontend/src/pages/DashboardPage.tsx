import React from 'react';
import { useStudent } from '../context/StudentContext';
import { LOCAL_CURRICULUM_NODES } from '../data/curriculumData';

interface DashboardPageProps {
  onNavigate: (path: string, param?: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { studentState, overallMasteryPercent } = useStudent();

  const targetNode = LOCAL_CURRICULUM_NODES[studentState.current_target_node] || LOCAL_CURRICULUM_NODES['node_d'];

  // Count completed assignments
  const totalCompletedAssignments = Object.values(studentState.completed_assignments).filter(Boolean).length;
  const totalAssignmentsCount = Object.values(LOCAL_CURRICULUM_NODES).reduce(
    (acc, node) => acc + node.assignments.length,
    0
  );

  // Time calculations
  const standardHours = 48.0;
  const hoursLeft = Math.max(0, Math.round((standardHours - studentState.hours_invested - studentState.hours_bypassed) * 10) / 10);
  const efficiencyRatio = Math.round(((studentState.hours_invested + studentState.hours_bypassed) / Math.max(1, studentState.hours_invested)) * 10) / 10;

  // Mastered chapters count
  const coreNodes = ['node_a', 'node_b', 'node_c', 'node_d', 'node_e', 'node_f', 'node_g'];
  const masteredCount = coreNodes.filter(n => studentState.mastered_nodes.includes(n) || studentState.bypassed_nodes.includes(n)).length;

  return (
    <div className="flex flex-col w-full">
      <div className="px-space-lg py-space-lg max-w-7xl mx-auto w-full flex flex-col gap-space-lg">
        {/* Top Greeting & Live Trajectory Status */}
        <div className="relative overflow-hidden bg-surface-container-lowest rounded-xl p-space-lg shadow-sm">
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-gradient-to-br from-primary/10 via-secondary-container/20 to-transparent blur-2xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
            <div className="flex flex-col gap-space-xs max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full font-label-caps text-label-caps uppercase bg-secondary-container text-on-secondary-container font-bold">
                  Adaptive Pace: +48% Faster
                </span>
                <span className="font-label-code-sm text-label-code-sm text-outline">v2.4.9 Engine</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                Welcome back, {studentState.student_name}! You are on the accelerated path to Node G Capstone.
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Learn smarter. Skip repetition. Build your capstone with AI-curated checkpoints and rigorous DAG prerequisites.
              </p>
            </div>
            <div className="flex items-center gap-space-sm self-start lg:self-center">
              <button
                onClick={() => onNavigate('progress')}
                className="inline-flex items-center gap-1.5 px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
                <span>Path Settings</span>
              </button>
              <button
                onClick={() => onNavigate('chapter', targetNode.id)}
                className="inline-flex items-center gap-1.5 px-space-md py-2 rounded-lg bg-primary-container text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                <span>Resume {targetNode.code}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Telemetry Metric Cards Bento */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {/* Card 1: Overall Progress */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                  Overall Progress
                </span>
                <span className="font-headline-md text-headline-md text-on-surface mt-1 font-bold">
                  {masteredCount} of 7
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Chapters Mastered</span>
              </div>
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 48 48">
                  <circle
                    className="text-surface-container-high"
                    cx="24"
                    cy="24"
                    fill="none"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <circle
                    className="text-secondary transition-all duration-700"
                    cx="24"
                    cy="24"
                    fill="none"
                    r="20"
                    stroke="currentColor"
                    strokeDasharray="125.6"
                    strokeDashoffset={125.6 - (125.6 * overallMasteryPercent) / 100}
                    strokeLinecap="round"
                    strokeWidth="4.5"
                  ></circle>
                </svg>
                <span className="absolute font-label-code-sm text-label-code-sm font-bold text-on-surface">
                  {overallMasteryPercent}%
                </span>
              </div>
            </div>
            <div className="mt-space-md w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-secondary h-full rounded-full transition-all duration-700"
                style={{ width: `${overallMasteryPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Card 2: Time Saved via Diagnostics */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                  Time Saved via Diagnostics
                </span>
                <span className="font-headline-md text-headline-md text-primary mt-1 font-bold">
                  {studentState.hours_bypassed} hrs
                </span>
                <span className="font-body-sm text-body-sm text-secondary font-medium flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[14px]">bolt</span> Topics verified without repetition
                </span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[22px]">timer</span>
              </div>
            </div>
            <div className="mt-space-md flex items-center justify-between font-label-code-sm text-label-code-sm text-on-surface-variant">
              <span>Diagnostics passed: {studentState.bypassed_nodes.length}</span>
              <span className="text-primary font-semibold">100% precision</span>
            </div>
          </div>

          {/* Card 3: Assignments Completed */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                  Assignments
                </span>
                <span className="font-headline-md text-headline-md text-on-surface mt-1 font-bold">
                  {totalCompletedAssignments} / {totalAssignmentsCount}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Checkpoints evaluated</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-secondary-container/40 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[22px]">fact_check</span>
              </div>
            </div>
            <div className="mt-space-md flex items-center gap-1">
              {[...Array(8)].map((_, idx) => (
                <span
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    idx < Math.min(8, Math.round((totalCompletedAssignments / totalAssignmentsCount) * 8))
                      ? 'bg-secondary'
                      : idx === Math.min(8, Math.round((totalCompletedAssignments / totalAssignmentsCount) * 8))
                      ? 'bg-primary animate-pulse'
                      : 'bg-surface-container-high'
                  }`}
                ></span>
              ))}
            </div>
          </div>

          {/* Card 4: Estimated Time to Capstone */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                  Est. to Capstone
                </span>
                <span className="font-headline-md text-headline-md text-on-surface mt-1 font-bold">
                  {hoursLeft} hrs
                </span>
                <span className="font-body-sm text-body-sm text-outline line-through">{standardHours} hrs standard</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
                <span className="material-symbols-outlined text-[22px]">military_tech</span>
              </div>
            </div>
            <div className="mt-space-md flex items-center justify-between font-label-code-sm text-label-code-sm">
              <span className="text-on-surface-variant">Efficiency factor</span>
              <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-bold">
                {efficiencyRatio}x speed
              </span>
            </div>
          </div>
        </div>

        {/* Recommended Next Chapter Hero Card */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-space-sm">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full font-label-code-sm text-label-code-sm font-semibold bg-primary-fixed text-on-primary-fixed">
                RECOMMENDED STEP
              </span>
              <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">
                Chapter {targetNode.code} • {targetNode.title}
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container font-label-code-sm text-label-code-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
              <span>
                Prerequisites Met:{' '}
                {targetNode.prerequisites.length > 0
                  ? targetNode.prerequisites.map(p => LOCAL_CURRICULUM_NODES[p]?.code).join(', ')
                  : 'Root Milestone'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
            <div className="lg:col-span-8 flex flex-col gap-space-sm">
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                Chapter {targetNode.code}: {targetNode.title}
              </h2>
              <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-xs shadow-sm">
                <div className="flex items-center gap-2 text-primary font-label-code-md text-label-code-md font-semibold">
                  <span className="material-symbols-outlined text-[20px]">psychology</span>
                  <span>DevTrail AI Recommendation Engine</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  {targetNode.summary} Starting at Chapter {targetNode.code} ensures zero redundant learning and fast-tracks you directly toward Capstone Node G without skipping required foundational dependencies.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-space-md pt-space-xs font-label-code-sm text-label-code-sm text-on-surface-variant">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-primary">view_carousel</span>
                  <span>{targetNode.assignments.length} Interactive Assignments</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-secondary">timer</span>
                  <span>{targetNode.estimated_hours} Hours Estimated</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">bolt</span>
                  <span>Diagnostic Fast-Track Available</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-space-sm bg-surface-container-low p-space-md rounded-xl">
              <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                Action Center
              </span>
              <button
                onClick={() => onNavigate('chapter', targetNode.id)}
                className="w-full py-2.5 px-space-md rounded-lg bg-primary-container text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">terminal</span>
                <span>Open Chapter Studio</span>
              </button>
              <button
                onClick={() => onNavigate('roadmap')}
                className="w-full py-2.5 px-space-md rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">alt_route</span>
                <span>Explore Full Roadmap DAG</span>
              </button>
              <button
                onClick={() => onNavigate('labs', 'lab_04')}
                className="w-full py-2.5 px-space-md rounded-lg bg-surface-container-lowest hover:bg-surface-container text-secondary font-body-sm text-body-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">route</span>
                <span>Run A* Heuristic Traversal</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Vector Strip: Quick Trajectory Preview */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-md">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
            <span className="font-label-code-sm text-label-code-sm font-bold text-on-surface">
              Current Computed A* Vector:
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-label-code-md text-label-code-md overflow-x-auto py-1">
            {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((code, idx) => {
              const nid = `node_${code.toLowerCase()}`;
              const isMastered = studentState.mastered_nodes.includes(nid) || studentState.bypassed_nodes.includes(nid);
              const isCurrent = studentState.current_target_node === nid;
              return (
                <React.Fragment key={code}>
                  <button
                    onClick={() => onNavigate('chapter', nid)}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                      isMastered
                        ? 'bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-on-secondary'
                        : isCurrent
                        ? 'bg-primary text-on-primary ring-2 ring-primary/40'
                        : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Node {code}
                  </button>
                  {idx < 6 && <span className="text-outline font-bold">→</span>}
                </React.Fragment>
              );
            })}
          </div>
          <button
            onClick={() => onNavigate('roadmap')}
            className="text-primary font-label-code-sm text-label-code-sm font-semibold hover:underline flex items-center gap-0.5 shrink-0"
          >
            <span>Algorithm Analysis</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};
