<template>
  <div class="h-full flex flex-col bg-white">
    <!-- Welcome Header -->
    <div class="px-8 py-6 border-b border-gray-200">
      <h2 class="text-2xl font-semibold text-gray-900">
        你好，我是Agent Access! 有哪些工作要处理？
      </h2>
    </div>

    <!-- Main Chat Area - Two Column Layout -->
    <div class="flex-1 overflow-y-auto px-8 py-12 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
      <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Team Agents -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Team Agent Cards -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <svg class="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              选择团队Agent助手
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="agent in teamAgents"
                :key="agent.id"
                class="card hover:shadow-lg transition-all cursor-pointer border-l-4"
                :class="getAgentCardClass(agent.category)"
                @click="selectAgent(agent)"
              >
                <div class="flex items-start space-x-4">
                  <div
                    :class="[
                      'w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0',
                      getAgentIconClass(agent.category)
                    ]"
                  >
                    <svg
                      class="w-6 h-6"
                      :class="getAgentIconColorClass(agent.category)"
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
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="text-base font-semibold text-gray-900">
                      {{ agent.name }}
                    </h4>
                    <p class="text-sm text-gray-600 mt-1">
                      {{ agent.description }}
                    </p>
                    <div class="flex items-center mt-2">
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" :class="getAgentBadgeClass(agent.category)">
                        {{ getAgentCategoryName(agent.category) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Message Input & Configuration -->
        <div class="space-y-6">
          <!-- Message Input Area -->
          <div class="bg-gray-50 rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              发送消息
            </h3>

            <div class="space-y-4">
              <div class="relative">
                <textarea
                  v-model="messageInput"
                  placeholder="请输入您的任务需求..."
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm"
                  rows="6"
                  @keyup.enter.ctrl="sendMessage"
                ></textarea>
                <div class="absolute bottom-3 right-3 text-xs text-gray-400">
                  Ctrl + Enter 发送
                </div>
              </div>

              <button @click="sendMessage" class="w-full btn-primary flex items-center justify-center space-x-2 px-6 py-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                <span>发送</span>
              </button>
            </div>
          </div>

          <!-- Configuration Panel -->
          <div class="bg-gray-50 rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              配置选项
            </h3>

            <!-- Tab Navigation -->
            <div class="flex space-x-4 mb-4 border-b border-gray-200">
              <button
                @click="activeTab = 'knowledge'"
                :class="[
                  'pb-2 px-1 text-sm font-medium transition-colors',
                  activeTab === 'knowledge'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700',
                ]"
              >
                知识库
              </button>
              <button
                @click="activeTab = 'mcp'; $emit('open-settings')"
                :class="[
                  'pb-2 px-1 text-sm font-medium transition-colors',
                  activeTab === 'mcp'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700',
                ]"
              >
                MCP服务
              </button>
            </div>

            <!-- Tab Content -->
            <div>
              <!-- Knowledge Base Settings -->
              <div v-if="activeTab === 'knowledge'">
                <h4 class="text-sm font-medium text-gray-900 mb-3">选择知识库</h4>
                <div class="space-y-2">
                  <div v-for="kb in knowledgeBases" :key="kb.id" class="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      :id="'kb-' + kb.id"
                      name="knowledge-base"
                      :value="kb.id"
                      v-model="selectedKnowledgeBase"
                      class="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <label :for="'kb-' + kb.id" class="flex-1 cursor-pointer">
                      <div class="text-sm font-medium text-gray-900">{{ kb.name }}</div>
                      <div class="text-xs text-gray-500">{{ kb.documentCount }} 个文档</div>
                    </label>
                  </div>
                </div>
              </div>

              <!-- MCP Settings -->
              <div v-else-if="activeTab === 'mcp'">
                <div class="text-center py-6 text-gray-500">
                  <svg class="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <p class="text-sm">请在用户设置中配置MCP服务</p>
                  <button @click="$emit('open-settings')" class="mt-2 text-xs text-primary-600 hover:text-primary-700 underline">
                    打开用户设置
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useChatStore } from '@/stores/chat'

