import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Sparkles,
  Volume2,
  Copy,
  Check,
  RotateCcw,
  Laugh,
  Share2,
  Printer,
  Search,
  Flame,
  ArrowRight
} from 'lucide-react';

export interface JokeItem {
  id: number;
  joke_target: string;
  joke_base: string;
  category: string;
}

interface JokesEasterEggModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: string;
  targetLang: string;
  baseLang: string;
  onSpeakText: (text: string, lang?: string) => void;
}

export const JokesEasterEggModal: React.FC<JokesEasterEggModalProps> = ({
  isOpen,
  onClose,
  topic,
  targetLang,
  baseLang,
  onSpeakText,
}) => {
  const [currentTopic, setCurrentTopic] = useState(topic);
  const [jokes, setJokes] = useState<JokeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [displayMode, setDisplayMode] = useState<'both' | 'target' | 'base'>('both');
  const [laughCounts, setLaughCounts] = useState<Record<number, number>>({});
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [allCopied, setAllCopied] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [speakingJokeId, setSpeakingJokeId] = useState<number | null>(null);

  // Sync topic when modal opens
  useEffect(() => {
    if (isOpen) {
      const clean = (topic || '').trim().replace(/^give me a topic.*$/i, '').trim() || 'everyday life';
      setCurrentTopic(clean);
      fetchJokes(clean);
    }
  }, [isOpen, topic, targetLang, baseLang]);

  const fetchJokes = async (topicToFetch: string) => {
    setIsLoading(true);
    setSearchFilter('');
    try {
      const res = await fetch('/api/jokes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicToFetch,
          targetLang,
          baseLang,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.jokes) && data.jokes.length > 0) {
          setJokes(data.jokes);
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Failed to fetch jokes from server:', err);
    }

    // Default emergency fallback
    setJokes([
      { id: 1, joke_target: `Perché il caffè con ${topicToFetch} va sempre di fretta? Perché è espresso!`, joke_base: `Why is coffee with ${topicToFetch} always in a rush? Because it's espresso!`, category: 'Pun' },
      { id: 2, joke_target: `Qual è il superpotere di ${topicToFetch}? Far ridere in qualsiasi lingua!`, joke_base: `What is ${topicToFetch}'s superpower? Making people laugh in every language!`, category: 'Clever' },
      { id: 3, joke_target: `Non discutere mai con ${topicToFetch}: ha sempre l'ultima parola nel dizionario!`, joke_base: `Never argue with ${topicToFetch}: it always gets the last word in the dictionary!`, category: 'Wordplay' },
    ]);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  const handleLaugh = (id: number, e: React.MouseEvent) => {
    setLaughCounts((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));

    // Trigger subtle confetti
    try {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      confetti({
        particleCount: 18,
        spread: 45,
        origin: { x, y },
        colors: ['#f59e0b', '#ec4899', '#10b981', '#3b82f6'],
        disableForReducedMotion: true,
      });
    } catch {}
  };

  const handleCopySingle = (joke: JokeItem, index: number) => {
    const textToCopy = `${joke.joke_target}\n(${joke.joke_base})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  const handleCopyAll = () => {
    const fullText = jokes
      .map((j) => `${j.id}. ${j.joke_target}\n   → ${j.joke_base}`)
      .join('\n\n');
    navigator.clipboard.writeText(`🎭 15 One-Liner Jokes about "${currentTopic}" (${targetLang}):\n\n${fullText}\n\nGenerated with Querviam`);
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2000);
  };

  const handleSpeakJoke = (joke: JokeItem) => {
    setSpeakingJokeId(joke.id);
    onSpeakText(joke.joke_target);
    setTimeout(() => setSpeakingJokeId(null), 3500);
  };

  const filteredJokes = jokes.filter(
    (j) =>
      j.joke_target.toLowerCase().includes(searchFilter.toLowerCase()) ||
      j.joke_base.toLowerCase().includes(searchFilter.toLowerCase()) ||
      j.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-[#fffdf7] border-3 border-slate-950 rounded-3xl shadow-[8px_8px_0px_#0f172a] overflow-hidden flex flex-col max-h-[92vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Comic Header Bar */}
        <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 border-b-3 border-slate-950 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border-2 border-slate-950 flex items-center justify-center text-2xl shadow-[2px_2px_0px_#0f172a]">
              🎭
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-slate-950 text-amber-300 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider">
                  🐣 Easter Egg Unlocked
                </span>
                <span className="text-xs font-black text-slate-900 uppercase">
                  15 Topic One-Liners
                </span>
              </div>
              <h3 className="font-black text-base sm:text-lg text-slate-950 leading-tight flex items-center gap-1.5 mt-0.5">
                <span>Laugh & Learn:</span>
                <span className="underline decoration-amber-600 underline-offset-2">&ldquo;{currentTopic}&rdquo;</span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white border-2 border-slate-950 text-slate-950 hover:bg-slate-100 transition cursor-pointer shadow-[2px_2px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              title="Close Easter Egg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Topic Bar & Action Controls */}
        <div className="border-b-2 border-slate-950 bg-[#fff5db] p-3 sm:px-5 flex flex-wrap items-center justify-between gap-2.5">
          {/* Quick Topic Change Input */}
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <span className="text-xs font-black uppercase text-amber-950 shrink-0">Topic:</span>
            <div className="relative flex-1">
              <input
                type="text"
                value={currentTopic}
                onChange={(e) => setCurrentTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && currentTopic.trim() && fetchJokes(currentTopic.trim())}
                placeholder="Type another joke topic..."
                className="w-full pl-3 pr-20 py-1.5 bg-white border-2 border-slate-950 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-[2px_2px_0px_#0f172a]"
              />
              <button
                type="button"
                onClick={() => currentTopic.trim() && fetchJokes(currentTopic.trim())}
                disabled={isLoading}
                className="absolute right-1 top-1 bottom-1 px-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 border border-slate-950 rounded-lg text-[10px] font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
              >
                <span>Go</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Controls: Display Filter & Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Bilingual Display Mode */}
            <div className="flex bg-white p-0.5 rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_#0f172a]">
              <button
                type="button"
                onClick={() => setDisplayMode('both')}
                className={`px-2 py-1 rounded-lg text-[11px] font-black transition cursor-pointer ${
                  displayMode === 'both' ? 'bg-amber-400 text-slate-950' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                Both
              </button>
              <button
                type="button"
                onClick={() => setDisplayMode('target')}
                className={`px-2 py-1 rounded-lg text-[11px] font-black transition cursor-pointer ${
                  displayMode === 'target' ? 'bg-amber-400 text-slate-950' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {targetLang}
              </button>
              <button
                type="button"
                onClick={() => setDisplayMode('base')}
                className={`px-2 py-1 rounded-lg text-[11px] font-black transition cursor-pointer ${
                  displayMode === 'base' ? 'bg-amber-400 text-slate-950' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {baseLang}
              </button>
            </div>

            {/* Copy All Button */}
            <button
              type="button"
              onClick={handleCopyAll}
              disabled={isLoading || jokes.length === 0}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border-2 border-slate-950 rounded-xl text-xs font-black text-slate-950 shadow-[2px_2px_0px_#0f172a] transition cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center gap-1.5"
              title="Copy all 15 jokes to clipboard"
            >
              {allCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{allCopied ? 'Copied All!' : 'Copy All'}</span>
            </button>

            {/* Regenerate Button */}
            <button
              type="button"
              onClick={() => fetchJokes(currentTopic)}
              disabled={isLoading}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 border-2 border-slate-950 rounded-xl text-xs font-black text-slate-950 shadow-[2px_2px_0px_#0f172a] transition cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center gap-1.5"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Writing Jokes...' : 'Tell 15 More!'}</span>
            </button>
          </div>
        </div>

        {/* Search Filter inside Jokes list */}
        {jokes.length > 5 && !isLoading && (
          <div className="px-5 pt-3 pb-1 bg-[#fffdf7]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter jokes by keyword..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>
        )}

        {/* Jokes List Container */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1 bg-[#fffdf7]">
          {isLoading ? (
            <div className="py-20 text-center space-y-4">
              <div className="text-4xl animate-bounce">🃏</div>
              <div className="space-y-1">
                <h4 className="font-black text-base text-slate-950">
                  Cooking up 15 hilarious one-liners about &ldquo;{currentTopic}&rdquo;...
                </h4>
                <p className="text-xs text-slate-600 font-medium">
                  Crafting authentic puns and witty punchlines in {targetLang} with translations!
                </p>
              </div>
            </div>
          ) : filteredJokes.length === 0 ? (
            <div className="text-center py-16 space-y-3 text-slate-500">
              <div className="text-3xl">🤔</div>
              <p className="text-xs font-bold">No jokes matched your filter keyword.</p>
              <button
                type="button"
                onClick={() => setSearchFilter('')}
                className="text-xs font-black text-amber-900 underline"
              >
                Clear filter
              </button>
            </div>
          ) : (
            filteredJokes.map((joke, index) => {
              const laughCount = laughCounts[joke.id] || 0;
              const isSpeaking = speakingJokeId === joke.id;

              return (
                <div
                  key={joke.id}
                  className="p-4 rounded-2xl bg-white border-2 border-slate-950 shadow-[3px_3px_0px_#0f172a] hover:shadow-[5px_5px_0px_#0f172a] transition duration-150 flex flex-col gap-2 relative group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-amber-400 border border-slate-950 font-black text-xs text-slate-950 flex items-center justify-center shadow-[1px_1px_0px_#0f172a]">
                        {joke.id}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {joke.category || 'One-Liner'}
                      </span>
                    </div>

                    {/* Actions: Audio, Laugh, Copy */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleSpeakJoke(joke)}
                        className={`p-1.5 rounded-lg border border-slate-950 transition cursor-pointer text-xs font-bold flex items-center gap-1 ${
                          isSpeaking
                            ? 'bg-rose-500 text-white animate-pulse'
                            : 'bg-white hover:bg-amber-100 text-slate-800 shadow-[1px_1px_0px_#0f172a]'
                        }`}
                        title="Listen to this joke in target language"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span className="text-[10px] hidden sm:inline">Listen</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleLaugh(joke.id, e)}
                        className={`p-1.5 rounded-lg border border-slate-950 transition cursor-pointer text-xs font-black flex items-center gap-1 ${
                          laughCount > 0
                            ? 'bg-amber-400 text-slate-950 shadow-[1px_1px_0px_#0f172a]'
                            : 'bg-white hover:bg-yellow-50 text-slate-700 shadow-[1px_1px_0px_#0f172a]'
                        }`}
                        title="Give a laugh reaction!"
                      >
                        <Laugh className="w-3.5 h-3.5 text-amber-700" />
                        <span className="text-[10px]">{laughCount > 0 ? `${laughCount} 😂` : 'Haha'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopySingle(joke, index)}
                        className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-950 transition cursor-pointer text-slate-700 shadow-[1px_1px_0px_#0f172a]"
                        title="Copy joke"
                      >
                        {copiedIndex === index ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Joke Text in Target Language */}
                  {(displayMode === 'both' || displayMode === 'target') && (
                    <div className="text-sm sm:text-base font-extrabold text-slate-950 leading-snug pl-1">
                      {joke.joke_target}
                    </div>
                  )}

                  {/* Joke Translation in Base Language */}
                  {(displayMode === 'both' || displayMode === 'base') && (
                    <div className={`text-xs text-slate-600 font-medium pl-1 leading-relaxed ${
                      displayMode === 'both' ? 'border-t border-slate-100 pt-1.5 mt-0.5' : 'text-sm font-bold text-slate-900'
                    }`}>
                      {displayMode === 'both' && <span className="font-bold text-slate-400 mr-1.5">🇬🇧</span>}
                      {joke.joke_base}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="border-t-2 border-slate-950 p-3.5 bg-[#fff9e6] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-amber-950 font-bold">
            <span>💡</span>
            <span>How to trigger anytime: Click the 🎭 icon next to Story Topic, or type &ldquo;jokes&rdquo; as your topic!</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="py-1.5 px-4 rounded-xl border-2 border-slate-950 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black transition cursor-pointer shadow-[2px_2px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            Back to Stories
          </button>
        </div>
      </div>
    </div>
  );
};
