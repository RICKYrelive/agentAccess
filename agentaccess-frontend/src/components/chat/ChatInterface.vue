<template>
  <div class="h-full flex flex-col bg-white">
    <!-- Chat Header -->
    <div class="px-6 py-4 border-b border-slate-200">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-semibold text-slate-900">Access 会话</h3>
        <button
          @click="clearConversation"
          class="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md"
          title="清空 Access 会话"
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
      <div class="flex items-center space-x-2">
        <div class="text-sm text-slate-500">
          {{ currentConversation?.title || '发起 Access' }}
        </div>

        <!-- Debug Info -->
        <div class="text-xs bg-slate-100 px-2 py-1 rounded">
          Loading: {{ isLoading ? '是' : '否' }}
        </div>
      </div>

      <!-- Tool Tags -->
      <ConversationTags
        v-if="currentConversation"
        :settings="currentConversation.settings"
        class="mt-2"
      />
    </div>

    <!-- Chat Messages -->
    <div
      class="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 hover:scrollbar-thumb-slate-400"
    >
      <!-- Render messages -->
      <template v-for="(message, index) in currentMessages" :key="message.id">
        <!-- User message (simple rendering) -->
        <div v-if="message.role === 'user'" class="flex justify-end">
          <div class="max-w-3xl px-4 py-3 rounded-lg bg-primary-600 text-white">
            <div class="whitespace-pre-wrap break-words">{{ message.content }}</div>
            <div v-if="message.timestamp" class="text-xs mt-2 text-primary-200">
              {{ formatTime(message.timestamp) }}
            </div>
          </div>
        </div>

        <!-- Assistant message with blocks -->
        <div v-else class="flex flex-col space-y-3 items-start max-w-3xl">
          <!-- Render blocks if available -->
          <template v-if="message.blocks && message.blocks.length > 0">
            <template
              v-for="(block, blockIndex) in message.blocks"
              :key="`block-${index}-${blockIndex}`"
            >
              <!-- Reasoning Block -->
              <div v-if="block.type === 'reasoning'" class="w-full">
                <div
                  v-if="!isBlockExpanded(index, blockIndex)"
                  class="reasoning-compact cursor-pointer hover:shadow-sm transition-all"
                  @click="toggleBlockExpansion(index, blockIndex)"
                >
                  <div class="flex items-center space-x-2">
                    <div class="reasoning-icon">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </div>
                    <span class="font-medium text-sm">思维过程</span>
                  </div>
                  <div class="flex items-center space-x-1 text-xs text-blue-600">
                    <span>展开</span>
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                <div
                  v-else
                  class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-900 px-4 py-3 rounded-lg shadow-sm"
                >
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center space-x-2">
                      <div class="reasoning-icon">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                      </div>
                      <div class="text-sm font-medium text-blue-700">思维过程</div>
                    </div>
                    <button
                      @click="toggleBlockExpansion(index, blockIndex)"
                      class="text-xs text-blue-600 hover:text-blue-800 underline flex items-center space-x-1"
                    >
                      <span>收起</span>
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    </button>
                  </div>
                  <div class="whitespace-pre-wrap break-words text-sm">{{ block.content }}</div>
                </div>
              </div>

              <!-- Text Block -->
              <div v-else-if="block.type === 'text'" class="w-full">
                <div class="bg-slate-100 text-slate-900 px-4 py-3 rounded-lg">
                  <div class="whitespace-pre-wrap break-words">{{ block.content }}</div>
                  <div class="text-xs text-slate-500 mt-2">
                    {{ formatTime(block.timestamp) }}
                  </div>
                </div>
              </div>

              <!-- Tool Calls Block -->
              <div v-else-if="block.type === 'tool_calls'" class="w-full space-y-2">
                <ToolCallIndicator
                  v-for="toolCall in block.toolCalls"
                  :key="`${toolCall.id}-${toolCall.status}`"
                  :tool-call="toolCall"
                  class="w-full"
                />
              </div>
            </template>
          </template>

          <!-- Legacy rendering for messages without blocks -->
          <template v-else>
            <div class="bg-slate-100 text-slate-900 px-4 py-3 rounded-lg">
              <div class="whitespace-pre-wrap break-words">{{ message.content }}</div>
              <div v-if="message.timestamp" class="text-xs mt-2 text-slate-500">
                {{ formatTime(message.timestamp) }}
                <span v-if="message.model" class="ml-2">{{ message.model }}</span>
              </div>
            </div>

            <!-- Legacy Tool Call Indicators -->
            <ToolCallIndicator
              v-for="toolCall in message.toolCalls"
              :key="`${toolCall.id}-${toolCall.status}`"
              :tool-call="toolCall"
              class="max-w-3xl"
            />
          </template>

          <!-- Message metadata at the end -->
          <div class="text-xs text-slate-400">
            {{ formatTime(message.timestamp) }}
            <span v-if="message.model" class="ml-2">{{ message.model }}</span>
          </div>
        </div>
      </template>

      <!-- Loading Indicator -->
      <div v-if="isLoading" class="flex justify-start">
        <div class="bg-slate-100 text-slate-900 px-4 py-3 rounded-lg">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
            <div
              class="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
              style="animation-delay: 0.1s"
            ></div>
            <div
              class="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
              style="animation-delay: 0.2s"
            ></div>
            <span class="text-sm text-slate-600">正在思考...</span>
          </div>
        </div>
      </div>

      <!-- Streaming Reasoning Content (when streaming message is active) -->
      <div v-if="streamingReasoning" class="flex justify-start">
        <div
          class="bg-blue-50 border-l-4 border-blue-400 text-blue-900 px-4 py-3 rounded-lg max-w-3xl"
        >
          <div class="text-sm font-medium text-blue-700 mb-1">思维过程</div>
          <div class="whitespace-pre-wrap break-words">{{ streamingReasoning }}</div>
          <div class="w-2 h-4 bg-blue-400 animate-pulse inline-block ml-1"></div>
        </div>
      </div>

      <!-- Streaming Message -->
      <div v-if="streamingMessage" class="flex justify-start">
        <div class="bg-slate-100 text-slate-900 px-4 py-3 rounded-lg max-w-3xl">
          <div class="whitespace-pre-wrap break-words">{{ streamingMessage }}</div>
          <div class="w-2 h-4 bg-slate-400 animate-pulse inline-block ml-1"></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="currentMessages.length === 0 && !isLoading"
      class="flex-1 flex items-center justify-center text-slate-400"
    >
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <p class="text-sm">开始新的 Access 会话</p>
      </div>
    </div>

    <!-- Message Input -->
    <div class="border-t border-slate-200 px-6 py-4">
      <div class="flex space-x-4">
        <div class="flex-1 relative modern-input-wrapper">
          <textarea
            v-model="messageInput"
            placeholder="输入消息..."
            class="modern-textarea"
            rows="3"
            @keyup.enter.ctrl="sendMessage"
            :disabled="isLoading"
          ></textarea>
          <div class="modern-input-hint">
            <span>Ctrl + Enter</span>
          </div>
        </div>

        <!-- Send Button / Stop Button -->
        <div class="flex space-x-2">
          <!-- Send Button - Futuristic Design -->
          <button
            v-if="!isLoading"
            @click="sendMessage"
            :disabled="!messageInput.trim()"
            class="futuristic-send-button"
          >
            <div class="send-button-bg"></div>
            <div class="send-button-content">
              <svg class="send-icon" :class="{ 'arrow-bouncing': hasInput }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              <span class="send-text">发送</span>
            </div>
            <div class="send-button-glow"></div>
          </button>

          <!-- Loading Send Button -->
          <button v-else disabled class="futuristic-send-button loading opacity-60">
            <div class="send-button-bg"></div>
            <div class="send-button-content">
              <div class="send-spinner"></div>
              <span class="send-text">发送中</span>
            </div>
          </button>

          <!-- Stop Button -->
          <button v-if="isLoading" @click="stopGeneration" class="futuristic-stop-button">
            <div class="stop-button-bg"></div>
            <div class="stop-button-content">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span>终止</span>
            </div>
          </button>

          <!-- Emergency Reset Button -->
          <button
            v-if="isLoading"
            @click="emergencyReset"
            class="futuristic-reset-button"
            title="紧急重置（如果卡住了）"
          >
            <div class="reset-button-content">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed } from 'vue'
