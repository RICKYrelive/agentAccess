<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4" @click.stop>
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-slate-200">
        <h2 class="text-xl font-semibold text-slate-900">导入文本知识库</h2>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">
            知识库名称 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            maxlength="100"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="请输入知识库名称"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1"> 描述 </label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            placeholder="请输入知识库描述（可选）"
          />
        </div>

        <!-- File Upload -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">
            上传文件 <span class="text-red-500">*</span>
          </label>
          <div
            class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:border-green-400 transition-colors"
          >
            <div class="space-y-1 text-center">
              <svg
                class="mx-auto h-12 w-12 text-slate-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <div class="flex text-sm text-slate-600">
                <label
                  for="file-upload"
                  class="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none"
                >
                  <span>选择文件</span>
                  <input
                    id="file-upload"
                    ref="fileInput"
                    type="file"
                    accept=".pdf,.docx,.txt"
                    multiple
                    @change="handleFileChange"
                    class="sr-only"
                  />
                </label>
                <p class="pl-1">或拖拽文件到此处</p>
              </div>
              <p class="text-xs text-slate-500">
                支持 PDF, DOCX, TXT 格式，单个文件最大 10MB，最多 50 个文件
              </p>
              <p v-if="form.files.length > 0" class="text-sm text-green-600 font-medium">
                已选择: {{ form.files.length }} 个文件 ({{ formatSize(totalSize) }})
              </p>
            </div>
          </div>
          <p v-if="errors.file" class="mt-1 text-sm text-red-600">{{ errors.file }}</p>

          <!-- File List -->
          <div v-if="form.files.length > 0" class="mt-3 space-y-2 max-h-40 overflow-y-auto">
            <div
              v-for="(file, index) in form.files"
              :key="index"
              class="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg"
            >
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-slate-900 truncate">{{ file.name }}</p>
                <p class="text-xs text-slate-500">{{ formatSize(file.size) }}</p>
              </div>
              <button
                type="button"
                @click="removeFile(index)"
                class="ml-2 text-red-500 hover:text-red-700"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Encoding -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1"> 文件编码 </label>
          <select
            v-model="form.encoding"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="UTF-8">UTF-8</option>
            <option value="GBK">GBK</option>
            <option value="GB2312">GB2312</option>
          </select>
        </div>

        <!-- Language -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1"> 语言 </label>
          <select
            v-model="form.language"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="zh">中文</option>
            <option value="en">English</option>
          </select>
        </div>

        <!-- Actions -->
        <div class="flex space-x-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            :disabled="!isFormValid"
            class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            导入
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TextImportForm } from '@/types/knowledge-base'

interface Emits {
  (e: 'close'): void
  (e: 'submit', form: TextImportForm): void
}

const emit = defineEmits<Emits>()

const form = ref<TextImportForm>({
  name: '',
  description: '',
  files: [],
  encoding: 'UTF-8',
  language: 'zh',
})

const errors = ref<Record<string, string>>({})
const fileInput = ref<HTMLInputElement | null>(null)

const totalSize = computed(() => {
  return form.value.files.reduce((sum, file) => sum + file.size, 0)
})

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files) {
    // Check total file count
    if (form.value.files.length + files.length > 50) {
      errors.value.file = '最多只能上传 50 个文件'
      return
    }

    // Validate and add each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        errors.value.file = `文件 ${file.name} 超过 10MB 限制`
        return
      }

      // Validate file type
      const validExtensions = ['.pdf', '.docx', '.txt']
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
      if (!validExtensions.includes(fileExtension)) {
        errors.value.file = `文件 ${file.name} 格式不支持，请上传 PDF, DOCX 或 TXT 文件`
        return
      }

      // Check for duplicates
      if (form.value.files.some((f) => f.name === file.name)) {
        errors.value.file = `文件 ${file.name} 已存在`
        return
      }
    }

    errors.value.file = ''
    // Add all new files
    for (let i = 0; i < files.length; i++) {
      form.value.files.push(files[i])
    }
  }

  // Reset input so same files can be selected again if needed
  if (target) {
    target.value = ''
  }
}

const removeFile = (index: number) => {
  form.value.files.splice(index, 1)
}

const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const isFormValid = computed(() => {
  return form.value.name.trim() !== '' && form.value.files.length > 0
})

const handleSubmit = () => {
  if (isFormValid.value) {
    emit('submit', form.value)
  }
}
</script>
