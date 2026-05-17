import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, FlatList, Animated, Easing, Platform, ScrollView } from 'react-native';
import { Search, X, Clock, TrendingUp, Mic, Filter, ChevronDown, Check } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { STORAGE_KEYS } from '../config/storageKeys';
import { STORAGE_LIMITS } from '../config/constants';

const MAX_HISTORY_ITEMS = STORAGE_LIMITS.MAX_SEARCH_HISTORY;

// Search category filters
const SEARCH_CATEGORIES = [
  { id: 'all', label: 'All', labelCn: '全部' },
  { id: 'city', label: 'Cities', labelCn: '城市' },
  { id: 'recipe', label: 'Food', labelCn: '美食' },
  { id: 'dynasty', label: 'Dynasties', labelCn: '朝代' },
  { id: 'person', label: 'People', labelCn: '人物' },
];

// Trending/hot searches - can be customized based on season or popularity
const TRENDING_SEARCHES = [
  { id: 't1', text: 'Beijing', textCn: '北京', category: 'city' },
  { id: 't2', text: 'Tang Dynasty', textCn: '唐朝', category: 'dynasty' },
  { id: 't3', text: 'Dumplings', textCn: '饺子', category: 'recipe' },
  { id: 't4', text: 'Sichuan', textCn: '四川', category: 'city' },
  { id: 't5', text: 'Li Bai', textCn: '李白', category: 'person' },
  { id: 't6', text: 'Hot Pot', textCn: '火锅', category: 'recipe' },
];

