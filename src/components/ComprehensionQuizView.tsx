import React, { useState } from 'react';
import {
  HelpCircle,
  Volume2,
  Lightbulb,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Award,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StoryData, QuizQuestion } from '../types';
import { tokenizeSentence } from '../utils/textUtils';
import { getT, isRtlLanguage } from '../utils/translations';

interface ComprehensionQuizViewProps {
  story: StoryData;
  questions: QuizQuestion[];
  targetLang: string;
  baseLang?: string;
  savedAnswers: Record<number, number>; // questionIdx -> selectedOptIdx
  savedSolved: Set<number>; // question indices correctly solved
  onAnswerQuestion: (questionIdx: number, selectedOptIdx: number, isCorrect: boolean) => void;
  onResetQuiz: () => void;
  onRegenerateQuestions: () => void;
  onSpeak: (text: string) => void;
  onSpeakSentence?: (index: number) => void;
  onWordClick?: (word: string, sentenceIndex: number, sentenceContext?: string) => void;
  onExitQuiz?: () => void;
  onOpenDictionary?: () => void;
}

export const ComprehensionQuizView: React.FC<ComprehensionQuizViewProps> = ({
  story,
  questions,
  targetLang,
  baseLang = 'English',
  savedAnswers,
  savedSolved,
  onAnswerQuestion,
  onResetQuiz,
  onRegenerateQuestions,
  onSpeak,
  onWordClick,
  onExitQuiz,
  onOpenDictionary,
}) => {
  const t = getT(baseLang);
  const targetIsRtl = isRtlLanguage(targetLang);
  const [revealedTranslations, setRevealedTranslations] = useState<Record<number, boolean>>({});
  const [hintPlayingIdx, setHintPlayingIdx] = useState<number | null>(null);
  const [showStoryReference, setShowStoryReference] = useState(false);

  const totalQuestions = questions.length;
  const solvedCount = savedSolved.size;
  const isAllCompleted = totalQuestions > 0 && solvedCount === totalQuestions;

  // Toggle translation on a specific question
  const toggleTranslation = (qIdx: number) => {
    setRevealedTranslations((prev) => ({
      ...prev,
      [qIdx]: !prev[qIdx],
    }));
  };

  // Play audio hint for the source sentence
  const handlePlayHint = (qIdx: number, q: QuizQuestion) => {
    const sentenceIdx = q.sentenceIndex ?? 0;
    const sentenceTarget =
      q.sourceSentenceTarget || story.sentences[sentenceIdx]?.target || '';

    if (!sentenceTarget) return;

    setHintPlayingIdx(qIdx);
    onSpeak(sentenceTarget);

    setTimeout(() => {
      setHintPlayingIdx(null);
    }, 3500);
  };

  // Handle option selection
  const handleSelectOption = (qIdx: number, optIdx: number, q: QuizQuestion) => {
    // If already solved, allow re-listening to option
    if (savedSolved.has(qIdx)) {
      onSpeak(q.options[optIdx]);
      return;
    }

    const isCorrect = optIdx === q.correctIndex;
    onAnswerQuestion(qIdx, optIdx, isCorrect);

    if (isCorrect) {
      onSpeak(q.options[optIdx]);
      // If this was the last question to solve, trigger celebratory confetti!
      if (solvedCount + 1 === totalQuestions) {
        try {
          confetti({
            particleCount: 90,
            spread: 80,
            origin: { y: 0.6 },
          });
        } catch {}
      }
    }
  };

  const progressPercent = totalQuestions > 0 ? Math.round((solvedCount / totalQuestions) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Quiz Progress & Control Header */}
      <div
        data-no-swipe="true"
        className="bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border-2 border-emerald-300 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#008450] text-white flex items-center justify-center shadow-md shrink-0">
              <HelpCircle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {t.quizChallengeTitle}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {targetLang}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  {t.quizPerSentenceBadge}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {t.quizChallengeSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2 self-end sm:self-center shrink-0">
            {onExitQuiz && (
              <button
                type="button"
                onClick={onExitQuiz}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition cursor-pointer shadow-2xs active:scale-95"
                title={t.backToStory}
              >
                <BookOpen className="w-3.5 h-3.5 text-[#008450]" />
                <span>{t.backToStory}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onResetQuiz}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition cursor-pointer shadow-2xs active:scale-95"
              title={t.resetBtn}
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.resetBtn}</span>
            </button>

            <button
              type="button"
              onClick={onRegenerateQuestions}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-xl transition cursor-pointer shadow-2xs active:scale-95"
              title={t.newQuestionsBtn}
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.newQuestionsBtn}</span>
            </button>

            {onOpenDictionary && (
              <button
                type="button"
                onClick={onOpenDictionary}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-300 rounded-xl transition cursor-pointer shadow-2xs active:scale-95"
                title={t.storyDictionaryTitle}
              >
                <BookOpen className="w-3.5 h-3.5 text-teal-700" />
                <span>{t.storyDictionary}</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar & Counter */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>{t.quizProgressText(solvedCount, totalQuestions)}</span>
            <span className="text-[#008450] font-black">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-200/90 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-[#008450] via-teal-500 to-emerald-400 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Optional Collapsible Story Text Reference */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowStoryReference((prev) => !prev)}
            className="flex items-center gap-2 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span>{showStoryReference ? t.hideStoryRef : t.peekStoryText}</span>
            {showStoryReference ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showStoryReference && (
            <div className="mt-3 p-4 bg-white/95 rounded-2xl border border-emerald-200 text-xs space-y-2 shadow-xs animate-fade-in max-h-60 overflow-y-auto">
              <div className="font-bold text-slate-800 border-b pb-1.5">
                {t.storyTextPrefix} {story.title_target} ({story.title_en})
              </div>
              <div className="space-y-2 divide-y divide-slate-100">
                {story.sentences.map((s, idx) => (
                  <div key={idx} className="pt-2 first:pt-0 flex items-start gap-2">
                    <span className="font-mono text-[11px] font-bold text-emerald-700 shrink-0 w-6">
                      {idx + 1}.
                    </span>
                    <div className="flex-1">
                      <div dir={targetIsRtl ? 'rtl' : 'ltr'} className="text-slate-900 font-medium">{s.target}</div>
                      <div className="text-slate-500 text-[11px]">{s.en}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Completion Banner if all solved */}
      {isAllCompleted && (
        <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl text-white shadow-lg text-center space-y-3 animate-fade-in">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/20 flex items-center justify-center">
            <Award className="w-8 h-8 text-amber-300" />
          </div>
          <h3 className="text-xl font-black">
            {t.challengeMasteredTitle(totalQuestions)}
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-md mx-auto">
            {t.challengeMasteredDesc}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {onOpenDictionary && (
              <button
                type="button"
                onClick={onOpenDictionary}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-300 text-amber-950 font-black text-xs rounded-xl shadow-md hover:bg-amber-200 transition cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t.reviewStoryDictionary}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onResetQuiz}
              className="px-4 py-2 bg-white text-emerald-950 font-bold text-xs rounded-xl shadow-md hover:bg-emerald-50 transition cursor-pointer"
            >
              {t.practiceAgain}
            </button>
            <button
              type="button"
              onClick={onRegenerateQuestions}
              className="px-4 py-2 bg-emerald-800/80 text-white font-bold text-xs rounded-xl shadow-md hover:bg-emerald-800 transition cursor-pointer"
            >
              {t.generateNewQuestions}
            </button>
          </div>
        </div>
      )}

      {/* If no questions yet */}
      {totalQuestions === 0 && (
        <div className="p-8 text-center bg-white rounded-3xl border-2 border-dashed border-emerald-300 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-xs">
            <HelpCircle className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h4 className="text-base font-bold text-slate-800">{t.readyTestComp}</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {t.readyTestCompDesc}
          </p>
          <button
            type="button"
            onClick={onRegenerateQuestions}
            className="px-5 py-2.5 bg-[#008450] hover:bg-[#006b40] text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
          >
            {t.workOutQuestions}
          </button>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-5">
        {questions.map((q, qIdx) => {
          const isAnswered = savedAnswers[qIdx] !== undefined;
          const selectedOpt = savedAnswers[qIdx];
          const isSolved = savedSolved.has(qIdx);
          const isRevealedEn = Boolean(revealedTranslations[qIdx]);
          const isHintPlaying = hintPlayingIdx === qIdx;
          const sentenceNum = (q.sentenceIndex ?? 0) + 1;

          return (
            <div
              key={q.id || qIdx}
              className={`p-5 sm:p-6 rounded-3xl border-2 transition-all shadow-xs space-y-4 ${
                isSolved
                  ? 'bg-emerald-50/40 border-emerald-400'
                  : isAnswered && !isSolved
                  ? 'bg-rose-50/30 border-rose-300'
                  : 'bg-white border-slate-200 hover:border-emerald-300'
              }`}
            >
              {/* Question Header & Hint Button */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 font-black text-xs">
                    {t.questionOf(qIdx + 1, totalQuestions)}
                  </span>
                  {isSolved && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{t.quizCorrectBadge}</span>
                    </span>
                  )}
                  {isAnswered && !isSolved && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300 text-[11px] font-bold">
                      <XCircle className="w-3.5 h-3.5 text-rose-700" />
                      <span>{t.quizTryAnother}</span>
                    </span>
                  )}
                </div>

                {/* Button that reads the source sentence to the user (renamed without speaker icon) */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePlayHint(qIdx, q)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs active:scale-95 ${
                      isHintPlaying
                        ? 'bg-amber-400 text-amber-950 border-2 border-amber-600 ring-2 ring-amber-300 animate-pulse font-black'
                        : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                    title={t.listenOriginalSentence}
                  >
                    <span>{isHintPlaying ? t.playingOriginalSentence : t.listenOriginalSentence}</span>
                  </button>
                </div>
              </div>

              {/* Audio Hint Playing Indicator Banner */}
              {isHintPlaying && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-center justify-between gap-2 animate-fade-in font-medium">
                  <div className="flex items-center gap-2">
                    <span className="animate-spin text-base">🔊</span>
                    <span>
                      {t.readingOriginalSentence(sentenceNum, targetLang)}
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider">
                    {t.originalAudioTag}
                  </span>
                </div>
              )}

              {/* Question Text with speaker audio on this line and clickable interactive words */}
              <div className="space-y-1.5">
                <div className="flex items-start gap-2.5">
                  {/* Speaker icon moved to the line with the question sentence */}
                  <button
                    type="button"
                    onClick={() => onSpeak(q.question_target)}
                    className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#008450] border border-emerald-200 transition cursor-pointer shrink-0 mt-0.5 shadow-2xs active:scale-95 flex items-center justify-center"
                    title={t.pronounceQuestion}
                    aria-label={t.pronounceQuestion}
                  >
                    <Volume2 className="w-4 h-4 text-[#008450]" />
                  </button>

                  <div className="flex-1 space-y-1">
                    <h4
                      dir={targetIsRtl ? 'rtl' : 'ltr'}
                      className="text-base sm:text-lg font-bold text-slate-900 leading-snug flex flex-wrap items-center"
                    >
                      {tokenizeSentence(q.question_target, targetLang).map((token, tIdx) => (
                        <span key={tIdx} className="inline-block mr-1">
                          {token.lead && <span className="text-slate-700">{token.lead}</span>}
                          {token.core ? (
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onWordClick) {
                                  onWordClick(token.core, q.sentenceIndex ?? 0, q.question_target);
                                }
                              }}
                              className="cursor-pointer underline decoration-dotted decoration-emerald-500/80 hover:decoration-solid hover:decoration-emerald-700 hover:bg-amber-100 hover:text-emerald-950 rounded px-1 transition-all text-slate-900 font-bold"
                              title={t.tapWordHint}
                            >
                              {token.core}
                            </span>
                          ) : (
                            <span>{token.raw}</span>
                          )}
                          {token.trail && <span className="text-slate-700">{token.trail}</span>}
                        </span>
                      ))}
                    </h4>
                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        {t.clickWordQuestionHint}
                      </span>
                    </div>
                  </div>
                </div>

                {isRevealedEn ? (
                  <p className="text-xs text-slate-500 font-medium italic animate-fade-in pl-9">
                    {q.question_en}
                  </p>
                ) : (
                  <div className="pl-9">
                    <button
                      type="button"
                      onClick={() => toggleTranslation(qIdx)}
                      className="text-[11px] text-slate-400 hover:text-emerald-700 font-semibold underline underline-offset-2 transition cursor-pointer"
                    >
                      {t.showQuestionTranslation}
                    </button>
                  </div>
                )}
              </div>

              {/* 4 Multiple Choice Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {q.options.map((opt, optIdx) => {
                  const isSelected = selectedOpt === optIdx;
                  const isCorrectOpt = optIdx === q.correctIndex;

                  let optClasses =
                    'border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40 text-slate-800';

                  if (isAnswered) {
                    if (isCorrectOpt && isSolved) {
                      optClasses =
                        'border-emerald-500 bg-emerald-100/90 text-emerald-950 font-black shadow-xs ring-2 ring-emerald-300/80';
                    } else if (isSelected && !isCorrectOpt) {
                      optClasses =
                        'border-rose-400 bg-rose-50 text-rose-900 font-medium shadow-xs';
                    } else if (isSolved) {
                      optClasses = 'border-slate-200 bg-slate-50/60 text-slate-400 opacity-70';
                    }
                  }

                  const letter = String.fromCharCode(65 + optIdx); // A, B, C, D

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(qIdx, optIdx, q)}
                      className={`p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-start gap-2.5 cursor-pointer active:scale-98 ${optClasses}`}
                    >
                      <span className="w-5 h-5 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {letter}
                      </span>
                      <span dir={targetIsRtl ? 'rtl' : 'ltr'} className="flex-1 leading-snug">{opt}</span>
                      {isAnswered && isCorrectOpt && isSolved && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      )}
                      {isSelected && !isCorrectOpt && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation note when answered */}
              {isAnswered && (
                <div
                  className={`p-3 rounded-xl text-xs space-y-1 animate-fade-in ${
                    isSolved
                      ? 'bg-emerald-100/60 border border-emerald-300 text-emerald-950'
                      : 'bg-rose-100/60 border border-rose-300 text-rose-950'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    <span>{isSolved ? t.explanationLabel : t.hintLabel}</span>
                    <span>{t.sentenceLabel(sentenceNum)}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed font-medium">
                    {isSolved ? q.explanation : t.quizWrongHint}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
