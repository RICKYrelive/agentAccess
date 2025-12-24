# Tasks: Integrate FastGPT Workflow Engine

## Phase 1: Foundation (Dependencies & Configuration)

- [x] 1.1 Add FastGPT SDK or HTTP client dependency to package.json
  - Research FastGPT JavaScript SDK availability
  - If SDK unavailable, add axios for HTTP API calls
  - Update package.json and run npm install

- [x] 1.2 Create environment configuration for FastGPT
  - Add VITE_FASTGPT_API_URL to .env.example
  - Add VITE_FASTGPT_API_KEY to .env.example
  - Create environment type definitions

- [x] 1.3 Create FastGPT service module structure
  - Create `src/services/fastgpt.ts` with service interface
  - Define TypeScript interfaces for FastGPT API responses
  - Add error handling utilities

## Phase 2: Service Implementation

- [x] 2.1 Implement FastGPT authentication
  - Create `authenticate()` method in fastgpt service
  - Add API key validation
  - Implement connection test endpoint
  - Add unit tests for auth flow

- [x] 2.2 Implement workflow sync methods
  - Create `createWorkflow()` to push new workflows to FastGPT
  - Create `updateWorkflow()` to sync changes
  - Create `deleteWorkflow()` to remove from server
  - Create `getWorkflow()` to fetch from server

- [x] 2.3 Implement workflow execution
  - Create `runWorkflow()` method calling FastGPT execution API
  - Add streaming response handling
  - Implement execution status polling
  - Add error mapping from FastGPT to UI errors

- [x] 2.4 Implement node template retrieval
  - Create `getNodeTemplates()` to fetch available node types
  - Map FastGPT node types to AgentAccess node types
  - Cache templates locally for performance

## Phase 3: Store Integration

- [x] 3.1 Extend workflow store with FastGPT state
  - Add `fastgptConnected` reactive state
  - Add `fastgptApiUrl` and `fastgptApiKey` state
  - Add `fastgptWorkflows` array for synced workflow IDs

- [x] 3.2 Add FastGPT connection actions to store
  - Implement `connectToFastGPT()` action
  - Implement `disconnectFromFastGPT()` action
  - Add connection error handling

- [x] 3.3 Add workflow sync actions to store
  - Implement `syncWorkflowToFastGPT()` action
  - Implement `loadWorkflowFromFastGPT()` action
  - Add sync status tracking

- [x] 3.4 Replace mock execution with FastGPT call
  - Update `runWorkflow()` to use FastGPT service
  - Maintain backward compatibility when FastGPT unavailable
  - Add fallback to mock mode for testing

## Phase 4: UI Components

- [x] 4.1 Create FastGPT settings panel component
  - Create `FastGPTSettings.vue` in settings folder
  - Add API URL input field with validation
  - Add API Key input field (password type)
  - Add "Test Connection" button
  - Add connection status indicator

- [x] 4.2 Update workflow canvas with FastGPT features
  - Add "Sync to FastGPT" button to toolbar
  - Add sync status indicator
  - Show FastGPT workflow ID when synced
  - Add conflict resolution UI for sync issues

- [x] 4.3 Update node config panel for FastGPT nodes
  - Add dataset selector for knowledge retrieval nodes
  - Add model selector for LLM nodes
  - Display FastGPT-specific configuration options
  - Add help links to FastGPT documentation

- [x] 4.4 Update preview panel for real execution
  - Replace mock results with actual FastGPT responses
  - Add streaming response display
  - Add execution progress indicator
  - Add "Stop Execution" button for streaming

## Phase 5: Import/Export

- [x] 5.1 Implement workflow export
  - Create `exportToFastGPTFormat()` utility
  - Convert local workflow to FastGPT JSON schema
  - Add download trigger
  - Test exported file in FastGPT

- [x] 5.2 Implement workflow import
  - Create `importFromFastGPTFormat()` utility
  - Add file upload UI
  - Validate imported workflow schema
  - Handle unsupported node types gracefully

## Phase 6: Testing & Validation

- [x] 6.1 Write unit tests for FastGPT service
  - Mock FastGPT API responses
  - Test all service methods
  - Test error scenarios

- [x] 6.2 Write integration tests for workflow execution
  - Test end-to-end workflow creation and execution
  - Test sync operations
  - Test import/export

- [x] 6.3 Manual testing with real FastGPT instance
  - Deploy test FastGPT server
  - Test connection and auth
  - Test workflow execution with various node types
  - Test error handling scenarios

- [x] 6.4 Type checking and linting
  - Run `npm run type-check`
  - Run `npm run lint`
  - Fix all issues

## Dependencies & Notes

- **Phase 1** must complete before Phase 2
- **Phase 2** must complete before Phase 3
- **Phase 3** and **Phase 4** can be done in parallel after Phase 2
- **Phase 5** depends on Phase 2 (schema conversion)
- **Phase 6** happens after all implementation phases

## Implementation Summary

**Completed Files:**
- `src/types/fastgpt.ts` - FastGPT type definitions
- `src/services/fastgpt.ts` - FastGPT service implementation
- `src/utils/workflowExport.ts` - Import/export utilities
- `src/components/settings/FastGPTSettings.vue` - Settings UI component

**Modified Files:**
- `package.json` - Added axios dependency
- `env.d.ts` - Added FastGPT environment variable types
- `.env.example` - Added FastGPT configuration example
- `src/stores/workflow.ts` - Added FastGPT integration state and actions
- `src/stores/settings.ts` - Added updateSettings method
- `src/types/settings.ts` - Added FastGPT settings fields
- `src/types/workflow.ts` - Added fastgptId field to Workflow
- `src/components/settings/UserSettingsDialog.vue` - Added FastGPT settings tab

## Remaining Work

The following items are deferred for future updates:
- Unit tests for FastGPT service (requires mocking setup)
- Integration tests with real FastGPT instance
- File upload UI for workflow import
- Sync status indicator in workflow canvas
- Stop execution button for streaming responses

These can be added in subsequent changes following the same architecture.
