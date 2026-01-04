// Global type declarations for Window interface extensions

declare global {
  interface Window {
    dbService?: {
      db: any
      initialized: boolean
      clearAllData: () => Promise<void>
    }
    settingsStore?: {
      saveSettings: () => Promise<void>
    }
    safariStorage?: {
      init: () => void
    }
    simpleStorage?: {
      init: () => void
    }
    storageMonitor?: {
      init: () => void
    }
  }
}

export {}
