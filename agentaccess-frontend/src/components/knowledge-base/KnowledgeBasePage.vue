<template>
  <div class="h-full bg-white overflow-y-auto p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">知识库管理</h1>
    </div>

    <!-- Creation Section -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <!-- Text Import Button -->
      <button
        @click="openImportDialog('text')"
        class="bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 px-6 py-6 rounded-lg flex flex-col items-center justify-center space-y-3 transition-colors"
      >
        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span class="font-medium">文本导入</span>
        <span class="text-xs text-green-600">支持 Word, PDF, TXT</span>
      </button>

      <!-- Spreadsheet Import Button -->
      <button
        @click="openImportDialog('spreadsheet')"
        class="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 px-6 py-6 rounded-lg flex flex-col items-center justify-center space-y-3 transition-colors"
      >
        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <span class="font-medium">表格导入</span>
        <span class="text-xs text-blue-600">支持 Excel, CSV</span>
      </button>

      <!-- Database Import Button -->
      <button
        @click="openImportDialog('database')"
        class="bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 px-6 py-6 rounded-lg flex flex-col items-center justify-center space-y-3 transition-colors"
      >
        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
        <span class="font-medium">数据库导入</span>
        <span class="text-xs text-purple-600">支持 MySQL, PostgreSQL</span>
      </button>
    </div>

    <!-- Text Knowledge Bases Section -->
    <section class="mb-8">
      <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        文本知识库 ({{ textKnowledgeBases.length }})
      </h2>

      <!-- Empty state -->
      <div
        v-if="textKnowledgeBases.length === 0"
        class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200"
      >
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-gray-500 mb-2">还没有文本知识库</p>
        <button
          @click="openImportDialog('text')"
          class="text-green-600 hover:text-green-700 font-medium"
        >
          导入第一个文本知识库 →
        </button>
      </div>

      <!-- Knowledge base cards grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <KnowledgeBaseCard
          v-for="kb in textKnowledgeBases"
          :key="kb.id"
          :knowledge-base="kb"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>
    </section>

    <!-- Spreadsheet Knowledge Bases Section -->
    <section class="mb-8">
      <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        表格知识库 ({{ spreadsheetKnowledgeBases.length }})
      </h2>

      <!-- Empty state -->
      <div
        v-if="spreadsheetKnowledgeBases.length === 0"
        class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200"
      >
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <p class="text-gray-500 mb-2">还没有表格知识库</p>
        <button
          @click="openImportDialog('spreadsheet')"
          class="text-blue-600 hover:text-blue-700 font-medium"
        >
          导入第一个表格知识库 →
        </button>
      </div>

      <!-- Knowledge base cards grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <KnowledgeBaseCard
          v-for="kb in spreadsheetKnowledgeBases"
          :key="kb.id"
          :knowledge-base="kb"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>
    </section>

    <!-- Database Knowledge Bases Section -->
    <section class="mb-8">
      <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
        数据库知识库 ({{ databaseKnowledgeBases.length }})
      </h2>

      <!-- Empty state -->
      <div
        v-if="databaseKnowledgeBases.length === 0"
        class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200"
      >
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
        <p class="text-gray-500 mb-2">还没有数据库知识库</p>
        <button
          @click="openImportDialog('database')"
          class="text-purple-600 hover:text-purple-700 font-medium"
        >
          连接第一个数据库 →
        </button>
      </div>

      <!-- Knowledge base cards grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <KnowledgeBaseCard
          v-for="kb in databaseKnowledgeBases"
          :key="kb.id"
          :knowledge-base="kb"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>
    </section>

    <!-- Import Dialogs -->
    <TextImportDialog
      v-if="importDialogType === 'text'"
      @submit="handleImportSubmit"
      @close="closeImportDialog"
    />
    <SpreadsheetImportDialog
      v-if="importDialogType === 'spreadsheet'"
      @submit="handleImportSubmit"
      @close="closeImportDialog"
    />
    <DatabaseImportDialog
      v-if="importDialogType === 'database'"
      @submit="handleImportSubmit"
      @close="closeImportDialog"
    />

    <!-- Edit Dialog -->
    <EditKnowledgeBaseDialog
      v-if="editingKnowledgeBase"
      :knowledge-base="editingKnowledgeBase"
      @submit="handleEditSubmit"
      @close="closeEditDialog"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useKnowledgeBaseStore } from '@/stores/knowledgeBase'
import KnowledgeBaseCard from './KnowledgeBaseCard.vue'
import TextImportDialog from './import-dialogs/TextImportDialog.vue'
import SpreadsheetImportDialog from './import-dialogs/SpreadsheetImportDialog.vue'
import DatabaseImportDialog from './import-dialogs/DatabaseImportDialog.vue'
import EditKnowledgeBaseDialog from './EditKnowledgeBaseDialog.vue'
import type { KnowledgeBase, TextImportForm, SpreadsheetImportForm, DatabaseImportForm } from '@/types/knowledge-base'

const knowledgeBaseStore = useKnowledgeBaseStore()
const {
  textKnowledgeBases,
  spreadsheetKnowledgeBases,
  databaseKnowledgeBases
} = storeToRefs(knowledgeBaseStore)

const importDialogType = ref<'text' | 'spreadsheet' | 'database' | null>(null)
const editingKnowledgeBase = ref<KnowledgeBase | null>(null)

const openImportDialog = (type: 'text' | 'spreadsheet' | 'database') => {
  importDialogType.value = type
}

const closeImportDialog = () => {
  importDialogType.value = null
}

const handleImportSubmit = (form: TextImportForm | SpreadsheetImportForm | DatabaseImportForm) => {
  if (importDialogType.value === 'text') {
    knowledgeBaseStore.createFromTextImport(form as TextImportForm)
  } else if (importDialogType.value === 'spreadsheet') {
    knowledgeBaseStore.createFromSpreadsheetImport(form as SpreadsheetImportForm)
  } else if (importDialogType.value === 'database') {
    knowledgeBaseStore.createFromDatabaseImport(form as DatabaseImportForm)
  }
  closeImportDialog()
}

const handleEdit = (id: string) => {
  const kb = knowledgeBaseStore.knowledgeBases.find(k => k.id === id)
  if (kb) {
    editingKnowledgeBase.value = kb
  }
}

const closeEditDialog = () => {
  editingKnowledgeBase.value = null
}

const handleEditSubmit = (updates: { name: string; description: string }) => {
  if (editingKnowledgeBase.value) {
    knowledgeBaseStore.updateKnowledgeBase(editingKnowledgeBase.value.id, updates)
    closeEditDialog()
  }
}

const handleDelete = (id: string) => {
  if (confirm('确定要删除这个知识库吗？')) {
    knowledgeBaseStore.deleteKnowledgeBase(id)
  }
}
</script>
