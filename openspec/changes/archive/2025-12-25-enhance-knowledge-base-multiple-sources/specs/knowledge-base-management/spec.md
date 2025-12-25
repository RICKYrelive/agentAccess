# knowledge-base-management Specification Delta

## ADDED Requirements

### Requirement: Multiple File Upload for Text Knowledge Base
The system SHALL allow users to upload multiple files when creating a text knowledge base.

#### Scenario: User uploads multiple text files
- **WHEN** user clicks the file input in TextImportDialog
- **THEN** the system SHALL allow selecting multiple .pdf, .docx, or .txt files
- **AND** the system SHALL display a list of selected files
- **AND** each file in the list SHALL show: file name, file size, and remove button
- **AND** the system SHALL display total file count and total size

#### Scenario: User validates multiple file upload
- **WHEN** user selects files exceeding the size limit (10MB per file)
- **THEN** the system SHALL display error for oversized files
- **AND** the system SHALL prevent submission of invalid files
- **WHEN** user selects more than 50 files
- **THEN** the system SHALL display error: "最多只能上传 50 个文件"
- **AND** the system SHALL prevent submission

#### Scenario: User removes file from upload list
- **WHEN** user clicks remove button on a file in the list
- **THEN** the system SHALL remove that file from the list
- **AND** the system SHALL update the file count and total size
- **WHEN** user removes all files from the list
- **THEN** the system SHALL display error: "至少需要上传 1 个文件"
- **AND** the system SHALL disable the submit button

### Requirement: Multiple File Upload for Spreadsheet Knowledge Base
The system SHALL allow users to upload multiple files when creating a spreadsheet knowledge base.

#### Scenario: User uploads multiple spreadsheet files
- **WHEN** user clicks the file input in SpreadsheetImportDialog
- **THEN** the system SHALL allow selecting multiple .xlsx, .xls, or .csv files
- **AND** the system SHALL display a list of selected files
- **AND** each file in the list SHALL show: file name, file size, and remove button
- **AND** the system SHALL display total file count and total size

#### Scenario: User validates multiple spreadsheet upload
- **WHEN** user selects files exceeding the size limit (50MB per file)
- **THEN** the system SHALL display error for oversized files
- **AND** the system SHALL prevent submission of invalid files

### Requirement: Multiple Table Selection for Database Knowledge Base
The system SHALL allow users to select multiple tables when creating a database knowledge base.

#### Scenario: User selects multiple database tables
- **WHEN** user successfully tests database connection
- **THEN** the system SHALL display available tables in a multi-select interface
- **AND** the system SHALL allow user to select multiple tables
- **AND** the system SHALL display selected tables as tags/chips
- **AND** each selected table SHALL have a remove button
- **AND** the system SHALL display the count of selected tables

#### Scenario: User validates table selection
- **WHEN** user has not selected any tables
- **THEN** the system SHALL disable the submit button
- **WHEN** user selects more than 20 tables
- **THEN** the system SHALL display error: "最多只能选择 20 个表"
- **AND** the system SHALL prevent selection of additional tables

### Requirement: Edit Text Knowledge Base Sources
The system SHALL allow users to add and remove source files from existing text knowledge bases.

#### Scenario: User opens text knowledge base edit dialog
- **WHEN** user clicks edit button on a text knowledge base card
- **THEN** the system SHALL open EditTextKnowledgeBaseDialog
- **AND** the dialog SHALL display current name and description (editable)
- **AND** the dialog SHALL display list of current source files
- **AND** each file SHALL show: file name, file size, and remove button

#### Scenario: User adds files to text knowledge base
- **WHEN** user clicks "添加文件" button in edit dialog
- **THEN** the system SHALL open file picker
- **AND** user SHALL be able to select additional files
- **AND** the system SHALL add new files to the file list
- **WHEN** user saves the changes
- **THEN** the system SHALL update the knowledge base with new files

#### Scenario: User removes file from text knowledge base
- **WHEN** user clicks remove button on a file
- **AND** the knowledge base has more than one file
- **THEN** the system SHALL remove the file from the list
- **WHEN** user tries to remove the last file
- **THEN** the system SHALL display error: "知识库至少需要 1 个源文件"
- **AND** the system SHALL prevent removal

