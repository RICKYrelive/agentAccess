# frontend Specification Delta

## Purpose
This specification delta adds Vue.js + TypeScript implementation requirements for enhanced workflow editor features including canvas navigation, zoom controls, mini-map, and preview panel toggle.

## ADDED Requirements

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

## MODIFIED Requirements

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

## REMOVED Requirements
None

## Cross-References
- Implements `ui-interface` specification requirements for enhanced workflow editor
- Uses `workflow` store state management
- Builds on existing Vue 3 component architecture
