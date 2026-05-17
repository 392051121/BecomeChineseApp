/**
 * Daily Sign-In System
 *
 * Manages daily check-in rewards with streak bonuses.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config/storageKeys';
import { logger } from './errorHandling';

// Sign-in rewards configuration
export const SIGN_IN_REWARDS = [
  { day: 1, xp: 10, type: 'xp', label: 'Day 1', labelCn: '第1天' },
  { day: 2, xp: 20, type: 'xp', label: 'Day 2', labelCn: '第2天' },
  { day: 3, xp: 30, type: 'xp', label: 'Day 3', labelCn: '第3天' },
  { day: 4, xp: 40, type: 'xp', label: 'Day 4', labelCn: '第4天' },
  { day: 5, xp: 50, type: 'xp', label: 'Day 5', labelCn: '第5天' },
  { day: 6, xp: 60, type: 'xp', label: 'Day 6', labelCn: '第6天' },
  { day: 7, xp: 100, type: 'bonus', label: 'Week Complete!', labelCn: '满周!' },
];

// Streak bonuses
export const STREAK_BONUSES = [
  { days: 7, multiplier: 1.1, label: '7-Day Streak', labelCn: '7天连续' },
  { days: 14, multiplier: 1.2, label: '14-Day Streak', labelCn: '14天连续' },
  { days: 30, multiplier: 1.5, label: '30-Day Streak', labelCn: '30天连续' },
];

/**
 * Get today's date key (YYYY-MM-DD in local timezone)
 */
function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get sign-in data from storage
 */
export async function getSignInData() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_SIGN_IN);
    if (!raw) {
      return {
        history: [],
        currentStreak: 0,
        longestStreak: 0,
        totalDays: 0,
      };
    }
    return JSON.parse(raw);
  } catch (e) {
    logger.error('SignIn', 'Failed to get sign-in data', e);
    return { history: [], currentStreak: 0, longestStreak: 0, totalDays: 0 };
  }
}

/**
 * Save sign-in data to storage
 */
async function saveSignInData(data) {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.DAILY_SIGN_IN, JSON.stringify(data));
    return true;
  } catch (e) {
    logger.error('SignIn', 'Failed to save sign-in data', e);
    return false;
  }
}

/**
 * Check if user has signed in today
 */
export async function hasSignedInToday() {
  const data = await getSignInData();
  const todayKey = getTodayKey();
  return data.history.includes(todayKey);
}

/**
 * Get current streak count
 */
export async function getCurrentStreak() {
  const data = await getSignInData();
  return data.currentStreak || 0;
}

/**
 * Calculate if streak is still active (signed in yesterday)
 */
function isStreakActive(history) {
  if (history.length === 0) return false;

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');
  const yesterdayKey = `${year}-${month}-${day}`;

  return history.includes(yesterdayKey);
}

/**
 * Sign in for today
 * Returns { success, reward, streak, isNewRecord }
 */
export async function signInToday() {
  const alreadySignedIn = await hasSignedInToday();
  if (alreadySignedIn) {
    return { success: false, message: 'Already signed in today' };
  }

  const data = await getSignInData();
  const todayKey = getTodayKey();

  // Calculate streak
  let newStreak = 1;
  if (isStreakActive(data.history)) {
    newStreak = (data.currentStreak || 0) + 1;
  }

  // Get today's reward
  const dayInCycle = ((newStreak - 1) % 7) + 1;
  const baseReward = SIGN_IN_REWARDS.find(r => r.day === dayInCycle) || SIGN_IN_REWARDS[0];

  // Apply streak bonus
  let multiplier = 1;
  for (const bonus of STREAK_BONUSES) {
    if (newStreak >= bonus.days) {
      multiplier = bonus.multiplier;
    }
  }

  const finalXP = Math.round(baseReward.xp * multiplier);

  // Update data
  const newData = {
    history: [...data.history, todayKey],
    currentStreak: newStreak,
    longestStreak: Math.max(data.longestStreak || 0, newStreak),
    totalDays: (data.totalDays || 0) + 1,
  };

  await saveSignInData(newData);

  return {
    success: true,
    reward: {
      xp: finalXP,
      day: dayInCycle,
      type: baseReward.type,
      label: baseReward.label,
      labelCn: baseReward.labelCn,
    },
    streak: newStreak,
    isNewRecord: newStreak > (data.longestStreak || 0),
    multiplier,
  };
}

/**
 * Get sign-in status for display
 */
export async function getSignInStatus() {
  const data = await getSignInData();
  const signedInToday = await hasSignedInToday();

  const dayInCycle = signedInToday
    ? (data.currentStreak % 7) || 7
    : ((data.currentStreak || 0) % 7) + 1;

  // Get active streak bonus
  let activeBonus = null;
  for (const bonus of STREAK_BONUSES) {
    if ((data.currentStreak || 0) >= bonus.days) {
      activeBonus = bonus;
    }
  }

  return {
    signedInToday,
    currentStreak: data.currentStreak || 0,
    longestStreak: data.longestStreak || 0,
    totalDays: data.totalDays || 0,
    dayInCycle,
    nextReward: SIGN_IN_REWARDS.find(r => r.day === dayInCycle) || SIGN_IN_REWARDS[0],
    activeBonus,
  };
}

/**
 * Get rewards for the current week
 */
export function getWeekRewards(currentDay = 1) {
  return SIGN_IN_REWARDS.map(reward => ({
    ...reward,
    claimed: reward.day < currentDay,
    current: reward.day === currentDay,
    locked: reward.day > currentDay,
  }));
}

/**
 * Reset sign-in data (for testing)
 */
export async function resetSignInData() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.DAILY_SIGN_IN);
    return true;
  } catch (e) {
    logger.error('SignIn', 'Failed to reset sign-in data', e);
    return false;
  }
}
