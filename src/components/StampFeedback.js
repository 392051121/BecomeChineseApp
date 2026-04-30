import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

// Chinese seal stamp feedback component
// Displays a traditional seal-style stamp animation for completion states
export function StampFeedback({
  label = 'Stamped',
  labelZh = '',
  active = true,
  style,
  shape = 'square', // 'square', 'round'
  tone = 'cinnabar', // 'cinnabar', 'gold', 'soft'
}) {
  const { colors } = useTheme();
  const scale = useRef(new Animated.Value(0.82)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(-12)).current;
  const lift = useRef(new Animated.Value(10)).current;

  const stampStyle = useMemo(() => {
    if (tone === 'gold') {
      return {
        borderColor: colors.success,
        backgroundColor: 'rgba(184, 115, 51, 0.08)',
      };
    }
    if (tone === 'soft') {
      return {
        borderColor: 'rgba(194, 58, 46, 0.65)',
        backgroundColor: 'rgba(194, 58, 46, 0.05)',
      };
    }
    // cinnabar (default)
    return {
      borderColor: colors.primary,
      backgroundColor: 'rgba(194, 58, 46, 0.06)',
    };
  }, [tone, colors]);

  const textStyle = useMemo(() => {
    if (tone === 'gold') {
      return { color: colors.success };
    }
    return { color: colors.primary };
  }, [tone, colors]);

  useEffect(() => {
    if (!active) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    Animated.parallel([
      Animated.sequence([
        Animated.timing(lift, { toValue: 0, duration: theme.motion.durationFast, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 5, tension: 100, useNativeDriver: true }),
      ]),
      Animated.timing(opacity, { toValue: 1, duration: theme.motion.durationFast, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(rotate, { toValue: 0, duration: theme.motion.durationNormal, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();
  }, [active, lift, opacity, rotate, scale]);

  if (!active) return null;

  const isRound = shape === 'round';

  return (
    <Animated.View
      style={[
        styles.wrap,
        isRound && styles.compactWrap,
        {
          opacity,
          transform: [
            { translateY: lift },
            { scale },
            { rotate: rotate.interpolate({ inputRange: [-12, 0], outputRange: ['-12deg', '-3deg'] }) },
          ],
        },
        style,
      ]}
    >
      <View style={[styles.inner, isRound ? styles.round : styles.square, stampStyle]}>
        {/* Inner glow effect */}
        <View style={[styles.innerGlow, isRound ? styles.innerGlowRound : styles.innerGlowSquare]} />

        {/* Decorative inner ring */}
        <View style={[styles.innerRing, isRound && styles.innerRingRound]} />

        {/* Label */}
        {labelZh ? (
          <View style={styles.bilingualLabel}>
            <Text style={[styles.label, textStyle]}>{label}</Text>
            <Text style={[styles.labelZh, textStyle]}>{labelZh}</Text>
          </View>
        ) : (
          <Text style={[styles.label, textStyle]}>{label}</Text>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'flex-start',
  },
  compactWrap: {
    transform: [{ scale: 0.92 }],
  },
  inner: {
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  square: {
    minWidth: 76,
    minHeight: 76,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  round: {
    width: 76,
    height: 76,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  innerGlow: {
    position: 'absolute',
    left: '15%',
    top: '15%',
    right: '15%',
    bottom: '15%',
    borderRadius: 4,
    backgroundColor: 'rgba(194, 58, 46, 0.04)',
  },
  innerGlowRound: {
    borderRadius: 999,
  },
  innerGlowSquare: {
    borderRadius: 4,
  },
  innerRing: {
    position: 'absolute',
    left: 6,
    top: 6,
    right: 6,
    bottom: 6,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(194, 58, 46, 0.12)',
  },
  innerRingRound: {
    borderRadius: 999,
  },
  bilingualLabel: {
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontWeight: '800',
    textAlign: 'center',
  },
  labelZh: {
    fontSize: 9,
    lineHeight: 12,
    marginTop: 2,
    fontWeight: '600',
    opacity: 0.85,
  },
});
