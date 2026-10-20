import { StoryData } from '../types';

/**
 * Encodes a string into URL-safe base64 format without +, / or trailing =
 */
function toUrlSafeBase64(str: string): string {
  const utf8Bytes = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
    String.fromCharCode(parseInt(p1, 16))
  );
  return btoa(utf8Bytes)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Decodes URL-safe or standard base64 into a UTF-8 string
 */
function fromUrlSafeBase64(b64: string): string {
  let str = b64.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4 !== 0) {
    str += '=';
  }
  const decoded = atob(str);
  const percentEncoded = Array.from(decoded)
    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
    .join('');
  return decodeURIComponent(percentEncoded);
}

/**
 * Creates a sleek short URL via server endpoint (e.g. https://querviam.com/s/Ab3K9x)
 * with a 30-day automatic expiration to keep server storage minimal and bounded.
 * Falls back to offline self-contained hash if the server cannot be reached.
 */
export async function createShortStoryShareUrl(
  story: StoryData,
  ttlDays = 30
): Promise<{ url: string; id?: string; expiresAt?: number; isShort: boolean }> {
  try {
    const res = await fetch('/api/share/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ story, ttlDays }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.id) {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        return {
          url: `${origin}/s/${data.id}`,
          id: data.id,
          expiresAt: data.expiresAt,
          isShort: true,
        };
      }
    }
  } catch (err) {
    console.warn('Short link creation fallback to self-contained URL:', err);
  }

  // Graceful fallback to self-contained URL
  return {
    url: createStoryShareUrl(story),
    isShort: false,
  };
}

/**
 * Generates a self-contained, pre-loaded share URL for a story (offline fallback).
 */
export function createStoryShareUrl(story: StoryData): string {
  try {
    const compact: Partial<StoryData> = {
      title_target: story.title_target,
      title_en: story.title_en,
      contentType: story.contentType,
      _meta: story._meta,
      sentences: (story.sentences || []).map((s) => ({
        target: s.target,
        en: s.en,
        speaker: s.speaker,
        verbs: s.verbs,
      })),
      quiz: story.quiz,
      grammarBites: story.grammarBites,
    };
    const jsonStr = JSON.stringify(compact);
    const b64 = toUrlSafeBase64(jsonStr);
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}#story=${b64}`;
  } catch (e) {
    console.error('Error generating share URL:', e);
    return window.location.href;
  }
}

/**
 * Email provider types supported for 1-click sharing
 */
export type EmailProvider = 'gmail' | 'mailto' | 'outlook' | 'yahoo';

export interface StoryEmailOptions {
  includeStoryText?: boolean;
  includeTranslations?: boolean;
  isMailto?: boolean;
}

/**
 * Gets formatted email subject and body text for sharing a story.
 * When isMailto is true (used for mobile mail apps and mailto: URLs), it uses a compact
 * preview budget and clean ASCII formatting to guarantee the URI fits within iOS Safari
 * and Android intent length limits (~800 chars) and does not break mobile mail decoders.
 */
