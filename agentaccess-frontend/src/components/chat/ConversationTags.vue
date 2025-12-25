<template>
  <div
    :class="[
      'conversation-tags',
      { 'conversation-tags-compact': compact }
    ]"
  >
    <!-- Agent Tag -->
    <div
      v-if="agent"
      :class="['tag', 'tag-agent']"
      :title="`Agent: ${agent.name}`"
    >
      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      <span v-if="!compact">{{ agent.name }}</span>
    </div>

    <!-- MCP Service Tags -->
    <div
      v-for="mcp in mcpServices"
      :key="mcp.id"
      :class="['tag', 'tag-mcp']"
      :title="`MCP: ${mcp.name}`"
    >
      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102 1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
      <span v-if="!compact">{{ mcp.name }}</span>
    </div>

    <!-- Plugin Tags -->
    <div
      v-for="plugin in plugins"
      :key="plugin.id"
      :class="['tag', 'tag-plugin']"
      :title="`插件: ${plugin.name}`"
    >
      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100-4v-3a1 1 0 011-1H7a1 1 0 01-1-1V7a2 2 0 012-2z" />
      </svg>
      <span v-if="!compact">{{ plugin.name }}</span>
    </div>

    <!-- Knowledge Base Tags -->
    <div
      v-for="kb in knowledgeBases"
      :key="kb.id"
      :class="['tag', 'tag-knowledge']"
      :title="`知识库: ${kb.name}`"
    >
      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5-1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C15.832 18.477 14.246 18 12.5 18s-3.332.477-4.5-1.253" />
      </svg>
      <span v-if="!compact">{{ kb.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ChatConversation } from '@/types/settings'
import type { Agent, ExtendedAgent } from '@/types'
import type { KnowledgeBase } from '@/types/knowledge-base'
import type { MCPService } from '@/types/mcp'
import { SYSTEM_PLUGINS, type SystemPlugin } from '@/types/plugins'
import { useAgentsStore } from '@/stores/agents'
import { useKnowledgeBaseStore } from '@/stores/knowledgeBase'

interface Props {
  settings: ChatConversation['settings']
  compact?: boolean
}

const props = defineProps<Props>()

const agentsStore = useAgentsStore()
const knowledgeBaseStore = useKnowledgeBaseStore()

// Get agent if configured
const agent = computed(() => {
  if (!props.settings.agentId) return null
  // Check both my agents and team agents
  const myAgent = agentsStore.myAgents.find(a => a.id === props.settings.agentId)
  if (myAgent) return myAgent
  return agentsStore.teamAgents.find(a => a.id === props.settings.agentId)
})

// Get MCP services
const mcpServices = computed(() => {
  const ids = props.settings.mcpServiceIds || props.settings.mcpServices || []
  // This would come from MCP store when available
  return ids.map(id => ({
    id,
    name: getMcpName(id)
  }))
})

// Get plugins
const plugins = computed(() => {
  const ids = props.settings.pluginIds || []
  return SYSTEM_PLUGINS.filter(p => ids.includes(p.id))
})

// Get knowledge bases
const knowledgeBases = computed(() => {
  const ids = props.settings.knowledgeBaseIds || []
  // Support legacy single knowledge base
  if (props.settings.knowledgeBaseId) {
    ids.push(props.settings.knowledgeBaseId)
  }
  return knowledgeBaseStore.knowledgeBases.filter(kb => ids.includes(kb.id))
})

// Helper to get MCP name from ID
const getMcpName = (id: string): string => {
  const nameMap: Record<string, string> = {
    'mcp-search': '联网搜索',
    'mcp-translate': '翻译服务',
    'mcp-email-templates': '邮件模板',
    'mcp-file-manager': '文件管理'
  }
  return nameMap[id] || id
}
</script>

<style scoped>
.conversation-tags {
  @apply flex items-center flex-wrap gap-1.5;
}

.conversation-tags-compact {
  @apply gap-1;
}

.tag {
  @apply inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full;
}

/* Agent - Green */
.tag-agent {
  @apply bg-green-100 text-green-700;
}

/* MCP - Blue */
.tag-mcp {
  @apply bg-blue-100 text-blue-700;
}

/* Plugin - Purple */
.tag-plugin {
  @apply bg-purple-100 text-purple-700;
}

/* Knowledge Base - Orange */
.tag-knowledge {
  @apply bg-orange-100 text-orange-700;
}

/* Compact mode - smaller tags for sidebar */
.conversation-tags-compact .tag {
  @apply px-1.5 py-0;
}

.conversation-tags-compact .tag span {
  @apply hidden;
}
</style>
