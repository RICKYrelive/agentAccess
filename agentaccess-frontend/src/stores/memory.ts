import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type {
  MemoryBase,
  MemoryStrategy,
  RecallMetrics,
  RecallRateDataPoint,
  MemoryExportData,
  Memory,
  MemoryStrategyType,
} from '@/components/memory-management/types'

export const useMemoryStore = defineStore('memory', () => {
  // State
  const memoryBases = ref<MemoryBase[]>([])
  const recallMetrics = ref<RecallMetrics[]>([])

  // Mock data initialization
  const initializeMockData = () => {
    const now = new Date()

    // Mock memory bases
    memoryBases.value = [
      {
        id: 'mem-base-1',
        name: '对话总结库',
        description: '存储与用户对话的关键洞察和总结',
        status: 'active',
        strategy: {
          type: 'summarization',
          config: { maxMemories: 10, similarityThreshold: 0.5 },
        },
        memoryCount: 127,
        lastUsedAt: new Date(now.getTime() - 5 * 60 * 1000), // 5 minutes ago
        createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 5 * 60 * 1000),
      },
      {
        id: 'mem-base-2',
        name: '用户偏好记忆',
        description: '记录用户的行为偏好和习惯模式',
        status: 'active',
        strategy: {
          type: 'user-preferences',
          config: { maxMemories: 15, similarityThreshold: 0.6 },
        },
        memoryCount: 45,
        lastUsedAt: new Date(now.getTime() - 15 * 60 * 1000),
        createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 15 * 60 * 1000),
      },
      {
        id: 'mem-base-3',
        name: '技术问题库',
        description: '记录用户询问过的技术问题和解决方案',
        status: 'active',
        strategy: {
          type: 'custom-prompt',
          prompt: '提取技术问题、错误信息和解决方案的详细记录',
          config: { maxMemories: 20, similarityThreshold: 0.7 },
        },
        memoryCount: 89,
        lastUsedAt: new Date(now.getTime() - 30 * 60 * 1000),
        createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 30 * 60 * 1000),
      },
      {
        id: 'mem-base-4',
        name: '项目上下文',
        description: '存储项目相关的背景信息和上下文',
        status: 'inactive',
        strategy: {
          type: 'summarization',
          config: { maxMemories: 8, similarityThreshold: 0.5 },
        },
        memoryCount: 34,
        lastUsedAt: null,
        createdAt: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'mem-base-5',
        name: '学习笔记',
        description: '记录用户学习新知识的笔记和理解',
        status: 'active',
        strategy: {
          type: 'user-preferences',
          config: { maxMemories: 12, similarityThreshold: 0.55 },
        },
        memoryCount: 156,
        lastUsedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      },
    ]

    // Generate mock recall rate data points for the last hour
    generateMockRecallMetrics()
  }

  // Generate mock recall metrics
  const generateMockRecallMetrics = () => {
    const now = new Date()
    const data: RecallMetrics[] = []

    // Generate data points every 5 minutes for the last hour
    for (let i = 12; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 5 * 60 * 1000)
      const totalRetrievals = 50 + Math.floor(Math.random() * 30) // 50-80 retrievals
      const successRate = 0.75 + Math.random() * 0.2 // 75-95% success rate

      data.push({
        memoryBaseId: 'all',
        timestamp,
        recallRate: Math.round(successRate * 100),
        totalRetrievals,
        successfulRetrievals: Math.round(totalRetrievals * successRate),
      })
    }

    recallMetrics.value = data
  }

  // Actions
  const createMemoryBase = (
    data: Omit<MemoryBase, 'id' | 'memoryCount' | 'lastUsedAt' | 'createdAt' | 'updatedAt'>
  ) => {
    const newBase: MemoryBase = {
      ...data,
      id: `mem-base-${Date.now()}`,
      memoryCount: 0,
      lastUsedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    memoryBases.value.push(newBase)
    return newBase
  }

  const updateMemoryBase = (id: string, updates: Partial<Omit<MemoryBase, 'id' | 'createdAt'>>) => {
    const index = memoryBases.value.findIndex(m => m.id === id)
    if (index !== -1) {
      memoryBases.value[index] = {
        ...memoryBases.value[index],
        ...updates,
        updatedAt: new Date(),
      } as MemoryBase
      return memoryBases.value[index]
    }
    return null
  }

  const deleteMemoryBase = (id: string) => {
    const index = memoryBases.value.findIndex(m => m.id === id)
    if (index !== -1) {
      memoryBases.value.splice(index, 1)
      return true
    }
    return false
  }

  const toggleMemoryBaseStatus = (id: string) => {
    const base = memoryBases.value.find(m => m.id === id)
    if (base) {
      base.status = base.status === 'active' ? 'inactive' : 'active'
      base.updatedAt = new Date()
      return base
    }
    return null
  }

  const importMemoryBase = (data: MemoryExportData) => {
    // Check for duplicate UUID and generate new one if needed
    const exists = memoryBases.value.some(m => m.id === data.memoryBase.id)
    const newId = exists ? `mem-base-${Date.now()}` : data.memoryBase.id

    const newBase: MemoryBase = {
      ...data.memoryBase,
      id: newId,
      status: 'active',
      memoryCount: data.memories.length,
      lastUsedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    memoryBases.value.push(newBase)
    return { base: newBase, wasDuplicate: exists }
  }

  const exportMemoryBase = (id: string): MemoryExportData | null => {
    const base = memoryBases.value.find(m => m.id === id)
    if (!base) return null

    // Mock memory data - in real implementation, fetch from mem0 API
    const mockMemories: Memory[] = Array.from({ length: base.memoryCount }, (_, i) => ({
      id: `mem-${id}-${i}`,
      content: `Sample memory content ${i + 1} for ${base.name}`,
      metadata: { strategy: base.strategy.type },
      createdAt: new Date().toISOString(),
    }))

    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      memoryBase: {
        id: base.id,
        name: base.name,
        description: base.description,
        strategy: base.strategy,
      },
      memories: mockMemories,
    }
  }

  // Computed
  const totalMemoryCount = computed(() => {
    return memoryBases.value.reduce((sum, base) => sum + base.memoryCount, 0)
  })

  const activeMemoryBaseCount = computed(() => {
    return memoryBases.value.filter(m => m.status === 'active').length
  })

  const currentRecallRate = computed(() => {
    if (recallMetrics.value.length === 0) return 0
    return recallMetrics.value[recallMetrics.value.length - 1]?.recallRate ?? 0
  })

  const recallRateChartData = computed((): RecallRateDataPoint[] => {
    return recallMetrics.value.map(m => ({
      timestamp: new Date(m.timestamp).toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      recallRate: m.recallRate,
    }))
  })

  // Getters
  const getMemoryBase = (id: string) => {
    return memoryBases.value.find(m => m.id === id)
  }

  // Simulate real-time recall rate updates
  let recallUpdateInterval: ReturnType<typeof setInterval> | null = null

  const startRecallRateSimulation = () => {
    if (recallUpdateInterval) return

    recallUpdateInterval = setInterval(() => {
      const now = new Date()
      const totalRetrievals = 50 + Math.floor(Math.random() * 30)
      const successRate = 0.75 + Math.random() * 0.2

      recallMetrics.value.push({
        memoryBaseId: 'all',
        timestamp: now,
        recallRate: Math.round(successRate * 100),
        totalRetrievals,
        successfulRetrievals: Math.round(totalRetrievals * successRate),
      })

      // Keep only last 13 data points (1 hour of data)
      if (recallMetrics.value.length > 13) {
        recallMetrics.value.shift()
      }
    }, 5 * 60 * 1000) // Update every 5 minutes
  }

  const stopRecallRateSimulation = () => {
    if (recallUpdateInterval) {
      clearInterval(recallUpdateInterval)
      recallUpdateInterval = null
    }
  }

  // Initialize mock data on store creation
  initializeMockData()
  startRecallRateSimulation()

  return {
    // State
    memoryBases,
    recallMetrics,

    // Actions
    createMemoryBase,
    updateMemoryBase,
    deleteMemoryBase,
    toggleMemoryBaseStatus,
    importMemoryBase,
    exportMemoryBase,

    // Computed
    totalMemoryCount,
    activeMemoryBaseCount,
    currentRecallRate,
    recallRateChartData,

    // Methods
    getMemoryBase,
    startRecallRateSimulation,
    stopRecallRateSimulation,
  }
})
