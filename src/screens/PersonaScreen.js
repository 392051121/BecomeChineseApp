import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Heart, MapPin, Medal, Share2, Sparkles, Trophy, Volume2, Copy, Check, Bookmark, ArrowRight, Moon, Sun } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import * as Clipboard from 'expo-clipboard';

import { PaperTexture } from '../components/PaperTexture';
import { SealTexture } from '../components/SealTexture';
import { ChinaConnectionMap } from '../components/ChinaConnectionMap';
import { HandscrollContainer } from '../components/HandscrollContainer';
import { StampFeedback } from '../components/StampFeedback';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';
import { BadgesSection, BadgeDetailCard, BadgeSummaryCard, checkBadgeUnlocked } from '../components/BadgesSection';
import { NameShareCard, CollectionShareCard } from '../components/ShareCards';
import { ShareCardPreviewModal } from '../components/ShareCardPreviewModal';
import { SkeletonListItem } from '../components/Skeleton';
import { cities } from '../data/cities';
import { recipes } from '../data/recipes';
import { dynasties } from '../data/dynasties';
import { generateChineseName, getTraitOptions } from '../data/chineseNameGenerator';
import {
  addNameFavorite,
  incrementNamesGenerated,
  buildProvinceStats,
  getCultureRank,
  getFavoritesSnapshot,
  getProvinceConnectionMap,
  getProvinceId,
  getCulturalAssets,
} from '../utils/culturalAssets';
import { generateAtlasShareText, shareText, shareViewAsImage } from '../utils/sharing';
import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

