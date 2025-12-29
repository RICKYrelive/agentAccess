# tool-sources-redesign Spec Delta

## Affected Specification
`mcp-tool-management`

## MODIFIED Requirements

### Requirement: Tool Sources Section

The system SHALL provide a "Tool Sources" section with buttons for creating MCP tools using different methods.

#### Scenario: Tool Sources section layout
- **WHEN** the MCP Tools page is displayed
- **THEN** the system SHALL display a section titled "Tool Sources" below the status cards
- **AND** the section SHALL contain three action buttons in a horizontal grid
- **AND** each button SHALL use consistent dashed border styling

#### Scenario: Import Definition button
- **GIVEN** the Tool Sources section is displayed
- **THEN** the "Import Definition" button SHALL display:
  - An upload file icon in a rounded container
  - Title: "Import Definition"
  - Description: "Upload JSON or YAML OpenAPI specifications to auto-generate tool definitions. Max 10MB."
- **WHEN** user clicks this button
- **THEN** the system SHALL open the OpenAPI import dialog
- **AND** pre-fill with instructions for OpenAPI specification upload

#### Scenario: Connect Database button
- **GIVEN** the Tool Sources section is displayed
- **THEN** the "Connect Database" button SHALL display:
  - A database icon in a rounded container
  - Title: "Connect Database"
  - Description: "Direct integration with PostgreSQL, MySQL, or MongoDB for read/write capability."
- **WHEN** user clicks this button
- **THEN** the system SHALL open a database connection dialog
- **AND** present fields for: database type, host, port, username, password, database name
- **AND** allow testing the connection before saving

#### Scenario: Custom Function button
- **GIVEN** the Tool Sources section is displayed
- **THEN** the "Custom Function" button SHALL display:
  - A code icon in a rounded container
  - Title: "Custom Function"
  - Description: "Manually write Python or TypeScript handlers for specific logic execution."
- **WHEN** user clicks this button
- **THEN** the system SHALL open the custom tool configuration dialog
- **AND** allow specifying URL, authentication, and custom function handlers

#### Scenario: Tool Sources button styling
- **GIVEN** a Tool Sources button is displayed
- **THEN** the button SHALL use:
  - White or card-dark background
  - Dashed border (border-dashed)
  - Gray border color (border-slate-300) in light mode
  - Darker border color (border-slate-700) in dark mode
  - Hover state with primary color border
  - Hover state with shadow
  - Left-aligned text content
- **AND** the icon container SHALL:
  - Use light gray background (bg-slate-50)
  - Darker background (bg-slate-800) in dark mode
  - Transition to primary color background on hover
  - Contain a slate-600 or slate-400 colored icon

#### Scenario: Tool Sources responsive layout
- **GIVEN** the Tool Sources section is displayed on a small screen
- **THEN** the buttons SHALL stack vertically in a single column
- **GIVEN** the Tool Sources section is displayed on a medium or large screen
- **THEN** the buttons SHALL display in a 3-column grid

### Requirement: Database Connection Configuration

The system SHALL allow users to configure database connections as MCP tools.

#### Scenario: User configures PostgreSQL database
- **GIVEN** the database connection dialog is open
- **WHEN** user selects "PostgreSQL" as database type
- **AND** enters host, port (default 5432), username, password, database name
- **AND** clicks "Test Connection"
- **THEN** the system SHALL validate the database connection
- **AND** display success or error message
- **WHEN** user confirms after successful test
- **THEN** the system SHALL create a new MCP tool with type "database"
- **AND** store the database configuration securely (password encrypted)

#### Scenario: User configures MySQL database
- **GIVEN** the database connection dialog is open
- **WHEN** user selects "MySQL" as database type
- **AND** enters host, port (default 3306), username, password, database name
- **AND** submits the form
- **THEN** the system SHALL create a new MCP tool with type "database"
- **AND** store the MySQL connection configuration

#### Scenario: User configures MongoDB database
- **GIVEN** the database connection dialog is open
- **WHEN** user selects "MongoDB" as database type
- **AND** enters connection string or host/port details
- **AND** submits the form
- **THEN** the system SHALL create a new MCP tool with type "database"
- **AND** store the MongoDB connection configuration

### Requirement: Custom Function Handler Configuration

The system SHALL allow users to specify custom function handlers for MCP tools.

#### Scenario: User configures Python handler
- **GIVEN** the custom function dialog is open
- **WHEN** user selects "Python" as handler type
- **AND** provides a code editor or file upload for Python code
- **AND** specifies function name and entry point
- **AND** submits the form
- **THEN** the system SHALL create a new MCP tool with type "custom"
- **AND** store the Python handler configuration

#### Scenario: User configures TypeScript handler
- **GIVEN** the custom function dialog is open
- **WHEN** user selects "TypeScript" as handler type
- **AND** provides a code editor or file upload for TypeScript code
- **AND** specifies function name and entry point
- **AND** submits the form
- **THEN** the system SHALL create a new MCP tool with type "custom"
- **AND** store the TypeScript handler configuration

## REMOVED Requirements

None. All existing creation methods are preserved with improved UI.
