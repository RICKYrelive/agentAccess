# Design: redesign-mcp-management

## Context

当前应用的 MCP 工具功能仅在侧边栏中以展开菜单的形式存在，没有独立的管理页面。用户需要一个更完整、更易用的界面来管理 MCP 工具和网关。

**Constraints:**
- 必须保持现有的 Vue 3 + TypeScript 架构
- 必须与现有 UI 风格一致
- 当前使用模拟数据，不依赖真实后端

**Stakeholders:**
- 最终用户：需要方便地管理 MCP 工具和网关
- 开发团队：需要易于维护和扩展的代码结构

## Goals / Non-Goals

### Goals
1. 创建两个独立的管理页面：MCP 工具和 MCP 网关
2. 提供完整的 CRUD 操作界面
3. 支持三种 MCP 工具创建方式
4. 支持 OpenAPI 文件导入生成 MCP 工具
5. 保持与现有 UI 组件和样式的一致性

### Non-Goals
- 实现真实的 MCP 服务器连接（保持模拟实现）
- 实现真实的 npx/uvx 进程管理
- 实现真实的网关部署和服务

## Decisions

### 1. 组件架构

**决策**: 创建两个新的页面组件，遵循现有的页面组件模式。

```
src/components/mcp-management/
├── MCPToolsPage.vue          # MCP 工具管理页面
├── MCPGatewayPage.vue        # MCP 网关管理页面
├── CreateMCPToolDialog.vue   # 创建 MCP 工具对话框
├── CreateGatewayDialog.vue   # 创建网关对话框
├── OpenAPIImportDialog.vue   # OpenAPI 导入对话框
└── types.ts                  # MCP 管理相关类型定义
```

**理由**: 与现有的 `MyAgentsPage`、`KnowledgeBasePage` 等组件保持一致的架构，便于理解和维护。

### 2. 数据存储

**决策**: 使用 Pinia store 管理 MCP 工具和网关的状态。

```typescript
// src/stores/mcpManagement.ts
export interface MCPTool {
  id: string
  name: string
  description: string
  type: 'builtin' | 'custom' | 'npx' | 'uvx'
  category: string
  isEnabled: boolean
  status: 'active' | 'inactive' | 'error'
  config: MCPToolConfig
  createdAt: Date
  updatedAt: Date
}

export interface MCPGateway {
  id: string
  name: string
  description: string
  baseUrl: string
  mcpToolIds: string[]
  status: 'running' | 'stopped' | 'error'
  createdAt: Date
  updatedAt: Date
}

export interface MCPToolConfig {
  // Custom tool config
  url?: string
  authType?: 'none' | 'apikey' | 'bearer'
  apiKey?: string
  bearerToken?: string
  // npx/uvx config
  packageName?: string
  version?: string
  author?: string
}
```

**理由**: 与现有的 `useChatStore`、`useAgentsStore` 等保持一致，便于状态管理和持久化。

### 3. 内置工具商店

**决策**: 创建静态的内置工具列表，模拟官方商店。

```typescript
const builtinMCPTools = [
  {
    id: 'builtin-translation',
    name: '翻译助手',
    description: '多语言翻译工具',
    category: 'utility',
    icon: 'translate',
  },
  {
    id: 'builtin-code-analysis',
    name: '代码分析',
    description: '代码质量分析和优化建议',
    category: 'development',
    icon: 'code',
  },
  // ... 更多内置工具
]
```

**理由**: 不依赖外部 API，保持简单可演示。

**替代方案考虑**:
- 调用真实 API 获取工具列表：过于复杂，需要后端支持
- 使用本地 JSON 文件：与代码中定义差别不大

### 4. OpenAPI 解析

**决策**: 在前端使用 JavaScript 解析 OpenAPI 文件，提取端点信息。

```typescript
function parseOpenAPIFile(content: string, format: 'json' | 'yaml') {
  const spec = format === 'yaml' ? parseYAML(content) : JSON.parse(content)
  const endpoints = extractEndpoints(spec)
  return generateMCPToolsFromEndpoints(endpoints)
}
```

