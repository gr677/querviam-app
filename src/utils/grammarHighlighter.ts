import { VerbItem } from '../types';
import { splitWordPunctuation } from './textUtils';

export type GrammarCategory = 'article' | 'verb' | 'preposition' | 'vocab';

const ARTICLES = new Set([
  // Italian
  'il', 'lo', 'la', 'l', 'i', 'gli', 'le', 'un', 'uno', 'una',
  // Spanish
  'el', 'los', 'las', 'unos', 'unas',
  // French
  'le', 'les', 'des', 'du', 'une',
  // German
  'der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einen', 'einem', 'einer',
  // Portuguese
  'o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas',
  // English
  'the', 'an'
]);

const PREPOSITIONS_CONNECTORS = new Set([
  // Italian
  'di', 'a', 'da', 'in', 'con', 'su', 'per', 'tra', 'fra',
  'del', 'dello', 'della', 'dei', 'degli', 'delle',
  'al', 'allo', 'alla', 'ai', 'agli', 'alle',
  'dal', 'dallo', 'dalla', 'dai', 'dagli', 'dalle',
  'nel', 'nello', 'nella', 'nei', 'negli', 'nelle',
  'sul', 'sullo', 'sulla', 'sui', 'sugli', 'sulle',
  'e', 'ed', 'ma', 'o', 'oppure', 'se', 'perché', 'come', 'quando', 'mentre', 'anche', 'non',
  // Spanish
  'de', 'en', 'por', 'para', 'sobre', 'entre', 'sin', 'hacia', 'hasta',
  'y', 'pero', 'si', 'porque', 'como', 'cuando',
  // French
  'dans', 'avec', 'pour', 'sur', 'sans', 'chez', 'vers',
  'et', 'ou', 'mais', 'si', 'comme', 'quand',
  // German
  'an', 'auf', 'für', 'mit', 'von', 'zu', 'bei', 'nach', 'aus', 'über', 'unter',
  'und', 'oder', 'aber', 'wenn', 'weil', 'dass',
  // Portuguese
  'do', 'da', 'dos', 'das', 'no', 'na', 'nos', 'nas',
  // English
  'at', 'by', 'from', 'of', 'and', 'but', 'because'
]);

const COMMON_AUXILIARY_VERBS = new Set([
  // Italian
  'è', 'sono', 'sei', 'siamo', 'siete', 'era', 'erano', 'stato', 'stata',
  'ha', 'ho', 'hai', 'abbiamo', 'avete', 'hanno', 'aveva', 'avuto',
  'va', 'vanno', 'andiamo', 'vai', 'vado', 'andato',
  'fa', 'fanno', 'fai', 'faccio', 'facciamo',
  'può', 'possono', 'posso', 'possiamo',
  'deve', 'devono', 'devo', 'dobbiamo',
  'vuole', 'vogliono', 'voglio', 'vogliamo',
  'dice', 'dicono', 'dico', 'diciamo',
  'viene', 'vengono', 'vengo', 'veniamo',
  // Spanish
  'es', 'son', 'somos', 'eres', 'soy', 'era', 'eran', 'sido',
  'hay', 'ha', 'han', 'hemos', 'he', 'había',
  'va', 'van', 'vamos', 'voy', 'ido',
  'tiene', 'tienen', 'tengo', 'tenemos',
  'hace', 'hacen', 'hago', 'hacemos',
  'puede', 'pueden', 'puedo', 'podemos',
  // French
  'est', 'sont', 'sommes', 'êtes', 'suis', 'était', 'été',
  'a', 'ont', 'avons', 'avez', 'ai', 'avait', 'eu',
  'va', 'vont', 'allons', 'vais', 'allé',
  // German
  'ist', 'sind', 'war', 'waren', 'gewesen',
  'hat', 'haben', 'hatte', 'hatten', 'gehabt',
  'wird', 'werden', 'wurde', 'worden',
  // English
  'is', 'am', 'are', 'was', 'were', 'been', 'being',
  'has', 'have', 'had', 'do', 'does', 'did', 'done',
  'can', 'could', 'will', 'would', 'should'
]);

export function classifyWordGrammar(
  word: string,
  sentenceVerbs?: VerbItem[]
): GrammarCategory {
  const clean = splitWordPunctuation(word).core.toLowerCase().trim();
  if (!clean) return 'vocab';

  // 1. Check against story sentence verbs metadata
  if (sentenceVerbs && sentenceVerbs.length > 0) {
    const isVerbMatch = sentenceVerbs.some((v) => {
      if (!v) return false;
      const inf = splitWordPunctuation(v.infinitive || '').core.toLowerCase();
      if (inf === clean) return true;
      // Check verb translation or conjugated tokens
      if (clean.length >= 3 && inf.length >= 3) {
        if (clean.startsWith(inf.slice(0, 3))) return true;
      }
      return false;
    });
    if (isVerbMatch) return 'verb';
  }

  // 2. Check common auxiliary & irregular verb forms
  if (COMMON_AUXILIARY_VERBS.has(clean)) {
    return 'verb';
  }

  // 3. Check articles & determiners
  if (ARTICLES.has(clean)) {
    return 'article';
  }

  // 4. Check prepositions & conjunctions
  if (PREPOSITIONS_CONNECTORS.has(clean)) {
    return 'preposition';
  }

  // 5. Default content word (noun, adjective, general vocabulary)
  return 'vocab';
}

export function getGrammarBadgeLabel(category: GrammarCategory): string {
  switch (category) {
    case 'article':
      return '🏷️ Article';
    case 'verb':
      return '⚡ Verb';
    case 'preposition':
      return '🔗 Preposition / Link';
    case 'vocab':
      return '🔤 Noun / Vocab';
  }
}

export function getGrammarStyle(category: GrammarCategory): string {
  switch (category) {
    case 'article':
      return 'bg-amber-100/90 text-amber-950 border-b-[3px] border-amber-500 font-bold px-1 py-0.5 rounded shadow-2xs';
    case 'verb':
      return 'bg-emerald-100/90 text-emerald-950 border-b-[3px] border-emerald-600 font-bold px-1 py-0.5 rounded shadow-2xs';
    case 'preposition':
      return 'bg-sky-100/90 text-sky-950 border-b-[3px] border-sky-500 font-bold px-1 py-0.5 rounded shadow-2xs';
    case 'vocab':
      return 'bg-purple-100/80 text-purple-950 border-b-[3px] border-purple-500 font-bold px-1 py-0.5 rounded shadow-2xs';
  }
}
