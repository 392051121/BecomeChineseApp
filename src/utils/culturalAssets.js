import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_LIMITS, getCultureRank as getCultureRankConfig } from '../config/gamification';
import { STORAGE_KEYS } from '../config/storageKeys';
import { CACHE_CONFIG, STORAGE_LIMITS as LIMITS } from '../config/constants';
import { showError, ERROR_MESSAGES, logger } from './errorHandling';
import { updateTaskProgress } from './dailyTasks';

const MAX_RECENT_ITEMS = STORAGE_LIMITS.MAX_RECENT_ITEMS;

// In-memory cache to reduce AsyncStorage reads
let cachedAssets = null;
let cacheTimestamp = 0;
const CACHE_TTL = CACHE_CONFIG.DEFAULT_TTL_MS;

function todayKey(date = new Date()) {
  // Use local date components instead of UTC to avoid timezone issues
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function normalizeArray(input) {
  return Array.isArray(input) ? input : [];
}

export function getProvinceId(item) {
  return item?.province_id ?? item?.provinceId ?? item?.province ?? null;
}

function ensureState(raw) {
  const state = raw && typeof raw === 'object' ? raw : {};
  return {
    favorites: {
      names: normalizeArray(state?.favorites?.names),
      cities: normalizeArray(state?.favorites?.cities),
      recipes: normalizeArray(state?.favorites?.recipes),
      dynasties: normalizeArray(state?.favorites?.dynasties),
      people: normalizeArray(state?.favorites?.people),
    },
    quiz: {
      streak: Number(state?.quiz?.streak ?? 0),
      totalSolved: Number(state?.quiz?.totalSolved ?? 0),
      lastSolvedDate: state?.quiz?.lastSolvedDate ?? null,
      solvedByDate: state?.quiz?.solvedByDate && typeof state.quiz.solvedByDate === 'object' ? state.quiz.solvedByDate : {},
    },
    stats: {
      namesGenerated: Number(state?.stats?.namesGenerated ?? 0),
    },
    meta: {
      updatedAt: state?.meta?.updatedAt ?? null,
    },
  };
}

export async function getCulturalAssets() {
  // Return cached data if still valid
  const now = Date.now();
  if (cachedAssets && (now - cacheTimestamp) < CACHE_TTL) {
    return cachedAssets;
  }

  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.CULTURAL_ASSETS);
    const parsed = raw ? JSON.parse(raw) : null;
    const result = ensureState(parsed);
    // Update cache
    cachedAssets = result;
    cacheTimestamp = now;
    return result;
  } catch (error) {
    logger.error('CulturalAssets', 'Failed to load cultural assets', error);
    showError(ERROR_MESSAGES.LOAD_FAILED);
    return ensureState(null);
  }
}

export async function saveCulturalAssets(nextState) {
  try {
    const normalized = ensureState(nextState);
    const payload = {
      ...normalized,
      meta: {
        ...normalized.meta,
        updatedAt: new Date().toISOString(),
      },
    };
    await AsyncStorage.setItem(STORAGE_KEYS.CULTURAL_ASSETS, JSON.stringify(payload));
    // Update cache with the new data
    cachedAssets = payload;
    cacheTimestamp = Date.now();
    return payload;
  } catch (error) {
    logger.error('CulturalAssets', 'Failed to save cultural assets', error);
    showError(ERROR_MESSAGES.SAVE_FAILED);
    return ensureState(nextState);
  }
}

export async function patchCulturalAssets(patchFn) {
  // Use cached data if available to avoid extra read
  const current = cachedAssets || await getCulturalAssets();
  const next = patchFn(current);
  return saveCulturalAssets(next);
}

// Invalidate cache to force fresh data load
export function invalidateAssetsCache() {
  cachedAssets = null;
  cacheTimestamp = 0;
}