export function PersonaScreen() {
  const navigation = useNavigation();
  const { colors, isDark, toggleTheme, preference, setTheme } = useTheme();
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
  const [activeInsight, setActiveInsight] = useState('rank');
  const [collectedCities, setCollectedCities] = useState([]);
  const [collectedRecipes, setCollectedRecipes] = useState([]);
  const [collectedDynasties, setCollectedDynasties] = useState([]);
  const [quizStreak, setQuizStreak] = useState(0);
  const [quizTotalSolved, setQuizTotalSolved] = useState(0);
  const [namesGenerated, setNamesGenerated] = useState(0);
  const [copied, setCopied] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [showShareCard, setShowShareCard] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const shareCardRef = useRef(null);

  const traitOptions = useMemo(() => getTraitOptions(), []);

  // Track mounted state for async operations
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    (async () => {
      try {
        const assets = await getCulturalAssets();
        if (!mountedRef.current) return;
        setFavorites(Array.isArray(assets?.favorites?.names) ? assets.favorites.names : []);
        setCollectedCities(Array.isArray(assets?.favorites?.cities) ? assets.favorites.cities : []);
        setCollectedRecipes(Array.isArray(assets?.favorites?.recipes) ? assets.favorites.recipes : []);
        setCollectedDynasties(Array.isArray(assets?.favorites?.dynasties) ? assets.favorites.dynasties : []);
        setQuizStreak(assets?.quiz?.streak ?? 0);
        setQuizTotalSolved(assets?.quiz?.totalSolved ?? 0);
        setNamesGenerated(assets?.stats?.namesGenerated ?? 0);
      } catch {
        if (!mountedRef.current) return;
        setFavorites([]);
        setCollectedCities([]);
        setCollectedRecipes([]);
        setCollectedDynasties([]);
        setQuizStreak(0);
        setQuizTotalSolved(0);
        setNamesGenerated(0);
      } finally {
        if (mountedRef.current) setLoadingFavorites(false);
      }
    })();

    return () => {
      mountedRef.current = false;
      Speech.stop();
    };
  }, []);

  function toggleTrait(traitKey) {
    setSelectedTraits((prev) => (prev.includes(traitKey) ? prev.filter((t) => t !== traitKey) : [...prev, traitKey]));
  }

  function handleGenerate() {
    const next = generateChineseName({ englishName, traitKeys: selectedTraits });
    setGenerated(next);
    setNamesGenerated((prev) => prev + 1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    // Track names generated for badge progress
    incrementNamesGenerated().catch(() => {});
  }

  function speakChineseName() {
    if (!generated?.full?.hanzi) return;
    Haptics.selectionAsync().catch(() => {});
    Speech.stop();
    Speech.speak(`${generated.full.hanzi}。${generated.full.pinyin}`, {
      language: 'zh-CN',
      rate: 0.92,
      pitch: 0.98,
    }).catch(() => {});
  }

  const isFavorited = useMemo(() => {
    if (!generated) return false;
    return favorites.some((f) => f?.full?.hanzi === generated.full.hanzi && f?.full?.pinyin === generated.full.pinyin);
  }, [favorites, generated]);

  const provinceStats = useMemo(
    () =>
      buildProvinceStats({
        favorites: {
          names: favorites,
          cities: collectedCities,
          recipes: collectedRecipes,
          dynasties: collectedDynasties,
        },
        cities,
        recipes,
      }),
    [favorites, collectedCities, collectedRecipes, collectedDynasties]
  );

  const connectionMap = useMemo(
    () => getProvinceConnectionMap({ favorites: { names: favorites, cities: collectedCities, recipes: collectedRecipes, dynasties: collectedDynasties }, cities, recipes, dynasties }),
    [favorites, collectedCities, collectedRecipes, collectedDynasties]
  );

  const connectedProvinces = useMemo(() => {
    const set = new Set();
    [...favorites, ...collectedCities, ...collectedRecipes, ...collectedDynasties].forEach((item) => {
      const provinceId = getProvinceId(item);
      if (provinceId && provinceId !== 'General') set.add(provinceId);
    });
    return set;
  }, [favorites, collectedCities, collectedRecipes, collectedDynasties]);

  async function handleFavorite() {
    if (!generated || isFavorited) return;
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

  // Badge stats - defined after connectionMap and cultureRank
  const badgeStats = useMemo(() => ({
    quizStreak,
    quizTotal: quizTotalSolved,
    citiesCollected: collectedCities.length,
    recipesCollected: collectedRecipes.length,
    dynastiesCollected: collectedDynasties.length,
    provincesConnected: connectionMap.collectedCount,
    namesGenerated,
    namesSaved: favorites.length,
    rank: cultureRank,
    usedHistory: true,
    usedFood: true,
    usedPlaces: true,
    usedQuiz: quizTotalSolved > 0,
  }), [quizStreak, quizTotalSolved, collectedCities.length, collectedRecipes.length, collectedDynasties.length, connectionMap.collectedCount, namesGenerated, favorites.length, cultureRank]);

  const milestoneItems = [
    { label: 'Quiz', active: quizTotalSolved >= 1, hint: 'Solve 1 daily question' },
    { label: 'Places', active: collectedCities.length >= 1, hint: 'Save 1 city' },
    { label: 'Food', active: collectedRecipes.length >= 1, hint: 'Save 1 dish' },
    { label: 'History', active: collectedDynasties.length >= 1, hint: 'Save 1 dynasty' },
    { label: 'Profile', active: !!generated, hint: 'Generate a Chinese name' },
    { label: 'Atlas', active: connectionMap.collectedCount >= 3, hint: 'Connect 3 provinces' },
  ];

  async function handleShare() {
    if (!generated) return;

    // Show preview modal
    setShowShareModal(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  }

  function handleCloseShareModal() {
    setShowShareModal(false);
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView style={styles.safeArea} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <HandscrollContainer style={styles.scrollShell}>
          <View style={styles.container}>
            <ScreenHeader
              kicker="Profile"
              title="Your Archive"
              subtitle="See what you have built, collected, and unlocked."
              align="center"
              style={styles.header}
              includeTopInset={false}
            />

            {/* Theme Toggle */}
            <View style={styles.themeToggleRow}>
              <Pressable
                style={[styles.themeBtn, preference === 'light' && styles.themeBtnActive]}
                onPress={() => setTheme('light')}
                accessibilityRole="button"
                accessibilityLabel="Light theme"
                accessibilityHint="Double tap to enable light theme"
              >
                <Sun size={16} color={preference === 'light' ? colors.primary : colors.mutedText} strokeWidth={2} />
                <Text style={[styles.themeBtnText, preference === 'light' && { color: colors.primary }]}>Light</Text>
              </Pressable>
              <Pressable
                style={[styles.themeBtn, preference === 'system' && styles.themeBtnActive]}
                onPress={() => setTheme('system')}
                accessibilityRole="button"
                accessibilityLabel="System theme"
                accessibilityHint="Double tap to follow system theme"
              >
                <Text style={[styles.themeBtnText, preference === 'system' && { color: colors.primary }]}>Auto</Text>
              </Pressable>
              <Pressable
                style={[styles.themeBtn, preference === 'dark' && styles.themeBtnActive]}
                onPress={() => setTheme('dark')}
                accessibilityRole="button"
                accessibilityLabel="Dark theme"
                accessibilityHint="Double tap to enable dark theme"
              >
                <Moon size={16} color={preference === 'dark' ? colors.primary : colors.mutedText} strokeWidth={2} />
                <Text style={[styles.themeBtnText, preference === 'dark' && { color: colors.primary }]}>Dark</Text>
              </Pressable>
            </View>

            {/* Identity hero - primary artifact */}
            <SectionCard style={[styles.identityHeroCard, { backgroundColor: colors.softCard }]} tone="soft">
              <PaperTexture />
              <View style={styles.identityHeroTopRow}>
                <View style={styles.identityHeroLabelWrap}>
                  <Trophy size={14} color={colors.primary} strokeWidth={2} />
                  <Text style={[styles.identityHeroLabel, { color: colors.primary }]}>Identity Hero</Text>
                </View>
                <View style={[styles.identityHeroBadge, generated && styles.identityHeroBadgeActive]}>
                  <Text style={[styles.identityHeroBadgeText, generated && styles.identityHeroBadgeTextActive]}>
                    {generated ? (isFavorited ? 'Saved' : 'New') : 'Ready'}
                  </Text>
                </View>
              </View>
              {generated ? (
                <>
                  <View style={styles.hanziWrap}>
                    <Text style={[styles.hanzi, { fontFamily: serifFont, color: colors.text }]}>{generated.full.hanzi}</Text>
                  </View>
                  <Text style={[styles.pinyin, { color: colors.primary }]}>{generated.full.pinyin}</Text>
                  <Text style={[styles.meaning, { color: colors.text }]}>{generated.full.meaningEn}</Text>
                  <View style={styles.identitySummaryRow}>
                    <View style={[styles.identitySummaryPill, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                      <Medal size={12} color={colors.primary} strokeWidth={2} />
                      <Text style={[styles.identitySummaryText, { color: colors.mutedText }]}>Rank {cultureRank}</Text>
                    </View>
                    <View style={[styles.identitySummaryPill, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                      <MapPin size={12} color={colors.primary} strokeWidth={2} />
                      <Text style={[styles.identitySummaryText, { color: colors.mutedText }]}>{provinceStats.connected} regions</Text>
                    </View>
                  </View>
                  <View style={styles.scrollActions}>
                    <Pressable style={[styles.primaryAction, { backgroundColor: colors.primary }]} onPress={speakChineseName} accessibilityRole="button" accessibilityLabel="Read name aloud" accessibilityHint="Double tap to hear pronunciation">
                      <Volume2 size={14} color="#FFFFFF" strokeWidth={2} />
                      <Text style={styles.primaryActionText}>Read</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.secondaryAction, isFavorited && styles.secondaryActionActive]}
                      onPress={handleFavorite}
                      disabled={!generated || isFavorited}
                      accessibilityRole="button"
                      accessibilityLabel={isFavorited ? "Name saved" : "Save name"}
                      accessibilityHint={isFavorited ? "Already saved" : "Double tap to save this name"}
                    >
                      <Heart
                        size={14}
                        color={isFavorited ? '#FFFFFF' : colors.primary}
                        fill={isFavorited ? '#FFFFFF' : 'transparent'}
                        strokeWidth={2}
                      />
                      <Text style={[styles.secondaryActionText, isFavorited && styles.secondaryActionTextActive]}>
                        {isFavorited ? 'Saved' : 'Save'}
                      </Text>
                    </Pressable>
                  </View>
                </>
              ) : (
                <>
                  <Text style={[styles.placeholderHanzi, { fontFamily: serifFont }]}>Create your identity</Text>
                  <Text style={[styles.placeholderText, { color: colors.mutedText }]}>Enter an English name below, choose a style, and generate a Chinese name.</Text>
                </>
              )}
            </SectionCard>

            {/* Name generator */}
            <SectionCard style={[styles.generatorCard, { backgroundColor: colors.surface }]} tone="panel">
              <View style={styles.generatorHeader}>
                <Sparkles size={14} color={colors.primary} strokeWidth={2} />
                <Text style={[styles.sectionLabel, { color: colors.primary }]}>Name Generator</Text>
              </View>
              <TextInput
                value={englishName}
                onChangeText={setEnglishName}
                placeholder="Enter an English name"
                placeholderTextColor={colors.mutedText}
                style={[styles.input, { borderColor: colors.border, backgroundColor: colors.background, color: colors.text }]}
              />
              <View style={styles.traitsRow}>
                {traitOptions.map((trait) => {
                  const active = selectedTraits.includes(trait.key);
                  return (
                    <Pressable
                      key={trait.key}
                      style={[styles.traitChip, active && styles.traitChipActive]}
                      onPress={() => toggleTrait(trait.key)}
                      accessibilityRole="button"
                      accessibilityLabel={`${trait.label} style`}
                      accessibilityHint={active ? "Selected. Double tap to deselect" : "Double tap to select"}
                    >
                      <Text style={[styles.traitText, active && styles.traitTextActive]}>{trait.label}</Text>
                    </Pressable>
                  );
                })}
              </View>
              <View style={styles.actionsRow}>
                <Pressable style={styles.generateBtn} onPress={handleGenerate} accessibilityRole="button" accessibilityLabel={generated ? "Regenerate name" : "Generate name"} accessibilityHint="Double tap to generate a Chinese name">
                  <Sparkles size={14} color="#FFFFFF" strokeWidth={2} />
                  <Text style={styles.generateText}>{generated ? 'Regenerate' : 'Generate'}</Text>
                </Pressable>
              </View>
            </SectionCard>

            {/* Atlas progress */}
            <SectionCard style={styles.connectionCard} tone="soft">
              <View style={styles.sectionHeaderInline}>
                <View style={styles.connectionLabelWrap}>
                  <MapPin size={14} color={theme.colors.primary} strokeWidth={2} />
                  <Text style={styles.connectionLabel}>Atlas Progress</Text>
                </View>
                <Text style={styles.connectionCount}>{connectionMap.collectedCount}</Text>
              </View>
              <Text style={styles.connectionStory}>Your connected provinces and saved names accumulate here.</Text>
              <View style={styles.progressLine}>
                <View style={[styles.progressFill, { width: `${Math.max(8, (connectionMap.collectedCount / Math.max(1, connectionMap.totalCount)) * 100)}%` }]} />
              </View>
              <View style={styles.mapWrap}>
                <ChinaConnectionMap connectedProvinces={connectedProvinces} />
                <View style={styles.provincePills}>
                  {Array.from(connectedProvinces).slice(0, 8).map((provinceId) => (
                    <View key={provinceId} style={styles.provincePill}>
                      <Text style={styles.provincePillText}>{provinceId}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </SectionCard>

            {/* Stats row */}
            <View style={styles.badgeRow}>
              <Pressable style={[styles.badgeStat, activeInsight === 'rank' && styles.badgeStatActive]} onPress={() => setActiveInsight('rank')} accessibilityRole="button" accessibilityLabel={`Rank: ${cultureRank}`} accessibilityHint="Double tap to view rank insight">
                <Medal size={16} color={activeInsight === 'rank' ? theme.colors.primary : theme.colors.mutedText} strokeWidth={2} />
                <Text style={styles.badgeStatLabel}>Rank</Text>
                <Text style={styles.badgeStatValue}>{cultureRank}</Text>
              </Pressable>
              <Pressable style={[styles.badgeStat, activeInsight === 'regions' && styles.badgeStatActive]} onPress={() => setActiveInsight('regions')} accessibilityRole="button" accessibilityLabel={`Regions: ${provinceStats.connected}`} accessibilityHint="Double tap to view regions insight">
                <MapPin size={16} color={activeInsight === 'regions' ? theme.colors.primary : theme.colors.mutedText} strokeWidth={2} />
                <Text style={styles.badgeStatLabel}>Regions</Text>
                <Text style={styles.badgeStatValue}>{provinceStats.connected}</Text>
              </Pressable>
              <Pressable style={[styles.badgeStat, activeInsight === 'saved' && styles.badgeStatActive]} onPress={() => setActiveInsight('saved')} accessibilityRole="button" accessibilityLabel={`Saved: ${favorites.length} names`} accessibilityHint="Double tap to view saved insight">
                <Heart size={16} color={activeInsight === 'saved' ? theme.colors.primary : theme.colors.mutedText} strokeWidth={2} />
                <Text style={styles.badgeStatLabel}>Saved</Text>
                <Text style={styles.badgeStatValue}>{favorites.length}</Text>
              </Pressable>
            </View>

            {/* Collection Link */}
            <Pressable
              style={styles.collectionLinkCard}
              onPress={() => navigation.navigate('Collection')}
              accessibilityRole="button"
              accessibilityLabel={`Your Collection: ${collectedCities.length + collectedRecipes.length + collectedDynasties.length} items saved`}
              accessibilityHint="Double tap to view your collection"
            >
              <View style={styles.collectionLinkIcon}>
                <Bookmark size={20} color={theme.colors.primary} strokeWidth={2} />
              </View>
              <View style={styles.collectionLinkContent}>
                <Text style={styles.collectionLinkTitle}>Your Collection</Text>
                <Text style={styles.collectionLinkTitleCn}>你的收藏</Text>
                <Text style={styles.collectionLinkSubtitle}>
                  {collectedCities.length + collectedRecipes.length + collectedDynasties.length} items saved
                </Text>
              </View>
              <ArrowRight size={16} color={theme.colors.primary} strokeWidth={2} />
            </Pressable>

            {/* Insight */}
            <SectionCard style={styles.insightCard} tone="soft">
              <Text style={styles.sectionLabel}>Insight</Text>
              <Text style={styles.insightText}>
                {activeInsight === 'rank'
                  ? `Your current culture rank is ${cultureRank}. Keep solving and collecting to move up.`
                  : activeInsight === 'regions'
                  ? `You have connected ${provinceStats.connected} regions. Save cities, dishes, and dynasties to expand your map.`
                  : `You have saved ${favorites.length} names. Your archive is becoming more personal.`}
              </Text>
            </SectionCard>

            {/* Achievements / Badges */}
            <BadgesSection
              stats={badgeStats}
              onBadgePress={(badge) => setSelectedBadge(badge)}
            />

            {/* Milestones - reward wall */}
            <View style={styles.sealWallCard}>
              <View style={styles.sealHeaderRow}>
                <View style={styles.sealHeaderLabelWrap}>
                  <Trophy size={14} color={theme.colors.primary} strokeWidth={2} />
                  <Text style={styles.sealWallLabel}>Milestones</Text>
                </View>
                <Text style={styles.sealWallBadge}>{milestoneItems.filter((m) => m.active).length}/{milestoneItems.length}</Text>
              </View>
              <Text style={styles.sealWallTitle}>What your actions have unlocked.</Text>
              <View style={styles.sealGrid}>
                {milestoneItems.map((item) => (
                  <View key={item.label} style={[styles.sealTile, item.active && styles.sealTileActive]}>
                    <SealTexture opacity={item.active ? 0.14 : 0.04} />
                    <Text style={[styles.sealTileText, item.active && styles.sealTileTextActive]}>{item.label}</Text>
                    <Text style={styles.sealTileHint}>{item.hint}</Text>
                    <StampFeedback label={item.active ? 'Unlocked' : 'Pending'} active={item.active} style={styles.sealStamp} />
                  </View>
                ))}
              </View>
            </View>

            {/* Saved names */}
            <SectionCard style={styles.favoritesCard} tone="panel">
              <View style={styles.favoritesHeaderRow}>
                <Text style={styles.favoritesTitle}>Saved Names</Text>
                <View style={styles.favoritesCountPill}>
                  <Text style={styles.favoritesCount}>{favorites.length}</Text>
                </View>
              </View>
              {loadingFavorites ? (
                <View style={styles.favoritesLoading}>
                  <SkeletonListItem style={{ marginBottom: 8 }} />
                  <SkeletonListItem style={{ marginBottom: 8 }} />
                  <SkeletonListItem />
                </View>
              ) : favorites.length === 0 ? (
                <View style={styles.favoritesEmptyCard}>
                  <Text style={styles.favoritesHint}>No saved names yet. Generate one and save it.</Text>
                </View>
              ) : (
                <View style={styles.favoritesList}>
                  {favorites.map((item, idx) => (
                    <View key={item?.id ?? `${item?.full?.hanzi ?? 'fav'}-${idx}`} style={styles.favoriteRow}>
                      <View style={styles.favoriteLeft}>
                        <Text style={[styles.favoriteHanzi, { fontFamily: serifFont }]}>{item?.full?.hanzi}</Text>
                        <Text style={styles.favoritePinyin}>{item?.full?.pinyin}</Text>
                      </View>
                      <Text style={styles.favoriteMeaning} numberOfLines={2}>{item?.full?.meaningEn}</Text>
                    </View>
                  ))}
                </View>
              )}
            </SectionCard>

            {/* Share button */}
            <Pressable style={[styles.shareBtn, !generated && styles.shareBtnDisabled]} onPress={handleShare} disabled={!generated} accessibilityRole="button" accessibilityLabel="Share name card" accessibilityHint={!generated ? "Generate a name first" : "Double tap to share your name card"}>
              {copied ? (
                <>
                  <Check size={16} color="#FFFFFF" strokeWidth={2} />
                  <Text style={styles.shareBtnText}>Copied!</Text>
                </>
              ) : (
                <>
                  <Copy size={16} color="#FFFFFF" strokeWidth={2} />
                  <Text style={[styles.shareBtnText, !generated && styles.shareBtnTextDisabled]}>Share Name Card</Text>
                </>
              )}
            </Pressable>
            {generated ? <StampFeedback label="Atlas Updated" active={true} style={styles.stampFeedback} /> : null}
          </View>
        </HandscrollContainer>
      </KeyboardAvoidingView>

      {/* Badge Detail Modal */}
      {selectedBadge ? (
        <View style={styles.badgeModalOverlay} accessible={true} accessibilityLabel="Badge details modal" accessibilityRole="dialog">
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setSelectedBadge(null)} accessibilityLabel="Close badge details" accessibilityRole="button" />
          <View style={styles.badgeModalContent}>
            <BadgeDetailCard
              badge={selectedBadge}
              isUnlocked={checkBadgeUnlocked(selectedBadge, badgeStats)}
            />
            <Pressable style={styles.badgeModalClose} onPress={() => setSelectedBadge(null)} accessibilityRole="button" accessibilityLabel="Close" accessibilityHint="Double tap to close badge details">
              <Text style={styles.badgeModalCloseText}>Close</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      {/* Share Card Preview Modal */}
      <ShareCardPreviewModal
        visible={showShareModal}
        onClose={handleCloseShareModal}
        cardRef={shareCardRef}
        card={
          generated && (
            <NameShareCard
              name={generated.full.hanzi}
              pinyin={generated.full.pinyin}
              meaning={generated.full.meaningEn}
              rank={cultureRank}
            />
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollShell: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 100 },
  header: { marginBottom: 10 },

  // Theme toggle
  themeToggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 14,
  },
  themeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    borderWidth: 0.5,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 44,
  },
  themeBtnActive: {
    borderWidth: 1,
  },
  themeBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // Identity hero
  identityHeroCard: { marginTop: 14, padding: 18, overflow: 'hidden' },
  identityHeroTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  identityHeroLabelWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  identityHeroLabel: { fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: '800' },
  identityHeroBadge: { backgroundColor: 'rgba(161, 63, 46, 0.10)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  identityHeroBadgeActive: { backgroundColor: 'rgba(166, 114, 61, 0.15)' },
  identityHeroBadgeText: { color: theme.colors.text, fontSize: 10, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },
  identityHeroBadgeTextActive: { color: theme.colors.success },
  hanziWrap: { marginTop: 16, alignItems: 'center' },
  hanzi: { color: theme.colors.text, fontSize: 64, letterSpacing: 4, fontWeight: '700' },
  pinyin: { marginTop: 10, color: theme.colors.primary, fontSize: 15, letterSpacing: 1.4, fontWeight: '700', textTransform: 'uppercase', textAlign: 'center' },
  meaning: { marginTop: 12, color: theme.colors.text, fontSize: 15, lineHeight: 22, letterSpacing: 0.2, textAlign: 'center', opacity: 0.9 },
  identitySummaryRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 10, marginTop: 16 },
  identitySummaryPill: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 999, borderWidth: 0.5, borderColor: theme.colors.border, backgroundColor: theme.colors.surface, paddingHorizontal: 12, paddingVertical: 6 },
  identitySummaryText: { color: theme.colors.mutedText, fontSize: 11, letterSpacing: 0.6, fontWeight: '700', textTransform: 'uppercase' },
  scrollActions: { flexDirection: 'row', gap: 10, marginTop: 18 },
  primaryAction: { flex: 1, minHeight: 46, borderRadius: 10, backgroundColor: theme.colors.primary, paddingHorizontal: 14, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryActionText: { color: '#FFFFFF', fontSize: 13, letterSpacing: 0.6, fontWeight: '800', textTransform: 'uppercase' },
  secondaryAction: { flex: 1, minHeight: 46, borderRadius: 10, backgroundColor: '#FFFFFF', borderWidth: 0.5, borderColor: theme.colors.border, paddingHorizontal: 14, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  secondaryActionActive: { backgroundColor: '#FFF5F0', borderColor: 'rgba(161, 63, 46, 0.30)' },
  secondaryActionText: { color: theme.colors.primary, fontSize: 13, letterSpacing: 0.6, fontWeight: '800', textTransform: 'uppercase' },
  secondaryActionTextActive: { color: theme.colors.primary },
  placeholderHanzi: { color: 'rgba(51, 51, 51, 0.22)', fontSize: 48, letterSpacing: 3, fontWeight: '700', textAlign: 'center' },
  placeholderText: { marginTop: 12, color: theme.colors.mutedText, fontSize: 13, letterSpacing: 0.2, lineHeight: 20, textAlign: 'center' },

  // Generator
  generatorCard: { marginTop: 14, padding: 16, backgroundColor: theme.colors.surface },
  generatorHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  sectionLabel: { color: theme.colors.primary, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: '800' },
  input: { borderRadius: 8, borderWidth: 0.5, borderColor: theme.colors.border, paddingHorizontal: 14, paddingVertical: Platform.select({ ios: 12, android: 10, default: 11 }), color: theme.colors.text, fontSize: 15, letterSpacing: 0.2, backgroundColor: theme.colors.background },
  traitsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  traitChip: { borderRadius: 999, borderWidth: 0.5, borderColor: 'rgba(161, 63, 46, 0.40)', paddingHorizontal: 14, paddingVertical: 10, backgroundColor: 'transparent', minHeight: 44, justifyContent: 'center' },
  traitChipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  traitText: { color: theme.colors.primary, fontSize: 12, letterSpacing: 0.2, fontWeight: '700' },
  traitTextActive: { color: '#FFFFFF' },
  actionsRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  generateBtn: { flex: 1, borderRadius: 8, backgroundColor: theme.colors.primary, borderWidth: 0.5, borderColor: theme.colors.primary, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  generateText: { color: '#FFFFFF', fontSize: 13, letterSpacing: 0.6, fontWeight: '800', textTransform: 'uppercase' },

  // Connection card
  connectionCard: { marginTop: 14, borderRadius: theme.radii.lg, borderWidth: 0.5, borderColor: theme.colors.border, backgroundColor: theme.colors.surface, paddingHorizontal: 16, paddingVertical: 16, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 2 },
  sectionHeaderInline: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 },
  connectionLabelWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  connectionLabel: { color: theme.colors.primary, fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: '800' },
  connectionCount: { color: theme.colors.primary, fontWeight: '800', fontSize: 20 },
  connectionStory: { marginTop: 8, color: theme.colors.mutedText, fontSize: 12, lineHeight: 18, letterSpacing: 0.2 },
  progressLine: { height: 3, marginTop: 14, backgroundColor: 'rgba(51, 51, 51, 0.08)', overflow: 'hidden', borderRadius: 2 },
  progressFill: { height: 3, backgroundColor: theme.colors.primary, borderRadius: 2 },
  mapWrap: { marginTop: 14 },
  provincePills: { marginTop: 14, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  provincePill: { borderRadius: 999, borderWidth: 0.5, borderColor: 'rgba(51, 51, 51, 0.10)', paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#F2F0EC' },
  provincePillText: { color: 'rgba(51, 51, 51, 0.55)', fontSize: 11, fontWeight: '700' },

  // Badge row
  badgeRow: { flexDirection: 'row', gap: 10, marginTop: 14, flexWrap: 'wrap' },
  badgeStat: { flex: 1, minWidth: '30%', borderRadius: theme.radii.md, borderWidth: 0.5, borderColor: theme.colors.border, backgroundColor: theme.colors.card, padding: 14, alignItems: 'center', gap: 4 },
  badgeStatActive: { borderColor: theme.colors.primary, backgroundColor: '#FFF5F0' },
  badgeStatLabel: { color: theme.colors.mutedText, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: '800' },
  badgeStatValue: { marginTop: 6, color: theme.colors.text, fontSize: 18, fontWeight: '700' },

  // Collection Link
  collectionLinkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 14,
    borderRadius: theme.radii.lg,
    borderWidth: 0.5,
    borderColor: theme.colors.borderAccent,
    backgroundColor: theme.colors.softCard,
    padding: 16,
  },
  collectionLinkIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: theme.colors.cinnabarGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  collectionLinkContent: {
    flex: 1,
  },
  collectionLinkTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  collectionLinkTitleCn: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  collectionLinkSubtitle: {
    color: theme.colors.mutedText,
    fontSize: 11,
    marginTop: 4,
  },

  // Insight
  insightCard: { marginTop: 12, padding: 14, backgroundColor: theme.colors.surface },
  insightText: { marginTop: 8, color: theme.colors.text, fontSize: 13, lineHeight: 20 },

  // Milestones
  sealWallCard: { marginTop: 14, borderRadius: theme.radii.lg, borderWidth: 0.5, borderColor: theme.colors.border, backgroundColor: theme.colors.card, padding: 16, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 2 },
  sealHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  sealHeaderLabelWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sealWallLabel: { color: theme.colors.primary, fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: '800' },
  sealWallBadge: { color: theme.colors.text, fontSize: 11, fontWeight: '800', letterSpacing: 0.8, textTransform: 'uppercase', backgroundColor: 'rgba(161, 63, 46, 0.10)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  sealWallTitle: { marginTop: 8, color: theme.colors.text, fontSize: 17, lineHeight: 24, fontWeight: '700' },
  sealGrid: { marginTop: 14, flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  sealTile: { width: '48%', minHeight: 110, borderRadius: theme.radii.md, borderWidth: 0.5, borderColor: theme.colors.border, backgroundColor: theme.colors.surface, padding: 12, overflow: 'hidden' },
  sealTileActive: { borderColor: theme.colors.primary, backgroundColor: '#F7F2EA' },
  sealTileText: { marginTop: 8, color: theme.colors.mutedText, fontSize: 13, fontWeight: '700', letterSpacing: 0.4 },
  sealTileTextActive: { color: theme.colors.text },
  sealTileHint: { marginTop: 4, color: theme.colors.mutedText, fontSize: 10, opacity: 0.7 },
  sealStamp: { marginTop: 8 },

  // Favorites
  favoritesCard: { marginTop: 14, padding: 16, backgroundColor: theme.colors.surface },
  favoritesHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  favoritesTitle: { color: theme.colors.text, fontSize: 17, letterSpacing: 0.1, fontWeight: '700' },
  favoritesCountPill: { backgroundColor: 'rgba(161, 63, 46, 0.10)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  favoritesCount: { color: theme.colors.primary, fontSize: 12, fontWeight: '800', letterSpacing: 0.6 },
  favoritesLoading: { marginTop: 12 },
  favoritesHint: { marginTop: 10, color: theme.colors.mutedText, fontSize: 12, letterSpacing: 0.2 },
  favoritesEmptyCard: { marginTop: 12, borderRadius: theme.radii.md, borderWidth: 0.5, borderColor: theme.colors.border, backgroundColor: '#FBF7F1', padding: 14 },
  favoritesList: { paddingTop: 12, paddingBottom: 8, gap: 10 },
  favoriteRow: { borderRadius: 8, borderWidth: 0.5, borderColor: theme.colors.border, backgroundColor: theme.colors.card, paddingHorizontal: 14, paddingVertical: 12 },
  favoriteLeft: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 },
  favoriteHanzi: { color: theme.colors.text, fontSize: 28, letterSpacing: 2, fontWeight: '700' },
  favoritePinyin: { color: theme.colors.primary, fontSize: 11, letterSpacing: 1.2, fontWeight: '800', textTransform: 'uppercase', opacity: 0.9 },
  favoriteMeaning: { marginTop: 8, color: theme.colors.mutedText, fontSize: 12, letterSpacing: 0.2, lineHeight: 18 },

  // Share
  shareCardWrap: {
    position: 'absolute',
    left: -10000,
    top: -10000,
    opacity: 0,
  },
  shareBtn: { marginTop: 14, borderRadius: 8, borderWidth: 0.5, borderColor: theme.colors.primary, backgroundColor: theme.colors.primary, paddingVertical: 15, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  shareBtnDisabled: { opacity: 0.45 },
  shareBtnText: { color: '#FFFFFF', fontSize: 13, letterSpacing: 0.8, fontWeight: '800', textTransform: 'uppercase' },
  shareBtnTextDisabled: { color: '#FFFFFF' },
  stampFeedback: { marginTop: 12, alignItems: 'center' },

  // Badge Modal
  badgeModalOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(24, 18, 16, 0.85)', justifyContent: 'center', padding: 20 },
  badgeModalContent: { backgroundColor: theme.colors.background, borderRadius: theme.radii.lg, padding: 16 },
  badgeModalClose: { marginTop: 16, alignSelf: 'center', borderRadius: theme.radii.md, borderWidth: 0.5, borderColor: theme.colors.border, paddingHorizontal: 20, paddingVertical: 12, backgroundColor: theme.colors.surface },
  badgeModalCloseText: { color: theme.colors.text, fontWeight: '700', fontSize: 13 },
});
