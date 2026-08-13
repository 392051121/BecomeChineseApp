import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowRight, MapPin, Clock, UtensilsCrossed, Scroll, User, Sparkles } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { SectionCard } from './SectionCard';
import { getTypeIcon } from '../utils/contentTypes';

const pathConfigs = {
  silkRoad: {
    id: 'silk-road',
    title: 'The Silk Road',
    titleCn: '丝绸之路',
    description: 'Follow the ancient trade route from Xi\'an westward.',
    descriptionCn: '从长安出发，沿着古代商路向西。',
    icon: MapPin,
    color: '#C4A35A',
    steps: [
      { type: 'city', id: 'xian', label: 'Xi\'an (Chang\'an)', labelCn: '西安（长安）', reason: 'The Silk Road began at Chang\'an, the Han and Tang capital where merchants set out west.', reasonCn: '丝绸之路的起点，汉唐都城，商队由此西行。' },
      { type: 'dynasty', id: 'han', label: 'Han Dynasty', labelCn: '汉朝', reason: 'The Han dynasty first opened the trade corridor that gave the Silk Road its name.', reasonCn: '汉朝最早打通了这条以丝绸命名的贸易通道。' },
      { type: 'dynasty', id: 'tang', label: 'Tang Dynasty', labelCn: '唐朝', reason: 'Under the Tang, the route reached its peak with a cosmopolitan Chang\'an.', reasonCn: '唐代丝绸之路达到鼎盛，长安成为世界都会。' },
      { type: 'recipe', id: 'yangrou-paomo', label: 'Yangrou Paomo', labelCn: '羊肉泡馍', reason: 'A Xi\'an staple that still echoes the roadside fare fed to travelling merchants.', reasonCn: '西安名吃，仍映射着当年商旅路上的风味。' },
    ],
  },
  tangPoetry: {
    id: 'tang-poetry',
    title: 'Tang Poetry Trail',
    titleCn: '唐诗之路',
    description: 'Trace the footsteps of Tang dynasty poets.',
    descriptionCn: '追寻唐代诗人的足迹。',
    icon: Scroll,
    color: '#E2B05E',
    steps: [
      { type: 'dynasty', id: 'tang', label: 'Tang Dynasty', labelCn: '唐朝', reason: 'The Tang is often called China\'s golden age of poetry.', reasonCn: '唐朝被誉为中国诗歌的黄金时代。' },
      { type: 'person', id: 'libai', label: 'Li Bai', labelCn: '李白', reason: 'Li Bai\'s uninhibited verse embodies the Tang\'s open, confident spirit.', reasonCn: '李白飘逸豪放的诗风，正是盛唐气象的写照。' },
      { type: 'person', id: 'dufu', label: 'Du Fu', labelCn: '杜甫', reason: 'Du Fu\'s reflective poems trace the dynasty\'s turbulent later years.', reasonCn: '杜甫沉郁的诗句，记录着唐朝后期的动荡。' },
      { type: 'city', id: 'xian', label: 'Xi\'an', labelCn: '西安', reason: 'Chang\'an, today\'s Xi\'an, was where these poets lived, met, and wrote.', reasonCn: '长安（今西安）正是诗人们生活、游历、创作之地。' },
    ],
  },
  imperialBeijing: {
    id: 'imperial-beijing',
    title: 'Imperial Beijing',
    titleCn: '帝都北京',
    description: 'Explore the capital through Ming and Qing dynasties.',
    descriptionCn: '穿越明清两代的都城。',
    icon: Clock,
    color: '#9C3A2B',
    steps: [
      { type: 'city', id: 'beijing', label: 'Beijing', labelCn: '北京', reason: 'Beijing became the permanent capital under the Ming and Qing emperors.', reasonCn: '明清两代将北京定为都城。' },
      { type: 'dynasty', id: 'ming', label: 'Ming Dynasty', labelCn: '明朝', reason: 'The Ming moved the capital north and built the Forbidden City.', reasonCn: '明朝迁都北京，营建紫禁城。' },
      { type: 'dynasty', id: 'qing', label: 'Qing Dynasty', labelCn: '清朝', reason: 'The Qing inherited and expanded the imperial capital\'s grandeur.', reasonCn: '清朝继承并扩展了这座帝都的恢弘。' },
      { type: 'recipe', id: 'peking-duck', label: 'Peking Duck', labelCn: '北京烤鸭', reason: 'A dish born of the capital\'s imperial kitchens and banquets.', reasonCn: '源自帝都御膳与宴席的名菜。' },
    ],
  },
  sichuanFlavors: {
    id: 'sichuan-flavors',
    title: 'Sichuan Flavors',
    titleCn: '川味之旅',
    description: 'Discover the bold flavors of Sichuan cuisine.',
    descriptionCn: '探索川菜的麻辣风味。',
    icon: UtensilsCrossed,
    color: '#B33B24',
    steps: [
      { type: 'city', id: 'chengdu', label: 'Chengdu', labelCn: '成都' },
      { type: 'recipe', id: 'mapo-tofu', label: 'Mapo Tofu', labelCn: '麻婆豆腐' },
      { type: 'recipe', id: 'kung-pao-chicken', label: 'Kung Pao Chicken', labelCn: '宫保鸡丁' },
      { type: 'recipe', id: 'hot-pot', label: 'Hot Pot', labelCn: '火锅' },
    ],
  },
  jiangnanWater: {
    id: 'jiangnan-water',
    title: 'Jiangnan Water Towns',
    titleCn: '江南水乡',
    description: 'Wander through the elegant towns south of the Yangtze.',
    descriptionCn: '漫步长江以南的优雅水乡。',
    icon: MapPin,
    color: '#6B8A94',
    steps: [
      { type: 'city', id: 'suzhou', label: 'Suzhou', labelCn: '苏州' },
      { type: 'city', id: 'hangzhou', label: 'Hangzhou', labelCn: '杭州' },
      { type: 'dynasty', id: 'song', label: 'Song Dynasty', labelCn: '宋朝' },
      { type: 'recipe', id: 'dongpo-pork', label: 'Dongpo Pork', labelCn: '东坡肉' },
    ],
  },
  // New expanded paths
  cantoneseDimSum: {
    id: 'cantonese-dim-sum',
    title: 'Cantonese Dim Sum',
    titleCn: '粤式点心',
    description: 'Explore the art of Cantonese morning tea culture.',
    descriptionCn: '探索广式早茶文化的精髓。',
    icon: UtensilsCrossed,
    color: '#D4A574',
    steps: [
      { type: 'city', id: 'guangzhou', label: 'Guangzhou', labelCn: '广州' },
      { type: 'recipe', id: 'shrimp-dumplings', label: 'Har Gow', labelCn: '虾饺' },
      { type: 'recipe', id: 'siu-mai', label: 'Siu Mai', labelCn: '烧卖' },
      { type: 'recipe', id: 'char-siu', label: 'Char Siu', labelCn: '叉烧' },
    ],
  },
  qinUnification: {
    id: 'qin-unification',
    title: 'Qin Unification',
    titleCn: '秦统天下',
    description: 'Witness China\'s first imperial unification.',
    descriptionCn: '见证中国首次大一统。',
    icon: Clock,
    color: '#4A4A4A',
    steps: [
      { type: 'dynasty', id: 'qin', label: 'Qin Dynasty', labelCn: '秦朝', reason: 'The Qin first unified China\'s warring states under a single emperor.', reasonCn: '秦朝首次统一诸侯国，建立大一统帝制。' },
      { type: 'city', id: 'xian', label: 'Xi\'an (Xianyang)', labelCn: '西安（咸阳）', reason: 'Xianyang, near Xi\'an, was the Qin capital and the seat of its court.', reasonCn: '咸阳（今西安附近）是秦都，王朝权力中心。' },
      { type: 'recipe', id: 'biang-biang-noodles', label: 'Biang Biang Noodles', labelCn: '油泼面', reason: 'A hearty Shaanxi noodle rooted in the region\'s ancient wheat traditions.', reasonCn: '陕西豪迈面食，源于这片土地的古老麦作传统。' },
      { type: 'dynasty', id: 'han', label: 'Han Dynasty Legacy', labelCn: '汉朝传承', reason: 'The Han built on Qin unification to shape what "Chinese" would come to mean.', reasonCn: '汉承秦制，奠定了后世对华夏的认知。' },
    ],
  },
  festivalFoods: {
    id: 'festival-foods',
    title: 'Festival Foods',
    titleCn: '节令美食',
    description: 'Discover traditional foods for Chinese festivals.',
    descriptionCn: '探索中国传统节日的应季美食。',
    icon: UtensilsCrossed,
    color: '#C41E3A',
    steps: [
      { type: 'recipe', id: 'dumplings', label: 'Dumplings (Spring Festival)', labelCn: '饺子（春节）', reason: 'Dumplings symbolise wealth and family reunion at the new year.', reasonCn: '饺子象征团圆与富足，是新春的必备。' },
      { type: 'recipe', id: 'zongzi', label: 'Zongzi (Dragon Boat)', labelCn: '粽子（端午）', reason: 'Zongzi are wrapped for the Dragon Boat Festival, honouring poet Qu Yuan.', reasonCn: '端午包粽子，纪念诗人屈原。' },
      { type: 'recipe', id: 'mooncake', label: 'Mooncake (Mid-Autumn)', labelCn: '月饼（中秋）', reason: 'Mooncakes are shared under the full moon to celebrate reunion.', reasonCn: '中秋月圆，月饼寄托团圆之意。' },
      { type: 'recipe', id: 'tangyuan', label: 'Tangyuan (Lantern)', labelCn: '汤圆（元宵）', reason: 'Sweet tangyuan round out the Lantern Festival as a wish for wholeness.', reasonCn: '元宵吃汤圆，寓意圆满。' },
    ],
  },
  ancientPhilosophers: {
    id: 'ancient-philosophers',
    title: 'Ancient Philosophers',
    titleCn: '诸子百家',
    description: 'Meet the great thinkers of ancient China.',
    descriptionCn: '认识中国古代伟大的思想家。',
    icon: Scroll,
    color: '#5D4E37',
    steps: [
      { type: 'dynasty', id: 'zhou', label: 'Zhou Dynasty', labelCn: '周朝' },
      { type: 'person', id: 'kongzi', label: 'Confucius', labelCn: '孔子' },
      { type: 'person', id: 'laozi', label: 'Laozi', labelCn: '老子' },
      { type: 'city', id: 'qufu', label: 'Qufu (Confucius Home)', labelCn: '曲阜' },
    ],
  },
  silkRoadEast: {
    id: 'silk-road-east',
    title: 'Maritime Silk Road',
    titleCn: '海上丝绸之路',
    description: 'Trace the sea routes from Fujian to the world.',
    descriptionCn: '追溯从福建通往世界的海上航线。',
    icon: MapPin,
    color: '#4169E1',
    steps: [
      { type: 'city', id: 'xiamen', label: 'Xiamen', labelCn: '厦门' },
      { type: 'city', id: 'guangzhou', label: 'Guangzhou', labelCn: '广州' },
      { type: 'dynasty', id: 'ming', label: 'Ming Voyages', labelCn: '明朝远航' },
      { type: 'recipe', id: 'steamed-fish', label: 'Steamed Fish', labelCn: '清蒸鱼' },
    ],
  },
  mountainRetreats: {
    id: 'mountain-retreats',
    title: 'Sacred Mountains',
    titleCn: '名山胜境',
    description: 'Explore China\'s sacred mountain traditions.',
    descriptionCn: '探索中国名山的文化传统。',
    icon: MapPin,
    color: '#228B22',
    steps: [
      { type: 'city', id: 'hangzhou', label: 'Hangzhou (West Lake)', labelCn: '杭州西湖' },
      { type: 'city', id: 'chengdu', label: 'Chengdu (Mt. Qingcheng)', labelCn: '成都青城山' },
      { type: 'dynasty', id: 'tang', label: 'Tang Mountain Poetry', labelCn: '唐代山水诗' },
      { type: 'recipe', id: 'longjing-shrimp', label: 'Longjing Shrimp', labelCn: '龙井虾仁' },
    ],
  },
  northernFlavors: {
    id: 'northern-flavors',
    title: 'Northern Flavors',
    titleCn: '北方面食',
    description: 'Discover the wheat-based cuisine of northern China.',
    descriptionCn: '探索中国北方的面食文化。',
    icon: UtensilsCrossed,
    color: '#8B4513',
    steps: [
      { type: 'city', id: 'beijing', label: 'Beijing', labelCn: '北京' },
      { type: 'recipe', id: 'zhajiang-noodles', label: 'Zhajiang Noodles', labelCn: '炸酱面' },
      { type: 'recipe', id: 'dumplings', label: 'Dumplings', labelCn: '饺子' },
      { type: 'recipe', id: 'scallion-pancakes', label: 'Scallion Pancakes', labelCn: '葱油饼' },
    ],
  },
  lingnanCulture: {
    id: 'lingnan-culture',
    title: 'Lingnan Heritage',
    titleCn: '岭南文化',
    description: 'Experience the unique culture of southern China.',
    descriptionCn: '体验中国南方独特的岭南文化。',
    icon: MapPin,
    color: '#FF6347',
    steps: [
      { type: 'city', id: 'guangzhou', label: 'Guangzhou', labelCn: '广州' },
      { type: 'recipe', id: 'congee', label: 'Congee', labelCn: '粥' },
      { type: 'recipe', id: 'claypot-rice', label: 'Claypot Rice', labelCn: '煲仔饭' },
      { type: 'recipe', id: 'egg-tarts', label: 'Egg Tarts', labelCn: '蛋挞' },
    ],
  },
};

