import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, Pattern, Rect, Circle, Path } from 'react-native-svg';

import { theme } from '../theme/theme';

// Traditional Chinese seal (印章) texture
// Features concentric rings and abstract seal script strokes
export function SealTexture({ style, opacity = 0.06, variant = 'default' }) {
  const red = theme.colors.primary;

  // Simplified variant for subtle backgrounds
  if (variant === 'minimal') {
    return (
      <View pointerEvents="none" style={[styles.container, style]}>
        <Svg width="100%" height="100%" preserveAspectRatio="none">
          <Defs>
            <Pattern id="sealMinimal" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <Circle cx="50" cy="50" r="30" stroke={red} strokeOpacity={opacity * 0.5} strokeWidth="1" fill="none" />
            </Pattern>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#sealMinimal)" />
        </Svg>
      </View>
    );
  }

  return (
    <View pointerEvents="none" style={[styles.container, style]}>
      <Svg width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <Pattern id="seal" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            <Rect x="0" y="0" width="200" height="200" fill="transparent" />

            {/* Outer stamp ring - represents the physical seal edge */}
            <Circle cx="100" cy="100" r="72" stroke={red} strokeOpacity={opacity} strokeWidth="2.5" fill="none" />
            <Circle cx="100" cy="100" r="58" stroke={red} strokeOpacity={opacity * 0.8} strokeWidth="1.5" fill="none" />
            <Circle cx="100" cy="100" r="44" stroke={red} strokeOpacity={opacity * 0.5} strokeWidth="1" fill="none" />

            {/* Abstract seal script strokes (篆书风格) */}
            {/* Horizontal strokes */}
            <Path
              d="M60 72 L140 72"
              stroke={red}
              strokeOpacity={opacity * 0.85}
              strokeWidth="6"
              strokeLinecap="square"
            />
            <Path
              d="M75 88 L125 88"
              stroke={red}
              strokeOpacity={opacity * 0.75}
              strokeWidth="4"
              strokeLinecap="square"
            />
            <Path
              d="M68 104 L132 104"
              stroke={red}
              strokeOpacity={opacity * 0.8}
              strokeWidth="5"
              strokeLinecap="square"
            />
            <Path
              d="M80 120 L120 120"
              stroke={red}
              strokeOpacity={opacity * 0.65}
              strokeWidth="4"
              strokeLinecap="square"
            />

            {/* Vertical strokes */}
            <Path
              d="M78 128 L78 66"
              stroke={red}
              strokeOpacity={opacity * 0.7}
              strokeWidth="4"
              strokeLinecap="square"
            />
            <Path
              d="M122 128 L122 66"
              stroke={red}
              strokeOpacity={opacity * 0.7}
              strokeWidth="4"
              strokeLinecap="square"
            />

            {/* Bottom stroke */}
            <Path
              d="M88 128 L112 128"
              stroke={red}
              strokeOpacity={opacity * 0.55}
              strokeWidth="5"
              strokeLinecap="square"
            />
          </Pattern>
        </Defs>

        <Rect x="0" y="0" width="100%" height="100%" fill="url(#seal)" />
      </Svg>
    </View>
  );
}

// Small seal stamp for inline use
export function MiniSeal({ size = 40, style }) {
  const red = theme.colors.primary;

  return (
    <View style={[styles.miniSeal, { width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 40 40">
        {/* Outer ring */}
        <Circle cx="20" cy="20" r="16" stroke={red} strokeOpacity={0.9} strokeWidth="1.5" fill="none" />
        <Circle cx="20" cy="20" r="12" stroke={red} strokeOpacity={0.6} strokeWidth="1" fill="none" />

        {/* Simple seal character approximation */}
        <Path
          d="M14 14 L26 14 M16 20 L24 20 M14 26 L26 26"
          stroke={red}
          strokeOpacity={0.85}
          strokeWidth="2"
          strokeLinecap="square"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  miniSeal: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

