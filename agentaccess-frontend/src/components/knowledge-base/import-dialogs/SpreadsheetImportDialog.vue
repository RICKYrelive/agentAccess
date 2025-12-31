<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col" @click.stop>
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-slate-200">
        <h2 class="text-xl font-semibold text-slate-900">导入表格知识库</h2>
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

      <!-- Form with scrollable content -->
      <div class="flex-1 overflow-y-auto p-6">
        <form @submit.prevent="handleSubmit" class="space-y-4">
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
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入知识库名称"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1"> 描述 </label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="请输入知识库描述（可选）"
          />
        </div>

        <!-- File Upload -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">
            上传文件 <span class="text-red-500">*</span>
          </label>
          <div
            class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:border-blue-400 transition-colors"
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
                  class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                >
                  <span>选择文件</span>
                  <input
                    id="file-upload"
                    ref="fileInput"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    multiple
                    @change="handleFileChange"
                    class="sr-only"
                  />
                </label>
                <p class="pl-1">或拖拽文件到此处</p>
              </div>
              <p class="text-xs text-slate-500">
                支持 Excel, CSV 格式，单个文件最大 50MB，最多 50 个文件
              </p>
              <p v-if="form.files.length > 0" class="text-sm text-blue-600 font-medium">
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

        <!-- Has Header Row -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1"> 首行作为标题 </label>
          <div class="flex space-x-4">
            <label class="flex items-center">
              <input
                v-model="form.hasHeader"
                :value="true"
                type="radio"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-slate-700">是</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="form.hasHeader"
                :value="false"
                type="radio"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-slate-700">否</span>
            </label>
          </div>
        </div>

        <!-- Encoding (for CSV) -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1"> 文件编码 </label>
          <select
            v-model="form.encoding"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="UTF-8">UTF-8</option>
            <option value="GBK">GBK</option>
            <option value="GB2312">GB2312</option>
          </select>
          <p class="mt-1 text-xs text-slate-500">仅对 CSV 文件有效</p>
        </div>

        <!-- Category Selection -->
        <div class="border-t border-slate-200 pt-4">
          <h3 class="text-sm font-semibold text-slate-900 mb-3">共享设置</h3>

          <!-- Category -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-slate-700 mb-2">知识库分类</label>
            <div class="flex gap-3">
              <label
                :class="[
                  'flex items-center px-4 py-2 border rounded-lg cursor-pointer transition-colors',
                  form.category === 'personal'
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'border-slate-200 hover:bg-slate-50',
                ]"
              >
                <input
                  v-model="form.category"
                  type="radio"
                  value="personal"
                  class="sr-only"
                />
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                个人知识库
              </label>
              <label
                :class="[
                  'flex items-center px-4 py-2 border rounded-lg cursor-pointer transition-colors',
                  form.category === 'team'
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'border-slate-200 hover:bg-slate-50',
                ]"
              >
                <input
                  v-model="form.category"
                  type="radio"
                  value="team"
                  class="sr-only"
                />
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                团队知识库
              </label>
            </div>
          </div>

          <!-- Team Sharing (only show when team category) -->
          <div v-if="form.category === 'team'" class="space-y-3">
            <!-- Team Search -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">选择团队</label>
              <input
                v-model="teamSearch"
                type="text"
                placeholder="搜索团队..."
                class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Team List -->
            <div class="max-h-40 overflow-y-auto border border-slate-200 rounded-lg">
              <label
                v-for="team in filteredTeams"
                :key="team.id"
                class="flex items-center justify-between p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer"
              >
                <div class="flex items-center">
                  <input
                    :checked="isTeamSelected(team.id)"
                    @change="toggleTeam(team.id)"
                    type="checkbox"
                    class="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-3 text-sm text-slate-700">{{ team.name }}</span>
                </div>
                <!-- Permission selector for selected teams -->
                <select
                  v-if="isTeamSelected(team.id)"
                  :value="getTeamPermission(team.id)"
                  @change="setTeamPermission(team.id, $event)"
                  class="ml-3 text-xs border border-slate-200 rounded px-2 py-1"
                >
                  <option value="read">只读</option>
                  <option value="write">可编辑</option>
                </select>
              </label>
              <p v-if="filteredTeams.length === 0" class="text-sm text-slate-500 text-center py-4">
                未找到匹配的团队
              </p>
            </div>

            <p v-if="selectedTeams.size === 0" class="text-xs text-slate-500">
              至少需要选择一个团队
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex space-x-3 pt-4 border-t border-slate-200">
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
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            导入
          </button>
        </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useKnowledgeBaseStore } from '@/stores/knowledgeBase'
