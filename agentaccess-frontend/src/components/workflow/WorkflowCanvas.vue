<template>
  <div class="h-full flex flex-col bg-slate-50">
    <!-- Toolbar -->
    <div class="bg-white border-b border-slate-200 px-4 py-3">
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-4 min-w-0 flex-1">
          <!-- Agent Name Editor -->
          <div class="flex items-center gap-2 min-w-0">
            <svg
              class="w-5 h-5 text-slate-600 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            <div v-if="!isEditingName" class="flex items-center gap-2 min-w-0">
              <h3 class="text-lg font-medium text-slate-900 max-w-[200px] truncate">
                {{ currentWorkflow?.name || '新Agent' }}
              </h3>
              <button
                @click="startEditingName"
                class="text-slate-400 hover:text-slate-600 flex-shrink-0"
                title="重命名"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            </div>
            <input
              v-else
              ref="nameInputRef"
              v-model="editingName"
              @blur="saveName"
              @keyup.enter="saveName"
              @keyup.esc="cancelEditName"
              class="text-lg font-medium text-slate-900 border border-primary-500 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 flex-shrink-0"
              style="width: 200px"
            />
          </div>
          <div class="flex items-center gap-2 text-sm text-slate-500 whitespace-nowrap">
            <span>节点: {{ currentNodes.length }}</span>
            <span>•</span>
            <span>连接: {{ currentConnections.length }}</span>
          </div>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <!-- Save Button -->
          <button @click="saveAgent" class="btn-primary text-sm flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
            <span>保存到我的Agent</span>
          </button>

          <!-- FastGPT Status -->
          <div
            v-if="fastgptConnected"
            class="flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 rounded-md"
          >
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span class="text-xs text-green-700">FastGPT已连接</span>
          </div>

          <button
            @click="syncToFastGPT"
            :disabled="!fastgptConnected || isSyncing"
            :class="[
              'btn-secondary text-sm',
              (!fastgptConnected || isSyncing) && 'opacity-50 cursor-not-allowed',
            ]"
          >
            <svg
              v-if="isSyncing"
              class="w-4 h-4 animate-spin inline mr-1"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {{ isSyncing ? '同步中...' : '同步到FastGPT' }}
          </button>
          <button
            @click="importFromFastGPT"
            :disabled="!fastgptConnected || isSyncing"
            :class="[
              'btn-secondary text-sm',
              (!fastgptConnected || isSyncing) && 'opacity-50 cursor-not-allowed',
            ]"
          >
            从FastGPT导入
          </button>
          <button @click="exportWorkflow" class="btn-secondary text-sm">导出</button>
          <button @click="togglePreviewPanel" class="btn-secondary text-sm">
            {{ isPreviewPanelVisible ? '隐藏预览' : '验证工作流' }}
          </button>
          <button @click="clearCanvas" class="btn-secondary text-sm">清空画布</button>
        </div>
      </div>
    </div>

    <!-- Canvas Area -->
    <div class="flex-1 flex">
      <!-- Node Palette -->
      <div class="w-64 bg-white border-r border-slate-200 p-4">
        <h4 class="text-sm font-medium text-slate-900 mb-4">节点类型</h4>
        <div class="space-y-2">
          <div
            v-for="nodeType in nodeTypes"
            :key="nodeType.type"
            draggable="true"
            @dragstart="onDragStart($event, nodeType.type)"
            class="p-3 bg-slate-50 border border-slate-200 rounded-lg cursor-move hover:bg-slate-100 transition-colors"
          >
            <div class="flex items-center space-x-3">
              <div
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                  nodeType.bgColor,
                ]"
              >
                <svg
                  class="w-4 h-4"
                  :class="nodeType.textColor"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    :d="nodeType.icon"
                  />
                </svg>
              </div>
              <div class="min-w-0">
                <p class="text-sm font-medium text-slate-900">{{ nodeType.name }}</p>
                <p class="text-xs text-slate-500">{{ nodeType.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Canvas -->
      <div class="flex-1 relative overflow-hidden">
        <FloatingCanvasControls
          @fit-to-screen="handleFitToScreen"
          @locate-start="handleLocateStart"
        />
        <MiniMap :width="200" :height="150" @pan-to="(x, y) => workflowStore.setCanvasPan(x, y)" />
        <div
          ref="canvasRef"
          class="workflow-canvas w-full h-full relative"
          style="min-height: 400px; z-index: 10"
          tabindex="0"
          @drop="onDrop"
          @dragover="onDragOver"
          @dragenter.prevent
          @click="clearSelection"
          @wheel.passive="handleCanvasWheel"
          @mousedown="handleCanvasMouseDown"
          @mousemove="handleCanvasMouseMove"
          @mouseup="handleCanvasMouseUp"
          @mouseleave="handleCanvasMouseUp"
          @keydown="handleCanvasKeydown"
          @click.right="cancelConnection"
        >
          <div
            v-if="currentNodes.length === 0"
            class="absolute inset-0 flex items-center justify-center text-slate-400 pointer-events-none"
          >
            <div class="text-center">
              <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88 7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13a5 5 0 00-7.9 6.903M15 13l-3-3m6 0l-3 3"
                />
              </svg>
              <p class="mt-2 text-sm">拖拽节点类型到这里开始创建工作流</p>
            </div>
          </div>
          <!-- Infinite Background Layer - moves and scales with canvas -->
          <div
            class="canvas-background"
            :style="{
              transform: `translate(${canvasPan.x}px, ${canvasPan.y}px) scale(${canvasScale})`,
              transformOrigin: '0 0',
              position: 'absolute',
              left: '0',
              top: '0',
              width: `${canvasBounds.width}px`,
              height: `${canvasBounds.height}px`,
            }"
          />

          <!-- Connection Lines -->
          <div
            class="canvas-content"
            :style="{
              transform: `translate(${canvasPan.x}px, ${canvasPan.y}px) scale(${canvasScale})`,
              transformOrigin: '0 0',
              position: 'absolute',
              left: '0',
              top: '0',
              width: `${canvasBounds.width}px`,
              height: `${canvasBounds.height}px`,
            }"
          >
            <svg
              class="absolute"
              :style="{
                zIndex: 1,
                left: '0',
                top: '0',
                width: `${canvasBounds.width}px`,
                height: `${canvasBounds.height}px`,
                overflow: 'visible',
                pointerEvents: 'none',
              }"
              @click="clearConnectionSelection"
            >
              <!-- Connection lines -->
              <path
                v-for="connection in currentConnections"
                :key="connection.id"
                :d="getConnectionPath(connection)"
                :stroke="selectedConnectionId === connection.id ? '#3b82f6' : '#9ca3af'"
                :stroke-width="selectedConnectionId === connection.id ? '3' : '2'"
                fill="none"
                stroke-dasharray="6,4"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="transition-all duration-200 hover:stroke-primary-500 cursor-pointer"
                style="pointer-events: stroke"
                @click.stop="selectConnection(connection.id)"
                @dblclick.stop="deleteConnection(connection.id)"
              />
              <!-- Active connection line being drawn -->
              <path
                v-if="connectionState.isActive && connectionState.sourceNodeId"
                :d="getActiveConnectionPath()"
                stroke="#3b82f6"
                stroke-width="2"
                fill="none"
                stroke-dasharray="6,4"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="animate-pulse"
                style="pointer-events: none"
              />
            </svg>

            <!-- Workflow Nodes -->
            <div
              v-for="node in currentNodes"
              :key="node.id"
              :ref="(el) => setNodeRef(node.id, el)"
              :style="{
                position: 'absolute',
                left: `${node.position.x}px`,
                top: `${node.position.y}px`,
                zIndex: 20,
              }"
              class="workflow-node"
              @click.stop
              @contextmenu.prevent="showNodeContextMenu($event, node)"
            >
              <WorkflowNode
                :node="node"
                :isSelected="selectedNodeId === node.id"
                @select="selectNode"
                @update="updateNode"
                @delete="deleteNode"
                @connect="startConnection"
                @connect-output="onOutputConnection"
                @connect-input="onInputConnection"
              />
            </div>

            <!-- Connection Indicator -->
            <div
              v-if="connectionState.isActive"
              class="connection-indicator"
              :style="{
                position: 'absolute',
                left: `${connectionState.x}px`,
                top: `${connectionState.y}px`,
              }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Validation Errors -->
    <div
      v-if="validationErrors.length > 0"
      class="absolute bottom-4 left-4 bg-red-50 border border-red-200 rounded-lg p-3 max-w-md"
    >
      <div class="flex items-start space-x-2">
        <svg
          class="w-5 h-5 text-red-400 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div class="flex-1">
          <p class="text-sm font-medium text-red-800">验证错误</p>
          <ul class="mt-1 text-sm text-red-700">
            <li v-for="error in validationErrors" :key="error">{{ error }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useWorkflowStore } from '@/stores/workflow'
