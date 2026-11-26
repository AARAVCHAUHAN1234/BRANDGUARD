import React, { useState } from 'react';
import { useBrand } from '../context/BrandContext';
import { DEMO_ROLES } from '../data/seedData';
import { Shield, Sparkles, RotateCcw, Key, Check } from 'lucide-react';

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
  const [isResetting, setIsResetting] = useState(false);

  const handleSaveKey = () => {
    setApiKey(tempKey);
    setShowKeyModal(false);
    showToast('Gemini API key configured for contextual reviews.');
  };

  const handleResetWithAnimation = () => {
    setIsResetting(true);
    resetDemoData();
    setTimeout(() => {
      setIsResetting(false);
      showToast('All demo drafts, rules, and facts restored to pristine state.');
    }, 400);
  };

  return (
    <>
      <header className="bg-[#FFFFFF] text-[#171717] border-b border-[#D8D5CE] px-6 lg:px-10 py-4 sticky top-0 z-40 select-none">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 max-w-[1850px] mx-auto w-full">
          {/* Logo & Brand Identity */}
          <div
            className="flex items-center gap-3.5 cursor-pointer group shrink-0"
            onClick={() => onNavigate('dashboard')}
          >
            <div className="w-10 h-10 border border-[#171717] bg-[#F7F6F2] flex items-center justify-center text-[#171717] group-hover:bg-[#171717] group-hover:text-[#F7F6F2] transition-colors">
              <Shield className="w-5 h-5 stroke-[1.75]" />
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-serif text-2xl tracking-tight text-[#171717]">
                  BrandGuard AI
                </span>
                <span className="border border-[#D8D5CE] bg-[#F7F6F2] text-[#73716B] text-[10px] font-mono uppercase px-2 py-0.5 tracking-widest">
                  Enterprise Control Layer
                </span>
              </div>
              <p className="text-[11px] text-[#73716B] font-mono tracking-tight mt-0.5">
                Governance before publication. Every content decision backed by evidence.
              </p>
            </div>
          </div>

          {/* Action Center & Persona Switcher */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Guided Demo Button */}
            <button
              onClick={() => {
                onNavigate('workspace');
                startGuidedTour();
              }}
              className="flex items-center gap-2 bg-[#171717] hover:bg-[#2b2b2b] text-[#F7F6F2] text-xs font-medium px-3.5 py-2 border border-[#171717] transition-colors"
              title="Launch interactive 60-second guided demo walkthrough"
              id="btn-guided-demo"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#9B382B]" />
              <span>Guided Demo (60s)</span>
            </button>

            {/* Gemini API Key Button */}
            <button
              onClick={() => setShowKeyModal(true)}
              className={`flex items-center gap-1.5 text-xs font-mono px-3 py-2 border transition-colors ${
                apiKey
                  ? 'bg-[#EEF4EF] border-[#2D5A38] text-[#2D5A38]'
                  : 'bg-[#FFFFFF] hover:bg-[#F7F6F2] border-[#D8D5CE] text-[#5C5B57] hover:text-[#171717]'
              }`}
              title="Configure optional Gemini API Key"
            >
              <Key className="w-3.5 h-3.5" />
              <span>{apiKey ? 'Gemini AI Active' : 'Gemini Key'}</span>
            </button>

            {/* Reset Demo Data Button */}
            <button
              onClick={handleResetWithAnimation}
              className="flex items-center gap-1.5 bg-[#FFFFFF] hover:bg-[#F7F6F2] border border-[#D8D5CE] text-[#5C5B57] hover:text-[#171717] text-xs font-mono px-3 py-2 transition-colors"
              title="Reset all drafts, rules, and facts to pristine seed state"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>

            {/* Persona Role Switcher */}
            <div className="flex items-center bg-[#F7F6F2] p-0.5 border border-[#D8D5CE] gap-0.5">
              <span className="text-[10px] font-mono text-[#73716B] uppercase tracking-widest px-2.5 hidden xl:inline">
                Persona:
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
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono transition-colors ${
                        isActive
                          ? 'bg-[#171717] text-[#F7F6F2]'
                          : 'text-[#73716B] hover:text-[#171717] hover:bg-[#EAE6DB]'
                      }`}
                      aria-label={`Switch role to ${r.name}`}
                      title={`${r.name} — ${r.title}`}
                    >
                      <span
                        className={`w-4 h-4 flex items-center justify-center text-[10px] font-mono border ${
                          isActive
                            ? 'bg-[#9B382B] border-[#9B382B] text-[#F7F6F2]'
                            : 'bg-[#FFFFFF] border-[#D8D5CE] text-[#5C5B57]'
                        }`}
                      >
                        {r.avatar}
                      </span>
                      <span className="hidden md:inline">{r.name.split(' ')[0]}</span>
                      {isActive && <Check className="w-3 h-3 text-[#2D5A38]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Gemini API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-[#171717]/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] max-w-md w-full p-8 border border-[#171717] shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#D8D5CE] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#73716B]">
                  CONFIGURATION
                </span>
                <h3 className="font-serif text-xl text-[#171717] mt-0.5 flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#8C6228]" />
                  Gemini API Key
                </h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="w-8 h-8 hover:bg-[#F7F6F2] text-[#73716B] hover:text-[#171717] flex items-center justify-center text-xl transition-colors"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-[#5C5B57] leading-relaxed">
              BrandGuard functions fully with deterministic rules &amp; simulated AI out-of-the-box. Providing a Gemini API key
              enables live LLM extraction strictly grounded in your active brand knowledge base.
            </p>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#171717] block mb-1">
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

            <div className="flex justify-end gap-3 pt-3 border-t border-[#D8D5CE]">
              <button
                onClick={() => {
                  setTempKey('');
                  setApiKey('');
                  setShowKeyModal(false);
                }}
                className="px-3 py-1.5 text-xs text-[#73716B] hover:text-[#171717] transition-colors"
              >
                Clear
              </button>
              <button
                onClick={handleSaveKey}
                className="px-4 py-2 text-xs font-medium bg-[#171717] hover:bg-[#2b2b2b] text-[#F7F6F2] border border-[#171717] transition-colors"
              >
                Save &amp; Enable
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
