# Change: Access 模板管理

## Why

团队用户经常需要在多个 Access 会话中使用相同的配置组合（特定的 Agent、知识库、MCP 工具、系统工具、记忆体等）。目前每次都需要重新手动配置，效率低下。

通过 Access 模板功能，用户可以：
1. 保存当前 Access 配置为模板，供后续快速复用
2. 将常用配置分享给团队成员，提升团队协作效率
3. 统一团队内部的 Access 使用规范和最佳实践

## What Changes

- 新增 Access 模板数据模型和管理功能
- 在发起 Access 页面添加"管理分享"按钮，进入模板管理页面
- 在发起 Access 页面添加"应用模板"功能，快速加载已保存的配置
- 支持从当前配置创建模板并分享到团队
- 在 Access 会话页面支持编辑当前会话的配置

## Impact

- **Affected specs**: 新增 `access-template` capability
- **Affected code**:
  - `src/components/layout/ContentArea.vue` - 添加模板管理入口和应用模板功能
  - `src/components/layout/ChatInterface.vue` - 支持编辑当前会话配置
  - `src/stores/accessTemplate.ts` - 新增模板状态管理
  - `src/components/access-template/` - 新增模板管理相关组件
