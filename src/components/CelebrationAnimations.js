import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { Animated, StyleSheet, View, Text, Easing, Platform, Dimensions } from 'react-native';
import Svg, { Circle, Path, Rect, Defs, RadialGradient, Stop } from 'react-native-svg';
import * as Haptics from 'expo-haptics';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Gold particle for celebration effects
function GoldParticle({ x, y, delay, size = 4 }) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const drift = (Math.random() - 0.5) * 60;
    const fall = 80 + Math.random() * 40;

    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 4,
          tension: 80,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(translateX, {
          toValue: drift,
          duration: 1200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(translateY, {
          toValue: fall,
          duration: 1200,
          easing: Easing.in(Easing.quad),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(rotation, {
          toValue: 1,
          duration: 1200,
          easing: Easing.linear,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  }, []);

  const rotateStr = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.goldParticle,
        {
          left: x,
          top: y,
          width: size,
          height: size,
          opacity,
          transform: [
            { translateX },
            { translateY },
            { scale },
            { rotate: rotateStr },
          ],
        },
      ]}
    >
      <View style={[styles.goldParticleInner, { backgroundColor: colors.success }]} />
    </Animated.View>
  );
}

// Gold confetti burst effect
export function GoldConfettiBurst({ active = false, origin = { x: 0, y: 0 }, count = 12 }) {
  if (!active) return null;

  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: origin.x + (Math.random() - 0.5) * 40,
      y: origin.y + (Math.random() - 0.5) * 20,
      delay: i * 30,
      size: 3 + Math.random() * 4,
    }));
  }, [origin, count]);

  return (
    <View style={styles.confettiContainer} pointerEvents="none">
      {particles.map((p) => (
        <GoldParticle key={p.id} x={p.x} y={p.y} delay={p.delay} size={p.size} />
      ))}
    </View>
  );
}

// Seal stamp animation for favorite/bookmark actions
export function FavoriteStampAnimation({
  active = false,
  label = 'Saved',
  labelZh = '已收藏',
  onComplete,
}) {
  const { colors } = useTheme();
  const scale = useRef(new Animated.Value(0.3)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(-20)).current;
  const innerGlow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

    Animated.parallel([
      Animated.sequence([
        Animated.spring(scale, {
          toValue: 1.15,
          friction: 4,
          tension: 120,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 5,
          tension: 80,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(rotate, {
        toValue: -3,
        duration: 350,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.sequence([
        Animated.delay(100),
        Animated.timing(innerGlow, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]),
    ]).start(() => {
      onComplete?.();
    });
  }, [active]);

  if (!active) return null;

  const rotateStr = rotate.interpolate({
    inputRange: [-20, 0],
    outputRange: ['-20deg', '0deg'],
  });

  const glowOpacity = innerGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.15],
  });

  return (
    <Animated.View
      style={[
        styles.favoriteStamp,
        {
          opacity,
          transform: [{ scale }, { rotate: rotateStr }],
        },
      ]}
    >
      <View style={[styles.stampBox, { borderColor: colors.primary }]}>
        <Animated.View style={[styles.stampGlow, { opacity: glowOpacity, backgroundColor: colors.primary }]} />
        <View style={[styles.stampInnerRing, { borderColor: colors.primary }]} />
        <View style={styles.stampTextContainer}>
          <Text style={[styles.stampLabel, { color: colors.primary }]}>{label}</Text>
          <Text style={[styles.stampLabelZh, { color: colors.primary }]}>{labelZh}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

// Scroll unfurl animation for task completion
export function ScrollUnfurlAnimation({
  active = false,
  title = 'Complete!',
  titleZh = '完成',
  showConfetti = true,
  onComplete,
}) {
  const { colors } = useTheme();
  const scaleY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const confettiActive = useRef(false);

  useEffect(() => {
    if (!active) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

    Animated.parallel([
      Animated.timing(scaleY, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.back(0.8)),
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.sequence([
        Animated.delay(200),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]),
    ]).start(() => {
      if (showConfetti) {
        confettiActive.current = true;
      }
      onComplete?.();
    });
  }, [active]);

  if (!active) return null;

  return (
    <Animated.View
      style={[
        styles.scrollUnfurl,
        {
          opacity,
          transform: [{ scaleY }],
        },
      ]}
    >
      <View style={[styles.scrollPaper, { borderColor: colors.border }]}>
        {/* Scroll roll decorations */}
        <View style={[styles.scrollRoll, styles.scrollRollTop, { backgroundColor: colors.mutedText }]} />
        <View style={[styles.scrollRoll, styles.scrollRollBottom, { backgroundColor: colors.mutedText }]} />

        <Animated.View style={[styles.scrollContent, { opacity: textOpacity }]}>
          <Text style={[styles.scrollTitle, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.scrollTitleZh, { color: colors.primary }]}>{titleZh}</Text>
        </Animated.View>
      </View>

      {showConfetti && (
        <GoldConfettiBurst
          active={active}
          origin={{ x: SCREEN_WIDTH / 2 - 20, y: 40 }}
          count={16}
        />
      )}
    </Animated.View>
  );
}

// Lantern glow animation for level up
export function LanternGlowAnimation({
  active = false,
  level = 1,
  title = 'Level Up!',
  titleZh = '升级',
  onComplete,
}) {
  const { colors } = useTheme();
  const scale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0)).current;
  const lanternGlow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        tension: 80,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.sequence([
        Animated.delay(200),
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowPulse, {
              toValue: 1,
              duration: 600,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: Platform.OS !== 'web',
            }),
            Animated.timing(glowPulse, {
              toValue: 0.3,
              duration: 600,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: Platform.OS !== 'web',
            }),
          ]),
          { iterations: 3 },
        ),
      ]),
      Animated.sequence([
        Animated.delay(100),
        Animated.timing(lanternGlow, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]),
    ]).start(() => {
      onComplete?.();
    });
  }, [active]);

  if (!active) return null;

  const glowIntensity = glowPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.6],
  });

  return (
    <Animated.View
      style={[
        styles.lanternContainer,
        {
          opacity,
          transform: [{ scale }],
        },
      ]}
    >
      {/* Lantern glow background */}
      <Animated.View
        style={[
          styles.lanternGlowBg,
          {
            opacity: glowIntensity,
            backgroundColor: colors.primary,
          },
        ]}
      />

      {/* Lantern body */}
      <View style={[styles.lanternBody, { borderColor: colors.primary }]}>
        <Animated.View style={[styles.lanternInnerGlow, { opacity: lanternGlow, backgroundColor: colors.primary }]} />
        <Text style={[styles.lanternLevel, { color: colors.primary }]}>Lv.{level}</Text>
      </View>

      {/* Title */}
      <View style={styles.lanternTextContainer}>
        <Text style={[styles.lanternTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.lanternTitleZh, { color: colors.primary }]}>{titleZh}</Text>
      </View>

      {/* Confetti burst */}
      <GoldConfettiBurst
        active={active}
        origin={{ x: SCREEN_WIDTH / 2 - 30, y: 60 }}
        count={20}
      />
    </Animated.View>
  );
}

