# frontend Specification Delta

## ADDED Requirements

### Requirement: My Agent Section on Access Page
The system SHALL display a "My Agent" section on the ContentArea page showing the user's most recently used private agents.

#### Scenario: User views My Agent section on Access page
- **WHEN** user navigates to the Access page (ContentArea)
- **THEN** the system SHALL display a "我的 Agent" section above the Team Agent section
- **AND** the system SHALL display up to 3 most recently used private agents
- **AND** the agents SHALL be sorted by `lastUsedAt` in descending order
- **AND** each agent SHALL be displayed as a card with icon, name, and description

#### Scenario: User selects agent from My Agent section
- **WHEN** user clicks on an agent card in the My Agent section
- **THEN** the system SHALL populate the message input with the agent name
- **AND** the focus SHALL remain on the message input
- **AND** the system SHALL mark the agent as used (update `lastUsedAt`)

#### Scenario: User navigates to full My Agents page
- **WHEN** user clicks "查看全部我的 Agent →" link
- **THEN** the system SHALL emit a view-change event with 'my-agents'
- **AND** the AppLayout SHALL switch to MyAgentsPage view
- **AND** the system SHALL maintain the user's current message input content

### Requirement: Inline MCP Service Configuration
The system SHALL provide inline MCP service configuration in the ContentArea configuration panel without opening a separate settings panel.

#### Scenario: User clicks MCP Services tab
- **WHEN** user clicks "MCP服务" tab in the configuration panel
- **THEN** the system SHALL switch to MCP tab WITHOUT opening settings panel
- **AND** the system SHALL display MCPInlineConfig component inline
- **AND** the activeTab state SHALL be set to 'mcp'

#### Scenario: User configures MCP services inline
- **WHEN** user views the MCP inline configuration
- **THEN** the system SHALL display MCP tools grouped by category
- **AND** each tool SHALL have a toggle switch for enable/disable
- **AND** the system SHALL display tool description when expanded
- **AND** the configuration SHALL be stored in selectedMcpTools ref

#### Scenario: MCP configuration persists
- **WHEN** user configures MCP services and switches to another tab
- **THEN** the system SHALL maintain the selected MCP tools state
- **AND** when user returns to MCP tab, the configuration SHALL be preserved

### Requirement: System Tools Configuration
The system SHALL provide a "系统工具" (System Tools) configuration tab with inline toggle controls.

#### Scenario: User views System Tools tab
- **WHEN** user clicks "系统工具" tab in the configuration panel
- **THEN** the system SHALL display SystemToolsInlineConfig component
- **AND** the activeTab state SHALL be set to 'system-tools'
- **AND** the system SHALL display two collapsible sections

#### Scenario: System Tools sections display
- **WHEN** user views the System Tools inline configuration
- **THEN** the system SHALL display "沙箱环境" section with tools: 代码执行, 浏览器, 终端
- **AND** the system SHALL display "内置工具" section with tools: 时间工具, 联网搜索, OCR识别
- **AND** each tool SHALL have a toggle switch
- **AND** the system SHALL display tool description and status

#### Scenario: User configures System Tools
- **WHEN** user toggles a system tool switch
- **THEN** the system SHALL update selectedSystemTools ref
- **AND** the configuration SHALL persist when switching tabs
- **AND** the configuration SHALL be included in the message payload when sent

### Requirement: Memory Configuration
The system SHALL provide a "记忆体" (Memory) configuration tab with inline selection controls.

#### Scenario: User views Memory tab
- **WHEN** user clicks "记忆体" tab in the configuration panel
- **THEN** the system SHALL display MemoryInlineConfig component
- **AND** the activeTab state SHALL be set to 'memory'
- **AND** the system SHALL display memory type options

#### Scenario: Memory options display
- **WHEN** user views the Memory inline configuration
- **THEN** the system SHALL display three memory type options:
  - 短期记忆 (128 条 limit)
  - 长期记忆 (2.3 MB size)
  - 向量记忆 (156 个向量)
- **AND** each option SHALL display radio button for selection
- **AND** each option SHALL show current usage/size info

#### Scenario: User configures Memory
- **WHEN** user selects a memory type radio button
- **THEN** the system SHALL update selectedMemory ref
- **AND** the configuration SHALL persist when switching tabs
- **AND** the system SHALL display "添加记忆体" button
- **AND** clicking "添加记忆体" SHALL navigate to memory management page

### Requirement: Extended Configuration Tab Navigation
The system SHALL support four configuration tabs in the ContentArea configuration panel.

#### Scenario: User switches between configuration tabs
- **WHEN** user clicks any of the four tabs: 知识库, MCP服务, 系统工具, 记忆体
- **THEN** the system SHALL update activeTab to the corresponding value
- **AND** the system SHALL display the inline configuration component for that tab
- **AND** the tab SHALL show active state with bottom border styling
- **AND** the previously selected tab SHALL lose active state

#### Scenario: Configuration tab overflow handling
- **WHEN** the configuration tabs overflow on smaller screens
- **THEN** the system SHALL enable horizontal scrolling for the tab bar
- **AND** all four tabs SHALL remain accessible via scroll or swipe
- **AND** the tab labels SHALL not wrap or truncate

### Requirement: Configuration Payload
The system SHALL include all selected configurations when sending a message from the Access page.

#### Scenario: User sends message with configuration
- **WHEN** user clicks "发送" button with message text
- **THEN** the system SHALL emit message-sent event with configuration payload
- **AND** the payload SHALL include:
  - selectedKnowledgeBase (string)
  - selectedMcpTools (string[])
  - selectedSystemTools (string[])
  - selectedMemory (string)
- **AND** the ChatInterface SHALL receive and apply the configuration

#### Scenario: Configuration state management
- **WHEN** ContentArea component initializes
- **THEN** the system SHALL initialize refs for all configuration options
- **AND** the system SHALL maintain configuration state during component lifecycle
- **AND** the system SHALL preserve configuration when user switches between agent selections

## MODIFIED Requirements

### Requirement: Access Page ContentArea Component
[MODIFIED] The ContentArea component SHALL provide a three-section layout with My Agent section, Team Agent section, and expanded configuration panel.

#### Scenario: User navigates to Access page
- **WHEN** user clicks "发起 Access" button or starts new conversation
- **THEN** the system SHALL display ContentArea component
- **AND** the left column SHALL display My Agent section (3 recent agents)
- **AND** the left column SHALL display Team Agent section below My Agent
- **AND** the right column SHALL display message input and configuration panel
- **AND** the configuration panel SHALL have four tabs: 知识库, MCP服务, 系统工具, 记忆体

#### Scenario: User views agent selection options
- **WHEN** user views the Access page
- **THEN** the system SHALL display private agents in "我的 Agent" section
- **AND** the system SHALL display team agents in "团队Agent助手" section
- **AND** both sections SHALL use the same card design with icon, name, description
- **AND** clicking any agent card SHALL populate the message input

### Requirement: Configuration Panel Tab Navigation
[MODIFIED] The configuration panel SHALL support four tabs with inline configuration components.

#### Scenario: User interacts with configuration tabs
- **WHEN** user views the configuration panel
- **THEN** the system SHALL display four tabs in horizontal layout
- **AND** clicking MCP服务 tab SHALL NOT open settings panel (removed behavior)
- **AND** clicking any tab SHALL display its inline configuration component
- **AND** the system SHALL use horizontal scroll if tabs overflow viewport
