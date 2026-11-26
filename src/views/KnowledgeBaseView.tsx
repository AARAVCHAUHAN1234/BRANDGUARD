import React, { useState } from 'react';
import { useBrand } from '../context/BrandContext';
import { BrandRule } from '../types';
import {
  Lock,
  Edit2,
  AlertTriangle,
  Clock,
} from 'lucide-react';

export const KnowledgeBaseView: React.FC = () => {
  const { rules, facts, terminology, currentRole, addRuleVersion, showToast } =
    useBrand();

  const [activeTab, setActiveTab] = useState<'rules' | 'facts' | 'terminology' | 'sources'>('rules');
  const [editingRule, setEditingRule] = useState<BrandRule | null>(null);
  const [ruleEditReason, setRuleEditReason] = useState<string>('');
  const [ruleEditDesc, setRuleEditDesc] = useState<string>('');

  const handleSaveRuleVersion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule) return;
    if (!ruleEditReason.trim()) {
      showToast('Version bump requires a change reason for governance audit.');
      return;
    }

    addRuleVersion(
      editingRule.id,
      {
        description: ruleEditDesc || editingRule.description,
      },
      ruleEditReason
    );

    setEditingRule(null);
    setRuleEditReason('');
    setRuleEditDesc('');
    showToast(`Bumped ${editingRule.id} to new version.`);
  };

  const isBrandManager = currentRole === 'brand_manager' || currentRole === 'legal';

  return (
    <div className="space-y-8">
      {/* Knowledge Base Header */}
      <div className="border border-[#D8D5CE] bg-[#FFFFFF] p-8 flex flex-col md:flex-row md:items-baseline md:justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#73716B]">
              ARCHIVE // REPOSITORY 04
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#2D5A38] border border-[#2D5A38]/30 px-1.5 py-0.2 bg-[#EEF4EF]">
              IMMUTABLE CORPUS
            </span>
          </div>

          <h1 className="font-serif text-3xl text-[#171717]">Brand Knowledge Base</h1>
          <p className="text-xs text-[#73716B] leading-relaxed">
            Version-controlled repository of governance rules, verified factual evidence, approved terminology, and legal audits. Every alteration increments version state with permanent audit provenance.
          </p>
        </div>

        {/* Tab selection */}
        <div className="flex items-center border border-[#D8D5CE] bg-[#F7F6F2] p-0.5 shrink-0 font-mono text-xs">
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 transition-colors ${
              activeTab === 'rules' ? 'bg-[#171717] text-[#F7F6F2] font-medium' : 'text-[#5C5B57] hover:text-[#171717]'
            }`}
          >
            Rules ({rules.length})
          </button>
          <button
            onClick={() => setActiveTab('facts')}
            className={`px-3 py-1.5 transition-colors ${
              activeTab === 'facts' ? 'bg-[#171717] text-[#F7F6F2] font-medium' : 'text-[#5C5B57] hover:text-[#171717]'
            }`}
          >
            Evidence ({facts.length})
          </button>
          <button
            onClick={() => setActiveTab('terminology')}
            className={`px-3 py-1.5 transition-colors ${
              activeTab === 'terminology' ? 'bg-[#171717] text-[#F7F6F2] font-medium' : 'text-[#5C5B57] hover:text-[#171717]'
            }`}
          >
            Lexicon ({terminology.length})
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`px-3 py-1.5 transition-colors ${
              activeTab === 'sources' ? 'bg-[#171717] text-[#F7F6F2] font-medium' : 'text-[#5C5B57] hover:text-[#171717]'
            }`}
          >
            Audits
          </button>
        </div>
      </div>

      {/* Rules Tab */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between font-mono text-xs text-[#73716B]">
            <span>Active heuristic criteria. Authorized edits require Brand Manager or Legal authority.</span>
            {!isBrandManager && (
              <span className="flex items-center gap-1.5 border border-[#D8D5CE] px-2 py-0.5 bg-[#FFFFFF]">
                <Lock className="w-3 h-3 text-[#73716B]" />
                <span>READ-ONLY VIEW</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="border border-[#D8D5CE] bg-[#FFFFFF] p-6 flex flex-col justify-between hover:border-[#171717] transition-colors"
              >
                <div>
                  <div className="flex items-baseline justify-between gap-2 mb-3 border-b border-[#D8D5CE] pb-2 font-mono text-xs">
                    <span className="text-[#171717] font-semibold">{rule.id}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#73716B]">v{rule.version}</span>
                      <span
                        className={`text-[10px] uppercase px-1.5 py-0.2 border ${
                          rule.severity === 'Critical'
                            ? 'border-[#9B382B] text-[#9B382B] bg-[#F6ECEB]'
                            : rule.severity === 'High'
                            ? 'border-[#8C6228] text-[#8C6228] bg-[#F7F2E8]'
                            : 'border-[#73716B] text-[#73716B] bg-[#F7F6F2]'
                        }`}
                      >
                        {rule.severity}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-serif text-lg text-[#171717] mb-1.5">{rule.name}</h3>
                  <p className="text-xs text-[#5C5B57] leading-relaxed mb-4">{rule.description}</p>

                  <div className="bg-[#F7F6F2] p-3 border border-[#D8D5CE] text-xs mb-4">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#73716B] block mb-1">
                      Matched Pattern / Restriction:
                    </span>
                    <code className="text-[#171717] font-mono text-[11px] break-all">{rule.patternSummary}</code>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#D8D5CE] text-[11px] font-mono text-[#73716B] flex items-center justify-between">
                  <div>
                    <span>OWNER: {rule.owner}</span>
                    <span className="mx-2">•</span>
                    <span>EFF: {rule.effectiveDate}</span>
                  </div>

                  {isBrandManager && (
                    <button
                      onClick={() => {
                        setEditingRule(rule);
                        setRuleEditDesc(rule.description);
                      }}
                      className="flex items-center gap-1.5 text-xs text-[#171717] hover:underline underline-offset-4"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Increment Version</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved Facts Tab */}
      {activeTab === 'facts' && (
        <div className="space-y-4">
          <div className="p-4 border border-[#8C6228] bg-[#F7F2E8] text-xs text-[#8C6228] flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-[#8C6228] shrink-0 mt-0.5" />
            <div>
              <span className="font-mono uppercase tracking-wider font-semibold block">
                Time-Bound & Provenance Verification Registry
              </span>
              <p className="mt-1 leading-relaxed">
                Fact sources enforce temporal expiration dates and internal telemetry conflict detection. Expired facts (e.g. FACT-003) immediately block unverified public claims until recertified.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {facts.map((fact) => (
              <div
                key={fact.id}
                className={`border bg-[#FFFFFF] p-6 flex flex-col justify-between ${
                  fact.status === 'Expired'
                    ? 'border-[#9B382B]'
                    : fact.conflictWithId
                    ? 'border-[#8C6228]'
                    : 'border-[#D8D5CE]'
                }`}
              >
                <div>
                  <div className="flex items-baseline justify-between mb-3 border-b border-[#D8D5CE] pb-2 font-mono text-xs">
                    <span className="text-[#171717] font-semibold">{fact.id}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#73716B]">v{fact.version}</span>
                      <span
                        className={`text-[10px] uppercase px-1.5 py-0.2 border ${
                          fact.status === 'Active'
                            ? 'border-[#2D5A38] text-[#2D5A38] bg-[#EEF4EF]'
                            : 'border-[#9B382B] text-[#9B382B] bg-[#F6ECEB]'
                        }`}
                      >
                        {fact.status}
                      </span>
                    </div>
                  </div>

                  <p className="font-serif text-base text-[#171717] mb-3 leading-relaxed">
                    "{fact.fact}"
                  </p>

                  <div className="space-y-1 text-xs mb-3 font-mono text-[#73716B]">
                    <div>
                      <span className="text-[#171717]">SOURCE:</span> {fact.sourceTitle}
                    </div>
                    <div>
                      <span className="text-[#171717]">REF:</span> {fact.sourceRef}
                    </div>
                  </div>

                  {/* Conflict warning */}
                  {fact.conflictWithId && (
                    <div className="border border-[#8C6228] bg-[#F7F2E8] text-[#8C6228] p-3 text-xs mb-3">
                      <span className="font-mono uppercase font-semibold flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" /> Conflict Detected:
                      </span>
                      <p className="mt-1 text-[11px] leading-relaxed">{fact.conflictReason}</p>
                    </div>
                  )}

                  {/* Expired warning */}
                  {fact.status === 'Expired' && (
                    <div className="border border-[#9B382B] bg-[#F6ECEB] text-[#9B382B] p-3 text-xs mb-3">
                      <span className="font-mono uppercase font-semibold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Expired Provenance:
                      </span>
                      <p className="mt-1 text-[11px] leading-relaxed">
                        Expired on {fact.expiryDate}. Claims referencing this credential are automatically blocked.
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#D8D5CE] text-[11px] font-mono text-[#73716B] flex items-center justify-between">
                  <span>OWNER: {fact.owner}</span>
                  <span>EXPIRES: {fact.expiryDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Terminology Tab */}
      {activeTab === 'terminology' && (
        <div className="border border-[#D8D5CE] bg-[#FFFFFF]">
          <div className="p-6 border-b border-[#D8D5CE] bg-[#F7F6F2]">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#73716B]">
              LEXICON // CANONICAL DICTIONARY
            </span>
            <h3 className="font-serif text-2xl text-[#171717] mt-1">Brand Terminology Mapping</h3>
            <p className="text-xs text-[#73716B] mt-0.5">
              Authorized organizational vocabulary and deprecated expressions.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFFFFF] text-[#73716B] font-mono uppercase text-[10px] tracking-wider border-b border-[#D8D5CE]">
                <tr>
                  <th className="py-3 px-5">Deprecated Term</th>
                  <th className="py-3 px-5">Authorized Replacement</th>
                  <th className="py-3 px-5">Category</th>
                  <th className="py-3 px-5">Policy Rationale</th>
                  <th className="py-3 px-5">Version</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE6DB]">
                {terminology.map((term) => (
                  <tr key={term.id} className="hover:bg-[#F7F6F2]/70 transition-colors">
                    <td className="py-4 px-5 font-mono text-[#9B382B] line-through">
                      "{term.forbidden}"
                    </td>
                    <td className="py-4 px-5 font-medium text-[#2D5A38]">
                      "{term.preferred}"
                    </td>
                    <td className="py-4 px-5 font-mono text-[#73716B]">{term.category}</td>
                    <td className="py-4 px-5 text-[#5C5B57]">{term.rationale}</td>
                    <td className="py-4 px-5 font-mono text-[#73716B]">v{term.version}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sources Tab */}
      {activeTab === 'sources' && (
        <div className="border border-[#D8D5CE] bg-[#FFFFFF] p-8 space-y-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#73716B]">
              AUDIT // EVIDENCE DOSSIERS
            </span>
            <h3 className="font-serif text-2xl text-[#171717] mt-1">Third-Party Evidence Registries</h3>
            <p className="text-xs text-[#73716B] leading-relaxed max-w-2xl mt-1">
              BrandGuard connects every claim directly to an immutable enterprise artifact. In regulatory inquiries, every published sentence maps to a signed audit source file.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            <div className="p-5 border border-[#D8D5CE] bg-[#F7F6F2] space-y-2">
              <span className="font-serif text-base text-[#171717] block">SOC 2 Type II Compliance Report</span>
              <p className="text-[#73716B] text-[11px] font-mono">Audited by Ernst & Young LLP • April 2024</p>
              <span className="inline-block border border-[#2D5A38] text-[#2D5A38] bg-[#EEF4EF] px-2 py-0.5 font-mono text-[10px] uppercase">
                Active & Certified
              </span>
            </div>

            <div className="p-5 border border-[#8C6228] bg-[#F7F2E8] space-y-2">
              <span className="font-serif text-base text-[#171717] block">Forrester TEI™ Customer Study</span>
              <p className="text-[#73716B] text-[11px] font-mono">Forrester Research Inc. • March 2024</p>
              <span className="inline-block border border-[#8C6228] text-[#8C6228] bg-[#FFFFFF] px-2 py-0.5 font-mono text-[10px] uppercase">
                Internal Conflict Noted
              </span>
            </div>

            <div className="p-5 border border-[#9B382B] bg-[#F6ECEB] space-y-2">
              <span className="font-serif text-base text-[#171717] block">Gartner Peer Insights 2022</span>
              <p className="text-[#73716B] text-[11px] font-mono">Customer Choice Badging • Expired Dec 2023</p>
              <span className="inline-block border border-[#9B382B] text-[#9B382B] bg-[#FFFFFF] px-2 py-0.5 font-mono text-[10px] uppercase">
                Expired / Prohibited
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Version Edit Modal - Minimal Editorial Form */}
      {editingRule && (
        <div className="fixed inset-0 bg-[#171717]/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] max-w-lg w-full p-8 border border-[#171717] shadow-2xl space-y-5">
            <div className="border-b border-[#D8D5CE] pb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#73716B]">
                GOVERNANCE AMENDMENT
              </span>
              <h3 className="font-serif text-2xl text-[#171717] mt-1">
                Increment Rule Version ({editingRule.id})
              </h3>
              <p className="text-xs text-[#73716B] mt-1">
                Version {editingRule.version} will be archived into permanent forensic storage. A new minor version will be minted.
              </p>
            </div>

            <form onSubmit={handleSaveRuleVersion} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[#171717] block">
                  Revised Rule Description
                </label>
                <textarea
                  rows={3}
                  value={ruleEditDesc}
                  onChange={(e) => setRuleEditDesc(e.target.value)}
                  className="w-full text-xs p-3 border border-[#D8D5CE] bg-[#F7F6F2] text-[#171717] focus:border-[#171717] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[#171717] block">
                  Change Rationale <span className="text-[#9B382B]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Expanded FTC substantiation clause to include EU DMA regulations."
                  value={ruleEditReason}
                  onChange={(e) => setRuleEditReason(e.target.value)}
                  className="w-full text-xs p-3 border border-[#D8D5CE] bg-[#F7F6F2] text-[#171717] focus:border-[#171717] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#D8D5CE]">
                <button
                  type="button"
                  onClick={() => setEditingRule(null)}
                  className="px-3 py-1.5 text-xs text-[#73716B] hover:text-[#171717]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#171717] hover:bg-[#2b2b2b] text-[#F7F6F2] font-medium px-4 py-2 border border-[#171717] transition-colors"
                >
                  Publish New Version
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};