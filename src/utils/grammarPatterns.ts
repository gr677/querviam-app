import { VerbItem } from '../types';
import { splitWordPunctuation } from './textUtils';

export type GrammarPatternType = 'all' | 'verb' | 'noun' | 'adjective' | 'connector';

export interface GrammarPatternInfo {
  type: 'verb' | 'noun' | 'adjective' | 'connector' | 'other';
  label: string;
  tag: string;
  colorClass: string;
  badgeClass: string;
  borderClass: string;
  description: string;
  detail?: string;
}

// Italian Prepositions & Connectors
const ITALIAN_CONNECTORS = new Set([
  'di', 'a', 'da', 'in', 'con', 'su', 'per', 'tra', 'fra',
  'il', 'lo', 'la', 'i', 'gli', 'le', 'l\'', 'un', 'uno', 'una', 'un\'',
  'del', 'dello', 'della', 'dei', 'degli', 'delle',
  'al', 'allo', 'alla', 'ai', 'agli', 'alle',
  'dal', 'dallo', 'dalla', 'dai', 'dagli', 'dalle',
  'nel', 'nello', 'nella', 'nei', 'negli', 'nelle',
  'sul', 'sullo', 'sulla', 'sui', 'sugli', 'sulle',
  'e', 'ed', 'o', 'ma', 'però', 'tuttavia', 'quindi', 'dunque', 'perché', 'poiché',
  'se', 'quando', 'mentre', 'come', 'anche', 'neanche', 'neppure', 'proprio',
  'che', 'chi', 'cui', 'quale', 'quali',
  'io', 'tu', 'lui', 'lei', 'noi', 'voi', 'loro',
  'mi', 'ti', 'si', 'ci', 'vi', 'ne', 'lo', 'la', 'li', 'le', 'gli',
  'questo', 'questa', 'questi', 'queste', 'quello', 'quella', 'quelli', 'quelle', 'quel'
]);

// Italian common irregular & high-frequency verbs
const ITALIAN_VERBS = new Set([
  'è', 'sono', 'sei', 'siamo', 'siete', 'era', 'erano', 'eri', 'stato', 'stata', 'stati', 'state',
  'ho', 'hai', 'ha', 'abbiamo', 'avete', 'hanno', 'aveva', 'avevano', 'avuto',
  'fa', 'fanno', 'fai', 'facciamo', 'fate', 'faceva', 'fatto', 'fare',
  'va', 'vanno', 'vai', 'andiamo', 'andate', 'andava', 'andato', 'andare',
  'dice', 'dicono', 'dici', 'diciamo', 'dite', 'diceva', 'detto', 'dire',
  'può', 'possono', 'puoi', 'possiamo', 'potete', 'poteva', 'potuto', 'potere',
  'vuole', 'vogliono', 'vuoi', 'vogliamo', 'volete', 'voleva', 'voluto', 'volere',
  'sa', 'sanno', 'sai', 'sappiamo', 'sapete', 'sapeva', 'saputo', 'sapere',
  'deve', 'devono', 'devi', 'dobbiamo', 'dovete', 'doveva', 'dovuto', 'dovere',
  'sta', 'stanno', 'stai', 'stiamo', 'state', 'stava', 'stare',
  'vede', 'vedono', 'vedi', 'vediamo', 'vedete', 'vedeva', 'visto', 'vedere',
  'prende', 'prendono', 'prendi', 'prendiamo', 'prendete', 'preso', 'prendere',
  'viene', 'vengono', 'vieni', 'veniamo', 'venite', 'venuto', 'venire',
  'trova', 'trovano', 'trovi', 'troviamo', 'trovate', 'trovato', 'trovare',
  'arriva', 'arrivano', 'arrivi', 'arriviamo', 'arrivato', 'arrivare',
  'cammina', 'camminano', 'cammini', 'camminiamo', 'camminato', 'camminare',
  'rende', 'rendono', 'rendi', 'rendiamo', 'reso', 'rendere',
  'cresce', 'crescono', 'cresci', 'cresciuto', 'crescere',
  'mangia', 'mangiano', 'mangiamo', 'mangiato', 'mangiare',
  'beve', 'bevono', 'beviamo', 'bevuto', 'bere',
  'parla', 'parlano', 'parli', 'parliamo', 'parlato', 'parlare',
  'sente', 'sentono', 'senti', 'sentiamo', 'sentito', 'sentire',
  'apre', 'aprono', 'aperto', 'aprire', 'chiude', 'chiudono', 'chiuso', 'chiudere'
]);

