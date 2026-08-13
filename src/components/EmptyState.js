/**
 * Empty State Component
 *
 * Chinese aesthetic empty states with illustrations and guidance.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowRight, Bookmark, Search, BookOpen, MapPin, UtensilsCrossed, Clock, Sparkles } from 'lucide-react-native';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

// SVG-based Chinese style illustrations
function InkMountainIllustration({ color = theme.colors.primary }) {
  return (
    <View style={styles.illustration}>
      {/* Simple ink wash mountain silhouette using Views */}
      <View style={[styles.mountainBase, { borderBottomColor: color, opacity: 0.15 }]} />
      <View style={[styles.mountainLeft, { borderRightColor: color, opacity: 0.2 }]} />
      <View style={[styles.mountainRight, { borderLeftColor: color, opacity: 0.25 }]} />
      {/* Moon/sun */}
      <View style={[styles.celestialBody, { borderColor: color, opacity: 0.3 }]} />
    </View>
  );
}

function ScrollIllustration({ color = theme.colors.primary }) {
  return (
    <View style={styles.illustration}>
      <View style={[styles.scrollBody, { borderColor: color, opacity: 0.2 }]}>
        <View style={[styles.scrollLine, { backgroundColor: color, opacity: 0.15 }]} />
        <View style={[styles.scrollLine, { backgroundColor: color, opacity: 0.15, width: '60%' }]} />
        <View style={[styles.scrollLine, { backgroundColor: color, opacity: 0.15, width: '80%' }]} />
      </View>
      <View style={[styles.scrollEnd, { backgroundColor: color, opacity: 0.25, top: -8 }]} />
      <View style={[styles.scrollEnd, { backgroundColor: color, opacity: 0.25, bottom: -8 }]} />
    </View>
  );
}

function BowlIllustration({ color = theme.colors.primary }) {
  return (
    <View style={styles.illustration}>
      <View style={[styles.bowlOuter, { borderColor: color, opacity: 0.2 }]}>
        <View style={[styles.bowlInner, { backgroundColor: color, opacity: 0.08 }]} />
        {/* Steam lines */}
        <View style={[styles.steamLine, { backgroundColor: color, opacity: 0.15, left: 20 }]} />
        <View style={[styles.steamLine, { backgroundColor: color, opacity: 0.12, left: 30 }]} />
        <View style={[styles.steamLine, { backgroundColor: color, opacity: 0.1, left: 40 }]} />
      </View>
    </View>
  );
}

function CompassIllustration({ color = theme.colors.primary }) {
  return (
    <View style={styles.illustration}>
      <View style={[styles.compassOuter, { borderColor: color, opacity: 0.2 }]}>
        <View style={[styles.compassInner, { borderColor: color, opacity: 0.15 }]} />
        <View style={[styles.compassNeedle, { backgroundColor: color, opacity: 0.3 }]} />
      </View>
    </View>
  );
}

// Empty state variants
const emptyStateVariants = {
  collection: {
    illustration: InkMountainIllustration,
    icon: Bookmark,
    title: 'Start Your Collection',
    titleCn: '开始收藏',
    description: 'Save cities, dishes, and dynasties to build your personal cultural atlas.',
    descriptionCn: '收藏城市、美食和朝代，构建你的文化地图。',
    actionLabel: 'Explore Places',
    actionScreen: 'Places',
  },
  search: {
    illustration: ScrollIllustration,
    icon: Search,
    title: 'No Results Found',
    titleCn: '未找到结果',
    description: 'Try different keywords or explore our categories.',
    descriptionCn: '尝试不同的关键词或浏览分类。',
    actionLabel: 'Clear Search',
    actionScreen: null,
  },
  history: {
    illustration: Clock,
    icon: Clock,
    title: 'No History Yet',
    titleCn: '暂无历史',
    description: 'Your recently viewed items will appear here.',
    descriptionCn: '你浏览过的内容会显示在这里。',
    actionLabel: 'Explore History',
    actionScreen: 'History',
  },
  food: {
    illustration: BowlIllustration,
    icon: UtensilsCrossed,
    title: 'No Dishes Saved',
    titleCn: '暂无美食',
    description: 'Discover regional Chinese cuisine and save your favorites.',
    descriptionCn: '探索中国地方美食，收藏你的最爱。',
    actionLabel: 'Explore Food',
    actionScreen: 'Food',
  },
  places: {
    illustration: CompassIllustration,
    icon: MapPin,
    title: 'No Cities Visited',
    titleCn: '暂无城市',
    description: 'Explore Chinese cities and their unique stories.',
    descriptionCn: '探索中国城市及其独特故事。',
    actionLabel: 'Explore Places',
    actionScreen: 'Places',
  },
  quiz: {
    illustration: ScrollIllustration,
    icon: BookOpen,
    title: 'No Questions Yet',
    titleCn: '暂无问题',
    description: 'Complete daily quizzes to build your knowledge.',
    descriptionCn: '完成每日问答，积累知识。',
    actionLabel: 'Start Quiz',
    actionScreen: 'Seasons',
  },
  wrongAnswers: {
    illustration: InkMountainIllustration,
    icon: Sparkles,
    title: 'All Caught Up!',
    titleCn: '全部掌握！',
    description: 'You have no wrong answers to review. Keep learning!',
    descriptionCn: '没有需要复习的错题，继续学习！',
    actionLabel: null,
    actionScreen: null,
  },
  generic: {
    illustration: InkMountainIllustration,
    icon: Sparkles,
    title: 'Nothing Here Yet',
    titleCn: '暂无内容',
    description: 'Check back later or explore other sections.',
    descriptionCn: '稍后再来或探索其他内容。',
    actionLabel: 'Go Home',
    actionScreen: 'Home',
  },
};

