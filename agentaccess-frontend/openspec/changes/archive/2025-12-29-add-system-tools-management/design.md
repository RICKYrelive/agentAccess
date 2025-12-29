# Design: System Tools Management

## Architecture Overview

### Component Structure
```
src/components/
├── system-tools/
│   ├── SandboxedEnvironmentsPage.vue    # Main page for sandbox management
│   ├── BuiltInToolsPage.vue              # Main page for built-in tools
│   ├── SandboxStatusCards.vue            # Status overview cards
│   ├── SandboxCard.vue                  # Individual sandbox type card
│   ├── SandboxInstanceList.vue           # List of instances for a sandbox
│   ├── BuiltInToolCard.vue              # Individual built-in tool card
│   ├── OfficialStoreDialog.vue           # Shared store dialog
│   └── types.ts                          # TypeScript definitions
├── layout/
│   └── SidebarNavigation.vue             # Modified to add System Tools section
└── stores/
    └── systemTools.ts                    # New Pinia store
```

### Data Models

#### SandboxType
```typescript
interface SandboxType {
  id: string
  name: string                    // e.g., "Python 3.11"
  description: string
  icon: string
  category: 'python' | 'nodejs' | 'java' | 'other'
  imageUrl?: string               // Docker image URL
  status: 'running' | 'stopped' | 'error'
  instances: SandboxInstance[]
  createdAt: Date
  updatedAt: Date
}
```

#### SandboxInstance
```typescript
interface SandboxInstance {
  id: string
  sandboxTypeId: string
  name: string
  status: 'running' | 'stopped' | 'error'
  resources: {
    cpuPercent: number
    memoryPercent: number
    diskPercent: number
  }
  port?: number
  envVars: Record<string, string>
  createdAt: Date
}
```

#### BuiltInTool
```typescript
interface BuiltInTool {
  id: string
  name: string
  description: string
  icon: string
  category: string
  isEnabled: boolean
  version?: string
  config?: Record<string, any>
}
```

#### StoreItem (Official Store)
```typescript
interface StoreItem {
  id: string
  type: 'sandbox' | 'builtin-tool'
  name: string
  description: string
  icon: string
  category?: string
  version?: string
  tags: string[]
}
```

## UI/UX Design Decisions

### 1. Sidebar Navigation
- **Placement**: Below "My Agent" section, with separator
- **Expandable**: System Tools header with expand/collapse toggle
- **Sub-menus**: Sandboxed Environments and Built-in Tools

### 2. Sandboxed Environments Page
**Layout Reference**: MCP Tools Page (`MCPToolsPage.vue`)
- Gradient header with decorative icons
- Status cards row (3 cards)
- Card-based layout for sandbox types
- Each card shows instance list inline or via expand

### 3. Resource Aggregation
**Calculation**: Average of all running instances
```typescript
const totalResources = computed(() => {
  const runningInstances = allSandboxTypes.flatMap(s => s.instances.filter(i => i.status === 'running'))
  if (runningInstances.length === 0) return { cpu: 0, memory: 0, disk: 0 }

  return {
    cpu: runningInstances.reduce((sum, i) => sum + i.resources.cpuPercent, 0) / runningInstances.length,
    memory: runningInstances.reduce((sum, i) => sum + i.resources.memoryPercent, 0) / runningInstances.length,
    disk: runningInstances.reduce((sum, i) => sum + i.resources.diskPercent, 0) / runningInstances.length,
  }
})
```

### 4. Official Store Dialog
**Design**: Modal with search and compact list
- Fixed width: `max-w-2xl`
- Search bar at top
- Two tabs: "Sandboxes" and "Built-in Tools"
- List items: Icon (40x40) | Name | Description | Button

### 5. State Management
**New Store**: `useSystemToolsStore`
```typescript
export const useSystemToolsStore = defineStore('systemTools', () => {
  // State
  const sandboxTypes = ref<SandboxType[]>([])
  const builtinTools = ref<BuiltInTool[]>([])
  const storeItems = ref<StoreItem[]>([])

  // Actions
  const createSandboxType = (type: Omit<SandboxType, 'id' | 'createdAt' | 'updatedAt'>) => { ... }
  const deleteSandboxType = (id: string) => { ... }
  const createInstance = (sandboxTypeId: string, config: SandboxInstanceConfig) => { ... }
  const deleteInstance = (instanceId: string) => { ... }
  const toggleBuiltInTool = (toolId: string) => { ... }
  const importFromStore = (itemId: string) => { ... }

  // Computed
  const totalResourceUsage = computed(() => { ... })
  const totalInstanceCount = computed(() => { ... })

  return { ... }
})
```

## Implementation Considerations

### 1. Mock Data Strategy
Since there's no real backend for sandbox management:
- Use mock data in the store for initial development
- Design API interfaces that can be connected later
- Consider using `localStorage` for persistence across sessions

### 2. Resource Monitoring
- Simulate resource usage with random fluctuations
- Update every 5-10 seconds via `setInterval`
- Show "Live" indicator when data is fresh

### 3. Official Store Integration
- Start with hardcoded store items
- Design API interface for future store backend
- Support pagination for large catalogs

### 4. Component Reusability
- Share dialog logic between Sandbox and Built-in Tools pages
- Use similar card components as MCP management for consistency
- Reuse existing status indicator patterns

## Open Questions
1. Should sandbox instances be manageable individually (start/stop/restart)?
2. Do we need logs/console output from sandboxes?
3. Should there be resource limits/quotas per sandbox?
