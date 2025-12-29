# Design: Optimize Access Page Start

## Architecture Overview

### Current State
```
ContentArea.vue:
├── Left Column (2/3 width)
│   └── Team Agent Cards (团队 Agent)
│
└── Right Column (1/3 width)
    ├── Message Input Area
    └── Configuration Panel
        ├── Tab: 知识库 (radio selection)
        └── Tab: MCP服务 (opens settings panel)
```

### Proposed State
```
ContentArea.vue:
├── Left Column (2/3 width)
│   ├── My Agent Section (我的 Agent) - NEW
│   │   └── Shows 3 recent private agents
│   └── Team Agent Cards (团队 Agent)
│       └── Existing team agents
│
└── Right Column (1/3 width)
    ├── Message Input Area
    └── Configuration Panel
        ├── Tab: 知识库 (radio selection)
        ├── Tab: MCP服务 (inline config) - MODIFIED
        ├── Tab: 系统工具 (inline config) - NEW
        └── Tab: 记忆体 (inline config) - NEW
```

## Component Changes

### 1. ContentArea.vue Modifications

#### Left Column Changes
**Add "My Agent" Section:**
```vue
<div class="mb-8">
  <h3 class="text-lg font-medium text-gray-900 mb-4">
    我的 Agent (最近使用)
  </h3>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div v-for="agent in recentMyAgents" :key="agent.id">
      <!-- Agent card similar to team agents -->
    </div>
  </div>
  <div class="mt-3 text-center">
    <button @click="goToMyAgentsPage">
      查看全部我的 Agent →
    </button>
  </div>
</div>
```

**Data Source:**
```typescript
import { useAgentStore } from '@/stores/agent'

const agentStore = useAgentStore()
const recentMyAgents = computed(() => agentStore.getRecentAgents(3))
```

#### Right Column Changes
**Update Configuration Panel:**
```vue
<div class="flex space-x-2 mb-4 border-b border-gray-200 overflow-x-auto">
  <button @click="activeTab = 'knowledge'">知识库</button>
  <button @click="activeTab = 'mcp'">MCP服务</button>
  <button @click="activeTab = 'system-tools'">系统工具</button>
  <button @click="activeTab = 'memory'">记忆体</button>
</div>
```

**Tab Content:**
```vue
<!-- MCP Services - Inline Configuration -->
<div v-if="activeTab === 'mcp'">
  <MCPInlineConfig v-model:selectedTools="selectedMcpTools" />
</div>

<!-- System Tools - Inline Configuration -->
<div v-if="activeTab === 'system-tools'">
  <SystemToolsInlineConfig v-model:selectedTools="selectedSystemTools" />
</div>

<!-- Memory - Inline Configuration -->
<div v-if="activeTab === 'memory'">
  <MemoryInlineConfig v-model:selectedMemory="selectedMemory" />
</div>
```

### 2. New Inline Configuration Components

#### MCPInlineConfig.vue
**Purpose:** Display MCP tool categories with inline toggles

**Features:**
- Category-based collapsible sections
- Toggle switches for each tool
- Shows tool description when expanded
- Uses existing `useMCPManagementStore`

#### SystemToolsInlineConfig.vue
**Purpose:** Display system tools with inline toggles

**Features:**
- Two sections: 沙箱环境 and 内置工具
- Toggle switches for each tool
- Shows tool status and description

#### MemoryInlineConfig.vue
**Purpose:** Display memory configuration options

**Features:**
- Radio selection for memory type (短期/长期/向量)
- Display memory size/usage info
- "添加记忆体" button

## Data Flow

```
User selects configuration
    ↓
Update local refs (selectedMcpTools, selectedSystemTools, selectedMemory)
    ↓
User sends message
    ↓
Emit 'message-sent' with config payload
    ↓
ChatInterface receives config and applies to conversation
```

## State Management

### Stores Used
1. **useAgentStore** - Get recent agents
2. **useMCPManagementStore** - Get MCP tools for inline config
3. **useSystemToolsStore** (NEW) - Get system tools
4. **useMemoryStore** (NEW) - Get memory configuration

### New State in ContentArea
```typescript
// Configuration state
const selectedKnowledgeBase = ref('')
const selectedMcpTools = ref<string[]>([])
const selectedSystemTools = ref<string[]>([])
const selectedMemory = ref('')

// Navigation
const goToMyAgentsPage = () => {
  emit('view-change', 'my-agents')
}
```

## UI/UX Considerations

### 1. Compact Tab Design
- Use horizontal scroll if tabs overflow
- Keep tab labels short (4 characters max)
- Show active state with bottom border

### 2. Inline Configuration Height
- Limit tab content height to ~400px
- Use internal scrolling for long lists
- Use collapsible sections for categories

### 3. My Agent Section
- Only show 3 most recent agents
- Provide "查看全部" link to navigate to full page
- Use same card design as team agents for consistency

## Implementation Notes

### Order of Implementation
1. Add "My Agent" section (safest, isolated change)
2. Create inline MCP config (requires new component)
3. Create System Tools inline config (requires store)
4. Create Memory inline config (requires store)

### Reusability
- Inline config components can be reused in SettingsPanel
- Agent card component can be shared with MyAgentsPage
