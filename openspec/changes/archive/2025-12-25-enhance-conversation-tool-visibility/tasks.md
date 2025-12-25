# Tasks - enhance-conversation-tool-visibility

## Phase 1: 类型定义扩展

### 1.1 扩展核心类型
- [ ] 在 `src/types/settings.ts` 中扩展 `ChatConversation.settings`
  - 添加 `agentId?: string`
  - 将 `knowledgeBaseId` 改为 `knowledgeBaseIds?: string[]`
  - 将 `mcpServices` 改为 `mcpServiceIds?: string[]`
  - 添加 `pluginIds?: string[]`
- [ ] 在 `src/types/settings.ts` 中扩展 `ChatMessage`
  - 添加 `toolCalls?: ToolCall[]`
  - 在 metadata 中添加 `agentUsed?: string` 和 `toolsUsed?: string[]`
- [ ] 新增 `ToolCall` 类型定义
- [ ] 新增 `src/types/plugins.ts`，定义 `SystemPlugin` 和 `PluginConfig` 类型

### 1.2 Store 更新
- [ ] 更新 `chat.ts` store 中的演示对话数据
  - 为每个对话添加 settings 配置
  - 为消息添加 toolCalls 数据

## Phase 2: 工具调用提示组件

### 2.1 创建 ToolCallIndicator 组件
- [ ] 创建 `src/components/chat/ToolCallIndicator.vue`
  - 支持不同工具类型（agent/mcp/plugin/knowledge）
  - 显示不同状态（pending/running/completed/failed）
  - 支持展开/折叠查看详情
  - 使用不同颜色区分工具类型

### 2.2 创建 ConversationTags 组件
- [ ] 创建 `src/components/chat/ConversationTags.vue`
  - 显示对话配置的所有工具标签
  - 使用不同颜色区分工具类型
  - 支持点击跳转到对应配置

## Phase 3: UI 集成

### 3.1 ChatInterface 更新
- [ ] 在对话标题下方添加工具标签显示
- [ ] 在消息内容中集成 ToolCallIndicator
- [ ] 添加工具类型对应的样式和图标

### 3.2 SidebarNavigation 更新
- [ ] 在对话列表项中添加紧凑型工具标签
- [ ] 使用彩色圆点或小图标表示工具类型
- [ ] 添加 hover 提示显示完整工具名称

### 3.3 ContentArea 更新
- [ ] 在工具选择面板中添加 Agent 和插件选择
- [ ] 确保选择的工具保存到 conversation.settings

## Phase 4: 演示对话数据

### 4.1 创建演示对话数据
- [ ] 对话 1：帮我生成一个PPT（写作助手 agent）
- [ ] 对话 2：给我设置一个明天8点的会议提醒（日历插件）
- [ ] 对话 3：写一封产品介绍邮件（写作助手 agent）
- [ ] 对话 4：分析这个数据报表（数据分析 agent + 代码执行沙箱）
- [ ] 对话 5：翻译这段文字到英文（翻译 MCP 服务）
- [ ] 对话 6：搜索文档并总结（知识库检索）

## Phase 5: 测试和验证

### 5.1 功能测试
- [ ] 对话列表标签显示正确
- [ ] 聊天界面工具调用提示框显示正确
- [ ] 工具类型颜色区分明显
- [ ] 演示对话展示完整工具使用过程

### 5.2 兼容性测试
- [ ] 现有对话正常显示
- [ ] 没有工具配置的对话正常显示
- [ ] 没有 toolCalls 的消息正常显示

### 5.3 样式验证
- [ ] 不同屏幕尺寸下标签显示正常
- [ ] 工具标签不溢出容器
- [ ] 颜色对比度符合可访问性标准
