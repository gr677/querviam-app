/**
 * SPONSOR / AD CONFIGURATION & MOCK DATA
 *
 * Designed to provide a pleasant, non-intrusive learner experience:
 * 1. Aesthetic: Clean cards matching Impara's palette (no flashy popups or banners).
 * 2. Educational: Bilingual feature allows learners to translate the ad into their
 *    Target Language and even listen to pronunciation!
 * 3. Easy Substitution: Set USE_REAL_ADS = true and provide your AdSense Publisher ID
 *    to switch to live network ads when ready.
 */

export interface SponsorAdItem {
  id: string;
  brand: string;
  category: string;
  headlineEn: string;
  descriptionEn: string;
  ctaTextEn: string;
  link: string;
  icon: 'coffee' | 'plane' | 'headphones' | 'book';
  // Bilingual translations for learning languages
  translations: Record<string, {
    headline: string;
    description: string;
    ctaText: string;
  }>;
}

export const AD_CONFIG = {
  // Real Google AdSense toggle (set to true once AdSense domain is approved)
  USE_REAL_ADS: false,
  ADSENSE_CLIENT_ID: 'ca-pub-8750963077643989',
  ADSENSE_SLOT_SIDEBAR: '',
  ADSENSE_SLOT_INCONTENT: '',
  ADSENSE_SLOT_MOBILE: '',

  // Language Learning Ad Feature: allows translating ad to learner's target language
  ENABLE_BILINGUAL_LEARNING_ADS: true,
};

