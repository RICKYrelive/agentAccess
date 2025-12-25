# Design: add-knowledge-base-page

## Architecture Overview

### Component Structure
```
src/components/knowledge-base/
├── KnowledgeBasePage.vue          # Main page component
├── KnowledgeBaseCard.vue          # Individual knowledge base card
├── import-dialogs/
│   ├── TextImportDialog.vue       # Text file import modal
│   ├── SpreadsheetImportDialog.vue # Spreadsheet import modal
│   └── DatabaseImportDialog.vue   # Database import modal
```

### Store Structure
```
src/stores/knowledgeBase.ts
```

### Type Definitions
```
src/types/knowledge-base.ts
```

## Component Design

### KnowledgeBasePage.vue
**Purpose**: Main container for knowledge base management

**State**:
- `isImportDialogOpen`: boolean (which dialog is open)
- `knowledgeBases`: array from store

**Methods**:
- `openImportDialog(type)`: Opens appropriate import dialog
- `handleImport(data)`: Creates new knowledge base from form data
- `handleEdit(id)`: Opens edit dialog for knowledge base
- `handleDelete(id)`: Deletes knowledge base after confirmation

**Template Structure**:
```vue
<template>
  <div class="h-full bg-white overflow-y-auto p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">知识库管理</h1>
    </div>

    <!-- Creation Section -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <!-- Text Import Button -->
      <button @click="openImportDialog('text')">
        <!-- Icon and label -->
      </button>
      <!-- Spreadsheet Import Button -->
      <button @click="openImportDialog('spreadsheet')">
        <!-- Icon and label -->
      </button>
      <!-- Database Import Button -->
      <button @click="openImportDialog('database')">
        <!-- Icon and label -->
      </button>
    </div>

    <!-- Text Knowledge Bases Section -->
    <section class="mb-8">
      <h2>文本知识库</h2>
      <div class="grid">
        <KnowledgeBaseCard
          v-for="kb in textKnowledgeBases"
          :key="kb.id"
          :knowledge-base="kb"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>
    </section>

    <!-- Spreadsheet Knowledge Bases Section -->
    <section class="mb-8">
      <h2>表格知识库</h2>
      <div class="grid">
        <KnowledgeBaseCard ... />
      </div>
    </section>

    <!-- Database Knowledge Bases Section -->
    <section class="mb-8">
      <h2>数据库知识库</h2>
      <div class="grid">
        <KnowledgeBaseCard ... />
      </div>
    </section>

    <!-- Import Dialogs -->
    <TextImportDialog v-if="importDialogType === 'text'" @submit="handleImport" @close="closeDialog" />
    <SpreadsheetImportDialog v-if="importDialogType === 'spreadsheet'" @submit="handleImport" @close="closeDialog" />
    <DatabaseImportDialog v-if="importDialogType === 'database'" @submit="handleImport" @close="closeDialog" />
  </div>
</template>
```

### KnowledgeBaseCard.vue
**Purpose**: Display individual knowledge base with actions

**Props**:
- `knowledgeBase`: object (id, name, description, type, createdAt, sourceInfo)

**Emits**:
- `edit`: Emitted when edit button clicked
- `delete`: Emitted when delete button clicked

**Template**:
```vue
<template>
  <div class="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <div class="flex items-center space-x-2 mb-2">
          <h3 class="font-semibold text-gray-900">{{ knowledgeBase.name }}</h3>
          <span class="badge">{{ typeLabel }}</span>
        </div>
        <p class="text-sm text-gray-600 mb-2">{{ knowledgeBase.description }}</p>
        <div class="text-xs text-gray-500">
          创建时间: {{ formatDate(knowledgeBase.createdAt) }}
        </div>
      </div>
      <div class="flex space-x-2">
        <button @click="$emit('edit', knowledgeBase.id)">编辑</button>
        <button @click="$emit('delete', knowledgeBase.id)">删除</button>
      </div>
    </div>
  </div>
</template>
```

### Import Dialogs

#### TextImportDialog.vue
**Form Fields**:
1. Knowledge base name (text input, required)
2. Description (textarea, optional)
3. File upload (file input, accepts: .pdf,.docx,.txt)
4. Encoding (select: UTF-8, GBK, GB2312, optional)
5. Language (select: 中文, English, optional)

