<template>
  <div class="h-screen flex bg-gray-50">
    <!-- Left Sidebar - Fixed Position -->
    <SidebarNavigation
      class="w-64 flex-shrink-0 h-screen sticky top-0"
      :active-view="activeView"
      :is-showing-home="isShowingHomePage"
      @view-change="handleViewChange"
      @open-user-settings="openUserSettingsDialog"
      @start-new-conversation="startNewConversation"
      @go-to-home="goToHome"
      @start-chat-with-agent="startChatWithAgent"
      @select-recent-conversation="selectRecentConversation"
      @delete-conversation="handleDeleteConversation"
      @open-agent-in-editor="openAgentInEditor"
      @view-team="handleViewTeam"
    />

    <!-- Main Content Area - Independent Scroll -->
    <div class="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
      <!-- Home Page View -->
      <div v-if="activeView === 'home'" class="flex-1 overflow-hidden">
        <!-- Chat Interface (shown when there are messages) -->
        <ChatInterface v-if="showChatInterface" class="flex-1 h-full overflow-hidden" />

        <!-- ContentArea for new conversation (shown when starting new chat) -->
        <ContentArea
          v-else-if="showContentArea"
          class="flex-1 h-full overflow-hidden"
          @open-settings="openSettingsPanel"
          @message-sent="onMessageSent"
        />

        <!-- Home Page (shown when no active conversation) -->
        <HomePage
          v-else
          class="flex-1 h-full overflow-hidden"
          @continue-conversation="showChatInterface = true"
          @start-new-conversation="startNewConversation"
          @select-conversation="selectConversation"
          @start-chat-with-agent="startChatWithAgent"
          @select-recent-conversation="selectRecentConversation"
        />
      </div>

      <!-- Workflow Editor View -->
      <WorkflowCanvas v-else-if="activeView === 'workflow'" class="flex-1 h-full overflow-hidden" />

      <!-- My Agents Page View -->
      <MyAgentsPage
        v-else-if="activeView === 'my-agents'"
        class="flex-1 h-full overflow-hidden"
        @create-new-agent="handleCreateNewAgent"
        @edit-agent="handleEditAgent"
      />

      <!-- Team Agents Page View -->
      <TeamAgentsPage
        v-else-if="activeView === 'team-agents'"
        class="flex-1 h-full overflow-hidden"
        @edit-agent="handleEditAgent"
        @view-team="handleViewTeam"
      />

      <!-- Team Detail Page View -->
      <TeamDetailPage
        v-else-if="activeView === 'team-detail' && selectedTeamId"
        :team-id="selectedTeamId"
        class="flex-1 h-full overflow-hidden"
        @back="handleBackFromTeamDetail"
        @edit-agent="handleEditAgent"
      />

      <!-- MCP Tools Page View -->
      <MCPToolsPage
        v-else-if="activeView === 'mcp-tools'"
        class="flex-1 h-full overflow-hidden"
      />

      <!-- MCP Gateway Page View -->
      <MCPGatewayPage
        v-else-if="activeView === 'mcp-gateway'"
        class="flex-1 h-full overflow-hidden"
      />

      <!-- System Tools Page View -->
      <div
        v-else-if="activeView === 'system-tools'"
        class="flex-1 h-full overflow-hidden flex items-center justify-center bg-gray-50"
      >
        <div class="text-center">
          <div class="w-16 h-16 mx-auto mb-4 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          </div>
          <h2 class="text-xl font-semibold text-gray-700 mb-2">系统工具</h2>
          <p class="text-gray-500">沙箱环境和系统内置工具</p>
        </div>
      </div>

      <!-- Memory Page View -->
      <div
        v-else-if="activeView === 'memory'"
        class="flex-1 h-full overflow-hidden flex items-center justify-center bg-gray-50"
      >
        <div class="text-center">
          <div class="w-16 h-16 mx-auto mb-4 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-gray-700 mb-2">记忆体</h2>
          <p class="text-gray-500">管理短期、长期和向量记忆</p>
        </div>
      </div>

      <!-- Knowledge Base Page View -->
      <KnowledgeBasePage
        v-else-if="activeView === 'knowledge-base'"
        class="flex-1 h-full overflow-hidden"
        @view-knowledge-base="handleViewKnowledgeBase"
      />

      <!-- Knowledge Base Detail Page View -->
      <KnowledgeBaseDetailPage
        v-else-if="activeView === 'knowledge-base-detail' && selectedKnowledgeBaseId"
        :knowledge-base-id="selectedKnowledgeBaseId"
        class="flex-1 h-full overflow-hidden"
        @back="handleBackFromKnowledgeBaseDetail"
        @edit-knowledge-base="handleEditKnowledgeBase"
      />
    </div>

    <!-- Right Panels -->
    <div
      v-if="activeView === 'workflow' && (isPreviewPanelVisible || hasSelectedWorkflowNode)"
      class="flex flex-col h-screen w-96 flex-shrink-0"
    >
      <!-- Workflow Right Panel -->
      <PreviewPanel
        v-if="!hasSelectedWorkflowNode && isPreviewPanelVisible"
        key="preview"
        class="h-full border-l border-gray-200"
      />
      <NodeConfigPanel
        v-if="hasSelectedWorkflowNode"
        key="node-config"
        :node="selectedWorkflowNode"
        class="h-full border-l border-gray-200"
        @close="clearWorkflowNodeSelection"
        @update="updateWorkflowNode"
      />
    </div>

    <!-- MCP Settings Panel -->
    <SettingsPanel
      v-if="showSettingsPanel"
      key="settings"
      class="w-80 flex-shrink-0 border-l border-gray-200"
      @close="closeSettingsPanel"
    />

    <!-- User Settings Dialog -->
    <UserSettingsDialog v-if="showUserSettingsDialog" @close="closeUserSettingsDialog" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useWorkflowStore } from '@/stores/workflow'
