<template>
  <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
    <!-- Table Header -->
    <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Active Tools</h2>
        <span class="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400">
          {{ store.filteredTools.length }}
        </span>
      </div>
      <ToolSearchFilter />
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead class="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
          <tr>
            <th class="px-6 py-3 tracking-wider">Name</th>
            <th class="px-6 py-3 tracking-wider">Type</th>
            <th class="px-6 py-3 tracking-wider">Status</th>
            <th class="px-6 py-3 tracking-wider">Latency</th>
            <th class="px-6 py-3 tracking-wider">Last Sync</th>
            <th class="px-6 py-3 tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
          <tr
            v-for="tool in store.filteredTools"
            :key="tool.id"
            class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <!-- Name -->
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div :class="[
                  'w-8 h-8 rounded flex items-center justify-center flex-shrink-0',
                  getToolTypeConfig(tool).bgClass
                ]">
                  <svg :class="`w-4 h-4 ${getToolTypeConfig(tool).iconColorClass}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getToolTypeConfig(tool).iconPath" />
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-slate-900 dark:text-white">{{ tool.name }}</p>
                  <p v-if="tool.description" class="text-xs text-slate-500 truncate max-w-[150px]">{{ tool.description }}</p>
                </div>
              </div>
            </td>

            <!-- Type -->
            <td class="px-6 py-4 text-slate-600 dark:text-slate-400">
              {{ getToolTypeName(tool.type) }}
            </td>

            <!-- Status -->
            <td class="px-6 py-4">
              <span :class="[
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                getStatusBadgeConfig(tool.status).bgClass,
                getStatusBadgeConfig(tool.status).textClass,
                getStatusBadgeConfig(tool.status).borderClass
              ]">
                <span :class="[
                  'w-1.5 h-1.5 rounded-full',
                  getStatusBadgeConfig(tool.status).dotClass
                ]"></span>
                {{ getStatusBadgeConfig(tool.status).label }}
              </span>
            </td>

            <!-- Latency -->
            <td class="px-6 py-4 text-slate-600 dark:text-slate-400 font-mono text-xs">
              {{ formatLatency(tool.latency) }}
            </td>

            <!-- Last Sync -->
            <td class="px-6 py-4 text-slate-600 dark:text-slate-400">
              {{ formatRelativeTime(tool.lastSync) }}
            </td>

            <!-- Actions -->
            <td class="px-6 py-4 text-right">
              <div class="relative">
                <button
                  @click="toggleActionsMenu(tool.id)"
                  class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>

                <!-- Dropdown Menu -->
                <div
                  v-if="openActionsMenu === tool.id"
                  class="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-10"
                  @click.stop
                >
                  <button
                    @click="editTool(tool)"
                    class="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    @click="toggleTool(tool)"
                    class="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="tool.isEnabled ? 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' : 'M5 13l4 4L19 7'" />
                    </svg>
                    {{ tool.isEnabled ? 'Disable' : 'Enable' }}
                  </button>
                  <button
                    @click="deleteTool(tool.id)"
                    class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-if="store.filteredTools.length === 0">
            <td colspan="6" class="px-6 py-12 text-center">
              <div class="flex flex-col items-center">
                <svg class="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
                <p class="text-slate-500 dark:text-slate-400 text-sm">No tools found</p>
                <p class="text-slate-400 dark:text-slate-500 text-xs mt-1">Create a tool using the options above</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useMCPManagementStore } from '@/stores/mcpManagement'
import { formatRelativeTime, formatLatency, getStatusBadgeConfig, getToolTypeConfig, getToolTypeName } from '@/utils/mcpToolUtils'
import ToolSearchFilter from './ToolSearchFilter.vue'
import type { MCPTool } from '@/components/mcp-management/types'

const store = useMCPManagementStore()
const emit = defineEmits<{
  editTool: [tool: MCPTool]
}>()

const openActionsMenu = ref<string | null>(null)

const toggleActionsMenu = (toolId: string) => {
  openActionsMenu.value = openActionsMenu.value === toolId ? null : toolId
}

const editTool = (tool: MCPTool) => {
  openActionsMenu.value = null
  emit('editTool', tool)
}

const toggleTool = (tool: MCPTool) => {
  openActionsMenu.value = null
  store.toggleMCPTool(tool.id)
}

const deleteTool = (id: string) => {
  openActionsMenu.value = null
  if (confirm('Are you sure you want to delete this tool?')) {
    store.deleteMCPTool(id)
  }
}

// Close menu when clicking outside
const closeMenu = () => {
  openActionsMenu.value = null
}

onMounted(() => {
  document.addEventListener('click', closeMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenu)
})
</script>
