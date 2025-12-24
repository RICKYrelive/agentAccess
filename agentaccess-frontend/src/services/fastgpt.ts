/**
 * FastGPT Service
 *
 * Handles all interactions with FastGPT API including:
 * - Authentication and connection management
 * - Workflow CRUD operations
 * - Workflow execution
 * - Node template retrieval
 */

import axios, { type AxiosInstance, type AxiosError } from 'axios'
import type {
  FastGPTConfig,
  FastGPTWorkflow,
  FastGPTWorkflowTemplate,
  FastGPTExecutionRequest,
  FastGPTExecutionResponse,
  FastGPTNodeTemplate,
  FastGPTDataset,
  FastGPTModel,
  FastGPTNode,
  FastGPTEdge,
  FastGPTReferencedMaterial
} from '@/types/fastgpt'
import {
  FastGPTError,
  FastGPTAuthError,
  FastGPTConnectionError,
  FastGPTValidationError
} from '@/types/fastgpt'
import type { Workflow, WorkflowNode, WorkflowConnection } from '@/types/workflow'

export class FastGPTService {
  private client: AxiosInstance
  private config: FastGPTConfig
  private _isConnected: boolean = false

  constructor(config: FastGPTConfig) {
    this.config = config
    this.client = axios.create({
      baseURL: config.apiUrl,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    })

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => this.handleError(error)
    )
  }

  private handleError(error: AxiosError): never {
    if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
      throw new FastGPTConnectionError(
        'Unable to connect to FastGPT server. Please check if the server is running.'
      )
    }

    if (error.response) {
      const status = error.response.status
      const data = error.response.data as any

      switch (status) {
        case 401:
          throw new FastGPTAuthError(
            data?.message || 'Invalid API key. Please check your FastGPT API key.'
          )
        case 403:
          throw new FastGPTAuthError(
            data?.message || 'Access denied. Please check your permissions.'
          )
        case 400:
          throw new FastGPTValidationError(
            data?.message || 'Invalid request. Please check your input.'
          )
        case 404:
          throw new FastGPTError(
            data?.message || 'Resource not found.',
            'NOT_FOUND',
            404
          )
        default:
          throw new FastGPTError(
            data?.message || `FastGPT server error: ${status}`,
            'SERVER_ERROR',
            status
          )
      }
    }

    throw new FastGPTError('An unexpected error occurred', 'UNKNOWN_ERROR')
  }

  /**
   * Test connection to FastGPT server
   */
  async authenticate(): Promise<void> {
    try {
      // Try to fetch workflows as a connection test
      await this.listWorkflows()
      this._isConnected = true
    } catch (error) {
      this._isConnected = false
      throw error
    }
  }

  get isConnected(): boolean {
    return this._isConnected
  }

  /**
   * List all workflows from FastGPT
   */
  async listWorkflows(): Promise<FastGPTWorkflow[]> {
    const response = await this.client.get<FastGPTWorkflow[]>('/v1/workflows')
    return response.data
  }

  /**
   * Get a single workflow by ID
   */
  async getWorkflow(id: string): Promise<FastGPTWorkflowTemplate> {
    const response = await this.client.get<FastGPTWorkflowTemplate>(`/v1/workflows/${id}`)
    return response.data
  }

  /**
   * Create a new workflow in FastGPT
   */
  async createWorkflow(workflow: Workflow): Promise<string> {
    const fastgptWorkflow = this.convertToFastGPTFormat(workflow)
    const response = await this.client.post<{ id: string }>('/v1/workflows', fastgptWorkflow)
    return response.data.id
  }

  /**
   * Update an existing workflow in FastGPT
   */
  async updateWorkflow(id: string, workflow: Workflow): Promise<void> {
    const fastgptWorkflow = this.convertToFastGPTFormat(workflow)
    await this.client.put(`/v1/workflows/${id}`, fastgptWorkflow)
  }

  /**
   * Delete a workflow from FastGPT
   */
  async deleteWorkflow(id: string): Promise<void> {
    await this.client.delete(`/v1/workflows/${id}`)
  }

  /**
   * Run a workflow execution
   */
  async runWorkflow(workflowId: string, input: string): Promise<FastGPTExecutionResponse> {
    const request: FastGPTExecutionRequest = {
      workflowId,
      input,
      streaming: false
    }
    const response = await this.client.post<FastGPTExecutionResponse>(
      `/v1/workflows/${workflowId}/run`,
      request
    )
    return response.data
  }

  /**
   * Run workflow with streaming support
   */
  async runWorkflowStreaming(
    workflowId: string,
    input: string,
    onChunk: (chunk: string) => void,
    onComplete: (result: FastGPTExecutionResponse) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    const request: FastGPTExecutionRequest = {
      workflowId,
      input,
      streaming: true
    }

    try {
      const response = await this.client.post<FastGPTExecutionResponse>(
        `/v1/workflows/${workflowId}/run`,
        request,
        { responseType: 'text' }
      )

      // For streaming, we'd use EventSource or similar
      // For now, just return the complete response
      onComplete(response.data)
    } catch (error) {
      onError(error as Error)
    }
  }

  /**
   * Get available node templates
   */
  async getNodeTemplates(): Promise<FastGPTNodeTemplate[]> {
    const response = await this.client.get<FastGPTNodeTemplate[]>('/v1/node-templates')
    return response.data
  }

  /**
   * Get available datasets
   */
  async getDatasets(): Promise<FastGPTDataset[]> {
    const response = await this.client.get<FastGPTDataset[]>('/v1/datasets')
    return response.data
  }

  /**
   * Get available models
   */
  async getModels(): Promise<FastGPTModel[]> {
    const response = await this.client.get<FastGPTModel[]>('/v1/models')
    return response.data
  }

  /**
   * Convert AgentAccess workflow format to FastGPT format
   */
  convertToFastGPTFormat(workflow: Workflow): FastGPTWorkflowTemplate {
    const nodes: FastGPTNode[] = workflow.nodes.map(node => ({
      nodeId: node.id,
      name: node.configuration.name || node.type,
      intro: node.configuration.description || '',
      flowNodeType: this.mapNodeToFastGPTType(node.type),
      position: node.position,
      inputs: this.convertNodeInputs(node),
      outputs: this.convertNodeOutputs(node),
      ...this.getNodeSpecificConfig(node)
    }))

    const edges: FastGPTEdge[] = workflow.connections.map(conn => ({
      id: conn.id,
      source: conn.sourceNodeId,
      target: conn.targetNodeId,
      sourceHandle: conn.sourceOutput,
      targetHandle: conn.targetInput
    }))

    return {
      id: workflow.id,
      name: workflow.name,
      intro: workflow.description,
      type: 'workflow',
      isPublic: false,
      permission: 'owner',
      nodes,
      edges
    }
  }

  /**
   * Convert FastGPT format to AgentAccess format
   */
  convertFromFastGPTFormat(fastgptWorkflow: FastGPTWorkflowTemplate): Workflow {
    const nodes: WorkflowNode[] = fastgptWorkflow.nodes.map(node => {
      const nodeType = this.mapFastGPTNodeToAgentAccessType(node.flowNodeType) as WorkflowNode['type']
      return {
        id: node.nodeId,
        type: nodeType,
        position: node.position,
        configuration: {
          name: node.name,
          description: node.intro,
          ...this.extractNodeConfig(node)
        },
        status: 'idle'
      }
    })

    const connections: WorkflowConnection[] = fastgptWorkflow.edges.map(edge => ({
      id: edge.id,
      sourceNodeId: edge.source,
      targetNodeId: edge.target,
      sourceOutput: edge.sourceHandle || 'output',
      targetInput: edge.targetHandle || 'input'
    }))

    return {
      id: fastgptWorkflow.id,
      name: fastgptWorkflow.name,
      description: fastgptWorkflow.intro,
      nodes,
      connections,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'fastgpt-import'
    }
  }

  /**
   * Map AgentAccess node type to FastGPT node type
   */
  private mapNodeToFastGPTType(nodeType: string): string {
    const mapping: Record<string, string> = {
      'start': 'StartNode',
      'end': 'EndNode',
      'annotated-data-retrieval': 'DatasetSearchNode',
      'knowledge-retrieval': 'DatasetSearchNode',
      'question-rewrite': 'LLMNode',
      'answer-generation': 'LLMNode'
    }
    return mapping[nodeType] || nodeType
  }

  /**
   * Map FastGPT node type to AgentAccess node type
   */
  private mapFastGPTNodeToAgentAccessType(flowNodeType: string): string {
    const mapping: Record<string, string> = {
      'StartNode': 'start',
      'EndNode': 'end',
      'DatasetSearchNode': 'knowledge-retrieval',
      'LLMNode': 'answer-generation',
      'HttpNode': 'annotated-data-retrieval',
      'CodeNode': 'question-rewrite'
    }
    return mapping[flowNodeType] || flowNodeType.toLowerCase().replace('node', '-')
  }

  /**
   * Convert node configuration to FastGPT inputs
   */
  private convertNodeInputs(node: WorkflowNode): any[] {
    const inputs: any[] = []

    switch (node.type) {
      case 'annotated-data-retrieval':
      case 'knowledge-retrieval':
        inputs.push({
          key: 'datasetId',
          value: node.configuration.knowledgeBaseIds?.[0] || '',
          type: 'select',
          required: true,
          description: 'Knowledge base to search'
        })
        inputs.push({
          key: 'retrievalMode',
          value: node.configuration.retrievalMode || 'hybrid',
          type: 'select',
          description: 'Retrieval mode'
        })
        inputs.push({
          key: 'limit',
          value: node.configuration.recallCount || 5,
          type: 'number',
          description: 'Max results to return'
        })
        break
      case 'question-rewrite':
      case 'answer-generation':
        inputs.push({
          key: 'model',
          value: node.configuration.model || 'Qwen2.5-7B',
          type: 'select',
          required: true,
          description: 'LLM model to use'
        })
        inputs.push({
          key: 'temperature',
          value: node.configuration.temperature || 0.5,
          type: 'number',
          description: 'Temperature (0-1)'
        })
        inputs.push({
          key: 'maxTokens',
          value: node.configuration.maxTokens || 1000,
          type: 'number',
          description: 'Maximum tokens to generate'
        })
        inputs.push({
          key: 'prompt',
          value: node.configuration.prompt || '',
          type: 'textarea',
          description: 'Custom prompt'
        })
        break
    }
    return inputs
  }

  /**
   * Convert node configuration to FastGPT outputs
   */
  private convertNodeOutputs(node: WorkflowNode): any[] {
    const outputs: any[] = []

    switch (node.type) {
      case 'annotated-data-retrieval':
      case 'knowledge-retrieval':
        outputs.push({
          key: 'results',
          type: 'array',
          description: 'Search results'
        })
        break
      case 'question-rewrite':
      case 'answer-generation':
        outputs.push({
          key: 'text',
          type: 'string',
          description: 'Generated text'
        })
        break
    }
    return outputs
  }

  /**
   * Get node-specific configuration for FastGPT
   */
  private getNodeSpecificConfig(node: WorkflowNode): any {
    const config: any = {}

    switch (node.type) {
      case 'annotated-data-retrieval':
      case 'knowledge-retrieval':
        config.datasetId = node.configuration.knowledgeBaseIds?.[0]
        config.searchMode = node.configuration.retrievalMode || 'hybrid'
        config.limit = node.configuration.recallCount || 5
        config.threshold = node.configuration.recallThreshold || 0.5
        break
      case 'question-rewrite':
      case 'answer-generation':
        config.model = node.configuration.model || 'Qwen2.5-7B'
        config.temperature = node.configuration.temperature || 0.5
        config.maxTokens = node.configuration.maxTokens || 1000
        config.prompt = node.configuration.prompt || ''
        break
    }
    return config
  }

  /**
   * Extract node configuration from FastGPT node
   */
  private extractNodeConfig(node: FastGPTNode): any {
    const config: any = {}

    for (const input of node.inputs) {
      config[input.key] = input.value
    }
    return config
  }
}

// Singleton instance
let serviceInstance: FastGPTService | null = null

export function createFastGPTService(config: FastGPTConfig): FastGPTService {
  serviceInstance = new FastGPTService(config)
  return serviceInstance
}

export function getFastGPTService(): FastGPTService | null {
  return serviceInstance
}