// Firework particle for celebration
function FireworkParticle({ angle, delay, color }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.3)).current;

  const distance = 50 + Math.random() * 30;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(translateX, {
          toValue: Math.cos(angle) * distance,
          duration: 600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(translateY, {
          toValue: Math.sin(angle) * distance,
          duration: 600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.fireworkParticle,
        {
          opacity,
          transform: [{ translateX }, { translateY }, { scale }],
        },
      ]}
    >
      <View style={[styles.fireworkDot, { backgroundColor: color }]} />
    </Animated.View>
  );
}

// Firework burst effect
export function FireworkBurst({ active = false, origin = { x: 0, y: 0 }, count = 8 }) {
  const { colors } = useTheme();

  if (!active) return null;

  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      angle: (i / count) * Math.PI * 2,
      delay: i * 20,
    }));
  }, [count]);

  return (
    <View style={[styles.fireworkContainer, { left: origin.x, top: origin.y }]} pointerEvents="none">
      {particles.map((p) => (
        <FireworkParticle key={p.id} angle={p.angle} delay={p.delay} color={colors.primary} />
      ))}
    </View>
  );
}

// Combined celebration animation with lantern + fireworks
export function LevelUpCelebration({
  active = false,
  level = 1,
  title = 'Level Up!',
  titleZh = '升级',
  onComplete,
}) {
  const { colors } = useTheme();
  const containerOpacity = useRef(new Animated.Value(0)).current;
  const fireworkActive = useRef(false);

  useEffect(() => {
    if (!active) return;

    Animated.sequence([
      Animated.timing(containerOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.delay(600),
    ]).start(() => {
      fireworkActive.current = true;
    });
  }, [active]);

  if (!active) return null;

  return (
    <Animated.View style={[styles.celebrationOverlay, { opacity: containerOpacity }]} pointerEvents="none">
      <LanternGlowAnimation active={active} level={level} title={title} titleZh={titleZh} />
      <FireworkBurst active={active} origin={{ x: SCREEN_WIDTH * 0.3, y: SCREEN_HEIGHT * 0.4 }} count={10} />
      <FireworkBurst active={active} origin={{ x: SCREEN_WIDTH * 0.7, y: SCREEN_HEIGHT * 0.35 }} count={8} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // Gold confetti
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  goldParticle: {
    position: 'absolute',
    borderRadius: 2,
  },
  goldParticleInner: {
    width: '100%',
    height: '100%',
    borderRadius: 2,
  },

  // Favorite stamp
  favoriteStamp: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 50,
  },
  stampBox: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(194, 58, 46, 0.05)',
  },
  stampGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 6,
  },
  stampInnerRing: {
    position: 'absolute',
    left: 6,
    top: 6,
    right: 6,
    bottom: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(194, 58, 46, 0.2)',
  },
  stampTextContainer: {
    alignItems: 'center',
  },
  stampLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  stampLabelZh: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },

  // Scroll unfurl
  scrollUnfurl: {
    position: 'absolute',
    top: 100,
    left: SCREEN_WIDTH / 2 - 80,
    width: 160,
    zIndex: 50,
  },
  scrollPaper: {
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: theme.colors.surface,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  scrollRoll: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 8,
    borderRadius: 4,
  },
  scrollRollTop: {
    top: -4,
  },
  scrollRollBottom: {
    bottom: -4,
  },
  scrollContent: {
    alignItems: 'center',
  },
  scrollTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  scrollTitleZh: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },

  // Lantern
  lanternContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.3,
    left: SCREEN_WIDTH / 2 - 60,
    width: 120,
    alignItems: 'center',
    zIndex: 50,
  },
  lanternGlowBg: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -40,
    left: -40,
  },
  lanternBody: {
    width: 80,
    height: 100,
    borderRadius: 40,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(194, 58, 46, 0.08)',
  },
  lanternInnerGlow: {
    position: 'absolute',
    left: 10,
    top: 10,
    right: 10,
    bottom: 10,
    borderRadius: 30,
    opacity: 0.3,
  },
  lanternLevel: {
    fontSize: 24,
    fontWeight: '900',
  },
  lanternTextContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  lanternTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  lanternTitleZh: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },

  // Firework
  fireworkContainer: {
    position: 'absolute',
    zIndex: 60,
  },
  fireworkParticle: {
    position: 'absolute',
    width: 8,
    height: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fireworkDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  // Celebration overlay
  celebrationOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    alignItems: 'center',
  },
});