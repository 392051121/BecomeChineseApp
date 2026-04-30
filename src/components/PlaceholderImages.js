/**
 * Placeholder Images
 *
 * Provides placeholder illustrations for items without images.
 * These are simple styled views that work as visual placeholders.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin, UtensilsCrossed, Scroll, Landmark, Mountain, Building, Crown } from 'lucide-react-native';

import { theme } from '../theme/theme';

export function CityPlaceholder({ nameCn, province, size = 'md' }) {
  const sizeStyles = {
    sm: { width: 60, height: 60, iconSize: 24 },
    md: { width: 100, height: 100, iconSize: 36 },
    lg: { width: 160, height: 160, iconSize: 48 },
  };
  const s = sizeStyles[size];

  return (
    <View style={[styles.placeholder, { width: s.width, height: s.height }]}>
      <View style={styles.placeholderBg}>
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
      </View>
      <Building size={s.iconSize} color={theme.colors.primary} strokeWidth={1.5} opacity={0.6} />
      {size !== 'sm' && (
        <View style={styles.labelWrap}>
          <Text style={styles.labelText}>{nameCn}</Text>
          <Text style={styles.subLabelText}>{province}</Text>
        </View>
      )}
    </View>
  );
}

export function RecipePlaceholder({ nameCn, province, size = 'md' }) {
  const sizeStyles = {
    sm: { width: 60, height: 60, iconSize: 24 },
    md: { width: 100, height: 100, iconSize: 36 },
    lg: { width: 160, height: 160, iconSize: 48 },
  };
  const s = sizeStyles[size];

  return (
    <View style={[styles.placeholder, styles.foodPlaceholder, { width: s.width, height: s.height }]}>
      <View style={styles.placeholderBg}>
        <View style={[styles.decorativeCircle1, { backgroundColor: 'rgba(226, 176, 94, 0.15)' }]} />
        <View style={[styles.decorativeCircle2, { backgroundColor: 'rgba(226, 176, 94, 0.1)' }]} />
      </View>
      <UtensilsCrossed size={s.iconSize} color="#E2B05E" strokeWidth={1.5} opacity={0.7} />
      {size !== 'sm' && (
        <View style={styles.labelWrap}>
          <Text style={[styles.labelText, { color: '#E2B05E' }]}>{nameCn}</Text>
          <Text style={styles.subLabelText}>{province}</Text>
        </View>
      )}
    </View>
  );
}

export function DynastyPlaceholder({ nameCn, period, size = 'md' }) {
  const sizeStyles = {
    sm: { width: 60, height: 60, iconSize: 24 },
    md: { width: 100, height: 100, iconSize: 36 },
    lg: { width: 160, height: 160, iconSize: 48 },
  };
  const s = sizeStyles[size];

  return (
    <View style={[styles.placeholder, styles.historyPlaceholder, { width: s.width, height: s.height }]}>
      <View style={styles.placeholderBg}>
        <View style={[styles.decorativeCircle1, { backgroundColor: 'rgba(179, 59, 36, 0.15)' }]} />
        <View style={[styles.decorativeCircle2, { backgroundColor: 'rgba(179, 59, 36, 0.1)' }]} />
      </View>
      <Crown size={s.iconSize} color="#B33B24" strokeWidth={1.5} opacity={0.7} />
      {size !== 'sm' && (
        <View style={styles.labelWrap}>
          <Text style={[styles.labelText, { color: '#B33B24' }]}>{nameCn}</Text>
          <Text style={styles.subLabelText}>{period}</Text>
        </View>
      )}
    </View>
  );
}

export function ProvincePlaceholder({ provinceId, size = 'md' }) {
  const sizeStyles = {
    sm: { width: 40, height: 40, iconSize: 16 },
    md: { width: 60, height: 60, iconSize: 24 },
    lg: { width: 80, height: 80, iconSize: 32 },
  };
  const s = sizeStyles[size];

  return (
    <View style={[styles.provincePlaceholder, { width: s.width, height: s.height }]}>
      <MapPin size={s.iconSize} color={theme.colors.primary} strokeWidth={1.5} opacity={0.6} />
      <Text style={styles.provinceLabel}>{provinceId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.cinnabarGlow,
  },
  placeholderBg: {
    ...StyleSheet.absoluteFillObject,
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(179, 59, 36, 0.1)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -15,
    left: -15,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(179, 59, 36, 0.08)',
  },
  labelWrap: {
    position: 'absolute',
    bottom: 8,
    alignItems: 'center',
  },
  labelText: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  subLabelText: {
    color: theme.colors.mutedText,
    fontSize: 9,
    marginTop: 1,
  },
  foodPlaceholder: {
    backgroundColor: 'rgba(226, 176, 94, 0.12)',
  },
  historyPlaceholder: {
    backgroundColor: 'rgba(179, 59, 36, 0.1)',
  },
  provincePlaceholder: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
  },
  provinceLabel: {
    marginTop: 4,
    color: theme.colors.mutedText,
    fontSize: 8,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
