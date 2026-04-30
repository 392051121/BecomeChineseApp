import React, { useRef } from 'react';
import { Modal, Pressable, StyleSheet, Text, View, Share } from 'react-native';
import { X, Share2, Copy, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';

import { theme } from '../theme/theme';
import { logger } from '../utils/errorHandling';

export function ShareCardPreviewModal({ visible, card, onClose, cardRef }) {
  const [copied, setCopied] = React.useState(false);
  const [sharing, setSharing] = React.useState(false);

  async function handleShare() {
    if (!cardRef?.current) return;

    setSharing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

    try {
      const uri = await captureRef(cardRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          dialogTitle: 'Share Your Achievement',
          mimeType: 'image/png',
        });
      }
    } catch (error) {
      logger.error('ShareCard', 'Failed to share', error);
    } finally {
      setSharing(false);
    }
  }

  async function handleCopyText(text) {
    await Clipboard.setStringAsync(text);
    setCopied(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setTimeout(() => setCopied(false), 2000);
  }

  if (!card) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Share Your Achievement</Text>
            <Pressable style={styles.closeBtn} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close modal" accessibilityHint="Double tap to close">
              <X size={20} color={theme.colors.mutedText} strokeWidth={2} />
            </Pressable>
          </View>

          {/* Card Preview */}
          <View style={styles.previewWrap} collapsable={false} ref={cardRef}>
            {card}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable
              style={[styles.actionBtn, styles.primaryAction]}
              onPress={handleShare}
              disabled={sharing}
              accessibilityRole="button"
              accessibilityLabel={sharing ? "Sharing in progress" : "Share image"}
              accessibilityHint="Double tap to share your achievement as an image"
            >
              <Share2 size={18} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.primaryActionText}>
                {sharing ? 'Sharing...' : 'Share Image'}
              </Text>
            </Pressable>

            <Pressable
              style={styles.actionBtn}
              onPress={() => handleCopyText(card.props?.name || 'Achievement unlocked!')}
              accessibilityRole="button"
              accessibilityLabel={copied ? "Text copied" : "Copy text"}
              accessibilityHint="Double tap to copy achievement text"
            >
              {copied ? (
                <>
                  <Check size={18} color={theme.colors.primary} strokeWidth={2} />
                  <Text style={styles.actionText}>Copied!</Text>
                </>
              ) : (
                <>
                  <Copy size={18} color={theme.colors.primary} strokeWidth={2} />
                  <Text style={styles.actionText}>Copy Text</Text>
                </>
              )}
            </Pressable>
          </View>

          {/* Hint */}
          <Text style={styles.hint}>
            Share your progress with friends and inspire them to explore Chinese culture!
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    ...theme.shadows.strong,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  title: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(51, 51, 51, 0.06)',
  },
  previewWrap: {
    marginVertical: 8,
    transform: [{ scale: 0.85 }],
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    width: '100%',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  primaryAction: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  actionText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  hint: {
    marginTop: 16,
    color: theme.colors.mutedText,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
