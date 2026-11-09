import React, { useState, useEffect } from 'react';
import { X, Volume2, BookOpen, Lightbulb, Sparkles, Loader2, Copy, Check } from 'lucide-react';
import { StoryData, GrammarBite } from '../types';

interface GrammarBitesModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: StoryData | null;
  targetLang: string;
  baseLang?: string;
  tense: string;
  difficulty: string;
  onSpeak: (text: string) => void;
}

export const GrammarBitesModal: React.FC<GrammarBitesModalProps> = ({
  isOpen,
  onClose,
  story,
  targetLang,
  baseLang = 'English',
  tense,
  difficulty,
  onSpeak,
}) => {
  const [bites, setBites] = useState<GrammarBite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !story) return;

    if (story.grammarBites && story.grammarBites.length > 0) {
      setBites(story.grammarBites);
      return;
    }

    const fetchBites = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/generate-grammar-bites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ story, targetLang, baseLang, tense, difficulty }),
        });
        const data = await res.json();
        if (data && data.grammarBites && data.grammarBites.length > 0) {
          setBites(data.grammarBites);
          story.grammarBites = data.grammarBites;
        }
      } catch (e) {
        console.error('Failed to load grammar bites:', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBites();
  }, [isOpen, story, targetLang, tense, difficulty]);

  const handleCopy = (bite: GrammarBite) => {
    const text = `${bite.title}\n\nRule: ${bite.rule}\n\nExamples:\n${bite.examples.map(e => `• ${e.target} (${e.en})`).join('\n')}\n\nTip: ${bite.tip || ''}`;
    navigator.clipboard.writeText(text);
    setCopiedId(bite.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen || !story) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#fbfcfd]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Grammar Focus Deep-Dive
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  {targetLang}
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium truncate max-w-xs">
                Key patterns and rules found in &ldquo;{story.title_target}&rdquo;
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

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-amber-600 animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-700">
                Analyzing sentence structures and grammar patterns...
              </p>
              <p className="text-xs text-slate-400">
                Extracting high-yield grammar rules tailored for {targetLang}
              </p>
            </div>
          ) : bites.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-sm">No grammar notes available for this story.</p>
            </div>
          ) : (
            bites.map((bite, idx) => (
              <div
                key={bite.id || idx}
                className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-amber-300 transition-all shadow-xs space-y-3"
              >
                {/* Bite Title & Copy */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-sm sm:text-base text-slate-900">
                      {bite.title}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(bite)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 transition cursor-pointer"
                    title="Copy rule note"
                  >
                    {copiedId === bite.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Rule explanation */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  {bite.rule}
                </p>

                {/* Direct Examples from Story */}
                {bite.examples && bite.examples.length > 0 && (
                  <div className="p-3 bg-white rounded-xl border border-slate-200/70 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      In this story:
                    </span>
                    {bite.examples.map((ex, exIdx) => (
                      <div key={exIdx} className="flex items-start justify-between gap-2 text-xs">
                        <div className="min-w-0">
                          <p className="font-semibold text-amber-950 font-serif text-sm">
                            &ldquo;{ex.target}&rdquo;
                          </p>
                          <p className="text-slate-500 text-[11px] mt-0.5">
                            &ldquo;{ex.en}&rdquo;
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onSpeak(ex.target)}
                          className="p-1 text-slate-400 hover:text-amber-700 hover:bg-amber-50 rounded transition cursor-pointer shrink-0 mt-0.5"
                          title="Listen"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pro Tip */}
                {bite.tip && (
                  <div className="flex items-start gap-2 p-2.5 bg-amber-50 rounded-xl border border-amber-200/60 text-xs text-amber-900">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] leading-snug">
                      <span className="font-bold">Pro Tip: </span>{bite.tip}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-[#fbfcfd] flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {bites.length} grammar points covered
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs transition cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
