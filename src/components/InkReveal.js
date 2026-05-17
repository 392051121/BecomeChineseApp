/**
 * Ink Reveal Component
 *
 * Content reveal with ink wash spread effect.
 */

import React, { memo, useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View, Easing, Platform } from 'react-native';

import { theme } from '../theme/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const InkReveal = memo(function InkReveal({
  visible,
  duration = 500,
  delay = 0,
  direction = 'center', // 'center', 'left', 'right', 'top', 'bottom'
  color = theme.colors.background,
  children,
  style,
}) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 6,
            tension: 80,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: duration * 0.5,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
    }
  }, [visible, delay, duration, scaleAnim, opacityAnim]);

  // Determine starting position based on direction
  const getTransform = () => {
    switch (direction) {
      case 'left':
        return {
          translateX: scaleAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-SCREEN_WIDTH, 0],
          }),
        };
      case 'right':
        return {
          translateX: scaleAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [SCREEN_WIDTH, 0],
          }),
        };
      case 'top':
        return {
          translateY: scaleAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-100, 0],
          }),
        };
      case 'bottom':
        return {
          translateY: scaleAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [100, 0],
          }),
        };
      default:
        return { scale: scaleAnim };
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: opacityAnim,
          transform: [getTransform()],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
});

// Staggered reveal for multiple children
export const InkRevealGroup = memo(function InkRevealGroup({
  visible,
  staggerDelay = 100,
  children,
  direction = 'bottom',
}) {
  return (
    <View style={styles.groupContainer}>
      {React.Children.map(children, (child, index) => (
        <InkReveal
          visible={visible}
          delay={index * staggerDelay}
          direction={direction}
        >
          {child}
        </InkReveal>
      ))}
    </View>
  );
});

// Ink mask reveal (circular expansion)
export const InkMaskReveal = memo(function InkMaskReveal({
  visible,
  duration = 600,
  children,
  style,
}) {
  const radiusAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(radiusAnim, {
        toValue: 1,
        duration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false, // Cannot use native driver for borderRadius
      }).start();
    } else {
      radiusAnim.setValue(0);
    }
  }, [visible, duration, radiusAnim]);

  const maxRadius = Math.max(SCREEN_WIDTH, 800) / 2;

  return (
    <Animated.View
      style={[
        styles.maskContainer,
        {
          borderRadius: radiusAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [maxRadius, 0],
          }),
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
});

// Ink drop animation for loading states
export const InkDropReveal = memo(function InkDropReveal({
  visible,
  delay = 0,
  children,
}) {
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 4,
            tension: 100,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      scaleAnim.setValue(0.3);
      opacityAnim.setValue(0);
    }
  }, [visible, delay, scaleAnim, opacityAnim]);

  return (
    <Animated.View
      style={{
        opacity: opacityAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      {children}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  groupContainer: {
    flexDirection: 'column',
  },
  maskContainer: {
    overflow: 'hidden',
  },
});
