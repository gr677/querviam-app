import React, { useState } from 'react';
import { X, Copy, Check, Info, FileCode, CheckCircle2, AlertTriangle } from 'lucide-react';
import { StoryData } from '../types';
import { getT, isRtlLanguage } from '../utils/translations';

interface StoryInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: StoryData | null;
  filename?: string | null;
  baseLang?: string;
  onOpenStats?: () => void;
}

export const StoryInspectorModal: React.FC<StoryInspectorModalProps> = ({
  isOpen,
  onClose,
  story,
  filename,
  baseLang = 'English',
  onOpenStats,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'json' | 'sentences'>('summary');
  const t = getT(baseLang);

  if (!isOpen || !story) return null;

  const targetIsRtl = isRtlLanguage(story._meta?.targetLang);
  const baseIsRtl = isRtlLanguage(story._meta?.baseLang || baseLang);
  const sentenceCount = story.sentences?.length || 0;
  const requestedLength = story._meta?.length ? String(story._meta.length) : null;
  const isTruncated = requestedLength && parseInt(requestedLength, 10) > sentenceCount;

  const handleCopyJson = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(story, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="flex flex-col w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">{t.inspectorTitle}</h3>
              <p className="text-[11px] text-slate-400">{t.inspectorSubtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title={t.close}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('summary')}
            className={`pb-2.5 border-b-2 transition ${
              activeTab === 'summary'
                ? 'border-[#008450] text-[#008450]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.overviewTab}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sentences')}
            className={`pb-2.5 border-b-2 transition ${
              activeTab === 'sentences'
                ? 'border-[#008450] text-[#008450]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.sentencesTab(sentenceCount)}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('json')}
            className={`pb-2.5 border-b-2 transition ${
              activeTab === 'json'
                ? 'border-[#008450] text-[#008450]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.rawJsonTab}
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 text-xs text-slate-700 space-y-4">
          {activeTab === 'summary' && (
            <div className="space-y-3">
              {/* Truncation Alert */}
              {isTruncated ? (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">{t.discrepancyTitle}</div>
                    <div className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                      {t.discrepancyDesc(requestedLength, sentenceCount)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t.generatedAsRequested(sentenceCount)}</span>
                </div>
              )}

              {/* Key Attributes Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">{t.targetTitleLabel}</div>
                  <div className="font-bold text-slate-900 mt-0.5 truncate" dir={targetIsRtl ? 'rtl' : 'ltr'}>{story.title_target}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">{t.translationSubtitleLabel}</div>
                  <div className="font-medium text-slate-800 mt-0.5 truncate" dir={baseIsRtl ? 'rtl' : 'ltr'}>{story.title_en || '—'}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">{t.targetLangLabel}</div>
                  <div className="font-semibold text-slate-800 mt-0.5">{story._meta?.targetLang || '—'}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">{t.difficultyTenseLabel}</div>
                  <div className="font-semibold text-slate-800 mt-0.5">
                    {story._meta?.difficulty || '—'} • {story._meta?.tense || '—'}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">{t.sentenceCountLabel}</div>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {t.sentencesCount(sentenceCount)}
                    {requestedLength && ` (${requestedLength})`}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">{t.filenameLabel}</div>
                  <div className="font-mono text-[10px] text-slate-600 mt-0.5 truncate">{filename || 'live_session.json'}</div>
                </div>
              </div>

              {story._meta?.prompt && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">{t.promptSeedLabel}</div>
                  <div className="text-xs text-slate-800 mt-1 italic">"{story._meta.prompt}"</div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'sentences' && (
            <div className="space-y-2">
              <p className="text-[11px] text-slate-500">{t.parsedSentencesList}</p>
              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                {story.sentences.map((s, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-[11px]">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5" dir={targetIsRtl ? 'rtl' : 'ltr'}>
                      <span className="text-slate-400 font-mono text-[10px]">#{idx + 1}</span>
                      <span>{s.target}</span>
                    </div>
                    {s.en && <div className="text-slate-500 mt-0.5 ml-4" dir={baseIsRtl ? 'rtl' : 'ltr'}>{s.en}</div>}
                    {s.verbs && s.verbs.length > 0 && (
                      <div className="text-[10px] text-emerald-700 mt-1 ml-4 font-mono">
                        {s.verbs.map((v) => v.infinitive || v.contextForm).join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'json' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>{t.rawJsonLabel}</span>
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? t.copied : t.copyJsonBtn}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-900 text-emerald-300 rounded-xl font-mono text-[10px] leading-relaxed max-h-72 overflow-auto whitespace-pre" dir="ltr">
                {JSON.stringify(story, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopyJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-100 transition shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <FileCode className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? t.copiedClipboard : t.copyStoryJsonBtn}</span>
            </button>
            {onOpenStats && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenStats();
                }}
                className="text-[11px] font-semibold text-slate-400 hover:text-emerald-700 transition"
                title="Analytics"
              >
                Analytics 📊
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#008450] hover:bg-[#006e43] text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            {t.done}
          </button>
        </div>
      </div>
    </div>
  );
};