export function buildProvinceStats({ favorites, cities, recipes }) {
  const provinceMap = new Map();
  const allTagged = [...cities, ...recipes].filter((item) => getProvinceId(item));
  allTagged.forEach((item) => {
    const provinceId = getProvinceId(item);
    if (!provinceMap.has(provinceId)) {
      provinceMap.set(provinceId, { total: 0, visited: false });
    }
    provinceMap.get(provinceId).total += 1;
  });

  const nameFavorites = normalizeArray(favorites?.names);
  nameFavorites.forEach((fav) => {
    const provinceId = getProvinceId(fav);
    if (!provinceId) return;
    if (!provinceMap.has(provinceId)) {
      provinceMap.set(provinceId, { total: 0, visited: false });
    }
    provinceMap.get(provinceId).visited = true;
  });

  const provinceList = [...normalizeArray(favorites?.cities), ...normalizeArray(favorites?.recipes)]
    .map((item) => getProvinceId(item))
    .filter(Boolean);

  provinceList.forEach((provinceId) => {
    if (!provinceMap.has(provinceId)) {
      provinceMap.set(provinceId, { total: 0, visited: false });
    }
    provinceMap.get(provinceId).visited = true;
  });

  const provinces = Array.from(provinceMap.entries()).map(([province, value]) => ({
    province,
    ...value,
  }));
  const connected = provinces.filter((item) => item.visited).length;
  return {
    provinces,
    connected,
    total: provinces.length,
  };
}

function daysBetween(a, b) {
  const da = new Date(a);
  const db = new Date(b);
  const start = new Date(da.getFullYear(), da.getMonth(), da.getDate()).getTime();
  const end = new Date(db.getFullYear(), db.getMonth(), db.getDate()).getTime();
  return Math.round((end - start) / (24 * 60 * 60 * 1000));
}

export function calculateNextStreak(previousDate, nowDate = new Date()) {
  if (!previousDate) return 1;
  const diff = daysBetween(previousDate, nowDate);
  if (diff <= 0) return null;
  if (diff === 1) return 'increment';
  return 'reset';
}

function uniqueById(list) {
  return list.filter((item, index, arr) => arr.findIndex((x) => x?.id === item?.id) === index);
}

export async function addNameFavorite(namePayload) {
  const result = await patchCulturalAssets((state) => {
    const nextNames = uniqueById([namePayload, ...state.favorites.names]).slice(0, LIMITS.MAX_FAVORITES_PER_TYPE);
    return {
      ...state,
      favorites: {
        ...state.favorites,
        names: nextNames,
      },
    };
  });
  return result;
}

export async function incrementNamesGenerated() {
  const result = await patchCulturalAssets((state) => ({
    ...state,
    stats: {
      ...state.stats,
      namesGenerated: (state.stats?.namesGenerated ?? 0) + 1,
    },
  }));
  return result;
}

export async function toggleCollectionItem(type, item) {
  if (!item?.id) return getCulturalAssets();
  const result = await patchCulturalAssets((state) => {
    const current = normalizeArray(state.favorites?.[type]);
    const exists = current.some((x) => x?.id === item.id);
    const nextList = exists ? current.filter((x) => x?.id !== item.id) : uniqueById([item, ...current]).slice(0, LIMITS.MAX_FAVORITES_PER_TYPE);
    return {
      ...state,
      favorites: {
        ...state.favorites,
        [type]: nextList,
      },
    };
  });
  // Update daily task progress for collection
  const currentList = result.favorites?.[type] || [];
  const wasAdded = currentList.some((x) => x?.id === item.id);
  if (wasAdded) {
    updateTaskProgress('collect', 1).catch(() => {});
  }
  return result;
}

export async function setCollectionItem(type, item, nextActive) {
  if (!item?.id) return getCulturalAssets();
  return patchCulturalAssets((state) => {
    const current = normalizeArray(state.favorites?.[type]);
    const exists = current.some((x) => x?.id === item.id);
    let nextList = current;
    if (nextActive && !exists) nextList = uniqueById([item, ...current]).slice(0, LIMITS.MAX_FAVORITES_PER_TYPE);
    if (!nextActive && exists) nextList = current.filter((x) => x?.id !== item.id);
    return {
      ...state,
      favorites: {
        ...state.favorites,
        [type]: nextList,
      },
    };
  });
}

export async function getFavoritesSnapshot() {
  const assets = await getCulturalAssets();
  return assets.favorites;
}