export function getStoryEmailContent(
  story: StoryData,
  shareUrlOverride?: string,
  options: StoryEmailOptions = {}
): { subject: string; body: string } {
  const shareUrl = shareUrlOverride || createStoryShareUrl(story);
  const targetLang = story._meta?.targetLang || 'Language';
  const title = story.title_target || 'Story';
  const subtitle = story.title_en || '';
  const includeStoryText = options.includeStoryText !== false;
  const includeTranslations = options.includeTranslations !== false;
  const isMailto = options.isMailto === true;

  // Clean subject without wrapping outer quotes that trigger mailto parsing quirks on mobile
  const subject = isMailto
    ? `${title} - ${targetLang} Story on Querviam`
    : `"${title}" - ${targetLang} Story on Querviam`;

  const bodyLines: string[] = [
    `Hi!`,
    ``,
    `I wanted to share this ${targetLang} practice story with you:`,
    `"${title}"${subtitle ? ` (${subtitle})` : ''}`,
    ``,
  ];

  if (includeStoryText && story.sentences && story.sentences.length > 0) {
    if (isMailto) {
      // Compact excerpt specifically budgeted for mobile Mail apps (Apple Mail / Android)
      bodyLines.push(`--- STORY PREVIEW ---`);
      let excerptChars = 0;
      const maxExcerptChars = 220;
      for (let i = 0; i < story.sentences.length; i++) {
        const s = story.sentences[i];
        let line = `${i + 1}. ${s.target}`;
        if (includeTranslations && s.en) {
          line += `\n   (${s.en})`;
        }
        if (excerptChars + line.length > maxExcerptChars && i > 0) {
          bodyLines.push(`[... ${story.sentences.length - i} more sentences on Querviam]`);
          break;
        }
        bodyLines.push(line);
        excerptChars += line.length;
        if (i >= 2 && i < story.sentences.length - 1) {
          bodyLines.push(`[... +${story.sentences.length - 1 - i} more sentences on Querviam]`);
          break;
        }
      }
      bodyLines.push(`---------------------`);
      bodyLines.push(``);
    } else {
      // Full story text budget for desktop webmail clients (Gmail, Outlook Web, Yahoo)
      bodyLines.push(`--- STORY TEXT ---`);
      const maxChars = 1400; // safe URL budget for webmail clients
      let textLength = 0;

      for (let i = 0; i < story.sentences.length; i++) {
        const s = story.sentences[i];
        let line = `${i + 1}. ${s.target}`;
        if (includeTranslations && s.en) {
          line += `\n   (${s.en})`;
        }
        if (textLength + line.length > maxChars && i > 0) {
          bodyLines.push(`\n[... +${story.sentences.length - i} more sentences on Querviam]`);
          break;
        }
        bodyLines.push(line);
        textLength += line.length;
      }
      bodyLines.push(`------------------`);
      bodyLines.push(``);
    }
  }

  // Avoid multi-byte 4-byte UTF-8 emojis in mailto URIs that cause iOS Mail to discard the body
  const bulletSymbol = isMailto ? '>' : '👉';
  bodyLines.push(`${bulletSymbol} Read with native audio pronunciation & interactive exercises on Querviam:`);
  bodyLines.push(shareUrl);
  bodyLines.push(``);
  bodyLines.push(`Opening this link immediately loads the story ready to practice!`);
  bodyLines.push(``);
  bodyLines.push(`Happy practicing!`);

  return {
    subject,
    body: bodyLines.join('\n'),
  };
}

/**
 * Generates a direct compose URL for the user's preferred email client.
 * For mailto (especially on phone mode), uses CRLF (\r\n -> %0D%0A) per RFC 6068
 * and compact mobile budgeting to guarantee phone mail apps populate immediately.
 */
export function createStoryEmailProviderUrl(
  provider: EmailProvider,
  story: StoryData,
  recipientEmail = '',
  shareUrlOverride?: string,
  options?: StoryEmailOptions
): string {
  const isMailto = provider === 'mailto';
  const { subject, body } = getStoryEmailContent(story, shareUrlOverride, {
    ...options,
    isMailto,
  });
  const to = recipientEmail.trim();

  switch (provider) {
    case 'gmail': {
      const q = [
        'view=cm',
        'fs=1',
        'tf=1',
        to ? `to=${encodeURIComponent(to)}` : '',
        `su=${encodeURIComponent(subject)}`,
        `body=${encodeURIComponent(body)}`,
      ]
        .filter(Boolean)
        .join('&');
      return `https://mail.google.com/mail/?${q}`;
    }
    case 'outlook': {
      const q = [
        to ? `to=${encodeURIComponent(to)}` : '',
        `subject=${encodeURIComponent(subject)}`,
        `body=${encodeURIComponent(body)}`,
      ]
        .filter(Boolean)
        .join('&');
      return `https://outlook.live.com/mail/0/deeplink/compose?${q}`;
    }
    case 'yahoo': {
      const q = [
        to ? `to=${encodeURIComponent(to)}` : '',
        `subj=${encodeURIComponent(subject)}`,
        `body=${encodeURIComponent(body)}`,
      ]
        .filter(Boolean)
        .join('&');
      return `https://compose.mail.yahoo.com/?${q}`;
    }
    case 'mailto':
    default: {
      const mailtoRecipient = to ? encodeURIComponent(to) : '';
      // RFC 6068 requires CRLF for line breaks in mailto body
      const crlfBody = body.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n');
      const params: string[] = [];
      if (subject) {
        params.push(`subject=${encodeURIComponent(subject)}`);
      }
      if (crlfBody) {
        params.push(`body=${encodeURIComponent(crlfBody)}`);
      }
      const queryString = params.length > 0 ? `?${params.join('&')}` : '';
      return `mailto:${mailtoRecipient}${queryString}`;
    }
  }
}

