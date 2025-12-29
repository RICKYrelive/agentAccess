<template>
  <div class="space-y-4">
    <!-- Load Balancer Groups Section -->
    <div v-if="loadBalancerGroups.length > 0" class="space-y-3">
      <h4 class="text-sm font-medium text-slate-700">负载均衡组</h4>
      <LoadBalancerGroupCard
        v-for="group in loadBalancerGroups"
        :key="group.id"
        :group="group"
        @edit="$emit('edit-group', group.id)"
        @delete="$emit('delete-group', group.id)"
        @remove-tool="$emit('remove-tool-from-group', $event)"
      />
    </div>

    <!-- Individual Selected Tools -->
    <div v-if="individualToolIds.length > 0" class="space-y-3">
      <h4 class="text-sm font-medium text-slate-700">已选工具 ({{ individualToolIds.length }})</h4>
      <div class="space-y-2 max-h-48 overflow-y-auto">
        <div
          v-for="toolId in individualToolIds"
          :key="toolId"
          class="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200"
        >
          <span class="text-sm text-slate-700">{{ getToolName(toolId) }}</span>
          <button
            @click="$emit('remove-tool', toolId)"
            class="p-1 text-slate-400 hover:text-red-600 rounded"
            title="移除"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="loadBalancerGroups.length === 0 && individualToolIds.length === 0" class="text-center py-8 text-slate-400 text-sm">
      <svg class="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <p>还未选择任何工具</p>
    </div>

    <!-- Create Group Button -->
    <button
      @click="$emit('create-group')"
      class="w-full px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-md border border-dashed border-purple-300 flex items-center justify-center space-x-2"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      <span>创建负载均衡组</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMCPManagementStore } from '@/stores/mcpManagement'
import LoadBalancerGroupCard from './LoadBalancerGroupCard.vue'
import type { LoadBalancerGroup } from '../types'

interface Props {
  selectedToolIds: string[]
  loadBalancerGroups: LoadBalancerGroup[]
}

const props = defineProps<Props>()

defineEmits<{
  'remove-tool': [toolId: string]
  'edit-group': [groupId: string]
  'delete-group': [groupId: string]
  'remove-tool-from-group': [{ groupId: string; toolId: string }]
  'create-group': []
}>()

const store = useMCPManagementStore()

// Get tool IDs that are NOT in any load balancer group
const individualToolIds = computed(() => {
  const groupToolIds = new Set<string>()
  props.loadBalancerGroups.forEach(group => {
    group.toolIds.forEach(id => groupToolIds.add(id))
  })
  return props.selectedToolIds.filter(id => !groupToolIds.has(id))
})

const getToolName = (toolId: string) => {
  const tool = store.getTool(toolId)
  return tool?.name || toolId
}
</script>
