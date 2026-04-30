import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

export function ScreenHeader({ kicker, title, titleZh, subtitle, align = 'left', style, includeTopInset = true }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.root,
      align === 'center' && styles.center,
      includeTopInset && { paddingTop: insets.top },
      style,
    ]}>
      {kicker ? (
        <View style={styles.kickerRow}>
          <Text style={[styles.kicker, { color: colors.primary }]}>{kicker}</Text>
        </View>
      ) : null}
      {titleZh ? (
        <Text style={[styles.titleZh, align === 'center' && styles.titleCenter, { color: colors.text }]}>
          {titleZh}
        </Text>
      ) : null}
      <Text style={[styles.title, align === 'center' && styles.titleCenter, { color: colors.text }]}>{title}</Text>
      {subtitle ? <Text style={[styles.subtitle, align === 'center' && styles.subtitleCenter, { color: colors.mutedText }]}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    marginBottom: 12,
  },
  center: {
    alignItems: 'center',
  },
  kickerRow: {
    marginBottom: 4,
  },
  kicker: {
    color: theme.colors.primary,
    fontSize: 10,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  titleZh: {
    color: theme.colors.text,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: theme.typography.hanziLetterSpacing,
    fontWeight: '700',
    maxWidth: 340,
  },
  title: {
    marginTop: 6,
    color: theme.colors.text,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.2,
    fontWeight: '700',
    maxWidth: 340,
  },
  titleCenter: {
    textAlign: 'center',
  },
  subtitle: {
    color: theme.colors.mutedText,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
    maxWidth: 380,
  },
  subtitleCenter: {
    textAlign: 'center',
  },
});
