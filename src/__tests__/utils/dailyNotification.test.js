/**
 * Daily notification — scheduling + content + tap routing.
 */

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

import * as Notifications from 'expo-notifications';
import {
  DAILY_NOTIFICATION_ID,
  resolveNotificationTarget,
  scheduleDailyTermNotification,
  cancelDailyNotification,
  isDailyNotificationScheduled,
} from '../../utils/dailyNotification';

describe('dailyNotification', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('exports a stable notification identifier', () => {
    expect(DAILY_NOTIFICATION_ID).toBe('daily-solar-term');
  });

  it('resolves a solar-term tap target to Seasons → SolarTermDetail', () => {
    const target = resolveNotificationTarget({
      notification: {
        request: {
          content: {
            data: { screen: 'Seasons', stackScreen: 'SolarTermDetail', termId: 'start-of-spring' },
          },
        },
      },
    });
    expect(target).toEqual({
      screen: 'Seasons',
      stackScreen: 'SolarTermDetail',
      params: { termId: 'start-of-spring' },
    });
  });

  it('returns null for an unrelated / malformed response', () => {
    expect(resolveNotificationTarget(null)).toBeNull();
    expect(resolveNotificationTarget({ notification: { request: { content: { data: {} } } } })).toBeNull();
  });

  it('cancelDailyNotification never throws and returns a boolean', async () => {
    await expect(cancelDailyNotification()).resolves.toBe(true);
  });
});
