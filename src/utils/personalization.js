/**
 * Personalization System
 *
 * Avatar frames and titles for user customization.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config/storageKeys';
import { logger } from './errorHandling';

// Available avatar frames
export const AVATAR_FRAMES = [
  {
    id: 'default',
    name: 'Default',
    nameCn: '默认',
    borderColor: '#E5E7EB',
    glowColor: null,
    requirement: null,
    rarity: 'common',
  },
  {
    id: 'bronze',
    name: 'Bronze',
    nameCn: '青铜',
    borderColor: '#CD7F32',
    glowColor: '#CD7F3220',
    requirement: { type: 'level', value: 5 },
    rarity: 'common',
  },
  {
    id: 'silver',
    name: 'Silver',
    nameCn: '白银',
    borderColor: '#C0C0C0',
    glowColor: '#C0C0C020',
    requirement: { type: 'level', value: 10 },
    rarity: 'rare',
  },
  {
    id: 'gold',
    name: 'Gold',
    nameCn: '黄金',
    borderColor: '#FFD700',
    glowColor: '#FFD70030',
    requirement: { type: 'level', value: 20 },
    rarity: 'epic',
  },
  {
    id: 'jade',
    name: 'Jade',
    nameCn: '翡翠',
    borderColor: '#00A86B',
    glowColor: '#00A86B30',
    requirement: { type: 'collection', value: 50 },
    rarity: 'epic',
  },
  {
    id: 'cinnabar',
    name: 'Cinnabar',
    nameCn: '朱砂',
    borderColor: '#B33B24',
    glowColor: '#B33B2440',
    requirement: { type: 'streak', value: 30 },
    rarity: 'legendary',
  },
  {
    id: 'imperial',
    name: 'Imperial',
    nameCn: '御用',
    borderColor: '#8B0000',
    glowColor: '#8B000050',
    requirement: { type: 'achievement', value: 'master' },
    rarity: 'legendary',
  },
];

// Available titles
export const TITLES = [
  {
    id: 'traveler',
    name: 'Traveler',
    nameCn: '旅行者',
    requirement: null,
    rarity: 'common',
  },
  {
    id: 'explorer',
    name: 'Explorer',
    nameCn: '探索者',
    requirement: { type: 'cities', value: 5 },
    rarity: 'common',
  },
  {
    id: 'foodie',
    name: 'Foodie',
    nameCn: '美食家',
    requirement: { type: 'recipes', value: 10 },
    rarity: 'rare',
  },
  {
    id: 'historian',
    name: 'Historian',
    nameCn: '历史学家',
    requirement: { type: 'dynasties', value: 5 },
    rarity: 'rare',
  },
  {
    id: 'scholar',
    name: 'Scholar',
    nameCn: '学者',
    requirement: { type: 'quiz', value: 100 },
    rarity: 'epic',
  },
  {
    id: 'master',
    name: 'Master',
    nameCn: '大师',
    requirement: { type: 'level', value: 25 },
    rarity: 'epic',
  },
  {
    id: 'legend',
    name: 'Legend',
    nameCn: '传奇',
    requirement: { type: 'collection', value: 100 },
    rarity: 'legendary',
  },
];

/**
 * Get user's current personalization
 */
export async function getPersonalization() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.USER_PERSONALIZATION);
    if (!raw) {
      return {
        frameId: 'default',
        titleId: 'traveler',
        unlockedFrames: ['default'],
        unlockedTitles: ['traveler'],
      };
    }
    return JSON.parse(raw);
  } catch (e) {
    logger.error('Personalization', 'Failed to get personalization', e);
    return {
      frameId: 'default',
      titleId: 'traveler',
      unlockedFrames: ['default'],
      unlockedTitles: ['traveler'],
    };
  }
}

/**
 * Save personalization
 */
async function savePersonalization(data) {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PERSONALIZATION, JSON.stringify(data));
    return true;
  } catch (e) {
    logger.error('Personalization', 'Failed to save personalization', e);
    return false;
  }
}

/**
 * Set active frame
 */
export async function setActiveFrame(frameId) {
  const data = await getPersonalization();
  if (!data.unlockedFrames.includes(frameId)) {
    return { success: false, message: 'Frame not unlocked' };
  }
  data.frameId = frameId;
  await savePersonalization(data);
  return { success: true };
}

/**
 * Set active title
 */
export async function setActiveTitle(titleId) {
  const data = await getPersonalization();
  if (!data.unlockedTitles.includes(titleId)) {
    return { success: false, message: 'Title not unlocked' };
  }
  data.titleId = titleId;
  await savePersonalization(data);
  return { success: true };
}

/**
 * Check and unlock new frames/titles based on stats
 */
export async function checkUnlocks(stats) {
  const data = await getPersonalization();
  const newUnlocks = [];

  // Check frames
  AVATAR_FRAMES.forEach(frame => {
    if (data.unlockedFrames.includes(frame.id)) return;
    if (!frame.requirement) return;

    const unlocked = checkRequirement(frame.requirement, stats);
    if (unlocked) {
      data.unlockedFrames.push(frame.id);
      newUnlocks.push({ type: 'frame', item: frame });
    }
  });

  // Check titles
  TITLES.forEach(title => {
    if (data.unlockedTitles.includes(title.id)) return;
    if (!title.requirement) return;

    const unlocked = checkRequirement(title.requirement, stats);
    if (unlocked) {
      data.unlockedTitles.push(title.id);
      newUnlocks.push({ type: 'title', item: title });
    }
  });

  if (newUnlocks.length > 0) {
    await savePersonalization(data);
  }

  return { newUnlocks, personalization: data };
}

/**
 * Check if requirement is met
 */
function checkRequirement(req, stats) {
  switch (req.type) {
    case 'level':
      return stats.level >= req.value;
    case 'collection':
      return stats.totalCollected >= req.value;
    case 'cities':
      return stats.citiesCollected >= req.value;
    case 'recipes':
      return stats.recipesCollected >= req.value;
    case 'dynasties':
      return stats.dynastiesCollected >= req.value;
    case 'quiz':
      return stats.quizTotal >= req.value;
    case 'streak':
      return stats.quizStreak >= req.value;
    case 'achievement':
      return stats.achievements?.includes(req.value);
    default:
      return false;
  }
}

/**
 * Get frame by ID
 */
export function getFrameById(frameId) {
  return AVATAR_FRAMES.find(f => f.id === frameId) || AVATAR_FRAMES[0];
}

/**
 * Get title by ID
 */
export function getTitleById(titleId) {
  return TITLES.find(t => t.id === titleId) || TITLES[0];
}
