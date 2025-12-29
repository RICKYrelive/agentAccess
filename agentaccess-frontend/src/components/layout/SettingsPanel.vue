<template>
  <div class="h-full bg-white flex flex-col">
    <!-- Header -->
    <div class="p-4 border-b border-slate-200 flex items-center justify-between">
      <h3 class="text-lg font-semibold text-slate-900">MCP服务设置</h3>
      <button
        @click="$emit('close')"
        class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md"
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

    <!-- Settings Content -->
    <div class="flex-1 overflow-y-auto p-4 space-y-6">
      <!-- Description -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p class="text-sm text-blue-800">
          <strong>说明：</strong
          >这是会话级的MCP服务启停设置。要配置全局可用的MCP服务，请从左下角用户菜单进入"用户设置"。
        </p>
      </div>

      <!-- MCP Services -->
      <div v-for="category in mcpCategories" :key="category.id" class="space-y-3">
        <h4 class="text-sm font-medium text-slate-900">{{ category.name }}</h4>

        <div class="space-y-2">
          <div
            v-for="service in category.services"
            :key="service.id"
            class="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
          >
            <div class="flex-1">
              <label class="text-sm font-medium text-slate-700">
                {{ service.name }}
              </label>
              <p class="text-xs text-slate-500 mt-1">{{ service.description }}</p>
            </div>

            <!-- Toggle Switch -->
            <button
              @click="toggleService(service)"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                service.isEnabled ? 'bg-primary-600' : 'bg-slate-200',
              ]"
            >
              <span
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  service.isEnabled ? 'translate-x-6' : 'translate-x-1',
                ]"
              />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="p-4 border-t border-slate-200">
      <div class="space-y-3">
        <div class="flex space-x-3">
          <button @click="saveSettings" class="btn-primary flex-1">保存设置</button>
          <button @click="$emit('close')" class="btn-secondary flex-1">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { MCPService, MCPServiceCategory } from '@/types/mcp'

defineEmits<{
  close: []
}>()

// MCP Services data
const mcpCategories = ref<MCPServiceCategory[]>([
  {
    id: '1',
    name: '检索工具',
    description: '信息检索相关服务',
    services: [
      {
        id: 'search',
        name: '联网搜索',
        description: '使用搜索引擎获取实时网络信息',
        category: { id: '1', name: '检索工具', description: '' },
        isEnabled: true,
        status: 'active',
        configuration: {
          searchEngine: 'google',
          maxResults: 10,
          language: 'zh-CN',
        },
      },
    ],
  },
  {
    id: '2',
    name: '信息处理',
    description: '内容处理和分析服务',
    services: [
      {
        id: 'web-parser',
        name: '网页解析',
        description: '解析网页内容，提取关键信息',
        category: { id: '2', name: '信息处理', description: '' },
        isEnabled: true,
        status: 'active',
        configuration: {
          timeout: 30,
          retryCount: 3,
        },
      },
    ],
  },
  {
    id: '3',
    name: '开发者工具',
    description: '开发和调试相关工具',
    services: [
      {
        id: 'python-executor',
        name: 'Python代码执行器',
        description: '执行Python代码并返回结果',
        category: { id: '3', name: '开发者工具', description: '' },
        isEnabled: true,
        status: 'active',
        configuration: {
          timeout: 60,
          memoryLimit: '512MB',
        },
      },
      {
        id: '-browser-usage',
        name: '浏览器使用',
        description: '自动化浏览器操作',
        category: { id: '3', name: '开发者工具', description: '' },
        isEnabled: false,
        status: 'inactive',
        configuration: {
          headless: true,
          viewport: '1920x1080',
        },
      },
    ],
  },
  {
    id: '4',
    name: '云服务-存储',
    description: '云存储和日志服务',
    services: [
      {
        id: 'log-service',
        name: '日志服务',
        description: '收集和分析应用日志',
        category: { id: '4', name: '云服务-存储', description: '' },
        isEnabled: true,
        status: 'active',
        configuration: {
          retention: '30d',
          level: 'info',
        },
      },
    ],
  },
])

// Methods
const saveSettings = () => {
  // Settings are automatically saved in the store
  alert('MCP服务设置已保存')
}

const toggleService = (service: MCPService) => {
  service.isEnabled = !service.isEnabled
  service.status = service.isEnabled ? 'active' : 'inactive'
}
</script>
