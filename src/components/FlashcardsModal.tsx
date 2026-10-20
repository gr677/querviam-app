import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Volume2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Check,
  Eye,
  Shuffle,
  BookOpen,
  Layers,
  ArrowRightLeft,
  Globe,
  Sparkles,
  Clock,
  Flame,
} from 'lucide-react';
import { StoryData, VerbItem, CustomHighlight, SRSCardData } from '../types';
import { getSRSCards, rateSRSCard, updateLearnerActivity } from '../utils/storage';

interface FlashcardItem {
  id: string;
  targetWord: string; // Target language word / infinitive
  baseTranslation: string; // Base language translation (e.g. English)
  contextSentenceTarget?: string;
  contextSentenceEn?: string;
  conjugations?: VerbItem['conjugations'];
  isVerb: boolean;
  isCustomHighlight?: boolean;
  color?: string;
  note?: string;
  partOfSpeech?: string;
}

interface FlashcardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: StoryData | null;
  targetLang: string;
  baseLang?: string;
  customHighlights?: CustomHighlight[];
  onSpeak: (text: string, rate?: number) => void;
}

// Built-in dictionary of high-frequency story words across languages to ensure rich vocabulary word cards
const KNOWN_VOCABULARY: Record<string, string> = {
  // Italian words
  'passeggiata': 'walk / stroll',
  'lago': 'lake',
  'specchio': 'mirror',
  'acqua': 'water',
  'colline': 'hills',
  'collina': 'hill',
  'mattina': 'morning',
  'mattinata': 'morning time',
  'persone': 'people',
  'sentiero': 'path / trail',
  'tranquillità': 'tranquility / peace',
  'natura': 'nature',
  'autunno': 'autumn',
  'riflessi': 'reflections',
  'alberi': 'trees',
  'atmosfera': 'atmosphere',
  'panchina': 'bench',
  'legno': 'wood',
  'anatre': 'ducks',
  'aria': 'air',
  'montagna': 'mountain',
  'mente': 'mind',
  'giornata': 'day',
  'vita': 'life',
  'luogo': 'place',
  'caffè': 'coffee',
  'banco': 'bar counter',
  'cornetto': 'croissant',
  'crema': 'cream',
  'barista': 'barista / bartender',
  'colazione': 'breakfast',
  'quartiere': 'neighborhood',
  'profumo': 'aroma / scent',
  'dolci': 'pastries / sweets',
  'biblioteca': 'library',
  'idea': 'idea',
  'ragione': 'reason',
  'sole': 'sun',
  'città': 'city',
  'strada': 'street',
  'amico': 'friend',
  'tempo': 'weather / time',
  'notte': 'night',
  'fiume': 'river',
  'mare': 'sea',
  'viaggio': 'trip / journey',

  // Spanish words
  'mercado': 'market',
  'joya': 'jewel / gem',
  'luz': 'light',
  'productos': 'produce / goods',
  'frescos': 'fresh',
  'agricultores': 'farmers',
  'naranjas': 'oranges',
  'verduras': 'vegetables',
  'amanecer': 'dawn / sunrise',
  'gente': 'people',
  'ingredientes': 'ingredients',
  'almuerzo': 'lunch',
  'olor': 'smell / scent',
  'especias': 'spices',
  'pan': 'bread',
  'apetito': 'appetite',
  'pasillos': 'aisles / corridors',
  'esencia': 'essence',
  'cultura': 'culture',
  'ciudad': 'city',
  'mañana': 'morning',
  'tarde': 'afternoon / late',
  'noche': 'night',
  'café': 'coffee',

  // Norwegian words
  'solen': 'the sun',
  'lys': 'light',
  'operahuset': 'the opera house',
  'mennesker': 'people',
  'havnefronten': 'the waterfront',
  'kopp': 'cup',
  'kaffe': 'coffee',
  'hånden': 'the hand',
  'luften': 'the air',
  'måkene': 'the seagulls',
  'vannet': 'the water',
  'båtene': 'the boats',
  'seilas': 'voyage / sailing',
  'morgen': 'morning',
  'byen': 'the city',
  'energi': 'energy',
  'uken': 'the week',
  'sentrum': 'city center',
};

