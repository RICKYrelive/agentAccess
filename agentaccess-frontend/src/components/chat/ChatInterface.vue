<template>
  <div class="h-full flex flex-col bg-white">
    <!-- Chat Header -->
    <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900">对话</h3>
      <div class="flex items-center space-x-2">
        <div class="text-sm text-gray-500">
          {{ currentConversation?.title || '新对话' }}
        </div>

        <!-- Debug Info -->
        <div class="text-xs bg-gray-100 px-2 py-1 rounded">
          Loading: {{ isLoading ? '是' : '否' }}
        </div>

        <button
          @click="clearConversation"
          class="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
          title="清空对话"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Chat Messages -->
    <div class="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
      <!-- Render messages -->
      <template v-for="(message, index) in currentMessages" :key="message.id">
        <!-- Show reasoning before the last assistant message when not streaming -->
        <template v-if="index === currentMessages.length - 1 && message.role === 'assistant' && completedReasoning && !streamingMessage">
          <!-- Completed Reasoning Content (Compact Mode) -->
          <div v-if="!showFullReasoning" class="flex justify-start">
            <div class="bg-blue-100 border border-blue-300 text-blue-800 px-3 py-2 rounded-full max-w-3xl inline-flex items-center space-x-2 text-sm">
              <span class="font-medium">🧠 思维过程</span>
              <button
                @click="chatStore.toggleReasoningDisplay()"
                class="text-blue-600 hover:text-blue-800 font-normal underline"
              >
                展开
              </button>
            </div>
          </div>

          <!-- Completed Reasoning Content (Full Mode) -->
          <div v-else class="flex justify-start">
            <div class="bg-blue-50 border-l-4 border-blue-400 text-blue-900 px-4 py-3 rounded-lg max-w-3xl">
              <div class="flex items-center justify-between mb-2">
                <div class="text-sm font-medium text-blue-700">思维过程</div>
                <button
                  @click="chatStore.toggleReasoningDisplay()"
                  class="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  收起
                </button>
              </div>
              <div class="whitespace-pre-wrap break-words text-sm">{{ completedReasoning }}</div>
            </div>
          </div>
        </template>

        <!-- Message -->
        <div
          class="flex"
          :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div
            class="max-w-3xl"
            :class="[
              'px-4 py-3 rounded-lg',
              message.role === 'user'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-900'
            ]"
          >
            <!-- Message Content -->
            <div class="whitespace-pre-wrap break-words">{{ message.content }}</div>

            <!-- Message Metadata -->
            <div
              v-if="message.timestamp"
              class="text-xs mt-2"
              :class="message.role === 'user' ? 'text-primary-200' : 'text-gray-500'"
            >
              {{ formatTime(message.timestamp) }}
              <span v-if="message.model" class="ml-2">{{ message.model }}</span>
            </div>
          </div>
        </div>
      </template>

      <!-- Loading Indicator -->
      <div v-if="isLoading" class="flex justify-start">
        <div class="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            <span class="text-sm text-gray-600">正在思考...</span>
          </div>
        </div>
      </div>

      <!-- Streaming Reasoning Content (when streaming message is active) -->
      <div v-if="streamingReasoning" class="flex justify-start">
        <div class="bg-blue-50 border-l-4 border-blue-400 text-blue-900 px-4 py-3 rounded-lg max-w-3xl">
          <div class="text-sm font-medium text-blue-700 mb-1">思维过程</div>
          <div class="whitespace-pre-wrap break-words">{{ streamingReasoning }}</div>
          <div class="w-2 h-4 bg-blue-400 animate-pulse inline-block ml-1"></div>
        </div>
      </div>

      <!-- Streaming Message -->
      <div v-if="streamingMessage" class="flex justify-start">
        <div class="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg max-w-3xl">
          <div class="whitespace-pre-wrap break-words">{{ streamingMessage }}</div>
          <div class="w-2 h-4 bg-gray-400 animate-pulse inline-block ml-1"></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="currentMessages.length === 0 && !isLoading"
      class="flex-1 flex items-center justify-center text-gray-400"
    >
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p class="text-sm">开始新的对话</p>
      </div>
    </div>

    <!-- Message Input -->
    <div class="border-t border-gray-200 px-6 py-4">
      <div class="flex space-x-4">
        <div class="flex-1 relative">
          <textarea
            v-model="messageInput"
            placeholder="输入消息..."
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            rows="3"
            @keyup.enter.ctrl="sendMessage"
            :disabled="isLoading"
          ></textarea>
          <div class="absolute bottom-2 right-2 text-xs text-gray-400">
            Ctrl + Enter 发送
          </div>
        </div>

        <!-- Send Button / Stop Button -->
        <div class="flex space-x-2">
          <!-- Send Button -->
          <button
            v-if="!isLoading"
            @click="sendMessage"
            :disabled="!messageInput.trim()"
            class="btn-primary px-6 py-3 h-fit flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span>发送</span>
          </button>

          <!-- Loading Send Button -->
          <button
            v-else
            disabled
            class="btn-primary px-6 py-3 h-fit flex items-center space-x-2 opacity-75 cursor-not-allowed"
          >
            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>发送中</span>
          </button>

          <!-- Stop Button -->
          <button
            v-if="isLoading"
            @click="stopGeneration"
            class="btn-secondary px-6 py-3 h-fit flex items-center space-x-2 text-red-600 border-red-300 hover:bg-red-50"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>终止</span>
          </button>

          <!-- Emergency Reset Button -->
          <button
            v-if="isLoading"
            @click="emergencyReset"
            class="btn-secondary px-4 py-3 h-fit flex items-center space-x-1 text-orange-600 border-orange-300 hover:bg-orange-50"
            title="紧急重置（如果卡住了）"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>重置</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed } from 'vue'
import { useChatStore } from '@/stores/chat'

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

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const clearConversation = () => {
  if (confirm('确定要清空当前对话吗？')) {
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