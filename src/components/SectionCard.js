import React from 'react';
import { StyleSheet, View } from 'react-native';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

export function SectionCard({ children, style, tone = 'default', accessible = true, accessibilityLabel }) {
  const { colors } = useTheme();

  const toneStyles = {
    default: {
      backgroundColor: colors.card,
      borderColor: colors.border,
    },
    soft: {
      backgroundColor: colors.softCard,
      borderColor: colors.borderAccent,
    },
    panel: {
      backgroundColor: colors.panel,
      borderColor: colors.border,
    },
    elevated: {
      backgroundColor: colors.card,
      borderColor: colors.borderAccent,
    },
  };

  return (
    <View
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.card,
        toneStyles[tone],
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radii.lg,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    ...theme.shadows.subtle,
  },
  soft: {
    backgroundColor: theme.colors.softCard,
    borderColor: theme.colors.borderAccent,
  },
  panel: {
    backgroundColor: theme.colors.panel,
  },
  elevated: {
    ...theme.shadows.strong,
    borderColor: theme.colors.borderAccent,
  },
});
