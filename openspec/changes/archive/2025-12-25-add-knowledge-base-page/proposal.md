# Proposal: add-knowledge-base-page

## Summary
Add a dedicated Knowledge Base management page that allows users to create, view, edit, and delete knowledge bases. The page will support three import methods: text files (Word, PDF, TXT), spreadsheet files (Excel, CSV), and database connections (MySQL, PostgreSQL).

## Motivation
Currently, the application displays a placeholder "知识库" menu item in the sidebar but does not have a functional knowledge base management interface. Users need a way to:
1. Create knowledge bases from different data sources
2. Organize knowledge bases by type (text, spreadsheet, database)
3. Manage existing knowledge bases (view, edit, delete)

## Proposed Solution
Create a new Knowledge Base page component with the following features:

### 1. Page Structure
- **Header**: Page title "知识库管理"
- **Creation Section**: Three import method buttons with modal dialogs
- **Display Section**: Three categorized sections (text, spreadsheet, database)

### 2. Import Methods

#### Text Import
- Supported formats: Word (.docx), PDF (.pdf), Text (.txt)
- Modal fields:
  - Knowledge base name (required)
  - Description (optional)
  - File upload (required)
  - Encoding selection (optional, for TXT files)
  - Language selection (optional)

#### Spreadsheet Import
- Supported formats: Excel (.xlsx, .xls), CSV (.csv)
- Modal fields:
  - Knowledge base name (required)
  - Description (optional)
  - File upload (required)
  - Sheet selection (for Excel files with multiple sheets)
  - Header row toggle (yes/no)
  - Encoding selection (for CSV files)

#### Database Import
- Supported databases: MySQL, PostgreSQL
- Modal fields:
  - Knowledge base name (required)
  - Description (optional)
  - Database type (dropdown: MySQL, PostgreSQL)
  - Host (required)
  - Port (required, default: 3306 for MySQL, 5432 for PostgreSQL)
  - Username (required)
  - Password (required, password field)
  - Database name (required)
  - Table selection (auto-populated after connection)
  - Connection test button

### 3. Knowledge Base Display
- Group knowledge bases by type (text, spreadsheet, database)
- Each knowledge base displayed as a card with:
  - Name
  - Description
  - Type badge
  - Creation date
  - Action buttons (view, edit, delete)

## Scope
### In Scope
- Knowledge Base page component
- Three import modal dialogs (text, spreadsheet, database)
- Knowledge base card display with type grouping
- Mock data store for demonstration (no actual file processing or database connections)
- Navigation integration (sidebar menu)

### Out of Scope
- Actual file parsing and processing
- Real database connections
- Backend API integration (UI only for now)
- Knowledge base search and filtering
- Knowledge base sharing/collaboration

## Dependencies
- Existing Vue 3 + TypeScript setup
- Existing layout and navigation structure
- Existing Pinia store pattern

## Impact on Existing Specifications
### MODIFIED Specifications
- `ui-interface`: Knowledge Base Integration section - enhance from simple dropdown to full page
- `frontend`: Add new KnowledgeBasePage component and routing

### ADDED Capabilities
- `knowledge-base-management`: New capability for knowledge base CRUD operations

## Success Criteria
1. User can navigate to Knowledge Base page from sidebar
2. User can open import modals for all three types
3. User can fill out and submit import forms (with validation)
4. Imported knowledge bases appear in appropriate category sections
5. User can view, edit, and delete knowledge bases
6. All interactions work without backend (mock data)
7. Page is responsive and follows existing design patterns
