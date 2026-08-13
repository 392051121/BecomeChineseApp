/**
 * Canonical province ids used by chinaGeo.json / maps (Title Case English).
 * Includes common aliases and lowercase slug forms from older storage.
 */
const PROVINCE_ID_ALIASES = {
  heilongjiang: 'Heilongjiang',
  jilin: 'Jilin',
  liaoning: 'Liaoning',
  innermongolia: 'Inner Mongolia',
  'inner mongolia': 'Inner Mongolia',
  neimenggu: 'Inner Mongolia',
  beijing: 'Beijing',
  tianjin: 'Tianjin',
  hebei: 'Hebei',
  shanxi: 'Shanxi',
  shaanxi: 'Shaanxi',
  ningxia: 'Ningxia',
  gansu: 'Gansu',
  qinghai: 'Qinghai',
  xinjiang: 'Xinjiang',
  tibet: 'Tibet',
  xizang: 'Tibet',
  sichuan: 'Sichuan',
  chongqing: 'Chongqing',
  yunnan: 'Yunnan',
  guizhou: 'Guizhou',
  guangxi: 'Guangxi',
  hainan: 'Hainan',
  guangdong: 'Guangdong',
  hongkong: 'Hong Kong',
  'hong kong': 'Hong Kong',
  xianggang: 'Hong Kong',
  macau: 'Macau',
  macao: 'Macau',
  aomen: 'Macau',
  fujian: 'Fujian',
  taiwan: 'Taiwan',
  jiangxi: 'Jiangxi',
  hunan: 'Hunan',
  hubei: 'Hubei',
  henan: 'Henan',
  shandong: 'Shandong',
  jiangsu: 'Jiangsu',
  anhui: 'Anhui',
  zhejiang: 'Zhejiang',
  shanghai: 'Shanghai',
};

const KNOWN_PROVINCE_IDS = new Set(Object.values(PROVINCE_ID_ALIASES));

/**
 * Normalize any province-like value to a chinaGeo id, or null if unusable.
 * Handles Title Case ids, lowercase slugs, and display labels like
 * "Guangdong / Guangdong" or "Chengdu / Sichuan".
 */
export function normalizeProvinceId(raw) {
  if (raw == null) return null;
  const value = String(raw).trim();
  if (!value || value === 'General') return null;

  // Display strings like "City / Province" — prefer rightmost usable token
  if (value.includes('/')) {
    const parts = value.split('/').map((p) => p.trim()).filter(Boolean);
    for (let i = parts.length - 1; i >= 0; i -= 1) {
      const hit = normalizeProvinceId(parts[i]);
      if (hit) return hit;
    }
    return null;
  }

  const lower = value.toLowerCase();
  if (PROVINCE_ID_ALIASES[lower]) return PROVINCE_ID_ALIASES[lower];

  const compacted = lower.replace(/\s+/g, '');
  if (PROVINCE_ID_ALIASES[compacted]) return PROVINCE_ID_ALIASES[compacted];

  if (KNOWN_PROVINCE_IDS.has(value)) return value;

  return null;
}

/**
 * Extract and normalize province id from a content item.
 * Prefers machine fields (province_id / provinceId) over display `province`.
 */
export function getProvinceId(item) {
  if (!item || typeof item !== 'object') return null;
  const candidates = [
    item.province_id,
    item.provinceId,
    item.province,
    item.regionId,
  ];
  for (const c of candidates) {
    const normalized = normalizeProvinceId(c);
    if (normalized) return normalized;
  }
  return null;
}

export const PROVINCE_GEO_IDS = [...KNOWN_PROVINCE_IDS];
