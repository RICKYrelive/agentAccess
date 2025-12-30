<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAccessTemplateStore, type AccessTemplate } from '@/stores/accessTemplate'

interface Props {
  open?: boolean
  template?: AccessTemplate | null
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
  (e: 'saved', template: AccessTemplate): void
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  template: null,
  currentConfig: () => ({
    teamAgents: [],
  }),
})

const emit = defineEmits<Emits>()

const store = useAccessTemplateStore()

// Form state
const name = ref('')
const description = ref('')
const category = ref<'personal' | 'team' | 'public'>('personal')
const allowCopy = ref(true)

// Permission state
const permissionType = ref<'owner' | 'team' | 'public' | 'specific'>('owner')
const selectedTeams = ref<string[]>([])
const selectedUsers = ref<string[]>([])

// Available permission options based on category
const availablePermissionTypes = computed(() => {
  switch (category.value) {
    case 'personal':
      return [{ value: 'owner' as const, label: '仅自己可见' }]
    case 'public':
      return [{ value: 'public' as const, label: '所有人可见' }]
    case 'team':
      return [
        { value: 'team' as const, label: '指定团队' },
        { value: 'specific' as const, label: '指定团队与用户' },
      ]
  }
})

// Watch category change to auto-update permission type
watch(category, (newCategory) => {
  // Clear selections when switching categories
  selectedTeams.value = []
  selectedUsers.value = []

  // Set appropriate permission type for the category
  switch (newCategory) {
    case 'personal':
      permissionType.value = 'owner'
      break
    case 'public':
      permissionType.value = 'public'
      break
    case 'team':
      permissionType.value = 'team'
      break
  }
})

// Config selection state
const selectedTeamAgents = ref<string[]>([])
const selectedKnowledgeBase = ref('')
const selectedMcpTools = ref<string[]>([])
const selectedSystemTools = ref<string[]>([])
const selectedMemory = ref('')

// Search state
const teamAgentSearch = ref('')
const mcpToolSearch = ref('')
const systemToolSearch = ref('')
const knowledgeBaseSearch = ref('')
const memorySearch = ref('')
const teamSearch = ref('')
const userSearch = ref('')

// Active tab for config selection
const activeConfigTab = ref<'agents' | 'knowledge' | 'mcp' | 'system-tools' | 'memory'>('agents')

const showError = ref(false)
const errorMessage = ref('')

// Mock data
const mockTeamAgents = [
  { id: 'team-agent-1', name: '代码分析助手', description: '专门用于代码分析和审查' },
  { id: 'team-agent-2', name: '数据分析专家', description: '数据分析和报告生成' },
  { id: 'team-agent-3', name: '文档生成器', description: '技术文档自动生成' },
  { id: 'team-agent-4', name: '测试助手', description: '自动化测试用例生成' },
  { id: 'team-agent-5', name: 'API 调试器', description: 'API 接口调试和测试' },
]

const mockKnowledgeBases = [
  { id: 'kb-1', name: '产品知识库', documentCount: 120 },
  { id: 'kb-2', name: '技术文档库', documentCount: 85 },
  { id: 'kb-3', name: '市场资料库', documentCount: 200 },
  { id: 'kb-4', name: '用户手册', documentCount: 56 },
]

const mockMcpTools = [
  { id: 'mcp-web-search', name: 'Web 搜索', type: 'builtin' },
  { id: 'mcp-data-fetcher', name: '数据获取', type: 'builtin' },
  { id: 'mcp-code-executor', name: '代码执行', type: 'custom' },
  { id: 'mcp-file-manager', name: '文件管理', type: 'custom' },
  { id: 'mcp-api-caller', name: 'API 调用', type: 'builtin' },
]

const mockSystemTools = [
  { id: 'browser', name: '浏览器', description: '网页浏览和交互' },
  { id: 'code-interpreter', name: '代码解释器', description: '代码执行和分析' },
  { id: 'terminal', name: '终端', description: '命令行操作' },
  { id: 'file-system', name: '文件系统', description: '文件读写操作' },
]

const mockMemory = [
  { id: 'mem-1', name: '项目记忆体', strategy: 'summarization' },
  { id: 'mem-2', name: '用户偏好', strategy: 'user-preferences' },
  { id: 'mem-3', name: '会话历史', strategy: 'full-history' },
]

