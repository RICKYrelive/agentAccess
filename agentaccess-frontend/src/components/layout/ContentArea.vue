<template>
  <div class="h-full flex flex-col bg-white">
    <!-- Welcome Header -->
    <div class="px-8 py-6 border-b border-slate-200">
      <h2 class="text-2xl font-semibold text-slate-900">
        你好，我是Agent Access! 有哪些工作要处理？
      </h2>
    </div>

    <!-- Main Content Area -->
    <div
      class="flex-1 overflow-y-auto px-8 py-8 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 hover:scrollbar-thumb-slate-400"
    >
      <div class="max-w-6xl mx-auto space-y-8">
        <!-- Message Input Section - Full Width -->
        <div class="bg-slate-50 rounded-lg p-6">
          <h3 class="text-lg font-medium text-slate-900 mb-4 flex items-center">
            <svg
              class="w-5 h-5 mr-2 text-primary-600"
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
            发送消息
          </h3>

          <div class="space-y-4">
            <div class="relative">
              <textarea
                v-model="messageInput"
                :placeholder="displayedPlaceholder"
                @focus="handleInputFocus"
                @blur="handleInputBlur"
                class="message-textarea"
                rows="5"
                @keyup.enter.ctrl="sendMessage"
              ></textarea>
              <div class="absolute bottom-3 right-3 text-xs text-slate-400">Ctrl + Enter 发送</div>
            </div>

            <div class="flex justify-end">
              <button
                @click="sendMessage"
                :disabled="!messageInput.trim()"
                class="send-button-inline"
                :class="[
                  'flex items-center justify-center space-x-2 px-8 py-2 transition-all duration-200',
                  messageInput.trim()
                    ? 'btn-primary opacity-100 cursor-pointer'
                    : 'bg-slate-300 text-slate-500 opacity-50 cursor-not-allowed'
                ]"
              >
                <span class="send-button-content" :class="{ 'content-floating': hasInput }">
                  <svg class="w-5 h-5 send-arrow-icon arrow-bouncing" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  <span>发送</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- My Agents and Configuration Panel Side by Side -->
        <div class="grid grid-cols-2 gap-8">
          <!-- My Agent Section (Left) -->
          <div>
            <h3 class="text-lg font-medium text-slate-900 mb-4 flex items-center justify-between">
              <div class="flex items-center">
                <svg
                  class="w-5 h-5 mr-2 text-purple-600"
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
                我的 Agent
              </div>
              <span class="text-sm text-slate-500">已选 {{ selectedMyAgents.length }}</span>
            </h3>

            <!-- Search Input -->
            <div class="relative mb-4">
              <input
                v-model="myAgentSearchQuery"
                type="text"
                placeholder="搜索我的 Agent..."
                class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
              <svg class="absolute left-3 top-2.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <!-- Agent List -->
            <div class="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <div v-if="filteredMyAgents.length > 0" class="divide-y divide-slate-200">
                <label
                  v-for="agent in filteredMyAgents"
                  :key="agent.id"
                  class="flex items-center p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                  :class="{ 'bg-purple-50': selectedMyAgents.includes(agent.id) }"
                >
                  <input
                    type="checkbox"
                    :value="agent.id"
                    v-model="selectedMyAgents"
                    class="w-4 h-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded"
                  />
                  <div class="ml-4 flex-1">
                    <div class="text-sm font-medium text-slate-900">{{ agent.name }}</div>
                    <div class="text-xs text-slate-500 mt-0.5">{{ agent.description }}</div>
                  </div>
                </label>
              </div>
              <div v-else class="text-center py-8 text-slate-500 text-sm">
                {{ myAgentSearchQuery ? '没有找到匹配的 Agent' : '暂无 Agent，请先创建' }}
              </div>
            </div>

            <div class="mt-3 flex items-center justify-between">
              <button
                @click="goToMyAgentsPage"
                class="text-sm text-purple-600 hover:text-purple-700 font-medium inline-flex items-center"
              >
                查看全部我的 Agent
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <!-- Team Agent Section (Below My Agents) -->
            <div class="mt-8">
              <h3 class="text-lg font-medium text-slate-900 mb-4 flex items-center justify-between">
                <div class="flex items-center">
                  <svg
                    class="w-5 h-5 mr-2 text-primary-600"
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
                  团队 Agent
                </div>
                <span class="text-sm text-slate-500">已选 {{ selectedTeamAgents.length }}</span>
              </h3>

              <!-- Search Input -->
              <div class="relative mb-4">
                <input
                  v-model="teamAgentSearchQuery"
                  type="text"
                  placeholder="搜索团队 Agent..."
                  class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
                <svg class="absolute left-3 top-2.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <!-- Team Agent List -->
              <div class="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div v-if="filteredTeamAgents.length > 0" class="divide-y divide-slate-200">
                  <label
                    v-for="agent in filteredTeamAgents"
                    :key="agent.id"
                    class="flex items-center p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                    :class="{ 'bg-primary-50': selectedTeamAgents.includes(agent.id) }"
                  >
                    <input
                      type="checkbox"
                      :value="agent.id"
                      v-model="selectedTeamAgents"
                      class="w-4 h-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded"
                    />
                    <div class="ml-4 flex-1">
                      <div class="flex items-center">
                        <div class="text-sm font-medium text-slate-900">{{ agent.name }}</div>
                        <span
                          class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                          :class="getAgentBadgeClass(agent.category)"
                        >
                          {{ getAgentCategoryName(agent.category) }}
                        </span>
                      </div>
                      <div class="text-xs text-slate-500 mt-0.5">{{ agent.description }}</div>
                    </div>
                  </label>
                </div>
                <div v-else class="text-center py-8 text-slate-500 text-sm">
                  {{ teamAgentSearchQuery ? '没有找到匹配的 Agent' : '暂无团队 Agent' }}
                </div>
              </div>
            </div>
          </div>

          <!-- Configuration Panel (Right) -->
          <div class="bg-slate-50 rounded-lg p-6">
          <h3 class="text-lg font-medium text-slate-900 mb-4 flex items-center">
            <svg
              class="w-5 h-5 mr-2 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
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
          <div class="flex space-x-4 mb-4 border-b border-slate-200 overflow-x-auto">
            <button
              @click="activeTab = 'knowledge'"
              :class="[
                'pb-2 px-3 text-sm font-medium transition-colors whitespace-nowrap',
                activeTab === 'knowledge'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-slate-500 hover:text-slate-700',
              ]"
            >
              知识库
            </button>
            <button
              @click="activeTab = 'mcp'"
              :class="[
                'pb-2 px-3 text-sm font-medium transition-colors whitespace-nowrap',
                activeTab === 'mcp'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-slate-500 hover:text-slate-700',
              ]"
            >
              MCP服务
            </button>
            <button
              @click="activeTab = 'system-tools'"
              :class="[
                'pb-2 px-3 text-sm font-medium transition-colors whitespace-nowrap',
                activeTab === 'system-tools'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-slate-500 hover:text-slate-700',
              ]"
            >
              系统工具
            </button>
            <button
              @click="activeTab = 'memory'"
              :class="[
                'pb-2 px-3 text-sm font-medium transition-colors whitespace-nowrap',
                activeTab === 'memory'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-slate-500 hover:text-slate-700',
              ]"
            >
              记忆体
            </button>
          </div>

          <!-- Tab Content -->
          <div>
            <!-- Knowledge Base Settings -->
            <div v-if="activeTab === 'knowledge'">
              <h4 class="text-sm font-medium text-slate-900 mb-3">选择知识库</h4>
              <div class="space-y-2">
                <div
                  v-for="kb in knowledgeBases"
                  :key="kb.id"
                  class="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    :id="'kb-' + kb.id"
                    name="knowledge-base"
                    :value="kb.id"
                    v-model="selectedKnowledgeBase"
                    class="w-4 h-4 text-primary-600 focus:ring-primary-500 border-slate-300"
                  />
                  <label :for="'kb-' + kb.id" class="flex-1 cursor-pointer">
                    <div class="text-sm font-medium text-slate-900">{{ kb.name }}</div>
                    <div class="text-xs text-slate-500">{{ kb.documentCount }} 个文档</div>
                  </label>
                </div>
              </div>
            </div>

            <!-- MCP Settings -->
            <MCPInlineConfig
              v-else-if="activeTab === 'mcp'"
              v-model:selectedTools="selectedMcpTools"
            />

            <!-- System Tools Settings -->
            <SystemToolsInlineConfig
              v-else-if="activeTab === 'system-tools'"
              v-model:selectedTools="selectedSystemTools"
            />

            <!-- Memory Settings -->
            <MemoryInlineConfig
              v-else-if="activeTab === 'memory'"
              v-model:selectedMemory="selectedMemory"
              @go-to-memory="handleGoToMemory"
            />
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useAgentsStore } from '@/stores/agents'
import MCPInlineConfig from '@/components/config/MCPInlineConfig.vue'
import SystemToolsInlineConfig from '@/components/config/SystemToolsInlineConfig.vue'
import MemoryInlineConfig from '@/components/config/MemoryInlineConfig.vue'