// Spanish Prepositions & Connectors
const SPANISH_CONNECTORS = new Set([
  'de', 'a', 'en', 'con', 'por', 'para', 'sin', 'sobre', 'entre', 'hacia', 'hasta', 'desde',
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
  'al', 'del',
  'y', 'e', 'o', 'u', 'pero', 'mas', 'sino', 'porque', 'pues', 'ya', 'que',
  'si', 'cuando', 'mientras', 'como', 'donde', 'aunque', 'también', 'tampoco',
  'este', 'esta', 'estos', 'estas', 'ese', 'esa', 'esos', 'esas', 'aquel', 'aquella',
  'yo', 'tú', 'él', 'ella', 'usted', 'nosotros', 'vosotros', 'ellos', 'ellas', 'ustedes',
  'me', 'te', 'se', 'nos', 'os', 'le', 'les', 'lo', 'la', 'los', 'las', 'mí', 'ti'
]);

// Spanish common verbs
const SPANISH_VERBS = new Set([
  'es', 'son', 'eres', 'somos', 'sois', 'era', 'eran', 'sido', 'ser',
  'está', 'están', 'estás', 'estamos', 'estáis', 'estaba', 'estado', 'estar',
  'tiene', 'tienen', 'tienes', 'tenemos', 'tenéis', 'tenía', 'tenido', 'tener',
  'hace', 'hacen', 'haces', 'hacemos', 'hacéis', 'hacía', 'hecho', 'hacer',
  'va', 'van', 'vas', 'vamos', 'vais', 'iba', 'ido', 'ir',
  'dice', 'dicen', 'dices', 'decimos', 'decía', 'dicho', 'decir',
  'puede', 'pueden', 'puedes', 'podemos', 'podía', 'podido', 'poder',
  'quiere', 'quieren', 'quieres', 'queremos', 'quería', 'querido', 'querer',
  'sabe', 'saben', 'sabes', 'sabemos', 'sabía', 'sabido', 'saber',
  've', 'ven', 'ves', 'vemos', 'veía', 'visto', 'ver',
  'da', 'dan', 'das', 'damos', 'daba', 'dado', 'dar',
  'llega', 'llegan', 'llegas', 'llegamos', 'llegado', 'llegar',
  'pasa', 'pasan', 'pasas', 'pasamos', 'pasado', 'pasar',
  'habla', 'hablan', 'hablas', 'hablamos', 'hablado', 'hablar'
]);

// French Connectors & Verbs
const FRENCH_CONNECTORS = new Set([
  'de', 'à', 'en', 'avec', 'pour', 'par', 'dans', 'sur', 'sous', 'vers', 'chez', 'sans',
  'le', 'la', 'les', 'l\'', 'un', 'une', 'des', 'du', 'au', 'aux',
  'et', 'ou', 'mais', 'donc', 'or', 'ni', 'car', 'parce', 'que', 'si', 'quand', 'comme',
  'je', 'tu', 'il', 'elle', 'on', 'nous', 'vous', 'ils', 'elles',
  'me', 'te', 'se', 'lui', 'leur', 'y', 'en', 'ce', 'cette', 'ces'
]);

const FRENCH_VERBS = new Set([
  'est', 'sont', 'suis', 'es', 'sommes', 'êtes', 'été', 'être',
  'a', 'ont', 'ai', 'as', 'avons', 'avez', 'eu', 'avoir',
  'fait', 'font', 'fais', 'faisons', 'faites', 'faire',
  'va', 'vont', 'vais', 'vas', 'allons', 'allez', 'aller',
  'dit', 'disent', 'dire', 'peut', 'peuvent', 'pouvoir',
  'veut', 'veulent', 'vouloir', 'sait', 'savent', 'savoir'
]);

// German Connectors & Verbs
const GERMAN_CONNECTORS = new Set([
  'in', 'an', 'auf', 'für', 'mit', 'von', 'zu', 'bei', 'nach', 'über', 'unter', 'durch', 'um', 'aus',
  'der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einen', 'einem', 'einer', 'eines',
  'und', 'oder', 'aber', 'denn', 'doch', 'weil', 'wenn', 'dass', 'ob', 'als', 'wie',
  'ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'mich', 'dich', 'sich', 'uns', 'euch', 'ihm', 'ihnen'
]);

