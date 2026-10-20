import React, { useState, useEffect } from 'react';
import { splitWordPunctuation } from '../utils/textUtils';
import { getT } from '../utils/translations';
import { CustomHighlight, VerbItem } from '../types';
import { classifyWordGrammar, getGrammarBadgeLabel, getGrammarStyle } from '../utils/grammarHighlighter';
import { isChinese, segmentChinese, CHINESE_DISTRACTORS_FALLBACK, ChineseSegment } from '../utils/chineseUtils';

interface MultipleChoiceExerciseProps {
  sentenceIndex: number;
  sentenceText: string;
  sentenceVerbs?: VerbItem[];
  isHighlighterMode?: boolean;
  customHighlights?: CustomHighlight[];
  storyWordsPool: string[];
  isInitiallySolved?: boolean;
  baseLang?: string;
  targetLang?: string;
  onSolve: (index: number) => void;
  onRepeatSentence: (index: number) => void;
  onWordClick?: (word: string, sentenceIndex: number, existingHighlight?: CustomHighlight) => void;
}

interface MultipleChoiceState {
  isChinese?: boolean;
  chineseSegments?: ChineseSegment[];
  chosenSegmentIndex?: number;
  originalWords?: string[];
  chosenIndex?: number;
  hiddenWord: string;
  lead?: string;
  trail?: string;
  options: string[];
}

