import React from 'react';
import { RotateCcw } from 'lucide-react';
import { getT } from '../utils/translations';

interface OwlTrackProps {
  totalQuestions: number;
  solvedCount: number;
  baseLang?: string;
  isPractice?: boolean;
  onReset?: () => void;
  onSelectSentence?: (index: number) => void;
}

const OWL_GHOST_SVG = (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <path
      d="M 28 20 C 18 20, 15 32, 18 42 C 12 55, 12 80, 26 90 C 35 96, 65 96, 74 90 C 88 80, 88 55, 82 42 C 85 32, 82 20, 72 20 C 60 20, 50 28, 50 28 C 50 28, 40 20, 28 20 Z"
      fill="none"
      stroke="#2b3e50"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="36" cy="42" r="14" fill="none" stroke="#2b3e50" strokeWidth="5" />
    <circle cx="64" cy="42" r="14" fill="none" stroke="#2b3e50" strokeWidth="5" />
    <polygon points="50,48 44,56 56,56" fill="#2b3e50" />
    <path d="M 18 52 C 10 60, 12 78, 22 82 M 82 52 C 90 60, 88 78, 78 82" fill="none" stroke="#2b3e50" strokeWidth="5" strokeLinecap="round" />
    <path d="M 32 90 Q 28 98 22 94 M 40 91 Q 38 100 32 98 M 60 91 Q 62 100 68 98 M 68 90 Q 72 98 78 94" fill="none" stroke="#2b3e50" strokeWidth="5" strokeLinecap="round" />
  </svg>
);

const OWL_ACTIVE_SVG = (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
    <path
      d="M 28 20 C 18 20, 15 32, 18 42 C 12 55, 12 80, 26 90 C 35 96, 65 96, 74 90 C 88 80, 88 55, 82 42 C 85 32, 82 20, 72 20 C 60 20, 50 28, 50 28 C 50 28, 40 20, 28 20 Z"
      fill="#38a3a5"
      stroke="#1d3557"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="36" cy="42" r="14" fill="#ffddd2" stroke="#1d3557" strokeWidth="5" />
    <circle cx="64" cy="42" r="14" fill="#ffddd2" stroke="#1d3557" strokeWidth="5" />
    <circle cx="36" cy="42" r="7" fill="#1d3557" />
    <circle cx="64" cy="42" r="7" fill="#1d3557" />
    <circle cx="34" cy="40" r="2.5" fill="#ffffff" />
    <circle cx="62" cy="40" r="2.5" fill="#ffffff" />
    <polygon points="50,48 43,58 57,58" fill="#f77f00" stroke="#1d3557" strokeWidth="3" strokeLinejoin="round" />
    <path d="M 18 52 C 10 60, 12 78, 22 82 Z" fill="#22577a" stroke="#1d3557" strokeWidth="4" strokeLinejoin="round" />
    <path d="M 82 52 C 90 60, 88 78, 78 82 Z" fill="#22577a" stroke="#1d3557" strokeWidth="4" strokeLinejoin="round" />
    <path d="M 32 90 Q 28 98 22 94 M 40 91 Q 38 100 32 98 M 60 91 Q 62 100 68 98 M 68 90 Q 72 98 78 94" fill="none" stroke="#f77f00" strokeWidth="5" strokeLinecap="round" />
  </svg>
);

export const OwlTrack: React.FC<OwlTrackProps> = ({
  totalQuestions,
  solvedCount,
  baseLang = 'English',
  isPractice = true,
  onReset,
  onSelectSentence,
}) => {
  if (totalQuestions === 0) return null;

  const t = getT(baseLang);
  const slots = Array.from({ length: totalQuestions }, (_, i) => i);
  const orderedSlots = [...slots].reverse(); // Sentence 1 will be rendered at the bottom
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      if (solvedCount === 0) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      } else {
        const activeIdx = Math.min(solvedCount, totalQuestions - 1);
        const owlEl = scrollRef.current.querySelector(`[data-owl-idx="${activeIdx}"]`);
        if (owlEl) {
          owlEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    }
  }, [totalQuestions, solvedCount]);

  const tooltipText = isPractice
    ? t.owlScoreTooltip(solvedCount, totalQuestions)
    : `Reading: ${solvedCount} of ${totalQuestions} sentences completed`;

  return (
    <div
      className="hidden sm:flex w-12 bg-[#eef2f5] border-r border-[#dfe5eb] shadow-[inset_2px_0_4px_rgba(0,0,0,0.06)] flex-col items-center justify-between z-10 select-none transition-all shrink-0 h-full max-h-screen h-[100dvh] overflow-hidden"
      title={tooltipText}
    >
      {/* Top Header: Score & Reset button */}
      <div className="flex flex-col items-center pt-2.5 pb-2 border-b border-[#dfe5eb] w-full gap-0.5 shrink-0 bg-[#eef2f5]">
        <span className="text-[10px] font-mono font-extrabold text-slate-700 leading-none">
          {solvedCount}/{totalQuestions}
        </span>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className={`p-1 rounded-md transition cursor-pointer ${
              solvedCount > 0
                ? 'text-slate-500 hover:text-rose-600 hover:bg-white shadow-2xs'
                : 'text-slate-300 hover:text-slate-600'
            }`}
            title={t.owlResetTooltip}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Owls stack ending flush at the bottom of the screen */}
      <div
        ref={scrollRef}
        className="flex-1 w-full overflow-y-auto overscroll-contain flex flex-col justify-end items-center px-1 pb-2"
      >
        <div className="mt-auto flex flex-col items-center gap-1.5 w-full">
          {orderedSlots.map((idx) => {
            const isSolved = idx < solvedCount;
            return (
              <div
                key={idx}
                data-owl-idx={idx}
                onClick={() => onSelectSentence?.(idx)}
                className={`w-8 h-8 transition-all duration-300 shrink-0 ${
                  onSelectSentence ? 'cursor-pointer hover:scale-110 active:scale-95' : ''
                } ${
                  isSolved ? 'animate-owl-drop opacity-100 scale-100' : 'opacity-25 hover:opacity-40'
                }`}
                title={`Sentence ${idx + 1}`}
              >
                {isSolved ? OWL_ACTIVE_SVG : OWL_GHOST_SVG}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

