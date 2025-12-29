<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="close">
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Connect Database</h3>
        <p class="text-sm text-slate-500 mt-1">Configure a database connection as an MCP tool</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tool Name</label>
          <input
            v-model="formData.name"
            type="text"
            required
            placeholder="e.g., Production Database"
            class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
          <input
            v-model="formData.description"
            type="text"
            required
            placeholder="e.g., PostgreSQL production database"
            class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
        </div>

        <!-- Database Type -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Database Type</label>
          <select
            v-model="formData.databaseType"
            required
            class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          >
            <option value="postgresql">PostgreSQL</option>
            <option value="mysql">MySQL</option>
            <option value="mongodb">MongoDB</option>
          </select>
        </div>

        <!-- Host -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Host</label>
          <input
            v-model="formData.host"
            type="text"
            required
            placeholder="localhost or IP address"
            class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
        </div>

        <!-- Port -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Port</label>
          <input
            v-model.number="formData.port"
            type="number"
            required
            :placeholder="String(defaultPort)"
            class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
        </div>

        <!-- Username -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username</label>
          <input
            v-model="formData.username"
            type="text"
            required
            placeholder="Database username"
            class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
          <input
            v-model="formData.password"
            type="password"
            required
            placeholder="Database password"
            class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
        </div>

        <!-- Database Name -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Database Name</label>
          <input
            v-model="formData.databaseName"
            type="text"
            required
            placeholder="Name of the database"
            class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
        </div>

        <!-- Test Connection Result -->
        <div v-if="testResult" :class="[
          'p-3 rounded-lg text-sm',
          testResult.success ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
        ]">
          {{ testResult.message }}
        </div>
      </form>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-between">
        <button
          type="button"
          @click="testConnection"
          :disabled="isTesting"
          class="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isTesting ? 'Testing...' : 'Test Connection' }}
        </button>
        <div class="flex gap-3">
          <button
            type="button"
            @click="close"
            class="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="handleSubmit"
            :disabled="!isFormValid"
            class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Tool
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useMCPManagementStore } from '@/stores/mcpManagement'
import type { DatabaseConnectionFormData } from '@/components/mcp-management/types'

const store = useMCPManagementStore()

const isOpen = defineModel<boolean>({ required: true })

const emit = defineEmits<{
  close: []
}>()

const formData = ref<DatabaseConnectionFormData>({
  name: '',
  description: '',
  databaseType: 'postgresql',
  host: 'localhost',
  port: 5432,
  username: '',
  password: '',
  databaseName: '',
})

const isTesting = ref(false)
const testResult = ref<{ success: boolean; message: string } | null>(null)

// Update default port based on database type
const defaultPort = computed(() => {
  const ports = {
    postgresql: 5432,
    mysql: 3306,
    mongodb: 27017,
  }
  return ports[formData.value.databaseType] || 5432
})

watch(() => formData.value.databaseType, (newType) => {
  formData.value.port = defaultPort.value
})

const isFormValid = computed(() => {
  return formData.value.name &&
         formData.value.description &&
         formData.value.host &&
         formData.value.username &&
         formData.value.password &&
         formData.value.databaseName
})

const testConnection = async () => {
  isTesting.value = true
  testResult.value = null

  // Simulate connection test (replace with actual API call)
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Placeholder - always succeeds for now
  testResult.value = {
    success: true,
    message: 'Connection successful!'
  }

  isTesting.value = false
}

const handleSubmit = () => {
  if (!isFormValid.value) return

  store.createDatabaseTool(formData.value)
  close()
}

const close = () => {
  // Reset form
  formData.value = {
    name: '',
    description: '',
    databaseType: 'postgresql',
    host: 'localhost',
    port: 5432,
    username: '',
    password: '',
    databaseName: '',
  }
  testResult.value = null
  isOpen.value = false
  emit('close')
}
</script>
