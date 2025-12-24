import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import '@/utils/storageMonitor'
import { dbService } from '@/utils/database'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// Export to window for debugging
window.dbService = dbService

// Export settings store when it's available
import { useSettingsStore } from '@/stores/settings'
setTimeout(() => {
  const settingsStore = useSettingsStore()
  window.settingsStore = settingsStore
  console.log('🔧 Debug: Settings store and DB service exported to window')
}, 100)
