<template>
  <Teleport to="body">
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="emit('close')">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-slate-900">从 OpenAPI 导入工具</h3>
          <button @click="emit('close')" class="text-slate-400 hover:text-slate-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="px-6 py-4 overflow-y-auto max-h-[60vh]">
          <!-- Step 1: File Upload -->
          <div v-if="step === 1">
            <div
              class="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors"
              @dragover.prevent
              @drop.prevent="handleDrop"
              @click="$refs.fileInput?.click()"
            >
              <input
                ref="fileInput"
                type="file"
                accept=".json,.yaml,.yml"
                class="hidden"
                @change="handleFileSelect"
              />
              <svg class="w-12 h-12 mx-auto mb-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p class="text-sm text-slate-600 mb-1">点击上传或拖拽文件到此处</p>
              <p class="text-xs text-slate-400">支持 .json, .yaml, .yml 格式的 OpenAPI 文件</p>
            </div>

            <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p class="text-sm text-red-600">{{ error }}</p>
            </div>
          </div>

          <!-- Step 2: Preview -->
          <div v-if="step === 2">
            <div class="mb-4">
              <h4 class="text-sm font-medium text-slate-900 mb-2">解析结果</h4>
              <p class="text-xs text-slate-500">从 OpenAPI 文件中提取了 {{ endpoints.length }} 个端点，将生成 {{ endpoints.length }} 个 MCP 工具</p>
            </div>

            <div class="border border-slate-200 rounded-lg overflow-hidden">
              <div class="bg-slate-50 px-4 py-2 border-b border-slate-200">
                <span class="text-sm font-medium text-slate-700">生成的工具列表</span>
              </div>
              <div class="max-h-60 overflow-y-auto">
                <div v-for="(endpoint, index) in endpoints" :key="index" class="px-4 py-3 border-b border-slate-100 last:border-b-0">
                  <div class="flex items-center space-x-2">
                    <span :class="getMethodBadgeClass(endpoint.method)" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium">
                      {{ endpoint.method }}
                    </span>
                    <span class="text-sm font-mono text-slate-700">{{ endpoint.path }}</span>
                  </div>
                  <p v-if="endpoint.summary" class="text-xs text-slate-500 mt-1 ml-1">{{ endpoint.summary }}</p>
                  <p class="text-xs text-slate-400 mt-1">工具: {{ generateToolName(endpoint) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-slate-200 flex justify-between">
          <button
            v-if="step === 2"
            @click="step = 1"
            class="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md"
          >
            上一步
          </button>
          <div v-else></div>

          <div class="flex space-x-3">
            <button @click="emit('close')" class="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md">
              取消
            </button>
            <button
              v-if="step === 2"
              @click="confirmImport"
              class="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
            >
              确认导入
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMCPManagementStore } from '@/stores/mcpManagement'

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

const emit = defineEmits<{
  close: []
}>()

const store = useMCPManagementStore()

const step = ref(1)
const error = ref('')
const endpoints = ref<Array<{ method: HTTPMethod; path: string; summary?: string }>>([])
const fileInput = ref<HTMLInputElement | null>(null)

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    parseFile(file)
  }
}

const handleDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0]
  if (file) {
    parseFile(file)
  }
}

const parseFile = async (file: File) => {
  error.value = ''
  const text = await file.text()

  try {
    let spec: any
    if (file.name.endsWith('.json')) {
      spec = JSON.parse(text)
    } else {
      // Simple YAML parser (for demo purposes)
      spec = parseYAML(text)
    }

    // Extract endpoints from OpenAPI spec
    const extracted: Array<{ method: HTTPMethod; path: string; summary?: string }> = []
    const paths = spec.paths || {}

    for (const [path, methods] of Object.entries(paths)) {
      for (const [method, details] of Object.entries(methods as Record<string, any>)) {
        if (['get', 'post', 'put', 'delete', 'patch'].includes(method)) {
          extracted.push({
            method: method.toUpperCase() as HTTPMethod,
            path,
            summary: (details as any).summary || (details as any).description,
          })
        }
      }
    }

    if (extracted.length === 0) {
      throw new Error('未找到任何 API 端点')
    }

    endpoints.value = extracted
    step.value = 2
  } catch (e) {
    error.value = `解析失败: ${e instanceof Error ? e.message : '未知错误'}`
  }
}

// Simple YAML parser for demo (not production-ready)
const parseYAML = (text: string): any => {
  // This is a very basic YAML parser for demonstration
  // In production, use a library like js-yaml
  try {
    // Try to parse as indented YAML-like structure
    const lines = text.split('\n')
    const result: any = { paths: {} }

    let currentPath: string | null = null
    let currentMethod: string | null = null

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue

      // Detect path definitions (e.g., "/users:")
      if (trimmed.startsWith('/') && trimmed.endsWith(':')) {
        currentPath = trimmed.slice(0, -1)
        result.paths[currentPath] = {}
      }
      // Detect method definitions
      else if (currentPath && ['get:', 'post:', 'put:', 'delete:', 'patch:'].includes(trimmed.toLowerCase())) {
        currentMethod = trimmed.slice(0, -1).toLowerCase()
        result.paths[currentPath][currentMethod] = {}
      }
      // Detect summary
      else if (trimmed.startsWith('summary:') && currentPath && currentMethod) {
        const summary = trimmed.slice(8).trim().replace(/['"]/g, '')
        result.paths[currentPath][currentMethod].summary = summary
      }
    }

    return result
  } catch {
    // If YAML parsing fails, return empty spec
    return { paths: {} }
  }
}

const getMethodBadgeClass = (method: HTTPMethod) => {
  const classes: Record<HTTPMethod, string> = {
    GET: 'bg-green-100 text-green-800',
    POST: 'bg-blue-100 text-blue-800',
    PUT: 'bg-yellow-100 text-yellow-800',
    DELETE: 'bg-red-100 text-red-800',
    PATCH: 'bg-purple-100 text-purple-800',
  }
  return classes[method]
}

const generateToolName = (endpoint: { method: HTTPMethod; path: string }) => {
  const pathParts = endpoint.path.split('/').filter(Boolean)
  const resource = pathParts[pathParts.length - 1] || pathParts[0] || 'api'
  return `${endpoint.method.toLowerCase()}_${resource}`
}

const confirmImport = () => {
  // Create tools for each endpoint (without creating a gateway)
  for (const endpoint of endpoints.value) {
    store.createMCPTool({
      name: generateToolName(endpoint),
      description: endpoint.summary || `${endpoint.method} ${endpoint.path}`,
      type: 'custom',
      category: 'openapi',
      isEnabled: true,
      status: 'active',
      config: {
        url: `${endpoint.path}`,
        authType: 'none',
      },
    })
  }

  // Reset and close
  step.value = 1
  endpoints.value = []
  error.value = ''

  setTimeout(() => {
    emit('close')
  }, 100)
}
</script>
