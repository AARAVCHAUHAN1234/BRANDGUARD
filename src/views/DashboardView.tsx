import React, { useState, useMemo } from 'react';
import { useBrand } from '../context/BrandContext';
import {
  ArrowRight,
  Sparkles,
  Check,
  AlertTriangle,
} from 'lucide-react';

export const DashboardView: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const { submissions, setActiveSubmissionId, startGuidedTour, rules, facts } = useBrand();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_review' | 'approved' | 'needs_evidence'>('all');

  const totalSubmissions = submissions.length;
  const inReviewCount = submissions.filter((s) => s.status === 'In review' || s.status === 'Reopened').length;
  const approvedCount = submissions.filter((s) => s.status === 'Approved').length;
  const needsEvidenceCount = submissions.filter((s) => s.status === 'Needs evidence').length;
  const expiredFactsCount = facts.filter((f) => f.status === 'Expired').length;

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      // Status filter
      if (statusFilter === 'in_review' && sub.status !== 'In review' && sub.status !== 'Reopened') return false;
      if (statusFilter === 'approved' && sub.status !== 'Approved') return false;
      if (statusFilter === 'needs_evidence' && sub.status !== 'Needs evidence') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = sub.title.toLowerCase().includes(q);
        const matchesChannel = sub.channel.toLowerCase().includes(q);
        const matchesSubmitter = sub.submittedBy.toLowerCase().includes(q);
        const matchesId = sub.id.toLowerCase().includes(q);
        if (!matchesTitle && !matchesChannel && !matchesSubmitter && !matchesId) return false;
      }

      return true;
    });
  }, [submissions, statusFilter, searchQuery]);

  return (
    <div className="space-y-10">
      {/* Editorial Hero & Architectural Lead */}
      <section className="border border-[#D8D5CE] bg-[#FFFFFF] p-8 md:p-12 relative overflow-hidden">
        {/* Subtle background hairline grid */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">
          <div className="max-w-2xl space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#73716B] border border-[#D8D5CE] px-2 py-0.5">
                DISPATCH // OVERVIEW
              </span>
              <span className="text-xs text-[#73716B] font-mono">
                ENTERPRISE CONTROL LAYER
              </span>
            </div>

            <div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#171717] font-normal tracking-tight leading-[1.08]">
                Governance before publication.
              </h1>
              <p className="font-serif italic text-2xl sm:text-3xl text-[#73716B] font-normal tracking-tight mt-2">
                Every claim grounded in certified evidence.
              </p>
            </div>

            <p className="text-sm text-[#5C5B57] leading-relaxed max-w-xl">
              BrandGuard stands as an immutable verification filter between draft composition and public release—arresting obsolete brand identifiers, unverified superlative metrics, and expired credentials before they enter distribution.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  setActiveSubmissionId('SUB-DEMO-001');
                  onNavigate('workspace');
                  startGuidedTour();
                }}
                className="flex items-center gap-2.5 bg-[#171717] hover:bg-[#2e2e2e] text-[#F7F6F2] text-xs font-medium px-5 py-3 border border-[#171717] transition-colors"
                id="dashboard-try-demo"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#9B382B]" />
                <span>Launch Guided Tour</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigate('submit')}
                className="flex items-center gap-2 bg-transparent hover:bg-[#F7F6F2] text-[#171717] text-xs font-medium px-5 py-3 border border-[#D8D5CE] hover:border-[#171717] transition-colors"
              >
                <span>Submit New Draft</span>
              </button>

              <button
                onClick={() => onNavigate('knowledge')}
                className="text-xs text-[#73716B] hover:text-[#171717] underline underline-offset-4 transition-colors font-mono tracking-tight"
              >
                Inspect {rules.length} Certified Rules
              </button>
            </div>
          </div>

          {/* Architectural Dossier Card */}
          <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-[#D8D5CE] pt-6 lg:pt-0 lg:pl-8 space-y-5 shrink-0">
            <div className="border-b border-[#D8D5CE] pb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#73716B]">
                SYSTEM INTEGRITY SPECIFICATION
              </span>
              <h3 className="font-serif text-lg text-[#171717] mt-1">
                Active Policy Ledger
              </h3>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-baseline py-1 border-b border-[#EAE6DB]">
                <span className="text-[#73716B]">PROTOCOL:</span>
                <span className="text-[#171717] font-medium">STRICT DETERMINISTIC</span>
              </div>
              <div className="flex justify-between items-baseline py-1 border-b border-[#EAE6DB]">
                <span className="text-[#73716B]">ACTIVE CORPUS:</span>
                <span className="text-[#171717] font-medium">{rules.length} RULES // {facts.length} FACTS</span>
              </div>
              <div className="flex justify-between items-baseline py-1 border-b border-[#EAE6DB]">
                <span className="text-[#73716B]">SEAL METHOD:</span>
                <span className="text-[#171717] font-medium">CRYPTOGRAPHIC HASH</span>
              </div>
              <div className="flex justify-between items-baseline py-1 border-b border-[#EAE6DB]">
                <span className="text-[#73716B]">HUMAN ARBITRATION:</span>
                <span className="text-[#2D5A38] font-medium">MANDATORY</span>
              </div>
            </div>

            <p className="text-[11px] text-[#73716B] leading-relaxed pt-1">
              Automated heuristics never seal or broadcast content. Only designated human reviewers may issue certified release tokens.
            </p>
          </div>
        </div>
      </section>

      {/* Editorial Metric Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-[#D8D5CE] bg-[#FFFFFF] divide-y sm:divide-y-0 sm:divide-x divide-[#D8D5CE]">
        <div className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#73716B]">
              TOTAL SUBMISSIONS
            </span>
            <span className="text-xs font-mono text-[#73716B]">01</span>
          </div>
          <div className="font-serif text-4xl text-[#171717] leading-none pt-1">
            {totalSubmissions}
          </div>
          <p className="text-[11px] font-mono text-[#8C6228]">
            {inReviewCount} pending review
          </p>
        </div>

        <div className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#73716B]">
              CERTIFIED SIGN-OFFS
            </span>
            <span className="text-xs font-mono text-[#73716B]">02</span>
          </div>
          <div className="font-serif text-4xl text-[#2D5A38] leading-none pt-1">
            {approvedCount}
          </div>
          <p className="text-[11px] font-mono text-[#2D5A38]">
            Version-bound seals
          </p>
        </div>

        <div className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#73716B]">
              FLAGGED CLAIMS
            </span>
            <span className="text-xs font-mono text-[#73716B]">03</span>
          </div>
          <div className="font-serif text-4xl text-[#8C6228] leading-none pt-1">
            {needsEvidenceCount}
          </div>
          <p className="text-[11px] font-mono text-[#73716B]">
            Requires source grounding
          </p>
        </div>

        <div className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#73716B]">
              EXPIRED SOURCES
            </span>
            <span className="text-xs font-mono text-[#73716B]">04</span>
          </div>
          <div className="font-serif text-4xl text-[#9B382B] leading-none pt-1">
            {expiredFactsCount}
          </div>
          <p className="text-[11px] font-mono text-[#9B382B]">
            Excluded from citations
          </p>
        </div>
      </section>

      {/* Submissions Queue Table with Editorial Ledger Layout */}
      <section className="border border-[#D8D5CE] bg-[#FFFFFF]">
        <div className="p-6 border-b border-[#D8D5CE] flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#73716B]">
                REGISTRY // DISPATCH LOG
              </span>
            </div>
            <h2 className="font-serif text-2xl text-[#171717] mt-1">
              Active Submission Ledger
            </h2>
            <p className="text-xs text-[#73716B] mt-0.5">
              Drafts evaluated deterministically against current brand rules and certified facts.
            </p>
          </div>

          <button
            onClick={() => onNavigate('submit')}
            className="flex items-center gap-2 text-xs font-medium bg-[#171717] hover:bg-[#2b2b2b] text-[#F7F6F2] px-4 py-2 border border-[#171717] transition-colors self-start sm:self-auto"
          >
            <span>+ Submit Draft</span>
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F6F2] text-[#73716B] border-b border-[#D8D5CE] font-mono text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-5">Submission & Context</th>
                <th className="py-3 px-5">Channel / Region</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5">Readiness Score</th>
                <th className="py-3 px-5">Findings Summary</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE6DB]">
              {submissions.map((sub) => {
                const openCount = sub.findings.filter(
                  (f) => !f.humanDecision || f.humanDecision.status === 'open' || f.humanDecision.status === 'disputed'
                ).length;
                const criticalCount = sub.findings.filter((f) => f.severity === 'Critical').length;
                const highCount = sub.findings.filter((f) => f.severity === 'High').length;

                return (
                  <tr key={sub.id} className="hover:bg-[#F7F6F2]/70 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-serif text-base text-[#171717] leading-tight">
                        {sub.title}
                      </div>
                      <div className="text-[11px] font-mono text-[#73716B] flex items-center gap-2 mt-1">
                        <span>ID: {sub.id}</span>
                        <span>•</span>
                        <span>BY: {sub.submittedBy}</span>
                        <span>•</span>
                        <span>{sub.updatedAt}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span className="text-[#171717] border border-[#D8D5CE] px-2 py-0.5 bg-[#FFFFFF]">
                          {sub.channel}
                        </span>
                        <span className="text-[#73716B] border border-[#D8D5CE] px-2 py-0.5 bg-[#F7F6F2]">
                          {sub.market}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border ${
                          sub.status === 'Approved'
                            ? 'bg-[#EEF4EF] text-[#2D5A38] border-[#2D5A38]'
                            : sub.status === 'Reopened'
                            ? 'bg-[#F6ECEB] text-[#9B382B] border-[#9B382B]'
                            : sub.status === 'Needs evidence'
                            ? 'bg-[#F7F2E8] text-[#8C6228] border-[#8C6228]'
                            : 'bg-[#F7F6F2] text-[#171717] border-[#D8D5CE]'
                        }`}
                      >
                        {sub.status === 'Approved' && <Check className="w-3 h-3" />}
                        {sub.status === 'Reopened' && <AlertTriangle className="w-3 h-3" />}
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="w-40 space-y-1">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span
                            className={
                              sub.readinessStatus === 'Ready to publish'
                                ? 'text-[#2D5A38]'
                                : sub.readinessStatus === 'Blocked'
                                ? 'text-[#9B382B]'
                                : 'text-[#8C6228]'
                            }
                          >
                            {sub.readinessStatus}
                          </span>
                          <span className="text-[#171717] font-semibold">{sub.readinessScore}%</span>
                        </div>
                        <div className="w-full bg-[#EAE6DB] h-1 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              sub.readinessScore >= 90
                                ? 'bg-[#2D5A38]'
                                : sub.readinessScore >= 50
                                ? 'bg-[#8C6228]'
                                : 'bg-[#9B382B]'
                            }`}
                            style={{ width: `${sub.readinessScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        {sub.findings.length === 0 ? (
                          <span className="text-[#2D5A38] flex items-center gap-1">
                            <Check className="w-3 h-3" /> None
                          </span>
                        ) : (
                          <>
                            {criticalCount > 0 && (
                              <span className="text-[#9B382B] font-semibold">
                                {criticalCount} Critical
                              </span>
                            )}
                            {highCount > 0 && (
                              <span className="text-[#8C6228]">
                                {highCount} High
                              </span>
                            )}
                            <span className="text-[#73716B]">({openCount} open)</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => {
                          setActiveSubmissionId(sub.id);
                          onNavigate('workspace');
                        }}
                        className="inline-flex items-center gap-1.5 border border-[#171717] text-[#171717] hover:bg-[#171717] hover:text-[#F7F6F2] font-medium px-3 py-1.5 text-xs transition-colors"
                      >
                        <span>Inspect Draft</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};