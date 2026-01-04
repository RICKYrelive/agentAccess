import initSqlJs from 'sql.js'
import type { Database } from 'sql.js'
import type { ModelProvider } from '@/types/settings'

export class DatabaseService {
  private db: Database | null = null
  private initialized = false
  private initPromise: Promise<void> | null = null

  async initialize(): Promise<void> {
    // Return existing promise if initialization is in progress
    if (this.initPromise) {
      return this.initPromise
    }

    // Return immediately if already initialized
    if (this.initialized && this.db) {
      return
    }

    // Start initialization
    this.initPromise = this._doInitialize()
    return this.initPromise
  }

  private async _doInitialize(): Promise<void> {
    try {
      console.log('🚀 Initializing database service...')

      // Load SQL.js
      const SQL = await initSqlJs({
        locateFile: (file) => `https://sql.js.org/dist/${file}`,
      })
      console.log('✅ SQL.js loaded successfully')

      // Try to load existing database from localStorage
      let shouldCreateDefaultProviders = false
      const savedDb = localStorage.getItem('agentaccess-db')
      console.log('📦 Found saved database:', !!savedDb)

      if (savedDb) {
        try {
          const parsedData = JSON.parse(savedDb)
          console.log('📊 Database data size:', parsedData.length, 'bytes')

          if (Array.isArray(parsedData) && parsedData.length > 0) {
            const uInt8Array = new Uint8Array(parsedData)
            this.db = new SQL.Database(uInt8Array)
            console.log('✅ Database loaded from localStorage')
          } else {
            console.warn('⚠️ Invalid database data, trying backup...')
            shouldCreateDefaultProviders = !(await this._tryLoadBackup())
          }
        } catch (error) {
          console.warn('❌ Failed to load existing database, trying backup:', error)
          shouldCreateDefaultProviders = !(await this._tryLoadBackup())
        }
      } else {
        console.log('📝 No saved database found, trying backup...')
        shouldCreateDefaultProviders = !(await this._tryLoadBackup())
        if (!shouldCreateDefaultProviders) {
          console.log('✅ Database loaded from backup')
        }
      }

      // Initialize tables
      this.createTables()

      // Check if we have any providers
      const providerCount = (this.db!.exec('SELECT COUNT(*) as count FROM model_providers')[0]?.values[0]?.[0] ?? 0) as number
      console.log('📊 Existing provider count:', providerCount)

      if (providerCount === 0 || shouldCreateDefaultProviders) {
        console.log('🔧 Will create default providers')
      }

      this.initialized = true
      console.log('🎉 Database service initialization complete')
    } catch (error) {
      console.error('❌ Failed to initialize database:', error)
      // Fallback: try to create a simple in-memory database
      try {
        console.log('🔄 Attempting fallback initialization...')
        const SQL = await initSqlJs()
        this.db = new SQL.Database()
        this.createTables()
        this.initialized = true
        console.log('✅ Fallback database created')
      } catch (fallbackError) {
        console.error('❌ Fallback initialization also failed:', fallbackError)
        const err = error instanceof Error ? error : new Error(String(error))
        throw new Error(`Database initialization failed: ${err.message}`)
      }
    } finally {
      this.initPromise = null
    }
  }

  private async _tryLoadBackup(): Promise<boolean> {
    try {
      const backupData = localStorage.getItem('agentaccess-db-backup')
      if (backupData) {
        const parsedBackup = JSON.parse(backupData)
        if (parsedBackup.data && Array.isArray(parsedBackup.data)) {
          const SQL = await initSqlJs()
          const uInt8Array = new Uint8Array(parsedBackup.data)
          this.db = new SQL.Database(uInt8Array)
          console.log(
            '✅ Database loaded from backup (',
            parsedBackup.truncated ? 'partial' : 'complete',
            ')',
          )

          // Try to restore primary storage from backup
          if (parsedBackup.truncated) {
            console.warn('⚠️ Backup was truncated, will create new default providers')
            return false // Signal that we need to create default providers
          }
          return true // Success
        }
      }
    } catch (backupError) {
      console.error('❌ Failed to load backup:', backupError)
    }
    return false // Failed to load backup
  }

