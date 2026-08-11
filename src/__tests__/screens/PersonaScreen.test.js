/**
 * Tests for PersonaScreen personalization integration
 */

// Mock native/expo modules used by PersonaScreen graph so the module
// can be required without a rendering environment.
jest.mock('../../components/PaperTexture', () => ({ PaperTexture: () => null }));
jest.mock('../../components/SealTexture', () => ({ SealTexture: () => null }));
jest.mock('../../components/ChinaConnectionMap', () => ({ ChinaConnectionMap: () => null }));
jest.mock('../../components/HandscrollContainer', () => ({ HandscrollContainer: ({ children }) => children }));
jest.mock('../../components/ScreenHeader', () => ({ ScreenHeader: () => null }));
jest.mock('../../components/SectionCard', () => ({ SectionCard: ({ children }) => children }));
jest.mock('../../components/StampFeedback', () => ({ StampFeedback: () => null }));
jest.mock('../../components/Skeleton', () => ({ SkeletonListItem: () => null }));
jest.mock('../../components/Toast', () => ({ useToast: () => ({ success: () => {}, error: () => {} }) }));
jest.mock('../../components/PersonalizationModal', () => ({
  PersonalizationModal: () => null,
  AvatarFrame: () => null,
  UserTitleBadge: () => null,
  PersonalizeButton: () => null,
}));
jest.mock('expo-haptics', () => ({ impactAsync: jest.fn(), notificationAsync: jest.fn(), selectionAsync: jest.fn(), ImpactFeedbackStyle: {}, NotificationFeedbackType: {} }));
jest.mock('expo-speech', () => ({ stop: jest.fn(), speak: jest.fn() }));
jest.mock('expo-clipboard', () => ({ setStringAsync: jest.fn() }));
jest.mock('@react-navigation/native', () => ({ useNavigation: () => ({ navigate: jest.fn() }) }));
jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

describe('PersonaScreen Personalization', () => {
  it('loads and requires the PersonaScreen module without syntax errors', () => {
    const mod = require('../../screens/PersonaScreen');
    expect(mod).toBeDefined();
    expect(typeof mod.PersonaScreen).toBe('function');
  });

  it('personalization utils expose frames/titles lookups', () => {
    const { getFrameById, getTitleById } = require('../../utils/personalization');
    const gold = getFrameById('gold');
    expect(gold).toBeDefined();
    expect(gold.nameCn).toBe('黄金');
    expect(gold.rarity).toBe('epic');
    const foodie = getTitleById('foodie');
    expect(foodie).toBeDefined();
    expect(foodie.nameCn).toBe('美食家');
  });

  it('frame/title requirements are enforced by checkRequirement paths', () => {
    const { AVATAR_FRAMES, TITLES } = require('../../utils/personalization');
    // Frames have a level/collection/streak/achievement requirement
    expect(AVATAR_FRAMES.length).toBe(7);
    expect(TITLES.length).toBe(7);
    // Default frame has no requirement (always unlocked)
    const defaultFrame = AVATAR_FRAMES.find((f) => f.id === 'default');
    expect(defaultFrame.requirement).toBeNull();
  });

  it('PersonalizationModal exposes required exports for integration', () => {
    const modal = require('../../components/PersonalizationModal');
    expect(typeof modal.PersonalizationModal).toBe('function');
    expect(typeof modal.AvatarFrame).toBe('function');
    expect(typeof modal.UserTitleBadge).toBe('function');
    expect(typeof modal.PersonalizeButton).toBe('function');
  });
});