import { downloadWorkflowAsJson } from '@/utils/workflowExport'
import type {
  WorkflowNode as WorkflowNodeType,
  WorkflowNodeType as NodeOptionType,
} from '@/types/workflow'
import WorkflowNode from './WorkflowNode.vue'
import FloatingCanvasControls from './FloatingCanvasControls.vue'
import MiniMap from './MiniMap.vue'

const workflowStore = useWorkflowStore()
const canvasRef = ref<HTMLElement>()
const nodeRefs = ref<Map<string, HTMLElement>>(new Map())

// Use storeToRefs to maintain reactivity
const {
  currentNodes,
  currentConnections,
  selectedNodeId,
  fastgptConnected,
  syncStatus,
  isPreviewPanelVisible,
  canvasScale,
  canvasPan,
  currentWorkflow,
} = storeToRefs(workflowStore)

// Agent name editing state
const isEditingName = ref(false)
const editingName = ref('')
const nameInputRef = ref<HTMLInputElement>()

// Local state
const validationErrors = ref<string[]>([])
const connectionState = ref({
  isActive: false,
  x: 0,
  y: 0,
  sourceNodeId: null as string | null,
  targetNodeId: null as string | null,
})

const selectedConnectionId = ref<string | null>(null)

// Helper function to set node ref
const setNodeRef = (nodeId: string, el: any) => {
  if (el) {
    nodeRefs.value.set(nodeId, el as HTMLElement)
  } else {
    nodeRefs.value.delete(nodeId)
  }
}

