/**
 * Daily Tasks System
 *
 * Gamified daily objectives with XP rewards.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config/storageKeys';
import { logger } from './errorHandling';

// Task definitions
export const DAILY_TASKS = [
  {
    id: 'quiz_5',
    category: 'quiz',
    target: 5,
    xp: 15,
    label: 'Answer 5 Questions',
    labelCn: '回答5题',
    icon: 'Target',
  },
  {
    id: 'quiz_10',
    category: 'quiz',
    target: 10,
    xp: 25,
    label: 'Answer 10 Questions',
    labelCn: '回答10题',
    icon: 'Target',
  },
  {
    id: 'collect_1',
    category: 'collect',
    target: 1,
    xp: 10,
    label: 'Collect 1 Item',
    labelCn: '收藏1项',
    icon: 'Bookmark',
  },
  {
    id: 'collect_3',
    category: 'collect',
    target: 3,
    xp: 20,
    label: 'Collect 3 Items',
    labelCn: '收藏3项',
    icon: 'Bookmark',
  },
  {
    id: 'explore_city',
    category: 'explore',
    target: 1,
    xp: 10,
    label: 'Explore a City',
    labelCn: '探索城市',
    icon: 'MapPin',
  },
  {
    id: 'explore_recipe',
    category: 'explore',
    target: 1,
    xp: 10,
    label: 'View a Recipe',
    labelCn: '查看食谱',
    icon: 'UtensilsCrossed',
  },
  {
    id: 'history_read',
    category: 'history',
    target: 1,
    xp: 10,
    label: 'Read History',
    labelCn: '阅读历史',
    icon: 'BookOpen',
  },
  {
    id: 'streak_keep',
    category: 'streak',
    target: 1,
    xp: 5,
    label: 'Keep Quiz Streak',
    labelCn: '保持连胜',
    icon: 'Flame',
  },
];

// Task categories for grouping
export const TASK_CATEGORIES = [
  { id: 'quiz', label: 'Quiz', labelCn: '问答', color: '#B33B24' },
  { id: 'collect', label: 'Collect', labelCn: '收藏', color: '#E2B05E' },
  { id: 'explore', label: 'Explore', labelCn: '探索', color: '#6B8A94' },
  { id: 'history', label: 'History', labelCn: '历史', color: '#8B7355' },
  { id: 'streak', label: 'Streak', labelCn: '连胜', color: '#F59E0B' },
];

/**
 * Get today's date key
 */
function getTodayKey() {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

/**
 * Get daily tasks data from storage
 */
export async function getDailyTasksData() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_TASKS);
    if (!raw) {
      return {
        date: getTodayKey(),
        progress: {},
        completed: [],
        claimed: [],
      };
    }
    const data = JSON.parse(raw);
    // Reset if new day
    if (data.date !== getTodayKey()) {
      return {
        date: getTodayKey(),
        progress: {},
        completed: [],
        claimed: [],
      };
    }
    return data;
  } catch (e) {
    logger.error('DailyTasks', 'Failed to get tasks data', e);
    return { date: getTodayKey(), progress: {}, completed: [], claimed: [] };
  }
}

/**
 * Save daily tasks data
 */
async function saveDailyTasksData(data) {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.DAILY_TASKS, JSON.stringify(data));
    return true;
  } catch (e) {
    logger.error('DailyTasks', 'Failed to save tasks data', e);
    return false;
  }
}

/**
 * Get task progress for display
 */
export async function getDailyTasksProgress() {
  const data = await getDailyTasksData();

  // Select 3 random tasks for today (seeded by date)
  const dateSeed = data.date.split('-').reduce((a, b) => a + parseInt(b), 0);
  const shuffled = [...DAILY_TASKS].sort((a, b) => {
    const hashA = (a.id.charCodeAt(0) + dateSeed) % DAILY_TASKS.length;
    const hashB = (b.id.charCodeAt(0) + dateSeed) % DAILY_TASKS.length;
    return hashA - hashB;
  });
  const todayTasks = shuffled.slice(0, 3);

  return todayTasks.map(task => ({
    ...task,
    progress: data.progress[task.id] || 0,
    isCompleted: data.completed.includes(task.id),
    isClaimed: data.claimed.includes(task.id),
  }));
}

/**
 * Update task progress
 */
export async function updateTaskProgress(category, amount = 1) {
  const data = await getDailyTasksData();

  // Find tasks in this category
  const categoryTasks = DAILY_TASKS.filter(t => t.category === category);

  for (const task of categoryTasks) {
    if (data.completed.includes(task.id)) continue;

    const currentProgress = data.progress[task.id] || 0;
    const newProgress = Math.min(currentProgress + amount, task.target);

    data.progress[task.id] = newProgress;

    // Check if completed
    if (newProgress >= task.target && !data.completed.includes(task.id)) {
      data.completed.push(task.id);
    }
  }

  await saveDailyTasksData(data);
  return data;
}

/**
 * Claim task reward
 */
export async function claimTaskReward(taskId) {
  const data = await getDailyTasksData();

  if (!data.completed.includes(taskId) || data.claimed.includes(taskId)) {
    return { success: false, message: 'Task not completed or already claimed' };
  }

  const task = DAILY_TASKS.find(t => t.id === taskId);
  if (!task) {
    return { success: false, message: 'Task not found' };
  }

  data.claimed.push(taskId);
  await saveDailyTasksData(data);

  return {
    success: true,
    xp: task.xp,
    task,
  };
}

/**
 * Get total unclaimed XP
 */
export async function getUnclaimedXP() {
  const data = await getDailyTasksData();
  const unclaimedTasks = DAILY_TASKS.filter(
    t => data.completed.includes(t.id) && !data.claimed.includes(t.id)
  );
  return unclaimedTasks.reduce((sum, t) => sum + t.xp, 0);
}

/**
 * Get tasks summary for display
 */
export async function getTasksSummary() {
  const tasks = await getDailyTasksProgress();
  const completedCount = tasks.filter(t => t.isCompleted).length;
  const claimedCount = tasks.filter(t => t.isClaimed).length;
  const totalXP = tasks.filter(t => t.isCompleted && !t.isClaimed).reduce((sum, t) => sum + t.xp, 0);

  return {
    tasks,
    completedCount,
    claimedCount,
    totalXP,
    allClaimed: claimedCount === tasks.length,
  };
}