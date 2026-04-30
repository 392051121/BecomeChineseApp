/**
 * Storage Keys
 *
 * Centralized AsyncStorage key management for consistency and maintainability.
 * All keys are prefixed with 'becomeChinese_' to avoid collisions.
 */

const PREFIX = 'becomeChinese_';

// User data keys
export const STORAGE_KEYS = {
  // Cultural assets and favorites
  CULTURAL_ASSETS: `${PREFIX}culturalAssets`,
  RECENTLY_VIEWED: `${PREFIX}recentlyViewed`,

  // Quiz and learning
  WRONG_ANSWERS: `${PREFIX}wrongAnswers`,
  REVIEW_STATS: `${PREFIX}reviewStats`,

  // Gamification
  UNLOCKED_BADGES: `${PREFIX}unlockedBadgeIds`,

  // User preferences
  THEME: `${PREFIX}theme`,
  ONBOARDING_COMPLETE: `${PREFIX}onboardingComplete`,
  USER_INTERESTS: `${PREFIX}userInterests`,

  // Search
  SEARCH_HISTORY: `${PREFIX}searchHistory`,
};

export default STORAGE_KEYS;
