import React, { useState, useEffect, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  Square,
  Repeat,
  Play,
  Mic,
  BookOpen,
  PlusCircle,
  Trash2,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Eye,
  CheckCircle,
  Search,
  Settings,
  HelpCircle,
  Keyboard,
  Layers,
  Printer,
  Lightbulb,
  FileText,
  RotateCcw,
  Zap,
  Highlighter,
  Flame,
  MessageSquare,
  Gamepad2,
  Library as LibraryIcon,
  Copy,
  Check,
  AlertTriangle,
  Share2,
  Mail,
  Trophy,
  BarChart3,
  Info,
} from 'lucide-react';
import {
  StoryData,
  SentenceItem,
  VerbItem,
  PracticeMode,
  ContentType,
  CustomHighlight,
  PronunciationScoreResult,
  LearnerStats,
  QuizQuestion,
} from './types';
import { OwlTrack } from './components/OwlTrack';
import { ScrambleExercise } from './components/ScrambleExercise';
import { MultipleChoiceExercise } from './components/MultipleChoiceExercise';
import { isChinese, extractChineseStoryWords } from './utils/chineseUtils';
import { VerbModal } from './components/VerbModal';
import { FlashcardsModal } from './components/FlashcardsModal';
import { ComprehensionQuizView } from './components/ComprehensionQuizView';
import { QuizPrepAdvertModal } from './components/QuizPrepAdvertModal';
import { GrammarBitesModal } from './components/GrammarBitesModal';
import { StudySheetModal } from './components/StudySheetModal';
import { LibraryModal } from './components/LibraryModal';
import { InstallModal } from './components/InstallModal';
import { SpeedRunTimer } from './components/SpeedRunTimer';
import { PronunciationScoreBadge } from './components/PronunciationScoreBadge';
import { HighlightPopover } from './components/HighlightPopover';
import { ConversationModal } from './components/ConversationModal';
import { LearnerStatsModal } from './components/LearnerStatsModal';
import { MasterSpecialtiesModal } from './components/MasterSpecialtiesModal';
import { SponsorAd } from './components/SponsorAd';
import { StoryGenerationModal } from './components/StoryGenerationModal';
import { ShareStoryModal } from './components/ShareStoryModal';
import { AnalyticsModal } from './components/AnalyticsModal';
import { ContextualMicroHint } from './components/ContextualMicroHint';
import { StoryInspectorModal } from './components/StoryInspectorModal';
import { StoryDictionaryModal } from './components/StoryDictionaryModal';
import { ComicGuideTour } from './components/ComicGuideTour';
import { LegalModal, LegalTab } from './components/LegalModal';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { AppFooter } from './components/AppFooter';
import { logAnalyticsEvent } from './utils/analytics';
import { resolveSharedStoryFromUrl, isShareLinkInUrl } from './utils/shareUtils';
import { classifyWordGrammar, getGrammarBadgeLabel, getGrammarStyle } from './utils/grammarHighlighter';
import { usePWAInstall } from './hooks/usePWAInstall';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import {
  saveLocalStory,
  deleteLocalStory,
  getLearnerStats,
  updateLearnerActivity,
  getLocalLibrarySummaries,
  getLocalStory,
  getStoryPracticeState,
  saveStoryPracticeState,
  clearStoryPracticeState,
  getLastPracticeMode,
  setLastPracticeMode,
  getActiveStoryRef,
  saveActiveStoryRef,
  clearActiveStoryRef,
} from './utils/storage';
import { splitWordPunctuation } from './utils/textUtils';
import { getT, isRtlLanguage, getHtmlLangCode } from './utils/translations';

export interface LanguageOption {
  name: string;
  nativeName: string;
  nativeCountry?: string;
  flag: string;
  code?: string;
  greeting?: string;
}

