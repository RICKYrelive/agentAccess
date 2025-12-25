# frontend Specification Delta

## ADDED Requirements

### Requirement: Knowledge Base Page Components
The system SHALL provide Vue.js components for the Knowledge Base management page including the main page, knowledge base cards, and import dialogs.

#### Scenario: Knowledge Base page component initialization
- **WHEN** user navigates to the Knowledge Base page
- **THEN** the system SHALL initialize the KnowledgeBasePage component
- **AND** the system SHALL load knowledge bases from the Pinia store
- **AND** the system SHALL render knowledge base cards organized by type

#### Scenario: Import dialog component rendering
- **WHEN** user clicks an import method button
- **THEN** the system SHALL initialize the appropriate import dialog component (TextImportDialog, SpreadsheetImportDialog, or DatabaseImportDialog)
- **AND** the dialog SHALL render as a modal overlay
- **AND** the dialog SHALL contain form fields specific to the import type

### Requirement: Knowledge Base State Management
The system SHALL provide a Pinia store for managing knowledge base state and operations.

#### Scenario: Knowledge base store initialization
- **WHEN** the application initializes
- **THEN** the system SHALL create the knowledge base Pinia store
- **AND** the store SHALL contain an array of knowledge bases
- **AND** the store SHALL provide actions for creating, updating, and deleting knowledge bases

#### Scenario: Knowledge base CRUD operations
- **WHEN** user creates a new knowledge base
- **THEN** the store SHALL add the new knowledge base to the array
- **WHEN** user updates a knowledge base
- **THEN** the store SHALL update the knowledge base in the array
- **WHEN** user deletes a knowledge base
- **THEN** the store SHALL remove the knowledge base from the array

### Requirement: Knowledge Base Type Definitions
The system SHALL provide TypeScript type definitions for knowledge base entities.

#### Scenario: Type system for knowledge bases
- **WHEN** components interact with knowledge base data
- **THEN** the system SHALL enforce type safety with KnowledgeBase interface
- **AND** the interface SHALL define properties: id, name, description, type, sourceInfo, createdAt, updatedAt
- **AND** the type property SHALL be a union of 'text' | 'spreadsheet' | 'database'

## MODIFIED Requirements

### Requirement: Navigation and User Management
[MODIFIED] The system SHALL provide comprehensive navigation functionality including access to the Knowledge Base management page.

#### Scenario: User navigates to Knowledge Base page
- **WHEN** user clicks "知识库" menu item in the sidebar
- **THEN** the system SHALL emit a view-change event with 'knowledge-base'
- **AND** the central content area SHALL display the KnowledgeBasePage component
- **AND** the system SHALL update the activeView state to 'knowledge-base'

#### Scenario: Sidebar knowledge base menu behavior
- **WHEN** user interacts with "知识库" menu item
- **THEN** the system SHALL navigate to Knowledge Base page (not expand a submenu)
- **AND** the menu item SHALL show active state when on Knowledge Base page
- **AND** the menu item SHALL remove the previous expand/collapse behavior

### Requirement: Three-Column Layout Implementation
[MODIFIED] The system SHALL provide a responsive three-column layout where the central content area can display home page, workflow editor, My Agents page, Team Agents page, Team Detail page, or Knowledge Base page.

#### Scenario: Main interface display with Knowledge Base page
- **WHEN** user navigates to the Knowledge Base page
- **THEN** the central content area SHALL display the KnowledgeBasePage component
- **AND** the left sidebar SHALL remain visible with navigation options
- **AND** the right settings panel SHALL be hidden on Knowledge Base page
