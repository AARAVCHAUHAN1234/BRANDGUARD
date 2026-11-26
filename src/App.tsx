import React, { useState } from 'react';
import { BrandProvider, useBrand } from './context/BrandContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { GuidedDemoModal } from './components/GuidedDemoModal';
import { DashboardView } from './views/DashboardView';
import { ReviewWorkspaceView } from './views/ReviewWorkspaceView';
import { SubmitView } from './views/SubmitView';
import { KnowledgeBaseView } from './views/KnowledgeBaseView';
import { ApprovalsAuditView } from './views/ApprovalsAuditView';
import { GovernanceInsightsView } from './views/GovernanceInsightsView';
import { RoadmapResponsibleView } from './views/RoadmapResponsibleView';
import { Info } from 'lucide-react';

const MainLayout: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const { toastMessage } = useBrand();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView onNavigate={setCurrentView} />;
      case 'workspace':
        return <ReviewWorkspaceView onNavigate={setCurrentView} />;
      case 'submit':
        return <SubmitView onNavigate={setCurrentView} />;
      case 'knowledge':
        return <KnowledgeBaseView />;
      case 'approvals':
        return <ApprovalsAuditView onNavigate={setCurrentView} />;
      case 'insights':
        return <GovernanceInsightsView />;
      case 'roadmap':
        return <RoadmapResponsibleView />;
      default:
        return <DashboardView onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex flex-col font-sans text-[#171717] selection:bg-[#171717] selection:text-[#F7F6F2]">
      <Header currentView={currentView} onNavigate={setCurrentView} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar currentView={currentView} onNavigate={setCurrentView} />

        <main className="flex-1 p-6 lg:p-10 overflow-y-auto max-h-[calc(100vh-81px)]">
          {renderCurrentView()}

          <footer className="mt-16 pt-8 pb-6 border-t border-[#D8D5CE] text-center text-xs font-mono text-[#73716B] space-y-1.5">
            <p className="text-[#171717] uppercase tracking-widest text-[10px]">
              BrandGuard AI — Every content decision. Backed by evidence.
            </p>
            <p className="text-[11px] text-[#73716B]">
              Deterministic Rules Engine • Immutable Version-Bound Approvals • Multimodal Intake • Drift Crawler
            </p>
          </footer>
        </main>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#171717] text-[#F7F6F2] px-5 py-3 border border-[#171717] flex items-center gap-3 text-xs font-mono">
          <Info className="w-3.5 h-3.5 text-[#9B382B] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Guided Demo Interactive Overlay */}
      <GuidedDemoModal onNavigate={setCurrentView} />
    </div>
  );
};

export default function App() {
  return (
    <BrandProvider>
      <MainLayout />
    </BrandProvider>
  );
}