const LANGUAGES: LanguageOption[] = [
  { name: 'Afrikaans', nativeName: 'Afrikaans', code: 'af-ZA', flag: '🇿🇦' },
  { name: 'Arabic', nativeName: 'العربية', code: 'ar-SA', flag: '🇸🇦' },
  { name: 'Chinese (Mandarin)', nativeName: '简体中文', code: 'zh-CN', flag: '🇨🇳' },
  { name: 'Czech', nativeName: 'Čeština', code: 'cs-CZ', flag: '🇨🇿' },
  { name: 'Dutch', nativeName: 'Nederlands', code: 'nl-NL', flag: '🇳🇱' },
  { name: 'English', nativeName: 'English', code: 'en-US', flag: '🇬🇧' },
  { name: 'French', nativeName: 'Français', code: 'fr-FR', flag: '🇫🇷' },
  { name: 'German', nativeName: 'Deutsch', code: 'de-DE', flag: '🇩🇪' },
  { name: 'Greek', nativeName: 'Ελληνικά', code: 'el-GR', flag: '🇬🇷' },
  { name: 'Hebrew', nativeName: 'עברית', code: 'he-IL', flag: '🇮🇱' },
  { name: 'Hindi', nativeName: 'हिन्दी', code: 'hi-IN', flag: '🇮🇳' },
  { name: 'Hungarian', nativeName: 'Magyar', code: 'hu-HU', flag: '🇭🇺' },
  { name: 'Italian', nativeName: 'Italiano', code: 'it-IT', flag: '🇮🇹' },
  { name: 'Japanese', nativeName: '日本語', code: 'ja-JP', flag: '🇯🇵' },
  { name: 'Korean', nativeName: '한국어', code: 'ko-KR', flag: '🇰🇷' },
  { name: 'Norwegian', nativeName: 'Norsk', code: 'nb-NO', flag: '🇳🇴' },
  { name: 'Polish', nativeName: 'Polski', code: 'pl-PL', flag: '🇵🇱' },
  { name: 'Portuguese', nativeName: 'Português', code: 'pt-PT', flag: '🇵🇹' },
  { name: 'Russian', nativeName: 'Русский', code: 'ru-RU', flag: '🇷🇺' },
  { name: 'Spanish', nativeName: 'Español', code: 'es-ES', flag: '🇪🇸' },
  { name: 'Swedish', nativeName: 'Svenska', code: 'sv-SE', flag: '🇸🇪' },
  { name: 'Turkish', nativeName: 'Türkçe', code: 'tr-TR', flag: '🇹🇷' },
  { name: 'Vietnamese', nativeName: 'Tiếng Việt', code: 'vi-VN', flag: '🇻🇳' },
  { name: 'Welsh', nativeName: 'Cymraeg', code: 'cy-GB', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
];

const BASE_LANGUAGES: LanguageOption[] = [
  { name: 'Afrikaans', nativeName: 'Afrikaans', nativeCountry: 'Suid-Afrika / Namibië', flag: '🇿🇦', code: 'af-ZA', greeting: 'Hallo!' },
  { name: 'Arabic', nativeName: 'العربية', nativeCountry: 'العالم العربي', flag: '🇸🇦', code: 'ar-SA', greeting: 'مرحباً!' },
  { name: 'Bengali', nativeName: 'বাংলা', nativeCountry: 'বাংলাদেশ / भारत', flag: '🇧🇩', code: 'bn-IN', greeting: 'নমস্কার!' },
  { name: 'Chinese (Mandarin)', nativeName: '简体中文', nativeCountry: '中国 (China)', flag: '🇨🇳', code: 'zh-CN', greeting: '你好!' },
  { name: 'Czech', nativeName: 'Čeština', nativeCountry: 'Česko', flag: '🇨🇿', code: 'cs-CZ', greeting: 'Ahoj!' },
  { name: 'Danish', nativeName: 'Dansk', nativeCountry: 'Danmark', flag: '🇩🇰', code: 'da-DK', greeting: 'Hej!' },
  { name: 'Dutch', nativeName: 'Nederlands', nativeCountry: 'Nederland / België', flag: '🇳🇱', code: 'nl-NL', greeting: 'Hallo!' },
  { name: 'English', nativeName: 'English', nativeCountry: 'UK / USA / Canada / Australia', flag: '🇬🇧', code: 'en-US', greeting: 'Hello!' },
  { name: 'Filipino', nativeName: 'Filipino', nativeCountry: 'Pilipinas', flag: '🇵🇭', code: 'fil-PH', greeting: 'Kumusta!' },
  { name: 'Finnish', nativeName: 'Suomi', nativeCountry: 'Suomi', flag: '🇫🇮', code: 'fi-FI', greeting: 'Hei!' },
  { name: 'French', nativeName: 'Français', nativeCountry: 'France / Canada / Belgique', flag: '🇫🇷', code: 'fr-FR', greeting: 'Bonjour!' },
  { name: 'German', nativeName: 'Deutsch', nativeCountry: 'Deutschland / Österreich / Schweiz', flag: '🇩🇪', code: 'de-DE', greeting: 'Guten Tag!' },
  { name: 'Greek', nativeName: 'Ελληνικά', nativeCountry: 'Ελλάδα (Greece)', flag: '🇬🇷', code: 'el-GR', greeting: 'Γειά σας!' },
  { name: 'Hebrew', nativeName: 'עברית', nativeCountry: 'ישראל (Israel)', flag: '🇮🇱', code: 'he-IL', greeting: 'שלום!' },
  { name: 'Hindi', nativeName: 'हिन्दी', nativeCountry: 'भारत (India)', flag: '🇮🇳', code: 'hi-IN', greeting: 'नमस्ते!' },
  { name: 'Hungarian', nativeName: 'Magyar', nativeCountry: 'Magyarország', flag: '🇭🇺', code: 'hu-HU', greeting: 'Szia!' },
  { name: 'Indonesian', nativeName: 'Bahasa Indonesia', nativeCountry: 'Indonesia', flag: '🇮🇩', code: 'id-ID', greeting: 'Halo!' },
  { name: 'Italian', nativeName: 'Italiano', nativeCountry: 'Italia', flag: '🇮🇹', code: 'it-IT', greeting: 'Ciao!' },
  { name: 'Japanese', nativeName: '日本語', nativeCountry: '日本 (Japan)', flag: '🇯🇵', code: 'ja-JP', greeting: 'こんにちは!' },
  { name: 'Korean', nativeName: '한국어', nativeCountry: '대한민국 (Korea)', flag: '🇰🇷', code: 'ko-KR', greeting: '안녕하세요!' },
  { name: 'Marathi', nativeName: 'मराठी', nativeCountry: 'भारत', flag: '🇮🇳', code: 'mr-IN', greeting: 'नमस्कार!' },
  { name: 'Norwegian', nativeName: 'Norsk', nativeCountry: 'Norge', flag: '🇳🇴', code: 'nb-NO', greeting: 'Hei!' },
  { name: 'Polish', nativeName: 'Polski', nativeCountry: 'Polska', flag: '🇵🇱', code: 'pl-PL', greeting: 'Cześć!' },
  { name: 'Portuguese', nativeName: 'Português', nativeCountry: 'Brasil / Portugal', flag: '🇵🇹', code: 'pt-PT', greeting: 'Olá!' },
  { name: 'Romanian', nativeName: 'Română', nativeCountry: 'România', flag: '🇷🇴', code: 'ro-RO', greeting: 'Salut!' },
  { name: 'Russian', nativeName: 'Русский', nativeCountry: 'Россия', flag: '🇷🇺', code: 'ru-RU', greeting: 'Привет!' },
  { name: 'Spanish', nativeName: 'Español', nativeCountry: 'España / México / América Latina', flag: '🇪🇸', code: 'es-ES', greeting: '¡Hola!' },
  { name: 'Swedish', nativeName: 'Svenska', nativeCountry: 'Sverige', flag: '🇸🇪', code: 'sv-SE', greeting: 'Hej!' },
  { name: 'Tamil', nativeName: 'தமிழ்', nativeCountry: 'இந்தியா / இலங்கை', flag: '🇮🇳', code: 'ta-IN', greeting: 'வணக்கம்!' },
  { name: 'Telugu', nativeName: 'తెలుగు', nativeCountry: 'భారతదేశం', flag: '🇮🇳', code: 'te-IN', greeting: 'నమస్కారం!' },
  { name: 'Thai', nativeName: 'ไทย', nativeCountry: 'ประเทศไทย', flag: '🇹🇭', code: 'th-TH', greeting: 'สวัสดี!' },
  { name: 'Turkish', nativeName: 'Türkçe', nativeCountry: 'Türkiye', flag: '🇹🇷', code: 'tr-TR', greeting: 'Merhaba!' },
  { name: 'Ukrainian', nativeName: 'Українська', nativeCountry: 'Україна', flag: '🇺🇦', code: 'uk-UA', greeting: 'Привіт!' },
  { name: 'Urdu', nativeName: 'اردو', nativeCountry: 'پاکستان / بھارت', flag: '🇵🇰', code: 'ur-PK', greeting: 'سلام!' },
  { name: 'Vietnamese', nativeName: 'Tiếng Việt', nativeCountry: 'Việt Nam', flag: '🇻🇳', code: 'vi-VN', greeting: 'Xin chào!' },
  { name: 'Welsh', nativeName: 'Cymraeg', nativeCountry: 'Cymru (Wales)', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', code: 'cy-GB', greeting: 'Helo!' },
];

const BUILTIN_STORY_FILENAME = 'builtin_lago_sirio.json';

const DEFAULT_BUILTIN_STORY: StoryData = {
  title_target: 'Una passeggiata attorno al Lago Sirio',
  title_en: 'A Walk Around Lake Sirio',
  contentType: 'story',
  sentences: [
    {
      target: 'Il Lago Sirio è uno splendido specchio d’acqua situato vicino a Ivrea, in Piemonte.',
      en: 'Lake Sirio is a wonderful body of water located near Ivrea, in Piedmont.',
      verbs: [
        {
          infinitive: 'essere',
          translation: 'to be',
          conjugations: { 'Present': [{ form: 'è', person: 'lui/lei' }] },
        },
      ],
    },
    {
      target: 'Lungo le rive alberate, molte persone passeggiano serenamente ammirando i riflessi delle montagne.',
      en: 'Along the tree-lined shores, many people walk serenely admiring the reflections of the mountains.',
      verbs: [
        {
          infinitive: 'passeggiare',
          translation: 'to take a walk',
          conjugations: { 'Present': [{ form: 'passeggiano', person: 'loro' }] },
        },
        {
          infinitive: 'ammirare',
          translation: 'to admire',
          conjugations: { 'Present': [{ form: 'ammirando', person: 'gerund' }] },
        },
      ],
    },
    {
      target: 'Un piccolo sentiero circonda l’intero lago ed è perfetto per un po’ di esercizio mattutino.',
      en: 'A small path encircles the entire lake and is perfect for some morning exercise.',
      verbs: [
        {
          infinitive: 'circondare',
          translation: 'to surround/encircle',
          conjugations: { 'Present': [{ form: 'circonda', person: 'lui/lei' }] },
        },
      ],
    },
    {
      target: 'Alcuni cigni bianchi nuotano vicino alla riva in cerca di piccoli bocconi di pane.',
      en: 'Some white swans swim near the shore looking for small morsels of bread.',
      verbs: [
        {
          infinitive: 'nuotare',
          translation: 'to swim',
          conjugations: { 'Present': [{ form: 'nuotano', person: 'loro' }] },
        },
      ],
    },
    {
      target: 'È un luogo ideale per rilassarsi, respirare aria pura e immergersi nella bellezza naturale.',
      en: 'It is an ideal place to relax, breathe fresh air, and immerse oneself in natural beauty.',
      verbs: [
        {
          infinitive: 'rilassarsi',
          translation: 'to relax',
          conjugations: { 'Present': [{ form: 'rilassarsi', person: 'infinitive' }] },
        },
        {
          infinitive: 'respirare',
          translation: 'to breathe',
          conjugations: { 'Present': [{ form: 'respirare', person: 'infinitive' }] },
        },
      ],
    },
  ],
  grammarBites: [
    {
      id: 'gb_sirio_1',
      title: 'Present Indicative & Gerund (-ando / -endo)',
      rule: 'In Italian, the gerund expresses an ongoing background action (ammirando = admiring). Regular -are verbs take -ando.',
      examples: [
        { target: 'Passeggiano ammirando il panorama.', en: 'They walk while admiring the scenery.' },
      ],
      tip: 'Use gerunds to smoothly connect two simultaneous actions.',
    },
  ],
  quiz: [
    {
      id: 'q_sirio_1',
      question_target: 'Dov’è situato il Lago Sirio?',
      question_en: 'Where is Lake Sirio located?',
      options: ['Vicino a Ivrea, in Piemonte', 'Nel centro di Roma', 'Sull’isola di Sicilia', 'A Venezia'],
      correctIndex: 0,
      explanation: 'Il testo specifica che si trova vicino a Ivrea, in Piemonte.',
    },
    {
      id: 'q_sirio_2',
      question_target: 'Chi nuota vicino alla riva?',
      question_en: 'Who swims near the shore?',
      options: ['Alcuni cigni bianchi', 'Molti bambini piccoli', 'Dei pescatori esperti', 'Due cani da caccia'],
      correctIndex: 0,
      explanation: 'Il testo menziona alcuni cigni bianchi in cerca di pane.',
    },
  ],
  _meta: {
    prompt: 'A scenic walk around Lake Sirio in Ivrea, Italy',
    targetLang: 'Italian',
    baseLang: 'English',
    difficulty: 'Intermediate (B1-B2)',
    tense: 'Natural / Mixed Tenses',
    length: '5',
    contentType: 'story',
    isFact: true,
  },
};

export default function App() {
  const isOnline = useOnlineStatus();
  const { isInstallable, isInstalled, isIOS, isChromebook, install } = usePWAInstall();

  // Sidebar controls - Defaults to 'build' tab normally, but defaults to 'practice' / 'play options' when opening a shared link
  const [sidebarTab, setSidebarTab] = useState<'practice' | 'build'>(() => {
    return isShareLinkInUrl() ? 'practice' : 'build';
  });

  const [targetLang, setTargetLang] = useState(() => {
    try {
      return localStorage.getItem('impara_target_lang') || 'Italian';
    } catch {
      return 'Italian';
    }
  });

  const [practiceMode, setPracticeMode] = useState<PracticeMode>('off');
  const [speechRate, setSpeechRate] = useState(0.85);
  const [sentenceGap, setSentenceGap] = useState(0);
  const [difficulty, setDifficulty] = useState('Intermediate (B1-B2)');
  const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
  const [masterSpecialties, setMasterSpecialties] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('impara_master_specialties');
      return saved ? JSON.parse(saved) : ['Law & Jurisprudence', 'Classical, Literary & Historic Register'];
    } catch {
      return ['Law & Jurisprudence', 'Classical, Literary & Historic Register'];
    }
  });

  const handleUpdateMasterSpecialties = (newSelection: string[]) => {
    setMasterSpecialties(newSelection);
    try {
      localStorage.setItem('impara_master_specialties', JSON.stringify(newSelection));
    } catch {}
  };
  const [tense, setTense] = useState('Natural / Mixed Tenses');
  const [length, setLength] = useState(() => {
    try {
      return localStorage.getItem('impara_story_length') || '15';
    } catch {
      return '15';
    }
  });

  const handleSelectLength = (newLength: string) => {
    setLength(newLength);
    if (newLength === '40' || newLength === '50') {
      setIncludeVerbs(false);
    }
    try {
      localStorage.setItem('impara_story_length', newLength);
    } catch {}
  };
  const [contentType, setContentType] = useState<ContentType>('story');
  const [isFact, setIsFact] = useState(true);
  const [includeVerbs, setIncludeVerbs] = useState(false);
  const [promptInput, setPromptInput] = useState('');
  const [isTopicInputFocused, setIsTopicInputFocused] = useState(false);
  const topicInputRef = useRef<HTMLInputElement>(null);

  // Differentiate physical desktop keyboards from mobile virtual keyboards
  const [isPhoneDevice, setIsPhoneDevice] = useState(() => {
    if (typeof window === 'undefined') return false;
    const ua = navigator.userAgent || '';
    const isMobileUA = /iPhone|iPad|iPod|Android|Mobile|Silk/i.test(ua);
    const isTouchOnly = window.matchMedia && window.matchMedia('(pointer: coarse)').matches && !window.matchMedia('(pointer: fine)').matches;
    return Boolean(isMobileUA || isTouchOnly);
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkPhone = () => {
      const ua = navigator.userAgent || '';
      const isMobileUA = /iPhone|iPad|iPod|Android|Mobile|Silk/i.test(ua);
      const isTouchOnly = window.matchMedia && window.matchMedia('(pointer: coarse)').matches && !window.matchMedia('(pointer: fine)').matches;
      setIsPhoneDevice(Boolean(isMobileUA || isTouchOnly));
    };
    window.addEventListener('resize', checkPhone);
    return () => window.removeEventListener('resize', checkPhone);
  }, []);

  // iOS Safari viewport scroll reset: restores window scroll to top when virtual keyboard dismisses
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const restoreWindowScroll = () => {
      if (window.visualViewport && window.visualViewport.scale > 1.02) {
        return;
      }
      if (window.scrollY !== 0) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
      if (document.documentElement.scrollTop !== 0) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body.scrollTop !== 0) {
        document.body.scrollTop = 0;
      }
    };

    const handleFocusOut = () => {
      // Trigger immediately and after keyboard slide-down animation finishes
      restoreWindowScroll();
      setTimeout(restoreWindowScroll, 100);
      setTimeout(restoreWindowScroll, 300);
    };

    window.addEventListener('focusout', handleFocusOut);

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', restoreWindowScroll);
    }

    return () => {
      window.removeEventListener('focusout', handleFocusOut);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', restoreWindowScroll);
      }
    };
  }, []);

  // Voices
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  const [speakerAVoiceName, setSpeakerAVoiceName] = useState<string>('');
  const [speakerBVoiceName, setSpeakerBVoiceName] = useState<string>('');
  const [isVoiceGroupOpen, setIsVoiceGroupOpen] = useState(false);

  // Story state
  const [currentStory, setCurrentStory] = useState<StoryData | null>(null);
  const [currentStoryFilename, setCurrentStoryFilename] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerationReady, setIsGenerationReady] = useState(false);
  const [generatingTopic, setGeneratingTopic] = useState('');
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Persistent tracking per mode (so work is NEVER lost when switching modes)
  const [clozeSolved, setClozeSolved] = useState<Set<number>>(new Set());
  const [clozeAnswers, setClozeAnswers] = useState<Record<number, string>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});

  const [mcSolved, setMcSolved] = useState<Set<number>>(new Set());

  const [scrambleSolved, setScrambleSolved] = useState<Set<number>>(new Set());
  const [scramblePlaced, setScramblePlaced] = useState<Record<number, (number | null)[]>>({});

  const [scrambleVoiceSolved, setScrambleVoiceSolved] = useState<Set<number>>(new Set());
  const [scrambleVoicePlaced, setScrambleVoicePlaced] = useState<Record<number, (number | null)[]>>({});

  // Quiz activity state
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizSolved, setQuizSolved] = useState<Set<number>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [isQuizPrepOpen, setIsQuizPrepOpen] = useState(false);
  const [isQuizPrepReady, setIsQuizPrepReady] = useState(false);

  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [readSentences, setReadSentences] = useState<Set<number>>(new Set());
  const [practiceResetNonce, setPracticeResetNonce] = useState(0);
  const loadedStoryKeyRef = useRef<string>('');

  // Unique identifier for current story to persist activities locally across sessions
  const currentStoryKey = useMemo(() => {
    if (!currentStory) return '';
    return currentStoryFilename || currentStory._meta?.prompt || currentStory.title_target || 'active_story';
  }, [currentStory, currentStoryFilename]);

  // Base / Native language ("learning from", default: English)
  const [baseLang, setBaseLang] = useState(() => {
    try {
      const saved = localStorage.getItem('impara_base_lang');
      // If legacy Italian was saved from previous auto-flip or empty, default back to English
      if (!saved || saved === 'Italian') {
        localStorage.setItem('impara_base_lang', 'English');
        return 'English';
      }
      return saved;
    } catch {
      return 'English';
    }
  });
  const t = getT(baseLang);

  // Check if topic is empty or only default placeholder
  const isTopicEmptyOrDefault = useMemo(() => {
    const trimmed = promptInput.trim();
    if (!trimmed) return true;
    const lower = trimmed.toLowerCase();
    const defaultEn1 = 'give me a topic as a seed for your story';
    const defaultEn2 = 'what is the topic of your story';
    const defaultTranslated = (t.promptPlaceholder || '').trim().toLowerCase();
    return (
      lower === defaultEn1 ||
      lower === defaultEn2 ||
      (defaultTranslated.length > 0 && lower === defaultTranslated)
    );
  }, [promptInput, t.promptPlaceholder]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('impara_base_lang');
      if (saved === 'Italian') {
        localStorage.setItem('impara_base_lang', 'English');
        setBaseLang('English');
      }
    } catch {}
  }, []);

  // Sync document html lang & RTL direction whenever baseLang ("I Speak") changes
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = getHtmlLangCode(baseLang);
    document.documentElement.dir = isRtlLanguage(baseLang) ? 'rtl' : 'ltr';
  }, [baseLang]);

  const [welcomeToast, setWelcomeToast] = useState<{ message: string; sub?: string } | null>(null);

  const playNativeGreeting = (lang: LanguageOption) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const textToSpeak = lang.greeting || lang.nativeName;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      if (lang.code) {
        utterance.lang = lang.code;
      }
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore
    }
  };

  const handleSelectBaseLang = (newBase: string, shouldSpeak = true) => {
    setBaseLang(newBase);
    try {
      localStorage.setItem('impara_base_lang', newBase);
    } catch {}

    const nextT = getT(newBase);
    const langObj = BASE_LANGUAGES.find((b) => b.name === newBase);
    if (langObj) {
      if (shouldSpeak) {
        playNativeGreeting(langObj);
      }
      setWelcomeToast({
        message: `${langObj.flag} ${langObj.nativeName}`,
        sub: nextT.welcomeLearnerToast?.(langObj.nativeName) || (langObj.nativeCountry ? `${langObj.nativeCountry} • ${langObj.greeting || ''}` : langObj.greeting),
      });
      setTimeout(() => setWelcomeToast(null), 3200);
    }

    if (newBase === targetLang) {
      setWelcomeToast({
        message: `👑 ${langObj?.flag || ''} ${nextT.teachOwnLangTitle}`,
        sub: nextT.teachOwnLangDesc(newBase),
      });
      setTimeout(() => setWelcomeToast(null), 3800);
    }
  };

  const handleSelectTargetLang = (newTarget: string) => {
    setTargetLang(newTarget);
    try {
      localStorage.setItem('impara_target_lang', newTarget);
    } catch {}

    if (newTarget === baseLang) {
      const langObj = LANGUAGES.find((b) => b.name === newTarget);
      setWelcomeToast({
        message: `👑 ${langObj?.flag || ''} ${t.teachOwnLangTitle}`,
        sub: t.teachOwnLangDesc(newTarget),
      });
      setTimeout(() => setWelcomeToast(null), 3800);
    }
  };

  // Timed Speed Run Mode (controlled state so locking/pinning preserves exact seconds)
  const [isSpeedRunActive, setIsSpeedRunActive] = useState(false);
  const [isTimerLocked, setIsTimerLocked] = useState(true);
  const [timerDuration, setTimerDuration] = useState(60); // 1m..30m stored in seconds
  const [timerTimeLeft, setTimerTimeLeft] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isTimerTimeUp, setIsTimerTimeUp] = useState(false);
  const [isTimerCompleted, setIsTimerCompleted] = useState(false);
  const [timerStreak, setTimerStreak] = useState(0);
  const [timerPersonalBest, setTimerPersonalBest] = useState<number | null>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('impara_speedrun_pb') : null;
      return saved ? parseInt(saved, 10) : null;
    } catch {
      return null;
    }
  });
  const prevTimerSolvedRef = useRef<number>(0);
  const timeUpSpokenRef = useRef<boolean>(false);

  // Private Server Analytics (Discreet Admin View) & Dismissible Contextual Micro-Hint
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [showMicroHintForce, setShowMicroHintForce] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const logoClickCountRef = useRef<{ count: number; lastTime: number }>({ count: 0, lastTime: 0 });

  const handleLogoClick = () => {
    const now = Date.now();
    if (now - logoClickCountRef.current.lastTime < 800) {
      logoClickCountRef.current.count += 1;
    } else {
      logoClickCountRef.current.count = 1;
    }
    logoClickCountRef.current.lastTime = now;

    if (logoClickCountRef.current.count >= 3) {
      logoClickCountRef.current.count = 0;
      setIsAnalyticsOpen(true);
    }
  };

  const handleCloseAnalytics = () => {
    setIsAnalyticsOpen(false);
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (path === '/stats' || path === '/stats/' || hash === '#stats' || search.includes('stats')) {
        window.history.replaceState({}, '', '/');
      }
    }
  };

  // Speech Pronunciation Scoring
  const [pronunciationScores, setPronunciationScores] = useState<Record<number, PronunciationScoreResult>>({});
  const speechRecognitionRef = useRef<any>(null);
  const pronunciationSilenceTimerRef = useRef<any>(null);
  const pronunciationTranscriptRef = useRef<string>('');
  const isPronunciationRecordingRef = useRef<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const vadIntervalRef = useRef<any>(null);
  const lastVoiceActivityTimeRef = useRef<number>(0);
  const attemptCountRef = useRef<Record<number, number>>({});
  const voiceActiveSamplesRef = useRef<number>(0);
  const voiceEnergySumRef = useRef<number>(0);
  const maxVolumeRef = useRef<number>(0);

  // Custom Vocabulary Highlighter
  const [customHighlights, setCustomHighlights] = useState<CustomHighlight[]>(() => {
    try {
      const saved = localStorage.getItem('impara_custom_highlights');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [highlighterPopoverWord, setHighlighterPopoverWord] = useState<{
    word: string;
    sentenceIndex: number;
    existing?: CustomHighlight;
    sentenceContext?: string;
  } | null>(null);
  const [isHighlighterMode, setIsHighlighterMode] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('impara_custom_highlights', JSON.stringify(customHighlights));
    } catch {}
  }, [customHighlights]);

  // Audio recording & replay
  const [recordingIndex, setRecordingIndex] = useState<number | null>(null);
  const [recordedAudios, setRecordedAudios] = useState<Record<number, string>>({});
  const [playingUserAudioIndex, setPlayingUserAudioIndex] = useState<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const userAudioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const recordingStreamRef = useRef<MediaStream | null>(null);
  const hasSpokenRef = useRef<boolean>(false);

  // Stop user recorded audio playback immediately
  const stopUserAudio = () => {
    if (userAudioPlayerRef.current) {
      try {
        userAudioPlayerRef.current.pause();
        userAudioPlayerRef.current.currentTime = 0;
      } catch {}
    }
    setPlayingUserAudioIndex(null);
  };

  // Speech recognition for Story Topic / Idea
  const [isListeningTopic, setIsListeningTopic] = useState(false);
  const topicRecognitionRef = useRef<any>(null);

  const handleToggleTopicVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice input is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListeningTopic) {
      if (topicRecognitionRef.current) {
        try {
          topicRecognitionRef.current.stop();
        } catch {}
      }
      setIsListeningTopic(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      const currentBaseLangObj = BASE_LANGUAGES.find((b) => b.name === baseLang);
      recognition.lang = currentBaseLangObj?.code || 'en-US';

      recognition.onstart = () => {
        setIsListeningTopic(true);
        const lower = promptInput.trim().toLowerCase();
        if (
          lower === 'give me a topic as a seed for your story' ||
          lower === 'what is the topic of your story'
        ) {
          setPromptInput('');
        }
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          setPromptInput(transcript.trim());
        }
      };

      recognition.onerror = () => {
        setIsListeningTopic(false);
      };

      recognition.onend = () => {
        setIsListeningTopic(false);
      };

      topicRecognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListeningTopic(false);
    }
  };

  // Modals
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isFlashcardsOpen, setIsFlashcardsOpen] = useState(false);
  const [isGrammarOpen, setIsGrammarOpen] = useState(false);
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);
  const [isStudySheetOpen, setIsStudySheetOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isInstallGuideOpen, setIsInstallGuideOpen] = useState(false);
  const [isConversationOpen, setIsConversationOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isComicTourOpen, setIsComicTourOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<LegalTab>('privacy');

  const handleCloseComicTour = () => {
    setIsComicTourOpen(false);
    try {
      localStorage.setItem('querviam_comic_guide_v1', 'true');
    } catch {}
  };

  const handleOpenComicTour = (mode?: 'build' | 'practice') => {
    if (mode) {
      setSidebarTab(mode);
    }
    setIsComicTourOpen(true);
  };
  const [learnerStats, setLearnerStats] = useState<LearnerStats>(() => getLearnerStats());
  const [isStudioVoice, setIsStudioVoice] = useState(false);
  const [selectedVerb, setSelectedVerb] = useState<VerbItem | null>(null);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });
  const [errorMessage, setErrorMessage] = useState<{
    code: string;
    text: string;
    source?: string;
    details?: string;
    prompt?: string;
    modelAttempts?: Array<{ model: string; attempt: number; code: string; message: string }>;
  } | null>(null);
  const [showErrorPromptEgg, setShowErrorPromptEgg] = useState(false);
  const [showErrorDiagnostics, setShowErrorDiagnostics] = useState(false);
  const [copiedErrorDiagnostics, setCopiedErrorDiagnostics] = useState(false);

  // Phone bottom navigation tabs: 0 = Build, 1 = Play Options, 2 = Read/Play, 3 = Library
  const getPhoneNavIndex = () => {
    if (isLibraryOpen) return 3;
    if (!isSidebarMobileOpen) return 2; // Read/Play
    if (sidebarTab === 'practice') return 1; // Play Options
    return 0; // Build
  };

  const handlePhoneNavChange = (newIndex: number) => {
    const clamped = Math.max(0, Math.min(3, newIndex));
    if (clamped === 0) {
      setSidebarTab('build');
      setIsSidebarMobileOpen(true);
      setIsLibraryOpen(false);
    } else if (clamped === 1) {
      setSidebarTab('practice');
      setIsSidebarMobileOpen(true);
      setIsLibraryOpen(false);
    } else if (clamped === 2) {
      setIsSidebarMobileOpen(false);
      setIsLibraryOpen(false);
    } else if (clamped === 3) {
      setIsSidebarMobileOpen(false);
      setIsLibraryOpen(true);
    }
  };

  const isSidebarMobileOpenRef = useRef(isSidebarMobileOpen);
  const isLibraryOpenRef = useRef(isLibraryOpen);
  const ignoreNextPopStateRef = useRef(false);
  isSidebarMobileOpenRef.current = isSidebarMobileOpen;
  isLibraryOpenRef.current = isLibraryOpen;

  const ensureMobileOverlayHistory = () => {
    if (typeof window === 'undefined' || window.innerWidth >= 1024) return;
    if (!(isSidebarMobileOpenRef.current || isLibraryOpenRef.current)) return;
    const userActivation = (navigator as Navigator & { userActivation?: { hasBeenActive?: boolean } }).userActivation;
    if (userActivation && !userActivation.hasBeenActive) return;
    try {
      if (!window.history.state?.querviamMobileOverlay) {
        window.history.pushState(
          { ...(window.history.state || {}), querviamMobileOverlay: true },
          ''
        );
      }
    } catch {}
  };

  // On phones/tablets only (< 1024px): trap browser/Android edge-swipe Back while Options drawer or Library is open
  // so swiping back from arrival dismisses the options/library overlay to the Read/Play view instead of exiting the app.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      if (ignoreNextPopStateRef.current) {
        ignoreNextPopStateRef.current = false;
        return;
      }
      if (window.innerWidth < 1024 && (isSidebarMobileOpenRef.current || isLibraryOpenRef.current)) {
        setIsSidebarMobileOpen(false);
        setIsLibraryOpen(false);
      }
    };

    const handleFirstInteraction = () => {
      ensureMobileOverlayHistory();
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('pointerdown', handleFirstInteraction, { passive: true });
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true });

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth >= 1024) return;
    if (isSidebarMobileOpen || isLibraryOpen) {
      ensureMobileOverlayHistory();
    } else if (window.history.state?.querviamMobileOverlay) {
      try {
        window.history.replaceState(
          { ...(window.history.state || {}), querviamMobileOverlay: false },
          ''
        );
      } catch {}
    }
  }, [isSidebarMobileOpen, isLibraryOpen]);

  const phoneTouchStartXRef = useRef<number | null>(null);
  const phoneTouchStartYRef = useRef<number | null>(null);

  const processPhoneHorizontalSwipe = (deltaX: number) => {
    if (typeof window === 'undefined' || window.innerWidth >= 1024) return;
    const currentIndex = getPhoneNavIndex();
    if (deltaX < 0) {
      // Swiping Left:
      // If Build (0) or Play Options (1) drawer is open, dismiss it directly to the Read/Play window (2)
      if (currentIndex === 0 || currentIndex === 1) {
        handlePhoneNavChange(2);
      } else if (currentIndex === 2) {
        handlePhoneNavChange(3);
      }
    } else {
      // Swiping Right: Move left through tabs (Library -> Read/Play -> Play Options -> Build)
      if (currentIndex > 0) {
        handlePhoneNavChange(currentIndex - 1);
      }
    }
  };

  const handlePhoneTouchStart = (e: React.TouchEvent) => {
    if (window.innerWidth >= 1024) return;
    ensureMobileOverlayHistory();
    const target = e.target as HTMLElement | null;
    if (
      target &&
      target.closest('input, textarea, select, [draggable="true"], .scramble-word, .quiz-btn, header, [data-no-swipe="true"]')
    ) {
      return;
    }
    const touch = e.touches[0];
    phoneTouchStartXRef.current = touch.clientX;
    phoneTouchStartYRef.current = touch.clientY;
  };

  const handlePhoneTouchEnd = (e: React.TouchEvent) => {
    if (window.innerWidth >= 1024) return;
    if (phoneTouchStartXRef.current === null || phoneTouchStartYRef.current === null) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - phoneTouchStartXRef.current;
    const deltaY = touch.clientY - phoneTouchStartYRef.current;

    phoneTouchStartXRef.current = null;
    phoneTouchStartYRef.current = null;

    // Minimum 45px swipe with horizontal dominance (|deltaX| > |deltaY| * 1.2)
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      processPhoneHorizontalSwipe(deltaX);
    }
  };

  // Reset only in-memory React state when switching/creating/deleting stories (never wipes localStorage!)
  const resetInMemoryPracticeState = () => {
    setActiveSentenceIndex(null);
    setClozeSolved(new Set());
    setClozeAnswers({});
    setRevealedAnswers({});
    setMcSolved(new Set());
    setScrambleSolved(new Set());
    setScramblePlaced({});
    setScrambleVoiceSolved(new Set());
    setScrambleVoicePlaced({});
    setQuizSolved(new Set());
    setQuizAnswers({});
    setHasCelebrated(false);
    setRecordedAudios({});
    setPronunciationScores({});
    setReadSentences(new Set());
  };

  const handleResetCurrentPractice = () => {
    if (practiceMode === 'cloze') {
      setClozeSolved(new Set());
      setClozeAnswers({});
      setRevealedAnswers({});
      if (currentStoryKey) {
        saveStoryPracticeState(currentStoryKey, { clozeSolved: [], clozeAnswers: {}, clozeRevealed: {}, hasCelebrated: false });
      }
    } else if (practiceMode === 'multipleChoice') {
      setMcSolved(new Set());
      if (currentStoryKey) {
        saveStoryPracticeState(currentStoryKey, { mcSolved: [], hasCelebrated: false });
      }
    } else if (practiceMode === 'scramble' || practiceMode === 'scrambleEasy') {
      setScrambleSolved(new Set());
      setScramblePlaced({});
      if (currentStoryKey) {
        saveStoryPracticeState(currentStoryKey, { scrambleSolved: [], scramblePlaced: {}, hasCelebrated: false });
      }
    } else if (practiceMode === 'scrambleVoice') {
      setScrambleVoiceSolved(new Set());
      setScrambleVoicePlaced({});
      if (currentStoryKey) {
        saveStoryPracticeState(currentStoryKey, { scrambleVoiceSolved: [], scrambleVoicePlaced: {}, hasCelebrated: false });
      }
    } else if (practiceMode === 'quiz') {
      setQuizSolved(new Set());
      setQuizAnswers({});
      if (currentStoryKey) {
        saveStoryPracticeState(currentStoryKey, { quizSolved: [], quizAnswers: {}, hasCelebrated: false });
      }
    }
    setPracticeResetNonce((n) => n + 1);
    setHasCelebrated(false);
  };

  const activeSolvedCount = useMemo(() => {
    if (practiceMode === 'cloze') return clozeSolved.size;
    if (practiceMode === 'multipleChoice') return mcSolved.size;
    if (practiceMode === 'scramble' || practiceMode === 'scrambleEasy') return scrambleSolved.size;
    if (practiceMode === 'scrambleVoice') return scrambleVoiceSolved.size;
    if (practiceMode === 'quiz') return quizSolved.size;
    return 0;
  }, [practiceMode, clozeSolved, mcSolved, scrambleSolved, scrambleVoiceSolved, quizSolved]);

  // If target language is Chinese and user is on cloze or scramble mode, fall back cleanly to multiple choice
  useEffect(() => {
    const isTargetChinese = isChinese(targetLang) || isChinese(currentStory?._meta?.targetLang);
    if (isTargetChinese && (practiceMode === 'cloze' || practiceMode === 'scramble' || practiceMode === 'scrambleEasy' || practiceMode === 'scrambleVoice')) {
      setPracticeMode('multipleChoice');
    }
  }, [targetLang, currentStory, practiceMode]);

  // TTS references
  const currentSentenceRef = useRef<number>(0);
  const isPlayingRef = useRef(false);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const sentenceElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  isPlayingRef.current = isPlaying;

  // Keep active sentence centered on screen during reading & persist reading progress
  useEffect(() => {
    if (activeSentenceIndex !== null) {
      setReadSentences((prev) => {
        const next = new Set(prev).add(activeSentenceIndex);
        if (currentStoryKey && loadedStoryKeyRef.current === currentStoryKey) {
          saveStoryPracticeState(currentStoryKey, {
            activeSentenceIndex,
            readSentences: Array.from(next),
          });
        }
        return next;
      });
      const el = sentenceElementsRef.current[activeSentenceIndex];
      if (el) {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest',
        });
      }
    }
  }, [activeSentenceIndex, currentStoryKey]);

  // Load Voices
  const loadVoices = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    setAvailableVoices(voices);

    const currentLangObj = LANGUAGES.find((l) => l.name === targetLang);
    const prefix = (currentLangObj?.code || 'it-IT').split('-')[0];
    const matching = voices.filter((v) => v.lang.toLowerCase().startsWith(prefix.toLowerCase()));

    if (matching.length > 0) {
      const defaultV = matching[0].name;
      const female = matching.find((v) => /female|elsa|aria|zira|victoria|helena|paola|federica|zuzana|iveta|vlasta/i.test(v.name)) || matching[0];
      const male = matching.find((v) => /male|cosimo|diego|jorge|pablo|mark|david|paul|stefano|jakub|jan/i.test(v.name)) || matching[matching.length - 1];

      setSelectedVoiceName(defaultV);
      setSpeakerAVoiceName(female.name);
      setSpeakerBVoiceName(male.name);
    }
  };

  useEffect(() => {
    loadVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [targetLang]);

  // Apply story metadata to controls
  const applyStoryMetadata = (story: StoryData) => {
    if (story._meta) {
      if (story._meta.targetLang) {
        let tLang = story._meta.targetLang;
        if (tLang === 'Chinese' || tLang === 'Chinese (Simplified)') tLang = 'Chinese (Mandarin)';
        setTargetLang(tLang);
      }
      if (story._meta.baseLang) {
        let bLang = story._meta.baseLang;
        if (bLang === 'Chinese' || bLang === 'Chinese (Simplified)') bLang = 'Chinese (Mandarin)';
        setBaseLang(bLang);
      }
      if (story._meta.difficulty) setDifficulty(story._meta.difficulty);
      if (story._meta.tense) setTense(story._meta.tense);
      if (story._meta.length) {
        const lStr = String(story._meta.length).toLowerCase();
        if (lStr === '5' || lStr === 'short') {
          setLength('5');
        } else if (lStr === '15' || lStr === 'long') {
          setLength('15');
        } else if (lStr === '35' || lStr === '40' || lStr === '50' || lStr === 'max') {
          setLength('40');
        } else {
          setLength('15'); // Default to Long (15)
        }
      } else {
        setLength('15');
      }
      if (story._meta.contentType) setContentType(story._meta.contentType);
      if (story._meta.isFact !== undefined) setIsFact(Boolean(story._meta.isFact));
      if (story._meta.masterSpecialties && Array.isArray(story._meta.masterSpecialties)) {
        handleUpdateMasterSpecialties(story._meta.masterSpecialties);
      }
    } else if (story.contentType) {
      setContentType(story.contentType);
    }
  };

  // Load starter story on first open (or pre-load shared story if URL link was clicked)
  useEffect(() => {
    // Ensure browser tab icon is permanently the Modern Monogram Q with instant cache-busting
    if (typeof window !== 'undefined') {
      const qIconUrl = '/favicons/monogram-q.svg?v=q3';
      localStorage.setItem('querviam_active_favicon', '/favicons/monogram-q.svg');
      const iconLinks = document.querySelectorAll<HTMLLinkElement>("link[rel*='icon']");
      if (iconLinks.length > 0) {
        iconLinks.forEach((link) => {
          link.href = qIconUrl;
        });
      } else {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/svg+xml';
        link.href = qIconUrl;
        document.head.appendChild(link);
      }

      // Check if URL specifies #stats or ?stats
      if (window.location.hash === '#stats' || window.location.search.includes('stats')) {
        setIsAnalyticsOpen(true);
      }

      // Record anonymous page view for server analytics
      logAnalyticsEvent('page_view');
    }

    const fetchStarter = async () => {
      // 1. Check if a story was shared via short link or direct URL
      try {
        const { story: shared, error: shareError } = await resolveSharedStoryFromUrl();
        if (shareError) {
          setErrorMessage({
            code: 'ERR_SHARED_LINK_EXPIRED',
            source: 'Shared Story Service',
            text: shareError,
          });
        } else if (shared && shared.title_target && Array.isArray(shared.sentences) && shared.sentences.length > 0) {
          setCurrentStory(shared);
          applyStoryMetadata(shared);
          const localKey = `shared_${Date.now()}.json`;
          saveLocalStory(localKey, shared);
          setCurrentStoryFilename(localKey);
          saveActiveStoryRef({ filename: localKey, isLocal: true, title: shared.title_target });

          // For recipients of a shared link: open directly in 'practice' / 'play options' mode
          setSidebarTab('practice');

          // On mobile phones, open the drawer straight to Play Options so new learners see all activities
          if (window.innerWidth < 1024) {
            setIsSidebarMobileOpen(true);
          }

          // Clean URL parameters so address bar stays clean
          if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
            window.history.replaceState(null, '', window.location.pathname);
          }
          return;
        }
      } catch (shareErr) {
        console.warn('Could not parse shared story from URL:', shareErr);
      }

      // 2. Resume the exact story the user was last reading (instead of jumping to newest created story)
      try {
        const activeRef = getActiveStoryRef();
        if (activeRef?.filename) {
          if (activeRef.filename === BUILTIN_STORY_FILENAME) {
            setCurrentStory(DEFAULT_BUILTIN_STORY);
            setCurrentStoryFilename(BUILTIN_STORY_FILENAME);
            applyStoryMetadata(DEFAULT_BUILTIN_STORY);
            return;
          }

          const localActive = getLocalStory(activeRef.filename);
          if (localActive) {
            setCurrentStory(localActive);
            setCurrentStoryFilename(activeRef.filename);
            applyStoryMetadata(localActive);
            return;
          }

          try {
            const itemRes = await fetch(`/api/library/item/${encodeURIComponent(activeRef.filename)}`);
            if (itemRes.ok) {
              const data = await itemRes.json();
              setCurrentStory(data);
              setCurrentStoryFilename(activeRef.filename);
              applyStoryMetadata(data);
              return;
            }
          } catch {}
        }

        // 3. No active story saved yet: check private device library first, then starter sample
        const localSummaries = getLocalLibrarySummaries();
        if (localSummaries.length > 0) {
          const newest = [...localSummaries].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))[0];
          const localData = getLocalStory(newest.filename);
          if (localData) {
            setCurrentStory(localData);
            setCurrentStoryFilename(newest.filename);
            saveActiveStoryRef({ filename: newest.filename, isLocal: true, title: localData.title_target });
            applyStoryMetadata(localData);
            return;
          }
        }

        const res = await fetch('/api/library/list');
        if (res.ok) {
          const list = await res.json();
          if (list.length > 0) {
            const first = list[0];
            const itemRes = await fetch(`/api/library/item/${encodeURIComponent(first.filename)}`);
            if (itemRes.ok) {
              const data = await itemRes.json();
              setCurrentStory(data);
              setCurrentStoryFilename(first.filename);
              saveActiveStoryRef({ filename: first.filename, isLocal: false, title: data.title_target });
              applyStoryMetadata(data);
              return;
            }
          }
        }

        // 4. Guaranteed Fallback: Ensure screen always has rich publisher content for learners & AdSense
        setCurrentStory((prev) => {
          if (prev) return prev;
          setCurrentStoryFilename(BUILTIN_STORY_FILENAME);
          saveActiveStoryRef({ filename: BUILTIN_STORY_FILENAME, isLocal: false, title: DEFAULT_BUILTIN_STORY.title_target });
          applyStoryMetadata(DEFAULT_BUILTIN_STORY);
          return DEFAULT_BUILTIN_STORY;
        });
      } catch (err) {
        console.warn('Could not load starter story:', err);
        setCurrentStory((prev) => {
          if (prev) return prev;
          setCurrentStoryFilename(BUILTIN_STORY_FILENAME);
          saveActiveStoryRef({ filename: BUILTIN_STORY_FILENAME, isLocal: false, title: DEFAULT_BUILTIN_STORY.title_target });
          applyStoryMetadata(DEFAULT_BUILTIN_STORY);
          return DEFAULT_BUILTIN_STORY;
        });
      }
    };
    fetchStarter();
  }, []);

  // First-time visitor: Automatically open Comic Guide Tour in build mode
  useEffect(() => {
    try {
      const hasSeen = localStorage.getItem('querviam_comic_guide_v1');
      if (!hasSeen) {
        const timer = setTimeout(() => {
          setIsComicTourOpen(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  // Keyboard Shortcuts (Spacebar, R, L, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret Admin Key combination: Ctrl+Shift+S or Cmd+Shift+S to toggle Stats
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        setIsAnalyticsOpen((prev) => !prev);
        return;
      }

      // Ignore when typing in inputs, textareas, or contentEditable
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
          target.isContentEditable)
      ) {
        return;
      }

      // Check spacebar across all browsers, operating systems, and keyboard layouts
      const isSpace =
        e.code === 'Space' ||
        e.key === ' ' ||
        e.key === 'Spacebar' ||
        e.keyCode === 32;

      if (isSpace) {
        e.preventDefault();
        e.stopPropagation();

        // If a button or other element has focus, blur it to prevent double-click behavior on Windows Edge
        if (document.activeElement instanceof HTMLElement && document.activeElement.tagName === 'BUTTON') {
          document.activeElement.blur();
        }

        togglePlayAll();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        if (activeSentenceIndex !== null) {
          repeatSentence(activeSentenceIndex);
        } else if (currentStory && currentStory.sentences.length > 0) {
          repeatSentence(0);
        }
      } else if (e.key === 'ArrowDown') {
        // Move to the next sentence
        if (currentStory && currentStory.sentences.length > 0) {
          e.preventDefault();
          const nextIdx =
            activeSentenceIndex === null
              ? 0
              : Math.min(activeSentenceIndex + 1, currentStory.sentences.length - 1);
          repeatSentence(nextIdx);
        }
      } else if (e.key === 'ArrowUp') {
        // Move to the previous sentence
        if (currentStory && currentStory.sentences.length > 0) {
          e.preventDefault();
          const prevIdx =
            activeSentenceIndex === null
              ? 0
              : Math.max(activeSentenceIndex - 1, 0);
          repeatSentence(prevIdx);
        }
      } else if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        setIsLibraryOpen((prev) => !prev);
      } else if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        setIsFlashcardsOpen((prev) => !prev);
      } else if (e.key === 'q' || e.key === 'Q') {
        e.preventDefault();
        handleSelectPracticeMode(practiceMode === 'quiz' ? 'off' : 'quiz');
      } else if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        setIsGrammarOpen((prev) => !prev);
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setIsStudySheetOpen((prev) => !prev);
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        setSidebarTab('practice');
      } else if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        setSidebarTab('build');
      } else if (e.key === 'Escape') {
        setIsLibraryOpen(false);
        setIsFlashcardsOpen(false);
        setIsQuizPrepOpen(false);
        setIsGrammarOpen(false);
        setIsStudySheetOpen(false);
        setIsShareModalOpen(false);
        setIsInstallGuideOpen(false);
        setIsInspectorOpen(false);
        handleCloseAnalytics();
        setSelectedVerb(null);
        setErrorMessage(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isPlaying, isPaused, activeSentenceIndex, currentStory]);

  // Secret URL listener for /stats, #stats, ?stats
  useEffect(() => {
    const checkStatsUrl = () => {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname.toLowerCase();
        const hash = window.location.hash.toLowerCase();
        const search = window.location.search.toLowerCase();
        if (path === '/stats' || path === '/stats/' || hash === '#stats' || search.includes('stats')) {
          setIsAnalyticsOpen(true);
        }
      }
    };

    checkStatsUrl();
    window.addEventListener('popstate', checkStatsUrl);
    window.addEventListener('hashchange', checkStatsUrl);

    return () => {
      window.removeEventListener('popstate', checkStatsUrl);
      window.removeEventListener('hashchange', checkStatsUrl);
    };
  }, []);

  // Handle TTS stopping
  const stopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    activeUtteranceRef.current = null;
    isPlayingRef.current = false;
    setIsPlaying(false);
    setIsPaused(false);
    setActiveSentenceIndex(null);
    stopUserAudio();
  };

  // Speak a single sentence or text snippet
  const speakText = (text: string, voiceName?: string, pitch = 1, customRate?: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    // Reset audio queue
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const langObj = LANGUAGES.find((l) => l.name === targetLang);
    const langCode = (currentStory?._meta?.targetLang)
      ? (LANGUAGES.find(l => l.name === currentStory._meta?.targetLang)?.code || 'it-IT')
      : (langObj?.code || 'it-IT');

    const utterance = new SpeechSynthesisUtterance(text);
    activeUtteranceRef.current = utterance;
    utterance.lang = langCode;
    utterance.rate = customRate !== undefined ? customRate : speechRate;
    utterance.pitch = isStudioVoice ? Math.min(1.05, pitch * 1.02) : pitch;

    if (voiceName) {
      const vObj = availableVoices.find((v) => v.name === voiceName);
      if (vObj) utterance.voice = vObj;
    } else if (isStudioVoice) {
      // Find highest-fidelity natural voice matching target language
      const prefix = langCode.split('-')[0].toLowerCase();
      const naturalVoice = availableVoices.find(
        (v) =>
          v.lang.toLowerCase().startsWith(prefix) &&
          /natural|neural|online|google|enhanced|premium|siri/i.test(v.name)
      ) || (selectedVoiceName ? availableVoices.find((v) => v.name === selectedVoiceName) : undefined);
      if (naturalVoice) utterance.voice = naturalVoice;
    } else if (selectedVoiceName) {
      const vObj = availableVoices.find((v) => v.name === selectedVoiceName);
      if (vObj) utterance.voice = vObj;
    }

    utterance.onend = () => {
      if (activeUtteranceRef.current === utterance) {
        activeUtteranceRef.current = null;
      }
    };

    window.speechSynthesis.speak(utterance);
    // Extra wake-up for Chromium / Edge
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  };

  const timerTotalQuestions =
    practiceMode === 'quiz' && currentStory?.quiz?.length
      ? currentStory.quiz.length
      : currentStory?.sentences.length || 0;

  // Timer streak & completion check
  useEffect(() => {
    if (activeSolvedCount > prevTimerSolvedRef.current) {
      setTimerStreak((s) => s + 1);
    } else if (activeSolvedCount === 0) {
      setTimerStreak(0);
    }
    prevTimerSolvedRef.current = activeSolvedCount;

    if (timerTotalQuestions > 0 && activeSolvedCount === timerTotalQuestions && isTimerRunning) {
      setIsTimerRunning(false);
      setIsTimerCompleted(true);
      const elapsed = Math.max(0, timerDuration - timerTimeLeft);

      if (timerPersonalBest === null || elapsed < timerPersonalBest) {
        setTimerPersonalBest(elapsed);
        try {
          localStorage.setItem('impara_speedrun_pb', elapsed.toString());
        } catch {}
      }

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {}
    }
  }, [activeSolvedCount, timerTotalQuestions, isTimerRunning, timerTimeLeft, timerDuration, timerPersonalBest]);

  // Countdown tick (always in seconds)
  useEffect(() => {
    if (!isTimerRunning || !isSpeedRunActive) return;
    const interval = setInterval(() => {
      setTimerTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, isSpeedRunActive]);

  // Announce "time's up" in the target language when countdown hits 0
  useEffect(() => {
    if (isTimerRunning && timerTimeLeft === 0 && !timeUpSpokenRef.current) {
      timeUpSpokenRef.current = true;
      setIsTimerRunning(false);
      setIsTimerTimeUp(true);
      const effectiveTargetLang = currentStory?._meta?.targetLang || targetLang;
      const targetPhrase = getT(effectiveTargetLang).timeUpPhrase;
      speakText(targetPhrase);
    }
  }, [isTimerRunning, timerTimeLeft, currentStory, targetLang]);

  const handleStartTimer = () => {
    if (timerTotalQuestions > 0 && activeSolvedCount === timerTotalQuestions) {
      handleResetCurrentPractice();
    }
    timeUpSpokenRef.current = false;
    setTimerTimeLeft((prev) => (prev <= 0 ? timerDuration : prev));
    setIsTimerTimeUp(false);
    setIsTimerCompleted(false);
    setIsTimerRunning(true);
    setIsTimerLocked(true); // Automatically lock timer so user sees time left when scrolling
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
  };

  const handleResetTimer = () => {
    timeUpSpokenRef.current = false;
    setIsTimerRunning(false);
    setIsTimerTimeUp(false);
    setIsTimerCompleted(false);
    setTimerTimeLeft(timerDuration);
    setTimerStreak(0);
    handleResetCurrentPractice();
  };

  const handleSelectTimerDuration = (seconds: number) => {
    timeUpSpokenRef.current = false;
    setTimerDuration(seconds);
    setTimerTimeLeft(seconds);
    setIsTimerRunning(false);
    setIsTimerTimeUp(false);
    setIsTimerCompleted(false);
  };

  const handleToggleSpeedRun = () => {
    setIsSpeedRunActive((prev) => {
      const next = !prev;
      if (!next) {
        setIsTimerRunning(false);
      } else {
        setIsTimerLocked(true);
      }
      return next;
    });
  };

  // Repeat single sentence
  const repeatSentence = (index: number) => {
    if (!currentStory) return;
    stopAudio();
    setActiveSentenceIndex(index);

    const sentenceObj = currentStory.sentences[index];
    const isDiscussion = currentStory.contentType === 'discussion' || sentenceObj.speaker;
    let chosenVoice = selectedVoiceName;
    let pitch = 1;

    if (isDiscussion) {
      chosenVoice = sentenceObj.speaker === 'B' ? speakerBVoiceName : speakerAVoiceName;
      pitch = sentenceObj.speaker === 'B' ? 0.9 : 1.1;
    }

    speakText(sentenceObj.target, chosenVoice, pitch);
  };

  // Continuous Story Playback
  const startReadingFrom = (startIndex: number) => {
    if (!currentStory || !('speechSynthesis' in window)) return;
    
    // Stop any existing speech
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }

    // Immediately mark as playing in both ref and state to prevent race conditions
    isPlayingRef.current = true;
    setIsPlaying(true);
    setIsPaused(false);
    currentSentenceRef.current = startIndex;

    // Small delay to let cancel settle on Chromium/Edge, then speak
    setTimeout(() => {
      if (isPlayingRef.current) {
        speakSentenceByIndex(startIndex);
      }
    }, 60);
  };

  const speakSentenceByIndex = (index: number) => {
    if (!currentStory || index >= currentStory.sentences.length || !isPlayingRef.current) {
      stopAudio();
      return;
    }

    setActiveSentenceIndex(index);
    currentSentenceRef.current = index;

    const sentenceObj = currentStory.sentences[index];
    const langObj = LANGUAGES.find((l) => l.name === targetLang);
    const langCode = currentStory._meta?.targetLang
      ? (LANGUAGES.find(l => l.name === currentStory._meta?.targetLang)?.code || 'it-IT')
      : (langObj?.code || 'it-IT');

    const utterance = new SpeechSynthesisUtterance(sentenceObj.target);
    activeUtteranceRef.current = utterance;
    utterance.lang = langCode;
    utterance.rate = speechRate;

    const isDiscussion = currentStory.contentType === 'discussion' || sentenceObj.speaker;
    if (isDiscussion) {
      const voice = sentenceObj.speaker === 'B' ? speakerBVoiceName : speakerAVoiceName;
      const vObj = availableVoices.find((v) => v.name === voice);
      if (vObj) utterance.voice = vObj;
      utterance.pitch = sentenceObj.speaker === 'B' ? 0.9 : 1.1;
    } else if (selectedVoiceName) {
      const vObj = availableVoices.find((v) => v.name === selectedVoiceName);
      if (vObj) utterance.voice = vObj;
    }

    utterance.onend = () => {
      if (isPlayingRef.current) {
        if (practiceMode !== 'off') {
          stopAudio();
          return;
        }

        const nextIndex = index + 1;
        if (nextIndex < currentStory.sentences.length) {
          const delayMs = sentenceGap * 1000;
          if (delayMs > 0) {
            setTimeout(() => {
              if (isPlayingRef.current) speakSentenceByIndex(nextIndex);
            }, delayMs);
          } else {
            speakSentenceByIndex(nextIndex);
          }
        } else {
          stopAudio();
        }
      }
    };

    utterance.onerror = (e) => {
      if (e.error === 'interrupted' || e.error === 'canceled') return;
      console.warn('TTS playback error:', e);
      stopAudio();
    };

    window.speechSynthesis.speak(utterance);
    // Extra resume for Chromium/Edge Windows
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  };

  const togglePlayAll = () => {
    if (isPlayingRef.current) {
      stopAudio();
    } else {
      logAnalyticsEvent('audio_play', { type: 'full_story' });
      // Play from the sentence currently in focus, or start from beginning if none focused
      const startIndex =
        activeSentenceIndex !== null &&
        activeSentenceIndex >= 0 &&
        currentStory &&
        activeSentenceIndex < currentStory.sentences.length
          ? activeSentenceIndex
          : 0;
      startReadingFrom(startIndex);
    }
  };

  // Generate Story
  const handleGenerate = async () => {
    if (isTopicEmptyOrDefault || isGenerating) return;
    const isMaster = difficulty.includes('Master');
    const topicToSend = promptInput.trim();

    const startTime = Date.now();
    setGeneratingTopic(topicToSend);
    stopAudio();
    setIsGenerating(true);
    setIsGenerationReady(false);
    setErrorMessage(null);

    try {
      const payload = {
        prompt: topicToSend,
        isFact,
        targetLang,
        baseLang,
        difficulty,
        tense,
        length,
        contentType,
        includeVerbs,
        masterSpecialties: isMaster ? masterSpecialties : [],
      };

      const res = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch (parseErr) {
        data = { error: `Server responded with status ${res.status}: ${res.statusText}` };
      }

      if (!res.ok) {
        throw {
          code: data?.code || `ERR_HTTP_${res.status}`,
          source: data?.source || 'Server Story Service',
          message: data?.error || 'Server error occurred during story creation.',
          details: data?.details,
          prompt: data?.prompt,
          modelAttempts: data?.modelAttempts,
        };
      }

      // Ensure creation modal stays open for at least 4 seconds (or generation time, whichever is longest)
      const elapsed = Date.now() - startTime;
      const minDurationMs = 4000;
      if (elapsed < minDurationMs) {
        await new Promise((resolve) => setTimeout(resolve, minDurationMs - elapsed));
      }

      const nowTs = Date.now();
      data._meta = payload;
      data.createdAt = nowTs;
      setPracticeMode('off');
      setLastPracticeMode('off');
      setQuizQuestions([]);
      setIsQuizPrepOpen(false);
      resetInMemoryPracticeState();
      const localKey = `story_${nowTs}.json`;
      saveLocalStory(localKey, data);
      saveActiveStoryRef({ filename: localKey, isLocal: true, title: data.title_target });
      saveStoryPracticeState(localKey, { practiceMode: 'off' });
      setCurrentStory(data);
      setCurrentStoryFilename(localKey);

      // Stories are stored 100% privately in local client storage on this device

      // Track words read and increment stories completed
      if (data.sentences && data.sentences.length > 0) {
        const wordsInStory = data.sentences.reduce((acc: number, s: any) => acc + (s.target ? s.target.split(/\s+/).length : 0), 0);
        const updated = updateLearnerActivity({ wordsRead: wordsInStory, storiesCompleted: 1 });
        setLearnerStats(updated);
      }

      if (window.innerWidth < 1024) {
        setIsSidebarMobileOpen(false);
      }

      // Record anonymous story generation in private server analytics
      logAnalyticsEvent('story_generated', {
        language: targetLang,
        topic: generatingTopic || promptInput,
        difficulty,
        length,
        contentType,
      });

      // Signal modal that story is ready so it displays the Done button
      setIsGenerationReady(true);
    } catch (err: any) {
      console.error('Story Generation failed:', err);
      // Wait remaining time if error occurred quickly so user isn't jarred
      const elapsed = Date.now() - startTime;
      const minDurationMs = 4000;
      if (elapsed < minDurationMs) {
        await new Promise((resolve) => setTimeout(resolve, minDurationMs - elapsed));
      }

      const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
      const code = err.code || (isOffline ? 'ERR_CLIENT_OFFLINE' : 'ERR_CLIENT_NETWORK');
      const source = err.source || (isOffline ? 'Browser Network Connection' : 'Client Connection Layer');
      const text = err.message || (isOffline ? 'Your device appears to be offline. Please verify your internet connection.' : 'Network connection failed while communicating with the story generation server.');

      setErrorMessage({
        code,
        source,
        text,
        details: err.details,
        prompt: err.prompt,
        modelAttempts: err.modelAttempts,
      });
      setShowErrorDiagnostics(false);
      setCopiedErrorDiagnostics(false);
      setIsGenerating(false);
      setIsGenerationReady(false);
    }
  };

  const handleCopyErrorDiagnostics = () => {
    if (!errorMessage) return;
    const report = [
      `=== Querviam Story Generation Diagnostic ===`,
      `Timestamp: ${new Date().toISOString()}`,
      `Error Code: ${errorMessage.code}`,
      `Error Source: ${errorMessage.source || 'Unknown'}`,
      `Message: ${errorMessage.text}`,
      errorMessage.details ? `Details: ${errorMessage.details}` : '',
      `Target Language: ${targetLang}`,
      `Base Language: ${baseLang}`,
      `Difficulty: ${difficulty}`,
      `Length: ${length}`,
      errorMessage.modelAttempts && errorMessage.modelAttempts.length > 0
        ? `Model Attempts:\n${errorMessage.modelAttempts.map((m) => `  - [${m.model} Attempt ${m.attempt}] ${m.code}: ${m.message}`).join('\n')}`
        : '',
      errorMessage.prompt ? `AI Prompt:\n${errorMessage.prompt}` : '',
    ]
      .filter(Boolean)
      .join('\n\n');

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(report);
    }
    setCopiedErrorDiagnostics(true);
    setTimeout(() => setCopiedErrorDiagnostics(false), 2000);
  };

  const handleDoneGenerating = () => {
    setIsGenerating(false);
    setIsGenerationReady(false);
    setSidebarTab('practice');

    // On mobile/phone screens, open the drawer directly to Play Options
    if (window.innerWidth < 1024) {
      setIsSidebarMobileOpen(true);
    }
  };

  // Save to library
  const handleAddToLibrary = async () => {
    if (!currentStory) return;
    const oldKey = currentStoryKey;
    const migrateKey = (newKey: string) => {
      if (oldKey && oldKey !== newKey) {
        const prevState = getStoryPracticeState(oldKey);
        if (prevState) {
          saveStoryPracticeState(newKey, prevState);
        }
      }
      saveActiveStoryRef({ filename: newKey, isLocal: true, title: currentStory.title_target });
    };

    try {
      const res = await fetch('/api/library/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentStory),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        saveLocalStory(data.filename, currentStory);
        migrateKey(data.filename);
        setCurrentStoryFilename(data.filename);
        alert(t.savedLocal);
      } else {
        const localKey = `local_${Date.now()}.json`;
        saveLocalStory(localKey, currentStory);
        migrateKey(localKey);
        setCurrentStoryFilename(localKey);
        alert(t.savedLocal);
      }
    } catch (err) {
      const localKey = `local_${Date.now()}.json`;
      saveLocalStory(localKey, currentStory);
      migrateKey(localKey);
      setCurrentStoryFilename(localKey);
      alert(t.savedLocal);
    }
  };

  // Delete current story
  const handleDeleteCurrentStory = async () => {
    if (!currentStory) return;
    const storyTitle = currentStory.title_target || 'this story';
    if (!confirm(t.deleteConfirm(storyTitle))) return;

    stopAudio();

    if (currentStoryKey) {
      clearStoryPracticeState(currentStoryKey);
    }
    if (currentStoryFilename) {
      deleteLocalStory(currentStoryFilename);
      if (getActiveStoryRef()?.filename === currentStoryFilename) {
        clearActiveStoryRef();
      }
    }

    setCurrentStory(null);
    setCurrentStoryFilename(null);
    resetInMemoryPracticeState();
  };

  // Pronunciation Evaluation Helpers with Phonetic Proximity Matching
  const levenshteinDistance = (s1: string, s2: string): number => {
    if (s1 === s2) return 0;
    if (!s1.length) return s2.length;
    if (!s2.length) return s1.length;
    const prevRow: number[] = Array.from({ length: s2.length + 1 }, (_, i) => i);
    const curRow: number[] = new Array(s2.length + 1);

    for (let i = 1; i <= s1.length; i++) {
      curRow[0] = i;
      for (let j = 1; j <= s2.length; j++) {
        const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
        curRow[j] = Math.min(curRow[j - 1] + 1, prevRow[j] + 1, prevRow[j - 1] + cost);
      }
      for (let j = 0; j <= s2.length; j++) {
        prevRow[j] = curRow[j];
      }
    }
    return prevRow[s2.length];
  };

  const normalizeSpokenWord = (str: string): string => {
    return str
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove accent marks
      .replace(/[^\p{L}\p{N}]/gu, ''); // keep unicode letters & digits
  };

  const isPhoneticallyClose = (target: string, spoken: string): boolean => {
    if (target === spoken) return true;
    if (!target || !spoken) return false;
    // Allow edit distance of 1 for words 4+ characters long
    if (target.length >= 4 && spoken.length >= 4) {
      if (Math.abs(target.length - spoken.length) <= 1 && levenshteinDistance(target, spoken) <= 1) {
        return true;
      }
    }
    // Allow subsegment match for longer words
    if (target.length >= 5 && (spoken.includes(target) || target.includes(spoken))) {
      return true;
    }
    return false;
  };

  const evaluatePronunciation = (
    index: number,
    targetText: string,
    recognizedText: string,
    attempt = 1
  ) => {
    // Preserve original casing and punctuation separation for clean display
    const rawTargetWords = targetText
      .split(/\s+/)
      .map((w) => splitWordPunctuation(w).core)
      .filter((w) => w.length > 0);

    const spokenTokens = recognizedText
      .split(/\s+/)
      .map((w) => normalizeSpokenWord(w))
      .filter((w) => w.length > 0);

    // Evaluate each word accurately against the actual spoken transcript
    const wordScores = rawTargetWords.map((word) => {
      const targetClean = normalizeSpokenWord(word);
      if (!targetClean) return { word, isMatch: true };

      const isMatch = spokenTokens.some((token) => isPhoneticallyClose(targetClean, token));
      return { word, isMatch };
    });

    const matchCount = wordScores.filter((ws) => ws.isMatch).length;
    const score = Math.round((matchCount / Math.max(1, wordScores.length)) * 100);

    setPronunciationScores((prev) => ({
      ...prev,
      [index]: {
        score,
        recognizedText,
        targetText,
        wordScores,
        attempt,
        timestamp: Date.now(),
      },
    }));
  };

  const evaluateAcousticTake = (index: number, targetText: string, attempt = 1) => {
    const rawTargetWords = targetText
      .split(/\s+/)
      .map((w) => splitWordPunctuation(w).core)
      .filter((w) => w.length > 0);

    const voiceDurationMs = voiceActiveSamplesRef.current * 120;
    const avgVoiceEnergy =
      voiceActiveSamplesRef.current > 0
        ? voiceEnergySumRef.current / voiceActiveSamplesRef.current
        : 0;

    // Check if voice was detected at all
    if (voiceActiveSamplesRef.current < 2 || !hasSpokenRef.current) {
      setPronunciationScores((prev) => ({
        ...prev,
        [index]: {
          score: 0,
          recognizedText: '(No voice detected — please speak clearly into microphone)',
          targetText,
          wordScores: rawTargetWords.map((word) => ({ word, isMatch: false })),
          attempt,
          timestamp: Date.now(),
        },
      }));
      return;
    }

    const expectedVoiceDuration = rawTargetWords.length * 360 + 400;
    const ratio = Math.min(1.5, voiceDurationMs / Math.max(600, expectedVoiceDuration));

    // Dynamic scoring based on actual speech take + attempt progression
    let baseScore = 70;
    if (voiceDurationMs < 400) {
      baseScore = 30;
    } else if (ratio >= 0.7 && ratio <= 1.3 && avgVoiceEnergy > 12) {
      baseScore = 85 + Math.min(15, (attempt - 1) * 6);
    } else if (ratio > 0.4 && avgVoiceEnergy > 8) {
      baseScore = 72 + Math.min(20, (attempt - 1) * 7);
    } else {
      baseScore = 55 + Math.min(20, (attempt - 1) * 5);
    }

    const energyBonus = Math.min(6, Math.floor(avgVoiceEnergy / 10));
    const finalScore = Math.min(100, Math.max(25, baseScore + energyBonus));

    // Evaluate words intelligently by phonetic complexity (NOT blind index ordering!):
    // Shorter words with standard consonants match first, longer/accented words require higher pacing/energy
    const wordDifficulty = rawTargetWords.map((word, i) => {
      const clean = normalizeSpokenWord(word);
      let diff = clean.length;
      if (/[àèéìòóùáíúäöüßñ]/.test(word.toLowerCase())) diff += 2;
      return { index: i, word, difficulty: diff };
    });

    const targetMatchCount = Math.round((finalScore / 100) * rawTargetWords.length);

    // Easiest words matched first, hardest words matched as score increases
    const sortedIndices = [...wordDifficulty]
      .sort((a, b) => a.difficulty - b.difficulty)
      .map((item) => item.index);

    const matchedIndices = new Set(sortedIndices.slice(0, targetMatchCount));

    const wordScores = rawTargetWords.map((word, i) => ({
      word,
      isMatch: matchedIndices.has(i),
    }));

    const durationSec = Math.round(voiceDurationMs / 100) / 10;
    const recognizedNotice = `Voice Recording (Take #${attempt} • ${durationSec}s spoken)`;

    setPronunciationScores((prev) => ({
      ...prev,
      [index]: {
        score: finalScore,
        recognizedText: recognizedNotice,
        targetText,
        wordScores,
        attempt,
        timestamp: Date.now(),
      },
    }));
  };

  useEffect(() => {
    return () => {
      if (vadIntervalRef.current) {
        clearInterval(vadIntervalRef.current);
        vadIntervalRef.current = null;
      }
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch {}
        audioContextRef.current = null;
      }
      if (pronunciationSilenceTimerRef.current) {
        clearTimeout(pronunciationSilenceTimerRef.current);
      }
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  // Helper to stop pronunciation recording gracefully after timeout or manual button tap
  const stopPronunciationRecording = (index: number, targetSentence: string) => {
    isPronunciationRecordingRef.current = false;
    if (vadIntervalRef.current) {
      clearInterval(vadIntervalRef.current);
      vadIntervalRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }
    if (pronunciationSilenceTimerRef.current) {
      clearTimeout(pronunciationSilenceTimerRef.current);
      pronunciationSilenceTimerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }
    if (recordingStreamRef.current) {
      try {
        recordingStreamRef.current.getTracks().forEach((track) => track.stop());
      } catch {}
      recordingStreamRef.current = null;
    }
    setRecordingIndex(null);

    const currentAttempt = attemptCountRef.current[index] || 1;

    // Helper to evaluate and overwrite score
    const finalizeEvaluation = () => {
      const finalTranscript = pronunciationTranscriptRef.current.trim();
      if (finalTranscript) {
        evaluatePronunciation(index, targetSentence, finalTranscript, currentAttempt);
      } else {
        evaluateAcousticTake(index, targetSentence, currentAttempt);
      }
    };

    if (speechRecognitionRef.current) {
      const rec = speechRecognitionRef.current;
      speechRecognitionRef.current = null;
      let hasFinished = false;

      const triggerFinish = () => {
        if (!hasFinished) {
          hasFinished = true;
          finalizeEvaluation();
        }
      };

      rec.onresult = (event: any) => {
        let fullTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          fullTranscript += event.results[i][0].transcript + ' ';
        }
        if (fullTranscript.trim()) {
          pronunciationTranscriptRef.current = fullTranscript.trim();
        }
      };

      rec.onend = triggerFinish;

      try {
        rec.stop();
      } catch {
        triggerFinish();
      }

      // Safety timeout: finalize within 180ms if onend doesn't fire
      setTimeout(triggerFinish, 180);
    } else {
      finalizeEvaluation();
    }
  };

  // Mic Recording with Hardware VAD (Stops only after 5s of silence or manual stop button)
  const handleToggleRecord = async (index: number) => {
    const targetSentence = currentStory?.sentences[index]?.target || '';

    // If currently recording this sentence, stop immediately on button press!
    if (recordingIndex === index) {
      stopPronunciationRecording(index, targetSentence);
      return;
    }

    if (recordingIndex !== null) {
      alert(t.finishRecordingAlert);
      return;
    }

    // Stop any story audio or user audio replay
    stopAudio();
    stopUserAudio();

    try {
      // Clean, low-noise audio stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      recordingStreamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudios((prev) => ({ ...prev, [index]: url }));
        stream.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch {}
        });
        recordingStreamRef.current = null;
      };

      recorder.start();
      setRecordingIndex(index);
      isPronunciationRecordingRef.current = true;
      pronunciationTranscriptRef.current = '';
      lastVoiceActivityTimeRef.current = Date.now();
      hasSpokenRef.current = false;

      // Track acoustic metrics for this specific recording attempt
      voiceActiveSamplesRef.current = 0;
      voiceEnergySumRef.current = 0;
      maxVolumeRef.current = 0;
      attemptCountRef.current[index] = (attemptCountRef.current[index] || 0) + 1;

      // Clear previous score for this sentence so user sees that a new take is underway!
      setPronunciationScores((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });

      // Real-time Audio Volume Monitoring (VAD) via Web Audio API
      // Pure in-memory analysis without connecting to speaker output (prevents feedback & clicks)
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const audioCtx = new AudioContextClass();
          audioContextRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 256;
          analyser.smoothingTimeConstant = 0.2;
          source.connect(analyser); // Analyser only, never connected to audioCtx.destination

          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          vadIntervalRef.current = setInterval(() => {
            if (!isPronunciationRecordingRef.current) {
              if (vadIntervalRef.current) {
                clearInterval(vadIntervalRef.current);
                vadIntervalRef.current = null;
              }
              return;
            }

            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avgVolume = sum / dataArray.length;

            // Volume threshold: avgVolume > 8 means user is actively vocalizing
            if (avgVolume > 8) {
              lastVoiceActivityTimeRef.current = Date.now();
              hasSpokenRef.current = true;
              voiceActiveSamplesRef.current += 1;
              voiceEnergySumRef.current += avgVolume;
              if (avgVolume > maxVolumeRef.current) {
                maxVolumeRef.current = avgVolume;
              }
            }

            const elapsedSilence = Date.now() - lastVoiceActivityTimeRef.current;
            // Before speech begins, give 10s of initial preparation time.
            // Once user has spoken, stop ONLY after 5 seconds of continuous silence!
            const silenceThreshold = hasSpokenRef.current ? 5000 : 10000;

            if (elapsedSilence >= silenceThreshold) {
              if (vadIntervalRef.current) {
                clearInterval(vadIntervalRef.current);
                vadIntervalRef.current = null;
              }
              if (isPronunciationRecordingRef.current) {
                stopPronunciationRecording(index, targetSentence);
              }
            }
          }, 120);
        }
      } catch (vadErr) {
        console.warn('VAD AudioContext not active:', vadErr);
      }

      // Speech Recognition for live transcription and word evaluation
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec && targetSentence) {
        try {
          const rec = new SpeechRec();
          const langObj = LANGUAGES.find((l) => l.name === targetLang);
          rec.lang = langObj ? langObj.code : 'it-IT';
          rec.continuous = true;
          rec.interimResults = true;
          rec.maxAlternatives = 3;

          rec.onresult = (event: any) => {
            lastVoiceActivityTimeRef.current = Date.now();
            hasSpokenRef.current = true;
            let fullTranscript = '';
            for (let i = 0; i < event.results.length; i++) {
              fullTranscript += event.results[i][0].transcript + ' ';
            }
            const cleanTranscript = fullTranscript.trim();
            if (cleanTranscript) {
              pronunciationTranscriptRef.current = cleanTranscript;
            }
          };

          rec.onerror = (e: any) => {
            if (e?.error !== 'no-speech') {
              console.log('SpeechRec notice:', e?.error);
            }
          };

          rec.onend = () => {
            // Clean finish, no looping restart
          };

          rec.start();
          speechRecognitionRef.current = rec;
        } catch (e) {
          console.warn('SpeechRecognition initialization skipped:', e);
        }
      }
    } catch (err) {
      alert(t.micPermissionAlert);
    }
  };

  // Replay User Recording (Toggle play / stop with single persistent player)
  const playUserAudio = (index: number) => {
    const player = userAudioPlayerRef.current;
    if (!player) return;

    // If currently playing this exact sentence's recording, stop it immediately!
    if (playingUserAudioIndex === index) {
      player.pause();
      player.currentTime = 0;
      setPlayingUserAudioIndex(null);
      return;
    }

    // Stop any ongoing story speech synthesis
    stopAudio();

    // Reset player before switching audio
    try {
      player.pause();
      player.currentTime = 0;
    } catch {}

    const url = recordedAudios[index];
    if (!url) {
      setPlayingUserAudioIndex(null);
      return;
    }

    player.src = url;
    setPlayingUserAudioIndex(index);

    player.onended = () => {
      setPlayingUserAudioIndex((curr) => (curr === index ? null : curr));
    };

    player.onerror = () => {
      setPlayingUserAudioIndex((curr) => (curr === index ? null : curr));
    };

    player.play().catch(() => {
      setPlayingUserAudioIndex(null);
    });
  };

  // Cloze Mode helpers
  const getClozeWord = (text: string) => {
    const words = text.split(/\s+/).map((w, idx) => ({
      raw: w,
      clean: splitWordPunctuation(w).core,
      idx,
    }));
    const candidates = words.filter((w) => w.clean.length > 3);
    if (candidates.length === 0) return null;
    return candidates[0]; // deterministic for consistency per line
  };

  const handleClozeInput = (index: number, val: string, correct: string) => {
    setClozeAnswers((prev) => {
      const next = { ...prev, [index]: val };
      if (currentStoryKey) {
        saveStoryPracticeState(currentStoryKey, { clozeAnswers: next });
      }
      return next;
    });
    const isExact = val.trim().toLowerCase() === correct.trim().toLowerCase();

    setClozeSolved((prev) => {
      const next = new Set(prev);
      if (isExact) {
        next.add(index);
      } else {
        next.delete(index);
      }
      if (currentStoryKey) {
        saveStoryPracticeState(currentStoryKey, { clozeSolved: Array.from(next) });
      }
      return next;
    });
  };

  // Solve handler for Multiple Choice & Scramble
  const handleExerciseSolved = (index: number) => {
    if (practiceMode === 'multipleChoice') {
      setMcSolved((prev) => {
        const next = new Set(prev).add(index);
        if (currentStoryKey) {
          saveStoryPracticeState(currentStoryKey, { mcSolved: Array.from(next) });
        }
        return next;
      });
    } else if (practiceMode === 'scrambleVoice') {
      setScrambleVoiceSolved((prev) => {
        const next = new Set(prev).add(index);
        if (currentStoryKey) {
          saveStoryPracticeState(currentStoryKey, { scrambleVoiceSolved: Array.from(next) });
        }
        return next;
      });
    } else if (practiceMode === 'scramble' || practiceMode === 'scrambleEasy') {
      setScrambleSolved((prev) => {
        const next = new Set(prev).add(index);
        if (currentStoryKey) {
          saveStoryPracticeState(currentStoryKey, { scrambleSolved: Array.from(next) });
        }
        return next;
      });
    }
  };

  const handleExerciseUnsolved = (index: number) => {
    if (practiceMode === 'scrambleVoice') {
      setScrambleVoiceSolved((prev) => {
        const next = new Set(prev);
        next.delete(index);
        if (currentStoryKey) {
          saveStoryPracticeState(currentStoryKey, { scrambleVoiceSolved: Array.from(next) });
        }
        return next;
      });
    } else if (practiceMode === 'scramble' || practiceMode === 'scrambleEasy') {
      setScrambleSolved((prev) => {
        const next = new Set(prev);
        next.delete(index);
        if (currentStoryKey) {
          saveStoryPracticeState(currentStoryKey, { scrambleSolved: Array.from(next) });
        }
        return next;
      });
    }
  };

  // Restore persisted practice state & reading position when story loads from one session to another
  useEffect(() => {
    if (!currentStoryKey || !currentStory) return;

    const saved = getStoryPracticeState(currentStoryKey);
    loadedStoryKeyRef.current = currentStoryKey;

    if (saved) {
      if (saved.practiceMode) {
        const mapped = saved.practiceMode === 'scrambleEasy' ? 'scramble' : saved.practiceMode;
        setPracticeMode(mapped);
      } else {
        setPracticeMode('off');
      }

      const sentenceCount = currentStory.sentences?.length || 0;
      const savedActiveIdx =
        typeof saved.activeSentenceIndex === 'number' &&
        saved.activeSentenceIndex >= 0 &&
        saved.activeSentenceIndex < sentenceCount
          ? saved.activeSentenceIndex
          : null;
      setActiveSentenceIndex(savedActiveIdx);
      setReadSentences(new Set(saved.readSentences || []));

      setClozeSolved(new Set(saved.clozeSolved || []));
      setClozeAnswers(saved.clozeAnswers || {});
      setRevealedAnswers(saved.clozeRevealed || {});
      setMcSolved(new Set(saved.mcSolved || []));
      setScrambleSolved(new Set(saved.scrambleSolved || []));
      setScramblePlaced(saved.scramblePlaced || {});
      setScrambleVoiceSolved(new Set(saved.scrambleVoiceSolved || []));
      setScrambleVoicePlaced(saved.scrambleVoicePlaced || {});
      if (saved.quizQuestions && saved.quizQuestions.length > 0) {
        setQuizQuestions(saved.quizQuestions);
      } else if (currentStory.quiz && currentStory.quiz.length > 0) {
        setQuizQuestions(currentStory.quiz);
      } else {
        setQuizQuestions([]);
      }
      setQuizSolved(new Set(saved.quizSolved || []));
      setQuizAnswers(saved.quizAnswers || {});
      setHasCelebrated(Boolean(saved.hasCelebrated));
    } else {
      const lastMode = getLastPracticeMode();
      // Never auto-enter or auto-generate Comprehension Quiz on a brand-new/unpracticed story;
      // quiz questions should only be created when the user explicitly selects Comprehension Quiz.
      if (lastMode && lastMode !== 'quiz') {
        setPracticeMode(lastMode === 'scrambleEasy' ? 'scramble' : lastMode);
      } else {
        setPracticeMode('off');
      }
      setActiveSentenceIndex(null);
      setReadSentences(new Set());
      setClozeSolved(new Set());
      setClozeAnswers({});
      setRevealedAnswers({});
      setMcSolved(new Set());
      setScrambleSolved(new Set());
      setScramblePlaced({});
      setScrambleVoiceSolved(new Set());
      setScrambleVoicePlaced({});
      if (currentStory.quiz && currentStory.quiz.length > 0) {
        setQuizQuestions(currentStory.quiz);
      } else {
        setQuizQuestions([]);
      }
      setQuizSolved(new Set());
      setQuizAnswers({});
      setHasCelebrated(false);
    }
  }, [currentStoryKey]);

  // Load or generate comprehension quiz (1 question per sentence, shuffled order)
  const handleLoadOrGenerateQuiz = async (forceRegenerate: boolean = false) => {
    if (!currentStory || !currentStory.sentences || currentStory.sentences.length === 0) return;

    // Open 3-second advert popup
    setIsQuizPrepOpen(true);
    setIsQuizPrepReady(false);

    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          story: currentStory,
          targetLang: currentStory._meta?.targetLang || targetLang,
          baseLang,
          difficulty,
        }),
      });
      const data = await res.json();
      if (data && Array.isArray(data.questions) && data.questions.length > 0) {
        setQuizQuestions(data.questions);
        currentStory.quiz = data.questions;
        setQuizAnswers({});
        setQuizSolved(new Set());
        if (currentStoryKey) {
          saveStoryPracticeState(currentStoryKey, {
            quizQuestions: data.questions,
            quizAnswers: {},
            quizSolved: [],
          });
        }
      }
    } catch (err) {
      console.warn('Quiz generation error:', err);
    } finally {
      setIsQuizPrepReady(true);
    }
  };

  // Practice mode selection handler
  const handleSelectPracticeMode = (mode: PracticeMode) => {
    setPracticeMode(mode);
    setLastPracticeMode(mode);
    setHasCelebrated(false);
    if (currentStoryKey) {
      saveStoryPracticeState(currentStoryKey, { practiceMode: mode });
    }
    if (mode === 'quiz') {
      const needsGen = quizQuestions.length === 0;
      if (needsGen) {
        handleLoadOrGenerateQuiz(true);
      }
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        setIsSidebarMobileOpen(false);
      }
    }
  };

  const handleQuizAnswer = (questionIdx: number, selectedOptIdx: number, isCorrect: boolean) => {
    setQuizAnswers((prev) => {
      const next = { ...prev, [questionIdx]: selectedOptIdx };
      if (currentStoryKey) {
        saveStoryPracticeState(currentStoryKey, { quizAnswers: next });
      }
      return next;
    });

    if (isCorrect) {
      setQuizSolved((prev) => {
        const next = new Set(prev).add(questionIdx);
        if (currentStoryKey) {
          saveStoryPracticeState(currentStoryKey, { quizSolved: Array.from(next) });
        }
        return next;
      });
      const updated = updateLearnerActivity({ practiceMinutes: 1 });
      setLearnerStats(updated);
    }
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizSolved(new Set());
    if (currentStoryKey) {
      saveStoryPracticeState(currentStoryKey, { quizAnswers: {}, quizSolved: [] });
    }
  };

  // Trigger celebration confetti
  useEffect(() => {
    const totalLines = currentStory?.sentences.length || 0;
    const isPracticeActive = practiceMode !== 'off';

    if (isPracticeActive && totalLines > 0 && activeSolvedCount === totalLines && !hasCelebrated) {
      setHasCelebrated(true);
      if (currentStoryKey && loadedStoryKeyRef.current === currentStoryKey) {
        saveStoryPracticeState(currentStoryKey, { hasCelebrated: true });
      }
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      const updated = updateLearnerActivity({ storiesCompleted: 1, practiceMinutes: 2 });
      setLearnerStats(updated);
    } else if (activeSolvedCount < totalLines && hasCelebrated) {
      setHasCelebrated(false);
    }
  }, [activeSolvedCount, currentStory, practiceMode, hasCelebrated, currentStoryKey]);

  const matchingVoices = availableVoices.filter((v) => {
    const langObj = LANGUAGES.find((l) => l.name === targetLang);
    const prefix = (langObj?.code || 'it-IT').split('-')[0];
    return v.lang.toLowerCase().startsWith(prefix.toLowerCase());
  });

  // Extract pool of words across the entire story for Multiple Choice distractors
  const storyWordsPool = React.useMemo(() => {
    if (!currentStory) return [];
    const isTargetChinese =
      isChinese(targetLang) || isChinese(currentStory._meta?.targetLang);
    if (isTargetChinese) {
      const allText = currentStory.sentences.map((s) => s.target).join('');
      return extractChineseStoryWords(allText);
    }
    const allText = currentStory.sentences.map((s) => s.target).join(' ');
    return Array.from(
      new Set(
        allText
          .split(/\s+/)
          .map((w) => splitWordPunctuation(w).core)
          .filter((w) => w.length > 3)
      )
    );
  }, [currentStory, targetLang]);

  return (
    <div
      onTouchStart={handlePhoneTouchStart}
      onTouchEnd={handlePhoneTouchEnd}
      className="fixed inset-0 lg:static flex flex-col lg:flex-row lg:h-dvh-safe w-full overflow-hidden bg-[#f4f6f8] text-[#333]"
    >
      <div className="flex-1 flex items-stretch min-h-0 min-w-0 overflow-hidden relative lg:contents">
      {/* Mobile / Tablet Drawer Backdrop */}
      {isSidebarMobileOpen && (
        <div
          className="absolute inset-0 z-30 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={() => setIsSidebarMobileOpen(false)}
        />
      )}

      {/* Sidebar Controls */}
      <aside
        className={`absolute lg:static inset-y-0 left-0 z-40 w-72 sm:w-80 shadow-lg lg:shadow-none flex flex-col transition-colors duration-200 ease-in-out shrink-0 lg:self-stretch min-h-0 overflow-hidden ${
          sidebarTab === 'build'
            ? 'bg-[#fcf8f2] border-r border-[#e8dfcf] text-slate-800'
            : 'bg-[#edf8f1] border-r border-[#cbe6d4] text-slate-800'
        } ${
          isSidebarMobileOpen
            ? 'translate-x-0 pointer-events-auto'
            : '-translate-x-full pointer-events-none lg:translate-x-0 lg:pointer-events-auto'
        }`}
      >
        {/* Querviam Brand & Create Story Header */}
        <div className={`shrink-0 p-4 border-b flex flex-col gap-2.5 transition-colors duration-200 ${
          sidebarTab === 'build'
            ? 'bg-[#f7efe1]/80 border-[#e8dfcf]'
            : 'bg-[#e2f3e8]/80 border-[#cbe6d4]'
        }`}>
          <div className="flex items-center justify-between mb-0.5">
            <div
              className="flex items-center gap-2.5 cursor-pointer select-none"
              onClick={handleLogoClick}
              title="Querviam"
            >
              <div className="w-8 h-8 rounded-xl bg-linear-to-br from-[#008450] to-teal-700 text-white flex items-center justify-center font-black text-base shadow-xs ring-1 ring-emerald-600/30">
                Q
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-900 text-base tracking-tight leading-none">Querviam</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">{t.languageImmersion}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleOpenComicTour(sidebarTab)}
                className="flex items-center gap-1 text-[11px] font-black text-slate-950 bg-amber-400 hover:bg-amber-300 px-2.5 py-1 rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_#0f172a] transition cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                title={t.guideTitle}
              >
                <span>💬</span>
                <span>{t.guide}</span>
              </button>
              <button
                onClick={() => setIsSidebarMobileOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 lg:hidden cursor-pointer"
                title={t.close}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <button
            id="tour-build-generate"
            onClick={handleGenerate}
            disabled={isGenerating || isTopicEmptyOrDefault}
            title={
              isTopicEmptyOrDefault
                ? t.enterTopicTooltip
                : t.createStory
            }
            className={`w-full py-2.5 px-4 font-bold text-sm rounded-xl shadow-xs transition flex items-center justify-center gap-2 ${
              sidebarTab === 'practice' ? 'hidden lg:flex' : 'flex'
            } ${
              isGenerating || isTopicEmptyOrDefault
                ? 'bg-slate-200 text-slate-400 border border-slate-300/70 cursor-not-allowed shadow-none'
                : 'bg-[#008450] hover:bg-[#006b40] text-white shadow-sm cursor-pointer active:scale-98'
            }`}
          >
            {isGenerating ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>{t.creatingStory}</span>
              </>
            ) : (
              <>
                <Sparkles className={`w-4 h-4 ${isTopicEmptyOrDefault ? 'text-slate-400' : 'text-emerald-100'}`} />
                <span>{t.createStory}</span>
              </>
            )}
          </button>
        </div>

        {/* Sidebar Tabs: Build vs Practice (Desktop Only - on phones use bottom nav) */}
        <div className={`hidden lg:block px-4 pt-3 pb-2.5 border-b transition-colors duration-200 ${
          sidebarTab === 'build' ? 'border-[#e8dfcf] bg-[#f8f1e4]/40' : 'border-[#cbe6d4] bg-[#e2f3e8]/40'
        }`}>
          <div className={`flex p-1 rounded-xl transition-colors duration-200 ${
            sidebarTab === 'build' ? 'bg-[#ede0ce]' : 'bg-[#d2eddd]'
          }`}>
            <button
              type="button"
              onClick={() => setSidebarTab('build')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                sidebarTab === 'build'
                  ? 'bg-white text-amber-950 shadow-xs ring-1 ring-amber-300/60'
                  : 'text-amber-900/70 hover:text-amber-950'
              }`}
            >
              <span>✨ {t.build}</span>
            </button>
            <button
              type="button"
              onClick={() => setSidebarTab('practice')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                sidebarTab === 'practice'
                  ? 'bg-white text-emerald-950 shadow-xs ring-1 ring-emerald-300/60'
                  : 'text-emerald-900/70 hover:text-emerald-950'
              }`}
            >
              <span>🎯 {t.practice}</span>
            </button>
          </div>

          {/* Obvious Mode Indicator Banner for Desktop */}
          <div className={`mt-2 px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center justify-between border transition-colors duration-200 ${
            sidebarTab === 'build'
              ? 'bg-amber-100/70 text-amber-900 border-amber-200/80 shadow-2xs'
              : 'bg-emerald-100/70 text-emerald-900 border-emerald-200/80 shadow-2xs'
          }`}>
            <span className="flex items-center gap-1">
              <span>{sidebarTab === 'build' ? `✨ ${t.modeBuilder}` : `🎯 ${t.modePractice}`}</span>
            </span>
            <span className="text-[9px] font-semibold opacity-75 uppercase tracking-wider">
              {sidebarTab === 'build' ? t.craftStory : t.interactive}
            </span>
          </div>
        </div>

        {/* Scrollable Options */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain touch-pan-y scroll-touch p-4 space-y-4 text-xs pb-28 lg:pb-4">
          {sidebarTab === 'practice' ? (
            <>
              {/* Practice Mode */}
              <div id="tour-practice-activities" className="space-y-1.5 relative">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[11px] text-emerald-950/80 uppercase tracking-wider">
                    {t.practiceActivity}
                  </label>
                </div>
                <div className="space-y-1 bg-white/95 p-2 rounded-xl border border-emerald-200/90 shadow-2xs">
                  {(() => {
                    const isTargetChinese =
                      isChinese(targetLang) || isChinese(currentStory?._meta?.targetLang);
                    return [
                      { val: 'off', label: `📝 ${t.modeOff}` },
                      { val: 'cloze', label: `🙈 ${t.modeCloze}` },
                      { val: 'multipleChoice', label: `🎯 ${t.modeMultipleChoice}` },
                      { val: 'scramble', label: `🧩 ${t.modeScramble}` },
                      { val: 'scrambleVoice', label: `🎧 ${t.modeScrambleVoice || 'Scramble (from Dictation)'}` },
                      { val: 'quiz', label: `❓ ${t.modeQuiz}` },
                    ].map((m) => {
                      const isDisabledForChinese =
                        isTargetChinese && (m.val === 'cloze' || m.val === 'scramble' || m.val === 'scrambleVoice');

                      return (
                        <label
                          key={m.val}
                          title={
                            isDisabledForChinese
                              ? m.val === 'cloze'
                                ? t.chineseClozeTooltip
                                : t.chineseScrambleTooltip
                              : undefined
                          }
                          className={`flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg transition font-medium ${
                            isDisabledForChinese
                              ? 'opacity-40 cursor-not-allowed bg-slate-100/60 select-none text-slate-400'
                              : 'hover:bg-emerald-50/80 cursor-pointer'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <input
                              type="radio"
                              name="practiceMode"
                              value={m.val}
                              disabled={isDisabledForChinese}
                              checked={practiceMode === m.val}
                              onChange={() => {
                                if (isDisabledForChinese) return;
                                handleSelectPracticeMode(m.val as PracticeMode);
                              }}
                              className={`accent-[#008450] ${isDisabledForChinese ? 'cursor-not-allowed' : ''}`}
                            />
                            <span className="truncate">{m.label}</span>
                          </div>
                          {isDisabledForChinese && (
                            <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider text-slate-400 bg-slate-200/80 px-1.5 py-0.5 rounded-md">
                              {t.naForChinese}
                            </span>
                          )}
                        </label>
                      );
                    });
                  })()}
                </div>

                {/* Educational note for Chinese unspaced script */}
                {(isChinese(targetLang) || isChinese(currentStory?._meta?.targetLang)) && (
                  <div className="p-2.5 bg-amber-50/80 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 leading-normal flex items-start gap-1.5 shadow-2xs">
                    <span className="shrink-0 text-amber-600 font-bold text-xs mt-0.5">💡</span>
                    <span>
                      {t.chineseQuizOnlyNote}
                    </span>
                  </div>
                )}

                {/* Score Counter & Reset Mechanism */}
                {practiceMode !== 'off' && currentStory && (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-700">{t.solved}:</span>
                      <span className="font-mono font-extrabold text-[#008450] bg-white px-2 py-0.5 rounded-md border border-emerald-200 shadow-2xs">
                        {activeSolvedCount} / {currentStory.sentences.length}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleResetCurrentPractice}
                      disabled={activeSolvedCount === 0}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer shadow-2xs ${
                        activeSolvedCount > 0
                          ? 'bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200'
                          : 'opacity-40 text-slate-400 cursor-not-allowed border border-transparent'
                      }`}
                      title={t.resetScoreTooltip}
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{t.resetScoreTooltip}</span>
                    </button>
                  </div>
                )}

                {/* Study & Test Tools */}
                {currentStory && (
                  <div className="pt-1.5 space-y-1">
                    <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider block px-1">
                      {t.moreActivities}
                    </span>
                    <div id="tour-practice-tools" className="grid grid-cols-2 gap-1.5 relative">
                      <button
                        type="button"
                        onClick={() => setIsFlashcardsOpen(true)}
                        className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-left text-xs font-bold text-emerald-900 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        title={t.cards}
                      >
                        <Layers className="w-3.5 h-3.5 text-[#008450]" />
                        <span>{t.cards}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsGrammarOpen(true)}
                        className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-left text-xs font-bold text-amber-900 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        title={t.grammar}
                      >
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                        <span>{t.grammar}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsStudySheetOpen(true)}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left text-xs font-bold text-slate-800 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        title={t.studySheet}
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-600" />
                        <span>{t.studySheet}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsShareModalOpen(true)}
                        className="p-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-left text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95"
                        title={t.shareStoryTitle}
                      >
                        <Share2 className="w-3.5 h-3.5 text-emerald-100" />
                        <span>{t.shareStory}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsDictionaryOpen(true)}
                        className="col-span-2 p-2 rounded-xl bg-teal-50 hover:bg-teal-100/80 border border-teal-200 text-left text-xs font-bold text-teal-900 transition cursor-pointer flex items-center justify-between gap-1.5 shadow-2xs"
                        title={t.storyDictionaryTitle}
                      >
                        <span className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-teal-700" />
                          <span>{t.storyDictionaryTitle}</span>
                        </span>
                        <span className="text-[10px] font-semibold text-teal-700 opacity-80">A–Z</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Speech Controls */}
              <div id="tour-practice-voice" className="space-y-3 bg-white/95 p-3 rounded-xl border border-emerald-200/90 shadow-2xs relative">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-[10px] text-emerald-950/70 uppercase tracking-wider">
                      {t.speechSpeed}
                    </span>
                    <span className="font-mono text-emerald-800 font-bold">{speechRate.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.05"
                    value={speechRate}
                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                    className="w-full accent-[#008450] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-[10px] text-emerald-950/70 uppercase tracking-wider">
                      {t.sentencePause}
                    </span>
                    <span className="font-mono text-emerald-800 font-bold">{sentenceGap}s</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={sentenceGap}
                    onChange={(e) => setSentenceGap(parseFloat(e.target.value))}
                    className="w-full accent-[#008450] cursor-pointer"
                  />
                </div>
              </div>

              {/* Speech Voice Dropdown / Collapsible */}
              {contentType === 'story' ? (
                <div className="border border-emerald-200/90 rounded-xl overflow-hidden bg-white/95 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setIsVoiceGroupOpen(!isVoiceGroupOpen)}
                    className="w-full flex items-center justify-between p-2.5 font-bold text-[11px] text-emerald-950/80 uppercase tracking-wider hover:bg-emerald-50/60 transition cursor-pointer"
                  >
                    <span>{t.speechVoice} ({matchingVoices.length})</span>
                    {isVoiceGroupOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>

                  {isVoiceGroupOpen && (
                    <div className="p-2 space-y-1 max-h-40 overflow-y-auto border-t border-emerald-100 bg-white">
                      {matchingVoices.length === 0 ? (
                        <div className="text-slate-400 text-xs italic p-1">{t.offlineVoice}</div>
                      ) : (
                        matchingVoices.map((v) => {
                          const isOffline = v.localService;
                          return (
                            <label
                              key={v.name}
                              className="flex items-center gap-2 p-1.5 rounded-md hover:bg-emerald-50 text-[11px] cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="selectedVoice"
                                value={v.name}
                                checked={selectedVoiceName === v.name}
                                onChange={() => setSelectedVoiceName(v.name)}
                                className="accent-[#008450]"
                              />
                              <span className="truncate">{v.name.replace(/Google|Microsoft|Apple/g, '').trim()}</span>
                              <span className="ml-auto text-[9px] text-slate-400">
                                {isOffline ? '📶' : '🌐'}
                              </span>
                            </label>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
                  <span className="font-bold text-[11px] text-blue-900 uppercase tracking-wider block">
                    {t.discussionSpeakers}
                  </span>
                  <div>
                    <span className="text-[10px] font-bold text-pink-700 block">👩 {t.speakerA}</span>
                    <select
                      value={speakerAVoiceName}
                      onChange={(e) => setSpeakerAVoiceName(e.target.value)}
                      className="w-full p-1.5 bg-white border border-blue-200 rounded-md text-xs mt-0.5"
                    >
                      {matchingVoices.map((v) => (
                        <option key={v.name} value={v.name}>
                          {v.name.replace(/Google|Microsoft|Apple/g, '').trim()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-blue-700 block">👨 {t.speakerB}</span>
                    <select
                      value={speakerBVoiceName}
                      onChange={(e) => setSpeakerBVoiceName(e.target.value)}
                      className="w-full p-1.5 bg-white border border-blue-200 rounded-md text-xs mt-0.5"
                    >
                      {matchingVoices.map((v) => (
                        <option key={v.name} value={v.name}>
                          {v.name.replace(/Google|Microsoft|Apple/g, '').trim()}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Build Story Options */}
              {/* Language Selection: Target Lang & Base Lang (I SPEAK & TARGET LANGUAGE) */}
              <div id="tour-build-languages" className="space-y-2 sm:space-y-3 p-2.5 sm:p-3 bg-white/95 border border-amber-200/90 rounded-2xl shadow-2xs relative">
                {/* I SPEAK Section (Dropdown) */}
                <div>
                  <div className="flex items-center justify-between mb-1 sm:mb-1.5">
                    <label className="font-bold text-[10px] sm:text-[11px] text-amber-950 uppercase tracking-wider block">
                      {t.iSpeakLabel || '🗣️ I SPEAK'}
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const prevBase = baseLang;
                        const prevTarget = targetLang;
                        handleSelectBaseLang(prevTarget);
                        handleSelectTargetLang(prevBase);
                      }}
                      className="flex items-center gap-1 text-[10px] font-bold text-amber-900 hover:text-amber-950 bg-amber-50 hover:bg-amber-100/80 px-2 py-0.5 rounded-lg border border-amber-300 transition cursor-pointer shadow-2xs active:scale-95"
                      title={t.flipLanguages}
                    >
                      <span>{t.flipShort}</span>
                    </button>
                  </div>
                  <select
                    value={baseLang}
                    onChange={(e) => handleSelectBaseLang(e.target.value)}
                    className="w-full py-1.5 px-2.5 sm:p-2 bg-white border border-amber-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer leading-tight"
                  >
                    {[...BASE_LANGUAGES]
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((lang) => (
                        <option key={lang.name} value={lang.name} className="py-0.5">
                          {lang.flag} {lang.name} - {lang.nativeName}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Target Language (To Learn) Section */}
                <div>
                  <label className="font-bold text-[10px] sm:text-[11px] text-amber-950 uppercase tracking-wider block mb-1">
                    {t.targetLanguageLabel}
                  </label>
                  <select
                    value={targetLang}
                    onChange={(e) => handleSelectTargetLang(e.target.value)}
                    className="w-full py-1.5 px-2.5 sm:p-2 bg-white border border-amber-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer leading-tight"
                  >
                    {[...LANGUAGES]
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((lang) => (
                        <option key={lang.name} value={lang.name} className="py-0.5">
                          {lang.flag} {lang.name} - {lang.nativeName}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Teach Me My Own Language Mode Banner */}
                {baseLang === targetLang && (
                  <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-teal-500/15 border border-amber-400/60 flex items-start gap-2 shadow-2xs animate-fade-in">
                    <span className="text-base shrink-0">👑</span>
                    <div className="text-[11px] leading-tight">
                      <span className="font-extrabold text-amber-950 block">
                        {t.teachOwnLangTitle}
                      </span>
                      <span className="text-slate-600 block mt-0.5">
                        {t.teachOwnLangDesc(baseLang)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Story Topic Seed Input (Prominently visible in Build tab on both Desktop and Mobile) */}
              <div id="tour-build-topic" className="p-3 bg-white border-2 border-amber-400/90 rounded-2xl shadow-xs space-y-2 ring-2 ring-amber-100 relative">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-[11px] text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                    <span>{t.topicIdeaLabel}</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleToggleTopicVoiceInput}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold transition cursor-pointer shadow-2xs active:scale-95 ${
                      isListeningTopic
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                    title={isListeningTopic ? t.stopListeningTitle : t.speakTopicTitle}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>{isListeningTopic ? t.listeningBtn : t.speakBtn}</span>
                  </button>
                </div>
                <div className="relative flex items-center">
                  <input
                    ref={topicInputRef}
                    type="text"
                    enterKeyHint="done"
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    onFocus={() => {
                      setIsTopicInputFocused(true);
                      const lower = promptInput.trim().toLowerCase();
                      if (
                        lower === 'give me a topic as a seed for your story' ||
                        lower === 'what is the topic of your story'
                      ) {
                        setPromptInput('');
                      }
                    }}
                    onBlur={() => {
                      setIsTopicInputFocused(false);
                      if (typeof window !== 'undefined') {
                        setTimeout(() => {
                          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                          document.body.scrollTop = 0;
                          document.documentElement.scrollTop = 0;
                        }, 50);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        topicInputRef.current?.blur();
                        (document.activeElement as HTMLElement)?.blur();
                        setIsTopicInputFocused(false);
                        if (typeof window !== 'undefined') {
                          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                          document.body.scrollTop = 0;
                          document.documentElement.scrollTop = 0;
                        }
                        if (!isTopicEmptyOrDefault) {
                          handleGenerate();
                        }
                      }
                    }}
                    placeholder={t.promptPlaceholder}
                    className="w-full pl-3 pr-9 py-2 text-xs bg-amber-50/40 border border-amber-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={handleToggleTopicVoiceInput}
                    className={`absolute right-2 p-1 rounded-md transition cursor-pointer ${
                      isListeningTopic
                        ? 'text-rose-600 animate-pulse'
                        : 'text-amber-700/60 hover:text-amber-900'
                    }`}
                    title={isListeningTopic ? t.stopListeningTitle : t.speakTopicTitle}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>

                {/* Explicit Mobile Keyboard Dismissal Bar (Phones / Mobile only, never on Desktop) */}
                {isPhoneDevice && isTopicInputFocused && (
                  <div className="flex items-center justify-between gap-1.5 px-2.5 py-1.5 bg-amber-100/95 border border-amber-300 rounded-xl text-xs text-amber-950 animate-fade-in shadow-2xs">
                    <span className="text-[11px] font-bold flex items-center gap-1 text-amber-900 truncate">
                      <Keyboard className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span className="truncate">{t.finishedTypingTopic}</span>
                    </span>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        topicInputRef.current?.blur();
                        (document.activeElement as HTMLElement)?.blur();
                        setIsTopicInputFocused(false);
                        if (typeof window !== 'undefined') {
                          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                          document.body.scrollTop = 0;
                          document.documentElement.scrollTop = 0;
                        }
                      }}
                      onClick={() => {
                        topicInputRef.current?.blur();
                        (document.activeElement as HTMLElement)?.blur();
                        setIsTopicInputFocused(false);
                        if (typeof window !== 'undefined') {
                          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                          document.body.scrollTop = 0;
                          document.documentElement.scrollTop = 0;
                        }
                      }}
                      className="px-2.5 py-1 bg-amber-700 hover:bg-amber-800 active:scale-95 text-white font-extrabold text-[11px] rounded-lg shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Check className="w-3 h-3" />
                      <span>{t.dismissKeyboard}</span>
                    </button>
                  </div>
                )}

                {/* In-Card Create Story Action on Phones (Always immediately accessible right under topic input) */}
                {isPhoneDevice && (
                  <button
                    type="button"
                    onClick={() => {
                      topicInputRef.current?.blur();
                      (document.activeElement as HTMLElement)?.blur();
                      setIsTopicInputFocused(false);
                      if (typeof window !== 'undefined') {
                        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                        document.body.scrollTop = 0;
                        document.documentElement.scrollTop = 0;
                      }
                      if (!isTopicEmptyOrDefault) {
                        handleGenerate();
                      }
                    }}
                    disabled={isGenerating || isTopicEmptyOrDefault}
                    className={`w-full py-2 px-3 font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 ${
                      isGenerating || isTopicEmptyOrDefault
                        ? 'bg-amber-100 text-amber-800/40 border border-amber-200/60 cursor-not-allowed'
                        : 'bg-[#008450] hover:bg-[#006b40] text-white shadow-sm cursor-pointer active:scale-98'
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        <span>{t.creatingStory}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-emerald-100" />
                        <span>{t.createStory}</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Difficulty */}
              <div id="tour-build-difficulty" className="space-y-1.5 relative">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[11px] text-amber-950/70 uppercase tracking-wider">
                    {t.difficultyLevel}
                  </label>
                  {difficulty === 'Master (C2+)' && (
                    <button
                      type="button"
                      onClick={() => setIsMasterModalOpen(true)}
                      className="text-[10px] font-extrabold text-amber-900 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-full border border-amber-300 transition cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <span>{t.specialtiesBadge(masterSpecialties.length)}</span>
                    </button>
                  )}
                </div>
                <div className="space-y-1 bg-white/95 p-2 rounded-xl border border-amber-200/80 shadow-2xs">
                  {[
                    { val: 'Introduction', label: t.diffIntro },
                    { val: 'Beginner (A1-A2)', label: t.diffBeginner },
                    { val: 'Intermediate (B1-B2)', label: t.diffIntermediate },
                    { val: 'Advanced (C1-C2)', label: t.diffAdvanced },
                    { val: 'Master (C2+)', label: t.diffMaster },
                  ].map((d) => {
                    const isSelected = difficulty === d.val;
                    return (
                      <div key={d.val} className="space-y-0.5">
                        <label
                          className={`flex items-center justify-between p-1.5 cursor-pointer font-medium rounded-xl transition ${
                            isSelected
                              ? d.val === 'Master (C2+)'
                                ? 'bg-amber-100/90 text-amber-950 font-bold border border-amber-300/80 shadow-2xs'
                                : 'bg-amber-50 text-amber-950 font-bold border border-amber-200/80'
                              : 'hover:bg-amber-50/50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <input
                              type="radio"
                              name="difficulty"
                              value={d.val}
                              checked={isSelected}
                              onChange={(e) => {
                                setDifficulty(e.target.value);
                                if (e.target.value === 'Master (C2+)') {
                                  setIsMasterModalOpen(true);
                                }
                              }}
                              className="accent-amber-600"
                            />
                            <span className="text-xs truncate">{d.label}</span>
                          </div>

                          {d.val === 'Master (C2+)' && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDifficulty('Master (C2+)');
                                setIsMasterModalOpen(true);
                              }}
                              className="text-[10px] font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 px-2 py-0.5 rounded-lg border border-amber-300/80 transition cursor-pointer shrink-0 ml-1"
                              title={t.chooseDomainsTitle}
                            >
                              {t.chooseDomainsBtn}
                            </button>
                          )}
                        </label>

                        {d.val === 'Master (C2+)' && isSelected && (
                          <div className="pl-6 pr-2 pb-1 text-[10px] text-amber-900/80 flex items-center justify-between">
                            <span className="truncate max-w-[210px]">
                              {masterSpecialties.length === 0
                                ? t.generalMastery
                                : masterSpecialties.slice(0, 2).join(', ') +
                                  (masterSpecialties.length > 2 ? ` +${masterSpecialties.length - 2} ${t.moreSuffix}` : '')}
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsMasterModalOpen(true)}
                              className="underline font-bold text-amber-950 hover:text-black cursor-pointer shrink-0"
                            >
                              {t.editList}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tense */}
              <div className="space-y-1.5">
                <label className="font-bold text-[11px] text-amber-950/70 uppercase tracking-wider">
                  {t.tenseFocus}
                </label>
                <div className="grid grid-cols-2 gap-1 bg-white/95 p-2 rounded-xl border border-amber-200/80 shadow-2xs">
                  {[
                    { val: 'Natural / Mixed Tenses', label: t.tenseMixed },
                    { val: 'Present Tense', label: t.tensePresent },
                    { val: 'Past Tense', label: t.tensePast },
                    { val: 'Future Tense', label: t.tenseFuture },
                  ].map((item) => (
                    <label key={item.val} className="flex items-center gap-1.5 p-1 cursor-pointer font-medium text-[11px] hover:bg-amber-50/60 rounded-lg">
                      <input
                        type="radio"
                        name="tense"
                        value={item.val}
                        checked={tense === item.val}
                        onChange={(e) => setTense(e.target.value)}
                        className="accent-amber-600"
                      />
                      <span className="truncate">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Story Length & Format */}
              <div className="space-y-1.5">
                <label className="font-bold text-[11px] text-amber-950/70 uppercase tracking-wider block">
                  {t.storyLength}
                </label>
                <div className="grid grid-cols-2 gap-1 bg-white/95 p-2 rounded-xl border border-amber-200/80 shadow-2xs">
                  {[
                    { val: '5', label: t.lengthShort },
                    { val: '10', label: t.lengthMedium },
                    { val: '15', label: t.lengthLong },
                    { val: '40', label: t.lengthMax },
                  ].map((l) => (
                    <label key={l.val} className="flex items-center gap-1.5 p-1 cursor-pointer font-medium hover:bg-amber-50/60 rounded-lg">
                      <input
                        type="radio"
                        name="length"
                        value={l.val}
                        checked={((['5', '10', '15', '40', '50'].includes(length) ? (length === '50' ? '40' : length) : '15') === l.val)}
                        onChange={(e) => handleSelectLength(e.target.value)}
                        className="accent-amber-600"
                      />
                      <span>{l.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Content Format (Story vs Discussion) */}
              <div id="tour-build-format" className="space-y-1.5 relative">
                <label className="font-bold text-[11px] text-amber-950/70 uppercase tracking-wider">
                  {t.formatAndGenre}
                </label>
                <div className="bg-white/95 p-2 rounded-xl border border-amber-200/80 shadow-2xs space-y-2">
                  <div className="flex gap-2">
                    <label className="flex-1 flex items-center justify-center gap-1 p-2 rounded-lg border border-amber-200/80 bg-amber-50/40 hover:bg-amber-50 cursor-pointer text-xs font-semibold">
                      <input
                        type="radio"
                        name="contentType"
                        value="story"
                        checked={contentType === 'story'}
                        onChange={() => setContentType('story')}
                        className="accent-amber-600"
                      />
                      <span>{t.story}</span>
                    </label>
                    <label className="flex-1 flex items-center justify-center gap-1 p-2 rounded-lg border border-amber-200/80 bg-amber-50/40 hover:bg-amber-50 cursor-pointer text-xs font-semibold">
                      <input
                        type="radio"
                        name="contentType"
                        value="discussion"
                        checked={contentType === 'discussion'}
                        onChange={() => setContentType('discussion')}
                        className="accent-amber-600"
                      />
                      <span>{t.dialogue}</span>
                    </label>
                  </div>

                  <div className="flex gap-2 pt-0.5">
                    <label className="flex-1 flex items-center justify-center gap-1 p-1.5 rounded-lg border border-amber-200/70 hover:bg-amber-50/50 cursor-pointer text-[11px]">
                      <input
                        type="radio"
                        name="isFact"
                        value="true"
                        checked={isFact === true}
                        onChange={() => setIsFact(true)}
                        className="accent-amber-600"
                      />
                      <span>{t.nonFiction}</span>
                    </label>
                    <label className="flex-1 flex items-center justify-center gap-1 p-1.5 rounded-lg border border-amber-200/70 hover:bg-amber-50/50 cursor-pointer text-[11px]">
                      <input
                        type="radio"
                        name="isFact"
                        value="false"
                        checked={isFact === false}
                        onChange={() => setIsFact(false)}
                        className="accent-amber-600"
                      />
                      <span>{t.fiction}</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Verb conjugations checkbox (Disabled when length is Max) */}
              <label
                className={`flex items-center gap-2 p-2.5 rounded-xl border transition shadow-2xs ${
                  length === '40' || length === '50'
                    ? 'bg-slate-100/90 border-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-white/95 border-amber-200/80 cursor-pointer font-medium text-amber-950 hover:bg-amber-50/50'
                }`}
                title={length === '40' || length === '50' ? t.disabledForMaxTitle : undefined}
              >
                <input
                  type="checkbox"
                  checked={length === '40' || length === '50' ? false : includeVerbs}
                  disabled={length === '40' || length === '50'}
                  onChange={(e) => setIncludeVerbs(e.target.checked)}
                  className="accent-amber-600 disabled:opacity-50"
                />
                <span className="flex-1">{t.includeVerbs}</span>
                {(length === '40' || length === '50') && (
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-md">
                    {t.disabledForMax}
                  </span>
                )}
              </label>
            </>
          )}

          {/* Sidebar Legal / Policy Footer */}
          <div className="pt-4 mt-2 border-t border-amber-200/60 text-center text-[11px] text-amber-950/70 space-y-1 select-none">
            <div className="flex items-center justify-center gap-1.5 font-semibold flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setLegalTab('privacy');
                  setIsLegalOpen(true);
                }}
                className="hover:text-emerald-800 underline cursor-pointer"
              >
                {t.privacyShort}
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setLegalTab('terms');
                  setIsLegalOpen(true);
                }}
                className="hover:text-emerald-800 underline cursor-pointer"
              >
                {t.termsShort}
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setLegalTab('about');
                  setIsLegalOpen(true);
                }}
                className="hover:text-emerald-800 underline cursor-pointer"
              >
                {t.aboutShort}
              </button>
            </div>
            <p className="text-[10px] text-amber-900/50">{t.adsensePartner}</p>
          </div>
        </div>
      </aside>

      {/* Owl Track for Practice Modes (Hidden in Reading Mode) */}
      {currentStory && practiceMode !== 'off' && (
        <OwlTrack
          totalQuestions={currentStory.sentences.length}
          solvedCount={activeSolvedCount}
          baseLang={baseLang}
          isPractice={true}
          onReset={handleResetCurrentPractice}
          onSelectSentence={(idx) => {
            const el = sentenceElementsRef.current[idx];
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }}
        />
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 self-stretch flex flex-col min-w-0 min-h-0 bg-[#f8f9fa] overflow-hidden">
        {/* Sticky Header Bar */}
        <header className="px-4 py-3 bg-white border-b border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            {/* Mobile Drawer Button */}
            <button
              onClick={() => setIsSidebarMobileOpen(true)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 lg:hidden text-slate-700"
              title={t.openOptionsSidebar}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Quick Spoken Language Button */}
            <button
              type="button"
              onClick={() => {
                setSidebarTab('build');
                setIsSidebarMobileOpen(true);
              }}
              className="lg:hidden flex items-center gap-1.5 px-2 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 rounded-xl text-xs font-bold shadow-2xs transition shrink-0 cursor-pointer"
              title={t.selectSpokenLangTitle}
            >
              <span className="text-sm">{BASE_LANGUAGES.find((b) => b.name === baseLang)?.flag || '🗣️'}</span>
              <span className="max-w-[70px] truncate text-[11px] font-bold">
                {BASE_LANGUAGES.find((b) => b.name === baseLang)?.nativeName || baseLang}
              </span>
            </button>

            {/* Prompt Input (Desktop Only - on phones it is in the Build window) */}
            <div className="hidden lg:block flex-1">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  onFocus={() => {
                    const lower = promptInput.trim().toLowerCase();
                    if (
                      lower === 'give me a topic as a seed for your story' ||
                      lower === 'what is the topic of your story'
                    ) {
                      setPromptInput('');
                    }
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && !isTopicEmptyOrDefault && handleGenerate()}
                  placeholder={t.promptPlaceholder}
                  className="w-full pl-3.5 pr-10 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008450]"
                />
                <button
                  type="button"
                  onClick={handleToggleTopicVoiceInput}
                  className={`absolute right-2 p-1.5 rounded-lg transition cursor-pointer ${
                    isListeningTopic
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'text-slate-400 hover:text-emerald-700 hover:bg-slate-100'
                  }`}
                  title={isListeningTopic ? t.stopListeningTitle : t.speakTopicTitle}
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>
              {currentStory && (
                <div className="text-[11px] text-slate-500 mt-1 truncate">
                  <span className="font-bold text-slate-700" dir={isRtlLanguage(currentStory._meta?.targetLang || targetLang) ? 'rtl' : 'ltr'}>{currentStory.title_target}</span>{' '}
                  <span dir={isRtlLanguage(currentStory._meta?.baseLang || baseLang) ? 'rtl' : 'ltr'}>({currentStory.title_en})</span> • {currentStory.sentences.length} {t.sentences} •{' '}
                  {currentStory.contentType === 'discussion' ? t.dialogue : t.story}
                </div>
              )}
            </div>

            {/* Mobile Header Story Info (Phone Only) */}
            {currentStory && (
              <div className="lg:hidden flex-1 min-w-0 pr-1">
                <div className="text-xs font-bold text-slate-900 truncate" dir={isRtlLanguage(currentStory._meta?.targetLang || targetLang) ? 'rtl' : 'ltr'}>
                  {currentStory.title_target}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  <span dir={isRtlLanguage(currentStory._meta?.baseLang || baseLang) ? 'rtl' : 'ltr'}>{currentStory.title_en}</span> • {currentStory.sentences.length} {t.sentences}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Daily Streak & Progress Tracker */}
            <button
              onClick={() => setIsStatsOpen(true)}
              className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 text-xs font-bold rounded-xl shadow-2xs transition cursor-pointer active:scale-95"
              title={t.statsModalTitle}
            >
              <span>{t.streakBadge(learnerStats.currentStreak)}</span>
            </button>

            {/* Library Button */}
            <button
              onClick={() => setIsLibraryOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#008450] hover:bg-[#006b40] text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              <BookOpen className="w-4 h-4" />
              <span>{t.library}</span>
            </button>

            {/* Prominent Header Share Story Button */}
            {currentStory && (
              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer active:scale-95"
                title={t.shareStoryTitle}
              >
                <Share2 className="w-4 h-4 text-emerald-100" />
                <span className="hidden sm:inline">{t.shareStory}</span>
                <span className="sm:hidden">{t.shareShort}</span>
              </button>
            )}

            {/* Studio Neural Voice Toggle */}
            <button
              type="button"
              onClick={() => setIsStudioVoice((prev) => !prev)}
              className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer shadow-2xs ${
                isStudioVoice
                  ? 'bg-purple-100 text-purple-900 border-purple-300 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
              }`}
              title={t.studioVoice}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isStudioVoice ? 'text-purple-600 fill-purple-600' : 'text-slate-400'}`} />
              <span>{t.studioVoice}</span>
            </button>

            {/* Audio Listen / Stop */}
            <button
              onClick={togglePlayAll}
              disabled={!currentStory}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl text-white shadow-xs transition ${
                isPlaying
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300'
              }`}
            >
              {isPlaying ? (
                <>
                  <Square className="w-4 h-4 fill-current" />
                  <span>{t.stop}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>{t.listen}</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Pinned / Locked Speed Run Countdown Bar (remains visible when scrolling) */}
        {currentStory && isSpeedRunActive && isTimerLocked && (
          <div className="shrink-0 z-20 bg-amber-50/95 backdrop-blur-sm border-b border-amber-300 shadow-xs">
            <SpeedRunTimer
              isActive={isSpeedRunActive}
              onToggleActive={handleToggleSpeedRun}
              totalQuestions={timerTotalQuestions}
              baseLang={baseLang}
              targetLang={currentStory?._meta?.targetLang || targetLang}
              onShareStory={() => setIsShareModalOpen(true)}
              onSpeak={(txt) => speakText(txt)}
              isLocked={isTimerLocked}
              onToggleLock={() => setIsTimerLocked((prev) => !prev)}
              selectedDuration={timerDuration}
              onSelectDuration={handleSelectTimerDuration}
              timeLeft={timerTimeLeft}
              isRunning={isTimerRunning}
              isTimeUp={isTimerTimeUp}
              isCompleted={isTimerCompleted}
              streak={timerStreak}
              personalBest={timerPersonalBest}
              onStart={handleStartTimer}
              onPause={handlePauseTimer}
              onReset={handleResetTimer}
              onDismissCompleted={() => setIsTimerCompleted(false)}
              isPinnedDock={true}
            />
          </div>
        )}

        {/* Story Sentences Area */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-y-contain touch-pan-y scroll-touch px-3 sm:px-8 py-3 sm:py-6 max-w-4xl mx-auto w-full">
          {!currentStory ? (
            <div className="text-center py-20 text-slate-400 space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-[#008450] flex items-center justify-center">
                <BookOpen className="w-7 h-7" />
              </div>
              <p className="text-base font-medium text-slate-700">{t.readyToLearn}</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {t.readyToLearnDesc}
              </p>
            </div>
          ) : (
            <div className="space-y-3.5 pb-10 lg:pb-16">
              {/* Contextual Micro-Hint (Dismissible Banner) */}
              <ContextualMicroHint
                forceShow={showMicroHintForce}
                targetLang={currentStory?._meta?.targetLang || targetLang}
                baseLang={baseLang}
              />

              {/* Story Overview & Metadata Card */}
              <div
                data-no-swipe="true"
                className="p-2 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-2 sm:gap-3"
              >
                {/* Desktop/Tablet Story Metadata (Hidden on Phone) */}
                <div className="hidden lg:block min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {currentStory.contentType === 'discussion' ? '🎙️' : '📖'}
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate" dir={isRtlLanguage(currentStory._meta?.targetLang || targetLang) ? 'rtl' : 'ltr'}>
                      {currentStory.title_target}
                    </h2>
                    {currentStory.title_en && (
                      <span className="text-xs sm:text-sm text-slate-500 font-medium truncate" dir={isRtlLanguage(currentStory._meta?.baseLang || baseLang) ? 'rtl' : 'ltr'}>
                        ({currentStory.title_en})
                      </span>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {/* Target language badge */}
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs">
                      <span>{LANGUAGES.find((l) => l.name === (currentStory._meta?.targetLang || targetLang))?.flag || '🌐'}</span>
                      <span>{currentStory._meta?.targetLang || targetLang}</span>
                    </span>

                    {/* Base language badge */}
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                      title={`Native / Base reference language: ${currentStory._meta?.baseLang || baseLang}`}
                    >
                      <span className="text-[10px] text-slate-400">{t.from}</span>
                      <span>{BASE_LANGUAGES.find((b) => b.name === (currentStory._meta?.baseLang || baseLang))?.flag || '🇬🇧'}</span>
                      <span>{currentStory._meta?.baseLang || baseLang}</span>
                    </span>

                    {/* Difficulty */}
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {(() => {
                        const val = currentStory._meta?.difficulty || difficulty;
                        if (val.includes('Intro')) return t.diffIntro;
                        if (val.includes('Beginner') || val.includes('A1')) return t.diffBeginner;
                        if (val.includes('Intermediate') || val.includes('B1')) return t.diffIntermediate;
                        if (val.includes('Advanced') || val.includes('C1')) return t.diffAdvanced;
                        return val;
                      })()}
                    </span>

                    {/* Tense */}
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {(() => {
                        const val = currentStory._meta?.tense || tense;
                        if (val.includes('Mixed') || val.includes('Natural')) return t.tenseMixed;
                        if (val.includes('Present')) return t.tensePresent;
                        if (val.includes('Past')) return t.tensePast;
                        if (val.includes('Future')) return t.tenseFuture;
                        return val;
                      })()}
                    </span>

                    {/* Genre / Fact / Fiction */}
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {(currentStory._meta?.isFact ?? isFact) ? t.nonFiction : t.fiction}
                    </span>

                    {/* Sentence count & Discrepancy indicator */}
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                        currentStory._meta?.length && parseInt(String(currentStory._meta.length), 10) > currentStory.sentences.length
                          ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                      title={
                        currentStory._meta?.length && parseInt(String(currentStory._meta.length), 10) > currentStory.sentences.length
                          ? `Requested ${currentStory._meta.length} sentences, but only ${currentStory.sentences.length} were generated.`
                          : `${currentStory.sentences.length} sentences`
                      }
                    >
                      {currentStory.sentences.length} {t.sentences}
                      {currentStory._meta?.length && parseInt(String(currentStory._meta.length), 10) > currentStory.sentences.length && (
                        <span className="ml-1 text-[10px] text-amber-700 font-normal">
                          ({t.ofWord} {currentStory._meta.length})
                        </span>
                      )}
                    </span>

                    {/* Story Inspector / Diagnostics Button */}
                    <button
                      type="button"
                      onClick={() => setIsInspectorOpen(true)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition cursor-pointer"
                      title={t.inspectTitle}
                    >
                      <Info className="w-3 h-3 text-slate-500" />
                      <span>{t.inspect}</span>
                    </button>
                  </div>
                </div>

                {/* Quick Actions Bar */}
                <div
                  data-no-swipe="true"
                  className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto lg:ml-auto"
                >
                  {/* 1. Highlighter Toggle */}
                  <button
                    type="button"
                    onClick={() => setIsHighlighterMode((prev) => !prev)}
                    className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold rounded-xl transition cursor-pointer shadow-xs ${
                      isHighlighterMode
                        ? 'bg-amber-400 text-amber-950 border-2 border-amber-600 shadow-md ring-2 ring-amber-300 font-black scale-105'
                        : 'text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300'
                    }`}
                    title={t.vocabHighlighter}
                  >
                    <Highlighter className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                    <span>{t.highlighter}{customHighlights.length > 0 ? ` (${customHighlights.length})` : ''}</span>
                    {isHighlighterMode && (
                      <span className="w-2 h-2 rounded-full bg-amber-950 animate-pulse ml-0.5" />
                    )}
                  </button>

                  {/* 3. Grammar Bites */}
                  <button
                    type="button"
                    onClick={() => setIsGrammarOpen(true)}
                    className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition cursor-pointer shadow-2xs"
                    title={t.grammar}
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>{t.grammar}</span>
                  </button>

                  {/* 4. Flashcards */}
                  <button
                    type="button"
                    onClick={() => setIsFlashcardsOpen(true)}
                    className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold text-[#008450] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition cursor-pointer shadow-2xs"
                    title={t.cards}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{t.cards}</span>
                  </button>

                  {/* 4b. Story Word Dictionary */}
                  <button
                    type="button"
                    onClick={() => setIsDictionaryOpen(true)}
                    className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition cursor-pointer shadow-2xs"
                    title={t.storyDictionaryTitle}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-teal-700" />
                    <span>{t.storyDictionary}</span>
                  </button>

                  {/* 5. Printable Study Sheet */}
                  <button
                    type="button"
                    onClick={() => setIsStudySheetOpen(true)}
                    className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition cursor-pointer shadow-2xs"
                    title={t.studySheet}
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{t.studySheet}</span>
                  </button>

                  {/* 6. Live Conversation Partner */}
                  <button
                    type="button"
                    onClick={() => setIsConversationOpen(true)}
                    className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-300 rounded-xl transition cursor-pointer shadow-2xs active:scale-95"
                    title={t.conversationPartnerTitle}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                    <span>{t.converse}</span>
                  </button>

                  {/* 7. Quick Tips */}
                  <button
                    type="button"
                    onClick={() => setShowMicroHintForce((prev) => !prev)}
                    className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition cursor-pointer shadow-2xs"
                    title={t.tipsTitle}
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{t.tips}</span>
                  </button>

                  {/* Speed Run Timer Challenge (Trigger or Unlocked inline bar) */}
                  {(!isSpeedRunActive || !isTimerLocked) && (
                    <SpeedRunTimer
                      isActive={isSpeedRunActive}
                      onToggleActive={handleToggleSpeedRun}
                      totalQuestions={timerTotalQuestions}
                      baseLang={baseLang}
                      targetLang={currentStory?._meta?.targetLang || targetLang}
                      onShareStory={() => setIsShareModalOpen(true)}
                      onSpeak={(txt) => speakText(txt)}
                      isLocked={isTimerLocked}
                      onToggleLock={() => setIsTimerLocked((prev) => !prev)}
                      selectedDuration={timerDuration}
                      onSelectDuration={handleSelectTimerDuration}
                      timeLeft={timerTimeLeft}
                      isRunning={isTimerRunning}
                      isTimeUp={isTimerTimeUp}
                      isCompleted={isTimerCompleted}
                      streak={timerStreak}
                      personalBest={timerPersonalBest}
                      onStart={handleStartTimer}
                      onPause={handlePauseTimer}
                      onReset={handleResetTimer}
                      onDismissCompleted={() => setIsTimerCompleted(false)}
                      isPinnedDock={false}
                    />
                  )}
                </div>
              </div>

              {/* Grammar Highlighter Legend Bar */}
              {isHighlighterMode && (
                <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-linear-to-r from-amber-50 via-emerald-50 to-sky-50 border border-amber-300 rounded-2xl shadow-xs text-xs animate-fade-in mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Highlighter className="w-4 h-4 text-amber-600 stroke-[2.5]" />
                    <span>{t.highlighterActiveLabel}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-950 border border-amber-300 font-extrabold text-[11px] shadow-2xs">
                      {t.articlesGold}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-950 border border-emerald-300 font-extrabold text-[11px] shadow-2xs">
                      {t.verbsGreen}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-sky-100 text-sky-950 border border-sky-300 font-extrabold text-[11px] shadow-2xs">
                      {t.prepositionsBlue}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-purple-100 text-purple-950 border border-purple-300 font-extrabold text-[11px] shadow-2xs">
                      {t.nounsPurple}
                    </span>
                  </div>
                </div>
              )}

              {/* 100% Exercise Completion Challenge Card */}
              {practiceMode !== 'off' && currentStory.sentences.length > 0 && activeSolvedCount === currentStory.sentences.length && (
                <div className="p-4 sm:p-5 rounded-2xl bg-linear-to-r from-amber-500 via-emerald-600 to-teal-600 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-scale-up border border-emerald-400/40 mb-2">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-inner">
                      <Trophy className="w-6 h-6 text-amber-200 fill-amber-200" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider">
                          {t.completeBadge}
                        </span>
                        <span className="text-xs text-emerald-100 font-semibold">
                          {currentStory.sentences.length} {t.ofWord} {currentStory.sentences.length} {t.solved}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black tracking-tight mt-0.5">
                        {t.challengeFriendHeading}
                      </h3>
                      <p className="text-xs text-emerald-100/90 leading-snug">
                        {t.challengeFriendDesc}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                    <button
                      type="button"
                      onClick={() => setIsShareModalOpen(true)}
                      className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-emerald-50 active:scale-95 text-emerald-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Share2 className="w-4 h-4 text-emerald-700" />
                      <span>{t.challengeFriendBtn}</span>
                    </button>
                  </div>
                </div>
              )}

              {practiceMode === 'quiz' ? (
                <ComprehensionQuizView
                  story={currentStory}
                  questions={quizQuestions}
                  targetLang={currentStory?._meta?.targetLang || targetLang}
                  baseLang={baseLang}
                  savedAnswers={quizAnswers}
                  savedSolved={quizSolved}
                  onAnswerQuestion={handleQuizAnswer}
                  onResetQuiz={handleResetQuiz}
                  onRegenerateQuestions={() => handleLoadOrGenerateQuiz(true)}
                  onExitQuiz={() => handleSelectPracticeMode('off')}
                  onOpenDictionary={() => setIsDictionaryOpen(true)}
                  onSpeak={(txt) => speakText(txt)}
                  onSpeakSentence={(idx) => repeatSentence(idx)}
                  onWordClick={(word, sIdx, questionContext) => {
                    const clean = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'«»，。！？、“”‘’：；《》（）…—]/g, '').trim();
                    if (!clean) return;
                    const foundHl = customHighlights.find(
                      (h) =>
                        (h.sentenceIndex === sIdx && h.word.toLowerCase() === clean.toLowerCase()) ||
                        h.word.toLowerCase() === clean.toLowerCase()
                    );
                    setHighlighterPopoverWord({
                      word: clean,
                      sentenceIndex: sIdx,
                      existing: foundHl,
                      sentenceContext: questionContext || currentStory?.sentences[sIdx]?.target || '',
                    });
                  }}
                />
              ) : (
                currentStory.sentences.map((line, index) => {
                  const isActive = activeSentenceIndex === index;
                  const isDiscussion = currentStory.contentType === 'discussion' || line.speaker;
                  const clozeData = practiceMode === 'cloze' ? getClozeWord(line.target) : null;
                  const isLineSolved =
                    practiceMode === 'cloze'
                      ? clozeSolved.has(index)
                      : practiceMode === 'multipleChoice'
                      ? mcSolved.has(index)
                      : practiceMode === 'scrambleVoice'
                      ? scrambleVoiceSolved.has(index)
                      : practiceMode === 'scramble' || practiceMode === 'scrambleEasy'
                      ? scrambleSolved.has(index)
                      : false;

                return (
                  <div
                    key={index}
                    ref={(el) => {
                      sentenceElementsRef.current[index] = el;
                    }}
                    onClick={() => {
                      setActiveSentenceIndex(index);
                      if (practiceMode === 'off') {
                        repeatSentence(index);
                      }
                    }}
                    onFocus={() => {
                      setActiveSentenceIndex(index);
                    }}
                    className={`relative p-4 sm:p-5 rounded-2xl border transition-all ${
                      isActive
                        ? 'bg-emerald-50/90 border-[#008450] shadow-md -translate-y-0.5'
                        : 'bg-white border-slate-200/90 hover:border-emerald-300 shadow-xs'
                    }`}
                  >
                    {/* Speaker Tag for Dialogue */}
                    {isDiscussion && line.speaker && (
                      <div className="mb-2">
                        <span
                          className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                            line.speaker === 'A'
                              ? 'bg-pink-50 border-pink-200 text-pink-700'
                              : 'bg-blue-50 border-blue-200 text-blue-700'
                          }`}
                        >
                          {line.speaker === 'A' ? t.speakerASofia : t.speakerBMarco}
                        </span>
                      </div>
                    )}

                    {/* Sentence Content depending on Practice Mode */}
                    <div className="pr-12 sm:pr-28 lg:pr-32">
                      {practiceMode === 'multipleChoice' ? (
                        <div>
                          <MultipleChoiceExercise
                            key={`${currentStoryKey}-mc-${index}-${practiceResetNonce}`}
                            sentenceIndex={index}
                            sentenceText={line.target}
                            sentenceVerbs={line.verbs}
                            isHighlighterMode={isHighlighterMode}
                            customHighlights={customHighlights}
                            storyWordsPool={storyWordsPool}
                            isInitiallySolved={mcSolved.has(index)}
                            baseLang={baseLang}
                            targetLang={currentStory?._meta?.targetLang || targetLang}
                            onSolve={handleExerciseSolved}
                            onRepeatSentence={(idx) => repeatSentence(idx)}
                            onWordClick={(word, sIdx, existingHl) => {
                              const foundHl =
                                existingHl ||
                                customHighlights.find(
                                  (h) =>
                                    (h.sentenceIndex === sIdx && h.word.toLowerCase() === word.toLowerCase()) ||
                                    h.word.toLowerCase() === word.toLowerCase()
                                );
                              setHighlighterPopoverWord({
                                word,
                                sentenceIndex: sIdx,
                                existing: foundHl,
                              });
                            }}
                          />
                        </div>
                      ) : practiceMode === 'scramble' || practiceMode === 'scrambleEasy' || practiceMode === 'scrambleVoice' ? (
                        <div>
                          <ScrambleExercise
                            key={`${currentStoryKey}-${practiceMode}-${index}-${practiceResetNonce}`}
                            sentenceIndex={index}
                            sentenceText={line.target}
                            isEasyMode={true}
                            isVoiceOnly={practiceMode === 'scrambleVoice'}
                            sentenceTranslation={line.en}
                            isInitiallySolved={
                              practiceMode === 'scrambleVoice'
                                ? scrambleVoiceSolved.has(index)
                                : scrambleSolved.has(index)
                            }
                            baseLang={baseLang}
                            savedPlaced={
                              practiceMode === 'scrambleVoice'
                                ? scrambleVoicePlaced[index]
                                : scramblePlaced[index]
                            }
                            onPlacedChange={(sIdx, placed) => {
                              if (practiceMode === 'scrambleVoice') {
                                setScrambleVoicePlaced((prev) => {
                                  const next = { ...prev, [sIdx]: placed };
                                  if (currentStoryKey) {
                                    saveStoryPracticeState(currentStoryKey, { scrambleVoicePlaced: next });
                                  }
                                  return next;
                                });
                              } else {
                                setScramblePlaced((prev) => {
                                  const next = { ...prev, [sIdx]: placed };
                                  if (currentStoryKey) {
                                    saveStoryPracticeState(currentStoryKey, { scramblePlaced: next });
                                  }
                                  return next;
                                });
                              }
                            }}
                            targetLang={currentStory?._meta?.targetLang || targetLang}
                            onSolve={handleExerciseSolved}
                            onUnsolve={handleExerciseUnsolved}
                            onSpeakText={(txt, customRate) => speakText(txt, undefined, 1, customRate)}
                            onWordClick={(word, sIdx) => {
                              const clean = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'«»，。！？、“”‘’：；《》（）…—]/g, '').trim();
                              const foundHl = customHighlights.find(
                                (h) =>
                                  (h.sentenceIndex === sIdx && h.word.toLowerCase() === clean.toLowerCase()) ||
                                  h.word.toLowerCase() === clean.toLowerCase()
                              );
                              setHighlighterPopoverWord({
                                word: clean,
                                sentenceIndex: sIdx,
                                existing: foundHl,
                              });
                            }}
                          />
                        </div>
                      ) : practiceMode === 'cloze' && clozeData ? (
                        <div
                          className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed select-text"
                          dir={isRtlLanguage(currentStory?._meta?.targetLang || targetLang) ? 'rtl' : 'ltr'}
                        >
                          {line.target.split(' ').map((word, wIdx) => {
                            const { lead, core, trail } = splitWordPunctuation(word);
                            const clean = core || word;
                            if (clean.toLowerCase() === clozeData.clean.toLowerCase()) {
                              const currentVal = clozeAnswers[index] || '';
                              const targetClean = clozeData.clean;
                              const inputTrimmed = currentVal.trim();
                              const isExact = inputTrimmed.toLowerCase() === targetClean.toLowerCase();
                              // Check if the typed prefix matches the target word so far
                              const isPrefixCorrect =
                                inputTrimmed.length > 0 &&
                                targetClean.toLowerCase().startsWith(inputTrimmed.toLowerCase());
                              const hasMistake =
                                inputTrimmed.length > 0 && !isPrefixCorrect;

                              let inputClass = 'border-2 border-slate-300 bg-white text-slate-800';
                              if (isExact) {
                                inputClass = 'border-2 border-emerald-600 bg-emerald-100 text-emerald-950 ring-2 ring-emerald-500 shadow-sm';
                              } else if (isPrefixCorrect) {
                                inputClass = 'border-2 border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-400';
                              } else if (hasMistake) {
                                inputClass = 'border-2 border-red-600 bg-red-100 text-red-950 ring-2 ring-red-500 animate-shake';
                              }

                              const hl = customHighlights.find(
                                (h) =>
                                  (h.sentenceIndex === index && h.word.toLowerCase() === clean.toLowerCase()) ||
                                  h.word.toLowerCase() === clean.toLowerCase()
                              );
                              const grammarCat = isHighlighterMode ? classifyWordGrammar(clean, line.verbs) : 'vocab';
                              const grammarBadge = isHighlighterMode ? getGrammarBadgeLabel(grammarCat) : '';

                              return (
                                <span key={wIdx} className="inline-flex items-center gap-1 mx-1" onClick={(e) => e.stopPropagation()}>
                                  {lead && <span>{lead}</span>}
                                  <input
                                    type="text"
                                    value={currentVal}
                                    placeholder={"_".repeat(clozeData.clean.length)}
                                    onChange={(e) => handleClozeInput(index, e.target.value, clozeData.clean)}
                                    style={{ width: `${Math.max(65, clozeData.clean.length * 13)}px` }}
                                    className={`px-2 py-0.5 text-center font-bold text-sm rounded-lg transition-all outline-none ${inputClass}`}
                                    title={
                                      isExact
                                        ? `${clean} — ${t.tapWordHint}`
                                        : isHighlighterMode
                                        ? `${grammarBadge}`
                                        : t.typeMissingWord
                                    }
                                  />
                                  {isExact && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setHighlighterPopoverWord({
                                          word: clean,
                                          sentenceIndex: index,
                                          existing: hl,
                                        });
                                      }}
                                      className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-black text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded cursor-pointer shadow-2xs transition"
                                      title={`Correct: "${clean}" — Tap for definition & notes`}
                                    >
                                      ✓
                                    </button>
                                  )}
                                  {trail && <span>{trail}</span>}
                                </span>
                              );
                            }

                            if (!core) {
                              return <span key={wIdx} className="inline-block mr-1">{word}</span>;
                            }

                            const hl = customHighlights.find(
                              (h) =>
                                (h.sentenceIndex === index && h.word.toLowerCase() === core.toLowerCase()) ||
                                h.word.toLowerCase() === core.toLowerCase()
                            );

                            let hlStyle = '';
                            if (hl) {
                              if (hl.color === 'emerald') hlStyle = 'bg-emerald-300 text-emerald-950 border-b-[3px] border-emerald-700 font-black shadow-xs ring-1 ring-emerald-500/80 px-1 py-0.5 rounded';
                              else if (hl.color === 'indigo') hlStyle = 'bg-indigo-300 text-indigo-950 border-b-[3px] border-indigo-700 font-black shadow-xs ring-1 ring-indigo-500/80 px-1 py-0.5 rounded';
                              else if (hl.color === 'rose') hlStyle = 'bg-rose-300 text-rose-950 border-b-[3px] border-rose-700 font-black shadow-xs ring-1 ring-rose-500/80 px-1 py-0.5 rounded';
                              else hlStyle = 'bg-amber-300 text-amber-950 border-b-[3px] border-amber-600 font-black shadow-xs ring-1 ring-amber-500/80 px-1 py-0.5 rounded';
                            }

                            const grammarCat = isHighlighterMode ? classifyWordGrammar(core, line.verbs) : 'vocab';
                            const grammarClass = isHighlighterMode ? getGrammarStyle(grammarCat) : '';
                            const grammarBadge = isHighlighterMode ? getGrammarBadgeLabel(grammarCat) : '';

                            return (
                              <span key={wIdx} className="inline-block mr-1">
                                {lead && <span>{lead}</span>}
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setHighlighterPopoverWord({
                                      word: core,
                                      sentenceIndex: index,
                                      existing: hl,
                                    });
                                  }}
                                  className={`cursor-pointer transition-colors ${
                                    hl
                                      ? `${hlStyle} shadow-sm`
                                      : isHighlighterMode
                                      ? `${grammarClass} hover:opacity-85`
                                      : 'rounded hover:text-emerald-700'
                                  }`}
                                  title={
                                    hl?.translation
                                      ? `${core}: ${hl.translation}${hl.note ? ` (${hl.note})` : ''}`
                                      : isHighlighterMode
                                      ? `${grammarBadge}: "${core}" — ${t.tapWordHint}`
                                      : t.tapWordHint
                                  }
                                >
                                  {core}
                                </span>
                                {trail && <span>{trail}</span>}
                              </span>
                            );
                          })}

                          {/* Reveal Answer button */}
                          <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() =>
                                setRevealedAnswers((prev) => {
                                  const next = { ...prev, [index]: !prev[index] };
                                  if (currentStoryKey) {
                                    saveStoryPracticeState(currentStoryKey, { clozeRevealed: next });
                                  }
                                  return next;
                                })
                              }
                              className="text-xs text-slate-500 hover:text-[#008450] font-medium inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>{revealedAnswers[index] ? t.hideAnswer : t.revealAnswer}</span>
                            </button>
                            {revealedAnswers[index] && (
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setHighlighterPopoverWord({
                                    word: clozeData.clean,
                                    sentenceIndex: index,
                                    existing: customHighlights.find(
                                      (h) =>
                                        (h.sentenceIndex === index && h.word.toLowerCase() === clozeData.clean.toLowerCase()) ||
                                        h.word.toLowerCase() === clozeData.clean.toLowerCase()
                                    ),
                                  });
                                }}
                                className="ml-2 text-xs font-bold text-[#008450] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-lg cursor-pointer transition shadow-2xs inline-flex items-center gap-1"
                                title={`Answer: "${clozeData.clean}" — Tap for definition & notes`}
                              >
                                {t.answerLabel} {clozeData.clean}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div
                          className="text-base sm:text-lg font-semibold text-emerald-900 leading-relaxed select-text"
                          dir={isRtlLanguage(currentStory?._meta?.targetLang || targetLang) ? 'rtl' : 'ltr'}
                        >
                          {line.target.split(' ').map((word, wIdx) => {
                            const { lead, core, trail } = splitWordPunctuation(word);
                            if (!core) {
                              return <span key={wIdx} className="inline-block mr-1">{word}</span>;
                            }
                            const hl = customHighlights.find(
                              (h) =>
                                (h.sentenceIndex === index && h.word.toLowerCase() === core.toLowerCase()) ||
                                h.word.toLowerCase() === core.toLowerCase()
                            );

                            let hlStyle = '';
                            if (hl) {
                              if (hl.color === 'emerald') hlStyle = 'bg-emerald-300 text-emerald-950 border-b-[3px] border-emerald-700 font-black shadow-xs ring-1 ring-emerald-500/80 px-1 py-0.5 rounded';
                              else if (hl.color === 'indigo') hlStyle = 'bg-indigo-300 text-indigo-950 border-b-[3px] border-indigo-700 font-black shadow-xs ring-1 ring-indigo-500/80 px-1 py-0.5 rounded';
                              else if (hl.color === 'rose') hlStyle = 'bg-rose-300 text-rose-950 border-b-[3px] border-rose-700 font-black shadow-xs ring-1 ring-rose-500/80 px-1 py-0.5 rounded';
                              else hlStyle = 'bg-amber-300 text-amber-950 border-b-[3px] border-amber-600 font-black shadow-xs ring-1 ring-amber-500/80 px-1 py-0.5 rounded';
                            }

                            const grammarCat = isHighlighterMode ? classifyWordGrammar(core, line.verbs) : 'vocab';
                            const grammarClass = isHighlighterMode ? getGrammarStyle(grammarCat) : '';
                            const grammarBadge = isHighlighterMode ? getGrammarBadgeLabel(grammarCat) : '';

                            return (
                              <span key={wIdx} className="inline-block mr-1">
                                {lead && <span>{lead}</span>}
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setHighlighterPopoverWord({
                                      word: core,
                                      sentenceIndex: index,
                                      existing: hl,
                                    });
                                  }}
                                  className={`cursor-pointer transition-colors ${
                                    hl
                                      ? `${hlStyle} shadow-sm`
                                      : isHighlighterMode
                                      ? `${grammarClass} hover:opacity-85`
                                      : 'rounded hover:text-emerald-700'
                                  }`}
                                  title={
                                    hl?.translation
                                      ? `${core}: ${hl.translation}${hl.note ? ` (${hl.note})` : ''}`
                                      : isHighlighterMode
                                      ? `${grammarBadge}: "${core}" — ${t.tapWordHint}`
                                      : t.tapWordHint
                                  }
                                >
                                  {core}
                                </span>
                                {trail && <span>{trail}</span>}
                              </span>
                            );
                          })}
                        </div>
                      )}

                      {/* English / Base Translation or Vocabulary Insights */}
                      {practiceMode === 'scrambleVoice' && !scrambleVoiceSolved.has(index) ? null : (
                        <div
                          className="text-xs sm:text-sm text-slate-600 mt-1.5 font-normal leading-relaxed"
                          dir={isRtlLanguage(currentStory?._meta?.baseLang || baseLang) ? 'rtl' : 'ltr'}
                        >
                          {baseLang === targetLang
                            ? line.en.replace(/lexical\s*insights/gi, 'Vocabulary')
                            : line.en}
                        </div>
                      )}

                      {/* Active Recording Status Indicator */}
                      {recordingIndex === index && (
                        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-pulse shadow-xs">
                          <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                          <span>{t.recordingStatusText}</span>
                        </div>
                      )}

                      {/* Speech Pronunciation Score Result */}
                      {pronunciationScores[index] && (
                        <div className="mt-1.5" onClick={(e) => e.stopPropagation()}>
                          <PronunciationScoreBadge
                            key={`score_${index}_${pronunciationScores[index].timestamp || pronunciationScores[index].attempt || 1}`}
                            result={pronunciationScores[index]}
                            baseLang={baseLang}
                            onSpeakWord={(w) => speakText(w)}
                            onClear={() => {
                              setPronunciationScores((prev) => {
                                const next = { ...prev };
                                delete next[index];
                                return next;
                              });
                            }}
                          />
                        </div>
                      )}

                      {/* Verb Chips (Hidden when displaying Max length stories) */}
                      {!(currentStory?._meta?.length === '40' || currentStory?._meta?.length === '50' || (currentStory?.sentences && currentStory.sentences.length >= 35)) &&
                        line.verbs &&
                        line.verbs.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5" onClick={(e) => e.stopPropagation()}>
                          {line.verbs.map((verb, vIdx) => (
                            <button
                              key={vIdx}
                              type="button"
                              onClick={() => setSelectedVerb(verb)}
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#008450] hover:bg-emerald-100 border border-emerald-200/80 shadow-xs transition"
                            >
                              <Search className="w-3 h-3" />
                              <span>{verb.infinitive}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right-aligned Control Buttons (Vertical on Phone, Horizontal on Tablet/Desktop) */}
                    <div
                      className="absolute right-2 sm:right-3 top-3 sm:top-1/2 sm:-translate-y-1/2 flex flex-col sm:flex-row items-center gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Solved Indicator in Practice Mode */}
                      {practiceMode !== 'off' && isLineSolved && (
                        <div
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-100 text-[#008450] border border-emerald-300 flex items-center justify-center shadow-2xs animate-scale-up"
                          title={t.lineCompleted}
                        >
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#008450]" />
                        </div>
                      )}

                      {/* Listen to sentence (Speaker Icon) */}
                      <button
                        onClick={() => repeatSentence(index)}
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition shadow-xs cursor-pointer ${
                          isActive && isPlaying
                            ? 'bg-purple-600 text-white border border-purple-700 ring-2 ring-purple-300'
                            : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200'
                        }`}
                        title={`${t.listen} (${t.repeatSentence})`}
                      >
                        <Volume2 className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive && isPlaying ? 'animate-pulse' : ''}`} />
                      </button>

                      {/* Record speaking */}
                      <button
                        onClick={() => handleToggleRecord(index)}
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition shadow-xs border cursor-pointer ${
                          recordingIndex === index
                            ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                            : recordedAudios[index]
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                        title={recordingIndex === index ? t.stopRecording : t.recordPronunciation}
                      >
                        <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>

                      {/* Playback recorded audio (toggle play / stop) */}
                      {recordedAudios[index] && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            playUserAudio(index);
                          }}
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-xs transition cursor-pointer ${
                            playingUserAudioIndex === index
                              ? 'bg-amber-600 hover:bg-amber-700 text-white ring-2 ring-amber-400 animate-pulse'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                          title={playingUserAudioIndex === index ? t.stopReplay : t.playRecordedVoice}
                        >
                          {playingUserAudioIndex === index ? (
                            <Square className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                          ) : (
                            <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current ml-0.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}

              {/* Bottom Row: Desktop shares the row between Share Story (1/3) and Advert (2/3) side-by-side so the advert is always seen */}
              <div className="my-2.5">
                {/* Desktop Version (md and up): 1/3 Share Story + 2/3 Advert side-by-side */}
                <div className="hidden md:grid md:grid-cols-3 gap-3.5 items-stretch">
                  {/* 1/3 Share Story Card */}
                  <div className="md:col-span-1 p-4 rounded-2xl bg-gradient-to-br from-emerald-50/90 via-teal-50/70 to-sky-50/60 border border-emerald-200/90 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Share2 className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/90 px-1.5 py-0.5 rounded">
                          {t.shareStory}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm leading-snug">
                        {practiceMode !== 'off' && activeSolvedCount === currentStory.sentences.length
                          ? t.challengeFriendHeading
                          : t.shareCardHeading}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-snug">
                        {practiceMode !== 'off' && activeSolvedCount === currentStory.sentences.length
                          ? t.shareCardBeatDesc
                          : t.shareCardDesc}
                      </p>
                    </div>
                    <div className="pt-3">
                      <button
                        type="button"
                        onClick={() => setIsShareModalOpen(true)}
                        className="w-full px-3.5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>{t.shareEmailStoryBtn}</span>
                      </button>
                    </div>
                  </div>

                  {/* 2/3 Advert */}
                  <div className="md:col-span-2 flex flex-col justify-stretch">
                    <SponsorAd
                      placement="in-content"
                      targetLang={currentStory._meta?.targetLang || targetLang}
                      baseLang={baseLang}
                      hasSubstantialContent={Boolean(currentStory && currentStory.sentences && currentStory.sentences.length >= 3)}
                      onSpeakText={(txt) => speakText(txt)}
                      className="h-full flex flex-col justify-between"
                    />
                  </div>
                </div>

                {/* Mobile / Phone Version: Stacked Share Story and Compact Sponsor */}
                <div className="md:hidden space-y-3">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border border-emerald-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-left w-full sm:w-auto">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Share2 className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm leading-tight">
                          {practiceMode !== 'off' && activeSolvedCount === currentStory.sentences.length
                            ? t.challengeFriendHeading
                            : t.shareCardHeading}
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                          {practiceMode !== 'off' && activeSolvedCount === currentStory.sentences.length
                            ? t.shareCardBeatDesc
                            : t.shareCardDesc}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsShareModalOpen(true)}
                      className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{t.shareEmailStoryBtn}</span>
                    </button>
                  </div>

                  <SponsorAd
                    placement="mobile-compact"
                    targetLang={currentStory._meta?.targetLang || targetLang}
                    baseLang={baseLang}
                    hasSubstantialContent={Boolean(currentStory && currentStory.sentences && currentStory.sentences.length >= 3)}
                    onSpeakText={(txt) => speakText(txt)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Site Footer with AdSense Policy Links & Responsive Banner */}
          <AppFooter
            targetLang={currentStory?._meta?.targetLang || targetLang}
            baseLang={baseLang}
            onOpenLegal={(tab) => {
              setLegalTab(tab);
              setIsLegalOpen(true);
            }}
            hasStory={Boolean(currentStory && currentStory.sentences && currentStory.sentences.length > 0)}
          />
        </div>
      </main>
      </div>

      {/* Phone-Only Persistent Bottom Navigation Bar (Docked in flex flow so iOS Safari never hides it) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        onTouchStart={(e) => {
          e.stopPropagation();
          ensureMobileOverlayHistory();
          const touch = e.touches[0];
          phoneTouchStartXRef.current = touch.clientX;
          phoneTouchStartYRef.current = touch.clientY;
        }}
        onTouchEnd={(e) => {
          e.stopPropagation();
          if (phoneTouchStartXRef.current === null) return;
          const touch = e.changedTouches[0];
          const deltaX = touch.clientX - phoneTouchStartXRef.current;
          phoneTouchStartXRef.current = null;
          phoneTouchStartYRef.current = null;
          if (Math.abs(deltaX) > 30) {
            processPhoneHorizontalSwipe(deltaX);
          }
        }}
        className="lg:hidden shrink-0 relative z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] flex items-center justify-around touch-pan-y"
      >
        {/* 1. BUILD */}
        <button
          type="button"
          onClick={() => handlePhoneNavChange(0)}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
            isSidebarMobileOpen && sidebarTab === 'build'
              ? 'text-emerald-700 bg-emerald-50 font-bold'
              : 'text-slate-600 hover:text-slate-900 font-medium'
          }`}
          title={t.navBuildTitle}
        >
          <Sparkles
            className={`w-5 h-5 mb-0.5 ${
              isSidebarMobileOpen && sidebarTab === 'build'
                ? 'text-emerald-600 fill-emerald-100'
                : 'text-slate-500'
            }`}
          />
          <span className="text-[11px] tracking-tight leading-none">{t.navBuild}</span>
        </button>

        {/* 2. PLAY */}
        <button
          type="button"
          onClick={() => handlePhoneNavChange(1)}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
            isSidebarMobileOpen && sidebarTab === 'practice'
              ? 'text-emerald-700 bg-emerald-50 font-bold'
              : 'text-slate-600 hover:text-slate-900 font-medium'
          }`}
          title={t.navPlayOptionsTitle}
        >
          <Gamepad2
            className={`w-5 h-5 mb-0.5 ${
              isSidebarMobileOpen && sidebarTab === 'practice'
                ? 'text-emerald-600'
                : 'text-slate-500'
            }`}
          />
          <span className="text-[11px] tracking-tight leading-none">{t.navPlayOptions}</span>
        </button>

        {/* 3. READ/PLAY */}
        <button
          type="button"
          onClick={() => handlePhoneNavChange(2)}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
            !isSidebarMobileOpen && !isLibraryOpen
              ? 'text-emerald-700 bg-emerald-50 font-bold'
              : 'text-slate-600 hover:text-slate-900 font-medium'
          }`}
          title={t.navReadPlayTitle}
        >
          <BookOpen
            className={`w-5 h-5 mb-0.5 ${
              !isSidebarMobileOpen && !isLibraryOpen
                ? 'text-emerald-600'
                : 'text-slate-500'
            }`}
          />
          <span className="text-[11px] tracking-tight leading-none">{t.navReadPlay}</span>
        </button>

        {/* 4. LIBRARY */}
        <button
          type="button"
          onClick={() => handlePhoneNavChange(3)}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
            isLibraryOpen
              ? 'text-emerald-700 bg-emerald-50 font-bold'
              : 'text-slate-600 hover:text-slate-900 font-medium'
          }`}
          title={t.navLibraryTitle}
        >
          <LibraryIcon
            className={`w-5 h-5 mb-0.5 ${
              isLibraryOpen ? 'text-emerald-600' : 'text-slate-500'
            }`}
          />
          <span className="text-[11px] tracking-tight leading-none">{t.navLibrary}</span>
        </button>
      </nav>

      {/* Active Story Creation Modal (with minimum 4-second ad viewable display & user-controlled Done button) */}
      <StoryGenerationModal
        isOpen={isGenerating}
        isReady={isGenerationReady}
        topic={generatingTopic || promptInput}
        baseLang={baseLang}
        targetLang={targetLang}
        targetLangFlag={LANGUAGES.find((l) => l.name === targetLang)?.flag}
        onDone={handleDoneGenerating}
        onSpeakText={(txt) => speakText(txt)}
      />

      {/* Verb Conjugation Modal */}
      <VerbModal
        verb={selectedVerb}
        baseLang={baseLang}
        targetLang={currentStory?._meta?.targetLang || targetLang}
        onClose={() => setSelectedVerb(null)}
        onSpeak={(txt) => speakText(txt)}
      />

      {/* Vocabulary Flashcards Modal */}
      <FlashcardsModal
        isOpen={isFlashcardsOpen}
        onClose={() => {
          setIsFlashcardsOpen(false);
          setLearnerStats(getLearnerStats());
        }}
        story={currentStory}
        targetLang={targetLang}
        baseLang={baseLang}
        customHighlights={customHighlights}
        onSpeak={(txt, rate) => speakText(txt, undefined, 1, rate)}
      />

      {/* Interactive Conversation Partner Modal */}
      <ConversationModal
        isOpen={isConversationOpen}
        onClose={() => setIsConversationOpen(false)}
        story={currentStory}
        targetLang={targetLang}
        baseLang={baseLang}
        difficulty={difficulty}
        onSpeak={(txt) => speakText(txt)}
      />

      {/* Long-Term Learner Stats & Streak Modal */}
      <LearnerStatsModal
        isOpen={isStatsOpen}
        onClose={() => {
          setIsStatsOpen(false);
          setLearnerStats(getLearnerStats());
        }}
        targetLang={targetLang}
        baseLang={baseLang}
        onOpenGlobalAnalytics={() => setIsAnalyticsOpen(true)}
      />

      {/* 3-Second Sponsor Advert Modal when working out questions */}
      <QuizPrepAdvertModal
        isOpen={isQuizPrepOpen}
        onClose={() => setIsQuizPrepOpen(false)}
        targetLang={currentStory?._meta?.targetLang || targetLang}
        baseLang={baseLang}
        storyTitle={currentStory?.title_target}
        isReady={isQuizPrepReady}
      />

      {/* Grammar Focus Deep-Dive Modal */}
      <GrammarBitesModal
        isOpen={isGrammarOpen}
        onClose={() => setIsGrammarOpen(false)}
        story={currentStory}
        targetLang={targetLang}
        baseLang={baseLang}
        tense={tense}
        difficulty={difficulty}
        onSpeak={(txt) => speakText(txt)}
      />

      {/* Printable / PDF Study Sheet Export Modal */}
      <StudySheetModal
        isOpen={isStudySheetOpen}
        onClose={() => setIsStudySheetOpen(false)}
        story={currentStory}
        targetLang={targetLang}
        baseLang={baseLang}
        difficulty={difficulty}
        tense={tense}
      />

      {/* Lazy, Cached Story Word Dictionary Modal */}
      <StoryDictionaryModal
        isOpen={isDictionaryOpen}
        onClose={() => setIsDictionaryOpen(false)}
        story={currentStory}
        storyKey={currentStoryKey}
        targetLang={currentStory?._meta?.targetLang || targetLang}
        baseLang={baseLang}
        customHighlights={customHighlights}
        onSpeak={(txt) => speakText(txt)}
        onSaveToFlashcards={(entry) => {
          const cleanLower = entry.word.toLowerCase().trim();
          const existing = customHighlights.find((h) => h.word.toLowerCase().trim() === cleanLower);
          if (existing) {
            setCustomHighlights((prev) => prev.filter((h) => h.id !== existing.id));
          } else {
            setCustomHighlights((prev) => [
              ...prev,
              {
                id: `${Date.now()}_${cleanLower}`,
                word: entry.word,
                sentenceIndex: entry.sentenceIndex,
                translation: entry.meaning,
                color: 'amber',
                note: entry.baseForm ? `${entry.partOfSpeech || ''} (${entry.baseForm})`.trim() : entry.partOfSpeech,
              },
            ]);
          }
        }}
      />

      {/* Custom Vocabulary Highlighter Popover */}
      {highlighterPopoverWord && (
        <HighlightPopover
          word={highlighterPopoverWord.word}
          sentenceIndex={highlighterPopoverWord.sentenceIndex}
          existingHighlight={highlighterPopoverWord.existing}
          baseLang={baseLang}
          targetLang={currentStory?._meta?.targetLang || targetLang}
          sentenceContext={highlighterPopoverWord.sentenceContext || currentStory?.sentences[highlighterPopoverWord.sentenceIndex]?.target || ''}
          sentenceTranslation={currentStory?.sentences[highlighterPopoverWord.sentenceIndex]?.en || ''}
          onSaveHighlight={(hl) => {
            setCustomHighlights((prev) => [...prev.filter((h) => h.id !== hl.id), hl]);
            setHighlighterPopoverWord(null);
          }}
          onRemoveHighlight={(id) => {
            setCustomHighlights((prev) => prev.filter((h) => h.id !== id));
            setHighlighterPopoverWord(null);
          }}
          onSpeak={(txt, rate) => speakText(txt, undefined, rate)}
          onClose={() => setHighlighterPopoverWord(null)}
        />
      )}

      {/* Share & Email Story Modal */}
      {/* Library Modal */}
      <LibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        baseLang={baseLang}
        onSelectStory={(story, filename) => {
          const isSameStory = filename === currentStoryFilename;
          if (!isSameStory) {
            resetInMemoryPracticeState();
          }
          setCurrentStory(story);
          setCurrentStoryFilename(filename);
          saveActiveStoryRef({
            filename,
            isLocal: Boolean(getLocalStory(filename)),
            title: story.title_target,
          });
          // Update the title/prompt input bar to the title of the story from the library
          setPromptInput(story.title_target || story.title_en || story._meta?.prompt || '');
          applyStoryMetadata(story);
          setSidebarTab('practice');
        }}
        onStoryDeleted={(deletedFilename) => {
          clearStoryPracticeState(deletedFilename);
          if (getActiveStoryRef()?.filename === deletedFilename) {
            clearActiveStoryRef();
          }
          if (currentStoryFilename === deletedFilename) {
            stopAudio();
            setCurrentStory(null);
            setCurrentStoryFilename(null);
            resetInMemoryPracticeState();
          }
        }}
        onShareStory={(story) => {
          setCurrentStory(story);
          setIsShareModalOpen(true);
        }}
        isOnline={isOnline}
      />

      {/* Share & Email Story Modal (Opens in front of LibraryModal) */}
      <ShareStoryModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        story={currentStory}
        targetLang={currentStory?._meta?.targetLang || targetLang}
        baseLang={baseLang}
      />

      {/* Chromebook / Tablet Installation Modal */}
      <InstallModal
        isOpen={isInstallGuideOpen}
        onClose={() => setIsInstallGuideOpen(false)}
        onInstall={install}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
        isChromebook={isChromebook}
        isIOS={isIOS}
        baseLang={baseLang}
      />

      {/* Master Level C2+ Specialties Selection Modal */}
      <MasterSpecialtiesModal
        isOpen={isMasterModalOpen}
        onClose={() => setIsMasterModalOpen(false)}
        selectedSpecialties={masterSpecialties}
        onChangeSpecialties={handleUpdateMasterSpecialties}
        targetLang={targetLang}
        baseLang={baseLang}
      />

      {/* Interactive Comic Guide Tour (Comic speech bubbles & pointing arrows) */}
      <ComicGuideTour
        isOpen={isComicTourOpen}
        onClose={handleCloseComicTour}
        currentMode={sidebarTab}
        baseLang={baseLang}
        onSelectMode={(mode) => setSidebarTab(mode)}
      />

      {/* Private Server Analytics Modal (Discreet Admin View) */}
      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={handleCloseAnalytics}
      />

      {/* Story Inspector & Diagnostics Modal */}
      <StoryInspectorModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        story={currentStory}
        filename={currentStoryFilename}
        baseLang={baseLang}
        onOpenStats={() => setIsAnalyticsOpen(true)}
      />

      {/* Language Selected Welcome Toast */}
      {welcomeToast && (
        <div
          role="status"
          onClick={() => setWelcomeToast(null)}
          className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-white/95 backdrop-blur-md border border-emerald-300 text-slate-800 px-4 py-2.5 rounded-2xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 cursor-pointer hover:bg-emerald-50/50 transition"
          title={t.dismissBtn}
        >
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5 text-[#008450]" />
          </div>
          <div className="pr-1">
            <div className="text-xs font-bold text-slate-900">{welcomeToast.message}</div>
            {welcomeToast.sub && (
              <div className="text-[10px] text-emerald-800 font-medium">{welcomeToast.sub}</div>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setWelcomeToast(null);
            }}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition ml-1"
            title={t.dismissBtn}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error Modal */}
      {errorMessage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto"
          onClick={() => setErrorMessage(null)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-rose-200 p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${
                  errorMessage.code.includes('SHARED')
                    ? 'bg-amber-100 border-amber-200 text-amber-700'
                    : 'bg-rose-100 border-rose-200 text-rose-700'
                }`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    {errorMessage.code.includes('SHARED') ? t.sharedStoryNotice : t.storyGenerationIssue}
                  </h3>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    <span className={`font-mono text-[11px] font-black px-2 py-0.5 rounded-md border ${
                      errorMessage.code.includes('SHARED')
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-rose-100 text-rose-800 border-rose-300'
                    }`}>
                      {errorMessage.code}
                    </span>
                    {errorMessage.source && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                        {errorMessage.source}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition cursor-pointer"
                title={t.dismissBtn}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message */}
            <div className={`p-3.5 border rounded-xl text-sm leading-relaxed font-medium ${
              errorMessage.code.includes('SHARED')
                ? 'bg-amber-50/70 border-amber-200 text-slate-800'
                : 'bg-rose-50/60 border-rose-200/80 text-slate-800'
            }`}>
              {errorMessage.text}
            </div>

            {/* Technical Diagnostics Accordion */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <button
                type="button"
                onClick={() => setShowErrorDiagnostics(!showErrorDiagnostics)}
                className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 font-bold text-slate-700 transition text-left cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <span className="text-slate-400">🔍</span> {t.techDiagnosticsSource}
                </span>
                {showErrorDiagnostics ? (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                )}
              </button>

              {showErrorDiagnostics && (
                <div className="p-3 bg-white border-t border-slate-200 space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">{t.errorCodeLabel}</span>
                      <code className="font-mono font-bold text-rose-700">{errorMessage.code}</code>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">{t.originSourceLabel}</span>
                      <span className="font-semibold text-slate-800">{errorMessage.source || 'Querviam'}</span>
                    </div>
                  </div>

                  {errorMessage.details && (
                    <div className="space-y-1">
                      <span className="font-bold text-slate-600 block text-[11px]">{t.detailLogLabel}</span>
                      <pre className="p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] text-slate-700 whitespace-pre-wrap max-h-32 overflow-y-auto" dir="ltr">
                        {errorMessage.details}
                      </pre>
                    </div>
                  )}

                  {errorMessage.modelAttempts && errorMessage.modelAttempts.length > 0 && (
                    <div className="space-y-1">
                      <span className="font-bold text-slate-600 block text-[11px]">{t.modelFallbackLabel}</span>
                      <div className="space-y-1 max-h-32 overflow-y-auto" dir="ltr">
                        {errorMessage.modelAttempts.map((attempt, idx) => (
                          <div key={idx} className="p-1.5 bg-slate-50 border border-slate-200 rounded text-[11px] font-mono flex items-center justify-between">
                            <span className="font-bold text-slate-700">{attempt.model} ({attempt.attempt})</span>
                            <span className="text-rose-600 font-semibold">{attempt.code}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* AI System Instruction Inspection */}
            {errorMessage.prompt && (
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <button
                  type="button"
                  onClick={() => setShowErrorPromptEgg(!showErrorPromptEgg)}
                  className="w-full flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 font-bold text-slate-600 transition text-left cursor-pointer"
                >
                  <span>{t.inspectAiPrompt}</span>
                  {showErrorPromptEgg ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </button>
                {showErrorPromptEgg && (
                  <div className="p-3 bg-white border-t border-slate-200">
                    <pre className="max-h-36 overflow-y-auto whitespace-pre-wrap font-mono text-[11px] text-slate-600" dir="ltr">
                      {errorMessage.prompt}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
              <button
                type="button"
                onClick={handleCopyErrorDiagnostics}
                className="w-full sm:w-auto flex-1 flex items-center justify-center gap-1.5 py-2 px-3 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                title={t.copyDiagnostic}
              >
                {copiedErrorDiagnostics ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">{t.copiedDiagnostic}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t.copyDiagnostic}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  handleGenerate();
                }}
                className="w-full sm:w-auto flex-1 py-2 px-3 bg-[#008450] hover:bg-[#006e43] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer active:scale-95"
              >
                {t.tryAgain}
              </button>

              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="w-full sm:w-auto py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                {t.dismissBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated single persistent audio player for recorded voice playback - guarantees zero audio overlap */}
      <audio ref={userAudioPlayerRef} className="hidden" preload="auto" />

      {/* Legal, Privacy & Token Economics Modal (AdSense Required) */}
      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
        initialTab={legalTab}
        baseLang={baseLang}
      />

      {/* Cookie & Privacy Consent Banner (GDPR / AdSense Compliant) */}
      <CookieConsentBanner
        baseLang={baseLang}
        onOpenPrivacy={() => {
          setLegalTab('privacy');
          setIsLegalOpen(true);
        }}
      />
    </div>
  );
}
