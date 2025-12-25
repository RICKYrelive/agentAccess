# Chat Interface Spec Delta

## Purpose
Defines requirements for displaying tool calls and tool configuration in the chat interface.

## ADDED Requirements

### Requirement: Tool Call Indicators in Messages
The system SHALL display tool call indicators within chat messages that used tools during generation.

#### Scenario: User views a message with tool calls
- **GIVEN** a chat message contains tool calls
- **WHEN** the message is rendered in the chat interface
- **THEN** each tool call SHALL be displayed with:
  - A tool type icon (Agent/MCP/Plugin/Knowledge)
  - The tool name
  - A status indicator (pending/running/completed/failed)
  - Distinct color coding per tool type

#### Scenario: User expands tool call to view details
- **GIVEN** a tool call indicator is displayed
- **WHEN** the user clicks on the indicator
- **THEN** the indicator SHALL expand to show:
  - Input parameters (if applicable)
  - Execution result
  - Execution duration
  - Error message (if failed)

#### Scenario: System displays tool calls with appropriate colors
- **GIVEN** a message contains multiple tool calls of different types
- **WHEN** the message is rendered
- **THEN** each tool type SHALL use a distinct color:
  - Agent: Green (#10b981)
  - MCP: Blue (#3b82f6)
  - Plugin: Purple (#8b5cf6)
  - Knowledge Base: Orange (#f97316)

### Requirement: Conversation Header Tool Tags
The system SHALL display configured tools as tags below the conversation title in ChatInterface.

#### Scenario: User views a conversation with configured tools
- **GIVEN** a conversation has tools configured in settings
- **WHEN** the conversation header is rendered in ChatInterface
- **THEN** the header SHALL display:
  - The conversation title
  - Tags for each configured tool type below the title
  - Each tag showing the tool name with appropriate color

#### Scenario: User views a conversation with multiple tools
- **GIVEN** a conversation has multiple tools configured
- **WHEN** the conversation header is rendered
- **THEN** all tool tags SHALL be displayed horizontally
- **AND** tags SHALL wrap if they exceed the container width

## MODIFIED Requirements

### Requirement: Message Content Display
[MODIFIED] Messages SHALL display text content and optionally include tool call indicators below the text.

#### Scenario: Message contains both text and tool calls
- **GIVEN** a message has tool calls in addition to text content
- **WHEN** the message is rendered
- **THEN** the message SHALL display:
  - Text content first
  - Tool call indicators below the text
  - Each indicator on its own line

#### Scenario: Message component renders ToolCallIndicator children
- **GIVEN** a message has tool calls
- **WHEN** the message component renders
- **THEN** it SHALL create a ToolCallIndicator for each tool call
- **AND** SHALL pass the tool call data as props
