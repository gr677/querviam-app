import React, { useState, useEffect } from 'react';
import {
  X,
  Volume2,
  Sparkles,
  BookOpen,
  Info,
  CheckCircle2,
  Table,
  Layers,
  ArrowRight,
  RefreshCw,
  Clock,
  Compass,
  Link,
  HelpCircle,
} from 'lucide-react';
import { VerbItem } from '../types';
import { getT } from '../utils/translations';
import { enrichVerbData } from '../utils/verbUtils';

interface VerbModalProps {
  verb: VerbItem | null;
  baseLang?: string;
  targetLang?: string;
  onClose: () => void;
  onSpeak: (text: string) => void;
}

type ViewMode = 'table' | 'tabs';

export const VerbModal: React.FC<VerbModalProps> = ({
  verb,
  baseLang = 'English',
  targetLang = 'Italian',
  onClose,
  onSpeak,
}) => {
  const t = getT(baseLang);
  const [currentVerb, setCurrentVerb] = useState<VerbItem | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [activeTenseTab, setActiveTenseTab] = useState<string>('present');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [showMoreTenses, setShowMoreTenses] = useState(false);

  useEffect(() => {
    if (verb) {
      setCurrentVerb(enrichVerbData(verb, targetLang, baseLang));
    } else {
      setCurrentVerb(null);
    }
  }, [verb, targetLang, baseLang]);

  if (!verb || !currentVerb) return null;

  const isIrregular = currentVerb.regularOrIrregular?.toLowerCase().includes('irregular');
  const conjugations = currentVerb.conjugations || {};

  // Core tenses for the comprehensive comparative table
  const coreTenses = ['present', 'past', 'future'];
  const extraTenses = Object.keys(conjugations).filter((k) => !coreTenses.includes(k));
  const displayedTenses = showMoreTenses ? [...coreTenses, ...extraTenses] : coreTenses;

  // Determine row count from the present tense or first available tense
  const sampleTense = conjugations.present || conjugations[Object.keys(conjugations)[0]] || [];
  const rowCount = sampleTense.length;

  const handleFetchAiFullConjugations = async () => {
    if (isLoadingAi || !currentVerb) return;
    setIsLoadingAi(true);

    try {
      const res = await fetch('/api/verb-conjugations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          infinitive: currentVerb.infinitive,
          targetLang,
          baseLang,
          sentenceContext: currentVerb.contextForm || '',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.conjugations) {
          setCurrentVerb((prev) => ({
            ...(prev || currentVerb),
            ...data,
            conjugations: {
              ...(prev?.conjugations || {}),
              ...data.conjugations,
            },
          }));
        }
      }
    } catch (err) {
      console.warn('Error fetching full AI verb conjugations:', err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const getTenseLabel = (tenseKey: string): string => {
    const l = tenseKey.toLowerCase();
    if (l === 'present') return 'Present';
    if (l === 'past') return 'Past (Passato / Pretérito)';
    if (l === 'future') return 'Future (Futuro)';
    if (l === 'imperfect') return 'Imperfect';
    if (l === 'conditional') return 'Conditional';
    if (l === 'subjunctive') return 'Subjunctive';
    return tenseKey.charAt(0).toUpperCase() + tenseKey.slice(1);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => onSpeak(currentVerb.infinitive)}
              className="p-2.5 rounded-2xl bg-[#008450] text-white hover:bg-emerald-700 shadow-sm transition cursor-pointer active:scale-95 shrink-0"
              title={t.listenVerb || 'Listen to verb'}
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 capitalize tracking-tight">
                  {currentVerb.infinitive}
                </h3>
                {currentVerb.regularOrIrregular && (
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      isIrregular
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}
                  >
                    {currentVerb.regularOrIrregular}
                  </span>
                )}
              </div>
              {currentVerb.translation && (
                <p className="text-xs sm:text-sm text-slate-600 font-medium truncate mt-0.5">
                  &ldquo;{currentVerb.translation}&rdquo;
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer shrink-0"
            title={t.close || 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Detailed Sentence Context Card (if used in story) */}
          {(currentVerb.contextForm || currentVerb.moodAndTense || currentVerb.grammaticalNote) && (
            <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Used In Your Story Sentence
                </span>
                {currentVerb.contextForm && (
                  <button
                    type="button"
                    onClick={() => onSpeak(currentVerb.contextForm!)}
                    className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-white px-2 py-0.5 rounded-lg border border-emerald-300 transition cursor-pointer shadow-2xs"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Listen</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-baseline gap-2 pt-0.5">
                {currentVerb.contextForm && (
                  <span className="text-base font-black text-emerald-950 bg-white px-2.5 py-1 rounded-xl border border-emerald-300 shadow-2xs">
                    &laquo; {currentVerb.contextForm} &raquo;
                  </span>
                )}
                {currentVerb.moodAndTense && (
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-lg border border-emerald-300/60">
                    {currentVerb.moodAndTense}
                  </span>
                )}
                {currentVerb.personNumber && (
                  <span className="text-[11px] text-slate-600 font-medium">
                    ({currentVerb.personNumber})
                  </span>
                )}
              </div>

              {currentVerb.grammaticalNote && (
                <div className="text-xs text-slate-700 bg-white/80 p-2.5 rounded-xl border border-emerald-200/60 flex items-start gap-2">
                  <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-normal">{currentVerb.grammaticalNote}</p>
                </div>
              )}
            </div>
          )}

          {/* Useful Verb Essentials (Auxiliary, Participle, Gerund, Valence) (Change 3) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            {/* 1. Auxiliary Verb */}
            <div className="p-3 bg-slate-50/90 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                ⏱️ Auxiliary Verb
              </span>
              <div className="font-bold text-slate-900 mt-1 capitalize flex items-center justify-between">
                <span>{currentVerb.auxiliary || 'avere / have'}</span>
                {currentVerb.auxiliary && (
                  <button
                    type="button"
                    onClick={() => onSpeak(currentVerb.auxiliary!)}
                    className="text-slate-400 hover:text-emerald-700"
                    title={`Listen to ${currentVerb.auxiliary}`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* 2. Past Participle */}
            <div className="p-3 bg-slate-50/90 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                📝 Past Participle
              </span>
              <div className="font-bold text-slate-900 mt-1 flex items-center justify-between">
                <span>{currentVerb.pastParticiple || '—'}</span>
                {currentVerb.pastParticiple && (
                  <button
                    type="button"
                    onClick={() => onSpeak(currentVerb.pastParticiple!)}
                    className="text-slate-400 hover:text-emerald-700"
                    title={`Listen to ${currentVerb.pastParticiple}`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* 3. Gerund / Present Participle */}
            <div className="p-3 bg-slate-50/90 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                🌊 Gerund (-ing)
              </span>
              <div className="font-bold text-slate-900 mt-1 flex items-center justify-between">
                <span>{currentVerb.gerund || '—'}</span>
                {currentVerb.gerund && (
                  <button
                    type="button"
                    onClick={() => onSpeak(currentVerb.gerund!)}
                    className="text-slate-400 hover:text-emerald-700"
                    title={`Listen to ${currentVerb.gerund}`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* 4. Preposition Pattern / Valence */}
            <div className="p-3 bg-slate-50/90 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                🔗 Common Preposition
              </span>
              <div className="font-bold text-slate-900 mt-1 truncate" title={currentVerb.prepositionPattern || 'Direct object'}>
                {currentVerb.prepositionPattern || `${currentVerb.infinitive} + obj`}
              </div>
            </div>
          </div>

          {/* Conjugation Presentation Bar */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Table className="w-4 h-4 text-[#008450]" />
                  Conjugation Paradigm
                </h4>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-300">
                  Present • Past • Future
                </span>
              </div>

              {/* View Mode Toggle: Unified Table vs Per-Tense Tabs */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1 ${
                    viewMode === 'table'
                      ? 'bg-slate-800 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title="Comparative side-by-side table"
                >
                  <Table className="w-3.5 h-3.5" />
                  <span>Table View</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('tabs')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1 ${
                    viewMode === 'tabs'
                      ? 'bg-slate-800 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title="Tabbed view per tense"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Tense Tabs</span>
                </button>
              </div>
            </div>

            {/* UNIFIED COMPARATIVE TABLE (Change 3) */}
            {viewMode === 'table' ? (
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100/80 text-slate-700 font-extrabold text-[11px] border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3 sm:px-4 bg-slate-200/60 w-28 sm:w-36 sticky left-0 z-10">
                          Subject / Pronoun
                        </th>
                        {displayedTenses.map((tKey) => (
                          <th key={tKey} className="py-2.5 px-3 sm:px-4 min-w-[140px]">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  tKey === 'present'
                                    ? 'bg-[#008450]'
                                    : tKey === 'past'
                                    ? 'bg-blue-600'
                                    : 'bg-purple-600'
                                }`}
                              />
                              <span className="capitalize">{getTenseLabel(tKey)}</span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {Array.from({ length: rowCount }).map((_, rIdx) => {
                        const pronoun = sampleTense[rIdx]?.person || `Person ${rIdx + 1}`;

                        return (
                          <tr key={rIdx} className="hover:bg-slate-50/70 transition">
                            <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-700 bg-slate-50/50 sticky left-0 z-10 border-r border-slate-100">
                              {pronoun}
                            </td>

                            {displayedTenses.map((tKey) => {
                              const item = conjugations[tKey]?.[rIdx];
                              if (!item) {
                                return (
                                  <td key={tKey} className="py-2.5 px-3 sm:px-4 text-slate-400 italic">
                                    —
                                  </td>
                                );
                              }

                              const isContextMatch =
                                Boolean(currentVerb.contextForm) &&
                                item.form.toLowerCase().includes(currentVerb.contextForm!.toLowerCase());

                              return (
                                <td
                                  key={tKey}
                                  className={`py-2.5 px-3 sm:px-4 transition ${
                                    isContextMatch ? 'bg-emerald-50/90 font-bold' : ''
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-1.5">
                                    <div className="min-w-0">
                                      <span
                                        className={`font-semibold ${
                                          isContextMatch
                                            ? 'text-[#008450] font-black'
                                            : 'text-slate-900'
                                        }`}
                                      >
                                        {item.form}
                                      </span>
                                      {isContextMatch && (
                                        <span className="ml-1.5 text-[9px] text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded font-extrabold inline-block shadow-2xs">
                                          in story
                                        </span>
                                      )}
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => onSpeak(item.form)}
                                      className="p-1 rounded-md text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition cursor-pointer shrink-0"
                                      title={`Listen to "${item.form}"`}
                                    >
                                      <Volume2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer Toolbar */}
                <div className="px-4 py-2.5 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="text-[11px] text-slate-500">
                    💡 Tap any <Volume2 className="w-3 h-3 inline text-slate-400" /> icon to hear pronunciation
                  </div>

                  <div className="flex items-center gap-2">
                    {extraTenses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowMoreTenses(!showMoreTenses)}
                        className="text-[11px] font-bold text-slate-700 hover:text-slate-900 px-2.5 py-1 rounded-lg bg-white border border-slate-200 transition cursor-pointer shadow-2xs"
                      >
                        {showMoreTenses ? 'Show Core Tenses Only' : `Show Imperfect & Conditional (+${extraTenses.length})`}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleFetchAiFullConjugations}
                      disabled={isLoadingAi}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300 transition cursor-pointer shadow-2xs disabled:opacity-50"
                      title="Request complete linguistic paradigm expansion from AI"
                    >
                      <RefreshCw className={`w-3 h-3 ${isLoadingAi ? 'animate-spin' : ''}`} />
                      <span>{isLoadingAi ? 'Expanding...' : 'Full AI Paradigm'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* TABBED VIEW (Single Tense at a time) */
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-xs overflow-x-auto pb-1">
                  {Object.keys(conjugations).map((tKey) => (
                    <button
                      key={tKey}
                      type="button"
                      onClick={() => setActiveTenseTab(tKey)}
                      className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition capitalize whitespace-nowrap ${
                        activeTenseTab === tKey
                          ? 'bg-[#008450] text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {getTenseLabel(tKey)}
                    </button>
                  ))}
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold text-[11px] border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3 w-1/3">Subject / Pronoun</th>
                        <th className="py-2 px-3">Conjugated Form</th>
                        <th className="py-2 px-3 text-center w-12">Listen</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(conjugations[activeTenseTab] || []).map((item, idx) => {
                        const isContextMatch =
                          Boolean(currentVerb.contextForm) &&
                          item.form.toLowerCase().includes(currentVerb.contextForm!.toLowerCase());

                        return (
                          <tr
                            key={idx}
                            className={`transition ${
                              isContextMatch ? 'bg-emerald-50/80 font-bold' : 'hover:bg-slate-50/80'
                            }`}
                          >
                            <td className="py-2.5 px-3 text-slate-600 font-medium">
                              {item.person || '—'}
                            </td>
                            <td className="py-2.5 px-3 text-slate-900">
                              <span className={isContextMatch ? 'text-[#008450] font-black' : ''}>
                                {item.form}
                              </span>
                              {isContextMatch && (
                                <span className="ml-1.5 text-[9px] text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded font-extrabold">
                                  in story
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => onSpeak(item.form)}
                                className="p-1 text-slate-400 hover:text-[#008450] hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                                title={`Listen to ${item.form}`}
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
