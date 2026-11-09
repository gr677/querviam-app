import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, X } from 'lucide-react';

interface CookieConsentBannerProps {
  onOpenPrivacy: () => void;
}

const COOKIE_CONSENT_KEY = 'querviam_cookie_consent_v1';

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ onOpenPrivacy }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!consent) {
        // Small delay so page loads smoothly before showing banner
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Storage unavailable
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted_all');
    } catch {}
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'essential_only');
    } catch {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Cookie and Privacy Consent Banner"
      className="fixed bottom-16 lg:bottom-4 inset-x-3 sm:inset-x-6 z-50 max-w-2xl mx-auto bg-white/98 backdrop-blur-md border border-slate-300/90 rounded-2xl p-4 shadow-2xl animate-fade-in flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-700"
    >
      <div className="flex items-start gap-2.5 flex-1 pr-1">
        <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
          <Cookie className="w-4 h-4" />
        </div>
        <div className="space-y-0.5">
          <span className="font-bold text-slate-900 block text-xs">
            Cookie & Privacy Notice
          </span>
          <p className="text-[11px] text-slate-600 leading-snug">
            Querviam uses local storage to save your reading progress privately on your device, and uses cookies
            via Google AdSense to serve ads and support free language education.{' '}
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="text-[#008450] font-bold underline hover:text-emerald-800 cursor-pointer"
            >
              Privacy Policy
            </button>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
        <button
          type="button"
          onClick={handleEssentialOnly}
          className="px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer"
        >
          Essential Only
        </button>
        <button
          type="button"
          onClick={handleAcceptAll}
          className="px-3.5 py-1.5 rounded-xl bg-[#008450] hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition cursor-pointer active:scale-95"
        >
          Accept All
        </button>
      </div>
    </aside>
  );
};
