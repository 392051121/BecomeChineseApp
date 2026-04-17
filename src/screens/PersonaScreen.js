import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Heart, Sparkles } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { PaperTexture } from '../components/PaperTexture';
import { SealTexture } from '../components/SealTexture';
import { cities } from '../data/cities';
import { recipes } from '../data/recipes';
import { dynasties } from '../data/dynasties';
import { generateChineseName, getTraitOptions } from '../data/chineseNameGenerator';
import {
  addNameFavorite,
  buildProvinceStats,
  getCultureRank,
  getCulturalAssets,
} from '../utils/culturalAssets';
import { theme } from '../theme/theme';

export function PersonaScreen() {
  const serifFont = useMemo(
    () =>
      Platform.select({
        ios: 'Georgia',
        android: 'serif',
        default: 'serif',
      }),
    []
  );

  const [englishName, setEnglishName] = useState('');
  const [selectedTraits, setSelectedTraits] = useState([]);
  const [generated, setGenerated] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [shareModalVisible, setShareModalVisible] = useState(false);

  const traitOptions = useMemo(() => getTraitOptions(), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const assets = await getCulturalAssets();
        if (!cancelled) setFavorites(Array.isArray(assets?.favorites?.names) ? assets.favorites.names : []);
      } catch {
        if (!cancelled) setFavorites([]);
      } finally {
        if (!cancelled) setLoadingFavorites(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function toggleTrait(traitKey) {
    setSelectedTraits((prev) => {
      if (prev.includes(traitKey)) return prev.filter((t) => t !== traitKey);
      return [...prev, traitKey];
    });
  }

  function handleGenerate() {
    const next = generateChineseName({ englishName, traitKeys: selectedTraits });
    setGenerated(next);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }

  const isFavorited = useMemo(() => {
    if (!generated) return false;
    return favorites.some((f) => f?.full?.hanzi === generated.full.hanzi && f?.full?.pinyin === generated.full.pinyin);
  }, [favorites, generated]);

  const provinceStats = useMemo(
    () => buildProvinceStats({
      favorites: {
        names: favorites,
        cities: cities.filter((item) => item.bookmarked),
        recipes: recipes.filter((item) => item.bookmarked),
        dynasties: dynasties.filter((item) => item.bookmarked),
      },
      cities,
      recipes,
    }),
    [favorites]
  );

  async function handleFavorite() {
    if (!generated) return;
    if (isFavorited) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    const next = [generated, ...favorites].slice(0, 30);
    setFavorites(next);
    await addNameFavorite({
      id: `${generated.full.hanzi}-${generated.full.pinyin}`,
      type: 'name',
      province: 'General',
      full: generated.full,
    }).catch(() => {});
  }

  const cultureRank = useMemo(() => getCultureRank(provinceStats.connected), [provinceStats.connected]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.safeArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Generate a Chinese name, collect cultural notes, and track the themes you love most.</Text>

          <View style={styles.scrollCard}>
            <PaperTexture />
            <SealTexture opacity={0.05} />

            <View style={styles.scrollInner}>
              {generated ? (
                <>
                  <Text style={[styles.hanzi, { fontFamily: serifFont }]}>{generated.full.hanzi}</Text>
                  <Text style={styles.pinyin}>{generated.full.pinyin}</Text>
                  <Text style={styles.meaning}>{generated.full.meaningEn}</Text>
                </>
              ) : (
                <>
                  <Text style={[styles.placeholderHanzi, { fontFamily: serifFont }]}>Blank Scroll</Text>
                  <Text style={styles.placeholderText}>Enter an English name below, choose a style, and generate a Chinese name.</Text>
                </>
              )}
            </View>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>English Name</Text>
            <TextInput
              value={englishName}
              onChangeText={setEnglishName}
              placeholder="e.g. Amelia, Daniel, Sophia"
              placeholderTextColor="rgba(51, 51, 51, 0.40)"
              autoCapitalize="words"
              style={styles.input}
            />

            <Text style={[styles.label, { marginTop: 14 }]}>Personality Tags</Text>
            <View style={styles.traitsRow}>
              {traitOptions.map((key) => {
                const active = selectedTraits.includes(key);
                return (
                  <Pressable
                    key={key}
                    onPress={() => toggleTrait(key)}
                    style={[styles.traitChip, active && styles.traitChipActive]}
                  >
                    <Text style={[styles.traitText, active && styles.traitTextActive]}>{key}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.actionsRow}>
              <Pressable style={styles.generateBtn} onPress={handleGenerate}>
                <Sparkles size={16} color="#FFFFFF" strokeWidth={2} />
                <Text style={styles.generateText}>Generate</Text>
              </Pressable>

              <Pressable
                style={[styles.favoriteBtn, (!generated || isFavorited) && styles.favoriteBtnDisabled]}
                onPress={handleFavorite}
                disabled={!generated || isFavorited}
              >
                <Heart
                  size={16}
                  color={isFavorited ? '#FFFFFF' : theme.colors.primary}
                  fill={isFavorited ? theme.colors.primary : 'transparent'}
                  strokeWidth={2}
                />
                <Text style={[styles.favoriteText, isFavorited && styles.favoriteTextActive]}>
                  {isFavorited ? 'Saved' : 'Save'}
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.connectionCard}>
            <Text style={styles.connectionLabel}>Cultural Map</Text>
            <Text style={styles.connectionTitle}>
              You’ve connected with <Text style={styles.connectionCount}>{provinceStats.connected}</Text> regions
            </Text>
            <View style={styles.progressLine}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.max(8, (provinceStats.connected / Math.max(1, provinceStats.total)) * 100)}%` },
                ]}
              />
            </View>
            <View style={styles.provinceWrap}>
              {provinceStats.provinces.map((item) => {
                const active = item.visited;
                return (
                  <View key={item.province} style={[styles.provinceTag, active && styles.provinceTagActive]}>
                    <Text style={[styles.provinceTagText, active && styles.provinceTagTextActive]}>
                      {item.province}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.favoritesBlock}>
            <Text style={styles.favoritesTitle}>Saved Names</Text>
            {loadingFavorites ? (
              <Text style={styles.favoritesHint}>Loading...</Text>
            ) : favorites.length === 0 ? (
              <Text style={styles.favoritesHint}>No saved names yet. Generate one and save it.</Text>
            ) : (
              <FlatList
                data={favorites}
                keyExtractor={(item, idx) => item?.id ?? `${item?.full?.hanzi ?? 'fav'}-${idx}`}
                contentContainerStyle={styles.favoritesList}
                renderItem={({ item }) => (
                  <View style={styles.favoriteRow}>
                    <View style={styles.favoriteLeft}>
                      <Text style={[styles.favoriteHanzi, { fontFamily: serifFont }]}>{item?.full?.hanzi}</Text>
                      <Text style={styles.favoritePinyin}>{item?.full?.pinyin}</Text>
                    </View>
                    <Text style={styles.favoriteMeaning} numberOfLines={2}>
                      {item?.full?.meaningEn}
                    </Text>
                  </View>
                )}
              />
            )}
          </View>

          <Pressable style={styles.shareBtn} onPress={() => setShareModalVisible(true)}>
            <Text style={styles.shareBtnText}>Share My Profile</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      {shareModalVisible ? (
        <View style={styles.shareOverlay}>
          <View style={styles.shareSheet}>
            <Text style={styles.shareKicker}>Shareable Cultural Profile</Text>
            <Text style={[styles.shareName, { fontFamily: serifFont }]}>
              {generated?.full?.hanzi ?? 'Unnamed'}
            </Text>
            <Text style={styles.shareSub}>Connected to {provinceStats.connected} regions</Text>
            <Text style={styles.shareSubCn}>已连接 {provinceStats.connected} 个地区</Text>
            <Text style={styles.shareRank}>{cultureRank}</Text>
            <Pressable style={styles.shareClose} onPress={() => setShareModalVisible(false)}>
              <Text style={styles.shareCloseText}>Close</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 8, paddingBottom: 12 },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    letterSpacing: 0.3,
    fontWeight: '600',
  },
  subtitle: {
    lineHeight: 20.8,
    color: theme.colors.mutedText,
    fontSize: 13,
    marginTop: 6,
    marginBottom: 14,
    letterSpacing: 0.2,
  },
  scrollCard: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    overflow: 'hidden',
    minHeight: 210,
  },
  scrollInner: {
    paddingHorizontal: 18,
    paddingVertical: 18,
    justifyContent: 'center',
    minHeight: 210,
  },
  hanzi: {
    color: theme.colors.text,
    fontSize: 56,
    letterSpacing: 2.2,
    fontWeight: '700',
  },
  pinyin: {
    marginTop: 8,
    color: theme.colors.primary,
    fontSize: 14,
    letterSpacing: 1.2,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  meaning: {
    marginTop: 12,
    color: theme.colors.text,
    fontSize: 14,
    lineHeight: 22.4,
    letterSpacing: 0.2,
    opacity: 0.9,
  },
  placeholderHanzi: {
    color: 'rgba(51, 51, 51, 0.22)',
    fontSize: 44,
    letterSpacing: 2.2,
    fontWeight: '700',
  },
  placeholderText: {
    marginTop: 10,
    color: theme.colors.mutedText,
    fontSize: 13,
    letterSpacing: 0.2,
    lineHeight: 20.8,
  },
  form: {
    marginTop: 16,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  label: {
    color: theme.colors.primary,
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  input: {
    marginTop: 8,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: Platform.select({ ios: 11, android: 9, default: 10 }),
    color: theme.colors.text,
    fontSize: 15,
    letterSpacing: 0.2,
    backgroundColor: theme.colors.background,
  },
  traitsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  traitChip: {
    borderRadius: 999,
    borderWidth: 0.5,
    borderColor: 'rgba(179, 59, 36, 0.45)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: 'transparent',
  },
  traitChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  traitText: {
    color: theme.colors.primary,
    fontSize: 12,
    letterSpacing: 0.2,
    fontWeight: '700',
  },
  traitTextActive: {
    color: '#FFFFFF',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  generateBtn: {
    flex: 1,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    borderWidth: 0.5,
    borderColor: theme.colors.primary,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  generateText: {
    color: '#FFFFFF',
    fontSize: 13,
    letterSpacing: 0.8,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  favoriteBtn: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(179, 59, 36, 0.45)',
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'transparent',
  },
  favoriteBtnDisabled: {
    opacity: 0.55,
  },
  favoriteText: {
    color: theme.colors.primary,
    fontSize: 12,
    letterSpacing: 0.6,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  favoriteTextActive: {
    color: '#FFFFFF',
  },
  connectionCard: {
    marginTop: 14,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  connectionLabel: {
    color: theme.colors.primary,
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  connectionTitle: {
    marginTop: 6,
    color: theme.colors.text,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  connectionCount: {
    color: theme.colors.primary,
    fontWeight: '800',
  },
  progressLine: {
    height: 2,
    marginTop: 12,
    backgroundColor: 'rgba(51, 51, 51, 0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: 2,
    backgroundColor: theme.colors.primary,
  },
  provinceWrap: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  provinceTag: {
    borderRadius: 999,
    borderWidth: 0.5,
    borderColor: 'rgba(51, 51, 51, 0.10)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#F2F0EC',
  },
  provinceTagActive: {
    backgroundColor: '#B33B24',
    borderColor: '#B33B24',
  },
  provinceTagText: {
    color: 'rgba(51, 51, 51, 0.55)',
    fontSize: 11,
    fontWeight: '700',
  },
  provinceTagTextActive: {
    color: '#FFFFFF',
  },
  favoritesBlock: {
    flex: 1,
    marginTop: 14,
  },
  favoritesTitle: {
    color: theme.colors.text,
    fontSize: 16,
    letterSpacing: 0.2,
    fontWeight: '700',
  },
  favoritesHint: {
    marginTop: 8,
    color: theme.colors.mutedText,
    fontSize: 12,
    letterSpacing: 0.2,
  },
  favoritesList: {
    paddingTop: 10,
    paddingBottom: 10,
    gap: 10,
  },
  favoriteRow: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  favoriteLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 10,
  },
  favoriteHanzi: {
    color: theme.colors.text,
    fontSize: 26,
    letterSpacing: 1.8,
    fontWeight: '700',
  },
  favoritePinyin: {
    color: theme.colors.primary,
    fontSize: 11,
    letterSpacing: 1.1,
    fontWeight: '800',
    textTransform: 'uppercase',
    opacity: 0.9,
  },
  favoriteMeaning: {
    marginTop: 6,
    color: theme.colors.mutedText,
    fontSize: 12,
    letterSpacing: 0.2,
    lineHeight: 19.2,
  },
  shareBtn: {
    marginTop: 12,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
    paddingVertical: 13,
    alignItems: 'center',
  },
  shareBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    letterSpacing: 0.9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  shareOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(24, 18, 16, 0.92)',
    justifyContent: 'center',
    padding: 24,
  },
  shareSheet: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: '#F7F2EA',
    padding: 24,
    minHeight: 420,
    justifyContent: 'center',
  },
  shareKicker: {
    color: theme.colors.primary,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  shareName: {
    marginTop: 14,
    color: theme.colors.text,
    fontSize: 42,
    fontWeight: '700',
  },
  shareSub: {
    marginTop: 10,
    color: theme.colors.mutedText,
    fontSize: 14,
  },
  shareSubCn: {
    marginTop: 6,
    color: theme.colors.text,
    fontSize: 12,
    opacity: 0.72,
  },
  shareRank: {
    marginTop: 14,
    color: theme.colors.primary,
    fontSize: 20,
    fontWeight: '800',
  },
  shareRank: {
    marginTop: 14,
    color: theme.colors.primary,
    fontSize: 20,
    fontWeight: '800',
  },
  shareClose: {
    marginTop: 26,
    alignSelf: 'flex-start',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  shareCloseText: {
    color: theme.colors.text,
    fontWeight: '700',
  },
});
