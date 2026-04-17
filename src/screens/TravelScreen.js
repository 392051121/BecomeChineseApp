import React, { memo, useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Bookmark, Lightbulb, MapPin, Sparkles } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { cities } from '../data/cities';
import { SmartImageBlock } from '../components/SmartImageBlock';
import { getLocalImage } from '../assets/localImages';
import { toggleCollectionItem } from '../utils/culturalAssets';
import { theme } from '../theme/theme';

const CityCard = memo(function CityCard({ item, isActive, isBookmarked, onActivate, onBookmark }) {
  return (
    <View style={styles.cardWrap}>
      <Pressable style={styles.imageCard} onPress={() => onActivate(item.id)}>
        <SmartImageBlock
          source={getLocalImage('cities', item.imageAsset)}
          uri={item.image}
          label={item.imagePlaceholderText}
          style={styles.image}
          overlayOpacity={0.1}
        >
          <View style={[styles.overlay, item.imageAsset && styles.overlayLocal]} />
          <View style={styles.cityTextWrap}>
            <Text style={styles.cityPinyin}>
              {(item.pinyin ?? item.namePinyin ?? item.nameEn).toUpperCase?.() ?? item.pinyin}
            </Text>
            <Text style={styles.cityCalligraphy}>{item.nameCn}</Text>
            <Text style={styles.cityTagline} numberOfLines={2}>
              {item.tagline}
            </Text>
          </View>
          <View style={styles.placeholderCenter}>
            <Text style={styles.placeholderText}>{item.imagePlaceholderText}</Text>
          </View>
          <View style={styles.pinBadge}>
            <MapPin size={14} color={theme.colors.primary} strokeWidth={2} />
          </View>
          <View style={styles.seasonBubble}>
            <Text style={styles.seasonBubbleText}>{item.travelTips?.bestSeason}</Text>
          </View>
          <View style={styles.sourceBadge}>
            <Text style={styles.sourceBadgeText}>{item.imageAsset ? 'LOCAL' : 'REMOTE'}</Text>
          </View>
        </SmartImageBlock>
      </Pressable>

      <View style={styles.metaCard}>
        <View style={styles.metaTopRow}>
          <View style={styles.cityTitleWrap}>
            <Text style={styles.cityTitle}>{item.nameEn}</Text>
            <Text style={styles.cityTitleSub}>{item.nameCn}</Text>
          </View>
          <Pressable
            style={[styles.bookmarkBtn, isBookmarked && styles.bookmarkBtnActive]}
            onPress={() => onBookmark(item.id)}
          >
            <Bookmark
              size={15}
              color={isBookmarked ? '#FFFFFF' : theme.colors.primary}
              fill={isBookmarked ? theme.colors.primary : 'transparent'}
              strokeWidth={2}
            />
          </Pressable>
        </View>

        {isActive ? (
          <View style={styles.tagsWrap}>
            <View style={styles.summaryStrip}>
              <Text style={styles.summaryStripText}>{item.description}</Text>
              <Text style={styles.summaryNote}>{item.chineseDescription}</Text>
            </View>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Sparkles size={14} color={theme.colors.primary} strokeWidth={2} />
                <Text style={styles.sectionTitle}>City Character / 城市气质</Text>
              </View>
              <View style={styles.sectionBody}>
                <View style={styles.kvRow}>
                  <Text style={styles.kvLabel}>Best Season / 最佳时节</Text>
                  <Text style={styles.kvText}>{item.travelTips?.bestSeason}</Text>
                </View>
                <View style={styles.kvRow}>
                  <Text style={styles.kvLabel}>Mood / 城市气质</Text>
                  <Text style={styles.kvText}>{item.travelTips?.localVibe}</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MapPin size={14} color={theme.colors.primary} strokeWidth={2} />
                <Text style={styles.sectionTitle}>Highlights / 代表景点</Text>
              </View>
              <View style={styles.sectionBody}>
                {(item.attractions ?? []).map((a) => (
                  <View key={`${item.id}-${a.name}`} style={styles.attractionRow}>
                    <Text style={styles.attractionName}>{a.name}</Text>
                    <Text style={styles.attractionDesc}>{a.desc}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Lightbulb size={14} color={theme.colors.primary} strokeWidth={2} />
                <Text style={styles.sectionTitle}>Daily Life / 地方生活片段</Text>
              </View>
              <Text style={styles.secretText}>{item.localSecret}</Text>
            </View>

            <View style={styles.tagItem}>
              <Text style={styles.tagLabel}>Flavor / 代表风味</Text>
              <Text style={styles.tagText}>{item.localTaste}</Text>
            </View>
            <View style={styles.tagItem}>
              <Text style={styles.tagLabel}>Impression / 城市印象</Text>
              <Text style={styles.tagText}>{item.vibe}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.tapHint}>Tap a card to open the place note.</Text>
        )}
      </View>
    </View>
  );
});

export function TravelScreen() {
  const data = useMemo(() => cities, []);
  const [activeCityId, setActiveCityId] = useState(cities[0]?.id ?? null);
  const [bookmarked, setBookmarked] = useState({});

  const activateCity = useCallback((cityId) => setActiveCityId(cityId), []);
  const toggleBookmark = useCallback(async (item) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setBookmarked((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
    await toggleCollectionItem('cities', {
      id: item.id,
      nameEn: item.nameEn,
      province: item.province,
      imageAsset: item.imageAsset,
      tagline: item.tagline,
    }).catch(() => {});
  }, []);

  const renderCityCard = useCallback(
    ({ item }) => (
      <CityCard
        item={item}
        isActive={activeCityId === item.id}
        isBookmarked={!!bookmarked[item.id]}
        onActivate={activateCity}
        onBookmark={() => toggleBookmark(item)}
      />
    ),
    [activeCityId, bookmarked, activateCity, toggleBookmark]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Places</Text>
        <Text style={styles.subtitle}>Discover China’s cities through regional character, food, and everyday rhythm.</Text>
        <View style={styles.titleDivider} />
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderCityCard}
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          updateCellsBatchingPeriod={40}
          windowSize={7}
          removeClippedSubviews
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    letterSpacing: 0.3,
    fontWeight: '600',
  },
  subtitle: {
    color: theme.colors.mutedText,
    fontSize: 13,
    lineHeight: 20.8,
    marginTop: 6,
    marginBottom: 14,
    letterSpacing: 0.2,
  },
  titleDivider: {
    height: 0.5,
    backgroundColor: theme.colors.border,
    marginBottom: 14,
  },
  titleDivider: {
    height: 0.5,
    backgroundColor: theme.colors.border,
    marginBottom: 14,
  },
  cityTitleWrap: {
    flex: 1,
  },
  cityTitle: {
    color: theme.colors.text,
    fontSize: 18,
    letterSpacing: 0.2,
    fontWeight: '700',
  },
  cityTitleSub: {
    marginTop: 2,
    color: theme.colors.primary,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  summaryNote: {
    marginTop: 8,
    color: theme.colors.mutedText,
    fontSize: 12,
    lineHeight: 18.4,
  },
  listContent: {
    paddingBottom: 22,
  },
  cardWrap: {
    borderRadius: 4,
  },
  imageCard: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 210,
    justifyContent: 'space-between',
    padding: 14,
  },
  overlay: { ...StyleSheet.absoluteFillObject },
  overlayLocal: {
    backgroundColor: 'rgba(24, 18, 16, 0.12)',
  },
  cityTextWrap: {
    marginTop: 2,
  },
  cityPinyin: {
    color: '#F8F5EE',
    fontSize: 13,
    letterSpacing: 1.8,
    fontWeight: '700',
  },
  cityCalligraphy: {
    color: 'rgba(58, 52, 43, 0.92)',
    fontSize: 44,
    lineHeight: 50,
    letterSpacing: 1.2,
    marginTop: 3,
    fontWeight: '500',
  },
  cityTagline: {
    marginTop: 7,
    color: 'rgba(248, 245, 238, 0.92)',
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0.3,
    fontWeight: '600',
    maxWidth: 280,
  },
  placeholderCenter: {
    position: 'absolute',
    left: 14,
    bottom: 14,
  },
  placeholderText: {
    color: theme.colors.text,
    opacity: 0.6,
    fontSize: 12,
    letterSpacing: 0.3,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  pinBadge: {
    alignSelf: 'flex-end',
    width: 28,
    height: 28,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(179, 59, 36, 0.40)',
    backgroundColor: 'rgba(253, 251, 247, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sourceBadge: {
    position: 'absolute',
    left: 12,
    top: 12,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(253, 251, 247, 0.88)',
    borderWidth: 0.5,
    borderColor: 'rgba(51, 51, 51, 0.10)',
  },
  sourceBadgeText: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  seasonBubble: {
    position: 'absolute',
    right: 12,
    top: 12,
    maxWidth: 170,
    borderRadius: 999,
    borderWidth: 0.5,
    borderColor: 'rgba(253, 251, 247, 0.85)',
    backgroundColor: 'rgba(30, 30, 30, 0.36)',
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  seasonBubbleText: {
    color: '#F8F5EE',
    fontSize: 10,
    letterSpacing: 0.4,
    fontWeight: '700',
  },
  metaCard: {
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    borderTopWidth: 0,
    backgroundColor: theme.colors.card,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
  },
  metaTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  cityTitle: {
    color: theme.colors.text,
    fontSize: 16,
    letterSpacing: 0.2,
    fontWeight: '700',
  },
  bookmarkBtn: {
    width: 28,
    height: 28,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkBtnActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  tagsWrap: { marginTop: 10, gap: 12 },
  summaryStrip: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: '#FBF7F1',
    padding: 10,
  },
  summaryStripText: {
    color: theme.colors.text,
    fontSize: 13,
    lineHeight: 20,
  },
  section: {
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.border,
    paddingTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  sectionBody: { gap: 8 },
  kvRow: { gap: 2 },
  kvLabel: { color: theme.colors.mutedText, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: '700' },
  kvText: { color: theme.colors.text, fontSize: 13, lineHeight: 19.5 },
  attractionRow: { gap: 3 },
  attractionName: { color: theme.colors.text, fontWeight: '700', fontSize: 13 },
  attractionDesc: { color: theme.colors.mutedText, fontSize: 12, lineHeight: 18 },
  secretCard: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(179, 59, 36, 0.18)',
    backgroundColor: '#F7F2EA',
    padding: 10,
  },
  secretHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  secretTitle: { color: theme.colors.primary, fontWeight: '800', fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase' },
  secretText: { color: theme.colors.text, fontSize: 13, lineHeight: 20 },
  tagItem: {
    gap: 4,
  },
  tagLabel: {
    color: theme.colors.primary,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  tagText: {
    color: theme.colors.text,
    fontSize: 13,
    lineHeight: 20,
  },
  tapHint: {
    marginTop: 10,
    color: theme.colors.mutedText,
    fontSize: 12,
  },
});
