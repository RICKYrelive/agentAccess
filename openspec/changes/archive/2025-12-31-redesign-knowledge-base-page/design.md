# Knowledge Base Page Redesign - Design Document

## Overview
This document describes the technical design for redesigning the Knowledge Base management page to match a modern dashboard-style reference interface.

## Current Architecture

### Existing Components
```
KnowledgeBasePage.vue
├── Header (title + description)
├── Category Tabs (我创建的 / 团队知识库)
├── Team Filter Dropdown (when team tab selected)
├── Creation Section (3 buttons)
└── Type Sections (separated by type)
    ├── Text Knowledge Bases Section
    ├── Spreadsheet Knowledge Bases Section
    └── Database Knowledge Bases Section
```

### Data Flow
```
useKnowledgeBaseStore
├── State
│   ├── knowledgeBases: KnowledgeBase[]
│   ├── personalKnowledgeBases (computed)
│   └── teamKnowledgeBases (computed)
└── Actions
    ├── createFromTextImport
    ├── createFromSpreadsheetImport
    ├── createFromDatabaseImport
    ├── updateKnowledgeBase
    └── deleteKnowledgeBase
```

## New Design Architecture

### Page Layout Structure
```
KnowledgeBasePage.vue
├── Enhanced Header Section
│   ├── Large gradient title
│   ├── Subtitle description
│   └── Decorative background element
├── Status Statistics Bar
│   ├── Total Documents Card
│   ├── Storage Used Card
│   └── Sync Status Card
├── Creation Actions (3 cards)
│   ├── Upload Files
│   ├── Connect Database
│   └── Paste Text
├── Table Section
│   ├── Filter & Search Bar
│   └── Unified Knowledge Base Table
│       ├── Name Column
│       ├── Type Column (badge)
│       ├── Status Column (badge)
│       ├── Size/Tables Column
│       ├── Date Column
│       └── Actions Column
```

### Component Structure

#### New Components to Create
1. **StatisticsCard.vue** - Reusable stat card component
   - Props: icon, label, value, unit, badge?
   - Displays icon, label, large value, optional unit/badge

2. **KnowledgeBaseTable.vue** - Main table component
   - Props: knowledgeBases, filters, sort
   - Emits: edit, delete, sync, view
   - Features: search, filter, sort, pagination (future)

#### Components to Modify
1. **KnowledgeBasePage.vue** - Complete restructure
   - Remove category tabs
   - Remove separate sections
   - Add statistics bar
   - Add unified table view

2. **useKnowledgeBaseStore** - Add statistics computed properties
   - totalDocumentCount
   - totalStorageUsed
   - overallSyncStatus

## Data Model Extensions

### Statistics Type
```typescript
interface KnowledgeBaseStatistics {
  totalDocuments: number
  totalStorageBytes: number
  totalStorageFormatted: string  // e.g., "1.2 MB"
  syncStatus: 'synced' | 'syncing' | 'error'
  lastSyncTime?: Date
}
```

### Table Display Model
```typescript
interface KnowledgeBaseTableRow {
  id: string
  name: string
  type: 'text' | 'spreadsheet' | 'database'
  status: 'ready' | 'processing' | 'syncing' | 'error'
  sizeInfo: string  // e.g., "459 KB" or "3 tables"
  sourceCount: number  // files or tables
  createdAt: Date
  category: 'personal' | 'team'
  owner: string
}
```

## UI/UX Specifications

### Color Scheme (Matching Reference)
- **Primary Blue**: #2563EB (Royal Blue)
- **Success Green**: #10B981 (Emererald)
- **Processing Blue**: #3B82F6 (Blue)
- **Error Red**: #EF4444 (Red)
- **Background**: Gray-50 to Gray-100
- **Cards**: White with subtle shadows

### Type Badge Styles
```typescript
const typeBadgeConfig = {
  text: {
    label: '文本',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    icon: 'description'
  },
  spreadsheet: {
    label: '表格',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    icon: 'table_view'
  },
  database: {
    label: '数据库',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    icon: 'dns'
  }
}
```

### Status Badge Styles
```typescript
const statusBadgeConfig = {
  ready: {
    label: '已就绪',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-700',
    dotColor: 'bg-emerald-500'
  },
  processing: {
    label: '处理中',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    spinning: true
  },
  syncing: {
    label: '同步中',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-700',
    spinning: true
  },
  error: {
    label: '错误',
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    dotColor: 'bg-red-500'
  }
}
```

### Statistics Card Design
```
┌─────────────────────────────────┐
│  [ICON]  Total Documents    ┊   │
│                                  │
│     14        files              │
│                                  │
└─────────────────────────────────┘
```

### Table Design
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Documents 14               [Filter] [Search...................]               │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAME                    │ TYPE    │ STATUS  │ SIZE      │ DATE       │     │
├──────────────────────────────────────────────────────────────────────────────┤
│ [icon] pricing_tier...  │ 表格    │ ●就绪   │ 459 KB    │ Oct 24     │ ⋯   │
│ [icon] product_specs    │ 文本    │ ◎处理中 │ 2.4 MB    │ 2 mins     │ ⋯   │
│ [icon] PostgreSQL DB    │ 数据库  │ ●就绪   │ 3 tables  │ Oct 20     │ ⋯   │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Implementation Considerations

### Performance
- Table should handle 100+ knowledge bases efficiently
- Consider virtual scrolling for very large datasets
- Lazy load table rows if needed

### Responsive Design
- Desktop: Full table with all columns
- Tablet: Scrollable table, hide less important columns
- Mobile: Card-based view or horizontal scroll

### Accessibility
- Proper ARIA labels for table
- Keyboard navigation for table rows
- High contrast mode support
- Screen reader compatible status indicators

### State Management
- Filters and search state managed in component
- Sorting state managed in component
- Pagination state (if added) managed in component

## Migration Strategy

### Phase 1: Statistics & Layout
1. Add computed statistics properties to store
2. Create StatisticsCard component
3. Add statistics bar to KnowledgeBasePage
4. Keep existing card sections below

### Phase 2: Table Component
1. Create KnowledgeBaseTable component
2. Implement basic table structure
3. Add type and status badges
4. Test with sample data

### Phase 3: Integration
1. Replace card sections with table
2. Implement search and filter
3. Add action menu
4. Test all operations

### Phase 4: Polish
1. Refine styling to match reference
2. Add animations and transitions
3. Optimize performance
4. Final testing

## Open Questions
1. Should we keep category filtering (personal/team) or move it to table filter?
   - **Decision**: Keep category tabs for now, can be moved to table filter later

2. Should pagination be added immediately?
   - **Decision**: No pagination initially, add if performance issues arise

3. Should team selection be integrated into table filters?
   - **Decision**: Yes, show team filter dropdown in table toolbar when in team mode

4. How to handle database knowledge base "size" display?
   - **Decision**: Show table count instead of file size (e.g., "3 tables")
