import React, { useMemo, useRef, useEffect } from 'react';
import { Animated, StyleSheet, View, Text, Easing, Platform } from 'react-native';
import Svg, { Circle, Path, G } from 'react-native-svg';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { getSolarTermForDate } from '../utils/calendar';

// Ink drop expanding animation - simulates traditional Chinese ink wash spreading on paper
function InkDropAnimation({ progress, size = 60 }) {
  const { colors } = useTheme();

  // Multiple ink rings that expand outward
  const ring1Scale = progress.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0.2, 0.6, 1],
    extrapolate: 'clamp',
  });

  const ring2Scale = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.1, 0.4, 0.85],
    extrapolate: 'clamp',
  });

  const ring3Scale = progress.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [0.05, 0.2, 0.6],
    extrapolate: 'clamp',
  });

  const ring1Opacity = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.6, 0.8, 0.4],
    extrapolate: 'clamp',
  });

  const ring2Opacity = progress.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [0.4, 0.6, 0.2],
    extrapolate: 'clamp',
  });

  const ring3Opacity = progress.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [0.2, 0.4, 0.1],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.inkContainer, { width: size, height: size }]}>
      <Animated.View style={[styles.inkRing, {
        transform: [{ scale: ring1Scale }],
        opacity: ring1Opacity,
      }]}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={size * 0.35}
            stroke={colors.primary}
            strokeWidth="1.5"
            fill="none"
          />
        </Svg>
      </Animated.View>
      <Animated.View style={[styles.inkRing, {
        transform: [{ scale: ring2Scale }],
        opacity: ring2Opacity,
      }]}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={size * 0.25}
            stroke={colors.primary}
            strokeWidth="1"
            fill="none"
          />
        </Svg>
      </Animated.View>
      <Animated.View style={[styles.inkRing, {
        transform: [{ scale: ring3Scale }],
        opacity: ring3Opacity,
      }]}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={size * 0.15}
            fill={colors.primary}
            fillOpacity="0.3"
          />
        </Svg>
      </Animated.View>
    </View>
  );
}

// Seal stamp release animation - traditional Chinese seal stamping effect
function SealStampAnimation({ progress, size = 50 }) {
  const { colors } = useTheme();

  const stampScale = progress.interpolate({
    inputRange: [0, 0.6, 0.8, 1],
    outputRange: [0.5, 1.1, 0.95, 1],
    extrapolate: 'clamp',
  });

  const stampOpacity = progress.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0, 0.8, 1],
    extrapolate: 'clamp',
  });

  const stampRotate = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['-15deg', '-5deg', '-3deg'],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[
      styles.sealContainer,
      {
        width: size,
        height: size,
        transform: [
          { scale: stampScale },
          { rotate: stampRotate },
        ],
        opacity: stampOpacity,
      },
    ]}>
      <View style={[styles.sealBox, { borderColor: colors.primary }]}>
        {/* Inner ring */}
        <View style={[styles.sealInnerRing, { borderColor: colors.primary }]} />
        {/* Seal character approximation */}
        <Text style={[styles.sealChar, { color: colors.primary }]}>印</Text>
      </View>
    </Animated.View>
  );
}

// Solar term display with poetic styling
function SolarTermDisplay({ term, progress }) {
  const { colors } = useTheme();

  const textOpacity = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.7, 1],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[styles.solarTermContainer, { opacity: textOpacity }]}>
      <Text style={[styles.solarTermZh, { color: colors.primary }]}>
        {term.nameZh}
      </Text>
      <Text style={[styles.solarTermEn, { color: colors.mutedText }]}>
        {term.nameEn}
      </Text>
      <Text style={[styles.solarTermMeaning, { color: colors.mutedText }]}>
        {term.meaningEn}
      </Text>
    </Animated.View>
  );
}

// Main refresh indicator component
export function InkRefreshIndicator({
  refreshing = false,
  progress = 0, // 0-1 range representing pull distance
  size = 80,
}) {
  const { colors } = useTheme();
  const currentTerm = useMemo(() => getSolarTermForDate(new Date()), []);

  // Animated progress value
  const animatedProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 150,
      easing: Easing.out(Easing.quad),
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [progress]);

  // When refreshing, show continuous animation
  useEffect(() => {
    if (refreshing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedProgress, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(animatedProgress, {
            toValue: 0.6,
            duration: 400,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: Platform.OS !== 'web',
          }),
        ])
      ).start();
    }
  }, [refreshing]);

  // Determine which animation to show based on progress
  const showSeal = progress > 0.7 || refreshing;

  return (
    <View style={[styles.container, { width: size, height: size + 40 }]}>
      {showSeal ? (
        <SealStampAnimation progress={animatedProgress} size={size * 0.6} />
      ) : (
        <InkDropAnimation progress={animatedProgress} size={size * 0.75} />
      )}
      <SolarTermDisplay term={currentTerm} progress={animatedProgress} />
    </View>
  );
}

// Custom refresh control wrapper
export function InkRefreshControl({
  refreshing,
  onRefresh,
  colors,
  progress = 0,
}) {
  return (
    <View style={styles.refreshControlWrapper}>
      <InkRefreshIndicator refreshing={refreshing} progress={progress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  inkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inkRing: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sealContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sealBox: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(194, 58, 46, 0.06)',
  },
  sealInnerRing: {
    position: 'absolute',
    left: 4,
    top: 4,
    right: 4,
    bottom: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(194, 58, 46, 0.2)',
  },
  sealChar: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0,
  },
  solarTermContainer: {
    alignItems: 'center',
    marginTop: 6,
  },
  solarTermZh: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
  },
  solarTermEn: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  solarTermMeaning: {
    fontSize: 9,
    fontWeight: '400',
    marginTop: 2,
    textAlign: 'center',
    opacity: 0.7,
  },
  refreshControlWrapper: {
    alignItems: 'center',
    paddingTop: 10,
  },
});