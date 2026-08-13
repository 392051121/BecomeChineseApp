import React, { useEffect, useRef, useState, createContext, useContext } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Award, X, Sparkles, Star } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

const BadgeNotificationContext = createContext(null);

export function useBadgeNotification() {
  return useContext(BadgeNotificationContext);
}

export function BadgeNotificationProvider({ children }) {
  const { colors } = useTheme();
  const [notification, setNotification] = useState(null);
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const stampAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef(null);

  function showBadgeUnlock(badge) {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setNotification(badge);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

    // Reset animations
    scaleAnim.setValue(0.5);
    stampAnim.setValue(0);
    glowAnim.setValue(0);

    // Animate in with stamp effect
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
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // Stamp slam effect
    setTimeout(() => {
      Animated.sequence([
        Animated.spring(stampAnim, {
          toValue: 1,
          friction: 3,
          tension: 200,
          useNativeDriver: true,
        }),
        Animated.spring(stampAnim, {
          toValue: 0,
          friction: 5,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }, 200);

    // Glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      { iterations: 4 }
    ).start();

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

  const glowScale = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  const stampScale = stampAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  return (
    <BadgeNotificationContext.Provider value={{ showBadgeUnlock }}>
      {children}
      {notification && (
        <Animated.View
          style={[
            styles.notificationContainer,
            {
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <Pressable
            style={[styles.notificationCard, { borderColor: notification.color || colors.primary, backgroundColor: '#FFF9F5' }]}
            onPress={dismissNotification}
          >
            {/* Glow effect */}
            <Animated.View
              style={[
                styles.glowEffect,
                {
                  backgroundColor: (notification.color || colors.primary) + '20',
                  transform: [{ scale: glowScale }],
                },
              ]}
            />

            <Animated.View style={[styles.iconWrap, { backgroundColor: (notification.color || colors.primary) + '20', transform: [{ scale: stampScale }] }]}>
              <Award size={24} color={notification.color || colors.primary} strokeWidth={2} />
              <View style={[styles.starBadge, { backgroundColor: notification.color || colors.primary }]}>
                <Star size={10} color="#FFFFFF" strokeWidth={2} fill="#FFFFFF" />
              </View>
            </Animated.View>
            <View style={styles.content}>
              <Text style={[styles.title, { color: notification.color || colors.primary }]}>Achievement Unlocked!</Text>
              <Text style={[styles.badgeName, { color: colors.text }]}>{notification.nameEn}</Text>
              <Text style={[styles.badgeNameCn, { color: notification.color || colors.primary }]}>{notification.nameCn}</Text>
              <View style={[styles.xpPill, { backgroundColor: (notification.color || colors.primary) + '20' }]}>
                <Sparkles size={10} color={notification.color || colors.primary} strokeWidth={2} />
                <Text style={[styles.xpText, { color: notification.color || colors.primary }]}>+{notification.xp} XP</Text>
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
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    backgroundColor: '#FFF9F5',
    padding: 16,
    ...theme.shadows.strong,
    overflow: 'hidden',
  },
  glowEffect: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    borderRadius: 40,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  starBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  xpText: {
    fontSize: 11,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 8,
  },
});
