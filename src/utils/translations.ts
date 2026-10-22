// Internationalization (i18n) translations for Impara
// Localizes all application labels, buttons, tooltips, dialogs, and instructions
// into the language the user is learning from ("baseLang").

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
}

const ENGLISH_TRANSLATIONS: TranslationDictionary = {
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
  practice: '🎯 Practice',
  build: '✨ Build',

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
};

const FRENCH_TRANSLATIONS: Partial<TranslationDictionary> = {
  // Header
  promptPlaceholder: 'Entrez un sujet ou une idée d\'histoire...',
  installChromebook: 'Installer sur Chromebook',
  installGuideTitle: 'Guide pour Chromebook et tablette',
  library: 'Bibliothèque',
  save: 'Enregistrer',
  delete: 'Supprimer',
  listen: 'Écouter',
  stop: 'Arrêter',
  sentences: 'phrases',
  sentencesCount: (count) => `${count} phrases`,
  dialogue: '🎙️ Dialogue',
  story: '📖 Histoire',
  savedLocal: 'Histoire enregistrée dans la mémoire de l\'appareil.',
  deleteConfirm: (title) => `Voulez-vous vraiment supprimer "${title}" ?`,
  enterTopicAlert: 'Veuillez saisir un sujet pour votre histoire.',
  finishRecordingAlert: 'Veuillez terminer l\'enregistrement en cours.',
  micPermissionAlert: 'L\'autorisation du micro est requise pour enregistrer votre voix.',

  // Sidebar Header & Tabs
  controlsAndOptions: 'Commandes et options',
  createStory: 'Créer une histoire',
  creatingStory: 'Création de l\'histoire...',
  practice: '🎯 Pratique',
  build: '✨ Créer',

  // Sidebar Practice Tab
  practiceActivity: 'Activité de pratique',
  modeOff: 'Mode lecture',
  modeOffDesc: 'Texte intégral et écoute audio',
  modeCloze: 'Texte à trous (Compléter)',
  modeClozeDesc: 'Tapez les mots manquants',
  modeMultipleChoice: 'Choix multiple',
  modeMultipleChoiceDesc: 'Sélectionnez le bon mot',
  modeScramble: 'Remettre en ordre',
  modeScrambleDesc: 'Reconstituez les phrases',
  modeScrambleEasy: 'Remettre en ordre (Facile)',
  modeScrambleEasyDesc: 'Placement assisté des mots',
  solved: 'Résolu',
  resetScoreTooltip: 'Remettre le score à zéro',
  moreActivities: 'Plus d\'activités et d\'outils',
  speechControls: 'Contrôles vocaux',
  speechSpeed: 'Vitesse de parole',
  sentencePause: 'Pause entre les phrases',
  speechVoice: 'Voix de synthèse',
  discussionSpeakers: 'Interlocuteurs du dialogue',
  speakerA: 'Locuteur A',
  speakerB: 'Locuteur B',
  offlineVoice: '📶 Hors ligne',

  // Sidebar Build Tab
  targetLangToLearn: '🎯 Langue cible (À apprendre)',
  baseLangLearningFrom: '🗣️ Je parle',
  learningPair: 'Duo linguistique',
  difficultyLevel: 'Niveau de difficulté',
  diffIntro: 'Introduction (Enfants)',
  diffBeginner: 'Débutant (A1-A2)',
  diffIntermediate: 'Intermédiaire (B1-B2)',
  diffAdvanced: 'Avancé (C1-C2)',
  tenseFocus: 'Temps principal',
  tenseMixed: 'Temps naturels / variés',
  tensePresent: 'Présent',
  tensePast: 'Passé',
  tenseFuture: 'Futur',
  storyLength: 'Longueur de l\'histoire',
  lengthShort: 'Court (~5)',
  lengthMedium: 'Moyen (~10)',
  lengthLong: 'Long (~15)',
  lengthMax: 'Max (~40)',
  formatAndGenre: 'Format et genre',
  nonFiction: 'Documentaire / Réel',
  fiction: 'Fiction / Imaginaire',
  includeVerbs: 'Inclure verbes conjugués',

  // Story Overview Card
  highlighter: 'Surligneur',
  speedRun: 'Contre-la-montre',
  cards: 'Cartes',
  quiz: 'Quiz',
  grammar: 'Grammaire',
  studySheet: 'Fiche d\'étude',
  from: 'depuis',

  // Sentences & Exercises
  readyToLearn: 'Prêt à lire et apprendre',
  readyToLearnDesc: 'Saisissez un sujet ci-dessus et appuyez sur Créer une histoire, ou ouvrez la Bibliothèque pour réviser sur Chromebook ou tablette.',
  revealAnswer: 'Afficher la réponse',
  hideAnswer: 'Masquer la réponse',
  answerLabel: 'Réponse :',
  repeatSentence: 'Répéter cette phrase',
  recordPronunciation: 'Enregistrer ma prononciation',
  stopRecording: 'Arrêter l\'enregistrement',
  playRecordedVoice: 'Écouter ma voix enregistrée',
  lineCompleted: 'Phrase validée !',
  hearProgress: 'Écouter l\'avancement',
  rescramble: 'Mélanger à nouveau',
  allTilesPlaced: 'Tous les mots sont placés',
  tapToReturnTile: 'Appuyez pour renvoyer au réservoir (ou glissez pour échanger)',
  correct: 'Correct !',
  perfectWellDone: '✅ Parfait ! Très bien joué.',
  notQuiteRight: '❌ Pas tout à fait — touchez ou remplacez un mot incorrect pour réessayer !',
  tapWordsBelow: 'Touchez les mots ci-dessous pour former votre phrase !',
  chooseCorrectWord: 'Choisissez le mot qui convient parfaitement à la phrase :',
  wellDoneCorrect: '🎉 Bravo ! C\'est exact.',
  tryAnotherWord: 'Pas tout à fait — essayez un autre mot !',

  // Owl Track
  owlScoreTooltip: (solved, total) => `Score : ${solved} sur ${total} phrases complétées`,
  owlResetTooltip: 'Remettre le score à zéro',

  // Speed Run Timer
  speedRunTitle: 'Contre-la-montre',
  speedRunFinished: '⚡ Défi terminé !',
  speedRunSolvedDesc: (total, time) => `Vous avez résolu les ${total} phrases en ${time} secondes !`,
  personalRecord: (time) => `Record personnel : ${time}s`,
  tryAgain: 'Réessayer',
  done: 'Terminé',
  blitz60: '60s Éclair',
  sprint90: '90s Sprint',
  run120: '120s Course',
  stopwatch: '⏱️ Chronomètre',
  pauseTimer: 'Mettre en pause',
  startTimer: 'Démarrer le chrono',
  resetSpeedRun: 'Réinitialiser le chrono',
  exitSpeedRun: 'Quitter le mode chrono',
  enableSpeedRun: 'Activer le mode contre-la-montre',

  // Pronunciation Score Badge
  pronunciation: 'Prononciation',
  excellent: 'Excellent !',
  goodEffort: 'Bel effort !',
  keepPracticing: 'Continuez à vous entraîner',
  wordByWordAccuracy: 'Précision mot par mot',
  tapWordToListen: 'Touchez un mot pour l\'écouter',
  whatWeHeard: 'Ce que nous avons entendu :',
  tapToViewPronunciation: 'Touchez pour voir la précision mot à mot',

  // Highlight Popover
  vocabHighlighter: 'Surligneur de vocabulaire',
  highlightDesc: 'Surlignez et ajoutez à vos cartes mémoire personnalisées',
  wordTranslationLabel: (base) => `Traduction du mot (en ${base})`,
  wordTranslationPlaceholder: 'ex. traduction dans votre langue',
  noteLabel: 'Note personnelle / mémo (facultatif)',
  notePlaceholder: 'ex. nom féminin, participe passé irrégulier...',
  colorTag: 'Couleur du surlignage',
  saveHighlight: 'Ajouter aux cartes',
  removeHighlight: 'Supprimer le surlignage',
  savedToast: 'Enregistré !',

  // Flashcards Modal
  flashcardsTitle: 'Cartes mémoire et vocabulaire',
  tabAll: 'Tout',
  tabWords: '🔤 Mots',
  tabVerbs: '⚡ Verbes',
  tabHighlights: '🖍️ Surlignages',
  tabLearned: '✅ Acquis',
  iSpeakBase: 'Je parle (Référence) :',
  flipInstruction: 'Touchez la carte ou Espace pour retourner',
  slow: 'Lent',
  shuffle: 'Mélanger',
  markLearned: 'Je connais ce mot',
  unmarkLearned: 'Acquis ✓',
  restartDeck: 'Recommencer le paquet',
  noCardsMatching: 'Aucune carte dans cette catégorie pour le moment.',
  studyDirectionTargetBase: 'Recto : Cible → Verso : Traduction',
  studyDirectionBaseTarget: 'Recto : Traduction → Verso : Cible',

  // Comprehension Quiz Modal
  quizTitle: 'Quiz de compréhension écrite',
  questionOf: (current, total) => `Question ${current} sur ${total}`,
  showTranslation: (base) => `💡 Afficher la traduction (${base})`,
  hideTranslation: (base) => `Masquer (${base})`,
  nextQuestion: 'Question suivante',
  seeResults: 'Voir les résultats',
  perfectScore: '🎉 Score parfait !',
  greatEffort: '👏 Bel effort !',
  keepPracticingQuiz: '💪 Continuez à vous entraîner !',
  quizScoreSummary: (score, total) => `Vous avez répondu correctement à ${score} questions sur ${total}.`,
  pronounceQuestion: 'Prononcer la question',

  // Grammar Bites Modal
  grammarTitle: 'Points clés de grammaire',
  grammarSubtitle: 'Règles et structures illustrées dans cette histoire',
  ruleLabel: 'Règle grammaticale',
  examplesLabel: 'Exemples en contexte',
  tipLabel: 'Astuce pratique',
  copyNote: 'Copier la note',
  copied: 'Copié !',

  // Study Sheet Modal
  studySheetTitle: 'Fiche d\'étude et feuille imprimable',
  printSavePdf: 'Imprimer / PDF',
  copyMarkdown: 'Copier Markdown',
  downloadHtml: 'Télécharger HTML',
  includeSections: 'Sections à inclure :',
  sectionReadingText: 'Texte de lecture',
  sectionVocab: 'Vocabulaire & Verbes',
  sectionGrammar: 'Notes de grammaire',
  sectionFillBlanks: 'Texte à trous',
  sectionQuiz: 'Questions de quiz',
  sectionAnswerKey: 'Corrigé',
  layoutInterlinear: '📝 Interlinéaire',
  layoutColumns: '⚖️ 2 Colonnes',
  part1Reading: 'Partie 1 : Texte de lecture',
  part2Vocab: 'Partie 2 : Vocabulaire et verbes clés',
  part3Grammar: 'Partie 3 : Points de grammaire',
  part4FillBlanks: 'Partie 4 : Exercice à trous',
  part5Quiz: 'Partie 5 : Quiz de compréhension',
  part6AnswerKey: 'Corrigé des exercices',
  studentName: 'Élève :',
  date: 'Date :',
  scoreLabel: 'Note :',

  // Verb Modal
  verbConjugation: 'Conjugaison du verbe',
  infinitive: 'Infinitif',
  translation: 'Traduction',
  listenVerb: 'Écouter',
  close: 'Fermer',

  // Library Modal
  libraryTitle: 'Bibliothèque d\'histoires',
  searchPlaceholder: 'Rechercher par titre ou sujet...',
  emptyLibrary: 'Aucune histoire trouvée dans la bibliothèque.',
  loadStory: 'Ouvrir l\'histoire',
  deleteStory: 'Supprimer',
  localStory: 'Local',
};

