<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <!-- Dialog Header -->
      <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <h2 class="text-xl font-semibold text-slate-900">{{ title }}</h2>
        <button
          @click="$emit('close')"
          class="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Dialog Body -->
      <div class="p-6 space-y-5">
        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">
            记忆库名称 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.name"
            type="text"
            placeholder="例如：对话总结库"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            :class="{ 'border-red-300': errors.name }"
          />
          <p v-if="errors.name" class="mt-1 text-xs text-red-600">{{ errors.name }}</p>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">描述</label>
          <textarea
            v-model="formData.description"
            placeholder="简要描述这个记忆库的用途..."
            rows="3"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
          ></textarea>
        </div>

        <!-- Strategy Type -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            记忆策略 <span class="text-red-500">*</span>
          </label>
          <div class="space-y-2">
            <label
              v-for="config in strategyConfigs"
              :key="config.type"
              class="flex items-start p-3 border rounded-lg cursor-pointer transition-colors"
              :class="formData.strategy.type === config.type
                ? 'border-primary-500 bg-primary-50'
                : 'border-slate-200 hover:border-slate-300'"
            >
              <input
                v-model="formData.strategy.type"
                type="radio"
                :value="config.type"
                class="mt-0.5 mr-3"
              />
              <div class="flex-1">
                <div class="flex items-center space-x-2">
                  <span class="text-xl">{{ config.icon }}</span>
                  <span class="font-medium text-slate-900">{{ config.name }}</span>
                </div>
                <p class="text-sm text-slate-600 mt-0.5">{{ config.description }}</p>
              </div>
            </label>
          </div>
          <p v-if="errors.strategy" class="mt-1 text-xs text-red-600">{{ errors.strategy }}</p>
        </div>

        <!-- Custom Prompt (for custom-prompt strategy) -->
        <div v-if="formData.strategy.type === 'custom-prompt'">
          <label class="block text-sm font-medium text-slate-700 mb-1.5">
            自定义提示 <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="formData.strategy.prompt"
            placeholder="输入自定义的记忆提取提示..."
            rows="3"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none font-mono text-sm"
            :class="{ 'border-red-300': errors.prompt }"
          ></textarea>
          <p v-if="errors.prompt" class="mt-1 text-xs text-red-600">{{ errors.prompt }}</p>
        </div>

        <!-- Strategy Config -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">最大检索数</label>
            <input
              v-model.number="formData.strategy.config.maxMemories"
              type="number"
              min="1"
              max="100"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">相似度阈值</label>
            <div class="relative">
              <input
                v-model.number="formData.strategy.config.similarityThreshold"
                type="number"
                min="0"
                max="1"
                step="0.05"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all pr-8"
              />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                {{ Math.round(formData.strategy.config.similarityThreshold * 100) }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Dialog Footer -->
      <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
        >
          取消
        </button>
        <button
          @click="handleSubmit"
          class="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
        >
          {{ submitButtonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { MEMORY_STRATEGY_CONFIGS } from './types'
import type { MemoryStrategy, MemoryBase, MemoryStrategyType } from './types'
import { useMemoryStore } from '@/stores/memory'

interface Props {
  memoryBase?: MemoryBase
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const store = useMemoryStore()

const title = computed(() => props.memoryBase ? '编辑记忆库' : '创建记忆库')
const submitButtonText = computed(() => props.memoryBase ? '保存' : '创建')

const strategyConfigs = Object.entries(MEMORY_STRATEGY_CONFIGS).map(([type, config]) => ({
  type: type as MemoryStrategyType,
  icon: config.icon,
  name: config.name,
  description: config.description,
}))

const formData = reactive({
  name: '',
  description: '',
  strategy: {
    type: 'summarization' as MemoryStrategyType,
    prompt: '',
    config: {
      maxMemories: 10,
      similarityThreshold: 0.5,
    },
  } as MemoryStrategy,
})

const errors = reactive({
  name: '',
  strategy: '',
  prompt: '',
})

const validateForm = (): boolean => {
  // Reset errors
  errors.name = ''
  errors.strategy = ''
  errors.prompt = ''

  let isValid = true

  // Validate name
  if (!formData.name.trim()) {
    errors.name = '请输入记忆库名称'
    isValid = false
  }

  // Validate strategy
  if (!formData.strategy.type) {
    errors.strategy = '请选择记忆策略'
    isValid = false
  }

  // Validate custom prompt
  if (formData.strategy.type === 'custom-prompt' && !formData.strategy.prompt?.trim()) {
    errors.prompt = '请输入自定义提示'
    isValid = false
  }

  return isValid
}

const handleSubmit = () => {
  if (!validateForm()) return

  if (props.memoryBase) {
    // Update existing memory base
    store.updateMemoryBase(props.memoryBase.id, {
      name: formData.name,
      description: formData.description,
      strategy: { ...formData.strategy },
    })
  } else {
    // Create new memory base
    store.createMemoryBase({
      name: formData.name,
      description: formData.description,
      status: 'active',
      strategy: { ...formData.strategy },
    })
  }

  emit('close')
}

// Initialize form with existing data if editing
onMounted(() => {
  if (props.memoryBase) {
    formData.name = props.memoryBase.name
    formData.description = props.memoryBase.description
    formData.strategy = { ...props.memoryBase.strategy }
  } else {
    // Set default prompt for summarization
    formData.strategy.prompt = MEMORY_STRATEGY_CONFIGS.summarization.defaultPrompt || ''
  }
})
</script>
