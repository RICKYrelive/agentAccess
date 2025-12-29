# mcp-gateway-management Specification Delta

## Purpose
Defines enhancements to the MCP gateway management capability for improved tool selection with search/filtering and load balancer group configuration.

## ADDED Requirements

### Requirement: MCP Tool Search and Filtering

The system SHALL provide search and filtering capabilities for selecting MCP tools when creating or editing a gateway.

#### Scenario: User searches for tools by name or description
- **GIVEN** the gateway creation dialog is open
- **WHEN** user enters text in the search box
- **THEN** the system SHALL filter tools to show only those matching the search query
- **AND** the search SHALL match against tool name and description
- **AND** the search SHALL be case-insensitive
- **AND** the system SHALL display the number of matching tools

#### Scenario: User filters tools by type
- **GIVEN** the gateway creation dialog is open
- **WHEN** user selects a tool type filter (内置/自定义/npx/uvx)
- **THEN** the system SHALL filter tools to show only those of the selected type
- **AND** the filter SHALL apply immediately
- **AND** the system SHALL display the number of tools for each type

#### Scenario: User filters tools by status
- **GIVEN** the gateway creation dialog is open
- **WHEN** user selects a status filter (已启用/已禁用)
- **THEN** the system SHALL filter tools to show only those with the matching status
- **AND** the filter SHALL apply immediately

#### Scenario: User filters tools by category
- **GIVEN** the gateway creation dialog is open
- **WHEN** user selects a category filter
- **THEN** the system SHALL filter tools to show only those in the selected category
- **AND** the system SHALL extract available categories from existing tools
- **AND** the system SHALL display tools count for each category

#### Scenario: User combines multiple filters
- **GIVEN** the gateway creation dialog is open with search text entered
- **WHEN** user additionally selects a type filter and status filter
- **THEN** the system SHALL apply all filters together
- **AND** only tools matching ALL criteria SHALL be displayed

#### Scenario: User clears filters
- **GIVEN** the gateway creation dialog is open with active filters
- **WHEN** user clears the search text or resets filters
- **THEN** the system SHALL display all available tools
- **AND** filter controls SHALL return to default state

### Requirement: Load Balancer Group Configuration

The system SHALL allow users to create and manage load balancer groups containing multiple MCP tools with similar functionality.

#### Scenario: User creates load balancer group
- **GIVEN** the gateway creation dialog is open
- **WHEN** user clicks "创建负载均衡组" button
- **THEN** the system SHALL display a group configuration dialog
- **AND** the dialog SHALL contain fields for: group name, strategy, tool selection

#### Scenario: User configures load balancer group name
- **GIVEN** the load balancer group configuration dialog is open
- **WHEN** user enters a group name (required)
- **THEN** the system SHALL validate the name is not empty
- **AND** the system SHALL validate the name is unique within the gateway

#### Scenario: User selects load balancer strategy
- **GIVEN** the load balancer group configuration dialog is open
- **WHEN** user selects a strategy from dropdown
- **THEN** the system SHALL support: round-robin (轮询), random (随机), least-used (最少调用)
- **AND** the system SHALL default to round-robin
- **AND** the system SHALL display strategy description

#### Scenario: User adds tools to load balancer group
- **GIVEN** the load balancer group configuration dialog is open
- **WHEN** user selects tools from available tools list
- **AND** user confirms the selection
- **THEN** the system SHALL add selected tools to the group
- **AND** the system SHALL display the tool count in the group

#### Scenario: User views load balancer groups
- **GIVEN** the gateway creation dialog is open with load balancer groups configured
- **WHEN** the dialog displays tool selection area
- **THEN** the system SHALL display load balancer groups as cards
- **AND** each card SHALL show: group name, strategy, tool count, status
- **AND** each card SHALL show list of tools in the group

#### Scenario: User edits load balancer group
- **GIVEN** a load balancer group exists
- **WHEN** user clicks edit button on the group card
- **THEN** the system SHALL open the group configuration dialog
- **AND** the dialog SHALL be pre-filled with current group settings
- **AND** user SHALL be able to modify name, strategy, and tools

#### Scenario: User deletes load balancer group
- **GIVEN** a load balancer group exists
- **WHEN** user clicks delete button on the group card
- **THEN** the system SHALL display a confirmation dialog
- **AND** upon confirmation, remove the group
- **AND** tools that were in the group SHALL remain in the available tools list

