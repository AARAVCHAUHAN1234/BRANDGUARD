import React from 'react';
import { Check } from 'lucide-react';

export const RoadmapResponsibleView: React.FC = () => {
  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border border-[#D8D5CE] bg-[#FFFFFF] p-8 md:p-10 space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#73716B]">
            CHARTER // MANIFESTO 07
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#171717] border border-[#D8D5CE] px-1.5 py-0.2 bg-[#F7F6F2]">
            ACCOUNTABLE AI SPECIFICATION
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl text-[#171717] font-normal tracking-tight">
          Architecture Roadmap & Responsible AI Charter
        </h1>
        <p className="text-xs text-[#73716B] leading-relaxed max-w-3xl pt-1">
          BrandGuard is architected as an accountable verification filter between raw evidence and public issuance. We prioritize strict determinism, source grounding, and human accountability over unchecked generative output.
        </p>
      </div>

      {/* Responsible AI Principles - Swiss Editorial Layout */}
      <div className="border border-[#D8D5CE] bg-[#FFFFFF] p-8 md:p-10 space-y-6">
        <div className="border-b border-[#D8D5CE] pb-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#73716B]">FOUNDATIONAL DOCTRINE</span>
          <h2 className="font-serif text-2xl text-[#171717] mt-1">The Six Pillars of Defensible Governance</h2>
          <p className="text-xs text-[#73716B]">Principles ensuring all governance decisions remain auditable, defensible, and legally sound.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          <div className="border-t border-[#D8D5CE] pt-4 space-y-2">
            <span className="font-mono text-xs text-[#9B382B]">01 // DETERMINISTIC FOUNDATION</span>
            <h4 className="font-serif text-base text-[#171717]">Rule Strictness Over Drift</h4>
            <p className="text-xs text-[#5C5B57] leading-relaxed">
              Regex filters, trademark registries, and temporal window validators execute first without stochastic randomness or hallucination risk.
            </p>
          </div>

          <div className="border-t border-[#D8D5CE] pt-4 space-y-2">
            <span className="font-mono text-xs text-[#9B382B]">02 // SOURCE GROUNDING</span>
            <h4 className="font-serif text-base text-[#171717]">Retrieval-Bound Heuristics</h4>
            <p className="text-xs text-[#5C5B57] leading-relaxed">
              When models are queried, they retrieve exclusively from verified knowledge base records. Statements lacking verifiable sources are arrested.
            </p>
          </div>

          <div className="border-t border-[#D8D5CE] pt-4 space-y-2">
            <span className="font-mono text-xs text-[#9B382B]">03 // EXPLAINABILITY</span>
            <h4 className="font-serif text-base text-[#171717]">Unbroken Reasoning Chains</h4>
            <p className="text-xs text-[#5C5B57] leading-relaxed">
              Every finding traces: Manuscript Claim → Governing Rule → Evidence Artifact → Plain Rationale → Minimal Diff.
            </p>
          </div>

          <div className="border-t border-[#D8D5CE] pt-4 space-y-2">
            <span className="font-mono text-xs text-[#9B382B]">04 // ARBITRATION</span>
            <h4 className="font-serif text-base text-[#171717]">Mandatory Human Sovereignty</h4>
            <p className="text-xs text-[#5C5B57] leading-relaxed">
              Automated heuristics never issue release authorization. Certified human sign-off is non-negotiable for public distribution.
            </p>
          </div>

          <div className="border-t border-[#D8D5CE] pt-4 space-y-2">
            <span className="font-mono text-xs text-[#9B382B]">05 // INTEGRITY</span>
            <h4 className="font-serif text-base text-[#171717]">Cryptographic Version Seals</h4>
            <p className="text-xs text-[#5C5B57] leading-relaxed">
              Sign-offs bind to the cryptographic content hash. Post-approval modifications immediately void permissions and reopen review.
            </p>
          </div>

          <div className="border-t border-[#D8D5CE] pt-4 space-y-2">
            <span className="font-mono text-xs text-[#9B382B]">06 // PRIVACY</span>
            <h4 className="font-serif text-base text-[#171717]">Zero Model Training Retention</h4>
            <p className="text-xs text-[#5C5B57] leading-relaxed">
              Client copy is never retained for public model training. Immutable audit logs permanently store actor rationales.
            </p>
          </div>
        </div>
      </div>

      {/* Tier 1 / 2 / 3 Roadmap Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tier 1 */}
        <div className="border border-[#171717] bg-[#FFFFFF] p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#D8D5CE] pb-2 font-mono text-xs">
              <span className="text-[#2D5A38] uppercase tracking-wider font-semibold">Tier 1 // Prototype</span>
              <span className="w-1.5 h-1.5 bg-[#2D5A38]" />
            </div>

            <h3 className="font-serif text-xl text-[#171717]">Core Governance Engine</h3>

            <ul className="text-xs space-y-2 text-[#5C5B57]">
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[#2D5A38] shrink-0 mt-0.5" />
                <span>Versioned brand rules, facts & source files</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[#2D5A38] shrink-0 mt-0.5" />
                <span>Deterministic manuscript and copy evaluation</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[#2D5A38] shrink-0 mt-0.5" />
                <span>6-step reasoning chains with minimal-change diffs</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[#2D5A38] shrink-0 mt-0.5" />
                <span>Version-bound cryptographic hash reset protocol</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[#2D5A38] shrink-0 mt-0.5" />
                <span>Time-aware expiration & telemetry conflict alerts</span>
              </li>
            </ul>
          </div>

          <div className="pt-3 border-t border-[#D8D5CE] font-mono text-[10px] uppercase text-[#2D5A38]">
            100% OPERATIONAL & VERIFIED
          </div>
        </div>

        {/* Tier 2 */}
        <div className="border border-[#D8D5CE] bg-[#FFFFFF] p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#D8D5CE] pb-2 font-mono text-xs text-[#73716B]">
              <span className="uppercase tracking-wider">Tier 2 // Roadmap</span>
              <span>Q2 2025</span>
            </div>

            <h3 className="font-serif text-xl text-[#171717]">Multimodal Intake & Assets</h3>

            <ul className="text-xs space-y-2 text-[#73716B]">
              <li className="flex items-start gap-2">
                <span className="font-mono text-[#D8D5CE]">—</span>
                <span>PDF and Microsoft Word DOCX multi-page ingestion</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-[#D8D5CE]">—</span>
                <span>Figma banner OCR & retired logo computer vision</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-[#D8D5CE]">—</span>
                <span>Automated WCAG contrast vector verification</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-[#D8D5CE]">—</span>
                <span>Enterprise Slack / Teams sign-off dispatch bot</span>
              </li>
            </ul>
          </div>

          <div className="pt-3 border-t border-[#D8D5CE] font-mono text-[10px] uppercase text-[#73716B]">
            SCHEDULED SPECIFICATION
          </div>
        </div>

        {/* Tier 3 */}
        <div className="border border-[#D8D5CE] bg-[#FFFFFF] p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#D8D5CE] pb-2 font-mono text-xs text-[#73716B]">
              <span className="uppercase tracking-wider">Tier 3 // Roadmap</span>
              <span>Q3 2025</span>
            </div>

            <h3 className="font-serif text-xl text-[#171717]">Distribution Gateway</h3>

            <ul className="text-xs space-y-2 text-[#73716B]">
              <li className="flex items-start gap-2">
                <span className="font-mono text-[#D8D5CE]">—</span>
                <span>Direct Hubspot, Marketo & Webflow release webhooks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-[#D8D5CE]">—</span>
                <span>Continuous public web crawler for post-release drift</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-[#D8D5CE]">—</span>
                <span>Automated competitor rebuttal claim matching</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-[#D8D5CE]">—</span>
                <span>SOC 2 Type II audit report auto-generation</span>
              </li>
            </ul>
          </div>

          <div className="pt-3 border-t border-[#D8D5CE] font-mono text-[10px] uppercase text-[#73716B]">
            LONG-TERM HORIZON
          </div>
        </div>
      </div>

      {/* Mandatory Disclaimer Footer */}
      <div className="border border-[#D8D5CE] bg-[#F7F6F2] p-4 text-center font-mono text-xs text-[#73716B]">
        Design prototype & architecture specification. No compliance certification or production warranty is claimed.
      </div>
    </div>
  );
};