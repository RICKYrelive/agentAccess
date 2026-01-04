// System Tools Management Types

export type SandboxCategory = 'code-interpreter' | 'browser-use' | 'terminal'
export type SandboxStatus = 'running' | 'stopped' | 'error'

export interface SandboxInstance {
  id: string
  sandboxTypeId: string
  name: string
  status: SandboxStatus
  resources: {
    cpuPercent: number
    memoryPercent: number
    diskPercent: number
  }
  port?: number
  url?: string
  envVars: Record<string, string>
  createdAt: Date
}

export interface SandboxType {
  id: string
  name: string
  description: string
  icon: string
  category: SandboxCategory
  imageUrl?: string
  status: SandboxStatus
  instances: SandboxInstance[]
  createdAt: Date
  updatedAt: Date
}

export interface BuiltInTool {
  id: string
  name: string
  description: string
  icon: string
  category: string
  isEnabled: boolean
  version?: string
  config?: Record<string, unknown>
}

export type StoreItemType = 'sandbox' | 'builtin-tool'

export interface StoreItem {
  id: string
  type: StoreItemType
  name: string
  description: string
  icon: string
  category?: string
  version?: string
  tags: string[]
}

export interface ResourceUsage {
  cpu: number
  memory: number
  disk: number
}

// Category icons mapping
export const CategoryIcons: Record<SandboxCategory, string> = {
  'code-interpreter': '🐍',
  'browser-use': '🌐',
  'terminal': '⌨️',
}

// Get status badge classes
export function getSandboxStatusBadgeClass(status: SandboxStatus): string {
  const classes = {
    running: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800',
    stopped: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-700',
    error: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800',
  }
  return classes[status] || classes.stopped
}

export function getSandboxStatusName(status: SandboxStatus): string {
  const names = {
    running: '运行中',
    stopped: '已停止',
    error: '错误',
  }
  return names[status] || status
}
