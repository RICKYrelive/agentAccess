# Design: 知识库团队共享功能

## Data Model Extensions

### KnowledgeBase 接口扩展

```typescript
export interface KnowledgeBase {
  id: string
  name: string
  description: string
  type: KnowledgeBaseType
  sourceInfo: KnowledgeBaseSourceInfo
  config: KnowledgeBaseConfig
  createdAt: Date
  updatedAt: Date

  // NEW: Team sharing fields
  owner: string                    // 创建者 ID
  category: 'personal' | 'team'    // 知识库分类
  sharedTeams?: TeamSharing[]       // 共享的团队列表
  permission: 'owner' | 'team' | 'public' | 'specific'  // 权限类型
}

export interface TeamSharing {
  teamId: string
  teamName: string
  permission: 'read' | 'write'     // 读写权限
  addedAt: Date
  addedBy: string                  // 添加共享的用户 ID
}
```

### 设计决策

#### 1. 分类 vs 权限分离
- **category**: 决定知识库在 UI 中的显示位置（我的知识库 vs 团队知识库）
- **permission**: 控制谁能访问这个知识库

#### 2. 权限模型（参考 Access Template）
- **owner**: 仅创建者可见（个人知识库默认）
- **team**: 指定团队成员可见
- **public**: 所有人可见
- **specific**: 指定用户可见（预留，暂不实现）

#### 3. 共享权限级别
- **read**: 团队成员可以查看和使用知识库，但不能编辑
- **write**: 团队成员可以查看、使用和编辑知识库

## UI Changes

### 知识库管理页面
- 添加分类标签：
  - `我的知识库` - 显示 `owner` 为当前用户的知识库
  - `团队知识库` - 显示共享给当前用户所属团队的知识库

### 编辑对话框扩展
- 添加"共享设置"部分：
  - 分类选择（个人/团队）
  - 权限类型选择（根据分类自动限制选项）
  - 团队选择（多选 + 搜索）
  - 权限级别选择（只读/可编辑）

### 创建对话框扩展
- 添加"知识库分类"选项：
  - `个人知识库` - 默认选项
  - `团队知识库` - 选择后需指定共享团队

## Access Control Logic

### 查看权限判断
```typescript
function canViewKnowledgeBase(kb: KnowledgeBase, userId: string, userTeamIds: string[]): boolean {
  // 1. Owner can always view
  if (kb.owner === userId) return true

  // 2. Public knowledge bases
  if (kb.permission === 'public') return true

  // 3. Team shared
  if (kb.permission === 'team' && kb.sharedTeams) {
    return kb.sharedTeams.some(st => userTeamIds.includes(st.teamId))
  }

  return false
}
```

### 编辑权限判断
```typescript
function canEditKnowledgeBase(kb: KnowledgeBase, userId: string, userTeamIds: string[]): boolean {
  // 1. Owner can always edit
  if (kb.owner === userId) return true

  // 2. Team shared with write permission
  if (kb.permission === 'team' && kb.sharedTeams) {
    const teamSharing = kb.sharedTeams.find(st => userTeamIds.includes(st.teamId))
    return teamSharing?.permission === 'write'
  }

  return false
}
```

## Migration Considerations

### 现有数据兼容性
- 现有知识库默认为 `owner: 当前用户`, `category: 'personal'`, `permission: 'owner'`
- UI 需要处理缺失字段的情况（向后兼容）

## Future Extensions (Out of Scope)
- 指定用户共享（specific permission）
- 知识库复制功能
- 共享历史记录
- 知识库使用统计
