# Change: 知识库团队共享功能

## Why

当前知识库管理系统只支持个人知识库，用户无法将知识库共享给团队使用。在团队协作场景中，多个成员需要访问相同的知识库（如产品文档、技术规范、市场资料等），目前每个人都需要单独创建和导入，导致：

1. **重复工作**：同一份文档需要由不同成员重复导入
2. **数据不一致**：各成员维护的知识库内容可能不同步
3. **管理成本高**：知识库更新时需要通知所有成员手动更新
4. **协作效率低**：团队无法共享和维护统一的知识资产

通过添加知识库团队共享功能，用户可以：
1. 将个人知识库共享给一个或多个团队
2. 直接创建团队知识库
3. 在知识库管理页面区分个人和团队知识库
4. 控制团队成员对知识库的访问权限（只读/可编辑）

## What Changes

- 扩展 `KnowledgeBase` 数据模型，添加 `sharedTeams` 和 `permission` 字段
- 在知识库管理页面添加分类标签（我的知识库、团队知识库）
- 在知识库编辑对话框中添加团队共享设置
- 添加团队知识库创建功能
- 实现基于团队的访问控制逻辑

## Impact

- **Affected specs**: `knowledge-base-management` (MODIFIED)
- **Affected code**:
  - `src/types/knowledge-base.ts` - 扩展 KnowledgeBase 接口
  - `src/components/knowledge-base/KnowledgeBasePage.vue` - 添加分类标签
  - `src/components/knowledge-base/EditKnowledgeBaseDialog.vue` - 添加共享设置
  - `src/stores/knowledgeBase.ts` - 添加团队共享逻辑
