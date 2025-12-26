<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="$emit('close')">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">导入内置工具</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="px-6 py-4 overflow-y-auto max-h-[60vh]">
        <p class="text-sm text-gray-500 mb-4">选择要导入的内置 MCP 工具</p>
        <div class="space-y-2">
          <div
            v-for="tool in store.BUILTIN_TOOLS"
            :key="tool.id"
            :class="[
              'border rounded-lg p-4 hover:bg-gray-50 transition-colors',
              isToolImported(tool.id) ? 'bg-green-50 border-green-200' : 'border-gray-200',
            ]"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-base font-medium text-gray-900">{{ tool.name }}</h4>
                    <p class="text-sm text-gray-500">{{ tool.description }}</p>
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <span v-if="isToolImported(tool.id)" class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  已导入
                </span>
                <button
                  v-else
                  @click="importTool(tool.id)"
                  class="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  导入
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 flex justify-end">
        <button @click="$emit('close')" class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
          关闭
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMCPManagementStore } from '@/stores/mcpManagement'

defineEmits<{
  close: []
}>()

const store = useMCPManagementStore()

const isToolImported = (toolId: string) => {
  return store.builtinTools.some(t => t.name === store.BUILTIN_TOOLS.find(bt => bt.id === toolId)?.name)
}

const importTool = (toolId: string) => {
  store.importBuiltinTool(toolId)
}
</script>
