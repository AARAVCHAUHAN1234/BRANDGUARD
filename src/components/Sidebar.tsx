import React from 'react';
import { useBrand } from '../context/BrandContext';
import {
  LayoutDashboard,
  ShieldAlert,
  FileEdit,
  Database,
  History,
  BarChart3,
  Compass,
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const { submissions, activeSubmission, facts } = useBrand();

  const unresolvedFindingsCount = activeSubmission
    ? activeSubmission.findings.filter(
        (f) => !f.humanDecision || f.humanDecision.status === 'open' || f.humanDecision.status === 'disputed'
      ).length
    : 0;

  const expiredSourcesCount = facts.filter((f) => f.status === 'Expired').length;
  const inReviewCount = submissions.filter((s) => s.status === 'In review' || s.status === 'Reopened').length;

  const navItems = [
    {
      id: 'dashboard',
      index: '01',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: inReviewCount > 0 ? `${inReviewCount} pending` : undefined,
    },
    {
      id: 'workspace',
      index: '02',
      label: 'Review Workspace',
      icon: ShieldAlert,
      badge: unresolvedFindingsCount > 0 ? `${unresolvedFindingsCount} flags` : 'Clean',
      badgeAlert: unresolvedFindingsCount > 0,
    },
    {
      id: 'submit',
      index: '03',
      label: 'Submit Content',
      icon: FileEdit,
    },
    {
      id: 'knowledge',
      index: '04',
      label: 'Brand Knowledge Base',
      icon: Database,
      badge: expiredSourcesCount > 0 ? `${expiredSourcesCount} expired` : undefined,
      badgeAlert: expiredSourcesCount > 0,
    },
    {
      id: 'approvals',
      index: '05',
      label: 'Approvals & Audit',
      icon: History,
    },
    {
      id: 'insights',
      index: '06',
      label: 'Governance Insights',
      icon: BarChart3,
    },
    {
      id: 'roadmap',
      index: '07',
      label: 'Charter & Principles',
      icon: Compass,
    },
  ];

  return (
    <aside className="w-64 bg-[#FFFFFF] border-r border-[#D8D5CE] flex flex-col justify-between shrink-0 min-h-[calc(100vh-57px)]">
      <div className="p-4 space-y-6">
        {/* Active Context Dossier */}
        <div className="border border-[#D8D5CE] bg-[#F7F6F2] p-3.5 space-y-2">
          <div className="flex items-center justify-between border-b border-[#D8D5CE] pb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#73716B]">ACTIVE DOSSIER</span>
            <span className="w-1.5 h-1.5 bg-[#2D5A38]" title="Context Active" />
          </div>

          <div>
            <div className="text-xs font-semibold text-[#171717] tracking-tight truncate">
              {activeSubmission ? activeSubmission.title : 'No active draft'}
            </div>
            {activeSubmission && (
              <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono text-[#73716B] uppercase tracking-wide">
                <span>{activeSubmission.channel}</span>
                <span className="text-[#D8D5CE]">/</span>
                <span>{activeSubmission.market}</span>
                <span className="text-[#D8D5CE]">/</span>
                <span
                  className={
                    activeSubmission.status === 'Approved'
                      ? 'text-[#2D5A38] font-semibold'
                      : activeSubmission.status === 'Reopened'
                      ? 'text-[#9B382B] font-semibold'
                      : 'text-[#171717]'
                  }
                >
                  {activeSubmission.status}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation list */}
        <div>
          <div className="px-2 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#73716B]">
              INDEX // DIRECTORY
            </span>
          </div>

          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors text-left ${
                    isActive
                      ? 'bg-[#171717] text-[#F7F6F2] font-medium'
                      : 'text-[#5C5B57] hover:text-[#171717] hover:bg-[#F7F6F2]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-mono ${
                        isActive ? 'text-[#9B382B]' : 'text-[#73716B]'
                      }`}
                    >
                      {item.index}
                    </span>
                    <span className="tracking-tight">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono uppercase tracking-wide ${
                        isActive
                          ? 'text-[#D8D5CE]'
                          : item.badgeAlert
                          ? 'text-[#9B382B]'
                          : 'text-[#73716B]'
                      }`}
                    >
                      [{item.badge}]
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Info & Protocol Stamp */}
      <div className="p-4 border-t border-[#D8D5CE] space-y-1 bg-[#F7F6F2]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#171717]" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#171717]">
            DETERMINISTIC GUARD
          </span>
        </div>
        <p className="text-[11px] text-[#73716B] leading-relaxed">
          Versioned source provenance required. Human signoff is mandatory before release.
        </p>
      </div>
    </aside>
  );
};