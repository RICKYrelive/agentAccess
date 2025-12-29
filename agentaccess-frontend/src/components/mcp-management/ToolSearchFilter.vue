<template>
  <div class="flex items-center gap-3">
    <!-- Filter Button -->
    <button
      @click="showFilterMenu = !showFilterMenu"
      class="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
      </svg>
      Filter
    </button>

    <!-- Filter Menu Dropdown -->
    <div v-if="showFilterMenu" class="absolute top-full mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-4 z-20 w-64" @click.stop>
      <div class="space-y-3">
        <!-- Type Filter -->
        <div>
          <label class="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Type</label>
          <select
            :value="store.typeFilter"
            @change="store.setTypeFilter(($event.target as HTMLSelectElement).value as typeof store.typeFilter)"
            class="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="builtin">Builtin</option>
            <option value="custom">REST API</option>
            <option value="database">Database</option>
            <option value="npx">Lambda (npx)</option>
            <option value="uvx">Lambda (uvx)</option>
          </select>
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Status</label>
          <select
            :value="store.statusFilter"
            @change="store.setStatusFilter(($event.target as HTMLSelectElement).value as typeof store.statusFilter)"
            class="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="error">Error</option>
            <option value="updating">Updating</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Search Input -->
    <div class="relative">
      <svg class="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        :value="store.searchQuery"
        @input="store.setSearchQuery(($event.target as HTMLInputElement).value)"
        type="text"
        placeholder="Search tools..."
        class="pl-9 pr-4 py-2 w-64 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white placeholder-slate-400"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useMCPManagementStore } from '@/stores/mcpManagement'

const store = useMCPManagementStore()
const showFilterMenu = ref(false)

const closeFilterMenu = () => {
  showFilterMenu.value = false
}

onMounted(() => {
  document.addEventListener('click', closeFilterMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeFilterMenu)
})
</script>
