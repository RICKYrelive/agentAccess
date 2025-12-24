<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">用户设置</h3>
        <button
          @click="$emit('close')"
          class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Tab Navigation -->
      <div class="border-b border-gray-200">
        <nav class="flex space-x-8 px-6" aria-label="Tabs">
          <button
            @click="activeTab = 'providers'"
            :class="[
              'py-3 px-1 border-b-2 font-medium text-sm',
              activeTab === 'providers'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            模型提供商
          </button>
          <button
            @click="activeTab = 'mcp-global'"
            :class="[
              'py-3 px-1 border-b-2 font-medium text-sm',
              activeTab === 'mcp-global'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            MCP服务管理
          </button>
          <button
            @click="activeTab = 'general'"
            :class="[
              'py-3 px-1 border-b-2 font-medium text-sm',
              activeTab === 'general'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            通用设置
          </button>
          <button
            @click="activeTab = 'fastgpt'"
            :class="[
              'py-3 px-1 border-b-2 font-medium text-sm',
              activeTab === 'fastgpt'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            FastGPT
          </button>
          <button
            @click="activeTab = 'debug'"
            :class="[
              'py-3 px-1 border-b-2 font-medium text-sm',
              activeTab === 'debug'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            调试
          </button>
        </nav>
      </div>

      <!-- Settings Content -->
      <div class="flex-1 overflow-y-auto">
        <!-- Model Providers Tab -->
        <div v-if="activeTab === 'providers'" class="p-6 space-y-6">
          <!-- Current Provider Selection -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <label class="block text-sm font-medium text-gray-700 mb-3">当前默认模型提供商</label>
            <select
              v-model="settingsStore.selectedProviderId"
              @change="onProviderChange"
              class="w-full input-field text-sm"
            >
              <option
                v-for="provider in activeProviders"
                :key="provider.id"
                :value="provider.id"
              >
                {{ provider.name }} ({{ provider.model }})
              </option>
            </select>
          </div>

          <!-- Provider List -->
          <div class="space-y-4">
            <h4 class="text-sm font-medium text-gray-900">已配置的提供商</h4>
            <div class="space-y-3">
              <div
                v-for="provider in providers"
                :key="provider.id"
                class="border border-gray-200 rounded-lg p-4"
                :class="{ 'ring-2 ring-primary-500': provider.id === settingsStore.selectedProviderId }"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-2">
                      <h4 class="text-sm font-medium text-gray-900">{{ provider.name }}</h4>
                      <span
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                        :class="provider.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                      >
                        {{ provider.isActive ? '启用' : '禁用' }}
                      </span>
                      <span
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                        :class="provider.id === settingsStore.selectedProviderId ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'"
                      >
                        {{ provider.id === settingsStore.selectedProviderId ? '默认' : '' }}
                      </span>
                    </div>
                    <div class="text-xs text-gray-500 space-y-1">
                      <div>类型: {{ provider.type }}</div>
                      <div>模型: {{ provider.model }}</div>
                      <div v-if="provider.baseUrl">地址: {{ provider.baseUrl }}</div>
                      <div v-if="provider.maxTokens">最大令牌: {{ provider.maxTokens }}</div>
                      <div v-if="provider.temperature">温度: {{ provider.temperature }}</div>
                    </div>
                  </div>
                  <div class="flex space-x-2 ml-4">
                    <button
                      @click="editProvider(provider)"
                      class="p-1 text-gray-400 hover:text-gray-600"
                      title="编辑"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      @click="testProvider(provider)"
                      :disabled="testingProvider === provider.id"
                      class="p-1 text-gray-400 hover:text-gray-600"
                      title="测试连接"
                    >
                      <svg
                        v-if="testingProvider !== provider.id"
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <div v-else class="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary-600"></div>
                    </button>
                    <button
                      @click="setAsDefault(provider.id)"
                      v-if="provider.id !== settingsStore.selectedProviderId"
                      class="p-1 text-gray-400 hover:text-gray-600"
                      title="设为默认"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </button>
                    <button
                      @click="deleteProvider(provider.id)"
                      class="p-1 text-red-400 hover:text-red-600"
                      title="删除"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Add Provider Button -->
          <button
            @click="showAddProviderDialog = true"
            class="w-full btn-secondary flex items-center justify-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>添加模型提供商</span>
          </button>
        </div>

        <!-- MCP Services Tab -->
        <div v-else-if="activeTab === 'mcp-global'" class="p-6">
          <div class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">MCP服务管理</h3>
            <p class="text-sm text-gray-500 mb-6">在这里配置全局可用的MCP服务</p>
            <div class="bg-gray-50 rounded-lg p-6 max-w-2xl mx-auto text-left">
              <h4 class="font-medium text-gray-900 mb-3">功能说明</h4>
              <ul class="text-sm text-gray-600 space-y-2">
                <li class="flex items-start">
                  <svg class="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span>添加和管理全局MCP服务配置</span>
                </li>
                <li class="flex items-start">
                  <svg class="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span>配置MCP服务的连接参数和权限</span>
                </li>
                <li class="flex items-start">
                  <svg class="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span>服务将在所有对话中可用</span>
                </li>
              </ul>
              <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p class="text-sm text-blue-800">
                  <strong>提示：</strong>会话级的MCP服务启停请在主页的"MCP服务设置"中配置。
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- General Settings Tab -->
        <div v-else-if="activeTab === 'general'" class="p-6">
          <div class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">通用设置</h3>
            <p class="text-sm text-gray-500">更多通用设置功能即将推出</p>
          </div>
        </div>

        <!-- FastGPT Settings Tab -->
        <div v-else-if="activeTab === 'fastgpt'" class="p-6">
          <FastGPTSettings />
        </div>

        <!-- Debug Tab -->
        <div v-else-if="activeTab === 'debug'" class="p-6">
          <div class="max-w-2xl mx-auto space-y-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">调试工具</h3>

            <!-- Debug Information -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-medium text-gray-900 mb-2">当前状态</h4>
              <div class="space-y-1 text-sm font-mono">
                <p>提供商数量: {{ settingsStore.providers.length }}</p>
                <p>已初始化: {{ settingsStore.isInitialized }}</p>
                <p>正在加载: {{ settingsStore.isLoading }}</p>
                <p>选中提供商: {{ settingsStore.selectedProviderId }}</p>
              </div>
            </div>

            <!-- Debug Actions -->
            <div class="space-y-3">
              <h4 class="font-medium text-gray-900">调试操作</h4>

              <button
                @click="handleResetAndCreateDefault"
                class="w-full btn-secondary flex items-center justify-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>重置数据库并创建默认提供商</span>
              </button>

              <button
                @click="console.log('Debug - Providers:', settingsStore.providers)"
                class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm"
              >
                打印提供商信息到控制台
              </button>

              <button
                @click="testManualReset"
                class="w-full bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 py-2 rounded-lg text-sm"
              >
                手动测试重置功能
              </button>
            </div>

            <div class="text-xs text-gray-500">
              <p>💡 提示: 打开浏览器开发者工具查看详细日志</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="p-6 border-t border-gray-200">
        <div class="flex space-x-3">
          <button @click="saveSettings" class="btn-primary flex-1">保存设置</button>
          <button @click="$emit('close')" class="btn-secondary flex-1">取消</button>
        </div>
      </div>

      <!-- Add/Edit Provider Dialog -->
      <div v-if="showAddProviderDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ editingProvider ? '编辑模型提供商' : '添加模型提供商' }}
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">名称</label>
              <input
                v-model="providerForm.name"
                type="text"
                class="input-field w-full"
                placeholder="例如: OpenAI GPT-4"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">类型</label>
              <select v-model="providerForm.type" class="input-field w-full">
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="ollama">Ollama</option>
                <option value="custom">自定义</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Base URL</label>
              <input
                v-model="providerForm.baseUrl"
                type="text"
                class="input-field w-full"
                placeholder="https://api.openai.com/v1"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">API Key</label>
              <input
                v-model="providerForm.apiKey"
                type="password"
                class="input-field w-full"
                placeholder="sk-..."
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">模型</label>
              <input
                v-model="providerForm.model"
                type="text"
                class="input-field w-full"
                placeholder="gpt-4"
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">最大令牌</label>
                <input
                  v-model.number="providerForm.maxTokens"
                  type="number"
                  class="input-field w-full"
                  placeholder="4000"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">温度</label>
                <input
                  v-model.number="providerForm.temperature"
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  class="input-field w-full"
                  placeholder="0.7"
                />
              </div>
            </div>
          </div>
          <div class="flex space-x-3 mt-6">
            <button @click="saveProvider" class="btn-primary flex-1">保存</button>
            <button @click="cancelProviderEdit" class="btn-secondary flex-1">取消</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores/settings'
