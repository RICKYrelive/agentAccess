# frontend Specification

## Purpose
Defines the Vue.js + TypeScript web application frontend for the Agent Access system. This specification covers the complete implementation of the user interface including three-column layout, chat interface, agent management, knowledge base integration, workflow editor, and MCP service configuration.
## Requirements
### Requirement: Vue.js Application Structure
The system SHALL provide a complete Vue.js + TypeScript web application implementing all UI specifications from the Agent Access interaction diagrams.

#### Scenario: Application initialization
- **WHEN** user loads the Agent Access web application
- **THEN** the system SHALL initialize Vue.js application with TypeScript support
- **AND** the system SHALL display the three-column layout interface
- **AND** the system SHALL load user preferences and settings

#### Scenario: Responsive layout adaptation
- **WHEN** user accesses application on different screen sizes
- **THEN** the system SHALL adapt the layout for mobile, tablet, and desktop views
- **AND** the system SHALL maintain full functionality across all device types

### Requirement: Three-Column Layout Implementation
The system SHALL provide a responsive three-column layout with left navigation sidebar, central content area, and right settings panel.

#### Scenario: Main interface display
- **WHEN** user opens the application
- **THEN** the system SHALL display the left sidebar with navigation items
- **AND** the system SHALL display the central content area for interactions
- **AND** the system SHALL provide the right settings panel for configuration
- **AND** the layout SHALL be responsive and collapsible on smaller screens

#### Scenario: Panel interaction
- **WHEN** user clicks navigation items in the sidebar
- **THEN** the central content SHALL update accordingly
- **WHEN** user adjusts settings in the right panel
- **THEN** configuration changes SHALL be applied immediately

### Requirement: Navigation and User Management
The system SHALL provide comprehensive navigation functionality and user management interface.

#### Scenario: User navigation
- **WHEN** user clicks "新对话" (New Conversation)
- **THEN** the system SHALL start a fresh conversation session
- **WHEN** user expands knowledge base menu
- **THEN** the system SHALL display categorized knowledge repositories
- **WHEN** user views recent conversations
- **THEN** the system SHALL display conversation history with timestamps

#### Scenario: User profile management
- **WHEN** user views profile in sidebar
- **THEN** the system SHALL display username "用户03928" and avatar
- **AND** the system SHALL provide menu for additional user options

### Requirement: Knowledge Base Integration Interface
The system SHALL provide an intuitive interface for knowledge base selection and management.

#### Scenario: Knowledge base selection
- **WHEN** user interacts with knowledge base selector
- **THEN** the system SHALL display available knowledge repositories
- **AND** the system SHALL categorize knowledge bases by domain
- **WHEN** user selects a knowledge base
- **THEN** the system SHALL highlight the selection and filter responses accordingly

#### Scenario: Function card interaction
- **WHEN** user views function cards grid
- **THEN** the system SHALL display cards for "智能数据分析", "写作助手", etc.
- **AND** each card SHALL include icon, title, and description
- **WHEN** user clicks a function card
- **THEN** the system SHALL activate the corresponding AI capability

### Requirement: Visual Workflow Editor
[MODIFIED] The system SHALL provide a drag-and-drop workflow editor with canvas navigation controls including zoom (50%-200%), pan (mouse drag, arrow keys), mini-map overview, and toggleable preview panel.

#### Scenario: Enhanced workflow editor initialization
- **WHEN** user accesses workflow editor
- **THEN** the system SHALL display "Agent编辑器" as the title
- **AND** the system SHALL initialize canvas transform state (scale: 1.0, pan: {0, 0})
- **AND** the system SHALL render floating controls for zoom and pan
- **AND** the system SHALL render mini-map in corner
- **AND** the system SHALL render preview panel (visible by default)

#### Scenario: User works with workflow
- **WHEN** user adds nodes to the workflow
- **THEN** the system SHALL update canvas to accommodate new nodes
- **AND** the mini-map SHALL reflect the new layout
- **AND** the user MAY zoom, pan, or fit to screen as needed

### Requirement: MCP Service Configuration Interface
The system SHALL provide an interface for configuring Model Context Protocol services.

#### Scenario: MCP service management
- **WHEN** user opens MCP service settings
- **THEN** the system SHALL display categorized service options
- **AND** categories SHALL include "检索工具", "信息处理", "开发者工具", "云服务"
- **WHEN** user toggles a service switch
- **THEN** the system SHALL enable or disable that service capability

#### Scenario: Service customization
- **WHEN** user configures "联网搜索" service
- **THEN** the system SHALL allow search parameter customization
- **WHEN** user adds new MCP service
- **THEN** the system SHALL provide interface for service integration and validation

### Requirement: Multi-Agent Support Interface
The system SHALL provide functionality for switching between and managing multiple AI agents.

