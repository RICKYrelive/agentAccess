# Rename "Team Agents" to "Team Management"

## Summary
Rename the "团队Agent" (Team Agents) sidebar menu item to "团队管理" (Team Management) and reposition it below the "知识库" (Knowledge Base) menu item, separated by a divider line.

## Motivation
The current "团队Agent" label does not clearly convey that it's a team management feature. Users may be confused about the difference between "我的 Agent" (My Agents) and "团队 Agent" (Team Agents).

By renaming it to "团队管理" (Team Management):
1. **Clarity**: The name more accurately reflects the functionality - managing teams and team agents
2. **Consistency**: Aligns with common terminology used in team collaboration tools
3. **Positioning**: Moving it below Knowledge Base (after a separator) groups related management features together:
   - Knowledge Base = data management
   - Team Management = collaboration management

## Proposed Changes

### 1. Rename Menu Item
- Change "团队Agent" to "团队管理" in the sidebar navigation
- Update all references in code, comments, and user-facing text

### 2. Reposition Menu Item
- Move "团队管理" from its current position (below "我的Agent" in the Agent section)
- To below "知识库" in the Knowledge Base section
- Add a separator line between Knowledge Base and Team Management

### Current Structure:
```
...
[Separator]
Agent Section
  - Agent 编辑器
  - 我的 Agent (with recent agents dropdown)
  - 团队 Agent (with teams dropdown)  ← Current position
[Separator]
Tools & Memory Section
  - MCP 管理
  - 系统工具
  - 记忆体
[Separator]
Knowledge Base
  - 知识库
```

### New Structure:
```
...
[Separator]
Agent Section
  - Agent 编辑器
  - 我的 Agent (with recent agents dropdown)
[Separator]
Tools & Memory Section
  - MCP 管理
  - 系统工具
  - 记忆体
[Separator]
Knowledge Base Section
  - 知识库
[Separator]  ← New separator
Team Management Section  ← Moved here
  - 团队管理 (with teams dropdown)
```

## Impact Analysis

### Breaking Changes
None - this is a UI label change only. No API or data structure changes.

### Dependencies
- Requires updates to `SidebarNavigation.vue` component
- May require updates to type definitions if view names are hardcoded

### Migration Path
1. Update sidebar navigation component
2. Update any hardcoded references to "team-agents" view name (if needed)
3. Update user-facing text and tooltips

## Alternatives Considered
1. **Keep current name**: Rejected - "团队Agent" is ambiguous
2. **Rename to "团队协作"**: Rejected - "团队管理" is more standard terminology
3. **Keep current position**: Rejected - positioning below Knowledge Base creates better logical grouping

## Success Criteria
- "团队管理" label is displayed in sidebar
- Menu item appears below Knowledge Base
- Separator line is visible between Knowledge Base and Team Management
- All existing functionality remains intact
- No broken links or navigation issues