const BASE_LANGUAGES = [
  { name: 'English', flag: '🇬🇧' },
  { name: 'Norwegian', flag: '🇳🇴' },
  { name: 'Spanish', flag: '🇪🇸' },
  { name: 'French', flag: '🇫🇷' },
  { name: 'German', flag: '🇩🇪' },
  { name: 'Italian', flag: '🇮🇹' },
  { name: 'Portuguese', flag: '🇵🇹' },
  { name: 'Dutch', flag: '🇳🇱' },
  { name: 'Polish', flag: '🇵🇱' },
  { name: 'Swedish', flag: '🇸🇪' },
  { name: 'Russian', flag: '🇷🇺' },
  { name: 'Japanese', flag: '🇯🇵' },
  { name: 'Chinese (Mandarin)', flag: '🇨🇳' },
  { name: 'Chinese (Simplified)', flag: '🇨🇳' },
  { name: 'Hungarian', flag: '🇭🇺' },
  { name: 'Arabic', flag: '🇸🇦' },
  { name: 'Hindi', flag: '🇮🇳' },
  { name: 'Turkish', flag: '🇹🇷' },
  { name: 'Korean', flag: '🇰🇷' },
  { name: 'Greek', flag: '🇬🇷' },
  { name: 'Hebrew', flag: '🇮🇱' },
  { name: 'Vietnamese', flag: '🇻🇳' },
];

