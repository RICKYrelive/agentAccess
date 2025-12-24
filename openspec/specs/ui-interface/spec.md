# ui-interface Specification

## Purpose
Documents the UI/UX design specifications for the Agent Access system based on analysis of interaction diagrams. This specification defines the three-column layout interface, knowledge base integration, MCP service configuration, visual workflow editor, and multi-agent support patterns.
## Requirements
### Requirement: Main Interface Layout
[MODIFIED] The system SHALL provide a three-column layout interface with left navigation sidebar, central content area, and right settings panel, where the central area can display home page, workflow editor, or My Agents page.

#### Scenario: User navigates between main views
- **WHEN** user clicks navigation items in the sidebar
- **THEN** the central content area SHALL switch between views: home, workflow editor, or My Agents page
- **AND** the sidebar SHALL remain visible
- **AND** the right panel SHALL be context-aware (settings for home/workflow, hidden for My Agents)

#### Scenario: User accesses My Agents from sidebar
- **WHEN** user clicks "我的Agent" button in sidebar
- **THEN** the central content area SHALL display the My Agents page
- **AND** the sidebar SHALL show recent agent shortcuts below the button
- **AND** the right panel SHALL be hidden or show agent-related settings

### Requirement: Knowledge Base Integration
The system SHALL provide knowledge base selection and integration functionality for contextual AI responses.

#### Scenario: User selects knowledge base
- **WHEN** user clicks "知识库" dropdown
- **THEN** the system SHALL display available knowledge repositories
- **AND** options SHALL include categories like "市场快速打法知识库" and "产品速知知识库"
- **WHEN** user selects a knowledge base
- **THEN** subsequent AI responses SHALL be grounded in the selected knowledge base

#### Scenario: User accesses function cards
- **WHEN** user clicks on a function card (e.g., "智能数据分析")
- **THEN** the system SHALL activate the corresponding AI capability
- **AND** the system SHALL provide task-specific interface for that function

### Requirement: MCP Service Configuration
The system SHALL provide configurable MCP (Model Context Protocol) services that users can enable or disable based on their needs.

#### Scenario: User configures MCP services
- **WHEN** user opens MCP service settings panel
- **THEN** the system SHALL display categorized service options
- **AND** categories SHALL include "检索工具", "信息处理", "开发者工具", and "云服务"
- **WHEN** user toggles a service (e.g., "联网搜索")
- **THEN** the system SHALL enable or disable that capability for AI interactions

#### Scenario: User adds new MCP service
- **WHEN** user clicks "添加MCP服务" button
- **THEN** the system SHALL provide interface for integrating new capabilities
- **AND** the system SHALL validate the service configuration before activation

### Requirement: Visual Workflow Editor
[MODIFIED] The system SHALL provide a visual workflow editor for configuring question-answering assistant logic with drag-and-drop functionality, canvas navigation controls, and optional preview panel.

#### Scenario: User accesses enhanced workflow editor
- **WHEN** user accesses the workflow editor
- **THEN** the system SHALL display "Agent编辑器" as the title
- **AND** the system SHALL display a canvas with process nodes
- **AND** the system SHALL display floating controls for zoom and pan
- **AND** the system SHALL display a mini-map in the corner
- **AND** the system SHALL display a "验证工作流" toggle button in the toolbar

#### Scenario: User navigates large workflow
- **WHEN** user works with a workflow larger than the viewport
- **THEN** the system SHALL allow zooming from 50% to 200%
- **AND** the system SHALL allow panning in all directions
- **AND** the mini-map SHALL show overview of all nodes
- **AND** the user MAY click "Fit to Screen" to see all nodes

### Requirement: Multi-Agent Support
[MODIFIED] The system SHALL support managing multiple AI agents through a dedicated My Agents page with sharing capabilities.

#### Scenario: User accesses agent management
- **WHEN** user clicks "我的Agent" in the sidebar
- **THEN** the system SHALL navigate to a dedicated My Agents page
- **AND** the page SHALL display all user's agents as cards
- **AND** the page SHALL provide options for creating new agents
- **AND** the page SHALL allow sharing agents with groups

#### Scenario: User quickly accesses recent agent
- **WHEN** user wants to quickly access a recently used agent
- **THEN** the sidebar SHALL display the top 3 recent agents
- **AND** clicking a recent agent SHALL open it in the workflow editor
- **AND** the system SHALL update the last used timestamp

### Requirement: Real-time Preview and Testing
The system SHALL provide real-time preview of configuration changes and immediate testing capabilities.

