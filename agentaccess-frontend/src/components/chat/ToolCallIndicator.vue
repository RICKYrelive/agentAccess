<template>
  <div
    :class="[
      'tool-call-indicator',
      `tool-call-${toolCall.type}`,
      { 'tool-call-expanded': isExpanded }
    ]"
    @click="toggleExpand"
  >
    <div class="tool-call-header">
      <div class="flex items-center space-x-2 flex-1">
        <span :class="`tool-icon tool-icon-${toolCall.type}`">
          <component :is="getIconComponent()" />
        </span>
        <span class="tool-name">{{ toolCall.name }}</span>
      </div>
      <span :class="`status-badge status-${toolCall.status}`">
        {{ getStatusText() }}
      </span>
      <svg
        v-if="hasDetails"
        :class="['expand-icon', { 'expanded': isExpanded }]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>

    <!-- Expanded Details -->
    <div v-if="isExpanded && hasDetails" class="tool-call-details">
      <!-- Input -->
      <div v-if="toolCall.input" class="detail-section">
        <span class="detail-label">输入:</span>
        <pre class="detail-content">{{ formatDetail(toolCall.input) }}</pre>
      </div>

      <!-- Result -->
      <div v-if="toolCall.result" class="detail-section">
        <span class="detail-label">结果:</span>
        <pre class="detail-content">{{ formatDetail(toolCall.result) }}</pre>
      </div>

      <!-- Error -->
      <div v-if="toolCall.error" class="detail-section detail-error">
        <span class="detail-label">错误:</span>
        <span class="detail-content">{{ toolCall.error }}</span>
      </div>

      <!-- Duration -->
      <div v-if="toolCall.endTime" class="detail-section">
        <span class="detail-label">耗时:</span>
        <span class="detail-content">{{ getDuration() }}ms</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ToolCall, ToolCallType } from '@/types/settings'

interface Props {
  toolCall: ToolCall
}

const props = defineProps<Props>()
const isExpanded = ref(false)

const hasDetails = computed(() => {
  return props.toolCall.input || props.toolCall.result || props.toolCall.error || props.toolCall.endTime
})

const getIconComponent = () => {
  const icons: Record<ToolCallType, any> = {
    agent: 'AgentIcon',
    mcp: 'MCPIcon',
    plugin: 'PluginIcon',
    knowledge_base: 'KnowledgeIcon'
  }
  return icons[props.toolCall.type] || 'DefaultIcon'
}

const getStatusText = () => {
  const statusMap: Record<string, string> = {
    pending: '等待中',
    running: '执行中',
    completed: '完成',
    failed: '失败'
  }
  return statusMap[props.toolCall.status] || props.toolCall.status
}

const toggleExpand = () => {
  if (hasDetails.value) {
    isExpanded.value = !isExpanded.value
  }
}

const formatDetail = (data: any): string => {
  if (typeof data === 'string') {
    return data
  }
  return JSON.stringify(data, null, 2)
}

const getDuration = () => {
  if (!props.toolCall.endTime) return 0
  return props.toolCall.endTime.getTime() - props.toolCall.startTime.getTime()
}
</script>

<script lang="ts">
// Icon components
const AgentIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  `
}

const MCPIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102 1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  `
}

const PluginIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100-4v-3a1 1 0 011-1H7a1 1 0 01-1-1V7a2 2 0 012-2z" />
    </svg>
  `
}

const KnowledgeIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5-1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C15.832 18.477 14.246 18 12.5 18s-3.332.477-4.5-1.253" />
    </svg>
  `
}

export default {
  components: {
    AgentIcon,
    MCPIcon,
    PluginIcon,
    KnowledgeIcon
  }
}
</script>

<style scoped>
.tool-call-indicator {
  @apply my-2 p-3 rounded-lg border cursor-pointer transition-all;
  max-width: 500px;
}

/* Agent - Green */
.tool-call-agent {
  @apply bg-green-50 border-green-200;
}
.tool-call-agent .tool-icon-agent {
  @apply text-green-600;
}
.tool-call-agent .status-badge {
  @apply bg-green-100 text-green-700;
}

/* MCP - Blue */
.tool-call-mcp {
  @apply bg-blue-50 border-blue-200;
}
.tool-call-mcp .tool-icon-mcp {
  @apply text-blue-600;
}
.tool-call-mcp .status-badge {
  @apply bg-blue-100 text-blue-700;
}

/* Plugin - Purple */
.tool-call-plugin {
  @apply bg-purple-50 border-purple-200;
}
.tool-call-plugin .tool-icon-plugin {
  @apply text-purple-600;
}
.tool-call-plugin .status-badge {
  @apply bg-purple-100 text-purple-700;
}

/* Knowledge Base - Orange */
.tool-call-knowledge_base {
  @apply bg-orange-50 border-orange-200;
}
.tool-call-knowledge_base .tool-icon-knowledge_base {
  @apply text-orange-600;
}
.tool-call-knowledge_base .status-badge {
  @apply bg-orange-100 text-orange-700;
}

.tool-call-header {
  @apply flex items-center justify-between;
}

.tool-icon {
  @apply w-4 h-4 flex-shrink-0;
}

.tool-name {
  @apply text-sm font-medium;
}

.status-badge {
  @apply px-2 py-0.5 text-xs font-medium rounded-full;
}

.status-running {
  @apply bg-blue-100 text-blue-700;
  animation: pulse 2s infinite;
}

.status-failed {
  @apply bg-red-100 text-red-700;
}

.expand-icon {
  @apply w-4 h-4 text-gray-400 transition-transform;
}

.expand-icon.expanded {
  @apply transform rotate-180;
}

.tool-call-details {
  @apply mt-3 pt-3 border-t border-gray-200 space-y-2;
}

.detail-section {
  @apply text-xs;
}

.detail-label {
  @apply font-medium text-gray-700;
}

.detail-content {
  @apply text-gray-600 whitespace-pre-wrap break-words;
}

.detail-error {
  @apply text-red-600;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
