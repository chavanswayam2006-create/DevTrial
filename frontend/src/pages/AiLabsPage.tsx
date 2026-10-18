import React, { useState } from 'react';
import { ALL_LABS_METADATA } from '../data/curriculumData';

interface AiLabsPageProps {
  onNavigate: (path: string, param?: string) => void;
}

export const AiLabsPage: React.FC<AiLabsPageProps> = ({ onNavigate }) => {
  const [activeDomain, setActiveDomain] = useState<'all' | 'search' | 'logic' | 'fuzzy' | 'neural'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLabs = ALL_LABS_METADATA.filter(lab => {
    const matchesDomain = activeDomain === 'all' || lab.domain === activeDomain;
    const matchesSearch =
      lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.domain_label.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full">
      {/* Header Banner */}
      <section className="relative px-gutter py-space-xl overflow-hidden bg-surface-container-low border-b border-surface-container-high">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-secondary-container/40 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto flex flex-col gap-space-lg relative z-10">
          {/* Metadata Eyebrow & Status Strip */}
          <div className="flex flex-wrap items-center justify-between gap-space-sm">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-on-primary font-label-code-sm text-label-code-sm font-semibold">
                10
              </span>
              <span className="font-label-caps text-label-caps uppercase text-primary font-bold tracking-widest">
                Algorithmic Telemetry Suite
              </span>
              <span className="text-outline">/</span>
              <span className="font-label-code-sm text-label-code-sm text-on-surface-variant font-medium">
                Curriculum Routing Sandbox
              </span>
            </div>

            <div className="inline-flex items-center gap-space-sm px-space-md py-1.5 rounded-full bg-surface-container-lowest shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              <span className="font-label-code-sm text-label-code-sm text-on-surface font-semibold">
                10 Experiments Configured
              </span>
              <span className="text-outline-variant">•</span>
              <span className="font-label-code-sm text-label-code-sm text-secondary font-medium">
                All Fully Functional
              </span>
              <span className="text-outline-variant">•</span>
              <span className="font-label-code-sm text-label-code-sm text-primary font-medium">
                Local Python &amp; Web Engine
              </span>
            </div>
          </div>

          {/* Hero Typography & Sparkline */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-end">
            <div className="lg:col-span-8 flex flex-col gap-space-xs">
              <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
                DevTrail AI Labs:{' '}
                <span className="text-primary-container font-extrabold">Computational Learning Experiments</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl pt-space-xs leading-relaxed">
                Interactive simulations exploring the algorithmic engines behind personalized curriculum navigation, rule-based prerequisite enforcement, fuzzy skill assessment, and neural adaptation.
              </p>
            </div>

            {/* Telemetry Diagnostic Widget */}
            <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <div className="p-2.5 rounded-lg bg-surface-container text-primary">
                  <span className="material-symbols-outlined text-[24px]">network_node</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                    Heuristic Efficiency
                  </span>
                  <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    94.8% A* Fidelity
                  </span>
                </div>
              </div>
              <div className="w-20 h-10 flex items-center">
                <svg className="w-full h-full text-secondary" fill="none" viewBox="0 0 100 40">
                  <path
                    d="M0 35 L20 28 L40 32 L60 14 L80 18 L100 4"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                  ></path>
                  <path
                    d="M0 35 L20 28 L40 32 L60 14 L80 18 L100 4 V40 H0 Z"
                    fill="currentColor"
                    fillOpacity="0.12"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Filter Controls & Domain Switches */}
          <div className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-sm mt-space-xs">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                filter_list
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search experiments or domains..."
                className="w-full pl-9 pr-space-md py-2 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/25 transition-all"
              />
            </div>

            {/* Category Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {[
                { id: 'all', label: 'All 10 Experiments' },
                { id: 'search', label: 'Search & Pathfinding' },
                { id: 'logic', label: 'Logic & Knowledge' },
                { id: 'fuzzy', label: 'Fuzzy & Heuristics' },
                { id: 'neural', label: 'Neural & Language Models' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveDomain(f.id as any)}
                  className={`whitespace-nowrap px-space-sm py-1.5 rounded-lg font-label-code-sm text-label-code-sm font-semibold transition-all ${
                    activeDomain === f.id
                      ? 'bg-primary-container text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Laboratory Cards Grid */}
      <section className="max-w-7xl mx-auto w-full px-gutter py-space-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {filteredLabs.map(lab => (
            <article
              key={lab.id}
              onClick={() => onNavigate('lab_detail', lab.id)}
              className="group bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden cursor-pointer"
              style={{ minHeight: '380px' }}
            >
              <div className="flex flex-col gap-space-sm">
                <div className="flex items-center justify-between">
                  <span className="font-label-code-sm text-label-code-sm font-bold px-2 py-0.5 rounded bg-surface-container text-primary">
                    Lab {lab.number < 10 ? `0${lab.number}` : lab.number}
                  </span>
                  <span className="inline-flex items-center gap-1 font-label-code-sm text-label-code-sm px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Ready to Run
                  </span>
                </div>

                <div className="pt-space-xs">
                  <span className="font-label-caps text-label-caps uppercase text-secondary font-bold tracking-wider">
                    {lab.domain_label}
                  </span>
                  <h2 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors leading-snug mt-0.5 font-bold">
                    {lab.title}
                  </h2>
                </div>

                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  {lab.summary}
                </p>
              </div>

              <div className="flex flex-col gap-space-sm pt-space-md border-t border-surface-container-high/60">
                {/* Mini Formula / Syntax Banner */}
                <div className="p-2.5 rounded-lg bg-surface-container-low font-label-code-sm text-label-code-sm text-on-surface-variant font-mono truncate">
                  <span className="font-semibold text-primary">{lab.formula}</span>
                </div>

                <div className="flex items-center justify-between pt-space-xs">
                  <span className="font-label-code-sm text-label-code-sm text-outline">
                    Interactive Workbench
                  </span>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onNavigate('lab_detail', lab.id);
                    }}
                    className="inline-flex items-center gap-1.5 font-label-code-sm text-label-code-sm font-semibold text-on-primary bg-primary px-3.5 py-2 rounded-lg hover:bg-primary-container active:scale-95 transition-all shadow-sm"
                  >
                    <span>Open Lab</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
