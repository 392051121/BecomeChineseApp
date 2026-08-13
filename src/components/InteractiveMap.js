/**
 * Interactive Map Exploration Component
 *
 * Gamified map with province unlock animations and collection progress.
 */

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { G, Path, Rect, Text as SvgText, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import { geoMercator, geoPath } from 'd3-geo';
import { Sparkles, MapPin, Lock, Unlock, Star } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import chinaGeo from '../data/chinaGeo.json';

const VIEWBOX_WIDTH = 600;
const VIEWBOX_HEIGHT = 700;
const CHINA_CENTER = [105, 35];

// d3-geo's Mercator projection emits an "antimeridian clip" subpath far outside
// the viewBox (coords in the thousands). With preserveAspectRatio="meet" that
// out-of-bounds box shrinks China to near-invisible -> blank gray map. Strip it.
function stripClipArtifacts(rawPath) {
  if (!rawPath) return '';
  const subs = rawPath
    .split('Z')
    .map((s) => s.trim())
    .filter((s) => s.startsWith('M'));
  const kept = [];
  const MARGIN = 400;
  for (const sub of subs) {
    const nums = [...sub.matchAll(/-?\d+\.?\d*/g)].map((m) => parseFloat(m[0]));
    if (nums.length < 6) continue;
    let sane = true;
    for (let i = 0; i < nums.length; i += 2) {
      const x = nums[i];
      const y = nums[i + 1];
      if (x < -MARGIN || x > VIEWBOX_WIDTH + MARGIN || y < -MARGIN || y > VIEWBOX_HEIGHT + MARGIN) {
        sane = false;
        break;
      }
    }
    if (sane) kept.push(`${sub}Z`);
  }
  return kept.join('');
}

function createProjection() {
  return geoMercator()
    .center(CHINA_CENTER)
    .scale(600)
    .translate([VIEWBOX_WIDTH / 2, VIEWBOX_HEIGHT / 2]);
}

function geoToSvgPath(feature, projection) {
  const pathGenerator = geoPath().projection(projection);
  return stripClipArtifacts(pathGenerator(feature));
}

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

/**
 * Interactive Map with province unlock and collection progress
 */
export function InteractiveChinaMap({
  connectedProvinces = new Set(),
  collectionStats = {},
  onProvincePress,
  recentlyUnlocked = null,
}) {
  const { colors } = useTheme();
  const [pressedProvince, setPressedProvince] = useState(null);
  const unlockAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const projection = useMemo(() => createProjection(), []);

  // Animate unlock when new province is unlocked
  useEffect(() => {
    if (recentlyUnlocked) {
      unlockAnim.setValue(0);
      Animated.sequence([
        Animated.spring(unlockAnim, {
          toValue: 1,
          friction: 4,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.2,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
          { iterations: 3 }
        ),
      ]).start();

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
  }, [recentlyUnlocked]);

  const provinces = useMemo(() => {
    return chinaGeo.features.map((feature) => {
      const id = feature.properties.id;
      const path = geoToSvgPath(feature, projection);
      const centroid = getCentroid(feature, projection);
      const stats = collectionStats[id] || { collected: 0, total: 0 };
      // A province is "active" if it has collected items, otherwise just show as available
      const hasCollection = stats.collected > 0;

      return {
        id,
        name: feature.properties.name,
        nameEn: feature.properties.nameEn,
        path,
        centroid,
        active: hasCollection,
        available: connectedProvinces.has(id),
        collected: stats.collected,
        total: stats.total,
        progress: stats.total > 0 ? (stats.collected / stats.total) * 100 : 0,
        isRecentlyUnlocked: recentlyUnlocked === id,
      };
    });
  }, [projection, connectedProvinces, collectionStats, recentlyUnlocked]);

  const activeCount = provinces.filter(p => p.active).length;
  const availableCount = provinces.filter(p => p.available).length;
  const totalCount = provinces.length;

  return (
    <View style={styles.wrap}>
      {/* Progress Header */}
      <View style={styles.progressHeader}>
        <View style={styles.progressBadge}>
          <MapPin size={14} color={colors.primary} strokeWidth={2} />
          <Text style={styles.progressText}>{activeCount}/{totalCount}</Text>
        </View>
        <Text style={styles.progressLabel}>Provinces Explored</Text>
        <Text style={styles.progressLabelCn}>探索省份</Text>
      </View>

      {/* Map */}
      <View style={styles.mapWrap}>
        <Svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <Defs>
            <LinearGradient id="activeGradientMap" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={colors.primary} />
              <Stop offset="100%" stopColor={colors.primaryDark} />
            </LinearGradient>
            <LinearGradient id="inactiveGradientMap" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={colors.surface} />
              <Stop offset="100%" stopColor={colors.border} />
            </LinearGradient>
          </Defs>

          {/* Ocean background */}
          <Rect
            x="0"
            y="0"
            width={VIEWBOX_WIDTH}
            height={VIEWBOX_HEIGHT}
            fill={colors.background}
          />

          {/* Provinces */}
          {provinces.map((province) => (
            <G key={province.id}>
              {/* Province path */}
              <Path
                d={province.path}
                fill={province.active ? colors.primary : (province.available ? colors.cinnabarGlow : colors.surface)}
                stroke={province.active ? colors.primaryDark : colors.border}
                strokeWidth={1}
                opacity={pressedProvince === province.id ? 0.8 : 1}
              />

              {/* Progress indicator for active provinces */}
              {province.active && province.centroid && (
                <G>
                  {/* Collection progress circle */}
                  <Circle
                    cx={province.centroid.x}
                    cy={province.centroid.y}
                    r={12}
                    fill={colors.cinnabarGlow}
                    stroke={colors.primary}
                    strokeWidth={1}
                  />
                  <SvgText
                    x={province.centroid.x}
                    y={province.centroid.y + 4}
                    fontSize="10"
                    fontWeight="bold"
                    fill={colors.primary}
                    textAnchor="middle"
                  >
                    {province.collected}
                  </SvgText>
                </G>
              )}

              {/* Dot for available but not collected provinces */}
              {province.available && !province.active && province.centroid && (
                <Circle
                  cx={province.centroid.x}
                  cy={province.centroid.y}
                  r={6}
                  fill={colors.border}
                  opacity={0.6}
                />
              )}
            </G>
          ))}
        </Svg>

        {/* Touchable overlays for province interaction */}
        {provinces.map((province) => (
          province.centroid && (
            <Pressable
              key={`touch-${province.id}`}
              style={[
                styles.provinceTouch,
                {
                  left: `${(province.centroid.x / VIEWBOX_WIDTH) * 100}%`,
                  top: `${(province.centroid.y / VIEWBOX_HEIGHT) * 100}%`,
                },
              ]}
              onPressIn={() => setPressedProvince(province.id)}
              onPressOut={() => setPressedProvince(null)}
              onPress={() => onProvincePress?.(province)}
            />
          )
        ))}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
          <Text style={styles.legendText}>Explored</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.surface, borderColor: colors.border }]} />
          <Text style={styles.legendText}>Locked</Text>
        </View>
      </View>
    </View>
  );
}

