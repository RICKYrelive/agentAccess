<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
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

      <!-- Tabs -->
      <div class="px-6 pt-4 border-b border-slate-200">
        <div class="flex space-x-4">
          <button
            @click="activeTab = 'import'"
            class="pb-3 px-1 text-sm font-medium border-b-2 transition-colors"
            :class="activeTab === 'import'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'"
          >
            导入记忆库
          </button>
          <button
            @click="activeTab = 'export'"
            class="pb-3 px-1 text-sm font-medium border-b-2 transition-colors"
            :class="activeTab === 'export'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'"
          >
            导出记忆库
          </button>
        </div>
      </div>

      <!-- Dialog Body -->
      <div class="p-6 flex-1 overflow-y-auto">
        <!-- Import Tab -->
        <div v-if="activeTab === 'import'" class="space-y-4">
          <div class="text-center py-8">
            <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p class="text-slate-600 mb-2">选择要导入的记忆库 JSON 文件</p>
            <p class="text-sm text-slate-500">支持从本系统或其他 AgentAccess 实例导出的记忆库文件</p>
          </div>

          <div class="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors cursor-pointer" @click="triggerFileInput">
            <input
              ref="fileInputRef"
              type="file"
              accept=".json"
              class="hidden"
              @change="handleFileSelect"
            />
            <svg class="w-10 h-10 text-slate-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-sm text-slate-600 mb-1">点击选择文件或拖拽文件到此处</p>
            <p class="text-xs text-slate-400">仅支持 JSON 格式</p>
          </div>

          <!-- Selected file info -->
          <div v-if="selectedFile" class="bg-slate-50 rounded-lg p-3 flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <p class="text-sm font-medium text-slate-900">{{ selectedFile.name }}</p>
                <p class="text-xs text-slate-500">{{ formatFileSize(selectedFile.size) }}</p>
              </div>
            </div>
            <button
              @click="clearSelectedFile"
              class="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Import error message -->
          <div v-if="importError" class="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
            <svg class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm text-red-700">{{ importError }}</p>
          </div>
        </div>

        <!-- Export Tab -->
        <div v-else class="space-y-4">
          <p class="text-sm text-slate-600 mb-4">选择要导出的记忆库：</p>

          <div class="space-y-2 max-h-64 overflow-y-auto">
            <label
              v-for="base in store.memoryBases"
              :key="base.id"
              class="flex items-center p-3 border rounded-lg cursor-pointer transition-colors"
              :class="selectedExportBaseId === base.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-slate-200 hover:border-slate-300'"
            >
              <input
                v-model="selectedExportBaseId"
                type="radio"
                :value="base.id"
                class="mr-3"
              />
              <div class="flex-1">
                <div class="flex items-center space-x-2">
                  <span class="font-medium text-slate-900">{{ base.name }}</span>
                  <span
                    class="text-xs px-1.5 py-0.5 rounded-full"
                    :class="base.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-100 text-slate-600'"
                  >
                    {{ base.status === 'active' ? '运行中' : '已停用' }}
                  </span>
                </div>
                <p class="text-sm text-slate-600 line-clamp-1">{{ base.description }}</p>
                <p class="text-xs text-slate-500 mt-1">{{ base.memoryCount }} 条记忆</p>
              </div>
            </label>
          </div>

          <div v-if="store.memoryBases.length === 0" class="text-center py-8">
            <p class="text-slate-500">暂无可导出的记忆库</p>
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
          v-if="activeTab === 'import'"
          @click="handleImport"
          :disabled="!selectedFile || isImporting"
          class="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <svg v-if="isImporting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ isImporting ? '导入中...' : '导入' }}</span>
        </button>
        <button
          v-else
          @click="handleExport"
          :disabled="!selectedExportBaseId || isExporting"
          class="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <svg v-if="isExporting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ isExporting ? '导出中...' : '导出' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMemoryStore } from '@/stores/memory'
import type { MemoryExportData } from './types'

const emit = defineEmits<{
  close: []
}>()

const store = useMemoryStore()

const activeTab = ref<'import' | 'export'>('import')
const title = ref('导入/导出记忆库')

const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const selectedExportBaseId = ref<string>('')
const importError = ref<string>('')
const isImporting = ref(false)
const isExporting = ref(false)

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      importError.value = '请选择 JSON 格式的文件'
      return
    }
    selectedFile.value = file
    importError.value = ''
  }
}

const clearSelectedFile = () => {
  selectedFile.value = null
  importError.value = ''
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const handleImport = async () => {
  if (!selectedFile.value) return

  isImporting.value = true
  importError.value = ''

  try {
    const text = await selectedFile.value.text()
    const data: MemoryExportData = JSON.parse(text)

    // Validate structure
    if (!data.version || !data.memoryBase || !data.memories) {
      throw new Error('无效的记忆库文件格式')
    }

    // Import the memory base
    const result = store.importMemoryBase(data)

    // Show success/warning message
    if (result.wasDuplicate) {
      alert(`导入成功！\n\n注意：检测到重复的 UUID，已为记忆库生成新的 ID。`)
    } else {
      alert(`导入成功！\n\n已导入 "${result.base.name}"，包含 ${data.memories.length} 条记忆。`)
    }

    emit('close')
  } catch (err) {
    importError.value = err instanceof Error ? err.message : '导入失败，请检查文件格式'
  } finally {
    isImporting.value = false
  }
}

const handleExport = () => {
  if (!selectedExportBaseId.value) return

  isExporting.value = true

  try {
    const data = store.exportMemoryBase(selectedExportBaseId.value)
    if (!data) {
      alert('导出失败：找不到指定的记忆库')
      return
    }

    // Create and download file
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${data.memoryBase.name}-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    alert(`导出成功！\n\n已导出 "${data.memoryBase.name}"，包含 ${data.memories.length} 条记忆。`)
    emit('close')
  } catch (err) {
    alert('导出失败：' + (err instanceof Error ? err.message : '未知错误'))
  } finally {
    isExporting.value = false
  }
}
</script>
