import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ArrowLeft, Award, BookOpen, Bookmark, MapPin, Scroll, Share2, Users } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { people } from '../data/people';
import { dynasties } from '../data/dynasties';
import { cities } from '../data/cities';
import { getLocalImage } from '../assets/localImages';
import { SmartImageBlock } from '../components/SmartImageBlock';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';
import { LinkedConceptText } from '../components/LinkedConceptText';
import { DetailHeader } from '../components/DetailHeader';
import { getFavoritesSnapshot, toggleCollectionItem } from '../utils/culturalAssets';
import { shareText } from '../utils/sharing';
import { earnStamp } from '../utils/stampCollection';
import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { useToast } from '../components/Toast';
import { useReadingPosition } from '../hooks/useReadingPosition';
import { navigateApp } from '../utils/navigation';

export function PersonDetailScreen({ route, navigation }) {
  const { colors } = useTheme();
  const toast = useToast();
  const personId = route?.params?.personId;
  const person = useMemo(() => {
    if (!personId) return people[0] ?? null;
    return people.find((item) => item.id === personId) ?? null;
  }, [personId]);

  const scrollRef = useRef(null);
  const { savedOffset, onScroll, restore } = useReadingPosition(
    person?.id ? `person:${person.id}` : ''
  );
  // Restore the saved scroll offset once the content is laid out.
  useEffect(() => {
    if (!(savedOffset > 0)) return;
    const t = setTimeout(() => restore(scrollRef), 60);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedOffset, person?.id]);

  const relatedDynasty = useMemo(
    () => dynasties.find((d) => d.id === person?.dynastyId),
    [person?.dynastyId]
  );

  const relatedCities = useMemo(
    () => cities.filter((c) => person?.relatedCityIds?.includes(c.id)),
    [person?.relatedCityIds]
  );

  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const favorites = await getFavoritesSnapshot().catch(() => null);
      if (!cancelled && favorites?.people) {
        setIsBookmarked(favorites.people.some(p => p.id === personId));
      }
    })();
    return () => { cancelled = true; };
  }, [personId]);

  // Track stamp earning - user viewing person details
  useEffect(() => {
    if (!person?.id) return;

    const timeoutId = setTimeout(async () => {
      await earnStamp('person', person, {
        viewTimeMs: 3000,
        scrollDepth: 0.7,
        interactions: 1,
        expanded: true,
      });
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [person?.id]);

  const handleToggleBookmark = async () => {
    if (!person) return;
    Haptics.selectionAsync().catch(() => {});
    const wasBookmarked = isBookmarked;
    const result = await toggleCollectionItem('people', {
      id: person.id,
      nameEn: person.nameEn,
      nameCn: person.nameCn,
    });
    const newFavorites = result?.favorites?.people || [];
    setIsBookmarked(newFavorites.some(p => p.id === person.id));
    // Show toast feedback
    if (!wasBookmarked) {
      toast.success(`${person.nameCn} saved to collection`, 'Person Added');
    } else {
      toast.info(`${person.nameCn} removed from collection`, 'Person Removed');
    }
  };

  const handleShare = async () => {
    if (!person) return;
    Haptics.selectionAsync().catch(() => {});
    const summary = person.summaryEn ? `${String(person.summaryEn).slice(0, 100)}...` : '';
    const lines = [
      `🀄 BecomeChinese History`,
      ``,
      `${person.nameCn || ''} · ${person.nameEn || ''}`.trim(),
      person.subtitleEn || '',
      ``,
      summary,
      ``,
      person.achievements?.length > 0 ? `✨ Achievements: ${person.achievements.slice(0, 3).join(', ')}` : '',
      ``,
      `Discover more historical figures.`,
    ];
    await shareText(lines.filter(Boolean).join('\n'), `Share ${person.nameEn || 'Person'}`);
  };

  if (!person) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Person not found</Text>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <DetailHeader
        title="Historical Figure"
        onBack={() => navigation.goBack()}
        onShare={handleShare}
        onBookmark={handleToggleBookmark}
        isBookmarked={isBookmarked}
        showBookmark={true}
        shareLabel="Share this person"
      />

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <SectionCard style={styles.hero}>
          <View style={styles.heroContent}>
            <View style={[styles.avatarWrap, { backgroundColor: colors.cinnabarGlow }]}>
              <Text style={[styles.avatarText, { color: colors.primary }]}>{person.nameCn?.[0] ?? person.nameEn?.[0]}</Text>
            </View>
            <Text style={[styles.nameEn, { color: colors.text }]}>{person.nameEn}</Text>
            <Text style={[styles.nameCn, { color: colors.primary }]}>{person.nameCn}</Text>
            <Text style={[styles.subtitle, { color: colors.mutedText }]}>{person.subtitleEn}</Text>
            {person.isFeatured && (
              <View style={[styles.featuredBadge, { backgroundColor: colors.primary }]}>
                <Award size={12} color="#FFFFFF" />
                <Text style={styles.featuredText}>Featured</Text>
              </View>
            )}
          </View>
        </SectionCard>

        <SectionCard style={styles.card}>
          <View style={styles.sectionHeader}>
            <BookOpen size={14} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Overview · 概述</Text>
          </View>
          <LinkedConceptText text={person.summaryEn} style={[styles.summaryText, { color: colors.text }]} />
        </SectionCard>

        {person.achievements && person.achievements.length > 0 && (
          <SectionCard style={styles.card}>
            <View style={styles.sectionHeader}>
              <Award size={14} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>Key Achievements · 主要成就</Text>
            </View>
            {person.achievements.map((achievement, idx) => (
              <View key={`achievement-${idx}`} style={styles.listItem}>
                <View style={[styles.listDot, { backgroundColor: colors.primary }]} />
                <Text style={[styles.listText, { color: colors.text }]}>{achievement}</Text>
              </View>
            ))}
          </SectionCard>
        )}

        {person.tags && person.tags.length > 0 && (
          <SectionCard style={styles.card}>
            <View style={styles.sectionHeader}>
              <Scroll size={14} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>Tags · 标签</Text>
            </View>
            <View style={styles.tagWrap}>
              {person.tags.map((tag, idx) => (
                <View key={`tag-${idx}`} style={[styles.tagPill, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Text style={[styles.tagText, { color: colors.text }]}>{tag}</Text>
                </View>
              ))}
            </View>
          </SectionCard>
        )}

        {relatedDynasty && (
          <SectionCard style={styles.card}>
            <View style={styles.sectionHeader}>
              <Users size={14} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>Historical Period · 历史时期</Text>
            </View>
            <Pressable
              style={[styles.relatedItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => navigation.navigate('DynastyDetail', { dynastyId: relatedDynasty.id })}
              accessibilityRole="button"
              accessibilityLabel={`${relatedDynasty.nameEn} Dynasty`}
            >
              <Text style={[styles.relatedItemName, { color: colors.text }]}>{relatedDynasty.nameEn}</Text>
              <Text style={[styles.relatedItemSub, { color: colors.primary }]}>{relatedDynasty.nameCn}</Text>
              <Text style={[styles.relatedItemHint, { color: colors.mutedText }]}>{relatedDynasty.years}</Text>
            </Pressable>
          </SectionCard>
        )}

        {relatedCities.length > 0 && (
          <SectionCard style={styles.card}>
            <View style={styles.sectionHeader}>
              <MapPin size={14} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>Related Places · 相关地点</Text>
            </View>
            {relatedCities.map((city) => (
              <Pressable
                key={city.id}
                style={[styles.relatedItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => navigateApp(navigation, 'Places', { cityId: city.id })}
                accessibilityRole="button"
                accessibilityLabel={`${city.nameEn} - ${city.nameCn}`}
              >
                <Text style={[styles.relatedItemName, { color: colors.text }]}>{city.nameEn}</Text>
                <Text style={[styles.relatedItemSub, { color: colors.primary }]}>{city.nameCn}</Text>
              </Pressable>
            ))}
          </SectionCard>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 14,
  },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyText: { color: theme.colors.mutedText, fontSize: 16 },
  hero: { padding: 20 },
  heroContent: { alignItems: 'center' },
  avatarWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.cinnabarGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { color: theme.colors.primary, fontSize: 28, fontWeight: '800' },
  nameEn: { color: theme.colors.text, fontSize: 24, fontWeight: '800' },
  nameCn: { color: theme.colors.primary, fontSize: 18, fontWeight: '700', marginTop: 4 },
  subtitle: { color: theme.colors.mutedText, fontSize: 14, marginTop: 8, textAlign: 'center' },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 12,
  },
  featuredText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  card: { padding: 14 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  sectionTitle: { color: theme.colors.primary, fontSize: 12, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase' },
  summaryText: { color: theme.colors.text, fontSize: 14, lineHeight: 22 },
  listItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 8 },
  listDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.colors.primary, marginTop: 7 },
  listText: { flex: 1, color: theme.colors.text, fontSize: 13, lineHeight: 20 },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagPill: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
  },
  tagText: { color: theme.colors.text, fontSize: 12, fontWeight: '600' },
  relatedItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
  },
  relatedItemName: { color: theme.colors.text, fontWeight: '700', fontSize: 14 },
  relatedItemSub: { color: theme.colors.primary, fontSize: 12, marginTop: 2 },
  relatedItemHint: { color: theme.colors.mutedText, fontSize: 11, marginTop: 2 },
});