interface Emits {
  (e: 'open-settings'): void
  (e: 'message-sent'): void
}

const emit = defineEmits<Emits>()

const activeTab = ref<'knowledge' | 'mcp'>('knowledge')
const messageInput = ref('')
const selectedKnowledgeBase = ref('')

// Team Agents data
const teamAgents = [
  {
    id: '1',
    name: '智能数据分析',
    description: '提供高质量洞察服务，帮助企业实时获取在风险检测、产品研究、品牌监控等洞察',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    category: 'analysis' as 'analysis' | 'writing' | 'finance'
  },
  {
    id: '2',
    name: '写作助手',
    description: '智能写作辅助，帮助您快速创建高质量文档内容',
    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    category: 'writing' as 'analysis' | 'writing' | 'finance'
  },
  {
    id: '3',
    name: '股市基本面分析',
    description: '专业的股市分析工具，提供深度的基本面分析和投资建议',
    icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
    category: 'finance' as 'analysis' | 'writing' | 'finance'
  }
]

// Knowledge Base data
const knowledgeBases = [
  {
    id: '1',
    name: '市场快速打法知识库',
    documentCount: 45
  },
  {
    id: '2',
    name: '产品速知知识库',
    documentCount: 128
  },
  {
    id: '3',
    name: '产品安装知识库',
    documentCount: 67
  }
]

// Agent styling methods
const getAgentCardClass = (category: string) => {
  switch (category) {
    case 'analysis':
      return 'border-blue-500'
    case 'writing':
      return 'border-green-500'
    case 'finance':
      return 'border-orange-500'
    default:
      return 'border-gray-500'
  }
}

const getAgentIconClass = (category: string) => {
  switch (category) {
    case 'analysis':
      return 'bg-blue-100'
    case 'writing':
      return 'bg-green-100'
    case 'finance':
      return 'bg-orange-100'
    default:
      return 'bg-gray-100'
  }
}

const getAgentIconColorClass = (category: string) => {
  switch (category) {
    case 'analysis':
      return 'text-blue-600'
    case 'writing':
      return 'text-green-600'
    case 'finance':
      return 'text-orange-600'
    default:
      return 'text-gray-600'
  }
}

const getAgentBadgeClass = (category: string) => {
  switch (category) {
    case 'analysis':
      return 'bg-blue-100 text-blue-800'
    case 'writing':
      return 'bg-green-100 text-green-800'
    case 'finance':
      return 'bg-orange-100 text-orange-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getAgentCategoryName = (category: string) => {
  switch (category) {
    case 'analysis':
      return '数据分析'
    case 'writing':
      return '写作助手'
    case 'finance':
      return '金融分析'
    default:
      return '通用助手'
  }
}

const selectAgent = (agent: any) => {
  console.log('Selected agent:', agent)
  messageInput.value = `请使用 ${agent.name} 帮我：`
}

const sendMessage = async () => {
  console.log('sendMessage called, input:', messageInput.value)
  if (!messageInput.value.trim()) {
    console.log('Message input is empty, returning')
    return
  }

  const messageToSend = messageInput.value.trim()

  // 立即清空输入框
  messageInput.value = ''

  // 立即触发页面切换事件
  console.log('🔄 Triggering message-sent event for immediate page transition')
  emit('message-sent')

  try {
    console.log('Getting chat store...')
    const chatStore = useChatStore()
    console.log('Chat store loaded, sending message...')
    await chatStore.sendMessage(messageToSend)
    console.log('✅ Message sent successfully, streaming response should start')
  } catch (error) {
    console.error('❌ Failed to send message:', error)
    // 如果发送失败，恢复输入框内容
    messageInput.value = messageToSend
    alert(`发送消息失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}
</script>