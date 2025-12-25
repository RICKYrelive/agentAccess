<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto" @click.stop>
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
        <h2 class="text-xl font-semibold text-gray-900">导入数据库知识库</h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            知识库名称 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            maxlength="100"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="请输入知识库名称"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            描述
          </label>
          <textarea
            v-model="form.description"
            rows="2"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            placeholder="请输入知识库描述（可选）"
          />
        </div>

        <!-- Database Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            数据库类型 <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.dbType"
            @change="updateDefaultPort"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="mysql">MySQL</option>
            <option value="postgresql">PostgreSQL</option>
          </select>
        </div>

        <!-- Host -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            主机地址 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.host"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="localhost 或 IP 地址"
          />
        </div>

        <!-- Port -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            端口 <span class="text-red-500">*</span>
          </label>
          <input
            v-model.number="form.port"
            type="number"
            required
            min="1"
            max="65535"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="端口号"
          />
        </div>

        <!-- Username -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            用户名 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.username"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="数据库用户名"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            密码 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="数据库密码"
          />
        </div>

        <!-- Database Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            数据库名 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.database"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="数据库名称"
          />
        </div>

        <!-- Connection Test Button -->
        <div class="flex items-center space-x-2">
          <button
            type="button"
            @click="testConnection"
            :disabled="isTesting || !canTestConnection"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <svg v-if="isTesting" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isTesting ? '连接中...' : '测试连接' }}</span>
          </button>
          <span v-if="connectionTestResult" :class="connectionTestResult.success ? 'text-green-600' : 'text-red-600'" class="text-sm">
            {{ connectionTestResult.message }}
          </span>
        </div>

        <!-- Table Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            选择表 <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.table"
            :disabled="!hasTestedConnection"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">请先测试连接</option>
            <option v-for="table in availableTables" :key="table" :value="table">
              {{ table }}
            </option>
          </select>
          <p class="mt-1 text-xs text-gray-500">需要先测试连接才能选择表</p>
        </div>

        <!-- Actions -->
        <div class="flex space-x-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            :disabled="!isFormValid"
            class="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            导入
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useKnowledgeBaseStore } from '@/stores/knowledgeBase'
import type { DatabaseImportForm, DatabaseConnectionTest } from '@/types/knowledge-base'

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
  table: ''
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
  form.value.table = ''
}

const canTestConnection = computed(() => {
  return form.value.host && form.value.port && form.value.username && form.value.password && form.value.database
})

const isFormValid = computed(() => {
  return form.value.name.trim() !== '' &&
         form.value.host &&
         form.value.port &&
         form.value.username &&
         form.value.password &&
         form.value.database &&
         form.value.table
})

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
      table: ''
    })

    connectionTestResult.value = result

    if (result.success && result.tables) {
      availableTables.value = result.tables
      hasTestedConnection.value = true
      // Auto-select first table
      if (result.tables.length > 0 && result.tables[0]) {
        form.value.table = result.tables[0]
      }
    }
  } catch (error) {
    connectionTestResult.value = {
      success: false,
      message: '连接测试失败'
    }
  } finally {
    isTesting.value = false
  }
}

const handleSubmit = () => {
  if (isFormValid.value) {
    emit('submit', form.value)
  }
}

// Watch for database type change to update port
watch(() => form.value.dbType, () => {
  updateDefaultPort()
})
</script>
