import React, { useEffect, useState, useMemo } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View, ScrollView } from 'react-native';
import { ArrowRight, ArrowLeft, MapPin, Clock, UtensilsCrossed, Scroll, User, Sparkles, Check, Lock, ChevronRight } from 'lucide-react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import { getCulturalAssets } from '../utils/culturalAssets';
import { getTypeIcon, getTypeScreen, TYPE_COLORS } from '../utils/contentTypes';
import { HandscrollContainer } from '../components/HandscrollContainer';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';
import { StampFeedback } from '../components/StampFeedback';
import { DetailHeader } from '../components/DetailHeader';
import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { availablePaths, pathConfigs } from '../components/PathsSection';
import { cities } from '../data/cities';
import { recipes } from '../data/recipes';
import { dynasties } from '../data/dynasties';
import { people } from '../data/people';
import { navigateApp } from '../utils/navigation';

/** Path step id aliases → canonical data ids (e.g. confucius → kongzi). */
const PERSON_ID_ALIASES = {
  confucius: 'kongzi',
  'kong-zi': 'kongzi',
  confucious: 'kongzi',
};

/**
 * Find the actual data item for a path step
 */
function findStepDataItem(step) {
  const searchId = step.id?.toLowerCase();
  const searchLabel = step.label?.toLowerCase();
  const canonicalPersonId = PERSON_ID_ALIASES[searchId] || searchId;

  if (step.type === 'city') {
    return cities.find(c =>
      c.id?.toLowerCase() === searchId ||
      c.nameEn?.toLowerCase() === searchLabel ||
      c.nameCn === step.labelCn
    );
  }

  if (step.type === 'recipe') {
    return recipes.find(r =>
      r.id?.toLowerCase() === searchId ||
      r.nameEn?.toLowerCase() === searchLabel ||
      r.nameCn === step.labelCn
    );
  }

  if (step.type === 'dynasty') {
    return dynasties.find(d =>
      d.id?.toLowerCase() === searchId ||
      d.nameEn?.toLowerCase() === searchLabel ||
      d.nameCn === step.labelCn
    );
  }

  if (step.type === 'person') {
    return people.find(p =>
      p.id?.toLowerCase() === canonicalPersonId ||
      p.id?.toLowerCase() === searchId ||
      p.nameEn?.toLowerCase() === searchLabel ||
      p.nameCn === step.labelCn
    );
  }

  return null;
}

function StepCard({ step, index, isCompleted, isCurrent, isLocked, onPress }) {
  const Icon = getTypeIcon(step.type);
  const color = TYPE_COLORS[step.type] || theme.colors.primary;

  function handlePress() {
    if (!isLocked) {
      Haptics.selectionAsync().catch(() => {});
      onPress?.(step, index);
    }
  }

  return (
    <Pressable
      style={[
        styles.stepCard,
        isCompleted && styles.stepCardCompleted,
        isCurrent && styles.stepCardCurrent,
        isLocked && styles.stepCardLocked,
      ]}
      onPress={handlePress}
      disabled={isLocked}
      accessibilityRole="button"
      accessibilityLabel={`Step ${index + 1}: ${step.label} - ${step.labelCn}`}
      accessibilityHint={isLocked ? "Locked - complete previous steps first" : isCompleted ? "Completed" : "Double tap to explore this step"}
    >
      <View style={styles.stepLeft}>
        <View style={[
          styles.stepNumber,
          isCompleted && styles.stepNumberCompleted,
          isCurrent && styles.stepNumberCurrent,
          isLocked && styles.stepNumberLocked,
        ]}>
          {isCompleted ? (
            <Check size={14} color="#FFFFFF" strokeWidth={2.5} />
          ) : (
            <Text style={[
              styles.stepNumberText,
              isCurrent && styles.stepNumberTextCurrent,
              isLocked && styles.stepNumberTextLocked,
            ]}>{index + 1}</Text>
          )}
        </View>
        <View style={[styles.stepIconWrap, { backgroundColor: `${color}18` }]}>
          <Icon size={18} color={isLocked ? theme.colors.mutedText : color} strokeWidth={2} />
        </View>
        <View style={styles.stepContent}>
          <Text style={[styles.stepName, isLocked && styles.stepNameLocked]}>{step.label}</Text>
          <Text style={[styles.stepNameCn, isLocked && styles.stepNameCnLocked]}>{step.labelCn}</Text>
          {step.reason ? (
            <Text style={[styles.stepReason, isLocked && styles.stepReasonLocked]} numberOfLines={2}>
              {step.reason}
            </Text>
          ) : null}
        </View>
      </View>
      {isLocked ? (
        <Lock size={16} color={theme.colors.mutedText} strokeWidth={2} />
      ) : (
        <ChevronRight size={16} color={theme.colors.mutedText} strokeWidth={2} />
      )}
    </Pressable>
  );
}