export function PathCard({ pathId, onPress }) {
  const config = pathConfigs[pathId];
  if (!config) return null;

  const Icon = config.icon;

  function handlePress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress?.(config);
  }

  return (
    <Pressable
      style={styles.card}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`${config.title} - ${config.titleCn}. ${config.description}`}
      accessibilityHint="Double tap to explore this cultural path"
    >
      <View style={[styles.iconWrap, { backgroundColor: `${config.color}18` }]}>
        <Icon size={20} color={config.color} strokeWidth={2} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{config.title}</Text>
        <Text style={styles.titleCn}>{config.titleCn}</Text>
        <Text style={styles.description} numberOfLines={2}>{config.description}</Text>
        <View style={styles.stepsPreview}>
          {config.steps.slice(0, 3).map((step, idx) => {
            const StepIcon = getTypeIcon(step.type);
            return (
              <View key={`${step.type}-${step.id}`} style={styles.stepItem}>
                <StepIcon size={10} color={theme.colors.mutedText} strokeWidth={2} />
                <Text style={styles.stepLabel} numberOfLines={1}>{step.label}</Text>
                {idx < Math.min(config.steps.length, 3) - 1 && (
                  <ArrowRight size={8} color={theme.colors.border} strokeWidth={2} />
                )}
              </View>
            );
          })}
        </View>
      </View>
      <ArrowRight size={16} color={theme.colors.mutedText} strokeWidth={2} />
    </Pressable>
  );
}