### Requirement: Edit Spreadsheet Knowledge Base Sources
The system SHALL allow users to add and remove source files from existing spreadsheet knowledge bases.

#### Scenario: User opens spreadsheet knowledge base edit dialog
- **WHEN** user clicks edit button on a spreadsheet knowledge base card
- **THEN** the system SHALL open EditSpreadsheetKnowledgeBaseDialog
- **AND** the dialog SHALL display current name and description (editable)
- **AND** the dialog SHALL display list of current source files
- **AND** each file SHALL show: file name, file size, and remove button

#### Scenario: User adds files to spreadsheet knowledge base
- **WHEN** user clicks "添加文件" button in edit dialog
- **THEN** the system SHALL open file picker
- **AND** user SHALL be able to select additional files
- **AND** the system SHALL add new files to the file list

#### Scenario: User removes file from spreadsheet knowledge base
- **WHEN** user clicks remove button on a file
- **AND** the knowledge base has more than one file
- **THEN** the system SHALL remove the file from the list
- **WHEN** user tries to remove the last file
- **THEN** the system SHALL display error: "知识库至少需要 1 个源文件"

### Requirement: Edit Database Knowledge Base Tables
The system SHALL allow users to add and remove tables from existing database knowledge bases.

#### Scenario: User opens database knowledge base edit dialog
- **WHEN** user clicks edit button on a database knowledge base card
- **THEN** the system SHALL open EditDatabaseKnowledgeBaseDialog
- **AND** the dialog SHALL display current name and description (editable)
- **AND** the dialog SHALL display connection info (read-only)
- **AND** the dialog SHALL display list of selected tables as tags
- **AND** each table tag SHALL have a remove button

#### Scenario: User adds tables to database knowledge base
- **WHEN** user clicks "选择表" button in edit dialog
- **THEN** the system SHALL display available tables in multi-select
- **AND** user SHALL be able to select additional tables
- **AND** the system SHALL add new tables to the selected list

#### Scenario: User removes table from database knowledge base
- **WHEN** user clicks remove button on a table tag
- **AND** the knowledge base has more than one table
- **THEN** the system SHALL remove the table from the list
- **WHEN** user tries to remove the last table
- **THEN** the system SHALL display error: "知识库至少需要 1 个表"

### Requirement: Display Multiple Sources on Knowledge Base Card
The system SHALL display all source files or tables on knowledge base cards.

#### Scenario: User views text knowledge base card with multiple files
- **WHEN** a text knowledge base has multiple files
- **THEN** the card SHALL display a list of all files
- **AND** each file SHALL show: file name and size
- **AND** the file list SHALL be scrollable if more than 5 files
- **AND** the system SHALL display total file count

#### Scenario: User views database knowledge base card with multiple tables
- **WHEN** a database knowledge base has multiple tables
- **THEN** the card SHALL display a list of all table names
- **AND** the table list SHALL be scrollable if more than 5 tables
- **AND** the system SHALL display total table count

### Requirement: Backward Compatibility for Single Source Knowledge Bases
The system SHALL automatically migrate existing single-source knowledge bases to the new multi-source format.

#### Scenario: System loads existing single-file knowledge base
- **WHEN** the system loads a knowledge base with `fileName` property (old format)
- **THEN** the system SHALL convert it to `files` array format
- **AND** the file SHALL be assigned a unique ID
- **AND** the file SHALL preserve original name, type, and size

#### Scenario: System loads existing single-table knowledge base
- **WHEN** the system loads a knowledge base with `table` property (old format)
- **THEN** the system SHALL convert it to `tables` array format
- **AND** the table SHALL be the first item in the tables array

## MODIFIED Requirements

### Requirement: Text Knowledge Base Import
The system SHALL provide a text file import dialog supporting multiple Word, PDF, and TXT files.

#### Scenario: User opens text import dialog
- **WHEN** user clicks the "文本导入" button
- **THEN** the system SHALL display a modal dialog
- **AND** the dialog SHALL contain fields for: name, description, multiple file upload, encoding selection, language selection
- **AND** the file input SHALL accept multiple .pdf, .docx, and .txt files

