import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { G, Path, Rect, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import { geoMercator, geoPath } from 'd3-geo';

import { theme } from '../theme/theme';
import chinaGeo from '../data/chinaGeo.json';

// SVG viewport dimensions
const VIEWBOX_WIDTH = 600;
const VIEWBOX_HEIGHT = 700;

// China center coordinates
const CHINA_CENTER = [105, 35];

// Calculate projection
function createProjection() {
  return geoMercator()
    .center(CHINA_CENTER)
    .scale(600)
    .translate([VIEWBOX_WIDTH / 2, VIEWBOX_HEIGHT / 2]);
}

// Convert GeoJSON to SVG path
function geoToSvgPath(feature, projection) {
  const pathGenerator = geoPath().projection(projection);
  return pathGenerator(feature);
}

// Get centroid for label positioning
function getCentroid(feature, projection) {
  const coords = feature.geometry.coordinates[0];
  if (!coords || coords.length === 0) return null;

  let sumX = 0, sumY = 0;
  coords.forEach(([lng, lat]) => {
    const projected = projection([lng, lat]);
    if (projected) {
      sumX += projected[0];
      sumY += projected[1];
    }
  });

  return {
    x: sumX / coords.length,
    y: sumY / coords.length
  };
}

export function ChinaConnectionMap({ connectedProvinces = new Set() }) {
  const projection = useMemo(() => createProjection(), []);

  const provinces = useMemo(() => {
    return chinaGeo.features.map((feature) => {
      const id = feature.properties.id;
      const path = geoToSvgPath(feature, projection);
      const centroid = getCentroid(feature, projection);

      return {
        id,
        name: feature.properties.name,
        nameEn: feature.properties.nameEn,
        path,
        centroid,
        active: connectedProvinces.has(id),
      };
    });
  }, [projection, connectedProvinces]);

  return (
    <View style={styles.wrap} accessible={true} accessibilityLabel="China provincial map" accessibilityRole="image" accessibilityHint={`Shows ${provinces.filter(p => p.active).length} of ${provinces.length} provinces connected`}>
      <Svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <Defs>
          <LinearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={theme.colors.mapGradientStart} />
            <Stop offset="100%" stopColor={theme.colors.primaryDark} />
          </LinearGradient>
          <LinearGradient id="inactiveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={theme.colors.backgroundLight} />
            <Stop offset="100%" stopColor={theme.colors.backgroundDark} />
          </LinearGradient>
          <LinearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={theme.colors.surface} />
            <Stop offset="100%" stopColor={theme.colors.background} />
          </LinearGradient>
        </Defs>

        {/* Ocean background */}
        <Rect
          x="0"
          y="0"
          width={VIEWBOX_WIDTH}
          height={VIEWBOX_HEIGHT}
          fill="url(#oceanGradient)"
        />

        {/* China landmass shadow */}
        <G transform="translate(2, 2)">
          {provinces.map((province) => (
            <Path
              key={`shadow-${province.id}`}
              d={province.path}
              fill="rgba(0, 0, 0, 0.05)"
            />
          ))}
        </G>

        {/* Province shapes */}
        <G>
          {provinces.map((province) => (
            <G key={province.id}>
              {/* Main province shape */}
              <Path
                key={`main-${province.id}`}
                d={province.path}
                fill={province.active ? 'url(#activeGradient)' : 'url(#inactiveGradient)'}
                fillOpacity={province.active ? 1 : 0.9}
                stroke={province.active ? theme.colors.primary : 'rgba(51, 51, 51, 0.2)'}
                strokeWidth={province.active ? 1.5 : 0.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Highlight for active provinces */}
              {province.active && (
                <Path
                  key={`highlight-${province.id}`}
                  d={province.path}
                  fill="transparent"
                  stroke="rgba(255, 255, 255, 0.35)"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Province label */}
              {province.centroid && (
                <SvgText
                  key={`label-${province.id}`}
                  x={province.centroid.x}
                  y={province.centroid.y}
                  fontSize={province.active ? 10 : 8}
                  fontWeight="700"
                  fill={province.active ? '#FFFFFF' : 'rgba(51, 51, 51, 0.7)'}
                  textAnchor="middle"
                >
                  {province.name}
                </SvgText>
              )}
            </G>
          ))}
        </G>

        {/* South China Sea inset */}
        <G transform="translate(480, 550)">
          <Rect
            x="0"
            y="0"
            width="100"
            height="90"
            rx="4"
            fill="rgba(253, 251, 247, 0.9)"
            stroke="rgba(51, 51, 51, 0.25)"
            strokeWidth="0.8"
          />
          {/* Hainan in inset */}
          <Path
            d="M45 55 L55 52 L62 60 L58 72 L48 75 L40 68 Z"
            fill={connectedProvinces.has('Hainan') ? 'url(#activeGradient)' : 'url(#inactiveGradient)'}
            stroke="rgba(51, 51, 51, 0.2)"
            strokeWidth="0.5"
          />
          {/* Taiwan in inset */}
          <Path
            d="M75 35 L85 32 L90 45 L85 58 L75 55 L72 45 Z"
            fill={connectedProvinces.has('Taiwan') ? 'url(#activeGradient)' : 'url(#inactiveGradient)'}
            stroke="rgba(51, 51, 51, 0.2)"
            strokeWidth="0.5"
          />
          <SvgText x="50" y="85" fontSize="7" fill="rgba(51, 51, 51, 0.6)" textAnchor="middle">
            南海诸岛
          </SvgText>
        </G>

        {/* Compass */}
        <G transform="translate(35, 45)">
          <Path
            d="M12 0 L15 12 L12 9 L9 12 Z"
            fill="rgba(51, 51, 51, 0.5)"
          />
          <Path
            d="M12 24 L9 12 L12 15 L15 12 Z"
            fill="rgba(51, 51, 51, 0.25)"
          />
          <SvgText x="12" y="-5" fontSize="8" fill="rgba(51, 51, 51, 0.6)" textAnchor="middle">N</SvgText>
        </G>
      </Svg>

      {/* Caption */}
      <View pointerEvents="none" style={styles.caption}>
        <Text style={styles.captionText}>China Provincial Atlas</Text>
      </View>

      {/* Legend */}
      <View pointerEvents="none" style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendDotActive]} />
          <Text style={styles.legendText}>Connected</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.legendDot} />
          <Text style={styles.legendText}>Unexplored</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    aspectRatio: VIEWBOX_WIDTH / VIEWBOX_HEIGHT,
    backgroundColor: '#FBF7F1',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  caption: {
    position: 'absolute',
    left: 10,
    bottom: 8,
    backgroundColor: 'rgba(253, 251, 247, 0.9)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  captionText: {
    color: theme.colors.mutedText,
    fontSize: 9,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  legend: {
    position: 'absolute',
    right: 10,
    bottom: 8,
    flexDirection: 'row',
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E8E0D5',
    borderWidth: 0.5,
    borderColor: 'rgba(51, 51, 51, 0.2)',
  },
  legendDotActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  legendText: {
    color: theme.colors.mutedText,
    fontSize: 8,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
