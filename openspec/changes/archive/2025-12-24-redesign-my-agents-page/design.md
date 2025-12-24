# Design: Redesign My Agents Page

## Architecture Overview

### Component Structure
```
AppLayout.vue
├── SidebarNavigation.vue (modified)
│   ├── "我的Agent" button (new primary nav item)
│   └── RecentAgentShortcuts (new component - shows top 3 recent agents)
│
└── Main Content Area
    ├── HomePage.vue
    ├── WorkflowCanvas.vue
    └── MyAgentsPage.vue (new component)
        ├── MyAgentsHeader.vue (new)
        ├── AgentCreationBar.vue (new)
        │   ├── CustomCreateButton
        │   ├── AutoCreateButton
        │   └── ImportThirdPartyButton
        └── AgentCardsSection.vue (new)
            ├── PrivateAgentsList.vue (new)
            └── SharedAgentsList.vue (new)
                ├── SharingGroupAccordion.vue (new)
                └── AgentCard.vue (new - draggable)
```

### State Management (agents.ts Store)

#### New State
```typescript
// Agent enhanced type
interface ExtendedAgent extends Agent {
  isThirdParty?: boolean        // Imported from external source
  tags?: string[]               // Up to 3 tags
  sharedGroups?: string[]        // Which groups this agent is shared with
  workflowData?: Workflow        // Associated workflow data
  lastUsedAt?: Date             // For recent agents sorting
  createdAt: Date
  updatedAt: Date
}

// Sharing group type
interface SharingGroup {
  id: string
  name: string                   // e.g., "研发部", "市场部"
  description?: string
  agentIds: string[]             // Agent IDs in this group
  createdAt: Date
}

// New state properties
recentAgents: ExtendedAgent[]    // Top 3 recently used (max 3)
sharingGroups: SharingGroup[]    // User's sharing groups
isMyAgentsView: boolean          // Whether My Agents page is active
```

### Data Flow

#### Navigation Flow
1. User clicks "我的Agent" in sidebar → `isMyAgentsView = true`, `activeView = 'my-agents'`
2. User clicks recent agent shortcut → Load agent in workflow editor
3. User clicks "自定义创建Agent" → Create new workflow, open workflow editor
4. User clicks other create buttons → Show toast "Coming Soon"

#### Sharing Flow (Drag & Drop)
1. User drags agent card from "私有Agent" section
2. Drop zone highlights in shared group sections
3. On drop → Add group ID to agent's `sharedGroups` array
4. Agent card appears in both private and shared sections

### Store Methods

```typescript
// New methods
getRecentAgents(limit: number = 3): ExtendedAgent[]
addSharingGroup(name: string, description?: string): SharingGroup
removeSharingGroup(groupId: string): void
shareAgentWithGroup(agentId: string, groupId: string): void
unshareAgentFromGroup(agentId: string, groupId: string): void
updateAgentTags(agentId: string, tags: string[]): void
markAgentAsUsed(agentId: string): void  // Updates lastUsedAt
importThirdPartyAgent(data: ImportData): ExtendedAgent
```

### Layout Specifications

#### Sidebar "我的Agent" Section
```
┌─────────────────────────────┐
│ [新对话]                     │
├─────────────────────────────┤
│ 主页                         │
│ 🤖 Agent编辑器               │
│ [FastGPT已连接]              │
├─────────────────────────────┤
│ 我的Agent ⚡                  │  ← New primary nav item
│   ┌───────────────────────┐ │
│   │ 📄 个人助理小助手      │ │  ← Recent agent #1
│   └───────────────────────┘ │
│   ┌───────────────────────┐ │
│   │ 📄 代码助手            │ │  ← Recent agent #2
│   └───────────────────────┘ │
│   ┌───────────────────────┐ │
│   │ 📄 智能数据分析        │ │  ← Recent agent #3
│   └───────────────────────┘ │
├─────────────────────────────┤
│ 知识库 ▼                     │
│ 最近对话 ▼                   │
└─────────────────────────────┘
```