const NORWEGIAN_TRANSLATIONS: Partial<TranslationDictionary> = {
  // Header
  promptPlaceholder: 'Skriv inn et emne eller historieidé...',
  installChromebook: 'Installer på Chromebook',
  installGuideTitle: 'Veiledning for Chromebook og nettbrett',
  library: 'Bibliotek',
  save: 'Lagre',
  delete: 'Slett',
  listen: 'Lytt',
  stop: 'Stopp',
  sentences: 'setninger',
  sentencesCount: (count) => `${count} setninger`,
  dialogue: '🎙️ Dialog',
  story: '📖 Fortelling',
  savedLocal: 'Historie lagret lokalt på enheten.',
  deleteConfirm: (title) => `Er du sikker på at du vil slette "${title}"?`,
  enterTopicAlert: 'Vennligst oppgi et emne for historien din.',
  finishRecordingAlert: 'Vennligst fullfør gjeldende opptak først.',
  micPermissionAlert: 'Mikrofontilgang kreves for å ta opp stemmen din.',

  // Sidebar Header & Tabs
  controlsAndOptions: 'Kontroller og innstillinger',
  createStory: 'Lag en historie',
  creatingStory: 'Lager historie...',
  practice: '🎯 Øvelse',
  build: '✨ Bygg',

  // Sidebar Practice Tab
  practiceActivity: 'Øvingsaktivitet',
  modeOff: 'Lesemodus',
  modeOffDesc: 'Full tekst og lydavspilling',
  modeCloze: 'Fyll inn (Hultekst)',
  modeClozeDesc: 'Skriv inn manglende ord',
  modeMultipleChoice: 'Flervalg',
  modeMultipleChoiceDesc: 'Velg det riktige ordet',
  modeScramble: 'Ordpuslespill',
  modeScrambleDesc: 'Sett sammen setningene',
  modeScrambleEasy: 'Ordpuslespill (Enkelt)',
  modeScrambleEasyDesc: 'Veiledet ordplassering',
  solved: 'Fullført',
  resetScoreTooltip: 'Nullstill poengsum til null',
  moreActivities: 'Flere aktiviteter og verktøy',
  speechControls: 'Taleinnstillinger',
  speechSpeed: 'Talehastighet',
  sentencePause: 'Pause mellom setninger',
  speechVoice: 'Talestemme',
  discussionSpeakers: 'Dialogtalere',
  speakerA: 'Taler A',
  speakerB: 'Taler B',
  offlineVoice: '📶 Frakoblet',

  // Sidebar Build Tab
  targetLangToLearn: '🎯 Målspråk (Å lære)',
  baseLangLearningFrom: '🗣️ Jeg snakker',
  learningPair: 'Språkpar',
  difficultyLevel: 'Vanskelighetsgrad',
  diffIntro: 'Introduksjon (Nybegynner)',
  diffBeginner: 'Nybegynner (A1-A2)',
  diffIntermediate: 'Mellomnivå (B1-B2)',
  diffAdvanced: 'Viderekommen (C1-C2)',
  tenseFocus: 'Tidsform',
  tenseMixed: 'Naturlig / Blandede tider',
  tensePresent: 'Nåtid (Presens)',
  tensePast: 'Fortid (Preteritum)',
  tenseFuture: 'Framtid (Futurum)',
  storyLength: 'Lengde på historien',
  lengthShort: 'Kort (~5)',
  lengthMedium: 'Middels (~10)',
  lengthLong: 'Lang (~15)',
  lengthMax: 'Maks (~40)',
  formatAndGenre: 'Format og sjanger',
  nonFiction: 'Fakta / Sakprosa',
  fiction: 'Fiksjon / Eventyr',
  includeVerbs: 'Inkluder bøyde verb',

  // Story Overview Card
  highlighter: 'Uthever',
  speedRun: 'Hurtigløp',
  cards: 'Kort',
  quiz: 'Quiz',
  grammar: 'Grammatikk',
  studySheet: 'Arbeidsark',
  from: 'fra',

  // Sentences & Exercises
  readyToLearn: 'Klar til å lese og lære',
  readyToLearnDesc: 'Skriv inn et emne ovenfor og trykk Lag en historie, eller åpne Biblioteket for å øve.',
  revealAnswer: 'Vis svar',
  hideAnswer: 'Skjul svar',
  answerLabel: 'Svar:',
  repeatSentence: 'Gjenta denne setningen',
  recordPronunciation: 'Ta opp uttale',
  stopRecording: 'Stopp opptak',
  playRecordedVoice: 'Spill av opptaket ditt',
  lineCompleted: 'Setning fullført!',
  hearProgress: 'Hør fremgang',
  rescramble: 'Bland på nytt',
  allTilesPlaced: 'Alle ord er plassert',
  tapToReturnTile: 'Trykk for å sende tilbake (eller dra for å bytte)',
  correct: 'Riktig!',
  perfectWellDone: '✅ Perfekt! Bra jobba.',
  notQuiteRight: '❌ Ikke helt riktig — trykk eller bytt ut feil ord for å prøve igjen!',
  tapWordsBelow: 'Trykk på ordene nedenfor for å bygge setningen først!',
  chooseCorrectWord: 'Velg ordet som passer best inn i setningen:',
  wellDoneCorrect: '🎉 Kjempebra! Det er helt riktig.',
  tryAnotherWord: 'Ikke helt — prøv et annet ord!',

  // Owl Track
  owlScoreTooltip: (solved, total) => `Poeng: ${solved} av ${total} setninger fullført`,
  owlResetTooltip: 'Nullstill poengsum til null',

  // Speed Run Timer
  speedRunTitle: 'Hurtigløp',
  speedRunFinished: '⚡ Hurtigløp fullført!',
  speedRunSolvedDesc: (total, time) => `Du løste alle ${total} setningene på ${time} sekunder!`,
  personalRecord: (time) => `Personlig rekord: ${time}s`,
  tryAgain: 'Prøv igjen',
  done: 'Ferdig',
  blitz60: '60s Lynkurs',
  sprint90: '90s Spurt',
  run120: '120s Løp',
  stopwatch: '⏱️ Stoppeklokke',
  pauseTimer: 'Pause',
  startTimer: 'Start tidtaker',
  resetSpeedRun: 'Nullstill tid',
  exitSpeedRun: 'Avslutt hurtigløp',
  enableSpeedRun: 'Aktiver tidsbegrenset hurtigløp',

  // Pronunciation Score Badge
  pronunciation: 'Uttale',
  excellent: 'Utmerket!',
  goodEffort: 'God innsats!',
  keepPracticing: 'Fortsett å øve',
  wordByWordAccuracy: 'Nøyaktighet ord for ord',
  tapWordToListen: 'Trykk på et ord for å høre det',
  whatWeHeard: 'Hva vi hørte:',
  tapToViewPronunciation: 'Trykk for å se detaljert uttalevurdering',

  // Highlight Popover
  vocabHighlighter: 'Ordforrådsuthever',
  highlightDesc: 'Uthev og legg til egne flashkort',
  wordTranslationLabel: (base) => `Oversettelse av ordet (på ${base})`,
  wordTranslationPlaceholder: 'f.eks. oversettelse på ditt språk',
  noteLabel: 'Studienotat / huskeregel (valgfritt)',
  notePlaceholder: 'f.eks. hankjønn, uregelrett fortidsform...',
  colorTag: 'Fargemerke',
  saveHighlight: 'Lagre i flashkort',
  removeHighlight: 'Fjern utheving',
  savedToast: 'Lagret!',

  // Flashcards Modal
  flashcardsTitle: 'Flashkort og ordforråd',
  tabAll: 'Alle',
  tabWords: '🔤 Ord',
  tabVerbs: '⚡ Verb',
  tabHighlights: '🖍️ Uthevede',
  tabLearned: '✅ Lært',
  iSpeakBase: 'Mitt språk (Referanse):',
  flipInstruction: 'Trykk på kortet eller Mellomrom for å snu',
  slow: 'Sakte',
  shuffle: 'Bland',
  markLearned: 'Dette kan jeg',
  unmarkLearned: 'Lært ✓',
  restartDeck: 'Start bunken på nytt',
  noCardsMatching: 'Ingen kort i denne kategorien ennå.',
  studyDirectionTargetBase: 'Forside: Målspråk → Bakside: Oversettelse',
  studyDirectionBaseTarget: 'Forside: Oversettelse → Bakside: Målspråk',

  // Comprehension Quiz Modal
  quizTitle: 'Leseforståelsesquiz',
  questionOf: (current, total) => `Spørsmål ${current} av ${total}`,
  showTranslation: (base) => `💡 Vis oversettelse (${base})`,
  hideTranslation: (base) => `Skjul (${base})`,
  nextQuestion: 'Neste spørsmål',
  seeResults: 'Se resultater',
  perfectScore: '🎉 Full pott!',
  greatEffort: '👏 Godt jobbet!',
  keepPracticingQuiz: '💪 Fortsett å øve!',
  quizScoreSummary: (score, total) => `Du svarte riktig på ${score} av ${total} spørsmål.`,
  pronounceQuestion: 'Uttal spørsmålet',

  // Grammar Bites Modal
  grammarTitle: 'Grammatikkfokus',
  grammarSubtitle: 'Viktige grammatikkregler og mønstre fra denne historien',
  ruleLabel: 'Grammatikkregel',
  examplesLabel: 'Eksempler i kontekst',
  tipLabel: 'Smart tips',
  copyNote: 'Kopier notat',
  copied: 'Kopiert!',

  // Study Sheet Modal
  studySheetTitle: 'Studieark og utskriftsvennlig oppgave',
  printSavePdf: 'Skriv ut / PDF',
  copyMarkdown: 'Kopier Markdown',
  downloadHtml: 'Last ned HTML',
  includeSections: 'Inkluder seksjoner:',
  sectionReadingText: 'Lesetekst',
  sectionVocab: 'Ordforråd og verb',
  sectionGrammar: 'Grammatikknotater',
  sectionFillBlanks: 'Fyll inn tomrom',
  sectionQuiz: 'Quizspørsmål',
  sectionAnswerKey: 'Fasit',
  layoutInterlinear: '📝 Mellomlinjer',
  layoutColumns: '⚖️ 2 kolonner',
  part1Reading: 'Del 1: Lesetekst',
  part2Vocab: 'Del 2: Viktige ord og verb',
  part3Grammar: 'Del 3: Grammatikkpunkter',
  part4FillBlanks: 'Del 4: Fyll inn-oppgaver',
  part5Quiz: 'Del 5: Forståelsesquiz',
  part6AnswerKey: 'Fasit og løsninger',
  studentName: 'Elev:',
  date: 'Dato:',
  scoreLabel: 'Resultat:',

  // Verb Modal
  verbConjugation: 'Verbbøyning',
  infinitive: 'Infinitiv',
  translation: 'Oversettelse',
  listenVerb: 'Lytt',
  close: 'Lukk',

  // Library Modal
  libraryTitle: 'Historiebibliotek',
  searchPlaceholder: 'Søk etter tittel eller emne...',
  emptyLibrary: 'Ingen historier funnet i biblioteket.',
  loadStory: 'Åpne historie',
  deleteStory: 'Slett',
  localStory: 'Lokal',
};

