import React from 'react';
import {
  Zap,
  Play,
  Pause,
  RotateCcw,
  Trophy,
  X,
  Flame,
  Share2,
  Lock,
  Unlock,
  Volume2,
  AlarmClock,
} from 'lucide-react';
import { getT } from '../utils/translations';

export const TIMER_MINUTE_OPTIONS = [1, 2, 5, 7, 10, 15, 20, 30] as const;

interface SpeedRunTimerProps {
  isActive: boolean;
  onToggleActive: () => void;
  totalQuestions: number;
  baseLang?: string;
  targetLang?: string;
  onShareStory?: () => void;
  onSpeak?: (text: string) => void;
  isLocked: boolean;
  onToggleLock: () => void;
  selectedDuration: number;
  onSelectDuration: (seconds: number) => void;
  timeLeft: number;
  isRunning: boolean;
  isTimeUp: boolean;
  isCompleted: boolean;
  streak: number;
  personalBest: number | null;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onDismissCompleted: () => void;
  isPinnedDock?: boolean;
}

export const SpeedRunTimer: React.FC<SpeedRunTimerProps> = ({
  isActive,
  onToggleActive,
  totalQuestions,
  baseLang = 'English',
  targetLang = 'Italian',
  onShareStory,
  onSpeak,
  isLocked,
  onToggleLock,
  selectedDuration,
  onSelectDuration,
  timeLeft,
  isRunning,
  isTimeUp,
  isCompleted,
  streak,
  personalBest,
  onStart,
  onPause,
  onReset,
  onDismissCompleted,
  isPinnedDock = false,
}) => {
  const t = getT(baseLang);
  const targetT = getT(targetLang);

  if (!isActive) {
    return (
      <button
        type="button"
        onClick={onToggleActive}
        className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-[11px] sm:text-xs font-bold transition cursor-pointer shadow-2xs"
        title={t.enableSpeedRun}
      >
        <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
        <span>{t.speedRunTitle}</span>
      </button>
    );
  }

  const isLowTime = timeLeft <= 10 && timeLeft > 0;
  const progressPercent =
    selectedDuration > 0
      ? Math.max(0, Math.min(100, (timeLeft / selectedDuration) * 100))
      : 0;

  return (
    <div data-no-swipe="true" className={isPinnedDock ? 'w-full' : 'relative'}>
      <div
        className={
          isPinnedDock
            ? 'max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2 px-3 sm:px-8 py-2 text-xs select-none'
            : 'flex flex-wrap items-center gap-1.5 px-2.5 py-1.5 bg-amber-500/10 border-2 border-amber-400 rounded-2xl shadow-sm text-xs select-none animate-scale-up'
        }
      >
        {/* Left: Streak + Seconds Countdown + Time Up indicator */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1 font-bold text-amber-800 shrink-0">
            <Flame
              className={`w-4 h-4 ${
                streak > 2 ? 'text-rose-500 fill-rose-500 animate-bounce' : 'text-amber-600'
              }`}
            />
            <span>{streak}x</span>
          </div>

          {/* Seconds Countdown Display */}
          <div
            className={`font-mono font-extrabold text-sm px-2.5 py-0.5 rounded-lg border transition tabular-nums shrink-0 ${
              isTimeUp
                ? 'bg-rose-600 text-white border-rose-700 animate-bounce'
                : isLowTime
                  ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                  : isRunning
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                    : 'bg-white text-slate-900 border-amber-300'
            }`}
          >
            {`${timeLeft}s`}
          </div>

          {/* Time's Up Banner + Replay Target Audio */}
          {isTimeUp && (
            <div className="flex items-center gap-1.5 bg-rose-100 border border-rose-300 text-rose-900 px-2 py-0.5 rounded-lg font-bold animate-fade-in">
              <AlarmClock className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span className="truncate">{t.timeUpPhrase}</span>
              {onSpeak && (
                <button
                  type="button"
                  onClick={() => onSpeak(targetT.timeUpPhrase)}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold transition cursor-pointer shrink-0"
                  title={targetT.timeUpPhrase}
                >
                  <Volume2 className="w-3 h-3" />
                  <span className="hidden sm:inline">{targetT.timeUpPhrase}</span>
                </button>
              )}
            </div>
          )}

          {/* Subtle progress bar in pinned dock when room permits */}
          {isPinnedDock && !isTimeUp && (
            <div className="hidden sm:block w-24 h-2 bg-amber-200/80 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isLowTime ? 'bg-rose-500' : 'bg-[#008450]'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}
        </div>

        {/* Right: Controls + Minute Presets + Lock Toggle + Close */}
        <div className="flex items-center gap-1.5 ml-auto shrink-0">
          {isRunning ? (
            <button
              type="button"
              onClick={onPause}
              className="p-1.5 rounded-lg bg-white hover:bg-amber-100 text-slate-700 transition cursor-pointer border border-amber-300 shadow-2xs"
              title={t.pauseTimer}
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onStart}
              className="p-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition cursor-pointer shadow-2xs"
              title={t.startTimer}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
            </button>
          )}

          <button
            type="button"
            onClick={onReset}
            className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-600 transition cursor-pointer border border-slate-200"
            title={t.resetSpeedRun}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Minute Presets Dropdown (localized to "I Speak" language) */}
          <select
            value={selectedDuration}
            onChange={(e) => onSelectDuration(parseInt(e.target.value, 10))}
            className="px-2 py-1 text-[11px] font-bold bg-white border border-amber-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
          >
            {TIMER_MINUTE_OPTIONS.map((minutes) => (
              <option key={minutes} value={minutes * 60}>
                {t.timerMinutesLabel(minutes)}
              </option>
            ))}
          </select>

          {/* Lock / Pin to Top Toggle */}
          <button
            type="button"
            onClick={onToggleLock}
            className={`p-1.5 rounded-lg border transition cursor-pointer ${
              isLocked
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-2xs'
                : 'bg-white text-slate-500 hover:text-slate-800 border-slate-200 hover:bg-slate-50'
            }`}
            title={isLocked ? t.unlockTimerTitle : t.lockTimerTitle}
          >
            {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={onToggleActive}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-white transition cursor-pointer"
            title={t.exitSpeedRun}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
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
                  Math.max(0, selectedDuration - timeLeft)
                )}
              </p>
            </div>

            {personalBest !== null && (
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs font-semibold text-amber-900 flex items-center justify-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span>{t.personalRecord(personalBest)}</span>
              </div>
            )}

            {onShareStory && (
              <button
                type="button"
                onClick={() => {
                  onDismissCompleted();
                  onShareStory();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs transition cursor-pointer shadow-md active:scale-95"
              >
                <Share2 className="w-4 h-4" />
                <span>{t.challengeFriendTimerBtn}</span>
              </button>
            )}

            <div className="flex gap-2 justify-center pt-2">
              <button
                type="button"
                onClick={onReset}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition cursor-pointer shadow-md"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t.tryAgain}</span>
              </button>
              <button
                type="button"
                onClick={onDismissCompleted}
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
