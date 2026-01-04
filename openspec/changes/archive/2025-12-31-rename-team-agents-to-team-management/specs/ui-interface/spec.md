# ui-interface Specification Deltas

## ADDED Requirements

### Requirement: Sidebar Navigation Structure
The system SHALL provide a left sidebar navigation menu with the following sections organized from top to bottom: Main Navigation (主页, Access 模板管理, 最近 Access 会话), Agent Section (Agent 编辑器, 我的 Agent), Tools & Memory Section (MCP 管理, 系统工具, 记忆体), Knowledge Base Section (知识库), and Team Management Section (团队管理). Each section SHALL be separated by a visual divider line.

#### Scenario: User views sidebar navigation structure
- **WHEN** the application loads
- **THEN** the system SHALL display the sidebar with sections in the following order:
  1. Main Navigation (主页, Access 模板管理, 最近 Access 会话)
  2. [Separator]
  3. Agent Section (Agent 编辑器, 我的 Agent)
  4. [Separator]
  5. Tools & Memory Section (MCP 管理, 系统工具, 记忆体)
  6. [Separator]
  7. Knowledge Base Section (知识库)
  8. [Separator]
  9. Team Management Section (团队管理)
- **AND** each section SHALL be visually separated by a horizontal divider line

### Requirement: Team Management Menu Item
The system SHALL provide a "团队管理" (Team Management) menu item in the sidebar navigation below the Knowledge Base section, separated by a divider line.

#### Scenario: User accesses Team Management from sidebar
- **WHEN** user clicks "团队管理" button in sidebar
- **THEN** the system SHALL navigate to the Team Agents view
- **AND** the sidebar SHALL display the list of teams below the menu item
- **AND** the sidebar SHALL highlight "团队管理" as the active item
- **AND** teams SHALL be displayed with their name, icon, and optional admin badge
