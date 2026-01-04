<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col" @click.stop>
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-slate-200">
        <h2 class="text-xl font-semibold text-slate-900">编辑知识库</h2>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Form with scrollable content -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">
              知识库名称 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              maxlength="100"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入知识库名称"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">描述</label>
            <textarea
              v-model="form.description"
              rows="2"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="请输入知识库描述（可选）"
            />
          </div>

          <!-- Type Info (Read-only) -->
          <div class="bg-slate-50 rounded-lg p-3">
            <div class="text-sm text-slate-600">
              <div class="flex items-center space-x-2 mb-1">
                <span class="font-medium">类型:</span>
                <span class="px-2 py-0.5 text-xs font-medium rounded-full" :class="typeBadgeClass">
                  {{ typeLabel }}
                </span>
              </div>
            </div>
          </div>

          <!-- Sharing Settings (Only for owner) -->
          <div v-if="isOwner" class="border-t border-slate-200 pt-4">
            <h3 class="text-sm font-semibold text-slate-900 mb-3">共享设置</h3>

            <!-- Category -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-slate-700 mb-2">知识库分类</label>
              <div class="flex gap-3">
                <label
                  :class="[
                    'flex items-center px-4 py-2 border rounded-lg cursor-pointer transition-colors',
                    form.category === 'personal'
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'border-slate-200 hover:bg-slate-50',
                  ]"
                >
                  <input
                    v-model="form.category"
                    type="radio"
                    value="personal"
                    class="sr-only"
                  />
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  个人知识库
                </label>
                <label
                  :class="[
                    'flex items-center px-4 py-2 border rounded-lg cursor-pointer transition-colors',
                    form.category === 'team'
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'border-slate-200 hover:bg-slate-50',
                  ]"
                >
                  <input
                    v-model="form.category"
                    type="radio"
                    value="team"
                    class="sr-only"
                  />
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  团队知识库
                </label>
              </div>
            </div>

            <!-- Team Sharing (only show when team category) -->
            <div v-if="form.category === 'team'" class="space-y-3">
              <!-- Team Search -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">选择团队</label>
                <input
                  v-model="teamSearch"
                  type="text"
                  placeholder="搜索团队..."
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <!-- Team List -->
              <div class="max-h-40 overflow-y-auto border border-slate-200 rounded-lg">
                <label
                  v-for="team in filteredTeams"
                  :key="team.id"
                  class="flex items-center justify-between p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer"
                >
                  <div class="flex items-center">
                    <input
                      :checked="isTeamSelected(team.id)"
                      @change="toggleTeam(team.id)"
                      type="checkbox"
                      class="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span class="ml-3 text-sm text-slate-700">{{ team.name }}</span>
                  </div>
                  <!-- Permission selector for selected teams -->
                  <select
                    v-if="isTeamSelected(team.id)"
                    :value="getTeamPermission(team.id)"
                    @change="setTeamPermission(team.id, $event)"
                    class="ml-3 text-xs border border-slate-200 rounded px-2 py-1"
                  >
                    <option value="read">只读</option>
                    <option value="write">可编辑</option>
                  </select>
                </label>
                <p v-if="filteredTeams.length === 0" class="text-sm text-slate-500 text-center py-4">
                  未找到匹配的团队
                </p>
              </div>

              <p v-if="selectedTeams.size === 0" class="text-xs text-slate-500">
                至少需要选择一个团队
              </p>
            </div>
          </div>

          <!-- Read-only sharing info for non-owners -->
          <div v-else class="border-t border-slate-200 pt-4">
            <div class="bg-slate-50 rounded-lg p-3">
              <p class="text-sm text-slate-600">
                您没有权限修改此知识库的共享设置。
              </p>
              <div v-if="props.knowledgeBase.sharedTeams && props.knowledgeBase.sharedTeams.length > 0" class="mt-2">
                <p class="text-xs font-medium text-slate-700 mb-1">已共享给:</p>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="team in props.knowledgeBase.sharedTeams"
                    :key="team.teamId"
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs bg-indigo-50 text-indigo-700"
                  >
                    {{ team.teamName }} ({{ team.permission === 'read' ? '只读' : '可编辑' }})
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex space-x-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              @click="$emit('close')"
              class="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              :disabled="!isFormValid"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useKnowledgeBaseStore } from '@/stores/knowledgeBase'
import type { KnowledgeBase, TeamSharing, KnowledgeBaseCategory, KnowledgeBasePermission, TeamSharingPermission } from '@/types/knowledge-base'

