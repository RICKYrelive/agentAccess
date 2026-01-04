<template>
  <div class="h-full bg-slate-50 overflow-y-auto">
    <div class="max-w-7xl mx-auto px-6 py-8">
      <!-- Enhanced Header Section -->
      <div class="mb-8">
        <div class="relative">
          <!-- Decorative gradient background -->
          <div class="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl -z-10" />
          <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-100/50 to-transparent rounded-full blur-3xl -z-10" />

          <div class="relative px-8 py-10 text-left">
            <!-- Title -->
            <h1 class="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent mb-3">
              知识库管理
            </h1>
            <p class="text-slate-600 text-lg">
              高效管理、同步和组织数据源
            </p>
          </div>
        </div>
      </div>

      <!-- Statistics Bar -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <!-- Total Documents -->
        <StatisticsCard
          icon="description"
          label="总文档数"
          :value="totalDocumentCount"
          unit="个"
        />

        <!-- Storage Used -->
        <StatisticsCard
          icon="storage"
          label="存储空间"
          :value="totalStorageFormatted"
        />

        <!-- Sync Status -->
        <StatisticsCard
          icon="sync_alt"
          label="同步状态"
          :value="syncStatusText"
          :badge="syncBadge"
        />
      </div>

      <!-- Category Tabs -->
      <div class="mb-6 bg-white rounded-xl border border-slate-200 p-1.5 inline-flex">
        <button
          @click="activeCategory = 'personal'"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-lg transition-all',
            activeCategory === 'personal'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50',
          ]"
        >
          我创建的 ({{ personalKnowledgeBases.length }})
        </button>
        <button
          @click="activeCategory = 'team'"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-lg transition-all',
            activeCategory === 'team'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50',
          ]"
        >
          团队知识库 ({{ teamKnowledgeBases.length }})
        </button>
      </div>

      <!-- Team Filter (only show when team category is selected) -->
      <div v-if="activeCategory === 'team'" class="mb-6">
        <div class="flex items-center gap-3">
          <span class="text-sm font-medium text-slate-700">选择团队:</span>
          <select
            v-model="selectedTeamId"
            class="pl-3 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white appearance-none bg-[url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%2394a3b8%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e')] bg-[length:1.25em_1.25em] bg-[right_0.75rem_center] bg-no-repeat"
          >
            <option
              v-for="team in availableTeams"
              :key="team.id"
              :value="team.id"
            >
              {{ team.name }}
            </option>
          </select>
          <span class="text-sm text-slate-500">
            显示 {{ filteredTeamKBsCount }} 个知识库
          </span>
        </div>
      </div>

      <!-- Creation Actions Section -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <!-- Upload Files Button -->
        <button
          @click="openImportDialog('text')"
          class="group bg-white hover:bg-green-50 border border-slate-200 hover:border-green-300 px-6 py-5 rounded-xl flex items-center gap-4 transition-all duration-200 text-left"
        >
          <div class="flex-shrink-0 w-12 h-12 bg-green-100 group-hover:bg-green-200 rounded-xl flex items-center justify-center transition-colors">
            <span class="material-symbols-rounded text-green-600 text-2xl">upload_file</span>
          </div>
          <div>
            <div class="font-semibold text-slate-900">上传文件</div>
            <div class="text-xs text-slate-500 mt-0.5">PDF, DOCX, TXT (最大50MB)</div>
          </div>
        </button>

        <!-- Connect Database Button -->
        <button
          @click="openImportDialog('database')"
          class="group bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 px-6 py-5 rounded-xl flex items-center gap-4 transition-all duration-200 text-left"
        >
          <div class="flex-shrink-0 w-12 h-12 bg-purple-100 group-hover:bg-purple-200 rounded-xl flex items-center justify-center transition-colors">
            <span class="material-symbols-rounded text-purple-600 text-2xl">dns</span>
          </div>
          <div>
            <div class="font-semibold text-slate-900">连接数据库</div>
            <div class="text-xs text-slate-500 mt-0.5">MySQL, PostgreSQL</div>
          </div>
        </button>

        <!-- Paste Text Button -->
        <button
          @click="openImportDialog('spreadsheet')"
          class="group bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 px-6 py-5 rounded-xl flex items-center gap-4 transition-all duration-200 text-left"
        >
          <div class="flex-shrink-0 w-12 h-12 bg-blue-100 group-hover:bg-blue-200 rounded-xl flex items-center justify-center transition-colors">
            <span class="material-symbols-rounded text-blue-600 text-2xl">table_view</span>
          </div>
          <div>
            <div class="font-semibold text-slate-900">表格导入</div>
            <div class="text-xs text-slate-500 mt-0.5">Excel, CSV 文件</div>
          </div>
        </button>
      </div>

      <!-- Table Section -->
      <div class="bg-white rounded-xl border border-slate-200 p-6">
        <!-- Filter Toolbar -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div class="flex items-center gap-2">
            <h2 class="text-lg font-semibold text-slate-900">
              知识库 {{ filteredKnowledgeBases.length }}
            </h2>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <!-- Type Filter -->
            <select
              v-model="filters.type"
              class="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
            >
              <option value="all">全部类型</option>
              <option value="text">文本</option>
              <option value="spreadsheet">表格</option>
              <option value="database">数据库</option>
            </select>

            <!-- Status Filter -->
            <select
              v-model="filters.status"
              class="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
            >
              <option value="all">全部状态</option>
              <option value="ready">已就绪</option>
              <option value="processing">处理中</option>
              <option value="syncing">同步中</option>
              <option value="error">错误</option>
            </select>

            <!-- Search -->
            <div class="relative">
              <span class="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索知识库..."
                class="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-64"
              />
            </div>
          </div>
        </div>

        <!-- Knowledge Base Table -->
        <KnowledgeBaseTable
          :knowledge-bases="filteredKnowledgeBases"
          :filters="filters"
          :search-query="searchQuery"
          @edit="handleEdit"
          @delete="handleDelete"
          @sync="handleSync"
          @view="handleView"
        />
      </div>

      <!-- Import Dialogs -->
      <TextImportDialog
        v-if="importDialogType === 'text'"
        @submit="handleImportSubmit"
        @close="closeImportDialog"
      />
      <SpreadsheetImportDialog
        v-if="importDialogType === 'spreadsheet'"
        @submit="handleImportSubmit"
        @close="closeImportDialog"
      />
      <DatabaseImportDialog
        v-if="importDialogType === 'database'"
        @submit="handleImportSubmit"
        @close="closeImportDialog"
      />

      <!-- Edit Dialog -->
      <EditKnowledgeBaseDialog
        v-if="editingKnowledgeBase"
        :knowledge-base="editingKnowledgeBase"
        @submit="handleEditSubmit"
        @close="closeEditDialog"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useKnowledgeBaseStore } from '@/stores/knowledgeBase'
