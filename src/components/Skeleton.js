import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

// Paper texture pattern for skeleton (subtle fiber lines)
function PaperTextureOverlay({ style }) {
  const { isDark } = useTheme();

  return (
    <View style={[styles.paperTexture, style]}>
      {/* Simulated paper fiber lines */}
      {Array.from({ length: 3 }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.fiberLine,
            {
              top: 20 + i * 30,
              opacity: isDark ? 0.03 : 0.02,
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(51, 51, 51, 0.5)',
            },
          ]}
        />
      ))}
    </View>
  );
}

export function Skeleton({ width, height, borderRadius = theme.radii.sm, style, hasTexture = false }) {
  const { colors, isDark } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: theme.motion.durationNormal,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: theme.motion.durationNormal,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [animatedValue]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [
      isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(51, 51, 51, 0.06)',
      isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(51, 51, 51, 0.10)',
    ],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {hasTexture && <PaperTextureOverlay />}
    </Animated.View>
  );
}

export function SkeletonText({ width = '100%', lines = 1, lineHeight = 16, spacing = 8, style }) {
  return (
    <View style={style}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 && lines > 1 ? '60%' : width}
          height={lineHeight}
          borderRadius={4}
          style={index < lines - 1 ? { marginBottom: spacing } : undefined}
        />
      ))}
    </View>
  );
}

export function SkeletonCard({ style }) {
  const { isDark } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(51, 51, 51, 0.02)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(51, 51, 51, 0.06)',
        },
        style,
      ]}
    >
      <Skeleton width="40%" height={12} borderRadius={4} style={{ marginBottom: 12 }} />
      <Skeleton width="80%" height={20} borderRadius={4} style={{ marginBottom: 8 }} />
      <Skeleton width="100%" height={14} borderRadius={4} style={{ marginBottom: 4 }} />
      <Skeleton width="60%" height={14} borderRadius={4} />
    </View>
  );
}

export function SkeletonHeroCard({ style }) {
  const { isDark } = useTheme();

  return (
    <View
      style={[
        styles.heroCard,
        {
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(51, 51, 51, 0.02)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(51, 51, 51, 0.06)',
        },
        style,
      ]}
    >
      <View style={styles.heroTop}>
        <Skeleton width={100} height={24} borderRadius={12} />
        <Skeleton width={60} height={24} borderRadius={12} />
      </View>
      <Skeleton width="70%" height={28} borderRadius={4} style={{ marginTop: 16, marginBottom: 8 }} />
      <Skeleton width="50%" height={16} borderRadius={4} style={{ marginBottom: 12 }} />
      <View style={styles.heroStats}>
        <View style={styles.statItem}>
          <Skeleton width={48} height={24} borderRadius={4} style={{ marginBottom: 4 }} />
          <Skeleton width={60} height={12} borderRadius={4} />
        </View>
        <View style={styles.statItem}>
          <Skeleton width={48} height={24} borderRadius={4} style={{ marginBottom: 4 }} />
          <Skeleton width={60} height={12} borderRadius={4} />
        </View>
        <View style={styles.statItem}>
          <Skeleton width={48} height={24} borderRadius={4} style={{ marginBottom: 4 }} />
          <Skeleton width={60} height={12} borderRadius={4} />
        </View>
      </View>
    </View>
  );
}

export function SkeletonListItem({ style }) {
  const { isDark } = useTheme();

  return (
    <View
      style={[
        styles.listItem,
        {
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : theme.colors.card,
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : theme.colors.border,
        },
        style,
      ]}
    >
      <Skeleton width={40} height={40} borderRadius={10} style={{ marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        <Skeleton width="70%" height={14} borderRadius={4} style={{ marginBottom: 6 }} />
        <Skeleton width="40%" height={12} borderRadius={4} />
      </View>
      <Skeleton width={14} height={14} borderRadius={4} />
    </View>
  );
}

export function SkeletonImageCard({ style }) {
  const { isDark } = useTheme();

  return (
    <View
      style={[
        styles.imageCard,
        {
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(51, 51, 51, 0.02)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(51, 51, 51, 0.06)',
        },
        style,
      ]}
    >
      <Skeleton width="100%" height={140} borderRadius={theme.radii.md} style={{ marginBottom: 12 }} />
      <Skeleton width="60%" height={14} borderRadius={4} style={{ marginBottom: 6 }} />
      <Skeleton width="80%" height={12} borderRadius={4} />
    </View>
  );
}

const styles = StyleSheet.create({
  paperTexture: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  fiberLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
  },
  card: {
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    padding: 16,
  },
  heroCard: {
    borderRadius: theme.radii.lg,
    borderWidth: 0.5,
    padding: 18,
    marginTop: 8,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroStats: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  imageCard: {
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    padding: 12,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  gridItem: {
    width: '48%',
  },
  section: {
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    padding: 16,
  },
});

// Additional skeleton variants for common use cases

export function SkeletonGrid({ count = 6, columns = 2, style }) {
  const rows = Math.ceil(count / columns);

  return (
    <View style={style}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <View key={rowIndex} style={styles.gridRow}>
          {Array.from({ length: columns }).map((_, colIndex) => {
            const itemIndex = rowIndex * columns + colIndex;
            if (itemIndex >= count) return null;
            return <SkeletonImageCard key={colIndex} style={styles.gridItem} />;
          })}
        </View>
      ))}
    </View>
  );
}

export function SkeletonSection({ titleWidth = '30%', itemCount = 3, style }) {
  const { isDark } = useTheme();

  return (
    <View
      style={[
        styles.section,
        {
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : theme.colors.surface,
          borderColor: theme.colors.border,
        },
        style,
      ]}
    >
      <Skeleton width={titleWidth} height={12} borderRadius={4} style={{ marginBottom: 14 }} />
      {Array.from({ length: itemCount }).map((_, i) => (
        <SkeletonListItem key={i} style={i < itemCount - 1 ? { marginBottom: 8 } : undefined} />
      ))}
    </View>
  );
}

// Home screen skeleton
export function SkeletonHomeScreen() {
  const { isDark } = useTheme();

  return (
    <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 12 }}>
      {/* Level header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <Skeleton width={60} height={28} borderRadius={14} />
        <View style={{ flex: 1 }}>
          <Skeleton width="100%" height={4} borderRadius={2} />
        </View>
        <Skeleton width={50} height={14} borderRadius={4} />
      </View>

      {/* Hero card */}
      <SkeletonHeroCard />

      {/* Next step card */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(51, 51, 51, 0.02)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(51, 51, 51, 0.06)',
            marginTop: 14,
          },
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Skeleton width={48} height={48} borderRadius={14} />
          <View style={{ flex: 1 }}>
            <Skeleton width="60%" height={16} borderRadius={4} style={{ marginBottom: 4 }} />
            <Skeleton width="40%" height={12} borderRadius={4} />
          </View>
        </View>
      </View>

      {/* Recent items */}
      <SkeletonSection titleWidth="25%" itemCount={3} style={{ marginTop: 14 }} />
    </View>
  );
}
