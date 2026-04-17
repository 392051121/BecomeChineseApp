const SOLAR_TERMS = [
  { key: 'minor-cold', nameEn: 'Minor Cold', nameZh: '小寒', month: 1, day: 5, meaningEn: 'Cold grows but spring is still hidden.' },
  { key: 'major-cold', nameEn: 'Major Cold', nameZh: '大寒', month: 1, day: 20, meaningEn: 'Deep winter reaches its quiet peak.' },
  { key: 'start-of-spring', nameEn: 'Start of Spring', nameZh: '立春', month: 2, day: 4, meaningEn: 'Life begins to stir beneath the soil.' },
  { key: 'rain-water', nameEn: 'Rain Water', nameZh: '雨水', month: 2, day: 19, meaningEn: 'Snow turns to rain and nourishes fields.' },
  { key: 'insects-awaken', nameEn: 'Awakening of Insects', nameZh: '惊蛰', month: 3, day: 6, meaningEn: 'Thunder wakes insects and spring energy rises.' },
  { key: 'spring-equinox', nameEn: 'Spring Equinox', nameZh: '春分', month: 3, day: 21, meaningEn: 'Day and night meet in perfect balance.' },
  { key: 'pure-brightness', nameEn: 'Pure Brightness', nameZh: '清明', month: 4, day: 5, meaningEn: 'Clear skies and tender green invite remembrance.' },
  { key: 'grain-rain', nameEn: 'Grain Rain', nameZh: '谷雨', month: 4, day: 20, meaningEn: 'Rain feeds grain and spring reaches fullness.' },
  { key: 'start-of-summer', nameEn: 'Start of Summer', nameZh: '立夏', month: 5, day: 6, meaningEn: 'Warmth rises and summer opens gently.' },
  { key: 'grain-buds', nameEn: 'Grain Buds', nameZh: '小满', month: 5, day: 21, meaningEn: 'Kernels swell; growth is visible but incomplete.' },
  { key: 'grain-in-ear', nameEn: 'Grain in Ear', nameZh: '芒种', month: 6, day: 6, meaningEn: 'A season for sowing and racing the rain.' },
  { key: 'summer-solstice', nameEn: 'Summer Solstice', nameZh: '夏至', month: 6, day: 21, meaningEn: 'The longest day glows at full strength.' },
  { key: 'minor-heat', nameEn: 'Minor Heat', nameZh: '小暑', month: 7, day: 7, meaningEn: 'Summer heat gathers with humid breath.' },
  { key: 'major-heat', nameEn: 'Major Heat', nameZh: '大暑', month: 7, day: 23, meaningEn: 'The hottest days demand patience and shade.' },
  { key: 'start-of-autumn', nameEn: 'Start of Autumn', nameZh: '立秋', month: 8, day: 8, meaningEn: 'Autumn arrives though warmth still lingers.' },
  { key: 'limit-of-heat', nameEn: 'Limit of Heat', nameZh: '处暑', month: 8, day: 23, meaningEn: 'Heat withdraws and evenings turn cooler.' },
  { key: 'white-dew', nameEn: 'White Dew', nameZh: '白露', month: 9, day: 8, meaningEn: 'Morning dew appears like pale pearls.' },
  { key: 'autumn-equinox', nameEn: 'Autumn Equinox', nameZh: '秋分', month: 9, day: 23, meaningEn: 'Light and dark balance before late harvest.' },
  { key: 'cold-dew', nameEn: 'Cold Dew', nameZh: '寒露', month: 10, day: 8, meaningEn: 'Dew cools, hinting at approaching frost.' },
  { key: 'frost-descent', nameEn: 'Frost Descent', nameZh: '霜降', month: 10, day: 23, meaningEn: 'Frost appears; fields prepare for rest.' },
  { key: 'start-of-winter', nameEn: 'Start of Winter', nameZh: '立冬', month: 11, day: 7, meaningEn: 'The season turns inward toward quiet warmth.' },
  { key: 'minor-snow', nameEn: 'Minor Snow', nameZh: '小雪', month: 11, day: 22, meaningEn: 'Light snow hints at deep winter ahead.' },
  { key: 'major-snow', nameEn: 'Major Snow', nameZh: '大雪', month: 12, day: 7, meaningEn: 'Heavy snow marks the depth of winter rhythm.' },
  { key: 'winter-solstice', nameEn: 'Winter Solstice', nameZh: '冬至', month: 12, day: 21, meaningEn: 'The longest night births returning light.' },
];

function toComparable(month, day) {
  return month * 100 + day;
}

export function getSolarTermForDate(date = new Date()) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const current = toComparable(month, day);

  let picked = SOLAR_TERMS[SOLAR_TERMS.length - 1];
  for (let i = 0; i < SOLAR_TERMS.length; i += 1) {
    const term = SOLAR_TERMS[i];
    if (current >= toComparable(term.month, term.day)) picked = term;
    else break;
  }
  return picked;
}

