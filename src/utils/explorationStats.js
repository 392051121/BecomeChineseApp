/**
 * Exploration Stats Utility
 *
 * Tracks user exploration statistics for achievements and stamps.
 * All data stored locally in AsyncStorage.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config/storageKeys';
import { STORAGE_LIMITS } from '../config/constants';
import { getProvinceId, normalizeProvinceId } from './provinceIds';

const MAX_VIEWED_ITEMS = STORAGE_LIMITS.MAX_RECENT_ITEMS || 100;

// In-memory cache
let explorationCache = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5000; // 5 seconds

/**
 * Default empty stats shape
 */
function defaultStats() {
  return {
    citiesViewed: [],
    recipesViewed: [],
    dynastiesViewed: [],
    peopleViewed: [],
    provincesExplored: {},
  };
}

/**
 * Drop non-geo province keys and merge duplicates after alias normalize.
 * Returns { stats, changed } so callers can optionally persist the scrub.
 */
export function scrubExplorationProvinces(stats) {
  const base = stats && typeof stats === 'object' ? stats : defaultStats();
  const raw = base.provincesExplored && typeof base.provincesExplored === 'object'
    ? base.provincesExplored
    : {};
  const next = {};
  let changed = false;

  Object.entries(raw).forEach(([key, itemIds]) => {
    const n = normalizeProvinceId(key);
    if (!n) {
      changed = true;
      return;
    }
    if (n !== key) changed = true;
    if (!next[n]) next[n] = [];
    const list = Array.isArray(itemIds) ? itemIds : [];
    list.forEach((id) => {
      if (id != null && !next[n].includes(id)) next[n].push(id);
    });
  });

  if (!changed) {
    // Still treat length mismatch as change (dedupe across aliases)
    if (Object.keys(next).length !== Object.keys(raw).length) changed = true;
  }

  return {
    stats: { ...base, provincesExplored: next },
    changed,
  };
}

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
      const parsed = JSON.parse(saved);
      const { stats: scrubbed, changed } = scrubExplorationProvinces(parsed);
      explorationCache = scrubbed;
      cacheTimestamp = Date.now();
      // Persist one-time cleanup of bad keys (e.g. display strings) so Profile map stops over-lighting.
      if (changed) {
        await AsyncStorage.setItem(STORAGE_KEYS.EXPLORATION_STATS, JSON.stringify(scrubbed));
      }
      return explorationCache;
    }

    return defaultStats();
  } catch (e) {
    console.error('Failed to get exploration stats:', e);
    return defaultStats();
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
const VIEWED_TYPE_KEYS = {
  city: 'citiesViewed',
  recipe: 'recipesViewed',
  dynasty: 'dynastiesViewed',
  person: 'peopleViewed',
};

export async function trackViewedItem(type, item) {
  if (!item || !item.id) return;

  const stats = await getExplorationStats();
  const typeKey = VIEWED_TYPE_KEYS[type] || `${type}sViewed`;

  if (!stats[typeKey]) {
    stats[typeKey] = [];
  }

  // Add to viewed list if not already there
  if (!stats[typeKey].includes(item.id)) {
    stats[typeKey] = [...stats[typeKey], item.id].slice(-MAX_VIEWED_ITEMS);
  }

  // Track province exploration (canonical chinaGeo ids only).
  // - city / recipe: primary province of that content only
  // - dynasty: capital + optional heartlandProvinces (multi-province core)
  if (type === 'city' || type === 'recipe' || type === 'dynasty') {
    const provinceKeys = new Set();
    const primary =
      getProvinceId(item) ||
      normalizeProvinceId(item?.province_id || item?.provinceId || item?.province);
    if (primary) provinceKeys.add(primary);

    // Heartland multi-province highlight is only meaningful for dynasties.
    // Do not let other content types bulk-write extras via heartlandProvinces.
    if (type === 'dynasty') {
      const extras = [
        ...(Array.isArray(item?.heartlandProvinces) ? item.heartlandProvinces : []),
        ...(Array.isArray(item?.provinceIds) ? item.provinceIds : []),
      ];
      extras.forEach((id) => {
        const n = normalizeProvinceId(id);
        if (n) provinceKeys.add(n);
      });
    }

    if (!stats.provincesExplored) {
      stats.provincesExplored = {};
    }
    provinceKeys.forEach((provinceKey) => {
      if (!stats.provincesExplored[provinceKey]) {
        stats.provincesExplored[provinceKey] = [];
      }
      if (!stats.provincesExplored[provinceKey].includes(item.id)) {
        stats.provincesExplored[provinceKey] = [
          ...stats.provincesExplored[provinceKey],
          item.id,
        ];
      }
    });
  }

  // Always re-scrub before save so alias collisions collapse to one geo id
  const { stats: clean } = scrubExplorationProvinces(stats);
  await saveExplorationStats(clean);
  return clean;
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
  const typeKey = VIEWED_TYPE_KEYS[type] || `${type}sViewed`;
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
