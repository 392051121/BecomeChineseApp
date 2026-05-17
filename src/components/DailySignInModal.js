/**
 * Daily Sign-In Modal
 *
 * Displays daily check-in rewards with streak bonuses.
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CalendarDays, Flame, Gift, X, Sparkles, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { PaperTexture } from './PaperTexture';
import {
  signInToday,
  getSignInStatus,
  getWeekRewards,
  SIGN_IN_REWARDS,
  STREAK_BONUSES,
} from '../utils/dailySignIn';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function DailySignInModal({ visible, onClose, onSignIn }) {
  const { colors } = useTheme();
  const [status, setStatus] = useState(null);
  const [signingIn, setSigningIn] = useState(false);
  const [signInResult, setSignInResult] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const celebrationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      loadStatus();
      // Animate in
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset
      scaleAnim.setValue(0.9);
      opacityAnim.setValue(0);
      setSignInResult(null);
      setShowCelebration(false);
    }
  }, [visible]);

  const loadStatus = async () => {
    const s = await getSignInStatus();
    setStatus(s);
  };

  const handleSignIn = async () => {
    if (signingIn || status?.signedInToday) return;

    setSigningIn(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

    const result = await signInToday();

    if (result.success) {
      setSignInResult(result);
      setShowCelebration(true);

      // Celebration animation
      Animated.spring(celebrationAnim, {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }).start();

      // Update status
      await loadStatus();

      // Callback
      onSignIn?.(result);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }

    setSigningIn(false);
  };

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose?.();
    });
  };

  if (!status) return null;

  const weekRewards = getWeekRewards(status.dayInCycle);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <PaperTexture />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <CalendarDays size={24} color={colors.primary} strokeWidth={2} />
            </View>
            <Text style={styles.title}>Daily Check-In</Text>
            <Text style={styles.titleCn}>每日签到</Text>
            <Pressable style={styles.closeBtn} onPress={handleClose}>
              <X size={20} color={colors.mutedText} strokeWidth={2} />
            </Pressable>
          </View>

          {/* Streak info */}
          <View style={styles.streakRow}>
            <View style={styles.streakItem}>
              <Flame size={16} color={colors.primary} strokeWidth={2} />
              <Text style={styles.streakValue}>{status.currentStreak}</Text>
              <Text style={styles.streakLabel}>Day Streak</Text>
            </View>
            {status.activeBonus && (
              <View style={[styles.bonusBadge, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[styles.bonusText, { color: colors.primary }]}>
                  {status.activeBonus.multiplier}x Bonus!
                </Text>
              </View>
            )}
          </View>

          {/* Week rewards grid */}
          <View style={styles.rewardsGrid}>
            {weekRewards.map((reward) => (
              <View
                key={reward.day}
                style={[
                  styles.rewardDay,
                  reward.claimed && styles.rewardDayClaimed,
                  reward.current && styles.rewardDayCurrent,
                  reward.locked && styles.rewardDayLocked,
                ]}
              >
                <Text style={[
                  styles.rewardDayNum,
                  reward.claimed && styles.rewardDayNumClaimed,
                  reward.current && styles.rewardDayNumCurrent,
                ]}>
                  {reward.day}
                </Text>
                <View style={[
                  styles.rewardIcon,
                  reward.claimed && { backgroundColor: colors.primary + '20' },
                  reward.current && { backgroundColor: colors.cinnabarGlow },
                ]}>
                  {reward.claimed ? (
                    <Check size={16} color={colors.primary} strokeWidth={2.5} />
                  ) : reward.type === 'bonus' ? (
                    <Gift size={16} color={reward.locked ? colors.mutedText : '#F59E0B'} strokeWidth={2} />
                  ) : (
                    <Sparkles size={16} color={reward.locked ? colors.mutedText : colors.primary} strokeWidth={2} />
                  )}
                </View>
                <Text style={[
                  styles.rewardXP,
                  reward.claimed && { color: colors.primary },
                  reward.locked && { color: colors.mutedText },
                ]}>
                  +{reward.xp}
                </Text>
              </View>
            ))}
          </View>

          {/* Sign-in button or status */}
          {status.signedInToday ? (
            <View style={styles.alreadySignedIn}>
              <Check size={20} color={colors.success} strokeWidth={2} />
              <Text style={styles.alreadySignedInText}>Checked in today!</Text>
              <Text style={styles.alreadySignedInSub}>Come back tomorrow</Text>
            </View>
          ) : (
            <Pressable
              style={({ pressed }) => [
                styles.signInBtn,
                signingIn && styles.signInBtnLoading,
                pressed && styles.signInBtnPressed,
              ]}
              onPress={handleSignIn}
              disabled={signingIn}
            >
              <Flame size={18} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.signInBtnText}>
                {signingIn ? 'Signing in...' : 'Check In Now'}
              </Text>
            </Pressable>
          )}

          {/* Celebration overlay */}
          {showCelebration && signInResult && (
            <Animated.View
              style={[
                styles.celebrationOverlay,
                { transform: [{ scale: celebrationAnim }] },
              ]}
            >
              <View style={styles.celebrationCard}>
                <Sparkles size={32} color={colors.primary} strokeWidth={2} />
                <Text style={styles.celebrationTitle}>Awesome!</Text>
                <Text style={styles.celebrationTitleCn}>太棒了!</Text>
                <View style={styles.celebrationXP}>
                  <Text style={styles.celebrationXPText}>+{signInResult.reward.xp} XP</Text>
                </View>
                {signInResult.multiplier > 1 && (
                  <Text style={styles.celebrationBonus}>
                    {signInResult.multiplier}x Streak Bonus!
                  </Text>
                )}
                {signInResult.isNewRecord && (
                  <Text style={styles.celebrationRecord}>New Record!</Text>
                )}
                <Pressable style={styles.celebrationClose} onPress={() => setShowCelebration(false)}>
                  <Text style={styles.celebrationCloseText}>Continue</Text>
                </Pressable>
              </View>
            </Animated.View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

/**
 * Compact sign-in button for home screen
 */
export function DailySignInButton({ onPress, signedIn, streak }) {
  const { colors } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!signedIn) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [signedIn]);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.compactBtn,
        signedIn && styles.compactBtnSignedIn,
        pressed && styles.compactBtnPressed,
      ]}
      onPress={onPress}
    >
      <Animated.View style={{ transform: [{ scale: signedIn ? 1 : pulseAnim }] }}>
        {signedIn ? (
          <Check size={14} color={colors.success} strokeWidth={2.5} />
        ) : (
          <CalendarDays size={14} color={colors.primary} strokeWidth={2} />
        )}
      </Animated.View>
      <Text style={[styles.compactBtnText, signedIn && styles.compactBtnTextSignedIn]}>
        {signedIn ? 'Done' : 'Check In'}
      </Text>
      {streak > 0 && (
        <View style={styles.compactStreak}>
          <Flame size={10} color="#F59E0B" strokeWidth={2} />
          <Text style={styles.compactStreakText}>{streak}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: SCREEN_WIDTH - 40,
    backgroundColor: '#FFFBF6',
    borderRadius: 24,
    overflow: 'hidden',
    ...theme.shadows.strong,
  },
  header: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
    position: 'relative',
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: theme.colors.cinnabarGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.text,
  },
  titleCn: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
    marginTop: 2,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  streakItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.cinnabarGlow,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  streakValue: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  streakLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  bonusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  bonusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  rewardsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  rewardDay: {
    alignItems: 'center',
    width: 40,
  },
  rewardDayClaimed: {},
  rewardDayCurrent: {},
  rewardDayLocked: {
    opacity: 0.5,
  },
  rewardDayNum: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.mutedText,
    marginBottom: 6,
  },
  rewardDayNumClaimed: {
    color: theme.colors.primary,
  },
  rewardDayNumCurrent: {
    color: theme.colors.text,
  },
  rewardIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  rewardXP: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.text,
  },
  signInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: 999,
  },
  signInBtnLoading: {
    opacity: 0.7,
  },
  signInBtnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  signInBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  alreadySignedIn: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 24,
  },
  alreadySignedInText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.success,
    marginTop: 8,
  },
  alreadySignedInSub: {
    fontSize: 12,
    color: theme.colors.mutedText,
    marginTop: 2,
  },
  celebrationOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  celebrationCard: {
    backgroundColor: '#FFFBF6',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: 260,
  },
  celebrationTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.text,
    marginTop: 12,
  },
  celebrationTitleCn: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
    marginTop: 2,
  },
  celebrationXP: {
    marginTop: 16,
    backgroundColor: theme.colors.cinnabarGlow,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
  },
  celebrationXPText: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  celebrationBonus: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#F59E0B',
  },
  celebrationRecord: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.success,
  },
  celebrationClose: {
    marginTop: 20,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
  },
  celebrationCloseText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  // Compact button styles
  compactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.cinnabarGlow,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  compactBtnSignedIn: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  compactBtnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  compactBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  compactBtnTextSignedIn: {
    color: theme.colors.success,
  },
  compactStreak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginLeft: 4,
  },
  compactStreakText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#F59E0B',
  },
});
