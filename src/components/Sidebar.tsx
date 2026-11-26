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
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
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
      badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300 font-bold',
    },
    {
      id: 'workspace',
      index: '02',
      label: 'Review Workspace',
      icon: ShieldAlert,
      badge: unresolvedFindingsCount > 0 ? `${unresolvedFindingsCount} flags` : 'Clean',
      badgeAlert: unresolvedFindingsCount > 0,
      badge: unresolvedFindingsCount > 0 ? `${unresolvedFindingsCount} findings` : 'Clean',
      badgeColor: unresolvedFindingsCount > 0 ? 'bg-red-100 text-red-900 border border-red-300 font-bold' : 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold',
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
      badgeColor: 'bg-rose-100 text-rose-900 border border-rose-300 font-bold',
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
      label: 'Roadmap & Principles',
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
    <aside className="w-72 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 shadow-sm min-h-[calc(100vh-77px)] select-none">
      <div className="py-5 px-4 space-y-4">
        {/* Active Context Card — Spacious, Tactile & Clickable */}
        <div
          onClick={() => onNavigate('workspace')}
          className="p-4 bg-gradient-to-br from-[#14284B]/5 to-blue-50/50 hover:bg-[#14284B]/10 rounded-2xl border border-[#14284B]/15 shadow-xs space-y-2 cursor-pointer transition-all duration-150 hover:shadow-sm group"
          title="Click to open this draft in Review Workspace"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm" />
              <span className="text-[11px] font-extrabold text-[#14284B] uppercase tracking-wider">
                Nimbus Analytics
              </span>
            </div>
            <span className="text-[10px] font-black bg-[#14284B] text-white px-2 py-0.5 rounded-full">
              Enterprise
            </span>
          </div>

          <p className="text-xs font-bold text-slate-800 line-clamp-1 leading-snug group-hover:text-navy-900">
            {activeSubmission ? activeSubmission.title : 'No active draft'}
          </p>

          {activeSubmission && (
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-200/80">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                <span>{activeSubmission.channel}</span>
                <span>•</span>
                <span>{activeSubmission.market}</span>
              </div>
              <span
                className={`font-black px-2 py-0.5 rounded-full text-[10px] ${
                  activeSubmission.status === 'Approved'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : activeSubmission.status === 'Reopened'
                    ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                }`}
              >
                {activeSubmission.status}
              </span>
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
        {/* Navigation list with generous spacing and tactile interaction */}
        <div className="space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-3 block mb-2">
            Navigation Menu
          </span>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
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
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-[#14284B] text-white shadow-md shadow-navy-900/15 font-bold border-l-4 border-[#FFD60A] -translate-x-0.5'
                      : 'text-slate-700 hover:text-navy-950 hover:bg-slate-100/90 hover:translate-x-0.5 active:scale-[0.99]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-[#FFD60A]' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : item.badgeColor
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
      {/* Footer Guarantees Banner */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/80 m-3 rounded-2xl text-xs space-y-1.5">
        <div className="flex items-center gap-2 text-slate-800 font-bold">
          <FileCheck2 className="w-4 h-4 text-emerald-600" />
          <span>Evidence-Linked Engine</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-snug">
          All findings cite versioned company records. AI findings never grant publication permission.
        </p>
      </div>
    </aside>
  );
};