// Helper function to get node dimensions
const getNodeDimensions = (nodeId: string) => {
  const nodeEl = nodeRefs.value.get(nodeId)
  return {
    width: nodeEl?.offsetWidth || 200,
    height: nodeEl?.offsetHeight || 100,
  }
}

// Helper function to check if a point is inside a node's bounds
const isPointInNode = (
  x: number,
  y: number,
  nodeId: string,
  excludeIds: string[] = [],
): boolean => {
  if (excludeIds.includes(nodeId)) return false

  const node = currentNodes.value.find((n) => n.id === nodeId)
  if (!node) return false

  const dimensions = getNodeDimensions(nodeId)
  const nodeLeft = node.position.x
  const nodeRight = node.position.x + dimensions.width
  const nodeTop = node.position.y
  const nodeBottom = node.position.y + dimensions.height

  return x >= nodeLeft && x <= nodeRight && y >= nodeTop && y <= nodeBottom
}

// Helper function to check if a line segment intersects with a node's bounds
const lineIntersectsNode = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  excludeIds: string[] = [],
): string | null => {
  for (const node of currentNodes.value) {
    if (excludeIds.includes(node.id)) continue

    const dimensions = getNodeDimensions(node.id)
    const nodeLeft = node.position.x
    const nodeRight = node.position.x + dimensions.width
    const nodeTop = node.position.y
    const nodeBottom = node.position.y + dimensions.height

    // Check if line segment intersects with node rectangle
    // Using a simplified approach: check if either endpoint is inside the node
    if (
      (x1 >= nodeLeft && x1 <= nodeRight && y1 >= nodeTop && y1 <= nodeBottom) ||
      (x2 >= nodeLeft && x2 <= nodeRight && y2 >= nodeTop && y2 <= nodeBottom)
    ) {
      return node.id
    }

    // Check if line crosses through the node (simplified Liang-Barsky algorithm)
    const tMin = 0
    const tMax = 1
    let t0 = tMin
    let t1 = tMax

    const dx = x2 - x1
    const dy = y2 - y1

    const p = [-dx, dx, -dy, dy]
    const q = [x1 - nodeLeft, nodeRight - x1, y1 - nodeTop, nodeBottom - y1]

    for (let i = 0; i < 4; i++) {
      if (p[i] === 0) {
        if (q[i] < 0) return null // Line is parallel and outside
      } else {
        const t = q[i] / p[i]
        if (p[i] < 0) {
          if (t > t1) return null
          if (t > t0) t0 = t
        } else {
          if (t < t0) return null
          if (t < t1) t1 = t
        }
      }
    }

    if (t0 <= t1 && t1 >= tMin && t0 <= tMax) {
      return node.id
    }
  }

  return null
}

