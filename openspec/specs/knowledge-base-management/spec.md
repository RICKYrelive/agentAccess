# knowledge-base-management Specification

## Purpose
TBD - created by archiving change add-knowledge-base-page. Update Purpose after archive.
## Requirements
### Requirement: Knowledge Base Page Display
The system SHALL provide a dedicated Knowledge Base management page with an enhanced header, statistics bar, creation section, and unified table view. The page layout SHALL match a modern dashboard-style design with all knowledge bases displayed in a single table rather than separate card sections.

#### Scenario: User navigates to Knowledge Base page
- **WHEN** user clicks "知识库" menu item in the sidebar
- **THEN** the system SHALL navigate to the Knowledge Base page
- **AND** the system SHALL display enhanced header with gradient title
- **AND** the system SHALL display statistics bar with 3 stat cards
- **AND** the system SHALL display three creation option buttons
- **AND** the system SHALL display a unified table of all knowledge bases
- **AND** the table SHALL include filter and search functionality

#### Scenario: User views empty Knowledge Base page
- **WHEN** user navigates to Knowledge Base page with no knowledge bases
- **THEN** the system SHALL display the enhanced header and statistics (all zeros)
- **AND** the system SHALL display the creation buttons
- **AND** the system SHALL display empty table with appropriate messaging
- **AND** the system SHALL show "暂无知识库" in the table body

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

### Requirement: Knowledge Base Page Header with Statistics
The system SHALL display an enhanced header section with a prominent title and statistics bar showing key metrics.

#### Scenario: User views Knowledge Base page header
- **WHEN** user navigates to the Knowledge Base page
- **THEN** the system SHALL display a large gradient title "知识库管理"
- **AND** the system SHALL display subtitle "高效管理、同步和组织数据源"
- **AND** the system SHALL display three statistics cards below the header

#### Scenario: System displays statistics cards
- **WHEN** Knowledge Base page loads
- **THEN** the system SHALL display "总文档数" card showing total document count
- **AND** the system SHALL display "存储空间" card showing formatted storage (e.g., "1.2 MB")
- **AND** the system SHALL display "同步状态" card showing sync status with timestamp

### Requirement: Unified Knowledge Base Table View
The system SHALL display all knowledge bases in a single unified table instead of separate card sections.

#### Scenario: User views unified knowledge base table
- **WHEN** Knowledge Base page loads with existing knowledge bases
- **THEN** the system SHALL display a single table containing all knowledge bases
- **AND** the table SHALL include columns: 名称, 类型, 状态, 大小/表数, 创建时间, 操作
- **AND** the system SHALL display table header "知识库 X" where X is the count

#### Scenario: User views knowledge base type in table
- **WHEN** a knowledge base is displayed in the table
- **THEN** the type column SHALL show a colored badge: "文本" (green), "表格" (blue), or "数据库" (purple)
- **AND** the badge SHALL include an appropriate icon
- **AND** the badge SHALL have background color matching the type

### Requirement: Knowledge Base Status Display
The system SHALL display the current status of each knowledge base in the status column.

#### Scenario: Knowledge base shows Ready status
- **WHEN** a knowledge base is fully processed and ready for use
- **THEN** the status column SHALL display "已就绪" badge
- **AND** the badge SHALL have green background
- **AND** the badge SHALL include a solid green dot indicator

#### Scenario: Knowledge base shows Processing status
- **WHEN** a knowledge base is being processed
- **THEN** the status column SHALL display "处理中" badge
- **AND** the badge SHALL have blue background
- **AND** the badge SHALL include a spinning animation indicator

#### Scenario: Knowledge base shows Syncing status
- **WHEN** a database knowledge base is syncing
- **THEN** the status column SHALL display "同步中" badge
- **AND** the badge SHALL have amber background
- **AND** the badge SHALL include a spinning animation indicator

