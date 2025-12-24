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
