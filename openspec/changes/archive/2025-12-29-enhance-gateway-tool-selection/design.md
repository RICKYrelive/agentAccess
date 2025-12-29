# Design: enhance-gateway-tool-selection

## Context

当前 `CreateGatewayDialog.vue` 组件的工具选择区域是一个简单的多选框列表，当工具数量增多时，用户体验会显著下降。需要添加搜索、过滤和负载均衡组配置功能。

**Constraints:**
- 必须保持与现有 UI 风格一致
- 对话框高度需要控制，不能过长
- 现有数据模型需要扩展以支持负载均衡组

**Stakeholders:**
- 最终用户：需要方便地选择和配置 MCP 工具
- 开发团队：需要易于维护的代码结构

## Goals / Non-Goals

### Goals
1. 提供工具搜索和过滤功能
2. 实现负载均衡组配置
3. 优化工具选择界面布局
4. 扩展数据模型以支持新功能

### Non-Goals
- 实现真实的负载均衡逻辑
- 实现实时健康检查
- 重构整个网关管理功能

## Decisions

### 1. 工具选择界面布局

**决策**: 使用双栏布局，左侧为可用工具（带搜索过滤），右侧为已选工具和负载均衡组。

**理由**:
- 双栏布局是工具选择的常见模式，用户熟悉
- 可以清晰区分"可用"和"已选"状态
- 便于拖拽操作

**替代方案考虑**:
- 单栏布局 + 抽屉：需要额外的点击操作，不够直观
- 弹出对话框：会打断用户流程

### 2. 搜索和过滤实现

**决策**: 使用计算属性实现实时搜索和过滤。

```typescript
const searchQuery = ref('')
const filterType = ref<MCPToolType | 'all'>('all')
const filterStatus = ref<'enabled' | 'disabled' | 'all'>('all')
const filterCategory = ref<string>('all')

const filteredTools = computed(() => {
  return store.mcpTools.filter(tool => {
    // Search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      if (!tool.name.toLowerCase().includes(query) &&
          !tool.description.toLowerCase().includes(query)) {
        return false
      }
    }

    // Type filter
    if (filterType.value !== 'all' && tool.type !== filterType.value) {
      return false
    }

    // Status filter
    if (filterStatus.value === 'enabled' && !tool.isEnabled) {
      return false
    }
    if (filterStatus.value === 'disabled' && tool.isEnabled) {
      return false
    }

    // Category filter
    if (filterCategory.value !== 'all' && tool.category !== filterCategory.value) {
      return false
    }

    return true
  })
})
```

**理由**:
- 计算属性自动响应依赖变化，代码简洁
- 性能足够，对于几百个工具的规模没有问题

### 3. 负载均衡组数据模型

**决策**: 扩展现有数据模型，添加负载均衡组配置。

```typescript
interface LoadBalancerGroup {
  id: string
  name: string
  strategy: 'round-robin' | 'random' | 'least-used'
  toolIds: string[]
  healthCheck?: {
    enabled: boolean
    interval: number // seconds
    timeout: number // seconds
  }
  createdAt: Date
  updatedAt: Date
}

interface MCPGateway {
  id: string
  name: string
  description: string
  baseUrl: string
  mcpToolIds: string[]
  loadBalancerGroups: LoadBalancerGroup[] // 新增
  status: GatewayStatus
  createdAt: Date
  updatedAt: Date
}
```

**理由**:
- 负载均衡组是网关的子资源，放在 MCPGateway 内合适
- 策略使用枚举，便于扩展
- 健康检查为可选配置

**替代方案考虑**:
- 独立的负载均衡组资源：会增加系统复杂度，组与网关的关联需要额外管理

### 4. 负载均衡组 UI 组件

**决策**: 创建独立的 `LoadBalancerGroupConfig.vue` 组件。

**理由**:
- 组件职责单一，便于维护
- 可复用于其他需要配置负载均衡组的场景
- 便于测试

**组件结构**:
```
LoadBalancerGroupConfig.vue
├── 组列表展示（卡片或表格）
├── 创建/编辑组对话框
│   ├── 组名称输入
│   ├── 策略选择
│   ├── 工具选择（多选）
│   └── 健康检查配置（可选）
└── 组内工具管理（添加/移除/排序）
```

### 5. 过滤条件提取

**决策**: 从现有工具中动态提取类别，使用 Set 去重。

```typescript
const availableCategories = computed(() => {
  const categories = new Set(store.mcpTools.map(t => t.category))
  return Array.from(categories).sort()
})
```

**理由**:
- 不需要硬编码类别列表
- 自动适应新增工具类别

## Risks / Trade-offs

### Risk 1: 对话框高度问题

**风险**: 双栏布局 + 负载均衡组配置可能使对话框过高。

**缓解措施**:
- 使用固定高度 + 内部滚动
- 负载均衡组使用折叠/展开控制
- 限制每个区域的最大高度

### Risk 2: 数据模型变更影响

**风险**: 修改 MCPGateway 接口可能影响现有代码。

**缓解措施**:
- `loadBalancerGroups` 设置为可选数组
- 保持向后兼容，现有代码可以不处理新字段
- 更新相关类型定义

### Trade-off: 简单过滤 vs 高级搜索

**选择**: 当前实现简单的文本搜索 + 类别过滤，不使用复杂的搜索引擎。

**权衡**:
- 优点：实现简单，性能好，易于维护
- 缺点：不支持高级搜索语法（如 AND、OR、通配符）

对于当前工具数量规模（预计几十到几百个），简单过滤足够使用。

## Migration Plan

### Phase 1: 数据模型更新
1. 更新 `types.ts` 添加 `LoadBalancerGroup` 接口
2. 更新 `MCPGateway` 接口添加 `loadBalancerGroups` 字段
3. 更新 store 添加负载均衡组 CRUD 操作

### Phase 2: 工具选择界面重构
1. 重构 `CreateGatewayDialog.vue` 使用双栏布局
2. 添加搜索框和过滤器
3. 更新工具列表展示

### Phase 3: 负载均衡组组件
1. 创建 `LoadBalancerGroupConfig.vue` 组件
2. 实现组的创建、编辑、删除功能
3. 集成到 `CreateGatewayDialog.vue`

### Phase 4: 测试和验证
1. 测试搜索和过滤功能
2. 测试负载均衡组 CRUD
3. 测试数据持久化

### Rollback
如果需要回滚：
- 数据模型保持兼容，新字段为可选
- 恢复原有的简单多选框界面
- 移除新添加的组件

## Open Questions

1. **负载均衡策略实现**: 实际的负载均衡逻辑是在网关层还是 MCP 工具层？
   - 建议：本变更仅处理配置界面，实际实现留给后续

2. **健康检查实现**: 是否需要实时显示工具健康状态？
   - 建议：本变更仅保存健康检查配置，不实现实际检查

3. **组内工具顺序**: 是否支持调整组内工具顺序（用于优先级控制）？
   - 建议：第一阶段不支持，通过拖拽添加顺序隐式确定优先级
