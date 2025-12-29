# Tasks: Optimize Access Page Start

## Implementation Checklist

- [ ] **1. Add "My Agent" section to ContentArea**
  - [ ] 1.1 Import useAgentStore in ContentArea.vue
  - [ ] 1.2 Add computed property for recentMyAgents (limit to 3)
  - [ ] 1.3 Add "我的 Agent" section UI above team agents
  - [ ] 1.4 Add "查看全部我的 Agent →" link button
  - [ ] 1.5 Implement goToMyAgentsPage method that emits view-change event
  - [ ] 1.6 Test agent selection from My Agent section

- [ ] **2. Create MCPInlineConfig component**
  - [ ] 2.1 Create src/components/config/MCPInlineConfig.vue
  - [ ] 2.2 Import useMCPManagementStore
  - [ ] 2.3 Add category-based collapsible sections UI
  - [ ] 2.4 Add toggle switches for each MCP tool
  - [ ] 2.5 Implement v-model binding for selectedTools
  - [ ] 2.6 Add tool description display on expand
  - [ ] 2.7 Test inline MCP configuration

- [ ] **3. Update ContentArea for inline MCP config**
  - [ ] 3.1 Remove handleMcpTabClick method that opens settings panel
  - [ ] 3.2 Update MCP tab click to only switch activeTab
  - [ ] 3.3 Replace placeholder content with MCPInlineConfig component
  - [ ] 3.4 Add state management for selectedMcpTools
  - [ ] 3.5 Test MCP configuration stays inline

- [ ] **4. Create SystemToolsInlineConfig component**
  - [ ] 4.1 Create src/components/config/SystemToolsInlineConfig.vue
  - [ ] 4.2 Define system tools data structure (sandbox + builtin tools)
  - [ ] 4.3 Add two collapsible sections: 沙箱环境 and 内置工具
  - [ ] 4.4 Add toggle switches for each tool
  - [ ] 4.5 Implement v-model binding for selectedTools
  - [ ] 4.6 Test system tools configuration

- [ ] **5. Create MemoryInlineConfig component**
  - [ ] 5.1 Create src/components/config/MemoryInlineConfig.vue
  - [ ] 5.2 Define memory types (短期/长期/向量) with size info
  - [ ] 5.3 Add radio selection for memory type
  - [ ] 5.4 Display memory usage statistics
  - [ ] 5.5 Add "添加记忆体" button
  - [ ] 5.6 Implement v-model binding for selectedMemory
  - [ ] 5.7 Test memory configuration

- [ ] **6. Update ContentArea configuration tabs**
  - [ ] 6.1 Add "系统工具" tab button
  - [ ] 6.2 Add "记忆体" tab button
  - [ ] 6.3 Update activeTab type to include 'system-tools' and 'memory'
  - [ ] 6.4 Add conditional rendering for SystemToolsInlineConfig
  - [ ] 6.5 Add conditional rendering for MemoryInlineConfig
  - [ ] 6.6 Add state refs for selectedSystemTools and selectedMemory
  - [ ] 6.7 Test tab switching and config persistence

- [ ] **7. Update emit payload with configuration**
  - [ ] 7.1 Define ConfigPayload interface with all config options
  - [ ] 7.2 Update sendMessage to emit config with message-sent event
  - [ ] 7.3 Update ChatInterface to receive and apply config
  - [ ] 7.4 Test configuration is applied to conversation

- [ ] **8. Style and responsive design**
  - [ ] 8.1 Ensure horizontal scroll for tabs on small screens
  - [ ] 8.2 Set max-height with internal scroll for tab content
  - [ ] 8.3 Test on mobile and tablet screen sizes
  - [ ] 8.4 Ensure tab labels don't overflow

- [ ] **9. Validation and testing**
  - [ ] 9.1 Test agent selection from both My Agent and Team Agent sections
  - [ ] 9.2 Test all four configuration tabs work correctly
  - [ ] 9.3 Test configuration persists when switching tabs
  - [ ] 9.4 Test "查看全部我的 Agent" navigates correctly
  - [ ] 9.5 Run type-check: npm run type-check
  - [ ] 9.6 Run lint: npm run lint

## Dependencies
- Task 1 can be done independently
- Task 2 and 3 are dependent on each other
- Tasks 4, 5, 6 can be done in parallel
- Task 7 depends on tasks 2-6
- Task 8 can be done alongside implementation
- Task 9 must be done last

## Validation Criteria
- My Agent section shows exactly 3 recent agents
- MCP configuration does NOT open settings panel
- All 4 tabs (知识库, MCP服务, 系统工具, 记忆体) are accessible
- Configuration is included when sending message
- No TypeScript errors
- No ESLint warnings
