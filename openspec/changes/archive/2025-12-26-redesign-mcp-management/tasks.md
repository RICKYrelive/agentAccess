# Tasks: redesign-mcp-management

## 1. Sidebar Navigation Update

- [x] 1.1 Update `SidebarNavigation.vue` to rename "MCP 工具" to "MCP 管理"
- [x] 1.2 Add expandable sub-menu for MCP Management with two items: "MCP 工具" and "MCP 网关"
- [x] 1.3 Add state refs for `isMCPManagementOpen` and watch for view changes to auto-expand/collapse
- [x] 1.4 Update the `Props` interface to include new view types
- [x] 1.5 Update the `Emits` interface to include 'mcp-gateway' view type

## 2. AppLayout View Integration

- [x] 2.1 Add 'mcp-tools' and 'mcp-gateway' to the `activeView` union type in `AppLayout.vue`
- [x] 2.2 Import and add `MCPToolsPage` component with conditional rendering
- [x] 2.3 Import and add `MCPGatewayPage` component with conditional rendering
- [x] 2.4 Update `handleViewChange` function to support new view types

## 3. MCP Management Store

- [x] 3.1 Create `src/stores/mcpManagement.ts` Pinia store
- [x] 3.2 Define `MCPTool` interface with fields: id, name, description, type, category, isEnabled, status, config, dates
- [x] 3.3 Define `MCPGateway` interface with fields: id, name, description, baseUrl, mcpToolIds, status, dates
- [x] 3.4 Define `MCPToolConfig` interface for custom/npx/uvx configurations
- [x] 3.5 Add state for `mcpTools` array with mock initial data
- [x] 3.6 Add state for `mcpGateways` array with mock initial data
- [x] 3.7 Implement CRUD actions: `createMCPTool`, `updateMCPTool`, `deleteMCPTool`, `toggleMCPTool`
- [x] 3.8 Implement CRUD actions: `createGateway`, `updateGateway`, `deleteGateway`
- [x] 3.9 Add builtin tools constant array with 5-10 sample tools
- [x] 3.10 Implement `importBuiltinTool` action

## 4. MCP Types Definition

- [x] 4.1 Create `src/components/mcp-management/types.ts` file
- [x] 4.2 Export `MCPToolType` union type: 'builtin' | 'custom' | 'npx' | 'uvx'
- [x] 4.3 Export `MCPToolStatus` union type: 'active' | 'inactive' | 'error'
- [x] 4.4 Export `GatewayStatus` union type: 'running' | 'stopped' | 'error'
- [x] 4.5 Export `AuthType` union type: 'none' | 'apikey' | 'bearer'
- [x] 4.6 Export form interfaces for each dialog type

## 5. MCP Tools Page Component

- [x] 5.1 Create `src/components/mcp-management/MCPToolsPage.vue`
- [x] 5.2 Add page header with title "MCP 工具管理"
- [x] 5.3 Add creation section with three buttons: "从官方商店导入", "自定义第三方工具", "导入镜像"
- [x] 5.4 Add tools grid section to display tool cards
- [x] 5.5 Implement tool card display with name, icon, type badge, status, action buttons
- [x] 5.6 Add filter/search functionality (optional)
- [x] 5.7 Connect to `useMCPManagementStore` to get tools list
- [x] 5.8 Implement edit, delete, toggle enable handlers

## 6. Builtin Tool Import Dialog

- [x] 6.1 Create `src/components/mcp-management/BuiltinToolImportDialog.vue`
- [x] 6.2 Add dialog header with title "导入内置工具"
- [x] 6.3 Display list of available builtin tools from store
- [x] 6.4 Show tool name, description, category for each tool
- [x] 6.5 Add selection checkbox for each tool
- [x] 6.6 Add import and cancel buttons
- [x] 6.7 Implement import handler that calls `store.importBuiltinTool`
- [x] 6.8 Show already imported indicator for tools that are already added

## 7. Custom Tool Configuration Dialog

- [x] 7.1 Create `src/components/mcp-management/CustomToolConfigDialog.vue`
- [x] 7.2 Add dialog header with title "配置自定义工具"
- [x] 7.3 Add form field: Tool name (text input, required)
- [x] 7.4 Add form field: Tool description (textarea, optional)
- [x] 7.5 Add form field: MCP server URL (text input, required)
- [x] 7.6 Add form field: Authentication type (select: none, apikey, bearer)
- [x] 7.7 Add conditional field: API Key (password input, shown when apikey selected)
- [x] 7.8 Add conditional field: Bearer Token (password input, shown when bearer selected)
- [x] 7.9 Add "测试连接" button with mock connection test
- [x] 7.10 Add submit and cancel buttons
- [x] 7.11 Implement form validation
- [x] 7.12 Implement submit handler that creates custom tool

