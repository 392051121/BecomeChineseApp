import React, { useEffect, useRef } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

export function HandscrollContainer({
  children,
  style,
  refreshControl,
  onScroll,
  scrollEventThrottle = 16,
  initialScrollOffset = 0,
  scrollRef,
}) {
  const { colors, isDark } = useTheme();
  const left = useRef(new Animated.Value(0.5)).current;
  const right = useRef(new Animated.Value(0.5)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const ink = useRef(new Animated.Value(0)).current;
  const veil = useRef(new Animated.Value(0)).current;
  const internalScrollRef = useRef(null);
  // Resolve the ScrollView ref: an optional caller-provided ref wins, else the local one.
  const scrollViewRef = scrollRef || internalScrollRef;

  // Restore a previously saved reading position after mount (once content is laid out).
  useEffect(() => {
    if (!(initialScrollOffset > 0)) return;
    const t = setTimeout(() => {
      scrollViewRef.current?.scrollTo?.({ y: initialScrollOffset, animated: false });
    }, 60);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialScrollOffset]);

  useEffect(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    const animation = Animated.parallel([
      Animated.sequence([
        Animated.timing(veil, { toValue: 1, duration: theme.motion.durationFast, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(ink, { toValue: 1, duration: theme.motion.durationNormal, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(ink, { toValue: 0, duration: theme.motion.durationSlow, easing: Easing.out(Easing.poly(4)), useNativeDriver: true }),
        Animated.timing(veil, { toValue: 0, duration: theme.motion.durationNormal, easing: Easing.out(Easing.poly(4)), useNativeDriver: true }),
      ]),
      Animated.timing(left, { toValue: 0, duration: theme.motion.durationSlow * 1.3, easing: Easing.bezier(0.4, 0, 0.2, 1), useNativeDriver: true }),
      Animated.timing(right, { toValue: 0, duration: theme.motion.durationSlow * 1.3, easing: Easing.bezier(0.4, 0, 0.2, 1), useNativeDriver: true }),
      Animated.timing(fade, { toValue: 1, duration: theme.motion.durationNormal, easing: Easing.out(Easing.poly(4)), useNativeDriver: true }),
    ]);

    animation.start();

    return () => {
      animation.stop();
      left.stopAnimation();
      right.stopAnimation();
      fade.stopAnimation();
      ink.stopAnimation();
      veil.stopAnimation();
    };
  }, [fade, ink, left, right, veil]);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }, style]}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.inkWash,
          {
            opacity: ink.interpolate({ inputRange: [0, 1], outputRange: [0, 0.16] }),
            transform: [
              { scale: ink.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.18] }) },
              { rotate: ink.interpolate({ inputRange: [0, 1], outputRange: ['-9deg', '0deg'] }) },
            ],
          },
        ]}
      />
      <Animated.View pointerEvents="none" style={[styles.veil, { backgroundColor: isDark ? 'rgba(30, 28, 26, 0.88)' : 'rgba(255, 252, 248, 0.88)' }, { opacity: veil.interpolate({ inputRange: [0, 1], outputRange: [0, 0.08] }) }]} />
      <Animated.View style={[styles.panel, { backgroundColor: colors.surface }, styles.leftPanel, { transform: [{ translateX: left.interpolate({ inputRange: [0, 0.5], outputRange: [-80, 0] }) }], opacity: left.interpolate({ inputRange: [0, 0.5], outputRange: [0, 1] }) }]} />
      <Animated.View style={[styles.panel, { backgroundColor: colors.surface }, styles.rightPanel, { transform: [{ translateX: right.interpolate({ inputRange: [0, 0.5], outputRange: [80, 0] }) }], opacity: right.interpolate({ inputRange: [0, 0.5], outputRange: [0, 1] }) }]} />
      <Animated.ScrollView
        ref={scrollViewRef}
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
        bounces
        refreshControl={refreshControl}
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
      >
        <Animated.View style={{ opacity: fade }}>{children}</Animated.View>
      </Animated.ScrollView>
      <View pointerEvents="none" style={[styles.centerLine, { backgroundColor: colors.border }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: theme.colors.background,
  },
  inkWash: {
    position: 'absolute',
    left: '50%',
    top: '42%',
    width: 220,
    height: 220,
    marginLeft: -110,
    marginTop: -110,
    borderRadius: 120,
    backgroundColor: 'rgba(159, 61, 46, 0.10)',
  },
  veil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 252, 248, 0.88)',
  },
  panel: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.surface,
  },
  leftPanel: {
    right: '50%',
  },
  rightPanel: {
    left: '50%',
  },
  content: {
    flex: 1,
  },
  contentInner: {
    flexGrow: 1,
  },
  centerLine: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 0.5,
    marginLeft: -0.25,
    backgroundColor: theme.colors.border,
    opacity: 0.72,
  },
});
