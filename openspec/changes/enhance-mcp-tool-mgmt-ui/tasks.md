# Implementation Tasks

## Overview
This document outlines the implementation tasks for enhancing the MCP Tool Management page UI with status cards, redesigned tool sources, and an active tools table.

## Tasks

### 1. Create Status Overview Cards Component
- [ ] Create `MCPStatusCards.vue` component in `src/components/mcp-management/`
- [ ] Implement three status cards: Active Tools, Usage Today, System Status
- [ ] Add glass-panel styling (semi-transparent background with blur)
- [ ] Add responsive grid layout (1 column mobile, 3 columns desktop)
- [ ] Implement active tool count calculation from store
- [ ] Add system status logic based on tool states
- [ ] Add placeholder for usage metrics (N/A until backend support)

### 2. Create Tool Sources Buttons Component
- [ ] Create `ToolSourcesSection.vue` component in `src/components/mcp-management/`
- [ ] Implement three action buttons: Import Definition, Connect Database, Custom Function
- [ ] Apply consistent dashed border styling with hover effects
- [ ] Add icons for each button type (upload, database, code)
- [ ] Wire up Import Definition button to existing `OpenAPIImportDialog`
- [ ] Wire up Custom Function button to existing `CustomToolConfigDialog`

### 3. Create Database Connection Dialog Component
- [ ] Create `DatabaseConnectionDialog.vue` component in `src/components/mcp-management/`
- [ ] Add form fields: database type (select), host, port, username, password, database name
- [ ] Implement "Test Connection" functionality
- [ ] Add form validation
- [ ] Store database configuration securely in MCP tool store
- [ ] Add to MCP management store actions for creating database tools

### 4. Create Active Tools Table Component
- [ ] Create `ActiveToolsTable.vue` component in `src/components/mcp-management/`
- [ ] Implement table with columns: Name, Type, Status, Latency, Last Sync, Actions
- [ ] Add status badge component with color coding
- [ ] Implement type-specific icons and colors
- [ ] Add actions dropdown menu (Edit, Enable/Disable, Test, Delete)
- [ ] Add horizontal scroll for mobile responsiveness
- [ ] Add sticky table header

### 5. Create Filter and Search Controls
- [ ] Create `ToolSearchFilter.vue` component (update if exists)
- [ ] Implement search input for tool name filtering
- [ ] Implement filter dropdown for type and status
- [ ] Add filter state management to MCP store

### 6. Update MCP Management Store
- [ ] Add `activeToolsCount` computed property
- [ ] Add `systemStatus` computed property (Operational/Degraded/Offline)
- [ ] Add `usageMetrics` state (placeholder for future backend integration)
- [ ] Add `createDatabaseTool` action
- [ ] Add table filtering state (search query, type filter, status filter)
- [ ] Add tool latency tracking state
- [ ] Add last sync timestamp tracking

### 7. Refactor MCPToolsPage Component
- [ ] Replace card grid with status cards section
- [ ] Replace colored creation buttons with ToolSourcesSection component
- [ ] Replace tools display with ActiveToolsTable component
- [ ] Update page header styling to match reference design
- [ ] Ensure responsive layout across all screen sizes
- [ ] Test all CRUD operations still work (create, edit, delete, toggle)

### 8. Update MCP Tool Types
- [ ] Extend `MCPToolType` in `src/components/mcp-management/types.ts`
- [ ] Add 'database' type for database connections
- [ ] Add optional fields: latency, lastSync, usageCount
- [ ] Update type-to-display-name mapping function

### 9. Add Utility Functions
- [ ] Create `formatRelativeTime()` utility for Last Sync column
- [ ] Create `formatLatency()` utility for Latency column
- [ ] Create `getStatusBadgeColor()` utility for status badges
- [ ] Create `getToolTypeIcon()` utility for type icons

### 10. Add Styling
- [ ] Add glass-panel CSS class to global styles or component
- [ ] Ensure dark mode compatibility for all new components
- [ ] Add hover states and transitions
- [ ] Add animated pulse for system status indicator

### 11. Update Navigation and Routing
- [ ] Ensure MCP Tools page route is properly configured
- [ ] Verify sidebar navigation highlights correctly

### 12. Testing
- [ ] Test status cards display correct counts
- [ ] Test tool sources buttons open correct dialogs
- [ ] Test database connection dialog (create, test, cancel)
- [ ] Test active tools table displays all tools correctly
- [ ] Test search and filter functionality
- [ ] Test all tool actions (edit, enable/disable, delete)
- [ ] Test responsive layout on mobile, tablet, desktop
- [ ] Test dark mode styling
- [ ] Type-check with `npm run type-check`
- [ ] Lint with `npm run lint`

## Dependencies
- Task 3 depends on Task 6 (store updates for database tools)
- Task 4 depends on Task 6 (store updates for filtering)
- Task 7 depends on Tasks 1, 2, 4 (all components created)
- Task 12 (testing) depends on all implementation tasks

## Validation Checklist
- [ ] All spec delta requirements are implemented
- [ ] All existing MCP tool functionality is preserved
- [ ] Page is responsive on all screen sizes
- [ ] Dark mode works correctly
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] `openspec validate --strict` passes
