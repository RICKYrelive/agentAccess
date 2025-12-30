# memory-management Specification

## ADDED Requirements

### Requirement: Memory Navigation Menu
The system SHALL provide a "Memory" (记忆库) navigation item in the main sidebar.

#### Scenario: User navigates to Memory
**Given** the user is on any page
**When** the user clicks on the "Memory" navigation item
**Then** the system SHALL navigate to the Memory page
**And** the navigation item SHALL be highlighted as active
**And** no sub-menu SHALL be displayed

#### Scenario: Navigation menu placement
**Given** the user views the sidebar navigation
**When** the user scrolls through the navigation items
**Then** the items SHALL appear in this order:
1. Home (主页)
2. Agent Editor (Agent 编辑器)
3. My Agent (我的 Agent)
4. System Tools (系统工具)
5. **Memory (记忆库)** [NEW]
6. MCP Tools
7. Settings

### Requirement: Memory Page Layout
The system SHALL provide a Memory page with a three-section layout: header, status overview, and memory base list.

#### Scenario: User views Memory page header
**Given** the user navigates to the Memory page
**When** the page loads
**Then** the header SHALL display:
- A page title "记忆库"
- A descriptive subtitle about managing long-term memory bases
- Action buttons: "创建记忆库" (Create), "导入记忆库" (Import), "导出记忆库" (Export)
- Decorative gradient background elements matching MCP Tools page style

#### Scenario: User views status overview cards
**Given** the user is on the Memory page
**When** the page loads
**Then** the system SHALL display three status cards:
1. **总记忆数** (Total Memories): Total count of memories across all memory bases
2. **活动记忆库** (Active Memory Bases): Count of memory bases with status "active"
3. **1小时召回率** (1-Hour Recall Rate): Line chart showing retrieval success rate over the last hour

#### Scenario: User views memory base list
**Given** the user is on the Memory page
**When** the page loads
**Then** each memory base SHALL be displayed as a card showing:
- Memory base name
- Memory base description
- Memory base UUID (monospace font)
- Status indicator (active/inactive)
- Strategy count (e.g., "3 策略")
- Edit button
- Delete button (with confirmation)

### Requirement: Memory Base Creation
The system SHALL allow users to create new memory bases with configurable strategies.

#### Scenario: User creates a new memory base
**Given** the user is on the Memory page
**When** the user clicks the "创建记忆库" button
**Then** the system SHALL open a dialog with form fields:
- Name (required, text input)
- Description (optional, textarea)
- Strategy type (required, radio selector)
- Custom prompt (optional, textarea - shown only for custom-prompt type)
- Max memories per retrieval (number input, default 10)
- Similarity threshold (number input, 0-1, default 0.5)

#### Scenario: User selects summarization strategy
**Given** the create memory base dialog is open
**When** the user selects "总结归纳" (Summarization) strategy
**Then** the system SHALL pre-fill the prompt with a summarization template
**And** the custom prompt textarea SHALL be hidden or disabled

#### Scenario: User selects user preferences strategy
**Given** the create memory base dialog is open
**When** the user selects "用户偏好" (User Preferences) strategy
**Then** the system SHALL pre-fill the prompt with a preference extraction template
**And** the custom prompt textarea SHALL be hidden or disabled

#### Scenario: User selects custom prompt strategy
**Given** the create memory base dialog is open
**When** the user selects "自定义提示" (Custom Prompt) strategy
**Then** the custom prompt textarea SHALL be shown
**And** the user MUST provide a custom prompt template

#### Scenario: User submits valid memory base
**Given** the create memory base dialog is open with valid inputs
**When** the user clicks the create button
**Then** the system SHALL create the memory base via mem0 API
**And** the memory base SHALL appear in the list
**And** a success message SHALL be displayed
**And** the dialog SHALL close

#### Scenario: User submits invalid memory base
**Given** the create memory base dialog is open
**When** the user clicks create without filling required fields
**Then** the system SHALL display validation errors
**And** the dialog SHALL remain open

### Requirement: Memory Base Editing
Users SHALL be able to edit memory base name, description, and configuration.

#### Scenario: User edits a memory base
**Given** a memory base exists
**When** the user clicks the edit button on the memory base card
**Then** the system SHALL open an edit dialog pre-filled with current values
**And** the user can modify name, description, or strategy config

#### Scenario: User saves edits
**Given** the edit dialog is open with modified values
**When** the user clicks save
**Then** the memory base SHALL be updated
**And** the card SHALL reflect the changes
**And** the "更新于" (Updated) timestamp SHALL be refreshed

### Requirement: Memory Base Deletion
The system SHALL allow users to delete memory bases with confirmation.

#### Scenario: User deletes a memory base
**Given** a memory base exists
**When** the user clicks the delete button on the memory base card
**Then** the system SHALL show a confirmation dialog
**And** upon confirmation, delete the memory base and all its memories via mem0 API
**And** the card SHALL be removed from the list

### Requirement: Memory Base Import
The system SHALL allow users to import memory bases from JSON files.

#### Scenario: User opens import dialog
**Given** the user is on the Memory page
**When** the user clicks the "导入记忆库" button
**Then** the system SHALL open the Import/Export dialog with Import tab active
**And** a file upload input SHALL be shown
**And** the upload SHALL accept .json files only

#### Scenario: User imports valid JSON
**Given** the import dialog is open
**When** the user uploads a valid JSON file with memory data
**Then** the system SHALL validate the JSON structure
**And** create a new memory base with the imported data
**And** import all memories via mem0 API
**And** show a progress indicator during import
**And** display a success message when complete

