export interface ModelProvider {
  id: string
  name: string
  type: 'openai' | 'anthropic' | 'ollama' | 'custom'
  baseUrl?: string
  apiKey?: string
  model: string
  maxTokens?: number
  temperature?: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UserSettings {
  id: string
  userId: string
  defaultProviderId?: string
  providers: ModelProvider[]
  // FastGPT Integration Settings
  fastgptApiUrl?: string
  fastgptApiKey?: string
  createdAt: Date
  updatedAt: Date
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  providerId?: string
  model?: string
  metadata?: {
    tokens?: number
    cost?: number
    latency?: number
  }
}

export interface ChatConversation {
  id: string
  title: string
  messages: ChatMessage[]
  settings: {
    providerId?: string
    knowledgeBaseId?: string
    mcpServices?: string[]
  }
  createdAt: Date
  updatedAt: Date
}