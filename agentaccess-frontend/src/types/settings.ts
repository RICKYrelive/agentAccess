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

// Tool Call types
export type ToolCallType = 'agent' | 'mcp' | 'plugin' | 'knowledge_base'
export type ToolCallStatus = 'pending' | 'running' | 'completed' | 'failed'

export interface ToolCall {
  id: string
  type: ToolCallType
  name: string
  status: ToolCallStatus
  startTime: Date
  endTime?: Date
  input?: any
  result?: any
  error?: string
}

// Message block types for multi-turn responses
export type MessageBlockType = 'reasoning' | 'text' | 'tool_calls'

export interface ReasoningBlock {
  type: 'reasoning'
  content: string
  timestamp: Date
}

export interface TextBlock {
  type: 'text'
  content: string
  timestamp: Date
}

export interface ToolCallsBlock {
  type: 'tool_calls'
  toolCalls: ToolCall[]
  timestamp: Date
}

export type MessageBlock = ReasoningBlock | TextBlock | ToolCallsBlock

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string // Legacy: for backward compatibility
  timestamp: Date
  providerId?: string
  model?: string
  // New structure: blocks for multi-turn responses
  blocks?: MessageBlock[]
  // Legacy: for backward compatibility
  toolCalls?: ToolCall[]
  metadata?: {
    tokens?: number
    cost?: number
    latency?: number
    agentUsed?: string
    toolsUsed?: string[]
  }
}

export interface ChatConversation {
  id: string
  title: string
  messages: ChatMessage[]
  settings: {
    providerId?: string
    agentId?: string
    knowledgeBaseIds?: string[]
    mcpServiceIds?: string[]
    pluginIds?: string[]
    // Legacy fields for backward compatibility
    knowledgeBaseId?: string
    mcpServices?: string[]
  }
  createdAt: Date
  updatedAt: Date
  // Demo conversation metadata (optional, for internal use)
  _isDemo?: boolean
  _demoType?: string
}
