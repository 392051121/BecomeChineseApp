import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
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
} from 'lucide-react-native';

import { dynasties } from '../data/dynasties';
import { SmartImageBlock } from '../components/SmartImageBlock';
import { getLocalImage } from '../assets/localImages';
import { theme } from '../theme/theme';

function contributionIcon(iconKey) {
  switch (iconKey) {
    case 'feather':
      return Feather;
    case 'book':
      return Book;
    case 'waves':
      return Waves;
    case 'scroll':
      return Scroll;
    case 'ruler':
      return Ruler;
    case 'route':
      return Route;
    case 'swords':
      return Swords;
    case 'pen':
      return PenTool;
    case 'bridge':
      return Building2;
    case 'lamp':
      return Lamp;
    case 'globe':
      return Globe;
    case 'anchor':
      return Anchor;
    case 'crown':
      return Crown;
    default:
      return Sparkles;
  }
}

function getEmperorSections(item) {
  const emperors = item.emperors ?? [];
  switch (item.id) {
    case 'zhou':
      return [
        { key: 'western-zhou', title: '西周', emperors: emperors.slice(0, 13) },
        { key: 'eastern-zhou', title: '东周', emperors: emperors.slice(13) },
      ];
    case 'han':
      return [
        { key: 'western-han', title: '西汉', emperors: emperors.slice(0, 13) },
        { key: 'eastern-han', title: '东汉', emperors: emperors.slice(13) },
      ];
    case 'jin':
      return [
        { key: 'western-jin', title: '西晋', emperors: emperors.slice(0, 4) },
        { key: 'eastern-jin', title: '东晋', emperors: emperors.slice(4) },
      ];
    case 'song':
      return [
        { key: 'northern-song', title: '北宋', emperors: emperors.slice(0, 9) },
        { key: 'southern-song', title: '南宋', emperors: emperors.slice(9) },
      ];
    default:
      return [{ key: 'all', title: '朝代君主', emperors }];
  }
}

