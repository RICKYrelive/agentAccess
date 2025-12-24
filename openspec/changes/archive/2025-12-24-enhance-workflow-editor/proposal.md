# enhance-workflow-editor Proposal

## Summary
Enhance the workflow editor with improved navigation, canvas controls, and better preview panel management. This change focuses on user experience improvements to make the workflow editor more efficient and professional.

## Motivation
The current workflow editor has several usability issues:
1. The title "工作流编辑器" (Workflow Editor) should be renamed to "Agent编辑器" (Agent Editor) to better reflect the product's purpose
2. The canvas lacks navigation controls - users cannot pan, zoom, or easily navigate large workflows
3. The preview/test panel is always visible, taking up valuable screen space when not needed

## Proposed Solution

### 1. Title Change
- Change "工作流编辑器" to "Agent编辑器" in the workflow editor header

### 2. Canvas Navigation Controls
Add a floating toolbar with the following controls:
- **Zoom In**: Increase canvas scale (max 200%)
- **Zoom Out**: Decrease canvas scale (min 50%)
- **Fit to Screen**: Auto-scale canvas to fit all nodes
- **Reset Zoom**: Reset to 100% scale
- **Locate Start**: Pan to the start node
- **Mini-map**: Show thumbnail overview of the entire canvas

### 3. Preview Panel Toggle
- Add a "验证工作流" (Validate Workflow) button in the main toolbar
- When clicked, toggle the preview panel visibility
- This allows users to focus on editing without the preview panel taking up space

## Affected Specifications
- `ui-interface`: Updates to workflow editor requirements
- `frontend`: Updates to frontend implementation requirements

## Dependencies
- Vue 3 Composition API
- Pinia state management
- Existing workflow editor components

## Risks and Mitigations
- **Risk**: Canvas zoom/pan implementation may be complex
  - **Mitigation**: Use CSS transforms for zoom, implement pan with mouse drag events
- **Risk**: Mini-map may be performance-intensive for large workflows
  - **Mitigation**: Render mini-map at lower resolution, update only on significant changes
- **Risk**: Breaking existing user workflow
  - **Mitigation**: Keep preview panel visible by default, maintain existing functionality

## Success Criteria
- Title displays as "Agent编辑器"
- Canvas can be zoomed from 50% to 200%
- Canvas can be panned by dragging
- Mini-map shows overview of all nodes
- Preview panel can be toggled via "验证工作流" button
- All existing functionality remains intact
