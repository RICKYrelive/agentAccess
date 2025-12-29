<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
    <!-- Active Gateways Card -->
    <div class="glass-panel p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-start justify-between mb-4">
        <div class="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
          </svg>
        </div>
        <span class="text-xs font-semibold text-slate-400 uppercase">Active Gateways</span>
      </div>
      <div class="flex items-baseline gap-2">
        <span class="text-3xl font-bold text-slate-900 dark:text-white">{{ store.activeGatewaysCount }}</span>
        <span class="text-sm text-slate-500">running</span>
      </div>
    </div>

    <!-- Connected Tools Card -->
    <div class="glass-panel p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-start justify-between mb-4">
        <div class="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <span class="text-xs font-semibold text-slate-400 uppercase">Connected Tools</span>
      </div>
      <div class="flex items-baseline gap-2">
        <span class="text-3xl font-bold text-slate-900 dark:text-white">{{ store.totalConnectedTools }}</span>
        <span class="text-sm text-slate-500">tools</span>
      </div>
    </div>

    <!-- QPS Card -->
    <div class="glass-panel p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-900/10 dark:to-transparent pointer-events-none"></div>
      <div class="relative z-10">
        <div class="flex items-start justify-between mb-4">
          <div class="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
            <svg class="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span class="text-xs font-semibold text-slate-400 uppercase">QPS</span>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-bold text-slate-900 dark:text-white">{{ virtualQPS }}</span>
          <span class="text-sm text-slate-500">queries/sec</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMCPManagementStore } from '@/stores/mcpManagement'

const store = useMCPManagementStore()

// Virtual QPS value (mock data)
const virtualQPS = ref(1234)
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
