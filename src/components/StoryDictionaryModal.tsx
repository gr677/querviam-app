import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  BookOpen,
  Volume2,
  Search,
  Sparkles,
  Bookmark,
  Check,
  Loader2,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { CustomHighlight, StoryData, StoryDictionaryEntry } from '../types';
import { getCachedStoryDictionary, saveCachedStoryDictionary } from '../utils/storage';
import { getT, isRtlLanguage } from '../utils/translations';
import { isChinese, extractChineseStoryWords } from '../utils/chineseUtils';
import { COMMON_VOCAB_TRANSLATIONS } from '../utils/quickDictionary';

interface StoryDictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: StoryData | null;
  storyKey: string;
  targetLang: string;
  baseLang?: string;
  customHighlights?: CustomHighlight[];
  onSpeak: (text: string) => void;
  onSaveToFlashcards?: (entry: StoryDictionaryEntry) => void;
}

interface ExtractedWord {
  word: string;
  lower: string;
  sentenceIndex: number;
}

const BATCH_LIMIT = 100;

function extractUniqueStoryWords(story: StoryData, targetLang: string): ExtractedWord[] {
  const seen = new Set<string>();
  const result: ExtractedWord[] = [];
  const targetIsChinese = isChinese(targetLang) || isChinese(story._meta?.targetLang);

  story.sentences.forEach((sentence, sIdx) => {
    const text = sentence.target || '';
    if (!text.trim()) return;

    const rawTokens = targetIsChinese
      ? extractChineseStoryWords(text)
      : text.split(/\s+/);

    for (const raw of rawTokens) {
      // Strip leading/trailing punctuation while keeping internal apostrophes/hyphens
      const cleaned = raw
        .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '')
        .trim();
      if (!cleaned) continue;
      // Skip standalone pure numbers
      if (/^\d+$/.test(cleaned)) continue;

      const lower = cleaned.toLowerCase();
      if (seen.has(lower)) continue;
      seen.add(lower);
      result.push({ word: cleaned, lower, sentenceIndex: sIdx });
    }
  });

  return result;
}

