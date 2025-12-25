// System Plugin types

export type SystemPluginType = 'code_execution' | 'browser_sandbox'

export interface SystemPlugin {
  id: string
  name: string
  type: SystemPluginType
  description: string
  isEnabled: boolean
  configuration?: PluginConfig
}

export interface PluginConfig {
  timeout?: number
  memoryLimit?: number
  allowedOperations?: string[]
}

// Predefined system plugins
export const SYSTEM_PLUGINS: SystemPlugin[] = [
  {
    id: 'plugin-code-execution',
    name: '代码执行沙箱',
    type: 'code_execution',
    description: '安全执行 Python 代码进行数据分析',
    isEnabled: true,
    configuration: {
      timeout: 30000,
      memoryLimit: 512,
    },
  },
  {
    id: 'plugin-browser-sandbox',
    name: '浏览器沙箱',
    type: 'browser_sandbox',
    description: '安全的浏览器环境用于网页抓取和测试',
    isEnabled: true,
    configuration: {
      timeout: 60000,
    },
  },
  {
    id: 'plugin-calendar',
    name: '日历插件',
    type: 'code_execution',
    description: '管理日历事件和提醒',
    isEnabled: true,
  },
]