// Enhanced Search Bar with trending, categories, and voice search
export function EnhancedSearchBar({
  value,
  onChangeText,
  placeholder = 'Search...',
  onClear,
  onFocus,
  onBlur,
  onVoiceSearch,
  onCategoryChange,
  showHistory = true,
  showTrending = true,
  showCategories = true,
  showVoice = true,
}) {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const dropdownAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showHistory) {
      AsyncStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY).then((saved) => {
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setSearchHistory(parsed.slice(0, MAX_HISTORY_ITEMS));
          } catch {
            setSearchHistory([]);
          }
        }
      }).catch(() => {});
    }
  }, [showHistory]);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    setShowCategoryDropdown(false);
    onBlur?.();
  };

  const handleClear = () => {
    onChangeText?.('');
    onClear?.();
  };

  const selectHistoryItem = (item) => {
    onChangeText?.(item);
    setIsFocused(false);
  };

  const selectTrendingItem = (item) => {
    onChangeText?.(item.text);
    setIsFocused(false);
  };

  const clearHistory = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setSearchHistory([]);
    AsyncStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY).catch(() => {});
  };

  const selectCategory = (categoryId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setSelectedCategory(categoryId);
    onCategoryChange?.(categoryId);
    setShowCategoryDropdown(false);
  };

  const toggleCategoryDropdown = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setShowCategoryDropdown(!showCategoryDropdown);
  };

  const handleVoiceSearch = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onVoiceSearch?.();
  };

  const showDropdown = isFocused && !value;

  return (
    <View style={styles.wrapper}>
      {/* Main Search Input */}
      <View style={[styles.container, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <View style={styles.searchIcon}>
          <Search size={18} color={colors.mutedText} strokeWidth={2} />
        </View>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedText}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={handleFocus}
          onBlur={handleBlur}
          accessibilityLabel={placeholder}
          accessibilityRole="search"
        />
        {value && value.length > 0 && (
          <Pressable style={styles.clearBtn} onPress={handleClear} accessibilityRole="button" accessibilityLabel="Clear search">
            <X size={16} color={colors.mutedText} strokeWidth={2} />
          </Pressable>
        )}
        {showVoice && (
          <Pressable style={styles.voiceBtn} onPress={handleVoiceSearch} accessibilityRole="button" accessibilityLabel="Voice search">
            <Mic size={18} color={colors.primary} strokeWidth={2} />
          </Pressable>
        )}
      </View>

      {/* Category Filter Bar */}
      {showCategories && (
        <View style={styles.categoryBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {SEARCH_CATEGORIES.map((cat) => (
              <Pressable
                key={cat.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === cat.id && styles.categoryChipActive,
                  { borderColor: selectedCategory === cat.id ? colors.primary : colors.border },
                  { backgroundColor: selectedCategory === cat.id ? colors.cinnabarGlow : colors.surface },
                ]}
                onPress={() => selectCategory(cat.id)}
              >
                <Text style={[
                  styles.categoryChipText,
                  { color: selectedCategory === cat.id ? colors.primary : colors.mutedText },
                ]}>
                  {cat.label}
                </Text>
                <Text style={[
                  styles.categoryChipTextCn,
                  { color: selectedCategory === cat.id ? colors.primary : colors.mutedText },
                ]}>
                  {cat.labelCn}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Dropdown with History & Trending */}
      {showDropdown && (
        <View style={[styles.dropdown, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* Trending Searches */}
          {showTrending && TRENDING_SEARCHES.length > 0 && (
            <View style={styles.dropdownSection}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionHeaderLabel}>
                  <TrendingUp size={12} color={colors.primary} strokeWidth={2} />
                  <Text style={[styles.sectionHeaderText, { color: colors.primary }]}>Trending</Text>
                  <Text style={[styles.sectionHeaderTextCn, { color: colors.primary }]}>热门</Text>
                </View>
              </View>
              <View style={styles.trendingGrid}>
                {TRENDING_SEARCHES.slice(0, 6).map((item) => (
                  <Pressable
                    key={item.id}
                    style={[styles.trendingItem, { borderColor: colors.border }]}
                    onPress={() => selectTrendingItem(item)}
                  >
                    <Text style={[styles.trendingText, { color: colors.text }]}>{item.text}</Text>
                    <Text style={[styles.trendingTextCn, { color: colors.primary }]}>{item.textCn}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Search History */}
          {showHistory && searchHistory.length > 0 && (
            <View style={styles.dropdownSection}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionHeaderLabel}>
                  <Clock size={12} color={colors.mutedText} strokeWidth={2} />
                  <Text style={[styles.sectionHeaderText, { color: colors.mutedText }]}>Recent</Text>
                  <Text style={[styles.sectionHeaderTextCn, { color: colors.mutedText }]}>历史</Text>
                </View>
                <Pressable onPress={clearHistory} accessibilityRole="button" accessibilityLabel="Clear history">
                  <Text style={[styles.clearHistoryText, { color: colors.primary }]}>Clear</Text>
                </Pressable>
              </View>
              <FlatList
                data={searchHistory}
                keyExtractor={(item, index) => `${item}-${index}`}
                renderItem={({ item }) => (
                  <Pressable
                    style={[styles.historyItem, { borderBottomColor: colors.border }]}
                    onPress={() => selectHistoryItem(item)}
                  >
                    <Clock size={14} color={colors.mutedText} strokeWidth={2} />
                    <Text style={[styles.historyItemText, { color: colors.text }]}>{item}</Text>
                  </Pressable>
                )}
                scrollEnabled={false}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
}

// Hook for enhanced search with category filtering
export function useEnhancedSearch(items, searchFields = ['nameEn', 'nameCn']) {
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY).then((saved) => {
      if (saved) {
        try {
          setSearchHistory(JSON.parse(saved).slice(0, MAX_HISTORY_ITEMS));
        } catch {
          setSearchHistory([]);
        }
      }
    }).catch(() => {});
  }, []);

  const filterItems = useCallback((query, category = 'all') => {
    let filtered = items;

    // Filter by category first
    if (category !== 'all') {
      filtered = items.filter((item) => item.type === category);
    }

    // Then filter by search query
    if (query && query.trim() !== '') {
      const lowerQuery = query.toLowerCase().trim();
      filtered = filtered.filter((item) => {
        return searchFields.some((field) => {
          const value = item[field];
          return typeof value === 'string' && value.toLowerCase().includes(lowerQuery);
        });
      });
    }

    return filtered;
  }, [items, searchFields]);

  const saveSearchQuery = (query) => {
    if (!query || query.trim() === '') return;

    const trimmed = query.trim();
    const newHistory = [trimmed, ...searchHistory.filter(h => h !== trimmed)].slice(0, MAX_HISTORY_ITEMS);
    setSearchHistory(newHistory);
    AsyncStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(newHistory)).catch(() => {});
  };

  const getRecommendations = (limit = 5) => {
    if (searchHistory.length === 0) {
      return items.slice(0, limit);
    }

    const matched = [];
    for (const historyItem of searchHistory) {
      const found = items.find(item =>
        searchFields.some(field => {
          const value = item[field];
          return typeof value === 'string' && value.toLowerCase().includes(historyItem.toLowerCase());
        })
      );
      if (found && !matched.includes(found)) {
        matched.push(found);
      }
    }

    const remaining = items.filter(item => !matched.includes(item)).slice(0, limit - matched.length);
    return [...matched, ...remaining];
  };

  return {
    filterItems,
    saveSearchQuery,
    getRecommendations,
    searchHistory,
    selectedCategory,
    setSelectedCategory,
  };
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    zIndex: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 6,
    marginLeft: 4,
  },
  voiceBtn: {
    padding: 8,
    marginLeft: 4,
    backgroundColor: theme.colors.cinnabarGlow,
    borderRadius: 999,
  },

  // Category Bar
  categoryBar: {
    marginTop: 10,
  },
  categoryScroll: {
    gap: 8,
    paddingRight: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 0.5,
  },
  categoryChipActive: {
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  categoryChipTextCn: {
    fontSize: 10,
    fontWeight: '600',
    opacity: 0.8,
  },

  // Dropdown
  dropdown: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    padding: 12,
    ...theme.shadows.medium,
    zIndex: 20,
  },
  dropdownSection: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionHeaderLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sectionHeaderTextCn: {
    fontSize: 10,
    fontWeight: '600',
    opacity: 0.8,
  },
  clearHistoryText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Trending
  trendingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 0.5,
    backgroundColor: theme.colors.surface,
  },
  trendingText: {
    fontSize: 12,
    fontWeight: '600',
  },
  trendingTextCn: {
    fontSize: 10,
    fontWeight: '500',
  },

  // History
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  historyItemText: {
    fontSize: 14,
    fontWeight: '500',
  },
});