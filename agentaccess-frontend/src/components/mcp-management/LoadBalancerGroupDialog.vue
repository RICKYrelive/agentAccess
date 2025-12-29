<template>
  <Teleport to="body">
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="emit('close')">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-slate-900">{{ group ? '编辑' : '创建' }}负载均衡组</h3>
          <button @click="emit('close')" class="text-slate-400 hover:text-slate-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="px-6 py-4 overflow-y-auto max-h-[60vh]">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Group Name -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">组名称 *</label>
              <input
                v-model="formData.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="例如：翻译服务组"
              />
            </div>

            <!-- Strategy -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">负载均衡策略</label>
              <select
                v-model="formData.strategy"
                class="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="round-robin">轮询 (Round Robin)</option>
                <option value="random">随机 (Random)</option>
                <option value="least-used">最少调用 (Least Used)</option>
              </select>
              <p class="text-xs text-slate-500 mt-1">
                {{ getStrategyDescription(formData.strategy) }}
              </p>
            </div>

            <!-- Tool Selection -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">选择工具</label>
              <div class="border border-slate-300 rounded-md p-3 max-h-40 overflow-y-auto">
                <div v-if="availableTools.length === 0" class="text-sm text-slate-500 text-center py-2">
                  暂无可用工具
                </div>
                <label v-for="tool in availableTools" :key="tool.id" class="flex items-center space-x-2 py-1">
                  <input
                    v-model="formData.toolIds"
                    type="checkbox"
                    :value="tool.id"
                    class="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span class="text-sm text-slate-700">{{ tool.name }}</span>
                  <span class="text-xs text-slate-400">({{ tool.type }})</span>
                </label>
              </div>
            </div>

            <!-- Health Check -->
            <div class="border-t border-slate-200 pt-4">
              <div class="flex items-center justify-between mb-3">
                <label class="text-sm font-medium text-slate-700">健康检查</label>
                <button
                  type="button"
                  @click="formData.healthCheckEnabled = !formData.healthCheckEnabled"
                  :class="[
                    'relative inline-flex h-6 w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500',
                    formData.healthCheckEnabled ? 'bg-primary-600' : 'bg-slate-200',
                  ]"
                >
                  <span
                    :class="[
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      formData.healthCheckEnabled ? 'translate-x-6' : 'translate-x-1',
                    ]"
                  />
                </button>
              </div>

              <div v-if="formData.healthCheckEnabled" class="space-y-3">
                <div>
                  <label class="block text-xs font-medium text-slate-600 mb-1">检查间隔（秒）</label>
                  <input
                    v-model.number="formData.healthCheckInterval"
                    type="number"
                    min="5"
                    class="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-slate-600 mb-1">超时时间（秒）</label>
                  <input
                    v-model.number="formData.healthCheckTimeout"
                    type="number"
                    min="1"
                    class="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3">
          <button @click="emit('close')" class="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md">
            取消
          </button>
          <button
            type="button"
            @click="handleSubmit"
            class="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
          >
            {{ group ? '保存' : '创建' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useMCPManagementStore } from '@/stores/mcpManagement'
import type { LoadBalancerGroup, LoadBalancerGroupFormData, MCPTool } from '../types'

interface Props {
  group?: LoadBalancerGroup | null
  availableTools: MCPTool[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  save: [data: LoadBalancerGroupFormData]
}>()

const store = useMCPManagementStore()

const formData = reactive<LoadBalancerGroupFormData>({
  name: '',
  strategy: 'round-robin',
  toolIds: [],
  healthCheckEnabled: false,
  healthCheckInterval: 30,
  healthCheckTimeout: 5,
})

onMounted(() => {
  if (props.group) {
    formData.name = props.group.name
    formData.strategy = props.group.strategy
    formData.toolIds = [...props.group.toolIds]
    formData.healthCheckEnabled = props.group.healthCheck?.enabled || false
    formData.healthCheckInterval = props.group.healthCheck?.interval || 30
    formData.healthCheckTimeout = props.group.healthCheck?.timeout || 5
  }
})

const getStrategyDescription = (strategy: string) => {
  const descriptions = {
    'round-robin': '按顺序依次调用每个工具',
    'random': '随机选择一个工具进行调用',
    'least-used': '选择当前使用最少的工具',
  }
  return descriptions[strategy] || ''
}

const handleSubmit = () => {
  if (formData.toolIds.length === 0) {
    alert('请至少选择一个工具')
    return
  }
  emit('save', { ...formData })
  emit('close')
}
</script>
