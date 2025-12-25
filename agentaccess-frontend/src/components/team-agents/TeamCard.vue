<template>
  <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" @click="handleCardClick">
    <!-- Header with team name and badge -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center space-x-2 flex-1 min-w-0">
        <svg class="w-5 h-5 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-gray-900 truncate">{{ team.name }}</h3>
          <p v-if="team.description" class="text-sm text-gray-500 truncate">{{ team.description }}</p>
        </div>
      </div>
      <!-- Admin badge -->
      <span v-if="isAdmin" class="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full ml-2">管理员</span>
    </div>

    <!-- Team info -->
    <div class="flex items-center space-x-4 text-sm text-gray-500 mb-3">
      <div class="flex items-center space-x-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span>{{ team.members.length }} 成员</span>
      </div>
      <div class="flex items-center space-x-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span>{{ agents.length }} Agent</span>
      </div>
    </div>

    <!-- Agents preview (max 3) -->
    <div v-if="agents.length > 0" class="flex flex-wrap gap-2 mb-3">
      <span
        v-for="agent in agents.slice(0, 3)"
        :key="agent.id"
        class="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
      >
        {{ agent.name }}
      </span>
      <span v-if="agents.length > 3" class="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
        +{{ agents.length - 3 }}
      </span>
    </div>

    <!-- Action buttons -->
    <div class="flex items-center space-x-2 pt-3 border-t border-gray-100" @click.stop>
      <!-- Member of team -->
      <template v-if="!showJoinButton">
        <button
          v-if="isAdmin"
          @click="$emit('manage-team', team.id)"
          class="flex-1 px-3 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
        >
          管理团队
        </button>
        <button
          @click="$emit('leave-team', team.id)"
          class="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
          :class="isAdmin ? 'flex-1' : 'flex-1'"
        >
          退出团队
        </button>
      </template>

      <!-- Not a member -->
      <template v-else>
        <button
          v-if="hasPendingRequest"
          @click="$emit('cancel-request', team.id)"
          class="w-full px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors"
        >
          已申请 (点击取消)
        </button>
        <button
          v-else
          @click="$emit('join-team', team.id)"
          class="w-full px-3 py-2 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
        >
          申请加入
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Team, ExtendedAgent } from '@/types'

interface Props {
  team: Team
  agents: ExtendedAgent[]
  isAdmin: boolean
  showJoinButton?: boolean
  hasPendingRequest?: boolean
}

interface Emits {
  (e: 'manage-team', teamId: string): void
  (e: 'leave-team', teamId: string): void
  (e: 'join-team', teamId: string): void
  (e: 'cancel-request', teamId: string): void
  (e: 'view-team', teamId: string): void
}

const props = withDefaults(defineProps<Props>(), {
  showJoinButton: false,
  hasPendingRequest: false
})
const emit = defineEmits<Emits>()

// Handle card click - only navigate to team detail if already a member
const handleCardClick = () => {
  if (!props.showJoinButton) {
    emit('view-team', props.team.id)
  }
}
</script>
