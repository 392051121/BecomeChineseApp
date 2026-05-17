/**
 * Collection Animation Components
 *
 * Animations for collecting items with rarity effects.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View, Dimensions } from 'react-native';
import { getRarityConfig } from '../config/rarity';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Collect Animation Overlay
 * Shows when user collects a new item
 */
export function CollectAnimation({ item, rarity, onComplete, visible }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const particlesAnim = useRef(new Animated.Value(0)).current;

  const config = getRarityConfig(rarity);

  useEffect(() => {
    if (visible) {
      // Start animation sequence
      Animated.sequence([
        // Fade in and scale up
        Animated.parallel([
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 6,
            tension: 100,
            useNativeDriver: true,
          }),
        ]),
        // Glow pulse
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0.5,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
          { iterations: 3 }
        ),
        // Float up
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        // Fade out
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          delay: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onComplete?.();
      });

      // Particle burst for rare+ items
      if (rarity !== 'common') {
        Animated.timing(particlesAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      }
    }
  }, [visible]);

  if (!visible) return null;

  const floatTranslateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50],
  });

  const glowScale = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  return (
    <View style={styles.overlay}>
      {/* Background glow */}
      <Animated.View
        style={[
          styles.backgroundGlow,
          {
            backgroundColor: config.glowColor,
            opacity: opacityAnim,
            transform: [{ scale: glowScale }],
          },
        ]}
      />

      {/* Card */}
      <Animated.View
        style={[
          styles.card,
          {
            borderColor: config.color,
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }, { translateY: floatTranslateY }],
          },
        ]}
      >
        {/* Rarity indicator */}
        <View style={[styles.rarityBand, { backgroundColor: config.color }]}>
          <Text style={styles.rarityText}>{config.nameCn}</Text>
        </View>

        {/* Item info */}
        <View style={styles.cardContent}>
          <Text style={styles.itemNameCn}>{item?.nameCn || item?.name_cn}</Text>
          <Text style={styles.itemNameEn}>{item?.nameEn || item?.name_en}</Text>
        </View>

        {/* XP reward */}
        <View style={styles.xpBadge}>
          <Text style={styles.xpText}>+{10 * config.xpMultiplier} XP</Text>
        </View>
      </Animated.View>

      {/* Particles for rare+ items */}
      {rarity !== 'common' && (
        <ParticleBurst color={config.color} animValue={particlesAnim} />
      )}
    </View>
  );
}

/**
 * Particle Burst Effect
 */
function ParticleBurst({ color, animValue }) {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: (i * 30) * (Math.PI / 180),
  }));

  return (
    <View style={styles.particlesContainer}>
      {particles.map(particle => {
        const translateX = animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Math.cos(particle.angle) * 100],
        });
        const translateY = animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Math.sin(particle.angle) * 100],
        });
        const opacity = animValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [1, 0.8, 0],
        });

        return (
          <Animated.View
            key={particle.id}
            style={[
              styles.particle,
              {
                backgroundColor: color,
                opacity,
                transform: [{ translateX }, { translateY }],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

/**
 * Collection Toast
 * Small notification when collecting an item
 */
export function CollectionToast({ item, rarity, visible }) {
  const slideAnim = useRef(new Animated.Value(100)).current;
  const config = getRarityConfig(rarity);

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 6,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(slideAnim, {
          toValue: 100,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          borderColor: config.color,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={[styles.toastRarityDot, { backgroundColor: config.color }]} />
      <Text style={styles.toastText}>
        Collected: {item?.nameCn || item?.name_en}
      </Text>
      <Text style={[styles.toastRarity, { color: config.color }]}>
        {config.name}
      </Text>
    </Animated.View>
  );
}

/**
 * Shimmer Effect for Legendary Items
 */
export function LegendaryShimmer({ children, style }) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100],
  });

  return (
    <View style={[styles.shimmerContainer, style]}>
      {children}
      <Animated.View
        style={[
          styles.shimmerOverlay,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 1000,
  },
  backgroundGlow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  card: {
    width: 260,
    backgroundColor: '#FFFBF6',
    borderRadius: 16,
    borderWidth: 2,
    overflow: 'hidden',
    ...StyleSheet.absoluteFillObject,
    marginHorizontal: (SCREEN_WIDTH - 260) / 2,
  },
  rarityBand: {
    paddingVertical: 6,
    alignItems: 'center',
  },
  rarityText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  cardContent: {
    padding: 20,
    alignItems: 'center',
  },
  itemNameCn: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1B1715',
    marginBottom: 4,
  },
  itemNameEn: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  xpBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  xpText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  particlesContainer: {
    position: 'absolute',
    width: 20,
    height: 20,
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  toast: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: '#FFFBF6',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  toastRarityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  toastText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#1B1715',
  },
  toastRarity: {
    fontSize: 12,
    fontWeight: '700',
  },
  shimmerContainer: {
    overflow: 'hidden',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 50,
    backgroundColor: 'rgba(255,255,255,0.3)',
    transform: [{ skewX: '-20deg' }],
  },
});
