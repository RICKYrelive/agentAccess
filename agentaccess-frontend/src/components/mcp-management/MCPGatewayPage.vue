<template>
  <div class="h-full flex flex-col bg-white overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
    <!-- Page Header -->
    <div class="px-8 py-6 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-semibold text-gray-900">MCP 网关管理</h2>
          <p class="text-gray-500 mt-1">管理 MCP 网关</p>
        </div>
        <div class="flex space-x-3">
          <button
            @click="showCreateDialog = true"
            class="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>创建网关</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Gateways Table -->
    <div class="px-8 py-6 flex-1">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                网关名称
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                描述
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                关联工具
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="gateway in store.mcpGateways" :key="gateway.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <div class="text-sm font-medium text-gray-900">{{ gateway.name }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ gateway.description }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900">{{ gateway.mcpToolIds.length }} 个工具</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusBadgeClass(gateway.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  <span v-if="gateway.status === 'running'" class="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                  <span v-if="gateway.status === 'stopped'" class="w-1.5 h-1.5 bg-gray-500 rounded-full mr-1.5"></span>
                  <span v-if="gateway.status === 'error'" class="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></span>
                  {{ getStatusName(gateway.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="editGateway(gateway)" class="text-primary-600 hover:text-primary-900 mr-3">
                  编辑
                </button>
                <button @click="deleteGateway(gateway.id)" class="text-red-600 hover:text-red-900">
                  删除
                </button>
              </td>
            </tr>
            <tr v-if="store.mcpGateways.length === 0">
              <td colspan="5" class="px-6 py-12 text-center text-sm text-gray-500">
                <svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <p>还没有创建任何 MCP 网关</p>
                <p class="mt-1">点击"创建网关"开始</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create Gateway Dialog -->
    <CreateGatewayDialog
      v-if="showCreateDialog"
      :gateway="editingGateway"
      @close="closeCreateDialog"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMCPManagementStore } from '@/stores/mcpManagement'
import type { MCPGateway } from '../mcp-management/types'
import CreateGatewayDialog from './CreateGatewayDialog.vue'

const store = useMCPManagementStore()

const showCreateDialog = ref(false)
const editingGateway = ref<MCPGateway | null>(null)

const getStatusName = (status: string) => {
  const names = {
    running: '运行中',
    stopped: '已停止',
    error: '错误',
  }
  return names[status] || status
}

const getStatusBadgeClass = (status: string) => {
  const classes = {
    running: 'bg-green-100 text-green-800',
    stopped: 'bg-gray-100 text-gray-800',
    error: 'bg-red-100 text-red-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const editGateway = (gateway: MCPGateway) => {
  editingGateway.value = gateway
  showCreateDialog.value = true
}

const deleteGateway = (id: string) => {
  const gateway = store.getGateway(id)
  const toolCount = gateway?.mcpToolIds.length || 0
  if (confirm(`确定要删除这个网关吗？这将同时移除 ${toolCount} 个关联工具。`)) {
    store.deleteGateway(id)
  }
}

const closeCreateDialog = () => {
  showCreateDialog.value = false
  editingGateway.value = null
}
</script>
