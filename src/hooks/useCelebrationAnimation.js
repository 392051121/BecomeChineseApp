/**
 * useCelebrationAnimation Hook
 *
 * Manages celebration animations for quiz completion:
 * fade in, slide, reward pulse, celebration scale, star rotation.
 */

import { useRef, useCallback } from 'react';
import { Animated } from 'react-native';
import { theme } from '../theme/theme';

/**
 * Hook for managing celebration animations
 */
export function useCelebrationAnimation() {
  // Animation refs
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(12)).current;
  const rewardPulse = useRef(new Animated.Value(0)).current;
  const celebrationScale = useRef(new Animated.Value(0)).current;
  const starRotate = useRef(new Animated.Value(0)).current;

  // Start entrance animation (fade + slide)
  const startEntranceAnimation = useCallback(() => {
    const animation = Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: theme.motion.durationSlow,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: theme.motion.durationSlow,
        useNativeDriver: true,
      }),
    ]);

    animation.start();

    return () => {
      animation.stop();
      fadeIn.stopAnimation();
      slide.stopAnimation();
    };
  }, [fadeIn, slide]);

  // Trigger celebration animation (pulse + scale + rotate)
  const triggerCelebration = useCallback(() => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(rewardPulse, {
          toValue: 1,
          duration: theme.motion.durationFast,
          useNativeDriver: true,
        }),
        Animated.timing(rewardPulse, {
          toValue: 0,
          duration: theme.motion.durationFast,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(celebrationScale, {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(starRotate, {
        toValue: 1,
        duration: theme.motion.durationSlow * 2,
        useNativeDriver: true,
      }),
    ]).start();
  }, [rewardPulse, celebrationScale, starRotate]);

  // Reset celebration animation
  const resetCelebration = useCallback(() => {
    celebrationScale.setValue(0);
    starRotate.setValue(0);
    rewardPulse.setValue(0);
  }, [celebrationScale, starRotate, rewardPulse]);

  // Interpolated values for rendering
  const celebrationOpacity = celebrationScale;
  const celebrationTransform = [{ scale: celebrationScale }];
  const starRotateTransform = starRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const rewardPulseOpacity = rewardPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.95],
  });

  return {
    // Animation values
    fadeIn,
    slide,
    celebrationOpacity,
    celebrationTransform,
    starRotateTransform,
    rewardPulseOpacity,

    // Actions
    startEntranceAnimation,
    triggerCelebration,
    resetCelebration,
  };
}
