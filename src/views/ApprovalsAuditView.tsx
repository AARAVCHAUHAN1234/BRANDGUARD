import React, { useState } from 'react';
import { useBrand, computeContentHash } from '../context/BrandContext';
import {
  AlertTriangle,
  Check,
  Lock,
  Unlock,
  ArrowRight,
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
    showToast,
  } = useBrand();

  const [selectedSubId, setSelectedSubId] = useState<string>(
    activeSubmission?.status === 'Approved' ? activeSubmission.id : 'SUB-002'
  );

  const targetSub = submissions.find((s) => s.id === selectedSubId) || submissions[0];
  const currentHash = targetSub ? computeContentHash(targetSub.content) : '';
  const isApprovedAndSealed = targetSub?.status === 'Approved' && targetSub.approvedContentHash === currentHash;

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
                }`}
              >
                {isApprovedAndSealed ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
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
                  <button
                    onClick={() => {
                      if (currentRole === 'creator') {
                        showToast('Switch to Legal Reviewer or Brand Manager to sign off.');
                        return;
                      }
                      approveSubmission(targetSub.id, 'Manual legal re-certification after audit review.');
                    }}
                    className="flex items-center gap-2 bg-[#2D5A38] hover:bg-[#23472c] text-[#F7F6F2] text-xs font-medium px-4 py-2 border border-[#2D5A38] transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Re-Certify & Seal Approval</span>
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};