import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  MCPTool,
  MCPGateway,
  MCPToolConfig,
  MCPToolType,
  BuiltinToolDefinition,
  LoadBalancerGroup,
  LoadBalancerGroupFormData,
  HealthCheckConfig,
} from '@/components/mcp-management/types'

// Builtin tools catalog (available for import)
export const BUILTIN_TOOLS: BuiltinToolDefinition[] = [
  {
    id: 'builtin-translation',
    name: '翻译助手',
    description: '多语言翻译工具，支持多种语言互译',
    category: 'utility',
  },
  {
    id: 'builtin-code-analysis',
    name: '代码分析',
    description: '代码质量分析和优化建议',
    category: 'development',
  },
  {
    id: 'builtin-web-search',
    name: '网络搜索',
    description: '网络搜索和信息检索工具',
    category: 'search',
  },
  {
    id: 'builtin-file-operations',
    name: '文件操作',
    description: '文件读写和管理工具',
    category: 'utility',
  },
  {
    id: 'builtin-database',
    name: '数据库查询',
    description: 'SQL 数据库查询和管理',
    category: 'database',
  },
  {
    id: 'builtin-ocr',
    name: 'OCR 识别',
    description: '图片文字识别工具',
    category: 'utility',
  },
  {
    id: 'builtin-time',
    name: '时间工具',
    description: '获取当前时间和时区信息',
    category: 'utility',
  },
]

export const useMCPManagementStore = defineStore('mcpManagement', () => {
  // State
  const mcpTools = ref<MCPTool[]>([
    {
      id: 'builtin-translation-1',
      name: '翻译助手',
      description: '多语言翻译工具',
      type: 'builtin',
      category: 'utility',
      isEnabled: true,
      status: 'active',
      config: {},
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 'custom-github-1',
      name: 'GitHub MCP',
      description: 'GitHub 集成工具',
      type: 'custom',
      category: 'development',
      isEnabled: true,
      status: 'active',
      config: {
        url: 'https://api.github.com/mcp',
        authType: 'apikey',
        apiKey: '***',
      },
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
  ])

  const mcpGateways = ref<MCPGateway[]>([
    {
      id: 'gateway-1',
      name: 'API 网关',
      description: '统一 API 管理网关',
      baseUrl: 'https://api.example.com',
      mcpToolIds: ['custom-github-1'],
      status: 'running',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  ])

  // Computed
  const activeTools = computed(() => mcpTools.value.filter((t) => t.isEnabled))
  const builtinTools = computed(() => mcpTools.value.filter((t) => t.type === 'builtin'))
  const customTools = computed(() => mcpTools.value.filter((t) => t.type === 'custom'))
  const imageTools = computed(() =>
    mcpTools.value.filter((t) => t.type === 'npx' || t.type === 'uvx'),
  )

  // Actions
  const createMCPTool = (tool: Omit<MCPTool, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTool: MCPTool = {
      ...tool,
      id: `mcp-tool-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mcpTools.value.push(newTool)
    return newTool
  }

  const updateMCPTool = (id: string, updates: Partial<MCPTool>) => {
    const index = mcpTools.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      mcpTools.value[index] = {
        ...mcpTools.value[index],
        ...updates,
        updatedAt: new Date(),
      }
    }
  }

  const deleteMCPTool = (id: string) => {
    const index = mcpTools.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      mcpTools.value.splice(index, 1)
    }
  }

  const toggleMCPTool = (id: string) => {
    const tool = mcpTools.value.find((t) => t.id === id)
    if (tool) {
      tool.isEnabled = !tool.isEnabled
      tool.status = tool.isEnabled ? 'active' : 'inactive'
      tool.updatedAt = new Date()
    }
  }

  const importBuiltinTool = (builtinToolId: string) => {
    const builtinDef = BUILTIN_TOOLS.find((t) => t.id === builtinToolId)
    if (!builtinDef) return null

    // Check if already imported
    const existing = mcpTools.value.find(
      (t) => t.type === 'builtin' && t.name === builtinDef.name,
    )
    if (existing) {
      // Just enable it
      existing.isEnabled = true
      existing.status = 'active'
      return existing
    }

    // Create new tool from builtin definition
    return createMCPTool({
      name: builtinDef.name,
      description: builtinDef.description,
      type: 'builtin',
      category: builtinDef.category,
      isEnabled: true,
      status: 'active',
      config: {},
    })
  }

  const getTool = (id: string) => {
    return mcpTools.value.find((t) => t.id === id)
  }

  // Gateway actions
  const createGateway = (gateway: Omit<MCPGateway, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newGateway: MCPGateway = {
      ...gateway,
      id: `gateway-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mcpGateways.value.push(newGateway)
    return newGateway
  }

  const updateGateway = (id: string, updates: Partial<MCPGateway>) => {
    const index = mcpGateways.value.findIndex((g) => g.id === id)
    if (index !== -1) {
      mcpGateways.value[index] = {
        ...mcpGateways.value[index],
        ...updates,
        updatedAt: new Date(),
      }
    }
  }

  const deleteGateway = (id: string) => {
    const index = mcpGateways.value.findIndex((g) => g.id === id)
    if (index !== -1) {
      mcpGateways.value.splice(index, 1)
    }
  }

  const getGateway = (id: string) => {
    return mcpGateways.value.find((g) => g.id === id)
  }

  const getGatewayTools = (gatewayId: string) => {
    const gateway = getGateway(gatewayId)
    if (!gateway) return []
    return mcpTools.value.filter((t) => gateway.mcpToolIds.includes(t.id))
  }

  // Load Balancer Group actions
  const createLoadBalancerGroup = (group: Omit<LoadBalancerGroup, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newGroup: LoadBalancerGroup = {
      ...group,
      id: `lb-group-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    return newGroup
  }

  const updateLoadBalancerGroup = (group: LoadBalancerGroup, updates: Partial<LoadBalancerGroup>) => {
    return {
      ...group,
      ...updates,
      updatedAt: new Date(),
    }
  }

  const deleteLoadBalancerGroup = () => {
    // Load balancer groups are managed within the gateway context
    // This is a placeholder for potential future standalone management
  }

  const addToolToGroup = (group: LoadBalancerGroup, toolId: string) => {
    if (!group.toolIds.includes(toolId)) {
      group.toolIds.push(toolId)
    }
    return updateLoadBalancerGroup(group, {})
  }

  const removeToolFromGroup = (group: LoadBalancerGroup, toolId: string) => {
    const index = group.toolIds.indexOf(toolId)
    if (index !== -1) {
      group.toolIds.splice(index, 1)
    }
    return updateLoadBalancerGroup(group, {})
  }

  return {
    // State
    mcpTools,
    mcpGateways,
    BUILTIN_TOOLS,

    // Computed
    activeTools,
    builtinTools,
    customTools,
    imageTools,

    // Tool actions
    createMCPTool,
    updateMCPTool,
    deleteMCPTool,
    toggleMCPTool,
    importBuiltinTool,
    getTool,

    // Gateway actions
    createGateway,
    updateGateway,
    deleteGateway,
    getGateway,
    getGatewayTools,

    // Load Balancer Group actions
    createLoadBalancerGroup,
    updateLoadBalancerGroup,
    deleteLoadBalancerGroup,
    addToolToGroup,
    removeToolFromGroup,
  }
})
