# mcp-tool-management Specification

## Purpose
Defines the MCP tool management capability for the Agent Access system. This specification covers browsing, importing, configuring, and managing MCP tools through three methods: builtin store import, custom configuration, and npx/uvx image deployment.

## ADDED Requirements

### Requirement: MCP Tools Page Display

The system SHALL provide a dedicated MCP Tools management page with a header, creation section, and tools display section.

#### Scenario: User navigates to MCP Tools page
- **WHEN** user clicks "MCP 工具" menu item in the sidebar
- **THEN** the system SHALL navigate to the MCP Tools page
- **AND** the system SHALL display page title "MCP 工具管理"
- **AND** the system SHALL display three creation option buttons
- **AND** the system SHALL display existing MCP tools as cards

#### Scenario: User views empty MCP Tools page
- **WHEN** user navigates to MCP Tools page with no tools
- **THEN** the system SHALL display the page header and creation buttons
- **AND** the system SHALL show appropriate empty state messaging

### Requirement: Builtin MCP Tool Import

The system SHALL allow users to browse and import builtin MCP tools from an official tool store.

#### Scenario: User opens builtin tool store
- **WHEN** user clicks "从官方商店导入" button
- **THEN** the system SHALL display a dialog with available builtin tools
- **AND** each tool SHALL show name, description, and category
- **AND** already imported tools SHALL be marked

#### Scenario: User imports builtin tool
- **GIVEN** the builtin tool store dialog is open
- **WHEN** user selects an unimported tool and confirms
- **THEN** the system SHALL add the tool to the user's MCP tools list
- **AND** display a success notification
- **AND** refresh the tools display

#### Scenario: User enables/disables builtin tool
- **GIVEN** a builtin tool is imported
- **WHEN** user clicks the enable/disable button
- **THEN** the system SHALL toggle the tool's enabled status
- **AND** update the card to reflect the new status

### Requirement: Custom MCP Tool Configuration

The system SHALL allow users to configure custom third-party MCP tools by providing URL and authentication information.

#### Scenario: User opens custom tool configuration
- **WHEN** user clicks "自定义第三方工具" button
- **THEN** the system SHALL display a configuration dialog
- **AND** the dialog SHALL contain fields for: name, description, URL, auth type, credentials

#### Scenario: User configures tool with API key auth
- **GIVEN** the custom tool dialog is open
- **WHEN** user enters name, URL, selects "apikey" auth, provides API key
- **AND** user submits the form
- **THEN** the system SHALL create a new custom MCP tool
- **AND** store the tool configuration
- **AND** display the tool in the tools list

#### Scenario: User tests tool connection
- **GIVEN** the custom tool dialog has URL configured
- **WHEN** user clicks "测试连接" button
- **THEN** the system SHALL attempt to validate the connection
- **AND** display success or error message

### Requirement: npx/uvx Image Deployment

The system SHALL allow users to import and deploy MCP tools from Node.js (npx) or Python (uvx) package registries.

#### Scenario: User opens image deployment dialog
- **WHEN** user clicks "导入镜像" button
- **THEN** the system SHALL display a deployment dialog
- **AND** the dialog SHALL contain fields for: package type, package name, version

#### Scenario: User deploys npx image
- **GIVEN** the image deployment dialog is open
- **WHEN** user selects "npx" type, enters package name
- **AND** user submits the form
- **THEN** the system SHALL create an MCP tool with type "npx"
- **AND** store the package configuration
- **AND** display the tool in the tools list

#### Scenario: User deploys uvx image
- **GIVEN** the image deployment dialog is open
- **WHEN** user selects "uvx" type, enters package name
- **AND** user submits the form
- **THEN** the system SHALL create an MCP tool with type "uvx"
- **AND** store the package configuration
- **AND** display the tool in the tools list

### Requirement: MCP Tool Display

The system SHALL display MCP tools as cards with relevant information and actions.

#### Scenario: System displays tool card
- **GIVEN** an MCP tool exists
- **WHEN** the MCP Tools page is displayed
- **THEN** the card SHALL show: name, icon, type badge, status indicator, action buttons

#### Scenario: Type badge display
- **GIVEN** an MCP tool with type 'builtin'
- **THEN** the card SHALL show "内置" badge
- **GIVEN** an MCP tool with type 'custom'
- **THEN** the card SHALL show "自定义" badge
- **GIVEN** an MCP tool with type 'npx' or 'uvx'
- **THEN** the card SHALL show "镜像" badge

#### Scenario: Status indicator display
- **GIVEN** an MCP tool with status 'active'
- **THEN** the card SHALL show "已启用" in green
- **GIVEN** an MCP tool with status 'inactive'
- **THEN** the card SHALL show "已禁用" in gray
- **GIVEN** an MCP tool with status 'error'
- **THEN** the card SHALL show "连接失败" in red

### Requirement: MCP Tool Editing

The system SHALL allow users to edit MCP tool configurations.

#### Scenario: User edits builtin tool
- **WHEN** user clicks edit button on a builtin tool card
- **THEN** the system SHALL allow editing name and description
- **AND** pre-fill the dialog with current values

#### Scenario: User edits custom tool
- **WHEN** user clicks edit button on a custom tool card
- **THEN** the system SHALL open configuration dialog with current values
- **AND** allow editing all fields

#### Scenario: User submits tool edit
- **WHEN** user submits the edit form
- **THEN** the system SHALL update the tool in the store
- **AND** refresh the tool card display
- **AND** show success indication

### Requirement: MCP Tool Deletion

The system SHALL allow users to delete MCP tools with confirmation.

#### Scenario: User deletes MCP tool
- **WHEN** user clicks delete button on a tool card
- **THEN** the system SHALL display a confirmation dialog
- **WHEN** user confirms deletion
- **THEN** the system SHALL remove the tool from the store
- **AND** refresh the tools display
- **WHEN** user cancels deletion
- **THEN** the system SHALL keep the tool
- **AND** close the dialog

### Requirement: Navigation Integration

The system SHALL integrate the MCP Tools page into the main navigation.

#### Scenario: MCP Tools menu item navigation
- **WHEN** user clicks "MCP 工具" in the sidebar
- **THEN** the system SHALL navigate to MCP Tools page
- **AND** the sidebar SHALL highlight "MCP 工具" as active

#### Scenario: User navigates away from MCP Tools page
- **WHEN** user clicks another navigation item
- **THEN** the system SHALL navigate to the selected page
- **AND** the MCP Tools page SHALL preserve its state
