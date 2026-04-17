const fs = require('fs');
const path = require('path');

const { cities } = require('../src/data/cities');
const { recipes } = require('../src/data/recipes');
const { dynasties } = require('../src/data/dynasties');

function toPromptRow(item, type) {
  return {
    type,
    id: item.id,
    name: item.nameEn ?? item.name_en ?? item.nameEn ?? item.nameCn ?? item.name_cn ?? item.name ?? item.id,
    province: item.province ?? 'General',
    imagePrompt: item.imagePrompt ?? '',
    imageAsset: item.imageAsset ?? '',
  };
}

const rows = [
  ...cities.map((item) => toPromptRow(item, 'city')),
  ...recipes.map((item) => toPromptRow(item, 'recipe')),
  ...dynasties.map((item) => toPromptRow(item, 'dynasty')),
];

const outPath = path.join(__dirname, '..', 'image-prompts.json');
fs.writeFileSync(outPath, JSON.stringify(rows, null, 2), 'utf8');
console.log(`Wrote ${rows.length} image prompts to ${outPath}`);
