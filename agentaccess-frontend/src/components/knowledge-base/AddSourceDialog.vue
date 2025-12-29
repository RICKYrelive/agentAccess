<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
      @click.stop
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white"
      >
        <h2 class="text-xl font-semibold text-slate-900">添加数据源</h2>
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

      <!-- Content -->
      <div class="p-6">
        <!-- Text/Spreadsheet - File Upload -->
        <div v-if="knowledgeBase.type === 'text' || knowledgeBase.type === 'spreadsheet'">
          <div class="mb-4">
            <label class="block text-sm font-medium text-slate-700 mb-1"> 上传文件 </label>
            <div
              class="flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:border-blue-400 transition-colors"
            >
              <div class="space-y-1 text-center">
                <svg
                  class="mx-auto h-12 w-12 text-slate-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <div class="flex text-sm text-slate-600">
                  <label
                    for="file-upload"
                    class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                  >
                    <span>选择文件</span>
                    <input
                      id="file-upload"
                      ref="fileInput"
                      type="file"
                      :accept="acceptTypes"
                      multiple
                      @change="handleFileChange"
                      class="sr-only"
                    />
                  </label>
                  <p class="pl-1">或拖拽文件到此处</p>
                </div>
                <p class="text-xs text-slate-500">{{ acceptDescription }}</p>
              </div>
            </div>
            <p v-if="errors.file" class="mt-1 text-sm text-red-600">{{ errors.file }}</p>

            <!-- File List -->
            <div v-if="newFiles.length > 0" class="mt-3 space-y-2 max-h-40 overflow-y-auto">
              <div
                v-for="(file, index) in newFiles"
                :key="index"
                class="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg"
              >
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-slate-900 truncate">{{ file.name }}</p>
                  <p class="text-xs text-slate-500">{{ formatSize(file.size) }}</p>
                </div>
                <button
                  type="button"
                  @click="removeFile(index)"
                  class="ml-2 text-red-500 hover:text-red-700"
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
            </div>
          </div>
        </div>

        <!-- Database - Add Table -->
        <div v-else-if="knowledgeBase.type === 'database'">
          <div class="space-y-4">
            <!-- Show existing connection info -->
            <div v-if="knowledgeBase.sourceInfo.connection" class="p-4 bg-purple-50 rounded-lg">
              <h4 class="text-sm font-medium text-purple-900 mb-2">当前数据库连接</h4>
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span class="text-purple-700">类型:</span>
                  <span class="text-purple-900 ml-1">{{
                    knowledgeBase.sourceInfo.connection.dbType
                  }}</span>
                </div>
                <div>
                  <span class="text-purple-700">主机:</span>
                  <span class="text-purple-900 ml-1">{{
                    knowledgeBase.sourceInfo.connection.host
                  }}</span>
                </div>
                <div>
                  <span class="text-purple-700">端口:</span>
                  <span class="text-purple-900 ml-1">{{
                    knowledgeBase.sourceInfo.connection.port
                  }}</span>
                </div>
                <div>
                  <span class="text-purple-700">数据库:</span>
                  <span class="text-purple-900 ml-1">{{
                    knowledgeBase.sourceInfo.connection.database
                  }}</span>
                </div>
              </div>
            </div>

            <!-- Connection Test Button -->
            <div class="flex items-center space-x-2">
              <button
                type="button"
                @click="testConnection"
                :disabled="isTesting"
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
                <span>{{ isTesting ? '获取表中...' : '刷新可用表' }}</span>
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
              <label class="block text-sm font-medium text-slate-700 mb-1"> 选择表 </label>
              <div v-if="!hasTestedConnection" class="text-sm text-slate-500 py-2">
                点击"刷新可用表"获取可用表列表
              </div>
              <div v-else class="space-y-2">
                <div
                  class="max-h-48 overflow-y-auto border border-slate-300 rounded-lg p-2 space-y-1"
                >
                  <label
                    v-for="table in availableTables.filter((t) => !existingTables.includes(t))"
                    :key="table"
                    class="flex items-center space-x-2 px-2 py-1 hover:bg-slate-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      :value="table"
                      v-model="selectedTables"
                      :disabled="
                        selectedTables.length >= maxNewTables && !selectedTables.includes(table)
                      "
                      class="h-4 w-4 text-purple-600 focus:ring-purple-500 rounded"
                    />
                    <span class="text-sm text-slate-700">{{ table }}</span>
                  </label>
                  <p
                    v-if="availableTables.filter((t) => !existingTables.includes(t)).length === 0"
                    class="text-sm text-slate-500 py-2 text-center"
                  >
                    所有表已添加
                  </p>
                </div>
                <div class="flex items-center justify-between">
                  <p class="text-xs text-slate-500">已选择: {{ selectedTables.length }} 个新表</p>
                  <button
                    v-if="selectedTables.length > 0"
                    type="button"
                    @click="selectedTables = []"
                    class="text-xs text-red-500 hover:text-red-700"
                  >
                    清空选择
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex space-x-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            取消
          </button>
          <button
            type="button"
            @click="handleAdd"
            :disabled="!canAdd"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            添加
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useKnowledgeBaseStore } from '@/stores/knowledgeBase'
import type { KnowledgeBase, DatabaseConnectionTest } from '@/types/knowledge-base'