#### Scenario: Knowledge base shows Error status
- **WHEN** a knowledge base has an error
- **THEN** the status column SHALL display "错误" badge
- **AND** the badge SHALL have red background
- **AND** the badge SHALL include a solid red dot indicator

### Requirement: Knowledge Base Table Search and Filter
The system SHALL provide search and filter functionality for the knowledge base table.

#### Scenario: User searches knowledge bases by name
- **WHEN** user types in the search input
- **THEN** the system SHALL filter knowledge bases by name
- **AND** the system SHALL update the table in real-time
- **AND** the system SHALL highlight matching results (optional)

#### Scenario: User filters by type
- **WHEN** user selects a type from the type filter dropdown
- **THEN** the system SHALL filter the table to show only selected type
- **AND** the system SHALL update the document count to reflect filtered results
- **AND** "全部" option SHALL show all knowledge bases

#### Scenario: User filters by status
- **WHEN** user selects a status from the status filter dropdown
- **THEN** the system SHALL filter the table to show only selected status
- **AND** the system SHALL update the document count to reflect filtered results
- **AND** "全部" option SHALL show all knowledge bases

### Requirement: Knowledge Base Size Display
The system SHALL display appropriate size or count information for each knowledge base type.

#### Scenario: Text knowledge base shows file size
- **WHEN** a text knowledge base is displayed
- **THEN** the size column SHALL show the total size of all files
- **AND** the system SHALL format the size appropriately (e.g., "459 KB", "2.4 MB")

#### Scenario: Spreadsheet knowledge base shows file size
- **WHEN** a spreadsheet knowledge base is displayed
- **THEN** the size column SHALL show the total size of all spreadsheet files
- **AND** the system SHALL format the size appropriately (e.g., "1.2 MB")

#### Scenario: Database knowledge base shows table count
- **WHEN** a database knowledge base is displayed
- **THEN** the size column SHALL show the count of tables (e.g., "3 tables", "5 个表")
- **AND** the system SHALL NOT show a file size for databases

### Requirement: Knowledge Base Table Actions
The system SHALL provide action menu for each knowledge base row.

#### Scenario: User opens action menu
- **WHEN** user clicks the action menu button (three dots) in a row
- **THEN** the system SHALL display a dropdown menu
- **AND** the menu SHALL include "编辑" option for editable knowledge bases
- **AND** the menu SHALL include "删除" option for editable knowledge bases
- **AND** the menu SHALL include "查看详情" option
- **AND** the menu SHALL include "同步" option for database knowledge bases

#### Scenario: User initiates edit from table
- **WHEN** user clicks "编辑" in the action menu
- **THEN** the system SHALL open the appropriate edit dialog
- **AND** the system SHALL pre-populate with current knowledge base data

#### Scenario: User initiates delete from table
- **WHEN** user clicks "删除" in the action menu
- **THEN** the system SHALL display a confirmation dialog
- **AND** the dialog SHALL ask "确定要删除这个知识库吗？"

### Requirement: Statistics Computation
The system SHALL compute and display accurate statistics for all knowledge bases.

#### Scenario: System calculates total document count
- **WHEN** knowledge bases contain multiple files or tables
- **THEN** the system SHALL count all files across text and spreadsheet knowledge bases
- **AND** the system SHALL count all tables across database knowledge bases
- **AND** the system SHALL display the sum as "总文档数"

#### Scenario: System calculates storage used
- **WHEN** computing storage statistics
- **THEN** the system SHALL sum all file sizes for text and spreadsheet knowledge bases
- **AND** the system SHALL exclude database knowledge bases from storage calculation
- **AND** the system SHALL format the total as KB, MB, or GB

#### Scenario: System displays sync status
- **WHEN** displaying sync status
- **THEN** the system SHALL show "已同步" with timestamp if all databases are synced
- **AND** the system SHALL show "同步中" if any database is syncing
- **AND** the system SHALL show "2分钟前" or similar relative time format