const SPANISH_TRANSLATIONS: TranslationDictionary = {
  // Header
  promptPlaceholder: 'Introduce un tema o sugerencia de historia...',
  installChromebook: 'Instalar en Chromebook',
  installGuideTitle: 'Guía para Chromebook y tablet',
  library: 'Biblioteca',
  save: 'Guardar',
  delete: 'Eliminar',
  popularPairs: 'Rutas de aprendizaje populares',
  starterScenarios: 'Temas rápidos para empezar',
  listenGreeting: 'Escuchar saludo nativo',
  flagSelectionHint: 'Selección rápida por país',
  welcomeLearnerToast: (lang: string) => `¡Bienvenido! Idioma configurado en ${lang}.`,
  listen: 'Escuchar',
  stop: 'Detener',
  sentences: 'oraciones',
  sentencesCount: (count) => `${count} oraciones`,
  dialogue: '🎙️ Diálogo',
  story: '📖 Historia',
  savedLocal: 'Historia guardada localmente en la memoria del dispositivo.',
  deleteConfirm: (title) => `¿Seguro que deseas eliminar "${title}"?`,
  enterTopicAlert: 'Por favor ingresa un tema para tu historia.',
  finishRecordingAlert: 'Por favor termina la grabación actual primero.',
  micPermissionAlert: 'Se requiere permiso de micrófono para grabar tu voz.',

  // Sidebar Header & Tabs
  controlsAndOptions: 'Controles y opciones',
  createStory: 'Crear historia',
  creatingStory: 'Creando historia...',
  practice: '🎯 Práctica',
  build: '✨ Crear',

  // Sidebar Practice Tab
  practiceActivity: 'Actividad de práctica',
  modeOff: 'Modo lectura',
  modeOffDesc: 'Texto completo y audio',
  modeCloze: 'Completar espacios',
  modeClozeDesc: 'Escribe las palabras que faltan',
  modeMultipleChoice: 'Opción múltiple',
  modeMultipleChoiceDesc: 'Elige la palabra correcta',
  modeScramble: 'Ordenar palabras',
  modeScrambleDesc: 'Reconstruye las oraciones',
  modeScrambleEasy: 'Ordenar (Fácil)',
  modeScrambleEasyDesc: 'Colocación asistida de palabras',
  solved: 'Completado',
  resetScoreTooltip: 'Reiniciar puntuación a cero',
  moreActivities: 'Más actividades y herramientas',
  speechControls: 'Controles de voz',
  speechSpeed: 'Velocidad de voz',
  sentencePause: 'Pausa entre oraciones',
  speechVoice: 'Voz de lectura',
  discussionSpeakers: 'Hablantes del diálogo',
  speakerA: 'Hablante A',
  speakerB: 'Hablante B',
  offlineVoice: '📶 Sin conexión',

  // Sidebar Build Tab
  targetLangToLearn: '🎯 Idioma a aprender (Meta)',
  baseLangLearningFrom: '🗣️ Hablo',
  learningPair: 'Pareja lingüística',
  difficultyLevel: 'Nivel de dificultad',
  diffIntro: 'Introducción (Niños)',
  diffBeginner: 'Principiante (A1-A2)',
  diffIntermediate: 'Intermedio (B1-B2)',
  diffAdvanced: 'Avanzado (C1-C2)',
  tenseFocus: 'Tiempo verbal',
  tenseMixed: 'Tiempos naturales / variados',
  tensePresent: 'Presente',
  tensePast: 'Pasado',
  tenseFuture: 'Futuro',
  storyLength: 'Longitud de la historia',
  lengthShort: 'Corta (~5)',
  lengthMedium: 'Media (~10)',
  lengthLong: 'Larga (~15)',
  lengthMax: 'Máxima (~40)',
  formatAndGenre: 'Formato y género',
  nonFiction: 'No ficción / Real',
  fiction: 'Ficción / Cuento',
  includeVerbs: 'Incluir verbos conjugados',

  // Story Overview Card
  highlighter: 'Resaltador',
  speedRun: 'Contrarreloj',
  cards: 'Tarjetas',
  quiz: 'Cuestionario',
  grammar: 'Gramática',
  studySheet: 'Hoja de estudio',
  from: 'desde',

  // Sentences & Exercises
  readyToLearn: 'Listo para leer y aprender',
  readyToLearnDesc: 'Escribe un tema arriba y pulsa Crear historia, o abre la Biblioteca para practicar en tu Chromebook o tablet.',
  revealAnswer: 'Mostrar respuesta',
  hideAnswer: 'Ocultar respuesta',
  answerLabel: 'Respuesta:',
  repeatSentence: 'Repetir esta oración',
  recordPronunciation: 'Grabar pronunciación',
  stopRecording: 'Detener grabación',
  playRecordedVoice: 'Escuchar mi voz grabada',
  lineCompleted: '¡Línea completada!',
  hearProgress: 'Escuchar avance',
  rescramble: 'Mezclar de nuevo',
  allTilesPlaced: 'Todas las palabras colocadas',
  tapToReturnTile: 'Toca para devolver (o arrastra para cambiar)',
  correct: '¡Correcto!',
  perfectWellDone: '✅ ¡Perfecto! Muy bien hecho.',
  notQuiteRight: '❌ Casi — toca o cambia las palabras incorrectas para intentarlo de nuevo.',
  tapWordsBelow: '¡Toca las palabras abajo para armar la oración!',
  chooseCorrectWord: 'Elige la palabra que encaja exactamente en la oración:',
  wellDoneCorrect: '🎉 ¡Excelente! Es correcto.',
  tryAnotherWord: 'Casi — ¡prueba con otra palabra!',

  // Owl Track
  owlScoreTooltip: (solved, total) => `Puntaje: ${solved} de ${total} oraciones completadas`,
  owlResetTooltip: 'Reiniciar puntuación a cero',

  // Speed Run Timer
  speedRunTitle: 'Contrarreloj',
  speedRunFinished: '⚡ ¡Desafío terminado!',
  speedRunSolvedDesc: (total, time) => `¡Resolviste las ${total} oraciones en ${time} segundos!`,
  personalRecord: (time) => `Récord personal: ${time}s`,
  tryAgain: 'Intentar de nuevo',
  done: 'Listo',
  blitz60: '60s Relámpago',
  sprint90: '90s Esprint',
  run120: '120s Carrera',
  stopwatch: '⏱️ Cronómetro',
  pauseTimer: 'Pausar',
  startTimer: 'Iniciar',
  resetSpeedRun: 'Reiniciar',
  exitSpeedRun: 'Salir del modo contrarreloj',
  enableSpeedRun: 'Activar modo contrarreloj',

  // Pronunciation Score Badge
  pronunciation: 'Pronunciación',
  excellent: '¡Excelente!',
  goodEffort: '¡Buen esfuerzo!',
  keepPracticing: 'Sigue practicando',
  wordByWordAccuracy: 'Precisión palabra por palabra',
  tapWordToListen: 'Toca una palabra para escucharla',
  whatWeHeard: 'Lo que escuchamos:',
  tapToViewPronunciation: 'Toca para ver la precisión detallada',

  // Toolbar additions
  converse: 'Conversar',
  studioVoice: 'Voz de estudio',
  streakBadge: (days) => `${days}d Racha`,
  dueToday: 'Para repasar hoy',
  iSpeakLabel: '🗣️ HABLO',
  targetLanguageLabel: '🎯 Idioma a aprender (Objetivo)',
  chooseYourLanguage: 'Elige el idioma que hablas',
  searchLanguage: 'Buscar idioma o país...',
  quickTopics: 'Temas populares para empezar',
  flipLanguages: 'Intercambiar idiomas',

  // Highlight Popover
  vocabHighlighter: 'Resaltador de vocabulario',
  highlightDesc: 'Resalta y guarda en tus tarjetas personalizadas',
  selectedWordLabel: 'Palabra seleccionada',
  wordAudioTooltip: 'Escuchar pronunciación',
  wordTranslationLabel: (base) => `Traducción de la palabra (en ${base})`,
  wordTranslationPlaceholder: 'ej. traducción en tu idioma',
  noteLabel: 'Nota de estudio / recordatorio (opcional)',
  notePlaceholder: 'ej. sustantivo femenino, participio irregular...',
  colorTag: 'Color',
  saveHighlight: 'Guardar en tarjetas',
  removeHighlight: 'Quitar resaltado',
  savedToast: '¡Guardado!',
  digDeeper: '✨ Profundizar (Etimología y raíces)',
  digDeeperLoading: 'Buscando raíces lingüísticas y conexiones...',
  etymologyTitle: 'Etimología y conexión lingüística',
  originLabel: '🏛️ Origen histórico y raíz',
  relationLabel: (base) => `🔗 Conexión con ${base}`,
  funFactLabel: '💡 Curiosidad y mnemotecnia',
  cognatesLabel: '🏷️ Cognados y palabras afines',
  copyToNotes: 'Copiar a notas de estudio',
  copiedToNotes: '¡Copiado a las notas!',

  // Flashcards Modal
  flashcardsTitle: 'Tarjetas de memoria y vocabulario',
  tabAll: 'Todo',
  tabWords: '🔤 Palabras',
  tabVerbs: '⚡ Verbos',
  tabHighlights: '🖍️ Resaltadas',
  tabLearned: '✅ Aprendidas',
  iSpeakBase: 'Mi idioma (Base):',
  flipInstruction: 'Toca la tarjeta o pulsa Espacio para voltear',
  slow: 'Lento',
  shuffle: 'Barajar',
  markLearned: 'Ya lo sé',
  unmarkLearned: 'Aprendido ✓',
  restartDeck: 'Reiniciar mazo',
  noCardsMatching: 'No hay tarjetas en esta categoría aún.',
  studyDirectionTargetBase: 'Frente: Meta → Dorso: Traducción',
  studyDirectionBaseTarget: 'Frente: Traducción → Dorso: Meta',

  // Comprehension Quiz Modal
  quizTitle: 'Cuestionario de comprensión lectora',
  questionOf: (current, total) => `Pregunta ${current} de ${total}`,
  showTranslation: (base) => `💡 Mostrar traducción (${base})`,
  hideTranslation: (base) => `Ocultar (${base})`,
  nextQuestion: 'Siguiente pregunta',
  seeResults: 'Ver resultados',
  perfectScore: '🎉 ¡Puntuación perfecta!',
  greatEffort: '👏 ¡Gran esfuerzo!',
  keepPracticingQuiz: '💪 ¡Sigue practicando!',
  quizScoreSummary: (score, total) => `Respondiste correctamente ${score} de ${total} preguntas.`,
  pronounceQuestion: 'Pronunciar pregunta',

  // Grammar Bites Modal
  grammarTitle: 'Píldoras de gramática',
  grammarSubtitle: 'Reglas y patrones clave demostrados en esta historia',
  ruleLabel: 'Regla gramatical',
  examplesLabel: 'Ejemplos en contexto',
  tipLabel: 'Consejo útil',
  copyNote: 'Copiar nota',
  copied: '¡Copiado!',

  // Study Sheet Modal
  studySheetTitle: 'Hoja de estudio e imprimible',
  printSavePdf: 'Imprimir / PDF',
  copyMarkdown: 'Copiar Markdown',
  downloadHtml: 'Descargar HTML',
  includeSections: 'Secciones a incluir:',
  sectionReadingText: 'Texto de lectura',
  sectionVocab: 'Vocabulario y verbos',
  sectionGrammar: 'Notas de gramática',
  sectionFillBlanks: 'Completar espacios',
  sectionQuiz: 'Preguntas del cuestionario',
  sectionAnswerKey: 'Soluciones',
  layoutInterlinear: '📝 Interlineal',
  layoutColumns: '⚖️ 2 Columnas',
  part1Reading: 'Parte 1: Texto de lectura',
  part2Vocab: 'Parte 2: Vocabulario y verbos clave',
  part3Grammar: 'Parte 3: Puntos de gramática',
  part4FillBlanks: 'Parte 4: Ejercicio de completar',
  part5Quiz: 'Parte 5: Cuestionario de comprensión',
  part6AnswerKey: 'Respuestas y soluciones',
  studentName: 'Estudiante:',
  date: 'Fecha:',
  scoreLabel: 'Calificación:',

  // Verb Modal
  verbConjugation: 'Conjugación verbal',
  infinitive: 'Infinitivo',
  translation: 'Traducción',
  listenVerb: 'Escuchar',
  close: 'Cerrar',

  // Library Modal
  libraryTitle: 'Biblioteca de historias',
  searchPlaceholder: 'Buscar historias por título o tema...',
  emptyLibrary: 'No se encontraron historias en la biblioteca.',
  loadStory: 'Abrir historia',
  deleteStory: 'Eliminar',
  localStory: 'Local',
};

