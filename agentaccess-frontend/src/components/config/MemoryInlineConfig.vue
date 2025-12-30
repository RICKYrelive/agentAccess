<template>
  <div class="space-y-4 max-h-[550px] overflow-y-auto pr-2">
    <!-- Search Bar -->
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索记忆体..."
        class="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      />
      <svg class="absolute left-3 top-2.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>

    <!-- Memory Selection -->
    <div>
      <h4 class="text-sm font-medium text-slate-900 mb-3">选择记忆体</h4>
      <div class="space-y-3">
        <!-- None option -->
        <label
          :class="[
            'flex items-center justify-between p-3 bg-white rounded-lg border cursor-pointer transition-colors',
            localSelectedMemory === ''
              ? 'border-primary-500 bg-primary-50'
              : 'border-slate-200 hover:bg-slate-50',
          ]"
          @click="updateSelectedMemory('')"
        >
          <div class="flex items-center space-x-3 flex-1">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-100">
              <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <div class="flex-1">
              <div class="flex items-center space-x-2">
                <input
                  type="radio"
                  id="memory-none"
                  value=""
                  :checked="localSelectedMemory === ''"
                  @change="updateSelectedMemory('')"
                  class="w-4 h-4 text-primary-600 focus:ring-primary-500 border-slate-300"
                />
                <label for="memory-none" class="text-sm font-medium text-slate-900 cursor-pointer">
                  不使用记忆体
                </label>
              </div>
              <div class="text-xs text-slate-500 ml-6">本次对话不使用长期记忆</div>
            </div>
          </div>
        </label>

        <!-- Memory bases from store -->
        <label
          v-for="base in filteredMemoryBases"
          :key="base.id"
          :class="[
            'flex items-center justify-between p-3 bg-white rounded-lg border cursor-pointer transition-colors',
            localSelectedMemory === base.id
              ? 'border-primary-500 bg-primary-50'
              : 'border-slate-200 hover:bg-slate-50',
          ]"
          @click="updateSelectedMemory(base.id)"
        >
          <div class="flex items-center space-x-3 flex-1">
            <div :class="['w-10 h-10 rounded-lg flex items-center justify-center', getStrategyIconBg(base.strategy.type)]">
              <svg :class="['w-5 h-5', getStrategyIconColor(base.strategy.type)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path :d="getStrategyIcon(base.strategy.type)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
              </svg>
            </div>
            <div class="flex-1">
              <div class="flex items-center space-x-2">
                <input
                  type="radio"
                  :id="'memory-' + base.id"
                  :value="base.id"
                  :checked="localSelectedMemory === base.id"
                  @change="updateSelectedMemory(base.id)"
                  class="w-4 h-4 text-primary-600 focus:ring-primary-500 border-slate-300"
                />
                <label :for="'memory-' + base.id" class="text-sm font-medium text-slate-900 cursor-pointer">
                  {{ base.name }}
                </label>
                <span
                  class="text-xs px-1.5 py-0.5 rounded-full"
                  :class="base.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'"
                >
                  {{ getStrategyTypeName(base.strategy.type) }}
                </span>
              </div>
              <div class="text-xs text-slate-500 ml-6">{{ base.description }}</div>
            </div>
          </div>
          <div class="text-xs font-medium" :class="localSelectedMemory === base.id ? 'text-primary-600' : 'text-slate-500'">
            {{ base.memoryCount }} 条记忆
          </div>
        </label>
      </div>

      <!-- Empty state -->
      <div v-if="filteredMemoryBases.length === 0" class="text-center py-6 text-slate-500 text-sm">
        {{ searchQuery ? '没有找到匹配的记忆体' : '暂无可用的记忆体，请先创建' }}
      </div>
    </div>

    <!-- Selected Memory Stats -->
    <div v-if="selectedMemoryBase" class="bg-slate-50 rounded-lg p-3 border border-slate-200">
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <div class="text-xs text-slate-500 mb-1">记忆数量</div>
          <div class="text-sm font-semibold text-slate-900">{{ selectedMemoryBase.memoryCount }}</div>
        </div>
        <div>
          <div class="text-xs text-slate-500 mb-1">策略类型</div>
          <div class="text-sm font-semibold text-slate-900">{{ getStrategyTypeName(selectedMemoryBase.strategy.type) }}</div>
        </div>
        <div>
          <div class="text-xs text-slate-500 mb-1">最大记忆数</div>
          <div class="text-sm font-semibold text-slate-900">{{ selectedMemoryBase.strategy.config.maxMemories }}</div>
        </div>
      </div>
    </div>

    <!-- Add Memory Button -->
    <button
      @click="goToMemoryPage"
      class="w-full px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-md border border-purple-200 flex items-center justify-center space-x-2"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      <span>管理记忆体</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useMemoryStore } from '@/stores/memory'
