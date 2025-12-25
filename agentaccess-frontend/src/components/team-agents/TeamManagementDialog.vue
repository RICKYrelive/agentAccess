<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">管理团队 - {{ team?.name }}</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
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

      <!-- Members List -->
      <div class="space-y-3">
        <h4 class="text-sm font-medium text-gray-700">成员列表 ({{ team?.members.length }})</h4>

        <div
          v-for="member in team?.members"
          :key="member.id"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span class="text-primary-700 font-medium">{{ member.name.charAt(0) }}</span>
            </div>
            <div>
              <p class="font-medium text-gray-900">{{ member.name }}</p>
              <div class="flex items-center space-x-2 text-sm text-gray-500">
                <span>{{ member.role === 'admin' ? '管理员' : '成员' }}</span>
                <span v-if="member.expiresAt" class="text-orange-600">
                  · 至 {{ formatDate(member.expiresAt) }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <button
              v-if="member.id !== '03928'"
              @click="setExpiration(member)"
              class="px-2 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded"
              title="设置有效期"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </button>
            <button
              v-if="member.id !== '03928'"
              @click="removeMember(member.id)"
              class="px-2 py-1 text-sm text-red-600 hover:bg-red-100 rounded"
              title="移除成员"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Add Member Section -->
      <div class="mt-6 pt-6 border-t border-gray-200">
        <h4 class="text-sm font-medium text-gray-700 mb-3">添加成员</h4>
        <div class="flex space-x-2">
          <input
            v-model="newMemberEmail"
            type="email"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="输入成员邮箱"
          />
          <button
            @click="addMember"
            :disabled="!newMemberEmail.trim()"
            class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            添加
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTeamsStore } from '@/stores/teams'
import type { Team } from '@/types'

interface Props {
  team: Team | null
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const teamsStore = useTeamsStore()
const { addMember: addTeamMember, removeMember: removeTeamMember, setMemberExpiration } = teamsStore

const newMemberEmail = ref('')

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

const addMember = () => {
  if (!newMemberEmail.value.trim()) return

  // Generate a random ID and name from email
  const memberId = `user-${Date.now()}`
  const memberName = newMemberEmail.value.split('@')[0]

  addTeamMember(props.team!.id, memberId, memberName, 'member')
  newMemberEmail.value = ''
}

const removeMember = (memberId: string) => {
  if (confirm('确定要移除这个成员吗？')) {
    removeTeamMember(props.team!.id, memberId)
  }
}

const setExpiration = (member: any) => {
  const expiresAtStr = prompt(
    `设置 ${member.name} 的有效期 (格式: YYYY-MM-DD，留空表示永久):`,
    member.expiresAt ? new Date(member.expiresAt).toISOString().split('T')[0] : '',
  )

  if (expiresAtStr !== null) {
    if (expiresAtStr.trim() === '') {
      setMemberExpiration(props.team!.id, member.id, null as unknown as Date)
    } else {
      const expiresAt = new Date(expiresAtStr)
      if (!isNaN(expiresAt.getTime())) {
        setMemberExpiration(props.team!.id, member.id, expiresAt)
      } else {
        alert('无效的日期格式')
      }
    }
  }
}
</script>
