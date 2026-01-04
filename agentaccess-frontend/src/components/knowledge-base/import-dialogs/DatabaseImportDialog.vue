<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col"
      @click.stop
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white"
      >
        <h2 class="text-xl font-semibold text-slate-900">导入数据库知识库</h2>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Form with scrollable content -->
      <div class="flex-1 overflow-y-auto p-6">
        <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">
            知识库名称 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            maxlength="100"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="请输入知识库名称"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1"> 描述 </label>
          <textarea
            v-model="form.description"
            rows="2"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            placeholder="请输入知识库描述（可选）"
          />
        </div>

        <!-- Database Type -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">
            数据库类型 <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.dbType"
            @change="updateDefaultPort"
            required
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="mysql">MySQL</option>
            <option value="postgresql">PostgreSQL</option>
          </select>
        </div>

        <!-- Host -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">
            主机地址 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.host"
            type="text"
            required
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="localhost 或 IP 地址"
          />
        </div>

        <!-- Port -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">
            端口 <span class="text-red-500">*</span>
          </label>
          <input
            v-model.number="form.port"
            type="number"
            required
            min="1"
            max="65535"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="端口号"
          />
        </div>

        <!-- Username -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">
            用户名 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.username"
            type="text"
            required
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="数据库用户名"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">
            密码 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.password"
            type="password"
            required
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="数据库密码"
          />
        </div>

        <!-- Database Name -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">
            数据库名 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.database"
            type="text"
            required
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="数据库名称"
          />
        </div>

        <!-- Connection Test Button -->
        <div class="flex items-center space-x-2">
          <button
            type="button"
            @click="testConnection"
            :disabled="isTesting || !canTestConnection"
            class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <svg v-if="isTesting" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>{{ isTesting ? '连接中...' : '测试连接' }}</span>
          </button>
          <span
            v-if="connectionTestResult"
            :class="connectionTestResult.success ? 'text-green-600' : 'text-red-600'"
            class="text-sm"
          >
            {{ connectionTestResult.message }}
          </span>
        </div>

        <!-- Table Selection -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">
            选择表 <span class="text-red-500">*</span>
          </label>
          <div v-if="!hasTestedConnection" class="text-sm text-slate-500 py-2">
            请先测试连接以获取可用表
          </div>
          <div v-else class="space-y-2">
            <!-- Multi-select checkboxes -->
            <div class="max-h-48 overflow-y-auto border border-slate-300 rounded-lg p-2 space-y-1">
              <label
                v-for="table in availableTables"
                :key="table"
                class="flex items-center space-x-2 px-2 py-1 hover:bg-slate-50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  :value="table"
                  v-model="form.tables"
                  :disabled="form.tables.length >= 20 && !form.tables.includes(table)"
                  class="h-4 w-4 text-purple-600 focus:ring-purple-500 rounded"
                />
                <span class="text-sm text-slate-700">{{ table }}</span>
              </label>
            </div>
            <div class="flex items-center justify-between">
              <p class="text-xs text-slate-500">已选择: {{ form.tables.length }} / 20 个表</p>
              <button
                v-if="form.tables.length > 0"
                type="button"
                @click="form.tables = []"
                class="text-xs text-red-500 hover:text-red-700"
              >
                清空选择
              </button>
            </div>
            <p v-if="form.tables.length >= 20" class="text-xs text-orange-600">
              已达到最大表数量限制
            </p>
          </div>
        </div>

        <!-- Category Selection -->
        <div class="border-t border-slate-200 pt-4">
          <h3 class="text-sm font-semibold text-slate-900 mb-3">共享设置</h3>

          <!-- Category -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-slate-700 mb-2">知识库分类</label>
            <div class="flex gap-3">
              <label
                :class="[
                  'flex items-center px-4 py-2 border rounded-lg cursor-pointer transition-colors',
                  form.category === 'personal'
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'border-slate-200 hover:bg-slate-50',
                ]"
              >
                <input
                  v-model="form.category"
                  type="radio"
                  value="personal"
                  class="sr-only"
                />
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                个人知识库
              </label>
              <label
                :class="[
                  'flex items-center px-4 py-2 border rounded-lg cursor-pointer transition-colors',
                  form.category === 'team'
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'border-slate-200 hover:bg-slate-50',
                ]"
              >
                <input
                  v-model="form.category"
                  type="radio"
                  value="team"
                  class="sr-only"
                />
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                团队知识库
              </label>
            </div>
          </div>

          <!-- Team Sharing (only show when team category) -->
          <div v-if="form.category === 'team'" class="space-y-3">
            <!-- Team Search -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">选择团队</label>
              <input
                v-model="teamSearch"
                type="text"
                placeholder="搜索团队..."
                class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <!-- Team List -->
            <div class="max-h-40 overflow-y-auto border border-slate-200 rounded-lg">
              <label
                v-for="team in filteredTeams"
                :key="team.id"
                class="flex items-center justify-between p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer"
              >
                <div class="flex items-center">
                  <input
                    :checked="isTeamSelected(team.id)"
                    @change="toggleTeam(team.id)"
                    type="checkbox"
                    class="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span class="ml-3 text-sm text-slate-700">{{ team.name }}</span>
                </div>
                <!-- Permission selector for selected teams -->
                <select
                  v-if="isTeamSelected(team.id)"
                  :value="getTeamPermission(team.id)"
                  @change="setTeamPermission(team.id, $event)"
                  class="ml-3 text-xs border border-slate-200 rounded px-2 py-1"
                >
                  <option value="read">只读</option>
                  <option value="write">可编辑</option>
                </select>
              </label>
              <p v-if="filteredTeams.length === 0" class="text-sm text-slate-500 text-center py-4">
                未找到匹配的团队
              </p>
            </div>

            <p v-if="selectedTeams.size === 0" class="text-xs text-slate-500">
              至少需要选择一个团队
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex space-x-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            :disabled="!isFormValid"
            class="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            导入
          </button>
        </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useKnowledgeBaseStore } from '@/stores/knowledgeBase'