const GERMAN_VERBS = new Set([
  'ist', 'sind', 'bin', 'bist', 'seid', 'war', 'waren', 'gewesen', 'sein',
  'hat', 'haben', 'habe', 'hast', 'habt', 'hatte', 'gehabt',
  'wird', 'werden', 'wurde', 'worden',
  'kann', 'können', 'muss', 'müssen', 'will', 'wollen', 'soll', 'sollen',
  'geht', 'gehen', 'ging', 'gegangen', 'macht', 'machen', 'gemacht'
]);

// Hindi Connectors & Verbs
const HINDI_CONNECTORS = new Set([
  'में', 'पर', 'से', 'को', 'के', 'की', 'का', 'लिए', 'साथ', 'तक',
  'और', 'या', 'लेकिन', 'मगर', 'किंतु', 'क्योंकि', 'इसलिए', 'ताकि', 'अगर', 'यदि', 'तो',
  'यह', 'वह', 'ये', 'वे', 'मैं', 'तू', 'तुम', 'आप', 'हम', 'मुझे', 'तुझे', 'आपको', 'हमें', 'उसे', 'उन्हें',
  'जो', 'जिस', 'जिन', 'कौन', 'क्या', 'कब', 'कहाँ', 'कैसे'
]);

const HINDI_VERBS = new Set([
  'है', 'हैं', 'हूँ', 'हो', 'था', 'थी', 'थे', 'थीं',
  'रहा', 'रही', 'रहे', 'हुआ', 'हुई', 'हुए', 'होगा', 'होगी', 'होंगे',
  'करना', 'करता', 'करती', 'करते', 'किया', 'की', 'किए',
  'जाना', 'जाता', 'जाती', 'जाते', 'गया', 'गई', 'गए',
  'आना', 'आता', 'आती', 'आते', 'आया', 'आई', 'आए',
  'देना', 'देता', 'देती', 'देते', 'दिया', 'दी', 'दिए',
  'लेना', 'लेता', 'लेती', 'लेते', 'लिया', 'ली', 'लिए',
  'बोलना', 'कहना', 'देखना', 'सुनना', 'खाना', 'पीना', 'चलना'
]);

