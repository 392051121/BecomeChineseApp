/**
 * Content Share Card Component
 *
 * Generates beautiful share cards for content items with multiple styles.
 */

import React, { memo, useRef, forwardRef } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

import { theme } from '../theme/theme';
import { getContentTypeColor } from '../utils/contentShare';
import { getLocalImage } from '../assets/localImages';
import { SmartImageBlock } from './SmartImageBlock';

// Ink Wash Style Card (水墨风格)
export const InkWashShareCard = memo(forwardRef(function InkWashShareCard(
  { item, type, style },
  ref
) {
  const accentColor = getContentTypeColor(type);

  return (
    <View ref={ref} style={[styles.card, styles.inkCard, style]}>
      {/* Background texture */}
      <View style={styles.inkBackground} />

      {/* Content */}
      <View style={styles.inkContent}>
        {/* Title section */}
        <View style={styles.inkTitleSection}>
          <Text style={styles.inkTitleCn}>{item.nameCn}</Text>
          <Text style={styles.inkTitleEn}>{item.nameEn}</Text>
        </View>

        {/* Decorative ink splash */}
        <View style={[styles.inkSplash, { backgroundColor: accentColor }]} />

        {/* Description */}
        <Text style={styles.inkDescription} numberOfLines={3}>
          {item.summaryEn || item.tagline || item.description}
        </Text>

        {/* Footer */}
        <View style={styles.inkFooter}>
          <Text style={styles.inkBrand}>BecomeChinese</Text>
          <Text style={styles.inkType}>{type.toUpperCase()}</Text>
        </View>
      </View>
    </View>
  );
}));

// Seal Stamp Style Card (印章风格)
export const SealStampShareCard = memo(forwardRef(function SealStampShareCard(
  { item, type, style },
  ref
) {
  const accentColor = getContentTypeColor(type);

  return (
    <View ref={ref} style={[styles.card, styles.sealCard, style]}>
      {/* Red background */}
      <View style={[styles.sealBackground, { backgroundColor: accentColor }]} />

      {/* Main content */}
      <View style={styles.sealContent}>
        {/* Large character */}
        <View style={styles.sealCharWrap}>
          <Text style={styles.sealChar}>{item.nameCn?.charAt(0) || '中'}</Text>
        </View>

        {/* Info */}
        <View style={styles.sealInfo}>
          <Text style={styles.sealTitleCn}>{item.nameCn}</Text>
          <Text style={styles.sealTitleEn}>{item.nameEn}</Text>
          <Text style={styles.sealSubtitle} numberOfLines={2}>
            {item.province || item.years || ''}
          </Text>
        </View>

        {/* Decorative border */}
        <View style={styles.sealBorder}>
          <Text style={styles.sealBrand}>BecomeChinese</Text>
        </View>
      </View>
    </View>
  );
}));

// Paper Cut Style Card (剪纸风格)
export const PaperCutShareCard = memo(forwardRef(function PaperCutShareCard(
  { item, type, style },
  ref
) {
  const accentColor = getContentTypeColor(type);

  return (
    <View ref={ref} style={[styles.card, styles.paperCard, style]}>
      {/* Red paper background */}
      <View style={[styles.paperBackground, { backgroundColor: '#C23A2E' }]} />

      {/* Decorative patterns */}
      <View style={styles.paperPatterns}>
        <View style={[styles.paperPattern, styles.paperPattern1]} />
        <View style={[styles.paperPattern, styles.paperPattern2]} />
        <View style={[styles.paperPattern, styles.paperPattern3]} />
      </View>

      {/* Content */}
      <View style={styles.paperContent}>
        {/* Title */}
        <Text style={styles.paperTitleCn}>{item.nameCn}</Text>
        <Text style={styles.paperTitleEn}>{item.nameEn}</Text>

        {/* Decorative line */}
        <View style={styles.paperLine} />

        {/* Description */}
        <Text style={styles.paperDescription} numberOfLines={3}>
          {item.summaryEn || item.tagline || ''}
        </Text>

        {/* Footer */}
        <View style={styles.paperFooter}>
          <Text style={styles.paperBrand}>BecomeChinese</Text>
          <Text style={styles.paperType}>· {type.toUpperCase()}</Text>
        </View>
      </View>
    </View>
  );
}));

