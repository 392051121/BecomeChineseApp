/**
 * Rarity Badge Component
 *
 * Displays rarity indicator with color and glow effect.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getRarityConfig } from '../config/rarity';

export function RarityBadge({ rarity, size = 'medium', showLabel = true }) {
  const config = getRarityConfig(rarity);

  const sizeStyles = {
    small: { height: 18, paddingHorizontal: 6, fontSize: 9 },
    medium: { height: 22, paddingHorizontal: 8, fontSize: 10 },
    large: { height: 28, paddingHorizontal: 10, fontSize: 12 },
  };

  const currentSize = sizeStyles[size] || sizeStyles.medium;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.glowColor,
          borderColor: config.color,
          height: currentSize.height,
          paddingHorizontal: currentSize.paddingHorizontal,
        },
      ]}
    >
      <Text style={[styles.badgeText, { color: config.color, fontSize: currentSize.fontSize }]}>
        {showLabel ? config.nameCn : '★'}
      </Text>
    </View>
  );
}

/**
 * Rarity Glow Effect
 * Wraps children with a glow effect based on rarity
 */
export function RarityGlow({ rarity, children, style }) {
  const config = getRarityConfig(rarity);

  if (rarity === 'common') {
    return children;
  }

  return (
    <View style={[styles.glowContainer, style]}>
      <View
        style={[
          styles.glowEffect,
          {
            backgroundColor: config.glowColor,
            shadowColor: config.color,
          },
        ]}
      />
      {children}
    </View>
  );
}

/**
 * Rarity Stars
 * Shows stars based on rarity level
 */
export function RarityStars({ rarity, size = 14 }) {
  const config = getRarityConfig(rarity);
  const starCount = {
    common: 1,
    rare: 2,
    epic: 3,
    legendary: 4,
  };

  const count = starCount[rarity] || 1;
  const stars = '★'.repeat(count);

  return (
    <Text style={{ color: config.color, fontSize: size, fontWeight: '700' }}>
      {stars}
    </Text>
  );
}

/**
 * Rarity Progress Bar
 * Shows progress for a specific rarity tier
 */
export function RarityProgressBar({ rarity, current, total, showLabel = true }) {
  const config = getRarityConfig(rarity);
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <View style={styles.progressContainer}>
      {showLabel && (
        <View style={styles.progressHeader}>
          <Text style={[styles.progressLabel, { color: config.color }]}>
            {config.nameCn}
          </Text>
          <Text style={styles.progressCount}>
            {current}/{total}
          </Text>
        </View>
      )}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${percentage}%`,
              backgroundColor: config.color,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  glowContainer: {
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  progressCount: {
    fontSize: 10,
    color: '#6B7280',
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});
