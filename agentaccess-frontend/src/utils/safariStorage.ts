import type { ModelProvider } from '@/types/settings'

// Safari-compatible storage service
// Uses memory + sessionStorage + beforeunload strategy for Safari compatibility
export class SafariStorageService {
  private readonly PROVIDERS_KEY = 'agentaccess-providers'
  private readonly ACTIVE_PROVIDER_KEY = 'agentaccess-active-provider'

  // In-memory cache
  private memoryProviders: ModelProvider[] = []
  private memoryActiveProviderId: string = ''
  private isInitialized = false

  constructor() {
    this.setupSafariWorkarounds()
  }

  private setupSafariWorkarounds(): void {
    // Save to sessionStorage and localStorage before page unload
    const saveData = () => {
      try {
        const data = {
          providers: this.memoryProviders,
          activeProviderId: this.memoryActiveProviderId,
          timestamp: Date.now(),
        }

        // Try multiple storage methods
        const jsonData = JSON.stringify(data)

        // SessionStorage (more reliable in Safari)
        try {
          sessionStorage.setItem('agentaccess-backup', jsonData)
        } catch (e) {
          console.warn('SessionStorage failed:', e)
        }

        // LocalStorage (for persistence across sessions)
        try {
          localStorage.setItem('agentaccess-backup', jsonData)
        } catch (e) {
          console.warn('LocalStorage failed:', e)
        }

        // Storage saved successfully
      } catch (error) {
        console.error('Failed to save Safari storage:', error)
      }
    }

    // Listen for page unload events
    window.addEventListener('beforeunload', saveData)
    window.addEventListener('pagehide', saveData)

    // Also save periodically in Safari
    setInterval(saveData, 5000) // Every 5 seconds
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('🔄 Safari storage already initialized')
      return
    }

    console.log('🚀 Initializing Safari-compatible storage...')

