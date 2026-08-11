import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Pressable, RefreshControl, SafeAreaView, StyleSheet, Text, View, FlatList } from 'react-native';
import { MapPin, UtensilsCrossed, Scroll, ArrowRight, Bookmark, Trophy, Grid3X3, List, User, Star, Sparkles, Stamp } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import { getCulturalAssets, getCultureRank, getProvinceConnectionMap, setCollectionActive } from '../utils/culturalAssets';
import { getStampCollection, getStampStats } from '../utils/stampCollection';
import { cities as allCities } from '../data/cities';
import { recipes as allRecipes } from '../data/recipes';
import { dynasties as allDynasties } from '../data/dynasties';
import { people as allPeople } from '../data/people';
import { HandscrollContainer } from '../components/HandscrollContainer';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';
import { EmptyStateCard } from '../components/EmptyStateCard';
import { RarityBadge, RarityStars, RarityProgressBar } from '../components/RarityBadge';
import { getItemRarity, getCollectionStats, sortByRarity, addRarityToItem } from '../utils/collectibles';
import { getRarityColor } from '../config/rarity';
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
  const rarity = item.rarity || getItemRarity(type, item.id);

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
        <View style={styles.itemNameRow}>
          <Text style={styles.itemName} numberOfLines={1}>{item.nameEn}</Text>
          {rarity !== 'common' && <RarityBadge rarity={rarity} size="small" showLabel={false} />}
        </View>
        {item.nameCn && <Text style={styles.itemNameCn} numberOfLines={1}>{item.nameCn}</Text>}
        {item.province && <Text style={styles.itemMeta}>{item.province}</Text>}
        {item.region && <Text style={styles.itemMeta}>{item.region}</Text>}
      </View>
      <ArrowRight size={14} color={theme.colors.mutedText} strokeWidth={2} />
    </Pressable>
  );
}

function CategorySummaryCard({ category, items, allItems, onPress }) {
  const Icon = category.icon;
  const count = items?.length || 0;
  const total = allItems?.length || 1;
  const progress = count / total;

  // Calculate rarity stats
  const stats = getCollectionStats(items, allItems, category.id);

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
          <Text style={styles.categoryCount}>{count}/{total}</Text>
        </View>
        {/* Rarity breakdown */}
        <View style={styles.rarityRow}>
          {stats.byRarity.legendary.total > 0 && (
            <Text style={[styles.rarityDot, { color: '#F59E0B' }]}>★{stats.byRarity.legendary.collected}</Text>
          )}
          {stats.byRarity.epic.total > 0 && (
            <Text style={[styles.rarityDot, { color: '#8B5CF6' }]}>★{stats.byRarity.epic.collected}</Text>
          )}
          {stats.byRarity.rare.total > 0 && (
            <Text style={[styles.rarityDot, { color: '#3B82F6' }]}>★{stats.byRarity.rare.collected}</Text>
          )}
        </View>
      </View>
      <ArrowRight size={16} color={theme.colors.mutedText} strokeWidth={2} />
    </Pressable>
  );
}

