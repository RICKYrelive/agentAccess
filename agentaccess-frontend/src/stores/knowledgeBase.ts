import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import type { KnowledgeBase, TextImportForm, SpreadsheetImportForm, DatabaseImportForm, DatabaseConnectionTest, KnowledgeBaseType } from '@/types/knowledge-base'

const KNOWLEDGE_BASES_STORAGE_KEY = 'agentaccess-knowledge-bases'

export const useKnowledgeBaseStore = defineStore('knowledgeBase', () => {
  // State
  const knowledgeBases = ref<KnowledgeBase[]>([])
  const isLoading = ref(false)
  const isInitialized = ref(false)

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
        knowledgeBases.value = data.map((kb: any) => ({
          ...kb,
          createdAt: new Date(kb.createdAt),
          updatedAt: new Date(kb.updatedAt)
        }))
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
          fileType: 'pdf',
          fileName: 'product_docs.pdf'
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
      },
      {
        id: 'kb-spreadsheet-1',
        name: '销售数据表格',
        description: '2024年各季度销售数据统计',
        type: 'spreadsheet',
        sourceInfo: {
          fileType: 'xlsx',
          fileName: 'sales_2024.xlsx'
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5)
      },
      {
        id: 'kb-database-1',
        name: '用户信息数据库',
        description: 'MySQL用户管理数据库连接',
        type: 'database',
        sourceInfo: {
          dbType: 'mysql',
          host: 'localhost',
          port: 3306,
          database: 'user_db',
          table: 'users'
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3)
      }
    ]
    knowledgeBases.value = demoKBs
    saveKnowledgeBases()
  }

  // Initialize store
  loadKnowledgeBases()

  // Watch for changes and auto-save
  watch(knowledgeBases, () => {
    saveKnowledgeBases()
  }, { deep: true })

  // Computed
  const textKnowledgeBases = computed(() =>
    knowledgeBases.value.filter(kb => kb.type === 'text')
  )

  const spreadsheetKnowledgeBases = computed(() =>
    knowledgeBases.value.filter(kb => kb.type === 'spreadsheet')
  )

  const databaseKnowledgeBases = computed(() =>
    knowledgeBases.value.filter(kb => kb.type === 'database')
  )

  // Actions
  const createKnowledgeBase = (
    type: KnowledgeBaseType,
    name: string,
    description: string,
    sourceInfo: Record<string, any>
  ): KnowledgeBase => {
    const newKB: KnowledgeBase = {
      id: `kb-${type}-${Date.now()}`,
      name,
      description,
      type,
      sourceInfo,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    knowledgeBases.value.unshift(newKB)
    return newKB
  }

  const createFromTextImport = (form: TextImportForm) => {
    return createKnowledgeBase('text', form.name, form.description, {
      fileType: form.file?.name.split('.').pop(),
      fileName: form.file?.name,
      fileSize: form.file?.size
    })
  }

  const createFromSpreadsheetImport = (form: SpreadsheetImportForm) => {
    return createKnowledgeBase('spreadsheet', form.name, form.description, {
      fileType: form.file?.name.split('.').pop(),
      fileName: form.file?.name,
      fileSize: form.file?.size
    })
  }

  const createFromDatabaseImport = (form: DatabaseImportForm) => {
    return createKnowledgeBase('database', form.name, form.description, {
      dbType: form.dbType,
      host: form.host,
      port: form.port,
      database: form.database,
      table: form.table
    })
  }

  const updateKnowledgeBase = (id: string, updates: Partial<Pick<KnowledgeBase, 'name' | 'description'>>) => {
    const index = knowledgeBases.value.findIndex(kb => kb.id === id)
    if (index > -1) {
      knowledgeBases.value[index] = {
        ...knowledgeBases.value[index],
        ...updates,
        updatedAt: new Date()
      } as KnowledgeBase
    }
  }

  const deleteKnowledgeBase = (id: string) => {
    const index = knowledgeBases.value.findIndex(kb => kb.id === id)
    if (index > -1) {
      knowledgeBases.value.splice(index, 1)
    }
  }

  // Mock database connection test
  const testDatabaseConnection = async (config: Omit<DatabaseImportForm, 'name' | 'description'>): Promise<DatabaseConnectionTest> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Always succeed for demo
    const mockTables = [
      'users',
      'orders',
      'products',
      'categories',
      'transactions'
    ]

    return {
      success: true,
      message: `成功连接到 ${config.dbType} 数据库`,
      tables: mockTables
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

    // Actions
    createKnowledgeBase,
    createFromTextImport,
    createFromSpreadsheetImport,
    createFromDatabaseImport,
    updateKnowledgeBase,
    deleteKnowledgeBase,
    testDatabaseConnection,
    loadKnowledgeBases,
    saveKnowledgeBases
  }
})