const GERMAN_TRANSLATIONS: Partial<TranslationDictionary> = {
  // Header
  promptPlaceholder: 'Thema oder Geschichte eingeben...',
  installChromebook: 'Auf Chromebook installieren',
  installGuideTitle: 'Chromebook- & Tablet-Anleitung',
  library: 'Bibliothek',
  save: 'Speichern',
  delete: 'Löschen',
  listen: 'Anhören',
  stop: 'Stopp',
  sentences: 'Sätze',
  sentencesCount: (count) => `${count} Sätze`,
  dialogue: '🎙️ Dialog',
  story: '📖 Geschichte',
  savedLocal: 'Geschichte im lokalen Gerätespeicher gespeichert.',
  deleteConfirm: (title) => `Möchten Sie "${title}" wirklich löschen?`,
  enterTopicAlert: 'Bitte geben Sie ein Thema für Ihre Geschichte ein.',
  finishRecordingAlert: 'Bitte beenden Sie zuerst die aktuelle Aufnahme.',
  micPermissionAlert: 'Mikrofonberechtigung ist erforderlich, um Ihre Stimme aufzunehmen.',

  // Sidebar Header & Tabs
  controlsAndOptions: 'Steuerung & Optionen',
  createStory: 'Geschichte erstellen',
  creatingStory: 'Geschichte wird erstellt...',
  practice: '🎯 Üben',
  build: '✨ Erstellen',

  // Sidebar Practice Tab
  practiceActivity: 'Übungsaktivität',
  modeOff: 'Lesemodus',
  modeOffDesc: 'Volltext & Audio anhören',
  modeCloze: 'Lückentext (Ausfüllen)',
  modeClozeDesc: 'Fehlende Wörter eintippen',
  modeMultipleChoice: 'Multiple Choice',
  modeMultipleChoiceDesc: 'Das richtige Wort wählen',
  modeScramble: 'Wörtersalat',
  modeScrambleDesc: 'Sätze zusammensetzen',
  modeScrambleEasy: 'Wörtersalat (Einfach)',
  modeScrambleEasyDesc: 'Unterstütztes Anordnen',
  solved: 'Gelöst',
  resetScoreTooltip: 'Punktzahl auf null zurücksetzen',
  moreActivities: 'Weitere Aktivitäten & Tools',
  speechControls: 'Sprachsteuerung',
  speechSpeed: 'Sprechgeschwindigkeit',
  sentencePause: 'Pause zwischen Sätzen',
  speechVoice: 'Sprechstimme',
  discussionSpeakers: 'Dialog-Sprecher',
  speakerA: 'Sprecher A',
  speakerB: 'Sprecher B',
  offlineVoice: '📶 Offline',

  // Sidebar Build Tab
  targetLangToLearn: '🎯 Zielsprache (Zu lernen)',
  baseLangLearningFrom: '🗣️ Ich spreche',
  learningPair: 'Sprachenpaar',
  difficultyLevel: 'Schwierigkeitsgrad',
  diffIntro: 'Einführung (Kinder)',
  diffBeginner: 'Anfänger (A1-A2)',
  diffIntermediate: 'Mittelstufe (B1-B2)',
  diffAdvanced: 'Fortgeschritten (C1-C2)',
  tenseFocus: 'Zeitform-Fokus',
  tenseMixed: 'Natürlich / Gemischte Zeiten',
  tensePresent: 'Gegenwart (Präsens)',
  tensePast: 'Vergangenheit (Vergangen)',
  tenseFuture: 'Zukunft (Futur)',
  storyLength: 'Geschichtenlänge',
  lengthShort: 'Kurz (~5)',
  lengthMedium: 'Mittel (~10)',
  lengthLong: 'Lang (~15)',
  lengthMax: 'Max (~40)',
  formatAndGenre: 'Format & Genre',
  nonFiction: 'Sachgeschichte / Fakten',
  fiction: 'Fiktion / Erzählung',
  includeVerbs: 'Konjugierte Verben beifügen',

  // Story Overview Card
  highlighter: 'Textmarker',
  speedRun: 'Schnelllauf',
  cards: 'Karten',
  quiz: 'Quiz',
  grammar: 'Grammatik',
  studySheet: 'Arbeitsblatt',
  from: 'aus',

  // Sentences & Exercises
  readyToLearn: 'Bereit zum Lesen und Lernen',
  readyToLearnDesc: 'Geben Sie oben ein Thema ein und tippen Sie auf Geschichte erstellen, oder öffnen Sie die Bibliothek.',
  revealAnswer: 'Antwort aufdecken',
  hideAnswer: 'Antwort verbergen',
  answerLabel: 'Antwort:',
  repeatSentence: 'Diesen Satz wiederholen',
  recordPronunciation: 'Aussprache aufnehmen',
  stopRecording: 'Aufnahme beenden',
  playRecordedVoice: 'Eigene Aufnahme abspielen',
  lineCompleted: 'Satz abgeschlossen!',
  hearProgress: 'Fortschritt anhören',
  rescramble: 'Neu mischen',
  allTilesPlaced: 'Alle Wörter platziert',
  tapToReturnTile: 'Tippen zum Zurücklegen (oder ziehen zum Tauschen)',
  correct: 'Richtig!',
  perfectWellDone: '✅ Perfekt! Sehr gut gemacht.',
  notQuiteRight: '❌ Nicht ganz richtig – tippen oder tauschen Sie falsche Wörter aus!',
  tapWordsBelow: 'Tippen Sie auf die Wörter unten, um den Satz zu bauen!',
  chooseCorrectWord: 'Wählen Sie das Wort, das genau in den Satz passt:',
  wellDoneCorrect: '🎉 Sehr gut! Das ist richtig.',
  tryAnotherWord: 'Nicht ganz – versuchen Sie ein anderes Wort!',

  // Owl Track
  owlScoreTooltip: (solved, total) => `Punktestand: ${solved} von ${total} Sätzen abgeschlossen`,
  owlResetTooltip: 'Punktestand auf null zurücksetzen',

  // Speed Run Timer
  speedRunTitle: 'Schnelllauf',
  speedRunFinished: '⚡ Schnelllauf beendet!',
  speedRunSolvedDesc: (total, time) => `Sie haben alle ${total} Sätze in ${time} Sekunden gelöst!`,
  personalRecord: (time) => `Persönliche Bestzeit: ${time}s`,
  tryAgain: 'Erneut versuchen',
  done: 'Fertig',
  blitz60: '60s Blitz',
  sprint90: '90s Sprint',
  run120: '120s Lauf',
  stopwatch: '⏱️ Stoppuhr',
  pauseTimer: 'Pausieren',
  startTimer: 'Starten',
  resetSpeedRun: 'Zurücksetzen',
  exitSpeedRun: 'Schnelllauf beenden',
  enableSpeedRun: 'Zeitgesteuerten Schnelllauf aktivieren',

  // Pronunciation Score Badge
  pronunciation: 'Aussprache',
  excellent: 'Ausgezeichnet!',
  goodEffort: 'Gute Leistung!',
  keepPracticing: 'Weiter üben',
  wordByWordAccuracy: 'Wort-für-Wort-Genauigkeit',
  tapWordToListen: 'Wort zum Anhören antippen',
  whatWeHeard: 'Was wir gehört haben:',
  tapToViewPronunciation: 'Tippen für detaillierte Ausspracheanalyse',

  // Highlight Popover
  vocabHighlighter: 'Wortschatz-Textmarker',
  highlightDesc: 'Hervorheben und zu eigenen Lernkarten hinzufügen',
  wordTranslationLabel: (base) => `Wortübersetzung (auf ${base})`,
  wordTranslationPlaceholder: 'z.B. Übersetzung in Ihrer Sprache',
  noteLabel: 'Lernnotiz / Gedächtnisstütze (optional)',
  notePlaceholder: 'z.B. weibliches Nomen, unregelmäßiges Partizip...',
  colorTag: 'Farbmarkierung',
  saveHighlight: 'Zu Lernkarten speichern',
  removeHighlight: 'Hervorhebung entfernen',
  savedToast: 'Gespeichert!',

  // Flashcards Modal
  flashcardsTitle: 'Lernkarten & Wortschatz',
  tabAll: 'Alle',
  tabWords: '🔤 Wörter',
  tabVerbs: '⚡ Verben',
  tabHighlights: '🖍️ Textmarker',
  tabLearned: '✅ Gelernt',
  iSpeakBase: 'Meine Sprache (Basis):',
  flipInstruction: 'Karte antippen oder Leertaste zum Umdrehen',
  slow: 'Langsam',
  shuffle: 'Mischen',
  markLearned: 'Ich weiß das',
  unmarkLearned: 'Gelernt ✓',
  restartDeck: 'Stapel neustarten',
  noCardsMatching: 'Noch keine Karten in dieser Kategorie.',
  studyDirectionTargetBase: 'Vorderseite: Zielsprache → Rückseite: Übersetzung',
  studyDirectionBaseTarget: 'Vorderseite: Übersetzung → Rückseite: Zielsprache',

  // Comprehension Quiz Modal
  quizTitle: 'Leseverständnis-Quiz',
  questionOf: (current, total) => `Frage ${current} von ${total}`,
  showTranslation: (base) => `💡 ${base}-Übersetzung anzeigen`,
  hideTranslation: (base) => `${base} ausblenden`,
  nextQuestion: 'Nächste Frage',
  seeResults: 'Ergebnisse ansehen',
  perfectScore: '🎉 Perfekte Punktzahl!',
  greatEffort: '👏 Tolle Leistung!',
  keepPracticingQuiz: '💪 Weiter so!',
  quizScoreSummary: (score, total) => `Sie haben ${score} von ${total} Fragen richtig beantwortet.`,
  pronounceQuestion: 'Frage vorlesen',

  // Grammar Bites Modal
  grammarTitle: 'Grammatik-Schwerpunkte',
  grammarSubtitle: 'Wichtige Grammatikregeln und Strukturen dieser Geschichte',
  ruleLabel: 'Grammatikregel',
  examplesLabel: 'Beispiele im Kontext',
  tipLabel: 'Praxistipp',
  copyNote: 'Notiz kopieren',
  copied: 'Kopiert!',

  // Study Sheet Modal
  studySheetTitle: 'Lernblatt & Druckvorlage',
  printSavePdf: 'Drucken / PDF',
  copyMarkdown: 'Markdown kopieren',
  downloadHtml: 'HTML herunterladen',
  includeSections: 'Abschnitte einschließen:',
  sectionReadingText: 'Lesetext',
  sectionVocab: 'Wortschatz & Verben',
  sectionGrammar: 'Grammatiknotizen',
  sectionFillBlanks: 'Lückentext',
  sectionQuiz: 'Quizfragen',
  sectionAnswerKey: 'Lösungsschlüssel',
  layoutInterlinear: '📝 Interlinear',
  layoutColumns: '⚖️ 2 Spalten',
  part1Reading: 'Teil 1: Lesetext',
  part2Vocab: 'Teil 2: Wichtiger Wortschatz & Verben',
  part3Grammar: 'Teil 3: Grammatikpunkte',
  part4FillBlanks: 'Teil 4: Lückentext-Übung',
  part5Quiz: 'Teil 5: Verständnisquiz',
  part6AnswerKey: 'Lösungen und Antworten',
  studentName: 'Schüler:',
  date: 'Datum:',
  scoreLabel: 'Note/Punkte:',

  // Verb Modal
  verbConjugation: 'Verbkonjugation',
  infinitive: 'Infinitiv',
  translation: 'Übersetzung',
  listenVerb: 'Anhören',
  close: 'Schließen',

  // Library Modal
  libraryTitle: 'Geschichten-Bibliothek',
  searchPlaceholder: 'Geschichten nach Titel oder Thema suchen...',
  emptyLibrary: 'Keine Geschichten in der Bibliothek gefunden.',
  loadStory: 'Geschichte öffnen',
  deleteStory: 'Löschen',
  localStory: 'Lokal',
};