interface Props {
  knowledgeBase: KnowledgeBase
}

interface Emits {
  (e: 'close'): void
  (e: 'submit', updates: {
    name: string
    description: string
    category?: KnowledgeBaseCategory
    permission?: KnowledgeBasePermission
    sharedTeams?: TeamSharing[]
  }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const store = useKnowledgeBaseStore()

// Check if current user is the owner
const isOwner = computed(() => props.knowledgeBase.owner === store.CURRENT_USER_ID)

const form = ref({
  name: '',
  description: '',
  category: 'personal' as KnowledgeBaseCategory,
})

const teamSearch = ref('')
const selectedTeams = ref<Map<string, TeamSharingPermission>>(new Map())

// Mock teams data
const mockTeams = [
  { id: 'team-dev', name: '开发团队' },
  { id: 'team-product', name: '产品团队' },
  { id: 'team-design', name: '设计团队' },
  { id: 'team-marketing', name: '市场团队' },
  { id: 'team-sales', name: '销售团队' },
]

// Filtered teams based on search
const filteredTeams = computed(() => {
  if (!teamSearch.value) return mockTeams
  const search = teamSearch.value.toLowerCase()
  return mockTeams.filter(team => team.name.toLowerCase().includes(search))
})

// Initialize form with knowledge base data
watch(
  () => props.knowledgeBase,
  (kb) => {
    if (kb) {
      form.value = {
        name: kb.name,
        description: kb.description,
        category: kb.category,
      }
      // Initialize selected teams
      selectedTeams.value = new Map()
      if (kb.sharedTeams) {
        kb.sharedTeams.forEach(st => {
          selectedTeams.value.set(st.teamId, st.permission)
        })
      }
    }
  },
  { immediate: true },
)

const typeLabel = computed(() => {
  const typeMap: Record<string, string> = {
    text: '文本',
    spreadsheet: '表格',
    database: '数据库',
  }
  return typeMap[props.knowledgeBase.type] || props.knowledgeBase.type
})

const typeBadgeClass = computed(() => {
  const classMap: Record<string, string> = {
    text: 'bg-green-100 text-green-700',
    spreadsheet: 'bg-blue-100 text-blue-700',
    database: 'bg-purple-100 text-purple-700',
  }
  return classMap[props.knowledgeBase.type] || 'bg-slate-100 text-slate-700'
})

const isFormValid = computed(() => {
  const hasValidName = form.value.name.trim() !== ''
  const hasValidTeams = form.value.category === 'personal' || selectedTeams.value.size > 0
  return hasValidName && hasValidTeams
})

const isTeamSelected = (teamId: string) => {
  return selectedTeams.value.has(teamId)
}

const toggleTeam = (teamId: string) => {
  if (selectedTeams.value.has(teamId)) {
    selectedTeams.value.delete(teamId)
  } else {
    selectedTeams.value.set(teamId, 'read')
  }
}

const getTeamPermission = (teamId: string): TeamSharingPermission => {
  return selectedTeams.value.get(teamId) || 'read'
}

const setTeamPermission = (teamId: string, event: Event) => {
  const select = event.target as HTMLSelectElement
  selectedTeams.value.set(teamId, select.value as TeamSharingPermission)
}

const handleSubmit = () => {
  if (!isFormValid.value) return

  const updates: {
    name: string
    description: string
    category?: KnowledgeBaseCategory
    permission?: KnowledgeBasePermission
    sharedTeams?: TeamSharing[]
  } = {
    name: form.value.name.trim(),
    description: form.value.description.trim(),
  }

  // Only update sharing settings if owner
  if (isOwner.value) {
    updates.category = form.value.category

    if (form.value.category === 'team' && selectedTeams.value.size > 0) {
      updates.permission = 'team'
      updates.sharedTeams = Array.from(selectedTeams.value.entries()).map(([teamId, permission]) => {
        const team = mockTeams.find(t => t.id === teamId)!
        const existing = props.knowledgeBase.sharedTeams?.find(st => st.teamId === teamId)
        return {
          teamId,
          teamName: team.name,
          permission,
          addedAt: existing?.addedAt || new Date(),
          addedBy: existing?.addedBy || store.CURRENT_USER_ID,
        }
      })
    } else if (form.value.category === 'personal') {
      updates.permission = 'owner'
      updates.sharedTeams = []
    }
  }

  emit('submit', updates)
}
</script>
