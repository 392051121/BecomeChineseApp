import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { Animated, Easing, StyleSheet, View, Pressable, Platform, Dimensions } from 'react-native';
import Svg, { Path, Circle, Defs, RadialGradient, Stop, G } from 'react-native-svg';
import * as Haptics from 'expo-haptics';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============================================
// INK RIPPLE - 水墨涟漪效果
// ============================================

export function InkRipple({
  children,
  disabled = false,
  onPress,
  style,
  rippleColor,
  rippleOpacity = 0.15,
}) {
  const { colors } = useTheme();
  const ripples = useRef([]);
  const counter = useRef(0);
  const containerRef = useRef(null);

  const handlePressIn = useCallback((event) => {
    if (disabled) return;

    const { locationX, locationY } = event.nativeEvent;
    const id = counter.current++;

    const newRipple = {
      id,
      x: locationX,
      y: locationY,
      scale: new Animated.Value(0),
      opacity: new Animated.Value(rippleOpacity),
    };

    ripples.current = [...ripples.current, newRipple];

    Animated.parallel([
      Animated.spring(newRipple.scale, {
        toValue: 1,
        friction: 4,
        tension: 80,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(newRipple.opacity, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start(() => {
      ripples.current = ripples.current.filter(r => r.id !== id);
    });
  }, [disabled, rippleOpacity]);

  const handlePress = useCallback(() => {
    if (!disabled && onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      onPress();
    }
  }, [disabled, onPress]);

  const inkColor = rippleColor || colors.primary;

  return (
    <Pressable
      ref={containerRef}
      style={[styles.rippleContainer, style]}
      onPressIn={handlePressIn}
      onPress={handlePress}
      disabled={disabled}
    >
      {children}
      {ripples.current.map((ripple) => (
        <Animated.View
          key={ripple.id}
          style={[
            styles.ripple,
            {
              left: ripple.x - 100,
              top: ripple.y - 100,
              transform: [{ scale: ripple.scale }],
              opacity: ripple.opacity,
            },
          ]}
          pointerEvents="none"
        >
          <Svg width="200" height="200" viewBox="0 0 200 200">
            <Defs>
              <RadialGradient id={`inkGrad${ripple.id}`} cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor={inkColor} stopOpacity="0.3" />
                <Stop offset="70%" stopColor={inkColor} stopOpacity="0.1" />
                <Stop offset="100%" stopColor={inkColor} stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Circle cx="100" cy="100" r="90" fill={`url(#inkGrad${ripple.id})`} />
          </Svg>
        </Animated.View>
      ))}
    </Pressable>
  );
}

// ============================================
// SCROLL PAGE FLIP - 卷轴翻页效果
// ============================================

export function ScrollPageFlip({
  children,
  currentPage = 0,
  totalPages = 1,
  onPageChange,
  style,
}) {
  const { colors } = useTheme();
  const flipAnim = useRef(new Animated.Value(0)).current;
  const prevPage = useRef(currentPage);

  useEffect(() => {
    if (currentPage !== prevPage.current) {
      const direction = currentPage > prevPage.current ? 1 : -1;

      Animated.sequence([
        Animated.timing(flipAnim, {
          toValue: direction,
          duration: 200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(flipAnim, {
          toValue: 0,
          duration: 200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();

      prevPage.current = currentPage;
    }
  }, [currentPage]);

  const rotateY = flipAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-15deg', '0deg', '15deg'],
  });

  const translateX = flipAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [20, 0, -20],
  });

  const opacity = flipAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0.7, 1, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.scrollFlipContainer,
        {
          transform: [{ rotateY }, { translateX }],
          opacity,
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

// ============================================
// INK SPREAD BUTTON - 水墨扩散按钮
// ============================================

export function InkSpreadButton({
  children,
  onPress,
  disabled = false,
  style,
  buttonStyle,
  inkColor,
  spreadDuration = 400,
}) {
  const { colors } = useTheme();
  const spreadAnim = useRef(new Animated.Value(0)).current;
  const isPressed = useRef(false);

  const handlePressIn = useCallback(() => {
    if (disabled) return;
    isPressed.current = true;

    Animated.timing(spreadAnim, {
      toValue: 1,
      duration: spreadDuration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [disabled, spreadDuration]);

  const handlePressOut = useCallback(() => {
    isPressed.current = false;
    Animated.timing(spreadAnim, {
      toValue: 0,
      duration: 150,
      easing: Easing.out(Easing.quad),
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, []);

  const handlePress = useCallback(() => {
    if (!disabled && onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      onPress();
    }
  }, [disabled, onPress]);

  const ink = inkColor || colors.primary;

  const scale = spreadAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 2.5],
  });

  const opacity = spreadAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.2, 0.1],
  });

  return (
    <Pressable
      style={[styles.inkButtonContainer, style]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
    >
      <View style={[styles.inkButtonInner, buttonStyle]}>
        {/* Ink spread effect */}
        <Animated.View
          style={[
            styles.inkSpread,
            {
              backgroundColor: ink,
              transform: [{ scale }],
              opacity,
            },
          ]}
          pointerEvents="none"
        />
        {children}
      </View>
    </Pressable>
  );
}

// ============================================
// BRUSH STROKE UNDERLINE - 毛笔下划线
// ============================================

export function BrushStrokeUnderline({
  children,
  active = false,
  color,
  strokeWidth = 2,
  style,
}) {
  const { colors } = useTheme();
  const strokeAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(strokeAnim, {
      toValue: active ? 1 : 0,
      duration: 300,
      easing: Easing.out(Easing.quad),
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [active]);

  useEffect(() => {
    if (active) {
      Animated.loop(
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: Platform.OS !== 'web',
        })
      ).start();
    } else {
      waveAnim.setValue(0);
    }
  }, [active]);

  const strokeColor = color || colors.primary;
  const strokeOpacity = strokeAnim;

  const waveOffset = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 10],
  });

  return (
    <View style={[styles.brushUnderlineContainer, style]}>
      {children}
      <Animated.View style={[styles.brushUnderline, { opacity: strokeOpacity }]}>
        <Svg width="100%" height={strokeWidth + 4} viewBox="0 0 100 6" preserveAspectRatio="none">
          <Defs>
            <RadialGradient id="brushGrad" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={strokeColor} stopOpacity="1" />
              <Stop offset="100%" stopColor={strokeColor} stopOpacity="0.3" />
            </RadialGradient>
          </Defs>
          <Path
            d="M0 3 Q25 1 50 3 T100 3"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
          />
        </Svg>
      </Animated.View>
    </View>
  );
}

// ============================================
// FADE INK TRANSITION - 水墨淡入过渡
// ============================================

export function FadeInkTransition({
  children,
  visible = true,
  duration = 400,
  style,
}) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const inkScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.spring(inkScale, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: duration / 2,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(inkScale, {
          toValue: 0.9,
          duration: duration / 2,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    }
  }, [visible, duration]);

  return (
    <Animated.View
      style={[
        styles.fadeInkContainer,
        {
          opacity,
          transform: [{ scale: inkScale }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

// ============================================
// INK DROP LOADER - 水墨滴落加载动画
// ============================================

export function InkDropLoader({ size = 40, color, style }) {
  const { colors } = useTheme();
  const dropAnim = useRef(new Animated.Value(0)).current;
  const spreadAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(dropAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.in(Easing.quad),
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(spreadAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.out(Easing.quad),
            useNativeDriver: Platform.OS !== 'web',
          }),
        ]),
        Animated.parallel([
          Animated.timing(dropAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(spreadAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: Platform.OS !== 'web',
          }),
        ]),
        Animated.delay(200),
      ]).start(animate);
    };

    animate();
  }, []);

  const inkColor = color || colors.primary;

  const dropY = dropAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, size * 0.6],
  });

  const dropScale = dropAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.8, 0.3],
  });

  const spreadScale = spreadAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 2],
  });

  const spreadOpacity = spreadAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.3, 0],
  });

  return (
    <View style={[styles.inkLoaderContainer, { width: size, height: size * 1.5 }, style]}>
      {/* Ink drop */}
      <Animated.View
        style={[
          styles.inkDrop,
          {
            backgroundColor: inkColor,
            width: size * 0.3,
            height: size * 0.4,
            borderRadius: size * 0.15,
            transform: [
              { translateY: dropY },
              { scaleX: dropScale },
            ],
          },
        ]}
      />
      {/* Ink spread */}
      <Animated.View
        style={[
          styles.inkSpread,
          {
            backgroundColor: inkColor,
            width: size,
            height: size * 0.2,
            borderRadius: size * 0.5,
            top: size * 0.9,
            transform: [{ scaleX: spreadScale }],
            opacity: spreadOpacity,
          },
        ]}
      />
    </View>
  );
}