#### Scenario: User modifies workflow configuration
- **WHEN** user changes node parameters in workflow editor
- **THEN** the preview panel SHALL update in real-time
- **AND** the system SHALL reflect configuration changes in test interactions
- **WHEN** user submits a test question
- **THEN** the system SHALL provide immediate feedback on workflow performance

### Requirement: Agent Editor Title
The system SHALL display "Agent编辑器" as the workflow editor title.

#### Scenario: User views workflow editor header
- **WHEN** user navigates to the workflow editor
- **THEN** the system SHALL display "Agent编辑器" as the main heading
- **AND** the title SHALL be prominently visible in the toolbar

### Requirement: Canvas Zoom Controls
The system SHALL provide zoom controls for the workflow canvas.

#### Scenario: User zooms in on canvas
- **WHEN** user clicks the "Zoom In" button
- **THEN** the system SHALL increase the canvas scale by 10%
- **AND** the maximum scale SHALL be limited to 200%
- **AND** all nodes and connections SHALL be rendered at the new scale

#### Scenario: User zooms out on canvas
- **WHEN** user clicks the "Zoom Out" button
- **THEN** the system SHALL decrease the canvas scale by 10%
- **AND** the minimum scale SHALL be limited to 50%
- **AND** all nodes and connections SHALL be rendered at the new scale

#### Scenario: User resets canvas zoom
- **WHEN** user clicks the "Reset Zoom" button
- **THEN** the system SHALL set the canvas scale to 100%
- **AND** the pan offset SHALL remain unchanged

#### Scenario: User uses mouse wheel to zoom
- **WHEN** user holds Ctrl/Cmd key and scrolls mouse wheel over canvas
- **THEN** the system SHALL adjust the zoom level based on scroll direction
- **AND** the zoom SHALL be centered on the mouse cursor position

### Requirement: Canvas Pan Controls
The system SHALL provide pan controls for navigating the workflow canvas.

#### Scenario: User pans canvas with mouse drag
- **WHEN** user holds middle mouse button and drags over canvas
- **THEN** the system SHALL move the canvas in the direction of the drag
- **AND** the movement SHALL be 1:1 with mouse movement

#### Scenario: User pans canvas with space bar
- **WHEN** user holds space bar and left mouse button while dragging
- **THEN** the system SHALL move the canvas in the direction of the drag

#### Scenario: User uses arrow keys to pan
- **WHEN** canvas has focus and user presses arrow keys
- **THEN** the system SHALL pan the canvas in the direction of the arrow key
- **AND** each key press SHALL move the canvas by 50 pixels

### Requirement: Fit to Screen
The system SHALL provide functionality to automatically scale the canvas to fit all nodes.

#### Scenario: User fits canvas to screen
- **WHEN** user clicks "Fit to Screen" button
- **THEN** the system SHALL calculate the bounding box of all nodes
- **AND** the system SHALL set the zoom level to fit all nodes within viewport
- **AND** the system SHALL center the canvas on the nodes

### Requirement: Locate Start Node
The system SHALL provide functionality to quickly navigate to the start node.

#### Scenario: User locates start node
- **WHEN** user clicks "Locate Start" button
- **THEN** the system SHALL find the start node in the workflow
- **AND** the system SHALL center the viewport on the start node
- **AND** the system SHALL reset zoom to 100%

### Requirement: Canvas Mini-map
The system SHALL provide a mini-map overview of the entire workflow canvas.

#### Scenario: User views mini-map
- **WHEN** user views the workflow editor
- **THEN** the system SHALL display a mini-map in the corner of the canvas
- **AND** the mini-map SHALL show all nodes as simplified dots
- **AND** the mini-map SHALL show the current viewport as a rectangle

#### Scenario: User clicks mini-map to navigate
- **WHEN** user clicks on a location in the mini-map
- **THEN** the system SHALL pan the canvas to center that location
- **AND** the zoom level SHALL remain unchanged

#### Scenario: Mini-map updates with canvas changes
- **WHEN** user adds, removes, or moves nodes
- **THEN** the mini-map SHALL update to reflect the new layout
- **AND** the viewport rectangle SHALL update during pan/zoom

### Requirement: Preview Panel Toggle
The system SHALL provide a toggle button for showing/hiding the preview panel.

#### Scenario: User shows preview panel
- **WHEN** user clicks "验证工作流" button and panel is hidden
- **THEN** the system SHALL display the preview panel on the right side
- **AND** the panel SHALL appear with a smooth transition animation