#### Scenario: User removes tool from load balancer group
- **GIVEN** a load balancer group with tools exists
- **WHEN** user clicks remove button on a tool within the group
- **THEN** the system SHALL remove the tool from the group
- **AND** the tool SHALL remain in available tools list
- **AND** the group tool count SHALL update

### Requirement: Tool Selection Interface Layout

The system SHALL provide a dual-pane layout for improved tool selection experience.

#### Scenario: Dual-pane layout display
- **GIVEN** the gateway creation dialog is open
- **WHEN** the tool selection area is displayed
- **THEN** the system SHALL show a left pane with available tools
- **AND** the system SHALL show a right pane with selected tools and load balancer groups
- **AND** each pane SHALL have independent scrolling

#### Scenario: Left pane - available tools
- **WHEN** the left pane is displayed
- **THEN** the system SHALL show search box at top
- **AND** the system SHALL show filter controls below search
- **AND** the system SHALL show filtered tools list below filters
- **AND** each tool SHALL have an add button

#### Scenario: Right pane - selected items
- **WHEN** the right pane is displayed
- **THEN** the system SHALL show individual selected tools
- **AND** the system SHALL show load balancer groups
- **AND** each item SHALL have a remove button

#### Scenario: Adding tool to selection
- **GIVEN** a tool in the available tools list
- **WHEN** user clicks the add button
- **THEN** the system SHALL move the tool to the selected items pane
- **AND** the tool SHALL appear in the right pane
- **AND** the tool SHALL be removed from the available list (or disabled)

#### Scenario: Removing tool from selection
- **GIVEN** a tool in the selected items pane
- **WHEN** user clicks the remove button
- **THEN** the system SHALL remove the tool from the selected items
- **AND** the tool SHALL appear back in the available list (or be re-enabled)

### Requirement: Load Balancer Group Strategy

The system SHALL support multiple load balancing strategies for distributing requests among tools in a group.

#### Scenario: Round-robin strategy
- **GIVEN** a load balancer group with round-robin strategy
- **WHEN** the gateway processes requests
- **THEN** the system SHALL distribute requests to tools in sequential order
- **AND** each tool SHALL receive equal number of requests over time

#### Scenario: Random strategy
- **GIVEN** a load balancer group with random strategy
- **WHEN** the gateway processes requests
- **THEN** the system SHALL randomly select a tool for each request
- **AND** each tool SHALL have equal probability of selection

#### Scenario: Least-used strategy
- **GIVEN** a load balancer group with least-used strategy
- **WHEN** the gateway processes requests
- **THEN** the system SHALL select the tool with fewest active requests
- **AND** the system SHALL track request count for each tool

### Requirement: Health Check Configuration

The system SHALL allow users to configure optional health checks for load balancer groups.

#### Scenario: User enables health check
- **GIVEN** the load balancer group configuration dialog is open
- **WHEN** user enables health check toggle
- **THEN** the system SHALL show health check configuration fields
- **AND** the system SHALL display interval input (default: 30 seconds)
- **AND** the system SHALL display timeout input (default: 5 seconds)

#### Scenario: User disables health check
- **GIVEN** health check is enabled
- **WHEN** user disables health check toggle
- **THEN** the system SHALL hide health check configuration fields
- **AND** the system SHALL clear health check configuration

## MODIFIED Requirements

### Requirement: Gateway Creation Dialog

[MODIFIED] The gateway creation dialog SHALL provide enhanced tool selection with search, filtering, and load balancer group configuration.

#### Scenario: Enhanced tool selection area
- **GIVEN** user is creating or editing a gateway
- **WHEN** the tool selection section is displayed
- **THEN** the system SHALL show search and filter controls
- **AND** the system SHALL show dual-pane layout for tool selection
- **AND** the system SHALL show load balancer group management section

#### Scenario: Creating gateway with load balancer groups
- **GIVEN** user has configured load balancer groups
- **WHEN** user submits the gateway form
- **THEN** the system SHALL create the gateway with load balancer groups
- **AND** the system SHALL associate tools with groups as configured
- **AND** the system SHALL validate each group has at least one tool

### Requirement: MCP Gateway Data Model

[MODIFIED] The MCPGateway interface SHALL support load balancer groups configuration.

#### Scenario: Gateway includes load balancer groups
- **WHEN** a gateway is retrieved or created
- **THEN** the gateway SHALL include loadBalancerGroups array
- **AND** each group SHALL contain id, name, strategy, toolIds, healthCheck
- **AND** the field SHALL be optional for backward compatibility

## REMOVED Requirements

None. This change enhances existing functionality without removing any features.
