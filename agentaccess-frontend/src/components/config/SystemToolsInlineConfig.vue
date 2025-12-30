<template>
  <div class="space-y-3 max-h-[550px] overflow-y-auto pr-2">
    <!-- Search Bar -->
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索系统工具..."
        class="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      />
      <svg class="absolute left-3 top-2.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>

    <!-- Sandbox Tools Section - always expanded -->
    <div v-if="filteredSandboxTools.length > 0">
      <div class="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
        <span class="text-sm font-medium text-slate-700">沙箱环境</span>
        <span class="text-xs text-slate-500">{{ filteredSandboxTools.length }} 个工具</span>
      </div>

      <div class="mt-2 ml-2 space-y-2">
        <div
          v-for="tool in filteredSandboxTools"
          :key="tool.id"
          class="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
        >
          <div class="flex items-center space-x-3 flex-1">
            <div :class="['w-8 h-8 rounded-lg flex items-center justify-center', tool.iconBg]">
              <svg :class="['w-4 h-4', tool.iconColor]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path :d="tool.icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
              </svg>
            </div>
            <div>
              <div class="text-sm font-medium text-slate-900">{{ tool.name }}</div>
              <div class="text-xs text-slate-500">{{ tool.description }}</div>
            </div>
          </div>
          <button
            @click="toggleTool(tool.id)"
            :class="[
              'relative inline-flex items-center h-6 w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full',
              isToolSelected(tool.id) ? 'bg-primary-600' : 'bg-slate-300',
            ]"
          >
            <span
              :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                isToolSelected(tool.id) ? 'translate-x-6' : 'translate-x-1',
              ]"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Builtin Tools Section - always expanded -->
    <div v-if="filteredBuiltinTools.length > 0">
      <div class="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
        <span class="text-sm font-medium text-slate-700">内置工具</span>
        <span class="text-xs text-slate-500">{{ filteredBuiltinTools.length }} 个工具</span>
      </div>

      <div class="mt-2 ml-2 space-y-2">
        <div
          v-for="tool in filteredBuiltinTools"
          :key="tool.id"
          class="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
        >
          <div class="flex items-center space-x-3 flex-1">
            <div :class="['w-8 h-8 rounded-lg flex items-center justify-center', tool.iconBg]">
              <svg :class="['w-4 h-4', tool.iconColor]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path :d="tool.icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
              </svg>
            </div>
            <div>
              <div class="text-sm font-medium text-slate-900">{{ tool.name }}</div>
              <div class="text-xs text-slate-500">{{ tool.description }}</div>
            </div>
          </div>
          <button
            @click="toggleTool(tool.id)"
            :class="[
              'relative inline-flex items-center h-6 w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full',
              isToolSelected(tool.id) ? 'bg-primary-600' : 'bg-slate-300',
            ]"
          >
            <span
              :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                isToolSelected(tool.id) ? 'translate-x-6' : 'translate-x-1',
              ]"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- No tools message -->
    <div v-if="filteredSandboxTools.length === 0 && filteredBuiltinTools.length === 0" class="text-center py-6 text-slate-500 text-sm">
      {{ searchQuery ? '没有找到匹配的系统工具' : '暂无可用工具' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface SystemTool {
  id: string
  name: string
  description: string
  icon: string
  iconBg: string
  iconColor: string
}

interface Props {
  selectedTools?: string[]
}

interface Emits {
  (e: 'update:selectedTools', value: string[]): void
}

const props = withDefaults(defineProps<Props>(), {
  selectedTools: () => [],
})

const emit = defineEmits<Emits>()

// Search state
const searchQuery = ref('')

const sandboxTools: SystemTool[] = [
  {
    id: 'code-exec',
    name: '代码执行',
    description: '在沙箱环境中执行代码',
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
  {
    id: 'browser',
    name: '浏览器',
    description: '使用浏览器访问网页',
    icon: 'M21 12a9 9 0 01-9 9m9 9a9 9 0 019-9m9 9H1m11-9v9',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    id: 'terminal',
    name: '终端',
    description: '执行命令行操作',
    icon: 'M4 17l6-6-6 6M4 7h16',
    iconBg: 'bg-slate-700',
    iconColor: 'text-white',
  },
]

const builtinTools: SystemTool[] = [
  {
    id: 'time-tool',
    name: '时间工具',
    description: '获取当前时间信息',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    id: 'web-search',
    name: '联网搜索',
    description: '搜索网络信息',
    icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    id: 'ocr',
    name: 'OCR识别',
    description: '识别图片中的文字',
    icon: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0118.07 5H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z',
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
  },
]

// Filter sandbox tools by search query
const filteredSandboxTools = computed(() => {
  if (!searchQuery.value) return sandboxTools
  const query = searchQuery.value.toLowerCase()
  return sandboxTools.filter(tool =>
    tool.name.toLowerCase().includes(query) ||
    tool.description.toLowerCase().includes(query)
  )
})

// Filter builtin tools by search query
const filteredBuiltinTools = computed(() => {
  if (!searchQuery.value) return builtinTools
  const query = searchQuery.value.toLowerCase()
  return builtinTools.filter(tool =>
    tool.name.toLowerCase().includes(query) ||
    tool.description.toLowerCase().includes(query)
  )
})

const isToolSelected = (toolId: string) => {
  return props.selectedTools.includes(toolId)
}

const toggleTool = (toolId: string) => {
  const index = props.selectedTools.indexOf(toolId)
  const newSelected = [...props.selectedTools]

  if (index !== -1) {
    newSelected.splice(index, 1)
  } else {
    newSelected.push(toolId)
  }

  emit('update:selectedTools', newSelected)
}
</script>