#### Scenario: Agent switching
- **WHEN** user selects "我的Agent" (My Agent)
- **THEN** the system SHALL display personal AI agents
- **WHEN** user selects "团队Agent" (Team Agent)
- **THEN** the system SHALL display team-shared agents
- **WHEN** user chooses a specialized agent
- **THEN** the system SHALL switch to that agent's interface and capabilities

#### Scenario: Agent management
- **WHEN** user manages agent profiles
- **THEN** the system SHALL allow agent configuration and customization
- **AND** the system SHALL support agent sharing and collaboration features

### Requirement: Real-time Preview and Testing
The system SHALL provide real-time preview of workflow configurations and immediate testing capabilities.

#### Scenario: Workflow testing
- **WHEN** user enters test question in preview panel
- **THEN** the system SHALL process through configured workflow
- **AND** the system SHALL display AI response with referenced materials
- **WHEN** user clicks "重新生成" (Regenerate)
- **THEN** the system SHALL reprocess with current configuration

#### Scenario: Configuration feedback
- **WHEN** user modifies workflow configuration
- **THEN** the preview panel SHALL update in real-time
- **AND** the system SHALL provide immediate feedback on changes
- **WHEN** configuration has errors
- **THEN** the system SHALL display validation messages and suggestions

### Requirement: Performance and Usability
The system SHALL provide optimal performance and intuitive user experience.

#### Scenario: Loading and responsiveness
- **WHEN** user interacts with any interface element
- **THEN** the system SHALL respond within 200ms for UI interactions
- **AND** the system SHALL provide loading indicators for operations >1s
- **WHEN** application loads
- **THEN** the system SHALL display loading state and initialize within 3s

#### Scenario: Error handling
- **WHEN** system encounters errors
- **THEN** the system SHALL display user-friendly error messages
- **AND** the system SHALL provide recovery options and guidance

### Requirement: Workflow Editor Canvas Transform State
The system SHALL maintain canvas transform state in the Pinia workflow store.

#### Scenario: Canvas state initialization
- **WHEN** workflow editor is loaded
- **THEN** the system SHALL initialize `canvasScale` to 1.0
- **AND** the system SHALL initialize `canvasPan` to { x: 0, y: 0 }
- **AND** the system SHALL initialize `isPreviewPanelVisible` to true

#### Scenario: Canvas scale is updated
- **WHEN** user triggers a zoom action
- **THEN** the system SHALL update `canvasScale` in the store
- **AND** the value SHALL be constrained between 0.5 and 2.0
- **AND** components SHALL reactively update to reflect the new scale

#### Scenario: Canvas pan is updated
- **WHEN** user triggers a pan action
- **THEN** the system SHALL update `canvasPan` in the store
- **AND** components SHALL reactively update to reflect the new position

### Requirement: Canvas Transform Rendering
The system SHALL apply CSS transforms to render canvas zoom and pan.

#### Scenario: Canvas transform is applied
- **WHEN** canvasScale or canvasPan changes
- **THEN** the system SHALL apply `transform: translate(x, y) scale(s)` to the node container
- **AND** the system SHALL update connection line positions accordingly
- **AND** the system SHALL maintain smooth 60fps rendering during pan/zoom

#### Scenario: Background grid renders with transform
- **WHEN** canvas is panned
- **THEN** the background grid SHALL move with the canvas
- **AND** the grid SHALL create a sense of depth and position

### Requirement: Floating Canvas Controls Component
The system SHALL provide a `FloatingCanvasControls.vue` component for canvas navigation.

#### Scenario: Controls are displayed
- **WHEN** workflow editor is displayed
- **THEN** the system SHALL render floating controls in the bottom-right corner
- **AND** controls SHALL include Zoom In, Zoom Out, Reset Zoom, Fit to Screen, Locate Start buttons
- **AND** controls SHALL have hover and active states

#### Scenario: Zoom In button is clicked
- **WHEN** user clicks Zoom In button
- **THEN** the system SHALL call `setCanvasScale(scale + 0.1)`
- **AND** the scale SHALL not exceed 2.0

#### Scenario: Zoom Out button is clicked
- **WHEN** user clicks Zoom Out button
- **THEN** the system SHALL call `setCanvasScale(scale - 0.1)`
- **AND** the scale SHALL not go below 0.5

#### Scenario: Reset Zoom button is clicked
- **WHEN** user clicks Reset Zoom button
- **THEN** the system SHALL call `setCanvasScale(1.0)`
- **AND** the pan offset SHALL remain unchanged

### Requirement: Mini-map Component
The system SHALL provide a `MiniMap.vue` component for canvas overview.

