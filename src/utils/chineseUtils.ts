// Chinese Language Utilities for Text Segmentation, Exercise Generation, and Word Splitting

export interface ChineseSegment {
  text: string;
  isWord: boolean;
}

// Fallback common Chinese words across various domains (HSK 1-4) for authentic distractors
export const CHINESE_DISTRACTORS_FALLBACK: string[] = [
  '朋友', '时间', '地方', '文化', '生活', '世界', '发现', '学习', 
  '准备', '经常', '喜欢', '旅行', '工作', '音乐', '城市', '美丽', 
  '历史', '故事', '今天', '明天', '希望', '快乐', '健康', '帮助',
  '感觉', '开始', '以后', '以前', '重要', '特别', '清楚', '自然',
  '简单', '丰富', '安静', '热情', '努力', '进步', '成功', '选择'
];

/**
 * Checks whether the given language name or text is Chinese.
 */
export function isChinese(targetLang?: string, text?: string): boolean {
  if (targetLang) {
    const l = targetLang.toLowerCase();
    if (l.includes('chinese') || l.includes('mandarin') || l.includes('cantonese') || l.includes('中文') || l.includes('汉语') || l.includes('普通话')) {
      return true;
    }
  }
  if (text) {
    return /[\u4e00-\u9fa5]/.test(text);
  }
  return false;
}

/**
 * Segments Chinese text into grammatical words and punctuation using Intl.Segmenter
 * with a reliable regex fallback for maximum cross-browser compatibility.
 */
export function segmentChinese(text: string): ChineseSegment[] {
  if (!text) return [];

  // Modern browser & Node standard API: Intl.Segmenter
  if (typeof Intl !== 'undefined' && (Intl as unknown as { Segmenter?: unknown }).Segmenter) {
    try {
      const segmenter = new (Intl as unknown as { Segmenter: new (lang: string, opts: { granularity: string }) => { segment: (t: string) => Iterable<{ segment: string; isWordLike?: boolean }> } }).Segmenter('zh', { granularity: 'word' });
      const results = Array.from(segmenter.segment(text));
      return results.map((r) => ({
        text: r.segment,
        // Mark as a word if it's word-like and contains Chinese characters
        isWord: Boolean(r.isWordLike && /[\u4e00-\u9fa5]/.test(r.segment)),
      }));
    } catch {
      // Fallback if Segmenter throws an error
    }
  }

  // Fallback: Segment by Chinese character clusters and non-Chinese punctuation
  const segments: ChineseSegment[] = [];
  const regex = /([\u4e00-\u9fa5]+|[^\u4e00-\u9fa5]+)/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const str = match[0];
    if (/[\u4e00-\u9fa5]/.test(str)) {
      // Split into 2-character words or 1-character words
      for (let i = 0; i < str.length; ) {
        const remaining = str.length - i;
        const take = (remaining === 3) ? 3 : (remaining >= 2 ? 2 : 1);
        segments.push({
          text: str.slice(i, i + take),
          isWord: true,
        });
        i += take;
      }
    } else {
      segments.push({
        text: str,
        isWord: false,
      });
    }
  }

  return segments;
}

/**
 * Extracts unique Chinese vocabulary words from a story text.
 */
export function extractChineseStoryWords(text: string): string[] {
  const segments = segmentChinese(text);
  const words = segments
    .filter((s) => s.isWord && s.text.length >= 2 && /^[\u4e00-\u9fa5]+$/.test(s.text))
    .map((s) => s.text);
  return Array.from(new Set(words));
}