import type { SpreadsheetImportForm, TeamSharingPermission, KnowledgeBaseCategory } from '@/types/knowledge-base'

interface Emits {
  (e: 'close'): void
  (e: 'submit', form: SpreadsheetImportForm): void
}

const emit = defineEmits<Emits>()
const store = useKnowledgeBaseStore()

const form = ref<SpreadsheetImportForm>({
  name: '',
  description: '',
  files: [],
  hasHeader: true,
  encoding: 'UTF-8',
  category: 'personal' as KnowledgeBaseCategory,
})

const errors = ref<Record<string, string>>({})
const fileInput = ref<HTMLInputElement | null>(null)
const teamSearch = ref('')
const selectedTeams = ref<Map<string, TeamSharingPermission>>(new Map())

// Mock teams data (same as in EditKnowledgeBaseDialog)
const mockTeams = [
  { id: 'team-dev', name: '开发团队' },
  { id: 'team-product', name: '产品团队' },
  { id: 'team-design', name: '设计团队' },
  { id: 'team-marketing', name: '市场团队' },
  { id: 'team-sales', name: '销售团队' },
]

// Filtered teams based on search
const filteredTeams = computed(() => {
  if (!teamSearch.value) return mockTeams
  const search = teamSearch.value.toLowerCase()
  return mockTeams.filter(team => team.name.toLowerCase().includes(search))
})

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

      // Validate file size (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        errors.value.file = `文件 ${file.name} 超过 50MB 限制`
        return
      }

      // Validate file type
      const validExtensions = ['.xlsx', '.xls', '.csv']
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
      if (!validExtensions.includes(fileExtension)) {
        errors.value.file = `文件 ${file.name} 格式不支持，请上传 Excel 或 CSV 文件`
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

  // Reset input
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

const isTeamSelected = (teamId: string) => {
  return selectedTeams.value.has(teamId)
}

const toggleTeam = (teamId: string) => {
  if (selectedTeams.value.has(teamId)) {
    selectedTeams.value.delete(teamId)
  } else {
    selectedTeams.value.set(teamId, 'read')
  }
}

const getTeamPermission = (teamId: string): TeamSharingPermission => {
  return selectedTeams.value.get(teamId) || 'read'
}

const setTeamPermission = (teamId: string, event: Event) => {
  const select = event.target as HTMLSelectElement
  selectedTeams.value.set(teamId, select.value as TeamSharingPermission)
}

const isFormValid = computed(() => {
  const hasValidName = form.value.name.trim() !== ''
  const hasValidFiles = form.value.files.length > 0
  const hasValidTeams = form.value.category === 'personal' || selectedTeams.value.size > 0
  return hasValidName && hasValidFiles && hasValidTeams
})

const handleSubmit = () => {
  if (!isFormValid.value) return

  const submitForm: SpreadsheetImportForm = { ...form.value }

  // Add sharing settings if team category
  if (form.value.category === 'team' && selectedTeams.value.size > 0) {
    submitForm.permission = 'team'
    submitForm.sharedTeams = Array.from(selectedTeams.value.entries()).map(([teamId, permission]) => {
      const team = mockTeams.find(t => t.id === teamId)!
      return {
        teamId,
        teamName: team.name,
        permission,
        addedAt: new Date(),
        addedBy: store.CURRENT_USER_ID,
      }
    })
  } else {
    submitForm.permission = 'owner'
    submitForm.sharedTeams = []
  }

  emit('submit', submitForm)
}
</script>
