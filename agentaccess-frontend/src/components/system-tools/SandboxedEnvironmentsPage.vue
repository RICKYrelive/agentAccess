<template>
  <div class="h-full flex flex-col bg-slate-50 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
    <!-- Page Header -->
    <div class="px-8 py-10 relative">
      <!-- Background gradient effects -->
      <div class="absolute top-0 right-0 w-full h-[200px] bg-gradient-to-bl from-purple-50/80 via-indigo-50/50 to-transparent pointer-events-none"></div>

      <div class="relative z-10 flex items-start justify-between">
        <div class="max-w-2xl">
          <h1 class="text-4xl font-bold text-slate-900 tracking-tight mb-2">沙箱环境管理</h1>
          <p class="text-slate-500 text-lg">管理不同类型的沙箱运行环境和实例，监控资源使用情况。</p>
        </div>

        <!-- Decorative Icons -->
        <div class="relative w-48 h-40 hidden lg:block">
          <div class="absolute -top-2 right-8 p-4 py-6 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-xl shadow-xl transform rotate-12 opacity-90">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div class="absolute top-12 right-24 p-3 py-4 bg-white rounded-lg shadow-lg border border-slate-100 transform -rotate-6">
            <svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="relative z-10 flex items-center space-x-3 mt-6">
        <button
          @click="showStoreDialog = true"
          class="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg shadow-blue-500/30 flex items-center space-x-2 font-medium"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span>从商店导入</span>
        </button>
      </div>
    </div>

    <!-- Status Overview Cards -->
    <div class="px-8 flex-1">
      <SandboxStatusCards />

      <!-- Sandbox Types List -->
      <div class="mt-8 pb-10">
        <div v-if="sandboxTypes.length === 0" class="flex flex-col items-center justify-center py-16 text-slate-500">
          <svg class="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p class="text-lg font-medium mb-2">暂无沙箱环境</p>
          <p class="text-sm mb-4">从官方商店导入沙箱</p>
          <button
            @click="showStoreDialog = true"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span>从商店导入</span>
          </button>
        </div>

        <div v-else class="grid grid-cols-1 gap-6">
          <SandboxCard
            v-for="sandbox in sandboxTypes"
            :key="sandbox.id"
            :sandbox="sandbox"
            @create-instance="handleCreateInstance"
            @start-instance="handleStartInstance"
            @stop-instance="handleStopInstance"
            @delete-instance="handleDeleteInstance"
            @edit-sandbox="handleEditSandbox"
            @delete-sandbox="handleDeleteSandbox"
          />
        </div>
      </div>
    </div>

    <!-- Official Store Dialog -->
    <Teleport to="body">
      <div v-if="showStoreDialog" class="fixed inset-0 flex items-center justify-center z-50" @click.self="showStoreDialog = false">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div class="relative bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden flex flex-col">
          <div class="p-6 border-b border-slate-200">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-xl font-semibold text-slate-900">官方商店</h2>
                <p class="text-sm text-slate-600 mt-1">浏览和导入沙箱环境</p>
              </div>
              <button
                @click="showStoreDialog = false"
                class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Search Bar -->
          <div class="p-4 border-b border-slate-200">
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索沙箱环境..."
                class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900"
              />
            </div>
          </div>

          <!-- Store Items -->
          <div class="flex-1 overflow-y-auto p-4">
            <div class="space-y-2">
              <div
                v-for="item in filteredStoreItems"
                :key="item.id"
                class="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-xl">
                    {{ item.icon }}
                  </div>
                  <div>
                    <h3 class="font-medium text-slate-900">{{ item.name }}</h3>
                    <p class="text-sm text-slate-600 line-clamp-1">{{ item.description }}</p>
                    <div class="flex items-center space-x-2 mt-1">
                      <span class="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{{ item.category }}</span>
                      <span v-if="item.version" class="text-xs text-slate-500">{{ item.version }}</span>
                    </div>
                  </div>
                </div>
                <button
                  v-if="!isItemInstalled(item.id)"
                  @click="handleImportFromStore(item.id)"
                  class="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>导入</span>
                </button>
                <span v-else class="text-sm text-green-600 flex items-center space-x-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>已导入</span>
                </span>
              </div>
            </div>
            <div v-if="filteredStoreItems.length === 0" class="text-center py-8 text-slate-500">
              <p>未找到匹配的沙箱环境</p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSystemToolsStore } from '@/stores/systemTools'
import SandboxStatusCards from './SandboxStatusCards.vue'
import SandboxCard from './SandboxCard.vue'

const systemToolsStore = useSystemToolsStore()
const { sandboxTypes, storeItems } = storeToRefs(systemToolsStore)
const { deleteSandboxType, createInstance, deleteInstance, importFromStore, isItemInstalled } = systemToolsStore

// Dialog state
const showStoreDialog = ref(false)
const searchQuery = ref('')

// Filtered store items (only sandbox types)
const filteredStoreItems = computed(() => {
  return storeItems.value
    .filter(item => item.type === 'sandbox')
    .filter(item => {
      if (!searchQuery.value) return true
      const query = searchQuery.value.toLowerCase()
      return (
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      )
    })
})

// Handlers
const handleCreateInstance = (sandboxTypeId: string) => {
  const instanceName = prompt('请输入实例名称:')
  if (instanceName) {
    createInstance(sandboxTypeId, { name: instanceName })
  }
}

const handleStartInstance = (instanceId: string) => {
  // TODO: Implement start instance logic
  console.log('Start instance:', instanceId)
}

const handleStopInstance = (instanceId: string) => {
  // TODO: Implement stop instance logic
  console.log('Stop instance:', instanceId)
}

const handleDeleteInstance = (instanceId: string) => {
  if (confirm('确定要删除该实例吗？')) {
    deleteInstance(instanceId)
  }
}

const handleEditSandbox = (sandboxId: string) => {
  // TODO: Implement edit sandbox dialog
  console.log('Edit sandbox:', sandboxId)
}

const handleDeleteSandbox = (sandboxId: string) => {
  deleteSandboxType(sandboxId)
}

const handleImportFromStore = (itemId: string) => {
  const result = importFromStore(itemId)
  if (result) {
    console.log('Imported:', result)
  } else {
    alert('该沙箱环境已导入')
  }
}
</script>
