// Client-side lightweight anonymous analytics helper for Querviam
// Stores zero PII: only generates an anonymous random client token in localStorage

export function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return 'anonymous';
  let vid = localStorage.getItem('querviam_visitor_id');
  if (!vid) {
    vid = 'qv_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    localStorage.setItem('querviam_visitor_id', vid);
  }
  return vid;
}

export type AnalyticsEventType =
  | 'page_view'
  | 'story_generated'
  | 'story_read'
  | 'word_lookup'
  | 'dig_deeper_click'
  | 'audio_play'
  | 'story_shared'
  | 'saved_library'
  | 'practice_start'
  | 'grammar_view'
  | 'ad_impression';

export async function logAnalyticsEvent(
  event: AnalyticsEventType,
  details?: Record<string, any>
): Promise<void> {
  try {
    const visitorId = getOrCreateVisitorId();
    // Non-blocking fire-and-forget
    fetch('/api/analytics/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        visitorId,
        event,
        details: details || {},
      }),
    }).catch(() => {
      // Ignore network failures quietly
    });
  } catch (_) {
    // Fail silently on client
  }
}

export interface LanguagePairData {
  pairKey: string;
  targetLang: string;
  baseLang: string;
  storiesGenerated: number;
  practiceSessions: number;
  wordLookups: number;
  audioPlays: number;
  adImpressions: number;
  uniqueLearnersCount: number;
  estimatedRevenueEur: number;
}

export interface AnalyticsStatsData {
  summary: {
    totalDistinctVisitors: number;
    visitorsToday: number;
    visitorsLast7Days: number;
    visitorsLast30Days: number;
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
  languages: Record<string, number>;
  languagePairs: LanguagePairData[];
  topWords: Array<{ word: string; count: number }>;
  dailyActivity: Array<{
    date: string;
    visitors: number;
    pageViews: number;
    storiesGenerated: number;
    wordLookups: number;
    digDeeperClicks: number;
  }>;
  recentEvents: Array<{
    timestamp: number;
    event: string;
    details?: any;
    visitorPreview: string;
  }>;
}

export async function fetchAnalyticsStats(): Promise<AnalyticsStatsData | null> {
  try {
    const res = await fetch('/api/analytics/stats');
    if (!res.ok) return null;
    const data = await res.json();
    return data.stats || null;
  } catch (err) {
    console.error('Failed to fetch analytics stats:', err);
    return null;
  }
}
