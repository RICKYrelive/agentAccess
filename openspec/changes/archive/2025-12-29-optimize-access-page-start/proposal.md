# Proposal: Optimize Access Page Start

## Summary
优化"发起 Access"页面的用户体验，包括：
1. 在"团队 Agent"上方添加"我的 Agent"模块
2. MCP 服务配置不再弹出独立窗口，改为在当前页面直接配置
3. 配置选项新增"系统工具"和"记忆体"配置

## Motivation
当前"发起 Access"页面存在以下问题：
1. 用户只能选择团队 Agent，无法快速选择自己的私有 Agent
2. 点击 MCP 服务配置会弹出独立设置面板，打断了用户的工作流
3. 配置选项不完整，缺少系统工具和记忆体配置

## Proposed Solution
1. **添加我的 Agent 模块**：在左侧列的团队 Agent 卡片上方添加一个新的"我的 Agent"区域，显示用户最近使用的 3 个私有 Agent
2. **内联 MCP 服务配置**：将 MCP 服务配置改为直接在配置面板中显示，不再弹出独立窗口
3. **扩展配置选项**：在配置选项卡中新增"系统工具"和"记忆体"两个选项卡

## Impact
- **User-facing**: 用户可以更方便地选择自己的 Agent，配置流程更流畅
- **Developer**: 需要修改 ContentArea.vue 组件，从 SidebarNavigation 和 stores 获取数据
- **Performance**: 无显著性能影响

## Alternatives Considered
1. **保持弹窗方式**：Rejected - 打断用户工作流，体验不佳
2. **新建独立配置页面**：Rejected - 增加页面复杂度，不符合快速配置的需求

## Dependencies
- 现有的 Agent store (`useAgentStore`)
- 现有的 MCP management store (`useMCPManagementStore`)
- 新增系统工具和记忆体的配置界面

## Risks
- 如果用户有很多私有 Agent，只显示 3 个可能不够（可以通过点击跳转到我的 Agent 页面解决）
- 内联配置可能占用较多空间（需要合理的 UI 设计）

## Success Criteria
1. 用户可以在发起 Access 页面看到自己的最近 Agent
2. MCP 服务配置可以直接在右侧面板完成
3. 配置选项包含知识库、MCP 服务、系统工具、记忆体四个选项
4. 所有配置可以正常保存和使用