const ITALIAN_TRANSLATIONS: TranslationDictionary = {
  // Header
  promptPlaceholder: 'Inserisci un argomento o spunto per la storia...',
  installChromebook: 'Installa su Chromebook',
  installGuideTitle: 'Guida per Chromebook e tablet',
  library: 'Libreria',
  save: 'Salva',
  delete: 'Elimina',
  popularPairs: 'Percorsi di apprendimento popolari',
  starterScenarios: 'Temi rapidi per iniziare',
  listenGreeting: 'Ascolta saluto nella lingua',
  flagSelectionHint: 'Selezione rapida per paese',
  welcomeLearnerToast: (lang: string) => `Benvenuto! Lingua impostata su ${lang}.`,
  listen: 'Ascolta',
  stop: 'Ferma',
  sentences: 'frasi',
  sentencesCount: (count) => `${count} frasi`,
  dialogue: '🎙️ Dialogo',
  story: '📖 Storia',
  savedLocal: 'Storia salvata localmente nella memoria del dispositivo.',
  deleteConfirm: (title) => `Sei sicuro di voler eliminare "${title}"?`,
  enterTopicAlert: 'Inserisci un argomento per la tua storia.',
  finishRecordingAlert: 'Termina prima la registrazione in corso.',
  micPermissionAlert: 'È necessaria l\'autorizzazione al microfono per registrare la tua voce.',

  // Sidebar Header & Tabs
  controlsAndOptions: 'Controlli e opzioni',
  createStory: 'Crea una storia',
  creatingStory: 'Creazione della storia...',
  practice: '🎯 Pratica',
  build: '✨ Crea',

  // Sidebar Practice Tab
  practiceActivity: 'Attività di pratica',
  modeOff: 'Modalità lettura',
  modeOffDesc: 'Testo integrale e ascolto audio',
  modeCloze: 'Completa gli spazi (Cloze)',
  modeClozeDesc: 'Scrivi le parole mancanti',
  modeMultipleChoice: 'Scelta multipla',
  modeMultipleChoiceDesc: 'Seleziona la parola corretta',
  modeScramble: 'Riordina parole',
  modeScrambleDesc: 'Ricostruisci le frasi',
  modeScrambleEasy: 'Riordina parole (Facile)',
  modeScrambleEasyDesc: 'Posizionamento guidato',
  solved: 'Completato',
  resetScoreTooltip: 'Azzera punteggio',
  moreActivities: 'Altre attività e strumenti',
  speechControls: 'Controlli vocali',
  speechSpeed: 'Velocità di lettura',
  sentencePause: 'Pausa tra le frasi',
  speechVoice: 'Voce di lettura',
  discussionSpeakers: 'Interlocutori del dialogo',
  speakerA: 'Voce A',
  speakerB: 'Voce B',
  offlineVoice: '📶 Offline',

  // Sidebar Build Tab
  targetLangToLearn: '🎯 Lingua da imparare (Obiettivo)',
  baseLangLearningFrom: '🗣️ Parlo',
  learningPair: 'Coppia linguistica',
  difficultyLevel: 'Livello di difficoltà',
  diffIntro: 'Introduzione (Bambini)',
  diffBeginner: 'Principiante (A1-A2)',
  diffIntermediate: 'Intermedio (B1-B2)',
  diffAdvanced: 'Avanzato (C1-C2)',
  tenseFocus: 'Tempo verbale',
  tenseMixed: 'Naturale / Tempi misti',
  tensePresent: 'Presente',
  tensePast: 'Passato',
  tenseFuture: 'Futuro',
  storyLength: 'Lunghezza della storia',
  lengthShort: 'Breve (~5)',
  lengthMedium: 'Media (~10)',
  lengthLong: 'Lunga (~15)',
  lengthMax: 'Massima (~40)',
  formatAndGenre: 'Formato e genere',
  nonFiction: 'Non-fiction / Reale',
  fiction: 'Finzione / Racconto',
  includeVerbs: 'Includi verbi coniugati',

  // Story Overview Card
  highlighter: 'Evidenziatore',
  speedRun: 'A tempo',
  cards: 'Carte',
  quiz: 'Quiz',
  grammar: 'Grammatica',
  studySheet: 'Scheda studio',
  from: 'da',

  // Sentences & Exercises
  readyToLearn: 'Pronto per leggere e imparare',
  readyToLearnDesc: 'Digita un argomento in alto e tocca Crea una storia, oppure apri la Libreria per fare pratica.',
  revealAnswer: 'Mostra risposta',
  hideAnswer: 'Nascondi risposta',
  answerLabel: 'Risposta:',
  repeatSentence: 'Ripeti questa frase',
  recordPronunciation: 'Registra pronuncia',
  stopRecording: 'Ferma registrazione',
  playRecordedVoice: 'Ascolta la tua registrazione',
  lineCompleted: 'Frase completata!',
  hearProgress: 'Ascolta avanzamento',
  rescramble: 'Rimescola',
  allTilesPlaced: 'Tutte le parole posizionate',
  tapToReturnTile: 'Tocca per rimettere a posto (o trascina per scambiare)',
  correct: 'Corretto!',
  perfectWellDone: '✅ Perfetto! Ottimo lavoro.',
  notQuiteRight: '❌ Quasi — tocca o sostituisci le parole sbagliate per riprovare!',
  tapWordsBelow: 'Tocca le parole sotto per formare la frase!',
  chooseCorrectWord: 'Scegli la parola che si inserisce perfettamente nella frase:',
  wellDoneCorrect: '🎉 Ben fatto! È esatto.',
  tryAnotherWord: 'Non del tutto — prova con un\'altra parola!',

  // Owl Track
  owlScoreTooltip: (solved, total) => `Punteggio: ${solved} su ${total} frasi completate`,
  owlResetTooltip: 'Azzera punteggio',

  // Speed Run Timer
  speedRunTitle: 'A tempo',
  speedRunFinished: '⚡ Sfida a tempo completata!',
  speedRunSolvedDesc: (total, time) => `Hai risolto tutte le ${total} frasi in ${time} secondi!`,
  personalRecord: (time) => `Record personale: ${time}s`,
  tryAgain: 'Riprova',
  done: 'Fatto',
  blitz60: '60s Lampo',
  sprint90: '90s Scatto',
  run120: '120s Corsa',
  stopwatch: '⏱️ Cronometro',
  pauseTimer: 'Metti in pausa',
  startTimer: 'Avvia',
  resetSpeedRun: 'Azzera',
  exitSpeedRun: 'Esci dalla modalità a tempo',
  enableSpeedRun: 'Attiva modalità a tempo',

  // Pronunciation Score Badge
  pronunciation: 'Pronuncia',
  excellent: 'Eccellente!',
  goodEffort: 'Buon impegno!',
  keepPracticing: 'Continua a esercitarti',
  wordByWordAccuracy: 'Precisione parola per parola',
  tapWordToListen: 'Tocca una parola per ascoltarla',
  whatWeHeard: 'Cosa abbiamo ascoltato:',
  tapToViewPronunciation: 'Tocca per vedere l\'analisi parola per parola',

  // Toolbar additions
  converse: 'Conversa',
  studioVoice: 'Voce Studio',
  streakBadge: (days) => `${days}g Serie`,
  dueToday: 'In scadenza oggi',
  iSpeakLabel: '🗣️ PARLO',
  targetLanguageLabel: '🎯 Lingua da imparare (Obiettivo)',
  chooseYourLanguage: 'Scegli la lingua che parli',
  searchLanguage: 'Cerca lingua o paese...',
  quickTopics: 'Argomenti consigliati per iniziare',
  flipLanguages: 'Inverti lingue',

  // Highlight Popover
  vocabHighlighter: 'Evidenziatore vocaboli',
  highlightDesc: 'Evidenzia e aggiungi alle tue flashcard personalizzate',
  selectedWordLabel: 'Parola selezionata',
  wordAudioTooltip: 'Ascolta pronuncia',
  wordTranslationLabel: (base) => `Traduzione della parola (in ${base})`,
  wordTranslationPlaceholder: 'es. traduzione nella tua lingua',
  noteLabel: 'Nota di studio / promemoria (facoltativo)',
  notePlaceholder: 'es. sostantivo femminile, participio irregolare...',
  colorTag: 'Colore',
  saveHighlight: 'Salva nelle flashcard',
  removeHighlight: 'Rimuovi evidenziazione',
  savedToast: 'Salvato!',
  digDeeper: '✨ Approfondisci (Etimologia e radici)',
  digDeeperLoading: 'Ricerca radici linguistiche e collegamenti...',
  etymologyTitle: 'Etimologia e collegamento linguistico',
  originLabel: '🏛️ Origine storica e radice',
  relationLabel: (base) => `🔗 Collegamento con ${base}`,
  funFactLabel: '💡 Curiosità e memoria',
  cognatesLabel: '🏷️ Parole imparentate / Cognati',
  copyToNotes: 'Copia nelle note di studio',
  copiedToNotes: '¡Copiato nelle note!',

  // Flashcards Modal
  flashcardsTitle: 'Flashcard e vocaboli',
  tabAll: 'Tutte',
  tabWords: '🔤 Parole',
  tabVerbs: '⚡ Verbi',
  tabHighlights: '🖍️ Evidenziate',
  tabLearned: '✅ Imparate',
  iSpeakBase: 'Mia lingua (Riferimento):',
  flipInstruction: 'Tocca la carta o premi Spazio per girare',
  slow: 'Lento',
  shuffle: 'Mescola',
  markLearned: 'Lo so già',
  unmarkLearned: 'Imparato ✓',
  restartDeck: 'Ricomincia mazzo',
  noCardsMatching: 'Nessuna carta in questa categoria per ora.',
  studyDirectionTargetBase: 'Fronte: Obiettivo → Retro: Traduzione',
  studyDirectionBaseTarget: 'Fronte: Traduzione → Retro: Obiettivo',

  // Comprehension Quiz Modal
  quizTitle: 'Quiz di comprensione del testo',
  questionOf: (current, total) => `Domanda ${current} di ${total}`,
  showTranslation: (base) => `💡 Mostra traduzione (${base})`,
  hideTranslation: (base) => `Nascondi (${base})`,
  nextQuestion: 'Prossima domanda',
  seeResults: 'Vedi risultati',
  perfectScore: '🎉 Punteggio perfetto!',
  greatEffort: '👏 Ottimo impegno!',
  keepPracticingQuiz: '💪 Continua a esercitarti!',
  quizScoreSummary: (score, total) => `Hai risposto correttamente a ${score} domande su ${total}.`,
  pronounceQuestion: 'Pronuncia domanda',

  // Grammar Bites Modal
  grammarTitle: 'Pillole di grammatica',
  grammarSubtitle: 'Regole e strutture chiave dimostrate in questa storia',
  ruleLabel: 'Regola grammaticale',
  examplesLabel: 'Esempi nel contesto',
  tipLabel: 'Consiglio pratico',
  copyNote: 'Copia appunto',
  copied: 'Copiato!',

  // Study Sheet Modal
  studySheetTitle: 'Scheda studio e materiale stampabile',
  printSavePdf: 'Stampa / PDF',
  copyMarkdown: 'Copia Markdown',
  downloadHtml: 'Scarica HTML',
  includeSections: 'Sezioni da includere:',
  sectionReadingText: 'Testo di lettura',
  sectionVocab: 'Vocabolario e verbi',
  sectionGrammar: 'Note di grammatica',
  sectionFillBlanks: 'Esercizio cloze (spazi vuoti)',
  sectionQuiz: 'Domande del quiz',
  sectionAnswerKey: 'Soluzioni',
  layoutInterlinear: '📝 Interlineare',
  layoutColumns: '⚖️ 2 Colonne',
  part1Reading: 'Parte 1: Testo di lettura',
  part2Vocab: 'Parte 2: Vocaboli e verbi chiave',
  part3Grammar: 'Parte 3: Punti grammaticali',
  part4FillBlanks: 'Parte 4: Esercizio di riempimento',
  part5Quiz: 'Parte 5: Quiz di comprensione',
  part6AnswerKey: 'Soluzioni e risposte corrette',
  studentName: 'Studente:',
  date: 'Data:',
  scoreLabel: 'Voto:',

  // Verb Modal
  verbConjugation: 'Coniugazione verbale',
  infinitive: 'Infinito',
  translation: 'Traduzione',
  listenVerb: 'Ascolta',
  close: 'Chiudi',

  // Library Modal
  libraryTitle: 'Libreria delle storie',
  searchPlaceholder: 'Cerca storie per titolo o argomento...',
  emptyLibrary: 'Nessuna storia trovata nella libreria.',
  loadStory: 'Apri storia',
  deleteStory: 'Elimina',
  localStory: 'Locale',
};

