# enhance-visual-style-stitch - Design Document

## Overview

本文档详细说明如何将 Stitch 设计风格应用到 AgentAccess 项目中，确保视觉一致性的同时保持所有功能不变。

## Design System Migration

### 1. Color System

#### Current Issues
- 颜色值分散在各个组件中，缺乏统一管理
- primary 颜色在不同位置有差异（purple vs blue）
- 缺乏系统的色阶定义

#### Target Design Token

```javascript
// tailwind.config.js theme.extend.colors
{
  primary: {
    DEFAULT: '#3b82f6',    // blue-500
    dark: '#2563eb',       // blue-600
    light: '#60a5fa',      // blue-400
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
  },
  slate: {
    50: '#f8fafc',   // background
    100: '#f1f5f9',
    200: '#e2e8f0',  // border
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',  // text-muted
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',  // text-main
    950: '#020617',
  },
  surface: '#ffffff',
  canvas: '#f8fafc',
}
```

### 2. Typography

#### Font Loading Strategy

```html
<!-- index.html -->
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
```

#### Tailwind Config

```javascript
theme.extend.fontFamily = {
  display: ['Space Grotesk', 'sans-serif'],
  body: ['Inter', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'],
}
```

#### Usage Guidelines
- `font-display`: 所有标题 (h1-h6), 标签, 导航文本
- `font-body`: 正文内容, 描述文本
- `font-mono`: 代码, 命令, ID, 技术术语

### 3. Border Radius System

```javascript
theme.extend.borderRadius = {
  'none': '0',
  'sm': '0.25rem',   // 4px
  'DEFAULT': '0.375rem',  // 6px
  'md': '0.5rem',    // 8px
  'lg': '0.75rem',   // 12px
  'xl': '1rem',      // 16px
  '2xl': '1.5rem',   // 24px
  '3xl': '2rem',     // 32px
  'full': '9999px',
}
```

### 4. Shadow System

```javascript
theme.extend.boxShadow = {
  // 基础阴影
  'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',

  // 卡片阴影
  'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',

  // 浮动元素阴影
  'floating': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',

  // 发光效果
  'glow': '0 0 15px rgba(59, 130, 246, 0.3)',
  'glow-lg': '0 0 25px rgba(59, 130, 246, 0.4)',

  // 内阴影
  'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
}
```

### 5. Animation & Transitions

```css
/* globals.css */
:root {
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* 通用过渡类 */
.transition-base {
  transition: all var(--transition-base);
}

/* Hover 效果 */
.hover-lift {
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
}

/* 图标缩放 */
.icon-scale {
  transition: transform var(--transition-fast);
}

.icon-scale:hover {
  transform: scale(1.1);
}

/* 脉搏动画 */
@keyframes subtle-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.animate-subtle-pulse {
  animation: subtle-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

## Component Style Guide

### Buttons

```vue
<!-- Primary Button -->
<button class="
  px-5 py-2.5 rounded-xl
  bg-primary text-white
  font-semibold shadow-lg shadow-primary/25
  hover:bg-primary-dark hover:shadow-primary/40 hover:-translate-y-0.5
  transition-all duration-200
">
  Button Text
</button>

<!-- Secondary Button -->
<button class="
  px-5 py-2.5 rounded-xl
  bg-white border border-slate-200 text-slate-900
  font-semibold shadow-sm
  hover:border-primary/50 hover:text-primary hover:shadow-lg
  transition-all duration-200
">
  Button Text
</button>

<!-- Icon Button -->
<button class="
  size-10 rounded-full
  border border-slate-200 bg-white
  text-slate-500 hover:text-primary hover:border-primary
  transition-all duration-200 shadow-sm
">
  <span class="material-symbols-outlined">icon</span>
</button>
```

### Cards

```vue
<div class="
  p-6 rounded-2xl
  bg-white border border-slate-200
  shadow-sm
  hover:border-primary/30 hover:shadow-md
  transition-all duration-200
">
  <!-- Card Content -->
</div>
```

### Inputs

```vue
<input class="
  w-full px-4 py-2.5 rounded-lg
  bg-white border border-slate-200 text-slate-900
  focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10
  placeholder:text-slate-400
  transition-all duration-200
" />

<!-- With Icon -->
<div class="relative">
  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
    <span class="material-symbols-outlined">search</span>
  </span>
  <input class="
    w-full pl-10 pr-4 py-2.5 rounded-lg
    bg-white border border-slate-200 text-slate-900
    focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10
    transition-all duration-200
  " />
</div>
```

### Navigation Items

```vue
<a class="
  flex items-center gap-3 px-4 py-3 rounded-xl
  text-slate-500 hover:bg-slate-50 hover:text-primary
  font-medium transition-all duration-200 group
">
  <span class="material-symbols-outlined group-hover:scale-110 transition-transform">
    icon
  </span>
  <span>Nav Item</span>
</a>

<!-- Active State -->
<a class="
  flex items-center gap-3 px-4 py-3 rounded-xl
  bg-primary/5 text-primary font-semibold
