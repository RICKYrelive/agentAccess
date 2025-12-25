<template>
  <div class="space-y-6">
    <!-- General Settings -->
    <section class="bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">基本设置</h3>
      <div class="space-y-4">
        <!-- Is Public -->
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-900">公开访问</p>
            <p class="text-xs text-gray-500">允许其他用户访问此知识库</p>
          </div>
          <button
            @click="togglePublic"
            :class="[
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              localConfig.settings.isPublic ? 'bg-blue-600' : 'bg-gray-200',
            ]"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                localConfig.settings.isPublic ? 'translate-x-5' : 'translate-x-0',
              ]"
            />
          </button>
        </div>

        <!-- Is Enabled -->
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-900">启用状态</p>
            <p class="text-xs text-gray-500">禁用后将无法在对话中使用此知识库</p>
          </div>
          <button
            @click="toggleEnabled"
            :class="[
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              localConfig.settings.isEnabled ? 'bg-green-600' : 'bg-gray-200',
            ]"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                localConfig.settings.isEnabled ? 'translate-x-5' : 'translate-x-0',
              ]"
            />
          </button>
        </div>

        <!-- Tags -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">标签</label>
          <div class="flex flex-wrap gap-2 mb-2">
            <span
              v-for="(tag, index) in localConfig.settings.tags"
              :key="index"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {{ tag }}
              <button @click="removeTag(index)" class="ml-1.5 text-blue-600 hover:text-blue-800">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </span>
          </div>
          <div class="flex space-x-2">
            <input
              v-model="newTag"
              type="text"
              @keyup.enter="addTag"
              class="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入标签名称"
            />
            <button
              @click="addTag"
              class="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              添加
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Chunking Settings (for text/spreadsheet) -->
    <section
      v-if="knowledgeBase.type === 'text' || knowledgeBase.type === 'spreadsheet'"
      class="bg-white rounded-lg border border-gray-200 p-6"
    >
      <h3 class="text-lg font-semibold text-gray-900 mb-4">分块设置</h3>
      <div class="space-y-4">
        <!-- Chunk Size -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            分块大小 (tokens): {{ localConfig.chunking?.chunkSize }}
          </label>
          <input
            v-model.number="localConfig.chunking!.chunkSize"
            type="range"
            min="128"
            max="2048"
            step="64"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>128</span>
            <span>2048</span>
          </div>
        </div>

        <!-- Chunk Overlap -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            分块重叠 (tokens): {{ localConfig.chunking?.chunkOverlap }}
          </label>
          <input
            v-model.number="localConfig.chunking!.chunkOverlap"
            type="range"
            min="0"
            max="512"
            step="10"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span>512</span>
          </div>
        </div>

        <!-- Spreadsheet-specific options -->
        <div
          v-if="knowledgeBase.type === 'spreadsheet'"
          class="space-y-4 pt-4 border-t border-gray-200"
        >
          <!-- Split By -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">分割方式</label>
            <div class="flex space-x-4">
              <label class="flex items-center">
                <input
                  v-model="localConfig.chunking!.splitBy"
                  type="radio"
                  value="row"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">按行分割</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="localConfig.chunking!.splitBy"
                  type="radio"
                  value="column"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">按列分割</span>
              </label>
            </div>
          </div>

          <!-- Has Header -->
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-900">包含表头</p>
              <p class="text-xs text-gray-500">第一行作为列名</p>
            </div>
            <button
              @click="localConfig.chunking!.hasHeader = !localConfig.chunking!.hasHeader"
              :class="[
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                localConfig.chunking?.hasHeader ? 'bg-blue-600' : 'bg-gray-200',
              ]"
            >
              <span
                :class="[
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                  localConfig.chunking?.hasHeader ? 'translate-x-5' : 'translate-x-0',
                ]"
              />
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Embedding Settings -->
    <section class="bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">向量化设置</h3>
      <div class="space-y-4">
        <!-- Enable Embedding -->
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-900">启用向量化</p>
            <p class="text-xs text-gray-500">将内容转换为向量以支持语义搜索</p>
          </div>
          <button
            @click="localConfig.embedding.enabled = !localConfig.embedding.enabled"
            :class="[
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              localConfig.embedding.enabled ? 'bg-green-600' : 'bg-gray-200',
            ]"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                localConfig.embedding.enabled ? 'translate-x-5' : 'translate-x-0',
              ]"
            />
          </button>
        </div>

        <!-- Model Selection -->
        <div v-if="localConfig.embedding.enabled">
          <label class="block text-sm font-medium text-gray-700 mb-1">Embedding 模型</label>
          <select
            v-model="localConfig.embedding.model"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="bge-large-zh">BGE Large ZH (中文)</option>
            <option value="bge-small-zh">BGE Small ZH (中文)</option>
            <option value="m3e-large">M3E Large (中文)</option>
            <option value="m3e-base">M3E Base (中文)</option>
            <option value="text-embedding-3-small">OpenAI text-embedding-3-small</option>
            <option value="text-embedding-3-large">OpenAI text-embedding-3-large</option>
            <option value="text-embedding-ada-002">OpenAI text-embedding-ada-002</option>
          </select>
          <p class="text-xs text-gray-500 mt-1">选择用于将文本转换为向量的模型</p>
        </div>
      </div>
    </section>

    <!-- ReRank Settings -->
    <section class="bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">重排序设置 (ReRank)</h3>
      <div class="space-y-4">
        <!-- Enable ReRank -->
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-900">启用 ReRank</p>
            <p class="text-xs text-gray-500">对搜索结果进行二次排序以提高准确性</p>
          </div>
          <button
            @click="localConfig.rerank.enabled = !localConfig.rerank.enabled"
            :class="[
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              localConfig.rerank.enabled ? 'bg-green-600' : 'bg-gray-200',
            ]"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                localConfig.rerank.enabled ? 'translate-x-5' : 'translate-x-0',
              ]"
            />
          </button>
        </div>

        <div v-if="localConfig.rerank.enabled" class="space-y-4">
          <!-- Model Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ReRank 模型</label>
            <select
              v-model="localConfig.rerank.model"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="bge-reranker-large">BGE Reranker Large</option>
              <option value="bge-reranker-base">BGE Reranker Base</option>
              <option value="cohere-rerank-v3">Cohere Rerank V3</option>
              <option value="jina-reranker-v1">Jina Reranker V1</option>
            </select>
          </div>

          <!-- Top K -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              返回结果数 (Top K): {{ localConfig.rerank.topK }}
            </label>
            <input
              v-model.number="localConfig.rerank.topK"
              type="range"
              min="1"
              max="20"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>1</span>
              <span>20</span>
            </div>
          </div>

          <!-- Score Threshold -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              相似度阈值: {{ (localConfig.rerank.scoreThreshold * 100).toFixed(0) }}%
            </label>
            <input
              v-model.number="localConfig.rerank.scoreThreshold"
              type="range"
              min="0"
              max="1"
              step="0.05"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
            <p class="text-xs text-gray-500 mt-1">低于此分数的结果将被过滤</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Database Sync Settings (for database type) -->
    <section
      v-if="knowledgeBase.type === 'database'"
      class="bg-white rounded-lg border border-gray-200 p-6"
    >
      <h3 class="text-lg font-semibold text-gray-900 mb-4">数据同步设置</h3>
      <div class="space-y-4">
        <!-- Sync Frequency -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">同步频率</label>
          <select
            v-model="localConfig.databaseSync!.frequency"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="realtime">实时同步</option>
            <option value="hourly">每小时同步</option>
            <option value="daily">每天同步</option>
            <option value="manual">手动同步</option>
          </select>
        </div>

        <!-- Max Rows Per Query -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            单次查询最大行数: {{ localConfig.databaseSync!.maxRowsPerQuery }}
          </label>
          <input
            v-model.number="localConfig.databaseSync!.maxRowsPerQuery"
            type="range"
            min="100"
            max="10000"
            step="100"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>100</span>
            <span>10000</span>
          </div>
        </div>

        <!-- Enable Cache -->
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-900">启用缓存</p>
            <p class="text-xs text-gray-500">缓存查询结果以提高性能</p>
          </div>
          <button
            @click="localConfig.databaseSync!.enableCache = !localConfig.databaseSync!.enableCache"
            :class="[
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              localConfig.databaseSync?.enableCache ? 'bg-green-600' : 'bg-gray-200',
            ]"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                localConfig.databaseSync?.enableCache ? 'translate-x-5' : 'translate-x-0',
              ]"
            />
          </button>
        </div>

        <!-- Last Sync Info -->
        <div v-if="localConfig.databaseSync?.lastSyncAt" class="p-3 bg-gray-50 rounded-lg">
          <p class="text-xs text-gray-600">
            上次同步: {{ formatDate(localConfig.databaseSync.lastSyncAt) }}
          </p>
        </div>
      </div>
    </section>

    <!-- Action Buttons -->
    <div class="flex space-x-3">
      <button
        @click="handleSave"
        class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        保存配置
      </button>
      <button
        @click="handleReset"
        class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
      >
        重置
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useKnowledgeBaseStore } from '@/stores/knowledgeBase'
import type { KnowledgeBase, KnowledgeBaseConfig } from '@/types/knowledge-base'

// Deep clone utility
const deepClone = <T,>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}

interface Props {
  knowledgeBase: KnowledgeBase
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const knowledgeBaseStore = useKnowledgeBaseStore()
const newTag = ref('')

// Local reactive copy of the config
const localConfig = reactive<KnowledgeBaseConfig>(deepClone(props.knowledgeBase.config))

// Watch for prop changes to reset local config
watch(
  () => props.knowledgeBase,
  (kb) => {
    Object.assign(localConfig, deepClone(kb.config))
  },
  { deep: true },
)

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

const togglePublic = () => {
  localConfig.settings.isPublic = !localConfig.settings.isPublic
}

const toggleEnabled = () => {
  localConfig.settings.isEnabled = !localConfig.settings.isEnabled
}

const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !localConfig.settings.tags.includes(tag)) {
    localConfig.settings.tags.push(tag)
    newTag.value = ''
  }
}

const removeTag = (index: number) => {
  localConfig.settings.tags.splice(index, 1)
}

const handleSave = () => {
  knowledgeBaseStore.updateKnowledgeBaseConfig(props.knowledgeBase.id, localConfig)
  emit('close')
}

const handleReset = () => {
  Object.assign(localConfig, deepClone(props.knowledgeBase.config))
}
</script>