export function PathDetailCard({ path, onStepPress }) {
  if (!path) return null;

  const Icon = path.icon;

  return (
    <SectionCard style={styles.detailCard} tone="soft">
      <View style={styles.detailHeader}>
        <View style={[styles.detailIconWrap, { backgroundColor: `${path.color}18` }]}>
          <Icon size={24} color={path.color} strokeWidth={2} />
        </View>
        <View style={styles.detailTitleWrap}>
          <Text style={styles.detailTitle}>{path.title}</Text>
          <Text style={styles.detailTitleCn}>{path.titleCn}</Text>
        </View>
      </View>

      <Text style={styles.detailDescription}>{path.description}</Text>
      <Text style={styles.detailDescriptionCn}>{path.descriptionCn}</Text>

      <View style={styles.stepsList}>
        <Text style={styles.stepsLabel}>Path Steps</Text>
        {path.steps.map((step, idx) => {
          const StepIcon = getTypeIcon(step.type);
          return (
            <Pressable
              key={`${step.type}-${step.id}`}
              style={styles.stepRow}
              onPress={() => onStepPress?.(step)}
              accessibilityRole="button"
              accessibilityLabel={`Step ${idx + 1}: ${step.label} - ${step.labelCn}`}
              accessibilityHint="Double tap to view details"
            >
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{idx + 1}</Text>
              </View>
              <View style={styles.stepIconWrap}>
                <StepIcon size={14} color={theme.colors.primary} strokeWidth={2} />
              </View>
              <View style={styles.stepTextWrap}>
                <Text style={styles.stepName}>{step.label}</Text>
                <Text style={styles.stepNameCn}>{step.labelCn}</Text>
              </View>
              <ArrowRight size={14} color={theme.colors.mutedText} strokeWidth={2} />
            </Pressable>
          );
        })}
      </View>
    </SectionCard>
  );
}

