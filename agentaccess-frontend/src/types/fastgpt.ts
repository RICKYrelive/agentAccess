// FastGPT API Types
// Based on FastGPT API specification

export interface FastGPTConfig {
  apiUrl: string
  apiKey: string
}

export interface FastGPTWorkflow {
  id: string
  name: string
  type: string
  version: string
  intro?: string
  avatar?: string
  permission: 'owner' | 'write' | 'read'
  isPublish: boolean
  publishTime?: string
  currentTime?: number
  dynamicType?: 'static' | 'dynamic'
  chatConfig?: FastGPTChatConfig
}

export interface FastGPTChatConfig {
  chatModel: string
  temperature: number
  maxToken: number
  maxHistoryLimit: number
}

export interface FastGPTNode {
  nodeId: string
  name: string
  intro: string
  flowNodeType: string
  position: {
    x: number
    y: number
  }
  inputs: FastGPTNodeInput[]
  outputs: FastGPTNodeOutput[]
  [key: string]: any
}

export interface FastGPTNodeInput {
  key: string
  value: any
  type?: string
  required?: boolean
  description?: string
}

export interface FastGPTNodeOutput {
  key: string
  value: any
  type?: string
  description?: string
}

export interface FastGPTEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
}

export interface FastGPTWorkflowTemplate {
  id: string
  name: string
  avatar?: string
  intro?: string
  type: string
  isPublic: boolean
  permission: 'owner' | 'write' | 'read'
  nodes: FastGPTNode[]
  edges: FastGPTEdge[]
}

export interface FastGPTExecutionRequest {
  workflowId: string
  input: string
  streaming?: boolean
  variables?: Record<string, any>
}

export interface FastGPTExecutionResponse {
  id: string
  workflowId: string
  status: 'running' | 'completed' | 'failed'
  output?: string
  error?: string
  executionTime?: number
  referencedMaterials?: FastGPTReferencedMaterial[]
}

export interface FastGPTReferencedMaterial {
  id: string
  title: string
  content: string
  source: string
  url?: string
  relevanceScore?: number
}

export interface FastGPTNodeTemplate {
  flowNodeType: string
  name: string
  intro: string
  avatar: string
  description: string
  isTool: boolean
  categories: string[]
  inputs: FastGPTNodeInput[]
  outputs: FastGPTNodeOutput[]
}

export interface FastGPTDataset {
  id: string
  name: string
  type: 'dataset' | 'folder'
  avatar?: string
  intro?: string
  parentId?: string
  permission: 'owner' | 'write' | 'read'
}

export interface FastGPTModel {
  model: string
  name: string
  avatar?: string
  maxContext: number
  maxTemperature: number
  minTemperature: number
  maxTokens: number
}

// Error types
export class FastGPTError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
  ) {
    super(message)
    this.name = 'FastGPTError'
  }
}

export class FastGPTAuthError extends FastGPTError {
  constructor(message: string) {
    super(message, 'AUTH_ERROR', 401)
    this.name = 'FastGPTAuthError'
  }
}

export class FastGPTConnectionError extends FastGPTError {
  constructor(message: string) {
    super(message, 'CONNECTION_ERROR', 0)
    this.name = 'FastGPTConnectionError'
  }
}

export class FastGPTValidationError extends FastGPTError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400)
    this.name = 'FastGPTValidationError'
  }
}
