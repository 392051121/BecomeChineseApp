/**
 * Gamification Configuration
 *
 * Centralized configuration for XP, levels, ranks, and badge thresholds.
 */

// XP Level thresholds and titles
export const XP_LEVELS = [
  { threshold: 0, level: 1, title: 'Newcomer', titleCn: '新人' },
  { threshold: 20, level: 2, title: 'Learner', titleCn: '学习者' },
  { threshold: 50, level: 3, title: 'Beginner', titleCn: '初学者' },
  { threshold: 100, level: 4, title: 'Novice', titleCn: '新手' },
  { threshold: 150, level: 5, title: 'Apprentice', titleCn: '学徒' },
  { threshold: 200, level: 6, title: 'Intermediate', titleCn: '中级' },
  { threshold: 250, level: 7, title: 'Advanced', titleCn: '进阶' },
  { threshold: 300, level: 8, title: 'Veteran', titleCn: '资深' },
  { threshold: 400, level: 9, title: 'Expert', titleCn: '专家' },
  { threshold: 500, level: 10, title: 'Master', titleCn: '大师' },
];

// Culture rank thresholds based on connected provinces
export const CULTURE_RANKS = [
  { threshold: 8, rank: 'Gold Wanderer' },
  { threshold: 4, rank: 'Silver Explorer' },
  { threshold: 1, rank: 'Bronze Traveler' },
  { threshold: 0, rank: 'Wanderer Seed' },
];

// Storage limits
export const STORAGE_LIMITS = {
  MAX_RECENT_ITEMS: 20,
  MAX_FAVORITES_PER_TYPE: 60,
  MAX_NAMES_SAVED: 30,
};

// XP rewards for actions
export const XP_REWARDS = {
  QUIZ_CORRECT: 5,
  DAILY_QUIZ: 5,
  FIRST_CITY: 10,
  FIRST_RECIPE: 10,
  FIRST_DYNASTY: 10,
  NAME_GENERATED: 15,
};

// Quiz configuration
export const QUIZ_CONFIG = {
  STREAK_RESET_DAYS: 2, // Days before streak resets
};

/**
 * Get XP level from total XP
 */
export function getXPLevel(xp) {
  for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= XP_LEVELS[i].threshold) {
      return XP_LEVELS[i];
    }
  }
  return XP_LEVELS[0];
}

/**
 * Get culture rank from connected provinces count
 */
export function getCultureRank(connected) {
  for (const rankConfig of CULTURE_RANKS) {
    if (connected >= rankConfig.threshold) {
      return rankConfig.rank;
    }
  }
  return CULTURE_RANKS[CULTURE_RANKS.length - 1].rank;
}

/**
 * Get progress to next XP level
 */
export function getXPProgress(xp) {
  const currentLevel = getXPLevel(xp);
  const nextLevelIndex = XP_LEVELS.findIndex(l => l.level === currentLevel.level) + 1;

  if (nextLevelIndex >= XP_LEVELS.length) {
    return { current: xp - currentLevel.threshold, needed: 0, percentage: 100 };
  }

  const nextLevel = XP_LEVELS[nextLevelIndex];
  return {
    current: xp - currentLevel.threshold,
    needed: nextLevel.threshold - currentLevel.threshold,
    percentage: Math.round(((xp - currentLevel.threshold) / (nextLevel.threshold - currentLevel.threshold)) * 100),
  };
}
