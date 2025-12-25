<template>
  <div class="h-full bg-white border-r border-gray-200 flex flex-col">
    <!-- Logo and App Name -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <h1 class="text-lg font-semibold text-gray-900">Agent Access</h1>
      </div>
    </div>

    <!-- New Conversation Button -->
    <div class="p-4">
      <button
        @click="startNewConversation"
        class="btn-primary w-full flex items-center justify-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span>发起 Access</span>
      </button>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 px-4 pb-4 space-y-1 overflow-y-auto">
      <!-- Main Navigation -->
      <div class="space-y-1 pb-4">
        <button
          @click="goToHome"
          :class="[
            'w-full text-left px-3 py-2 text-sm font-medium rounded-md flex items-center space-x-3 transition-colors',
            isShowingHome
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span>主页</span>
        </button>

        <button
          @click="switchToView('workflow')"
          :class="[
            'w-full text-left px-3 py-2 text-sm font-medium rounded-md flex items-center space-x-3 transition-colors',
            activeView === 'workflow'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
          <span>Agent编辑器</span>
        </button>

        <!-- FastGPT Status Indicator -->
        <div
          v-if="fastgptConnected"
          class="ml-8 mt-1 flex items-center space-x-2 text-xs text-green-600"
        >
          <div class="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>FastGPT已连接</span>
        </div>
      </div>

      <!-- My Agents Section (New) -->
      <div class="border-t border-gray-100 my-2"></div>

      <div class="space-y-1 pb-4">
        <button
          @click="handleMyAgentsClick"
          :class="[
            'w-full text-left px-3 py-2 text-sm font-medium rounded-md flex items-center justify-between transition-colors',
            activeView === 'my-agents'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
          ]"
        >
          <div class="flex items-center space-x-3">
            <svg
              class="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>我的Agent</span>
          </div>
          <svg
            v-if="recentAgents.length > 0"
            class="w-4 h-4 text-gray-400 transform transition-transform"
            :class="{ 'rotate-90': isMyAgentsOpen }"
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
        </button>

        <!-- Recent Agent Shortcuts -->
        <div v-if="recentAgents.length > 0 && isMyAgentsOpen" class="mt-1 ml-8 space-y-1">
          <div
            v-for="agent in recentAgents"
            :key="agent.id"
            class="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md cursor-pointer flex items-center space-x-2"
            @click="openAgentInEditor(agent.id)"
            :title="agent.name"
          >
            <svg
              class="w-4 h-4 text-primary-500 flex-shrink-0"
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
            <span class="truncate">{{ agent.name }}</span>
          </div>
        </div>
      </div>

      <!-- Separator -->
      <div class="border-t border-gray-100 my-2"></div>

      <!-- Team Agents -->
      <div class="space-y-1 pb-4">
        <button
          @click="handleTeamAgentsClick"
          :class="[
            'w-full text-left px-3 py-2 text-sm font-medium rounded-md flex items-center justify-between transition-colors',
            activeView === 'team-agents'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
          ]"
        >
          <div class="flex items-center space-x-3">
            <svg
              class="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
            <span>团队Agent</span>
          </div>
          <svg
            v-if="myTeams.length > 0"
            class="w-4 h-4 text-gray-400 transform transition-transform"
            :class="{ 'rotate-90': isTeamAgentsOpen }"
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
        </button>

        <!-- Team Items (my teams) -->
        <div v-if="myTeams.length > 0 && isTeamAgentsOpen" class="mt-1 ml-8 space-y-1">
          <div
            v-for="team in myTeams"
            :key="team.id"
            class="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md cursor-pointer flex items-center space-x-2"
            :title="team.description || team.name"
            @click="handleTeamClick(team.id)"
          >
            <svg
              class="w-4 h-4 text-primary-500 flex-shrink-0"
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
            <span class="truncate">{{ team.name }}</span>
            <span
              v-if="isTeamAdmin(team.id)"
              class="text-xs bg-primary-100 text-primary-700 px-1 rounded"
              title="管理员"
              >管理员</span
            >
          </div>
        </div>
      </div>

      <!-- Separator -->
      <div class="border-t border-gray-100 my-2"></div>

      <!-- Knowledge Base -->
      <div class="space-y-1 pb-4">
        <button
          @click="handleKnowledgeBaseClick"
          :class="[
            'w-full text-left px-3 py-2 text-sm font-medium rounded-md flex items-center space-x-3 transition-colors',
            activeView === 'knowledge-base'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <span>知识库</span>
        </button>
      </div>

      <!-- Separator -->
      <div class="border-t border-gray-100 my-2"></div>

      <!-- Recent Conversations -->
      <div class="space-y-1">
        <button
          @click="toggleRecentConversations"
          class="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 flex items-center justify-between"
        >
          <div class="flex items-center space-x-3">
            <svg
              class="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span>最近 Access 会话</span>
          </div>
          <svg
            class="w-4 h-4 text-gray-400 transform transition-transform"
            :class="{ 'rotate-90': isRecentConversationsOpen }"
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
        </button>

        <!-- Recent Conversation Items -->
        <div v-if="isRecentConversationsOpen" class="mt-1 ml-8 space-y-1">
          <div
            v-for="conv in recentConversations"
            :key="conv.id"
            class="group px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md cursor-pointer flex items-center justify-between"
            @click="selectRecentConversation(conv)"
          >
            <span class="truncate flex-1">{{ conv.title }}</span>
            <button
              @click.stop="deleteRecentConversation(conv.id)"
              class="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-opacity flex-shrink-0"
              title="删除 Access 会话"
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
        </div>
      </div>
    </nav>

    <!-- User Profile -->
    <div class="p-4 border-t border-gray-200">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-900">{{ user.name }}</p>
        </div>
        <!-- User Menu Dropdown -->
        <div class="relative">
          <button
            @click="toggleUserMenu"
            class="p-1 text-gray-400 hover:text-gray-600"
            title="用户菜单"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>

          <!-- User Menu Dropdown -->
          <div
            v-if="showUserMenu"
            class="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
          >
            <button
              @click="openUserSettings"
              class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>用户设置</span>
            </button>
            <div class="border-t border-gray-200 my-1"></div>
            <button
              @click="logout"
              class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>退出登录</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import type { User, ExtendedAgent } from '@/types'
