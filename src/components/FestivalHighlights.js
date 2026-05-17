/**
 * Festival Highlights Component
 *
 * Displays featured content during festivals and upcoming events.
 */

import React, { memo, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Sparkles, Utensils, MapPin, ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { SectionCard } from './SectionCard';
import { getUpcomingFestivals, getFestivalContent } from '../utils/solarTermContent';

const FestivalItem = memo(function FestivalItem({ item, onPress }) {
  const { colors } = useTheme();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress?.(item);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.festivalItem,
        { borderColor: colors.border },
        pressed && styles.festivalItemPressed,
      ]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`${item.festival.nameEn} - ${item.festival.nameCn}`}
    >
      <View style={styles.festivalHeader}>
        <View style={styles.festivalIcon}>
          <Sparkles size={14} color={colors.primary} strokeWidth={2} />
        </View>
        <View style={styles.festivalNameWrap}>
          <Text style={styles.festivalNameCn}>{item.festival.nameCn}</Text>
          <Text style={[styles.festivalNameEn, { color: colors.mutedText }]}>
            {item.festival.nameEn}
          </Text>
        </View>
        <ChevronRight size={16} color={colors.mutedText} strokeWidth={2} />
      </View>

      <Text style={[styles.festivalSummary, { color: colors.text }]} numberOfLines={2}>
        {item.festival.summaryEn}
      </Text>

      <View style={styles.festivalMeta}>
        {item.recipes.length > 0 && (
          <View style={styles.metaItem}>
            <Utensils size={12} color={colors.primary} strokeWidth={2} />
            <Text style={[styles.metaText, { color: colors.mutedText }]}>
              {item.recipes.length} dishes
            </Text>
          </View>
        )}
        {item.cities.length > 0 && (
          <View style={styles.metaItem}>
            <MapPin size={12} color={colors.primary} strokeWidth={2} />
            <Text style={[styles.metaText, { color: colors.mutedText }]}>
              {item.cities.length} cities
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
});

export const FestivalHighlights = memo(function FestivalHighlights({ onPress, maxItems = 2 }) {
  const { colors } = useTheme();
  const [festivalContent, setFestivalContent] = useState([]);

  useEffect(() => {
    const content = getFestivalContent();
    setFestivalContent(content.slice(0, maxItems));
  }, [maxItems]);

  if (festivalContent.length === 0) return null;

  return (
    <SectionCard style={styles.container} tone="panel">
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <Sparkles size={14} color={colors.primary} strokeWidth={2} />
          <Text style={[styles.title, { color: colors.primary }]}>Upcoming Festivals</Text>
          <Text style={[styles.titleCn, { color: colors.mutedText }]}>节日</Text>
        </View>
      </View>

      <FlatList
        data={festivalContent}
        keyExtractor={(item) => item.festival.id}
        renderItem={({ item }) => <FestivalItem item={item} onPress={onPress} />}
        scrollEnabled={false}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SectionCard>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  titleCn: {
    fontSize: 10,
    fontWeight: '600',
  },
  list: {
    gap: 0,
  },
  separator: {
    height: 10,
  },
  festivalItem: {
    padding: 12,
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    backgroundColor: theme.colors.surface,
  },
  festivalItemPressed: {
    opacity: 0.9,
  },
  festivalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  festivalIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: theme.colors.cinnabarGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  festivalNameWrap: {
    flex: 1,
  },
  festivalNameCn: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  festivalNameEn: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  festivalSummary: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 8,
  },
  festivalMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
