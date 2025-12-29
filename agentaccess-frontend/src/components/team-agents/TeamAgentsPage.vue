<template>
  <div class="h-full bg-white overflow-y-auto p-6">
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">团队Agent</h1>
        <p class="text-slate-500 mt-1">与团队协作创建和管理 AI Agent</p>
      </div>
      <button
        @click="showCreateTeamDialog = true"
        class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md flex items-center space-x-2 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span>创建团队</span>
      </button>
    </div>

    <!-- My Teams Section -->
    <div class="mb-8">
      <h2 class="text-lg font-semibold text-slate-900 mb-4">我的团队 ({{ myTeams.length }})</h2>

      <!-- Empty state -->
      <div
        v-if="myTeams.length === 0"
        class="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200"
      >
        <svg
          class="w-16 h-16 mx-auto text-slate-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <p class="text-slate-500 mb-2">你还没有加入任何团队</p>
        <button
          @click="showCreateTeamDialog = true"
          class="text-primary-600 hover:text-primary-700 font-medium"
        >
          创建一个团队 →
        </button>
      </div>

      <!-- Team cards grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <TeamCard
          v-for="team in myTeams"
          :key="team.id"
          :team="team"
          :agents="getAgentsInTeam(team.id)"
          :is-admin="isTeamAdmin(team.id)"
          @manage-team="handleManageTeam"
          @leave-team="handleLeaveTeam"
          @view-team="handleViewTeam"
        />
      </div>
    </div>

    <!-- Available Teams Section -->
    <div v-if="otherTeams.length > 0">
      <h2 class="text-lg font-semibold text-slate-900 mb-4">
        可加入的团队 ({{ otherTeams.length }})
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <TeamCard
          v-for="team in otherTeams"
          :key="team.id"
          :team="team"
          :agents="getAgentsInTeam(team.id)"
          :is-admin="false"
          :show-join-button="true"
          :has-pending-request="hasPendingRequest(team.id)"
          @join-team="handleJoinTeam"
          @cancel-request="handleCancelRequest"
        />
      </div>
    </div>

    <!-- Create Team Dialog -->
    <div
      v-if="showCreateTeamDialog"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showCreateTeamDialog = false"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">创建团队</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">团队名称</label>
            <input
              v-model="newTeamName"
              type="text"
              class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="例如：销售部"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">描述（可选）</label>
            <textarea
              v-model="newTeamDescription"
              rows="3"
              class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="描述这个团队的用途"
            />
          </div>
        </div>
        <div class="flex justify-end space-x-3 mt-6">
          <button
            @click="showCreateTeamDialog = false"
            class="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-md"
          >
            取消
          </button>
          <button
            @click="handleCreateTeam"
            :disabled="!newTeamName.trim()"
            class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            创建
          </button>
        </div>
      </div>
    </div>

    <!-- Team Management Dialog -->
    <TeamManagementDialog
      v-if="showTeamManagementDialog"
      :team="managingTeam"
      @close="showTeamManagementDialog = false"
    />

    <!-- Toast notification -->
    <div
      v-if="toast.show"
      class="fixed top-4 right-4 bg-slate-800 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useTeamsStore } from '@/stores/teams'
import { useAgentsStore } from '@/stores/agents'
import type { Team, ExtendedAgent } from '@/types'
import TeamCard from './TeamCard.vue'
import TeamManagementDialog from './TeamManagementDialog.vue'

interface Emits {
  (e: 'edit-agent', agentId: string): void
  (e: 'view-team', teamId: string): void
}

const emit = defineEmits<Emits>()

const teamsStore = useTeamsStore()
const agentsStore = useAgentsStore()
const { myTeams, otherTeams } = storeToRefs(teamsStore)
const { isTeamAdmin, hasPendingRequest, joinTeam, cancelJoinRequest, leaveTeam, createTeam } =
  teamsStore
const { myAgents } = storeToRefs(agentsStore)

// Dialog state
const showCreateTeamDialog = ref(false)
const showTeamManagementDialog = ref(false)
const managingTeam = ref<Team | null>(null)
const newTeamName = ref('')
const newTeamDescription = ref('')

// Toast state
const toast = ref({
  show: false,
  message: '',
})

// Show toast notification
const showToast = (message: string) => {
  toast.value.message = message
  toast.value.show = true
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// Get agents in a team
const getAgentsInTeam = (teamId: string): ExtendedAgent[] => {
  return teamsStore.getAgentsInTeam(teamId, myAgents.value)
}

// Handle create team
const handleCreateTeam = () => {
  if (!newTeamName.value.trim()) return

  createTeam(newTeamName.value.trim(), newTeamDescription.value.trim() || undefined)
  showCreateTeamDialog.value = false
  newTeamName.value = ''
  newTeamDescription.value = ''
  showToast('团队已创建')
}

// Handle join team
const handleJoinTeam = (teamId: string) => {
  joinTeam(teamId)
  showToast('已提交加入申请')
}

// Handle cancel join request
const handleCancelRequest = (teamId: string) => {
  cancelJoinRequest(teamId)
  showToast('已取消申请')
}

// Handle leave team
const handleLeaveTeam = (teamId: string) => {
  if (confirm('确定要退出这个团队吗？')) {
    leaveTeam(teamId)
    showToast('已退出团队')
  }
}

// Handle manage team
const handleManageTeam = (teamId: string) => {
  const team = teamsStore.teams.find((t) => t.id === teamId)
  if (team) {
    managingTeam.value = team
    showTeamManagementDialog.value = true
  }
}

// Handle view team detail
const handleViewTeam = (teamId: string) => {
  emit('view-team', teamId)
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
