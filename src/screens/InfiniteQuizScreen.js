/**
 * Infinite Quiz Mode Screen
 *
 * Endless quiz mode with combo rewards and high score tracking.
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import { Flame, Zap, Trophy, X, ChevronRight, Clock, Target } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import { quizQuestions } from '../data/quiz';
import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';
import { PaperTexture } from '../components/PaperTexture';
import { calculateTotalXP } from '../data/badges';
import { STORAGE_KEYS } from '../config/storageKeys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../utils/errorHandling';
import { saveWrongAnswer } from '../utils/wrongAnswers';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Combo milestones and rewards
const COMBO_MILESTONES = [
  { count: 5, xpBonus: 10, label: 'Nice!', labelCn: '不错!' },
  { count: 10, xpBonus: 30, label: 'Great!', labelCn: '很棒!' },
  { count: 20, xpBonus: 80, label: 'Amazing!', labelCn: '太棒了!' },
  { count: 30, xpBonus: 150, label: 'Incredible!', labelCn: '不可思议!' },
  { count: 50, xpBonus: 300, label: 'LEGENDARY!', labelCn: '传说!' },
];

export function InfiniteQuizScreen() {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();

  // Game state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [comboMilestone, setComboMilestone] = useState(null);

  // Animation refs
  const comboScaleAnim = useRef(new Animated.Value(1)).current;
  const scoreBounceAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const milestoneAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Track used questions to avoid repeats in a single game
  const usedQuestionsRef = useRef(new Set());

  // Load high score on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEYS.QUIZ_HIGH_SCORE);
        if (saved) {
          const data = JSON.parse(saved);
          setHighScore(data.highScore || 0);
          setTotalQuestions(data.totalQuestions || 0);
        }
      } catch (e) {
        logger.error('InfiniteQuiz', 'Failed to load high score', e);
      }
    };
    loadData();
  }, []);

  // Get random question
  const getRandomQuestion = useCallback(() => {
    const available = quizQuestions.filter((_, idx) => !usedQuestionsRef.current.has(idx));
    if (available.length === 0) {
      // Reset if all questions used
      usedQuestionsRef.current.clear();
      return quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
    }
    const randomIdx = Math.floor(Math.random() * available.length);
    const originalIdx = quizQuestions.indexOf(available[randomIdx]);
    usedQuestionsRef.current.add(originalIdx);
    return available[randomIdx];
  }, []);

  // Start game
  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setCombo(0);
    setQuestionIndex(0);
    setGameOver(false);
    usedQuestionsRef.current.clear();
    setCurrentQuestion(getRandomQuestion());
    setSelectedAnswer(null);
    setShowResult(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  };

  // Handle answer selection
  const selectAnswer = (index) => {
    if (showResult) return;

    setSelectedAnswer(index);
    const correct = index === currentQuestion.correctIndex;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      // Correct answer
      const newCombo = combo + 1;
      setCombo(newCombo);
      setScore(prev => prev + 5 + Math.floor(newCombo / 5));
      setQuestionIndex(prev => prev + 1);

      // Animate combo
      Animated.sequence([
        Animated.spring(comboScaleAnim, {
          toValue: 1.3,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.spring(comboScaleAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();

      // Animate score
      Animated.spring(scoreBounceAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start(() => {
        scoreBounceAnim.setValue(0);
      });

      // Check combo milestone
      const milestone = COMBO_MILESTONES.find(m => m.count === newCombo);
      if (milestone) {
        setComboMilestone(milestone);
        Animated.sequence([
          Animated.spring(milestoneAnim, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
          }),
          Animated.delay(1500),
          Animated.timing(milestoneAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => setComboMilestone(null));

        // Add bonus XP
        setScore(prev => prev + milestone.xpBonus);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      }

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

      // Next question after delay
      setTimeout(() => {
        setCurrentQuestion(getRandomQuestion());
        setSelectedAnswer(null);
        setShowResult(false);
      }, 800);
    } else {
      // Wrong answer - game over
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});

      // Save wrong answer for review
      saveWrongAnswer(currentQuestion).catch(() => {});

      // Shake animation
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 300,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        endGame();
      }, 1500);
    }
  };

  // End game
  const endGame = async () => {
    setGameOver(true);
    setIsPlaying(false);

    // Save high score
    if (score > highScore) {
      setHighScore(score);
      try {
        await AsyncStorage.setItem(
          STORAGE_KEYS.QUIZ_HIGH_SCORE,
          JSON.stringify({ highScore: score, totalQuestions: questionIndex })
        );
      } catch (e) {
        logger.error('InfiniteQuiz', 'Failed to save high score', e);
      }
    }
  };

  // Render start screen
  if (!isPlaying && !gameOver) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <PaperTexture />
        <View style={styles.container}>
          <ScreenHeader
            kicker="Challenge"
            title="Infinite Quiz"
            subtitle="How many can you answer correctly in a row?"
          />

          {/* High Score */}
          <SectionCard style={styles.scoreCard} tone="soft">
            <Trophy size={24} color={colors.primary} strokeWidth={2} />
            <Text style={styles.scoreLabel}>High Score</Text>
            <Text style={styles.scoreValue}>{highScore}</Text>
            <Text style={styles.scoreSub}>Best: {totalQuestions} correct</Text>
          </SectionCard>

          {/* Combo Rewards */}
          <View style={styles.rewardsSection}>
            <Text style={styles.sectionTitle}>Combo Rewards</Text>
            {COMBO_MILESTONES.map((milestone, idx) => (
              <View key={milestone.count} style={styles.rewardItem}>
                <View style={[styles.rewardBadge, { backgroundColor: `${colors.primary}20` }]}>
                  <Flame size={14} color={colors.primary} strokeWidth={2} />
                  <Text style={styles.rewardCount}>{milestone.count}</Text>
                </View>
                <Text style={styles.rewardLabel}>{milestone.label}</Text>
                <Text style={styles.rewardXP}>+{milestone.xpBonus} XP</Text>
              </View>
            ))}
          </View>

          {/* Start Button */}
          <Pressable
            style={({ pressed }) => [styles.startBtn, pressed && styles.startBtnPressed]}
            onPress={startGame}
          >
            <Zap size={20} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.startBtnText}>Start Challenge</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Render game over screen
  if (gameOver) {
    const isNewHighScore = score >= highScore && score > 0;

    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <PaperTexture />
        <View style={styles.container}>
          <View style={styles.gameOverHeader}>
            {isNewHighScore ? (
              <>
                <Trophy size={48} color={colors.primary} strokeWidth={2} />
                <Text style={styles.newHighScore}>New High Score!</Text>
              </>
            ) : (
              <>
                <Target size={48} color={colors.mutedText} strokeWidth={1.5} />
                <Text style={styles.gameOverTitle}>Game Over</Text>
              </>
            )}
          </View>

          <SectionCard style={styles.resultCard} tone="panel">
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Score</Text>
              <Text style={styles.resultValue}>{score}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Questions</Text>
              <Text style={styles.resultValue}>{questionIndex}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Best Combo</Text>
              <Text style={styles.resultValue}>{combo}</Text>
            </View>
          </SectionCard>

          <View style={styles.gameOverButtons}>
            <Pressable
              style={({ pressed }) => [styles.playAgainBtn, pressed && styles.btnPressed]}
              onPress={startGame}
            >
              <Text style={styles.playAgainBtnText}>Play Again</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.backBtn, pressed && styles.btnPressed]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backBtnText}>Back</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Render game screen
  const shakeTranslate = shakeAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-10, 0, 10],
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <PaperTexture />

      {/* Header with score and combo */}
      <View style={styles.gameHeader}>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <X size={24} color={colors.mutedText} strokeWidth={2} />
        </Pressable>

        <View style={styles.headerStats}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Score</Text>
            <Animated.Text style={[styles.statValue, { transform: [{ scale: scoreBounceAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.2] }) }] }]}>
              {score}
            </Animated.Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Combo</Text>
            <Animated.View style={[styles.comboBox, { transform: [{ scale: comboScaleAnim }] }]}>
              <Flame size={16} color={combo >= 10 ? '#F59E0B' : colors.primary} strokeWidth={2} />
              <Text style={[styles.comboValue, combo >= 10 && styles.comboHigh]}>{combo}</Text>
            </Animated.View>
          </View>
        </View>
      </View>

      {/* Combo Milestone Popup */}
      {comboMilestone && (
        <Animated.View style={[styles.milestonePopup, { opacity: milestoneAnim, transform: [{ scale: milestoneAnim }] }]}>
          <Text style={styles.milestoneText}>{comboMilestone.label}</Text>
          <Text style={styles.milestoneXP}>+{comboMilestone.xpBonus} XP</Text>
        </Animated.View>
      )}

      {/* Question */}
      <Animated.View style={[styles.questionContainer, { opacity: fadeAnim, transform: [{ translateX: shakeTranslate }] }]}>
        <View style={styles.questionNumber}>
          <Text style={styles.questionNumberText}>#{questionIndex + 1}</Text>
        </View>
        <Text style={styles.questionText}>{currentQuestion?.question}</Text>
      </Animated.View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {currentQuestion?.options?.map((option, idx) => {
          let optionStyle = styles.option;
          let textStyle = styles.optionText;

          if (showResult) {
            if (idx === currentQuestion.correctIndex) {
              optionStyle = [styles.option, styles.optionCorrect];
              textStyle = [styles.optionText, styles.optionTextCorrect];
            } else if (idx === selectedAnswer && !isCorrect) {
              optionStyle = [styles.option, styles.optionWrong];
              textStyle = [styles.optionText, styles.optionTextWrong];
            }
          } else if (selectedAnswer === idx) {
            optionStyle = [styles.option, styles.optionSelected];
          }

          return (
            <Pressable
              key={idx}
              style={optionStyle}
              onPress={() => selectAnswer(idx)}
              disabled={showResult}
            >
              <Text style={textStyle}>{option}</Text>
              {showResult && idx === currentQuestion.correctIndex && (
                <Text style={styles.correctMark}>✓</Text>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Explanation */}
      {showResult && currentQuestion?.explanation && (
        <View style={styles.explanationBox}>
          <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  // Start Screen
  scoreCard: {
    alignItems: 'center',
    padding: 24,
    marginTop: 20,
  },
  scoreLabel: {
    fontSize: 12,
    color: theme.colors.mutedText,
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '800',
    color: theme.colors.text,
  },
  scoreSub: {
    fontSize: 11,
    color: theme.colors.mutedText,
    marginTop: 4,
  },
  rewardsSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 11,
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '700',
    marginBottom: 12,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.border,
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rewardCount: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  rewardLabel: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  rewardXP: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F59E0B',
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 999,
    marginTop: 32,
  },
  startBtnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  startBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  // Game Screen
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  closeBtn: {
    padding: 8,
  },
  headerStats: {
    flexDirection: 'row',
    gap: 20,
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: theme.colors.mutedText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.text,
  },
  comboBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.cinnabarGlow,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  comboValue: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  comboHigh: {
    color: '#F59E0B',
  },
  milestonePopup: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  milestoneText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#F59E0B',
    textShadowColor: 'rgba(245, 158, 11, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  milestoneXP: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 4,
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  questionNumber: {
    alignSelf: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  questionNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  questionText: {
    fontSize: 22,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 30,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  option: {
    backgroundColor: theme.colors.card,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  optionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.cinnabarGlow,
  },
  optionCorrect: {
    backgroundColor: '#10B98120',
    borderColor: '#10B981',
  },
  optionWrong: {
    backgroundColor: '#EF444420',
    borderColor: '#EF4444',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.text,
  },
  optionTextCorrect: {
    color: '#10B981',
    fontWeight: '600',
  },
  optionTextWrong: {
    color: '#EF4444',
  },
  correctMark: {
    position: 'absolute',
    right: 16,
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
  },
  explanationBox: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  explanationText: {
    fontSize: 13,
    color: theme.colors.mutedText,
    lineHeight: 20,
  },

  // Game Over Screen
  gameOverHeader: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  newHighScore: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F59E0B',
    marginTop: 12,
  },
  gameOverTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 12,
  },
  resultCard: {
    marginHorizontal: 20,
    padding: 20,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.border,
  },
  resultLabel: {
    fontSize: 14,
    color: theme.colors.mutedText,
  },
  resultValue: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
  },
  gameOverButtons: {
    marginTop: 32,
    paddingHorizontal: 20,
    gap: 12,
  },
  playAgainBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
  },
  playAgainBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  backBtn: {
    backgroundColor: theme.colors.surface,
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  backBtnText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  btnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
