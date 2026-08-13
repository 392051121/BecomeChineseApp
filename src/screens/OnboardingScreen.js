import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Sparkles, Clock, Map, UtensilsCrossed, Scroll, Target, Lightbulb, ArrowRight, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { PaperTexture } from '../components/PaperTexture';
import { STORAGE_KEYS } from '../config/storageKeys';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const interestOptions = [
  { id: 'history', label: 'History', labelCn: '历史', icon: Scroll, desc: 'Dynasties, emperors, and timelines' },
  { id: 'food', label: 'Food', labelCn: '美食', icon: UtensilsCrossed, desc: 'Regional dishes and food culture' },
  { id: 'places', label: 'Places', labelCn: '城市', icon: Map, desc: 'Cities, landmarks, and local stories' },
  { id: 'comprehensive', label: 'All Paths', labelCn: '综合', icon: Sparkles, desc: 'Explore everything together' },
];

const goalOptions = [
  { id: 'casual', label: 'Casual Discovery', labelCn: '轻度了解', icon: Lightbulb, desc: 'A few minutes a day, light browsing' },
  { id: 'focused', label: 'Focused Learning', labelCn: '深度学习', icon: Target, desc: 'Build knowledge systematically' },
];

const steps = [
  { id: 'welcome', title: 'Welcome', titleCn: '欢迎' },
  { id: 'interests', title: 'Your Interests', titleCn: '兴趣方向' },
  { id: 'goals', title: 'Learning Goal', titleCn: '学习目标' },
  { id: 'ready', title: 'Ready to Start', titleCn: '准备开始' },
];

