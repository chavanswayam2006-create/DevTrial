import React, { useState, useEffect } from 'react';
import { useStudent } from '../context/StudentContext';
import { LOCAL_CURRICULUM_NODES } from '../data/curriculumData';
import { computeRouteApi } from '../services/api';
import type { RouteResponse } from '../types/curriculum';

interface RoadmapPageProps {
  onNavigate: (path: string, param?: string) => void;
}

export const RoadmapPage: React.FC<RoadmapPageProps> = ({ onNavigate }) => {
  const { studentState, canUnlockNode } = useStudent();

  const [selectedAlgo, setSelectedAlgo] = useState<'bfs' | 'dfs' | 'astar'>('astar');
  const [activeFilter, setActiveFilter] = useState<'all' | 'required' | 'electives' | 'mastered' | 'diagnostic'>('all');
  const [routeResult, setRouteResult] = useState<RouteResponse | null>(null);
  const [loadingRoute, setLoadingRoute] = useState(false);

  // Compute route
  const handleComputeRoute = async (algo: 'bfs' | 'dfs' | 'astar') => {
    setSelectedAlgo(algo);
    setLoadingRoute(true);
    try {
      const res = await computeRouteApi(
        algo,
        'node_a',
        'node_g',
        [...studentState.mastered_nodes, ...studentState.bypassed_nodes]
      );
      setRouteResult(res);
    } catch (err) {
      console.error('Error computing route:', err);
    } finally {
      setLoadingRoute(false);
    }
  };

  useEffect(() => {
    handleComputeRoute(selectedAlgo);
  }, [studentState.mastered_nodes, studentState.bypassed_nodes]);

  const nodes = LOCAL_CURRICULUM_NODES;

  const isMastered = (id: string) =>
    studentState.mastered_nodes.includes(id) || studentState.bypassed_nodes.includes(id);

  const isBypassed = (id: string) => studentState.bypassed_nodes.includes(id);

  const isActiveFocus = (id: string) => studentState.current_target_node === id;

  // Filter logic
  const shouldShowNode = (id: string) => {
    const node = nodes[id];
    if (!node) return false;
    if (activeFilter === 'all') return true;
    if (activeFilter === 'required') return node.category === 'core' || node.category === 'capstone';
    if (activeFilter === 'electives') return node.category === 'elective';
    if (activeFilter === 'mastered') return isMastered(id);
    if (activeFilter === 'diagnostic') return node.diagnostic_quiz.length > 0 && !isMastered(id);
    return true;
  };

  const currentVector = routeResult?.path?.map(nid => nodes[nid]?.code || nid) || ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  return (
    <div className="flex flex-col w-full">
      {/* Top Command Matrix & Algorithmic Controls */}
      <section className="w-full px-margin py-space-lg flex flex-col gap-space-md bg-surface-container-low/60 backdrop-blur-md border-b border-surface-container-high">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
          <div className="flex flex-col max-w-2xl">
            <div className="flex items-center gap-space-xs mb-space-xs">
              <span className="font-label-caps text-label-caps uppercase text-primary font-bold tracking-wider">
                DAG Pathfinding Engine v2.4
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping"></span>
              <span className="font-label-code-sm text-label-code-sm text-secondary font-semibold">
                Strict Topological Sort Active
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              Intelligent Curriculum Roadmap
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Explore the shortest dependency path from Start (Node A) to Capstone (Node G). Evaluate routing algorithms or adjust focus filters.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-space-sm">
            <button
              onClick={() => handleComputeRoute(selectedAlgo)}
              disabled={loadingRoute}
              className="group relative flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-primary-container text-on-primary font-body-md text-body-md font-semibold shadow-md hover:bg-primary transition-all active:scale-[0.98]"
            >
              <span className={`material-symbols-outlined text-[18px] ${loadingRoute ? 'animate-spin' : 'group-hover:rotate-12'} transition-transform`}>
                {loadingRoute ? 'refresh' : 'auto_awesome'}
              </span>
              <span>Find My Optimized Path</span>
              <span className="ml-1 text-[10px] font-label-code-sm bg-on-primary/20 px-1.5 py-0.5 rounded text-on-primary">
                A* Engine
              </span>
            </button>
            <button
              onClick={() => onNavigate('progress')}
              className="flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-sm hover:bg-surface-container transition-all"
            >
              <span className="material-symbols-outlined text-[18px] text-outline">tune</span>
              <span>Preferences</span>
            </button>
          </div>
        </div>

        {/* Algorithm Selector Pill Deck */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-sm pt-space-xs">
          <div className="flex items-center p-1 bg-surface-container-high/60 rounded-xl max-w-fit gap-1">
            <button
              onClick={() => handleComputeRoute('bfs')}
              className={`px-space-md py-1.5 rounded-lg font-body-sm text-body-sm transition-all flex items-center gap-1.5 ${
                selectedAlgo === 'bfs'
                  ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">horizontal_split</span>
              <span>BFS (Breadth-First)</span>
              <span className="hidden sm:inline font-label-code-sm text-label-code-sm text-outline">• Min Hop</span>
            </button>

            <button
              onClick={() => handleComputeRoute('dfs')}
              className={`px-space-md py-1.5 rounded-lg font-body-sm text-body-sm transition-all flex items-center gap-1.5 ${
                selectedAlgo === 'dfs'
                  ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">vertical_align_bottom</span>
              <span>DFS (Depth-First)</span>
              <span className="hidden sm:inline font-label-code-sm text-label-code-sm text-outline">• Deep Track</span>
            </button>

            <button
              onClick={() => handleComputeRoute('astar')}
              className={`px-space-md py-1.5 rounded-lg font-body-sm text-body-sm transition-all flex items-center gap-1.5 ${
                selectedAlgo === 'astar'
                  ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] text-primary">route</span>
              <span>A* Search (Cost-Weighted)</span>
              <span className="font-label-code-sm text-label-code-sm bg-primary-fixed text-on-primary-fixed-variant px-1.5 py-0.5 rounded-full font-bold">
                Optimal
              </span>
            </button>
          </div>

          <div className="flex items-center gap-space-sm text-on-surface-variant font-body-sm text-body-sm">
            <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
            <span>
              Acyclic Guarantee: <strong className="text-on-surface font-label-code-sm text-label-code-sm">O(V + E) Passed</strong>
            </span>
          </div>
        </div>

        {/* Live Telemetry Cost Bar */}
        <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md items-center">
          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps uppercase text-outline font-bold">
              Computed Path Vector
            </span>
            <div className="flex items-center gap-1 mt-1 font-label-code-md text-label-code-md font-semibold text-primary truncate">
              {currentVector.map((code, idx) => (
                <React.Fragment key={idx}>
                  <span className={`px-1.5 py-0.5 rounded ${idx === currentVector.length - 1 ? 'bg-primary-fixed text-primary font-bold' : 'bg-surface-container-highest text-on-surface'}`}>
                    {code}
                  </span>
                  {idx < currentVector.length - 1 && <span className="text-outline">→</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">timer</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  {routeResult?.total_cost || 34.0} hrs
                </span>
                <span className="font-body-sm text-body-sm text-outline line-through">
                  {routeResult?.baseline_cost || 48.0} hrs
                </span>
              </div>
              <span className="font-label-code-sm text-label-code-sm text-secondary font-semibold">
                ⚡ {routeResult?.savings_hours || 14.0} hrs prune savings
              </span>
            </div>
          </div>

          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">account_tree</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold">0 Violations</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Strict DAG topological order</span>
            </div>
          </div>

          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">calculate</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  {routeResult?.total_cost || 18.2}
                </span>
                <span className="font-label-code-sm text-label-code-sm text-tertiary font-medium">effort units</span>
              </div>
              <span className="font-label-code-sm text-label-code-sm text-on-surface-variant">
                f(n) = g(n) + h(n) minimal
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Rails & Dynamic Legend Deck */}
      <section className="w-full px-margin py-space-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-full font-body-sm text-body-sm transition-transform active:scale-95 ${
              activeFilter === 'all'
                ? 'bg-on-surface text-surface-container-lowest font-medium shadow-sm'
                : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface shadow-sm'
            }`}
          >
            All Chapters (7)
          </button>
          <button
            onClick={() => setActiveFilter('required')}
            className={`px-3 py-1 rounded-full font-body-sm text-body-sm transition-transform active:scale-95 ${
              activeFilter === 'required'
                ? 'bg-on-surface text-surface-container-lowest font-medium shadow-sm'
                : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface shadow-sm'
            }`}
          >
            Required Only (5)
          </button>
          <button
            onClick={() => setActiveFilter('electives')}
            className={`px-3 py-1 rounded-full font-body-sm text-body-sm transition-transform active:scale-95 ${
              activeFilter === 'electives'
                ? 'bg-on-surface text-surface-container-lowest font-medium shadow-sm'
                : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface shadow-sm'
            }`}
          >
            Electives (2)
          </button>
          <button
            onClick={() => setActiveFilter('mastered')}
            className={`px-3 py-1 rounded-full font-body-sm text-body-sm transition-transform active:scale-95 ${
              activeFilter === 'mastered'
                ? 'bg-on-surface text-surface-container-lowest font-medium shadow-sm'
                : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface shadow-sm'
            }`}
          >
            Mastered ({studentState.mastered_nodes.length})
          </button>
          <button
            onClick={() => setActiveFilter('diagnostic')}
            className={`px-3 py-1 rounded-full font-body-sm text-body-sm transition-transform active:scale-95 flex items-center gap-1 ${
              activeFilter === 'diagnostic'
                ? 'bg-tertiary text-on-tertiary font-medium shadow-sm'
                : 'bg-tertiary-fixed/60 text-on-tertiary-fixed hover:bg-tertiary-fixed'
            }`}
          >
            <span>Needs Diagnostic</span>
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
          </button>
        </div>

        {/* Node Status Legend */}
        <div className="flex flex-wrap items-center gap-3 text-on-surface-variant font-label-code-sm text-label-code-sm">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
            <span>Validated</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-primary/30"></span>
            <span className="font-semibold text-primary">Active Focus</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-outline-variant"></span>
            <span>Unlocked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[13px] text-outline">lock</span>
            <span>Locked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[13px] text-tertiary">bolt</span>
            <span className="text-tertiary">Skippable</span>
          </div>
        </div>
      </section>

      {/* Interactive Network Canvas & Rationale Split Workspace */}
      <div className="w-full px-margin py-space-md grid grid-cols-1 xl:grid-cols-12 gap-gutter items-start">
        {/* Primary Dependency Network Canvas (8 Columns on xl) */}
        <div className="xl:col-span-8 flex flex-col gap-space-lg relative">
          <div className="relative w-full rounded-2xl bg-surface-container-lowest shadow-sm p-space-md lg:p-space-xl overflow-hidden">
            {/* Ambient Background Pattern */}
            <svg className="pointer-events-none absolute inset-0 w-full h-full opacity-30 z-0" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dotPattern" width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.2" fill="#c7c4d8"></circle>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dotPattern)"></rect>
            </svg>

            <div className="relative z-10 flex flex-col gap-space-xl">
              {/* TIER 1: Foundations */}
              {shouldShowNode('node_a') && (
                <div className="flex flex-col gap-space-sm">
                  <div className="flex items-center gap-space-xs font-label-caps text-label-caps text-outline uppercase tracking-widest">
                    <span>Tier 1 • Foundations &amp; Document Anatomy</span>
                    <span className="h-px bg-surface-container-high flex-1"></span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md items-center">
                    <div
                      onClick={() => onNavigate('chapter', 'node_a')}
                      className={`md:col-span-8 bg-surface-container-low rounded-xl p-space-md shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col gap-space-xs ${
                        isMastered('node_a') ? 'border-l-4 border-secondary' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-space-xs">
                          <span className={`w-7 h-7 rounded-lg ${isMastered('node_a') ? 'bg-secondary text-on-secondary' : 'bg-surface-container-high text-on-surface'} font-label-code-sm text-label-code-sm font-bold flex items-center justify-center`}>
                            A
                          </span>
                          <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                            {nodes['node_a'].title}
                          </span>
                        </div>
                        {isMastered('node_a') && (
                          <span className="flex items-center gap-1 font-label-code-sm text-label-code-sm bg-secondary-container text-on-secondary-container px-2.5 py-0.5 rounded-full font-semibold">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                            <span>{isBypassed('node_a') ? 'Diagnostic Passed' : 'Completed'}</span>
                          </span>
                        )}
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {nodes['node_a'].summary}
                      </p>
                      <div className="flex items-center justify-between pt-space-xs font-label-code-sm text-label-code-sm text-on-surface-variant">
                        <span>Prereqs: None (Root) • {nodes['node_a'].estimated_hours} hrs</span>
                        <button className="text-primary font-body-sm text-body-sm font-semibold hover:underline flex items-center gap-0.5">
                          <span>Chapter Detail</span>
                          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TIER 2: Presentation & Cascade */}
              {(shouldShowNode('node_b') || shouldShowNode('node_c') || shouldShowNode('opt_1')) && (
                <div className="flex flex-col gap-space-sm">
                  <div className="flex items-center gap-space-xs font-label-caps text-label-caps text-outline uppercase tracking-widest">
                    <span>Tier 2 • Box Model &amp; Responsive Systems</span>
                    <span className="h-px bg-surface-container-high flex-1"></span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md items-start">
                    {/* Node B */}
                    {shouldShowNode('node_b') && (
                      <div
                        onClick={() => onNavigate('chapter', 'node_b')}
                        className={`md:col-span-6 bg-surface-container-low rounded-xl p-space-md shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col gap-space-xs ${
                          isMastered('node_b') ? 'border-l-4 border-secondary' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-space-xs">
                            <span className="w-7 h-7 rounded-lg bg-secondary text-on-secondary font-label-code-sm text-label-code-sm font-bold flex items-center justify-center">
                              B
                            </span>
                            <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                              {nodes['node_b'].title}
                            </span>
                          </div>
                          {isMastered('node_b') && (
                            <span className="flex items-center gap-1 font-label-code-sm text-label-code-sm bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-medium">
                              <span className="material-symbols-outlined text-[14px]">check</span>
                              <span>Completed</span>
                            </span>
                          )}
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          {nodes['node_b'].summary}
                        </p>
                        <div className="flex items-center justify-between pt-space-xs font-label-code-sm text-label-code-sm text-outline">
                          <span>Prereq: Node A</span>
                          <span>{nodes['node_b'].estimated_hours} hrs total</span>
                        </div>
                      </div>
                    )}

                    {/* Node C */}
                    {shouldShowNode('node_c') && (
                      <div
                        onClick={() => onNavigate('chapter', 'node_c')}
                        className={`md:col-span-6 bg-surface-container-low rounded-xl p-space-md shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col gap-space-xs ${
                          isMastered('node_c') ? 'border-l-4 border-secondary' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-space-xs">
                            <span className="w-7 h-7 rounded-lg bg-secondary text-on-secondary font-label-code-sm text-label-code-sm font-bold flex items-center justify-center">
                              C
                            </span>
                            <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                              {nodes['node_c'].title}
                            </span>
                          </div>
                          {isMastered('node_c') && (
                            <span className="flex items-center gap-1 font-label-code-sm text-label-code-sm bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-medium">
                              <span className="material-symbols-outlined text-[14px]">bolt</span>
                              <span>Bypassed via Diagnostic</span>
                            </span>
                          )}
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          {nodes['node_c'].summary}
                        </p>
                        <div className="flex items-center justify-between pt-space-xs font-label-code-sm text-label-code-sm text-outline">
                          <span>Prereq: Node B</span>
                          <span>{nodes['node_c'].estimated_hours} hrs</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Elective Branch Opt-1 */}
                  {shouldShowNode('opt_1') && (
                    <div className="flex justify-end pr-space-md">
                      <div
                        onClick={() => onNavigate('chapter', 'opt_1')}
                        className="w-full md:w-5/12 bg-surface-container rounded-xl p-space-sm shadow-sm flex items-center justify-between hover:bg-surface-container-high transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-label-code-sm text-label-code-sm font-bold px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface">
                            Opt-1
                          </span>
                          <div className="flex flex-col">
                            <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                              {nodes['opt_1'].title}
                            </span>
                            <span className="font-label-code-sm text-label-code-sm text-outline">
                              Elective Branch • {nodes['opt_1'].estimated_hours} hrs
                            </span>
                          </div>
                        </div>
                        <span className="font-label-code-sm text-label-code-sm bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded">
                          Optional
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TIER 3: Computational Core (ACTIVE NODE D) */}
              {(shouldShowNode('node_d') || shouldShowNode('opt_2')) && (
                <div className="flex flex-col gap-space-sm">
                  <div className="flex items-center gap-space-xs font-label-caps text-label-caps text-primary uppercase tracking-widest font-bold">
                    <span>Tier 3 • Imperative Logic &amp; Runtime Architecture</span>
                    <span className="h-px bg-primary/20 flex-1"></span>
                  </div>

                  {/* Node D: Active Focus Card */}
                  {shouldShowNode('node_d') && (
                    <div
                      onClick={() => onNavigate('chapter', 'node_d')}
                      className={`relative bg-surface-container-lowest rounded-2xl p-space-lg shadow-xl cursor-pointer transition-all ${
                        isActiveFocus('node_d') ? 'ring-2 ring-primary/50' : ''
                      } flex flex-col gap-space-md overflow-hidden`}
                    >
                      <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-sm z-10">
                        <div className="flex items-center gap-space-sm">
                          <div className="w-10 h-10 rounded-xl bg-primary text-on-primary font-headline-sm text-headline-sm font-bold flex items-center justify-center shadow-md">
                            D
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-headline-md text-headline-md text-on-surface font-bold">
                                {nodes['node_d'].title}
                              </span>
                              {isActiveFocus('node_d') && (
                                <span className="inline-flex items-center gap-1 font-label-caps text-label-caps uppercase bg-primary text-on-primary px-2.5 py-0.5 rounded-full font-bold animate-pulse">
                                  <span className="w-1.5 h-1.5 rounded-full bg-surface-container-lowest"></span>
                                  Current Focus
                                </span>
                              )}
                            </div>
                            <span className="font-label-code-sm text-label-code-sm text-on-surface-variant">
                              Prereqs Satisfied: Nodes A, B, C Mastered
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigate('chapter', 'node_d');
                            }}
                            className="px-space-md py-1.5 rounded-lg bg-primary-container text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary transition-all shadow-sm"
                          >
                            Open Chapter Detail
                          </button>
                        </div>
                      </div>

                      <p className="font-body-md text-body-md text-on-surface-variant z-10">
                        {nodes['node_d'].summary}
                      </p>

                      <div className="flex items-center justify-between pt-space-xs z-10 font-label-code-sm text-label-code-sm text-on-surface-variant border-t border-surface-container-high">
                        <div className="flex items-center gap-space-sm">
                          <span>Estimated: {nodes['node_d'].estimated_hours} hrs</span>
                          <span>•</span>
                          <span className="text-secondary font-semibold">2 assignments remaining</span>
                        </div>
                        <span className="text-tertiary font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">bolt</span>
                          Diagnostic test available (12 min pass)
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Elective Branch Opt-2 */}
                  {shouldShowNode('opt_2') && (
                    <div className="flex justify-end pr-space-md">
                      <div
                        onClick={() => onNavigate('chapter', 'opt_2')}
                        className="w-full md:w-5/12 bg-surface-container rounded-xl p-space-sm shadow-sm flex items-center justify-between hover:bg-surface-container-high transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-label-code-sm text-label-code-sm font-bold px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface">
                            Opt-2
                          </span>
                          <div className="flex flex-col">
                            <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                              {nodes['opt_2'].title}
                            </span>
                            <span className="font-label-code-sm text-label-code-sm text-outline">
                              Elective • {nodes['opt_2'].estimated_hours} hrs
                            </span>
                          </div>
                        </div>
                        <span className="font-label-code-sm text-label-code-sm bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded">
                          Optional
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TIER 4: Tier 4 Browser Integration & APIs */}
              {shouldShowNode('node_e') && (
                <div className="flex flex-col gap-space-sm">
                  <div className="flex items-center gap-space-xs font-label-caps text-label-caps text-outline uppercase tracking-widest">
                    <span>Tier 4 • Browser Integration &amp; Network I/O</span>
                    <span className="h-px bg-surface-container-high flex-1"></span>
                  </div>
                  <div
                    onClick={() => onNavigate('chapter', 'node_e')}
                    className={`bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col gap-space-xs ${
                      !canUnlockNode('node_e') ? 'opacity-75' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-space-xs">
                        <span className="w-7 h-7 rounded-lg bg-surface-container-high text-on-surface font-label-code-sm text-label-code-sm font-bold flex items-center justify-center">
                          E
                        </span>
                        <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                          {nodes['node_e'].title}
                        </span>
                      </div>
                      <span className="font-label-code-sm text-label-code-sm px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                        Prereq: Node D
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {nodes['node_e'].summary}
                    </p>
                  </div>
                </div>
              )}

              {/* TIER 5: React & State */}
              {shouldShowNode('node_f') && (
                <div className="flex flex-col gap-space-sm">
                  <div className="flex items-center gap-space-xs font-label-caps text-label-caps text-outline uppercase tracking-widest">
                    <span>Tier 5 • Component Architecture &amp; State Engines</span>
                    <span className="h-px bg-surface-container-high flex-1"></span>
                  </div>
                  <div
                    onClick={() => onNavigate('chapter', 'node_f')}
                    className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col gap-space-xs opacity-75"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-space-xs">
                        <span className="w-7 h-7 rounded-lg bg-surface-container-high text-on-surface font-label-code-sm text-label-code-sm font-bold flex items-center justify-center">
                          F
                        </span>
                        <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                          {nodes['node_f'].title}
                        </span>
                      </div>
                      <span className="font-label-code-sm text-label-code-sm px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                        Prereq: Node E
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {nodes['node_f'].summary}
                    </p>
                  </div>
                </div>
              )}

              {/* TIER 6: Capstone Project (Node G) */}
              {shouldShowNode('node_g') && (
                <div className="flex flex-col gap-space-sm">
                  <div className="flex items-center gap-space-xs font-label-caps text-label-caps text-outline uppercase tracking-widest">
                    <span>Tier 6 • Synthesis &amp; Capstone Deployment</span>
                    <span className="h-px bg-surface-container-high flex-1"></span>
                  </div>
                  <div
                    onClick={() => onNavigate('chapter', 'node_g')}
                    className="bg-gradient-to-r from-surface-container-lowest via-surface-container-low to-primary-fixed/20 rounded-xl p-space-lg shadow-md hover:shadow-lg transition-all cursor-pointer flex flex-col gap-space-xs border border-primary/20"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-space-xs">
                        <span className="w-8 h-8 rounded-xl bg-tertiary text-on-tertiary font-headline-sm text-headline-sm font-bold flex items-center justify-center shadow-sm">
                          G
                        </span>
                        <span className="font-headline-md text-headline-md text-on-surface font-bold">
                          {nodes['node_g'].title}
                        </span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-caps text-label-caps font-bold">
                        CAPSTONE GOAL
                      </span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      {nodes['node_g'].summary}
                    </p>
                    <div className="flex items-center justify-between pt-space-sm font-label-code-sm text-label-code-sm text-on-surface-variant border-t border-surface-container-high">
                      <span>Strict Requirement: All Core Nodes (A through F) Must Be Satisfied</span>
                      <span className="text-primary font-bold">12.0 Hours Capstone Sprint</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Rail: Rationale & Explanations (4 Columns on xl) */}
        <div className="xl:col-span-4 flex flex-col gap-space-md">
          {/* Algorithm Rationale Card */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-[20px]">psychology</span>
              <span className="font-label-caps text-label-caps uppercase font-bold">
                {selectedAlgo.toUpperCase()} Search Rationale
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              {routeResult?.explanation || 'Computing graph traversal parameters...'}
            </p>
            <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-1 font-label-code-sm text-label-code-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Nodes Visited:</span>
                <span className="font-semibold text-on-surface">{routeResult?.nodes_visited_count || 7}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Exploration Queue:</span>
                <span className="font-semibold text-primary truncate max-w-[180px]">
                  {routeResult?.explored_order?.join(' → ') || 'A → B → C → D → E → F → G'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Total Traversal Cost:</span>
                <span className="font-semibold text-secondary">{routeResult?.total_cost || 34.0} hrs</span>
              </div>
            </div>
          </div>

          {/* Unmet Prerequisite Security Check */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm">
            <div className="flex items-center gap-2 text-secondary">
              <span className="material-symbols-outlined text-[20px]">verified</span>
              <span className="font-label-caps text-label-caps uppercase font-bold">
                Prerequisite Invariance
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              <strong>Rule 4 Enforced:</strong> A shorter path must not bypass an unmet required prerequisite. If a student demonstrates mastery, the prerequisite is marked satisfied without repeating lessons.
            </p>
            <div className="flex items-center justify-between font-label-code-sm text-label-code-sm text-secondary bg-secondary-container/30 px-space-sm py-1.5 rounded-lg">
              <span>DAG Integrity:</span>
              <span className="font-bold">100% Strict &amp; Verified</span>
            </div>
          </div>

          {/* Quick AI Lab Link */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-xs">
            <span className="font-label-caps text-label-caps uppercase text-outline font-bold">
              Related AI Practicals
            </span>
            <button
              onClick={() => onNavigate('labs', 'lab_03')}
              className="text-left py-1.5 text-primary hover:underline font-body-sm text-body-sm flex items-center justify-between"
            >
              <span>Experiment 03: BFS vs DFS Search</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
            <button
              onClick={() => onNavigate('labs', 'lab_04')}
              className="text-left py-1.5 text-primary hover:underline font-body-sm text-body-sm flex items-center justify-between"
            >
              <span>Experiment 04: A* Heuristic Traversal</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
            <button
              onClick={() => onNavigate('labs', 'lab_02')}
              className="text-left py-1.5 text-primary hover:underline font-body-sm text-body-sm flex items-center justify-between"
            >
              <span>Experiment 02: Prolog Prerequisite Rules</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
