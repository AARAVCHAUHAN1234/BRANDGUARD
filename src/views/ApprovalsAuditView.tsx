import React, { useState, useMemo } from 'react';
import { useBrand, computeContentHash } from '../context/BrandContext';
import { PublishingPanel } from '../components/PublishingPanel';
import { SlackTeamsBotPanel } from '../components/SlackTeamsBotPanel';
import { DriftCrawlerPanel } from '../components/DriftCrawlerPanel';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  FileCheck2,
  History,
  Lock,
  Unlock,
  ArrowRight,
  MessageSquare,
  Globe,
  Radio,
  Send,
  Search,
  Copy,
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
    showToast(`Audit: ${action} — ${reason.slice(0, 80)}...`);
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
    <div className="space-y-8 max-w-[1750px] mx-auto">
      {/* Top Banner explaining Version-Bound Approvals */}
      <div className="border border-[#D8D5CE] bg-[#FFFFFF] p-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#73716B]">
              LEDGER // VERIFICATION 05
            </span>
            <span className="border border-[#2D5A38] bg-[#EEF4EF] text-[#2D5A38] text-[10px] font-mono uppercase px-2 py-0.5 tracking-wider">
              Tamper Evident
            </span>
          </div>
          <h1 className="font-serif text-3xl text-[#171717]">
            Version-Bound Approvals &amp; Forensic Audit Trail
          </h1>
          <p className="text-xs text-[#73716B] leading-relaxed">
            In BrandGuard, publication approval is bound cryptographically to the exact content hash. If anyone alters text
            post-approval, the seal is broken instantly, revoking approval and reopening the review cycle.
          </p>
        </div>

        {/* Quick select submission */}
        <div className="flex items-center gap-2.5 shrink-0 text-xs">
          <label className="text-[10px] font-mono uppercase tracking-widest text-[#73716B]">Inspect Draft:</label>
          <select
            value={selectedSubId}
            onChange={(e) => {
              setSelectedSubId(e.target.value);
              setActiveSubmissionId(e.target.value);
            }}
            className="text-xs font-mono px-3 py-2 border border-[#D8D5CE] bg-[#F7F6F2] text-[#171717] focus:border-[#171717] focus:outline-none"
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
          <div className="p-5 bg-[#F7F6F2] border-b border-[#D8D5CE] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-serif text-lg text-[#171717]">
                Live Verification Bench: {targetSub.title}
              </span>
              <span
                className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 border flex items-center gap-1.5 ${
                  isApprovedAndSealed
                    ? 'bg-[#EEF4EF] text-[#2D5A38] border-[#2D5A38]'
                    : targetSub.status === 'Reopened'
                    ? 'bg-[#F6ECEB] text-[#9B382B] border-[#9B382B]'
                    : 'bg-[#FFFFFF] text-[#171717] border-[#D8D5CE]'
                }`}
              >
                {isApprovedAndSealed ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                {isApprovedAndSealed ? 'Approved & Sealed' : targetSub.status}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs flex-wrap font-mono">
              <span className="text-[#73716B] text-[11px] flex items-center gap-1.5">
                LIVE HASH: <strong className="text-[#171717]">{currentHash.slice(0, 14)}...</strong>
                <button
                  onClick={() => handleCopy(currentHash)}
                  className="p-1 hover:bg-[#EAE6DB] text-[#73716B] hover:text-[#171717] transition-colors"
                  title="Copy full hash"
                >
                  {copiedHash === currentHash ? <Check className="w-3 h-3 text-[#2D5A38]" /> : <Copy className="w-3 h-3" />}
                </button>
              </span>
              {targetSub.approvedContentHash && (
                <span className="text-[#73716B] text-[11px]">
                  SEAL HASH: <strong className="text-[#2D5A38]">{targetSub.approvedContentHash.slice(0, 14)}...</strong>
                </span>
              )}
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="text-xs text-[#5C5B57] flex items-center justify-between gap-4">
              <span>
                <strong className="text-[#171717] font-mono uppercase text-[10px] tracking-wider mr-1.5">Interactive Test:</strong>
                Type or delete any character below to observe how the cryptographic hash engine immediately detects post-approval alterations.
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
                  className="text-xs font-mono text-[#9B382B] underline underline-offset-4 shrink-0"
                >
                  Restore Approved Text
                </button>
              )}
            </div>

            <textarea
              rows={4}
              value={targetSub.content}
              onChange={(e) => updateDraftContent(targetSub.id, e.target.value)}
              className={`w-full text-xs font-mono p-4 border focus:outline-none transition-colors ${
                isApprovedAndSealed
                  ? 'border-[#2D5A38] bg-[#EEF4EF]/40 focus:border-[#2D5A38]'
                  : targetSub.status === 'Reopened'
                  ? 'border-[#9B382B] bg-[#F6ECEB]/40 focus:border-[#9B382B]'
                  : 'border-[#D8D5CE] bg-[#F7F6F2] focus:border-[#171717]'
              }`}
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                {isApprovedAndSealed ? (
                  <div className="flex items-center gap-2 text-xs font-mono text-[#2D5A38] bg-[#EEF4EF] px-3 py-1.5 border border-[#2D5A38]/40">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2D5A38]" />
                    <span>Cryptographic Integrity Verified: Hash matches signed release seal.</span>
                  </div>
                ) : targetSub.status === 'Reopened' ? (
                  <div className="flex items-center gap-2 text-xs font-mono text-[#9B382B] bg-[#F6ECEB] px-3 py-1.5 border border-[#9B382B]">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#9B382B]" />
                    <span>TAMPER DETECTED: Hash mismatch. Seal automatically invalidated.</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-mono text-[#73716B]">
                    <span>Draft is in review. Not yet sealed for publication.</span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2.5">
                {targetSub.status !== 'Approved' && currentRole !== 'creator' && (
                  <button
                    onClick={() => {
                      approveSubmission(targetSub.id, 'Verified via Live Verification Bench testing.');
                    }}
                    className="flex items-center gap-1.5 bg-[#171717] hover:bg-[#2b2b2b] text-[#F7F6F2] font-medium text-xs px-4 py-2 border border-[#171717] transition-colors"
                  >
                    <FileCheck2 className="w-3.5 h-3.5 text-[#2D5A38]" />
                    <span>Sign Off &amp; Seal Hash Now</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setActiveSubmissionId(targetSub.id);
                    onNavigate('workspace');
                  }}
                  className="flex items-center gap-1.5 text-xs font-medium text-[#171717] border border-[#D8D5CE] hover:border-[#171717] bg-[#FFFFFF] px-3.5 py-2 transition-colors"
                >
                  <span>Open Full Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expandable Advanced Integrations Drawer: Bots, Webhooks, Drift Crawler */}
      <div className="border border-[#D8D5CE] bg-[#FFFFFF]">
        <div className="p-6 border-b border-[#D8D5CE] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Radio className="w-4 h-4 text-[#171717]" />
            <div>
              <h2 className="font-serif text-xl text-[#171717]">
                Tier 2 &amp; 3 Enterprise Integrations
              </h2>
              <p className="text-xs text-[#73716B]">
                Slack/Teams Approval Bots, Autonomous Webhooks &amp; Post-Publication Drift Crawler
              </p>
            </div>
          </div>

          <div className="flex items-center bg-[#F7F6F2] border border-[#D8D5CE] divide-x divide-[#D8D5CE] text-xs font-mono">
            <button
              onClick={() => setActiveIntegrationTab(activeIntegrationTab === 'bots' ? 'none' : 'bots')}
              className={`px-3.5 py-2 flex items-center gap-1.5 transition-colors ${
                activeIntegrationTab === 'bots' ? 'bg-[#171717] text-[#F7F6F2]' : 'text-[#5C5B57] hover:text-[#171717]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Approval Bots</span>
            </button>
            <button
              onClick={() => setActiveIntegrationTab(activeIntegrationTab === 'webhooks' ? 'none' : 'webhooks')}
              className={`px-3.5 py-2 flex items-center gap-1.5 transition-colors ${
                activeIntegrationTab === 'webhooks' ? 'bg-[#171717] text-[#F7F6F2]' : 'text-[#5C5B57] hover:text-[#171717]'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publishing Webhooks</span>
            </button>
            <button
              onClick={() => setActiveIntegrationTab(activeIntegrationTab === 'crawler' ? 'none' : 'crawler')}
              className={`px-3.5 py-2 flex items-center gap-1.5 transition-colors ${
                activeIntegrationTab === 'crawler' ? 'bg-[#171717] text-[#F7F6F2]' : 'text-[#5C5B57] hover:text-[#171717]'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Drift Crawler</span>
            </button>
          </div>
        </div>

        {/* Drawer Contents */}
        {activeIntegrationTab === 'bots' && targetSub && (
          <div className="p-6 bg-[#F7F6F2] border-t border-[#D8D5CE]">
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
          <div className="p-6 bg-[#F7F6F2] border-t border-[#D8D5CE]">
            <PublishingPanel
              submission={targetSub}
              onAuditLog={handlePublishAuditLog}
              showToast={showToast}
            />
          </div>
        )}
        {activeIntegrationTab === 'crawler' && (
          <div className="p-6 bg-[#F7F6F2] border-t border-[#D8D5CE]">
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
      <div className="border border-[#D8D5CE] bg-[#FFFFFF]">
        <div className="p-6 border-b border-[#D8D5CE] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#171717]" />
              <h2 className="font-serif text-2xl text-[#171717]">Forensic Audit Ledger</h2>
            </div>
            <p className="text-xs text-[#73716B] mt-0.5">
              Append-only audit trail logging every human decision, approval seal, rule version, and hash invalidation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#73716B] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search audit trail..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                className="text-xs font-mono pl-9 pr-3.5 py-2 border border-[#D8D5CE] w-56 focus:outline-none focus:border-[#171717] bg-[#F7F6F2]"
              />
            </div>

            {/* Action Filter */}
            <select
              value={auditActionFilter}
              onChange={(e) => setAuditActionFilter(e.target.value)}
              className="text-xs font-mono px-3 py-2 border border-[#D8D5CE] bg-[#F7F6F2] text-[#171717] focus:border-[#171717] focus:outline-none"
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
            <thead className="bg-[#F7F6F2] text-[#73716B] border-b border-[#D8D5CE] uppercase font-mono text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-5">Timestamp</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Actor &amp; Role</th>
                <th className="py-3 px-4">Subject Reference</th>
                <th className="py-3 px-4">Recorded Governance Rationale</th>
                <th className="py-3 px-5 text-right">Cryptographic Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE6DB]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#F7F6F2]/70 transition-colors">
                  <td className="py-3.5 px-5 font-mono text-[11px] text-[#73716B] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border ${
                        log.action === 'APPROVAL_SEALED'
                          ? 'bg-[#EEF4EF] text-[#2D5A38] border-[#2D5A38]'
                          : log.action === 'REOPENED_VERSION_HASH_MISMATCH'
                          ? 'bg-[#F6ECEB] text-[#9B382B] border-[#9B382B]'
                          : log.action === 'HUMAN_DECISION_RECORDED'
                          ? 'bg-[#F7F2E8] text-[#8C6228] border-[#8C6228]'
                          : 'bg-[#F7F6F2] text-[#171717] border-[#D8D5CE]'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-medium text-[#171717]">{log.actor}</div>
                    <div className="text-[10px] font-mono text-[#73716B] capitalize">{log.role.replace('_', ' ')}</div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-[#5C5B57]">
                    {log.submissionId || 'System'}
                  </td>
                  <td className="py-3.5 px-4 max-w-md">
                    <p className="text-[#5C5B57] leading-snug line-clamp-2">
                      {log.reason}
                    </p>
                  </td>
                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    {log.contentVersionHash ? (
                      <span className="font-mono text-[10px] bg-[#F7F6F2] text-[#171717] px-2 py-1 border border-[#D8D5CE]">
                        {log.contentVersionHash.slice(0, 14)}...
                      </span>
                    ) : (
                      <span className="text-[#73716B] text-[10px]">—</span>
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
