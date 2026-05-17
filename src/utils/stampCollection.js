/**
 * Stamp Collection Utility
 *
 * Manages the user's stamp collection: earning, storing, and retrieving stamps.
 * All data stored locally in AsyncStorage.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config/storageKeys';
import {
  createStamp,
  determineStampRarity,
  STAMP_THRESHOLDS,
  FESTIVAL_EXCLUSIVE_STAMPS,
} from '../data/stamps';
import { getFestivalBonus } from './solarTermContent';

// In-memory cache
let stampCache = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5000; // 5 seconds

/**
 * Get stamp collection from storage
 */
export async function getStampCollection() {
  try {
    // Use cache if fresh
    if (stampCache && Date.now() - cacheTimestamp < CACHE_TTL) {
      return stampCache;
    }

    const saved = await AsyncStorage.getItem(STORAGE_KEYS.CULTURAL_STAMPS);
    if (saved) {
      stampCache = JSON.parse(saved);
      cacheTimestamp = Date.now();
      return stampCache;
    }

    // Return default structure
    return {
      stamps: {},
      stats: {
        totalStamps: 0,
        byType: { city: 0, food: 0, dynasty: 0, person: 0, festival: 0 },
        byRarity: { common: 0, rare: 0, epic: 0, legendary: 0 },
        totalXP: 0,
      },
    };
  } catch (e) {
    console.error('Failed to get stamp collection:', e);
    return {
      stamps: {},
      stats: {
        totalStamps: 0,
        byType: { city: 0, food: 0, dynasty: 0, person: 0, festival: 0 },
        byRarity: { common: 0, rare: 0, epic: 0, legendary: 0 },
        totalXP: 0,
      },
    };
  }
}

/**
 * Save stamp collection to storage
 */
async function saveStampCollection(collection) {
  try {
    stampCache = collection;
    cacheTimestamp = Date.now();
    await AsyncStorage.setItem(STORAGE_KEYS.CULTURAL_STAMPS, JSON.stringify(collection));
  } catch (e) {
    console.error('Failed to save stamp collection:', e);
  }
}

/**
 * Calculate engagement score for stamp earning
 * @param {object} params - Engagement parameters
 * @returns {number} - Engagement score (0-10)
 */
export function calculateEngagementScore(params) {
  const { viewTimeMs = 0, scrollDepth = 0, interactions = 0, expanded = false } = params;

  let score = 0;

  // View time contribution (max 3 points)
  if (viewTimeMs >= STAMP_THRESHOLDS.VIEW_TIME_MS) {
    score += Math.min(3, (viewTimeMs / STAMP_THRESHOLDS.VIEW_TIME_MS) * 3);
  }

  // Scroll depth contribution (max 3 points)
  if (scrollDepth >= STAMP_THRESHOLDS.SCROLL_DEPTH) {
    score += Math.min(3, scrollDepth * 3);
  }

  // Interactions contribution (max 2 points)
  score += Math.min(2, interactions);

  // Expanded content bonus (2 points)
  if (expanded) {
    score += 2;
  }

  return Math.round(score);
}

/**
 * Check if user qualifies for a stamp
 */
export function qualifiesForStamp(engagementScore) {
  return engagementScore >= STAMP_THRESHOLDS.DEEP_EXPLORE_SCORE;
}

/**
 * Earn a stamp for content exploration
 * @param {string} type - Content type (city, food, dynasty, person)
 * @param {object} content - Content item being explored
 * @param {object} engagementParams - Engagement parameters
 * @returns {object|null} - New stamp or null if not earned
 */
