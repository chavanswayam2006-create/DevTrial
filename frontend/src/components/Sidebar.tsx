import React from 'react';
import { useStudent } from '../context/StudentContext';
import { LOCAL_CURRICULUM_NODES } from '../data/curriculumData';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string, param?: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate }) => {
  const { studentState, overallMasteryPercent } = useStudent();

  const targetNode = LOCAL_CURRICULUM_NODES[studentState.current_target_node] || LOCAL_CURRICULUM_NODES['node_d'];

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'roadmap', label: 'Learning Roadmap', icon: 'alt_route' },
    { id: 'chapter', label: 'Chapter Detail', icon: 'code_blocks' },
    { id: 'labs', label: 'AI Labs', icon: 'smart_toy', badge: '10 Labs' },
    { id: 'progress', label: 'My Progress & Settings', icon: 'tune' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between p-space-md">
      <div className="flex flex-col gap-space-md">
        {/* Brand Logo & Title */}
        <div 
          className="flex items-center gap-space-sm px-space-xs pt-space-xs cursor-pointer"
          onClick={() => onNavigate('dashboard')}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-primary-container text-on-primary flex items-center justify-center font-bold text-lg shadow-sm">
            <span className="material-symbols-outlined text-[22px]">route</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm tracking-tight text-on-surface leading-none font-bold">
              DevTrail AI
            </span>
            <span className="font-label-caps text-label-caps uppercase text-secondary font-bold tracking-wider mt-1">
              Curriculum Navigator
            </span>
          </div>
        </div>

        <div className="h-px bg-surface-container-high w-full my-space-xs"></div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-space-xs">
          {navItems.map((item) => {
            const isActive = currentPath === item.id || (item.id === 'labs' && currentPath.startsWith('lab_detail'));
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center justify-between px-space-md py-space-sm rounded-lg transition-all text-left ${
                  isActive
                    ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span className="font-body-md text-body-md">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`font-label-code-sm text-label-code-sm px-space-xs py-0.5 rounded-full font-medium ${
                      isActive
                        ? 'bg-on-primary/20 text-on-primary'
                        : 'bg-secondary-container text-on-secondary-container'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Target Tracker Card */}
      <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-sm shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between">
          <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
            Current Target
          </span>
          <span className="font-label-code-sm text-label-code-sm font-semibold text-primary">
            {overallMasteryPercent}%
          </span>
        </div>
        <div className="font-body-sm text-body-sm font-semibold text-on-surface truncate">
          Node G: Capstone Project
        </div>
        <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-primary h-full rounded-full transition-all duration-500"
            style={{ width: `${overallMasteryPercent}%` }}
          ></div>
        </div>
        <button
          onClick={() => onNavigate('chapter', targetNode.id)}
          className="mt-space-xs flex items-center justify-between font-label-code-sm text-label-code-sm text-primary hover:text-on-primary-fixed-variant transition-colors group text-left"
        >
          <span className="truncate">Resume {targetNode.code}: {targetNode.title}</span>
          <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </aside>
  );
};
