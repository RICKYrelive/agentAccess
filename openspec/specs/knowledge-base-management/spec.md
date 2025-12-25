# knowledge-base-management Specification

## Purpose
TBD - created by archiving change add-knowledge-base-page. Update Purpose after archive.
## Requirements
### Requirement: Knowledge Base Page Display
The system SHALL provide a dedicated Knowledge Base management page with a header, creation section, and categorized display sections.

#### Scenario: User navigates to Knowledge Base page
- **WHEN** user clicks "知识库" menu item in the sidebar
- **THEN** the system SHALL navigate to the Knowledge Base page
- **AND** the system SHALL display page title "知识库管理"
- **AND** the system SHALL display three import option buttons
- **AND** the system SHALL display three category sections (text, spreadsheet, database)

#### Scenario: User views empty Knowledge Base page
- **WHEN** user navigates to Knowledge Base page with no knowledge bases
- **THEN** the system SHALL display the page header and import buttons
- **AND** the system SHALL display empty category sections
- **AND** the system SHALL show appropriate empty state messaging

### Requirement: Text Knowledge Base Import
The system SHALL provide a text file import dialog supporting Word, PDF, and TXT formats.

#### Scenario: User opens text import dialog
- **WHEN** user clicks the "文本导入" button
- **THEN** the system SHALL display a modal dialog
- **AND** the dialog SHALL contain fields for: name, description, file upload, encoding selection, language selection
- **AND** the file input SHALL accept .pdf, .docx, and .txt files

#### Scenario: User submits text knowledge base form
- **WHEN** user fills required fields (name, file) and submits
- **THEN** the system SHALL validate the form inputs
- **AND** the system SHALL create a new knowledge base entry with type 'text'
- **AND** the system SHALL close the dialog
- **AND** the system SHALL display the new knowledge base in the "文本知识库" section

#### Scenario: User submits invalid text form
- **WHEN** user submits form with missing required fields
- **THEN** the system SHALL display validation errors below invalid fields
- **AND** the system SHALL prevent form submission
- **AND** the dialog SHALL remain open

### Requirement: Spreadsheet Knowledge Base Import
The system SHALL provide a spreadsheet import dialog supporting Excel and CSV formats.

#### Scenario: User opens spreadsheet import dialog
- **WHEN** user clicks the "表格导入" button
- **THEN** the system SHALL display a modal dialog
- **AND** the dialog SHALL contain fields for: name, description, file upload, header row toggle, encoding selection
- **AND** the file input SHALL accept .xlsx, .xls, and .csv files

#### Scenario: User submits spreadsheet knowledge base form
- **WHEN** user fills required fields (name, file) and submits
- **THEN** the system SHALL validate the form inputs
- **AND** the system SHALL create a new knowledge base entry with type 'spreadsheet'
- **AND** the system SHALL close the dialog
- **AND** the system SHALL display the new knowledge base in the "表格知识库" section

### Requirement: Database Knowledge Base Import
The system SHALL provide a database import dialog supporting MySQL and PostgreSQL connections.

#### Scenario: User opens database import dialog
- **WHEN** user clicks the "数据库导入" button
- **THEN** the system SHALL display a modal dialog
- **AND** the dialog SHALL contain fields for: name, description, database type, host, port, username, password, database name, table selection
- **AND** the dialog SHALL include a "测试连接" button

#### Scenario: User tests database connection
- **WHEN** user fills connection details and clicks "测试连接"
- **THEN** the system SHALL validate the connection parameters
- **AND** the system SHALL display a success message (mock)
- **AND** the system SHALL populate the table selection dropdown with mock table names

#### Scenario: User submits database knowledge base form
- **WHEN** user fills required fields and selects a table
- **THEN** the system SHALL validate the form inputs
- **AND** the system SHALL create a new knowledge base entry with type 'database'
- **AND** the system SHALL store connection configuration (not actual connection)
- **AND** the system SHALL close the dialog
- **AND** the system SHALL display the new knowledge base in the "数据库知识库" section

#### Scenario: User selects database type
- **WHEN** user selects "MySQL" from database type dropdown
- **THEN** the system SHALL pre-fill port field with 3306
- **WHEN** user selects "PostgreSQL" from database type dropdown
- **THEN** the system SHALL pre-fill port field with 5432

### Requirement: Knowledge Base Display and Organization
The system SHALL display knowledge bases organized by type (text, spreadsheet, database).

#### Scenario: System displays knowledge bases by type
- **WHEN** Knowledge Base page loads with existing knowledge bases
- **THEN** the system SHALL display text knowledge bases in "文本知识库" section
- **AND** the system SHALL display spreadsheet knowledge bases in "表格知识库" section
- **AND** the system SHALL display database knowledge bases in "数据库知识库" section

#### Scenario: User views knowledge base card
- **WHEN** user views a knowledge base card
- **THEN** the card SHALL display: name, description, type badge, creation date
- **AND** the card SHALL include edit button
- **AND** the card SHALL include delete button

### Requirement: Knowledge Base Editing
The system SHALL allow users to edit knowledge base name and description.

#### Scenario: User edits knowledge base
- **WHEN** user clicks edit button on a knowledge base card
- **THEN** the system SHALL open an edit dialog with current values pre-filled
- **AND** the dialog SHALL allow editing name and description
- **WHEN** user submits the edit form
- **THEN** the system SHALL update the knowledge base in the store
- **AND** the system SHALL refresh the display
- **AND** the system SHALL show a success indication

### Requirement: Knowledge Base Deletion
The system SHALL allow users to delete knowledge bases with confirmation.

#### Scenario: User deletes knowledge base
- **WHEN** user clicks delete button on a knowledge base card
- **THEN** the system SHALL display a confirmation dialog
- **AND** the dialog SHALL ask "确定要删除这个知识库吗？"
- **WHEN** user confirms deletion
- **THEN** the system SHALL remove the knowledge base from the store
- **AND** the system SHALL refresh the display
- **WHEN** user cancels deletion
- **THEN** the system SHALL keep the knowledge base
- **AND** the dialog SHALL close

### Requirement: Navigation Integration
The system SHALL integrate the Knowledge Base page into the main navigation.

#### Scenario: Knowledge Base menu item navigation
- **WHEN** user clicks "知识库" in the sidebar
- **THEN** the system SHALL navigate to Knowledge Base page
- **AND** the sidebar SHALL highlight "知识库" as active
- **AND** the system SHALL hide the settings panel if shown

#### Scenario: User navigates away from Knowledge Base page
- **WHEN** user clicks another navigation item
- **THEN** the system SHALL navigate to the selected page
- **AND** the Knowledge Base page SHALL preserve its state
- **AND** the "知识库" menu item SHALL no longer be highlighted

### Requirement: Responsive Design
The system SHALL provide a responsive layout for the Knowledge Base page.

#### Scenario: Desktop layout
- **WHEN** user views Knowledge Base page on desktop (>1024px)
- **THEN** import buttons SHALL display in 3 columns
- **AND** knowledge base cards SHALL display in 3 columns per section

#### Scenario: Tablet layout
- **WHEN** user views Knowledge Base page on tablet (768px-1024px)
- **THEN** import buttons SHALL display in 2 columns or stacked
- **AND** knowledge base cards SHALL display in 2 columns per section

#### Scenario: Mobile layout
- **WHEN** user views Knowledge Base page on mobile (<768px)
- **THEN** import buttons SHALL stack vertically
- **AND** knowledge base cards SHALL display in single column

