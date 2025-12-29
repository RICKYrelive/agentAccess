<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="$emit('close')">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-slate-900">{{ tool ? '编辑' : '配置' }}自定义工具</h3>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="px-6 py-4">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">工具名称 *</label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="例如：GitHub MCP"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">描述</label>
            <textarea
              v-model="formData.description"
              rows="2"
              class="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="工具的简短描述"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">MCP 服务器 URL *</label>
            <input
              v-model="formData.url"
              type="url"
              required
              class="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="https://api.example.com/mcp"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">认证方式</label>
            <select
              v-model="formData.authType"
              class="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="none">无认证</option>
              <option value="apikey">API Key</option>
              <option value="bearer">Bearer Token</option>
            </select>
          </div>

          <div v-if="formData.authType === 'apikey'">
            <label class="block text-sm font-medium text-slate-700 mb-1">API Key</label>
            <input
              v-model="formData.apiKey"
              type="password"
              class="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="输入 API Key"
            />
          </div>

          <div v-if="formData.authType === 'bearer'">
            <label class="block text-sm font-medium text-slate-700 mb-1">Bearer Token</label>
            <input
              v-model="formData.bearerToken"
              type="password"
              class="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="输入 Bearer Token"
            />
          </div>

          <div class="flex items-center space-x-2 pt-2">
            <button
              type="button"
              @click="testConnection"
              class="px-4 py-2 text-sm text-primary-600 border border-primary-300 rounded-md hover:bg-primary-50"
            >
              测试连接
            </button>
            <span v-if="connectionStatus" :class="connectionStatus === 'success' ? 'text-green-600' : 'text-red-600'" class="text-sm">
              {{ connectionMessage }}
            </span>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3">
        <button @click="$emit('close')" class="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md">
          取消
        </button>
        <button @click="handleSubmit" class="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md">
          {{ tool ? '保存' : '创建' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useMCPManagementStore } from '@/stores/mcpManagement'
import type { MCPTool } from '../mcp-management/types'

interface Props {
  tool?: MCPTool | null
}

const props = defineProps<Props>()
defineEmits<{
  close: []
}>()

const store = useMCPManagementStore()

const formData = reactive({
  name: '',
  description: '',
  url: '',
  authType: 'none' as 'none' | 'apikey' | 'bearer',
  apiKey: '',
  bearerToken: '',
})

const connectionStatus = ref<'success' | 'error' | null>(null)
const connectionMessage = ref('')

onMounted(() => {
  if (props.tool) {
    formData.name = props.tool.name
    formData.description = props.tool.description
    formData.url = props.tool.config.url || ''
    formData.authType = props.tool.config.authType || 'none'
    formData.apiKey = props.tool.config.apiKey || ''
    formData.bearerToken = props.tool.config.bearerToken || ''
  }
})

const testConnection = () => {
  // Mock connection test
  connectionStatus.value = 'success'
  connectionMessage.value = '连接成功'
  setTimeout(() => {
    connectionStatus.value = null
    connectionMessage.value = ''
  }, 3000)
}

const handleSubmit = () => {
  if (props.tool) {
    store.updateMCPTool(props.tool.id, {
      name: formData.name,
      description: formData.description,
      config: {
        url: formData.url,
        authType: formData.authType,
        apiKey: formData.apiKey,
        bearerToken: formData.bearerToken,
      },
    })
  } else {
    store.createMCPTool({
      name: formData.name,
      description: formData.description,
      type: 'custom',
      category: 'custom',
      isEnabled: true,
      status: 'active',
      config: {
        url: formData.url,
        authType: formData.authType,
        apiKey: formData.apiKey,
        bearerToken: formData.bearerToken,
      },
    })
  }
  // Reset form
  Object.assign(formData, {
    name: '',
    description: '',
    url: '',
    authType: 'none',
    apiKey: '',
    bearerToken: '',
  })
  // Close dialog
  // Use nextTick to avoid closing before store updates
  setTimeout(() => {
    // @ts-ignore - emit is available
    $emit('close')
  }, 100)
}
</script>
