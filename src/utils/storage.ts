import { StoryData, LibraryItemSummary, LearnerStats, SRSCardData, PracticeMode, QuizQuestion } from '../types';

const LOCAL_STORAGE_KEY = 'impara_cached_stories_v1';
const STATS_STORAGE_KEY = 'impara_learner_stats_v1';
const SRS_STORAGE_KEY = 'impara_srs_cards_v1';
const PRACTICE_STATE_KEY = 'impara_practice_state_v1';
const LAST_PRACTICE_MODE_KEY = 'impara_last_practice_mode_v1';

export function getLocalStories(): Record<string, StoryData> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn('Could not read from localStorage:', err);
    return {};
  }
}

export function saveLocalStory(filename: string, story: StoryData) {
  try {
    const all = getLocalStories();
    if (!story.createdAt) {
      story.createdAt = Date.now();
    }
    all[filename] = story;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(all));
  } catch (err) {
    console.warn('Could not write to localStorage:', err);
  }
}

export function getLocalStory(filename: string): StoryData | null {
  const all = getLocalStories();
  return all[filename] || null;
}

export function deleteLocalStory(filename: string) {
  try {
    const all = getLocalStories();
    delete all[filename];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(all));
  } catch (err) {
    console.warn('Could not delete from localStorage:', err);
  }
}

export function getLocalLibrarySummaries(): LibraryItemSummary[] {
  const all = getLocalStories();
  return Object.keys(all).map(filename => {
    const story = all[filename];
    const matchTs = filename.match(/(\d{10,13})/);
    const extractedTs = matchTs ? parseInt(matchTs[1], 10) : 0;
    return {
      filename,
      title_target: story.title_target || 'Untitled',
      title_en: story.title_en || '',
      contentType: story.contentType || story._meta?.contentType || 'story',
      _meta: story._meta,
      isLocalOnly: true,
      createdAt: story.createdAt || extractedTs || 0,
    };
  });
}

// ----------------- Learner Stats & Streak Tracking -----------------
export function getLearnerStats(): LearnerStats {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Error reading learner stats:', err);
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const initial: LearnerStats = {
    currentStreak: 1,
    bestStreak: 1,
    lastActiveDate: todayStr,
    activeDates: [todayStr],
    totalWordsRead: 45, // starter baseline from sample story
    totalStoriesCompleted: 1,
    practiceMinutes: 3,
    knownWordsCount: 12,
  };
  saveLearnerStats(initial);
  return initial;
}

export function saveLearnerStats(stats: LearnerStats): void {
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (err) {
    console.warn('Error writing learner stats:', err);
  }
}

