import React, { useMemo, useEffect, useRef } from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { ArrowLeft, BadgeInfo, BookOpen, Sparkles, Users, Crown, MapPin, UtensilsCrossed, Scroll, Share2 } from 'lucide-react-native';

import { dynasties } from '../data/dynasties';
import { SmartImageBlock } from '../components/SmartImageBlock';
import { getLocalImage } from '../assets/localImages';
import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { HandscrollContainer } from '../components/HandscrollContainer';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';
import { LinkedConceptText } from '../components/LinkedConceptText';
import { DetailHeader } from '../components/DetailHeader';
import { PaperTexture } from '../components/PaperTexture';
import { getDynastyHeartlandProvinces } from '../data/relations';
import { normalizeProvinceId } from '../utils/provinceIds';
import { cities } from '../data/cities';
import { recipes } from '../data/recipes';
import { people } from '../data/people';
import { shareText, generateDynastyShareText } from '../utils/sharing';
import { earnStamp } from '../utils/stampCollection';
import { trackViewedItem } from '../utils/explorationStats';
import { useReadingPosition } from '../hooks/useReadingPosition';
import { navigateApp } from '../utils/navigation';

// Build a lookup so famousPeople entries can resolve to real people.js records.
const peopleByName = new Map();
people.forEach((p) => {
  if (p.nameCn) peopleByName.set(p.nameCn.trim(), p);
  if (p.nameEn) peopleByName.set(p.nameEn.trim().toLowerCase(), p);
  if (p.subtitleCn) peopleByName.set(`sub:${p.subtitleCn.trim()}`, p);
});

function resolveFamousPerson(entry) {
  if (!entry) return null;
  return (
    peopleByName.get(entry.nameCn?.trim()) ??
    peopleByName.get(entry.name?.trim()?.toLowerCase()) ??
    null
  );
}

