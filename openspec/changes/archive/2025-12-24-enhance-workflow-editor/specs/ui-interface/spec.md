# ui-interface Specification Delta

## Purpose
This specification delta adds requirements for enhanced workflow editor navigation controls, canvas manipulation, and improved preview panel management.

## ADDED Requirements

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

## MODIFIED Requirements

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

## REMOVED Requirements
None

## Cross-References
- Relates to `frontend` specification for implementation details
- Relates to `fastgpt-workflow` specification for workflow data structures
