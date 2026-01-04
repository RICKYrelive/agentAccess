<template>
  <div class="border border-purple-200 rounded-lg p-4 bg-purple-50" @click.stop>
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <h4 class="text-sm font-semibold text-slate-900">{{ group.name }}</h4>
        <span class="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
          {{ getStrategyName(group.strategy) }}
        </span>
      </div>
      <div class="flex items-center space-x-1">
        <button
          @click="isExpanded = !isExpanded"
          class="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded"
          title="展开/折叠"
        >
          <svg :class="['w-4 h-4 transition-transform', isExpanded ? 'rotate-90' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button
          @click="$emit('edit', group.id)"
          class="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
          title="编辑"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          @click="$emit('delete', group.id)"
          class="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
          title="删除"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <div class="flex items-center space-x-4 text-xs text-slate-600">
      <span>{{ group.toolIds.length }} 个工具</span>
      <span v-if="group.healthCheck?.enabled" class="flex items-center text-green-600">
        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        健康检查已启用
      </span>
    </div>

    <div v-if="isExpanded" class="mt-3 pt-3 border-t border-purple-200">
      <div class="space-y-1">
        <div
          v-for="toolId in group.toolIds"
          :key="toolId"
          class="flex items-center justify-between px-2 py-1.5 bg-white rounded border border-slate-200"
        >
          <span class="text-sm text-slate-700">{{ getToolName(toolId) }}</span>
          <button
            @click="$emit('remove-tool', group.id, toolId)"
            class="p-1 text-slate-400 hover:text-red-600 rounded"
            title="移除工具"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMCPManagementStore } from '@/stores/mcpManagement'
import type { LoadBalancerGroup, LoadBalancerStrategy } from '@/components/mcp-management/types'

interface Props {
  group: LoadBalancerGroup
}

defineProps<Props>()
defineEmits<{
  edit: [groupId: string]
  delete: [groupId: string]
  'remove-tool': [groupId: string, toolId: string]
}>()

const store = useMCPManagementStore()
const isExpanded = ref(false)

const getStrategyName = (strategy: LoadBalancerStrategy) => {
  const names: Record<LoadBalancerStrategy, string> = {
    'round-robin': '轮询',
    'random': '随机',
    'least-used': '最少调用',
  }
  return names[strategy]
}

const getToolName = (toolId: string) => {
  const tool = store.getTool(toolId)
  return tool?.name || toolId
}
</script>