import type { DatabaseImportForm, DatabaseConnectionTest, TeamSharingPermission, KnowledgeBaseCategory } from '@/types/knowledge-base'

interface Emits {
  (e: 'close'): void
  (e: 'submit', form: DatabaseImportForm): void
}

const emit = defineEmits<Emits>()
const knowledgeBaseStore = useKnowledgeBaseStore()

const form = ref<DatabaseImportForm>({
  name: '',
  description: '',
  dbType: 'mysql',
  host: '',
  port: 3306,
  username: '',
  password: '',
  database: '',
  tables: [],
  category: 'personal' as KnowledgeBaseCategory,
})

const teamSearch = ref('')
const selectedTeams = ref<Map<string, TeamSharingPermission>>(new Map())

// Mock teams data (same as in EditKnowledgeBaseDialog)
const mockTeams = [
  { id: 'team-dev', name: '开发团队' },
  { id: 'team-product', name: '产品团队' },
  { id: 'team-design', name: '设计团队' },
  { id: 'team-marketing', name: '市场团队' },
  { id: 'team-sales', name: '销售团队' },
]

// Filtered teams based on search
const filteredTeams = computed(() => {
  if (!teamSearch.value) return mockTeams
  const search = teamSearch.value.toLowerCase()
  return mockTeams.filter(team => team.name.toLowerCase().includes(search))
})

const isTesting = ref(false)
const hasTestedConnection = ref(false)
const connectionTestResult = ref<DatabaseConnectionTest | null>(null)
const availableTables = ref<string[]>([])

// Update default port when database type changes
const updateDefaultPort = () => {
  if (form.value.dbType === 'mysql') {
    form.value.port = 3306
  } else if (form.value.dbType === 'postgresql') {
    form.value.port = 5432
  }
  hasTestedConnection.value = false
  connectionTestResult.value = null
  availableTables.value = []
  form.value.tables = []
}

const canTestConnection = computed(() => {
  return (
    form.value.host &&
    form.value.port &&
    form.value.username &&
    form.value.password &&
    form.value.database
  )
})

const isFormValid = computed(() => {
  const hasValidName = form.value.name.trim() !== ''
  const hasValidConnection = form.value.host && form.value.port && form.value.username && form.value.password && form.value.database
  const hasValidTables = form.value.tables.length > 0
  const hasValidTeams = form.value.category === 'personal' || selectedTeams.value.size > 0
  return hasValidName && hasValidConnection && hasValidTables && hasValidTeams
})

const isTeamSelected = (teamId: string) => {
  return selectedTeams.value.has(teamId)
}

const toggleTeam = (teamId: string) => {
  if (selectedTeams.value.has(teamId)) {
    selectedTeams.value.delete(teamId)
  } else {
    selectedTeams.value.set(teamId, 'read')
  }
}

const getTeamPermission = (teamId: string): TeamSharingPermission => {
  return selectedTeams.value.get(teamId) || 'read'
}

const setTeamPermission = (teamId: string, event: Event) => {
  const select = event.target as HTMLSelectElement
  selectedTeams.value.set(teamId, select.value as TeamSharingPermission)
}

const testConnection = async () => {
  if (!canTestConnection.value) return

  isTesting.value = true
  connectionTestResult.value = null

  try {
    const result = await knowledgeBaseStore.testDatabaseConnection({
      dbType: form.value.dbType,
      host: form.value.host,
      port: form.value.port,
      username: form.value.username,
      password: form.value.password,
      database: form.value.database,
    })

    connectionTestResult.value = result

    if (result.success && result.tables && result.tables.length > 0) {
      availableTables.value = result.tables
      hasTestedConnection.value = true
      // Auto-select first table
      if (result.tables[0]) {
        form.value.tables = [result.tables[0]]
      }
    }
  } catch (error) {
    connectionTestResult.value = {
      success: false,
      message: '连接测试失败',
    }
  } finally {
    isTesting.value = false
  }
}

const handleSubmit = () => {
  if (!isFormValid.value) return

  const submitForm: DatabaseImportForm = { ...form.value }

  // Add sharing settings if team category
  if (form.value.category === 'team' && selectedTeams.value.size > 0) {
    submitForm.permission = 'team'
    submitForm.sharedTeams = Array.from(selectedTeams.value.entries()).map(([teamId, permission]) => {
      const team = mockTeams.find(t => t.id === teamId)!
      return {
        teamId,
        teamName: team.name,
        permission,
        addedAt: new Date(),
        addedBy: knowledgeBaseStore.CURRENT_USER_ID,
      }
    })
  } else {
    submitForm.permission = 'owner'
    submitForm.sharedTeams = []
  }

  emit('submit', submitForm)
}

// Watch for database type change to update port
watch(
  () => form.value.dbType,
  () => {
    updateDefaultPort()
  },
)
</script>
