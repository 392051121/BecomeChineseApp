/**
 * Application Constants
 *
 * Centralized configuration for thresholds, limits, and magic numbers.
 */

// Collection milestone thresholds
export const COLLECTION_MILESTONES = [
  { count: 5, label: 'Explorer', labelCn: '探索者', reward: 'Unlock 5 items' },
  { count: 15, label: 'Traveler', labelCn: '行者', reward: 'Collect 15 items' },
  { count: 30, label: 'Scholar', labelCn: '学者', reward: 'Gather 30 items' },
  { count: 50, label: 'Master', labelCn: '大师', reward: 'Master 50 items' },
];

// Minimum collection thresholds for recommendations
export const MIN_COLLECTION_THRESHOLD = 3;

// XP configuration
export const XP_CONFIG = {
  MAX_LEVEL_THRESHOLD: 500,
  QUIZ_CORRECT_BASE: 5,
};

// Quiz configuration
export const QUIZ_CONFIG = {
  MAX_WRONG_ANSWERS: 50,
  MASTERY_THRESHOLD: 2,
  STREAK_RESET_DAYS: 2,
};

// Storage limits
export const STORAGE_LIMITS = {
  MAX_RECENT_ITEMS: 20,
  MAX_FAVORITES_PER_TYPE: 60,
  MAX_NAMES_SAVED: 30,
  MAX_SEARCH_HISTORY: 10,
};

// Cache configuration
export const CACHE_CONFIG = {
  DEFAULT_TTL_MS: 5000,
};

// Animation durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 200,
  SLOW: 300,
};

// Toast/notification durations
export const NOTIFICATION_DURATION = {
  TOAST_DEFAULT: 4000,
  TOAST_OFFLINE: 3000,
  TOAST_ONLINE: 0,
  BADGE_AUTO_DISMISS: 5000,
};

// FlatList optimization
export const FLATLIST_CONFIG = {
  INITIAL_NUM_TO_RENDER: 4,
  MAX_TO_RENDER_PER_BATCH: 4,
  WINDOW_SIZE: 5,
};

// Display limits
export const DISPLAY_LIMITS = {
  RECENT_ITEMS_HOME: 4,
  COLLECTION_LIST: 20,
  COLLECTION_GRID: 12,
  NAMES_DISPLAY: 30,
};

// Hero image height
export const HERO_IMAGE_HEIGHT = 260;