// Generate a path that avoids intersecting nodes - simplified Manhattan routing
const generateAvoidancePath = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  sourceNodeId: string,
  targetNodeId: string,
): string => {
  const padding = 20 // Padding around nodes

  // Get bounding boxes of all nodes except source and target
  const blockingNodes = currentNodes.value.filter(
    (n) => n.id !== sourceNodeId && n.id !== targetNodeId,
  )

  if (blockingNodes.length === 0) {
    return generateSimplePath(startX, startY, endX, endY)
  }

  // Helper to check if a point is inside any blocking node
  const isPointBlocked = (x: number, y: number): boolean => {
    for (const node of blockingNodes) {
      const dimensions = getNodeDimensions(node.id)
      if (
        x >= node.position.x - padding &&
        x <= node.position.x + dimensions.width + padding &&
        y >= node.position.y - padding &&
        y <= node.position.y + dimensions.height + padding
      ) {
        return true
      }
    }
    return false
  }

  // Helper to check if a horizontal segment is blocked
  const isHorizontalSegmentBlocked = (x1: number, x2: number, y: number): boolean => {
    const minX = Math.min(x1, x2)
    const maxX = Math.max(x1, x2)
    for (const node of blockingNodes) {
      const dimensions = getNodeDimensions(node.id)
      const nodeLeft = node.position.x - padding
      const nodeRight = node.position.x + dimensions.width + padding
      const nodeTop = node.position.y - padding
      const nodeBottom = node.position.y + dimensions.height + padding

      // Check for overlap in both x and y dimensions
      if (maxX >= nodeLeft && minX <= nodeRight && y >= nodeTop && y <= nodeBottom) {
        return true
      }
    }
    return false
  }

  // Helper to check if a vertical segment is blocked
  const isVerticalSegmentBlocked = (y1: number, y2: number, x: number): boolean => {
    const minY = Math.min(y1, y2)
    const maxY = Math.max(y1, y2)
    for (const node of blockingNodes) {
      const dimensions = getNodeDimensions(node.id)
      const nodeLeft = node.position.x - padding
      const nodeRight = node.position.x + dimensions.width + padding
      const nodeTop = node.position.y - padding
      const nodeBottom = node.position.y + dimensions.height + padding

      // Check for overlap in both x and y dimensions
      if (x >= nodeLeft && x <= nodeRight && maxY >= nodeTop && minY <= nodeBottom) {
        return true
      }
    }
    return false
  }

  const radius = 20
  const goingRight = endX > startX

  // Strategy 1: Try simple horizontal-first path (go right, then up/down, then right)
  if (goingRight) {
    const midX = (startX + endX) / 2

    // Check if horizontal segments are clear
    if (
      !isHorizontalSegmentBlocked(startX, midX, startY) &&
      !isHorizontalSegmentBlocked(midX, endX, endY) &&
      !isVerticalSegmentBlocked(startY, endY, midX)
    ) {
      return generateSimplePath(startX, startY, endX, endY)
    }

    // Try going above all blocking nodes
    const minTop = Math.min(...blockingNodes.map((n) => n.position.y))
    const aboveY = minTop - padding - 30

    if (!isHorizontalSegmentBlocked(startX, endX, aboveY)) {
      // Route: start -> up -> above -> across -> down -> end
      return `M ${startX} ${startY} L ${startX + radius} ${startY} Q ${startX + radius} ${startY} ${startX + radius} ${startY - radius} L ${startX + radius} ${aboveY} Q ${startX + radius} ${aboveY} ${startX + radius + radius} ${aboveY} L ${endX - radius} ${aboveY} Q ${endX} ${aboveY} ${endX} ${aboveY + radius} L ${endX} ${endY - radius} Q ${endX} ${endY} ${endX - radius} ${endY} L ${startX + radius} ${endY}`
    }

    // Try going below all blocking nodes
    const maxBottom = Math.max(...blockingNodes.map((n) => n.position.y + nodeHeight))
    const belowY = maxBottom + padding + 30

    if (!isHorizontalSegmentBlocked(startX, endX, belowY)) {
      return `M ${startX} ${startY} L ${startX + radius} ${startY} Q ${startX + radius} ${startY} ${startX + radius} ${startY + radius} L ${startX + radius} ${belowY} Q ${startX + radius} ${belowY} ${startX + radius + radius} ${belowY} L ${endX - radius} ${belowY} Q ${endX} ${belowY} ${endX} ${belowY - radius} L ${endX} ${endY + radius} Q ${endX} ${endY} ${endX - radius} ${endY} L ${startX + radius} ${endY}`
    }
  } else {
    // Target is to the left - route around
    const stepX = Math.max(startX, endX) + 60

    if (!isVerticalSegmentBlocked(startY, endY, stepX)) {
      return `M ${startX} ${startY} L ${stepX - radius} ${startY} Q ${stepX} ${startY} ${stepX} ${startY + (endY > startY ? radius : -radius)} L ${stepX} ${endY - (endY > startY ? radius : -radius)} Q ${stepX} ${endY} ${stepX - radius} ${endY} L ${endX} ${endY}`
    }
  }

  // Fallback to simple path
  return generateSimplePath(startX, startY, endX, endY)
}

const generateSimplePath = (startX: number, startY: number, endX: number, endY: number): string => {
  const radius = 20
  const dx = endX - startX
  const dy = endY - startY
  const midX = (startX + endX) / 2

  // If target is to the right of source
  if (dx > 20) {
    // Standard L-shaped path with rounded corner at midpoint
    // Small vertical distance adjustment for smooth curves
    const verticalDist = Math.abs(dy)

    if (verticalDist < radius * 2) {
      // Too close for full radius, use smaller radius
      const smallRadius = Math.max(5, verticalDist / 2)
      return `M ${startX} ${startY} L ${midX - smallRadius} ${startY} Q ${midX} ${startY} ${midX} ${startY + (dy > 0 ? smallRadius : -smallRadius)} L ${midX} ${endY - (dy > 0 ? smallRadius : -smallRadius)} Q ${midX} ${endY} ${midX + smallRadius} ${endY} L ${endX} ${endY}`
    }

    return `M ${startX} ${startY} L ${midX - radius} ${startY} Q ${midX} ${startY} ${midX} ${startY + (dy > 0 ? radius : -radius)} L ${midX} ${endY - (dy > 0 ? radius : -radius)} Q ${midX} ${endY} ${midX + radius} ${endY} L ${endX} ${endY}`
  } else if (dx < -20) {
    // Target is to the left - step-around path
    // Go out to the right, then vertically, then back to target
    const stepX = Math.max(startX, endX) + 50

    if (Math.abs(dy) < radius * 2) {
      const smallRadius = Math.max(5, Math.abs(dy) / 2)
      return `M ${startX} ${startY} L ${stepX - smallRadius} ${startY} Q ${stepX} ${startY} ${stepX} ${startY + (dy > 0 ? smallRadius : -smallRadius)} L ${stepX} ${endY - (dy > 0 ? smallRadius : -smallRadius)} Q ${stepX} ${endY} ${stepX - smallRadius} ${endY} L ${endX} ${endY}`
    }

    return `M ${startX} ${startY} L ${stepX - radius} ${startY} Q ${stepX} ${startY} ${stepX} ${startY + (dy > 0 ? radius : -radius)} L ${stepX} ${endY - (dy > 0 ? radius : -radius)} Q ${stepX} ${endY} ${stepX - radius} ${endY} L ${endX} ${endY}`
  } else {
    // Target is roughly vertically aligned
    // Just draw a straight line with rounded ends
    if (Math.abs(dy) > 0) {
      return `M ${startX} ${startY} L ${startX} ${endY}`
    }
    return `M ${startX} ${startY} L ${endX} ${endY}`
  }
}

