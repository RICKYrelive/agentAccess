<template>
  <div
    class="workflow-node bg-white border-2 rounded-xl shadow-sm cursor-move transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    :class="[
      {
        'border-primary shadow-lg shadow-primary/10 ring-2 ring-primary/20': isSelected,
        'border-slate-200': !isSelected,
      },
      getNodeClasses(),
    ]"
    @click="handleClick"
    @mousedown="startDrag"
  >
    <!-- Node Content -->
    <div class="flex items-center space-x-3 p-3">
      <div
        :class="[
          'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
          getNodeStyle().bgColor,
        ]"
      >
        <svg
          class="w-5 h-5"
          :class="getNodeStyle().textColor"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            :d="getNodeStyle().icon"
          />
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-slate-900">{{ getNodeStyle().name }}</p>
        <p class="text-xs text-slate-500">{{ getNodeStyle().description }}</p>
      </div>
      <!-- Status Indicator -->
      <div v-if="node.status !== 'idle'" class="w-2 h-2 rounded-full" :class="getStatusClasses()" />
    </div>

    <!-- Node Actions -->
    <div
      v-if="isSelected"
      class="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2"
    >
      <div class="flex space-x-1">
        <button
          @click.stop="connectNode"
          class="p-1 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
          title="连接节点"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        </button>
        <button
          v-if="node.type !== 'start'"
          @click.stop="$emit('delete', node.id)"
          class="p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          title="删除节点"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Connection Points -->
    <div
      v-if="node.type !== 'end'"
      class="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2"
      @click.stop="onOutputPoint"
    >
      <div
        class="w-3 h-3 bg-primary border-2 border-white rounded-full cursor-pointer hover:bg-primary-dark hover:scale-125 transition-all duration-150"
        title="输出连接点"
      />
    </div>
    <div
      v-if="node.type !== 'start'"
      class="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2"
      @click.stop="onInputPoint"
    >
      <div
        class="w-3 h-3 bg-slate-400 border-2 border-white rounded-full cursor-pointer hover:bg-slate-500 hover:scale-125 transition-all duration-150"
        title="输入连接点"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { WorkflowNode } from '@/types/workflow'

interface Props {
  node: WorkflowNode
  isSelected: boolean
}

