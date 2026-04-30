import React, { useEffect, useRef, useState, createContext, useContext } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Award, X, Sparkles } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

const BadgeNotificationContext = createContext(null);

export function useBadgeNotification() {
  return useContext(BadgeNotificationContext);
}

export function BadgeNotificationProvider({ children }) {
  const { colors, isDark } = useTheme();
  const [notification, setNotification] = useState(null);
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef(null);

  function showBadgeUnlock(badge) {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setNotification(badge);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

    // Animate in
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: theme.motion.durationFast,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss after 5 seconds
    timeoutRef.current = setTimeout(() => {
      dismissNotification();
    }, 5000);
  }

  function dismissNotification() {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: theme.motion.durationFast,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: theme.motion.durationFast,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setNotification(null);
    });
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <BadgeNotificationContext.Provider value={{ showBadgeUnlock }}>
      {children}
      {notification && (
        <Animated.View
          style={[
            styles.notificationContainer,
            {
              transform: [{ translateY: slideAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <Pressable
            style={[styles.notificationCard, { borderColor: colors.primary, backgroundColor: isDark ? colors.surface : '#FFF9F5' }]}
            onPress={dismissNotification}
          >
            <View style={[styles.iconWrap, { backgroundColor: colors.cinnabarGlow }]}>
              <Sparkles size={20} color={notification.color || colors.primary} strokeWidth={2} />
            </View>
            <View style={styles.content}>
              <Text style={[styles.title, { color: colors.primary }]}>Badge Unlocked!</Text>
              <Text style={[styles.badgeName, { color: colors.text }]}>{notification.nameEn}</Text>
              <Text style={[styles.badgeNameCn, { color: colors.primary }]}>{notification.nameCn}</Text>
              <View style={[styles.xpPill, { backgroundColor: colors.goldLeaf }]}>
                <Text style={[styles.xpText, { color: colors.success }]}>+{notification.xp} XP</Text>
              </View>
            </View>
            <Pressable style={styles.closeBtn} onPress={dismissNotification}>
              <X size={16} color={colors.mutedText} strokeWidth={2} />
            </Pressable>
          </Pressable>
        </Animated.View>
      )}
    </BadgeNotificationContext.Provider>
  );
}

const styles = StyleSheet.create({
  notificationContainer: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: '#FFF9F5',
    padding: 16,
    ...theme.shadows.strong,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: theme.colors.cinnabarGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    color: theme.colors.primary,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  badgeName: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  badgeNameCn: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  xpPill: {
    alignSelf: 'flex-start',
    marginTop: 6,
    backgroundColor: theme.colors.goldLeaf,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  xpText: {
    color: theme.colors.success,
    fontSize: 10,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 8,
  },
});
