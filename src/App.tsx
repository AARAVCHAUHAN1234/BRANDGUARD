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
    <div className="min-h-screen bg-[#F7F6F2] text-[#171717] flex flex-col font-sans">
      <Header currentView={currentView} onNavigate={setCurrentView} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar currentView={currentView} onNavigate={setCurrentView} />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-57px)]">
          <div className="max-w-7xl mx-auto">
            {renderCurrentView()}

            <footer className="mt-16 pt-8 pb-10 border-t border-[#D8D5CE] text-xs text-[#73716B] flex flex-col sm:flex-row items-baseline justify-between gap-4 font-sans">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-serif italic text-base text-[#171717]">BrandGuard</span>
                  <span className="text-[#D8D5CE]">—</span>
                  <span className="text-[11px] uppercase tracking-widest text-[#73716B]">Evidence Control Layer</span>
                </div>
                <p className="text-[11px] text-[#73716B]">
                  Every content decision backed by determinism, provenance, and human accountability.
                </p>
              </div>

              <div className="text-[11px] text-[#73716B] text-right font-mono">
                <span>VOL. 26 // ED. 04</span>
                <span className="mx-2 text-[#D8D5CE]">|</span>
                <span>SYSTEM ACTIVE</span>
              </div>
            </footer>
          </div>
        </main>
      </div>

      {/* Editorial Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#171717] text-[#F7F6F2] px-4 py-3 border border-[#171717] shadow-lg flex items-center gap-3 text-xs tracking-tight animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="w-1.5 h-1.5 bg-[#9B382B] shrink-0" />
          <span className="font-sans font-medium">{toastMessage}</span>
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
