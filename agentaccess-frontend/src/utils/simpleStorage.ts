import type { ModelProvider } from '@/types/settings'

// Simple localStorage-based storage service (fallback for SQL.js issues)
export class SimpleStorageService {
  private readonly PROVIDERS_KEY = 'agentaccess-providers'
  private readonly ACTIVE_PROVIDER_KEY = 'agentaccess-active-provider'
  private readonly SETTINGS_KEY = 'agentaccess-settings'

  // Model Provider operations
  async getModelProviders(): Promise<ModelProvider[]> {
    try {
      const stored = localStorage.getItem(this.PROVIDERS_KEY)
      if (!stored) {
        console.log('📦 No providers found in localStorage')
        return []
      }

      const providers = JSON.parse(stored)
      console.log('📊 Loaded providers from localStorage:', providers.length)
      return providers.map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt)
      }))
    } catch (error) {
      console.error('❌ Failed to load providers from localStorage:', error)
      return []
    }
  }

  async saveModelProvider(provider: ModelProvider): Promise<void> {
    try {
      const providers = await this.getModelProviders()
      const existingIndex = providers.findIndex(p => p.id === provider.id)

      if (existingIndex >= 0) {
        providers[existingIndex] = provider
        console.log('✅ Updated existing provider:', provider.id)
      } else {
        providers.push(provider)
        console.log('✅ Added new provider:', provider.id)
      }

      localStorage.setItem(this.PROVIDERS_KEY, JSON.stringify(providers))
      console.log('💾 Saved providers to localStorage, count:', providers.length)
    } catch (error) {
      console.error('❌ Failed to save provider to localStorage:', error)
      throw error
    }
  }

  async deleteModelProvider(providerId: string): Promise<void> {
    try {
      const providers = await this.getModelProviders()
      const filteredProviders = providers.filter(p => p.id !== providerId)

      localStorage.setItem(this.PROVIDERS_KEY, JSON.stringify(filteredProviders))
      console.log('🗑️ Deleted provider:', providerId)
    } catch (error) {
      console.error('❌ Failed to delete provider from localStorage:', error)
      throw error
    }
  }

  async getActiveModelProvider(): Promise<ModelProvider | null> {
    try {
      const activeId = localStorage.getItem(this.ACTIVE_PROVIDER_KEY)
      if (!activeId) {
        console.log('📦 No active provider found')
        return null
      }

      const providers = await this.getModelProviders()
      const activeProvider = providers.find(p => p.id === activeId)

      console.log('🎯 Active provider:', activeProvider?.name || 'Not found')
      return activeProvider || null
    } catch (error) {
      console.error('❌ Failed to get active provider:', error)
      return null
    }
  }

  async setActiveModelProvider(providerId: string): Promise<void> {
    try {
      localStorage.setItem(this.ACTIVE_PROVIDER_KEY, providerId)
      console.log('✅ Set active provider:', providerId)
    } catch (error) {
      console.error('❌ Failed to set active provider:', error)
      throw error
    }
  }

  // Utility methods
  async clearAllData(): Promise<void> {
    try {
      localStorage.removeItem(this.PROVIDERS_KEY)
      localStorage.removeItem(this.ACTIVE_PROVIDER_KEY)
      localStorage.removeItem(this.SETTINGS_KEY)
      console.log('🗑️ Cleared all data from localStorage')
    } catch (error) {
      console.error('❌ Failed to clear data:', error)
      throw error
    }
  }

  // MCP Service operations (placeholder)
  async getMCPServices(): Promise<any[]> {
    return []
  }

  async saveMCPService(service: any): Promise<void> {
    console.log('MCP services not implemented in simple storage')
  }

  // Initialize method for compatibility
  async initialize(): Promise<void> {
    console.log('🚀 SimpleStorageService initialized (no DB needed)')
  }

  // Debug methods
  logStorageInfo(): void {
    console.group('🔍 Simple Storage Info')

    try {
      const providers = localStorage.getItem(this.PROVIDERS_KEY)
      const activeProvider = localStorage.getItem(this.ACTIVE_PROVIDER_KEY)

      console.log('📋 Storage items:')
      console.log(`  - ${this.PROVIDERS_KEY}:`, providers ? JSON.parse(providers).length + ' items' : 'Not found')
      console.log(`  - ${this.ACTIVE_PROVIDER_KEY}:`, activeProvider || 'Not found')

      if (providers) {
        const parsed = JSON.parse(providers)
        console.log('📊 Providers:', parsed.map((p: ModelProvider) => ({
          id: p.id,
          name: p.name,
          active: p.isActive,
          baseUrl: p.baseUrl
        })))
      }
    } catch (error) {
      console.error('❌ Failed to read storage info:', error)
    } finally {
      console.groupEnd()
    }
  }

  // Export/Import for debugging
  exportData(): object {
    return {
      providers: localStorage.getItem(this.PROVIDERS_KEY),
      activeProvider: localStorage.getItem(this.ACTIVE_PROVIDER_KEY)
    }
  }

  importData(data: { providers?: string; activeProvider?: string }): void {
    if (data.providers) {
      localStorage.setItem(this.PROVIDERS_KEY, data.providers)
      console.log('📥 Imported providers')
    }
    if (data.activeProvider) {
      localStorage.setItem(this.ACTIVE_PROVIDER_KEY, data.activeProvider)
      console.log('📥 Imported active provider')
    }
  }
}

// Create singleton instance
export const simpleStorageService = new SimpleStorageService()

// Make available globally for debugging
if (typeof window !== 'undefined') {
  window.simpleStorage = simpleStorageService
  console.log('🔧 SimpleStorage available as window.simpleStorage')
}