<script setup lang="ts">
import { ref, computed } from 'vue'
import type { KnowledgeBase, KnowledgeBaseType, KnowledgeBaseStatus } from '@/types/knowledge-base'

interface Filters {
  type: 'all' | KnowledgeBaseType
  status: 'all' | KnowledgeBaseStatus
}

interface Props {
  knowledgeBases: KnowledgeBase[]
  filters: Filters
  searchQuery: string
}

interface Emits {
  (e: 'edit', kb: KnowledgeBase): void
  (e: 'delete', kb: KnowledgeBase): void
  (e: 'sync', kb: KnowledgeBase): void
  (e: 'view', kb: KnowledgeBase): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Type badge configuration
const typeBadgeConfig = {
  text: {
    label: '文本',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
    icon: 'picture_as_pdf'
  },
  spreadsheet: {
    label: '表格',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    icon: 'table_view'
  },
  database: {
    label: '数据库',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    icon: 'dns'
  }
}

// Status badge configuration
const statusBadgeConfig = {
  ready: {
    label: '已就绪',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-700',
    dotColor: 'bg-emerald-500',
    icon: 'check_circle'
  },
  processing: {
    label: '处理中',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    icon: 'sync'
  },
  syncing: {
    label: '同步中',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-700',
    icon: 'sync'
  },
  error: {
    label: '错误',
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    dotColor: 'bg-red-500',
    icon: 'error'
  }
}

// Action menu state
const activeMenuId = ref<string | null>(null)

const toggleMenu = (kbId: string, event: Event) => {
  event.stopPropagation()
  activeMenuId.value = activeMenuId.value === kbId ? null : kbId
}

const closeMenu = () => {
  activeMenuId.value = null
}

// Filter and search logic
const filteredKnowledgeBases = computed(() => {
  return props.knowledgeBases.filter((kb) => {
    // Type filter
    if (props.filters.type !== 'all' && kb.type !== props.filters.type) {
      return false
    }

    // Status filter
    if (props.filters.status !== 'all' && kb.status !== props.filters.status) {
      return false
    }

    // Search query
    if (props.searchQuery) {
      const query = props.searchQuery.toLowerCase()
      return (
        kb.name.toLowerCase().includes(query) ||
        kb.description.toLowerCase().includes(query)
      )
    }

    return true
  })
})

// Get type badge config
const getTypeBadge = (type: KnowledgeBaseType) => {
  return typeBadgeConfig[type]
}

// Get status badge config
const getStatusBadge = (status?: KnowledgeBaseStatus) => {
  return statusBadgeConfig[status || 'ready']
}

// Format size info
const formatSizeInfo = (kb: KnowledgeBase): string => {
  if (kb.type === 'database') {
    const tableCount = kb.sourceInfo.tables?.length || 0
    return `${tableCount} ${tableCount === 1 ? '个表' : '个表'}`
  }

  // For text and spreadsheet, calculate total file size
  const totalBytes =
    kb.sourceInfo.files?.reduce((sum, file) => sum + (file.fileSize || 0), 0) || 0
  if (totalBytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(totalBytes) / Math.log(k))
  return parseFloat((totalBytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// Format date
const formatDate = (date: Date): string => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return '刚刚'
  if (diffMins < 60) return `${diffMins}分钟前`
  if (diffHours < 24) return `${diffHours}小时前`
  if (diffDays < 7) return `${diffDays}天前`

  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

// Check if KB can be synced (only database types)
const canSync = (kb: KnowledgeBase): boolean => {
  return kb.type === 'database'
}

// Handle action clicks
const handleEdit = (kb: KnowledgeBase) => {
  emit('edit', kb)
  closeMenu()
}

const handleDelete = (kb: KnowledgeBase) => {
  emit('delete', kb)
  closeMenu()
}

const handleSync = (kb: KnowledgeBase) => {
  emit('sync', kb)
  closeMenu()
}

const handleView = (kb: KnowledgeBase) => {
  emit('view', kb)
  closeMenu()
}
</script>

<template>
  <div class="bg-white rounded-xl border border-slate-200 overflow-hidden" @click="closeMenu">
    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-slate-50 border-b border-slate-200">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
              名称
            </th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
              类型
            </th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
              状态
            </th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
              大小/表数
            </th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
              创建时间
            </th>
            <th class="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="kb in filteredKnowledgeBases"
            :key="kb.id"
            class="hover:bg-slate-50 transition-colors duration-150"
          >
            <!-- Name -->
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <span class="material-symbols-rounded text-slate-400">
                  {{ getTypeBadge(kb.type).icon }}
                </span>
                <div>
                  <div class="text-sm font-medium text-slate-900">{{ kb.name }}</div>
                  <div class="text-xs text-slate-500 truncate max-w-xs">{{ kb.description }}</div>
                </div>
              </div>
            </td>

            <!-- Type Badge -->
            <td class="px-6 py-4">
              <span
                :class="[
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border',
                  getTypeBadge(kb.type).bgColor,
                  getTypeBadge(kb.type).textColor,
                  getTypeBadge(kb.type).borderColor
                ]"
              >
                <span class="material-symbols-rounded text-sm">
                  {{ getTypeBadge(kb.type).icon }}
                </span>
                {{ getTypeBadge(kb.type).label }}
              </span>
            </td>

            <!-- Status Badge -->
            <td class="px-6 py-4">
              <span
                :class="[
                  'inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-medium',
                  getStatusBadge(kb.status).bgColor,
                  getStatusBadge(kb.status).textColor
                ]"
              >
                <span
                  v-if="getStatusBadge(kb.status).dotColor"
                  class="h-1.5 w-1.5 rounded-full"
                  :class="getStatusBadge(kb.status).dotColor"
                />
                <span
                  v-else
                  class="material-symbols-rounded text-sm animate-spin"
                >
                  sync
                </span>
                {{ getStatusBadge(kb.status).label }}
              </span>
            </td>

            <!-- Size/Tables -->
            <td class="px-6 py-4">
              <span class="text-sm text-slate-700">{{ formatSizeInfo(kb) }}</span>
            </td>

            <!-- Date -->
            <td class="px-6 py-4">
              <span class="text-sm text-slate-600">{{ formatDate(kb.createdAt) }}</span>
            </td>

            <!-- Actions -->
            <td class="px-6 py-4 text-right">
              <div class="relative inline-block">
                <button
                  class="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                  @click="(e) => toggleMenu(kb.id, e)"
                >
                  <span class="material-symbols-rounded text-slate-400">more_horiz</span>
                </button>

                <!-- Dropdown Menu -->
                <div
                  v-if="activeMenuId === kb.id"
                  class="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg border border-slate-200 shadow-lg z-10 py-1"
                  @click.stop
                >
                  <button
                    class="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    @click="handleView(kb)"
                  >
                    <span class="material-symbols-rounded text-lg text-slate-400">visibility</span>
                    查看详情
                  </button>
                  <button
                    class="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    @click="handleEdit(kb)"
                  >
                    <span class="material-symbols-rounded text-lg text-slate-400">edit</span>
                    编辑
                  </button>
                  <button
                    v-if="canSync(kb)"
                    class="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    @click="handleSync(kb)"
                  >
                    <span class="material-symbols-rounded text-lg text-slate-400">sync</span>
                    同步
                  </button>
                  <hr class="my-1 border-slate-100">
                  <button
                    class="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    @click="handleDelete(kb)"
                  >
                    <span class="material-symbols-rounded text-lg text-red-400">delete</span>
                    删除
                  </button>
                </div>
              </div>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-if="filteredKnowledgeBases.length === 0">
            <td colspan="6" class="px-6 py-12 text-center">
              <div class="flex flex-col items-center gap-3">
                <span class="material-symbols-rounded text-slate-300 text-5xl">folder_open</span>
                <p class="text-slate-500 text-sm">暂无知识库</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* Animate spinner for processing status */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
