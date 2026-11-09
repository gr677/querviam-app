import React, { useState } from 'react';
import {
  X,
  Shield,
  FileText,
  Info,
  Mail,
  CheckCircle,
  ExternalLink,
  Lock,
  Globe,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export type LegalTab = 'privacy' | 'terms' | 'about' | 'contact';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy',
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in select-text"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#008450] flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 id="legal-modal-title" className="text-base font-bold text-slate-900">
                Legal, Privacy & Publisher Info
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Google AdSense policy compliance, privacy protection, and transparent operations
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-6 overflow-x-auto gap-1 text-xs font-bold scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'border-[#008450] text-[#008450]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'terms'
                ? 'border-[#008450] text-[#008450]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms of Service</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'about'
                ? 'border-[#008450] text-[#008450]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>About Us</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'contact'
                ? 'border-[#008450] text-[#008450]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact & Support</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed max-h-[calc(90vh-140px)] select-text">
          {/* TAB 1: PRIVACY POLICY (Full Google AdSense / GDPR / CCPA Compliance) */}
          {activeTab === 'privacy' && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-lg font-bold text-slate-900">Privacy Policy</h4>
                <p className="text-xs text-slate-500">
                  Last Updated: October 2026 • Compliant with Google AdSense Publisher Policies, GDPR, and CCPA
                </p>
              </div>

              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs space-y-1 text-emerald-950">
                <span className="font-bold flex items-center gap-1.5 text-emerald-900">
                  <CheckCircle className="w-4 h-4 text-[#008450]" />
                  <span>Your Data Belongs to You (Client-First Privacy)</span>
                </span>
                <p>
                  Querviam is engineered with a strict privacy-first architecture. Your study stories,
                  reading progress, daily streaks, custom vocabulary highlights, and pronunciation recordings
                  are stored <strong>privately on your device</strong> using browser localStorage. We do not sell your personal data.
                </p>
              </div>

              {/* 1. Google AdSense & Third-Party Cookies Disclosure (Required by AdSense Policy) */}
              <div className="space-y-2">
                <h5 className="font-bold text-slate-900 text-sm">
                  1. Google AdSense & Third-Party Advertising
                </h5>
                <p className="text-xs text-slate-600">
                  We use Google AdSense to serve advertisements when you visit our website. To keep Querviam free
                  for language learners worldwide, third-party vendors, including Google, use cookies to serve ads
                  based on a user&apos;s prior visits to this website or other websites.
                </p>
                <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                  <li>
                    <strong>DoubleClick DART Cookie:</strong> Google&apos;s use of advertising cookies enables it and its
                    partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.
                  </li>
                  <li>
                    <strong>Opt-Out of Personalized Advertising:</strong> Users may opt out of personalized advertising
                    at any time by visiting{' '}
                    <a
                      href="https://www.google.com/settings/ads"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 underline font-semibold inline-flex items-center gap-0.5"
                    >
                      Google Ad Settings <ExternalLink className="w-3 h-3" />
                    </a>.
                  </li>
                  <li>
                    Alternatively, you can opt out of a third-party vendor&apos;s use of cookies for personalized advertising by visiting{' '}
                    <a
                      href="https://www.aboutads.info/choices/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 underline font-semibold inline-flex items-center gap-0.5"
                    >
                      www.aboutads.info <ExternalLink className="w-3 h-3" />
                    </a>.
                  </li>
                </ul>
              </div>

              {/* 2. Information We Collect */}
              <div className="space-y-2">
                <h5 className="font-bold text-slate-900 text-sm">2. Information We Collect</h5>
                <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                  <li>
                    <strong>Usage & Study Preferences:</strong> Target language chosen, difficulty level, audio speed,
                    and learning mode stored locally in your browser.
                  </li>
                  <li>
                    <strong>Story Inputs:</strong> Custom topics entered into the story prompt generator are processed
                    temporarily by the server to construct your bilingual story text and are not sold or linked to personal identities.
                  </li>
                  <li>
                    <strong>Microphone Data:</strong> The voice recognition and pronunciation scoring features process
                    audio locally or via browser Speech APIs for instant scoring. No raw voice audio is permanently archived.
                  </li>
                  <li>
                    <strong>Log Files & Anonymous Analytics:</strong> Like most web servers, our server logs standard
                    HTTP requests (browser type, timestamp, page accessed) for security, server performance monitoring, and rate limiting.
                  </li>
                </ul>
              </div>

              {/* 3. GDPR Compliance (EU Users) */}
              <div className="space-y-2">
                <h5 className="font-bold text-slate-900 text-sm">3. GDPR & European Privacy Rights</h5>
                <p className="text-xs text-slate-600">
                  If you reside in the European Economic Area (EEA) or UK, you have the right to access, rectify, or erase
                  any personal data stored about you. Because Querviam stores your study progress directly in your browser&apos;s
                  local storage, you have 100% control to view, export (via JSON/HTML), or clear your data at any time through
                  the Library &ldquo;Clear Data&rdquo; button or your browser settings.
                </p>
              </div>

              {/* 4. CCPA / CPRA Compliance (California Residents) */}
              <div className="space-y-2">
                <h5 className="font-bold text-slate-900 text-sm">4. California Consumer Privacy Act (CCPA)</h5>
                <p className="text-xs text-slate-600">
                  We do not sell, rent, or trade personal information to any third party. California residents have the right
                  to request information regarding any disclosure of personal information and to opt-out of cookie-based tracking.
                </p>
              </div>

              {/* 5. Children's Privacy (COPPA) */}
              <div className="space-y-2">
                <h5 className="font-bold text-slate-900 text-sm">5. Children&apos;s Privacy (COPPA)</h5>
                <p className="text-xs text-slate-600">
                  Querviam is an educational language learning platform. We do not knowingly collect personally identifiable
                  information from children under the age of 13.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-lg font-bold text-slate-900">Terms of Service</h4>
                <p className="text-xs text-slate-500">
                  Effective Date: October 2026 • Please read carefully before using Querviam
                </p>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <p>
                  <strong>1. Acceptance of Terms:</strong> By accessing and using Querviam (&ldquo;the App&rdquo;), you agree
                  to be bound by these Terms of Service. If you do not agree to these terms, please do not use the application.
                </p>
                <p>
                  <strong>2. Educational Purpose:</strong> Querviam provides artificial intelligence-assisted language learning
                  stories, interactive exercises, phonetics drills, and grammatical analysis. The content is designed for
                  self-study and supplementary education.
                </p>
                <p>
                  <strong>3. AI-Generated Content:</strong> Stories and exercises are synthesized using artificial intelligence
                  models. While we maintain high pedagogical standards and grammar accuracy filters, content is provided
                  &ldquo;as is&rdquo; without warranties of absolute accuracy.
                </p>
                <p>
                  <strong>4. User Conduct:</strong> You agree not to use the story generator to produce illegal, defamatory,
                  harmful, or hateful content, or to attempt to overload or reverse-engineer our servers and rate limits.
                </p>
                <p>
                  <strong>5. Intellectual Property:</strong> The Querviam interface, pedagogical methodology, code, and
                  branding are protected by copyright and intellectual property laws. You retain full personal study rights
                  to any stories and study sheets generated for your learning.
                </p>
                <p>
                  <strong>6. Free Access & Advertising:</strong> Access to Querviam is provided free of charge, supported by
                  Google AdSense display advertising. Users agree not to artificially manipulate, click-farm, or tamper
                  with advertising scripts.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: ABOUT US & EDUCATIONAL MISSION */}
          {activeTab === 'about' && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-lg font-bold text-slate-900">About Querviam</h4>
                <p className="text-xs text-slate-500">
                  Empowering language learners through comprehensible input and natural storytelling
                </p>
              </div>

              <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                <p>
                  <strong>Our Mission:</strong> Querviam was built on the research-backed linguistic principle of{' '}
                  <em>Comprehensible Input</em> (Krashen Hypothesis). Traditional language apps often rely on isolated,
                  robotic flashcards. Querviam immerses learners in vivid, context-rich stories tailored precisely to their
                  chosen topic, grammar tense, and CEFR proficiency level (from A1 Beginner to C2+ Native Mastery).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="font-bold text-slate-900 block text-xs">📖 Contextual Stories</span>
                    <p className="text-[11px] text-slate-500">
                      Learn vocabulary naturally through engaging cultural narratives, dialogues, and historical seeds.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="font-bold text-slate-900 block text-xs">🗣️ Multi-Modal Audio</span>
                    <p className="text-[11px] text-slate-500">
                      Hear native speech synthesis, practice speaking with instant pronunciation scoring, and train your ear.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="font-bold text-slate-900 block text-xs">🎓 6 Practice Modes</span>
                    <p className="text-[11px] text-slate-500">
                      Spelling, word scramble, multiple choice, speech recognition, comprehension tests, and printable worksheets.
                    </p>
                  </div>
                </div>

                <p>
                  <strong>Created by:</strong> Gordon Robb (<a href="mailto:gordon.robb@gmail.com" className="text-emerald-700 font-semibold underline">gordon.robb@gmail.com</a>).
                  We believe high-quality education should be accessible to anyone with an internet connection, supported cleanly
                  by respectful, policy-compliant advertising.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: CONTACT & SUPPORT */}
          {activeTab === 'contact' && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-lg font-bold text-slate-900">Contact & Support</h4>
                <p className="text-xs text-slate-500">
                  We are here to assist with questions, feedback, bug reports, and publisher inquiries
                </p>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <p>
                  Have a suggestion for a new language, question about privacy, or feedback on your study experience?
                  Reach out directly to the creator:
                </p>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <Mail className="w-4 h-4 text-[#008450]" />
                    <span>Email Support:</span>
                  </div>
                  <a
                    href="mailto:gordon.robb@gmail.com"
                    className="text-emerald-700 font-mono text-sm underline font-bold"
                  >
                    gordon.robb@gmail.com
                  </a>
                  <p className="text-[11px] text-slate-500">
                    Typical response time: Within 24–48 hours.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1 text-emerald-950">
                  <span className="font-bold block">Publisher / Webmaster Inquiries:</span>
                  <p>
                    Querviam is an independent educational web application. For copyright, DMCA notices, or
                    advertising inquiries, please include &ldquo;[Querviam Inquiry]&rdquo; in your email subject line.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">
            © {new Date().getFullYear()} Querviam • All rights reserved
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
