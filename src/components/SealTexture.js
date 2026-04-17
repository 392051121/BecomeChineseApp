import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, Pattern, Rect, Circle, Path } from 'react-native-svg';

import { theme } from '../theme/theme';

export function SealTexture({ style, opacity = 0.06 }) {
  const red = theme.colors.primary;
  return (
    <View pointerEvents="none" style={[styles.container, style]}>
      <Svg width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <Pattern id="seal" x="0" y="0" width="220" height="220" patternUnits="userSpaceOnUse">
            <Rect x="0" y="0" width="220" height="220" fill="transparent" />

            {/* Outer stamp ring */}
            <Circle cx="110" cy="110" r="78" stroke={red} strokeOpacity={opacity} strokeWidth="2" fill="none" />
            <Circle cx="110" cy="110" r="64" stroke={red} strokeOpacity={opacity * 0.85} strokeWidth="1.2" fill="none" />

            {/* Rough "seal script" strokes (abstract, not real characters) */}
            <Path
              d="M70 82 L150 82 M86 98 L134 98 M78 114 L142 114 M92 130 L128 130"
              stroke={red}
              strokeOpacity={opacity * 0.9}
              strokeWidth="5"
              strokeLinecap="square"
            />
            <Path
              d="M84 152 L84 66 M136 152 L136 66"
              stroke={red}
              strokeOpacity={opacity * 0.75}
              strokeWidth="3.5"
              strokeLinecap="square"
            />
            <Path
              d="M96 152 L124 152"
              stroke={red}
              strokeOpacity={opacity * 0.6}
              strokeWidth="4"
              strokeLinecap="square"
            />
          </Pattern>
        </Defs>

        <Rect x="0" y="0" width="100%" height="100%" fill="url(#seal)" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});

