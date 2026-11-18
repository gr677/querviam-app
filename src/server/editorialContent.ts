export interface EditorialSentence {
  target: string;
  en: string;
  note?: string;
}

export interface EditorialVocabItem {
  term: string;
  pos: string;
  meaning: string;
  usageNote: string;
}

export interface EditorialQuizItem {
  question: string;
  answer: string;
}

export interface EditorialArticle {
  slug: string;
  hubSlug: string;
  language: string;
  level: string;
  category: 'Story' | 'Dialogue' | 'Grammar Guide' | 'Cultural Essay';
  tenseFocus: string;
  titleTarget: string;
  titleEn: string;
  summary: string;
  publishedDate: string;
  updatedDate: string;
  readingMinutes: number;
  culturalContext: string[];
  grammarSpotlightTitle: string;
  grammarSpotlightParagraphs: string[];
  grammarExamples: Array<{ form: string; explanation: string }>;
  sentences?: EditorialSentence[];
  vocabulary: EditorialVocabItem[];
  comprehensionCheck: EditorialQuizItem[];
}

export interface LanguageHub {
  slug: string;
  language: string;
  headline: string;
  metaDescription: string;
  introParagraphs: string[];
  studyTips: Array<{ title: string; detail: string }>;
  cefrRoadmap: Array<{ level: string; milestone: string }>;
  updatedDate: string;
}

export const LANGUAGE_HUBS: LanguageHub[] = [
  {
    slug: 'italian',
    language: 'Italian',
    headline: 'Learn Italian Through Stories, Dialogues & Grammar Guides',
    metaDescription:
      'Build real Italian fluency with CEFR-graded bilingual stories, café dialogues, and practical grammar guides covering Piedmont, Rome, Tuscany, and Venice.',
    introParagraphs: [
      'Italian rewards learners early because its spelling matches its pronunciation almost one-to-one. Once you internalize a few reliable vowel and consonant patterns—such as gl in famiglia, gn in gnocchi, and c/g before e or i—you can read aloud accurately even before you know every word.',
      'Our Italian reading collection pairs everyday situations in Rome, Turin, Florence, and Bologna with clear cultural context and verb-tense breakdowns. Instead of memorizing isolated tables, you encounter passato prossimo, imperfetto, reflexive verbs, and polite forms inside memorable scenes.',
    ],
    studyTips: [
      {
        title: 'Listen for double consonants',
        detail: 'In Italian, consonant length changes meaning: caro (dear) vs. carro (cart), or note (notes) vs. notte (night). Pause slightly before releasing doubled letters.',
      },
      {
        title: 'Pair articles with every noun',
        detail: 'Always learn il, lo, la, or l’ together with the noun (il sentiero, l’acqua, lo specchio) so gender and elision become automatic.',
      },
      {
        title: 'Master the Lei polite register early',
        detail: 'In cafés, shops, and hotels, Italians frequently switch to third-person singular Lei ("Mi scusi, potrebbe...") for polite requests.',
      },
    ],
    cefrRoadmap: [
      { level: 'A1–A2 (Beginner)', milestone: 'Order food, ask directions, use present tense and basic passato prossimo with avere/essere.' },
      { level: 'B1–B2 (Intermediate)', milestone: 'Contrast passato prossimo vs. imperfetto in stories, use combined pronouns (glielo, me ne), and read regional articles.' },
      { level: 'C1+ (Advanced)', milestone: 'Follow subjunctive nuance (congiuntivo), idiomatic expressions, and unscripted literary essays.' },
    ],
    updatedDate: '2026-11-12',
  },
  {
    slug: 'spanish',
    language: 'Spanish',
    headline: 'Learn Spanish Through Cultural Stories & Practical Grammar',
    metaDescription:
      'Master Spanish reading comprehension and conversation with bilingual passages from Valencia, Madrid, Oaxaca, and Buenos Aires plus clear ser/estar and past-tense guides.',
    introParagraphs: [
      'Spoken across more than twenty countries, Spanish combines crisp phonetic consistency with remarkably expressive verb systems. Understanding how speakers shift between preterite and imperfect—or choose between ser and estar—unlocks natural storytelling almost immediately.',
      'These curated Spanish lessons introduce authentic regional flavor, market bargaining, urban transit, and everyday humor alongside sentence-level English pairings and focused grammar notes.',
    ],
    studyTips: [
      {
        title: 'Track stress marks (tildes) carefully',
        detail: 'An accent mark often distinguishes verb tense or person—hablo (I speak) vs. habló (he/she spoke)—and helps you place stress on the right syllable.',
      },
      {
        title: 'Distinguish essence from state',
        detail: 'Use ser for identity, origin, time, and permanent traits; use estar for location, emotion, and temporary conditions.',
      },
      {
        title: 'Read dialogue aloud to catch linking',
        detail: 'Natural Spanish blends adjacent vowels across word boundaries (sinalefa), making phrases like "de otra manera" flow as a single rhythmic unit.',
      },
    ],
    cefrRoadmap: [
      { level: 'A1–A2 (Beginner)', milestone: 'Navigate markets, restaurants, and travel using present tense, gustar-style verbs, and ir + a + infinitive.' },
      { level: 'B1–B2 (Intermediate)', milestone: 'Narrate past events using preterite vs. imperfect cleanly and recognize trigger clauses for the present subjunctive.' },
      { level: 'C1+ (Advanced)', milestone: 'Appreciate regional idioms across Spain and Latin America and read nuanced journalism fluently.' },
    ],
    updatedDate: '2026-11-10',
  },
  {
    slug: 'french',
    language: 'French',
    headline: 'Learn French Through Parisian Dialogues, Stories & Grammar Guides',
    metaDescription:
      'Improve your French reading and listening with bilingual stories, bakery & train dialogues, and clear guides to liaison, partitive articles, and past narration.',
    introParagraphs: [
      'Written French preserves centuries of historical spelling, which makes reading feel challenging until you learn to group letters into predictable sound families such as eau, oin, ai, and -tion. Once those patterns click, French prose becomes wonderfully transparent.',
      'Our French lessons focus on high-frequency spoken and literary constructions—from ordering at a boulangerie in Lyon to navigating SNCF regional trains and unpacking the passé composé vs. imparfait contrast.',
    ],
    studyTips: [
      {
        title: 'Focus on liaison and silent endings',
        detail: 'Final consonants are usually silent unless linked to a following vowel word, as in "les amis" (pronounced le-za-mi) or "un grand hôtel".',
      },
      {
        title: 'Keep track of partitive articles',
        detail: 'Food and uncountable nouns almost always take du, de la, de l’, or des ("je voudrais du pain"), rather than omitting the article as English does.',
      },
      {
        title: 'Pair written passages with spoken rhythm',
        detail: 'French stresses the final pronounced syllable of each breath group rather than individual words, creating its signature smooth cadence.',
      },
    ],
    cefrRoadmap: [
      { level: 'A1–A2 (Beginner)', milestone: 'Handle polite greetings (Bonjour, s’il vous plaît), café orders, and near future (aller + infinitive).' },
      { level: 'B1–B2 (Intermediate)', milestone: 'Use y and en naturally, narrate with passé composé and imparfait, and read cultural articles comfortably.' },
      { level: 'C1+ (Advanced)', milestone: 'Navigate conditional nuance, literary connectors, and idiomatic spoken French.' },
    ],
    updatedDate: '2026-11-08',
  },
  {
    slug: 'german',
    language: 'German',
    headline: 'Learn German Through Everyday Stories & Sentence-Structure Guides',
    metaDescription:
      'Build confidence in German reading and grammar with bilingual stories from Berlin and Munich, covering V2 word order, separable verbs, and the four cases.',
    introParagraphs: [
      'English and German share deep Germanic roots, meaning hundreds of everyday words—Haus, Wasser, Freund, Buch, Sommer—are immediately recognizable. The main hurdle for learners is German sentence architecture: verbs like to sit in second position in statements and jump to the end in subordinate clauses.',
      'Each German article on Querviam pairs practical real-world scenes with clear breakdowns of nominative, accusative, and dative shifts, separable prefixes, and natural connectors.',
    ],
    studyTips: [
      {
        title: 'Notice the conjugated verb anchor',
        detail: 'In main declarative clauses, the conjugated verb always occupies slot #2—even when a time phrase like "Heute Morgen" moves to slot #1.',
      },
      {
        title: 'Scan to the end of the clause',
        detail: 'Separable prefixes (auf, mit, ein, zurück) and infinitives often appear at the very end of the sentence, completing the verb’s true meaning.',
      },
      {
        title: 'Capitalize and track noun gender',
        detail: 'Every German noun begins with a capital letter, making sentence scanning much easier. Learn nouns with der/die/das from day one.',
      },
    ],
    cefrRoadmap: [
      { level: 'A1–A2 (Beginner)', milestone: 'Introduce yourself, order at a bakery, use modal verbs (können, möchten), and recognize accusative direct objects.' },
      { level: 'B1–B2 (Intermediate)', milestone: 'Master weil/dass subordinate clauses, Perfekt narration, dative prepositions, and adjective endings.' },
      { level: 'C1+ (Advanced)', milestone: 'Read extended compound sentences, Konjunktiv II, and authentic essays without relying on word-by-word translation.' },
    ],
    updatedDate: '2026-11-05',
  },
  {
    slug: 'nordic-slavic',
    language: 'Norwegian & Czech',
    headline: 'Learn Norwegian & Czech Through Bilingual Stories & Grammar Insights',
    metaDescription:
      'Explore lesser-taught European languages with curated bilingual stories from Oslo and Prague covering Norwegian V2 syntax, definite suffixes, and Czech noun cases.',
    introParagraphs: [
      'Beyond the most widely taught Western European languages, Scandinavian and Slavic languages open unforgettable travel and cultural doors. Norwegian offers one of the most approachable entry points into Nordic languages thanks to streamlined verb conjugation, while Czech introduces the rich logic of Slavic case endings and verb aspect.',
      'These curated lessons pair scenic walks through Oslo and Prague with crystal-clear structural notes tailored specifically for English speakers.',
    ],
    studyTips: [
      {
        title: 'Norwegian: Attach "the" to the end of nouns',
        detail: 'Instead of placing a separate word before a noun, Norwegian usually attaches -en, -a, or -et at the end: en kopp (a cup) becomes koppen (the cup).',
      },
      {
        title: 'Czech: Watch endings rather than word order',
        detail: 'Czech has seven grammatical cases; word endings tell you who does what to whom, freeing sentence order to highlight emphasis.',
      },
      {
        title: 'Read short passages multiple times',
        detail: 'Repeated exposure to 10–15 sentences in context cements unfamiliar prefixes and endings far faster than flashcards alone.',
      },
    ],
    cefrRoadmap: [
      { level: 'A1–A2 (Beginner)', milestone: 'Read simple present-tense descriptions, handle greetings, and recognize definite noun suffixes in Norwegian.' },
      { level: 'B1–B2 (Intermediate)', milestone: 'Follow Czech prepositional cases (locative, instrumental) and Scandinavian subordinate clause word order.' },
      { level: 'C1+ (Advanced)', milestone: 'Navigate aspect pairs, idiomatic phrasing, and unadapted cultural journalism.' },
    ],
    updatedDate: '2026-11-03',
  },
];

