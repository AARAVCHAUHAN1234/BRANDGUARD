import React, { useState, useRef } from 'react';
import { useBrand } from '../context/BrandContext';
import { SAMPLE_DRAFTS } from '../data/seedData';
import { Check } from 'lucide-react';

export const SubmitView: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const { createNewSubmission, runReviewOnSubmission, showToast } = useBrand();

  const [title, setTitle] = useState<string>('Q4 Product Launch & Platform Update Announcement');
  const brand = 'Nimbus Analytics';
  const [channel, setChannel] = useState<'LinkedIn' | 'Website' | 'Email' | 'Press' | 'Twitter/X'>('LinkedIn');
  const [market, setMarket] = useState<'US' | 'EU' | 'India' | 'Global'>('EU');
  const [content, setContent] = useState<string>(SAMPLE_DRAFTS.messy.content);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [stepMessage, setStepMessage] = useState<string>('');

  // Mode: Text entry vs Document upload vs Vision check
  const [intakeMode, setIntakeMode] = useState<'text' | 'file' | 'vision'>('text');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isParsingFile, setIsParsingFile] = useState<boolean>(false);
  const [fileInfo, setFileInfo] = useState<{ type: SupportedFileType; wordCount: number; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Vision analysis state
  const [visionResults, setVisionResults] = useState<VisionAnalysisResult | null>(null);

  const loadPreset = (key: 'messy' | 'risky' | 'clean') => {
    const preset = SAMPLE_DRAFTS[key];
    setTitle(preset.title);
    setChannel(preset.channel);
    setMarket(preset.market);
    setContent(preset.content);
    setUploadedFile(null);
    setFileInfo(null);
    showToast(`Loaded ${key.toUpperCase()} sample draft.`);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileType = detectFileType(file);
    if (fileType === 'unsupported') {
      showToast('Unsupported file format. Upload PDF, DOCX, or TXT files.');
      return;
    }

    setUploadedFile(file);
    setIsParsingFile(true);

    try {
      const result = await parseFile(file);
      setContent(result.text);
      setFileInfo({ type: fileType, wordCount: result.wordCount, name: file.name });
      showToast(`Extracted ${result.wordCount} words from ${file.name}`);
    } catch (error: any) {
      showToast(`File parsing error: ${error.message}`);
      setUploadedFile(null);
    } finally {
      setIsParsingFile(false);
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
    setFileInfo(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleVisionFindings = (results: VisionAnalysisResult) => {
    setVisionResults(results);
    if (results.ocrText && results.ocrText.length > 0) {
      const ocrPrefix = '\n\n--- [OCR Extracted Visual Text] ---\n';
      if (!content.includes('[OCR Extracted Visual Text]')) {
        setContent((prev) => prev + ocrPrefix + results.ocrText);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      showToast('Please provide text copy to evaluate.');
      return;
    }

    setIsSubmitting(true);
    setStepMessage('Tokenizing content and loading active brand rules...');
    await new Promise((r) => setTimeout(r, 400));

    setStepMessage('Evaluating deterministic rules and approved fact sources...');
    await new Promise((r) => setTimeout(r, 500));

    setStepMessage('Computing publication readiness and reasoning chains...');
    const newSub = createNewSubmission({
      title,
      brand,
      channel,
      market,
      content,
    });

    await runReviewOnSubmission(newSub.id);
    setIsSubmitting(false);
    showToast('Governance review complete. Opening workspace...');
    onNavigate('workspace');
  };

  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const charCount = content.length;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="border border-[#D8D5CE] bg-[#FFFFFF] p-8 sm:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 pb-6 border-b border-[#D8D5CE]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#73716B]">
              INTAKE PROTOCOL // 03
            </span>
            <h1 className="font-serif text-3xl text-[#171717] mt-1">
              Submit Copy for Governance Review
            </h1>
            <p className="text-xs text-[#73716B] mt-1">
              Supply draft content, target medium, and regulatory jurisdiction before public issuance.
            </p>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Run copy, uploaded documents, or marketing assets against Nimbus brand guidelines, verified metrics, and legal
            sources before publication.
          </p>
        </div>

          {/* Quick presets */}
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-[10px] uppercase tracking-wider text-[#73716B] mr-1">PRESETS:</span>
            <button
              type="button"
              onClick={() => loadPreset('messy')}
              className="border border-[#8C6228] bg-[#F7F2E8] text-[#8C6228] hover:bg-[#8C6228] hover:text-[#F7F6F2] text-xs px-2.5 py-1 transition-colors"
            >
              Demo Messy
            </button>
            <button
              type="button"
              onClick={() => loadPreset('risky')}
              className="border border-[#9B382B] bg-[#F6ECEB] text-[#9B382B] hover:bg-[#9B382B] hover:text-[#F7F6F2] text-xs px-2.5 py-1 transition-colors"
            >
              Risky Claims
            </button>
            <button
              type="button"
              onClick={() => loadPreset('clean')}
              className="border border-[#2D5A38] bg-[#EEF4EF] text-[#2D5A38] hover:bg-[#2D5A38] hover:text-[#F7F6F2] text-xs px-2.5 py-1 transition-colors"
            >
              <option value="EU">EU (GDPR & Strict Comparative Ad Directives)</option>
              <option value="US">US (FTC Claim Substantiation Rules)</option>
              <option value="India">India (Digital Personal Data Protection Act)</option>
              <option value="Global">Global (Conservative Baseline)</option>
            </select>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#171717] block">
                Submission Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 border border-[#D8D5CE] bg-[#F7F6F2] text-[#171717] focus:border-[#171717] focus:outline-none"
                placeholder="e.g. Q4 Platform Release Announcement"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#171717] block">
                Target Medium
              </label>
              <select
                value={channel}
                onChange={(e: any) => setChannel(e.target.value)}
                className="w-full text-xs px-3 py-2.5 border border-[#D8D5CE] bg-[#F7F6F2] text-[#171717] focus:border-[#171717] focus:outline-none"
              >
                <option value="LinkedIn">LinkedIn Post</option>
                <option value="Website">Website / Blog</option>
                <option value="Email">Customer Email</option>
                <option value="Press">Press Release</option>
                <option value="Twitter/X">Twitter / X</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#171717] block">
                Jurisdiction
              </label>
              <select
                value={market}
                onChange={(e: any) => setMarket(e.target.value)}
                className="w-full text-xs px-3 py-2.5 border border-[#D8D5CE] bg-[#F7F6F2] text-[#171717] focus:border-[#171717] focus:outline-none"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center mx-auto mb-3 text-slate-500 group-hover:text-navy-900 group-hover:scale-110 transition-all">
                  <Upload className="w-6 h-6 stroke-[2]" />
                </div>
                <p className="text-sm font-bold text-slate-800">
                  Click to select PDF or Microsoft Word DOCX
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Full multi-page parsing via pdfjs-dist and mammoth. Raw text will be extracted automatically.
                </p>
                {isParsingFile && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-navy-900">
                    <Loader2 className="w-4 h-4 animate-spin text-[#14284B]" />
                    <span>Parsing document pages and extracting text spans...</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-950">{fileInfo.name}</p>
                    <p className="text-[11px] text-emerald-700">
                      Format: {fileInfo.type.toUpperCase()} • {fileInfo.wordCount} words extracted
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={clearFile}
                  className="p-1.5 rounded-lg hover:bg-emerald-100 text-emerald-700 transition-colors"
                  title="Remove uploaded file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#171717]">
                Draft Manuscript Copy
              </label>
              <span className="text-[10px] font-mono text-[#73716B]">{content.length} characters</span>
            </div>
            <textarea
              rows={9}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full text-sm font-sans p-4 border border-[#D8D5CE] bg-[#F7F6F2] text-[#171717] focus:border-[#171717] focus:outline-none leading-relaxed"
              placeholder="Paste draft copy, marketing announcement, or social copy..."
            />
          </div>
        )}

          {/* Review execution button with loading states */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-[#D8D5CE]">
            <div className="text-xs font-mono text-[#73716B] flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#2D5A38]" />
              <span>EVALUATION ENGINE: NIMBUS CORPUS V2.4</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 bg-[#171717] hover:bg-[#2b2b2b] text-[#F7F6F2] text-xs font-medium px-6 py-3 border border-[#171717] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-[#F7F6F2] border-t-transparent animate-spin" />
                  <span>{stepMessage}</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 bg-[#9B382B]" />
                  <span>Execute Verification Run</span>
                </>
              )}
            </button>
          </div>

      {/* Intake Integrations Ledger */}
      <div className="border border-[#D8D5CE] bg-[#FFFFFF] p-6 space-y-3">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#73716B] block">
          PIPELINE EXTENSIONS // ROADMAP SPECIFICATION
        </span>
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          <span className="border border-[#D8D5CE] text-[#73716B] bg-[#F7F6F2] px-3 py-1">
            PDF / DOCX Intake • Tier 2
          </span>
          <span className="border border-[#D8D5CE] text-[#73716B] bg-[#F7F6F2] px-3 py-1">
            Figma OCR & Asset Matching • Tier 2
          </span>
          <span className="border border-[#D8D5CE] text-[#73716B] bg-[#F7F6F2] px-3 py-1">
            Automated Headless CMS Webhooks • Tier 3
          </span>
        </div>

        {/* Submit Button & Progress Indicator */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-xs text-slate-500">
            {isSubmitting ? (
              <div className="flex items-center gap-2 text-navy-900 font-bold animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-[#14284B]" />
                <span>{stepMessage}</span>
              </div>
            ) : (
              <span>Deterministic rules evaluate first; LLM extracts contextual claims.</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 bg-[#14284B] hover:bg-navy-950 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Evaluating...' : 'Run Governance Review →'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};