**理由**: 纯前端实现，无需后端支持。使用轻量级 YAML 解析库。

**替代方案考虑**:
- 后端解析：需要额外的 API 开发
- 不解析 OpenAPI：功能受限

### 5. 侧边栏菜单结构

**决策**: 将现有的"MCP 工具"改名为"MCP 管理"，添加可展开的子菜单。

```vue
<!-- MCP Management Section -->
<div>
  <button @click="toggleMCPManagement">
    <svg>...</svg>
    <span>MCP 管理</span>
    <svg :class="{ 'rotate-90': isMCPManagementOpen }">...</svg>
  </button>
  <div v-if="isMCPManagementOpen" class="ml-8 space-y-1">
    <button @click="switchToView('mcp-tools')">MCP 工具</button>
    <button @click="switchToView('mcp-gateway')">MCP 网关</button>
  </div>
</div>
```

**理由**: 与"我的 Agent"、"团队 Agent"等现有菜单保持一致的交互模式。

### 6. 视图管理

**决策**: 在 `AppLayout.vue` 中添加两个新的视图状态。

```typescript
const activeView = ref<
  | 'home'
  | 'workflow'
  | 'my-agents'
  | 'team-agents'
  | 'team-detail'
  | 'mcp-tools'      // 新增
  | 'mcp-gateway'    // 新增
  | 'system-tools'
  | 'memory'
  | 'knowledge-base'
  | 'knowledge-base-detail'
>('home')
```

**理由**: 与现有的视图管理方式保持一致，最小化代码变更。

## Risks / Trade-offs

### Risk 1: OpenAPI 解析复杂性

**风险**: OpenAPI 规范复杂，前端解析可能处理不全所有情况。

**缓解措施**:
- 支持 OpenAPI 3.0 的核心功能
- 提供明确的错误提示
- 允许用户手动调整生成的工具配置

### Risk 2: npx/uvx 进程管理

**风险**: 前端无法真正管理进程，仅配置界面可能让用户困惑。

**缓解措施**:
- 在界面上明确标注"配置功能，实际部署需要后端支持"
- 提供完整的配置界面，便于后续集成真实功能

### Trade-off: 模拟数据 vs 真实功能

**选择**: 当前使用模拟数据，专注于 UI 和交互设计。

**权衡**:
- 优点：快速开发演示，不依赖后端
- 缺点：无法真实测试功能

## Migration Plan

### Phase 1: 侧边栏菜单更新
1. 修改 `SidebarNavigation.vue`，将"MCP 工具"改为"MCP 管理"
2. 添加两个子菜单项
3. 更新展开/折叠逻辑

### Phase 2: MCP 工具页面
1. 创建 `MCPToolsPage.vue` 组件
2. 创建 `CreateMCPToolDialog.vue` 组件
3. 创建 `useMCPManagementStore` store
4. 在 `AppLayout.vue` 中添加视图路由

### Phase 3: MCP 网关页面
1. 创建 `MCPGatewayPage.vue` 组件
2. 创建 `CreateGatewayDialog.vue` 组件
3. 创建 `OpenAPIImportDialog.vue` 组件
4. 在 `AppLayout.vue` 中添加视图路由

### Rollback
如果需要回滚，删除新增组件，恢复 `SidebarNavigation.vue` 中的原有菜单结构即可。所有变更都在前端，不影响后端。

## Open Questions

1. **OpenAPI 解析库选择**: 使用 `js-yaml` 还是其他轻量级库？
   - 建议：使用 `js-yaml`，稳定且广泛使用

2. **npx/uvx 镜像信息来源**: 是从 npm/pyPI API 获取还是手动输入？
   - 建议：先支持手动输入，后续可考虑集成 API

3. **网关状态监控**: 如何模拟网关的运行状态？
   - 建议：在 store 中添加状态字段，可手动切换进行演示
