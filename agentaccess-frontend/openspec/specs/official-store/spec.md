# official-store Specification

## Purpose
TBD - created by archiving change add-system-tools-management. Update Purpose after archive.
## Requirements
### Requirement: Official Store Dialog
The system SHALL provide a shared dialog component for browsing and importing items from the official store.

#### Scenario: Dialog opens for sandbox selection
**Given** the user clicks "创建沙箱" button
**When** the dialog opens
**Then** the dialog SHALL show:
- A search bar at the top
- Tab navigation for "Sandboxes" and "Built-in Tools"
- "Sandboxes" tab SHALL be active
- A list of available sandbox images

#### Scenario: Dialog opens for built-in tools
**Given** the user clicks "导入内置工具" button
**When** the dialog opens
**Then** the dialog SHALL show:
- A search bar at the top
- Tab navigation for "Sandboxes" and "Built-in Tools"
- "Built-in Tools" tab SHALL be active
- A list of available built-in tools

### Requirement: Store Search
The dialog SHALL provide search functionality to filter items in the store.

#### Scenario: User searches for sandbox images
**Given** the Official Store dialog is open
**When** the user types in the search bar
**Then** the list SHALL be filtered to show only items matching:
- Item name
- Item description
- Item category
- Item tags

#### Scenario: Search is case-insensitive
**Given** the user types "python" in the search bar
**When** items exist with name "Python 3.11"
**Then** the item SHALL be displayed in the filtered results

### Requirement: Store Item Display
Store items SHALL be displayed in a compact list format with icon, name, description, and action button.

#### Scenario: Sandbox item card layout
**Given** the user views sandbox items in the store
**When** an item is displayed
**Then** it SHALL show:
- Icon/thumbnail (40x40px) on the left
- Item name (bold)
- Item description (1-2 lines, truncated)
- Item category badge
- "安装" (Install) button on the right

#### Scenario: Built-in tool item card layout
**Given** the user views built-in tool items in the store
**When** an item is displayed
**Then** it SHALL show:
- Icon/thumbnail (40x40px) on the left
- Item name (bold)
- Item description (1-2 lines, truncated)
- Item category badge
- "导入" (Import) button on the right

### Requirement: Tab Navigation
The dialog SHALL support tab switching between sandbox images and built-in tools.

#### Scenario: User switches to Built-in Tools tab
**Given** the Official Store dialog is open with "Sandboxes" tab active
**When** the user clicks on "Built-in Tools" tab
**Then** the search SHALL be cleared
**And** the list SHALL show built-in tools
**And** the "Built-in Tools" tab SHALL be highlighted

#### Scenario: User switches back to Sandboxes tab
**Given** the Official Store dialog is open with "Built-in Tools" tab active
**When** the user clicks on "Sandboxes" tab
**Then** the search SHALL be cleared
**And** the list SHALL show sandbox images
**And** the "Sandboxes" tab SHALL be highlighted

### Requirement: Dialog Size and Layout
The dialog SHALL use appropriate sizing for optimal viewing of store items.

#### Scenario: Dialog dimensions
**Given** the Official Store dialog is open
**When** the user views the dialog
**Then** the dialog SHALL have:
- Maximum width of `max-w-2xl` (672px)
- Maximum height of `max-h-[80vh]`
- Vertically scrollable content area
- Fixed header with search and tabs
- Fixed footer with "关闭" button

### Requirement: Item Installation
The system SHALL handle installation/import of items from the store.

#### Scenario: User installs a sandbox image
**Given** the Official Store dialog is open
**When** the user clicks "安装" on a sandbox image
**Then** the sandbox type SHALL be created
**And** a success message SHALL be displayed
**And** the dialog SHALL close
**And** the Sandboxed Environments page SHALL refresh

#### Scenario: User imports a built-in tool
**Given** the Official Store dialog is open
**When** the user clicks "导入" on a built-in tool
**Then** the tool SHALL be added to the Built-in Tools page
**And** a success message SHALL be displayed
**And** the dialog SHALL close
**And** the Built-in Tools page SHALL refresh

#### Scenario: Item already installed
**Given** an item is already installed/imported
**When** the user views the item in the store
**Then** the install/import button SHALL be disabled
**And** the button SHALL show "已安装" or "已导入"

### Requirement: Empty State
The dialog SHALL display an empty state when no items match the search or category.

#### Scenario: No search results
**Given** the user searches for an item
**When** no items match the search
**Then** the dialog SHALL display:
- An empty state icon
- Text "没有找到匹配的项目"
- A button to clear the search