export function PathDetailScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const pathId = route.params?.pathId;
  const [assets, setAssets] = useState(null);

  const path = useMemo(() => {
    return pathConfigs[pathId] || availablePaths.find(p => p.id === pathId);
  }, [pathId]);

  const loadAssets = React.useCallback(() => {
    let cancelled = false;
    (async () => {
      const data = await getCulturalAssets().catch(() => null);
      if (!cancelled) setAssets(data);
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => loadAssets(), [loadAssets]);

  // Refresh progress when returning from a detail/collection screen
  useFocusEffect(
    React.useCallback(() => {
      loadAssets();
    }, [loadAssets])
  );

  // Check which steps are completed based on user's collections
  const stepProgress = useMemo(() => {
    if (!path || !assets) return [];

    const favCities = assets?.favorites?.cities || [];
    const favRecipes = assets?.favorites?.recipes || [];
    const favDynasties = assets?.favorites?.dynasties || [];
    const favPeople = assets?.favorites?.people || [];

    return path.steps.map((step) => {
      const dataItem = findStepDataItem(step);
      const canonicalId = dataItem?.id || step.id;
      let completed = false;
      if (step.type === 'city') {
        completed = favCities.some((c) => c.id === canonicalId || c.id === step.id);
      } else if (step.type === 'recipe') {
        completed = favRecipes.some((r) => r.id === canonicalId || r.id === step.id);
      } else if (step.type === 'dynasty') {
        completed = favDynasties.some((d) => d.id === canonicalId || d.id === step.id);
      } else if (step.type === 'person') {
        completed = favPeople.some((p) => p.id === canonicalId || p.id === step.id);
      }
      return { ...step, completed };
    });
  }, [path, assets]);

  // Calculate current step (first incomplete)
  const currentStepIndex = useMemo(() => {
    const idx = stepProgress.findIndex(s => !s.completed);
    return idx === -1 ? stepProgress.length - 1 : idx;
  }, [stepProgress]);

  const completedCount = stepProgress.filter(s => s.completed).length;
  const totalSteps = stepProgress.length;
  const progressPercent = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;

  if (!path) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.errorText}>Path not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const PathIcon = path.icon;

  function handleStepPress(step, index) {
    // Find the actual data item
    const dataItem = findStepDataItem(step);
    if (!dataItem) return;
    const { id, nameEn } = dataItem;
    const type = step.type;

    // Navigate to the right surface carrying the id so the detail opens directly.
    if (type === 'recipe') {
      navigateApp(navigation, 'Food', { recipeId: id });
    } else if (type === 'city') {
      navigateApp(navigation, 'Places', { cityId: id });
    } else if (type === 'dynasty') {
      navigateApp(navigation, 'History', {
        screen: 'DynastyDetail',
        params: { dynastyId: id },
      });
    } else if (type === 'person') {
      navigateApp(navigation, 'History', {
        screen: 'PersonDetail',
        params: { personId: id },
      });
    } else {
      const screen = getTypeScreen(type);
      navigateApp(navigation, screen);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <DetailHeader
        title={path?.title || 'Path'}
        onBack={() => navigation.goBack()}
      />
      <HandscrollContainer style={styles.scrollShell}>
        <View style={styles.container}>
          {/* Path Header */}
          <View style={styles.pathHeader}>
            <View style={[styles.pathIconWrap, { backgroundColor: `${path.color}18` }]}>
              <PathIcon size={28} color={path.color} strokeWidth={2} />
            </View>
            <Text style={styles.pathTitle}>{path.title}</Text>
            <Text style={styles.pathTitleCn}>{path.titleCn}</Text>
            <Text style={styles.pathDescription}>{path.description}</Text>
            <Text style={styles.pathDescriptionCn}>{path.descriptionCn}</Text>
          </View>

          {/* Progress Card */}
          <SectionCard style={styles.progressCard} tone="soft">
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Your Progress</Text>
              <View style={styles.progressBadge}>
                <Text style={styles.progressBadgeText}>{completedCount}/{totalSteps}</Text>
              </View>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressPercent}%`, backgroundColor: path.color }]} />
            </View>
            <Text style={styles.progressHint}>
              {completedCount === totalSteps
                ? 'Path complete! You\'ve explored all stops.'
                : `${totalSteps - completedCount} more ${totalSteps - completedCount === 1 ? 'stop' : 'stops'} to complete this path.`}
            </Text>
          </SectionCard>

          {/* Steps */}
          <View style={styles.stepsSection}>
            <Text style={styles.sectionLabel}>Journey Steps</Text>
            <Text style={styles.sectionHint}>Follow the path and collect each stop.</Text>

            {stepProgress.map((step, index) => (
              <StepCard
                key={`${step.type}-${step.id}`}
                step={step}
                index={index}
                isCompleted={step.completed}
                isCurrent={index === currentStepIndex && !step.completed}
                isLocked={index > currentStepIndex + 1}
                onPress={handleStepPress}
              />
            ))}
          </View>

          {/* Completion Reward */}
          {completedCount === totalSteps && (
            <SectionCard style={styles.rewardCard} tone="soft">
              <View style={styles.rewardHeader}>
                <Sparkles size={20} color={theme.colors.primary} strokeWidth={2} />
                <Text style={styles.rewardTitle}>Path Complete!</Text>
              </View>
              <Text style={styles.rewardText}>
                You've explored all stops on the {path.title} path. Continue your journey with another cultural adventure.
              </Text>
              <Pressable
                style={styles.exploreMoreBtn}
                onPress={() => navigateApp(navigation, 'Home')}
                accessibilityRole="button"
                accessibilityLabel="Explore More Paths"
                accessibilityHint="Double tap to return to home screen"
              >
                <Text style={styles.exploreMoreBtnText}>Explore More Paths</Text>
                <ArrowRight size={14} color="#FFFFFF" strokeWidth={2} />
              </Pressable>
            </SectionCard>
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

  // Path Header
  pathHeader: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  pathIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  pathTitle: {
    color: theme.colors.text,
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
  },
  pathTitleCn: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  pathDescription: {
    marginTop: 12,
    color: theme.colors.mutedText,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
  },
  pathDescriptionCn: {
    marginTop: 4,
    color: theme.colors.mutedText,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },

  // Progress Card
  progressCard: {
    marginTop: 14,
    padding: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  progressBadge: {
    backgroundColor: theme.colors.cinnabarGlow,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  progressBadgeText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(51, 51, 51, 0.08)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
  },
  progressHint: {
    marginTop: 10,
    color: theme.colors.mutedText,
    fontSize: 12,
    textAlign: 'center',
  },

  // Steps Section
  stepsSection: {
    marginTop: 20,
  },
  sectionLabel: {
    color: theme.colors.primary,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  sectionHint: {
    color: theme.colors.mutedText,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 12,
  },

  // Step Card
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    padding: 14,
    marginTop: 10,
  },
  stepCardCompleted: {
    borderColor: theme.colors.success,
    backgroundColor: theme.colors.goldLeaf,
  },
  stepCardCurrent: {
    borderColor: theme.colors.primary,
    backgroundColor: '#FFF9F5',
  },
  stepCardLocked: {
    opacity: 0.6,
  },
  stepLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  stepNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: theme.colors.cinnabarGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberCompleted: {
    backgroundColor: theme.colors.success,
  },
  stepNumberCurrent: {
    backgroundColor: theme.colors.primary,
  },
  stepNumberLocked: {
    backgroundColor: 'rgba(51, 51, 51, 0.08)',
  },
  stepNumberText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  stepNumberTextCurrent: {
    color: '#FFFFFF',
  },
  stepNumberTextLocked: {
    color: theme.colors.mutedText,
  },
  stepIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepContent: {
    flex: 1,
  },
  stepName: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  stepNameLocked: {
    color: theme.colors.mutedText,
  },
  stepNameCn: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  stepNameCnLocked: {
    color: theme.colors.mutedText,
  },
  stepReason: {
    color: theme.colors.mutedText,
    fontSize: 11.5,
    lineHeight: 17,
    fontWeight: '400',
    marginTop: 3,
  },
  stepReasonLocked: {
    opacity: 0.6,
  },

  // Reward Card
  rewardCard: {
    marginTop: 20,
    padding: 18,
    alignItems: 'center',
  },
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rewardTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  rewardText: {
    marginTop: 10,
    color: theme.colors.mutedText,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  exploreMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
  },
  exploreMoreBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  errorText: {
    color: theme.colors.mutedText,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 40,
  },
});
