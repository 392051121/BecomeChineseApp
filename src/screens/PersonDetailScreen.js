import React, { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
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
import { HandscrollContainer } from '../components/HandscrollContainer';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';
import { getFavoritesSnapshot, toggleCollectionItem } from '../utils/culturalAssets';
import { shareText } from '../utils/sharing';
import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

export function PersonDetailScreen({ route, navigation }) {
  const { colors } = useTheme();
  const personId = route?.params?.personId ?? 'zhenghe';
  const person = useMemo(
    () => people.find((item) => item.id === personId) ?? people[0],
    [personId]
  );

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

  const handleToggleBookmark = async () => {
    if (!person) return;
    Haptics.selectionAsync().catch(() => {});
    const result = await toggleCollectionItem('people', {
      id: person.id,
      nameEn: person.nameEn,
      nameCn: person.nameCn,
    });
    const newFavorites = result?.favorites?.people || [];
    setIsBookmarked(newFavorites.some(p => p.id === person.id));
  };

  const handleShare = async () => {
    Haptics.selectionAsync().catch(() => {});
    const lines = [
      `🀄 BecomeChinese History`,
      ``,
      `${person.nameCn} · ${person.nameEn}`,
      `${person.subtitleEn}`,
      ``,
      `${person.summaryEn?.slice(0, 100)}...`,
      ``,
      person.achievements?.length > 0 ? `✨ Achievements: ${person.achievements.slice(0, 3).join(', ')}` : '',
      ``,
      `Discover more historical figures.`,
    ];
    await shareText(lines.filter(Boolean).join('\n'), `Share ${person.nameEn}`);
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
      <HandscrollContainer>
        <View style={styles.topBar}>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back">
            <ArrowLeft size={16} color={theme.colors.text} strokeWidth={2} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
          <Text style={styles.topTitle}>Historical Figure</Text>
          <View style={styles.topActions}>
            <Pressable
              style={styles.shareBtn}
              onPress={handleShare}
              accessibilityRole="button"
              accessibilityLabel="Share this person"
            >
              <Share2 size={18} color={theme.colors.primary} strokeWidth={2} />
            </Pressable>
            <Pressable
              style={[styles.bookmarkBtn, isBookmarked && styles.bookmarkBtnActive]}
              onPress={handleToggleBookmark}
              accessibilityRole="button"
              accessibilityLabel={isBookmarked ? "Remove from collection" : "Add to collection"}
            >
              <Bookmark
                size={18}
                color={isBookmarked ? '#FFFFFF' : theme.colors.primary}
                strokeWidth={2}
                fill={isBookmarked ? theme.colors.primary : 'none'}
              />
            </Pressable>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <SectionCard style={styles.hero}>
            <View style={styles.heroContent}>
              <View style={styles.avatarWrap}>
                <Text style={styles.avatarText}>{person.nameCn?.[0] ?? person.nameEn?.[0]}</Text>
              </View>
              <Text style={styles.nameCn}>{person.nameCn}</Text>
              <Text style={styles.nameEn}>{person.nameEn}</Text>
              <Text style={styles.subtitle}>{person.subtitleEn}</Text>
              {person.isFeatured && (
                <View style={styles.featuredBadge}>
                  <Award size={12} color="#FFFFFF" />
                  <Text style={styles.featuredText}>Featured</Text>
                </View>
              )}
            </View>
          </SectionCard>

          <SectionCard style={styles.card}>
            <View style={styles.sectionHeader}>
              <BookOpen size={14} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>Overview</Text>
            </View>
            <Text style={styles.summaryText}>{person.summaryEn}</Text>
          </SectionCard>

          {person.achievements && person.achievements.length > 0 && (
            <SectionCard style={styles.card}>
              <View style={styles.sectionHeader}>
                <Award size={14} color={theme.colors.primary} />
                <Text style={styles.sectionTitle}>Key Achievements</Text>
              </View>
              {person.achievements.map((achievement, idx) => (
                <View key={`achievement-${idx}`} style={styles.listItem}>
                  <View style={styles.listDot} />
                  <Text style={styles.listText}>{achievement}</Text>
                </View>
              ))}
            </SectionCard>
          )}

          {person.tags && person.tags.length > 0 && (
            <SectionCard style={styles.card}>
              <View style={styles.sectionHeader}>
                <Scroll size={14} color={theme.colors.primary} />
                <Text style={styles.sectionTitle}>Tags</Text>
              </View>
              <View style={styles.tagWrap}>
                {person.tags.map((tag, idx) => (
                  <View key={`tag-${idx}`} style={styles.tagPill}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </SectionCard>
          )}

          {relatedDynasty && (
            <SectionCard style={styles.card}>
              <View style={styles.sectionHeader}>
                <Users size={14} color={theme.colors.primary} />
                <Text style={styles.sectionTitle}>Historical Period</Text>
              </View>
              <Pressable
                style={styles.relatedItem}
                onPress={() => navigation.navigate('DynastyDetail', { dynastyId: relatedDynasty.id })}
                accessibilityRole="button"
                accessibilityLabel={`${relatedDynasty.nameEn} Dynasty`}
              >
                <Text style={styles.relatedItemName}>{relatedDynasty.nameCn}</Text>
                <Text style={styles.relatedItemSub}>{relatedDynasty.nameEn} Dynasty</Text>
                <Text style={styles.relatedItemHint}>{relatedDynasty.years}</Text>
              </Pressable>
            </SectionCard>
          )}

          {relatedCities.length > 0 && (
            <SectionCard style={styles.card}>
              <View style={styles.sectionHeader}>
                <MapPin size={14} color={theme.colors.primary} />
                <Text style={styles.sectionTitle}>Related Places</Text>
              </View>
              {relatedCities.map((city) => (
                <Pressable
                  key={city.id}
                  style={styles.relatedItem}
                  onPress={() => navigation.getParent()?.navigate('Places')}
                  accessibilityRole="button"
                  accessibilityLabel={`${city.nameEn} - ${city.nameCn}`}
                >
                  <Text style={styles.relatedItemName}>{city.nameCn}</Text>
                  <Text style={styles.relatedItemSub}>{city.nameEn}</Text>
                </Pressable>
              ))}
            </SectionCard>
          )}
        </ScrollView>
      </HandscrollContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  topBar: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: { color: theme.colors.text, fontWeight: '700' },
  topTitle: { color: theme.colors.text, fontSize: 16, fontWeight: '700' },
  topActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  shareBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.cinnabarGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.cinnabarGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkBtnActive: {
    backgroundColor: theme.colors.primary,
  },
  content: { paddingHorizontal: 24, paddingBottom: 28, gap: 14 },
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
  nameCn: { color: theme.colors.text, fontSize: 32, fontWeight: '800' },
  nameEn: { color: theme.colors.primary, fontSize: 18, fontWeight: '700', marginTop: 4 },
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
