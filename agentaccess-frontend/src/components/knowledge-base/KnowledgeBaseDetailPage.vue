<template>
  <div class="h-full flex flex-col bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center space-x-4">
        <button
          @click="$emit('back')"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="返回"
        >
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div class="flex-1">
          <h1 class="text-xl font-semibold text-gray-900">知识库详情</h1>
        </div>
        <button
          @click="showEditDialog = true"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          编辑信息
        </button>
        <button
          @click="confirmDelete"
          class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
        >
          删除知识库
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto p-6">
      <div v-if="knowledgeBase" class="max-w-4xl mx-auto">
        <!-- Basic Info Card -->
        <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div class="flex items-start justify-between mb-4">
            <div>
              <div class="flex items-center space-x-3 mb-2">
                <h2 class="text-2xl font-semibold text-gray-900">{{ knowledgeBase.name }}</h2>
                <span
                  :class="[
                    'px-2.5 py-0.5 text-sm font-medium rounded-full',
                    typeBadgeClass
                  ]"
                >
                  {{ typeLabel }}
                </span>
                <span
                  v-if="!knowledgeBase.config.settings.isEnabled"
                  class="px-2.5 py-0.5 text-sm font-medium rounded-full bg-gray-100 text-gray-600"
                >
                  已禁用
                </span>
                <span
                  v-if="knowledgeBase.config.settings.isPublic"
                  class="px-2.5 py-0.5 text-sm font-medium rounded-full bg-blue-100 text-blue-700"
                >
                  公开
                </span>
              </div>
              <p v-if="knowledgeBase.description" class="text-gray-600">{{ knowledgeBase.description }}</p>
              <p v-else class="text-gray-400 italic">暂无描述</p>
            </div>
          </div>
          <div class="flex items-center space-x-6 text-sm text-gray-500">
            <div class="flex items-center space-x-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>创建于 {{ formatDate(knowledgeBase.createdAt) }}</span>
            </div>
            <div class="flex items-center space-x-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>更新于 {{ formatDate(knowledgeBase.updatedAt) }}</span>
            </div>
          </div>
          <!-- Tags -->
          <div v-if="knowledgeBase.config.settings.tags.length > 0" class="flex items-center space-x-2 mt-3">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="(tag, index) in knowledgeBase.config.settings.tags"
                :key="index"
                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="bg-white rounded-lg border border-gray-200">
          <!-- Tab Headers -->
          <div class="border-b border-gray-200">
            <nav class="flex -mb-px">
              <button
                @click="activeTab = 'sources'"
                :class="[
                  'px-6 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeTab === 'sources'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                数据源
              </button>
              <button
                @click="activeTab = 'settings'"
                :class="[
                  'px-6 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeTab === 'settings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                配置
              </button>
            </nav>
          </div>

          <!-- Tab Content -->
          <div class="p-6">
            <!-- Data Sources Tab -->
            <div v-if="activeTab === 'sources'">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">数据源</h3>
                <button
                  @click="showAddSourceDialog = true"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>添加数据源</span>
                </button>
              </div>

              <!-- Text/Spreadsheet Files -->
              <div v-if="knowledgeBase.sourceInfo.files && knowledgeBase.sourceInfo.files.length > 0">
                <p class="text-sm text-gray-500 mb-3">
                  共 {{ knowledgeBase.sourceInfo.files.length }} 个文件
                </p>
                <div class="space-y-2">
                  <div
                    v-for="file in knowledgeBase.sourceInfo.files"
                    :key="file.id"
                    class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div class="flex items-center space-x-3 flex-1 min-w-0">
                      <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">{{ file.fileName }}</p>
                        <p class="text-xs text-gray-500">
                          {{ formatSize(file.fileSize) }} · 添加于 {{ formatDate(file.addedAt) }}
                        </p>
                      </div>
                    </div>
                    <button
                      @click="confirmRemoveFile(file)"
                      class="ml-3 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="删除文件"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Database Tables -->
              <div v-else-if="knowledgeBase.sourceInfo.tables && knowledgeBase.sourceInfo.tables.length > 0">
                <div class="space-y-4">
                  <!-- Connection Info -->
                  <div v-if="knowledgeBase.sourceInfo.connection" class="p-4 bg-purple-50 rounded-lg">
                    <h4 class="text-sm font-medium text-purple-900 mb-2">数据库连接信息</h4>
                    <div class="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span class="text-purple-700">类型:</span>
                        <span class="text-purple-900 ml-1">{{ knowledgeBase.sourceInfo.connection.dbType }}</span>
                      </div>
                      <div>
                        <span class="text-purple-700">主机:</span>
                        <span class="text-purple-900 ml-1">{{ knowledgeBase.sourceInfo.connection.host }}</span>
                      </div>
                      <div>
                        <span class="text-purple-700">端口:</span>
                        <span class="text-purple-900 ml-1">{{ knowledgeBase.sourceInfo.connection.port }}</span>
                      </div>
                      <div>
                        <span class="text-purple-700">数据库:</span>
                        <span class="text-purple-900 ml-1">{{ knowledgeBase.sourceInfo.connection.database }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Tables List -->
                  <div>
                    <p class="text-sm text-gray-500 mb-3">
                      共 {{ knowledgeBase.sourceInfo.tables.length }} 个表
                    </p>
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="table in knowledgeBase.sourceInfo.tables"
                        :key="table"
                        class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-purple-50 text-purple-700 group"
                      >
                        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                        </svg>
                        {{ table }}
                        <button
                          @click="confirmRemoveTable(table)"
                          class="ml-2 opacity-0 group-hover:opacity-100 text-purple-500 hover:text-red-600 transition-opacity"
                          title="删除表"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-else class="text-center py-8 text-gray-500">
                <svg class="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p>暂无数据源</p>
                <button
                  @click="showAddSourceDialog = true"
                  class="mt-3 text-blue-600 hover:text-blue-700 font-medium"
                >
                  添加数据源
                </button>
              </div>
            </div>

            <!-- Settings Tab -->
            <div v-else-if="activeTab === 'settings' && knowledgeBase">
              <KnowledgeBaseSettings
                :knowledge-base="knowledgeBase"
                @close="handleSettingsSaved"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else class="flex items-center justify-center h-full">
        <div class="text-gray-500">加载中...</div>
      </div>
    </div>

    <!-- Edit Info Dialog -->
    <EditKnowledgeBaseDialog
      v-if="showEditDialog && knowledgeBase"
      :knowledge-base="knowledgeBase"
      @close="showEditDialog = false"
      @submit="handleSaveInfo"
    />

    <!-- Add Source Dialog -->
    <AddSourceDialog
      v-if="showAddSourceDialog && knowledgeBase"
      :knowledge-base="knowledgeBase"
      @close="showAddSourceDialog = false"
      @add="handleAddSource"
    />

    <!-- Confirm Delete Dialog -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">确认删除</h3>
        <p class="text-gray-600 mb-6">确定要删除知识库"{{ knowledgeBase?.name }}"吗？此操作不可恢复。</p>
        <div class="flex space-x-3">
          <button
            @click="showDeleteConfirm = false"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            @click="handleDelete"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            删除
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm Remove File Dialog -->
    <div
      v-if="showRemoveFileConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">确认删除文件</h3>
        <p class="text-gray-600 mb-6">确定要删除文件"{{ fileToRemove?.fileName }}"吗？</p>
        <div class="flex space-x-3">
          <button
            @click="showRemoveFileConfirm = false"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            @click="handleRemoveFile"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            删除
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm Remove Table Dialog -->
    <div
      v-if="showRemoveTableConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">确认删除表</h3>
        <p class="text-gray-600 mb-6">确定要删除表"{{ tableToRemove }}"吗？</p>
        <div class="flex space-x-3">
          <button
            @click="showRemoveTableConfirm = false"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            @click="handleRemoveTable"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useKnowledgeBaseStore } from '@/stores/knowledgeBase'
