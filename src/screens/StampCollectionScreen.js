/**
 * Stamp Collection Screen
 *
 * Full screen view of user's stamp collection with filtering and stats.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { ScreenHeader } from '../components/ScreenHeader';
import { StampAlbum } from '../components/StampAlbum';
import { StampUnlockAnimation } from '../components/StampUnlockAnimation';

export function StampCollectionScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const [newStamp, setNewStamp] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);

  // Read newly earned stamp from THIS screen's route params and consume it
  useEffect(() => {
    const stamp = route.params?.newStamp;
    if (stamp) {
      setNewStamp(stamp);
      setShowAnimation(true);
      navigation.setParams({ newStamp: undefined });
    }
  }, [route.params?.newStamp, navigation]);

  const handleStampPress = useCallback((stamp) => {
    // Deep-link into the matching tab/detail so the stamp opens real content.
    // Tab name for cities is Places (TravelScreen), not the legacy "Travel".
    const contentId = stamp?.contentId || stamp?.content?.id;
    const type = stamp?.type;

    if (type === 'city' && contentId) {
      navigation.getParent()?.navigate('Places', { cityId: contentId });
      return;
    }
    if (type === 'food' && contentId) {
      navigation.getParent()?.navigate('Food', { recipeId: contentId });
      return;
    }
    if (type === 'dynasty' && contentId) {
      navigation.getParent()?.navigate('History', {
        screen: 'DynastyDetail',
        params: { dynastyId: contentId },
      });
      return;
    }
    if (type === 'person' && contentId) {
      navigation.getParent()?.navigate('History', {
        screen: 'PersonDetail',
        params: { personId: contentId },
      });
      return;
    }

    // Fallback: switch tab only when id is missing
    const tabOnly = {
      city: 'Places',
      food: 'Food',
      dynasty: 'History',
      person: 'History',
    }[type];
    if (tabOnly) {
      navigation.getParent()?.navigate(tabOnly);
    }
  }, [navigation]);

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
    paddingHorizontal: theme.spacing.md,
  },
});