export function DynastyDetailScreen({ route, navigation }) {
  const { colors } = useTheme();
  const dynastyId = route?.params?.dynastyId;
  const dynasty = useMemo(() => {
    if (!dynastyId) return dynasties[0] ?? null;
    return dynasties.find((item) => item.id === dynastyId) ?? null;
  }, [dynastyId]);

  const scrollRef = useRef(null);
  const { savedOffset, onScroll, restore } = useReadingPosition(
    dynasty?.id ? `dynasty:${dynasty.id}` : ''
  );
  useEffect(() => {
    if (!(savedOffset > 0)) return;
    const t = setTimeout(() => restore(scrollRef), 60);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedOffset, dynasty?.id]);

  const speakTerm = (text) => {
    if (!text) return;
    Haptics.selectionAsync().catch(() => {});
    Speech.speak(String(text), { language: 'en-US', rate: 0.92, pitch: 0.96 });
  };

  const handleShare = async () => {
    Haptics.selectionAsync().catch(() => {});
    const shareTextContent = generateDynastyShareText({
      nameCn: dynasty?.nameCn,
      nameEn: dynasty?.nameEn,
      period: dynasty?.years,
      tagline: dynasty?.tagline,
      contribution: dynasty?.contribution,
    });
    await shareText(shareTextContent, `Share ${dynasty?.nameEn} Dynasty`);
  };

  const sections = useMemo(() => {
    const emperors = dynasty?.emperors ?? [];
    switch (dynasty?.id) {
      case 'zhou':
        return [
          { key: 'western-zhou', title: 'Western Zhou', emperors: emperors.slice(0, 13) },
          { key: 'eastern-zhou', title: 'Eastern Zhou', emperors: emperors.slice(13) },
        ];
      case 'han':
        return [
          { key: 'western-han', title: 'Western Han', emperors: emperors.slice(0, 13) },
          { key: 'eastern-han', title: 'Eastern Han', emperors: emperors.slice(13) },
        ];
      case 'jin':
        return [
          { key: 'western-jin', title: 'Western Jin', emperors: emperors.slice(0, 4) },
          { key: 'eastern-jin', title: 'Eastern Jin', emperors: emperors.slice(4) },
        ];
      case 'song':
        return [
          { key: 'northern-song', title: 'Northern Song', emperors: emperors.slice(0, 9) },
          { key: 'southern-song', title: 'Southern Song', emperors: emperors.slice(9) },
        ];
      default:
        return [{ key: 'all', title: 'Dynasty Rulers', emperors }];
    }
  }, [dynasty]);

  // Multi-province heartland for the connection map (curated + province relations).
  // Union attached field + relation lookup so neither empty path wins alone.
  const heartlandList = useMemo(() => {
    if (!dynasty?.id) return [];
    const attached = Array.isArray(dynasty?.heartlandProvinces) ? dynasty.heartlandProvinces : [];
    const fromRelations = getDynastyHeartlandProvinces(
      dynasty.id,
      dynasty.provinceId || dynasty.province_id || dynasty.province
    );
    const capital = dynasty.provinceId || dynasty.province_id || dynasty.province;
    const raw = [...attached, ...fromRelations, capital].filter(Boolean);
    // Normalize ids so they always match chinaGeo.json (drop General / junk)
    const seen = new Set();
    const out = [];
    raw.forEach((id) => {
      const n = normalizeProvinceId(id);
      if (n && !seen.has(n)) {
        seen.add(n);
        out.push(n);
      }
    });
    return out;
  }, [dynasty?.id, dynasty?.heartlandProvinces, dynasty?.provinceId, dynasty?.province_id, dynasty?.province]);

  const heartlandLabel = useMemo(() => heartlandList.join(' · '), [heartlandList]);

  // Track exploration with capital province only. Full heartland lights up on the
  // educational Heartland map below and when the user saves the dynasty — browsing
  // every detail should not flood Profile Atlas with ~half of China.
  useEffect(() => {
    if (!dynasty?.id) return;

    trackViewedItem('dynasty', {
      id: dynasty.id,
      province_id: dynasty.province_id || dynasty.provinceId,
      provinceId: dynasty.provinceId || dynasty.province_id,
      province: dynasty.province_id || dynasty.provinceId || dynasty.province,
    }).catch(() => {});

    const timeoutId = setTimeout(async () => {
      await earnStamp('dynasty', dynasty, {
        viewTimeMs: 3000,
        scrollDepth: 0.7,
        interactions: 1,
        expanded: true,
      });
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [dynasty?.id, dynasty?.province_id, dynasty?.provinceId, dynasty?.province]);

  if (!dynasty) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <DetailHeader onBack={() => navigation.goBack()} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Dynasty not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <DetailHeader
        title="Dynasty Detail"
        onBack={() => navigation.goBack()}
        onShare={handleShare}
        shareLabel="Share this dynasty"
      />
      <HandscrollContainer
        scrollRef={scrollRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
        initialScrollOffset={savedOffset > 0 ? savedOffset : 0}
      >
        <View style={styles.content}>
          <ScreenHeader
            kicker={dynasty?.years ?? 'Dynasty'}
            title={dynasty?.nameEn ?? 'Dynasty'}
            subtitle={dynasty?.tagline ?? ''}
            style={styles.header}
            includeTopInset={false}
          />
          <SectionCard style={styles.hero}>
            <PaperTexture intensity="light" />
            <SmartImageBlock
              source={getLocalImage('dynasties', dynasty.imageAsset)}
              uri={dynasty.image}
              label={dynasty.imagePlaceholderText}
              style={styles.heroImage}
              overlayOpacity={0.12}
            />
            <View style={styles.heroMeta}>
              <Text style={styles.dynastyName}>{dynasty.nameCn}</Text>
              <Text style={styles.dynastyNameEn}>{dynasty.nameEn} Dynasty</Text>
              <Text style={styles.period}>{dynasty.years}</Text>
            </View>
          </SectionCard>

          <SectionCard style={styles.card}>
            <View style={styles.sectionHeader}>
              <MapPin size={14} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>Heartland · 核心疆域</Text>
            </View>
            <Text style={styles.sectionHint}>
              Core regions · 核心省区:{' '}
              {heartlandLabel || dynasty.provinceId || dynasty.province_id || dynasty.province || '—'}
            </Text>
            {heartlandList.length > 0 ? (
              <View style={styles.provincePills}>
                {heartlandList.map((provinceId) => (
                  <View key={provinceId} style={styles.provincePill}>
                    <Text style={styles.provincePillText}>{provinceId}</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </SectionCard>

          <SectionCard style={styles.card}>
            <View style={styles.sectionHeader}>
              <BadgeInfo size={14} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>Timeline · 时间线</Text>
            </View>
            <LinkedConceptText text={dynasty.worldContext} style={styles.sectionText} />
            <View style={styles.miniTimeline}>
              <Text style={styles.timelineLabel}>Start</Text>
              <View style={styles.timelineLine} />
              <Text style={styles.timelineLabel}>End</Text>
            </View>
            <LinkedConceptText text={dynasty.legacy} style={styles.sectionTextMuted} />
          </SectionCard>

          <SectionCard style={styles.card}>
            <View style={styles.sectionHeader}>
              <BookOpen size={14} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>Rulers · 统治者</Text>
            </View>
            {sections.map((section) => (
              <View key={section.key} style={styles.subSection}>
                <Text style={styles.subSectionTitle}>{section.title}</Text>
                {section.emperors.map((e, index) => (
                  <View key={`${section.key}-${index}-${e.name}`} style={styles.emperorRow}>
                    <Text style={styles.emperorName}>{e.name}</Text>
                    {e.nameZh ? <Text style={styles.emperorZh}>{e.nameZh}</Text> : null}
                    {e.reign ? <Text style={styles.emperorReign}>{e.reign}</Text> : null}
                    <Text style={styles.emperorAch}>{e.achievement}</Text>
                  </View>
                ))}
              </View>
            ))}
          </SectionCard>

          {/* Famous People Section */}
          {dynasty.famousPeople && dynasty.famousPeople.length > 0 && (
            <SectionCard style={styles.card}>
              <View style={styles.sectionHeader}>
                <Users size={14} color={theme.colors.primary} />
                <Text style={styles.sectionTitle}>Notable Figures · 著名人物</Text>
              </View>
              <Text style={styles.sectionHint}>Key personalities who shaped this era</Text>
              {dynasty.famousPeople.map((person, idx) => {
                const matched = resolveFamousPerson(person);
                const disabled = !matched;
                return (
                  <Pressable
                    key={`person-${idx}`}
                    style={({ pressed }) => [
                      styles.personRow,
                      !disabled && pressed && { opacity: 0.6 },
                    ]}
                    onPress={
                      disabled
                        ? undefined
                        : () => navigation.navigate('PersonDetail', { personId: matched.id })
                    }
                    disabled={disabled}
                    accessibilityRole={disabled ? undefined : 'button'}
                    accessibilityLabel={`${person.name} - ${person.nameCn}`}
                    accessibilityHint={disabled ? undefined : 'Double tap to view person details'}
                  >
                    <View style={styles.personIcon}>
                      <Text style={styles.personIconText}>{person.nameCn?.[0] ?? person.name[0]}</Text>
                    </View>
                    <View style={styles.personInfo}>
                      <Text style={styles.personName}>{person.name}</Text>
                      <Text style={styles.personNameCn}>{person.nameCn}</Text>
                      <Text style={styles.personRole}>
                        {person.role}
                        {matched ? ' · Tap for details' : ''}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </SectionCard>
          )}

          {/* Artifacts Section */}
          {dynasty.artifacts && dynasty.artifacts.length > 0 && (
            <SectionCard style={styles.card}>
              <View style={styles.sectionHeader}>
                <Crown size={14} color={theme.colors.primary} />
                <Text style={styles.sectionTitle}>Cultural Artifacts · 文化遗产</Text>
              </View>
              <Text style={styles.sectionHint}>Treasures and innovations from this era</Text>
              {dynasty.artifacts.map((artifact, idx) => (
                <View key={`artifact-${idx}`} style={styles.artifactRow}>
                  <View style={styles.artifactDot} />
                  <View style={styles.artifactInfo}>
                    <Text style={styles.artifactName}>{artifact.name}</Text>
                    <Text style={styles.artifactNameCn}>{artifact.nameCn}</Text>
                    <Text style={styles.artifactDesc}>{artifact.desc}</Text>
                  </View>
                </View>
              ))}
            </SectionCard>
          )}

          {/* Key Events Section */}
          {dynasty.keyEvents && dynasty.keyEvents.length > 0 && (
            <SectionCard style={styles.card}>
              <View style={styles.sectionHeader}>
                <Scroll size={14} color={theme.colors.primary} />
                <Text style={styles.sectionTitle}>Key Events · 重大事件</Text>
              </View>
              {dynasty.keyEvents.map((event, idx) => (
                <View key={`event-${idx}`} style={styles.eventItem}>
                  <View style={styles.eventDot} />
                  <Text style={styles.eventText}>{event}</Text>
                </View>
              ))}
            </SectionCard>
          )}

          {/* Enhanced Cross-References Section */}
          <SectionCard style={styles.card}>
            <View style={styles.sectionHeader}>
              <Sparkles size={14} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>Explore Further · 深入探索</Text>
            </View>
            <Text style={styles.sectionText}>Continue exploring the culture, places, and flavors connected to this dynasty.</Text>

            {/* Related Cities */}
            {(() => {
              const relatedCities = cities.filter((city) =>
                city.provinceId === dynasty.provinceId ||
                city.relatedDynastyIds?.includes(dynasty.id)
              ).slice(0, 3);
              return relatedCities.length > 0 ? (
                <View style={styles.relatedSection}>
                  <View style={styles.relatedLabelRow}>
                    <MapPin size={12} color={theme.colors.mutedText} />
                    <Text style={styles.relatedLabel}>Related Cities</Text>
                  </View>
                  {relatedCities.map((city) => (
                    <Pressable
                      key={city.id}
                      style={styles.relatedItem}
                      onPress={() => navigateApp(navigation, 'Places', { cityId: city.id })}
                      accessibilityRole="button"
                      accessibilityLabel={`${city.nameEn} - ${city.nameCn}`}
                      accessibilityHint="Double tap to explore cities"
                    >
                      <Text style={styles.relatedItemName}>{city.nameCn}</Text>
                      <Text style={styles.relatedItemSub}>{city.nameEn}</Text>
                    </Pressable>
                  ))}
                </View>
              ) : null;
            })()}

            {/* Related Foods */}
            {(() => {
              const relatedFoods = recipes.filter((recipe) =>
                recipe.provinceId === dynasty.provinceId
              ).slice(0, 3);
              return relatedFoods.length > 0 ? (
                <View style={styles.relatedSection}>
                  <View style={styles.relatedLabelRow}>
                    <UtensilsCrossed size={12} color={theme.colors.mutedText} />
                    <Text style={styles.relatedLabel}>Related Foods</Text>
                  </View>
                  {relatedFoods.map((food) => (
                    <Pressable
                      key={food.id}
                      style={styles.relatedItem}
                      onPress={() => navigateApp(navigation, 'Food', { recipeId: food.id })}
                      accessibilityRole="button"
                      accessibilityLabel={`${food.nameEn} - ${food.nameCn}`}
                      accessibilityHint="Double tap to explore recipes"
                    >
                      <Text style={styles.relatedItemName}>{food.nameCn}</Text>
                      <Text style={styles.relatedItemSub}>{food.nameEn}</Text>
                    </Pressable>
                  ))}
                </View>
              ) : null;
            })()}

            {/* Related People */}
            {(() => {
              const relatedPeople = dynasty.relatedPersonIds?.slice(0, 3) ?? [];
              return relatedPeople.length > 0 ? (
                <View style={styles.relatedSection}>
                  <View style={styles.relatedLabelRow}>
                    <Users size={12} color={theme.colors.mutedText} />
                    <Text style={styles.relatedLabel}>Historical Figures</Text>
                  </View>
                  {relatedPeople.map((personId) => {
                    const person = people.find(p => p.id === personId);
                    return person ? (
                      <Pressable
                        key={personId}
                        style={styles.relatedItem}
                        onPress={() => navigation.navigate('PersonDetail', { personId })}
                        accessibilityRole="button"
                        accessibilityLabel={`${person.nameEn} - ${person.nameCn}`}
                        accessibilityHint="Double tap to view person details"
                      >
                        <Text style={styles.relatedItemName}>{person.nameCn}</Text>
                        <Text style={styles.relatedItemSub}>{person.nameEn}</Text>
                      </Pressable>
                    ) : null;
                  })}
                </View>
              ) : null;
            })()}
          </SectionCard>
        </View>
      </HandscrollContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyText: { color: theme.colors.mutedText, fontSize: 16 },
  content: { paddingHorizontal: 24, paddingBottom: 28, gap: 14 },
  header: { marginBottom: 4 },
  hero: { overflow: 'hidden' },
  heroImage: { height: 220 },
  heroMeta: { padding: 14, backgroundColor: theme.colors.card },
  dynastyName: { color: theme.colors.text, fontSize: 28, fontWeight: '800' },
  dynastyNameEn: { marginTop: 4, color: theme.colors.primary, fontWeight: '800', letterSpacing: 1.2 },
  period: { marginTop: 6, color: theme.colors.mutedText },
  tagline: { marginTop: 8, color: theme.colors.text, fontStyle: 'italic' },
  card: { padding: 14 },
  provincePills: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  provincePill: {
    backgroundColor: theme.colors.cinnabarGlow,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
  },
  provincePillText: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { color: theme.colors.primary, fontSize: 12, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase' },
  sectionHint: { marginTop: 4, color: theme.colors.mutedText, fontSize: 11 },
  sectionText: { marginTop: 10, color: theme.colors.text, lineHeight: 22 },
  relatedLink: { marginTop: 8, color: theme.colors.text, fontSize: 12, lineHeight: 18.4 },
  sectionTextMuted: { marginTop: 10, color: theme.colors.mutedText, lineHeight: 22 },
  miniTimeline: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  timelineLine: { flex: 1, height: 0.5, backgroundColor: theme.colors.border },
  timelineLabel: { color: theme.colors.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  subSection: { marginTop: 14 },
  subSectionTitle: { color: theme.colors.text, fontWeight: '800', marginBottom: 8 },
  emperorRow: { borderWidth: 0.5, borderColor: theme.colors.border, borderRadius: 4, padding: 10, marginBottom: 8, backgroundColor: theme.colors.background },
  emperorName: { color: theme.colors.text, fontWeight: '800' },
  emperorZh: { color: theme.colors.primary, marginTop: 3, fontWeight: '700' },
  emperorReign: { color: theme.colors.mutedText, marginTop: 3, fontSize: 11 },
  emperorAch: { color: theme.colors.text, marginTop: 6, lineHeight: 20 },
  // Person styles
  personRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 10, paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: theme.colors.border },
  personIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: theme.colors.cinnabarGlow, alignItems: 'center', justifyContent: 'center' },
  personIconText: { color: theme.colors.primary, fontWeight: '800', fontSize: 14 },
  personInfo: { flex: 1 },
  personName: { color: theme.colors.text, fontWeight: '700', fontSize: 14 },
  personNameCn: { color: theme.colors.primary, fontSize: 12, marginTop: 1 },
  personRole: { color: theme.colors.mutedText, fontSize: 11, marginTop: 3 },
  // Artifact styles
  artifactRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 10 },
  artifactDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.colors.primary, marginTop: 6 },
  artifactInfo: { flex: 1 },
  artifactName: { color: theme.colors.text, fontWeight: '600', fontSize: 13 },
  artifactNameCn: { color: theme.colors.primary, fontSize: 11, marginTop: 1 },
  artifactDesc: { color: theme.colors.mutedText, fontSize: 11, marginTop: 2 },
  // Event styles
  eventItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 8 },
  eventDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: theme.colors.primary, marginTop: 6 },
  eventText: { color: theme.colors.text, fontSize: 13, flex: 1 },
  // Related section styles
  relatedSection: { marginTop: 14 },
  relatedLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  relatedLabel: { color: theme.colors.mutedText, fontSize: 11, fontWeight: '600' },
  relatedItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, paddingHorizontal: 10, backgroundColor: theme.colors.surface, borderRadius: 6, marginTop: 6, borderWidth: 0.5, borderColor: theme.colors.border },
  relatedItemName: { color: theme.colors.text, fontWeight: '600', fontSize: 13 },
  relatedItemSub: { color: theme.colors.mutedText, fontSize: 11 },
});
