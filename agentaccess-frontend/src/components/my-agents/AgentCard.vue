<template>
  <div
    class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-move relative group"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <!-- Header with name and edit button -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center space-x-2 flex-1 min-w-0">
        <svg
          class="w-5 h-5 text-primary-500 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
        <h3 class="font-semibold text-gray-900 truncate">{{ agent.name }}</h3>
      </div>
      <button
        @click.stop="$emit('edit', agent.id)"
        class="opacity-0 group-hover:opacity-100 transition-opacity text-sm text-primary-600 hover:text-primary-700 font-medium"
      >
        编辑
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

    <!-- Shared status -->
    <div
      v-if="agent.sharedGroups && agent.sharedGroups.length > 0"
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
      <span>已共享: {{ sharedGroupNames }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ExtendedAgent, SharingGroup } from '@/types'

interface Props {
  agent: ExtendedAgent
  sharingGroups: SharingGroup[]
}

interface Emits {
  (e: 'edit', agentId: string): void
  (e: 'drag-start', agentId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Get names of shared groups
const sharedGroupNames = computed(() => {
  if (!props.agent.sharedGroups || props.agent.sharedGroups.length === 0) {
    return ''
  }

  return props.agent.sharedGroups
    .map((groupId) => {
      const group = props.sharingGroups.find((g) => g.id === groupId)
      return group?.name
    })
    .filter(Boolean)
    .join(', ')
})

// Handle drag start
const handleDragStart = (event: DragEvent) => {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', props.agent.id)
  }
  emit('drag-start', props.agent.id)

  // Add visual feedback
  ;(event.target as HTMLElement).classList.add('opacity-50')
}

// Handle drag end
const handleDragEnd = (event: DragEvent) => {
  ;(event.target as HTMLElement).classList.remove('opacity-50')
}
</script>
