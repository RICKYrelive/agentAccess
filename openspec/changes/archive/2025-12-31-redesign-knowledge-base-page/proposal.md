# Redesign Knowledge Base Page

## Summary
Redesign the Knowledge Base management page to align with the modern dashboard-style reference design. The new layout will feature a prominent header section, a status statistics bar, and a unified table view for all knowledge base types instead of separate card-based sections.

## Motivation
The current Knowledge Base page uses a card-based layout with separate sections for each knowledge base type (text, spreadsheet, database). This approach has several limitations:
- Users cannot easily compare or see all knowledge bases at a glance
- No overview statistics (total count, storage used, sync status)
- Scattered information across multiple sections
- Does not provide a cohesive professional dashboard experience

The reference design demonstrates a more professional and efficient dashboard interface that:
- Provides immediate visibility into key metrics
- Consolidates all knowledge bases into a single unified table
- Displays type/status information through visual badges
- Includes comprehensive search and filter capabilities
- Offers a cleaner, more modern user experience

## Proposed Changes
This change will redesign the Knowledge Base page with the following key modifications:

### 1. Enhanced Header Section
- Large prominent title: "知识库管理" (Knowledge Base Management)
- Descriptive subtitle: "高效管理、同步和组织数据源"
- Decorative gradient background element

### 2. Status Statistics Bar
Three stat cards displaying:
- **总文档数** (Total Documents): Total count of all documents/files across all knowledge bases
- **存储空间** (Storage Used): Total storage consumed with proper unit formatting (KB/MB/GB)
- **同步状态** (Sync Status): Overall synchronization status with timestamp

### 3. Creation Actions Section
Preserve the existing three creation option cards:
- **上传文件**: Support PDF, DOCX, CSV, TXT files (up to 50MB)
- **连接数据库**: Direct integration with PostgreSQL, MySQL
- **粘贴文本**: Manual text input for indexing

### 4. Unified Knowledge Base Table
Replace the three separate card sections with a single comprehensive table:
- Columns: 名称 (Name), 类型 (Type), 状态 (Status), 大小/表数 (Size/Tables), 创建时间 (Created), 操作 (Actions)
- Type column shows visual badges: 文本, 表格, 数据库
- Status column shows: Ready (已就绪), Processing (处理中), Syncing (同步中)
- Integrated search and filter functionality
- Sortable columns
- Row hover effects
- Action menu for each row (edit, delete, sync, etc.)

### 5. Enhanced Filtering
- Search box for finding knowledge bases by name
- Type filter dropdown (All, Text, Spreadsheet, Database)
- Status filter dropdown (All, Ready, Processing, Syncing)

## Impact Analysis

### Breaking Changes
None - this is a pure UI redesign. All existing functionality will be preserved.

### Dependencies
- Requires updates to `KnowledgeBasePage.vue`
- May need new table component or significant restructuring
- Store may need new computed properties for statistics

### Migration Path
1. Create new table-based layout component
2. Add statistics computation to store
3. Migrate existing dialogs to new layout
4. Test all existing functionality (create, edit, delete, view)

## Alternatives Considered
1. **Keep card layout with filtering**: Rejected - still doesn't provide at-a-glance overview
2. **Hybrid approach with expandable sections**: Rejected - adds unnecessary complexity
3. **Separate pages per type**: Rejected - reduces usability

## Success Criteria
- All knowledge bases visible in single table view
- Statistics accurately reflect current state
- All existing operations (create, edit, delete, view) continue to work
- Page loads and performs well with large datasets (50+ knowledge bases)
- Design matches reference visual style
- Chinese localization complete and consistent
