# enhance-visual-style-stitch - Tasks

## Phase 1: Foundation Setup

- [x] **Task 1.1**: Update Tailwind Config
  - [ ] Add color system (primary, slate, surface, canvas)
  - [ ] Add border radius system
  - [ ] Add shadow system (card, floating, glow)
  - [ ] Add font family configuration (Space Grotesk)
  - **Validation**: Run `npm run dev` and verify no build errors
  - **Affected Files**: `tailwind.config.js`

- [x] **Task 1.2**: Load Google Fonts
  - [ ] Add Space Grotesk font link to index.html
  - [ ] Add Material Symbols Outlined
  - **Validation**: Open browser DevTools Network tab and confirm fonts loaded
  - **Affected Files**: `index.html`

- [x] **Task 1.3**: Create Global Styles
  - [ ] Create/update `globals.css` with CSS variables for transitions
  - [ ] Add scrollbar styling
  - [ ] Add utility classes (.hover-lift, .icon-scale, .transition-base)
  - [ ] Add keyframe animations (.animate-subtle-pulse)
  - **Validation**: Inspect element and verify styles applied
  - **Affected Files**: `src/assets/main.css` or `src/styles/globals.css`

## Phase 2: Layout Components

- [x] **Task 2.1**: Update AppLayout.vue
  - [ ] Update header styling (new color palette, shadows)
  - [ ] Update sidebar navigation (new hover states, transitions)
  - [ ] Apply new border radius and shadows
  - **Validation**: Visually inspect header and sidebar, test hover states
  - **Affected Files**: `src/components/layout/AppLayout.vue`

- [x] **Task 2.2**: Update ContentArea.vue
  - [ ] Update message input styling
  - [ ] Update send button (new primary color, shadows, hover effects)
  - [ ] Update config panel tabs and content
  - [ ] Apply new card styles
  - **Validation**: Test input focus states, button hover, tab switching
  - **Affected Files**: `src/components/layout/ContentArea.vue`

- [x] **Task 2.3**: Update ChatInterface.vue
  - [ ] Update message bubbles styling
  - [ ] Update send/stop button styling
  - [ ] Update tool call indicator styling
  - **Validation**: Send a message and verify all elements look correct
  - **Affected Files**: `src/components/chat/ChatInterface.vue`

## Phase 3: MCP Management Components

- [x] **Task 3.1**: Update MCPGatewayPage.vue
  - [ ] Apply new card styling to gateway cards
  - [ ] Update button styles (primary, secondary, icon buttons)
  - [ ] Update status badges
  - **Validation**: Test gateway creation, edit, delete flows
  - **Affected Files**: `src/components/mcp-management/MCPGatewayPage.vue`

- [x] **Task 3.2**: Update MCPToolsPage.vue
  - [ ] Apply new card styling to tool cards
  - [ ] Update filter/search styling
  - [ ] Update pagination styling
  - **Validation**: Test tool filtering and pagination
  - **Affected Files**: `src/components/mcp-management/MCPToolsPage.vue`

- [x] **Task 3.3**: Update Dialog Components
  - [ ] CreateGatewayDialog.vue - new dialog styling
  - [ ] OpenAPIImportDialog.vue - new dialog styling
  - [ ] LoadBalancerGroupDialog.vue - new dialog styling
  - **Validation**: Test opening/closing all dialogs
  - **Affected Files**: `src/components/mcp-management/*.vue`

- [x] **Task 3.4**: Update MCP Sub-components
  - [ ] LoadBalancerGroupCard.vue
  - [ ] SelectedToolsPane.vue
  - [ ] ToolList.vue
  - [ ] ToolSearchFilter.vue
  - **Validation**: Test all sub-components in context
  - **Affected Files**: `src/components/mcp-management/[Component].vue`

## Phase 4: Agent Components

- [x] **Task 4.1**: Update My Agents Page
  - [ ] Update agent card styling
  - [ ] Update create/edit form styling
  - [ ] Update search and filter styling
  - **Validation**: Test agent CRUD operations
  - **Affected Files**: `src/components/my-agents/*.vue`

- [x] **Task 4.2**: Update Team Agents Page
  - [ ] Update agent card styling
  - [ ] Update category badges
  - [ ] Update action buttons
  - **Validation**: Test team agent management
  - **Affected Files**: `src/components/team-agents/*.vue`

## Phase 5: Knowledge Base & Settings

- [x] **Task 5.1**: Update Knowledge Base Components
  - [ ] Update document list styling
  - [ ] Update upload area styling
  - [ ] Update progress indicators
  - **Validation**: Test document upload and listing
  - **Affected Files**: `src/components/knowledge-base/*.vue`

- [x] **Task 5.2**: Update Settings Page
  - [ ] Update form inputs and labels
  - [ ] Update tabs navigation
  - [ ] Update save/cancel buttons
  - **Validation**: Test settings save functionality
  - **Affected Files**: `src/components/settings/*.vue`

