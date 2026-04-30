import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Pressable, RefreshControl, SafeAreaView, StyleSheet, Text, View, FlatList } from 'react-native';
import { MapPin, UtensilsCrossed, Scroll, ArrowRight, Bookmark, Trophy, Grid3X3, List, User } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import { getCulturalAssets, getCultureRank, getProvinceConnectionMap } from '../utils/culturalAssets';
import { cities as allCities } from '../data/cities';
import { recipes as allRecipes } from '../data/recipes';
import { dynasties as allDynasties } from '../data/dynasties';
import { people as allPeople } from '../data/people';
import { HandscrollContainer } from '../components/HandscrollContainer';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';
import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { FLATLIST_CONFIG, DISPLAY_LIMITS } from '../config/constants';

const categories = [
  { id: 'cities', label: 'Cities', labelCn: '城市', icon: MapPin, color: '#6B8A94' },
  { id: 'recipes', label: 'Dishes', labelCn: '美食', icon: UtensilsCrossed, color: '#E2B05E' },
  { id: 'dynasties', label: 'Dynasties', labelCn: '朝代', icon: Scroll, color: '#B33B24' },
  { id: 'people', label: 'People', labelCn: '人物', icon: User, color: '#8B7355' },
];

function CollectionItem({ item, type, onPress }) {
  const config = categories.find(c => c.id === type);
  const Icon = config?.icon || Bookmark;

  return (
    <Pressable
      style={({ pressed }) => [styles.collectionItem, pressed && styles.collectionItemPressed]}
      onPress={() => onPress?.(item, type)}
      accessibilityRole="button"
      accessibilityLabel={`${item.nameEn}${item.nameCn ? ` - ${item.nameCn}` : ''}`}
      accessibilityHint="Double tap to view details"
    >
      <View style={[styles.itemIcon, { backgroundColor: `${config?.color || theme.colors.primary}18` }]}>
        <Icon size={18} color={config?.color || theme.colors.primary} strokeWidth={2} />
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemName} numberOfLines={1}>{item.nameEn}</Text>
        {item.nameCn && <Text style={styles.itemNameCn} numberOfLines={1}>{item.nameCn}</Text>}
        {item.province && <Text style={styles.itemMeta}>{item.province}</Text>}
        {item.region && <Text style={styles.itemMeta}>{item.region}</Text>}
      </View>
      <ArrowRight size={14} color={theme.colors.mutedText} strokeWidth={2} />
    </Pressable>
  );
}

function CategorySummaryCard({ category, items, onPress }) {
  const Icon = category.icon;
  const count = items?.length || 0;
  const progress = Math.min(count / 10, 1); // Show progress towards 10 items

  return (
    <Pressable
      style={({ pressed }) => [styles.categoryCard, pressed && styles.categoryCardPressed]}
      onPress={() => onPress?.(category.id)}
      accessibilityRole="button"
      accessibilityLabel={`${category.label} - ${category.labelCn}. ${items?.length || 0} items saved`}
      accessibilityHint="Double tap to view category"
    >
      <View style={[styles.categoryIconWrap, { backgroundColor: `${category.color}18` }]}>
        <Icon size={24} color={category.color} strokeWidth={2} />
      </View>
      <View style={styles.categoryContent}>
        <Text style={styles.categoryLabel}>{category.label}</Text>
        <Text style={styles.categoryLabelCn}>{category.labelCn}</Text>
        <View style={styles.categoryProgressWrap}>
          <View style={styles.categoryProgressBar}>
            <View style={[styles.categoryProgressFill, { width: `${progress * 100}%`, backgroundColor: category.color }]} />
          </View>
          <Text style={styles.categoryCount}>{count} saved</Text>
        </View>
      </View>
      <ArrowRight size={16} color={theme.colors.mutedText} strokeWidth={2} />
    </Pressable>
  );
}

