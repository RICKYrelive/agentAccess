# Access Template Management - Technical Design

## Context

Access 模板功能需要让用户保存和分享 Access 配置（Agent 选择、知识库、MCP 工具、系统工具、记忆体等），以提升团队协作效率。

**Stakeholders:**
- 团队成员：需要快速应用标准化的 Access 配置
- 团队管理员：需要管理和分发团队模板
- 普通用户：需要保存个人常用配置

**Constraints:**
- 必须与现有 Access 页面无缝集成
- 不能影响现有 Access 发送消息的流程
- 权限控制必须与现有团队系统对齐

## Goals / Non-Goals

**Goals:**
- 用户可以从当前配置创建模板
- 用户可以应用已有模板快速配置 Access
- 支持模板的权限管理（个人、团队、公开）
- 在 Access 会话中可以编辑当前配置
- 提供模板管理页面进行统一管理

**Non-Goals:**
- 不支持会话内容的分享（只分享配置）
- 不支持模板的版本历史（MVP 阶段）
- 不支持跨组织的模板分发
- 不支持模板的导入/导出（MVP 阶段）

## Decisions

### 1. 数据模型

**Decision:** 使用嵌套对象存储配置，而非扁平化

```typescript
interface AccessTemplate {
  id: string
  name: string
  description: string
  category: 'personal' | 'team' | 'public'
  config: {
    myAgents: string[]
    teamAgents: string[]
    knowledgeBase?: string
    mcpTools?: string[]
    systemTools?: string[]
    memory?: string
  }
  permissions: {
    type: 'owner' | 'team' | 'public' | 'specific'
    owner: string
    teamIds?: string[]
    userIds?: string[]
    allowCopy: boolean
  }
  stats: {
    usageCount: number
    lastUsedAt?: Date
  }
  createdBy: string
  createdAt: Date
  updatedAt: Date
}
```

**Rationale:** 嵌套结构清晰反映配置的层次关系，便于扩展和维护。

### 2. 存储位置

**Decision:** 模板数据存储在独立的 Pinia store 中

**Options considered:**
- A. 存储在 chatStore 中
- B. 存储在独立的 accessTemplateStore 中 ✓
- C. 存储在 localStorage 中

**Rationale:** 独立 store 便于管理模板生命周期，不与聊天逻辑耦合。

### 3. 应用模板的时机

**Decision:** 模板应用为"建议性填充"，用户可以继续修改

**Rationale:** 保持用户对配置的完全控制权，模板只是起点。

### 4. 会话中编辑配置

**Decision:** 支持在 ChatInterface 中编辑配置并重新发送消息

**Rationale:** 用户可能发现配置不适合当前任务，需要快速调整。

### 5. 权限模型

**Decision:** 采用四级权限模型

1. **owner**: 仅创建者可见和编辑
2. **team**: 指定团队成员可见和使用
3. **public**: 所有人可见和使用
4. **specific**: 指定用户可见和使用

**Rationale:** 覆盖个人到公开的所有使用场景，与现有团队系统对齐。

## Architecture

### Component Structure

```
src/components/access-template/
├── AccessTemplateManagementPage.vue    # 模板管理主页面
├── TemplateCard.vue                     # 模板卡片组件
├── CreateTemplateDialog.vue             # 创建/编辑模板对话框
├── ApplyTemplateDialog.vue              # 应用模板对话框
├── ShareSettingsDialog.vue              # 分享设置对话框
├── EditConfigDialog.vue                  # 编辑配置对话框
└── TemplateList.vue                     # 模板列表组件
```

### Store Structure

