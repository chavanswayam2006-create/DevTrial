import React, { useState, useEffect } from 'react';
import { useStudent } from '../context/StudentContext';
import { ALL_LABS_METADATA } from '../data/curriculumData';
import { runLabApi } from '../services/api';

interface LabDetailPageProps {
  labId?: string;
  onNavigate: (path: string, param?: string) => void;
}

export const LabDetailPage: React.FC<LabDetailPageProps> = ({
  labId = 'lab_01',
  onNavigate,
}) => {
  const { studentState } = useStudent();
  const [currentLabId, setCurrentLabId] = useState<string>(labId);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [labResult, setLabResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Common interactive state
  const [startNode, setStartNode] = useState('node_a');
  const [goalNode, setGoalNode] = useState('node_g');
  const [targetNode, setTargetNode] = useState('node_d');
  const [quizScore, setQuizScore] = useState<number>(85);
  const [confidence, setConfidence] = useState<number>(80);
  const [assignmentCompletion, setAssignmentCompletion] = useState<number>(90);
  const [practiceFreq, setPracticeFreq] = useState<number>(5);
  const [searchAlgo, setSearchAlgo] = useState<'bfs' | 'dfs'>('bfs');
  const [prologQuery, setPrologQuery] = useState<'can_unlock' | 'capstone_ready' | 'unmet_prerequisites'>('can_unlock');
  const [nlpPrompt, setNlpPrompt] = useState('JavaScript uses an event');
  const [nlpModel, setNlpModel] = useState<'bigram' | 'trigram'>('trigram');
  const [minimaxLeaves, setMinimaxLeaves] = useState<number[]>([7, 3, 9, 2, 4, 8, 1, 6]);

  const activeMeta = ALL_LABS_METADATA.find(l => l.id === currentLabId) || ALL_LABS_METADATA[0];

  // Execute Experiment
  const handleRunExperiment = async () => {
    setIsRunning(true);
    setErrorMsg(null);

    const payload: Record<string, any> = {
      start_node: startNode,
      goal_node: goalNode,
      target_node: targetNode,
      current_node: startNode,
      quiz_score: quizScore,
      confidence: confidence,
      assignment_completion: assignmentCompletion,
      practice_frequency: practiceFreq,
      algorithm: searchAlgo,
      query_type: prologQuery,
      prompt: nlpPrompt,
      model_type: nlpModel,
      max_tokens: 12,
      custom_leaves: minimaxLeaves,
      mastered_nodes: studentState.mastered_nodes,
      bypassed_nodes: studentState.bypassed_nodes,
    };

    try {
      const res = await runLabApi(currentLabId, payload);
      setLabResult(res);
    } catch (err: any) {
      console.error('Lab run failed:', err);
      setErrorMsg(err.message || 'Experiment execution failed.');
    } finally {
      setIsRunning(false);
    }
  };

  // Run on mount or tab change
  useEffect(() => {
    handleRunExperiment();
  }, [currentLabId]);

  return (
    <div className="flex flex-col w-full pb-space-xl">
      <div className="px-margin py-gutter flex flex-col gap-space-lg max-w-7xl mx-auto w-full">
        {/* Navigation & Lab Switcher Pills */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
          <nav className="flex items-center gap-space-xs font-label-code-sm text-label-code-sm text-on-surface-variant">
            <button onClick={() => onNavigate('labs')} className="hover:text-primary transition-colors">
              AI Labs
            </button>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-semibold">
              Lab {activeMeta.number < 10 ? `0${activeMeta.number}` : activeMeta.number}
            </span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-on-surface font-semibold truncate max-w-xs">{activeMeta.title}</span>
          </nav>

          {/* Quick Lab Switcher Dropdown / Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {ALL_LABS_METADATA.map(l => (
              <button
                key={l.id}
                onClick={() => {
                  setCurrentLabId(l.id);
                  setLabResult(null);
                }}
                className={`px-2.5 py-1 rounded-md font-label-code-sm text-label-code-sm font-bold whitespace-nowrap transition-all ${
                  currentLabId === l.id
                    ? 'bg-primary text-on-primary shadow-sm ring-1 ring-primary/40'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                }`}
              >
                Lab {l.number < 10 ? `0${l.number}` : l.number}
              </button>
            ))}
          </div>
        </div>

        {/* Lab Header Row & Action CTA */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex flex-col gap-space-xs max-w-3xl z-10">
            <div className="flex flex-wrap items-center gap-space-sm">
              <span className="px-space-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-caps text-label-caps tracking-wider uppercase font-bold">
                LAB {activeMeta.number < 10 ? `0${activeMeta.number}` : activeMeta.number} • {activeMeta.domain_label.toUpperCase()}
              </span>
              <span className="px-space-sm py-0.5 rounded bg-surface-container-high text-on-surface font-label-code-sm text-label-code-sm font-semibold">
                {activeMeta.formula}
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
              {activeMeta.title}
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {activeMeta.summary}
            </p>
          </div>

          <div className="flex items-center gap-space-sm self-start lg:self-center shrink-0 z-10">
            <button
              onClick={handleRunExperiment}
              disabled={isRunning}
              className="px-space-lg py-space-sm rounded-lg bg-primary-container text-on-primary font-body-md text-body-md font-semibold hover:bg-primary transition-all shadow-md active:scale-95 flex items-center gap-space-xs disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-[18px] ${isRunning ? 'animate-spin' : ''}`}>
                {isRunning ? 'refresh' : 'play_arrow'}
              </span>
              <span>{isRunning ? 'Computing AI...' : 'Run Experiment'}</span>
            </button>
          </div>
        </div>

        {/* Experiment Specific Interactive Input Workbench */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
          <div className="flex items-center justify-between border-b border-surface-container-high pb-space-sm">
            <div className="flex items-center gap-space-sm">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">tune</span>
              </div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Experiment Controls &amp; Input Parameters
              </h2>
            </div>
            <span className="font-label-code-sm text-label-code-sm text-outline">
              Live Python Backend Harness
            </span>
          </div>

          {/* Conditional Controls by Lab ID */}
          {/* Lab 01: PEAS */}
          {currentLabId === 'lab_01' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
              <div className="flex flex-col gap-1">
                <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                  Current Node (Origin)
                </label>
                <select
                  value={startNode}
                  onChange={e => setStartNode(e.target.value)}
                  className="bg-surface-container-low rounded-lg p-2 font-body-sm text-on-surface border border-outline-variant"
                >
                  <option value="node_a">Node A: Web Foundations</option>
                  <option value="node_b">Node B: CSS Fundamentals</option>
                  <option value="node_c">Node C: Responsive Layouts</option>
                  <option value="node_d">Node D: JavaScript Fundamentals</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                  Goal Node (Target)
                </label>
                <select
                  value={goalNode}
                  onChange={e => setGoalNode(e.target.value)}
                  className="bg-surface-container-low rounded-lg p-2 font-body-sm text-on-surface border border-outline-variant"
                >
                  <option value="node_g">Node G: Capstone Project</option>
                  <option value="node_f">Node F: React &amp; Architecture</option>
                  <option value="node_e">Node E: DOM &amp; APIs</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                  Diagnostic Quiz Score: {quizScore}%
                </label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={quizScore}
                  onChange={e => setQuizScore(Number(e.target.value))}
                  className="accent-primary cursor-pointer mt-2"
                />
              </div>
            </div>
          )}

          {/* Lab 02: Prolog */}
          {currentLabId === 'lab_02' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              <div className="flex flex-col gap-1">
                <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                  Select Horn Clause Query
                </label>
                <select
                  value={prologQuery}
                  onChange={e => setPrologQuery(e.target.value as any)}
                  className="bg-surface-container-low rounded-lg p-2 font-body-sm text-on-surface border border-outline-variant"
                >
                  <option value="can_unlock">?- can_unlock(TargetNode).</option>
                  <option value="capstone_ready">?- capstone_ready.</option>
                  <option value="unmet_prerequisites">?- unmet_prerequisites(TargetNode, Missing).</option>
                </select>
              </div>

              {prologQuery !== 'capstone_ready' && (
                <div className="flex flex-col gap-1">
                  <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                    Target Chapter
                  </label>
                  <select
                    value={targetNode}
                    onChange={e => setTargetNode(e.target.value)}
                    className="bg-surface-container-low rounded-lg p-2 font-body-sm text-on-surface border border-outline-variant"
                  >
                    <option value="node_d">Node D: JavaScript Fundamentals</option>
                    <option value="node_e">Node E: DOM &amp; APIs</option>
                    <option value="node_f">Node F: React &amp; Full-Stack</option>
                    <option value="node_g">Node G: Capstone Project</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Lab 03: BFS vs DFS */}
          {currentLabId === 'lab_03' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
              <div className="flex flex-col gap-1">
                <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                  Search Algorithm
                </label>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => setSearchAlgo('bfs')}
                    className={`flex-1 py-1.5 rounded-lg font-body-sm font-semibold transition-all ${
                      searchAlgo === 'bfs'
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    BFS (Queue FIFO)
                  </button>
                  <button
                    onClick={() => setSearchAlgo('dfs')}
                    className={`flex-1 py-1.5 rounded-lg font-body-sm font-semibold transition-all ${
                      searchAlgo === 'dfs'
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    DFS (Stack LIFO)
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                  Start Origin
                </label>
                <select
                  value={startNode}
                  onChange={e => setStartNode(e.target.value)}
                  className="bg-surface-container-low rounded-lg p-2 font-body-sm text-on-surface border border-outline-variant"
                >
                  <option value="node_a">Node A: Web Foundations</option>
                  <option value="node_b">Node B: CSS Fundamentals</option>
                  <option value="node_c">Node C: Responsive Layouts</option>
                  <option value="node_d">Node D: JavaScript Fundamentals</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                  Goal Target
                </label>
                <select
                  value={goalNode}
                  onChange={e => setGoalNode(e.target.value)}
                  className="bg-surface-container-low rounded-lg p-2 font-body-sm text-on-surface border border-outline-variant"
                >
                  <option value="node_g">Node G: Capstone Project</option>
                  <option value="node_f">Node F: React &amp; Full-Stack</option>
                  <option value="node_e">Node E: DOM &amp; APIs</option>
                </select>
              </div>
            </div>
          )}

          {/* Lab 04: A* Search */}
          {currentLabId === 'lab_04' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
              <div className="flex flex-col gap-1">
                <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                  Start Origin Node
                </label>
                <select
                  value={startNode}
                  onChange={e => setStartNode(e.target.value)}
                  className="bg-surface-container-low rounded-lg p-2 font-body-sm text-on-surface border border-outline-variant"
                >
                  <option value="node_a">Node A: Web Foundations</option>
                  <option value="node_b">Node B: CSS Fundamentals</option>
                  <option value="node_c">Node C: Responsive Layouts</option>
                  <option value="node_d">Node D: JavaScript Fundamentals</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                  Goal Target Node
                </label>
                <select
                  value={goalNode}
                  onChange={e => setGoalNode(e.target.value)}
                  className="bg-surface-container-low rounded-lg p-2 font-body-sm text-on-surface border border-outline-variant"
                >
                  <option value="node_g">Node G: Capstone Project</option>
                  <option value="node_f">Node F: React &amp; Full-Stack</option>
                  <option value="node_e">Node E: DOM &amp; APIs</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                    Mastered Checkpoints
                  </label>
                  <span className="font-label-code-sm text-label-code-sm font-bold text-secondary">
                    {studentState.mastered_nodes.length} bypassed
                  </span>
                </div>
                <div className="bg-surface-container-low p-2 rounded-lg font-label-code-sm text-xs text-on-surface-variant truncate">
                  {studentState.mastered_nodes.join(', ')}
                </div>
              </div>
            </div>
          )}

          {/* Lab 05: Minimax */}
          {currentLabId === 'lab_05' && (
            <div className="flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                  Leaf Reliability Utility Scores (-10 to +10)
                </label>
                <button
                  onClick={() => {
                    const randomized = Array.from({ length: 8 }, () => Math.floor(Math.random() * 19) - 9);
                    setMinimaxLeaves(randomized);
                  }}
                  className="text-primary font-label-code-sm font-semibold hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">shuffle</span>
                  <span>Randomize Utilities</span>
                </button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {minimaxLeaves.map((leaf, idx) => (
                  <div key={idx} className="flex flex-col items-center bg-surface-container-low p-2 rounded-lg">
                    <span className="font-label-code-sm text-[10px] text-outline">Leaf {idx + 1}</span>
                    <input
                      type="number"
                      min="-10"
                      max="10"
                      value={leaf}
                      onChange={e => {
                        const next = [...minimaxLeaves];
                        next[idx] = Number(e.target.value);
                        setMinimaxLeaves(next);
                      }}
                      className="w-12 text-center bg-surface-container-lowest rounded border border-outline-variant font-bold text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Labs 06 & 07: Fuzzy Controller & Mamdani vs Sugeno */}
          {(currentLabId === 'lab_06' || currentLabId === 'lab_07') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              <div className="flex flex-col gap-1 bg-surface-container-low p-space-sm rounded-xl">
                <div className="flex justify-between items-center">
                  <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                    Quiz Score Input (0 - 100%)
                  </label>
                  <span className="font-label-code-sm font-bold text-primary px-2 py-0.5 rounded bg-primary-container text-on-primary">
                    {quizScore}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={quizScore}
                  onChange={e => setQuizScore(Number(e.target.value))}
                  className="accent-primary cursor-pointer mt-2"
                />
                <div className="flex justify-between font-label-code-sm text-[11px] text-outline">
                  <span>Low (0-40)</span>
                  <span>Medium (40-75)</span>
                  <span>High (75-100)</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 bg-surface-container-low p-space-sm rounded-xl">
                <div className="flex justify-between items-center">
                  <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                    Student Confidence Rating (0 - 100%)
                  </label>
                  <span className="font-label-code-sm font-bold text-secondary px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container">
                    {confidence}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={confidence}
                  onChange={e => setConfidence(Number(e.target.value))}
                  className="accent-secondary cursor-pointer mt-2"
                />
                <div className="flex justify-between font-label-code-sm text-[11px] text-outline">
                  <span>Low (0-35)</span>
                  <span>Medium (35-75)</span>
                  <span>High (75-100)</span>
                </div>
              </div>
            </div>
          )}

          {/* Labs 08 & 09: Neuro-Fuzzy & Neural Learning */}
          {(currentLabId === 'lab_08' || currentLabId === 'lab_09') && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
              <div className="flex flex-col gap-1 bg-surface-container-low p-space-sm rounded-xl">
                <div className="flex justify-between items-center">
                  <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                    Quiz Accuracy
                  </label>
                  <span className="font-label-code-sm font-bold text-primary">{quizScore}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={quizScore}
                  onChange={e => setQuizScore(Number(e.target.value))}
                  className="accent-primary cursor-pointer mt-1"
                />
              </div>

              <div className="flex flex-col gap-1 bg-surface-container-low p-space-sm rounded-xl">
                <div className="flex justify-between items-center">
                  <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                    Assignment Ratio
                  </label>
                  <span className="font-label-code-sm font-bold text-secondary">{assignmentCompletion}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={assignmentCompletion}
                  onChange={e => setAssignmentCompletion(Number(e.target.value))}
                  className="accent-secondary cursor-pointer mt-1"
                />
              </div>

              <div className="flex flex-col gap-1 bg-surface-container-low p-space-sm rounded-xl">
                <div className="flex justify-between items-center">
                  <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                    Weekly Practice Frequency
                  </label>
                  <span className="font-label-code-sm font-bold text-tertiary">{practiceFreq} days/wk</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={practiceFreq}
                  onChange={e => setPracticeFreq(Number(e.target.value))}
                  className="accent-tertiary cursor-pointer mt-1"
                />
              </div>
            </div>
          )}

          {/* Lab 10: N-Gram Models */}
          {currentLabId === 'lab_10' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                  Context Prompt (Web Engineering Domain)
                </label>
                <input
                  type="text"
                  value={nlpPrompt}
                  onChange={e => setNlpPrompt(e.target.value)}
                  placeholder="e.g. JavaScript uses an event"
                  className="bg-surface-container-low rounded-lg p-2.5 font-label-code-md text-sm text-on-surface border border-outline-variant"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                  N-Gram Language Model
                </label>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => setNlpModel('bigram')}
                    className={`flex-1 py-2 rounded-lg font-body-sm font-semibold transition-all ${
                      nlpModel === 'bigram'
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    Bigram (Micro LM)
                  </button>
                  <button
                    onClick={() => setNlpModel('trigram')}
                    className={`flex-1 py-2 rounded-lg font-body-sm font-semibold transition-all ${
                      nlpModel === 'trigram'
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    Trigram (Small LM)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Experiment Results & Telemetry Console */}
        {errorMsg && (
          <div className="p-space-md rounded-xl bg-error-container text-on-error-container font-body-sm text-body-sm">
            {errorMsg}
          </div>
        )}

        {labResult && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            {/* Main Calculation Telemetry Card (8 cols) */}
            <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Calculated Experiment Telemetry
                  </span>
                </div>
                <span className="font-label-code-sm text-label-code-sm bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded font-bold">
                  Status: Success 200 OK
                </span>
              </div>

              {/* Lab 01 PEAS Render */}
              {currentLabId === 'lab_01' && labResult.peas_matrix && (
                <div className="flex flex-col gap-space-md">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                    <div className="p-space-sm rounded-lg bg-surface-container-low border border-primary/20">
                      <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
                        P: Performance Measure
                      </span>
                      <ul className="list-disc list-inside text-xs text-on-surface-variant mt-1 space-y-0.5">
                        {labResult.peas_matrix.performance_measure.metrics.map((m: string, i: number) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-space-sm rounded-lg bg-surface-container-low border border-secondary/20">
                      <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">
                        E: Environment
                      </span>
                      <p className="text-xs text-on-surface-variant mt-1">
                        {labResult.peas_matrix.environment.type} ({labResult.peas_matrix.environment.properties.nodes_count} Nodes, {labResult.peas_matrix.environment.properties.edges_count} Edges)
                      </p>
                    </div>
                    <div className="p-space-sm rounded-lg bg-surface-container-low border border-tertiary/20">
                      <span className="font-label-caps text-label-caps uppercase text-tertiary font-bold">
                        A: Actuators
                      </span>
                      <ul className="list-disc list-inside text-xs text-on-surface-variant mt-1 space-y-0.5">
                        {labResult.peas_matrix.actuators.actions.map((a: string, i: number) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-space-sm rounded-lg bg-surface-container-low border border-outline/20">
                      <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                        S: Sensors
                      </span>
                      <ul className="list-disc list-inside text-xs text-on-surface-variant mt-1 space-y-0.5">
                        {labResult.peas_matrix.sensors.signals.map((s: string, i: number) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-space-sm rounded-lg bg-surface-container font-label-code-sm text-label-code-sm flex flex-col gap-1">
                    <div className="flex justify-between">
                      <span className="font-bold">Goal Test Status:</span>
                      <span className={labResult.problem_formulation.goal_test.is_satisfied ? 'text-secondary font-bold' : 'text-primary font-bold'}>
                        {labResult.problem_formulation.goal_test.result_message}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Lab 02 Prolog Render */}
              {currentLabId === 'lab_02' && (
                <div className="flex flex-col gap-space-sm">
                  <div className="p-space-sm rounded-lg bg-[#090d16] text-[#eef0ff] font-mono text-xs flex flex-col gap-1">
                    <span className="text-secondary-fixed font-bold">{labResult.query}</span>
                    <span className={labResult.result ? 'text-[#86f2e4] font-bold' : 'text-[#ffb95f] font-bold'}>
                      Result: {labResult.result ? 'true.' : 'false.'} ({labResult.result_message})
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 pt-space-xs">
                    <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
                      Backward-Chaining Resolution Trace
                    </span>
                    <div className="p-space-sm rounded-lg bg-surface-container-low font-label-code-sm text-xs flex flex-col gap-1">
                      {labResult.trace?.map((step: string, idx: number) => (
                        <div key={idx} className="text-on-surface-variant">{step}</div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 pt-space-xs">
                    <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">
                      Horn Clauses &amp; Facts Unfolded
                    </span>
                    <div className="p-space-sm rounded-lg bg-surface-container font-mono text-xs flex flex-col gap-1">
                      {labResult.rules_applied?.map((rule: string, idx: number) => (
                        <div key={idx} className="text-primary font-semibold">{rule}</div>
                      ))}
                      {labResult.facts_used?.map((fact: string, idx: number) => (
                        <div key={idx} className="text-on-surface-variant">{fact}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Lab 03 & 04 Search & A* Render */}
              {(currentLabId === 'lab_03' || currentLabId === 'lab_04') && (
                <div className="flex flex-col gap-space-md">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm">
                    <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                      <span className="font-label-caps text-[10px] uppercase text-outline">Algorithm</span>
                      <span className="font-headline-sm text-headline-sm font-bold text-primary">
                        {labResult.algorithm}
                      </span>
                    </div>
                    <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                      <span className="font-label-caps text-[10px] uppercase text-outline">Visited Nodes</span>
                      <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                        {labResult.nodes_visited_count}
                      </span>
                    </div>
                    <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                      <span className="font-label-caps text-[10px] uppercase text-outline">Total Hours Cost</span>
                      <span className="font-headline-sm text-headline-sm font-bold text-secondary">
                        {labResult.total_cost || 0} hrs
                      </span>
                    </div>
                    <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                      <span className="font-label-caps text-[10px] uppercase text-outline">Hours Saved</span>
                      <span className="font-headline-sm text-headline-sm font-bold text-tertiary">
                        {labResult.savings_hours || 0} hrs
                      </span>
                    </div>
                  </div>

                  <div className="p-space-sm rounded-lg bg-surface-container flex flex-col gap-1">
                    <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
                      Discovered Path
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5 font-label-code-md text-label-code-md">
                      {labResult.path?.map((nid: string, i: number) => (
                        <React.Fragment key={nid}>
                          <span className="px-2 py-0.5 rounded bg-surface-container-lowest font-bold text-primary">
                            {nid}
                          </span>
                          {i < labResult.path.length - 1 && <span className="text-outline">→</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  <div className="p-space-sm rounded-lg bg-surface-container-low font-label-code-sm text-xs flex flex-col gap-1">
                    <span className="font-bold text-on-surface">Exploration Order:</span>
                    <span className="text-on-surface-variant">{labResult.explored_order?.join(' → ')}</span>
                  </div>
                </div>
              )}

              {/* Lab 05 Minimax Render */}
              {currentLabId === 'lab_05' && labResult.tree && (
                <div className="flex flex-col gap-space-md">
                  <div className="p-space-md rounded-xl bg-primary-fixed/20 border border-primary/30 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
                        Optimal Minimax Decision
                      </span>
                      <span className="font-headline-sm text-headline-sm font-bold text-on-surface mt-1">
                        {labResult.best_decision}
                      </span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-primary text-on-primary font-label-code-md font-bold text-base">
                      Root Utility: {labResult.root_value}
                    </span>
                  </div>

                  {/* Decision Tree Steps */}
                  <div className="flex flex-col gap-1 font-label-code-sm text-xs bg-surface-container-low p-space-sm rounded-lg">
                    <span className="font-bold text-on-surface mb-1">Game Tree Resolution Trace:</span>
                    {labResult.trace?.map((t: string, i: number) => (
                      <div key={i} className="text-on-surface-variant leading-relaxed">{t}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lab 06 & 07 Fuzzy Controller & Comparison Render */}
              {(currentLabId === 'lab_06' || currentLabId === 'lab_07') && (
                <div className="flex flex-col gap-space-md">
                  {currentLabId === 'lab_06' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                      <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col items-center justify-center text-center">
                        <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
                          Crisp Revision Support Output
                        </span>
                        <span className="font-headline-xl text-headline-xl text-primary font-bold my-1">
                          {labResult.crisp_output}%
                        </span>
                        <span className="font-label-code-sm text-label-code-sm px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-bold">
                          {labResult.classification}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1 font-label-code-sm text-xs bg-surface-container-low p-space-sm rounded-xl">
                        <span className="font-bold text-on-surface">Active Rules Fired:</span>
                        {labResult.rules_fired?.map((r: any) => (
                          <div key={r.id} className="flex justify-between items-center py-0.5 border-b border-surface-container-high/60">
                            <span className="text-on-surface-variant">{r.antecedent}</span>
                            <span className="font-bold text-primary">w = {r.strength}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                      {/* Mamdani Box */}
                      <div className="p-space-md rounded-xl bg-surface-container-low border border-primary/30 flex flex-col gap-2">
                        <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
                          Mamdani Inference
                        </span>
                        <span className="font-headline-lg font-bold text-primary">
                          {labResult.mamdani?.crisp_output}%
                        </span>
                        <span className="font-body-sm text-xs text-on-surface-variant">
                          Defuzzification: {labResult.mamdani?.defuzzification_method}
                        </span>
                        <span className="font-label-code-sm text-xs font-semibold text-secondary">
                          {labResult.mamdani?.classification}
                        </span>
                      </div>

                      {/* Sugeno Box */}
                      <div className="p-space-md rounded-xl bg-surface-container-low border border-secondary/30 flex flex-col gap-2">
                        <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">
                          Takagi-Sugeno-Kang Inference
                        </span>
                        <span className="font-headline-lg font-bold text-secondary">
                          {labResult.sugeno?.crisp_output}%
                        </span>
                        <span className="font-body-sm text-xs text-on-surface-variant">
                          Defuzzification: {labResult.sugeno?.defuzzification_method}
                        </span>
                        <span className="font-label-code-sm text-xs font-semibold text-primary">
                          {labResult.sugeno?.classification}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Lab 08 Neuro-Fuzzy Render */}
              {currentLabId === 'lab_08' && (
                <div className="flex flex-col gap-space-md">
                  <div className="p-space-sm bg-tertiary-fixed/40 rounded-lg text-on-tertiary-fixed font-label-code-sm text-xs">
                    {labResult.disclosure}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                    <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                      <span className="font-label-caps text-[10px] uppercase text-outline">Neural Readiness</span>
                      <span className="font-headline-md font-bold text-primary">
                        {labResult.neural_component?.neural_readiness_score}%
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        Band: {labResult.neural_component?.linguistic_band}
                      </span>
                    </div>

                    <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                      <span className="font-label-caps text-[10px] uppercase text-outline">Fuzzy Calibration</span>
                      <span className="font-headline-md font-bold text-secondary">
                        {labResult.fuzzy_component?.rule_adjustment > 0 ? '+' : ''}{labResult.fuzzy_component?.rule_adjustment}%
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        {labResult.fuzzy_component?.status_category}
                      </span>
                    </div>

                    <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                      <span className="font-label-caps text-[10px] uppercase text-outline">Final Hybrid Index</span>
                      <span className="font-headline-md font-bold text-tertiary">
                        {labResult.final_hybrid_score}%
                      </span>
                      <span className="text-xs text-secondary font-semibold">Calibrated</span>
                    </div>
                  </div>

                  <div className="p-space-sm bg-surface-container rounded-lg font-body-sm text-body-sm font-semibold text-on-surface">
                    Recommendation: {labResult.recommendation}
                  </div>
                </div>
              )}

              {/* Lab 09 Supervised vs Unsupervised Render */}
              {currentLabId === 'lab_09' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                  <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-2">
                    <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
                      Supervised (Perceptron)
                    </span>
                    <span className="font-headline-sm font-bold text-on-surface">
                      {labResult.supervised?.predicted_category}
                    </span>
                    <span className="font-mono text-xs text-outline">
                      Boundary: {labResult.supervised?.decision_boundary}
                    </span>
                    <span className="font-label-code-sm text-xs text-secondary font-semibold">
                      Trained in {labResult.supervised?.epochs_trained} epochs with supervisor feedback
                    </span>
                  </div>

                  <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-2">
                    <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">
                      Unsupervised (Competitive Clustering)
                    </span>
                    <span className="font-headline-sm font-bold text-on-surface">
                      {labResult.unsupervised?.assigned_archetype}
                    </span>
                    <span className="font-body-sm text-xs text-on-surface-variant">
                      {labResult.unsupervised?.archetype_description}
                    </span>
                    <span className="font-label-code-sm text-xs text-primary font-semibold">
                      Closest Centroid Distance: {labResult.unsupervised?.winning_distance}
                    </span>
                  </div>
                </div>
              )}

              {/* Lab 10 N-Gram Render */}
              {currentLabId === 'lab_10' && (
                <div className="flex flex-col gap-space-md">
                  <div className="p-space-sm bg-surface-container-low rounded-lg font-mono text-xs flex flex-col gap-1">
                    <span className="text-outline">Top Next-Word Probability Predictions:</span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {labResult.next_word_predictions?.map((cand: any, i: number) => (
                        <div key={i} className="px-2 py-1 rounded bg-surface-container-lowest font-bold text-primary flex items-center gap-1 shadow-sm">
                          <span>{cand.word}</span>
                          <span className="text-[10px] text-outline">({Math.round(cand.probability * 100)}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-space-md rounded-xl bg-[#090d16] text-[#eef0ff] font-mono text-xs flex flex-col gap-1">
                    <span className="text-secondary-fixed font-bold">
                      Generated {labResult.model_selected?.toUpperCase()} Continuation:
                    </span>
                    <p className="text-sm font-serif leading-relaxed text-[#dad7ff] pt-1">
                      <span className="font-bold text-white">{labResult.continuation?.prompt} </span>
                      <span className="text-secondary-fixed">{labResult.continuation?.generated_continuation}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Plain-Language Conceptual Explanation Rail (4 cols) */}
            <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center gap-2 text-primary font-bold">
                <span className="material-symbols-outlined text-[20px]">menu_book</span>
                <span className="font-label-caps text-label-caps uppercase">Plain-Language Rationale</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                {labResult.explanation || activeMeta.summary}
              </p>

              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-1">
                <span className="font-label-caps text-[10px] uppercase text-outline font-bold">Key Insight</span>
                <p className="font-body-sm text-xs text-on-surface-variant leading-snug">
                  All calculations in this experiment were performed dynamically by local Python modules rather than static mocks.
                </p>
              </div>

              <button
                onClick={() => onNavigate('labs')}
                className="w-full py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold transition-colors flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>Return to Labs Catalog</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
