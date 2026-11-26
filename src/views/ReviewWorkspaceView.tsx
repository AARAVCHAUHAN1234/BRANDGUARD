import React, { useState, useMemo } from 'react';
import { useBrand } from '../context/BrandContext';
import { FindingStatus } from '../types';
import { DiffViewer } from '../components/DiffViewer';
import {
  RotateCcw,
  Check,
  AlertTriangle,
  Lock,
  Edit3,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const ReviewWorkspaceView: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const {
    activeSubmission,
    updateFindingDecision,
    applyAllAcceptedFixes,
    approveSubmission,
    currentRole,
    runReviewOnSubmission,
    showToast,
  } = useBrand();

  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [decisionReason, setDecisionReason] = useState<string>('');
  const [customCorrection, setCustomCorrection] = useState<string>('');
  const [showEditInput, setShowEditInput] = useState<boolean>(false);
  const [isReviewing, setIsReviewing] = useState<boolean>(false);
  const [showApproveModal, setShowApproveModal] = useState<boolean>(false);
  const [approvalJustification, setApprovalJustification] = useState<string>(
    'Verified against Q4 Brand Guidelines and GDPR compliance documents.'
  );

  const findings = useMemo(() => activeSubmission?.findings || [], [activeSubmission]);

  // Filtered list
  const filteredFindings = useMemo(() => {
    if (filterSeverity === 'all') return findings;
    return findings.filter((f) => f.severity.toLowerCase() === filterSeverity.toLowerCase());
  }, [findings, filterSeverity]);

  // Selected finding
  const selectedFinding = useMemo(() => {
    if (!filteredFindings.length) return null;
    return filteredFindings.find((f) => f.id === selectedFindingId) || filteredFindings[0] || null;
  }, [filteredFindings, selectedFindingId]);

  if (!activeSubmission) {
    return (
      <div className="border border-[#D8D5CE] bg-[#FFFFFF] p-16 text-center max-w-xl mx-auto space-y-4">
        <span className="font-mono text-xs text-[#73716B] uppercase tracking-widest">[DOSSIER VACANT]</span>
        <h3 className="font-serif text-3xl text-[#171717]">No active submission selected</h3>
        <p className="text-xs text-[#73716B] leading-relaxed">
          Select a draft from the Dashboard index to initiate the proofreading and governance workflow.
        </p>
        <button
          onClick={() => onNavigate('dashboard')}
          className="bg-[#171717] text-[#F7F6F2] text-xs px-5 py-2.5 font-medium border border-[#171717] hover:bg-[#2b2b2b] transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Handle human decision submit
  const handleDecision = (status: FindingStatus) => {
    if (!selectedFinding) return;
    if (!decisionReason.trim()) {
      showToast('⚠️ A recorded justification is mandatory for every human governance decision.');
      return;
    }

    updateFindingDecision(
      activeSubmission.id,
      selectedFinding.id,
      status,
      decisionReason.trim(),
      showEditInput && customCorrection ? customCorrection : undefined
    );

    setDecisionReason('');
    setShowEditInput(false);
    setCustomCorrection('');
  };

  const handleRunFreshReview = async () => {
    setIsReviewing(true);
    await runReviewOnSubmission(activeSubmission.id);
    setIsReviewing(false);
  };

  // Quick preset reasons for effortless governance decisions
  const QUICK_REASONS = [
    'Approved rebrand per Q1 Brand Kit.',
    'Disputed: Direct executive quote in context.',
    'Escalated to legal: Requires regulatory counsel review.',
    'Accepted minimal correction per brand standards.',
  ];

  // Render highlighted content spans
  const renderHighlightedContent = () => {
    const text = activeSubmission.content;
    if (!findings || findings.length === 0) {
      return <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-[#171717]">{text}</div>;
    }

    const sorted = [...findings].sort((a, b) => a.startIndex - b.startIndex);
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    sorted.forEach((finding, index) => {
      let start = finding.startIndex;
      let end = finding.endIndex;

      if (start < lastIndex || text.substring(start, end) !== finding.targetText) {
        const found = text.indexOf(finding.targetText, lastIndex);
        if (found !== -1) {
          start = found;
          end = found + finding.targetText.length;
        } else {
          return;
        }
      }

      if (start > lastIndex) {
        elements.push(
          <span key={`text-${index}`}>{text.substring(lastIndex, start)}</span>
        );
      }

      const isSelected = selectedFinding?.id === finding.id;
      const isResolved =
        finding.humanDecision &&
        (finding.humanDecision.status === 'accepted' || finding.humanDecision.status === 'edited');

      let markClass = 'mark-medium';
      if (finding.severity === 'Critical') markClass = 'mark-critical';
      else if (finding.severity === 'High') markClass = 'mark-high';
      else if (finding.severity === 'Low') markClass = 'mark-low';

      elements.push(
        <span
          key={`finding-${finding.id}-${index}`}
          onClick={() => setSelectedFindingId(finding.id)}
          className={`${markClass} ${isSelected ? 'selected ring-1 ring-[#171717] font-semibold' : ''} ${
            isResolved ? 'opacity-40 line-through' : ''
          }`}
          title={`${finding.ruleName} (${finding.severity}) - Click to inspect reasoning`}
        >
          {text.substring(start, end)}
        </span>
      );

      lastIndex = end;
    });

    if (lastIndex < text.length) {
      elements.push(<span key="text-end">{text.substring(lastIndex)}</span>);
    }

    return (
      <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-[#171717] select-text">
        {elements}
      </div>
    );
  };

  const acceptedCount = findings.filter((f) => f.humanDecision?.status === 'accepted').length;
  const wordCount = activeSubmission.content.split(/\s+/).filter(Boolean).length;
  const charCount = activeSubmission.content.length;

  const currentFindingIndex = findings.findIndex((f) => f.id === selectedFinding?.id);

  const navigateFinding = (direction: 'prev' | 'next') => {
    if (findings.length === 0) return;
    let nextIndex = direction === 'next' ? currentFindingIndex + 1 : currentFindingIndex - 1;
    if (nextIndex >= findings.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = findings.length - 1;
    setSelectedFindingId(findings[nextIndex].id);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner if Reopened or Approved */}
      {activeSubmission.status === 'Reopened' && (
        <div className="border border-[#9B382B] bg-[#F6ECEB] p-4 text-xs flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-[#9B382B] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-serif text-sm font-bold text-[#9B382B]">
              Approval Seal Voided — Post-Approval Alteration Detected
            </span>
            <p className="text-[#9B382B] leading-relaxed">
              {activeSubmission.reopenReason ||
                'The content cryptographic hash no longer coincides with the certified signoff ledger. Approval has been automatically rescinded.'}
            </p>
          </div>
        </div>
      )}

      {activeSubmission.status === 'Approved' && (
        <div className="border border-[#2D5A38] bg-[#EEF4EF] p-4 text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2.5 text-[#2D5A38]">
            <Check className="w-4 h-4 text-[#2D5A38]" />
            <span className="font-serif text-sm font-medium">
              Certified for Public Release by {activeSubmission.approvedBy} ({activeSubmission.approvalRole})
            </span>
            <span className="font-mono text-[10px] border border-[#2D5A38]/30 px-2 py-0.5 bg-[#FFFFFF]">
              HASH: {activeSubmission.approvedContentHash?.slice(0, 16)}...
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#2D5A38]">{activeSubmission.approvedAt}</span>
        </div>
      )}

      {/* Hero Workspace Header */}
      <div className="border border-[#D8D5CE] bg-[#FFFFFF] p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#73716B]">
              PROOFREADING WORKSPACE
            </span>
            <span className="text-[#D8D5CE]">/</span>
            <span className="text-xs font-mono uppercase text-[#171717]">
              {activeSubmission.channel} • {activeSubmission.market}
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl text-[#171717] tracking-tight">
            {activeSubmission.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs text-[#73716B] font-mono mt-1.5">
            <span>BY: {activeSubmission.submittedBy}</span>
            <span>•</span>
            <span>UPDATED: {activeSubmission.updatedAt}</span>
            <span>•</span>
            <span>INITIAL HASH: {activeSubmission.initialContentHash.slice(0, 10)}</span>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {acceptedCount > 0 && (
            <button
              onClick={() => applyAllAcceptedFixes(activeSubmission.id)}
              className="flex items-center gap-2 bg-[#2D5A38] hover:bg-[#23472c] text-[#F7F6F2] text-xs font-medium px-4 py-2 border border-[#2D5A38] transition-colors"
              id="btn-apply-fixes"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply All Accepted ({acceptedCount})</span>
            </button>
          )}

          <button
            onClick={handleRunFreshReview}
            disabled={isReviewing}
            className="flex items-center gap-1.5 border border-[#D8D5CE] text-[#171717] hover:border-[#171717] text-xs px-3.5 py-2 bg-transparent transition-colors disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isReviewing ? 'animate-spin' : ''}`} />
            <span>{isReviewing ? 'Evaluating...' : 'Re-verify Heuristics'}</span>
          </button>

          {/* Publication Approval Action */}
          {currentRole !== 'creator' ? (
            <button
              onClick={() => {
                const reason = prompt(
                  'Enter approval compliance rationale (Recorded permanently in the forensic audit ledger):',
                  'Verified against corporate brand guidelines and certified factual sources.'
                );
                if (reason) approveSubmission(activeSubmission.id, reason);
              }}
              className="flex items-center gap-2 bg-[#171717] hover:bg-[#2b2b2b] text-[#F7F6F2] text-xs font-medium px-4 py-2 border border-[#171717] transition-colors"
              id="btn-approve-draft"
            >
              <Check className="w-3.5 h-3.5 text-[#9B382B]" />
              <span>Sign Off & Seal Draft</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#73716B] border border-[#D8D5CE] bg-[#F7F6F2] px-3 py-2">
              <Lock className="w-3 h-3 text-[#73716B]" />
              <span>Creator Role: Sign-off requires Brand Manager or Legal</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Proof Manuscript Sheet */}
        <div className="lg:col-span-7 space-y-4">
          <div className="border border-[#D8D5CE] bg-[#FFFFFF]">
            <div className="p-4 border-b border-[#D8D5CE] bg-[#F7F6F2] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#73716B]">
                  MANUSCRIPT PROOF
                </span>
                <span className="text-xs text-[#73716B]">
                  (Select highlighted text to open forensic reasoning)
                </span>
              </div>

              <div className="flex items-center gap-3 text-[10px] font-mono uppercase text-[#73716B]">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-[#9B382B] inline-block" /> Critical
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-[#8C6228] inline-block" /> High
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-[#73716B] inline-block" /> Medium
                </span>
              </div>
            </div>

            <div className="p-8 sm:p-10 min-h-[380px] leading-relaxed select-text font-serif text-base sm:text-lg">
              {renderHighlightedContent()}
            </div>

            <div className="p-3.5 border-t border-[#D8D5CE] bg-[#F7F6F2] flex items-center justify-between text-xs text-[#73716B] font-mono">
              <span>{findings.length} findings recorded</span>
              <span className="text-[10px] uppercase tracking-wider">
                Automated heuristics never seal or publish
              </span>
            </div>
          </div>

          {/* Publication Readiness Meter */}
          <div className="border border-[#D8D5CE] bg-[#FFFFFF] p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#73716B]">
                  PUBLICATION READINESS:
                </span>
                <span
                  className={`text-xs font-mono uppercase font-semibold px-2 py-0.5 border ${
                    activeSubmission.readinessStatus === 'Ready to publish'
                      ? 'border-[#2D5A38] text-[#2D5A38] bg-[#EEF4EF]'
                      : activeSubmission.readinessStatus === 'Blocked'
                      ? 'border-[#9B382B] text-[#9B382B] bg-[#F6ECEB]'
                      : 'border-[#8C6228] text-[#8C6228] bg-[#F7F2E8]'
                  }`}
                >
                  {activeSubmission.readinessStatus} — {activeSubmission.readinessScore}%
                </span>
              </div>
              <p className="text-[11px] text-[#73716B] mt-1">
                Calculated deterministically from open violations, severity penalties, and ungrounded statements.
              </p>
            </div>

            <div className="w-48 bg-[#EAE6DB] h-1.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  activeSubmission.readinessScore >= 90
                    ? 'bg-[#2D5A38]'
                    : activeSubmission.readinessScore >= 50
                    ? 'bg-[#8C6228]'
                    : 'bg-[#9B382B]'
                }`}
                style={{ width: `${activeSubmission.readinessScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Reasoning Chain Dossier */}
        <div className="lg:col-span-5 space-y-4">
          {/* Severity Filter Tabs */}
          <div className="flex items-center border border-[#D8D5CE] bg-[#FFFFFF] divide-x divide-[#D8D5CE] text-xs font-mono">
            {['all', 'critical', 'high', 'medium', 'low'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`flex-1 py-1.5 text-center uppercase tracking-wider transition-colors ${
                  filterSeverity === sev
                    ? 'bg-[#171717] text-[#F7F6F2] font-semibold'
                    : 'text-[#5C5B57] hover:text-[#171717] hover:bg-[#F7F6F2]'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          {selectedFinding ? (
            <div className="border border-[#171717] bg-[#FFFFFF]">
              {/* Finding Header */}
              <div className="p-4 bg-[#171717] text-[#F7F6F2]">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 border ${
                        selectedFinding.severity === 'Critical'
                          ? 'border-[#9B382B] text-[#F7F6F2] bg-[#9B382B]'
                          : selectedFinding.severity === 'High'
                          ? 'border-[#8C6228] text-[#F7F6F2] bg-[#8C6228]'
                          : 'border-[#73716B] text-[#F7F6F2] bg-[#73716B]'
                      }`}
                    >
                      {selectedFinding.severity}
                    </span>

                    <span className="text-[10px] font-mono border border-white/20 text-[#D8D5CE] px-2 py-0.5">
                      CONF: {selectedFinding.confidence}%
                    </span>

                    <span className="text-[10px] font-mono text-[#D8D5CE] uppercase">
                      {selectedFinding.origin}
                    </span>
                  </div>

                  {(selectedFinding.severity === 'Critical' || selectedFinding.severity === 'High') && (
                    <span className="text-[10px] font-mono uppercase text-[#9B382B] bg-[#FFFFFF] px-1.5 py-0.5 font-bold">
                      HUMAN ESCALATION REQUIRED
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-lg leading-snug">
                  {selectedFinding.ruleName}
                </h3>
              </div>

              {/* Exact 6-Step Reasoning Chain */}
              <div className="p-5 space-y-4 text-xs max-h-[620px] overflow-y-auto">
                {/* 1. Original Claim */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#73716B] block">
                    01 // ORIGINAL MANUSCRIPT CLAIM
                  </span>
                  <div className="p-3 bg-[#F7F6F2] border border-[#D8D5CE] font-serif text-sm text-[#171717]">
                    "{selectedFinding.reasoning.originalClaim}"
                  </div>
                </div>

                {/* 2. Applicable Rule */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#73716B] block">
                    02 // APPLICABLE GOVERNANCE DIRECTIVE
                  </span>
                  <div className="p-3 bg-[#FFFFFF] border border-[#D8D5CE] text-[#171717] font-medium leading-relaxed">
                    {selectedFinding.reasoning.applicableRule}
                  </div>
                </div>

                {/* 3. Evidence */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#73716B] block">
                    03 // CERTIFIED EVIDENCE RECORD
                  </span>
                  {selectedFinding.reasoning.evidence ? (
                    <div
                      className={`p-3 border text-xs space-y-1 ${
                        selectedFinding.reasoning.evidence.isExpired
                          ? 'border-[#9B382B] bg-[#F6ECEB] text-[#9B382B]'
                          : selectedFinding.reasoning.evidence.hasConflict
                          ? 'border-[#8C6228] bg-[#F7F2E8] text-[#8C6228]'
                          : 'border-[#2D5A38] bg-[#EEF4EF] text-[#2D5A38]'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span>{selectedFinding.reasoning.evidence.sourceTitle}</span>
                        <span className="font-mono text-[10px] border border-current px-1.5 py-0.2">
                          {selectedFinding.reasoning.evidence.version}
                        </span>
                      </div>
                      <div className="font-mono text-[10px] opacity-80">
                        REF ID: {selectedFinding.reasoning.evidence.sourceId}
                      </div>

                      {selectedFinding.reasoning.evidence.isExpired && (
                        <div className="mt-2 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1 font-bold">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>EXPIRED SOURCE: BANNED FROM PUBLIC CLAIMS</span>
                        </div>
                      )}

                      {selectedFinding.reasoning.evidence.hasConflict && (
                        <div className="mt-2 text-[11px] leading-tight">
                          {selectedFinding.reasoning.evidence.conflictNote}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 border border-[#D8D5CE] bg-[#F7F6F2] text-[#8C6228]">
                      <span className="font-medium">No verified evidence source found on file.</span>
                      <p className="text-[11px] mt-0.5 italic text-[#73716B]">
                        "Absence of certified proof halts public superlative claims."
                      </p>
                    </div>
                  )}
                </div>

                {/* 4. Explanation */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#73716B] block">
                    04 // REASONING & COMPLIANCE RATIONALE
                  </span>
                  <p className="text-[#5C5B57] leading-relaxed bg-[#FFFFFF] p-3 border border-[#D8D5CE]">
                    {selectedFinding.reasoning.explanation}
                  </p>
                </div>

                {/* 5. Suggested Correction Diff */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#73716B] block">
                    05 // PROPOSED REDLINE CORRECTION
                  </span>
                  <DiffViewer
                    original={selectedFinding.targetText}
                    suggested={selectedFinding.reasoning.suggestedCorrection}
                  />
                </div>

                {/* 6. Human Decision Chain */}
                <div className="pt-3 border-t border-[#D8D5CE] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#171717]">
                      06 // HUMAN ARBITRATION RECORD
                    </span>
                    {selectedFinding.humanDecision && (
                      <span className="border border-[#2D5A38] text-[#2D5A38] bg-[#EEF4EF] font-mono text-[10px] px-2 py-0.5 uppercase">
                        {selectedFinding.humanDecision.status}
                      </span>
                    )}
                  </div>

                  {selectedFinding.humanDecision ? (
                    <div className="bg-[#F7F6F2] p-3 border border-[#D8D5CE] space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#73716B]">
                        <span>BY: {selectedFinding.humanDecision.decidedBy} ({selectedFinding.humanDecision.role})</span>
                        <span>{selectedFinding.humanDecision.timestamp}</span>
                      </div>
                      <p className="text-[#171717] font-serif italic text-sm">
                        "{selectedFinding.humanDecision.reason}"
                      </p>
                      {selectedFinding.humanDecision.customReplacement && (
                        <p className="text-[#2D5A38] font-mono text-[11px]">
                          CUSTOM REPLACEMENT: "{selectedFinding.humanDecision.customReplacement}"
                        </p>
                      )}
                      <button
                        onClick={() => {
                          setDecisionReason(selectedFinding.humanDecision?.reason || '');
                          selectedFinding.humanDecision = undefined;
                        }}
                        className="text-[11px] text-[#9B382B] underline underline-offset-4 pt-1 block font-mono"
                      >
                        Revise this decision
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 bg-[#F7F6F2] p-3.5 border border-[#D8D5CE]">
                      {/* Reason input (Mandatory) */}
                      <div>
                        <label className="text-[10px] font-mono uppercase tracking-widest text-[#171717] block mb-1">
                          Recorded Justification <span className="text-[#9B382B]">*</span>
                        </label>
                        <input
                          type="text"
                          value={decisionReason}
                          onChange={(e) => setDecisionReason(e.target.value)}
                          placeholder="e.g. Approved rebranding replacement per Q1 Brand Kit."
                          className="w-full text-xs px-3 py-2 border border-[#D8D5CE] bg-[#FFFFFF] text-[#171717] focus:border-[#171717] focus:outline-none"
                        />
                      </div>

                      {/* Custom correction toggle */}
                      {showEditInput && (
                        <div>
                          <label className="text-[10px] font-mono uppercase tracking-widest text-[#171717] block mb-1">
                            Custom Replacement Text
                          </label>
                          <input
                            type="text"
                            value={customCorrection}
                            onChange={(e) => setCustomCorrection(e.target.value)}
                            placeholder={selectedFinding.reasoning.suggestedCorrection}
                            className="w-full text-xs px-3 py-2 border border-[#D8D5CE] bg-[#FFFFFF] text-[#171717] focus:border-[#171717] focus:outline-none"
                          />
                        </div>
                      )}

                      {/* Decision buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
                        <button
                          onClick={() => handleDecision('accepted')}
                          className="bg-[#2D5A38] hover:bg-[#22442a] text-[#F7F6F2] py-2 px-2 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" /> Accept Fix
                        </button>

                        <button
                          onClick={() => {
                            setShowEditInput(!showEditInput);
                            if (showEditInput && customCorrection) {
                              handleDecision('edited');
                            }
                          }}
                          className="bg-[#171717] hover:bg-[#2b2b2b] text-[#F7F6F2] py-2 px-2 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> {showEditInput ? 'Save Edit' : 'Edit Fix'}
                        </button>

                        <button
                          onClick={() => handleDecision('disputed')}
                          className="border border-[#D8D5CE] hover:border-[#171717] bg-[#FFFFFF] text-[#171717] py-2 px-2 transition-colors"
                        >
                          Dispute Finding
                        </button>

                        <button
                          onClick={() => handleDecision('escalated')}
                          className="border border-[#8C6228] bg-[#F7F2E8] text-[#8C6228] py-2 px-2 transition-colors font-semibold"
                        >
                          Escalate to Legal
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-[#D8D5CE] bg-[#FFFFFF] p-10 text-center space-y-2">
              <Check className="w-8 h-8 text-[#2D5A38] mx-auto mb-1" />
              <p className="font-serif text-lg text-[#171717]">All findings reviewed</p>
              <p className="text-xs text-[#73716B]">Draft meets verified criteria or all changes have been enacted.</p>
            </div>
          )}
        </div>
      </div>

      {/* Approval Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-[#171717]/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] max-w-lg w-full p-8 border border-[#171717] shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#D8D5CE] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#73716B]">GOVERNANCE SEAL</span>
                <h3 className="font-serif text-xl text-[#171717] mt-0.5 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2D5A38]" />
                  Sign Off & Cryptographically Seal Draft
                </h3>
              </div>
              <button
                onClick={() => setShowApproveModal(false)}
                className="w-8 h-8 hover:bg-[#F7F6F2] text-[#73716B] hover:text-[#171717] flex items-center justify-center text-xl transition-colors"
              >
                &times;
              </button>
            </div>
            <p className="text-xs text-[#5C5B57] leading-relaxed">
              Applying this sign-off binds the exact content hash (sha256) into the immutable audit trail. Any future edits
              to this text will automatically revoke approval and trigger a re-review alert.
            </p>
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#171717] block mb-1">
                Compliance Justification <span className="text-[#9B382B]">*</span>
              </label>
              <textarea
                rows={3}
                value={approvalJustification}
                onChange={(e) => setApprovalJustification(e.target.value)}
                className="w-full text-xs p-3 border border-[#D8D5CE] bg-[#F7F6F2] text-[#171717] focus:border-[#171717] focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-[#D8D5CE]">
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-3 py-1.5 text-xs text-[#73716B] hover:text-[#171717] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (approvalJustification.trim()) {
                    approveSubmission(activeSubmission.id, approvalJustification.trim());
                    setShowApproveModal(false);
                  } else {
                    showToast('Justification is required for approval.');
                  }
                }}
                className="bg-[#171717] hover:bg-[#2b2b2b] text-[#F7F6F2] font-medium px-4 py-2 text-xs border border-[#171717] transition-colors"
              >
                Sign Off & Bind Hash Seal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};