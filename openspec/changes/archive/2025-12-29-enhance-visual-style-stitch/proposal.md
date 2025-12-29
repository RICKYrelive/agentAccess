# enhance-visual-style-stitch

## Why

当前项目的 UI 视觉风格较为朴素，缺乏现代感和品牌一致性。通过参考 Stitch 提供的三个高质量设计示例，可以大幅提升用户体验和视觉吸引力，同时保持功能不变。

## What Changes

基于 `/draft/stitch` 目录中的三个设计示例，统一和优化整个项目的视觉风格，包括：

1. **颜色系统升级** - 采用现代 Slate 色系和统一的蓝色主色调
2. **字体系统** - 引入 Space Grotesk 作为标题字体，提升品牌识别度
3. **圆角和阴影** - 使用更现代的圆角值和柔和阴影系统
4. **组件样式统一** - 统一按钮、卡片、输入框等基础组件的视觉风格
5. **微交互增强** - 添加细微的过渡动画和 hover 效果

## Scope

- ✅ **包含**: 所有 UI 组件的视觉样式优化（颜色、字体、圆角、阴影、动画）
- ❌ **不包含**: 功能逻辑变更、组件结构重构、数据流修改

## Affected Components

- `layout/` - AppLayout, ContentArea, ChatInterface
- `mcp-management/` - MCP 管理相关组件
- `my-agents/` - 我的 Agent 页面
- `team-agents/` - 团队 Agent 页面
- `settings/` - 设置页面
- `knowledge-base/` - 知识库管理页面
- `config/` - 配置相关组件
- `workflow/` - **工作流编辑器组件**（画布、节点、连接线、小地图等）

## Two Distinct UI Styles

本提案需要同时优化两种不同风格的 UI：

### 1. 聊天风格 (Chat Style)
基于 Stitch 示例的现代聊天界面设计：
- 消息气泡样式
- 输入框和发送按钮
- 对话列表和侧边栏
- 工具调用指示器
- 附件和变量面板

### 2. 工作流风格 (Workflow Style)
画布式编辑器设计，具有独特的视觉需求：
- 画布网格背景
- 可拖拽节点（不同类型有不同颜色标识）
- 连接线（SVG 曲线，虚线样式）
- 节点输入/输出连接点
- 小地图导航
- 浮动控制按钮
- 节点配置面板

## Design Approach

### 从 Stitch 示例提取的核心设计模式

1. **颜色系统**：
   - Background: `#f8fafc` (slate-50)
   - Surface: `#ffffff` (white)
   - Primary: `#3b82f6` (blue-500)
   - Text Main: `#0f172a` (slate-900)
   - Text Muted: `#64748b` (slate-500)
   - Border: `#e2e8f0` (slate-200)

2. **字体系统**：
   - Display/Headings: Space Grotesk (300-700)
   - Body: 保持原有字体

3. **圆角系统**：
   - sm: `0.5rem` (8px)
   - md: `0.75rem` (12px)
   - lg: `1rem` (16px)
   - xl: `1.25rem` (20px)
   - 2xl: `1.5rem` (24px)

4. **阴影系统**：
   - card: `0 4px 6px -1px rgba(0, 0, 0, 0.05)`
   - floating: `0 10px 15px -3px rgba(0, 0, 0, 0.08)`
   - glow: `0 0 15px rgba(59, 130, 246, 0.3)`

5. **动画**：
   - Hover transitions: `200ms cubic-bezier(0.4, 0, 0.2, 1)`
   - Icon scale: `scale(1.1)` on hover
   - Button lift: `translateY(-0.5px)` on hover

## Implementation Notes

- 仅修改 CSS/Tailwind 类名和样式定义
- 不改变组件的 props、events 或数据流
- 保持现有组件的类名结构，优先通过样式覆盖实现
- 在 `tailwind.config.js` 中集中定义设计 token
- 在全局 CSS 中添加统一的动画和效果类
