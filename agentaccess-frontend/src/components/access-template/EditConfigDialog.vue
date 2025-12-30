<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  open?: boolean
  currentConfig?: {
    teamAgents: string[]
    knowledgeBase?: string
    mcpTools?: string[]
    systemTools?: string[]
    memory?: string
  }
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'save', config: {
    teamAgents: string[]
    knowledgeBase?: string
    mcpTools?: string[]
    systemTools?: string[]
    memory?: string
  }): void
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  currentConfig: () => ({
    teamAgents: [],
  }),
})

const emit = defineEmits<Emits>()

// Local config state
const teamAgents = ref<string[]>([])
const knowledgeBase = ref('')
const mcpTools = ref<string[]>([])
const systemTools = ref<string[]>([])
const memory = ref('')

// Active tab
const activeTab = ref<'knowledge' | 'mcp' | 'system-tools' | 'memory'>('knowledge')

// Mock data for dropdowns
const mockTeamAgents = [
  { id: 'team-agent-1', name: '代码分析助手', description: '专门用于代码分析和审查' },
  { id: 'team-agent-2', name: '数据分析专家', description: '数据分析和报告生成' },
  { id: 'team-agent-3', name: '文档生成器', description: '技术文档自动生成' },
]

const mockKnowledgeBases = [
  { id: 'kb-1', name: '产品知识库', documentCount: 120 },
  { id: 'kb-2', name: '技术文档库', documentCount: 85 },
  { id: 'kb-3', name: '市场资料库', documentCount: 200 },
]

const mockMcpTools = [
  { id: 'mcp-web-search', name: 'Web 搜索', type: 'builtin' },
  { id: 'mcp-data-fetcher', name: '数据获取', type: 'builtin' },
  { id: 'mcp-code-executor', name: '代码执行', type: 'custom' },
]

const mockSystemTools = [
  { id: 'browser', name: '浏览器' },
  { id: 'code-interpreter', name: '代码解释器' },
  { id: 'terminal', name: '终端' },
]

const mockMemory = [
  { id: 'mem-1', name: '项目记忆体', strategy: 'summarization' },
  { id: 'mem-2', name: '用户偏好', strategy: 'user-preferences' },
]

// Initialize from current config
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen && props.currentConfig) {
      teamAgents.value = [...props.currentConfig.teamAgents]
      knowledgeBase.value = props.currentConfig.knowledgeBase || ''
      mcpTools.value = props.currentConfig.mcpTools || []
      systemTools.value = props.currentConfig.systemTools || []
      memory.value = props.currentConfig.memory || ''
    }
  },
  { immediate: true }
)

const saveConfig = () => {
  emit('save', {
    teamAgents: teamAgents.value,
    knowledgeBase: knowledgeBase.value || undefined,
    mcpTools: mcpTools.value.length > 0 ? mcpTools.value : undefined,
    systemTools: systemTools.value.length > 0 ? systemTools.value : undefined,
    memory: memory.value || undefined,
  })
  emit('update:open', false)
}

const closeDialog = () => {
  emit('update:open', false)
}

// Toggle helpers
const toggleTeamAgent = (id: string) => {
  const index = teamAgents.value.indexOf(id)
  if (index > -1) {
    teamAgents.value.splice(index, 1)
  } else {
    teamAgents.value.push(id)
  }
}

const toggleMcpTool = (id: string) => {
  const index = mcpTools.value.indexOf(id)
  if (index > -1) {
    mcpTools.value.splice(index, 1)
  } else {
    mcpTools.value.push(id)
  }
}

