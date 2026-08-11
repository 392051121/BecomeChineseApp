/**
 * Lunar calendar display utilities.
 *
 * Provides Chinese-lunar-style date display helpers. Production screens do not
 * currently depend on a full lunar calendar algorithm; this module exposes the
 * date display + season derivation helpers that CalendarScreen and tests expect.
 */
import { getSolarTermForDate } from './calendar';

const MONTH_CN = ['', '正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];

const DAY_CN = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十',
];

/**
 * Derive a Chinese-lunar-style date display for the given date.
 * Uses a lightweight approximation based on the solar date when a precise
 * lunar lookup table is not available.
 * @param {Date} [date]
 * @returns {{ monthChinese: string, dayChinese: string, formatted: string }}
 */
export function getLunarDateDisplay(date = new Date()) {
  // Best-effort approximation: map solar month/day onto the lunar-style labels.
  // Replaced by a precise algorithm if a lunar conversion table is added later.
  const monthCN = MONTH_CN[date.getMonth() + 1] || '';
  const dayIndex = Math.min(DAY_CN.length - 1, Math.max(0, date.getDate() - 1));
  const dayCN = DAY_CN[dayIndex];
  return {
    monthChinese: monthCN,
    dayChinese: dayCN,
    formatted: `农历${monthCN}${dayCN}`,
  };
}

/**
 * Derive the season for a date based on the nearest solar term.
 * @param {Date} [date]
 * @returns {string} one of: spring | summer | autumn | winter
 */
export function getSeasonForDate(date = new Date()) {
  const term = getSolarTermForDate(date);
  if (!term) return 'spring';
  const key = term.key || '';
  if (/summer|heat/.test(key)) return 'summer';
  if (/autumn|dew|frost/.test(key)) return 'autumn';
  if (/winter|snow|solstice/.test(key)) return 'winter';
  return 'spring';
}

export default { getLunarDateDisplay, getSeasonForDate };
