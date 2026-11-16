// Core i18n types, English reference dictionary, and language metadata helpers for Querviam

export interface TourStepText {
  badge: string;
  title: string;
  desc: string;
  tip: string;
}

export interface TranslationDictionary {
  // Header
  promptPlaceholder: string;
  installChromebook: string;
  installGuideTitle: string;
  library: string;
  save: string;
  delete: string;
  listen: string;
  stop: string;
  sentences: string;
  sentencesCount: (count: number) => string;
  dialogue: string;
  story: string;
  savedLocal: string;
  deleteConfirm: (title: string) => string;
  enterTopicAlert: string;
  finishRecordingAlert: string;
  micPermissionAlert: string;

  // Sidebar Header & Tabs
  controlsAndOptions: string;
  createStory: string;
  creatingStory: string;
  practice: string;
  build: string;

  // Sidebar Practice Tab
  practiceActivity: string;
  modeOff: string;
  modeOffDesc: string;
  modeCloze: string;
  modeClozeDesc: string;
  modeMultipleChoice: string;
  modeMultipleChoiceDesc: string;
  modeScramble: string;
  modeScrambleDesc: string;
  modeScrambleVoice?: string;
  modeScrambleVoiceDesc?: string;
  modeScrambleEasy: string;
  modeScrambleEasyDesc: string;
  solved: string;
  resetScoreTooltip: string;
  moreActivities: string;
  speechControls: string;
  speechSpeed: string;
  sentencePause: string;
  speechVoice: string;
  discussionSpeakers: string;
  speakerA: string;
  speakerB: string;
  offlineVoice: string;

  // Sidebar Build Tab
  targetLangToLearn: string;
  baseLangLearningFrom: string;
  learningPair: string;
  difficultyLevel: string;
  diffIntro: string;
  diffBeginner: string;
  diffIntermediate: string;
  diffAdvanced: string;
  tenseFocus: string;
  tenseMixed: string;
  tensePresent: string;
  tensePast: string;
  tenseFuture: string;
  storyLength: string;
  lengthShort: string;
  lengthMedium: string;
  lengthLong: string;
  lengthMax: string;
  formatAndGenre: string;
  nonFiction: string;
  fiction: string;
  includeVerbs: string;

  // Story Overview Card
  highlighter: string;
  speedRun: string;
  cards: string;
  quiz: string;
  grammar: string;
  studySheet: string;
  from: string;

  // Sentences & Exercises
  readyToLearn: string;
  readyToLearnDesc: string;
  revealAnswer: string;
  hideAnswer: string;
  answerLabel: string;
  repeatSentence: string;
  recordPronunciation: string;
  stopRecording: string;
  playRecordedVoice: string;
  lineCompleted: string;
  hearProgress: string;
  rescramble: string;
  allTilesPlaced: string;
  tapToReturnTile: string;
  correct: string;
  perfectWellDone: string;
  notQuiteRight: string;
  tapWordsBelow: string;
  chooseCorrectWord: string;
  wellDoneCorrect: string;
  tryAnotherWord: string;

  // Owl Track
  owlScoreTooltip: (solved: number, total: number) => string;
  owlResetTooltip: string;

  // Speed Run Timer
  speedRunTitle: string;
  speedRunFinished: string;
  speedRunSolvedDesc: (total: number, time: number) => string;
  personalRecord: (time: number) => string;
  tryAgain: string;
  done: string;
  blitz60: string;
  sprint90: string;
  run120: string;
  stopwatch: string;
  pauseTimer: string;
  startTimer: string;
  resetSpeedRun: string;
  exitSpeedRun: string;
  enableSpeedRun: string;

  // Pronunciation Score Badge
  pronunciation: string;
  excellent: string;
  goodEffort: string;
  keepPracticing: string;
  wordByWordAccuracy: string;
  tapWordToListen: string;
  whatWeHeard: string;
  tapToViewPronunciation: string;

  // Toolbar additions
  converse: string;
  studioVoice: string;
  streakBadge: (days: number) => string;
  dueToday: string;
  iSpeakLabel: string;
  targetLanguageLabel: string;
  chooseYourLanguage: string;
  searchLanguage: string;
  quickTopics: string;
  flipLanguages: string;

  // Highlight Popover
  vocabHighlighter: string;
  highlightDesc: string;
  selectedWordLabel: string;
  wordAudioTooltip: string;
  wordTranslationLabel: (baseLang: string) => string;
  wordTranslationPlaceholder: string;
  noteLabel: string;
  notePlaceholder: string;
  colorTag: string;
  saveHighlight: string;
  removeHighlight: string;
  savedToast: string;
  digDeeper: string;
  digDeeperLoading: string;
  etymologyTitle: string;
  originLabel: string;
  relationLabel: (baseLang: string) => string;
  funFactLabel: string;
  cognatesLabel: string;
  copyToNotes: string;
  copiedToNotes: string;

  // Flashcards Modal
  flashcardsTitle: string;
  tabAll: string;
  tabWords: string;
  tabVerbs: string;
  tabHighlights: string;
  tabLearned: string;
  iSpeakBase: string;
  flipInstruction: string;
  slow: string;
  shuffle: string;
  markLearned: string;
  unmarkLearned: string;
  restartDeck: string;
  noCardsMatching: string;
  studyDirectionTargetBase: string;
  studyDirectionBaseTarget: string;

  // Comprehension Quiz Modal
  quizTitle: string;
  questionOf: (current: number, total: number) => string;
  showTranslation: (baseLang: string) => string;
  hideTranslation: (baseLang: string) => string;
  nextQuestion: string;
  seeResults: string;
  perfectScore: string;
  greatEffort: string;
  keepPracticingQuiz: string;
  quizScoreSummary: (score: number, total: number) => string;
  pronounceQuestion: string;

  // Grammar Bites Modal
  grammarTitle: string;
  grammarSubtitle: string;
  ruleLabel: string;
  examplesLabel: string;
  tipLabel: string;
  copyNote: string;
  copied: string;

  // Study Sheet Modal
  studySheetTitle: string;
  printSavePdf: string;
  copyMarkdown: string;
  downloadHtml: string;
  includeSections: string;
  sectionReadingText: string;
  sectionVocab: string;
  sectionGrammar: string;
  sectionFillBlanks: string;
  sectionQuiz: string;
  sectionAnswerKey: string;
  layoutInterlinear: string;
  layoutColumns: string;
  part1Reading: string;
  part2Vocab: string;
  part3Grammar: string;
  part4FillBlanks: string;
  part5Quiz: string;
  part6AnswerKey: string;
  studentName: string;
  date: string;
  scoreLabel: string;

  // Verb Modal
  verbConjugation: string;
  infinitive: string;
  translation: string;
  listenVerb: string;
  close: string;

  // Library Modal
  libraryTitle: string;
  searchPlaceholder: string;
  emptyLibrary: string;
  loadStory: string;
  deleteStory: string;
  localStory: string;

  // Language Recognition & Onboarding
  popularPairs?: string;
  starterScenarios?: string;
  listenGreeting?: string;
  flagSelectionHint?: string;
  welcomeLearnerToast?: (lang: string) => string;

