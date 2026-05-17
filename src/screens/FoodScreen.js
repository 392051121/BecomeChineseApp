import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Modal,
  PanResponder,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Bookmark, MapPin, Sparkles, UtensilsCrossed, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { recipes } from '../data/recipes';
import { cities } from '../data/cities';
import { dynasties } from '../data/dynasties';
import { SmartImageBlock } from '../components/SmartImageBlock';
import { useSearch } from '../components/SearchBar';
import { EnhancedSearchBar } from '../components/EnhancedSearchBar';
import { getLocalImage } from '../assets/localImages';
import { toggleCollectionItem, addRecentlyViewed, getFavoritesSnapshot } from '../utils/culturalAssets';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';
import { StampFeedback } from '../components/StampFeedback';
import { RelatedPathCard } from '../components/RelatedPathCard';
import { EmptyStateCard } from '../components/EmptyStateCard';
import { PaperTexture } from '../components/PaperTexture';
import { ScrollToTopButton } from '../components/ScrollToTopButton';
import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { logger } from '../utils/errorHandling';
import { useToast } from '../components/Toast';

const RecipeCard = memo(function RecipeCard({ item, index, onPress }) {
  const isLeftCard = index % 2 === 0;
  return (
    <Pressable
      onPress={() => onPress(item)}
      style={({ pressed }) => [
        styles.card,
        isLeftCard ? styles.leftCard : styles.rightCard,
        pressed && styles.cardPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${item.nameEn} - ${item.nameCn}. ${item.province} province`}
      accessibilityHint="Double tap to view recipe details"
    >
      <SmartImageBlock
        source={getLocalImage('recipes', item.imageAsset)}
        uri={item.image}
        label={item.imagePlaceholderText}
        style={styles.heroImage}
        overlayOpacity={0.12}
      >
        <View style={[styles.overlay, item.imageAsset && styles.overlayLocal]} />
        <View style={styles.cardTop}>
          <View style={styles.regionPill}>
            <MapPin size={10} color="#F8F5EE" strokeWidth={2.5} />
            <Text style={styles.regionPillText}>{item.province}</Text>
          </View>
          <Text style={styles.badge}>{item.tasteProfile?.[0] ?? item.difficulty}</Text>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.nameCn}>{item.nameCn}</Text>
          <Text style={styles.nameEn} numberOfLines={1}>{item.nameEn}</Text>
          <Text style={styles.storyTeaser} numberOfLines={2}>{item.culturalStory}</Text>
        </View>
      </SmartImageBlock>
    </Pressable>
  );
});

export function FoodScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const toast = useToast();
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const data = useMemo(() => recipes, []);
  const [bookmarked, setBookmarked] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const listRef = useRef(null);

  // Load bookmark state from AsyncStorage on mount
  useEffect(() => {
    getFavoritesSnapshot().then((favorites) => {
      const recipeFavorites = favorites?.recipes || [];
      const bookmarkState = {};
      recipeFavorites.forEach((recipe) => {
        if (recipe.id) bookmarkState[recipe.id] = true;
      });
      setBookmarked(bookmarkState);
    }).catch((e) => { logger.error('FoodScreen', 'Failed to load favorites', e); });
  }, []);

  const { filterItems } = useSearch(data, ['nameEn', 'nameCn', 'province']);
  const filteredRecipes = useMemo(() => filterItems(searchQuery), [searchQuery, filterItems]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setRefreshing(false);
  }, []);

  const onOpenRecipe = useCallback((item) => setSelectedRecipe(item), []);
  const onToggleBookmark = useCallback(async (item) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    const wasBookmarked = bookmarked[item.id];
    setBookmarked((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
    await toggleCollectionItem('recipes', {
      id: item.id,
      nameEn: item.nameEn,
      province: item.province,
      imageAsset: item.imageAsset,
      culturalStory: item.culturalStory,
    }).catch(() => {});
    // Show toast feedback
    if (!wasBookmarked) {
      toast.success(`${item.nameCn} saved to collection`, 'Dish Added');
    } else {
      toast.info(`${item.nameCn} removed from collection`, 'Dish Removed');
    }
  }, [bookmarked, toast]);

  // Track view when recipe is selected
  useEffect(() => {
    if (selectedRecipe) {
      addRecentlyViewed({
        id: selectedRecipe.id,
        type: 'recipe',
        nameEn: selectedRecipe.nameEn,
        nameCn: selectedRecipe.nameCn,
        province: selectedRecipe.province,
      }).catch(() => {});

      // Try to earn stamp after viewing for 3 seconds
      const timeoutId = setTimeout(async () => {
        const { earnStamp } = await import('../utils/stampCollection');
        await earnStamp('food', selectedRecipe, {
          viewTimeMs: 3000,
          scrollDepth: 0.7,
          interactions: 1,
          expanded: true,
        });
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [selectedRecipe]);

  const renderRecipeCard = useCallback(
    ({ item, index }) => <RecipeCard item={item} index={index} onPress={onOpenRecipe} />,
    [onOpenRecipe]
  );
  const relatedCity = selectedRecipe ? cities.find((city) => city.province_id === selectedRecipe.province_id) : null;
  const relatedDynasty = selectedRecipe ? dynasties.find((dynasty) => dynasty.province_id === selectedRecipe.province_id) : null;
  const sheetPanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 18 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 26) setSelectedRecipe(null);
      },
    })
  ).current;

  const ListHeader = useMemo(() => (
    <>
      <ScreenHeader
        kicker="Food"
        title="Dishes That Carry a Place"
        subtitle="Read the dish first, then move into the city and history behind it."
        style={styles.header}
        includeTopInset={false}
      />
      <EnhancedSearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search dishes..."
        onClear={() => setSearchQuery('')}
        showTrending={true}
        showCategories={false}
        showHistory={true}
      />
      <SectionCard style={styles.storyGuideCard} tone="soft">
        <PaperTexture intensity="light" />
        <View style={styles.storyGuideTopRow}>
          <View style={styles.storyGuideLabelWrap}>
            <UtensilsCrossed size={14} color={theme.colors.primary} strokeWidth={2} />
            <Text style={styles.storyGuideLabel}>Dish Stream</Text>
          </View>
          <Text style={styles.storyGuideBadge}>{filteredRecipes.length} dishes</Text>
        </View>
        <Text style={styles.storyGuideTitle}>Read the dish story first.</Text>
        <Text style={styles.storyGuideText}>Each card opens a region, a story, and paths to continue.</Text>
      </SectionCard>
      <View style={styles.sectionSummaryRow}>
        <View style={styles.sectionSummaryCard}>
          <Text style={styles.sectionSummaryValue}>Tap</Text>
          <Text style={styles.sectionSummaryLabel}>Open story</Text>
        </View>
        <View style={styles.sectionSummaryCard}>
          <Text style={styles.sectionSummaryValue}>Save</Text>
          <Text style={styles.sectionSummaryLabel}>Bookmark dish</Text>
        </View>
      </View>
    </>
  ), [searchQuery, filteredRecipes.length]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        ref={listRef}
        data={filteredRecipes}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={renderRecipeCard}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <EmptyStateCard
            style={styles.emptyCard}
            title="No dishes yet"
            description="Try another module and come back to build your food map."
          />
        }
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        updateCellsBatchingPeriod={40}
        windowSize={5}
        removeClippedSubviews
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.column}
        showsVerticalScrollIndicator={false}
        onScroll={(e) => {
          const offsetY = e.nativeEvent.contentOffset.y;
          setShowScrollTop(offsetY > 400);
        }}
        scrollEventThrottle={100}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />
      <ScrollToTopButton
        visible={showScrollTop}
        onPress={() => listRef.current?.scrollToOffset({ offset: 0, animated: true })}
      />

      <Modal
        visible={!!selectedRecipe}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedRecipe(null)}
        accessibilityViewIsModal
      >
        <View style={styles.backdrop} accessible={true} accessibilityLabel="Recipe details overlay">
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setSelectedRecipe(null)} accessibilityLabel="Close recipe details" accessibilityRole="button" />
          <View style={styles.sheet} {...sheetPanResponder.panHandlers} accessible={true} accessibilityLabel="Recipe details sheet">
            <View style={styles.sheetHandleWrap}>
              <View style={styles.sheetHandle} />
            </View>
            {selectedRecipe ? (
              <ScrollView style={styles.sheetScrollShell} showsVerticalScrollIndicator={false}>
                <View style={styles.sheetHeader}>
                  <View style={styles.sheetTopRow}>
                    <Text style={styles.sheetKicker}>{selectedRecipe.province}</Text>
                    <Pressable style={styles.sheetCloseBtn} onPress={() => setSelectedRecipe(null)} accessibilityRole="button" accessibilityLabel="Close" accessibilityHint="Double tap to close recipe details">
                      <X size={16} color={theme.colors.mutedText} strokeWidth={2} />
                    </Pressable>
                  </View>
                  <Text style={styles.sheetTitleZh}>{selectedRecipe.nameCn}</Text>
                  <Text style={styles.sheetSubtitle}>{selectedRecipe.subtitleCn ?? selectedRecipe.nameEn}</Text>
                  <Text style={styles.sheetTitle}>{selectedRecipe.subtitleEn ?? selectedRecipe.nameEn}</Text>
                  <View style={styles.sheetHeroRow}>
                    <View style={styles.metaPillsRow}>
                      <View style={styles.metaPill}>
                        <Text style={styles.metaPillText}>{selectedRecipe.difficulty ?? 'Regional'}</Text>
                      </View>
                      {selectedRecipe.tasteProfile?.slice(0, 2).map((taste, i) => (
                        <View key={i} style={styles.metaPill}>
                          <Text style={styles.metaPillText}>{taste}</Text>
                        </View>
                      ))}
                    </View>
                    <Pressable
                      style={[styles.bookmarkBtn, bookmarked[selectedRecipe.id] && styles.bookmarkBtnActive]}
                      onPress={() => onToggleBookmark(selectedRecipe)}
                      accessibilityRole="button"
                      accessibilityLabel={bookmarked[selectedRecipe.id] ? "Saved - tap to remove" : "Save recipe"}
                      accessibilityHint="Double tap to toggle bookmark"
                    >
                      <Bookmark
                        size={16}
                        color={bookmarked[selectedRecipe.id] ? '#FFFFFF' : theme.colors.primary}
                        fill={bookmarked[selectedRecipe.id] ? theme.colors.primary : 'transparent'}
                        strokeWidth={2}
                      />
                    </Pressable>
                  </View>
                  {bookmarked[selectedRecipe.id] ? (
                    <StampFeedback
                      label="Saved"
                      active={true}
                      tone="cinnabar"
                      style={styles.stampFeedback}
                    />
                  ) : null}
                </View>

                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Sparkles size={14} color={theme.colors.primary} strokeWidth={2} />
                    <Text style={styles.sectionLabel}>Cultural Story</Text>
                  </View>
                  <Text style={styles.sectionText}>{selectedRecipe.culturalStory}</Text>
                </View>

                <View style={styles.sectionRow}>
                  <View style={styles.sectionHalf}>
                    <Text style={styles.sectionLabel}>Home Cooking</Text>
                    <Text style={styles.sectionText}>{selectedRecipe.substitution}</Text>
                  </View>
                  <View style={styles.sectionHalf}>
                    <Text style={styles.sectionLabel}>Dining Etiquette</Text>
                    <Text style={styles.sectionText}>{selectedRecipe.etiquette ?? selectedRecipe.culturalContext}</Text>
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Taste Profile</Text>
                  <Text style={styles.sectionText}>{(selectedRecipe.tasteProfile ?? []).join(' · ')}</Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Related Paths</Text>
                  <Text style={styles.sectionHint}>Explore the province through its city and history.</Text>
                  <View style={styles.relatedPathWrap}>
                    {relatedCity ? (
                      <RelatedPathCard
                        label="Place"
                        title={`${relatedCity.nameEn} / ${relatedCity.nameCn}`}
                        hint="Explore"
                        onPress={() => {
                          setSelectedRecipe(null);
                          navigation.getParent()?.navigate('Places');
                        }}
                      />
                    ) : null}
                    {relatedDynasty ? (
                      <RelatedPathCard
                        label="History"
                        title={`${relatedDynasty.nameEn} / ${relatedDynasty.nameCn}`}
                        hint="Explore"
                        onPress={() => {
                          setSelectedRecipe(null);
                          navigation.getParent()?.navigate('History');
                        }}
                      />
                    ) : null}
                    {!relatedCity && !relatedDynasty ? <Text style={styles.relatedPathHint}>No related paths yet</Text> : null}
                  </View>
                </View>

                {selectedRecipe.ingredients && selectedRecipe.ingredients.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Ingredients</Text>
                    <View style={styles.ingredientList}>
                      {selectedRecipe.ingredients.map((ing, idx) => (
                        <View key={`ing-${idx}`} style={styles.ingredientRow}>
                          <View style={styles.ingredientDot} />
                          <Text style={styles.ingredientText}>{ing}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {selectedRecipe.steps && selectedRecipe.steps.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Cooking Steps</Text>
                    <View style={styles.stepsList}>
                      {selectedRecipe.steps.map((step, idx) => (
                        <View key={`step-${idx}`} style={styles.stepRow}>
                          <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>{idx + 1}</Text>
                          </View>
                          <Text style={styles.stepText}>{step}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {selectedRecipe.tips && (
                  <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Chef's Tips</Text>
                    <Text style={styles.tipsText}>{selectedRecipe.tips}</Text>
                  </View>
                )}
              </ScrollView>
            ) : null}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    paddingHorizontal: theme.spacing.pageX,
    paddingTop: theme.spacing.pageY,
    paddingBottom: 100,
  },
  header: { marginBottom: 10 },
  storyGuideCard: {
    marginTop: 8,
    padding: 18,
    backgroundColor: theme.colors.softCard,
    overflow: 'hidden',
    borderColor: theme.colors.borderAccent,
  },
  storyGuideTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  storyGuideLabelWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  storyGuideLabel: { color: theme.colors.primary, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: '800' },
  storyGuideBadge: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    backgroundColor: theme.colors.cinnabarGlow,
    borderWidth: 0.5,
    borderColor: theme.colors.borderAccent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  storyGuideTitle: { marginTop: 10, color: theme.colors.text, fontSize: 18, lineHeight: 26, fontWeight: '700' },
  storyGuideText: { marginTop: 6, color: theme.colors.mutedText, fontSize: 12, lineHeight: 18 },
  sectionSummaryRow: { flexDirection: 'row', gap: 10, marginTop: 12, marginBottom: 12 },
  sectionSummaryCard: {
    flex: 1,
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: 14,
  },
  sectionSummaryValue: { color: theme.colors.text, fontSize: 18, fontWeight: '800' },
  sectionSummaryLabel: { marginTop: 2, color: theme.colors.mutedText, fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: '700' },
  column: {
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.lg,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    marginBottom: 12,
    ...theme.shadows.medium,
  },
  cardPressed: {
    opacity: 0.96,
    transform: [{ scale: 0.99 }],
  },
  leftCard: {
    marginRight: 6,
  },
  rightCard: {
    marginLeft: 6,
  },
  heroImage: {
    width: '100%',
    height: 260,
    justifyContent: 'space-between',
    padding: 14,
  },
  overlay: { ...StyleSheet.absoluteFillObject },
  overlayLocal: {
    backgroundColor: 'rgba(24, 18, 16, 0.14)',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  regionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(24, 18, 16, 0.38)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  regionPillText: {
    color: '#F8F5EE',
    fontSize: 10,
    letterSpacing: 1.2,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  badge: {
    color: '#F8F5EE',
    fontSize: 10,
    letterSpacing: 0.5,
    fontWeight: '700',
    backgroundColor: 'rgba(24, 18, 16, 0.38)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  cardBody: {
    maxWidth: 220,
  },
  nameCn: {
    color: '#F8F5EE',
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '600',
    letterSpacing: theme.typography.hanziLetterSpacing * 0.8,
  },
  nameEn: {
    marginTop: 6,
    color: 'rgba(248, 245, 238, 0.85)',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  storyTeaser: {
    marginTop: 12,
    color: 'rgba(248, 245, 238, 0.75)',
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500',
    maxWidth: 200,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.42)',
    justifyContent: 'flex-end',
  },
  sheet: {
    minHeight: '85%',
    maxHeight: '96%',
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radii.xl,
    borderTopRightRadius: theme.radii.xl,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    ...theme.shadows.modal,
  },
  sheetHandleWrap: {
    alignItems: 'center',
    paddingBottom: 14,
  },
  sheetHandle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.cinnabarGlow,
  },
  sheetScrollShell: { paddingBottom: 12 },
  sheetHeader: { gap: 2 },
  sheetTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheetCloseBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.inkWash,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetKicker: {
    color: theme.colors.primary,
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  sheetTitleZh: {
    color: theme.colors.text,
    fontSize: 32,
    lineHeight: 42,
    fontWeight: '700',
    letterSpacing: theme.typography.hanziLetterSpacing,
    marginTop: 8,
  },
  sheetSubtitle: {
    color: theme.colors.primary,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  sheetTitle: {
    color: theme.colors.mutedText,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
  sheetHeroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 14,
  },
  metaPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
  },
  metaPill: {
    borderRadius: 999,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  metaPillText: {
    color: theme.colors.mutedText,
    fontSize: 10,
    letterSpacing: 0.6,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  bookmarkBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
  },
  bookmarkBtnActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  stampFeedback: {
    marginTop: 14,
  },
  section: {
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.border,
    paddingTop: 16,
    marginTop: 16,
  },
  sectionRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 16,
  },
  sectionHalf: {
    flex: 1,
    gap: 4,
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.border,
    paddingTop: 16,
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionLabel: {
    color: theme.colors.primary,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  sectionText: {
    color: theme.colors.text,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  sectionHint: {
    color: theme.colors.mutedText,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },
  relatedPathWrap: { gap: 10, marginTop: 14 },
  relatedPathHint: { color: theme.colors.mutedText, fontSize: 11, lineHeight: 16.8, marginTop: 4 },
  emptyCard: { padding: 14, marginTop: 8 },
  ingredientList: { gap: 6, marginTop: 10 },
  ingredientRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  ingredientDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: theme.colors.primary, marginTop: 7 },
  ingredientText: { flex: 1, color: theme.colors.text, fontSize: 13, lineHeight: 20 },
  stepsList: { gap: 12, marginTop: 10 },
  stepRow: { flexDirection: 'row', gap: 10 },
  stepNumber: { width: 24, height: 24, borderRadius: 12, backgroundColor: theme.colors.cinnabarGlow, alignItems: 'center', justifyContent: 'center' },
  stepNumberText: { color: theme.colors.primary, fontSize: 12, fontWeight: '700' },
  stepText: { flex: 1, color: theme.colors.text, fontSize: 13, lineHeight: 20 },
  tipsText: { color: theme.colors.mutedText, fontSize: 13, lineHeight: 20, fontStyle: 'italic', marginTop: 6 },
});
