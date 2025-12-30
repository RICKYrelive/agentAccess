<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
    <!-- Total Memories Card -->
    <div class="glass-panel p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-start justify-between mb-4">
        <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <span class="text-xs font-semibold text-slate-400 uppercase">总记忆数</span>
      </div>
      <div class="flex items-baseline gap-2">
        <span class="text-3xl font-bold text-slate-900">{{ store.totalMemoryCount }}</span>
        <span class="text-sm text-slate-500">条记忆</span>
      </div>
    </div>

    <!-- Active Memory Bases Card -->
    <div class="glass-panel p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-start justify-between mb-4">
        <div class="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <span class="text-xs font-semibold text-slate-400 uppercase">活动记忆库</span>
      </div>
      <div class="flex items-baseline gap-2">
        <span class="text-3xl font-bold text-slate-900">{{ store.activeMemoryBaseCount }}</span>
        <span class="text-sm text-slate-500">/ {{ store.memoryBases.length }} 个库</span>
      </div>
    </div>

    <!-- 1-Hour Recall Rate Card -->
    <div class="glass-panel p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div class="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent pointer-events-none"></div>
      <div class="relative z-10">
        <div class="flex items-start justify-between mb-4">
          <div class="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div class="text-right">
            <span class="text-xs font-semibold text-slate-400 uppercase block">1小时召回率</span>
            <span class="text-[10px] text-slate-400 flex items-center justify-end gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Live
            </span>
          </div>
        </div>
        <div class="flex items-center gap-2 mb-3">
          <span class="text-3xl font-bold text-slate-900">{{ store.currentRecallRate }}%</span>
          <span class="text-sm text-slate-500">平均召回率</span>
        </div>
        <!-- Mini Chart -->
        <div class="flex items-end gap-0.5 h-8">
          <div
            v-for="(point, index) in chartPoints"
            :key="index"
            class="flex-1 rounded-t transition-all"
            :class="getBarColor(point.recallRate)"
            :style="{ height: `${point.height}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMemoryStore } from '@/stores/memory'

const store = useMemoryStore()

// Compute chart bar heights and colors
const chartPoints = computed(() => {
  const data = store.recallRateChartData
  if (data.length === 0) return []

  const maxRate = 100
  return data.map(point => ({
    recallRate: point.recallRate,
    height: (point.recallRate / maxRate) * 100,
  }))
})

const getBarColor = (rate: number) => {
  if (rate >= 90) return 'bg-green-400'
  if (rate >= 75) return 'bg-green-300'
  if (rate >= 60) return 'bg-yellow-300'
  return 'bg-orange-300'
}
</script>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
