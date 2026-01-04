import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { SandboxType, SandboxInstance, BuiltInTool, StoreItem, ResourceUsage } from '@/components/system-tools/types'

export const useSystemToolsStore = defineStore('systemTools', () => {
  // State
  const sandboxTypes = ref<SandboxType[]>([])
  const builtinTools = ref<BuiltInTool[]>([])
  const storeItems = ref<StoreItem[]>([])

  // Mock data initialization
  const initializeMockData = () => {
    // Mock sandbox types - all 3 types imported by default
    sandboxTypes.value = [
      {
        id: 'sandbox-1',
        name: '代码解释器',
        description: '支持 Python、JavaScript 等多种编程语言的代码执行环境',
        icon: '🐍',
        category: 'code-interpreter',
        imageUrl: 'code-interpreter:latest',
        status: 'running',
        instances: [
          {
            id: 'inst-1',
            sandboxTypeId: 'sandbox-1',
            name: '代码解释器实例 1',
            status: 'running',
            resources: { cpuPercent: 15, memoryPercent: 45, diskPercent: 20 },
            port: 8001,
            url: 'https://code-interpreter-1.agentaccess.internal',
            createdAt: new Date(),
          },
          {
            id: 'inst-2',
            sandboxTypeId: 'sandbox-1',
            name: '代码解释器实例 2',
            status: 'running',
            resources: { cpuPercent: 22, memoryPercent: 38, diskPercent: 25 },
            port: 8002,
            url: 'https://code-interpreter-2.agentaccess.internal',
            createdAt: new Date(),
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'sandbox-2',
        name: 'Browser Use',
        description: '基于浏览器的自动化操作环境，支持网页交互和数据采集',
        icon: '🌐',
        category: 'browser-use',
        imageUrl: 'browser-use:latest',
        status: 'running',
        instances: [
          {
            id: 'inst-3',
            sandboxTypeId: 'sandbox-2',
            name: 'Browser实例 1',
            status: 'running',
            resources: { cpuPercent: 35, memoryPercent: 62, diskPercent: 18 },
            port: 9001,
            url: 'https://browser-1.agentaccess.internal',
            createdAt: new Date(),
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'sandbox-3',
        name: '终端',
        description: '命令行终端环境，支持 Shell 命令执行和系统操作',
        icon: '⌨️',
        category: 'terminal',
        imageUrl: 'terminal:latest',
        status: 'running',
        instances: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    // Mock built-in tools - 10 imported by default
    builtinTools.value = [
      {
        id: 'builtin-1',
        name: 'PPT生成器',
        description: '根据内容自动生成PPT演示文稿',
        icon: '📽️',
        category: '办公',
        isEnabled: true,
        version: '2.0.0',
      },
      {
        id: 'builtin-2',
        name: 'PDF转换器',
        description: 'PDF与Word、Excel等格式互转',
        icon: '📑',
        category: '文档',
        isEnabled: true,
        version: '1.5.0',
      },
      {
        id: 'builtin-3',
        name: 'OCR识别',
        description: '图片文字识别，提取图片中的文本',
        icon: '🔍',
        category: '识别',
        isEnabled: true,
        version: '3.0.0',
      },
      {
        id: 'builtin-4',
        name: '计时器',
        description: '倒计时和定时提醒功能',
        icon: '⏰',
        category: '时间',
        isEnabled: true,
        version: '1.0.0',
      },
      {
        id: 'builtin-5',
        name: '世界时钟',
        description: '查看全球不同时区的时间',
        icon: '🌍',
        category: '时间',
        isEnabled: true,
        version: '1.2.0',
      },
      {
        id: 'builtin-6',
        name: '日历提醒',
        description: '创建和管理日程提醒',
        icon: '📅',
        category: '时间',
        isEnabled: true,
        version: '2.1.0',
      },
      {
        id: 'builtin-7',
        name: '图片压缩',
        description: '压缩图片大小，保持画质',
        icon: '🖼️',
        category: '图片',
        isEnabled: true,
        version: '1.3.0',
      },
      {
        id: 'builtin-8',
        name: '格式转换',
        description: '视频、音频、图片格式转换',
        icon: '🔄',
        category: '媒体',
        isEnabled: true,
        version: '2.0.0',
      },
      {
        id: 'builtin-9',
        name: '二维码生成',
        description: '生成各种类型的二维码',
        icon: '📱',
        category: '工具',
        isEnabled: true,
        version: '1.4.0',
      },
      {
        id: 'builtin-10',
        name: '短链接生成',
        description: '生成短链接和二维码',
        icon: '🔗',
        category: '工具',
        isEnabled: true,
        version: '1.1.0',
      },
    ]

    // Mock store items - 20 built-in tools total (10 already imported + 10 available)
    storeItems.value = [
      // Sandboxes (all 3 already imported)
      {
        id: 'store-sandbox-1',
        type: 'sandbox',
        name: '代码解释器',
        description: '支持 Python、JavaScript 等多种编程语言的代码执行环境',
        icon: '🐍',
        category: 'code-interpreter',
        version: '1.0',
        tags: ['python', 'javascript', 'code-execution'],
      },
      {
        id: 'store-sandbox-2',
        type: 'sandbox',
        name: 'Browser Use',
        description: '基于浏览器的自动化操作环境，支持网页交互和数据采集',
        icon: '🌐',
        category: 'browser-use',
        version: '1.0',
        tags: ['browser', 'automation', 'scraping'],
      },
      {
        id: 'store-sandbox-3',
        type: 'sandbox',
        name: '终端',
        description: '命令行终端环境，支持 Shell 命令执行和系统操作',
        icon: '⌨️',
        category: 'terminal',
        version: '1.0',
        tags: ['terminal', 'shell', 'cli'],
      },
      // Built-in tools - 10 already imported
      {
        id: 'store-builtin-1',
        type: 'builtin-tool',
        name: 'PPT生成器',
        description: '根据内容自动生成PPT演示文稿',
        icon: '📽️',
        category: '办公',
        version: '2.0.0',
        tags: ['ppt', 'presentation', 'office'],
      },
      {
        id: 'store-builtin-2',
        type: 'builtin-tool',
        name: 'PDF转换器',
        description: 'PDF与Word、Excel等格式互转',
        icon: '📑',
        category: '文档',
        version: '1.5.0',
        tags: ['pdf', 'conversion', 'document'],
      },
      {
        id: 'store-builtin-3',
        type: 'builtin-tool',
        name: 'OCR识别',
        description: '图片文字识别，提取图片中的文本',
        icon: '🔍',
        category: '识别',
        version: '3.0.0',
        tags: ['ocr', 'image', 'recognition'],
      },
      {
        id: 'store-builtin-4',
        type: 'builtin-tool',
        name: '计时器',
        description: '倒计时和定时提醒功能',
        icon: '⏰',
        category: '时间',
        version: '1.0.0',
        tags: ['timer', 'countdown', 'time'],
      },
      {
        id: 'store-builtin-5',
        type: 'builtin-tool',
        name: '世界时钟',
        description: '查看全球不同时区的时间',
        icon: '🌍',
        category: '时间',
        version: '1.2.0',
        tags: ['clock', 'timezone', 'world'],
      },
      {
        id: 'store-builtin-6',
        type: 'builtin-tool',
        name: '日历提醒',
        description: '创建和管理日程提醒',
        icon: '📅',
        category: '时间',
        version: '2.1.0',
        tags: ['calendar', 'reminder', 'schedule'],
      },
      {
        id: 'store-builtin-7',
        type: 'builtin-tool',
        name: '图片压缩',
        description: '压缩图片大小，保持画质',
        icon: '🖼️',
        category: '图片',
        version: '1.3.0',
        tags: ['image', 'compression', 'optimize'],
      },
      {
        id: 'store-builtin-8',
        type: 'builtin-tool',
        name: '格式转换',
        description: '视频、音频、图片格式转换',
        icon: '🔄',
        category: '媒体',
        version: '2.0.0',
        tags: ['conversion', 'media', 'format'],
      },
      {
        id: 'store-builtin-9',
        type: 'builtin-tool',
        name: '二维码生成',
        description: '生成各种类型的二维码',
        icon: '📱',
        category: '工具',
        version: '1.4.0',
        tags: ['qrcode', 'generator', 'code'],
      },
      {
        id: 'store-builtin-10',
        type: 'builtin-tool',
        name: '短链接生成',
        description: '生成短链接和二维码',
        icon: '🔗',
        category: '工具',
        version: '1.1.0',
        tags: ['url', 'shortener', 'link'],
      },
      // 10 more built-in tools available in store
      {
        id: 'store-builtin-11',
        type: 'builtin-tool',
        name: 'Excel处理',
        description: 'Excel表格数据分析和处理',
        icon: '📊',
        category: '办公',
        version: '1.5.0',
        tags: ['excel', 'spreadsheet', 'data'],
      },
      {
        id: 'store-builtin-12',
        type: 'builtin-tool',
        name: 'PDF合并拆分',
        description: '合并多个PDF或拆分PDF页面',
        icon: '📎',
        category: '文档',
        version: '1.0.0',
        tags: ['pdf', 'merge', 'split'],
      },
      {
        id: 'store-builtin-13',
        type: 'builtin-tool',
        name: '语音转文字',
        description: '将音频文件转换为文字',
        icon: '🎤',
        category: '媒体',
        version: '2.0.0',
        tags: ['speech', 'audio', 'transcription'],
      },
      {
        id: 'store-builtin-14',
        type: 'builtin-tool',
        name: '文字转语音',
        description: '将文字转换为自然语音',
        icon: '🔊',
        category: '媒体',
        version: '1.8.0',
        tags: ['tts', 'speech', 'audio'],
      },
      {
        id: 'store-builtin-15',
        type: 'builtin-tool',
        name: '视频剪辑',
        description: '简单的视频剪辑和处理',
        icon: '🎬',
        category: '媒体',
        version: '1.2.0',
        tags: ['video', 'editing', 'clip'],
      },
      {
        id: 'store-builtin-16',
        type: 'builtin-tool',
        name: '屏幕录制',
        description: '录制屏幕操作和演示',
        icon: '🖥️',
        category: '媒体',
        version: '1.0.0',
        tags: ['screen', 'record', 'capture'],
      },
      {
        id: 'store-builtin-17',
        type: 'builtin-tool',
        name: '密码生成器',
        description: '生成安全的随机密码',
        icon: '🔐',
        category: '工具',
        version: '1.3.0',
        tags: ['password', 'security', 'generator'],
      },
      {
        id: 'store-builtin-18',
        type: 'builtin-tool',
        name: '汇率转换',
        description: '实时汇率查询和转换',
        icon: '💱',
        category: '工具',
        version: '2.0.0',
        tags: ['currency', 'exchange', 'finance'],
      },
      {
        id: 'store-builtin-19',
        type: 'builtin-tool',
        name: '单位转换',
        description: '长度、重量、温度等单位转换',
        icon: '📏',
        category: '工具',
        version: '1.1.0',
        tags: ['unit', 'conversion', 'measure'],
      },
      {
        id: 'store-builtin-20',
        type: 'builtin-tool',
        name: '正则表达式',
        description: '正则表达式测试和生成',
        icon: '🔣',
        category: '开发',
        version: '1.0.0',
        tags: ['regex', 'pattern', 'test'],
      },
    ]
  }

  // Actions
  const createSandboxType = (type: Omit<SandboxType, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newType: SandboxType = {
      ...type,
      id: `sandbox-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    sandboxTypes.value.push(newType)
    return newType
  }

  const deleteSandboxType = (id: string) => {
    const index = sandboxTypes.value.findIndex(s => s.id === id)
    if (index !== -1) {
      sandboxTypes.value.splice(index, 1)
    }
  }

  const createInstance = (sandboxTypeId: string, config: { name: string }) => {
    const sandboxType = sandboxTypes.value.find(s => s.id === sandboxTypeId)
    if (!sandboxType) return null

    const newInstance: SandboxInstance = {
      id: `inst-${Date.now()}`,
      sandboxTypeId,
      name: config.name,
      status: 'running',
      resources: { cpuPercent: 0, memoryPercent: 0, diskPercent: 0 },
      createdAt: new Date(),
      envVars: {},
    }
    sandboxType.instances.push(newInstance)
    return newInstance
  }

  const deleteInstance = (instanceId: string) => {
    for (const sandboxType of sandboxTypes.value) {
      const index = sandboxType.instances.findIndex(i => i.id === instanceId)
      if (index !== -1) {
        sandboxType.instances.splice(index, 1)
        return true
      }
    }
    return false
  }

  const toggleBuiltInTool = (toolId: string) => {
    const tool = builtinTools.value.find(t => t.id === toolId)
    if (tool) {
      tool.isEnabled = !tool.isEnabled
    }
  }

  const importFromStore = (itemId: string) => {
    const item = storeItems.value.find(i => i.id === itemId)
    if (!item) return null

    if (item.type === 'sandbox') {
      // Check if already exists
      const exists = sandboxTypes.value.some(s => s.name === item.name)
      if (exists) return null

      return createSandboxType({
        name: item.name,
        description: item.description,
        icon: item.icon,
        category: (item.category as any) || 'other',
        imageUrl: `${item.category}:${item.version}`,
        status: 'stopped',
        instances: [],
      })
    } else {
      // Check if already exists
      const exists = builtinTools.value.some(t => t.name === item.name)
      if (exists) return null

      const newTool: BuiltInTool = {
        id: `builtin-${Date.now()}`,
        name: item.name,
        description: item.description,
        icon: item.icon,
        category: item.category || 'other',
        isEnabled: true,
        version: item.version,
      }
      builtinTools.value.push(newTool)
      return newTool
    }
  }

  // Computed
  const totalResourceUsage = computed((): ResourceUsage => {
    const runningInstances = sandboxTypes.value.flatMap(s =>
      s.instances.filter(i => i.status === 'running')
    )
    if (runningInstances.length === 0) return { cpu: 0, memory: 0, disk: 0 }

    return {
      cpu: runningInstances.reduce((sum, i) => sum + i.resources.cpuPercent, 0) / runningInstances.length,
      memory: runningInstances.reduce((sum, i) => sum + i.resources.memoryPercent, 0) / runningInstances.length,
      disk: runningInstances.reduce((sum, i) => sum + i.resources.diskPercent, 0) / runningInstances.length,
    }
  })

  const totalInstanceCount = computed(() => {
    return sandboxTypes.value.reduce((sum, s) => sum + s.instances.length, 0)
  })

  const runningInstanceCount = computed(() => {
    return sandboxTypes.value.reduce((sum, s) =>
      sum + s.instances.filter(i => i.status === 'running').length, 0
    )
  })

  // Resource simulation
  let resourceUpdateInterval: ReturnType<typeof setInterval> | null = null

  const startResourceSimulation = () => {
    if (resourceUpdateInterval) return

    resourceUpdateInterval = setInterval(() => {
      sandboxTypes.value.forEach(sandboxType => {
        sandboxType.instances.forEach(instance => {
          if (instance.status === 'running') {
            // Simulate resource fluctuation
            instance.resources.cpuPercent = Math.min(100, Math.max(0, instance.resources.cpuPercent + (Math.random() - 0.5) * 10))
            instance.resources.memoryPercent = Math.min(100, Math.max(0, instance.resources.memoryPercent + (Math.random() - 0.5) * 5))
            // Disk changes less frequently
            if (Math.random() > 0.7) {
              instance.resources.diskPercent = Math.min(100, Math.max(0, instance.resources.diskPercent + (Math.random() - 0.5) * 2))
            }
          }
        })
      })
    }, 5000)
  }

  const stopResourceSimulation = () => {
    if (resourceUpdateInterval) {
      clearInterval(resourceUpdateInterval)
      resourceUpdateInterval = null
    }
  }

  // Getters
  const getSandboxType = (id: string) => {
    return sandboxTypes.value.find(s => s.id === id)
  }

  const getBuiltInTool = (id: string) => {
    return builtinTools.value.find(t => t.id === id)
  }

  const isItemInstalled = (itemId: string) => {
    const item = storeItems.value.find(i => i.id === itemId)
    if (!item) return false

    if (item.type === 'sandbox') {
      return sandboxTypes.value.some(s => s.name === item.name)
    } else {
      return builtinTools.value.some(t => t.name === item.name)
    }
  }

  // Initialize mock data on store creation
  initializeMockData()
  startResourceSimulation()

  return {
    // State
    sandboxTypes,
    builtinTools,
    storeItems,

    // Actions
    createSandboxType,
    deleteSandboxType,
    createInstance,
    deleteInstance,
    toggleBuiltInTool,
    importFromStore,

    // Computed
    totalResourceUsage,
    totalInstanceCount,
    runningInstanceCount,

    // Methods
    getSandboxType,
    getBuiltInTool,
    isItemInstalled,
    startResourceSimulation,
    stopResourceSimulation,
  }
})
