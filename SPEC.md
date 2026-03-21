# SPEC.md — 《竞争的演化》互动叙事游戏

> 一个类似《信任的进化》的教育游戏，通过模拟+叙事让玩家理解：为什么全面发展才是破局之道。

---

## 1. Concept & Vision

### 核心玩法
玩家跟随一群小镇居民，经历"内卷"的诞生、巅峰与崩溃。每一章通过**叙事推进** → **玩家选择** → **模拟演示** → **教育总结**的循环，让玩家在互动中领悟"唯分数论"的弊端和"全面发展"的重要性。

### 游戏类型
- **叙事驱动 + 数值模拟**融合
- 类似《信任的进化》的选择型互动叙事
- 模拟层用数字说话，叙事层用情感共鸣

### 目标用户
- 中学生（初一～高二）
- 对"内卷"有感知的青少年
- 希望通过游戏理解成长道理的学生

### 核心感受
- **前期**：熟悉感（"这不就是我吗？"）
- **中期**：压迫感（"不卷不行啊？"）
- **转折**：惊讶感（"原来还有别的路？"）
- **后期**：成就感（"原来平衡最重要！"）

---

## 2. Design Language

### 视觉风格
- **风格**：扁平插画 + 漫画分镜风格
- **参考**：《信任的进化》的简洁画风 + 渐进式色彩变化
- **色调**：随着剧情发展从温暖 → 冷峻 → 希望的渐变

### 配色方案
```
主色调（乐观/起点）：#4A90D9（天蓝）
卷王色（竞争）：#E74C3C（警示红）
创哥色（创造）：#9B59B6（神秘紫）
均衡色（平衡）：#27AE60（生机绿）
背景色：#F5F5F5（浅灰白）
文字色：#333333（深灰黑）
辅助色：#F39C12（琥珀黄）
```

### 字体
- **标题**：`"Noto Sans SC", "PingFang SC", sans-serif` — 700 weight
- **正文**：`"Noto Sans SC", "PingFang SC", sans-serif` — 400 weight
- **数字/分数**：`"JetBrains Mono", "Fira Code", monospace`

### 间距系统
- **基准单位**：8px
- **页面边距**：24px（移动端 16px）
- **卡片间距**：16px
- **组件内间距**：12px

### 动效设计
- **叙事切换**：淡入淡出，300ms ease-out
- **选择按钮**：hover时scale(1.02)，150ms
- **图表动画**：逐线绘制，每条线200ms延迟入场
- **分数变化**：数字滚动效果，400ms

---

## 3. Layout & Structure

### 页面结构
```
┌─────────────────────────────────────────┐
│  Header: 章节标题 + 进度指示器           │
├─────────────────────────────────────────┤
│                                         │
│  主内容区（60vh）                        │
│  ┌─────────────────────────────────┐    │
│  │ 叙事区（漫画/对话框）             │    │
│  └─────────────────────────────────┘    │
│                                         │
├─────────────────────────────────────────┤
│  选择区（固定底部）                       │
│  ┌───────────┐  ┌───────────┐          │
│  │  选项 A   │  │  选项 B   │          │
│  └───────────┘  └───────────┘          │
├─────────────────────────────────────────┤
│  模拟演示区（展开时）                     │
│  ┌─────────────────────────────────┐    │
│  │ 图表 + 排名                     │    │
│  └─────────────────────────────────┘    │
├─────────────────────────────────────────┤
│  教育小结区                              │
│  📚 关键领悟：...                        │
└─────────────────────────────────────────┘
```

### 响应式策略
- **桌面端（>768px）**：双列选择按钮，图表全尺寸
- **移动端（≤768px）**：单列堆叠，图表缩放适配

### 章节流程
```
[开始] → [选择章节/重玩] → [第1章] → [第2章] → ... → [最终章] → [总结]
                ↑                              ↓
                └──────── [重新开始] ←─────────┘
```

---

## 4. Features & Interactions

### 核心功能

#### 4.1 叙事展示
- **漫画帧**：每章2-4帧插画，配合对话气泡
- **文字动画**：逐字显示，200ms/字
- **旁白**：斜体显示，与角色对话区分

