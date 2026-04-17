import React, { useMemo } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ArrowLeft, BadgeInfo, BookOpen, Sparkles } from 'lucide-react-native';

import { dynasties } from '../data/dynasties';
import { SmartImageBlock } from '../components/SmartImageBlock';
import { getLocalImage } from '../assets/localImages';
import { theme } from '../theme/theme';

export function DynastyDetailScreen({ route, navigation }) {
  const dynastyId = route?.params?.dynastyId ?? 'tang';
  const dynasty = useMemo(
    () => dynasties.find((item) => item.id === dynastyId) ?? dynasties[0],
    [dynastyId]
  );

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={16} color={theme.colors.text} strokeWidth={2} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.topTitle}>Dynasty Detail</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
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
            <Text style={styles.tagline}>{dynasty.tagline}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <BadgeInfo size={14} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Timeline Link</Text>
          </View>
          <Text style={styles.sectionText}>{dynasty.worldContext}</Text>
          <View style={styles.miniTimeline}>
            <Text style={styles.timelineLabel}>Start</Text>
            <View style={styles.timelineLine} />
            <Text style={styles.timelineLabel}>End</Text>
          </View>
          <Text style={styles.sectionTextMuted}>{dynasty.legacy}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <BookOpen size={14} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Rulers</Text>
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
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Sparkles size={14} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Achievement Hook</Text>
          </View>
          <Text style={styles.sectionText}>
            Exploring this dynasty can unlock timeline achievements, collection milestones, and cultural rank progress.
          </Text>
        </View>
      </ScrollView>
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
  content: { paddingHorizontal: 24, paddingBottom: 28, gap: 14 },
  hero: { borderWidth: 0.5, borderColor: theme.colors.border, borderRadius: 4, overflow: 'hidden' },
  heroImage: { height: 220 },
  heroMeta: { padding: 14, backgroundColor: theme.colors.card },
  dynastyName: { color: theme.colors.text, fontSize: 28, fontWeight: '800' },
  dynastyNameEn: { marginTop: 4, color: theme.colors.primary, fontWeight: '800', letterSpacing: 1.2 },
  period: { marginTop: 6, color: theme.colors.mutedText },
  tagline: { marginTop: 8, color: theme.colors.text, fontStyle: 'italic' },
  card: { borderWidth: 0.5, borderColor: theme.colors.border, borderRadius: 4, backgroundColor: theme.colors.card, padding: 14 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { color: theme.colors.primary, fontSize: 12, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase' },
  sectionText: { marginTop: 10, color: theme.colors.text, lineHeight: 22 },
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
});