export function OnboardingScreen({ onComplete }) {
  const { colors } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState(['comprehensive']);
  const [selectedGoal, setSelectedGoal] = useState('casual');
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const progress = (currentStep + 1) / steps.length;

  function goToNextStep() {
    if (currentStep >= steps.length - 1) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -20, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      setCurrentStep((prev) => prev + 1);
      slideAnim.setValue(20);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    });
  }

  function toggleInterest(id) {
    Haptics.selectionAsync().catch(() => {});
    setSelectedInterests((prev) => {
      if (id === 'comprehensive') {
        return ['comprehensive'];
      }
      const filtered = prev.filter((i) => i !== 'comprehensive');
      if (prev.includes(id)) {
        return filtered.filter((i) => i !== id);
      }
      return [...filtered, id];
    });
  }

  function selectGoal(id) {
    Haptics.selectionAsync().catch(() => {});
    setSelectedGoal(id);
  }

  async function handleComplete() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

    const userData = {
      interests: selectedInterests,
      goal: selectedGoal,
      completedAt: new Date().toISOString(),
    };

    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true'),
      AsyncStorage.setItem(STORAGE_KEYS.USER_INTERESTS, JSON.stringify(userData)),
    ]).catch(() => {});

    onComplete(userData);
  }

  const serifFont = Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' });

  return (
    <SafeAreaView style={styles.safeArea}>
      <PaperTexture intensity="medium" />

      {/* Progress bar */}
      <View style={styles.progressWrap}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>{steps[currentStep].title}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Animated.View style={[styles.animatedContent, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
          {currentStep === 0 && (
            <WelcomeStep serifFont={serifFont} />
          )}
          {currentStep === 1 && (
            <InterestsStep
              selectedInterests={selectedInterests}
              onToggle={toggleInterest}
            />
          )}
          {currentStep === 2 && (
            <GoalsStep
              selectedGoal={selectedGoal}
              onSelect={selectGoal}
            />
          )}
          {currentStep === 3 && (
            <ReadyStep
              selectedInterests={selectedInterests}
              selectedGoal={selectedGoal}
              serifFont={serifFont}
            />
          )}
        </Animated.View>
      </View>

      {/* Bottom actions */}
      <View style={styles.bottomBar}>
        {currentStep < steps.length - 1 ? (
          <Pressable style={styles.nextBtn} onPress={goToNextStep} accessibilityRole="button" accessibilityLabel="Continue" accessibilityHint="Double tap to go to next step">
            <Text style={styles.nextBtnText}>Continue</Text>
            <ArrowRight size={16} color="#FFFFFF" strokeWidth={2} />
          </Pressable>
        ) : (
          <Pressable style={styles.startBtn} onPress={handleComplete} accessibilityRole="button" accessibilityLabel="Start Exploring" accessibilityHint="Double tap to begin using the app">
            <Check size={18} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.startBtnText}>Start Exploring</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

function WelcomeStep({ serifFont }) {
  return (
    <View style={styles.stepContent}>
      <View style={styles.heroIconWrap}>
        <Sparkles size={32} color={theme.colors.primary} strokeWidth={1.5} />
      </View>
      <Text style={styles.heroTitle}>Become Chinese</Text>
      <Text style={styles.heroTitleCn}>成为中国人</Text>
      <Text style={styles.heroSubtitle}>
        A cultural atlas for understanding China through its cities, dishes, and dynasties.
      </Text>
      <Text style={styles.heroSubtitleCn}>
        通过城市、美食与朝代，理解中国文化的地图。
      </Text>

      <View style={styles.featureList}>
        <View style={styles.featureItem}>
          <Clock size={16} color={theme.colors.primary} strokeWidth={2} />
          <Text style={styles.featureText}>Daily questions to build your knowledge</Text>
        </View>
        <View style={styles.featureItem}>
          <Map size={16} color={theme.colors.primary} strokeWidth={2} />
          <Text style={styles.featureText}>Explore cities and their stories</Text>
        </View>
        <View style={styles.featureItem}>
          <UtensilsCrossed size={16} color={theme.colors.primary} strokeWidth={2} />
          <Text style={styles.featureText}>Discover regional dishes and culture</Text>
        </View>
      </View>
    </View>
  );
}

function InterestsStep({ selectedInterests, onToggle }) {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>What interests you most?</Text>
      <Text style={styles.stepSubtitle}>选择你最感兴趣的方向</Text>

      <View style={styles.optionsGrid}>
        {interestOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedInterests.includes(option.id);
          return (
            <Pressable
              key={option.id}
              style={[styles.optionCard, isSelected && styles.optionCardSelected]}
              onPress={() => onToggle(option.id)}
              accessibilityRole="button"
              accessibilityLabel={`${option.label} - ${option.labelCn}. ${option.desc}`}
              accessibilityHint={isSelected ? "Selected. Double tap to deselect" : "Double tap to select"}
            >
              <View style={[styles.optionIconWrap, isSelected && styles.optionIconWrapSelected]}>
                <Icon size={22} color={isSelected ? '#FFFFFF' : theme.colors.primary} strokeWidth={2} />
              </View>
              <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                {option.label}
              </Text>
              <Text style={styles.optionLabelCn}>{option.labelCn}</Text>
              <Text style={styles.optionDesc}>{option.desc}</Text>
              {isSelected && (
                <View style={styles.checkBadge}>
                  <Check size={12} color="#FFFFFF" strokeWidth={3} />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function GoalsStep({ selectedGoal, onSelect }) {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>How do you want to learn?</Text>
      <Text style={styles.stepSubtitle}>选择你的学习方式</Text>

      <View style={styles.goalsList}>
        {goalOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedGoal === option.id;
          return (
            <Pressable
              key={option.id}
              style={[styles.goalCard, isSelected && styles.goalCardSelected]}
              onPress={() => onSelect(option.id)}
              accessibilityRole="button"
              accessibilityLabel={`${option.label} - ${option.labelCn}. ${option.desc}`}
              accessibilityHint={isSelected ? "Selected" : "Double tap to select"}
            >
              <View style={styles.goalLeft}>
                <View style={[styles.goalIconWrap, isSelected && styles.goalIconWrapSelected]}>
                  <Icon size={20} color={isSelected ? '#FFFFFF' : theme.colors.primary} strokeWidth={2} />
                </View>
                <View style={styles.goalTextWrap}>
                  <Text style={[styles.goalLabel, isSelected && styles.goalLabelSelected]}>
                    {option.label}
                  </Text>
                  <Text style={styles.goalLabelCn}>{option.labelCn}</Text>
                  <Text style={styles.goalDesc}>{option.desc}</Text>
                </View>
              </View>
              {isSelected && (
                <View style={styles.goalCheckBadge}>
                  <Check size={14} color="#FFFFFF" strokeWidth={3} />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function ReadyStep({ selectedInterests, selectedGoal, serifFont }) {
  const interestLabels = selectedInterests
    .map((id) => interestOptions.find((o) => o.id === id)?.label)
    .filter(Boolean);

  const goalLabel = goalOptions.find((o) => o.id === selectedGoal)?.label ?? 'Casual Discovery';

  return (
    <View style={styles.stepContent}>
      <View style={styles.readyIconWrap}>
        <Sparkles size={28} color="#FFFFFF" strokeWidth={1.5} />
      </View>
      <Text style={styles.readyTitle}>You're All Set</Text>
      <Text style={styles.readyTitleCn}>准备就绪</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Your Journey</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryKey}>Interests:</Text>
          <Text style={styles.summaryValue}>{interestLabels.join(', ')}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryKey}>Goal:</Text>
          <Text style={styles.summaryValue}>{goalLabel}</Text>
        </View>
      </View>

      <Text style={styles.readyHint}>
        Start with today's daily question, or explore the paths that interest you.
      </Text>
      <Text style={styles.readyHintCn}>
        从今日问答开始，或探索你感兴趣的路径。
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  progressWrap: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  progressTrack: {
    height: 3,
    backgroundColor: 'rgba(51, 51, 51, 0.08)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 3,
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  progressText: {
    marginTop: 10,
    color: theme.colors.primary,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    fontWeight: '800',
    textAlign: 'left',
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  animatedContent: {
    flex: 1,
  },
  stepContent: {
    flex: 1,
    alignItems: 'flex-start',
  },

  // Welcome step
  heroIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: theme.colors.cinnabarGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    color: theme.colors.text,
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'left',
  },
  heroTitleCn: {
    color: theme.colors.primary,
    fontSize: 22,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 2,
    textAlign: 'left',
  },
  heroSubtitle: {
    marginTop: 16,
    color: theme.colors.text,
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.85,
    textAlign: 'left',
  },
  heroSubtitleCn: {
    marginTop: 4,
    color: theme.colors.mutedText,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'left',
  },
  featureList: {
    marginTop: 28,
    gap: 14,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    color: theme.colors.text,
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },

  // Step titles
  stepTitle: {
    color: theme.colors.text,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'left',
  },
  stepSubtitle: {
    color: theme.colors.mutedText,
    fontSize: 14,
    marginTop: 4,
    marginBottom: 24,
    textAlign: 'left',
  },

  // Options grid
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionCard: {
    width: '48%',
    borderRadius: theme.radii.lg,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    padding: 16,
    position: 'relative',
  },
  optionCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: '#FFF7F0',
  },
  optionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.cinnabarGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  optionIconWrapSelected: {
    backgroundColor: theme.colors.primary,
  },
  optionLabel: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'left',
  },
  optionLabelSelected: {
    color: theme.colors.primary,
  },
  optionLabelCn: {
    color: theme.colors.mutedText,
    fontSize: 12,
    marginTop: 2,
    textAlign: 'left',
  },
  optionDesc: {
    color: theme.colors.mutedText,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 6,
    textAlign: 'left',
  },
  checkBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Goals
  goalsList: {
    gap: 12,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: theme.radii.lg,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    padding: 16,
  },
  goalCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: '#FFF7F0',
  },
  goalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  goalIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.cinnabarGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalIconWrapSelected: {
    backgroundColor: theme.colors.primary,
  },
  goalTextWrap: {
    flex: 1,
  },
  goalLabel: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'left',
  },
  goalLabelSelected: {
    color: theme.colors.primary,
  },
  goalLabelCn: {
    color: theme.colors.mutedText,
    fontSize: 12,
    marginTop: 2,
    textAlign: 'left',
  },
  goalDesc: {
    color: theme.colors.mutedText,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
    textAlign: 'left',
  },
  goalCheckBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Ready step
  readyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  readyTitle: {
    color: theme.colors.text,
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'left',
  },
  readyTitleCn: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 1,
    textAlign: 'left',
  },
  summaryCard: {
    marginTop: 24,
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: 16,
  },
  summaryLabel: {
    color: theme.colors.primary,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'left',
  },
  summaryRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  summaryKey: {
    color: theme.colors.mutedText,
    fontSize: 13,
    width: 80,
    textAlign: 'left',
  },
  summaryValue: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    textAlign: 'left',
  },
  readyHint: {
    marginTop: 20,
    color: theme.colors.text,
    fontSize: 14,
    lineHeight: 21,
    opacity: 0.85,
    textAlign: 'left',
  },
  readyHintCn: {
    marginTop: 4,
    color: theme.colors.mutedText,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'left',
  },

  // Bottom bar
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 34,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
  },
  startBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

// Helper functions for checking onboarding status
export async function isOnboardingComplete() {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
    return value === 'true';
  } catch {
    return false;
  }
}

export async function resetOnboarding() {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ONBOARDING_COMPLETE,
      STORAGE_KEYS.USER_INTERESTS,
    ]);
    return true;
  } catch {
    return false;
  }
}

export async function getUserInterests() {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.USER_INTERESTS);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}