export function PathsSection({ onPathPress }) {
  const { colors } = useTheme();
  const pathIds = ['silkRoad', 'tangPoetry', 'imperialBeijing', 'sichuanFlavors', 'jiangnanWater', 'cantoneseDimSum', 'qinUnification', 'festivalFoods', 'ancientPhilosophers', 'silkRoadEast', 'mountainRetreats', 'northernFlavors', 'lingnanCulture'];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>Cultural Paths</Text>
      <Text style={styles.sectionHint}>Follow curated routes through Chinese culture.</Text>
      <View style={styles.pathsList}>
        {pathIds.map((pathId) => (
          <PathCard key={pathId} pathId={pathId} onPress={onPathPress} />
        ))}
      </View>
    </View>
  );
}

export const availablePaths = Object.values(pathConfigs);
export { pathConfigs };

const styles = StyleSheet.create({
  section: {
    marginTop: 14,
  },
  sectionLabel: {
    color: theme.colors.primary,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  sectionHint: {
    marginTop: 4,
    color: theme.colors.mutedText,
    fontSize: 12,
    lineHeight: 18,
  },
  pathsList: {
    marginTop: 12,
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    padding: 14,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  titleCn: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  description: {
    marginTop: 4,
    color: theme.colors.mutedText,
    fontSize: 11,
    lineHeight: 16,
  },
  stepsPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stepLabel: {
    color: theme.colors.mutedText,
    fontSize: 10,
    maxWidth: 60,
  },

  // Detail card
  detailCard: {
    padding: 16,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailTitleWrap: {
    flex: 1,
  },
  detailTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  detailTitleCn: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  detailDescription: {
    marginTop: 12,
    color: theme.colors.text,
    fontSize: 14,
    lineHeight: 21,
  },
  detailDescriptionCn: {
    marginTop: 4,
    color: theme.colors.mutedText,
    fontSize: 12,
    lineHeight: 18,
  },
  stepsList: {
    marginTop: 16,
  },
  stepsLabel: {
    color: theme.colors.primary,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 10,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: theme.radii.sm,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  stepNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.cinnabarGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '800',
  },
  stepIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: theme.colors.cinnabarGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTextWrap: {
    flex: 1,
  },
  stepName: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  stepNameCn: {
    color: theme.colors.mutedText,
    fontSize: 11,
    marginTop: 1,
  },
});