import type { ModelProvider } from '@/types/settings'
import FastGPTSettings from './FastGPTSettings.vue'

defineEmits<{
  close: []
}>()

const settingsStore = useSettingsStore()

// Tab state
const activeTab = ref<'providers' | 'mcp-global' | 'general' | 'fastgpt' | 'debug'>('providers')

// Provider management
const showAddProviderDialog = ref(false)
const editingProvider = ref<ModelProvider | null>(null)
const testingProvider = ref<string | null>(null)

const providerForm = ref({
  name: '',
  type: 'openai' as 'openai' | 'anthropic' | 'ollama' | 'custom',
  baseUrl: 'https://api.openai.com/v1',
  apiKey: '',
  model: 'gpt-4',
  maxTokens: 4000,
  temperature: 0.7,
  isActive: true
})

// Computed
const { providers, activeProviders } = storeToRefs(settingsStore)

// Methods
const onProviderChange = () => {
  // Provider selection is handled by v-model binding
}

const editProvider = (provider: ModelProvider) => {
  editingProvider.value = provider
  providerForm.value = {
    name: provider.name,
    type: provider.type,
    baseUrl: provider.baseUrl || '',
    apiKey: provider.apiKey || '',
    model: provider.model,
    maxTokens: provider.maxTokens || 4000,
    temperature: provider.temperature || 0.7,
    isActive: provider.isActive
  }
  showAddProviderDialog.value = true
}