export const EDITORIAL_ARTICLES: EditorialArticle[] = [
  // ================= ITALIAN =================
  {
    slug: 'a_walk_around_lago_sirio',
    hubSlug: 'italian',
    language: 'Italian',
    level: 'Intermediate (B1-B2)',
    category: 'Story',
    tenseFocus: 'Present & Descriptive Phrases',
    titleTarget: 'Una passeggiata attorno al Lago Sirio',
    titleEn: 'A Walk Around Lake Sirio',
    summary:
      'A reflective walk around glacial Lake Sirio near Ivrea in Piedmont, practicing Italian nature vocabulary, reflexive verbs, and descriptive adjectives.',
    publishedDate: '2026-09-14',
    updatedDate: '2026-11-12',
    readingMinutes: 5,
    culturalContext: [
      'Lago Sirio is the largest of the Cinque Laghi (Five Lakes) lying just north of Ivrea in Piedmont, northern Italy. Formed during the retreat of ancient Alpine glaciers across the Serra Morenica, the lake sits roughly fifty kilometers northeast of Turin and remains a beloved weekend escape for Piedmontese families, rowers, and hikers.',
      'Unlike famous tourist lakes such as Como or Garda, Lago Sirio preserves a quiet, local rhythm. A well-marked footpath loops around its wooded shoreline, passing stone piers, chestnut groves, and views toward the Dora Baltea valley. Walking ("fare una passeggiata") is an integral part of Italian daily life—not merely exercise, but a social ritual to clear the mind and greet neighbors.',
    ],
    grammarSpotlightTitle: 'Reflexive & Descriptive Verbs in Natural Italian',
    grammarSpotlightParagraphs: [
      'Notice how frequently Italian relies on reflexive constructions where English uses a plain verb or "to get / feel." In this passage, verbs such as godersi (to enjoy oneself) and rilassarsi (to relax) attach the pronoun si directly to the infinitive when preceded by a preposition like per ("per godersi la tranquillità").',
      'Additionally, pay attention to preposition-article contractions such as della (di + la), lungo il, and d’acqua. Mastering contractions eliminates hesitation when reading descriptive Italian prose.',
    ],
    grammarExamples: [
      { form: 'per godersi', explanation: 'preposition per + infinitive + reflexive pronoun si ("in order to enjoy")' },
      { form: 'della natura', explanation: 'articulated preposition di + la ("of nature")' },
      { form: 'camminano', explanation: '3rd person plural present of camminare ("they walk")' },
      { form: 'circondata / circondato', explanation: 'past participle agreeing in gender with Lago (masculine)' },
    ],
    vocabulary: [
      { term: 'la passeggiata', pos: 'noun (f.)', meaning: 'stroll, leisurely walk', usageNote: 'Paired with fare ("fare una passeggiata").' },
      { term: 'lo specchio d’acqua', pos: 'noun phrase', meaning: 'expanse / mirror of water', usageNote: 'Poetic geographic term for a calm lake or basin.' },
      { term: 'le colline', pos: 'noun (f. pl.)', meaning: 'hills', usageNote: 'Singular: la collina.' },
      { term: 'il sentiero', pos: 'noun (m.)', meaning: 'footpath, trail', usageNote: 'Used for countryside and mountain paths.' },
      { term: 'la tranquillità', pos: 'noun (f.)', meaning: 'peace, quiet', usageNote: 'Words ending in -tà are feminine and invariable in plural.' },
      { term: 'i riflessi', pos: 'noun (m. pl.)', meaning: 'reflections', usageNote: 'Singular: il riflesso.' },
      { term: 'la panchina', pos: 'noun (f.)', meaning: 'park bench', usageNote: 'Common along lakeside promenades.' },
      { term: 'l’aria pura', pos: 'noun phrase', meaning: 'fresh, clean air', usageNote: 'Uses elided feminine article l’ before a vowel.' },
    ],
    comprehensionCheck: [
      {
        question: 'Where is Lago Sirio located, and what surrounds it?',
        answer: 'It is situated near Ivrea in Piedmont, northern Italy, surrounded by green morainic hills and wooded trails.',
      },
      {
        question: 'Why does the reflexive pronoun attach to the end of "godersi"?',
        answer: 'In Italian, when a reflexive verb remains in the infinitive (after prepositions like per or modal verbs), the pronoun moves from before the verb to the end, dropping the final -e of godere.',
      },
      {
        question: 'What is the difference between "strada" and "sentiero"?',
        answer: 'Strada refers to a paved street or road for vehicles, while sentiero refers specifically to an unpaved footpath or hiking trail.',
      },
    ],
  },
  {
    slug: 'dialogo_al_caffe_roma',
    hubSlug: 'italian',
    language: 'Italian',
    level: 'Beginner (A2-B1)',
    category: 'Dialogue',
    tenseFocus: 'Present & Polite Requests',
    titleTarget: 'Dialogo al Caffè Roma',
    titleEn: 'Dialogue at Caffè Roma',
    summary:
      'Authentic morning dialogue at a Roman coffee bar: ordering espresso at the counter, choosing pastries, and splitting the morning routine.',
    publishedDate: '2026-09-18',
    updatedDate: '2026-11-12',
    readingMinutes: 5,
    culturalContext: [
      'Walking into an Italian bar (café) in the morning has unwritten rules that quickly set locals apart from tourists. In Rome and across Italy, drinking an espresso or cappuccino standing up at the counter ("al banco") costs significantly less than sitting at a table ("al tavolo"), where table service is added.',
      'Morning breakfast ("la colazione") is almost always sweet rather than savory: a quick espresso ("un caffè") or cappuccino paired with a warm cornetto filled with pastry cream ("alla crema"), apricot jam ("all’albicocca"), or pistachio. Note that Italians rarely order a cappuccino after 11:00 a.m., preferring plain espresso after meals.',
    ],
    grammarSpotlightTitle: 'Modal Verbs & Softening Requests at the Counter',
    grammarSpotlightParagraphs: [
      'Everyday Italian conversations lean heavily on the modal verbs volere (to want), potere (can / may), and prendere (to take / have—the natural verb for ordering food and drinks). Saying "Prendo un caffè" sounds far more idiomatic than literally translating "I want a coffee" with voglio.',
      'When addressing the barista or waiter politely, learners can elevate "Voglio" to the conditional "Vorrei" (I would like), which immediately sounds courteous in every Italian city.',
    ],
    grammarExamples: [
      { form: 'Vuoi prendere...?', explanation: 'Informal 2nd person singular of volere + infinitive ("Do you want to get...?")' },
      { form: 'Prendo un cornetto', explanation: 'Standard idiomatic verb prendere used to order food or coffee' },
      { form: 'al banco', explanation: 'Contraction a + il meaning "at the bar counter"' },
      { form: 'Vorrei pagare', explanation: 'Polite conditional form of volere ("I would like to pay")' },
    ],
    vocabulary: [
      { term: 'al banco', pos: 'prep. phrase', meaning: 'at the counter', usageNote: 'Standard way to drink coffee standing up in Italy.' },
      { term: 'il cornetto', pos: 'noun (m.)', meaning: 'Italian croissant / pastry', usageNote: 'Slightly sweeter and softer than a French croissant.' },
      { term: 'la crema', pos: 'noun (f.)', meaning: 'custard / pastry cream', usageNote: 'Used in "cornetto alla crema".' },
      { term: 'il barista', pos: 'noun (m./f.)', meaning: 'coffee bartender', usageNote: 'Ends in -a for both men and women; plural is baristi / bariste.' },
      { term: 'la colazione', pos: 'noun (f.)', meaning: 'breakfast', usageNote: 'Combined with fare: "fare colazione".' },
      { term: 'lo scontrino', pos: 'noun (m.)', meaning: 'receipt / cash-register ticket', usageNote: 'At traditional Roman bars, you sometimes pay at the cassa first and hand the scontrino to the barista.' },
    ],
    comprehensionCheck: [
      {
        question: 'Why is standing "al banco" important in a traditional Italian café?',
        answer: 'Standing at the counter is faster, social, and avoids the extra table-service charge ("servizio al tavolo").',
      },
      {
        question: 'Which verb do Italians prefer instead of "voglio" when ordering?',
        answer: 'They normally use "prendo" (I’ll have / take) or the polite conditional "vorrei" (I would like).',
      },
      {
        question: 'What does "fare colazione" mean?',
        answer: 'It is the set collocation meaning "to have breakfast."',
      },
    ],
  },
  {
    slug: 'italian_passato_prossimo_vs_imperfetto',
    hubSlug: 'italian',
    language: 'Italian',
    level: 'Intermediate (B1-B2)',
    category: 'Grammar Guide',
    tenseFocus: 'Passato Prossimo vs. Imperfetto',
    titleTarget: 'Un weekend a Firenze: passato prossimo o imperfetto?',
    titleEn: 'A Weekend in Florence: Mastering Past Tenses',
    summary:
      'Learn exactly when to use passato prossimo for completed actions and imperfetto for background scenes through a narrative set in Florence.',
    publishedDate: '2026-10-02',
    updatedDate: '2026-11-12',
    readingMinutes: 7,
    culturalContext: [
      'Florence rewards early risers. Before tour groups fill Piazza della Signoria and the Ponte Vecchio, local artisans unlock wooden shutters along the Oltrarno district, bakers sweep flour from stone thresholds, and church bells echo down narrow medieval streets.',
      'Recounting a trip like a weekend in Florence is the classic scenario where English speakers struggle between two Italian past tenses—both often translating as simple past in English, yet conveying very different perspectives in Italian.',
    ],
    grammarSpotlightTitle: 'Completed Events vs. Ongoing Background Canvas',
    grammarSpotlightParagraphs: [
      'Think of a film director setting a scene: the imperfetto paints the scenery, weather, time of day, age, feelings, and habitual routines ("Era una mattina fresca", "Passeggiavamo ogni giorno"). Nothing has a sharp start or finish line.',
      'Then the passato prossimo steps onto the stage to move the plot forward with concrete, completed events ("Siamo arrivati alle otto", "Ho comprato un libro", "È iniziato a piovere"). Notice how both tenses work together in the same sentence: "Mentre camminavo lungo l’Arno, ho incontrato un vecchio amico."',
    ],
    grammarExamples: [
      { form: 'Faceva caldo', explanation: 'Imperfetto used for weather and atmospheric background' },
      { form: 'Abbiamo visitato gli Uffizi', explanation: 'Passato prossimo (avere) for a completed action with clear endpoints' },
      { form: 'Siamo partiti presto', explanation: 'Passato prossimo with essere; participle agrees with plural subject' },
      { form: 'Da bambino andavo sempre lì', explanation: 'Imperfetto for repeated childhood habits ("used to go")' },
    ],
    sentences: [
      { target: 'Sabato mattina sono arrivato alla stazione di Santa Maria Novella alle otto in punto.', en: 'Saturday morning I arrived at Santa Maria Novella station at eight o’clock sharp.' },
      { target: 'Il cielo era limpido e un’aria fresca scendeva dalle colline di Fiesole.', en: 'The sky was clear and a cool breeze was drifting down from the hills of Fiesole.' },
      { target: 'Mentre attraversavo Piazza del Duomo, le campane hanno cominciato a suonare.', en: 'While I was crossing Piazza del Duomo, the bells started to ring.' },
      { target: 'Sono entrato in una piccola pasticceria che aveva ancora i tavoli di marmo.', en: 'I walked into a small pastry shop that still had marble tables.' },
      { target: 'Da studente, prendevo sempre il caffè qui prima delle lezioni universitarie.', en: 'When I was a student, I always used to get coffee here before university lectures.' },
      { target: 'Dopo colazione ho camminato fino al Ponte Vecchio e ho scattato alcune fotografie.', en: 'After breakfast I walked to the Ponte Vecchio and took a few photographs.' },
      { target: 'Nel quartiere dell’Oltrarno, un artigiano restaurava una cornice antica vicino alla finestra.', en: 'In the Oltrarno neighborhood, a craftsman was restoring an antique frame near the window.' },
      { target: 'Verso mezzogiorno ho incontrato mia cugina Giulia davanti al mercato di Sant’Ambrogio.', en: 'Around noon I met my cousin Giulia in front of the Sant’Ambrogio market.' },
      { target: 'Abbiamo pranzato insieme in una trattoria semplice dove tutti parlavano ad alta voce.', en: 'We had lunch together in a simple trattoria where everyone was talking loudly.' },
      { target: 'Alla fine della giornata ero stanco, ma avevo ancora voglia di vedere il tramonto dal Piazzale Michelangelo.', en: 'At the end of the day I was tired, but I still felt like watching the sunset from Piazzale Michelangelo.' },
    ],
    vocabulary: [
      { term: 'in punto', pos: 'adverbial', meaning: 'sharp, on the dot', usageNote: 'Used with clock times: "alle otto in punto".' },
      { term: 'limpido', pos: 'adjective', meaning: 'clear, bright', usageNote: 'Commonly describes skies and clear water.' },
      { term: 'attraversare', pos: 'verb', meaning: 'to cross', usageNote: 'Regular -are verb taking avere in compound tenses.' },
      { term: 'la pasticceria', pos: 'noun (f.)', meaning: 'pastry shop', usageNote: 'Specialized bakery for cakes and pastries.' },
      { term: 'l’artigiano', pos: 'noun (m.)', meaning: 'artisan, craftsman', usageNote: 'Florence’s Oltrarno district is famous for artisan workshops.' },
      { term: 'il tramonto', pos: 'noun (m.)', meaning: 'sunset', usageNote: 'Opposite: l’alba (dawn / sunrise).' },
    ],
    comprehensionCheck: [
      {
        question: 'In "Mentre attraversavo la piazza, le campane hanno suonato", which tense marks the interruption?',
        answer: 'The passato prossimo ("hanno suonato") marks the sudden event that interrupts the ongoing action ("attraversavo", imperfetto).',
      },
      {
        question: 'Why does "sono arrivato" use essere while "ho camminato" uses avere?',
        answer: 'Verbs of directed arrival/departure like arrivare take essere (and agree with gender/number), whereas camminare (describing the activity of walking) takes avere.',
      },
      {
        question: 'Which tense describes past habits like "I always used to get coffee here"?',
        answer: 'The imperfetto ("prendevo sempre il caffè qui").',
      },
    ],
  },
  {
    slug: 'mercato_di_rialto_venezia',
    hubSlug: 'italian',
    language: 'Italian',
    level: 'Intermediate (B1)',
    category: 'Cultural Essay',
    tenseFocus: 'Present & Partitive Expressions',
    titleTarget: 'I colori del Mercato di Rialto a Venezia',
    titleEn: 'The Colors of Venice’s Rialto Market',
    summary:
      'Discover Venice’s centuries-old lagoon market while learning Italian food vocabulary, quantities, and polite bargaining phrases.',
    publishedDate: '2026-10-15',
    updatedDate: '2026-11-12',
    readingMinutes: 6,
    culturalContext: [
      'For nearly a thousand years, Venice’s Rialto Market beside the Grand Canal has been the culinary heart of the lagoon. Long before sunrise, wooden cargo barges unload crates of purple Sant’Erasmo artichokes, white asparagus from Bassano, and fresh cuttlefish caught offshore.',
      'Shopping here follows seasonal rhythms rather than year-round supermarket uniformity. Venetians ask vendors what arrived best that morning, often buying small quantities for that evening’s dinner rather than stocking a week’s groceries at once.',
    ],
    grammarSpotlightTitle: 'Expressing Quantities with "Ne" & Partitives',
    grammarSpotlightParagraphs: [
      'Market shopping is the fastest way to master the Italian pronoun ne ("of it / of them"). When a vendor offers sweet strawberries and you want half a kilo, instead of repeating fragole you say: "Me ne dia mezzo chilo, per favore" (Give me half a kilo of them, please).',
      'Also note the particle ci meaning "there" or "here" ("Ci sono molte barche stamattina" — There are many boats this morning).',
    ],
    grammarExamples: [
      { form: 'Ne vorrei un etto', explanation: 'Pronoun ne + vorrei ("I would like 100 grams of it")' },
      { form: 'un etto', explanation: 'Short for ettogrammo (100g), the standard Italian deli/market weight unit' },
      { form: 'Che cosa mi consiglia?', explanation: 'Polite Lei question ("What do you recommend to me?")' },
      { form: 'di stagione', explanation: 'Idiomatic phrase meaning "in season"' },
    ],
    sentences: [
      { target: 'Alle sette del mattino, le barche arrivano lungo il Canal Grande cariche di cassette di legno.', en: 'At seven in the morning, boats arrive along the Grand Canal loaded with wooden crates.' },
      { target: 'Sotto i portici storici di Rialto, i venditori preparano i banchi con frutta e verdura di stagione.', en: 'Under the historic arcades of Rialto, vendors set up stalls with seasonal fruit and vegetables.' },
      { target: 'In primavera compaiono i carciofi violetti coltivati sulle isole della laguna veneta.', en: 'In spring, purple artichokes grown on the islands of the Venetian lagoon appear.' },
      { target: 'Nella vicina pescheria, il ghiaccio scintilla sotto le lampade mentre i clienti scelgono il pesce fresco.', en: 'In the nearby fish market, ice sparkles under the lamps while customers pick out fresh fish.' },
      { target: 'Una signora chiede al pescivendolo: «Mi scusi, questi calamari sono stati pescati stanotte?»', en: 'A woman asks the fishmonger: "Excuse me, were these squid caught last night?"' },
      { target: '«Certamente, signora, sono freschissimi! Quanti ne desidera?»', en: '"Certainly, madam, they are super fresh! How many of them would you like?"' },
      { target: '«Me ne dia mezzo chilo, per favore, e aggiunga anche due mazzi di prezzemolo.»', en: '"Give me half a kilo of them, please, and also add two bunches of parsley."' },
      { target: 'Poco più avanti, il profumo del pane appena sfornato attira chi sta andando al lavoro.', en: 'A little further ahead, the aroma of freshly baked bread draws people heading to work.' },
      { target: 'Fare la spesa a Rialto non significa solo comprare ingredienti, ma ascoltare la voce viva della città.', en: 'Grocery shopping at Rialto doesn’t just mean buying ingredients, but listening to the living voice of the city.' },
    ],
    vocabulary: [
      { term: 'fare la spesa', pos: 'verb phrase', meaning: 'to do grocery shopping', usageNote: 'Distinct from "fare shopping" (clothes/general shopping).' },
      { term: 'di stagione', pos: 'adj. phrase', meaning: 'in season', usageNote: 'Key phrase in Italian markets and restaurants.' },
      { term: 'la pescheria', pos: 'noun (f.)', meaning: 'fish market / fishmonger’s shop', usageNote: 'Ending -eria denotes a specialty shop (panetteria, libreria).' },
      { term: 'il banco', pos: 'noun (m.)', meaning: 'market stall / counter', usageNote: 'Plural: i banchi.' },
      { term: 'appena sfornato', pos: 'adj. phrase', meaning: 'fresh out of the oven', usageNote: 'From sfornare (to take out of the oven, forno).' },
      { term: 'il prezzemolo', pos: 'noun (m.)', meaning: 'parsley', usageNote: 'Staple herb across Venetian seafood dishes.' },
    ],
    comprehensionCheck: [
      {
        question: 'What does "ne" replace in "Quanti ne desidera?"',
        answer: 'It replaces "di calamari" (of them / of the squid) so the noun does not need to be repeated.',
      },
      {
        question: 'What unit do Italians commonly use at markets for 100 grams?',
        answer: 'Un etto (short for un ettogrammo).',
      },
      {
        question: 'What is the difference between "fare la spesa" and "fare shopping"?',
        answer: '"Fare la spesa" specifically means buying food and household groceries; "fare shopping" or "fare acquisti" refers to retail browsing.',
      },
    ],
  },
  {
    slug: 'treno_notturno_torino_napoli',
    hubSlug: 'italian',
    language: 'Italian',
    level: 'Upper Intermediate (B2)',
    category: 'Story',
    tenseFocus: 'Future & Conditional Travel Phrases',
    titleTarget: 'Viaggio in treno da Torino a Napoli',
    titleEn: 'Train Journey from Turin to Naples',
    summary:
      'Practice high-speed rail vocabulary, announcements, polite requests, and regional geography on a north-to-south Italian train journey.',
    publishedDate: '2026-10-24',
    updatedDate: '2026-11-12',
    readingMinutes: 6,
    culturalContext: [
      'High-speed rail has transformed how Italians cross their peninsula. A train departing Turin Porta Nuova glides past rice paddies in the Po Valley, stops in Milan and Bologna, tunnels beneath the Apennines into Florence and Rome, and reaches Naples in roughly six hours—spanning markedly different dialects, climates, and culinary traditions along a single track.',
      'Station announcements use standardized formal phrasing ("il treno è in partenza dal binario cinque", "si prega di allontanarsi dalla linea gialla"), making real railway scenarios great preparation for travelers.',
    ],
    grammarSpotlightTitle: 'Hypothetical & Polite Conditionals in Travel',
    grammarSpotlightParagraphs: [
      'Travelers frequently ask for favors or verify schedules politely using the present conditional: potrebbe (could you), avrebbe (would you have), and preferirei (I would prefer).',
      'Also observe how Italian uses future tense both for upcoming schedules ("Il treno arriverà tra dieci minuti") and occasional supposition ("Sarà già a casa" — He must be home by now).',
    ],
    grammarExamples: [
      { form: 'Potrebbe controllare?', explanation: 'Polite conditional of potere ("Could you check?")' },
      { form: 'è in partenza dal binario', explanation: 'Standard station announcement ("is departing from platform...")' },
      { form: 'con dieci minuti di anticipo', explanation: 'Arriving ten minutes ahead of schedule (opposite: di ritardo)' },
      { form: 'Mi scusi, questo posto è libero?', explanation: 'Essential train question ("Excuse me, is this seat free?")' },
    ],
    sentences: [
      { target: 'Alle sette e venti del mattino, il treno ad alta velocità attende già al binario quattro di Torino Porta Nuova.', en: 'At 7:20 in the morning, the high-speed train is already waiting at platform four of Turin Porta Nuova.' },
      { target: 'Controllo il biglietto sullo schermo del telefono e salgo nella carrozza sei con la mia valigia.', en: 'I check the ticket on my phone screen and board carriage six with my suitcase.' },
      { target: '«Mi scusi, questo posto vicino al finestrino sarebbe libero?» chiedo a un ragazzo che legge il giornale.', en: '"Excuse me, would this seat by the window happen to be free?" I ask a young man reading the newspaper.' },
      { target: '«Sì, si accomodi pure, io scenderò a Bologna tra poco più di due ore», risponde con un sorriso.', en: '"Yes, please go right ahead and sit down; I will be getting off in Bologna in a little over two hours," he replies with a smile.' },
      { target: 'Appena superiamo Milano, i campi della pianura lasciano spazio alle gallerie sotto gli Appennini.', en: 'As soon as we pass Milan, the fields of the plain give way to tunnels beneath the Apennines.' },
      { target: 'Passa il controllore e annuncia che il vagone ristorante aprirà tra pochi minuti per la colazione.', en: 'The ticket inspector walks through and announces that the dining car will open in a few minutes for breakfast.' },
      { target: 'Verso l’ora di pranzo, le colline del Lazio annunciano l’arrivo a Roma Termini.', en: 'Around lunchtime, the hills of Lazio signal our arrival at Rome Termini.' },
      { target: 'Nel pomeriggio, il paesaggio cambia ancora: compaiono gli ulivi, le case bianche e infine il profilo del Vesuvio.', en: 'In the afternoon, the landscape changes once more: olive groves, white houses, and finally the silhouette of Mount Vesuvius appear.' },
      { target: 'Quando scendo a Napoli Centrale, l’aria è già tiepida e profuma di caffè e mare.', en: 'When I step off at Naples Central, the air is already mild and carries the scent of coffee and the sea.' },
    ],
    vocabulary: [
      { term: 'il binario', pos: 'noun (m.)', meaning: 'train platform / track', usageNote: 'Essential word in every Italian station.' },
      { term: 'la carrozza', pos: 'noun (f.)', meaning: 'train carriage / coach', usageNote: 'Also called vagone.' },
      { term: 'il finestrino', pos: 'noun (m.)', meaning: 'train/car window', usageNote: 'A house window is finestra; a vehicle window is finestrino.' },
      { term: 'si accomodi', pos: 'polite imperative', meaning: 'please have a seat / make yourself comfortable', usageNote: 'From accomodarsi (polite Lei form).' },
      { term: 'il controllore', pos: 'noun (m.)', meaning: 'ticket inspector / conductor', usageNote: 'Checks tickets onboard Italian trains.' },
      { term: 'tiepido', pos: 'adjective', meaning: 'lukewarm, pleasantly mild', usageNote: 'Used for mild coastal air or warm water.' },
    ],
    comprehensionCheck: [
      {
        question: 'What is the difference between "la finestra" and "il finestrino"?',
        answer: 'Finestra is a building window; finestrino refers to a small window inside a train, bus, car, or airplane.',
      },
      {
        question: 'What does a host or fellow passenger mean by "Si accomodi pure"?',
        answer: '"Please go ahead and make yourself comfortable / sit down."',
      },
      {
        question: 'How do you say "ten minutes late" vs. "ten minutes early" in Italian?',
        answer: 'Con dieci minuti di ritardo (late) vs. con dieci minuti di anticipo (early).',
      },
    ],
  },

  // ================= SPANISH =================
  {
    slug: 'el_mercado_de_valencia',
    hubSlug: 'spanish',
    language: 'Spanish',
    level: 'Intermediate (B1)',
    category: 'Story',
    tenseFocus: 'Present & Sensory Description',
    titleTarget: 'Los colores del Mercado Central de Valencia',
    titleEn: 'The Colors of Valencia’s Central Market',
    summary:
      'Step inside Europe’s largest Art Nouveau fresh market in Valencia while mastering Spanish sensory nouns, gender agreement, and food expressions.',
    publishedDate: '2026-09-20',
    updatedDate: '2026-11-10',
    readingMinutes: 5,
    culturalContext: [
      'Opened in 1928 in Valencia’s historic center, the Mercado Central is an architectural jewel of iron, ceramic tiles, and stained glass dedicated entirely to fresh local produce. Farmers from the surrounding irrigated farmland—known as La Huerta—still bring citrus fruit, tiger nuts (chufas), tomatoes, and saffron directly to more than two hundred stalls.',
      'Unlike rushed weekday supermarkets, Spanish municipal markets remain neighborhood meeting halls where vendors know regulars by name and happily share recipe advice for traditional Valencian paella or seasonal stews.',
    ],
    grammarSpotlightTitle: 'Adjective Agreement & Sensory Verbs in Spanish',
    grammarSpotlightParagraphs: [
      'Notice how Spanish adjectives mirror the gender and number of the nouns they describe: "una joya arquitectónica" (feminine singular) vs. "productos frescos" (masculine plural).',
      'Also watch verbs of perception and atmosphere—llenar (to fill), oler a (to smell like), and despertar (to awaken)—which bring descriptive writing alive.',
    ],
    grammarExamples: [
      { form: 'llena de luz', explanation: 'Feminine adjective llena agreeing with joya + preposition de' },
      { form: 'el olor a especias', explanation: 'Verb/noun olor pairs with preposition a ("the smell of spices")' },
      { form: 'para preparar el almuerzo', explanation: 'Para + infinitive expresses purpose ("in order to prepare lunch")' },
      { form: 'productos frescos', explanation: 'Masculine plural agreement across noun and adjective' },
    ],
    vocabulary: [
      { term: 'la joya', pos: 'noun (f.)', meaning: 'jewel, gem', usageNote: 'Used figuratively for landmark buildings or treasures.' },
      { term: 'el amanecer', pos: 'noun (m.)', meaning: 'dawn, daybreak', usageNote: 'Literally "the becoming morning"; al amanecer = at dawn.' },
      { term: 'el agricultor', pos: 'noun (m.)', meaning: 'farmer, grower', usageNote: 'Feminine form: la agricultora.' },
      { term: 'las especias', pos: 'noun (f. pl.)', meaning: 'spices', usageNote: 'Not to be confused with especies (biological species).' },
      { term: 'el pasillo', pos: 'noun (m.)', meaning: 'aisle, corridor', usageNote: 'Used for hallways, airplane aisles, and market lanes.' },
      { term: 'el almuerzo', pos: 'noun (m.)', meaning: 'lunch / mid-morning meal', usageNote: 'In Valencia, "el almuerzo" (esmorzaret) often means a hearty 10 a.m. sandwich.' },
    ],
    comprehensionCheck: [
      {
        question: 'Which preposition pairs with "olor" (smell) in Spanish?',
        answer: 'The preposition "a" ("olor a especias y pan recién horneado").',
      },
      {
        question: 'What is the difference between "las especias" and "las especies"?',
        answer: 'Especias means culinary spices (like saffron or paprika); especies means animal or plant species.',
      },
      {
        question: 'Why does "llena" end in -a instead of -o in "una joya arquitectónica llena de luz"?',
        answer: 'Because it modifies "una joya", which is feminine singular.',
      },
    ],
  },
  {
    slug: 'spanish_ser_vs_estar_guide',
    hubSlug: 'spanish',
    language: 'Spanish',
    level: 'Beginner to Intermediate (A2-B1)',
    category: 'Grammar Guide',
    tenseFocus: 'Ser vs. Estar',
    titleTarget: 'Una tarde en Madrid: ¿ser o estar?',
    titleEn: 'An Afternoon in Madrid: Ser vs. Estar in Context',
    summary:
      'Stop guessing between ser and estar by seeing how native speakers use both verbs naturally in a walk through Madrid’s Retiro Park.',
    publishedDate: '2026-10-06',
    updatedDate: '2026-11-10',
    readingMinutes: 7,
    culturalContext: [
      'Parque del Buen Retiro sits right at the heart of Madrid, serving as the city’s open-air living room. On sunny afternoons, locals row across the artificial lake beside the monument to Alfonso XII, browse used books along Cuesta de Moyano, and meet friends under shaded chestnut trees.',
      'Observing what is permanent about a place (history, stone architecture, identity) versus what changes moment to moment (crowds, mood, location of friends) mirrors the exact logic behind Spanish ser and estar.',
    ],
    grammarSpotlightTitle: 'Adjectives That Change Meaning with Ser vs. Estar',
    grammarSpotlightParagraphs: [
      'Learners often memorize DOCTOR (ser: Description, Occupation, Characteristic, Time, Origin, Relationship) and PLACE (estar: Position, Location, Action, Condition, Emotion). That acronym handles 85% of cases cleanly.',
      'Even more illuminating are adjectives whose meaning shifts completely depending on the verb: "es aburrido" means someone is a boring person, whereas "está aburrido" means they feel bored right now; "es listo" means clever, while "está listo" means ready.',
    ],
    grammarExamples: [
      { form: 'El parque está en el centro', explanation: 'Location ALWAYS uses estar—even for permanent buildings or parks!' },
      { form: 'La fiesta es en el jardín', explanation: 'Exception: where an EVENT takes place uses ser ("takes place at")' },
      { form: 'El café está muy bueno', explanation: 'Estar + bueno expresses that something tastes delicious right now' },
      { form: 'Madrid es enorme', explanation: 'Ser + adjective defines an inherent characteristic' },
    ],
    sentences: [
      { target: 'El Parque del Retiro está en el centro de Madrid, muy cerca del Museo del Prado.', en: 'Retiro Park is in the center of Madrid, very close to the Prado Museum.' },
      { target: 'Este parque es uno de los lugares más antiguos y tranquilos de toda la ciudad.', en: 'This park is one of the oldest and quietest places in the entire city.' },
      { target: 'Hoy es domingo y el cielo está completamente despejado.', en: 'Today is Sunday and the sky is completely clear.' },
      { target: 'Como hace buen tiempo, los caminos están llenos de familias y corredores.', en: 'Since the weather is nice, the paths are full of families and runners.' },
      { target: 'Mi amigo Carlos es de Sevilla, pero ahora está viviendo en Madrid por su trabajo.', en: 'My friend Carlos is from Seville, but right now he is living in Madrid for his job.' },
      { target: 'Cuando llego al estanque, Carlos ya está listo para alquilar una barca.', en: 'When I arrive at the pond, Carlos is already ready to rent a rowboat.' },
      { target: '«¿Estabas aburrido esperando?» le pregunto mientras subimos.', en: '"Were you bored waiting?" I ask him as we climb in.' },
      { target: '«¡Qué va! Este sitio nunca es aburrido; siempre hay músicos tocando cerca del palacio.»', en: '"Not at all! This place is never boring; there are always musicians playing near the palace."' },
      { target: 'Después nos tomamos una horchata fría que está buenísima bajo la sombra de los árboles.', en: 'Afterwards we drink a cold horchata that tastes delicious in the shade of the trees.' },
      { target: 'El concierto gratuito al aire libre es a las siete frente al Palacio de Cristal.', en: 'The free open-air concert is at seven in front of the Crystal Palace.' },
    ],
    vocabulary: [
      { term: 'despejado', pos: 'adjective', meaning: 'clear (sky), cloudless', usageNote: 'Pairs with estar because weather is a condition.' },
      { term: 'el estanque', pos: 'noun (m.)', meaning: 'pond, ornamental lake', usageNote: 'Used for Retiro Park’s famous boating lake.' },
      { term: 'alquilar', pos: 'verb', meaning: 'to rent', usageNote: 'Used in Spain; rentar is also common in parts of Latin America.' },
      { term: '¡Qué va!', pos: 'exclamation', meaning: 'No way! / Not at all!', usageNote: 'Very common conversational expression in Spain.' },
      { term: 'al aire libre', pos: 'adverbial', meaning: 'outdoors, open-air', usageNote: 'Used for concerts, markets, and dining.' },
    ],
    comprehensionCheck: [
      {
        question: 'Why does "El Parque del Retiro está en el centro" use estar even though the park never moves?',
        answer: 'In Spanish, physical location of people, objects, and places ALWAYS uses estar.',
      },
      {
        question: 'Why does "El concierto es a las siete frente al palacio" use ser?',
        answer: 'Because events (concerts, classes, parties) use ser to state when and where they take place.',
      },
      {
        question: 'What is the difference between "está aburrido" and "es aburrido"?',
        answer: '"Está aburrido" means someone is bored right now; "es aburrido" means something or someone is boring by nature.',
      },
    ],
  },
  {
    slug: 'tacos_y_charlas_oaxaca',
    hubSlug: 'spanish',
    language: 'Spanish',
    level: 'Intermediate (B1-B2)',
    category: 'Dialogue',
    tenseFocus: 'Mexican Spanish & Polite Diminutives',
    titleTarget: 'Sabores de la tarde en Oaxaca',
    titleEn: 'Afternoon Flavors in Oaxaca',
    summary:
      'Experience Mexican Spanish hospitality, food vocabulary, and warm -ito diminutives in a street-food conversation in Oaxaca.',
    publishedDate: '2026-10-19',
    updatedDate: '2026-11-10',
    readingMinutes: 6,
    culturalContext: [
      'Oaxaca is widely celebrated as one of Mexico’s culinary capitals, famed for hand-ground moles, smoky mezcal, freshly pressed corn tortillas, and vibrant afternoon markets such as Mercado 20 de Noviembre.',
      'Listening to Mexican Spanish reveals a distinctive melodic warmth—especially the frequent use of diminutives like cafecito, ahorita, and poquito, which rarely refer only to physical size and instead soften requests to express politeness and friendliness.',
    ],
    grammarSpotlightTitle: 'How Mexican Diminutives Add Warmth & Nuance',
    grammarSpotlightParagraphs: [
      'In textbook Spanish, -ito simply means "little." In everyday Mexican conversation, adding -ito transforms directness into cordiality: "¿Me da un poquito de salsa?" sounds much gentler than asking bluntly for salsa.',
      'Watch out for ahorita: depending on tone and context, it can mean "right this second," "in a few minutes," or "later today."',
    ],
    grammarExamples: [
      { form: 'un poquito', explanation: 'Softened diminutive of poco ("just a little bit")' },
      { form: '¿Pica mucho?', explanation: 'Standard Mexican phrasing asking "Is it very spicy?" (from picar)' },
      { form: 'Con todo', explanation: 'Classic street-taco answer meaning "with all the toppings" (onion, cilantro, lime)' },
      { form: 'Ahorita se lo preparo', explanation: 'Friendly assurance ("I’ll make that for you right away")' },
    ],
    sentences: [
      { target: 'Al caer la tarde, las calles empedradas del centro de Oaxaca se llenan del aroma del maíz recién molido.', en: 'As evening falls, the cobblestone streets of central Oaxaca fill with the aroma of freshly ground corn.' },
      { target: 'Frente a un puesto iluminado, Doña Elena voltea tortillas azules sobre el comal caliente.', en: 'At a brightly lit stall, Doña Elena flips blue tortillas on the hot griddle.' },
      { target: '«Buenas tardes, joven. ¿Qué le vamos a preparar hoy?» pregunta con una sonrisa amable.', en: '"Good afternoon, young friend. What are we going to make for you today?" she asks with a kind smile.' },
      { target: '«Buenas tardes, señora. ¿Me da tres tlayudas o tacos con quesillo, por favor?»', en: '"Good afternoon, ma’am. Could you give me three tlayudas or tacos with Oaxaca cheese, please?"' },
      { target: '«Claro que sí, ahorita se los preparo. ¿Los quiere con todo o sin cebolla?»', en: '"Of course, I’ll make them for you right away. Do you want them with everything or without onion?"' },
      { target: '«Con todo, pero antes quiero preguntar si la salsa roja pica mucho.»', en: '"With everything, though first I want to ask if the red salsa is very spicy."' },
      { target: '«La roja sí pica bastante, mejor pruebe un poquito de la verde con aguacate.»', en: '"The red one is quite spicy; better try a little bit of the green one with avocado."' },
      { target: 'Minutos después, el plato llega humeante con rábanos frescos y unas gotas de limón.', en: 'Minutes later, the plate arrives steaming with fresh radishes and a few drops of lime.' },
      { target: 'Conversar en la mesa compartida convierte una cena rápida en una lección viva de cultura mexicana.', en: 'Chatting at the shared table turns a quick dinner into a living lesson in Mexican culture.' },
    ],
    vocabulary: [
      { term: 'empedrado', pos: 'adjective', meaning: 'cobblestoned', usageNote: 'From piedra (stone).' },
      { term: 'el comal', pos: 'noun (m.)', meaning: 'flat griddle for tortillas', usageNote: 'Key word in Mexican kitchens, derived from Nahuatl comalli.' },
      { term: 'el quesillo', pos: 'noun (m.)', meaning: 'stringy Oaxaca cheese', usageNote: 'Known outside Oaxaca as queso Oaxaca.' },
      { term: 'picar', pos: 'verb', meaning: 'to be spicy / sting', usageNote: 'Use picar (not ser caliente) for chili heat.' },
      { term: 'el limón', pos: 'noun (m.)', meaning: 'lime (in Mexico)', usageNote: 'In Mexico, green limes are called limón; yellow lemons are limón amarillo.' },
    ],
    comprehensionCheck: [
      {
        question: 'How do you ask "Is this salsa spicy?" naturally in Mexico?',
        answer: '"¿Pica mucho esta salsa?" — using the verb picar rather than caliente (which means hot in temperature).',
      },
      {
        question: 'What does ordering tacos "con todo" mean?',
        answer: 'It means you want all the standard garnish toppings—typically chopped onion, cilantro, and lime.',
      },
      {
        question: 'Why does Doña Elena say "ahorita se los preparo"?',
        answer: 'Ahorita is an affectionate diminutive of ahora ("now"), reassuring the customer that she is preparing the order right away.',
      },
    ],
  },
  {
    slug: 'preterite_vs_imperfect_barcelona',
    hubSlug: 'spanish',
    language: 'Spanish',
    level: 'Upper Intermediate (B2)',
    category: 'Grammar Guide',
    tenseFocus: 'Preterite vs. Imperfect',
    titleTarget: 'Lluvia inesperada en el Barrio Gótico',
    titleEn: 'Unexpected Rain in the Gothic Quarter',
    summary:
      'Master the contrast between Spanish preterite and imperfect past tenses with a vivid rainy-evening story in Barcelona.',
    publishedDate: '2026-10-29',
    updatedDate: '2026-11-10',
    readingMinutes: 6,
    culturalContext: [
      'Barcelona’s Barri Gòtic (Gothic Quarter) is a labyrinth of narrow stone alleyways, hidden plazas, and medieval arches where sunlight disappears early in the afternoon. When a sudden Mediterranean downpour sweeps in off the sea, pedestrians duck under porticoes or step into historic bookshops and chocolaterías.',
      'Narrating how an ordinary walk turned into an unexpected detour gives you clear mental anchors for choosing between Spanish preterite and imperfect verbs.',
    ],
    grammarSpotlightTitle: 'Action Spine (Preterite) vs. Descriptive Backdrop (Imperfect)',
    grammarSpotlightParagraphs: [
      'In Spanish storytelling, the preterite (pretérito indefinido) forms the spine of what happened: "Empezó a llover", "Entramos en una librería", "Compramos dos paraguas." Each action moved the timeline forward.',
      'The imperfect (pretérito imperfecto) provides everything happening around those events: "Eran las seis", "Las calles brillaban", "No teníamos prisa." Remember that time of day in the past almost always uses the imperfect ("Eran las seis", "Era la una").',
    ],
    grammarExamples: [
      { form: 'Eran las seis de la tarde', explanation: 'Clock times in the past ALWAYS take imperfect' },
      { form: 'De repente empezó a llover', explanation: 'Trigger phrase "de repente" (suddenly) signals preterite' },
      { form: 'Mientras buscábamos refugio', explanation: 'Ongoing background action with mientras uses imperfect' },
      { form: 'Estuvimos una hora allí', explanation: 'Bounded duration ("for one hour") triggers preterite' },
    ],
    sentences: [
      { target: 'Eran casi las seis de la tarde cuando salimos a caminar por el Barrio Gótico de Barcelona.', en: 'It was almost six in the evening when we went out to walk through Barcelona’s Gothic Quarter.' },
      { target: 'Las fachadas de piedra tenían un color dorado y los músicos callejeros tocaban la guitarra en la plaza.', en: 'The stone facades had a golden hue and street musicians were playing guitar in the square.' },
      { target: 'No llevábamos paraguas porque por la mañana hacía mucho sol.', en: 'We weren’t carrying umbrellas because in the morning it had been very sunny.' },
      { target: 'De repente, unas nubes oscuras cubrieron el cielo y empezó a llover con fuerza.', en: 'Suddenly, dark clouds covered the sky and it began to rain heavily.' },
      { target: 'Corrimos bajo los arcos antiguos mientras los adoquines empezaban a brillar como espejos.', en: 'We ran under the old arches while the cobblestones began to shine like mirrors.' },
      { target: 'Para resguardarnos mejor, abrimos la puerta de una librería de segunda mano muy acogedora.', en: 'To shelter better, we opened the door of a very cozy secondhand bookshop.' },
      { target: 'El dueño leía detrás del mostrador y nos saludó con tranquilidad.', en: 'The owner was reading behind the counter and greeted us calmly.' },
      { target: 'Estuvimos casi una hora ojeando novelas antiguas hasta que paró la tormenta.', en: 'We spent nearly an hour browsing old novels until the storm stopped.' },
      { target: 'Cuando volvimos a salir, el aire olía a tierra mojada y toda la ciudad parecía recién lavada.', en: 'When we stepped back outside, the air smelled of wet earth and the whole city looked freshly washed.' },
    ],
    vocabulary: [
      { term: 'de repente', pos: 'adverbial', meaning: 'suddenly', usageNote: 'Reliable cue to switch into the preterite tense.' },
      { term: 'resguardarse', pos: 'reflexive verb', meaning: 'to take shelter', usageNote: 'Often used for shelter from rain or wind.' },
      { term: 'acogedor / acogedora', pos: 'adjective', meaning: 'cozy, welcoming', usageNote: 'Great adjective for cafés, bookshops, and rooms.' },
      { term: 'ojear', pos: 'verb', meaning: 'to browse / skim through', usageNote: 'Without h: from ojo (eye); hojear (with h) means to flip pages (hoja).' },
      { term: 'los adoquines', pos: 'noun (m. pl.)', meaning: 'cobblestones', usageNote: 'Square paving stones common in historic quarters.' },
    ],
    comprehensionCheck: [
      {
        question: 'Why does the story start with "Eran casi las seis" rather than "Fueron casi las seis"?',
        answer: 'Telling time in the past always uses the imperfect (era / eran) because it sets the background time frame.',
      },
      {
        question: 'Why does "Estuvimos casi una hora" use the preterite instead of imperfect?',
        answer: 'Because the duration has a clear endpoint ("until the storm stopped"), viewing the stay as a completed block of time.',
      },
      {
        question: 'What is the subtle difference between "ojear" and "hojear"?',
        answer: 'Ojear (from ojo, eye) means to glance over or browse; hojear (from hoja, page) means to leaf through pages.',
      },
    ],
  },

  // ================= FRENCH =================
  {
    slug: 'matin_boulangerie_lyon',
    hubSlug: 'french',
    language: 'French',
    level: 'Beginner (A2)',
    category: 'Dialogue',
    tenseFocus: 'Polite Requests & Partitive Articles',
    titleTarget: 'Un matin à la boulangerie à Lyon',
    titleEn: 'A Morning at the Bakery in Lyon',
    summary:
      'Practice polite French bakery etiquette, partitive articles (du, de la, des), and natural numbers in a morning visit in Lyon.',
    publishedDate: '2026-09-25',
    updatedDate: '2026-11-08',
    readingMinutes: 5,
    culturalContext: [
      'In France, stepping into a neighborhood boulangerie begins with a clear, warm "Bonjour, Madame" or "Bonjour, Monsieur." Skipping the greeting before stating an order feels abrupt in French culture, whereas starting politely guarantees a friendly exchange.',
      'Lyon—famous as France’s gastronomic capital along the Rhône and Saône rivers—adds local specialties such as brioche aux pralines roses (bright pink caramelized almonds) alongside classic baguettes de tradition and croissants au beurre.',
    ],
    grammarSpotlightTitle: 'Polite Conditionals & Partitive Articles in French',
    grammarSpotlightParagraphs: [
      'French distinguishes sharply between asking for one whole countable item ("une baguette", "deux croissants") and an unspecified amount of bread, jam, or butter ("du pain", "de la confiture").',
      'Always use "Je voudrais..." (I would like) instead of "Je veux..." (I want) at shops and restaurants, and close every transaction with "Bonne journée !" (Have a nice day).',
    ],
    grammarExamples: [
      { form: 'Je voudrais une tradition', explanation: 'Short for "une baguette de tradition" — polite conditional request' },
      { form: 'du pain complet', explanation: 'Partitive article du (de + le) for uncountable whole-grain bread' },
      { form: 'Avec ceci ?', explanation: 'Standard baker phrase meaning "Anything else with that?"' },
      { form: 'Ce sera tout, merci', explanation: '"That will be all, thank you" (future of être)' },
    ],
    sentences: [
      { target: 'À sept heures et demie, une lumière chaude éclaire déjà la vitrine de la boulangerie du quartier.', en: 'At seven-thirty, a warm light already illuminates the window of the neighborhood bakery.' },
      { target: 'La clochette sonne quand Claire pousse la porte en bois : « Bonjour, Madame ! »', en: 'The little bell rings as Claire pushes open the wooden door: "Hello, Madam!"' },
      { target: '« Bonjour ! Qu’est-ce qui vous ferait plaisir ce matin ? »', en: '"Good morning! What would you like this morning?"' },
      { target: '« Je voudrais une baguette de tradition bien cuite et deux croissants au beurre, s’il vous plaît. »', en: '"I would like a well-baked traditional baguette and two butter croissants, please."' },
      { target: '« Voilà pour vous. Et avec ceci ? » demande la boulangère en préparant le sachet en papier.', en: '"There you go. Anything else with that?" asks the baker while preparing the paper bag.' },
      { target: '« Est-ce qu’il vous reste de la brioche aux pralines roses pour le goûter ? »', en: '"Do you have any pink-praline brioche left for afternoon snack?"' },
      { target: '« Oui, celle-ci vient juste de sortir du four. Je vous en coupe une part ? »', en: '"Yes, this one just came out of the oven. Shall I cut you a slice?"' },
      { target: '« Volontiers ! Ce sera tout pour aujourd’hui, merci beaucoup. »', en: '"Gladly! That will be all for today, thank you very much."' },
      { target: 'Claire règle par carte sans contact, glisse la baguette chaude sous son bras et souhaite une bonne journée.', en: 'Claire pays by contactless card, tucks the warm baguette under her arm, and wishes her a good day.' },
    ],
    vocabulary: [
      { term: 'bien cuite / pas trop cuite', pos: 'adj. phrase', meaning: 'well-baked / lightly baked', usageNote: 'Used in France to request your favorite baguette crust.' },
      { term: 'le goûter', pos: 'noun (m.)', meaning: 'late-afternoon sweet snack', usageNote: 'Traditional 4 p.m. snack for kids and adults alike.' },
      { term: 'sortir du four', pos: 'verb phrase', meaning: 'to come out of the oven', usageNote: '"Elle vient de sortir" = It has just come out.' },
      { term: 'volontiers', pos: 'adverb', meaning: 'gladly, with pleasure', usageNote: 'Polite, idiomatic alternative to "oui, merci."' },
      { term: 'régler', pos: 'verb', meaning: 'to pay / settle a bill', usageNote: 'Slightly more polite than payer in shops and cafés.' },
    ],
    comprehensionCheck: [
      {
        question: 'What is the essential first word when entering any small French shop?',
        answer: '"Bonjour" (optionally followed by Madame or Monsieur) before making your request.',
      },
      {
        question: 'What does "Je viens de sortir" / "elle vient de sortir" express in French?',
        answer: 'Venir de + infinitive expresses the immediate past ("it has just come out").',
      },
      {
        question: 'How do you ask for a crustier, darker baguette at a French bakery?',
        answer: 'Ask for "une baguette bien cuite."',
      },
    ],
  },
  {
    slug: 'train_versailles_y_en',
    hubSlug: 'french',
    language: 'French',
    level: 'Intermediate (B1)',
    category: 'Grammar Guide',
    tenseFocus: 'Pronouns Y and En + Travel',
    titleTarget: 'Une excursion à Versailles : maîtriser « y » et « en »',
    titleEn: 'A Day Trip to Versailles: Mastering Y and En',
    summary:
      'Demystify French pronouns "y" and "en" once and for all through a weekend train excursion to the gardens of Versailles.',
    publishedDate: '2026-10-12',
    updatedDate: '2026-11-08',
    readingMinutes: 6,
    culturalContext: [
      'Only forty minutes from central Paris by RER C or suburban train, the Palace and Gardens of Versailles feel a world apart from city boulevards. While the Hall of Mirrors draws huge crowds indoors, locals frequently head straight for the vast park—walking past the Grand Canal, renting bikes, and picnicking beneath manicured chestnut groves.',
      'Conversations while planning a day trip like this naturally revolve around places ("are you going there?") and quantities ("did you bring any?")—the exact home turf of French pronouns y and en.',
    ],
    grammarSpotlightTitle: 'The Clean Rule Separating Y from En',
    grammarSpotlightParagraphs: [
      'Remember one crisp distinction: **y** replaces a location or a phrase introduced by **à** ("Tu vas à Versailles ? Oui, j’y vais" — Yes, I’m going there). **En** replaces a quantity or a phrase introduced by **de** ("Tu as acheté des billets ? Oui, j’en ai acheté deux" — Yes, I bought two of them).',
      'In spoken French, these tiny words sit right before the conjugated verb (or before the infinitive when there are two verbs: "Je veux y aller").',
    ],
    grammarExamples: [
      { form: 'On y va !', explanation: 'Famous idiomatic phrase: "Let’s go (there)!"' },
      { form: 'J’y suis déjà allé', explanation: 'Y sits before auxiliary suis ("I’ve already been there")' },
      { form: 'Il y en a beaucoup', explanation: 'Combines il y a + en ("There are a lot of them")' },
      { form: 'N’en parle pas', explanation: 'En replaces "de cela" ("Don’t talk about it")' },
    ],
    sentences: [
      { target: 'Samedi matin, Luc propose à Nadia de prendre le train pour passer la journée à Versailles.', en: 'Saturday morning, Luc suggests to Nadia that they take the train to spend the day at Versailles.' },
      { target: '« Tu y es déjà allée au printemps ? Les fontaines musicales commencent ce week-end. »', en: '"Have you already been there in the spring? The musical fountains start this weekend."' },
      { target: '« Non, je n’y suis jamais allée à cette saison, mais j’ai très envie d’y passer l’après-midi ! »', en: '"No, I’ve never been there in this season, but I really feel like spending the afternoon there!"' },
      { target: 'À la gare, Nadia vérifie les billets sur son téléphone : « Tu en as pris deux avec l’accès aux jardins ? »', en: 'At the station, Nadia checks the tickets on her phone: "Did you get two of them with garden access?"' },
      { target: '« Oui, j’en ai réservé deux hier soir pour éviter la file d’attente devant la grille dorée. »', en: '"Yes, I booked two of them last night to avoid the line in front of the golden gate."' },
      { target: 'Dans le parc, les allées bordées d’arbres s’étendent à perte de vue autour du Grand Canal.', en: 'In the park, the tree-lined avenues stretch as far as the eye can see around the Grand Canal.' },
      { target: 'Près de l’eau, il y a des barques vertes ; les visiteurs en louent souvent pour une heure.', en: 'Near the water, there are green rowboats; visitors often rent them for an hour.' },
      { target: '« On prend des pommes dans le sac ? » — « Oui, j’en ai apporté quatre et une bouteille d’eau. »', en: '"Shall we take apples in the bag?" — "Yes, I brought four of them and a bottle of water."' },
      { target: 'À six heures, fatigués mais ravis, ils reprennent le RER en promettant d’y revenir en automne.', en: 'At six o’clock, tired yet delighted, they take the RER back while promising to return there in autumn.' },
    ],
    vocabulary: [
      { term: 'la file d’attente', pos: 'noun (f.)', meaning: 'queue / waiting line', usageNote: 'Literally "line of waiting."' },
      { term: 'à perte de vue', pos: 'adverbial', meaning: 'as far as the eye can see', usageNote: 'Classic literary and travel expression.' },
      { term: 'louer', pos: 'verb', meaning: 'to rent / hire', usageNote: 'Used for boats, bicycles, and apartments.' },
      { term: 'ravi / ravie', pos: 'adjective', meaning: 'delighted, thrilled', usageNote: 'Stronger and warmer than content.' },
      { term: 'avoir envie de', pos: 'verb phrase', meaning: 'to feel like / want to', usageNote: 'Followed by an infinitive or noun.' },
    ],
    comprehensionCheck: [
      {
        question: 'In "J’en ai réservé deux", what does "en" replace?',
        answer: 'It replaces "de billets" (of tickets) because a specific quantity ("deux") is stated.',
      },
      {
        question: 'Why does "Je n’y suis jamais allée" use "y" instead of "en"?',
        answer: 'Because it refers back to a destination/place introduced by à ("à Versailles").',
      },
      {
        question: 'Where does "y" go when an infinitive follows a main verb ("Je veux ___ aller")?',
        answer: 'Right before the infinitive that governs it: "Je veux y aller."',
      },
    ],
  },
  {
    slug: 'passe_compose_montmartre',
    hubSlug: 'french',
    language: 'French',
    level: 'Intermediate (B1-B2)',
    category: 'Story',
    tenseFocus: 'Passé Composé (Avoir vs. Être)',
    titleTarget: 'Une soirée musicale à Montmartre',
    titleEn: 'A Musical Evening in Montmartre',
    summary:
      'Follow an evening stroll up the steps of Montmartre while practicing when French passé composé selects être versus avoir.',
    publishedDate: '2026-10-27',
    updatedDate: '2026-11-08',
    readingMinutes: 6,
    culturalContext: [
      'Crowning northern Paris, Montmartre still retains winding village lanes, hidden vineyards, and panoramic views from the steps of Sacré-Cœur Basilica. At dusk, acoustic guitarists, violinists, and sketch artists gather around Place du Tertre and the terraced lawns overlooking the city lights.',
      'Walking up and down Montmartre’s steep staircases is practically built for practicing French verbs of motion—aller, venir, monter, descendre, arriver, partir—which happen to form the core of the être family in the passé composé.',
    ],
    grammarSpotlightTitle: 'Motion Verbs with Être & Past-Participle Agreement',
    grammarSpotlightParagraphs: [
      'Most French verbs form the past tense with avoir ("j’ai écouté", "nous avons dîné"). A select group of roughly sixteen intransitive verbs of movement and change of state—plus ALL reflexive verbs—use être ("elle est montée", "nous sommes arrivés").',
      'Watch out for a sneaky detail: when monter, descendre, or sortir takes a direct object ("J’ai monté l’escalier" vs. "Je suis monté en haut"), it switches back to avoir! And with être, the past participle agrees with the subject in gender and number.',
    ],
    grammarExamples: [
      { form: 'nous sommes montés', explanation: 'Être auxiliary + plural agreement -s (intransitive motion)' },
      { form: 'j’ai monté les valises', explanation: 'Switches to avoir when there is a direct object (les valises)' },
      { form: 'elle s’est arrêtée', explanation: 'Reflexive verb always uses être; feminine agreement -e' },
      { form: 'on a entendu un violon', explanation: 'Avoir auxiliary with direct object ("we heard a violin")' },
    ],
    sentences: [
      { target: 'Vendredi soir, Camille et moi sommes sortis du métro Abbesses juste avant le coucher du soleil.', en: 'Friday evening, Camille and I exited the Abbesses metro station just before sunset.' },
      { target: 'Nous sommes montés lentement par les ruelles pavées jusqu’à la basilique du Sacré-Cœur.', en: 'We walked slowly up the cobblestone alleys all the way to the Sacré-Cœur Basilica.' },
      { target: 'En chemin, Camille s’est arrêtée devant une petite librairie éclairée par des guirlandes.', en: 'Along the way, Camille stopped in front of a small bookshop lit by string lights.' },
      { target: 'Sur les marches, des dizaines de Parisiens et de voyageurs se sont assis face à la ville.', en: 'On the steps, dozens of Parisians and travelers sat facing the city.' },
      { target: 'Soudain, un violoniste a commencé à jouer une valse mélancolique qui a captivé tout le monde.', en: 'Suddenly, a violinist began playing a melancholy waltz that captivated everyone.' },
      { target: 'Peu après, les réverbères se sont allumés un par un dans les rues en contrebas.', en: 'Shortly afterward, the streetlights came on one by one in the streets below.' },
      { target: 'Nous avons descendu une ruelle tranquille derrière la place pour trouver un bistro sans foule.', en: 'We walked down a quiet lane behind the square to find a bistro without crowds.' },
      { target: 'Là, nous avons commandé une soupe à l’oignon gratinée et partagé nos projets de voyage.', en: 'There, we ordered French onion soup and shared our travel plans.' },
      { target: 'Nous sommes rentrés tard, ravis d’avoir redécouvert Paris sous une lumière si douce.', en: 'We returned home late, delighted to have rediscovered Paris in such soft light.' },
    ],
    vocabulary: [
      { term: 'le coucher du soleil', pos: 'noun phrase', meaning: 'sunset', usageNote: 'Literally "the going to bed of the sun"; sunrise is le lever du soleil.' },
      { term: 'pavé / pavée', pos: 'adjective', meaning: 'cobblestoned, paved', usageNote: 'Used in "rues pavées" (cobblestone streets).' },
      { term: 'le réverbère', pos: 'noun (m.)', meaning: 'streetlamp', usageNote: 'Classic Parisian iron lamp post.' },
      { term: 'en contrebas', pos: 'adverbial', meaning: 'below, down below (on a slope)', usageNote: 'Useful when looking down from a hill or balcony.' },
      { term: 'sans foule', pos: 'prep. phrase', meaning: 'without crowds', usageNote: 'Foule = crowd; bondé = packed/crowded.' },
    ],
    comprehensionCheck: [
      {
        question: 'Why did "Nous sommes montés" use être, whereas "Nous avons descendu une ruelle" used avoir?',
        answer: 'Monter had no direct object (went up), so it took être. Descendre took the direct object "une ruelle" (walked down a lane), so transitive use switched to avoir.',
      },
      {
        question: 'Why is there an extra -e on "Camille s’est arrêtée"?',
        answer: 'Reflexive verbs take être in the passé composé, so the participle agrees with the feminine subject Camille.',
      },
      {
        question: 'What does "en contrebas" describe?',
        answer: 'Something situated at a lower elevation below the observer’s vantage point.',
      },
    ],
  },

  // ================= GERMAN =================
  {
    slug: 'sonntag_baeckerei_berlin',
    hubSlug: 'german',
    language: 'German',
    level: 'Beginner (A2)',
    category: 'Dialogue',
    tenseFocus: 'Present Tense & Accusative Articles',
    titleTarget: 'Sonntagmorgen in einer Berliner Bäckerei',
    titleEn: 'Sunday Morning in a Berlin Bakery',
    summary:
      'Practice German accusative endings (einen, eine, ein), polite requests with "hätte gern", and weekend vocabulary at a neighborhood bakery.',
    publishedDate: '2026-09-28',
    updatedDate: '2026-11-05',
    readingMinutes: 5,
    culturalContext: [
      'Across Germany, Sunday morning belongs to the neighborhood bakery (Bäckerei). Even while supermarkets close nationwide on Sundays under German retail laws, bakeries stay open for several hours in the morning so families can pick up warm Brötchen (crusty bread rolls), pretzels, and fruit tarts for a leisurely breakfast.',
      'Ordering baked goods lets beginners practice one of German’s most consistent rules: masculine nouns change der/ein to den/einen when they are the direct object (accusative case) of "Ich nehme..." or "Ich hätte gern...".',
    ],
    grammarSpotlightTitle: 'The Accusative Shift for Masculine Nouns',
    grammarSpotlightParagraphs: [
      'Good news for German learners: in the accusative case (direct objects), feminine (die/eine), neuter (das/ein), and plural (die) nouns DO NOT change at all. Only masculine singular nouns shift from der -> den and ein -> einen.',
      'Since Kuchen (cake) and Kaffee (coffee) are masculine, you say "Ich hätte gern einen Kaffee." Meanwhile, Brötchen (roll) is neuter, so it stays "ein Brötchen."',
    ],
    grammarExamples: [
      { form: 'Ich hätte gern einen Kaffee', explanation: 'Masculine accusative: der Kaffee -> einen Kaffee' },
      { form: 'und zwei Brötchen', explanation: 'Plural nouns stay unchanged in the accusative' },
      { form: 'Sonst noch etwas?', explanation: 'Standard counter question: "Anything else?"' },
      { form: 'Zum Mitnehmen, bitte', explanation: '"To go / takeaway, please" (opposite: zum Hieressen)' },
    ],
    sentences: [
      { target: 'Am Sonntagmorgen stehen schon um acht Uhr mehrere Nachbarn vor der kleinen Bäckerei in Kreuzberg.', en: 'On Sunday morning at eight o’clock, several neighbors are already standing outside the small bakery in Kreuzberg.' },
      { target: 'Drinnen duftet es herrlich nach frischem Sauerteigbrot und warmen Zimtschnecken.', en: 'Inside, it smells wonderful of fresh sourdough bread and warm cinnamon rolls.' },
      { target: '«Guten Morgen! Was darf es heute sein?» fragt der Bäcker hinter der Glasvitrine.', en: '"Good morning! What may I get you today?" asks the baker behind the glass display case.' },
      { target: '«Guten Morgen! Ich hätte gern vier knusprige Roggenbrötchen und ein Rosinenbrötchen, bitte.»', en: '"Good morning! I would like four crispy rye rolls and a raisin roll, please."' },
      { target: '«Sehr gern. Darf es sonst noch etwas sein?»', en: '"Gladly. Would you like anything else?"' },
      { target: '«Ja, ich nehme noch einen großen Filterkaffee zum Mitnehmen und ein Stück Apfelkuchen.»', en: '"Yes, I will also take a large drip coffee to go and a piece of apple cake."' },
      { target: 'Der Bäcker packt das Gebäck sorgfältig in eine braune Papiertüte.', en: 'The baker packs the pastries carefully into a brown paper bag.' },
      { target: '«Das macht zusammen neun Euro zwanzig. Möchten Sie bar oder mit Karte zahlen?»', en: '"Together that comes to nine euros twenty. Would you like to pay in cash or by card?"' },
      { target: '«Mit Karte, bitte. Vielen Dank und einen schönen Sonntag!»', en: '"By card, please. Many thanks and have a lovely Sunday!"' },
    ],
    vocabulary: [
      { term: 'das Brötchen', pos: 'noun (n.)', meaning: 'crusty bread roll', usageNote: 'All nouns ending in -chen are neuter (das) and stay unchanged in plural.' },
      { term: 'knusprig', pos: 'adjective', meaning: 'crispy, crusty', usageNote: 'Favorite German adjective for fresh rolls and crust.' },
      { term: 'zum Mitnehmen', pos: 'prep. phrase', meaning: 'to go / takeaway', usageNote: 'Capitalized Mitnehmen is a nominalized infinitive ("for taking along").' },
      { term: 'das Gebäck', pos: 'noun (n.)', meaning: 'pastries / baked goods (collective)', usageNote: 'Collective noun with no plural.' },
      { term: 'bar zahlen', pos: 'verb phrase', meaning: 'to pay in cash', usageNote: 'Germany still loves cash alongside contactless cards.' },
    ],
    comprehensionCheck: [
      {
        question: 'Why does "ein großer Kaffee" become "einen großen Kaffee" after "ich nehme"?',
        answer: 'Kaffee is masculine singular and acts as the direct object (accusative case), shifting ein/er to einen/-en.',
      },
      {
        question: 'Why is "Brötchen" neuter ("ein Brötchen")?',
        answer: 'Every German noun ending in the diminutive suffix -chen or -lein is grammatically neuter (das).',
      },
      {
        question: 'How do you say "to go" vs. "to eat here" in a German café?',
        answer: '"Zum Mitnehmen" (to take along / to go) vs. "zum Hieressen" (for here).',
      },
    ],
  },
  {
    slug: 'german_word_order_v2_muenchen',
    hubSlug: 'german',
    language: 'German',
    level: 'Intermediate (B1)',
    category: 'Grammar Guide',
    tenseFocus: 'V2 Word Order & Subordinate Clauses',
    titleTarget: 'Fahrradtour an der Isar: Satzbau leicht gemacht',
    titleEn: 'Cycling Along the Isar in Munich: German Word Order',
    summary:
      'Conquer German V2 inversion, separable verbs, and "weil/obwohl" verb-final clauses through an outdoor story in Munich.',
    publishedDate: '2026-10-18',
    updatedDate: '2026-11-05',
    readingMinutes: 7,
    culturalContext: [
      'When the Föhn wind clears skies over Munich, the Isar riverbanks become the city’s favorite bike highway and picnic shoreline. Gravel paths weave from the English Garden south toward Flaucher, where locals cycle past wooden bridges and pause at shaded beer gardens.',
      'Describing a bike ride with time phrases ("Am Samstagmorgen"), reasons ("weil die Sonne scheint"), and separable actions ("wir fahren los", "wir packen ein") showcases every core rule of German sentence structure.',
    ],
    grammarSpotlightTitle: 'The Three Rules of German Verb Placement',
    grammarSpotlightParagraphs: [
      '1) **V2 in Main Clauses**: The conjugated verb MUST sit in the second idea slot. If you put time or place first ("Am Samstag..."), the subject immediately moves behind the verb: "Am Samstag **fahren** wir an die Isar."',
      '2) **Verb Klammer (Bracket)**: Separable prefixes (losfahren -> fahren ... los) and modal verbs split so the rest of the verb closes the sentence at the end. 3) **Verb-End after Subordinators**: Connectors such as weil (because), dass (that), wenn (when/if), and obwohl (although) kick the conjugated verb all the way to the end of that clause.',
    ],
    grammarExamples: [
      { form: 'Heute fahren wir früh los', explanation: 'Time-first forces V2 inversion; separable prefix los waits at the end' },
      { form: 'weil das Wetter herrlich ist', explanation: 'Subordinating conjunction weil pushes conjugated "ist" to the very end' },
      { form: 'obwohl der Weg lang war', explanation: 'Obwohl ("although") also sends the finite verb to final position' },
      { form: 'Wir können dort baden', explanation: 'Modal bracket: können in slot 2, infinitive baden at the end' },
    ],
    sentences: [
      { target: 'Am Samstagmorgen holen Lukas und Maja ihre Fahrräder aus dem Hof, weil endlich die Sonne scheint.', en: 'On Saturday morning Lukas and Maja fetch their bicycles from the courtyard because the sun is finally shining.' },
      { target: 'Bevor sie losfahren, packen sie eine Decke, Wasser und frische Brezeln in den Rucksack ein.', en: 'Before they set off, they pack a blanket, water, and fresh pretzels into the backpack.' },
      { target: 'Entlang der Isar radelt man durch grüne Parks, obwohl man mitten in einer Großstadt ist.', en: 'Along the Isar you cycle through green parks, even though you are in the middle of a major city.' },
      { target: 'Überall auf den Kiesbänken sitzen Gruppen von Freunden und genießen das klare Alpenwasser.', en: 'Everywhere on the gravel banks, groups of friends sit and enjoy the clear Alpine water.' },
      { target: 'Nach zehn Kilometern biegen die beiden rechts ab und stellen ihre Räder unter alten Kastanien ab.', en: 'After ten kilometers, the two of them turn right and park their bikes under old chestnut trees.' },
      { target: 'Lukas meint, dass eine Pause im Biergarten nach so viel Bewegung genau das Richtige sei.', en: 'Lukas says that a break in the beer garden after so much exercise is just the right thing.' },
      { target: 'Sie bestellen zwei Apfelschorlen und beobachten, wie Kinder flache Steine über den Fluss springen lassen.', en: 'They order two apple spritzers and watch children skip flat stones across the river.' },
      { target: 'Erst am späten Nachmittag machen sie sich auf den Rückweg, bevor die Abendkühle beginnt.', en: 'Only in the late afternoon do they head back, before the evening chill sets in.' },
    ],
    vocabulary: [
      { term: 'losfahren', pos: 'separable verb', meaning: 'to set off / depart by vehicle', usageNote: 'Splits into "sie fahren ... los" in present tense.' },
      { term: 'einpacken', pos: 'separable verb', meaning: 'to pack into a bag', usageNote: 'Opposite: auspacken (to unpack).' },
      { term: 'abbiegen', pos: 'separable verb', meaning: 'to turn (left/right)', usageNote: 'Used constantly in directions ("links abbiegen").' },
      { term: 'die Apfelschorle', pos: 'noun (f.)', meaning: 'apple juice mixed with sparkling water', usageNote: 'Classic refreshing German cyclist drink.' },
      { term: 'obwohl', pos: 'conjunction', meaning: 'although, even though', usageNote: 'Always sends the conjugated verb to the end of its clause.' },
    ],
    comprehensionCheck: [
      {
        question: 'Why does "Am Samstagmorgen holen Lukas und Maja..." put "holen" before the names?',
        answer: 'Because "Am Samstagmorgen" fills position 1, and German main clauses keep the conjugated verb strictly in position 2.',
      },
      {
        question: 'Where did the prefix "los-" go in "Bevor sie losfahren"?',
        answer: 'Inside a verb-final subordinate clause (after bevor, weil, dass), a separable prefix rejoins the stem as one word ("losfahren")!',
      },
      {
        question: 'What happens to the verb after "weil" or "obwohl"?',
        answer: 'It moves to the very end of the subordinate clause.',
      },
    ],
  },
  {
    slug: 'dative_verben_heidelberg',
    hubSlug: 'german',
    language: 'German',
    level: 'Upper Intermediate (B2)',
    category: 'Cultural Essay',
    tenseFocus: 'Dative Case & Prepositions',
    titleTarget: 'Ein Herbstspaziergang auf dem Philosophenweg in Heidelberg',
    titleEn: 'An Autumn Walk on Heidelberg’s Philosopher’s Way',
    summary:
      'Stroll above the Neckar valley in Heidelberg while practicing German dative prepositions (aus, bei, mit, nach, seit, von, zu) and dative verbs.',
    publishedDate: '2026-11-01',
    updatedDate: '2026-11-05',
    readingMinutes: 6,
    culturalContext: [
      'Across the Neckar River from Heidelberg’s Old Town and red-sandstone castle sits the Philosophenweg (Philosopher’s Way)—a sunlit hillside path where university professors and Romantic poets like Hölderlin and Eichendorff once walked while debating literature and science.',
      'Because of its sheltered south-facing microclimate, even Mediterranean fig and almond trees grow along these terraces before dropping golden leaves each autumn.',
    ],
    grammarSpotlightTitle: 'Mastering the Dative Preposition & Plural -n Rules',
    grammarSpotlightParagraphs: [
      'Ten everyday German prepositions ALWAYS trigger the dative case: aus, außer, bei, mit, nach, seit, von, zu, gegenüber. In the dative case, masculine and neuter articles become **dem / einem**, feminine becomes **der / einer**, and plurals become **den + noun ending in -n** (mit den Freunden, unter den Bäumen).',
      'Also watch dative-only verbs such as helfen (to help), danken (to thank), gehören (to belong to), and gefallen (to please / appeal to): "Die Aussicht gefällt mir" literally means "The view pleases me."',
    ],
    grammarExamples: [
      { form: 'mit dem Zug', explanation: 'Dative masculine: der Zug -> dem Zug' },
      { form: 'aus der Altstadt', explanation: 'Dative feminine: die Altstadt -> der Altstadt' },
      { form: 'unter goldenen Blättern', explanation: 'Dative plural adds -n to Blätter -> Blättern' },
      { form: 'Der Weg gefällt mir', explanation: 'Dative verb gefallen takes dative pronoun mir' },
    ],
    sentences: [
      { target: 'Seit drei Jahrhunderten lockt der sonnige Philosophenweg Studierende und Dichter über den Neckar.', en: 'For three centuries, the sunny Philosopher’s Way has drawn students and poets across the Neckar.' },
      { target: 'Von der Alten Brücke aus steigt ein steiler, geschichtsträchtiger Pfad zwischen alten Steinmauern empor.', en: 'From the Old Bridge, a steep, historic path climbs upward between old stone walls.' },
      { target: 'Mit jedem Schritt öffnet sich dem Wanderer ein weiter Blick über die roten Dächer der Altstadt.', en: 'With every step, a wide view across the red rooftops of the Old Town opens to the hiker.' },
      { target: 'Aus den Kaminen der kleinen Häuser steigt im Oktober feiner Holzrauch in die kühle Luft.', en: 'In October, wisps of woodsmoke rise from the chimneys of the small houses into the cool air.' },
      { target: 'Auf einer Bank neben einem Gedenkstein unterhalten sich zwei Studentinnen über ihre Seminare.', en: 'On a bench beside a memorial stone, two female students converse about their seminars.' },
      { target: '«Dieser Ausblick auf das Schloss gefällt mir im Herbst am besten», sagt die eine lächelnd.', en: '"I like this view of the castle best in autumn," says one of them smiling.' },
      { target: 'Auf dem Rückweg gehen sie bei einer kleinen Konditorei vorbei und wärmen sich mit heißem Tee auf.', en: 'On the way back, they stop by a small pastry café and warm up with hot tea.' },
    ],
    vocabulary: [
      { term: 'geschichtsträchtig', pos: 'adjective', meaning: 'steeped in history', usageNote: 'Compound of Geschichte (history) + trächtig.' },
      { term: 'der Ausblick', pos: 'noun (m.)', meaning: 'scenic view, outlook', usageNote: 'Near-synonym: die Aussicht.' },
      { term: 'sich unterhalten', pos: 'reflexive verb', meaning: 'to chat, converse', usageNote: 'Takes preposition über + accusative ("über ein Buch").' },
      { term: 'sich aufwärmen', pos: 'separable reflexive', meaning: 'to warm oneself up', usageNote: 'Common after winter or autumn walks.' },
    ],
    comprehensionCheck: [
      {
        question: 'Why does "Mit jedem Schritt" end with -em on jedem?',
        answer: 'Mit always requires the dative case, and Schritt is masculine (der Schritt -> dem/jedem Schritt).',
      },
      {
        question: 'What does "Dieser Ausblick gefällt mir" mean grammatically?',
        answer: 'Literally "This view is pleasing to me," using the dative pronoun mir with gefallen.',
      },
      {
        question: 'Which dative preposition means "for / since" (with time continuing up to now)?',
        answer: 'Seit ("Seit drei Jahrhunderten..."), paired with the present tense in German!',
      },
    ],
  },

  // ================= NORWEGIAN & CZECH =================
  {
    slug: 'en_morgentur_i_oslo',
    hubSlug: 'nordic-slavic',
    language: 'Norwegian',
    level: 'Beginner (A2)',
    category: 'Story',
    tenseFocus: 'Present Tense & Definite Endings',
    titleTarget: 'En morgentur i Oslo',
    titleEn: 'A Morning Walk in Oslo',
    summary:
      'Stroll past Oslo’s marble Opera House and harbor promenade while learning Norwegian V2 sentence flow and suffixed definite articles.',
    publishedDate: '2026-09-22',
    updatedDate: '2026-11-03',
    readingMinutes: 5,
    culturalContext: [
      'Oslo blends urban architecture directly with fjord water and pine-covered hills. Its white marble Opera House (Operahuset) in Bjørvika slopes gently straight into the Oslofjord so anyone can walk up the roof for sunrise views across the harbor.',
      'Norwegians embrace outdoor movement in every season—whether grabbing a morning filter coffee along Aker Brygge or commuting past waterfront saunas on chilly days.',
    ],
    grammarSpotlightTitle: 'Why Norwegian Verbs Are Simple & Nouns Take Suffixes',
    grammarSpotlightParagraphs: [
      'Great news for learners: Norwegian verbs NEVER change by person! "Jeg spaserer", "du spaserer", and "vi spaserer" all share the exact same form (spaserer).',
      'Instead, watch the end of nouns: Norwegian marks "the" by attaching -en (common/masculine), -a (feminine), or -et (neuter) directly onto the noun—so en tur (a walk) becomes turen (the walk), and et hus becomes huset.',
    ],
    grammarExamples: [
      { form: 'operahuset', explanation: 'Neuter noun hus + definite suffix -et ("the opera house")' },
      { form: 'havnefronten', explanation: 'Common-gender noun + definite suffix -en ("the waterfront")' },
      { form: 'Solen står opp', explanation: 'Verbs stay identical across I/you/they; present ends in -r' },
      { form: 'en varm kopp kaffe', explanation: 'Indefinite article en precedes adjective + noun' },
    ],
    vocabulary: [
      { term: 'morgentur', pos: 'noun (m.)', meaning: 'morning walk', usageNote: 'Compound of morgen (morning) + tur (trip/walk).' },
      { term: 'å spasere', pos: 'verb', meaning: 'to stroll', usageNote: 'Slightly more leisurely than å gå (to walk/go).' },
      { term: 'et gyllent lys', pos: 'noun phrase', meaning: 'a golden light', usageNote: 'Neuter adjective adds -t (gyllen -> gyllent) before neuter lys.' },
      { term: 'fjorden', pos: 'noun (m. def.)', meaning: 'the fjord', usageNote: 'Derived from en fjord.' },
    ],
    comprehensionCheck: [
      {
        question: 'How does Norwegian say "the house" vs. "a house"?',
        answer: '"Et hus" is a house; attaching -et gives "huset" (the house).',
      },
      {
        question: 'Do Norwegian verbs conjugate differently for "I", "you", and "they"?',
        answer: 'No! Present tense stays identical for all pronouns (for example, står, bader, spaserer).',
      },
      {
        question: 'Why does "gyllen" become "gyllent" in "et gyllent lys"?',
        answer: 'Because lys is a neuter noun (et lys), and Norwegian adjectives add -t to agree with singular neuter nouns.',
      },
    ],
  },
  {
    slug: 'kaffe_i_bergen_norsk',
    hubSlug: 'nordic-slavic',
    language: 'Norwegian',
    level: 'Intermediate (B1)',
    category: 'Dialogue',
    tenseFocus: 'Norwegian V2 Word Order & Everyday Politeness',
    titleTarget: 'Regnvær og kanelsnurrer i Bergen',
    titleEn: 'Rainy Weather and Cinnamon Buns in Bergen',
    summary:
      'Duck out of coastal rain into a wooden café in Bergen’s historic Bryggen quarter while practicing Norwegian V2 inversion and cozy cultural phrases.',
    publishedDate: '2026-10-21',
    updatedDate: '2026-11-03',
    readingMinutes: 6,
    culturalContext: [
      'Surrounded by seven steep mountains on Norway’s western coast, Bergen famously sees more rainy days than almost any other European city—prompting locals to joke that tourists pack umbrellas while Bergensers simply put on waterproof jackets and head into wooden cafés.',
      'Along the UNESCO-listed colorful wharves of Bryggen, bakeries serve freshly baked skillingsboller—Bergen’s giant, cardamom-scented cinnamon buns—alongside strong black coffee.',
    ],
    grammarSpotlightTitle: 'The V2 Rule Shared Across Scandinavian Languages',
    grammarSpotlightParagraphs: [
      'Just like German, Norwegian places the finite verb strictly in position #2 in main clauses. If a sentence begins with an adverb or time phrase like "I dag" (today) or "Heldigvis" (fortunately), the verb follows right away before the subject: "I dag regner det" (Today rains it).',
      'Also notice the polite "Takk for sist" (Thanks for last time)—a beloved Norwegian greeting used whenever you see someone again after spending time together.',
    ],
    grammarExamples: [
      { form: 'I dag regner det', explanation: 'Time phrase first -> V2 inversion puts regner before det' },
      { form: 'Kan jeg få en bolle?', explanation: 'Polite standard cafe request ("May I have a bun?")' },
      { form: 'Vær så god!', explanation: '"Here you go / You’re welcome"' },
      { form: 'Koselig', explanation: 'Iconic Norwegian word meaning cozy, warm, welcoming' },
    ],
    sentences: [
      { target: 'I dag regner det lett over de fargerike trehusene på Bryggen i Bergen.', en: 'Today it is raining lightly over the colorful wooden houses at Bryggen in Bergen.' },
      { target: 'Heldigvis ligger det et lite bakeri rett rundt hjørnet med varme lys i vinduene.', en: 'Fortunately, there is a small bakery right around the corner with warm lights in the windows.' },
      { target: 'Ingrid rister paraplyen sin utenfor døren før hun går inn til disken.', en: 'Ingrid shakes out her umbrella outside the door before walking up to the counter.' },
      { target: '«Hei! Kan jeg få en nybakt skillingsbolle og en kopp svart kaffe, takk?»', en: '"Hi! Could I get a freshly baked cinnamon bun and a cup of black coffee, please?"' },
      { target: '«Selvfølgelig! Vil du sitte her inne eller ta det med deg?»', en: '"Of course! Do you want to sit inside here or take it with you?"' },
      { target: '«Jeg sitter gjerne ved vinduet så jeg kan se ut på havnen.»', en: '"I’d gladly sit by the window so I can look out at the harbor."' },
      { target: 'Det smaker ekstra godt med varm bakst med kardemomme når skyene henger lavt over fjellene.', en: 'Warm pastries with cardamom taste extra good when the clouds hang low over the mountains.' },
    ],
    vocabulary: [
      { term: 'trehus', pos: 'noun (n.)', meaning: 'wooden house', usageNote: 'Compound of tre (wood) + hus (house).' },
      { term: 'heldigvis', pos: 'adverb', meaning: 'fortunately', usageNote: 'Triggers V2 inversion when placed at the start of a sentence.' },
      { term: 'nybakt', pos: 'adjective', meaning: 'freshly baked', usageNote: 'From ny (new) + bakt (baked).' },
      { term: 'bakst', pos: 'noun (m.)', meaning: 'baked goods / pastries', usageNote: 'General term for bread, buns, and cakes.' },
    ],
    comprehensionCheck: [
      {
        question: 'Why does Norwegian say "I dag regner det" instead of "I dag det regner"?',
        answer: 'Because Norwegian follows the V2 rule: the verb must remain in the second slot of any main statement.',
      },
      {
        question: 'How do you ask politely for something in a Norwegian café?',
        answer: '"Kan jeg få [item], takk?" (May I have..., please?).',
      },
    ],
  },
  {
    slug: 'prochazka_po_karlove_moste',
    hubSlug: 'nordic-slavic',
    language: 'Czech',
    level: 'Intermediate (B1)',
    category: 'Story',
    tenseFocus: 'Czech Locative & Genitive Cases',
    titleTarget: 'Ranní procházka po Karlově mostě v Praze',
    titleEn: 'A Morning Walk Across Charles Bridge in Prague',
    summary:
      'Cross Prague’s Gothic Charles Bridge at sunrise while learning how Czech prepositions change noun and adjective endings.',
    publishedDate: '2026-09-26',
    updatedDate: '2026-11-03',
    readingMinutes: 6,
    culturalContext: [
      'Commissioned by Emperor Charles IV in 1357 to replace an older flood-damaged bridge, Charles Bridge (Karlův most) links Prague’s Old Town with Malá Strana beneath Prague Castle. At dawn—before souvenir stalls and musicians arrive—morning mist drifts off the Vltava River around thirty Baroque sandstone statues.',
      'Even the title itself demonstrates Czech grammar in action: "Karlův most" changes to "po Karlově mostě" after the preposition po (along/across), illustrating Czech’s locative case.',
    ],
    grammarSpotlightTitle: 'Seeing Czech Cases Work Naturally After Prepositions',
    grammarSpotlightParagraphs: [
      'Czech uses seven grammatical cases, meaning nouns and adjectives shift endings depending on their role in the sentence. You never need to memorize all seven at once—focus first on prepositions you actually read.',
      'For example: "přes řeku" (across the river) triggers the accusative -u ending on řeka; "v srdci Prahy" (in the heart of Prague) pairs locative "v srdci" with genitive "Prahy" (of Prague).',
    ],
    grammarExamples: [
      { form: 'Karlův most -> po Karlově mostě', explanation: 'Preposition po (along) triggers the locative case' },
      { form: 'přes řeku Vltavu', explanation: 'Preposition přes (across) triggers accusative (-a -> -u)' },
      { form: 'v samém srdci Prahy', explanation: 'Locative v srdci + genitive Prahy ("of Prague")' },
      { form: 'je / jsou', explanation: '3rd person singular/plural present of být ("to be")' },
    ],
    vocabulary: [
      { term: 'kamenný', pos: 'adjective', meaning: 'made of stone', usageNote: 'Derived from kámen (stone).' },
      { term: 'řeka', pos: 'noun (f.)', meaning: 'river', usageNote: 'Accusative form: řeku.' },
      { term: 'socha', pos: 'noun (f.)', meaning: 'statue, sculpture', usageNote: 'Baroque statues line both sides of Charles Bridge.' },
      { term: 'ranní mlha', pos: 'noun phrase', meaning: 'morning mist / fog', usageNote: 'Ranní is a soft adjective whose ending stays -í across genders.' },
    ],
    comprehensionCheck: [
      {
        question: 'Why does "řeka" become "řeku" in "přes řeku Vltavu"?',
        answer: 'The preposition přes (across) requires the accusative case, changing feminine nouns ending in -a to -u.',
      },
      {
        question: 'What does "Prahy" express in "v srdci Prahy"?',
        answer: 'It is the genitive case meaning "of Prague" (in the heart of Prague).',
      },
    ],
  },
  {
    slug: 'kavarna_praha_dative',
    hubSlug: 'nordic-slavic',
    language: 'Czech',
    level: 'Beginner to Intermediate (A2-B1)',
    category: 'Dialogue',
    tenseFocus: 'Czech Cafe Requests & Accusative',
    titleTarget: 'Odpoledne v pražské kavárně',
    titleEn: 'An Afternoon in a Prague Café',
    summary:
      'Practice ordering Czech coffee, pastries (trdelník / koláč), and polite phrases like "Prosím" and "Děkuji" in a historic Prague café.',
    publishedDate: '2026-10-30',
    updatedDate: '2026-11-03',
    readingMinutes: 5,
    culturalContext: [
      'Prague’s grand cafés—from Art Nouveau halls near Náměstí Republiky to quiet neighborhood rooms in Vinohrady—have nurtured Czech writers, musicians, and students for over a century. Ordering a coffee comes effortlessly once you know a handful of polite formulas centered around "Dám si..." (I’ll have...).',
    ],
    grammarSpotlightTitle: 'How "Dám si" Simplifies Czech Ordering',
    grammarSpotlightParagraphs: [
      'Instead of wrestling with complicated polite conditionals at the start, Czech speakers naturally say "Dám si jednu kávu a jablečný závin, prosím" (I’ll have one coffee and an apple strudel, please). Remember that feminine food nouns ending in -a (káva, voda, polévka) shift to -u after "Dám si."',
      'Meanwhile, masculine inanimate items like čaj (tea) or dort (cake) and neuter items like pivo (beer) keep their exact dictionary form!',
    ],
    grammarExamples: [
      { form: 'Dám si jednu kávu', explanation: 'Feminine káva -> kávu in accusative direct object' },
      { form: 'Dám si černý čaj', explanation: 'Inanimate masculine čaj stays unchanged in accusative' },
      { form: 'Účet, prosím', explanation: '"The check, please" — simple and completely polite' },
    ],
    sentences: [
      { target: 'Odpoledne na Vinohradech začíná drobně pršet, a tak vcházíme do tiché rohově kavárny.', en: 'In the afternoon in Vinohrady it begins to drizzle lightly, so we step into a quiet corner café.' },
      { target: '«Dobrý den, máte volný stůl u okna?» ptáme se číšníka.', en: '"Good afternoon, do you have a free table by the window?" we ask the waiter.' },
      { target: '«Ano, samozřejmě, posaďte se, prosím. Co si dáte?»', en: '"Yes, of course, please have a seat. What will you have?"' },
      { target: '«Dám si jednu kávu s mlékem a tvarohový koláč, prosím.»', en: '"I’ll have a coffee with milk and a sweet curd pastry, please."' },
      { target: '«A pro mě jeden zelený čaj a sklenici vody bez bublinek.»', en: '"And for me a green tea and a glass of still water."' },
      { target: 'Za chvíli leží na dřevěném stole teplé hrnky a čerstvé pečivo.', en: 'In a moment, warm mugs and fresh pastries are resting on the wooden table.' },
      { target: 'Když dopijeme, poprosíme o účet: «Zaplatíme kartou, děkujeme moc!»', en: 'When we finish drinking, we ask for the check: "We’ll pay by card, thank you very much!"' },
    ],
    vocabulary: [
      { term: 'Dobrý den', pos: 'greeting', meaning: 'Good day / Hello', usageNote: 'Standard polite greeting throughout daytime.' },
      { term: 'bez bublinek', pos: 'prep. phrase', meaning: 'still / non-sparkling (water)', usageNote: 'Literally "without little bubbles" (perlívá = sparkling).' },
      { term: 'koláč', pos: 'noun (m.)', meaning: 'traditional Czech sweet pastry', usageNote: 'Often topped with plum jam, poppy seeds, or sweet curd.' },
      { term: 'účet', pos: 'noun (m.)', meaning: 'the bill / check', usageNote: 'Pair with prosím when ready to pay.' },
    ],
    comprehensionCheck: [
      {
        question: 'Why did "káva" change to "kávu" while "čaj" stayed "čaj"?',
        answer: 'Feminine nouns ending in -a change to -u in the accusative direct object; inanimate masculine nouns like čaj do not change.',
      },
      {
        question: 'How do you ask for still (non-carbonated) water in Prague?',
        answer: 'Ask for "neperlivou vodu" or playfully "bez bublinek" (without bubbles).',
      },
    ],
  },
];

export function getArticleBySlug(slug: string): EditorialArticle | undefined {
  return EDITORIAL_ARTICLES.find((a) => a.slug === slug);
}

export function getArticlesByHub(hubSlug: string): EditorialArticle[] {
  return EDITORIAL_ARTICLES.filter((a) => a.hubSlug === hubSlug);
}

export function getHubBySlug(slug: string): LanguageHub | undefined {
  return LANGUAGE_HUBS.find((h) => h.slug === slug);
}
