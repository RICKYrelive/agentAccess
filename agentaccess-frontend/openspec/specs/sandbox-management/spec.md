# sandbox-management Specification

## Purpose
TBD - created by archiving change add-system-tools-management. Update Purpose after archive.
## Requirements
### Requirement: Sandboxed Environments Page Layout
The system SHALL provide a Sandboxed Environments page with a three-section layout: header, status overview, and sandbox cards.

#### Scenario: User views Sandboxed Environments page header
**Given** the user navigates to the Sandboxed Environments page
**When** the page loads
**Then** the header SHALL display:
- A page title "沙箱环境"
- A descriptive subtitle about managing sandboxed execution environments
- A "创建沙箱" (Create Sandbox) button in the top right
- Decorative gradient background elements matching MCP Tools page style

#### Scenario: User views status overview cards
**Given** the user is on the Sandboxed Environments page
**When** the page loads
**Then** the system SHALL display three status cards:
1. **沙箱类型** (Sandbox Types): Total count of sandbox types configured
2. **运行实例** (Running Instances): Total count of running instances
3. **资源使用** (Resource Usage): Average percentage across CPU, Memory, and Disk

#### Scenario: User views sandbox type cards
**Given** the user is on the Sandboxed Environments page
**When** the page loads
**Then** each sandbox type SHALL be displayed as a card showing:
- Sandbox type name (e.g., "Python 3.11", "Node.js 20")
- Sandbox type status indicator (running/stopped/error)
- Count of running instances (e.g., "3 实例")
- A delete button
- An expandable list of instances (when clicked)

### Requirement: Sandbox Type Management
The system SHALL allow users to create, view, and delete sandbox types.

#### Scenario: User creates a new sandbox type
**Given** the user is on the Sandboxed Environments page
**When** the user clicks the "创建沙箱" button
**Then** the system SHALL open the Official Store dialog filtered to show sandbox images
**And** the user can select a sandbox image to install

#### Scenario: User deletes a sandbox type
**Given** a sandbox type exists
**When** the user clicks the delete button on the sandbox card
**Then** the system SHALL show a confirmation dialog
**And** upon confirmation, delete the sandbox type and all its instances

### Requirement: Sandbox Instance Management
Each sandbox type SHALL support multiple running instances with individual resource tracking.

#### Scenario: User creates a sandbox instance
**Given** a sandbox type exists (e.g., "Python 3.11")
**When** the user creates a new instance
**Then** the instance SHALL be added to the sandbox type
**And** the instance SHALL have a unique ID
**And** the instance status SHALL be "running"

#### Scenario: User views instance list
**Given** a sandbox type has multiple instances
**When** the user expands the sandbox card
**Then** the system SHALL display a list of instances showing:
- Instance name
- Instance status
- Resource usage (CPU, Memory, Disk)
- Delete button for each instance

#### Scenario: User deletes a sandbox instance
**Given** a sandbox instance exists
**When** the user clicks the delete button on the instance
**Then** the system SHALL remove the instance
**And** the running instance count SHALL be updated

### Requirement: Resource Usage Calculation
The system SHALL calculate and display aggregate resource usage across all running sandbox instances.

#### Scenario: Resource usage is displayed correctly
**Given** multiple sandbox instances are running
**When** the system calculates resource usage
**Then** the Resource Usage card SHALL show the average of:
- CPU percentage across all running instances
- Memory percentage across all running instances
- Disk percentage across all running instances

#### Scenario: Resource usage updates in real-time
**Given** the Sandboxed Environments page is open
**When** 5-10 seconds pass
**Then** the resource usage values SHALL be refreshed
**And** a "Live" indicator SHALL be shown

### Requirement: Sandbox Status Indicators
Each sandbox type and instance SHALL display a visual status indicator.

#### Scenario: Status indicator colors
**Given** a sandbox type or instance
**When** the status is "running"
**Then** the indicator SHALL be green with a pulsing dot
**When** the status is "stopped"
**Then** the indicator SHALL be gray
**When** the status is "error"
**Then** the indicator SHALL be red

