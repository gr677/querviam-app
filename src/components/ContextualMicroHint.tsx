import React, { useState, useEffect } from 'react';
import { getT } from '../utils/translations';

interface ContextualMicroHintProps {
  onDismiss?: () => void;
  forceShow?: boolean;
  targetLang?: string;
  baseLang?: string;
}

export const ContextualMicroHint: React.FC<ContextualMicroHintProps> = ({
  onDismiss,
  forceShow,
  baseLang = 'English',
}) => {
  const t = getT(baseLang);
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

  return (
    <div className="relative mb-3.5 mx-auto max-w-4xl w-full rounded-xl border border-emerald-300/80 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/80 dark:from-emerald-950/40 dark:via-stone-900 dark:to-emerald-950/40 dark:border-emerald-700/50 p-3.5 shadow-xs transition-all animate-fadeIn">
      <div className="flex items-start sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-xs">
            💡
          </span>
          <div className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
            <span className="font-bold text-emerald-900 dark:text-emerald-200">{t.quickHintLabel} </span>
            {t.quickHintBodyPrefix}
            <span className="font-semibold underline decoration-emerald-500 decoration-2 underline-offset-2">
              {t.quickHintAnyWord}
            </span>
            {t.quickHintBodyMiddle}
            <span className="font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded">
              {t.digDeeper}
            </span>
            {t.quickHintBodySuffix}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleDismiss}
            className="px-3 py-1 text-xs font-bold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs transition active:scale-95"
          >
            {t.gotIt}
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-md hover:bg-emerald-100 dark:hover:bg-stone-800 transition"
            aria-label={t.dismissBtn}
            title={t.dismissBtn}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};
