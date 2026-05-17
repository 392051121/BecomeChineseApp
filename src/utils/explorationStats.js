/**
 * Exploration Stats Utility
 *
 * Tracks user exploration statistics for achievements and stamps.
 * All data stored locally in AsyncStorage.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config/storageKeys';
import { STORAGE_LIMITS } from '../config/constants';

const MAX_VIEWED_ITEMS = STORAGE_LIMITS.MAX_RECENT_ITEMS || 100;

// In-memory cache
let explorationCache = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5000; // 5 seconds

/**
 * Get exploration stats from storage
 */
export async function getExplorationStats() {
  try {
    // Use cache if fresh
    if (explorationCache && Date.now() - cacheTimestamp < CACHE_TTL) {
      return explorationCache;
    }

    const saved = await AsyncStorage.getItem(STORAGE_KEYS.EXPLORATION_STATS);
    if (saved) {
      explorationCache = JSON.parse(saved);
      cacheTimestamp = Date.now();
      return explorationCache;
    }

    // Return default structure
    return {
      citiesViewed: [],
      recipesViewed: [],
      dynastiesViewed: [],
      peopleViewed: [],
      provincesExplored: {},
    };
  } catch (e) {
    console.error('Failed to get exploration stats:', e);
    return {
      citiesViewed: [],
      recipesViewed: [],
      dynastiesViewed: [],
      peopleViewed: [],
      provincesExplored: {},
    };
  }
}

/**
 * Save exploration stats to storage
 */
async function saveExplorationStats(stats) {
  try {
    explorationCache = stats;
    cacheTimestamp = Date.now();
    await AsyncStorage.setItem(STORAGE_KEYS.EXPLORATION_STATS, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save exploration stats:', e);
  }
}

/**
 * Track a viewed item
 * @param {string} type - 'city' | 'recipe' | 'dynasty' | 'person'
 * @param {object} item - The item being viewed (must have id, and province_id for cities)
 */
export async function trackViewedItem(type, item) {
  if (!item || !item.id) return;

  const stats = await getExplorationStats();
  const typeKey = `${type}sViewed`;

  if (!stats[typeKey]) {
    stats[typeKey] = [];
  }

  // Add to viewed list if not already there
  if (!stats[typeKey].includes(item.id)) {
    stats[typeKey] = [...stats[typeKey], item.id].slice(-MAX_VIEWED_ITEMS);
  }

  // Track province exploration for cities
  if (type === 'city' && item.province_id) {
    if (!stats.provincesExplored) {
      stats.provincesExplored = {};
    }
    if (!stats.provincesExplored[item.province_id]) {
      stats.provincesExplored[item.province_id] = [];
    }
    if (!stats.provincesExplored[item.province_id].includes(item.id)) {
      stats.provincesExplored[item.province_id] = [
        ...stats.provincesExplored[item.province_id],
        item.id,
      ];
    }
  }

  await saveExplorationStats(stats);
  return stats;
}

/**
 * Get exploration counts for achievement checking
 */
export async function getExplorationCounts() {
  const stats = await getExplorationStats();

  return {
    citiesViewed: stats.citiesViewed?.length || 0,
    recipesViewed: stats.recipesViewed?.length || 0,
    dynastiesViewed: stats.dynastiesViewed?.length || 0,
    peopleViewed: stats.peopleViewed?.length || 0,
    provincesExplored: Object.keys(stats.provincesExplored || {}).length,
  };
}

/**
 * Check if a province is fully explored (all cities viewed)
 * @param {string} provinceId - Province ID to check
 * @param {array} allCities - All cities data to compare against
 */
export function isProvinceComplete(provinceId, allCities, stats) {
  const provinceCities = allCities.filter((c) => c.province_id === provinceId);
  const exploredCities = stats.provincesExplored?.[provinceId] || [];

  return provinceCities.length > 0 && exploredCities.length >= provinceCities.length;
}

/**
 * Get all completed provinces
 * @param {array} allCities - All cities data
 */
export async function getCompletedProvinces(allCities) {
  const stats = await getExplorationStats();
  const completedProvinces = [];

  // Get unique provinces from cities
  const provinceSet = new Set(allCities.map((c) => c.province_id).filter(Boolean));

  for (const provinceId of provinceSet) {
    if (isProvinceComplete(provinceId, allCities, stats)) {
      completedProvinces.push(provinceId);
    }
  }

  return completedProvinces;
}

/**
 * Get exploration progress for a specific type
 */
export async function getExplorationProgress(type, allItems) {
  const stats = await getExplorationStats();
  const typeKey = `${type}sViewed`;
  const viewed = stats[typeKey]?.length || 0;
  const total = allItems?.length || 0;

  return {
    viewed,
    total,
    percentage: total > 0 ? Math.round((viewed / total) * 100) : 0,
  };
}

/**
 * Clear all exploration stats
 */
export async function clearExplorationStats() {
  try {
    explorationCache = null;
    await AsyncStorage.removeItem(STORAGE_KEYS.EXPLORATION_STATS);
  } catch (e) {
    console.error('Failed to clear exploration stats:', e);
  }
}
