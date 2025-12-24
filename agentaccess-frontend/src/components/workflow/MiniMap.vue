<template>
  <div class="mini-map">
    <svg
      viewBox="0 0 2000 2000"
      preserveAspectRatio="xMidYMid meet"
      class="mini-map-svg"
    >
      <!-- Background -->
      <rect
        x="0"
        y="0"
        width="2000"
        height="2000"
        fill="#f9fafb"
        stroke="#e5e7eb"
        stroke-width="10"
      />

      <!-- Nodes -->
      <circle
        v-for="node in nodes"
        :key="node.id"
        :cx="node.position.x + 100"
        :cy="node.position.y + 50"
        r="15"
        :fill="getNodeColor(node.type)"
        opacity="0.8"
        class="mini-map-node"
        @click="handleNodeClick(node)"
      />

      <!-- Viewport Rectangle -->
      <rect
        :x="viewportRect.x"
        :y="viewportRect.y"
        :width="viewportRect.width"
        :height="viewportRect.height"
        fill="none"
        stroke="#3b82f6"
        stroke-width="10"
        rx="4"
        class="viewport-rect"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useWorkflowStore } from '@/stores/workflow'
import type { WorkflowNode } from '@/types/workflow'

const props = defineProps<{
  width: number
  height: number
}>()

const emit = defineEmits<{
  panTo: [x: number, y: number]
}>()

const workflowStore = useWorkflowStore()
const { currentNodes, canvasScale, canvasPan } = storeToRefs(workflowStore)

const nodes = computed(() => currentNodes.value)

// Fixed canvas size for mini-map display
const MINI_MAP_CANVAS_SIZE = 2000

// Viewport rectangle in canvas coordinates
const viewportRect = computed(() => {
  // Canvas container dimensions (approximate, matching actual layout)
  const canvasContainerWidth = (window.innerWidth - 64 - 384) / canvasScale.value
  const canvasContainerHeight = 600 / canvasScale.value

  // Viewport position in canvas coordinates
  const viewportCanvasX = -canvasPan.value.x / canvasScale.value
  const viewportCanvasY = -canvasPan.value.y / canvasScale.value

  return {
    x: viewportCanvasX,
    y: viewportCanvasY,
    width: canvasContainerWidth,
    height: canvasContainerHeight
  }
})

const getNodeColor = (type: string) => {
  const colors: Record<string, string> = {
    'start': '#a78bfa',
    'input': '#a78bfa',
    'web-search': '#22d3ee',
    'annotated-data-retrieval': '#60a5fa',
    'question-rewrite': '#818cf8',
    'knowledge-retrieval': '#fb923c',
    'llm-call': '#fb7185',
    'data-processing': '#fbbf24',
    'condition': '#facc15',
    'code-execution': '#34d399',
    'output': '#2dd4bf',
    'end': '#9ca3af'
  }
  return colors[type] || '#9ca3af'
}

const handleNodeClick = (node: WorkflowNode) => {
  const nodeCenterX = node.position.x + 100
  const nodeCenterY = node.position.y + 50

  // Container dimensions
  const containerWidth = window.innerWidth - 64 - 384
  const containerHeight = 600

  // Calculate pan to center the node
  const newX = (containerWidth / 2) - (nodeCenterX * canvasScale.value)
  const newY = (containerHeight / 2) - (nodeCenterY * canvasScale.value)

  emit('panTo', newX, newY)
}
</script>

<style scoped>
.mini-map {
  position: absolute;
  bottom: 100px;
  right: 24px;
  width: 200px;
  height: 150px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 100;
}

.mini-map-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.mini-map-node {
  cursor: pointer;
  transition: opacity 0.2s;
}

.mini-map-node:hover {
  opacity: 1;
  stroke: white;
  stroke-width: 2;
}

.viewport-rect {
  pointer-events: none;
}
</style>
