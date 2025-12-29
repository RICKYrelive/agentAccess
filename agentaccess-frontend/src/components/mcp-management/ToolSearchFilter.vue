<template>
  <div class="space-y-3">
    <!-- Search Box -->
    <div class="relative">
      <input
        :model-value="searchQuery"
        @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
        type="text"
        placeholder="搜索工具名称或描述..."
        class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
      />
      <svg class="w-5 h-5 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-2">
      <!-- Type Filter -->
      <select
        :model-value="filterType"
        @change="$emit('update:filterType', ($event.target as HTMLSelectElement).value as MCPToolType | 'all')"
        class="px-3 py-1.5 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        <option value="all">全部类型</option>
        <option value="builtin">内置</option>
        <option value="custom">自定义</option>
        <option value="npx">npx</option>
        <option value="uvx">uvx</option>
      </select>

      <!-- Status Filter -->
      <select
        :model-value="filterStatus"
        @change="$emit('update:filterStatus', ($event.target as HTMLSelectElement).value as 'enabled' | 'disabled' | 'all')"
        class="px-3 py-1.5 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        <option value="all">全部状态</option>
        <option value="enabled">已启用</option>
        <option value="disabled">已禁用</option>
      </select>

      <!-- Category Filter -->
      <select
        :model-value="filterCategory"
        @change="$emit('update:filterCategory', ($event.target as HTMLSelectElement).value)"
        class="px-3 py-1.5 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        <option value="all">全部类别</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>

    <!-- Results Count -->
    <div class="text-xs text-slate-500">
      找到 {{ filteredCount }} 个工具
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MCPToolType } from '../types'

interface Props {
  searchQuery: string
  filterType: MCPToolType | 'all'
  filterStatus: 'enabled' | 'disabled' | 'all'
  filterCategory: string
  categories: string[]
  filteredCount: number
}

defineProps<Props>()

defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterType': [value: MCPToolType | 'all']
  'update:filterStatus': [value: 'enabled' | 'disabled' | 'all']
  'update:filterCategory': [value: string]
}>()
</script>
