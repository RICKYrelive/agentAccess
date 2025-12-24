# Design: FastGPT Workflow Integration

## Overview
This design documents the integration of FastGPT's workflow engine into the AgentAccess frontend application. The integration uses FastGPT's JavaScript SDK to enable real workflow execution while maintaining the existing UI components and user experience.

## Architecture

### Current State
```
┌─────────────────────────────────────────────────────────────┐
│                      AgentAccess Frontend                    │
├─────────────────────────────────────────────────────────────┤
│  WorkflowCanvas.vue  │  NodeConfigPanel.vue  │ PreviewPanel  │
│         ↓            │           ↓            │      ↓       │
│  workflow.ts Store   │    workflow.ts         │              │
│         ↓            │           ↓            │              │
│  Simulated Execution (runWorkflow - mock implementation)     │
└─────────────────────────────────────────────────────────────┘
```

### Target State
```
┌─────────────────────────────────────────────────────────────┐
│                      AgentAccess Frontend                    │
├─────────────────────────────────────────────────────────────┤
│  WorkflowCanvas.vue  │  NodeConfigPanel.vue  │ PreviewPanel  │
│         ↓            │           ↓            │      ↓       │
│  workflow.ts Store   │    workflow.ts         │              │
│         ↓            │           ↓            │      ↓       │
│  FastGPT Service Layer (NEW)                             │
│         ↓                                                         │
│  FastGPT JavaScript SDK                                        │
│         ↓                                                         │
│  FastGPT Server (HTTP API)                                      │
└─────────────────────────────────────────────────────────────┘
```

## Component Design

### 1. FastGPT Service Module (`src/services/fastgpt.ts`)
A new service module that encapsulates all FastGPT SDK interactions:

```typescript
interface FastGPTService {
  // Workflow management
  createWorkflow(workflow: Workflow): Promise<string>
  updateWorkflow(id: string, workflow: Workflow): Promise<void>
  deleteWorkflow(id: string): Promise<void>
  getWorkflow(id: string): Promise<Workflow>

  // Workflow execution
  runWorkflow(id: string, input: string): Promise<WorkflowExecutionResult>

  // Node templates
  getNodeTemplates(): Promise<NodeTemplate[]>

  // Authentication
  authenticate(apiKey: string): Promise<void>
}
```

### 2. Node Type Mapping
Mapping existing AgentAccess node types to FastGPT node types:

| AgentAccess Node | FastGPT Node | Notes |
|------------------|--------------|-------|
| `start` | `StartNode` | Entry point |
| `annotated-data-retrieval` | `DatasetSearchNode` | Keyword/vector search |
| `question-rewrite` | `LLMNode` | Query rewriting |
| `knowledge-retrieval` | `DatasetSearchNode` | Hybrid search |
| `answer-generation` | `LLMNode` | Response generation |
| `end` | `EndNode` | Exit point |

### 3. Workflow Schema Translation
Transform between AgentAccess workflow format and FastGPT format:

```typescript
// AgentAccess format
interface Workflow {
  id: string
  name: string
  nodes: WorkflowNode[]
  connections: WorkflowConnection[]
  // ...
}

// FastGPT format (simplified)
interface FastGPTWorkflow {
  id: string
  name: string
  nodes: FastGPTNode[]
  edges: FastGPTEdge[]
}
```

## State Management Updates

### Enhanced workflow.ts Store
Add FastGPT integration state and actions:

```typescript
export const useWorkflowStore = defineStore('workflow', () => {
  // Existing state...

  // NEW: FastGPT integration state
  const fastgptConnected = ref(false)
  const fastgptApiUrl = ref('')
  const fastgptApiKey = ref('')
  const fastgptWorkflows = ref<string[]>([])

  // NEW: FastGPT actions
  const connectToFastGPT = async (apiUrl: string, apiKey: string) => {
    // Implementation
  }

  const syncWorkflowToFastGPT = async (workflowId: string) => {
    // Convert and sync
  }

  const runWorkflowOnFastGPT = async (input: string) => {
    // Replace mock execution
  }

  return {
    // Existing exports...
    fastgptConnected,
    connectToFastGPT,
    syncWorkflowToFastGPT,
    runWorkflowOnFastGPT
  }
})
```

## Configuration Management

### Environment Variables
```bash
# .env
VITE_FASTGPT_API_URL=http://localhost:3000
VITE_FASTGPT_API_KEY=your_api_key_here
```

### User Settings
Add FastGPT configuration to the settings panel:
- API Endpoint URL
- API Key (securely stored)
- Connection status indicator
- Test connection button

## Trade-offs and Decisions

### Decision 1: SDK vs Direct API
**Chosen**: FastGPT JavaScript SDK (when available) or direct HTTP API calls

**Rationale**:
- SDK provides type safety and abstraction
- Fallback to direct API ensures compatibility
- Easier to mock for testing

### Decision 2: Client-side vs Backend Proxy
**Chosen**: Direct client-side integration

**Rationale**:
- Simpler architecture for current scope
- FastGPT supports CORS configuration
- Reduces infrastructure complexity
- Future: Add backend proxy if security concerns arise

### Decision 3: Workflow Storage
**Chosen**: Dual storage (local IndexedDB + FastGPT server)

**Rationale**:
- Local storage enables offline editing
- FastGPT storage enables actual execution
- Sync mechanism keeps both in sync

## Migration Strategy

### Phase 1: Preparation
1. Add FastGPT SDK dependency
2. Create service module structure
3. Add configuration UI

### Phase 2: Integration
1. Implement authentication
2. Add workflow sync
3. Replace mock execution

### Phase 3: Enhancement
1. Add FastGPT-specific node types
2. Implement import/export
3. Add workflow templates

## Security Considerations

1. **API Key Storage**: Store encrypted in user settings, never in code
2. **CORS Configuration**: FastGPT server must allow frontend origin
3. **Input Validation**: Sanitize all user inputs before sending to FastGPT
4. **Error Handling**: Never expose FastGPT error details to end users

## Testing Strategy

1. **Unit Tests**: Mock FastGPT SDK responses
2. **Integration Tests**: Use FastGPT test server
3. **E2E Tests**: Full workflow creation and execution
4. **Manual Testing**: Connection with real FastGPT instance

## Open Questions

1. Should we support multiple FastGPT server connections?
2. How to handle workflow versioning between local and remote?
3. What is the fallback strategy when FastGPT is unavailable?
