<template>
  <div class="h-full bg-white overflow-y-auto p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">我的Agent</h1>
    </div>

    <!-- Agent Creation Bar -->
    <div class="flex gap-4 mb-8">
      <button
        @click="handleCreateCustomAgent"
        class="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-6 py-4 rounded-lg flex flex-col items-center justify-center space-y-2 transition-colors"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span class="font-medium">自定义创建Agent</span>
      </button>

      <button
        @click="handleAutoCreateAgent"
        class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-4 rounded-lg flex flex-col items-center justify-center space-y-2 transition-colors"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        <span class="font-medium">自动创建Agent</span>
      </button>

      <button
        @click="handleImportAgent"
        class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-4 rounded-lg flex flex-col items-center justify-center space-y-2 transition-colors"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
        <span class="font-medium">导入第三方Agent</span>
      </button>
    </div>

    <!-- Private Agents Section -->
    <div class="mb-8">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">
        私有Agent ({{ myAgents.length }})
      </h2>

      <!-- Empty state -->
      <div
        v-if="myAgents.length === 0"
        class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200"
      >
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <p class="text-gray-500 mb-2">还没有创建任何Agent</p>
        <button
          @click="handleCreateCustomAgent"
          class="text-primary-600 hover:text-primary-700 font-medium"
        >
          创建第一个Agent →
        </button>
      </div>

      <!-- Agent cards grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AgentCard
          v-for="agent in myAgents"
          :key="agent.id"
          :agent="agent"
          :sharing-groups="sharingGroups"
          @edit="handleEditAgent"
          @drag-start="handleDragStart"
        />
      </div>
    </div>

    <!-- Shared Agents Section -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">共享Agent</h2>
        <button
          @click="showAddGroupDialog = true"
          class="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>添加共享组</span>
        </button>
      </div>

      <!-- Empty state for shared agents -->
      <div
        v-if="sharingGroups.length === 0"
        class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200"
      >
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <p class="text-gray-500 mb-2">暂无共享Agent</p>
        <p class="text-sm text-gray-400">将私有Agent拖放到共享组来分享</p>
      </div>

      <!-- Sharing groups accordions -->
      <div v-else class="space-y-4">
        <SharingGroupAccordion
          v-for="group in sharingGroups"
          :key="group.id"
          :group="group"
          :agents="agentsStore.getAgentsInGroup(group.id)"
          :all-agents="myAgents"
          @remove-agent="handleRemoveFromGroup"
          @drop-agent="handleDropOnGroup"
          @delete-group="handleDeleteGroup"
        />
      </div>
    </div>

    <!-- Add Sharing Group Dialog -->
    <div
      v-if="showAddGroupDialog"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showAddGroupDialog = false"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">创建共享组</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">共享组名称</label>
            <input
              v-model="newGroupName"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="例如：研发部"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">描述（可选）</label>
            <textarea
              v-model="newGroupDescription"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="描述这个共享组的用途"
            />
          </div>
        </div>
        <div class="flex justify-end space-x-3 mt-6">
          <button
            @click="showAddGroupDialog = false"
            class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            取消
          </button>
          <button
            @click="handleCreateGroup"
            :disabled="!newGroupName.trim()"
            class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            创建
          </button>
        </div>
      </div>
    </div>

    <!-- Toast notification -->
    <div
      v-if="toast.show"
      class="fixed top-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAgentsStore } from '@/stores/agents'
import type { ExtendedAgent, SharingGroup } from '@/types'
import AgentCard from './AgentCard.vue'
import SharingGroupAccordion from './SharingGroupAccordion.vue'

interface Emits {
  (e: 'create-new-agent'): void
  (e: 'edit-agent', agentId: string): void
}

const emit = defineEmits<Emits>()

const agentsStore = useAgentsStore()
const { myAgents, sharingGroups } = storeToRefs(agentsStore)
const {
  addSharingGroup,
  removeSharingGroup,
  shareAgentWithGroup,
  unshareAgentFromGroup
} = agentsStore

// Dialog state
const showAddGroupDialog = ref(false)
const newGroupName = ref('')
const newGroupDescription = ref('')

// Toast state
const toast = ref({
  show: false,
  message: ''
})

// Show toast notification
const showToast = (message: string) => {
  toast.value.message = message
  toast.value.show = true
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// Handle create custom agent
const handleCreateCustomAgent = () => {
  emit('create-new-agent')
}

// Handle auto create agent (coming soon)
const handleAutoCreateAgent = () => {
  showToast('功能开发中，敬请期待')
}

// Handle import third-party agent (coming soon)
const handleImportAgent = () => {
  showToast('功能开发中，敬请期待')
}

// Handle edit agent
const handleEditAgent = (agentId: string) => {
  emit('edit-agent', agentId)
}

// Handle drag start
const handleDragStart = (agentId: string) => {
  // Store the dragged agent ID for drop handling
  sessionStorage.setItem('draggedAgentId', agentId)
}

// Handle drop on group
const handleDropOnGroup = (groupId: string) => {
  const agentId = sessionStorage.getItem('draggedAgentId')
  if (agentId) {
    shareAgentWithGroup(agentId, groupId)
    sessionStorage.removeItem('draggedAgentId')
    showToast('已共享到共享组')
  }
}

// Handle remove from group
const handleRemoveFromGroup = (agentId: string, groupId: string) => {
  unshareAgentFromGroup(agentId, groupId)
  showToast('已从共享组移除')
}

// Handle delete group
const handleDeleteGroup = (groupId: string) => {
  if (confirm('确定要删除这个共享组吗？')) {
    removeSharingGroup(groupId)
    showToast('共享组已删除')
  }
}

// Handle create group
const handleCreateGroup = () => {
  if (!newGroupName.value.trim()) return

  addSharingGroup(newGroupName.value.trim(), newGroupDescription.value.trim() || undefined)
  showAddGroupDialog.value = false
  newGroupName.value = ''
  newGroupDescription.value = ''
  showToast('共享组已创建')
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>
