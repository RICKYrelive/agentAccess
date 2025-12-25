# Proposal: enhance-knowledge-base-multiple-sources

## Summary
Enhance the Knowledge Base feature to support multiple source files for text and spreadsheet knowledge bases, and multiple table selection for database knowledge bases.

## Motivation
Currently, each knowledge base can only contain a single source file or table. This limits users' ability to organize related content:
- Users cannot group multiple related documents (e.g., all product manuals) into one knowledge base
- Users cannot combine multiple spreadsheet files (e.g., monthly sales data) into one knowledge base
- Database knowledge bases can only query from a single table

## Proposed Solution
1. **Text and Spreadsheet Knowledge Bases**: Allow uploading and managing multiple source files per knowledge base
2. **Database Knowledge Bases**: Allow selecting multiple tables from the database connection

### Key Changes
- Update data model to support multiple sources (files array for text/spreadsheet, tables array for database)
- Update import dialogs to support multiple file upload (with drag-and-drop)
- Create edit dialogs that allow adding/removing sources
- Update knowledge base cards to display all sources
- Maintain backward compatibility with existing single-source knowledge bases

## Scope
### In Scope
- Data model changes for multiple sources
- Import dialog updates for multi-file selection
- Edit dialog enhancements for source management
- Card display updates to show all sources
- Migration logic for existing single-source knowledge bases

### Out of Scope
- Actual file processing/parsing (still UI-only)
- Real database connections (still mock)
- File content preview
- Advanced file organization (folders, tags)

## Success Criteria
- Users can upload multiple files when creating text/spreadsheet knowledge bases
- Users can select multiple tables when creating database knowledge bases
- Knowledge base cards display all source files or tables
- Edit dialogs allow adding/removing sources (with minimum 1 source requirement)
- Existing single-source knowledge bases continue to work
