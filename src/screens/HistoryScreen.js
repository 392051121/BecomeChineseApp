import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, RefreshControl, SafeAreaView, FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Anchor,
  Book,
  Building2,
  Crown,
  Feather,
  Globe,
  Lamp,
  PenTool,
  Route,
  Ruler,
  Scroll,
  Sparkles,
  Swords,
  Waves,
  User,
} from 'lucide-react-native';

import { dynasties } from '../data/dynasties';
import { cities } from '../data/cities';
import { recipes } from '../data/recipes';
import { people } from '../data/people';
import { RelatedPathCard } from '../components/RelatedPathCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';
import { addRecentlyViewed } from '../utils/culturalAssets';
import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

function contributionIcon(iconKey) {
  switch (iconKey) {
    case 'feather': return Feather;
    case 'book': return Book;
    case 'waves': return Waves;
    case 'scroll': return Scroll;
    case 'ruler': return Ruler;
    case 'route': return Route;
    case 'swords': return Swords;
    case 'pen': return PenTool;
    case 'bridge': return Building2;
    case 'lamp': return Lamp;
    case 'globe': return Globe;
    case 'anchor': return Anchor;
    case 'crown': return Crown;
    default: return Sparkles;
  }
}

function getEmperorSections(item) {
  const emperors = item.emperors ?? [];
  switch (item.id) {
    case 'zhou': return [{ key: 'zhou', title: 'Zhou / 周', emperors }];
    case 'han': return [{ key: 'han', title: 'Han / 汉', emperors }];
    case 'jin': return [{ key: 'jin', title: 'Jin / 晋', emperors }];
    case 'song': return [{ key: 'song', title: 'Song / 宋', emperors }];
    default: return [{ key: 'all', title: 'Rulers / 君主', emperors }];
  }
}

