# Design - enhance-conversation-tool-visibility

## Architecture Overview

本次改动主要涉及三个层面：

1. **数据层**：扩展类型定义以支持工具信息存储
2. **组件层**：创建新的显示组件
3. **集成层**：将组件集成到现有 UI 中

## Data Structure Design

### ToolCall 类型

```typescript
interface ToolCall {
  id: string                    // 唯一标识
  type: 'agent' | 'mcp' | 'plugin' | 'knowledge_base'
  name: string                  // 工具名称
  status: 'pending' | 'running' | 'completed' | 'failed'
  startTime: Date
  endTime?: Date
  input?: any                   // 输入参数（可展开查看）
  result?: any                  // 执行结果（可展开查看）
  error?: string                // 错误信息
}
```

### 扩展后的 ChatConversation.settings

```typescript
interface ChatConversationSettings {
  providerId?: string
  agentId?: string              // 使用的 Agent ID
  knowledgeBaseIds?: string[]   // 使用的知识库列表
  mcpServiceIds?: string[]      // 使用的 MCP 服务列表
  pluginIds?: string[]          // 使用的系统插件列表
}
```

## Component Design

### ToolCallIndicator 组件

**职责**：显示单个工具调用的状态和结果

**Props**：
```typescript
interface Props {
  toolCall: ToolCall
  expanded?: boolean            // 是否展开显示详情
}
```

**视觉设计**：
```
┌─────────────────────────────────────────┐
│ [Agent Icon] 写作助手         [完成] ✓  │
│ 思考中...                              │
│ └─ 思考过程内容（可展开）               │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ [MCP Icon] Google Search      [完成] ✓  │
│ 搜索："最新 AI 发展趋势"                │
│ └─ 找到 5 个相关结果                    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ [Plugin Icon] 代码执行沙箱    [完成] ✓  │
│ 执行 Python 数据分析                   │
│ └─ 生成了分析报告和图表                 │
└─────────────────────────────────────────┘
```