/**
 * Province unlock celebration overlay
 */
export function ProvinceUnlockCelebration({ province, visible, onComplete }) {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && province) {
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 4,
            tension: 100,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(2000),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onComplete?.();
      });
    }
  }, [visible, province]);

  if (!visible || !province) return null;

  return (
    <View style={styles.celebrationOverlay}>
      <Animated.View
        style={[
          styles.celebrationCard,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <View style={[styles.celebrationIcon, { backgroundColor: colors.cinnabarGlow }]}>
          <Unlock size={32} color={colors.primary} strokeWidth={2} />
        </View>
        <Text style={styles.celebrationTitle}>New Province Unlocked!</Text>
        <Text style={styles.celebrationTitleCn}>新省份解锁!</Text>
        <Text style={styles.celebrationProvince}>{province.nameEn}</Text>
        <Text style={[styles.celebrationProvinceCn, { color: colors.primary }]}>{province.name}</Text>
        <View style={[styles.xpBadge, { backgroundColor: colors.primary + '20' }]}>
          <Sparkles size={12} color={colors.primary} strokeWidth={2} />
          <Text style={[styles.xpBadgeText, { color: colors.primary }]}>+50 XP</Text>
        </View>
      </Animated.View>
    </View>
  );
}

/**
 * Mini map for home screen
 */
export function MiniMapCard({ connectedProvinces, onPress }) {
  const { colors } = useTheme();
  const activeCount = connectedProvinces ? connectedProvinces.size : 0;
  const totalCount = chinaGeo.features.length;

  return (
    <Pressable
      style={({ pressed }) => [styles.miniMapCard, pressed && styles.miniMapCardPressed]}
      onPress={onPress}
    >
      <View style={styles.miniMapHeader}>
        <MapPin size={14} color={colors.primary} strokeWidth={2} />
        <Text style={styles.miniMapTitle}>Map</Text>
        <Text style={styles.miniMapTitleCn}>地图</Text>
      </View>
      <View style={styles.miniMapProgress}>
        <View style={[styles.miniMapProgressBar, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.miniMapProgressFill,
              {
                width: `${(activeCount / totalCount) * 100}%`,
                backgroundColor: colors.primary,
              },
            ]}
          />
        </View>
        <Text style={styles.miniMapProgressText}>{activeCount}/{totalCount}</Text>
      </View>
      <View style={styles.miniMapHint}>
        <Text style={styles.miniMapHintText}>Tap to explore</Text>
        <Star size={10} color={colors.mutedText} strokeWidth={2} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    ...theme.shadows.subtle,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  progressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.cinnabarGlow,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text,
  },
  progressLabelCn: {
    fontSize: 10,
    fontWeight: '500',
    color: theme.colors.primary,
  },
  mapWrap: {
    height: 300,
    position: 'relative',
  },
  provinceTouch: {
    position: 'absolute',
    width: 40,
    height: 40,
    marginLeft: -20,
    marginTop: -20,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
  },
  legendText: {
    fontSize: 11,
    color: theme.colors.mutedText,
    fontWeight: '600',
  },

  // Celebration
  celebrationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  celebrationCard: {
    backgroundColor: '#FFFBF6',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: 280,
  },
  celebrationIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  celebrationTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text,
    marginTop: 16,
  },
  celebrationTitleCn: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  celebrationProvince: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.text,
    marginTop: 12,
  },
  celebrationProvinceCn: {
    fontSize: 16,
    fontWeight: '600',
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  xpBadgeText: {
    fontSize: 14,
    fontWeight: '700',
  },

  // Mini map card
  miniMapCard: {
    backgroundColor: theme.colors.softCard,
    borderRadius: 16,
    padding: 14,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
  },
  miniMapCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  miniMapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  miniMapTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
  },
  miniMapTitleCn: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  miniMapProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  miniMapProgressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  miniMapProgressFill: {
    height: 4,
    borderRadius: 2,
  },
  miniMapProgressText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.mutedText,
  },
  miniMapHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 8,
  },
  miniMapHintText: {
    fontSize: 10,
    color: theme.colors.mutedText,
    fontWeight: '600',
  },
});