// Unified Content Share Card
export const ContentShareCard = memo(forwardRef(function ContentShareCard(
  { item, type, cardStyle = 'ink', style },
  ref
) {
  const CardComponent = {
    ink: InkWashShareCard,
    seal: SealStampShareCard,
    paper: PaperCutShareCard,
  }[cardStyle] || InkWashShareCard;

  return <CardComponent ref={ref} item={item} type={type} style={style} />;
}));

const styles = StyleSheet.create({
  card: {
    width: 320,
    height: 400,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: theme.colors.card,
  },

  // Ink Wash Style
  inkCard: {
    backgroundColor: '#F5F0E8',
  },
  inkBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F5F0E8',
    opacity: 0.95,
  },
  inkContent: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  inkTitleSection: {
    marginTop: 20,
  },
  inkTitleCn: {
    fontSize: 48,
    fontWeight: '600',
    color: theme.colors.text,
  },
  inkTitleEn: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.mutedText,
    marginTop: 4,
  },
  inkSplash: {
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.1,
    position: 'absolute',
    right: -20,
    top: 60,
  },
  inkDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.colors.text,
    marginTop: 20,
  },
  inkFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inkBrand: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  inkType: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.mutedText,
    letterSpacing: 1,
  },

  // Seal Stamp Style
  sealCard: {
    backgroundColor: '#C23A2E',
  },
  sealBackground: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.95,
  },
  sealContent: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sealCharWrap: {
    width: 120,
    height: 120,
    borderWidth: 3,
    borderColor: '#F8F5EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  sealChar: {
    fontSize: 64,
    fontWeight: '600',
    color: '#F8F5EE',
  },
  sealInfo: {
    alignItems: 'center',
  },
  sealTitleCn: {
    fontSize: 28,
    fontWeight: '600',
    color: '#F8F5EE',
  },
  sealTitleEn: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(248, 245, 238, 0.8)',
    marginTop: 4,
  },
  sealSubtitle: {
    fontSize: 12,
    color: 'rgba(248, 245, 238, 0.6)',
    marginTop: 8,
    textAlign: 'center',
  },
  sealBorder: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  sealBrand: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(248, 245, 238, 0.6)',
    letterSpacing: 2,
  },

  // Paper Cut Style
  paperCard: {
    backgroundColor: '#C23A2E',
  },
  paperBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  paperPatterns: {
    ...StyleSheet.absoluteFillObject,
  },
  paperPattern: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: 'rgba(248, 245, 238, 0.2)',
    borderRadius: 20,
  },
  paperPattern1: { top: 20, left: 20 },
  paperPattern2: { top: 40, right: 30 },
  paperPattern3: { bottom: 60, left: 40 },
  paperContent: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paperTitleCn: {
    fontSize: 40,
    fontWeight: '600',
    color: '#F8F5EE',
    textAlign: 'center',
  },
  paperTitleEn: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(248, 245, 238, 0.8)',
    marginTop: 8,
    textAlign: 'center',
  },
  paperLine: {
    width: 60,
    height: 2,
    backgroundColor: '#F8F5EE',
    marginVertical: 20,
  },
  paperDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: 'rgba(248, 245, 238, 0.9)',
    textAlign: 'center',
  },
  paperFooter: {
    position: 'absolute',
    bottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  paperBrand: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(248, 245, 238, 0.6)',
    letterSpacing: 2,
  },
  paperType: {
    fontSize: 10,
    color: 'rgba(248, 245, 238, 0.4)',
  },
});
