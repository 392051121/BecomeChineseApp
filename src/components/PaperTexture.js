import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, Pattern, Rect, Line, Circle, Path } from 'react-native-svg';

import { colors } from '../theme/colors';

// Traditional "xuan paper" (宣纸) texture
// Ultra-light fiber lines + subtle grain for authentic Chinese paper feel
//
// NOTE: 'idPrefix' must be unique per-instance when more than one PaperTexture can
// be on screen at the same time, otherwise the duplicate SVG pattern ids collide
// under the New Architecture and can stall rendering.
let _idCounter = 0;
function nextId(base) {
  _idCounter += 1;
  return `${base}_${_idCounter}`;
}

export function PaperTexture({ style, intensity = 'normal', idPrefix }) {
  const baseOpacity = intensity === 'light' ? 0.6 : intensity === 'strong' ? 1.2 : 1;
  const uid = idPrefix ? `${idPrefix}_${_idCounter++}` : nextId('fibers');

  return (
    <View pointerEvents="none" style={[styles.container, style]}>
      <Svg width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          {/* Main fiber pattern - vertical strokes like brush marks */}
          <Pattern
            id={`${uid}_fibers`}
            x="0"
            y="0"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            {/* Vertical fibers */}
            <Line x1="4" y1="0" x2="4" y2="32" stroke={colors.text} strokeOpacity={0.025 * baseOpacity} strokeWidth="0.5" />
            <Line x1="12" y1="0" x2="12" y2="32" stroke={colors.text} strokeOpacity={0.018 * baseOpacity} strokeWidth="0.5" />
            <Line x1="20" y1="0" x2="20" y2="32" stroke={colors.text} strokeOpacity={0.022 * baseOpacity} strokeWidth="0.5" />
            <Line x1="28" y1="0" x2="28" y2="32" stroke={colors.text} strokeOpacity={0.015 * baseOpacity} strokeWidth="0.5" />

            {/* Horizontal fibers - lighter, less frequent */}
            <Line x1="0" y1="8" x2="32" y2="8" stroke={colors.text} strokeOpacity={0.012 * baseOpacity} strokeWidth="0.5" />
            <Line x1="0" y1="24" x2="32" y2="24" stroke={colors.text} strokeOpacity={0.010 * baseOpacity} strokeWidth="0.5" />
          </Pattern>

          {/* Subtle grain dots */}
          <Pattern
            id={`${uid}_grain`}
            x="0"
            y="0"
            width="64"
            height="64"
            patternUnits="userSpaceOnUse"
          >
            <Circle cx="12" cy="18" r="1.2" fill={colors.text} fillOpacity={0.035 * baseOpacity} />
            <Circle cx="48" cy="12" r="0.8" fill={colors.text} fillOpacity={0.025 * baseOpacity} />
            <Circle cx="32" cy="40" r="1" fill={colors.text} fillOpacity={0.030 * baseOpacity} />
            <Circle cx="56" cy="52" r="0.9" fill={colors.text} fillOpacity={0.020 * baseOpacity} />
            <Circle cx="8" cy="56" r="1.1" fill={colors.text} fillOpacity={0.028 * baseOpacity} />
          </Pattern>
        </Defs>

        {/* Apply patterns */}
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${uid}_fibers)`} />
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${uid}_grain)`} />
      </Svg>
    </View>
  );
}

// Ink splash texture for dramatic backgrounds
export function InkSplashTexture({ style, opacity = 0.03 }) {
  return (
    <View pointerEvents="none" style={[styles.container, style]}>
      <Svg width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <Pattern id="inkSplash" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            {/* Abstract ink splash shapes */}
            <Circle cx="30" cy="30" r="15" fill={colors.text} fillOpacity={opacity} />
            <Circle cx="90" cy="80" r="20" fill={colors.text} fillOpacity={opacity * 0.7} />
            <Circle cx="60" cy="100" r="8" fill={colors.text} fillOpacity={opacity * 0.5} />
          </Pattern>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#inkSplash)" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});

