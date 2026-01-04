<template>
  <Teleport to="body">
    <template v-if="!showGroupDialog">
      <div
        class="fixed inset-0 flex items-center justify-center z-[50] bg-black bg-opacity-50"
        @click.self="handleOverlayClick($event)"
      >
        <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden" @click.stop>
        <!-- Header -->
        <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between" @click.stop>
          <h3 class="text-lg font-semibold text-slate-900">{{ gateway ? '编辑' : '创建' }} MCP 网关</h3>
          <button @click="emit('close')" class="text-slate-400 hover:text-slate-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="px-6 py-4 overflow-y-auto max-h-[70vh]" @click.stop>
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Basic Info -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">网关名称 *</label>
                <input
                  v-model="formData.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="例如：API 网关"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">描述</label>
                <textarea
                  v-model="formData.description"
                  rows="2"
                  class="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="网关的简短描述"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Base URL *</label>
                <input
                  v-model="formData.baseUrl"
                  type="url"
                  required
                  class="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://api.example.com"
                />
              </div>
            </div>

            <!-- Tool Selection Section -->
            <div class="border-t border-slate-200 pt-4">
              <h4 class="text-base font-medium text-slate-900 mb-4">关联 MCP 工具</h4>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Left Pane: Available Tools -->
                <div class="border border-slate-200 rounded-lg p-4">
                  <h5 class="text-sm font-medium text-slate-700 mb-3">可用工具</h5>
                  <ToolSearchFilter
                    :search-query="searchQuery"
                    :filter-type="filterType"
                    :filter-status="filterStatus"
                    :filter-category="filterCategory"
                    :categories="availableCategories"
                    :filtered-count="filteredTools.length"
                    @update:search-query="searchQuery = $event"
                    @update:filter-type="filterType = $event"
                    @update:filter-status="filterStatus = $event"
                    @update:filter-category="filterCategory = $event"
                  />
                  <ToolList
                    :tools="filteredTools"
                    :selected-tool-ids="formData.mcpToolIds"
                    @toggle-tool="toggleTool"
                  />
                </div>

                <!-- Right Pane: Selected Tools -->
                <div class="border border-slate-200 rounded-lg p-4">
                  <SelectedToolsPane
                    :selected-tool-ids="formData.mcpToolIds"
                    :load-balancer-groups="formData.loadBalancerGroups"
                    @remove-tool="removeTool"
                    @edit-group="editGroup"
                    @delete-group="deleteGroup"
                    @remove-tool-from-group="removeToolFromGroup"
                    @create-group="openCreateGroupDialog"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3" @click.stop>
          <button @click="emit('close')" class="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md">
            取消
          </button>
          <button
            type="button"
            @click="handleSubmit"
            class="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
          >
            {{ gateway ? '保存' : '创建' }}
          </button>
        </div>
      </div>
    </div>
    </template>
  </Teleport>

  <!-- Load Balancer Group Dialog (separate teleport) -->
  <LoadBalancerGroupDialog
    v-if="showGroupDialog"
    :group="editingGroup"
    :available-tools="filteredTools"
    @close="closeGroupDialog"
    @save="saveGroup"
  />
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useMCPManagementStore } from '@/stores/mcpManagement'
import ToolSearchFilter from './ToolSearchFilter.vue'
import ToolList from './ToolList.vue'
import SelectedToolsPane from './SelectedToolsPane.vue'
import LoadBalancerGroupDialog from './LoadBalancerGroupDialog.vue'
import type { MCPGateway, MCPToolType, LoadBalancerGroup, LoadBalancerGroupFormData } from '@/components/mcp-management/types'

interface Props {
  gateway?: MCPGateway | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const store = useMCPManagementStore()

const formData = reactive({
  name: '',
  description: '',
  baseUrl: '',
  mcpToolIds: [] as string[],
  loadBalancerGroups: [] as LoadBalancerGroup[],
})

// Search and filter state
const searchQuery = ref('')
const filterType = ref<MCPToolType | 'all'>('all')
const filterStatus = ref<'enabled' | 'disabled' | 'all'>('all')
const filterCategory = ref('all')

// Load balancer group dialog state
const showGroupDialog = ref(false)
const editingGroup = ref<LoadBalancerGroup | null>(null)

// Watch showGroupDialog for debugging
watch(showGroupDialog, (newVal, oldVal) => {
  console.log('[CreateGatewayDialog] showGroupDialog changed from', oldVal, 'to', newVal)
  console.trace('[CreateGatewayDialog] showGroupDialog change stack trace')
})

// Computed: available categories
const availableCategories = computed(() => {
  const categories = new Set(store.mcpTools.map((t: { category: string }) => t.category))
  return Array.from(categories).sort()
})

// Computed: filtered tools
const filteredTools = computed(() => {
  return store.mcpTools.filter((tool: { name: string; description: string; type: string; isEnabled: boolean }) => {
    // Search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      if (!tool.name.toLowerCase().includes(query) &&
          !tool.description.toLowerCase().includes(query)) {
        return false
      }
    }

    // Type filter
    if (filterType.value !== 'all' && tool.type !== filterType.value) {
      return false
    }

    // Status filter
    if (filterStatus.value === 'enabled' && !tool.isEnabled) return false
    if (filterStatus.value === 'disabled' && tool.isEnabled) return false

    // Category filter
    if (filterCategory.value !== 'all' && tool.category !== filterCategory.value) {
      return false
    }

    return true
  })
})

