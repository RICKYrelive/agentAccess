<template>
  <div class="h-full flex flex-col bg-slate-50 dark:bg-slate-950 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
    <!-- Page Header -->
    <div class="px-8 py-10 relative">
      <!-- Background gradient effects -->
      <div class="absolute top-0 right-0 w-full h-[200px] bg-gradient-to-bl from-blue-50/80 via-indigo-50/50 to-transparent dark:from-blue-900/10 dark:via-indigo-900/5 dark:to-transparent pointer-events-none"></div>

      <div class="relative z-10 flex items-start justify-between">
        <div class="max-w-2xl">
          <h1 class="text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">MCP 工具管理</h1>
          <p class="text-slate-500 dark:text-slate-400 text-lg">管理内置和自定义 MCP 工具，配置和监控您的工具集成。</p>
        </div>

        <!-- Decorative Icons -->
        <div class="relative w-48 h-40 hidden lg:block">
          <div class="absolute -top-2 right-8 p-4 py-6 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl shadow-xl transform rotate-12 opacity-90">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div class="absolute top-12 right-24 p-3 py-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-100 dark:border-slate-700 transform -rotate-6">
            <svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Overview Cards -->
    <div class="px-8 flex-1">
      <MCPStatusCards />

      <!-- Tool Sources Section -->
      <ToolSourcesSection
        @open-builtin="showBuiltinDialog = true"
        @open-custom="showCustomDialog = true"
        @open-image="showImageDialog = true"
        @open-openapi="showOpenAPIDialog = true"
      />

      <!-- Active Tools Table -->
      <div class="pb-10">
        <ActiveToolsTable @edit-tool="editTool" />
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

    <!-- OpenAPI Import Dialog -->
    <OpenAPIImportDialog
      v-if="showOpenAPIDialog"
      @close="showOpenAPIDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMCPManagementStore } from '@/stores/mcpManagement'
import type { MCPTool } from '@/components/mcp-management/types'
import MCPStatusCards from './MCPStatusCards.vue'
import ToolSourcesSection from './ToolSourcesSection.vue'
import ActiveToolsTable from './ActiveToolsTable.vue'
import BuiltinToolImportDialog from './BuiltinToolImportDialog.vue'
import CustomToolConfigDialog from './CustomToolConfigDialog.vue'
import ImageDeploymentDialog from './ImageDeploymentDialog.vue'
import OpenAPIImportDialog from './OpenAPIImportDialog.vue'

const store = useMCPManagementStore()

const showBuiltinDialog = ref(false)
const showCustomDialog = ref(false)
const showImageDialog = ref(false)
const showOpenAPIDialog = ref(false)
const editingTool = ref<MCPTool | null>(null)

const editTool = (tool: MCPTool) => {
  editingTool.value = tool
  if (tool.type === 'custom') {
    showCustomDialog.value = true
  } else if (tool.type === 'npx' || tool.type === 'uvx') {
    showImageDialog.value = true
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
