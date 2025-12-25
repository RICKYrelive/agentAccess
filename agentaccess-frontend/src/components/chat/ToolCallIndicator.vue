<template>
  <div
    :class="[
      'tool-call-indicator',
      `tool-call-${toolCall.type}`,
      { 'tool-call-expanded': isExpanded },
    ]"
  >
    <!-- Collapsed State -->
    <div v-if="!isExpanded" class="tool-call-collapsed" @click="toggleExpand">
      <div class="tool-call-main">
        <!-- Logo Icon -->
        <div :class="['tool-logo', `tool-logo-${toolCall.type}`]">
          <!-- Agent Icon -->
          <svg
            v-if="toolCall.type === 'agent'"
            class="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <!-- MCP Icon -->
          <svg
            v-else-if="toolCall.type === 'mcp'"
            class="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102 1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
          <!-- Plugin Icon -->
          <svg
            v-else-if="toolCall.type === 'plugin'"
            class="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <!-- Knowledge Base Icon -->
          <svg
            v-else-if="toolCall.type === 'knowledge_base'"
            class="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5-1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C15.832 18.477 14.246 18 12.5 18s-3.332.477-4.5-1.253"
            />
          </svg>
        </div>

        <!-- Tool Info - name, status and description -->
        <div class="tool-info">
          <span class="tool-name">{{ toolCall.name }}</span>
          <span :class="['status-badge', `status-${toolCall.status}`, { 'status-running': toolCall.status === 'running' }]">
            {{ getStatusText() }}
          </span>
          <span class="tool-action-desc">{{ getDescription() }}</span>
        </div>
      </div>

      <!-- Right side: Duration and Expand Icon -->
      <div class="right-side-info">
        <span v-if="getDuration() > 0" class="duration-text">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {{ formatDuration(getDuration()) }}
        </span>
        <svg
          class="w-3.5 h-3.5 text-gray-400 expand-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>

    <!-- Expanded State -->
    <div v-else class="tool-call-expanded">
      <!-- Header (Click to Collapse) -->
      <div class="tool-call-header" @click="toggleExpand">
        <div class="tool-call-main">
          <!-- Logo Icon -->
          <div :class="['tool-logo', `tool-logo-${toolCall.type}`]">
            <!-- Agent Icon -->
            <svg
              v-if="toolCall.type === 'agent'"
              class="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <!-- MCP Icon -->
            <svg
              v-else-if="toolCall.type === 'mcp'"
              class="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102 1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            <!-- Plugin Icon -->
            <svg
              v-else-if="toolCall.type === 'plugin'"
              class="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <!-- Knowledge Base Icon -->
            <svg
              v-else-if="toolCall.type === 'knowledge_base'"
              class="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5-1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C15.832 18.477 14.246 18 12.5 18s-3.332.477-4.5-1.253"
              />
            </svg>
          </div>

          <!-- Tool Info -->
          <div class="tool-info">
            <span class="tool-name">{{ toolCall.name }}</span>
            <span :class="['status-badge', `status-${toolCall.status}`, { 'status-running': toolCall.status === 'running' }]">
              {{ getStatusText() }}
            </span>
            <span class="tool-action-desc">{{ getDescription() }}</span>
          </div>
        </div>

        <!-- Collapse Icon -->
        <svg
          class="w-3.5 h-3.5 text-gray-400 transform rotate-180 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      <!-- Expanded Details -->
      <div v-if="hasDetails" class="tool-call-details">
        <!-- Input -->
        <div v-if="toolCall.input" class="detail-section">
          <div class="detail-header">
            <svg
              class="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span class="detail-label">输入参数</span>
          </div>
          <pre class="detail-content">{{ formatDetail(toolCall.input) }}</pre>
        </div>

        <!-- Result -->
        <div v-if="toolCall.result" class="detail-section">
          <div class="detail-header">
            <svg
              class="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span class="detail-label">执行结果</span>
          </div>
          <pre class="detail-content">{{ formatDetail(toolCall.result) }}</pre>
        </div>

        <!-- Error -->
        <div v-if="toolCall.error" class="detail-section detail-error">
          <div class="detail-header">
            <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span class="detail-label">错误信息</span>
          </div>
          <span class="detail-content">{{ toolCall.error }}</span>
        </div>

        <!-- Timestamp Info -->
        <div v-if="toolCall.startTime" class="detail-section detail-time">
          <div class="time-info">
            <span>开始时间: {{ formatTime(toolCall.startTime) }}</span>
            <span v-if="toolCall.endTime">结束时间: {{ formatTime(toolCall.endTime) }}</span>
          </div>
        </div>
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
  return (
    props.toolCall.input || props.toolCall.result || props.toolCall.error || props.toolCall.endTime
  )
})

