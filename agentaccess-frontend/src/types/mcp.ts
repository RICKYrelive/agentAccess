export interface MCPService {
  id: string
  name: string
  description: string
  category: MCPServiceCategory
  isEnabled: boolean
  configuration?: MCPServiceConfig
  status: 'active' | 'inactive' | 'error'
  lastUsed?: Date
}

export interface MCPServiceCategory {
  id: string
  name: string
  description: string
  services: MCPService[]
}

export interface MCPServiceConfig {
  [key: string]: any
  // Common configuration options
  apiKey?: string
  endpoint?: string
  timeout?: number
  retryCount?: number
  // Service-specific options
  searchEngine?: 'google' | 'bing' | 'duckduckgo'
  maxResults?: number
  language?: string
}

export interface MCPServiceDefinition {
  id: string
  name: string
  description: string
  category: string
  defaultConfig: MCPServiceConfig
  schema: {
    [key: string]: {
      type: 'string' | 'number' | 'boolean' | 'array' | 'object'
      required?: boolean
      default?: any
      description?: string
      enum?: any[]
    }
  }
}
