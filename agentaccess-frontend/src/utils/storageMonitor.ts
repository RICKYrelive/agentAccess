// Storage monitoring utility for debugging localStorage issues

export class StorageMonitor {
  static init(): void {
    // Log storage info on initialization
    StorageMonitor.logStorageInfo()
  }

  static logStorageInfo(): void {
    console.group('🔍 Storage Monitor')

    try {
      // Check localStorage availability
      if (typeof Storage === 'undefined') {
        console.error('❌ localStorage is not supported in this browser')
        return
      }

      // Check if localStorage is accessible
      const testKey = 'test-storage-access'
      localStorage.setItem(testKey, 'test')
      localStorage.removeItem(testKey)
      console.log('✅ localStorage is accessible')

      // List all items
      console.log('📋 localStorage items:')
      let totalSize = 0
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) {
          const value = localStorage.getItem(key) || ''
          const size = value.length
          totalSize += size
          console.log(`  - ${key}: ${size} bytes`)
        }
      }
      console.log(`📊 Total storage used: ${totalSize} bytes (${(totalSize / 1024).toFixed(2)} KB)`)

      // Check specific items
      const dbExists = localStorage.getItem('agentaccess-db')
      const backupExists = localStorage.getItem('agentaccess-db-backup')

      console.log('💾 Database status:')
      console.log(`  - Primary database: ${dbExists ? `${dbExists.length} bytes` : 'Not found'}`)
      console.log(
        `  - Backup database: ${backupExists ? `${backupExists.length} bytes` : 'Not found'}`,
      )

      // Check storage quota
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        navigator.storage.estimate().then((estimate) => {
          console.log('📈 Storage quota:')
          console.log(`  - Quota: ${((estimate.quota || 0) / 1024 / 1024).toFixed(2)} MB`)
          console.log(`  - Usage: ${((estimate.usage || 0) / 1024 / 1024).toFixed(2)} MB`)
          console.log(
            `  - Available: ${(((estimate.quota || 0) - (estimate.usage || 0)) / 1024 / 1024).toFixed(2)} MB`,
          )
        })
      }
    } catch (error) {
      console.error('❌ Storage monitoring failed:', error)
    } finally {
      console.groupEnd()
    }
  }

  static clearStorage(): void {
    console.warn('⚠️ Clearing all application storage...')
    localStorage.removeItem('agentaccess-db')
    localStorage.removeItem('agentaccess-db-backup')
    console.log('✅ Storage cleared')
  }

  static exportStorage(): object {
    const data: Record<string, string> = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('agentaccess-')) {
        data[key] = localStorage.getItem(key) || ''
      }
    }
    return data
  }

  static importStorage(data: Record<string, string>): void {
    console.log('📥 Importing storage data...')
    Object.entries(data).forEach(([key, value]) => {
      if (key.startsWith('agentaccess-')) {
        localStorage.setItem(key, value)
        console.log(`✅ Imported: ${key}`)
      }
    })
    console.log('🎉 Storage import complete')
  }
}

// Auto-monitor on development mode
if (import.meta.env.DEV) {
  // Storage monitoring interval disabled

  // Log initial storage info
  setTimeout(() => StorageMonitor.logStorageInfo(), 1000)
}

// Make available globally for debugging
if (typeof window !== 'undefined') {
  window.storageMonitor = StorageMonitor
  console.log('🔧 StorageMonitor available as window.storageMonitor')
  console.log('   - Use window.storageMonitor.logStorageInfo() to check storage')
  console.log('   - Use window.storageMonitor.clearStorage() to clear storage')
}
