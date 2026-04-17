import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, Pattern, Rect, Line } from 'react-native-svg';

// Subtle "xuan paper" feel: ultra-light fiber lines + grain.
export function PaperTexture({ style }) {
  return (
    <View pointerEvents="none" style={[styles.container, style]}>
      <Svg width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <Pattern
            id="fibers"
            x="0"
            y="0"
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <Line x1="2" y1="0" x2="2" y2="28" stroke="#333333" strokeOpacity="0.03" strokeWidth="0.5" />
            <Line x1="10" y1="0" x2="10" y2="28" stroke="#333333" strokeOpacity="0.02" strokeWidth="0.5" />
            <Line x1="18" y1="0" x2="18" y2="28" stroke="#333333" strokeOpacity="0.015" strokeWidth="0.5" />
            <Line x1="0" y1="6" x2="28" y2="6" stroke="#333333" strokeOpacity="0.02" strokeWidth="0.5" />
            <Line x1="0" y1="17" x2="28" y2="17" stroke="#333333" strokeOpacity="0.015" strokeWidth="0.5" />
          </Pattern>
        </Defs>

        <Rect x="0" y="0" width="100%" height="100%" fill="url(#fibers)" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});

