import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { ArrowRight, ArrowLeft, Scale, Lightbulb, Globe, ChevronDown, ChevronUp } from 'lucide-react-native';
import Svg, { Path, Circle, Rect, G, Defs, LinearGradient, Stop } from 'react-native-svg';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

// ============================================
// CULTURAL COMPARISON DATA
// ============================================

const COMPARISONS = {
  // Dining
  'dining-sharing': {
    id: 'dining-sharing',
    category: 'dining',
    title: 'Dining Style',
    titleCn: '用餐方式',
    chinese: {
      title: 'Shared Dishes',
      titleCn: '共享菜肴',
      description: 'Dishes are placed in the center of the table. Everyone shares from common plates using their own chopsticks. This symbolizes unity and togetherness.',
      icon: '🥢',
      color: '#B33B24',
    },
    western: {
      title: 'Individual Plates',
      titleCn: '个人餐盘',
      description: 'Each person receives their own portion. The meal is pre-divided, emphasizing personal space and hygiene.',
      icon: '🍽️',
      color: '#6B8A94',
    },
    insight: 'Chinese dining emphasizes communal sharing as a sign of closeness, while Western dining prioritizes individual portions.',
  },
  'dining-payment': {
    id: 'dining-payment',
    category: 'dining',
    title: 'Paying the Bill',
    titleCn: '买单习惯',
    chinese: {
      title: 'Host Pays All',
      titleCn: '主人买单',
      description: 'The host insists on paying the entire bill. Splitting the bill (AA制) can be seen as distancing yourself from the relationship.',
      icon: '🧧',
      color: '#B33B24',
    },
    western: {
      title: 'Split the Bill',
      titleCn: 'AA制',
      description: 'Going Dutch is common and expected. Each person pays for what they ordered, seen as fair and practical.',
      icon: '💳',
      color: '#6B8A94',
    },
    insight: 'In Chinese culture, paying shows generosity and builds guanxi (relationships). Western culture values fairness and independence.',
  },
  'dining-etiquette': {
    id: 'dining-etiquette',
    category: 'dining',
    title: 'Table Manners',
    titleCn: '餐桌礼仪',
    chinese: {
      title: 'Slurping is OK',
      titleCn: '吸溜可以',
      description: 'Slurping noodles shows enjoyment. Belching can be a compliment to the chef. Noise indicates satisfaction.',
      icon: '🍜',
      color: '#B33B24',
    },
    western: {
      title: 'Quiet Dining',
      titleCn: '安静用餐',
      description: 'Eating quietly is polite. Chewing with mouth open or making noise is considered rude.',
      icon: '🤫',
      color: '#6B8A94',
    },
    insight: 'What\'s polite in one culture may be rude in another. Context matters!',
  },

  // Social
  'social-greeting': {
    id: 'social-greeting',
    category: 'social',
    title: 'Greetings',
    titleCn: '问候方式',
    chinese: {
      title: 'Nod or Bow',
      titleCn: '点头或鞠躬',
      description: 'A slight nod or bow shows respect. Handshakes are becoming common in business. Physical contact is minimal.',
      icon: '🙇',
      color: '#B33B24',
    },
    western: {
      title: 'Handshake/Hug',
      titleCn: '握手/拥抱',
      description: 'Firm handshake for business. Hugs and kisses on the cheek for friends. Physical contact shows warmth.',
      icon: '🤝',
      color: '#6B8A94',
    },
    insight: 'Chinese greetings maintain more physical distance, while Western greetings often involve touch.',
  },
  'social-compliments': {
    id: 'social-compliments',
    category: 'social',
    title: 'Accepting Compliments',
    titleCn: '接受赞美',
    chinese: {
      title: 'Deflect Humbly',
      titleCn: '谦虚推辞',
      description: 'Deflect compliments to show humility. "No, no, I still have much to learn." Accepting directly may seem arrogant.',
      icon: '🙏',
      color: '#B33B24',
    },
    western: {
      title: 'Accept Graciously',
      titleCn: '大方接受',
      description: 'Say "Thank you!" Accepting compliments shows confidence. Deflecting may seem insecure.',
      icon: '😊',
      color: '#6B8A94',
    },
    insight: 'Chinese humility vs. Western confidence—both are polite in their own context.',
  },
  'social-gifts': {
    id: 'social-gifts',
    category: 'social',
    title: 'Gift Giving',
    titleCn: '送礼习俗',
    chinese: {
      title: 'Refuse First',
      titleCn: '先推辞',
      description: 'Politely refuse 2-3 times before accepting. Open gifts later, not in front of giver. Avoid clocks (送钟 = 送终, funeral).',
      icon: '🎁',
      color: '#B33B24',
    },
    western: {
      title: 'Accept & Open',
      titleCn: '接受并打开',
      description: 'Accept immediately with thanks. Open gifts in front of the giver to show excitement.',
      icon: '🎀',
      color: '#6B8A94',
    },
    insight: 'The ritual of refusing shows modesty in Chinese culture. Western culture values immediate appreciation.',
  },

  // Family
  'family-elders': {
    id: 'family-elders',
    category: 'family',
    title: 'Elder Care',
    titleCn: '赡养老人',
    chinese: {
      title: 'Live with Family',
      titleCn: '与家人同住',
      description: 'Elders often live with children. Nursing homes carry stigma. Caring for parents is a filial duty (孝).',
      icon: '👨‍👩‍👧‍👦',
      color: '#B33B24',
    },
    western: {
      title: 'Independent Living',
      titleCn: '独立生活',
      description: 'Elders often live independently or in retirement communities. Maintaining autonomy is valued.',
      icon: '🏡',
      color: '#6B8A94',
    },
    insight: 'Chinese filial piety emphasizes family responsibility. Western culture values independence for all ages.',
  },
  'family-decisions': {
    id: 'family-decisions',
    category: 'family',
    title: 'Major Decisions',
    titleCn: '重大决定',
    chinese: {
      title: 'Family Consultation',
      titleCn: '家庭商议',
      description: 'Major decisions (career, marriage) involve the whole family. Parental approval is important.',
      icon: '👨‍👩‍👧',
      color: '#B33B24',
    },
    western: {
      title: 'Individual Choice',
      titleCn: '个人选择',
      description: 'Adults make their own decisions. Family input is welcome but not binding.',
      icon: '🧑',
      color: '#6B8A94',
    },
    insight: 'Chinese families are more hierarchical and collective. Western families emphasize individual autonomy.',
  },

  // Education
  'education-approach': {
    id: 'education-approach',
    category: 'education',
    title: 'Learning Style',
    titleCn: '学习方式',
    chinese: {
      title: 'Mastery & Practice',
      titleCn: '熟能生巧',
      description: 'Emphasis on repetition, memorization, and mastery. Practice makes perfect (熟能生巧).',
      icon: '📚',
      color: '#B33B24',
    },
    western: {
      title: 'Critical Thinking',
      titleCn: '批判思维',
      description: 'Emphasis on questioning, discussion, and creativity. Multiple perspectives are valued.',
      icon: '💡',
      color: '#6B8A94',
    },
    insight: 'Both approaches have strengths. Chinese education builds strong foundations; Western education fosters innovation.',
  },

  // Communication
  'communication-style': {
    id: 'communication-style',
    category: 'communication',
    title: 'Communication Style',
    titleCn: '沟通方式',
    chinese: {
      title: 'Indirect',
      titleCn: '含蓄',
      description: 'Messages are often implied. "Maybe" might mean "no." Preserving harmony and face is prioritized.',
      icon: '🌸',
      color: '#B33B24',
    },
    western: {
      title: 'Direct',
      titleCn: '直接',
      description: 'Say what you mean clearly. "No" means "no." Clarity is valued over harmony.',
      icon: '📢',
      color: '#6B8A94',
    },
    insight: 'Chinese high-context communication relies on reading between lines. Western low-context communication is explicit.',
  },
  'communication-yes': {
    id: 'communication-yes',
    category: 'communication',
    title: 'Saying "Yes"',
    titleCn: '说"是"',
    chinese: {
      title: 'Yes = Acknowledged',
      titleCn: '是 = 听到了',
      description: '"Yes" often means "I hear you" or "I understand," not necessarily agreement. Watch for hesitation.',
      icon: '🤔',
      color: '#B33B24',
    },
    western: {
      title: 'Yes = Agreement',
      titleCn: 'Yes = 同意',
      description: '"Yes" typically means agreement or consent. It\'s a clear affirmative response.',
      icon: '✅',
      color: '#6B8A94',
    },
    insight: 'Always clarify expectations in cross-cultural communication!',
  },

  // Time
  'time-perception': {
    id: 'time-perception',
    category: 'time',
    title: 'Time Perception',
    titleCn: '时间观念',
    chinese: {
      title: 'Flexible',
      titleCn: '灵活',
      description: 'Relationships often take priority over strict schedules. Being a little late is often acceptable.',
      icon: '🌊',
      color: '#B33B24',
    },
    western: {
      title: 'Punctual',
      titleCn: '准时',
      description: 'Time is a resource to be managed. Being on time shows respect. "Time is money."',
      icon: '⏰',
      color: '#6B8A94',
    },
    insight: 'Chinese polychronic time vs. Western monochronic time—relationships vs. schedules.',
  },
};

