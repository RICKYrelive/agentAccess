<template>
  <div class="space-y-4 max-h-[400px] overflow-y-auto pr-2">
    <!-- Memory Type Selection -->
    <div>
      <h4 class="text-sm font-medium text-gray-900 mb-3">选择记忆体类型</h4>
      <div class="space-y-3">
        <label
          v-for="option in memoryOptions"
          :key="option.id"
          :class="[
            'flex items-center justify-between p-3 bg-white rounded-lg border cursor-pointer transition-colors',
            localSelectedMemory === option.id
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:bg-gray-50',
          ]"
          @click="updateSelectedMemory(option.id)"
        >
          <div class="flex items-center space-x-3 flex-1">
            <div :class="['w-10 h-10 rounded-lg flex items-center justify-center', option.iconBg]">
              <svg :class="['w-5 h-5', option.iconColor]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path :d="option.icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
              </svg>
            </div>
            <div class="flex-1">
              <div class="flex items-center space-x-2">
                <input
                  type="radio"
                  :id="'memory-' + option.id"
                  :value="option.id"
                  :checked="localSelectedMemory === option.id"
                  @change="updateSelectedMemory(option.id)"
                  class="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <label :for="'memory-' + option.id" class="text-sm font-medium text-gray-900 cursor-pointer">
                  {{ option.name }}
                </label>
              </div>
              <div class="text-xs text-gray-500 ml-6">{{ option.description }}</div>
            </div>
          </div>
          <div class="text-xs font-medium" :class="localSelectedMemory === option.id ? 'text-primary-600' : 'text-gray-500'">
            {{ option.size }}
          </div>
        </label>
      </div>
    </div>

    <!-- Memory Stats -->
    <div v-if="localSelectedMemory" class="bg-gray-50 rounded-lg p-3 border border-gray-200">
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <div class="text-xs text-gray-500 mb-1">已用条数</div>
          <div class="text-sm font-semibold text-gray-900">128 / 1000</div>
        </div>
        <div>
          <div class="text-xs text-gray-500 mb-1">存储大小</div>
          <div class="text-sm font-semibold text-gray-900">2.3 MB</div>
        </div>
        <div>
          <div class="text-xs text-gray-500 mb-1">向量数量</div>
          <div class="text-sm font-semibold text-gray-900">156</div>
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
      <span>添加记忆体</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

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

// Local state for the selected memory
const localSelectedMemory = ref(props.selectedMemory || 'short-term')

// Watch prop changes
watch(() => props.selectedMemory, (newValue) => {
  localSelectedMemory.value = newValue || 'short-term'
})

// Emit update when selection changes
const updateSelectedMemory = (value: string) => {
  localSelectedMemory.value = value
  emit('update:selectedMemory', value)
}

const goToMemoryPage = () => {
  emit('go-to-memory')
}

const memoryOptions = [
  {
    id: 'short-term',
    name: '短期记忆',
    description: '临时存储对话上下文',
    size: '128 条',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.707.293H19a2 2 0 012 2v7a2 2 0 01-2 2h-2a1 1 0 01-1-1v-3.586a1 1 0 01-.293-.707l-5.414-5.414A1 1 0 018.586 2H7a2 2 0 00-2 2v10a2 2 0 002 2z',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    id: 'long-term',
    name: '长期记忆',
    description: '持久化存储重要信息',
    size: '2.3 MB',
    icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0-5c0 2.21-3.582 4-8 4s-8-1.79-8-4m0 0C4 6 8 4 8 4',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    id: 'vector',
    name: '向量记忆',
    description: '语义检索相似内容',
    size: '156 个向量',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
]
</script>
