/**
 * Content Share Utility
 *
 * Generates share cards for content items and handles native sharing.
 * Supports multiple card styles: ink wash, seal stamp, paper cut.
 */

import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as Haptics from 'expo-haptics';

import { theme } from '../theme/theme';

// Share card styles
export const SHARE_STYLES = {
  ink: {
    id: 'ink',
    nameEn: 'Ink Wash',
    nameCn: '水墨',
    description: 'Traditional ink wash painting style',
  },
  seal: {
    id: 'seal',
    nameEn: 'Seal Stamp',
    nameCn: '印章',
    description: 'Classic seal stamp design',
  },
  paper: {
    id: 'paper',
    nameEn: 'Paper Cut',
    nameCn: '剪纸',
    description: 'Festive paper cut art style',
  },
};

/**
 * Generate share text for content
 */
export function generateShareText(item, type) {
  const templates = {
    city: {
      title: `Discover ${item.nameEn}`,
      body: `${item.nameCn} - ${item.province}\n${item.tagline || item.summaryEn || ''}`,
      hashtag: '#BecomeChinese #ChinaTravel',
    },
    food: {
      title: `Taste ${item.nameEn}`,
      body: `${item.nameCn}\n${item.culturalBackground || ''}`,
      hashtag: '#BecomeChinese #ChineseFood',
    },
    dynasty: {
      title: `Explore ${item.nameEn}`,
      body: `${item.nameCn} (${item.years || ''})\n${item.summaryEn || ''}`,
      hashtag: '#BecomeChinese #ChineseHistory',
    },
    person: {
      title: `Meet ${item.nameEn}`,
      body: `${item.nameCn}\n${item.achievements?.[0] || ''}`,
      hashtag: '#BecomeChinese #ChineseHistory',
    },
  };

  const template = templates[type] || templates.city;

  return {
    title: template.title,
    body: template.body,
    hashtag: template.hashtag,
    full: `${template.title}\n\n${template.body}\n\n${template.hashtag}`,
  };
}

/**
 * Capture view as image
 */
export async function captureShareCard(ref, options = {}) {
  try {
    const uri = await captureRef(ref, {
      format: options.format || 'png',
      quality: options.quality || 1,
      result: 'tmpfile',
      ...options,
    });

    return uri;
  } catch (e) {
    console.error('Failed to capture share card:', e);
    return null;
  }
}

/**
 * Share content via native share sheet
 */
export async function shareContent(uri, options = {}) {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      console.warn('Sharing is not available on this device');
      return false;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

    await Sharing.shareAsync(uri, {
      dialogTitle: options.dialogTitle || 'Share',
      mimeType: options.mimeType || 'image/png',
      UTI: 'public.png',
    });

    return true;
  } catch (e) {
    console.error('Failed to share content:', e);
    return false;
  }
}

/**
 * Share text content
 */
export async function shareText(text, title = 'Share') {
  try {
    // For text sharing, we'll use a different approach
    // Since expo-sharing doesn't support text directly, we create a simple text file
    const { FileSystem } = require('expo-file-system');

    const fileUri = `${FileSystem.cacheDirectory}share.txt`;
    await FileSystem.writeAsStringAsync(fileUri, text);

    await shareContent(fileUri, {
      dialogTitle: title,
      mimeType: 'text/plain',
    });

    return true;
  } catch (e) {
    console.error('Failed to share text:', e);
    return false;
  }
}

/**
 * Full share flow: capture card and share
 */
export async function shareContentCard(cardRef, item, type) {
  try {
    // Capture the card
    const uri = await captureShareCard(cardRef);
    if (!uri) return false;

    // Share via native sheet
    const shareText = generateShareText(item, type);
    return await shareContent(uri, {
      dialogTitle: shareText.title,
    });
  } catch (e) {
    console.error('Failed to share content card:', e);
    return false;
  }
}

/**
 * Get content type color
 */
export function getContentTypeColor(type) {
  const colors = {
    city: '#6B8A94',
    food: '#E2B05E',
    dynasty: '#B33B24',
    person: '#C23A2E',
    festival: '#F59E0B',
  };
  return colors[type] || theme.colors.primary;
}

/**
 * Get content type icon name
 */
export function getContentTypeIcon(type) {
  const icons = {
    city: 'map-pin',
    food: 'utensils',
    dynasty: 'scroll',
    person: 'user',
    festival: 'sparkles',
  };
  return icons[type] || 'star';
}
