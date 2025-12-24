<template>
  <div class="border border-gray-200 rounded-lg overflow-hidden">
    <!-- Accordion header -->
    <div
      @click="toggleExpanded"
      class="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors cursor-pointer"
      role="button"
      :aria-expanded="isExpanded"
      tabindex="0"
      @keydown.enter="toggleExpanded"
      @keydown.space.prevent="toggleExpanded"
    >
      <div class="flex items-center space-x-2">
        <svg
          class="w-5 h-5 text-gray-400 transform transition-transform"
          :class="{ 'rotate-90': isExpanded }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
        <span class="font-medium text-gray-900">{{ group.name }}</span>
        <span class="text-sm text-gray-500">({{ agents.length }})</span>
      </div>
      <button
        @click.stop="$emit('delete-group', group.id)"
        class="text-gray-400 hover:text-red-600 transition-colors"
        title="删除共享组"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>

    <!-- Accordion content -->
    <div
      v-show="isExpanded"
      class="p-4 bg-white border-t border-gray-200"
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      :class="{ 'bg-blue-50': isDragOver }"
    >
      <!-- Empty state -->
      <div
        v-if="agents.length === 0"
        class="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg"
      >
        拖拽私有Agent到此处来分享
      </div>

      <!-- Agent cards -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="agent in agents"
          :key="agent.id"
          class="bg-gray-50 border border-gray-200 rounded-lg p-4 relative group hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center space-x-2 flex-1 min-w-0">
              <svg class="w-5 h-5 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <h3 class="font-semibold text-gray-900 truncate">{{ agent.name }}</h3>
            </div>
            <button
              @click="$emit('remove-agent', agent.id, group.id)"
              class="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-600 p-1"
              title="从共享组移除"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Badges -->
          <div class="flex flex-wrap gap-2 mb-3">
            <span
              v-if="agent.isThirdParty"
              class="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full"
            >
              第三方
            </span>
            <span
              v-for="tag in (agent.tags || []).slice(0, 3)"
              :key="tag"
              class="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
            >
              🏷️ {{ tag }}
            </span>
          </div>

          <!-- View all shared groups badge -->
          <div
            v-if="agent.sharedGroups && agent.sharedGroups.length > 1"
            class="text-xs text-gray-500 flex items-center space-x-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            <span>也共享到: {{ otherGroupNames(agent) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ExtendedAgent, SharingGroup } from '@/types'

interface Props {
  group: SharingGroup
  agents: ExtendedAgent[]
  allAgents: ExtendedAgent[]
}

interface Emits {
  (e: 'remove-agent', agentId: string, groupId: string): void
  (e: 'drop-agent', groupId: string): void
  (e: 'delete-group', groupId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isExpanded = ref(false)
const isDragOver = ref(false)

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

// Get names of other groups this agent is shared with
const otherGroupNames = (agent: ExtendedAgent) => {
  if (!agent.sharedGroups || agent.sharedGroups.length <= 1) return ''

  return agent.sharedGroups
    .filter(id => id !== props.group.id)
    .map(id => {
      const otherAgents = props.allAgents.filter(a => a.sharedGroups?.includes(id))
      if (otherAgents.length > 0) {
        // Find a group name by checking if any agent has this group
        for (const a of otherAgents) {
          const groups = a.sharedGroups || []
          if (groups.includes(id)) {
            // Get group name from store or use placeholder
            return id // For now, just return the ID
          }
        }
      }
      return null
    })
    .filter(Boolean)
    .slice(0, 2)
    .join(', ')
    + (agent.sharedGroups.length > 2 ? '...' : '')
}

const handleDragOver = (event: DragEvent) => {
  isDragOver.value = true
}

const handleDragLeave = (event: DragEvent) => {
  // Only set false if we're actually leaving the drop zone
  const target = event.currentTarget as HTMLElement
  if (!target.contains(event.relatedTarget as Node)) {
    isDragOver.value = false
  }
}

const handleDrop = (event: DragEvent) => {
  isDragOver.value = false
  emit('drop-agent', props.group.id)
}
</script>
