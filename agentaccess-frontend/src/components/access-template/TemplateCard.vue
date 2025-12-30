<script setup lang="ts">
import { computed } from 'vue'
import type { AccessTemplate } from '@/stores/accessTemplate'

interface Props {
  template: AccessTemplate
  canEdit?: boolean
  canCopy?: boolean
}

interface Emits {
  (e: 'apply', template: AccessTemplate): void
  (e: 'edit', template: AccessTemplate): void
  (e: 'copy', template: AccessTemplate): void
  (e: 'delete', template: AccessTemplate): void
  (e: 'share', template: AccessTemplate): void
}

const props = withDefaults(defineProps<Props>(), {
  canEdit: false,
  canCopy: false,
})

const emit = defineEmits<Emits>()

// Format stats display
const usageCountText = computed(() => {
  return `已使用 ${props.template.stats.usageCount} 次`
})

const lastUsedText = computed(() => {
  if (!props.template.stats.lastUsedAt) return '从未使用'

  const now = new Date()
  const lastUsed = new Date(props.template.stats.lastUsedAt)
  const diffMs = now.getTime() - lastUsed.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return '刚刚'
  if (diffMins < 60) return `${diffMins} 分钟前`
  if (diffHours < 24) return `${diffHours} 小时前`
  if (diffDays < 7) return `${diffDays} 天前`
  return lastUsed.toLocaleDateString('zh-CN')
})

// Get category badge color
const categoryBadgeClass = computed(() => {
  switch (props.template.category) {
    case 'personal':
      return 'bg-blue-50 text-blue-600 border-blue-200'
    case 'team':
      return 'bg-purple-50 text-purple-600 border-purple-200'
    case 'public':
      return 'bg-green-50 text-green-600 border-green-200'
    default:
      return 'bg-gray-50 text-gray-600 border-gray-200'
  }
})

const categoryText = computed(() => {
  switch (props.template.category) {
    case 'personal':
      return '个人'
    case 'team':
      return '团队'
    case 'public':
      return '公开'
    default:
      return '未知'
  }
})

// Count configured items
const configSummary = computed(() => {
  const c = props.template.config
  const parts: string[] = []
  if (c.teamAgents.length > 0) parts.push(`${c.teamAgents.length} 个团队 Agent`)
  if (c.knowledgeBase) parts.push('1 个知识库')
  if (c.mcpTools && c.mcpTools.length > 0) parts.push(`${c.mcpTools.length} 个 MCP 工具`)
  if (c.systemTools && c.systemTools.length > 0) parts.push(`${c.systemTools.length} 个系统工具`)
  if (c.memory) parts.push('1 个记忆体')

  return parts.length > 0 ? parts.join(' · ') : '无配置'
})
</script>

<template>
  <div class="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
    <!-- Header: Name and Category -->
    <div class="flex items-start justify-between mb-3">
      <h3 class="text-base font-semibold text-gray-900 flex-1 pr-2">{{ template.name }}</h3>
      <span
        class="px-2 py-0.5 text-xs font-medium border rounded-full whitespace-nowrap"
        :class="categoryBadgeClass"
      >
        {{ categoryText }}
      </span>
    </div>

    <!-- Description -->
    <p class="text-sm text-gray-600 mb-4 line-clamp-2">{{ template.description }}</p>

    <!-- Config Summary -->
    <p class="text-xs text-gray-500 mb-3">{{ configSummary }}</p>

    <!-- Stats -->
    <div class="flex items-center text-xs text-gray-500 mb-4 space-x-3">
      <span>{{ usageCountText }}</span>
      <span>·</span>
      <span>{{ lastUsedText }}</span>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2 pt-3 border-t border-gray-100">
      <button
        @click="emit('apply', template)"
        class="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
      >
        应用
      </button>

      <button
        v-if="canCopy"
        @click="emit('copy', template)"
        class="px-3 py-1.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded transition-colors"
        title="复制为个人模板"
      >
        复制
      </button>

      <button
        @click="emit('share', template)"
        class="px-3 py-1.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded transition-colors"
        title="分享设置"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
      </button>

      <button
        v-if="canEdit"
        @click="emit('edit', template)"
        class="px-3 py-1.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded transition-colors"
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
        v-if="canEdit"
        @click="emit('delete', template)"
        class="px-3 py-1.5 border border-red-300 hover:bg-red-50 text-red-600 text-sm font-medium rounded transition-colors"
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
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