**颜色方案**：
- Agent: 绿色 (#10b981)
- MCP: 蓝色 (#3b82f6)
- Plugin: 紫色 (#8b5cf6)
- Knowledge Base: 橙色 (#f97316)

**状态颜色**：
- Pending: 灰色
- Running: 蓝色 + 动画
- Completed: 绿色
- Failed: 红色

### ConversationTags 组件

**职责**：在对话标题下方显示配置的工具标签

**Props**：
```typescript
interface Props {
  settings: ChatConversationSettings
  compact?: boolean            // 紧凑模式（用于侧边栏）
}
```

**标准模式**（ChatInterface 顶部）：
```
┌─────────────────────────────────────────┐
│ 写作助手                                  │
│ [🤺 Agent] [📊 MCP] [🔌 Plugin] [📚 KB] │
└─────────────────────────────────────────┘
```

**紧凑模式**（侧边栏）：
```
┌─────────────────────────────────────────┐
│ 帮我生成一个PPT [🤺][📊][📚]            │
└─────────────────────────────────────────┘
```

或使用彩色圆点：
```
┌─────────────────────────────────────────┐
│ 帮我生成一个PPT [🟢][🔵][🟠]             │
└─────────────────────────────────────────┘
```

## Integration Points

### 1. ChatInterface.vue

**对话标题区域**：
```vue
<div class="conversation-header">
  <h3>{{ currentConversation?.title }}</h3>
  <ConversationTags :settings="currentConversation?.settings" />
</div>
```

**消息内容区域**：
```vue
<div class="message-content">
  <!-- 原有消息文本 -->
  <div class="text">{{ message.content }}</div>

  <!-- 新增：工具调用提示 -->
  <ToolCallIndicator
    v-for="toolCall in message.toolCalls"
    :key="toolCall.id"
    :tool-call="toolCall"
  />
</div>
```

### 2. SidebarNavigation.vue

**对话列表项**：
```vue
<div class="conversation-item" @click="selectConversation(conv)">
  <span class="title">{{ conv.title }}</span>
  <ConversationTags
    :settings="conv.settings"
    :compact="true"
  />
</div>
```

### 3. ContentArea.vue

**工具选择面板** - 扩展现有面板：
```vue
<div class="config-panel">
  <div class="tabs">
    <button @click="activeTab = 'agent'">Agent</button>
    <button @click="activeTab = 'knowledge'">知识库</button>
    <button @click="activeTab = 'mcp'">MCP服务</button>
    <button @click="activeTab = 'plugin'">插件</button>
  </div>

  <!-- Agent 选择 -->
  <div v-if="activeTab === 'agent'">
    <AgentSelector v-model="settings.agentId" />
  </div>

  <!-- 知识库选择 -->
  <div v-if="activeTab === 'knowledge'">
    <KnowledgeBaseSelector v-model="settings.knowledgeBaseIds" multiple />
  </div>

  <!-- MCP 服务选择 -->
  <div v-if="activeTab === 'mcp'">
    <MCPServiceSelector v-model="settings.mcpServiceIds" multiple />
  </div>

  <!-- 插件选择 -->
  <div v-if="activeTab === 'plugin'">
    <PluginSelector v-model="settings.pluginIds" multiple />
  </div>
</div>
```

## Demo Conversation Design

### 对话 1：帮我生成一个PPT

**场景**：用户请求生成 PPT，系统调用写作助手 agent

**工具使用**：
- Agent: 写作助手 (team-2)
- Knowledge Base: 产品文档知识库 (kb-text-1)

**消息流程**：
```
User: 帮我生成一个PPT

Assistant: [🤺 写作助手 - 思考中]
[📚 检索产品文档知识库 - 找到 3 篇相关文档]

好的，我可以帮您生成PPT。请告诉我PPT的主题是什么？

User: 关于人工智能发展趋势

Assistant: [🤺 写作助手 - 生成中]
[📚 参考产品文档 - AI技术白皮书]

明白了！我将为您创建一个关于人工智能发展趋势的PPT。

[🤺 写作助手 - 生成完成 ✓]
我已经为您生成了演示文稿，包含以下内容：
1. 人工智能发展历程
2. 当前主流AI技术
3. 未来发展趋势
4. 行业应用案例

您可以通过以下链接下载PPT。
```

### 对话 2：给我设置一个明天8点的会议提醒

**场景**：用户请求设置会议提醒，系统调用日历插件

**工具使用**：
- Plugin: 日历插件 (plugin-calendar)

**消息流程**：
```
User: 给我设置一个明天8点的会议提醒

Assistant: [🔌 日历插件 - 执行中]

好的，我已经为您设置了明天上午8点的会议提醒。

提醒内容：
📅 时间：明天 8:00 AM
⏰ 提醒：会议提醒

我会准时提醒您参加会议。需要我添加会议备注吗？

[🔌 日历插件 - 已添加到系统日历 ✓]
```

### 对话 3：写一封产品介绍邮件

**场景**：用户请求写邮件，系统调用写作助手 agent

**工具使用**：
- Agent: 写作助手 (team-2)
- MCP: 邮件模板服务 (mcp-email-templates)

**消息流程**：
```
User: 写一封产品介绍邮件

Assistant: [🤺 写作助手 - 思考中]
[📧 邮件模板服务 - 获取模板]

好的，以下是一封产品介绍邮件的草稿：

主题：全新智能产品介绍

尊敬的客户，

您好！我们很高兴向您介绍我们最新推出的智能产品...

请告诉我您想介绍什么产品，我可以帮您定制更具体的内容。
```

### 对话 4：分析这个数据报表

**场景**：用户上传数据报表，系统使用数据分析 agent 和代码执行沙箱

**工具使用**：
- Agent: 数据分析助手 (team-3)
- Plugin: 代码执行沙箱 (plugin-code-execution)
- Knowledge Base: 销售数据表格 (kb-spreadsheet-1)

**消息流程**：
```
User: 分析这个数据报表

Assistant: [🤺 数据分析助手 - 处理中]
[🔌 代码执行沙箱 - 运行 Python 分析脚本]
[📊 读取销售数据表格]

根据报表数据，我发现了以下几个关键趋势：
1. 销售额比去年同期增长了25%
2. 用户活跃度提升了15%
3. 新用户转化率达到了8%

[🔌 代码执行沙箱 - 生成图表 ✓]

需要我深入分析某个特定指标吗？
```

### 对话 5：翻译这段文字到英文

**场景**：用户请求翻译，系统调用翻译 MCP 服务

**工具使用**：
- MCP: 翻译服务 (mcp-translate)

**消息流程**：
```
User: 翻译这段文字到英文

Assistant: 请提供您需要翻译的文字内容，我会帮您翻译成地道的英文。

User: （提供中文文本）

Assistant: [🌐 翻译服务 - 翻译中 ✓]

以下是翻译结果：

（英文翻译内容）

如果您需要调整翻译风格或术语，请告诉我。
```

### 对话 6：搜索文档并总结

**场景**：用户请求搜索文档，系统使用知识库检索

**工具使用**：
- Knowledge Base: 产品文档知识库 (kb-text-1)
- Knowledge Base: 用户手册知识库 (kb-text-2)

**消息流程**：
```
User: 搜索关于快速入门的文档并总结

Assistant: [📚 搜索产品文档知识库...]
[📚 搜索用户手册知识库...]

找到了 5 篇相关文档，以下是总结：

快速入门指南：

1. **安装与配置**
   - 下载并安装 AgentAccess
   - 配置 API 密钥

2. **创建第一个对话**
   - 点击"新对话"按钮
   - 输入您的问题

3. **使用 Agent**
   - 在配置面板选择 Agent
   - 发送消息开始对话

（更多总结内容...）

需要我详细介绍某个步骤吗？
```

## Implementation Considerations

### 1. 性能优化

- 对话列表使用紧凑模式标签，避免渲染过多内容
- 工具调用提示框默认折叠，点击展开
- 演示对话数据在初始化时加载，不阻塞页面渲染

### 2. 可访问性

- 工具标签使用颜色 + 图标，不仅依赖颜色区分
- 工具调用提示框支持键盘导航
- 状态文本提供清晰的语义描述

### 3. 扩展性

- ToolCall 类型设计为可扩展，未来支持更多工具类型
- ConversationTags 组件支持自定义标签渲染
- 工具选择面板支持动态加载可用工具列表

### 4. 向后兼容

- 没有工具配置的对话正常显示
- 没有 toolCalls 的消息正常显示
- 新增字段都是可选的
