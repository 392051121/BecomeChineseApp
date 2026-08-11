/**
 * P2#6 — Detail-screen reading position memory.
 * Verifies the pure helpers of useReadingPosition: offset parsing and the
 * AsyncStorage persistence round-trip.
 */
import { parseReadingPosition, persistOffset } from '../../hooks/useReadingPosition';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('useReadingPosition helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('parseReadingPosition', () => {
    it('returns 0 when nothing is stored', () => {
      expect(parseReadingPosition(null, 'any')).toBe(0);
      expect(parseReadingPosition('', 'any')).toBe(0);
      expect(parseReadingPosition(undefined, 'any')).toBe(0);
    });

    it('returns 0 when key is missing', () => {
      expect(parseReadingPosition('{"a":1}', '')).toBe(0);
      expect(parseReadingPosition('{"a":1}', null)).toBe(0);
    });

    it('reads a valid offset for the requested key', () => {
      const raw = JSON.stringify({ 'person:zhenghe': 320 });
      expect(parseReadingPosition(raw, 'person:zhenghe')).toBe(320);
    });

    it('floors non-integer offsets', () => {
      expect(parseReadingPosition('{"k":128.6}', 'k')).toBe(128);
    });

    it('ignores non-positive offsets', () => {
      expect(parseReadingPosition('{"k":0}', 'k')).toBe(0);
      expect(parseReadingPosition('{"k":-5}', 'k')).toBe(0);
    });

    it('returns 0 for corrupted payloads', () => {
      expect(parseReadingPosition('not json', 'k')).toBe(0);
      expect(parseReadingPosition('{"k":"abc"}', 'k')).toBe(0);
      expect(parseReadingPosition('[1,2,3]', 'k')).toBe(0);
    });
  });

  describe('persistOffset', () => {
    it('round-trips an offset through AsyncStorage, preserving other keys', async () => {
      const storage = require('@react-native-async-storage/async-storage');
      // Pre-existing payload with a different key.
      let stored = { 'person:zhenghe': 320 };
      storage.getItem.mockResolvedValue(JSON.stringify(stored));
      storage.setItem.mockImplementation(async (k, v) => { stored = JSON.parse(v); });

      await persistOffset('dynasty:tang', 900);
      expect(stored['dynasty:tang']).toBe(900);
      expect(stored['person:zhenghe']).toBe(320);

      // Read it back correctly.
      expect(parseReadingPosition(JSON.stringify(stored), 'dynasty:tang')).toBe(900);
    });

    it('creates a new map when nothing is stored yet', async () => {
      const storage = require('@react-native-async-storage/async-storage');
      let stored = null;
      storage.getItem.mockResolvedValue(null);
      storage.setItem.mockImplementation(async (k, v) => { stored = JSON.parse(v); });

      await persistOffset('person:zhangqian', 55);
      expect(stored['person:zhangqian']).toBe(55);
    });

    it('never writes non-positive offsets', async () => {
      const storage = require('@react-native-async-storage/async-storage');
      storage.getItem.mockResolvedValue(null);
      await persistOffset('k', 0);
      expect(storage.setItem).toHaveBeenCalled();
      const written = JSON.parse(storage.setItem.mock.calls[0][1]);
      expect(written.k).toBe(0);
    });
  });
});
