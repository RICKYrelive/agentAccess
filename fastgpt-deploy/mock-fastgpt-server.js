/**
 * Mock FastGPT API Server
 * 用于测试前端 FastGPT 集成功能
 */

import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

// 模拟数据存储
const workflows = new Map()
const workflowCounter = { value: 1 }

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mock FastGPT API Server' })
})

// 列出所有工作流
app.get('/v1/workflows', (req, res) => {
  const workflowList = Array.from(workflows.values()).map(w => ({
    id: w.id,
    name: w.name,
    type: 'workflow',
    intro: w.description || '',
    avatar: '',
    permission: 'owner',
    isPublish: w.isActive || false,
    createdAt: w.createdAt,
    updatedAt: w.updatedAt
  }))
  res.json(workflowList)
})

// 获取单个工作流
app.get('/v1/workflows/:id', (req, res) => {
  const workflow = workflows.get(req.params.id)
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow not found' })
  }

  const fastgptWorkflow = convertToFastGPTFormat(workflow)
  res.json(fastgptWorkflow)
})

// 创建工作流
app.post('/v1/workflows', (req, res) => {
  const { id, name, intro, type = 'workflow', nodes = [], edges = [] } = req.body

  const workflowId = id || `fastgpt-wf-${workflowCounter.value++}`

  const workflow = {
    id: workflowId,
    name: name || 'Untitled Workflow',
    description: intro,
    type,
    nodes: nodes || [],
    edges: edges || [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'mock-user'
  }

  workflows.set(workflowId, workflow)

  res.status(201).json({ id: workflowId })
})

// 更新工作流
app.put('/v1/workflows/:id', (req, res) => {
  const workflow = workflows.get(req.params.id)
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow not found' })
  }

  const updated = {
    ...workflow,
    ...req.body,
    id: workflow.id,
    updatedAt: new Date().toISOString()
  }

  workflows.set(req.params.id, updated)
  res.json({ success: true })
})

// 删除工作流
app.delete('/v1/workflows/:id', (req, res) => {
  const deleted = workflows.delete(req.params.id)
  if (!deleted) {
    return res.status(404).json({ error: 'Workflow not found' })
  }
  res.json({ success: true })
})

// 执行工作流
app.post('/v1/workflows/:id/run', (req, res) => {
  const workflow = workflows.get(req.params.id)
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow not found' })
  }

  const { input, streaming = false } = req.body

  // 模拟执行
  const result = {
    id: `exec-${Date.now()}`,
    workflowId: req.params.id,
    status: 'completed',
    output: `This is a mock FastGPT execution result for input: "${input}"\n\nWorkflow: ${workflow.name}\nNodes: ${workflow.nodes.length}\nEdges: ${workflow.edges.length}`,
    executionTime: 1500,
    referencedMaterials: [
      {
        id: 'ref-1',
        title: 'Mock Reference Material',
        content: 'This is simulated referenced content from the knowledge base.',
        source: 'Mock Knowledge Base',
        relevanceScore: 0.92
      }
    ]
  }

  res.json(result)
})

// 获取节点模板
app.get('/v1/node-templates', (req, res) => {
  const templates = [
    {
      flowNodeType: 'StartNode',
      name: '开始节点',
      intro: '工作流的入口点',
      avatar: 'start',
      categories: ['base'],
      inputs: [],
      outputs: [{ key: 'output', type: 'string', description: '起始输出' }]
    },
    {
      flowNodeType: 'DatasetSearchNode',
      name: '数据集检索',
      intro: '从数据集中检索相关内容',
      avatar: 'search',
      categories: ['dataset'],
      inputs: [
        { key: 'datasetId', type: 'select', required: true, description: '数据集ID' },
        { key: 'searchMode', type: 'select', description: '检索模式' },
        { key: 'limit', type: 'number', description: '返回数量' }
      ],
      outputs: [{ key: 'results', type: 'array', description: '搜索结果' }]
    },
    {
      flowNodeType: 'LLMNode',
      name: '大语言模型',
      intro: '使用LLM生成文本',
      avatar: 'llm',
      categories: ['llm'],
      inputs: [
        { key: 'model', type: 'select', required: true, description: '模型选择' },
        { key: 'temperature', type: 'number', description: '温度参数' },
        { key: 'maxTokens', type: 'number', description: '最大token数' },
        { key: 'prompt', type: 'textarea', description: '提示词' }
      ],
      outputs: [{ key: 'text', type: 'string', description: '生成文本' }]
    },
    {
      flowNodeType: 'EndNode',
      name: '结束节点',
      intro: '工作流的出口点',
      avatar: 'end',
      categories: ['base'],
      inputs: [{ key: 'input', type: 'any', description: '最终输出' }],
      outputs: []
    }
  ]

  res.json(templates)
})

