import React, { useMemo, useEffect, useState, useCallback } from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sparkles, Leaf, UtensilsCrossed, CalendarDays, ArrowRight, Sunrise, Check } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import { solarTerms, getSolarTermById, getTermRecipeIds, getTermFestivalName } from '../data/solarTerms';
import { recipes } from '../data/recipes';
import { useReadingPosition } from '../hooks/useReadingPosition';
import { STORAGE_KEYS } from '../config/storageKeys';
import { HandscrollContainer } from '../components/HandscrollContainer';
import { LinkedConceptText } from '../components/LinkedConceptText';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';
import { DetailHeader } from '../components/DetailHeader';
import { ExploreNextSection } from '../components/ExploreNextSection';
import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { earnStamp } from '../utils/stampCollection';
import { addRecentlyViewed } from '../utils/culturalAssets';

const SEASON_COLORS = {
  spring: '#6F8F72',
  summer: '#C49A4A',
  autumn: '#B94A32',
  winter: '#5F8FA8',
};

const SEASON_LABELS = {
  spring: 'Spring',
  summer: 'Summer',
  autumn: 'Autumn',
  winter: 'Winter',
};

export function SolarTermDetailScreen({ route }) {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const termId = route?.params?.termId;

  // Resolve English keys (start-of-autumn) AND legacy pinyin (liqiu) so Home /
  // festivals / quiz deep-links all land on the same detail record.
  const term = useMemo(() => {
    if (!termId) return solarTerms[0] ?? null;
    return getSolarTermById(termId) ?? null;
  }, [termId]);

  // Reading-position memory: restore / record this term's scroll offset.
  const reading = useReadingPosition(term?.id ? `solarTerm:${term.id}` : '');

  const seasonColor = SEASON_COLORS[term?.season] || colors.primary;
  const seasonLabel = SEASON_LABELS[term?.season] || 'Season';

  // Find related recipes — matched against each term's curated seasonal dishes
  // (real recipe IDs), not a literal name comparison that would miss every time.
  const relatedRecipes = useMemo(() => {
    if (!term) return [];
    const ids = getTermRecipeIds(term.key, term.season);
    return recipes.filter((r) => ids.includes(r.id)).slice(0, 3);
  }, [term]);

  // Folk festival tied to this term (e.g. Qingming Festival for Qingming).
  const termFestival = useMemo(() => (term ? getTermFestivalName(term.key) : ''), [term]);

  // "Today's Gentle Action" completion state, persisted per-term.
  const [actionDone, setActionDone] = useState(false);

  useEffect(() => {
    if (!term?.id) return;
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEYS.TERM_ACTIONS_DONE);
        const map = raw ? JSON.parse(raw) : {};
        if (!cancelled) setActionDone(!!map[term.id]);
      } catch (e) {
        // Ignore: a corrupted flag should never break the screen.
      }
    })();
    return () => { cancelled = true; };
  }, [term?.id]);

  const toggleActionDone = useCallback(async () => {
    if (!term?.id) return;
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType[actionDone ? 'Warning' : 'Success']
    ).catch(() => {});
    const next = !actionDone;
    setActionDone(next);
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.TERM_ACTIONS_DONE);
      const map = raw ? JSON.parse(raw) : {};
      map[term.id] = next;
      await AsyncStorage.setItem(STORAGE_KEYS.TERM_ACTIONS_DONE, JSON.stringify(map));
    } catch (e) {
      // Ignore: persistence failure should not roll back the visible toggle.
    }
  }, [term?.id, actionDone]);

  const speakTerm = (text) => {
    if (!text) return;
    Haptics.selectionAsync().catch(() => {});
    Speech.speak(String(text), { language: 'en-US', rate: 0.92, pitch: 0.96 });
  };

  const handleRecipePress = (recipe) => {
    // Food lives on a sibling tab, not in SeasonsStack — must cross-tab navigate.
    navigation.getParent()?.navigate('Food', { recipeId: recipe.id });
  };

  // Track stamp earning and recently viewed
  useEffect(() => {
    if (!term?.id) return;

    // Add to recently viewed
    addRecentlyViewed({
      id: term.id,
      type: 'season',
      nameEn: term.englishName,
      nameCn: term.chineseName,
    }).catch(() => {});

    // Earn stamp after viewing for 3 seconds
    const timeoutId = setTimeout(async () => {
      await earnStamp('season', term, {
        viewTimeMs: 3000,
        scrollDepth: 0.5,
        interactions: 1,
      });
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [term?.id]);

  if (!term) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <DetailHeader onBack={() => navigation.goBack()} />
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.mutedText }]}>
            Solar term not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <DetailHeader
        onBack={() => navigation.goBack()}
        title={term.englishName}
      />
      <HandscrollContainer
        style={styles.scrollContainer}
        onScroll={reading.onScroll}
        initialScrollOffset={reading.savedOffset}
      >
        {/* Hero Section */}
        <SectionCard style={styles.heroCard} tone="soft">
          <ScreenHeader
            kicker={term.dateRange}
            title={term.englishName}
            titleZh={term.chineseName}
            subtitle={term.pinyin}
            align="left"
          />
          <View style={[styles.seasonBadge, { backgroundColor: `${seasonColor}18` }]}>
            <CalendarDays size={14} color={seasonColor} strokeWidth={2} />
            <Text style={[styles.seasonText, { color: seasonColor }]}>{seasonLabel}</Text>
            <Text style={styles.orderText}>#{term.order}</Text>
          </View>
        </SectionCard>

        {/* Meaning - Quick Summary */}
        <SectionCard style={styles.meaningCard} tone="default">
          <View style={styles.sectionHeader}>
            <Sparkles size={16} color={colors.primary} strokeWidth={2} />
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>What It Means</Text>
          </View>
          <LinkedConceptText text={term.meaning} style={[styles.meaningText, { color: colors.text }]} />
        </SectionCard>

        {/* Why It Matters - Beginner Note */}
        <SectionCard style={styles.beginnerCard} tone="soft">
          <View style={styles.sectionHeader}>
            <Leaf size={16} color={seasonColor} strokeWidth={2} />
            <Text style={[styles.sectionTitle, { color: seasonColor }]}>Why It Matters</Text>
          </View>
          <LinkedConceptText text={term.beginnerNote} style={[styles.beginnerText, { color: colors.text }]} />
        </SectionCard>

        {/* Daily Action - Prominent */}
        <SectionCard style={[styles.actionCard, { backgroundColor: `${seasonColor}12`, borderColor: seasonColor }]} tone="elevated">
          <View style={styles.actionHeader}>
            <View style={[styles.actionIcon, { backgroundColor: `${seasonColor}20` }]}>
              <Sunrise size={22} color={seasonColor} strokeWidth={2} />
            </View>
            <Text style={[styles.actionTitle, { color: seasonColor }]}>Today's Gentle Action</Text>
          </View>
          <LinkedConceptText text={term.dailyAction} style={[styles.actionText, { color: colors.text }]} />
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              actionDone && styles.actionButtonDone,
              pressed && styles.actionButtonPressed,
            ]}
            onPress={toggleActionDone}
            accessibilityRole="button"
            accessibilityLabel={actionDone ? 'Action completed - tap to undo' : 'Mark action as done'}
            accessibilityState={{ checked: actionDone }}
          >
            {actionDone ? (
              <Check size={14} color="#FFF" strokeWidth={3} />
            ) : null}
            <Text style={[styles.actionButtonText, actionDone && styles.actionButtonTextDone]}>
              {actionDone ? 'Done' : 'Mark as Done'}
            </Text>
          </Pressable>
        </SectionCard>

        {/* Nature's Change */}
        <SectionCard style={styles.natureCard} tone="default">
          <View style={styles.sectionHeader}>
            <Leaf size={16} color={colors.primary} strokeWidth={2} />
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Nature's Change</Text>
          </View>
          <LinkedConceptText text={term.natureChange} style={[styles.natureText, { color: colors.text }]} />
        </SectionCard>

        {/* Traditional Custom */}
        <SectionCard style={styles.customCard} tone="default">
          <View style={styles.sectionHeader}>
            <CalendarDays size={16} color={colors.primary} strokeWidth={2} />
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Traditional Custom</Text>
          </View>
          <LinkedConceptText text={term.custom} style={[styles.customText, { color: colors.text }]} />
        </SectionCard>

        {/* Related Festival */}
        {termFestival ? (
          <SectionCard style={styles.festivalCard} tone="soft">
            <View style={styles.sectionHeader}>
              <CalendarDays size={16} color={seasonColor} strokeWidth={2} />
              <Text style={[styles.sectionTitle, { color: seasonColor }]}>Tied to a Festival</Text>
            </View>
            <Text style={[styles.festivalText, { color: colors.text }]}>
              This solar term rolls into {termFestival} — a natural entry point to explore
              the holiday's food, customs and meaning.
            </Text>          </SectionCard>
        ) : null}

        {/* Seasonal Food */}
        {relatedRecipes.length > 0 && (
          <SectionCard style={styles.foodCard} tone="soft">
            <View style={styles.sectionHeader}>
              <UtensilsCrossed size={16} color={colors.primary} strokeWidth={2} />
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>Seasonal Food</Text>
            </View>
            <View style={styles.foodList}>
              {relatedRecipes.map((recipe) => (
                <Pressable
                  key={recipe.id}
                  style={({ pressed }) => [styles.foodItem, { backgroundColor: colors.card, borderColor: colors.border }, pressed && styles.foodItemPressed]}
                  onPress={() => handleRecipePress(recipe)}
                >
                  <View style={[styles.foodIcon, { backgroundColor: `${colors.primary}18` }]}>
                    <UtensilsCrossed size={14} color={colors.primary} strokeWidth={2} />
                  </View>
                  <View style={styles.foodContent}>
                    <Text style={[styles.foodName, { color: colors.text }]}>{recipe.nameEn}</Text>
                    <Text style={[styles.foodNameCn, { color: colors.primary }]}>{recipe.nameCn}</Text>
                  </View>
                  <ArrowRight size={14} color={colors.mutedText} strokeWidth={2} />
                </Pressable>
              ))}
            </View>
          </SectionCard>
        )}

        {/* Explore Next */}
        {term.relatedContent && term.relatedContent.length > 0 && (
          <ExploreNextSection
            items={term.relatedContent}
            sourceType="season"
            sourceId={term.id}
          />
        )}
      </HandscrollContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
  heroCard: {
    padding: 18,
    borderRadius: 22,
    marginBottom: 14,
  },
  seasonBadge: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  seasonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  orderText: {
    fontSize: 11,
    color: theme.colors.mutedText,
    fontWeight: '600',
  },
  meaningCard: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  meaningText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
  },
  beginnerCard: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
  },
  beginnerText: {
    fontSize: 14,
    lineHeight: 21,
  },
  actionCard: {
    padding: 18,
    borderRadius: 22,
    borderWidth: 1.5,
    marginBottom: 14,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '900',
  },
  actionText: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  actionButton: {
    marginTop: 14,
    alignSelf: 'flex-start',
    backgroundColor: '#FCFAF5',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionButtonDone: {
    backgroundColor: '#4E7A5A',
  },
  actionButtonPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#243B53',
  },
  actionButtonTextDone: {
    color: '#FFFFFF',
  },
  natureCard: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
  },
  natureText: {
    fontSize: 14,
    lineHeight: 21,
  },
  customCard: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
  },
  customText: {
    fontSize: 14,
    lineHeight: 21,
  },
  festivalCard: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
  },
  festivalText: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 4,
  },
  foodCard: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
  },
  foodList: {
    gap: 10,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 16,
    borderWidth: 0.5,
    padding: 12,
  },
  foodItemPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },
  foodIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodContent: {
    flex: 1,
  },
  foodName: {
    fontSize: 14,
    fontWeight: '700',
  },
  foodNameCn: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
});