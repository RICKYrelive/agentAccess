import type { MCPTool, MCPToolType, MCPToolStatus } from '@/components/mcp-management/types'

/**
 * Format a relative time string (e.g., "2 mins ago", "1h ago")
 */
export function formatRelativeTime(date: Date | undefined): string {
  if (!date) return '--'

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} mins ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  // For dates older than a week, show absolute date
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/**
 * Format latency in milliseconds
 */
export function formatLatency(latency: number | undefined): string {
  if (latency === undefined || latency === null) return '--'
  if (latency < 1000) return `${latency}ms`
  return `${(latency / 1000).toFixed(1)}s`
}

/**
 * Get status badge configuration
 */
export function getStatusBadgeConfig(status: MCPToolStatus) {
  const configs: Record<MCPToolStatus, {
    label: string
    bgClass: string
    textClass: string
    borderClass: string
    dotClass: string
    animateDot?: boolean
  }> = {
    active: {
      label: 'Active',
      bgClass: 'bg-green-100 dark:bg-green-900/30',
      textClass: 'text-green-700 dark:text-green-400',
      borderClass: 'border-green-200 dark:border-green-800',
      dotClass: 'bg-green-500',
    },
    inactive: {
      label: 'Inactive',
      bgClass: 'bg-slate-100 dark:bg-slate-800',
      textClass: 'text-slate-600 dark:text-slate-400',
      borderClass: 'border-slate-200 dark:border-slate-700',
      dotClass: 'bg-slate-400',
    },
    error: {
      label: 'Error',
      bgClass: 'bg-amber-100 dark:bg-amber-900/30',
      textClass: 'text-amber-700 dark:text-amber-400',
      borderClass: 'border-amber-200 dark:border-amber-800',
      dotClass: 'bg-amber-500',
    },
    updating: {
      label: 'Updating',
      bgClass: 'bg-blue-100 dark:bg-blue-900/30',
      textClass: 'text-blue-700 dark:text-blue-400',
      borderClass: 'border-blue-200 dark:border-blue-800',
      dotClass: 'bg-blue-500 animate-pulse',
      animateDot: true,
    },
  }

  return configs[status] || configs.inactive
}

/**
 * Get tool type display name and icon configuration
 */
export function getToolTypeConfig(tool: MCPTool) {
  const typeConfigs: Record<MCPToolType, {
    displayName: string
    iconPath: string
    bgClass: string
    iconColorClass: string
  }> = {
    builtin: {
      displayName: 'Builtin Tool',
      iconPath: 'M5 13l4 4L19 7',
      bgClass: 'bg-blue-100 dark:bg-blue-900/30',
      iconColorClass: 'text-blue-600 dark:text-blue-400',
    },
    custom: {
      displayName: 'REST API',
      iconPath: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
      bgClass: 'bg-purple-100 dark:bg-purple-900/30',
      iconColorClass: 'text-purple-600 dark:text-purple-400',
    },
    database: {
      displayName: 'Database View',
      iconPath: 'M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4',
      bgClass: 'bg-emerald-100 dark:bg-emerald-900/30',
      iconColorClass: 'text-emerald-600 dark:text-emerald-400',
    },
    npx: {
      displayName: 'Lambda Function',
      iconPath: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
      bgClass: 'bg-green-100 dark:bg-green-900/30',
      iconColorClass: 'text-green-600 dark:text-green-400',
    },
    uvx: {
      displayName: 'Lambda Function',
      iconPath: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
      bgClass: 'bg-yellow-100 dark:bg-yellow-900/30',
      iconColorClass: 'text-yellow-600 dark:text-yellow-400',
    },
  }

  return typeConfigs[tool.type] || typeConfigs.builtin
}

/**
 * Get tool display type name based on internal type
 */
export function getToolTypeName(type: MCPToolType): string {
  const names: Record<MCPToolType, string> = {
    builtin: 'Builtin',
    custom: 'REST API',
    database: 'Database View',
    npx: 'Lambda Function',
    uvx: 'Lambda Function',
  }
  return names[type] || type
}