const PORTUGUESE_TRANSLATIONS: Partial<TranslationDictionary> = {
  // Header
  promptPlaceholder: 'Digite um tema ou ideia para a história...',
  installChromebook: 'Instalar no Chromebook',
  installGuideTitle: 'Guia para Chromebook e tablet',
  library: 'Biblioteca',
  save: 'Salvar',
  delete: 'Excluir',
  listen: 'Ouvir',
  stop: 'Parar',
  sentences: 'frases',
  sentencesCount: (count) => `${count} frases`,
  dialogue: '🎙️ Diálogo',
  story: '📖 História',
  savedLocal: 'História salva na memória local do dispositivo.',
  deleteConfirm: (title) => `Tem certeza de que deseja excluir "${title}"?`,
  enterTopicAlert: 'Por favor, insira um tema para a sua história.',
  finishRecordingAlert: 'Por favor, finalize a gravação atual primeiro.',
  micPermissionAlert: 'A permissão do microfone é necessária para gravar sua voz.',

  // Sidebar Header & Tabs
  controlsAndOptions: 'Controles e opções',
  createStory: 'Criar uma história',
  creatingStory: 'Criando história...',
  practice: '🎯 Prática',
  build: '✨ Criar',

  // Sidebar Practice Tab
  practiceActivity: 'Atividade de prática',
  modeOff: 'Modo leitura',
  modeOffDesc: 'Texto completo e áudio',
  modeCloze: 'Preencher lacunas',
  modeClozeDesc: 'Digite as palavras ausentes',
  modeMultipleChoice: 'Múltipla escolha',
  modeMultipleChoiceDesc: 'Selecione a palavra correta',
  modeScramble: 'Ordenar palavras',
  modeScrambleDesc: 'Reconstrua as frases',
  modeScrambleEasy: 'Ordenar palavras (Fácil)',
  modeScrambleEasyDesc: 'Posicionamento assistido',
  solved: 'Resolvido',
  resetScoreTooltip: 'Zerar pontuação',
  moreActivities: 'Mais atividades e ferramentas',
  speechControls: 'Controles de fala',
  speechSpeed: 'Velocidade de leitura',
  sentencePause: 'Pausa entre frases',
  speechVoice: 'Voz de leitura',
  discussionSpeakers: 'Interlocutores do diálogo',
  speakerA: 'Locutor A',
  speakerB: 'Locutor B',
  offlineVoice: '📶 Offline',

  // Sidebar Build Tab
  targetLangToLearn: '🎯 Idioma a aprender (Alvo)',
  baseLangLearningFrom: '🗣️ Eu falo',
  learningPair: 'Par linguístico',
  difficultyLevel: 'Nível de dificuldade',
  diffIntro: 'Introdução (Crianças)',
  diffBeginner: 'Iniciante (A1-A2)',
  diffIntermediate: 'Intermediário (B1-B2)',
  diffAdvanced: 'Avançado (C1-C2)',
  tenseFocus: 'Tempo verbal principal',
  tenseMixed: 'Tempos naturais / variados',
  tensePresent: 'Presente',
  tensePast: 'Passado',
  tenseFuture: 'Futuro',
  storyLength: 'Extensão da história',
  lengthShort: 'Curto (~5)',
  lengthMedium: 'Médio (~10)',
  lengthLong: 'Longo (~15)',
  lengthMax: 'Máximo (~40)',
  formatAndGenre: 'Formato e gênero',
  nonFiction: 'Não-ficção / Fatos reais',
  fiction: 'Ficção / Conto',
  includeVerbs: 'Incluir verbos conjugados',

  // Story Overview Card
  highlighter: 'Marcador',
  speedRun: 'Contra o relógio',
  cards: 'Cartões',
  quiz: 'Questionário',
  grammar: 'Gramática',
  studySheet: 'Folha de estudo',
  from: 'de',

  // Sentences & Exercises
  readyToLearn: 'Pronto para ler e aprender',
  readyToLearnDesc: 'Digite um tema acima e toque em Criar uma história, ou abra a Biblioteca.',
  revealAnswer: 'Revelar resposta',
  hideAnswer: 'Ocultar resposta',
  answerLabel: 'Resposta:',
  repeatSentence: 'Repetir esta frase',
  recordPronunciation: 'Gravar pronúncia',
  stopRecording: 'Parar gravação',
  playRecordedVoice: 'Ouvir sua voz gravada',
  lineCompleted: 'Frase concluída!',
  hearProgress: 'Ouvir progresso',
  rescramble: 'Embaralhar novamente',
  allTilesPlaced: 'Todas as palavras colocadas',
  tapToReturnTile: 'Toque para devolver ao banco (ou arraste para trocar)',
  correct: 'Correto!',
  perfectWellDone: '✅ Perfeito! Muito bem feito.',
  notQuiteRight: '❌ Quase — toque ou troque as palavras incorretas para tentar novamente!',
  tapWordsBelow: 'Toque nas palavras abaixo para montar a frase!',
  chooseCorrectWord: 'Escolha a palavra que completa a frase perfeitamente:',
  wellDoneCorrect: '🎉 Muito bem! Está correto.',
  tryAnotherWord: 'Não exatamente — tente outra palavra!',

  // Owl Track
  owlScoreTooltip: (solved, total) => `Pontuação: ${solved} de ${total} frases concluídas`,
  owlResetTooltip: 'Zerar pontuação',

  // Speed Run Timer
  speedRunTitle: 'Contra o relógio',
  speedRunFinished: '⚡ Desafio finalizado!',
  speedRunSolvedDesc: (total, time) => `Você resolveu todas as ${total} frases em ${time} segundos!`,
  personalRecord: (time) => `Recorde pessoal: ${time}s`,
  tryAgain: 'Tentar novamente',
  done: 'Concluído',
  blitz60: '60s Relâmpago',
  sprint90: '90s Arrancada',
  run120: '120s Corrida',
  stopwatch: '⏱️ Cronômetro',
  pauseTimer: 'Pausar',
  startTimer: 'Iniciar',
  resetSpeedRun: 'Reiniciar',
  exitSpeedRun: 'Sair do modo contra o relógio',
  enableSpeedRun: 'Ativar modo contra o relógio',

  // Pronunciation Score Badge
  pronunciation: 'Pronúncia',
  excellent: 'Excelente!',
  goodEffort: 'Bom esforço!',
  keepPracticing: 'Continue praticando',
  wordByWordAccuracy: 'Precisão palavra por palavra',
  tapWordToListen: 'Toque na palavra para ouvir',
  whatWeHeard: 'O que ouvimos:',
  tapToViewPronunciation: 'Toque para ver a precisão detalhada',

  // Highlight Popover
  vocabHighlighter: 'Marcador de vocabulário',
  highlightDesc: 'Destaque e adicione aos seus cartões personalizados',
  wordTranslationLabel: (base) => `Tradução da palavra (em ${base})`,
  wordTranslationPlaceholder: 'ex.: tradução no seu idioma',
  noteLabel: 'Nota de estudo / lembrete (opcional)',
  notePlaceholder: 'ex.: substantivo feminino, particípio irregular...',
  colorTag: 'Cor de destaque',
  saveHighlight: 'Salvar nos cartões',
  removeHighlight: 'Remover destaque',
  savedToast: 'Salvo!',

  // Flashcards Modal
  flashcardsTitle: 'Cartões e vocabulário',
  tabAll: 'Todos',
  tabWords: '🔤 Palavras',
  tabVerbs: '⚡ Verbos',
  tabHighlights: '🖍️ Destacados',
  tabLearned: '✅ Aprendidos',
  iSpeakBase: 'Meu idioma (Base):',
  flipInstruction: 'Toque no cartão ou pressione Espaço para virar',
  slow: 'Lento',
  shuffle: 'Embaralhar',
  markLearned: 'Já sei isto',
  unmarkLearned: 'Aprendido ✓',
  restartDeck: 'Reiniciar baralho',
  noCardsMatching: 'Nenhum cartão nesta categoria por enquanto.',
  studyDirectionTargetBase: 'Frente: Alvo → Verso: Tradução',
  studyDirectionBaseTarget: 'Frente: Tradução → Verso: Alvo',

  // Comprehension Quiz Modal
  quizTitle: 'Questionário de compreensão leitora',
  questionOf: (current, total) => `Pergunta ${current} de ${total}`,
  showTranslation: (base) => `💡 Mostrar tradução (${base})`,
  hideTranslation: (base) => `Ocultar (${base})`,
  nextQuestion: 'Próxima pergunta',
  seeResults: 'Ver resultados',
  perfectScore: '🎉 Pontuação perfeita!',
  greatEffort: '👏 Ótimo esforço!',
  keepPracticingQuiz: '💪 Continue praticando!',
  quizScoreSummary: (score, total) => `Você acertou ${score} de ${total} perguntas.`,
  pronounceQuestion: 'Pronunciar pergunta',

  // Grammar Bites Modal
  grammarTitle: 'Tópicos de gramática',
  grammarSubtitle: 'Regras e padrões fundamentais desta história',
  ruleLabel: 'Regra gramatical',
  examplesLabel: 'Exemplos no contexto',
  tipLabel: 'Dica prática',
  copyNote: 'Copiar anotação',
  copied: 'Copiado!',

  // Study Sheet Modal
  studySheetTitle: 'Folha de estudo e material imprimível',
  printSavePdf: 'Imprimir / PDF',
  copyMarkdown: 'Copiar Markdown',
  downloadHtml: 'Baixar HTML',
  includeSections: 'Seções a incluir:',
  sectionReadingText: 'Texto de leitura',
  sectionVocab: 'Vocabulário e verbos',
  sectionGrammar: 'Notas de gramática',
  sectionFillBlanks: 'Exercício de lacunas',
  sectionQuiz: 'Perguntas do questionário',
  sectionAnswerKey: 'Gabarito',
  layoutInterlinear: '📝 Interlinear',
  layoutColumns: '⚖️ 2 Colunas',
  part1Reading: 'Parte 1: Texto de leitura',
  part2Vocab: 'Parte 2: Vocabulário e verbos principais',
  part3Grammar: 'Parte 3: Pontos de gramática',
  part4FillBlanks: 'Parte 4: Exercício de preencher lacunas',
  part5Quiz: 'Parte 5: Questionário de compreensão',
  part6AnswerKey: 'Gabarito e soluções',
  studentName: 'Aluno(a):',
  date: 'Data:',
  scoreLabel: 'Nota:',

  // Verb Modal
  verbConjugation: 'Conjugação verbal',
  infinitive: 'Infinitivo',
  translation: 'Tradução',
  listenVerb: 'Ouvir',
  close: 'Fechar',

  // Library Modal
  libraryTitle: 'Biblioteca de histórias',
  searchPlaceholder: 'Pesquisar histórias por título ou tema...',
  emptyLibrary: 'Nenhuma história encontrada na biblioteca.',
  loadStory: 'Abrir história',
  deleteStory: 'Excluir',
  localStory: 'Local',
};

const DUTCH_TRANSLATIONS: Partial<TranslationDictionary> = {
  // Header
  promptPlaceholder: 'Voer een onderwerp of verhaalidee in...',
  installChromebook: 'Installeren op Chromebook',
  installGuideTitle: 'Chromebook- & tablethandleiding',
  library: 'Bibliotheek',
  save: 'Opslaan',
  delete: 'Verwijderen',
  listen: 'Luisteren',
  stop: 'Stoppen',
  sentences: 'zinnen',
  sentencesCount: (count) => `${count} zinnen`,
  dialogue: '🎙️ Dialoog',
  story: '📖 Verhaal',
  savedLocal: 'Verhaal lokaal opgeslagen in apparaatgeheugen.',
  deleteConfirm: (title) => `Weet u zeker dat u "${title}" wilt verwijderen?`,
  enterTopicAlert: 'Voer een onderwerp in voor uw verhaal.',
  finishRecordingAlert: 'Rond eerst de huidige opname af.',
  micPermissionAlert: 'Microfoontoestemming is vereist om uw stem op te nemen.',

  // Sidebar Header & Tabs
  controlsAndOptions: 'Bediening en opties',
  createStory: 'Maak een verhaal',
  creatingStory: 'Verhaal maken...',
  practice: '🎯 Oefenen',
  build: '✨ Bouwen',

  // Sidebar Practice Tab
  practiceActivity: 'Oefenactiviteit',
  modeOff: 'Leesmodus',
  modeOffDesc: 'Volledige tekst en audio',
  modeCloze: 'Invuloefening (Cloze)',
  modeClozeDesc: 'Typ ontbrekende woorden',
  modeMultipleChoice: 'Meerkeuze',
  modeMultipleChoiceDesc: 'Kies het juiste woord',
  modeScramble: 'Woorden husselen',
  modeScrambleDesc: 'Zinnen reconstrueren',
  modeScrambleEasy: 'Woorden husselen (Eenvoudig)',
  modeScrambleEasyDesc: 'Ondersteunde volgorde',
  solved: 'Opgelost',
  resetScoreTooltip: 'Score resetten naar nul',
  moreActivities: 'Meer activiteiten & hulpmiddelen',
  speechControls: 'Spraakinstellingen',
  speechSpeed: 'Spraaksnelheid',
  sentencePause: 'Pauze tussen zinnen',
  speechVoice: 'Spraakstem',
  discussionSpeakers: 'Dialoogsprekers',
  speakerA: 'Spreker A',
  speakerB: 'Spreker B',
  offlineVoice: '📶 Offline',

  // Sidebar Build Tab
  targetLangToLearn: '🎯 Doeltaal (Om te leren)',
  baseLangLearningFrom: '🗣️ Ik spreek',
  learningPair: 'Taalkoppel',
  difficultyLevel: 'Moeilijkheidsgraad',
  diffIntro: 'Introductie (Kinderen)',
  diffBeginner: 'Beginner (A1-A2)',
  diffIntermediate: 'Gemiddeld (B1-B2)',
  diffAdvanced: 'Gevorderd (C1-C2)',
  tenseFocus: 'Werkwoordstijd',
  tenseMixed: 'Natuurlijk / Gemengd',
  tensePresent: 'Tegenwoordige tijd',
  tensePast: 'Verleden tijd',
  tenseFuture: 'Toekomende tijd',
  storyLength: 'Lengte van het verhaal',
  lengthShort: 'Kort (~5)',
  lengthMedium: 'Gemiddeld (~10)',
  lengthLong: 'Lang (~15)',
  lengthMax: 'Max (~40)',
  formatAndGenre: 'Formaat en genre',
  nonFiction: 'Non-fictie / Feiten',
  fiction: 'Fictie / Verhaal',
  includeVerbs: 'Vervoegde werkwoorden opnemen',

  // Story Overview Card
  highlighter: 'Markeerstift',
  speedRun: 'Tijdrit',
  cards: 'Kaarten',
  quiz: 'Quiz',
  grammar: 'Grammatica',
  studySheet: 'Werkblad',
  from: 'vanuit',

  // Sentences & Exercises
  readyToLearn: 'Klaar om te lezen en leren',
  readyToLearnDesc: 'Voer hierboven een onderwerp in en tik op Maak een verhaal, of open de Bibliotheek.',
  revealAnswer: 'Toon antwoord',
  hideAnswer: 'Verberg antwoord',
  answerLabel: 'Antwoord:',
  repeatSentence: 'Herhaal deze zin',
  recordPronunciation: 'Uitspraak opnemen',
  stopRecording: 'Opname stoppen',
  playRecordedVoice: 'Opgenomen stem afspelen',
  lineCompleted: 'Zin voltooid!',
  hearProgress: 'Hoor voortgang',
  rescramble: 'Opnieuw husselen',
  allTilesPlaced: 'Alle woorden geplaatst',
  tapToReturnTile: 'Tik om terug te leggen (of sleep om te wisselen)',
  correct: 'Correct!',
  perfectWellDone: '✅ Uitstekend! Goed gedaan.',
  notQuiteRight: '❌ Niet helemaal goed — tik of wissel foute woorden om opnieuw te proberen!',
  tapWordsBelow: 'Tik op de woorden hieronder om de zin te bouwen!',
  chooseCorrectWord: 'Kies het woord dat precies in de zin past:',
  wellDoneCorrect: '🎉 Goed gedaan! Dat klopt.',
  tryAnotherWord: 'Niet helemaal — probeer een ander woord!',

  // Owl Track
  owlScoreTooltip: (solved, total) => `Score: ${solved} van ${total} zinnen voltooid`,
  owlResetTooltip: 'Score resetten naar nul',

  // Speed Run Timer
  speedRunTitle: 'Tijdrit',
  speedRunFinished: '⚡ Tijdrit voltooid!',
  speedRunSolvedDesc: (total, time) => `Je hebt alle ${total} zinnen opgelost in ${time} seconden!`,
  personalRecord: (time) => `Persoonlijk record: ${time}s`,
  tryAgain: 'Opnieuw proberen',
  done: 'Klaar',
  blitz60: '60s Flits',
  sprint90: '90s Sprint',
  run120: '120s Loop',
  stopwatch: '⏱️ Stopwatch',
  pauseTimer: 'Pauzeren',
  startTimer: 'Starten',
  resetSpeedRun: 'Resetten',
  exitSpeedRun: 'Tijdrit verlaten',
  enableSpeedRun: 'Tijdritmodus inschakelen',

  // Pronunciation Score Badge
  pronunciation: 'Uitspraak',
  excellent: 'Uitstekend!',
  goodEffort: 'Goede poging!',
  keepPracticing: 'Blijf oefenen',
  wordByWordAccuracy: 'Woord-voor-woord nauwkeurigheid',
  tapWordToListen: 'Tik op een woord om te luisteren',
  whatWeHeard: 'Wat we hoorden:',
  tapToViewPronunciation: 'Tik om gedetailleerde uitspraak te bekijken',

  // Highlight Popover
  vocabHighlighter: 'Woordenschat-markeerstift',
  highlightDesc: 'Markeer en bewaar in je eigen flitskaarten',
  wordTranslationLabel: (base) => `Woordvertaling (in het ${base})`,
  wordTranslationPlaceholder: 'bijv. vertaling in jouw taal',
  noteLabel: 'Studienotitie / geheugensteuntje (optioneel)',
  notePlaceholder: 'bijv. vrouwelijk zelfstandig naamwoord, onregelmatig voltooid deelwoord...',
  colorTag: 'Kleur',
  saveHighlight: 'Opslaan in kaarten',
  removeHighlight: 'Markering wissen',
  savedToast: 'Opgeslagen!',

  // Flashcards Modal
  flashcardsTitle: 'Flitskaarten & woordenschat',
  tabAll: 'Alles',
  tabWords: '🔤 Woorden',
  tabVerbs: '⚡ Werkwoorden',
  tabHighlights: '🖍️ Gemarkeerd',
  tabLearned: '✅ Geleerd',
  iSpeakBase: 'Mijn taal (Basis):',
  flipInstruction: 'Tik op de kaart of druk op Spatie om om te draaien',
  slow: 'Langzaam',
  shuffle: 'Schudden',
  markLearned: 'Dit weet ik al',
  unmarkLearned: 'Geleerd ✓',
  restartDeck: 'Stapel herstarten',
  noCardsMatching: 'Nog geen kaarten in deze categorie.',
  studyDirectionTargetBase: 'Voorkant: Doeltaal → Achterkant: Vertaling',
  studyDirectionBaseTarget: 'Voorkant: Vertaling → Achterkant: Doeltaal',

  // Comprehension Quiz Modal
  quizTitle: 'Begrijpend lezen quiz',
  questionOf: (current, total) => `Vraag ${current} van ${total}`,
  showTranslation: (base) => `💡 Toon vertaling (${base})`,
  hideTranslation: (base) => `Verberg (${base})`,
  nextQuestion: 'Volgende vraag',
  seeResults: 'Bekijk resultaten',
  perfectScore: '🎉 Perfecte score!',
  greatEffort: '👏 Goed gedaan!',
  keepPracticingQuiz: '💪 Blijf oefenen!',
  quizScoreSummary: (score, total) => `Je had ${score} van de ${total} vragen juist.`,
  pronounceQuestion: 'Vraag uitspreken',

  // Grammar Bites Modal
  grammarTitle: 'Grammatica-highlights',
  grammarSubtitle: 'Belangrijke grammaticaregels uit dit verhaal',
  ruleLabel: 'Grammaticaregel',
  examplesLabel: 'Voorbeelden in context',
  tipLabel: 'Handige tip',
  copyNote: 'Notitie kopiëren',
  copied: 'Gekopieerd!',

  // Study Sheet Modal
  studySheetTitle: 'Studieblad & printbaar werkblad',
  printSavePdf: 'Printen / PDF',
  copyMarkdown: 'Kopieer Markdown',
  downloadHtml: 'Download HTML',
  includeSections: 'Secties opnemen:',
  sectionReadingText: 'Leestekst',
  sectionVocab: 'Woordenschat & werkwoorden',
  sectionGrammar: 'Grammaticanotities',
  sectionFillBlanks: 'Invuloefening',
  sectionQuiz: 'Quizvragen',
  sectionAnswerKey: 'Antwoordsleutel',
  layoutInterlinear: '📝 Interlineair',
  layoutColumns: '⚖️ 2 Kolommen',
  part1Reading: 'Deel 1: Leestekst',
  part2Vocab: 'Deel 2: Belangrijke woordenschat en werkwoorden',
  part3Grammar: 'Deel 3: Grammaticapunten',
  part4FillBlanks: 'Deel 4: Invuloefeningen',
  part5Quiz: 'Deel 5: Begripstest',
  part6AnswerKey: 'Antwoorden en oplossingen',
  studentName: 'Leerling:',
  date: 'Datum:',
  scoreLabel: 'Cijfer:',

  // Verb Modal
  verbConjugation: 'Werkwoordvervoeging',
  infinitive: 'Infinitief',
  translation: 'Vertaling',
  listenVerb: 'Luisteren',
  close: 'Sluiten',

  // Library Modal
  libraryTitle: 'Verhalenbibliotheek',
  searchPlaceholder: 'Zoek verhalen op titel of onderwerp...',
  emptyLibrary: 'Geen verhalen gevonden in de bibliotheek.',
  loadStory: 'Open verhaal',
  deleteStory: 'Verwijderen',
  localStory: 'Lokaal',
};

