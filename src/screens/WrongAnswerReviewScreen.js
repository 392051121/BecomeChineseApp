import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BookOpen, Check, X, Trash2, Target, TrendingUp, Award, CalendarDays } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { HandscrollContainer } from '../components/HandscrollContainer';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';
import { StampFeedback } from '../components/StampFeedback';
import { SkeletonCard } from '../components/Skeleton';
import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import {
  getWrongAnswers,
  markAsReviewed,
  removeWrongAnswer,
  getReviewSummary,
} from '../utils/wrongAnswers';
import { FLATLIST_CONFIG } from '../config/constants';

function ReviewQuestionCard({ item, onCorrect, onWrong, onRemove }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [answered, setAnswered] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  function handleSelect(index) {
    if (answered) return;

    const isCorrect = index === item.correctIndex;
    setSelectedIndex(index);
    setAnswered(true);

    Haptics.selectionAsync().catch(() => {});

    setTimeout(() => {
      if (isCorrect) {
        onCorrect?.(item.id);
      } else {
        onWrong?.(item.id);
      }
    }, 1500);
  }

  async function handleRemove() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    await onRemove?.(item.id);
  }

  return (
    <Animated.View style={[styles.questionCard, { opacity: fadeAnim }]}>
      <View style={styles.questionHeader}>
        <View style={styles.regionBadge}>
          <Text style={styles.regionText}>{item.region || 'General'}</Text>
        </View>
        {item.reviewCount > 0 && (
          <View style={styles.reviewCountBadge}>
            <Text style={styles.reviewCountText}>Reviewed {item.reviewCount}x</Text>
          </View>
        )}
      </View>

      <Text style={styles.questionText}>{item.question}</Text>

      <View style={styles.optionsWrap}>
        {item.options.map((option, index) => {
          const isCorrect = answered && index === item.correctIndex;
          const isWrong = answered && selectedIndex === index && !isCorrect;

          return (
            <Pressable
              key={option}
              style={[
                styles.optionBtn,
                isCorrect && styles.optionBtnCorrect,
                isWrong && styles.optionBtnWrong,
              ]}
              onPress={() => handleSelect(index)}
              disabled={answered}
              accessibilityRole="button"
              accessibilityLabel={`Option ${['A', 'B', 'C', 'D'][index]}: ${option}`}
              accessibilityHint={answered ? "Answer already submitted" : "Double tap to select this answer"}
            >
              <View style={styles.optionLetterWrap}>
                <Text style={styles.optionLetter}>{['A', 'B', 'C', 'D'][index]}</Text>
              </View>
              <Text style={styles.optionText}>{option}</Text>
              {isCorrect && <Check size={16} color={theme.colors.success} strokeWidth={2} />}
              {isWrong && <X size={16} color="#B33B24" strokeWidth={2} />}
            </Pressable>
          );
        })}
      </View>

      {answered && (
        <View style={styles.explanationWrap}>
          <Text style={styles.explanationLabel}>Explanation</Text>
          <Text style={styles.explanationText}>{item.explanation}</Text>
          {selectedIndex === item.correctIndex ? (
            <StampFeedback label="Correct!" active={true} style={styles.stampFeedback} tone="gold" />
          ) : (
            <View style={styles.wrongHint}>
              <Text style={styles.wrongHintText}>The correct answer was: {item.options[item.correctIndex]}</Text>
            </View>
          )}
        </View>
      )}

      {answered && (
        <Pressable style={styles.removeBtn} onPress={handleRemove} accessibilityRole="button" accessibilityLabel="Remove from review" accessibilityHint="Double tap to remove this question from your review list">
          <Trash2 size={14} color={theme.colors.mutedText} strokeWidth={2} />
          <Text style={styles.removeBtnText}>Remove from Review</Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

export function WrongAnswerReviewScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [answers, summaryData] = await Promise.all([
      getWrongAnswers(),
      getReviewSummary(),
    ]);
    setWrongAnswers(answers.filter((a) => !a.mastered));
    setSummary(summaryData);
    setLoading(false);
  }

  async function handleCorrect(questionId) {
    await markAsReviewed(questionId, true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    // Remove from list after correct answer
    setWrongAnswers((prev) => prev.filter((a) => a.id !== questionId));
  }

  async function handleWrong(questionId) {
    await markAsReviewed(questionId, false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
  }

  async function handleRemove(questionId) {
    await removeWrongAnswer(questionId);
    setWrongAnswers((prev) => prev.filter((a) => a.id !== questionId));
  }

  const pendingCount = wrongAnswers.length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <HandscrollContainer style={styles.scrollShell}>
        <View style={styles.container}>
          <ScreenHeader
            kicker="Review"
            title="Wrong Answers"
            subtitle="Review questions you got wrong and learn from your mistakes."
            includeTopInset={false}
          />

          {/* Summary Stats */}
          {summary && (
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <BookOpen size={18} color={theme.colors.primary} strokeWidth={2} />
                <Text style={styles.statValue}>{pendingCount}</Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
              <View style={styles.statCard}>
                <Target size={18} color={theme.colors.success} strokeWidth={2} />
                <Text style={styles.statValue}>{summary.mastered}</Text>
                <Text style={styles.statLabel}>Mastered</Text>
              </View>
              <View style={styles.statCard}>
                <TrendingUp size={18} color='#E2B05E' strokeWidth={2} />
                <Text style={styles.statValue}>{summary.accuracy}%</Text>
                <Text style={styles.statLabel}>Accuracy</Text>
              </View>
            </View>
          )}

          {/* Progress Card */}
          {summary && summary.total > 0 && (
            <SectionCard style={styles.progressCard} tone="soft">
              <View style={styles.progressHeader}>
                <Award size={16} color={theme.colors.primary} strokeWidth={2} />
                <Text style={styles.progressTitle}>Learning Progress</Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${(summary.mastered / summary.total) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {summary.mastered} of {summary.total} questions mastered
              </Text>
            </SectionCard>
          )}

          {/* Questions List */}
          {loading ? (
            <View style={styles.loadingWrap}>
              <SkeletonCard style={{ marginBottom: 12 }} />
              <SkeletonCard style={{ marginBottom: 12 }} />
              <SkeletonCard />
            </View>
          ) : wrongAnswers.length === 0 ? (
            <SectionCard style={styles.emptyCard} tone="panel">
              <Check size={40} color={theme.colors.success} strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>All Caught Up!</Text>
              <Text style={styles.emptyText}>
                You have no wrong answers to review. Keep answering daily questions to build your knowledge!
              </Text>
              <Pressable
                style={styles.emptyButton}
                onPress={() => navigation.goBack()}
                accessibilityRole="button"
                accessibilityLabel="Go to Daily Quiz"
              >
                <CalendarDays size={16} color={theme.colors.primary} strokeWidth={2} />
                <Text style={styles.emptyButtonText}>Go to Daily Quiz</Text>
              </Pressable>
            </SectionCard>
          ) : (
            <View style={styles.questionsSection}>
              <Text style={styles.sectionLabel}>Questions to Review</Text>
              <FlatList
                data={wrongAnswers}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <ReviewQuestionCard
                    item={item}
                    onCorrect={handleCorrect}
                    onWrong={handleWrong}
                    onRemove={handleRemove}
                  />
                )}
                initialNumToRender={FLATLIST_CONFIG.INITIAL_NUM_TO_RENDER}
                maxToRenderPerBatch={FLATLIST_CONFIG.MAX_TO_RENDER_PER_BATCH}
                windowSize={FLATLIST_CONFIG.WINDOW_SIZE}
                scrollEnabled={false}
              />
            </View>
          )}
        </View>
      </HandscrollContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollShell: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 100,
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
  },
  statValue: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginTop: 6,
  },
  statLabel: {
    color: theme.colors.mutedText,
    fontSize: 10,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '700',
  },

  // Progress Card
  progressCard: {
    marginTop: 14,
    padding: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  progressTitle: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(51, 51, 51, 0.08)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    backgroundColor: theme.colors.success,
    borderRadius: 4,
  },
  progressText: {
    marginTop: 8,
    color: theme.colors.mutedText,
    fontSize: 12,
    textAlign: 'center',
  },

  // Questions Section
  questionsSection: {
    marginTop: 20,
  },
  sectionLabel: {
    color: theme.colors.primary,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 12,
  },

  // Question Card
  questionCard: {
    marginTop: 10,
    borderRadius: theme.radii.lg,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    padding: 16,
    ...theme.shadows.subtle,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  regionBadge: {
    backgroundColor: theme.colors.cinnabarGlow,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  regionText: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  reviewCountBadge: {
    backgroundColor: 'rgba(51, 51, 51, 0.06)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  reviewCountText: {
    color: theme.colors.mutedText,
    fontSize: 10,
    fontWeight: '600',
  },
  questionText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  optionsWrap: {
    marginTop: 14,
    gap: 8,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  optionBtnCorrect: {
    borderColor: theme.colors.success,
    backgroundColor: theme.colors.goldLeaf,
  },
  optionBtnWrong: {
    borderColor: '#B33B24',
    backgroundColor: 'rgba(179, 59, 36, 0.08)',
  },
  optionLetterWrap: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: theme.colors.cinnabarGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLetter: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '800',
  },
  optionText: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '500',
  },

  // Explanation
  explanationWrap: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.border,
  },
  explanationLabel: {
    color: theme.colors.primary,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 6,
  },
  explanationText: {
    color: theme.colors.mutedText,
    fontSize: 13,
    lineHeight: 20,
  },
  stampFeedback: {
    marginTop: 12,
    alignItems: 'center',
  },
  wrongHint: {
    marginTop: 10,
    padding: 10,
    borderRadius: theme.radii.sm,
    backgroundColor: 'rgba(179, 59, 36, 0.08)',
  },
  wrongHintText: {
    color: '#B33B24',
    fontSize: 12,
    textAlign: 'center',
  },

  // Remove Button
  removeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: theme.radii.sm,
    backgroundColor: 'rgba(51, 51, 51, 0.04)',
  },
  removeBtnText: {
    color: theme.colors.mutedText,
    fontSize: 12,
    fontWeight: '600',
  },

  // Empty State
  emptyCard: {
    marginTop: 20,
    padding: 32,
    alignItems: 'center',
  },
  emptyTitle: {
    marginTop: 16,
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  emptyText: {
    marginTop: 8,
    color: theme.colors.mutedText,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyButton: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.cinnabarGlow,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
  },
  emptyButtonText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },

  loadingWrap: {
    marginTop: 16,
  },
});
