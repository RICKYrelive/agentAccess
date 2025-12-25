import { ref, computed, nextTick, watch } from 'vue'
import { defineStore } from 'pinia'
import type { ChatMessage, ChatConversation } from '@/types/settings'
import { useSettingsStore } from './settings'

const CONVERSATIONS_STORAGE_KEY = 'agentaccess-conversations'
const CURRENT_CONVERSATION_KEY = 'agentaccess-current-conversation'

// Demo conversation IDs that cannot be deleted (first 5 initial conversations)
const DEMO_CONVERSATION_IDS = new Set<string>()

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

        const loadedConversations = data.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }))

        // Remove duplicates by keeping only the first occurrence of each ID
        const uniqueConversations: ChatConversation[] = []
        const seenIds = new Set<string>()
        for (const conv of loadedConversations) {
          if (!seenIds.has(conv.id)) {
            seenIds.add(conv.id)
            uniqueConversations.push(conv)
          } else {
            console.log('⚠️ Duplicate conversation removed:', conv.id, conv.title)
          }
        }

        conversations.value = uniqueConversations

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
    // Check if this is a demo conversation that cannot be deleted
    if (DEMO_CONVERSATION_IDS.has(id)) {
      throw new Error('演示中，该对话不支持删除')
    }

    const index = conversations.value.findIndex(c => c.id === id)
    if (index > -1) {
      conversations.value.splice(index, 1)
      if (currentConversationId.value === id) {
        currentConversationId.value = null
      }
    }
  }

  // Mark a conversation as demo (protected from deletion)
  const markConversationAsDemo = (id: string) => {
    DEMO_CONVERSATION_IDS.add(id)
  }

  // Check if a conversation is a demo conversation
  const isDemoConversation = (id: string): boolean => {
    return DEMO_CONVERSATION_IDS.has(id)
  }

  // Initialize demo conversations (called on app startup if no conversations exist)
  const initializeDemoConversations = () => {
    // Define demo conversation data
    const demoConversations = [
      {
        id: 'conv-1',
        title: '帮我生成一个PPT',
        messages: [
          { role: 'user', content: '帮我生成一个PPT', timestamp: new Date() },
          { role: 'assistant', content: '好的，我可以帮您生成PPT。请告诉我PPT的主题是什么？', timestamp: new Date() },
          { role: 'user', content: '关于人工智能发展趋势', timestamp: new Date() },
          { role: 'assistant', content: '明白了！我将为您创建一个关于人工智能发展趋势的PPT。我已经为您生成了演示文稿，包含以下内容：\n\n1. 人工智能发展历程\n2. 当前主流AI技术\n3. 未来发展趋势\n4. 行业应用案例\n\n您可以通过以下链接下载PPT：https://example.com/download/ppt-ai-trends.pptx', timestamp: new Date() }
        ],
        settings: {},
        createdAt: new Date(Date.now() - 1000 * 60 * 30),
        updatedAt: new Date(Date.now() - 1000 * 60 * 30)
      },
      {
        id: 'conv-2',
        title: '给我设置一个明天8点的会议提醒',
        messages: [
          { role: 'user', content: '给我设置一个明天8点的会议提醒', timestamp: new Date() },
          { role: 'assistant', content: '好的，我已经为您设置了明天上午8点的会议提醒。提醒内容：\n\n📅 时间：明天 8:00 AM\n⏰ 提醒：会议提醒\n\n我会准时提醒您参加会议。需要我添加会议备注吗？', timestamp: new Date() }
        ],
        settings: {},
        createdAt: new Date(Date.now() - 1000 * 60 * 60),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60)
      },
      {
        id: 'conv-3',
        title: '写一封产品介绍邮件',
        messages: [
          { role: 'user', content: '写一封产品介绍邮件', timestamp: new Date() },
          { role: 'assistant', content: '好的，以下是一封产品介绍邮件的草稿：\n\n主题：全新智能产品介绍\n\n尊敬的客户，\n\n您好！我们很高兴向您介绍我们最新推出的智能产品...\n\n请告诉我您想介绍什么产品，我可以帮您定制更具体的内容。', timestamp: new Date() }
        ],
        settings: {},
        createdAt: new Date(Date.now() - 1000 * 60 * 120),
        updatedAt: new Date(Date.now() - 1000 * 60 * 120)
      },
      {
        id: 'conv-4',
        title: '分析这个数据报表',
        messages: [
          { role: 'user', content: '分析这个数据报表', timestamp: new Date() },
          { role: 'assistant', content: '我看到您上传了数据报表。让我来帮您分析一下...\n\n根据报表数据，我发现了以下几个关键趋势：\n1. 销售额比去年同期增长了25%\n2. 用户活跃度提升了15%\n3. 新用户转化率达到了8%\n\n需要我深入分析某个特定指标吗？', timestamp: new Date() }
        ],
        settings: {},
        createdAt: new Date(Date.now() - 1000 * 60 * 180),
        updatedAt: new Date(Date.now() - 1000 * 60 * 180)
      },
      {
        id: 'conv-5',
        title: '翻译这段文字到英文',
        messages: [
          { role: 'user', content: '翻译这段文字到英文', timestamp: new Date() },
          { role: 'assistant', content: '请提供您需要翻译的文字内容，我会帮您翻译成地道的英文。', timestamp: new Date() }
        ],
        settings: {},
        createdAt: new Date(Date.now() - 1000 * 60 * 240),
        updatedAt: new Date(Date.now() - 1000 * 60 * 240)
      }
    ]

    // Add demo conversations if they don't already exist
    demoConversations.forEach(demoConv => {
      const exists = conversations.value.find(c => c.id === demoConv.id)
      if (!exists) {
        conversations.value.push(demoConv as ChatConversation)
        // Mark as demo (protected from deletion)
        DEMO_CONVERSATION_IDS.add(demoConv.id)
        console.log('✅ Initialized demo conversation:', demoConv.title)
      } else {
        // Even if conversation exists, ensure it's marked as demo
        DEMO_CONVERSATION_IDS.add(demoConv.id)
        // If the existing conversation has no messages but the demo definition does, update it
        if (exists.messages.length === 0 && demoConv.messages && demoConv.messages.length > 0) {
          exists.messages = demoConv.messages
          exists.title = demoConv.title
          exists.updatedAt = new Date()
          console.log('✅ Updated demo conversation with messages:', demoConv.title)
        }
      }
    })

    // Force save to ensure demo conversations are persisted
    saveConversations()
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
    saveConversations,
    markConversationAsDemo,
    isDemoConversation,
    initializeDemoConversations
  }
})