// ============================================
// PAGINATION DOTS - 水墨风格分页点
// ============================================

export function InkPaginationDots({
  total = 1,
  current = 0,
  color,
  style,
  dotSize = 8,
  activeDotSize = 12,
  spacing = 8,
}) {
  const { colors } = useTheme();
  const inkColor = color || colors.primary;

  const dots = useMemo(() => {
    return Array.from({ length: total }, (_, i) => i);
  }, [total]);

  return (
    <View style={[styles.paginationContainer, { gap: spacing }, style]}>
      {dots.map((index) => (
        <InkPaginationDot
          key={index}
          isActive={index === current}
          color={inkColor}
          size={index === current ? activeDotSize : dotSize}
        />
      ))}
    </View>
  );
}

function InkPaginationDot({ isActive, color, size }) {
  const scaleAnim = useRef(new Animated.Value(isActive ? 1 : 0.6)).current;
  const opacityAnim = useRef(new Animated.Value(isActive ? 1 : 0.4)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: isActive ? 1 : 0.6,
        friction: 4,
        tension: 80,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(opacityAnim, {
        toValue: isActive ? 1 : 0.4,
        duration: 200,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  }, [isActive]);

  return (
    <Animated.View
      style={[
        styles.paginationDot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  // Ink Ripple
  rippleContainer: {
    overflow: 'hidden',
  },
  ripple: {
    position: 'absolute',
    width: 200,
    height: 200,
  },

  // Scroll Flip
  scrollFlipContainer: {
    backfaceVisibility: 'hidden',
  },

  // Ink Button
  inkButtonContainer: {
    overflow: 'hidden',
  },
  inkButtonInner: {
    position: 'relative',
    overflow: 'hidden',
  },
  inkSpread: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    left: '50%',
    top: '50%',
    marginLeft: -50,
    marginTop: -50,
  },

  // Brush Underline
  brushUnderlineContainer: {
    position: 'relative',
  },
  brushUnderline: {
    position: 'absolute',
    bottom: -4,
    left: 0,
    right: 0,
    height: 6,
  },

  // Fade Ink
  fadeInkContainer: {
    // Container styles
  },

  // Ink Loader
  inkLoaderContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  inkDrop: {
    position: 'absolute',
    top: 0,
  },
  inkSpread: {
    position: 'absolute',
  },

  // Pagination
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationDot: {
    // Dot styles set dynamically
  },
});