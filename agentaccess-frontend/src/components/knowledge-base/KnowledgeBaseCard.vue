<template>
  <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between">
      <div class="flex-1 min-w-0">
        <div class="flex items-center space-x-2 mb-2">
          <h3 class="font-semibold text-gray-900 truncate">{{ knowledgeBase.name }}</h3>
          <span
            :class="[
              'px-2 py-0.5 text-xs font-medium rounded-full',
              typeBadgeClass
            ]"
          >
            {{ typeLabel }}
          </span>
        </div>
        <p v-if="knowledgeBase.description" class="text-sm text-gray-600 mb-2 line-clamp-2">
          {{ knowledgeBase.description }}
        </p>
        <div class="flex items-center space-x-4 text-xs text-gray-500">
          <span v-if="knowledgeBase.sourceInfo.fileName">
            文件: {{ knowledgeBase.sourceInfo.fileName }}
          </span>
          <span v-if="knowledgeBase.sourceInfo.database">
            数据库: {{ knowledgeBase.sourceInfo.database }}.{{ knowledgeBase.sourceInfo.table }}
          </span>
          <span>创建时间: {{ formatDate(knowledgeBase.createdAt) }}</span>
        </div>
      </div>
      <div class="flex space-x-2 ml-4 flex-shrink-0">
        <button
          @click="$emit('edit', knowledgeBase.id)"
          class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          title="编辑"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          @click="$emit('delete', knowledgeBase.id)"
          class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          title="删除"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { KnowledgeBase } from '@/types/knowledge-base'

interface Props {
  knowledgeBase: KnowledgeBase
}

interface Emits {
  (e: 'edit', id: string): void
  (e: 'delete', id: string): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

const typeLabel = computed(() => {
  const typeMap: Record<string, string> = {
    text: '文本',
    spreadsheet: '表格',
    database: '数据库'
  }
  return typeMap[props.knowledgeBase?.type] || props.knowledgeBase?.type || ''
})

const typeBadgeClass = computed(() => {
  const classMap: Record<string, string> = {
    text: 'bg-green-100 text-green-700',
    spreadsheet: 'bg-blue-100 text-blue-700',
    database: 'bg-purple-100 text-purple-700'
  }
  return classMap[props.knowledgeBase?.type] || 'bg-gray-100 text-gray-700'
})

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}
</script>
