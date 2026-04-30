/**
 * Badge System Configuration
 *
 * Defines all available badges, their unlock conditions, and rewards.
 */

import { XP_LEVELS, getXPLevel, getXPProgress } from '../config/gamification';
import { dynasties } from './dynasties';
import { cities } from './cities';
import { recipes } from './recipes';

// Re-export for convenience
export { getXPLevel, getXPProgress };

// Dynamic thresholds based on actual data counts
const DYNASTY_COUNT = dynasties.length;
const CITY_COUNT = cities.length;
const RECIPE_COUNT = recipes.length;

export const badgeCategories = {
  streak: 'Streak & Consistency',
  exploration: 'Exploration',
  collection: 'Collection',
  mastery: 'Mastery',
  special: 'Special',
};

export const badges = [
  // Streak & Consistency
  {
    id: 'streak-3',
    category: 'streak',
    nameCn: '三日坚持',
    nameEn: '3-Day Streak',
    descriptionCn: '连续3天完成每日问答',
    descriptionEn: 'Complete daily quiz for 3 days in a row',
    icon: 'flame',
    color: '#E2B05E',
    condition: { type: 'quizStreak', value: 3 },
    xp: 10,
  },
  {
    id: 'streak-7',
    category: 'streak',
    nameCn: '周而复始',
    nameEn: 'Weekly Commitment',
    descriptionCn: '连续7天完成每日问答',
    descriptionEn: 'Complete daily quiz for 7 days in a row',
    icon: 'flame',
    color: '#E2B05E',
    condition: { type: 'quizStreak', value: 7 },
    xp: 25,
  },
  {
    id: 'streak-30',
    category: 'streak',
    nameCn: '月度行者',
    nameEn: 'Monthly Walker',
    descriptionCn: '连续30天完成每日问答',
    descriptionEn: 'Complete daily quiz for 30 days in a row',
    icon: 'flame',
    color: '#B33B24',
    condition: { type: 'quizStreak', value: 30 },
    xp: 100,
  },
  {
    id: 'quiz-10',
    category: 'streak',
    nameCn: '初试锋芒',
    nameEn: 'Getting Started',
    descriptionCn: '累计回答10道问题',
    descriptionEn: 'Answer 10 questions total',
    icon: 'target',
    color: '#6B8A94',
    condition: { type: 'quizTotal', value: 10 },
    xp: 15,
  },
  {
    id: 'quiz-50',
    category: 'streak',
    nameCn: '勤学好问',
    nameEn: 'Curious Mind',
    descriptionCn: '累计回答50道问题',
    descriptionEn: 'Answer 50 questions total',
    icon: 'target',
    color: '#6B8A94',
    condition: { type: 'quizTotal', value: 50 },
    xp: 50,
  },
  {
    id: 'quiz-100',
    category: 'streak',
    nameCn: '博学多闻',
    nameEn: 'Well Learned',
    descriptionCn: '累计回答100道问题',
    descriptionEn: 'Answer 100 questions total',
    icon: 'target',
    color: '#B33B24',
    condition: { type: 'quizTotal', value: 100 },
    xp: 100,
  },

  // Exploration
  {
    id: 'city-1',
    category: 'exploration',
    nameCn: '初识华夏',
    nameEn: 'First Steps',
    descriptionCn: '收藏第一座城市',
    descriptionEn: 'Save your first city',
    icon: 'map-pin',
    color: '#6B8A94',
    condition: { type: 'citiesCollected', value: 1 },
    xp: 10,
  },
  {
    id: 'city-5',
    category: 'exploration',
    nameCn: '行者无疆',
    nameEn: 'Wanderer',
    descriptionCn: '收藏5座城市',
    descriptionEn: 'Save 5 cities',
    icon: 'map-pin',
    color: '#6B8A94',
    condition: { type: 'citiesCollected', value: 5 },
    xp: 30,
  },
  {
    id: 'city-10',
    category: 'exploration',
    nameCn: '纵横四海',
    nameEn: 'Globe Trotter',
    descriptionCn: '收藏10座城市',
    descriptionEn: 'Save 10 cities',
    icon: 'map-pin',
    color: '#E2B05E',
    condition: { type: 'citiesCollected', value: 10 },
    xp: 60,
  },
  {
    id: 'province-3',
    category: 'exploration',
    nameCn: '地图初成',
    nameEn: 'Atlas Beginner',
    descriptionCn: '连接3个省份',
    descriptionEn: 'Connect 3 provinces',
    icon: 'globe',
    color: '#6B8A94',
    condition: { type: 'provincesConnected', value: 3 },
    xp: 20,
  },
  {
    id: 'province-10',
    category: 'exploration',
    nameCn: '九州通衢',
    nameEn: 'Atlas Master',
    descriptionCn: '连接10个省份',
    descriptionEn: 'Connect 10 provinces',
    icon: 'globe',
    color: '#B33B24',
    condition: { type: 'provincesConnected', value: 10 },
    xp: 80,
  },

  // Collection
  {
    id: 'food-1',
    category: 'collection',
    nameCn: '舌尖初探',
    nameEn: 'Taste Bud',
    descriptionCn: '收藏第一道菜',
    descriptionEn: 'Save your first dish',
    icon: 'utensils',
    color: '#6B8A94',
    condition: { type: 'recipesCollected', value: 1 },
    xp: 10,
  },
  {
    id: 'food-5',
    category: 'collection',
    nameCn: '美食家',
    nameEn: 'Foodie',
    descriptionCn: '收藏5道菜',
    descriptionEn: 'Save 5 dishes',
    icon: 'utensils',
    color: '#6B8A94',
    condition: { type: 'recipesCollected', value: 5 },
    xp: 30,
  },
  {
    id: 'food-10',
    category: 'collection',
    nameCn: '饕餮盛宴',
    nameEn: 'Gourmet',
    descriptionCn: '收藏10道菜',
    descriptionEn: 'Save 10 dishes',
    icon: 'utensils',
    color: '#E2B05E',
    condition: { type: 'recipesCollected', value: 10 },
    xp: 60,
  },
  {
    id: 'dynasty-1',
    category: 'collection',
    nameCn: '历史入门',
    nameEn: 'History Novice',
    descriptionCn: '收藏第一个朝代',
    descriptionEn: 'Save your first dynasty',
    icon: 'scroll',
    color: '#6B8A94',
    condition: { type: 'dynastiesCollected', value: 1 },
    xp: 10,
  },
  {
    id: 'dynasty-5',
    category: 'collection',
    nameCn: '史海钩沉',
    nameEn: 'History Buff',
    descriptionCn: '收藏5个朝代',
    descriptionEn: 'Save 5 dynasties',
    icon: 'scroll',
    color: '#6B8A94',
    condition: { type: 'dynastiesCollected', value: 5 },
    xp: 40,
  },
  {
    id: 'dynasty-all',
    category: 'collection',
    nameCn: '通史达人',
    nameEn: 'Chronicle Master',
    descriptionCn: '收藏所有朝代',
    descriptionEn: 'Save all dynasties',
    icon: 'scroll',
    color: '#B33B24',
    condition: { type: 'dynastiesCollected', value: DYNASTY_COUNT },
    xp: 150,
  },

  // Mastery
  {
    id: 'name-1',
    category: 'mastery',
    nameCn: '名从心生',
    nameEn: 'Identity Born',
    descriptionCn: '生成你的中文名字',
    descriptionEn: 'Generate your Chinese name',
    icon: 'user',
    color: '#6B8A94',
    condition: { type: 'namesGenerated', value: 1 },
    xp: 15,
  },
  {
    id: 'name-5',
    category: 'mastery',
    nameCn: '名号众多',
    nameEn: 'Name Collector',
    descriptionCn: '保存5个中文名字',
    descriptionEn: 'Save 5 Chinese names',
    icon: 'user',
    color: '#6B8A94',
    condition: { type: 'namesSaved', value: 5 },
    xp: 35,
  },
  {
    id: 'rank-explorer',
    category: 'mastery',
    nameCn: '探索者',
    nameEn: 'Explorer',
    descriptionCn: '达到探索者等级',
    descriptionEn: 'Reach Explorer rank',
    icon: 'award',
    color: '#6B8A94',
    condition: { type: 'rank', value: 'Explorer' },
    xp: 20,
  },
  {
    id: 'rank-traveler',
    category: 'mastery',
    nameCn: '行者',
    nameEn: 'Traveler',
    descriptionCn: '达到行者等级',
    descriptionEn: 'Reach Traveler rank',
    icon: 'award',
    color: '#E2B05E',
    condition: { type: 'rank', value: 'Traveler' },
    xp: 50,
  },
  {
    id: 'rank-scholar',
    category: 'mastery',
    nameCn: '学者',
    nameEn: 'Scholar',
    descriptionCn: '达到学者等级',
    descriptionEn: 'Reach Scholar rank',
    icon: 'award',
    color: '#B33B24',
    condition: { type: 'rank', value: 'Scholar' },
    xp: 100,
  },

  // Special
  {
    id: 'early-adopter',
    category: 'special',
    nameCn: '早期探索者',
    nameEn: 'Early Adopter',
    descriptionCn: '在应用早期加入',
    descriptionEn: 'Join during early access',
    icon: 'star',
    color: '#E2B05E',
    condition: { type: 'special', value: 'earlyAdopter' },
    xp: 50,
    unlocked: true, // Always unlocked for existing users
  },
  {
    id: 'all-features',
    category: 'special',
    nameCn: '全面发展',
    nameEn: 'Well Rounded',
    descriptionCn: '使用所有功能模块',
    descriptionEn: 'Use all feature modules',
    icon: 'sparkles',
    color: '#B33B24',
    condition: { type: 'allFeatures', value: true },
    xp: 80,
  },
];