export async function earnStamp(type, content, engagementParams = {}) {
  if (!content || !content.id) return null;

  const collection = await getStampCollection();

  // Check if already earned this stamp for this content
  const existingStampId = Object.keys(collection.stamps).find(
    (id) => id.startsWith(`${type}-${content.id}-`)
  );

  if (existingStampId) {
    // Update engagement score if higher
    const existing = collection.stamps[existingStampId];
    const newScore = calculateEngagementScore(engagementParams);
    if (newScore > existing.engagementScore) {
      existing.engagementScore = newScore;
      await saveStampCollection(collection);
    }
    return null; // No new stamp
  }

  // Calculate engagement score
  const engagementScore = calculateEngagementScore(engagementParams);

  // Check if qualifies for stamp
  if (!qualifiesForStamp(engagementScore)) {
    return null;
  }

  // Get festival bonus
  const festivalBonus = getFestivalBonus();
  const rarityBoost = festivalBonus.rarityBoost;

  // Determine rarity
  const rarity = determineStampRarity(engagementScore, rarityBoost);

  // Create stamp
  const stamp = createStamp(type, content, rarity, engagementScore);

  // Add to collection
  collection.stamps[stamp.id] = stamp;

  // Update stats
  collection.stats.totalStamps += 1;
  collection.stats.byType[type] = (collection.stats.byType[type] || 0) + 1;
  collection.stats.byRarity[rarity] = (collection.stats.byRarity[rarity] || 0) + 1;
  collection.stats.totalXP += stamp.xp;

  await saveStampCollection(collection);

  return stamp;
}

/**
 * Earn festival exclusive stamp
 * @param {string} festivalId - Festival ID
 */
export async function earnFestivalStamp(festivalId) {
  const festivalStamp = FESTIVAL_EXCLUSIVE_STAMPS[festivalId];
  if (!festivalStamp) return null;

  const collection = await getStampCollection();

  // Check if already earned
  if (collection.stamps[festivalStamp.id]) {
    return null;
  }

  // Add festival stamp
  collection.stamps[festivalStamp.id] = {
    ...festivalStamp,
    earnedAt: new Date().toISOString(),
    engagementScore: 10,
  };

  // Update stats
  collection.stats.totalStamps += 1;
  collection.stats.byType.festival = (collection.stats.byType.festival || 0) + 1;
  collection.stats.byRarity[festivalStamp.rarity] =
    (collection.stats.byRarity[festivalStamp.rarity] || 0) + 1;
  collection.stats.totalXP += festivalStamp.xp;

  await saveStampCollection(collection);

  return festivalStamp;
}

/**
 * Get stamps by type
 */
export async function getStampsByType(type) {
  const collection = await getStampCollection();
  return Object.values(collection.stamps).filter((s) => s.type === type);
}

/**
 * Get stamps by rarity
 */
export async function getStampsByRarity(rarity) {
  const collection = await getStampCollection();
  return Object.values(collection.stamps).filter((s) => s.rarity === rarity);
}

/**
 * Get stamp stats
 */
export async function getStampStats() {
  const collection = await getStampCollection();
  return collection.stats;
}

/**
 * Check if stamp is earned for content
 */
export async function hasStampForContent(type, contentId) {
  const collection = await getStampCollection();
  return Object.keys(collection.stamps).some(
    (id) => id.startsWith(`${type}-${contentId}-`)
  );
}

/**
 * Get all stamps sorted by earned date
 */
export async function getAllStamps(sortBy = 'earnedAt', descending = true) {
  const collection = await getStampCollection();
  const stamps = Object.values(collection.stamps);

  stamps.sort((a, b) => {
    if (sortBy === 'earnedAt') {
      return descending
        ? new Date(b.earnedAt) - new Date(a.earnedAt)
        : new Date(a.earnedAt) - new Date(b.earnedAt);
    }
    if (sortBy === 'rarity') {
      const rarityOrder = { legendary: 4, epic: 3, rare: 2, common: 1 };
      return descending
        ? rarityOrder[b.rarity] - rarityOrder[a.rarity]
        : rarityOrder[a.rarity] - rarityOrder[b.rarity];
    }
    if (sortBy === 'xp') {
      return descending ? b.xp - a.xp : a.xp - b.xp;
    }
    return 0;
  });

  return stamps;
}

/**
 * Clear all stamps
 */
export async function clearStampCollection() {
  try {
    stampCache = null;
    await AsyncStorage.removeItem(STORAGE_KEYS.CULTURAL_STAMPS);
  } catch (e) {
    console.error('Failed to clear stamp collection:', e);
  }
}