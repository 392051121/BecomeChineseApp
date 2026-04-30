第一部分：项目愿景与产品哲学 (Vision & Core Philosophy)
目标人群：面向欧美市场喜欢中国文化的人，app以英文为主，必要时候中英对照。
不可突破底线：弘扬中国文化，不能出现日韩等泛东亚内容，不能抹黑污蔑中国
1.1 产品定义：定位为“数字文化画报”，而非工具书。
1.1.1 从“百科全书”到“策展空间”的维度跃迁
传统的文化类 App 往往陷入“词条罗列”的陷阱（如维基百科模式），导致用户在面对海量信息时产生疲劳感。BecomeChineseApp 的核心定义是策展 (Curation) 而非存储 (Storage)。

非线性叙事：App 不是教材，不要求用户从“夏朝”读到“清朝”。它是一个“文化版图”，用户可以从任何一个点（一道菜、一个节气、一个名字）切入，通过内在的逻辑关联（如：从西红柿炒蛋关联到其起源地，再关联到该地的历史）完成自发的探索。

情绪价值优先：每一屏的设计目标不是为了让用户“记住知识”，而是为了让用户发出“It’s beautiful”或“It’s interesting”的感叹。通过视觉的极致打磨，将“学习”转化为“审美体验”。

1.1.2 核心业务定位：英语母语者的中国文化第一触点
App 的第一语言必须是自然的、具有文学质感的英语。

去除机翻感：文案应模仿《The New Yorker》或《National Geographic》的调性。例如，描述唐朝时，不使用“Tang Dynasty was powerful”，而使用“Tang: The Cosmopolitan Pulse of the Silk Road”。

中英双语的共生关系：中文不是翻译，而是“视觉图腾”和“文化锚点”。中文的存在是为了提供仪式感和原始的美学价值，而英语负责传达深层的意义。

1.1.3 产品形态：轻量化、持久化、离线优先
Local-First 策略：所有核心文化内容均内置于本地 JSON/JS 模块中。这保证了极速的响应时间（零延迟加载）和离线可用的可靠性，符合“画报”这种随时翻阅的产品特质。

低频但高粘性：不追求用户每天停留数小时，但追求用户在每个关键节点（如节气变换、想要起中文名、或在餐馆看到某道菜时）都能第一时间想到打开它。

1.1.4 核心功能逻辑模型：身份认同循环
产品定义的核心是一个**“闭环增长模型”**：

Exploration (探索)：用户在画报中发现感兴趣的内容（如：西安）。

Interaction (交互)：通过“Favorite”或“Daily Quiz”产生交互行为。

Achievement (成就)：后台逻辑自动更新用户的“Connection Map”（点亮陕西省）并颁发“Silk Road”印章。

Identity (身份)：这些成就最终汇聚在“Persona”页面，形成用户独有的“Chinese Identity”，从而驱动下一轮探索。

1.1.5
在执行此部分开发时，AI 必须遵循以下逻辑优先级：

视觉重于效率：如果一个功能很快但很丑，它是失败的。

故事重于事实：在数据填充时，必须包含 culturalStory 字段，用故事来承载事实。

连接重于孤立：每个实体（Food/City/Dynasty）必须通过 province_id 实现互联。



1.2 核心设计哲学：新中式极简（Neo-Zen）、平行史观、数字身份成长。
1.2.1 新中式极简主义 (Neo-Chinese Minimalism / "Editorial Zen")
传统的中国元素应用往往容易陷入“过度堆砌”或“廉价红绿配”的误区。我们的哲学是取其意而不流于形：

计白当黑 (Space as Substance)：在 UI 布局中，留白（Negative Space）不是缺失，而是内容的一部分。通过增加行高（1.6x）和元素间距，模拟中国书画中“疏可走马”的空灵感，减少用户的认知负荷。

材质叙事 (Material Storytelling)：背景不仅是颜色，而是“宣纸”。通过微弱的纹理（Grain/Texture）和纸白色（Paper White），让用户产生在翻阅实体画报的错觉，从而在心理上进入一种“慢下来”的阅读状态。

克制的用色 (Restrained Palette)：以墨黑和纸白为主基调，将朱砂红定位为“权力颜色”。只有在产生连接、达成成就或极其关键的提示时才动用红色，确保每一处红色的出现都能产生强烈的视觉冲击力和心理获得感。

1.2.2 平行史观与跨文化共振 (Parallel History & Cultural Resonance)
为了消除跨文化传播中的“陌生感”，应用核心采用坐标参考法：

去孤立化 (Contextualization)：中国历史不应作为孤岛存在。在介绍任何朝代或文化节点时，必须提供同时期的全球视野（如：唐朝盛世与阿拉伯帝国的崛起并列）。通过这种“时空镜像”，帮助欧美用户在已有的历史知识库中为中国文化找到精准的定位锚点。

叙事而非陈述 (Narrative over Statement)：拒绝说明书式的文字。在介绍美食或城市时，侧重于“人”的维度——谁创造了它？人们在什么场景下享受它？它对现代生活还有什么遗赠？

1.2.3 参与式身份构建 (Participatory Identity Construction)
App 的最终目的不是让用户了解中国，而是让用户获得一个中国身份。

行为即足迹 (Action as Footprint)：用户的每一次交互（Favorite 一个城市、完成一个节气挑战）都会被量化为“Cultural Capital”。

数字化化身 (Digital Avatar)：个人中心页面（Persona）不仅是设置页，更是一个动态生长的“数字祭坛”。地图的点亮、徽章的增加、中文名的确立，都是用户在数字世界中“成为中国人（Become Chinese）”的过程。这种博弈论中的“收集奖励机制”是驱动用户深度探索的底层动力。

1.3 给编程 AI 的逻辑注入 (Mental Model for AI Implementation)
本段内容作为 AI 执行的最高原则，请确保 Cursor 等工具在开发时遵循以下思维逻辑：

[CRITICAL LOGIC INJECTION]
视觉审美 > 开发效率：如果一个组件的交互（如卷轴拉开）会增加开发难度，但能显著提升“中式仪式感”，则必须执行。严禁使用标准的 iOS/Android 默认转场效果。

内容完整性 > 功能多样性：宁可只有 10 个精美的朝代词条，也不要 50 个只有干巴巴文字的词条。每个 Data Entry 必须包含 worldParallel（世界同步）和 culturalStory（文化故事）字段。

强关联逻辑 (Strict Linking)：所有的内容实体（Food, City, Dynasty）必须且只能通过 province_id 实现数据互联。这是实现“中国关系地图”点亮功能的唯一合法路径。

仪式感反馈 (Ritual Feedback)：任何涉及成就的操作（如答题正确、收藏成功）必须触发“印章盖章（Stamp）”动画和“触觉震动（Haptics）”。没有反馈的操作被视为“无效操作”。

离线优先 (Offline First)：所有核心文化资产必须硬编码在 src/data 的 JSON 中，严禁在核心浏览流程中依赖实时 API，以保证画报式的秒开体验。


1.3 目标受众分析：欧美文化探索者、双语学习者。
1.3.1 离线优先的本地化架构 (Local-First Architecture)
为了模拟“实体画报”的翻阅体验，App 必须消除任何形式的加载延迟。

零延迟交互：所有核心文化数据（朝代史、城市百科、美食故事、起名库）均作为静态资源硬编码在 src/data 目录中。这意味着用户在深山、飞机或地铁等无网络环境下，依然能流畅阅读。

轻量级存储：利用 AsyncStorage 记录用户个性化的“文化足迹”，确保应用在不依赖后端服务器的情况下，仍能实现跨会话的数据持久化。

性能预期：App 启动时间需控制在 1.5 秒内，页面切换响应时间需小于 100 毫秒，以维持其“Quiet (宁静)”的产品调性。

1.3.2 英语首发的多层语境 (English-First Multi-Layering)
App 的首要任务是服务于非中文母语者，特别是欧美地区的文化探索者。

英语为主，中文为辅：英语负责传递知识、逻辑与叙事；中文则作为一种“美学图腾”和“原始凭证”存在。

拼音引导：在关键的文化概念（如节气、菜名、古建筑）旁必须标注拼音，这不仅是为了教学，更是为了赋予用户“阅读原始文明”的权力感。

翻译哲学：拒绝学术化、僵硬的直译，倾向于使用具有文学美感和文化对等性的表达。例如，将“清明”翻译为 Pure Brightness。

1.3.3 受众画像与需求匹配 (Target Audience & Needs)
深度旅行者：他们不满足于打卡，更希望理解城市背后的“Local Vibe (当地烟火气)”和“Insider Tips”。

文化爱好者：对中国历史感兴趣，但需要“World Parallel (世界史同步)”作为理解的坐标系。

数字游民与学生：需要一个美观、轻量且具有互动成就感的“文化伴侣”，用于在碎片时间点亮他们的“中国地图”。

1.4 给编程 AI 的逻辑注入 (Mental Model for AI Implementation)
本段内容作为 AI 执行的最高原则，请确保 Cursor 等工具在开发时遵循以下思维逻辑：

[CRITICAL LOGIC INJECTION]
视觉审美 > 开发效率：如果一个组件的交互（如卷轴拉开）会增加开发难度，但能显著提升“中式仪式感”，则必须执行。严禁使用标准的 iOS/Android 默认转场效果。

内容完整性 > 功能多样性：宁可只有 10 个精美的朝代词条，也不要 50 个只有干巴巴文字的词条。每个 Data Entry 必须包含 worldParallel（世界同步）和 culturalStory（文化故事）字段。

强关联逻辑 (Strict Linking)：所有的内容实体（Food, City, Dynasty）必须且只能通过 province_id 实现数据互联。这是实现“中国关系地图”点亮功能的唯一合法路径。

仪式感反馈 (Ritual Feedback)：任何涉及成就的操作（如答题正确、收藏成功）必须触发“印章盖章（Stamp）”动画和“触觉震动（Haptics）”。没有反馈的操作被视为“无效操作”。

离线优先 (Offline First)：所有核心文化资产必须硬编码在 src/data 的 JSON 中，严禁在核心浏览流程中依赖实时 API，以保证画报式的秒开体验。


