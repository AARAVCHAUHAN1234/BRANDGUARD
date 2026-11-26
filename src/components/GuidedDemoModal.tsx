import React from 'react';
import { useBrand } from '../context/BrandContext';
import { ArrowRight, X } from 'lucide-react';

interface GuidedDemoProps {
  onNavigate: (view: string) => void;
}

export const GuidedDemoModal: React.FC<GuidedDemoProps> = ({ onNavigate }) => {
  const { tourStep, nextTourStep, endGuidedTour, setCurrentRole } = useBrand();

  if (tourStep === null) return null;

  const tourStepsData = [
    {
      step: 1,
      title: 'Load Messy Draft',
      view: 'workspace',
      description:
        'We loaded "Q4 Product Launch" into the Review Workspace. It contains retired product names ("CloudLens"), expired badges, unverified guarantees, and conflicting metrics.',
      actionText: 'Inspect Heuristic Findings',
      action: () => {
        onNavigate('workspace');
        nextTourStep();
      },
    },
    {
      step: 2,
      title: 'Inspect 6-Step Reasoning Chains',
      view: 'workspace',
      description:
        'Notice how every flagged phrase has an unbroken 6-step Reasoning Chain: Claim → Applicable Rule → Grounded Evidence → Compliance Explanation → Minimal Redline Correction → Human Arbitration.',
      actionText: 'Review Suggested Fix',
      action: () => {
        onNavigate('workspace');
        nextTourStep();
      },
    },
    {
      step: 3,
      title: 'Accept Minimal-Change Redline',
      view: 'workspace',
      description:
        'Accepting a suggested correction replaces the deprecated name with approved branding ("Nimbus Insight") while keeping author intent intact. Click "Apply All Accepted Corrections".',
      actionText: 'Switch Persona & Authorize',
      action: () => {
        setCurrentRole('legal');
        onNavigate('workspace');
        nextTourStep();
      },
    },
    {
      step: 4,
      title: 'Grant Version-Bound Cryptographic Sign-Off',
      view: 'approvals',
      description:
        'We activated Marcus Vance (Legal Counsel). Click "Sign Off & Seal Draft" to bind publication authorization directly to the cryptographic content hash.',
      actionText: 'Observe Tamper Invalidation',
      action: () => {
        onNavigate('approvals');
        nextTourStep();
      },
    },
    {
      step: 5,
      title: 'Live Alteration Invalidation Test',
      view: 'approvals',
      description:
        'Try typing or editing text in the verification test bench. The instant any character shifts, the approval seal breaks immediately and status resets to "Reopened for review".',
      actionText: 'Inspect Governance Insights',
      action: () => {
        onNavigate('insights');
        nextTourStep();
      },
    },
    {
      step: 6,
      title: 'Governance Insights & Learning Loop',
      view: 'insights',
      description:
        'BrandGuard converts repeated creator friction into empirical policy insights, discovering ambiguous directives, evidence deficits, and turnaround bottlenecks.',
      actionText: 'Conclude Tour',
      action: () => {
        endGuidedTour();
      },
    },
  ];

  const currentStepData = tourStepsData[tourStep - 1] || tourStepsData[0];

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in slide-in-from-bottom-3 duration-200">
      <div className="bg-[#FFFFFF] text-[#171717] p-6 border border-[#171717] shadow-2xl relative space-y-4">
        {/* Close Button */}
        <button
          onClick={endGuidedTour}
          className="absolute top-4 right-4 text-[#73716B] hover:text-[#171717] transition-colors"
          aria-label="Close guided demo"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Step indicator */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#9B382B]">
              GUIDED ORIENTATION // STEP 0{currentStepData.step} OF 0{tourStepsData.length}
            </span>
          </div>
          <h3 className="font-serif text-xl text-[#171717]">{currentStepData.title}</h3>
        </div>

        {/* Body */}
        <p className="text-xs text-[#5C5B57] leading-relaxed">
          {currentStepData.description}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#D8D5CE]">
          <span className="text-[10px] font-mono text-[#73716B]">
            PHASE {currentStepData.step} / {tourStepsData.length}
          </span>
          <button
            onClick={currentStepData.action}
            className="flex items-center gap-2 bg-[#171717] hover:bg-[#2b2b2b] text-[#F7F6F2] text-xs font-medium px-4 py-2 border border-[#171717] transition-colors"
          >
            <span>{currentStepData.actionText}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#9B382B]" />
          </button>
        </div>
      </div>
    </div>
  );
};