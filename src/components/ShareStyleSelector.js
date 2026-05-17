/**
 * Share Style Selector Component
 *
 * Modal for selecting share card style before sharing.
 */

import React, { memo, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { X, Share2, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { Button } from './Button';
import { SHARE_STYLES } from '../utils/contentShare';

const StyleOption = memo(function StyleOption({ style, isSelected, onPress }) {
  const { colors } = useTheme();
  const styleInfo = SHARE_STYLES[style];

  return (
    <Pressable
      style={[
        styles.styleOption,
        isSelected && styles.styleOptionSelected,
        { borderColor: isSelected ? colors.primary : colors.border },
        { backgroundColor: isSelected ? colors.cinnabarGlow : colors.surface },
      ]}
      onPress={() => onPress(style)}
    >
      <View style={styles.stylePreview}>
        <View
          style={[
            styles.stylePreviewInner,
            style === 'ink' && styles.inkPreview,
            style === 'seal' && styles.sealPreview,
            style === 'paper' && styles.paperPreview,
          ]}
        >
          <Text style={styles.stylePreviewChar}>印</Text>
        </View>
      </View>
      <Text
        style={[
          styles.styleName,
          { color: isSelected ? colors.primary : colors.text },
        ]}
      >
        {styleInfo.nameEn}
      </Text>
      <Text style={[styles.styleNameCn, { color: colors.mutedText }]}>
        {styleInfo.nameCn}
      </Text>
      {isSelected && (
        <View style={styles.checkMark}>
          <Check size={14} color={colors.primary} strokeWidth={2.5} />
        </View>
      )}
    </Pressable>
  );
});

export const ShareStyleSelector = memo(function ShareStyleSelector({
  visible,
  onClose,
  onShare,
  item,
  type,
}) {
  const { colors } = useTheme();
  const [selectedStyle, setSelectedStyle] = useState('ink');
  const [isSharing, setIsSharing] = useState(false);

  const handleStyleSelect = (style) => {
    Haptics.selectionAsync().catch(() => {});
    setSelectedStyle(style);
  };

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setIsSharing(true);
    try {
      await onShare(selectedStyle);
    } finally {
      setIsSharing(false);
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.card }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Share2 size={18} color={colors.primary} strokeWidth={2} />
              <Text style={[styles.title, { color: colors.text }]}>
                Share Card
              </Text>
            </View>
            <Pressable style={styles.closeBtn} onPress={onClose}>
              <X size={20} color={colors.mutedText} strokeWidth={2} />
            </Pressable>
          </View>

          {/* Content info */}
          {item && (
            <View style={styles.contentInfo}>
              <Text style={[styles.contentName, { color: colors.text }]}>
                {item.nameCn}
              </Text>
              <Text style={[styles.contentNameEn, { color: colors.mutedText }]}>
                {item.nameEn}
              </Text>
            </View>
          )}

          {/* Style options */}
          <View style={styles.stylesGrid}>
            {Object.keys(SHARE_STYLES).map((style) => (
              <StyleOption
                key={style}
                style={style}
                isSelected={selectedStyle === style}
                onPress={handleStyleSelect}
              />
            ))}
          </View>

          {/* Share button */}
          <Button
            variant="primary"
            size="large"
            onPress={handleShare}
            loading={isSharing}
            style={styles.shareBtn}
          >
            Share Now
          </Button>

          {/* Platform hints */}
          <Text style={[styles.hint, { color: colors.mutedText }]}>
            Share to Instagram, Twitter, Facebook, or save to photos
          </Text>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  contentName: {
    fontSize: 24,
    fontWeight: '600',
  },
  contentNameEn: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  stylesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  styleOption: {
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  styleOptionSelected: {
    borderWidth: 2,
  },
  stylePreview: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stylePreviewInner: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  inkPreview: {
    backgroundColor: '#F5F0E8',
    borderColor: '#1B1715',
  },
  sealPreview: {
    backgroundColor: '#C23A2E',
    borderColor: '#C23A2E',
  },
  paperPreview: {
    backgroundColor: '#C23A2E',
    borderColor: '#F8F5EE',
  },
  stylePreviewChar: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1B1715',
  },
  styleName: {
    fontSize: 12,
    fontWeight: '700',
  },
  styleNameCn: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  checkMark: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  shareBtn: {
    marginBottom: 12,
  },
  hint: {
    fontSize: 11,
    textAlign: 'center',
  },
});
