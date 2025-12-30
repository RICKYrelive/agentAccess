# Access Template Capability Specification

## ADDED Requirements

### Requirement: Template Data Model

The system SHALL support Access Template data model with the following attributes:

- Unique template identifier
- Template name and description
- Template category (personal, team, public)
- Configuration data including:
  - Selected My Agents list
  - Selected Team Agents list
  - Selected Knowledge Base (optional)
  - Selected MCP Tools list (optional)
  - Selected System Tools list (optional)
  - Selected Memory (optional)
- Permission settings defining who can access and use the template
- Usage statistics tracking
- Creation and modification timestamps
- Creator information

#### Scenario: Template creation with all configuration options

- **GIVEN** a user has configured Access with 2 My Agents, 1 Team Agent, and 1 Knowledge Base
- **WHEN** the user saves the configuration as a template
- **THEN** the system SHALL store all selected options in the template
- **AND** the system SHALL generate a unique template ID
- **AND** the system SHALL set the category to "personal" by default

#### Scenario: Template with optional configuration

- **GIVEN** a user has configured Access with only My Agents (no Knowledge Base or tools)
- **WHEN** the user saves the configuration as a template
- **THEN** the system SHALL store the template with optional fields as undefined
- **AND** the system SHALL allow applying the template without errors

### Requirement: Template Creation from Current Configuration

The system SHALL allow users to create a template from their current Access configuration in the "发起 Access" (ContentArea) page.

#### Scenario: Create template from configured Access

- **GIVEN** a user is on the "发起 Access" page
- **AND** the user has selected 2 My Agents and 1 Knowledge Base
- **WHEN** the user clicks the "保存为模板" button
- **THEN** the system SHALL display a template creation dialog
- **AND** the dialog SHALL pre-fill with the current configuration

#### Scenario: Save template with name and description

- **GIVEN** the template creation dialog is displayed
- **WHEN** the user enters template name "市场分析标准配置" and description
- **AND** the user clicks "保存"
- **THEN** the system SHALL create the template with the provided information
- **AND** the system SHALL add the template to the user's personal templates

### Requirement: Share Template to Team

The system SHALL allow users to share their Access templates with team members through configurable permissions.

#### Scenario: Share template to team with usage tracking

- **GIVEN** a user has created a personal template
- **WHEN** the user opens the template sharing settings
- **AND** selects "团队" permission type
- **AND** selects specific teams to share with
- **AND** enables "允许复制" option
- **THEN** the system SHALL update the template permissions to team access
- **AND** team members SHALL be able to view and apply the template
- **AND** team members with copy permission SHALL be able to copy the template as their own

#### Scenario: Share template without copy permission

- **GIVEN** a user shares a template to team
- **WHEN** the user disables "允许复制" option
- **THEN** team members SHALL be able to apply the template
- **BUT** they SHALL NOT be able to copy or modify the template

### Requirement: Template Application

The system SHALL allow users to apply a saved template to quickly configure their Access session.

#### Scenario: Apply template to fill configuration

- **GIVEN** a user is on the "发起 Access" page
- **WHEN** the user clicks "应用模板" and selects "市场分析配置" template
- **THEN** the system SHALL fill all configuration options with values from the template
- **AND** the system SHALL increment the template's usage count
- **AND** the user SHALL be able to modify the configuration before sending a message

#### Scenario: Apply partial template (optional fields only)

- **GIVEN** a template contains My Agents and Knowledge Base but no MCP tools
- **WHEN** the user applies the template
- **THEN** the system SHALL fill My Agents and Knowledge Base fields
- **AND** MCP tools field SHALL remain empty or unchanged

### Requirement: In-Session Configuration Editing

The system SHALL allow users to edit the Access configuration during an active chat session in the ChatInterface.

#### Scenario: Edit configuration during active session

- **GIVEN** a user has an active chat session with certain configuration
- **WHEN** the user clicks "编辑配置" button
- **THEN** the system SHALL display a configuration editing dialog
- **AND** the dialog SHALL show the current configuration
- **AND** the user SHALL be able to modify any configuration option

#### Scenario: Re-send message with new configuration

- **GIVEN** a user has modified the configuration in the edit dialog
- **AND** the user has sent at least one message in the current session
- **WHEN** the user clicks "重新发送" button
- **THEN** the system SHALL use the new configuration to re-process the last message
- **AND** the system SHALL append the new response to the conversation
- **AND** the original message SHALL remain in the conversation history

