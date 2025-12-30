<template>
  <div class="h-full flex flex-col bg-slate-50 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
    <!-- Page Header -->
    <div class="px-8 py-10 relative">
      <!-- Background gradient effects -->
      <div class="absolute top-0 right-0 w-full h-[200px] bg-gradient-to-bl from-indigo-50/80 via-purple-50/50 to-transparent pointer-events-none"></div>

      <div class="relative z-10 flex items-start justify-between">
        <div class="max-w-2xl">
          <h1 class="text-4xl font-bold text-slate-900 tracking-tight mb-2">记忆体</h1>
          <p class="text-slate-500 text-lg">管理长期记忆存储，基于 mem0 实现智能记忆检索和召回。</p>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center space-x-3">
          <button
            @click="showImportExportDialog = true"
            class="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all flex items-center space-x-2 shadow-sm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>导入记忆体</span>
          </button>
          <button
            @click="openCreateDialog"
            class="px-4 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-all flex items-center space-x-2 shadow-lg shadow-primary-500/30"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>创建记忆体</span>
          </button>
        </div>

        <!-- Decorative Icons -->
        <div class="relative w-48 h-40 hidden lg:block">
          <div class="absolute -top-2 right-8 p-4 py-6 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-xl shadow-xl transform rotate-12 opacity-90">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="absolute top-12 right-24 p-3 py-4 bg-white rounded-lg shadow-lg border border-slate-100 transform -rotate-6">
            <svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Overview Cards -->
    <div class="px-8 flex-1">
      <MemoryStatusCards />

      <!-- Memory Bases List Header -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-slate-900">记忆体列表</h2>
        <span class="text-sm text-slate-500">{{ store.memoryBases.length }} 个记忆体</span>
      </div>

      <!-- Memory Base Cards Grid -->
      <div v-if="store.memoryBases.length > 0" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-10">
        <MemoryCard
          v-for="memoryBase in store.memoryBases"
          :key="memoryBase.id"
          :memory-base="memoryBase"
          @edit-memory="openEditDialog"
          @delete-memory="handleDeleteMemory"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-slate-900 mb-2">还没有创建任何记忆体</h3>
        <p class="text-slate-500 mb-6">创建记忆体来存储和检索长期记忆，提升 AI 的上下文理解能力。</p>
        <button
          @click="openCreateDialog"
          class="px-6 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-all inline-flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>创建第一个记忆体</span>
        </button>
      </div>
    </div>

    <!-- Create/Edit Dialog -->
    <CreateMemoryBaseDialog
      v-if="showCreateDialog"
      :memory-base="editingMemoryBase"
      @close="closeDialog"
    />

    <!-- Import/Export Dialog -->
    <ImportExportDialog
      v-if="showImportExportDialog"
      @close="showImportExportDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMemoryStore } from '@/stores/memory'
import MemoryStatusCards from './MemoryStatusCards.vue'
import MemoryCard from './MemoryCard.vue'
import CreateMemoryBaseDialog from './CreateMemoryBaseDialog.vue'
import ImportExportDialog from './ImportExportDialog.vue'
import type { MemoryBase } from './types'

const store = useMemoryStore()

const showCreateDialog = ref(false)
const showImportExportDialog = ref(false)
const editingMemoryBase = ref<MemoryBase | undefined>(undefined)

const openCreateDialog = () => {
  editingMemoryBase.value = undefined
  showCreateDialog.value = true
}

const openEditDialog = (memoryBaseId: string) => {
  const base = store.getMemoryBase(memoryBaseId)
  if (base) {
    editingMemoryBase.value = base
    showCreateDialog.value = true
  }
}

const closeDialog = () => {
  showCreateDialog.value = false
  editingMemoryBase.value = undefined
}

const handleDeleteMemory = (memoryBaseId: string) => {
  store.deleteMemoryBase(memoryBaseId)
}
</script>