import { useAgentsStore } from '@/stores/agents'
import { storeToRefs } from 'pinia'
import SidebarNavigation from './SidebarNavigation.vue'
import ContentArea from './ContentArea.vue'
import SettingsPanel from './SettingsPanel.vue'
import WorkflowCanvas from '../workflow/WorkflowCanvas.vue'
import PreviewPanel from '../workflow/PreviewPanel.vue'
import NodeConfigPanel from '../workflow/NodeConfigPanel.vue'
import ChatInterface from '../chat/ChatInterface.vue'
import HomePage from '../home/HomePage.vue'
import UserSettingsDialog from '../settings/UserSettingsDialog.vue'
import MyAgentsPage from '../my-agents/MyAgentsPage.vue'
import TeamAgentsPage from '../team-agents/TeamAgentsPage.vue'
import TeamDetailPage from '../team-agents/TeamDetailPage.vue'
import KnowledgeBasePage from '../knowledge-base/KnowledgeBasePage.vue'
import KnowledgeBaseDetailPage from '../knowledge-base/KnowledgeBaseDetailPage.vue'
import MCPToolsPage from '../mcp-management/MCPToolsPage.vue'
import MCPGatewayPage from '../mcp-management/MCPGatewayPage.vue'

const activeView = ref<
  | 'home'
  | 'workflow'
  | 'my-agents'
  | 'team-agents'
  | 'team-detail'
  | 'mcp-tools'
  | 'mcp-gateway'
  | 'system-tools'
  | 'memory'
  | 'knowledge-base'
  | 'knowledge-base-detail'
>('home')
const selectedTeamId = ref<string | null>(null)
const selectedKnowledgeBaseId = ref<string | null>(null)
const showSettingsPanel = ref(false)
const showUserSettingsDialog = ref(false)
const showChatInterface = ref(false)
const showContentArea = ref(false)

const chatStore = useChatStore()
const workflowStore = useWorkflowStore()
const { isLoading, currentConversation } = chatStore
const { selectedNodeId: selectedWorkflowNodeId, isPreviewPanelVisible } = storeToRefs(workflowStore)

// Computed to safely check if a workflow node is selected
const hasSelectedWorkflowNode = computed(() => {
  return !!selectedWorkflowNodeId.value && selectedWorkflowNodeId.value !== ''
})

// Computed to get the selected workflow node
const selectedWorkflowNode = computed(() => {
  const node = workflowStore.getSelectedNode()
  return node || null
})

// Use computed for currentMessages to handle undefined cases
const currentMessages = computed(() => chatStore.currentMessages || [])

// Computed property to determine if HomePage is actually being shown
const isShowingHomePage = computed(() => {
  return activeView.value === 'home' && !showChatInterface.value && !showContentArea.value
})

const handleViewChange = (
  view:
    | 'home'
    | 'workflow'
    | 'my-agents'
    | 'team-agents'
    | 'mcp-tools'
    | 'mcp-gateway'
    | 'system-tools'
    | 'memory'
    | 'knowledge-base',
) => {
  activeView.value = view
}

