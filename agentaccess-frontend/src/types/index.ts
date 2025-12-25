// Common types used across the application
export interface User {
  id: string
  name: string
  avatar?: string
  email?: string
}

export interface Agent {
  id: string
  name: string
  type: 'personal' | 'team' | 'specialized'
  description?: string
  capabilities?: string[]
  avatar?: string
  category?: 'personal' | 'coding' | 'analysis' | 'writing' | 'finance' | 'specialized'
  icon?: string
}

// Extended agent type with additional properties for agent management
export interface ExtendedAgent extends Agent {
  isThirdParty?: boolean // Imported from external source
  tags?: string[] // Up to 3 tags
  sharedGroups?: string[] // Which groups this agent is shared with
  lastUsedAt?: Date // For recent agents sorting
  createdAt: Date
  updatedAt: Date
}

// Sharing group for agent collaboration
export interface SharingGroup {
  id: string
  name: string // e.g., "研发部", "市场部"
  description?: string
  createdAt: Date
}

export interface Message {
  id: string
  content: string
  sender: 'user' | 'agent'
  timestamp: Date
  agentId?: string
  attachments?: Attachment[]
}

export interface Attachment {
  id: string
  type: 'image' | 'document' | 'link'
  url: string
  name: string
  size?: number
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}