export function EmptyState({
  variant = 'generic',
  title,
  titleCn,
  description,
  descriptionCn,
  actionLabel,
  onAction,
  showChinese = true,
  style,
}) {
  const { colors } = useTheme();
  const config = emptyStateVariants[variant] || emptyStateVariants.generic;

  const Illustration = config.illustration;
  const Icon = config.icon;

  const displayTitle = title || config.title;
  const displayTitleCn = titleCn || config.titleCn;
  const displayDescription = description || config.description;
  const displayDescriptionCn = descriptionCn || config.descriptionCn;
  const displayAction = actionLabel || config.actionLabel;

  return (
    <View style={[styles.container, style]}>
      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <Illustration color={colors.primary} />
      </View>

      {/* Icon fallback */}
      <View style={[styles.iconWrap, { backgroundColor: colors.cinnabarGlow }]}>
        <Icon size={28} color={colors.primary} strokeWidth={1.5} />
      </View>

      {/* Title */}
      <Text style={[styles.title, { color: colors.text }]}>
        {displayTitle}
      </Text>
      {showChinese && displayTitleCn && (
        <Text style={[styles.titleCn, { color: colors.primary }]}>
          {displayTitleCn}
        </Text>
      )}

      {/* Description */}
      <Text style={[styles.description, { color: colors.mutedText }]}>
        {displayDescription}
      </Text>
      {showChinese && displayDescriptionCn && (
        <Text style={[styles.descriptionCn, { color: colors.mutedText }]}>
          {displayDescriptionCn}
        </Text>
      )}

      {/* Action button */}
      {displayAction && onAction && (
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            { backgroundColor: colors.primary },
            pressed && styles.actionButtonPressed,
          ]}
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={displayAction}
        >
          <Text style={styles.actionText}>{displayAction}</Text>
          <ArrowRight size={14} color="#FFFFFF" strokeWidth={2} />
        </Pressable>
      )}
    </View>
  );
}

// Simplified version for inline use
export function EmptyStateInline({ variant = 'generic', message, style }) {
  const { colors } = useTheme();
  const config = emptyStateVariants[variant] || emptyStateVariants.generic;
  const Icon = config.icon;

  return (
    <View style={[styles.inlineContainer, style]}>
      <Icon size={20} color={colors.mutedText} strokeWidth={1.5} />
      <Text style={[styles.inlineText, { color: colors.mutedText }]}>
        {message || config.description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  illustrationContainer: {
    marginBottom: 16,
  },
  illustration: {
    width: 100,
    height: 60,
    position: 'relative',
  },
  // Mountain shapes
  mountainBase: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 50,
    borderRightWidth: 50,
    borderBottomWidth: 40,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  mountainLeft: {
    position: 'absolute',
    bottom: 0,
    left: 5,
    width: 0,
    height: 0,
    borderRightWidth: 35,
    borderBottomWidth: 30,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  mountainRight: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    width: 0,
    height: 0,
    borderLeftWidth: 30,
    borderBottomWidth: 25,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  celestialBody: {
    position: 'absolute',
    top: 5,
    right: 15,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
  // Scroll shapes
  scrollBody: {
    width: 70,
    height: 45,
    borderWidth: 2,
    borderRadius: 4,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollLine: {
    height: 2,
    width: '100%',
    marginBottom: 4,
    borderRadius: 1,
  },
  scrollEnd: {
    position: 'absolute',
    width: 80,
    height: 6,
    borderRadius: 3,
  },
  // Bowl shapes
  bowlOuter: {
    width: 60,
    height: 35,
    borderWidth: 2,
    borderRadius: 30,
    borderBottomWidth: 3,
    position: 'relative',
  },
  bowlInner: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    bottom: 8,
    borderRadius: 20,
  },
  steamLine: {
    position: 'absolute',
    top: -15,
    width: 2,
    height: 12,
    borderRadius: 1,
  },
  // Compass shapes
  compassOuter: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  compassInner: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
  },
  compassNeedle: {
    position: 'absolute',
    width: 2,
    height: 20,
    borderRadius: 1,
  },
  // Content styles
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  titleCn: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
    marginBottom: 4,
  },
  descriptionCn: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
  },
  actionButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  // Inline styles
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 20,
  },
  inlineText: {
    fontSize: 13,
    textAlign: 'center',
  },
});
