import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Sparkles } from 'lucide-react-native';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

export function EmptyStateCard({
  title,
  description,
  titleCn,
  icon: Icon,
  action,
  onAction,
  style,
  centered = false,
}) {
  const { colors } = useTheme();
  const IconComponent = Icon || Sparkles;

  return (
    <View
      style={[
        styles.card,
        {
          borderColor: colors.border,
          backgroundColor: colors.softCard,
        },
        centered && styles.centered,
        style,
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: colors.cinnabarGlow }]}>
        <IconComponent size={24} color={colors.primary} strokeWidth={1.5} />
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {titleCn && <Text style={[styles.titleCn, { color: colors.primary }]}>{titleCn}</Text>}
      <Text style={[styles.description, { color: colors.mutedText }]}>{description}</Text>
      {action && onAction && (
        <Pressable
          style={({ pressed }) => [
            styles.actionBtn,
            { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 },
          ]}
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={action}
        >
          <Text style={styles.actionText}>{action}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    padding: 20,
    alignItems: 'flex-start',
  },
  centered: {
    alignItems: 'center',
    textAlign: 'center',
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  titleCn: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
  },
  actionBtn: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: theme.radii.md,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
