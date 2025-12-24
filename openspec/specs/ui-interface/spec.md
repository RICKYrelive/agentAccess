# ui-interface Specification

## Purpose
Documents the UI/UX design specifications for the Agent Access system based on analysis of interaction diagrams. This specification defines the three-column layout interface, knowledge base integration, MCP service configuration, visual workflow editor, and multi-agent support patterns.
## Requirements
### Requirement: Main Interface Layout
The Agent Access system SHALL provide a three-column layout interface with left navigation sidebar, central content area, and right settings panel.

#### Scenario: User navigates through main interface
- **WHEN** user opens Agent Access
- **THEN** the system SHALL display the complete interface with all three main sections
- **AND** the left sidebar SHALL contain navigation items and user profile
- **AND** the central area SHALL display welcome message and input field
- **AND** the right panel SHALL be available for MCP service configuration

#### Scenario: User interacts with navigation sidebar
- **WHEN** user clicks "新对话" (New Conversation) button
- **THEN** the system SHALL initiate a new conversation session
- **WHEN** user expands knowledge base menu
- **THEN** the system SHALL display categorized knowledge repositories
- **WHEN** user selects a recent agent
- **THEN** the system SHALL switch to that agent's specialized context

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
The system SHALL support switching between different specialized AI agents for various domains and tasks.

#### Scenario: User switches between agent types
- **WHEN** user selects "我的Agent" (My Agent)
- **THEN** the system SHALL display personal AI agents
- **WHEN** user selects "团队Agent" (Team Agent)
- **THEN** the system SHALL display team-shared agents
- **WHEN** user selects a specialized agent (e.g., "机电维修助手")
- **THEN** the system SHALL switch to domain-specific interaction mode

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

