import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import type { Workflow, WorkflowNode, WorkflowConnection, WorkflowTest } from '@/types/workflow'
import { createFastGPTService, getFastGPTService, type FastGPTService } from '@/services/fastgpt'
import type { FastGPTConfig } from '@/types/fastgpt'

const WORKFLOWS_STORAGE_KEY = 'agentaccess-workflows'
const CURRENT_WORKFLOW_KEY = 'agentaccess-current-workflow'

// Preset workflows for each agent
const PRESET_WORKFLOWS: Record<string, Workflow> = {
  'my-1': {
    id: 'my-1',
    name: '个人助理',
    description: '个人日常助手',
    nodes: [
      {
        id: 'start',
        type: 'start',
        position: { x: 100, y: 100 },
        configuration: {},
        status: 'idle',
      },
      {
        id: 'input-1',
        type: 'input',
        position: { x: 350, y: 100 },
        configuration: { inputType: 'text', placeholder: '请问有什么可以帮您？', required: true },
        status: 'idle',
      },
      {
        id: 'llm-1',
        type: 'llm-call',
        position: { x: 600, y: 100 },
        configuration: {
          model: 'Qwen2.5-7B',
          maxTokens: 2000,
          temperature: 0.7,
          systemPrompt: '你是一个友好、专业的个人助理，帮助用户处理日常事务。',
          streamOutput: false,
        },
        status: 'idle',
      },
      {
        id: 'output-1',
        type: 'output',
        position: { x: 850, y: 100 },
        configuration: { outputType: 'text', format: 'markdown' },
        status: 'idle',
      },
    ],
    connections: [
      {
        id: 'conn-1',
        sourceNodeId: 'start',
        targetNodeId: 'input-1',
        sourceOutput: 'output',
        targetInput: 'input',
      },
      {
        id: 'conn-2',
        sourceNodeId: 'input-1',
        targetNodeId: 'llm-1',
        sourceOutput: 'output',
        targetInput: 'input',
      },
      {
        id: 'conn-3',
        sourceNodeId: 'llm-1',
        targetNodeId: 'output-1',
        sourceOutput: 'output',
        targetInput: 'input',
      },
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'current-user',
  },
  'my-2': {
    id: 'my-2',
    name: '代码助手',
    description: '编程开发助手',
    nodes: [
      {
        id: 'start',
        type: 'start',
        position: { x: 100, y: 100 },
        configuration: {},
        status: 'idle',
      },
      {
        id: 'input-1',
        type: 'input',
        position: { x: 350, y: 100 },
        configuration: {
          inputType: 'text',
          placeholder: '请描述您的编程问题或需求...',
          required: true,
        },
        status: 'idle',
      },
      {
        id: 'llm-1',
        type: 'llm-call',
        position: { x: 600, y: 100 },
        configuration: {
          model: 'Qwen2.5-7B',
          maxTokens: 3000,
          temperature: 0.3,
          systemPrompt:
            '你是一个专业的编程助手，精通多种编程语言。提供清晰、可执行的代码示例和解释。',
          streamOutput: false,
        },
        status: 'idle',
      },
      {
        id: 'output-1',
        type: 'output',
        position: { x: 850, y: 100 },
        configuration: { outputType: 'text', format: 'markdown' },
        status: 'idle',
      },
    ],
    connections: [
      {
        id: 'conn-1',
        sourceNodeId: 'start',
        targetNodeId: 'input-1',
        sourceOutput: 'output',
        targetInput: 'input',
      },
      {
        id: 'conn-2',
        sourceNodeId: 'input-1',
        targetNodeId: 'llm-1',
        sourceOutput: 'output',
        targetInput: 'input',
      },
      {
        id: 'conn-3',
        sourceNodeId: 'llm-1',
        targetNodeId: 'output-1',
        sourceOutput: 'output',
        targetInput: 'input',
      },
    ],
    isActive: true,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
    createdBy: 'current-user',
  },
  'my-3': {
    id: 'my-3',
    name: '机电维修助手',
    description: '机电维修专家',
    nodes: [
      {
        id: 'start',
        type: 'start',
        position: { x: 100, y: 100 },
        configuration: {},
        status: 'idle',
      },
      {
        id: 'input-1',
        type: 'input',
        position: { x: 350, y: 100 },
        configuration: {
          inputType: 'text',
          placeholder: '请描述机电设备的故障现象...',
          required: true,
        },
        status: 'idle',
      },
      {
        id: 'knowledge-1',
        type: 'knowledge-retrieval',
        position: { x: 600, y: 50 },
        configuration: {
          retrievalMode: 'hybrid',
          retrievalWeight: 0.5,
          recallCount: 5,
          recallThreshold: 0.8,
        },
        status: 'idle',
      },
      {
        id: 'llm-1',
        type: 'llm-call',
        position: { x: 850, y: 100 },
        configuration: {
          model: 'Qwen2.5-7B',
          maxTokens: 2500,
          temperature: 0.5,
          systemPrompt:
            '你是一位经验丰富的机电维修专家（瑶哥），擅长诊断和解决各类机电设备故障。请基于检索的知识库信息，提供专业、实用的维修建议。',
          streamOutput: false,
        },
        status: 'idle',
      },
      {
        id: 'output-1',
        type: 'output',
        position: { x: 1100, y: 100 },
        configuration: { outputType: 'text', format: 'markdown' },
        status: 'idle',
      },
    ],
    connections: [
      {
        id: 'conn-1',
        sourceNodeId: 'start',
        targetNodeId: 'input-1',
        sourceOutput: 'output',
        targetInput: 'input',
      },
      {
        id: 'conn-2',
        sourceNodeId: 'input-1',
        targetNodeId: 'knowledge-1',
        sourceOutput: 'output',
        targetInput: 'input',
      },
      {
        id: 'conn-3',
        sourceNodeId: 'input-1',
        targetNodeId: 'llm-1',
        sourceOutput: 'output',
        targetInput: 'input',
      },
      {
        id: 'conn-4',
        sourceNodeId: 'knowledge-1',
        targetNodeId: 'llm-1',
        sourceOutput: 'output',
        targetInput: 'context',
      },
      {
        id: 'conn-5',
        sourceNodeId: 'llm-1',
        targetNodeId: 'output-1',
        sourceOutput: 'output',
        targetInput: 'input',
      },
    ],
    isActive: true,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
    createdBy: 'current-user',
  },
  'my-4': {
    id: 'my-4',
    name: '动环监控王师傅',
    description: '动环监控专家',
    nodes: [
      {
        id: 'start',
        type: 'start',
        position: { x: 100, y: 100 },
        configuration: {},
        status: 'idle',
      },
      {
        id: 'input-1',
        type: 'input',
        position: { x: 350, y: 100 },
        configuration: {
          inputType: 'text',
          placeholder: '请输入动环监控数据或问题...',
          required: true,
        },
        status: 'idle',
      },
      {
        id: 'knowledge-1',
        type: 'knowledge-retrieval',
        position: { x: 600, y: 50 },
        configuration: {
          retrievalMode: 'vector',
          retrievalWeight: 0.7,
          recallCount: 8,
          recallThreshold: 0.75,
        },
        status: 'idle',
      },
      {
        id: 'llm-1',
        type: 'llm-call',
        position: { x: 850, y: 100 },
        configuration: {
          model: 'Qwen2.5-7B',
          maxTokens: 2000,
          temperature: 0.4,
          systemPrompt:
            '你是动环监控专家王师傅，精通数据中心动力环境监控系统，包括UPS、空调、配电、温湿度等设备的监控和维护。',
          streamOutput: false,
        },
        status: 'idle',
      },
      {
        id: 'output-1',
        type: 'output',
        position: { x: 1100, y: 100 },
        configuration: { outputType: 'text', format: 'markdown' },
        status: 'idle',
      },
    ],
    connections: [
      {
        id: 'conn-1',
        sourceNodeId: 'start',
        targetNodeId: 'input-1',
        sourceOutput: 'output',
        targetInput: 'input',
      },
      {
        id: 'conn-2',
        sourceNodeId: 'input-1',
        targetNodeId: 'knowledge-1',
        sourceOutput: 'output',
        targetInput: 'input',
      },
      {
        id: 'conn-3',
        sourceNodeId: 'input-1',
        targetNodeId: 'llm-1',
        sourceOutput: 'output',
        targetInput: 'input',
      },
      {
        id: 'conn-4',
        sourceNodeId: 'knowledge-1',
        targetNodeId: 'llm-1',
        sourceOutput: 'output',
        targetInput: 'context',
      },
      {
        id: 'conn-5',
        sourceNodeId: 'llm-1',
        targetNodeId: 'output-1',
        sourceOutput: 'output',
        targetInput: 'input',
      },
    ],
    isActive: true,
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04'),
    createdBy: 'current-user',
  },
  'my-5': {
    id: 'my-5',
    name: '差旅助手TravelTang',
    description: '差旅规划助手',
    nodes: [
      {
        id: 'start',
        type: 'start',
        position: { x: 100, y: 100 },
        configuration: {},
        status: 'idle',
      },
      {
        id: 'input-1',
        type: 'input',
        position: { x: 350, y: 100 },
        configuration: {
          inputType: 'text',
          placeholder: '请输入您的差旅需求（出发地、目的地、时间等）...',
          required: true,
        },
        status: 'idle',
      },
      {
        id: 'search-1',
        type: 'web-search',
        position: { x: 600, y: 50 },
        configuration: { searchEngine: 'google', maxResults: 5, timeout: 10000 },
        status: 'idle',
      },
      {
        id: 'llm-1',
        type: 'llm-call',
        position: { x: 850, y: 100 },
        configuration: {
          model: 'Qwen2.5-7B',
          maxTokens: 2500,
          temperature: 0.6,
          systemPrompt:
            '你是专业的差旅规划助手TravelTang，帮助用户规划行程、推荐交通和住宿方案，并提供实用的旅行建议。',
          streamOutput: false,
        },
        status: 'idle',
      },
      {
        id: 'output-1',
        type: 'output',
        position: { x: 1100, y: 100 },
        configuration: { outputType: 'text', format: 'markdown' },
        status: 'idle',
      },
    ],
    connections: [
      {
        id: 'conn-1',
        sourceNodeId: 'start',
        targetNodeId: 'input-1',
        sourceOutput: 'output',
        targetInput: 'input',
      },
      {
        id: 'conn-2',
        sourceNodeId: 'input-1',
        targetNodeId: 'search-1',
        sourceOutput: 'output',
        targetInput: 'input',
      },
      {
        id: 'conn-3',
        sourceNodeId: 'input-1',
        targetNodeId: 'llm-1',
        sourceOutput: 'output',
        targetInput: 'input',
      },
      {
        id: 'conn-4',
        sourceNodeId: 'search-1',
        targetNodeId: 'llm-1',
        sourceOutput: 'output',
        targetInput: 'context',
      },
      {
        id: 'conn-5',
        sourceNodeId: 'llm-1',
        targetNodeId: 'output-1',
        sourceOutput: 'output',
        targetInput: 'input',
      },
    ],
    isActive: true,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    createdBy: 'current-user',
  },
}

export const useWorkflowStore = defineStore('workflow', () => {
  // State
  const workflows = ref<Workflow[]>([])
  const currentWorkflow = ref<Workflow | null>(null)
  const isInitialized = ref(false)
  const selectedNodeId = ref<string | null>(null)
  const isRunning = ref(false)
  const testResults = ref<WorkflowTest[]>([])

  // FastGPT Integration State
  const fastgptConnected = ref(false)
  const fastgptApiUrl = ref('')
  const fastgptApiKey = ref('')
  const fastgptWorkflows = ref<string[]>([])
  const fastgptConnectionError = ref<string | null>(null)
  const syncStatus = ref<'idle' | 'syncing' | 'synced' | 'error'>('idle')
  const useFastGPTExecution = ref(false)

  // Canvas Transform State
  const canvasScale = ref(1) // 0.5 to 2.0
  const canvasPan = ref({ x: 0, y: 0 })
  const isCanvasPanning = ref(false)
  const panStart = ref({ x: 0, y: 0 })

  // Preview Panel Visibility
  const isPreviewPanelVisible = ref(true)

  // Computed
  const currentNodes = computed(() => currentWorkflow.value?.nodes || [])
  const currentConnections = computed(() => currentWorkflow.value?.connections || [])

  // Storage functions
  const saveWorkflows = () => {
    if (!isInitialized.value) return
    try {
      const json = JSON.stringify(workflows.value)
      localStorage.setItem(WORKFLOWS_STORAGE_KEY, json)
    } catch (error) {
      console.error('Failed to save workflows:', error)
    }
  }

  const saveCurrentWorkflowId = () => {
    if (!isInitialized.value) return
    try {
      if (currentWorkflow.value) {
        localStorage.setItem(CURRENT_WORKFLOW_KEY, currentWorkflow.value.id)
      } else {
        localStorage.removeItem(CURRENT_WORKFLOW_KEY)
      }
    } catch (error) {
      console.error('Failed to save current workflow:', error)
    }
  }

  const loadWorkflows = () => {
    try {
      const saved = localStorage.getItem(WORKFLOWS_STORAGE_KEY)
      if (saved) {
        const data = JSON.parse(saved)
        workflows.value = data.map((w: any) => ({
          ...w,
          createdAt: new Date(w.createdAt),
          updatedAt: new Date(w.updatedAt),
        }))
      }
    } catch (error) {
      console.error('Failed to load workflows:', error)
    }
  }

  // Initialize: load from storage or use presets
  loadWorkflows()
  isInitialized.value = true

  // Watch for changes and auto-save
  watch(workflows, () => saveWorkflows(), { deep: true })
  watch(currentWorkflow, () => saveCurrentWorkflowId())

  // Actions
  const createWorkflow = (name: string) => {
    const workflow: Workflow = {
      id: `workflow-${Date.now()}`,
      name,
      nodes: [
        {
          id: 'start',
          type: 'start',
          position: { x: 100, y: 100 },
          configuration: {},
          status: 'idle',
        },
      ],
      connections: [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'current-user',
    }

    workflows.value.push(workflow)
    currentWorkflow.value = workflow
    return workflow
  }

  const addNode = (type: WorkflowNode['type'], position: { x: number; y: number }) => {
    if (!currentWorkflow.value) {
      createWorkflow('默认工作流')
    }

    const node: WorkflowNode = {
      id: `node-${Date.now()}`,
      type,
      position,
      configuration: getDefaultNodeConfig(type),
      status: 'idle',
    }

    // Use spread to trigger reactivity
    if (currentWorkflow.value) {
      currentWorkflow.value.nodes = [...currentWorkflow.value.nodes, node]
      currentWorkflow.value.updatedAt = new Date()
    }

    return node
  }

  const updateNode = (nodeId: string, updates: Partial<WorkflowNode>) => {
    if (!currentWorkflow.value) return

    const nodeIndex = currentWorkflow.value.nodes.findIndex((n) => n.id === nodeId)
    if (nodeIndex === -1) return

    const existingNode = currentWorkflow.value.nodes[nodeIndex]
    if (existingNode) {
      currentWorkflow.value.nodes[nodeIndex] = {
        id: existingNode.id,
        type: updates.type ?? existingNode.type,
        position: updates.position ?? existingNode.position,
        configuration: { ...existingNode.configuration, ...updates.configuration },
        status: updates.status ?? existingNode.status,
        result: updates.result ?? existingNode.result,
      }
      currentWorkflow.value.updatedAt = new Date()
    }
  }

  const deleteNode = (nodeId: string) => {
    if (!currentWorkflow.value) return

    // Remove connections related to this node
    currentWorkflow.value.connections = currentWorkflow.value.connections.filter(
      (conn) => conn.sourceNodeId !== nodeId && conn.targetNodeId !== nodeId,
    )

    // Remove the node
    currentWorkflow.value.nodes = currentWorkflow.value.nodes.filter((n) => n.id !== nodeId)
    currentWorkflow.value.updatedAt = new Date()

    // Clear selection if this node was selected
    if (selectedNodeId.value === nodeId) {
      selectedNodeId.value = null
    }
  }

  const addConnection = (sourceNodeId: string, targetNodeId: string) => {
    if (!currentWorkflow.value) return

    // Check if connection already exists
    const existingConnection = currentWorkflow.value.connections.find(
      (conn) => conn.sourceNodeId === sourceNodeId && conn.targetNodeId === targetNodeId,
    )

    if (existingConnection) return

    const connection: WorkflowConnection = {
      id: `conn-${Date.now()}`,
      sourceNodeId,
      targetNodeId,
      sourceOutput: 'output',
      targetInput: 'input',
    }

    // Use spread to trigger reactivity
    currentWorkflow.value.connections = [...currentWorkflow.value.connections, connection]
    currentWorkflow.value.updatedAt = new Date()
  }

  const deleteConnection = (connectionId: string) => {
    if (!currentWorkflow.value) return

    currentWorkflow.value.connections = currentWorkflow.value.connections.filter(
      (conn) => conn.id !== connectionId,
    )
    currentWorkflow.value.updatedAt = new Date()
  }

  const selectNode = (nodeId: string | null) => {
    selectedNodeId.value = nodeId
  }

  const getSelectedNode = () => {
    if (!selectedNodeId.value || !currentWorkflow.value) return null
    return currentWorkflow.value.nodes.find((n) => n.id === selectedNodeId.value) || null
  }

  /**
   * Connect to FastGPT server
   */
  const connectToFastGPT = async (apiUrl: string, apiKey: string) => {
    fastgptApiUrl.value = apiUrl
    fastgptApiKey.value = apiKey
    fastgptConnectionError.value = null

    try {
      const config: FastGPTConfig = { apiUrl, apiKey }
      const service = createFastGPTService(config)
      await service.authenticate()
      fastgptConnected.value = true
    } catch (error) {
      fastgptConnected.value = false
      fastgptConnectionError.value = error instanceof Error ? error.message : 'Connection failed'
      throw error
    }
  }

  /**
   * Disconnect from FastGPT
   */
  const disconnectFromFastGPT = () => {
    fastgptConnected.value = false
    fastgptApiUrl.value = ''
    fastgptApiKey.value = ''
    fastgptWorkflows.value = []
    fastgptConnectionError.value = null
    useFastGPTExecution.value = false
  }

  /**
   * Sync current workflow to FastGPT
   */
  const syncWorkflowToFastGPT = async () => {
    if (!currentWorkflow.value || !fastgptConnected.value) {
      throw new Error('No workflow to sync or not connected to FastGPT')
    }

    syncStatus.value = 'syncing'

    try {
      const service = getFastGPTService()
      if (!service) throw new Error('FastGPT service not initialized')

      // Check if workflow already exists on FastGPT
      if (fastgptWorkflows.value.includes(currentWorkflow.value.id)) {
        await service.updateWorkflow(currentWorkflow.value.id, currentWorkflow.value)
      } else {
        const fastgptId = await service.createWorkflow(currentWorkflow.value)
        // Store the FastGPT workflow ID
        currentWorkflow.value.fastgptId = fastgptId
        fastgptWorkflows.value.push(currentWorkflow.value.id)
      }

      syncStatus.value = 'synced'
    } catch (error) {
      syncStatus.value = 'error'
      throw error
    }
  }

  /**
   * Load workflow from FastGPT
   */
  const loadWorkflowFromFastGPT = async (fastgptWorkflowId: string) => {
    if (!fastgptConnected.value) {
      throw new Error('Not connected to FastGPT')
    }

    try {
      const service = getFastGPTService()
      if (!service) throw new Error('FastGPT service not initialized')

      const fastgptWorkflow = await service.getWorkflow(fastgptWorkflowId)
      const workflow = service.convertFromFastGPTFormat(fastgptWorkflow)

      workflows.value.push(workflow)
      currentWorkflow.value = workflow
      fastgptWorkflows.value.push(workflow.id)

      return workflow
    } catch (error) {
      throw error
    }
  }

  /**
   * Run workflow - uses FastGPT if connected, otherwise falls back to mock
   */
  const runWorkflow = async (input: string): Promise<WorkflowTest> => {
    if (!currentWorkflow.value) {
      throw new Error('No workflow selected')
    }

    isRunning.value = true

    const test: WorkflowTest = {
      id: `test-${Date.now()}`,
      workflowId: currentWorkflow.value.id,
      input,
      expectedOutput: undefined,
      actualOutput: undefined,
      status: 'running',
      executionTime: undefined,
      referencedMaterials: [],
      createdAt: new Date(),
      runAt: new Date(),
    }

    const startTime = Date.now()

    try {
      // Try to run on FastGPT if connected and enabled
      if (fastgptConnected.value && useFastGPTExecution.value) {
        const service = getFastGPTService()
        if (service && currentWorkflow.value.fastgptId) {
          const result = await service.runWorkflow(currentWorkflow.value.fastgptId, input)

          test.status = result.status === 'completed' ? 'passed' : 'failed'
          test.actualOutput = result.output
          test.executionTime = result.executionTime || Date.now() - startTime
          test.referencedMaterials =
            result.referencedMaterials?.map((m) => ({
              id: m.id,
              title: m.title,
              content: m.content,
              source: m.source,
              relevanceScore: m.relevanceScore || 0,
            })) || []

          isRunning.value = false
          testResults.value.push(test)
          return test
        }
      }

      // Fallback to mock execution
      await new Promise((resolve) => setTimeout(resolve, 2000))

      test.status = 'passed'
      test.actualOutput = 'This is a simulated workflow execution result'
      test.executionTime = Date.now() - startTime
      test.referencedMaterials = [
        {
          id: '1',
          title: 'Sample Reference',
          content: 'This is a referenced material from the knowledge base',
          source: 'Knowledge Base',
          relevanceScore: 0.95,
        },
      ]
    } catch (error) {
      test.status = 'failed'
      test.actualOutput = error instanceof Error ? error.message : 'Unknown error'
    } finally {
      isRunning.value = false
      testResults.value.push(test)
    }

    return test
  }

  const validateWorkflow = () => {
    if (!currentWorkflow.value) {
      return { valid: false, errors: ['No workflow selected'] }
    }

    const errors: string[] = []

    // Check if there's at least a start node
    const hasStartNode = currentWorkflow.value.nodes.some((n) => n.type === 'start')
    if (!hasStartNode) {
      errors.push('Workflow must have a start node')
    }

    // Check for disconnected nodes (except start node)
    const connectedNodeIds = new Set<string>()
    currentWorkflow.value.connections.forEach((conn) => {
      connectedNodeIds.add(conn.sourceNodeId)
      connectedNodeIds.add(conn.targetNodeId)
    })

    currentWorkflow.value.nodes.forEach((node) => {
      if (node.type !== 'start' && !connectedNodeIds.has(node.id)) {
        errors.push(`Node "${node.type}" is disconnected`)
      }
    })

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  /**
   * Set canvas scale (clamped between 0.5 and 2.0)
   */
  const setCanvasScale = (scale: number) => {
    canvasScale.value = Math.min(2, Math.max(0.5, scale))
  }

  /**
   * Set canvas pan position
   */
  const setCanvasPan = (x: number, y: number) => {
    canvasPan.value = { x, y }
  }

  /**
   * Reset canvas view to default
   */
  const resetCanvasView = () => {
    canvasScale.value = 1
    canvasPan.value = { x: 0, y: 0 }
  }

  /**
   * Fit all nodes in viewport
   */
  const fitCanvasToScreen = (viewportWidth: number, viewportHeight: number) => {
    if (!currentWorkflow.value || currentWorkflow.value.nodes.length === 0) {
      return
    }

    // Calculate bounding box of all nodes
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity
    currentWorkflow.value.nodes.forEach((node) => {
      minX = Math.min(minX, node.position.x)
      minY = Math.min(minY, node.position.y)
      maxX = Math.max(maxX, node.position.x + 200) // Assume node width
      maxY = Math.max(maxY, node.position.y + 100) // Assume node height
    })

    const contentWidth = maxX - minX
    const contentHeight = maxY - minY
    const padding = 100

    const scaleX = (viewportWidth - padding * 2) / contentWidth
    const scaleY = (viewportHeight - padding * 2) / contentHeight
    const newScale = Math.min(scaleX, scaleY, 1) // Don't zoom in, only out

    canvasScale.value = Math.max(0.5, Math.min(2, newScale))

    // Center the content
    const contentCenterX = (minX + maxX) / 2
    const contentCenterY = (minY + maxY) / 2
    canvasPan.value = {
      x: viewportWidth / 2 - contentCenterX * canvasScale.value,
      y: viewportHeight / 2 - contentCenterY * canvasScale.value,
    }
  }

  /**
   * Locate start node in center of viewport
   */
  const locateStartNode = (viewportWidth: number, viewportHeight: number) => {
    if (!currentWorkflow.value) return

    const startNode = currentWorkflow.value.nodes.find((n) => n.type === 'start')
    if (!startNode) return

    canvasScale.value = 1
    canvasPan.value = {
      x: viewportWidth / 2 - (startNode.position.x + 100), // Assume node width
      y: viewportHeight / 2 - (startNode.position.y + 50), // Assume node height
    }
  }

  /**
   * Toggle preview panel visibility
   */
  const togglePreviewPanel = () => {
    isPreviewPanelVisible.value = !isPreviewPanelVisible.value
  }

  /**
   * Update workflow name
   */
  const updateWorkflowName = (name: string) => {
    if (currentWorkflow.value) {
      currentWorkflow.value.name = name
      currentWorkflow.value.updatedAt = new Date()
    }
  }

  /**
   * Save current workflow as an agent to "我的 Agent"
   */
  const saveAsAgent = () => {
    if (!currentWorkflow.value) return null

    // Check if this workflow is already saved as an agent
    const existingIndex = workflows.value.findIndex((w) => w.id === currentWorkflow.value!.id)

    if (existingIndex !== -1) {
      // Update existing workflow
      workflows.value[existingIndex] = { ...currentWorkflow.value }
    } else {
      // Add to workflows list
      workflows.value.push({ ...currentWorkflow.value })
    }

    return currentWorkflow.value
  }

  /**
   * Load an agent from "我的 Agent"
   */
  const loadAgent = (agentId: string) => {
    // First, check if there's a preset workflow for this agent
    const presetWorkflow = PRESET_WORKFLOWS[agentId]
    if (presetWorkflow) {
      // Check if this workflow is already in our workflows list (user may have modified it)
      const existingWorkflow = workflows.value.find((w) => w.id === agentId)
      if (existingWorkflow) {
        // Load the user's modified version
        currentWorkflow.value = { ...existingWorkflow }
      } else {
        // Load the preset and add to workflows
        currentWorkflow.value = { ...presetWorkflow }
        workflows.value.push({ ...presetWorkflow })
      }
      resetCanvasView()
      return currentWorkflow.value
    }

    // Fall back to existing workflow in workflows array
    const agent = workflows.value.find((w) => w.id === agentId)
    if (agent) {
      currentWorkflow.value = { ...agent }
      resetCanvasView()
    }
    return agent
  }

  return {
    // State
    workflows,
    currentWorkflow,
    selectedNodeId,
    isRunning,
    testResults,

    // FastGPT State
    fastgptConnected,
    fastgptApiUrl,
    fastgptApiKey,
    fastgptWorkflows,
    fastgptConnectionError,
    syncStatus,
    useFastGPTExecution,

    // Canvas Transform State
    canvasScale,
    canvasPan,
    isCanvasPanning,
    panStart,
    isPreviewPanelVisible,

    // Computed
    currentNodes,
    currentConnections,

    // Actions
    createWorkflow,
    addNode,
    updateNode,
    deleteNode,
    addConnection,
    deleteConnection,
    selectNode,
    getSelectedNode,
    runWorkflow,
    validateWorkflow,

    // Canvas Transform Actions
    setCanvasScale,
    setCanvasPan,
    resetCanvasView,
    fitCanvasToScreen,
    locateStartNode,
    togglePreviewPanel,

    // Agent Management Actions
    updateWorkflowName,
    saveAsAgent,
    loadAgent,

    // FastGPT Actions
    connectToFastGPT,
    disconnectFromFastGPT,
    syncWorkflowToFastGPT,
    loadWorkflowFromFastGPT,
  }
})

function getDefaultNodeConfig(type: WorkflowNode['type']): any {
  switch (type) {
    case 'start':
      return {}
    case 'input':
      return {
        inputType: 'text',
        placeholder: '请输入您的问题...',
        required: true,
      }
    case 'web-search':
      return {
        searchEngine: 'google',
        maxResults: 10,
        timeout: 30000,
      }
    case 'annotated-data-retrieval':
      return {
        retrievalMode: 'keyword',
        maxResults: 10,
        threshold: 0.5,
      }
    case 'question-rewrite':
      return {
        model: 'Qwen2.5-7B',
        maxTokens: 500,
        temperature: 0.7,
        systemPrompt: '你是一个专业的问题助手，负责重写和优化用户问题。',
      }
    case 'knowledge-retrieval':
      return {
        retrievalMode: 'hybrid',
        retrievalWeight: 0.5,
        recallCount: 5,
        recallThreshold: 0.8,
      }
    case 'llm-call':
      return {
        model: 'Qwen2.5-7B',
        maxTokens: 2000,
        temperature: 0.7,
        systemPrompt: '',
        streamOutput: false,
      }
    case 'data-processing':
      return {
        operation: 'filter',
        rules: [],
      }
    case 'condition':
      return {
        conditionType: 'equals',
        compareValue: '',
        trueBranch: '',
        falseBranch: '',
      }
    case 'code-execution':
      return {
        language: 'python',
        code: '',
        timeout: 30000,
      }
    case 'output':
      return {
        outputType: 'text',
        format: 'markdown',
      }
    case 'end':
      return {}
    default:
      return {}
  }
}