interface Emits {
  (e: 'select', nodeId: string): void
  (e: 'update', nodeId: string, updates: Partial<WorkflowNode>): void
  (e: 'delete', nodeId: string): void
  (e: 'connect', nodeId: string): void
  (e: 'connect-output', nodeId: string): void
  (e: 'connect-input', nodeId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const hasMoved = ref(false)

const getNodeStyle = () => {
  switch (props.node.type) {
    case 'start':
      return {
        name: '开始',
        description: '工作流起点',
        icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z',
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-600',
      }
    case 'input':
      return {
        name: '输入',
        description: '接收用户输入',
        icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-600',
      }
    case 'web-search':
      return {
        name: '网络搜索',
        description: '搜索网络信息',
        icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
        bgColor: 'bg-cyan-100',
        textColor: 'text-cyan-600',
      }
    case 'annotated-data-retrieval':
      return {
        name: '标注数据检索',
        description: '检索标注数据',
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-600',
      }
    case 'question-rewrite':
      return {
        name: '问题重写',
        description: '重写用户问题',
        icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
        bgColor: 'bg-indigo-100',
        textColor: 'text-indigo-600',
      }
    case 'knowledge-retrieval':
      return {
        name: '知识检索',
        description: '从知识库检索信息',
        icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-600',
      }
    case 'llm-call':
      return {
        name: 'LLM调用',
        description: '调用大语言模型',
        icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
        bgColor: 'bg-rose-100',
        textColor: 'text-rose-600',
      }
    case 'data-processing':
      return {
        name: '数据处理',
        description: '处理和转换数据',
        icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
        bgColor: 'bg-amber-100',
        textColor: 'text-amber-600',
      }
    case 'condition':
      return {
        name: '条件判断',
        description: '根据条件分支',
        icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-600',
      }
    case 'code-execution':
      return {
        name: '代码执行',
        description: '执行自定义代码',
        icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
        bgColor: 'bg-emerald-100',
        textColor: 'text-emerald-600',
      }
    case 'output':
      return {
        name: '输出',
        description: '输出最终结果',
        icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        bgColor: 'bg-teal-100',
        textColor: 'text-teal-600',
      }
    case 'end':
      return {
        name: '结束',
        description: '工作流终点',
        icon: 'M6 18L18 6M6 6l12 12',
        bgColor: 'bg-slate-100',
        textColor: 'text-slate-600',
      }
    default:
      return {
        name: '未知节点',
        description: '未知节点类型',
        icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        bgColor: 'bg-slate-100',
        textColor: 'text-slate-600',
      }
  }
}

const getNodeClasses = () => {
  switch (props.node.type) {
    case 'start':
    case 'input':
      return 'ring-purple-500 ring-opacity-50'
    case 'web-search':
      return 'ring-cyan-500 ring-opacity-50'
    case 'annotated-data-retrieval':
      return 'ring-blue-500 ring-opacity-50'
    case 'question-rewrite':
      return 'ring-indigo-500 ring-opacity-50'
    case 'knowledge-retrieval':
      return 'ring-orange-500 ring-opacity-50'
    case 'llm-call':
      return 'ring-rose-500 ring-opacity-50'
    case 'data-processing':
      return 'ring-amber-500 ring-opacity-50'
    case 'condition':
      return 'ring-yellow-500 ring-opacity-50'
    case 'code-execution':
      return 'ring-emerald-500 ring-opacity-50'
    case 'output':
      return 'ring-teal-500 ring-opacity-50'
    case 'end':
      return 'ring-slate-500 ring-opacity-50'
    default:
      return 'ring-slate-500 ring-opacity-50'
  }
}

const getStatusClasses = () => {
  switch (props.node.status) {
    case 'running':
      return 'bg-blue-500 animate-pulse'
    case 'completed':
      return 'bg-green-500'
    case 'error':
      return 'bg-red-500'
    default:
      return 'bg-slate-300'
  }
}

const startDrag = (event: MouseEvent) => {
  // Only start drag if left mouse button
  if (event.button !== 0) return

  isDragging.value = true
  hasMoved.value = false
  dragStart.value = {
    x: event.clientX - props.node.position.x,
    y: event.clientY - props.node.position.y,
  }

  document.addEventListener('mousemove', onDrag, { passive: true })
  document.addEventListener('mouseup', stopDrag, { once: true })
}

const onDrag = (event: MouseEvent) => {
  if (!isDragging.value) return

  const newX = event.clientX - dragStart.value.x
  const newY = event.clientY - dragStart.value.y

  // Check if actually moved (more than 3 pixels)
  if (Math.abs(newX - props.node.position.x) > 3 || Math.abs(newY - props.node.position.y) > 3) {
    hasMoved.value = true
    emit('update', props.node.id, {
      position: {
        x: Math.max(0, newX),
        y: Math.max(0, newY),
      },
    })
  }
}

const stopDrag = () => {
  isDragging.value = false
}

const handleClick = (event: MouseEvent) => {
  // Only emit select if we didn't drag
  if (!hasMoved.value) {
    emit('select', props.node.id)
  }
}

const connectNode = () => {
  emit('connect', props.node.id)
}

const onOutputPoint = () => {
  emit('connect-output', props.node.id)
}

const onInputPoint = () => {
  emit('connect-input', props.node.id)
}
</script>

<style scoped>
.workflow-node {
  min-width: 200px;
  max-width: 250px;
}

.workflow-node:hover {
  transform: translateY(-1px);
}

.workflow-node.ring-primary-500 {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>
