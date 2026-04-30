import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Svg, { Defs, Pattern, Rect, Circle, Path } from 'react-native-svg';

import { theme } from '../theme/theme';

// Chinese seal stamp corner badge
// Used for marking saved/completed states with traditional seal aesthetic
export function SealStamp({
  label = '印',
  size = 36,
  variant = 'default', // 'default', 'success', 'outline'
  style,
}) {
  const isOutline = variant === 'outline';
  const isSuccess = variant === 'success';

  const bgColor = isOutline
    ? 'transparent'
    : isSuccess
    ? theme.colors.success
    : theme.colors.primary;

  const textColor = isOutline
    ? theme.colors.primary
    : '#FFFFFF';

  const borderColor = isOutline
    ? theme.colors.primary
    : bgColor;

  return (
    <View style={[styles.sealStamp, { width: size, height: size }, style]}>
      <View
        style={[
          styles.sealInner,
          {
            backgroundColor: bgColor,
            borderColor: borderColor,
            borderWidth: isOutline ? 1.5 : 0,
          },
        ]}
      >
        <Text style={[styles.sealText, { color: textColor, fontSize: size * 0.4 }]}>
          {label}
        </Text>
      </View>
    </View>
  );
}

// Ink wash gradient overlay
// Used for subtle Chinese aesthetic backgrounds
export function InkWashGradient({
  intensity = 'light', // 'light', 'medium', 'strong'
  position = 'bottom', // 'top', 'bottom', 'left', 'right', 'center'
  style,
}) {
  const opacity = intensity === 'light' ? 0.04 : intensity === 'medium' ? 0.08 : 0.12;

  const gradientStyle = {
    [position === 'top' ? 'top' : position === 'left' ? 'left' : position === 'right' ? 'right' : 'bottom']: 0,
  };

  return (
    <View pointerEvents="none" style={[styles.inkWashGradient, style]}>
      <View style={[styles.inkWashLayer, { opacity }]} />
    </View>
  );
}

// Chinese pattern border
// Subtle traditional pattern for card borders
export function ChineseBorder({
  children,
  variant = 'wave', // 'wave', 'cloud', 'seal'
  style,
}) {
  return (
    <View style={[styles.chineseBorder, style]}>
      {variant === 'wave' && (
        <View style={styles.borderPattern}>
          <Svg width="100%" height="4" preserveAspectRatio="none">
            <Defs>
              <Pattern id="wave" x="0" y="0" width="20" height="4" patternUnits="userSpaceOnUse">
                <Path
                  d="M0 2 Q5 0 10 2 T20 2"
                  stroke={theme.colors.primary}
                  strokeOpacity={0.15}
                  strokeWidth="1"
                  fill="none"
                />
              </Pattern>
            </Defs>
            <Rect x="0" y="0" width="100%" height="4" fill="url(#wave)" />
          </Svg>
        </View>
      )}
      {children}
    </View>
  );
}

// Decorative corner ornament
// Small Chinese-style corner decorations
export function CornerOrnament({
  position = 'topRight', // 'topLeft', 'topRight', 'bottomLeft', 'bottomRight'
  size = 24,
  style,
}) {
  const positionStyle = {
    top: position.includes('top') ? 0 : undefined,
    bottom: position.includes('bottom') ? 0 : undefined,
    left: position.includes('Left') ? 0 : undefined,
    right: position.includes('Right') ? 0 : undefined,
  };

  const rotation = position.includes('Right')
    ? position.includes('top') ? '90deg' : '180deg'
    : position.includes('bottom') ? '270deg' : '0deg';

  return (
    <View style={[styles.cornerOrnament, { width: size, height: size }, positionStyle, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
          d="M2 2 L2 8 M2 2 L8 2"
          stroke={theme.colors.primary}
          strokeOpacity={0.2}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

// Chinese title decoration
// Decorative lines around Chinese titles
export function TitleDecoration({
  children,
  showLines = true,
  style,
}) {
  return (
    <View style={[styles.titleDecoration, style]}>
      {showLines && <View style={styles.titleLine} />}
      <View style={styles.titleContent}>{children}</View>
      {showLines && <View style={styles.titleLine} />}
    </View>
  );
}

const styles = StyleSheet.create({
  sealStamp: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sealInner: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-3deg' }],
  },
  sealText: {
    fontWeight: '700',
    letterSpacing: 0,
  },

  inkWashGradient: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  inkWashLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.text,
  },

  chineseBorder: {
    position: 'relative',
  },
  borderPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },

  cornerOrnament: {
    position: 'absolute',
  },

  titleDecoration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  titleLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: theme.colors.border,
  },
  titleContent: {
    flex: 0,
  },
});
