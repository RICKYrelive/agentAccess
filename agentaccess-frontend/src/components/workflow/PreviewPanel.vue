<template>
  <div class="h-full bg-white flex flex-col">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">预览测试</h3>
        <div class="flex items-center space-x-2">
          <span
            v-if="isRunning"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            <svg class="w-3 h-3 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            运行中
          </span>
          <button
            @click="clearHistory"
            class="text-sm text-gray-500 hover:text-gray-700"
          >
            清空历史
          </button>
        </div>
      </div>
    </div>

    <!-- Test Input -->
    <div class="p-4 border-b border-gray-200">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        测试问题
      </label>
      <!-- Execution Mode Indicator -->
      <div v-if="useFastGPTExecution" class="mb-2 flex items-center space-x-2 text-xs text-green-600">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>使用 FastGPT 引擎执行</span>
      </div>
      <div v-else class="mb-2 flex items-center space-x-2 text-xs text-gray-500">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>使用模拟执行 (在设置中配置FastGPT以启用真实执行)</span>
      </div>
      <div class="flex space-x-2">
        <input
          v-model="testInput"
          type="text"
          placeholder="输入测试问题..."
          class="flex-1 input-field"
          @keyup.enter="runTest"
          :disabled="isRunning"
        />
        <button
          @click="runTest"
          :disabled="!testInput.trim() || isRunning"
          class="btn-primary"
        >
          {{ isRunning ? '运行中...' : '运行测试' }}
        </button>
      </div>
    </div>

    <!-- Test Results -->
    <div class="flex-1 overflow-y-auto">
      <!-- Test History -->
      <div class="p-4 space-y-4">
        <div
          v-for="test in testResults"
          :key="test.id"
          class="border border-gray-200 rounded-lg overflow-hidden"
        >
          <!-- Test Header -->
          <div class="bg-gray-50 px-4 py-3 flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div
                :class="[
                  'w-2 h-2 rounded-full',
                  getTestStatusColor(test.status)
                ]"
              />
              <span class="text-sm font-medium text-gray-900">
                测试 #{{ testResults.indexOf(test) + 1 }}
              </span>
              <span class="text-xs text-gray-500">
                {{ formatTime(test.runAt || test.createdAt) }}
              </span>
              <span
                v-if="test.executionTime"
                class="text-xs text-gray-500"
              >
                {{ test.executionTime }}ms
              </span>
            </div>
            <div class="flex items-center space-x-2">
              <button
                v-if="test.status === 'completed'"
                @click="rerunTest(test)"
                class="text-sm text-primary-600 hover:text-primary-700"
              >
                重新生成
              </button>
              <button
                @click="addToTestSet(test)"
                class="text-sm text-gray-600 hover:text-gray-700"
              >
                添加到测试集
              </button>
            </div>
          </div>

          <!-- Test Content -->
          <div class="p-4 space-y-4">
            <!-- Input -->
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">
                输入问题
              </label>
              <div class="p-3 bg-gray-50 rounded-md">
                <p class="text-sm text-gray-900">{{ test.input }}</p>
              </div>
            </div>

            <!-- Expected Output (if available) -->
            <div v-if="test.expectedOutput">
              <label class="block text-xs font-medium text-gray-700 mb-1">
                期望输出
              </label>
              <div class="p-3 bg-blue-50 rounded-md">
                <p class="text-sm text-blue-900">{{ test.expectedOutput }}</p>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="test.status === 'running'" class="text-center py-8">
              <div class="inline-flex items-center space-x-2">
                <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span class="text-sm text-gray-600">正在运行工作流...</span>
              </div>
            </div>

            <!-- Actual Output -->
            <div v-else-if="test.actualOutput">
              <label class="block text-xs font-medium text-gray-700 mb-1">
                输出结果
              </label>
              <div
                :class="[
                  'p-3 rounded-md',
                  test.status === 'failed' ? 'bg-red-50' : 'bg-green-50'
                ]"
              >
                <p :class="[
                  'text-sm whitespace-pre-wrap',
                  test.status === 'failed' ? 'text-red-900' : 'text-green-900'
                ]">
                  {{ test.actualOutput }}
                </p>
              </div>
            </div>

            <!-- Referenced Materials -->
            <div v-if="test.referencedMaterials && test.referencedMaterials.length > 0">
              <label class="block text-xs font-medium text-gray-700 mb-2">
                引用资料
              </label>
              <div class="space-y-2">
                <div
                  v-for="material in test.referencedMaterials"
                  :key="material.id"
                  class="p-3 bg-yellow-50 border border-yellow-200 rounded-md"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h5 class="text-sm font-medium text-yellow-900">
                        {{ material.title }}
                      </h5>
                      <p class="text-xs text-yellow-700 mt-1">
                        来源: {{ material.source }}
                      </p>
                      <p class="text-xs text-yellow-600 mt-1">
                        相关度: {{ (material.relevanceScore * 100).toFixed(1) }}%
                      </p>
                    </div>
                    <button
                      @click="viewMaterial(material)"
                      class="text-xs text-yellow-700 hover:text-yellow-800"
                    >
                      查看详情
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="test.status === 'failed'">
              <label class="block text-xs font-medium text-red-700 mb-1">
                错误信息
              </label>
              <div class="p-3 bg-red-50 border border-red-200 rounded-md">
                <p class="text-sm text-red-800">
                  {{ test.actualOutput }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-if="testResults.length === 0"
          class="text-center py-12"
        >
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
          <p class="mt-2 text-sm text-gray-500">
            还没有测试记录
          </p>
          <p class="text-xs text-gray-400 mt-1">
            输入测试问题并点击运行测试开始
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useWorkflowStore } from '@/stores/workflow'
import type { WorkflowTest } from '@/types/workflow'

const workflowStore = useWorkflowStore()
const { isRunning, testResults, useFastGPTExecution } = storeToRefs(workflowStore)

const testInput = ref('')

const getTestStatusColor = (status: WorkflowTest['status']) => {
  switch (status) {
    case 'running':
      return 'bg-blue-500'
    case 'passed':
      return 'bg-green-500'
    case 'failed':
      return 'bg-red-500'
    case 'pending':
      return 'bg-yellow-500'
    default:
      return 'bg-gray-500'
  }
}

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const runTest = async () => {
  if (!testInput.value.trim() || isRunning.value) return

  try {
    await workflowStore.runWorkflow(testInput.value)
  } catch (error) {
    console.error('Test failed:', error)
  }
}

const rerunTest = async (test: WorkflowTest) => {
  if (isRunning.value) return

  try {
    await workflowStore.runWorkflow(test.input)
  } catch (error) {
    console.error('Rerun failed:', error)
  }
}

const clearHistory = () => {
  workflowStore.testResults = []
}

const addToTestSet = (test: WorkflowTest) => {
  // TODO: Implement adding to test set
  console.log('Adding to test set:', test)
}

const viewMaterial = (material: any) => {
  // TODO: Implement material viewing
  console.log('Viewing material:', material)
}
</script>