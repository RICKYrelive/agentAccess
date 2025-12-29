# status-overview-cards Spec Delta

## Affected Specification
`mcp-tool-management`

## ADDED Requirements

### Requirement: Status Overview Cards Display

The system SHALL display a status overview section with three metric cards at the top of the MCP Tools page.

#### Scenario: User views MCP Tools page with status cards
- **WHEN** user navigates to the MCP Tools page
- **THEN** the system SHALL display three status cards in a horizontal grid layout
- **AND** the cards SHALL be styled with glass-panel effect (semi-transparent background with blur)
- **AND** each card SHALL display an icon, a metric value, and a label

#### Scenario: Active Tools card display
- **GIVEN** the status cards section is displayed
- **THEN** the "Active Tools" card SHALL show:
  - A blue API/cube icon
  - The count of enabled MCP tools (e.g., "24 connected")
  - Blue accent color scheme (bg-blue-50, text-blue-600)

#### Scenario: Usage Today card display
- **GIVEN** the status cards section is displayed
- **THEN** the "Usage Today" card SHALL show:
  - A purple lightning bolt icon
  - The daily invocation count (e.g., "8.5k invocations")
  - Purple accent color scheme (bg-purple-50, text-purple-600)
- **AND** if usage data is unavailable, display "--" or "N/A"

#### Scenario: System Status card display
- **GIVEN** the status cards section is displayed
- **THEN** the "System Status" card SHALL show:
  - A green checkmark icon
  - The status text (e.g., "Operational", "Degraded", "Offline")
  - Green accent color scheme (bg-green-50, text-green-600)
  - An animated pulse indicator when status is "Operational"
  - A timestamp showing when the status was last checked (e.g., "1m ago")

#### Scenario: Status cards responsive layout
- **GIVEN** the status cards are displayed on a small screen (mobile)
- **THEN** the cards SHALL stack vertically in a single column
- **GIVEN** the status cards are displayed on a medium screen (tablet)
- **THEN** the cards MAY display in a 2-column grid
- **GIVEN** the status cards are displayed on a large screen (desktop)
- **THEN** the cards SHALL display in a 3-column grid

### Requirement: Active Tools Count Calculation

The system SHALL calculate and display the number of active (enabled) MCP tools.

#### Scenario: System calculates active tool count
- **GIVEN** multiple MCP tools exist with various enabled states
- **WHEN** the status cards are rendered
- **THEN** the system SHALL count tools where `isEnabled === true`
- **AND** display this count in the Active Tools card
- **AND** update the count in real-time as tools are enabled/disabled

#### Scenario: All tools are disabled
- **GIVEN** no MCP tools are enabled
- **THEN** the Active Tools card SHALL display "0 connected"

### Requirement: System Status Determination

The system SHALL determine and display the overall system health status based on MCP tool states.

#### Scenario: All tools are operational
- **GIVEN** all enabled MCP tools have status "active"
- **THEN** the System Status card SHALL display "Operational"
- **AND** show a green checkmark with animated pulse

#### Scenario: Some tools are in error state
- **GIVEN** at least one enabled MCP tool has status "error"
- **THEN** the System Status card SHALL display "Degraded"
- **AND** show an amber/yellow warning icon

#### Scenario: All tools are disabled or in error
- **GIVEN** no enabled MCP tools are operational
- **THEN** the System Status card SHALL display "Offline"
- **AND** show a red error icon

### Requirement: Usage Metrics Display

The system SHALL display daily tool usage metrics when available.

#### Scenario: Usage metrics are available
- **GIVEN** backend provides daily usage statistics
- **WHEN** the Usage Today card is rendered
- **THEN** the card SHALL display the invocation count
- **AND** format large numbers (e.g., "8.5k" for 8500)

#### Scenario: Usage metrics are unavailable
- **GIVEN** backend does not provide usage statistics
- **THEN** the Usage Today card SHALL display "N/A" or "--"
- **AND** the card MAY show a "coming soon" indicator

## MODIFIED Requirements

### Requirement: MCP Tools Page Display

[MODIFIED] The system SHALL provide a dedicated MCP Tools management page with a header, status overview section, tool sources section, and active tools table section.

#### Scenario: User navigates to MCP Tools page
- **WHEN** user clicks "MCP 工具" menu item in the sidebar
- **THEN** the system SHALL navigate to the MCP Tools page
- **AND** the system SHALL display page title "MCP 工具管理"
- **AND** the system SHALL display three status overview cards (NEW)
- **AND** the system SHALL display tool source buttons (MODIFIED)
- **AND** the system SHALL display existing MCP tools in a table view (MODIFIED)
