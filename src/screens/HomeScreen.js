import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { CalendarDays, Clock, Map, Sparkles, User, UtensilsCrossed } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import { getCultureRank, getCulturalAssets } from '../utils/culturalAssets';
import { theme } from '../theme/theme';

const quickActions = [
  { id: 'calendar', label: 'Seasons', cn: '时令', icon: CalendarDays, target: 'Seasons' },
  { id: 'history', label: 'History', cn: '历史', icon: Clock, target: 'History' },
  { id: 'food', label: 'Food', cn: '饮食', icon: UtensilsCrossed, target: 'Food' },
  { id: 'travel', label: 'Places', cn: '地方', icon: Map, target: 'Places' },
  { id: 'me', label: 'Profile', cn: '我的画像', icon: User, target: 'Profile' },
];

export function HomeScreen() {
  const navigation = useNavigation();
  const [assets, setAssets] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const next = await getCulturalAssets().catch(() => null);
      if (!cancelled) setAssets(next);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const streak = assets?.quiz?.streak ?? 0;
  const solved = assets?.quiz?.totalSolved ?? 0;
  const provinces = new Set([
    ...(assets?.favorites?.cities ?? []).map((item) => item?.province).filter(Boolean),
    ...(assets?.favorites?.recipes ?? []).map((item) => item?.province).filter(Boolean),
    ...(assets?.favorites?.dynasties ?? []).map((item) => item?.province).filter(Boolean),
  ]);
  const connected = provinces.size;
  const rank = getCultureRank(connected);
  const recentCity = assets?.favorites?.cities?.[0];
  const recentRecipe = assets?.favorites?.recipes?.[0];
  const recentDynasty = assets?.favorites?.dynasties?.[0];
  const recentPick = recentCity?.nameEn ?? recentRecipe?.nameEn ?? recentDynasty?.nameEn ?? 'No recent pick';
  const recentPickCn = recentCity?.nameCn ?? recentRecipe?.nameZh ?? recentDynasty?.nameCn ?? '暂无收藏';
  const todayBlurb = recentCity?.tagline ?? recentRecipe?.culturalStory ?? recentDynasty?.tagline ?? 'Explore a China-only cultural path through seasons, history, food, places, and personal notes.';
  const todayBlurbCn = recentCity?.chineseDescription ?? recentRecipe?.culturalContext ?? recentDynasty?.legacySummary ?? '围绕中国文化主线展开的双语内容。';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <Text style={styles.kicker}>China Culture Atlas</Text>
          <View style={styles.brandPill}>
            <Text style={styles.brandPillText}>English-first bilingual</Text>
          </View>
        </View>

        <Text style={styles.title}>A quiet atlas of Chinese culture.</Text>
        <Text style={styles.subtitle}>Explore China through seasons, history, food, and places — with Chinese names and notes included.</Text>
        <View style={styles.titleDivider} />

        <Pressable style={styles.primaryCard} onPress={() => navigation.navigate('Seasons')}>
          <Text style={styles.primaryCardLabel}>Today’s Season</Text>
          <Text style={styles.primaryCardTitle}>Open today’s China culture prompt</Text>
          <Text style={styles.primaryCardText}>{todayBlurb}</Text>
          <Text style={styles.primaryCardTextCn}>{todayBlurbCn}</Text>
        </Pressable>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Streak</Text>
            <Text style={styles.statValue}>{streak}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Solved</Text>
            <Text style={styles.statValue}>{solved}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Level</Text>
            <Text style={styles.statValueSmall}>{rank}</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Today’s Clue</Text>
          <Text style={styles.sectionTitle}>Recent pick: {recentPick}</Text>
          <Text style={styles.sectionTitleCn}>{recentPickCn}</Text>
          <View style={styles.heroRow}>
            <View style={styles.heroChip}><Text style={styles.heroChipText}>Regions {connected}</Text></View>
            <View style={styles.heroChip}><Text style={styles.heroChipText}>Solved {solved}</Text></View>
            <View style={styles.heroChip}><Text style={styles.heroChipText}>Level {rank}</Text></View>
          </View>
          <View style={styles.heroBottomRow}>
            <Sparkles size={16} color={theme.colors.primary} />
            <Text style={styles.heroBottomText}>Keep collecting China cultural clues and build your personal atlas.</Text>
          </View>
        </View>

        <View style={styles.grid}>
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Pressable key={action.id} style={styles.actionCard} onPress={() => navigation.navigate(action.target)}>
                <Icon size={18} color={theme.colors.primary} strokeWidth={2} />
                <Text style={styles.actionText}>{action.label}</Text>
                <Text style={styles.actionTextCn}>{action.cn}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  kicker: { color: theme.colors.primary, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: '800' },
  brandPill: { borderRadius: 999, borderWidth: 0.5, borderColor: theme.colors.border, backgroundColor: theme.colors.card, paddingHorizontal: 10, paddingVertical: 5 },
  brandPillText: { color: theme.colors.mutedText, fontSize: 10, fontWeight: '800', letterSpacing: 1.6 },
  title: { marginTop: 12, color: theme.colors.text, fontSize: 28, lineHeight: 36, fontWeight: '700', maxWidth: 280 },
  subtitle: { marginTop: 8, color: theme.colors.mutedText, lineHeight: 20.8, fontSize: 13 },
  titleDivider: { marginTop: 14, height: 0.5, backgroundColor: theme.colors.border },
  primaryCard: { marginTop: 16, borderWidth: 0.5, borderColor: theme.colors.primary, backgroundColor: '#FBF7F1', borderRadius: 4, padding: 14 },
  primaryCardLabel: { color: theme.colors.primary, fontSize: 11, letterSpacing: 1.8, textTransform: 'uppercase', fontWeight: '800' },
  primaryCardTitle: { marginTop: 6, color: theme.colors.text, fontSize: 18, lineHeight: 26, fontWeight: '700' },
  primaryCardText: { marginTop: 6, color: theme.colors.mutedText, fontSize: 12, lineHeight: 18.4 },
  primaryCardTextCn: { marginTop: 6, color: theme.colors.text, fontSize: 12, lineHeight: 18.4, opacity: 0.75 },
  sectionTitleCn: { marginTop: 4, color: theme.colors.mutedText, fontSize: 12, lineHeight: 18.4 },
  statsRow: { flexDirection: 'row', alignItems: 'stretch', marginTop: 14 },
  statCard: { flex: 1, borderWidth: 0.5, borderColor: theme.colors.border, backgroundColor: theme.colors.card, padding: 12, borderRadius: 4 },
  statLabel: { color: theme.colors.mutedText, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: '800' },
  statLabelCn: { color: theme.colors.mutedText, fontSize: 10, letterSpacing: 1.2, fontWeight: '700' },
  statDivider: { width: 0.5, height: 26, backgroundColor: theme.colors.border, alignSelf: 'center' },
  statValue: { marginTop: 6, color: theme.colors.text, fontSize: 22, fontWeight: '700' },
  statValueSmall: { marginTop: 6, color: theme.colors.text, fontSize: 12, fontWeight: '700' },
  sectionCard: { marginTop: 14, borderWidth: 0.5, borderColor: theme.colors.border, backgroundColor: theme.colors.card, borderRadius: 4, padding: 14, minHeight: 132 },
  sectionLabel: { color: theme.colors.primary, fontSize: 11, letterSpacing: 1.8, textTransform: 'uppercase', fontWeight: '800' },
  sectionTitle: { marginTop: 6, color: theme.colors.text, fontSize: 18, lineHeight: 26, fontWeight: '700' },
  heroRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  heroChip: { borderRadius: 999, borderWidth: 0.5, borderColor: theme.colors.border, backgroundColor: theme.colors.background, paddingHorizontal: 10, paddingVertical: 6 },
  heroChipText: { color: theme.colors.text, fontSize: 11, fontWeight: '700' },
  heroBottomRow: { marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  heroBottomText: { color: theme.colors.mutedText, fontSize: 12, flex: 1 },
  grid: { marginTop: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  actionCard: { width: '48%', borderWidth: 0.5, borderColor: theme.colors.border, backgroundColor: theme.colors.card, borderRadius: 4, padding: 14, minHeight: 82, justifyContent: 'space-between' },
  actionText: { color: theme.colors.text, fontSize: 14, fontWeight: '700' },
  actionTextCn: { marginTop: 4, color: theme.colors.mutedText, fontSize: 11, fontWeight: '600' },
});
