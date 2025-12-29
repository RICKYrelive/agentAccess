<template>
  <div class="space-y-3 max-h-[400px] overflow-y-auto pr-2">
    <!-- MCP Tools from Store -->
    <div v-for="category in toolCategories" :key="category.name">
      <button
        @click="toggleCategory(category.name)"
        class="w-full flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <span class="text-sm font-medium text-gray-700">{{ category.name }}</span>
        <svg
          :class="['w-4 h-4 transition-transform text-gray-400', expandedCategories.has(category.name) ? 'rotate-90' : '']"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- Tools in category -->
      <div v-if="expandedCategories.has(category.name)" class="mt-2 ml-2 space-y-2">
        <div
          v-for="tool in category.tools"
          :key="tool.id"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
        >
          <div class="flex-1">
            <div class="text-sm font-medium text-gray-900">{{ tool.name }}</div>
            <div v-if="expandedCategories.has(category.name)" class="text-xs text-gray-500 mt-1">{{ tool.description }}</div>
          </div>
          <button
            @click="toggleTool(tool.id)"
            :class="[
              'relative inline-flex items-center h-6 w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full',
              isToolSelected(tool.id) ? 'bg-primary-600' : 'bg-gray-300',
            ]"
          >
            <span
              :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                isToolSelected(tool.id) ? 'translate-x-6' : 'translate-x-1',
              ]"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- No tools message -->
    <div v-if="allTools.length === 0" class="text-center py-6 text-gray-500 text-sm">
      暂无 MCP 工具
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMCPManagementStore } from '@/stores/mcpManagement'

interface Props {
  selectedTools?: string[]
}

interface Emits {
  (e: 'update:selectedTools', value: string[]): void
}

const props = withDefaults(defineProps<Props>(), {
  selectedTools: () => [],
})

const emit = defineEmits<Emits>()

const mcpStore = useMCPManagementStore()
const expandedCategories = ref<Set<string>>(new Set(['检索工具']))

// Get all MCP tools from store
const allTools = computed(() => mcpStore.mcpTools)

// Group tools by category
const toolCategories = computed(() => {
  const categories = new Map<string, typeof allTools.value>()

  allTools.value.forEach(tool => {
    const categoryName = tool.category || '其他'
    if (!categories.has(categoryName)) {
      categories.set(categoryName, [])
    }
    categories.get(categoryName)!.push(tool)
  })

  return Array.from(categories.entries()).map(([name, tools]) => ({ name, tools }))
})

const toggleCategory = (categoryName: string) => {
  if (expandedCategories.value.has(categoryName)) {
    expandedCategories.value.delete(categoryName)
  } else {
    expandedCategories.value.add(categoryName)
  }
}

const isToolSelected = (toolId: string) => {
  return props.selectedTools.includes(toolId)
}

const toggleTool = (toolId: string) => {
  const index = props.selectedTools.indexOf(toolId)
  const newSelected = [...props.selectedTools]

  if (index !== -1) {
    newSelected.splice(index, 1)
  } else {
    newSelected.push(toolId)
  }

  emit('update:selectedTools', newSelected)
}
</script>
