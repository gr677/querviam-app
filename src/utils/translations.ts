import {
  ENGLISH_TRANSLATIONS,
  TourStepText,
  TranslationDictionary,
  RTL_LANGUAGES,
  isRtlLanguage,
  getHtmlLangCode,
} from './i18nTypes';
import { EU_WEST_LOCALES } from './locales/euWest';
import { EU_EAST_GREEK_LOCALES } from './locales/euEastGreek';
import { EU_NORDIC_CENTRAL_LOCALES } from './locales/euNordicCentral';
import { ASIAN_LOCALES } from './locales/asian';
import { SOUTH_ASIA_MIDDLE_EAST_LOCALES } from './locales/southAsiaMiddleEast';

export type { TourStepText, TranslationDictionary };
export { ENGLISH_TRANSLATIONS, RTL_LANGUAGES, isRtlLanguage, getHtmlLangCode };

export const TRANSLATION_MAP: Record<string, Partial<TranslationDictionary>> = {
  english: ENGLISH_TRANSLATIONS,
  french: EU_WEST_LOCALES.French,
  spanish: EU_WEST_LOCALES.Spanish,
  portuguese: EU_WEST_LOCALES.Portuguese,
  italian: EU_WEST_LOCALES.Italian,
  german: EU_WEST_LOCALES.German,
  dutch: EU_WEST_LOCALES.Dutch,
  greek: EU_EAST_GREEK_LOCALES.Greek,
  russian: EU_EAST_GREEK_LOCALES.Russian,
  ukrainian: EU_EAST_GREEK_LOCALES.Ukrainian,
  norwegian: EU_NORDIC_CENTRAL_LOCALES.Norwegian,
  danish: EU_NORDIC_CENTRAL_LOCALES.Danish,
  swedish: EU_NORDIC_CENTRAL_LOCALES.Swedish,
  finnish: EU_NORDIC_CENTRAL_LOCALES.Finnish,
  polish: EU_NORDIC_CENTRAL_LOCALES.Polish,
  czech: EU_NORDIC_CENTRAL_LOCALES.Czech,
  hungarian: EU_NORDIC_CENTRAL_LOCALES.Hungarian,
  romanian: EU_NORDIC_CENTRAL_LOCALES.Romanian,
  'chinese (mandarin)': ASIAN_LOCALES['Chinese (Mandarin)'],
  chinese: ASIAN_LOCALES['Chinese (Mandarin)'],
  japanese: ASIAN_LOCALES.Japanese,
  korean: ASIAN_LOCALES.Korean,
  vietnamese: ASIAN_LOCALES.Vietnamese,
  thai: ASIAN_LOCALES.Thai,
  indonesian: ASIAN_LOCALES.Indonesian,
  filipino: ASIAN_LOCALES.Filipino,
  arabic: SOUTH_ASIA_MIDDLE_EAST_LOCALES.Arabic,
  hebrew: SOUTH_ASIA_MIDDLE_EAST_LOCALES.Hebrew,
  urdu: SOUTH_ASIA_MIDDLE_EAST_LOCALES.Urdu,
  hindi: SOUTH_ASIA_MIDDLE_EAST_LOCALES.Hindi,
  bengali: SOUTH_ASIA_MIDDLE_EAST_LOCALES.Bengali,
  marathi: SOUTH_ASIA_MIDDLE_EAST_LOCALES.Marathi,
  tamil: SOUTH_ASIA_MIDDLE_EAST_LOCALES.Tamil,
  telugu: SOUTH_ASIA_MIDDLE_EAST_LOCALES.Telugu,
  turkish: SOUTH_ASIA_MIDDLE_EAST_LOCALES.Turkish,
};

export function getT(baseLang: string = 'English'): TranslationDictionary {
  const norm = (baseLang || 'English').toLowerCase().trim();
  const locale =
    TRANSLATION_MAP[norm] ||
    (norm.includes('chinese') || norm.includes('mandarin') ? TRANSLATION_MAP['chinese (mandarin)'] : undefined);

  if (!locale || locale === ENGLISH_TRANSLATIONS) {
    return ENGLISH_TRANSLATIONS;
  }

  return {
    ...ENGLISH_TRANSLATIONS,
    ...locale,
  };
}
