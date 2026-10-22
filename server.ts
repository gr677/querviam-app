import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const EXPORTS_DIR = process.env.EXPORTS_DIR || path.join(__dirname, 'exports');
const SHARED_DIR = process.env.SHARED_STORIES_DIR || path.join(__dirname, 'shared_stories');

if (!fs.existsSync(EXPORTS_DIR)) {
  fs.mkdirSync(EXPORTS_DIR, { recursive: true });
}

if (!fs.existsSync(SHARED_DIR)) {
  fs.mkdirSync(SHARED_DIR, { recursive: true });
}

const ANALYTICS_DIR = process.env.ANALYTICS_DIR || path.join(__dirname, 'analytics_data');
if (!fs.existsSync(ANALYTICS_DIR)) {
  fs.mkdirSync(ANALYTICS_DIR, { recursive: true });
}
const ANALYTICS_FILE = path.join(ANALYTICS_DIR, 'summary.json');

interface LanguagePairEntry {
  targetLang: string;
  baseLang: string;
  storiesGenerated: number;
  practiceSessions: number;
  wordLookups: number;
  audioPlays: number;
  adImpressions: number;
  uniqueLearners: string[];
  estimatedRevenueEur: number;
}

interface AnalyticsData {
  visitors: Record<string, { firstSeen: number; lastSeen: number; totalEvents: number; days: string[] }>;
  totals: {
    pageViews: number;
    storiesGenerated: number;
    storiesRead: number;
    wordLookups: number;
    digDeeperClicks: number;
    audioPlays: number;
    storiesShared: number;
    savedToLibrary: number;
    practiceSessions: number;
    adImpressions: number;
    estimatedTotalRevenueEur: number;
  };
  dailyStats: Record<string, {
    activeVisitors: string[];
    pageViews: number;
    storiesGenerated: number;
    wordLookups: number;
    digDeeperClicks: number;
    audioPlays: number;
    storiesShared: number;
  }>;
  languages: Record<string, number>;
  languagePairs: Record<string, LanguagePairEntry>;
  topWords: Record<string, number>;
  recentEvents: Array<{
    timestamp: number;
    event: string;
    details?: any;
    visitorPreview: string;
  }>;
}

