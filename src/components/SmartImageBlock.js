import React, { useEffect, useMemo, useState } from 'react';
import { Animated, Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { Building, UtensilsCrossed, Crown, MapPin } from 'lucide-react-native';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

export function SmartImageBlock({
  source,
  uri,
  label,
  style,
  overlayOpacity = 0.1,
  children,
  placeholderType = 'default', // 'city', 'recipe', 'dynasty', 'default'
  placeholderName,
}) {
  const { colors } = useTheme();
  const [failed, setFailed] = useState(false);
  const [attemptUri, setAttemptUri] = useState(uri);
  const [triedPicsum, setTriedPicsum] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const showFallback = (!source && !attemptUri) || failed;
  const initials = useMemo(() => 'BC', []);
  const fadeAnim = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    setAttemptUri(uri);
    setFailed(false);
    setTriedPicsum(false);
    setLoaded(false);
    fadeAnim.setValue(0);
  }, [uri, source, fadeAnim]);

  useEffect(() => {
    if (loaded) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 240,
        useNativeDriver: true,
      }).start();
    }
  }, [loaded, fadeAnim]);

  function handleImageError() {
    if (source) {
      setFailed(true);
      return;
    }
    if (!attemptUri) {
      setFailed(true);
      return;
    }
    // Web compatibility fallback for source.unsplash featured endpoint.
    if (attemptUri.includes('/featured/?')) {
      setAttemptUri(attemptUri.replace('/featured/?', '/1600x1000/?'));
      return;
    }
    if (!triedPicsum) {
      const seed = encodeURIComponent((label || 'become-chinese').toLowerCase());
      setAttemptUri(`https://picsum.photos/seed/${seed}/1600/1000`);
      setTriedPicsum(true);
      return;
    }
    setFailed(true);
  }

  function getPlaceholderIcon() {
    switch (placeholderType) {
      case 'city': return Building;
      case 'recipe': return UtensilsCrossed;
      case 'dynasty': return Crown;
      default: return MapPin;
    }
  }

  function getPlaceholderColor() {
    switch (placeholderType) {
      case 'city': return '#6B8A94';
      case 'recipe': return '#E2B05E';
      case 'dynasty': return '#B33B24';
      default: return theme.colors.primary;
    }
  }

  if (showFallback) {
    const Icon = getPlaceholderIcon();
    const color = getPlaceholderColor();

    return (
      <View style={[styles.fallback, { backgroundColor: '#E8E8E8', borderColor: colors.border }, style]}>
        <View style={styles.fallbackDecorative}>
          <View style={[styles.fallbackCircle1, { backgroundColor: `${color}15` }]} />
          <View style={[styles.fallbackCircle2, { backgroundColor: `${color}10` }]} />
        </View>
        <Icon size={32} color={color} strokeWidth={1.5} opacity={0.6} />
        {placeholderName && <Text style={[styles.fallbackName, { color }]}>{placeholderName}</Text>}
        {label && <Text style={[styles.fallbackText, { color: colors.mutedText }]}>{label}</Text>}
      </View>
    );
  }

  return (
    <Animated.View style={[style, { opacity: fadeAnim }]}>
      <ImageBackground
        source={source ?? { uri: attemptUri }}
        style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]}
        resizeMode="cover"
        onError={handleImageError}
        onLoadEnd={() => setLoaded(true)}
      >
        <View style={[styles.overlay, { opacity: overlayOpacity }]} />
        {children}
      </ImageBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.imageOverlayRemote,
  },
  fallback: {
    backgroundColor: theme.colors.panel,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: theme.colors.border,
  },
  logoMark: {
    width: 36,
    height: 36,
    tintColor: theme.colors.mutedText,
    opacity: 0.55,
    marginBottom: 6,
  },
  logo: {
    color: theme.colors.mutedText,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 4,
  },
  fallbackText: {
    color: theme.colors.text,
    opacity: 0.68,
    fontSize: 12,
    letterSpacing: 0.3,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  fallbackDecorative: {
    ...StyleSheet.absoluteFillObject,
  },
  fallbackCircle1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  fallbackCircle2: {
    position: 'absolute',
    bottom: -20,
    left: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  fallbackName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
  },
});

