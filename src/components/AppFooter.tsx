import React from 'react';
import { Shield, FileText, Info, Mail, Heart, Sparkles, BookOpen } from 'lucide-react';
import { LegalTab } from './LegalModal';
import { SponsorAd } from './SponsorAd';

interface AppFooterProps {
  targetLang: string;
  onOpenLegal: (tab: LegalTab) => void;
  hasStory: boolean;
}

export const AppFooter: React.FC<AppFooterProps> = ({
  targetLang,
  onOpenLegal,
  hasStory,
}) => {
  return (
    <footer className="mt-12 pt-8 pb-16 lg:pb-10 border-t border-slate-200 text-xs text-slate-500 space-y-6 select-none">
      {/* Policy-Compliant In-Content Ad Placement (Only rendered when content exists) */}
      {hasStory && (
        <div className="max-w-2xl mx-auto">
          <SponsorAd
            placement="in-content"
            targetLang={targetLang}
            hasSubstantialContent={hasStory}
          />
        </div>
      )}

      {/* Footer Navigation Links (Crawlable Anchor Links for AdSense Bots & Users) */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-600">
        <a
          href="/stories"
          className="hover:text-emerald-700 transition flex items-center gap-1"
        >
          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
          <span>Reading Library</span>
        </a>

        <span className="text-slate-300">•</span>

        <a
          href="/about"
          onClick={(e) => {
            if (!e.metaKey && !e.ctrlKey) {
              e.preventDefault();
              onOpenLegal('about');
            }
          }}
          className="hover:text-emerald-700 transition flex items-center gap-1"
        >
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>About Us</span>
        </a>

        <span className="text-slate-300">•</span>

        <a
          href="/privacy"
          onClick={(e) => {
            if (!e.metaKey && !e.ctrlKey) {
              e.preventDefault();
              onOpenLegal('privacy');
            }
          }}
          className="hover:text-emerald-700 transition flex items-center gap-1"
        >
          <Shield className="w-3.5 h-3.5 text-slate-400" />
          <span>Privacy Policy</span>
        </a>

        <span className="text-slate-300">•</span>

        <a
          href="/terms"
          onClick={(e) => {
            if (!e.metaKey && !e.ctrlKey) {
              e.preventDefault();
              onOpenLegal('terms');
            }
          }}
          className="hover:text-emerald-700 transition flex items-center gap-1"
        >
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span>Terms of Service</span>
        </a>

        <span className="text-slate-300">•</span>

        <a
          href="/contact"
          onClick={(e) => {
            if (!e.metaKey && !e.ctrlKey) {
              e.preventDefault();
              onOpenLegal('contact');
            }
          }}
          className="hover:text-emerald-700 transition flex items-center gap-1"
        >
          <Mail className="w-3.5 h-3.5 text-slate-400" />
          <span>Contact & Support</span>
        </a>
      </div>

      {/* Publisher Mission & Copyright */}
      <div className="text-center space-y-1.5 text-[11px] text-slate-400 max-w-lg mx-auto px-4">
        <p className="flex items-center justify-center gap-1 font-medium text-slate-600">
          <span>Querviam — Master languages through immersive AI stories & native phonetics.</span>
        </p>
        <p>
          Supported by Google AdSense advertising to keep language education free for students worldwide.
        </p>
        <p className="text-[10px] text-slate-400">
          © {new Date().getFullYear()} Querviam • Gordon Robb • All rights reserved
        </p>
      </div>
    </footer>
  );
};
