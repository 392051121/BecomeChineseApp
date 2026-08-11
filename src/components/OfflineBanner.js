import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WifiOff } from 'lucide-react-native';

import { useNetworkStatus } from '../utils/network';
import { useTheme } from '../theme/ThemeContext';

// Presentational banner: shows only when the device has no internet.
// Uses the shared useNetworkStatus hook so it stays in sync with any
// other offline handling around the app (network toasts etc.).
export function OfflineBanner() {
  const { isOffline } = useNetworkStatus();
  const { isDark } = useTheme();

  if (!isOffline) return null;

  return (
    <View
      style={[styles.banner, { backgroundColor: isDark ? '#3A2E1E' : '#FBF1E3' }]}
      accessibilityRole="alert"
      accessibilityLabel="You are offline"
    >
      <WifiOff size={16} color={isDark ? '#E4B584' : '#8A5A1F'} strokeWidth={2} />
      <View style={styles.textWrap}>
        <Text style={[styles.title, { color: isDark ? '#F5F0E8' : '#4A3A20' }]}>
          You're offline
        </Text>
        <Text style={[styles.sub, { color: isDark ? '#D5D0C8' : '#7A6A46' }]}>
          Some content may not be available. Core features still work on-device.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(138, 90, 31, 0.3)',
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
  },
  sub: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 1,
  },
});
