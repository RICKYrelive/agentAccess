<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="$emit('close')">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">{{ gateway ? '编辑' : '创建' }} MCP 网关</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="px-6 py-4">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">网关名称 *</label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="例如：API 网关"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea
              v-model="formData.description"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="网关的简短描述"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Base URL *</label>
            <input
              v-model="formData.baseUrl"
              type="url"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="https://api.example.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">关联 MCP 工具</label>
            <div class="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto">
              <div v-if="store.mcpTools.length === 0" class="text-sm text-gray-500 text-center py-2">
                暂无可用工具
              </div>
              <label v-for="tool in store.mcpTools" :key="tool.id" class="flex items-center space-x-2 py-1">
                <input
                  v-model="formData.mcpToolIds"
                  type="checkbox"
                  :value="tool.id"
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="text-sm text-gray-700">{{ tool.name }}</span>
                <span class="text-xs text-gray-400">({{ tool.type }})</span>
              </label>
            </div>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
        <button @click="$emit('close')" class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
          取消
        </button>
        <button @click="handleSubmit" class="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md">
          {{ gateway ? '保存' : '创建' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useMCPManagementStore } from '@/stores/mcpManagement'
import type { MCPGateway } from '../mcp-management/types'

interface Props {
  gateway?: MCPGateway | null
}

const props = defineProps<Props>()
defineEmits<{
  close: []
}>()

const store = useMCPManagementStore()

const formData = reactive({
  name: '',
  description: '',
  baseUrl: '',
  mcpToolIds: [] as string[],
})

onMounted(() => {
  if (props.gateway) {
    formData.name = props.gateway.name
    formData.description = props.gateway.description
    formData.baseUrl = props.gateway.baseUrl
    formData.mcpToolIds = [...props.gateway.mcpToolIds]
  }
})

const handleSubmit = () => {
  if (props.gateway) {
    store.updateGateway(props.gateway.id, formData)
  } else {
    store.createGateway({
      ...formData,
      status: 'running',
    })
  }

  // Reset form
  Object.assign(formData, {
    name: '',
    description: '',
    baseUrl: '',
    mcpToolIds: [],
  })

  setTimeout(() => {
    // @ts-ignore
    $emit('close')
  }, 100)
}
</script>