const HINDI_TRANSLATIONS: TranslationDictionary = {
  // Header
  promptPlaceholder: 'कहानी का विषय या संकेत दर्ज करें...',
  installChromebook: 'Chromebook पर इंस्टॉल करें',
  installGuideTitle: 'Chromebook और टैबलेट ऐप गाइड',
  library: 'लाइब्रेरी',
  save: 'सहेजें',
  delete: 'हटाएं',
  popularPairs: 'लोकप्रिय सीखने के मार्ग',
  starterScenarios: 'त्वरित विषय आरंभक',
  listenGreeting: 'मूल अभिवादन सुनें',
  flagSelectionHint: 'देश का त्वरित चयन',
  welcomeLearnerToast: (lang: string) => `स्वागत है! बोली जाने वाली भाषा ${lang} पर सेट की गई।`,
  listen: 'सुनें',
  stop: 'रोकें',
  sentences: 'वाक्य',
  sentencesCount: (count) => `${count} वाक्य`,
  dialogue: '🎙️ संवाद',
  story: '📖 कहानी',
  savedLocal: 'कहानी डिवाइस में सहेजी गई।',
  deleteConfirm: (title) => `क्या आप वाकई "${title}" को हटाना चाहते हैं?`,
  enterTopicAlert: 'कृपया अपनी कहानी के लिए एक विषय दर्ज करें।',
  finishRecordingAlert: 'कृपया पहले वर्तमान रिकॉर्डिंग समाप्त करें।',
  micPermissionAlert: 'आपकी आवाज रिकॉर्ड करने के लिए माइक्रोफ़ोन अनुमति आवश्यक है।',

  // Sidebar Header & Tabs
  controlsAndOptions: 'नियंत्रण और विकल्प',
  createStory: 'कहानी बनाएं',
  creatingStory: 'कहानी बनाई जा रही है...',
  practice: '🎯 अभ्यास',
  build: '✨ निर्माण',

  // Sidebar Practice Tab
  practiceActivity: 'अभ्यास गतिविधि',
  modeOff: 'पठन मोड',
  modeOffDesc: 'पूर्ण पाठ और ऑडियो श्रवण',
  modeCloze: 'रिक्त स्थान भरें (Cloze)',
  modeClozeDesc: 'लापता शब्द टाइप करें',
  modeMultipleChoice: 'बहुविकल्पीय',
  modeMultipleChoiceDesc: 'सही शब्द चुनें',
  modeScramble: 'शब्द क्रमबद्ध करें',
  modeScrambleDesc: 'वाक्यों को पुनः व्यवस्थित करें',
  modeScrambleEasy: 'क्रमबद्ध (सरल)',
  modeScrambleEasyDesc: 'सहायता प्राप्त शब्द क्रम',
  solved: 'हल किया गया',
  resetScoreTooltip: 'स्कोर शून्य पर रीसेट करें',
  moreActivities: 'अधिक गतिविधियाँ और उपकरण',
  speechControls: 'ध्वनि नियंत्रण',
  speechSpeed: 'बोलने की गति',
  sentencePause: 'वाक्यों के बीच ठहराव',
  speechVoice: 'वाचन आवाज़',
  discussionSpeakers: 'संवाद के वक्ता',
  speakerA: 'वक्ता A',
  speakerB: 'वक्ता B',
  offlineVoice: '📶 ऑफ़लाइन',

  // Sidebar Build Tab
  targetLangToLearn: '🎯 सीखी जाने वाली भाषा (लक्ष्य)',
  baseLangLearningFrom: '🗣️ मैं बोलता हूँ',
  learningPair: 'भाषा युगल',
  difficultyLevel: 'कठिनाई स्तर',
  diffIntro: 'परिचय (आरंभिक)',
  diffBeginner: 'शुरुआती (A1-A2)',
  diffIntermediate: 'मध्यवर्ती (B1-B2)',
  diffAdvanced: 'उन्नत (C1-C2)',
  tenseFocus: 'काल (Tense) फ़ोकस',
  tenseMixed: 'स्वाभाविक / मिश्रित काल',
  tensePresent: 'वर्तमान काल',
  tensePast: 'भूतकाल',
  tenseFuture: 'भविष्य काल',
  storyLength: 'कहानी की लंबाई',
  lengthShort: 'छोटा (~5)',
  lengthMedium: 'मध्यम (~10)',
  lengthLong: 'लंबा (~15)',
  lengthMax: 'अधिकतम (~40)',
  formatAndGenre: 'प्रारूप और शैली',
  nonFiction: 'तथ्य / गैर-काल्पनिक',
  fiction: 'काल्पनिक / कथा',
  includeVerbs: 'क्रिया रूप शामिल करें',

  // Story Overview Card
  highlighter: 'हाइलाइटर',
  speedRun: 'स्पीड रन',
  cards: 'फ़्लैशकार्ड',
  quiz: 'प्रश्नोत्तरी',
  grammar: 'व्याकरण',
  studySheet: 'अध्ययन पत्र',
  from: 'से',

  // Sentences & Exercises
  readyToLearn: 'सीखने और पढ़ने के लिए तैयार',
  readyToLearnDesc: 'ऊपर एक विषय दर्ज करें और कहानी बनाएं, या पुस्तकालय से द्विभाषी कहानियों का अभ्यास करें।',
  revealAnswer: 'उत्तर दिखाएं',
  hideAnswer: 'उत्तर छिपाएं',
  answerLabel: 'उत्तर:',
  repeatSentence: 'यह वाक्य दोहराएं',
  recordPronunciation: 'उच्चारण रिकॉर्ड करें',
  stopRecording: 'रिकॉर्डिंग रोकें',
  playRecordedVoice: 'अपनी रिकॉर्ड की गई आवाज़ सुनें',
  lineCompleted: 'पंक्ति पूर्ण हुई!',
  hearProgress: 'प्रगति सुनें',
  rescramble: 'पुनः क्रमबद्ध करें',
  allTilesPlaced: 'सभी शब्द रखे गए',
  tapToReturnTile: 'वापस भेजने के लिए टैप करें (या बदलने के लिए खींचें)',
  correct: 'सही!',
  perfectWellDone: '✅ बहुत बढ़िया! बिल्कुल सही।',
  notQuiteRight: '❌ पूरी तरह सही नहीं — पुनः प्रयास करने के लिए गलत शब्द बदलें!',
  tapWordsBelow: 'वाक्य बनाने के लिए नीचे दिए गए शब्दों पर टैप करें!',
  chooseCorrectWord: 'वाक्य में सही बैठने वाला शब्द चुनें:',
  wellDoneCorrect: '🎉 बहुत बढ़िया! यह सही उत्तर है।',
  tryAnotherWord: 'पूरी तरह सही नहीं — कोई अन्य शब्द आज़माएं!',

  // Owl Track
  owlScoreTooltip: (solved, total) => `स्कोर: ${total} में से ${solved} वाक्य पूर्ण`,
  owlResetTooltip: 'स्कोर शून्य पर रीसेट करें',

  // Speed Run Timer
  speedRunTitle: 'स्पीड रन',
  speedRunFinished: '⚡ स्पीड रन समाप्त!',
  speedRunSolvedDesc: (total, time) => `आपने सभी ${total} वाक्यों को ${time} सेकंड में हल किया!`,
  personalRecord: (time) => `व्यक्तिगत रिकॉर्ड: ${time}s`,
  tryAgain: 'पुनः प्रयास करें',
  done: 'पूर्ण',
  blitz60: '60s ब्लिट्ज़',
  sprint90: '90s स्प्रिंट',
  run120: '120s रन',
  stopwatch: '⏱️ स्टॉपवॉच',
  pauseTimer: 'टाइमर रोकें',
  startTimer: 'टाइमर शुरू करें',
  resetSpeedRun: 'स्पीड रन रीसेट करें',
  exitSpeedRun: 'स्पीड रन से बाहर निकलें',
  enableSpeedRun: 'समयबद्ध स्पीड रन चुनौती सक्षम करें',

  // Pronunciation Score Badge
  pronunciation: 'उच्चारण',
  excellent: 'उत्कृष्ट!',
  goodEffort: 'अच्छा प्रयास',
  keepPracticing: 'अभ्यास जारी रखें',
  wordByWordAccuracy: 'शब्द-दर-शब्द सटीकता',
  tapWordToListen: 'सुनने के लिए शब्द पर टैप करें',
  whatWeHeard: 'हमने क्या सुना:',
  tapToViewPronunciation: 'शब्द-दर-शब्द उच्चारण सटीकता देखने के लिए टैप करें',

  // Toolbar additions
  converse: 'बातचीत',
  studioVoice: 'स्टूडियो आवाज़',
  streakBadge: (days) => `${days} दिन स्ट्रीक`,
  dueToday: 'आज देय',
  iSpeakLabel: '🗣️ मैं बोलता हूँ',
  targetLanguageLabel: '🎯 सीखी जाने वाली भाषा (लक्ष्य)',
  chooseYourLanguage: 'अपनी बोली जाने वाली भाषा चुनें',
  searchLanguage: 'भाषा या देश खोजें...',
  quickTopics: 'लोकप्रिय शुरुआती विषय',
  flipLanguages: 'भाषाएं बदलें',

  // Highlight Popover
  vocabHighlighter: 'शब्दावली हाइलाइटर',
  highlightDesc: 'हाइलाइट करें और कस्टम फ़्लैशकार्ड में जोड़ें',
  selectedWordLabel: 'चयनित शब्द',
  wordAudioTooltip: 'उच्चारण सुनें',
  wordTranslationLabel: (base) => `शब्द अनुवाद (${base} में)`,
  wordTranslationPlaceholder: 'उदा. आपकी भाषा में अनुवाद',
  noteLabel: 'अध्ययन नोट / अनुस्मारक (वैकल्पिक)',
  notePlaceholder: 'उदा. स्त्रीलिंग संज्ञा, अनियमित भूतकालिक क्रिया...',
  colorTag: 'रंग टैग',
  saveHighlight: 'फ़्लैशकार्ड में सहेजें',
  removeHighlight: 'हाइलाइट हटाएं',
  savedToast: 'सहेजा गया!',
  digDeeper: '✨ गहराई से जानें (व्युत्पत्ति और जड़ें)',
  digDeeperLoading: 'भाषाई जड़ों और संबंधों की जांच की जा रही है...',
  etymologyTitle: 'व्युत्पत्ति और भाषाई जड़ें',
  originLabel: '🏛️ ऐतिहासिक उत्पत्ति और मूल जड़',
  relationLabel: (base) => `🔗 ${base} से संबंध`,
  funFactLabel: '💡 रोचक तथ्य और याद रखने का सूत्र',
  cognatesLabel: '🏷️ संबंधित सजातीय शब्द (Cognates)',
  copyToNotes: 'अध्ययन नोट्स में कॉपी करें',
  copiedToNotes: 'नोट्स में कॉपी किया गया!',

  // Flashcards Modal
  flashcardsTitle: 'फ़्लैशकार्ड और शब्दावली',
  tabAll: 'सभी',
  tabWords: '🔤 शब्द',
  tabVerbs: '⚡ क्रियाएं',
  tabHighlights: '🖍️ हाइलाइट्स',
  tabLearned: '✅ सीखे गए',
  iSpeakBase: 'मेरी भाषा (आधार):',
  flipInstruction: 'उलटने के लिए कार्ड टैप करें या स्पेसबार दबाएं',
  slow: 'धीमा',
  shuffle: 'फेरबदल',
  markLearned: 'मुझे यह पता है',
  unmarkLearned: 'सीखा हुआ ✓',
  restartDeck: 'डेक पुनः प्रारंभ करें',
  noCardsMatching: 'इस श्रेणी में अभी कोई कार्ड नहीं है।',
  studyDirectionTargetBase: 'सामने: लक्ष्य भाषा → पीछे: अनुवाद',
  studyDirectionBaseTarget: 'सामने: अनुवाद → पीछे: लक्ष्य भाषा',

  // Comprehension Quiz Modal
  quizTitle: 'पठन बोध प्रश्नोत्तरी',
  questionOf: (current, total) => `प्रश्न ${current} का ${total}`,
  showTranslation: (base) => `💡 ${base} अनुवाद दिखाएं`,
  hideTranslation: (base) => `${base} अनुवाद छिपाएं`,
  nextQuestion: 'अगला प्रश्न',
  seeResults: 'परिणाम देखें',
  perfectScore: '🎉 शत-प्रतिशत स्कोर!',
  greatEffort: '👏 बेहतरीन प्रयास!',
  keepPracticingQuiz: '💪 अभ्यास जारी रखें!',
  quizScoreSummary: (score, total) => `आपने ${total} में से ${score} सही उत्तर दिए`,
  pronounceQuestion: 'प्रश्न का उच्चारण सुनें',

  // Grammar Bites Modal
  grammarTitle: 'व्याकरण के मुख्य नियम',
  grammarSubtitle: 'वर्तमान कहानी से प्रमुख व्याकरण संरचनाएं',
  ruleLabel: 'व्याकरण नियम',
  examplesLabel: 'कहानी से उदाहरण',
  tipLabel: 'याद रखने योग्य युक्ति',
  copyNote: 'नोट्स में कॉपी करें',
  copied: 'कॉपी किया गया!',

  // Study Sheet Modal
  studySheetTitle: 'अध्ययन पत्र और पीडीएफ़',
  printSavePdf: 'प्रिंट / पीडीएफ़ सहेजें',
  copyMarkdown: 'मार्कडाउन कॉपी करें',
  downloadHtml: 'HTML डाउनलोड करें',
  includeSections: 'शामिल किए जाने वाले अनुभाग',
  sectionReadingText: 'पठन पाठ',
  sectionVocab: 'शब्दावली सूची',
  sectionGrammar: 'व्याकरण नोट्स',
  sectionFillBlanks: 'रिक्त स्थान भरें कार्यपत्रक',
  sectionQuiz: 'बोध प्रश्नोत्तरी',
  sectionAnswerKey: 'उत्तर कुंजी',
  layoutInterlinear: 'अंतर-रेखीय अनुवाद',
  layoutColumns: 'दो-स्तंभ लेआउट',
  part1Reading: 'भाग 1: पठन पाठ',
  part2Vocab: 'भाग 2: शब्दावली और क्रियाएं',
  part3Grammar: 'भाग 3: व्याकरण विश्लेषण',
  part4FillBlanks: 'भाग 4: अभ्यास कार्यपत्रक',
  part5Quiz: 'भाग 5: समझ की जांच',
  part6AnswerKey: 'भाग 6: उत्तर कुंजी',
  studentName: 'विद्यार्थी का नाम',
  date: 'दिनांक',
  scoreLabel: 'स्कोर',

  // Verb Modal
  verbConjugation: 'क्रिया रूप (संयुग्मन)',
  infinitive: 'मूल रूप',
  translation: 'अनुवाद',
  listenVerb: 'क्रिया का उच्चारण सुनें',
  close: 'बंद करें',

  // Library Modal
  libraryTitle: 'कहानियों की लाइब्रेरी',
  searchPlaceholder: 'शीर्षक या विषय से कहानियां खोजें...',
  emptyLibrary: 'लाइब्रेरी में कोई कहानी नहीं मिली।',
  loadStory: 'कहानी खोलें',
  deleteStory: 'कहानी हटाएं',
  localStory: 'स्थानीय',
};

