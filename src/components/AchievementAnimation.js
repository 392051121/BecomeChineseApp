/**
 * Achievement Unlock Animation
 *
 * Displays when user unlocks a badge with seal stamp effect.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import { Award, Star, Sparkles } from 'lucide-react-native';
import { theme } from '../theme/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export function AchievementUnlockAnimation({ badge, visible, onComplete }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const particlesAnim = useRef(new Animated.Value(0)).current;
  const stampAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && badge) {
      // Reset animations
      scaleAnim.setValue(0);
      rotateAnim.setValue(0);
      opacityAnim.setValue(0);
      glowAnim.setValue(0);
      particlesAnim.setValue(0);
      stampAnim.setValue(0);

      // Animation sequence
      Animated.sequence([
        // Fade in background
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        // Stamp effect - quick scale with rotation
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 4,
            tension: 200,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        // Glow pulse
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0.5,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
          { iterations: 3 }
        ),
        // Stamp slam effect
        Animated.sequence([
          Animated.timing(stampAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.spring(stampAnim, {
            toValue: 0,
            friction: 5,
            tension: 100,
            useNativeDriver: true,
          }),
        ]),
        // Particles burst
        Animated.timing(particlesAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        // Hold and fade out
        Animated.delay(1500),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onComplete?.();
      });
    }
  }, [visible, badge]);

  if (!visible || !badge) return null;

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-15deg', '0deg'],
  });

  const glowScale = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });

  const stampTranslateY = stampAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 10],
  });

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.container, { opacity: opacityAnim }]}>
        {/* Glow effect */}
        <Animated.View
          style={[
            styles.glow,
            {
              backgroundColor: badge.color + '40',
              transform: [{ scale: glowScale }],
            },
          ]}
        />

        {/* Main card */}
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ scale: scaleAnim }, { rotate }, { translateY: stampTranslateY }],
            },
          ]}
        >
          {/* Badge icon */}
          <View style={[styles.iconWrap, { backgroundColor: badge.color + '20' }]}>
            <Award size={48} color={badge.color} strokeWidth={2} />
            <View style={[styles.starBadge, { backgroundColor: badge.color }]}>
              <Star size={12} color="#FFFFFF" strokeWidth={2} fill="#FFFFFF" />
            </View>
          </View>

          {/* Achievement text */}
          <Text style={styles.unlockLabel}>Achievement Unlocked!</Text>
          <Text style={styles.badgeName}>{badge.nameEn}</Text>
          <Text style={[styles.badgeNameCn, { color: badge.color }]}>{badge.nameCn}</Text>

          {/* XP reward */}
          <View style={[styles.xpBadge, { backgroundColor: badge.color + '20' }]}>
            <Sparkles size={14} color={badge.color} strokeWidth={2} />
            <Text style={[styles.xpText, { color: badge.color }]}>+{badge.xp} XP</Text>
          </View>

          {/* Stamp effect */}
          <Animated.View style={[styles.stamp, { opacity: stampAnim }]}>
            <View style={[styles.stampCircle, { borderColor: badge.color }]}>
              <Text style={[styles.stampText, { color: badge.color }]}>UNLOCKED</Text>
            </View>
          </Animated.View>
        </Animated.View>

        {/* Particles */}
        <ParticleBurst color={badge.color} animValue={particlesAnim} />
      </Animated.View>
    </View>
  );
}

/**
 * Particle burst for celebration
 */
function ParticleBurst({ color, animValue }) {
  const particles = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    angle: (i * 22.5) * (Math.PI / 180),
    delay: i * 30,
  }));

  return (
    <View style={styles.particlesContainer}>
      {particles.map((particle) => {
        const distance = 120;
        const translateX = animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Math.cos(particle.angle) * distance],
        });
        const translateY = animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Math.sin(particle.angle) * distance],
        });
        const opacity = animValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [1, 0.8, 0],
        });
        const scale = animValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [1, 0.6, 0],
        });

        return (
          <Animated.View
            key={particle.id}
            style={[
              styles.particle,
              {
                backgroundColor: color,
                opacity,
                transform: [{ translateX }, { translateY }, { scale }],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

/**
 * Mini badge unlock toast
 */
export function BadgeUnlockToast({ badge, visible }) {
  const slideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 6,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(slideAnim, {
          toValue: 100,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible || !badge) return null;

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={[styles.toastIcon, { backgroundColor: badge.color + '20' }]}>
        <Award size={20} color={badge.color} strokeWidth={2} />
      </View>
      <View style={styles.toastContent}>
        <Text style={styles.toastLabel}>Badge Unlocked!</Text>
        <Text style={styles.toastName}>{badge.nameCn}</Text>
      </View>
      <View style={[styles.toastXP, { backgroundColor: badge.color + '20' }]}>
        <Text style={[styles.toastXPText, { color: badge.color }]}>+{badge.xp}</Text>
      </View>
    </Animated.View>
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
  container: {
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  card: {
    width: 280,
    backgroundColor: '#FFFBF6',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  starBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlockLabel: {
    marginTop: 16,
    fontSize: 12,
    color: theme.colors.mutedText,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: '700',
  },
  badgeName: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.text,
    textAlign: 'center',
  },
  badgeNameCn: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '600',
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  xpText: {
    fontSize: 14,
    fontWeight: '700',
  },
  stamp: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-15deg' }],
  },
  stampText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
  },
  particlesContainer: {
    position: 'absolute',
    width: 10,
    height: 10,
  },
  particle: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  toast: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: '#FFFBF6',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  toastIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastContent: {
    flex: 1,
  },
  toastLabel: {
    fontSize: 10,
    color: theme.colors.mutedText,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
  },
  toastName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 2,
  },
  toastXP: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  toastXPText: {
    fontSize: 14,
    fontWeight: '800',
  },
});
