import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import type {
  KnowledgeBase,
  TextImportForm,
  SpreadsheetImportForm,
  DatabaseImportForm,
  DatabaseConnectionTest,
  KnowledgeBaseType,
  KnowledgeBaseStatus,
  FileInfo,
  KnowledgeBaseConfig,
  TeamSharing,
  KnowledgeBaseCategory,
  KnowledgeBasePermission,
  EmbeddingModel,
  ReRankModel,
} from '@/types/knowledge-base'

const KNOWLEDGE_BASES_STORAGE_KEY = 'agentaccess-knowledge-bases'
const MAX_FILES = 50
const MAX_TABLES = 20

// Current user ID (mock - in production this would come from auth)
const CURRENT_USER_ID = 'user-001'
const CURRENT_USER_TEAMS = ['team-dev', 'team-product'] // Mock user's teams

// Get default config for a knowledge base type
const getDefaultConfig = (type: KnowledgeBaseType): KnowledgeBaseConfig => {
  const baseConfig: KnowledgeBaseConfig = {
    settings: {
      isPublic: false,
      isEnabled: true,
      tags: [],
    },
    embedding: {
      enabled: true,
      model: 'bge-large-zh' as EmbeddingModel,
      dimension: 1024,
    },
    rerank: {
      enabled: false,
      model: 'bge-reranker-large' as ReRankModel,
      topK: 5,
      scoreThreshold: 0.5,
    },
  }

  if (type === 'text') {
    return {
      ...baseConfig,
      chunking: {
        chunkSize: 512,
        chunkOverlap: 50,
      },
    }
  } else if (type === 'spreadsheet') {
    return {
      ...baseConfig,
      chunking: {
        chunkSize: 256,
        chunkOverlap: 0,
        splitBy: 'row',
        hasHeader: true,
      },
    }
  } else if (type === 'database') {
    return {
      ...baseConfig,
      databaseSync: {
        frequency: 'daily',
        maxRowsPerQuery: 1000,
        enableCache: true,
      },
    }
  }

  return baseConfig
}

