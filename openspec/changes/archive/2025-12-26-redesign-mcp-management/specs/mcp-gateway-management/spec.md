# mcp-gateway-management Specification

## Purpose
Defines the MCP gateway management capability for the Agent Access system. This specification covers creating, viewing, editing, and deleting MCP gateways, as well as importing OpenAPI specifications to automatically generate MCP tool wrappers.

## ADDED Requirements

### Requirement: MCP Gateway Page Display

The system SHALL provide a dedicated MCP Gateway management page with a header, creation section, and gateways table.

#### Scenario: User navigates to MCP Gateway page
- **WHEN** user clicks "MCP 网关" menu item in the sidebar
- **THEN** the system SHALL navigate to the MCP Gateway page
- **AND** the system SHALL display page title "MCP 网关管理"
- **AND** the system SHALL display "创建网关" and "导入 OpenAPI" buttons
- **AND** the system SHALL display existing gateways in a table

#### Scenario: User views empty MCP Gateway page
- **WHEN** user navigates to MCP Gateway page with no gateways
- **THEN** the system SHALL display the page header and action buttons
- **AND** the system SHALL show appropriate empty state messaging in the table area

### Requirement: MCP Gateway Table Display

The system SHALL display MCP gateways in a table format with relevant columns and actions.

#### Scenario: Gateway table displays all gateways
- **GIVEN** one or more MCP gateways exist
- **WHEN** the MCP Gateway page is displayed
- **THEN** the table SHALL display a row for each gateway
- **AND** each row SHALL show: name, description, tool count, status, actions

#### Scenario: Gateway table row actions
- **GIVEN** a gateway row in the table
- **THEN** the row SHALL include an edit button
- **AND** the row SHALL include a delete button

### Requirement: MCP Gateway Creation

The system SHALL allow users to create new MCP gateways by providing basic configuration and associating MCP tools.

#### Scenario: User opens create gateway dialog
- **WHEN** user clicks "创建网关" button
- **THEN** the system SHALL display a creation dialog
- **AND** the dialog SHALL contain fields for: name, description, base URL, associated tools

#### Scenario: User creates gateway with tools
- **GIVEN** the create gateway dialog is open
- **WHEN** user enters name, base URL, selects associated MCP tools
- **AND** user submits the form
- **THEN** the system SHALL create a new MCP gateway
- **AND** store the gateway configuration
- **AND** display the gateway in the gateways table

#### Scenario: User validates gateway form
- **WHEN** user submits form with missing required fields
- **THEN** the system SHALL display validation errors
- **AND** prevent form submission

### Requirement: OpenAPI File Import

The system SHALL allow users to import OpenAPI specifications and automatically generate MCP tool wrappers for the API endpoints.

#### Scenario: User opens OpenAPI import dialog
- **WHEN** user clicks "导入 OpenAPI" button
- **THEN** the system SHALL display an import dialog
- **AND** the dialog SHALL contain a file upload area
- **AND** the upload area SHALL accept .json, .yaml, and .yml files

#### Scenario: User uploads OpenAPI JSON file
- **GIVEN** the OpenAPI import dialog is open
- **WHEN** user uploads a valid OpenAPI JSON file
- **THEN** the system SHALL parse the JSON content
- **AND** extract all API endpoints
- **AND** generate MCP tool configurations for each endpoint
- **AND** display preview of generated tools

#### Scenario: User uploads OpenAPI YAML file
- **GIVEN** the OpenAPI import dialog is open
- **WHEN** user uploads a valid OpenAPI YAML file
- **THEN** the system SHALL parse the YAML content
- **AND** extract all API endpoints
- **AND** generate MCP tool configurations for each endpoint
- **AND** display preview of generated tools

#### Scenario: User confirms OpenAPI import
- **GIVEN** an OpenAPI file has been parsed and tools previewed
- **WHEN** user confirms the import
- **THEN** the system SHALL create a new MCP gateway
- **AND** create MCP tools for all endpoints
- **AND** associate the tools with the gateway
- **AND** navigate to the MCP Gateway page
- **AND** display success notification

#### Scenario: User cancels OpenAPI import
- **GIVEN** an OpenAPI file has been parsed and tools previewed
- **WHEN** user cancels the import
- **THEN** the system SHALL close the dialog
- **AND** not create any gateway or tools