**Validation**:
- Name required (max 100 chars)
- File required (max 10MB)
- Valid file extension

#### SpreadsheetImportDialog.vue
**Form Fields**:
1. Knowledge base name (text input, required)
2. Description (textarea, optional)
3. File upload (file input, accepts: .xlsx,.xls,.csv)
4. Sheet selection (select, populated after file parse - for Excel)
5. Has header row (toggle: yes/no)
6. Encoding (select: UTF-8, GBK, GB2312 - for CSV)

**Validation**:
- Name required (max 100 chars)
- File required (max 50MB)
- Valid file extension

#### DatabaseImportDialog.vue
**Form Fields**:
1. Knowledge base name (text input, required)
2. Description (textarea, optional)
3. Database type (select: MySQL, PostgreSQL)
4. Host (text input, required)
5. Port (number input, required, auto-filled based on type)
6. Username (text input, required)
7. Password (password input, required)
8. Database name (text input, required)
9. Table selection (select, disabled until connection tested)
10. Connection test button

**Validation**:
- Name required (max 100 chars)
- Host required (valid hostname/IP)
- Port required (1-65535)
- Username required
- Password required
- Database name required

**Flow**:
1. User fills connection details
2. Clicks "Test Connection"
3. On success, populate table dropdown
4. User selects table
5. Submit creates knowledge base

## Store Design

### knowledgeBase.ts (Pinia Store)

**State**:
```typescript
interface KnowledgeBase {
  id: string
  name: string
  description: string
  type: 'text' | 'spreadsheet' | 'database'
  sourceInfo: {
    fileType?: string
    fileName?: string
    dbType?: string
    host?: string
    port?: number
    database?: string
    table?: string
  }
  createdAt: Date
  updatedAt: Date
}

state: {
  knowledgeBases: KnowledgeBase[]
  isLoading: boolean
}
```

**Actions**:
- `createKnowledgeBase(data)`: Add new knowledge base
- `updateKnowledgeBase(id, data)`: Update existing
- `deleteKnowledgeBase(id)`: Remove knowledge base
- `testDatabaseConnection(config)`: Mock connection test (always success)

**Getters**:
- `textKnowledgeBases`: Filter by type='text'
- `spreadsheetKnowledgeBases`: Filter by type='spreadsheet'
- `databaseKnowledgeBases`: Filter by type='database'

## Navigation Integration

### SidebarNavigation.vue
**Changes**:
1. Make "知识库" menu item clickable
2. Add view state for 'knowledge-base'
3. Remove hardcoded knowledge base array (use store instead)

**Before**:
```vue
<button @click="toggleKnowledgeBase">知识库</button>
<div v-if="isKnowledgeBaseOpen">
  <div v-for="kb in knowledgeBases">{{ kb.name }}</div>
</div>
```

**After**:
```vue
<button @click="handleKnowledgeBaseClick">知识库</button>
<!-- Remove submenu, navigate to dedicated page -->
```

### AppLayout.vue
**Changes**:
1. Add 'knowledge-base' to activeView type
2. Add KnowledgeBasePage component rendering

```vue
<activeView: 'home' | 'workflow' | 'my-agents' | 'team-agents' | 'team-detail' | 'knowledge-base'>

<!-- Knowledge Base Page View -->
<KnowledgeBasePage
  v-else-if="activeView === 'knowledge-base'"
  class="flex-1 h-full overflow-hidden"
/>
```

## Design Patterns

### Modal Pattern
All import dialogs follow consistent pattern:
- Overlay with backdrop blur
- Centered card with title
- Form with validation
- Action buttons (Cancel, Submit)
- Close on backdrop click or ESC key

### Form Validation
- Use reactive validation state
- Show error messages below fields
- Disable submit until valid
- Clear errors on input change

### Loading States
- Show spinner during "processing"
- Disable form during submit
- Show success/error toasts

### Responsive Design
- Single column on mobile
- 2 columns on tablet
- 3 columns on desktop (for import buttons and cards)

## Mock Data Strategy

Since actual import is out of scope:
- File upload creates mock knowledge base entry
- Database connection test always succeeds
- Table selection shows mock table names
- No actual file parsing or DB queries
- Store knowledge bases in memory (persist to localStorage for demo)