const toggleSystemTool = (id: string) => {
  const index = systemTools.value.indexOf(id)
  if (index > -1) {
    systemTools.value.splice(index, 1)
  } else {
    systemTools.value.push(id)
  }
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click.self="closeDialog"
  >
    <div
      class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      @click.stop
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">编辑配置</h2>
        <p class="text-sm text-gray-500 mt-1">
          修改配置后，系统将使用新配置重新处理最后一条消息
        </p>
      </div>

      <!-- Tab Navigation -->
      <div class="px-6 pt-4 border-b border-gray-200">
        <div class="flex gap-4">
          <button
            @click="activeTab = 'knowledge'"
            :class="[
              'px-3 py-2 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'knowledge'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900',
            ]"
          >
            知识库
          </button>
          <button
            @click="activeTab = 'mcp'"
            :class="[
              'px-3 py-2 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'mcp'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900',
            ]"
          >
            MCP 工具
          </button>
          <button
            @click="activeTab = 'system-tools'"
            :class="[
              'px-3 py-2 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'system-tools'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900',
            ]"
          >
            系统工具
          </button>
          <button
            @click="activeTab = 'memory'"
            :class="[
              'px-3 py-2 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'memory'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900',
            ]"
          >
            记忆体
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- Team Agents (Always visible) -->
        <div class="mb-6">
          <h4 class="text-sm font-medium text-gray-900 mb-3">团队 Agent</h4>
          <div class="space-y-2">
            <label
              v-for="agent in mockTeamAgents"
              :key="agent.id"
              class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                :checked="teamAgents.includes(agent.id)"
                @change="toggleTeamAgent(agent.id)"
                type="checkbox"
                class="rounded text-blue-600 focus:ring-blue-500"
              />
              <div class="ml-3 flex-1">
                <div class="text-sm font-medium text-gray-900">{{ agent.name }}</div>
                <div class="text-xs text-gray-500">{{ agent.description }}</div>
              </div>
            </label>
          </div>
          <p v-if="teamAgents.length === 0" class="text-sm text-gray-500 mt-2">未选择任何团队 Agent</p>
        </div>

        <!-- Knowledge Base -->
        <div v-if="activeTab === 'knowledge'">
          <h4 class="text-sm font-medium text-gray-900 mb-3">知识库</h4>
          <div class="space-y-2">
            <label
              v-for="kb in mockKnowledgeBases"
              :key="kb.id"
              class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                v-model="knowledgeBase"
                :value="kb.id"
                type="radio"
                name="knowledge-base"
                class="text-blue-600 focus:ring-blue-500"
              />
              <div class="ml-3 flex-1">
                <div class="text-sm font-medium text-gray-900">{{ kb.name }}</div>
                <div class="text-xs text-gray-500">{{ kb.documentCount }} 个文档</div>
              </div>
            </label>
          </div>
          <label class="flex items-center p-3 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer mt-2">
            <input
              v-model="knowledgeBase"
              value=""
              type="radio"
              name="knowledge-base"
              class="text-blue-600 focus:ring-blue-500"
            />
            <span class="ml-3 text-sm text-gray-600">不使用知识库</span>
          </label>
        </div>

        <!-- MCP Tools -->
        <div v-if="activeTab === 'mcp'">
          <h4 class="text-sm font-medium text-gray-900 mb-3">MCP 工具</h4>
          <div class="space-y-2">
            <label
              v-for="tool in mockMcpTools"
              :key="tool.id"
              class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                :checked="mcpTools.includes(tool.id)"
                @change="toggleMcpTool(tool.id)"
                type="checkbox"
                class="rounded text-blue-600 focus:ring-blue-500"
              />
              <div class="ml-3 flex-1">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium text-gray-900">{{ tool.name }}</span>
                  <span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{{ tool.type }}</span>
                </div>
              </div>
            </label>
          </div>
          <p v-if="mcpTools.length === 0" class="text-sm text-gray-500 mt-2">未选择任何 MCP 工具</p>
        </div>

        <!-- System Tools -->
        <div v-if="activeTab === 'system-tools'">
          <h4 class="text-sm font-medium text-gray-900 mb-3">系统工具</h4>
          <div class="space-y-2">
            <label
              v-for="tool in mockSystemTools"
              :key="tool.id"
              class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                :checked="systemTools.includes(tool.id)"
                @change="toggleSystemTool(tool.id)"
                type="checkbox"
                class="rounded text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-3 text-sm font-medium text-gray-900">{{ tool.name }}</span>
            </label>
          </div>
          <p v-if="systemTools.length === 0" class="text-sm text-gray-500 mt-2">未选择任何系统工具</p>
        </div>

        <!-- Memory -->
        <div v-if="activeTab === 'memory'">
          <h4 class="text-sm font-medium text-gray-900 mb-3">记忆体</h4>
          <div class="space-y-2">
            <label
              v-for="mem in mockMemory"
              :key="mem.id"
              class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                v-model="memory"
                :value="mem.id"
                type="radio"
                name="memory"
                class="text-blue-600 focus:ring-blue-500"
              />
              <div class="ml-3 flex-1">
                <div class="text-sm font-medium text-gray-900">{{ mem.name }}</div>
                <div class="text-xs text-gray-500">策略: {{ mem.strategy }}</div>
              </div>
            </label>
          </div>
          <label class="flex items-center p-3 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer mt-2">
            <input
              v-model="memory"
              value=""
              type="radio"
              name="memory"
              class="text-blue-600 focus:ring-blue-500"
            />
            <span class="ml-3 text-sm text-gray-600">不使用记忆体</span>
          </label>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <p class="text-xs text-gray-500">
          修改配置后将使用新配置重新处理最后一条消息
        </p>
        <div class="flex gap-3">
          <button
            @click="closeDialog"
            class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            @click="saveConfig"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            保存并重新发送
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
