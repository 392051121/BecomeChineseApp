/**
 * Stamp Card Component
 *
 * Displays a single cultural stamp with traditional Chinese seal aesthetic.
 */

import React, { memo } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { getRarityConfig } from '../config/rarity';
import { STAMP_SEAL_DESIGNS } from '../data/stamps';

export const StampCard = memo(function StampCard({
  stamp,
  size = 'medium',
  onPress,
  showDetails = true,
  animated = false,
}) {
  const { colors } = useTheme();
  const rarityConfig = getRarityConfig(stamp.rarity);

  const sizes = {
    small: { width: 60, height: 60, fontSize: 14 },
    medium: { width: 80, height: 80, fontSize: 18 },
    large: { width: 100, height: 100, fontSize: 24 },
  };

  const sizeConfig = sizes[size] || sizes.medium;
  const design = STAMP_SEAL_DESIGNS[stamp.visualStyle?.shape] || STAMP_SEAL_DESIGNS.square;

  const handlePress = () => {
    onPress?.(stamp);
  };

  const borderColor = stamp.visualStyle?.borderColor || rarityConfig.color;
  const backgroundColor = stamp.visualStyle?.backgroundColor || colors.surface;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { width: sizeConfig.width + 20 },
        pressed && styles.pressed,
      ]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`${stamp.contentNameEn} stamp, ${stamp.rarity}`}
    >
      {/* Stamp Seal */}
      <View
        style={[
          styles.seal,
          {
            width: sizeConfig.width,
            height: sizeConfig.height,
            borderColor,
            backgroundColor,
          },
          stamp.visualStyle?.glow && {
            shadowColor: rarityConfig.color,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 8,
            elevation: 8,
          },
        ]}
      >
        {/* Inner border */}
        <View
          style={[
            styles.innerBorder,
            {
              borderColor,
              borderRadius: stamp.visualStyle?.shape === 'round' ? sizeConfig.width / 2 - 6 : 4,
            },
          ]}
        >
          {/* Stamp character */}
          <Text
            style={[
              styles.stampChar,
              { fontSize: sizeConfig.fontSize, color: borderColor },
            ]}
            numberOfLines={1}
          >
            {stamp.contentNameCn?.charAt(0) || '印'}
          </Text>
        </View>

        {/* Rarity indicator */}
        {stamp.rarity !== 'common' && (
          <View
            style={[
              styles.rarityDot,
              { backgroundColor: rarityConfig.color },
            ]}
          />
        )}
      </View>

      {/* Details */}
      {showDetails && (
        <View style={styles.details}>
          <Text style={styles.stampName} numberOfLines={1}>
            {stamp.contentNameCn}
          </Text>
          <Text style={[styles.stampNameEn, { color: colors.mutedText }]} numberOfLines={1}>
            {stamp.contentNameEn}
          </Text>
          {stamp.rarity !== 'common' && (
            <Text style={[styles.rarityLabel, { color: rarityConfig.color }]}>
              {rarityConfig.name}
            </Text>
          )}
        </View>
      )}
    </Pressable>
  );
});

// Animated version for unlock animation
export const AnimatedStampCard = memo(function AnimatedStampCard({
  stamp,
  size = 'large',
  scale = 1,
  opacity = 1,
  onPress,
}) {
  return (
    <Animated.View
      style={{
        transform: [{ scale }],
        opacity,
      }}
    >
      <StampCard stamp={stamp} size={size} onPress={onPress} />
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 4,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  seal: {
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  innerBorder: {
    flex: 1,
    width: '100%',
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampChar: {
    fontWeight: '600',
    textAlign: 'center',
  },
  rarityDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  details: {
    marginTop: 6,
    alignItems: 'center',
  },
  stampName: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
  },
  stampNameEn: {
    fontSize: 9,
    fontWeight: '500',
    marginTop: 1,
    textAlign: 'center',
  },
  rarityLabel: {
    fontSize: 8,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 2,
    letterSpacing: 0.5,
  },
});