#### Scenario: OpenAPI import handles invalid file
- **GIVEN** the OpenAPI import dialog is open
- **WHEN** user uploads an invalid or malformed file
- **THEN** the system SHALL display an error message
- **AND** not create any gateway or tools
- **AND** keep the dialog open for retry

#### Scenario: OpenAPI import shows endpoint preview
- **GIVEN** an OpenAPI file has been successfully parsed
- **THEN** the preview SHALL show for each endpoint:
  - HTTP method and path
  - Operation summary or description
  - Generated tool name
- **AND** user SHALL see total count of tools to be created

### Requirement: MCP Gateway Editing

The system SHALL allow users to edit MCP gateway configurations.

#### Scenario: User edits gateway
- **WHEN** user clicks edit button on a gateway row
- **THEN** the system SHALL open edit dialog with current values
- **AND** allow editing name, description, base URL, associated tools

#### Scenario: User submits gateway edit
- **WHEN** user submits the edit form
- **THEN** the system SHALL update the gateway in the store
- **AND** refresh the gateway table
- **AND** show success indication

### Requirement: MCP Gateway Deletion

The system SHALL allow users to delete MCP gateways with confirmation.

#### Scenario: User deletes gateway
- **WHEN** user clicks delete button on a gateway row
- **THEN** the system SHALL display a confirmation dialog
- **AND** the dialog SHALL show impact information (associated tools count)
- **WHEN** user confirms deletion
- **THEN** the system SHALL remove the gateway from the store
- **AND** remove gateway associations from tools
- **AND** refresh the gateways table
- **WHEN** user cancels deletion
- **THEN** the system SHALL keep the gateway
- **AND** close the dialog

### Requirement: Gateway Status Display

The system SHALL display the current status of each MCP gateway.

#### Scenario: Gateway shows running status
- **GIVEN** a gateway with status 'running'
- **THEN** the table SHALL display "运行中" in green
- **AND** show a green status indicator

#### Scenario: Gateway shows stopped status
- **GIVEN** a gateway with status 'stopped'
- **THEN** the table SHALL display "已停止" in gray
- **AND** show a gray status indicator

#### Scenario: Gateway shows error status
- **GIVEN** a gateway with status 'error'
- **THEN** the table SHALL display "错误" in red
- **AND** show a red status indicator

### Requirement: Associated Tools Display

The system SHALL display the number of MCP tools associated with each gateway.

#### Scenario: Gateway shows tool count
- **GIVEN** a gateway with associated MCP tools
- **THEN** the table SHALL display the count of associated tools
- **AND** format as "X 个工具" where X is the count

#### Scenario: Gateway with no tools
- **GIVEN** a gateway with no associated tools
- **THEN** the table SHALL display "0 个工具"
- **AND** show in a muted color

### Requirement: Navigation Integration

The system SHALL integrate the MCP Gateway page into the main navigation.

#### Scenario: MCP Gateway menu item navigation
- **WHEN** user clicks "MCP 网关" in the sidebar
- **THEN** the system SHALL navigate to MCP Gateway page
- **AND** the sidebar SHALL highlight "MCP 网关" as active

#### Scenario: User navigates away from MCP Gateway page
- **WHEN** user clicks another navigation item
- **THEN** the system SHALL navigate to the selected page
- **AND** the MCP Gateway page SHALL preserve its state
- **AND** the "MCP 网关" menu item SHALL no longer be highlighted

### Requirement: Responsive Design

The system SHALL provide a responsive layout for the MCP Gateway page.

#### Scenario: Desktop layout
- **WHEN** user views MCP Gateway page on desktop (>1024px)
- **THEN** the gateway table SHALL display all columns
- **AND** action buttons SHALL be visible on each row

#### Scenario: Tablet layout
- **WHEN** user views MCP Gateway page on tablet (768px-1024px)
- **THEN** the gateway table SHALL display with horizontal scroll if needed
- **OR** the table SHALL adapt to show fewer columns

#### Scenario: Mobile layout
- **WHEN** user views MCP Gateway page on mobile (<768px)
- **THEN** the table SHALL switch to card view
- **AND** each gateway SHALL display as a card with stacked information
- **AND** action buttons SHALL be stacked at bottom of card
