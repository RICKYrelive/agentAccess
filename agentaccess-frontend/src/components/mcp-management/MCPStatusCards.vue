<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
    <!-- Active Tools Card -->
    <div class="glass-panel p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-start justify-between mb-4">
        <div class="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
          </svg>
        </div>
        <span class="text-xs font-semibold text-slate-400 uppercase">Active Tools</span>
      </div>
      <div class="flex items-baseline gap-2">
        <span class="text-3xl font-bold text-slate-900 dark:text-white">{{ store.activeToolsCount }}</span>
        <span class="text-sm text-slate-500">connected</span>
      </div>
    </div>

    <!-- Usage Today Card -->
    <div class="glass-panel p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-start justify-between mb-4">
        <div class="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span class="text-xs font-semibold text-slate-400 uppercase">Usage Today</span>
      </div>
      <div class="flex items-baseline gap-2">
        <span class="text-3xl font-bold text-slate-900 dark:text-white">{{ formattedUsage }}</span>
        <span class="text-sm text-slate-500">invocations</span>
      </div>
    </div>

    <!-- System Status Card -->
    <div class="glass-panel p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div class="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-900/10 dark:to-transparent pointer-events-none"></div>
      <div class="relative z-10">
        <div class="flex items-start justify-between mb-4">
          <div :class="[
            'w-10 h-10 rounded-lg flex items-center justify-center',
            statusConfig.iconBgClass
          ]">
            <svg :class="`w-6 h-6 ${statusConfig.iconColorClass}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="store.systemStatus === 'operational'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div class="text-right">
            <span class="text-xs font-semibold text-slate-400 uppercase block">System Status</span>
            <span class="text-[10px] text-slate-400">{{ statusTimeAgo }}</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div :class="[
            'w-2.5 h-2.5 rounded-full',
            store.systemStatus === 'operational' ? 'bg-green-500 animate-pulse' : statusConfig.dotClass
          ]"></div>
          <span class="text-xl font-bold text-slate-900 dark:text-white">{{ statusConfig.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMCPManagementStore } from '@/stores/mcpManagement'
import { formatRelativeTime } from '@/utils/mcpToolUtils'

const store = useMCPManagementStore()

// Status configuration
const statusConfig = computed(() => {
  const status = store.systemStatus
  if (status === 'operational') {
    return {
      label: 'Operational',
      iconBgClass: 'bg-green-50 dark:bg-green-900/30',
      iconColorClass: 'text-green-600 dark:text-green-400',
      dotClass: 'bg-green-500',
    }
  } else if (status === 'degraded') {
    return {
      label: 'Degraded',
      iconBgClass: 'bg-amber-50 dark:bg-amber-900/30',
      iconColorClass: 'text-amber-600 dark:text-amber-400',
      dotClass: 'bg-amber-500',
    }
  }
  return {
    label: 'Offline',
    iconBgClass: 'bg-slate-50 dark:bg-slate-800',
    iconColorClass: 'text-slate-600 dark:text-slate-400',
    dotClass: 'bg-slate-500',
  }
})

// Formatted usage metrics
const formattedUsage = computed(() => {
  const daily = store.usageMetrics.daily
  if (daily === 0) return 'N/A'
  if (daily >= 1000) return `${(daily / 1000).toFixed(1)}k`
  return daily.toString()
})

// Status time ago (placeholder - would come from backend)
const statusTimeAgo = computed(() => {
  return store.usageMetrics.lastUpdated
    ? formatRelativeTime(store.usageMetrics.lastUpdated)
    : '1m ago'
})
</script>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.dark .glass-panel {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
