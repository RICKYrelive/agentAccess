<template>
  <div class="h-full flex flex-col bg-white overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
    <!-- Page Header -->
    <div class="px-8 py-6 border-b border-gray-200">
      <h2 class="text-2xl font-semibold text-gray-900">MCP 工具管理</h2>
      <p class="text-gray-500 mt-1">管理内置和自定义 MCP 工具</p>
    </div>

    <!-- Creation Section -->
    <div class="px-8 py-6 border-b border-gray-200">
      <h3 class="text-lg font-medium text-gray-900 mb-4">创建 MCP 工具</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Builtin Import -->
        <button
          @click="showBuiltinDialog = true"
          class="p-4 border-2 border-dashed border-primary-300 rounded-lg hover:bg-primary-50 hover:border-primary-400 transition-colors"
        >
          <svg class="w-8 h-8 mx-auto mb-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span class="text-sm font-medium text-gray-700">从官方商店导入</span>
        </button>

        <!-- Custom Tool -->
        <button
          @click="showCustomDialog = true"
          class="p-4 border-2 border-dashed border-purple-300 rounded-lg hover:bg-purple-50 hover:border-purple-400 transition-colors"
        >
          <svg class="w-8 h-8 mx-auto mb-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <span class="text-sm font-medium text-gray-700">自定义第三方工具</span>
        </button>

        <!-- Image Deployment -->
        <button
          @click="showImageDialog = true"
          class="p-4 border-2 border-dashed border-blue-300 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-colors"
        >
          <svg class="w-8 h-8 mx-auto mb-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span class="text-sm font-medium text-gray-700">导入镜像</span>
        </button>
      </div>
    </div>

    <!-- Tools Display -->
    <div class="px-8 py-6 flex-1">
      <h3 class="text-lg font-medium text-gray-900 mb-4">MCP 工具列表 ({{ store.mcpTools.length }})</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="tool in store.mcpTools"
          :key="tool.id"
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-center space-x-3">
              <div
                :class="[
                  'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                  getToolIconClass(tool.type),
                ]"
              >
                <svg class="w-5 h-5" :class="getToolIconColorClass(tool.type)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getToolIconPath(tool.type)" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-base font-medium text-gray-900 truncate">{{ tool.name }}</h4>
                <p class="text-sm text-gray-500 truncate">{{ tool.description }}</p>
              </div>
            </div>
          </div>

          <div class="mt-4 flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span :class="getTypeBadgeClass(tool.type)" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium">
                {{ getTypeName(tool.type) }}
              </span>
              <span :class="getStatusBadgeClass(tool.status)" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium">
                {{ getStatusName(tool.status) }}
              </span>
            </div>
            <div class="flex items-center space-x-1">
              <button
                @click="editTool(tool)"
                class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                title="编辑"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                @click="toggleTool(tool.id)"
                :class="[
                  'p-1.5 rounded',
                  tool.isEnabled ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100',
                ]"
                :title="tool.isEnabled ? '禁用' : '启用'"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                @click="deleteTool(tool.id)"
                class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                title="删除"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Builtin Tool Import Dialog -->
    <BuiltinToolImportDialog
      v-if="showBuiltinDialog"
      @close="showBuiltinDialog = false"
    />

    <!-- Custom Tool Configuration Dialog -->
    <CustomToolConfigDialog
      v-if="showCustomDialog"
      :tool="editingTool"
      @close="closeCustomDialog"
    />

    <!-- Image Deployment Dialog -->
    <ImageDeploymentDialog
      v-if="showImageDialog"
      :tool="editingTool"
      @close="closeImageDialog"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMCPManagementStore } from '@/stores/mcpManagement'
import type { MCPTool, MCPToolType } from '../mcp-management/types'
import BuiltinToolImportDialog from './BuiltinToolImportDialog.vue'
import CustomToolConfigDialog from './CustomToolConfigDialog.vue'
import ImageDeploymentDialog from './ImageDeploymentDialog.vue'

const store = useMCPManagementStore()

const showBuiltinDialog = ref(false)
const showCustomDialog = ref(false)
const showImageDialog = ref(false)
const editingTool = ref<MCPTool | null>(null)

const getTypeName = (type: MCPToolType) => {
  const names = {
    builtin: '内置',
    custom: '自定义',
    npx: 'npx',
    uvx: 'uvx',
  }
  return names[type] || type
}

const getStatusName = (status: string) => {
  const names = {
    active: '已启用',
    inactive: '已禁用',
    error: '错误',
  }
  return names[status] || status
}

const getTypeBadgeClass = (type: MCPToolType) => {
  const classes = {
    builtin: 'bg-blue-100 text-blue-800',
    custom: 'bg-purple-100 text-purple-800',
    npx: 'bg-green-100 text-green-800',
    uvx: 'bg-yellow-100 text-yellow-800',
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

const getStatusBadgeClass = (status: string) => {
  const classes = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    error: 'bg-red-100 text-red-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getToolIconClass = (type: MCPToolType) => {
  const classes = {
    builtin: 'bg-blue-100',
    custom: 'bg-purple-100',
    npx: 'bg-green-100',
    uvx: 'bg-yellow-100',
  }
  return classes[type] || 'bg-gray-100'
}

const getToolIconColorClass = (type: MCPToolType) => {
  const classes = {
    builtin: 'text-blue-600',
    custom: 'text-purple-600',
    npx: 'text-green-600',
    uvx: 'text-yellow-600',
  }
  return classes[type] || 'text-gray-600'
}

const getToolIconPath = (type: MCPToolType) => {
  const paths = {
    builtin: 'M5 13l4 4L19 7',
    custom: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
    npx: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    uvx: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12',
  }
  return paths[type] || 'M5 13l4 4L19 7'
}

const toggleTool = (id: string) => {
  store.toggleMCPTool(id)
}

const editTool = (tool: MCPTool) => {
  editingTool.value = tool
  if (tool.type === 'custom') {
    showCustomDialog.value = true
  } else if (tool.type === 'npx' || tool.type === 'uvx') {
    showImageDialog.value = true
  }
}

const deleteTool = (id: string) => {
  if (confirm('确定要删除这个 MCP 工具吗？')) {
    store.deleteMCPTool(id)
  }
}

const closeCustomDialog = () => {
  showCustomDialog.value = false
  editingTool.value = null
}

const closeImageDialog = () => {
  showImageDialog.value = false
  editingTool.value = null
}
</script>
