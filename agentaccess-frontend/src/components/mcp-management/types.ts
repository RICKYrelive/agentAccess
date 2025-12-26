// MCP Tool types
export type MCPToolType = 'builtin' | 'custom' | 'npx' | 'uvx'
export type MCPToolStatus = 'active' | 'inactive' | 'error'
export type GatewayStatus = 'running' | 'stopped' | 'error'
export type AuthType = 'none' | 'apikey' | 'bearer'

export interface MCPToolConfig {
  // Custom tool config
  url?: string
  authType?: AuthType
  apiKey?: string
  bearerToken?: string
  // npx/uvx config
  packageName?: string
  version?: string
  author?: string
}

export interface MCPTool {
  id: string
  name: string
  description: string
  type: MCPToolType
  category: string
  isEnabled: boolean
  status: MCPToolStatus
  config: MCPToolConfig
  createdAt: Date
  updatedAt: Date
}

export interface MCPGateway {
  id: string
  name: string
  description: string
  baseUrl: string
  mcpToolIds: string[]
  status: GatewayStatus
  createdAt: Date
  updatedAt: Date
}

// Form interfaces
export interface CustomToolFormData {
  name: string
  description: string
  url: string
  authType: AuthType
  apiKey?: string
  bearerToken?: string
}

export interface ImageDeploymentFormData {
  packageType: 'npx' | 'uvx'
  packageName: string
  version: string
}

export interface GatewayFormData {
  name: string
  description: string
  baseUrl: string
  mcpToolIds: string[]
}

// Builtin tools definition
export interface BuiltinToolDefinition {
  id: string
  name: string
  description: string
  category: string
  icon?: string
}
