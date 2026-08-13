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
import { ArrowRight, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { PaperTexture } from '../components/PaperTexture';
import { SealStamp } from '../components/ChineseDecorations';
import { BrushFoodIcon, BrushMapIcon, BrushFireIcon, BrushTrophyIcon, BrushCalendarIcon, BrushScrollIcon } from '../components/BrushIcons';
import { STORAGE_KEYS } from '../config/storageKeys';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Icons mapped per interest — custom ink-brush style for a cohesive cultural feel
const interestOptions = [
  { id: 'history', label: 'History', labelCn: '历史', icon: BrushScrollIcon, desc: '朝代的脉络' },
  { id: 'food', label: 'Food', labelCn: '美食', icon: BrushFoodIcon, desc: '风味的坐标' },
  { id: 'places', label: 'Places', labelCn: '城市', icon: BrushMapIcon, desc: '城市的记忆' },
  { id: 'comprehensive', label: 'All Paths', labelCn: '综合', icon: BrushFireIcon, desc: '全景式漫游' },
];

const goalOptions = [
  { id: 'casual', label: 'Casual Discovery', labelCn: '轻度了解', icon: BrushCalendarIcon, desc: '每天几分钟，轻松浏览' },
  { id: 'focused', label: 'Focused Learning', labelCn: '深度学习', icon: BrushTrophyIcon, desc: '系统构建知识体系' },
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
      if (id === 'comprehensive') return ['comprehensive'];
      const filtered = prev.filter((i) => i !== 'comprehensive');
      if (prev.includes(id)) return filtered.filter((i) => i !== id);
      return [...filtered, id];
    });
  }

  function selectGoal(id) {
    Haptics.selectionAsync().catch(() => {});
    setSelectedGoal(id);
  }

  async function handleComplete() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    const userData = { interests: selectedInterests, goal: selectedGoal, completedAt: new Date().toISOString() };
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

      {/* Progress — seal dot per step */}
      <View style={styles.progressWrap}>
        <View style={styles.stepDots}>
          {steps.map((s, i) => (
            <View
              key={s.id}
              style={[
                styles.stepDot,
                i <= currentStep && styles.stepDotActive,
                i === currentStep && styles.stepDotCurrent,
              ]}
            />
          ))}
        </View>
        <Text style={styles.progressText}>
          {steps[currentStep].titleCn}
          <Text style={styles.progressTextEn}>  ·  {steps[currentStep].title}</Text>
        </Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Animated.View style={[styles.animatedContent, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
          {currentStep === 0 && <WelcomeStep serifFont={serifFont} />}
          {currentStep === 1 && <InterestsStep selectedInterests={selectedInterests} onToggle={toggleInterest} />}
          {currentStep === 2 && <GoalsStep selectedGoal={selectedGoal} onSelect={selectGoal} />}
          {currentStep === 3 && <ReadyStep selectedInterests={selectedInterests} selectedGoal={selectedGoal} serifFont={serifFont} />}
        </Animated.View>
      </View>

      {/* Bottom actions */}
      <View style={styles.bottomBar}>
        <Pressable
          style={({ pressed }) => [styles.nextBtn, pressed && styles.nextBtnPressed]}
          onPress={currentStep < steps.length - 1 ? goToNextStep : handleComplete}
          accessibilityRole="button"
          accessibilityLabel={currentStep < steps.length - 1 ? 'Continue' : 'Start Exploring'}
        >
          <Text style={styles.nextBtnText}>
            {currentStep < steps.length - 1 ? '下一步' : '开始探索'}
          </Text>
          <Text style={styles.nextBtnTextEn}>
            {currentStep < steps.length - 1 ? 'Continue' : 'Start Exploring'}
          </Text>
          {currentStep < steps.length - 1 ? (
            <ArrowRight size={16} color="#FFFFFF" strokeWidth={2} />
          ) : (
            <Check size={16} color="#FFFFFF" strokeWidth={2.5} />
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function WelcomeStep({ serifFont }) {
  return (
    <View style={styles.stepContent}>
      <View style={styles.heroSealWrap}>
        <SealStamp label="华" size={72} />
      </View>
      <Text style={[styles.heroTitle, { fontFamily: serifFont }]}>Become Chinese</Text>
      <Text style={styles.heroTitleCn}>成为中国人</Text>
      <Text style={styles.heroRule} />
      <Text style={styles.heroSubtitle}>A cultural atlas for understanding China through its cities, dishes, and dynasties.</Text>
      <Text style={styles.heroSubtitleCn}>通过城市、美食与朝代，理解中国文化的地图。</Text>

      <View style={styles.featureList}>
        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <BrushCalendarIcon size={16} color={theme.colors.primary} />
          </View>
          <Text style={styles.featureText}>每日一问，日积月累</Text>
        </View>
        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <BrushMapIcon size={16} color={theme.colors.primary} />
          </View>
          <Text style={styles.featureText}>探索城市与它们的故事</Text>
        </View>
        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <BrushFoodIcon size={16} color={theme.colors.primary} />
          </View>
          <Text style={styles.featureText}>认识各地的菜系与文化</Text>
        </View>
      </View>
    </View>
  );
}

function InterestsStep({ selectedInterests, onToggle }) {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>你想探索什么？</Text>
      <Text style={styles.stepTitleEn}>What interests you most?</Text>

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
              accessibilityLabel={`${option.labelCn} ${option.label}`}
            >
              <View style={[styles.optionIconWrap, isSelected && styles.optionIconWrapSelected]}>
                <Icon size={22} color={isSelected ? '#FFFFFF' : theme.colors.primary} />
              </View>
              <Text style={[styles.optionLabelCn, isSelected && styles.optionLabelSelected]}>{option.labelCn}</Text>
              <Text style={styles.optionLabel}>{option.label}</Text>
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
      <Text style={styles.stepTitle}>你想怎么学？</Text>
      <Text style={styles.stepTitleEn}>How do you want to learn?</Text>

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
              accessibilityLabel={option.labelCn}
            >
              <View style={[styles.goalIconWrap, isSelected && styles.goalIconWrapSelected]}>
                <Icon size={20} color={isSelected ? '#FFFFFF' : theme.colors.primary} />
              </View>
              <View style={styles.goalTextWrap}>
                <Text style={[styles.goalLabelCn, isSelected && styles.goalLabelSelected]}>{option.labelCn}</Text>
                <Text style={styles.goalLabel}>{option.label}</Text>
                <Text style={styles.goalDesc}>{option.desc}</Text>
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
    .map((id) => interestOptions.find((o) => o.id === id)?.labelCn)
    .filter(Boolean);
  const goalLabel = goalOptions.find((o) => o.id === selectedGoal)?.labelCn ?? '轻度了解';

  return (
    <View style={styles.stepContent}>
      <View style={styles.readySealWrap}>
        <SealStamp label="始" size={72} variant="success" />
      </View>
      <Text style={[styles.readyTitle, { fontFamily: serifFont }]}>准备好了</Text>
      <Text style={styles.readyTitleEn}>You're All Set</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>你的旅程 · Your Journey</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryKey}>兴趣</Text>
          <Text style={styles.summaryValue}>{interestLabels.join('、')}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryKey}>目标</Text>
          <Text style={styles.summaryValue}>{goalLabel}</Text>
        </View>
      </View>

      <Text style={styles.readyHint}>
        从今日问答开始，或探索你最感兴趣的路径。祝你漫游愉快。
      </Text>
      <Text style={styles.readyHintCn}>
        Start with today's daily question, or explore the paths that interest you.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  // Progress
  progressWrap: {
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 12,
    alignItems: 'center',
  },
  stepDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(27, 23, 21, 0.12)',
  },
  stepDotActive: {
    backgroundColor: theme.colors.primary,
  },
  stepDotCurrent: {
    width: 20,
  },
  progressText: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'center',
  },
  progressTextEn: {
    color: theme.colors.mutedText,
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.5,
  },

  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 20,
  },
  animatedContent: {
    flex: 1,
  },
  stepContent: {
    flex: 1,
    alignItems: 'flex-start',
  },

  // Welcome
  heroSealWrap: {
    marginBottom: 22,
    alignSelf: 'center',
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
    fontSize: 20,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 3,
    textAlign: 'left',
  },
  heroRule: {
    marginTop: 18,
    width: 40,
    height: 2,
    borderRadius: 1,
    backgroundColor: theme.colors.primary,
    opacity: 0.5,
  },
  heroSubtitle: {
    marginTop: 12,
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
    gap: 14,
  },
  featureIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: theme.colors.cinnabarGlow,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'left',
  },
  stepTitleEn: {
    color: theme.colors.mutedText,
    fontSize: 13,
    marginTop: 4,
    marginBottom: 26,
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
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    padding: 18,
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  optionCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: '#FFF5EE',
  },
  optionIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: theme.colors.cinnabarGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  optionIconWrapSelected: {
    backgroundColor: theme.colors.primary,
  },
  optionLabelCn: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'left',
  },
  optionLabel: {
    color: theme.colors.mutedText,
    fontSize: 11,
    marginTop: 1,
    textAlign: 'left',
  },
  optionLabelSelected: {
    color: theme.colors.primary,
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
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Goals
  goalsList: {
    gap: 14,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  goalCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: '#FFF5EE',
  },
  goalIconWrap: {
    width: 46,
    height: 46,
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
    marginLeft: 14,
  },
  goalLabelCn: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'left',
  },
  goalLabelSelected: {
    color: theme.colors.primary,
  },
  goalLabel: {
    color: theme.colors.mutedText,
    fontSize: 11,
    marginTop: 1,
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
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Ready
  readySealWrap: {
    marginBottom: 22,
    alignSelf: 'center',
  },
  readyTitle: {
    color: theme.colors.text,
    fontSize: 34,
    fontWeight: '700',
    textAlign: 'left',
  },
  readyTitleEn: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 1,
    textAlign: 'left',
  },
  summaryCard: {
    marginTop: 24,
    width: '100%',
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    padding: 18,
  },
  summaryLabel: {
    color: theme.colors.primary,
    fontSize: 11,
    letterSpacing: 1.2,
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
    width: 60,
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
    marginTop: 24,
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
    paddingHorizontal: 28,
    paddingVertical: 20,
    paddingBottom: 34,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    paddingVertical: 17,
    shadowColor: theme.colors.primaryDark,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  nextBtnPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  nextBtnTextEn: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 11,
    fontWeight: '500',
  },
});