    try {
      // Try to load from sessionStorage first (faster)
      let savedData: any = null

      try {
        const sessionData = sessionStorage.getItem('agentaccess-backup')
        if (sessionData) {
          savedData = JSON.parse(sessionData)
          console.log('📦 Loaded from sessionStorage')
        }
      } catch (e) {
        console.warn('SessionStorage load failed:', e)
      }

      // Fallback to localStorage
      if (!savedData) {
        try {
          const localData = localStorage.getItem('agentaccess-backup')
          if (localData) {
            savedData = JSON.parse(localData)
            console.log('📦 Loaded from localStorage')
          }
        } catch (e) {
          console.warn('LocalStorage load failed:', e)
        }
      }

      // Fallback to old format (migration)
      if (!savedData) {
        try {
          const oldProviders = localStorage.getItem(this.PROVIDERS_KEY)
          const oldActive = localStorage.getItem(this.ACTIVE_PROVIDER_KEY)

          if (oldProviders) {
            savedData = {
              providers: JSON.parse(oldProviders),
              activeProviderId: oldActive || '',
              timestamp: Date.now(),
            }
            console.log('🔄 Migrated from old format')
          }
        } catch (e) {
          console.warn('Migration failed:', e)
        }
      }

      // Load data into memory
      if (savedData && savedData.providers) {
        this.memoryProviders = savedData.providers.map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
        }))
        this.memoryActiveProviderId = savedData.activeProviderId || ''
        console.log('✅ Safari storage loaded, providers:', this.memoryProviders.length)
      } else {
        console.log('📝 No existing data found, starting fresh')
      }

      this.isInitialized = true

      // Initial save
      this.saveToAllStorages()
    } catch (error) {
      console.error('❌ Safari storage initialization failed:', error)
      // Start with empty data
      this.memoryProviders = []
      this.memoryActiveProviderId = ''
      this.isInitialized = true
    }
  }

  private saveToAllStorages(): void {
    try {
      const data = {
        providers: this.memoryProviders,
        activeProviderId: this.memoryActiveProviderId,
        timestamp: Date.now(),
      }

      const jsonData = JSON.stringify(data)

      // Save to both storages for redundancy
      try {
        sessionStorage.setItem('agentaccess-backup', jsonData)
      } catch (e) {
        console.warn('SessionStorage save failed:', e)
      }

      try {
        localStorage.setItem('agentaccess-backup', jsonData)
      } catch (e) {
        console.warn('LocalStorage save failed:', e)
      }

      // Also save in old format for compatibility
      try {
        localStorage.setItem(this.PROVIDERS_KEY, JSON.stringify(this.memoryProviders))
        if (this.memoryActiveProviderId) {
          localStorage.setItem(this.ACTIVE_PROVIDER_KEY, this.memoryActiveProviderId)
        }
      } catch (e) {
        console.warn('Old format save failed:', e)
      }

      console.log('💾 Safari storage saved to all storages')
    } catch (error) {
      console.error('Failed to save to storages:', error)
    }
  }

  // Public init method for window global type compatibility
  init(): void {
    this.initialize().catch((error) => {
      console.error('Failed to initialize Safari storage:', error)
    })
  }

  // Model Provider operations
  async getModelProviders(): Promise<ModelProvider[]> {
    await this.initialize()
    console.log('📊 Safari storage returning providers:', this.memoryProviders.length)
    return [...this.memoryProviders] // Return copy
  }

  async saveModelProvider(provider: ModelProvider): Promise<void> {
    await this.initialize()

    const existingIndex = this.memoryProviders.findIndex((p) => p.id === provider.id)

    if (existingIndex >= 0) {
      this.memoryProviders[existingIndex] = provider
      console.log('✅ Updated provider in memory:', provider.id)
    } else {
      this.memoryProviders.push(provider)
      console.log('✅ Added provider to memory:', provider.id)
    }

    // Immediate save
    this.saveToAllStorages()
  }

  async deleteModelProvider(providerId: string): Promise<void> {
    await this.initialize()

    this.memoryProviders = this.memoryProviders.filter((p) => p.id !== providerId)
    console.log('🗑️ Deleted provider from memory:', providerId)

    // Clear active provider if it was deleted
    if (this.memoryActiveProviderId === providerId) {
      this.memoryActiveProviderId =
        this.memoryProviders.length > 0 ? (this.memoryProviders[0]?.id ?? '') : ''
    }

    // Immediate save
    this.saveToAllStorages()
  }

  async getActiveModelProvider(): Promise<ModelProvider | null> {
    await this.initialize()

    if (!this.memoryActiveProviderId) {
      console.log('📦 No active provider in Safari storage')
      return null
    }

    const activeProvider = this.memoryProviders.find((p) => p.id === this.memoryActiveProviderId)
    console.log('🎯 Active provider from Safari storage:', activeProvider?.name || 'Not found')
    return activeProvider || null
  }

  async setActiveModelProvider(providerId: string): Promise<void> {
    await this.initialize()

    this.memoryActiveProviderId = providerId

    // Update provider active status
    this.memoryProviders.forEach((p) => {
      p.isActive = p.id === providerId
    })

    console.log('✅ Set active provider in Safari storage:', providerId)

    // Immediate save
    this.saveToAllStorages()
  }

  async clearAllData(): Promise<void> {
    console.log('🗑️ Clearing all Safari storage data...')

    this.memoryProviders = []
    this.memoryActiveProviderId = ''

    // Clear all storages
    try {
      sessionStorage.removeItem('agentaccess-backup')
      localStorage.removeItem('agentaccess-backup')
      localStorage.removeItem(this.PROVIDERS_KEY)
      localStorage.removeItem(this.ACTIVE_PROVIDER_KEY)
    } catch (e) {
      console.warn('Failed to clear some storage:', e)
    }

    console.log('✅ Safari storage cleared')
  }

  // MCP Service operations (placeholder)
  async getMCPServices(): Promise<any[]> {
    return []
  }

  async saveMCPService(service: any): Promise<void> {
    console.log('MCP services not implemented in Safari storage')
  }

  // Debug methods
  logStorageInfo(): void {
    console.group('🔍 Safari Storage Info')

    try {
      console.log('📋 Memory providers:', this.memoryProviders.length)
      console.log('🎯 Active provider ID:', this.memoryActiveProviderId)

      // Check storages
      const sessionStorageData = sessionStorage.getItem('agentaccess-backup')
      const localStorageData = localStorage.getItem('agentaccess-backup')
      const oldFormatData = localStorage.getItem(this.PROVIDERS_KEY)

      console.log('💾 Storage status:')
      console.log(`  - SessionStorage: ${sessionStorageData ? 'Present' : 'Empty'}`)
      console.log(`  - LocalStorage (new): ${localStorageData ? 'Present' : 'Empty'}`)
      console.log(`  - LocalStorage (old): ${oldFormatData ? 'Present' : 'Empty'}`)

      if (this.memoryProviders.length > 0) {
        console.log('📊 Providers in memory:')
        this.memoryProviders.forEach((p) => {
          console.log(`  - ${p.name} (${p.id}): ${p.isActive ? 'ACTIVE' : 'Inactive'}`)
        })
      }
    } catch (error) {
      console.error('❌ Failed to read Safari storage info:', error)
    } finally {
      console.groupEnd()
    }
  }

  // Export/Import
  exportData(): object {
    return {
      providers: this.memoryProviders,
      activeProviderId: this.memoryActiveProviderId,
    }
  }

  importData(data: { providers?: ModelProvider[]; activeProviderId?: string }): void {
    if (data.providers) {
      this.memoryProviders = data.providers
    }
    if (data.activeProviderId) {
      this.memoryActiveProviderId = data.activeProviderId
    }
    this.saveToAllStorages()
    console.log('📥 Safari storage imported data')
  }
}

// Create singleton instance
export const safariStorageService = new SafariStorageService()

// Make available globally for debugging
if (typeof window !== 'undefined') {
  window.safariStorage = safariStorageService
  console.log('🔧 SafariStorage available as window.safariStorage')
}
