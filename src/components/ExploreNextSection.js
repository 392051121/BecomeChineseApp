import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowRight, Compass } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { SectionCard } from './SectionCard';
import { getTypeIcon, getTypeColor, getTypeScreen, getTypeLabel } from '../utils/contentTypes';
import { navigateApp } from '../utils/navigation';

/**
 * ExploreNextSection
 *
 * Renders a "Explore Next" card listing related content for the current item.
 * Tap an entry to deep-link to the relevant tab / detail screen.
 *
 * @param {Array}  items       - [{ type:'recipe'|'city'|'dynasty'|'person', id, reason }]
 * @param {string} sourceType  - type of the reading surface (e.g. 'season')
 * @param {string} sourceId    - id of the current surface
 */
export function ExploreNextSection({ items = [], sourceType, sourceId }) {
  const navigation = useNavigation();
  const { colors } = useTheme();

  if (!Array.isArray(items) || items.length === 0) return null;

  const handlePress = (item) => {
    const type = item.type;
    const screen = getTypeScreen(type);

    // Deep-link into a dedicated detail route when one exists.
    if (type === 'dynasty' && screen === 'History') {
      navigateApp(navigation, 'History', {
        screen: 'DynastyDetail',
        params: { dynastyId: item.id },
      });
      return;
    }
    if (type === 'person' && screen === 'History') {
      navigateApp(navigation, 'History', {
        screen: 'PersonDetail',
        params: { personId: item.id },
      });
      return;
    }

    // recipe -> Food tab, carrying the id so the detail sheet opens directly.
    if (type === 'recipe' && screen === 'Food') {
      navigateApp(navigation, 'Food', { recipeId: item.id });
      return;
    }

    // city -> Places tab, carrying the id so the city activates directly.
    if (type === 'city' && screen === 'Places') {
      navigateApp(navigation, 'Places', { cityId: item.id });
      return;
    }

    // fallback -> tab.
    navigateApp(navigation, screen);
  };

  return (
    <SectionCard style={styles.card} tone="soft">
      <View style={styles.header}>
        <Compass size={16} color={colors.primary} strokeWidth={2} />
        <Text style={[styles.title, { color: colors.text }]}>Explore Next</Text>
      </View>
      <Text style={[styles.hint, { color: colors.mutedText }]}>
        Keep the journey going — related to what you just read
      </Text>

      <View style={styles.list}>
        {items.map((item, index) => {
          const type = item.type;
          const Icon = getTypeIcon(type);
          const accent = getTypeColor(type);
          const label = getTypeLabel(type, 'en');
          return (
            <Pressable
              key={`${type}-${item.id || index}`}
              style={({ pressed }) => [
                styles.row,
                { backgroundColor: colors.surface, borderColor: colors.border },
                pressed && styles.rowPressed,
              ]}
              onPress={() => handlePress(item)}
              accessibilityRole="button"
              accessibilityLabel={item.reason || `${label} · ${item.id}`}
            >
              <View style={[styles.iconWrap, { backgroundColor: `${accent}18` }]}>
                <Icon size={14} color={accent} strokeWidth={2} />
              </View>
              <View style={styles.textWrap}>
                <Text style={[styles.reason, { color: colors.text }]} numberOfLines={2}>
                  {item.reason || `${label} around this season`}
                </Text>
                <Text style={[styles.typeTag, { color: accent }]}>{label}</Text>
              </View>
              <ArrowRight size={13} color={colors.mutedText} strokeWidth={2} />
            </Pressable>
          );
        })}
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: theme.typography.titleSerif,
  },
  hint: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  list: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 0.5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    gap: 10,
  },
  rowPressed: {
    opacity: 0.75,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
  },
  reason: {
    fontSize: 13,
    lineHeight: 17,
  },
  typeTag: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