import { useChatStore } from '@/stores/chat'
import ConversationTags from './ConversationTags.vue'
import ToolCallIndicator from './ToolCallIndicator.vue'

const chatStore = useChatStore()

// 保持响应性的正确方式
const currentConversation = computed(() => chatStore.currentConversation)
const currentMessages = computed(() => chatStore.currentMessages)
const isLoading = computed(() => chatStore.isLoading)
const streamingMessage = computed(() => chatStore.streamingMessage)
const streamingReasoning = computed(() => chatStore.streamingReasoning)
const completedReasoning = computed(() => chatStore.completedReasoning)
const showFullReasoning = computed(() => chatStore.showFullReasoning)

const messageInput = ref('')

// 是否有输入内容且是新会话，用于触发箭头跳动
const hasInput = computed(() => messageInput.value.trim().length > 0 && currentMessages.value.length === 0)

// Block expansion state: Map<messageIndex-blockIndex, boolean>
const expandedBlocks = ref<Record<string, boolean>>({})

const isBlockExpanded = (messageIndex: number, blockIndex: number) => {
  const key = `${messageIndex}-${blockIndex}`
  // Check if this block is already expanded
  if (expandedBlocks.value[key] !== undefined) {
    return expandedBlocks.value[key]
  }
  // Reasoning blocks are expanded by default
  const message = currentMessages.value[messageIndex]
  if (message?.blocks && message.blocks[blockIndex]?.type === 'reasoning') {
    return true
  }
  return false
}

