/**
 * Custom Tab Bar Component
 *
 * Enhanced bottom navigation with Chinese aesthetic:
 * - Ink wash selection effect
 * - Badge indicators
 * - Smooth animations
 */

import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, Platform } from 'react-native';
import { CalendarDays, Clock, House, Map, User, UtensilsCrossed, Scroll } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useNavigation, useRoute } from '@react-navigation/native';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { getWrongAnswers } from '../utils/wrongAnswers';
import { logger } from '../utils/errorHandling';

// Tab configuration with bilingual labels
const tabs = [
  { name: 'Home', label: 'Home', labelCn: '首页', icon: House },
  { name: 'Seasons', label: 'Seasons', labelCn: '节气', icon: CalendarDays },
  { name: 'History', label: 'History', labelCn: '历史', icon: Scroll },
  { name: 'Food', label: 'Food', labelCn: '美食', icon: UtensilsCrossed },
  { name: 'Places', label: 'Places', labelCn: '城市', icon: Map },
  { name: 'Profile', label: 'Profile', labelCn: '我的', icon: User },
];

function TabItem({ tab, isActive, onPress, colors, isDark, badgeCount }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const inkAnim = useRef(new Animated.Value(0)).current;
  const Icon = tab.icon;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(inkAnim, {
        toValue: isActive ? 1 : 0,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: isActive ? 1.05 : 1,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isActive]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress(tab.name);
  };

  const inkScale = inkAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const inkOpacity = inkAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.15],
  });

  const hasBadge = badgeCount > 0;

  return (
    <Pressable
      onPress={handlePress}
      style={styles.tabItem}
      accessibilityRole="button"
      accessibilityLabel={tab.label}
      accessibilityHint={isActive ? 'Current screen' : `Go to ${tab.label}`}
    >
      <Animated.View style={[styles.tabContent, { transform: [{ scale: scaleAnim }] }]}>
        {/* Ink wash background effect */}
        <Animated.View
          style={[
            styles.inkWash,
            {
              transform: [{ scale: inkScale }],
              opacity: inkOpacity,
              backgroundColor: colors.primary,
            },
          ]}
        />

        {/* Icon */}
        <View style={styles.iconWrap}>
          <Icon
            size={22}
            color={isActive ? colors.primary : (isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(27, 23, 21, 0.45)')}
            strokeWidth={isActive ? 2.5 : 2}
          />

          {/* Badge indicator */}
          {hasBadge && (
            <View style={[styles.badge, { backgroundColor: colors.primary }]}>
              <Text style={styles.badgeText}>
                {badgeCount > 9 ? '9+' : badgeCount}
              </Text>
            </View>
          )}
        </View>

        {/* Label */}
        <Text
          style={[
            styles.label,
            {
              color: isActive ? colors.primary : (isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(27, 23, 21, 0.45)'),
              fontWeight: isActive ? '700' : '500',
            },
          ]}
        >
          {tab.label}
        </Text>

        {/* Active indicator dot */}
        {isActive && (
          <View style={[styles.activeDot, { backgroundColor: colors.primary }]} />
        )}
      </Animated.View>
    </Pressable>
  );
}

export function CustomTabBar({ state, navigation }) {
  const { colors, isDark } = useTheme();
  const currentRoute = state.routes[state.index].name;
  const [wrongAnswersCount, setWrongAnswersCount] = useState(0);

  // Load wrong answers count for Seasons tab badge
  useEffect(() => {
    const loadBadgeData = async () => {
      try {
        const wrongAnswers = await getWrongAnswers();
        const unmasteredCount = wrongAnswers.filter(a => !a.mastered).length;
        setWrongAnswersCount(unmasteredCount);
      } catch (e) {
        logger.error('CustomTabBar', 'Failed to load wrong answers count', e);
      }
    };

    loadBadgeData();
  }, []);

  // Refresh badge when route changes
  useEffect(() => {
    const loadBadgeData = async () => {
      try {
        const wrongAnswers = await getWrongAnswers();
        const unmasteredCount = wrongAnswers.filter(a => !a.mastered).length;
        setWrongAnswersCount(unmasteredCount);
      } catch (e) {
        logger.error('CustomTabBar', 'Failed to load wrong answers count', e);
      }
    };

    loadBadgeData();
  }, [currentRoute]);

  const handlePress = (tabName) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: tabName,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      navigation.navigate(tabName);
    }
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
          backgroundColor: isDark ? 'rgba(30, 28, 26, 0.96)' : 'rgba(255, 251, 246, 0.96)',
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
          isDark={isDark}
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
    width: 48,
    height: 48,
    borderRadius: 24,
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
    fontSize: 10,
    marginTop: 2,
    letterSpacing: 0.2,
  },
  activeDot: {
    position: 'absolute',
    bottom: -4,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
