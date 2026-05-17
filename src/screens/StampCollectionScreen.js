/**
 * Stamp Collection Screen
 *
 * Full screen view of user's stamp collection with filtering and stats.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { ScreenHeader } from '../components/ScreenHeader';
import { StampAlbum } from '../components/StampAlbum';
import { StampUnlockAnimation } from '../components/StampUnlockAnimation';
import { getAllStamps, getStampStats } from '../utils/stampCollection';

export function StampCollectionScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [newStamp, setNewStamp] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);

  // Check for newly earned stamp from navigation params
  useEffect(() => {
    const stamp = navigation.getState()?.routes?.find?.(r => r.params?.newStamp)?.params?.newStamp;
    if (stamp) {
      setNewStamp(stamp);
      setShowAnimation(true);
    }
  }, [navigation]);

  const handleStampPress = (stamp) => {
    // Navigate to stamp detail or related content
    const targetScreen = {
      city: 'Travel',
      food: 'Food',
      dynasty: 'History',
      person: 'History',
    }[stamp.type];

    if (targetScreen) {
      navigation.getParent()?.navigate(targetScreen);
    }
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    setNewStamp(null);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScreenHeader
        kicker="Collection"
        title="Stamp Album"
        subtitle="Your cultural exploration stamps"
        style={styles.header}
      />

      <StampAlbum
        onStampPress={handleStampPress}
        showFilters={true}
        showStats={true}
        numColumns={3}
      />

      <StampUnlockAnimation
        visible={showAnimation}
        stamp={newStamp}
        onComplete={handleAnimationComplete}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    marginBottom: 8,
    paddingHorizontal: 20,
  },
});