interface Emits {
  (e: 'open-settings'): void
  (e: 'message-sent'): void
  (e: 'view-change', view: string): void
}

const emit = defineEmits<Emits>()

const agentsStore = useAgentsStore()
const chatStore = useChatStore()

// Typewriter effect
const exampleQuestions = [
  '帮我分析一下最近一周的销售数据趋势',
  '帮我写一份产品介绍邮件',
  '总结一下这份文档的核心要点',
  '帮我制定一个项目实施计划',
  '帮我分析这个数据报表',
  '帮我翻译这段文字到英文',
  '帮我搜索相关资料并整理成报告',
]

const typewriterText = ref('')
const isUserTyping = ref(false)
let typewriterInterval: number | null = null
let typewriterTimeout: number | null = null

const startTypewriter = () => {
  if (isUserTyping.value) return

  let questionIndex = 0
  let charIndex = 0
  let isDeleting = false

  const type = () => {
    const currentQuestion = exampleQuestions[questionIndex]

    if (isDeleting) {
      typewriterText.value = currentQuestion.substring(0, charIndex - 1)
      charIndex--

      if (charIndex === 0) {
        isDeleting = false
        questionIndex = (questionIndex + 1) % exampleQuestions.length
        typewriterTimeout = window.setTimeout(type, 500)
        return
      }
    } else {
      typewriterText.value = currentQuestion.substring(0, charIndex + 1)
      charIndex++

      if (charIndex === currentQuestion.length) {
        isDeleting = true
        typewriterTimeout = window.setTimeout(type, 2000)
        return
      }
    }

    const speed = isDeleting ? 30 : 80
    typewriterTimeout = window.setTimeout(type, speed)
  }

  type()
}