const closeSettingsPanel = () => {
  showSettingsPanel.value = false
}

const openSettingsPanel = () => {
  showSettingsPanel.value = true
}

const onMessageSent = () => {
  // Message was sent, switch to chat interface
  showContentArea.value = false
  showChatInterface.value = true
}

const openUserSettingsDialog = () => {
  showUserSettingsDialog.value = true
}

const closeUserSettingsDialog = () => {
  showUserSettingsDialog.value = false
}

const startNewConversation = () => {
  // Clear current conversation ID to ensure a new conversation is created
  // when the user sends their first message
  chatStore.currentConversationId = null
  showContentArea.value = true
  showChatInterface.value = false
}

const selectConversation = (conversationId: string) => {
  // Select a conversation and show chat interface
  chatStore.selectConversation(conversationId)
  showChatInterface.value = true
  showContentArea.value = false
}

const startChatWithAgent = (agent: any) => {
  // Start a new conversation with a specific agent
  chatStore.clearConversation()
  showContentArea.value = true
  showChatInterface.value = false
  // The agent info will be handled in ContentArea
}

const selectRecentConversation = (conversation: any) => {
  // Select the conversation (it already exists in the store)
  chatStore.selectConversation(conversation.id)
  activeView.value = 'home'
  // Force show chat interface even if there are no messages yet
  showContentArea.value = false
  // Use nextTick to ensure the watch doesn't override our state
  nextTick(() => {
    showChatInterface.value = true
  })
}

const handleDeleteConversation = (conversationId: string) => {
  chatStore.deleteConversation(conversationId)
}

const goToHome = () => {
  // Reset all display states and show home page
  showChatInterface.value = false
  showContentArea.value = false
  activeView.value = 'home'
}

// Initialize display logic on mount
onMounted(() => {
  // Initialize demo conversations (first 5 conversations that cannot be deleted)
  chatStore.initializeDemoConversations()

  // Check if there are existing messages
  if (currentMessages.value.length > 0) {
    showChatInterface.value = true
    showContentArea.value = false
  } else {
    showChatInterface.value = false
    showContentArea.value = false
  }
})

// Watch for conversation changes
watch([currentMessages], () => {
  // If there are messages, show chat interface
  if (currentMessages.value.length > 0) {
    showChatInterface.value = true
    showContentArea.value = false
  } else {
    // If no messages, hide chat interface (will show home page)
    showChatInterface.value = false
  }
})

// Workflow node methods
const clearWorkflowNodeSelection = () => {
  workflowStore.selectNode(null)
}

const updateWorkflowNode = (nodeId: string, updates: any) => {
  workflowStore.updateNode(nodeId, updates)
}

// Create new agent from My Agents page
const handleCreateNewAgent = () => {
  // Create a new workflow and switch to workflow editor
  workflowStore.createWorkflow('新Agent')
  activeView.value = 'workflow'
}

// Edit agent from My Agents page
const handleEditAgent = (agentId: string) => {
  // Load the agent and switch to workflow editor
  workflowStore.loadAgent(agentId)
  const agentsStore = useAgentsStore()
  agentsStore.markAgentAsUsed(agentId)
  activeView.value = 'workflow'
}

// Open agent in editor from sidebar recent agents
const openAgentInEditor = (agentId: string) => {
  handleEditAgent(agentId)
}

// View team detail page
const handleViewTeam = (teamId: string) => {
  selectedTeamId.value = teamId
  activeView.value = 'team-detail'
}

// Go back from team detail page
const handleBackFromTeamDetail = () => {
  selectedTeamId.value = null
  activeView.value = 'team-agents'
}

// View knowledge base detail page
const handleViewKnowledgeBase = (knowledgeBaseId: string) => {
  selectedKnowledgeBaseId.value = knowledgeBaseId
  activeView.value = 'knowledge-base-detail'
}

// Go back from knowledge base detail page
const handleBackFromKnowledgeBaseDetail = () => {
  selectedKnowledgeBaseId.value = null
  activeView.value = 'knowledge-base'
}

// Edit knowledge base (opens edit dialog on detail page)
const handleEditKnowledgeBase = (knowledgeBaseId: string) => {
  // This will be handled by the detail page itself
}

// Make method available to child components
defineExpose({
  openSettingsPanel,
})
</script>
