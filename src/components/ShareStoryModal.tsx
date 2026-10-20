import React, { useState, useEffect } from 'react';
import {
  X,
  Share2,
  Copy,
  CheckCheck,
  Send,
  MessageCircle,
  Mail,
  Sparkles,
  ExternalLink,
  Check,
  BookOpen,
  Clock,
  Info,
} from 'lucide-react';
import { StoryData } from '../types';
import {
  createShortStoryShareUrl,
  createStoryShareUrl,
  createStoryEmailLink,
  createStoryEmailProviderUrl,
  getStoryEmailContent,
  detectEmailProviderFromDomain,
  EmailProvider,
} from '../utils/shareUtils';
import { logAnalyticsEvent } from '../utils/analytics';

// SVG Logos for email providers
const GmailIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5 shrink-0' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path fill="#4285F4" d="M2 7.5V18c0 1.1.9 2 2 2h3.5v-7.5L2 7.5z" />
    <path fill="#34A853" d="M16.5 20H20c1.1 0 2-.9 2-2V7.5l-5.5 5V20z" />
    <path fill="#EA4335" d="M16.5 4H20c1.1 0 2 .9 2 2v1.5L12 14.5 2 7.5V6c0-1.1.9 2-2 2h3.5L12 9l4.5-5z" />
    <path fill="#FBBC05" d="M7.5 4H4C2.9 4 2 4.9 2 6v1.5L7.5 11V4z" />
  </svg>
);

const OutlookIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5 shrink-0' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path fill="#0078D4" d="M14 4h7a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-7V4z" />
    <path fill="#106EBE" d="M2 7a1 1 0 0 1 1-1h11v12H3a1 1 0 0 1-1-1V7z" />
    <circle cx="8" cy="12" r="2.5" fill="#FFFFFF" />
  </svg>
);

const YahooIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5 shrink-0' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path fill="#6001D2" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.8 6.5l-2.6 4.7v4.3h-2.4v-4.3L8.2 8.5h2.6l1.4 2.8 1.4-2.8h2.2z" />
  </svg>
);

interface ShareStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: StoryData | null;
  targetLang: string;
}

