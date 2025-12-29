<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="$emit('close')">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-slate-900">{{ tool ? '编辑' : '导入' }} MCP 镜像</h3>
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
            <label class="block text-sm font-medium text-slate-700 mb-2">镜像类型</label>
            <div class="flex space-x-4">
              <label class="flex items-center">
                <input
                  v-model="formData.packageType"
                  type="radio"
                  value="npx"
                  class="mr-2"
                />
                <span>npx (Node.js)</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="formData.packageType"
                  type="radio"
                  value="uvx"
                  class="mr-2"
                />
                <span>uvx (Python)</span>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">包名 *</label>
            <input
              v-model="formData.packageName"
              type="text"
              required
              class="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              :placeholder="formData.packageType === 'npx' ? '@example/package' : 'example-package'"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">版本</label>
            <input
              v-model="formData.version"
              type="text"
              class="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="默认: latest"
            />
          </div>

          <!-- Mock metadata display -->
          <div v-if="formData.packageName" class="p-3 bg-slate-50 rounded-md border border-slate-200">
            <p class="text-xs text-slate-500 mb-1">镜像信息 (预览)</p>
            <p class="text-sm font-medium text-slate-900">{{ formData.packageName }}</p>
            <p class="text-xs text-slate-500">{{ formData.version || 'latest' }}</p>
            <p class="text-xs text-slate-400 mt-1">作者: Unknown • 镜像来源: {{ formData.packageType === 'npx' ? 'npm' : 'PyPI' }}</p>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3">
        <button @click="$emit('close')" class="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md">
          取消
        </button>
        <button @click="handleSubmit" class="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md">
          {{ tool ? '保存' : '部署' }}
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
  packageType: 'npx' as 'npx' | 'uvx',
  packageName: '',
  version: '',
})

onMounted(() => {
  if (props.tool && (props.tool.type === 'npx' || props.tool.type === 'uvx')) {
    formData.packageType = props.tool.type
    formData.packageName = props.tool.config.packageName || ''
    formData.version = props.tool.config.version || ''
  }
})

const handleSubmit = () => {
  if (props.tool) {
    store.updateMCPTool(props.tool.id, {
      config: {
        ...props.tool.config,
        packageName: formData.packageName,
        version: formData.version,
      },
    })
  } else {
    store.createMCPTool({
      name: formData.packageName,
      description: `${formData.packageType === 'npx' ? 'Node.js' : 'Python'} 包: ${formData.packageName}`,
      type: formData.packageType,
      category: 'image',
      isEnabled: true,
      status: 'active',
      config: {
        packageName: formData.packageName,
        version: formData.version || 'latest',
      },
    })
  }
  // Reset form
  formData.packageType = 'npx'
  formData.packageName = ''
  formData.version = ''

  setTimeout(() => {
    // @ts-ignore
    $emit('close')
  }, 100)
}
</script>