const getStatusText = () => {
  const statusMap: Record<string, string> = {
    pending: '等待中',
    running: '执行中',
    completed: '已完成',
    failed: '失败',
  }
  return statusMap[props.toolCall.status] || props.toolCall.status
}

const getTypeLabel = () => {
  const typeMap: Record<ToolCallType, string> = {
    agent: 'Agent',
    mcp: 'MCP服务',
    plugin: '系统插件',
    knowledge_base: '知识库',
  }
  return typeMap[props.toolCall.type] || props.toolCall.type
}

const getDescription = () => {
  // Generate a description based on tool type and input
  const { type, input, name } = props.toolCall

  if (type === 'agent') {
    return `调用 ${name} ${input?.task ? `执行${input.task}` : '处理任务'}`
  } else if (type === 'mcp') {
    return `使用 ${name} ${input?.query ? `查询: "${input.query}"` : '服务'}`
  } else if (type === 'plugin') {
    if (name.includes('代码执行')) {
      return '执行代码进行数据分析'
    } else if (name.includes('日历')) {
      return input?.action === 'create_reminder' ? '创建日历提醒' : '操作日历'
    } else if (name.includes('浏览器')) {
      return '使用浏览器沙箱进行网页操作'
    }
    return `使用${name}`
  } else if (type === 'knowledge_base') {
    return input?.query ? `检索知识库: "${input.query}"` : `从 ${name} 检索信息`
  }

  return '执行工具调用'
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

const formatDuration = (ms: number) => {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date)
}
</script>

<style scoped>
.tool-call-indicator {
  @apply my-2 rounded-xl border transition-all overflow-hidden;
  width: 100%;
}

