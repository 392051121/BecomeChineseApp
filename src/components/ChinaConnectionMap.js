import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { G, Path, Rect, Text as SvgText } from 'react-native-svg';
import { geoMercator, geoPath } from 'd3-geo';

import { theme } from '../theme/theme';
import chinaGeo from '../data/chinaGeo.json';
import { normalizeProvinceId } from '../utils/provinceIds';

// SVG viewport dimensions
const VIEWBOX_WIDTH = 600;
const VIEWBOX_HEIGHT = 700;

// China center coordinates
const CHINA_CENTER = [105, 35];

function createProjection() {
  return geoMercator()
    .center(CHINA_CENTER)
    .scale(600)
    .translate([VIEWBOX_WIDTH / 2, VIEWBOX_HEIGHT / 2]);
}

function getCentroid(feature, projection) {
  try {
    const pathGenerator = geoPath().projection(projection);
    const [x, y] = pathGenerator.centroid(feature);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
    return { x, y };
  } catch {
    const coords = feature?.geometry?.coordinates?.[0];
    if (!coords || coords.length === 0) return null;
    let sumX = 0;
    let sumY = 0;
    let n = 0;
    coords.forEach(([lng, lat]) => {
      const projected = projection([lng, lat]);
      if (projected) {
        sumX += projected[0];
        sumY += projected[1];
        n += 1;
      }
    });
    if (!n) return null;
    return { x: sumX / n, y: sumY / n };
  }
}

// Precompute paths once (features are static)
const BASE_PROJECTION = createProjection();
const PATH_GEN = geoPath().projection(BASE_PROJECTION);
const PRECOMPUTED_PROVINCES = chinaGeo.features.map((feature) => {
  const path = PATH_GEN(feature) || '';
  const centroid = getCentroid(feature, BASE_PROJECTION);
  return {
    id: feature.properties.id,
    name: feature.properties.name,
    nameEn: feature.properties.nameEn,
    path,
    centroid,
  };
});

function toActiveSet(connectedProvinces) {
  const raw = (() => {
    if (connectedProvinces instanceof Set) return [...connectedProvinces];
    if (Array.isArray(connectedProvinces)) return connectedProvinces;
    if (connectedProvinces && typeof connectedProvinces === 'object') {
      // Accept both { Province: true } maps and plain Set-like objects
      return Object.keys(connectedProvinces);
    }
    return [];
  })();

  const set = new Set();
  raw.forEach((id) => {
    // Only accept canonical chinaGeo ids — never keep raw display strings.
    const normalized = normalizeProvinceId(id);
    if (normalized) set.add(normalized);
  });
  return set;
}

export function ChinaConnectionMap({
  connectedProvinces = new Set(),
  legendActiveLabel = 'Connected',
  legendInactiveLabel = 'Unexplored',
  showLabels = true,
}) {
  const activeIds = useMemo(() => toActiveSet(connectedProvinces), [connectedProvinces]);

  const provinces = useMemo(() => {
    return PRECOMPUTED_PROVINCES.map((province) => ({
      ...province,
      active: activeIds.has(province.id),
    }));
  }, [activeIds]);

  // Measure layout width so SVG has real pixel height (avoids blank maps from height:100%).
  const [layoutWidth, setLayoutWidth] = useState(0);
  const measuredWidth = layoutWidth > 0 ? layoutWidth : 320;
  const svgHeight = Math.round((measuredWidth * VIEWBOX_HEIGHT) / VIEWBOX_WIDTH);
  const activeCount = provinces.filter((p) => p.active).length;

  return (
    <View
      style={styles.wrap}
      onLayout={(e) => {
        const w = e?.nativeEvent?.layout?.width ?? 0;
        if (w > 0 && Math.abs(w - layoutWidth) > 0.5) setLayoutWidth(w);
      }}
      accessible
      accessibilityLabel="China provincial map"
      accessibilityRole="image"
      accessibilityHint={`Shows ${activeCount} of ${provinces.length} provinces highlighted`}
    >
      <Svg
        width={measuredWidth}
        height={svgHeight}
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Ocean / paper background */}
        <Rect
          x="0"
          y="0"
          width={VIEWBOX_WIDTH}
          height={VIEWBOX_HEIGHT}
          fill={theme.colors.surface}
        />

        {/* China landmass shadow — filter first so every child has a stable key */}
        <G transform="translate(2, 2)">
          {provinces
            .filter((province) => !!province.path)
            .map((province) => (
              <Path
                key={`shadow-${province.id}`}
                d={province.path}
                fill="rgba(0, 0, 0, 0.05)"
              />
            ))}
        </G>

        {/* Province shapes — filter null paths so list children always carry keys */}
        <G>
          {provinces
            .filter((province) => !!province.path)
            .map((province) => (
              <G key={province.id}>
                <Path
                  d={province.path}
                  fill={province.active ? theme.colors.primary : theme.colors.backgroundDark}
                  stroke={province.active ? theme.colors.primaryDark : 'rgba(51, 51, 51, 0.25)'}
                  strokeWidth={province.active ? 1.5 : 0.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {province.active ? (
                  <Path
                    d={province.path}
                    fill="transparent"
                    stroke="rgba(255, 255, 255, 0.35)"
                    strokeWidth={1}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : null}

                {showLabels && province.centroid ? (
                  <SvgText
                    x={province.centroid.x}
                    y={province.centroid.y + 3}
                    fontSize={province.active ? 10 : 8}
                    fontWeight={province.active ? '700' : '400'}
                    fill={province.active ? '#FFFFFF' : 'rgba(51, 51, 51, 0.65)'}
                    textAnchor="middle"
                  >
                    {province.name}
                  </SvgText>
                ) : null}
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
          <Path
            d="M45 55 L55 52 L62 60 L58 72 L48 75 L40 68 Z"
            fill={activeIds.has('Hainan') ? theme.colors.primary : theme.colors.backgroundDark}
            stroke="rgba(51, 51, 51, 0.2)"
            strokeWidth="0.5"
          />
          <Path
            d="M75 35 L85 32 L90 45 L85 58 L75 55 L72 45 Z"
            fill={activeIds.has('Taiwan') ? theme.colors.primary : theme.colors.backgroundDark}
            stroke="rgba(51, 51, 51, 0.2)"
            strokeWidth="0.5"
          />
          <SvgText
            x="50"
            y="85"
            fontSize="7"
            fill="rgba(51, 51, 51, 0.6)"
            textAnchor="middle"
          >
            南海诸岛
          </SvgText>
        </G>

        {/* Compass */}
        <G transform="translate(35, 45)">
          <Path d="M12 0 L15 12 L12 9 L9 12 Z" fill="rgba(51, 51, 51, 0.5)" />
          <Path d="M12 24 L9 12 L12 15 L15 12 Z" fill="rgba(51, 51, 51, 0.25)" />
          <SvgText x="12" y="-5" fontSize="8" fill="rgba(51, 51, 51, 0.6)" textAnchor="middle">
            N
          </SvgText>
        </G>
      </Svg>

      {/* Caption */}
      <View pointerEvents="none" style={styles.caption}>
        <Text style={styles.captionText}>China Provincial Atlas · {activeCount} lit</Text>
      </View>

      {/* Legend */}
      <View pointerEvents="none" style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendDotActive]} />
          <Text style={styles.legendText}>{legendActiveLabel}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.legendDot} />
          <Text style={styles.legendText}>{legendInactiveLabel}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    aspectRatio: VIEWBOX_WIDTH / VIEWBOX_HEIGHT,
    minHeight: 280,
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
