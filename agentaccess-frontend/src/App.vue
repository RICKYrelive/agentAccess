<script setup lang="ts">
import { onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import AppLayout from '@/components/layout/AppLayout.vue'

// Initialize settings store globally
const settingsStore = useSettingsStore()

onMounted(async () => {
  try {
    await settingsStore.initialize()
  } catch (error) {
    console.error('Failed to initialize settings store:', error)
  }
})
</script>

<template>
  <AppLayout />
</template>
