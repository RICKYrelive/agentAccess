<template>
  <div class="bg-white rounded-lg border border-slate-200 shadow-sm p-3 transition-all hover:shadow-md hover:border-blue-300">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3 flex-1 min-w-0">
        <div class="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
          {{ tool.icon }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center space-x-2">
            <h3 class="text-sm font-semibold text-slate-900 truncate">{{ tool.name }}</h3>
            <span class="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full flex-shrink-0">{{ tool.category }}</span>
          </div>
          <p class="text-xs text-slate-500 truncate">{{ tool.description }}</p>
        </div>
      </div>
      <div class="flex items-center space-x-2 flex-shrink-0 ml-3">
        <span v-if="tool.version" class="text-xs text-slate-400">v{{ tool.version }}</span>
        <!-- Toggle Switch -->
        <button
          @click="$emit('toggle-tool', tool.id)"
          class="relative w-10 h-5 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          :class="tool.isEnabled ? 'bg-blue-600' : 'bg-slate-300'"
        >
          <span
            class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out"
            :class="tool.isEnabled ? 'translate-x-5' : 'translate-x-0'"
          ></span>
        </button>
        <button
          @click="$emit('delete-tool', tool.id)"
          class="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          title="删除"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BuiltInTool } from '@/components/system-tools/types'

interface Props {
  tool: BuiltInTool
}

defineProps<Props>()

defineEmits<{
  'toggle-tool': [toolId: string]
  'delete-tool': [toolId: string]
}>()
</script>
