// MCP Tool types
export type MCPToolType = 'builtin' | 'custom' | 'npx' | 'uvx' | 'database'
export type MCPToolStatus = 'active' | 'inactive' | 'error' | 'updating'
export type GatewayStatus = 'running' | 'stopped' | 'error'
export type AuthType = 'none' | 'apikey' | 'bearer'
export type LoadBalancerStrategy = 'round-robin' | 'random' | 'least-used'

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
  // Database config
  databaseType?: 'postgresql' | 'mysql' | 'mongodb'
  host?: string
  port?: number
  username?: string
  password?: string
  databaseName?: string
  // Handler config
  handlerType?: 'python' | 'typescript'
  handlerCode?: string
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
  // New fields for enhanced UI
  latency?: number // in milliseconds
  lastSync?: Date
  usageCount?: number
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
  loadBalancerGroups?: LoadBalancerGroup[]
}

export interface HealthCheckConfig {
  enabled: boolean
  interval: number // seconds
  timeout: number // seconds
}

export interface LoadBalancerGroup {
  id: string
  name: string
  strategy: LoadBalancerStrategy
  toolIds: string[]
  healthCheck?: HealthCheckConfig
  createdAt: Date
  updatedAt: Date
}

export interface LoadBalancerGroupFormData {
  name: string
  strategy: LoadBalancerStrategy
  toolIds: string[]
  healthCheckEnabled: boolean
  healthCheckInterval: number
  healthCheckTimeout: number
}

// Form interfaces
export interface CustomToolFormData {
  name: string
  description: string
  url: string
  authType: AuthType
  apiKey?: string
  bearerToken?: string
  handlerType?: 'python' | 'typescript'
  handlerCode?: string
}

export interface DatabaseConnectionFormData {
  name: string
  description: string
  databaseType: 'postgresql' | 'mysql' | 'mongodb'
  host: string
  port: number
  username: string
  password: string
  databaseName: string
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
  loadBalancerGroups: LoadBalancerGroup[]
}

// Builtin tools definition
export interface BuiltinToolDefinition {
  id: string
  name: string
  description: string
  category: string
  icon?: string
}
