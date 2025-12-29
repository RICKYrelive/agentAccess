# active-tools-table Spec Delta

## Affected Specification
`mcp-tool-management`

## MODIFIED Requirements

### Requirement: MCP Tool Display

[MODIFIED] The system SHALL display MCP tools in a comprehensive table format with detailed information and actions.

#### Scenario: Active Tools table display
- **WHEN** the MCP Tools page is displayed
- **THEN** the system SHALL display an "Active Tools" section
- **AND** the section SHALL show a count badge (e.g., "14")
- **AND** the section SHALL contain a data table with columns: Name, Type, Status, Latency, Last Sync, Actions
- **AND** the table SHALL be scrollable horizontally on small screens

#### Scenario: Name column display
- **GIVEN** an MCP tool is displayed in the table
- **THEN** the Name column SHALL show:
  - An icon container with type-specific color and icon
  - The tool name as primary text
  - An optional subtitle (e.g., environment name, version, or description)
- **AND** the icon SHALL use color coding:
  - Emerald/green for Database View types
  - Red for PDF/document types
  - Purple for Storage API types
  - Orange for Webhook types
  - Blue for other API types

#### Scenario: Type column display
- **GIVEN** an MCP tool is displayed in the table
- **THEN** the Type column SHALL show the tool category:
  - "Database View" for database-backed tools
  - "Lambda Function" for serverless functions
  - "Storage API" for storage integrations (e.g., S3)
  - "Webhook" for webhook-based tools
  - "REST API" for REST API integrations
  - "Custom" for custom function handlers

#### Scenario: Status column display with badges
- **GIVEN** an MCP tool with status 'active'
- **THEN** the Status column SHALL show a green badge with "Active" or "Ready"
- **AND** the badge SHALL contain a solid green dot indicator
- **GIVEN** an MCP tool with status 'inactive' or 'disabled'
- **THEN** the Status column SHALL show a gray badge with "Inactive" or "Disabled"
- **GIVEN** an MCP tool with status 'error'
- **THEN** the Status column SHALL show an amber badge with "Degraded" or "Error"
- **GIVEN** an MCP tool with status 'updating'
- **THEN** the Status column SHALL show a blue badge with "Updating"
- **AND** the badge SHALL contain an animated pulsing dot indicator

#### Scenario: Latency column display
- **GIVEN** an MCP tool with measured latency
- **THEN** the Latency column SHALL display the response time in milliseconds (e.g., "45ms", "1200ms")
- **AND** the value SHALL use monospace font
- **GIVEN** an MCP tool without latency data (e.g., storage, database views)
- **THEN** the Latency column SHALL display "--"

#### Scenario: Last Sync column display
- **GIVEN** an MCP tool with a recent sync timestamp
- **THEN** the Last Sync column SHALL display relative time (e.g., "2 mins ago", "1h ago")
- **GIVEN** an MCP tool with an older sync timestamp
- **THEN** the Last Sync column SHALL display absolute date (e.g., "Oct 24, 2024")
- **GIVEN** an MCP tool without sync data
- **THEN** the Last Sync column SHALL display "Never" or "--"

#### Scenario: Actions column display
- **GIVEN** an MCP tool is displayed in the table
- **THEN** the Actions column SHALL show a "more options" button (three dots icon)
- **WHEN** user clicks the actions button
- **THEN** the system SHALL display a dropdown menu with options:
  - "Edit" - opens the configuration dialog
  - "Enable/Disable" - toggles the tool status
  - "Test Connection" - validates tool connectivity
  - "Delete" - removes the tool with confirmation

#### Scenario: Table row hover state
- **WHEN** user hovers over a table row
- **THEN** the row SHALL display a subtle background highlight
- **AND** the highlight SHALL use slate-50 background in light mode
- **AND** the highlight SHALL use slate-800/50 background in dark mode

#### Scenario: Table responsive behavior
- **GIVEN** the table is displayed on a small screen
- **THEN** the table container SHALL allow horizontal scrolling
- **AND** the table header SHALL remain sticky during scroll
- **GIVEN** the table is displayed on a large screen
- **THEN** all columns SHALL be visible without scrolling

#### Scenario: Filter and search controls
- **GIVEN** the Active Tools section is displayed
- **THEN** the section SHALL include:
  - A "Filter" button for filtering by type, status
  - A search input field for searching by tool name
- **WHEN** user types in the search field
- **THEN** the table SHALL filter to show matching tools
- **WHEN** user clicks the Filter button
- **THEN** the system SHALL display filter options
- **AND** the table SHALL update to show only tools matching the selected filters

#### Scenario: Empty state display
- **GIVEN** no MCP tools exist
- **WHEN** the Active Tools table is displayed
- **THEN** the table SHALL show an empty state message
- **AND** the message SHALL encourage users to create tools using the Tool Sources buttons
- **AND** the table MAY show an illustration or icon

### Requirement: MCP Tool Status Badge Colors

The system SHALL use consistent color coding for status badges across the table.

#### Scenario: Status badge color scheme
- **GIVEN** a tool status badge needs to be displayed
- **THEN** the system SHALL use the following color scheme:
  - Ready/Active: green-100 background, green-700 text, green-200 border
  - Updating: blue-100 background, blue-700 text, blue-200 border, animated dot
  - Degraded/Error: amber-100 background, amber-700 text, amber-200 border
  - Inactive/Disabled: slate-100 background, slate-600 text, slate-200 border

### Requirement: Tool Type to Display Name Mapping

The system SHALL map internal tool types to human-readable display names.

#### Scenario: Type name mapping
- **GIVEN** an MCP tool with internal type
- **THEN** the system SHALL display the following mapped names:
  - 'builtin' → "Builtin Tool" or keep internal type name
  - 'custom' → "REST API" or "Custom Function"
  - 'database' → "Database View"
  - 'npx' → "Lambda Function" (if applicable)
  - 'uvx' → "Lambda Function" (if applicable)
  - 'webhook' → "Webhook"

## REMOVED Requirements

None. The card-based display is being replaced by the table view, which provides equivalent functionality with improved information density.

### Requirement: MCP Tool Display (Card-based) - REMOVED

The card-based display requirement is removed in favor of the table display. All functionality (viewing, editing, deleting tools) is preserved in the table format.

#### Scenario: [DEPRECATED] Tool card display
- This scenario is replaced by table row display
