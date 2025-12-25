import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Agent, ExtendedAgent, SharingGroup } from '@/types'
import type { Workflow } from '@/types/workflow'
import { useWorkflowStore } from './workflow'

export const useAgentsStore = defineStore('agents', () => {
  // State
  const myAgents = ref<ExtendedAgent[]>([
    {
      id: 'my-1',
      name: '个人助理小助手',
      type: 'personal',
      category: 'personal',
      description: '个人日常助手',
      tags: ['助手', '日常', 'AI'],
      sharedGroups: [],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      lastUsedAt: new Date(), // Recently used
    },
    {
      id: 'my-2',
      name: '代码助手',
      type: 'personal',
      category: 'coding',
      description: '编程开发助手',
      tags: ['编程', '开发'],
      sharedGroups: [],
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
      lastUsedAt: new Date(Date.now() - 3600000), // Used 1 hour ago
    },
    {
      id: 'my-3',
      name: '机电维修助手瑶哥',
      type: 'specialized',
      category: 'specialized',
      description: '机电维修专家',
      tags: ['维修', '机电'],
      sharedGroups: [],
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03'),
      lastUsedAt: new Date(Date.now() - 7200000), // Used 2 hours ago
    },
    {
      id: 'my-4',
      name: '动环监控王师傅',
      type: 'specialized',
      category: 'specialized',
      description: '动环监控专家',
      tags: ['监控'],
      sharedGroups: [],
      createdAt: new Date('2024-01-04'),
      updatedAt: new Date('2024-01-04'),
    },
    {
      id: 'my-5',
      name: '差旅助手TravelTang',
      type: 'specialized',
      category: 'specialized',
      description: '差旅规划助手',
      tags: ['差旅', '规划'],
      sharedGroups: [],
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-05'),
    },
  ])

  const teamAgents = ref<Agent[]>([
    {
      id: 'team-1',
      name: '智能数据分析',
      type: 'team',
      category: 'analysis',
      description: '提供高质量洞察服务，帮助企业实时获取在风险检测、产品研究、品牌监控等洞察',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    },
    {
      id: 'team-2',
      name: '写作助手',
      type: 'team',
      category: 'writing',
      description: '智能写作辅助，帮助您快速创建高质量文档内容',
      icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      id: 'team-3',
      name: '股市基本面分析',
      type: 'team',
      category: 'finance',
      description: '专业的股市分析工具，提供深度的基本面分析和投资建议',
      icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
    },
  ])

  // New state for sharing groups
  const sharingGroups = ref<SharingGroup[]>([
    {
      id: 'group-1',
      name: '研发部',
      description: '研发团队共享组',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: 'group-2',
      name: '市场部',
      description: '市场营销团队共享组',
      createdAt: new Date('2024-01-02'),
    },
  ])

  // Computed
  const allAgents = computed(() => [...myAgents.value, ...teamAgents.value])

  // Get top N recently used agents
  const getRecentAgents = (limit: number = 3): ExtendedAgent[] => {
    return [...myAgents.value]
      .filter((agent) => agent.lastUsedAt)
      .sort((a, b) => (b.lastUsedAt?.getTime() || 0) - (a.lastUsedAt?.getTime() || 0))
      .slice(0, limit)
  }

  // Actions
  const getAgentById = (id: string): ExtendedAgent | Agent | undefined => {
    return allAgents.value.find((agent) => agent.id === id)
  }

  const addMyAgent = (agent: ExtendedAgent) => {
    myAgents.value.push(agent)
  }

  const removeMyAgent = (id: string) => {
    const index = myAgents.value.findIndex((agent) => agent.id === id)
    if (index > -1) {
      myAgents.value.splice(index, 1)
    }
  }

  const updateMyAgent = (id: string, updates: Partial<ExtendedAgent>) => {
    const agent = myAgents.value.find((a) => a.id === id)
    if (agent) {
      Object.assign(agent, updates)
      agent.updatedAt = new Date()
    }
  }

  const addTeamAgent = (agent: Agent) => {
    teamAgents.value.push(agent)
  }

  const removeTeamAgent = (id: string) => {
    const index = teamAgents.value.findIndex((agent) => agent.id === id)
    if (index > -1) {
      teamAgents.value.splice(index, 1)
    }
  }

  const updateTeamAgent = (id: string, updates: Partial<Agent>) => {
    const agent = teamAgents.value.find((a) => a.id === id)
    if (agent) {
      Object.assign(agent, updates)
    }
  }

  // Mark agent as used (updates lastUsedAt)
  const markAgentAsUsed = (agentId: string) => {
    const agent = myAgents.value.find((a) => a.id === agentId)
    if (agent) {
      agent.lastUsedAt = new Date()
      agent.updatedAt = new Date()
    }
  }

  // Update agent tags (max 3)
  const updateAgentTags = (agentId: string, tags: string[]) => {
    const agent = myAgents.value.find((a) => a.id === agentId)
    if (agent) {
      agent.tags = tags.slice(0, 3) // Limit to 3 tags
      agent.updatedAt = new Date()
    }
  }

  // Add a new sharing group
  const addSharingGroup = (name: string, description?: string): SharingGroup => {
    const group: SharingGroup = {
      id: `group-${Date.now()}`,
      name,
      description,
      createdAt: new Date(),
    }
    sharingGroups.value.push(group)
    return group
  }

  // Remove a sharing group
  const removeSharingGroup = (groupId: string) => {
    const index = sharingGroups.value.findIndex((g) => g.id === groupId)
    if (index > -1) {
      sharingGroups.value.splice(index, 1)
    }
    // Remove the group from all agents' sharedGroups
    myAgents.value.forEach((agent) => {
      if (agent.sharedGroups) {
        agent.sharedGroups = agent.sharedGroups.filter((id) => id !== groupId)
      }
    })
  }

  // Share agent with a group
  const shareAgentWithGroup = (agentId: string, groupId: string) => {
    const agent = myAgents.value.find((a) => a.id === agentId)
    if (agent) {
      if (!agent.sharedGroups) {
        agent.sharedGroups = []
      }
      if (!agent.sharedGroups.includes(groupId)) {
        agent.sharedGroups.push(groupId)
        agent.updatedAt = new Date()
      }
    }
  }

  // Unshare agent from a group
  const unshareAgentFromGroup = (agentId: string, groupId: string) => {
    const agent = myAgents.value.find((a) => a.id === agentId)
    if (agent && agent.sharedGroups) {
      agent.sharedGroups = agent.sharedGroups.filter((id) => id !== groupId)
      agent.updatedAt = new Date()
    }
  }

  // Import third-party agent (stub for now)
  const importThirdPartyAgent = async (data: any): Promise<ExtendedAgent> => {
    // TODO: Implement actual import logic
    const agent: ExtendedAgent = {
      id: `imported-${Date.now()}`,
      name: data.name || 'Imported Agent',
      type: 'personal',
      category: 'personal',
      description: data.description,
      isThirdParty: true,
      tags: data.tags?.slice(0, 3) || [],
      sharedGroups: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    addMyAgent(agent)
    return agent
  }

  // Get agents shared with a specific group
  const getAgentsInGroup = (groupId: string): ExtendedAgent[] => {
    return myAgents.value.filter((agent) => agent.sharedGroups?.includes(groupId))
  }

  // Create agent from workflow
  const createAgentFromWorkflow = (workflow: Workflow): ExtendedAgent => {
    const agent: ExtendedAgent = {
      id: workflow.id,
      name: workflow.name,
      type: 'personal',
      category: 'personal',
      description: workflow.description,
      tags: [],
      sharedGroups: [],
      createdAt: workflow.createdAt,
      updatedAt: workflow.updatedAt,
    }
    return agent
  }

  // Migrate existing workflows to agents
  const migrateWorkflowsToAgents = () => {
    const workflowStore = useWorkflowStore()
    const existingWorkflows = workflowStore.workflows

    existingWorkflows.forEach((workflow) => {
      // Check if agent already exists
      const existingAgent = myAgents.value.find((a) => a.id === workflow.id)
      if (!existingAgent) {
        const agent = createAgentFromWorkflow(workflow)
        addMyAgent(agent)
      }
    })
  }

  return {
    // State
    myAgents,
    teamAgents,
    sharingGroups,

    // Computed
    allAgents,

    // Actions
    getAgentById,
    addMyAgent,
    removeMyAgent,
    updateMyAgent,
    addTeamAgent,
    removeTeamAgent,
    updateTeamAgent,
    getRecentAgents,
    markAgentAsUsed,
    updateAgentTags,
    addSharingGroup,
    removeSharingGroup,
    shareAgentWithGroup,
    unshareAgentFromGroup,
    importThirdPartyAgent,
    getAgentsInGroup,
    createAgentFromWorkflow,
    migrateWorkflowsToAgents,
  }
})
