import React, { useEffect, useState, useMemo } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, FlatList } from 'react-native';
import { Search, X, Clock, TrendingUp } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { STORAGE_KEYS } from '../config/storageKeys';
import { STORAGE_LIMITS } from '../config/constants';

const MAX_HISTORY_ITEMS = STORAGE_LIMITS.MAX_SEARCH_HISTORY;

export function SearchBar({ value, onChangeText, placeholder = 'Search...', onClear, onFocus, onBlur, showHistory = true }) {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

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

  function handleFocus() {
    setIsFocused(true);
    onFocus?.();
  }

  function handleBlur() {
    setIsFocused(false);
    onBlur?.();
  }

  function handleClear() {
    onChangeText?.('');
    onClear?.();
  }

  function selectHistoryItem(item) {
    onChangeText?.(item);
    setIsFocused(false);
  }

  function clearHistory() {
    setSearchHistory([]);
    AsyncStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY).catch(() => {});
  }

  const showHistoryDropdown = showHistory && isFocused && !value && searchHistory.length > 0;

  return (
    <View style={styles.wrapper}>
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
          <Pressable style={styles.clearBtn} onPress={handleClear} accessibilityRole="button" accessibilityLabel="Clear search" accessibilityHint="Double tap to clear search text">
            <X size={16} color={colors.mutedText} strokeWidth={2} />
          </Pressable>
        )}
      </View>

      {showHistoryDropdown && (
        <View style={[styles.historyDropdown, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.historyHeader}>
            <View style={styles.historyHeaderLabel}>
              <Clock size={12} color={colors.mutedText} strokeWidth={2} />
              <Text style={[styles.historyHeaderText, { color: colors.mutedText }]}>Recent Searches</Text>
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
                accessibilityRole="button"
                accessibilityLabel={`Search for ${item}`}
                accessibilityHint="Double tap to search this term"
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
  );
}

export function useSearch(items, searchFields = ['nameEn', 'nameCn']) {
  const [searchHistory, setSearchHistory] = useState([]);

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

  function filterItems(query) {
    if (!query || query.trim() === '') {
      return items;
    }

    const lowerQuery = query.toLowerCase().trim();

    return items.filter((item) => {
      return searchFields.some((field) => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(lowerQuery);
        }
        return false;
      });
    });
  }

  function saveSearchQuery(query) {
    if (!query || query.trim() === '') return;

    const trimmed = query.trim();
    const newHistory = [trimmed, ...searchHistory.filter(h => h !== trimmed)].slice(0, MAX_HISTORY_ITEMS);
    setSearchHistory(newHistory);
    AsyncStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(newHistory)).catch(() => {});
  }

  function getRecommendations(items, limit = 5) {
    // Return popular/frequently searched items based on history
    if (searchHistory.length === 0) {
      // Return first few items as default recommendations
      return items.slice(0, limit);
    }

    // Match history items with actual items
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

    // Fill remaining with default items
    const remaining = items.filter(item => !matched.includes(item)).slice(0, limit - matched.length);
    return [...matched, ...remaining];
  }

  return { filterItems, saveSearchQuery, getRecommendations, searchHistory };
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
    padding: 8,
    marginLeft: 4,
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyDropdown: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    padding: 12,
    ...theme.shadows.subtle,
    zIndex: 20,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  historyHeaderLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  historyHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  clearHistoryText: {
    fontSize: 11,
    fontWeight: '700',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    minHeight: 44,
    borderBottomWidth: 0.5,
  },
  historyItemText: {
    fontSize: 14,
    fontWeight: '500',
  },
});