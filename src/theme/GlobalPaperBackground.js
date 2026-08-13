import React from 'react';
import { StyleSheet, View } from 'react-native';

import { PaperTexture } from '../components/PaperTexture';
import { useTheme } from './ThemeContext';

export function GlobalPaperBackground() {
  const { colors } = useTheme();

  return (
    <View pointerEvents="none" style={styles.root}>
      <View style={[styles.base, { backgroundColor: colors.background }]} />
      <View style={styles.warmGlow} />
      <PaperTexture style={styles.texture} />
      <View style={styles.veil} />
      <View style={styles.inkWash} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  base: {
    ...StyleSheet.absoluteFillObject,
  },
  warmGlow: {
    position: 'absolute',
    left: -60,
    top: -30,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: 'rgba(184, 59, 36, 0.028)',
    opacity: 0.45,
  },
  texture: {
    opacity: 0.012,
  },
  veil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 249, 242, 0.028)',
  },
  inkWash: {
    position: 'absolute',
    right: -70,
    bottom: -90,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: 'rgba(35, 31, 32, 0.014)',
    opacity: 0.52,
  },
});

