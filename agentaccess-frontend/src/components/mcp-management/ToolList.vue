<template>
  <div class="space-y-2 max-h-64 overflow-y-auto" @click.stop>
    <div v-if="tools.length === 0" class="text-center py-8 text-slate-500 text-sm">
      <svg class="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p>没有找到匹配的工具</p>
    </div>

    <div
      v-for="tool in tools"
      :key="tool.id"
      :class="[
        'flex items-center justify-between p-3 border rounded-lg transition-colors',
        isToolSelected(tool.id) ? 'border-primary-300 bg-primary-50' : 'border-slate-200 hover:bg-slate-50',
      ]"
    >
      <div class="flex items-center space-x-3 flex-1 min-w-0">
        <div :class="['w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', getToolIconClass(tool.type)]">
          <svg :class="['w-4 h-4', getToolIconColorClass(tool.type)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getToolIconPath(tool.type)" />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-slate-900 truncate">{{ tool.name }}</span>
            <span :class="['text-xs px-1.5 py-0.5 rounded', getTypeBadgeClass(tool.type)]">
              {{ getTypeName(tool.type) }}
            </span>
          </div>
          <p class="text-xs text-slate-500 truncate">{{ tool.description }}</p>
        </div>
        <div class="flex items-center space-x-2">
          <span :class="['text-xs px-1.5 py-0.5 rounded', getStatusBadgeClass(tool.isEnabled)]">
            {{ tool.isEnabled ? '已启用' : '已禁用' }}
          </span>
        </div>
      </div>

      <button
        @click="$emit('toggle-tool', tool.id)"
        :class="[
          'ml-2 p-1.5 rounded transition-colors',
          isToolSelected(tool.id)
            ? 'text-primary-600 hover:bg-primary-100'
            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100',
        ]"
        :title="isToolSelected(tool.id) ? '移除' : '添加'"
      >
        <svg v-if="isToolSelected(tool.id)" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MCPTool, MCPToolType } from '@/components/mcp-management/types'

interface Props {
  tools: MCPTool[]
  selectedToolIds: string[]
}

const props = defineProps<Props>()

defineEmits<{
  'toggle-tool': [toolId: string]
}>()

const isToolSelected = (id: string) => {
  return props.selectedToolIds.includes(id)
}

const getTypeName = (type: MCPToolType) => {
  const names = { builtin: '内置', custom: '自定义', npx: 'npx', uvx: 'uvx', database: '数据库' }
  return names[type] || type
}

const getTypeBadgeClass = (type: MCPToolType) => {
  const classes = {
    builtin: 'bg-blue-100 text-blue-700',
    custom: 'bg-purple-100 text-purple-700',
    npx: 'bg-green-100 text-green-700',
    uvx: 'bg-yellow-100 text-yellow-700',
    database: 'bg-orange-100 text-orange-700',
  }
  return classes[type] || 'bg-slate-100 text-slate-700'
}

const getStatusBadgeClass = (enabled: boolean) => {
  return enabled ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
}

const getToolIconClass = (type: MCPToolType) => {
  const classes = { builtin: 'bg-blue-100', custom: 'bg-purple-100', npx: 'bg-green-100', uvx: 'bg-yellow-100', database: 'bg-orange-100' }
  return classes[type] || 'bg-slate-100'
}

const getToolIconColorClass = (type: MCPToolType) => {
  const classes = { builtin: 'text-blue-600', custom: 'text-purple-600', npx: 'text-green-600', uvx: 'text-yellow-600', database: 'text-orange-600' }
  return classes[type] || 'text-slate-600'
}

const getToolIconPath = (type: MCPToolType) => {
  const paths = {
    builtin: 'M5 13l4 4L19 7',
    custom: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
    npx: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    uvx: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12',
    database: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s-8 1.79-8 4',
  }
  return paths[type] || 'M5 13l4 4L19 7'
}
</script>
