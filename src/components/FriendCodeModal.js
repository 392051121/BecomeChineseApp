/**
 * Friend Code & Leaderboard Components
 *
 * Social features for sharing and comparing progress.
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  Animated,
  Clipboard,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Users,
  Share2,
  Copy,
  Check,
  X,
  Trophy,
  Crown,
  Medal,
  Sparkles,
  UserPlus,
  Trash2,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { PaperTexture } from './PaperTexture';
import {
  getMyFriendCode,
  getFriendList,
  addFriendByCode,
  removeFriend,
  getLeaderboard,
  getFriendStats,
} from '../utils/friendCode';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Friend Code Modal
 */
export function FriendCodeModal({ visible, onClose }) {
  const { colors } = useTheme();
  const [myCode, setMyCode] = useState('');
  const [friends, setFriends] = useState([]);
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      loadData();
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.9);
      opacityAnim.setValue(0);
      setInputCode('');
      setError('');
    }
  }, [visible]);

  const loadData = async () => {
    const [code, friendList] = await Promise.all([
      getMyFriendCode(),
      getFriendList(),
    ]);
    setMyCode(code);
    setFriends(friendList);
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(myCode);
    setCopied(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddFriend = async () => {
    if (!inputCode || inputCode.length !== 8) {
      setError('Code must be 8 characters');
      return;
    }

    setAdding(true);
    setError('');

    const result = await addFriendByCode(inputCode);

    if (result.success) {
      await loadData();
      setInputCode('');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } else {
      setError(result.message);
    }

    setAdding(false);
  };

  const handleRemoveFriend = async (friendId) => {
    await removeFriend(friendId);
    await loadData();
  };

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose?.();
    });
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <PaperTexture />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Users size={24} color={colors.primary} strokeWidth={2} />
            </View>
            <Text style={styles.title}>Friends</Text>
            <Text style={styles.titleCn}>好友</Text>
            <Pressable style={styles.closeBtn} onPress={handleClose}>
              <X size={20} color={colors.mutedText} strokeWidth={2} />
            </Pressable>
          </View>

          {/* My Code */}
          <View style={styles.codeSection}>
            <Text style={styles.codeLabel}>Your Friend Code</Text>
            <View style={styles.codeDisplay}>
              <Text style={styles.codeText}>{myCode}</Text>
              <Pressable style={styles.copyBtn} onPress={handleCopy}>
                {copied ? (
                  <Check size={16} color={colors.success} strokeWidth={2} />
                ) : (
                  <Copy size={16} color={colors.primary} strokeWidth={2} />
                )}
              </Pressable>
            </View>
            <Text style={styles.codeHint}>Share this code with friends</Text>
          </View>

          {/* Add Friend */}
          <View style={styles.addSection}>
            <Text style={styles.addLabel}>Add Friend</Text>
            <View style={styles.inputRow}>
              <View style={styles.inputWrap}>
                <Text style={styles.inputText}>{inputCode || 'Enter code'}</Text>
              </View>
              <Pressable
                style={[styles.addBtn, adding && styles.addBtnLoading]}
                onPress={handleAddFriend}
                disabled={adding}
              >
                <UserPlus size={16} color="#FFFFFF" strokeWidth={2} />
              </Pressable>
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          {/* Friend List */}
          <View style={styles.friendList}>
            <Text style={styles.listLabel}>Friends ({friends.length})</Text>
            {friends.length === 0 ? (
              <Text style={styles.emptyText}>No friends yet. Add your first friend!</Text>
            ) : (
              friends.map((friend) => (
                <View key={friend.id} style={styles.friendItem}>
                  <View style={[styles.friendAvatar, { backgroundColor: colors.cinnabarGlow }]}>
                    <Text style={styles.friendAvatarText}>{friend.name.charAt(0)}</Text>
                  </View>
                  <View style={styles.friendInfo}>
                    <Text style={styles.friendName}>{friend.name}</Text>
                    <Text style={styles.friendCode}>Lv.{friend.level} • {friend.xp} XP</Text>
                  </View>
                  <Pressable
                    style={styles.removeBtn}
                    onPress={() => handleRemoveFriend(friend.id)}
                  >
                    <Trash2 size={14} color={colors.mutedText} strokeWidth={2} />
                  </Pressable>
                </View>
              ))
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

/**
 * Leaderboard Modal
 */
export function LeaderboardModal({ visible, onClose }) {
  const { colors } = useTheme();
  const [entries, setEntries] = useState([]);

  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      loadData();
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.9);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  const loadData = async () => {
    const data = await getLeaderboard();
    setEntries(data);
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown size={18} color="#F59E0B" strokeWidth={2} />;
    if (rank === 2) return <Medal size={18} color="#9CA3AF" strokeWidth={2} />;
    if (rank === 3) return <Medal size={18} color="#CD7F32" strokeWidth={2} />;
    return <Text style={styles.rankNum}>{rank}</Text>;
  };

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose?.();
    });
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <PaperTexture />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Trophy size={24} color={colors.primary} strokeWidth={2} />
            </View>
            <Text style={styles.title}>Leaderboard</Text>
            <Text style={styles.titleCn}>排行榜</Text>
            <Pressable style={styles.closeBtn} onPress={handleClose}>
              <X size={20} color={colors.mutedText} strokeWidth={2} />
            </Pressable>
          </View>

          {/* Entries */}
          <View style={styles.leaderboardList}>
            {entries.map((entry) => (
              <View
                key={entry.id}
                style={[
                  styles.leaderboardItem,
                  entry.isMe && styles.leaderboardItemMe,
                  entry.rank <= 3 && styles.leaderboardItemTop,
                ]}
              >
                <View style={styles.rankWrap}>
                  {getRankIcon(entry.rank)}
                </View>
                <View style={[styles.entryAvatar, { backgroundColor: entry.isMe ? colors.primary + '20' : colors.cinnabarGlow }]}>
                  <Text style={[styles.entryAvatarText, entry.isMe && { color: colors.primary }]}>
                    {entry.name.charAt(0)}
                  </Text>
                </View>
                <View style={styles.entryInfo}>
                  <Text style={[styles.entryName, entry.isMe && { color: colors.primary }]}>
                    {entry.name}
                  </Text>
                  <Text style={styles.entryLevel}>Lv.{entry.level}</Text>
                </View>
                <View style={styles.entryXP}>
                  <Sparkles size={10} color={colors.mutedText} strokeWidth={2} />
                  <Text style={styles.entryXPText}>{entry.xp}</Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

/**
 * Compact friend button for home screen
 */
export function FriendButton({ onPress, friendCount }) {
  const { colors } = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [styles.compactBtn, pressed && styles.compactBtnPressed]}
      onPress={onPress}
    >
      <Users size={14} color={colors.primary} strokeWidth={2} />
      <Text style={styles.compactBtnText}>{friendCount}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: SCREEN_WIDTH - 40,
    maxHeight: 500,
    backgroundColor: '#FFFBF6',
    borderRadius: 24,
    overflow: 'hidden',
    ...theme.shadows.strong,
  },
  header: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
    position: 'relative',
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: theme.colors.cinnabarGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.text,
  },
  titleCn: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
    marginTop: 2,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },

  // Code section
  codeSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  codeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.mutedText,
    marginBottom: 8,
  },
  codeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.cinnabarGlow,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  codeText: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.primary,
    letterSpacing: 4,
  },
  copyBtn: {
    padding: 4,
  },
  codeHint: {
    fontSize: 11,
    color: theme.colors.mutedText,
    marginTop: 6,
  },

  // Add section
  addSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  addLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.mutedText,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  inputWrap: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  inputText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  addBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnLoading: {
    opacity: 0.7,
  },
  errorText: {
    fontSize: 11,
    color: theme.colors.error,
    marginTop: 6,
  },

  // Friend list
  friendList: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  listLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.mutedText,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 13,
    color: theme.colors.mutedText,
    textAlign: 'center',
    paddingVertical: 16,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  friendAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  friendAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  friendCode: {
    fontSize: 11,
    color: theme.colors.mutedText,
  },
  removeBtn: {
    padding: 8,
  },

  // Leaderboard
  leaderboardList: {
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 20,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  leaderboardItemMe: {
    backgroundColor: theme.colors.cinnabarGlow,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  leaderboardItemTop: {
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
  },
  rankWrap: {
    width: 24,
    alignItems: 'center',
  },
  rankNum: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.mutedText,
  },
  entryAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  entryAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  entryInfo: {
    flex: 1,
  },
  entryName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  entryLevel: {
    fontSize: 11,
    color: theme.colors.mutedText,
  },
  entryXP: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  entryXPText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.text,
  },

  // Compact button
  compactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.cinnabarGlow,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  compactBtnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  compactBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },
});
