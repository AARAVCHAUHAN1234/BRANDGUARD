import React, { useState } from 'react';
import { useBrand } from '../context/BrandContext';
import { DEMO_ROLES } from '../data/seedData';
import { Key, RotateCcw, Sparkles, Check } from 'lucide-react';

export const Header: React.FC<{ onNavigate: (view: string) => void; currentView?: string }> = ({
  onNavigate,
}) => {
  const {
    currentRole,
    setCurrentRole,
    resetDemoData,
    startGuidedTour,
    apiKey,
    setApiKey,
    showToast,
  } = useBrand();

  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);

  const handleSaveKey = () => {
    setApiKey(tempKey);
    setShowKeyModal(false);
    showToast('Gemini API key configured for contextual reviews.');
  };

  return (
    <>
      <header className="bg-[#FFFFFF] border-b border-[#D8D5CE] px-6 py-3.5 sticky top-0 z-40">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Logo & Masthead Tagline */}
          <div
            className="flex items-center gap-4 cursor-pointer select-none group"
            onClick={() => onNavigate('dashboard')}
          >
            <div className="w-8 h-8 bg-[#171717] text-[#F7F6F2] flex items-center justify-center font-serif text-lg font-normal tracking-tight transition-transform group-hover:scale-95">
              B
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2.5">
                <span className="font-serif text-2xl tracking-tight text-[#171717] leading-none">
                  BrandGuard
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#73716B] border border-[#D8D5CE] px-1.5 py-0.2">
                  VERIFIED PROTOCOL
                </span>
              </div>
              <p className="text-[11px] text-[#73716B] tracking-tight mt-0.5 hidden sm:block">
                Evidence-backed brand governance before publication.
              </p>
            </div>
          </div>

          {/* Action Bar & Role Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Guided Demo Button */}
            <button
              onClick={() => {
                onNavigate('workspace');
                startGuidedTour();
              }}
              className="flex items-center gap-2 bg-[#171717] hover:bg-[#2b2b2b] text-[#F7F6F2] text-xs font-medium px-3.5 py-1.5 border border-[#171717] transition-colors"
              title="Step-by-step interactive demo walkthrough"
              id="btn-guided-demo"
            >
              <Sparkles className="w-3 h-3 text-[#9B382B]" />
              <span>Guided Tour</span>
            </button>

            {/* Optional Gemini Key Button */}
            <button
              onClick={() => setShowKeyModal(true)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 border transition-colors ${
                apiKey
                  ? 'border-[#2D5A38] bg-[#EEF4EF] text-[#2D5A38]'
                  : 'border-[#D8D5CE] text-[#5C5B57] hover:text-[#171717] hover:border-[#171717] bg-transparent'
              }`}
              title="Configure optional Gemini API Key"
            >
              <Key className="w-3 h-3" />
              <span>{apiKey ? 'API Active' : 'API Key'}</span>
            </button>

            {/* Reset Demo Data Button */}
            <button
              onClick={resetDemoData}
              className="flex items-center gap-1.5 border border-[#D8D5CE] text-[#5C5B57] hover:text-[#171717] hover:border-[#171717] text-xs px-3 py-1.5 bg-transparent transition-colors"
              title="Reset all drafts, rules, and facts to pristine seed state"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            {/* Editorial Role Switcher */}
            <div className="flex items-center border border-[#D8D5CE] bg-[#F7F6F2] p-0.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#73716B] px-2 hidden xl:inline">
                ACTOR:
              </span>
              <div className="flex items-center">
                {DEMO_ROLES.map((r) => {
                  const isActive = r.id === currentRole;
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        setCurrentRole(r.id);
                        showToast(`Active persona: ${r.name} (${r.title})`);
                      }}
                      className={`flex items-center gap-1.5 px-2.5 py-1 text-xs transition-colors ${
                        isActive
                          ? 'bg-[#171717] text-[#F7F6F2] font-medium'
                          : 'text-[#5C5B57] hover:text-[#171717] hover:bg-[#EAE6DB]/60'
                      }`}
                      aria-label={`Switch role to ${r.name}`}
                    >
                      <span className="font-mono text-[10px] opacity-75">{r.avatar}</span>
                      <span className="hidden sm:inline">{r.name.split(' ')[0]}</span>
                      {isActive && <Check className="w-3 h-3 text-[#9B382B]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Gemini API Key Modal - Minimal Editorial Form */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-[#171717]/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] max-w-md w-full p-6 sm:p-8 border border-[#171717] shadow-xl space-y-5">
            <div className="flex items-baseline justify-between border-b border-[#D8D5CE] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#73716B]">CONFIGURATION</span>
                <h3 className="font-serif text-2xl text-[#171717]">Gemini API Access</h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-[#73716B] hover:text-[#171717] text-xl font-light leading-none"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-[#5C5B57] leading-relaxed">
              BrandGuard operates deterministically out-of-the-box. Providing an optional API key activates live contextual reasoning grounded in the active knowledge base.
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#171717] block">
                API Key
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                className="w-full text-xs font-mono px-3.5 py-2.5 border border-[#D8D5CE] bg-[#F7F6F2] text-[#171717] focus:border-[#171717] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#D8D5CE]">
              <button
                onClick={() => {
                  setTempKey('');
                  setApiKey('');
                  setShowKeyModal(false);
                }}
                className="px-3 py-1.5 text-xs text-[#73716B] hover:text-[#171717]"
              >
                Clear
              </button>
              <button
                onClick={handleSaveKey}
                className="px-4 py-2 text-xs font-medium bg-[#171717] text-[#F7F6F2] hover:bg-[#2b2b2b] border border-[#171717] transition-colors"
              >
                Save & Enable
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};