// Computed states
const isSyncing = computed(() => syncStatus.value === 'syncing')

// Calculate canvas bounds based on node positions
const canvasBounds = computed(() => {
  // Always start from 0,0 and calculate bounds from there
  let maxX = 0,
    maxY = 0

  if (currentNodes.value.length > 0) {
    currentNodes.value.forEach((node) => {
      maxX = Math.max(maxX, node.position.x + 200) // Node width
      maxY = Math.max(maxY, node.position.y + 100) // Node height
    })
  }

  const padding = 500 // Large padding for dragging nodes
  const minWidth = 2000
  const minHeight = 2000

  return {
    minX: 0,
    minY: 0,
    width: Math.max(minWidth, maxX + padding),
    height: Math.max(minHeight, maxY + padding),
  }
})

// Node types available in the palette
const nodeTypes = [
  {
    type: 'input' as NodeOptionType,
    name: '输入',
    description: '接收用户输入',
    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-600',
  },
  {
    type: 'web-search' as NodeOptionType,
    name: '网络搜索',
    description: '搜索网络信息',
    icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    bgColor: 'bg-cyan-100',
    textColor: 'text-cyan-600',
  },
  {
    type: 'annotated-data-retrieval' as NodeOptionType,
    name: '标注数据检索',
    description: '检索标注数据',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-600',
  },
  {
    type: 'question-rewrite' as NodeOptionType,
    name: '问题重写',
    description: '重写用户问题',
    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-600',
  },
  {
    type: 'knowledge-retrieval' as NodeOptionType,
    name: '知识检索',
    description: '从知识库检索信息',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-600',
  },
  {
    type: 'llm-call' as NodeOptionType,
    name: 'LLM调用',
    description: '调用大语言模型',
    icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
    bgColor: 'bg-rose-100',
    textColor: 'text-rose-600',
  },
  {
    type: 'data-processing' as NodeOptionType,
    name: '数据处理',
    description: '处理和转换数据',
    icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-600',
  },
  {
    type: 'condition' as NodeOptionType,
    name: '条件判断',
    description: '根据条件分支',
    icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-600',
  },
  {
    type: 'code-execution' as NodeOptionType,
    name: '代码执行',
    description: '执行自定义代码',
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-600',
  },
  {
    type: 'output' as NodeOptionType,
    name: '输出',
    description: '输出最终结果',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    bgColor: 'bg-teal-100',
    textColor: 'text-teal-600',
  },
]

// Methods
const onDragStart = (event: DragEvent, nodeType: NodeOptionType) => {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'copy'
    event.dataTransfer.setData('application/node-type', nodeType)
  }
}

const onDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'copy'
  }
}

const onDrop = (event: DragEvent) => {
  event.preventDefault()
  event.stopPropagation()

  if (!canvasRef.value) return
  if (!event.dataTransfer) return

  const nodeType = event.dataTransfer.getData('application/node-type') as NodeOptionType
  if (!nodeType) return

  const rect = canvasRef.value.getBoundingClientRect()
  // Convert screen coordinates to canvas coordinates
  const screenX = event.clientX - rect.left
  const screenY = event.clientY - rect.top

  // Account for transform: (screen - pan) / scale
  const canvasX = (screenX - canvasPan.value.x) / canvasScale.value
  const canvasY = (screenY - canvasPan.value.y) / canvasScale.value

  // Center the node on the drop position (node is 200x100)
  const x = Math.max(0, canvasX - 100)
  const y = Math.max(0, canvasY - 50)

  workflowStore.addNode(nodeType, { x, y })
}

const selectNode = (nodeId: string) => {
  workflowStore.selectNode(nodeId)
  selectedConnectionId.value = null // Clear connection selection when selecting node
}

const clearSelection = () => {
  workflowStore.selectNode(null)
}