const stopTypewriter = () => {
  if (typewriterTimeout) {
    clearTimeout(typewriterTimeout)
    typewriterTimeout = null
  }
  if (typewriterInterval) {
    clearInterval(typewriterInterval)
    typewriterInterval = null
  }
  typewriterText.value = ''
}

const handleInputFocus = () => {
  isUserTyping.value = true
  stopTypewriter()
}

const handleInputBlur = () => {
  if (!messageInput.value.trim()) {
    isUserTyping.value = false
    nextTick(() => {
      if (!messageInput.value.trim()) {
        startTypewriter()
      }
    })
  }
}

const displayedPlaceholder = computed(() => {
  if (isUserTyping.value || messageInput.value) {
    return ''
  }
  return typewriterText.value
})

onMounted(() => {
  startTypewriter()
})

onUnmounted(() => {
  stopTypewriter()
})

// Get all my agents
const allMyAgents = computed(() => agentsStore.myAgents)
const allTeamAgents = computed(() => agentsStore.teamAgents)

// Agent selection state
const selectedMyAgents = ref<string[]>([])
const selectedTeamAgents = ref<string[]>([])

// Search queries
const myAgentSearchQuery = ref('')
const teamAgentSearchQuery = ref('')

// Filtered agents
const filteredMyAgents = computed(() => {
  if (!myAgentSearchQuery.value) return allMyAgents.value
  const query = myAgentSearchQuery.value.toLowerCase()
  return allMyAgents.value.filter(agent =>
    agent.name.toLowerCase().includes(query) ||
    agent.description.toLowerCase().includes(query)
  )
})