export function HistoryScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [expandedSections, setExpandedSections] = useState(() => {
    const initial = {};
    dynasties.forEach((item) => {
      initial[`${item.id}-chapter`] = true;
      initial[`${item.id}-emperors`] = false;
    });
    return initial;
  });
  const [refreshing, setRefreshing] = useState(false);

  const chapterStats = useMemo(() => ({
    total: dynasties.length,
    withRelated: dynasties.filter((item) => {
      const hasCity = cities.some((city) => city.province_id === item.province_id);
      const hasFood = recipes.some((recipe) => recipe.province_id === item.province_id);
      return hasCity || hasFood;
    }).length,
  }), []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setRefreshing(false);
  }, []);

  function toggleSection(sectionKey, item) {
    setExpandedSections((prev) => {
      const newState = { ...prev, [sectionKey]: !prev[sectionKey] };
      // Track view when chapter is opened
      if (newState[sectionKey] && item && sectionKey.endsWith('-chapter')) {
        addRecentlyViewed({
          id: item.id,
          type: 'dynasty',
          nameEn: item.nameEn,
          nameCn: item.nameCn,
          province: item.province_id,
        }).catch(() => {});
      }
      return newState;
    });
  }

  const renderDynastyItem = useMemo(() => {
    return ({ item, index }) => {
      const chapterKey = `${item.id}-chapter`;
      const emperorKey = `${item.id}-emperors`;
      const chapterOpen = expandedSections[chapterKey] ?? true;
      const emperorOpen = expandedSections[emperorKey] ?? false;
      const relatedCity = cities.find((city) => city.province_id === item.province_id);
      const relatedFood = recipes.find((recipe) => recipe.province_id === item.province_id);
      const Icon = contributionIcon(item.contribution?.icon);

      return (
        <SectionCard style={styles.chapterCard} tone={index % 2 === 0 ? 'soft' : 'panel'}>
          <Pressable
            style={styles.chapterHeader}
            onPress={() => toggleSection(chapterKey, item)}
            accessibilityRole="button"
            accessibilityLabel={`${item.nameEn} - ${item.nameCn} dynasty`}
            accessibilityHint={chapterOpen ? "Double tap to collapse chapter" : "Double tap to expand chapter"}
          >
            <Text style={[styles.chapterTitle, { color: colors.text }]}>{item.nameEn}</Text>
            <Text style={[styles.chapterTitleZh, { color: colors.primary }]}>{item.nameCn}</Text>
            <Text style={[styles.cardHint, { color: colors.mutedText }]}>{chapterOpen ? 'Collapse chapter' : 'Open chapter'}</Text>
          </Pressable>

          {chapterOpen ? (
            <View style={styles.chapterBody}>
              <View style={styles.periodRow}>
                <Text style={[styles.periodYears, { color: colors.text }]}>{item.years ?? item.period}</Text>
                <Text style={[styles.periodTagline, { color: colors.mutedText }]}>{item.tagline ?? item.subtitleEn}</Text>
              </View>

              <View style={styles.metaBlock}>
                <Text style={[styles.metaLabel, { color: colors.mutedText }]}>World Context</Text>
                <Text style={[styles.metaText, { color: colors.text }]}>{item.worldContext}</Text>
              </View>

              <View style={styles.contributionRow}>
                <View style={[styles.contributionBadge, { backgroundColor: colors.cinnabarGlow }]}>
                  <Icon size={14} color={colors.primary} strokeWidth={2} />
                </View>
                <View style={styles.contributionTextWrap}>
                  <Text style={[styles.metaLabel, { color: colors.mutedText }]}>Civilization Marker</Text>
                  <Text style={[styles.contributionText, { color: colors.text }]}>{item.contribution?.item}</Text>
                </View>
              </View>

              <View style={styles.metaBlock}>
                <Text style={[styles.metaLabel, { color: colors.mutedText }]}>Chapter Summary</Text>
                <Text style={[styles.legacy, { color: colors.text }]}>{item.legacySummary ?? item.legacy}</Text>
              </View>

              <View style={[styles.relatedCard, { borderColor: colors.border }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Related Paths</Text>
                <Text style={[styles.relatedLead, { color: colors.mutedText }]}>Continue exploring the city and food from the same province.</Text>
                <View style={styles.relatedPathWrap}>
                  {relatedCity ? (
                    <RelatedPathCard
                      label="Place"
                      title={`${relatedCity.nameEn} / ${relatedCity.nameCn}`}
                      hint="Continue"
                      onPress={() => navigation.getParent()?.navigate('Places')}
                    />
                  ) : null}
                  {relatedFood ? (
                    <RelatedPathCard
                      label="Food"
                      title={`${relatedFood.nameEn} / ${relatedFood.nameCn}`}
                      hint="Continue"
                      onPress={() => navigation.getParent()?.navigate('Food')}
                    />
                  ) : null}
                  {!relatedCity && !relatedFood ? <Text style={[styles.relatedText, { color: colors.mutedText }]}>No related paths yet.</Text> : null}
                </View>
              </View>

              <Pressable
                style={styles.sectionToggle}
                onPress={() => toggleSection(emperorKey)}
                accessibilityRole="button"
                accessibilityLabel={emperorOpen ? "Hide rulers" : "Show rulers"}
                accessibilityHint="Double tap to toggle rulers section"
              >
                <Text style={[styles.sectionTitle, { color: colors.text }]}>{getEmperorSections(item)[0].title}</Text>
                <Text style={[styles.sectionToggleText, { color: colors.primary }]}>{emperorOpen ? 'Hide rulers' : 'Show rulers'}</Text>
              </Pressable>
              {emperorOpen ? (
                <View style={styles.emperorList}>
                  {getEmperorSections(item)[0].emperors.map((e, idx) => (
                    <View key={`${item.id}-${idx}-${e.name}`} style={[styles.emperorRow, { borderColor: colors.border }]}>
                      <Text style={[styles.emperorName, { color: colors.text }]}>{e.name}</Text>
                      {e.nameZh ? <Text style={[styles.emperorNameZh, { color: colors.primary }]}>{e.nameZh}</Text> : null}
                      {e.reign ? <Text style={[styles.emperorReign, { color: colors.mutedText }]}>{e.reign}</Text> : null}
                      <Text style={[styles.emperorAch, { color: colors.text }]}>{e.achievement}</Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          ) : null}
        </SectionCard>
      );
    };
  }, [expandedSections, colors, navigation]);

  const ListHeader = useMemo(() => (
    <View style={styles.container}>
      <ScreenHeader
        kicker="History"
        title="Dynasties in Sequence"
        subtitle="Read the chapter first, then continue into the cities and dishes it shaped."
        style={styles.header}
        includeTopInset={false}
      />

      <SectionCard style={styles.storyGuideCard} tone="soft">
        <View style={styles.storyGuideTopRow}>
          <Text style={[styles.storyGuideLabel, { color: colors.primary }]}>Chapter Stream</Text>
          <Text style={[styles.storyGuideBadge, { color: colors.text }]}>{chapterStats.total} chapters</Text>
        </View>
        <Text style={[styles.storyGuideTitle, { color: colors.text }]}>A compact history browser for reading in sequence.</Text>
        <Text style={[styles.storyGuideText, { color: colors.mutedText }]}>Each card is a chapter. Open the chapter, then use related paths as the next step.</Text>
      </SectionCard>

      <View style={styles.sectionSummaryRow}>
        <View style={[styles.sectionSummaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionSummaryValue, { color: colors.text }]}>{chapterStats.total}</Text>
          <Text style={[styles.sectionSummaryLabel, { color: colors.mutedText }]}>Dynasties</Text>
        </View>
        <View style={[styles.sectionSummaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionSummaryValue, { color: colors.text }]}>{chapterStats.withRelated}</Text>
          <Text style={[styles.sectionSummaryLabel, { color: colors.mutedText }]}>With paths</Text>
        </View>
      </View>
    </View>
  ), [chapterStats, colors]);

  const featuredPeople = useMemo(() => people.filter(p => p.isFeatured), []);

  const ListFooter = useMemo(() => (
    <View style={styles.peopleSection}>
      <View style={styles.peopleHeader}>
        <User size={18} color={colors.primary} strokeWidth={2} />
        <Text style={[styles.peopleTitle, { color: colors.text }]}>Notable Figures</Text>
        <Text style={[styles.peopleTitleCn, { color: colors.primary }]}>历史人物</Text>
      </View>
      <Text style={[styles.peopleSubtitle, { color: colors.mutedText }]}>
        Explore influential people throughout Chinese history
      </Text>
      <View style={styles.peopleGrid}>
        {featuredPeople.map((person) => (
          <Pressable
            key={person.id}
            style={[styles.personCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('PersonDetail', { personId: person.id, person })}
            accessibilityRole="button"
            accessibilityLabel={`${person.nameEn} - ${person.nameCn}`}
            accessibilityHint="Double tap to view details"
          >
            <View style={[styles.personIconWrap, { backgroundColor: `${colors.primary}15` }]}>
              <User size={20} color={colors.primary} strokeWidth={2} />
            </View>
            <Text style={[styles.personName, { color: colors.text }]} numberOfLines={1}>{person.nameEn}</Text>
            <Text style={[styles.personNameCn, { color: colors.primary }]} numberOfLines={1}>{person.nameCn}</Text>
            <Text style={[styles.personSubtitle, { color: colors.mutedText }]} numberOfLines={1}>{person.subtitleEn}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  ), [featuredPeople, colors, navigation]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <FlatList
        data={dynasties}
        keyExtractor={(item) => item.id}
        renderItem={renderDynastyItem}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        initialNumToRender={4}
        maxToRenderPerBatch={2}
        windowSize={5}
        removeClippedSubviews
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  listContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 100 },
  container: { marginBottom: 14 },
  header: { marginBottom: 8 },

  // Simplified story guide
  storyGuideCard: { padding: 12, backgroundColor: theme.colors.softCard },
  storyGuideTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  storyGuideLabel: { color: theme.colors.primary, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: '800' },
  storyGuideBadge: { color: theme.colors.text, fontSize: 10, fontWeight: '700' },
  storyGuideTitle: { marginTop: 6, color: theme.colors.text, fontSize: 15, lineHeight: 22, fontWeight: '700' },
  storyGuideText: { marginTop: 4, color: theme.colors.mutedText, fontSize: 12, lineHeight: 18 },

  // Simplified summary row
  sectionSummaryRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  sectionSummaryCard: { flex: 1, borderRadius: theme.radii.md, borderWidth: 0.5, backgroundColor: theme.colors.surface, padding: 12, alignItems: 'center' },
  sectionSummaryValue: { color: theme.colors.text, fontSize: 20, fontWeight: '800' },
  sectionSummaryLabel: { marginTop: 2, color: theme.colors.mutedText, fontSize: 10, fontWeight: '600' },

  // Cleaner chapter card
  chapterCard: { borderRadius: theme.radii.md, overflow: 'hidden' },
  chapterHeader: { padding: 14, backgroundColor: theme.colors.surface },
  chapterTitle: { color: theme.colors.text, fontSize: 22, fontWeight: '800' },
  chapterTitleZh: { marginTop: 2, color: theme.colors.primary, fontSize: 14, fontWeight: '600' },
  cardHint: { marginTop: 4, color: theme.colors.mutedText, fontSize: 10, fontWeight: '600' },

  chapterBody: { padding: 14, gap: 14 },
  periodRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  periodYears: { color: theme.colors.text, fontSize: 13, fontWeight: '700' },
  periodTagline: { color: theme.colors.mutedText, fontSize: 12, flex: 1 },

  metaBlock: { gap: 4 },
  metaLabel: { color: theme.colors.primary, fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  metaText: { color: theme.colors.text, fontSize: 13, lineHeight: 20 },
  legacy: { color: theme.colors.text, fontSize: 14, lineHeight: 22 },

  contributionRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  contributionBadge: { width: 32, height: 32, borderRadius: 8, backgroundColor: theme.colors.cinnabarGlow, alignItems: 'center', justifyContent: 'center' },
  contributionTextWrap: { flex: 1 },
  contributionText: { color: theme.colors.text, fontSize: 13, fontWeight: '600' },

  relatedCard: { borderRadius: theme.radii.sm, borderWidth: 0.5, backgroundColor: theme.colors.surface, padding: 12, gap: 8 },
  relatedLead: { color: theme.colors.mutedText, fontSize: 11 },
  relatedPathWrap: { flexDirection: 'row', gap: 8 },
  relatedText: { color: theme.colors.mutedText, fontSize: 12 },

  sectionToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 },
  sectionTitle: { color: theme.colors.text, fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  sectionToggleText: { color: theme.colors.primary, fontSize: 10, fontWeight: '700' },

  emperorList: { gap: 8 },
  emperorRow: { borderRadius: theme.radii.sm, borderWidth: 0.5, backgroundColor: theme.colors.surface, padding: 10 },
  emperorName: { color: theme.colors.text, fontSize: 12, fontWeight: '700' },
  emperorNameZh: { marginTop: 2, color: theme.colors.primary, fontSize: 14, fontWeight: '600' },
  emperorReign: { marginTop: 2, color: theme.colors.mutedText, fontSize: 10 },
  emperorAch: { marginTop: 4, color: theme.colors.text, fontSize: 12, lineHeight: 18 },

  // People section
  peopleSection: { marginTop: 24, marginBottom: 20 },
  peopleHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  peopleTitle: { fontSize: 18, fontWeight: '800', marginLeft: 4 },
  peopleTitleCn: { fontSize: 13, fontWeight: '600', marginLeft: 6 },
  peopleSubtitle: { fontSize: 12, marginBottom: 12 },
  peopleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  personCard: { width: '48%', borderRadius: theme.radii.md, borderWidth: 0.5, padding: 12, alignItems: 'center' },
  personIconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  personName: { fontSize: 13, fontWeight: '700', textAlign: 'center' },
  personNameCn: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  personSubtitle: { fontSize: 10, marginTop: 4, textAlign: 'center' },
});
