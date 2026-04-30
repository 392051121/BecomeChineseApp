/**
 * Badge Unlock Checker
 *
 * Checks for newly unlocked badges and triggers notifications.
 */

import { badges, checkBadgeUnlocked } from '../data/badges';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config/storageKeys';
import { showError, ERROR_MESSAGES, logger } from './errorHandling';

/**
 * Get previously unlocked badge IDs
 */
async function getPreviouslyUnlockedIds() {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.UNLOCKED_BADGES);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    logger.error('BadgeUnlock', 'Failed to get previously unlocked badges', error);
    showError(ERROR_MESSAGES.LOAD_FAILED);
    return [];
  }
}

/**
 * Save unlocked badge IDs
 */
async function saveUnlockedIds(ids) {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.UNLOCKED_BADGES, JSON.stringify(ids));
  } catch (error) {
    logger.error('BadgeUnlock', 'Failed to save unlocked badges', error);
    showError(ERROR_MESSAGES.SAVE_FAILED);
  }
}

/**
 * Check for newly unlocked badges and return them
 */
export async function checkForNewBadges(stats) {
  const previousIds = await getPreviouslyUnlockedIds();
  const currentUnlocked = badges.filter((b) => checkBadgeUnlocked(b, stats));
  const currentIds = currentUnlocked.map((b) => b.id);

  // Find newly unlocked badges
  const newBadges = currentUnlocked.filter((b) => !previousIds.includes(b.id));

  // Update stored IDs
  await saveUnlockedIds(currentIds);

  return newBadges;
}

/**
 * Check and notify for new badges
 */
export async function checkAndNotifyBadges(stats, notificationCallback) {
  const newBadges = await checkForNewBadges(stats);

  if (newBadges.length > 0 && notificationCallback) {
    // Show notification for the first new badge
    notificationCallback(newBadges[0]);
  }

  return newBadges;
}