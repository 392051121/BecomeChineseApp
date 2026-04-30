/**
 * Content Type Utilities
 *
 * Shared utilities for handling different content types (city, recipe, dynasty, person)
 * This is the single source of truth for type mappings across the app.
 */

import { MapPin, UtensilsCrossed, Clock, User, Sparkles, Bookmark, Scroll } from 'lucide-react-native';

// Type color definitions - single source of truth
export const TYPE_COLORS = {
  city: '#6B8A94',
  dynasty: '#B33B24',
  recipe: '#E2B05E',
  person: '#9C3A2B',
  default: '#A13F2E',
};

// Type icon mappings - single source of truth
export const TYPE_ICONS = {
  city: MapPin,
  dynasty: Scroll,
  recipe: UtensilsCrossed,
  person: User,
  default: Sparkles,
};

// Type screen mappings - single source of truth
export const TYPE_SCREENS = {
  city: 'Places',
  dynasty: 'History',
  recipe: 'Food',
  person: 'History',
  default: 'Home',
};

// Type labels for display
export const TYPE_LABELS = {
  city: { en: 'City', cn: '城市' },
  dynasty: { en: 'Dynasty', cn: '朝代' },
  recipe: { en: 'Dish', cn: '美食' },
  person: { en: 'Person', cn: '人物' },
};

/**
 * Get the icon component for a content type
 * @param {string} type - Content type (city, dynasty, recipe, person)
 * @returns {React.Component} Lucide icon component
 */
export function getTypeIcon(type) {
  return TYPE_ICONS[type] || TYPE_ICONS.default;
}

/**
 * Get the target screen name for a content type
 * @param {string} type - Content type (city, dynasty, recipe, person)
 * @returns {string} Screen name for navigation
 */
export function getTypeScreen(type) {
  return TYPE_SCREENS[type] || TYPE_SCREENS.default;
}

/**
 * Get the color associated with a content type
 * @param {string} type - Content type
 * @returns {string} Hex color code
 */
export function getTypeColor(type) {
  return TYPE_COLORS[type] || TYPE_COLORS.default;
}

/**
 * Get the label for a content type
 * @param {string} type - Content type
 * @param {string} lang - Language ('en' or 'cn')
 * @returns {string} Label string
 */
export function getTypeLabel(type, lang = 'en') {
  const label = TYPE_LABELS[type];
  return label ? label[lang] : type;
}

/**
 * Get type configuration object
 * @param {string} type - Content type
 * @returns {Object} Type configuration with icon, color, screen, label
 */
export function getTypeConfig(type) {
  return {
    type,
    icon: getTypeIcon(type),
    color: getTypeColor(type),
    screen: getTypeScreen(type),
    label: getTypeLabel(type, 'en'),
    labelCn: getTypeLabel(type, 'cn'),
  };
}
