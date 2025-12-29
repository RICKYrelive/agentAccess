<template>
  <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
    <!-- Card Header -->
    <div class="p-5 border-b border-slate-200">
      <div class="flex items-start justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center text-2xl">
            {{ sandbox.icon }}
          </div>
          <div>
            <h3 class="text-lg font-semibold text-slate-900">{{ sandbox.name }}</h3>
            <p class="text-sm text-slate-600 line-clamp-1">{{ sandbox.description }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <span :class="statusBadgeClass(sandbox.status)" class="px-2.5 py-1 text-xs font-medium rounded-full">
            {{ statusName(sandbox.status) }}
          </span>
        </div>
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
          <span>{{ sandbox.category }}</span>
        </div>
        <div class="flex items-center space-x-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
          </svg>
          <span>{{ sandbox.instances.length }} 个实例</span>
        </div>
        <div v-if="sandbox.imageUrl" class="flex items-center space-x-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
          </svg>
          <span class="truncate max-w-[150px]">{{ sandbox.imageUrl }}</span>
        </div>
      </div>

      <!-- Instance List -->
      <div class="mb-4">
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-sm font-medium text-slate-700">实例列表</h4>
          <button
            @click="$emit('create-instance', sandbox.id)"
            class="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1 hover:bg-primary-50 px-2 py-1 rounded transition-colors"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>新建实例</span>
          </button>
        </div>
        <SandboxInstanceList
          :instances="sandbox.instances"
          @start-instance="$emit('start-instance', $event)"
          @stop-instance="$emit('stop-instance', $event)"
          @delete-instance="$emit('delete-instance', $event)"
        />
      </div>
    </div>

    <!-- Card Footer -->
    <div class="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
      <span class="text-xs text-slate-500">更新于 {{ formatDate(sandbox.updatedAt) }}</span>
      <div class="flex items-center space-x-2">
        <button
          @click="$emit('edit-sandbox', sandbox.id)"
          class="p-1.5 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          title="编辑"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          v-if="sandbox.instances.length === 0"
          @click="handleDelete"
          class="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="移除沙箱"
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
import { getSandboxStatusBadgeClass, getSandboxStatusName } from '@/components/system-tools/types'
import type { SandboxType } from '@/components/system-tools/types'
import SandboxInstanceList from './SandboxInstanceList.vue'

interface Props {
  sandbox: SandboxType
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'create-instance': [sandboxTypeId: string]
  'start-instance': [instanceId: string]
  'stop-instance': [instanceId: string]
  'delete-instance': [instanceId: string]
  'edit-sandbox': [sandboxId: string]
  'delete-sandbox': [sandboxId: string]
}>()

const statusBadgeClass = (status: string) => {
  return getSandboxStatusBadgeClass(status as 'running' | 'stopped' | 'error')
}

const statusName = (status: string) => {
  return getSandboxStatusName(status as 'running' | 'stopped' | 'error')
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

const handleDelete = () => {
  const sandboxId = props.sandbox.id
  if (confirm(`确定要移除沙箱 "${props.sandbox.name}" 吗？`)) {
    emit('delete-sandbox', sandboxId)
  }
}
</script>
