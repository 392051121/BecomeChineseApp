/**
 * Daily Notification — "Today's Solar Term" cultural reminder
 *
 * A purely on-device, no-backend daily push notification. Each day at a fixed
 * time, the app nudges the user with the current solar term (节气): its Chinese
 * name, pinyin, meaning, and one gentle action. This is the retention engine for
 * a culture app — no server needed, since solar-term dates are a fixed annual
 * table shipped in src/data/solarTerms.js.
 *
 * Strategy:
 *   - Schedule a *daily repeating* notification (DailyTriggerInput) pointing at
 *     "today's" solar term.
 *   - Re-schedule on every cold app start so the content always tracks the
 *     current date (the schedule id is stable; we replace its content).
 *   - Wrap every native call in try/catch: on simulators, web, or when the user
 *     denies permission, it silently no-ops instead of crashing.
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getCurrentSolarTerm } from '../data/solarTerms';
import { STORAGE_KEYS } from '../config/storageKeys';

const DAILY_NOTIFICATION_ID = 'daily-solar-term';
const DEFAULT_HOUR = 8; // 08:00 local
const DEFAULT_MINUTE = 30;

/**
 * Build the human-facing content for today's solar term.
 */
function buildTodayContent() {
  try {
    const term = getCurrentSolarTerm(new Date());
    if (!term) return null;

    const title = `${term.chineseName} ${term.englishName}`;
    const bodyParts = [
      term.pinyin,
      term.meaning,
    ].filter(Boolean);
    const body = bodyParts.join(' — ');

    const dailyAction = term.dailyAction || term.custom || '';

    return {
      title,
      body,
      data: {
        type: 'solar-term',
        termId: term.id,
        chineseName: term.chineseName,
        englishName: term.englishName,
        pinyin: term.pinyin,
        dailyAction,
        // Deep-link target: Seasons tab → SolarTermDetail stack screen.
        screen: 'Seasons',
        stackScreen: 'SolarTermDetail',
        termId: term.id,
      },
    };
  } catch {
    return null;
  }
}

/**
 * Configure how notifications are presented while the app is foregrounded.
 * Call once at app start (App.js).
 */
export function configureNotificationHandler() {
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  } catch (e) {
    console.warn('Failed to configure notification handler:', e);
  }
}

/**
 * Request permission to display notifications.
 * @returns {Promise<boolean>} true if granted (or already granted)
 */
export async function requestNotificationPermission() {
  if (Platform.OS === 'web') return false;
  try {
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;

    // iOS requires an explicit permission prompt; Android 13+ too.
    const requested = await Notifications.requestPermissionsAsync();
    return (
      requested.granted ||
      requested.status === 'granted' ||
      requested.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED
    );
  } catch (e) {
    console.warn('Failed to request notification permission:', e);
    return false;
  }
}

/**
 * Schedule (or refresh) the daily solar-term notification.
 * Replaces any existing schedule so content always matches today's term.
 *
 * @param {number} hour - local hour (24h), default 8
 * @param {number} minute - local minute, default 30
 * @returns {Promise<boolean>} true if scheduled successfully
 */
export async function scheduleDailyTermNotification(hour = DEFAULT_HOUR, minute = DEFAULT_MINUTE) {
  if (Platform.OS === 'web') return false;
  try {
    const granted = await requestNotificationPermission();
    if (!granted) return false;

    const content = buildTodayContent();
    if (!content) return false;

    // Cancel the previous schedule (same id is a no-op if none existed) so we
    // never accumulate duplicate daily triggers.
    await cancelDailyNotification();

    await Notifications.scheduleNotificationAsync({
      identifier: DAILY_NOTIFICATION_ID,
      content: {
        title: content.title,
        body: content.body,
        data: content.data,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
    return true;
  } catch (e) {
    console.warn('Failed to schedule daily notification:', e);
    return false;
  }
}

/**
 * Cancel the daily solar-term notification.
 */
export async function cancelDailyNotification() {
  try {
    await Notifications.cancelScheduledNotificationAsync(DAILY_NOTIFICATION_ID);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check whether a daily notification is currently scheduled.
 */
export async function isDailyNotificationScheduled() {
  if (Platform.OS === 'web') return false;
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    return scheduled.some((n) => n.identifier === DAILY_NOTIFICATION_ID);
  } catch {
    return false;
  }
}

/**
 * Resolve the notification tap → navigation target. Produces a stable payload
 * the app can route to the solar-term detail screen.
 */
export function resolveNotificationTarget(response) {
  try {
    const data = response?.notification?.request?.content?.data;
    if (data?.screen === 'Seasons' && data.termId) {
      return { screen: 'Seasons', stackScreen: data.stackScreen || 'SolarTermDetail', params: { termId: data.termId } };
    }
    return null;
  } catch {
    return null;
  }
}

export { DAILY_NOTIFICATION_ID, DEFAULT_HOUR, DEFAULT_MINUTE };

/**
 * Read the user's daily-reminder preference. Defaults to enabled so the
 * retention loop is on by default, but can be turned off from Profile.
 * @returns {Promise<boolean>}
 */
export async function isDailyReminderEnabled() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_REMINDER_ENABLED);
    // Absent → default enabled.
    if (raw === null || raw === undefined) return true;
    return raw === 'true' || raw === '1';
  } catch {
    return true;
  }
}

/**
 * Persist the user's daily-reminder preference and apply it immediately
 * (schedule when enabled, cancel when disabled).
 * @param {boolean} enabled
 * @returns {Promise<boolean>}
 */
export async function setDailyReminderEnabled(enabled) {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.DAILY_REMINDER_ENABLED, enabled ? 'true' : 'false');
  } catch (e) {
    console.warn('Failed to persist reminder preference:', e);
  }
  if (enabled) {
    return scheduleDailyTermNotification();
  }
  await cancelDailyNotification();
  return false;
}