  // === Extended Full-App UI Localization Keys ===
  // App Shell, Sidebar, Mobile Nav & Main View
  languageImmersion: string;
  guide: string;
  guideTitle: string;
  modeBuilder: string;
  modePractice: string;
  craftStory: string;
  interactive: string;
  navBuild: string;
  navPlayOptions: string;
  navReadPlay: string;
  navLibrary: string;
  navBuildTitle: string;
  navPlayOptionsTitle: string;
  navReadPlayTitle: string;
  navLibraryTitle: string;
  flipShort: string;
  topicIdeaLabel: string;
  speakBtn: string;
  listeningBtn: string;
  stopListeningTitle: string;
  speakTopicTitle: string;
  finishedTypingTopic: string;
  dismissKeyboard: string;
  enterTopicTooltip: string;
  teachOwnLangTitle: string;
  teachOwnLangDesc: (lang: string) => string;
  specialtiesBadge: (count: number) => string;
  diffMaster: string;
  chooseDomainsBtn: string;
  chooseDomainsTitle: string;
  generalMastery: string;
  editList: string;
  moreSuffix: string;
  disabledForMax: string;
  disabledForMaxTitle: string;
  modeQuiz: string;
  naForChinese: string;
  chineseQuizOnlyNote: string;
  chineseClozeTooltip: string;
  chineseScrambleTooltip: string;
  shareStory: string;
  shareShort: string;
  shareStoryTitle: string;
  tips: string;
  tipsTitle: string;
  inspect: string;
  inspectTitle: string;
  speakerASofia: string;
  speakerBMarco: string;
  openOptionsSidebar: string;
  selectSpokenLangTitle: string;
  highlighterActiveLabel: string;
  articlesGold: string;
  verbsGreen: string;
  prepositionsBlue: string;
  nounsPurple: string;
  completeBadge: string;
  ofWord: string;
  challengeFriendHeading: string;
  challengeFriendDesc: string;
  challengeFriendBtn: string;
  shareCardHeading: string;
  shareCardDesc: string;
  shareCardBeatDesc: string;
  shareEmailStoryBtn: string;
  recordingStatusText: string;
  stopReplay: string;
  tapWordHint: string;
  typeMissingWord: string;
  sharedStoryNotice: string;
  storyGenerationIssue: string;
  techDiagnosticsSource: string;
  errorCodeLabel: string;
  originSourceLabel: string;
  detailLogLabel: string;
  modelFallbackLabel: string;
  inspectAiPrompt: string;
  copyDiagnostic: string;
  copiedDiagnostic: string;
  dismissBtn: string;
  privacyShort: string;
  termsShort: string;
  aboutShort: string;
  adsensePartner: string;

  // Story Generation Modal
  creatingStoryPrefix: string;
  storyReadyTitle: string;
  storyDoneBtn: string;
  genStepWeaving: string;
  genStepDrafting: (lang: string) => string;
  genStepAdding: string;
  genStepPolishing: string;
  genStepComplete: string;
  langTipTitle: string;
  immersionTechnique: string;
  langTipDesc: string;

  // Contextual Micro Hint
  quickHintLabel: string;
  quickHintBodyPrefix: string;
  quickHintAnyWord: string;
  quickHintBodyMiddle: string;
  quickHintBodySuffix: string;
  gotIt: string;

  // Quiz Prep Modal
  quizPrepTitle: string;
  quizPrepSubtitle: string;
  quizPrepReady: string;
  pedagogicalReview: string;
  immersionTag: (lang: string) => string;
  activeRecallTipsTitle: string;
  activeRecallTip1: string;
  activeRecallTip2: string;
  assemblingQuestions: (title: string) => string;
  allQuestionsReady: string;
  synthesizingWait: string;
  questionsReadyDesc: string;
  doneStartQuiz: string;
  preparingQuestionsSec: (sec: number) => string;
  finalizingQuiz: string;

  // Comprehension Quiz View
  quizChallengeTitle: string;
  quizPerSentenceBadge: string;
  quizChallengeSubtitle: string;
  backToStory: string;
  resetBtn: string;
  newQuestionsBtn: string;
  quizProgressText: (solved: number, total: number) => string;
  peekStoryText: string;
  hideStoryRef: string;
  storyTextPrefix: string;
  challengeMasteredTitle: (total: number) => string;
  challengeMasteredDesc: string;
  practiceAgain: string;
  generateNewQuestions: string;
  readyTestComp: string;
  readyTestCompDesc: string;
  workOutQuestions: string;
  quizCorrectBadge: string;
  quizTryAnother: string;
  listenOriginalSentence: string;
  playingOriginalSentence: string;
  readingOriginalSentence: (num: number, lang: string) => string;
  originalAudioTag: string;
  clickWordQuestionHint: string;
  showQuestionTranslation: string;
  explanationLabel: string;
  hintLabel: string;
  sentenceLabel: (num: number) => string;
  quizWrongHint: string;

  // Scramble & SpeedRun
  dictationModeLabel: string;
  dictationModeDesc: string;
  hideHint: string;
  showHint: string;
  listenToSentence: string;
  slowBtn: string;
  tapWordPreview: string;
  translationPrefix: string;
  dictationCorrectMsg: string;
  challengeFriendTimerBtn: string;

  // Highlight Popover Extra
  pronunciationGuideTitle: string;
  speedLabel: string;
  syllablesStressLabel: string;
  primaryStressLabel: string;
  tonguePlacementLabel: string;
  lipsJawLabel: string;
  airflowVocalLabel: string;
  commonAccentTrapLabel: string;
  rhythmPitchLabel: string;
  soundsLikeLabel: (lang: string) => string;
  memoryHookLabel: string;
  deepenPhonetician: string;
  analyzingPhonetics: string;
  wordSpecificActive: string;
  wordSpecificIdle: string;
  openingInSec: (sec: number) => string;
  doubleCheckedBadge: string;
  verifyingBadge: string;
  verifyingTranslationPlaceholder: string;

  // Verb Modal Extra
  usedInStorySentence: string;
  auxiliaryVerbLabel: string;
  pastParticipleLabel: string;
  gerundLabel: string;
  commonPrepositionLabel: string;
  conjugationParadigm: string;
  tableView: string;
  tenseTabs: string;
  subjectPronoun: string;
  conjugatedForm: string;
  inStoryBadge: string;
  tapVolumeHint: string;
  showCoreTensesOnly: string;
  showExtraTenses: (count: number) => string;
  fullAiParadigm: string;
  expandingBtn: string;
  tensePresentShort: string;
  tensePastShort: string;
  tenseFutureShort: string;
  tenseImperfect: string;
  tenseConditional: string;
  tenseSubjunctive: string;

  // Flashcards Modal Extra
  dueTodayTab: string;
  masteredTab: string;
  directionLabel: string;
  meaningWord: string;
  slowAudioTooltip: string;
  normalAudioTooltip: string;
  noMasteredCards: string;
  noMasteredCardsDesc: string;
  noDueCards: string;
  noDueCardsDesc: string;
  noCardsMatchTitle: string;
  tapCardOrSpace: string;
  highlightCardBadge: string;
  verbCardBadge: string;
  wordCardBadge: string;
  keyConjugationsLabel: string;
  srsRecallPrompt: string;
  srsAgain: string;
  srsHard: string;
  srsGood: string;
  srsEasy: string;
  previousBtn: string;
  nextBtn: string;
  flipCardBtn: string;
  showFrontBtn: string;

  // Grammar Bites Extra
  grammarDeepDiveDesc: (title: string) => string;
  analyzingGrammar: string;
  noGrammarNotes: string;
  inThisStoryLabel: string;
  grammarPointsCovered: (count: number) => string;

  // Study Sheet Extra
  studySheetSubtitle: string;
  sectionsLabel: string;
  sectionNumbers: string;
  sectionWordBank: string;
  layoutLabel: string;
  wordBankTitle: string;
  hintPrefix: string;
  pdfSaveTip: string;
  exportAnkiBtn: string;
  ankiTitle: string;
  ankiSubtitle: string;
  ankiDownloadCsv: string;
  ankiCardsCount: (count: number) => string;

  // Library Modal Extra
  myStoriesTab: string;
  samplesTab: string;
  offlineBadge: string;
  librarySubtitle: string;
  importStoryBtn: string;
  privateDeviceStorageTitle: string;
  privateDeviceStorageDesc: string;
  starterSamplesTitle: string;
  starterSamplesDesc: string;
  searchLibraryPlaceholder: string;
  filtersBtn: string;
  sortLabel: string;
  sortDate: string;
  sortTitle: string;
  activeLabel: string;
  resetBtnLabel: string;
  allLanguages: string;
  allLevels: string;
  allTenses: string;
  allLengths: string;
  allFormats: string;
  allGenres: string;
  resetAllBtn: string;
  storiesFound: (count: number) => string;
  clearFiltersBtn: string;
  loadingLibrary: string;
  emptyPrivateLibraryTitle: string;
  emptyPrivateLibraryDesc: string;
  browseStarterSamplesBtn: string;
  noMatchingStoriesTitle: string;
  noMatchingStoriesDesc: string;
  openBtn: string;
  sampleBadge: string;
  privateBadge: string;
  filterStoriesBtn: string;
  showNStoriesBtn: (count: number) => string;

