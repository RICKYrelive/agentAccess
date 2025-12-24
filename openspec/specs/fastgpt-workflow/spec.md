# fastgpt-workflow Specification

## Purpose
TBD - created by archiving change integrate-fastgpt-workflow. Update Purpose after archive.
## Requirements
### Requirement: FastGPT Service Integration
The system SHALL provide integration with FastGPT workflow engine through JavaScript SDK or HTTP API for executing AI-powered workflows.

#### Scenario: User connects to FastGPT server
- **WHEN** user configures FastGPT API endpoint and API key in settings
- **THEN** the system SHALL validate the connection to FastGPT server
- **AND** the system SHALL display connection status in the settings panel
- **AND** the system SHALL store API credentials securely in local storage

#### Scenario: Connection failure handling
- **WHEN** FastGPT server connection fails
- **THEN** the system SHALL display clear error message to user
- **AND** the system SHALL provide guidance for common issues (CORS, invalid credentials, server unreachable)
- **AND** the system SHALL allow retry without losing workflow data

### Requirement: Workflow Synchronization
The system SHALL synchronize local workflow definitions with FastGPT server to enable actual workflow execution.

#### Scenario: Creating new workflow
- **WHEN** user creates a new workflow in the visual editor
- **THEN** the system SHALL save workflow locally for offline editing
- **AND** the system SHALL offer to sync to FastGPT when connection is available
- **AND** the system SHALL generate unique workflow ID compatible with FastGPT

#### Scenario: Syncing existing workflow
- **WHEN** user clicks "Sync to FastGPT" button
- **THEN** the system SHALL convert local workflow format to FastGPT schema
- **AND** the system SHALL send workflow to FastGPT server
- **AND** the system SHALL display sync status and any errors

#### Scenario: Loading workflow from FastGPT
- **WHEN** user selects a workflow from FastGPT server
- **THEN** the system SHALL fetch workflow definition from FastGPT API
- **AND** the system SHALL convert FastGPT format to local format
- **AND** the system SHALL load workflow into visual editor

### Requirement: Real Workflow Execution
The system SHALL execute workflows using FastGPT engine instead of simulated mock responses.

#### Scenario: Running workflow on FastGPT
- **WHEN** user clicks "Run Workflow" with test input
- **THEN** the system SHALL send workflow and input to FastGPT execution API
- **AND** the system SHALL display real-time execution status
- **AND** the system SHALL show results returned from FastGPT engine

#### Scenario: Handling execution errors
- **WHEN** FastGPT workflow execution fails
- **THEN** the system SHALL display error details from FastGPT
- **AND** the system SHALL highlight the node that caused the failure
- **AND** the system SHALL allow user to fix and retry

#### Scenario: Streaming responses
- **WHEN** FastGPT returns streaming response for LLM nodes
- **THEN** the system SHALL display tokens as they arrive
- **AND** the system SHALL update preview panel in real-time
- **AND** the system SHALL support stopping the execution mid-stream

### Requirement: Node Type Mapping
The system SHALL map existing workflow node types to corresponding FastGPT node templates.

#### Scenario: Default node configuration
- **WHEN** user adds a new node to the workflow
- **THEN** the system SHALL use FastGPT-compatible default configuration
- **AND** the system SHALL provide node-specific configuration options
- **AND** supported node types SHALL include: start, dataset-search, LLM, end

#### Scenario: Knowledge base node configuration
- **WHEN** user configures a knowledge retrieval node
- **THEN** the system SHALL map to FastGPT DatasetSearchNode
- **AND** the system SHALL support retrieval modes: vector, keyword, hybrid
- **AND** the system SHALL allow selection of FastGPT datasets

#### Scenario: LLM node configuration
- **WHEN** user configures an LLM node (question-rewrite, answer-generation)
- **THEN** the system SHALL map to FastGPT LLMNode
- **AND** the system SHALL allow model selection from FastGPT available models
- **AND** the system SHALL support temperature, max_tokens, and prompt configuration

### Requirement: Workflow Import/Export
The system SHALL support importing and exporting workflows in FastGPT-compatible format.

#### Scenario: Exporting workflow
- **WHEN** user clicks "Export" on a workflow
- **THEN** the system SHALL generate FastGPT JSON format
- **AND** the system SHALL trigger download of workflow file
- **AND** the exported file SHALL be importable into FastGPT directly

#### Scenario: Importing workflow
- **WHEN** user uploads a FastGPT workflow JSON file
- **THEN** the system SHALL validate the workflow format
- **AND** the system SHALL convert to local format
- **AND** the system SHALL load workflow into visual editor

#### Scenario: Validation on import
- **WHEN** imported workflow contains unsupported node types
- **THEN** the system SHALL display warning with list of unsupported nodes
- **AND** the system SHALL allow user to proceed or cancel import
- **AND** unsupported nodes SHALL be marked for manual configuration

### Requirement: FastGPT Configuration UI
The system SHALL provide user interface for configuring FastGPT connection and settings.

#### Scenario: Accessing FastGPT settings
- **WHEN** user opens settings panel
- **THEN** the system SHALL display "FastGPT Integration" section
- **AND** the system SHALL show API URL input field
- **AND** the system SHALL show API Key input field (password type)
- **AND** the system SHALL display current connection status

#### Scenario: Saving configuration
- **WHEN** user saves FastGPT configuration
- **THEN** the system SHALL validate URL format and API key presence
- **AND** the system SHALL test connection to FastGPT server
- **AND** the system SHALL store configuration securely
- **AND** the system SHALL display success or error message

#### Scenario: Connection status indicator
- **WHEN** FastGPT connection is active
- **THEN** the system SHALL display green indicator with "Connected" label
- **WHEN** FastGPT connection is inactive
- **THEN** the system SHALL display gray indicator with "Not Connected" label
- **WHEN** FastGPT connection fails
- **THEN** the system SHALL display red indicator with error message

