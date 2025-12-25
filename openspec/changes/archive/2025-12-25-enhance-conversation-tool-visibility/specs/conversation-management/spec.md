# Conversation Management Spec Delta

## Purpose
Defines requirements for managing conversation tool configuration and displaying tools in the conversation list.

## ADDED Requirements

### Requirement: Extended Conversation Settings
The system SHALL support storing multiple tool configurations in conversation settings.

#### Scenario: Conversation is created with agent, knowledge bases, MCP services, and plugins
- **GIVEN** a user configures tools before starting a conversation
- **WHEN** the conversation is created
- **THEN** the conversation settings MUST include:
  - `agentId?: string` - Selected agent ID
  - `knowledgeBaseIds?: string[]` - Array of knowledge base IDs
  - `mcpServiceIds?: string[]` - Array of MCP service IDs
  - `pluginIds?: string[]` - Array of plugin IDs

#### Scenario: Legacy conversation without new fields is loaded
- **GIVEN** a conversation was created before this change
- **WHEN** the conversation is loaded
- **THEN** it MUST work without errors
- **AND** missing fields SHALL be treated as undefined/empty

### Requirement: Message Tool Call Tracking
The system SHALL support tracking tool calls within chat messages.

#### Scenario: Message contains tool calls
- **GIVEN** an AI response uses tools during generation
- **WHEN** the message is created
- **THEN** the message MUST include:
  - `toolCalls?: ToolCall[]` - Array of tool call records
  - Each ToolCall including:
    - `id: string` - Unique identifier
    - `type: 'agent' | 'mcp' | 'plugin' | 'knowledge_base'`
    - `name: string` - Tool name
    - `status: 'pending' | 'running' | 'completed' | 'failed'`
    - `startTime: Date`
    - `endTime?: Date`
    - `result?: any`
    - `error?: string`

#### Scenario: Message metadata includes used tools
- **GIVEN** a message was generated using tools
- **WHEN** the message metadata is examined
- **THEN** it MUST include:
  - `agentUsed?: string` - Agent used
  - `toolsUsed?: string[]` - List of tool IDs used

### Requirement: Sidebar Conversation Tool Indicators
The system SHALL display compact tool indicators in the sidebar conversation list.

#### Scenario: User views recent conversations in sidebar
- **GIVEN** the sidebar displays conversation list
- **WHEN** conversations have tools configured
- **THEN** each conversation item SHALL show:
  - Conversation title
  - Compact tool indicators (colored dots or small icons)
  - Tool indicators using distinct colors per type

#### Scenario: User hovers over a conversation item
- **GIVEN** a conversation has tool indicators
- **WHEN** the user hovers over the indicators
- **THEN** a tooltip SHALL show the full tool names

### Requirement: Demo Conversations with Tool Usage
The system SHALL provide demo conversations that showcase realistic tool usage.

#### Scenario: User views demo conversations
- **GIVEN** the application is first loaded
- **WHEN** demo conversations are displayed
- **THEN** each demo conversation MUST:
  - Have appropriate tools configured in settings
  - Include messages with tool calls
  - Show realistic tool usage patterns

#### Scenario: Demo conversation - PPT Generation
- **GIVEN** the "帮我生成一个PPT" conversation
- **WHEN** viewed
- **THEN** it MUST demonstrate:
  - Agent: 写作助手 (team-2)
  - Knowledge Base: 产品文档知识库
  - Tool calls in messages showing agent thinking and KB retrieval

#### Scenario: Demo conversation - Meeting Reminder
- **GIVEN** the "给我设置一个明天8点的会议提醒" conversation
- **WHEN** viewed
- **THEN** it MUST demonstrate:
  - Plugin: 日历插件
  - Tool calls showing plugin execution and confirmation

#### Scenario: Demo conversation - Email Writing
- **GIVEN** the "写一封产品介绍邮件" conversation
- **WHEN** viewed
- **THEN** it MUST demonstrate:
  - Agent: 写作助手
  - MCP: 邮件模板服务
  - Tool calls showing agent using MCP service

#### Scenario: Demo conversation - Data Analysis
- **GIVEN** the "分析这个数据报表" conversation
- **WHEN** viewed
- **THEN** it MUST demonstrate:
  - Agent: 数据分析助手
  - Plugin: 代码执行沙箱
  - Knowledge Base: 销售数据表格
  - Multiple tool calls in sequence

#### Scenario: Demo conversation - Translation
- **GIVEN** the "翻译这段文字到英文" conversation
- **WHEN** viewed
- **THEN** it MUST demonstrate:
  - MCP: 翻译服务
  - Tool call showing translation process

#### Scenario: Demo conversation - Document Search
- **GIVEN** the "搜索文档并总结" conversation
- **WHEN** viewed
- **THEN** it MUST demonstrate:
  - Knowledge Base: Multiple knowledge bases searched
  - Tool calls showing retrieval and summary

## MODIFIED Requirements

### Requirement: Conversation List Display
[MODIFIED] Conversation items in sidebar SHALL support compact tool tag display.

#### Scenario: Sidebar renders conversation list
- **GIVEN** conversations exist in the store
- **WHEN** the sidebar renders
- **THEN** each conversation item MAY include:
  - Title text
  - Optional compact tool tags
  - Tool tags using minimal space (dots or small icons)

### Requirement: Tool Selection in New Conversation
[MODIFIED] New conversation UI SHALL support agent and plugin selection in addition to existing options.

#### Scenario: User starts a new conversation
- **GIVEN** the content area is displayed
- **WHEN** the user opens the configuration panel
- **THEN** it MUST show tabs for:
  - Agent selection (new)
  - Knowledge base selection (existing)
  - MCP service selection (existing)
  - Plugin selection (new)

#### Scenario: User selects tools before sending first message
- **GIVEN** the user is on the new conversation screen
- **WHEN** the user selects agent, MCP services, plugins
- **AND** sends the first message
- **THEN** the selections MUST be saved to conversation.settings
