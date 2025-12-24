# Tasks: Redesign My Agents Page

## Phase 1: Foundation (Store & Types)

- [x] Update `Agent` type in `types/index.ts` to include `isThirdParty`, `tags`, `sharedGroups`, `lastUsedAt`, `createdAt`, `updatedAt`
- [x] Add `SharingGroup` interface to `types/index.ts`
- [x] Create `ExtendedAgent` type alias for internal use
- [x] Update agents store with new state: `recentAgents`, `sharingGroups`, `isMyAgentsView`
- [x] Add store methods: `getRecentAgents()`, `addSharingGroup()`, `removeSharingGroup()`
- [x] Add store methods: `shareAgentWithGroup()`, `unshareAgentFromGroup()`, `updateAgentTags()`, `markAgentAsUsed()`
- [x] Add store method: `importThirdPartyAgent()` (stub for now)
- [x] Create migration function to convert existing `workflowStore.workflows` to agents

## Phase 2: Sidebar Navigation Updates

- [x] Modify `SidebarNavigation.vue`: Remove nested "我的Agent" dropdown
- [x] Add "我的Agent" as primary navigation button (like "主页" and "Agent编辑器")
- [x] Create `RecentAgentShortcuts.vue` component (integrated inline)
- [x] Display top 3 recent agents below "我的Agent" button
- [x] Add click handler for recent agents → load in workflow editor
- [x] Update `AppLayout.vue` to handle `activeView = 'my-agents'`

## Phase 3: My Agents Page - Core Layout

- [x] Create `MyAgentsPage.vue` component (full page layout)
- [x] Create `MyAgentsHeader.vue` component with title (integrated inline)
- [x] Create `AgentCreationBar.vue` component with 3 buttons (integrated inline)
- [x] Implement "自定义创建Agent" button → creates new workflow, opens editor
- [x] Implement "自动创建Agent" button → shows "Coming Soon" toast
- [x] Implement "导入第三方Agent" button → shows "Coming Soon" toast
- [x] Add toast notification system for "Coming Soon" messages

## Phase 4: Agent Cards & Lists

- [x] Create `AgentCard.vue` component with name, badges, tags, shared indicator
- [x] Add "第三方" badge display logic
- [x] Add tags display (max 3)
- [x] Add shared groups display
- [x] Add edit button on each card
- [x] Make agent cards draggable (`draggable="true"`)
- [x] Create `PrivateAgentsList.vue` component (integrated inline)
- [x] Display all private agents (user's own agents)
- [x] Create `SharedAgentsList.vue` component (integrated inline)
- [x] Create `SharingGroupAccordion.vue` component (expand/collapse groups)

## Phase 5: Drag & Drop Sharing

- [x] Implement drag start event on agent cards (transfer agent ID)
- [x] Implement drop zone on sharing group sections
- [x] Add visual feedback during drag (drop zone highlight)
- [x] Implement drop handler → calls `shareAgentWithGroup()`
- [x] Update display when agent is shared (appears in shared section)
- [x] Add ability to remove agent from shared group (x button in shared section)

## Phase 6: Sharing Group Management

- [x] Add "添加共享组" button in shared agents section
- [x] Create simple dialog/modal for adding new sharing group
- [x] Implement group creation with name and optional description
- [x] Display sharing groups as collapsible accordions
- [x] Add delete/remove sharing group functionality (admin only)

## Phase 7: Workflow Editor Integration

- [x] Update workflow store `saveAsAgent()` to use new agent format
- [x] Update workflow store `loadAgent()` to work with ExtendedAgent type
- [x] Ensure `markAgentAsUsed()` is called when agent is loaded
- [x] Update sidebar "最近对话" to refresh after using agent

## Phase 8: Styling & Polish

- [x] Design and implement agent card styling (shadows, hover effects)
- [x] Style drag & drop visual feedback
- [x] Style creation bar buttons with icons
- [x] Style badges (第三方, shared status)
- [x] Style tags (pill-shaped, colored)
- [x] Add empty state illustrations when no agents exist
- [x] Responsive design for different screen sizes

## Phase 9: Data Persistence (Backend - Optional/Future)

- [ ] Design API endpoints for agents CRUD
- [ ] Design API endpoints for sharing groups management
- [ ] Implement agent data persistence to backend
- [ ] Implement sharing groups persistence
- [ ] Handle sync conflicts between local and remote data

## Dependencies

- Phase 1 must complete before all other phases
- Phase 2 depends on Phase 1
- Phase 3 depends on Phase 2
- Phase 4 can run in parallel with Phase 3
- Phase 5 depends on Phase 4
- Phase 6 can run in parallel with Phase 5
- Phase 7 depends on Phase 1 and Phase 2
- Phase 8 can run in parallel with Phase 4-7
- Phase 9 is optional and can be done last

## Validation

- [x] All agents from `workflowStore.workflows` appear in My Agents page
- [x] Recent agents in sidebar match most recently used (sorted by `lastUsedAt`)
- [x] Clicking recent agent loads correct workflow in editor
- [x] "自定义创建Agent" creates blank workflow and opens editor
- [x] Other create buttons show "Coming Soon" toast
- [x] Dragging agent to shared group adds it to that group
- [x] Agent appears in both private and shared sections after sharing
- [x] Removing agent from shared group removes only from that group
- [x] Agent card shows correct badges (第三方 if applicable)
- [x] Agent card shows max 3 tags
- [x] Agent card shows which groups it's shared with
- [x] Edit button on card opens agent in workflow editor
- [x] Creating new sharing group adds it to the list
- [x] Deleting sharing group removes it from list (doesn't delete agents)
