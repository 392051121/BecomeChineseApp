/**
 * Stamp Unlock Animation Component
 *
 * Animated celebration when user earns a new stamp.
 */

import React, { memo, useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import { Sparkles } from 'lucide-react-native';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { StampCard } from './StampCard';
import { getRarityConfig } from '../config/rarity';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Particle component for celebration effect
const Particle = memo(function Particle({ delay, color, startX, startY }) {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const randomX = (Math.random() - 0.5) * 200;
    const randomY = -Math.random() * 300 - 100;

    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: randomX,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: randomY,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [delay, translateX, translateY, opacity, scale]);

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          backgroundColor: color,
          transform: [{ translateX }, { translateY }, { scale }],
          opacity,
          left: startX,
          top: startY,
        },
      ]}
    />
  );
});

export const StampUnlockAnimation = memo(function StampUnlockAnimation({
  visible,
  stamp,
  onComplete,
  autoDismiss = true,
}) {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const rarityConfig = getRarityConfig(stamp?.rarity || 'common');

  useEffect(() => {
    if (visible && stamp) {
      // Reset animations
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      glowAnim.setValue(0);

      // Start entrance animation
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0.5,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();

      // Auto dismiss after delay
      if (autoDismiss) {
        const timer = setTimeout(() => {
          handleDismiss();
        }, 3000);

        return () => clearTimeout(timer);
      }
    }
  }, [visible, stamp, autoDismiss]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onComplete?.();
    });
  };

  if (!visible || !stamp) return null;

  // Generate particles for celebration
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: i * 50,
    color: rarityConfig.color,
    startX: SCREEN_WIDTH / 2 + (Math.random() - 0.5) * 100,
    startY: SCREEN_HEIGHT / 2,
  }));

  return (
    <View style={styles.overlay}>
      {/* Background dim */}
      <View style={styles.background} />

      {/* Particles */}
      {particles.map((p) => (
        <Particle key={p.id} {...p} />
      ))}

      {/* Stamp card */}
      <Animated.View
        style={[
          styles.stampContainer,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        {/* Glow effect */}
        <Animated.View
          style={[
            styles.glow,
            {
              backgroundColor: rarityConfig.color,
              opacity: glowAnim,
            },
          ]}
        />

        <StampCard stamp={stamp} size="large" showDetails={false} />

        <View style={styles.info}>
          <Text style={styles.title}>New Stamp!</Text>
          <Text style={styles.stampName}>{stamp.contentNameCn}</Text>
          <Text style={[styles.stampNameEn, { color: colors.mutedText }]}>
            {stamp.contentNameEn}
          </Text>
          <View style={styles.rarityRow}>
            <Sparkles size={12} color={rarityConfig.color} strokeWidth={2} />
            <Text style={[styles.rarityText, { color: rarityConfig.color }]}>
              {rarityConfig.name}
            </Text>
          </View>
          <Text style={styles.xpText}>+{stamp.xp} XP</Text>
        </View>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stampContainer: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    backgroundColor: theme.colors.card,
    ...theme.shadows.large,
  },
  glow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    top: '50%',
    left: '50%',
    marginTop: -100,
    marginLeft: -100,
  },
  info: {
    alignItems: 'center',
    marginTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 8,
  },
  stampName: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.text,
  },
  stampNameEn: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  rarityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  rarityText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  xpText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
    marginTop: 8,
  },
});