export const FlashcardsModal: React.FC<FlashcardsModalProps> = ({
  isOpen,
  onClose,
  story,
  targetLang,
  baseLang: initialBaseLang = 'English',
  customHighlights = [],
  onSpeak,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'words' | 'verbs' | 'highlights' | 'due' | 'learned'>('all');
  const [studyDirection, setStudyDirection] = useState<'target-to-base' | 'base-to-target'>('target-to-base');
  const [baseLang, setBaseLang] = useState<string>(initialBaseLang);
  const [isSlowSpeech, setIsSlowSpeech] = useState(false);
  const [knownCardIds, setKnownCardIds] = useState<Set<string>>(new Set());
  const [srsMap, setSrsMap] = useState<Record<string, SRSCardData>>({});

  useEffect(() => {
    if (isOpen) {
      const storedSrs = getSRSCards();
      setSrsMap(storedSrs);
      // Auto-populate mastered cards from SRS
      const mastered = new Set<string>();
      Object.values(storedSrs).forEach((item) => {
        if (item.status === 'mastered') mastered.add(item.id);
      });
      setKnownCardIds((prev) => new Set([...prev, ...mastered]));
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialBaseLang) {
      setBaseLang(initialBaseLang);
    }
  }, [initialBaseLang]);

  // Extract both Verb Cards and Vocabulary Word Cards from the current story
  const cards: FlashcardItem[] = useMemo(() => {
    if (!story || !story.sentences) return [];

    const items: FlashcardItem[] = [];
    const seenWords = new Set<string>();

    // 0. Include custom highlighted words
    if (customHighlights && customHighlights.length > 0) {
      customHighlights.forEach((hl) => {
        const key = hl.word.toLowerCase();
        seenWords.add(key);
        const sentence = story.sentences[hl.sentenceIndex];
        items.unshift({
          id: hl.id,
          targetWord: hl.word,
          baseTranslation: hl.translation || sentence?.en || 'Custom Highlight',
          contextSentenceTarget: sentence?.target,
          contextSentenceEn: sentence?.en,
          isVerb: false,
          isCustomHighlight: true,
          color: hl.color,
          note: hl.note,
          partOfSpeech: 'Custom Highlight',
        });
      });
    }

    // 1. Extract Tagged Verbs
    story.sentences.forEach((sentence, sIdx) => {
      if (sentence.verbs && sentence.verbs.length > 0) {
        sentence.verbs.forEach((v) => {
          const key = v.infinitive.toLowerCase().trim();
          if (!seenWords.has(key) && key.length > 0) {
            seenWords.add(key);
            items.push({
              id: `verb-${key}-${sIdx}`,
              targetWord: v.infinitive,
              baseTranslation: v.translation || '',
              contextSentenceTarget: sentence.target,
              contextSentenceEn: sentence.en,
              conjugations: v.conjugations,
              isVerb: true,
              partOfSpeech: 'Verb',
            });
          }
        });
      }
    });

    // 2. Extract Key Vocabulary Words (nouns, adjectives, core story terms)
    story.sentences.forEach((sentence, sIdx) => {
      // Clean tokens
      const rawTokens = sentence.target.split(/\s+/).map((w) =>
        w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'«»]/g, '').trim()
      );

      rawTokens.forEach((token) => {
        const lower = token.toLowerCase();
        // Skip short particles, articles, and already captured verbs
        if (lower.length <= 2 || seenWords.has(lower)) return;

        // Check if we have a known vocabulary translation
        if (KNOWN_VOCABULARY[lower]) {
          seenWords.add(lower);
          items.push({
            id: `word-${lower}-${sIdx}`,
            targetWord: token,
            baseTranslation: KNOWN_VOCABULARY[lower],
            contextSentenceTarget: sentence.target,
            contextSentenceEn: sentence.en,
            isVerb: false,
            partOfSpeech: 'Noun / Vocabulary',
          });
        }
      });
    });

    // 3. Fallback: If story had few vocabulary matches, harvest meaningful sentence keywords
    if (items.filter((i) => !i.isVerb).length < 3) {
      story.sentences.forEach((sentence, sIdx) => {
        const words = sentence.target
          .split(/\s+/)
          .map((w) => w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'«»]/g, '').trim())
          .filter((w) => w.length > 3 && !seenWords.has(w.toLowerCase()));

        if (words.length > 0) {
          const chosen = words[0];
          const lower = chosen.toLowerCase();
          seenWords.add(lower);

          // Find approximate phrase in English translation
          items.push({
            id: `word-${lower}-${sIdx}`,
            targetWord: chosen,
            baseTranslation: sentence.en.split(/\s+/).slice(0, 3).join(' ') + '...',
            contextSentenceTarget: sentence.target,
            contextSentenceEn: sentence.en,
            isVerb: false,
            partOfSpeech: 'Story Vocabulary',
          });
        }
      });
    }

    return items;
  }, [story]);

  // Filtered cards based on active tab
  const now = Date.now();
  const dueCardsCount = useMemo(() => {
    return cards.filter((c) => {
      const srs = srsMap[c.id];
      if (!srs) return true; // new card is due
      return srs.nextReviewDate <= now;
    }).length;
  }, [cards, srsMap, now]);

  const filteredCards = useMemo(() => {
    if (filterMode === 'words') return cards.filter((c) => !c.isVerb && !c.isCustomHighlight);
    if (filterMode === 'verbs') return cards.filter((c) => c.isVerb);
    if (filterMode === 'highlights') return cards.filter((c) => c.isCustomHighlight);
    if (filterMode === 'due') {
      return cards.filter((c) => {
        const srs = srsMap[c.id];
        return !srs || srs.nextReviewDate <= now;
      });
    }
    if (filterMode === 'learned') return cards.filter((c) => knownCardIds.has(c.id));
    return cards;
  }, [cards, filterMode, knownCardIds, srsMap, now]);

  // Active card
  const activeCard = filteredCards[currentIndex] || null;

  const handleRateCard = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (!activeCard) return;
    const updated = rateSRSCard(activeCard.id, rating);
    setSrsMap((prev) => ({ ...prev, [activeCard.id]: updated }));

    if (rating === 'easy' || updated.intervalDays >= 7) {
      setKnownCardIds((prev) => new Set(prev).add(activeCard.id));
      updateLearnerActivity({ knownWordsCount: knownCardIds.size + 1 });
    }

    handleNext();
  };

  // Keyboard navigation inside modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCards.length, currentIndex]);

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(filteredCards.length - 1);
    }
  };

  const toggleKnown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setKnownCardIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    if (filteredCards.length > 1) {
      const randomIdx = Math.floor(Math.random() * filteredCards.length);
      setCurrentIndex(randomIdx);
    }
  };

  const speakActive = (text: string) => {
    const rate = isSlowSpeech ? 0.65 : 0.85;
    onSpeak(text, rate);
  };

  if (!isOpen) return null;

  // Compute card front and back based on study direction
  const isTargetOnFront = studyDirection === 'target-to-base';
  const frontContent = activeCard ? (isTargetOnFront ? activeCard.targetWord : activeCard.baseTranslation) : '';
  const backContent = activeCard ? (isTargetOnFront ? activeCard.baseTranslation : activeCard.targetWord) : '';
  const frontLanguageLabel = isTargetOnFront ? targetLang : baseLang;
  const backLanguageLabel = isTargetOnFront ? baseLang : targetLang;

  const wordCardsCount = cards.filter((c) => !c.isVerb).length;
  const verbCardsCount = cards.filter((c) => c.isVerb).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#fbfcfd]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#008450] flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Flashcards & Vocabulary
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {targetLang}
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium truncate max-w-[260px] sm:max-w-xs">
                {story?.title_target || 'Story Cards'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options Ribbon: Word vs Verb Tabs + Base Language & Direction */}
        <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/70 space-y-2.5">
          {/* Top row: Word vs Verb category tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setFilterMode('all');
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-white text-[#008450] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({cards.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilterMode('words');
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  filterMode === 'words'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Vocabulary Word Cards (Nouns, adjectives, expressions)"
              >
                🔤 Words ({wordCardsCount})
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilterMode('verbs');
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  filterMode === 'verbs'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Verb Cards with Conjugations"
              >
                ⚡ Verbs ({verbCardsCount})
              </button>
              {customHighlights && customHighlights.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setFilterMode('highlights');
                    setCurrentIndex(0);
                    setIsFlipped(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    filterMode === 'highlights'
                      ? 'bg-white text-rose-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="My Custom Highlighted Words"
                >
                  🖍️ Highlights ({customHighlights.length})
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setFilterMode('due');
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  filterMode === 'due'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Cards scheduled for SRS review today"
              >
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Due Today</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  dueCardsCount > 0 ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  {dueCardsCount}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilterMode('learned');
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  filterMode === 'learned'
                    ? 'bg-white text-amber-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Mastered Cards"
              >
                ⭐ Mastered ({knownCardIds.size})
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShuffle}
                className="p-1.5 text-slate-500 hover:text-[#008450] hover:bg-white rounded-lg transition border border-transparent hover:border-slate-200 cursor-pointer shadow-2xs"
                title="Shuffle cards"
              >
                <Shuffle className="w-4 h-4" />
              </button>
              {filteredCards.length > 0 && (
                <span className="font-mono text-slate-500 font-bold">
                  {currentIndex + 1} / {filteredCards.length}
                </span>
              )}
            </div>
          </div>

          {/* Bottom row: Study Direction (Target ➔ Meaning vs Meaning ➔ Target) & Turtle Audio mode */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs border-t border-slate-200/50">
            {/* Direction switcher */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Direction:
              </span>
              <button
                type="button"
                onClick={() => {
                  setStudyDirection((prev) =>
                    prev === 'target-to-base' ? 'base-to-target' : 'target-to-base'
                  );
                  setIsFlipped(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-800 hover:text-[#008450] border border-slate-200 rounded-lg font-semibold transition cursor-pointer shadow-2xs"
                title="Toggle Prompt side: Target Language vs Meaning"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-[#008450]" />
                <span>
                  {studyDirection === 'target-to-base'
                    ? `${targetLang} ➔ Meaning`
                    : `Meaning ➔ ${targetLang}`}
                </span>
              </button>
            </div>

            {/* Turtle Audio Toggle */}
            <button
              type="button"
              onClick={() => setIsSlowSpeech(!isSlowSpeech)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold transition cursor-pointer ${
                isSlowSpeech
                  ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-2xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200'
              }`}
              title="Toggle slow pronunciation speed (Turtle mode)"
            >
              <span>🐢</span>
              <span>{isSlowSpeech ? 'Slow Audio (Turtle)' : 'Normal Audio'}</span>
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 flex-1 overflow-y-auto flex flex-col items-center justify-center min-h-[340px]">
          {filteredCards.length === 0 ? (
            <div className="text-center py-10 px-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center mb-3">
                <BookOpen className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">
                {filterMode === 'learned'
                  ? 'No Mastered Cards Yet'
                  : filterMode === 'words'
                  ? 'No Word Cards Found'
                  : 'No Verb Cards Found'}
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {filterMode === 'learned'
                  ? 'Tap the green checkmark on cards you know well to bookmark them here!'
                  : 'Try selecting the "All" tab to view all extracted cards for this story.'}
              </p>
            </div>
          ) : activeCard ? (
            <div className="w-full flex flex-col items-center">
              {/* Interactive Flip Card */}
              <div
                onClick={() => setIsFlipped((prev) => !prev)}
                className={`w-full max-w-sm min-h-[230px] rounded-3xl p-6 border-2 transition-all duration-300 shadow-md flex flex-col justify-between cursor-pointer select-none relative group ${
                  isFlipped
                    ? 'bg-gradient-to-br from-emerald-50/90 to-teal-50 border-emerald-300'
                    : 'bg-gradient-to-br from-white to-slate-50/80 border-slate-200 hover:border-emerald-300 hover:shadow-lg'
                }`}
              >
                {/* Top card bar: status tag & actions */}
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        activeCard.isCustomHighlight
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : activeCard.isVerb
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                      }`}
                    >
                      {activeCard.isCustomHighlight
                        ? '🖍️ Highlight Card'
                        : activeCard.isVerb
                        ? '⚡ Verb Card'
                        : '🔤 Word Card'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Speak Button (always pronounces the Target Language word) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakActive(activeCard.targetWord);
                      }}
                      className="p-1.5 rounded-full text-slate-500 hover:text-[#008450] hover:bg-white shadow-2xs transition cursor-pointer"
                      title={`Pronounce in ${targetLang} ${isSlowSpeech ? '(Slow)' : ''}`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    {/* Mastered/Known Toggle */}
                    <button
                      type="button"
                      onClick={(e) => toggleKnown(activeCard.id, e)}
                      className={`p-1.5 rounded-full transition cursor-pointer ${
                        knownCardIds.has(activeCard.id)
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-300 hover:text-emerald-600 hover:bg-white'
                      }`}
                      title={knownCardIds.has(activeCard.id) ? 'Mark as learning' : 'Mark as mastered'}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Main Word / Translation Prompt */}
                <div className="py-6 text-center">
                  {!isFlipped ? (
                    <div>
                      <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight capitalize mb-2">
                        {frontContent}
                      </h2>
                      <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> Tap card or spacebar to reveal
                      </p>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-2xl font-bold text-emerald-950 mb-1">
                        {backContent}
                      </h2>
                      <p className="text-xs text-emerald-800 font-medium capitalize">
                        {frontContent}
                      </p>
                    </div>
                  )}
                </div>

                {/* Example sentence context */}
                {activeCard.contextSentenceTarget && (
                  <div className="pt-3 border-t border-slate-200/60 text-left">
                    <p className="text-[11px] text-slate-600 italic line-clamp-2">
                      &ldquo;{activeCard.contextSentenceTarget}&rdquo;
                    </p>
                    {isFlipped && activeCard.contextSentenceEn && (
                      <p className="text-[10px] text-emerald-700/80 font-medium line-clamp-2 mt-0.5">
                        &ldquo;{activeCard.contextSentenceEn}&rdquo;
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Quick Conjugations Preview (if verb, flipped, and has conjugations) */}
              {isFlipped && activeCard.isVerb && activeCard.conjugations && Object.keys(activeCard.conjugations).length > 0 && (
                <div className="w-full max-w-sm mt-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1.5 animate-fade-in">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <span>Key Conjugations</span>
                    <span>{Object.keys(activeCard.conjugations)[0]}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[11px]">
                    {(activeCard.conjugations[Object.keys(activeCard.conjugations)[0]] || []).slice(0, 4).map((f, i) => (
                      <div key={i} className="flex justify-between bg-white px-2 py-1 rounded border border-slate-200/70">
                        <span className="text-slate-400">{f.person}</span>
                        <span className="font-semibold text-slate-800">{f.form}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Spaced Repetition (SRS) Recall Rating Bar */}
        {isFlipped && activeCard && (
          <div className="px-5 py-3 bg-linear-to-r from-slate-50 via-emerald-50/40 to-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 animate-fade-in shrink-0">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>SRS Memory Recall:</span>
            </span>

            <div className="flex items-center gap-1.5 flex-1 max-w-md justify-end">
              <button
                type="button"
                onClick={() => handleRateCard('again')}
                className="flex-1 py-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-300 font-bold text-xs rounded-xl transition cursor-pointer shadow-2xs text-center active:scale-95"
                title="Forgot. Review again in ~10 minutes"
              >
                🔴 Again <span className="text-[10px] font-normal opacity-75 hidden sm:inline">(10m)</span>
              </button>
              <button
                type="button"
                onClick={() => handleRateCard('hard')}
                className="flex-1 py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs rounded-xl transition cursor-pointer shadow-2xs text-center active:scale-95"
                title="Difficult recall. Review tomorrow"
              >
                🟠 Hard <span className="text-[10px] font-normal opacity-75 hidden sm:inline">(1d)</span>
              </button>
              <button
                type="button"
                onClick={() => handleRateCard('good')}
                className="flex-1 py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 font-bold text-xs rounded-xl transition cursor-pointer shadow-2xs text-center active:scale-95"
                title="Good recall. Review in 3 days"
              >
                🔵 Good <span className="text-[10px] font-normal opacity-75 hidden sm:inline">(3d)</span>
              </button>
              <button
                type="button"
                onClick={() => handleRateCard('easy')}
                className="flex-1 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold text-xs rounded-xl transition cursor-pointer shadow-2xs text-center active:scale-95"
                title="Instant recall. Mastered for 1 week"
              >
                🟢 Easy <span className="text-[10px] font-normal opacity-75 hidden sm:inline">(7d)</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer Navigation Bar */}
        {filteredCards.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 bg-[#fbfcfd] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handlePrev}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFlipped((prev) => !prev)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#008450] font-bold text-xs transition cursor-pointer border border-emerald-200/70"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isFlipped ? 'Show Front' : 'Flip Card'}</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#008450] hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer shadow-xs"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
