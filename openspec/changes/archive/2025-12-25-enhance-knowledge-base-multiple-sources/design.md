# Design: enhance-knowledge-base-multiple-sources

## Data Model Changes

### Current Model
```typescript
interface KnowledgeBaseSourceInfo {
  // Single file info
  fileType?: string
  fileName?: string
  fileSize?: number
  // Single database table
  dbType?: DatabaseType
  host?: string
  port?: number
  database?: string
  table?: string
}
```

### New Model
```typescript
interface FileInfo {
  id: string
  fileType: string
  fileName: string
  fileSize: number
  addedAt: Date
}

interface DatabaseConnectionInfo {
  dbType: DatabaseType
  host: string
  port: number
  username: string
  database: string
}

interface KnowledgeBaseSourceInfo {
  // Multiple files for text/spreadsheet
  files?: FileInfo[]
  // Database connection with multiple tables
  connection?: DatabaseConnectionInfo
  tables?: string[]
}
```

## Component Architecture

### 1. Import Dialogs Enhancement
- **TextImportDialog**: Change file input to `multiple` attribute
- **SpreadsheetImportDialog**: Change file input to `multiple` attribute
- **DatabaseImportDialog**: Change table dropdown to multi-select

### 2. Edit Dialogs Enhancement
- **EditTextKnowledgeBaseDialog**: New dialog for managing text knowledge base sources
- **EditSpreadsheetKnowledgeBaseDialog**: New dialog for managing spreadsheet knowledge base sources
- **EditDatabaseKnowledgeBaseDialog**: New dialog for managing database knowledge base tables

### 3. Card Display Updates
- **KnowledgeBaseCard**:
  - Display list of all files (name + size)
  - Display list of all database tables
  - Show file count when too many to display
  - Add scrollable area for long lists

## Migration Strategy

### Backward Compatibility
When loading existing knowledge bases:
- If `fileName` exists (old format), convert to `files: [{id, fileName, ...}]`
- If `table` exists (old format), convert to `tables: [table]`

### Store Migration
```typescript
const migrateKnowledgeBase = (kb: any): KnowledgeBase => {
  if (kb.sourceInfo.fileName && !kb.sourceInfo.files) {
    // Migrate single file to files array
    kb.sourceInfo.files = [{
      id: `file-${Date.now()}`,
      fileType: kb.sourceInfo.fileType,
      fileName: kb.sourceInfo.fileName,
      fileSize: kb.sourceInfo.fileSize,
      addedAt: kb.createdAt
    }]
    delete kb.sourceInfo.fileType
    delete kb.sourceInfo.fileName
    delete kb.sourceInfo.fileSize
  }
  if (kb.sourceInfo.table && !kb.sourceInfo.tables) {
    // Migrate single table to tables array
    kb.sourceInfo.tables = [kb.sourceInfo.table]
    delete kb.sourceInfo.table
  }
  return kb
}
```

## UI/UX Considerations

### File Upload
- Use drag-and-drop zone for multiple files
- Show file list with individual remove buttons before submission
- Display total size and file count
- Validate each file individually

### Source Management in Edit Dialog
- Display current sources in a list
- Each source has a remove button
- "Add more files" button to upload additional files
- Prevent removing last source (minimum 1 required)
- Confirmation dialog before removing sources

### Database Table Selection
- Multi-select dropdown or checkbox list
- Show table count
- Display selected tables as tags/chips

## State Management Updates

### Store Actions
- `addFileToKnowledgeBase(id, file)`
- `removeFileFromKnowledgeBase(id, fileId)`
- `addTableToKnowledgeBase(id, table)`
- `removeTableFromKnowledgeBase(id, table)`

### Validation
- Text/Spreadsheet: Must have at least 1 file
- Database: Must have at least 1 table selected
- Max files limit: 50 (configurable)
- Max tables limit: 20 (configurable)