### Requirement: Template Management Page

The system SHALL provide a dedicated page for managing Access templates with listing, searching, and filtering capabilities.

#### Scenario: View all personal templates

- **GIVEN** a user has created 5 personal templates
- **WHEN** the user navigates to the "Access 模板管理" page
- **AND** selects "我的模板" tab
- **THEN** the system SHALL display all 5 personal templates
- **AND** each template card SHALL show name, description, included agents/tools count, and usage statistics

#### Scenario: Search and filter templates

- **GIVEN** a user has access to 20 team templates
- **WHEN** the user enters "市场" in the search box
- **THEN** the system SHALL filter templates to show only those matching "市场"
- **AND** the user SHALL be able to further filter by category (团队模板, 公开模板)

### Requirement: Template Management Actions

The system SHALL provide CRUD operations for managing Access templates.

#### Scenario: Edit existing template

- **GIVEN** a user has created a template named "市场分析 v1"
- **WHEN** the user clicks "编辑" button on the template card
- **THEN** the system SHALL display the template editing dialog with current values
- **AND** the user SHALL be able to modify template name, description, configuration, or permissions
- **AND** upon saving, the system SHALL update the template and set the updatedAt timestamp

#### Scenario: Delete template with confirmation

- **GIVEN** a user wants to delete a template
- **WHEN** the user clicks "删除" button
- **THEN** the system SHALL display a confirmation dialog
- **AND** the dialog SHALL show "删除后无法恢复，是否确认删除？"
- **AND** upon confirmation, the system SHALL delete the template
- **AND** the template SHALL be removed from all template lists

#### Scenario: Copy template to personal collection

- **GIVEN** a team template allows copying
- **WHEN** a team member clicks "复制" button
- **THEN** the system SHALL create a new personal template with the same configuration
- **AND** the new template SHALL have "Copy of [original name]" as the name
- **AND** the copier SHALL become the owner of the new template

### Requirement: Permission Model

The system SHALL support four permission levels for Access templates with specific access rules.

#### Scenario: Personal template - only owner access

- **GIVEN** a template has "personal" permission type
- **WHEN** any user other than the owner tries to access the template
- **THEN** the system SHALL deny access
- **AND** the template SHALL NOT appear in their template list

#### Scenario: Team template - team member access

- **GIVEN** a template has "team" permission with team IDs ["team-1", "team-2"]
- **WHEN** a user who is a member of "team-1" accesses the system
- **THEN** the system SHALL display the template in their "团队模板" list
- **AND** the user SHALL be able to apply the template
- **AND** if "allowCopy" is true, the user SHALL be able to copy the template

#### Scenario: Public template - everyone access

- **GIVEN** a template has "public" permission type
- **WHEN** any user accesses the template management page
- **THEN** the system SHALL display the template in "公开模板" tab
- **AND** all users SHALL be able to view and apply the template

#### Scenario: Specific user template - whitelist access

- **GIVEN** a template has "specific" permission with userIds ["user-1", "user-2"]
- **WHEN** "user-1" accesses the system
- **THEN** the system SHALL display the template
- **WHEN** "user-3" (not in whitelist) accesses the system
- **THEN** the system SHALL NOT display the template

### Requirement: Template Statistics

The system SHALL track and display usage statistics for Access templates.

#### Scenario: Track template usage

- **GIVEN** a template has been used 10 times
- **WHEN** a user applies the template
- **THEN** the system SHALL increment the usage count to 11
- **AND** the system SHALL update the lastUsedAt timestamp

#### Scenario: Display usage statistics

- **GIVEN** a template has been used 128 times
- **WHEN** the template is displayed in a template card
- **THEN** the card SHALL show "已使用 128 次"
- **AND** if lastUsedAt is within 24 hours, display relative time like "2小时前"

### Requirement: Template Validation

The system SHALL validate template configuration before saving and applying.

#### Scenario: Validate template on creation

- **GIVEN** a user tries to create a template without a name
- **WHEN** the user clicks "保存"
- **THEN** the system SHALL display an error "模板名称不能为空"
- **AND** the template SHALL NOT be created

#### Scenario: Validate template with invalid agent references

- **GIVEN** a user creates a template with agent IDs that no longer exist
- **WHEN** another user tries to apply the template
- **THEN** the system SHALL warn about missing agents
- **AND** the system SHALL allow the user to continue with available agents
- **AND** the system SHALL automatically remove invalid references from the configuration
