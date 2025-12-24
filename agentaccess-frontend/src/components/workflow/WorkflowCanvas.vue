<template>
  <div class="h-full flex flex-col bg-gray-50">
    <!-- Toolbar -->
    <div class="bg-white border-b border-gray-200 px-4 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <h3 class="text-lg font-medium text-gray-900">工作流编辑器</h3>
          <div class="flex items-center space-x-2 text-sm text-gray-500">
            <span>节点: {{ currentNodes.length }}</span>
            <span>•</span>
            <span>连接: {{ currentConnections.length }}</span>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <!-- FastGPT Status -->
          <div
            v-if="fastgptConnected"
            class="flex items-center space-x-1 px-2 py-1 bg-green-50 border border-green-200 rounded-md"
          >
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span class="text-xs text-green-700">FastGPT已连接</span>
          </div>

          <button
            @click="syncToFastGPT"
            :disabled="!fastgptConnected || isSyncing"
            :class="[
              'btn-secondary text-sm',
              (!fastgptConnected || isSyncing) && 'opacity-50 cursor-not-allowed'
            ]"
          >
            <svg v-if="isSyncing" class="w-4 h-4 animate-spin inline mr-1" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            {{ isSyncing ? '同步中...' : '同步到FastGPT' }}
          </button>
          <button
            @click="importFromFastGPT"
            :disabled="!fastgptConnected || isSyncing"
            :class="[
              'btn-secondary text-sm',
              (!fastgptConnected || isSyncing) && 'opacity-50 cursor-not-allowed'
            ]"
          >
            从FastGPT导入
          </button>
          <button
            @click="exportWorkflow"
            class="btn-secondary text-sm"
          >
            导出
          </button>
          <button
            @click="validateWorkflow"
            class="btn-secondary text-sm"
          >
            验证工作流
          </button>
          <button
            @click="clearCanvas"
            class="btn-secondary text-sm"
          >
            清空画布
          </button>
        </div>
      </div>
    </div>

    <!-- Canvas Area -->
    <div class="flex-1 flex">
      <!-- Node Palette -->
      <div class="w-64 bg-white border-r border-gray-200 p-4">
        <h4 class="text-sm font-medium text-gray-900 mb-4">节点类型</h4>
        <div class="space-y-2">
          <div
            v-for="nodeType in nodeTypes"
            :key="nodeType.type"
            draggable="true"
            @dragstart="onDragStart($event, nodeType.type)"
            class="p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-move hover:bg-gray-100 transition-colors"
          >
            <div class="flex items-center space-x-3">
              <div
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                  nodeType.bgColor
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
                <p class="text-sm font-medium text-gray-900">{{ nodeType.name }}</p>
                <p class="text-xs text-gray-500">{{ nodeType.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Canvas -->
      <div class="flex-1 relative overflow-hidden">
        <div
          ref="canvasRef"
          class="workflow-canvas w-full h-full relative"
          style="min-height: 400px; z-index: 10;"
          @drop="onDrop"
          @dragover="onDragOver"
          @dragenter.prevent
          @click="clearSelection"
          @mousemove="onCanvasMouseMove"
          @click.right="cancelConnection"
        >
          <div
            v-if="currentNodes.length === 0"
            class="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none"
          >
            <div class="text-center">
              <svg
                class="mx-auto h-12 w-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
          <!-- Connection Lines -->
          <svg class="absolute inset-0 w-full h-full" style="z-index: 1;" @click="clearConnectionSelection">
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
              style="pointer-events: stroke;"
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
              style="pointer-events: none;"
            />
          </svg>

          <!-- Workflow Nodes -->
          <div
            v-for="node in currentNodes"
            :key="node.id"
            :style="{
              position: 'absolute',
              left: `${node.position.x}px`,
              top: `${node.position.y}px`,
              zIndex: 20
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
              top: `${connectionState.y}px`
            }"
          />
        </div>
      </div>
    </div>

    <!-- Validation Errors -->
    <div
      v-if="validationErrors.length > 0"
      class="absolute bottom-4 left-4 bg-red-50 border border-red-200 rounded-lg p-3 max-w-md"
    >
      <div class="flex items-start space-x-2">
        <svg class="w-5 h-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useWorkflowStore } from '@/stores/workflow'
import { downloadWorkflowAsJson } from '@/utils/workflowExport'
import type { WorkflowNode as WorkflowNodeType, WorkflowNodeType as NodeOptionType } from '@/types/workflow'
import WorkflowNode from './WorkflowNode.vue'

const workflowStore = useWorkflowStore()
const canvasRef = ref<HTMLElement>()

// Use storeToRefs to maintain reactivity
const { currentNodes, currentConnections, selectedNodeId, fastgptConnected, syncStatus } = storeToRefs(workflowStore)

// Local state
const validationErrors = ref<string[]>([])
const connectionState = ref({
  isActive: false,
  x: 0,
  y: 0,
  sourceNodeId: null as string | null,
  targetNodeId: null as string | null
})

const selectedConnectionId = ref<string | null>(null)

// Computed states
const isSyncing = computed(() => syncStatus.value === 'syncing')

// Node types available in the palette
const nodeTypes = [
  {
    type: 'input' as NodeOptionType,
    name: '输入',
    description: '接收用户输入',
    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-600'
  },
  {
    type: 'web-search' as NodeOptionType,
    name: '网络搜索',
    description: '搜索网络信息',
    icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    bgColor: 'bg-cyan-100',
    textColor: 'text-cyan-600'
  },
  {
    type: 'annotated-data-retrieval' as NodeOptionType,
    name: '标注数据检索',
    description: '检索标注数据',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-600'
  },
  {
    type: 'question-rewrite' as NodeOptionType,
    name: '问题重写',
    description: '重写用户问题',
    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-600'
  },
  {
    type: 'knowledge-retrieval' as NodeOptionType,
    name: '知识检索',
    description: '从知识库检索信息',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-600'
  },
  {
    type: 'llm-call' as NodeOptionType,
    name: 'LLM调用',
    description: '调用大语言模型',
    icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
    bgColor: 'bg-rose-100',
    textColor: 'text-rose-600'
  },
  {
    type: 'data-processing' as NodeOptionType,
    name: '数据处理',
    description: '处理和转换数据',
    icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-600'
  },
  {
    type: 'condition' as NodeOptionType,
    name: '条件判断',
    description: '根据条件分支',
    icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-600'
  },
  {
    type: 'code-execution' as NodeOptionType,
    name: '代码执行',
    description: '执行自定义代码',
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-600'
  },
  {
    type: 'output' as NodeOptionType,
    name: '输出',
    description: '输出最终结果',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    bgColor: 'bg-teal-100',
    textColor: 'text-teal-600'
  }
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
  const x = Math.max(0, event.clientX - rect.left - 100)
  const y = Math.max(0, event.clientY - rect.top - 40)

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
  const node = currentNodes.value.find(n => n.id === nodeId)
  if (!node) return { x: 0, y: 0, leftX: 0, rightX: 0 }

  // Node dimensions (approximate based on WorkflowNode.vue)
  const nodeWidth = 200
  const nodeHeight = 60

  // Return edge positions for connection points
  return {
    x: node.position.x + nodeWidth / 2,  // Center x
    y: node.position.y + nodeHeight / 2, // Center y
    leftX: node.position.x,               // Left edge
    rightX: node.position.x + nodeWidth,  // Right edge
    topY: node.position.y,                // Top edge
    bottomY: node.position.y + nodeHeight // Bottom edge
  }
}

const getConnectionPath = (connection: any) => {
  const sourcePos = getNodePosition(connection.sourceNodeId)
  const targetPos = getNodePosition(connection.targetNodeId)

  if (sourcePos.x === 0 || sourcePos.y === 0 || targetPos.x === 0 || targetPos.y === 0) {
    return ''
  }

  // Start from right edge of source, end at left edge of target
  const startX = sourcePos.rightX
  const startY = sourcePos.y
  const endX = targetPos.leftX
  const endY = targetPos.y

  // Larger corner radius
  const radius = 20

  // Determine path direction
  if (endX > startX + 20) {
    // Target is to the right - simple L-shape with rounded corner
    const midX = (startX + endX) / 2
    const verticalDist = Math.abs(endY - startY)

    if (verticalDist < radius * 2) {
      // Too close for full radius, use smaller radius
      const smallRadius = Math.max(5, verticalDist / 2)
      return `M ${startX} ${startY} L ${midX - smallRadius} ${startY} Q ${midX} ${startY} ${midX} ${startY + (endY > startY ? smallRadius : -smallRadius)} L ${midX} ${endY - (endY > startY ? smallRadius : -smallRadius)} Q ${midX} ${endY} ${midX + smallRadius} ${endY} L ${endX} ${endY}`
    }
    // Full radius L-shape
    return `M ${startX} ${startY} L ${midX - radius} ${startY} Q ${midX} ${startY} ${midX} ${startY + (endY > startY ? radius : -radius)} L ${midX} ${endY - (endY > startY ? radius : -radius)} Q ${midX} ${endY} ${midX + radius} ${endY} L ${endX} ${endY}`
  } else {
    // Target is to the left - step-around path with rounded corners
    const stepX = Math.max(startX, endX) + 50
    return `M ${startX} ${startY} L ${stepX - radius} ${startY} Q ${stepX} ${startY} ${stepX} ${startY + radius} L ${stepX} ${endY - radius} Q ${stepX} ${endY} ${stepX - radius} ${endY} L ${endX} ${endY}`
  }
}

const getActiveConnectionPath = () => {
  if (!connectionState.value.sourceNodeId) return ''

  const sourcePos = getNodePosition(connectionState.value.sourceNodeId)

  if (sourcePos.x === 0 || sourcePos.y === 0) return ''

  // Start from right edge of source node
  const startX = sourcePos.rightX
  const startY = sourcePos.y
  const currentX = connectionState.value.x || startX + 100
  const currentY = connectionState.value.y || startY
  const radius = 20

  // Draw L-shape to mouse position with rounded corner
  const midX = (startX + currentX) / 2
  const verticalDist = Math.abs(currentY - startY)

  if (verticalDist < radius) {
    // Too close for full radius
    const smallRadius = Math.max(5, verticalDist / 2)
    return `M ${startX} ${startY} L ${midX} ${startY} Q ${midX} ${startY + (currentY > startY ? smallRadius : -smallRadius)} ${midX} ${currentY} L ${currentX} ${currentY}`
  }

  return `M ${startX} ${startY} L ${midX} ${startY} Q ${midX} ${startY + (currentY > startY ? radius : -radius)} ${midX} ${startY + (currentY > startY ? radius : -radius)} L ${midX} ${currentY} L ${currentX} ${currentY}`
}

const startConnection = (nodeId: string) => {
  connectionState.value = {
    isActive: true,
    x: 0,
    y: 0,
    sourceNodeId: nodeId,
    targetNodeId: null
  }
}

const onOutputConnection = (nodeId: string) => {
  // Start a new connection from this node's output
  connectionState.value = {
    isActive: true,
    x: 0,
    y: 0,
    sourceNodeId: nodeId,
    targetNodeId: null
  }
}

const onInputConnection = (nodeId: string) => {
  // Complete the connection to this node's input
  if (connectionState.value.isActive && connectionState.value.sourceNodeId && connectionState.value.sourceNodeId !== nodeId) {
    workflowStore.addConnection(connectionState.value.sourceNodeId, nodeId)

    // Reset connection state
    connectionState.value = {
      isActive: false,
      x: 0,
      y: 0,
      sourceNodeId: null,
      targetNodeId: null
    }
  }
}

const onCanvasMouseMove = (event: MouseEvent) => {
  if (!connectionState.value.isActive || !canvasRef.value) return

  const rect = canvasRef.value.getBoundingClientRect()
  connectionState.value.x = event.clientX - rect.left
  connectionState.value.y = event.clientY - rect.top
}

const cancelConnection = () => {
  // Reset connection state on right click
  connectionState.value = {
    isActive: false,
    x: 0,
    y: 0,
    sourceNodeId: null,
    targetNodeId: null
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

const clearCanvas = () => {
  if (workflowStore.currentWorkflow) {
    workflowStore.currentWorkflow.nodes = [
      {
        id: 'start',
        type: 'start',
        position: { x: 100, y: 100 },
        configuration: {},
        status: 'idle'
      }
    ]
    workflowStore.currentWorkflow.connections = []
    clearSelection()
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
        const workflowList = workflows.map(w => `${w.id}: ${w.name}`).join('\n')
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
})
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
  background-image: radial-gradient(circle, #d1d5db 1.5px, transparent 1.5px);
  background-size: 24px 24px;
  background-position: -1px -1px;
}
</style>