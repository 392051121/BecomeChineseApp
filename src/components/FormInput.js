import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

export function FormInput({
  value,
  onChangeText,
  placeholder,
  label,
  labelCn,
  error,
  helperText,
  maxLength,
  showCount = false,
  required = false,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
  style,
  inputStyle,
}) {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const charCount = value?.length || 0;
  const hasError = Boolean(error);

  const getBorderColor = () => {
    if (hasError) return theme.colors.error;
    if (isFocused) return colors.primary;
    return colors.border;
  };

  return (
    <View style={style}>
      {(label || labelCn) && (
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: colors.text }]}>
            {label}
            {required && <Text style={{ color: theme.colors.error }}> *</Text>}
          </Text>
          {labelCn && (
            <Text style={[styles.labelCn, { color: colors.primary }]}>{labelCn}</Text>
          )}
        </View>
      )}

      <View
        style={[
          styles.inputWrap,
          {
            borderColor: getBorderColor(),
            backgroundColor: disabled ? colors.surface : colors.background,
          },
          multiline && styles.inputWrapMultiline,
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedText}
          style={[
            styles.input,
            { color: disabled ? colors.mutedText : colors.text },
            multiline && styles.inputMultiline,
            inputStyle,
          ]}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={maxLength}
        />
      </View>

      {(error || helperText || (showCount && maxLength > 0)) && (
        <View style={styles.footerRow}>
          <Text
            style={[
              styles.footerText,
              { color: hasError ? theme.colors.error : colors.mutedText },
            ]}
          >
            {error || helperText || ' '}
          </Text>
          {showCount && maxLength > 0 && (
            <Text style={[styles.countText, { color: colors.mutedText }]}>
              {charCount}/{maxLength}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  labelCn: {
    fontSize: 12,
    fontWeight: '500',
  },
  inputWrap: {
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    paddingHorizontal: 14,
    minHeight: 48,
    justifyContent: 'center',
  },
  inputWrapMultiline: {
    minHeight: 100,
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  input: {
    fontSize: 15,
    fontWeight: '500',
    paddingVertical: 0,
  },
  inputMultiline: {
    textAlignVertical: 'top',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  footerText: {
    fontSize: 12,
    flex: 1,
  },
  countText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
