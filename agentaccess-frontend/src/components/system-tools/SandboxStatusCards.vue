<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <!-- Total Sandbox Types Card -->
    <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-slate-600 font-medium">沙箱类型</p>
          <p class="text-2xl font-bold text-slate-900 mt-1">{{ totalSandboxTypes }}</p>
        </div>
        <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
          <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Running Instances Card -->
    <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-slate-600 font-medium">运行实例</p>
          <p class="text-2xl font-bold text-slate-900 mt-1">{{ runningInstanceCount }}<span class="text-sm font-normal text-slate-500">/{{ totalInstanceCount }}</span></p>
        </div>
        <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
          </svg>
        </div>
      </div>
      <!-- Live indicator -->
      <div class="flex items-center mt-2">
        <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span class="text-xs text-slate-500 ml-1">实时监控</span>
      </div>
    </div>

    <!-- Resource Usage Card -->
    <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-slate-600 font-medium">资源使用</p>
          <p class="text-2xl font-bold text-slate-900 mt-1">{{ averageResourceUsage }}%</p>
        </div>
        <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
      </div>
      <!-- Resource bars -->
      <div class="mt-2 space-y-1">
        <div class="flex items-center">
          <span class="text-xs text-slate-500 w-8">CPU</span>
          <div class="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div class="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500" :style="{ width: `${resourceUsage.cpu}%` }"></div>
          </div>
          <span class="text-xs text-slate-600 ml-2 w-8 text-right">{{ Math.round(resourceUsage.cpu) }}%</span>
        </div>
        <div class="flex items-center">
          <span class="text-xs text-slate-500 w-8">MEM</span>
          <div class="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div class="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full transition-all duration-500" :style="{ width: `${resourceUsage.memory}%` }"></div>
          </div>
          <span class="text-xs text-slate-600 ml-2 w-8 text-right">{{ Math.round(resourceUsage.memory) }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSystemToolsStore } from '@/stores/systemTools'

const systemToolsStore = useSystemToolsStore()
const { sandboxTypes, totalResourceUsage, totalInstanceCount, runningInstanceCount } = storeToRefs(systemToolsStore)

// Computed properties
const totalSandboxTypes = computed(() => sandboxTypes.value.length)

const averageResourceUsage = computed(() => {
  if (totalInstanceCount.value === 0) return 0
  return Math.round((totalResourceUsage.value.cpu + totalResourceUsage.value.memory + totalResourceUsage.value.disk) / 3)
})

const resourceUsage = computed(() => ({
  cpu: totalResourceUsage.value.cpu,
  memory: totalResourceUsage.value.memory,
  disk: totalResourceUsage.value.disk,
}))
</script>