function StampAlbumCard({ stampCount, totalStamps, onPress }) {
  const progress = totalStamps > 0 ? stampCount / totalStamps : 0;

  return (
    <Pressable
      style={({ pressed }) => [styles.stampCard, pressed && styles.stampCardPressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Stamp Album - 印章相册. ${stampCount} stamps collected`}
      accessibilityHint="Double tap to view stamp collection"
    >
      <View style={styles.stampIconWrap}>
        <Stamp size={24} color={theme.colors.primary} strokeWidth={2} />
        <View style={styles.stampGlow} />
      </View>
      <View style={styles.stampContent}>
        <Text style={styles.stampLabel}>Stamp Album</Text>
        <Text style={styles.stampLabelCn}>印章相册</Text>
        <View style={styles.stampProgressWrap}>
          <View style={styles.stampProgressBar}>
            <View style={[styles.stampProgressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.stampCount}>{stampCount}/{totalStamps}</Text>
        </View>
      </View>
      <View style={styles.stampBadge}>
        <Sparkles size={14} color="#F59E0B" strokeWidth={2} />
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
  const [stampStats, setStampStats] = useState({ total: 0, byRarity: {} });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await getCulturalAssets().catch(() => null);
      if (!cancelled) setAssets(data);
    })();
    return () => { cancelled = true; };
  }, []);

  // Load stamp stats
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stats = await getStampStats().catch(() => ({ total: 0, byRarity: {} }));
      if (!cancelled) setStampStats(stats);
    })();
    return () => { cancelled = true; };
  }, []);

  // Refresh on focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const data = await getCulturalAssets().catch(() => null);
      setAssets(data);
      const stats = await getStampStats().catch(() => ({ total: 0, byRarity: {} }));
      setStampStats(stats);
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

  function handleStampAlbumPress() {
    Haptics.selectionAsync().catch(() => {});
    navigation.navigate('StampCollection');
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
    } else if (type === 'recipes') {
      // Food shows its detail as a bottom sheet keyed by recipeId.
      navigation.getParent()?.navigate('Food', { recipeId: item.id });
    } else if (type === 'cities') {
      // Places highlights the activated city from cityId.
      navigation.getParent()?.navigate('Places', { cityId: item.id });
    } else {
      // Just navigate to the tab (Places and Food screens handle their own detail views)
      navigation.getParent()?.navigate(targetTab);
    }
  }

  function toggleViewMode() {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
    Haptics.selectionAsync().catch(() => {});
  }

  function getCategoryCandidates(categoryId) {
    switch (categoryId) {
      case 'cities': return allCities;
      case 'recipes': return allRecipes;
      case 'dynasties': return allDynasties;
      case 'people': return allPeople;
      default: return [];
    }
  }

  async function handleBulkAction(categoryId, nextActive) {
    const cat = categories.find(c => c.id === categoryId);
    if (!cat) return;
    Haptics.selectionAsync().catch(() => {});
    const allItems = getCategoryCandidates(categoryId);
    const updated = await setCollectionActive(categoryId, nextActive, allItems).catch(() => null);
    if (updated) {
      setAssets(updated);
    }
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

          {/* Stamp Album Entry */}
          <Pressable
            style={({ pressed }) => [styles.stampCard, pressed && styles.stampCardPressed]}
            onPress={handleStampAlbumPress}
            accessibilityRole="button"
            accessibilityLabel="Stamp Album - 印章相册"
            accessibilityHint="Double tap to view stamp collection"
          >
            <View style={styles.stampIconWrap}>
              <Stamp size={24} color={theme.colors.primary} strokeWidth={2} />
              <View style={styles.stampGlow} />
            </View>
            <View style={styles.stampContent}>
              <Text style={styles.stampLabel}>Stamp Album</Text>
              <Text style={styles.stampLabelCn}>印章相册</Text>
              <View style={styles.stampProgressWrap}>
                <View style={styles.stampProgressBar}>
                  <View style={[styles.stampProgressFill, { width: `${(stampStats.total / 50) * 100}%` }]} />
                </View>
                <Text style={styles.stampCount}>{stampStats.total}/50</Text>
              </View>
            </View>
            <View style={styles.stampBadge}>
              <Sparkles size={14} color="#F59E0B" strokeWidth={2} />
            </View>
            <ArrowRight size={16} color={theme.colors.mutedText} strokeWidth={2} />
          </Pressable>

          {/* Category Cards */}
          <View style={styles.categoriesSection}>
            <Text style={styles.sectionLabel}>Categories</Text>
            {categories.map((cat) => {
              const catItems = cat.id === 'cities' ? cities : cat.id === 'recipes' ? recipes : cat.id === 'dynasties' ? dynasties : people;
              const allCatItems = cat.id === 'cities' ? allCities : cat.id === 'recipes' ? allRecipes : cat.id === 'dynasties' ? allDynasties : allPeople;
              return (
                <CategorySummaryCard
                  key={cat.id}
                  category={cat}
                  items={catItems}
                  allItems={allCatItems}
                  onPress={handleCategoryPress}
                />
              );
            })}
          </View>

          {/* Bulk actions for a selected category (collect all / clear all) */}
          {selectedCategory && (
            <View style={styles.bulkBar}>
              <Text style={styles.bulkTitle}>
                {categories.find(c => c.id === selectedCategory)?.label || 'Category'} bulk action
              </Text>
              <View style={styles.bulkActions}>
                <Pressable
                  style={({ pressed }) => [styles.bulkBtn, styles.bulkBtnPrimary, pressed && styles.bulkBtnPressed]}
                  onPress={() => handleBulkAction(selectedCategory, true)}
                  accessibilityRole="button"
                  accessibilityLabel={`Collect all ${categories.find(c => c.id === selectedCategory)?.label || 'items'} in this category`}
                  accessibilityHint="Adds every item in this category to your collection"
                >
                  <Star size={14} color="#FFFFFF" strokeWidth={2} />
                  <Text style={styles.bulkBtnTextLight}>Collect all</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [styles.bulkBtn, styles.bulkBtnGhost, pressed && styles.bulkBtnPressed]}
                  onPress={() => handleBulkAction(selectedCategory, false)}
                  accessibilityRole="button"
                  accessibilityLabel={`Clear all ${categories.find(c => c.id === selectedCategory)?.label || 'items'} in this category`}
                  accessibilityHint="Removes every saved item in this category"
                >
                  <Bookmark size={14} color={theme.colors.mutedText} strokeWidth={2} />
                  <Text style={styles.bulkBtnTextGhost}>Clear all</Text>
                </Pressable>
              </View>
            </View>
          )}

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
                    const rarity = item.rarity || getItemRarity(type, item.id);
                    return (
                      <Pressable
                        style={[styles.gridItem, rarity !== 'common' && styles.gridItemRare]}
                        onPress={() => handleItemPress(item, type)}
                        accessibilityRole="button"
                        accessibilityLabel={`${item.nameEn}${item.nameCn ? ` - ${item.nameCn}` : ''}`}
                        accessibilityHint="Double tap to view details"
                      >
                        <View style={[styles.gridItemIcon, { backgroundColor: `${config?.color || theme.colors.primary}18` }]}>
                          <Icon size={20} color={config?.color || theme.colors.primary} strokeWidth={2} />
                          {rarity !== 'common' && (
                            <View style={[styles.gridRarityBadge, { backgroundColor: getRarityColor(rarity) }]}>
                              <Text style={styles.gridRarityText}>★</Text>
                            </View>
                          )}
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
            <EmptyStateCard
              style={styles.emptyCard}
              title="Start Your Collection"
              titleCn="开始收藏"
              description="Save cities, dishes, and dynasties to build your personal cultural atlas."
              icon={Bookmark}
              action="Explore Places"
              onAction={() => navigation.getParent()?.navigate('Places')}
              centered
            />
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

  // Stamp Album Card
  stampCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 14,
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    padding: 14,
  },
  stampCardPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.995 }],
  },
  stampIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: `${theme.colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  stampGlow: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${theme.colors.primary}08`,
  },
  stampContent: {
    flex: 1,
  },
  stampLabel: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  stampLabelCn: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  stampProgressWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  stampProgressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(51, 51, 51, 0.08)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  stampProgressFill: {
    height: 4,
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  stampCount: {
    color: theme.colors.mutedText,
    fontSize: 11,
    fontWeight: '700',
  },
  stampBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: `${theme.colors.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
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
  rarityRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  rarityDot: {
    fontSize: 10,
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
  // Bulk actions bar
  bulkBar: {
    marginTop: 16,
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: 12,
    gap: 10,
  },
  bulkTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.mutedText,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  bulkActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bulkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: theme.radii.sm,
  },
  bulkBtnPrimary: {
    backgroundColor: theme.colors.primary,
  },
  bulkBtnGhost: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: 'transparent',
  },
  bulkBtnPressed: {
    opacity: 0.7,
  },
  bulkBtnTextLight: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  bulkBtnTextGhost: {
    color: theme.colors.mutedText,
    fontSize: 13,
    fontWeight: '600',
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
  itemNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemName: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
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
  gridItemRare: {
    borderWidth: 1,
  },
  gridItemIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  gridRarityBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridRarityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
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
    marginHorizontal: 0,
  },
});