export async function markQuizSolvedToday({ date = new Date(), solved = false, correct = false }) {
  const result = await patchCulturalAssets((state) => {
    const day = todayKey(date);
    const prevDate = state.quiz.lastSolvedDate;
    let streak = state.quiz.streak;
    let totalSolved = state.quiz.totalSolved;

    const alreadyMarked = Boolean(state.quiz.solvedByDate?.[day]);
    if (solved && !alreadyMarked) {
      // First time solving today
      if (!prevDate) {
        // No previous record, start streak at 1
        streak = 1;
      } else {
        const diff = daysBetween(prevDate, date);
        if (diff === 1) {
          // Consecutive day, increment streak
          streak += 1;
        } else if (diff <= 0) {
          // Same day (shouldn't happen due to alreadyMarked check, but handle it)
          // Keep current streak
        } else {
          // Gap in days, reset streak
          streak = 1;
        }
      }
      totalSolved += 1;
    }

    return {
      ...state,
      quiz: {
        ...state.quiz,
        streak,
        totalSolved,
        lastSolvedDate: solved ? day : prevDate,
        solvedByDate: {
          ...state.quiz.solvedByDate,
          [day]: { solved: true, correct },
        },
      },
    };
  });

  // Update daily task progress for quiz
  if (solved) {
    updateTaskProgress('quiz', 1).catch(() => {});
    // Check streak task
    if (result.quiz.streak > 0) {
      updateTaskProgress('streak', 1).catch(() => {});
    }
  }

  return result;
}

export function getCultureRank(connected) {
  return getCultureRankConfig(connected);
}

export function getProvinceConnectionMap({ favorites, cities, recipes, dynasties }) {
  const provinceMap = new Map();
  const sourceLists = [normalizeArray(cities), normalizeArray(recipes), normalizeArray(dynasties)];
  sourceLists.flat().forEach((item) => {
    const provinceId = getProvinceId(item);
    if (!provinceId) return;
    if (!provinceMap.has(provinceId)) {
      provinceMap.set(provinceId, { collected: 0, connected: false });
    }
    provinceMap.get(provinceId).collected += 1;
  });

  const collectedItems = [
    ...normalizeArray(favorites?.cities),
    ...normalizeArray(favorites?.recipes),
    ...normalizeArray(favorites?.dynasties),
    ...normalizeArray(favorites?.names),
  ];
  collectedItems.forEach((item) => {
    const provinceId = getProvinceId(item);
    if (!provinceId) return;
    if (!provinceMap.has(provinceId)) {
      provinceMap.set(provinceId, { collected: 0, connected: false });
    }
    provinceMap.get(provinceId).connected = true;
  });

  const provinces = [...provinceMap.entries()].map(([province, value]) => ({ province, ...value }));
  const collectedCount = provinces.filter((item) => item.connected).length;
  return {
    provinces,
    collectedCount,
    totalCount: provinces.length,
    connectedProvinces: new Set(provinces.filter((item) => item.connected).map((item) => item.province)),
  };
}

// Recently viewed items
export async function addRecentlyViewed(item) {
  if (!item?.id || !item?.type) return getRecentlyViewed();
  try {
    const current = await getRecentlyViewed();
    const filtered = current.filter((i) => !(i.id === item.id && i.type === item.type));
    const next = [
      { id: item.id, type: item.type, nameEn: item.nameEn, nameCn: item.nameCn, province: item.province, viewedAt: Date.now() },
      ...filtered,
    ].slice(0, MAX_RECENT_ITEMS);
    await AsyncStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(next));

    // Update daily task progress for exploration
    if (item.type === 'city') {
      updateTaskProgress('explore', 1).catch(() => {});
    } else if (item.type === 'recipe') {
      updateTaskProgress('explore', 1).catch(() => {});
    } else if (item.type === 'dynasty' || item.type === 'person') {
      updateTaskProgress('history', 1).catch(() => {});
    }

    return next;
  } catch {
    return [];
  }
}

export async function getRecentlyViewed() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function clearRecentlyViewed() {
  await AsyncStorage.removeItem(STORAGE_KEYS.RECENTLY_VIEWED);
}
