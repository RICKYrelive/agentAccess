# Tasks: add-knowledge-base-page

## Implementation Tasks

### Phase 1: Foundation
1. **Create type definitions**
   - Create `src/types/knowledge-base.ts`
   - Define KnowledgeBase interface and related types
   - Export types for use in components and store

2. **Create knowledge base store**
   - Create `src/stores/knowledgeBase.ts`
   - Implement state (knowledgeBases array, loading state)
   - Implement CRUD actions (create, update, delete)
   - Implement mock database connection test
   - Add computed getters for filtering by type
   - Set up localStorage persistence for demo data

3. **Update navigation types**
   - Update `SidebarNavigation.vue` props interface
   - Update `AppLayout.vue` activeView type union
   - Add 'knowledge-base' to view type definitions

### Phase 2: Core Components
4. **Create KnowledgeBaseCard component**
   - Create `src/components/knowledge-base/KnowledgeBaseCard.vue`
   - Implement card layout with name, description, type badge
   - Add edit and delete action buttons
   - Add emit events for edit/delete actions
   - Style to match existing card patterns (MyAgentsPage)

5. **Create main KnowledgeBasePage component**
   - Create `src/components/knowledge-base/KnowledgeBasePage.vue`
   - Implement page header with title
   - Implement creation section with three import buttons
   - Implement three category sections (text, spreadsheet, database)
   - Add KnowledgeBaseCard rendering for each section
   - Connect to knowledge base store

### Phase 3: Import Dialogs
6. **Create TextImportDialog component**
   - Create `src/components/knowledge-base/import-dialogs/TextImportDialog.vue`
   - Implement modal overlay and card layout
   - Add form fields: name, description, file upload, encoding, language
   - Implement form validation (required fields, file size/type)
   - Add submit and cancel handlers
   - Style to match existing modal patterns

7. **Create SpreadsheetImportDialog component**
   - Create `src/components/knowledge-base/import-dialogs/SpreadsheetImportDialog.vue`
   - Implement modal overlay and card layout
   - Add form fields: name, description, file upload, has header, encoding
   - Implement form validation (required fields, file size/type)
   - Add submit and cancel handlers

8. **Create DatabaseImportDialog component**
   - Create `src/components/knowledge-base/import-dialogs/DatabaseImportDialog.vue`
   - Implement modal overlay and card layout
   - Add form fields: name, description, db type, host, port, username, password, database, table
   - Implement dynamic port default based on DB type
   - Add connection test button (mock, always succeeds)
   - Implement table selection dropdown (mock data)
   - Implement form validation
   - Add submit and cancel handlers

### Phase 4: Navigation Integration
9. **Update SidebarNavigation component**
   - Make "知识库" menu item navigate to knowledge base page
   - Remove hardcoded knowledge base submenu
   - Add 'knowledge-base' to view change handler
   - Update active state styling for knowledge base item

10. **Update AppLayout component**
    - Add 'knowledge-base' to activeView props type
    - Add conditional rendering for KnowledgeBasePage
    - Import and register KnowledgeBasePage component

### Phase 5: Polish
11. **Add demo knowledge bases**
    - Add mock knowledge bases to store initialization
    - Include at least one of each type (text, spreadsheet, database)
    - Ensure they display correctly in respective sections

12. **Implement delete confirmation**
    - Add confirmation dialog for delete action
    - Use browser confirm() or create custom dialog
    - Ensure store deletion only happens after confirmation

13. **Implement edit functionality**
    - Reuse import dialogs for editing (pre-populate with existing data)
    - Or create simpler edit dialog for name/description only
    - Update store with edited data

14. **Responsive design verification**
    - Test on mobile (single column)
    - Test on tablet (2 columns)
    - Test on desktop (3 columns)
    - Ensure buttons and cards resize appropriately

15. **Accessibility check**
    - Add proper ARIA labels
    - Ensure keyboard navigation works
    - Check color contrast
    - Test with screen reader (if available)

### Phase 6: Testing and Validation
16. **Type checking**
    - Run `npm run type-check`
    - Fix any TypeScript errors

17. **Lint and format**
    - Run `npm run lint`
    - Run `npm run format`
    - Fix any style issues

18. **Manual testing**
    - Test navigation to/from knowledge base page
    - Test opening each import dialog
    - Test form validation for each dialog type
    - Test creating new knowledge bases
    - Test editing knowledge bases
    - Test deleting knowledge bases
    - Test empty states (no knowledge bases)

19. **OpenSpec validation**
    - Run `npx openspec validate add-knowledge-base-page --strict`
    - Fix any validation errors

## Dependencies
- Task 1 must complete before Task 2 (types needed for store)
- Task 2 must complete before Task 5 (store needed for page)
- Task 4 must complete before Task 5 (card needed for page)
- Tasks 6, 7, 8 can be done in parallel (import dialogs are independent)
- Tasks 9, 10 depend on Task 5 (navigation needs page component)

## Definition of Done
- [x] All tasks completed
- [x] Type checking passes (no new errors introduced)
- [x] Linting passes (no new errors introduced)
- [x] OpenSpec validation passes
- [x] Can navigate to Knowledge Base page
- [x] Can open all three import dialogs
- [x] Can create mock knowledge bases of each type
- [x] Knowledge bases display in correct sections
- [x] Can edit knowledge base name/description
- [x] Can delete knowledge bases
- [x] Responsive on mobile, tablet, desktop
