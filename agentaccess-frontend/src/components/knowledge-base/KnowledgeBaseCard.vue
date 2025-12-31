<template>
  <div
    class="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
    @click="handleClick"
  >
    <div class="flex items-start justify-between">
      <div class="flex-1 min-w-0">
        <div class="flex items-center space-x-2 mb-2">
          <h3 class="font-semibold text-slate-900 truncate">{{ props.knowledgeBase.name }}</h3>
          <span :class="['px-2 py-0.5 text-xs font-medium rounded-full', typeBadgeClass]">
            {{ typeLabel }}
          </span>
          <!-- Read-only badge -->
          <span
            v-if="!props.canEdit && props.knowledgeBase.category === 'team'"
            class="px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-600"
          >
            只读
          </span>
        </div>

        <!-- Team badges -->
        <div
          v-if="props.knowledgeBase.sharedTeams && props.knowledgeBase.sharedTeams.length > 0"
          class="flex flex-wrap gap-1 mb-2"
        >
          <span
            v-for="team in displayTeams"
            :key="team.teamId"
            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700"
          >
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {{ team.teamName }}
          </span>
          <span
            v-if="props.knowledgeBase.sharedTeams.length > 3"
            class="text-xs text-slate-500"
            :title="props.knowledgeBase.sharedTeams.map(t => t.teamName).join(', ')"
          >
            +{{ props.knowledgeBase.sharedTeams.length - 3 }}
          </span>
        </div>
        <p v-if="props.knowledgeBase.description" class="text-sm text-slate-600 mb-2 line-clamp-2">
          {{ props.knowledgeBase.description }}
        </p>

        <!-- Sources List -->
        <div class="space-y-1">
          <!-- Text/Spreadsheet Files -->
          <div
            v-if="
              props.knowledgeBase.sourceInfo.files &&
              props.knowledgeBase.sourceInfo.files.length > 0
            "
            class="max-h-24 overflow-y-auto"
          >
            <p class="text-xs text-slate-500 mb-1">
              {{ props.knowledgeBase.sourceInfo.files.length }} 个文件:
            </p>
            <div
              v-for="file in displayFiles"
              :key="file.id"
              class="text-xs text-slate-600 flex items-center gap-1"
            >
              <svg
                class="w-3 h-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span class="truncate">{{ file.fileName }}</span>
              <span class="text-slate-400 flex-shrink-0">{{ formatSize(file.fileSize) }}</span>
            </div>
            <p v-if="props.knowledgeBase.sourceInfo.files.length > 5" class="text-xs text-slate-400">
              还有 {{ props.knowledgeBase.sourceInfo.files.length - 5 }} 个文件...
            </p>
          </div>

          <!-- Database Tables -->
          <div
            v-else-if="
              props.knowledgeBase.sourceInfo.tables &&
              props.knowledgeBase.sourceInfo.tables.length > 0
            "
            class="max-h-24 overflow-y-auto"
          >
            <p class="text-xs text-slate-500 mb-1">
              {{ props.knowledgeBase.sourceInfo.tables.length }} 个表:
            </p>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="table in displayTables"
                :key="table"
                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700"
              >
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                  />
                </svg>
                {{ table }}
              </span>
            </div>
            <p
              v-if="props.knowledgeBase.sourceInfo.tables.length > 5"
              class="text-xs text-slate-400 mt-1"
            >
              还有 {{ props.knowledgeBase.sourceInfo.tables.length - 5 }} 个表...
            </p>
          </div>

          <!-- Legacy Single File Display -->
          <div v-else-if="props.knowledgeBase.sourceInfo.fileName" class="text-xs text-slate-600">
            文件: {{ props.knowledgeBase.sourceInfo.fileName }}
          </div>

          <!-- Legacy Single Table Display -->
          <div v-else-if="props.knowledgeBase.sourceInfo.table" class="text-xs text-slate-600">
            表: {{ props.knowledgeBase.sourceInfo.table }}
          </div>
        </div>

        <p class="text-xs text-slate-400 mt-2">
          创建时间: {{ formatDate(props.knowledgeBase.createdAt) }}
        </p>
      </div>
      <div class="flex space-x-2 ml-4 flex-shrink-0">
        <button
          v-if="props.canEdit"
          @click.stop="$emit('edit', props.knowledgeBase.id)"
          class="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          title="编辑"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
        <button
          v-if="props.canEdit"
          @click.stop="$emit('delete', props.knowledgeBase.id)"
          class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          title="删除"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { KnowledgeBase, FileInfo } from '@/types/knowledge-base'

interface Props {
  knowledgeBase: KnowledgeBase
  canEdit?: boolean
}

interface Emits {
  (e: 'edit', id: string): void
  (e: 'delete', id: string): void
  (e: 'view', id: string): void
}

const props = withDefaults(defineProps<Props>(), {
  canEdit: true,
})
const emit = defineEmits<Emits>()

const handleClick = () => {
  emit('view', props.knowledgeBase.id)
}

const displayFiles = computed(() => {
  const files = props.knowledgeBase.sourceInfo.files
  return files ? files.slice(0, 5) : []
})

const displayTables = computed(() => {
  const tables = props.knowledgeBase.sourceInfo.tables
  return tables ? tables.slice(0, 5) : []
})

const displayTeams = computed(() => {
  const teams = props.knowledgeBase.sharedTeams
  return teams ? teams.slice(0, 3) : []
})

const typeLabel = computed(() => {
  const typeMap: Record<string, string> = {
    text: '文本',
    spreadsheet: '表格',
    database: '数据库',
  }
  return typeMap[props.knowledgeBase?.type] || props.knowledgeBase?.type || ''
})

const typeBadgeClass = computed(() => {
  const classMap: Record<string, string> = {
    text: 'bg-green-100 text-green-700',
    spreadsheet: 'bg-blue-100 text-blue-700',
    database: 'bg-purple-100 text-purple-700',
  }
  return classMap[props.knowledgeBase?.type] || 'bg-slate-100 text-slate-700'
})

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}
</script>