function MilestoneCard({ collected, rank }) {
  const milestones = [
    { count: 5, label: 'Explorer', labelCn: '探索者', reward: 'Unlock 5 items' },
    { count: 15, label: 'Traveler', labelCn: '行者', reward: 'Collect 15 items' },
    { count: 30, label: 'Scholar', labelCn: '学者', reward: 'Gather 30 items' },
    { count: 50, label: 'Master', labelCn: '大师', reward: 'Master 50 items' },
  ];

  const currentMilestone = milestones.find(m => collected < m.count) || milestones[milestones.length - 1];
  const prevMilestone = milestones.filter(m => collected >= m.count).pop() || null;

  // Calculate progress safely, avoiding division by zero
  let progress = 0;
  const denominator = currentMilestone.count - (prevMilestone?.count || 0);
  if (denominator > 0) {
    progress = (collected - (prevMilestone?.count || 0)) / denominator;
  } else if (collected >= currentMilestone.count) {
    progress = 1;
  }

  return (
    <SectionCard style={styles.milestoneCard} tone="soft">
      <View style={styles.milestoneHeader}>
        <Trophy size={18} color={theme.colors.primary} strokeWidth={2} />
        <Text style={styles.milestoneTitle}>Your Journey</Text>
      </View>

      <View style={styles.milestoneCurrent}>
        <Text style={styles.milestoneRank}>{rank}</Text>
        <Text style={styles.milestoneCollected}>{collected} items collected</Text>
      </View>

      <View style={styles.milestoneProgressWrap}>
        <View style={styles.milestoneProgressBar}>
          <View style={[styles.milestoneProgressFill, { width: `${Math.min(progress * 100, 100)}%` }]} />
        </View>
        <Text style={styles.milestoneNext}>
          {collected >= 50 ? 'Max rank achieved!' : `${currentMilestone.count - collected} more to ${currentMilestone.label}`}
        </Text>
      </View>

      <View style={styles.milestoneList}>
        {milestones.map((m, idx) => {
          const achieved = collected >= m.count;
          return (
            <View key={m.count} style={[styles.milestoneItem, achieved && styles.milestoneItemAchieved]}>
              <View style={[styles.milestoneDot, achieved && styles.milestoneDotAchieved]} />
              <Text style={[styles.milestoneItemLabel, achieved && styles.milestoneItemLabelAchieved]}>{m.labelCn}</Text>
              <Text style={styles.milestoneItemCount}>{m.count}</Text>
            </View>
          );
        })}
      </View>
    </SectionCard>
  );
}