import StatisticsCard from './StatisticsCard.vue'
import KnowledgeBaseTable from './KnowledgeBaseTable.vue'
import TextImportDialog from './import-dialogs/TextImportDialog.vue'
import SpreadsheetImportDialog from './import-dialogs/SpreadsheetImportDialog.vue'
import DatabaseImportDialog from './import-dialogs/DatabaseImportDialog.vue'
import EditKnowledgeBaseDialog from './EditKnowledgeBaseDialog.vue'
import type {
  KnowledgeBase,
  KnowledgeBaseType,
  KnowledgeBaseStatus,
  TextImportForm,
  SpreadsheetImportForm,
  DatabaseImportForm,
} from '@/types/knowledge-base'

interface Emits {
  (e: 'view-knowledge-base', id: string): void
}

const emit = defineEmits<Emits>()
const knowledgeBaseStore = useKnowledgeBaseStore()
const {
  textKnowledgeBases,
  spreadsheetKnowledgeBases,
  databaseKnowledgeBases,
  personalKnowledgeBases,
  teamKnowledgeBases,
  totalDocumentCount,
  totalStorageFormatted,
  overallSyncStatus,
  lastSyncTime,
} = storeToRefs(knowledgeBaseStore)
const { canEditKnowledgeBase, CURRENT_USER_TEAMS } = knowledgeBaseStore

// Category tab state
const activeCategory = ref<'personal' | 'team'>('personal')

// Mock teams data
const mockTeams = [
  { id: 'team-dev', name: '开发团队' },
  { id: 'team-product', name: '产品团队' },
  { id: 'team-design', name: '设计团队' },
  { id: 'team-marketing', name: '市场团队' },
  { id: 'team-sales', name: '销售团队' },
]