const testProvider = async (provider: ModelProvider) => {
  testingProvider.value = provider.id
  try {
    const result = await settingsStore.testProviderConnection(provider)
    if (result.success) {
      alert('连接成功！')
    } else {
      alert(`连接失败: ${result.error}`)
    }
  } catch (error) {
    alert('测试连接时发生错误')
  } finally {
    testingProvider.value = null
  }
}

const setAsDefault = (providerId: string) => {
  settingsStore.selectProvider(providerId)
}

const deleteProvider = (providerId: string) => {
  console.log('Delete provider called with ID:', providerId)
  if (confirm('确定要删除这个模型提供商吗？')) {
    console.log('User confirmed deletion, calling store method')
    settingsStore.deleteProvider(providerId)
    console.log('Provider deleted, current providers count:', settingsStore.providers.length)
  }
}

const saveProvider = () => {
  console.log('Save provider called, form data:', providerForm.value)
  if (!providerForm.value.name || !providerForm.value.model) {
    console.log('Validation failed - missing required fields')
    alert('请填写必要的信息')
    return
  }

  if (editingProvider.value) {
    // Update existing provider
    console.log('Updating existing provider:', editingProvider.value.id)
    settingsStore.updateProvider(editingProvider.value.id, providerForm.value)
  } else {
    // Add new provider
    console.log('Adding new provider')
    settingsStore.addProvider(providerForm.value)
    console.log('Provider added, current providers count:', settingsStore.providers.length)
  }

  cancelProviderEdit()
}

const cancelProviderEdit = () => {
  showAddProviderDialog.value = false
  editingProvider.value = null
  providerForm.value = {
    name: '',
    type: 'openai',
    baseUrl: 'https://api.openai.com/v1',
    apiKey: '',
    model: 'gpt-4',
    maxTokens: 4000,
    temperature: 0.7,
    isActive: true
  }
}

const saveSettings = () => {
  // Settings are automatically saved in the store
  alert('设置已保存')
}

const handleResetAndCreateDefault = async () => {
  console.log('🔄 Reset button clicked - Enhanced version')
  console.log('📊 Current state before reset:')
  console.log('- Providers count:', settingsStore.providers.length)
  console.log('- DB initialized:', !!window.dbService?.db)
  console.log('- Store initialized:', settingsStore.isInitialized)

  if (confirm('确定要重置数据库并创建默认提供商吗？这将清除所有现有数据。')) {
    try {
      console.log('🔄 Starting reset process...')

      // Step 1: Clear all data
      console.log('🧹 Step 1: Clearing all data...')
      await window.dbService.clearAllData()
      console.log('✅ Data cleared')

      // Step 2: Reset store state
      console.log('🔄 Step 2: Resetting store state...')
      settingsStore.providers = []
      settingsStore.selectedProviderId = ''
      settingsStore.isInitialized = false
      console.log('✅ Store state reset')

      // Step 3: Reinitialize
      console.log('🚀 Step 3: Reinitializing...')
      await settingsStore.initialize()
      console.log('✅ Store reinitialized')

      // Step 4: Verify results
      console.log('📊 Final state after reset:')
      console.log('- Providers count:', settingsStore.providers.length)
      console.log('- Selected provider:', settingsStore.selectedProviderId)
      console.log('- DB initialized:', !!window.dbService?.db)

      if (settingsStore.providers.length > 0) {
        console.log('✅ Default provider created successfully:', settingsStore.providers[0])
        alert('数据库已重置，默认MiniMax提供商已创建')
      } else {
        console.error('❌ No providers were created')
        alert('重置完成，但没有创建提供商')
      }

    } catch (error) {
      console.error('❌ Reset failed:', error)
      console.error('❌ Stack trace:', error.stack)
      alert(`重置失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  } else {
    console.log('🚫 Reset cancelled by user')
  }
}

// Keep the old function for compatibility
const resetAndCreateDefault = handleResetAndCreateDefault

// Manual test function
const testManualReset = () => {
  console.log('🧪 Manual test started')

  // Test basic click event
  console.log('✅ Button click event works')

  // Test store access
  console.log('📊 Store test:')
  console.log('- settingsStore available:', !!settingsStore)
  console.log('- providers length:', settingsStore.providers.length)

  // Test direct function call
  console.log('🔄 Testing direct function call...')
  handleResetAndCreateDefault()
}

// Initialize settings store when component mounts
onMounted(async () => {
  await settingsStore.initialize()
})
</script>