onMounted(() => {
  if (props.gateway) {
    formData.name = props.gateway.name
    formData.description = props.gateway.description
    formData.baseUrl = props.gateway.baseUrl
    formData.mcpToolIds = [...props.gateway.mcpToolIds]
    // Deep copy load balancer groups to avoid reference issues
    formData.loadBalancerGroups = (props.gateway.loadBalancerGroups || []).map(g => ({
      ...g,
      toolIds: [...g.toolIds],
    }))
    console.log('[CreateGatewayDialog] Loaded loadBalancerGroups:', formData.loadBalancerGroups)
  }
})

const toggleTool = (toolId: string) => {
  const index = formData.mcpToolIds.indexOf(toolId)
  if (index !== -1) {
    formData.mcpToolIds.splice(index, 1)
  } else {
    formData.mcpToolIds.push(toolId)
  }
}

const removeTool = (toolId: string) => {
  const index = formData.mcpToolIds.indexOf(toolId)
  if (index !== -1) {
    formData.mcpToolIds.splice(index, 1)
  }
}

const openCreateGroupDialog = () => {
  console.log('[CreateGatewayDialog] openCreateGroupDialog called')
  console.log('[CreateGatewayDialog] Before set showGroupDialog:', showGroupDialog.value)
  editingGroup.value = null
  showGroupDialog.value = true
  console.log('[CreateGatewayDialog] After set showGroupDialog:', showGroupDialog.value)
}

const editGroup = (groupId: string) => {
  const group = formData.loadBalancerGroups.find(g => g.id === groupId)
  if (group) {
    editingGroup.value = group
    showGroupDialog.value = true
  }
}

const deleteGroup = (groupId: string) => {
  const group = formData.loadBalancerGroups.find(g => g.id === groupId)
  if (!group) return

  if (confirm(`确定要删除负载均衡组"${group.name}"吗？`)) {
    const index = formData.loadBalancerGroups.indexOf(group)
    formData.loadBalancerGroups.splice(index, 1)
  }
}

const removeToolFromGroup = ({ groupId, toolId }: { groupId: string; toolId: string }) => {
  const group = formData.loadBalancerGroups.find(g => g.id === groupId)
  if (!group) return

  const index = group.toolIds.indexOf(toolId)
  if (index !== -1) {
    group.toolIds.splice(index, 1)
  }
}

const closeGroupDialog = () => {
  console.log('[CreateGatewayDialog] closeGroupDialog called')
  showGroupDialog.value = false
  editingGroup.value = null
}

const handleOverlayClick = (event: MouseEvent) => {
  console.log('[CreateGatewayDialog] handleOverlayClick called')
  // v-show="!showGroupDialog" already prevents clicks when LoadBalancerGroupDialog is open
  emit('close')
}

const saveGroup = (data: LoadBalancerGroupFormData) => {
  const healthCheck = data.healthCheckEnabled ? {
    enabled: true,
    interval: data.healthCheckInterval,
    timeout: data.healthCheckTimeout,
  } : undefined

  if (editingGroup.value) {
    // Update existing group
    editingGroup.value.name = data.name
    editingGroup.value.strategy = data.strategy
    editingGroup.value.toolIds = data.toolIds
    editingGroup.value.healthCheck = healthCheck
  } else {
    // Create new group
    const newGroup = store.createLoadBalancerGroup({
      name: data.name,
      strategy: data.strategy,
      toolIds: data.toolIds,
      healthCheck,
    })
    formData.loadBalancerGroups.push(newGroup)

    // Add group tools to selected tools
    data.toolIds.forEach(id => {
      if (!formData.mcpToolIds.includes(id)) {
        formData.mcpToolIds.push(id)
      }
    })
  }
}

const handleSubmit = () => {
  if (props.gateway) {
    store.updateGateway(props.gateway.id, formData)
  } else {
    store.createGateway({
      ...formData,
      status: 'running',
    })
  }

  // Reset form
  Object.assign(formData, {
    name: '',
    description: '',
    baseUrl: '',
    mcpToolIds: [],
    loadBalancerGroups: [],
  })

  // Reset filters
  searchQuery.value = ''
  filterType.value = 'all'
  filterStatus.value = 'all'
  filterCategory.value = 'all'

  setTimeout(() => {
    emit('close')
  }, 100)
}
</script>
