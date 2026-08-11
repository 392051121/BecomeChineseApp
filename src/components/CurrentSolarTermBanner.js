/**
 * Current Solar Term Banner Component
 *
 * Displays the current solar term on the home screen with
 * seasonal styling and content recommendations.
 */

import React, { memo, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Sparkles, Calendar, MapPin } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { SectionCard } from './SectionCard';
import {
  getCurrentSolarTerm,
  getCurrentSeason,
  getSeasonalColors,
  getFestivalBonus,
} from '../utils/solarTermContent';

export const CurrentSolarTermBanner = memo(function CurrentSolarTermBanner({ onPress }) {
  const { colors } = useTheme();
  const [solarTerm, setSolarTerm] = useState(null);
  const [seasonColors, setSeasonColors] = useState(null);
  const [festivalBonus, setFestivalBonus] = useState(null);

  useEffect(() => {
    const term = getCurrentSolarTerm();
    const seasonStyle = getSeasonalColors();
    const bonus = getFestivalBonus();

    setSolarTerm(term);
    setSeasonColors(seasonStyle);
    setFestivalBonus(bonus);
  }, []);

  if (!solarTerm) return null;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress?.(solarTerm);
  };

  return (
    <SectionCard
      style={[
        styles.container,
        festivalBonus?.isFestival && styles.festivalContainer,
      ]}
      tone="soft"
    >
      <Pressable
        style={styles.content}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`Current solar term: ${solarTerm.nameEn}`}
      >
        <View style={styles.header}>
          <View style={styles.iconWrap}>
            <Calendar size={16} color={colors.primary} strokeWidth={2} />
          </View>
          <View style={styles.titleWrap}>
            <Text style={styles.label}>Current Solar Term</Text>
            <Text style={styles.labelCn}>当前节气</Text>
          </View>
          {festivalBonus?.isFestival && (
            <View style={styles.festivalBadge}>
              <Sparkles size={12} color="#F59E0B" strokeWidth={2} />
              <Text style={styles.festivalText}>Festival</Text>
            </View>
          )}
        </View>

        <View style={styles.termInfo}>
          <Text style={styles.termNameEn}>{solarTerm.nameEn}</Text>
          <Text style={styles.termNameCn}>{solarTerm.nameCn}</Text>
        </View>

        <Text style={styles.termSummary} numberOfLines={2}>
          {solarTerm.summaryEn}
        </Text>

        <View style={styles.footer}>
          <View style={styles.dateInfo}>
            <MapPin size={12} color={colors.mutedText} strokeWidth={2} />
            <Text style={styles.dateText}>{solarTerm.dateInfo}</Text>
          </View>
          <Text style={styles.seasonText}>
            {seasonColors?.text || '·'}
          </Text>
        </View>
      </Pressable>
    </SectionCard>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 0,
    overflow: 'hidden',
  },
  festivalContainer: {
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  content: {
    padding: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: theme.colors.cinnabarGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  titleWrap: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  labelCn: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.mutedText,
    marginTop: 1,
  },
  festivalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  festivalText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#F59E0B',
  },
  termInfo: {
    marginBottom: 8,
  },
  termNameEn: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.3,
    color: theme.colors.text,
  },
  termNameCn: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 3,
    color: theme.colors.primary,
    marginTop: 2,
  },
  termSummary: {
    fontSize: 12,
    lineHeight: 18,
    color: theme.colors.text,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 11,
    color: theme.colors.mutedText,
  },
  seasonText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.primary,
    opacity: 0.6,
  },
});
