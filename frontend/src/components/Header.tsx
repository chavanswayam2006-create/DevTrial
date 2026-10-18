import React, { useState } from 'react';
import { useStudent } from '../context/StudentContext';

interface HeaderProps {
  onSearch?: (query: string) => void;
  onNavigate: (path: string, param?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch, onNavigate }) => {
  const { studentState, backendConnected, refreshBackendStatus } = useStudent();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (onSearch) onSearch(val);
  };

  const bypassedCount = studentState.bypassed_nodes.length;

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 px-space-lg flex items-center justify-between">
      {/* Search Input */}
      <div className="flex items-center gap-space-md flex-1 max-w-lg">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search concepts, chapters, or AI labs..."
            className="w-full pl-9 pr-space-md py-1.5 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Right Strip: Diagnostic Indicator, Backend Health, Profile */}
      <div className="flex items-center gap-space-md">
        {/* Backend status pill */}
        <button
          onClick={refreshBackendStatus}
          title={backendConnected ? 'FastAPI Backend Online' : 'Click to retry connecting to FastAPI Backend (port 8000)'}
          className={`flex items-center gap-1.5 px-space-sm py-1 rounded-full font-label-code-sm text-label-code-sm font-medium transition-all ${
            backendConnected
              ? 'bg-secondary-container/40 text-on-secondary-container hover:bg-secondary-container/60'
              : 'bg-error-container/40 text-on-error-container hover:bg-error-container/60'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              backendConnected ? 'bg-secondary animate-pulse' : 'bg-error'
            }`}
          ></span>
          <span>{backendConnected ? 'Backend: 8000 OK' : 'Backend Offline'}</span>
        </button>

        {/* Diagnostic Mode status pill */}
        <div className="hidden md:flex items-center gap-1.5 px-space-sm py-1 bg-tertiary-fixed text-on-tertiary-fixed rounded-full font-label-code-sm text-label-code-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
          <span>Diagnostic Mode: Active — {bypassedCount} Skipped</span>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('progress')}
          className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-lg transition-colors"
          title="Curriculum Settings"
        >
          <span className="material-symbols-outlined text-[20px]">tune</span>
        </button>

        <div className="h-4 w-px bg-surface-container-high"></div>

        {/* User Profile */}
        <div 
          className="flex items-center gap-space-sm cursor-pointer"
          onClick={() => onNavigate('progress')}
        >
          <div className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-bold flex items-center justify-center text-sm shadow-sm ring-1 ring-primary/20">
            AR
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="font-body-sm text-body-sm font-semibold text-on-surface leading-tight">
              {studentState.student_name}
            </span>
            <span className="font-label-code-sm text-label-code-sm text-on-surface-variant leading-none">
              Track: {studentState.track}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