#### Scenario: User imports invalid JSON
**Given** the import dialog is open
**When** the user uploads an invalid or malformed JSON file
**Then** the system SHALL display an error message
**And** the import SHALL fail without creating a memory base

#### Scenario: User imports with duplicate UUID
**Given** a memory base with the same UUID already exists
**When** the user attempts to import
**Then** the system SHALL generate a new UUID for the imported memory base
**And** display a warning message about the UUID change

### Requirement: Memory Base Export
The system SHALL allow users to export memory bases as JSON files.

#### Scenario: User opens export dialog
**Given** the user is on the Memory page
**When** the user clicks the "导出记忆库" button
**Then** the system SHALL open the Import/Export dialog with Export tab active
**And** a dropdown SHALL be shown to select a memory base
**And** an "导出" (Export) button SHALL be shown

#### Scenario: User exports a memory base
**Given** the export dialog is open with a memory base selected
**When** the user clicks the export button
**Then** the system SHALL fetch all memories from the memory base via mem0 API
**And** generate a JSON file with the structure:
```json
{
  "version": "1.0",
  "exportedAt": "2025-12-30T10:00:00Z",
  "memoryBase": {
    "id": "uuid",
    "name": "Memory Base Name",
    "description": "Description",
    "strategy": { ... }
  },
  "memories": [
    { "id": "...", "content": "...", "metadata": {...} }
  ]
}
```
**And** trigger a file download with name `{memory-base-name}-{timestamp}.json`
**And** show a progress indicator during export

### Requirement: Recall Rate Metrics
The system SHALL calculate and display the retrieval recall rate over a rolling 1-hour window.

#### Scenario: Recall rate calculation
**Given** the Memory page is open
**When** 5 minutes have passed
**Then** the system SHALL query mem0 API for retrieval metrics
**And** calculate recall rate as: (successful retrievals / total retrievals) × 100%
**And** update the recall rate chart

#### Scenario: Recall rate chart display
**Given** the 1-Hour Recall Rate card is displayed
**When** the user views the chart
**Then** the chart SHALL show data points at 5-minute intervals for the last hour
**And** the x-axis SHALL show timestamps (e.g., "10:00", "10:05")
**And** the y-axis SHALL show percentage (0-100%)
**And** a "Live" indicator SHALL pulse to indicate real-time updates

#### Scenario: Successful retrieval
**Given** a memory retrieval query is executed via mem0 API
**When** the API returns memories with relevance scores
**Then** retrievals with scores > 0.5 SHALL be counted as successful
**And** retrievals with scores <= 0.5 SHALL be counted as unsuccessful

### Requirement: Memory Strategy Types
The system SHALL support three memory strategy types for capturing and storing memories.

#### Scenario: Summarization strategy
**Given** a memory base uses the "总结归纳" strategy
**When** new conversation content is added
**Then** the system SHALL extract and store key insights and summaries
**And** the stored memories SHALL be concise representations of longer conversations

#### Scenario: User preferences strategy
**Given** a memory base uses the "用户偏好" strategy
**When** user interactions occur
**Then** the system SHALL extract and store user-specific preferences, patterns, and choices
**And** the stored memories SHALL enable personalization across sessions

#### Scenario: Custom prompt strategy
**Given** a memory base uses the "自定义提示" strategy
**When** the custom prompt is defined
**Then** the system SHALL use the custom prompt template to guide memory extraction
**And** the user can define custom memory capture logic for specific use cases

### Requirement: Memory Base Status
Each memory base SHALL have an active/inactive status that controls availability for agents.

#### Scenario: Active memory base
**Given** a memory base has status "active"
**When** an agent queries for memories
**Then** the memory base SHALL be included in the search
**And** memories from this base SHALL be returned in results

#### Scenario: Inactive memory base
**Given** a memory base has status "inactive"
**When** an agent queries for memories
**Then** the memory base SHALL NOT be included in the search
**And** no memories from this base SHALL be returned

#### Scenario: User toggles status
**Given** a memory base exists
**When** the user toggles the status switch
**Then** the memory base status SHALL be updated
**And** the status badge SHALL reflect the change

### Requirement: Navigation Visual States
The Memory navigation item SHALL support hover and active states consistent with existing navigation items.

#### Scenario: Hover state on Memory menu
**Given** the Memory menu is visible
**When** the user hovers over the menu item
**Then** the item SHALL display a light gray background (`hover:bg-slate-50`)
**And** the text SHALL change to the primary color

#### Scenario: Active state indication
**Given** the user is on the Memory page
**When** the user views the navigation
**Then** the menu item SHALL display a primary color background (`bg-primary/5`)
**And** the text SHALL be bold and in primary color

### Requirement: Empty State Display
The system SHALL display an empty state when no memory bases exist.

#### Scenario: No memory bases
**Given** no memory bases have been created
**When** the user views the Memory page
**Then** the system SHALL display an empty state with:
- An illustration icon
- Text "还没有创建任何记忆库"
- A prompt to click "创建记忆库" to get started

### Requirement: Error Handling
The system SHALL handle errors gracefully with user-friendly messages.

#### Scenario: mem0 API unavailable
**Given** the mem0 API is unreachable
**When** a memory operation is attempted
**Then** the system SHALL display an error message "记忆服务暂时不可用，请稍后重试"
**And** the operation SHALL fail gracefully

#### Scenario: Network timeout
**Given** a memory operation takes longer than 30 seconds
**When** the timeout occurs
**Then** the system SHALL display a timeout error message
**And** offer a retry button

#### Scenario: Invalid memory base configuration
**Given** the user provides invalid strategy configuration
**When** the user attempts to create/update the memory base
**Then** the system SHALL display specific validation errors
**And** prevent the invalid configuration from being saved
