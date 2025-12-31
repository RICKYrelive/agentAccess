<script setup lang="ts">
import { computed } from 'vue'

export interface StatisticsBadge {
  text: string
  type: 'success' | 'processing' | 'error'
}

interface Props {
  icon: string
  label: string
  value: string | number
  unit?: string
  badge?: StatisticsBadge
}

const props = withDefaults(defineProps<Props>(), {
  unit: '',
})

const badgeClasses = computed(() => {
  if (!props.badge) return ''

  const baseClass = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium '

  switch (props.badge.type) {
    case 'success':
      return baseClass + 'bg-emerald-100 text-emerald-700'
    case 'processing':
      return baseClass + 'bg-blue-100 text-blue-700'
    case 'error':
      return baseClass + 'bg-red-100 text-red-700'
    default:
      return ''
  }
})

const badgeDotColor = computed(() => {
  if (!props.badge) return ''

  switch (props.badge.type) {
    case 'success':
      return 'bg-emerald-500'
    case 'error':
      return 'bg-red-500'
    default:
      return ''
  }
})
</script>

<template>
  <div class="group relative bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:border-slate-300 transition-all duration-200 overflow-hidden">
    <!-- Decorative background element -->
    <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-slate-50 to-transparent rounded-bl-full opacity-50 group-hover:from-blue-50 group-hover:to-transparent transition-colors duration-200" />

    <div class="relative">
      <!-- Label with badge option -->
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <span class="material-symbols-rounded text-slate-400 text-xl">{{ icon }}</span>
          <span class="text-sm font-medium text-slate-600">{{ label }}</span>
        </div>
        <span v-if="badge" :class="badgeClasses">
          <span v-if="badgeDotColor" class="mr-1.5 h-1.5 w-1.5 rounded-full" :class="badgeDotColor" />
          {{ badge.text }}
        </span>
      </div>

      <!-- Value display -->
      <div class="flex items-baseline gap-2">
        <span class="text-3xl font-bold text-slate-900">{{ value }}</span>
        <span v-if="unit" class="text-sm text-slate-500">{{ unit }}</span>
      </div>
    </div>
  </div>
</template>