const mockTeams = [
  { id: 'team-dev', name: '开发团队' },
  { id: 'team-design', name: '设计团队' },
  { id: 'team-docs', name: '文档团队' },
]

const mockUsers = [
  { id: 'user-1', name: 'Alice' },
  { id: 'user-2', name: 'Bob' },
  { id: 'user-3', name: 'Charlie' },
]

// Filtered lists based on search
const filteredTeamAgents = computed(() => {
  if (!teamAgentSearch.value) return mockTeamAgents
  const search = teamAgentSearch.value.toLowerCase()
  return mockTeamAgents.filter(agent =>
    agent.name.toLowerCase().includes(search) ||
    agent.description.toLowerCase().includes(search)
  )
})

const filteredKnowledgeBases = computed(() => {
  if (!knowledgeBaseSearch.value) return mockKnowledgeBases
  const search = knowledgeBaseSearch.value.toLowerCase()
  return mockKnowledgeBases.filter(kb =>
    kb.name.toLowerCase().includes(search)
  )
})

const filteredMcpTools = computed(() => {
  if (!mcpToolSearch.value) return mockMcpTools
  const search = mcpToolSearch.value.toLowerCase()
  return mockMcpTools.filter(tool =>
    tool.name.toLowerCase().includes(search)
  )
})

const filteredSystemTools = computed(() => {
  if (!systemToolSearch.value) return mockSystemTools
  const search = systemToolSearch.value.toLowerCase()
  return mockSystemTools.filter(tool =>
    tool.name.toLowerCase().includes(search) ||
    tool.description.toLowerCase().includes(search)
  )
})

const filteredMemory = computed(() => {
  if (!memorySearch.value) return mockMemory
  const search = memorySearch.value.toLowerCase()
  return mockMemory.filter(mem =>
    mem.name.toLowerCase().includes(search)
  )
})

const filteredTeams = computed(() => {
  if (!teamSearch.value) return mockTeams
  const search = teamSearch.value.toLowerCase()
  return mockTeams.filter(team =>
    team.name.toLowerCase().includes(search)
  )
})

const filteredUsers = computed(() => {
  if (!userSearch.value) return mockUsers
  const search = userSearch.value.toLowerCase()
  return mockUsers.filter(user =>
    user.name.toLowerCase().includes(search)
  )
})

// Initialize form from template or current config
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      if (props.template) {
        // Edit mode
        name.value = props.template.name
        description.value = props.template.description
        category.value = Array.isArray(props.template.category)
          ? props.template.category[0] || 'personal'
          : props.template.category
        permissionType.value = props.template.permissions.type
        selectedTeams.value = props.template.permissions.teamIds || []
        selectedUsers.value = props.template.permissions.userIds || []
        allowCopy.value = props.template.permissions.allowCopy

        // Load config from template
        const config = props.template.config
        selectedTeamAgents.value = config.teamAgents || []
        selectedKnowledgeBase.value = config.knowledgeBase || ''
        selectedMcpTools.value = config.mcpTools || []
        selectedSystemTools.value = config.systemTools || []
        selectedMemory.value = config.memory || ''
      } else {
        // Create mode - reset
        name.value = ''
        description.value = ''
        category.value = 'personal'
        permissionType.value = 'owner'
        selectedTeams.value = []
        selectedUsers.value = []
        allowCopy.value = true

        // Initialize from current config or empty
        selectedTeamAgents.value = props.currentConfig?.teamAgents || []
        selectedKnowledgeBase.value = props.currentConfig?.knowledgeBase || ''
        selectedMcpTools.value = props.currentConfig?.mcpTools || []
        selectedSystemTools.value = props.currentConfig?.systemTools || []
        selectedMemory.value = props.currentConfig?.memory || ''
      }
      showError.value = false
      errorMessage.value = ''

      // Reset search
      teamAgentSearch.value = ''
      mcpToolSearch.value = ''
      systemToolSearch.value = ''
      knowledgeBaseSearch.value = ''
      memorySearch.value = ''
      teamSearch.value = ''
      userSearch.value = ''
      activeConfigTab.value = 'agents'
    }
  },
  { immediate: true }
)

const isEditMode = computed(() => !!props.template)

const canSave = computed(() => {
  return name.value.trim().length > 0
})

const categoryLabels = {
  personal: '个人',
  team: '团队',
  public: '公开',
} as const

