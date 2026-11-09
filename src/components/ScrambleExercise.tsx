import React, { useState, useEffect, useId } from 'react';
import { Volume2, RotateCcw, Headphones, HelpCircle, Sparkles } from 'lucide-react';
import { getT } from '../utils/translations';
import { segmentWords } from '../utils/textUtils';

interface ScrambleExerciseProps {
  sentenceIndex: number;
  sentenceText: string;
  isEasyMode: boolean;
  isVoiceOnly?: boolean;
  sentenceTranslation?: string;
  isInitiallySolved?: boolean;
  targetLang?: string;
  baseLang?: string;
  savedPlaced?: (number | null)[];
  onSolve: (index: number) => void;
  onPlacedChange?: (index: number, placed: (number | null)[]) => void;
  onSpeakText: (text: string, customRate?: number) => void;
  onWordClick?: (word: string, sentenceIndex: number) => void;
}

interface WordTile {
  text: string;
  originalPos: number;
}

export const ScrambleExercise: React.FC<ScrambleExerciseProps> = ({
  sentenceIndex,
  sentenceText,
  isEasyMode,
  isVoiceOnly = false,
  sentenceTranslation,
  isInitiallySolved = false,
  targetLang,
  baseLang = 'English',
  savedPlaced,
  onSolve,
  onPlacedChange,
  onSpeakText,
  onWordClick,
}) => {
  const t = getT(baseLang);
  const compId = useId();
  const [words, setWords] = useState<WordTile[]>([]);
  const [order, setOrder] = useState<number[]>([]);
  const [placed, setPlaced] = useState<(number | null)[]>([]);
  const [isSolved, setIsSolved] = useState(isInitiallySolved);
  const [isWrong, setIsWrong] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [showTranslationHint, setShowTranslationHint] = useState(false);

  const [draggedPos, setDraggedPos] = useState<number | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);

  // Initialize or rescramble
  const initExercise = () => {
    const rawTokens = segmentWords(sentenceText, targetLang);
    const wordList: WordTile[] = rawTokens.map((text, originalPos) => ({ text, originalPos }));
    let initialOrder = wordList.map(w => w.originalPos);

    // Shuffle ensuring it doesn't start in already-correct order if length > 1
    if (wordList.length > 1) {
      let attempts = 0;
      do {
        for (let i = initialOrder.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [initialOrder[i], initialOrder[j]] = [initialOrder[j], initialOrder[i]];
        }
        attempts++;
      } while (attempts < 10 && initialOrder.every((p, i) => p === i));
    }

    setWords(wordList);
    setOrder(initialOrder);

    if (isInitiallySolved) {
      const solvedArr = wordList.map((_, i) => i);
      setPlaced(solvedArr);
      setIsSolved(true);
      setIsWrong(false);
      setFeedback('✅ Perfect! Well done.');
    } else if (savedPlaced && savedPlaced.length === wordList.length) {
      setPlaced(savedPlaced);
      const isComplete = !savedPlaced.includes(null) && savedPlaced.every((pos, i) => {
        if (pos === null) return false;
        return wordList[pos]?.text?.trim().toLowerCase() === wordList[i]?.text?.trim().toLowerCase();
      });
      setIsSolved(isComplete);
      setIsWrong(!savedPlaced.includes(null) && !isComplete);
      setFeedback(isComplete ? '✅ Perfect! Well done.' : '');
    } else {
      setPlaced(new Array(wordList.length).fill(null));
      setIsSolved(false);
      setIsWrong(false);
      setFeedback('');
    }

    setDraggedPos(null);
    setDragOverSlot(null);
  };

  useEffect(() => {
    initExercise();
  }, [sentenceText, isEasyMode]);

  // Helper to check if placed tile matches the target slot word (handles duplicate words gracefully)
  const isMatchForSlot = (tilePos: number | null, slotIdx: number): boolean => {
    if (tilePos === null) return false;
    const tileWord = words[tilePos]?.text;
    const slotTargetWord = words[slotIdx]?.text;
    if (!tileWord || !slotTargetWord) return false;
    return tileWord.trim().toLowerCase() === slotTargetWord.trim().toLowerCase();
  };

  // Check victory condition whenever placed changes
  useEffect(() => {
    if (placed.length > 0) {
      onPlacedChange?.(sentenceIndex, placed);
    }
    if (placed.length === 0 || placed.includes(null)) {
      return;
    }

    // Accepts either instance of repeated words
    const correct = placed.every((pos, i) => isMatchForSlot(pos, i));
    if (correct) {
      setIsSolved(true);
      setIsWrong(false);
      setFeedback(isVoiceOnly ? '🎉 Excellent ear! You transcribed the sentence accurately by listening.' : t.perfectWellDone);
      onSolve(sentenceIndex);
    } else {
      setIsWrong(true);
      setFeedback(t.notQuiteRight);
    }
  }, [placed]);

  // Find next available slot to place tile into (left to right)
  const findTargetSlot = (): number => {
    // 1. Look for truly empty (null) slot first (next available slot)
    const firstNull = placed.indexOf(null);
    if (firstNull !== -1) {
      return firstNull;
    }

    // 2. If no null slots, look for the first incorrect slot
    if (isEasyMode) {
      // In easy mode, any slot where tile does not match slot word is wrong/red
      const firstWrongInEasy = placed.findIndex((pos, i) => pos !== null && !isMatchForSlot(pos, i));
      if (firstWrongInEasy !== -1) return firstWrongInEasy;
    } else if (isWrong) {
      // In normal mode, if all filled but incorrect, any non-matching slot is wrong
      const firstWrong = placed.findIndex((pos, i) => pos !== null && !isMatchForSlot(pos, i));
      if (firstWrong !== -1) return firstWrong;
    }

    return -1;
  };

  const placeTile = (originalPos: number, slotIndex?: number) => {
    if (isSolved) return;

    // In easy mode, if already in a valid matching slot, it is locked
    const currentSlot = placed.indexOf(originalPos);
    if (isEasyMode && currentSlot !== -1 && isMatchForSlot(originalPos, currentSlot)) return;

    let targetSlot = slotIndex !== undefined ? slotIndex : findTargetSlot();
    if (targetSlot === -1) return;

    // Prevent overwriting a locked correct tile in easy mode
    if (isEasyMode && placed[targetSlot] !== null && isMatchForSlot(placed[targetSlot], targetSlot)) return;

    setPlaced((prev) => {
      const next = [...prev];
      const existingInTarget = next[targetSlot];

      if (currentSlot !== -1) {
        // Tile was already on the board in currentSlot -> swap existingInTarget back to currentSlot
        next[currentSlot] = existingInTarget;
      }
      next[targetSlot] = originalPos;
      return next;
    });
    setIsWrong(false);
    setFeedback('');
  };

  const returnTile = (slotIndex: number) => {
    if (isSolved) return;
    const pos = placed[slotIndex];
    if (pos === null) return;
    // In easy mode, locked matching tiles cannot be removed
    if (isEasyMode && isMatchForSlot(pos, slotIndex)) return;

    setPlaced((prev) => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
    setIsWrong(false);
    setFeedback('');
  };

  const handleHearProgress = () => {
    const placedWords = placed
      .filter((p): p is number => p !== null)
      .map((p) => words[p].text);

    if (placedWords.length === 0) {
      setFeedback('Tap words below to build your sentence first!');
      return;
    }
    onSpeakText(placedWords.join(' '));
  };

  // Drag and drop handlers with visual indicators and cross-browser reliability
  const handleDragStart = (e: React.DragEvent, pos: number) => {
    setDraggedPos(pos);
    e.dataTransfer.setData('text/plain', `${compId}:${pos}`);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedPos(null);
    setDragOverSlot(null);
  };

  const handleDragOver = (e: React.DragEvent, slotIdx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverSlot !== slotIdx) {
      setDragOverSlot(slotIdx);
    }
  };

  const handleDragLeave = (e: React.DragEvent, slotIdx: number) => {
    e.preventDefault();
    if (dragOverSlot === slotIdx) {
      setDragOverSlot(null);
    }
  };

  const handleDrop = (e: React.DragEvent, slotIdx: number) => {
    e.preventDefault();
    setDragOverSlot(null);
    let pos: number | null = draggedPos;
    try {
      const data = e.dataTransfer.getData('text/plain');
      if (data && data.startsWith(`${compId}:`)) {
        const parsed = parseInt(data.split(':')[1], 10);
        if (!isNaN(parsed)) {
          pos = parsed;
        }
      }
    } catch {
      // fallback to draggedPos
    }
    if (pos !== null && !isNaN(pos)) {
      placeTile(pos, slotIdx);
    }
    setDraggedPos(null);
  };

  return (
    <div className="my-2 bg-[#f8fafc] p-3 rounded-xl border border-slate-200">
      {/* Interactive Listening Dictation Header */}
      {isVoiceOnly && (
        <div className="mb-3 p-3 bg-gradient-to-r from-teal-50 via-emerald-50 to-sky-50 rounded-xl border border-teal-200/90 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-700 text-white text-[11px] font-black uppercase tracking-wider shadow-2xs">
                <Headphones className="w-3.5 h-3.5" />
                <span>Listening Dictation Mode</span>
              </span>
              <span className="text-xs text-teal-900 font-medium">
                Listen to native audio & build sentence
              </span>
            </div>
            {sentenceTranslation && (
              <button
                type="button"
                onClick={() => setShowTranslationHint((prev) => !prev)}
                className="text-xs text-teal-800 hover:text-teal-950 font-bold underline underline-offset-2 flex items-center gap-1 cursor-pointer transition"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showTranslationHint ? 'Hide translation hint' : 'Show translation hint'}</span>
              </button>
            )}
          </div>

          {/* Audio Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onSpeakText(sentenceText)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
              title="Play sentence audio at standard speed"
            >
              <Volume2 className="w-4 h-4" />
              <span>Listen to Sentence</span>
            </button>

            <button
              type="button"
              onClick={() => onSpeakText(sentenceText, 0.75)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-teal-50 text-teal-800 border border-teal-300 active:scale-95 font-bold text-xs rounded-xl shadow-2xs transition cursor-pointer"
              title="Play sentence at slower 0.75x speed"
            >
              <span>🐢</span>
              <span>Slow (0.75x)</span>
            </button>

            <span className="text-[11px] text-teal-800 font-medium italic">
              💡 Tap any word tile below to preview its pronunciation!
            </span>
          </div>

          {showTranslationHint && sentenceTranslation && (
            <div className="mt-2.5 pt-2 border-t border-teal-200 text-xs text-teal-950 font-medium italic">
              Translation: &ldquo;{sentenceTranslation}&rdquo;
            </div>
          )}
        </div>
      )}

      {/* Target Slots Area */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 p-1.5 sm:p-2.5 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 min-h-[32px] sm:min-h-[48px] items-center transition-all">
        {words.map((_, slotIdx) => {
          const pos = placed[slotIdx];
          const isSlotEmpty = pos === null;

          if (isSlotEmpty) {
            const isHovered = dragOverSlot === slotIdx;
            return (
              <span
                key={slotIdx}
                onDragOver={(e) => handleDragOver(e, slotIdx)}
                onDragLeave={(e) => handleDragLeave(e, slotIdx)}
                onDrop={(e) => handleDrop(e, slotIdx)}
                className={`inline-flex items-center justify-center min-w-[42px] sm:min-w-[54px] ${
                  isHovered ? 'h-9 ring-2 ring-blue-400 border-blue-500 bg-blue-100' : 'h-4.5 sm:h-9 border-slate-300 bg-white/60'
                } px-2 sm:px-3 rounded-md sm:rounded-lg border-2 border-dashed text-transparent text-[10px] sm:text-sm select-none transition-all duration-150`}
              >
                _
              </span>
            );
          }

          const word = words[pos];
          const isSlotMatching = isMatchForSlot(pos, slotIdx);
          const isLockedCorrect = isEasyMode && isSlotMatching;
          const isTileCorrect = isSolved || (isEasyMode ? isLockedCorrect : isSlotMatching);
          const isTileWrong = isEasyMode ? !isLockedCorrect : (!isSolved && isWrong && !isSlotMatching);
          const isHovered = dragOverSlot === slotIdx;

          let badgeClass = 'bg-white border-slate-300 text-slate-800 hover:bg-amber-50 hover:border-amber-400';
          if (isTileCorrect) {
            badgeClass = 'bg-emerald-100 border-emerald-500 text-emerald-900 shadow-sm';
          } else if (isTileWrong) {
            badgeClass = 'bg-rose-100 border-rose-400 text-rose-800 animate-shake';
          }
          if (isHovered && !isLockedCorrect) {
            badgeClass += ' ring-2 ring-blue-500 ring-offset-1 bg-blue-50';
          }

          return (
            <button
              type="button"
              key={slotIdx}
              draggable={!isSolved && !isLockedCorrect}
              onDragStart={(e) => handleDragStart(e, pos)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, slotIdx)}
              onDragLeave={(e) => handleDragLeave(e, slotIdx)}
              onDrop={(e) => handleDrop(e, slotIdx)}
              onClick={() => {
                if (isTileCorrect && onWordClick) {
                  onWordClick(word.text, sentenceIndex);
                } else {
                  returnTile(slotIdx);
                }
              }}
              title={
                isTileCorrect
                  ? 'Correct! Click to view word translation & pronunciation'
                  : 'Click to return to bank (or drag to swap)'
              }
              className={`inline-flex items-center justify-center min-w-[50px] h-9 px-3 rounded-lg border font-semibold text-sm select-none shadow-xs transition-all active:scale-95 ${
                isTileCorrect
                  ? 'cursor-pointer hover:underline hover:ring-2 hover:ring-emerald-400/50'
                  : !isSolved && !isLockedCorrect
                  ? 'cursor-grab active:cursor-grabbing'
                  : 'cursor-default'
              } ${badgeClass}`}
            >
              <span className="pointer-events-none">{word.text}</span>
              {(isLockedCorrect || (isSolved && isEasyMode)) && <span className="ml-1 text-xs pointer-events-none">✓</span>}
            </button>
          );
        })}
      </div>

      {/* Unused Word Bank */}
      <div className="flex flex-wrap gap-2 my-2.5 min-h-[40px] items-center">
        {order.map((pos) => {
          if (placed.includes(pos)) return null;
          const word = words[pos];
          return (
            <button
              type="button"
              key={pos}
              draggable="true"
              onDragStart={(e) => handleDragStart(e, pos)}
              onDragEnd={handleDragEnd}
              onClick={() => {
                if (isVoiceOnly) {
                  onSpeakText(word.text);
                }
                placeTile(pos);
              }}
              title={isVoiceOnly ? `Tap to hear "${word.text}" and place into next slot` : 'Tap to place in next available slot, or drag into any slot'}
              className="inline-flex items-center justify-center h-9 px-3.5 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 border border-blue-200 text-blue-900 font-semibold text-sm rounded-lg shadow-xs transition cursor-grab active:cursor-grabbing select-none active:scale-95"
            >
              {isVoiceOnly && <Volume2 className="w-3 h-3 text-teal-600 mr-1.5 opacity-70" />}
              {word.text}
            </button>
          );
        })}
        {order.every((p) => placed.includes(p)) && !isSolved && (
          <span className="text-xs text-slate-500 italic py-1">All tiles placed</span>
        )}
      </div>

      {/* Feedback & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60">
        <div
          className={`text-xs font-semibold ${
            isSolved ? 'text-emerald-700' : isWrong ? 'text-rose-600' : 'text-slate-600'
          }`}
        >
          {feedback}
        </div>

        <div className="flex items-center gap-2">
          {!isEasyMode && (
            <button
              type="button"
              onClick={handleHearProgress}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-md transition"
              title={t.hearProgress}
            >
              <Volume2 className="w-3.5 h-3.5 text-blue-600" />
              <span>{t.hearProgress}</span>
            </button>
          )}

          <button
            type="button"
            onClick={initExercise}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-md transition"
            title={t.rescramble}
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.rescramble}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