  private createTables(): void {
    if (!this.db) throw new Error('Database not initialized')

    // Create model_providers table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS model_providers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        base_url TEXT NOT NULL,
        api_key TEXT NOT NULL,
        model TEXT NOT NULL,
        max_tokens INTEGER DEFAULT 4000,
        temperature REAL DEFAULT 0.7,
        is_active BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create mcp_services table for future use
    this.db.run(`
      CREATE TABLE IF NOT EXISTS mcp_services (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        config TEXT NOT NULL,
        is_active BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
  }

  private saveToStorage(): void {
    if (!this.db) return

    try {
      const data = this.db.export()
      const dataArray = Array.from(data)

      // Try primary storage
      try {
        localStorage.setItem('agentaccess-db', JSON.stringify(dataArray))
        console.log('💾 Database saved to localStorage, size:', dataArray.length, 'bytes')
      } catch (storageError) {
        console.warn('⚠️ Primary storage failed, trying backup storage:', storageError)

        // Try backup storage with compression
        try {
          const compressed = JSON.stringify({
            data: dataArray.slice(0, 10000), // Save first 10KB as backup
            timestamp: Date.now(),
            truncated: dataArray.length > 10000,
          })
          localStorage.setItem('agentaccess-db-backup', compressed)
          console.log('💾 Backup database saved')
        } catch (backupError) {
          console.error('❌ Both primary and backup storage failed:', {
            primary: storageError,
            backup: backupError,
          })
        }
      }
    } catch (error) {
      console.error('❌ Failed to export database:', error)
    }
  }

  // Model Provider CRUD operations
  async getModelProviders(): Promise<ModelProvider[]> {
    await this.initialize()
    if (!this.db) throw new Error('Database not initialized')

    try {
      const stmt = this.db.prepare('SELECT * FROM model_providers ORDER BY created_at DESC')
      const result = stmt.getAsObject([]) // This gets all rows as an array of objects
      stmt.free()

      // SQL.js getAsObject with empty parameter returns all rows
      const rows = Array.isArray(result) ? result : [result]
      console.log('🔍 DB query - total rows found:', rows.length)

      // Convert SQLite boolean to JavaScript boolean and map field names
      return rows
        .map((row: any) => {
          console.log('🔍 Raw DB row:', row)
          return {
            id: row.id || '',
            name: row.name || '',
            type: row.type || 'openai',
            baseUrl: row.base_url || '',
            apiKey: row.api_key || '',
            model: row.model || '',
            maxTokens: row.max_tokens || 4000,
            temperature: row.temperature || 0.7,
            isActive: Boolean(row.is_active),
            createdAt: row.created_at ? new Date(row.created_at) : new Date(),
            updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(),
          }
        })
        .filter((provider) => provider.id) // Filter out any empty/invalid providers
    } catch (error) {
      console.error('Failed to get model providers:', error)
      return []
    }
  }

  async saveModelProvider(provider: ModelProvider): Promise<void> {
    await this.initialize()
    if (!this.db) throw new Error('Database not initialized')

    // Validate input
    if (!provider.id || !provider.name) {
      throw new Error('Provider must have id and name')
    }

    try {
      console.log('💾 Saving provider to DB:', provider.id, provider.name)

      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO model_providers
        (id, name, type, base_url, api_key, model, max_tokens, temperature, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE((SELECT created_at FROM model_providers WHERE id = ?), CURRENT_TIMESTAMP), CURRENT_TIMESTAMP)
      `)

      const result = stmt.run([
        provider.id || '',
        provider.name || '',
        provider.type || 'openai',
        provider.baseUrl || '',
        provider.apiKey || '',
        provider.model || '',
        provider.maxTokens || 4000,
        provider.temperature || 0.7,
        provider.isActive ? 1 : 0,
        provider.id,
      ])
      stmt.free()

      console.log('💾 Save result:', result)
      this.saveToStorage()
    } catch (error) {
      console.error('Failed to save model provider:', error)
      throw error
    }
  }

  async deleteModelProvider(providerId: string): Promise<void> {
    await this.initialize()
    if (!this.db) throw new Error('Database not initialized')

    // Validate input
    if (!providerId || typeof providerId !== 'string') {
      throw new Error(`Invalid providerId: ${providerId}`)
    }

    try {
      console.log('🗑️ Deleting provider from DB:', providerId)
      const stmt = this.db.prepare('DELETE FROM model_providers WHERE id = ?')
      const result = stmt.run([providerId]) as { changes: number }
      stmt.free()

      console.log('🗑️ Delete result:', result)

      // Check if any rows were affected
      if (result.changes === 0) {
        console.warn('⚠️ No provider found with ID:', providerId)
      }

      this.saveToStorage()
    } catch (error) {
      console.error('Failed to delete model provider:', error)
      throw error
    }
  }

  async getActiveModelProvider(): Promise<ModelProvider | null> {
    await this.initialize()
    if (!this.db) throw new Error('Database not initialized')

    try {
      const stmt = this.db.prepare('SELECT * FROM model_providers WHERE is_active = 1 LIMIT 1')
      const result = stmt.getAsObject([])
      stmt.free()

      // SQL.js getAsObject returns the first row when using LIMIT 1
      if (!result || Object.keys(result).length === 0) return null

      const provider = result as any
      console.log('🎯 Active provider from DB:', provider)

      return {
        id: provider.id || '',
        name: provider.name || '',
        type: provider.type || 'openai',
        baseUrl: provider.base_url || '',
        apiKey: provider.api_key || '',
        model: provider.model || '',
        maxTokens: provider.max_tokens || 4000,
        temperature: provider.temperature || 0.7,
        isActive: Boolean(provider.is_active),
        createdAt: provider.created_at ? new Date(provider.created_at) : new Date(),
        updatedAt: provider.updated_at ? new Date(provider.updated_at) : new Date(),
      }
    } catch (error) {
      console.error('Failed to get active model provider:', error)
      return null
    }
  }

  async setActiveModelProvider(providerId: string): Promise<void> {
    await this.initialize()
    if (!this.db) throw new Error('Database not initialized')

    try {
      // Start transaction
      this.db.run('BEGIN TRANSACTION')

      // Set all providers to inactive
      this.db.run('UPDATE model_providers SET is_active = 0')

      // Set specified provider to active
      const stmt = this.db.prepare(
        'UPDATE model_providers SET is_active = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      )
      stmt.run([providerId])
      stmt.free()

      // Commit transaction
      this.db.run('COMMIT')

      this.saveToStorage()
    } catch (error) {
      console.error('Failed to set active model provider:', error)
      this.db?.run('ROLLBACK')
      throw error
    }
  }

  // MCP Service operations (for future use)
  async getMCPServices(): Promise<any[]> {
    await this.initialize()
    if (!this.db) throw new Error('Database not initialized')

    try {
      const stmt = this.db.prepare('SELECT * FROM mcp_services ORDER BY created_at DESC')
      const result = stmt.getAsObject([]) as any[]
      stmt.free()

      return (Array.isArray(result) ? result : [result]).map((row: any) => ({
        ...row,
        isActive: Boolean(row.is_active),
        config: JSON.parse(row.config || '{}'),
      }))
    } catch (error) {
      console.error('Failed to get MCP services:', error)
      return []
    }
  }

  async saveMCPService(service: any): Promise<void> {
    await this.initialize()
    if (!this.db) throw new Error('Database not initialized')

    try {
      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO mcp_services
        (id, name, type, config, is_active, updated_at)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `)

      stmt.run([
        service.id,
        service.name,
        service.type,
        JSON.stringify(service.config || {}),
        service.isActive ? 1 : 0,
      ])
      stmt.free()

      this.saveToStorage()
    } catch (error) {
      console.error('Failed to save MCP service:', error)
      throw error
    }
  }

  // Export/Import functionality
  exportDatabase(): Uint8Array | null {
    if (!this.db) return null
    return this.db.export()
  }

  async importDatabase(data: Uint8Array): Promise<void> {
    const SQL = await initSqlJs()
    this.db = new SQL.Database(data)
    this.createTables()
    this.saveToStorage()
  }

  async clearAllData(): Promise<void> {
    await this.initialize()
    if (!this.db) throw new Error('Database not initialized')

    try {
      this.db.run('DELETE FROM model_providers')
      this.db.run('DELETE FROM mcp_services')
      this.saveToStorage()
    } catch (error) {
      console.error('Failed to clear database:', error)
      throw error
    }
  }
}

// Singleton instance
export const dbService = new DatabaseService()
