import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface AccessTemplateConfig {
  teamAgents: string[]
  knowledgeBase?: string
  mcpTools?: string[]
  systemTools?: string[]
  memory?: string
}

export interface AccessTemplatePermissions {
  type: 'owner' | 'team' | 'public' | 'specific'
  owner: string
  teamIds?: string[]
  userIds?: string[]
  allowCopy: boolean
}

export interface AccessTemplateStats {
  usageCount: number
  lastUsedAt?: Date
}

export interface AccessTemplate {
  id: string
  name: string
  description: string
  category: 'personal' | 'team' | 'public'
  config: AccessTemplateConfig
  permissions: AccessTemplatePermissions
  stats: AccessTemplateStats
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export const useAccessTemplateStore = defineStore('accessTemplate', () => {
  const templates = ref<AccessTemplate[]>([])
  const currentUserId = ref('user-current') // Mock current user ID

  // Mock data for development
  const initializeMockData = () => {
    const mockTemplates: Omit<AccessTemplate, 'id' | 'stats' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: '市场分析标准配置',
        description: '用于市场分析的标准配置，包含数据分析和报告生成相关的 Agent',
        category: 'personal',
        config: {
          teamAgents: ['team-agent-1'],
          knowledgeBase: 'kb-market-data',
          mcpTools: ['mcp-web-search', 'mcp-data-fetcher'],
          systemTools: ['browser', 'code-interpreter'],
          memory: 'mem-market-insights',
        },
        permissions: {
          type: 'owner',
          owner: 'user-current',
          allowCopy: false,
        },
        createdBy: 'user-current',
      },
      {
        name: '代码审查配置',
        description: '团队代码审查专用配置，包含代码分析 Agent 和相关工具',
        category: 'team',
        config: {
          teamAgents: ['team-agent-code-analyzer'],
          knowledgeBase: 'kb-code-standards',
          mcpTools: ['mcp-github'],
          systemTools: ['code-interpreter'],
        },
        permissions: {
          type: 'team',
          owner: 'user-lead',
          teamIds: ['team-dev'],
          allowCopy: true,
        },
        createdBy: 'user-lead',
      },
      {
        name: '快速问答',
        description: '简单的问答配置，无额外工具',
        category: 'personal',
        config: {
          teamAgents: [],
        },
        permissions: {
          type: 'owner',
          owner: 'user-current',
          allowCopy: false,
        },
        createdBy: 'user-current',
      },
      {
        name: '数据分析报告',
        description: '生成数据分析报告的完整配置',
        category: 'personal',
        config: {
          teamAgents: ['team-agent-statistics'],
          knowledgeBase: 'kb-data-formats',
          mcpTools: ['mcp-csv-reader', 'mcp-chart-generator'],
          systemTools: ['code-interpreter'],
          memory: 'mem-data-history',
        },
        permissions: {
          type: 'owner',
          owner: 'user-current',
          allowCopy: false,
        },
        createdBy: 'user-current',
      },
      {
        name: '团队协作助手',
        description: '团队共享的协作助手配置',
        category: 'team',
        config: {
          teamAgents: ['team-agent-collaboration'],
          knowledgeBase: 'kb-team-docs',
          systemTools: ['browser'],
        },
        permissions: {
          type: 'team',
          owner: 'user-manager',
          teamIds: ['team-dev', 'team-design'],
          allowCopy: true,
        },
        createdBy: 'user-manager',
      },
      {
        name: '公开示例 - 基础配置',
        description: '供新用户参考的基础配置示例',
        category: 'public',
        config: {
          teamAgents: [],
        },
        permissions: {
          type: 'public',
          owner: 'system',
          allowCopy: true,
        },
        createdBy: 'system',
      },
      {
        name: 'API 开发助手',
        description: 'API 开发和测试专用配置',
        category: 'personal',
        config: {
          teamAgents: [],
          mcpTools: ['mcp-rest-client', 'mcp-openapi-validator'],
          systemTools: ['code-interpreter', 'terminal'],
          memory: 'mem-api-docs',
        },
        permissions: {
          type: 'owner',
          owner: 'user-current',
          allowCopy: false,
        },
        createdBy: 'user-current',
      },
      {
        name: '文档生成配置',
        description: '技术文档生成专用配置',
        category: 'team',
        config: {
          teamAgents: ['team-agent-doc-reviewer'],
          knowledgeBase: 'kb-doc-templates',
          mcpTools: ['mcp-markdown-formatter'],
        },
        permissions: {
          type: 'team',
          owner: 'user-tech-writer',
          teamIds: ['team-docs'],
          allowCopy: true,
        },
        createdBy: 'user-tech-writer',
      },
      {
        name: '客户支持配置',
        description: '客户支持团队使用的配置',
        category: 'specific',
        config: {
          teamAgents: ['team-agent-knowledge-base'],
          knowledgeBase: 'kb-support-docs',
          memory: 'mem-support-history',
        },
        permissions: {
          type: 'specific',
          owner: 'user-support-lead',
          userIds: ['user-support-1', 'user-support-2', 'user-current'],
          allowCopy: false,
        },
        createdBy: 'user-support-lead',
      },
      {
        name: '机器学习实验',
        description: 'ML 实验和模型训练配置',
        category: 'personal',
        config: {
          teamAgents: [],
          mcpTools: ['mcp-python-env', 'mcp-tensorboard'],
          systemTools: ['code-interpreter'],
          memory: 'mem-ml-experiments',
        },
        permissions: {
          type: 'owner',
          owner: 'user-current',
          allowCopy: false,
        },
        createdBy: 'user-current',
      },
    ]

    templates.value = mockTemplates.map((t, index) => ({
      ...t,
      id: `template-${index + 1}`,
      stats: {
        usageCount: Math.floor(Math.random() * 100),
        lastUsedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      },
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    }))
  }