#### 4.2 玩家选择
- 每章2个选择按钮
- 点击后：
  1. 按钮高亮
  2. 短暂暂停（300ms）
  3. 淡出当前章节
  4. 淡入下一章节
- 选择影响后续剧情和模拟参数

#### 4.3 模拟演示
- **触发时机**：选择后自动播放；或手动点击"查看模拟"
- **动画**：逐轮绘制分数曲线，每轮间隔100ms
- **交互**：
  - 鼠标悬停曲线：显示该角色当轮详细数据
  - 点击"暂停/继续"
  - 拖动进度条跳转到指定轮次
- **图例**：每条曲线标注角色类型和颜色

#### 4.4 分数排名
- 模拟结束后显示排名面板
- 前3名高亮（金/银/铜色）
- 被淘汰角色显示灰色 + 淘汰原因
- 数据展示：应试分 / 创造力 / 总分 / 系数

#### 4.5 教育小结
- 每章末尾自动显示
- 关键数据高亮
- 可展开/收起

### 角色系统

| 角色 | 代号 | 每轮分配 | 特点 |
|------|------|---------|------|
| 普通人 | normal | 8分应试，2分休息 | 基准线，注定被淘汰 |
| 卷王 | juanwang | 10分应试 | 纯卷，短期最强，最终停滞 |
| 创哥 | chuang-ge | 1分应试，2分创造，7分休息 | 纯创，两次被淘汰 |
| 均衡创哥 | balanced | 4分应试，4分创造，2分休息 | 均衡，最终登顶 |
| 顶级创哥 | balanced-king | 3分应试，5分创造，2分休息 | 全面，指数碾压 |

### 评分公式

#### 前4章（唯分数论）
```
排名分数 = 应试分（每轮累加）
淘汰规则：排名最后10%淘汰
```

#### 第5章起（新公式）
```
总分 = 应试分 + 创造力 × (系数 + 1)
系数 = min(应试分 / 100, 3)

淘汰规则：
- 纯创哥（应试≈50）：系数≈0.5，创造力×1.5，被锁死
- 纯卷王（应试≈275）：系数≈2.75，但创造力=0，总分=应试
- 均衡创哥（应试≈200）：系数≈2，创造力×3，指数爆发
```

### 状态管理
```typescript
interface GameState {
  currentChapter: number      // 当前章节 1-8
  playerChoice: 'A' | 'B' | null  // 当前章节的选择
  selectedRole: RoleType     // 玩家选择的角色
  simulationResults: RoundResult[] // 模拟结果
  isSimulationPlaying: boolean
  currentRound: number        // 当前播放到的轮次
}
```

### 错误处理
- **模拟错误**：显示友好提示"模拟出了点小问题，请重试"
- **章节数据缺失**：回退到默认章节
- **动画卡顿**：自动降级为静态图表

---

## 5. Component Inventory

### 5.1 NarrativePanel
叙事面板，展示漫画帧和对话
- **状态**：loading / playing / finished
- **动画**：帧之间300ms淡入淡出

### 5.2 ChoiceButton
选择按钮
- **状态**：default / hover / selected / disabled
- **样式**：
  - default：白底+深色边框
  - hover：轻微放大+阴影
  - selected：主色调背景+白色文字
  - disabled：灰色+50%透明度

### 5.3 SimulationChart
模拟图表（基于Chart.js或Recharts）
- **类型**：折线图
- **X轴**：轮次（1～N）
- **Y轴**：分数/总分
- **多条线**：每个角色一条线，不同颜色区分
- **交互**：悬停显示tooltip

### 5.4 RankingPanel
排名面板
- **布局**：垂直列表，每行一个角色
- **高亮**：前3名用金/银/铜色
- **淘汰**：灰色背景+删除线

### 5.5 EducationBox
教育小结框
- **样式**：浅绿背景+左侧竖条
- **可展开**：默认收起，只显示标题
- **展开内容**：完整小结文字

### 5.6 ProgressIndicator
顶部进度指示器
- **样式**：圆点序列，当前章节高亮
- **点击**：可跳转到已读章节（不可跳转到未读）

### 5.7 StartScreen
开始界面
- **元素**：游戏标题 + 简介 + "开始游戏"按钮
- **按钮样式**：主色调大按钮，居中

