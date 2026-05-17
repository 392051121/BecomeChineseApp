/**
 * Friend Code System
 *
 * Generate and manage friend codes for social features.
 * No backend - uses local storage only.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config/storageKeys';
import { logger } from './errorHandling';

/**
 * Generate a unique friend code
 */
function generateFriendCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars like I, O, 0, 1
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Get or create user's friend code
 */
export async function getMyFriendCode() {
  try {
    let code = await AsyncStorage.getItem(STORAGE_KEYS.USER_CODE);
    if (!code) {
      code = generateFriendCode();
      await AsyncStorage.setItem(STORAGE_KEYS.USER_CODE, code);
    }
    return code;
  } catch (e) {
    logger.error('FriendCode', 'Failed to get friend code', e);
    return generateFriendCode();
  }
}

/**
 * Get friend list
 */
export async function getFriendList() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.FRIEND_LIST);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    logger.error('FriendCode', 'Failed to get friend list', e);
    return [];
  }
}

/**
 * Add a friend by code
 */
export async function addFriendByCode(code) {
  if (!code || code.length !== 8) {
    return { success: false, message: 'Invalid code format' };
  }

  const myCode = await getMyFriendCode();
  if (code.toUpperCase() === myCode) {
    return { success: false, message: 'Cannot add yourself as friend' };
  }

  const friends = await getFriendList();

  // Check if already added
  if (friends.some(f => f.code === code.toUpperCase())) {
    return { success: false, message: 'Friend already added' };
  }

  // Add friend (simulated - in real app would verify code exists on server)
  const newFriend = {
    id: Date.now().toString(),
    code: code.toUpperCase(),
    name: `Friend ${friends.length + 1}`,
    addedAt: Date.now(),
    xp: Math.floor(Math.random() * 1000) + 100, // Simulated XP
    level: Math.floor(Math.random() * 20) + 1, // Simulated level
  };

  const updatedFriends = [...friends, newFriend];
  await AsyncStorage.setItem(STORAGE_KEYS.FRIEND_LIST, JSON.stringify(updatedFriends));

  return { success: true, friend: newFriend };
}

/**
 * Remove a friend
 */
export async function removeFriend(friendId) {
  const friends = await getFriendList();
  const updatedFriends = friends.filter(f => f.id !== friendId);
  await AsyncStorage.setItem(STORAGE_KEYS.FRIEND_LIST, JSON.stringify(updatedFriends));
  return { success: true };
}

/**
 * Get leaderboard data (local + friends)
 */
export async function getLeaderboard() {
  const myCode = await getMyFriendCode();
  const friends = await getFriendList();

  // Get user's XP
  const { calculateTotalXP } = require('../data/badges').calculateTotalXP;
  const { getCulturalAssets } = require('./culturalAssets');

  const assets = await getCulturalAssets();
  const userXP = assets?.quiz?.totalSolved * 10 || 0; // Simplified XP calculation

  // Create leaderboard entries
  const entries = [
    {
      id: 'me',
      code: myCode,
      name: 'You',
      xp: userXP,
      level: Math.floor(userXP / 100) + 1,
      isMe: true,
    },
    ...friends.map(f => ({
      id: f.id,
      code: f.code,
      name: f.name,
      xp: f.xp,
      level: f.level,
      isMe: false,
    })),
  ];

  // Sort by XP descending
  entries.sort((a, b) => b.xp - a.xp);

  // Add rank
  return entries.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
}

/**
 * Get friend stats summary
 */
export async function getFriendStats() {
  const friends = await getFriendList();
  const myCode = await getMyFriendCode();

  return {
    totalFriends: friends.length,
    myCode,
    recentFriends: friends
      .sort((a, b) => b.addedAt - a.addedAt)
      .slice(0, 3),
  };
}