  // Initialize mock data on store creation
  initializeMockData()

  // CRUD operations
  const createTemplate = (data: Omit<AccessTemplate, 'id' | 'stats' | 'createdAt' | 'updatedAt'>) => {
    const newTemplate: AccessTemplate = {
      ...data,
      id: `template-${Date.now()}`,
      stats: {
        usageCount: 0,
        lastUsedAt: undefined,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    templates.value.push(newTemplate)
    return newTemplate
  }

  const updateTemplate = (id: string, updates: Partial<AccessTemplate>) => {
    const index = templates.value.findIndex((t) => t.id === id)
    if (index === -1) return null

    templates.value[index] = {
      ...templates.value[index],
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date(),
    }
    return templates.value[index]
  }

  const deleteTemplate = (id: string) => {
    const index = templates.value.findIndex((t) => t.id === id)
    if (index === -1) return false

    templates.value.splice(index, 1)
    return true
  }

  const getTemplate = (id: string) => {
    return templates.value.find((t) => t.id === id)
  }

  // Filter operations
  const getPersonalTemplates = () => {
    return templates.value.filter((t) => t.permissions.owner === currentUserId.value)
  }

  const getTeamTemplates = () => {
    const userTeamIds = ['team-dev', 'team-docs'] // Mock user team IDs
    return templates.value.filter((t) => {
      if (t.category !== 'team') return false
      if (t.permissions.type !== 'team') return false
      return t.permissions.teamIds?.some((teamId) => userTeamIds.includes(teamId))
    })
  }

  const getPublicTemplates = () => {
    return templates.value.filter((t) => t.category === 'public' || t.permissions.type === 'public')
  }

  const getSpecificTemplates = () => {
    return templates.value.filter((t) => {
      if (t.permissions.type !== 'specific') return false
      return t.permissions.userIds?.includes(currentUserId.value)
    })
  }

  // Permission checks
  const canAccessTemplate = (template: AccessTemplate, userId?: string) => {
    const uid = userId || currentUserId.value

    // Owner always has access
    if (template.permissions.owner === uid) return true

    // Public templates
    if (template.permissions.type === 'public') return true

    // Team templates
    if (template.permissions.type === 'team') {
      const userTeamIds = ['team-dev', 'team-docs'] // Mock user team IDs
      return template.permissions.teamIds?.some((teamId) => userTeamIds.includes(teamId))
    }

    // Specific user templates
    if (template.permissions.type === 'specific') {
      return template.permissions.userIds?.includes(uid)
    }

    return false
  }

  const canEditTemplate = (template: AccessTemplate, userId?: string) => {
    const uid = userId || currentUserId.value
    return template.permissions.owner === uid
  }

  const canCopyTemplate = (template: AccessTemplate, userId?: string) => {
    // Owner can always copy
    if (template.permissions.owner === userId || currentUserId.value) return true

    // Check allowCopy permission
    if (!template.permissions.allowCopy) return false

    // If can access, can copy (when allowed)
    return canAccessTemplate(template, userId)
  }

  // Statistics
  const incrementUsage = (templateId: string) => {
    const template = getTemplate(templateId)
    if (template) {
      template.stats.usageCount++
      template.stats.lastUsedAt = new Date()
    }
  }

  // Search and filter
  const searchTemplates = (query: string, category?: 'personal' | 'team' | 'public') => {
    let results = templates.value

    // Filter by category
    if (category === 'personal') {
      results = results.filter((t) => t.permissions.owner === currentUserId.value)
    } else if (category === 'team') {
      results = getTeamTemplates()
    } else if (category === 'public') {
      results = getPublicTemplates()
    }

    // Filter by search query
    if (query.trim()) {
      const lowerQuery = query.toLowerCase()
      results = results.filter(
        (t) =>
          t.name.toLowerCase().includes(lowerQuery) ||
          t.description.toLowerCase().includes(lowerQuery)
      )
    }

    return results
  }

  // Computed properties
  const personalTemplates = computed(() => getPersonalTemplates())
  const teamTemplates = computed(() => getTeamTemplates())
  const publicTemplates = computed(() => getPublicTemplates())
  const specificTemplates = computed(() => getSpecificTemplates())

  return {
    // State
    templates,
    currentUserId,

    // CRUD
    createTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplate,

    // Filters
    personalTemplates,
    teamTemplates,
    publicTemplates,
    specificTemplates,
    getPersonalTemplates,
    getTeamTemplates,
    getPublicTemplates,
    getSpecificTemplates,

    // Permissions
    canAccessTemplate,
    canEditTemplate,
    canCopyTemplate,

    // Statistics
    incrementUsage,

    // Search
    searchTemplates,
  }
})
