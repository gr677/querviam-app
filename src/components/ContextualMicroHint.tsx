import React, { useState, useEffect } from 'react';

interface ContextualMicroHintProps {
  onDismiss?: () => void;
  forceShow?: boolean;
  targetLang?: string;
}

function getRootDescription(targetLang?: string): string {
  const lang = (targetLang || '').toLowerCase();
  if (lang.includes('arabic')) {
    return '3-letter Semitic root systems (جذر) and word families';
  }
  if (lang.includes('chinese') || lang.includes('mandarin') || lang.includes('cantonese')) {
    return 'character radicals (部首), pictographs & character origins';
  }
  if (lang.includes('japanese')) {
    return 'Kanji radicals (部首), character origins & native roots';
  }
  if (
    lang.includes('german') ||
    lang.includes('dutch') ||
    lang.includes('swedish') ||
    lang.includes('norwegian') ||
    lang.includes('danish')
  ) {
    return 'Proto-Germanic roots & historical English cognates';
  }
  if (lang.includes('greek')) {
    return 'Ancient Greek roots and etymological origins';
  }
  if (
    lang.includes('russian') ||
    lang.includes('polish') ||
    lang.includes('czech') ||
    lang.includes('ukrainian')
  ) {
    return 'Slavic roots and ancestral linguistic origins';
  }
  if (lang.includes('hindi')) {
    return 'Sanskrit roots and classical origins';
  }
  if (lang.includes('hungarian') || lang.includes('magyar')) {
    return 'ancient Uralic/Finno-Ugric stems and agglutinative word roots';
  }
  if (
    lang.includes('italian') ||
    lang.includes('spanish') ||
    lang.includes('french') ||
    lang.includes('portuguese') ||
    lang.includes('latin') ||
    lang.includes('romanian')
  ) {
    return 'Latin and historical roots';
  }
  return 'historical roots and word origins';
}

export const ContextualMicroHint: React.FC<ContextualMicroHintProps> = ({ onDismiss, forceShow, targetLang }) => {
  const [isDismissed, setIsDismissed] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem('querviam_microhint_dismissed');
      setIsDismissed(dismissed === 'true' && !forceShow);
    }
  }, [forceShow]);

  const handleDismiss = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('querviam_microhint_dismissed', 'true');
    }
    setIsDismissed(true);
    if (onDismiss) onDismiss();
  };

  if (isDismissed) return null;

  const rootDesc = getRootDescription(targetLang);

  return (
    <div className="relative mb-3.5 mx-auto max-w-4xl w-full rounded-xl border border-emerald-300/80 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/80 dark:from-emerald-950/40 dark:via-stone-900 dark:to-emerald-950/40 dark:border-emerald-700/50 p-3.5 shadow-xs transition-all animate-fadeIn">
      <div className="flex items-start sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-xs">
            💡
          </span>
          <div className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
            <span className="font-bold text-emerald-900 dark:text-emerald-200">Quick Hint: </span>
            Click or tap <span className="font-semibold underline decoration-emerald-500 decoration-2 underline-offset-2">any word</span> in the story to hear native pronunciation, view translations, or press the signature green <span className="font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded">Dig Deeper (Etymology & Roots)</span> button to uncover {rootDesc}!
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleDismiss}
            className="px-3 py-1 text-xs font-bold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs transition active:scale-95"
          >
            Got it
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-md hover:bg-emerald-100 dark:hover:bg-stone-800 transition"
            aria-label="Dismiss quick hint"
            title="Dismiss hint"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};
