import React, { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { LOCAL_CURRICULUM_NODES } from '../data/curriculumData';

interface ProgressSettingsPageProps {
  onNavigate: (path: string, param?: string) => void;
}

export const ProgressSettingsPage: React.FC<ProgressSettingsPageProps> = ({ onNavigate }) => {
  const {
    studentState,
    overallMasteryPercent,
    setPacePreference,
    setDiagnosticAutoSkip,
    resetProgress,
  } = useStudent();

  const [showResetModal, setShowResetModal] = useState(false);
  const [resetInput, setResetInput] = useState('');
  const [resetNotice, setResetNotice] = useState<string | null>(null);

  // Completed assignments
  const totalCompletedAssignments = Object.values(studentState.completed_assignments).filter(Boolean).length;
  const totalAssignmentsCount = Object.values(LOCAL_CURRICULUM_NODES).reduce(
    (acc, node) => acc + node.assignments.length,
    0
  );

  const handleExecuteReset = () => {
    resetProgress();
    setShowResetModal(false);
    setResetInput('');
    setResetNotice('Curriculum progression state reset successfully to Node A: Initial Baseline.');
    setTimeout(() => setResetNotice(null), 5000);
  };

  return (
    <div className="flex flex-col w-full pb-space-xl">
      <div className="px-space-md lg:px-space-xl py-space-lg max-w-[1440px] mx-auto w-full flex flex-col gap-space-xl">
        {/* Reset Toast Notification */}
        {resetNotice && (
          <div className="p-space-md rounded-xl bg-secondary-container text-on-secondary-container font-body-sm text-body-sm font-semibold shadow-md flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span>{resetNotice}</span>
            </div>
            <button onClick={() => setResetNotice(null)} className="text-on-secondary-container hover:opacity-80">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        )}

        {/* Top Context & Header Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pb-space-sm">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-space-xs text-secondary font-label-caps uppercase tracking-wider font-bold">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span>Telemetry &amp; Competency Dashboard</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
              My Progress &amp; Settings
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              Learn smarter. Skip repetition. Build your capstone. Real-time diagnostic telemetry, verified credentials, and pedagogical velocity.
            </p>
          </div>

          <div className="flex items-center gap-space-sm shrink-0">
            <button
              onClick={() => onNavigate('roadmap')}
              className="inline-flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">alt_route</span>
              <span className="font-headline-sm text-body-sm font-semibold">Learning Roadmap</span>
            </button>
            <button
              onClick={() => alert('DevTrail Verified Credential #9814-AR: 100% Core Competencies Hash Validated.')}
              className="inline-flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-surface-container-lowest text-on-surface shadow-sm hover:bg-surface-container-low transition-all"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">verified_user</span>
              <span className="font-headline-sm text-body-sm font-semibold">Download Verified Credential</span>
            </button>
          </div>
        </div>

        {/* Student Profile & Holistic Telemetry Bento */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          {/* Student Profile Card (4 cols) */}
          <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex flex-col gap-space-md relative z-10">
              <div className="flex items-center gap-space-md">
                <div className="relative">
                  <div className="w-16 h-16 rounded-xl bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center font-bold text-2xl shadow-sm">
                    AR
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-secondary ring-2 ring-surface-container-lowest flex items-center justify-center">
                    <span className="material-symbols-outlined text-[10px] text-on-secondary">check</span>
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-headline-md text-headline-md text-on-surface leading-tight font-bold truncate">
                    {studentState.student_name}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    alex.rivera@devtrail.internal
                  </span>
                  <div className="inline-flex items-center gap-1.5 mt-1">
                    <span className="font-label-caps text-[10px] uppercase font-bold text-primary bg-primary-fixed px-1.5 py-0.5 rounded">
                      {studentState.license}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-2">
                <div className="flex justify-between items-center text-body-sm font-body-sm">
                  <span className="text-on-surface-variant">Curriculum Track</span>
                  <span className="font-semibold text-on-surface">{studentState.track}</span>
                </div>
                <div className="flex justify-between items-center text-body-sm font-body-sm">
                  <span className="text-on-surface-variant">Active Cohort</span>
                  <span className="font-semibold text-on-surface">{studentState.cohort}</span>
                </div>
                <div className="flex justify-between items-center text-body-sm font-body-sm">
                  <span className="text-on-surface-variant">Diagnostic Bypass State</span>
                  <span className="inline-flex items-center gap-1 text-secondary font-label-code-sm text-label-code-sm font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    Autopilot ({studentState.bypassed_nodes.length} Skipped)
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-space-md mt-space-md flex items-center justify-between border-t border-surface-container-high/60">
              <div className="flex flex-col">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                  Velocity Factor
                </span>
                <span className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">
                  1.4x
                </span>
              </div>
              <div className="flex items-center gap-1 text-secondary bg-secondary-container/40 text-on-secondary-container px-2.5 py-1 rounded-full font-label-code-sm text-label-code-sm font-semibold">
                <span className="material-symbols-outlined text-[16px]">speed</span>
                <span>+40% above baseline</span>
              </div>
            </div>
          </div>

          {/* Large Progress Ring & Metric Overview (8 cols) */}
          <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm">
              <div>
                <span className="font-label-caps text-label-caps uppercase text-primary font-bold tracking-wider">
                  Telemetry Overview
                </span>
                <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                  Curriculum Mastery Breakdown
                </h2>
              </div>
              <span className="font-label-code-sm text-label-code-sm px-space-sm py-1 bg-surface-container rounded-full text-on-surface-variant font-medium">
                Milestone: {studentState.mastered_nodes.length} of 7 Nodes Mastered
              </span>
            </div>

            {/* Metric Cards & Radial Dial */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md items-center py-space-sm">
              {/* Radial Gauge (4 cols) */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-space-sm">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      className="text-surface-container"
                      cx="60"
                      cy="60"
                      fill="transparent"
                      r="50"
                      stroke="currentColor"
                      strokeWidth="10"
                    ></circle>
                    <circle
                      className="text-secondary"
                      cx="60"
                      cy="60"
                      fill="transparent"
                      r="50"
                      stroke="currentColor"
                      strokeDasharray="314.159"
                      strokeDashoffset={314.159 - (314.159 * studentState.bypassed_nodes.length * 15) / 100}
                      strokeLinecap="round"
                      strokeWidth="10"
                    ></circle>
                    <circle
                      className="text-primary transition-all duration-700"
                      cx="60"
                      cy="60"
                      fill="transparent"
                      r="50"
                      stroke="currentColor"
                      strokeDasharray="314.159"
                      strokeDashoffset={314.159 - (314.159 * overallMasteryPercent) / 100}
                      strokeLinecap="round"
                      strokeWidth="10"
                    ></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="font-headline-xl text-headline-xl text-on-surface font-bold leading-none">
                      {overallMasteryPercent}%
                    </span>
                    <span className="font-label-caps text-[10px] uppercase text-on-surface-variant font-bold mt-1">
                      Complete
                    </span>
                  </div>
                </div>
                <span className="font-label-code-sm text-label-code-sm text-on-surface-variant mt-2 text-center">
                  {studentState.mastered_nodes.length} of 7 Core Nodes Mastered
                </span>
              </div>

              {/* Quantitative KPIs (8 cols) */}
              <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-1">
                  <div className="flex items-center justify-between text-on-surface-variant">
                    <span className="font-label-caps text-label-caps uppercase font-bold">Invested Time</span>
                    <span className="material-symbols-outlined text-[18px] text-primary">schedule</span>
                  </div>
                  <span className="font-headline-md text-headline-md text-on-surface font-bold">
                    {studentState.hours_invested}{' '}
                    <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">hrs</span>
                  </span>
                  <span className="font-body-sm text-[12px] text-on-surface-variant">
                    Dedicated interactive labs &amp; reviews
                  </span>
                </div>

                <div className="bg-secondary-container/20 p-space-md rounded-lg flex flex-col gap-1">
                  <div className="flex items-center justify-between text-on-secondary-container">
                    <span className="font-label-caps text-label-caps uppercase font-bold">Bypassed Time</span>
                    <span className="material-symbols-outlined text-[18px] text-secondary">bolt</span>
                  </div>
                  <span className="font-headline-md text-headline-md text-secondary font-bold">
                    {studentState.hours_bypassed}{' '}
                    <span className="font-body-sm text-body-sm text-secondary font-normal">hrs</span>
                  </span>
                  <span className="font-body-sm text-[12px] text-on-secondary-container">
                    Saved via automated test diagnostics
                  </span>
                </div>

                <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-1">
                  <div className="flex items-center justify-between text-on-surface-variant">
                    <span className="font-label-caps text-label-caps uppercase font-bold">Checkpoints</span>
                    <span className="material-symbols-outlined text-[18px] text-primary">task_alt</span>
                  </div>
                  <span className="font-headline-md text-headline-md text-on-surface font-bold">
                    {totalCompletedAssignments}{' '}
                    <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">
                      / {totalAssignmentsCount} items
                    </span>
                  </span>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{ width: `${Math.round((totalCompletedAssignments / totalAssignmentsCount) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-1">
                  <div className="flex items-center justify-between text-on-surface-variant">
                    <span className="font-label-caps text-label-caps uppercase font-bold">Terminal Velocity</span>
                    <span className="material-symbols-outlined text-[18px] text-primary">trending_up</span>
                  </div>
                  <span className="font-headline-md text-headline-md text-on-surface font-bold">
                    1.4x <span className="font-body-sm text-body-sm text-secondary font-medium">Rapid</span>
                  </span>
                  <span className="font-body-sm text-[12px] text-on-surface-variant">
                    On pace to graduate 12 days early
                  </span>
                </div>
              </div>
            </div>

            {/* Legend Ribbon */}
            <div className="flex flex-wrap items-center gap-space-md pt-space-xs text-label-code-sm font-label-code-sm text-on-surface-variant border-t border-surface-container-high">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-primary"></span>
                <span>Direct Mastery ({studentState.mastered_nodes.length} Nodes)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-secondary"></span>
                <span>Diagnostic Bypass ({studentState.bypassed_nodes.length} Units)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-surface-container"></span>
                <span>Pending Capstone G</span>
              </div>
            </div>
          </div>
        </div>

        {/* Historical Test Runs Activity Log */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
          <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
            <div>
              <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
                Verification Ledger
              </span>
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                Historical Assessment &amp; Checkpoint Activity
              </h2>
            </div>
            <span className="font-label-code-sm text-label-code-sm px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-medium">
              Audit Hash Verified
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            {studentState.history_logs.map(log => (
              <div
                key={log.id}
                className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-1 border border-surface-container-high/40 hover:border-surface-container-high transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-label-code-sm text-label-code-sm font-semibold text-primary">
                    {log.title}
                  </span>
                  <span className="px-2 py-0.5 rounded font-label-code-sm text-[11px] font-bold bg-secondary-container text-on-secondary-container">
                    {log.score}
                  </span>
                </div>
                <p className="font-body-sm text-[12px] text-on-surface-variant leading-snug">
                  {log.details}
                </p>
                <span className="font-label-code-sm text-[10px] text-outline mt-1">
                  {log.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Preferences & Danger Zone Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          {/* Learning Preferences (7 cols) */}
          <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
            <div>
              <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
                Preferences
              </span>
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                Curriculum Engine Settings
              </h2>
            </div>

            <div className="flex flex-col gap-space-md">
              {/* Pace Setting */}
              <div className="flex flex-col gap-2">
                <label className="font-headline-sm text-body-md font-semibold text-on-surface flex items-center justify-between">
                  <span>Learning Pace &amp; Diagnostic Policy</span>
                  <span className="font-label-code-sm text-label-code-sm text-primary font-medium">
                    Auto-Skip ≥ 80%
                  </span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                  {[
                    { id: 'comprehensive', title: 'Comprehensive', desc: 'Zero skips. Reviews every concept sequentially.' },
                    { id: 'accelerated', title: 'Accelerated', desc: 'Skips modules if diagnostic score is ≥ 80%.' },
                    { id: 'aggressive', title: 'Aggressive', desc: 'Unlocks next node with ≥ 70% threshold.' },
                  ].map(p => (
                    <label
                      key={p.id}
                      onClick={() => setPacePreference(p.id as any)}
                      className={`flex flex-col p-space-sm rounded-lg cursor-pointer transition-all ${
                        studentState.pace_preference === p.id
                          ? 'bg-primary-fixed/30 ring-2 ring-primary/40 shadow-sm'
                          : 'bg-surface-container-low hover:bg-surface-container'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                          {p.title}
                        </span>
                        <input
                          type="radio"
                          name="pace-option"
                          checked={studentState.pace_preference === p.id}
                          onChange={() => {}}
                          className="w-4 h-4 text-primary"
                        />
                      </div>
                      <span className="font-body-sm text-[11px] text-on-surface-variant mt-1">
                        {p.desc}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notification Toggles */}
              <div className="flex flex-col gap-3 pt-space-xs">
                <span className="font-headline-sm text-body-md font-semibold text-on-surface">
                  Telemetry &amp; Milestone Alerts
                </span>
                <div className="flex items-center justify-between p-space-sm bg-surface-container-low rounded-lg">
                  <div className="flex flex-col">
                    <span className="font-body-sm text-body-sm font-medium text-on-surface">
                      Automatic Diagnostic Fast-Track
                    </span>
                    <span className="font-body-sm text-[12px] text-on-surface-variant">
                      Automatically bypass subsequent modules when passing tests at ≥80%
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={studentState.diagnostic_auto_skip}
                    onChange={e => setDiagnosticAutoSkip(e.target.checked)}
                    className="w-4 h-4 text-primary rounded"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone / Reset State Controls (5 cols) */}
          <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
            <div className="flex flex-col gap-space-sm">
              <div className="flex items-center gap-space-xs text-error">
                <span className="material-symbols-outlined text-[22px]">warning</span>
                <span className="font-label-caps text-label-caps uppercase font-bold tracking-wider">
                  Danger Zone
                </span>
              </div>
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                Demo Progress &amp; State Controls
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Reset {studentState.student_name}'s demo curriculum progression back to Node A or clear cached simulation logs and chapter completion states.
              </p>
              <div className="p-space-sm bg-error-container/40 rounded-lg flex items-start gap-space-xs text-on-error-container">
                <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">info</span>
                <p className="font-body-sm text-[12px]">
                  Requires 2-step confirmation to prevent accidental loss during live curriculum demos.
                </p>
              </div>
            </div>

            <div className="pt-space-md flex flex-col gap-space-xs">
              <button
                onClick={() => setShowResetModal(true)}
                className="w-full py-2.5 px-space-md rounded-lg bg-surface-container-lowest text-error font-headline-sm text-body-sm font-semibold hover:bg-error-container/30 transition-all flex items-center justify-center gap-2 shadow-sm border border-error/30"
              >
                <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                <span>Reset Demo Progress (Node A)</span>
              </button>
              <span className="font-label-code-sm text-[10px] text-center text-outline">
                State cached locally in browser localStorage
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Step Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-space-md">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-xl p-space-lg shadow-xl flex flex-col gap-space-md transform transition-all">
            <div className="flex items-center gap-space-sm text-error">
              <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px] text-on-error-container">delete_forever</span>
              </div>
              <div className="flex flex-col">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Confirm Progression Reset
                </h3>
                <span className="font-label-code-sm text-label-code-sm text-error font-medium">
                  Step 2 of 2: Final Verification
                </span>
              </div>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Are you sure you want to revert {studentState.student_name} to <strong>Node A: Foundations</strong>? All completed checkpoints and {studentState.hours_bypassed} bypass hours will be cleared.
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-code-sm text-label-code-sm text-on-surface-variant">
                Type <span className="font-bold text-on-surface">RESET-ALEX</span> to confirm:
              </label>
              <input
                type="text"
                value={resetInput}
                onChange={e => setResetInput(e.target.value)}
                placeholder="RESET-ALEX"
                className="w-full px-space-md py-2 bg-surface-container-low rounded-lg font-label-code-md text-label-code-md text-on-surface focus:outline-none focus:ring-2 focus:ring-error/20"
              />
            </div>

            <div className="flex items-center justify-end gap-space-sm pt-space-xs">
              <button
                onClick={() => {
                  setShowResetModal(false);
                  setResetInput('');
                }}
                className="px-space-md py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteReset}
                disabled={resetInput.trim() !== 'RESET-ALEX'}
                className="px-space-md py-2 rounded-lg bg-error text-on-error font-body-sm text-body-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-on-error-container transition-all"
              >
                Execute Hard Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