#### Scenario: Mini-map is rendered
- **WHEN** workflow editor is displayed
- **THEN** the system SHALL render mini-map in the bottom-left corner
- **AND** the mini-map SHALL be approximately 200x150 pixels
- **AND** the mini-map SHALL show a simplified view of all nodes

#### Scenario: Nodes are rendered in mini-map
- **WHEN** nodes exist in the workflow
- **THEN** each node SHALL be rendered as a small colored dot
- **AND** dot position SHALL correspond to node position scaled down
- **AND** dot color SHALL match the node type color

#### Scenario: Viewport rectangle is shown
- **WHEN** canvas is zoomed or panned
- **THEN** the mini-map SHALL display a rectangle representing the viewport
- **AND** the rectangle size SHALL correspond to zoom level
- **AND** the rectangle position SHALL correspond to pan offset

#### Scenario: User clicks mini-map to pan
- **WHEN** user clicks on the mini-map
- **THEN** the system SHALL pan the canvas to center the clicked location
- **AND** the zoom level SHALL remain unchanged

### Requirement: Preview Panel Toggle Implementation
The system SHALL implement preview panel visibility toggle.

#### Scenario: Toggle button is displayed
- **WHEN** workflow editor toolbar is rendered
- **THEN** the system SHALL display "验证工作流" button
- **AND** button text SHALL indicate current state (显示/隐藏)
- **AND** button SHALL have an icon representing preview

#### Scenario: Preview panel is toggled off
- **WHEN** user clicks "验证工作流" button and panel is visible
- **THEN** the system SHALL set `isPreviewPanelVisible` to false
- **AND** the preview panel SHALL animate closed
- **AND** the canvas SHALL expand to fill the space

#### Scenario: Preview panel is toggled on
- **WHEN** user clicks "验证工作流" button and panel is hidden
- **THEN** the system SHALL set `isPreviewPanelVisible` to true
- **AND** the preview panel SHALL animate open
- **AND** the canvas SHALL shrink to accommodate the panel

### Requirement: Keyboard Shortcuts
The system SHALL support keyboard shortcuts for canvas navigation.

#### Scenario: User uses zoom keyboard shortcuts
- **WHEN** user presses Ctrl/Cmd + Plus
- **THEN** the system SHALL zoom in by 10%
- **WHEN** user presses Ctrl/Cmd + Minus
- **THEN** the system SHALL zoom out by 10%
- **WHEN** user presses Ctrl/Cmd + 0
- **THEN** the system SHALL reset zoom to 100%

#### Scenario: User uses fit to screen shortcut
- **WHEN** user presses Ctrl/Cmd + F
- **THEN** the system SHALL fit all nodes to the viewport

#### Scenario: User uses panel toggle shortcut
- **WHEN** user presses Ctrl/Cmd + P
- **THEN** the system SHALL toggle the preview panel visibility

#### Scenario: User uses arrow keys to pan
- **WHEN** canvas area has focus and user presses arrow keys
- **THEN** the system SHALL pan the canvas by 50 pixels in the arrow direction

### Requirement: Mouse Wheel Interactions
The system SHALL support mouse wheel for canvas navigation.

#### Scenario: User scrolls to zoom
- **WHEN** user holds Ctrl/Cmd and scrolls mouse wheel up
- **THEN** the system SHALL zoom in centered on cursor
- **WHEN** user holds Ctrl/Cmd and scrolls mouse wheel down
- **THEN** the system SHALL zoom out centered on cursor

#### Scenario: User scrolls to pan
- **WHEN** user scrolls mouse wheel without modifier keys
- **THEN** the system SHALL pan the canvas in the scroll direction

### Requirement: Mouse Drag Pan
The system SHALL support mouse drag for canvas panning.

#### Scenario: User drags with middle mouse button
- **WHEN** user presses middle mouse button and drags
- **THEN** the system SHALL set `isCanvasPanning` to true
- **AND** the system SHALL update `canvasPan` based on mouse movement
- **WHEN** user releases middle mouse button
- **THEN** the system SHALL set `isCanvasPanning` to false

#### Scenario: User drags with space + left mouse
- **WHEN** user holds space bar and left mouse button while dragging
- **THEN** the system SHALL pan the canvas in the drag direction
- **AND** the cursor SHALL change to indicate pan mode

### Requirement: Performance Optimization
The system SHALL optimize rendering performance for canvas interactions.

#### Scenario: Mini-map update throttling
- **WHEN** canvas state changes rapidly during pan/zoom
- **THEN** the mini-map SHALL update at most 10 times per second
- **AND** updates SHALL use `requestAnimationFrame` for smooth rendering

#### Scenario: Large workflow rendering
- **WHEN** workflow contains more than 50 nodes
- **THEN** the system SHALL maintain 60fps during pan/zoom operations
- **AND** the system SHALL use CSS transforms for GPU acceleration