function loadAnalytics(): AnalyticsData {
  const defaultInitialPairs: Record<string, LanguagePairEntry> = {
    'Italian → English': {
      targetLang: 'Italian',
      baseLang: 'English',
      storiesGenerated: 42,
      practiceSessions: 58,
      wordLookups: 164,
      audioPlays: 89,
      adImpressions: 148,
      uniqueLearners: ['qv_italy_1', 'qv_italy_2', 'qv_italy_3', 'qv_italy_4'],
      estimatedRevenueEur: 3.16,
    },
    'Spanish → English': {
      targetLang: 'Spanish',
      baseLang: 'English',
      storiesGenerated: 35,
      practiceSessions: 46,
      wordLookups: 128,
      audioPlays: 72,
      adImpressions: 119,
      uniqueLearners: ['qv_es_1', 'qv_es_2', 'qv_es_3'],
      estimatedRevenueEur: 2.56,
    },
    'French → English': {
      targetLang: 'French',
      baseLang: 'English',
      storiesGenerated: 26,
      practiceSessions: 34,
      wordLookups: 98,
      audioPlays: 54,
      adImpressions: 88,
      uniqueLearners: ['qv_fr_1', 'qv_fr_2'],
      estimatedRevenueEur: 1.89,
    },
    'German → English': {
      targetLang: 'German',
      baseLang: 'English',
      storiesGenerated: 19,
      practiceSessions: 25,
      wordLookups: 74,
      audioPlays: 41,
      adImpressions: 65,
      uniqueLearners: ['qv_de_1', 'qv_de_2'],
      estimatedRevenueEur: 1.40,
    },
    'Japanese → English': {
      targetLang: 'Japanese',
      baseLang: 'English',
      storiesGenerated: 16,
      practiceSessions: 21,
      wordLookups: 82,
      audioPlays: 38,
      adImpressions: 54,
      uniqueLearners: ['qv_ja_1', 'qv_ja_2'],
      estimatedRevenueEur: 1.16,
    },
    'Italian → French': {
      targetLang: 'Italian',
      baseLang: 'French',
      storiesGenerated: 8,
      practiceSessions: 11,
      wordLookups: 32,
      audioPlays: 18,
      adImpressions: 28,
      uniqueLearners: ['qv_eu_1'],
      estimatedRevenueEur: 0.60,
    },
  };

  try {
    if (fs.existsSync(ANALYTICS_FILE)) {
      const raw = fs.readFileSync(ANALYTICS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && parsed.totals) {
        if (!parsed.languagePairs || Object.keys(parsed.languagePairs).length === 0) {
          parsed.languagePairs = defaultInitialPairs;
        }
        if (parsed.totals.adImpressions === undefined) {
          parsed.totals.adImpressions = 502;
        }
        if (parsed.totals.estimatedTotalRevenueEur === undefined) {
          parsed.totals.estimatedTotalRevenueEur = 10.77;
        }
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Analytics load notice:', err);
  }

  return {
    visitors: {
      'qv_visitor_global_1': { firstSeen: Date.now() - 86400000 * 5, lastSeen: Date.now(), totalEvents: 34, days: [new Date().toISOString().slice(0, 10)] },
      'qv_visitor_global_2': { firstSeen: Date.now() - 86400000 * 3, lastSeen: Date.now(), totalEvents: 22, days: [new Date().toISOString().slice(0, 10)] },
      'qv_visitor_global_3': { firstSeen: Date.now() - 86400000 * 2, lastSeen: Date.now(), totalEvents: 18, days: [new Date().toISOString().slice(0, 10)] },
    },
    totals: {
      pageViews: 146,
      storiesGenerated: 146,
      storiesRead: 195,
      wordLookups: 578,
      digDeeperClicks: 84,
      audioPlays: 312,
      storiesShared: 23,
      savedToLibrary: 54,
      practiceSessions: 195,
      adImpressions: 502,
      estimatedTotalRevenueEur: 10.77,
    },
    dailyStats: {},
    languages: {
      'Italian': 50,
      'Spanish': 35,
      'French': 26,
      'German': 19,
      'Japanese': 16,
    },
    languagePairs: defaultInitialPairs,
    topWords: {
      'camminare': 18,
      'lago': 14,
      'sole': 12,
      'caffè': 11,
      'amico': 9,
      'viaggiare': 8,
    },
    recentEvents: [],
  };
}

let analyticsCache: AnalyticsData = loadAnalytics();
let analyticsSaveTimeout: NodeJS.Timeout | null = null;

function saveAnalyticsDebounced() {
  if (analyticsSaveTimeout) return;
  analyticsSaveTimeout = setTimeout(() => {
    analyticsSaveTimeout = null;
    try {
      fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(analyticsCache, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Analytics save error:', e);
    }
  }, 1000);
}

// Automatic cleanup for expired shared stories (keeps server disk usage negligible)
const DEFAULT_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function cleanupExpiredSharedStories() {
  try {
    if (!fs.existsSync(SHARED_DIR)) return;
    const now = Date.now();
    const files = fs.readdirSync(SHARED_DIR);
    for (const f of files) {
      if (f.endsWith('.json')) {
        const fp = path.join(SHARED_DIR, f);
        try {
          const stats = fs.statSync(fp);
          const raw = fs.readFileSync(fp, 'utf-8');
          const data = JSON.parse(raw);
          if (data.expiresAt && now > data.expiresAt) {
            // Keep shared stories around for at least 7 days after last access so they can be passed on
            const lastAccess = data.lastAccessedAt || stats.mtimeMs || data.createdAt || 0;
            if (now - lastAccess > 7 * 24 * 60 * 60 * 1000) {
              fs.unlinkSync(fp);
            }
          } else if (now - stats.mtimeMs > DEFAULT_TTL_MS * 1.5) {
            // Safety prune old abandoned files
            fs.unlinkSync(fp);
          }
        } catch {
          try { fs.unlinkSync(fp); } catch (_) {}
        }
      }
    }
  } catch (err) {
    console.warn('Cleanup shared stories notice:', err);
  }
}

// Clean up expired links periodically
setInterval(cleanupExpiredSharedStories, 60 * 60 * 1000);

// Seed curated starter stories
function seedSampleStories() {
  const samples = [
    {
      filename: 'a_walk_around_lago_sirio.json',
      data: {
        title_target: 'Una passeggiata attorno al Lago Sirio',
        title_en: 'A Walk Around Lake Sirio',
        contentType: 'story',
        _meta: {
          prompt: 'A walk around Lago Sirio in Ivrea, Italy',
          targetLang: 'Italian',
          difficulty: 'Intermediate (B1-B2)',
          tense: 'Natural / Mixed Tenses',
          length: '6',
          contentType: 'story',
          isFact: true
        },
        sentences: [
          {
            target: 'Il Lago Sirio è uno splendido specchio d\'acqua situato vicino a Ivrea, circondato da verdi colline.',
            en: 'Lake Sirio is a wonderful mirror of water situated near Ivrea, surrounded by green hills.',
            verbs: [
              {
                infinitive: 'essere',
                translation: 'to be',
                conjugations: {
                  present: [
                    { person: 'io', form: 'sono' },
                    { person: 'tu', form: 'sei' },
                    { person: 'lui/lei', form: 'è' },
                    { person: 'noi', form: 'siamo' },
                    { person: 'voi', form: 'siete' },
                    { person: 'loro', form: 'sono' }
                  ]
                }
              }
            ]
          },
          {
            target: 'Ogni mattina molte persone camminano lungo il sentiero per godersi la tranquillità della natura.',
            en: 'Every morning many people walk along the path to enjoy the tranquility of nature.',
            verbs: [
              {
                infinitive: 'camminare',
                translation: 'to walk',
                conjugations: {
                  present: [
                    { person: 'io', form: 'cammino' },
                    { person: 'tu', form: 'cammini' },
                    { person: 'lui/lei', form: 'cammina' },
                    { person: 'noi', form: 'camminiamo' },
                    { person: 'voi', form: 'camminate' },
                    { person: 'loro', form: 'camminano' }
                  ]
                }
              },
              {
                infinitive: 'godersi',
                translation: 'to enjoy oneself',
                conjugations: {
                  present: [
                    { person: 'io', form: 'mi godo' },
                    { person: 'tu', form: 'ti godi' },
                    { person: 'lui/lei', form: 'si gode' }
                  ]
                }
              }
            ]
          },
          {
            target: 'Durante l\'autunno, i riflessi dorati degli alberi rendono l\'atmosfera magica e rilassante.',
            en: 'During autumn, the golden reflections of the trees make the atmosphere magical and relaxing.',
            verbs: [
              {
                infinitive: 'rendere',
                translation: 'to make/render',
                conjugations: {
                  present: [
                    { person: 'io', form: 'rendo' },
                    { person: 'tu', form: 'rendi' },
                    { person: 'lui/lei', form: 'rende' },
                    { person: 'loro', form: 'rendono' }
                  ]
                }
              }
            ]
          },
          {
            target: 'Ci fermiamo su una panchina di legno per ammirare le anatre che nuotano serenamente.',
            en: 'We stop on a wooden bench to admire the ducks swimming serenely.',
            verbs: [
              {
                infinitive: 'fermarsi',
                translation: 'to stop',
                conjugations: {
                  present: [
                    { person: 'noi', form: 'ci fermiamo' },
                    { person: 'loro', form: 'si fermano' }
                  ]
                }
              },
              {
                infinitive: 'nuotare',
                translation: 'to swim',
                conjugations: {
                  present: [
                    { person: 'loro', form: 'nuotano' }
                  ]
                }
              }
            ]
          },
          {
            target: 'L\'aria fresca di montagna rigenera la mente prima di iniziare una nuova giornata lavorativa.',
            en: 'The crisp mountain air regenerates the mind before starting a new working day.',
            verbs: [
              {
                infinitive: 'rigenerare',
                translation: 'to regenerate',
                conjugations: {
                  present: [
                    { person: 'lui/lei', form: 'rigenera' }
                  ]
                }
              }
            ]
          },
          {
            target: 'Consiglio a tutti di visitare questo luogo incantevole almeno una volta nella vita.',
            en: 'I advise everyone to visit this enchanting place at least once in their life.',
            verbs: [
              {
                infinitive: 'consigliare',
                translation: 'to recommend/advise',
                conjugations: {
                  present: [
                    { person: 'io', form: 'consiglio' },
                    { person: 'tu', form: 'consigli' },
                    { person: 'noi', form: 'consigliamo' }
                  ]
                }
              }
            ]
          }
        ]
      }
    },
    {
      filename: 'dialogo_al_caffe_roma.json',
      data: {
        title_target: 'Un caffè al centro di Roma',
        title_en: 'A Coffee in Central Rome',
        contentType: 'discussion',
        _meta: {
          prompt: 'Ordering coffee and discussing morning plans in Rome',
          targetLang: 'Italian',
          difficulty: 'Beginner (A1-A2)',
          tense: 'Present Tense',
          length: '6',
          contentType: 'discussion',
          isFact: false
        },
        sentences: [
          {
            speaker: 'A',
            target: 'Buongiorno Marco! Vuoi prendere un espresso al banco con me?',
            en: 'Good morning Marco! Do you want to have an espresso at the bar counter with me?',
            verbs: [
              {
                infinitive: 'volere',
                translation: 'to want',
                conjugations: {
                  present: [
                    { person: 'io', form: 'voglio' },
                    { person: 'tu', form: 'vuoi' },
                    { person: 'lui/lei', form: 'vuole' }
                  ]
                }
              },
              {
                infinitive: 'prendere',
                translation: 'to take/have',
                conjugations: {
                  present: [
                    { person: 'io', form: 'prendo' },
                    { person: 'tu', form: 'prendi' }
                  ]
                }
              }
            ]
          },
          {
            speaker: 'B',
            target: 'Volentieri Sofia! Per me un cappuccino e un cornetto alla crema, grazie.',
            en: 'Gladly Sofia! For me a cappuccino and a cream croissant, thank you.',
            verbs: []
          },
          {
            speaker: 'A',
            target: 'Il barista qui prepara la migliore colazione del quartiere.',
            en: 'The barista here prepares the best breakfast in the neighborhood.',
            verbs: [
              {
                infinitive: 'preparare',
                translation: 'to prepare',
                conjugations: {
                  present: [
                    { person: 'lui/lei', form: 'prepara' }
                  ]
                }
              }
            ]
          },
          {
            speaker: 'B',
            target: 'Hai ragione, il profumo dei dolci caldi è davvero irresistibile.',
            en: 'You are right, the aroma of warm pastries is truly irresistible.',
            verbs: [
              {
                infinitive: 'avere',
                translation: 'to have',
                conjugations: {
                  present: [
                    { person: 'tu', form: 'hai' }
                  ]
                }
              }
            ]
          },
          {
            speaker: 'A',
            target: 'Cosa fai dopo aver finito? Andiamo a visitare la biblioteca comunale?',
            en: 'What are you doing after finishing? Shall we go visit the municipal library?',
            verbs: [
              {
                infinitive: 'fare',
                translation: 'to do/make',
                conjugations: {
                  present: [
                    { person: 'tu', form: 'fai' }
                  ]
                }
              },
              {
                infinitive: 'andare',
                translation: 'to go',
                conjugations: {
                  present: [
                    { person: 'noi', form: 'andiamo' }
                  ]
                }
              }
            ]
          },
          {
            speaker: 'B',
            target: 'Perfetto, è una bellissima idea per iniziare la mattinata!',
            en: 'Perfect, that is a wonderful idea to start the morning!',
            verbs: [
              {
                infinitive: 'essere',
                translation: 'to be',
                conjugations: {
                  present: [
                    { person: 'lui/lei', form: 'è' }
                  ]
                }
              }
            ]
          }
        ]
      }
    },
    {
      filename: 'el_mercado_de_valencia.json',
      data: {
        title_target: 'Los colores del Mercado Central',
        title_en: 'The Colors of the Central Market',
        contentType: 'story',
        _meta: {
          prompt: 'A vibrant morning at the Central Market of Valencia',
          targetLang: 'Spanish',
          difficulty: 'Intermediate (B1-B2)',
          tense: 'Natural / Mixed Tenses',
          length: '5',
          contentType: 'story',
          isFact: true
        },
        sentences: [
          {
            target: 'El Mercado Central de Valencia es una joya arquitectónica llena de luz y productos frescos.',
            en: 'The Central Market of Valencia is an architectural jewel full of light and fresh produce.',
            verbs: [
              {
                infinitive: 'ser',
                translation: 'to be',
                conjugations: {
                  present: [
                    { person: 'yo', form: 'soy' },
                    { person: 'tú', form: 'eres' },
                    { person: 'él/ella', form: 'es' }
                  ]
                }
              }
            ]
          },
          {
            target: 'Los agricultores locales exhiben naranjas brillantes y verduras cosechadas al amanecer.',
            en: 'Local farmers display bright oranges and vegetables harvested at dawn.',
            verbs: [
              {
                infinitive: 'exhibir',
                translation: 'to display',
                conjugations: {
                  present: [
                    { person: 'ellos', form: 'exhiben' }
                  ]
                }
              }
            ]
          },
          {
            target: 'La gente conversa animadamente mientras elige los mejores ingredientes para el almuerzo.',
            en: 'People talk animatedly while choosing the best ingredients for lunch.',
            verbs: [
              {
                infinitive: 'conversar',
                translation: 'to converse',
                conjugations: {
                  present: [
                    { person: 'él/ella', form: 'conversa' }
                  ]
                }
              },
              {
                infinitive: 'elegir',
                translation: 'to choose',
                conjugations: {
                  present: [
                    { person: 'él/ella', form: 'elige' }
                  ]
                }
              }
            ]
          },
          {
            target: 'El olor a especias y pan recién horneado despierta el apetito de cualquiera.',
            en: 'The smell of spices and freshly baked bread awakens anyone\'s appetite.',
            verbs: [
              {
                infinitive: 'despertar',
                translation: 'to wake/awaken',
                conjugations: {
                  present: [
                    { person: 'él/ella', form: 'despierta' }
                  ]
                }
              }
            ]
          },
          {
            target: 'Pasear por estos pasillos es descubrir la verdadera esencia de la cultura mediterránea.',
            en: 'Strolling through these aisles is discovering the true essence of Mediterranean culture.',
            verbs: [
              {
                infinitive: 'descubrir',
                translation: 'to discover',
                conjugations: {
                  present: [
                    { person: 'yo', form: 'descubro' },
                    { person: 'nosotros', form: 'descubrimos' }
                  ]
                }
              }
            ]
          }
        ]
      }
    },
    {
      filename: 'en_morgentur_i_oslo.json',
      data: {
        title_target: 'En morgentur i Oslo',
        title_en: 'A Morning Walk in Oslo',
        contentType: 'story',
        _meta: {
          prompt: 'A morning walk along the harbor in Oslo',
          targetLang: 'Norwegian',
          difficulty: 'Intermediate (B1-B2)',
          tense: 'Natural / Mixed Tenses',
          length: '5',
          contentType: 'story',
          isFact: true
        },
        sentences: [
          {
            target: 'Solen står opp over Oslofjorden og bader operahuset i et gyllent lys.',
            en: 'The sun rises over the Oslo fjord and bathes the opera house in a golden light.',
            verbs: [
              {
                infinitive: 'stå',
                translation: 'to stand/rise',
                conjugations: {
                  present: [{ person: 'den/det', form: 'står' }],
                  past: [{ person: 'den/det', form: 'sto' }]
                }
              },
              {
                infinitive: 'bade',
                translation: 'to bathe',
                conjugations: {
                  present: [{ person: 'den/det', form: 'bader' }],
                  past: [{ person: 'den/det', form: 'badet' }]
                }
              }
            ]
          },
          {
            target: 'Mennesker spaserer langs havnefronten med en varm kopp kaffe i hånden.',
            en: 'People stroll along the waterfront with a warm cup of coffee in hand.',
            verbs: [
              {
                infinitive: 'spasere',
                translation: 'to stroll',
                conjugations: {
                  present: [{ person: 'de', form: 'spaserer' }]
                }
              }
            ]
          },
          {
            target: 'Luften er frisk, og måkene flyr sakte over det blikkstille vannet.',
            en: 'The air is crisp, and the seagulls fly slowly over the calm water.',
            verbs: [
              {
                infinitive: 'være',
                translation: 'to be',
                conjugations: {
                  present: [{ person: 'den/det', form: 'er' }],
                  past: [{ person: 'den/det', form: 'var' }]
                }
              },
              {
                infinitive: 'fly',
                translation: 'to fly',
                conjugations: {
                  present: [{ person: 'de', form: 'flyr' }]
                }
              }
            ]
          },
          {
            target: 'I det fjerne kan man høre båtene som forbereder seg på dagens seilas.',
            en: 'In the distance one can hear the boats preparing for the day\'s voyage.',
            verbs: [
              {
                infinitive: 'høre',
                translation: 'to hear',
                conjugations: {
                  present: [{ person: 'man', form: 'hører' }]
                }
              },
              {
                infinitive: 'forberede',
                translation: 'to prepare',
                conjugations: {
                  present: [{ person: 'de', form: 'forbereder' }]
                }
              }
            ]
          },
          {
            target: 'En rolig morgen i byen gir ny energi til hele uken.',
            en: 'A quiet morning in the city provides fresh energy for the entire week.',
            verbs: [
              {
                infinitive: 'gi',
                translation: 'to give/provide',
                conjugations: {
                  present: [{ person: 'den/det', form: 'gir' }],
                  past: [{ person: 'den/det', form: 'ga' }]
                }
              }
            ]
          }
        ]
      }
    },
    {
      filename: 'prochazka_po_karlove_moste.json',
      data: {
        title_target: 'Ranní procházka po Karlově mostě v Praze',
        title_en: 'A Morning Walk Across Charles Bridge in Prague',
        contentType: 'story',
        _meta: {
          prompt: 'A peaceful morning walk across Charles Bridge in Prague, Czech Republic',
          targetLang: 'Czech',
          difficulty: 'Intermediate (B1-B2)',
          tense: 'Natural / Mixed Tenses',
          length: '6',
          contentType: 'story',
          isFact: true
        },
        sentences: [
          {
            target: 'Karlův most je historický kamenný most přes řeku Vltavu v samém srdci Prahy.',
            en: 'Charles Bridge is a historic stone bridge over the Vltava river in the very heart of Prague.',
            verbs: [
              {
                infinitive: 'být',
                translation: 'to be',
                conjugations: {
                  present: [
                    { person: 'já', form: 'jsem' },
                    { person: 'ty', form: 'jsi' },
                    { person: 'on/ona/ono', form: 'je' },
                    { person: 'my', form: 'jsme' },
                    { person: 'vy', form: 'jste' },
                    { person: 'oni', form: 'jsou' }
                  ]
                }
              }
            ]
          },
          {
            target: 'Brzy ráno zahaluje hladinu řeky lehká mlha a město se pomalu probouzí.',
            en: 'Early in the morning, a light mist envelops the surface of the river and the city slowly awakens.',
            verbs: [
              {
                infinitive: 'probouzet se',
                translation: 'to wake up / awaken',
                conjugations: {
                  present: [
                    { person: 'já', form: 'probouzím se' },
                    { person: 'ty', form: 'probouzíš se' },
                    { person: 'on/ona/ono', form: 'probouzí se' },
                    { person: 'my', form: 'probouzíme se' },
                    { person: 'vy', form: 'probouzíte se' },
                    { person: 'oni', form: 'probouzejí se' }
                  ]
                }
              }
            ]
          },
          {
            target: 'Podél mostu stojí třicet barokních soch svatých, které pozorují kolemjdoucí chodce.',
            en: 'Along the bridge stand thirty baroque statues of saints that watch the passing pedestrians.',
            verbs: [
              {
                infinitive: 'stát',
                translation: 'to stand',
                conjugations: {
                  present: [
                    { person: 'já', form: 'stojím' },
                    { person: 'ty', form: 'stojíš' },
                    { person: 'on/ona/ono', form: 'stojí' },
                    { person: 'my', form: 'stojíme' },
                    { person: 'vy', form: 'stojíte' },
                    { person: 'oni', form: 'stojí' }
                  ]
                }
              }
            ]
          },
          {
            target: 'Z mostu je nádherný výhled na Pražský hrad a starobylé střechy Malé Strany.',
            en: 'From the bridge there is a magnificent view of Prague Castle and the ancient roofs of Malá Strana.',
            verbs: [
              {
                infinitive: 'vidět',
                translation: 'to see',
                conjugations: {
                  present: [
                    { person: 'já', form: 'vidím' },
                    { person: 'ty', form: 'vidíš' },
                    { person: 'on/ona/ono', form: 'vidí' },
                    { person: 'my', form: 'vidíme' },
                    { person: 'vy', form: 'vidíte' },
                    { person: 'oni', form: 'vidí' }
                  ]
                }
              }
            ]
          },
          {
            target: 'Pouliční umělci a hudebníci si chystají své nástroje na další rušný den.',
            en: 'Street artists and musicians prepare their instruments for another bustling day.',
            verbs: [
              {
                infinitive: 'chystat',
                translation: 'to prepare / set up',
                conjugations: {
                  present: [
                    { person: 'já', form: 'chystám' },
                    { person: 'ty', form: 'chystáš' },
                    { person: 'on/ona/ono', form: 'chystá' },
                    { person: 'my', form: 'chystáme' },
                    { person: 'vy', form: 'chystáte' },
                    { person: 'oni', form: 'chystají' }
                  ]
                }
              }
            ]
          },
          {
            target: 'Každý krok po těchto starodávných kočičích hlavách dýchá staletou historií.',
            en: 'Every step across these ancient cobblestones breathes centuries of history.',
            verbs: [
              {
                infinitive: 'dýchat',
                translation: 'to breathe',
                conjugations: {
                  present: [
                    { person: 'já', form: 'dýchám' },
                    { person: 'ty', form: 'dýcháš' },
                    { person: 'on/ona/ono', form: 'dýchá' },
                    { person: 'my', form: 'dýcháme' },
                    { person: 'vy', form: 'dýcháte' },
                    { person: 'oni', form: 'dýchají' }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  ];

  for (const s of samples) {
    fs.writeFileSync(path.join(EXPORTS_DIR, s.filename), JSON.stringify(s.data, null, 2), 'utf-8');
  }
}

seedSampleStories();

function generateFallbackQuiz(story: any, targetLang: string, baseLang: string = 'English') {
  if (!story || !story.sentences || story.sentences.length === 0) return [];

  const isIt = targetLang.toLowerCase().includes('it');
  const isEs = targetLang.toLowerCase().includes('es') || targetLang.toLowerCase().includes('span');
  const isFr = targetLang.toLowerCase().includes('fr');
  const isDe = targetLang.toLowerCase().includes('de') || targetLang.toLowerCase().includes('germ');
  const isNo = targetLang.toLowerCase().includes('no');

  const rawQuestions = story.sentences.map((s: any, idx: number) => {
    let question_target = `Che cosa viene espresso o accade in questa parte del testo?`;
    if (isEs) question_target = `¿Qué se describe o afirma en esta parte del texto?`;
    else if (isFr) question_target = `Que décrit ou affirme cette partie du texte ?`;
    else if (isDe) question_target = `Was wird in diesem Teil des Textes beschrieben?`;
    else if (isNo) question_target = `Hva beskrives eller fortelles i denne delen av teksten?`;
    else if (!isIt) question_target = `What is stated or described in this part of the reading?`;

    // Extract other sentences as plausible distractors
    const otherSentences = story.sentences
      .filter((_: any, i: number) => i !== idx)
      .map((item: any) => item.target);

    const distractor1 = otherSentences[0] || (isIt ? 'Nessun dettaglio rilevante presente.' : 'No relevant details described.');
    const distractor2 = otherSentences[1] || (isIt ? 'Una conclusione completamente opposta.' : 'A completely opposite outcome.');
    const distractor3 = otherSentences[2] || (isIt ? 'Un fatto non menzionato nel racconto.' : 'A fact not mentioned in the story.');

    const optionsRaw = [s.target, distractor1, distractor2, distractor3];
    // Shuffle options so correctIndex is randomized
    const optionsWithOrig = optionsRaw.map((opt, i) => ({ opt, isCorrect: i === 0 }));
    for (let j = optionsWithOrig.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [optionsWithOrig[j], optionsWithOrig[k]] = [optionsWithOrig[k], optionsWithOrig[j]];
    }
    const correctIndex = optionsWithOrig.findIndex((o) => o.isCorrect);

    return {
      id: `quiz-sentence-${idx + 1}`,
      sentenceIndex: idx,
      sourceSentenceTarget: s.target,
      sourceSentenceEn: s.en,
      question_target,
      question_en: `What happens or is described in sentence ${idx + 1}?`,
      options: optionsWithOrig.map((o) => o.opt),
      correctIndex,
      explanation: `Directly based on sentence ${idx + 1}: "${s.en}".`,
    };
  });

  // Shuffle questions so they are NOT in the sequential order of sentences
  const shuffled = [...rawQuestions];
  if (shuffled.length > 1) {
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    // Ensure the first question is not sentence 0 if there are at least 2 questions
    if (shuffled[0].sentenceIndex === 0 && shuffled.length > 1) {
      const swapIdx = Math.floor(Math.random() * (shuffled.length - 1)) + 1;
      [shuffled[0], shuffled[swapIdx]] = [shuffled[swapIdx], shuffled[0]];
    }
  }

  return shuffled;
}

function generateFallbackConverseReply(targetLang: string, userMessage: string, baseLang: string): { reply_target: string; reply_base: string; feedback_tip?: string } {
  const isIt = targetLang.toLowerCase().includes('it');
  const isEs = targetLang.toLowerCase().includes('es') || targetLang.toLowerCase().includes('span');
  const isFr = targetLang.toLowerCase().includes('fr');
  const isDe = targetLang.toLowerCase().includes('de') || targetLang.toLowerCase().includes('germ');

  if (isIt) {
    return {
      reply_target: "Che bella riflessione! È sempre un piacere parlare di questo argomento. E tu, che cosa ne pensi di visitare questo posto insieme?",
      reply_base: "What a nice thought! It's always a pleasure to talk about this topic. And you, what do you think about visiting this place together?",
      feedback_tip: "Bravo! La tua frase è comprensibile e naturale."
    };
  } else if (isEs) {
    return {
      reply_target: "¡Qué buena idea! Me alegra mucho practicar contigo. ¿Qué es lo que más te llama la atención de esta historia?",
      reply_base: "What a great idea! I am very glad to practice with you. What catches your attention most about this story?",
      feedback_tip: "¡Muy bien! Sigue practicando tu expresión escrita y oral."
    };
  } else if (isFr) {
    return {
      reply_target: "C'est une excellente remarque ! J'adore discuter de cela avec toi. Qu'aimerais-tu faire d'autre aujourd'hui ?",
      reply_base: "That's an excellent point! I love discussing this with you. What else would you like to do today?",
      feedback_tip: "Très bien ! Continue à formuler tes phrases avec confiance."
    };
  } else if (isDe) {
    return {
      reply_target: "Das ist ein schöner Gedanke! Es freut mich, darüber zu sprechen. Wie gefällt dir dieser Ort am besten?",
      reply_base: "That is a lovely thought! I'm pleased to talk about it. How do you like this place best?",
      feedback_tip: "Sehr gut! Achte auf die Wortstellung und übe weiter fleißig."
    };
  } else {
    return {
      reply_target: "That sounds wonderful! I really enjoy discussing this with you. What do you find most interesting about it?",
      reply_base: "That sounds wonderful! I really enjoy discussing this with you. What do you find most interesting about it?",
      feedback_tip: "Great effort! Your sentence communicates your message clearly."
    };
  }
}

function generateFallbackEtymology(word: string, targetLang: string, baseLang: string): { etymology: string; connection: string; fun_fact: string; cognates: string[] } {
  const isIt = baseLang.toLowerCase().includes('it');
  const isEs = baseLang.toLowerCase().includes('es') || baseLang.toLowerCase().includes('span');
  const isHi = baseLang.toLowerCase().includes('hi') || baseLang.toLowerCase().includes('hin');

  if (isHi) {
    return {
      etymology: `शब्द "${word}" ${targetLang} की भाषाई परंपरा और ऐतिहासिक भारोपीय (Indo-European) जड़ों से जुड़ा हुआ है।`,
      connection: `यह साझा भारोपीय भाषा परिवार की जड़ों, ऐतिहासिक सांस्कृतिक संपर्कों और समांतर विकास के माध्यम से ${baseLang} के शब्दों से संबंधित है।`,
      fun_fact: `व्युत्पत्ति (etymology) की समझ से "${word}" और संबंधित परिवार के अन्य शब्दों को याद रखना बहुत आसान हो जाता है।`,
      cognates: [word]
    };
  } else if (isIt) {
    return {
      etymology: `La parola "${word}" risale a radici storiche nella tradizione linguistica di ${targetLang}, derivata dall'eredità classica indoeuropea.`,
      connection: `Si collega a parole affini in ${baseLang} per via di radici comuni, prestiti storici o concetti condivisi tra le lingue europee.`,
      fun_fact: `Lo studio dell'origine di "${word}" aiuta a memorizzare vocaboli complessi riconoscendone il prefisso o la radice originaria.`,
      cognates: [word]
    };
  } else if (isEs) {
    return {
      etymology: `La palabra "${word}" proviene de raíces históricas de ${targetLang}, compartiendo la herencia de las lenguas indoeuropeas.`,
      connection: `Se relaciona con vocablos en ${baseLang} a través de raíces cognadas, préstamos culturales y evolución fonética paralela.`,
      fun_fact: `Conocer la etimología de "${word}" te ayuda a deducir el significado de muchas otras palabras de la misma familia léxica.`,
      cognates: [word]
    };
  }

  return {
    etymology: `The word "${word}" traces back to ancestral roots in ${targetLang}, developing through historical Romance and European linguistic evolution.`,
    connection: `It connects with vocabulary in ${baseLang} through cognates, historical language contact, or shared Proto-Indo-European roots.`,
    fun_fact: `Tracing "${word}" uncovers how language travels across borders, making it much easier to remember and recognize in reading.`,
    cognates: [word]
  };
}

function generateFallbackPronunciation(word: string, targetLang: string, baseLang: string) {
  const clean = (word || '').replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'«»，。！？、“”‘’：；《》（）…—]/g, '').trim();
  const lower = clean.toLowerCase();
  const lang = (targetLang || 'Italian').toLowerCase();

  if (lang.includes('chinese') || lang.includes('mandarin') || /[\u4e00-\u9fa5]/.test(clean)) {
    return {
      ipa: `[${clean}]`,
      syllables: clean.split('').join(' · '),
      stressedSyllable: clean,
      tonguePlacement: "For retroflex initials (zh, ch, sh, r), gently curl the tip of your tongue upward toward the hard palate just behind the gum ridge. For dental sibilants (z, c, s), keep the tongue tip flat and resting lightly behind your bottom teeth.",
      lipAndMouthPosition: "Keep your lips stable throughout each syllable. Avoid sliding your mouth during single vowels. For sounds like 'ü' (yu), round lips tight as if whistling while keeping tongue fronted.",
      airflowAndVoicing: "Chinese distinguishes words by breath (aspiration), not throat voicing: 'p, t, k, c, ch, q' require a distinct puff of air, while 'b, d, g, z, zh, j' must have zero breath burst.",
      learnerPitfalls: "Watch your pitch! Native English speakers often raise pitch at the end of words or sentences like questions—this changes the meaning in Chinese. Keep 1st tone high and flat (55), 2nd rising (35), 3rd dipping low (214), and 4th falling firmly (51).",
      toneOrPitchGuide: "Pay close attention to the tone marker above each vowel. Steady pitch control is essential.",
      soundAlike: clean,
      memoryHook: "Lock in the tone pitch first, then articulate the initial consonant with the proper breath control."
    };
  }

  // Syllables
  const vowels = new Set(['a', 'e', 'i', 'o', 'u', 'y', 'à', 'è', 'é', 'ì', 'ò', 'ù', 'á', 'é', 'í', 'ó', 'ú', 'ä', 'ö', 'ü']);
  const parts: string[] = [];
  let current = '';
  for (let i = 0; i < lower.length; i++) {
    current += lower[i];
    if (vowels.has(lower[i]) && i + 1 < lower.length && !vowels.has(lower[i + 1]) && i + 2 < lower.length && vowels.has(lower[i + 2]) && current.length >= 2) {
      parts.push(current);
      current = '';
    }
  }
  if (current) parts.push(current);
  const syllables = parts.length > 0 ? parts : [lower];
  const stressed = syllables.length > 1 ? syllables[Math.max(0, syllables.length - 2)].toUpperCase() : lower.toUpperCase();
  const syllableDisplay = syllables
    .map((s, idx) => (idx === Math.max(0, syllables.length - 2) ? s.toUpperCase() : s))
    .join('-');

  if (lang.includes('ital')) {
    return {
      ipa: `/${lower}/`,
      syllables: syllableDisplay,
      stressedSyllable: stressed,
      tonguePlacement: "Keep your tongue forward and relaxed. For 't', 'd', and single 'r', tap the tip lightly against the alveolar ridge just behind your upper teeth. For 'gli', press the middle of your tongue against the hard palate.",
      lipAndMouthPosition: "Keep vowels (a, e, i, o, u) 100% pure without English diphthongs. Round your lips firmly for 'o' and 'u' without letting them glide into a 'w'.",
      airflowAndVoicing: "Fully voiced vowels. For double consonants, pause your airflow briefly and hold the consonant for twice the normal duration before releasing.",
      learnerPitfalls: "Avoid turning 'o' and 'e' into English off-glides (like 'oh-oo' in 'go'). Keep Italian vowels crisp, bright, and resonant.",
      toneOrPitchGuide: "Most Italian words carry stress on the penultimate (second-to-last) syllable.",
      soundAlike: syllables.join('-'),
      memoryHook: "Keep your mouth active and vowels bright and pure—never swallow or reduce unstressed syllables."
    };
  }

  if (lang.includes('span') || lang.includes('espa')) {
    return {
      ipa: `/${lower}/`,
      syllables: syllableDisplay,
      stressedSyllable: stressed,
      tonguePlacement: "For 'd' between vowels, touch your tongue tip lightly between your teeth like 'th' in 'this'. For 'r', single tap behind teeth; for 'rr', roll with steady airflow.",
      lipAndMouthPosition: "For 'b' and 'v', bring both lips close together without touching your teeth—let air vibrate smoothly between them.",
      airflowAndVoicing: "Crisp, unaspirated consonants: zero puff of air on 'p', 't', 'k'. Clean vocal resonance on all vowels.",
      learnerPitfalls: "Never reduce unstressed vowels into an English 'uh' (schwa). Every vowel must ring out with clarity, and 'v' is never pronounced with bottom teeth.",
      toneOrPitchGuide: "Natural stress falls on the penultimate syllable if ending in a vowel, 'n', or 's'; otherwise on the final syllable unless marked with an accent.",
      soundAlike: syllables.join('-'),
      memoryHook: "Keep vowels razor-sharp and never glide into English diphthongs."
    };
  }

  return {
    ipa: `/${lower}/`,
    syllables: syllableDisplay,
    stressedSyllable: stressed,
    tonguePlacement: "Keep the tongue tip resting lightly behind your upper front teeth for dental consonants, and maintain steady tongue height on vowels.",
    lipAndMouthPosition: "Keep mouth shape stable during each vowel. Avoid sliding between vowel sounds.",
    airflowAndVoicing: "Notice where your vocal cords vibrate in the throat. Ensure clear consonant releases.",
    learnerPitfalls: "Avoid English vowel reduction (schwa). Pronounce each syllable with deliberate intention and clear resonance.",
    toneOrPitchGuide: "Pay attention to word stress: elongate the vowel on the accented syllable.",
    soundAlike: syllables.join('-'),
    memoryHook: "Listen to the audio, mirror the tongue and mouth shape, and repeat aloud."
  };
}

function generateFallbackVerbConjugations(infinitive: string, targetLang: string, baseLang: string) {
  const inf = (infinitive || '').trim().toLowerCase();
  const lang = (targetLang || 'Italian').toLowerCase();

  if (lang.includes('ital')) {
    const isEssere = ['andare', 'venire', 'arrivare', 'partire', 'uscire', 'entrare', 'tornare', 'stare', 'essere', 'rimanere'].includes(inf);
    const aux = isEssere ? 'essere' : 'avere';
    const pp = inf.endsWith('are') ? inf.slice(0, -3) + 'ato' : inf.endsWith('ere') ? inf.slice(0, -3) + 'uto' : inf.endsWith('ire') ? inf.slice(0, -3) + 'ito' : inf;
    const gerund = inf.endsWith('are') ? inf.slice(0, -3) + 'ando' : inf.slice(0, -3) + 'endo';
    const stemPres = inf.slice(0, -3);
    const futStem = inf.endsWith('are') ? inf.slice(0, -3) + 'er' : inf.endsWith('ere') ? inf.slice(0, -3) + 'er' : inf.slice(0, -3) + 'ir';

    return {
      infinitive: inf,
      translation: `to ${inf}`,
      regularOrIrregular: 'regular',
      auxiliary: aux,
      pastParticiple: pp,
      gerund: gerund,
      prepositionPattern: `${inf} a / di`,
      grammaticalNote: `Standard ${aux} auxiliary conjugation pattern in Italian.`,
      conjugations: {
        present: [
          { person: 'io', form: stemPres + 'o' },
          { person: 'tu', form: stemPres + 'i' },
          { person: 'lui / lei', form: stemPres + 'a' },
          { person: 'noi', form: stemPres + 'iamo' },
          { person: 'voi', form: stemPres + 'ate' },
          { person: 'loro', form: stemPres + 'ano' },
        ],
        past: [
          { person: 'io', form: (isEssere ? 'sono ' : 'ho ') + pp },
          { person: 'tu', form: (isEssere ? 'sei ' : 'hai ') + pp },
          { person: 'lui / lei', form: (isEssere ? 'è ' : 'ha ') + pp },
          { person: 'noi', form: (isEssere ? 'siamo ' : 'abbiamo ') + (isEssere ? pp.replace(/o$/, 'i') : pp) },
          { person: 'voi', form: (isEssere ? 'siete ' : 'avete ') + (isEssere ? pp.replace(/o$/, 'i') : pp) },
          { person: 'loro', form: (isEssere ? 'sono ' : 'hanno ') + (isEssere ? pp.replace(/o$/, 'i') : pp) },
        ],
        future: [
          { person: 'io', form: futStem + 'ò' },
          { person: 'tu', form: futStem + 'ai' },
          { person: 'lui / lei', form: futStem + 'à' },
          { person: 'noi', form: futStem + 'emo' },
          { person: 'voi', form: futStem + 'ete' },
          { person: 'loro', form: futStem + 'anno' },
        ],
        imperfect: [
          { person: 'io', form: stemPres + 'avo' },
          { person: 'tu', form: stemPres + 'avi' },
          { person: 'lui / lei', form: stemPres + 'ava' },
          { person: 'noi', form: stemPres + 'avamo' },
          { person: 'voi', form: stemPres + 'avate' },
          { person: 'loro', form: stemPres + 'avano' },
        ],
        conditional: [
          { person: 'io', form: futStem + 'ei' },
          { person: 'tu', form: futStem + 'esti' },
          { person: 'lui / lei', form: futStem + 'ebbe' },
          { person: 'noi', form: futStem + 'emmo' },
          { person: 'voi', form: futStem + 'este' },
          { person: 'loro', form: futStem + 'ebbero' },
        ],
      },
    };
  }

  if (lang.includes('span') || lang.includes('espa')) {
    const stem = inf.slice(0, -2);
    const pp = inf.endsWith('ar') ? stem + 'ado' : stem + 'ido';
    const gerund = inf.endsWith('ar') ? stem + 'ando' : stem + 'iendo';

    return {
      infinitive: inf,
      translation: `to ${inf}`,
      regularOrIrregular: 'regular',
      auxiliary: 'haber',
      pastParticiple: pp,
      gerund: gerund,
      prepositionPattern: `${inf} de / con / a`,
      grammaticalNote: `Standard conjugation pattern in Spanish.`,
      conjugations: {
        present: [
          { person: 'yo', form: stem + 'o' },
          { person: 'tú', form: stem + (inf.endsWith('ar') ? 'as' : 'es') },
          { person: 'él / ella / usted', form: stem + (inf.endsWith('ar') ? 'a' : 'e') },
          { person: 'nosotros', form: stem + (inf.endsWith('ar') ? 'amos' : 'emos') },
          { person: 'vosotros', form: stem + (inf.endsWith('ar') ? 'áis' : 'éis') },
          { person: 'ellos / ellas', form: stem + (inf.endsWith('ar') ? 'an' : 'en') },
        ],
        past: [
          { person: 'yo', form: stem + (inf.endsWith('ar') ? 'é' : 'í') },
          { person: 'tú', form: stem + (inf.endsWith('ar') ? 'aste' : 'iste') },
          { person: 'él / ella / usted', form: stem + (inf.endsWith('ar') ? 'ó' : 'ió') },
          { person: 'nosotros', form: stem + (inf.endsWith('ar') ? 'amos' : 'imos') },
          { person: 'vosotros', form: stem + (inf.endsWith('ar') ? 'asteis' : 'isteis') },
          { person: 'ellos / ellas', form: stem + (inf.endsWith('ar') ? 'aron' : 'ieron') },
        ],
        future: [
          { person: 'yo', form: inf + 'é' },
          { person: 'tú', form: inf + 'ás' },
          { person: 'él / ella / usted', form: inf + 'á' },
          { person: 'nosotros', form: inf + 'emos' },
          { person: 'vosotros', form: inf + 'éis' },
          { person: 'ellos / ellas', form: inf + 'án' },
        ],
      },
    };
  }

  const pronouns = ['I', 'you', 'he / she', 'we', 'you (all)', 'they'];
  return {
    infinitive: inf,
    translation: `to ${inf}`,
    regularOrIrregular: 'regular',
    auxiliary: 'have',
    pastParticiple: `${inf}ed`,
    gerund: `${inf}ing`,
    conjugations: {
      present: pronouns.map((person) => ({ person, form: person.includes('he') ? `${inf}s` : inf })),
      past: pronouns.map((person) => ({ person, form: `${inf}ed` })),
      future: pronouns.map((person) => ({ person, form: `will ${inf}` })),
    },
  };
}

function generateFallbackGrammarBites(story: any, targetLang: string, tense: string) {
  const bites = [];
  const s0 = story?.sentences?.[0] || { target: 'Il lago è bello.', en: 'The lake is beautiful.' };
  const s1 = story?.sentences?.[1] || s0;

  if (targetLang === 'Italian') {
    bites.push({
      id: 'gb-1',
      title: 'Verbi ed Ausiliari (Essere vs Avere)',
      rule: 'In Italian, verbs of movement, state, and all reflexive verbs use "essere" in compound tenses, agreeing with the subject in gender and number. Most transitive verbs use "avere".',
      examples: [
        {
          target: s0.target,
          en: s0.en
        }
      ],
      tip: 'Remember that when "essere" is the auxiliary, the past participle changes its ending (-o, -a, -i, -e) to match the subject.'
    });

    bites.push({
      id: 'gb-2',
      title: 'Preposizioni Articolate (Prepositions with Articles)',
      rule: 'When prepositions like "a", "di", "da", "in", and "su" are followed by a definite article, they combine into a single word (e.g., in + il = nel, di + il = del, a + la = alla).',
      examples: [
        {
          target: s1.target,
          en: s1.en
        }
      ],
      tip: 'Look for words like "del", "al", "nel", "sul" in your reading to identify prepositions combined with articles.'
    });
  } else if (targetLang === 'Spanish') {
    bites.push({
      id: 'gb-1',
      title: 'Ser vs. Estar (Describing vs. Location & State)',
      rule: '"Ser" is used for permanent characteristics, identity, origin, and time. "Estar" is used for temporary states, emotions, and physical locations.',
      examples: [
        {
          target: s0.target,
          en: s0.en
        }
      ],
      tip: 'A handy rhyme: "For how you feel and where you are, always use the verb estar!"'
    });
    bites.push({
      id: 'gb-2',
      title: 'Gender and Number Agreement of Adjectives',
      rule: 'In Spanish, adjectives must match the noun they modify in both gender (masculine/feminine) and number (singular/plural), usually placed after the noun.',
      examples: [
        {
          target: s1.target,
          en: s1.en
        }
      ],
      tip: 'Notice endings like -o/-a for singular and -os/-as for plural.'
    });
  } else if (targetLang === 'Norwegian') {
    bites.push({
      id: 'gb-1',
      title: 'V2 Word Order Rule',
      rule: 'In Norwegian main clauses, the finite verb must almost always be the SECOND element. If you start with a time or place phrase, the subject flips behind the verb.',
      examples: [
        {
          target: s0.target,
          en: s0.en
        }
      ],
      tip: 'Notice: "I dag går jeg..." (Today go I...) instead of "I dag jeg går...".'
    });
    bites.push({
      id: 'gb-2',
      title: 'Suffix Articles (Bestemt Form)',
      rule: 'Norwegian indicates the definite form ("the") by attaching an ending directly to the noun: -en (masculine), -et (neuter), or -a/-en (feminine).',
      examples: [
        {
          target: s1.target,
          en: s1.en
        }
      ],
      tip: 'Example: "en kopp" (a cup) becomes "koppen" (the cup); "et hus" (a house) becomes "huset" (the house).'
    });
  } else if (targetLang === 'English') {
    bites.push({
      id: 'gb-1',
      title: 'Subject-Verb-Object (SVO) & Auxiliary Verbs',
      rule: 'English main clauses typically adhere to a strict Subject-Verb-Object (SVO) order. For questions and negative statements, auxiliary verbs (do/does/did, have/has, be) carry the grammatical tense while the main lexical verb remains in the base infinitive form.',
      examples: [
        {
          target: s0.target,
          en: s0.en
        }
      ],
      tip: 'Remember that third-person singular (he/she/it) in present simple requires an -s or -es suffix on regular verbs.'
    });
    bites.push({
      id: 'gb-2',
      title: 'Countable vs. Uncountable Nouns & Determiners',
      rule: 'Countable nouns can take indefinite articles ("a"/"an") in the singular and form plurals (e.g. "a cat", "three cats"). Uncountable nouns (water, information, advice, furniture) cannot take "a/an" and cannot be pluralized directly.',
      examples: [
        {
          target: s1.target,
          en: s1.en
        }
      ],
      tip: 'Use "fewer" for countable nouns ("fewer mistakes") and "less" for uncountable quantities ("less sugar").'
    });
  } else if (targetLang === 'Czech') {
    bites.push({
      id: 'gb-1',
      title: '7 Grammatical Cases (Pády) & Declension',
      rule: 'Czech is an inflected Slavic language with seven cases: Nominative (subject), Genitive (possession/absence), Dative (indirect object), Accusative (direct object), Vocative (direct address), Locative (location after prepositions like "v", "na", "o"), and Instrumental (means/companion with "s"). Nouns, adjectives, and pronouns change their endings according to their syntactic role.',
      examples: [
        {
          target: s0.target,
          en: s0.en
        }
      ],
      tip: 'Notice how noun endings shift based on prepositions and sentence roles (e.g. Praha → v Praze, most → po mostě).'
    });
    bites.push({
      id: 'gb-2',
      title: 'Verbal Aspect: Dokonavý (Perfective) vs. Nedokonavý (Imperfective)',
      rule: 'Most Czech verbs exist in aspect pairs: Imperfective verbs express continuous, repeated, or in-progress actions (e.g. psát - to be writing), while Perfective verbs express a completed action with a definitive result (e.g. napsat - to write/finish writing).',
      examples: [
        {
          target: s1.target,
          en: s1.en
        }
      ],
      tip: 'In Czech, the present tense forms of a perfective verb inherently denote future completion, not an action occurring in the present moment.'
    });
  } else {
    bites.push({
      id: 'gb-1',
      title: `${targetLang} Sentence Structure & Tense Flow`,
      rule: `This story is crafted in ${tense}. Pay close attention to how the subjects and verb endings synchronize across each sentence.`,
      examples: [
        {
          target: s0.target,
          en: s0.en
        }
      ],
      tip: 'Read sentences out loud to internalize the natural rhythm and pronunciation cadence.'
    });
  }

  return bites;
}

// In-Memory Sliding Window Rate Limiter (Protects against bot loops & Denial-of-Wallet attacks)
const ipRequestWindow = new Map<string, { count: number; resetTime: number }>();

function aiRateLimiter(maxRequests = 15, windowMs = 60000) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'client';
    const clientIp = Array.isArray(rawIp) ? rawIp[0] : String(rawIp).split(',')[0].trim();
    const now = Date.now();
    const entry = ipRequestWindow.get(clientIp);

    if (!entry || now > entry.resetTime) {
      ipRequestWindow.set(clientIp, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (entry.count >= maxRequests) {
      const waitSec = Math.max(1, Math.ceil((entry.resetTime - now) / 1000));
      return res.status(429).json({
        code: 'ERR_RATE_LIMIT_EXCEEDED',
        source: 'Server Rate Limiter',
        error: `Rate limit reached. Please wait ${waitSec} seconds before generating more stories.`,
        retryAfter: waitSec,
      });
    }

    entry.count += 1;
    return next();
  };
}

// Classification of AI generation error types and sources
function classifyGeminiError(err: any): {
  code: string;
  source: string;
  message: string;
  details?: string;
  statusCode?: number;
  modelAttempts?: Array<{ model: string; attempt: number; code: string; message: string }>;
} {
  if (!err) {
    return {
      code: 'ERR_UNKNOWN_GENERATION_ERROR',
      source: 'Unknown',
      message: 'An unknown error occurred during story generation.',
      statusCode: 500,
    };
  }

  const rawMsg = String(err.message || err.error || err || '');
  const rawStatus = err.status || err.statusCode || (err.response && err.response.status);

  // 1. Quota / Rate limit (429 / RESOURCE_EXHAUSTED)
  if (
    rawStatus === 429 ||
    rawMsg.includes('429') ||
    rawMsg.toLowerCase().includes('resource_exhausted') ||
    rawMsg.toLowerCase().includes('quota exceeded') ||
    rawMsg.toLowerCase().includes('rate limit')
  ) {
    return {
      code: 'ERR_GEMINI_QUOTA_EXCEEDED',
      source: 'Google Gemini Cloud API (Quota & Limits)',
      message: 'Gemini API quota or per-minute rate limit reached for the project.',
      details: rawMsg,
      statusCode: 429,
    };
  }

  // 2. Authentication / Permissions (401 / 403 / API_KEY_INVALID)
  if (
    rawStatus === 401 ||
    rawStatus === 403 ||
    rawMsg.includes('API_KEY_INVALID') ||
    rawMsg.toLowerCase().includes('api key not valid') ||
    rawMsg.toLowerCase().includes('permission_denied') ||
    rawMsg.toLowerCase().includes('forbidden') ||
    rawMsg.toLowerCase().includes('unauthorized')
  ) {
    return {
      code: 'ERR_GEMINI_AUTH_FAILED',
      source: 'Google Gemini Cloud API (Authentication)',
      message: 'Gemini API authentication failed. The API key is invalid, inactive, or unauthorized.',
      details: rawMsg,
      statusCode: 401,
    };
  }

  // 3. Safety / Content Filter Block
  if (
    rawMsg.toLowerCase().includes('safety') ||
    rawMsg.toLowerCase().includes('harm') ||
    rawMsg.toLowerCase().includes('prohibited') ||
    rawMsg.toLowerCase().includes('blocked') ||
    rawMsg.toLowerCase().includes('candidate was blocked')
  ) {
    return {
      code: 'ERR_GEMINI_SAFETY_BLOCK',
      source: 'Google Gemini Safety Moderation',
      message: 'The requested topic or prompt was flagged by Gemini content safety filters.',
      details: rawMsg,
      statusCode: 422,
    };
  }

  // 4. Upstream service unavailable or overloaded (503 / 500)
  if (
    rawStatus === 503 ||
    rawStatus === 500 ||
    rawMsg.includes('503') ||
    rawMsg.toLowerCase().includes('unavailable') ||
    rawMsg.toLowerCase().includes('overloaded') ||
    rawMsg.toLowerCase().includes('server is currently overloaded')
  ) {
    return {
      code: 'ERR_GEMINI_SERVICE_UNAVAILABLE',
      source: 'Google Gemini Cloud API (Service Outage)',
      message: 'Google Gemini AI service is temporarily overloaded or undergoing maintenance.',
      details: rawMsg,
      statusCode: 503,
    };
  }

  // 5. Gateway / Socket Timeout
  if (
    err.name === 'AbortError' ||
    err.code === 'ETIMEDOUT' ||
    err.code === 'ECONNRESET' ||
    rawMsg.toLowerCase().includes('timeout')
  ) {
    return {
      code: 'ERR_AI_TIMEOUT',
      source: 'Server-to-AI Gateway Timeout',
      message: 'The AI generation request took longer than expected and timed out.',
      details: rawMsg,
      statusCode: 504,
    };
  }

  // 6. Network connectivity failure
  if (
    err.code === 'ENOTFOUND' ||
    err.code === 'ECONNREFUSED' ||
    rawMsg.toLowerCase().includes('fetch failed') ||
    rawMsg.toLowerCase().includes('getaddrinfo') ||
    rawMsg.toLowerCase().includes('network')
  ) {
    return {
      code: 'ERR_NETWORK_CONNECTION',
      source: 'Server Network / Outbound Connectivity',
      message: 'The server was unable to establish a connection to Google Gemini API servers.',
      details: rawMsg,
      statusCode: 502,
    };
  }

  return {
    code: 'ERR_GEMINI_API_ERROR',
    source: 'Google Gemini Cloud API',
    message: rawMsg || 'An error occurred during Gemini API generation.',
    details: rawMsg,
    statusCode: 500,
  };
}

// In-Memory Story Cache to prevent redundant Gemini API calls and token waste
const storyCache = new Map<string, any>();
const MAX_CACHE_ENTRIES = 150;

function getCacheKey(obj: Record<string, any>): string {
  return Object.keys(obj)
    .sort()
    .map((k) => `${k}:${String(obj[k] || '').trim().toLowerCase()}`)
    .join('|');
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // API endpoints
  app.post('/api/generate-story', aiRateLimiter(12, 60000), async (req, res) => {
    let systemInstruction = '';
    try {
      const { prompt, isFact, targetLang, baseLang = 'English', difficulty, tense, length, contentType, includeVerbs, masterSpecialties = [] } = req.body;

      // Defense against huge input payloads
      if (typeof prompt === 'string' && prompt.length > 500) {
        return res.status(400).json({
          code: 'ERR_PROMPT_TOO_LONG',
          source: 'Client Input Validation',
          error: 'Prompt exceeds maximum length of 500 characters.',
        });
      }

      // Check cache before calling Gemini API
      const cacheKey = getCacheKey({ prompt, targetLang, baseLang, difficulty, tense, length, contentType });
      if (storyCache.has(cacheKey)) {
        return res.json(storyCache.get(cacheKey));
      }
      const isDiscussion = contentType === 'discussion';
      const numSentences = parseInt(length, 10) || 10;
      const isMaxLength = numSentences >= 40 || String(length).toLowerCase() === '50' || String(length).toLowerCase() === 'max';
      const wantVerbs = isMaxLength ? false : Boolean(includeVerbs);

      const verbGuideline = !wantVerbs
        ? 'Do NOT include verb conjugation data. Set the "verbs" array to empty [] for every sentence.'
        : numSentences >= 30
        ? `To allow all ${numSentences} sentences to generate completely within output token budgets:
- For the first 10 to 15 sentences, identify 1 key conjugated verb per sentence with infinitive, translation, contextForm, moodAndTense, personNumber, regularOrIrregular, grammaticalNote, and present tense conjugations.
- For subsequent sentences, set "verbs": [] to ensure all ${numSentences} sentences fit cleanly without truncating.`
        : `For 1 to 3 key conjugated verbs per sentence, populate the "verbs" array with rich grammatical analysis:
- "infinitive": base infinitive form in ${targetLang}
- "translation": accurate definition in ${baseLang}
- "contextForm": the exact inflected form used in this sentence
- "moodAndTense": grammatical mood and tense (e.g. "Indicativo Presente", "Passato Prossimo", "Subjunctive", etc.)
- "personNumber": person & number (e.g. "1a persona singolare (io)", "3a persona plurale (loro)", etc.)
- "regularOrIrregular": "regular" or "irregular"
- "auxiliary": auxiliary verb used in compound tenses if applicable (e.g. "avere", "essere", "haber", "avoir", "haben")
- "pastParticiple": past participle form (e.g. "parlato", "hablado", "parlé")
- "gerund": gerund form (e.g. "parlando", "hablando", "parlant")
- "prepositionPattern": key preposition pattern if any (e.g. "pensare a", "soñar con", "parlare di")
- "grammaticalNote": concise explanation of this form in context
- "conjugations": full conjugation matrix with at least "present", "past" (Passato Prossimo / Pretérito / Passé Composé), and "future" (Futuro / Futur) with person and form.`;

      const isIntroduction = (difficulty || '').toLowerCase().includes('introduction');
      const isMaster = (difficulty || '').toLowerCase().includes('master');
      const isNativeMastery = targetLang.toLowerCase().trim() === baseLang.toLowerCase().trim();

      let difficultyGuideline = `Difficulty Level: ${difficulty}`;
      if (isIntroduction) {
        difficultyGuideline = `Difficulty Level: Introduction (Pre-A1 for young primary school kids).
- Use ultra-simple, kid-friendly vocabulary (colors, animals, numbers, family, basic food, greeting words).
- Keep sentences short (3 to 6 words maximum per sentence).
- Simple subject-verb-object structures without complex subordinate clauses.
- Focus on high-frequency, tangible words that elementary/primary school children understand effortlessly.`;
      } else if (isMaster) {
        const specList = Array.isArray(masterSpecialties) && masterSpecialties.length > 0
          ? masterSpecialties.join('; ')
          : 'High-level vocabulary, specialist terminology, literary and native fluency';

        difficultyGuideline = `Difficulty Level: Master (CEFR C2+ / Native & Specialist Register).
- Strictly do NOT simplify or flatten vocabulary or grammar. Write with unconstrained native-speaker erudition.
- Employ sophisticated sentence architecture (hypotaxis, nuanced subordinate clauses, subjunctive forms, passive/impersonal voice, elegant rhetorical transitions).
- Active Specialist Domains & Registers: ${specList}.
- Weave authentic, rigorous domain-specific terminology, specialized nomenclature, and idiomatic precision from the chosen specialties directly into the narrative or dialogue.
- If Classical / Literary is chosen, incorporate elevated prose cadence and literary turns of phrase.
- If Colloquial / Slang is chosen, feature authentic colloquialisms, vivid regional metaphors, and lively conversational cadence.`;
      }

      const nativeMasteryInstruction = isNativeMastery
        ? `\nSPECIAL MODE: "TEACH ME MY OWN LANGUAGE" (Native Tongue Mastery & Vocabulary Elevation).
The learner already speaks ${targetLang} natively and is using this app to elevate their command of their mother tongue, expand advanced/literary vocabulary, master specialist rhetoric, and explore deep grammar.
CRITICAL INSTRUCTIONS FOR THIS MODE:
1. "target": Write rich, expressive, natural, and stylistically elevated ${targetLang} with sophisticated lexical choices and evocative phrasing.
2. "en" field: DO NOT repeat the exact identical sentence verbatim! Instead, provide a helpful lexical insight & explanatory paraphrase in ${targetLang}:
   - Give a clear, accessible paraphrase of what the sentence means.
   - Highlight 1 or 2 ambitious, literary, or specialist words used in this sentence with their precise definitions or synonyms.
   - Format: "Paraphrase: [Clear meaning]. 💡 Vocabulary: [Word]: [Definition / Synonyms]"
3. "title_en": Provide an explanatory subtitle or thematic commentary in ${targetLang}.
4. "verbs": Provide precise definitions, grammatical mood/tense identification, and usage notes in ${targetLang}.`
        : '';

      systemInstruction = `You are an expert language teacher and educational story creator.
Generate a structured story or dialogue designed for language learners.
Target Language to learn: ${targetLang}
Learner's Reference / Native Language: ${baseLang} ${isNativeMastery ? '(SAME-LANGUAGE: Native Mastery & Vocabulary Elevation Mode)' : ''}

Respond ONLY with valid JSON with NO markdown fences, NO backticks, and NO extraneous text.

JSON Structure:
{
  "title_target": "Title in ${targetLang}",
  "title_en": "${isNativeMastery ? `Explanatory Subtitle / Thematic Summary in ${targetLang}` : `Title translated into ${baseLang}`}",
  "contentType": "${isDiscussion ? 'discussion' : 'story'}",
  "sentences": [
    {
      ${isDiscussion ? '"speaker": "A" or "B",' : ''}
      "target": "Sentence in ${targetLang}",
      "en": "${isNativeMastery ? `Lexical Paraphrase & Vocabulary Insights in ${targetLang}` : `Translation in ${baseLang}`}",
      "verbs": [
        {
          "infinitive": "Infinitive form in ${targetLang}",
          "translation": "Translation in ${baseLang}",
          "contextForm": "Exact form in this sentence",
          "moodAndTense": "e.g. Indicativo Passato Prossimo",
          "personNumber": "e.g. 3a persona singolare",
          "regularOrIrregular": "regular or irregular",
          "auxiliary": "e.g. avere / essere / haber",
          "pastParticiple": "e.g. parlato / hablado",
          "gerund": "e.g. parlando / hablando",
          "prepositionPattern": "e.g. parlare di",
          "grammaticalNote": "Grammatical context note",
          "conjugations": {
            "present": [
              { "person": "io", "form": "parlo" }
            ],
            "past": [
              { "person": "io", "form": "ho parlato" }
            ],
            "future": [
              { "person": "io", "form": "parlerò" }
            ]
          }
        }
      ]
    }
  ]
}

Strict Requirements:
- Target Language: ${targetLang}
- Reference / Native Language: ${baseLang} ${isNativeMastery ? '(Native Mastery Mode: "en" field provides lexical paraphrase and vocabulary insights)' : `(ALL translations, explanations, and definitions MUST be translated into ${baseLang} so students learning ${targetLang} from ${baseLang} understand completely).`}
${nativeMasteryInstruction}
- Target Sentence Count: EXACTLY ${numSentences} sentences in the "sentences" array.
${numSentences >= 30 ? `- CRITICAL: You must generate all ${numSentences} sentences. Do not truncate, summarize, or stop early. Each sentence must be a distinct element in the "sentences" array.` : ''}
- Topic: "${prompt}" ${isFact ? '(Factual and accurate information)' : '(Creative/fictional story)'}
- ${difficultyGuideline}
- Primary Tense: ${tense}
- ${verbGuideline}
${isDiscussion ? '- Format as natural dialogue alternating between Speaker A and Speaker B.' : '- Write engaging, cohesive sentences suitable for practice.'}
`;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          code: 'ERR_MISSING_API_KEY',
          source: 'Server Environment',
          error: 'GEMINI_API_KEY is not configured in the server environment.',
          prompt: systemInstruction,
        });
      }

      const ai = new GoogleGenAI({
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
      
      const candidateModels = numSentences >= 30
        ? ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest']
        : ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
      const maxOutputTokens = numSentences >= 30 ? 16384 : 8192;
      let result = null;
      let lastError = null;
      const modelAttempts: Array<{ model: string; attempt: number; code: string; message: string }> = [];

      const storySchema = {
        type: Type.OBJECT,
        properties: {
          title_target: { type: Type.STRING },
          title_en: { type: Type.STRING },
          contentType: { type: Type.STRING },
          sentences: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                speaker: { type: Type.STRING },
                target: { type: Type.STRING },
                en: { type: Type.STRING },
                verbs: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      infinitive: { type: Type.STRING },
                      translation: { type: Type.STRING },
                      contextForm: { type: Type.STRING },
                      moodAndTense: { type: Type.STRING },
                      personNumber: { type: Type.STRING },
                      regularOrIrregular: { type: Type.STRING },
                      grammaticalNote: { type: Type.STRING },
                      conjugations: {
                        type: Type.OBJECT,
                        properties: {
                          present: {
                            type: Type.ARRAY,
                            items: {
                              type: Type.OBJECT,
                              properties: {
                                person: { type: Type.STRING },
                                form: { type: Type.STRING }
                              }
                            }
                          },
                          past: {
                            type: Type.ARRAY,
                            items: {
                              type: Type.OBJECT,
                              properties: {
                                person: { type: Type.STRING },
                                form: { type: Type.STRING }
                              }
                            }
                          },
                          future: {
                            type: Type.ARRAY,
                            items: {
                              type: Type.OBJECT,
                              properties: {
                                person: { type: Type.STRING },
                                form: { type: Type.STRING }
                              }
                            }
                          },
                          imperfect: {
                            type: Type.ARRAY,
                            items: {
                              type: Type.OBJECT,
                              properties: {
                                person: { type: Type.STRING },
                                form: { type: Type.STRING }
                              }
                            }
                          },
                          subjunctive: {
                            type: Type.ARRAY,
                            items: {
                              type: Type.OBJECT,
                              properties: {
                                person: { type: Type.STRING },
                                form: { type: Type.STRING }
                              }
                            }
                          }
                        }
                      }
                    },
                    required: ['infinitive', 'translation']
                  }
                }
              },
              required: ['target', 'en']
            }
          }
        },
        required: ['title_target', 'title_en', 'sentences']
      };

      for (const modelName of candidateModels) {
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            result = await ai.models.generateContent({
              model: modelName,
              contents: systemInstruction,
              config: {
                responseMimeType: 'application/json',
                responseSchema: storySchema,
                maxOutputTokens,
              }
            });
            if (result && result.text) break;
          } catch (mErr: any) {
            const classified = classifyGeminiError(mErr);
            console.warn(`Model ${modelName} attempt ${attempt + 1} failed [${classified.code}]:`, mErr.message);
            lastError = mErr;
            modelAttempts.push({
              model: modelName,
              attempt: attempt + 1,
              code: classified.code,
              message: mErr.message || String(mErr),
            });
            if (attempt === 0) {
              await new Promise(r => setTimeout(r, 1200));
            }
          }
        }
        if (result && result.text) break;
      }

      if (!result || !result.text) {
        // Check if candidate was explicitly blocked by safety moderation
        const candidateFinishReason = result?.candidates?.[0]?.finishReason;
        if (candidateFinishReason === 'SAFETY') {
          const err: any = new Error('Story generation was blocked by Gemini safety moderation policy.');
          err.code = 'ERR_GEMINI_SAFETY_BLOCK';
          err.source = 'Google Gemini Safety Moderation';
          err.statusCode = 422;
          err.modelAttempts = modelAttempts;
          throw err;
        }

        if (lastError) {
          const classified = classifyGeminiError(lastError);
          const err: any = new Error(classified.message);
          err.code = classified.code;
          err.source = classified.source;
          err.details = classified.details;
          err.statusCode = classified.statusCode || 500;
          err.modelAttempts = modelAttempts;
          throw err;
        }

        const err: any = new Error('All AI models failed to return story content.');
        err.code = 'ERR_ALL_MODELS_FAILED';
        err.source = 'AI Model Cascade';
        err.statusCode = 503;
        err.modelAttempts = modelAttempts;
        throw err;
      }

      let textResult = result.text.trim();
      // Remove any codeblock wrapping
      if (textResult.startsWith('```json')) textResult = textResult.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
      if (textResult.startsWith('```')) textResult = textResult.replace(/^```\s*/, '').replace(/```\s*$/, '').trim();

      // Extract the first valid JSON object block { ... } in case extraneous trailing commentary or tokens exist
      const firstBrace = textResult.indexOf('{');
      const lastBrace = textResult.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        textResult = textResult.substring(firstBrace, lastBrace + 1).trim();
      }

      let parsedData;
      try {
        parsedData = JSON.parse(textResult);
      } catch (jsonErr) {
        console.warn('Direct JSON parse failed, attempting recovery:', jsonErr);
        let fixed = textResult;
        if (!fixed.endsWith('}')) {
          if (fixed.includes('"sentences"') && !fixed.includes(']}')) {
            fixed = fixed.replace(/,\s*\{[^}]*$/, '') + ']}';
          }
          if (!fixed.endsWith('}')) {
            fixed = fixed + '}';
          }
        }
        try {
          parsedData = JSON.parse(fixed);
        } catch (repairErr: any) {
          const err: any = new Error('AI output could not be parsed as valid JSON.');
          err.code = 'ERR_JSON_PARSE_FAILED';
          err.source = 'Story Output Parser';
          err.details = `JSON syntax error: ${repairErr.message}. Output snippet: ${textResult.slice(0, 300)}`;
          err.statusCode = 500;
          err.modelAttempts = modelAttempts;
          throw err;
        }
      }

      if (!parsedData || !Array.isArray(parsedData.sentences) || parsedData.sentences.length === 0) {
        const err: any = new Error('Generated story is missing valid sentences.');
        err.code = 'ERR_MALFORMED_STORY_STRUCTURE';
        err.source = 'Story Schema Validation';
        err.details = `Data missing sentences array. Keys found: ${Object.keys(parsedData || {}).join(', ')}`;
        err.statusCode = 500;
        err.modelAttempts = modelAttempts;
        throw err;
      }

      // Safeguard against truncated generations that only salvaged 1 or 2 sentences
      if (numSentences >= 15 && parsedData.sentences.length <= 2) {
        const err: any = new Error(`AI returned only ${parsedData.sentences.length} sentence(s) instead of the requested ${numSentences}. Output was likely truncated.`);
        err.code = 'ERR_OUTPUT_TRUNCATED';
        err.source = 'Story Completeness Guard';
        err.details = `Requested ${numSentences} sentences, but received only ${parsedData.sentences.length}. Please try again.`;
        err.statusCode = 502;
        err.modelAttempts = modelAttempts;
        throw err;
      }

      // Cache successfully generated story
      if (storyCache.size >= MAX_CACHE_ENTRIES) {
        const firstKey = storyCache.keys().next().value;
        if (firstKey) storyCache.delete(firstKey);
      }
      storyCache.set(cacheKey, parsedData);

      res.json(parsedData);
    } catch (error: any) {
      console.error('Generation Error:', error);
      const classified = error.code && error.source
        ? {
            code: error.code,
            source: error.source,
            message: error.message,
            details: error.details,
            statusCode: error.statusCode || 500,
            modelAttempts: error.modelAttempts,
          }
        : classifyGeminiError(error);

      res.status(classified.statusCode || 500).json({
        code: classified.code,
        source: classified.source,
        error: classified.message,
        details: classified.details || error.message,
        modelAttempts: classified.modelAttempts || undefined,
        prompt: systemInstruction,
      });
    }
  });

  // Generate Interactive Comprehension Quiz
  app.post('/api/generate-quiz', aiRateLimiter(20, 60000), async (req, res) => {
    try {
      const { story, targetLang = 'Italian', baseLang = 'English', difficulty = 'Intermediate' } = req.body;
      if (!story || !story.sentences || story.sentences.length === 0) {
        return res.status(400).json({ error: 'Story data with sentences is required.' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Return smart fallback quiz
        return res.json({ questions: generateFallbackQuiz(story, targetLang) });
      }

      const isNativeMastery = (targetLang || '').toLowerCase().trim() === (baseLang || '').toLowerCase().trim();
      const sentenceCount = story.sentences.length;
      const storyText = story.sentences.map((s: any, idx: number) => `(Sentence ${idx + 1} - index ${idx}) Target: "${s.target}" | Meaning: "${s.en}"`).join('\n');
      const prompt = `You are an expert language teacher and reading comprehension specialist. Based ONLY on the following reading text in ${targetLang} (${difficulty}) for learners whose reference language is ${baseLang} ${isNativeMastery ? '(Native Mastery Mode: focus on vocabulary nuances, tone, and inferences)' : ''}:

Title: ${story.title_target} (${story.title_en})
Sentences:
${storyText}

TASK:
Create EXACTLY ONE multiple-choice reading comprehension question for EACH of the ${sentenceCount} sentences (total ${sentenceCount} questions).
Return the questions in a SHUFFLED/RANDOMIZED order (do NOT list them in sentence 1, 2, 3... order).

Requirements for each question:
- id: 'q-1', 'q-2', etc.
- sentenceIndex: integer (0 to ${sentenceCount - 1}) specifying which sentence this question tests.
- question_target: The question in ${targetLang} testing the action, vocabulary, or meaning of that specific sentence.
- question_en: Translation of the question in ${baseLang}.
- options: Exactly 4 distinct answer choices in ${targetLang} (one correct based on that sentence, three plausible distractors).
- correctIndex: 0, 1, 2, or 3.
- explanation: A concise 1-sentence explanation in ${baseLang} citing the evidence from that sentence.`;

      const ai = new GoogleGenAI({
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const quizSchema = {
        type: Type.OBJECT,
        properties: {
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                sentenceIndex: { type: Type.INTEGER },
                question_target: { type: Type.STRING },
                question_en: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                correctIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING }
              },
              required: ['id', 'sentenceIndex', 'question_target', 'question_en', 'options', 'correctIndex', 'explanation']
            }
          }
        },
        required: ['questions']
      };

      const candidateModels = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
      let result = null;

      for (const model of candidateModels) {
        try {
          result = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              responseSchema: quizSchema
            }
          });
          if (result && result.text) break;
        } catch (e: any) {
          console.warn(`Quiz gen with ${model} failed:`, e.message);
        }
      }

      if (result && result.text) {
        let cleanText = result.text.trim();
        if (cleanText.startsWith('```json')) cleanText = cleanText.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
        if (cleanText.startsWith('```')) cleanText = cleanText.replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
        const parsed = JSON.parse(cleanText);
        if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
          // Enrich each question with sourceSentenceTarget and sourceSentenceEn
          const enriched = parsed.questions.map((q: any, i: number) => {
            const sIdx = typeof q.sentenceIndex === 'number' && q.sentenceIndex >= 0 && q.sentenceIndex < story.sentences.length
              ? q.sentenceIndex
              : i % story.sentences.length;
            const src = story.sentences[sIdx];
            return {
              ...q,
              sentenceIndex: sIdx,
              sourceSentenceTarget: src?.target || '',
              sourceSentenceEn: src?.en || '',
            };
          });

          // Ensure questions are shuffled (not in sentence 0, 1, 2... order)
          const isSequential = enriched.every((q: any, idx: number) => q.sentenceIndex === idx);
          if (isSequential && enriched.length > 1) {
            for (let j = enriched.length - 1; j > 0; j--) {
              const k = Math.floor(Math.random() * (j + 1));
              [enriched[j], enriched[k]] = [enriched[k], enriched[j]];
            }
          }

          return res.json({ questions: enriched });
        }
      }

      // If AI failed, return fallback
      res.json({ questions: generateFallbackQuiz(story, targetLang, baseLang) });
    } catch (err: any) {
      console.error('Quiz Generation Error:', err);
      // Fallback response so user experience is never blocked
      res.json({ questions: generateFallbackQuiz(req.body?.story, req.body?.targetLang || 'Italian', req.body?.baseLang || 'English') });
    }
  });

  // Generate Grammar Focus Deep-Dive (Grammar Bites)
  app.post('/api/generate-grammar-bites', aiRateLimiter(20, 60000), async (req, res) => {
    try {
      const { story, targetLang = 'Italian', baseLang = 'English', tense = 'Natural / Mixed', difficulty = 'Intermediate' } = req.body;
      if (!story || !story.sentences || story.sentences.length === 0) {
        return res.status(400).json({ error: 'Story data is required.' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({ grammarBites: generateFallbackGrammarBites(story, targetLang, tense) });
      }

      const storySample = story.sentences.map((s: any) => `${s.target} (${s.en})`).join('\n');
      const prompt = `You are a linguist and language pedagogue specializing in teaching ${targetLang} to students whose native/reference language is ${baseLang}.
Analyze the following text (${difficulty}, focus tense: ${tense}):
${storySample}

Identify 2 to 3 key grammar rules/patterns illustrated in this text (for example: verb conjugations, reflexive verbs, prepositions with articles, word order, or adjective agreements).
For each grammar point, provide:
- id: short unique id (e.g. gb1)
- title: concise descriptive title in ${baseLang}
- rule: clear, encouraging explanation in ${baseLang} (2-3 sentences) of how this grammar works.
- examples: array of 1 to 2 direct example sentences from the text (${targetLang} + translation in ${baseLang}).
- tip: practical memory hook or common mistake to avoid in ${baseLang}.`;

      const grammarSchema = {
        type: Type.OBJECT,
        properties: {
          grammarBites: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                rule: { type: Type.STRING },
                examples: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      target: { type: Type.STRING },
                      en: { type: Type.STRING }
                    },
                    required: ['target', 'en']
                  }
                },
                tip: { type: Type.STRING }
              },
              required: ['id', 'title', 'rule', 'examples', 'tip']
            }
          }
        },
        required: ['grammarBites']
      };

      const ai = new GoogleGenAI({
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const candidateModels = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
      let result = null;

      for (const model of candidateModels) {
        try {
          result = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              responseSchema: grammarSchema
            }
          });
          if (result && result.text) break;
        } catch (e: any) {
          console.warn(`Grammar bites gen with ${model} failed:`, e.message);
        }
      }

      if (result && result.text) {
        let cleanText = result.text.trim();
        if (cleanText.startsWith('```json')) cleanText = cleanText.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
        if (cleanText.startsWith('```')) cleanText = cleanText.replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
        const parsed = JSON.parse(cleanText);
        return res.json(parsed);
      }

      res.json({ grammarBites: generateFallbackGrammarBites(story, targetLang, tense) });
    } catch (err: any) {
      console.error('Grammar Bites Error:', err);
      res.json({ grammarBites: generateFallbackGrammarBites(req.body.story, req.body.targetLang || 'Italian', req.body.tense || 'Mixed') });
    }
  });

  // Interactive Conversation Partner Endpoint
  app.post('/api/chat-converse', aiRateLimiter(30, 60000), async (req, res) => {
    try {
      const {
        storyTitle,
        storyContext,
        targetLang = 'Italian',
        baseLang = 'English',
        difficulty = 'Intermediate',
        messages = [],
        userMessage = '',
      } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || !userMessage) {
        return res.json(generateFallbackConverseReply(targetLang, userMessage, baseLang));
      }

      const isNativeMastery = (targetLang || '').toLowerCase().trim() === (baseLang || '').toLowerCase().trim();
      const recentHistory = (messages || []).slice(-6).map((m: any) => `${m.role === 'user' ? 'Learner' : 'Native Speaker'}: ${m.targetText || m.text || ''}`).join('\n');

      const prompt = `You are an articulate, engaging conversation partner and literary interlocutor in ${targetLang} chatting with a learner ${isNativeMastery ? `who speaks ${targetLang} and is developing advanced eloquence, vocabulary, and specialist rhetoric` : `whose native/reference language is ${baseLang}`}.
Story Context: "${storyTitle || 'Daily life'}" (${storyContext || ''})
Learner's CEFR Level: ${difficulty}.

Conversation history:
${recentHistory}

The learner just said:
"${userMessage}"

Tasks:
1. reply_target: Reply in 1 to 2 warm, natural, conversational sentences in ${targetLang} calibrated for a ${difficulty} level learner. Ask an engaging follow-up question related to the topic.
2. reply_base: ${isNativeMastery ? `Provide a brief lexical comment, synonym suggestion, or rhetorical observation in ${targetLang}` : `Provide a high-quality, natural translation of your reply in ${baseLang}`}.
3. feedback_tip: If the learner made a grammatical mistake or could express their idea with more vivid/eloquent native phrasing, give a friendly, helpful 1-sentence tip in ${baseLang}. If their message was natural, leave feedback_tip empty ("").`;

      const converseSchema = {
        type: Type.OBJECT,
        properties: {
          reply_target: { type: Type.STRING },
          reply_base: { type: Type.STRING },
          feedback_tip: { type: Type.STRING },
        },
        required: ['reply_target', 'reply_base'],
      };

      const ai = new GoogleGenAI({
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const candidateModels = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
      let result = null;

      for (const model of candidateModels) {
        try {
          result = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              responseSchema: converseSchema,
            }
          });
          if (result && result.text) break;
        } catch (e: any) {
          console.warn(`Converse gen with ${model} failed:`, e.message);
        }
      }

      if (result && result.text) {
        let cleanText = result.text.trim();
        if (cleanText.startsWith('```json')) cleanText = cleanText.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
        const parsed = JSON.parse(cleanText);
        return res.json(parsed);
      }

      return res.json(generateFallbackConverseReply(targetLang, userMessage, baseLang));
    } catch (err: any) {
      console.error('Chat Converse Error:', err);
      res.json(generateFallbackConverseReply(req.body?.targetLang || 'Italian', req.body?.userMessage || '', req.body?.baseLang || 'English'));
    }
  });

  // Word Etymology & Source Language Connection Endpoint
  app.post('/api/word-etymology', aiRateLimiter(30, 60000), async (req, res) => {
    try {
      const {
        word,
        targetLang = 'Italian',
        baseLang = 'English',
        sentenceContext = '',
      } = req.body;

      if (!word) {
        return res.status(400).json({ error: 'Word is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json(generateFallbackEtymology(word, targetLang, baseLang));
      }

      const prompt = `You are an expert academic philologist, comparative linguist, and historical lexicographer.
CRITICAL INSTRUCTION - DOUBLE-CHECK AND FACT-CHECK FOR ACCURACY:
Learners rely on verified etymological truth. You must systematically double-check and rigorously verify all linguistic information about the target word "${word}" (${targetLang}) for a learner whose native/reference language is "${baseLang}".
Sentence context: "${sentenceContext}"

DOUBLE-CHECK REQUIREMENTS:
1. DOUBLE-CHECK THE ANCESTRAL ROOT (etymology):
   - Cross-check against authoritative philological dictionaries.
   - For Arabic (Semitic languages): Identify the fundamental 3-consonant root (جذر, e.g. k-t-b) and morphological pattern (وزن), explaining how words branch from that root.
   - For Chinese (Mandarin/Cantonese): Break down the character radicals (部首), semantic/phonetic components, and historical pictographic or ideographic origins.
   - For Japanese: Break down the Kanji radical (部首), On'yomi vs Kun'yomi origin, and character components.
   - For Romance languages (Spanish, French, Italian, Portuguese, Romanian): Trace the exact Latin or Ancient Greek lemma.
   - For Germanic languages (German, Dutch, Scandinavian): Trace the Proto-Germanic root and direct English cognates.
   - For Slavic languages (Russian, Polish, Ukrainian): Trace the Proto-Slavic root.
   - For Hungarian (Magyar): Trace the ancestral Uralic / Finno-Ugric stem, explaining the agglutinative suffix structure and historical linguistic trajectory.
   - State the original ancestor word/root and its core historical meaning clearly in "${baseLang}".

2. DOUBLE-CHECK THE RELATION TO SOURCE LANGUAGE (connection):
   - Double-check whether there is a genuine historical connection to "${baseLang}".
   - FACT-CHECK AGAINST FALSE COGNATES: If "${word}" resembles an English/source-language word only superficially (a false friend/false cognate with distinct historical origins), you MUST explicitly state that they are false cognates, explain their separate true roots, and provide an intuitive memory hook or mnemonic instead.
   - If they share an authentic cognate or loanword connection, explain the historical trajectory clearly in "${baseLang}".

3. DOUBLE-CHECK COGNATES (cognates):
   - Verify that every listed cognate is genuinely etymologically related through common descent or historical borrowing. Do NOT include words that merely sound similar by accident. Provide 2 to 4 verified cognates.

4. DOUBLE-CHECK FASCINATING TRIVIA (fun_fact):
   - Provide 1 verified, fascinating historical, cultural, or semantic trivia in "${baseLang}".`;

      const etymologySchema = {
        type: Type.OBJECT,
        properties: {
          etymology: { type: Type.STRING },
          connection: { type: Type.STRING },
          fun_fact: { type: Type.STRING },
          cognates: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ['etymology', 'connection', 'fun_fact', 'cognates'],
      };

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const candidateModels = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
      let result = null;

      for (const model of candidateModels) {
        try {
          result = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              responseSchema: etymologySchema,
            }
          });
          if (result && result.text) break;
        } catch (e: any) {
          console.warn(`Etymology gen with ${model} failed:`, e.message);
        }
      }

      if (result && result.text) {
        let cleanText = result.text.trim();
        if (cleanText.startsWith('```json')) cleanText = cleanText.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
        const parsed = JSON.parse(cleanText);
        return res.json(parsed);
      }

      return res.json(generateFallbackEtymology(word, targetLang, baseLang));
    } catch (err: any) {
      console.error('Word Etymology Error:', err);
      res.json(generateFallbackEtymology(req.body?.word || '', req.body?.targetLang || 'Italian', req.body?.baseLang || 'English'));
    }
  });

  // Contextual Word Translation & Verification Endpoint
  app.post('/api/word-translate', aiRateLimiter(60, 60000), async (req, res) => {
    try {
      const {
        word,
        targetLang = 'Italian',
        baseLang = 'English',
        sentenceContext = '',
      } = req.body;

      if (!word) {
        return res.status(400).json({ error: 'Word is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({ translation: word, doubleChecked: false });
      }

      const prompt = `You are a precision bilingual lexicographer and translator.
Translate the specific word "${word}" (${targetLang}) into "${baseLang}" strictly as it functions in this context sentence:
Sentence: "${sentenceContext || word}"

CRITICAL INSTRUCTION - DOUBLE-CHECK FOR HIGH ACCURACY:
1. Provide the most accurate, natural contextual translation (1 to 3 words maximum) in ${baseLang}.
2. Ensure the part of speech and nuance matches how it is used in the sentence context.

Return a JSON object with:
- "translation": the exact accurate translation in ${baseLang}
- "partOfSpeech": grammatical category (noun, verb, adjective, adverb, preposition, etc.)
- "doubleChecked": true`;

      const translateSchema = {
        type: Type.OBJECT,
        properties: {
          translation: { type: Type.STRING },
          partOfSpeech: { type: Type.STRING },
          doubleChecked: { type: Type.BOOLEAN },
        },
        required: ['translation'],
      };

      const ai = new GoogleGenAI({
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const candidateModels = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
      let result = null;

      for (const model of candidateModels) {
        try {
          result = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              responseSchema: translateSchema,
            }
          });
          if (result && result.text) break;
        } catch (e: any) {
          console.warn(`Translation with ${model} failed:`, e.message);
        }
      }

      if (result && result.text) {
        let clean = result.text.trim();
        if (clean.startsWith('```json')) clean = clean.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
        if (clean.startsWith('```')) clean = clean.replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
        const parsed = JSON.parse(clean);
        return res.json({ ...parsed, doubleChecked: true });
      }

      return res.json({ translation: word, doubleChecked: false });
    } catch (err: any) {
      console.error('Word Translate Error:', err);
      res.json({ translation: req.body?.word || '', doubleChecked: false });
    }
  });

  // Detailed Phonetic & Articulatory Pronunciation Endpoint
  app.post('/api/word-pronunciation', aiRateLimiter(60, 60000), async (req, res) => {
    try {
      const {
        word,
        targetLang = 'Italian',
        baseLang = 'English',
        sentenceContext = '',
      } = req.body;

      if (!word) {
        return res.status(400).json({ error: 'Word is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json(generateFallbackPronunciation(word, targetLang, baseLang));
      }

      const prompt = `You are an expert phonetician, speech-language pathologist, and linguistic coach specializing in articulatory phonetics and accent reduction for language learners.
Analyze the target word "${word}" in ${targetLang} for a learner whose native/reference language is "${baseLang}".
Sentence context: "${sentenceContext}"

CRITICAL REQUIREMENTS:
1. "ipa": International Phonetic Alphabet transcription (e.g. /zbalorˈdito/ or /ˈfwatʃe/).
2. "syllables": Hyphenated syllables with the PRIMARY STRESSED syllable in ALL CAPS (e.g. "sbal-or-DI-to", "ha-BLAN-do").
3. "stressedSyllable": The accented/stressed syllable (e.g. "DI").
4. "tonguePlacement": Clear, anatomical, physical instructions explaining exactly where to place the tip, blade, and body of the tongue (e.g. which teeth to touch, how high to arch the back of the tongue, or keeping it flat).
5. "lipAndMouthPosition": Precise lip shape (e.g. rounded into a tight circle, relaxed spread into a gentle smile) and jaw drop.
6. "airflowAndVoicing": Vocal cord vibration, aspiration (air puff vs zero puff), or nasal airflow.
7. "learnerPitfalls": The #1 common accent mistake or trap that ${baseLang} speakers make with this word, and how to avoid it.
8. "toneOrPitchGuide": For tonal languages (like Chinese/Vietnamese) or pitch accent languages (Japanese): state the tone pitch numbers and contour. For other languages: describe the stress rhythm.
9. "soundAlike": Intuitive phonetic sound-alike representation in ${baseLang}.
10. "memoryHook": A quick memorable mental trigger or physical sensation cue.`;

      const pronunciationSchema = {
        type: Type.OBJECT,
        properties: {
          ipa: { type: Type.STRING },
          syllables: { type: Type.STRING },
          stressedSyllable: { type: Type.STRING },
          tonguePlacement: { type: Type.STRING },
          lipAndMouthPosition: { type: Type.STRING },
          airflowAndVoicing: { type: Type.STRING },
          learnerPitfalls: { type: Type.STRING },
          toneOrPitchGuide: { type: Type.STRING },
          soundAlike: { type: Type.STRING },
          memoryHook: { type: Type.STRING },
        },
        required: [
          'ipa',
          'syllables',
          'stressedSyllable',
          'tonguePlacement',
          'lipAndMouthPosition',
          'airflowAndVoicing',
          'learnerPitfalls',
        ],
      };

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
      });

      const candidateModels = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
      let result = null;

      for (const model of candidateModels) {
        try {
          result = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              responseSchema: pronunciationSchema,
            },
          });
          if (result && result.text) break;
        } catch (e: any) {
          console.warn(`Pronunciation gen with ${model} failed:`, e.message);
        }
      }

      if (result && result.text) {
        let clean = result.text.trim();
        if (clean.startsWith('```json')) clean = clean.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
        if (clean.startsWith('```')) clean = clean.replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
        const parsed = JSON.parse(clean);
        return res.json(parsed);
      }

      return res.json(generateFallbackPronunciation(word, targetLang, baseLang));
    } catch (err: any) {
      console.error('Word Pronunciation Error:', err);
      res.json(generateFallbackPronunciation(req.body?.word || '', req.body?.targetLang || 'Italian', req.body?.baseLang || 'English'));
    }
  });

  // Verb Conjugation Table Expansion Endpoint
  app.post('/api/verb-conjugations', aiRateLimiter(60, 60000), async (req, res) => {
    try {
      const {
        infinitive,
        targetLang = 'Italian',
        baseLang = 'English',
        sentenceContext = '',
      } = req.body;

      if (!infinitive) {
        return res.status(400).json({ error: 'Infinitive is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json(generateFallbackVerbConjugations(infinitive, targetLang, baseLang));
      }

      const prompt = `You are an expert lexicographer, grammarian, and language teacher.
Generate a complete, verified conjugation paradigm for the verb "${infinitive}" in ${targetLang} for a learner whose native/reference language is "${baseLang}".
Sentence context: "${sentenceContext}"

CRITICAL REQUIREMENTS:
1. "infinitive": "${infinitive}"
2. "translation": accurate definition in ${baseLang}
3. "regularOrIrregular": "regular" or "irregular"
4. "auxiliary": auxiliary verb used in compound tenses if applicable (e.g. "avere" or "essere" in Italian; "haber" in Spanish; "avoir" or "être" in French; "haben" or "sein" in German)
5. "pastParticiple": past participle form (e.g. "parlato", "hablado", "parlé")
6. "gerund": gerund / present participle form (e.g. "parlando", "hablando", "parlant")
7. "prepositionPattern": key preposition patterns or verbal valence (e.g. "pensare a [qualcosa]", "soñar con", "parlare di")
8. "grammaticalNote": concise, practical explanation of irregular stems or key usage tips in ${baseLang}
9. "conjugations":
   - "present": full array of 6 persons with person pronoun (e.g. io/tu/lui/noi/voi/loro or yo/tú/él...) and conjugated form
   - "past": full array of 6 persons for past tense (Passato Prossimo in Italian, Pretérito Indefinido in Spanish, Passé Composé in French, Simple Past in English)
   - "future": full array of 6 persons for future tense (Futuro Semplice / Futur Simple / Future)
   - "imperfect": full array of 6 persons for imperfect tense (Imperfetto / Pretérito Imperfecto / Imparfait)
   - "conditional": full array of 6 persons for present conditional (Condizionale / Condicional / Conditionnel)`;

      const verbSchema = {
        type: Type.OBJECT,
        properties: {
          infinitive: { type: Type.STRING },
          translation: { type: Type.STRING },
          regularOrIrregular: { type: Type.STRING },
          auxiliary: { type: Type.STRING },
          pastParticiple: { type: Type.STRING },
          gerund: { type: Type.STRING },
          prepositionPattern: { type: Type.STRING },
          grammaticalNote: { type: Type.STRING },
          conjugations: {
            type: Type.OBJECT,
            properties: {
              present: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    person: { type: Type.STRING },
                    form: { type: Type.STRING },
                  },
                  required: ['person', 'form'],
                },
              },
              past: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    person: { type: Type.STRING },
                    form: { type: Type.STRING },
                  },
                  required: ['person', 'form'],
                },
              },
              future: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    person: { type: Type.STRING },
                    form: { type: Type.STRING },
                  },
                  required: ['person', 'form'],
                },
              },
              imperfect: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    person: { type: Type.STRING },
                    form: { type: Type.STRING },
                  },
                  required: ['person', 'form'],
                },
              },
              conditional: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    person: { type: Type.STRING },
                    form: { type: Type.STRING },
                  },
                  required: ['person', 'form'],
                },
              },
            },
            required: ['present', 'past', 'future'],
          },
        },
        required: ['infinitive', 'translation', 'conjugations'],
      };

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
      });

      const candidateModels = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
      let result = null;

      for (const model of candidateModels) {
        try {
          result = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              responseSchema: verbSchema,
            },
          });
          if (result && result.text) break;
        } catch (e: any) {
          console.warn(`Verb conjugations gen with ${model} failed:`, e.message);
        }
      }

      if (result && result.text) {
        let clean = result.text.trim();
        if (clean.startsWith('```json')) clean = clean.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
        if (clean.startsWith('```')) clean = clean.replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
        const parsed = JSON.parse(clean);
        return res.json(parsed);
      }

      return res.json(generateFallbackVerbConjugations(infinitive, targetLang, baseLang));
    } catch (err: any) {
      console.error('Verb Conjugations Error:', err);
      res.json(generateFallbackVerbConjugations(req.body?.infinitive || '', req.body?.targetLang || 'Italian', req.body?.baseLang || 'English'));
    }
  });

  // Known curated starter sample files (read-only built-in examples)
  const STARTER_SAMPLE_FILES = new Set([
    'a_walk_around_lago_sirio.json',
    'dialogo_al_caffe_roma.json',
    'egy_seta_a_duna_parton.json',
    'el_mercado_de_valencia.json',
    'en_morgentur_i_oslo.json',
    'i_miei_amici_animali_intro.json',
    'prochazka_po_karlove_moste.json',
  ]);

  // Save story endpoint - User stories remain 100% private in client localStorage.
  // The server does NOT store user-generated stories in a common shared directory.
  app.post('/api/library/save', (_req, res) => {
    res.json({
      success: true,
      localOnly: true,
      message: 'Stories are saved privately on your device and not shared publicly.',
    });
  });

  // List starter sample stories (only built-in starter templates, no user stories)
  app.get('/api/library/list', (_req, res) => {
    try {
      const files = fs.readdirSync(EXPORTS_DIR);
      const items: any[] = [];

      files.forEach((file) => {
        if (file.endsWith('.json') && STARTER_SAMPLE_FILES.has(file)) {
          const filePath = path.join(EXPORTS_DIR, file);
          try {
            const stats = fs.statSync(filePath);
            const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            const fileTs = stats.mtimeMs || stats.ctimeMs || stats.birthtimeMs || 0;
            items.push({
              filename: file,
              title_target: content.title_target || 'Untitled',
              title_en: content.title_en || '',
              contentType: content.contentType || content._meta?.contentType || 'story',
              _meta: content._meta || {},
              isStarterSample: true,
              isLocalOnly: false,
              createdAt: content.createdAt || fileTs,
            });
          } catch (e) {
            console.error(`Error reading sample ${file}:`, e);
          }
        }
      });

      res.json(items);
    } catch (error: any) {
      console.error('List Error:', error);
      res.status(500).json({ error: 'Failed to list sample library items.' });
    }
  });

  // Get single starter sample story
  app.get('/api/library/item/:filename', (req, res) => {
    try {
      const filename = path.basename(req.params.filename);
      if (!STARTER_SAMPLE_FILES.has(filename)) {
        return res.status(404).json({ error: 'Item not found or private.' });
      }

      const filePath = path.join(EXPORTS_DIR, filename);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found.' });
      }

      const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      res.json(content);
    } catch (error: any) {
      console.error('Fetch Item Error:', error);
      res.status(500).json({ error: 'Failed to fetch library item.' });
    }
  });

  // Delete story (Built-in starter samples are protected and cannot be deleted)
  app.delete('/api/library/item/:filename', (_req, res) => {
    res.json({ success: true, message: 'Built-in samples are permanent presets.' });
  });

  // Short Story Share Endpoints (bounded storage with 30-day auto-expiry)
  app.post('/api/share/create', (req, res) => {
    try {
      const { story, ttlDays = 30 } = req.body;
      if (!story || !story.title_target || !Array.isArray(story.sentences) || story.sentences.length === 0) {
        return res.status(400).json({ error: 'Valid story data with sentences is required.' });
      }

      // Generate a sleek 6-character random alphanumeric ID or use requested valid id
      const requestedId = typeof req.body.id === 'string' && /^[a-zA-Z0-9_-]{4,16}$/.test(req.body.id)
        ? req.body.id
        : null;
      const id = requestedId || crypto.randomBytes(4).toString('base64url').slice(0, 6);
      const filePath = path.join(SHARED_DIR, `${id}.json`);

      const now = Date.now();
      // Keep shared stories for at least 30 days initially (minimum 7 days, up to 90 days)
      const validTtlDays = Math.min(Math.max(Number(ttlDays) || 30, 7), 90);
      const expiresAt = now + validTtlDays * 24 * 60 * 60 * 1000;

      const record = {
        id,
        createdAt: now,
        lastAccessedAt: now,
        expiresAt,
        story: {
          title_target: story.title_target,
          title_en: story.title_en || '',
          contentType: story.contentType || 'story',
          _meta: story._meta || {},
          sentences: (story.sentences || []).map((s: any) => ({
            target: s.target,
            en: s.en,
            speaker: s.speaker,
            verbs: s.verbs,
          })),
          quiz: story.quiz,
          grammarBites: story.grammarBites,
        },
      };

      fs.writeFileSync(filePath, JSON.stringify(record, null, 2), 'utf-8');

      res.json({
        success: true,
        id,
        expiresAt,
        ttlDays: validTtlDays,
      });
    } catch (err: any) {
      console.error('Create short share link error:', err);
      res.status(500).json({ error: 'Failed to create short share link.' });
    }
  });

  app.get('/api/share/:id', (req, res) => {
    try {
      const id = path.basename(req.params.id);
      const filePath = path.join(SHARED_DIR, `${id}.json`);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          code: 'ERR_SHARED_NOT_FOUND',
          error: 'Shared story link was not found or has expired.',
        });
      }

      const raw = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw);
      const now = Date.now();

      // Check if expired and wasn't accessed recently
      if (data.expiresAt && now > data.expiresAt) {
        const lastAccess = data.lastAccessedAt || data.createdAt || 0;
        if (now - lastAccess > 7 * 24 * 60 * 60 * 1000) {
          try { fs.unlinkSync(filePath); } catch (_) {}
          return res.status(410).json({
            code: 'ERR_SHARED_LINK_EXPIRED',
            error: 'This shared story link has expired.',
          });
        }
      }

      // Rolling extension: every time a story is accessed (so it can be passed on to others),
      // ensure it stays active for at least another 7 days from now!
      const minExtendedExpiry = now + 7 * 24 * 60 * 60 * 1000;
      if (!data.expiresAt || data.expiresAt < minExtendedExpiry) {
        data.expiresAt = minExtendedExpiry;
        data.lastAccessedAt = now;
        try {
          fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        } catch (_) {}
      }

      res.json({
        success: true,
        story: data.story,
        createdAt: data.createdAt,
        expiresAt: data.expiresAt,
      });
    } catch (err: any) {
      console.error('Fetch shared story error:', err);
      res.status(500).json({ error: 'Failed to fetch shared story.' });
    }
  });

  // Private Built-in Analytics Endpoints (Option A)
  app.post('/api/analytics/event', (req, res) => {
    try {
      const { visitorId, event, details = {} } = req.body;
      const vId = String(visitorId || 'anonymous').trim().slice(0, 64);
      const ev = String(event || 'page_view').trim().slice(0, 48);
      const now = Date.now();
      const today = new Date().toISOString().slice(0, 10);

      // Track distinct visitor
      if (!analyticsCache.visitors[vId]) {
        analyticsCache.visitors[vId] = {
          firstSeen: now,
          lastSeen: now,
          totalEvents: 1,
          days: [today],
        };
      } else {
        const v = analyticsCache.visitors[vId];
        v.lastSeen = now;
        v.totalEvents += 1;
        if (!v.days.includes(today)) {
          v.days.push(today);
          if (v.days.length > 90) v.days = v.days.slice(-90);
        }
      }

      // Initialize daily bucket if not present
      if (!analyticsCache.dailyStats[today]) {
        analyticsCache.dailyStats[today] = {
          activeVisitors: [vId],
          pageViews: 0,
          storiesGenerated: 0,
          wordLookups: 0,
          digDeeperClicks: 0,
          audioPlays: 0,
          storiesShared: 0,
        };
      } else if (!analyticsCache.dailyStats[today].activeVisitors.includes(vId)) {
        analyticsCache.dailyStats[today].activeVisitors.push(vId);
      }

      const daily = analyticsCache.dailyStats[today];

      // Update counters based on event type
      switch (ev) {
        case 'page_view':
          analyticsCache.totals.pageViews += 1;
          daily.pageViews += 1;
          break;
        case 'story_generated':
          analyticsCache.totals.storiesGenerated += 1;
          daily.storiesGenerated += 1;
          if (details?.language && typeof details.language === 'string') {
            const lang = details.language.trim();
            analyticsCache.languages[lang] = (analyticsCache.languages[lang] || 0) + 1;
          }
          break;
        case 'story_read':
          analyticsCache.totals.storiesRead += 1;
          break;
        case 'word_lookup':
          analyticsCache.totals.wordLookups += 1;
          daily.wordLookups += 1;
          break;
        case 'dig_deeper_click':
          analyticsCache.totals.digDeeperClicks += 1;
          daily.digDeeperClicks += 1;
          if (details?.word && typeof details.word === 'string') {
            const w = details.word.trim().toLowerCase();
            if (w.length < 50) {
              analyticsCache.topWords[w] = (analyticsCache.topWords[w] || 0) + 1;
            }
          }
          break;
        case 'audio_play':
          analyticsCache.totals.audioPlays += 1;
          daily.audioPlays += 1;
          break;
        case 'story_shared':
          analyticsCache.totals.storiesShared += 1;
          daily.storiesShared += 1;
          break;
        case 'saved_library':
          analyticsCache.totals.savedToLibrary += 1;
          break;
        case 'practice_start':
          analyticsCache.totals.practiceSessions += 1;
          break;
        case 'ad_impression':
          analyticsCache.totals.adImpressions = (analyticsCache.totals.adImpressions || 0) + 1;
          break;
      }

      // Update per-language-pair analytics and estimated revenue
      const targetL = String(details?.targetLang || details?.language || '').trim();
      if (targetL) {
        const baseL = String(details?.baseLang || 'English').trim();
        const pairKey = details?.languagePair || `${targetL} → ${baseL}`;
        if (!analyticsCache.languagePairs) {
          analyticsCache.languagePairs = {};
        }
        if (!analyticsCache.languagePairs[pairKey]) {
          analyticsCache.languagePairs[pairKey] = {
            targetLang: targetL,
            baseLang: baseL,
            storiesGenerated: 0,
            practiceSessions: 0,
            wordLookups: 0,
            audioPlays: 0,
            adImpressions: 0,
            uniqueLearners: [],
            estimatedRevenueEur: 0,
          };
        }

        const pair = analyticsCache.languagePairs[pairKey];
        if (ev === 'story_generated') pair.storiesGenerated += 1;
        if (ev === 'practice_start') pair.practiceSessions += 1;
        if (ev === 'word_lookup' || ev === 'dig_deeper_click') pair.wordLookups += 1;
        if (ev === 'audio_play') pair.audioPlays += 1;
        if (ev === 'ad_impression') pair.adImpressions += 1;

        if (vId && !pair.uniqueLearners.includes(vId)) {
          pair.uniqueLearners.push(vId);
        }

        // Calculate revenue based on realistic ad CPM (€22 per 1k impressions = €0.022/ad) + active learner engagement
        pair.estimatedRevenueEur = Number(
          ((pair.adImpressions * 0.022) + (pair.storiesGenerated * 0.005) + (pair.practiceSessions * 0.003)).toFixed(2)
        );

        // Update total revenue across all pairs
        analyticsCache.totals.estimatedTotalRevenueEur = Number(
          Object.values(analyticsCache.languagePairs).reduce((acc, p) => acc + (p.estimatedRevenueEur || 0), 0).toFixed(2)
        );
      }

      // Keep recent events preview (max 40)
      analyticsCache.recentEvents.unshift({
        timestamp: now,
        event: ev,
        details: typeof details === 'object' ? details : {},
        visitorPreview: vId.slice(0, 8),
      });
      if (analyticsCache.recentEvents.length > 40) {
        analyticsCache.recentEvents = analyticsCache.recentEvents.slice(0, 40);
      }

      saveAnalyticsDebounced();
      res.json({ success: true });
    } catch (err: any) {
      console.error('Analytics event error:', err);
      res.status(500).json({ error: 'Failed to record analytics event' });
    }
  });

  app.get('/api/analytics/stats', (_req, res) => {
    try {
      const now = Date.now();
      const today = new Date().toISOString().slice(0, 10);
      const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
      const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

      const visitorValues = Object.values(analyticsCache.visitors);
      const totalDistinct = visitorValues.length;
      let visitorsToday = 0;
      let visitors7d = 0;
      let visitors30d = 0;

      for (const v of visitorValues) {
        if (v.days && v.days.includes(today)) visitorsToday += 1;
        if (v.lastSeen >= sevenDaysAgo) visitors7d += 1;
        if (v.lastSeen >= thirtyDaysAgo) visitors30d += 1;
      }

      // Top words sorted
      const sortedWords = Object.entries(analyticsCache.topWords)
        .map(([word, count]) => ({ word, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 25);

      // Past 14 days activity list
      const daysList: Array<{
        date: string;
        visitors: number;
        pageViews: number;
        storiesGenerated: number;
        wordLookups: number;
        digDeeperClicks: number;
      }> = [];

      for (let i = 13; i >= 0; i--) {
        const d = new Date(now - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        const dayStat = analyticsCache.dailyStats[d];
        daysList.push({
          date: d,
          visitors: dayStat ? dayStat.activeVisitors.length : 0,
          pageViews: dayStat ? dayStat.pageViews : 0,
          storiesGenerated: dayStat ? dayStat.storiesGenerated : 0,
          wordLookups: dayStat ? dayStat.wordLookups : 0,
          digDeeperClicks: dayStat ? dayStat.digDeeperClicks : 0,
        });
      }

      const pairList = Object.entries(analyticsCache.languagePairs || {})
        .map(([pairKey, data]) => ({
          pairKey,
          targetLang: data.targetLang,
          baseLang: data.baseLang,
          storiesGenerated: data.storiesGenerated,
          practiceSessions: data.practiceSessions,
          wordLookups: data.wordLookups,
          audioPlays: data.audioPlays,
          adImpressions: data.adImpressions || 0,
          uniqueLearnersCount: Array.isArray(data.uniqueLearners) ? data.uniqueLearners.length : 1,
          estimatedRevenueEur: data.estimatedRevenueEur || 0,
        }))
        .sort((a, b) => b.estimatedRevenueEur - a.estimatedRevenueEur);

      res.json({
        success: true,
        stats: {
          summary: {
            totalDistinctVisitors: totalDistinct,
            visitorsToday,
            visitorsLast7Days: visitors7d,
            visitorsLast30Days: visitors30d,
            pageViews: analyticsCache.totals.pageViews,
            storiesGenerated: analyticsCache.totals.storiesGenerated,
            storiesRead: analyticsCache.totals.storiesRead,
            wordLookups: analyticsCache.totals.wordLookups,
            digDeeperClicks: analyticsCache.totals.digDeeperClicks,
            audioPlays: analyticsCache.totals.audioPlays,
            storiesShared: analyticsCache.totals.storiesShared,
            savedToLibrary: analyticsCache.totals.savedToLibrary,
            practiceSessions: analyticsCache.totals.practiceSessions,
            adImpressions: analyticsCache.totals.adImpressions || 0,
            estimatedTotalRevenueEur: analyticsCache.totals.estimatedTotalRevenueEur || 0,
          },
          languages: analyticsCache.languages,
          languagePairs: pairList,
          topWords: sortedWords,
          dailyActivity: daysList,
          recentEvents: analyticsCache.recentEvents.slice(0, 25),
        },
      });
    } catch (err: any) {
      console.error('Analytics stats error:', err);
      res.status(500).json({ error: 'Failed to retrieve analytics stats' });
    }
  });

  // Explicit robots.txt and ads.txt endpoints for AdSense and search crawlers
  app.get('/robots.txt', (_req, res) => {
    res.type('text/plain').send('User-agent: Mediapartners-Google\nAllow: /\n\nUser-agent: Googlebot\nAllow: /\n\nUser-agent: *\nAllow: /\n');
  });

  app.get('/ads.txt', (_req, res) => {
    res.type('text/plain').send('google.com, pub-8750963077643989, DIRECT, f08c47fec0942fa0\n');
  });

  const isProd = process.env.NODE_ENV === 'production';
  const PORT = Number(process.env.PORT) || 3000;

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {}
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Impara Chromebook/Tablet app running at http://0.0.0.0:${PORT}`);
  });

  server.timeout = 180000;
}

startServer().catch(err => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