/**
 * Helper to auto-suggest an email provider if the user types a specific email domain
 */
export function detectEmailProviderFromDomain(email: string): EmailProvider | null {
  if (!email || !email.includes('@')) return null;
  const domain = email.split('@')[1]?.toLowerCase().trim() || '';
  if (domain.includes('gmail.com') || domain.includes('googlemail.com')) return 'gmail';
  if (domain.includes('outlook.com') || domain.includes('hotmail.com') || domain.includes('live.com') || domain.includes('msn.com')) return 'outlook';
  if (domain.includes('yahoo.com') || domain.includes('ymail.com')) return 'yahoo';
  return null;
}

/**
 * Generates a pre-filled mailto: link to email a story directly to another learner (legacy/default fallback).
 */
export function createStoryEmailLink(story: StoryData, recipientEmail = '', shareUrlOverride?: string): string {
  return createStoryEmailProviderUrl('mailto', story, recipientEmail, shareUrlOverride);
}

/**
 * Synchronous check to determine if the current URL contains a shared story parameter.
 * Used to immediately default the UI to 'practice' / 'play options' mode on the very first render
 * (and only in that case) when a recipient opens a shared story link.
 */
export function isShareLinkInUrl(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const hasShortPath = window.location.pathname.startsWith('/s/');
    const params = new URLSearchParams(window.location.search);
    const hasShortParam = Boolean(params.get('s'));
    const hasHashStory = typeof window.location.hash === 'string' && window.location.hash.includes('story=');
    const hasQueryStory = Boolean(params.get('story'));
    return hasShortPath || hasShortParam || hasHashStory || hasQueryStory;
  } catch {
    return false;
  }
}

/**
 * Resolves shared story from either short code (?s=... or /s/...) or self-contained URL payload (#story=...)
 */
export async function resolveSharedStoryFromUrl(): Promise<{ story: StoryData | null; error?: string }> {
  if (typeof window === 'undefined') return { story: null };

  // 1. Check for short link parameter (?s=xyz or path /s/xyz)
  try {
    let shortId = '';
    const params = new URLSearchParams(window.location.search);
    if (params.get('s')) {
      shortId = params.get('s')!;
    } else if (window.location.pathname.startsWith('/s/')) {
      shortId = window.location.pathname.replace('/s/', '').split('/')[0];
    }

    if (shortId) {
      const res = await fetch(`/api/share/${encodeURIComponent(shortId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.story && data.story.title_target && Array.isArray(data.story.sentences)) {
          return { story: data.story as StoryData };
        }
      } else if (res.status === 410) {
        return { story: null, error: 'This shared story link has expired (links stay active for 30 days).' };
      } else if (res.status === 404) {
        return { story: null, error: 'Shared story was not found or has been removed.' };
      }
    }
  } catch (shortErr) {
    console.warn('Failed resolving short link from server:', shortErr);
  }

  // 2. Check for self-contained hash (#story=...) or query (?story=...)
  const fallbackStory = parseSharedStoryFromUrl();
  return { story: fallbackStory };
}

/**
 * Synchronous parser for self-contained hash or query payload
 */
export function parseSharedStoryFromUrl(): StoryData | null {
  try {
    let payload = '';

    // 1. Check window.location.hash (#story=...)
    if (typeof window !== 'undefined' && window.location.hash) {
      const match = window.location.hash.match(/story=([^&]+)/);
      if (match && match[1]) {
        payload = match[1];
      }
    }

    // 2. Check window.location.search (?story=...) as fallback
    if (!payload && typeof window !== 'undefined' && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      const queryStory = params.get('story');
      if (queryStory) {
        payload = queryStory;
      }
    }

    if (!payload) return null;

    // Clean any URI component encoding
    const cleaned = decodeURIComponent(payload);
    const jsonStr = fromUrlSafeBase64(cleaned);
    const parsed = JSON.parse(jsonStr);

    if (parsed && parsed.title_target && Array.isArray(parsed.sentences) && parsed.sentences.length > 0) {
      return parsed as StoryData;
    }
    return null;
  } catch (e) {
    console.error('Error parsing shared story from URL:', e);
    return null;
  }
}