function normalizeLookupKey(raw: string): string {
  return String(raw || '')
    .replace(/[’‘ʼ`]/g, "'")
    .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '')
    .trim()
    .toLowerCase();
}

function stripDiacritics(raw: string): string {
  return raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function normalizePosCategory(pos?: string): 'noun' | 'verb' | 'adj' | 'other' {
  const p = (pos || '').toLowerCase().trim();
  if (p.startsWith('noun') || p === 'n') return 'noun';
  if (p.startsWith('verb') || p === 'v') return 'verb';
  if (p.startsWith('adj') || p === 'a') return 'adj';
  return 'other';
}

export const StoryDictionaryModal: React.FC<StoryDictionaryModalProps> = ({
  isOpen,
  onClose,
  story,
  storyKey,
  targetLang,
  baseLang = 'English',
  customHighlights = [],
  onSpeak,
  onSaveToFlashcards,
}) => {
  const t = getT(baseLang);
  const targetIsRtl = isRtlLanguage(targetLang);
  const baseIsRtl = isRtlLanguage(baseLang);

  const [entries, setEntries] = useState<StoryDictionaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFromCache, setIsFromCache] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [posFilter, setPosFilter] = useState<'all' | 'noun' | 'verb' | 'adj' | 'other'>('all');
  const [sortMode, setSortMode] = useState<'story' | 'az'>('story');
  const [expandedWordKey, setExpandedWordKey] = useState<string | null>(null);
  const [retryNonce, setRetryNonce] = useState(0);

  // Clear stale search/POS filters whenever switching stories or opening the modal
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setPosFilter('all');
      setExpandedWordKey(null);
    }
  }, [isOpen, storyKey]);

  const extractedWords = useMemo(() => {
    if (!story) return [];
    return extractUniqueStoryWords(story, targetLang);
  }, [story, targetLang]);

  // Pre-build 0-token lookup map from story verbs & user's saved highlights
  const zeroTokenMap = useMemo(() => {
    const map = new Map<string, StoryDictionaryEntry>();
    if (!story) return map;

    story.sentences.forEach((s, sIdx) => {
      (s.verbs || []).forEach((v) => {
        if (v.contextForm && v.translation) {
          const cleanForm = v.contextForm.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '').trim();
          const key = cleanForm.toLowerCase();
          if (key && !map.has(key)) {
            map.set(key, {
              word: cleanForm,
              baseForm: v.infinitive && v.infinitive.toLowerCase() !== key ? v.infinitive : undefined,
              meaning: v.translation,
              partOfSpeech: 'verb',
              sentenceIndex: sIdx,
            });
          }
        }
        if (v.infinitive && v.translation) {
          const key = v.infinitive.toLowerCase().trim();
          if (key && !map.has(key)) {
            map.set(key, {
              word: v.infinitive.trim(),
              meaning: v.translation,
              partOfSpeech: 'verb',
              sentenceIndex: sIdx,
            });
          }
          // Also index conjugated forms provided on starter/generated stories
          if (v.conjugations && typeof v.conjugations === 'object') {
            Object.values(v.conjugations).forEach((forms) => {
              if (!Array.isArray(forms)) return;
              forms.forEach((f) => {
                const rawForm = String(f?.form || '').trim();
                const lastToken = rawForm.split(/\s+/).pop() || rawForm;
                const cleanConj = lastToken.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '').toLowerCase();
                if (cleanConj && !map.has(cleanConj)) {
                  map.set(cleanConj, {
                    word: cleanConj,
                    baseForm: v.infinitive.toLowerCase() !== cleanConj ? v.infinitive : undefined,
                    meaning: v.translation,
                    partOfSpeech: 'verb',
                    sentenceIndex: sIdx,
                  });
                }
              });
            });
          }
        }
      });
    });

    customHighlights.forEach((hl) => {
      if (hl.word && hl.translation) {
        const key = hl.word.toLowerCase().trim();
        if (key && !map.has(key)) {
          map.set(key, {
            word: hl.word,
            meaning: hl.translation,
            partOfSpeech: 'other',
            sentenceIndex: hl.sentenceIndex ?? 0,
          });
        }
      }
    });

    // Reuse offline quickDictionary entries (0 tokens!) when translating into English
    const effectiveTarget = (story._meta?.targetLang || targetLang || '').toLowerCase().trim();
    const quickDict = baseLang.toLowerCase().trim() === 'english'
      ? COMMON_VOCAB_TRANSLATIONS[effectiveTarget]
      : undefined;
    if (quickDict) {
      extractedWords.forEach((w) => {
        if (!map.has(w.lower) && quickDict[w.lower]) {
          map.set(w.lower, {
            word: w.word,
            meaning: quickDict[w.lower],
            partOfSpeech: 'other',
            sentenceIndex: w.sentenceIndex,
          });
        }
      });
    }

    return map;
  }, [story, customHighlights, extractedWords, targetLang, baseLang]);

  const savedHighlightSet = useMemo(() => {
    return new Set(customHighlights.map((h) => h.word.toLowerCase().trim()));
  }, [customHighlights]);

  const mergeInStoryOrder = (
    knownMap: Map<string, StoryDictionaryEntry>,
    extraList: StoryDictionaryEntry[]
  ): StoryDictionaryEntry[] => {
    const combined = new Map<string, StoryDictionaryEntry>();
    const combinedNoDiacritics = new Map<string, StoryDictionaryEntry>();

    const indexEntry = (rawKey: string, entry: StoryDictionaryEntry) => {
      const k = normalizeLookupKey(rawKey);
      if (!k || !entry.meaning) return;
      combined.set(k, entry);
      const plain = stripDiacritics(k);
      if (plain && !combinedNoDiacritics.has(plain)) {
        combinedNoDiacritics.set(plain, entry);
      }
    };

    knownMap.forEach((entry, k) => indexEntry(k, entry));
    for (const item of extraList) {
      if (item.word && item.meaning) {
        indexEntry(item.word, item);
      }
    }

    const ordered: StoryDictionaryEntry[] = [];
    const includedKeys = new Set<string>();

    for (const w of extractedWords) {
      const normKey = normalizeLookupKey(w.word);
      let hit = combined.get(normKey);
      if (!hit && normKey.includes("'")) {
        const afterApostrophe = normKey.split("'").pop()?.trim();
        if (afterApostrophe) {
          hit = combined.get(afterApostrophe);
        }
      }
      if (!hit) {
        hit = combinedNoDiacritics.get(stripDiacritics(normKey));
      }
      if (hit) {
        includedKeys.add(normalizeLookupKey(hit.word));
        includedKeys.add(normKey);
        ordered.push({
          ...hit,
          word: w.word, // keep exact story casing
          sentenceIndex: hit.sentenceIndex ?? w.sentenceIndex,
        });
      }
    }

    // Never silently drop valid fetched entries if wording differed slightly from tokenization
    for (const item of extraList) {
      const k = normalizeLookupKey(item.word);
      if (k && item.meaning && !includedKeys.has(k)) {
        includedKeys.add(k);
        ordered.push(item);
      }
    }

    return ordered;
  };

  useEffect(() => {
    if (!isOpen || !story) return;
    setErrorMsg(null);

    // 1. Check persisted cache first (0 extra tokens!)
    const cached =
      getCachedStoryDictionary(storyKey, baseLang) ||
      (story.dictionaries && story.dictionaries[baseLang]) ||
      null;

    if (cached && cached.length > 0) {
      const merged = mergeInStoryOrder(zeroTokenMap, cached);
      setEntries(merged.length > 0 ? merged : cached);
      setIsFromCache(true);
      setIsLoading(false);
      return;
    }

    setIsFromCache(false);

    // 2. Find which unique story words are still missing after 0-token pre-fill
    const missing = extractedWords.filter((w) => {
      const norm = normalizeLookupKey(w.word);
      return !zeroTokenMap.has(w.lower) && !zeroTokenMap.has(norm);
    });

    // Show whatever 0-token entries we already have immediately
    const immediate = mergeInStoryOrder(zeroTokenMap, []);
    if (immediate.length > 0) {
      setEntries(immediate);
    }

    if (missing.length === 0) {
      setEntries(immediate);
      if (immediate.length > 0) {
        saveCachedStoryDictionary(storyKey, baseLang, immediate);
      }
      setIsFromCache(true);
      setIsLoading(false);
      return;
    }

    // 3. Lazy-fetch first batch (up to 100 missing words) in a single compact call
    const firstBatch = missing.slice(0, BATCH_LIMIT);
    let cancelled = false;

    const fetchInitialBatch = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/story-dictionary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sentences: story.sentences.map((s) => ({ target: s.target, en: s.en })),
            words: firstBatch.map((w) => ({ w: w.word, s: w.sentenceIndex })),
            targetLang: story._meta?.targetLang || targetLang,
            baseLang,
          }),
        });

        if (!res.ok) {
          throw new Error('Could not load story dictionary.');
        }

        const data = await res.json();
        if (cancelled) return;

        const fetched: StoryDictionaryEntry[] = Array.isArray(data.entries) ? data.entries : [];
        const merged = mergeInStoryOrder(zeroTokenMap, fetched);
        setEntries(merged);
        if (merged.length > 0) {
          saveCachedStoryDictionary(storyKey, baseLang, merged);
        } else if (firstBatch.length > 0) {
          setErrorMsg('Could not load story dictionary.');
        }
      } catch (err: any) {
        if (!cancelled) {
          setErrorMsg(err?.message || 'Failed to build dictionary.');
          setEntries(mergeInStoryOrder(zeroTokenMap, []));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchInitialBatch();
    return () => {
      cancelled = true;
    };
  }, [isOpen, story, storyKey, baseLang, targetLang, extractedWords.length, retryNonce]);

  const remainingUntranslated = useMemo(() => {
    const resolvedSet = new Set(entries.map((e) => normalizeLookupKey(e.word)));
    return extractedWords.filter((w) => !resolvedSet.has(normalizeLookupKey(w.word)));
  }, [extractedWords, entries]);

  const handleLoadRemaining = async () => {
    if (!story || remainingUntranslated.length === 0 || isLoadingMore) return;
    setIsLoadingMore(true);
    setErrorMsg(null);
    try {
      const nextBatch = remainingUntranslated.slice(0, BATCH_LIMIT);
      const res = await fetch('/api/story-dictionary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sentences: story.sentences.map((s) => ({ target: s.target, en: s.en })),
          words: nextBatch.map((w) => ({ w: w.word, s: w.sentenceIndex })),
          targetLang: story._meta?.targetLang || targetLang,
          baseLang,
        }),
      });
      if (!res.ok) throw new Error('Could not load remaining words.');
      const data = await res.json();
      const fetched: StoryDictionaryEntry[] = Array.isArray(data.entries) ? data.entries : [];

      const existingMap = new Map<string, StoryDictionaryEntry>(zeroTokenMap);
      entries.forEach((e) => existingMap.set(normalizeLookupKey(e.word), e));
      const merged = mergeInStoryOrder(existingMap, fetched);
      setEntries(merged);
      if (merged.length > 0) {
        saveCachedStoryDictionary(storyKey, baseLang, merged);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to load remaining words.');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = entries.filter((entry) => {
      if (posFilter !== 'all' && normalizePosCategory(entry.partOfSpeech) !== posFilter) {
        return false;
      }
      if (!q) return true;
      return (
        entry.word.toLowerCase().includes(q) ||
        (entry.baseForm || '').toLowerCase().includes(q) ||
        entry.meaning.toLowerCase().includes(q)
      );
    });
    if (sortMode === 'az') {
      return [...list].sort((a, b) => a.word.localeCompare(b.word));
    }
    return list;
  }, [entries, posFilter, searchQuery, sortMode]);

  if (!isOpen || !story) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2 sm:p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl h-[85dvh] sm:h-auto sm:max-h-[90dvh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-200 bg-linear-to-r from-emerald-50 to-teal-50 flex items-start justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="w-8 h-8 rounded-xl bg-[#008450] text-white flex items-center justify-center shadow-xs shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 truncate">
                {t.storyDictionaryTitle}
              </h2>
              {entries.length > 0 && (
                <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-white text-[#008450] border border-emerald-200">
                  {t.wordsCountBadge(entries.length)}
                </span>
              )}
              {isFromCache && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  ⚡ {t.cachedOfflineLabel}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 mt-1 truncate">
              {story.title_target} — {t.storyDictionarySubtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 border border-slate-200 transition cursor-pointer shrink-0"
            aria-label={t.close}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search, POS Filter & Sort Controls */}
        <div className="px-4 py-2.5 sm:px-6 border-b border-slate-100 bg-slate-50/70 space-y-2 shrink-0">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                id="story_dictionary_filter"
                name="story_dictionary_filter"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchDictionaryPlaceholder}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                data-lpignore="true"
                data-1p-ignore="true"
                data-bwignore="true"
                data-form-type="other"
                className="w-full pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008450]/30 focus:border-[#008450]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setSortMode((prev) => (prev === 'story' ? 'az' : 'story'))}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition cursor-pointer shrink-0"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-[#008450]" />
              <span>{sortMode === 'story' ? t.sortStoryOrder : t.sortAZ}</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {(
              [
                { id: 'all', label: t.allPartsOfSpeech },
                { id: 'noun', label: t.posNoun },
                { id: 'verb', label: t.posVerb },
                { id: 'adj', label: t.posAdj },
                { id: 'other', label: t.posOther },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setPosFilter(tab.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition cursor-pointer border ${
                  posFilter === tab.id
                    ? 'bg-[#008450] text-white border-[#008450] shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dictionary List Body */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain touch-pan-y scroll-touch p-3 sm:p-5 space-y-2">
          {isLoading && entries.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
              <Loader2 className="w-7 h-7 text-[#008450] animate-spin" />
              <div className="text-sm font-bold text-slate-700">{t.loadingDictionary}</div>
              <div className="text-xs text-slate-500 max-w-xs">
                {extractedWords.length} {t.storyDictionary.toLowerCase()}
              </div>
            </div>
          ) : errorMsg && entries.length === 0 ? (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 text-center space-y-2">
              <p>{errorMsg}</p>
              <button
                type="button"
                onClick={() => setRetryNonce((n) => n + 1)}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer"
              >
                {t.tryAgain}
              </button>
            </div>
          ) : entries.length === 0 ? (
            <div className="py-10 text-center space-y-3">
              <p className="text-xs text-slate-600">{t.loadingDictionary}</p>
              <button
                type="button"
                onClick={() => setRetryNonce((n) => n + 1)}
                className="px-3.5 py-1.5 rounded-xl bg-[#008450] hover:bg-[#006b40] text-white font-bold text-xs transition cursor-pointer"
              >
                {t.tryAgain}
              </button>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="py-10 text-center space-y-3">
              <p className="text-xs text-slate-500">{t.noDictionaryMatches}</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setPosFilter('all');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#008450] border border-emerald-200 font-bold text-xs transition cursor-pointer"
              >
                {t.allPartsOfSpeech} ({entries.length})
              </button>
            </div>
          ) : (
            <>
              {isLoading && (
                <div className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-800">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#008450]" />
                  <span>{t.loadingDictionary}</span>
                </div>
              )}
              {!isLoading && errorMsg && (
                <div className="flex items-center justify-between gap-2 py-1.5 px-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
                  <span>{errorMsg}</span>
                  <button
                    type="button"
                    onClick={() => setRetryNonce((n) => n + 1)}
                    className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] transition cursor-pointer shrink-0"
                  >
                    {t.tryAgain}
                  </button>
                </div>
              )}
              {filteredEntries.map((entry) => {
                const rowKey = `${entry.word.toLowerCase()}_${entry.sentenceIndex}`;
                const isExpanded = expandedWordKey === rowKey;
                const isSaved = savedHighlightSet.has(entry.word.toLowerCase().trim());
                const contextSentence = story.sentences[entry.sentenceIndex];

                return (
                  <div
                    key={rowKey}
                    className="rounded-xl border border-slate-200 bg-white hover:border-emerald-300 transition shadow-2xs overflow-hidden"
                  >
                    <div className="p-2.5 sm:p-3 flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span
                            dir={targetIsRtl ? 'rtl' : 'ltr'}
                            className="text-sm sm:text-base font-extrabold text-slate-900"
                          >
                            {entry.word}
                          </span>
                          {entry.baseForm && (
                            <span
                              dir={targetIsRtl ? 'rtl' : 'ltr'}
                              className="text-[11px] font-medium text-slate-500"
                            >
                              ({t.baseFormLabel} {entry.baseForm})
                            </span>
                          )}
                          {entry.partOfSpeech && (
                            <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                              {entry.partOfSpeech}
                            </span>
                          )}
                        </div>
                        <div
                          dir={baseIsRtl ? 'rtl' : 'ltr'}
                          className="text-xs sm:text-sm font-semibold text-[#008450] mt-0.5"
                        >
                          {entry.meaning}
                        </div>
                      </div>

                      {/* Row Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        {contextSentence && (
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedWordKey((prev) => (prev === rowKey ? null : rowKey))
                            }
                            className="inline-flex items-center gap-0.5 px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold transition cursor-pointer"
                            title={t.sentenceRef(entry.sentenceIndex + 1)}
                          >
                            <span>S{entry.sentenceIndex + 1}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onSpeak(entry.word)}
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#008450] border border-emerald-200 transition cursor-pointer"
                          title={t.wordAudioTooltip}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        {onSaveToFlashcards && (
                          <button
                            type="button"
                            onClick={() => onSaveToFlashcards(entry)}
                            className={`p-1.5 rounded-lg border transition cursor-pointer ${
                              isSaved
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : 'bg-slate-50 hover:bg-amber-50 text-slate-500 hover:text-amber-700 border-slate-200'
                            }`}
                            title={isSaved ? t.addedToFlashcards : t.addToFlashcards}
                          >
                            {isSaved ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <Bookmark className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {isExpanded && contextSentence && (
                      <div className="px-3 py-2 bg-emerald-50/50 border-t border-emerald-100 text-xs space-y-1">
                        <div
                          dir={targetIsRtl ? 'rtl' : 'ltr'}
                          className="font-medium text-slate-800"
                        >
                          {contextSentence.target}
                        </div>
                        <div
                          dir={baseIsRtl ? 'rtl' : 'ltr'}
                          className="text-slate-600 italic text-[11px]"
                        >
                          {contextSentence.en}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Lazy load button for extra-long Max (~40 sentence) stories */}
              {remainingUntranslated.length > 0 && (
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={handleLoadRemaining}
                    disabled={isLoadingMore}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#008450] font-bold text-xs border border-emerald-200 transition cursor-pointer disabled:opacity-50"
                  >
                    {isLoadingMore ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    <span>{t.loadMoreWordsBtn(remainingUntranslated.length)}</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 sm:px-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-2 shrink-0">
          <span className="text-[11px] text-slate-500">
            {targetLang} → {baseLang}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