export const useKnowledgeBaseStore = defineStore('knowledgeBase', () => {
  // State
  const knowledgeBases = ref<KnowledgeBase[]>([])
  const isLoading = ref(false)
  const isInitialized = ref(false)

  // Migration function for backward compatibility
  const migrateKnowledgeBase = (kb: any): KnowledgeBase => {
    const migrated = { ...kb }

    // Migrate single file to files array
    if (migrated.sourceInfo.fileName && !migrated.sourceInfo.files) {
      migrated.sourceInfo.files = [
        {
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          fileType: migrated.sourceInfo.fileType || '',
          fileName: migrated.sourceInfo.fileName,
          fileSize: migrated.sourceInfo.fileSize || 0,
          addedAt: new Date(kb.createdAt),
        },
      ]
      delete migrated.sourceInfo.fileType
      delete migrated.sourceInfo.fileName
      delete migrated.sourceInfo.fileSize
    }

    // Migrate single table to tables array
    if (migrated.sourceInfo.table && !migrated.sourceInfo.tables) {
      migrated.sourceInfo.tables = [migrated.sourceInfo.table]
      delete migrated.sourceInfo.table
    }

    // Migrate database connection info
    if (
      (migrated.sourceInfo.dbType || migrated.sourceInfo.host) &&
      !migrated.sourceInfo.connection
    ) {
      migrated.sourceInfo.connection = {
        dbType: migrated.sourceInfo.dbType || 'mysql',
        host: migrated.sourceInfo.host || 'localhost',
        port: migrated.sourceInfo.port || 3306,
        username: migrated.sourceInfo.username || '',
        database: migrated.sourceInfo.database || '',
      }
    }

    // Add default config if missing
    if (!migrated.config) {
      migrated.config = getDefaultConfig(migrated.type || 'text')
    }

    // Add team sharing fields with defaults for backward compatibility
    if (!migrated.owner) {
      migrated.owner = CURRENT_USER_ID
    }
    if (!migrated.category) {
      migrated.category = 'personal' as KnowledgeBaseCategory
    }
    if (!migrated.permission) {
      migrated.permission = 'owner' as KnowledgeBasePermission
    }
    if (!migrated.sharedTeams) {
      migrated.sharedTeams = []
    }

    return migrated as KnowledgeBase
  }

  // Save to localStorage
  const saveKnowledgeBases = () => {
    if (!isInitialized.value) return
    try {
      const json = JSON.stringify(knowledgeBases.value)
      localStorage.setItem(KNOWLEDGE_BASES_STORAGE_KEY, json)
    } catch (error) {
      console.error('Failed to save knowledge bases:', error)
    }
  }

  // Load from localStorage
  const loadKnowledgeBases = () => {
    try {
      const saved = localStorage.getItem(KNOWLEDGE_BASES_STORAGE_KEY)
      if (saved) {
        const data = JSON.parse(saved)
        knowledgeBases.value = data.map((kb: any) => {
          const migrated = migrateKnowledgeBase(kb)
          return {
            ...migrated,
            createdAt: new Date(migrated.createdAt),
            updatedAt: new Date(migrated.updatedAt),
            sourceInfo: {
              ...migrated.sourceInfo,
              files: migrated.sourceInfo.files?.map((f: FileInfo) => ({
                ...f,
                addedAt: new Date(f.addedAt),
              })),
            },
          }
        })
      }
    } catch (error) {
      console.error('Failed to load knowledge bases:', error)
    }

    // Initialize demo knowledge bases if none exist
    if (knowledgeBases.value.length === 0) {
      initializeDemoKnowledgeBases()
    }

    isInitialized.value = true
  }

  // Initialize demo knowledge bases
  const initializeDemoKnowledgeBases = () => {
    const demoKBs: KnowledgeBase[] = [
      {
        id: 'kb-text-1',
        name: '产品文档知识库',
        description: '包含产品说明书、用户手册等相关文档',
        type: 'text',
        sourceInfo: {
          files: [
            {
              id: 'file-1',
              fileType: 'pdf',
              fileName: 'product_docs.pdf',
              fileSize: 1024 * 512,
              addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
            },
            {
              id: 'file-2',
              fileType: 'pdf',
              fileName: 'user_manual.pdf',
              fileSize: 1024 * 256,
              addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
            },
          ],
        },
        config: getDefaultConfig('text'),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        owner: CURRENT_USER_ID,
        category: 'personal',
        permission: 'owner',
        sharedTeams: [],
      },
      {
        id: 'kb-spreadsheet-1',
        name: '销售数据表格',
        description: '2024年各季度销售数据统计',
        type: 'spreadsheet',
        sourceInfo: {
          files: [
            {
              id: 'file-3',
              fileType: 'xlsx',
              fileName: 'sales_q1.xlsx',
              fileSize: 1024 * 128,
              addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
            },
            {
              id: 'file-4',
              fileType: 'xlsx',
              fileName: 'sales_q2.xlsx',
              fileSize: 1024 * 128,
              addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
            },
          ],
        },
        config: getDefaultConfig('spreadsheet'),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        owner: CURRENT_USER_ID,
        category: 'personal',
        permission: 'owner',
        sharedTeams: [],
      },
      {
        id: 'kb-database-1',
        name: '用户信息数据库',
        description: 'MySQL用户管理数据库连接',
        type: 'database',
        sourceInfo: {
          connection: {
            dbType: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            database: 'user_db',
          },
          tables: ['users', 'profiles', 'permissions'],
        },
        config: getDefaultConfig('database'),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        owner: CURRENT_USER_ID,
        category: 'personal',
        permission: 'owner',
        sharedTeams: [],
      },
      // Add a team-shared knowledge base for demo
      {
        id: 'kb-team-1',
        name: '团队技术规范',
        description: '共享给开发团队的技术规范文档',
        type: 'text',
        sourceInfo: {
          files: [
            {
              id: 'file-5',
              fileType: 'pdf',
              fileName: 'tech_standards.pdf',
              fileSize: 1024 * 384,
              addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
            },
          ],
        },
        config: getDefaultConfig('text'),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        owner: CURRENT_USER_ID,
        category: 'team',
        permission: 'team',
        sharedTeams: [
          {
            teamId: 'team-dev',
            teamName: '开发团队',
            permission: 'write',
            addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
            addedBy: CURRENT_USER_ID,
          },
        ],
      },
    ]
    knowledgeBases.value = demoKBs
    saveKnowledgeBases()
  }

  // Initialize store
  loadKnowledgeBases()

  // Watch for changes and auto-save
  watch(
    knowledgeBases,
    () => {
      saveKnowledgeBases()
    },
    { deep: true },
  )

  // Computed
  const textKnowledgeBases = computed(() => knowledgeBases.value.filter((kb) => kb.type === 'text'))

  const spreadsheetKnowledgeBases = computed(() =>
    knowledgeBases.value.filter((kb) => kb.type === 'spreadsheet'),
  )

  const databaseKnowledgeBases = computed(() =>
    knowledgeBases.value.filter((kb) => kb.type === 'database'),
  )

  // Team sharing computed properties
  // "我的知识库" shows all KBs owned by the current user, regardless of category
  const personalKnowledgeBases = computed(() =>
    knowledgeBases.value.filter((kb) => kb.owner === CURRENT_USER_ID),
  )

  // "团队知识库" shows all team-shared KBs that the user's teams have access to
  const teamKnowledgeBases = computed(() =>
    knowledgeBases.value.filter((kb) =>
      kb.permission === 'team' &&
      kb.sharedTeams?.some((st) => CURRENT_USER_TEAMS.includes(st.teamId))
    ),
  )

  // Statistics computed properties for dashboard
  const totalDocumentCount = computed(() => {
    let count = 0
    knowledgeBases.value.forEach((kb) => {
      if (kb.type === 'text' || kb.type === 'spreadsheet') {
        count += kb.sourceInfo.files?.length || 0
      } else if (kb.type === 'database') {
        count += kb.sourceInfo.tables?.length || 0
      }
    })
    return count
  })

  const totalStorageUsed = computed(() => {
    let bytes = 0
    knowledgeBases.value.forEach((kb) => {
      if (kb.type === 'text' || kb.type === 'spreadsheet') {
        kb.sourceInfo.files?.forEach((file) => {
          bytes += file.fileSize || 0
        })
      }
    })
    return bytes
  })

  const totalStorageFormatted = computed(() => {
    const bytes = totalStorageUsed.value
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  })

  const overallSyncStatus = computed<'synced' | 'syncing' | 'error'>(() => {
    // Check if any database KB is syncing
    const hasSyncing = knowledgeBases.value.some(
      (kb) => kb.type === 'database' && kb.status === ('syncing' as KnowledgeBaseStatus),
    )
    if (hasSyncing) return 'syncing'

    // Check if any database KB has error
    const hasError = knowledgeBases.value.some(
      (kb) => kb.type === 'database' && kb.status === ('error' as KnowledgeBaseStatus),
    )
    if (hasError) return 'error'

    return 'synced'
  })

  const lastSyncTime = computed(() => {
    // For demo purposes, return a recent time
    // In production, this would track actual sync times from database KBs
    const databaseKBs = knowledgeBases.value.filter((kb) => kb.type === 'database')
    if (databaseKBs.length > 0) {
      // Return the most recent updatedAt among database KBs
      return new Date(Math.max(...databaseKBs.map((kb) => kb.updatedAt.getTime())))
    }
    return undefined
  })

  // Helper functions for access control
  const canViewKnowledgeBase = (kb: KnowledgeBase, userId: string = CURRENT_USER_ID, userTeamIds: string[] = CURRENT_USER_TEAMS): boolean => {
    // Owner can always view
    if (kb.owner === userId) return true

    // Public knowledge bases
    if (kb.permission === 'public') return true

    // Team shared
    if (kb.permission === 'team' && kb.sharedTeams) {
      return kb.sharedTeams.some((st) => userTeamIds.includes(st.teamId))
    }

    return false
  }

  const canEditKnowledgeBase = (kb: KnowledgeBase, userId: string = CURRENT_USER_ID, userTeamIds: string[] = CURRENT_USER_TEAMS): boolean => {
    // Owner can always edit
    if (kb.owner === userId) return true

    // Team shared with write permission
    if (kb.permission === 'team' && kb.sharedTeams) {
      const teamSharing = kb.sharedTeams.find((st) => userTeamIds.includes(st.teamId))
      return teamSharing?.permission === 'write'
    }

    return false
  }

  const getKnowledgeBasePermissionForUser = (kb: KnowledgeBase, userId: string = CURRENT_USER_ID, userTeamIds: string[] = CURRENT_USER_TEAMS): 'owner' | 'write' | 'read' | 'none' => {
    if (kb.owner === userId) return 'owner'
    if (kb.permission === 'team' && kb.sharedTeams) {
      const teamSharing = kb.sharedTeams.find((st) => userTeamIds.includes(st.teamId))
      if (teamSharing) return teamSharing.permission
    }
    if (kb.permission === 'public') return 'read'
    return 'none'
  }

  // Actions
  const createKnowledgeBase = (
    type: KnowledgeBaseType,
    name: string,
    description: string,
    sourceInfo: Record<string, any>,
    category: KnowledgeBaseCategory = 'personal',
    sharedTeams?: TeamSharing[],
    permission: KnowledgeBasePermission = 'owner',
  ): KnowledgeBase => {
    const newKB: KnowledgeBase = {
      id: `kb-${type}-${Date.now()}`,
      name,
      description,
      type,
      sourceInfo,
      config: getDefaultConfig(type),
      createdAt: new Date(),
      updatedAt: new Date(),
      owner: CURRENT_USER_ID,
      category,
      permission: category === 'team' ? 'team' : permission,
      sharedTeams: sharedTeams || [],
    }

    knowledgeBases.value.unshift(newKB)
    return newKB
  }

  const createFromTextImport = (form: TextImportForm) => {
    const files: FileInfo[] = form.files.map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      fileType: file.name.split('.').pop() || '',
      fileName: file.name,
      fileSize: file.size,
      addedAt: new Date(),
    }))

    return createKnowledgeBase('text', form.name, form.description, {
      files,
    }, form.category || 'personal', form.sharedTeams, form.permission)
  }

  const createFromSpreadsheetImport = (form: SpreadsheetImportForm) => {
    const files: FileInfo[] = form.files.map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      fileType: file.name.split('.').pop() || '',
      fileName: file.name,
      fileSize: file.size,
      addedAt: new Date(),
    }))

    return createKnowledgeBase('spreadsheet', form.name, form.description, {
      files,
    }, form.category || 'personal', form.sharedTeams, form.permission)
  }

  const createFromDatabaseImport = (form: DatabaseImportForm) => {
    return createKnowledgeBase('database', form.name, form.description, {
      connection: {
        dbType: form.dbType,
        host: form.host,
        port: form.port,
        username: form.username,
        database: form.database,
      },
      tables: form.tables,
    }, form.category || 'personal', form.sharedTeams, form.permission)
  }

  const updateKnowledgeBase = (
    id: string,
    updates: Partial<Pick<KnowledgeBase, 'name' | 'description' | 'sourceInfo' | 'config' | 'category' | 'permission' | 'sharedTeams'>>,
  ) => {
    const index = knowledgeBases.value.findIndex((kb) => kb.id === id)
    if (index > -1) {
      knowledgeBases.value[index] = {
        ...knowledgeBases.value[index],
        ...updates,
        updatedAt: new Date(),
      } as KnowledgeBase
    }
  }

  const updateKnowledgeBaseSharing = (
    id: string,
    category: KnowledgeBaseCategory,
    permission: KnowledgeBasePermission,
    sharedTeams: TeamSharing[],
  ) => {
    const index = knowledgeBases.value.findIndex((kb) => kb.id === id)
    if (index > -1) {
      const kb = knowledgeBases.value[index]
      knowledgeBases.value[index] = {
        ...kb,
        category,
        permission,
        sharedTeams,
        updatedAt: new Date(),
      } as KnowledgeBase
    }
  }

  const updateKnowledgeBaseConfig = (id: string, config: Partial<KnowledgeBaseConfig>) => {
    const index = knowledgeBases.value.findIndex((kb) => kb.id === id)
    if (index > -1) {
      const kb = knowledgeBases.value[index]!
      knowledgeBases.value[index] = {
        ...kb,
        config: {
          ...kb.config,
          ...config,
          settings: {
            ...kb.config.settings,
            ...(config.settings || {}),
          },
          embedding: {
            ...kb.config.embedding,
            ...(config.embedding || {}),
          },
          rerank: {
            ...kb.config.rerank,
            ...(config.rerank || {}),
          },
          chunking: config.chunking
            ? {
                ...kb.config.chunking,
                ...config.chunking,
              }
            : kb.config.chunking,
          databaseSync: config.databaseSync
            ? {
                ...kb.config.databaseSync,
                ...config.databaseSync,
              }
            : kb.config.databaseSync,
        },
        updatedAt: new Date(),
      } as KnowledgeBase
    }
  }

  const deleteKnowledgeBase = (id: string) => {
    const index = knowledgeBases.value.findIndex((kb) => kb.id === id)
    if (index > -1) {
      knowledgeBases.value.splice(index, 1)
    }
  }

  const addFileToKnowledgeBase = (id: string, file: File) => {
    const kb = knowledgeBases.value.find((k) => k.id === id)
    if (!kb || !kb.sourceInfo.files) return

    if (kb.sourceInfo.files.length >= MAX_FILES) {
      throw new Error(`最多只能上传 ${MAX_FILES} 个文件`)
    }

    const newFile: FileInfo = {
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fileType: file.name.split('.').pop() || '',
      fileName: file.name,
      fileSize: file.size,
      addedAt: new Date(),
    }

    kb.sourceInfo.files.push(newFile)
    kb.updatedAt = new Date()
  }

  const removeFileFromKnowledgeBase = (id: string, fileId: string) => {
    const kb = knowledgeBases.value.find((k) => k.id === id)
    if (!kb || !kb.sourceInfo.files) return

    if (kb.sourceInfo.files.length <= 1) {
      throw new Error('知识库至少需要 1 个源文件')
    }

    kb.sourceInfo.files = kb.sourceInfo.files.filter((f) => f.id !== fileId)
    kb.updatedAt = new Date()
  }

  const addTableToKnowledgeBase = (id: string, table: string) => {
    const kb = knowledgeBases.value.find((k) => k.id === id)
    if (!kb || !kb.sourceInfo.tables) return

    if (kb.sourceInfo.tables.length >= MAX_TABLES) {
      throw new Error(`最多只能选择 ${MAX_TABLES} 个表`)
    }

    if (kb.sourceInfo.tables.includes(table)) {
      throw new Error('表已存在')
    }

    kb.sourceInfo.tables.push(table)
    kb.updatedAt = new Date()
  }

  const removeTableFromKnowledgeBase = (id: string, table: string) => {
    const kb = knowledgeBases.value.find((k) => k.id === id)
    if (!kb || !kb.sourceInfo.tables) return

    if (kb.sourceInfo.tables.length <= 1) {
      throw new Error('知识库至少需要 1 个表')
    }

    kb.sourceInfo.tables = kb.sourceInfo.tables.filter((t) => t !== table)
    kb.updatedAt = new Date()
  }

  // Mock database connection test
  const testDatabaseConnection = async (
    config: Omit<DatabaseImportForm, 'name' | 'description' | 'tables'>,
  ): Promise<DatabaseConnectionTest> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Always succeed for demo
    const mockTables = [
      'users',
      'orders',
      'products',
      'categories',
      'transactions',
      'profiles',
      'permissions',
      'settings',
      'logs',
      'analytics',
    ]

    return {
      success: true,
      message: `成功连接到 ${config.dbType} 数据库`,
      tables: mockTables,
    }
  }

  return {
    // State
    knowledgeBases,
    isLoading,

    // Computed
    textKnowledgeBases,
    spreadsheetKnowledgeBases,
    databaseKnowledgeBases,
    personalKnowledgeBases,
    teamKnowledgeBases,
    totalDocumentCount,
    totalStorageUsed,
    totalStorageFormatted,
    overallSyncStatus,
    lastSyncTime,

    // Actions
    createKnowledgeBase,
    createFromTextImport,
    createFromSpreadsheetImport,
    createFromDatabaseImport,
    updateKnowledgeBase,
    updateKnowledgeBaseConfig,
    updateKnowledgeBaseSharing,
    deleteKnowledgeBase,
    addFileToKnowledgeBase,
    removeFileFromKnowledgeBase,
    addTableToKnowledgeBase,
    removeTableFromKnowledgeBase,
    testDatabaseConnection,
    loadKnowledgeBases,
    saveKnowledgeBases,

    // Helper functions
    canViewKnowledgeBase,
    canEditKnowledgeBase,
    getKnowledgeBasePermissionForUser,
    CURRENT_USER_ID,
    CURRENT_USER_TEAMS,
  }
})
