import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, Loader2, CheckCircle2, HelpCircle, Volume2, BookOpen } from 'lucide-react';
import { getT } from '../utils/translations';

interface QuizPrepAdvertModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetLang: string;
  baseLang?: string;
  storyTitle?: string;
  isReady?: boolean;
}

export const QuizPrepAdvertModal: React.FC<QuizPrepAdvertModalProps> = ({
  isOpen,
  onClose,
  targetLang,
  baseLang = 'English',
  storyTitle = 'this story',
  isReady = true,
}) => {
  const t = getT(baseLang);
  const [secondsRemaining, setSecondsRemaining] = useState(2);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSecondsRemaining(2);
      setCanClose(false);
      return;
    }

    setSecondsRemaining(2);
    setCanClose(false);

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanClose(true);
          return 0;
        }
        return prev - 1;
      });
    }, 900);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const progressPercent = secondsRemaining === 2 ? 45 : secondsRemaining === 1 ? 85 : 100;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in google-anno-skip no-ads"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-full max-w-lg max-h-[90dvh] overflow-y-auto bg-white rounded-3xl shadow-2xl border-2 border-emerald-300 flex flex-col animate-scale-up">
        {/* Header bar */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-wide uppercase flex items-center gap-2">
                <span>{t.quizPrepTitle}</span>
              </h3>
              <p className="text-[11px] text-emerald-200">
                {t.quizPrepSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-xs font-black">
            <Clock className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span>{secondsRemaining > 0 ? `${secondsRemaining}s...` : t.quizPrepReady}</span>
          </div>
        </div>

        {/* Educational Content & Tips (Policy-compliant: No ads on alerts/modals) */}
        <div className="p-5 sm:p-6 space-y-4 bg-gradient-to-b from-emerald-50/40 via-teal-50/20 to-white">
          {/* Pedagogical Feature Card */}
          <div className="bg-white border border-emerald-200 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-bold text-[10px] tracking-wider uppercase">
                <BookOpen className="w-3 h-3 text-emerald-700" />
                <span>{t.pedagogicalReview}</span>
              </span>
              <span className="text-[11px] font-bold text-slate-500">
                {t.immersionTag(targetLang)}
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>{t.activeRecallTipsTitle}</span>
              </h4>
              <ul className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
                <li className="flex items-start gap-2">
                  <Volume2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{t.activeRecallTip1}</span>
                </li>
                <li className="flex items-start gap-2">
                  <HelpCircle className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                  <span>{t.activeRecallTip2}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Progress & Status Message */}
          <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-2.5 text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-950">
              {secondsRemaining > 0 || !isReady ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
                  <span>{t.assemblingQuestions(storyTitle)}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-800 font-black">{t.allQuestionsReady}</span>
                </>
              )}
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-emerald-200/80 rounded-full h-2.5 overflow-hidden border border-emerald-300/60">
              <div
                className="bg-gradient-to-r from-[#008450] via-teal-500 to-emerald-400 h-full rounded-full transition-all duration-700 ease-linear"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="text-xs text-slate-600 font-medium">
              {secondsRemaining > 0 || !isReady ? t.synthesizingWait : t.questionsReadyDesc}
            </div>
          </div>

          {/* Action button */}
          {canClose && isReady ? (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 bg-[#008450] hover:bg-[#006b40] text-white text-base font-black rounded-2xl shadow-lg hover:shadow-xl transition cursor-pointer active:scale-98 flex items-center justify-center gap-2 ring-4 ring-emerald-200"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-200" />
              <span>{t.doneStartQuiz}</span>
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="w-full py-3.5 bg-slate-100 border border-slate-300 text-slate-500 text-sm font-bold rounded-2xl flex items-center justify-center gap-2 cursor-not-allowed select-none"
            >
              <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
              <span>
                {secondsRemaining > 0
                  ? t.preparingQuestionsSec(secondsRemaining)
                  : t.finalizingQuiz}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
