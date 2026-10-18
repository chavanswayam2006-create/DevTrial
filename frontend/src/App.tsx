import { useState } from 'react';
import { StudentProvider } from './context/StudentContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardPage } from './pages/DashboardPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { ChapterDetailPage } from './pages/ChapterDetailPage';
import { AiLabsPage } from './pages/AiLabsPage';
import { LabDetailPage } from './pages/LabDetailPage';
import { ProgressSettingsPage } from './pages/ProgressSettingsPage';

export function AppContent() {
  const [currentPath, setCurrentPath] = useState<string>('dashboard');
  const [currentParam, setCurrentParam] = useState<string | undefined>(undefined);

  const handleNavigate = (path: string, param?: string) => {
    setCurrentPath(path);
    setCurrentParam(param);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    if (query.toLowerCase().includes('lab') || query.toLowerCase().includes('experiment') || query.toLowerCase().includes('search')) {
      handleNavigate('labs');
    }
  };

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex">
      {/* Fixed Left Sidebar matching Stitch Export */}
      <Sidebar currentPath={currentPath} onNavigate={handleNavigate} />

      {/* Main Container Offset by 72 (w-72 = 18rem = 288px) */}
      <div className="pl-72 flex flex-col min-h-screen w-full">
        {/* Fixed Top Header */}
        <Header onSearch={handleSearch} onNavigate={handleNavigate} />

        {/* Content View with 16pt top padding to clear header */}
        <main className="w-full pt-16 bg-surface flex-1">
          {currentPath === 'dashboard' && <DashboardPage onNavigate={handleNavigate} />}
          {currentPath === 'roadmap' && <RoadmapPage onNavigate={handleNavigate} />}
          {currentPath === 'chapter' && (
            <ChapterDetailPage nodeId={currentParam || 'node_d'} onNavigate={handleNavigate} />
          )}
          {currentPath === 'labs' && <AiLabsPage onNavigate={handleNavigate} />}
          {currentPath === 'lab_detail' && (
            <LabDetailPage labId={currentParam || 'lab_01'} onNavigate={handleNavigate} />
          )}
          {currentPath === 'progress' && <ProgressSettingsPage onNavigate={handleNavigate} />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <StudentProvider>
      <AppContent />
    </StudentProvider>
  );
}