## Phase 6: Workflow Editor Components

- [x] **Task 6.1**: Update WorkflowCanvas.vue
  - [ ] Update canvas background grid styling
  - [ ] Update toolbar styling
  - [ ] Update button styles (save, export, sync)
  - [ ] Apply new node palette styling
  - **Validation**: Test canvas pan, zoom, and node dragging
  - **Affected Files**: `src/components/workflow/WorkflowCanvas.vue`

- [x] **Task 6.2**: Update WorkflowNode.vue
  - [ ] Update node base styling (rounded corners, shadows, spacing)
  - [ ] Update selected state styling
  - [ ] Update connection points styling
  - [ ] Apply new node type color scheme
  - **Validation**: Test node selection, dragging, and connection
  - **Affected Files**: `src/components/workflow/WorkflowNode.vue`

- [x] **Task 6.3**: Update Workflow Sub-components
  - [ ] NodeConfigPanel.vue - new panel styling
  - [ ] FloatingCanvasControls.vue - new floating button styling
  - [ ] MiniMap.vue - new mini map styling
  - [ ] PreviewPanel.vue - new preview panel styling
  - **Validation**: Test all sub-components in workflow context
  - **Affected Files**: `src/components/workflow/*.vue`

## Phase 7: Config Components

- [x] **Task 7.1**: Update Inline Config Components
  - [ ] MCPInlineConfig.vue
  - [ ] MemoryInlineConfig.vue
  - [ ] SystemToolsInlineConfig.vue
  - **Validation**: Test all config options in ContentArea
  - **Affected Files**: `src/components/config/*.vue`

## Phase 8: Polish & Review

- [x] **Task 8.1**: Icon System Unification
  - [ ] Replace any non-Material Symbol icons
  - [ ] Ensure consistent icon sizing
  - [ ] Add icon hover animations where appropriate
  - **Validation**: Visual check of all icons across the app
  - **Affected Files**: All component files

- [x] **Task 8.2**: Responsive Design Check
  - [ ] Test all pages on mobile (375px - 768px)
  - [ ] Test all pages on tablet (768px - 1024px)
  - [ ] Test all pages on desktop (1024px+)
  - **Validation**: Manual testing on different screen sizes
  - **Affected Files**: All layout components

- [x] **Task 8.3**: Accessibility Audit
  - [ ] Check color contrast ratios (aim for WCAG AA)
  - [ ] Test keyboard navigation
  - [ ] Verify focus indicators are visible
  - **Validation**: Use Lighthouse accessibility audit
  - **Affected Files**: All interactive components

- [x] **Task 8.4**: Cross-browser Testing
  - [ ] Test in Chrome/Edge
  - [ ] Test in Safari
  - [ ] Test in Firefox
  - **Validation**: Manual testing checklist
  - **Affected Files**: All components

- [x] **Task 8.5**: Final Visual Review
  - [ ] Compare with Stitch design references
  - [ ] Check consistency across all pages
  - [ ] Verify all animations are smooth
  - **Validation**: Stakeholder review and approval
  - **Affected Files**: All components

## Task Dependencies

```
Phase 1 (Foundation)
  ├─→ Phase 2 (Layout)
  │     ├─→ Phase 3 (MCP Management)
  │     ├─→ Phase 4 (Agents)
  │     ├─→ Phase 5 (Knowledge Base & Settings)
  │     ├─→ Phase 6 (Workflow Editor)
  │     └─→ Phase 7 (Config)
  └─→ Phase 8 (Polish)
```

## Parallelization Opportunities

- **Phase 3 tasks** can be done in parallel (3.1, 3.2, 3.3, 3.4)
- **Phase 4 tasks** can be done in parallel (4.1, 4.2)
- **Phase 5 tasks** can be done in parallel (5.1, 5.2)
- **Phase 6 (Workflow)** tasks can be done in parallel (6.1, 6.2, 6.3)
- **Phase 7** is independent and can run alongside Phases 3-6

## Estimated Effort

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Phase 1 | 3 | 2-3 hours |
| Phase 2 | 3 | 3-4 hours |
| Phase 3 | 4 | 4-5 hours |
| Phase 4 | 2 | 2-3 hours |
| Phase 5 | 2 | 2-3 hours |
| Phase 6 | 3 | 2-3 hours |
| Phase 7 | 1 | 1-2 hours |
| Phase 8 | 5 | 3-4 hours |
| **Total** | **23** | **19-27 hours** |

## Definition of Done

Each task is complete when:
- ✅ Code changes are implemented
- ✅ No console errors or warnings
- ✅ Visual regression check passes
- ✅ Functionality still works as expected
- ✅ Code has been committed with clear message

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking existing functionality | High | Test each component immediately after changes |
| Inconsistent application of styles | Medium | Use utility classes and Tailwind config |
| Performance regression | Low | Monitor bundle size and render times |
| Browser compatibility issues | Low | Test in major browsers during Phase 7 |
