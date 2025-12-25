import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { ExtendedAgent, Agent } from '@/types'
import { useAgentsStore } from './agents'

export interface TeamMember {
  id: string
  name: string
  email?: string
  role: 'admin' | 'member'
  joinedAt: Date
  expiresAt?: Date
}

export interface Team {
  id: string
  name: string
  description?: string
  createdAt: Date
  members: TeamMember[]
  // Agent IDs shared with this team
  sharedAgentIds: string[]
}

export const useTeamsStore = defineStore('teams', () => {
  // State
  const teams = ref<Team[]>([
    {
      id: 'team-1',
      name: '研发部',
      description: '负责产品研发和技术创新',
      createdAt: new Date('2024-01-01'),
      members: [
        { id: 'user-1', name: '张三', role: 'admin', joinedAt: new Date('2024-01-01') },
        { id: 'user-2', name: '李四', role: 'member', joinedAt: new Date('2024-02-15') },
        { id: '03928', name: '用户03928', role: 'admin', joinedAt: new Date('2024-03-01') },
      ],
      sharedAgentIds: ['team-1', 'team-2', 'team-3'],
    },
    {
      id: 'team-2',
      name: '市场部',
      description: '负责市场推广和客户关系',
      createdAt: new Date('2024-01-15'),
      members: [
        { id: 'user-3', name: '王五', role: 'admin', joinedAt: new Date('2024-01-15') },
        { id: '03928', name: '用户03928', role: 'member', joinedAt: new Date('2024-03-10') },
      ],
      sharedAgentIds: [],
    },
    {
      id: 'team-3',
      name: '客户支持部',
      description: '负责客户服务和问题解决',
      createdAt: new Date('2024-02-01'),
      members: [{ id: 'user-4', name: '赵六', role: 'admin', joinedAt: new Date('2024-02-01') }],
      sharedAgentIds: [],
    },
  ])

  const currentUserId = '03928'
  const isTeamListOpen = ref(false)

  // Pending join requests (teamId -> request timestamp)
  const pendingJoinRequests = ref<Record<string, Date>>({})

  // Computed
  const myTeams = computed(() => {
    return teams.value.filter((team) => team.members.some((member) => member.id === currentUserId))
  })

  const otherTeams = computed(() => {
    return teams.value.filter((team) => !team.members.some((member) => member.id === currentUserId))
  })

  // Check if user has pending request for a team
  const hasPendingRequest = (teamId: string): boolean => {
    return pendingJoinRequests.value.hasOwnProperty(teamId)
  }

  // Get agents shared with a specific team (both personal agents and homepage team agents)
  const getAgentsInTeam = (
    teamId: string,
    allAgents: ExtendedAgent[],
  ): (ExtendedAgent | Agent)[] => {
    const team = teams.value.find((t) => t.id === teamId)
    if (!team) return []

    // Get shared personal agents
    const sharedPersonalAgents = allAgents.filter((agent) => team.sharedAgentIds.includes(agent.id))

    // Also get homepage team agents that are shared with this team
    const agentsStore = useAgentsStore()
    const sharedTeamAgents = agentsStore.teamAgents.filter((agent) =>
      team.sharedAgentIds.includes(agent.id),
    )

    // Combine both types
    return [...sharedPersonalAgents, ...sharedTeamAgents]
  }

  // Check if current user is admin of a team
  const isTeamAdmin = (teamId: string): boolean => {
    const team = teams.value.find((t) => t.id === teamId)
    if (!team) return false
    const member = team.members.find((m) => m.id === currentUserId)
    return member?.role === 'admin'
  }

  // Join a team (creates a pending request)
  const joinTeam = (teamId: string) => {
    pendingJoinRequests.value[teamId] = new Date()
  }

  // Cancel join request
  const cancelJoinRequest = (teamId: string) => {
    delete pendingJoinRequests.value[teamId]
  }

  // Leave a team
  const leaveTeam = (teamId: string) => {
    const team = teams.value.find((t) => t.id === teamId)
    if (!team) return
    team.members = team.members.filter((m) => m.id !== currentUserId)
  }

  // Add member (admin only)
  const addMember = (
    teamId: string,
    memberId: string,
    memberName: string,
    role: 'admin' | 'member' = 'member',
  ) => {
    const team = teams.value.find((t) => t.id === teamId)
    if (!team || !isTeamAdmin(teamId)) return

    team.members.push({
      id: memberId,
      name: memberName,
      role,
      joinedAt: new Date(),
    })
  }

  // Remove member (admin only)
  const removeMember = (teamId: string, memberId: string) => {
    const team = teams.value.find((t) => t.id === teamId)
    if (!team || !isTeamAdmin(teamId)) return

    team.members = team.members.filter((m) => m.id !== memberId)
  }

  // Set member expiration (admin only)
  const setMemberExpiration = (teamId: string, memberId: string, expiresAt: Date) => {
    const team = teams.value.find((t) => t.id === teamId)
    if (!team || !isTeamAdmin(teamId)) return

    const member = team.members.find((m) => m.id === memberId)
    if (member) {
      member.expiresAt = expiresAt
    }
  }

  // Share agent with team
  const shareAgentWithTeam = (agentId: string, teamId: string) => {
    const team = teams.value.find((t) => t.id === teamId)
    if (!team) return

    if (!team.sharedAgentIds.includes(agentId)) {
      team.sharedAgentIds.push(agentId)
    }
  }

  // Unshare agent from team
  const unshareAgentFromTeam = (agentId: string, teamId: string) => {
    const team = teams.value.find((t) => t.id === teamId)
    if (!team) return

    team.sharedAgentIds = team.sharedAgentIds.filter((id) => id !== agentId)
  }

  // Create new team
  const createTeam = (name: string, description?: string) => {
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name,
      description,
      createdAt: new Date(),
      members: [
        {
          id: currentUserId,
          name: '用户03928',
          role: 'admin',
          joinedAt: new Date(),
        },
      ],
      sharedAgentIds: [],
    }
    teams.value.push(newTeam)
    return newTeam
  }

  // Delete team (admin only)
  const deleteTeam = (teamId: string) => {
    if (!isTeamAdmin(teamId)) return
    const index = teams.value.findIndex((t) => t.id === teamId)
    if (index > -1) {
      teams.value.splice(index, 1)
    }
  }

  return {
    // State
    teams,
    isTeamListOpen,
    currentUserId,

    // Computed
    myTeams,
    otherTeams,

    // Methods
    getAgentsInTeam,
    isTeamAdmin,
    hasPendingRequest,
    joinTeam,
    cancelJoinRequest,
    leaveTeam,
    addMember,
    removeMember,
    setMemberExpiration,
    shareAgentWithTeam,
    unshareAgentFromTeam,
    createTeam,
    deleteTeam,
  }
})
