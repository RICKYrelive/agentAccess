<template>
  <div class="space-y-3 max-h-[550px] overflow-y-auto pr-2">
    <!-- Search Bar -->
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索 MCP..."
        class="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      />
      <svg class="absolute left-3 top-2.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>

    <!-- MCP Gateways Section -->
    <div v-if="filteredGateways.length > 0">
      <div class="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9V3m0 12c0 4.97-1.343 9-3 9" />
          </svg>
          <span class="text-sm font-medium text-slate-700">MCP 网关</span>
        </div>
        <span class="text-xs text-slate-500">{{ filteredGateways.length }} 个网关</span>
      </div>

      <div class="mt-2 ml-2 space-y-2">
        <div
          v-for="gateway in filteredGateways"
          :key="gateway.id"
          class="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
        >
          <div class="flex-1">
            <div class="text-sm font-medium text-slate-900">{{ gateway.name }}</div>
            <div class="text-xs text-slate-500">{{ gateway.mcpToolIds.length }} 个工具</div>
          </div>
          <button
            @click="toggleGateway(gateway.id)"
            :class="[
              'relative inline-flex items-center h-6 w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full',
              isGatewaySelected(gateway.id) ? 'bg-primary-600' : 'bg-slate-300',
            ]"
          >
            <span
              :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                isGatewaySelected(gateway.id) ? 'translate-x-6' : 'translate-x-1',
              ]"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- MCP Tools by Type -->
    <div v-for="typeItem in filteredToolTypes" :key="typeItem.name">
      <div class="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
        <span class="text-sm font-medium text-slate-700">{{ typeItem.displayName }}</span>
        <span class="text-xs text-slate-500">{{ typeItem.tools.length }} 个工具</span>
      </div>

      <!-- Tools in type - always expanded -->
      <div class="mt-2 ml-2 space-y-2">
        <div
          v-for="tool in typeItem.tools"
          :key="tool.id"
          class="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
        >
          <div class="flex-1">
            <div class="text-sm font-medium text-slate-900">{{ tool.name }}</div>
            <div class="text-xs text-slate-500 mt-1">{{ tool.description }}</div>
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
    <div v-if="filteredGateways.length === 0 && filteredToolTypes.length === 0" class="text-center py-6 text-slate-500 text-sm">
      {{ searchQuery ? '没有找到匹配的 MCP 工具或网关' : '暂无 MCP 工具或网关' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMCPManagementStore } from '@/stores/mcpManagement'

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

const mcpStore = useMCPManagementStore()

// Search state
const searchQuery = ref('')

// Get all MCP tools from store
const allTools = computed(() => mcpStore.mcpTools)

// Get all MCP gateways from store
const allGateways = computed(() => mcpStore.mcpGateways)

// Tool type display names
const toolTypeDisplayNames: Record<string, string> = {
  builtin: '内置工具',
  custom: '自定义工具',
  npx: 'NPX 包',
  uvx: 'UVX 包',
  database: '数据库',
}

// Group tools by type
const toolTypes = computed(() => {
  const types = new Map<string, typeof allTools.value>()

  allTools.value.forEach(tool => {
    if (!types.has(tool.type)) {
      types.set(tool.type, [])
    }
    types.get(tool.type)!.push(tool)
  })

  return Array.from(types.entries()).map(([type, tools]) => ({
    name: type,
    displayName: toolTypeDisplayNames[type] || type,
    tools,
  }))
})

// Filter gateways by search query
const filteredGateways = computed(() => {
  if (!searchQuery.value) return allGateways.value
  const query = searchQuery.value.toLowerCase()
  return allGateways.value.filter(gateway =>
    gateway.name.toLowerCase().includes(query) ||
    gateway.description.toLowerCase().includes(query)
  )
})

// Filter tool types and tools by search query
const filteredToolTypes = computed(() => {
  if (!searchQuery.value) return toolTypes.value

  const query = searchQuery.value.toLowerCase()
  return toolTypes.value
    .map(typeItem => ({
      name: typeItem.name,
      displayName: typeItem.displayName,
      tools: typeItem.tools.filter(tool =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query)
      ),
    }))
    .filter(typeItem => typeItem.tools.length > 0)
})

const isToolSelected = (toolId: string) => {
  return props.selectedTools.includes(toolId)
}

const isGatewaySelected = (gatewayId: string) => {
  return props.selectedTools.includes(`gateway:${gatewayId}`)
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

const toggleGateway = (gatewayId: string) => {
  const prefixedId = `gateway:${gatewayId}`
  const index = props.selectedTools.indexOf(prefixedId)
  const newSelected = [...props.selectedTools]

  if (index !== -1) {
    newSelected.splice(index, 1)
  } else {
    newSelected.push(prefixedId)
  }

  emit('update:selectedTools', newSelected)
}
</script>
