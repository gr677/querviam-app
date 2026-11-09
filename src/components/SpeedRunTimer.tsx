import React, { useState, useEffect, useRef } from 'react';
import { Timer, Zap, Play, Pause, RotateCcw, Trophy, X, Flame, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getT } from '../utils/translations';

interface SpeedRunTimerProps {
  isActive: boolean;
  onToggleActive: () => void;
  solvedCount: number;
  totalQuestions: number;
  baseLang?: string;
  onResetPractice: () => void;
  onShareStory?: () => void;
}

export const SpeedRunTimer: React.FC<SpeedRunTimerProps> = ({
  isActive,
  onToggleActive,
  solvedCount,
  totalQuestions,
  baseLang = 'English',
  onResetPractice,
  onShareStory,
}) => {
  const t = getT(baseLang);
  const [selectedDuration, setSelectedDuration] = useState<number>(60); // 60, 90, 120, or 0 (stopwatch)
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [personalBest, setPersonalBest] = useState<number | null>(null);

  const prevSolvedRef = useRef<number>(solvedCount);

  // Load personal best from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('impara_speedrun_pb');
      if (saved) setPersonalBest(parseInt(saved, 10));
    } catch {}
  }, []);

  // Update streak when solvedCount increments
  useEffect(() => {
    if (solvedCount > prevSolvedRef.current) {
      setStreak((s) => s + 1);
    } else if (solvedCount === 0) {
      setStreak(0);
    }
    prevSolvedRef.current = solvedCount;

    // Victory condition check
    if (totalQuestions > 0 && solvedCount === totalQuestions && isRunning) {
      setIsRunning(false);
      setIsCompleted(true);
      const elapsed = selectedDuration > 0 ? selectedDuration - timeLeft : timeLeft;

      if (!personalBest || elapsed < personalBest) {
        setPersonalBest(elapsed);
        try {
          localStorage.setItem('impara_speedrun_pb', elapsed.toString());
        } catch {}
      }

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {}
    }
  }, [solvedCount, totalQuestions, isRunning, timeLeft, selectedDuration, personalBest]);

  // Timer tick
  useEffect(() => {
    let interval: any = null;
    if (isRunning && isActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (selectedDuration === 0) {
            // Count up (Stopwatch)
            return prev + 1;
          }
          if (prev <= 1) {
            // Time is up!
            clearInterval(interval);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isActive, selectedDuration]);

  const handleStart = () => {
    if (solvedCount === totalQuestions) {
      onResetPractice();
    }
    setIsRunning(true);
    setIsCompleted(false);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(selectedDuration);
    setStreak(0);
    setIsCompleted(false);
    onResetPractice();
  };

  const handleSelectPreset = (duration: number) => {
    setSelectedDuration(duration);
    setTimeLeft(duration);
    setIsRunning(false);
    setIsCompleted(false);
  };

  if (!isActive) {
    return (
      <button
        type="button"
        onClick={onToggleActive}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs"
        title={t.enableSpeedRun}
      >
        <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
        <span>{t.speedRunTitle}</span>
      </button>
    );
  }

  const isLowTime = selectedDuration > 0 && timeLeft <= 10 && timeLeft > 0;
  const progressPercent =
    selectedDuration > 0
      ? Math.max(0, Math.min(100, (timeLeft / selectedDuration) * 100))
      : 100;

  return (
    <div className="relative">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border-2 border-amber-400 rounded-2xl shadow-sm text-xs select-none animate-scale-up">
        {/* Flame / Streak */}
        <div className="flex items-center gap-1 font-bold text-amber-800">
          <Flame className={`w-4 h-4 ${streak > 2 ? 'text-rose-500 fill-rose-500 animate-bounce' : 'text-amber-600'}`} />
          <span>{streak}x</span>
        </div>

        {/* Time display */}
        <div
          className={`font-mono font-extrabold text-sm px-2 py-0.5 rounded-lg border transition ${
            isLowTime
              ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
              : 'bg-white text-slate-900 border-amber-200'
          }`}
        >
          {selectedDuration === 0
            ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`
            : `${timeLeft}s`}
        </div>

        {/* Start / Pause / Reset Controls */}
        <div className="flex items-center gap-1">
          {isRunning ? (
            <button
              type="button"
              onClick={handlePause}
              className="p-1 rounded-lg bg-white hover:bg-amber-100 text-slate-700 transition cursor-pointer border border-amber-200 shadow-2xs"
              title={t.pauseTimer}
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStart}
              className="p-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition cursor-pointer shadow-2xs"
              title={t.startTimer}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
            </button>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="p-1 rounded-lg bg-white hover:bg-slate-100 text-slate-600 transition cursor-pointer border border-slate-200"
            title={t.resetSpeedRun}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Presets dropdown */}
        <select
          value={selectedDuration}
          onChange={(e) => handleSelectPreset(parseInt(e.target.value, 10))}
          className="px-1.5 py-0.5 text-[11px] font-bold bg-white border border-amber-200 rounded-lg text-slate-700 focus:outline-none"
        >
          <option value={60}>{t.blitz60}</option>
          <option value={90}>{t.sprint90}</option>
          <option value={120}>{t.run120}</option>
          <option value={0}>{t.stopwatch}</option>
        </select>

        {/* Close Button */}
        <button
          type="button"
          onClick={onToggleActive}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white transition cursor-pointer ml-1"
          title={t.exitSpeedRun}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Completion Modal Overlay */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 text-center shadow-2xl border border-amber-200 space-y-4 animate-scale-up">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center shadow-inner">
              <Trophy className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900">
                {t.speedRunFinished}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {t.speedRunSolvedDesc(
                  totalQuestions,
                  selectedDuration > 0 ? selectedDuration - timeLeft : timeLeft
                )}
              </p>
            </div>

            {personalBest && (
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs font-semibold text-amber-900 flex items-center justify-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span>{t.personalRecord(personalBest)}</span>
              </div>
            )}

            {onShareStory && (
              <button
                type="button"
                onClick={() => {
                  setIsCompleted(false);
                  onShareStory();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs transition cursor-pointer shadow-md active:scale-95"
              >
                <Share2 className="w-4 h-4" />
                <span>Challenge a friend to beat your time!</span>
              </button>
            )}

            <div className="flex gap-2 justify-center pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition cursor-pointer shadow-md"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t.tryAgain}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsCompleted(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
              >
                {t.done}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
