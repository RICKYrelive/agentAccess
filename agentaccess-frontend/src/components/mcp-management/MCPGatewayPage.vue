<template>
  <div class="h-full flex flex-col bg-slate-50 dark:bg-slate-950 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
    <!-- Page Header -->
    <div class="px-8 py-10 relative">
      <!-- Background gradient effects -->
      <div class="absolute top-0 right-0 w-full h-[200px] bg-gradient-to-bl from-blue-50/80 via-indigo-50/50 to-transparent dark:from-blue-900/10 dark:via-indigo-900/5 dark:to-transparent pointer-events-none"></div>

      <div class="relative z-10 flex items-start justify-between">
        <div class="max-w-2xl">
          <h1 class="text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">MCP 网关管理</h1>
          <p class="text-slate-500 dark:text-slate-400 text-lg">管理 MCP 网关，配置负载均衡和健康检查策略。</p>
        </div>

        <!-- Decorative Icons -->
        <div class="relative w-48 h-40 hidden lg:block">
          <div class="absolute -top-4 right-4 p-4 py-6 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl shadow-xl transform rotate-12 opacity-90">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9V3m0 12c0 4.97-1.343 9-3 9" />
            </svg>
          </div>
          <div class="absolute top-14 right-20 p-3 py-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-100 dark:border-slate-700 transform -rotate-6">
            <svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Overview Cards -->
    <div class="px-8 flex-1">
      <MCPGatewayStatusCards />

      <!-- Gateways Section -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <!-- Table Header -->
        <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">网关列表</h2>
            <span class="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400">
              {{ store.mcpGateways.length }}
            </span>
          </div>
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

        <!-- Gateways Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead class="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  网关名称
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  描述
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  关联工具
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  状态
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              <tr v-for="gateway in store.mcpGateways" :key="gateway.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                      <svg class="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <div class="text-sm font-medium text-slate-900 dark:text-white">{{ gateway.name }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-slate-500 dark:text-slate-400">{{ gateway.description }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-slate-900 dark:text-white">{{ gateway.mcpToolIds.length }} 个工具</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusBadgeClass(gateway.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    <span v-if="gateway.status === 'running'" class="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                    <span v-if="gateway.status === 'stopped'" class="w-1.5 h-1.5 bg-slate-500 rounded-full mr-1.5"></span>
                    <span v-if="gateway.status === 'error'" class="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></span>
                    {{ getStatusName(gateway.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="editGateway(gateway)" class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3">
                    编辑
                  </button>
                  <button @click="deleteGateway(gateway.id)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                    删除
                  </button>
                </td>
              </tr>
              <tr v-if="store.mcpGateways.length === 0">
                <td colspan="5" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center">
                    <svg class="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <p class="text-slate-500 dark:text-slate-400 text-sm">还没有创建任何 MCP 网关</p>
                    <p class="text-slate-400 dark:text-slate-500 text-xs mt-1">点击"创建网关"开始</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
import type { MCPGateway, GatewayStatus } from '@/components/mcp-management/types'
import MCPGatewayStatusCards from './MCPGatewayStatusCards.vue'
import CreateGatewayDialog from './CreateGatewayDialog.vue'

const store = useMCPManagementStore()

const showCreateDialog = ref(false)
const editingGateway = ref<MCPGateway | null>(null)

const getStatusName = (status: GatewayStatus) => {
  const names: Record<GatewayStatus, string> = {
    running: '运行中',
    stopped: '已停止',
    error: '错误',
  }
  return names[status]
}

const getStatusBadgeClass = (status: GatewayStatus) => {
  const classes: Record<GatewayStatus, string> = {
    running: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800',
    stopped: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-700',
    error: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800',
  }
  return classes[status]
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