const CZECH_TRANSLATIONS: Partial<TranslationDictionary> = {
  // Header
  promptPlaceholder: 'Zadejte téma jako námět pro váš příběh...',
  installChromebook: 'Instalovat na Chromebook',
  installGuideTitle: 'Průvodce pro Chromebook a tablety',
  library: 'Knihovna',
  save: 'Uložit',
  delete: 'Smazat',
  listen: 'Přehrát',
  stop: 'Zastavit',
  sentences: 'vět',
  sentencesCount: (count) => `${count} vět`,
  dialogue: '🎙️ Dialog',
  story: '📖 Příběh',
  savedLocal: 'Příběh uložen do místní paměti.',
  deleteConfirm: (title) => `Opravdu chcete smazat "${title}"?`,
  enterTopicAlert: 'Zadejte prosím téma pro svůj příběh.',
  finishRecordingAlert: 'Nejprve prosím dokončete probíhající nahrávání.',
  micPermissionAlert: 'K nahrávání hlasu je vyžadován přístup k mikrofonu.',

  // Sidebar Header & Tabs
  controlsAndOptions: 'Ovládání a možnosti',
  createStory: 'Vytvořit příběh',
  creatingStory: 'Vytvářím příběh...',
  practice: '🎯 Procvičovat',
  build: '✨ Nastavení',

  // Sidebar Practice Tab
  practiceActivity: 'Aktivita k procvičování',
  modeOff: 'Režim čtení',
  modeOffDesc: 'Celý text a poslech',
  modeCloze: 'Doplňování slov (Cloze)',
  modeClozeDesc: 'Doplňte chybějící slova',
  modeMultipleChoice: 'Výběr z možností',
  modeMultipleChoiceDesc: 'Zvolte správné slovo',
  modeScramble: 'Skládání vět',
  modeScrambleDesc: 'Poskládejte slova do věty',
  modeScrambleEasy: 'Skládání vět (Snadné)',
  modeScrambleEasyDesc: 'S nápovědou pořadí',
  solved: 'Vyřešeno',
  resetScoreTooltip: 'Vynulovat skóre',
  moreActivities: 'Další aktivity a nástroje',
  speechControls: 'Nastavení hlasu',
  speechSpeed: 'Rychlost čtení',
  sentencePause: 'Pauza mezi větami',
  speechVoice: 'Hlas předčítání',
  discussionSpeakers: 'Mluvčí v dialogu',
  speakerA: 'Mluvčí A',
  speakerB: 'Mluvčí B',
  offlineVoice: '📶 Offline',

  // Sidebar Build Tab
  targetLangToLearn: '🎯 Cílový jazyk (k výuce)',
  baseLangLearningFrom: '🗣️ Můj jazyk',
  learningPair: 'Jazyková dvojice',
  difficultyLevel: 'Úroveň pokročilosti',
  diffIntro: 'Úvod (Pro děti)',
  diffBeginner: 'Začátečník (A1-A2)',
  diffIntermediate: 'Středně pokročilý (B1-B2)',
  diffAdvanced: 'Pokročilý (C1-C2)',
  tenseFocus: 'Gramatický čas',
  tenseMixed: 'Přirozený / Různé časy',
  tensePresent: 'Přítomný čas',
  tensePast: 'Minulý čas',
  tenseFuture: 'Budoucí čas',
  storyLength: 'Délka příběhu',
  lengthShort: 'Krátký (~5)',
  lengthMedium: 'Střední (~10)',
  lengthLong: 'Dlouhý (~15)',
  lengthMax: 'Maximum (~40)',
  formatAndGenre: 'Formát a žánr',
  nonFiction: 'Fakta a reálie',
  fiction: 'Fikce a vyprávění',
  includeVerbs: 'Zobrazit časování sloves',

  // Story Overview Card
  highlighter: 'Zvýrazňovač',
  speedRun: 'Na čas',
  cards: 'Kartičky',
  quiz: 'Kvíz',
  grammar: 'Gramatika',
  studySheet: 'Pracovní list',
  from: 'z',

  // Flashcards Modal
  flashcardsTitle: 'Slovní zásoba a kartičky',
  tabAll: 'Vše',
  tabWords: 'Slova',
  tabVerbs: 'Slovesa',
  tabHighlights: 'Zvýrazněné',
  tabLearned: 'Naučeno',
  flipInstruction: 'Klikněte pro otočení kartičky',
  markLearned: 'Označit jako naučené',
  unmarkLearned: 'Vrátit do procvičování',
  restartDeck: 'Restartovat balíček',

  // Library Modal
  libraryTitle: 'Knihovna příběhů',
  searchPlaceholder: 'Hledat příběhy podle názvu nebo tématu...',
  emptyLibrary: 'V knihovně nebyly nalezeny žádné příběhy.',
  loadStory: 'Otevřít příběh',
  deleteStory: 'Smazat příběh',
  localStory: 'Místní',
};

const TRANSLATION_MAP: Record<string, Partial<TranslationDictionary>> = {
  English: ENGLISH_TRANSLATIONS,
  French: FRENCH_TRANSLATIONS,
  Norwegian: NORWEGIAN_TRANSLATIONS,
  Spanish: SPANISH_TRANSLATIONS,
  German: GERMAN_TRANSLATIONS,
  Italian: ITALIAN_TRANSLATIONS,
  Portuguese: PORTUGUESE_TRANSLATIONS,
  Dutch: DUTCH_TRANSLATIONS,
  Hindi: HINDI_TRANSLATIONS,
  Czech: CZECH_TRANSLATIONS,
};

export function getT(baseLang: string = 'English'): TranslationDictionary {
  // Normalize match
  const match = Object.keys(TRANSLATION_MAP).find(
    (k) => k.toLowerCase() === baseLang.toLowerCase().trim()
  );
  if (match) {
    return { ...ENGLISH_TRANSLATIONS, ...TRANSLATION_MAP[match] };
  }
  return ENGLISH_TRANSLATIONS;
}