export const ShareStoryModal: React.FC<ShareStoryModalProps> = ({
  isOpen,
  onClose,
  story,
  targetLang,
}) => {
  const [shareUrl, setShareUrl] = useState('');
  const [isShortUrl, setIsShortUrl] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmailText, setCopiedEmailText] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailProvider, setEmailProvider] = useState<EmailProvider>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('querviam_preferred_email_client');
      if (saved === 'gmail' || saved === 'mailto' || saved === 'outlook' || saved === 'yahoo') {
        return saved as EmailProvider;
      }
      // On phones, default to the phone's native Mail app (iOS Mail / Android Mail)
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
      if (isMobile) {
        return 'mailto';
      }
    }
    // Default to Gmail on desktop to prevent unwanted Windows Outlook/Mail desktop app popups!
    return 'gmail';
  });

  const handleSelectProvider = (provider: EmailProvider) => {
    setEmailProvider(provider);
    if (typeof window !== 'undefined') {
      localStorage.setItem('querviam_preferred_email_client', provider);
    }
  };

  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRecipientEmail(val);
    const detected = detectEmailProviderFromDomain(val);
    if (detected && detected !== emailProvider) {
      handleSelectProvider(detected);
    }
  };

  // Generate short link when modal opens
  useEffect(() => {
    let isMounted = true;
    if (isOpen && story) {
      // First set default fast link
      const fallback = createStoryShareUrl(story);
      setShareUrl(fallback);

      // Request sleek short link from server
      createShortStoryShareUrl(story, 30)
        .then((res) => {
          if (isMounted && res.url) {
            setShareUrl(res.url);
            setIsShortUrl(res.isShort);
          }
        })
        .catch(() => {
          // Keep fallback
        });
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen, story]);

  const [includeStoryText, setIncludeStoryText] = useState(true);
  const [includeTranslations, setIncludeTranslations] = useState(true);
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  if (!isOpen || !story) return null;

  const title = story.title_target || 'Story';
  const subtitle = story.title_en || '';
  const shareText = `Read and practice this bilingual story on Querviam: "${title}" (${subtitle})`;
  const emailOptions = { includeStoryText, includeTranslations };
  const emailContent = getStoryEmailContent(story, shareUrl, emailOptions);
  const activeEmailUrl = createStoryEmailProviderUrl(
    emailProvider,
    story,
    recipientEmail,
    shareUrl,
    emailOptions
  );

  const handleCopyLink = async () => {
    try {
      logAnalyticsEvent('story_shared', { method: 'copy_link' });
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyEmailText = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(emailContent.body);
      }
      setCopiedEmailText(true);
      setTimeout(() => setCopiedEmailText(false), 2500);
    } catch {
      setCopiedEmailText(true);
      setTimeout(() => setCopiedEmailText(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    logAnalyticsEvent('story_shared', { method: 'native_share' });
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `Querviam: ${title}`,
          text: shareText,
          url: shareUrl,
        });
      } catch (_) {}
    } else {
      handleCopyLink();
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${shareText}\n\n${shareUrl}`
  )}`;

  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto"
      style={{ zIndex: 99999 }}
      onClick={onClose}
    >
      <div
        className="flex flex-col w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white shadow-xs shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 shadow-xs">
              <Share2 className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Share & Email Story</h3>
              <p className="text-xs text-emerald-200/90">Short link that pre-loads immediately in your friend's browser</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-emerald-100 hover:text-white hover:bg-white/15 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Story Card Preview */}
          <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200/80">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {targetLang} Story
                </span>
                <span className="text-xs text-emerald-800 font-medium">
                  {story.sentences?.length || 0} sentences with audio
                </span>
              </div>
              {isShortUrl && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-full border border-emerald-300 shadow-2xs">
                  <Clock className="w-3 h-3 text-emerald-600" />
                  30-Day Short Link
                </span>
              )}
            </div>
            <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">{title}</h4>
            {subtitle && <p className="text-xs text-slate-600 italic mt-0.5">{subtitle}</p>}
          </div>

          {/* Email Feature Box */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#008450] flex items-center justify-center font-bold">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Email This Story</h4>
                  <p className="text-[11px] text-slate-500">Pre-fills subject, story preview, and short link</p>
                </div>
              </div>

              {/* Saved Provider Indicator */}
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                <span>Default:</span>
                <span className="font-bold text-slate-800 capitalize">{emailProvider === 'mailto' ? 'Mail App' : emailProvider}</span>
              </span>
            </div>

            {/* Email Provider Selector Tabs */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold text-slate-700">Where do you read & send email?</label>
                <span className="text-[10px] text-slate-600">Remembers your choice</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-200/70 rounded-xl">
                <button
                  type="button"
                  onClick={() => handleSelectProvider('gmail')}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                    emailProvider === 'gmail'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200 ring-1 ring-emerald-500/30'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                  title="Open directly in Gmail in your browser"
                >
                  <GmailIcon />
                  <span>Gmail</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectProvider('outlook')}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                    emailProvider === 'outlook'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200 ring-1 ring-blue-500/30'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                  title="Open in Outlook.com / Office 365 Web"
                >
                  <OutlookIcon />
                  <span>Outlook Web</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectProvider('yahoo')}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                    emailProvider === 'yahoo'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200 ring-1 ring-purple-500/30'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                  title="Open in Yahoo Mail Web"
                >
                  <YahooIcon />
                  <span>Yahoo</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectProvider('mailto')}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                    emailProvider === 'mailto'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200 ring-1 ring-slate-400/30'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                  title="Launch Windows Mail, Thunderbird, or installed desktop app"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span>Default App</span>
                </button>
              </div>
            </div>

            {/* Recipient Input & Send CTA */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={handleRecipientChange}
                  placeholder="Friend's email (optional)..."
                  className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <a
                  href={activeEmailUrl}
                  onClick={() => logAnalyticsEvent('story_shared', { method: emailProvider })}
                  target={emailProvider === 'mailto' ? undefined : '_blank'}
                  rel={emailProvider === 'mailto' ? undefined : 'noopener noreferrer'}
                  className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer active:scale-95 ${
                    emailProvider === 'gmail'
                      ? 'bg-[#EA4335] hover:bg-[#d93025]'
                      : emailProvider === 'outlook'
                      ? 'bg-[#0078D4] hover:bg-[#106EBE]'
                      : emailProvider === 'yahoo'
                      ? 'bg-[#6001D2] hover:bg-[#5200b3]'
                      : 'bg-[#008450] hover:bg-[#006e43]'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {emailProvider === 'gmail'
                      ? 'Open in Gmail'
                      : emailProvider === 'outlook'
                      ? 'Open in Outlook Web'
                      : emailProvider === 'yahoo'
                      ? 'Open in Yahoo'
                      : 'Open Mail App'}
                  </span>
                  {emailProvider !== 'mailto' && <ExternalLink className="w-3 h-3 opacity-80" />}
                </a>
              </div>

              {/* Story Content Population Options */}
              <div className="p-2.5 bg-white/90 border border-slate-200/90 rounded-xl space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-800">
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold select-none">
                      <input
                        type="checkbox"
                        checked={includeStoryText}
                        onChange={(e) => setIncludeStoryText(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer"
                      />
                      <span>Include story text</span>
                    </label>

                    {includeStoryText && (
                      <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-600 select-none">
                        <input
                          type="checkbox"
                          checked={includeTranslations}
                          onChange={(e) => setIncludeTranslations(e.target.checked)}
                          className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer"
                        />
                        <span>With English translations</span>
                      </label>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowEmailPreview(!showEmailPreview)}
                    className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 underline underline-offset-2 cursor-pointer"
                  >
                    {showEmailPreview ? 'Hide preview ▲' : 'Preview email message ▼'}
                  </button>
                </div>

                {showEmailPreview && (
                  <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-mono text-slate-700 max-h-44 overflow-y-auto whitespace-pre-wrap leading-relaxed select-text shadow-inner">
                    <div className="font-bold text-slate-900 pb-1.5 border-b border-slate-200/80 mb-1.5 font-sans text-xs">
                      Subject: {emailContent.subject}
                    </div>
                    {emailContent.body}
                  </div>
                )}
              </div>

              {/* Clear Informative Callout */}
              <div className="flex items-start gap-2 text-[11px] text-slate-600 bg-white/80 p-2.5 rounded-xl border border-slate-200/80 leading-relaxed">
                <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  {emailProvider === 'gmail' && (
                    <span>
                      <strong>Gmail Web:</strong> Launches Gmail directly in your browser tab with the story text and short link pre-filled. <em>No unwanted Outlook desktop windows or popups!</em>
                    </span>
                  )}
                  {emailProvider === 'outlook' && (
                    <span>
                      <strong>Outlook Web:</strong> Opens Outlook.com compose directly in your browser with the story text pre-filled.
                    </span>
                  )}
                  {emailProvider === 'yahoo' && (
                    <span>
                      <strong>Yahoo Mail:</strong> Opens Yahoo Mail compose tab with the story pre-filled and ready to send.
                    </span>
                  )}
                  {emailProvider === 'mailto' && (
                    <span>
                      <strong>Default App:</strong> Prompts your operating system (Windows/macOS) to launch its registered default mail app (such as Microsoft Outlook or Thunderbird) with the story text pre-populated.
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">Want to paste into another chat or app?</span>
                <button
                  type="button"
                  onClick={handleCopyEmailText}
                  className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                >
                  {copiedEmailText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmailText ? 'Copied Full Story Email!' : 'Copy Full Story Message'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 1-Click Copy Link Box */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                {isShortUrl ? 'Short Story Link' : 'Direct Story Link'}
              </label>
              {isShortUrl && (
                <span className="text-[10px] text-slate-500 font-medium">
                  Compact 6-char URL
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2 bg-slate-100 border border-slate-300 rounded-xl text-xs text-slate-800 font-mono truncate select-all focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer active:scale-95 ${
                  copiedLink
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-900 text-white'
                }`}
              >
                {copiedLink ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
              <span>⚡</span> When opened, Querviam pre-loads the story with all audio and exercises, and saves a permanent copy to your friend's library!
            </p>
          </div>

          {/* Social / Instant Messaging Buttons */}
          <div>
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
              Send Via Messaging
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-bold transition group"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition" />
                <span>WhatsApp</span>
              </a>

              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-900 text-xs font-bold transition group"
              >
                <Send className="w-4 h-4 text-sky-600 group-hover:scale-110 transition" />
                <span>Telegram</span>
              </a>

              {typeof navigator !== 'undefined' && 'share' in navigator ? (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-slate-700" />
                  <span>More...</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer"
                >
                  <Copy className="w-4 h-4 text-slate-700" />
                  <span>Copy Link</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
