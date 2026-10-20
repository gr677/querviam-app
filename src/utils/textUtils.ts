/**
 * Utility functions for text processing, tokenization, and linguistic formatting.
 * Supports standard whitespace languages as well as CJK (Chinese, Japanese) word and character segmentation
 * using the native browser Intl.Segmenter API and offline Pinyin generation.
 */
import { pinyin } from 'pinyin-pro';

export interface TokenItem {
  raw: string;
  lead: string;
  core: string;
  trail: string;
  isWord: boolean;
  pinyin?: string;
}

export type CjkGranularity = 'word' | 'character';

/**
 * Checks if the text contains Chinese/Japanese characters or if the language is CJK.
 */
export function isCjkText(text?: string, lang?: string): boolean {
  if (lang && /chinese|mandarin|cantonese|japanese|zh|ja/i.test(lang)) return true;
  return /[\u4e00-\u9fa5\u3040-\u30ff\u3400-\u4dbf]/.test(text || '');
}

/**
 * Returns the pinyin representation with tone marks for Chinese text.
 */
export function getWordPinyin(text: string): string {
  if (!text || !/[\u4e00-\u9fa5]/.test(text)) return '';
  try {
    return pinyin(text, { toneType: 'symbol' });
  } catch {
    return '';
  }
}

/**
 * Splits a word token into leading punctuation, core word, and trailing punctuation.
 * Preserves internal apostrophes and hyphens (e.g. l'autunno, dell'anno, c'est, don't).
 */
export function splitWordPunctuation(rawWord: string): { lead: string; core: string; trail: string } {
  if (!rawWord) return { lead: '', core: '', trail: '' };

  const match = rawWord.match(/^([^\p{L}\p{N}]*)([\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*)?([^\p{L}\p{N}]*)$/u);

  if (!match) {
    return { lead: '', core: rawWord, trail: '' };
  }

  return {
    lead: match[1] || '',
    core: match[2] || '',
    trail: match[3] || '',
  };
}

const CJK_PUNCTUATION_REGEX = /[，。！？、“”‘’：；《》（）…—\s\.,;:!?\(\)\[\]"']/;

/**
 * Segments a sentence into pure linguistic units (words or individual characters).
 * For CJK (Chinese, Japanese):
 *  - 'word' (default): Uses Intl.Segmenter to naturally segment into multi-character words (e.g. "今天", "天气", "非常", "好").
 *  - 'character': Segments into individual Hanzi/Kanji characters (e.g. "今", "天", "天", "气", "非", "常", "好").
 * For Western languages: splits on whitespace and cleans punctuation.
 */
export function segmentWords(
  text: string,
  lang?: string,
  granularity: CjkGranularity = 'word'
): string[] {
  if (!text) return [];
  const trimmed = text.trim();
  if (!trimmed) return [];

  if (isCjkText(trimmed, lang)) {
    // If learner chose Character mode for Chinese: segment every individual Hanzi
    if (granularity === 'character') {
      return Array.from(trimmed).filter(
        (char) => !CJK_PUNCTUATION_REGEX.test(char) && /[\u4e00-\u9fa5\u3040-\u30ff\w]/.test(char)
      );
    }

    // Word mode: use Intl.Segmenter
    if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
      try {
        const locale = lang && /ja/i.test(lang) ? 'ja-JP' : 'zh-CN';
        // @ts-ignore
        const segmenter = new Intl.Segmenter(locale, { granularity: 'word' });
        // @ts-ignore
        const segments = Array.from(segmenter.segment(trimmed));
        const words: string[] = [];
        for (const seg of segments as any[]) {
          if (seg.isWordLike && !CJK_PUNCTUATION_REGEX.test(seg.segment)) {
            const clean = seg.segment.trim();
            if (clean.length > 0) words.push(clean);
          }
        }
        if (words.length > 0) return words;
      } catch (err) {
        console.warn('Intl.Segmenter fallback in segmentWords:', err);
      }
    }

    // Fallback: character-by-character
    return Array.from(trimmed).filter(
      (char) => !CJK_PUNCTUATION_REGEX.test(char) && /[\u4e00-\u9fa5\u3040-\u30ff\w]/.test(char)
    );
  }

  // Western / European languages (whitespace-separated)
  return trimmed
    .split(/\s+/)
    .map((w) => splitWordPunctuation(w).core || w)
    .filter((w) => w.length > 0);
}

/**
 * Tokenizes a sentence into displayable token chunks with punctuation preservation.
 * Crucial for the Reader, Cloze, and Multiple Choice modes:
 * In Chinese/Japanese: Each word (e.g. "今天", "天气") or character is an individual interactive token,
 * allowing learners to click, hear pronunciation, view pinyin & etymology, and solve exercises,
 * while punctuation (e.g. "，", "。") is rendered naturally without distorting text flow.
 */
export function tokenizeSentence(
  text: string,
  lang?: string,
  granularity: CjkGranularity = 'word'
): TokenItem[] {
  if (!text) return [];
  const trimmed = text.trim();
  if (!trimmed) return [];

  if (isCjkText(trimmed, lang)) {
    // Character mode: each character is an interactive token
    if (granularity === 'character') {
      return Array.from(trimmed).map((char) => {
        const isWord = /[\u4e00-\u9fa5\u3040-\u30ff\w]/.test(char) && !CJK_PUNCTUATION_REGEX.test(char);
        const core = isWord ? char : '';
        return {
          raw: char,
          lead: '',
          core,
          trail: !isWord ? char : '',
          isWord,
          pinyin: isWord ? getWordPinyin(core) : undefined,
        };
      });
    }

    // Word mode: native Intl.Segmenter
    if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
      try {
        const locale = lang && /ja/i.test(lang) ? 'ja-JP' : 'zh-CN';
        // @ts-ignore
        const segmenter = new Intl.Segmenter(locale, { granularity: 'word' });
        // @ts-ignore
        const segments = Array.from(segmenter.segment(trimmed));
        return (segments as any[]).map((seg) => {
          const raw = seg.segment;
          const isWord = Boolean(seg.isWordLike && !CJK_PUNCTUATION_REGEX.test(raw));
          const core = isWord ? raw : '';
          return {
            raw,
            lead: '',
            core,
            trail: !isWord ? raw : '',
            isWord,
            pinyin: isWord ? getWordPinyin(core) : undefined,
          };
        });
      } catch (err) {
        console.warn('Intl.Segmenter fallback in tokenizeSentence:', err);
      }
    }

    // Fallback: character-by-character
    return Array.from(trimmed).map((char) => {
      const isWord = /[\u4e00-\u9fa5\u3040-\u30ff\w]/.test(char) && !CJK_PUNCTUATION_REGEX.test(char);
      const core = isWord ? char : '';
      return {
        raw: char,
        lead: '',
        core,
        trail: !isWord ? char : '',
        isWord,
        pinyin: isWord ? getWordPinyin(core) : undefined,
      };
    });
  }

  // Western / European languages: space-delimited
  return text.split(' ').map((raw) => {
    const { lead, core, trail } = splitWordPunctuation(raw);
    return {
      raw,
      lead,
      core,
      trail,
      isWord: Boolean(core && core.length > 0),
    };
  });
}
