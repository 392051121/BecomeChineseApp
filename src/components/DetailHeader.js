import React from 'react';
import { Pressable, StyleSheet, Text, View, Platform, StatusBar } from 'react-native';
import { ArrowLeft, Share2, Bookmark } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

export function DetailHeader({
  title,
  onBack,
  onShare,
  onBookmark,
  isBookmarked = false,
  showBookmark = false,
  shareLabel = 'Share',
}) {
  const { colors } = useTheme();

  const handleBack = () => {
    Haptics.selectionAsync().catch(() => {});
    onBack?.();
  };

  const handleShare = () => {
    Haptics.selectionAsync().catch(() => {});
    onShare?.();
  };

  const handleBookmark = () => {
    Haptics.selectionAsync().catch(() => {});
    onBookmark?.();
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.backBtn}
        onPress={handleBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        accessibilityHint="Double tap to return to previous screen"
      >
        <ArrowLeft size={16} color={colors.text} strokeWidth={2} />
        <Text style={[styles.backText, { color: colors.text }]}>Back</Text>
      </Pressable>

      {!!title && (
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {title}
        </Text>
      )}

      <View style={styles.actions}>
        {onShare && (
          <Pressable
            style={[styles.actionBtn, { backgroundColor: colors.cinnabarGlow }]}
            onPress={handleShare}
            accessibilityRole="button"
            accessibilityLabel={shareLabel}
          >
            <Share2 size={18} color={colors.primary} strokeWidth={2} />
          </Pressable>
        )}

        {showBookmark && (
          <Pressable
            style={[
              styles.actionBtn,
              { backgroundColor: isBookmarked ? colors.primary : colors.cinnabarGlow },
            ]}
            onPress={handleBookmark}
            accessibilityRole="button"
            accessibilityLabel={isBookmarked ? 'Remove from collection' : 'Add to collection'}
          >
            <Bookmark
              size={18}
              color={isBookmarked ? '#FFFFFF' : colors.primary}
              strokeWidth={2}
              fill={isBookmarked ? colors.primary : 'none'}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 16,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backText: {
    color: theme.colors.text,
    fontWeight: '700',
    fontSize: 14,
  },
  title: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginHorizontal: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
