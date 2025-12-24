import { ref, computed, nextTick, watch } from 'vue'
import { defineStore } from 'pinia'
import type { ChatMessage, ChatConversation } from '@/types/settings'
import { useSettingsStore } from './settings'

const CONVERSATIONS_STORAGE_KEY = 'agentaccess-conversations'
const CURRENT_CONVERSATION_KEY = 'agentaccess-current-conversation'

export const useChatStore = defineStore('chat', () => {
  // State
  const conversations = ref<ChatConversation[]>([])
  const currentConversationId = ref<string | null>(null)
  const isLoading = ref(false)
  const streamingMessage = ref('')
  const streamingReasoning = ref('')
  const completedReasoning = ref('')
  const showFullReasoning = ref(false)
  const abortController = ref<AbortController | null>(null)
  const isInitialized = ref(false)

  const settingsStore = useSettingsStore()

  // Save conversations to localStorage
  const saveConversations = () => {
    if (!isInitialized.value) return // Don't save during initialization
    try {
      const json = JSON.stringify(conversations.value)
      localStorage.setItem(CONVERSATIONS_STORAGE_KEY, json)
      console.log('💾 Saved conversations:', conversations.value.length)
      conversations.value.forEach((conv, i) => {
        console.log(`💾   Conversation ${i}: id=${conv.id}, messages=${conv.messages.length}`)
      })
    } catch (error) {
      console.error('Failed to save conversations to storage:', error)
    }
  }

  // Save current conversation ID
  const saveCurrentConversationId = () => {
    if (!isInitialized.value) return // Don't save during initialization
    try {
      if (currentConversationId.value) {
        localStorage.setItem(CURRENT_CONVERSATION_KEY, currentConversationId.value)
        console.log('💾 Saved current conversation ID:', currentConversationId.value)
      } else {
        localStorage.removeItem(CURRENT_CONVERSATION_KEY)
      }
    } catch (error) {
      console.error('Failed to save current conversation ID:', error)
    }
  }

  // Load conversations from localStorage on initialization
  const loadConversations = () => {
    try {
      const saved = localStorage.getItem(CONVERSATIONS_STORAGE_KEY)
      if (saved) {
        const data = JSON.parse(saved)
        console.log('📦 Raw data from localStorage:', data.length, 'conversations')

        conversations.value = data.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }))

        console.log('📦 Loaded conversations:', conversations.value.length)
        conversations.value.forEach((conv, i) => {
          console.log(`📦   Conversation ${i}: id=${conv.id}, messages=${conv.messages.length}`)
        })
      }

      const savedCurrentId = localStorage.getItem(CURRENT_CONVERSATION_KEY)
      if (savedCurrentId) {
        currentConversationId.value = savedCurrentId
        console.log('📦 Loaded current conversation ID:', savedCurrentId)
      }
    } catch (error) {
      console.error('Failed to load conversations from storage:', error)
    }
  }

  // Initialize - load first, then set up watchers
  loadConversations()
  isInitialized.value = true

  // Watch for changes and auto-save
  watch(conversations, () => {
    saveConversations()
  }, { deep: true })

  watch(currentConversationId, () => {
    saveCurrentConversationId()
  })

  // Computed
  const currentConversation = computed(() =>
    conversations.value.find(c => c.id === currentConversationId.value)
  )

  const currentMessages = computed(() => {
    return currentConversation.value?.messages || []
  })

  // Actions
  const createConversation = (title?: string) => {
    console.log('📝 createConversation called, current conversations:', conversations.value.length)
    console.log('📝 conversations before:', conversations.value.map(c => ({ id: c.id, title: c.title })))

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

    console.log('📝 conversations after:', conversations.value.map(c => ({ id: c.id, title: c.title })))

    // 清除所有流式和思维内容状态
    streamingMessage.value = ''
    streamingReasoning.value = ''
    completedReasoning.value = ''
    showFullReasoning.value = false

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

    // 切换会话时清除所有流式和思维内容状态
    streamingMessage.value = ''
    streamingReasoning.value = ''
    completedReasoning.value = ''
    showFullReasoning.value = false
    isLoading.value = false
  }

  const addMessage = async (content: string, role: 'user' | 'assistant' | 'system' = 'user') => {
    console.log('📨 addMessage called, role:', role, 'currentConversation exists:', !!currentConversation.value)

    if (!currentConversation.value) {
      console.log('📨 No current conversation, creating one...')
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
      console.log('📨 Adding message to conversation:', currentConversation.value.id, 'current messages:', currentConversation.value.messages.length)
      currentConversation.value.messages.push(newMessage)
      currentConversation.value.updatedAt = new Date()
      console.log('📨 After adding, messages:', currentConversation.value.messages.length)
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

    // Clear any existing streaming message and reasoning content
    streamingMessage.value = ''
    streamingReasoning.value = ''
    completedReasoning.value = ''
    showFullReasoning.value = false

    try {
      // Prepare messages (add current user message to existing messages)
      const messages = [
        ...currentMessages.value.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage }
      ]

      // Add user message to UI *after* preparing API request
      await addMessage(userMessage, 'user')

      console.log('🚀 Starting streaming request')
      console.log('📋 User message:', userMessage)

      // Call real API
      let response
      try {
        // 使用真实的API
        const apiUrl = `${provider.baseUrl}/chat/completions`

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
            'Content-Type': 'application/json'
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
      let lastChunkTime = Date.now()

      console.log('📖 Starting to read stream...')

      // 直接读取流，不使用超时机制
      while (true) {
        try {
          const { done, value } = await reader.read()
          if (done) {
            console.log('✅ Stream reading completed, total chunks:', chunkCount)
            break
          }

          chunkCount++
          const now = Date.now()
          const timeSinceLastChunk = now - lastChunkTime
          lastChunkTime = now

          const chunk = decoder.decode(value, { stream: true })

          // 立即处理每个chunk，不累积在buffer中
          const lines = chunk.split('\n')

          for (const line of lines) {
            const trimmedLine = line.trim()
            if (!trimmedLine) continue

            if (trimmedLine.startsWith('data: ')) {
              const data = trimmedLine.slice(6)
              if (data === '[DONE]') {
                console.log('🏁 Received [DONE] signal')
                break
              }

              try {
                const json = JSON.parse(data)
                const choice = json.choices?.[0]
                if (choice) {
                  // 尝试获取不同路径的内容
                  const content = choice.delta?.content ||
                                 json.content

                  // 获取reasoning_content
                  const reasoningContent = choice.delta?.reasoning_content ||
                                          json.reasoning_content

                  // 处理reasoning_content
                  if (reasoningContent) {
                    streamingReasoning.value += reasoningContent
                    console.log('🧠 Reasoning content:', JSON.stringify(reasoningContent))
                  }

                  // 处理content，检查是否包含思维链标签
                  if (content) {
                    // 检查content中是否包含思维链标签
                    const thinkingMatch = content.match(/<think>([\s\S]*?)<\/think>/)

                    if (thinkingMatch) {
                      // 提取思维链内容并显示
                      const thinkingContent = thinkingMatch[1]
                      streamingReasoning.value += thinkingContent
                      console.log('🧠 Thinking content from tags:', JSON.stringify(thinkingContent))

                      // 提取思维链之外的正常内容
                      const normalContent = content.replace(/<think>[\s\S]*?<\/think>/, '').trim()
                      if (normalContent) {
                        assistantMessage += normalContent
                        streamingMessage.value = assistantMessage

                        // 强制立即更新 DOM
                        await nextTick()

                        console.log('💬 Normal content token:', JSON.stringify(normalContent))
                      }
                    } else {
                      // 普通内容，直接显示
                      assistantMessage += content
                      streamingMessage.value = assistantMessage

                      // 强制立即更新 DOM
                      await nextTick()

                      console.log('💬 Streaming token:', JSON.stringify(content))
                    }
                    console.log('📝 Message length:', assistantMessage.length)
                  } else if (!reasoningContent) {
                    // 如果有finish_reason，这是正常的结束
                    if (choice.finish_reason === 'stop') {
                      console.log('🏁 Stream ended normally')
                    } else {
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
          throw readError
        }
      }

      console.log('📝 Stream finished...')

      console.log('📝 About to add assistant message and clean up...')

      // Save completed reasoning before clearing streaming state
      if (streamingReasoning.value.trim()) {
        completedReasoning.value = streamingReasoning.value.trim()
      }

      // Add assistant message
      await addMessage(assistantMessage, 'assistant')
      streamingMessage.value = ''
      streamingReasoning.value = ''
      // Keep completedReasoning for display, reset showFullReasoning to compact mode
      showFullReasoning.value = false

      // Update conversation title with first user message if it's a new conversation
      if (currentConversation.value && currentConversation.value.messages.length === 2) {
        currentConversation.value.title = userMessage.slice(0, 30) + (userMessage.length > 30 ? '...' : '')
      }

      console.log('📝 All processing completed, about to exit try block')

    } catch (error) {
      console.error('Chat API Error:', error)
      // Ensure cleanup happens even on error
      streamingMessage.value = ''
      streamingReasoning.value = ''
      isLoading.value = false
      abortController.value = null
      throw error
    } finally {
      console.log('🔚 Finally block: Cleaning up...')
      // Double-check cleanup
      streamingMessage.value = ''
      streamingReasoning.value = ''
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
    // 清除所有流式和思维内容状态
    streamingMessage.value = ''
    streamingReasoning.value = ''
    completedReasoning.value = ''
    showFullReasoning.value = false
    isLoading.value = false
  }

  const stopGeneration = async () => {
    console.log('Stopping generation...')
    if (abortController.value) {
      abortController.value.abort()
    }
    isLoading.value = false
    streamingMessage.value = ''
    streamingReasoning.value = ''
    abortController.value = null

    // 强制更新响应式状态
    await nextTick()
    console.log('✅ Stop generation completed, isLoading:', isLoading.value)
  }

  const forceReset = async () => {
    console.log('🔄 Force resetting all states...')

    // 强制重置所有状态
    isLoading.value = false
    streamingMessage.value = ''
    streamingReasoning.value = ''
    completedReasoning.value = ''
    showFullReasoning.value = false
    abortController.value = null

    // 强制触发多次更新
    for (let i = 0; i < 3; i++) {
      await nextTick()
      isLoading.value = false
    }

    console.log('✅ Force reset completed, isLoading:', isLoading.value)
    console.log('✅ streamingMessage:', streamingMessage.value)
    console.log('✅ streamingReasoning:', streamingReasoning.value)
    console.log('✅ completedReasoning:', completedReasoning.value)
  }

  const toggleReasoningDisplay = () => {
    showFullReasoning.value = !showFullReasoning.value
  }

  return {
    // State
    conversations,
    currentConversationId,
    isLoading,
    streamingMessage,
    streamingReasoning,
    completedReasoning,
    showFullReasoning,

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
    stopGeneration,
    forceReset,
    toggleReasoningDisplay,
    loadConversations,
    saveConversations
  }
})