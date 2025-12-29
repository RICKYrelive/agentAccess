# builtin-tools-management Specification

## Purpose
TBD - created by archiving change add-system-tools-management. Update Purpose after archive.
## Requirements
### Requirement: Built-in Tools Page Layout
The system SHALL provide a Built-in Tools page for managing imported built-in tools.

#### Scenario: User views Built-in Tools page header
**Given** the user navigates to the Built-in Tools page
**When** the page loads
**Then** the header SHALL display:
- A page title "内置工具"
- A descriptive subtitle
- An "导入内置工具" (Import Built-in Tools) button in the top right

#### Scenario: User views built-in tool cards
**Given** the user is on the Built-in Tools page
**When** the page loads
**Then** each imported built-in tool SHALL be displayed as a card showing:
- Tool icon/thumbnail
- Tool name
- Tool description
- Tool category
- Enable/disable toggle switch
- Tool status indicator (enabled/disabled)

### Requirement: Built-in Tool Import
The system SHALL allow users to import built-in tools from the official store.

#### Scenario: User opens import dialog
**Given** the user is on the Built-in Tools page
**When** the user clicks the "导入内置工具" button
**Then** the system SHALL open the Official Store dialog
**And** the dialog SHALL be filtered to show only built-in tools

#### Scenario: User imports a built-in tool from store
**Given** the Official Store dialog is open
**When** the user clicks the "Import" button on a built-in tool
**Then** the tool SHALL be added to the Built-in Tools page
**And** the tool SHALL be enabled by default
**And** the dialog SHALL close

#### Scenario: Importing duplicate tool
**Given** a built-in tool is already imported
**When** the user attempts to import the same tool again
**Then** the system SHALL display a message "工具已导入"
**And** the import button SHALL be disabled or show "已导入"

### Requirement: Built-in Tool Enable/Disable
Users SHALL be able to enable and disable imported built-in tools.

#### Scenario: User enables a built-in tool
**Given** a built-in tool is disabled
**When** the user toggles the enable switch to on
**Then** the tool status SHALL change to "enabled"
**And** the tool SHALL become available for use in agents

#### Scenario: User disables a built-in tool
**Given** a built-in tool is enabled
**When** the user toggles the enable switch to off
**Then** the tool status SHALL change to "disabled"
**And** the tool SHALL NOT be available for use in agents

### Requirement: Built-in Tool Card Layout
The built-in tool cards SHALL follow the same design pattern as MCP tool cards.

#### Scenario: Card displays all required information
**Given** a built-in tool card is displayed
**When** the user views the card
**Then** the card SHALL show:
- Tool icon (40x40px) with category-specific color
- Tool name in bold
- Tool description (truncated if too long)
- Category badge
- Toggle switch on the right side
- Status indicator dot

#### Scenario: Empty state display
**Given** no built-in tools have been imported
**When** the user views the Built-in Tools page
**Then** the system SHALL display an empty state with:
- An illustration icon
- Text "还没有导入任何内置工具"
- A prompt to click "导入内置工具" to get started

### Requirement: Tool Categorization
Built-in tools SHALL be organized by category for better discoverability.

#### Scenario: Tools are grouped by category
**Given** multiple built-in tools are imported
**When** the user views the Built-in Tools page
**Then** tools SHALL be grouped by category
**And** each category SHALL have a section header
**And** the number of tools in each category SHALL be shown

#### Scenario: User filters by category
**Given** tools from multiple categories exist
**When** the user clicks on a category
**Then** only tools from that category SHALL be displayed
**And** a "Show All" option SHALL be available