第二部分：全局视觉识别系统 (Visual Identity System - VIS)
2.1 材质层：纸本感设计规范 (The Materiality: Silk & Paper)
为了达成“数字画报”的审美目标，App 的背景不应是平面、单一的颜色，而应具备物理上的颗粒感和历史的厚度感。

2.1.1 核心背景色：宣纸白 (The Paper Foundation)
HEX 定义：#FDFBF7 (或根据调色需求微调至 #FAF8F3)。

设计意图：纯白色 (#FFFFFF) 在移动端屏幕上过于刺眼且具有明显的现代电子工业感。宣纸白模仿了未经过度漂白的自然纤维色泽，能显著降低视觉疲劳，为用户营造一种宁静、沉浸的阅读氛围。

代码实现规范：在全局 Theme 对象中定义 colors.background，确保所有 Screen 容器默认继承此色值。

2.1.2 物理纹理叠加：噪点与纤维 (Noise & Texture Overlay)
纹理策略：通过在根容器（Root View）之上叠加一层极低透明度的纹理图来打破像素的平滑度。

资源要求：一张 1024x1024 或更高分辨率的高斯噪声图（Grain Texture）或浅色宣纸纤维底纹。

样式参数：

Opacity：严格控制在 0.02 至 0.04 之间。

Mix Mode：推荐使用 multiply (正片叠底) 或直接透明叠加。

Repeat：图片需设置为 repeat 模式以覆盖整个屏幕。

心理暗示：这种微弱的纹理能引导大脑将屏幕识别为“实体表面”而非“光点集合”，从而提升用户对文化内容的尊重感和信任感。

2.1.3 阴影与深度：悬浮的平面 (Depth & Shadow Philosophy)
去阴影原则：大部分卡片组件不应使用强烈的投影（Drop Shadow），以避免造成过度的层次堆砌感。

极简边框：推荐使用 0.5px 或 1px 的极细边框，颜色设为 rgba(0,0,0,0.05)，代替阴影来界定容器边缘。

层级隐喻：只有当一个元素是临时性的（如浮起的“数字印章”或“弹出详情”）时，才允许使用模糊度较大但透明度极低（shadowOpacity: 0.1）的扩散性阴影，模拟纸张微微翘起的效果。

2.1.4 物理触感：触觉反馈的材质化 (Haptic Materiality)
反馈节奏：配合视觉上的纸质感，触觉反馈不应是猛烈的振动。

模拟逻辑：

翻页感：在 ScrollView 滚动到边界或切换 Tab 时，触发 ImpactFeedbackStyle.Light。

落笔感：在点击按钮或输入名字时，触发一个极短的震动，模拟笔尖接触纸张的瞬间阻力。

2.1.5 给编程 AI 的逻辑注入 (Mental Model for AI Implementation)
本段内容作为 AI 执行的最高原则，请确保 Cursor 等工具在开发时遵循以下思维逻辑：

[CRITICAL LOGIC INJECTION]
视觉审美 > 开发效率：如果一个组件的交互（如卷轴拉开）会增加开发难度，但能显著提升“中式仪式感”，则必须执行。严禁使用标准的 iOS/Android 默认转场效果。

内容完整性 > 功能多样性：宁可只有 10 个精美的朝代词条，也不要 50 个只有干巴巴文字的词条。每个 Data Entry 必须包含 worldParallel（世界同步）和 culturalStory（文化故事）字段。

强关联逻辑 (Strict Linking)：所有的内容实体（Food, City, Dynasty）必须且只能通过 province_id 实现数据互联。这是实现“中国关系地图”点亮功能的唯一合法路径。

仪式感反馈 (Ritual Feedback)：任何涉及成就的操作（如答题正确、收藏成功）必须触发“印章盖章（Stamp）”动画和“触觉震动（Haptics）”。没有反馈的操作被视为“无效操作”。

离线优先 (Offline First)：所有核心文化资产必须硬编码在 src/data 的 JSON 中，严禁在核心浏览流程中依赖实时 API，以保证画报式的秒开体验。


2.2 色彩体系：墨与朱的平衡（墨黑、宣纸白、朱砂红、石灰色的 HEX 定义与应用场景）。
本应用的配色逻辑旨在模拟“白纸、黑墨、红印”的经典书画审美，通过高度克制的用色来强化内容的叙事深度，避免廉价的数字化堆砌。
2.2.1 核心色值定义 (Core Color Definitions)颜色名称HEX 值视觉寓意核心技术角色宣纸白 (Paper White)#FDFBF7未经漂白的自然纤维，温润、宁静、具有呼吸感。全局背景色、卡片容器底色、转场遮罩色。墨黑色 (Ink Black)#333333模拟浓墨入纸后的吸附感，非纯黑以减少视觉生硬感。核心标题、正文文本、关键功能图标。朱砂红 (Cinnabar Red)#B33B24权威、生命力、印章的印迹。这是应用中唯一的“强调色”。虚拟印章、收藏激活状态、地图点亮区域、高等级成就按钮。石灰色 (Stone Grey)#8C8C8C碑拓的残影或墨迹的干枯感，代表辅助与时间沉淀。拼音注释、副标题、装饰性线条 (0.5px)、未解锁状态。
2.2.2 应用场景与视觉层级 (Application Scenarios)1. 文本层级与可读性 (Typography Layers)一级标题与核心名词：统一使用 墨黑色 (#333333)。在宣纸白背景上，该色值能提供极佳的阅读舒适度，同时模拟传统出版物的印刷质感。拼音与辅助说明：统一使用 石灰色 (#8C8C8C)。确保这些辅助性、教学性信息不会干扰主视觉流，仅在用户需要深挖细节时起到指引作用。2. 交互状态与关联反馈 (Interactive States)激活/收藏状态：当用户点击“收藏”按钮时，图标应从墨黑平滑过渡到 朱砂红 (#B33B24)。成就点亮逻辑：在“中国关系地图”中，未解锁省份使用石灰色线条勾勒，背景透明；已解锁省份填充 朱砂红 (#B33B24)，并叠加一层极薄的宣纸纹理，以保持材质的一致性。3. 装饰性线条规范 (Decorative Lines)边界界定：严格禁止使用深色实线。所有分隔线应使用 石灰色 (#8C8C8C)，宽度设定为 0.5px，透明度调至 0.2。通过这种“若有若无”的边界感，营造中国画中“气韵贯通”的效果。
2.2.3 视觉心理学应用：红色的克制 (The Restraint of Red)朱砂红在 App 中被定义为“高价值动作”的专属色，用于建立用户的情绪回馈：禁止滥用原则：严禁在常规 UI（如返回键、普通导航栏背景、次要通知）中使用红色。红色比例过高会破坏 App “宁静 (Quiet)” 的调性。成就暗示：红色只应出现在用户产生“获得感”的瞬间（如获得新徽章、答对题目、点亮地图区域）。通过视觉上的强刺激，建立用户在“发现中国”过程中的多巴胺回路。
2.2.4给编程 AI 的逻辑注入 (Mental Model for AI Implementation)
[CRITICAL LOGIC INJECTION]
视觉审美 > 开发效率：如果一个组件的交互（如卷轴拉开）会增加开发难度，但能显著提升“中式仪式感”，则必须执行。严禁使用标准的 iOS/Android 默认转场效果。

内容完整性 > 功能多样性：宁可只有 10 个精美的朝代词条，也不要 50 个只有干巴巴文字的词条。每个 Data Entry 必须包含 worldParallel（世界同步）和 culturalStory（文化故事）字段。

强关联逻辑 (Strict Linking)：所有的内容实体（Food, City, Dynasty）必须且只能通过 province_id 实现数据互联。这是实现“中国关系地图”点亮功能的唯一合法路径。

仪式感反馈 (Ritual Feedback)：任何涉及成就的操作（如答题正确、收藏成功）必须触发“印章盖章（Stamp）”动画和“触觉震动（Haptics）”。没有反馈的操作被视为“无效操作”。

离线优先 (Offline First)：所有核心文化资产必须硬编码在 src/data 的 JSON 中，严禁在核心浏览流程中依赖实时 API，以保证画报式的秒开体验。

2.3 字体排版规约 (Typography Architecture: Classical & Modern)
本应用的排版系统旨在通过“中西合璧”的字体嵌套逻辑，兼顾古典文化的庄重感与现代移动端的高效阅读体验。

2.3.1 字体层级定义 (Font Family Strategy)
为了营造“书卷感”，App 严格区分标题与正文的字体属性：

标题层 (Serif Titles)：

推荐字体：Noto Serif SC (思源宋体) 或同类高质量衬线体。

应用场景：24 节气名、朝代名称、城市大标题、起名结果。

视觉特征：衬线体具备明显的笔锋和粗细变化，能瞬间建立“文化厚度”。

正文层 (Sans-serif Body)：

推荐字体：系统默认无衬线体 (System Sans-serif)。

应用场景：英文叙事故事、拼音、功能按钮、设置菜单。

视觉特征：无衬线体在小屏幕上具备极高的辨识度和现代感，防止长时间阅读导致的视觉疲劳。

2.3.2 呼吸感排版标准 (Editorial Spacing Standards)
排版的核心在于“计白当黑”，通过充沛的留白赋予文字灵魂：

行高 (Line Height)：

强制标准：全局正文行高设定为 1.6 (即 lineHeight = fontSize * 1.6)。

逻辑：充足的行间距能让英文长句更具“呼吸感”，模拟高档文化杂志的版式。

字距 (Letter Spacing)：

标题层：增加 0.5px 至 1px 的字距。这能赋予大标题一种庄重、疏朗的仪式感。

段落间距：

段落之间使用较大的下边距（建议 16pt - 24pt），严禁使用首行缩进，采用现代齐头式排版以保持杂志质感。

2.3.3 双语嵌套与拼音显示规范 (Bilingual Layout Rules)
双语主次：

英文作为主叙事层，字体字号较大；中文作为美学背景层，紧随其后或作为装饰性背景。

例：Pure Brightness / 清明 (英文 Serif 18pt / 中文 Serif 14pt)。

拼音层级：

拼音使用石灰色 (#8C8C8C)，字号通常为正文的 0.7 倍，位于中文名词的正上方或右侧。

标点符号：

英文环境强制使用半角标点；中文名词内部可保留全角符号以维持视觉平衡。

2.3.4 特殊排版元素：竖排文案 (Vertical Text)
在 Persona 或 History 封面等特定场景，支持极简的竖排文案展示：

规则：仅限中文标题使用竖排（从右向左、从上向下），字数控制在 5 字以内。

视觉效果：增加朱砂红 (#B33B24) 装饰线或印章元素，强化中式排版的意境。

2.3.5 给编程 AI 的逻辑注入 (Mental Model for AI Implementation)
[CRITICAL LOGIC INJECTION]
视觉审美 > 开发效率：如果一个组件的交互（如卷轴拉开）会增加开发难度，但能显著提升“中式仪式感”，则必须执行。严禁使用标准的 iOS/Android 默认转场效果。

内容完整性 > 功能多样性：宁可只有 10 个精美的朝代词条，也不要 50 个只有干巴巴文字的词条。每个 Data Entry 必须包含 worldParallel（世界同步）和 culturalStory（文化故事）字段。

强关联逻辑 (Strict Linking)：所有的内容实体（Food, City, Dynasty）必须且只能通过 province_id 实现数据互联。这是实现“中国关系地图”点亮功能的唯一合法路径。

仪式感反馈 (Ritual Feedback)：任何涉及成就的操作（如答题正确、收藏成功）必须触发“印章盖章（Stamp）”动画和“触觉震动（Haptics）”。没有反馈的操作被视为“无效操作”。

离线优先 (Offline First)：所有核心文化资产必须硬编码在 src/data 的 JSON 中，严禁在核心浏览流程中依赖实时 API，以保证画报式的秒开体验。


2.4 装饰元素与交互反馈规范 (Ornamental Elements & Feedback)本章节定义了 App 内具有“中式灵魂”的细节装饰与交互反馈机制，旨在通过微小的视觉暗示和物理反馈，提升产品的仪式感与高级感。
2.4.1 核心装饰：虚拟数字印章 (The Digital Seals)印章是 App 中最重要的交互反馈媒介，代表了用户的身份确认与成就解锁。视觉设计 (Visual Design)：形状：提供方形（代表严谨、历史）、圆形（代表和谐、自然）、自然形（代表艺术、灵动）三种模版。纹理：印章边缘必须具有不规则的“缺损感”和“斑驳感”，模拟石材刻制与墨迹干枯后的真实效果。颜色：统一使用 朱砂红 (#B33B24)，透明度根据场景在 0.8 到 1.0 之间切换。交互动效 (Stamp Animation)：触发：用户点击“Ritual Complete”或“Quiz Correct”。动作：印章图标从屏幕中心略微放大（Scale 1.3）并伴随轻微旋转，迅速下压至正常大小（Scale 1.0）。反馈：在落下的瞬间触发 HapticFeedback.NotificationSuccess 震动。
2.4.2 极简线条规范 (Minimalist Linework)线条哲学：线条在 App 中不是为了分割空间，而是为了引导视线。参数设定：宽度：严格锁定为 0.5px（Hairline）。颜色：石灰色 (#8C8C8C)，透明度设为 0.2。应用场景：书法落款线：在文案末尾或作者处，配合极细的垂直或水平线，营造书画落款的仪式感。Tab 切换线：仅在导航栏上方使用一条极淡的横线，区分内容区与功能区。
2.4.3 墨迹晕染过渡 (Ink Bleeding Effect)加载逻辑：在页面初次加载或图片载入时，不使用旋转圆圈（Spinner），而是使用“墨迹晕染”动画。视觉实现：背景色块以不规则的形状中心向外扩散，颜色从浅灰色平滑过渡到背景宣纸色。这种缓慢的扩散感能有效缓解用户的等待焦虑，并契合“禅意”的产品定位。2.4.4 触觉反馈规范 (Haptic Logic)触觉是“纸本感”在物理维度的延伸，必须做到有节奏、有区分：动作类型触觉等级 (Expo Haptics)心理预期普通点击 (Tab/Button)Selection确认轻微触碰收藏/点亮地图ImpactLight感觉到“物理卡扣”扣合盖章/成就解锁Success沉重的成就达成感错误/答题失败Warning轻微的阻碍感
2.4.3给编程 AI 的逻辑注入 (Mental Model for AI Implementation)
[CRITICAL LOGIC INJECTION]
视觉审美 > 开发效率：如果一个组件的交互（如卷轴拉开）会增加开发难度，但能显著提升“中式仪式感”，则必须执行。严禁使用标准的 iOS/Android 默认转场效果。

内容完整性 > 功能多样性：宁可只有 10 个精美的朝代词条，也不要 50 个只有干巴巴文字的词条。每个 Data Entry 必须包含 worldParallel（世界同步）和 culturalStory（文化故事）字段。

强关联逻辑 (Strict Linking)：所有的内容实体（Food, City, Dynasty）必须且只能通过 province_id 实现数据互联。这是实现“中国关系地图”点亮功能的唯一合法路径。

仪式感反馈 (Ritual Feedback)：任何涉及成就的操作（如答题正确、收藏成功）必须触发“印章盖章（Stamp）”动画和“触觉震动（Haptics）”。没有反馈的操作被视为“无效操作”。

离线优先 (Offline First)：所有核心文化资产必须硬编码在 src/data 的 JSON 中，严禁在核心浏览流程中依赖实时 API，以保证画报式的秒开体验。

第三部分：信息架构与业务逻辑 (Information Architecture)
3.1 模块导航与场景切换逻辑 (Navigation & Contextual Switching)
本章节定义了 App 的骨架结构及用户在不同文化场景间流转的逻辑，确保 6 个核心模块既能独立运作，又能通过底层数据逻辑实现无缝互联。

3.1.1 底部导航架构 (Bottom Tab Navigation)
应用采用经典的六标签底部导航栏，旨在提供扁平化的路径，让用户能快速进入特定的文化领域：

Home (首页)：文化概览入口，展示今日动态、最近进度及快捷挑战。

Seasons (历法)：基于农历与二十四节气的时令系统，提供每日仪式指导。

History (历史)：以朝代为轴线的文明时间长卷，提供全球视野对比。

Food (美食)：地域菜系百科，侧重于菜品背后的文化故事与社交情境。

Places (城市)：区域性格研究，通过城市视角观察中国当代生活与传统遗留。

Persona (身份)：个人文化档案中心，包括起名系统、收藏列表与成就地图。

3.1.2 跨模块关联引擎 (Cross-Module Linking Engine)
为了打破“信息孤岛”，App 引入了基于 province_id 的强关联逻辑。

关联路径示例：

在 Places (西安) 详情页，自动推荐关联的 Food (肉夹馍) 与 History (秦、唐)。

在 Food (麻婆豆腐) 详情页，点击“Sichuan”标签可跳转至 Places (成都)。

业务实现：

每个 Data 对象必须声明 related_entities 数组，存储相关条目的 ID。

UI 层通过动态筛选（Filter）本地 JSON 数据，在详情页底部渲染“You May Also Explore”模块。

3.1.3 场景切换动画：卷轴与纸张 (Transition Logic)
导航不应只是瞬间的像素替换，而应体现“翻开画报”的物理感：

同级切换 (Tab Switch)：采用轻微的透明度渐变（Cross-fade），配合 0.03 透明度的纹理闪烁感，模拟翻动纸张的视觉瞬间。

进入详情 (Push)：实现 “卷轴拉开”动画。页面从垂直中线向两侧平滑展开，内容随之淡入。

返回首页 (Pop)：反向执行卷轴卷起动效，回到上级列表。

3.1.4 状态持久化策略 (Persistence Strategy)
本地存储：利用 AsyncStorage 追踪用户在各个模块的交互记录，如 last_viewed_dynasty_id 或 current_streak_count。

深层链接 (Deep Linking)：支持内部协议（如 becomechinese://food/mapo-tofu），允许从“Home”或“Persona”直接跨模块跳转至特定内容深度。
3.1.5给编程 AI 的逻辑注入 (Mental Model for AI Implementation)
[CRITICAL LOGIC INJECTION]
视觉审美 > 开发效率：如果一个组件的交互（如卷轴拉开）会增加开发难度，但能显著提升“中式仪式感”，则必须执行。严禁使用标准的 iOS/Android 默认转场效果。

内容完整性 > 功能多样性：宁可只有 10 个精美的朝代词条，也不要 50 个只有干巴巴文字的词条。每个 Data Entry 必须包含 worldParallel（世界同步）和 culturalStory（文化故事）字段。

强关联逻辑 (Strict Linking)：所有的内容实体（Food, City, Dynasty）必须且只能通过 province_id 实现数据互联。这是实现“中国关系地图”点亮功能的唯一合法路径。

仪式感反馈 (Ritual Feedback)：任何涉及成就的操作（如答题正确、收藏成功）必须触发“印章盖章（Stamp）”动画和“触觉震动（Haptics）”。没有反馈的操作被视为“无效操作”。

离线优先 (Offline First)：所有核心文化资产必须硬编码在 src/data 的 JSON 中，严禁在核心浏览流程中依赖实时 API，以保证画报式的秒开体验。


3.2 全局状态管理与数据持久化逻辑 (Global State & Persistence)
本章节定义了应用如何追踪用户的交互行为，并确保这些零散的操作能够转化为持久的“文化资产”。通过统一的状态调度，App 实现了从浏览内容到点亮地图的逻辑闭环。

3.2.1 用户上下文模型 (User Context Model)
应用采用 React Context 或轻量级状态管理工具，维护一个全局唯一的 UserContext 对象。该对象是用户“数字身份”的核心记录仪：

收藏索引 (Favorites Index)：存储用户标记为“心形”的所有条目 ID 及其所属类别（如 food_001, place_023）。

解锁省份集合 (Unlocked Provinces)：一个基于 Set 的集合，动态记录已通过关联内容点亮的省份 ID。

成就指标 (Achievement Metrics)：

zen_streak: 连续完成时令仪式的天数。

quiz_score: 累计答对的文化挑战总数。

rank_level: 基于上述指标加权计算得出的文化称号等级。

3.2.2 自动关联与点亮逻辑 (Automatic Mapping Logic)
这是增强互动性的底层核心业务逻辑：

动作捕获：当用户在详情页触发 ToggleFavorite 动作时。

属性检索：逻辑层立即从当前 JSON 条目中提取 province_id 字段。

状态分发：

如果该 province_id 不在 unlockedProvinces 列表中，则将其加入。

触发全局广播，通知 Persona (Profile) 页面更新 SVG 地图的填充色。

即时反馈：若为首次点亮该省份，UI 层需弹出“New Province Connected”提示，并伴随印章落下的动效与震动反馈。

3.2.3 持久化策略 (Persistence Implementation)
为了保证“离线优先”且不依赖后端，应用采用 Local-First 持久化方案：

存储引擎：使用 @react-native-async-storage/async-storage 进行键值对存储。

同步机制：

写入 (Write-Through)：每当 UserContext 发生变化时，立即异步序列化并更新本地存储，防止应用崩溃导致进度丢失。

读取 (Hydration)：App 启动阶段（Splash Screen 期间），从本地加载 JSON 字符串并还原全局状态，确保用户开屏即见自己的收藏与成就。

版本控制：在存储对象中包含 data_version 字段。当后续 App 更新导致数据结构变化时，通过迁移逻辑（Migration）确保用户旧数据平滑升级。

3.2.4 性能优化：数据响应与缓存
Memoization：对地图渲染和成就计算等高耗能逻辑使用 useMemo，仅在 UserContext 发生相关变化时才重新计算。

局部刷新：确保收藏动作仅刷新对应的收藏组件和地图层，不触发整个应用树的重绘。


3.3 跨模块关联引擎逻辑 (Cross-Module Relationship Engine)
本章节定义了 App 如何打破单一页面的孤立感，通过底层数据的语义关联，构建一个网状的文化探索路径。该引擎是实现“画报式策展”而非“百科式罗列”的技术核心。

3.3.1 核心关联维度 (Core Association Dimensions)
关联引擎基于以下三个核心维度对本地 JSON 数据进行实时检索与匹配：

地理关联 (Geographic Tie)：以 province_id 为核心锚点。这是最强的关联逻辑，用于连接特定的美食、城市与历史遗迹。

时令关联 (Seasonal Tie)：基于 solar_term_id。将特定的食物（如冬至饺子）与当前的节气系统连接。

历史关联 (Chronological Tie)：基于 dynasty_id。将城市（如西安的唐代背景）与特定的历史时期连接。

3.3.2 动态推荐算法逻辑 (Dynamic Recommendation Logic)
在用户进入任何详情页（Detail Screen）时，关联引擎会执行以下逻辑以生成“You May Also Explore”模块：

参数提取：从当前条目中提取 province_id 和 tags。

跨表检索：

Place -> Food/History：如果当前是“西安”，则检索所有 province_id: "Shaanxi" 的美食和历史条目。

Food -> Place：如果当前是“麻婆豆腐”，则检索 province_id: "Sichuan" 的城市条目。

权重排序 (Heuristic Scoring)：

优先展示用户尚未“收藏 (Favorite)”的关联内容。

次优先展示与当前节气匹配的条目。

结果去重：确保推荐列表中不会出现当前正在浏览的条目。

3.3.3 “中国关系”点亮触发机制 (Connection Trigger)
关联引擎不仅负责展示，还负责驱动用户的身份成长系统：

静默建立关系：当用户在 Food 详情页停留超过 5 秒或点击收藏时，关联引擎向 UserContext 发送信号：“用户已与 [Province] 建立联系”。

多维度解锁：系统检测该省份下的全维度内容（美食、城市、历史）。若用户完成了该省份下所有维度的探索，将解锁特定的 “地域守护者 (Regional Guardian)” 勋章。

3.3.4 交互表现：沉浸式跳转 (Interactive Navigation)
关联标签 (Relation Tags)：在详情页底部展示带有拼音的交互式标签（如：Sichuan / 四川）。点击标签后，App 将执行“卷轴拉开”动画，直接跳转至该省份的综合视图。

探索回路：确保用户在任何一个模块点击后，都能通过关联引擎回到 Persona 地图页查看进度，形成“发现 -> 关联 -> 归档”的完整心理回路。



第四部分：模块功能详细规格 (Detailed Module Specifications)
4.1 Seasons: 时令与仪式模块 (The Temporal Rituals)本模块是 App 的“情绪钟表”，旨在通过中国传统的二十四节气系统，引导用户体验一种与自然同步的生活方式。它将枯燥的天文历法转化为具有参与感的每日仪式。
4.1.1 模块核心功能与交互 (Core Features)实时节气显示：根据系统日期自动计算当前所处的节气（如：清明、冬至），并展示对应的意境大图。农历与公历双轴：展示今日农历日期（如：三月初一），增强用户对“中国时间”的体感。每日仪式打卡 (Daily Ritual)：逻辑：每个节气关联 3-5 个特定的文化行为（如：喝茶、踏青、吃饺子）。交互：用户点击“Ritual Complete”按钮，屏幕中央触发一个带有 Success 触觉反馈的红色节气印章动画。禅意寄语 (Seasonal Wisdom)：展示一段关于该时令的简短中英双语诗句或格言。
4.1.2 UI 布局规范 (UI Layout)头部视觉 (Hero Section)：全屏或半屏展示一张符合当前节气审美的高质量本地图片，采用“宣纸白”叠加纹理。错位排版：节气名称（如“Pure Brightness”）使用大字号衬线体 (Serif) 居中或左侧错位展示，中文名（如“清明”）紧随其后。打卡卡片：使用 0.5px 的石灰色细线勾勒卡片边界，保持杂志化的轻盈感。
4.1.3 数据字典与字段示例 (Data Schema)本模块数据存储在 src/data/seasons.js 中，遵循以下标准化结构：字段名类型说明示例idString节气唯一标识符"qingming"nameEnString英文官方译名"Pure Brightness"nameCnString中文名称"清明"pinyinString拼音注释"Qīngmíng"dateRangeString大致公历日期范围"Apr 4 - Apr 19"ritualString今日仪式建议"Drink green tea to embrace spring energy."wisdomString节气箴言"Clear skies and tender green invite remembrance."province_idString关联省份（若有特定习俗）"Zhejiang" (龙井茶产地)
4.1.4 业务逻辑细节 (Business Logic)节气计算器：内置一个基于日期范围的简单判断函数（或引入轻量级 lunar-calendar 库），确保用户开屏即见当前时令，无需手动切换。连续打卡追踪 (Streak)：每次完成仪式，UserContext 中的 zen_streak 加 1。若中断一天，进度归零（或根据难度设置给予缓冲期）。印章反馈：打卡成功后，将对应的 solar_term_id 记录在 AsyncStorage 中。再次查看该节气时，印章将以半透明状态持久化显示在页面边缘。

4.2 History: 文明长卷模块 (The Civilizational Timeline)本模块不仅是朝代的更迭记录，更是通过**“平行史观 (Parallel History)”**建立中国文明与世界文明的时空共振，解决外籍用户对中国历史缺乏定位锚点的问题。
4.2.1 模块核心功能与交互 (Core Features)横向滑动长卷 (Horizontal Scroll Timeline)：逻辑：打破垂直滚动的常规，采用横向手势模拟拉开手卷（Handscroll）的物理过程。视觉：随着滑动，背景颜色根据朝代的“气质（Archetype）”进行极细微的明暗渐变。全球文明坐标 (World Parallel)：在每个朝代下方通过极细线链接对应的世界重大事件。核心发明与文化遗赠 (Legacy & Inventions)：精选该时期对人类文明产生深远影响的贡献（如指南针、造纸术）。统治者与风云人物 (Key Figures)：展示该朝代最具代表性的 1-2 位人物及其双语头衔。
4.2.2 UI 布局规范 (UI Layout)长卷比例：每个朝代作为一个独立的视觉单元，宽度占据屏幕的 85%，露出下一个朝代的边缘以暗示滑动。标题层级：中文朝代名（如“唐”）使用超大字号衬线体（Serif）作为背景装饰，英文标题叠在其上方。平行坐标轴：在页面底部 1/5 处设置一条石灰色 (#8C8C8C) 的虚线，作为“世界史”的时间轴。
4.2.3 数据字典与字段示例 (Data Schema)数据存储在 src/data/dynasties.js 中，采用叙事化文案：字段名类型说明示例idString唯一标识符"tang"nameEnString英文名称"Tang Dynasty"nameCnString中文名称"唐朝"yearsString存在起止年份"618 – 907 AD"taglineString一句话定调"The Cosmopolitan Pulse"worldParallelString全球史对比"Peak of the Silk Road; contemporary with the Abbasid Caliphate."legacyString文化遗赠"Golden Age of Poetry; the era of Xuanzang's journey to the West."province_idString核心地理锚点（如首都所在地）"Shaanxi"
4.2.4 业务逻辑细节 (Business Logic)关联点亮逻辑：当用户阅读完某个朝代的详情并将其收藏时，关联引擎自动获取 province_id（如：唐朝对应陕西），并在 Persona 模块点亮对应区域。卷轴物理感：实现带有动量的横向滚动（Deceleration），并在滚动到特定朝代时，手机产生轻微的触觉脉冲。深度阅读跳转：在详情页底部展示与该朝代相关的 Food（如：该朝代盛行的食材）或 Places（如：古城遗址），引导用户进入网状探索。

4.3 Food: 文化味蕾模块 (The Regional Palate)本模块的核心哲学是：菜品即故事。它不仅介绍如何制作，更侧重于解释这道菜为何诞生、它代表了哪里的风土人情，以及在国际语境下如何进行文化对等。
4.3.1 模块核心功能与交互 (Core Features)画报级美食展示 (Editorial Food Atlas)：采用非对称、大图排版，图片应侧重于食材特写或极简主义的装盘效果，展现“新中式”高级感。文化叙事 (The Cultural Story)：每道菜必须包含其背后的民间传说、历史起源或饮食礼仪（例如：为什么长寿面不能剪断）。味觉维度 (Taste Profile)：通过“Spiciness”, “Texture”, “Technique” 等维度对菜品进行直观刻画。国际化替代建议 (The Substitution Note)：针对海外用户，提供正宗食材缺失时的替代方案（如：没有绍兴酒可以用干雪莉酒代替）。
4.3.2 UI 布局规范 (UI Layout)双列非对称瀑布流 (Masonry Layout)：列表页采用错落有致的卡片排版，模拟食谱杂志的视觉流动感。半屏沉浸式详情页 (Bottom Sheet Detail)：点击卡片后，详情以抽屉形式弹出或全屏拉开，顶部保留大面积留白以放置大标题和拼音。地域标签 (Region Badge)：在菜名下方显著位置展示所属省份，并支持点击跳转至该省份的 Places 视图。4.3.3 数据字典与字段示例 (Data Schema)数据存储在 src/data/recipes.js 中，强调内容的叙事性与实用性：字段名类型说明示例idString唯一标识符"mapo_tofu"nameEnString英文官方名称"Mapo Tofu"nameCnString中文名称"麻婆豆腐"pinyinString拼音注释"Mápó dòufu"province_idString核心关联字段"Sichuan"storyString文化起源与故事"Legend has it that this dish was created by Grandma Chen..."vibeString风味描述"Numbing, spicy, and soul-warming."substitutionString海外食材替代方案"Use firm tofu if silken tofu is unavailable."etiquetteString用餐礼仪/背景"Best served with steaming white rice."
4.3.4 业务逻辑细节 (Business Logic)“味道地图”联动：当用户收藏某道菜时，逻辑层立即将 province_id 传回 UserContext，在 Persona 地图上点亮对应省份。时令推荐机制：关联引擎根据 Seasons 模块的当前节气，优先推荐“时令菜”（如春季推荐春笋）。味觉足迹统计：后台统计用户收藏菜品的风味标签。若用户收藏了 3 道以上川菜，在 Persona 页面解锁 “Spice Explorer (嗜辣先锋)” 勋章。

4.4 Places: 地域灵魂模块 (The Soul of Regions)本模块的核心哲学是：城市即生命体。它旨在通过挖掘城市背后的“Insider Vibe（隐秘气质）”，让用户感受到中国不同地域之间截然不同的生活哲学与美学追求。
4.4.1 模块核心功能与交互 (Core Features)城市性格肖像 (City Character Portrait)：每个城市不只是地名，而是一个带有“性格标签”的实体。例如：西安是“The Eternal Capital”，成都是“The City of Zen & Spice”。本地人的私藏建议 (Insider Tips)：跳过大路化的旅游景点，提供具有文化沉浸感的建议。例如：“在苏州，四点的伍康路适合看斜阳照在旧别墅上”。文化氛围标签 (Vibe Tags)：通过“Tradition”, “Modernity”, “Pace of Life”, “Gastronomy” 等维度，用极简的雷达图或标签展示城市气质。历史层级透视 (Historical Layering)：展示该城市在不同朝代的名字与地位，直接关联 History 模块的相关条目。
4.4.2 UI 布局规范 (UI Layout)沉浸式大图头图 (Hero Visuals)：详情页顶部采用全宽图片，并配合宣纸白背景的渐变，图片应具有“慢门”或“书卷气”的摄影风格。网格化探索空间：通过非对称的网格展示城市的代表性视觉元素，文字穿插其间，保持高水平的版式设计感。地图联动入口：右下角常驻一个极简的微缩地图图标，点击后可快速预览该城市在全国版图中的位置。
4.4.3 数据字典与字段示例 (Data Schema)数据存储在 src/data/places.js 中，侧重于意境描写与逻辑关联：字段名类型说明示例idString唯一标识符"hangzhou"nameEnString英文名称"Hangzhou"nameCnString中文名称"杭州"province_idString核心关联字段"Zhejiang"characterString城市性格定义"The Serene Haven / 人间天堂"vibe_tagsArray氛围标签["Poetic", "Lush", "Refined"]insider_tipString私藏探索建议"Walk along the West Lake at dawn to see the mist dancing..."linked_historyArray关联的历史条目 ID["song", "yuan"]linked_foodArray关联的美食条目 ID["longjing_prawns", "dongpo_pork"]
4.4.4 业务逻辑细节 (Business Logic)地域解锁闭环：当用户“Favorite”一个城市时，该动作是触发 Persona 模块地图变红的最直接逻辑。同时，该操作会增加用户在特定区域（如华东地区）的探索积分。动态关联模块：详情页底部利用“关联引擎”，实时抓取相同 province_id 下的 Food 条目，形成“到了西安必吃肉夹馍”的逻辑链条。环境声纹 (Ambient Sound - 选配)：在城市详情页背景中可选择性播放极小音量的本地环境音（如：雨落西湖、苏州评弹），增强沉浸感。

4.5 Persona: 数字身份模块 (The Cultural Identity)本模块的核心哲学是：身份即契约。通过起名仪式和成就归档，将用户在应用内的所有探索行为具象化为一个可生长、可分享的“中国化身”。
4.5.1 核心功能与起名仪式 (Identity Genesis)沉浸式起名系统 (The Naming Ceremony)：逻辑：用户输入原名及性格关键词（如：Gentle, Brave），算法基于诗经、楚辞或经典德目，匹配对应的中文姓氏与名字。起名卡片：展示中文名、拼音、以及深度的寓意解读 (Semantic Meaning)。例如：“Lan (兰) - Inspired by the orchid, symbolizing nobility and quiet grace.”文化档案看板 (Cultural Dashboard)：汇总展示用户的 Wisdom (答题数)、Zen (连续打卡) 和 Connection (点亮省份)。成就画报生成 (Identity Poster)：支持一键生成带有宣纸底纹、用户中文名、已点亮地图区域和所获最高勋章的合成海报，便于社交媒体分享。
4.5.2 UI 布局规范 (UI Layout)卷轴开场 (Scroll Opening)：首次进入或查看名字详情时，强制执行左右拉开的卷轴动效，增加庄重感。极简徽章墙 (The Seal Wall)：勋章以朱砂红印章的形式错落排布，未解锁的勋章以极低透明度的石灰色占位。层级结构：Top：用户虚拟身份卡（中文名 + 拼音 + 寓意）。Center：中国关系地图 (Connection Map)。Bottom：最近解锁的 3 个勋章及成就统计。
4.5.3 数据字典与字段示例 (Data Schema)数据涉及用户生成内容及成就配置 src/data/persona_config.js：字段名类型说明示例chinese_nameString算法生成的中文名"李若兰"meaning_enString名字背后的文学意蕴"Graceful orchid by the clear stream."source_refString文学出处（选配）"From 'The Songs of Chu'"unlocked_provincesArray存储已收藏条目所属省份 ID["Shaanxi", "Sichuan", "Zhejiang"]active_badgesArray存储已达成的徽章 ID["wanderer_01", "tea_master_02"]
4.5.4 业务逻辑细节 (Business Logic)地图点亮算法 (SVG Fill Logic)：在 Persona 页面渲染一个中国省级行政区划的 SVG。逻辑层遍历 unlocked_provinces 数组，将对应的路径（Path）填充颜色从透明改为 朱砂红 (#B33B24)。成就触发机制：监听器：每当 UserContext 发生变化时，检查是否满足新的勋章条件。弹窗：满足条件时，全屏覆盖一个淡入淡出的宣纸纹理层，展示获得的印章并触发 Success 触觉反馈。分享逻辑：利用 react-native-view-shot 截取特定区域，合成带有应用水印和当前时令信息的图片。

第五部分：互动成就与徽章体系 (Gamification & Achievement)
5.1 中国关系地图与点亮逻辑 (The Connection Map & Logic)本模块的核心哲学是：文化即连接。它将抽象的地理概念具象化为一张可交互、可生长的个人版图。用户在 App 内的每一次探索（阅读、收藏、打卡），都是在物理世界之外建立一份属于自己的“中国关系”。
5.1.1 视觉表现层：极简 SVG 交互地图 (Visual Interface)设计风格：采用极简主义的省级行政区划图，去除任何地形特征和现代交通线，保留纯粹的轮廓感。渲染状态 (State Rendering)：未解锁 (Locked)：背景透明或填充极淡的灰白色（与宣纸背景相近），边缘使用 0.5px 的 石灰色 (#8C8C8C) 描边。已解锁 (Unlocked)：填充 朱砂红 (#B33B24)，并叠加 0.05 透明度的纤维纹理。解锁瞬间伴随由中心向边缘扩散的淡入动画（Duration: 500ms）。省份标签 (Dynamic Labels)：仅在已解锁的省份上方显示该省的 Pinyin 及缩写，且字体使用微缩的衬线体 (Serif)。
5.1.2 触发逻辑：关联点亮算法 (Trigger Mechanism)这是全 App 最核心的业务逻辑，确保所有模块的交互最终都汇聚于此：动作监听：系统监听 Favorite_Toggle（收藏）和 Ritual_Complete（仪式打卡）事件。数据溯源：从被交互的条目（如：肉夹馍、西安、唐朝）中提取 province_id。状态判定：检查全局变量 unlocked_provinces 数组：IF id 已存在：记录交互频次，但不触发解锁动画。IF id 为新条目：将 id 加入数组并触发持久化存储 (AsyncStorage)。发送解锁广播至 Persona 页面。仪式感反馈：调用 handleStampAnimation()。在地图相应坐标位置展示一个微小的红色印章缩放效果，并同步触发 ImpactHeavy 震动。
5.1.3 进度统计与转化 (Progress Metrics)解锁百分比 (Connection Density)：公式：$Connection \% = \frac{count(unlocked\_provinces)}{34} \times 100\%$该数值实时显示在地图下方，驱动用户的完整收集欲望。区域霸主逻辑 (Regional Mastery)：系统将省份划分为“华北、江南、丝绸之路”等文化片区。当某一区域全部点亮，触发特殊的 “Regional Guardian” 动态金边效果。
5.1.4 数据字典与持久化 (Data & Persistence)UserContext 中关于地图的状态定义：变量名类型说明示例unlocked_provincesArray<String>存储已解锁省份的 ISO 编码或 ID["CN-61", "CN-51"]province_statsObject记录每个省份下收藏的条目总数{ "Shaanxi": 4, "Sichuan": 2 }last_unlockedString最近一次点亮的省份，用于开屏引导"Shaanxi"

5.2 勋章矩阵设计与解锁模型 (The Badge Matrix & Unlock Model)勋章系统（Badges）不仅是奖励，更是用户在文化探索中的“里程碑”。我们采用虚拟篆刻印章作为勋章的视觉载体，赋予其收藏价值与艺术质感。
5.2.1 勋章视觉设计语言 (Visual Aesthetics)形态多样性：勋章不局限于单一形状。分为 “朱文印”（文字凸起，红色笔画）和 “白文印”（文字凹陷，红色背景），并提供方印、圆印、随形印等不同模版。肌理模拟：所有勋章必须包含“残损动效”。通过随机的边缘切割和内部斑驳点，模拟古印章经过千年侵蚀的质感。动态展示：在 Persona 页面，已解锁勋章具有微弱的呼吸感光效，模拟朱砂在宣纸上微微反光的质感。
5.2.2 勋章矩阵 (The Badge Matrix)勋章 ID勋章名称 (Bilingual)视觉特征解锁逻辑 (Unlock Logic)B01The Wanderer / 初见者极简圆形淡红墨圈首次完成“中文起名仪式”。B02Tea Master / 品茗师绿色调压纹茶叶形状印连续完成 7 天“Seasons”模块的仪式打卡。B03Silk Road Guide / 丝路向导骆驼图案方印收藏陕西、甘肃、新疆三省的任意内容。B04Grand Curator / 首席馆长金色镶边的双龙方印点亮中国关系地图中全部 34 个省份。B05Soul Mate / 文化知音阴阳契合圆印在“Daily Insight”挑战中累计答对 50 题。B06Spice Explorer / 嗜辣先锋火焰纹样的不规则随形印收藏超过 5 个带有“Spicy”标签的美食。
5.2.3 解锁算法与通知流 (Unlock Workflow)事件广播：每当用户触发 Favorite、Complete 或 Correct 动作时，系统发送一个 ActivityEvent。判定引擎 (BadgeJudger)：引擎实时对比 UserContext 状态与 BadgeMatrix 的配置表。成就弹窗 (Achievement Toast)：视觉：全屏变暗，中心浮现一张半透明的“宣纸”，随后一个朱砂红印章伴随震动“压”在纸上。反馈：弹出徽章含义的文学化描述，如：“You have mastered the rhythm of nature.”持久化：将勋章 ID 存入 active_badges 数组，更新 Persona 页面的列表。
5.2.4 激励逻辑：段位成长 (Rank Progression)除了单一勋章，系统根据勋章总数计算用户的文化段位 (Rank)：Rank 1: Guest (客) - 拥有 1-3 枚勋章。Rank 2: Scholar (生) - 拥有 4-8 枚勋章。Rank 3: Sage (贤) - 拥有 9 枚以上勋章。Rank 4: Master (师) - 达成特定极难隐藏勋章。

5.3 每日挑战与知识点亮 (Daily Insight & Quiz Logic)
本模块的核心哲学是：由奇入径。通过有趣、具有反直觉色彩的“冷知识”挑战，激发用户深入探索各文化模块的欲望。

5.3.1 交互设计：挑战卡片 (The Insight Card)
展示位置：Home（首页）的核心区域，采用全宽卡片设计。

视觉呈现：

卡片背景采用比全局背景略深的宣纸纹理（#F7F3ED）。

标题使用朱砂红 (#B33B24) 的衬线体：“Daily Insight”。

问题描述采用优雅的询问式口吻，例如：“Which ancient dynasty was contemporary with the Roman Republic?”

交互流程：

用户在 3 个选项中进行选择。

选择后反馈：卡片原地翻转，展示正确答案及一段约 50 字的“深度解析 (Deep Dive)”。

知识点亮：若回答正确，卡片右下角盖上一个带有动画效果的“Solved”印章，并奖励 5 点 Wisdom 值。

5.3.2 题库逻辑与关联 (Quiz Schema & Relational Linking)
题目不再是孤立的，而是通往各个详情页的“引路人”。

数据结构设计：

JSON
{
  "id": "q_001",
  "question": "Which fruit is a symbol of longevity in Chinese culture?",
  "options": ["Apple", "Peach", "Pear"],
  "correct_index": 1,
  "explanation": "Peaches (Shoutao) are legendary symbols of immortality...",
  "related_link": { "type": "Food", "id": "longevity_peach" },
  "province_id": "Shandong"
}
关联跳转：在解析页面下方提供一个快捷入口：“Explore the story of Longevity Peach”。点击后，应用直接通过关联引擎跳转至 Food 模块的详情页。

5.3.3 业务逻辑：动态分发与难度梯度
每日更新逻辑：系统根据 UserContext 记录的日期，每日从 src/data/quizzes.js 中按顺序或随机抽取一条未回答过的题目。

难度分层：

Level 1 (Novice)：常识类，如节气、代表性美食。

Level 2 (Explorer)：历史对比、城市性格类。

Level 3 (Scholar)：深层哲学、文学出处、起名寓意类。

激励反馈：

连续答对 3 天：解锁 "Sharp Eye / 慧眼" 勋章。

答对 10 题以上：在个人中心点亮特定的“智慧印记”。

5.3.4 技术实现：印章盖下的物理模拟 (Physics Simulation)
震动逻辑：

当用户点击正确选项，在“Solved”印章落下的瞬时，触发一个 NotificationSuccess 触觉反馈。

视觉动效：

印章不是生硬地出现，而是伴随轻微的随机旋转（±5度）和不透明度从 0 到 1 的快速跳变，模拟手动盖章时力度不均产生的随机美感。



第六部分：底层数据字典设计 (Data Dictionary)
6.1 JSON 字段标准化与叙事规范 (Data Schema & Narrative Standards)为了保证 App 的“画报感”和“平行史观”能够落地，所有存储在 src/data/ 目录下的 JSON 文件必须严格遵守统一的字段架构。这不仅是为了程序调用的稳定性，更是为了强制 AI 在填充内容时必须思考“文化关联性”。
6.1.1 核心通用字段 (Universal Base Fields)所有内容模块（Food, Places, History, Seasons）必须包含以下基准字段：字段名类型描述执行约束idString唯一索引 ID格式：category_name (例: food_mapo_tofu)。name_cnString中文名称必须使用简中，必要时括号标注古称。name_enString英文名称拒绝直译，使用具有文学感的译名。pinyinString拼音必须带声调（例：Mápó dòufu）。province_idString省份关联锚点强制项。必须匹配 34 个省级行政区标准 ID。cultural_storyString核心叙事文案长度 100-150 词，文学杂志风格。
6.1.2 模块扩展字段 (Module-Specific Extensions)针对不同模块的特质，需增加特定的维度字段：History 模块：world_parallel: (String) 强制项。描述同期的全球重大事件（如：汉朝时期的罗马共和国）。archetype: (String) 该朝代的关键词图腾（如：Tang = Openness）。Food 模块：taste_profile: (Array) 味道标签（例：["Spicy", "Numbing", "Tender"]）。substitution: (String) 为海外用户准备的替代食材建议。Places 模块：insider_vibe: (String) 描写该地非旅游化的精神气质。vibe_tags: (Array) 氛围标签。
6.1.3 叙事语调指南 (Narrative Style Guide)在通过指令让 AI 填充 cultural_story 时，必须符合以下语调：拒绝百科感：严禁使用“...is one of the most famous...”或“...has a long history of...”这种陈词滥调。拟人化与场景化：描述杭州时，应写“A city that breathes through mist and tea leaves”；描述辣味时，应写“A slow-burn heat that dances on the tongue”。对等性叙事：在描述历史人物时，可以进行跨文化类比（如：将诸葛亮类比为“The Merlin of the East”），以便于外籍用户理解。
6.1.4 数据结构示例 (Standard Implementation)JSON{
  "id": "food_xiaolongbao",
  "name_cn": "小笼包",
  "name_en": "The Soup Dumpling Ritual",
  "pinyin": "Xiǎolóngbāo",
  "province_id": "Shanghai",
  "cultural_story": "More than just a steamed bun, the Xiaolongbao is a masterpiece of hydraulic engineering in miniature. Originating from the canals of Nanxiang, it represents the delicate precision of Jiangnan culture...",
  "taste_profile": ["Savory", "Delicate", "Umami"],
  "substitution": "If Chinkiang vinegar is unavailable, a mix of balsamic and rice vinegar works wonders.",
  "related_links": ["place_shanghai", "history_song"]
}

6.2 多语言内容策略与拼音层级 (Multilingual & Pinyin Architecture)为了实现“文化桥梁”的作用，应用不应只是简单的语言互译，而应通过中、英、拼音三者的权重组合，构建一个多维的语义空间。
6.2.1 语言权重分配 (Language Priority Logic)在 UI 展示中，三种语言元素承担着不同的功能使命：英语 (The Narrative)：主叙事语言。负责传递逻辑、历史背景和情感故事。字号最大，使用无衬线体以保证长时间阅读的舒适度。中文 (The Totem)：美学与符号语言。负责提供视觉锚点和原始文化凭证。使用衬线体（宋体），代表正统与美感。拼音 (The Guide)：功能性辅助语言。负责打破发音障碍，赋予用户“开口说”的权力。字号最小，使用石灰色 (#8C8C8C)。
6.2.2 拼音标注标准 (Pinyin Standards)为了保证学术严谨性与易读性的平衡，拼音遵循以下规范：声调强制：所有拼音必须携带正确的声调符号（如：Qīngmíng 而非 Qingming）。驼峰命名原则：对于专有名词，拼音的首字母大写，词组间按音节自然连接（例：Xiǎolóngbāo）。物理布局：行内模式：在正文中出现中文词汇时，拼音以括号形式紧随其后。注音模式：在标题中，拼音以微缩字号垂直排列在中文上方或水平排列在中文下方，行间距设为固定 4pt。
6.2.3 多语言 JSON 结构规范 (Bilingual Data Schema)在数据底层，通过嵌套对象实现多语言的解耦与快速检索：JSON{
  "nomenclature": {
    "en": "The Forbidden City",
    "cn": "故宫",
    "pinyin": "Gùgōng",
    "pinyin_tones": [4, 1],
    "alternative_names": ["Purple Forbidden City", "The Palace Museum"]
  },
  "narrative": {
    "en": "A fortress of silence and history at the heart of Beijing...",
    "cn": "北京心脏地带的宁静堡垒与历史见证..."
  }
}
6.2.4 文化术语对等词库 (Cultural Glossaries)应用内置一个核心术语转换表，确保 AI 在生成内容时使用对等的文化意象：中文术语官方拼音推荐叙事对等词 (Narrative Equivalent)阴阳YīnyángThe Cosmic Harmony of Opposites气QìThe Vital Life Force / Energy Flow江湖JiānghúThe Vagabond World / The Realm of Outsiders节气JiéqìSolar Term / The Rhythms of Earth6.2.5 交互式读音 (Audio Interaction - 进阶逻辑)在详情页点击拼音或中文图标，触发轻微的震动反馈，并调用 Speech 组件进行标准的中文普通话发音。这一交互旨在将静态的“看画报”转化为动态的“听文明”。

6.3 样本内容示例与文案调性样板 (Data Samples & Copywriting Templates)
本章节通过三个核心模块的样板数据，展示如何将“平行史观”、“地域关联”及“叙事化表达”植入底层 JSON。开发 AI 应参考这些样本的文案长度、语调和字段逻辑进行全量数据扩充。

6.3.1 朝代样板：History (Parallel Perspective)
设计要点：必须建立中国与全球文明的强时间关联。

JSON
{
  "id": "history_han",
  "name_cn": "汉朝",
  "name_en": "The Han Dynasty",
  "pinyin": "Hàncháo",
  "province_id": "Shaanxi",
  "years": "202 BC – 220 AD",
  "archetype": "The Golden Age of Bureaucracy and Trade",
  "world_parallel": "The Han Empire in the East rose and fell almost in perfect synchronicity with the Roman Republic and Empire in the West.",
  "cultural_story": "The Han was the crucible of Chinese identity. It was an era of profound expansion, where the Silk Road first pulsed with trade, connecting Chang'an to the Mediterranean. It defined the scholarly civil service and the Confucian ethics that would anchor Chinese society for two millennia.",
  "legacy": "Invention of paper, the first seismograph, and the standardization of the Silk Road trade routes.",
  "related_links": ["place_xian", "food_wheat_noodles"]
}
6.3.2 美食样板：Food (Cultural Narrative)
设计要点：强调“味道背后的哲学”及“国际化对等建议”。

JSON
{
  "id": "food_mapo_tofu",
  "name_cn": "麻婆豆腐",
  "name_en": "Mapo Tofu",
  "pinyin": "Mápó dòufu",
  "province_id": "Sichuan",
  "taste_profile": ["Numbing (Ma)", "Spicy (La)", "Tender", "Aromatic"],
  "cultural_story": "Legend tells of a pockmarked grandmother (Ma-po) in 19th-century Chengdu who served laborers this soul-warming dish. The secret lies in the 'Ma' (numbing) sensation of Sichuan peppercorns—a sensory experience that mimics the tingling of electricity on the tongue, balanced by the fermented depth of Doubanjiang.",
  "substitution": "If authentic Doubanjiang is unavailable, a blend of miso paste and chili flakes can provide a similar fermented heat.",
  "etiquette": "In a traditional setting, Mapo Tofu is the ultimate communal comfort food, always served with a steaming bowl of white rice to absorb the vibrant red oil.",
  "related_links": ["place_chengdu", "history_qing"]
}
6.3.3 城市样板：Places (The Soul of City)
设计要点：通过“Insider Tip”赋予用户超越游客的洞察力。

JSON
{
  "id": "place_suzhou",
  "name_cn": "苏州",
  "name_en": "Suzhou",
  "pinyin": "Sūzhōu",
  "province_id": "Jiangsu",
  "character": "The Venice of the East / 园林之城",
  "vibe_tags": ["Refined", "Water-bound", "Literary"],
  "insider_vibe": "Suzhou is a city designed for the slow observer. It is where the rigid order of the world gives way to the winding aesthetics of the classical garden—a place where every window frame is a composed painting.",
  "cultural_story": "For centuries, Suzhou was the retreat for retired scholars and poets. Its gardens were not just backyards, but microcosms of the universe, built to reflect the harmony between man and nature. Today, that elegance persists in the local Kunqu Opera and the delicate sweetness of its silk.",
  "insider_tip": "Skip the main tourist gardens at noon. Instead, wander through the Canglang Pavilion at sunset, when the light plays on the canal-facing walls, echoing the Song Dynasty poets.",
  "related_links": ["food_squirrel_fish", "history_song"]


第七部分：交互动效与手感设计 (UX & Motion)
7.1 核心转场动效：卷轴与纸张逻辑 (The Handscroll & Paper Dynamics)
本模块的核心目标是打破移动端标准的“推入/拉出（Push/Pop）”惯性，利用模拟物理材质的动效，增强用户在探索文明时的“开启感”与“归档感”。

7.1.1 卷轴拉开动效 (The Handscroll Opening)
用于进入详情页（如朝代详情、起名结果、城市深读）。

视觉逻辑：

中轴线出现：屏幕中心首先出现一条垂直的、颜色为石灰色 (#8C8C8C) 的 0.5px 细线。

双向展开：页面内容以该细线为轴，同步向左右两侧水平平滑拉开。

内容淡入：在拉开的过程中，文字和图片通过透明度渐变（Opacity 0 -> 1）同步显现。

技术参数：

Duration: 450ms - 600ms。

Easing: Easing.bezier(0.4, 0, 0.2, 1) (标准的流畅加速感)。

反馈：拉开开始瞬间触发一个 ImpactLight 触觉反馈。

7.1.2 纸张翻动效果 (Paper Page Turn)
用于同级模块切换（Tab Switch）或横向切换时。

视觉逻辑：

非对称位移：当前页面向左微移，同时透明度降低；新页面从右侧淡入，但带有一个极微弱的“光影掠过”效果。

噪点同步：背景的宣纸纹理（Noise Texture）不随页面移动，保持静止，仅内容层发生移动。

交互意义：这种设计能让用户感觉是“内容在纸上切换”，而非“整张纸被换掉”，维持了视觉底座的稳定性。

7.1.3 墨迹晕染过渡 (The Ink Bleed Loading)
用于大图加载或页面初始化前的占位。

视觉逻辑：

不使用圆圈进度条（Spinner）。

屏幕中心出现一个不规则的、类似墨滴滴入水中的晕染形状，从半透明逐渐扩展至全屏。

扩展完成后，内容在墨色消散处瞬间清晰。

代码暗示：使用 Animated.timing 配合遮罩层（Masked View）实现。

7.1.4 元素浮现动效 (Staggered Entrance)
用于列表项的呈现。

逻辑：采用 “阶梯式加载 (Staggered Animation)”。

执行：列表中的卡片不是整体出现，而是从上到下依次有 50ms 的间隔。每个卡片带有由下而上 10dp 的位移，模拟文字在纸面上逐行排布的过程。

7.2 触觉反馈与声纹逻辑 (Haptic Feedback & Soundscape)本模块的核心目标是利用移动设备的线性马达和音频模态，为“纸本感”视觉提供物理支撑。交互反馈必须遵循“轻快、精准、具象”的原则，严禁冗长或沉重的震动。
7.2.1 触觉反馈分级规范 (Haptic Hierarchy)基于 expo-haptics 或原生震动接口，App 严格区分四类触觉语言：动作类型震动等级 (Haptic Style)物理模拟意图执行场景选择与切换Selection模拟手指划过纸张边缘的轻微弹性。底部 Tab 切换、横向滑动朝代长卷、选择 Quiz 选项。逻辑触发ImpactLight模拟笔尖触碰纸张或物理开关扣合。点击收藏（Favorite）、展开卷轴详情、确认名字。成就达成NotificationSuccess模拟印章重重压在宣纸上的沉重感与确认感。**印章盖章（Stamp）**瞬间、点亮新省份、解锁新勋章。阻碍与错误NotificationWarning模拟笔尖划破纸张或撞击硬物的顿挫感。答题错误、必填项缺失、离线操作受阻。
7.2.2 “落笔成章”动效配合逻辑 (Sync with Animation)触觉反馈必须与视觉动效在毫秒级同步，以产生“突显效应”：盖章同步：在印章缩放至 Scale(1.0) 的那一帧（约动画开始后的 150ms），触发 Success 震动。拉开同步：在卷轴拉开、侧边阴影最深的瞬间，触发一次 ImpactLight。
7.2.3 环境声纹与交互音效 (Ambient Soundscape)为了维持“静谧 (Quiet)”的产品特质，App 不使用任何合成器音效（如常见的叮叮声），而是采用真实录制的自然音。背景禅意声纹 (Ambient Loop)：在 Places（如杭州、苏州）或 Seasons 页面，背景可极低音量（2% - 5% 音量）循环播放自然声。采样源：雨滴落入池塘、微风拂过竹林、翻动陈旧纸张的沙沙声。交互点缀音 (Interface Cues)：收藏动作：微弱的“墨点入水”声。盖章动作：沉闷的“木质撞击”声（类似真实石印盖在软垫上的声音）。控制策略：在 Persona -> Settings 中提供“Zen Sound”全局开关，默认开启。
7.2.4 读音指导逻辑 (Audio Guidance)交互点：点击所有带有拼音的中文词条（如：Qīngmíng）。执行：系统调用 TTS 或播放预录制的 1 秒音频，展示标准的普通话发音。视觉配合：播放读音时，对应的拼音字符颜色从石灰色短暂变为朱砂红，随着声音结束淡回石灰色。

7.3 加载与骨架屏：淡入淡出逻辑、宣纸纹理加载。

这是《BecomeChineseApp 详细设计白皮书》第七部分：交互动效与手感设计 中 7.4 情绪曲线与“空白”设计逻辑 的深度细化内容。本章节定义了 App 如何通过留白与节奏控制，营造一种符合中式禅意的“静谧感”体验。

7.3 加载与骨架屏：淡入淡出逻辑 (Loading & Skeleton Strategy)
在追求“画报式秒开”体验的同时，针对复杂的卡片与大图加载，我们通过模拟“纸墨相融”的过程来消除加载的生硬感，将加载等待转化为视觉期待。

7.3.1 宣纸纹理底座优先 (Texture-First Hydration)
逻辑：在任何内容（文字、图片）出现之前，背景必须首先存在。

执行：

全局单例背景：宣纸白 (#FDFBF7) 与纤维纹理层（Noise Overlay）作为 App 的最底层组件，常驻内存，不随页面销毁而消失。

视觉体验：当用户点击跳转时，屏幕不会出现纯黑或纯白，而是已经铺好的、具有质感的宣纸，随后内容才如“浮现”般显现。

7.3.2 骨架屏：石灰色的禅意 (The Stone Grey Skeleton)
视觉定义：

采用 石灰色 (#8C8C8C) 作为占位符色值，但透明度设定为极低的 0.1。

形状：严格遵循内容的物理轮廓。标题占位符为长方形，图片占位符保持非对称的卡片比例。

动效逻辑：

严禁使用高频率的“闪烁”或“流动光效”。

呼吸渐变：采用极其缓慢的透明度呼吸效果（Opacity: 0.05 -> 0.15），频率为 3000ms/周期，模拟人在静坐时的呼吸频率。

7.3.3 “墨迹消散”淡入逻辑 (Ink Dissolve Fade-in)
内容加载完成后的呈现不应是瞬间闪现，而应遵循以下淡入曲线：

层级延迟 (Staggered Fade)：

第一步：图片层以 Duration: 400ms 淡入。

第二步：文字标题（墨黑色 #333333）在图片淡入至 50% 时开始渐现。

第三步：辅助信息（石灰色拼音）最后浮现。

动画参数：

Easing: Easing.out(Easing.poly(4))。

视觉效果：内容像是从宣纸纤维内部慢慢“渗透”出来的，而非贴在表面。

7.3.4 特殊场景：墨点晕染加载 (The Ink Wash Loading)
针对极少数需要长时加载的场景（如：首次生成个人起名海报）：

视觉实现：

屏幕中心出现一个动态的 墨迹晕染（Ink Wash） 动画。

墨迹以不规则的形态向四周扩散，颜色从深灰色逐渐变浅，直至边缘与宣纸背景完全融合。

扩散完成后，海报内容在墨迹中心瞬间清晰呈现。

第八部分：技术落地与工程规范 (Implementation & Standards)
8.1 技术栈要求：Expo / React Native 核心配置为了实现“跨平台一致性”与“离线优先”的设计目标，本项目采用 Expo (Managed Workflow) 作为核心开发框架。8.1.1 核心架构选型 (Core Stack)组件选型理由基础框架Expo SDK (Latest)提供开箱即用的 Haptics、Blur、FileSystem 支持，降低配置成本。编程语言TypeScript强制执行 JSON 字典的接口定义（Interfaces），确保跨模块数据一致性。状态管理React Context + useReducer适合本项目中轻量但频繁的状态流转（如点亮地图）。持久化层AsyncStorage实现“离线优先”，本地存储用户的收藏、打卡记录与起名历史。动效引擎Reanimated 3 + Lottie实现“卷轴拉开”与“墨迹晕染”的高性能、 60fps 交互反馈。8.1.2 Expo 项目核心配置 (app.json)为了保持品牌质感，必须在配置文件中预设以下全局属性：JSON{
  "expo": {
    "name": "BecomeChinese",
    "slug": "become-chinese-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light", // 强制锁定浅色模式以维持宣纸质感
    "backgroundColor": "#FDFBF7", // 宣纸白全局背景
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#FDFBF7"
    },
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.yourname.becomechinese"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FDFBF7"
      }
    }
  }
}
8.1.3 核心依赖包及用途 (Primary Dependencies)开发 AI 在执行 npm install 时需包含以下关键库：视觉与布局：expo-font: 加载自定义衬线体 (Noto Serif SC)。react-native-svg: 渲染“中国关系地图”及所有矢量图标。expo-blur: 用于实现毛玻璃效果，增加视觉层级。手感与反馈：expo-haptics: 实现“落墨”与“盖章”的物理震动。react-native-reanimated: 驱动卷轴拉开等复杂 Layout 动画。内容与逻辑：expo-file-system: 管理本地庞大的文化图片缓存。react-native-view-shot: 实现个人起名海报的截屏与分享。8.1.4 样式系统规范 (Style System)严禁使用硬编码的像素值。必须在 src/theme/index.ts 中定义全局常量：Colors: 引用 2.2 色彩体系（宣纸白、墨黑、朱砂红、石灰色）。Spacing: 采用 8pt 栅格系统，详情页间距固定为 24pt 或 32pt 以维持留白感。Typography: 预定义 Title (Serif), Body (Sans-serif), Pinyin (Mono/Sans-serif) 的字体族、字号与行高。

8.2 组件化策略：原子组件开发、逻辑与 UI 分离为了应对 App 极高的视觉精度要求，我们采用 Atomic Design (原子设计) 理念，将 UI 拆解为可独立维护的颗粒，并严格执行“逻辑与表现分离”的架构。
8.2.1 原子级组件库 (Atomic Components)所有业务页面必须由以下底层“原子”构建，禁止在业务层直接使用原生 View 或 Text：原子组件对应设计元素技术关键点<PaperBackground />宣纸底座全局唯一，包含 Noise 纹理遮罩。<Typography />多层级文本内置 Noto Serif SC 切换逻辑，支持自动注音排版。<InkLine />石灰细线固定 0.5px 宽度，支持 0.2 透明度预设。<SealStamp />数字化印章封装了 7.3 中的缩放动画、随机旋转及 Haptics。<CinnabarButton />主交互按钮朱砂红配色，内置点击时的纸张凹陷视觉反馈。
8.2.2 逻辑与 UI 分离架构 (Separation of Concerns)为了保证“离线优先”和“跨模块关联”逻辑的稳健性，每个核心模块遵循以下文件结构：View 层 (/components 或 index.tsx)：仅处理样式呈现和动画分发，通过 Props 接收数据。Hook 层 (/hooks)：封装业务逻辑（如点亮地图的判定、起名算法）。Data 层 (/data)：存储静态 JSON 字库。示例逻辑隔离：useMapConnector.ts：负责监听收藏动作，提取 province_id 并更新全局状态。MapView.tsx：仅负责接收 unlocked_list 并执行 SVG 路径染色动画。
8.2.3 视觉混合规范 (Visual Composition)组件嵌套必须遵循**“层叠次序协议”**：Base Layer: <PaperBackground />（提供纹理底纹）。Content Layer: 文本、图片等交互内容。Stamp Layer: 印章层（盖在文本之上，但需继承底纹的透明混合模式）。Overlay Layer: 全局噪点层（Noise Overlay），确保所有元素看起来都像是“长”在纸上的。
8.2.4 高阶组件：卷轴容器 (The Scroll Wrapper)开发一个名为 <HandscrollContainer /> 的高阶组件（HOC），用于包装所有详情页：功能：自动注入 7.1 定义的“左右拉开”入场动画。参数：接受 onOpenComplete 回调，在动画结束后触发音频或震动。

8.3 AI 指令集：Cursor 分阶段执行指南 (The Master Prompts)
由于本项目视觉要求极高且逻辑链路复杂，建议采取**“视觉底座 -> 数据协议 -> 模块拆解 -> 动效注入”**的四步喂入策略。

阶段一：建立视觉底座与全局主题 (The UI Foundation)
目标：初始化工程，锁定“宣纸、墨、朱”的配色与字体。

Master Prompt 01:
"我正在开发《BecomeChineseApp》，请基于 React Native (Expo) 初始化项目环境。

首先在 src/theme 中定义颜色常量：宣纸白 (#FDFBF7)、墨黑 (#333333)、朱砂红 (#B33B24)、石灰 (#8C8C8C)。

配置全局字体：加载 Noto Serif SC 用于标题，系统无衬线体用于正文。

创建一个 <PaperBackground /> 组件，要求包含两层：底层颜色为宣纸白，上层叠加一个透明度为 0.05 的不规则噪点纹理层（Noise Texture），模拟真实纸张质感。这个组件将作为所有页面的容器。"

阶段二：确立数据协议与关联逻辑 (The Data Protocol)
目标：通过 TypeScript 接口强制锁定 province_id 的关联性。

Master Prompt 02:
"请基于以下要求在 src/types 下定义文化实体的数据模型：

所有实体（History, Food, Place）必须继承 IBaseEntity 接口，包含：id, name_cn, name_en, pinyin, 以及核心字段 province_id。

History 实体额外包含 world_parallel (平行史观文本)。

Food 实体额外包含 taste_profile 数组和 substitution。

创建一个全局状态 UserContext，包含 unlockedProvinces (Set) 和 favorites (Array)。编写一个 Hook useDiscovery，当用户触发收藏动作时，自动将对应实体的 province_id 加入 unlockedProvinces 集合。"

阶段三：开发原子组件与核心模块 (The Atomic Components)
目标：构建“数字化印章”与“卷轴容器”。

Master Prompt 03:
"现在开发两个核心交互组件：

<SealStamp />：接收一个朱砂红色的 SVG 印章。当其出现时，必须在 150ms 内完成从 Scale 1.3 到 1.0 的下压动画，并在落地瞬间触发 Haptics.notificationAsync(Success)。边缘要有随机的 3-5 度旋转和微小的位置偏移。

<HandscrollWrapper />：这是一个高阶组件，用于页面转场。当页面进入时，屏幕从中心线向左右两侧平滑展开（像拉开卷轴一样），内容随之淡入。请使用 react-native-reanimated 实现。"

阶段四：模块组装与离线填充 (The Content Assembly)
目标：实现“中国关系地图”与各个 Tab 页面。

Master Prompt 04:
"最后，请实现 Persona 模块中的『中国关系地图』：

渲染一个中国省级行政区的 SVG 地图。

地图的路径颜色逻辑：如果 province_id 存在于 unlockedProvinces 中，填充色设为朱砂红，否则设为透明背景配石灰色细描边。

当新省份点亮时，在地图该位置触发一次 <SealStamp /> 动画。

请参考 src/data/samples.json（我将提供内容样板），为 Food 和 Places 模块填充 10 条具有『文学杂志调性』的硬编码数据。"