const clearConnectionSelection = () => {
  selectedConnectionId.value = null
}

const selectConnection = (connectionId: string) => {
  selectedConnectionId.value = connectionId
  workflowStore.selectNode(null) // Clear node selection when selecting connection
}

const getSelectedNode = () => {
  return workflowStore.getSelectedNode()
}

const updateNode = (nodeId: string, updates: Partial<WorkflowNodeType>) => {
  workflowStore.updateNode(nodeId, updates)
}

const deleteNode = (nodeId: string) => {
  workflowStore.deleteNode(nodeId)
}

const getNodePosition = (nodeId: string) => {
  const node = currentNodes.value.find((n) => n.id === nodeId)
  if (!node) return null

  // Try to get actual dimensions from DOM element
  const nodeEl = nodeRefs.value.get(nodeId)
  const nodeWidth = nodeEl?.offsetWidth || 200
  const nodeHeight = nodeEl?.offsetHeight || 100

  // Return edge positions for connection points
  return {
    x: node.position.x + nodeWidth / 2, // Center x
    y: node.position.y + nodeHeight / 2, // Center y
    leftX: node.position.x, // Left edge
    rightX: node.position.x + nodeWidth, // Right edge
    topY: node.position.y, // Top edge
    bottomY: node.position.y + nodeHeight, // Bottom edge
  }
}

const getConnectionPath = (connection: any) => {
  const sourcePos = getNodePosition(connection.sourceNodeId)
  const targetPos = getNodePosition(connection.targetNodeId)

  if (!sourcePos || !targetPos) {
    return ''
  }

  // Start from right edge of source, end at left edge of target
  const startX = sourcePos.rightX
  const startY = sourcePos.y
  const endX = targetPos.leftX
  const endY = targetPos.y

  // Check if the direct path intersects with any nodes
  const intersectingNodeId = lineIntersectsNode(startX, startY, endX, endY, [
    connection.sourceNodeId,
    connection.targetNodeId,
  ])

  if (intersectingNodeId) {
    // Use avoidance path to go around blocking nodes
    return generateAvoidancePath(
      startX,
      startY,
      endX,
      endY,
      connection.sourceNodeId,
      connection.targetNodeId,
    )
  }

  // No intersection, use simple path
  return generateSimplePath(startX, startY, endX, endY)
}

const getActiveConnectionPath = () => {
  if (!connectionState.value.sourceNodeId) return ''

  const sourcePos = getNodePosition(connectionState.value.sourceNodeId)

  if (!sourcePos) return ''

  // Start from right edge of source node
  const startX = sourcePos.rightX
  const startY = sourcePos.y
  const currentX = connectionState.value.x
  const currentY = connectionState.value.y

  // If no valid mouse position yet, don't draw
  if (currentX === undefined || currentY === undefined) return ''

  const radius = 20

  // Draw L-shape to mouse position with rounded corner
  const midX = (startX + currentX) / 2
  const verticalDist = Math.abs(currentY - startY)

  if (verticalDist < radius * 2) {
    // Too close for full radius
    const smallRadius = Math.max(5, verticalDist / 2)
    return `M ${startX} ${startY} L ${midX} ${startY} Q ${midX} ${startY} ${midX} ${startY + (currentY > startY ? smallRadius : -smallRadius)} L ${midX} ${currentY - (currentY > startY ? smallRadius : -smallRadius)} Q ${midX} ${currentY} ${midX + smallRadius} ${currentY} L ${currentX} ${currentY}`
  }

  // Full radius L-shape
  return `M ${startX} ${startY} L ${midX - radius} ${startY} Q ${midX} ${startY} ${midX} ${startY + (currentY > startY ? radius : -radius)} L ${midX} ${currentY - (currentY > startY ? radius : -radius)} Q ${midX} ${currentY} ${midX + radius} ${currentY} L ${currentX} ${currentY}`
}

const startConnection = (nodeId: string) => {
  connectionState.value = {
    isActive: true,
    x: 0,
    y: 0,
    sourceNodeId: nodeId,
    targetNodeId: null,
  }
}

const onOutputConnection = (nodeId: string) => {
  // Start a new connection from this node's output
  connectionState.value = {
    isActive: true,
    x: 0,
    y: 0,
    sourceNodeId: nodeId,
    targetNodeId: null,
  }
}

const onInputConnection = (nodeId: string) => {
  // Complete the connection to this node's input
  if (
    connectionState.value.isActive &&
    connectionState.value.sourceNodeId &&
    connectionState.value.sourceNodeId !== nodeId
  ) {
    workflowStore.addConnection(connectionState.value.sourceNodeId, nodeId)

    // Reset connection state
    connectionState.value = {
      isActive: false,
      x: 0,
      y: 0,
      sourceNodeId: null,
      targetNodeId: null,
    }
  }
}

