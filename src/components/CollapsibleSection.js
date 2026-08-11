import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { SectionCard } from './SectionCard';

/**
 * CollapsibleSection
 * A foldable card that groups secondary content to keep long screens compact.
 *
 * Usage:
 *   <CollapsibleSection icon="atlas" title="Atlas Progress" titleCn="探索地图">
 *     ...children...
 *   </CollapsibleSection>
 *
 * Props:
 * - title: primary English label (required)
 * - titleCn: optional Chinese subtitle
 * - icon: lucide icon component (optional)
 * - defaultOpen: whether it starts expanded (default false)
 * - count: optional right-side small badge text (e.g. "3/24")
 * - tone: SectionCard tone (default 'soft')
 * - onToggle: optional callback fired with the new open state
 */
export function CollapsibleSection({
  title,
  titleCn,
  icon: Icon,
  defaultOpen = false,
  count,
  tone = 'soft',
  onToggle,
  children,
  style,
}) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(defaultOpen);
  const heightAnim = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current;
  const [contentHeight, setContentHeight] = useState(null);

  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: open ? 1 : 0,
      duration: 240,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [open, heightAnim]);

  function toggle() {
    setOpen((prev) => {
      const next = !prev;
      if (onToggle) onToggle(next);
      return next;
    });
  }

  // The body is ALWAYS rendered so the inner onLayout can capture its natural
  // height even when the section starts collapsed (content is clipped by
  // overflow:hidden + height:0). Without measured height the toggle could not
  // expand, because we'd have no height to animate to.
  const Chevron = open ? ChevronUp : ChevronDown;

  return (
    <SectionCard style={[styles.card, style]} tone={tone}>
      <Pressable
        onPress={toggle}
        style={styles.header}
        accessibilityRole="button"
        accessibilityLabel={`${title}${open ? ' expanded' : ' collapsed'}`}
        accessibilityHint={`Double tap to ${open ? 'collapse' : 'expand'} this section`}
        accessibilityState={{ expanded: open }}
      >
        {Icon ? (
          <View style={[styles.iconWrap, { backgroundColor: colors.cinnabarGlow }]}>
            <Icon size={15} color={colors.primary} strokeWidth={2} />
          </View>
        ) : null}
        <View style={styles.titleWrap}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          {titleCn ? (
            <Text style={[styles.titleCn, { color: colors.primary }]}>{titleCn}</Text>
          ) : null}
        </View>
        {typeof count === 'number' || typeof count === 'string' ? (
          <View style={[styles.countPill, { backgroundColor: colors.cinnabarGlow }]}>
            <Text style={[styles.countText, { color: colors.primary }]}>{count}</Text>
          </View>
        ) : null}
        <View style={[styles.chevronWrap, { backgroundColor: colors.cinnabarGlow }]}>
          <Chevron size={15} color={colors.primary} strokeWidth={2} />
        </View>
      </Pressable>
      <Animated.View
        style={[
          styles.body,
          {
            // Until the first layout measurement, clamp via opacity/hidden-free
            // height so nothing flashes open on initial render.
            height: contentHeight == null ? (open ? undefined : 0) : heightAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, contentHeight],
            }),
          },
        ]}
      >
        {/* measure wrapper: the actual render target */}
        <View
          style={styles.bodyInner}
          onLayout={(e) => {
            const h = e.nativeEvent.layout.height;
            if (h && h !== contentHeight) setContentHeight(h);
          }}
        >
          {children}
        </View>
      </Animated.View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: 14, padding: 4, overflow: 'hidden' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 52,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: { flex: 1 },
  title: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  titleCn: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  countPill: {
    minWidth: 34,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  countText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.4 },
  chevronWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { overflow: 'hidden' },
  bodyInner: { paddingHorizontal: 12, paddingBottom: 14 },
});