export const MultipleChoiceExercise: React.FC<MultipleChoiceExerciseProps> = ({
  sentenceIndex,
  sentenceText,
  sentenceVerbs,
  isHighlighterMode = false,
  customHighlights = [],
  storyWordsPool,
  isInitiallySolved = false,
  baseLang = 'English',
  targetLang = '',
  onSolve,
  onRepeatSentence,
  onWordClick,
}) => {
  const t = getT(baseLang);
  const [exercise, setExercise] = useState<MultipleChoiceState | null>(null);
  const [isSolved, setIsSolved] = useState(isInitiallySolved);
  const [wrongOption, setWrongOption] = useState<string | null>(null);

  useEffect(() => {
    setIsSolved(isInitiallySolved);
  }, [isInitiallySolved]);

  useEffect(() => {
    const isTargetChinese = isChinese(targetLang, sentenceText);

    if (isTargetChinese) {
      const segments = segmentChinese(sentenceText);
      const candidates = segments
        .map((seg, idx) => ({ ...seg, idx }))
        .filter((s) => s.isWord && /[\u4e00-\u9fa5]/.test(s.text));

      if (candidates.length === 0) {
        setExercise(null);
        return;
      }

      // Prioritize 2+ character words for more meaningful vocabulary practice
      const multiCharCandidates = candidates.filter((c) => c.text.length >= 2);
      const pool = multiCharCandidates.length > 0 ? multiCharCandidates : candidates;

      const chosen = pool[sentenceIndex % pool.length];
      const hiddenWord = chosen.text;

      // Extract Chinese distractors from storyWordsPool
      const potentialDistractors = storyWordsPool.filter(
        (w) => /[\u4e00-\u9fa5]/.test(w) && w.toLowerCase() !== hiddenWord.toLowerCase()
      );

      const shuffledPool = [...potentialDistractors].sort(() => Math.random() - 0.5);
      const distractors = shuffledPool.slice(0, 3);

      // Authentic Chinese fallbacks
      let fbIdx = 0;
      while (distractors.length < 3 && fbIdx < CHINESE_DISTRACTORS_FALLBACK.length) {
        const fb = CHINESE_DISTRACTORS_FALLBACK[fbIdx++];
        if (fb.toLowerCase() !== hiddenWord.toLowerCase() && !distractors.includes(fb)) {
          distractors.push(fb);
        }
      }

      const options = [hiddenWord, ...distractors].sort(() => Math.random() - 0.5);

      setExercise({
        isChinese: true,
        chineseSegments: segments,
        chosenSegmentIndex: chosen.idx,
        hiddenWord,
        options,
      });
      setIsSolved(isInitiallySolved);
      setWrongOption(null);
      return;
    }

    // Mask random word of length > 3 for spaced European languages
    const words = sentenceText.trim().split(/\s+/).filter((w) => w.length > 0);
    const candidates = words
      .map((word, idx) => {
        const { lead, core, trail } = splitWordPunctuation(word);
        return {
          word,
          idx,
          lead,
          core,
          trail,
        };
      })
      .filter((item) => item.core.length > 3);

    if (candidates.length === 0) {
      setExercise(null);
      return;
    }

    // Pick candidate deterministically based on index so it is consistent
    const chosen = candidates[sentenceIndex % candidates.length];
    const hiddenWord = chosen.core;

    // Collect distractors from words pool
    const potentialDistractors = storyWordsPool.filter(
      (w) => w.toLowerCase() !== hiddenWord.toLowerCase()
    );

    // Shuffle distractors
    const shuffledPool = [...potentialDistractors].sort(() => Math.random() - 0.5);
    const distractors = shuffledPool.slice(0, 3);

    // Fallbacks if pool is small
    const fallbackPool = ['tempo', 'mondo', 'casa', 'vita', 'giorno', 'amico', 'strada', 'sole', 'parola', 'storia'];
    while (distractors.length < 3) {
      const fb = fallbackPool[Math.floor(Math.random() * fallbackPool.length)];
      if (fb.toLowerCase() !== hiddenWord.toLowerCase() && !distractors.includes(fb)) {
        distractors.push(fb);
      }
    }

    const options = [hiddenWord, ...distractors].sort(() => Math.random() - 0.5);

    setExercise({
      isChinese: false,
      originalWords: words,
      chosenIndex: chosen.idx,
      hiddenWord,
      lead: chosen.lead,
      trail: chosen.trail,
      options,
    });
    setIsSolved(isInitiallySolved);
    setWrongOption(null);
  }, [sentenceText, sentenceIndex, storyWordsPool, targetLang]);

  if (!exercise) {
    return <div className="text-base sm:text-lg font-semibold text-emerald-900">{sentenceText}</div>;
  }

  const { hiddenWord, options } = exercise;

  const handleOptionClick = (opt: string) => {
    if (isSolved) return;

    if (opt.toLowerCase() === hiddenWord.toLowerCase()) {
      setIsSolved(true);
      setWrongOption(null);
      onSolve(sentenceIndex);
      onRepeatSentence(sentenceIndex);
    } else {
      setWrongOption(opt);
    }
  };

  return (
    <div className="my-1">
      {/* Sentence with blank slot */}
      <div className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed tracking-normal select-text">
        {exercise.isChinese && exercise.chineseSegments ? (
          // Chinese continuous text rendering: characters and words joined naturally with no artificial spaces
          <span>
            {exercise.chineseSegments.map((seg, sIdx) => {
              if (sIdx === exercise.chosenSegmentIndex) {
                const hl = customHighlights.find(
                  (h) =>
                    (h.sentenceIndex === sentenceIndex && h.word.toLowerCase() === hiddenWord.toLowerCase()) ||
                    h.word.toLowerCase() === hiddenWord.toLowerCase()
                );

                let hlStyle = '';
                if (hl) {
                  if (hl.color === 'emerald') hlStyle = 'bg-emerald-300 text-emerald-950 border-b-[3px] border-emerald-700 font-black shadow-xs ring-1 ring-emerald-500/80 px-1 py-0.5 rounded';
                  else if (hl.color === 'indigo') hlStyle = 'bg-indigo-300 text-indigo-950 border-b-[3px] border-indigo-700 font-black shadow-xs ring-1 ring-indigo-500/80 px-1 py-0.5 rounded';
                  else if (hl.color === 'rose') hlStyle = 'bg-rose-300 text-rose-950 border-b-[3px] border-rose-700 font-black shadow-xs ring-1 ring-rose-500/80 px-1 py-0.5 rounded';
                  else hlStyle = 'bg-amber-300 text-amber-950 border-b-[3px] border-amber-600 font-black shadow-xs ring-1 ring-amber-500/80 px-1 py-0.5 rounded';
                }

                const grammarCat = isHighlighterMode ? classifyWordGrammar(hiddenWord, sentenceVerbs) : 'vocab';
                const grammarClass = isHighlighterMode ? getGrammarStyle(grammarCat) : '';
                const grammarBadge = isHighlighterMode ? getGrammarBadgeLabel(grammarCat) : '';

                return (
                  <span
                    key={sIdx}
                    onClick={(e) => {
                      if (isSolved && onWordClick) {
                        e.stopPropagation();
                        onWordClick(hiddenWord, sentenceIndex, hl);
                      }
                    }}
                    className={`inline-flex items-center justify-center align-middle mx-1 min-w-[68px] h-8 px-2.5 rounded-lg border-2 font-bold text-sm select-none transition-all ${
                      isSolved
                        ? hl
                          ? `${hlStyle} shadow-sm cursor-pointer`
                          : isHighlighterMode
                          ? `${grammarClass} shadow-xs cursor-pointer hover:opacity-85`
                          : 'bg-emerald-100 border-emerald-500 text-emerald-900 shadow-xs cursor-pointer hover:underline'
                        : 'bg-amber-50/90 border-dashed border-amber-400 text-amber-700 ring-2 ring-amber-300/40'
                    }`}
                    title={
                      isSolved
                        ? hl?.translation
                          ? `${hiddenWord}: ${hl.translation}${hl.note ? ` (${hl.note})` : ''} — Tap to edit highlight`
                          : isHighlighterMode
                          ? `${grammarBadge}: "${hiddenWord}" — Tap for definition & notes`
                          : 'Correct! Tap word to view definition & notes'
                        : isHighlighterMode
                        ? `Fill in the blank (${grammarBadge})`
                        : 'Choose the missing Chinese word'
                    }
                  >
                    {isSolved ? (
                      hiddenWord
                    ) : (
                      <span className="text-amber-600 font-extrabold tracking-widest text-xs px-1">
                        [ &nbsp; ? &nbsp; ]
                      </span>
                    )}
                  </span>
                );
              }

              if (!seg.isWord) {
                return <span key={sIdx}>{seg.text}</span>;
              }

              const hl = customHighlights.find(
                (h) =>
                  (h.sentenceIndex === sentenceIndex && h.word.toLowerCase() === seg.text.toLowerCase()) ||
                  h.word.toLowerCase() === seg.text.toLowerCase()
              );

              let hlStyle = '';
              if (hl) {
                if (hl.color === 'emerald') hlStyle = 'bg-emerald-300 text-emerald-950 border-b-[3px] border-emerald-700 font-black shadow-xs ring-1 ring-emerald-500/80 px-1 py-0.5 rounded';
                else if (hl.color === 'indigo') hlStyle = 'bg-indigo-300 text-indigo-950 border-b-[3px] border-indigo-700 font-black shadow-xs ring-1 ring-indigo-500/80 px-1 py-0.5 rounded';
                else if (hl.color === 'rose') hlStyle = 'bg-rose-300 text-rose-950 border-b-[3px] border-rose-700 font-black shadow-xs ring-1 ring-rose-500/80 px-1 py-0.5 rounded';
                else hlStyle = 'bg-amber-300 text-amber-950 border-b-[3px] border-amber-600 font-black shadow-xs ring-1 ring-amber-500/80 px-1 py-0.5 rounded';
              }

              const grammarCat = isHighlighterMode ? classifyWordGrammar(seg.text, sentenceVerbs) : 'vocab';
              const grammarClass = isHighlighterMode ? getGrammarStyle(grammarCat) : '';
              const grammarBadge = isHighlighterMode ? getGrammarBadgeLabel(grammarCat) : '';

              return (
                <span
                  key={sIdx}
                  onClick={(e) => {
                    if (onWordClick) {
                      e.stopPropagation();
                      onWordClick(seg.text, sentenceIndex, hl);
                    }
                  }}
                  className={`cursor-pointer transition-colors inline ${
                    hl
                      ? `${hlStyle} shadow-sm`
                      : isHighlighterMode
                      ? `${grammarClass} hover:opacity-85`
                      : 'hover:text-emerald-700'
                  }`}
                  title={
                    hl?.translation
                      ? `${seg.text}: ${hl.translation}${hl.note ? ` (${hl.note})` : ''} — Tap to edit highlight`
                      : isHighlighterMode
                      ? `${grammarBadge}: "${seg.text}" — Tap for definition & notes`
                      : 'Tap word for definition & notes'
                  }
                >
                  {seg.text}
                </span>
              );
            })}
          </span>
        ) : (
          // Spaced European languages rendering
          exercise.originalWords?.map((word, wIdx) => {
            if (wIdx === exercise.chosenIndex) {
              const hl = customHighlights.find(
                (h) =>
                  (h.sentenceIndex === sentenceIndex && h.word.toLowerCase() === hiddenWord.toLowerCase()) ||
                  h.word.toLowerCase() === hiddenWord.toLowerCase()
              );

              let hlStyle = '';
              if (hl) {
                if (hl.color === 'emerald') hlStyle = 'bg-emerald-300 text-emerald-950 border-b-[3px] border-emerald-700 font-black shadow-xs ring-1 ring-emerald-500/80 px-1 py-0.5 rounded';
                else if (hl.color === 'indigo') hlStyle = 'bg-indigo-300 text-indigo-950 border-b-[3px] border-indigo-700 font-black shadow-xs ring-1 ring-indigo-500/80 px-1 py-0.5 rounded';
                else if (hl.color === 'rose') hlStyle = 'bg-rose-300 text-rose-950 border-b-[3px] border-rose-700 font-black shadow-xs ring-1 ring-rose-500/80 px-1 py-0.5 rounded';
                else hlStyle = 'bg-amber-300 text-amber-950 border-b-[3px] border-amber-600 font-black shadow-xs ring-1 ring-amber-500/80 px-1 py-0.5 rounded';
              }

              const grammarCat = isHighlighterMode ? classifyWordGrammar(hiddenWord, sentenceVerbs) : 'vocab';
              const grammarClass = isHighlighterMode ? getGrammarStyle(grammarCat) : '';
              const grammarBadge = isHighlighterMode ? getGrammarBadgeLabel(grammarCat) : '';

              return (
                <span key={wIdx} className="inline-flex items-center mx-1">
                  {exercise.lead && <span>{exercise.lead}</span>}
                  <span
                    onClick={(e) => {
                      if (isSolved && onWordClick) {
                        e.stopPropagation();
                        onWordClick(hiddenWord, sentenceIndex, hl);
                      }
                    }}
                    className={`inline-flex items-center justify-center min-w-[76px] h-8 px-3 rounded-lg border-2 font-bold text-sm select-none transition-all ${
                      isSolved
                        ? hl
                          ? `${hlStyle} shadow-sm cursor-pointer`
                          : isHighlighterMode
                          ? `${grammarClass} shadow-xs cursor-pointer hover:opacity-85`
                          : 'bg-emerald-100 border-emerald-500 text-emerald-900 shadow-xs cursor-pointer hover:underline'
                        : 'bg-slate-50/80 border-dashed border-slate-300 text-slate-400'
                    }`}
                    title={
                      isSolved
                        ? hl?.translation
                          ? `${hiddenWord}: ${hl.translation}${hl.note ? ` (${hl.note})` : ''} — Tap to edit highlight`
                          : isHighlighterMode
                          ? `${grammarBadge}: "${hiddenWord}" — Tap for definition & notes`
                          : 'Correct! Tap word to view definition & notes'
                        : isHighlighterMode
                        ? `Fill in the blank (${grammarBadge})`
                        : 'Fill in the blank'
                    }
                  >
                    {isSolved ? (
                      hiddenWord
                    ) : (
                      <span className="text-slate-400 tracking-wider font-semibold">_____</span>
                    )}
                  </span>
                  {exercise.trail && <span>{exercise.trail}</span>}
                </span>
              );
            }

            const { lead: wLead, core: wCore, trail: wTrail } = splitWordPunctuation(word);
            if (!wCore) {
              return <span key={wIdx} className="inline-block mr-1">{word}</span>;
            }

            const hl = customHighlights.find(
              (h) =>
                (h.sentenceIndex === sentenceIndex && h.word.toLowerCase() === wCore.toLowerCase()) ||
                h.word.toLowerCase() === wCore.toLowerCase()
            );

            let hlStyle = '';
            if (hl) {
              if (hl.color === 'emerald') hlStyle = 'bg-emerald-300 text-emerald-950 border-b-[3px] border-emerald-700 font-black shadow-xs ring-1 ring-emerald-500/80 px-1 py-0.5 rounded';
              else if (hl.color === 'indigo') hlStyle = 'bg-indigo-300 text-indigo-950 border-b-[3px] border-indigo-700 font-black shadow-xs ring-1 ring-indigo-500/80 px-1 py-0.5 rounded';
              else if (hl.color === 'rose') hlStyle = 'bg-rose-300 text-rose-950 border-b-[3px] border-rose-700 font-black shadow-xs ring-1 ring-rose-500/80 px-1 py-0.5 rounded';
              else hlStyle = 'bg-amber-300 text-amber-950 border-b-[3px] border-amber-600 font-black shadow-xs ring-1 ring-amber-500/80 px-1 py-0.5 rounded';
            }

            const grammarCat = isHighlighterMode ? classifyWordGrammar(wCore, sentenceVerbs) : 'vocab';
            const grammarClass = isHighlighterMode ? getGrammarStyle(grammarCat) : '';
            const grammarBadge = isHighlighterMode ? getGrammarBadgeLabel(grammarCat) : '';

            return (
              <span key={wIdx} className="inline-block mr-1">
                {wLead && <span>{wLead}</span>}
                <span
                  onClick={(e) => {
                    if (onWordClick) {
                      e.stopPropagation();
                      onWordClick(wCore, sentenceIndex, hl);
                    }
                  }}
                  className={`cursor-pointer transition-colors ${
                    hl
                      ? `${hlStyle} shadow-sm`
                      : isHighlighterMode
                      ? `${grammarClass} hover:opacity-85`
                      : 'rounded hover:text-emerald-700'
                  }`}
                  title={
                    hl?.translation
                      ? `${wCore}: ${hl.translation}${hl.note ? ` (${hl.note})` : ''} — Tap to edit highlight`
                      : isHighlighterMode
                      ? `${grammarBadge}: "${wCore}" — Tap for definition & notes`
                      : 'Tap word for definition & notes'
                  }
                >
                  {wCore}
                </span>
                {wTrail && <span>{wTrail}</span>}
              </span>
            );
          })
        )}
      </div>

      {/* Multiple Choice Options Bank */}
      <div className="flex flex-wrap gap-2 mt-3 items-center" onClick={(e) => e.stopPropagation()}>
        {options.map((opt, oIdx) => {
          const isCorrectChoice = isSolved && opt.toLowerCase() === hiddenWord.toLowerCase();
          const isWrongChoice = wrongOption === opt;

          let btnClass = 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-950';
          if (isCorrectChoice) {
            btnClass = 'bg-emerald-100 border-emerald-500 text-emerald-900 shadow-xs cursor-default';
          } else if (isWrongChoice) {
            btnClass = 'bg-rose-100 border-rose-400 text-rose-800 animate-shake';
          }

          return (
            <button
              type="button"
              key={oIdx}
              onClick={() => handleOptionClick(opt)}
              disabled={isSolved}
              className={`h-9 px-4 rounded-xl border text-sm font-semibold shadow-xs select-none transition active:scale-95 cursor-pointer ${btnClass}`}
            >
              {opt}
              {isCorrectChoice && <span className="ml-1.5 text-xs text-emerald-700 font-bold">✓</span>}
            </button>
          );
        })}
      </div>

      {/* Feedback message */}
      <div className="text-xs font-semibold mt-2 min-h-[1.25rem]">
        {isSolved ? (
          <span className="text-emerald-700">{t.wellDoneCorrect}</span>
        ) : wrongOption ? (
          <span className="text-rose-600">{t.tryAnotherWord}</span>
        ) : null}
      </div>
    </div>
  );
};