export function CollectionScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [assets, setAssets] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await getCulturalAssets().catch(() => null);
      if (!cancelled) setAssets(data);
    })();
    return () => { cancelled = true; };
  }, []);

  // Refresh on focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const data = await getCulturalAssets().catch(() => null);
      setAssets(data);
    });
    return unsubscribe;
  }, [navigation]);

  const cities = assets?.favorites?.cities || [];
  const recipes = assets?.favorites?.recipes || [];
  const dynasties = assets?.favorites?.dynasties || [];
  const people = assets?.favorites?.people || [];
  const totalCollected = cities.length + recipes.length + dynasties.length + people.length;

  const connectionMap = getProvinceConnectionMap({
    favorites: assets?.favorites,
    cities: allCities,
    recipes: allRecipes,
    dynasties: allDynasties,
  });
  const rank = getCultureRank(connectionMap.collectedCount);

  function handleCategoryPress(categoryId) {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
    Haptics.selectionAsync().catch(() => {});
  }

  function handleItemPress(item, type) {
    // Navigate to detail screen based on type
    const screenMap = {
      cities: 'Places',
      recipes: 'Food',
      dynasties: 'History',
      people: 'History',
    };
    const detailScreenMap = {
      dynasties: 'DynastyDetail',
      people: 'PersonDetail',
    };

    const targetTab = screenMap[type] || 'Home';
    const detailScreen = detailScreenMap[type];

    if (detailScreen) {
      // Navigate to the tab and then to the detail screen
      navigation.getParent()?.navigate(targetTab, {
        screen: detailScreen,
        params: { personId: item.id, person: item }
      });
    } else {
      // Just navigate to the tab (Places and Food screens handle their own detail views)
      navigation.getParent()?.navigate(targetTab);
    }
  }

  function toggleViewMode() {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
    Haptics.selectionAsync().catch(() => {});
  }

  const displayItems = selectedCategory
    ? (selectedCategory === 'cities' ? cities : selectedCategory === 'recipes' ? recipes : selectedCategory === 'dynasties' ? dynasties : people)
    : [...cities.map(i => ({ ...i, type: 'cities' })), ...recipes.map(i => ({ ...i, type: 'recipes' })), ...dynasties.map(i => ({ ...i, type: 'dynasties' })), ...people.map(i => ({ ...i, type: 'people' }))];

  return (
    <SafeAreaView style={styles.safeArea}>
      <HandscrollContainer style={styles.scrollShell}>
        <View style={styles.container}>
          <ScreenHeader
            kicker="Collection"
            title="Your Atlas"
            subtitle="All the places, dishes, and dynasties you've collected."
            includeTopInset={false}
          />

          {/* Summary Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalCollected}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{cities.length}</Text>
              <Text style={styles.statLabel}>Cities</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{recipes.length}</Text>
              <Text style={styles.statLabel}>Dishes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{dynasties.length}</Text>
              <Text style={styles.statLabel}>Dynasties</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{people.length}</Text>
              <Text style={styles.statLabel}>People</Text>
            </View>
          </View>

          {/* Milestone Progress */}
          <MilestoneCard collected={totalCollected} rank={rank} />

          {/* Category Cards */}
          <View style={styles.categoriesSection}>
            <Text style={styles.sectionLabel}>Categories</Text>
            {categories.map((cat) => {
              const catItems = cat.id === 'cities' ? cities : cat.id === 'recipes' ? recipes : cat.id === 'dynasties' ? dynasties : people;
              return (
                <CategorySummaryCard
                  key={cat.id}
                  category={cat}
                  items={catItems}
                  onPress={handleCategoryPress}
                />
              );
            })}
          </View>

          {/* Collection Items */}
          {displayItems.length > 0 && (
            <View style={styles.itemsSection}>
              <View style={styles.itemsHeader}>
                <Text style={styles.sectionLabel}>
                  {selectedCategory
                    ? `${categories.find(c => c.id === selectedCategory)?.label || 'Items'}`
                    : 'All Items'}
                </Text>
                <Pressable style={styles.viewToggle} onPress={toggleViewMode} accessibilityRole="button" accessibilityLabel={viewMode === 'grid' ? "Switch to list view" : "Switch to grid view"} accessibilityHint="Double tap to toggle view mode">
                  {viewMode === 'grid' ? (
                    <List size={16} color={theme.colors.mutedText} strokeWidth={2} />
                  ) : (
                    <Grid3X3 size={16} color={theme.colors.mutedText} strokeWidth={2} />
                  )}
                </Pressable>
              </View>

              {viewMode === 'list' ? (
                <FlatList
                  data={displayItems}
                  keyExtractor={(item, idx) => `${item.type || selectedCategory}-${item.id || idx}`}
                  renderItem={({ item }) => (
                    <CollectionItem
                      item={item}
                      type={item.type || selectedCategory}
                      onPress={handleItemPress}
                    />
                  )}
                  initialNumToRender={FLATLIST_CONFIG.INITIAL_NUM_TO_RENDER}
                  maxToRenderPerBatch={FLATLIST_CONFIG.MAX_TO_RENDER_PER_BATCH}
                  windowSize={FLATLIST_CONFIG.WINDOW_SIZE}
                  contentContainerStyle={styles.itemsList}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <FlatList
                  data={displayItems}
                  keyExtractor={(item, idx) => `${item.type || selectedCategory}-${item.id || idx}`}
                  numColumns={3}
                  renderItem={({ item }) => {
                    const type = item.type || selectedCategory;
                    const config = categories.find(c => c.id === type);
                    const Icon = config?.icon || Bookmark;
                    return (
                      <Pressable
                        style={styles.gridItem}
                        onPress={() => handleItemPress(item, type)}
                        accessibilityRole="button"
                        accessibilityLabel={`${item.nameEn}${item.nameCn ? ` - ${item.nameCn}` : ''}`}
                        accessibilityHint="Double tap to view details"
                      >
                        <View style={[styles.gridItemIcon, { backgroundColor: `${config?.color || theme.colors.primary}18` }]}>
                          <Icon size={20} color={config?.color || theme.colors.primary} strokeWidth={2} />
                        </View>
                        <Text style={styles.gridItemName} numberOfLines={1}>{item.nameEn}</Text>
                        {item.nameCn && <Text style={styles.gridItemNameCn} numberOfLines={1}>{item.nameCn}</Text>}
                      </Pressable>
                    );
                  }}
                  initialNumToRender={FLATLIST_CONFIG.INITIAL_NUM_TO_RENDER}
                  maxToRenderPerBatch={FLATLIST_CONFIG.MAX_TO_RENDER_PER_BATCH}
                  windowSize={FLATLIST_CONFIG.WINDOW_SIZE}
                  contentContainerStyle={styles.itemsGrid}
                  columnWrapperStyle={styles.gridRow}
                  showsVerticalScrollIndicator={false}
                />
              )}

              {displayItems.length > DISPLAY_LIMITS.COLLECTION_LIST && (
                <Text style={styles.moreItems}>+{displayItems.length - DISPLAY_LIMITS.COLLECTION_LIST} more items</Text>
              )}
            </View>
          )}

          {/* Empty State */}
          {totalCollected === 0 && (
            <SectionCard style={styles.emptyCard} tone="panel">
              <Bookmark size={32} color={theme.colors.mutedText} strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>Start Your Collection</Text>
              <Text style={styles.emptyText}>
                Save cities, dishes, and dynasties to build your personal cultural atlas.
              </Text>
              <Pressable
                style={styles.exploreBtn}
                onPress={() => navigation.getParent()?.navigate('Places')}
                accessibilityRole="button"
                accessibilityLabel="Explore Places"
                accessibilityHint="Double tap to start exploring"
              >
                <Text style={styles.exploreBtnText}>Explore Places</Text>
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

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
  },
  statValue: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    color: theme.colors.mutedText,
    fontSize: 10,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '700',
  },

  // Milestone Card
  milestoneCard: {
    marginTop: 14,
    padding: 16,
  },
  milestoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  milestoneTitle: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  milestoneCurrent: {
    marginTop: 12,
    alignItems: 'center',
  },
  milestoneRank: {
    color: theme.colors.primary,
    fontSize: 20,
    fontWeight: '800',
  },
  milestoneCollected: {
    color: theme.colors.mutedText,
    fontSize: 12,
    marginTop: 2,
  },
  milestoneProgressWrap: {
    marginTop: 12,
  },
  milestoneProgressBar: {
    height: 6,
    backgroundColor: 'rgba(51, 51, 51, 0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  milestoneProgressFill: {
    height: 6,
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  milestoneNext: {
    marginTop: 6,
    color: theme.colors.mutedText,
    fontSize: 11,
    textAlign: 'center',
  },
  milestoneList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  milestoneItem: {
    alignItems: 'center',
    opacity: 0.5,
  },
  milestoneItemAchieved: {
    opacity: 1,
  },
  milestoneDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.border,
  },
  milestoneDotAchieved: {
    backgroundColor: theme.colors.primary,
  },
  milestoneItemLabel: {
    marginTop: 4,
    color: theme.colors.mutedText,
    fontSize: 10,
  },
  milestoneItemLabelAchieved: {
    color: theme.colors.text,
    fontWeight: '700',
  },
  milestoneItemCount: {
    color: theme.colors.mutedText,
    fontSize: 9,
    marginTop: 1,
  },

  // Categories Section
  categoriesSection: {
    marginTop: 20,
  },
  sectionLabel: {
    color: theme.colors.primary,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 10,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    padding: 14,
    marginBottom: 10,
  },
  categoryCardPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.995 }],
  },
  categoryIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryContent: {
    flex: 1,
  },
  categoryLabel: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  categoryLabelCn: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  categoryProgressWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  categoryProgressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(51, 51, 51, 0.08)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  categoryProgressFill: {
    height: 4,
    borderRadius: 2,
  },
  categoryCount: {
    color: theme.colors.mutedText,
    fontSize: 11,
    fontWeight: '700',
  },

  // Items Section
  itemsSection: {
    marginTop: 20,
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  viewToggle: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: theme.colors.surface,
  },
  itemsList: {
    gap: 8,
  },
  collectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    padding: 12,
  },
  collectionItemPressed: {
    opacity: 0.94,
    backgroundColor: theme.colors.surface,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  itemNameCn: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  itemMeta: {
    color: theme.colors.mutedText,
    fontSize: 10,
    marginTop: 2,
  },

  // Grid View
  itemsGrid: {
    gap: 10,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  gridItem: {
    width: '31%',
    alignItems: 'center',
    padding: 12,
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  gridItemIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  gridItemName: {
    color: theme.colors.text,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  gridItemNameCn: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 1,
  },
  moreItems: {
    marginTop: 12,
    color: theme.colors.mutedText,
    fontSize: 12,
    textAlign: 'center',
  },

  // Empty State
  emptyCard: {
    marginTop: 20,
    padding: 24,
    alignItems: 'center',
  },
  emptyTitle: {
    marginTop: 12,
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  emptyText: {
    marginTop: 8,
    color: theme.colors.mutedText,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
