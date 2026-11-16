import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { getT } from '../utils/translations';

interface StoryGenerationModalProps {
  isOpen: boolean;
  isReady: boolean;
  topic: string;
  baseLang: string;
  targetLang: string;
  targetLangFlag?: string;
  onDone: () => void;
  onSpeakText?: (text: string) => void;
}

// Localized boilerplate text for "Creating you a story for " in the learner's "I SPEAK" language
export function getCreatingStoryPrefix(baseLang: string): string {
  return getT(baseLang).creatingStoryPrefix;
}

// Localized "Your story is ready!" heading
export function getStoryReadyTitle(baseLang: string): string {
  return getT(baseLang).storyReadyTitle;
}

// Localized "Done" button text in the learner's "I SPEAK" language
export function getDoneButtonText(baseLang: string): string {
  return getT(baseLang).storyDoneBtn;
}

export const StoryGenerationModal: React.FC<StoryGenerationModalProps> = ({
  isOpen,
  isReady,
  topic,
  baseLang,
  targetLang,
  targetLangFlag = '📖',
  onDone,
}) => {
  const t = getT(baseLang);
  const [progress, setProgress] = useState(15);
  const [stepIndex, setStepIndex] = useState<0 | 1 | 2 | 3>(0);

  useEffect(() => {
    if (!isOpen) {
      setProgress(15);
      setStepIndex(0);
      return;
    }

    if (isReady) {
      setProgress(100);
      return;
    }

    setStepIndex(0);

    const t1 = setTimeout(() => {
      setProgress(40);
      setStepIndex(1);
    }, 1000);

    const t2 = setTimeout(() => {
      setProgress(75);
      setStepIndex(2);
    }, 2200);

    const t3 = setTimeout(() => {
      setProgress(95);
      setStepIndex(3);
    }, 3400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen, isReady, targetLang]);

  if (!isOpen) return null;

  const stepText = isReady
    ? t.genStepComplete
    : stepIndex === 0
    ? t.genStepWeaving
    : stepIndex === 1
    ? t.genStepDrafting(targetLang)
    : stepIndex === 2
    ? t.genStepAdding
    : t.genStepPolishing;

  const prefix = t.creatingStoryPrefix;
  const readyTitle = t.storyReadyTitle;
  const doneBtnText = t.storyDoneBtn;
  const cleanTopic = topic.trim() || 'A day of new discoveries';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="generation-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in"
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-xl w-full p-5 sm:p-8 flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Top Header & Visual Progress */}
        <div className="text-center space-y-3">
          <div className="relative inline-flex items-center justify-center">
            {isReady ? (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 to-[#008450] text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 ring-8 ring-emerald-100 animate-bounce-subtle">
                <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11 text-white" />
              </div>
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 ring-8 ring-emerald-50 animate-pulse">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 text-2xl shadow-xs">
              {targetLangFlag}
            </span>
          </div>

          <div>
            {isReady ? (
              <>
                <h2
                  id="generation-modal-title"
                  className="text-lg sm:text-2xl font-black text-slate-900 leading-snug tracking-tight"
                >
                  🎉 {readyTitle}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
                  “{cleanTopic}”
                </p>
              </>
            ) : (
              <>
                <h2
                  id="generation-modal-title"
                  className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug tracking-tight"
                >
                  <span>{prefix}</span>
                  <span className="text-[#008450] font-black break-words">“{cleanTopic}”</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  {stepText}
                </p>
              </>
            )}
          </div>

          {/* Animated Progress Bar */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                isReady
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 w-full'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Big "Done" Button when ready */}
          {isReady && (
            <div className="pt-2 animate-fade-in">
              <button
                type="button"
                onClick={onDone}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#008450] hover:bg-[#006b40] text-white font-black text-base sm:text-lg shadow-lg shadow-emerald-800/25 hover:shadow-xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer ring-4 ring-emerald-100"
              >
                <span>{doneBtnText}</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          )}
        </div>

        {/* Generous White Space separating creation notice / Done button from advert */}
        <div className="py-5 sm:py-7 flex items-center justify-center">
          <div className="w-24 border-t border-slate-200/80" />
        </div>

        {/* Learning Feature Spotlight (AdSense Policy Compliant: No Google-served ads on modals/alerts) */}
        <div className="w-full bg-slate-50/70 border border-slate-200/80 rounded-2xl p-3 sm:p-4 text-xs text-slate-600">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#008450]" />
              <span>{t.langTipTitle}</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {t.immersionTechnique}
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-600">
            {t.langTipDesc}
          </p>
        </div>
      </div>
    </div>
  );
};
