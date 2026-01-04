<template>
  <div class="h-full flex flex-col bg-slate-50">
    <!-- Header -->
    <div class="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-semibold text-slate-900">主页</h2>
        <div class="text-sm text-slate-500">
          {{ currentDate }}
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div
      class="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 hover:scrollbar-thumb-slate-400"
    >
      <!-- Current Conversation Status -->
      <div class="bg-white roun/ded-lg p-6 shadow-sm">
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
          当前 Access 会话
        </h3>

        <div v-if="currentConversation" class="space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-slate-900">{{ currentConversation.title }}</p>
              <p class="text-sm text-slate-500">{{ currentConversation.messages.length }} 条消息</p>
            </div>
            <div class="flex space-x-2">
              <button @click="continueConversation" class="btn-primary px-4 py-2 text-sm">
                继续 Access 会话
              </button>
              <button @click="clearConversation" class="btn-secondary px-4 py-2 text-sm">
                清空
              </button>
            </div>
          </div>
          <div class="text-sm text-slate-600">
            最后更新: {{ formatTime(currentConversation.updatedAt) }}
          </div>
        </div>

        <div v-else class="text-center py-8 text-slate-500">
          <svg class="mx-auto h-12 w-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p>当前没有进行中的 Access 会话</p>
        </div>
      </div>

      <!-- Recent Conversations -->
      <div class="bg-white rounded-lg p-6 shadow-sm">
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Access 会话历史
        </h3>

        <div v-if="recentConversations.length > 0" class="space-y-3">
          <div
            v-for="conv in recentConversations"
            :key="conv.id"
            class="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
            @click="openRecentConversation(conv)"
          >
            <div>
              <p class="font-medium text-slate-900">{{ conv.title }}</p>
              <p class="text-sm text-slate-500">
                {{ conv.messages.length }} 条消息 · {{ formatTime(conv.updatedAt) }}
              </p>
            </div>
            <svg
              class="w-5 h-5 text-slate-400"
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
          </div>
        </div>

        <div v-else class="text-center py-8 text-slate-500">
          <p>暂无 Access 会话历史</p>
        </div>
      </div>

      <!-- My Agents Section -->
      <div class="bg-white rounded-lg p-6 shadow-sm">
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          我的Agent
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="agent in myAgents"
            :key="agent.id"
            class="p-4 border border-slate-200 rounded-lg hover:shadow-md cursor-pointer transition-shadow"
            @click="startChatWithAgent(agent)"
          >
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  class="w-6 h-6 text-blue-600"
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
              </div>
              <div>
                <p class="font-medium text-slate-900">{{ agent.name }}</p>
                <p class="text-sm text-slate-500">个人助手</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- System Tools Section -->
      <div class="bg-white rounded-lg p-6 shadow-sm">
        <h3 class="text-lg font-medium text-slate-900 mb-4 flex items-center">
          <svg
            class="w-5 h-5 mr-2 text-blue-600"
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
          系统工具
          <span class="text-sm font-normal text-slate-500 ml-2">({{ enabledSystemTools.length }}/{{ systemTools.length }})</span>
        </h3>

        <div v-if="systemTools.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <div
            v-for="tool in systemTools"
            :key="tool.id"
            class="p-3 border border-slate-200 rounded-lg hover:shadow-md cursor-pointer transition-all hover:border-blue-300"
            :class="{ 'opacity-50': !tool.isEnabled }"
            @click="toggleSystemTool(tool)"
          >
            <div class="flex flex-col items-center text-center">
              <div class="text-2xl mb-2">{{ tool.icon }}</div>
              <p class="text-sm font-medium text-slate-900 truncate w-full">{{ tool.name }}</p>
              <div class="flex items-center mt-1">
                <div class="w-1.5 h-1.5 rounded-full mr-1" :class="tool.isEnabled ? 'bg-green-500' : 'bg-slate-300'"></div>
                <p class="text-xs text-slate-500">{{ tool.isEnabled ? '已启用' : '已禁用' }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8 text-slate-500">
          <p>暂无已导入的系统工具</p>
        </div>
      </div>

      <!-- Sandboxes Section -->
      <div class="bg-white rounded-lg p-6 shadow-sm">
        <h3 class="text-lg font-medium text-slate-900 mb-4 flex items-center">
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
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          沙箱环境
          <span class="text-sm font-normal text-slate-500 ml-2">({{ runningSandboxCount }}/{{ sandboxes.length }} 运行中)</span>
        </h3>

        <div v-if="sandboxes.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="sandbox in sandboxes"
            :key="sandbox.id"
            class="p-4 border border-slate-200 rounded-lg hover:shadow-md cursor-pointer transition-all"
            :class="`border-l-4 ${getSandboxBorderClass(sandbox.status)}`"
          >
            <div class="flex items-start justify-between">
              <div class="flex items-center space-x-3">
                <div class="text-2xl">{{ sandbox.icon }}</div>
                <div>
                  <p class="font-medium text-slate-900">{{ sandbox.name }}</p>
                  <p class="text-xs text-slate-500">{{ getSandboxCategoryName(sandbox.category) }}</p>
                </div>
              </div>
              <span class="text-xs px-2 py-0.5 rounded-full" :class="getSandboxStatusClass(sandbox.status)">
                {{ getSandboxStatusName(sandbox.status) }}
              </span>
            </div>
            <p class="text-sm text-slate-600 mt-2 line-clamp-2">{{ sandbox.description }}</p>
            <div class="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
              <span class="text-xs text-slate-500">{{ sandbox.instances.length }} 个实例</span>
              <div class="flex items-center space-x-2">
                <span v-if="sandbox.instances.length > 0" class="text-xs text-slate-500">
                  CPU: {{ Math.round(sandbox.instances.reduce((sum, i) => sum + i.resources.cpuPercent, 0) / (sandbox.instances.length || 1)) }}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8 text-slate-500">
          <p>暂无已导入的沙箱环境</p>
        </div>
      </div>

      <!-- Team Agents Section -->
      <div class="bg-white rounded-lg p-6 shadow-sm">
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
          团队Agent
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="agent in teamAgents"
            :key="agent.id"
            class="p-4 border border-slate-200 rounded-lg hover:shadow-md cursor-pointer transition-shadow"
            :class="`border-l-4 ${getAgentBorderClass(agent.category)}`"
            @click="startChatWithAgent(agent)"
          >
            <div class="flex items-center space-x-3">
              <div
                :class="`w-10 h-10 ${getAgentBgClass(agent.category)} rounded-lg flex items-center justify-center`"
              >
                <svg
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
              </div>
              <div>
                <p class="font-medium text-slate-900">{{ agent.name }}</p>
                <p class="text-sm text-slate-500">{{ getAgentCategoryName(agent.category) }}</p>
              </div>
            </div>
            <p class="text-sm text-slate-600 mt-2">{{ agent.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from '@/stores/chat'
import { useAgentsStore } from '@/stores/agents'
import { useSystemToolsStore } from '@/stores/systemTools'

interface Emits {
  (e: 'continue-conversation'): void
  (e: 'start-new-conversation'): void
  (e: 'select-conversation', conversationId: string): void
  (e: 'start-chat-with-agent', agent: any): void
  (e: 'select-recent-conversation', conversation: any): void
}

const emit = defineEmits<Emits>()

const chatStore = useChatStore()
const agentsStore = useAgentsStore()
const systemToolsStore = useSystemToolsStore()

const { currentConversation, conversations } = storeToRefs(chatStore)
const { myAgents, teamAgents } = storeToRefs(agentsStore)
const { builtinTools, sandboxTypes } = storeToRefs(systemToolsStore)
const { toggleBuiltInTool } = systemToolsStore

// System tools and sandboxes
const systemTools = computed(() => builtinTools.value)
const enabledSystemTools = computed(() => builtinTools.value.filter(t => t.isEnabled))
const sandboxes = computed(() => sandboxTypes.value)
const runningSandboxCount = computed(() =>
  sandboxTypes.value.filter(s => s.status === 'running').length
)

// Current date
const currentDate = computed(() => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(new Date())
})

// Recent conversations (exclude current one, show conversations with messages)
const recentConversations = computed(() => {
  // Hardcoded recent conversations (same as sidebar)
  const hardcoded = [
    {
      id: 'conv-1',
      title: '帮我生成一个PPT',
      messages: [
        { role: 'user', content: '帮我生成一个PPT' },
        { role: 'assistant', content: '好的，我可以帮您生成PPT。请告诉我PPT的主题是什么？' },
        { role: 'user', content: '关于人工智能发展趋势' },
        {
          role: 'assistant',
          content:
            '明白了！我将为您创建一个关于人工智能发展趋势的PPT。我已经为您生成了演示文稿，包含以下内容：\n\n1. 人工智能发展历程\n2. 当前主流AI技术\n3. 未来发展趋势\n4. 行业应用案例\n\n您可以通过以下链接下载PPT：https://example.com/download/ppt-ai-trends.pptx',
        },
      ],
      updatedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    },
    {
      id: 'conv-2',
      title: '给我设置一个明天8点的会议提醒',
      messages: [
        { role: 'user', content: '给我设置一个明天8点的会议提醒' },
        {
          role: 'assistant',
          content:
            '好的，我已经为您设置了明天上午8点的会议提醒。提醒内容：\n\n📅 时间：明天 8:00 AM\n⏰ 提醒：会议提醒\n\n我会准时提醒您参加会议。需要我添加会议备注吗？',
        },
      ],
      updatedAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    },
    {
      id: 'conv-3',
      title: '写一封产品介绍邮件',
      messages: [
        { role: 'user', content: '写一封产品介绍邮件' },
        {
          role: 'assistant',
          content:
            '好的，以下是一封产品介绍邮件的草稿：\n\n主题：全新智能产品介绍\n\n尊敬的客户，\n\n您好！我们很高兴向您介绍我们最新推出的智能产品...\n\n请告诉我您想介绍什么产品，我可以帮您定制更具体的内容。',
        },
      ],
      updatedAt: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    },
    {
      id: 'conv-4',
      title: '分析这个数据报表',
      messages: [
        { role: 'user', content: '分析这个数据报表' },
        {
          role: 'assistant',
          content:
            '我看到您上传了数据报表。让我来帮您分析一下...\n\n根据报表数据，我发现了以下几个关键趋势：\n1. 销售额比去年同期增长了25%\n2. 用户活跃度提升了15%\n3. 新用户转化率达到了8%\n\n需要我深入分析某个特定指标吗？',
        },
      ],
      updatedAt: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
    },
    {
      id: 'conv-5',
      title: '翻译这段文字到英文',
      messages: [
        { role: 'user', content: '翻译这段文字到英文' },
        { role: 'assistant', content: '请提供您需要翻译的文字内容，我会帮您翻译成地道的英文。' },
      ],
      updatedAt: new Date(Date.now() - 1000 * 60 * 240), // 4 hours ago
    },
  ]

  console.log('🔍 HomePage - hardcoded conversations:', hardcoded.length)
  return hardcoded
})

// Helper functions
const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const getAgentBorderClass = (category?: string) => {
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

const getAgentBgClass = (category?: string) => {
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

const getAgentIconClass = (category?: string) => {
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

const getAgentCategoryName = (category?: string) => {
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

// Event handlers
const continueConversation = () => {
  emit('continue-conversation')
}

const clearConversation = () => {
  if (confirm('确定要清空当前 Access 会话吗？')) {
    chatStore.clearConversation()
  }
}

const openConversation = (conversationId: string) => {
  emit('select-conversation', conversationId)
}

const openRecentConversation = (conversation: any) => {
  emit('select-recent-conversation', conversation)
}

const startChatWithAgent = (agent: any) => {
  emit('start-chat-with-agent', agent)
}

// Toggle system tool enabled state
const toggleSystemTool = (tool: any) => {
  toggleBuiltInTool(tool.id)
}

// Sandbox helper functions
const getSandboxBorderClass = (status: string) => {
  switch (status) {
    case 'running':
      return 'border-green-500'
    case 'stopped':
      return 'border-slate-400'
    case 'error':
      return 'border-red-500'
    default:
      return 'border-slate-400'
  }
}

const getSandboxStatusClass = (status: string) => {
  switch (status) {
    case 'running':
      return 'bg-green-100 text-green-700'
    case 'stopped':
      return 'bg-slate-100 text-slate-700'
    case 'error':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

const getSandboxStatusName = (status: string) => {
  switch (status) {
    case 'running':
      return '运行中'
    case 'stopped':
      return '已停止'
    case 'error':
      return '错误'
    default:
      return status
  }
}

const getSandboxCategoryName = (category: string) => {
  switch (category) {
    case 'code-interpreter':
      return '代码解释器'
    case 'browser-use':
      return 'Browser Use'
    case 'terminal':
      return '终端'
    default:
      return category
  }
}
</script>
