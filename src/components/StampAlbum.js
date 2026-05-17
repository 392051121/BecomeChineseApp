/**
 * Stamp Album Component
 *
 * Grid view of collected stamps with filtering options.
 */

import React, { memo, useEffect, useState, useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Filter, Grid, LayoutGrid, Sparkles } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { SectionCard } from './SectionCard';
import { StampCard } from './StampCard';
import { getAllStamps, getStampStats } from '../utils/stampCollection';
import { STAMP_TYPES } from '../data/stamps';

const FILTER_OPTIONS = [
  { id: 'all', label: 'All', labelCn: '全部' },
  { id: 'city', label: 'Cities', labelCn: '城市' },
  { id: 'food', label: 'Food', labelCn: '美食' },
  { id: 'dynasty', label: 'Dynasties', labelCn: '朝代' },
  { id: 'person', label: 'People', labelCn: '人物' },
  { id: 'festival', label: 'Festivals', labelCn: '节日' },
];

const SORT_OPTIONS = [
  { id: 'earnedAt', label: 'Recent' },
  { id: 'rarity', label: 'Rarity' },
  { id: 'xp', label: 'XP' },
];

const FilterChip = memo(function FilterChip({ option, isActive, onPress }) {
  const { colors } = useTheme();

  return (
    <Pressable
      style={[
        styles.filterChip,
        isActive && styles.filterChipActive,
        { borderColor: isActive ? colors.primary : colors.border },
        { backgroundColor: isActive ? colors.cinnabarGlow : colors.surface },
      ]}
      onPress={() => onPress(option.id)}
    >
      <Text
        style={[
          styles.filterChipText,
          { color: isActive ? colors.primary : colors.mutedText },
        ]}
      >
        {option.label}
      </Text>
    </Pressable>
  );
});

const StampItem = memo(function StampItem({ stamp, onPress }) {
  return (
    <StampCard
      stamp={stamp}
      size="medium"
      onPress={onPress}
      showDetails={true}
    />
  );
});

export const StampAlbum = memo(function StampAlbum({
  filter: initialFilter = 'all',
  sortBy: initialSortBy = 'earnedAt',
  onStampPress,
  showFilters = true,
  showStats = true,
  numColumns = 3,
}) {
  const { colors } = useTheme();
  const [stamps, setStamps] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState(initialFilter);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [loading, setLoading] = useState(true);

  const loadStamps = useCallback(async () => {
    setLoading(true);
    try {
      const [allStamps, stampStats] = await Promise.all([
        getAllStamps(sortBy, true),
        getStampStats(),
      ]);

      // Filter stamps
      const filtered = filter === 'all'
        ? allStamps
        : allStamps.filter((s) => s.type === filter);

      setStamps(filtered);
      setStats(stampStats);
    } catch (e) {
      console.error('Failed to load stamps:', e);
    } finally {
      setLoading(false);
    }
  }, [filter, sortBy]);

  useEffect(() => {
    loadStamps();
  }, [loadStamps]);

  const handleFilterChange = (newFilter) => {
    Haptics.selectionAsync().catch(() => {});
    setFilter(newFilter);
  };

  const handleSortChange = () => {
    Haptics.selectionAsync().catch(() => {});
    const currentIndex = SORT_OPTIONS.findIndex((s) => s.id === sortBy);
    const nextIndex = (currentIndex + 1) % SORT_OPTIONS.length;
    setSortBy(SORT_OPTIONS[nextIndex].id);
  };

  const handleStampPress = (stamp) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onStampPress?.(stamp);
  };

  const renderStamp = ({ item }) => (
    <StampItem stamp={item} onPress={handleStampPress} />
  );

  const renderHeader = () => (
    <>
      {/* Stats */}
      {showStats && stats && (
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {stats.totalStamps}
            </Text>
            <Text style={[styles.statLabel, { color: colors.mutedText }]}>
              Stamps
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {stats.totalXP}
            </Text>
            <Text style={[styles.statLabel, { color: colors.mutedText }]}>
              XP
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#F59E0B' }]}>
              {stats.byRarity.legendary || 0}
            </Text>
            <Text style={[styles.statLabel, { color: colors.mutedText }]}>
              Legendary
            </Text>
          </View>
        </View>
      )}

      {/* Filters */}
      {showFilters && (
        <View style={styles.filterRow}>
          <FlatList
            horizontal
            data={FILTER_OPTIONS}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <FilterChip
                option={item}
                isActive={filter === item.id}
                onPress={handleFilterChange}
              />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
          />
          <Pressable style={styles.sortButton} onPress={handleSortChange}>
            <Grid size={14} color={colors.mutedText} strokeWidth={2} />
          </Pressable>
        </View>
      )}
    </>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Sparkles size={32} color={colors.mutedText} strokeWidth={1.5} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        No stamps yet
      </Text>
      <Text style={[styles.emptyText, { color: colors.mutedText }]}>
        Explore content deeply to earn stamps
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={stamps}
        keyExtractor={(item) => item.id}
        renderItem={renderStamp}
        numColumns={numColumns}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={loadStamps}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'flex-start',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    marginBottom: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterList: {
    gap: 6,
    paddingRight: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 0.5,
  },
  filterChipActive: {
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sortButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },
  emptyText: {
    fontSize: 12,
    marginTop: 4,
  },
});
