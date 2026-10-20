export type PracticeMode = 'off' | 'cloze' | 'multipleChoice' | 'scramble' | 'scrambleEasy' | 'scrambleVoice' | 'quiz';
export type ContentType = 'story' | 'discussion';

export interface VerbConjugationItem {
  person?: string;
  form: string;
}

export interface VerbItem {
  infinitive: string;
  translation: string;
  contextForm?: string;
  moodAndTense?: string;
  personNumber?: string;
  regularOrIrregular?: 'regular' | 'irregular' | string;
  grammaticalNote?: string;
  auxiliary?: string;
  pastParticiple?: string;
  gerund?: string;
  prepositionPattern?: string;
  conjugations?: {
    [tense: string]: VerbConjugationItem[];
  };
}

export interface SentenceItem {
  speaker?: 'A' | 'B';
  target: string;
  en: string;
  verbs?: VerbItem[];
}

export interface StoryMeta {
  prompt: string;
  targetLang: string;
  baseLang?: string;
  difficulty: string;
  tense: string;
  length: string;
  contentType: ContentType;
  isFact: boolean;
  masterSpecialties?: string[];
}

export interface CustomHighlight {
  id: string;
  word: string;
  sentenceIndex: number;
  translation?: string;
  color?: 'amber' | 'emerald' | 'indigo' | 'rose';
  note?: string;
}

export interface PronunciationScoreResult {
  score: number; // 0 to 100
  recognizedText: string;
  targetText: string;
  wordScores: {
    word: string;
    isMatch: boolean;
  }[];
  attempt?: number;
  timestamp?: number;
}

export interface QuizQuestion {
  id: string;
  sentenceIndex?: number;
  sourceSentenceTarget?: string;
  sourceSentenceEn?: string;
  question_target: string;
  question_en: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GrammarBite {
  id: string;
  title: string;
  rule: string;
  examples: {
    target: string;
    en: string;
  }[];
  tip?: string;
}

export interface StoryData {
  title_target: string;
  title_en: string;
  contentType: ContentType;
  sentences: SentenceItem[];
  _meta?: StoryMeta;
  quiz?: QuizQuestion[];
  grammarBites?: GrammarBite[];
  createdAt?: number;
}

export interface LibraryItemSummary {
  filename: string;
  title_target: string;
  title_en: string;
  contentType?: ContentType;
  _meta?: Partial<StoryMeta>;
  isLocalOnly?: boolean;
  isStarterSample?: boolean;
  createdAt?: number;
}

export interface LearnerStats {
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  activeDates: string[]; // List of YYYY-MM-DD dates active
  totalWordsRead: number;
  totalStoriesCompleted: number;
  practiceMinutes: number;
  knownWordsCount: number;
}

export interface SRSCardData {
  id: string;
  intervalDays: number;
  repetitions: number;
  easeFactor: number;
  nextReviewDate: number; // timestamp in ms
  lastReviewedDate?: number;
  status: 'new' | 'learning' | 'mastered';
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  targetText: string;
  baseText?: string;
  feedbackTip?: string;
  timestamp: number;
}

export interface EtymologyInfo {
  etymology: string;
  connection: string;
  fun_fact: string;
  cognates: string[];
}

export interface PronunciationGuideInfo {
  ipa?: string;
  syllables?: string;
  stressedSyllable?: string;
  tonguePlacement?: string;
  lipAndMouthPosition?: string;
  airflowAndVoicing?: string;
  learnerPitfalls?: string;
  toneOrPitchGuide?: string;
  soundAlike?: string;
  memoryHook?: string;
}

