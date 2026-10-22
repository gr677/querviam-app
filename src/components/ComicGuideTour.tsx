import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles, Check, HelpCircle, Eye, EyeOff } from 'lucide-react';

export type TourMode = 'build' | 'practice';

interface ComicGuideTourProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: TourMode;
  onSelectMode?: (mode: TourMode) => void;
}

interface TourStep {
  id: string;
  targetId: string;
  badge: string;
  title: string;
  desc: string;
  tip: string;
  actionText?: string;
  arrowDirection: 'left' | 'top' | 'right' | 'bottom';
}

const BUILD_STEPS: TourStep[] = [
  {
    id: 'build-languages',
    targetId: 'tour-build-languages',
    badge: 'STEP 1',
    title: '🎯 Target Language & I Speak',
    desc: 'Pick your native language and the language you want to master. Querviam adapts all vocabulary, grammar insights, and native audio to this exact language pair.',
    tip: 'Tip: You can hit "⇄ Flip" anytime to practice in reverse!',
    arrowDirection: 'left',
  },
  {
    id: 'build-topic',
    targetId: 'tour-build-topic',
    badge: 'STEP 2',
    title: '💡 Story Topic or Seed Idea',
    desc: 'Type any seed idea — like "Ordering coffee in Florence", "A time machine in Kyoto", or "Space exploration". Or tap "Speak" to brainstorm out loud!',
    tip: 'Tip: Even a 2-word topic produces a rich, immersive story.',
    arrowDirection: 'left',
  },
  {
    id: 'build-difficulty',
    targetId: 'tour-build-difficulty',
    badge: 'STEP 3',
    title: '📊 Difficulty & Specialist Mastery',
    desc: 'Choose from Introduction (A1) up to Advanced (C1-C2). Select "Master (C2+)" to unlock 20+ specialized professional fields like Law, Medicine, or Classical Literature.',
    tip: 'Tip: Beginners get simple sentence structures; Master includes idiomatic nuances.',
    arrowDirection: 'left',
  },
  {
    id: 'build-format',
    targetId: 'tour-build-format',
    badge: 'STEP 4',
    title: '📖 Format & Fact vs Fiction',
    desc: 'Select a solo narrative Story or a dynamic 2-person Dialogue. Pick "Non-Fiction" for real-world factual insights, or "Fiction" for imaginative adventures!',
    tip: 'Tip: Dialogues feature dual speaker voices (Speaker A & B)!',
    arrowDirection: 'left',
  },
  {
    id: 'build-generate',
    targetId: 'tour-build-generate',
    badge: 'STEP 5',
    title: '🚀 Hit Create Story!',
    desc: 'Ready? Click "Create Story" to generate your custom lesson with synchronized audio, phrase-by-phrase translations, and instant interactive exercises.',
    tip: 'Tip: Once generated, stories can be shared with friends via 1-click links!',
    arrowDirection: 'left',
  },
];

const PRACTICE_STEPS: TourStep[] = [
  {
    id: 'practice-activities',
    targetId: 'tour-practice-activities',
    badge: 'PRACTICE 1',
    title: '🎮 Interactive Learning Activities',
    desc: 'Reinforce what you learn! Choose from Spelling (Fill in the blanks), Multiple Choice, Sentence Scramble, or audio Dictation mode.',
    tip: 'Tip: Each mode tests a different cognitive skill (listening, spelling, grammar).',
    arrowDirection: 'left',
  },
  {
    id: 'practice-voice',
    targetId: 'tour-practice-voice',
    badge: 'PRACTICE 2',
    title: '🎧 Speech Rate & Voice Options',
    desc: 'Control playback speed (slow down to 0.7x for crystal-clear phonetics), adjust sentence pauses, or toggle Studio HD neural voices.',
    tip: 'Tip: Use the pause slider to give yourself time to repeat after each sentence.',
    arrowDirection: 'left',
  },
  {
    id: 'practice-tools',
    targetId: 'tour-practice-tools',
    badge: 'PRACTICE 3',
    title: '📚 Study Sheets & Grammar Bites',
    desc: 'Access printable study sheets, conjugated verb tables, sentence grammar bites, and share the story with classmates or students.',
    tip: 'Tip: Click "Study Sheet" to view vocabulary breakdowns and print worksheets.',
    arrowDirection: 'left',
  },
];