#### Scenario: User hides preview panel
- **WHEN** user clicks "验证工作流" button and panel is visible
- **THEN** the system SHALL hide the preview panel
- **AND** the canvas SHALL expand to use the available space

#### Scenario: Panel toggle keyboard shortcut
- **WHEN** user presses Ctrl/Cmd + P while in workflow editor
- **THEN** the system SHALL toggle the preview panel visibility

### Requirement: My Agents Page Layout
The system SHALL provide a dedicated page layout for managing user's agents with creation options, private agents section, and shared agents section.

#### Scenario: User views My Agents page layout
- **WHEN** user navigates to the My Agents page
- **THEN** the system SHALL display a page header with title "我的Agent"
- **AND** the system SHALL display an agent creation bar with three buttons below the header
- **AND** the creation bar SHALL have: "自定义创建Agent", "自动创建Agent", "导入第三方Agent"
- **AND** the system SHALL display a "私有Agent" section below the creation bar
- **AND** the system SHALL display a "共享Agent" section below the private agents section
- **AND** the system SHALL display an "添加共享组" button in the shared agents section

#### Scenario: User views page with no agents
- **WHEN** user has no agents created
- **THEN** the private agents section SHALL display an empty state illustration
- **AND** the empty state SHALL include a message prompting to create an agent
- **AND** the shared agents section SHALL be hidden or show "暂无共享Agent"

### Requirement: Agent Card Visual Design
The system SHALL provide visually consistent agent cards with clear indicators for agent properties and status.

#### Scenario: Agent card displays all information
- **WHEN** user views an agent card
- **THEN** the card SHALL display the agent name prominently at the top
- **AND** the card SHALL display an icon on the left side
- **AND** the card SHALL display an "编辑" button on the right side
- **AND** the card SHALL display badges below the name if applicable
- **AND** the card SHALL display a shared status indicator at the bottom

#### Scenario: Agent card shows third-party badge
- **WHEN** an agent is imported from third-party source
- **THEN** the card SHALL display a "第三方" badge
- **AND** the badge SHALL have a distinct color (e.g., orange/amber)
- **AND** the badge SHALL appear next to other badges or tags

#### Scenario: Agent card shows tags
- **WHEN** an agent has tags assigned
- **THEN** the card SHALL display tags as pill-shaped badges
- **AND** each tag SHALL have a colored background
- **AND** maximum 3 tags SHALL be displayed
- **AND** tags SHALL be arranged horizontally

#### Scenario: Agent card shows shared groups
- **WHEN** an agent is shared with one or more groups
- **THEN** the card SHALL display "已共享: [group names]" at the bottom
- **AND** the text SHALL be in a smaller, muted font
- **AND** multiple group names SHALL be separated by commas

### Requirement: Agent Creation Bar Design
The system SHALL provide a visually distinct creation bar with three action buttons.

#### Scenario: Creation bar displays buttons
- **WHEN** user views the creation bar
- **THEN** the system SHALL display three buttons of equal size
- **AND** each button SHALL have an icon and label
- **AND** "自定义创建Agent" button SHALL be highlighted as primary action
- **AND** the other two buttons SHALL be styled as secondary actions

#### Scenario: User hovers over creation buttons
- **WHEN** user hovers over a creation button
- **THEN** the button SHALL show a lift effect (shadow or scale)
- **AND** the cursor SHALL change to pointer
- **AND** for secondary buttons, a tooltip MAY show "即将推出"

### Requirement: Sharing Group Accordion Design
The system SHALL display sharing groups as collapsible accordions with clear visual hierarchy.

#### Scenario: Sharing group accordion displays
- **WHEN** user views the shared agents section
- **THEN** each sharing group SHALL be displayed as an accordion
- **AND** the accordion header SHALL show the group name and agent count
- **AND** the accordion header SHALL have a collapse/expand icon indicator
- **AND** the accordion content SHALL show agent cards when expanded

#### Scenario: Sharing group accordion expands
- **WHEN** user clicks on a sharing group accordion header
- **THEN** the accordion SHALL expand with a smooth animation
- **AND** the collapse/expand icon SHALL rotate
- **AND** the agent cards SHALL be displayed in a grid layout

### Requirement: Drag and Drop Visual Feedback
The system SHALL provide clear visual feedback during drag and drop operations for agent sharing.

#### Scenario: User starts dragging agent card
- **WHEN** user grabs an agent card from private section
- **THEN** the original card SHALL display with reduced opacity
- **AND** a ghost image SHALL follow the cursor
- **AND** the cursor SHALL change to indicate dragging
- **AND** all sharing group drop zones SHALL highlight with a border or background color

