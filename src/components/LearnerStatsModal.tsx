import React, { useState, useEffect } from 'react';
import {
  X,
  Flame,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  Calendar,
  Layers,
  Zap,
} from 'lucide-react';
import { getLearnerStats } from '../utils/storage';
import { LearnerStats } from '../types';
import { getT, getHtmlLangCode } from '../utils/translations';

interface LearnerStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetLang: string;
  baseLang?: string;
  onOpenGlobalAnalytics?: () => void;
}

export const LearnerStatsModal: React.FC<LearnerStatsModalProps> = ({
  isOpen,
  onClose,
  targetLang,
  baseLang = 'English',
  onOpenGlobalAnalytics,
}) => {
  const [stats, setStats] = useState<LearnerStats | null>(null);
  const t = getT(baseLang);
  const htmlLang = getHtmlLangCode(baseLang);

  useEffect(() => {
    if (isOpen) {
      setStats(getLearnerStats());
    }
  }, [isOpen]);

  if (!isOpen || !stats) return null;

  // Build the last 7 calendar days to show active consistency
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const iso = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString(htmlLang, { weekday: 'narrow' });
    const isToday = i === 6;
    const isActive = stats.activeDates.includes(iso);
    return { iso, dayName, isToday, isActive };
  });

  // Calculate estimated CEFR Level
  const words = stats.totalWordsRead;
  let level = 'A1';
  let nextGoal = 100;
  let percent = Math.min(100, Math.round((words / 100) * 100));

  if (words >= 1000) {
    level = 'C1+';
    nextGoal = 2000;
    percent = Math.min(100, Math.round((words / 2000) * 100));
  } else if (words >= 500) {
    level = 'B2';
    nextGoal = 1000;
    percent = Math.min(100, Math.round(((words - 500) / 500) * 100));
  } else if (words >= 250) {
    level = 'B1';
    nextGoal = 500;
    percent = Math.min(100, Math.round(((words - 250) / 250) * 100));
  } else if (words >= 100) {
    level = 'A2';
    nextGoal = 250;
    percent = Math.min(100, Math.round(((words - 100) / 150) * 100));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="flex flex-col w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-linear-to-r from-amber-600 via-orange-600 to-amber-700 text-white shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md border border-white/25 shadow-xs">
              <Flame className="w-6 h-6 text-amber-200 fill-amber-200 animate-bounce-short" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">{t.statsModalTitle}</h3>
              <p className="text-xs text-amber-100">
                {targetLang} — {t.learningJourney}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-amber-100 hover:text-white hover:bg-white/10 transition"
            title={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Daily Streak Card */}
          <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black text-amber-900 tracking-tight">
                    {stats.currentStreak} {stats.currentStreak === 1 ? t.daySingular : t.daysPlural}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                    {t.dailyStreakTitle}
                  </span>
                </div>
                <p className="text-xs text-amber-800 font-medium mt-0.5">
                  {t.bestStreakLabel(stats.bestStreak)} {stats.bestStreak === 1 ? t.daySingular : t.daysPlural}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  {t.last7Days}
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  {last7Days.map((d, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center gap-0.5"
                      title={d.iso}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition ${
                          d.isActive
                            ? 'bg-amber-500 text-white shadow-2xs'
                            : 'bg-slate-200 text-slate-400'
                        } ${d.isToday ? 'ring-2 ring-amber-600 ring-offset-1' : ''}`}
                      >
                        {d.isActive ? '✓' : ''}
                      </div>
                      <span className="text-[9px] font-semibold text-slate-400">
                        {d.dayName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Total Words Read */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>{t.wordsReadLabel}</span>
              </div>
              <div className="text-xl font-black text-slate-900">
                {stats.totalWordsRead.toLocaleString(htmlLang)}
              </div>
              <p className="text-[11px] text-slate-500">
                {t.storiesFound(stats.totalStoriesCompleted)}
              </p>
            </div>

            {/* Flashcards Mastered */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>{t.vocabularyLabel}</span>
              </div>
              <div className="text-xl font-black text-slate-900">
                {stats.knownWordsCount} <span className="text-xs font-semibold text-slate-500">{t.learnedLabel}</span>
              </div>
              <p className="text-[11px] text-slate-500">
                {t.activeMemoryRetention}
              </p>
            </div>

            {/* Study Time */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-800">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>{t.practiceTimeLabel}</span>
              </div>
              <div className="text-xl font-black text-slate-900">
                {stats.practiceMinutes} <span className="text-xs font-semibold text-slate-500">{t.minUnit}</span>
              </div>
              <p className="text-[11px] text-slate-500">
                {t.immersionAudioReading}
              </p>
            </div>

            {/* CEFR Level */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-800">
                <Award className="w-4 h-4 text-purple-600" />
                <span>{t.readingLevelLabel}</span>
              </div>
              <div className="text-xl font-black text-slate-900">
                CEFR {level}
              </div>
              <p className="text-[11px] text-slate-500">
                {t.nextGoalWords(nextGoal)}
              </p>
            </div>
          </div>

          {/* CEFR Fluency Progress Bar */}
          <div className="p-3.5 bg-purple-50/60 border border-purple-200/80 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-purple-900">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
                <span>{t.readingFluencyMilestone}</span>
              </span>
              <span>{percent}%</span>
            </div>
            <div className="w-full h-2.5 bg-purple-200/70 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, percent)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-semibold text-purple-700/80">
              <span>{t.diffBeginner}</span>
              <span>{t.diffIntermediate}</span>
              <span>{t.diffAdvanced}</span>
            </div>
          </div>

          {/* Motivation Quote */}
          <div className="text-center py-1">
            <p className="text-xs text-slate-500 italic">
              {t.motivationQuote}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
          {onOpenGlobalAnalytics ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenGlobalAnalytics();
              }}
              className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer flex items-center gap-1.5 active:scale-95"
              title="Analytics"
            >
              <span>📊 Analytics</span>
            </button>
          ) : <div />}
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
          >
            {t.keepLearningBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
