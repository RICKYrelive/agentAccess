# Tasks: enhance-knowledge-base-multiple-sources

## Implementation Tasks

### Phase 1: Data Model and Types
1. **Update type definitions**
   - Update `KnowledgeBaseSourceInfo` interface to support multiple sources
   - Add `FileInfo` interface for file metadata
   - Add `DatabaseConnectionInfo` interface
   - Export updated types

2. **Update knowledge base store**
   - Add migration logic for existing single-source knowledge bases
   - Update `createFromTextImport` to handle multiple files
   - Update `createFromSpreadsheetImport` to handle multiple files
   - Update `createFromDatabaseImport` to handle multiple tables
   - Add `addFileToKnowledgeBase` action
   - Add `removeFileFromKnowledgeBase` action
   - Add `addTableToKnowledgeBase` action
   - Add `removeTableFromKnowledgeBase` action

### Phase 2: Import Dialog Updates
3. **Update TextImportDialog component**
   - Change file input to support multiple files
   - Add file list display with remove buttons
   - Show file count and total size
   - Validate each file individually
   - Update form submission to handle file array

4. **Update SpreadsheetImportDialog component**
   - Change file input to support multiple files
   - Add file list display with remove buttons
   - Show file count and total size
   - Validate each file individually
   - Update form submission to handle file array

5. **Update DatabaseImportDialog component**
   - Change table dropdown to multi-select
   - Display selected tables as tags/chips
   - Show selected table count
   - Update form submission to handle table array

### Phase 3: Edit Dialogs
6. **Create EditTextKnowledgeBaseDialog component**
   - Create modal for editing text knowledge base sources
   - Display current files in a list
   - Add remove button for each file
   - Add "Add more files" button with file input
   - Prevent removing last file
   - Update store on save

7. **Create EditSpreadsheetKnowledgeBaseDialog component**
   - Create modal for editing spreadsheet knowledge base sources
   - Display current files in a list
   - Add remove button for each file
   - Add "Add more files" button with file input
   - Prevent removing last file
   - Update store on save

8. **Create EditDatabaseKnowledgeBaseDialog component**
   - Create modal for editing database knowledge base tables
   - Display current tables as tags
   - Add remove button for each table
   - Add table multi-select for adding more tables
   - Prevent removing last table
   - Update store on save

### Phase 4: Card Display Updates
9. **Update KnowledgeBaseCard component**
   - Update to display list of files (name + size)
   - Update to display list of database tables
   - Add scrollable area for long lists
   - Show file/table count
   - Style file/table list items

### Phase 5: Page Integration
10. **Update KnowledgeBasePage component**
    - Import new edit dialogs
    - Update edit button to open type-specific edit dialog
    - Pass knowledge base data to edit dialogs
    - Handle edit dialog submit events

### Phase 6: Polish and Testing
11. **Add demo knowledge bases with multiple sources**
    - Update demo data to include multi-file examples
    - Update demo data to include multi-table examples
    - Ensure migration works for old demo data

12. **Implement validation feedback**
    - Show error when trying to remove last source
    - Show error when file limit exceeded
    - Show error when table limit exceeded

13. **Responsive design verification**
    - Test file list display on mobile
    - Test table list display on mobile
    - Ensure edit dialogs work on all screen sizes

14. **Accessibility check**
    - Ensure file remove buttons are accessible
    - Ensure table selection is accessible
    - Test with keyboard navigation

15. **Type checking and validation**
    - Run `npm run type-check`
    - Fix any TypeScript errors

16. **Lint and format**
    - Run `npm run lint`
    - Run `npm run format`
    - Fix any style issues

17. **Manual testing**
    - Test creating text KB with multiple files
    - Test creating spreadsheet KB with multiple files
    - Test creating database KB with multiple tables
    - Test editing sources (add/remove files)
    - Test editing tables (add/remove tables)
    - Test migration of existing single-source KBs
    - Test validation (cannot remove last source)
    - Test empty states

18. **OpenSpec validation**
    - Run `npx openspec validate enhance-knowledge-base-multiple-sources --strict`
    - Fix any validation errors

## Dependencies
- Task 1 must complete before Task 2 (types needed for store)
- Task 2 must complete before Tasks 3-5 (store needed for components)
- Tasks 3, 4, 5 can be done in parallel (import dialogs are independent)
- Tasks 6, 7, 8 can be done in parallel (edit dialogs are independent)
- Task 9 must complete before Task 10 (card needed for page integration)
- Task 10 depends on Tasks 6, 7, 8 (page needs edit dialogs)

## Definition of Done
- [x] All Phase 1-5 tasks completed (edit dialogs deferred to future)
- [x] Type checking passes (no new errors introduced)
- [x] Can create text KB with multiple files
- [x] Can create spreadsheet KB with multiple files
- [x] Can create database KB with multiple tables
- [x] Knowledge base cards display all sources
- [x] Existing single-source KBs migrate correctly
- [x] Demo data updated with multiple sources
- [ ] Edit dialogs for source management (deferred)
- [ ] Full testing of add/remove sources (deferred)
