<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAccessTemplateStore, type AccessTemplate } from '@/stores/accessTemplate'

// Format last used time
const formatLastUsed = (lastUsedAt: Date | undefined) => {
  if (!lastUsedAt) return '从未使用'

  const now = new Date()
  const lastUsed = new Date(lastUsedAt)
  const diffMs = now.getTime() - lastUsed.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return '刚刚'
  if (diffMins < 60) return `${diffMins} 分钟前`
  if (diffHours < 24) return `${diffHours} 小时前`
  if (diffDays < 7) return `${diffDays} 天前`
  return lastUsed.toLocaleDateString('zh-CN')
}

interface Props {
  open?: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'apply', template: AccessTemplate): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const store = useAccessTemplateStore()

// Tab state
const activeTab = ref<'personal' | 'team' | 'public'>('personal')

// Search state
const searchQuery = ref('')

// Get templates based on active tab
const filteredTemplates = computed(() => {
  return store.searchTemplates(searchQuery.value, activeTab.value)
})

// Apply template
const handleApply = (template: AccessTemplate) => {
  store.incrementUsage(template.id)
  emit('apply', template)
  emit('update:open', false)
}

// Get category badge color
const getCategoryBadgeClass = (category: string) => {
  switch (category) {
    case 'personal':
      return 'bg-blue-50 text-blue-600 border-blue-200'
    case 'team':
      return 'bg-purple-50 text-purple-600 border-purple-200'
    case 'public':
      return 'bg-green-50 text-green-600 border-green-200'
    default:
      return 'bg-gray-50 text-gray-600 border-gray-200'
  }
}

const getCategoryText = (category: string) => {
  switch (category) {
    case 'personal':
      return '个人'
    case 'team':
      return '团队'
    case 'public':
      return '公开'
    default:
      return '未知'
  }
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click.self="emit('update:open', false)"
  >
    <div
      class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
      @click.stop
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">应用模板</h2>
          <p class="text-sm text-gray-500 mt-0.5">选择一个模板快速配置 Access</p>
        </div>
        <button
          @click="emit('update:open', false)"
          class="text-gray-400 hover:text-gray-600 transition-colors"
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

      <!-- Tabs -->
      <div class="px-6 pt-4 border-b border-gray-200">
        <div class="flex gap-4">
          <button
            @click="activeTab = 'personal'"
            :class="[
              'px-3 py-2 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'personal'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900',
            ]"
          >
            我的模板
          </button>
          <button
            @click="activeTab = 'team'"
            :class="[
              'px-3 py-2 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'team'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900',
            ]"
          >
            团队模板
          </button>
          <button
            @click="activeTab = 'public'"
            :class="[
              'px-3 py-2 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'public'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900',
            ]"
          >
            公开模板
          </button>
        </div>
      </div>

      <!-- Search -->
      <div class="px-6 py-3 border-b border-gray-200">
        <div class="relative">
          <svg
            class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
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
            placeholder="搜索模板..."
            class="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- Template List -->
      <div class="flex-1 overflow-y-auto p-4">
        <!-- Empty State -->
        <div
          v-if="filteredTemplates.length === 0"
          class="flex flex-col items-center justify-center py-8 text-gray-500"
        >
          <svg
            class="w-12 h-12 mb-3 text-gray-300"
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
          <p class="text-sm">
            {{ searchQuery ? '没有找到匹配的模板' : '暂无模板' }}
          </p>
        </div>

        <!-- Template Items -->
        <div v-else class="space-y-2">
          <button
            v-for="template in filteredTemplates"
            :key="template.id"
            @click="handleApply(template)"
            class="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all group"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <!-- Name and Category -->
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                    {{ template.name }}
                  </h3>
                  <span
                    class="px-2 py-0.5 text-xs font-medium border rounded-full whitespace-nowrap"
                    :class="getCategoryBadgeClass(template.category)"
                  >
                    {{ getCategoryText(template.category) }}
                  </span>
                </div>

                <!-- Description -->
                <p class="text-xs text-gray-600 mb-2 line-clamp-2">
                  {{ template.description }}
                </p>

                <!-- Config Summary -->
                <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                  <span v-if="template.config.teamAgents.length > 0">
                    团队 Agent: {{ template.config.teamAgents.length }}
                  </span>
                  <span v-if="template.config.knowledgeBase">
                    知识库: 1
                  </span>
                  <span v-if="template.config.mcpTools?.length">
                    MCP 工具: {{ template.config.mcpTools.length }}
                  </span>
                  <span v-if="template.config.systemTools?.length">
                    系统工具: {{ template.config.systemTools.length }}
                  </span>
                  <span v-if="template.config.memory">
                    记忆体: 1
                  </span>
                </div>
              </div>

              <!-- Usage Stats -->
              <div class="ml-3 text-right">
                <p class="text-xs text-gray-500">
                  已使用 {{ template.stats.usageCount }} 次
                </p>
                <p v-if="template.stats.lastUsedAt" class="text-xs text-gray-400">
                  {{ formatLastUsed(template.stats.lastUsedAt) }}
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
        <p class="text-xs text-gray-500">
          应用模板后，您仍可以继续调整配置
        </p>
        <button
          @click="emit('update:open', false)"
          class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
