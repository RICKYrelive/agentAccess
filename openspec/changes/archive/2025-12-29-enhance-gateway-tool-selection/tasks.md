# Tasks: enhance-gateway-tool-selection

## 1. Data Model Updates

- [ ] 1.1 Add `LoadBalancerGroup` interface to `src/components/mcp-management/types.ts`
- [ ] 1.2 Add `LoadBalancerStrategy` type: 'round-robin' | 'random' | 'least-used'
- [ ] 1.3 Add `HealthCheckConfig` interface with enabled, interval, timeout fields
- [ ] 1.4 Update `MCPGateway` interface to add `loadBalancerGroups?: LoadBalancerGroup[]`
- [ ] 1.5 Add `GatewayFormData` interface extension for load balancer groups

## 2. Store Enhancements

- [ ] 2.1 Add `createLoadBalancerGroup` action to mcpManagement store
- [ ] 2.2 Add `updateLoadBalancerGroup` action to mcpManagement store
- [ ] 2.3 Add `deleteLoadBalancerGroup` action to mcpManagement store
- [ ] 2.4 Add `addToolToGroup` action to mcpManagement store
- [ ] 2.5 Add `removeToolFromGroup` action to mcpManagement store
- [ ] 2.6 Update `createGateway` to handle load balancer groups
- [ ] 2.7 Update `updateGateway` to handle load balancer groups

## 3. Tool Selection Search Component

- [ ] 3.1 Create `ToolSearchFilter.vue` component
- [ ] 3.2 Add search input field with icon
- [ ] 3.3 Add type filter dropdown (all/builtin/custom/npx/uvx)
- [ ] 3.4 Add status filter dropdown (all/enabled/disabled)
- [ ] 3.5 Add category filter dropdown with dynamic options
- [ ] 3.6 Implement reactive filtering logic
- [ ] 3.7 Display tool count for each filter option

## 4. Tool List Component

- [ ] 4.1 Create `ToolList.vue` component for displaying filtered tools
- [ ] 4.2 Display tool as card with icon, name, type, status
- [ ] 4.3 Add checkbox or add button for selection
- [ ] 4.4 Show tool description on hover or expand
- [ ] 4.5 Add visual indicator for already selected tools
- [ ] 4.6 Support keyboard navigation (arrow keys)
- [ ] 4.7 Show empty state when no tools match filters

## 5. Selected Tools Pane Component

- [ ] 5.1 Create `SelectedToolsPane.vue` component
- [ ] 5.2 Display individual selected tools as list items
- [ ] 5.3 Display load balancer groups as cards
- [ ] 5.4 Add remove button for each item
- [ ] 5.5 Show total count of selected tools
- [ ] 5.6 Support reordering items (drag and drop)

## 6. Load Balancer Group Dialog

- [ ] 6.1 Create `LoadBalancerGroupDialog.vue` component
- [ ] 6.2 Add dialog header with title "配置负载均衡组"
- [ ] 6.3 Add group name input field (required)
- [ ] 6.4 Add strategy dropdown with descriptions
- [ ] 6.5 Add tool multi-select section
- [ ] 6.6 Add health check toggle and configuration
- [ ] 6.7 Implement form validation
- [ ] 6.8 Add save and cancel buttons
- [ ] 6.9 Support edit mode (pre-fill data)

## 7. Load Balancer Group Card Component

- [ ] 7.1 Create `LoadBalancerGroupCard.vue` component
- [ ] 7.2 Display group name and strategy badge
- [ ] 7.3 Display tool count
- [ ] 7.4 Display tools in group (expandable)
- [ ] 7.5 Add edit button
- [ ] 7.6 Add delete button
- [ ] 7.7 Add expand/collapse toggle
- [ ] 7.8 Show health check status if configured

## 8. CreateGatewayDialog Refactor

- [ ] 8.1 Update dialog width to accommodate dual-pane layout
- [ ] 8.2 Replace simple checkbox list with dual-pane layout
- [ ] 8.3 Integrate `ToolSearchFilter.vue` in left pane
- [ ] 8.4 Integrate `ToolList.vue` in left pane
- [ ] 8.5 Integrate `SelectedToolsPane.vue` in right pane
- [ ] 8.6 Add "创建负载均衡组" button
- [ ] 8.7 Add load balancer groups list display
- [ ] 8.8 Update form data structure to include groups
- [ ] 8.9 Update submit handler to save groups

## 9. Category Extraction

- [ ] 9.1 Add computed property to extract unique categories from tools
- [ ] 9.2 Sort categories alphabetically
- [ ] 9.3 Add "全部" (All) option as default
- [ ] 9.4 Update category filter when categories change

## 10. Responsive Design

- [ ] 10.1 Ensure dual-pane layout works on desktop
- [ ] 10.2 Stack panes vertically on mobile/tablet
- [ ] 10.3 Ensure dialog fits within viewport on small screens
- [ ] 10.4 Test with various tool counts (10, 50, 100+)

## 11. State Management

- [ ] 11.1 Add local state for search query
- [ ] 11.2 Add local state for filter selections
- [ ] 11.3 Add local state for selected tools
- [ ] 11.4 Add local state for load balancer groups
- [ ] 11.5 Implement proper initialization from props
- [ ] 11.6 Reset state when dialog opens/closes

## 12. Testing and Validation

- [ ] 12.1 Test search with various queries
- [ ] 12.2 Test each filter individually
- [ ] 12.3 Test combined filters
- [ ] 12.4 Test creating load balancer group
- [ ] 12.5 Test editing load balancer group
- [ ] 12.6 Test deleting load balancer group
- [ ] 12.7 Test adding/removing tools from group
- [ ] 12.8 Test gateway creation with groups
- [ ] 12.9 Test gateway editing with groups
- [ ] 12.10 Test form validation
- [ ] 12.11 Run `npm run type-check` to ensure no errors

## 13. UI Polish

- [ ] 13.1 Add loading states for async operations
- [ ] 13.2 Add hover effects for interactive elements
- [ ] 13.3 Add transitions for smooth UI updates
- [ ] 13.4 Add empty state illustrations
- [ ] 13.5 Add tooltips for filter options
- [ ] 13.6 Add keyboard shortcut support (Esc to close, Enter to save)

## 14. Documentation

- [ ] 14.1 Add inline comments for complex logic
- [ ] 14.2 Document load balancer strategies
- [ ] 14.3 Update component props documentation
