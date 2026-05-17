/**
 * Daily Tasks Component
 *
 * Displays daily objectives with progress and rewards.
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
import {
  Target,
  Bookmark,
  MapPin,
  UtensilsCrossed,
  BookOpen,
  Flame,
  Gift,
  X,
  Check,
  Sparkles,
  ChevronRight,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { PaperTexture } from './PaperTexture';
import {
  getTasksSummary,
  claimTaskReward,
  TASK_CATEGORIES,
} from '../utils/dailyTasks';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Icon mapping
const ICON_MAP = {
  Target,
  Bookmark,
  MapPin,
  UtensilsCrossed,
  BookOpen,
  Flame,
};

export function DailyTasksModal({ visible, onClose, onClaim }) {
  const { colors } = useTheme();
  const [summary, setSummary] = useState(null);
  const [claiming, setClaiming] = useState(null);
  const [claimResult, setClaimResult] = useState(null);

  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      loadTasks();
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
      scaleAnim.setValue(0.9);
      opacityAnim.setValue(0);
      setClaimResult(null);
    }
  }, [visible]);

  const loadTasks = async () => {
    const data = await getTasksSummary();
    setSummary(data);
  };

  const handleClaim = async (taskId) => {
    if (claiming) return;

    setClaiming(taskId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

    const result = await claimTaskReward(taskId);

    if (result.success) {
      setClaimResult(result);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

      // Refresh tasks
      await loadTasks();

      // Callback
      onClaim?.(result);
    }

    setClaiming(null);
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

  if (!summary) return null;

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
              <Target size={24} color={colors.primary} strokeWidth={2} />
            </View>
            <Text style={styles.title}>Daily Tasks</Text>
            <Text style={styles.titleCn}>每日任务</Text>
            <Pressable style={styles.closeBtn} onPress={handleClose}>
              <X size={20} color={colors.mutedText} strokeWidth={2} />
            </Pressable>
          </View>

          {/* Progress Summary */}
          <View style={styles.progressRow}>
            <View style={styles.progressItem}>
              <Text style={styles.progressValue}>{summary.claimedCount}/{summary.tasks.length}</Text>
              <Text style={styles.progressLabel}>Completed</Text>
            </View>
            {summary.totalXP > 0 && (
              <View style={[styles.xpPending, { backgroundColor: colors.primary + '20' }]}>
                <Sparkles size={12} color={colors.primary} strokeWidth={2} />
                <Text style={[styles.xpPendingText, { color: colors.primary }]}>
                  +{summary.totalXP} XP to claim
                </Text>
              </View>
            )}
          </View>

          {/* Tasks List */}
          <View style={styles.tasksList}>
            {summary.tasks.map((task) => {
              const TaskIcon = ICON_MAP[task.icon] || Target;
              const category = TASK_CATEGORIES.find(c => c.id === task.category);
              const progressPercent = Math.min((task.progress / task.target) * 100, 100);

              return (
                <View
                  key={task.id}
                  style={[
                    styles.taskCard,
                    task.isClaimed && styles.taskCardClaimed,
                  ]}
                >
                  <View style={[styles.taskIcon, { backgroundColor: (category?.color || colors.primary) + '20' }]}>
                    <TaskIcon size={18} color={category?.color || colors.primary} strokeWidth={2} />
                  </View>

                  <View style={styles.taskContent}>
                    <Text style={styles.taskLabel}>{task.label}</Text>
                    <Text style={[styles.taskLabelCn, { color: category?.color || colors.primary }]}>
                      {task.labelCn}
                    </Text>

                    {/* Progress bar */}
                    <View style={styles.progressBarWrap}>
                      <View style={styles.progressBarTrack}>
                        <View
                          style={[
                            styles.progressBarFill,
                            {
                              width: `${progressPercent}%`,
                              backgroundColor: task.isCompleted ? colors.success : category?.color || colors.primary,
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.progressText}>
                        {task.progress}/{task.target}
                      </Text>
                    </View>
                  </View>

                  {/* XP Badge or Claim Button */}
                  {task.isClaimed ? (
                    <View style={styles.claimedBadge}>
                      <Check size={14} color={colors.success} strokeWidth={2.5} />
                    </View>
                  ) : task.isCompleted ? (
                    <Pressable
                      style={({ pressed }) => [
                        styles.claimBtn,
                        claiming === task.id && styles.claimBtnLoading,
                        pressed && styles.claimBtnPressed,
                      ]}
                      onPress={() => handleClaim(task.id)}
                      disabled={claiming === task.id}
                    >
                      <Gift size={14} color="#FFFFFF" strokeWidth={2} />
                      <Text style={styles.claimBtnText}>+{task.xp}</Text>
                    </Pressable>
                  ) : (
                    <View style={styles.xpBadge}>
                      <Text style={styles.xpBadgeText}>+{task.xp} XP</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* All done message */}
          {summary.allClaimed && (
            <View style={styles.allDoneWrap}>
              <Check size={20} color={colors.success} strokeWidth={2.5} />
              <Text style={styles.allDoneText}>All tasks completed!</Text>
              <Text style={styles.allDoneSub}>Come back tomorrow for new tasks</Text>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

/**
 * Compact daily tasks button for home screen
 */
export function DailyTasksButton({ onPress, completedCount, totalCount, hasUnclaimed }) {
  const { colors } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (hasUnclaimed) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [hasUnclaimed]);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.compactBtn,
        hasUnclaimed && styles.compactBtnHighlight,
        pressed && styles.compactBtnPressed,
      ]}
      onPress={onPress}
    >
      <Animated.View style={{ transform: [{ scale: hasUnclaimed ? pulseAnim : 1 }] }}>
        <Target size={14} color={hasUnclaimed ? colors.primary : colors.primary} strokeWidth={2} />
      </Animated.View>
      <Text style={styles.compactBtnText}>
        {completedCount}/{totalCount}
      </Text>
      {hasUnclaimed && (
        <View style={[styles.unclaimedDot, { backgroundColor: colors.primary }]} />
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
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  progressItem: {
    alignItems: 'center',
  },
  progressValue: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text,
  },
  progressLabel: {
    fontSize: 11,
    color: theme.colors.mutedText,
    fontWeight: '600',
  },
  xpPending: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  xpPendingText: {
    fontSize: 11,
    fontWeight: '700',
  },
  tasksList: {
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 16,
    padding: 12,
  },
  taskCardClaimed: {
    opacity: 0.7,
  },
  taskIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskContent: {
    flex: 1,
  },
  taskLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text,
  },
  taskLabelCn: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  progressBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  progressBarTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 4,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.mutedText,
  },
  xpBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  xpBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.mutedText,
  },
  claimBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  claimBtnLoading: {
    opacity: 0.7,
  },
  claimBtnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  claimBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  claimedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  allDoneWrap: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 20,
  },
  allDoneText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.success,
    marginTop: 8,
  },
  allDoneSub: {
    fontSize: 12,
    color: theme.colors.mutedText,
    marginTop: 2,
  },

  // Compact button
  compactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.cinnabarGlow,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  compactBtnHighlight: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
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
  unclaimedDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