/**
 * Check if a badge is unlocked based on user stats
 */
export function checkBadgeUnlocked(badge, stats) {
  if (badge.unlocked) return true;

  const { type, value } = badge.condition;

  switch (type) {
    case 'quizStreak':
      return stats.quizStreak >= value;
    case 'quizTotal':
      return stats.quizTotal >= value;
    case 'citiesCollected':
      return stats.citiesCollected >= value;
    case 'recipesCollected':
      return stats.recipesCollected >= value;
    case 'dynastiesCollected':
      return stats.dynastiesCollected >= value;
    case 'provincesConnected':
      return stats.provincesConnected >= value;
    case 'namesGenerated':
      return stats.namesGenerated >= value;
    case 'namesSaved':
      return stats.namesSaved >= value;
    case 'rank':
      // Use ordinal comparison for rank progression
      const rankOrder = ['Wanderer Seed', 'Bronze Traveler', 'Silver Explorer', 'Gold Wanderer', 'Explorer', 'Traveler', 'Scholar'];
      const currentRankIndex = rankOrder.indexOf(stats.rank);
      const requiredRankIndex = rankOrder.indexOf(value);
      return currentRankIndex >= requiredRankIndex && requiredRankIndex !== -1;
    case 'allFeatures':
      // Check for meaningful engagement: at least 1 item saved per category
      return (stats.citiesCollected >= 1 || stats.usedPlaces) &&
             (stats.recipesCollected >= 1 || stats.usedFood) &&
             (stats.dynastiesCollected >= 1 || stats.usedHistory) &&
             (stats.quizTotal >= 1 || stats.usedQuiz);
    case 'special':
      return false; // Special badges have custom unlock logic
    default:
      return false;
  }
}

/**
 * Get all unlocked badges for a user
 */
export function getUnlockedBadges(stats) {
  return badges.filter((badge) => checkBadgeUnlocked(badge, stats));
}

/**
 * Calculate total XP
 */
export function calculateTotalXP(stats) {
  return getUnlockedBadges(stats).reduce((total, badge) => total + badge.xp, 0);
}
