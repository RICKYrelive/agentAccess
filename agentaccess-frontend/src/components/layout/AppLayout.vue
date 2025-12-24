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
    />

    <!-- Main Content Area - Independent Scroll -->
    <div class="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
      <!-- Home Page View -->
      <div v-if="activeView === 'home'" class="flex-1 overflow-hidden">
        <!-- Chat Interface (shown when there are messages) -->
        <ChatInterface
          v-if="showChatInterface"
          class="flex-1 h-full overflow-hidden"
        />

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
      <WorkflowCanvas
        v-else-if="activeView === 'workflow'"
        class="flex-1 h-full overflow-hidden"
      />
    </div>

    <!-- Right Panels -->
    <div class="flex flex-col h-screen">
      <!-- MCP Settings Panel -->
      <SettingsPanel
        v-if="showSettingsPanel"
        key="settings"
        class="w-80 flex-shrink-0 border-l border-gray-200"
        @close="closeSettingsPanel"
      />

      <!-- Workflow Right Panel -->
      <div v-if="activeView === 'workflow'" class="relative w-96 h-screen flex-shrink-0">
        <PreviewPanel
          v-show="!hasSelectedWorkflowNode"
          key="preview"
          class="absolute inset-0 border-l border-gray-200"
        />
        <NodeConfigPanel
          v-show="hasSelectedWorkflowNode"
          key="node-config"
          :node="selectedWorkflowNode"
          class="absolute inset-0 border-l border-gray-200"
          @close="clearWorkflowNodeSelection"
          @update="updateWorkflowNode"
        />
      </div>
    </div>

    <!-- User Settings Dialog -->
    <UserSettingsDialog
      v-if="showUserSettingsDialog"
      @close="closeUserSettingsDialog"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useWorkflowStore } from '@/stores/workflow'
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

const activeView = ref<'home' | 'workflow'>('home')
const showSettingsPanel = ref(false)
const showUserSettingsDialog = ref(false)
const showChatInterface = ref(false)
const showContentArea = ref(false)

const chatStore = useChatStore()
const workflowStore = useWorkflowStore()
const { isLoading, currentConversation } = chatStore
const { selectedNodeId: selectedWorkflowNodeId } = storeToRefs(workflowStore)

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

const handleViewChange = (view: 'home' | 'workflow') => {
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
  // Create a new conversation and show new conversation interface
  chatStore.createConversation()
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
  // Load the recent conversation into the chat store
  chatStore.conversations.unshift({
    id: conversation.id,
    title: conversation.title,
    messages: conversation.messages,
    settings: {},
    createdAt: new Date(),
    updatedAt: new Date()
  })
  chatStore.currentConversationId = conversation.id
  showChatInterface.value = true
  showContentArea.value = false
}

const goToHome = () => {
  // Reset all display states and show home page
  showChatInterface.value = false
  showContentArea.value = false
  activeView.value = 'home'
}

// Initialize display logic on mount
onMounted(() => {
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

// Make method available to child components
defineExpose({
  openSettingsPanel,
})
</script>
