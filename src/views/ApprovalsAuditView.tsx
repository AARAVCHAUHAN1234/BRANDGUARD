import React, { useState, useMemo } from 'react';
import { useBrand, computeContentHash } from '../context/BrandContext';
import { PublishingPanel } from '../components/PublishingPanel';
import { SlackTeamsBotPanel } from '../components/SlackTeamsBotPanel';
import { DriftCrawlerPanel } from '../components/DriftCrawlerPanel';
import {
  AlertTriangle,
  Check,
  Lock,
  Unlock,
  ArrowRight,
  MessageSquare,
  Globe,
  Radio,
  Send,
  ChevronDown,
  ChevronUp,
  Search,
  Copy,
  Check,
} from 'lucide-react';

export const ApprovalsAuditView: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const {
    submissions,
    activeSubmission,
    setActiveSubmissionId,
    updateDraftContent,
    auditLogs,
    currentRole,
    approveSubmission,
    rejectSubmission,
    showToast,
  } = useBrand();

  const [selectedSubId, setSelectedSubId] = useState<string>(
    activeSubmission?.status === 'Approved' ? activeSubmission.id : 'SUB-002'
  );

  const [activeIntegrationTab, setActiveIntegrationTab] = useState<'none' | 'bots' | 'webhooks' | 'crawler'>('none');
  const [auditSearch, setAuditSearch] = useState<string>('');
  const [auditActionFilter, setAuditActionFilter] = useState<string>('all');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const targetSub = submissions.find((s) => s.id === selectedSubId) || submissions[0];
  const currentHash = targetSub ? computeContentHash(targetSub.content) : '';
  const isApprovedAndSealed = targetSub?.status === 'Approved' && targetSub.approvedContentHash === currentHash;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    showToast('Cryptographic hash copied to clipboard.');
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handlePublishAuditLog = (action: string, reason: string) => {
    showToast(`📋 Audit: ${action} — ${reason.slice(0, 80)}...`);
  };

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      if (auditActionFilter !== 'all' && log.action !== auditActionFilter) return false;
      if (auditSearch.trim()) {
        const q = auditSearch.toLowerCase();
        const matchesAction = log.action.toLowerCase().includes(q);
        const matchesActor = log.actor.toLowerCase().includes(q);
        const matchesReason = log.reason.toLowerCase().includes(q);
        const matchesSubId = log.submissionId.toLowerCase().includes(q);
        if (!matchesAction && !matchesActor && !matchesReason && !matchesSubId) return false;
      }
      return true;
    });
  }, [auditLogs, auditActionFilter, auditSearch]);

  return (
    <div className="space-y-8">
      {/* Top Banner explaining Version-Bound Approvals */}
      <div className="border border-[#D8D5CE] bg-[#FFFFFF] p-8 flex flex-col md:flex-row md:items-baseline md:justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#73716B]">
              FORENSICS // 05
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#2D5A38] border border-[#2D5A38]/30 px-1.5 py-0.2 bg-[#EEF4EF]">
              TAMPER EVIDENT PROTOCOL
            </span>
          </div>

          <h1 className="font-serif text-3xl text-[#171717]">
            Version-Bound Approvals & Cryptographic Ledger
          </h1>
          <p className="text-xs text-[#73716B] leading-relaxed">
            In BrandGuard, publication authorization binds mathematically to the exact cryptographic content digest. If copy is modified post-signoff, the seal voids automatically, revoking permission and reopening the governance review cycle.
    <div className="space-y-6 max-w-[1750px] mx-auto">
      {/* Top Banner explaining Version-Bound Approvals */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-heading font-extrabold text-2xl text-navy-900">
              Version-Bound Approvals & Forensic Audit Trail
            </h1>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-emerald-300">
              Tamper Evident
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
            In BrandGuard, publication approval is bound cryptographically to the exact content hash. If anyone alters text
            post-approval, the seal is broken instantly, revoking approval and reopening the review cycle.
          </p>
        </div>

        {/* Quick select submission */}
        <div className="flex items-center gap-2.5 shrink-0 font-mono text-xs">
          <label className="text-[10px] uppercase tracking-wider text-[#73716B]">INSPECT DRAFT:</label>
          <select
            value={selectedSubId}
            onChange={(e) => {
              setSelectedSubId(e.target.value);
              setActiveSubmissionId(e.target.value);
            }}
            className="text-xs px-3 py-2 border border-[#D8D5CE] bg-[#F7F6F2] text-[#171717] focus:border-[#171717] focus:outline-none"
            className="text-xs px-3.5 py-2 border border-slate-300 rounded-xl bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-[#14284B]"
          >
            {submissions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title} ({s.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Live Interactive Invalidation Test Bench */}
      {targetSub && (
        <div className="border border-[#171717] bg-[#FFFFFF]">
          <div className="p-4 border-b border-[#D8D5CE] bg-[#F7F6F2] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="font-serif text-base text-[#171717]">
                Verification Bench: {targetSub.title}
              </span>
              <span
                className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 border flex items-center gap-1 ${
                  isApprovedAndSealed
                    ? 'border-[#2D5A38] text-[#2D5A38] bg-[#EEF4EF]'
                    : targetSub.status === 'Reopened'
                    ? 'border-[#9B382B] text-[#9B382B] bg-[#F6ECEB]'
                    : 'border-[#8C6228] text-[#8C6228] bg-[#F7F2E8]'
        <div className="bg-white rounded-3xl border-2 border-navy-900/15 shadow-sm overflow-hidden">
          <div className="p-5 bg-slate-50/90 border-b border-slate-200/90 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-heading font-bold text-base text-navy-900">
                Live Verification Bench: {targetSub.title}
              </span>
              <span
                className={`text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                  isApprovedAndSealed
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs'
                    : targetSub.status === 'Reopened'
                    ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                }`}
              >
                {isApprovedAndSealed ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                {isApprovedAndSealed ? 'Approved & Sealed' : targetSub.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <span className="text-[#73716B]">
                LIVE HASH: <strong className="text-[#171717]">{currentHash.slice(0, 14)}...</strong>
              </span>
              {targetSub.approvedContentHash && (
                <span className="text-[#73716B]">
                  • SEAL HASH: <strong className="text-[#2D5A38]">{targetSub.approvedContentHash.slice(0, 14)}...</strong>
            <div className="flex items-center gap-3 text-xs flex-wrap">
              <span className="text-slate-500 font-mono text-[11px] flex items-center gap-1">
                Live Hash: <strong className="text-slate-800 font-bold">{currentHash.slice(0, 14)}...</strong>
                <button
                  onClick={() => handleCopy(currentHash)}
                  className="p-1 hover:bg-slate-200 rounded text-slate-500"
                  title="Copy full hash"
                >
                  {copiedHash === currentHash ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                </button>
              </span>
              {targetSub.approvedContentHash && (
                <span className="text-slate-500 font-mono text-[11px]">
                  Seal Hash: <strong className="text-emerald-800 font-bold">{targetSub.approvedContentHash.slice(0, 14)}...</strong>
                </span>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {targetSub.status === 'Reopened' && (
              <div className="border border-[#9B382B] bg-[#F6ECEB] p-4 text-xs flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-[#9B382B] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-serif text-sm font-bold text-[#9B382B]">
                    Seal Invalidation Triggered
                  </span>
                  <p className="text-[#9B382B] leading-relaxed">
                    {targetSub.reopenReason ||
                      'Material content change occurred post-approval. The approval seal has been invalidated and recorded in the audit ledger.'}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[#171717]">
                  Interactive Manuscript (Edit below to observe automatic cryptographic seal reset):
                </label>
                <span className="text-[11px] font-mono text-[#73716B]">
                  Type or delete any character
                </span>
              </div>
              <textarea
                rows={5}
                value={targetSub.content}
                onChange={(e) => updateDraftContent(targetSub.id, e.target.value)}
                className="w-full text-xs font-sans p-4 border border-[#D8D5CE] bg-[#F7F6F2] text-[#171717] focus:border-[#171717] focus:outline-none leading-relaxed"
                placeholder="Edit text to watch approval reset..."
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t border-[#D8D5CE]">
              <div className="text-xs font-mono text-[#73716B]">
                {targetSub.approvedBy && (
                  <span>
                    SIGN-OFF: <strong className="text-[#171717]">{targetSub.approvedBy}</strong> ({targetSub.approvalRole}) ON{' '}
                    {targetSub.approvedAt}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {targetSub.status !== 'Approved' && (
          <div className="p-5 space-y-4">
            <div className="text-xs text-slate-600 flex items-center justify-between">
              <span>
                <strong>Interactive Test:</strong> Type or delete any character in the box below to see how the
                cryptographic hash engine immediately detects post-approval alterations.
              </span>
              {targetSub.status === 'Reopened' && (
                <button
                  onClick={() => {
                    const originalApproved = submissions.find((s) => s.id === 'SUB-002')?.content || '';
                    if (originalApproved) {
                      updateDraftContent(targetSub.id, originalApproved);
                      showToast('Draft content reverted to matching hash.');
                    }
                  }}
                  className="text-xs text-blue-600 font-bold hover:underline shrink-0 ml-2"
                >
                  Restore Approved Text
                </button>
              )}
            </div>

            <textarea
              rows={4}
              value={targetSub.content}
              onChange={(e) => updateDraftContent(targetSub.id, e.target.value)}
              className={`w-full text-xs font-mono p-4 border rounded-2xl focus:outline-none transition-colors ${
                isApprovedAndSealed
                  ? 'border-emerald-300 bg-emerald-50/20 focus:ring-2 focus:ring-emerald-500'
                  : targetSub.status === 'Reopened'
                  ? 'border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-500'
                  : 'border-slate-300 focus:ring-2 focus:ring-[#14284B]'
              }`}
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                {isApprovedAndSealed ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Cryptographic Integrity Verified: Hash matches signed release seal.</span>
                  </div>
                ) : targetSub.status === 'Reopened' ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-800 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-300">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>TAMPER DETECTED: Hash mismatch. Seal automatically invalidated.</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Draft is in review. Not yet sealed for publication.</span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                {targetSub.status !== 'Approved' && currentRole !== 'creator' && (
                  <button
                    onClick={() => {
                      approveSubmission(targetSub.id, 'Verified via Live Verification Bench testing.');
                    }}
                    className="flex items-center gap-2 bg-[#2D5A38] hover:bg-[#23472c] text-[#F7F6F2] text-xs font-medium px-4 py-2 border border-[#2D5A38] transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Re-Certify & Seal Approval</span>
                    className="flex items-center gap-1.5 bg-[#FFD60A] hover:bg-[#ffe043] text-[#14284B] font-extrabold text-xs px-4 py-2 rounded-xl shadow-sm transition-all"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>Sign Off & Seal Hash Now</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setActiveSubmissionId(targetSub.id);
                    onNavigate('workspace');
                  }}
                  className="flex items-center gap-1.5 border border-[#171717] hover:bg-[#171717] hover:text-[#F7F6F2] text-[#171717] text-xs font-medium px-4 py-2 transition-colors"
                >
                  <span>Open Workspace</span>
                  className="flex items-center gap-1 text-xs font-bold text-navy-900 hover:text-blue-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors"
                >
                  <span>Open Full Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Forensic Audit Log Table */}
      <div className="border border-[#D8D5CE] bg-[#FFFFFF]">
        <div className="p-6 border-b border-[#D8D5CE] bg-[#F7F6F2] flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#73716B]">
              IMMUTABLE CHRONICLE // FORENSIC LOG
            </span>
            <h2 className="font-serif text-2xl text-[#171717] mt-1">
              Governance Audit Ledger
            </h2>
            <p className="text-xs text-[#73716B] mt-0.5">
              Cryptographically timestamped chronological record of all submissions, human judgments, version alterations, and approval seals.
            </p>
          </div>
          <span className="text-xs font-mono text-[#73716B]">
            {auditLogs.length} Events Inscribed
          </span>
      {/* Expandable Advanced Integrations Drawer: Bots, Webhooks, Drift Crawler */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Radio className="w-5 h-5 text-navy-900" />
            <div>
              <h2 className="font-heading font-extrabold text-base text-navy-900">
                Tier 2 & 3 Enterprise Integrations
              </h2>
              <p className="text-xs text-slate-500">
                Slack/Teams Approval Bots, Autonomous Webhooks & Post-Publication Drift Crawler
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setActiveIntegrationTab(activeIntegrationTab === 'bots' ? 'none' : 'bots')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                activeIntegrationTab === 'bots' ? 'bg-[#14284B] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Approval Bots</span>
            </button>
            <button
              onClick={() => setActiveIntegrationTab(activeIntegrationTab === 'webhooks' ? 'none' : 'webhooks')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                activeIntegrationTab === 'webhooks' ? 'bg-[#14284B] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publishing Webhooks</span>
            </button>
            <button
              onClick={() => setActiveIntegrationTab(activeIntegrationTab === 'crawler' ? 'none' : 'crawler')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                activeIntegrationTab === 'crawler' ? 'bg-[#14284B] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Drift Crawler</span>
            </button>
          </div>
        </div>

        {/* Drawer Contents */}
        {activeIntegrationTab === 'bots' && targetSub && (
          <div className="p-6 bg-slate-50/50 border-t border-slate-100">
            <SlackTeamsBotPanel
              submission={targetSub}
              currentRole={currentRole}
              onApprove={(id, reason) => approveSubmission(id, reason)}
              onReject={(id, reason) => rejectSubmission(id, reason)}
              onNavigateToWorkspace={(id) => {
                setActiveSubmissionId(id);
                onNavigate('workspace');
              }}
              showToast={showToast}
            />
          </div>
        )}
        {activeIntegrationTab === 'webhooks' && targetSub && (
          <div className="p-6 bg-slate-50/50 border-t border-slate-100">
            <PublishingPanel
              submission={targetSub}
              onAuditLog={handlePublishAuditLog}
              showToast={showToast}
            />
          </div>
        )}
        {activeIntegrationTab === 'crawler' && (
          <div className="p-6 bg-slate-50/50 border-t border-slate-100">
            <DriftCrawlerPanel
              onNavigateToWorkspace={(subId: string) => {
                setActiveSubmissionId(subId);
                onNavigate('workspace');
              }}
            />
          </div>
        )}
      </div>

      {/* Forensic Audit Table — Filterable & Searchable */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/90 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-navy-900" />
              <h2 className="font-heading font-extrabold text-lg text-navy-900">Forensic Audit Ledger</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Append-only audit trail logging every human decision, approval seal, rule version, and hash invalidation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search audit trail..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                className="text-xs pl-9 pr-3.5 py-2 border border-slate-200 rounded-xl w-56 focus:outline-none focus:ring-2 focus:ring-[#14284B] bg-slate-50/50"
              />
            </div>

            {/* Action Filter */}
            <select
              value={auditActionFilter}
              onChange={(e) => setAuditActionFilter(e.target.value)}
              className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white font-semibold focus:outline-none"
            >
              <option value="all">All Event Types ({auditLogs.length})</option>
              <option value="APPROVAL_SEALED">Approval Sealed</option>
              <option value="REOPENED_VERSION_HASH_MISMATCH">Hash Mismatch Invalidation</option>
              <option value="HUMAN_DECISION_RECORDED">Human Decision</option>
              <option value="ALL_ACCEPTED_FIXES_APPLIED">Accepted Fixes Applied</option>
              <option value="RULE_VERSION_BUMP">Rule Version Bump</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFFFFF] text-[#73716B] font-mono uppercase text-[10px] tracking-wider border-b border-[#D8D5CE]">
              <tr>
                <th className="py-3 px-5">Timestamp</th>
                <th className="py-3 px-5">Actor / Persona</th>
                <th className="py-3 px-5">Event Action</th>
                <th className="py-3 px-5">Submission</th>
                <th className="py-3 px-5">Recorded Governance Rationale</th>
                <th className="py-3 px-5">Content Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE6DB]">
              {auditLogs.map((log) => {
                const isTamper = log.action.includes('REOPENED') || log.action.includes('MISMATCH');
                const isApproval = log.action.includes('APPROVED');

                return (
                  <tr key={log.id} className="hover:bg-[#F7F6F2]/70 transition-colors">
                    <td className="py-4 px-5 text-[#73716B] font-mono text-[11px] whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-4 px-5 whitespace-nowrap">
                      <div className="font-medium text-[#171717]">{log.actor}</div>
                      <span className="text-[10px] font-mono text-[#73716B] uppercase">
                        {log.role}
                      </span>
                    </td>
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span
                        className={`font-mono text-[10px] uppercase px-2 py-0.5 border ${
                          isApproval
                            ? 'border-[#2D5A38] text-[#2D5A38] bg-[#EEF4EF]'
                            : isTamper
                            ? 'border-[#9B382B] text-[#9B382B] bg-[#F6ECEB]'
                            : 'border-[#73716B] text-[#171717] bg-[#F7F6F2]'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-4 px-5 max-w-xs truncate text-[#171717] font-serif text-sm">
                      {log.submissionTitle}
                    </td>
                    <td className="py-4 px-5 text-[#5C5B57] max-w-sm">{log.reason}</td>
                    <td className="py-4 px-5 font-mono text-[10px] text-[#73716B] whitespace-nowrap">
                      {log.contentVersionHash.slice(0, 16)}...
                    </td>
                  </tr>
                );
              })}
            <thead className="bg-slate-50/80 text-slate-600 border-b border-slate-200/80 uppercase font-bold text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Timestamp</th>
                <th className="py-3.5 px-4">Event Type</th>
                <th className="py-3.5 px-4">Actor & Role</th>
                <th className="py-3.5 px-4">Subject Reference</th>
                <th className="py-3.5 px-4">Recorded Governance Rationale</th>
                <th className="py-3.5 px-5 text-right">Cryptographic Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        log.action === 'APPROVAL_SEALED'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : log.action === 'REOPENED_VERSION_HASH_MISMATCH'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse font-extrabold'
                          : log.action === 'HUMAN_DECISION_RECORDED'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-bold text-navy-900">{log.actor}</div>
                    <div className="text-[10px] text-slate-400 capitalize">{log.role.replace('_', ' ')}</div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-slate-600 font-semibold">
                    {log.submissionId || 'System'}
                  </td>
                  <td className="py-3.5 px-4 max-w-md">
                    <p className="text-slate-700 leading-snug line-clamp-2">
                      {log.reason}
                    </p>
                  </td>
                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    {log.contentVersionHash ? (
                      <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                        {log.contentVersionHash.slice(0, 14)}...
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};