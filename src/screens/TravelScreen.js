import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Bookmark, Lightbulb, MapPin, Sparkles } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { cities } from '../data/cities';
import { dynasties } from '../data/dynasties';
import { recipes } from '../data/recipes';
import { SmartImageBlock } from '../components/SmartImageBlock';
import { StampFeedback } from '../components/StampFeedback';
import { RelatedPathCard } from '../components/RelatedPathCard';
import { ChinaConnectionMap } from '../components/ChinaConnectionMap';
import { SearchBar, useSearch } from '../components/SearchBar';
import { getLocalImage } from '../assets/localImages';
import { toggleCollectionItem, addRecentlyViewed, getFavoritesSnapshot } from '../utils/culturalAssets';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';
import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { logger } from '../utils/errorHandling';

const CityCard = memo(function CityCard({ item, isActive, isBookmarked, onActivate, onBookmark, navigation }) {
  const relatedFood = recipes.find((recipe) => recipe.province_id === item.province_id);
  const relatedDynasty = dynasties.find((dynasty) => dynasty.province_id === item.province_id);

  // Track view when card becomes active
  useEffect(() => {
    if (isActive) {
      addRecentlyViewed({
        id: item.id,
        type: 'city',
        nameEn: item.nameEn,
        nameCn: item.nameCn,
        province: item.province,
      }).catch(() => {});
    }
  }, [isActive, item.id, item.nameEn, item.nameCn, item.province]);

  return (
    <SectionCard style={styles.cardWrap} tone="soft">
      <Pressable
        style={styles.heroCard}
        onPress={() => onActivate(item.id)}
        accessibilityRole="button"
        accessibilityLabel={`${item.nameEn} - ${item.nameCn}. ${item.province} province`}
        accessibilityHint="Double tap to expand city details"
      >
        <SmartImageBlock
          source={getLocalImage('cities', item.imageAsset)}
          uri={item.image}
          label={item.imagePlaceholderText}
          style={styles.heroImage}
          overlayOpacity={0.08}
        >
          <View style={[styles.overlay, item.imageAsset && styles.overlayLocal]} />
          <View style={styles.heroTopLine}>
            <View style={styles.provincePill}>
              <MapPin size={10} color="#F8F5EE" strokeWidth={2.5} />
              <Text style={styles.provinceLabel}>{item.province}</Text>
            </View>
          </View>

          <View style={styles.heroCopy}>
            <Text style={styles.cityTitle}>{item.nameCn}</Text>
            <Text style={styles.cityTitleEn}>{item.nameEn}</Text>
            <Text style={styles.cityTagline} numberOfLines={2}>{item.subtitleCn ?? item.tagline}</Text>
          </View>
        </SmartImageBlock>
      </Pressable>

      <View style={styles.metaTopRow}>
        <View style={styles.cityTitleWrap}>
          <Text style={styles.metaKicker}>City character</Text>
          <Text style={styles.metaTitle}>{item.character ?? item.vibe ?? item.summaryEn}</Text>
        </View>
        <Pressable
          style={[styles.bookmarkBtn, isBookmarked && styles.bookmarkBtnActive]}
          onPress={() => onBookmark(item.id)}
          accessibilityRole="button"
          accessibilityLabel={isBookmarked ? "Saved - tap to remove" : "Save city"}
          accessibilityHint="Double tap to toggle bookmark"
        >
          <Bookmark
            size={15}
            color={isBookmarked ? '#FFFFFF' : theme.colors.primary}
            fill={isBookmarked ? theme.colors.primary : 'transparent'}
            strokeWidth={2}
          />
        </Pressable>
      </View>
      {isBookmarked ? <StampFeedback label="Saved" active={true} style={styles.bookmarkStamp} shape="round" /> : null}

      {isActive ? (
        <View style={styles.expandedWrap}>
          <View style={styles.summaryStrip}>
            <Text style={styles.summaryStripText}>{item.description}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Sparkles size={14} color={theme.colors.primary} strokeWidth={2} />
              <Text style={styles.sectionTitle}>Local rhythm</Text>
            </View>
            <Text style={styles.sectionText}>{item.travelTips?.localVibe}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Lightbulb size={14} color={theme.colors.primary} strokeWidth={2} />
              <Text style={styles.sectionTitle}>Small secret</Text>
            </View>
            <Text style={styles.sectionText}>{item.localSecret}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MapPin size={14} color={theme.colors.primary} strokeWidth={2} />
              <Text style={styles.sectionTitle}>Highlights</Text>
            </View>
            <View style={styles.attractionList}>
              {(item.attractions ?? []).map((a) => (
                <View key={`${item.id}-${a.name}`} style={styles.attractionRow}>
                  <Text style={styles.attractionName}>{a.name}</Text>
                  <Text style={styles.attractionDesc}>{a.desc}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.tagGrid}>
            <View style={styles.tagItem}>
              <Text style={styles.tagLabel}>Flavor</Text>
              <Text style={styles.tagText}>{item.localTaste}</Text>
            </View>
            <View style={styles.tagItem}>
              <Text style={styles.tagLabel}>Impression</Text>
              <Text style={styles.tagText}>{item.summaryEn ?? item.vibe}</Text>
            </View>
          </View>

          <View style={styles.relatedCard}>
            <Text style={styles.sectionTitle}>Related Paths</Text>
            <Text style={styles.relatedLead}>Follow the city into food and history.</Text>
            <View style={styles.relatedPathWrap}>
              {relatedFood ? (
                <RelatedPathCard
                  label="Food"
                  title={`${relatedFood.nameEn} / ${relatedFood.nameCn}`}
                  hint="Explore"
                  onPress={() => navigation.getParent()?.navigate('Food')}
                />
              ) : null}
              {relatedDynasty ? (
                <RelatedPathCard
                  label="History"
                  title={`${relatedDynasty.nameEn} / ${relatedDynasty.nameCn}`}
                  hint="Explore"
                  onPress={() => navigation.getParent()?.navigate('History')}
                />
              ) : null}
              {!relatedFood && !relatedDynasty ? <Text style={styles.relatedText}>No related paths yet.</Text> : null}
            </View>
          </View>
        </View>
      ) : (
        <Text style={styles.tapHint}>Tap the image to open the city story.</Text>
      )}
    </SectionCard>
  );
});

export function TravelScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const data = useMemo(() => cities, []);
  const [activeCityId, setActiveCityId] = useState(cities[0]?.id ?? null);
  const [bookmarked, setBookmarked] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Load bookmark state from AsyncStorage on mount
  useEffect(() => {
    getFavoritesSnapshot().then((favorites) => {
      const cityFavorites = favorites?.cities || [];
      const bookmarkState = {};
      cityFavorites.forEach((city) => {
        if (city.id) bookmarkState[city.id] = true;
      });
      setBookmarked(bookmarkState);
    }).catch((e) => { logger.error('TravelScreen', 'Failed to load favorites', e); });
  }, []);

  const { filterItems } = useSearch(data, ['nameEn', 'nameCn', 'province']);
  const filteredCities = useMemo(() => filterItems(searchQuery), [searchQuery, filterItems]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate refresh - in real app would re-fetch data
    await new Promise(resolve => setTimeout(resolve, 500));
    setRefreshing(false);
  }, []);

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
        navigation={navigation}
      />
    ),
    [activeCityId, bookmarked, activateCity, toggleBookmark, navigation]
  );

  const connectedProvinces = useMemo(() => new Set(cities.filter((city) => city.province_id).map((city) => city.province_id)), []);

  const ListHeader = useMemo(() => (
    <>
      <ScreenHeader
        kicker="Places"
        title="City Stories First"
        subtitle="Read the city story first, then use the map as support."
        style={styles.header}
        includeTopInset={false}
      />

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search cities..."
        onClear={() => setSearchQuery('')}
      />

      <SectionCard style={styles.cityLeadCard} tone="soft">
        <View style={styles.heroTopRow}>
          <Text style={styles.heroLabel}>City Lead</Text>
          <Text style={styles.heroBadge}>{filteredCities.length} stories</Text>
        </View>
        <Text style={styles.heroTitle}>Read the city first.</Text>
        <Text style={styles.heroText}>Each city opens a local story. The map stays secondary and only supports the province links.</Text>
      </SectionCard>
    </>
  ), [searchQuery, filteredCities.length]);

  const ListFooter = useMemo(() => (
    <SectionCard style={styles.mapCard} tone="panel">
      <View style={styles.heroTopRow}>
        <Text style={styles.heroLabel}>Map Overview</Text>
        <Text style={styles.heroBadge}>Atlas</Text>
      </View>
      <Text style={styles.heroTitle}>A symbolic provincial guide</Text>
      <Text style={styles.heroText}>Use it as a thread, not the destination. The city stories carry the page.</Text>
      <View style={styles.mapWrap}>
        <ChinaConnectionMap connectedProvinces={connectedProvinces} />
      </View>
    </SectionCard>
  ), [connectedProvinces]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={filteredCities}
        keyExtractor={(item) => item.id}
        renderItem={renderCityCard}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={
          <SectionCard style={styles.emptyCard} tone="soft">
            <Text style={styles.emptyTitle}>No city stories yet.</Text>
            <Text style={styles.emptyText}>Return later or explore another module to keep the atlas moving.</Text>
          </SectionCard>
        }
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        updateCellsBatchingPeriod={40}
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
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  listContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 100, gap: 14 },
  header: { marginBottom: 4 },

  // Simplified lead card
  cityLeadCard: { padding: 12, backgroundColor: theme.colors.softCard },
  heroTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroLabel: { color: theme.colors.primary, fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  heroBadge: { color: theme.colors.text, fontSize: 10, fontWeight: '700' },
  heroTitle: { marginTop: 6, color: theme.colors.text, fontSize: 16, fontWeight: '700' },
  heroText: { marginTop: 4, color: theme.colors.mutedText, fontSize: 12, lineHeight: 18 },
  mapWrap: { marginTop: 10 },

  mapCard: { marginBottom: 10, padding: 12, backgroundColor: theme.colors.panel },

  emptyCard: { padding: 16, alignItems: 'center' },
  emptyTitle: { color: theme.colors.text, fontSize: 14, fontWeight: '700' },
  emptyText: { marginTop: 4, color: theme.colors.mutedText, fontSize: 12 },

  // Cleaner card
  cardWrap: { borderRadius: theme.radii.md, overflow: 'hidden' },
  heroCard: { borderRadius: theme.radii.md, overflow: 'hidden' },
  heroImage: { width: '100%', height: 200, justifyContent: 'space-between', padding: 12 },
  overlay: { ...StyleSheet.absoluteFillObject },
  overlayLocal: { backgroundColor: 'rgba(24, 18, 16, 0.10)' },

  heroTopLine: { flexDirection: 'row' },
  provincePill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(24, 18, 16, 0.35)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  provinceLabel: { color: '#F8F5EE', fontSize: 10, fontWeight: '700' },

  heroCopy: { marginTop: 16 },
  cityTitle: { color: '#F8F5EE', fontSize: 36, fontWeight: '600' },
  cityTitleEn: { color: 'rgba(248, 245, 238, 0.80)', fontSize: 14, fontWeight: '700', marginTop: 4 },
  cityTagline: { marginTop: 8, color: 'rgba(248, 245, 238, 0.70)', fontSize: 11, lineHeight: 16, maxWidth: 260 },

  metaTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12 },
  cityTitleWrap: { flex: 1 },
  metaKicker: { color: theme.colors.primary, fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  metaTitle: { marginTop: 4, color: theme.colors.text, fontSize: 14, fontWeight: '700' },

  bookmarkBtn: { width: 40, height: 40, borderRadius: 8, borderWidth: 0.5, alignItems: 'center', justifyContent: 'center' },
  bookmarkBtnActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  bookmarkStamp: { marginTop: 6 },

  expandedWrap: { padding: 12, gap: 12 },
  summaryStrip: { borderRadius: theme.radii.sm, borderWidth: 0.5, backgroundColor: theme.colors.surface, padding: 10 },
  summaryStripText: { color: theme.colors.text, fontSize: 13, lineHeight: 20 },

  section: { borderTopWidth: 0.5, paddingTop: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  sectionTitle: { color: theme.colors.primary, fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  sectionText: { color: theme.colors.text, fontSize: 13, lineHeight: 20 },

  attractionList: { gap: 6 },
  attractionRow: { gap: 2 },
  attractionName: { color: theme.colors.text, fontWeight: '700', fontSize: 12 },
  attractionDesc: { color: theme.colors.mutedText, fontSize: 11, lineHeight: 16 },

  tagGrid: { flexDirection: 'row', gap: 12 },
  tagItem: { flex: 1, gap: 4 },
  tagLabel: { color: theme.colors.primary, fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  tagText: { color: theme.colors.text, fontSize: 12, lineHeight: 18 },

  relatedCard: { borderRadius: theme.radii.sm, borderWidth: 0.5, backgroundColor: theme.colors.surface, padding: 10, gap: 4 },
  relatedLead: { color: theme.colors.mutedText, fontSize: 11 },
  relatedPathWrap: { flexDirection: 'row', gap: 8, marginTop: 6 },
  relatedText: { color: theme.colors.mutedText, fontSize: 12 },

  tapHint: { marginTop: 8, color: theme.colors.mutedText, fontSize: 11, textAlign: 'center' },
});
