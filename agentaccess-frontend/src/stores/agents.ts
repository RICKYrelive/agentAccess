import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Agent } from '@/types'

export const useAgentsStore = defineStore('agents', () => {
  // State
  const myAgents = ref<Agent[]>([
    {
      id: 'my-1',
      name: '个人助理小助手',
      type: 'personal',
      category: 'personal',
      description: '个人日常助手'
    },
    {
      id: 'my-2',
      name: '代码助手',
      type: 'personal',
      category: 'coding',
      description: '编程开发助手'
    },
    {
      id: 'my-3',
      name: '机电维修助手瑶哥',
      type: 'specialized',
      category: 'specialized',
      description: '机电维修专家'
    },
    {
      id: 'my-4',
      name: '动环监控王师傅',
      type: 'specialized',
      category: 'specialized',
      description: '动环监控专家'
    },
    {
      id: 'my-5',
      name: '差旅助手TravelTang',
      type: 'specialized',
      category: 'specialized',
      description: '差旅规划助手'
    }
  ])

  const teamAgents = ref<Agent[]>([
    {
      id: 'team-1',
      name: '智能数据分析',
      type: 'team',
      category: 'analysis',
      description: '提供高质量洞察服务，帮助企业实时获取在风险检测、产品研究、品牌监控等洞察',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
    },
    {
      id: 'team-2',
      name: '写作助手',
      type: 'team',
      category: 'writing',
      description: '智能写作辅助，帮助您快速创建高质量文档内容',
      icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    {
      id: 'team-3',
      name: '股市基本面分析',
      type: 'team',
      category: 'finance',
      description: '专业的股市分析工具，提供深度的基本面分析和投资建议',
      icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3'
    }
  ])

  // Computed
  const allAgents = computed(() => [...myAgents.value, ...teamAgents.value])

  // Actions
  const getAgentById = (id: string): Agent | undefined => {
    return allAgents.value.find(agent => agent.id === id)
  }

  const addMyAgent = (agent: Agent) => {
    myAgents.value.push(agent)
  }

  const removeMyAgent = (id: string) => {
    const index = myAgents.value.findIndex(agent => agent.id === id)
    if (index > -1) {
      myAgents.value.splice(index, 1)
    }
  }

  const updateMyAgent = (id: string, updates: Partial<Agent>) => {
    const agent = myAgents.value.find(a => a.id === id)
    if (agent) {
      Object.assign(agent, updates)
    }
  }

  const addTeamAgent = (agent: Agent) => {
    teamAgents.value.push(agent)
  }

  const removeTeamAgent = (id: string) => {
    const index = teamAgents.value.findIndex(agent => agent.id === id)
    if (index > -1) {
      teamAgents.value.splice(index, 1)
    }
  }

  const updateTeamAgent = (id: string, updates: Partial<Agent>) => {
    const agent = teamAgents.value.find(a => a.id === id)
    if (agent) {
      Object.assign(agent, updates)
    }
  }

  return {
    // State
    myAgents,
    teamAgents,

    // Computed
    allAgents,

    // Actions
    getAgentById,
    addMyAgent,
    removeMyAgent,
    updateMyAgent,
    addTeamAgent,
    removeTeamAgent,
    updateTeamAgent
  }
})