  // Share Story Modal
  shareStoryTitleModal: string;
  shareStorySubtitle: string;
  shortLinkBadge: string;
  shareWithFriendsTab: string;
  emailThisStoryTab: string;
  whereReadSendEmail: string;
  defaultApp: string;
  friendEmailPlaceholder: string;
  openInEmailBtn: (app: string) => string;
  includeStoryText: string;
  withTranslations: (lang: string) => string;
  previewEmailMsg: string;
  hidePreview: string;
  copyFullStoryMsg: string;
  copiedFullMsg: string;
  shortStoryLink: string;
  directStoryLink: string;
  copyLink: string;
  copiedExcl: string;
  sendViaMessaging: string;
  moreBtn: string;

  // Conversation Modal
  conversationPartnerTitle: string;
  aboutPrefix: string;
  hideBtn: string;
  translateBtn: string;
  coachTipLabel: string;
  thinkingInLang: (lang: string) => string;
  suggestionsLabel: string;
  listeningInLang: (lang: string) => string;
  doneSpeaking: string;
  exitBtn: string;
  typeOrSpeakIn: (lang: string) => string;

  // Learner Stats Modal
  statsModalTitle: string;
  learningJourney: string;
  daySingular: string;
  daysPlural: string;
  dailyStreakTitle: string;
  bestStreakLabel: (count: number) => string;
  last7Days: string;
  wordsReadLabel: string;
  vocabularyLabel: string;
  learnedLabel: string;
  activeMemoryRetention: string;
  practiceTimeLabel: string;
  minUnit: string;
  immersionAudioReading: string;
  readingLevelLabel: string;
  nextGoalWords: (count: number) => string;
  readingFluencyMilestone: string;
  motivationQuote: string;
  keepLearningBtn: string;

  // Master Specialties Modal
  masterSpecialtiesTitle: string;
  specialistTierBadge: string;
  masterSpecialtiesSubtitle: (lang: string) => string;
  activeSelectionLabel: string;
  selectedCountBadge: (count: number) => string;
  clearAllBtn: string;
  searchDomainsPlaceholder: string;
  catAllDomains: string;
  catLawBiz: string;
  catScienceTech: string;
  catMedicine: string;
  catHumanities: string;
  catCulture: string;
  noSpecialtiesFound: (q: string) => string;
  noSpecialtiesSelected: string;
  activeCountLabel: (count: number) => string;
  saveApplySpecialtiesBtn: string;

  // Comic Guide Tour
  quickGuideTitle: string;
  quickGuideSubtitle: string;
  comicGuideTitle: string;
  buildModeTab: string;
  practiceModeTab: string;
  buildShortTab: string;
  practiceShortTab: string;
  showAllBtn: string;
  stepByStepBtn: string;
  stepCounter: (cur: number, total: number) => string;
  backBtn: string;
  nextStepBtn: string;
  nextBtnLabel: string;
  startBtnLabel: string;
  gotItLetsBuild: string;
  gotItReadyLearn: string;
  pointToSection: string;
  tourBuildSteps: TourStepText[];
  tourPracticeSteps: TourStepText[];

  // Install Modal
  installModalTitle: string;
  installModalSubtitle: string;
  appAlreadyInstalled: string;
  appAlreadyInstalledDesc: string;
  readyOneClickInstall: string;
  readyOneClickInstallDesc: string;
  installQuerviamNow: string;
  chromebookExpTitle: string;
  installToShelfTitle: string;
  installToShelfDesc: string;
  standaloneWindowTitle: string;
  standaloneWindowDesc: string;
  offlineReadyTitle: string;
  offlineReadyDesc: string;
  tabletFeaturesTitle: string;
  tapToPlaceTitle: string;
  tapToPlaceDesc: string;
  offlineVoicesTitle: string;
  offlineVoicesDesc: string;
  micRecordingTitle: string;
  micRecordingDesc: string;
  keyboardShortcutsTitle: string;

  // Story Inspector Modal
  inspectorTitle: string;
  inspectorSubtitle: string;
  overviewTab: string;
  sentencesTab: (count: number) => string;
  rawJsonTab: string;
  discrepancyTitle: string;
  discrepancyDesc: (req: string, actual: number) => string;
  generatedAsRequested: (count: number) => string;
  targetTitleLabel: string;
  translationSubtitleLabel: string;
  targetLangLabel: string;
  difficultyTenseLabel: string;
  sentenceCountLabel: string;
  filenameLabel: string;
  promptSeedLabel: string;
  parsedSentencesList: string;
  rawJsonLabel: string;
  copyJsonBtn: string;
  copyStoryJsonBtn: string;
  copiedClipboard: string;

  // Cookie Banner & Footer & Legal
  cookieBannerTitle: string;
  cookieBannerDesc: string;
  privacyPolicyLink: string;
  essentialOnlyBtn: string;
  acceptAllBtn: string;
  footerLibrary: string;
  footerAbout: string;
  footerPrivacy: string;
  footerTerms: string;
  footerContact: string;
  footerTagline: string;
  footerAdSupport: string;
  footerCopyright: (year: number) => string;
  legalModalTitle: string;
  legalModalSubtitle: string;

  // Story Dictionary Modal
  storyDictionary: string;
  storyDictionaryTitle: string;
  storyDictionarySubtitle: string;
  reviewStoryDictionary: string;
  loadingDictionary: string;
  searchDictionaryPlaceholder: string;
  allPartsOfSpeech: string;
  posNoun: string;
  posVerb: string;
  posAdj: string;
  posOther: string;
  sortStoryOrder: string;
  sortAZ: string;
  baseFormLabel: string;
  sentenceRef: (num: number) => string;
  addToFlashcards: string;
  addedToFlashcards: string;
  cachedOfflineLabel: string;
  loadMoreWordsBtn: (count: number) => string;
  noDictionaryMatches: string;
  wordsCountBadge: (count: number) => string;
}

export const RTL_LANGUAGES = new Set(['arabic', 'hebrew', 'urdu']);

export function isRtlLanguage(lang?: string): boolean {
  if (!lang) return false;
  return RTL_LANGUAGES.has(lang.toLowerCase().trim());
}

const HTML_LANG_MAP: Record<string, string> = {
  afrikaans: 'af',
  arabic: 'ar',
  bengali: 'bn',
  'chinese (mandarin)': 'zh-CN',
  chinese: 'zh-CN',
  cymraeg: 'cy',
  czech: 'cs',
  danish: 'da',
  dutch: 'nl',
  english: 'en',
  filipino: 'fil',
  finnish: 'fi',
  french: 'fr',
  german: 'de',
  greek: 'el',
  hebrew: 'he',
  hindi: 'hi',
  hungarian: 'hu',
  indonesian: 'id',
  italian: 'it',
  japanese: 'ja',
  korean: 'ko',
  marathi: 'mr',
  norwegian: 'nb',
  polish: 'pl',
  portuguese: 'pt',
  romanian: 'ro',
  russian: 'ru',
  spanish: 'es',
  swedish: 'sv',
  tamil: 'ta',
  telugu: 'te',
  thai: 'th',
  turkish: 'tr',
  ukrainian: 'uk',
  urdu: 'ur',
  vietnamese: 'vi',
  welsh: 'cy',
};

export function getHtmlLangCode(lang?: string): string {
  if (!lang) return 'en';
  return HTML_LANG_MAP[lang.toLowerCase().trim()] || 'en';
}

