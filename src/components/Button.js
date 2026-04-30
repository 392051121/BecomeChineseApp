import React from 'react';
import { Pressable, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

const variants = {
  primary: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    textColor: '#FFFFFF',
  },
  secondary: {
    backgroundColor: theme.colors.cinnabarGlow,
    borderColor: theme.colors.borderAccent,
    textColor: theme.colors.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: theme.colors.border,
    textColor: theme.colors.text,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    textColor: theme.colors.primary,
  },
};

const sizes = {
  small: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 13,
    borderRadius: theme.radii.sm,
    iconSize: 14,
    gap: 6,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    fontSize: 14,
    borderRadius: theme.radii.md,
    iconSize: 16,
    gap: 8,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    fontSize: 15,
    borderRadius: theme.radii.lg,
    iconSize: 18,
    gap: 10,
  },
};

export function Button({
  variant = 'primary',
  size = 'medium',
  title,
  onPress,
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  showArrow = false,
  fullWidth = false,
  pill = false,
  style,
  textStyle,
  children,
}) {
  const { colors } = useTheme();
  const variantConfig = variants[variant];
  const sizeConfig = sizes[size];

  function handlePress() {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress?.();
  }

  const isDisabled = disabled || loading;
  const opacity = isDisabled ? 0.5 : 1;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: variantConfig.backgroundColor,
          borderColor: variantConfig.borderColor,
          paddingVertical: sizeConfig.paddingVertical,
          paddingHorizontal: sizeConfig.paddingHorizontal,
          borderRadius: pill ? 999 : sizeConfig.borderRadius,
          opacity: pressed && !isDisabled ? 0.9 : opacity,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
      onPress={handlePress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={disabled ? 'Button is disabled' : undefined}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variantConfig.textColor}
        />
      ) : (
        <View style={[styles.content, { gap: sizeConfig.gap }]}>
          {Icon && iconPosition === 'left' && (
            <Icon
              size={sizeConfig.iconSize}
              color={variantConfig.textColor}
              strokeWidth={2}
            />
          )}
          {(title || children) && (
            <Text
              style={[
                styles.text,
                {
                  color: variantConfig.textColor,
                  fontSize: sizeConfig.fontSize,
                },
                textStyle,
              ]}
            >
              {title || children}
            </Text>
          )}
          {Icon && iconPosition === 'right' && (
            <Icon
              size={sizeConfig.iconSize}
              color={variantConfig.textColor}
              strokeWidth={2}
            />
          )}
          {showArrow && (
            <ArrowRight
              size={sizeConfig.iconSize}
              color={variantConfig.textColor}
              strokeWidth={2}
            />
          )}
        </View>
      )}
    </Pressable>
  );
}

export function PrimaryButton(props) {
  return <Button variant="primary" {...props} />;
}

export function SecondaryButton(props) {
  return <Button variant="secondary" {...props} />;
}

export function OutlineButton(props) {
  return <Button variant="outline" {...props} />;
}

export function GhostButton(props) {
  return <Button variant="ghost" {...props} />;
}

export function PillButton(props) {
  return <Button pill {...props} />;
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    minHeight: 44,
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
