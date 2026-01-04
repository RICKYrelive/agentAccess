export interface Workflow {
  id: string
  name: string
  description?: string
  nodes: WorkflowNode[]
  connections: WorkflowConnection[]
  knowledgeBaseId?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  createdBy: string
  fastgptId?: string // ID of the workflow in FastGPT server
}

export interface WorkflowNode {
  id: string
  type: WorkflowNodeType
  position: { x: number; y: number }
  configuration: NodeConfiguration
  status: 'idle' | 'running' | 'completed' | 'error'
  result?: any
}

export interface WorkflowConnection {
  id: string
  sourceNodeId: string
  targetNodeId: string
  sourceOutput: string
  targetInput: string
}

export type WorkflowNodeType =
  | 'start'
  | 'input'
  | 'web-search'
  | 'annotated-data-retrieval'
  | 'question-rewrite'
  | 'knowledge-retrieval'
  | 'llm-call'
  | 'data-processing'
  | 'condition'
  | 'code-execution'
  | 'output'
  | 'answer-generation'
  | 'end'

export interface NodeConfiguration {
  [key: string]: any
  // Common configuration
  name?: string
  description?: string
  timeout?: number

  // Node-specific configuration
  retrievalMode?: 'vector' | 'keyword' | 'hybrid'
  retrievalWeight?: number
  recallCount?: number
  recallThreshold?: number
  knowledgeBaseIds?: string[]
  model?: string
  prompt?: string
  maxTokens?: number
  temperature?: number
}

export interface WorkflowTest {
  id: string
  workflowId: string
  input: string
  expectedOutput?: string
  actualOutput?: string
  status: 'pending' | 'running' | 'passed' | 'failed'
  executionTime?: number
  referencedMaterials?: ReferencedMaterial[]
  createdAt: Date
  runAt?: Date
}

export interface ReferencedMaterial {
  id: string
  title: string
  content: string
  source: string
  url?: string
  relevanceScore: number
}