### 5.8 EndingScreen
结局界面
- **元素**：结局类型 + 总结文字 + 数据回顾 + "重新开始"按钮
- **结局类型**：4种（纯卷王结局/纯创哥结局/均衡创哥结局/顶级创哥结局）

---

## 6. Technical Approach

### 技术栈
- **框架**：React 18 + TypeScript
- **构建**：Vite
- **样式**：CSS Modules / styled-components
- **图表**：Recharts（React友好的图表库）
- **状态**：React useState + useContext（简单够用）
- **部署**：GitHub Pages / Vercel

### 项目结构
```
src/
├── App.tsx              # 主应用，状态管理
├── App.css              # 全局样式
├── main.tsx             # 入口
├── index.css            # CSS reset
├── simulation.ts        # 模拟逻辑（纯函数，可单元测试）
├── types.ts             # TypeScript类型定义
├── narrative.ts         # 叙事配置（章节数据）
├── components/
│   ├── NarrativePanel.tsx
│   ├── ChoiceButton.tsx
│   ├── SimulationChart.tsx
│   ├── RankingPanel.tsx
│   ├── EducationBox.tsx
│   ├── ProgressIndicator.tsx
│   ├── StartScreen.tsx
│   └── EndingScreen.tsx
└── assets/
    └── characters/      # 角色立绘
```

### 数据流
```
用户选择 → 更新GameState → 触发章节切换 → 执行模拟 → 渲染结果 → 显示教育小结
```

### 模拟层接口
```typescript
// src/simulation.ts

interface Player {
  id: string
  role: RoleType
  energy: number           // 当前精力上限
  examAbility: number     // 累计应试分
  creativity: number       // 累计创造力
  totalScore: number      // 当前总分
}

interface RoundResult {
  round: number
  players: Player[]
  averageEnergy: number
}

function runSimulation(
  roles: RoleType[],
  rounds: number,
  initialEnergy: number = 10
): RoundResult[]

function getFinalRanking(results: RoundResult[]): Player[]

function getScoreHistory(results: RoundResult[]): {
  round: number
  scores: Record<string, number>
}[]
```

### 叙事配置接口
```typescript
// src/narrative.ts

interface NarrativeBlock {
  type: 'text' | 'image' | 'dialogue'
  content: string
  character?: RoleType
}

interface Choice {
  label: string
  nextChapter: number | 'ending'
  roleChange?: RoleType
}

interface Chapter {
  id: number
  title: string
  narrative: NarrativeBlock[]
  choices: Choice[]
  simulationConfig?: {
    roles: RoleType[]
    rounds: number
    showFormula: boolean  // 是否显示新公式
  }
  education: string
}
```

### 关键实现细节

#### 精力惩罚机制
```typescript
// 连续5轮剩余精力 < 2，则精力上限 -1
if (consecutiveLowEnergy >= 5) {
  energy = Math.max(1, energy - 1)
}
```

#### 新公式计算
```typescript
function calculateTotalScore(exam: number, creativity: number): number {
  const coefficient = Math.min(exam / 100, 3)
  return exam + creativity * (coefficient + 1)
}
```

#### 动画时序
```typescript
// 模拟动画：每轮间隔100ms
for (let i = 0; i < rounds; i++) {
  await sleep(100)
  drawRound(i)
}
```

---

## 7. Milestones

### Phase 1: 基础框架
- [ ] 项目初始化（Vite + React + TS）
- [ ] 模拟层实现（runSimulation + 公式验证）
- [ ] 叙事配置数据结构
- [ ] 基础组件：NarrativePanel + ChoiceButton

### Phase 2: 核心功能
- [ ] 选择系统（状态 + 路由）
- [ ] SimulationChart组件
- [ ] RankingPanel组件
- [ ] 8章叙事内容填充

### Phase 3: 完善体验
- [ ] 动画效果（叙事 + 图表）
- [ ] 教育小结组件
- [ ] 开始/结局界面
- [ ] 进度指示器

### Phase 4: 发布准备
- [ ] 响应式适配
- [ ] 性能优化
- [ ] 部署到GitHub Pages
- [ ] 微信/飞书内嵌适配
