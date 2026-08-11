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

/** Local calendar day key YYYY-MM-DD (NOT UTC). Shared by quiz/home/tasks/review. */
export function todayKey(date = new Date()) {
  // Use local date components instead of UTC to avoid timezone issues
  const d = date instanceof Date ? date : parseLocalDate(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Parse YYYY-MM-DD as local midnight (avoids UTC Date string shift). */
function parseLocalDate(value) {
  if (value instanceof Date) return value;
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    const [y, m, d] = value.slice(0, 10).split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(value);
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

// Serialize patch operations so concurrent RMW (favorite + quiz + stamp-related
// progress writing cultural assets at once) cannot overwrite each other.
let assetsPatchQueue = Promise.resolve();

export async function patchCulturalAssets(patchFn) {
  const run = async () => {
    // Prefer cache (kept fresh by saveCulturalAssets) but fall back to storage.
    const current = cachedAssets || (await getCulturalAssets());
    const next = patchFn(current);
    return saveCulturalAssets(next);
  };
  // Chain onto the previous patch so writers run strictly in order.
  const job = assetsPatchQueue.then(run, run);
  // Keep the queue alive even if a patch rejects.
  assetsPatchQueue = job.then(
    () => undefined,
    () => undefined
  );
  return job;
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
  const da = parseLocalDate(a);
  const db = parseLocalDate(b);
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

/**
 * Batch set the active/collected state of an entire category.
 * Used by the "collect all / clear all" bulk entry in the Collection screen.
 * Unlike the single-item toggle, a batch "collect all" is an explicit user
 * intent, so it does not slice to MAX_FAVORITES_PER_TYPE (which would silently
 * drop items such as the 102 cities), and it does not bump the daily "collect"
 * task progress once per item (which would over-credit a single tap).
 * @param {string} type  category key ('cities' | 'recipes' | 'dynasties' | 'people')
 * @param {boolean} nextActive  true => collect all `allItems`; false => clear the category
 * @param {Array<{id:string}>} [allItems]  full candidate list of this category
 */
export async function setCollectionActive(type, nextActive, allItems = []) {
  if (!type) return getCulturalAssets();
  return patchCulturalAssets((state) => {
    const current = normalizeArray(state.favorites?.[type]);
    const nextList = nextActive
      ? uniqueById([...current, ...allItems].filter(Boolean))
      : [];
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

/**
 * Record today's daily quiz attempt.
 * - Always stores solvedByDate[day] so Home/hooks know the day was attempted.
 * - streak / totalSolved only advance on a CORRECT answer (product rule: badges
 *   and "X day streak" mean correct, not mere participation).
 * - A wrong first attempt today resets streak to 0.
 */
export async function markQuizSolvedToday({ date = new Date(), solved = false, correct = false }) {
  const result = await patchCulturalAssets((state) => {
    const day = todayKey(date);
    const prevDate = state.quiz.lastSolvedDate;
    let streak = state.quiz.streak;
    let totalSolved = state.quiz.totalSolved;

    const alreadyMarked = Boolean(state.quiz.solvedByDate?.[day]);
    if (solved && !alreadyMarked) {
      if (correct) {
        // Correct first attempt today → grow or start the streak
        if (!prevDate) {
          streak = 1;
        } else {
          const diff = daysBetween(prevDate, date);
          if (diff === 1) {
            streak += 1;
          } else if (diff <= 0) {
            // Same-day re-entry (shouldn't reach here due to alreadyMarked)
          } else {
            streak = 1;
          }
        }
        totalSolved += 1;
      } else {
        // Wrong first attempt today → break the streak; do not count as solved
        streak = 0;
      }
    }

    return {
      ...state,
      quiz: {
        ...state.quiz,
        streak,
        totalSolved,
        // lastSolvedDate tracks consecutive correct days only
        lastSolvedDate: solved && correct ? day : prevDate,
        solvedByDate: {
          ...state.quiz.solvedByDate,
          [day]: { solved: true, correct: Boolean(correct) },
        },
      },
    };
  });

  // Daily tasks: quiz task on any attempt; streak task only after a correct day
  if (solved) {
    updateTaskProgress('quiz', 1).catch(() => {});
    if (correct && result.quiz.streak > 0) {
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