const onCanvasMouseMove = (event: MouseEvent) => {
  if (!connectionState.value.isActive || !canvasRef.value) return

  const rect = canvasRef.value.getBoundingClientRect()
  // Convert screen coordinates to canvas coordinates (accounting for pan and scale)
  const screenX = event.clientX - rect.left
  const screenY = event.clientY - rect.top

  // Account for transform: (screen - pan) / scale
  connectionState.value.x = (screenX - canvasPan.value.x) / canvasScale.value
  connectionState.value.y = (screenY - canvasPan.value.y) / canvasScale.value
}

const cancelConnection = () => {
  // Reset connection state on right click
  connectionState.value = {
    isActive: false,
    x: 0,
    y: 0,
    sourceNodeId: null,
    targetNodeId: null,
  }
}

const deleteConnection = (connectionId: string) => {
  workflowStore.deleteConnection(connectionId)
  selectedConnectionId.value = null
}

const validateWorkflow = () => {
  const result = workflowStore.validateWorkflow()
  validationErrors.value = result.errors

  if (result.valid) {
    setTimeout(() => {
      validationErrors.value = []
    }, 3000)
  }
}

const togglePreviewPanel = () => {
  workflowStore.togglePreviewPanel()
}

const clearCanvas = () => {
  if (workflowStore.currentWorkflow) {
    workflowStore.currentWorkflow.nodes = [
      {
        id: 'start',
        type: 'start',
        position: { x: 100, y: 100 },
        configuration: {},
        status: 'idle',
      },
    ]
    workflowStore.currentWorkflow.connections = []
    clearSelection()
  }
}

// Agent name editing methods
const startEditingName = () => {
  editingName.value = currentWorkflow.value?.name || '新Agent'
  isEditingName.value = true
  nextTick(() => {
    nameInputRef.value?.focus()
    nameInputRef.value?.select()
  })
}

const saveName = () => {
  if (editingName.value.trim()) {
    workflowStore.updateWorkflowName(editingName.value.trim())
  }
  isEditingName.value = false
}

const cancelEditName = () => {
  editingName.value = currentWorkflow.value?.name || '新Agent'
  isEditingName.value = false
}

const saveAgent = () => {
  const savedAgent = workflowStore.saveAsAgent()
  if (savedAgent) {
    alert(`Agent "${savedAgent.name}" 已保存到我的Agent`)
  } else {
    alert('保存失败，请重试')
  }
}

// Canvas Navigation Handlers
const handleFitToScreen = () => {
  if (!canvasRef.value) return
  const rect = canvasRef.value.getBoundingClientRect()
  workflowStore.fitCanvasToScreen(rect.width, rect.height)
}

const handleLocateStart = () => {
  if (!canvasRef.value) return
  const rect = canvasRef.value.getBoundingClientRect()
  workflowStore.locateStartNode(rect.width, rect.height)
}

// Mouse wheel zoom and pan
const handleCanvasWheel = (event: WheelEvent) => {
  event.preventDefault()
  if (event.ctrlKey || event.metaKey) {
    // Zoom
    const delta = event.deltaY > 0 ? -0.1 : 0.1
    const newScale = canvasScale.value + delta
    workflowStore.setCanvasScale(newScale)
  } else {
    // Pan with scroll
    workflowStore.setCanvasPan(canvasPan.value.x - event.deltaX, canvasPan.value.y - event.deltaY)
  }
}

// Canvas pan with mouse drag
const handleCanvasMouseDown = (event: MouseEvent) => {
  // Middle mouse button or space + left mouse
  if (event.button === 1 || (event.button === 0 && (event as any).code === 'Space')) {
    workflowStore.isCanvasPanning = true
    workflowStore.panStart = {
      x: event.clientX - canvasPan.value.x,
      y: event.clientY - canvasPan.value.y,
    }
  }
}

const handleCanvasMouseMove = (event: MouseEvent) => {
  if (workflowStore.isCanvasPanning) {
    workflowStore.setCanvasPan(
      event.clientX - workflowStore.panStart.x,
      event.clientY - workflowStore.panStart.y,
    )
  }
}

const handleCanvasMouseUp = () => {
  workflowStore.isCanvasPanning = false
}

// Keyboard shortcuts
const handleCanvasKeydown = (event: KeyboardEvent) => {
  // Ctrl/Cmd + Plus: Zoom in
  if ((event.ctrlKey || event.metaKey) && (event.key === '=' || event.key === '+')) {
    event.preventDefault()
    const newScale = Math.min(2, canvasScale.value + 0.1)
    workflowStore.setCanvasScale(newScale)
  }
  // Ctrl/Cmd + Minus: Zoom out
  else if ((event.ctrlKey || event.metaKey) && event.key === '-') {
    event.preventDefault()
    const newScale = Math.max(0.5, canvasScale.value - 0.1)
    workflowStore.setCanvasScale(newScale)
  }
  // Ctrl/Cmd + 0: Reset zoom
  else if ((event.ctrlKey || event.metaKey) && event.key === '0') {
    event.preventDefault()
    workflowStore.resetCanvasView()
  }
  // Ctrl/Cmd + F: Fit to screen
  else if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
    event.preventDefault()
    handleFitToScreen()
  }
  // Arrow keys to pan
  else if (!event.ctrlKey && !event.metaKey && !event.shiftKey) {
    const panStep = 50
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault()
        workflowStore.setCanvasPan(canvasPan.value.x, canvasPan.value.y - panStep)
        break
      case 'ArrowDown':
        event.preventDefault()
        workflowStore.setCanvasPan(canvasPan.value.x, canvasPan.value.y + panStep)
        break
      case 'ArrowLeft':
        event.preventDefault()
        workflowStore.setCanvasPan(canvasPan.value.x - panStep, canvasPan.value.y)
        break
      case 'ArrowRight':
        event.preventDefault()
        workflowStore.setCanvasPan(canvasPan.value.x + panStep, canvasPan.value.y)
        break
    }
  }
}

