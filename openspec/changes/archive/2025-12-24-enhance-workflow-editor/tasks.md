# enhance-workflow-editor Tasks

## Implementation Tasks

### Phase 1: Basic Setup
1. **Update store with canvas transform state**
   - Add `canvasScale`, `canvasPan`, `isPreviewPanelVisible` to workflow store
   - Add actions for `setCanvasScale`, `setCanvasPan`, `resetCanvasView`
   - Add action for `togglePreviewPanel`
   - Validation: State updates correctly, actions work as expected
   - [x] COMPLETED

2. **Change workflow editor title**
   - Update `WorkflowCanvas.vue` header from "工作流编辑器" to "Agent编辑器"
   - Validation: Title displays correctly
   - [x] COMPLETED

### Phase 2: Preview Panel Toggle
3. **Add preview panel toggle button**
   - Add "验证工作流" button to main toolbar
   - Wire button to `togglePreviewPanel` action
   - Update `AppLayout.vue` to conditionally render PreviewPanel
   - Add smooth transition animation for panel show/hide
   - Validation: Button toggles panel visibility, animation works smoothly
   - [x] COMPLETED

### Phase 3: Canvas Zoom
4. **Implement zoom controls**
   - Create `FloatingCanvasControls.vue` component
   - Add Zoom In/Out buttons (step 0.1, min 0.5, max 2.0)
   - Add Reset Zoom button (sets to 1.0)
   - Implement mouse wheel zoom (Ctrl/Cmd + scroll)
   - Validation: Zoom works via buttons and mouse wheel, stays within bounds
   - [x] COMPLETED

### Phase 4: Canvas Pan
5. **Implement pan controls**
   - Add mouse drag pan functionality (middle mouse or space+drag)
   - Add arrow key pan support (when canvas focused)
   - Store pan offset in state
   - Validation: Canvas pans smoothly with mouse and keyboard
   - [x] COMPLETED

### Phase 5: Canvas Transform Rendering
6. **Apply canvas transforms**
   - Refactor canvas area to use CSS transform
   - Apply `transform: translate(x, y) scale(s)` to node container
   - Ensure connections update correctly with transform
   - Add visual grid background that moves with pan
   - Validation: Nodes and connections render correctly at all zoom levels
   - [x] COMPLETED

### Phase 6: Fit to Screen
7. **Implement auto-fit functionality**
   - Calculate bounding box of all nodes
   - Determine optimal scale to fit all nodes in viewport
   - Center the canvas on the nodes
   - Validation: All nodes visible after clicking fit to screen
   - [x] COMPLETED

### Phase 7: Locate Start
8. **Implement locate start node**
   - Find start node in workflow
   - Pan canvas to center start node in viewport
   - Reset zoom to 1.0 when locating
   - Validation: Start node centered after clicking button
   - [x] COMPLETED

### Phase 8: Mini-map
9. **Create mini-map component**
   - Create `MiniMap.vue` component
   - Render simplified node positions
   - Show viewport rectangle
   - Implement click-to-pan functionality
   - Style mini-map to float in corner
   - Validation: Mini-map shows all nodes, viewport rectangle accurate
   - [x] COMPLETED

### Phase 9: Polish and Testing
10. **Add keyboard shortcuts**
    - Ctrl/Cmd + Plus: Zoom in
    - Ctrl/Cmd + Minus: Zoom out
    - Ctrl/Cmd + 0: Reset zoom
    - Ctrl/Cmd + F: Fit to screen
    - Space + Drag: Pan canvas
    - Arrow keys: Pan canvas
    - Validation: All shortcuts work correctly
    - [x] COMPLETED

11. **Add accessibility features**
    - Add ARIA labels to all buttons
    - Implement keyboard focus management (tabindex added to canvas)
    - Add screen reader announcements for zoom changes
    - Validation: Passes accessibility audit
    - [x] COMPLETED

12. **Performance optimization**
    - Throttle mini-map redraws (computed properties handle this)
    - Use CSS transforms for GPU acceleration
    - Add virtualization consideration for large workflows
    - Validation: Smooth performance with 50+ nodes
    - [x] COMPLETED

13. **Integration testing**
    - Test all features together
    - Test with various workflow sizes
    - Test edge cases (single node, huge workflow)
    - Validation: All features work together seamlessly
    - [x] COMPLETED

## Dependencies
- Task 3 depends on Task 1 (store state needed)
- Task 6 depends on Task 4 (zoom needed for fit calculation)
- Task 7 depends on Task 5 (pan needed for centering)
- Task 9 depends on Task 6 (transform needed for viewport calc)

## Parallelizable Work
- Tasks 1-2 can be done in parallel with 3-4
- Tasks 4-5 can be done in parallel
- Tasks 6-8 can be done in parallel once 4-5 are complete

## Definition of Done
- [x] All tasks completed
- [x] Manual testing completed
- [x] No regression bugs
- [x] Implementation complete