export function updateLearnerActivity(delta: {
  wordsRead?: number;
  storiesCompleted?: number;
  practiceMinutes?: number;
  knownWordsCount?: number;
}): LearnerStats {
  const stats = getLearnerStats();
  const todayStr = new Date().toISOString().split('T')[0];

  // Calculate streak based on last active date
  if (stats.lastActiveDate !== todayStr) {
    const lastDate = new Date(stats.lastActiveDate);
    const today = new Date(todayStr);
    const diffDays = Math.round((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      stats.currentStreak += 1;
      if (stats.currentStreak > stats.bestStreak) {
        stats.bestStreak = stats.currentStreak;
      }
    } else if (diffDays > 1) {
      stats.currentStreak = 1;
    }
    stats.lastActiveDate = todayStr;
    if (!stats.activeDates.includes(todayStr)) {
      stats.activeDates.push(todayStr);
      // Keep last 30 active dates to avoid unbounded growth
      if (stats.activeDates.length > 30) {
        stats.activeDates = stats.activeDates.slice(-30);
      }
    }
  }

  if (delta.wordsRead) stats.totalWordsRead += delta.wordsRead;
  if (delta.storiesCompleted) stats.totalStoriesCompleted += delta.storiesCompleted;
  if (delta.practiceMinutes) stats.practiceMinutes += delta.practiceMinutes;
  if (delta.knownWordsCount !== undefined) stats.knownWordsCount = delta.knownWordsCount;

  saveLearnerStats(stats);
  return stats;
}

// ----------------- Spaced Repetition (SRS) Engine -----------------
export function getSRSCards(): Record<string, SRSCardData> {
  try {
    const raw = localStorage.getItem(SRS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn('Error reading SRS cards:', err);
    return {};
  }
}

export function saveSRSCards(cards: Record<string, SRSCardData>): void {
  try {
    localStorage.setItem(SRS_STORAGE_KEY, JSON.stringify(cards));
  } catch (err) {
    console.warn('Error saving SRS cards:', err);
  }
}

export function rateSRSCard(
  cardId: string,
  rating: 'again' | 'hard' | 'good' | 'easy'
): SRSCardData {
  const cards = getSRSCards();
  const existing: SRSCardData = cards[cardId] || {
    id: cardId,
    intervalDays: 0,
    repetitions: 0,
    easeFactor: 2.5,
    nextReviewDate: Date.now(),
    status: 'new',
  };

  let { intervalDays, repetitions, easeFactor } = existing;
  const now = Date.now();

  switch (rating) {
    case 'again':
      repetitions = 0;
      intervalDays = 0.01; // Review again in ~15 minutes
      easeFactor = Math.max(1.3, easeFactor - 0.2);
      break;
    case 'hard':
      repetitions += 1;
      intervalDays = Math.max(1, Math.round(intervalDays * 1.2) || 1);
      easeFactor = Math.max(1.3, easeFactor - 0.15);
      break;
    case 'good':
      if (repetitions === 0) intervalDays = 1;
      else if (repetitions === 1) intervalDays = 3;
      else intervalDays = Math.round(intervalDays * easeFactor);
      repetitions += 1;
      break;
    case 'easy':
      if (repetitions === 0) intervalDays = 4;
      else intervalDays = Math.round(intervalDays * easeFactor * 1.3);
      repetitions += 1;
      easeFactor += 0.15;
      break;
  }

  const nextReviewDate = now + Math.round(intervalDays * 24 * 60 * 60 * 1000);
  const status: 'new' | 'learning' | 'mastered' =
    intervalDays >= 7 ? 'mastered' : 'learning';

  const updated: SRSCardData = {
    id: cardId,
    intervalDays,
    repetitions,
    easeFactor: Number(easeFactor.toFixed(2)),
    nextReviewDate,
    lastReviewedDate: now,
    status,
  };

  cards[cardId] = updated;
  saveSRSCards(cards);
  return updated;
}

// ----------------- Practice Activities State Persistence Across Sessions -----------------
export interface StoryPracticeState {
  practiceMode?: PracticeMode;
  clozeSolved?: number[];
  clozeAnswers?: Record<number, string>;
  mcSolved?: number[];
  mcSelectedOptions?: Record<number, number>;
  scrambleSolved?: number[];
  scramblePlaced?: Record<number, (number | null)[]>;
  quizQuestions?: QuizQuestion[];
  quizSolved?: number[];
  quizAnswers?: Record<number, number>; // questionIdx -> selectedOptionIdx
  hasCelebrated?: boolean;
}

export function getStoryPracticeState(storyKey: string): StoryPracticeState | null {
  try {
    const raw = localStorage.getItem(PRACTICE_STATE_KEY);
    if (!raw) return null;
    const all = JSON.parse(raw);
    return all[storyKey] || null;
  } catch (err) {
    console.warn('Error reading practice state:', err);
    return null;
  }
}

export function saveStoryPracticeState(storyKey: string, update: Partial<StoryPracticeState>): void {
  try {
    if (!storyKey) return;
    const raw = localStorage.getItem(PRACTICE_STATE_KEY);
    const all = raw ? JSON.parse(raw) : {};
    all[storyKey] = {
      ...(all[storyKey] || {}),
      ...update,
    };
    localStorage.setItem(PRACTICE_STATE_KEY, JSON.stringify(all));
  } catch (err) {
    console.warn('Error saving practice state:', err);
  }
}

export function clearStoryPracticeState(storyKey: string): void {
  try {
    if (!storyKey) return;
    const raw = localStorage.getItem(PRACTICE_STATE_KEY);
    if (!raw) return;
    const all = JSON.parse(raw);
    delete all[storyKey];
    localStorage.setItem(PRACTICE_STATE_KEY, JSON.stringify(all));
  } catch (err) {
    console.warn('Error clearing practice state:', err);
  }
}

export function getLastPracticeMode(): PracticeMode | null {
  try {
    const mode = localStorage.getItem(LAST_PRACTICE_MODE_KEY);
    if (mode === 'scrambleEasy') return 'scramble';
    return (mode as PracticeMode) || null;
  } catch {
    return null;
  }
}

export function setLastPracticeMode(mode: PracticeMode): void {
  try {
    localStorage.setItem(LAST_PRACTICE_MODE_KEY, mode);
  } catch {}
}

