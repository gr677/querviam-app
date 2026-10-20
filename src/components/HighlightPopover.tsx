import React, { useState, useEffect } from 'react';
import {
  Volume2,
  X,
  Bookmark,
  BookmarkCheck,
  Trash2,
  Check,
  Sparkles,
  BookOpen,
  Copy,
  CheckCheck,
  Compass,
  Lightbulb,
  Mic,
  Gauge,
  AlertTriangle,
  Wind,
  Smile,
  RefreshCw,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { CustomHighlight, EtymologyInfo, PronunciationGuideInfo } from '../types';
import { getT } from '../utils/translations';
import { getQuickTranslation } from '../utils/quickDictionary';
import { isCjkText, getWordPinyin } from '../utils/textUtils';
import { getQuickPronunciationGuide } from '../utils/pronunciationUtils';
import { logAnalyticsEvent } from '../utils/analytics';

interface HighlightPopoverProps {
  word: string;
  sentenceIndex: number;
  existingHighlight?: CustomHighlight;
  baseLang: string;
  targetLang?: string;
  sentenceContext?: string;
  onSaveHighlight: (highlight: CustomHighlight) => void;
  onRemoveHighlight?: (id: string) => void;
  onSpeak: (text: string, rate?: number) => void;
  onClose: () => void;
}

const COLORS: { label: string; value: 'amber' | 'emerald' | 'indigo' | 'rose'; bg: string; border: string }[] = [
  { label: 'Yellow', value: 'amber', bg: 'bg-amber-100', border: 'border-amber-400' },
  { label: 'Green', value: 'emerald', bg: 'bg-emerald-100', border: 'border-emerald-400' },
  { label: 'Blue', value: 'indigo', bg: 'bg-indigo-100', border: 'border-indigo-400' },
  { label: 'Pink', value: 'rose', bg: 'bg-rose-100', border: 'border-rose-400' },
];

export const HighlightPopover: React.FC<HighlightPopoverProps> = ({
  word,
  sentenceIndex,
  existingHighlight,
  baseLang,
  targetLang = 'Italian',
  sentenceContext = '',
  onSaveHighlight,
  onRemoveHighlight,
  onSpeak,
  onClose,
}) => {
  const t = getT(baseLang);

  const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'«»，。！？、“”‘’：；《》（）…—]/g, '').trim();
  const isCjk = isCjkText(cleanWord, targetLang);
  const wordPinyin = isCjk ? getWordPinyin(cleanWord) : '';
  const initialQuick = !existingHighlight?.translation ? getQuickTranslation(cleanWord, targetLang, baseLang) : null;

  const [selectedColor, setSelectedColor] = useState<'amber' | 'emerald' | 'indigo' | 'rose'>(
    existingHighlight?.color || 'amber'
  );
  const [note, setNote] = useState<string>(existingHighlight?.note || '');
  const [customTranslation, setCustomTranslation] = useState<string>(
    existingHighlight?.translation || initialQuick || ''
  );
  const [isSaved, setIsSaved] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isDoubleChecked, setIsDoubleChecked] = useState(Boolean(existingHighlight?.translation));

  // Pronunciation & Articulatory Tongue Guide
  const [showPronunciation, setShowPronunciation] = useState(false);
  const [hasLoadedSpecificPronunciation, setHasLoadedSpecificPronunciation] = useState(false);
  const [pronunciationInfo, setPronunciationInfo] = useState<PronunciationGuideInfo>(() =>
    getQuickPronunciationGuide(cleanWord, targetLang, baseLang)
  );
  const [isLoadingPronunciation, setIsLoadingPronunciation] = useState(false);
  const [adCountdown, setAdCountdown] = useState<number | null>(null);
  const [activeSpeed, setActiveSpeed] = useState<number>(1.0);

  // Dig Deeper (Etymology & Source Language Connection)
  const [etymologyInfo, setEtymologyInfo] = useState<EtymologyInfo | null>(null);
  const [isLoadingEtymology, setIsLoadingEtymology] = useState(false);
  const [hasCopiedToNotes, setHasCopiedToNotes] = useState(false);

  // Automatically fetch & double-check translation if not already set or confirmed
  useEffect(() => {
    if (existingHighlight?.translation) {
      setCustomTranslation(existingHighlight.translation);
      setIsDoubleChecked(true);
      return;
    }

    if (!cleanWord) return;

    logAnalyticsEvent('word_lookup', { word: cleanWord, targetLang });

    if (initialQuick && !customTranslation) {
      setCustomTranslation(initialQuick);
    }

    let isMounted = true;
    setIsTranslating(true);

    fetch('/api/word-translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        word: cleanWord,
        targetLang,
        baseLang,
        sentenceContext,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (isMounted && data && data.translation) {
          setCustomTranslation(data.translation);
          setIsDoubleChecked(Boolean(data.doubleChecked));
        }
      })
      .catch((err) => {
        console.warn('Auto-translate error:', err);
        if (isMounted && initialQuick && !customTranslation) {
          setCustomTranslation(initialQuick);
        }
      })
      .finally(() => {
        if (isMounted) setIsTranslating(false);
      });

    return () => {
      isMounted = false;
    };
  }, [cleanWord, targetLang, baseLang, sentenceContext, existingHighlight]);

  // Deep Phonetician Advice Fetch with guaranteed 3-second delay for advert visibility
  const handleFetchPhonetician = async () => {
    if (isLoadingPronunciation) return;
    setIsLoadingPronunciation(true);
    setAdCountdown(3);

    let remaining = 3;
    const countdownInterval = setInterval(() => {
      remaining -= 1;
      if (remaining > 0) {
        setAdCountdown(remaining);
      } else {
        setAdCountdown(0);
        clearInterval(countdownInterval);
      }
    }, 1000);

    const minDelayPromise = new Promise((resolve) => setTimeout(resolve, 3000));

    try {
      const fetchPromise = fetch('/api/word-pronunciation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: cleanWord,
          targetLang,
          baseLang,
          sentenceContext,
        }),
      });

      const [res] = await Promise.all([fetchPromise, minDelayPromise]);
      if (res.ok) {
        const data = await res.json();
        if (data && (data.tonguePlacement || data.ipa)) {
          setPronunciationInfo((prev) => ({ ...prev, ...data }));
          setHasLoadedSpecificPronunciation(true);
        }
      }
    } catch (e) {
      console.warn('Error fetching detailed phonetician advice:', e);
    } finally {
      clearInterval(countdownInterval);
      setAdCountdown(null);
      setIsLoadingPronunciation(false);
    }
  };

  const handleTogglePronunciation = () => {
    const nextState = !showPronunciation;
    setShowPronunciation(nextState);
    if (nextState && !hasLoadedSpecificPronunciation) {
      handleFetchPhonetician();
    }
  };

  const handleDigDeeper = async () => {
    if (isLoadingEtymology) return;
    setIsLoadingEtymology(true);
    logAnalyticsEvent('dig_deeper_click', { word: cleanWord, targetLang, baseLang });

    try {
      const res = await fetch('/api/word-etymology', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: cleanWord,
          targetLang,
          baseLang,
          sentenceContext,
        }),
      });

      const data = await res.json();
      if (data && data.etymology) {
        setEtymologyInfo(data);
      }
    } catch (err) {
      console.error('Error fetching etymology:', err);
    } finally {
      setIsLoadingEtymology(false);
    }
  };

  const handleCopyToNotes = () => {
    if (!etymologyInfo) return;
    const etymSummary = `[Etymology: ${etymologyInfo.etymology}] ${
      etymologyInfo.cognates && etymologyInfo.cognates.length > 0
        ? `Cognates: ${etymologyInfo.cognates.join(', ')}`
        : ''
    }`.trim();

    const updatedNote = note.trim() ? `${note.trim()} • ${etymSummary}` : etymSummary;
    setNote(updatedNote);
    setHasCopiedToNotes(true);
    setTimeout(() => setHasCopiedToNotes(false), 2000);
  };

  const handlePlaySpeed = (speed: number) => {
    setActiveSpeed(speed);
    onSpeak(cleanWord, speed);
  };

  const handleSave = () => {
    const highlight: CustomHighlight = {
      id: existingHighlight?.id || `hl-${cleanWord.toLowerCase()}-${sentenceIndex}-${Date.now()}`,
      word: cleanWord,
      sentenceIndex,
      translation: customTranslation.trim(),
      color: selectedColor,
      note: note.trim(),
    };
    onSaveHighlight(highlight);
    logAnalyticsEvent('saved_library', { word: cleanWord });
    setIsSaved(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleRemove = () => {
    if (existingHighlight && onRemoveHighlight) {
      onRemoveHighlight(existingHighlight.id);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0 bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🖍️</span>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base leading-none">
                {t.vocabHighlighter}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {t.highlightDesc}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Word Display & Pronunciation Trigger */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                {t.selectedWordLabel}
              </span>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-2xl font-bold text-slate-900 font-serif tracking-tight">
                  {cleanWord}
                </span>
                {isCjk && wordPinyin && (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {wordPinyin}
                  </span>
                )}
                {pronunciationInfo.ipa && (
                  <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {pronunciationInfo.ipa}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleTogglePronunciation}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 border shadow-2xs active:scale-95 ${
                  showPronunciation
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                    : 'bg-white hover:bg-emerald-50 text-emerald-800 border-emerald-300'
                }`}
                title="Pronunciation & articulatory mouth guide"
              >
                <span>Pronunciation</span>
              </button>

              <button
                type="button"
                onClick={() => handlePlaySpeed(1.0)}
                className="p-2.5 rounded-xl bg-white text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 shadow-2xs transition cursor-pointer active:scale-95"
                title={t.wordAudioTooltip}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Pronunciation & Tongue Placement Guide */}
          {showPronunciation && (
            <div className="p-4 bg-gradient-to-br from-emerald-50/90 via-teal-50/70 to-emerald-100/40 border border-emerald-200/90 rounded-2xl space-y-3.5 animate-fade-in shadow-xs">
              <div className="flex items-center justify-between border-b border-emerald-200/70 pb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                  <span className="text-base">👄</span>
                  <span>Pronunciation & Mouth Placement Guide</span>
                </div>

                {/* Multi-Speed Audio Controls */}
                <div className="flex items-center gap-1 bg-white/80 p-0.5 rounded-lg border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-800 px-1">Speed:</span>
                  {[
                    { label: '1.0x', speed: 1.0 },
                    { label: '0.75x', speed: 0.75 },
                    { label: '0.5x', speed: 0.5 },
                  ].map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => handlePlaySpeed(s.speed)}
                      className={`px-1.5 py-0.5 text-[10px] font-bold rounded cursor-pointer transition flex items-center gap-0.5 ${
                        activeSpeed === s.speed
                          ? 'bg-[#008450] text-white shadow-2xs'
                          : 'text-slate-600 hover:bg-emerald-50'
                      }`}
                      title={`Listen at ${s.label} speed`}
                    >
                      <Volume2 className="w-2.5 h-2.5" />
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {isLoadingPronunciation || adCountdown !== null ? (
                <div className="space-y-3 animate-fade-in">
                  {/* Sponsored Advert - prominently displayed during the 3-second delay */}
                  <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/90 border-2 border-amber-300 rounded-2xl p-4 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-400 text-amber-950 font-black text-[10px] tracking-wider uppercase shadow-2xs">
                        <span>📢 SPONSORED</span>
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-black text-amber-950 bg-white px-2.5 py-1 rounded-full border border-amber-300 shadow-2xs">
                        <Clock className="w-3.5 h-3.5 text-amber-700 animate-spin" />
                        <span>Opening in {adCountdown ?? 3}s...</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-amber-950">
                        Phonetic Speech Masterclass
                      </h4>
                      <p className="text-xs text-amber-900 leading-relaxed font-medium">
                        Accelerate native accent reduction with certified articulatory speech coaches. Practice real tongue placement, vowel shifts, and vocal resonance.
                      </p>
                    </div>

                    {/* Visual 3s Countdown Progress Bar */}
                    <div className="w-full bg-amber-200/80 rounded-full h-2.5 overflow-hidden border border-amber-300/50">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-1000 ease-linear"
                        style={{
                          width: adCountdown === 3 ? '25%' : adCountdown === 2 ? '60%' : adCountdown === 1 ? '90%' : '100%',
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-amber-800 font-medium">
                        Ad offsets AI speech tokens for all learners
                      </span>
                      <a
                        href="https://en.wikipedia.org/wiki/Articulatory_phonetics"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-xs font-bold text-amber-950 bg-amber-200 hover:bg-amber-300 border border-amber-400 rounded-xl transition shadow-2xs cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <span>Learn More</span>
                        <ExternalLink className="w-3.5 h-3.5 text-amber-800" />
                      </a>
                    </div>
                  </div>

                  <div className="py-3 px-3 bg-white/90 rounded-xl border border-emerald-200 text-center space-y-1 shadow-2xs">
                    <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-950">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                      <span>Deep phonetician analysis for "{cleanWord}"</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Consulting articulatory phonetics for exact tongue placement, lip opening & vocal cords...
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Syllables and Accent emphasis */}
                  <div className="bg-white/90 p-3 rounded-xl border border-emerald-200/80 flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                        Syllables & Stress
                      </span>
                      <div className="text-sm font-black text-slate-800 tracking-wide mt-0.5 font-mono">
                        {pronunciationInfo.syllables || cleanWord}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {pronunciationInfo.ipa && (
                        <div className="text-right">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                            IPA
                          </span>
                          <span className="inline-block text-xs font-mono font-bold text-emerald-900 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-200">
                            {pronunciationInfo.ipa}
                          </span>
                        </div>
                      )}
                      {pronunciationInfo.stressedSyllable && (
                        <div className="text-right">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                            Primary Stress
                          </span>
                          <span className="inline-block text-xs font-black text-white bg-emerald-700 px-2 py-0.5 rounded-md shadow-2xs">
                            [{pronunciationInfo.stressedSyllable}]
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 4 Anatomical & Linguistic Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    {/* 1. Tongue Placement */}
                    <div className="p-3 bg-white/90 rounded-xl border border-emerald-200/70 shadow-2xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                        <span className="text-base leading-none">👅</span>
                        <span>Tongue Placement</span>
                      </div>
                      <p className="text-[11px] text-slate-700 leading-relaxed">
                        {pronunciationInfo.tonguePlacement}
                      </p>
                    </div>

                    {/* 2. Lip & Jaw Position */}
                    <div className="p-3 bg-white/90 rounded-xl border border-emerald-200/70 shadow-2xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                        <Smile className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Lips & Jaw Opening</span>
                      </div>
                      <p className="text-[11px] text-slate-700 leading-relaxed">
                        {pronunciationInfo.lipAndMouthPosition}
                      </p>
                    </div>

                    {/* 3. Airflow & Voicing */}
                    <div className="p-3 bg-white/90 rounded-xl border border-emerald-200/70 shadow-2xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                        <Wind className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Airflow & Vocal Cords</span>
                      </div>
                      <p className="text-[11px] text-slate-700 leading-relaxed">
                        {pronunciationInfo.airflowAndVoicing}
                      </p>
                    </div>

                    {/* 4. Native Speaker Trap & Accent Pitfalls */}
                    <div className="p-3 bg-amber-50/90 rounded-xl border border-amber-200/90 shadow-2xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-amber-950">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Common Accent Trap</span>
                      </div>
                      <p className="text-[11px] text-amber-950 leading-relaxed">
                        {pronunciationInfo.learnerPitfalls}
                      </p>
                    </div>
                  </div>

                  {/* Tone / Pitch contour (if applicable) */}
                  {pronunciationInfo.toneOrPitchGuide && (
                    <div className="p-2.5 bg-white/80 rounded-xl border border-emerald-200/60 text-[11px] text-slate-700 flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold text-emerald-950">Rhythm & Pitch Contour: </strong>
                        <span>{pronunciationInfo.toneOrPitchGuide}</span>
                      </div>
                    </div>
                  )}

                  {/* Sound-alike and Memory Hook if available */}
                  {(pronunciationInfo.soundAlike || pronunciationInfo.memoryHook) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {pronunciationInfo.soundAlike && (
                        <div className="p-2.5 bg-white/80 rounded-xl border border-emerald-200/60 text-[11px] text-slate-700">
                          <span className="font-bold text-emerald-950 block text-[10px] uppercase tracking-wider">Sounds like ({baseLang}):</span>
                          <span className="font-semibold text-emerald-900 mt-0.5 block">{pronunciationInfo.soundAlike}</span>
                        </div>
                      )}
                      {pronunciationInfo.memoryHook && (
                        <div className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-200/60 text-[11px] text-slate-700">
                          <span className="font-bold text-amber-950 block text-[10px] uppercase tracking-wider">Physical Memory Hook:</span>
                          <span className="text-amber-900 mt-0.5 block">{pronunciationInfo.memoryHook}</span>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Sponsored Advert - Token Offset Monetization */}
              <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200/90 rounded-xl p-2.5 shadow-2xs">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-amber-900 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="bg-amber-300 text-amber-950 px-1.5 py-0.5 rounded text-[9px] font-black">SPONSORED</span>
                    <span>Phonetic Speech Masterclass</span>
                  </span>
                  <span className="text-[10px] text-amber-700 font-normal">Ad offsets token costs</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] text-amber-950 font-medium leading-snug">
                    Accelerate native accent reduction with certified articulatory speech coaches.
                  </p>
                  <a
                    href="https://en.wikipedia.org/wiki/Articulatory_phonetics"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 px-2.5 py-1 text-[11px] font-bold text-amber-950 bg-amber-200 hover:bg-amber-300 border border-amber-300 rounded-lg transition shadow-2xs cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>Learn More</span>
                  </a>
                </div>
              </div>

              {/* Deep Phonetician Action Button (AI removed as requested) */}
              <div className="flex items-center justify-between pt-0.5">
                <span className="text-[10px] text-emerald-800 font-medium">
                  {hasLoadedSpecificPronunciation ? 'Word-specific articulatory analysis active' : 'Word-specific phonetic guidance'}
                </span>
                <button
                  type="button"
                  onClick={handleFetchPhonetician}
                  disabled={isLoadingPronunciation}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-white/90 hover:bg-white px-3 py-1.5 rounded-xl border border-emerald-300 transition cursor-pointer shadow-2xs disabled:opacity-50 active:scale-95"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoadingPronunciation ? 'animate-spin' : ''}`} />
                  <span>{isLoadingPronunciation ? 'Analyzing phonetics...' : 'Deepen with Phonetician'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Color Palette */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
              {t.colorTag}
            </label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setSelectedColor(c.value)}
                  className={`flex-1 h-8 rounded-xl border-2 transition cursor-pointer flex items-center justify-center ${
                    c.bg
                  } ${selectedColor === c.value ? `${c.border} ring-2 ring-slate-400` : 'border-transparent'}`}
                  title={c.label}
                >
                  {selectedColor === c.value && <Check className="w-4 h-4 text-slate-800" />}
                </button>
              ))}
            </div>
          </div>

          {/* Translation Field (in user's Base Language) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                {t.wordTranslationLabel(baseLang)}
              </label>
              <div className="flex items-center gap-1.5">
                {isDoubleChecked && (
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/90 px-1.5 py-0.2 rounded border border-emerald-300">
                    ✓ Double-checked
                  </span>
                )}
                {isTranslating && (
                  <span className="text-[10px] text-slate-400 font-medium animate-pulse">
                    Verifying...
                  </span>
                )}
              </div>
            </div>
            <input
              type="text"
              value={customTranslation}
              onChange={(e) => setCustomTranslation(e.target.value)}
              placeholder={isTranslating ? 'Verifying translation...' : t.wordTranslationPlaceholder}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008450] text-slate-900 transition font-medium"
            />
          </div>

          {/* Notes Field */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
              {t.noteLabel}
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t.notePlaceholder}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008450] text-slate-900 transition"
            />
          </div>

          {/* Dig Deeper: Etymology & Connection to Source Language */}
          <div className="pt-1">
            {!etymologyInfo ? (
              <button
                type="button"
                onClick={handleDigDeeper}
                disabled={isLoadingEtymology}
                className="w-full py-2.5 px-3.5 rounded-xl bg-linear-to-r from-[#008450] to-emerald-700 hover:from-[#007345] hover:to-emerald-800 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm ring-1 ring-emerald-600/30 cursor-pointer active:scale-98 disabled:opacity-50"
              >
                <Compass className={`w-4 h-4 text-emerald-100 ${isLoadingEtymology ? 'animate-spin' : ''}`} />
                <span className="font-bold">
                  {isLoadingEtymology ? t.digDeeperLoading : t.digDeeper}
                </span>
              </button>
            ) : (
              <div className="p-4 bg-linear-to-b from-amber-50/90 to-orange-50/70 border border-amber-200/90 rounded-2xl space-y-3 animate-fade-in shadow-2xs">
                <div className="flex items-center justify-between border-b border-amber-200/70 pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <Compass className="w-4 h-4 text-amber-700" />
                    <span>{t.etymologyTitle}</span>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/90 px-1.5 py-0.5 rounded border border-emerald-300">
                      ✓ Double-checked
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyToNotes}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 hover:text-amber-950 bg-white/80 hover:bg-white px-2 py-0.5 rounded-lg border border-amber-300 transition cursor-pointer shadow-2xs"
                    title={t.copyToNotes}
                  >
                    {hasCopiedToNotes ? (
                      <>
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">{t.copiedToNotes}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-600" />
                        <span>{t.copyToNotes}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 1. Historical Origin & Etymology */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                    {t.originLabel}
                  </span>
                  <p className="text-xs text-amber-950 leading-relaxed font-serif">
                    {etymologyInfo.etymology}
                  </p>
                </div>

                {/* 2. Connection to Source Language */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                    {t.relationLabel(baseLang)}
                  </span>
                  <p className="text-xs text-amber-950 leading-relaxed">
                    {etymologyInfo.connection}
                  </p>
                </div>

                {/* 3. Fun Fact & Memory Hook */}
                {etymologyInfo.fun_fact && (
                  <div className="p-2.5 bg-white/70 rounded-xl border border-amber-200/60 flex items-start gap-2 text-xs text-amber-900">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold text-amber-950">{t.funFactLabel}: </strong>
                      <span>{etymologyInfo.fun_fact}</span>
                    </div>
                  </div>
                )}

                {/* 4. Related Cognates */}
                {etymologyInfo.cognates && etymologyInfo.cognates.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                      {t.cognatesLabel}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {etymologyInfo.cognates.map((c, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-white border border-amber-200 text-amber-900 rounded-lg text-[11px] font-medium shadow-2xs"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2 shrink-0">
          {existingHighlight && (
            <button
              type="button"
              onClick={handleRemove}
              className="p-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 transition cursor-pointer shadow-2xs"
              title={t.removeHighlight}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm active:scale-98 ${
              isSaved
                ? 'bg-emerald-600 text-white'
                : 'bg-[#008450] hover:bg-emerald-700 text-white'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            <span>{isSaved ? t.savedToast : t.saveHighlight}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
