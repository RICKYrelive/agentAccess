<template>
  <div class="floating-controls">
    <!-- Control Panel -->
    <div class="controls-panel">
      <div class="control-group">
        <!-- Zoom In -->
        <button
          @click="zoomIn"
          class="control-btn"
          title="放大 (Ctrl/Cmd + Plus)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
        </button>

        <!-- Zoom Level Display -->
        <span class="zoom-level">{{ Math.round(canvasScale * 100) }}%</span>

        <!-- Zoom Out -->
        <button
          @click="zoomOut"
          class="control-btn"
          title="缩小 (Ctrl/Cmd + Minus)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
          </svg>
        </button>

        <div class="divider"></div>

        <!-- Reset Zoom -->
        <button
          @click="resetZoom"
          class="control-btn"
          title="重置缩放 (Ctrl/Cmd + 0)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
        </button>

        <!-- Fit to Screen -->
        <button
          @click="fitToScreen"
          class="control-btn"
          title="适配屏幕 (Ctrl/Cmd + F)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 16v4m0 0h4m12-16v4m0 0h4m0 12v4m0 0h4M8 4h8M8 20h8"/>
          </svg>
        </button>

        <!-- Locate Start -->
        <button
          @click="locateStart"
          class="control-btn"
          title="定位开始节点"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWorkflowStore } from '@/stores/workflow'

const workflowStore = useWorkflowStore()
const { canvasScale } = storeToRefs(workflowStore)

const emit = defineEmits<{
  fitToScreen: []
  locateStart: []
}>()

const zoomIn = () => {
  const newScale = Math.min(2, canvasScale.value + 0.1)
  workflowStore.setCanvasScale(newScale)
}

const zoomOut = () => {
  const newScale = Math.max(0.5, canvasScale.value - 0.1)
  workflowStore.setCanvasScale(newScale)
}

const resetZoom = () => {
  workflowStore.resetCanvasView()
}

const fitToScreen = () => {
  emit('fitToScreen')
}

const locateStart = () => {
  emit('locateStart')
}
</script>

<style scoped>
.floating-controls {
  position: absolute;
  bottom: 24px;
  right: 24px;
  z-index: 100;
}

.controls-panel {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 8px;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
}

.control-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #374151;
}

.control-btn:active {
  background: #f3f4f6;
  transform: scale(0.95);
}

.zoom-level {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  min-width: 42px;
  text-align: center;
}

.divider {
  width: 1px;
  height: 20px;
  background: #e5e7eb;
}
</style>