// Get comparison by ID
export function getComparison(id) {
  return COMPARISONS[id] || null;
}

// Get comparisons by category
export function getComparisonsByCategory(category) {
  return Object.values(COMPARISONS).filter(c => c.category === category);
}

// Get all categories
export function getComparisonCategories() {
  return [...new Set(Object.values(COMPARISONS).map(c => c.category))];
}

// ============================================
// COMPARISON CARD
// ============================================

export function ComparisonCard({
  comparisonId,
  comparison,
  expanded: initialExpanded = false,
  showInsight = true,
  style,
  onSelect,
}) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(initialExpanded);

  const data = comparison || COMPARISONS[comparisonId];

  if (!data) return null;

  return (
    <View style={[styles.comparisonCard, { backgroundColor: colors.surface, borderColor: colors.border }, style]}>
      {/* Title */}
      <Pressable style={styles.cardHeader} onPress={() => setExpanded(!expanded)}>
        <View style={styles.cardHeaderLeft}>
          <Scale size={16} color={colors.primary} strokeWidth={2} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>{data.title}</Text>
          <Text style={[styles.cardTitleCn, { color: colors.primary }]}>{data.titleCn}</Text>
        </View>
        {expanded ? (
          <ChevronUp size={16} color={colors.mutedText} strokeWidth={2} />
        ) : (
          <ChevronDown size={16} color={colors.mutedText} strokeWidth={2} />
        )}
      </Pressable>

      {/* Comparison */}
      <View style={styles.comparisonRow}>
        {/* Chinese side */}
        <View style={[styles.comparisonSide, styles.chineseSide]}>
          <View style={[styles.sideHeader, { backgroundColor: data.chinese.color + '15' }]}>
            <Text style={styles.sideIcon}>{data.chinese.icon}</Text>
            <Text style={[styles.sideTitle, { color: data.chinese.color }]}>{data.chinese.title}</Text>
          </View>
          <Text style={[styles.sideTitleCn, { color: colors.mutedText }]}>{data.chinese.titleCn}</Text>
          <Text style={[styles.sideDesc, { color: colors.text }]}>{data.chinese.description}</Text>
        </View>

        {/* VS divider */}
        <View style={styles.vsDivider}>
          <View style={[styles.vsLine, { backgroundColor: colors.border }]} />
          <View style={[styles.vsCircle, { backgroundColor: colors.cinnabarGlow, borderColor: colors.border }]}>
            <Text style={[styles.vsText, { color: colors.primary }]}>VS</Text>
          </View>
          <View style={[styles.vsLine, { backgroundColor: colors.border }]} />
        </View>

        {/* Western side */}
        <View style={[styles.comparisonSide, styles.westernSide]}>
          <View style={[styles.sideHeader, { backgroundColor: data.western.color + '15' }]}>
            <Text style={styles.sideIcon}>{data.western.icon}</Text>
            <Text style={[styles.sideTitle, { color: data.western.color }]}>{data.western.title}</Text>
          </View>
          <Text style={[styles.sideTitleCn, { color: colors.mutedText }]}>{data.western.titleCn}</Text>
          <Text style={[styles.sideDesc, { color: colors.text }]}>{data.western.description}</Text>
        </View>
      </View>

      {/* Insight */}
      {showInsight && expanded && data.insight && (
        <View style={[styles.insightBox, { backgroundColor: colors.cinnabarGlow, borderColor: colors.primary }]}>
          <Lightbulb size={14} color={colors.primary} strokeWidth={2} />
          <Text style={[styles.insightText, { color: colors.text }]}>{data.insight}</Text>
        </View>
      )}

      {/* Expand hint */}
      {!expanded && (
        <Pressable style={styles.expandHint} onPress={() => setExpanded(true)}>
          <Text style={[styles.expandHintText, { color: colors.primary }]}>Tap for insight</Text>
        </Pressable>
      )}
    </View>
  );
}