const showNodeContextMenu = (event: MouseEvent, node: WorkflowNodeType) => {
  // TODO: Implement context menu
  console.log('Context menu for node:', node)
}

// FastGPT Integration Methods
const syncToFastGPT = async () => {
  if (!fastgptConnected.value) {
    alert('请先在用户设置中配置并连接FastGPT')
    return
  }

  try {
    await workflowStore.syncWorkflowToFastGPT()
    alert('工作流已同步到FastGPT')
  } catch (error) {
    console.error('Sync failed:', error)
    alert('同步失败: ' + (error as Error).message)
  }
}

const importFromFastGPT = async () => {
  if (!fastgptConnected.value) {
    alert('请先在用户设置中配置并连接FastGPT')
    return
  }

  try {
    // Show a prompt to get the FastGPT workflow ID
    const workflowId = prompt('请输入FastGPT工作流ID (留空查看所有工作流):')
    if (workflowId === null) return // User cancelled

    if (workflowId.trim()) {
      await workflowStore.loadWorkflowFromFastGPT(workflowId.trim())
      alert('工作流已从FastGPT导入')
    } else {
      // List available workflows
      const workflows = await workflowStore.fastgptService?.listWorkflows()
      if (workflows && workflows.length > 0) {
        const workflowList = workflows.map((w) => `${w.id}: ${w.name}`).join('\n')
        alert(`可用的FastGPT工作流:\n${workflowList}`)
      } else {
        alert('FastGPT中没有可用的工作流')
      }
    }
  } catch (error) {
    console.error('Import failed:', error)
    alert('导入失败: ' + (error as Error).message)
  }
}

const exportWorkflow = () => {
  if (!workflowStore.currentWorkflow) {
    alert('没有可导出的工作流')
    return
  }

  try {
    downloadWorkflowAsJson(workflowStore.currentWorkflow)
    alert('工作流已导出为JSON文件')
  } catch (error) {
    console.error('Export failed:', error)
    alert('导出失败: ' + (error as Error).message)
  }
}

onMounted(() => {
  // Initialize with a default workflow if none exists
  if (!workflowStore.currentWorkflow) {
    workflowStore.createWorkflow('默认工作流')
  }

  // Add global mouse move listener for connection drawing
  window.addEventListener('mousemove', handleGlobalMouseMove)
  window.addEventListener('mouseup', handleGlobalMouseUp)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleGlobalMouseMove)
  window.removeEventListener('mouseup', handleGlobalMouseUp)
})

// Global mouse move handler for connection drawing (works even when mouse is outside canvas)
const handleGlobalMouseMove = (event: MouseEvent) => {
  if (!connectionState.value.isActive || !canvasRef.value) return

  const rect = canvasRef.value.getBoundingClientRect()
  // Convert screen coordinates to canvas coordinates
  // canvas-content has transform: translate(pan.x, pan.y) scale(scale) and starts at (0,0)
  const screenX = event.clientX - rect.left
  const screenY = event.clientY - rect.top

  // Account for transform: (screen - pan) / scale
  connectionState.value.x = (screenX - canvasPan.value.x) / canvasScale.value
  connectionState.value.y = (screenY - canvasPan.value.y) / canvasScale.value
}

// Global mouse up handler to cancel connection
const handleGlobalMouseUp = (event: MouseEvent) => {
  if (connectionState.value.isActive) {
    // Cancel connection if mouse is released without clicking on a target node
    // (The actual connection completion is handled by clicking on a node)
    // Only cancel if we're not on a valid target
    if (event.button === 2) {
      // Right click cancels
      cancelConnection()
    }
  }
}
</script>

<style scoped>
.workflow-node {
  cursor: move;
}

.connection-indicator {
  width: 8px;
  height: 8px;
  background-color: #3b82f6;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 1px #3b82f6;
}

/* Dot grid background for canvas */
.workflow-canvas {
  background-color: #f9fafb;
}

.canvas-background {
  background-color: #f9fafb;
  background-image: radial-gradient(circle, #d1d5db 1.5px, transparent 1.5px);
  background-size: 24px 24px;
  background-position: -1px -1px;
  z-index: 0;
}
</style>
