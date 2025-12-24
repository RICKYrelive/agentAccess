## ADDED Requirements

### Requirement: My Agents View Management
The system SHALL provide a dedicated My Agents view within the main content area for managing user's agents.

#### Scenario: User navigates to My Agents page
- **WHEN** user clicks "我的Agent" button in the sidebar
- **THEN** the system SHALL set `activeView` to `'my-agents'`
- **AND** the system SHALL display `MyAgentsPage.vue` component in the main content area
- **AND** the system SHALL hide the home page and workflow editor

#### Scenario: User views My Agents page structure
- **WHEN** user is on the My Agents page
- **THEN** the system SHALL display a header with title "我的Agent"
- **AND** the system SHALL display an agent creation bar with three options
- **AND** the system SHALL display a private agents section
- **AND** the system SHALL display a shared agents section organized by groups

### Requirement: Recent Agents in Sidebar
The system SHALL display the 3 most recently used agents as shortcuts in the sidebar.

#### Scenario: Sidebar shows recent agents
- **WHEN** user views the sidebar
- **THEN** the system SHALL display the top 3 recently used agents below "我的Agent" button
- **AND** the agents SHALL be sorted by `lastUsedAt` in descending order
- **AND** each recent agent SHALL display its name and an icon

#### Scenario: User clicks recent agent shortcut
- **WHEN** user clicks on a recent agent in the sidebar
- **THEN** the system SHALL load the agent's workflow data
- **AND** the system SHALL navigate to the workflow editor view
- **AND** the system SHALL call `markAgentAsUsed(agentId)` to update the last used timestamp

#### Scenario: Recent agents list updates
- **WHEN** user uses an agent (loads it in workflow editor)
- **THEN** the system SHALL update the agent's `lastUsedAt` to current time
- **AND** the system SHALL re-sort the recent agents list
- **AND** the sidebar SHALL reflect the updated order

### Requirement: Agent Creation Options
The system SHALL provide three agent creation options on the My Agents page.

#### Scenario: User creates custom agent
- **WHEN** user clicks "自定义创建Agent" button
- **THEN** the system SHALL create a new blank workflow
- **AND** the system SHALL navigate to the workflow editor view
- **AND** the workflow SHALL have default name "新Agent"

#### Scenario: User clicks auto-create agent
- **WHEN** user clicks "自动创建Agent" button
- **THEN** the system SHALL display a toast notification "功能开发中，敬请期待"
- **AND** no agent SHALL be created

#### Scenario: User clicks import third-party agent
- **WHEN** user clicks "导入第三方Agent" button
- **THEN** the system SHALL display a toast notification "功能开发中，敬请期待"
- **AND** no agent SHALL be imported

### Requirement: Private Agents Section
The system SHALL display all user-owned agents in a private agents section.

#### Scenario: User views private agents
- **WHEN** user views the My Agents page
- **THEN** the system SHALL display a "私有Agent" section header with count
- **AND** the system SHALL display all agents owned by the user as cards
- **AND** the cards SHALL be arranged in a grid layout

#### Scenario: Private agent card displays
- **WHEN** user views an agent card
- **THEN** the system SHALL display the agent name
- **AND** the system SHALL display an "第三方" badge if `isThirdParty` is true
- **AND** the system SHALL display up to 3 tags
- **AND** the system SHALL display which sharing groups the agent is shared with
- **AND** the system SHALL display an edit button

### Requirement: Shared Agents Section
The system SHALL display shared agents organized by sharing groups.

#### Scenario: User views shared agents section
- **WHEN** user views the My Agents page
- **THEN** the system SHALL display a "共享Agent" section header
- **AND** the system SHALL display sharing groups as collapsible accordions
- **AND** each group SHALL show the group name and agent count

#### Scenario: User expands sharing group
- **WHEN** user clicks on a sharing group accordion
- **THEN** the system SHALL expand the group to show its agents
- **AND** the system SHALL display agent cards for agents shared with that group
- **AND** the agent cards SHALL include the same information as private agent cards

#### Scenario: Shared agent displays in multiple groups
- **WHEN** an agent is shared with multiple groups
- **THEN** the system SHALL display the agent card in each sharing group
- **AND** modifications to the agent SHALL reflect across all groups
- **AND** the agent SHALL always remain in the private agents section

### Requirement: Agent Card Design
The system SHALL provide a consistent agent card design with visual indicators for agent properties.

#### Scenario: Agent card shows third-party badge
- **WHEN** an agent has `isThirdParty: true`
- **THEN** the card SHALL display a "第三方" badge
- **AND** the badge SHALL be visually distinct from other elements

#### Scenario: Agent card shows tags
- **WHEN** an agent has tags defined
- **THEN** the card SHALL display up to 3 tags as pill-shaped badges
- **AND** if there are more than 3 tags, only the first 3 SHALL be displayed
- **AND** if there are no tags, no tag area SHALL be displayed

#### Scenario: Agent card shows shared status
- **WHEN** an agent is shared with one or more groups
- **THEN** the card SHALL display "已共享: [group names]"
- **AND** multiple group names SHALL be comma-separated

### Requirement: Drag and Drop Sharing
The system SHALL allow users to share agents by dragging them to sharing groups.

#### Scenario: User starts dragging agent card
- **WHEN** user grabs and drags an agent card from the private section
- **THEN** the system SHALL set a drag image of the card
- **AND** the system SHALL store the agent ID in the data transfer
- **AND** the drop zones in sharing groups SHALL highlight

