/**
 * Custom Tab Bar Component
 *
 * Enhanced bottom navigation with Chinese aesthetic:
 * - Ink wash selection effect
 * - Badge indicators
 * - Smooth animations
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, Platform } from 'react-native';
import { CalendarDays, House, Map, User, UtensilsCrossed, Scroll } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { getWrongAnswers } from '../utils/wrongAnswers';
import { logger } from '../utils/errorHandling';

// Simple event emitter for badge refresh
const badgeListeners = new Set();
export function notifyBadgeRefresh() {
  badgeListeners.forEach(listener => listener());
}

// Tab configuration with bilingual labels
const tabs = [
  { name: 'Home', label: 'Home', labelCn: '首页', icon: House },
  { name: 'Seasons', label: 'Seasons', labelCn: '节气', icon: CalendarDays },
  { name: 'History', label: 'History', labelCn: '历史', icon: Scroll },
  { name: 'Food', label: 'Food', labelCn: '美食', icon: UtensilsCrossed },
  { name: 'Places', label: 'Places', labelCn: '城市', icon: Map },
  { name: 'Profile', label: 'Profile', labelCn: '我的', icon: User },
];

// Nested stack tabs: bottom-tab press should land on the list/root screen,
// not a leftover detail from a previous visit.
const TAB_ROOT_SCREENS = {
  Home: 'HomeMain',
  Seasons: 'SeasonsMain',
  History: 'HistoryHome',
  Profile: 'ProfileMain',
};

function TabItem({ tab, isActive, onPress, colors, badgeCount }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const sealAnim = useRef(new Animated.Value(0)).current;
  const Icon = tab.icon;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(sealAnim, {
        toValue: isActive ? 1 : 0,
        friction: 6,
        tension: 120,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: isActive ? 1 : 1,
        friction: 6,
        tension: 120,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isActive]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress(tab.name);
  };

  const inactiveIconColor = 'rgba(27, 23, 21, 0.42)';
  const inactiveLabelColor = 'rgba(27, 23, 21, 0.45)';

  const hasBadge = badgeCount > 0;

  // Active tab renders as a raised "seal stamp" capsule in cinnabar, echoing the home hero
  if (isActive) {
    return (
      <Pressable
        onPress={handlePress}
        style={styles.tabItem}
        accessibilityRole="button"
        accessibilityLabel={tab.label}
        accessibilityHint="Current screen"
      >
        <Animated.View style={[styles.sealPill, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.sealIconWrap}>
            <Icon size={16} color="#FFFFFF" strokeWidth={2.5} />
            {hasBadge && (
              <View style={[styles.badge, styles.badgeOnSeal]}>
                <Text style={styles.badgeText}>
                  {badgeCount > 9 ? '9+' : badgeCount}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.sealTextWrap}>
            <Text style={styles.sealLabel}>{tab.label}</Text>
            <Text style={styles.sealLabelCn}>{tab.labelCn}</Text>
          </View>
          <View style={styles.sealTopLine} />
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      style={styles.tabItem}
      accessibilityRole="button"
      accessibilityLabel={tab.label}
      accessibilityHint={`Go to ${tab.label}`}
    >
      <Animated.View style={[styles.tabContent, { transform: [{ scale: scaleAnim }] }]}>
        {/* Soft ink wash for hover-like settle */}
        <Animated.View
          style={[
            styles.inkWash,
            {
              opacity: sealAnim.interpolate({ inputRange: [0, 1], outputRange: [0.04, 0.12] }),
              backgroundColor: colors.primary,
            },
          ]}
        />
        <View style={styles.iconWrap}>
          <Icon size={22} color={inactiveIconColor} strokeWidth={2} />
          {hasBadge && (
            <View style={[styles.badge, { backgroundColor: colors.primary }]}>
              <Text style={styles.badgeText}>
                {badgeCount > 9 ? '9+' : badgeCount}
              </Text>
            </View>
          )}
        </View>
        <Text style={[styles.label, { color: inactiveLabelColor, fontWeight: '500' }]}>
          {tab.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export function CustomTabBar({ state, navigation }) {
  const { colors } = useTheme();
  const currentRoute = state.routes[state.index].name;
  const [wrongAnswersCount, setWrongAnswersCount] = useState(0);

  // Memoized function to load badge data
  const loadBadgeData = useCallback(async () => {
    try {
      const wrongAnswers = await getWrongAnswers();
      const unmasteredCount = wrongAnswers.filter(a => !a.mastered).length;
      setWrongAnswersCount(unmasteredCount);
    } catch (e) {
      logger.error('CustomTabBar', 'Failed to load wrong answers count', e);
    }
  }, []);

  // Load badge data on mount and subscribe to refresh events
  useEffect(() => {
    loadBadgeData();

    // Subscribe to badge refresh events
    badgeListeners.add(loadBadgeData);

    return () => {
      badgeListeners.delete(loadBadgeData);
    };
  }, [loadBadgeData]);

  const handlePress = (tabName) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: tabName,
      canPreventDefault: true,
    });

    if (event.defaultPrevented) {
      return;
    }

    const rootScreen = TAB_ROOT_SCREENS[tabName];
    if (rootScreen) {
      // Always open nested stack at its root list (not a stale Dynasty/Person detail).
      // Deep links from Home/Explore still work: they call navigate with an explicit screen.
      navigation.navigate(tabName, { screen: rootScreen });
      return;
    }

    navigation.navigate(tabName);
  };

  // Badge counts per tab
  const badgeCounts = {
    Home: 0,
    Seasons: wrongAnswersCount, // Show wrong answers count on Seasons tab
    History: 0,
    Food: 0,
    Places: 0,
    Profile: 0,
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: 'rgba(255, 251, 246, 0.96)',
          borderColor: colors.border,
        },
      ]}
    >
      {tabs.map((tab) => (
        <TabItem
          key={tab.name}
          tab={tab}
          isActive={currentRoute === tab.name}
          onPress={handlePress}
          colors={colors}
          badgeCount={badgeCounts[tab.name] || 0}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 10,
    height: 68,
    borderRadius: 22,
    borderWidth: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 6,
    paddingBottom: Platform.OS === 'ios' ? 10 : 8,
    paddingHorizontal: 4,
    ...theme.shadows.medium,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  inkWash: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  // Raised "seal stamp" capsule for the active tab
  sealPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#C23A2E',
    borderRadius: 16,
    paddingHorizontal: 9,
    paddingVertical: 6,
    overflow: 'visible',
    borderWidth: 0.5,
    borderColor: 'rgba(245, 215, 138, 0.35)',
    shadowColor: '#A32A1E',
    shadowOpacity: 0.28,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  sealTopLine: {
    position: 'absolute',
    top: 0,
    left: 10,
    right: 10,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(245, 215, 138, 0.55)',
  },
  sealIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sealTextWrap: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sealLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
    textAlign: 'left',
    includeFontPadding: false,
  },
  sealLabelCn: {
    color: '#F5D78A',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginTop: 1,
    textAlign: 'left',
    includeFontPadding: false,
  },
  badgeOnSeal: {
    backgroundColor: '#F5D78A',
  },
  iconWrap: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  label: {
    fontSize: 9,
    marginTop: 2,
    letterSpacing: 0.1,
    textAlign: 'center',
    includeFontPadding: false,
  },
});
