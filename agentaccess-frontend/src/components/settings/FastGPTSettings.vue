<template>
  <div class="fastgpt-settings">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium text-gray-900">FastGPT Integration</h3>
      <div class="flex items-center space-x-2">
        <div
          class="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
          :class="connectionStatusClass"
        >
          <span
            class="w-2 h-2 rounded-full"
            :class="{ 'animate-pulse': fastgptConnected }"
          ></span>
          <span>{{ connectionStatusText }}</span>
        </div>
      </div>
    </div>

    <p class="text-sm text-gray-600 mb-4">
      Connect to FastGPT server to enable real AI workflow execution. Configure your FastGPT API endpoint and key below.
    </p>

    <div v-if="fastgptConnectionError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
      <div class="flex items-start">
        <svg class="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <div class="text-sm text-red-800">{{ fastgptConnectionError }}</div>
      </div>
    </div>

    <form @submit.prevent="handleSave" class="space-y-4">
      <div>
        <label for="fastgpt-api-url" class="block text-sm font-medium text-gray-700 mb-1">
          API Endpoint URL
        </label>
        <input
          id="fastgpt-api-url"
          v-model="localApiUrl"
          type="url"
          placeholder="http://localhost:3000"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          :disabled="fastgptConnected"
        />
        <p class="mt-1 text-xs text-gray-500">
          Your FastGPT server API endpoint (e.g., http://localhost:3000)
        </p>
      </div>

      <div>
        <label for="fastgpt-api-key" class="block text-sm font-medium text-gray-700 mb-1">
          API Key
        </label>
        <div class="relative">
          <input
            id="fastgpt-api-key"
            v-model="localApiKey"
            :type="showApiKey ? 'text' : 'password'"
            placeholder="Enter your FastGPT API key"
            class="w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :disabled="fastgptConnected"
          />
          <button
            type="button"
            @click="showApiKey = !showApiKey"
            class="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            :disabled="fastgptConnected"
          >
            <svg v-if="showApiKey" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
        <p class="mt-1 text-xs text-gray-500">
          Get your API key from FastGPT server settings
        </p>
      </div>

      <div class="flex items-center justify-between pt-2">
        <button
          type="button"
          @click="handleTestConnection"
          :disabled="isTesting || !localApiUrl || !localApiKey"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isTesting" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Testing...
          </span>
          <span v-else>Test Connection</span>
        </button>

        <div class="flex items-center space-x-2">
          <button
            v-if="fastgptConnected"
            type="button"
            @click="handleDisconnect"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-red-500"
          >
            Disconnect
          </button>
          <button
            v-else
            type="submit"
            :disabled="!localApiUrl || !localApiKey"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save & Connect
          </button>
        </div>
      </div>
    </form>

    <div v-if="fastgptConnected" class="mt-6 pt-6 border-t border-gray-200">
      <div class="flex items-center justify-between mb-3">
        <h4 class="text-sm font-medium text-gray-900">Execution Mode</h4>
        <label class="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            v-model="localUseFastGPTExecution"
            @change="handleToggleExecution"
            class="sr-only peer"
          />
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          <span class="ml-2 text-sm text-gray-600">Use FastGPT for execution</span>
        </label>
      </div>
      <p class="text-xs text-gray-500">
        When enabled, workflows will be executed on the FastGPT server instead of using mock execution.
      </p>
    </div>

    <div class="mt-6 pt-6 border-t border-gray-200">
      <h4 class="text-sm font-medium text-gray-900 mb-2">Help & Documentation</h4>
      <ul class="text-xs text-gray-600 space-y-1">
        <li>
          <a href="https://fastgpt.run/docs" target="_blank" rel="noopener" class="text-blue-600 hover:text-blue-700">
            FastGPT Documentation →
          </a>
        </li>
        <li>
          <a href="https://fastgpt.run/docs/development/api" target="_blank" rel="noopener" class="text-blue-600 hover:text-blue-700">
            API Reference →
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useWorkflowStore } from '@/stores/workflow'
import { useSettingsStore } from '@/stores/settings'

const workflowStore = useWorkflowStore()
const settingsStore = useSettingsStore()

const {
  fastgptConnected,
  fastgptApiUrl,
  fastgptApiKey,
  fastgptConnectionError,
  useFastGPTExecution
} = storeToRefs(workflowStore)

const localApiUrl = ref(fastgptApiUrl.value)
const localApiKey = ref(fastgptApiKey.value)
const localUseFastGPTExecution = ref(useFastGPTExecution.value)
const showApiKey = ref(false)
const isTesting = ref(false)

// Update local values when store values change
watch([fastgptApiUrl, fastgptApiKey, useFastGPTExecution], ([url, key, execution]) => {
  localApiUrl.value = url
  localApiKey.value = key
  localUseFastGPTExecution.value = execution
})

const connectionStatusClass = computed(() => {
  if (fastgptConnected.value) {
    return 'bg-green-100 text-green-800'
  }
  return 'bg-gray-100 text-gray-800'
})

const connectionStatusText = computed(() => {
  if (fastgptConnected.value) {
    return 'Connected'
  }
  return 'Not Connected'
})

const handleSave = async () => {
  try {
    await workflowStore.connectToFastGPT(localApiUrl.value, localApiKey.value)

    // Save to settings
    await settingsStore.updateSettings({
      fastgptApiUrl: localApiUrl.value,
      fastgptApiKey: localApiKey.value
    })
  } catch (error) {
    // Error is already handled in store
    console.error('Failed to connect to FastGPT:', error)
  }
}

const handleTestConnection = async () => {
  if (!localApiUrl.value || !localApiKey.value) return

  isTesting.value = true
  try {
    await workflowStore.connectToFastGPT(localApiUrl.value, localApiKey.value)
  } catch (error) {
    console.error('Connection test failed:', error)
  } finally {
    isTesting.value = false
  }
}

const handleDisconnect = () => {
  workflowStore.disconnectFromFastGPT()
}

const handleToggleExecution = () => {
  useFastGPTExecution.value = localUseFastGPTExecution.value
}
</script>