">
  <span class="material-symbols-outlined fill">icon</span>
  <span>Active Item</span>
</a>
```

### Status Badges

```vue
<!-- Success -->
<span class="inline-flex items-center gap-1 px-2 py-1 rounded-full
  bg-green-100 text-green-700 text-xs font-semibold">
  <span class="material-symbols-outlined text-sm">check_circle</span>
  Success
</span>

<!-- Warning -->
<span class="inline-flex items-center gap-1 px-2 py-1 rounded-full
  bg-amber-100 text-amber-700 text-xs font-semibold">
  Warning
</span>

<!-- Error -->
<span class="inline-flex items-center gap-1 px-2 py-1 rounded-full
  bg-red-100 text-red-700 text-xs font-semibold">
  Error
</span>
```

## Workflow Editor Components

### Canvas Background

```css
/* Dot grid pattern for workflow canvas */
.workflow-canvas {
  background-color: #f8fafc; /* slate-50 */
}

.canvas-background {
  background-color: #f8fafc;
  background-image: radial-gradient(circle, #cbd5e1 1.5px, transparent 1.5px);
  background-size: 24px 24px;
  background-position: -1px -1px;
}
```

### Workflow Nodes

```vue
<!-- Base Node Structure -->
<div class="
  workflow-node
  bg-white border-2 rounded-xl shadow-sm
  min-w-[200px] max-w-[250px]
  transition-all duration-200
  hover:-translate-y-0.5 hover:shadow-md
">
  <!-- Node Content -->
  <div class="flex items-center gap-3 p-3">
    <!-- Icon -->
    <div class="w-10 h-10 rounded-lg flex items-center justify-center">
      <span class="material-symbols-outlined">icon</span>
    </div>
    <!-- Text -->
    <div class="flex-1 min-w-0">
      <p class="text-sm font-semibold text-slate-900">Node Name</p>
      <p class="text-xs text-slate-500">Description</p>
    </div>
  </div>
</div>

<!-- Selected State -->
<div class="border-primary shadow-lg shadow-primary/10 ring-2 ring-primary/20">
  <!-- Same content -->
</div>
```

### Node Type Colors

```javascript
// Node type color mapping
const nodeTypeColors = {
  'start': { bg: 'bg-purple-100', text: 'text-purple-600', border: 'ring-purple-500' },
  'input': { bg: 'bg-purple-100', text: 'text-purple-600', border: 'ring-purple-500' },
  'web-search': { bg: 'bg-cyan-100', text: 'text-cyan-600', border: 'ring-cyan-500' },
  'annotated-data-retrieval': { bg: 'bg-blue-100', text: 'text-blue-600', border: 'ring-blue-500' },
  'question-rewrite': { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'ring-indigo-500' },
  'knowledge-retrieval': { bg: 'bg-orange-100', text: 'text-orange-600', border: 'ring-orange-500' },
  'llm-call': { bg: 'bg-rose-100', text: 'text-rose-600', border: 'ring-rose-500' },
  'data-processing': { bg: 'bg-amber-100', text: 'text-amber-600', border: 'ring-amber-500' },
  'condition': { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'ring-yellow-500' },
  'code-execution': { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'ring-emerald-500' },
  'output': { bg: 'bg-teal-100', text: 'text-teal-600', border: 'ring-teal-500' },
  'end': { bg: 'bg-slate-100', text: 'text-slate-600', border: 'ring-slate-500' },
}
```

### Connection Points

```vue
<!-- Output Point (right side) -->
<div class="
  absolute top-1/2 right-0
  transform translate-x-1/2 -translate-y-1/2
  w-3 h-3
  bg-primary border-2 border-white rounded-full
  cursor-pointer
  hover:bg-primary-dark hover:scale-125
  transition-all duration-150
">
</div>

<!-- Input Point (left side) -->
<div class="
  absolute top-1/2 left-0
  transform -translate-x-1/2 -translate-y-1/2
  w-3 h-3
  bg-slate-400 border-2 border-white rounded-full
  cursor-pointer
  hover:bg-slate-500 hover:scale-125
  transition-all duration-150
">
</div>
```

### Connection Lines (SVG)

```svg
<!-- Standard connection -->
<path
  d="M startX startY L endX endY"
  stroke="#9ca3af"
  stroke-width="2"
  fill="none"
  stroke-dasharray="6,4"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="transition-all duration-200"
/>

<!-- Selected connection -->
<path
  d="M startX startY L endX endY"
  stroke="#3b82f6"
  stroke-width="3"
  fill="none"
  stroke-dasharray="6,4"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="transition-all duration-200"
/>

<!-- Active connection (being drawn) -->
<path
  d="M startX startY L endX endY"
  stroke="#3b82f6"
  stroke-width="2"
  fill="none"
  stroke-dasharray="6,4"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="animate-pulse"
/>
```

### Node Palette Items

```vue
<!-- Draggable node type in palette -->
<div class="
  p-3
  bg-slate-50 border border-slate-200 rounded-xl
  cursor-move
  hover:bg-white hover:border-primary/30 hover:shadow-sm
  transition-all duration-200
">
  <div class="flex items-center gap-3">
    <div class="w-8 h-8 rounded-full flex items-center justify-center">
      <span class="material-symbols-outlined">icon</span>
    </div>
    <div class="min-w-0">
      <p class="text-sm font-medium text-slate-900">Node Type</p>
      <p class="text-xs text-slate-500">Description</p>
    </div>
  </div>
</div>
```

### Mini Map

```vue
<div class="
  mini-map
  absolute bottom-4 right-4
  w-48 h-36
  bg-white/90 backdrop-blur-sm
  border border-slate-200 rounded-lg
  shadow-lg
  overflow-hidden
">
  <!-- Mini map canvas -->
  <div class="w-full h-full bg-slate-50">
    <!-- Mini nodes representation -->
  </div>
</div>
```

### Floating Canvas Controls

```vue
<div class="
  absolute top-4 left-1/2
  -translate-x-1/2
  flex items-center gap-2
  bg-white/90 backdrop-blur-sm
  border border-slate-200 rounded-lg
  shadow-lg
  px-2 py-1
">
  <button class="
    p-2 rounded-lg
    text-slate-500 hover:text-primary hover:bg-slate-50
    transition-all duration-150
  ">
    <span class="material-symbols-outlined text-lg">zoom_in</span>
  </button>
  <button class="
    p-2 rounded-lg
    text-slate-500 hover:text-primary hover:bg-slate-50
    transition-all duration-150
  ">
    <span class="material-symbols-outlined text-lg">zoom_out</span>
  </button>
  <button class="
    p-2 rounded-lg
    text-slate-500 hover:text-primary hover:bg-slate-50
    transition-all duration-150
  ">
    <span class="material-symbols-outlined text-lg">fit_screen</span>
  </button>
</div>
```

### Toolbar (Top of Canvas)

```vue
<div class="
  bg-white border-b border-slate-200
  px-4 py-3
  shadow-sm
">
  <div class="flex items-center justify-between">
    <!-- Left: Agent name and stats -->
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined text-slate-600">account_tree</span>
        <input class="text-lg font-semibold text-slate-900 border-none focus:ring-0" />
      </div>
      <div class="flex items-center gap-2 text-sm text-slate-500">
        <span>节点: {{ nodeCount }}</span>
        <span class="text-slate-300">•</span>
        <span>连接: {{ connectionCount }}</span>
      </div>
    </div>
    <!-- Right: Action buttons -->
    <div class="flex items-center gap-2">
      <button class="btn-primary">保存</button>
      <button class="btn-secondary">导出</button>
    </div>
  </div>
</div>
```

## Scrollbar Styling

```css
/* globals.css */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
```

## Migration Strategy

### Phase 1: Foundation (优先级最高)
1. 更新 `tailwind.config.js` - 添加颜色、字体、阴影定义
2. 更新 `index.html` - 加载 Google Fonts (Space Grotesk)
3. 创建/更新 `globals.css` - 添加全局样式、动画、滚动条

### Phase 2: Core Components
1. AppLayout.vue - 主布局样式
2. ContentArea.vue - 内容区域样式
3. ChatInterface.vue - 聊天界面样式

### Phase 3: Feature Components
1. mcp-management/* - MCP 管理组件
2. my-agents/* - 我的 Agent
3. team-agents/* - 团队 Agent
4. knowledge-base/* - 知识库管理
5. settings/* - 设置页面

### Phase 4: Workflow Editor Components
1. WorkflowCanvas.vue - 画布背景、工具栏、画布交互
2. WorkflowNode.vue - 节点样式、选中状态、连接点
3. NodeConfigPanel.vue - 节点配置面板
4. FloatingCanvasControls.vue - 浮动控制按钮
5. MiniMap.vue - 小地图样式
6. PreviewPanel.vue - 预览面板

### Phase 5: Polish
1. 统一图标使用 (Material Symbols Outlined)
2. 添加微交互动画
3. 响应式适配
4. 可访问性检查

## Testing & Validation

### Visual Regression Testing
- 在每个 Phase 完成后进行截图对比
- 确保功能正常工作
- 检查不同屏幕尺寸下的表现

### Browser Testing
- Chrome/Edge (主要)
- Safari (次要)
- Firefox (次要)

### Accessibility Check
- 颜色对比度符合 WCAG AA 标准
- 键盘导航正常工作
- 屏幕阅读器友好

## Rollback Plan

如果出现问题，可以通过 Git 快速回退：
- 每个 Phase 作为单独的 commit
- 使用清晰的 commit message 描述变更范围
- 保留原始样式文件作为备份

## References

- Stitch 示例 1: Agent Composer Dashboard
- Stitch 示例 2: Tool Management Page
- Stitch 示例 3: Tool Management (Alternative)
- Tailwind CSS Documentation: https://tailwindcss.com/docs
- Google Fonts: Space Grotesk
- Material Symbols: https://fonts.google.com/icons