/* Agent - Green Glass Effect */
.tool-call-agent {
  background: linear-gradient(
    135deg,
    rgba(34, 197, 94, 0.25) 0%,
    rgba(16, 185, 129, 0.35) 30%,
    rgba(5, 150, 105, 0.3) 70%,
    rgba(20, 184, 166, 0.25) 100%
  );
  border-color: rgba(34, 197, 94, 0.4);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.tool-call-agent .tool-logo-agent {
  background: linear-gradient(
    135deg,
    rgba(34, 197, 94, 0.95) 0%,
    rgba(16, 185, 129, 1) 50%,
    rgba(20, 184, 166, 0.95) 100%
  );
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow:
    0 8px 32px rgba(34, 197, 94, 0.4),
    inset 0 1px 1px rgba(255, 255, 255, 0.3),
    inset 0 -1px 1px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.tool-call-agent .status-badge {
  @apply bg-green-100/80 text-green-700 border border-green-200/50;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* MCP - Blue Glass Effect */
.tool-call-mcp {
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.15) 0%,
    rgba(99, 102, 241, 0.2) 50%,
    rgba(139, 92, 246, 0.15) 100%
  );
  border-color: rgba(59, 130, 246, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.tool-call-mcp .tool-logo-mcp {
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.9) 0%,
    rgba(99, 102, 241, 0.95) 50%,
    rgba(139, 92, 246, 0.9) 100%
  );
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow:
    0 8px 32px rgba(59, 130, 246, 0.3),
    inset 0 1px 1px rgba(255, 255, 255, 0.3),
    inset 0 -1px 1px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.tool-call-mcp .status-badge {
  @apply bg-blue-100/80 text-blue-700 border border-blue-200/50;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Plugin - Purple Glass Effect */
.tool-call-plugin {
  background: linear-gradient(
    135deg,
    rgba(168, 85, 247, 0.15) 0%,
    rgba(217, 70, 239, 0.2) 50%,
    rgba(236, 72, 153, 0.15) 100%
  );
  border-color: rgba(168, 85, 247, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.tool-call-plugin .tool-logo-plugin {
  background: linear-gradient(
    135deg,
    rgba(168, 85, 247, 0.9) 0%,
    rgba(217, 70, 239, 0.95) 50%,
    rgba(236, 72, 153, 0.9) 100%
  );
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow:
    0 8px 32px rgba(168, 85, 247, 0.3),
    inset 0 1px 1px rgba(255, 255, 255, 0.3),
    inset 0 -1px 1px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.tool-call-plugin .status-badge {
  @apply bg-purple-100/80 text-purple-700 border border-purple-200/50;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Knowledge Base - Orange Glass Effect */
.tool-call-knowledge_base {
  background: linear-gradient(
    135deg,
    rgba(249, 115, 22, 0.25) 0%,
    rgba(245, 158, 11, 0.35) 30%,
    rgba(234, 179, 8, 0.3) 70%,
    rgba(217, 119, 6, 0.25) 100%
  );
  border-color: rgba(249, 115, 22, 0.4);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.tool-call-knowledge_base .tool-logo-knowledge_base {
  background: linear-gradient(
    135deg,
    rgba(249, 115, 22, 0.95) 0%,
    rgba(245, 158, 11, 1) 50%,
    rgba(234, 179, 8, 0.95) 100%
  );
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow:
    0 8px 32px rgba(249, 115, 22, 0.4),
    inset 0 1px 1px rgba(255, 255, 255, 0.3),
    inset 0 -1px 1px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.tool-call-knowledge_base .status-badge {
  @apply bg-orange-100/80 text-orange-700 border border-orange-200/50;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Collapsed State */
.tool-call-collapsed {
  @apply px-3 py-2 cursor-pointer hover:shadow-sm transition-all;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tool-call-main {
  @apply flex items-center space-x-2;
  flex: 1;
  min-width: 0;
}

/* Logo Icon - Smaller */
.tool-logo {
  @apply w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 shadow-lg;
  position: relative;
  overflow: hidden;
}

.tool-logo::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.4) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 100%
  );
  pointer-events: none;
}

.tool-logo svg {
  @apply w-4 h-4 text-white drop-shadow-lg;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

/* Tool Info */
.tool-info {
  @apply flex items-center space-x-2;
  flex: 1;
  min-width: 0;
}

.tool-name {
  @apply text-sm font-medium text-gray-800;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tool-action-desc {
  @apply text-xs text-gray-500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 1;
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

/* Right side info - Duration and expand icon */
.right-side-info {
  @apply flex items-center space-x-2 flex-shrink-0;
}

.duration-text {
  @apply flex items-center space-x-1 text-xs text-gray-500;
}

.duration-text svg {
  @apply w-3 h-3;
}

.expand-icon {
  @apply flex-shrink-0;
}

/* Expanded State */
.tool-call-expanded {
  @apply overflow-hidden;
}

.tool-call-header {
  @apply px-3 py-2 cursor-pointer hover:shadow-sm transition-all;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tool-call-details {
  @apply px-4 pb-4 space-y-3;
}

.detail-section {
  @apply rounded-lg p-3 border;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-color: rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.detail-header {
  @apply flex items-center space-x-2 mb-2;
}

.detail-label {
  @apply text-xs font-semibold text-gray-700;
}

.detail-content {
  @apply text-xs text-gray-600 whitespace-pre-wrap break-words font-mono rounded p-2;
  background: rgba(249, 250, 251, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.detail-error {
  background: rgba(254, 226, 226, 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-color: rgba(239, 68, 68, 0.2);
}

.detail-error .detail-label {
  @apply text-red-700;
}

.detail-error .detail-content {
  @apply text-red-600;
  background: rgba(254, 226, 226, 0.6);
  border-color: rgba(239, 68, 68, 0.1);
}

.detail-time {
  @apply rounded-lg p-2 border;
  background: rgba(249, 250, 251, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-color: rgba(0, 0, 0, 0.05);
}

.time-info {
  @apply flex items-center space-x-4 text-xs text-gray-500;
}

/* Animations */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

/* Line clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Running State - Glowing Border Animation */
.tool-call-indicator {
  position: relative;
}

.tool-call-indicator::before {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 13px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: -1;
  /* Use mask to only show the border area */
  -webkit-mask:
    linear-gradient(#fff 0 0) padding-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

/* Running state glow effect - only border glow */
.tool-call-indicator:has(.status-running)::before {
  opacity: 1;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(59, 130, 246, 0.8) 20%,
    rgba(99, 102, 241, 0.95) 50%,
    rgba(59, 130, 246, 0.8) 80%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: glowFlow 2s linear infinite;
}

@keyframes glowFlow {
  0% {
    background-position: 200% 0;
    filter: brightness(0.8);
  }
  50% {
    filter: brightness(1.3);
  }
  100% {
    background-position: -200% 0;
    filter: brightness(0.8);
  }
}

/* Add pulsing effect to the glow */
@keyframes glowPulse {
  0%, 100% {
    box-shadow:
      0 0 12px rgba(59, 130, 246, 0.3),
      0 0 24px rgba(99, 102, 241, 0.2),
      inset 0 0 12px rgba(59, 130, 246, 0.1);
  }
  50% {
    box-shadow:
      0 0 18px rgba(59, 130, 246, 0.5),
      0 0 36px rgba(99, 102, 241, 0.3),
      inset 0 0 18px rgba(59, 130, 246, 0.2);
  }
}

.tool-call-indicator:has(.status-running) {
  animation: glowPulse 1.5s ease-in-out infinite;
}

/* Status badge animation when running - more subtle */
.status-running {
  animation: statusBadgePulse 2s ease-in-out infinite;
}

@keyframes statusBadgePulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.85;
  }
}
</style>