import type { KnowledgeBase, FileInfo } from '@/types/knowledge-base'
import EditKnowledgeBaseDialog from './EditKnowledgeBaseDialog.vue'
import AddSourceDialog from './AddSourceDialog.vue'
import KnowledgeBaseSettings from './KnowledgeBaseSettings.vue'

interface Props {
  knowledgeBaseId: string
}

interface Emits {
  (e: 'back'): void
  (e: 'edit-knowledge-base', id: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const knowledgeBaseStore = useKnowledgeBaseStore()
const knowledgeBase = ref<KnowledgeBase | null>(null)
const activeTab = ref<'sources' | 'settings'>('sources')

const showEditDialog = ref(false)
const showAddSourceDialog = ref(false)
const showDeleteConfirm = ref(false)
const showRemoveFileConfirm = ref(false)
const showRemoveTableConfirm = ref(false)
const fileToRemove = ref<FileInfo | null>(null)
const tableToRemove = ref<string | null>(null)

const typeLabel = computed(() => {
  if (!knowledgeBase.value) return ''
  const typeMap: Record<string, string> = {
    text: '文本',
    spreadsheet: '表格',
    database: '数据库'
  }
  return typeMap[knowledgeBase.value.type] || knowledgeBase.value.type
})

const typeBadgeClass = computed(() => {
  if (!knowledgeBase.value) return ''
  const classMap: Record<string, string> = {
    text: 'bg-green-100 text-green-700',
    spreadsheet: 'bg-blue-100 text-blue-700',
    database: 'bg-purple-100 text-purple-700'
  }
  return classMap[knowledgeBase.value.type] || 'bg-gray-100 text-gray-700'
})

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const handleSaveInfo = (updates: { name?: string; description?: string }) => {
  if (knowledgeBase.value) {
    knowledgeBaseStore.updateKnowledgeBase(knowledgeBase.value.id, updates)
    // Reload the knowledge base data
    const updated = knowledgeBaseStore.knowledgeBases.find(kb => kb.id === knowledgeBase.value!.id)
    if (updated) {
      knowledgeBase.value = updated
    }
  }
  showEditDialog.value = false
}

const handleSettingsSaved = () => {
  // Reload the knowledge base data
  const updated = knowledgeBaseStore.knowledgeBases.find(kb => kb.id === knowledgeBase.value!.id)
  if (updated) {
    knowledgeBase.value = updated
  }
}

const handleAddSource = (source: { type: 'file' | 'table', data: any }) => {
  if (!knowledgeBase.value) return

  try {
    if (source.type === 'file') {
      knowledgeBaseStore.addFileToKnowledgeBase(knowledgeBase.value.id, source.data)
    } else if (source.type === 'table') {
      knowledgeBaseStore.addTableToKnowledgeBase(knowledgeBase.value.id, source.data)
    }
    // Reload the knowledge base data
    const updated = knowledgeBaseStore.knowledgeBases.find(kb => kb.id === knowledgeBase.value!.id)
    if (updated) {
      knowledgeBase.value = updated
    }
    showAddSourceDialog.value = false
  } catch (error) {
    alert(error instanceof Error ? error.message : '添加失败')
  }
}

const confirmDelete = () => {
  showDeleteConfirm.value = true
}

const handleDelete = () => {
  if (knowledgeBase.value) {
    knowledgeBaseStore.deleteKnowledgeBase(knowledgeBase.value.id)
    showDeleteConfirm.value = false
    emit('back')
  }
}

const confirmRemoveFile = (file: FileInfo) => {
  fileToRemove.value = file
  showRemoveFileConfirm.value = true
}

const handleRemoveFile = () => {
  if (knowledgeBase.value && fileToRemove.value) {
    try {
      knowledgeBaseStore.removeFileFromKnowledgeBase(knowledgeBase.value.id, fileToRemove.value.id)
      // Reload the knowledge base data
      const updated = knowledgeBaseStore.knowledgeBases.find(kb => kb.id === knowledgeBase.value!.id)
      if (updated) {
        knowledgeBase.value = updated
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : '删除失败')
    }
  }
  showRemoveFileConfirm.value = false
  fileToRemove.value = null
}

const confirmRemoveTable = (table: string) => {
  tableToRemove.value = table
  showRemoveTableConfirm.value = true
}

const handleRemoveTable = () => {
  if (knowledgeBase.value && tableToRemove.value) {
    try {
      knowledgeBaseStore.removeTableFromKnowledgeBase(knowledgeBase.value.id, tableToRemove.value)
      // Reload the knowledge base data
      const updated = knowledgeBaseStore.knowledgeBases.find(kb => kb.id === knowledgeBase.value!.id)
      if (updated) {
        knowledgeBase.value = updated
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : '删除失败')
    }
  }
  showRemoveTableConfirm.value = false
  tableToRemove.value = null
}

onMounted(() => {
  const kb = knowledgeBaseStore.knowledgeBases.find(kb => kb.id === props.knowledgeBaseId)
  if (kb) {
    knowledgeBase.value = kb
  }
})
</script>
