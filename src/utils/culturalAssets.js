import AsyncStorage from '@react-native-async-storage/async-storage';

const CULTURAL_ASSETS_KEY = 'cultural.assets.v1';

function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function normalizeArray(input) {
  return Array.isArray(input) ? input : [];
}

function ensureState(raw) {
  const state = raw && typeof raw === 'object' ? raw : {};
  return {
    favorites: {
      names: normalizeArray(state?.favorites?.names),
      cities: normalizeArray(state?.favorites?.cities),
      recipes: normalizeArray(state?.favorites?.recipes),
      dynasties: normalizeArray(state?.favorites?.dynasties),
    },
    quiz: {
      streak: Number(state?.quiz?.streak ?? 0),
      totalSolved: Number(state?.quiz?.totalSolved ?? 0),
      lastSolvedDate: state?.quiz?.lastSolvedDate ?? null,
      solvedByDate: state?.quiz?.solvedByDate && typeof state.quiz.solvedByDate === 'object' ? state.quiz.solvedByDate : {},
    },
    meta: {
      updatedAt: state?.meta?.updatedAt ?? null,
    },
  };
}

export async function getCulturalAssets() {
  try {
    const raw = await AsyncStorage.getItem(CULTURAL_ASSETS_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return ensureState(parsed);
  } catch {
    return ensureState(null);
  }
}

export async function saveCulturalAssets(nextState) {
  const normalized = ensureState(nextState);
  const payload = {
    ...normalized,
    meta: {
      ...normalized.meta,
      updatedAt: new Date().toISOString(),
    },
  };
  await AsyncStorage.setItem(CULTURAL_ASSETS_KEY, JSON.stringify(payload));
  return payload;
}

export async function patchCulturalAssets(patchFn) {
  const current = await getCulturalAssets();
  const next = patchFn(current);
  return saveCulturalAssets(next);
}

export function buildProvinceStats({ favorites, cities, recipes }) {
  const provinceMap = new Map();
  const allTagged = [...cities, ...recipes].filter((item) => item?.province);
  allTagged.forEach((item) => {
    if (!provinceMap.has(item.province)) {
      provinceMap.set(item.province, { total: 0, visited: false });
    }
    provinceMap.get(item.province).total += 1;
  });

  const nameFavorites = normalizeArray(favorites?.names);
  nameFavorites.forEach((fav) => {
    if (!fav?.province) return;
    if (!provinceMap.has(fav.province)) {
      provinceMap.set(fav.province, { total: 0, visited: false });
    }
    provinceMap.get(fav.province).visited = true;
  });

  const provinceList = [...normalizeArray(favorites?.cities), ...normalizeArray(favorites?.recipes)]
    .map((item) => item?.province)
    .filter(Boolean);

  provinceList.forEach((province) => {
    if (!provinceMap.has(province)) {
      provinceMap.set(province, { total: 0, visited: false });
    }
    provinceMap.get(province).visited = true;
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
  return patchCulturalAssets((state) => {
    const nextNames = uniqueById([namePayload, ...state.favorites.names]).slice(0, 60);
    return {
      ...state,
      favorites: {
        ...state.favorites,
        names: nextNames,
      },
    };
  });
}

export async function toggleCollectionItem(type, item) {
  if (!item?.id) return getCulturalAssets();
  return patchCulturalAssets((state) => {
    const current = normalizeArray(state.favorites?.[type]);
    const exists = current.some((x) => x?.id === item.id);
    const nextList = exists ? current.filter((x) => x?.id !== item.id) : uniqueById([item, ...current]).slice(0, 60);
    return {
      ...state,
      favorites: {
        ...state.favorites,
        [type]: nextList,
      },
    };
  });
}

export async function markQuizSolvedToday({ date = new Date(), solved = false }) {
  return patchCulturalAssets((state) => {
    const day = todayKey(date);
    const prevDate = state.quiz.lastSolvedDate;
    let streak = state.quiz.streak;
    let totalSolved = state.quiz.totalSolved;

    const alreadyMarked = Boolean(state.quiz.solvedByDate?.[day]);
    if (solved && !alreadyMarked) {
      const mode = calculateNextStreak(prevDate, date);
      if (mode === 'increment') streak += 1;
      else streak = 1;
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
          [day]: solved || alreadyMarked,
        },
      },
    };
  });
}

export function getCultureRank(connected) {
  if (connected >= 8) return 'Gold Wanderer';
  if (connected >= 4) return 'Silver Explorer';
  if (connected >= 1) return 'Bronze Traveler';
  return 'Wanderer Seed';
}
