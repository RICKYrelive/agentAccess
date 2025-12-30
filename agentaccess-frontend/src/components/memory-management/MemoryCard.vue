<template>
  <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
    <!-- Card Header -->
    <div class="p-5 border-b border-slate-200">
      <div class="flex items-start justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center text-2xl">
            {{ getStrategyIcon(memoryBase.strategy.type) }}
          </div>
          <div>
            <h3 class="text-lg font-semibold text-slate-900">{{ memoryBase.name }}</h3>
            <p class="text-sm text-slate-600 line-clamp-1">{{ memoryBase.description }}</p>
          </div>
        </div>
        <span :class="statusBadgeClass(memoryBase.status)" class="px-2.5 py-1 text-xs font-medium rounded-full">
          {{ statusName(memoryBase.status) }}
        </span>
      </div>
    </div>

    <!-- Card Body -->
    <div class="p-5">
      <!-- Meta Information -->
      <div class="flex items-center space-x-4 text-sm text-slate-600 mb-4">
        <div class="flex items-center space-x-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span>{{ getStrategyDisplayName(memoryBase.strategy.type) }}</span>
        </div>
        <div class="flex items-center space-x-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>{{ memoryBase.memoryCount }} 条记忆</span>
        </div>
      </div>

      <!-- UUID -->
      <div class="mb-4">
        <p class="text-xs text-slate-400 mb-1">UUID</p>
        <p class="text-xs font-mono text-slate-600 bg-slate-50 px-2 py-1 rounded inline-block">{{ memoryBase.id }}</p>
      </div>

      <!-- Strategy Config -->
      <div class="bg-slate-50 rounded-lg p-3 mb-4">
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate-600">最大检索数</span>
          <span class="font-medium text-slate-900">{{ memoryBase.strategy.config.maxMemories }}</span>
        </div>
        <div class="flex items-center justify-between text-sm mt-1">
          <span class="text-slate-600">相似度阈值</span>
          <span class="font-medium text-slate-900">{{ (memoryBase.strategy.config.similarityThreshold * 100).toFixed(0) }}%</span>
        </div>
      </div>
    </div>

    <!-- Card Footer -->
    <div class="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
      <span class="text-xs text-slate-500">更新于 {{ formatDate(memoryBase.updatedAt) }}</span>
      <div class="flex items-center space-x-2">
        <button
          @click="handleToggleStatus"
          class="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
          :class="memoryBase.status === 'active'
            ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50'
            : 'text-green-600 hover:text-green-700 hover:bg-green-50'"
          :title="memoryBase.status === 'active' ? '停用' : '启用'"
        >
          {{ memoryBase.status === 'active' ? '停用' : '启用' }}
        </button>
        <button
          @click="$emit('edit-memory', memoryBase.id)"
          class="p-1.5 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          title="编辑"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          @click="handleDelete"
          class="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="删除"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getMemoryStatusBadgeClass, getMemoryStatusName, MEMORY_STRATEGY_CONFIGS } from './types'
import type { MemoryBase } from './types'
import { useMemoryStore } from '@/stores/memory'

interface Props {
  memoryBase: MemoryBase
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'edit-memory': [memoryBaseId: string]
  'delete-memory': [memoryBaseId: string]
}>()

const store = useMemoryStore()

const statusBadgeClass = (status: string) => {
  return getMemoryStatusBadgeClass(status as 'active' | 'inactive')
}

const statusName = (status: string) => {
  return getMemoryStatusName(status as 'active' | 'inactive')
}

const getStrategyIcon = (type: string) => {
  return MEMORY_STRATEGY_CONFIGS[type as keyof typeof MEMORY_STRATEGY_CONFIGS]?.icon || '📝'
}

const getStrategyDisplayName = (type: string) => {
  return MEMORY_STRATEGY_CONFIGS[type as keyof typeof MEMORY_STRATEGY_CONFIGS]?.name || type
}

const formatDate = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString('zh-CN')
}

const handleToggleStatus = () => {
  store.toggleMemoryBaseStatus(props.memoryBase.id)
}

const handleDelete = () => {
  if (confirm(`确定要删除记忆库 "${props.memoryBase.name}" 吗？此操作不可恢复。`)) {
    emit('delete-memory', props.memoryBase.id)
  }
}
</script>
