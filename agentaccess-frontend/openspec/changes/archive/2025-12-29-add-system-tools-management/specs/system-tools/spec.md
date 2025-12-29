# System Tools Navigation Specification

## ADDED Requirements

### Requirement: System Tools Navigation Menu
The system SHALL provide a "System Tools" (系统工具) navigation section in the main sidebar.

#### Scenario: User expands System Tools menu
**Given** the user is on any page
**When** the user clicks on the "System Tools" navigation item
**Then** the section SHALL expand to show two sub-menu items:
- Sandboxed Environments (沙箱环境)
- Built-in Tools (内置工具)

#### Scenario: User navigates to Sandboxed Environments
**Given** the System Tools menu is expanded
**When** the user clicks on "Sandboxed Environments"
**Then** the system SHALL navigate to the Sandboxed Environments page
**And** the navigation item SHALL be highlighted as active

#### Scenario: User navigates to Built-in Tools
**Given** the System Tools menu is expanded
**When** the user clicks on "Built-in Tools"
**Then** the system SHALL navigate to the Built-in Tools page
**And** the navigation item SHALL be highlighted as active

### Requirement: Navigation Menu Placement
The System Tools section SHALL be positioned below the "My Agent" section in the sidebar navigation.

#### Scenario: Navigation structure is consistent
**Given** the user views the sidebar navigation
**When** the user scrolls through the navigation items
**Then** the items SHALL appear in this order:
1. Home (主页)
2. Agent Editor (Agent 编辑器)
3. My Agent (我的 Agent) with expandable recent agents
4. **System Tools (系统工具)** [NEW]
   - Sandboxed Environments (沙箱环境)
   - Built-in Tools (内置工具)
5. Knowledge Base
6. MCP Tools
7. Settings

### Requirement: Navigation Visual States
The System Tools navigation items SHALL support hover and active states consistent with existing navigation items.

#### Scenario: Hover state on System Tools menu
**Given** the System Tools menu is visible
**When** the user hovers over "System Tools" or its sub-menu items
**Then** the item SHALL display a light gray background (`hover:bg-slate-50`)
**And** the text SHALL change to the primary color

#### Scenario: Active state indication
**Given** the user is on the Sandboxed Environments or Built-in Tools page
**When** the user views the navigation
**Then** the active sub-menu item SHALL display a primary color background (`bg-primary/5`)
**And** the text SHALL be bold and in primary color
