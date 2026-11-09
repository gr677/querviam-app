import React, { useState } from 'react';
import { Volume2, Award, ChevronDown, ChevronUp, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { PronunciationScoreResult } from '../types';
import { getT } from '../utils/translations';

interface PronunciationScoreBadgeProps {
  result: PronunciationScoreResult;
  baseLang?: string;
  onSpeakWord: (word: string) => void;
  onClear?: () => void;
}

export const PronunciationScoreBadge: React.FC<PronunciationScoreBadgeProps> = ({
  result,
  baseLang = 'English',
  onSpeakWord,
}) => {
  const t = getT(baseLang);
  const [isExpanded, setIsExpanded] = useState(false);
  const { score, recognizedText, wordScores } = result;

  const isExcellent = score >= 85;
  const isGood = score >= 65 && score < 85;

  const badgeColor = isExcellent
    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
    : isGood
    ? 'bg-amber-50 text-amber-900 border-amber-300'
    : 'bg-rose-50 text-rose-900 border-rose-300';

  const iconColor = isExcellent
    ? 'text-emerald-600'
    : isGood
    ? 'text-amber-600'
    : 'text-rose-600';

  return (
    <div className="mt-2 text-xs" onClick={(e) => e.stopPropagation()}>
      {/* Clickable Summary Badge */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-bold transition shadow-2xs cursor-pointer select-none ${badgeColor}`}
        title={t.tapToViewPronunciation}
      >
        <span className="flex items-center gap-1">
          {isExcellent ? (
            <CheckCircle2 className={`w-3.5 h-3.5 ${iconColor}`} />
          ) : (
            <AlertCircle className={`w-3.5 h-3.5 ${iconColor}`} />
          )}
          <span>{t.pronunciation}: {score}%</span>
          {result.attempt && result.attempt > 1 && (
            <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-black/10 font-bold">
              Take #{result.attempt}
            </span>
          )}
        </span>
        <span className="text-[10px] font-semibold opacity-75">
          {isExcellent ? t.excellent : isGood ? t.goodEffort : t.keepPracticing}
        </span>
        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {/* Expanded Word-by-Word Analysis Dropdown */}
      {isExpanded && (
        <div className="mt-2 p-3 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2.5 animate-scale-up max-w-md">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <span>{t.wordByWordAccuracy}</span>
            <span className="text-slate-400 font-normal">{t.tapWordToListen}</span>
          </div>

          {/* Word chips with color coding */}
          <div className="flex flex-wrap gap-1.5">
            {wordScores.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSpeakWord(item.word)}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                  item.isMatch
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-rose-50 text-rose-900 border-rose-300 hover:bg-rose-100'
                }`}
                title={`Spoken: ${item.isMatch ? 'Accurate ✓' : 'Needs work ✕'} — Tap to hear pronunciation`}
              >
                <span>{item.word}</span>
                <Volume2 className="w-3 h-3 opacity-60" />
              </button>
            ))}
          </div>

          {/* Speech transcript comparison */}
          {recognizedText && (
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-0.5">
              <p>
                <strong className="text-slate-700">{t.whatWeHeard} </strong>
                <span className="italic font-serif text-slate-800">&ldquo;{recognizedText}&rdquo;</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
