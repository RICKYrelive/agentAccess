<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAccessTemplateStore, type AccessTemplate } from '@/stores/accessTemplate'
import TemplateCard from './TemplateCard.vue'
import CreateTemplateDialog from './CreateTemplateDialog.vue'

const store = useAccessTemplateStore()

// Tab state
const activeTab = ref<'personal' | 'team' | 'public'>('personal')

// Search state
const searchQuery = ref('')

// Dialog state
const showCreateDialog = ref(false)
const editingTemplate = ref<AccessTemplate | null>(null)
const templateToDelete = ref<AccessTemplate | null>(null)
const showDeleteConfirm = ref(false)
const showShareDialog = ref(false)
const sharingTemplate = ref<AccessTemplate | null>(null)

// Get templates based on active tab
const filteredTemplates = computed(() => {
  let templates: AccessTemplate[] = []

  switch (activeTab.value) {
    case 'personal':
      templates = store.personalTemplates
      break
    case 'team':
      templates = store.teamTemplates
      break
    case 'public':
      templates = store.publicTemplates
      break
  }

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    templates = templates.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query)
    )
  }

  return templates
})

const templateCount = computed(() => {
  return {
    personal: store.personalTemplates.length,
    team: store.teamTemplates.length,
    public: store.publicTemplates.length,
  }
})

// Template actions
const handleApply = (template: AccessTemplate) => {
  store.incrementUsage(template.id)
  // TODO: Emit event to apply template in ContentArea
  console.log('Apply template:', template)
}

const handleEdit = (template: AccessTemplate) => {
  editingTemplate.value = template
  showCreateDialog.value = true
}

const handleCopy = (template: AccessTemplate) => {
  const newTemplate = store.createTemplate({
    ...template,
    name: `Copy of ${template.name}`,
    permissions: {
      ...template.permissions,
      type: 'owner',
      owner: store.currentUserId,
      teamIds: undefined,
      userIds: undefined,
    },
  })
  console.log('Template copied:', newTemplate)
}

const handleDelete = (template: AccessTemplate) => {
  templateToDelete.value = template
  showDeleteConfirm.value = true
}

const confirmDelete = () => {
  if (templateToDelete.value) {
    store.deleteTemplate(templateToDelete.value.id)
    templateToDelete.value = null
  }
  showDeleteConfirm.value = false
}

const handleShare = (template: AccessTemplate) => {
  sharingTemplate.value = template
  showShareDialog.value = true
}

const handleCreateDialogSaved = (template: AccessTemplate) => {
  editingTemplate.value = null
  showCreateDialog.value = false
}

const handleCreateDialogClosed = () => {
  editingTemplate.value = null
  showCreateDialog.value = false
}
</script>

<template>
  <div class="h-full flex flex-col bg-gray-50">
    <!-- Header -->
    <div class="px-8 py-6 bg-white border-b border-gray-200">
      <h1 class="text-2xl font-bold text-gray-900">Access 模板管理</h1>
      <p class="text-sm text-gray-600 mt-1">
        管理您的 Access 配置模板，快速复用常用配置
      </p>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-hidden flex">
      <!-- Sidebar -->
      <div class="w-56 bg-white border-r border-gray-200 p-4">
        <nav class="space-y-1">
          <button
            @click="activeTab = 'personal'"
            :class="[
              'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              activeTab === 'personal'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100',
            ]"
          >
            <span>我的模板</span>
            <span
              v-if="templateCount.personal > 0"
              class="px-2 py-0.5 text-xs rounded-full"
              :class="
                activeTab === 'personal'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600'
              "
            >
              {{ templateCount.personal }}
            </span>
          </button>

          <button
            @click="activeTab = 'team'"
            :class="[
              'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              activeTab === 'team'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100',
            ]"
          >
            <span>团队模板</span>
            <span
              v-if="templateCount.team > 0"
              class="px-2 py-0.5 text-xs rounded-full"
              :class="
                activeTab === 'team'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600'
              "
            >
              {{ templateCount.team }}
            </span>
          </button>

          <button
            @click="activeTab = 'public'"
            :class="[
              'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              activeTab === 'public'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100',
            ]"
          >
            <span>公开模板</span>
            <span
              v-if="templateCount.public > 0"
              class="px-2 py-0.5 text-xs rounded-full"
              :class="
                activeTab === 'public'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600'
              "
            >
              {{ templateCount.public }}
            </span>
          </button>
        </nav>

        <!-- Create New Button -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <button
            @click="editingTemplate = null; showCreateDialog = true"
            class="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            创建新模板
          </button>
        </div>
      </div>

      <!-- Main Area -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Search Bar -->
        <div class="px-6 py-4 bg-white border-b border-gray-200">
          <div class="relative">
            <svg
              class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索模板名称或描述..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Template Grid -->
        <div class="flex-1 overflow-y-auto p-6">
          <!-- Empty State -->
          <div
            v-if="filteredTemplates.length === 0"
            class="flex flex-col items-center justify-center h-full text-gray-500"
          >
            <svg
              class="w-16 h-16 mb-4 text-gray-300"
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
            <p class="text-lg font-medium mb-2">
              {{ searchQuery ? '没有找到匹配的模板' : '暂无模板' }}
            </p>
            <p class="text-sm">
              {{ searchQuery ? '请尝试其他搜索关键词' : '点击"创建新模板"开始使用' }}
            </p>
          </div>

          <!-- Template Grid -->
          <div
            v-else
            class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            <TemplateCard
              v-for="template in filteredTemplates"
              :key="template.id"
              :template="template"
              :can-edit="store.canEditTemplate(template)"
              :can-copy="store.canCopyTemplate(template)"
              @apply="handleApply"
              @edit="handleEdit"
              @copy="handleCopy"
              @delete="handleDelete"
              @share="handleShare"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Dialog -->
    <CreateTemplateDialog
      v-model:open="showCreateDialog"
      :template="editingTemplate"
      @saved="handleCreateDialogSaved"
      @update:open="handleCreateDialogClosed"
    />

    <!-- Delete Confirmation Dialog -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="showDeleteConfirm = false"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">确认删除</h3>
        <p class="text-sm text-gray-600 mb-6">
          删除后无法恢复，是否确认删除模板「{{ templateToDelete?.name }}」？
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="showDeleteConfirm = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            @click="confirmDelete"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            确认删除
          </button>
        </div>
      </div>
    </div>

    <!-- Share Dialog Placeholder -->
    <div
      v-if="showShareDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="showShareDialog = false"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">分享设置</h3>
        <p class="text-sm text-gray-600 mb-4">
          模板「{{ sharingTemplate?.name }}」的分享设置
        </p>
        <div class="text-sm text-gray-500 mb-4">
          分享功能将在后续版本中完善
        </div>
        <div class="flex justify-end">
          <button
            @click="showShareDialog = false"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
