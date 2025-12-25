<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4" @click.stop>
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">编辑知识库</h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            知识库名称 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            maxlength="100"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="请输入知识库名称"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            描述
          </label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            placeholder="请输入知识库描述（可选）"
          />
        </div>

        <!-- Type Info (Read-only) -->
        <div class="bg-gray-50 rounded-lg p-3">
          <div class="text-sm text-gray-600">
            <div class="flex items-center space-x-2 mb-1">
              <span class="font-medium">类型:</span>
              <span class="px-2 py-0.5 text-xs font-medium rounded-full" :class="typeBadgeClass">
                {{ typeLabel }}
              </span>
            </div>
            <div v-if="knowledgeBase.sourceInfo.fileName" class="mt-1">
              <span class="font-medium">文件:</span> {{ knowledgeBase.sourceInfo.fileName }}
            </div>
            <div v-if="knowledgeBase.sourceInfo.database" class="mt-1">
              <span class="font-medium">数据库:</span> {{ knowledgeBase.sourceInfo.database }}.{{ knowledgeBase.sourceInfo.table }}
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex space-x-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            :disabled="!isFormValid"
            class="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            保存
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { KnowledgeBase } from '@/types/knowledge-base'

interface Props {
  knowledgeBase: KnowledgeBase
}

interface Emits {
  (e: 'close'): void
  (e: 'submit', updates: { name: string; description: string }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const form = ref({
  name: '',
  description: ''
})

// Initialize form with knowledge base data
watch(() => props.knowledgeBase, (kb) => {
  if (kb) {
    form.value = {
      name: kb.name,
      description: kb.description
    }
  }
}, { immediate: true })

const typeLabel = computed(() => {
  const typeMap: Record<string, string> = {
    text: '文本',
    spreadsheet: '表格',
    database: '数据库'
  }
  return typeMap[props.knowledgeBase.type] || props.knowledgeBase.type
})

const typeBadgeClass = computed(() => {
  const classMap: Record<string, string> = {
    text: 'bg-green-100 text-green-700',
    spreadsheet: 'bg-blue-100 text-blue-700',
    database: 'bg-purple-100 text-purple-700'
  }
  return classMap[props.knowledgeBase.type] || 'bg-gray-100 text-gray-700'
})

const isFormValid = computed(() => {
  return form.value.name.trim() !== ''
})

const handleSubmit = () => {
  if (isFormValid.value) {
    emit('submit', {
      name: form.value.name.trim(),
      description: form.value.description.trim()
    })
  }
}
</script>
