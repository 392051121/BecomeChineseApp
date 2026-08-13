# Become Chinese — 上架准备状态对照表

> 生成时间：2026-08-13
> 对照基准：`docs/OVERSEAS_RELEASE_CHECKLIST.md`
> 目标：App Store（iOS）+ Google Play（Android），欧洲/北美英语用户

---

## 一、代码侧已完成 ✅（无需再动）

| # | 事项 | 状态 | 说明 |
|---|------|------|------|
| 1 | iOS `bundleIdentifier` | ✅ | `com.becomechinese.atlas` |
| 2 | Android `package` 统一 | ✅ | `com.becomechinese.atlas`（已从 `com.wx123.BecomeChineseApp` 改定） |
| 3 | iOS `buildNumber` / Android `versionCode` | ✅ | 均为 1，版本 1.0.0 |
| 4 | 应用内 Privacy Policy 入口 | ✅ | Profile → Privacy Policy（`PrivacyPolicyScreen`） |
| 5 | 公开可访问隐私政策 URL | ✅ | `https://392051121.github.io/BecomeChineseApp/privacy.html` |
| 6 | `privacyPolicyUrl` / `supportUrl` 回填 app.json | ✅ | 已写入 |
| 7 | 权限清单最小化 | ✅ | 仅 `INTERNET` + `ACCESS_NETWORK_STATE`（离线检测）+ `POST_NOTIFICATIONS`（通知）；无相机/定位/麦克风/录音 |
| 8 | Android 通知图标 | ✅ | `assets/notification-icon.png`（纯白几何「日出/节气」图形），已接入 expo-notifications |
| 9 | iOS 非豁免加密声明 | ✅ | `ITSAppUsesNonExemptEncryption: false`，跳过加密审查问卷 |
| 10 | 商店描述（description） | ✅ | app.json 已补英文描述 |
| 11 | 中文字体子集化 | ✅ | 思源宋体 1649 字，各约 600KB，避免商店字体版权风险 |

---

## 二、需要你在商店后台手动填写 ✍️（代码无法代劳）

| # | 事项 | 平台 | 操作位置 |
|---|------|------|----------|
| 1 | **Data safety 表单** | Google Play | Console → App content → Data safety：勾选「不收集/不共享任何数据」 |
| 2 | **App Privacy 表单** | App Store | App Store Connect → App Privacy：据实填「不收集数据」 |
| 3 | **IARC 内容分级问卷** | Google Play | 如实填写，酒精条目选「仅在历史/文化语境提及」，预期 Everyone 3+ |
| 4 | **分类选择** | 双端 | 主 `Education`，副 `Travel & Local`（iOS 副选 `Travel`） |
| 5 | **隐私政策 URL** | 双端 | 粘贴 `https://392051121.github.io/BecomeChineseApp/privacy.html` |
| 6 | **商店截图** | 双端 | 见下方第三节（关键待办） |
| 7 | **开发者账号资质** | 双端 | Google 需身份验证（VIC），Apple 需付费开发者账号（$99/年），提前开通 |
| 8 | **联系邮箱/网址** | 双端 | ✅ `392051121@qq.com`，网址 `https://392051121.github.io/BecomeChineseApp/` |

---

## 三、关键待办 ⚠️（最高优先级，尚未完成）

### 3.1 商店截图（8 张，真实 UI，非合成图）

> 这是目前唯一**尚未产出**的硬性交付物。

**规格要求：**
- iOS：1242 × 2688（iPhone 6.7"）或 1170 × 2532
- Android：1080 × 1920 以上，portrait

**建议 8 张清单（按转化优先级排序）：**
1. Today's Discovery（今日发现卡片）— 首图，突出差异化
2. 节气每日仪式（Daily Ritual）
3. 探索地图（Explore Map）
4. 城市详情（City detail）
5. 美食/食谱（Recipes）
6. 朝代历史时间轴（Dynasties）
7. 中文名生成器 + 身份卡（Identity / Name）
8. 收集进度 + 分享卡（Collection / Share card）

⚠️ 截图必须是**真机或模拟器实时运行的真实 UI**，不能用 `assets/cities|recipes|dynasties` 里的素材图冒充。

### 3.2 联系邮箱/网址确认 ✅

已统一为真实邮箱 `392051121@qq.com`，网址 `https://392051121.github.io/BecomeChineseApp/`。已同步更新 `STORE_LISTING.md`、`PRIVACY_POLICY.md`、`privacy.html`。

---

## 四、可选的 P1/P2 优化（不阻塞上架）

| # | 事项 | 级别 | 说明 |
|---|------|------|------|
| 1 | 标题/副标题/关键词 ASO 优化 | P1 | 主标题 `Become Chinese: Cultural Atlas`，iOS 副标题 `Cities, food & history guide`，关键词栈式去空格 |
| 2 | Full Description 三段式重组 | P1 | 价值主张 → 分点功能 → 行动号召 |
| 3 | 评分引导 | P2 | 完成第 1 条旅程时接 `expo-store-review` / In-App Review |
| 4 | What's New 文案 | P2 | 首版强调「完全离线、无账号、无广告」 |

---

## 五、本次（本轮）已完成的 Git 提交

| Commit | 内容 |
|--------|------|
| `caeca34` | 添加商店隐私政策页 + 补齐商店元信息 |
| `f75cfbf` | 中文字体子集化 + 每日节气推送 + UI 优化 |
| `387744c` | 回填隐私政策与支持 URL |
| （待提交） | Android 通知图标 + 权限核对 |

---

## 六、下一步建议

1. **立即**：产出 8 张商店截图（最硬的阻塞项）
2. **后台**：开通 Apple 付费开发者账号 + Google 身份验证（有审核排队，尽早）
3. **提交**：上架时把 Data safety / App Privacy / IARC / 隐私 URL 逐一填好

---

> 说明：截图产出需要你在模拟器/真机上运行 App 并逐屏截取。我可以帮你生成一份「逐屏截图拍摄脚本/指引」（含每屏的进入路径和要突出的重点），但实际截图画面需要你运行 App 后拍摄。
