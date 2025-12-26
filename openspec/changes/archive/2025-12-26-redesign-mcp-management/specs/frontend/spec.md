# frontend Specification Delta

## ADDED Requirements

### Requirement: MCP Management Page Components

The system SHALL provide Vue.js components for the MCP Management pages including MCP Tools page, MCP Gateway page, and various creation/configuration dialogs.

#### Scenario: MCP Tools page component initialization
- **WHEN** user navigates to the MCP Tools page
- **THEN** the system SHALL initialize the MCPToolsPage component
- **AND** the system SHALL load MCP tools from the Pinia store
- **AND** the system SHALL render tool cards organized by type

#### Scenario: MCP Gateway page component initialization
- **WHEN** user navigates to the MCP Gateway page
- **THEN** the system SHALL initialize the MCPGatewayPage component
- **AND** the system SHALL load MCP gateways from the Pinia store
- **AND** the system SHALL render gateway table

#### Scenario: Dialog component rendering
- **WHEN** user clicks a creation button
- **THEN** the system SHALL initialize the appropriate dialog component
- **AND** the dialog SHALL render as a modal overlay

### Requirement: MCP Management State Management

The system SHALL provide a Pinia store for managing MCP tools and gateways state.

#### Scenario: MCP management store initialization
- **WHEN** the application initializes
- **THEN** the system SHALL create the mcpManagement Pinia store
- **AND** the store SHALL contain arrays for mcpTools and mcpGateways
- **AND** the store SHALL provide actions for CRUD operations

#### Scenario: MCP tool CRUD operations
- **WHEN** user creates a new MCP tool
- **THEN** the store SHALL add the new tool to the mcpTools array
- **WHEN** user updates an MCP tool
- **THEN** the store SHALL update the tool in the mcpTools array
- **WHEN** user deletes an MCP tool
- **THEN** the store SHALL remove the tool from the mcpTools array
- **WHEN** user toggles an MCP tool
- **THEN** the store SHALL update the tool's isEnabled status

#### Scenario: MCP gateway CRUD operations
- **WHEN** user creates a new MCP gateway
- **THEN** the store SHALL add the new gateway to the mcpGateways array
- **WHEN** user updates an MCP gateway
- **THEN** the store SHALL update the gateway in the mcpGateways array
- **WHEN** user deletes an MCP gateway
- **THEN** the store SHALL remove the gateway from the mcpGateways array

### Requirement: MCP Type Definitions

The system SHALL provide TypeScript type definitions for MCP management entities.

#### Scenario: Type system for MCP tools
- **WHEN** components interact with MCP tool data
- **THEN** the system SHALL enforce type safety with MCPTool interface
- **AND** the interface SHALL define properties: id, name, description, type, category, isEnabled, status, config, createdAt, updatedAt
- **AND** the type property SHALL be a union of 'builtin' | 'custom' | 'npx' | 'uvx'

#### Scenario: Type system for MCP gateways
- **WHEN** components interact with MCP gateway data
- **THEN** the system SHALL enforce type safety with MCPGateway interface
- **AND** the interface SHALL define properties: id, name, description, baseUrl, mcpToolIds, status, createdAt, updatedAt

#### Scenario: Type system for tool configurations
- **WHEN** components handle tool configuration
- **THEN** the system SHALL enforce type safety with MCPToolConfig interface
- **AND** the config SHALL support custom tool fields (url, authType, apiKey, bearerToken)
- **AND** the config SHALL support npx/uvx fields (packageName, version, author)

### Requirement: OpenAPI File Parsing

The system SHALL provide utilities for parsing OpenAPI JSON and YAML files.

#### Scenario: Parse OpenAPI JSON file
- **WHEN** user uploads an OpenAPI JSON file
- **THEN** the system SHALL parse the JSON content
- **AND** extract all API endpoints
- **AND** generate MCP tool configurations

#### Scenario: Parse OpenAPI YAML file
- **WHEN** user uploads an OpenAPI YAML file
- **THEN** the system SHALL parse the YAML content
- **AND** extract all API endpoints
- **AND** generate MCP tool configurations

## MODIFIED Requirements

### Requirement: Sidebar Navigation Structure

[MODIFIED] The system SHALL update the sidebar navigation to include "MCP 管理" with two sub-menu items.

#### Scenario: MCP management menu expansion
- **WHEN** user clicks "MCP 管理" menu item in the sidebar
- **THEN** the menu SHALL expand to show "MCP 工具" and "MCP 网关" sub-items
- **AND** the system SHALL add isMCPManagementOpen state ref
- **AND** the system SHALL watch activeView to auto-expand/collapse

#### Scenario: Navigate to MCP Tools page
- **WHEN** user clicks "MCP 工具" sub-menu item
- **THEN** the system SHALL emit a view-change event with 'mcp-tools'
- **AND** the central content area SHALL display the MCPToolsPage component

#### Scenario: Navigate to MCP Gateway page
- **WHEN** user clicks "MCP 网关" sub-menu item
- **THEN** the system SHALL emit a view-change event with 'mcp-gateway'
- **AND** the central content area SHALL display the MCPGatewayPage component

### Requirement: AppLayout View States

[MODIFIED] The AppLayout component SHALL support additional view states for MCP management pages.

#### Scenario: AppLayout renders MCP Tools page
- **GIVEN** activeView is set to 'mcp-tools'
- **WHEN** the component renders
- **THEN** the system SHALL display MCPToolsPage component in the central content area
- **AND** the left sidebar SHALL remain visible
- **AND** the right settings panel SHALL be hidden

#### Scenario: AppLayout renders MCP Gateway page
- **GIVEN** activeView is set to 'mcp-gateway'
- **WHEN** the component renders
- **THEN** the system SHALL display MCPGatewayPage component in the central content area
- **AND** the left sidebar SHALL remain visible
- **AND** the right settings panel SHALL be hidden

#### Scenario: ActiveView type union update
- **WHEN** defining activeView ref type
- **THEN** the union type SHALL include 'mcp-tools' and 'mcp-gateway'
- **AND** Props interface SHALL support the new view types
- **AND** Emits interface SHALL support the new view types
