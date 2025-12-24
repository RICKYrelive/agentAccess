# enhance-workflow-editor Design

## Overview
This document describes the technical design for implementing enhanced workflow editor features including canvas navigation controls and improved preview panel management.

## Architecture

### State Management
Add new state to `workflow.ts` store:

```typescript
// Canvas transform state
const canvasScale = ref(1) // 0.5 to 2.0
const canvasPan = ref({ x: 0, y: 0 })
const isCanvasPanning = ref(false)
const panStart = ref({ x: 0, y: 0 })

// Preview panel visibility
const isPreviewPanelVisible = ref(true)
```

### Component Structure

```
WorkflowCanvas.vue
├── CanvasToolbar.vue (existing)
│   └── Add toggle button for preview panel
├── FloatingCanvasControls.vue (NEW)
│   ├── Zoom In button
│   ├── Zoom Out button
│   ├── Fit to Screen button
│   ├── Reset Zoom button
│   ├── Locate Start button
│   └── MiniMap.vue (NEW)
├── CanvasArea.vue (refactored)
│   └── Apply transform styles for pan/zoom
└── PreviewPanel.vue (existing, conditionally rendered)
```

## Implementation Details

### 1. Canvas Pan and Zoom

#### Transform Approach
- Use CSS `transform: translate(x, y) scale(s)` for performance
- Store pan offset and scale in reactive state
- Update transform on user interaction

#### Mouse Wheel Zoom
```typescript
const handleWheel = (event: WheelEvent) => {
  if (event.ctrlKey || event.metaKey) {
    // Zoom
    const delta = event.deltaY > 0 ? -0.1 : 0.1
    const newScale = Math.min(2, Math.max(0.5, canvasScale.value + delta))
    canvasScale.value = newScale
  } else {
    // Pan
    canvasPan.value.x -= event.deltaX
    canvasPan.value.y -= event.deltaY
  }
}
```

#### Mouse Drag Pan
```typescript
const handleMouseDown = (event: MouseEvent) => {
  if (event.button === 1 || (event.button === 0 && event.spaceKey)) {
    isCanvasPanning.value = true
    panStart.value = { x: event.clientX - canvasPan.value.x, y: event.clientY - canvasPan.value.y }
  }
}

const handleMouseMove = (event: MouseEvent) => {
  if (isCanvasPanning.value) {
    canvasPan.value = {
      x: event.clientX - panStart.value.x,
      y: event.clientY - panStart.value.y
    }
  }
}
```

### 2. Mini-map Component

#### Design
- Small thumbnail view (200x150px)
- Shows all nodes as dots
- Shows viewport as a rectangle
- Click to pan to that location

#### Implementation
```vue
<template>
  <div class="mini-map">
    <svg :viewBox="miniMapViewBox">
      <!-- Render simplified nodes -->
      <circle
        v-for="node in scaledNodes"
        :cx="node.x * miniMapScale"
        :cy="node.y * miniMapScale"
        r="3"
        :fill="node.color"
      />
      <!-- Viewport rectangle -->
      <rect
        :x="viewportX * miniMapScale"
        :y="viewportY * miniMapScale"
        :width="viewportWidth * miniMapScale"
        :height="viewportHeight * miniMapScale"
        fill="none"
        stroke="#3b82f6"
        stroke-width="1"
      />
    </svg>
  </div>
</template>
```

### 3. Preview Panel Toggle

#### State Management
```typescript
const togglePreviewPanel = () => {
  isPreviewPanelVisible.value = !isPreviewPanelVisible.value
}
```

#### UI Implementation
- Add button in main toolbar
- Use `v-show` or conditional rendering for PreviewPanel
- Animate panel width on toggle for smooth transition

### 4. Title Change

Simple string replacement in `WorkflowCanvas.vue`:
```vue
<h3 class="text-lg font-medium text-gray-900">Agent编辑器</h3>
```

## File Changes

### New Files
- `src/components/workflow/FloatingCanvasControls.vue` - Canvas zoom/pan controls
- `src/components/workflow/MiniMap.vue` - Mini-map overview

### Modified Files
- `src/components/workflow/WorkflowCanvas.vue` - Add pan/zoom, toggle preview
- `src/stores/workflow.ts` - Add canvas transform state
- `src/components/layout/AppLayout.vue` - Update for preview panel toggle

## Performance Considerations

1. **Mini-map Updates**: Throttle mini-map redraws to avoid excessive updates
2. **Transform Updates**: Use `requestAnimationFrame` for smooth pan/zoom
3. **Large Workflows**: Consider virtualization for nodes if count > 100

## Testing Strategy

1. Unit tests for transform calculations
2. Integration tests for toolbar button actions
3. Visual regression tests for mini-map rendering
4. Accessibility tests for keyboard navigation

## Accessibility

- Support keyboard zoom: Ctrl/Cmd + Plus/Minus
- Support keyboard pan: Arrow keys when canvas is focused
- ARIA labels for all toolbar buttons
- Focus management when toggling panels
