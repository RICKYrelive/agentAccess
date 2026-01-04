<template>
  <div class="h-full bg-white overflow-y-auto p-6">
    <!-- Header with back button -->
    <div class="mb-6">
      <button
        @click="$emit('back')"
        class="flex items-center space-x-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span>返回团队列表</span>
      </button>

      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">{{ team?.name }}</h1>
          <p v-if="team?.description" class="text-slate-500 mt-1">{{ team.description }}</p>
        </div>
        <div class="flex items-center space-x-3 text-sm text-slate-500">
          <div class="flex items-center space-x-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span>{{ team?.members.length }} 成员</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Members section -->
    <div class="mb-8">
      <h2 class="text-lg font-semibold text-slate-900 mb-4">团队成员</h2>
      <div class="bg-slate-50 rounded-lg p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="member in team?.members"
            :key="member.id"
            class="flex items-center space-x-3 bg-white p-3 rounded-md border border-slate-200"
          >
            <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <span class="text-primary-600 font-medium">{{ member.name.charAt(0) }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-slate-900 truncate">{{ member.name }}</p>
              <p class="text-sm text-slate-500">{{ member.role === 'admin' ? '管理员' : '成员' }}</p>
            </div>
            <span
              v-if="member.role === 'admin'"
              class="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full"
            >
              管理员
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Agents section -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-slate-900">团队 Agent ({{ teamAgents.length }})</h2>
      </div>

      <!-- Empty state -->
      <div
        v-if="teamAgents.length === 0"
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <p class="text-slate-500 mb-2">该团队还没有共享的 Agent</p>
        <p class="text-sm text-slate-400">团队成员可以共享他们的 Agent 到此团队</p>
      </div>

      <!-- Agent cards grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="agent in teamAgents"
          :key="agent.id"
          class="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          :class="`border-l-4 ${getAgentBorderClass(agent.category)}`"
          @click="$emit('edit-agent', agent.id)"
        >
          <div class="flex items-start space-x-3">
            <div
              :class="`w-12 h-12 rounded-lg ${getAgentBgClass(agent.category)} flex items-center justify-center flex-shrink-0`"
            >
              <svg
                v-if="agent.icon"
                class="w-6 h-6"
                :class="getAgentIconClass(agent.category)"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  :d="agent.icon"
                />
              </svg>
              <svg
                v-else
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-slate-900 truncate">{{ agent.name }}</h3>
              <p v-if="agent.description" class="text-sm text-slate-500 truncate mt-1">
                {{ agent.description }}
              </p>
              <div class="flex items-center space-x-2 mt-2">
                <span
                  v-if="agent.category"
                  :class="`text-xs px-2 py-1 ${getCategoryBadgeClass(agent.category)} rounded-full`"
                >
                  {{ getCategoryName(agent.category) }}
                </span>
                <span
                  v-if="isExtendedAgent(agent) && agent.tags && agent.tags.length > 0"
                  class="text-xs text-slate-500"
                >
                  {{ agent.tags.slice(0, 2).join(', ') }}
                  <span v-if="agent.tags.length > 2">等</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Team Knowledge Bases section -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-slate-900">团队知识库 ({{ teamKnowledgeBases.length }})</h2>
      </div>

      <!-- Empty state -->
      <div
        v-if="teamKnowledgeBases.length === 0"
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
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
        <p class="text-slate-500 mb-2">该团队还没有共享的知识库</p>
        <p class="text-sm text-slate-400">团队成员可以将他们的知识库共享到此团队</p>
      </div>

      <!-- Knowledge base cards grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="kb in teamKnowledgeBases"
          :key="kb.id"
          class="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start space-x-3">
            <div class="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-slate-900 truncate">{{ kb.name }}</h3>
              <p v-if="kb.description" class="text-sm text-slate-500 truncate mt-1">
                {{ kb.description }}
              </p>
              <div class="flex items-center space-x-2 mt-2">
                <span
                  :class="`text-xs px-2 py-1 rounded-full ${getTypeBadgeClass(kb.type)}`"
                >
                  {{ getTypeName(kb.type) }}
                </span>
                <span class="text-xs text-slate-400">
                  {{ formatKBSize(kb) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useTeamsStore } from '@/stores/teams'
import { useAgentsStore } from '@/stores/agents'
import { useKnowledgeBaseStore } from '@/stores/knowledgeBase'
import type { ExtendedAgent, Agent, KnowledgeBase, KnowledgeBaseType } from '@/types'

interface Props {
  teamId: string
}

interface Emits {
  (e: 'back'): void
  (e: 'edit-agent', agentId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const teamsStore = useTeamsStore()
const agentsStore = useAgentsStore()
const knowledgeBaseStore = useKnowledgeBaseStore()
const { myAgents } = storeToRefs(agentsStore)
const { teamKnowledgeBases: allTeamKnowledgeBases } = storeToRefs(knowledgeBaseStore)

// Get team by ID
const team = computed(() => {
  return teamsStore.teams.find((t) => t.id === props.teamId)
})

// Get agents in this team (use store method which already handles all agent types)
const teamAgents = computed<(ExtendedAgent | Agent)[]>(() => {
  if (!team.value) return []
  return teamsStore.getAgentsInTeam(props.teamId, myAgents.value)
})

// Get knowledge bases shared with this team
const teamKnowledgeBases = computed<KnowledgeBase[]>(() => {
  if (!team.value) return []
  return allTeamKnowledgeBases.value.filter((kb) =>
    kb.sharedTeams?.some((st) => st.teamId === props.teamId)
  )
})

// Type guard to check if agent is ExtendedAgent
const isExtendedAgent = (agent: ExtendedAgent | Agent): agent is ExtendedAgent => {
  return 'tags' in agent && 'createdAt' in agent
}

// Helper functions for agent styling
const getAgentBorderClass = (category?: string) => {
  switch (category) {
    case 'analysis':
      return 'border-blue-500'
    case 'writing':
      return 'border-green-500'
    case 'finance':
      return 'border-orange-500'
    case 'coding':
      return 'border-purple-500'
    case 'personal':
      return 'border-slate-500'
    case 'specialized':
      return 'border-indigo-500'
    default:
      return 'border-slate-500'
  }
}

const getAgentBgClass = (category?: string) => {
  switch (category) {
    case 'analysis':
      return 'bg-blue-100'
    case 'writing':
      return 'bg-green-100'
    case 'finance':
      return 'bg-orange-100'
    case 'coding':
      return 'bg-purple-100'
    case 'personal':
      return 'bg-slate-100'
    case 'specialized':
      return 'bg-indigo-100'
    default:
      return 'bg-slate-100'
  }
}

const getAgentIconClass = (category?: string) => {
  switch (category) {
    case 'analysis':
      return 'text-blue-600'
    case 'writing':
      return 'text-green-600'
    case 'finance':
      return 'text-orange-600'
    case 'coding':
      return 'text-purple-600'
    case 'personal':
      return 'text-slate-600'
    case 'specialized':
      return 'text-indigo-600'
    default:
      return 'text-slate-600'
  }
}

const getCategoryBadgeClass = (category?: string) => {
  switch (category) {
    case 'analysis':
      return 'bg-blue-100 text-blue-700'
    case 'writing':
      return 'bg-green-100 text-green-700'
    case 'finance':
      return 'bg-orange-100 text-orange-700'
    case 'coding':
      return 'bg-purple-100 text-purple-700'
    case 'personal':
      return 'bg-slate-100 text-slate-700'
    case 'specialized':
      return 'bg-indigo-100 text-indigo-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

const getCategoryName = (category?: string) => {
  switch (category) {
    case 'analysis':
      return '数据分析'
    case 'writing':
      return '写作助手'
    case 'finance':
      return '金融分析'
    case 'coding':
      return '编程开发'
    case 'personal':
      return '个人助手'
    case 'specialized':
      return '专业助手'
    default:
      return '通用助手'
  }
}

// Knowledge base helper functions
const getTypeBadgeClass = (type?: KnowledgeBaseType) => {
  switch (type) {
    case 'text':
      return 'bg-green-100 text-green-700'
    case 'spreadsheet':
      return 'bg-blue-100 text-blue-700'
    case 'database':
      return 'bg-purple-100 text-purple-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

const getTypeName = (type?: KnowledgeBaseType) => {
  switch (type) {
    case 'text':
      return '文本'
    case 'spreadsheet':
      return '表格'
    case 'database':
      return '数据库'
    default:
      return '未知'
  }
}

const formatKBSize = (kb: KnowledgeBase): string => {
  if (kb.type === 'database') {
    const tableCount = kb.sourceInfo.tables?.length || 0
    return `${tableCount} 个表`
  }

  // For text and spreadsheet, calculate total file size
  const totalBytes =
    kb.sourceInfo.files?.reduce((sum, file) => sum + (file.fileSize || 0), 0) || 0
  if (totalBytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(totalBytes) / Math.log(k))
  return parseFloat((totalBytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}
</script>
