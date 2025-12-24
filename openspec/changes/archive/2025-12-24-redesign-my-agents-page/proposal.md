# Proposal: Redesign My Agents Page

## Summary
Redesign the "我的Agent" (My Agents) functionality with a dedicated page, improved navigation, agent sharing with groups, and support for third-party agent templates.

## Why
The current "我的Agent" implementation is limited - it only shows a simple dropdown list in the sidebar without proper management capabilities. Users need:

1. A dedicated interface to manage their agents with visual cards
2. Ability to share agents with different groups (team, department, etc.)
3. Support for importing third-party agent templates
4. Quick access to recently used agents directly from sidebar
5. Clear distinction between private agents and shared agents

## What Changes

### 1. Sidebar Enhancement
- Add "My Agents" as a primary navigation item (not nested dropdown)
- Show top 3 recently used agents as clickable shortcuts below "My Agents"
- Remove current nested "我的Agent" dropdown that shows saved workflows

### 2. My Agents Page (New View)
- **Header**: Title "我的Agent"
- **Creation Bar**: Three creation options:
  - "自定义创建Agent" (Custom Create Agent) - Opens workflow editor with blank canvas
  - "自动创建Agent" (Auto Create Agent) - Shows "Coming Soon" toast
  - "导入第三方Agent" (Import Third-party Agent) - Shows "Coming Soon" toast
- **Agent Cards Section**: Two sections
  - **私有Agent** (Private Agents): User's own agents
  - **共享Agent** (Shared Agents): Agents shared with groups

### 3. Agent Card Design
Each agent card displays:
- Agent name
- "第三方" badge if imported from external source
- Up to 3 tags
- Shared status indicator (shared with which groups)
- Edit button (opens in workflow editor)

### 4. Sharing & Groups
- Shared agents are organized by sharing groups
- Users can add/remove sharing groups
- Drag-and-drop private agents to shared groups to share them
- Agents can appear in multiple shared groups simultaneously
- Private agents always remain in the private section

## Affected Specs
- `frontend` - New MyAgentsPage component, agent store enhancements
- `ui-interface` - New page layout, navigation updates
