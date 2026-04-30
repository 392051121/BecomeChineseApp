/**
 * Image Download Helper Script
 *
 * This script helps you download images for cities and recipes.
 * Run: node scripts/download-images.js
 *
 * Prerequisites:
 * - Node.js installed
 * - Internet connection
 *
 * Usage:
 * 1. Review the image URLs below
 * 2. Run the script to download images to assets/cities/ and assets/recipes/
 * 3. After downloading, run: npm run gen:images
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Free image sources for Chinese cities and food
// These are placeholder URLs - replace with actual image URLs or use your own images

const CITY_IMAGES = {
  // Cities with existing local images (20 cities already have images)
  // These are additional cities that need images
  'dunhuang': {
    url: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800',
    keywords: 'Dunhuang, Mogao Caves, desert, Silk Road, China'
  },
  'zhangjiajie': {
    url: 'https://images.unsplash.com/photo-1513415756790-2ac1db1297d0?w=800',
    keywords: 'Zhangjiajie, Avatar mountains, sandstone pillars, China'
  },
  'jiuzhaigou': {
    url: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800',
    keywords: 'Jiuzhaigou, colorful lakes, waterfalls, China'
  },
  'huangshan': {
    url: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800',
    keywords: 'Huangshan, Yellow Mountain, granite peaks, China'
  },
  'sanya': {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    keywords: 'Sanya, tropical beach, Hainan, China'
  },
  'pingyao': {
    url: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800',
    keywords: 'Pingyao, ancient city, walled city, Ming Dynasty, China'
  },
  'luoyang': {
    url: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800',
    keywords: 'Luoyang, Longmen Grottoes, ancient capital, China'
  },
  'kaifeng': {
    url: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800',
    keywords: 'Kaifeng, Northern Song capital, China'
  },
  'datong': {
    url: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800',
    keywords: 'Datong, Yungang Grottoes, Northern Wei, China'
  },
  'yangshuo': {
    url: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800',
    keywords: 'Yangshuo, karst mountains, Li River, China'
  },
  'fenghuang': {
    url: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800',
    keywords: 'Fenghuang, ancient town, Miao culture, China'
  },
  'wuzhen': {
    url: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800',
    keywords: 'Wuzhen, water town, canals, China'
  },
  'zhouzhuang': {
    url: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800',
    keywords: 'Zhouzhuang, water town, ancient bridges, China'
  },
  'xitang': {
    url: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800',
    keywords: 'Xitang, water town, covered corridors, China'
  },
  'tongli': {
    url: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800',
    keywords: 'Tongli, water town, gardens, China'
  },
  'dali': {
    url: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800',
    keywords: 'Dali, Erhai Lake, Bai culture, Yunnan, China'
  },
  'shangri-la': {
    url: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800',
    keywords: 'Shangri-La, Tibetan town, Songzanlin, China'
  },
  'xishuangbanna': {
    url: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800',
    keywords: 'Xishuangbanna, tropical rainforest, Dai culture, China'
  },
};

const RECIPE_IMAGES = {
  // Sichuan Cuisine
  'kung-pao-chicken': {
    url: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800',
    keywords: 'Kung Pao Chicken, 宫保鸡丁, Sichuan, spicy, peanuts'
  },
  'mapo-tofu': {
    url: 'https://images.unsplash.com/photo-1582576163090-09d3b6f8a969?w=800',
    keywords: 'Mapo Tofu, 麻婆豆腐, Sichuan, tofu, spicy'
  },
  'hot-pot': {
    url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800',
    keywords: 'Chinese hot pot, 火锅, Sichuan, communal dining'
  },
  'dan-dan-noodles': {
    url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
    keywords: 'Dan Dan Noodles, 担担面, Sichuan, spicy noodles'
  },

  // Cantonese
  'sweet-sour-pork': {
    url: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800',
    keywords: 'Sweet and Sour Pork, 咕噜肉, Cantonese, glazed pork'
  },
  'char-siu': {
    url: 'https://images.unsplash.com/photo-1623689046286-01c8af040127?w=800',
    keywords: 'Char Siu, 叉烧, Cantonese, BBQ pork'
  },
  'dim-sum': {
    url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800',
    keywords: 'Dim Sum, 点心, Cantonese, steamed dumplings'
  },
  'shrimp-dumplings': {
    url: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800',
    keywords: 'Har Gow, 虾饺, shrimp dumplings, Cantonese'
  },
  'siu-mai': {
    url: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800',
    keywords: 'Siu Mai, 烧卖, pork dumplings, Cantonese'
  },
  'wonton-soup': {
    url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
    keywords: 'Wonton Soup, 云吞汤, Cantonese, clear broth'
  },

  // Shanghai / Jiangnan
  'xiaolongbao': {
    url: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800',
    keywords: 'Xiaolongbao, 小笼包, Shanghai, soup dumplings'
  },
  'braised-pork': {
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
    keywords: 'Braised Pork Belly, 红烧肉, Shanghai, pork'
  },
  'dongpo-pork': {
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
    keywords: 'Dongpo Pork, 东坡肉, Hangzhou, braised pork'
  },

  // Beijing / Northern
  'peking-duck': {
    url: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=800',
    keywords: 'Peking Duck, 北京烤鸭, Beijing, roasted duck'
  },
  'dumplings': {
    url: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800',
    keywords: 'Chinese Dumplings, 饺子, Northern, New Year'
  },
  'zhajiang-noodles': {
    url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
    keywords: 'Zhajiang Noodles, 炸酱面, Beijing, soybean paste'
  },

  // General
  'fried-rice': {
    url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800',
    keywords: 'Fried Rice, 炒饭, Chinese, egg fried rice'
  },
  'scrambled-eggs-tomatoes': {
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    keywords: 'Tomato Egg, 番茄炒蛋, Chinese home cooking'
  },
  'congee': {
    url: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=800',
    keywords: 'Congee, 粥, Chinese porridge, breakfast'
  },

  // Festival Foods
  'mooncake': {
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    keywords: 'Mooncake, 月饼, Mid-Autumn Festival, Chinese pastry'
  },
  'zongzi': {
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    keywords: 'Zongzi, 粽子, Dragon Boat Festival, sticky rice'
  },
  'tangyuan': {
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    keywords: 'Tangyuan, 汤圆, Lantern Festival, glutinous rice balls'
  },

  // Desserts
  'egg-tarts': {
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    keywords: 'Egg Tart, 蛋挞, Hong Kong, Portuguese influence'
  },
  'mango-pudding': {
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    keywords: 'Mango Pudding, 芒果布丁, Hong Kong dessert'
  },
};

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const dir = path.dirname(filepath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const file = fs.createWriteStream(filepath);
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirect
        downloadImage(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✓ Downloaded: ${path.basename(filepath)}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      console.log(`✗ Failed: ${path.basename(filepath)} - ${err.message}`);
      resolve(); // Continue with other downloads
    });
  });
}

async function main() {
  console.log('=== Image Download Helper ===\n');

  console.log('Note: This script provides placeholder URLs.');
  console.log('For best results, download authentic images from:');
  console.log('  - Unsplash: https://unsplash.com');
  console.log('  - Pexels: https://pexels.com');
  console.log('  - Wikimedia Commons: https://commons.wikimedia.org\n');

  const assetsDir = path.join(__dirname, '..', 'assets');

  // Download city images
  console.log('Downloading city images...');
  for (const [id, info] of Object.entries(CITY_IMAGES)) {
    const filepath = path.join(assetsDir, 'cities', `${id}.jpg`);
    if (!fs.existsSync(filepath)) {
      await downloadImage(info.url, filepath);
    } else {
      console.log(`  Skipping ${id}.jpg (already exists)`);
    }
  }

  // Download recipe images
  console.log('\nDownloading recipe images...');
  for (const [id, info] of Object.entries(RECIPE_IMAGES)) {
    const filepath = path.join(assetsDir, 'recipes', `${id}.jpg`);
    if (!fs.existsSync(filepath)) {
      await downloadImage(info.url, filepath);
    } else {
      console.log(`  Skipping ${id}.jpg (already exists)`);
    }
  }

  console.log('\n=== Download Complete ===');
  console.log('\nNext steps:');
  console.log('1. Review downloaded images in assets/cities/ and assets/recipes/');
  console.log('2. Replace any placeholder images with authentic Chinese food/city photos');
  console.log('3. Run: npm run gen:images');
}

main().catch(console.error);
