import { ref, computed, nextTick } from 'vue'
import { defineStore } from 'pinia'
import type { ChatMessage, ChatConversation } from '@/types/settings'
import { useSettingsStore } from './settings'

export const useChatStore = defineStore('chat', () => {
  // State
  const conversations = ref<ChatConversation[]>([])
  const currentConversationId = ref<string | null>(null)
  const isLoading = ref(false)
  const streamingMessage = ref('')
  const abortController = ref<AbortController | null>(null)

  const settingsStore = useSettingsStore()

  // Computed
  const currentConversation = computed(() =>
    conversations.value.find(c => c.id === currentConversationId.value)
  )

  const currentMessages = computed(() => {
    return currentConversation.value?.messages || []
  })

  // Actions
  const createConversation = (title?: string) => {
    const newConversation: ChatConversation = {
      id: Date.now().toString(),
      title: title || '新对话',
      messages: [],
      settings: {},
      createdAt: new Date(),
      updatedAt: new Date()
    }

    conversations.value.unshift(newConversation)
    currentConversationId.value = newConversation.id
    return newConversation
  }

  const deleteConversation = (id: string) => {
    const index = conversations.value.findIndex(c => c.id === id)
    if (index > -1) {
      conversations.value.splice(index, 1)
      if (currentConversationId.value === id) {
        currentConversationId.value = null
      }
    }
  }

  const selectConversation = (id: string) => {
    currentConversationId.value = id
  }

  const addMessage = async (content: string, role: 'user' | 'assistant' | 'system' = 'user') => {
    if (!currentConversation.value) {
      createConversation()
    }

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
      model: settingsStore.selectedProvider?.model
    }

    if (currentConversation.value) {
      currentConversation.value.messages.push(newMessage)
      currentConversation.value.updatedAt = new Date()
    }

    return newMessage
  }

  const sendMessage = async (userMessage: string) => {
    // Check for provider
    const provider = settingsStore.selectedProvider
    if (!provider) {
      throw new Error('没有可用的模型提供商，请先配置API')
    }

    // Start loading
    isLoading.value = true
    abortController.value = new AbortController()

    // Add user message
    await addMessage(userMessage, 'user')

    // Clear any existing streaming message
    streamingMessage.value = ''

    try {
      // Prepare messages
      const messages = [
        ...currentMessages.value.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage }
      ]

      console.log('🚀 Starting streaming request')
      console.log('📋 User message:', userMessage)

      // Call real API
      let response
      try {
        // 使用真实的API
        const apiUrl = provider.baseUrl.includes('localhost') || provider.baseUrl.includes('127.0.0.1')
          ? `${provider.baseUrl}/chat/completions`
          : `/api/chat/completions`

        console.log('🌐 Request URL:', apiUrl)
        console.log('📡 Making request with stream: true')

        const requestBody = {
          model: provider.model,
          messages,
          max_tokens: provider.maxTokens || 4000,
          temperature: provider.temperature || 0.7,
          stream: true
        }

        console.log('📋 Request body:', JSON.stringify(requestBody, null, 2))

        response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${provider.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
          },
          body: JSON.stringify(requestBody),
          signal: abortController.value.signal
        })
      } catch (fetchError) {
        console.error('❌ Fetch failed:', fetchError)
        if (fetchError instanceof TypeError) {
          throw new Error(`网络连接错误: ${fetchError.message}`)
        }
        throw fetchError
      }

      console.log('📡 Response status:', response.status, response.statusText)

      if (!response.ok) {
        let errorText = ''
        try {
          errorText = await response.text()
        } catch (e) {
          console.error('Failed to read error response:', e)
        }

        let errorMessage = `请求失败 (${response.status})`
        if (response.status === 401) {
          errorMessage += ' - API密钥无效或已过期'
        } else if (response.status === 429) {
          errorMessage += ' - 请求频率过高，请稍后重试'
        } else if (response.status >= 500) {
          errorMessage += ' - 服务器内部错误，请稍后重试'
        } else if (errorText) {
          errorMessage += ` - ${errorText}`
        }

        throw new Error(errorMessage)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('无法读取响应流')
      }

      const decoder = new TextDecoder()
      let assistantMessage = ''
      let chunkCount = 0
      let buffer = ''
      let lastChunkTime = Date.now()

      console.log('📖 Starting to read stream...')

      // Read stream with timeout handling
      const readWithTimeout = async (reader: ReadableStreamDefaultReader, timeout: number = 30000) => {
        return Promise.race([
          reader.read(),
          new Promise<{ done: boolean; value?: Uint8Array }>((_, reject) =>
            setTimeout(() => reject(new Error('读取超时')), timeout)
          )
        ])
      }

      let streamDone = false
      while (!streamDone) {
        try {
          const { done, value } = await readWithTimeout(reader)
          if (done) {
            console.log('✅ Stream reading completed, total chunks:', chunkCount)
            break
          }

          chunkCount++
          const now = Date.now()
          const timeSinceLastChunk = now - lastChunkTime
          lastChunkTime = now

          const chunk = decoder.decode(value, { stream: true })
          buffer += chunk

          // 详细日志每个chunk和时间间隔
          console.log(`📦 Chunk ${chunkCount} (size: ${chunk.length}, interval: ${timeSinceLastChunk}ms):`, chunk)

          // Split by lines but handle partial lines
          const lines = buffer.split('\n')
          buffer = lines.pop() || '' // Keep the last (potentially partial) line in buffer

          for (const line of lines) {
            const trimmedLine = line.trim()
            if (!trimmedLine) continue

            if (trimmedLine.startsWith('data: ')) {
              const data = trimmedLine.slice(6)
              if (data === '[DONE]') {
                console.log('🏁 Received [DONE] signal')
                streamDone = true
                break
              }

              try {
                const json = JSON.parse(data)
                // 检查是否有实际的content
                const choice = json.choices?.[0]
                if (choice) {
                  // 尝试获取不同路径的内容
                  // 优先使用content而不是reasoning_content
                  const content = choice.delta?.content ||
                                 json.content

                  // 如果没有content但有reasoning_content，记录但不显示
                  const reasoningContent = choice.delta?.reasoning_content ||
                                          json.reasoning_content

                  if (reasoningContent && !content) {
                    console.log('🧠 Reasoning content (not displayed):', JSON.stringify(reasoningContent))
                  }

                  if (content) {
                    // 直接追加token并立即更新
                    assistantMessage += content
                    streamingMessage.value = assistantMessage
                    // 强制DOM更新
                    await nextTick()

                    console.log('💬 Streaming token:', JSON.stringify(content))
                    console.log('📝 Message length:', assistantMessage.length)
                  } else {
                    // 如果有finish_reason，这是正常的结束
                    if (choice.finish_reason === 'stop') {
                      console.log('🏁 Stream ended normally')
                    } else if (!reasoningContent) {
                      console.log('⚠️ No content in delta, choice:', choice)
                    }
                  }
                }
              } catch (e) {
                console.log('❌ Parse error for line:', trimmedLine, 'Error:', e)
              }
            } else if (trimmedLine.startsWith(':')) {
              // SSE comment line, ignore
              console.log('💭 SSE comment:', trimmedLine)
            } else {
              console.log('ℹ️ Non-data line:', trimmedLine)
            }
          }
        } catch (readError) {
          console.error('❌ Stream read error:', readError)
          if (readError instanceof Error && readError.message === '读取超时') {
            console.warn('⏰ Stream read timeout, ending stream')
            break
          } else {
            throw readError
          }
        }
      }

      console.log('📝 Stream finished, processing remaining buffer...')

      // Process any remaining data in buffer
      if (buffer.trim()) {
        const trimmedLine = buffer.trim()
        if (trimmedLine.startsWith('data: ')) {
          const data = trimmedLine.slice(6)
          if (data !== '[DONE]') {
            try {
              const json = JSON.parse(data)
              const choice = json.choices?.[0]
              if (choice) {
                // 优先使用content而不是reasoning_content
                const content = choice.delta?.content ||
                               json.content

                const reasoningContent = choice.delta?.reasoning_content ||
                                        json.reasoning_content

                if (reasoningContent && !content) {
                  console.log('🧠 Final reasoning content (not displayed):', JSON.stringify(reasoningContent))
                }

                if (content) {
                  // 直接追加token并立即更新
                  assistantMessage += content
                  streamingMessage.value = assistantMessage
                  console.log('💬 Final token:', JSON.stringify(content))
                }
              }
            } catch (e) {
              console.log('❌ Final parse error:', trimmedLine, 'Error:', e)
            }
          }
        }
      }

      console.log('📝 About to add assistant message and clean up...')

      // Add assistant message
      await addMessage(assistantMessage, 'assistant')
      streamingMessage.value = ''

      // Update conversation title with first user message if it's a new conversation
      if (currentConversation.value && currentConversation.value.messages.length === 2) {
        currentConversation.value.title = userMessage.slice(0, 30) + (userMessage.length > 30 ? '...' : '')
      }

      console.log('📝 All processing completed, about to exit try block')

    } catch (error) {
      console.error('Chat API Error:', error)
      // Ensure cleanup happens even on error
      streamingMessage.value = ''
      isLoading.value = false
      abortController.value = null
      throw error
    } finally {
      console.log('🔚 Finally block: Cleaning up...')
      // Double-check cleanup
      streamingMessage.value = ''
      isLoading.value = false
      abortController.value = null
      console.log('🔚 Finally block: isLoading set to', isLoading.value)
    }
  }

  const clearConversation = () => {
    if (currentConversation.value) {
      currentConversation.value.messages = []
      currentConversation.value.updatedAt = new Date()
    }
    streamingMessage.value = ''
  }

  const stopGeneration = () => {
    console.log('Stopping generation...')
    if (abortController.value) {
      abortController.value.abort()
    }
    isLoading.value = false
  }

  return {
    // State
    conversations,
    currentConversationId,
    isLoading,
    streamingMessage,

    // Computed
    currentConversation,
    currentMessages,

    // Actions
    createConversation,
    deleteConversation,
    selectConversation,
    addMessage,
    sendMessage,
    clearConversation,
    stopGeneration
  }
})