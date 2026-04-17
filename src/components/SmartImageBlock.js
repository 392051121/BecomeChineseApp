import React, { useEffect, useMemo, useState } from 'react';
import { Animated, Image, ImageBackground, StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme/theme';

export function SmartImageBlock({
  source,
  uri,
  label,
  style,
  overlayOpacity = 0.1,
  children,
}) {
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

  if (showFallback) {
    return (
      <View style={[styles.fallback, style]}>
        <Image source={require('../../assets/icon.png')} style={styles.logoMark} />
        <Text style={styles.logo}>{initials}</Text>
        <Text style={styles.fallbackText}>{label}</Text>
      </View>
    );
  }

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <ImageBackground
        source={source ?? { uri: attemptUri }}
        style={style}
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
    backgroundColor: '#333333',
  },
  fallback: {
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: theme.colors.border,
  },
  logoMark: {
    width: 36,
    height: 36,
    tintColor: '#8D8D8D',
    opacity: 0.55,
    marginBottom: 6,
  },
  logo: {
    color: '#6B6B6B',
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
});