import { useAgentsStore } from '@/stores/agents'
import { useWorkflowStore } from '@/stores/workflow'
import { useChatStore } from '@/stores/chat'
import { useTeamsStore } from '@/stores/teams'

interface Props {
  activeView:
    | 'home'
    | 'workflow'
    | 'my-agents'
    | 'team-agents'
    | 'team-detail'
    | 'knowledge-base'
    | 'knowledge-base-detail'
  isShowingHome: boolean
}

interface Emits {
  (
    e: 'view-change',
    view: 'home' | 'workflow' | 'my-agents' | 'team-agents' | 'knowledge-base',
  ): void
  (e: 'open-user-settings'): void
  (e: 'start-new-conversation'): void
  (e: 'go-to-home'): void
  (e: 'start-chat-with-agent', agent: any): void
  (e: 'select-recent-conversation', conversation: any): void
  (e: 'open-agent-in-editor', agentId: string): void
  (e: 'view-team', teamId: string): void
  (e: 'delete-conversation', conversationId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const agentsStore = useAgentsStore()
const { myAgents, teamAgents } = storeToRefs(agentsStore)
const { getRecentAgents, markAgentAsUsed } = agentsStore

const workflowStore = useWorkflowStore()
const { fastgptConnected } = storeToRefs(workflowStore)

const chatStore = useChatStore()
const { conversations } = storeToRefs(chatStore)
const { isDemoConversation } = chatStore

const teamsStore = useTeamsStore()
const { myTeams } = storeToRefs(teamsStore)
const { isTeamAdmin } = teamsStore

// Get recent agents
const recentAgents = computed(() => getRecentAgents(3))

// Get recent conversations from store (limit to 10)
const recentConversations = computed(() => conversations.value.slice(0, 10))

const isRecentConversationsOpen = ref(false)
const isTeamAgentsOpen = ref(false)
const isMyAgentsOpen = ref(false)
const showUserMenu = ref(false)

const user: User = {
  id: '03928',
  name: '用户03928',
}

const switchToView = (
  view: 'home' | 'workflow' | 'my-agents' | 'team-agents' | 'knowledge-base',
) => {
  emit('view-change', view)
}

const startNewConversation = () => {
  // 清空当前 Access 会话，切换到聊天界面
  emit('start-new-conversation')
}

const goToHome = () => {
  // 切换到主页，重置显示状态
  emit('go-to-home')
}

const openAgentInEditor = (agentId: string) => {
  // Mark agent as used
  markAgentAsUsed(agentId)
  // Emit event to load agent in workflow editor
  emit('open-agent-in-editor', agentId)
}

const handleKnowledgeBaseClick = () => {
  switchToView('knowledge-base')
}

const toggleRecentConversations = () => {
  isRecentConversationsOpen.value = !isRecentConversationsOpen.value
}

const toggleTeamAgents = () => {
  isTeamAgentsOpen.value = !isTeamAgentsOpen.value
}

const handleMyAgentsClick = () => {
  // Always switch to my-agents view
  switchToView('my-agents')
  // Submenu will auto-expand via watch
}

const handleTeamAgentsClick = () => {
  // Always switch to team-agents view
  switchToView('team-agents')
  // Submenu will auto-expand via watch
}

const handleTeamClick = (teamId: string) => {
  emit('view-team', teamId)
}

const startChatWithAgent = (agent: any) => {
  emit('start-chat-with-agent', agent)
}

const selectRecentConversation = (conversation: any) => {
  emit('select-recent-conversation', conversation)
}

const deleteRecentConversation = (conversationId: string) => {
  console.log('🗑️ Attempting to delete conversation:', conversationId)
  // Check if this is a demo conversation that cannot be deleted
  if (isDemoConversation(conversationId)) {
    alert('演示中，该 Access 会话不支持删除')
    return
  }

  if (confirm('确定要删除这个 Access 会话吗？')) {
    emit('delete-conversation', conversationId)
  }
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const openUserSettings = () => {
  showUserMenu.value = false
  emit('open-user-settings')
}

const logout = () => {
  if (confirm('确定要退出登录吗？')) {
    // TODO: Implement logout logic
    console.log('Logout')
  }
}

// Close user menu when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showUserMenu.value = false
  }
}

// Watch activeView to auto-expand/collapse my-agents and team-agents submenus
watch(
  () => props.activeView,
  (newView) => {
    if (newView === 'my-agents') {
      // Auto-expand when entering my-agents view
      isMyAgentsOpen.value = true
    } else if (newView === 'workflow') {
      // Keep expanded when editing an agent in workflow view
      // Don't collapse when going to workflow editor from my-agents
    } else {
      // Auto-collapse when leaving my-agents view
      isMyAgentsOpen.value = false
    }

    if (newView === 'team-agents' || newView === 'team-detail') {
      // Auto-expand when entering team-agents or team-detail view
      isTeamAgentsOpen.value = true
    } else {
      // Auto-collapse when leaving team views
      isTeamAgentsOpen.value = false
    }
  },
)
</script>
