# Become Chinese — 海外上架 & ASO 可执行优化清单

> 来源审计：`app.json` · `eas.json` · `package.json` · `docs/STORE_LISTING.md` · `docs/PRIVACY_POLICY.md` · `docs/GLOBAL_APP_DEVELOPMENT_SPEC.md` · `src/**`
> 目标市场：欧洲、北美英语用户（Education / Travel & Local）
> 交付形式：按「P0 必须 / P1 应做 / P2 加分」分级，每条给出问题、改法、优先级理由。

---

## 一、上架硬性配置（App 侧）—— P0

### 1.1 iOS 缺少 `bundleIdentifier`（当前无法上架 App Store）
- **现状**：`app.json` 的 `ios` 段只有 `supportsTablet: true`，**没有 `bundleIdentifier`**。EAS 构建 iOS 版本会报错或使用随机 ID，无法通过 TestFlight / App Store。
- **改法**：在 `app.json` 的 `ios` 段补充，建议与 Android 包名语义对齐但独立取值：
  ```json
  "ios": {
    "supportsTablet": true,
    "bundleIdentifier": "com.becomechinese.atlas"
  }
  ```
  首次提交 App Store 后 bundle id **不可更改**，请在首构建前定死。
- **优先级理由**：缺此项则 iOS 完全无法上架，是最硬阻塞。

### 1.2 统一并清理应用标识符（Android `package`）
- **现状**：`android.package = "com.wx123.BecomeChineseApp"`。`wx123` 段无业务含义，`BecomeChineseApp` 含大写（Android 包名约定小写 + 下划线可选，大写不推荐但允许）。发布后不可改。
- **改法**：发布前定死并统一为受控包名，例如：
  - Android：`com.becomechinese.atlas`
  - iOS：`com.becomechinese.atlas`（与上一致，减小双端差异）
- **优先级理由**：包名/bundle id 一经发布不可更改，属于"一次性决定"类风险，越早定越省事。

### 1.3 Expo Go / dev build 痕迹清理
- **现状**：应用依赖 `@react-native-community/netinfo` 仅做离线检测（`src/utils/network.js`），代码中无真实联网请求、无广告 SDK、无分析 SDK、无定位/相机/麦克风权限。
- **改法**：上架前用 `expo prebuild` 生成 ios/android 原生工程并核对 Gradle / Info.plist：
  1. **清除无用的网络/敏感权限声明**——确认 AndroidManifest 不因依赖被注入不需要的权限声明（如 `INTERNET` 可保留，因离线检测需要；但如 `ACCESS_*`、`CAMERA`、`RECORD_AUDIO` 等必须无）。
  2. Android `edgeToEdgeEnabled` 已在配置中启用（符合 Google Play 目标 API 要求），确认 targetSdk 满足当季 Google Play 强制要求（Expo 54 默认较高，需复核）。
- **优先级理由**：权限欺诈是 Google Play 下架重灾区；应用实际完全离线，应把权限清单压到最小，这既能过审也符合隐私承诺。

### 1.4 隐私政策接入 & 商店「Data safety / 数据安全」表单
- **现状**：`docs/PRIVACY_POLICY.md` 内容准确（纯本地存储、无收集、无可共享），但：
  - 文档里写的支持邮箱/网址（`support@becomechinese.app`、`https://becomechinese.app`）需确认真实可用，否则商店联络人审核不通过。
  - 应用内**没有隐私政策展示入口**。
- **改法**：
  1. 在 Profile 或设置区加入「Privacy Policy」入口，打开站内或 web 页面。
  2. 商店后台填写：
     - Google Play → App content → Data safety：**不收集任何个人数据**（或仅设备不绑定的本地数据）。选择的收集项必须与该页相符。
     - App Store Connect → App Privacy：据实填"不收集数据"。
  3. 把隐私政策 URL 挂到可公开访问的域名（Play/App Store 都需要能抓取的公开链接）。
- **优先级理由**：隐私政策与数据安全声明与代码实际行为不符是审核退审/下架主因；此应用现状极易通过，务必把"不收集"声明填到位。

### 1.5 商店展示所需视觉资源核对（8 张截图）
- **现状**：`docs/STORE_LISTING.md` 列出了 8 张截图清单（Home / Explore / Dynasty detail / Food detail / Calendar / Profile / Journey / Share card）。未确认这些截图是否已产出（`assets/` 只有图标/分类图，无可直接复用的商店截图）。
- **改法**：
  - 按清单逐一产出 **至少 1242×2688 (iPhone) 与 1080×1920+ (Android)** 规格截图，要求为真实 UI，方向为 portrait。
  - 首屏 3 张决定转化，务必突出「Today's Discovery 卡片」「节气每日仪式」「分享卡」等差异化画面。
  - 不要用 `assets/cities|recipes|dynasties` 里的本地生成图充当 UI 截图（不符合上架截图要求，会退审）。
- **优先级理由**：图片是商店转化核心，也是上架必填项。

---

## 二、ASO 优化（商店内容）—— P1

