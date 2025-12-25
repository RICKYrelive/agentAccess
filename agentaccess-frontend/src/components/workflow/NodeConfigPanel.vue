<template>
  <div class="bg-white h-full flex flex-col">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200 flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900">节点配置</h3>
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

    <!-- Node Info -->
    <div v-if="node" class="p-3 border-b border-gray-200 bg-gray-50">
      <div class="flex items-center space-x-2">
        <div
          :class="[
            'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
            getNodeStyle().bgColor,
          ]"
        >
          <svg
            class="w-5 h-5"
            :class="getNodeStyle().textColor"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="getNodeStyle().icon"
            />
          </svg>
        </div>
        <div class="min-w-0">
          <p class="text-base font-semibold text-gray-900">{{ getNodeStyle().name }}</p>
          <p class="text-xs text-gray-500 truncate">{{ getNodeStyle().description }}</p>
        </div>
      </div>
    </div>

    <!-- Configuration Form -->
    <div class="flex-1 overflow-y-auto px-4 py-3 space-y-5">
      <div v-if="!node" class="text-center py-8">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <p class="mt-2 text-sm text-gray-500">请选择一个节点进行配置</p>
      </div>

      <div v-else>
        <!-- Basic Configuration -->
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5"> 节点名称 </label>
            <input
              v-model="localConfig.name"
              type="text"
              class="input-field"
              placeholder="输入节点名称"
              @change="updateConfiguration"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5"> 描述 </label>
            <textarea
              v-model="localConfig.description"
              rows="3"
              class="input-field"
              placeholder="输入节点描述"
              @change="updateConfiguration"
            />
          </div>
        </div>

        <!-- Input Node Configuration -->
        <div v-if="node.type === 'input'" class="space-y-3 pt-4 border-t border-gray-200">
          <h4 class="text-sm font-semibold text-gray-900">输入配置</h4>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">输入类型</label>
            <select
              v-model="localConfig.inputType"
              class="input-field"
              @change="updateConfiguration"
            >
              <option value="text">文本输入</option>
              <option value="file">文件上传</option>
              <option value="image">图片上传</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">占位提示</label>
            <input
              v-model="localConfig.placeholder"
              type="text"
              class="input-field"
              placeholder="输入框占位文本"
              @change="updateConfiguration"
            />
          </div>
          <div class="flex items-center">
            <input
              v-model="localConfig.required"
              type="checkbox"
              id="required"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              @change="updateConfiguration"
            />
            <label for="required" class="ml-2 text-sm text-gray-700">必填项</label>
          </div>
        </div>

        <!-- Web Search Node Configuration -->
        <div v-if="node.type === 'web-search'" class="space-y-3 pt-4 border-t border-gray-200">
          <h4 class="text-sm font-semibold text-gray-900">搜索配置</h4>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">搜索引擎</label>
            <select
              v-model="localConfig.searchEngine"
              class="input-field"
              @change="updateConfiguration"
            >
              <option value="google">Google</option>
              <option value="bing">Bing</option>
              <option value="baidu">百度</option>
              <option value="duckduckgo">DuckDuckGo</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              最大结果数: {{ localConfig.maxResults }}
            </label>
            <input
              v-model="localConfig.maxResults"
              type="range"
              min="1"
              max="50"
              class="w-full"
              @input="updateConfiguration"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              超时时间: {{ localConfig.timeout }}ms
            </label>
            <input
              v-model="localConfig.timeout"
              type="range"
              min="5000"
              max="60000"
              step="5000"
              class="w-full"
              @input="updateConfiguration"
            />
          </div>
        </div>

        <!-- Question Rewrite Node Configuration -->
        <div
          v-if="node.type === 'question-rewrite'"
          class="space-y-3 pt-4 border-t border-gray-200"
        >
          <h4 class="text-sm font-semibold text-gray-900">重写配置</h4>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">模型</label>
            <select v-model="localConfig.model" class="input-field" @change="updateConfiguration">
              <option value="Qwen2.5-7B">Qwen2.5-7B</option>
              <option value="GPT-3.5">GPT-3.5</option>
              <option value="GPT-4">GPT-4</option>
              <option value="MiniMax-M2.1">MiniMax-M2.1</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              最大Token数: {{ localConfig.maxTokens }}
            </label>
            <input
              v-model="localConfig.maxTokens"
              type="range"
              min="100"
              max="4000"
              step="100"
              class="w-full"
              @input="updateConfiguration"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              温度: {{ localConfig.temperature }}
            </label>
            <input
              v-model="localConfig.temperature"
              type="range"
              min="0"
              max="2"
              step="0.1"
              class="w-full"
              @input="updateConfiguration"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">系统提示词</label>
            <textarea
              v-model="localConfig.systemPrompt"
              rows="3"
              class="input-field"
              placeholder="输入系统提示词..."
              @change="updateConfiguration"
            />
          </div>
        </div>

        <!-- Knowledge Retrieval Node Configuration -->
        <div
          v-if="node.type === 'knowledge-retrieval'"
          class="space-y-3 pt-4 border-t border-gray-200"
        >
          <h4 class="text-sm font-semibold text-gray-900">知识库配置</h4>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">检索模式</label>
            <select
              v-model="localConfig.retrievalMode"
              class="input-field"
              @change="updateConfiguration"
            >
              <option value="vector">向量检索</option>
              <option value="keyword">关键词检索</option>
              <option value="hybrid">混合检索</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              检索权重: {{ localConfig.retrievalWeight }}
            </label>
            <input
              v-model="localConfig.retrievalWeight"
              type="range"
              min="0"
              max="1"
              step="0.1"
              class="w-full"
              @input="updateConfiguration"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              召回数量: {{ localConfig.recallCount }}
            </label>
            <input
              v-model="localConfig.recallCount"
              type="range"
              min="1"
              max="20"
              class="w-full"
              @input="updateConfiguration"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              召回阈值: {{ localConfig.recallThreshold }}
            </label>
            <input
              v-model="localConfig.recallThreshold"
              type="range"
              min="0"
              max="1"
              step="0.1"
              class="w-full"
              @input="updateConfiguration"
            />
          </div>
        </div>

        <!-- LLM Call Node Configuration -->
        <div v-if="node.type === 'llm-call'" class="space-y-3 pt-4 border-t border-gray-200">
          <h4 class="text-sm font-semibold text-gray-900">LLM配置</h4>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">模型</label>
            <select v-model="localConfig.model" class="input-field" @change="updateConfiguration">
              <option value="Qwen2.5-7B">Qwen2.5-7B</option>
              <option value="GPT-3.5">GPT-3.5</option>
              <option value="GPT-4">GPT-4</option>
              <option value="MiniMax-M2.1">MiniMax-M2.1</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              最大Token数: {{ localConfig.maxTokens }}
            </label>
            <input
              v-model="localConfig.maxTokens"
              type="range"
              min="100"
              max="8000"
              step="100"
              class="w-full"
              @input="updateConfiguration"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              温度: {{ localConfig.temperature }}
            </label>
            <input
              v-model="localConfig.temperature"
              type="range"
              min="0"
              max="2"
              step="0.1"
              class="w-full"
              @input="updateConfiguration"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">系统提示词</label>
            <textarea
              v-model="localConfig.systemPrompt"
              rows="4"
              class="input-field"
              placeholder="输入系统提示词..."
              @change="updateConfiguration"
            />
          </div>
          <div class="flex items-center">
            <input
              v-model="localConfig.streamOutput"
              type="checkbox"
              id="stream"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              @change="updateConfiguration"
            />
            <label for="stream" class="ml-2 text-sm text-gray-700">流式输出</label>
          </div>
        </div>

        <!-- Data Processing Node Configuration -->
        <div v-if="node.type === 'data-processing'" class="space-y-3 pt-4 border-t border-gray-200">
          <h4 class="text-sm font-semibold text-gray-900">数据处理配置</h4>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">操作类型</label>
            <select
              v-model="localConfig.operation"
              class="input-field"
              @change="updateConfiguration"
            >
              <option value="filter">过滤</option>
              <option value="map">映射</option>
              <option value="reduce">聚合</option>
              <option value="sort">排序</option>
              <option value="transform">转换</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">处理规则</label>
            <textarea
              v-model="localConfig.rules"
              rows="4"
              class="input-field font-mono text-sm"
              placeholder="输入处理规则（JSON格式）"
              @change="updateConfiguration"
            />
          </div>
        </div>

        <!-- Condition Node Configuration -->
        <div v-if="node.type === 'condition'" class="space-y-3 pt-4 border-t border-gray-200">
          <h4 class="text-sm font-semibold text-gray-900">条件配置</h4>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">条件类型</label>
            <select
              v-model="localConfig.conditionType"
              class="input-field"
              @change="updateConfiguration"
            >
              <option value="equals">等于</option>
              <option value="not-equals">不等于</option>
              <option value="contains">包含</option>
              <option value="greater-than">大于</option>
              <option value="less-than">小于</option>
              <option value="is-empty">为空</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">比较值</label>
            <input
              v-model="localConfig.compareValue"
              type="text"
              class="input-field"
              placeholder="输入比较值"
              @change="updateConfiguration"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">为真时连接</label>
            <input
              v-model="localConfig.trueBranch"
              type="text"
              class="input-field"
              placeholder="输入为真时的目标节点ID"
              @change="updateConfiguration"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">为假时连接</label>
            <input
              v-model="localConfig.falseBranch"
              type="text"
              class="input-field"
              placeholder="输入为假时的目标节点ID"
              @change="updateConfiguration"
            />
          </div>
        </div>

        <!-- Code Execution Node Configuration -->
        <div v-if="node.type === 'code-execution'" class="space-y-3 pt-4 border-t border-gray-200">
          <h4 class="text-sm font-semibold text-gray-900">代码执行配置</h4>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">编程语言</label>
            <select
              v-model="localConfig.language"
              class="input-field"
              @change="updateConfiguration"
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="java">Java</option>
              <option value="go">Go</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">代码</label>
            <textarea
              v-model="localConfig.code"
              rows="10"
              class="input-field font-mono text-sm"
              placeholder="输入要执行的代码..."
              @change="updateConfiguration"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              超时时间: {{ localConfig.timeout }}ms
            </label>
            <input
              v-model="localConfig.timeout"
              type="range"
              min="5000"
              max="120000"
              step="5000"
              class="w-full"
              @input="updateConfiguration"
            />
          </div>
        </div>

        <!-- Output Node Configuration -->
        <div v-if="node.type === 'output'" class="space-y-3 pt-4 border-t border-gray-200">
          <h4 class="text-sm font-semibold text-gray-900">输出配置</h4>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">输出类型</label>
            <select
              v-model="localConfig.outputType"
              class="input-field"
              @change="updateConfiguration"
            >
              <option value="text">文本</option>
              <option value="json">JSON</option>
              <option value="html">HTML</option>
              <option value="markdown">Markdown</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">格式</label>
            <select v-model="localConfig.format" class="input-field" @change="updateConfiguration">
              <option value="plain">纯文本</option>
              <option value="markdown">Markdown</option>
              <option value="html">HTML</option>
              <option value="code">代码块</option>
            </select>
          </div>
        </div>

        <!-- Annotated Data Retrieval Configuration -->
        <div
          v-if="node.type === 'annotated-data-retrieval'"
          class="space-y-3 pt-4 border-t border-gray-200"
        >
          <h4 class="text-sm font-semibold text-gray-900">标注数据检索配置</h4>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">检索策略</label>
            <select
              v-model="localConfig.retrievalStrategy"
              class="input-field"
              @change="updateConfiguration"
            >
              <option value="exact">精确匹配</option>
              <option value="fuzzy">模糊匹配</option>
              <option value="semantic">语义匹配</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              最大结果数: {{ localConfig.maxResults }}
            </label>
            <input
              v-model="localConfig.maxResults"
              type="range"
              min="1"
              max="100"
              class="w-full"
              @input="updateConfiguration"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              相似度阈值: {{ localConfig.threshold }}
            </label>
            <input
              v-model="localConfig.threshold"
              type="range"
              min="0"
              max="1"
              step="0.1"
              class="w-full"
              @input="updateConfiguration"
            />
          </div>
        </div>

        <!-- Start/End nodes have no specific configuration -->
        <div v-if="node.type === 'start' || node.type === 'end'" class="text-center py-8">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p class="mt-2 text-sm text-gray-500">
            {{ node.type === 'start' ? '开始节点' : '结束节点' }}无需配置
          </p>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div
      v-if="node && node.type !== 'start' && node.type !== 'end'"
      class="px-4 py-3 border-t border-gray-200"
    >
      <div class="flex space-x-3">
        <button @click="resetConfiguration" class="btn-secondary flex-1">重置配置</button>
        <button @click="saveConfiguration" class="btn-primary flex-1">保存配置</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { WorkflowNode } from '@/types/workflow'

