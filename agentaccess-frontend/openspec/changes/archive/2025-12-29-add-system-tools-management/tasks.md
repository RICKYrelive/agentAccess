# Tasks: Add System Tools Management

## Phase 1: Infrastructure Setup

### 1.1 Create store and types
- [ ] Create `src/stores/systemTools.ts` with initial state structure
- [ ] Create `src/components/system-tools/types.ts` with TypeScript interfaces
- [ ] Add mock data for sandbox types and built-in tools
- [ ] Set up resource usage simulation logic

### 1.2 Update navigation structure
- [ ] Modify `src/components/layout/SidebarNavigation.vue`
- [ ] Add "System Tools" expandable section
- [ ] Add "Sandboxed Environments" sub-menu item
- [ ] Add "Built-in Tools" sub-menu item
- [ ] Implement navigation state management

## Phase 2: Sandboxed Environments Page

### 2.1 Create page layout
- [ ] Create `src/components/system-tools/SandboxedEnvironmentsPage.vue`
- [ ] Implement page header with gradient background
- [ ] Add "创建沙箱" button
- [ ] Match styling to MCP Tools page

### 2.2 Create status cards component
- [ ] Create `src/components/system-tools/SandboxStatusCards.vue`
- [ ] Implement "沙箱类型" card
- [ ] Implement "运行实例" card
- [ ] Implement "资源使用" card with CPU/Memory/Disk
- [ ] Add real-time update simulation

### 2.3 Create sandbox card component
- [ ] Create `src/components/system-tools/SandboxCard.vue`
- [ ] Display sandbox name and status indicator
- [ ] Display instance count
- [ ] Add delete button with confirmation
- [ ] Implement expand/collapse for instance list

### 2.4 Create instance list component
- [ ] Create `src/components/system-tools/SandboxInstanceList.vue`
- [ ] Display list of instances for a sandbox type
- [ ] Show resource usage per instance
- [ ] Add delete button per instance
- [ ] Implement status indicators

## Phase 3: Built-in Tools Page

### 3.1 Create page layout
- [ ] Create `src/components/system-tools/BuiltInToolsPage.vue`
- [ ] Implement page header
- [ ] Add "导入内置工具" button
- [ ] Match styling to existing pages

### 3.2 Create tool card component
- [ ] Create `src/components/system-tools/BuiltInToolCard.vue`
- [ ] Display tool icon, name, and description
- [ ] Add category badge
- [ ] Implement enable/disable toggle switch
- [ ] Add status indicator

### 3.3 Implement tool categorization
- [ ] Add category grouping logic
- [ ] Display tools by category sections
- [ ] Show tool count per category
- [ ] Implement category filtering

## Phase 4: Official Store Dialog

### 4.1 Create dialog component
- [ ] Create `src/components/system-tools/OfficialStoreDialog.vue`
- [ ] Implement Teleport to body
- [ ] Set up dialog size and layout
- [ ] Add overlay with click-to-close

### 4.2 Implement search functionality
- [ ] Add search input at top of dialog
- [ ] Implement search filtering logic
- [ ] Filter by name, description, category, tags
- [ ] Support case-insensitive search

### 4.3 Create tab navigation
- [ ] Implement "Sandboxes" and "Built-in Tools" tabs
- [ ] Add tab switching logic
- [ ] Clear search when switching tabs
- [ ] Style active tab state

### 4.4 Create store item list
- [ ] Create compact list item component
- [ ] Display icon, name, description for each item
- [ ] Add category badge
- [ ] Implement install/import button
- [ ] Handle "already installed" state

## Phase 5: Integration & Polish

### 5.1 Connect store to components
- [ ] Wire up state management in all components
- [ ] Implement create/delete operations
- [ ] Implement enable/disable operations
- [ ] Add loading and error states

### 5.2 Add animations and transitions
- [ ] Add page transition animations
- [ ] Add card hover effects
- [ ] Add dialog open/close animations
- [ ] Add toggle switch animation

### 5.3 Implement empty states
- [ ] Create empty state for no sandboxes
- [ ] Create empty state for no built-in tools
- [ ] Create empty state for no search results
- [ ] Add calls-to-action in empty states

### 5.4 Resource monitoring simulation
- [ ] Implement real-time resource usage updates
- [ ] Add "Live" indicator
- [ ] Simulate resource fluctuation
- [ ] Update every 5-10 seconds

### 5.5 Responsive design
- [ ] Test on different screen sizes
- [ ] Adjust card layouts for mobile
- [ ] Make dialog responsive
- [ ] Test sidebar navigation on mobile

## Phase 6: Testing & Validation

### 6.1 Type checking
- [ ] Run `npm run type-check`
- [ ] Fix any TypeScript errors

### 6.2 Linting
- [ ] Run `npm run lint`
- [ ] Fix any ESLint warnings

### 6.3 Manual testing
- [ ] Test all navigation flows
- [ ] Test sandbox create/delete flows
- [ ] Test built-in tool import/enable/disable flows
- [ ] Test search functionality
- [ ] Test responsive design

### 6.4 OpenSpec validation
- [ ] Run `openspec validate add-system-tools-management --strict`
- [ ] Fix any validation errors

## Dependencies & Sequencing

- Phase 1 MUST be completed before all other phases
- Phase 2 and Phase 3 can be done in parallel
- Phase 4 depends on Phase 1 completion
- Phase 5 requires Phase 2, 3, and 4 to be complete
- Phase 6 is the final phase after all implementation

## Estimated Effort

- Phase 1: 2-3 hours
- Phase 2: 4-5 hours
- Phase 3: 3-4 hours
- Phase 4: 3-4 hours
- Phase 5: 3-4 hours
- Phase 6: 1-2 hours

**Total Estimated Time**: 16-22 hours
