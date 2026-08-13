import { Platform, Share } from 'react-native';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import { logger } from './errorHandling';

/**
 * Share text content via the native share sheet.
 *
 * Expo SDK 54's expo-file-system no longer exposes writeAsStringAsync/cacheDirectory
 * on the default export (they throw at runtime). Text sharing should use RN Share.
 */
export async function shareText(content, title = 'BecomeChinese') {
  try {
    const message = typeof content === 'string' ? content.trim() : '';
    if (!message) return false;

    const result = await Share.share(
      Platform.OS === 'ios'
        ? { message, title }
        : { message, title, subject: title }
    );

    // User cancelled the sheet is not an error.
    if (result?.action === Share.dismissedAction) return false;
    return true;
  } catch (error) {
    // Some platforms reject the promise on cancel.
    const msg = String(error?.message || error || '');
    if (/cancel/i.test(msg)) return false;
    logger.error('Sharing', 'Share text error', error);
    return false;
  }
}

/**
 * Capture a view as image and share it
 */
export async function shareViewAsImage(viewRef, options = {}) {
  try {
    const uri = await captureRef(viewRef, {
      format: 'png',
      quality: 1,
      ...options,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        dialogTitle: 'Share My Atlas',
        mimeType: 'image/png',
      });
      return true;
    } else {
      // Sharing not available, just return the URI
      return uri;
    }
  } catch (error) {
    logger.error('Sharing', 'Share image error', error);
    return false;
  }
}

/**
 * Generate a shareable text card for the user's atlas
 */
export function generateAtlasShareText(data) {
  const { hanzi, pinyin, meaning, rank, regions, savedCount } = data;

  const lines = [
    `🀄 BecomeChinese Atlas`,
    ``,
    `${hanzi} (${pinyin})`,
    `${meaning}`,
    ``,
    `📍 Connected: ${regions} regions`,
    `🏆 Rank: ${rank}`,
    `❤️ Saved: ${savedCount} items`,
    ``,
    `Explore Chinese culture through cities, dishes, and dynasties.`,
  ];

  return lines.join('\n');
}

/**
 * Generate a shareable text for daily quiz result
 */
export function generateQuizShareText(data) {
  const { question, correct, streak, totalSolved, solarTerm } = data;

  const lines = [
    `🀄 BecomeChinese Daily`,
    ``,
    `📅 ${solarTerm}`,
    `✅ ${correct ? 'Correct!' : 'Learned something new'}`,
    `🔥 Streak: ${streak} days`,
    `🎯 Total: ${totalSolved} solved`,
    ``,
    `Keep exploring Chinese culture every day.`,
  ];

  return lines.join('\n');
}

/**
 * Generate a shareable text for a city
 */
export function generateCityShareText(data) {
  const { nameCn, nameEn, province, tagline, highlights } = data;
  const highlightList = Array.isArray(highlights) ? highlights : [];

  const lines = [
    `🀄 BecomeChinese City`,
    ``,
    `${nameCn} · ${nameEn}`,
    province ? `📍 ${province}` : '',
    tagline || '',
    ``,
    highlightList.length > 0 ? `✨ Highlights: ${highlightList.slice(0, 3).join(', ')}` : '',
    ``,
    `Discover more cities and their stories.`,
  ];

  return lines.filter(Boolean).join('\n');
}

/**
 * Generate a shareable text for a recipe
 */
export function generateRecipeShareText(data) {
  const { nameCn, nameEn, province, culturalStory, tasteProfile } = data;

  const lines = [
    `🀄 BecomeChinese Food`,
    ``,
    `${nameCn} · ${nameEn}`,
    `📍 ${province}`,
    `${tasteProfile?.slice(0, 2).join(' · ') || 'Traditional'}`,
    ``,
    `${culturalStory?.slice(0, 100)}...`,
    ``,
    `Explore more dishes and their stories.`,
  ];

  return lines.filter(Boolean).join('\n');
}

/**
 * Generate a shareable text for a dynasty
 */
export function generateDynastyShareText(data) {
  const { nameCn, nameEn, period, tagline, contribution } = data;

  const lines = [
    `🀄 BecomeChinese History`,
    ``,
    `${nameCn} · ${nameEn}`,
    `📅 ${period}`,
    `${tagline}`,
    ``,
    `🏛️ ${contribution?.item || 'Cultural legacy'}`,
    ``,
    `Explore more dynasties and their stories.`,
  ];

  return lines.filter(Boolean).join('\n');
}