import type { MemoryStrategyType } from '@/components/memory-management/types'

interface Props {
  selectedMemory?: string
}

interface Emits {
  (e: 'update:selectedMemory', value: string): void
  (e: 'go-to-memory'): void
}

const props = withDefaults(defineProps<Props>(), {
  selectedMemory: '',
})

const emit = defineEmits<Emits>()
const memoryStore = useMemoryStore()

// Search state
const searchQuery = ref('')

// Get active memory bases
const activeMemoryBases = computed(() =>
  memoryStore.memoryBases.filter(base => base.status === 'active')
)

// Filter memory bases by search query
const filteredMemoryBases = computed(() => {
  if (!searchQuery.value) return activeMemoryBases.value
  const query = searchQuery.value.toLowerCase()
  return activeMemoryBases.value.filter(base =>
    base.name.toLowerCase().includes(query) ||
    base.description.toLowerCase().includes(query)
  )
})

// Get selected memory base
const selectedMemoryBase = computed(() =>
  localSelectedMemory.value
    ? memoryStore.getMemoryBase(localSelectedMemory.value)
    : null
)

// Local state for the selected memory
const localSelectedMemory = ref(props.selectedMemory || '')

// Watch prop changes
watch(() => props.selectedMemory, (newValue) => {
  localSelectedMemory.value = newValue || ''
})

// Emit update when selection changes
const updateSelectedMemory = (value: string) => {
  localSelectedMemory.value = value
  emit('update:selectedMemory', value)
}

const goToMemoryPage = () => {
  emit('go-to-memory')
}

// Strategy type helpers
const getStrategyTypeName = (type: MemoryStrategyType): string => {
  switch (type) {
    case 'summarization':
      return '摘要策略'
    case 'user-preferences':
      return '用户偏好'
    case 'custom-prompt':
      return '自定义提示'
    default:
      return '未知'
  }
}

const getStrategyIcon = (type: MemoryStrategyType): string => {
  switch (type) {
    case 'summarization':
      return 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.707.293H19a2 2 0 012 2v7a2 2 0 01-2 2h-2a1 1 0 01-1-1v-3.586a1 1 0 01-.293-.707l-5.414-5.414A1 1 0 018.586 2H7a2 2 0 00-2 2v10a2 2 0 002 2z'
    case 'user-preferences':
      return 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    case 'custom-prompt':
      return 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
    default:
      return 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
  }
}

const getStrategyIconBg = (type: MemoryStrategyType): string => {
  switch (type) {
    case 'summarization':
      return 'bg-blue-100'
    case 'user-preferences':
      return 'bg-green-100'
    case 'custom-prompt':
      return 'bg-purple-100'
    default:
      return 'bg-slate-100'
  }
}

const getStrategyIconColor = (type: MemoryStrategyType): string => {
  switch (type) {
    case 'summarization':
      return 'text-blue-600'
    case 'user-preferences':
      return 'text-green-600'
    case 'custom-prompt':
      return 'text-purple-600'
    default:
      return 'text-slate-600'
  }
}
</script>