const toggleTeamAgent = (id: string) => {
  const index = selectedTeamAgents.value.indexOf(id)
  if (index > -1) {
    selectedTeamAgents.value.splice(index, 1)
  } else {
    selectedTeamAgents.value.push(id)
  }
}

const toggleMcpTool = (id: string) => {
  const index = selectedMcpTools.value.indexOf(id)
  if (index > -1) {
    selectedMcpTools.value.splice(index, 1)
  } else {
    selectedMcpTools.value.push(id)
  }
}

const toggleSystemTool = (id: string) => {
  const index = selectedSystemTools.value.indexOf(id)
  if (index > -1) {
    selectedSystemTools.value.splice(index, 1)
  } else {
    selectedSystemTools.value.push(id)
  }
}

const saveTemplate = () => {
  // Validation
  if (!name.value.trim()) {
    showError.value = true
    errorMessage.value = '模板名称不能为空'
    return
  }

  const configData = {
    teamAgents: selectedTeamAgents.value,
    knowledgeBase: selectedKnowledgeBase.value || undefined,
    mcpTools: selectedMcpTools.value.length > 0 ? selectedMcpTools.value : undefined,
    systemTools: selectedSystemTools.value.length > 0 ? selectedSystemTools.value : undefined,
    memory: selectedMemory.value || undefined,
  }

  const templateData = {
    name: name.value.trim(),
    description: description.value.trim(),
    category: category.value,
    config: configData,
    permissions: {
      type: permissionType.value,
      owner: store.currentUserId,
      // For team category, allow both team and user selections
      ...(category.value === 'team'
        ? {
            teamIds: selectedTeams.value.length > 0 ? selectedTeams.value : undefined,
            userIds: selectedUsers.value.length > 0 ? selectedUsers.value : undefined,
          }
        : {
            teamIds: permissionType.value === 'team' ? selectedTeams.value : undefined,
            userIds: permissionType.value === 'specific' ? selectedUsers.value : undefined,
          }
      ),
      allowCopy: allowCopy.value,
    },
    createdBy: props.template?.createdBy || store.currentUserId,
  }

  let savedTemplate: AccessTemplate

  if (isEditMode.value && props.template) {
    savedTemplate = store.updateTemplate(props.template.id, templateData)!
  } else {
    savedTemplate = store.createTemplate(templateData)
  }

  emit('saved', savedTemplate)
  emit('update:open', false)
}

const closeDialog = () => {
  emit('update:open', false)
}