// 获取数据集列表
app.get('/v1/datasets', (req, res) => {
  const datasets = [
    {
      id: 'ds-1',
      name: '示例知识库',
      type: 'dataset',
      avatar: '',
      intro: '这是一个示例知识库',
      permission: 'owner'
    },
    {
      id: 'ds-2',
      name: '产品文档',
      type: 'dataset',
      avatar: '',
      intro: '产品相关文档',
      permission: 'owner'
    }
  ]

  res.json(datasets)
})

// 获取模型列表
app.get('/v1/models', (req, res) => {
  const models = [
    {
      model: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      avatar: '',
      maxContext: 4096,
      maxTemperature: 2,
      minTemperature: 0,
      maxTokens: 4096
    },
    {
      model: 'gpt-4',
      name: 'GPT-4',
      avatar: '',
      maxContext: 8192,
      maxTemperature: 1,
      minTemperature: 0,
      maxTokens: 8192
    },
    {
      model: 'Qwen2.5-7B',
      name: 'Qwen 2.5 7B',
      avatar: '',
      maxContext: 32768,
      maxTemperature: 1,
      minTemperature: 0,
      maxTokens: 8192
    }
  ]

  res.json(models)
})

// 转换为 FastGPT 格式
function convertToFastGPTFormat(workflow) {
  return {
    id: workflow.id,
    name: workflow.name,
    intro: workflow.description || '',
    type: workflow.type,
    isPublic: true,
    permission: 'owner',
    nodes: workflow.nodes.map(node => ({
      nodeId: node.id,
      name: node.configuration?.name || node.type,
      intro: node.configuration?.description || '',
      flowNodeType: mapNodeToFastGPTType(node.type),
      position: node.position,
      inputs: getInputsForNode(node),
      outputs: getOutputsForNode(node)
    })),
    edges: workflow.connections.map(conn => ({
      id: conn.id,
      source: conn.sourceNodeId,
      target: conn.targetNodeId,
      sourceHandle: conn.sourceOutput || 'output',
      targetHandle: conn.targetInput || 'input'
    }))
  }
}

function mapNodeToFastGPTType(type) {
  const mapping = {
    'start': 'StartNode',
    'end': 'EndNode',
    'annotated-data-retrieval': 'DatasetSearchNode',
    'knowledge-retrieval': 'DatasetSearchNode',
    'question-rewrite': 'LLMNode',
    'answer-generation': 'LLMNode'
  }
  return mapping[type] || type
}

function getInputsForNode(node) {
  const config = node.configuration || {}
  switch (node.type) {
    case 'annotated-data-retrieval':
    case 'knowledge-retrieval':
      return [
        { key: 'datasetId', value: config.knowledgeBaseIds?.[0] || '', type: 'select' },
        { key: 'searchMode', value: config.retrievalMode || 'hybrid', type: 'select' },
        { key: 'limit', value: config.recallCount || 5, type: 'number' }
      ]
    case 'question-rewrite':
    case 'answer-generation':
      return [
        { key: 'model', value: config.model || 'Qwen2.5-7B', type: 'select' },
        { key: 'temperature', value: config.temperature || 0.5, type: 'number' },
        { key: 'maxTokens', value: config.maxTokens || 1000, type: 'number' },
        { key: 'prompt', value: config.prompt || '', type: 'textarea' }
      ]
    default:
      return []
  }
}

function getOutputsForNode(node) {
  switch (node.type) {
    case 'annotated-data-retrieval':
    case 'knowledge-retrieval':
      return [{ key: 'results', type: 'array', description: '搜索结果' }]
    case 'question-rewrite':
    case 'answer-generation':
      return [{ key: 'text', type: 'string', description: '生成文本' }]
    default:
      return []
  }
}

// 错误处理
app.use((err, req, res, next) => {
  console.error('Mock FastGPT API Error:', err)
  res.status(500).json({
    error: err.message || 'Internal Server Error',
    code: 'SERVER_ERROR'
  })
})

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    code: 'NOT_FOUND',
    path: req.path
  })
})

app.listen(PORT, () => {
  console.log(`Mock FastGPT API Server running on http://localhost:${PORT}`)
  console.log(`Available endpoints:`)
  console.log(`  GET  /api/health`)
  console.log(`  GET  /v1/workflows`)
  console.log(`  GET  /v1/workflows/:id`)
  console.log(`  POST /v1/workflows`)
  console.log(`  PUT  /v1/workflows/:id`)
  console.log(`  DELETE /v1/workflows/:id`)
  console.log(`  POST /v1/workflows/:id/run`)
  console.log(`  GET  /v1/node-templates`)
  console.log(`  GET  /v1/datasets`)
  console.log(`  GET  /v1/models`)
})