const toggleBlockExpansion = (messageIndex: number, blockIndex: number) => {
  const key = `${messageIndex}-${blockIndex}`
  expandedBlocks.value[key] = !expandedBlocks.value[key]
}

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const clearConversation = () => {
  if (confirm('确定要清空当前 Access 会话吗？')) {
    chatStore.clearConversation()
  }
}

const sendMessage = async () => {
  if (!messageInput.value.trim() || isLoading.value) return

  const messageToSend = messageInput.value.trim()

  // 立即清空输入框
  messageInput.value = ''

  try {
    console.log('ChatInterface sending message:', messageToSend)
    await chatStore.sendMessage(messageToSend)
    console.log('ChatInterface message sent successfully')
  } catch (error) {
    console.error('ChatInterface failed to send message:', error)
    // 如果发送失败，恢复输入框内容
    messageInput.value = messageToSend
    alert(`发送消息失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

const stopGeneration = async () => {
  console.log('Stopping generation...')
  await chatStore.stopGeneration()
}

const emergencyReset = async () => {
  console.log('Emergency reset triggered...')
  try {
    await chatStore.forceReset()
    console.log('✅ Emergency reset completed via store method')
  } catch (error) {
    console.error('❌ Emergency reset failed:', error)
  }
}

const formatStreamingMessage = (message: string) => {
  // 确保换行符正确显示，不进行额外的HTML转义
  return message.replace(/\n/g, '<br>')
}
</script>

<style scoped>
/* Futuristic Send Button */
.futuristic-send-button {
  @apply relative px-6 py-3 h-fit overflow-hidden;
  min-width: 120px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.futuristic-send-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.send-button-bg {
  @apply absolute inset-0;
  background: linear-gradient(
    135deg,
    #6366f1 0%,
    #8b5cf6 25%,
    #a855f7 50%,
    #d946ef 75%,
    #ec4899 100%
  );
  border-radius: 12px;
  transition: all 0.3s ease;
}

.futuristic-send-button:not(:disabled):hover .send-button-bg {
  background: linear-gradient(
    135deg,
    #4f46e5 0%,
    #7c3aed 25%,
    #a855f7 50%,
    #d946ef 75%,
    #f472b6 100%
  );
  transform: scale(1.02);
}

.send-button-content {
  @apply relative z-10 flex items-center justify-center space-x-2;
}

.send-icon {
  @apply w-5 h-5 text-white;
  transition: all 0.3s ease;
}

/* 箭头跳动动画 - 模拟真实弹性跳动 */
.send-icon.arrow-bouncing {
  animation: arrowBounce 0.6s ease-in-out infinite !important;
  transition: none !important;
}

@keyframes arrowBounce {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  15% {
    transform: translateY(-8px) translateX(3px);
  }
  30% {
    transform: translateY(0) translateX(0);
  }
  45% {
    transform: translateY(-4px) translateX(1px);
  }
  60% {
    transform: translateY(0) translateX(0);
  }
  75% {
    transform: translateY(-2px) translateX(0.5px);
  }
  90% {
    transform: translateY(0) translateX(0);
  }
}

.futuristic-send-button:not(:disabled):hover .send-icon:not(.arrow-bouncing) {
  transform: translateX(2px);
}

.send-text {
  @apply text-sm font-semibold text-white;
  letter-spacing: 0.5px;
}

.send-button-glow {
  @apply absolute inset-0 rounded-xl;
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.4) 0%,
    rgba(168, 85, 247, 0.4) 50%,
    rgba(236, 72, 153, 0.4) 100%
  );
  filter: blur(12px);
  opacity: 0;
  transition: all 0.3s ease;
}

.futuristic-send-button:not(:disabled):hover .send-button-glow {
  opacity: 1;
  filter: blur(16px);
}

/* Send Spinner */
.send-spinner {
  @apply w-5 h-5;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: send-spin 0.8s linear infinite;
}

@keyframes send-spin {
  to {
    transform: rotate(360deg);
  }
}

/* Futuristic Stop Button */
.futuristic-stop-button {
  @apply relative px-6 py-3 h-fit overflow-hidden;
  min-width: 100px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.stop-button-bg {
  @apply absolute inset-0;
  background: linear-gradient(
    135deg,
    rgba(239, 68, 68, 0.15) 0%,
    rgba(220, 38, 38, 0.2) 50%,
    rgba(185, 28, 28, 0.15) 100%
  );
  border: 2px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.futuristic-stop-button:hover .stop-button-bg {
  background: linear-gradient(
    135deg,
    rgba(239, 68, 68, 0.25) 0%,
    rgba(220, 38, 38, 0.3) 50%,
    rgba(185, 28, 28, 0.25) 100%
  );
  border-color: rgba(239, 68, 68, 0.5);
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
}

.stop-button-content {
  @apply relative z-10 flex items-center justify-center space-x-2;
  color: #dc2626;
}

.futuristic-stop-button:hover .stop-button-content {
  color: #b91c1c;
}

/* Futuristic Reset Button */
.futuristic-reset-button {
  @apply relative px-4 py-3 h-fit;
  border-radius: 12px;
  border: 2px solid rgba(249, 115, 22, 0.3);
  background: linear-gradient(
    135deg,
    rgba(249, 115, 22, 0.1) 0%,
    rgba(245, 158, 11, 0.15) 50%,
    rgba(234, 179, 8, 0.1) 100%
  );
  cursor: pointer;
  transition: all 0.3s ease;
}

.futuristic-reset-button:hover {
  background: linear-gradient(
    135deg,
    rgba(249, 115, 22, 0.2) 0%,
    rgba(245, 158, 11, 0.25) 50%,
    rgba(234, 179, 8, 0.2) 100%
  );
  border-color: rgba(249, 115, 22, 0.5);
  box-shadow: 0 0 15px rgba(249, 115, 22, 0.3);
}

.reset-button-content {
  @apply flex items-center justify-center;
  color: #ea580c;
}

.futuristic-reset-button:hover .reset-button-content {
  color: #c2410c;
}

/* Reasoning Compact - Tech-inspired design */
.reasoning-compact {
  @apply px-3 py-2 rounded-lg flex items-center justify-between;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.08) 0%,
    rgba(99, 102, 241, 0.1) 50%,
    rgba(139, 92, 246, 0.08) 100%
  );
  border: 1px solid rgba(59, 130, 246, 0.2);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: all 0.2s ease;
}

.reasoning-compact:hover {
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 2px 12px rgba(59, 130, 246, 0.15);
}

.reasoning-icon {
  @apply w-7 h-7 rounded flex items-center justify-center;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.2) 0%,
    rgba(99, 102, 241, 0.25) 50%,
    rgba(139, 92, 246, 0.2) 100%
  );
  border: 1px solid rgba(59, 130, 246, 0.3);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Modern Input Box - Simple & Clean */
.modern-input-wrapper {
  position: relative;
}

.modern-textarea {
  @apply w-full px-4 py-3 rounded-lg resize-none;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  color: #0f172a;
  font-size: 0.875rem;
  line-height: 1.5;
  transition: all 0.25s ease;
}

.modern-textarea:hover {
  border-color: #cbd5e1;
  background: #ffffff;
}

.modern-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.modern-textarea::placeholder {
  color: rgba(100, 116, 139, 0.7);
  transition: color 0.25s ease;
}

.modern-textarea:focus::placeholder {
  color: rgba(59, 130, 246, 0.5);
}

.modern-textarea:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f1f5f9;
}

.modern-input-hint {
  position: absolute;
  bottom: 10px;
  right: 12px;
  font-size: 11px;
  color: #94a3b8;
  pointer-events: none;
  transition: all 0.25s ease;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 6px;
  border-radius: 4px;
}

.modern-textarea:focus ~ .modern-input-hint {
  color: #3b82f6;
}
</style>