const filteredTeamAgents = computed(() => {
  if (!teamAgentSearchQuery.value) return allTeamAgents.value
  const query = teamAgentSearchQuery.value.toLowerCase()
  return allTeamAgents.value.filter(agent =>
    agent.name.toLowerCase().includes(query) ||
    agent.description.toLowerCase().includes(query)
  )
})

const activeTab = ref<'knowledge' | 'mcp' | 'system-tools' | 'memory'>('knowledge')
const messageInput = ref('')
const selectedKnowledgeBase = ref('')
const selectedMcpTools = ref<string[]>([])
const selectedSystemTools = ref<string[]>([])
const selectedMemory = ref('')

// Knowledge Base data
const knowledgeBases = [
  {
    id: '1',
    name: '市场快速打法知识库',
    documentCount: 45,
  },
  {
    id: '2',
    name: '产品速知知识库',
    documentCount: 128,
  },
  {
    id: '3',
    name: '产品安装知识库',
    documentCount: 67,
  },
]

// 是否有输入内容，用于触发箭头跳动
const hasInput = computed(() => messageInput.value.trim().length > 0)

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
      return 'border-slate-500'
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
      return 'bg-slate-100'
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
      return 'text-slate-600'
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
      return 'bg-slate-100 text-slate-800'
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

const goToMyAgentsPage = () => {
  emit('view-change', 'my-agents')
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

    // Build configuration payload
    const config = {
      knowledgeBase: selectedKnowledgeBase.value || undefined,
      mcpTools: selectedMcpTools.value.length > 0 ? selectedMcpTools.value : undefined,
      systemTools: selectedSystemTools.value.length > 0 ? selectedSystemTools.value : undefined,
      memory: selectedMemory.value || undefined,
    }

    console.log('📋 Configuration payload:', config)
    console.log('Chat store loaded, sending message...')
    await chatStore.sendMessage(messageToSend, config)
    console.log('✅ Message sent successfully, streaming response should start')
  } catch (error) {
    console.error('❌ Failed to send message:', error)
    // 如果发送失败，恢复输入框内容
    messageInput.value = messageToSend
    alert(`发送消息失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

const handleMcpTabClick = () => {
  activeTab.value = 'mcp'
}

const handleGoToMemory = () => {
  emit('view-change', 'memory')
}
</script>

<style scoped>
/* 消息输入框样式 */
.message-textarea {
  @apply w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none;
  font-size: 1rem;
  line-height: 1.6;
}

.message-textarea::placeholder {
  font-size: 1.5rem;
  color: #9ca3af;
  font-weight: 400;
}

/* 发送按钮样式 - 瘦一些，边缘圆润 */
.send-button-inline {
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.send-button-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* 按钮内容透明度动画 - 与箭头同步 */
.send-button-content.content-floating {
  animation: contentOpacity 2s ease-in-out infinite !important;
}

@keyframes contentOpacity {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.2;
  }
}

/* 箭头上下浮动动画 - 只负责移动 */
.send-arrow-icon.arrow-bouncing {
  animation: arrowFloat 2s ease-in-out infinite !important;
}

@keyframes arrowFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}
</style>