## 8. Image Deployment Dialog

- [x] 8.1 Create `src/components/mcp-management/ImageDeploymentDialog.vue`
- [x] 8.2 Add dialog header with title "导入 MCP 镜像"
- [x] 8.3 Add radio buttons for package type: npx, uvx
- [x] 8.4 Add form field: Package name (text input, required)
- [x] 8.5 Add form field: Version (text input, optional, default: latest)
- [x] 8.6 Add metadata display section (mock data for author, description)
- [x] 8.7 Add submit and cancel buttons
- [x] 8.8 Implement form validation
- [x] 8.9 Implement submit handler that creates npx or uvx tool

## 9. MCP Gateway Page Component

- [x] 9.1 Create `src/components/mcp-management/MCPGatewayPage.vue`
- [x] 9.2 Add page header with title "MCP 网关管理"
- [x] 9.3 Add action buttons: "创建网关", "导入 OpenAPI"
- [x] 9.4 Add gateways table with columns: name, description, tool count, status, actions
- [x] 9.5 Implement table row display for each gateway
- [x] 9.6 Add edit, delete action buttons in each row
- [x] 9.7 Connect to `useMCPManagementStore` to get gateways list
- [x] 9.8 Implement edit, delete handlers

## 10. Create Gateway Dialog

- [x] 10.1 Create `src/components/mcp-management/CreateGatewayDialog.vue`
- [x] 10.2 Add dialog header with title "创建 MCP 网关"
- [x] 10.3 Add form field: Gateway name (text input, required)
- [x] 10.4 Add form field: Gateway description (textarea, optional)
- [x] 10.5 Add form field: Base URL (text input, required)
- [x] 10.6 Add multi-select for associated MCP tools
- [x] 10.7 Populate tool options from `store.mcpTools`
- [x] 10.8 Add submit and cancel buttons
- [x] 10.9 Implement form validation
- [x] 10.10 Implement submit handler that creates gateway

## 11. OpenAPI Import Dialog

- [x] 11.1 Create `src/components/mcp-management/OpenAPIImportDialog.vue`
- [x] 11.2 Add dialog header with title "导入 OpenAPI 文件"
- [x] 11.3 Add file upload area supporting .json, .yaml, .yml files
- [x] 11.4 Implement file reading and parsing logic
- [x] 11.5 Add YAML parsing support using a lightweight library
- [x] 11.6 Extract endpoints from parsed OpenAPI spec
- [x] 11.7 Display preview of extracted endpoints
- [x] 11.8 Display preview of generated MCP tools
- [x] 11.9 Add confirm and cancel buttons
- [x] 11.10 Implement confirm handler that creates gateway and tools
- [x] 11.11 Handle parsing errors with clear error messages

## 12. Tool Editing

- [x] 12.1 Modify existing dialogs to support edit mode (pre-fill data)
- [x] 12.2 Add edit mode prop to all configuration dialogs
- [x] 12.3 Implement update logic instead of create when in edit mode
- [x] 12.4 Ensure form validation works for both create and edit

## 13. Delete Confirmation

- [x] 13.1 Add confirmation dialog before deleting MCP tools
- [x] 13.2 Add confirmation dialog before deleting gateways
- [x] 13.3 Show impact info (e.g., "this will remove 1 gateway and 3 associated tools")

## 14. Status Indicators and Badges

- [x] 14.1 Create status badge component with appropriate colors (green/yellow/red)
- [x] 14.2 Add type badge component for tool types (内置/自定义/npx/uvx)
- [x] 14.3 Ensure consistent styling across all pages

## 15. Responsive Design

- [x] 15.1 Ensure MCP Tools page is responsive on mobile devices
- [x] 15.2 Ensure MCP Gateway page table is responsive (use horizontal scroll or card view on mobile)
- [x] 15.3 Ensure all dialogs fit within mobile viewports

## 16. Testing and Validation

- [x] 16.1 Verify sidebar menu expands/collapses correctly
- [x] 16.2 Verify navigation to both MCP Tools and MCP Gateway pages
- [x] 16.3 Test all three tool creation methods with valid and invalid inputs
- [x] 16.4 Test tool edit, delete, toggle enable operations
- [x] 16.5 Test gateway creation with tool associations
- [x] 16.6 Test gateway edit and delete operations
- [x] 16.7 Test OpenAPI import with valid JSON and YAML files
- [x] 16.8 Test OpenAPI import error handling
- [x] 16.9 Run `npm run type-check` to ensure no TypeScript errors
- [x] 16.10 Run `npm run lint` to ensure code quality

## 17. Documentation

- [x] 17.1 Add inline comments for complex logic (OpenAPI parsing, store actions)
- [x] 17.2 Update any relevant documentation if needed