export function HistoryScreen() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const cardWidth = Math.max(width - 56, 300);
  const sideInset = (width - cardWidth) / 2;
  const scrollX = useRef(new Animated.Value(0)).current;
  const [expandedSections, setExpandedSections] = useState({});

  const inputRange = useMemo(
    () => dynasties.map((_, i) => i * width),
    [width]
  );
  const backgroundColor = scrollX.interpolate({
    inputRange,
    outputRange: dynasties.map((_, i) => (i % 2 === 0 ? '#FDFBF7' : '#F2EFE8')),
    extrapolate: 'clamp',
  });
  function toggleSection(sectionKey) {
    setExpandedSections((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.dynamicBackdrop, { backgroundColor }]} />

      <View style={styles.container}>
        <Text style={styles.title}>Chinese Dynasties</Text>
        <Text style={styles.subtitle}>Trace China’s imperial history through rulers, institutions, objects, writing, and everyday life — with Chinese names preserved as a second layer.</Text>
        <View style={styles.titleDivider} />

        <Animated.ScrollView
          horizontal
          pagingEnabled
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          snapToInterval={width}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContent}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
        >
          {dynasties.map((item) => (
            <View key={item.id} style={[styles.page, { width }]}>
              <Pressable
                style={[styles.card, { width: cardWidth, marginHorizontal: sideInset }]}
                onPress={() => navigation.navigate('DynastyDetail', { dynastyId: item.id })}
              >
                <Text style={styles.calligraphy}>{item.nameEn}</Text>
                <Text style={styles.bgTitle}>{item.nameCn}</Text>

                <View style={styles.cardInner}>
                  <ScrollView
                    style={styles.innerScroll}
                    contentContainerStyle={styles.innerScrollContent}
                    showsVerticalScrollIndicator={false}
                  >
                    <Text style={styles.period}>{item.years ?? item.period}</Text>
                    <Text style={styles.nameEn}>{item.nameEn}</Text>
                    <Text style={styles.nameCnInline}>{item.nameCn}</Text>
                    <Text style={styles.tagline}>{item.tagline}</Text>

                    <View style={styles.artifactFrame}>
                      <SmartImageBlock
                        source={getLocalImage('dynasties', item.imageAsset)}
                        uri={item.image}
                        label={item.imagePlaceholderText}
                        style={styles.artifactImage}
                        overlayOpacity={0.1}
                      />
                    </View>

                    <View style={styles.footerInfo}>
                      <Text style={styles.metaLabel}>World Context / 世界参照</Text>
                      <Text style={styles.metaText}>{item.worldContext}</Text>

                      <View style={styles.contributionRow}>
                        <View style={styles.contributionBadge}>
                          {(() => {
                            const Icon = contributionIcon(item.contribution?.icon);
                            return <Icon size={14} color={theme.colors.primary} strokeWidth={2} />;
                          })()}
                        </View>
                        <View style={styles.contributionTextWrap}>
                          <Text style={styles.metaLabelInline}>Contribution / 文明贡献</Text>
                          <Text style={styles.contributionText}>{item.contribution?.item}</Text>
                        </View>
                      </View>

                      <Text style={styles.metaLabel}>Key Rulers / 关键君主 ({(item.emperors ?? []).length})</Text>
                      {getEmperorSections(item).map((section) => {
                        const sectionKey = `${item.id}-${section.key}`;
                        const isExpanded = expandedSections[sectionKey] ?? true;
                        return (
                          <View key={sectionKey} style={styles.emperorSection}>
                            <Pressable style={styles.sectionToggle} onPress={() => toggleSection(sectionKey)}>
                              <Text style={styles.sectionTitle}>{section.title}</Text>
                              <Text style={styles.sectionToggleText}>{isExpanded ? 'Hide' : 'Show'}</Text>
                            </Pressable>
                            {isExpanded ? (
                              <View style={styles.emperorList}>
                                {section.emperors.map((e, idx) => (
                                  <View key={`${item.id}-${section.key}-${idx}-${e.name}`} style={styles.emperorRow}>
                                    <Text style={styles.emperorName}>{e.name}</Text>
                                    {e.nameZh ? <Text style={styles.emperorNameZh}>{e.nameZh}</Text> : null}
                                    {e.reign ? <Text style={styles.emperorReign}>{e.reign}</Text> : null}
                                    <Text style={styles.emperorAch}>{e.achievement}</Text>
                                  </View>
                                ))}
                              </View>
                            ) : null}
                          </View>
                        );
                      })}

                      <Text style={styles.metaLabel}>Historical Impact / 历史影响</Text>
                      <Text style={styles.legacy}>{item.legacy}</Text>
                      {item.legacySummary ? <Text style={styles.legacySummary}>{item.legacySummary}</Text> : null}
                    </View>
                  </ScrollView>
                </View>
              </Pressable>
            </View>
          ))}
        </Animated.ScrollView>

        <View style={styles.timelineWrap}>
          <View style={styles.timelineLine} />
          <View style={styles.timelinePoints}>
            <Text style={styles.timelineText}>221 BCE</Text>
            <Text style={styles.timelineDot}>•</Text>
            <Text style={styles.timelineText}>0</Text>
            <Text style={styles.timelineDot}>•</Text>
            <Text style={styles.timelineText}>1912 CE</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  dynamicBackdrop: {
    ...StyleSheet.absoluteFillObject,
    opacity: 1,
  },
  container: {
    flex: 1,
    paddingTop: 8,
  },
  title: {
    color: theme.colors.text,
    fontSize: 26,
    fontWeight: '600',
    letterSpacing: 0.4,
    paddingHorizontal: 24,
  },
  subtitle: {
    color: theme.colors.mutedText,
    fontSize: 13,
    marginTop: 6,
    marginBottom: 16,
    letterSpacing: 0.2,
    paddingHorizontal: 24,
  },
  titleDivider: {
    height: 0.5,
    backgroundColor: 'rgba(51, 51, 51, 0.10)',
    marginHorizontal: 24,
    marginBottom: 8,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    height: '82%',
    backgroundColor: 'rgba(253, 251, 247, 0.96)',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  calligraphy: {
    position: 'absolute',
    right: 22,
    top: 62,
    fontSize: 210,
    lineHeight: 220,
    fontWeight: '700',
    color: 'rgba(179, 59, 36, 0.14)',
  },
  bgTitle: {
    position: 'absolute',
    left: -8,
    top: 8,
    fontSize: 44,
    fontWeight: '700',
    letterSpacing: 2.8,
    color: 'rgba(51, 51, 51, 0.12)',
    maxWidth: 340,
  },
  cardInner: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
  innerScroll: {
    flex: 1,
  },
  innerScrollContent: {
    paddingBottom: 14,
  },
  nameEn: {
    color: theme.colors.text,
    fontSize: 30,
    letterSpacing: 2.2,
    fontWeight: '700',
    marginTop: 8,
  },
  nameCnInline: {
    marginTop: 4,
    color: theme.colors.primary,
    fontSize: 16,
    letterSpacing: 1.0,
    fontWeight: '700',
  },
  period: {
    color: theme.colors.mutedText,
    marginTop: 1,
    fontSize: 13,
    letterSpacing: 0.5,
    fontFamily: Platform.select({ ios: 'Times New Roman', android: 'serif', default: 'serif' }),
  },
  tagline: {
    marginTop: 8,
    color: theme.colors.primary,
    fontSize: 12,
    letterSpacing: 1.3,
    fontWeight: '800',
    textTransform: 'uppercase',
    opacity: 0.95,
  },
  artifactFrame: {
    marginTop: 18,
    height: 220,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    borderRadius: 4,
    backgroundColor: '#EFE8DA',
    padding: 8,
  },
  artifactImage: {
    flex: 1,
    borderRadius: 3,
    overflow: 'hidden',
  },
  footerInfo: {
    marginTop: 16,
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.border,
    paddingTop: 12,
  },
  metaLabel: {
    color: theme.colors.primary,
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: 8,
  },
  metaValue: {
    color: theme.colors.text,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.2,
    fontWeight: '600',
    marginBottom: 10,
  },
  legacy: {
    color: theme.colors.text,
    fontSize: 18,
    lineHeight: 33,
    letterSpacing: 0.2,
    fontWeight: '400',
    marginTop: 2,
  },
  legacySummary: {
    marginTop: 10,
    color: theme.colors.mutedText,
    fontSize: 13,
    lineHeight: 20.8,
  },
  metaText: {
    color: theme.colors.text,
    fontSize: 13,
    lineHeight: 20.8,
    letterSpacing: 0.2,
    opacity: 0.9,
    marginBottom: 12,
  },
  contributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.border,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.border,
    marginBottom: 12,
  },
  contributionBadge: {
    width: 30,
    height: 30,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(179, 59, 36, 0.40)',
    backgroundColor: 'rgba(253, 251, 247, 0.96)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contributionTextWrap: {
    flex: 1,
  },
  metaLabelInline: {
    color: theme.colors.primary,
    fontSize: 10,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 4,
  },
  contributionText: {
    color: theme.colors.text,
    fontSize: 14,
    lineHeight: 22.4,
    letterSpacing: 0.2,
    fontWeight: '600',
  },
  emperorList: {
    gap: 10,
    marginBottom: 12,
  },
  emperorSection: {
    marginBottom: 12,
  },
  sectionToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    borderRadius: 4,
    backgroundColor: 'rgba(253, 251, 247, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  sectionToggleText: {
    color: theme.colors.primary,
    fontSize: 10,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  emperorRow: {
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    borderRadius: 4,
    backgroundColor: 'rgba(253, 251, 247, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  emperorName: {
    color: theme.colors.text,
    fontSize: 13,
    letterSpacing: 0.8,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  emperorNameZh: {
    marginTop: 4,
    color: theme.colors.text,
    fontSize: 15,
    letterSpacing: 0.4,
    fontWeight: '600',
    opacity: 0.92,
  },
  emperorAch: {
    marginTop: 6,
    color: theme.colors.mutedText,
    fontSize: 12,
    lineHeight: 19.2,
    letterSpacing: 0.2,
  },
  emperorReign: {
    marginTop: 4,
    color: theme.colors.primary,
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    opacity: 0.85,
  },
  timelineWrap: {
    paddingHorizontal: 24,
    paddingBottom: 12,
    marginTop: 6,
  },
  timelineLine: {
    height: 0.5,
    backgroundColor: 'rgba(51, 51, 51, 0.38)',
    marginBottom: 6,
  },
  timelinePoints: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timelineText: {
    color: theme.colors.text,
    fontSize: 10,
    letterSpacing: 0.8,
    opacity: 0.8,
  },
  timelineDot: {
    color: theme.colors.primary,
    fontSize: 10,
    opacity: 0.85,
  },
});