#### Scenario: User hovers over valid drop zone
- **WHEN** user drags an agent over a sharing group
- **THEN** the sharing group accordion SHALL expand if collapsed
- **AND** the drop zone SHALL display a highlighted background color
- **AND** a visual indicator SHALL show "拖放到此处共享"

#### Scenario: User drops agent successfully
- **WHEN** user successfully drops an agent on a sharing group
- **THEN** a success animation SHALL play
- **AND** the agent card SHALL appear in the sharing group
- **AND** a toast notification SHALL confirm "已共享到 [group name]"

### Requirement: Sidebar Recent Agents Design
The system SHALL display recent agents in the sidebar as compact, clickable items.

#### Scenario: Recent agents display in sidebar
- **WHEN** user views the sidebar
- **THEN** up to 3 recent agents SHALL be displayed below "我的Agent" button
- **AND** each recent agent SHALL be displayed as a compact row
- **AND** each row SHALL include an agent icon and name
- **AND** the rows SHALL be vertically stacked with small spacing

#### Scenario: Recent agent item is clickable
- **WHEN** user hovers over a recent agent item
- **THEN** the item SHALL display a background highlight
- **AND** the cursor SHALL change to pointer
- **AND** a subtle "打开编辑器" tooltip MAY appear

### Requirement: Add Sharing Group Dialog Design
The system SHALL provide a dialog for creating new sharing groups.

#### Scenario: Add sharing group dialog displays
- **WHEN** user clicks "添加共享组" button
- **THEN** a modal dialog SHALL appear centered on screen
- **AND** the dialog SHALL have a title "创建共享组"
- **AND** the dialog SHALL contain a name input field
- **AND** the dialog SHALL contain a description textarea (optional)
- **AND** the dialog SHALL have "取消" and "创建" buttons

#### Scenario: Dialog form validation
- **WHEN** user tries to submit without entering a name
- **THEN** the name field SHALL display an error "请输入共享组名称"
- **AND** the "创建" button SHALL be disabled

### Requirement: Toast Notifications for Coming Soon Features
The system SHALL display toast notifications for features that are not yet implemented.

#### Scenario: Toast displays for auto-create agent
- **WHEN** user clicks "自动创建Agent" button
- **THEN** a toast notification SHALL appear at the top or bottom of screen
- **AND** the toast SHALL display "功能开发中，敬请期待"
- **AND** the toast SHALL auto-dismiss after 3 seconds
- **AND** the toast SHALL have an info icon

#### Scenario: Toast displays for import third-party
- **WHEN** user clicks "导入第三方Agent" button
- **THEN** a toast notification SHALL appear
- **AND** the toast SHALL display "功能开发中，敬请期待"
- **AND** the toast SHALL auto-dismiss after 3 seconds

### Requirement: Empty State Design
The system SHALL provide visually appealing empty states when no agents exist.

#### Scenario: Private agents empty state
- **WHEN** user has no private agents
- **THEN** the private agents section SHALL display an illustration
- **AND** the illustration SHALL show an agent icon or friendly graphic
- **AND** a message SHALL display "还没有创建任何Agent"
- **AND** a call-to-action button SHALL suggest "创建第一个Agent"

#### Scenario: Shared agents empty state
- **WHEN** user has no shared agents or sharing groups
- **THEN** the shared agents section SHALL display a message
- **AND** the message SHALL display "暂无共享Agent"
- **AND** a suggestion SHALL display "将私有Agent拖放到共享组来分享"

### Requirement: Responsive Design for My Agents Page
The system SHALL adapt the My Agents page layout for different screen sizes.

#### Scenario: Desktop view (>1024px)
- **WHEN** user views the page on desktop
- **THEN** agent cards SHALL be displayed in a 3 or 4 column grid
- **AND** creation bar buttons SHALL be displayed in a single row
- **AND** sidebar SHALL be visible on the left

#### Scenario: Tablet view (768px-1024px)
- **WHEN** user views the page on tablet
- **THEN** agent cards SHALL be displayed in a 2 column grid
- **AND** creation bar buttons MAY wrap to two rows if needed
- **AND** sidebar SHALL remain visible

#### Scenario: Mobile view (<768px)
- **WHEN** user views the page on mobile
- **THEN** agent cards SHALL be displayed in a single column
- **AND** creation bar buttons SHALL stack vertically
- **AND** sidebar SHALL be hidden behind a hamburger menu

