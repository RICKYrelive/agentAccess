<template>
  <div class="h-full flex flex-col bg-slate-50 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
    <!-- Page Header -->
    <div class="px-8 py-10 relative">
      <!-- Background gradient effects -->
      <div class="absolute top-0 right-0 w-full h-[200px] bg-gradient-to-bl from-blue-50/80 via-cyan-50/50 to-transparent pointer-events-none"></div>

      <div class="relative z-10 flex items-start justify-between">
        <div class="max-w-2xl">
          <h1 class="text-4xl font-bold text-slate-900 tracking-tight mb-2">内置工具管理</h1>
          <p class="text-slate-500 text-lg">管理平台的内置工具和功能扩展，启用或禁用所需功能。</p>
        </div>

        <!-- Decorative Icons -->
        <div class="relative w-48 h-40 hidden lg:block">
          <div class="absolute -top-2 right-8 p-4 py-6 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-xl shadow-xl transform rotate-12 opacity-90">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div class="absolute top-12 right-24 p-3 py-4 bg-white rounded-lg shadow-lg border border-slate-100 transform -rotate-6">
            <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
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
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <!-- Total Tools Card -->
        <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-slate-600 font-medium">总工具数</p>
              <p class="text-2xl font-bold text-slate-900 mt-1">{{ totalToolCount }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Enabled Tools Card -->
        <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-slate-600 font-medium">已启用</p>
              <p class="text-2xl font-bold text-slate-900 mt-1">{{ enabledToolCount }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Disabled Tools Card -->
        <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-slate-600 font-medium">已禁用</p>
              <p class="text-2xl font-bold text-slate-900 mt-1">{{ disabledToolCount }}</p>
            </div>
            <div class="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="mb-4">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索内置工具..."
            class="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900"
          />
        </div>
      </div>

      <!-- Category Filter -->
      <div class="flex items-center space-x-2 mb-6 overflow-x-auto pb-2">
        <button
          @click="selectedCategory = null"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors',
            selectedCategory === null
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50',
          ]"
        >
          全部
        </button>
        <button
          v-for="category in categories"
          :key="category"
          @click="selectedCategory = category"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors',
            selectedCategory === category
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50',
          ]"
        >
          {{ category }}
        </button>
      </div>

      <!-- Tools List -->
      <div class="pb-10">
        <div v-if="filteredTools.length === 0" class="flex flex-col items-center justify-center py-16 text-slate-500">
          <svg class="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p class="text-lg font-medium mb-2">暂无内置工具</p>
          <p class="text-sm mb-4">从官方商店导入工具</p>
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

        <div v-else class="grid grid-cols-1 gap-4">
          <BuiltInToolCard
            v-for="tool in filteredTools"
            :key="tool.id"
            :tool="tool"
            @toggle-tool="handleToggleTool"
            @delete-tool="handleDeleteTool"
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
                <p class="text-sm text-slate-600 mt-1">浏览和导入内置工具</p>
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
                v-model="storeSearchQuery"
                type="text"
                placeholder="搜索商店中的内置工具..."
                class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900"
              />
            </div>
          </div>

          <!-- Store Items -->
          <div class="flex-1 overflow-y-auto p-4">
            <div class="space-y-2">
              <div
                v-for="item in allStoreTools"
                :key="item.id"
                class="flex items-center justify-between p-3 bg-white rounded-lg border transition-colors"
                :class="isItemInstalled(item.id) ? 'border-blue-200 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'"
              >
                <div class="flex items-center space-x-3 flex-1 min-w-0">
                  <div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                    {{ item.icon }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center space-x-2">
                      <h3 class="font-medium text-slate-900 truncate">{{ item.name }}</h3>
                      <span v-if="isItemInstalled(item.id)" class="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full flex-shrink-0">已导入</span>
                    </div>
                    <p class="text-sm text-slate-600 truncate">{{ item.description }}</p>
                    <div class="flex items-center space-x-2 mt-1">
                      <span class="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{{ item.category }}</span>
                      <span v-if="item.version" class="text-xs text-slate-500">v{{ item.version }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center space-x-2 flex-shrink-0 ml-3">
                  <button
                    v-if="isItemInstalled(item.id)"
                    @click="handleRemoveTool(item.id)"
                    class="px-3 py-1.5 text-red-600 hover:bg-red-50 text-sm rounded-lg transition-colors"
                    title="移除"
                  >
                    移除
                  </button>
                  <button
                    v-else
                    @click="handleImportFromStore(item.id)"
                    class="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>导入</span>
                  </button>
                </div>
              </div>
            </div>
            <div v-if="allStoreTools.length === 0" class="text-center py-8 text-slate-500">
              <p>未找到匹配的内置工具</p>
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
import BuiltInToolCard from './BuiltInToolCard.vue'

const systemToolsStore = useSystemToolsStore()
const { builtinTools, storeItems } = storeToRefs(systemToolsStore)
const { toggleBuiltInTool, importFromStore, isItemInstalled } = systemToolsStore

// Dialog state
const showStoreDialog = ref(false)
const searchQuery = ref('')
const storeSearchQuery = ref('')
const selectedCategory = ref<string | null>(null)

// Computed
const totalToolCount = computed(() => builtinTools.value.length)
const enabledToolCount = computed(() => builtinTools.value.filter(t => t.isEnabled).length)
const disabledToolCount = computed(() => builtinTools.value.filter(t => !t.isEnabled).length)

const categories = computed(() => {
  const cats = new Set(builtinTools.value.map(t => t.category))
  return Array.from(cats).sort()
})

const filteredTools = computed(() => {
  let tools = builtinTools.value
  if (selectedCategory.value) {
    tools = tools.filter(t => t.category === selectedCategory.value)
  }
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    tools = tools.filter(t =>
      t.name.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      t.category.toLowerCase().includes(query)
    )
  }
  return tools
})

const filteredStoreItems = computed(() => {
  return storeItems.value
    .filter(item => item.type === 'builtin-tool')
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

// All store tools (imported and available) for the store dialog
const allStoreTools = computed(() => {
  return storeItems.value
    .filter(item => item.type === 'builtin-tool')
    .filter(item => {
      if (!storeSearchQuery.value) return true
      const query = storeSearchQuery.value.toLowerCase()
      return (
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      )
    })
})

// Handlers
const handleToggleTool = (toolId: string) => {
  toggleBuiltInTool(toolId)
}

const handleDeleteTool = (toolId: string) => {
  if (confirm('确定要删除该内置工具吗？')) {
    // Find the store item and remove it
    const item = storeItems.value.find(i => i.type === 'builtin-tool' && builtinTools.value.find(t => t.id === toolId)?.name === i.name)
    if (item) {
      handleRemoveTool(item.id)
    }
  }
}

const handleRemoveTool = (itemId: string) => {
  const item = storeItems.value.find(i => i.id === itemId)
  if (!item) return

  // Find and remove the imported tool
  const index = builtinTools.value.findIndex(t => t.name === item.name)
  if (index !== -1) {
    builtinTools.value.splice(index, 1)
  }
}

const handleImportFromStore = (itemId: string) => {
  const result = importFromStore(itemId)
  if (result) {
    console.log('Imported:', result)
  } else {
    alert('该工具已导入')
  }
}
</script>