```typescript
// src/stores/accessTemplate.ts
export const useAccessTemplateStore = defineStore('accessTemplate', () => {
  const templates = ref<AccessTemplate[]>([])

  // CRUD operations
  const createTemplate = (data: Omit<AccessTemplate, 'id' | 'stats' | 'createdAt' | 'updatedAt'>) => {}
  const updateTemplate = (id: string, updates: Partial<AccessTemplate>) => {}
  const deleteTemplate = (id: string) => {}
  const getTemplate = (id: string) => {}

  // Filter operations
  const getPersonalTemplates = () => {}
  const getTeamTemplates = () => {}
  const getPublicTemplates = () => {}

  // Permission checks
  const canAccessTemplate = (template: AccessTemplate, userId: string) => {}
  const canEditTemplate = (template: AccessTemplate, userId: string) => {}

  // Statistics
  const incrementUsage = (templateId: string) => {}

  return { templates, createTemplate, updateTemplate, deleteTemplate, ... }
})
```

### User Flow

#### Flow 1: 从当前配置创建模板

```
1. 用户在"发起 Access"页面配置好各项选项
2. 点击"保存为模板"按钮
3. 弹出创建模板对话框
   - 输入模板名称、描述
   - 选择分类（个人/团队/公开）
   - 配置分享权限
4. 保存模板
5. 模板出现在模板管理页面
```

#### Flow 2: 应用已有模板

```
1. 用户在"发起 Access"页面
2. 点击"应用模板"按钮
3. 弹出模板选择对话框
   - 浏览/搜索模板
   - 查看模板详情
4. 选择模板并点击"应用"
5. 配置自动填充到各个选项
6. 用户可以继续调整配置
7. 发送消息时使用最终配置
```

#### Flow 3: 在会话中编辑配置

```
1. 用户在 ChatInterface 中发现配置需要调整
2. 点击"编辑配置"按钮
3. 弹出配置编辑对话框
   - 修改 Agent 选择
   - 修改知识库、MCP 工具等
4. 保存并重新发送当前消息
5. 系统使用新配置重新处理消息
```

## UI/UX Considerations

### 1. 模板管理入口
- 在发起 Access 页面添加"管理分享"按钮
- 在侧边栏添加"Access 模板管理"菜单项

### 2. 应用模板入口
- 在发起 Access 页面配置面板标题旁添加"应用模板"按钮
- 支持通过快捷键打开模板选择器

### 3. 保存模板入口
- 在配置面板底部添加"保存为模板"链接
- 在模板选择器中添加"从当前配置创建"按钮

### 4. 视觉一致性
- 模板卡片样式与 MCP/Memory 卡片保持一致
- 使用相同的颜色和圆角规范
- 保持图标风格统一

## Risks / Trade-offs

### Risk 1: 配置复杂度
**Risk:** 模板配置选项过多，用户难以选择
**Mitigation:** 提供模板预览，显示包含的关键配置项；添加推荐和分类

### Risk 2: 权限混淆
**Risk:** 用户不清楚不同权限级别的区别
**Mitigation:** 在权限选择时提供清晰的说明和示例

### Risk 3: 模板滥用
**Risk:** 用户创建过多模板，导致管理困难
**Mitigation:** 限制个人模板数量（如 20 个），提供归档功能

### Trade-off: 模板复用 vs 灵活性
**Trade-off:** 模板应用后是否锁定配置
**Decision:** 不锁定，用户可以继续修改，模板只是起点

## Migration Plan

### Phase 1: MVP (当前范围)
- 个人模板的创建、应用、管理
- 基础的团队分享功能
- 会话中配置编辑

### Phase 2: 增强功能
- 公开模板市场
- 模板评分和推荐
- 模板导入/导出
- 模板使用分析

### Rollback
- 如需回滚，移除模板管理相关组件和路由
- 删除 accessTemplateStore
- ContentArea 恢复原状

## Open Questions

1. ~~是否需要支持模板的嵌套（模板引用其他模板）？~~ → 否，MVP 不支持
2. ~~是否需要模板的版本历史？~~ → 否，MVP 不支持
3. 模板删除后，已应用该模板的会话是否受影响？ → 不受影响
4. 是否需要模板的审核机制（团队模板、公开模板）？ → MVP 不需要