const configTabs = [
  { id: 'agents', label: '团队 Agent', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
  { id: 'knowledge', label: '知识库', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { id: 'mcp', label: 'MCP 工具', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
  { id: 'system-tools', label: '系统工具', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  { id: 'memory', label: '记忆体', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
] as const
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click.self="closeDialog"
  >
    <div
      class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      @click.stop
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900">
          {{ isEditMode ? '编辑模板' : '创建模板' }}
        </h2>
        <button
          @click="closeDialog"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Body with two columns -->
      <div class="flex-1 overflow-hidden flex">
        <!-- Left column: Basic info and permissions -->
        <div class="w-1/2 border-r border-gray-200 p-6 overflow-y-auto space-y-4">
          <!-- Error message -->
          <div
            v-if="showError"
            class="p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <p class="text-sm text-red-600">{{ errorMessage }}</p>
          </div>

          <!-- Template Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              模板名称 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="例如：市场分析标准配置"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              描述
            </label>
            <textarea
              v-model="description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
              placeholder="简要描述这个模板的用途..."
            />
          </div>

          <!-- Category (single select) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              分类
            </label>
            <div class="flex flex-wrap gap-2">
              <label
                v-for="(label, key) in categoryLabels"
                :key="key"
                class="flex items-center px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                :class="{ 'bg-blue-50 border-blue-300': category === key }"
              >
                <input
                  v-model="category"
                  :value="key"
                  type="radio"
                  name="category"
                  class="text-blue-600 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">{{ label }}</span>
              </label>
            </div>
          </div>

          <!-- Permission Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              访问权限
            </label>
            <select
              v-model="permissionType"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option
                v-for="option in availablePermissionTypes"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Team Selection (when team permission) -->
          <div v-if="category === 'team' || permissionType === 'team'">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              选择团队 <span class="text-gray-400">(可选)</span>
            </label>
            <input
              v-model="teamSearch"
              type="text"
              placeholder="搜索团队..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            />
            <div class="space-y-2 max-h-32 overflow-y-auto">
              <label
                v-for="team in filteredTeams"
                :key="team.id"
                class="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  v-model="selectedTeams"
                  :value="team.id"
                  type="checkbox"
                  class="rounded text-blue-600 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">{{ team.name }}</span>
              </label>
              <p v-if="filteredTeams.length === 0" class="text-xs text-gray-500 text-center py-2">未找到匹配的团队</p>
            </div>
            <p v-if="selectedTeams.length === 0" class="text-xs text-gray-500 mt-1">未选择任何团队</p>
          </div>

          <!-- User Selection (when team category with specific permission, or specific permission type) -->
          <div v-if="(category === 'team' && permissionType === 'specific') || (category !== 'team' && permissionType === 'specific')">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              选择用户 <span class="text-gray-400">(可选)</span>
            </label>
            <input
              v-model="userSearch"
              type="text"
              placeholder="搜索用户..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            />
            <div class="space-y-2 max-h-32 overflow-y-auto">
              <label
                v-for="user in filteredUsers"
                :key="user.id"
                class="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  v-model="selectedUsers"
                  :value="user.id"
                  type="checkbox"
                  class="rounded text-blue-600 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">{{ user.name }}</span>
              </label>
              <p v-if="filteredUsers.length === 0" class="text-xs text-gray-500 text-center py-2">未找到匹配的用户</p>
            </div>
            <p v-if="selectedUsers.length === 0" class="text-xs text-gray-500 mt-1">未选择任何用户</p>
          </div>

          <!-- Allow Copy -->
          <div v-if="category === 'public' || (category === 'team' && (selectedTeams.length > 0 || selectedUsers.length > 0))">
            <label class="flex items-center cursor-pointer">
              <input
                v-model="allowCopy"
                type="checkbox"
                class="rounded text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700">允许其他人复制此模板</span>
            </label>
          </div>
        </div>

        <!-- Right column: Config selection -->
        <div class="w-1/2 p-6 flex flex-col">
          <h3 class="text-sm font-semibold text-gray-900 mb-3">模板配置</h3>

          <!-- Config Tabs -->
          <div class="flex gap-1 mb-3 overflow-x-auto pb-1">
            <button
              v-for="tab in configTabs"
              :key="tab.id"
              @click="activeConfigTab = tab.id as any"
              :class="[
                'px-3 py-2 text-xs font-medium rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors',
                activeConfigTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100',
              ]"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  :d="tab.icon"
                />
              </svg>
              {{ tab.label }}
              <span v-if="tab.id === 'agents' && selectedTeamAgents.length > 0" class="bg-blue-200 text-blue-800 px-1.5 rounded-full text-xs">
                {{ selectedTeamAgents.length }}
              </span>
              <span v-if="tab.id === 'mcp' && selectedMcpTools.length > 0" class="bg-blue-200 text-blue-800 px-1.5 rounded-full text-xs">
                {{ selectedMcpTools.length }}
              </span>
              <span v-if="tab.id === 'system-tools' && selectedSystemTools.length > 0" class="bg-blue-200 text-blue-800 px-1.5 rounded-full text-xs">
                {{ selectedSystemTools.length }}
              </span>
            </button>
          </div>

          <!-- Config Content -->
          <div class="flex-1 overflow-y-auto border border-gray-200 rounded-lg">
            <!-- Team Agents -->
            <div v-if="activeConfigTab === 'agents'" class="p-3">
              <div class="mb-3">
                <input
                  v-model="teamAgentSearch"
                  type="text"
                  placeholder="搜索团队 Agent..."
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div class="space-y-2">
                <label
                  v-for="agent in filteredTeamAgents"
                  :key="agent.id"
                  class="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                  :class="{ 'bg-blue-50 border-blue-300': selectedTeamAgents.includes(agent.id) }"
                >
                  <input
                    :checked="selectedTeamAgents.includes(agent.id)"
                    @change="toggleTeamAgent(agent.id)"
                    type="checkbox"
                    class="rounded text-blue-600 focus:ring-blue-500 mt-0.5"
                  />
                  <div class="ml-3 flex-1">
                    <div class="text-sm font-medium text-gray-900">{{ agent.name }}</div>
                    <div class="text-xs text-gray-500">{{ agent.description }}</div>
                  </div>
                </label>
                <p v-if="filteredTeamAgents.length === 0" class="text-sm text-gray-500 text-center py-4">
                  未找到匹配的 Agent
                </p>
              </div>
            </div>

            <!-- Knowledge Base -->
            <div v-if="activeConfigTab === 'knowledge'" class="p-3">
              <div class="mb-3">
                <input
                  v-model="knowledgeBaseSearch"
                  type="text"
                  placeholder="搜索知识库..."
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div class="space-y-2">
                <label
                  v-for="kb in filteredKnowledgeBases"
                  :key="kb.id"
                  class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                  :class="{ 'bg-blue-50 border-blue-300': selectedKnowledgeBase === kb.id }"
                >
                  <input
                    v-model="selectedKnowledgeBase"
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
                <label
                  class="flex items-center p-3 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  :class="{ 'bg-blue-50 border-blue-300': selectedKnowledgeBase === '' }"
                >
                  <input
                    v-model="selectedKnowledgeBase"
                    value=""
                    type="radio"
                    name="knowledge-base"
                    class="text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-3 text-sm text-gray-600">不使用知识库</span>
                </label>
              </div>
            </div>

            <!-- MCP Tools -->
            <div v-if="activeConfigTab === 'mcp'" class="p-3">
              <div class="mb-3">
                <input
                  v-model="mcpToolSearch"
                  type="text"
                  placeholder="搜索 MCP 工具..."
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div class="space-y-2">
                <label
                  v-for="tool in filteredMcpTools"
                  :key="tool.id"
                  class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                  :class="{ 'bg-blue-50 border-blue-300': selectedMcpTools.includes(tool.id) }"
                >
                  <input
                    :checked="selectedMcpTools.includes(tool.id)"
                    @change="toggleMcpTool(tool.id)"
                    type="checkbox"
                    class="rounded text-blue-600 focus:ring-blue-500 mt-0.5"
                  />
                  <div class="ml-3 flex-1">
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-medium text-gray-900">{{ tool.name }}</span>
                      <span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{{ tool.type }}</span>
                    </div>
                  </div>
                </label>
                <p v-if="selectedMcpTools.length === 0" class="text-sm text-gray-500 mt-2">
                  未选择任何 MCP 工具
                </p>
              </div>
            </div>

            <!-- System Tools -->
            <div v-if="activeConfigTab === 'system-tools'" class="p-3">
              <div class="mb-3">
                <input
                  v-model="systemToolSearch"
                  type="text"
                  placeholder="搜索系统工具..."
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div class="space-y-2">
                <label
                  v-for="tool in filteredSystemTools"
                  :key="tool.id"
                  class="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                  :class="{ 'bg-blue-50 border-blue-300': selectedSystemTools.includes(tool.id) }"
                >
                  <input
                    :checked="selectedSystemTools.includes(tool.id)"
                    @change="toggleSystemTool(tool.id)"
                    type="checkbox"
                    class="rounded text-blue-600 focus:ring-blue-500 mt-0.5"
                  />
                  <div class="ml-3 flex-1">
                    <div class="text-sm font-medium text-gray-900">{{ tool.name }}</div>
                    <div class="text-xs text-gray-500">{{ tool.description }}</div>
                  </div>
                </label>
                <p v-if="selectedSystemTools.length === 0" class="text-sm text-gray-500 mt-2">
                  未选择任何系统工具
                </p>
              </div>
            </div>

            <!-- Memory -->
            <div v-if="activeConfigTab === 'memory'" class="p-3">
              <div class="mb-3">
                <input
                  v-model="memorySearch"
                  type="text"
                  placeholder="搜索记忆体..."
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div class="space-y-2">
                <label
                  v-for="mem in filteredMemory"
                  :key="mem.id"
                  class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                  :class="{ 'bg-blue-50 border-blue-300': selectedMemory === mem.id }"
                >
                  <input
                    v-model="selectedMemory"
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
                <label
                  class="flex items-center p-3 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  :class="{ 'bg-blue-50 border-blue-300': selectedMemory === '' }"
                >
                  <input
                    v-model="selectedMemory"
                    value=""
                    type="radio"
                    name="memory"
                    class="text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-3 text-sm text-gray-600">不使用记忆体</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
        <button
          @click="closeDialog"
          class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          取消
        </button>
        <button
          @click="saveTemplate"
          :disabled="!canSave"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors"
        >
          保存
        </button>
      </div>
    </div>
  </div>
</template>