// Available teams for the current user
const availableTeams = computed(() => {
  return mockTeams.filter(team => CURRENT_USER_TEAMS.includes(team.id))
})

// Team selection state - default to first available team
const selectedTeamId = ref<string>(availableTeams.value[0]?.id || '')

// Update selected team when available teams change
watch(availableTeams, (newTeams) => {
  if (newTeams.length > 0 && !selectedTeamId.value) {
    const firstTeam = newTeams[0]
    if (firstTeam) {
      selectedTeamId.value = firstTeam.id
    }
  }
}, { immediate: true })

// Filtered team KBs based on selected team
const filteredTeamKBs = computed(() => {
  return teamKnowledgeBases.value.filter(kb =>
    kb.sharedTeams?.some(st => st.teamId === selectedTeamId.value)
  )
})

// Count for display
const filteredTeamKBsCount = computed(() => {
  return filteredTeamKBs.value.length
})

// Filtered knowledge bases based on category
const filteredKnowledgeBases = computed(() => {
  return activeCategory.value === 'personal'
    ? personalKnowledgeBases.value
    : filteredTeamKBs.value
})

// Table filters and search
const filters = ref<{
  type: 'all' | KnowledgeBaseType
  status: 'all' | KnowledgeBaseStatus
}>({
  type: 'all',
  status: 'all',
})

const searchQuery = ref('')

// Sync status display
const syncStatusText = computed(() => {
  switch (overallSyncStatus.value) {
    case 'synced':
      return '已同步'
    case 'syncing':
      return '同步中'
    case 'error':
      return '同步失败'
    default:
      return '已同步'
  }
})

const syncBadge = computed(() => {
  switch (overallSyncStatus.value) {
    case 'synced':
      return { text: '正常', type: 'success' as const }
    case 'syncing':
      return { text: '同步中', type: 'processing' as const }
    case 'error':
      return { text: '失败', type: 'error' as const }
    default:
      return { text: '正常', type: 'success' as const }
  }
})

// Dialog state
const importDialogType = ref<'text' | 'spreadsheet' | 'database' | null>(null)
const editingKnowledgeBase = ref<KnowledgeBase | null>(null)

const openImportDialog = (type: 'text' | 'spreadsheet' | 'database') => {
  importDialogType.value = type
}

const closeImportDialog = () => {
  importDialogType.value = null
}

const handleImportSubmit = (form: TextImportForm | SpreadsheetImportForm | DatabaseImportForm) => {
  if (importDialogType.value === 'text') {
    knowledgeBaseStore.createFromTextImport(form as TextImportForm)
  } else if (importDialogType.value === 'spreadsheet') {
    knowledgeBaseStore.createFromSpreadsheetImport(form as SpreadsheetImportForm)
  } else if (importDialogType.value === 'database') {
    knowledgeBaseStore.createFromDatabaseImport(form as DatabaseImportForm)
  }
  closeImportDialog()
}

const handleEdit = (kb: KnowledgeBase) => {
  editingKnowledgeBase.value = kb
}

const handleView = (kb: KnowledgeBase) => {
  emit('view-knowledge-base', kb.id)
}

const handleSync = (kb: KnowledgeBase) => {
  // For demo, just show an alert
  alert(`正在同步知识库 "${kb.name}"...`)
  // In production, this would trigger a sync operation
}

const closeEditDialog = () => {
  editingKnowledgeBase.value = null
}

const handleEditSubmit = (updates: {
  name: string
  description: string
  category?: string
  permission?: string
  sharedTeams?: any[]
}) => {
  if (editingKnowledgeBase.value) {
    if (updates.category && updates.permission && updates.sharedTeams !== undefined) {
      knowledgeBaseStore.updateKnowledgeBaseSharing(
        editingKnowledgeBase.value.id,
        updates.category as any,
        updates.permission as any,
        updates.sharedTeams,
      )
    }
    knowledgeBaseStore.updateKnowledgeBase(editingKnowledgeBase.value.id, {
      name: updates.name,
      description: updates.description,
    })
    closeEditDialog()
  }
}

const handleDelete = (kb: KnowledgeBase) => {
  if (confirm(`确定要删除知识库 "${kb.name}" 吗？`)) {
    knowledgeBaseStore.deleteKnowledgeBase(kb.id)
  }
}
</script>