interface Props {
  knowledgeBase: KnowledgeBase
}

interface Emits {
  (e: 'close'): void
  (e: 'add', source: { type: 'file' | 'table'; data: any }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const knowledgeBaseStore = useKnowledgeBaseStore()
const fileInput = ref<HTMLInputElement | null>(null)

const newFiles = ref<File[]>([])
const errors = ref<Record<string, string>>({})
const isTesting = ref(false)
const hasTestedConnection = ref(false)
const connectionTestResult = ref<DatabaseConnectionTest | null>(null)
const availableTables = ref<string[]>([])
const selectedTables = ref<string[]>([])

const acceptTypes = computed(() => {
  if (props.knowledgeBase.type === 'text') {
    return '.pdf,.docx,.txt'
  } else if (props.knowledgeBase.type === 'spreadsheet') {
    return '.xlsx,.xls,.csv'
  }
  return ''
})

const acceptDescription = computed(() => {
  if (props.knowledgeBase.type === 'text') {
    return '支持 PDF, DOCX, TXT 格式，单个文件最大 10MB'
  } else if (props.knowledgeBase.type === 'spreadsheet') {
    return '支持 XLSX, XLS, CSV 格式，单个文件最大 50MB'
  }
  return ''
})

const maxFileSize = computed(() => {
  return props.knowledgeBase.type === 'text' ? 10 * 1024 * 1024 : 50 * 1024 * 1024
})

const existingTables = computed(() => {
  return props.knowledgeBase.sourceInfo.tables || []
})

const maxNewTables = computed(() => {
  return 20 - existingTables.value.length
})

const canAdd = computed(() => {
  if (props.knowledgeBase.type === 'text' || props.knowledgeBase.type === 'spreadsheet') {
    return newFiles.value.length > 0
  } else if (props.knowledgeBase.type === 'database') {
    return selectedTables.value.length > 0
  }
  return false
})

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files) {
    // Check total file count
    const currentFileCount = props.knowledgeBase.sourceInfo.files?.length || 0
    if (currentFileCount + newFiles.value.length + files.length > 50) {
      errors.value.file = `最多只能上传 50 个文件（当前 ${currentFileCount + newFiles.value.length} 个）`
      return
    }

    // Validate and add each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!file) continue

      // Validate file size
      if (file.size > maxFileSize.value) {
        errors.value.file = `文件 ${file.name} 超过大小限制`
        return
      }

      // Validate file type
      const validExtensions =
        props.knowledgeBase.type === 'text' ? ['.pdf', '.docx', '.txt'] : ['.xlsx', '.xls', '.csv']
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
      if (!validExtensions.includes(fileExtension)) {
        errors.value.file = `文件 ${file.name} 格式不支持`
        return
      }

      // Check for duplicates
      const existingFileNames = props.knowledgeBase.sourceInfo.files?.map((f) => f.fileName) || []
      const newFileNames = newFiles.value.map((f) => f.name)
      if (existingFileNames.includes(file.name) || newFileNames.includes(file.name)) {
        errors.value.file = `文件 ${file.name} 已存在`
        return
      }
    }

    errors.value.file = ''
    // Add all new files
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file) {
        newFiles.value.push(file)
      }
    }
  }

  // Reset input so same files can be selected again if needed
  if (target) {
    target.value = ''
  }
}

const removeFile = (index: number) => {
  newFiles.value.splice(index, 1)
}

const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const testConnection = async () => {
  isTesting.value = true
  connectionTestResult.value = null

  try {
    const conn = props.knowledgeBase.sourceInfo.connection
    if (!conn) {
      throw new Error('未找到数据库连接信息')
    }

    const result = await knowledgeBaseStore.testDatabaseConnection({
      dbType: conn.dbType,
      host: conn.host,
      port: conn.port,
      username: conn.username,
      password: '', // Password not stored in sourceInfo
      database: conn.database,
    })

    connectionTestResult.value = result

    if (result.success && result.tables && result.tables.length > 0) {
      availableTables.value = result.tables
      hasTestedConnection.value = true
      selectedTables.value = []
    }
  } catch (error) {
    connectionTestResult.value = {
      success: false,
      message: '连接测试失败 - 请检查数据库连接信息',
    }
  } finally {
    isTesting.value = false
  }
}

const handleAdd = () => {
  if (props.knowledgeBase.type === 'text' || props.knowledgeBase.type === 'spreadsheet') {
    // Add all files
    for (const file of newFiles.value) {
      emit('add', { type: 'file', data: file })
    }
  } else if (props.knowledgeBase.type === 'database') {
    // Add all selected tables
    for (const table of selectedTables.value) {
      emit('add', { type: 'table', data: table })
    }
  }
}

onMounted(() => {
  // Auto-load tables for database type
  if (props.knowledgeBase.type === 'database') {
    testConnection()
  }
})
</script>