#### Scenario: User drops agent on sharing group
- **WHEN** user drops an agent card on a sharing group drop zone
- **THEN** the system SHALL call `shareAgentWithGroup(agentId, groupId)`
- **AND** the agent card SHALL appear in that sharing group section
- **AND** the agent card SHALL remain in the private agents section
- **AND** the agent's `sharedGroups` array SHALL be updated

#### Scenario: User removes agent from shared group
- **WHEN** user clicks the remove button on an agent in a shared group
- **THEN** the system SHALL call `unshareAgentFromGroup(agentId, groupId)`
- **AND** the agent card SHALL be removed from that sharing group
- **AND** the agent card SHALL remain in the private agents section
- **AND** the agent SHALL remain in any other sharing groups it was part of

### Requirement: Sharing Group Management
The system SHALL allow users to create and manage sharing groups.

#### Scenario: User adds new sharing group
- **WHEN** user clicks "添加共享组" button
- **THEN** the system SHALL display a dialog for entering group name and description
- **WHEN** user submits the form
- **THEN** the system SHALL create a new `SharingGroup` with unique ID
- **AND** the new group SHALL appear in the shared agents section
- **AND** the group SHALL be empty (no agents)

#### Scenario: User deletes sharing group
- **WHEN** user deletes a sharing group
- **THEN** the group SHALL be removed from the shared agents section
- **AND** agents SHALL have the group ID removed from their `sharedGroups` array
- **AND** agents SHALL NOT be deleted from private agents or other sharing groups

### Requirement: Extended Agent Type
The system SHALL extend the Agent type with additional properties for enhanced agent management.

#### Scenario: Agent type includes new properties
- **WHEN** an agent is created or retrieved
- **THEN** the agent SHALL include `isThirdParty?: boolean`
- **AND** the agent SHALL include `tags?: string[]` (max 3)
- **AND** the agent SHALL include `sharedGroups?: string[]`
- **AND** the agent SHALL include `lastUsedAt?: Date`
- **AND** the agent SHALL include `createdAt: Date`
- **AND** the agent SHALL include `updatedAt: Date`

### Requirement: Agent Store Enhancements
The system SHALL provide enhanced store methods for managing agents with sharing capabilities.

#### Scenario: Get recent agents
- **WHEN** `getRecentAgents(3)` is called
- **THEN** the system SHALL return up to 3 agents sorted by `lastUsedAt` descending
- **AND** agents with no `lastUsedAt` SHALL be excluded

#### Scenario: Share agent with group
- **WHEN** `shareAgentWithGroup(agentId, groupId)` is called
- **THEN** the system SHALL add the groupId to the agent's `sharedGroups` array
- **AND** if the groupId already exists, no duplicate SHALL be added
- **AND** the agent's `updatedAt` timestamp SHALL be updated

#### Scenario: Unshare agent from group
- **WHEN** `unshareAgentFromGroup(agentId, groupId)` is called
- **THEN** the system SHALL remove the groupId from the agent's `sharedGroups` array
- **AND** the agent's `updatedAt` timestamp SHALL be updated

#### Scenario: Mark agent as used
- **WHEN** `markAgentAsUsed(agentId)` is called
- **THEN** the system SHALL set the agent's `lastUsedAt` to current date/time
- **AND** the agent SHALL move to the top of recent agents list

#### Scenario: Update agent tags
- **WHEN** `updateAgentTags(agentId, tags)` is called with more than 3 tags
- **THEN** the system SHALL store only the first 3 tags
- **AND** the system SHALL update the agent's `updatedAt` timestamp

### Requirement: Workflow to Agent Migration
The system SHALL migrate existing workflows to the new agent format.

#### Scenario: Existing workflows are converted to agents
- **WHEN** the application initializes
- **THEN** the system SHALL check for existing workflows in `workflowStore.workflows`
- **AND** each workflow SHALL be converted to an ExtendedAgent
- **AND** the agent's `workflowData` SHALL contain the workflow
- **AND** the agent's `name` SHALL match the workflow name
- **AND** the agent's `id` SHALL match the workflow id
- **AND** the agent SHALL be added to the agents store

## MODIFIED Requirements

### Requirement: Multi-Agent Support Interface
[MODIFIED] The system SHALL provide a dedicated My Agents page for managing user's agents with sharing capabilities, instead of a dropdown in the sidebar.

#### Scenario: User accesses My Agents
- **WHEN** user wants to manage their agents
- **THEN** the system SHALL provide a "我的Agent" button in the main sidebar navigation
- **AND** clicking it SHALL navigate to a dedicated My Agents page (not dropdown)
- **AND** the page SHALL display agent cards with full management capabilities
- **AND** the sidebar SHALL show recent agent shortcuts below the button

#### Scenario: User creates new agent
- **WHEN** user wants to create a new agent
- **THEN** the system SHALL provide "自定义创建Agent" button on My Agents page
- **AND** clicking it SHALL open workflow editor with blank workflow
- **AND** saving the workflow SHALL add it to the agents list

#### Scenario: User shares agent with team
- **WHEN** user wants to share an agent with a team/department
- **THEN** the user CAN drag the agent card to a sharing group
- **OR** the user CAN use a sharing menu on the agent card
- **AND** the agent SHALL appear in both private and shared sections