// ============================================
// COMPARISON LIST
// ============================================

export function ComparisonList({
  category,
  onSelectComparison,
  style,
}) {
  const { colors } = useTheme();

  const comparisons = useMemo(() => {
    if (category && category !== 'all') {
      return Object.values(COMPARISONS).filter(c => c.category === category);
    }
    return Object.values(COMPARISONS);
  }, [category]);

  return (
    <ScrollView style={[styles.listContainer, style]} showsVerticalScrollIndicator={false}>
      {comparisons.map((comp) => (
        <Pressable
          key={comp.id}
          style={[styles.listItem, { borderColor: colors.border }]}
          onPress={() => onSelectComparison?.(comp)}
        >
          <View style={styles.listItemContent}>
            <Text style={[styles.listItemTitle, { color: colors.text }]}>{comp.title}</Text>
            <Text style={[styles.listItemTitleCn, { color: colors.primary }]}>{comp.titleCn}</Text>
          </View>
          <View style={styles.listItemIcons}>
            <Text style={styles.listItemIcon}>{comp.chinese.icon}</Text>
            <Text style={styles.listItemVs}>vs</Text>
            <Text style={styles.listItemIcon}>{comp.western.icon}</Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

// ============================================
// QUICK COMPARISON BADGE
// ============================================

export function QuickComparisonBadge({
  comparisonId,
  comparison,
  compact = false,
  style,
}) {
  const { colors } = useTheme();

  const data = comparison || COMPARISONS[comparisonId];

  if (!data) return null;

  if (compact) {
    return (
      <View style={[styles.quickBadgeCompact, { backgroundColor: colors.cinnabarGlow }, style]}>
        <Text style={styles.quickBadgeIcon}>{data.chinese.icon}</Text>
        <Text style={[styles.quickBadgeVs, { color: colors.mutedText }]}>vs</Text>
        <Text style={styles.quickBadgeIcon}>{data.western.icon}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.quickBadge, { backgroundColor: colors.surface, borderColor: colors.border }, style]}>
      <Text style={[styles.quickBadgeTitle, { color: colors.text }]}>{data.title}</Text>
      <View style={styles.quickBadgeRow}>
        <View style={[styles.quickBadgeSide, { backgroundColor: data.chinese.color + '15' }]}>
          <Text style={styles.quickBadgeIcon}>{data.chinese.icon}</Text>
          <Text style={[styles.quickBadgeLabel, { color: data.chinese.color }]}>{data.chinese.title}</Text>
        </View>
        <ArrowRight size={12} color={colors.mutedText} strokeWidth={2} />
        <View style={[styles.quickBadgeSide, { backgroundColor: data.western.color + '15' }]}>
          <Text style={styles.quickBadgeIcon}>{data.western.icon}</Text>
          <Text style={[styles.quickBadgeLabel, { color: data.western.color }]}>{data.western.title}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Comparison Card
  comparisonCard: {
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    padding: 16,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardTitleCn: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Comparison Row
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  comparisonSide: {
    flex: 1,
  },
  chineseSide: {
    alignItems: 'flex-start',
    paddingRight: 8,
  },
  westernSide: {
    alignItems: 'flex-end',
    paddingLeft: 8,
  },
  sideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  sideIcon: {
    fontSize: 16,
  },
  sideTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  sideTitleCn: {
    fontSize: 10,
    marginTop: 4,
  },
  sideDesc: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 8,
    textAlign: 'left',
  },

  // VS Divider
  vsDivider: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vsLine: {
    width: 0.5,
    flex: 1,
  },
  vsCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
  },
  vsText: {
    fontSize: 9,
    fontWeight: '800',
  },

  // Insight
  insightBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 0.5,
  },
  insightText: {
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
  expandHint: {
    alignItems: 'center',
    marginTop: 12,
  },
  expandHintText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // List
  listContainer: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  listItemTitleCn: {
    fontSize: 11,
    marginTop: 2,
  },
  listItemIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  listItemIcon: {
    fontSize: 18,
  },
  listItemVs: {
    fontSize: 10,
    fontWeight: '600',
  },

  // Quick Badge
  quickBadge: {
    borderRadius: 8,
    borderWidth: 0.5,
    padding: 12,
  },
  quickBadgeTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  quickBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quickBadgeSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  quickBadgeIcon: {
    fontSize: 14,
  },
  quickBadgeLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  quickBadgeCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  quickBadgeVs: {
    fontSize: 9,
    fontWeight: '700',
  },
});