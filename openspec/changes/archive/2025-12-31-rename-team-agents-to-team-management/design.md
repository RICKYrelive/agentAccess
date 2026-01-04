# Rename "Team Agents" to "Team Management" - Design Document

## Overview
This document describes the technical design for renaming the "团队Agent" sidebar menu item to "团队管理" and repositioning it below the Knowledge Base section.

## Current Architecture

### Sidebar Navigation Structure
The `SidebarNavigation.vue` component is organized into sections with separators:

```
Main Navigation Section
  - 主页
  - Access 模板管理
  - 最近 Access 会话 (collapsible)
[Separator]
Agent Section
  - Agent 编辑器
  - 我的 Agent (collapsible - shows recent agents)
  - 团队 Agent (collapsible - shows teams)
[Separator]
Tools & Memory Section
  - MCP 管理 (collapsible)
  - 系统工具 (collapsible)
  - 记忆体
[Separator]
Knowledge Base Section
  - 知识库
```

### Component Details
- **File**: `agentaccess-frontend/src/components/layout/SidebarNavigation.vue`
- **State Management**: Uses `useTeamsStore` for team data
- **View Routing**: `activeView` prop determines which section is active
- **Collapsible Sections**: Team section uses `isTeamAgentsOpen` ref

## New Design Architecture

### Proposed Navigation Structure
```
Main Navigation Section
  - 主页
  - Access 模板管理
  - 最近 Access 会话 (collapsible)
[Separator]
Agent Section
  - Agent 编辑器
  - 我的 Agent (collapsible - shows recent agents)
[Separator]
Tools & Memory Section
  - MCP 管理 (collapsible)
  - 系统工具 (collapsible)
  - 记忆体
[Separator]
Knowledge Base Section
  - 知识库
[Separator]
Team Management Section  ← New section
  - 团队管理 (collapsible - shows teams)
```

### Component Changes

#### 1. SidebarNavigation.vue

**Remove "团队Agent" from Agent Section:**
- Delete the Team Agents button from the Agent section (lines ~259-300)
- Remove associated state `isTeamAgentsOpen` from Agent section context

**Add New Team Management Section:**
- Create new `<div>` section after Knowledge Base section
- Add separator before Team Management section
- Move team-related markup to new location
- Update label from "团队Agent" to "团队管理"

**Template Structure Change:**
```vue
<!-- Knowledge Base Section -->
<div class="space-y-1 pb-4">
  <button @click="handleKnowledgeBaseClick">...</button>
</div>

<!-- NEW: Separator -->
<div class="border-t border-slate-100 my-2"></div>

<!-- NEW: Team Management Section -->
<div class="space-y-1 pb-4">
  <button @click="handleTeamManagementClick">
    <span>团队管理</span>  <!-- Changed from "团队Agent" -->
  </button>
  <!-- Team Items (my teams) -->
  <div v-if="myTeams.length > 0 && isTeamManagementOpen">
    ...
  </div>
</div>
```

**Script Changes:**
```typescript
// Rename state variable
const isTeamAgentsOpen = ref(false)
  ↓
const isTeamManagementOpen = ref(false)

// Update handler name
const handleTeamAgentsClick = () => { ... }
  ↓
const handleTeamManagementClick = () => { ... }

// Update watch logic
if (newView === 'team-agents' || newView === 'team-detail') {
  isTeamAgentsOpen.value = true
} else {
  isTeamAgentsOpen.value = false
}
  ↓
if (newView === 'team-agents' || newView === 'team-detail') {
  isTeamManagementOpen.value = true
} else {
  isTeamManagementOpen.value = false
}
```

### State Management
No changes to `useTeamsStore` or team data structures. This is purely a UI change.

### View Names
The `team-agents` view name remains unchanged for backward compatibility. Only the display label changes.

## UI/UX Specifications

### Visual Changes
1. **Label Change**: "团队Agent" → "团队管理"
2. **Position Change**: From Agent section to below Knowledge Base
3. **Separator**: New separator line between Knowledge Base and Team Management

### Icon
Keep the existing team icon (users group icon) for consistency.

### Collapsible Behavior
The Team Management section maintains the same collapsible behavior as before:
- Expands when navigating to `team-agents` or `team-detail` views
- Shows team list below the main button
- Shows admin badge for team administrators

## Implementation Considerations

### Accessibility
- Ensure focus management works correctly with new section order
- Maintain keyboard navigation flow
- Keep aria-labels updated

### Testing
- Verify navigation works from all entry points
- Test collapsible behavior
- Verify view state management
- Test with multiple teams

### Migration
No data migration needed. This is a pure UI change.

## Open Questions
None identified.
