<template>
  <div class="space-y-2">
    <div
      v-for="instance in instances"
      :key="instance.id"
      class="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
    >
      <div class="flex items-center space-x-3 flex-1 min-w-0">
        <div class="w-2 h-2 rounded-full" :class="statusDotClass(instance.status)"></div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center space-x-2">
            <p class="text-sm font-medium text-slate-900 truncate">{{ instance.name }}</p>
            <span class="text-xs px-1.5 py-0.5 rounded-full" :class="statusBadgeClass(instance.status)">
              {{ statusName(instance.status) }}
            </span>
          </div>
          <div class="flex items-center space-x-3 mt-1">
            <p class="text-xs text-slate-500 font-mono">ID: {{ instance.id }}</p>
            <a
              v-if="instance.url"
              :href="instance.url"
              target="_blank"
              class="text-xs text-blue-600 hover:text-blue-700 hover:underline truncate"
              title="点击访问"
            >
              {{ instance.url }}
            </a>
          </div>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <!-- Resource usage mini bars -->
        <div class="flex items-center space-x-2">
          <div class="flex flex-col items-end">
            <div class="flex items-center space-x-1">
              <span class="text-xs text-slate-500">CPU</span>
              <div class="w-12 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  class="bg-blue-500 h-full rounded-full"
                  :style="{ width: `${instance.resources.cpuPercent}%` }"
                ></div>
              </div>
              <span class="text-xs text-slate-600 w-8">{{ Math.round(instance.resources.cpuPercent) }}%</span>
            </div>
            <div class="flex items-center space-x-1">
              <span class="text-xs text-slate-500">MEM</span>
              <div class="w-12 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  class="bg-purple-500 h-full rounded-full"
                  :style="{ width: `${instance.resources.memoryPercent}%` }"
                ></div>
              </div>
              <span class="text-xs text-slate-600 w-8">{{ Math.round(instance.resources.memoryPercent) }}%</span>
            </div>
          </div>
        </div>
        <!-- Action buttons -->
        <div class="flex items-center space-x-1">
          <button
            v-if="instance.status === 'stopped'"
            @click="$emit('start-instance', instance.id)"
            class="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="启动实例"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button
            v-if="instance.status === 'running'"
            @click="$emit('stop-instance', instance.id)"
            class="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            title="停止实例"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button
            @click="$emit('delete-instance', instance.id)"
            class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="删除实例"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <!-- Empty state -->
    <div v-if="instances.length === 0" class="text-center py-6 text-slate-500 text-sm">
      暂无运行实例
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SandboxInstance } from '@/components/system-tools/types'
import { getSandboxStatusName } from '@/components/system-tools/types'

interface Props {
  instances: SandboxInstance[]
}

defineProps<Props>()

defineEmits<{
  'start-instance': [instanceId: string]
  'stop-instance': [instanceId: string]
  'delete-instance': [instanceId: string]
}>()

const statusDotClass = (status: string) => {
  const classes = {
    running: 'bg-green-500',
    stopped: 'bg-slate-400',
    error: 'bg-red-500',
  }
  return classes[status as keyof typeof classes] || classes.stopped
}

const statusBadgeClass = (status: string) => {
  const classes = {
    running: 'bg-green-100 text-green-700',
    stopped: 'bg-slate-100 text-slate-600',
    error: 'bg-red-100 text-red-700',
  }
  return classes[status as keyof typeof classes] || classes.stopped
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
</script>
