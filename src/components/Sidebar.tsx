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
  FileCheck2,
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
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: inReviewCount > 0 ? `${inReviewCount} pending` : undefined,
      badgeColor: 'bg-[#F7F2E8] text-[#8C6228] border border-[#8C6228]/40',
    },
    {
      id: 'workspace',
      label: 'Review Workspace',
      icon: ShieldAlert,
      badge: unresolvedFindingsCount > 0 ? `${unresolvedFindingsCount} open` : 'Clean',
      badgeColor:
        unresolvedFindingsCount > 0
          ? 'bg-[#F6ECEB] text-[#9B382B] border border-[#9B382B]/40'
          : 'bg-[#EEF4EF] text-[#2D5A38] border border-[#2D5A38]/40',
    },
    {
      id: 'submit',
      label: 'Submit Content',
      icon: FileEdit,
    },
    {
      id: 'knowledge',
      label: 'Brand Knowledge Base',
      icon: Database,
      badge: expiredSourcesCount > 0 ? `${expiredSourcesCount} expired` : undefined,
      badgeColor: 'bg-[#F6ECEB] text-[#9B382B] border border-[#9B382B]/40',
    },
    {
      id: 'approvals',
      label: 'Approvals & Audit',
      icon: History,
    },
    {
      id: 'insights',
      label: 'Governance Insights',
      icon: BarChart3,
    },
    {
      id: 'roadmap',
      label: 'Roadmap & Principles',
      icon: Compass,
    },
  ];

  return (
    <aside className="w-72 bg-[#FFFFFF] border-r border-[#D8D5CE] flex flex-col justify-between shrink-0 min-h-[calc(100vh-73px)] select-none">
      <div className="py-6 px-4 space-y-6">
        {/* Active Context Dossier */}
        <div
          onClick={() => onNavigate('workspace')}
          className="p-4 bg-[#F7F6F2] hover:bg-[#EAE6DB]/60 border border-[#D8D5CE] space-y-2.5 cursor-pointer transition-colors group"
          title="Click to open this draft in Review Workspace"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#2D5A38]" />
              <span className="text-[10px] font-mono text-[#171717] uppercase tracking-widest">
                Nimbus Analytics
              </span>
            </div>
            <span className="text-[10px] font-mono uppercase bg-[#171717] text-[#F7F6F2] px-1.5 py-0.5">
              Enterprise
            </span>
          </div>

          <p className="font-serif text-base text-[#171717] line-clamp-1 leading-snug">
            {activeSubmission ? activeSubmission.title : 'No active draft'}
          </p>

          {activeSubmission && (
            <div className="flex items-center justify-between text-[11px] font-mono text-[#73716B] pt-2 border-t border-[#D8D5CE]">
              <div className="flex items-center gap-1.5">
                <span>{activeSubmission.channel}</span>
                <span>•</span>
                <span>{activeSubmission.market}</span>
              </div>
              <span
                className={`px-1.5 py-0.5 text-[10px] uppercase border ${
                  activeSubmission.status === 'Approved'
                    ? 'bg-[#EEF4EF] text-[#2D5A38] border-[#2D5A38]/40'
                    : activeSubmission.status === 'Reopened'
                    ? 'bg-[#F6ECEB] text-[#9B382B] border-[#9B382B]/40'
                    : 'bg-[#FFFFFF] text-[#171717] border-[#D8D5CE]'
                }`}
              >
                {activeSubmission.status}
              </span>
            </div>
          )}
        </div>

        {/* Navigation list */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono text-[#73716B] uppercase tracking-widest px-2 block">
            Index // Views
          </span>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs transition-colors ${
                    isActive
                      ? 'bg-[#171717] text-[#F7F6F2] font-medium border-l-2 border-[#9B382B]'
                      : 'text-[#5C5B57] hover:text-[#171717] hover:bg-[#F7F6F2]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-[#F7F6F2]' : 'text-[#73716B]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 ${
                        isActive ? 'bg-[#2b2b2b] text-[#F7F6F2] border border-[#73716B]' : item.badgeColor
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
      </div>

      {/* Footer Guarantees Banner */}
      <div className="p-4 border-t border-[#D8D5CE] bg-[#F7F6F2] m-4 border text-xs space-y-1.5">
        <div className="flex items-center gap-2 text-[#171717] font-mono text-[10px] uppercase tracking-wider">
          <FileCheck2 className="w-3.5 h-3.5 text-[#2D5A38]" />
          <span>Evidence-Linked Engine</span>
        </div>
        <p className="text-[11px] text-[#73716B] leading-snug">
          All findings cite versioned company records. AI findings never grant publication permission.
        </p>
      </div>
    </aside>
  );
};