export function analyzeWordGrammar(
  rawWord: string,
  targetLang: string = 'Italian',
  knownVerbs: VerbItem[] = []
): GrammarPatternInfo {
  const { core } = splitWordPunctuation(rawWord);
  const clean = (core || rawWord).toLowerCase().trim();

  if (!clean || clean.length <= 1) {
    return {
      type: 'other',
      label: 'Other',
      tag: '·',
      colorClass: 'text-slate-700',
      badgeClass: 'bg-slate-100 text-slate-600',
      borderClass: 'border-transparent',
      description: 'Punctuation or symbol',
    };
  }

  // 1. Cross-reference with story verbs list if provided
  if (knownVerbs.length > 0) {
    const matchedVerb = knownVerbs.find((v) => {
      if (v.infinitive.toLowerCase() === clean) return true;
      if (v.conjugations) {
        for (const tenseKey in v.conjugations) {
          const forms = v.conjugations[tenseKey];
          if (Array.isArray(forms)) {
            if (forms.some((f) => f.form.toLowerCase() === clean || f.form.toLowerCase().includes(clean))) {
              return true;
            }
          }
        }
      }
      return false;
    });

    if (matchedVerb) {
      return {
        type: 'verb',
        label: 'Verbo (Verb)',
        tag: 'V',
        colorClass: 'bg-blue-50 text-blue-900 border-b-2 border-blue-500 font-bold',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
        borderClass: 'border-blue-500',
        description: `Action verb: "${matchedVerb.infinitive}" (${matchedVerb.translation || 'verb'})`,
        detail: matchedVerb.infinitive,
      };
    }
  }

  // 2. Language-specific grammar pattern checks
  const langKey = targetLang.toLowerCase();

  // ITALIAN
  if (langKey.includes('ital')) {
    if (ITALIAN_CONNECTORS.has(clean)) {
      return {
        type: 'connector',
        label: 'Connettore / Prep. (Connector)',
        tag: 'C',
        colorClass: 'bg-purple-50 text-purple-900 border-b-2 border-purple-400 font-medium',
        badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
        borderClass: 'border-purple-400',
        description: 'Preposition, article, pronoun or connector',
      };
    }

    if (ITALIAN_VERBS.has(clean) || /(are|ere|ire|ato|uto|ito|ando|endo|rò|rà|ranno|vano|vamo)$/i.test(clean)) {
      return {
        type: 'verb',
        label: 'Verbo (Verb)',
        tag: 'V',
        colorClass: 'bg-blue-50 text-blue-900 border-b-2 border-blue-500 font-bold',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
        borderClass: 'border-blue-500',
        description: 'Action, state or predicate verb',
      };
    }

    // Italian Adjectives
    if (/(oso|osa|osi|ose|ivo|iva|ivi|ive|abile|ibile|ale|ali|esco|esca|eschi|esche)$/i.test(clean) ||
        ['bello', 'bella', 'belli', 'belle', 'buono', 'buona', 'buoni', 'buone', 'grande', 'grandi', 'piccolo', 'piccola', 'piccoli', 'piccole', 'nuovo', 'nuova', 'nuovi', 'nuove', 'splendido', 'splendida', 'magica', 'dorati'].includes(clean)) {
      return {
        type: 'adjective',
        label: 'Aggettivo (Adjective)',
        tag: 'A',
        colorClass: 'bg-amber-50 text-amber-950 border-b-2 border-amber-500 font-medium',
        badgeClass: 'bg-amber-100 text-amber-900 border-amber-200',
        borderClass: 'border-amber-500',
        description: 'Qualifies or describes a noun',
      };
    }

    // Italian Nouns (endings or common capitalized words)
    if (/(zione|zioni|sione|sioni|mento|menti|tore|trice|ista|isti|iste|ezza|ezze|ismo|ismi|anza|enze)$/i.test(clean) ||
        (clean.length > 3 && /(o|a|e|i)$/i.test(clean))) {
      return {
        type: 'noun',
        label: 'Nome / Sostantivo (Noun)',
        tag: 'N',
        colorClass: 'bg-emerald-50 text-emerald-950 border-b-2 border-emerald-500 font-medium',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        borderClass: 'border-emerald-500',
        description: 'Person, place, object or abstract concept',
      };
    }
  }

  // SPANISH
  if (langKey.includes('span') || langKey.includes('espa')) {
    if (SPANISH_CONNECTORS.has(clean)) {
      return {
        type: 'connector',
        label: 'Conector / Prep. (Connector)',
        tag: 'C',
        colorClass: 'bg-purple-50 text-purple-900 border-b-2 border-purple-400 font-medium',
        badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
        borderClass: 'border-purple-400',
        description: 'Preposition, article, pronoun or connector',
      };
    }

    if (SPANISH_VERBS.has(clean) || /(ar|er|ir|ado|ido|ando|iendo|aba|aban|ía|ían|rá|rán|ría)$/i.test(clean)) {
      return {
        type: 'verb',
        label: 'Verbo (Verb)',
        tag: 'V',
        colorClass: 'bg-blue-50 text-blue-900 border-b-2 border-blue-500 font-bold',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
        borderClass: 'border-blue-500',
        description: 'Action, state or predicate verb',
      };
    }

    if (/(oso|osa|osos|osas|ivo|iva|ivos|ivas|able|ible|ante|ente|al|ales)$/i.test(clean) ||
        ['bueno', 'buena', 'buenos', 'buenas', 'malo', 'mala', 'grande', 'grandes', 'pequeño', 'pequeña', 'hermoso', 'nuevo'].includes(clean)) {
      return {
        type: 'adjective',
        label: 'Adjetivo (Adjective)',
        tag: 'A',
        colorClass: 'bg-amber-50 text-amber-950 border-b-2 border-amber-500 font-medium',
        badgeClass: 'bg-amber-100 text-amber-900 border-amber-200',
        borderClass: 'border-amber-500',
        description: 'Qualifies or describes a noun',
      };
    }

    if (/(ción|ciones|sión|siones|miento|mientos|dad|dades|tad|tades|eza|ez|ismo|ista)$/i.test(clean) ||
        (clean.length > 3 && /(o|a|os|as)$/i.test(clean))) {
      return {
        type: 'noun',
        label: 'Sustantivo (Noun)',
        tag: 'N',
        colorClass: 'bg-emerald-50 text-emerald-950 border-b-2 border-emerald-500 font-medium',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        borderClass: 'border-emerald-500',
        description: 'Person, place, object or concept',
      };
    }
  }

  // FRENCH
  if (langKey.includes('fren') || langKey.includes('fran')) {
    if (FRENCH_CONNECTORS.has(clean)) {
      return {
        type: 'connector',
        label: 'Connecteur / Prép. (Connector)',
        tag: 'C',
        colorClass: 'bg-purple-50 text-purple-900 border-b-2 border-purple-400 font-medium',
        badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
        borderClass: 'border-purple-400',
        description: 'Preposition, article, pronoun or connector',
      };
    }
    if (FRENCH_VERBS.has(clean) || /(er|ir|re|ant|é|ée|és|ées|ait|aient|ons|ez)$/i.test(clean)) {
      return {
        type: 'verb',
        label: 'Verbe (Verb)',
        tag: 'V',
        colorClass: 'bg-blue-50 text-blue-900 border-b-2 border-blue-500 font-bold',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
        borderClass: 'border-blue-500',
        description: 'Action verb or state',
      };
    }
  }

  // GERMAN
  if (langKey.includes('germ') || langKey.includes('deut')) {
    if (GERMAN_CONNECTORS.has(clean)) {
      return {
        type: 'connector',
        label: 'Konnektor / Präp. (Connector)',
        tag: 'C',
        colorClass: 'bg-purple-50 text-purple-900 border-b-2 border-purple-400 font-medium',
        badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
        borderClass: 'border-purple-400',
        description: 'Preposition, article, pronoun or connector',
      };
    }
    if (GERMAN_VERBS.has(clean) || /(en|et|st|te|ten|t)$/i.test(clean)) {
      return {
        type: 'verb',
        label: 'Verb',
        tag: 'V',
        colorClass: 'bg-blue-50 text-blue-900 border-b-2 border-blue-500 font-bold',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
        borderClass: 'border-blue-500',
        description: 'Action verb or state',
      };
    }
    // Capitalized in German = Noun
    if (core && /^[A-ZÄÖÜ]/.test(core)) {
      return {
        type: 'noun',
        label: 'Nomen / Substantiv (Noun)',
        tag: 'N',
        colorClass: 'bg-emerald-50 text-emerald-950 border-b-2 border-emerald-500 font-medium',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        borderClass: 'border-emerald-500',
        description: 'Noun (Substantiv)',
      };
    }
  }

  // HINDI
  if (langKey.includes('hind') || langKey.includes('hi')) {
    if (HINDI_CONNECTORS.has(clean)) {
      return {
        type: 'connector',
        label: 'संयोजक / कारक (Connector)',
        tag: 'C',
        colorClass: 'bg-purple-50 text-purple-900 border-b-2 border-purple-400 font-medium',
        badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
        borderClass: 'border-purple-400',
        description: 'Postposition or grammatical connector',
      };
    }
    if (HINDI_VERBS.has(clean) || /(ता|ती|ते|ना|या|यी|ये|गा|गी|गे)$/i.test(clean)) {
      return {
        type: 'verb',
        label: 'क्रिया (Verb)',
        tag: 'V',
        colorClass: 'bg-blue-50 text-blue-900 border-b-2 border-blue-500 font-bold',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
        borderClass: 'border-blue-500',
        description: 'Action verb or auxiliary',
      };
    }
  }

  // Default fallback for general nouns vs adjectives
  if (clean.length > 4) {
    return {
      type: 'noun',
      label: 'Sostantivo / Nome (Noun)',
      tag: 'N',
      colorClass: 'bg-emerald-50/70 text-emerald-950 border-b border-emerald-400 font-medium',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      borderClass: 'border-emerald-400',
      description: 'Lexical entity or subject',
    };
  }

  return {
    type: 'other',
    label: 'Parola (Word)',
    tag: '·',
    colorClass: 'text-slate-800',
    badgeClass: 'bg-slate-100 text-slate-700',
    borderClass: 'border-transparent',
    description: 'General vocabulary',
  };
}

export const GRAMMAR_PATTERNS_CONFIG = [
  { id: 'all', label: 'All Patterns', icon: '🎨', color: 'bg-slate-800 text-white' },
  { id: 'verb', label: 'Verbs (Verbi)', icon: '🟦', color: 'bg-blue-100 text-blue-900 border-blue-300' },
  { id: 'noun', label: 'Nouns (Nomi)', icon: '🟩', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  { id: 'adjective', label: 'Adjectives (Aggettivi)', icon: '🟧', color: 'bg-amber-100 text-amber-950 border-amber-300' },
  { id: 'connector', label: 'Connectors & Prep (Preposizioni)', icon: '🟪', color: 'bg-purple-100 text-purple-900 border-purple-300' },
] as const;
