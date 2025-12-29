# enhance-mcp-tool-mgmt-ui

## Summary
Enhance the MCP Tool Management page with a modern dashboard UI featuring status overview cards, redesigned tool source buttons, and a comprehensive active tools table view.

## Motivation
The current MCP Tools page (MCPToolsPage.vue) displays tools in a basic card grid layout without any overview metrics or system status information. Users lack quick visibility into:
- How many tools are currently active
- Tool usage metrics
- Overall system health status

Additionally, the creation buttons use inconsistent styling with colored borders that don't align with the clean design shown in the reference mockups.

This change aims to modernize the UI to match the professional design specification while improving information density and user experience.

## Scope
This change includes:
1. **Status Cards Section** - Add three overview cards (Active Tools, Usage Today, System Status)
2. **Tool Sources Redesign** - Update creation buttons to align with the reference design (dashed border cards with consistent styling)
3. **Active Tools Table** - Transform the card grid into a comprehensive table with Name, Type, Status, Latency, and Last Sync columns

## Out of Scope
- Backend API changes (will use existing MCP tool data)
- New dialog components
- Changes to MCP tool types or configuration options

## Proposed Design
Based on the reference HTML design (draft/stitch/mcp-tool-mgmt/code.html):

### Status Cards (Top Section)
- **Active Tools**: Shows count of connected tools with blue accent
- **Usage Today**: Shows daily invocation count with purple accent
- **System Status**: Shows operational status with green accent and animated pulse

### Tool Sources (Middle Section)
Three action buttons with consistent dashed border styling:
1. **Import Definition** (formerly "导入 OpenAPI")
2. **Connect Database** (new option aligned with original design)
3. **Custom Function** (formerly "自定义第三方工具")

### Active Tools Table (Bottom Section)
Comprehensive table with columns:
- **Name**: Tool name with icon and subtitle
- **Type**: Database View, Lambda Function, Storage API, Webhook, etc.
- **Status**: Ready, Active, Updating, Degraded (with color-coded badges)
- **Latency**: Response time in milliseconds
- **Last Sync**: Timestamp or relative time
- **Actions**: More options menu

## Impact on Existing Specifications
This change MODIFIES the `mcp-tool-management` specification to add new UI requirements while maintaining all existing functionality.

## Dependencies
- Existing `mcp-tool-management` specification
- Current MCPToolsPage.vue component
- MCP management store (useMCPManagementStore)

## Risks and Mitigations
| Risk | Mitigation |
|------|------------|
| Usage metrics may not be available from backend | Display placeholder or "N/A" until backend implementation |
| Tool latency data may not exist | Display "--" for tools without latency metrics |
| Table layout may not work well on mobile | Ensure responsive design with horizontal scroll |

## Success Criteria
- [ ] Status cards display accurate counts and system status
- [ ] Tool sources buttons use consistent dashed border styling
- [ ] Active tools table shows all tools with proper badges
- [ ] All existing CRUD operations (create, edit, delete, toggle) continue to work
- [ ] Page is responsive and accessible
