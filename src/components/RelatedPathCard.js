import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

export function RelatedPathCard({ label, title, hint = 'Open', onPress, style }) {
  const { colors } = useTheme();
  const Container = onPress ? Pressable : View;

  const content = (
    <>
      <View style={styles.topRow}>
        <Text style={[styles.label, { color: colors.primary }]}>{label}</Text>
        <Text style={[styles.hint, { color: colors.mutedText }]}>{hint}</Text>
      </View>
      <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
        {title}
      </Text>
    </>
  );

  if (!onPress) {
    return <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.surface }, style]}>{content}</View>;
  }

  return (
    <Container
      style={({ pressed }) => [styles.card, { borderColor: colors.border, backgroundColor: colors.surface }, pressed ? styles.pressed : null, style]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${title}`}
      accessibilityHint="Double tap to explore"
    >
      {content}
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: theme.motion.tapScale }],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 4,
  },
  label: {
    color: theme.colors.primary,
    fontSize: 10,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  hint: {
    color: theme.colors.mutedText,
    fontSize: 10,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  title: {
    color: theme.colors.text,
    fontSize: 13,
    lineHeight: 19.2,
  },
});
