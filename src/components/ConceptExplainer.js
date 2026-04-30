import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { Info, X, BookOpen, Lightbulb, Globe, ChevronDown, ChevronUp } from 'lucide-react-native';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

// Cultural concept explanations database
const CULTURAL_CONCEPTS = {
  // Philosophy & Values
  'harmony': {
    key: 'harmony',
    chinese: '和',
    pinyin: 'hé',
    english: 'Harmony',
    shortDesc: 'The balance between different elements in nature and society.',
    longDesc: 'Harmony (和) is a central concept in Chinese philosophy, emphasizing the importance of balance and peaceful coexistence. Unlike Western individualism, Chinese culture values collective harmony—finding ways for different elements to complement each other rather than compete.',
    westernEquivalent: 'Similar to the Greek concept of "eudaimonia" or modern ideas of work-life balance, but extends to all relationships.',
    examples: ['Family harmony over individual desires', 'Diplomatic harmony in international relations', 'Harmony between humans and nature'],
    relatedConcepts: ['yin-yang', 'confucianism'],
    category: 'philosophy',
  },
  'yin-yang': {
    key: 'yin-yang',
    chinese: '阴阳',
    pinyin: 'yīn yáng',
    english: 'Yin-Yang',
    shortDesc: 'The duality of opposing forces that create balance in the universe.',
    longDesc: 'Yin-Yang represents the ancient Chinese understanding of dualism—how opposite forces are actually complementary and interconnected. Yin (阴) represents darkness, cold, feminine, and passive energy. Yang (阳) represents light, heat, masculine, and active energy. Together, they create dynamic balance.',
    westernEquivalent: 'Similar to the concept of duality in Western philosophy, or the balance of opposites in Jungian psychology.',
    examples: ['Day and night cycle', 'Hot and cold foods in TCM', 'Rest and activity balance'],
    relatedConcepts: ['harmony', 'tcm'],
    category: 'philosophy',
  },
  'confucianism': {
    key: 'confucianism',
    chinese: '儒家',
    pinyin: 'rú jiā',
    english: 'Confucianism',
    shortDesc: 'A philosophical system emphasizing ethics, family values, and social harmony.',
    longDesc: 'Confucianism, founded by Confucius (551-479 BCE), is a philosophical and ethical system that has profoundly shaped Chinese civilization. It emphasizes filial piety (孝), respect for elders, moral cultivation, and the importance of education.',
    westernEquivalent: 'Comparable to Aristotelian virtue ethics, with emphasis on character development and social responsibility.',
    examples: ['Respecting elders', 'Valuing education', 'Family gatherings during festivals'],
    relatedConcepts: ['harmony', 'filial-piety'],
    category: 'philosophy',
  },
  'filial-piety': {
    key: 'filial-piety',
    chinese: '孝',
    pinyin: 'xiào',
    english: 'Filial Piety',
    shortDesc: 'Deep respect and care for one\'s parents and ancestors.',
    longDesc: 'Filial piety (孝) is one of the most important virtues in Chinese culture. It goes beyond simple respect—it encompasses caring for parents in their old age, continuing family traditions, and bringing honor to the family name.',
    westernEquivalent: 'Similar to the Biblical commandment "Honor thy father and mother," but more deeply integrated into daily life and social structure.',
    examples: ['Caring for elderly parents at home', 'Ancestor worship during Qingming Festival', 'Seeking parental approval for major decisions'],
    relatedConcepts: ['confucianism', 'ancestors'],
    category: 'philosophy',
  },

  // Food & Dining
  'chopsticks': {
    key: 'chopsticks',
    chinese: '筷子',
    pinyin: 'kuài zi',
    english: 'Chopsticks',
    shortDesc: 'Traditional eating utensils with 5,000 years of history.',
    longDesc: 'Chopsticks are more than just eating tools—they reflect Chinese dining philosophy. The two sticks represent yin and yang, working together in harmony. Unlike Western utensils that cut and pierce, chopsticks gently pick up food, reflecting a non-violent approach to dining.',
    westernEquivalent: 'The fork and knife in Western dining, but chopsticks emphasize precision and gentleness over cutting.',
    examples: ['Never stick chopsticks vertically in rice (resembles incense for the dead)', 'Passing food with chopsticks is polite', 'The longer your chopsticks, the further your reach'],
    relatedConcepts: ['dining-etiquette', 'harmony'],
    category: 'food',
  },
  'hot-cold-foods': {
    key: 'hot-cold-foods',
    chinese: '热气/寒气',
    pinyin: 'rè qì / hán qì',
    english: 'Hot and Cold Foods',
    shortDesc: 'Foods classified by their energetic properties, not temperature.',
    longDesc: 'In Traditional Chinese Medicine, foods are classified as "hot" (热) or "cold" (寒) based on their energetic effect on the body, not their physical temperature. "Hot" foods like ginger and lamb warm the body; "cold" foods like watermelon and cucumber cool it. Balance is key.',
    westernEquivalent: 'Somewhat similar to the Western concept of inflammatory vs. anti-inflammatory foods, but more systematic.',
    examples: ['Ginger tea for colds (warming)', 'Watermelon in summer (cooling)', 'Avoiding "hot" foods during fever'],
    relatedConcepts: ['tcm', 'yin-yang'],
    category: 'food',
  },
  'dining-etiquette': {
    key: 'dining-etiquette',
    chinese: '餐桌礼仪',
    pinyin: 'cān zhuō lǐ yí',
    english: 'Dining Etiquette',
    shortDesc: 'Traditional rules and customs for Chinese dining.',
    longDesc: 'Chinese dining etiquette reflects respect and harmony. The host pays (no splitting bills), the most honored guest sits facing the door, and dishes are shared communally. Serving others before yourself shows consideration.',
    westernEquivalent: 'Western table manners, but emphasizes communal sharing over individual portions.',
    examples: ['Host always pays', 'Serve others before yourself', 'Leave a little food to show you\'re full'],
    relatedConcepts: ['chopsticks', 'harmony'],
    category: 'food',
  },

  // Festivals & Traditions
  'spring-festival': {
    key: 'spring-festival',
    chinese: '春节',
    pinyin: 'chūn jié',
    english: 'Spring Festival (Chinese New Year)',
    shortDesc: 'The most important Chinese festival, marking the lunar new year.',
    longDesc: 'Spring Festival is a 15-day celebration marking the beginning of the lunar new year. Families reunite, homes are cleaned to sweep away bad luck, and red decorations ward off evil spirits. It\'s like Christmas, New Year, and Thanksgiving combined.',
    westernEquivalent: 'Similar to Christmas in importance—family reunion, gift-giving, and special foods.',
    examples: ['Red envelopes (红包) for children', 'Family reunion dinner', 'Fireworks to scare away Nian monster'],
    relatedConcepts: ['red-luck', 'family-reunion'],
    category: 'festival',
  },
  'mid-autumn': {
    key: 'mid-autumn',
    chinese: '中秋节',
    pinyin: 'zhōng qiū jié',
    english: 'Mid-Autumn Festival',
    shortDesc: 'A harvest festival celebrating family reunion under the full moon.',
    longDesc: 'The Mid-Autumn Festival falls on the 15th day of the 8th lunar month when the moon is brightest. Families gather to admire the moon, eat mooncakes, and celebrate reunion. The round moon symbolizes family togetherness.',
    westernEquivalent: 'Similar to Thanksgiving—celebrating harvest and family, but with mooncakes instead of pumpkin pie.',
    examples: ['Mooncakes with various fillings', 'Lantern displays', 'Chang\'e legend storytelling'],
    relatedConcepts: ['harmony', 'family-reunion'],
    category: 'festival',
  },
  'red-luck': {
    key: 'red-luck',
    chinese: '红色',
    pinyin: 'hóng sè',
    english: 'Red for Luck',
    shortDesc: 'Red is the luckiest color in Chinese culture.',
    longDesc: 'Red symbolizes good fortune, joy, and prosperity in Chinese culture. It\'s used in celebrations, weddings, and festivals. Red envelopes, red lanterns, and red clothing are believed to bring luck and ward off evil.',
    westernEquivalent: 'Green in Irish culture or gold in many Western contexts—associated with luck and prosperity.',
    examples: ['Red envelopes for money gifts', 'Red wedding dress (traditional)', 'Red underwear in your zodiac year'],
    relatedConcepts: ['spring-festival', 'wedding-traditions'],
    category: 'tradition',
  },

  // Arts & Culture
  'calligraphy': {
    key: 'calligraphy',
    chinese: '书法',
    pinyin: 'shū fǎ',
    english: 'Chinese Calligraphy',
    shortDesc: 'The art of beautiful writing, considered the highest form of Chinese art.',
    longDesc: 'Chinese calligraphy is more than writing—it\'s a meditative art form that reveals the calligrapher\'s character. Each stroke must be executed with precision and flow. The brush, ink, paper, and inkstone are called the "Four Treasures of the Study."',
    westernEquivalent: 'Comparable to Western calligraphy, but with deeper philosophical and spiritual significance.',
    examples: ['Brush pressure determines stroke thickness', 'Different styles: seal, clerical, regular, cursive', 'Calligraphy as meditation practice'],
    relatedConcepts: ['ink-wash', 'scholar'],
    category: 'art',
  },
  'ink-wash': {
    key: 'ink-wash',
    chinese: '水墨画',
    pinyin: 'shuǐ mò huà',
    english: 'Ink Wash Painting',
    shortDesc: 'Traditional Chinese painting using black ink and water.',
    longDesc: 'Ink wash painting emphasizes the essence of the subject over realistic representation. Using varying concentrations of ink and water, artists create depth and atmosphere. The empty space (留白) is as important as the painted areas.',
    westernEquivalent: 'Similar to watercolor painting, but with philosophical emphasis on capturing spirit rather than appearance.',
    examples: ['Landscapes with misty mountains', 'Bamboo and orchid paintings', 'Zen-inspired simplicity'],
    relatedConcepts: ['calligraphy', 'daoism'],
    category: 'art',
  },

  // Social Customs
  'guanxi': {
    key: 'guanxi',
    chinese: '关系',
    pinyin: 'guān xi',
    english: 'Guanxi (Connections)',
    shortDesc: 'The system of social networks and relationships that facilitate business and life.',
    longDesc: 'Guanxi refers to the network of relationships that Chinese people cultivate and maintain. It\'s about mutual obligation and trust built over time. Having good guanxi can open doors, but it also comes with expectations of reciprocity.',
    westernEquivalent: 'Similar to Western "networking," but deeper and more obligatory—like having friends who are also business partners.',
    examples: ['Helping a friend\'s child get a job', 'Exchanging favors in business', 'Maintaining relationships through gifts and meals'],
    relatedConcepts: ['face', 'reciprocity'],
    category: 'social',
  },
  'face': {
    key: 'face',
    chinese: '面子',
    pinyin: 'miàn zi',
    english: 'Face (Social Prestige)',
    shortDesc: 'A person\'s social standing, dignity, and reputation in the eyes of others.',
    longDesc: 'Face (面子) represents a person\'s social prestige and dignity. "Giving face" means showing respect publicly; "losing face" is public embarrassment. Chinese communication often prioritizes preserving everyone\'s face over direct confrontation.',
    westernEquivalent: 'Similar to "reputation" or "honor" in Western culture, but more explicitly managed in social interactions.',
    examples: ['Complimenting someone publicly', 'Never criticizing someone in front of others', 'Declining invitations indirectly to avoid embarrassment'],
    relatedConcepts: ['guanxi', 'harmony'],
    category: 'social',
  },
};