#### My Agents Page Layout
```
┌─────────────────────────────────────────────────────────────────────┐
│  我 的 A g e n t                                                    │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ 自定义创建    │  │ 自动创建Agent │  │ 导入第三方    │              │
│  │ Agent        │  │              │  │ Agent        │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
├─────────────────────────────────────────────────────────────────────┤
│  私有 Agent (5)                                                     │
│  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐                 │
│  │ Agent │ │ Agent │ │ Agent │ │ Agent │ │ Agent │                 │
│  │ Card  │ │ Card  │ │ Card  │ │ Card  │ │ Card  │                 │
│  └───────┘ └───────┘ └───────┘ └───────┘ └───────┘                 │
├─────────────────────────────────────────────────────────────────────┤
│  共享 Agent                                                         │
│                                                                     │
│  ▼ 研发部 (3)                                      [+ 添加共享组]   │
│  ┌───────┐ ┌───────┐ ┌───────┐                                     │
│  │ Agent │ │ Agent │ │ Agent │                                     │
│  │ Card  │ │ Card  │ │ Card  │                                     │
│  └───────┘ └───────┘ └───────┘                                     │
│                                                                     │
│  ▼ 市场部 (2)                                                       │
│  ┌───────┐ ┌───────┐                                               │
│  │ Agent │ │ Agent │                                               │
│  │ Card  │ │ Card  │                                               │
│  └───────┘ └───────┘                                               │
└─────────────────────────────────────────────────────────────────────┘
```

#### Agent Card Design
```
┌─────────────────────────────────────────────┐
│  📄 个人助理小助手                    [编辑] │
│                                             │
│  🏷️ 助手  🏷️ 日常  🏷️ AI                     │
│                                             │
│  🔗 已共享: 研发部, 市场部                    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  📄 数据分析模板               [第三方] [编辑]│
│                                             │
│  🏷️ 数据  🏷️ 分析  🏷️ 报表                    │
│                                             │
│  🔗 已共享: 研发部                            │
└─────────────────────────────────────────────┘
```

### Drag & Drop Implementation

Use HTML5 Drag and Drop API:
- Agent cards have `draggable="true"`
- On `dragstart`: Set data transfer with agent ID
- Shared group sections are drop zones
- On `drop`: Call `shareAgentWithGroup(agentId, groupId)`
- Visual feedback during drag (ghost image, drop zone highlights)

### Technical Decisions

#### Why not use routing for My Agents page?
- User confirmed: Current area switching (like home/workflow)
- Simpler state management with `activeView`
- Consistent with existing app architecture

#### Why agents appear in both private AND shared sections?
- Requirement: "我的Agent一定在私有Agent里面，且可以重复出现在不同的共享组"
- Private section = source of truth for ownership
- Shared sections = views of agents shared with specific groups
- Same agent, multiple appearances

#### Why limit recent agents to 3?
- UI constraint: Sidebar space is limited
- User feedback: Top 3 is sufficient for quick access
- Full list available on My Agents page

### Migration Notes

**Breaking Changes:**
- Remove nested "我的Agent" dropdown from sidebar
- Saved workflows will now appear as agents in My Agents page
- Need to migrate `workflowStore.workflows` to new agent format

**Data Migration:**
```typescript
// On app initialization, migrate existing workflows
const migrateWorkflowsToAgents = () => {
  const existingWorkflows = workflowStore.workflows
  existingWorkflows.forEach(workflow => {
    agentsStore.addAgent({
      id: workflow.id,
      name: workflow.name,
      isThirdParty: false,
      tags: [],
      sharedGroups: [],
      workflowData: workflow,
      createdAt: workflow.createdAt,
      updatedAt: workflow.updatedAt
    })
  })
}
```

### Future Considerations

**Phase 2 Features (out of scope):**
- Actual "自动创建Agent" functionality (AI-powered agent creation)
- Actual "导入第三方Agent" functionality (template marketplace)
- Agent duplication/cloning
- Agent export to share with others
- Sharing group management UI (rename, edit description)
- Search and filter agents by tags
- Bulk operations on agents
