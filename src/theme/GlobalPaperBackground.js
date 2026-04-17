import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

export function GlobalPaperBackground() {
  return (
    <View pointerEvents="none" style={styles.root}>
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1510936111840-65e151ad71bb?auto=format&fit=crop&w=1200&q=60',
        }}
        resizeMode="cover"
        style={styles.texture}
        imageStyle={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  texture: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.03,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