interface Props {
  node: WorkflowNode | null
}

interface Emits {
  (e: 'close'): void
  (e: 'update', nodeId: string, updates: Partial<WorkflowNode>): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localConfig = ref<any>({})

// Initialize local config when node changes
watch(
  () => props.node,
  (newNode) => {
    if (newNode) {
      localConfig.value = {
        name: newNode.configuration.name || '',
        description: newNode.configuration.description || '',
        ...newNode.configuration,
      }
    }
  },
  { immediate: true },
)

const getNodeStyle = () => {
  if (!props.node) {
    return {
      name: '未知节点',
      description: '未知节点类型',
      icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-600',
    }
  }

  switch (props.node.type) {
    case 'start':
      return {
        name: '开始',
        description: '工作流起点',
        icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z',
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-600',
      }
    case 'input':
      return {
        name: '输入',
        description: '接收用户输入',
        icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-600',
      }
    case 'web-search':
      return {
        name: '网络搜索',
        description: '搜索网络信息',
        icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
        bgColor: 'bg-cyan-100',
        textColor: 'text-cyan-600',
      }
    case 'annotated-data-retrieval':
      return {
        name: '标注数据检索',
        description: '检索标注数据',
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-600',
      }
    case 'question-rewrite':
      return {
        name: '问题重写',
        description: '重写用户问题',
        icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
        bgColor: 'bg-indigo-100',
        textColor: 'text-indigo-600',
      }
    case 'knowledge-retrieval':
      return {
        name: '知识检索',
        description: '从知识库检索信息',
        icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-600',
      }
    case 'llm-call':
      return {
        name: 'LLM调用',
        description: '调用大语言模型',
        icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
        bgColor: 'bg-rose-100',
        textColor: 'text-rose-600',
      }
    case 'data-processing':
      return {
        name: '数据处理',
        description: '处理和转换数据',
        icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
        bgColor: 'bg-amber-100',
        textColor: 'text-amber-600',
      }
    case 'condition':
      return {
        name: '条件判断',
        description: '根据条件分支',
        icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-600',
      }
    case 'code-execution':
      return {
        name: '代码执行',
        description: '执行自定义代码',
        icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
        bgColor: 'bg-emerald-100',
        textColor: 'text-emerald-600',
      }
    case 'output':
      return {
        name: '输出',
        description: '输出最终结果',
        icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        bgColor: 'bg-teal-100',
        textColor: 'text-teal-600',
      }
    case 'end':
      return {
        name: '结束',
        description: '工作流终点',
        icon: 'M6 18L18 6M6 6l12 12',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-600',
      }
    default:
      return {
        name: '未知节点',
        description: '未知节点类型',
        icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-600',
      }
  }
}

const updateConfiguration = () => {
  if (!props.node) return
  emit('update', props.node.id, {
    configuration: localConfig.value,
  })
}

const resetConfiguration = () => {
  if (!props.node) return

  // Reset to default configuration
  const defaultConfig = getDefaultNodeConfig(props.node.type)
  localConfig.value = {
    name: '',
    description: '',
    ...defaultConfig,
  }
  updateConfiguration()
}

const saveConfiguration = () => {
  updateConfiguration()
  emit('close')
}

function getDefaultNodeConfig(type: WorkflowNode['type']): any {
  switch (type) {
    case 'start':
      return {}
    case 'input':
      return {
        inputType: 'text',
        placeholder: '请输入您的问题...',
        required: true,
      }
    case 'web-search':
      return {
        searchEngine: 'google',
        maxResults: 10,
        timeout: 30000,
      }
    case 'annotated-data-retrieval':
      return {
        retrievalStrategy: 'exact',
        maxResults: 10,
        threshold: 0.5,
      }
    case 'question-rewrite':
      return {
        model: 'Qwen2.5-7B',
        maxTokens: 500,
        temperature: 0.7,
        systemPrompt: '你是一个专业的问题助手，负责重写和优化用户问题。',
      }
    case 'knowledge-retrieval':
      return {
        retrievalMode: 'hybrid',
        retrievalWeight: 0.5,
        recallCount: 5,
        recallThreshold: 0.8,
      }
    case 'llm-call':
      return {
        model: 'Qwen2.5-7B',
        maxTokens: 2000,
        temperature: 0.7,
        systemPrompt: '',
        streamOutput: false,
      }
    case 'data-processing':
      return {
        operation: 'filter',
        rules: [],
      }
    case 'condition':
      return {
        conditionType: 'equals',
        compareValue: '',
        trueBranch: '',
        falseBranch: '',
      }
    case 'code-execution':
      return {
        language: 'python',
        code: '',
        timeout: 30000,
      }
    case 'output':
      return {
        outputType: 'text',
        format: 'markdown',
      }
    case 'end':
      return {}
    default:
      return {}
  }
}
</script>
