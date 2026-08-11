import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config/storageKeys';

/**
 * Reading-position memory for long-form detail screens.
 *
 * Records the vertical scroll offset of a named screen so that when the user
 * navigates away and returns, the view can be restored to the last position.
 *
 * Usage:
 *   const { scrollRef, initialScrollOffset, onScroll } = useReadingPosition('solarTerm:minor-cold');
 *   ... <ScrollView ref={scrollRef} onScroll={onScroll} scrollEventThrottle={16} />
 *
 * `key` should be unique per logical article (e.g. include the content id).
 * Offsets are persisted under a single AsyncStorage key as `{ [key]: offset }`,
 * and are trimmed back to 0 whenever the value is harmless.
 */
export function useReadingPosition(key) {
  const [savedOffset, setSavedOffset] = useState(0);
  const latestOffsetRef = useRef(0);
  const loadedRef = useRef(false);

  // Load the persisted position for this key (once).
  useEffect(() => {
    if (!key) return;
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEYS.READING_POSITIONS);
        const offset = parseReadingPosition(raw, key);
        if (!cancelled && offset > 0) {
          setSavedOffset(offset);
          latestOffsetRef.current = offset;
        }
      } catch (e) {
        // Ignore: reading a corrupted position should never break the screen.
      }
      loadedRef.current = true;
    })();
    return () => { cancelled = true; };
  }, [key]);

  // Persist the latest known offset on unmount / when the key changes.
  useEffect(() => {
    const offsetAtMount = () => latestOffsetRef.current;
    return () => {
      const offset = offsetAtMount();
      if (offset > 0) {
        persistOffset(key, offset);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const onScroll = useCallback((e) => {
    const y = e?.nativeEvent?.contentOffset?.y ?? 0;
    if (y >= 0) latestOffsetRef.current = Math.floor(y);
  }, []);

  // Jump back to the saved position on next render.
  const restore = useCallback((scrollViewRef) => {
    if (savedOffset > 0) {
      scrollViewRef?.current?.scrollTo?.({ y: savedOffset, animated: false });
    }
  }, [savedOffset]);

  return {
    scrollRef: null, // caller owns the ref; restore() needs it
    savedOffset,
    initialScrollOffset: savedOffset,
    onScroll,
    restore,
  };
}

/**
 * Parse a stored offset for a given content key, returning a non-negative int
 * (0 when missing or corrupted). Pure + unit-testable.
 */
export function parseReadingPosition(raw, key) {
  if (!raw || !key) return 0;
  try {
    const map = JSON.parse(raw);
    const offset = Number(map?.[key]);
    return Number.isFinite(offset) && offset > 0 ? Math.floor(offset) : 0;
  } catch (e) {
    return 0;
  }
}

/**
 * Merge `offset` into the stored positions payload. Best-effort; never throws.
 * Exposed for unit testing the persistence round-trip.
 */
export async function persistOffset(key, offset) {
  if (!key) return;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.READING_POSITIONS);
    const map = raw ? JSON.parse(raw) : {};
    map[key] = Math.max(0, Math.floor(offset));
    await AsyncStorage.setItem(STORAGE_KEYS.READING_POSITIONS, JSON.stringify(map));
  } catch (e) {
    // Best-effort persistence; never throw into the UI.
  }
}

