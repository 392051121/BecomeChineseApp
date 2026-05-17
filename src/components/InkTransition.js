/**
 * Ink Transition Component
 *
 * Screen transition with ink wash spread effect.
 */

import React, { memo, useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View, Easing } from 'react-native';

import { theme } from '../theme/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const InkTransition = memo(function InkTransition({
  visible,
  duration = 400,
  color = theme.colors.primary,
  onAnimationEnd,
  children,
}) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Ink spread animation
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: duration * 0.6,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onAnimationEnd?.();
      });
    } else {
      // Reset
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
    }
  }, [visible, duration, scaleAnim, opacityAnim, onAnimationEnd]);

  // Calculate max scale to cover screen
  const maxDimension = Math.max(SCREEN_WIDTH, SCREEN_HEIGHT);
  const maxScale = (maxDimension * 2) / 100;

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Ink circles */}
      {[0, 1, 2].map((index) => (
        <Animated.View
          key={index}
          style={[
            styles.inkCircle,
            {
              backgroundColor: color,
              opacity: opacityAnim,
              transform: [
                {
                  scale: scaleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, maxScale * (1 - index * 0.15)],
                  }),
                },
              ],
              left: SCREEN_WIDTH / 2 - 50,
              top: SCREEN_HEIGHT / 2 - 50,
            },
          ]}
        />
      ))}

      {/* Content overlay */}
      <Animated.View
        style={[
          styles.contentOverlay,
          {
            opacity: opacityAnim,
          },
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
});

// Simpler ink fade transition
export const InkFadeTransition = memo(function InkFadeTransition({
  visible,
  duration = 300,
  children,
}) {
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: visible ? 1 : 0,
      duration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [visible, duration, opacityAnim]);

  return (
    <Animated.View style={[styles.fadeContainer, { opacity: opacityAnim }]}>
      {children}
    </Animated.View>
  );
});

// Ink splash overlay for loading states
export const InkSplashOverlay = memo(function InkSplashOverlay({
  visible,
  message,
}) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1.1,
              duration: 1000,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.6,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 0.8,
              duration: 1000,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.3,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    } else {
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
    }
  }, [visible, scaleAnim, opacityAnim]);

  if (!visible) return null;

  return (
    <View style={styles.overlayContainer}>
      <Animated.View
        style={[
          styles.splashCircle,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      />
      {message && (
        <Animated.Text style={[styles.splashMessage, { opacity: opacityAnim }]}>
          {message}
        </Animated.Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  inkCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  contentOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fadeContainer: {
    flex: 1,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  splashCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
  },
  splashMessage: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