export const ENGLISH_TRANSLATIONS: TranslationDictionary = {
  // Header
  promptPlaceholder: 'Give me a topic as a seed for your story...',
  installChromebook: 'Install on Chromebook',
  installGuideTitle: 'Chromebook & Tablet App Guide',
  library: 'Library',
  save: 'Save',
  delete: 'Delete',
  popularPairs: 'Popular Learning Journeys',
  starterScenarios: 'Quick Topic Starters',
  listenGreeting: 'Listen to native greeting',
  flagSelectionHint: 'Quick country select',
  welcomeLearnerToast: (lang: string) => `Welcome! Spoken language set to ${lang}.`,
  listen: 'Listen',
  stop: 'Stop',
  sentences: 'sentences',
  sentencesCount: (count) => `${count} sentences`,
  dialogue: '🎙️ Dialogue',
  story: '📖 Story',
  savedLocal: 'Saved story locally to device memory.',
  deleteConfirm: (title) => `Are you sure you want to delete "${title}"?`,
  enterTopicAlert: 'Please enter a topic for your story.',
  finishRecordingAlert: 'Please finish the current recording first.',
  micPermissionAlert: 'Microphone permission is required to record your voice.',

  // Sidebar Header & Tabs
  controlsAndOptions: 'Controls & Options',
  createStory: 'Create a Story',
  creatingStory: 'Creating Story...',
  practice: 'Practice',
  build: 'Build',

  // Sidebar Practice Tab
  practiceActivity: 'Practice Activity',
  modeOff: 'Reading Mode',
  modeOffDesc: 'Full text & audio listen',
  modeCloze: 'Spelling (Fill in the blanks)',
  modeClozeDesc: 'Type missing keywords and practice spelling',
  modeMultipleChoice: 'Multiple Choice',
  modeMultipleChoiceDesc: 'Select the right word',
  modeScramble: 'Scramble Words',
  modeScrambleDesc: 'Reassemble sentences',
  modeScrambleVoice: 'Scramble (from Dictation)',
  modeScrambleVoiceDesc: 'Listen to native voice audio to rebuild sentences',
  modeScrambleEasy: 'Scramble (Easy)',
  modeScrambleEasyDesc: 'Assisted tile ordering',
  solved: 'Solved',
  resetScoreTooltip: 'Reset score to zero',
  moreActivities: 'More Activities & Tools',
  speechControls: 'Speech Controls',
  speechSpeed: 'Speech Speed',
  sentencePause: 'Sentence Pause',
  speechVoice: 'Speech Voice',
  discussionSpeakers: 'Discussion Speakers',
  speakerA: 'Speaker A',
  speakerB: 'Speaker B',
  offlineVoice: '📶 Offline',

  // Sidebar Build Tab
  targetLangToLearn: '🎯 Target Language (To Learn)',
  baseLangLearningFrom: '🗣️ I Speak',
  learningPair: 'Learning Pair',
  difficultyLevel: 'Difficulty Level',
  diffIntro: 'Introduction',
  diffBeginner: 'Beginner (A1-A2)',
  diffIntermediate: 'Intermediate (B1-B2)',
  diffAdvanced: 'Advanced (C1-C2)',
  tenseFocus: 'Tense Focus',
  tenseMixed: 'Natural / Mixed Tenses',
  tensePresent: 'Present Tense',
  tensePast: 'Past Tense',
  tenseFuture: 'Future Tense',
  storyLength: 'Story Length',
  lengthShort: 'Short (~5)',
  lengthMedium: 'Medium (~10)',
  lengthLong: 'Long (~15)',
  lengthMax: 'Max (~40)',
  formatAndGenre: 'Format & Genre',
  nonFiction: 'Non-Fiction',
  fiction: 'Fiction',
  includeVerbs: 'Include conjugated verbs',

  // Story Overview Card
  highlighter: 'Highlighter',
  speedRun: 'Speed Run',
  cards: 'Cards',
  quiz: 'Quiz',
  grammar: 'Grammar',
  studySheet: 'Study Sheet',
  from: 'from',

  // Sentences & Exercises
  readyToLearn: 'Ready to learn & read',
  readyToLearnDesc: 'Enter a topic above and tap Create a Story, or open the Library to practice bilingual stories on your Chromebook or tablet.',
  revealAnswer: 'Reveal Answer',
  hideAnswer: 'Hide Answer',
  answerLabel: 'Answer:',
  repeatSentence: 'Repeat this sentence',
  recordPronunciation: 'Record Pronunciation',
  stopRecording: 'Stop Recording',
  playRecordedVoice: 'Play your recorded voice',
  lineCompleted: 'Line completed!',
  hearProgress: 'Hear Progress',
  rescramble: 'Rescramble',
  allTilesPlaced: 'All tiles placed',
  tapToReturnTile: 'Tap to return to bank (or drag to swap)',
  correct: 'Correct!',
  perfectWellDone: '✅ Perfect! Well done.',
  notQuiteRight: '❌ Not quite right — tap or replace any wrong tile to try again!',
  tapWordsBelow: 'Tap words below to build your sentence first!',
  chooseCorrectWord: 'Choose the word that correctly fits the sentence:',
  wellDoneCorrect: '🎉 Well done! That is correct.',
  tryAnotherWord: 'Not quite right — try another word!',

  // Owl Track
  owlScoreTooltip: (solved, total) => `Score: ${solved} of ${total} sentences completed`,
  owlResetTooltip: 'Reset score to zero',

  // Speed Run Timer
  speedRunTitle: 'Speed Run',
  speedRunFinished: '⚡ Speed Run Finished!',
  speedRunSolvedDesc: (total, time) => `You solved all ${total} sentences in ${time}s!`,
  personalRecord: (time) => `Personal Record: ${time}s`,
  tryAgain: 'Try Again',
  done: 'Done',
  blitz60: '60s Blitz',
  sprint90: '90s Sprint',
  run120: '120s Run',
  stopwatch: '⏱️ Stopwatch',
  pauseTimer: 'Pause Timer',
  startTimer: 'Start Timer',
  resetSpeedRun: 'Reset Speed Run',
  exitSpeedRun: 'Exit Speed Run Mode',
  enableSpeedRun: 'Enable Timed Speed Run Challenge',

  // Pronunciation Score Badge
  pronunciation: 'Pronunciation',
  excellent: 'Excellent!',
  goodEffort: 'Good Effort',
  keepPracticing: 'Keep practicing',
  wordByWordAccuracy: 'Word-by-word Accuracy',
  tapWordToListen: 'Tap word to listen',
  whatWeHeard: 'What we heard:',
  tapToViewPronunciation: 'Tap to view word-by-word pronunciation accuracy',

  // Toolbar additions
  converse: 'Converse',
  studioVoice: 'Studio Voice',
  streakBadge: (days) => `${days}d Streak`,
  dueToday: 'Due Today',
  iSpeakLabel: '🗣️ I SPEAK',
  targetLanguageLabel: '🎯 Target Language (To Learn)',
  chooseYourLanguage: 'Choose the language you speak',
  searchLanguage: 'Search language / country...',
  quickTopics: 'Popular Starter Topics',
  flipLanguages: 'Swap languages',

  // Highlight Popover
  vocabHighlighter: 'Vocabulary Highlighter',
  highlightDesc: 'Highlight & add to Custom Flashcards',
  selectedWordLabel: 'Selected Word',
  wordAudioTooltip: 'Listen to pronunciation',
  wordTranslationLabel: (base) => `Word Translation (in ${base})`,
  wordTranslationPlaceholder: 'e.g. translation in your language',
  noteLabel: 'Study Note / Reminder (optional)',
  notePlaceholder: 'e.g. feminine noun, irregular past participle...',
  colorTag: 'Color Tag',
  saveHighlight: 'Save to Flashcards',
  removeHighlight: 'Remove Highlight',
  savedToast: 'Saved!',
  digDeeper: '✨ Dig Deeper (Etymology & Roots)',
  digDeeperLoading: 'Tracing linguistic roots & connections...',
  etymologyTitle: 'Etymology & Linguistic Roots',
  originLabel: '🏛️ Historical Origin & Root',
  relationLabel: (base) => `🔗 Connection to ${base}`,
  funFactLabel: '💡 Trivia & Memory Hook',
  cognatesLabel: '🏷️ Related Cognates',
  copyToNotes: 'Copy to Study Notes',
  copiedToNotes: 'Copied to notes!',

  // Flashcards Modal
  flashcardsTitle: 'Flashcards & Vocabulary',
  tabAll: 'All',
  tabWords: '🔤 Words',
  tabVerbs: '⚡ Verbs',
  tabHighlights: '🖍️ Highlights',
  tabLearned: '✅ Learned',
  iSpeakBase: 'I Speak (Base):',
  flipInstruction: 'Tap card or Spacebar to flip',
  slow: 'Slow',
  shuffle: 'Shuffle',
  markLearned: 'I Know This',
  unmarkLearned: 'Learned ✓',
  restartDeck: 'Restart Deck',
  noCardsMatching: 'No cards in this category yet.',
  studyDirectionTargetBase: 'Front: Target → Back: Translation',
  studyDirectionBaseTarget: 'Front: Translation → Back: Target',

  // Comprehension Quiz Modal
  quizTitle: 'Reading Comprehension Quiz',
  questionOf: (current, total) => `Question ${current} of ${total}`,
  showTranslation: (base) => `💡 Show ${base} Translation`,
  hideTranslation: (base) => `Hide ${base}`,
  nextQuestion: 'Next Question',
  seeResults: 'See Results',
  perfectScore: '🎉 Perfect Score!',
  greatEffort: '👏 Great Effort!',
  keepPracticingQuiz: '💪 Keep Practicing!',
  quizScoreSummary: (score, total) => `You scored ${score} out of ${total} questions correctly.`,
  pronounceQuestion: 'Pronounce question',

  // Grammar Bites Modal
  grammarTitle: 'Grammar Focus Deep-Dive',
  grammarSubtitle: 'Key grammar rules & patterns demonstrated in this story',
  ruleLabel: 'Grammar Rule',
  examplesLabel: 'Examples in Context',
  tipLabel: 'Pro Tip',
  copyNote: 'Copy Note',
  copied: 'Copied!',

  // Study Sheet Modal
  studySheetTitle: 'Study Sheet & Printable Worksheet',
  printSavePdf: 'Print / Save PDF',
  copyMarkdown: 'Copy Markdown',
  downloadHtml: 'Download HTML',
  includeSections: 'Include Sections:',
  sectionReadingText: 'Reading Text',
  sectionVocab: 'Vocabulary & Verbs',
  sectionGrammar: 'Grammar Notes',
  sectionFillBlanks: 'Fill-in Blanks',
  sectionQuiz: 'Quiz Questions',
  sectionAnswerKey: 'Answer Key',
  layoutInterlinear: '📝 Interlinear',
  layoutColumns: '⚖️ 2-Columns',
  part1Reading: 'Part 1: Reading Text',
  part2Vocab: 'Part 2: Key Vocabulary & Verbs',
  part3Grammar: 'Part 3: Grammar Points',
  part4FillBlanks: 'Part 4: Fill-in the Blanks Worksheet',
  part5Quiz: 'Part 5: Comprehension Quiz',
  part6AnswerKey: 'Answer Key & Solutions',
  studentName: 'Student:',
  date: 'Date:',
  scoreLabel: 'Score:',

  // Verb Modal
  verbConjugation: 'Verb Conjugation',
  infinitive: 'Infinitive',
  translation: 'Translation',
  listenVerb: 'Listen',
  close: 'Close',

  // Library Modal
  libraryTitle: 'Story Library',
  searchPlaceholder: 'Search stories by title or prompt...',
  emptyLibrary: 'No stories found in library.',
  loadStory: 'Open Story',
  deleteStory: 'Delete',
  localStory: 'Local',

  // === Extended Full-App UI Localization Keys ===
  languageImmersion: 'Language Immersion',
  guide: 'Guide',
  guideTitle: 'Open Interactive Comic Guide',
  modeBuilder: 'Mode: Story Builder',
  modePractice: 'Mode: Practice & Exercises',
  craftStory: 'Craft Story',
  interactive: 'Interactive',
  navBuild: 'Build',
  navPlayOptions: 'Play Options',
  navReadPlay: 'Read/Play',
  navLibrary: 'Library',
  navBuildTitle: 'Build new story or change language (Swipe left to go to Read/Play)',
  navPlayOptionsTitle: 'Play & practice exercises (Swipe to change)',
  navReadPlayTitle: 'Read and play current story (Swipe to change)',
  navLibraryTitle: 'Open Library of saved stories (Swipe right to Read)',
  flipShort: '⇄ Flip',
  topicIdeaLabel: '💡 Story Topic / Idea',
  speakBtn: 'Speak',
  listeningBtn: 'Listening...',
  stopListeningTitle: 'Stop listening',
  speakTopicTitle: 'Speak to input topic idea',
  finishedTypingTopic: 'Finished typing your topic?',
  dismissKeyboard: 'Dismiss Keyboard ▾',
  enterTopicTooltip: 'Please enter a story topic to create a story',
  teachOwnLangTitle: '“Teach Me My Own Language” Mode Active',
  teachOwnLangDesc: (lang) =>
    `Focusing on vocabulary expansion, specialist registers, rhetoric & deep grammar in ${lang}. Subtitles provide lexical insights and synonyms.`,
  specialtiesBadge: (count) => `👑 ${count} Specialties`,
  diffMaster: 'Master (C2+) — Specialist & Native',
  chooseDomainsBtn: '⚙ Choose Domains',
  chooseDomainsTitle: 'Select domains (Law, Finance, Physics, Classical Literature, Slang...)',
  generalMastery: 'General C2+ Mastery',
  editList: 'Edit list',
  moreSuffix: 'more',
  disabledForMax: 'Disabled for Max',
  disabledForMaxTitle: 'Conjugated verbs are disabled for Max length stories to ensure fast, reliable generation.',
  modeQuiz: 'Comprehension Quiz',
  naForChinese: 'N/A for Chinese',
  chineseQuizOnlyNote:
    'In Chinese, words flow together without spaces. Multiple Choice automatically breaks down words, inserts an interactive blank, and joins characters seamlessly.',
  chineseClozeTooltip:
    'Spelling practice is disabled for Chinese as sentences do not use spaces and character typing requires IME composition. Please use Multiple Choice instead!',
  chineseScrambleTooltip:
    'Sentence scramble is disabled for Chinese as sentences do not use spaces between words. Please use Multiple Choice instead!',
  shareStory: 'Share Story',
  shareShort: 'Share',
  shareStoryTitle: 'Email or share this story with friends, students, or classmates',
  tips: 'Tips',
  tipsTitle: 'Quick Tips & Hints',
  inspect: 'Inspect',
  inspectTitle: 'Inspect story details, sentence counts, and diagnostics',
  speakerASofia: '👩 Speaker A (Sofia)',
  speakerBMarco: '👨 Speaker B (Marco)',
  openOptionsSidebar: 'Open Options Sidebar',
  selectSpokenLangTitle: 'Select spoken language',
  highlighterActiveLabel: 'Grammar Highlighter Active:',
  articlesGold: '🏷️ Articles (Gold)',
  verbsGreen: '⚡ Verbs (Green)',
  prepositionsBlue: '🔗 Prepositions & Links (Blue)',
  nounsPurple: '🔤 Nouns & Vocab (Purple)',
  completeBadge: '100% Complete!',
  ofWord: 'of',
  challengeFriendHeading: 'Challenge a friend to beat your time!',
  challengeFriendDesc: 'Share this story with a friend or student and see if they can finish faster than you!',
  challengeFriendBtn: 'Challenge a Friend',
  shareCardHeading: 'Share this story with a friend or student',
  shareCardDesc: 'Recipients immediately open, read, and practice this exact story in 1 click!',
  shareCardBeatDesc: 'Send this story so they can practice and beat your time!',
  shareEmailStoryBtn: 'Share / Email Story',
  recordingStatusText: 'Listening... take your time (stops after 5s silence or tap mic)',
  stopReplay: 'Stop replay',
  tapWordHint: 'Tap word for definition & notes',
  typeMissingWord: 'Type the missing word',
  sharedStoryNotice: 'Shared Story Notice',
  storyGenerationIssue: 'Story Generation Issue',
  techDiagnosticsSource: 'Technical Diagnostics & Source',
  errorCodeLabel: 'Error Code',
  originSourceLabel: 'Origin / Source',
  detailLogLabel: 'Detail Log:',
  modelFallbackLabel: 'Model Fallback Log:',
  inspectAiPrompt: '📜 Inspect AI Prompt & Instructions',
  copyDiagnostic: 'Copy Diagnostic',
  copiedDiagnostic: 'Copied Diagnostic',
  dismissBtn: 'Dismiss',
  privacyShort: 'Privacy',
  termsShort: 'Terms',
  aboutShort: 'About',
  adsensePartner: 'Google AdSense Partner • Privacy Verified',

  // Story Generation Modal
  creatingStoryPrefix: 'Creating you a story for ',
  storyReadyTitle: 'Your story is ready!',
  storyDoneBtn: 'Done • Read Story',
  genStepWeaving: 'Weaving sentences & vocabulary...',
  genStepDrafting: (lang) => `Drafting in ${lang}...`,
  genStepAdding: 'Adding verb notes & bilingual translations...',
  genStepPolishing: 'Polishing audio phonetics & exercises...',
  genStepComplete: 'Complete! Tap Done to start reading.',
  langTipTitle: 'Language Learning Tip',
  immersionTechnique: 'Immersion Technique',
  langTipDesc:
    'Reading graded sentences with audio phonetics builds natural comprehension 3x faster than isolated vocabulary memorization. Click any word in your story for roots and etymology.',

  // Contextual Micro Hint
  quickHintLabel: 'Quick Hint:',
  quickHintBodyPrefix: 'Click or tap ',
  quickHintAnyWord: 'any word',
  quickHintBodyMiddle: ' in the story to hear native pronunciation, view translations, or press ',
  quickHintBodySuffix: ' to uncover historical roots and word origins!',
  gotIt: 'Got it',

  // Quiz Prep Modal
  quizPrepTitle: 'Preparing Comprehension Quiz',
  quizPrepSubtitle: '1 question per sentence • Shuffled order • Audio hints',
  quizPrepReady: 'Ready!',
  pedagogicalReview: 'Pedagogical Review',
  immersionTag: (lang) => `${lang} Immersion`,
  activeRecallTipsTitle: 'Active Recall & Ear-Training Tips:',
  activeRecallTip1: 'Tap the speaker icon on any question to hear the original sentence spoken naturally.',
  activeRecallTip2: 'Click any highlighted word inside questions or answers to see definitions, grammar breakdown, and slow pronunciation.',
  assemblingQuestions: (title) => `Assembling questions for "${title}"...`,
  allQuestionsReady: 'All questions crafted and ready!',
  synthesizingWait: 'Synthesizing grammar distractors and audio hints...',
  questionsReadyDesc: 'Questions ready! Click Start Quiz to begin testing your comprehension.',
  doneStartQuiz: 'Done • Start Quiz',
  preparingQuestionsSec: (sec) => `Preparing questions... (${sec}s)`,
  finalizingQuiz: 'Finalizing quiz...',

  // Comprehension Quiz View
  quizChallengeTitle: 'Sentence Comprehension Challenge',
  quizPerSentenceBadge: '1 per sentence • Shuffled',
  quizChallengeSubtitle: 'Each question corresponds to a sentence from the story. Use the Hint button anytime to hear the original sentence!',
  backToStory: 'Back to Story',
  resetBtn: 'Reset',
  newQuestionsBtn: 'New Questions',
  quizProgressText: (solved, total) => `Comprehension Progress: ${solved} of ${total} answered correctly`,
  peekStoryText: 'Peek at Story Text for Reference',
  hideStoryRef: 'Hide Story Reading Reference',
  storyTextPrefix: 'Story Text:',
  challengeMasteredTitle: (total) => `🎉 Challenge Mastered! All ${total} Questions Solved!`,
  challengeMasteredDesc: 'You successfully answered every comprehension question across the entire reading! Great work on understanding natural sentence structure and meaning.',
  practiceAgain: 'Practice Again',
  generateNewQuestions: 'Generate New Questions',
  readyTestComp: 'Ready to test your comprehension?',
  readyTestCompDesc: 'We will craft 1 question for each sentence in randomized order with audio hints.',
  workOutQuestions: 'Work Out Questions',
  quizCorrectBadge: 'Correct',
  quizTryAnother: 'Try another option',
  listenOriginalSentence: 'Listen to original sentence',
  playingOriginalSentence: 'Playing original sentence...',
  readingOriginalSentence: (num, lang) => `Reading original sentence ${num} in ${lang}... Listen carefully for the answer!`,
  originalAudioTag: 'Original Audio',
  clickWordQuestionHint: '💡 Click any word in the question for definition & roots',
  showQuestionTranslation: 'Show question translation',
  explanationLabel: '✅ Explanation:',
  hintLabel: '💡 Hint:',
  sentenceLabel: (num) => `(Sentence ${num})`,
  quizWrongHint: 'Not quite. Click the button above to hear the sentence again, or try another option!',

  // Scramble & SpeedRun
  dictationModeLabel: 'Listening Dictation Mode',
  dictationModeDesc: 'Listen to native audio & build sentence',
  hideHint: 'Hide translation hint',
  showHint: 'Show translation hint',
  listenToSentence: 'Listen to Sentence',
  slowBtn: 'Slow (0.75x)',
  tapWordPreview: '💡 Tap any word tile below to preview its pronunciation!',
  translationPrefix: 'Translation:',
  dictationCorrectMsg: '🎉 Excellent ear! You transcribed the sentence accurately by listening.',
  challengeFriendTimerBtn: 'Challenge a friend to beat your time!',

  // Highlight Popover Extra
  pronunciationGuideTitle: 'Pronunciation & Mouth Placement Guide',
  speedLabel: 'Speed:',
  syllablesStressLabel: 'Syllables & Stress',
  primaryStressLabel: 'Primary Stress',
  tonguePlacementLabel: 'Tongue Placement',
  lipsJawLabel: 'Lips & Jaw Opening',
  airflowVocalLabel: 'Airflow & Vocal Cords',
  commonAccentTrapLabel: 'Common Accent Trap',
  rhythmPitchLabel: 'Rhythm & Pitch Contour:',
  soundsLikeLabel: (lang) => `Sounds like (${lang}):`,
  memoryHookLabel: 'Physical Memory Hook:',
  deepenPhonetician: 'Deepen with Phonetician',
  analyzingPhonetics: 'Analyzing phonetics...',
  wordSpecificActive: 'Word-specific articulatory analysis active',
  wordSpecificIdle: 'Word-specific phonetic guidance',
  openingInSec: (sec) => `Opening in ${sec}s...`,
  doubleCheckedBadge: '✓ Double-checked',
  verifyingBadge: 'Verifying...',
  verifyingTranslationPlaceholder: 'Verifying translation...',

  // Verb Modal Extra
  usedInStorySentence: 'Used In Your Story Sentence',
  auxiliaryVerbLabel: '⏱️ Auxiliary Verb',
  pastParticipleLabel: '📝 Past Participle',
  gerundLabel: '🌊 Gerund (-ing)',
  commonPrepositionLabel: '🔗 Common Preposition',
  conjugationParadigm: 'Conjugation Paradigm',
  tableView: 'Table View',
  tenseTabs: 'Tense Tabs',
  subjectPronoun: 'Subject / Pronoun',
  conjugatedForm: 'Conjugated Form',
  inStoryBadge: 'in story',
  tapVolumeHint: '💡 Tap any speaker icon to hear pronunciation',
  showCoreTensesOnly: 'Show Core Tenses Only',
  showExtraTenses: (count) => `Show Extra Tenses (+${count})`,
  fullAiParadigm: 'Full AI Paradigm',
  expandingBtn: 'Expanding...',
  tensePresentShort: 'Present',
  tensePastShort: 'Past',
  tenseFutureShort: 'Future',
  tenseImperfect: 'Imperfect',
  tenseConditional: 'Conditional',
  tenseSubjunctive: 'Subjunctive',

  // Flashcards Modal Extra
  dueTodayTab: 'Due Today',
  masteredTab: 'Mastered',
  directionLabel: 'Direction:',
  meaningWord: 'Meaning',
  slowAudioTooltip: 'Slow Audio (0.7x)',
  normalAudioTooltip: 'Normal Audio (1.0x)',
  noMasteredCards: 'No Mastered Cards Yet',
  noMasteredCardsDesc: 'Mark words as Good or Easy to build your mastered list.',
  noDueCards: 'All Caught Up for Today!',
  noDueCardsDesc: 'You have reviewed all due cards in this deck. Switch to All to keep practicing.',
  noCardsMatchTitle: 'No Matching Cards',
  tapCardOrSpace: 'Tap card or Spacebar to reveal',
  highlightCardBadge: 'Highlight Card',
  verbCardBadge: 'Verb Card',
  wordCardBadge: 'Word Card',
  keyConjugationsLabel: 'Key Conjugations',
  srsRecallPrompt: 'SRS Memory Recall — How well did you know this?',
  srsAgain: 'Again',
  srsHard: 'Hard',
  srsGood: 'Good',
  srsEasy: 'Easy',
  previousBtn: 'Previous',
  nextBtn: 'Next',
  flipCardBtn: 'Flip Card',
  showFrontBtn: 'Show Front',

  // Grammar Bites Extra
  grammarDeepDiveDesc: (title) => `Key patterns and rules found in "${title}"`,
  analyzingGrammar: 'Analyzing sentence structures...',
  noGrammarNotes: 'No grammar notes available for this story.',
  inThisStoryLabel: 'In this story:',
  grammarPointsCovered: (count) => `${count} grammar points covered`,

  // Study Sheet Extra
  studySheetSubtitle: 'Customize sections, print worksheets, or export flashcards',
  sectionsLabel: 'Sections:',
  sectionNumbers: 'Numbers',
  sectionWordBank: 'Word Bank',
  layoutLabel: 'Layout:',
  wordBankTitle: 'Word Bank',
  hintPrefix: 'Hint:',
  pdfSaveTip: 'Tip: Choose "Save as PDF" in your print dialog to keep a digital worksheet.',
  exportAnkiBtn: 'Export to Anki / Quizlet',
  ankiTitle: 'Export Flashcards to Anki / Quizlet',
  ankiSubtitle: 'Download a tab/comma-separated file ready for import',
  ankiDownloadCsv: 'Download CSV File',
  ankiCardsCount: (count) => `${count} vocabulary & verb cards ready`,

  // Library Modal Extra
  myStoriesTab: 'My Stories',
  samplesTab: 'Samples',
  offlineBadge: 'Offline',
  librarySubtitle: 'Browse saved stories, starter examples & import shared lessons',
  importStoryBtn: 'Import Story',
  privateDeviceStorageTitle: 'Private Device Storage',
  privateDeviceStorageDesc: 'Stories you create are stored privately on this device only.',
  starterSamplesTitle: 'Built-in Starter Samples',
  starterSamplesDesc: 'Curated sample lessons ready to read and practice right away.',
  searchLibraryPlaceholder: 'Search title, translation, topic...',
  filtersBtn: 'Filters',
  sortLabel: 'Sort:',
  sortDate: 'Date',
  sortTitle: 'Title',
  activeLabel: 'Active:',
  resetBtnLabel: 'Reset',
  allLanguages: 'All Languages',
  allLevels: 'All Levels',
  allTenses: 'All Tenses',
  allLengths: 'All Lengths',
  allFormats: 'All Formats',
  allGenres: 'All Genres',
  resetAllBtn: 'Reset All',
  storiesFound: (count) => `${count} stories found`,
  clearFiltersBtn: 'Clear filters',
  loadingLibrary: 'Loading library stories...',
  emptyPrivateLibraryTitle: 'Your Private Story Library is Empty',
  emptyPrivateLibraryDesc: 'Create a custom story or explore our built-in starter samples.',
  browseStarterSamplesBtn: 'Browse Built-in Starter Samples',
  noMatchingStoriesTitle: 'No matching stories found',
  noMatchingStoriesDesc: 'Try adjusting your search terms or clearing active filters.',
  openBtn: 'Open',
  sampleBadge: 'Sample',
  privateBadge: 'Private',
  filterStoriesBtn: 'Filter Stories',
  showNStoriesBtn: (count) => `Show ${count} Stories`,

  // Share Story Modal
  shareStoryTitleModal: 'Share & Email Story',
  shareStorySubtitle: 'Send this interactive lesson to friends, students, or classmates',
  shortLinkBadge: '30-Day Short Link',
  shareWithFriendsTab: 'Share with Friends',
  emailThisStoryTab: 'Email This Story',
  whereReadSendEmail: 'Where do you read & send email?',
  defaultApp: 'Default App',
  friendEmailPlaceholder: "Friend's email (optional)...",
  openInEmailBtn: (app) => `Open in ${app}`,
  includeStoryText: 'Include story text',
  withTranslations: (lang) => `With ${lang} translations`,
  previewEmailMsg: 'Preview email message',
  hidePreview: 'Hide preview',
  copyFullStoryMsg: 'Copy Full Story Message',
  copiedFullMsg: 'Copied Full Message!',
  shortStoryLink: 'Short Story Link',
  directStoryLink: 'Direct Story Link',
  copyLink: 'Copy Link',
  copiedExcl: 'Copied!',
  sendViaMessaging: 'Send Via Messaging',
  moreBtn: 'More...',

  // Conversation Modal
  conversationPartnerTitle: 'Conversation Partner',
  aboutPrefix: 'About:',
  hideBtn: 'Hide',
  translateBtn: 'Translate',
  coachTipLabel: 'Coach Tip:',
  thinkingInLang: (lang) => `Thinking in ${lang}...`,
  suggestionsLabel: 'Suggestions:',
  listeningInLang: (lang) => `Listening in ${lang}...`,
  doneSpeaking: 'Done Speaking',
  exitBtn: 'Exit',
  typeOrSpeakIn: (lang) => `Type or speak in ${lang}...`,

  // Learner Stats Modal
  statsModalTitle: 'Learner Stats & Progress',
  learningJourney: 'Learning Journey',
  daySingular: 'Day',
  daysPlural: 'Days',
  dailyStreakTitle: 'Daily Streak 🔥',
  bestStreakLabel: (count) => `Best streak: ${count}`,
  last7Days: 'Last 7 Days',
  wordsReadLabel: 'Words Read',
  vocabularyLabel: 'Vocabulary',
  learnedLabel: 'learned',
  activeMemoryRetention: 'Active memory retention',
  practiceTimeLabel: 'Practice Time',
  minUnit: 'min',
  immersionAudioReading: 'Immersion & audio reading',
  readingLevelLabel: 'Reading Level',
  nextGoalWords: (count) => `Next goal: ${count} words`,
  readingFluencyMilestone: 'Reading Fluency Milestone',
  motivationQuote: '"Every sentence read brings you closer to thinking naturally in a new language."',
  keepLearningBtn: 'Keep Learning',

  // Master Specialties Modal
  masterSpecialtiesTitle: 'Master Level Specialties (C2+)',
  specialistTierBadge: 'Specialist Tier',
  masterSpecialtiesSubtitle: (lang) =>
    `Select one or more domains. Stories in ${lang} will weave authentic expert vocabulary, specialized phrasing, and native sophistication.`,
  activeSelectionLabel: 'Active Selection:',
  selectedCountBadge: (count) => `${count} selected`,
  clearAllBtn: 'Clear all',
  searchDomainsPlaceholder: 'Search domains (e.g. law, physics, classical literature, slang, medicine)...',
  catAllDomains: 'All Domains',
  catLawBiz: '⚖️ Law & Business',
  catScienceTech: '⚛️ Science & Tech',
  catMedicine: '🩺 Healthcare',
  catHumanities: '📜 Literary & Arts',
  catCulture: '💬 Colloquial & Life',
  noSpecialtiesFound: (q) => `No specialties found matching "${q}".`,
  noSpecialtiesSelected: 'No specialties selected (default general C2+ mastery will apply).',
  activeCountLabel: (count) => `${count} active:`,
  saveApplySpecialtiesBtn: 'Save & Apply Specialties',

  // Comic Guide Tour
  quickGuideTitle: 'Quick Guide',
  quickGuideSubtitle: 'How Querviam Works in 30 Seconds',
  comicGuideTitle: 'Querviam Comic Guide',
  buildModeTab: '🛠️ Build Mode',
  practiceModeTab: '🎮 Practice Mode',
  buildShortTab: '🛠️ Build',
  practiceShortTab: '🎮 Practice',
  showAllBtn: 'Show All',
  stepByStepBtn: 'Step-by-Step',
  stepCounter: (cur, total) => `Step ${cur} of ${total}`,
  backBtn: 'Back',
  nextStepBtn: 'Next Step',
  nextBtnLabel: 'Next',
  startBtnLabel: 'Start!',
  gotItLetsBuild: "Got It, Let's Build!",
  gotItReadyLearn: 'Got It! Ready to Learn & Build',
  pointToSection: 'Point to this section ➔',
  tourBuildSteps: [
    {
      badge: 'STEP 1',
      title: '🎯 Target Language & I Speak',
      desc: 'Pick your native language and the language you want to master. Querviam adapts all vocabulary, grammar insights, and native audio to this exact language pair.',
      tip: 'Tip: You can hit "⇄ Flip" anytime to practice in reverse!',
    },
    {
      badge: 'STEP 2',
      title: '💡 Story Topic or Seed Idea',
      desc: 'Type any seed idea — like "Ordering coffee in Florence", "A time machine in Kyoto", or "Space exploration". Or tap "Speak" to brainstorm out loud!',
      tip: 'Tip: Even a 2-word topic produces a rich, immersive story.',
    },
    {
      badge: 'STEP 3',
      title: '📊 Difficulty & Specialist Mastery',
      desc: 'Choose from Introduction (A1) up to Advanced (C1-C2). Select "Master (C2+)" to unlock specialized fields like Law, Medicine, or Classical Literature.',
      tip: 'Tip: Beginners get simple sentence structures; Master includes idiomatic nuances.',
    },
    {
      badge: 'STEP 4',
      title: '📖 Format & Fact vs Fiction',
      desc: 'Select a solo narrative Story or a dynamic 2-person Dialogue. Pick "Non-Fiction" for real-world insights, or "Fiction" for imaginative adventures!',
      tip: 'Tip: Dialogues feature dual speaker voices (Speaker A & B)!',
    },
    {
      badge: 'STEP 5',
      title: '🚀 Hit Create a Story!',
      desc: 'Ready? Click "Create a Story" to generate your custom lesson with synchronized audio, phrase-by-phrase translations, and instant interactive exercises.',
      tip: 'Tip: Once generated, stories can be shared with friends via 1-click links!',
    },
  ],
  tourPracticeSteps: [
    {
      badge: 'PRACTICE 1',
      title: '🎮 Interactive Learning Activities',
      desc: 'Reinforce what you learn! Choose from Spelling (Fill in the blanks), Multiple Choice, Sentence Scramble, or audio Dictation mode.',
      tip: 'Tip: Each mode tests a different cognitive skill (listening, spelling, grammar).',
    },
    {
      badge: 'PRACTICE 2',
      title: '🎧 Speech Rate & Voice Options',
      desc: 'Control playback speed (slow down to 0.7x for crystal-clear phonetics), adjust sentence pauses, or toggle Studio HD neural voices.',
      tip: 'Tip: Use the pause slider to give yourself time to repeat after each sentence.',
    },
    {
      badge: 'PRACTICE 3',
      title: '📚 Study Sheets & Grammar Bites',
      desc: 'Access printable study sheets, conjugated verb tables, sentence grammar bites, and share the story with classmates or students.',
      tip: 'Tip: Click "Study Sheet" to view vocabulary breakdowns and print worksheets.',
    },
  ],

  // Install Modal
  installModalTitle: 'Install & Run on Chromebook or Tablet',
  installModalSubtitle: 'Turn Querviam into a 1-click desktop app with offline support',
  appAlreadyInstalled: 'App Already Installed!',
  appAlreadyInstalledDesc: 'Querviam is running in standalone mode on your device. You can access it directly from your Launcher or Shelf.',
  readyOneClickInstall: 'Ready for 1-Click Install',
  readyOneClickInstallDesc: 'Add Querviam directly to your Chromebook Shelf & Launcher.',
  installQuerviamNow: 'Install Querviam Now',
  chromebookExpTitle: 'Chromebook Experience (Chrome OS)',
  installToShelfTitle: 'Install to Shelf',
  installToShelfDesc: "Click the Install icon in Chrome's address bar (or the green button above). Querviam pins to your bottom Shelf and Launcher.",
  standaloneWindowTitle: 'Standalone Window',
  standaloneWindowDesc: 'Opens as a distraction-free window without address bar or browser tabs, just like a native app.',
  offlineReadyTitle: 'Offline Ready',
  offlineReadyDesc: 'The Service Worker caches stories and UI assets so you can practice on flights, buses, or offline classrooms.',
  tabletFeaturesTitle: 'Tablet & Touchscreen Features',
  tapToPlaceTitle: 'Tap-to-Place Scramble Mode:',
  tapToPlaceDesc: 'On touchscreen tablets and Chromebooks, tap any word tile to move it into sentence slots effortlessly.',
  offlineVoicesTitle: 'Built-in Offline Voices:',
  offlineVoicesDesc: 'Chrome OS and Android include built-in text-to-speech voices that work without buffering.',
  micRecordingTitle: 'Pronunciation Mic Recording:',
  micRecordingDesc: 'Tap the microphone icon on any sentence to practice speaking aloud and compare your accent.',
  keyboardShortcutsTitle: '⌨️ Keyboard Shortcuts',

  // Story Inspector Modal
  inspectorTitle: 'Story Diagnostics & Inspector',
  inspectorSubtitle: 'Inspect sentence counts, metadata, and raw JSON',
  overviewTab: 'Overview',
  sentencesTab: (count) => `Sentences (${count})`,
  rawJsonTab: 'Raw JSON',
  discrepancyTitle: 'Sentence Count Discrepancy Detected',
  discrepancyDesc: (req, actual) =>
    `You requested ${req} sentences, but this story contains ${actual} sentence(s).`,
  generatedAsRequested: (count) => `Story generated with ${count} sentences as requested.`,
  targetTitleLabel: 'Target Title',
  translationSubtitleLabel: 'Translation Subtitle',
  targetLangLabel: 'Target Language',
  difficultyTenseLabel: 'Difficulty & Tense',
  sentenceCountLabel: 'Sentence Count',
  filenameLabel: 'Filename',
  promptSeedLabel: 'Prompt Seed',
  parsedSentencesList: 'List of all parsed sentences in this story item:',
  rawJsonLabel: 'Raw JSON data structure:',
  copyJsonBtn: 'Copy JSON',
  copyStoryJsonBtn: 'Copy Story JSON',
  copiedClipboard: 'Copied to Clipboard',

  // Cookie Banner & Footer & Legal
  cookieBannerTitle: 'Cookie & Privacy Notice',
  cookieBannerDesc:
    'Querviam uses local storage to save your reading progress privately on your device, and uses cookies via Google AdSense to serve ads and support free language education.',
  privacyPolicyLink: 'Privacy Policy',
  essentialOnlyBtn: 'Essential Only',
  acceptAllBtn: 'Accept All',
  footerLibrary: 'Reading Library',
  footerAbout: 'About Us',
  footerPrivacy: 'Privacy Policy',
  footerTerms: 'Terms of Service',
  footerContact: 'Contact & Support',
  footerTagline: 'Querviam — Master languages through immersive AI stories & native phonetics.',
  footerAdSupport: 'Supported by Google AdSense advertising to keep language education free for students worldwide.',
  footerCopyright: (year) => `© ${year} Querviam • Gordon Robb • All rights reserved`,
  legalModalTitle: 'Legal, Privacy & Publisher Info',
  legalModalSubtitle: 'Google AdSense policy compliance, privacy protection, and transparent operations',

  // Story Dictionary Modal
  storyDictionary: 'Dictionary',
  storyDictionaryTitle: 'Story Word Dictionary',
  storyDictionarySubtitle: 'Every word in this story with its exact meaning in context',
  reviewStoryDictionary: 'Review Story Dictionary',
  loadingDictionary: 'Building contextual word dictionary...',
  searchDictionaryPlaceholder: 'Search word or translation...',
  allPartsOfSpeech: 'All',
  posNoun: 'Nouns',
  posVerb: 'Verbs',
  posAdj: 'Adjectives',
  posOther: 'Other',
  sortStoryOrder: 'Story Order',
  sortAZ: 'A–Z',
  baseFormLabel: 'Base:',
  sentenceRef: (num) => `Sentence ${num}`,
  addToFlashcards: 'Add to Flashcards',
  addedToFlashcards: 'In Flashcards ✓',
  cachedOfflineLabel: 'Cached',
  loadMoreWordsBtn: (count) => `Load ${count} remaining words`,
  noDictionaryMatches: 'No words match your search or filter.',
  wordsCountBadge: (count) => `${count} words`,
};