export const SAMPLE_SPONSORS: SponsorAdItem[] = [
  {
    id: 'ad-vergnano-espresso',
    brand: 'Caffè Vergnano 1882',
    category: 'Authentic Travel & Culture',
    headlineEn: 'Taste authentic Italian espresso at home',
    descriptionEn: 'Slow-roasted Piedmontese beans delivered directly from Turin. Fuel your daily language immersion.',
    ctaTextEn: 'Explore Roastery',
    link: 'https://www.caffevergnano.com',
    icon: 'coffee',
    translations: {
      Italian: {
        headline: 'Gusta il vero espresso italiano a casa tua',
        description: 'Chicchi piemontesi tostati lentamente da Torino. Accompagna la tua immersione linguistica quotidiana.',
        ctaText: 'Scopri la Torrefazione',
      },
      Spanish: {
        headline: 'Disfruta del auténtico café italiano en casa',
        description: 'Granos de café de Turín tostados lentamente. El impulso perfecto para tu práctica de idiomas diaria.',
        ctaText: 'Explorar Cafetería',
      },
      French: {
        headline: 'Dégustez un authentique café italien chez vous',
        description: 'Grains piémontais torréfiés lentement à Turin. Idéal pour accompagner votre apprentissage quotidien.',
        ctaText: 'Découvrir la brûlerie',
      },
      German: {
        headline: 'Genießen Sie echten italienischen Espresso zu Hause',
        description: 'Schonend geröstete Kaffeebohnen aus Turin. Der perfekte Begleiter für Ihre tägliche Sprachpraxis.',
        ctaText: 'Rösterei entdecken',
      },
      Portuguese: {
        headline: 'Saboreie o autêntico café italiano em sua casa',
        description: 'Grãos piemonteses torrados lentamente em Turim. O par perfeito para seu estudo diário de idiomas.',
        ctaText: 'Conhecer a Torrefação',
      },
      Japanese: {
        headline: '本場イタリアの淹れたてエスプレッソをご自宅で',
        description: 'トリノ直送の本格焙煎コーヒー豆。毎日の語学学習のお供にどうぞ。',
        ctaText: '焙煎所を見る',
      },
    },
  },
  {
    id: 'ad-linguajourneys-immersion',
    brand: 'LinguaJourneys Homestays',
    category: 'Cultural Homestays & Travel',
    headlineEn: 'Live with friendly local families abroad',
    descriptionEn: 'Immersive cultural homestays in Florence, Valencia, and Kyoto. Speak and practice in real life.',
    ctaTextEn: 'View Homestays',
    link: 'https://example.com/homestays',
    icon: 'plane',
    translations: {
      Italian: {
        headline: 'Vivi con accoglienti famiglie locali all\'estero',
        description: 'Soggiorni linguistici a Firenze, Roma e Bologna. Parla e fai pratica ogni giorno nella vita reale.',
        ctaText: 'Vedi i Soggiorni',
      },
      Spanish: {
        headline: 'Vive con familias locales acogedoras en el extranjero',
        description: 'Inmersión cultural en Valencia, Sevilla y Madrid. Habla y practica español en situaciones de la vida real.',
        ctaText: 'Ver Familias de Acogida',
      },
      French: {
        headline: 'Séjournez chez des familles locales chaleureuses',
        description: 'Immersion culturelle complète à Lyon, Nice et Paris. Pratiquez la langue au quotidien en toute confiance.',
        ctaText: 'Voir les séjours',
      },
      German: {
        headline: 'Wohnen Sie bei gastfreundlichen Familien im Ausland',
        description: 'Kulturelle Sprachreisen nach Berlin, Wien und München. Sprechen und üben Sie täglich im echten Alltag.',
        ctaText: 'Gastfamilien ansehen',
      },
      Portuguese: {
        headline: 'Viva com famílias locais acolhedoras no exterior',
        description: 'Imersão cultural em Lisboa, Porto e Coimbra. Fale e pratique no seu dia a dia com nativos.',
        ctaText: 'Ver Estadias',
      },
      Japanese: {
        headline: '現地の温かいホストファミリーと暮らす海外生活',
        description: 'フィレンツェ、バレンシア、パリでの文化ホームステイ。日常会話で自然に上達できます。',
        ctaText: 'ホームステイを見る',
      },
    },
  },
  {
    id: 'ad-soundpro-earbuds',
    brand: 'AcuTone Accent Earbuds',
    category: 'Audio Gear & Pronunciation',
    headlineEn: 'Hear every phonetic nuance with crystal clarity',
    descriptionEn: 'Noise-cancelling audio tuned specifically for spoken accents, rolling R’s, and foreign vowels.',
    ctaTextEn: 'Check Sound Quality',
    link: 'https://example.com/earbuds',
    icon: 'headphones',
    translations: {
      Italian: {
        headline: 'Ascolta ogni sfumatura fonetica con estrema chiarezza',
        description: 'Cancellazione del rumore calibrata appositamente per accenti, consonanti e vocali aperte o chiuse.',
        ctaText: 'Scopri la Qualità Audio',
      },
      Spanish: {
        headline: 'Escucha cada matiz fonético con absoluta nitidez',
        description: 'Cancelación de ruido calibrada para apreciar la pronunciación, la erre y los acentos regionales.',
        ctaText: 'Ver Detalles de Audio',
      },
      French: {
        headline: 'Entendez chaque nuance phonétique avec une clarté absolue',
        description: 'Réduction de bruit spécialement calibrée pour distinguer les voyelles nasales et l\'accent tonique.',
        ctaText: 'Découvrir la clarté',
      },
      German: {
        headline: 'Hören Sie jede Lautnuance mit kristallklarer Präzision',
        description: 'Geräuschunterdrückung speziell abgestimmt auf Akzente, Umlaute und feinste Sprachnuancen.',
        ctaText: 'Klangqualität testen',
      },
      Portuguese: {
        headline: 'Ouça cada nuance fonética com clareza cristalina',
        description: 'Cancelamento de ruído ajustado para perceber sons nasais, vogais e cadência do idioma.',
        ctaText: 'Conhecer os Fones',
      },
      Japanese: {
        headline: '外国語の細やかな発音やアクセントもクリアに聴き取る',
        description: '語学学習のためにチューニングされたノイズキャンセリング。リスニング力向上に最適。',
        ctaText: '音質をチェック',
      },
    },
  },
];
