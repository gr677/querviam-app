import React, { useState, useEffect } from 'react';
import { Coffee, Plane, Headphones, Book, Globe, Volume2, ExternalLink, Sparkles, X, Info } from 'lucide-react';
import { AD_CONFIG, SAMPLE_SPONSORS, SponsorAdItem } from '../utils/adsData';

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

interface SponsorAdProps {
  placement: 'sidebar' | 'in-content' | 'mobile-compact';
  targetLang: string;
  hasSubstantialContent?: boolean;
  onSpeakText?: (text: string) => void;
  className?: string;
}

export const SponsorAd: React.FC<SponsorAdProps> = ({
  placement,
  targetLang,
  hasSubstantialContent = true,
  onSpeakText,
  className = '',
}) => {
  const [translated, setTranslated] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // AdSense Policy Safeguard: Never render ads on sidebar navigation or screens without publisher content
  if (placement === 'sidebar' || !hasSubstantialContent || dismissed) {
    return null;
  }

  // Push AdSense unit to queue once component is mounted in DOM
  useEffect(() => {
    if (AD_CONFIG.USE_REAL_ADS && !dismissed && typeof window !== 'undefined') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        // Harmless fallback if adblocker is active or container already populated
      }
    }
  }, [placement, dismissed]);

  // Pick a sponsor based on placement or rotation
  const adIndex = placement === 'in-content' ? 1 : 2;
  const sponsor: SponsorAdItem = SAMPLE_SPONSORS[adIndex % SAMPLE_SPONSORS.length];

  // Real Google AdSense Block
  if (AD_CONFIG.USE_REAL_ADS) {
    const isMobile = placement === 'mobile-compact';
    const slotId = isMobile
      ? AD_CONFIG.ADSENSE_SLOT_MOBILE
      : AD_CONFIG.ADSENSE_SLOT_INCONTENT;

    return (
      <div className={`p-2.5 sm:p-3 bg-white/95 border border-slate-200/90 rounded-2xl shadow-2xs text-center overflow-hidden relative ${className}`}>
        <div className="flex items-center justify-between px-1 mb-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Advertisement
          </span>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded transition cursor-pointer"
            title="Dismiss ad"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="w-full flex justify-center items-center min-h-[90px] overflow-hidden">
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%' }}
            data-ad-client={AD_CONFIG.ADSENSE_CLIENT_ID}
            {...(slotId ? { 'data-ad-slot': slotId } : {})}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      </div>
    );
  }

  // Retrieve translation for target language if available
  const langTranslation = sponsor.translations[targetLang] || {
    headline: sponsor.headlineEn,
    description: sponsor.descriptionEn,
    ctaText: sponsor.ctaTextEn,
  };

  const hasTranslation = Boolean(sponsor.translations[targetLang]);
  const activeHeadline = translated && hasTranslation ? langTranslation.headline : sponsor.headlineEn;
  const activeDescription = translated && hasTranslation ? langTranslation.description : sponsor.descriptionEn;
  const activeCta = translated && hasTranslation ? langTranslation.ctaText : sponsor.ctaTextEn;

  const renderIcon = () => {
    switch (sponsor.icon) {
      case 'coffee':
        return <Coffee className="w-4 h-4 text-amber-700" />;
      case 'plane':
        return <Plane className="w-4 h-4 text-emerald-700" />;
      case 'headphones':
        return <Headphones className="w-4 h-4 text-teal-700" />;
      default:
        return <Book className="w-4 h-4 text-slate-700" />;
    }
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSpeakText) {
      onSpeakText(`${activeHeadline}. ${activeDescription}`);
    }
  };

  // 1. Mobile Compact Placement (streamlined card tucked under story)
  if (placement === 'mobile-compact') {
    return (
      <div className={`p-3 bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/90 rounded-2xl shadow-2xs space-y-2 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">
              Sponsor
            </span>
            <span className="text-xs font-bold text-slate-800 truncate">{sponsor.brand}</span>
          </div>

          <div className="flex items-center gap-1">
            {hasTranslation && (
              <button
                type="button"
                onClick={() => setTranslated(!translated)}
                className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg border transition cursor-pointer active:scale-95 ${
                  translated
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
                title={`Translate ad text to ${targetLang}`}
              >
                <Globe className="w-3 h-3 text-[#008450]" />
                <span>{translated ? 'In English' : `In ${targetLang}`}</span>
              </button>
            )}

            {translated && onSpeakText && (
              <button
                type="button"
                onClick={handleSpeak}
                className="p-1 rounded-md bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition cursor-pointer"
                title="Listen to ad pronunciation"
              >
                <Volume2 className="w-3 h-3" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              title="Hide sponsor notice"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-900 leading-snug">
            {activeHeadline}
          </h4>
          <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
            {activeDescription}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] text-slate-400 font-medium">
            Supporting free learning
          </span>
          <a
            href={sponsor.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#008450] hover:text-[#006b40] bg-emerald-50 hover:bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-200 transition"
          >
            <span>{activeCta}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  // 2. In-Content Placement (Full width reading card under story)
  return (
    <div className={`p-4 bg-gradient-to-r from-emerald-50/40 via-white to-slate-50 border border-emerald-200/80 rounded-2xl shadow-xs space-y-2.5 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-emerald-100/70 border border-emerald-200 text-[#008450]">
            {renderIcon()}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                Language Sponsor
              </span>
              <span className="text-xs font-bold text-slate-800">{sponsor.brand}</span>
            </div>
            <span className="text-[11px] text-slate-400 block">{sponsor.category}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {hasTranslation && (
            <button
              type="button"
              onClick={() => setTranslated(!translated)}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-xl border transition cursor-pointer shadow-2xs active:scale-95 ${
                translated
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                  : 'bg-white hover:bg-emerald-50 text-emerald-900 border-emerald-200'
              }`}
              title={`Toggle translation to ${targetLang}`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{translated ? 'Show in English' : `Read in ${targetLang}`}</span>
            </button>
          )}

          {translated && onSpeakText && (
            <button
              type="button"
              onClick={handleSpeak}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold transition cursor-pointer shadow-2xs"
              title="Hear native audio pronunciation of this ad"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Listen</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
            title="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="py-1">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
          {activeHeadline}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
          {activeDescription}
        </p>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
        <span className="text-[11px] text-slate-400 font-medium">
          🌱 Thoughtful partners helping power free AI voice & story generation
        </span>
        <a
          href={sponsor.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#008450] hover:bg-[#006b40] px-3.5 py-1.5 rounded-xl shadow-xs transition active:scale-95"
        >
          <span>{activeCta}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
