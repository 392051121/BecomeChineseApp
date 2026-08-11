/**
 * Smoke tests for the OfflineBanner.
 *
 * This project's component rendering infra (@testing-library/react-native v14)
 * does not resolve cleanly under the current jest-expo/node preset, so like the
 * PrivacyPolicyScreen test we keep this to a module-loading smoke assertion
 * plus a target-based check that the banner exist on the real App root. The
 * connectivity logic itself lives in the shared useNetworkStatus hook.
 */

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: () => () => {},
  fetch: () => Promise.resolve({ isConnected: true, isInternetReachable: true }),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn().mockResolvedValue(undefined),
  impactAsync: jest.fn().mockResolvedValue(undefined),
  notificationAsync: jest.fn().mockResolvedValue(undefined),
}));

describe('OfflineBanner module', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('exports an OfflineBanner component', () => {
    const { OfflineBanner } = require('../../components/OfflineBanner');
    expect(typeof OfflineBanner).toBe('function');
  });

  test('banner is mounted at the app root (AppContent main tree)', () => {
    const fs = require('fs');
    const path = require('path');
    const appSource = fs.readFileSync(path.resolve(__dirname, '../../../App.js'), 'utf8');

    // Expect the import to exist and the <OfflineBanner /> to be wired right
    // before RootTabs in the render tree (banner sits on top of the tabs).
    expect(appSource).toContain("import { OfflineBanner } from './src/components/OfflineBanner';");
    expect(appSource).toContain('<OfflineBanner />');
    expect(appSource.indexOf('<OfflineBanner />')).toBeGreaterThan(-1);
    expect(appSource.indexOf('<OfflineBanner />')).toBeLessThan(appSource.indexOf('<RootTabs />'));
  });
});
