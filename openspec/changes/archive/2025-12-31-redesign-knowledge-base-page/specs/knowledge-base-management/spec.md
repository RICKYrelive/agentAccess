# knowledge-base-management Specification Deltas

## ADDED Requirements

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

## MODIFIED Requirements

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

## REMOVED Requirements
None - all existing functionality is preserved, only the presentation layer changes.