// Get concept by key
export function getCulturalConcept(key) {
  return CULTURAL_CONCEPTS[key] || null;
}

// Get concepts by category
export function getConceptsByCategory(category) {
  return Object.values(CULTURAL_CONCEPTS).filter(c => c.category === category);
}

// Search concepts
export function searchConcepts(query) {
  const lowerQuery = query.toLowerCase();
  return Object.values(CULTURAL_CONCEPTS).filter(c =>
    c.english.toLowerCase().includes(lowerQuery) ||
    c.chinese.includes(query) ||
    c.pinyin.toLowerCase().includes(lowerQuery) ||
    c.shortDesc.toLowerCase().includes(lowerQuery)
  );
}

// ============================================
// CONCEPT EXPLAINER CARD
// ============================================

export function ConceptExplainerCard({
  conceptKey,
  concept,
  expanded: initialExpanded = false,
  showWesternEquivalent = true,
  showExamples = true,
  showRelated = true,
  style,
  onDismiss,
}) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(initialExpanded);

  const data = concept || CULTURAL_CONCEPTS[conceptKey];

  if (!data) return null;

  const toggleExpand = () => setExpanded(!expanded);

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, style]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.chineseBadge, { backgroundColor: colors.cinnabarGlow }]}>
            <Text style={[styles.chineseText, { color: colors.primary }]}>{data.chinese}</Text>
          </View>
          <View style={styles.titleWrap}>
            <Text style={[styles.englishTitle, { color: colors.text }]}>{data.english}</Text>
            <Text style={[styles.pinyin, { color: colors.mutedText }]}>{data.pinyin}</Text>
          </View>
        </View>
        {onDismiss && (
          <Pressable onPress={onDismiss} style={styles.dismissBtn}>
            <X size={16} color={colors.mutedText} strokeWidth={2} />
          </Pressable>
        )}
      </View>

      {/* Short Description */}
      <Text style={[styles.shortDesc, { color: colors.text }]}>{data.shortDesc}</Text>

      {/* Expand/Collapse Button */}
      <Pressable style={[styles.expandBtn, { borderColor: colors.border }]} onPress={toggleExpand}>
        <Text style={[styles.expandBtnText, { color: colors.primary }]}>
          {expanded ? 'Show Less' : 'Learn More'}
        </Text>
        {expanded ? (
          <ChevronUp size={14} color={colors.primary} strokeWidth={2} />
        ) : (
          <ChevronDown size={14} color={colors.primary} strokeWidth={2} />
        )}
      </Pressable>

      {/* Expanded Content */}
      {expanded && (
        <View style={styles.expandedContent}>
          {/* Long Description */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <BookOpen size={12} color={colors.primary} strokeWidth={2} />
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>Understanding</Text>
            </View>
            <Text style={[styles.longDesc, { color: colors.text }]}>{data.longDesc}</Text>
          </View>

          {/* Western Equivalent */}
          {showWesternEquivalent && data.westernEquivalent && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Globe size={12} color={colors.primary} strokeWidth={2} />
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>Western Context</Text>
              </View>
              <Text style={[styles.westernText, { color: colors.mutedText }]}>{data.westernEquivalent}</Text>
            </View>
          )}

          {/* Examples */}
          {showExamples && data.examples && data.examples.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Lightbulb size={12} color={colors.primary} strokeWidth={2} />
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>Examples</Text>
              </View>
              {data.examples.map((example, index) => (
                <View key={index} style={styles.exampleItem}>
                  <View style={[styles.exampleDot, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.exampleText, { color: colors.text }]}>{example}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Related Concepts */}
          {showRelated && data.relatedConcepts && data.relatedConcepts.length > 0 && (
            <View style={styles.relatedRow}>
              <Text style={[styles.relatedLabel, { color: colors.mutedText }]}>Related: </Text>
              {data.relatedConcepts.map((key, index) => {
                const related = CULTURAL_CONCEPTS[key];
                if (!related) return null;
                return (
                  <View key={key} style={[styles.relatedTag, { backgroundColor: colors.cinnabarGlow }]}>
                    <Text style={[styles.relatedTagText, { color: colors.primary }]}>{related.chinese}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

// ============================================
// INLINE CONCEPT TOOLTIP
// ============================================

export function ConceptTooltip({
  conceptKey,
  concept,
  children,
  position = 'top', // 'top', 'bottom'
}) {
  const { colors } = useTheme();
  const [visible, setVisible] = useState(false);

  const data = concept || CULTURAL_CONCEPTS[conceptKey];

  if (!data) return children;

  return (
    <View style={styles.tooltipContainer}>
      <Pressable onPress={() => setVisible(!visible)}>
        {children}
      </Pressable>

      {visible && (
        <View style={[
          styles.tooltip,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
          position === 'top' ? styles.tooltipTop : styles.tooltipBottom,
        ]}>
          <View style={styles.tooltipHeader}>
            <Text style={[styles.tooltipChinese, { color: colors.primary }]}>{data.chinese}</Text>
            <Text style={[styles.tooltipPinyin, { color: colors.mutedText }]}>{data.pinyin}</Text>
          </View>
          <Text style={[styles.tooltipDesc, { color: colors.text }]}>{data.shortDesc}</Text>
          <Pressable onPress={() => setVisible(false)}>
            <Text style={[styles.tooltipClose, { color: colors.primary }]}>Tap to close</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

// ============================================
// CONCEPT GLOSSARY LIST
// ============================================

export function ConceptGlossary({
  category,
  searchQuery,
  onSelectConcept,
  style,
}) {
  const { colors } = useTheme();

  const concepts = useMemo(() => {
    let list = Object.values(CULTURAL_CONCEPTS);

    if (category && category !== 'all') {
      list = list.filter(c => c.category === category);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      list = list.filter(c =>
        c.english.toLowerCase().includes(query) ||
        c.chinese.includes(searchQuery) ||
        c.pinyin.toLowerCase().includes(query)
      );
    }

    return list;
  }, [category, searchQuery]);

  return (
    <ScrollView style={[styles.glossaryContainer, style]} showsVerticalScrollIndicator={false}>
      {concepts.map((concept) => (
        <Pressable
          key={concept.key}
          style={[styles.glossaryItem, { borderColor: colors.border }]}
          onPress={() => onSelectConcept?.(concept)}
        >
          <View style={[styles.glossaryChinese, { backgroundColor: colors.cinnabarGlow }]}>
            <Text style={[styles.glossaryChineseText, { color: colors.primary }]}>{concept.chinese}</Text>
          </View>
          <View style={styles.glossaryContent}>
            <Text style={[styles.glossaryTitle, { color: colors.text }]}>{concept.english}</Text>
            <Text style={[styles.glossaryDesc, { color: colors.mutedText }]} numberOfLines={2}>
              {concept.shortDesc}
            </Text>
          </View>
          <ChevronDown size={16} color={colors.mutedText} strokeWidth={2} style={{ transform: [{ rotate: '-90deg' }] }} />
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Card styles
  card: {
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    padding: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  chineseBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  chineseText: {
    fontSize: 20,
    fontWeight: '700',
  },
  titleWrap: {
    flex: 1,
  },
  englishTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  pinyin: {
    fontSize: 12,
    marginTop: 2,
  },
  dismissBtn: {
    padding: 4,
  },
  shortDesc: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
  },
  expandBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 0.5,
  },
  expandBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // Expanded content
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.border,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  longDesc: {
    fontSize: 13,
    lineHeight: 20,
  },
  westernText: {
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  exampleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  exampleDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 7,
  },
  exampleText: {
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
  relatedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  relatedLabel: {
    fontSize: 11,
  },
  relatedTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  relatedTagText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Tooltip styles
  tooltipContainer: {
    position: 'relative',
  },
  tooltip: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderRadius: 8,
    borderWidth: 0.5,
    padding: 12,
    zIndex: 100,
    ...theme.shadows.medium,
  },
  tooltipTop: {
    bottom: '100%',
    marginBottom: 8,
  },
  tooltipBottom: {
    top: '100%',
    marginTop: 8,
  },
  tooltipHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  tooltipChinese: {
    fontSize: 16,
    fontWeight: '700',
  },
  tooltipPinyin: {
    fontSize: 11,
  },
  tooltipDesc: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },
  tooltipClose: {
    fontSize: 10,
    marginTop: 8,
    fontWeight: '600',
  },

  // Glossary styles
  glossaryContainer: {
    flex: 1,
  },
  glossaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  glossaryChinese: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glossaryChineseText: {
    fontSize: 16,
    fontWeight: '700',
  },
  glossaryContent: {
    flex: 1,
  },
  glossaryTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  glossaryDesc: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 16,
  },
});