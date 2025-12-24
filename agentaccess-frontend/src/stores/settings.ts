import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { ModelProvider, UserSettings } from '@/types/settings'
import { dbService } from '@/utils/database'
import { simpleStorageService } from '@/utils/simpleStorage'
import { safariStorageService } from '@/utils/safariStorage'

export const useSettingsStore = defineStore('settings', () => {
  // State
  const providers = ref<ModelProvider[]>([])
  const selectedProviderId = ref<string>('')
  const isLoading = ref(false)
  const isInitialized = ref(false)

  // Force use DB storage for debugging, but keep Safari detection for logging
  const isSafari = typeof navigator !== 'undefined' &&
    (/^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
     /iPad|iPhone|iPod/.test(navigator.userAgent))

  const useSimpleStorage = ref(false) // Always use DB for now
  const useSafariStorage = ref(false)  // Disable Safari storage for debugging

  console.log('🌐 Browser detected:', {
    userAgent: navigator.userAgent,
    isSafari,
    useSimpleStorage: useSimpleStorage.value,
    useSafariStorage: useSafariStorage.value,
    message: 'Forcing DB storage for debugging'
  })

  // Computed
  const activeProviders = computed(() => providers.value.filter(p => p.isActive))
  const selectedProvider = computed(() =>
    providers.value.find(p => p.id === selectedProviderId.value) || activeProviders.value[0] || null
  )

  // Actions
  const initialize = async () => {
    if (isInitialized.value || isLoading.value) return

    isLoading.value = true
    try {
      console.log('🚀 Initializing settings store...')

      if (useSafariStorage.value) {
        console.log('🦓 Using Safari-compatible storage')
        // Load providers from Safari storage
        providers.value = await safariStorageService.getModelProviders()
        console.log('📊 Loaded providers from Safari storage:', providers.value.length, providers.value)
      } else if (useSimpleStorage.value) {
        console.log('📦 Using simple localStorage storage')
        // Load providers from simple storage
        providers.value = await simpleStorageService.getModelProviders()
        console.log('📊 Loaded providers from simple storage:', providers.value.length, providers.value)
      } else {
        console.log('📦 Using SQL.js database storage')
        await dbService.initialize()
        // Load providers from database
        providers.value = await dbService.getModelProviders()
        console.log('📊 Loaded providers from database:', providers.value.length, providers.value)
      }

      // If no providers exist, create the default one
      if (providers.value.length === 0) {
        console.log('📝 No providers found, creating default MiniMax provider...')
        const defaultProvider = createDefaultProvider()
        providers.value.push(defaultProvider)
        selectedProviderId.value = defaultProvider.id
        console.log('✅ Default provider created and selected:', defaultProvider.id)

        // Also create a fallback provider
        try {
          const fallbackProvider = createFallbackProvider()
          providers.value.push(fallbackProvider)
          console.log('✅ Fallback provider created:', fallbackProvider.id)
        } catch (fallbackError) {
          console.warn('⚠️ Failed to create fallback provider:', fallbackError)
        }

        // Save providers
        if (useSafariStorage.value) {
          await safariStorageService.saveModelProvider(defaultProvider)
          try {
            const fallbackProvider = createFallbackProvider()
            await safariStorageService.saveModelProvider(fallbackProvider)
          } catch (e) {
            console.warn('⚠️ Failed to save fallback provider to Safari storage')
          }
        } else if (useSimpleStorage.value) {
          await simpleStorageService.saveModelProvider(defaultProvider)
          try {
            const fallbackProvider = createFallbackProvider()
            await simpleStorageService.saveModelProvider(fallbackProvider)
          } catch (e) {
            console.warn('⚠️ Failed to save fallback provider')
          }
        } else {
          await dbService.saveModelProvider(defaultProvider)
          try {
            const fallbackProvider = createFallbackProvider()
            await dbService.saveModelProvider(fallbackProvider)
          } catch (e) {
            console.warn('⚠️ Failed to save fallback provider')
          }
        }

        console.log('📦 Final providers count after creation:', providers.value.length)
      } else {
        console.log('📋 Existing providers found, setting active provider...')
        // Set selected provider ID from active provider or first provider
        const activeProvider = useSafariStorage.value
          ? await safariStorageService.getActiveModelProvider()
          : useSimpleStorage.value
          ? await simpleStorageService.getActiveModelProvider()
          : await dbService.getActiveModelProvider()
        console.log('🎯 Active provider from storage:', activeProvider)

        if (activeProvider) {
          selectedProviderId.value = activeProvider.id
          console.log('✅ Selected active provider:', activeProvider.id)
        } else if (providers.value.length > 0) {
          selectedProviderId.value = providers.value[0].id
          console.log('✅ Selected first provider:', providers.value[0].id)
        }
      }

      isInitialized.value = true
      console.log('🎉 Settings store initialization complete')
      console.log('📊 Final state - Providers:', providers.value.length, 'Selected:', selectedProviderId.value)
    } catch (error) {
      console.error('❌ Failed to initialize settings store:', error)
      console.error('❌ Stack trace:', error.stack)
      // In case of error, create a fallback default provider
      try {
        console.log('🔄 Attempting to create fallback provider...')
        const fallbackProvider = await createDefaultProvider()
        providers.value = [fallbackProvider]
        selectedProviderId.value = fallbackProvider.id
        isInitialized.value = true
        console.log('✅ Fallback provider created:', fallbackProvider.id)
      } catch (fallbackError) {
        console.error('❌ Failed to create fallback provider:', fallbackError)
      }
    } finally {
      isLoading.value = false
    }
  }

  // Reset and force create default provider (for debugging)
  const resetAndCreateDefault = async () => {
    console.log('🔄 Resetting database and creating default provider...')
    try {
      await dbService.clearAllData()
      providers.value = []
      selectedProviderId.value = ''
      await initialize()
    } catch (error) {
      console.error('❌ Failed to reset and create default:', error)
    }
  }

  const createDefaultProvider = () => {
    const defaultProvider: ModelProvider = {
      id: 'provider-minimax-default',
      name: 'MiniMax-M2-ADD',
      type: 'openai', // MiniMax API is OpenAI compatible
      baseUrl: 'https://www.aiping.cn/api/v1', // 使用代理路径避免CORS
      apiKey: 'QC-df8e09c87aca2ca5bcfcb5b9eb7e1d51-ecb9d56f18d353981b21dfa1ad532808',
      model: 'MiniMax-M2.1',
      maxTokens: 4000,
      temperature: 0.7,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    console.log('✅ Default MiniMax provider created:', defaultProvider.name)
    return defaultProvider
  }

  // 创建备用提供商（使用DeepSeek API）
  const createFallbackProvider = () => {
    const fallbackProvider: ModelProvider = {
      id: 'provider-deepseek-fallback',
      name: 'Minimax-Default',
      type: 'openai',
      baseUrl: 'https://www.aiping.cn/api/v1',
      apiKey: 'QC-df8e09c87aca2ca5bcfcb5b9eb7e1d51-ecb9d56f18d353981b21dfa1ad532808', // 需要用户填入自己的API key
      model: 'deepseek-chat',
      maxTokens: 4000,
      temperature: 0.7,
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    console.log('✅ Fallback DeepSeek provider created:', fallbackProvider.name)
    return fallbackProvider
  }

  const addProvider = async (provider: Omit<ModelProvider, 'id' | 'createdAt' | 'updatedAt'>) => {
    console.log('Store addProvider called with:', provider)

    const newProvider: ModelProvider = {
      ...provider,
      id: `provider-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    try {
      if (useSafariStorage.value) {
        await safariStorageService.saveModelProvider(newProvider)
      } else if (useSimpleStorage.value) {
        await simpleStorageService.saveModelProvider(newProvider)
      } else {
        await dbService.saveModelProvider(newProvider)
      }
      providers.value.push(newProvider)
      console.log('Provider added to store, total providers:', providers.value.length)
      return newProvider
    } catch (error) {
      console.error('Failed to add provider:', error)
      throw error
    }
  }

  const updateProvider = async (providerId: string, updates: Partial<ModelProvider>) => {
    const providerIndex = providers.value.findIndex(p => p.id === providerId)
    if (providerIndex === -1) return

    const updatedProvider: ModelProvider = {
      ...providers.value[providerIndex],
      ...updates,
      updatedAt: new Date()
    }

    try {
      if (useSafariStorage.value) {
        await safariStorageService.saveModelProvider(updatedProvider)
      } else if (useSimpleStorage.value) {
        await simpleStorageService.saveModelProvider(updatedProvider)
      } else {
        await dbService.saveModelProvider(updatedProvider)
      }
      providers.value[providerIndex] = updatedProvider
    } catch (error) {
      console.error('Failed to update provider:', error)
      throw error
    }
  }

  const deleteProvider = async (providerId: string) => {
    console.log('Store deleteProvider called with:', providerId)
    console.log('Providers before deletion:', providers.value.length)

    try {
      if (useSafariStorage.value) {
        await safariStorageService.deleteModelProvider(providerId)
      } else if (useSimpleStorage.value) {
        await simpleStorageService.deleteModelProvider(providerId)
      } else {
        await dbService.deleteModelProvider(providerId)
      }
      providers.value = providers.value.filter(p => p.id !== providerId)
      console.log('Providers after deletion:', providers.value.length)

      // If the deleted provider was selected, select another one
      if (selectedProviderId.value === providerId) {
        const remainingActiveProviders = providers.value.filter(p => p.isActive)
        selectedProviderId.value = remainingActiveProviders.length > 0 ? remainingActiveProviders[0].id : ''
        console.log('Selected provider updated to:', selectedProviderId.value)
      }
    } catch (error) {
      console.error('Failed to delete provider:', error)
      throw error
    }
  }

  const selectProvider = async (providerId: string) => {
    try {
      if (useSafariStorage.value) {
        await safariStorageService.setActiveModelProvider(providerId)
      } else if (useSimpleStorage.value) {
        await simpleStorageService.setActiveModelProvider(providerId)
      } else {
        await dbService.setActiveModelProvider(providerId)
      }
      selectedProviderId.value = providerId

      // Update active status for all providers
      providers.value.forEach(p => {
        p.isActive = p.id === providerId
      })
    } catch (error) {
      console.error('Failed to select provider:', error)
      throw error
    }
  }

  const setActiveProvider = async (providerId: string, isActive: boolean) => {
    const provider = providers.value.find(p => p.id === providerId)
    if (!provider) return

    try {
      if (isActive) {
        // If activating, set as the active provider
        await selectProvider(providerId)
      } else {
        // If deactivating, update provider
        await updateProvider(providerId, { isActive })

        // If deactivating the selected provider, select another active one
        if (selectedProviderId.value === providerId) {
          const remainingActiveProviders = providers.value.filter(p => p.isActive && p.id !== providerId)
          if (remainingActiveProviders.length > 0) {
            await selectProvider(remainingActiveProviders[0].id)
          } else {
            selectedProviderId.value = ''
          }
        }
      }
    } catch (error) {
      console.error('Failed to set active provider:', error)
      throw error
    }
  }

  const testProviderConnection = async (provider: ModelProvider): Promise<{ success: boolean; error?: string }> => {
    if (!provider.baseUrl || !provider.apiKey) {
      return { success: false, error: '缺少必要的配置信息' }
    }

    try {
      // Test connection to the provider
      const response = await fetch(`${provider.baseUrl}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${provider.apiKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '连接失败'
      }
    }
  }

  const updateSettings = async (settings: Partial<UserSettings>) => {
    // Store FastGPT settings in localStorage for now
    if (settings.fastgptApiUrl !== undefined) {
      localStorage.setItem('fastgpt-api-url', settings.fastgptApiUrl)
    }
    if (settings.fastgptApiKey !== undefined) {
      localStorage.setItem('fastgpt-api-key', settings.fastgptApiKey)
    }
  }

  return {
    // State
    providers,
    selectedProviderId,
    isLoading,
    isInitialized,

    // Computed
    activeProviders,
    selectedProvider,

    // Actions
    initialize,
    createDefaultProvider,
    createFallbackProvider,
    resetAndCreateDefault,
    addProvider,
    updateProvider,
    deleteProvider,
    selectProvider,
    setActiveProvider,
    testProviderConnection,
    updateSettings,
    clearAllData: async () => {
      if (useSafariStorage.value) {
        await safariStorageService.clearAllData()
      } else if (useSimpleStorage.value) {
        await simpleStorageService.clearAllData()
      } else {
        await dbService.clearAllData()
      }
      providers.value = []
      selectedProviderId.value = ''
      isInitialized.value = false
    },
    toggleStorageMode: () => {
      useSafariStorage.value = !useSafariStorage.value
      useSimpleStorage.value = !useSimpleStorage.value
      console.log('Switched storage mode to:',
        useSafariStorage.value ? 'Safari Storage' :
        useSimpleStorage.value ? 'Simple Storage' : 'SQL.js')
    },
    storageInfo: () => {
      if (useSafariStorage.value) {
        safariStorageService.logStorageInfo()
      } else if (useSimpleStorage.value) {
        simpleStorageService.logStorageInfo()
      } else {
        console.log('🔍 Using DB storage - checking localStorage directly:')
        console.log('agentaccess-db:', localStorage.getItem('agentaccess-db'))
        console.log('agentaccess-db-backup:', localStorage.getItem('agentaccess-db-backup'))
        console.log('agentaccess-providers:', localStorage.getItem('agentaccess-providers'))
        console.log('agentaccess-active-provider:', localStorage.getItem('agentaccess-active-provider'))
        console.log('DB initialized:', !!dbService.db)
        console.log('DB initialized flag:', dbService.initialized)
      }
    }
  }
})