#### Scenario: User submits text knowledge base form
- **WHEN** user fills required fields (name, one or more files) and submits
- **THEN** the system SHALL validate the form inputs
- **AND** the system SHALL create a new knowledge base entry with type 'text'
- **AND** the system SHALL store all uploaded files in the files array
- **AND** the system SHALL close the dialog
- **AND** the system SHALL display the new knowledge base in the "文本知识库" section

### Requirement: Spreadsheet Knowledge Base Import
The system SHALL provide a spreadsheet import dialog supporting multiple Excel and CSV files.

#### Scenario: User opens spreadsheet import dialog
- **WHEN** user clicks the "表格导入" button
- **THEN** the system SHALL display a modal dialog
- **AND** the dialog SHALL contain fields for: name, description, multiple file upload, header row toggle, encoding selection
- **AND** the file input SHALL accept multiple .xlsx, .xls, and .csv files

#### Scenario: User submits spreadsheet knowledge base form
- **WHEN** user fills required fields (name, one or more files) and submits
- **THEN** the system SHALL validate the form inputs
- **AND** the system SHALL create a new knowledge base entry with type 'spreadsheet'
- **AND** the system SHALL store all uploaded files in the files array
- **AND** the system SHALL close the dialog
- **AND** the system SHALL display the new knowledge base in the "表格知识库" section

### Requirement: Database Knowledge Base Import
The system SHALL provide a database import dialog supporting multiple table selection.

#### Scenario: User opens database import dialog
- **WHEN** user clicks the "数据库导入" button
- **THEN** the system SHALL display a modal dialog
- **AND** the dialog SHALL contain fields for: name, description, database type, host, port, username, password, database name, multi-table selection
- **AND** the dialog SHALL include a "测试连接" button

#### Scenario: User tests database connection
- **WHEN** user fills connection details and clicks "测试连接"
- **THEN** the system SHALL validate the connection parameters
- **AND** the system SHALL display a success message (mock)
- **AND** the system SHALL populate the table selection with mock table names
- **AND** the table selection SHALL support selecting multiple tables

#### Scenario: User submits database knowledge base form
- **WHEN** user fills required fields and selects one or more tables
- **THEN** the system SHALL validate the form inputs
- **AND** the system SHALL create a new knowledge base entry with type 'database'
- **AND** the system SHALL store connection configuration and selected tables
- **AND** the system SHALL close the dialog
- **AND** the system SHALL display the new knowledge base in the "数据库知识库" section

### Requirement: Knowledge Base Display and Organization
The system SHALL display knowledge bases organized by type, showing all source files or tables.

#### Scenario: System displays knowledge bases by type
- **WHEN** Knowledge Base page loads with existing knowledge bases
- **THEN** the system SHALL display text knowledge bases in "文本知识库" section
- **AND** the system SHALL display spreadsheet knowledge bases in "表格知识库" section
- **AND** the system SHALL display database knowledge bases in "数据库知识库" section

#### Scenario: User views knowledge base card
- **WHEN** user views a knowledge base card
- **THEN** the card SHALL display: name, description, type badge, creation date
- **AND** for text/spreadsheet types: the card SHALL display list of all source files with names and sizes
- **AND** for database type: the card SHALL display list of all selected tables
- **AND** the card SHALL include edit button
- **AND** the card SHALL include delete button

### Requirement: Knowledge Base Editing
The system SHALL allow users to edit knowledge base name, description, and manage sources.

#### Scenario: User edits knowledge base
- **WHEN** user clicks edit button on a knowledge base card
- **THEN** the system SHALL open the appropriate edit dialog based on knowledge base type
- **AND** the dialog SHALL allow editing name and description
- **AND** for text/spreadsheet types: the dialog SHALL display current files with remove buttons and add file option
- **AND** for database type: the dialog SHALL display current tables with remove buttons and add table option
- **AND** the system SHALL enforce minimum 1 source requirement
- **WHEN** user submits the edit form
- **THEN** the system SHALL update the knowledge base in the store
- **AND** the system SHALL refresh the display
- **AND** the system SHALL show a success indication