export const ComicGuideTour: React.FC<ComicGuideTourProps> = ({
  isOpen,
  onClose,
  currentMode,
  onSelectMode,
}) => {
  const [activeTab, setActiveTab] = useState<TourMode>(currentMode);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showAllBubbles, setShowAllBubbles] = useState(false);
  const [targetRects, setTargetRects] = useState<{ [key: string]: DOMRect | null }>({});
  const [isMobile, setIsMobile] = useState(false);

  // Always reset to Step 1 (index 0) and default view mode whenever the guide is opened
  useEffect(() => {
    if (isOpen) {
      setActiveTab(currentMode);
      setCurrentStepIndex(0);
      setShowAllBubbles(false);
    }
  }, [isOpen, currentMode]);

  // Check mobile screen width
  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const steps = activeTab === 'build' ? BUILD_STEPS : PRACTICE_STEPS;
  const currentStep = steps[currentStepIndex] || steps[0];

  // Measure target elements positions in the DOM
  const updateTargetRects = () => {
    const rectMap: { [key: string]: DOMRect | null } = {};
    for (const step of steps) {
      const el = document.getElementById(step.targetId);
      if (el) {
        rectMap[step.targetId] = el.getBoundingClientRect();
      } else {
        rectMap[step.targetId] = null;
      }
    }
    setTargetRects(rectMap);
  };

  useEffect(() => {
    if (!isOpen) return;

    updateTargetRects();
    const handleScrollOrResize = () => updateTargetRects();

    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);

    const interval = setInterval(updateTargetRects, 600);

    return () => {
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      clearInterval(interval);
    };
  }, [isOpen, activeTab, currentStepIndex, showAllBubbles]);

  // Auto-scroll target into view if needed
  useEffect(() => {
    if (!isOpen || isMobile || showAllBubbles) return;
    const el = document.getElementById(currentStep?.targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(updateTargetRects, 250);
    }
  }, [currentStepIndex, isOpen, isMobile, showAllBubbles]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleSwitchTab = (tab: TourMode) => {
    setActiveTab(tab);
    setCurrentStepIndex(0);
    if (onSelectMode) {
      onSelectMode(tab);
    }
  };

  // Render Mobile Guide Modal (Comic Card Strip)
  if (isMobile) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in"
        onClick={onClose}
      >
        <div
          className="w-full max-w-md bg-[#fffdf7] border-3 border-slate-950 rounded-3xl shadow-[8px_8px_0px_#0f172a] overflow-hidden flex flex-col max-h-[85vh] animate-scale-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Comic Header Bar */}
          <div className="bg-amber-400 border-b-3 border-slate-950 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">💥</span>
              <div>
                <h3 className="font-black text-sm tracking-wider uppercase text-slate-950">
                  Quick Comic Guide
                </h3>
                <p className="text-[10px] font-bold text-amber-950/80 uppercase">
                  How Querviam Works in 30 Seconds
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-xl bg-white border-2 border-slate-950 text-slate-950 hover:bg-slate-100 transition cursor-pointer shadow-[2px_2px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              title="Close Guide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex border-b-2 border-slate-950 bg-[#fff5db] p-1.5 gap-1.5">
            <button
              type="button"
              onClick={() => handleSwitchTab('build')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer border-2 ${
                activeTab === 'build'
                  ? 'bg-amber-400 text-slate-950 border-slate-950 shadow-[2px_2px_0px_#0f172a]'
                  : 'bg-white text-slate-700 border-transparent hover:border-slate-300'
              }`}
            >
              <span>🛠️ Build Mode</span>
            </button>
            <button
              type="button"
              onClick={() => handleSwitchTab('practice')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer border-2 ${
                activeTab === 'practice'
                  ? 'bg-emerald-400 text-slate-950 border-slate-950 shadow-[2px_2px_0px_#0f172a]'
                  : 'bg-white text-slate-700 border-transparent hover:border-slate-300'
              }`}
            >
              <span>🎮 Practice Mode</span>
            </button>
          </div>

          {/* Comic Step Card Content */}
          <div className="p-4 overflow-y-auto space-y-4">
            <div className="relative p-4 rounded-2xl bg-white border-2 border-slate-950 shadow-[4px_4px_0px_#0f172a]">
              {/* Comic Badge */}
              <div className="inline-block bg-amber-400 text-slate-950 border-2 border-slate-950 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider mb-2 shadow-[2px_2px_0px_#0f172a]">
                {currentStep.badge} • Step {currentStepIndex + 1} of {steps.length}
              </div>

              <h4 className="font-black text-base text-slate-950 mb-2 leading-tight">
                {currentStep.title}
              </h4>

              <p className="text-xs text-slate-800 leading-relaxed font-medium mb-3">
                {currentStep.desc}
              </p>

              {currentStep.tip && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-[11px] font-bold text-amber-950 flex items-start gap-1.5">
                  <span className="text-amber-600 text-sm">💡</span>
                  <span>{currentStep.tip}</span>
                </div>
              )}
            </div>

            {/* Quick Step Indicators */}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    currentStepIndex === idx
                      ? 'w-6 bg-slate-950'
                      : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                  title={`Go to step ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="border-t-2 border-slate-950 p-3 bg-[#fff9e6] flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className={`py-2 px-3 rounded-xl border-2 border-slate-950 font-black text-xs transition flex items-center gap-1 ${
                currentStepIndex === 0
                  ? 'opacity-30 bg-slate-100 text-slate-400 cursor-not-allowed border-slate-300'
                  : 'bg-white text-slate-950 hover:bg-slate-100 cursor-pointer shadow-[2px_2px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="flex-1 py-2 px-4 rounded-xl border-2 border-slate-950 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-[3px_3px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              {currentStepIndex === steps.length - 1 ? (
                <>
                  <span>Got It, Let&apos;s Build!</span>
                  <Check className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Next Step</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop View: Comic Speech Bubble with Large Pointing Arrows!
  const targetRect = targetRects[currentStep?.targetId];

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Backdrop with semi-translucent dark tint */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-[1px] pointer-events-auto transition-opacity"
        onClick={onClose}
      />

      {/* Floating Tour Control Bar (Top Center of Desktop) */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto flex items-center gap-2 bg-[#fffdf7] border-3 border-slate-950 px-4 py-2 rounded-2xl shadow-[6px_6px_0px_#0f172a] animate-bounce-subtle">
        <div className="flex items-center gap-1.5 pr-2 border-r-2 border-slate-950">
          <span className="text-xl">🗨️</span>
          <span className="font-black text-xs tracking-wider uppercase text-slate-950">
            Querviam Comic Guide
          </span>
        </div>

        {/* Tab switch */}
        <div className="flex bg-[#fff0cc] p-1 rounded-xl border border-slate-950 gap-1">
          <button
            type="button"
            onClick={() => handleSwitchTab('build')}
            className={`px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
              activeTab === 'build'
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            🛠️ Build
          </button>
          <button
            type="button"
            onClick={() => handleSwitchTab('practice')}
            className={`px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
              activeTab === 'practice'
                ? 'bg-emerald-400 text-slate-950 shadow-xs'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            🎮 Practice
          </button>
        </div>

        {/* Toggle Show All Bubbles */}
        <button
          type="button"
          onClick={() => setShowAllBubbles(!showAllBubbles)}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border-2 border-slate-950 text-xs font-bold transition cursor-pointer ${
            showAllBubbles
              ? 'bg-amber-300 text-slate-950 shadow-[2px_2px_0px_#0f172a]'
              : 'bg-white text-slate-800 hover:bg-slate-50'
          }`}
          title="Toggle seeing all speech bubbles at once"
        >
          {showAllBubbles ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{showAllBubbles ? 'Step-by-Step' : 'Show All'}</span>
        </button>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-950 border-2 border-slate-950 transition cursor-pointer shadow-[2px_2px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ml-1"
          title="Close Guide"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Target Element Spotlight Highlight Ring */}
      {!showAllBubbles && targetRect && (
        <div
          className="fixed pointer-events-none z-45 border-3 border-amber-500 rounded-2xl ring-4 ring-amber-300/80 shadow-[0_0_25px_rgba(245,158,11,0.6)] animate-pulse transition-all duration-300"
          style={{
            top: `${Math.max(8, targetRect.top - 6)}px`,
            left: `${Math.max(8, targetRect.left - 6)}px`,
            width: `${targetRect.width + 12}px`,
            height: `${targetRect.height + 12}px`,
          }}
        />
      )}

      {/* Render Mode 1: Step-by-Step Single Focused Bubble */}
      {!showAllBubbles && (
        <div
          className="fixed pointer-events-auto z-50 transition-all duration-300 ease-out"
          style={{
            // Position bubble cleanly to the right of the sidebar section
            top: targetRect
              ? `${Math.max(70, Math.min(window.innerHeight - 340, targetRect.top - 20))}px`
              : '160px',
            left: targetRect
              ? `${Math.min(window.innerWidth - 380, targetRect.right + 28)}px`
              : '400px',
            width: '360px',
          }}
        >
          <div className="relative">
            {/* Large Comic-Book Arrow Pointing to the Target Section */}
            <div className="absolute -left-9 top-10 -translate-y-1/2 flex items-center pointer-events-none select-none drop-shadow-[2px_2px_0px_#0f172a] animate-bounce-horizontal">
              <svg
                width="42"
                height="32"
                viewBox="0 0 42 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Comic Arrow with bold black outline and vibrant golden fill */}
                <path
                  d="M12 2L2 16L12 30V21H40V11H12V2Z"
                  fill="#fbbf24"
                  stroke="#0f172a"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Comic Speech Balloon Container */}
            <div className="bg-[#fffdf5] border-3 border-slate-950 rounded-3xl p-5 shadow-[8px_8px_0px_#0f172a] relative">
              {/* Comic Callout Tail pointing left */}
              <div
                className="absolute -left-3 top-9 w-0 h-0 border-y-[10px] border-y-transparent border-r-[14px] border-r-slate-950"
                aria-hidden="true"
              />
              <div
                className="absolute -left-2 top-9 w-0 h-0 border-y-[9px] border-y-transparent border-r-[12px] border-r-[#fffdf5]"
                aria-hidden="true"
              />

              {/* Step Badge & Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 border-2 border-slate-950 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#0f172a]">
                  <span>💥</span>
                  <span>{currentStep.badge}</span>
                  <span className="opacity-75">({currentStepIndex + 1}/{steps.length})</span>
                </div>

                <button
                  onClick={onClose}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition cursor-pointer"
                  title="Close Guide"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Bubble Title */}
              <h3 className="font-black text-base text-slate-950 mb-2 leading-tight">
                {currentStep.title}
              </h3>

              {/* Explanation Copy */}
              <p className="text-xs text-slate-800 leading-relaxed font-medium mb-3">
                {currentStep.desc}
              </p>

              {/* Helpful Tip Box */}
              {currentStep.tip && (
                <div className="p-2.5 rounded-xl bg-amber-100/70 border border-amber-300 text-[11px] font-bold text-amber-950 mb-4 flex items-start gap-1.5">
                  <span className="text-amber-700 text-sm mt-[-1px]">💡</span>
                  <span>{currentStep.tip}</span>
                </div>
              )}

              {/* Step Navigation Controls */}
              <div className="flex items-center justify-between pt-1 gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentStepIndex === 0}
                  className={`py-1.5 px-3 rounded-xl border-2 border-slate-950 text-xs font-black transition flex items-center gap-1 ${
                    currentStepIndex === 0
                      ? 'opacity-30 bg-slate-100 text-slate-400 cursor-not-allowed border-slate-300'
                      : 'bg-white text-slate-950 hover:bg-slate-100 cursor-pointer shadow-[2px_2px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
                  }`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <div className="flex items-center gap-1">
                  {steps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentStepIndex(i)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        currentStepIndex === i ? 'w-5 bg-slate-950' : 'w-2 bg-slate-300 hover:bg-slate-400'
                      }`}
                      title={`Step ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="py-1.5 px-4 rounded-xl border-2 border-slate-950 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition flex items-center gap-1 cursor-pointer shadow-[3px_3px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  {currentStepIndex === steps.length - 1 ? (
                    <>
                      <span>Start!</span>
                      <Check className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Render Mode 2: Show All Speech Bubbles At Once */}
      {showAllBubbles && (
        <div className="fixed inset-0 pointer-events-auto z-50 overflow-y-auto p-4">
          <div className="max-w-6xl mx-auto pt-20 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {steps.map((step, idx) => {
                const rect = targetRects[step.targetId];
                return (
                  <div
                    key={step.id}
                    className="relative bg-[#fffdf5] border-3 border-slate-950 rounded-3xl p-5 shadow-[6px_6px_0px_#0f172a] hover:-translate-y-1 transition duration-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 border-2 border-slate-950 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#0f172a]">
                        <span>💥</span>
                        <span>{step.badge}</span>
                      </div>
                      <span className="text-[10px] font-mono font-black text-slate-400">#{idx + 1}</span>
                    </div>

                    <h4 className="font-black text-sm text-slate-950 mb-1.5 leading-snug">
                      {step.title}
                    </h4>

                    <p className="text-xs text-slate-800 leading-relaxed font-medium mb-2.5">
                      {step.desc}
                    </p>

                    {step.tip && (
                      <div className="p-2 rounded-xl bg-amber-100/60 border border-amber-300 text-[10px] font-bold text-amber-950">
                        {step.tip}
                      </div>
                    )}

                    <div className="mt-3 pt-2 border-t border-slate-200 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAllBubbles(false);
                          setCurrentStepIndex(idx);
                        }}
                        className="text-[11px] font-black text-amber-950 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Point to this section ➔</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-8 rounded-2xl border-3 border-slate-950 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm uppercase tracking-wider transition cursor-pointer shadow-[5px_5px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                Got It! Ready to Learn & Build
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
