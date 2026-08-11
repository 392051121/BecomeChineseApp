# Performance Optimization Guide

## Overview

This document outlines the performance optimizations implemented in BecomeChineseApp to ensure smooth scrolling, fast image loading, and efficient memory usage.

---

## 1. FlatList Optimization

### Configuration

All FlatList components use centralized configuration from `src/config/constants.js`:

```javascript
export const FLATLIST_CONFIG = {
  INITIAL_NUM_TO_RENDER: 4,    // Render first 4 items immediately
  MAX_TO_RENDER_PER_BATCH: 4,  // Render 4 items per batch
  WINDOW_SIZE: 5,              // Render 5 screens worth of items
};
```

### Optimized Screens

| Screen | File | Optimizations Applied |
|--------|------|----------------------|
| TravelScreen | `TravelScreen.js` | ✅ All FlatList props |
| FoodScreen | `FoodScreen.js` | ✅ All FlatList props |
| PeopleScreen | `PeopleScreen.js` | ✅ All FlatList props |
| HistoryScreen | `HistoryScreen.js` | ✅ All FlatList props |
| ExploreScreen | `ExploreScreen.js` | ✅ Added optimization props |
| JourneysScreen | `JourneysScreen.js` | ✅ Added optimization props |
| StampAlbum | `StampAlbum.js` | ✅ Added props + getItemLayout |

### Key Props Explained

```javascript
<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  
  // Performance props
  initialNumToRender={4}           // First batch renders immediately
  maxToRenderPerBatch={4}          // Subsequent batches render incrementally
  windowSize={5}                   // Virtual window size (screens)
  removeClippedSubviews={true}     // Unmount off-screen items
  updateCellsBatchingPeriod={40}   // Batch updates every 40ms
  
  // For fixed-height items (optional but recommended)
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

---

## 2. Image Optimization

### expo-image Integration

The app uses `expo-image` for optimized image handling with:

- **Memory caching**: Images cached in memory for instant access
- **Disk caching**: Persistent cache across app restarts
- **Lazy loading**: Images load when near viewport
- **Priority loading**: Critical images load first
- **Placeholder support**: Blurhash placeholders during load

### SmartImageBlock Component

Located at `src/components/SmartImageBlock.js`:

```javascript
import { Image } from 'expo-image';

<Image
  source={imageSource}
  contentFit="cover"
  cachePolicy="memory-disk"     // Enable both caches
  priority="normal"             // 'low' | 'normal' | 'high'
  placeholder={{ blurhash: '...' }}
  transition={200}
/>
```

### Usage Examples

```javascript
// Hero image (high priority)
<SmartImageBlock
  source={require('../assets/beijing.jpg')}
  priority="high"
  placeholderType="city"
/>

// List item image (normal priority)
<SmartImageBlock
  uri={city.imageUrl}
  priority="normal"
  placeholderType="city"
/>

// Thumbnail (low priority)
<SmartImageBlock
  uri={recipe.thumbnail}
  priority="low"
  placeholderType="recipe"
/>
```

---

## 3. List Virtualization Best Practices

### Do's ✅

- Use `FlatList` or `SectionList` for any list with 10+ items
- Always provide a stable `keyExtractor`
- Use `memo()` for list item components
- Implement `getItemLayout` for fixed-height items
- Use `removeClippedSubviews={true}` for long lists

### Don'ts ❌

- Don't use `ScrollView` for long lists (renders all children)
- Don't inline `renderItem` functions (causes re-renders)
- Don't use index as key for dynamic lists
- Don't render large images in list items without resizing

---

## 4. Memory Management

### Image Cache Policy

```javascript
cachePolicy="memory-disk"
```

- `memory`: Fast access, cleared when app closes
- `disk`: Persistent, survives app restarts
- `memory-disk`: Both (recommended)

### Clearing Cache

To clear image cache (useful for testing or low storage):

```javascript
import { Image } from 'expo-image';
await Image.clearMemoryCache();
await Image.clearDiskCache();
```

---

## 5. Performance Checklist

### Before Release

- [ ] All list screens use FlatList with optimization props
- [ ] Large images use expo-image with caching
- [ ] List item components are wrapped in `memo()`
- [ ] No inline functions in renderItem
- [ ] getItemLayout implemented for fixed-height lists
- [ ] Performance tested on low-end Android devices

### Monitoring

Use React DevTools Profiler to identify:
- Slow render times (>16ms)
- Unnecessary re-renders
- Large component trees

---

## 6. Future Optimizations

Consider implementing:

1. **@shopify/flash-list**: Drop-in FlatList replacement with better performance
2. **React Native Performance** monitoring with Flipper
3. **Image preloading** for critical paths
4. **Bundle splitting** for large data files

---

## References

- [expo-image documentation](https://docs.expo.dev/versions/latest/sdk/image/)
- [React Native FlatList optimization](https://reactnative.dev/docs/optimizing-flatlist-configuration)
- [FlashList by Shopify](https://github.com/Shopify/flash-list)