### 2.1 标题 / 副标题 / 关键词抢占
- **现状**：`STORE_LISTING.md` 标题为 `Become Chinese - Cultural Atlas`，Short Description 80 字符内；关键词偏向泛文化（Chinese culture/history/food...）。
- **改法**：
  - **主标题**强化差异化 + 品类词：示例 `Become Chinese: Cultural Atlas`（保留品牌 + 品类词 "Cultural Atlas"）。
  - **副标题 30 字符**（iOS 有价值）：示例 `Cities, food & history guide`。
  - **关键词字段（iOS 100 字符，App Store）** 用栈式无空格策略，例如：`chinese culture,history,travel guide,cities,food,solar terms,dynasties,mandarin,customs,learning,atlas,discovery,china,heritage`。注意去重、去空格、覆盖中低频差异词。
  - **Short Description（Android 80 字符）**：把最高转化信号放最前，例如 `Explore China through cities, food, dynasties & daily rituals`（已有，可保留）。
- **优先级理由**：标题/关键词是 ASO 权重最大且零成本的部分，改一次长期受益。

### 2.2 Full Description 结构化为「功能 + 场景」
- **现状**：`STORE_LISTING.md` 的 Full Description 已是功能列表形式，可在留存率上再优化。
- **改法**：按「首段价值主张 → 分点功能 → 一次行动号召」三段式；把高差异功能提前（节气 Daily Ritual、Silk Road / Tang Poetry Trail 主题旅程、分享卡、Cultural Atlas 进度）。首段第 1–2 句决定用户是否继续阅读，避免泛泛的 "Anyone curious about Chinese culture"。
- **优先级理由**：描述转介绍率直接影响下载，几乎零成本，属高性价比优化。

### 2.3 商店分类 / IARC 分级复核
- **现状**：`STORE_LISTING.md` 主分类 Education、次 Travel & Local；IARC 自评为 Everyone(3+)，酒精条目以"历史教育语境"标注。
- **改法**：
  - 主分类保持 **Education**；若希望曝光更高，iOS 可主选 `Education` + 副选 `Travel`（App Store 会据此归入榜单）。
  - Google Play 的 IARC 问卷如实填写即可；页面含传统酒文化描述时，选"仅在历史/文化语境中提及"选项，最终级别通常仍是 Everyone 3+，无需预判为分级风险。
- **优先级理由**：分类影响榜单归属与曝光人群，属于低成本可调项。

### 2.4 本地化信任要素（开发者资质 / 联系方式）
- **现状**：`STORE_LISTING.md` 填写了开发者 `Become Chinese Team`、网址 `becomechinese.app`、邮箱 `support@becomechinese.app`。
- **改法**：确认这三个字段真实可访问；Google Play 个人开发者需在后台完成身份验证（VIC / 新版），Apple 需付费开发者账号，均须提前开通，避免临上架才处理账号审核周期。
- **优先级理由**：账号资质与域名/邮箱验证有审核排队时间，属关键路径前置项。

---

## 三、产品/合规加分项（P2）—— 与上架共存，提升留存与评分

### 3.1 评分/反馈引导（App Review / In-app review）
- 当前无评分引导。首版不要强求。
- 建议在「完成第 1 条旅程」这一自然成功时刻，接入 App Store `SKStoreReviewController` / Google `In-App Review`（Expo 可用 `expo-store-review` 或 `expo-rate`），仅在高价值时刻触发一次，且尊重系统限制。

### 3.2 埋点缺失（产品侧，不影响上架）
- 无任何分析 SDK。若需了解海外用户漏斗，可加隐私友好的**事件级、非绑定的**分析（firebase-analytics 需在数据安全表单声明）。**若坚持零收集定位，可完全跳过**——这反而是商店合规卖点。

### 3.3 应用商店待审核文案细节
- 提交前把 `Date added`、`Last updated`、版本说明（What's New）写实；首版 What's New 强调「完全离线、无账号、无广告」三点，直击用户疑虑。

---

## 四、发布前 Checklist（一张表）

| # | 事项 | 平台 | 级别 | 状态 |
|---|------|------|------|------|
| 1 | 补 iOS `bundleIdentifier` | iOS | P0 | ☐ |
| 2 | 定死并统一 Android package / iOS bundle id | 双端 | P0 | ☐ |
| 3 | 复核原生权限清单最小化（无相机/定位/麦克风） | 双端 | P0 | ☐ |
| 4 | 应用内加入 Privacy Policy 入口 | 双端 | P0 | ☐ |
| 5 | 完成 Google Play Data safety + App Store App Privacy 表单 | 双端 | P0 | ☐ |
| 6 | 公开可访问的隐私政策 URL | 双端 | P0 | ☐ |
| 7 | 按 8 张清单产出真实 UI 商店截图 | 双端 | P0 | ☐ |
| 8 | 优化标题/副标题/关键词字段 | 双端 | P1 | ☐ |
| 9 | Full Description 三段式重组 | 双端 | P1 | ☐ |
| 10 | 确认开发者账号资质 + 域名/邮箱验证 | 双端 | P1 | ☐ |
| 11 | 分类与 IARC 分级复核 | 双端 | P1 | ☐ |
| 12 | 接入评分引导（可选，自然完成时刻） | 双端 | P2 | ☐ |

---

## 五、审计备注（供后续复核）

- **网络**：仅 `@react-native-community/netinfo`，只做在线/离线检测，不传输个人数据 → 数据安全表单应勾选"无收集"。
- **无第三方 SDK**：无广告、无崩溃上报（除非后续加 Sentry）、无分析 → 权限与隐私清单天然干净，是合规一大卖点，建议在商店文案中强化。
- **仓库无 `fastlane`/`metadata` 目录**：`eas submit` 可担 Post-build 上传；如需多商店批量发布可后续引入 fastlane。
- **`.github/` 存在**：与 CI 相关，但上架非必需，可后续用于自动化 EAS 构建。
