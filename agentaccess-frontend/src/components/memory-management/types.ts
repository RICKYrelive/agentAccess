// Memory Strategy Types
export type MemoryStrategyType = 'summarization' | 'user-preferences' | 'custom-prompt'

// Memory Base Status
export type MemoryBaseStatus = 'active' | 'inactive'

// Memory Strategy Configuration
export interface MemoryStrategy {
  type: MemoryStrategyType
  prompt?: string // Custom prompt template (for custom-prompt type)
  config: {
    maxMemories: number // Max memories to retrieve per query
    similarityThreshold: number // Minimum relevance score (0-1)
  }
}

// Memory Base
export interface MemoryBase {
  id: string // UUID
  name: string // User-defined name
  description: string // User-defined description
  status: MemoryBaseStatus // Active bases are available for agents
  strategy: MemoryStrategy // How memories are captured
  memoryCount: number // Total memories stored
  lastUsedAt: Date | null // Last retrieval timestamp
  createdAt: Date
  updatedAt: Date
}

// Recall Metrics for tracking retrieval success
export interface RecallMetrics {
  memoryBaseId: string
  timestamp: Date
  recallRate: number // Percentage
  totalRetrievals: number
  successfulRetrievals: number
}

// Data point for recall rate chart
export interface RecallRateDataPoint {
  timestamp: string // HH:mm format
  recallRate: number // Percentage 0-100
}

// Memory export/import format
export interface MemoryExportData {
  version: string
  exportedAt: string // ISO timestamp
  memoryBase: {
    id: string
    name: string
    description: string
    strategy: MemoryStrategy
  }
  memories: Memory[]
}

// Individual Memory (from mem0)
export interface Memory {
  id: string
  content: string
  metadata?: Record<string, any>
  createdAt?: string
}

// Strategy type display names and templates
export const MEMORY_STRATEGY_CONFIGS: Record<
  MemoryStrategyType,
  { name: string; icon: string; description: string; defaultPrompt?: string }
> = {
  summarization: {
    name: '总结归纳',
    icon: '📝',
    description: '提取对话中的关键洞察和总结',
    defaultPrompt: '请从以下对话中提取关键洞察和要点，以简洁的方式总结。',
  },
  'user-preferences': {
    name: '用户偏好',
    icon: '👤',
    description: '记录和追踪用户的偏好和习惯',
    defaultPrompt: '请从对话中识别用户的偏好、习惯和选择模式。',
  },
  'custom-prompt': {
    name: '自定义提示',
    icon: '⚙️',
    description: '使用自定义提示来指导记忆提取',
  },
}

// Get status badge class
export function getMemoryStatusBadgeClass(status: MemoryBaseStatus): string {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-700'
    case 'inactive':
      return 'bg-slate-100 text-slate-600'
    default:
      return 'bg-slate-100 text-slate-600'
  }
}

// Get status display name
export function getMemoryStatusName(status: MemoryBaseStatus): string {
  switch (status) {
    case 'active':
      return '运行中'
    case 'inactive':
      return '已停用'
    default:
      return '未知'
  }
}
