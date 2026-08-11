/**
 * Personalization Components
 *
 * Avatar frames and titles selection UI.
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Crown,
  Sparkles,
  Star,
  Lock,
  Check,
  X,
  Palette,
  Award,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { PaperTexture } from './PaperTexture';
import { RarityBadge } from './RarityBadge';
import {
  getPersonalization,
  setActiveFrame,
  setActiveTitle,
  checkUnlocks,
  AVATAR_FRAMES,
  TITLES,
  getFrameById,
  getTitleById,
} from '../utils/personalization';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Personalization Modal
 */
export function PersonalizationModal({ visible, onClose, onChanged, stats }) {
  const { colors } = useTheme();
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('frames');
  const [selecting, setSelecting] = useState(null);

  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      loadData();
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.9);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  const loadData = async () => {
    // Run unlock checks against provided stats so freshly-earned items
    // become available immediately.
    if (stats) {
      try {
        await checkUnlocks(stats);
      } catch (e) {
        // ignore unlock refresh errors
      }
    }
    const personalization = await getPersonalization();
    setData(personalization);
    return personalization;
  };

  const notifyChanged = (nextData) => {
    onChanged?.(nextData);
  };

  const handleSelectFrame = async (frameId) => {
    if (selecting || !data.unlockedFrames.includes(frameId)) return;

    setSelecting(frameId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

    const result = await setActiveFrame(frameId);
    if (result.success) {
      const next = await loadData();
      notifyChanged(next);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }

    setSelecting(null);
  };

  const handleSelectTitle = async (titleId) => {
    if (selecting || !data.unlockedTitles.includes(titleId)) return;

    setSelecting(titleId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

    const result = await setActiveTitle(titleId);
    if (result.success) {
      const next = await loadData();
      notifyChanged(next);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }

    setSelecting(null);
  };

  const checkUnlock = (item, unlockedList) => {
    if (!item.requirement) return true;
    return unlockedList.includes(item.id);
  };

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose?.();
    });
  };

  if (!data) return null;

  const currentFrame = getFrameById(data.frameId);
  const currentTitle = getTitleById(data.titleId);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <PaperTexture />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Palette size={24} color={colors.primary} strokeWidth={2} />
            </View>
            <Text style={styles.title}>Personalize</Text>
            <Text style={styles.titleCn}>个性化</Text>
            <Pressable style={styles.closeBtn} onPress={handleClose}>
              <X size={20} color={colors.mutedText} strokeWidth={2} />
            </Pressable>
          </View>

          {/* Current Selection Preview */}
          <View style={styles.previewSection}>
            <View style={styles.previewAvatar}>
              <AvatarFrame frame={currentFrame} size={60} />
              <View style={styles.previewTitleWrap}>
                <Text style={[styles.previewTitle, { color: currentFrame.borderColor }]}>
                  {currentTitle.name}
                </Text>
                <Text style={styles.previewTitleCn}>{currentTitle.nameCn}</Text>
              </View>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabsRow}>
            <Pressable
              style={[styles.tab, activeTab === 'frames' && styles.tabActive]}
              onPress={() => setActiveTab('frames')}
            >
              <Crown size={14} color={activeTab === 'frames' ? colors.primary : colors.mutedText} strokeWidth={2} />
              <Text style={[styles.tabText, activeTab === 'frames' && styles.tabTextActive]}>Frames</Text>
            </Pressable>
            <Pressable
              style={[styles.tab, activeTab === 'titles' && styles.tabActive]}
              onPress={() => setActiveTab('titles')}
            >
              <Award size={14} color={activeTab === 'titles' ? colors.primary : colors.mutedText} strokeWidth={2} />
              <Text style={[styles.tabText, activeTab === 'titles' && styles.tabTextActive]}>Titles</Text>
            </Pressable>
          </View>

          {/* Content */}
          {activeTab === 'frames' ? (
            <View style={styles.itemsGrid}>
              {AVATAR_FRAMES.map((frame) => {
                const isUnlocked = checkUnlock(frame, data.unlockedFrames);
                const isSelected = data.frameId === frame.id;

                return (
                  <Pressable
                    key={frame.id}
                    style={[
                      styles.itemCard,
                      isSelected && styles.itemCardSelected,
                      !isUnlocked && styles.itemCardLocked,
                    ]}
                    onPress={() => handleSelectFrame(frame.id)}
                    disabled={!isUnlocked}
                  >
                    <AvatarFrame frame={frame} size={40} />
                    <Text style={styles.itemName}>{frame.name}</Text>
                    <Text style={[styles.itemNameCn, { color: frame.borderColor }]}>
                      {frame.nameCn}
                    </Text>
                    <RarityBadge rarity={frame.rarity} size="sm" />
                    {!isUnlocked && (
                      <View style={styles.lockOverlay}>
                        <Lock size={14} color={colors.mutedText} strokeWidth={2} />
                      </View>
                    )}
                    {isSelected && (
                      <View style={[styles.selectedBadge, { backgroundColor: colors.success }]}>
                        <Check size={10} color="#FFFFFF" strokeWidth={2.5} />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <View style={styles.itemsGrid}>
              {TITLES.map((title) => {
                const isUnlocked = checkUnlock(title, data.unlockedTitles);
                const isSelected = data.titleId === title.id;

                return (
                  <Pressable
                    key={title.id}
                    style={[
                      styles.itemCard,
                      isSelected && styles.itemCardSelected,
                      !isUnlocked && styles.itemCardLocked,
                    ]}
                    onPress={() => handleSelectTitle(title.id)}
                    disabled={!isUnlocked}
                  >
                    <View style={styles.titleIconWrap}>
                      <Award size={20} color={isUnlocked ? colors.primary : colors.mutedText} strokeWidth={2} />
                    </View>
                    <Text style={styles.itemName}>{title.name}</Text>
                    <Text style={[styles.itemNameCn, { color: colors.primary }]}>
                      {title.nameCn}
                    </Text>
                    <RarityBadge rarity={title.rarity} size="sm" />
                    {!isUnlocked && (
                      <View style={styles.lockOverlay}>
                        <Lock size={14} color={colors.mutedText} strokeWidth={2} />
                      </View>
                    )}
                    {isSelected && (
                      <View style={[styles.selectedBadge, { backgroundColor: colors.success }]}>
                        <Check size={10} color="#FFFFFF" strokeWidth={2.5} />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

/**
 * Avatar Frame Component
 */
export function AvatarFrame({ frame, size = 40 }) {
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (frame.glowColor) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [frame.glowColor]);

  const glowScale = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  return (
    <View style={{ width: size, height: size }}>
      {frame.glowColor && (
        <Animated.View
          style={[
            styles.frameGlow,
            {
              backgroundColor: frame.glowColor,
              width: size * 1.3,
              height: size * 1.3,
              borderRadius: size * 0.65,
              transform: [{ scale: glowScale }],
            },
          ]}
        />
      )}
      <View
        style={[
          styles.frameBorder,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: frame.borderColor,
          },
        ]}
      >
        <View style={[styles.frameInner, { borderRadius: size / 2 - 3 }]}>
          <Star size={size * 0.4} color={frame.borderColor} strokeWidth={2} />
        </View>
      </View>
    </View>
  );
}

/**
 * User Title Badge
 */
export function UserTitleBadge({ title }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.titleBadge, { borderColor: colors.primary }]}>
      <Award size={10} color={colors.primary} strokeWidth={2} />
      <Text style={[styles.titleBadgeText, { color: colors.primary }]}>
        {title.nameCn}
      </Text>
    </View>
  );
}

/**
 * Compact personalization button
 */
export function PersonalizeButton({ onPress }) {
  const { colors } = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [styles.compactBtn, pressed && styles.compactBtnPressed]}
      onPress={onPress}
    >
      <Palette size={14} color={colors.primary} strokeWidth={2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: SCREEN_WIDTH - 40,
    maxHeight: 500,
    backgroundColor: '#FFFBF6',
    borderRadius: 24,
    overflow: 'hidden',
    ...theme.shadows.strong,
  },
  header: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
    position: 'relative',
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: theme.colors.cinnabarGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.text,
  },
  titleCn: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
    marginTop: 2,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },

  // Preview
  previewSection: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  previewAvatar: {
    alignItems: 'center',
  },
  previewTitleWrap: {
    marginTop: 8,
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  previewTitleCn: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
  },

  // Tabs
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  tabActive: {
    backgroundColor: theme.colors.cinnabarGlow,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.mutedText,
  },
  tabTextActive: {
    color: theme.colors.primary,
  },

  // Items grid
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  itemCard: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  itemCardSelected: {
    backgroundColor: theme.colors.cinnabarGlow,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  itemCardLocked: {
    opacity: 0.5,
  },
  itemName: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: 6,
  },
  itemNameCn: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 1,
  },
  lockOverlay: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  selectedBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.cinnabarGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Frame styles
  frameGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -30,
    marginLeft: -30,
  },
  frameBorder: {
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frameInner: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.cinnabarGlow,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 3,
  },

  // Title badge
  titleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  titleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },

  // Compact button
  compactBtn: {
    backgroundColor: theme.colors.cinnabarGlow,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
  },
  compactBtnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});