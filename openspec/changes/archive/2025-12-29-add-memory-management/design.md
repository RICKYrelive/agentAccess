# Memory Management Design

## Context

The Memory feature provides long-term memory storage for agents using mem0, an open-source memory framework. The system allows users to create multiple memory bases, each with different strategies for memory capture and retrieval. Memory bases are isolated from each other, allowing different agents or workflows to have separate memory contexts.

## Goals / Non-Goals

**Goals:**
- Provide persistent long-term memory storage across agent sessions
- Support multiple memory strategies (summarization, user preferences, custom prompts)
- Enable memory base CRUD operations (create, import, export, edit, delete)
- Display recall rate metrics to evaluate memory retrieval effectiveness
- Follow MCP Tools page layout pattern for consistency

**Non-Goals:**
- Real-time memory synchronization (will be added in future iteration)
- Memory sharing between users (each user has isolated memory bases)
- Advanced memory analytics beyond recall rate (future enhancement)

## Decisions

### Memory Storage Backend
**Decision:** Use mem0 API for memory storage and retrieval.

**Rationale:**
- mem0 is specifically designed for AI agent memory management
- Provides built-in memory retrieval with relevance scoring
- Supports multiple memory categories (user, session, agent)
- Has Python/JavaScript SDKs for easy integration

**Alternatives considered:**
- **Vector database (Pinecone, Weaviate):** More complex setup, requires manual embedding management
- **PostgreSQL with pgvector:** Good for structured data but less specialized for AI memory
- **Redis:** Fast but not optimized for semantic search

### Memory Strategy Types
**Decision:** Support three strategy types with different prompt templates.

1. **Summarization (总结归纳):** Compresses conversation history into key insights
2. **User Preferences (用户偏好):** Extracts and stores user-specific preferences and patterns
3. **Custom Prompt (自定义提示):** Allows users to define custom memory capture logic

**Rationale:**
- Summarization reduces token usage while preserving key information
- User preferences enable personalization across sessions
- Custom prompt provides flexibility for advanced use cases

### Recall Rate Calculation
**Decision:** Track retrieval success rate over 1-hour rolling window.

**Rationale:**
- 1-hour window provides meaningful short-term feedback
- Rolling average smooths out temporary fluctuations
- Simple metric that users can understand

**Formula:**
```
Recall Rate = (Successful Retrievals / Total Retrieval Attempts) × 100%
```

A retrieval is "successful" if the returned memory has a relevance score > 0.5.

### Navigation Structure
**Decision:** Memory as a top-level menu item without sub-menu.

**Rationale:**
- User explicitly requested no sub-menu
- Single page with all functionality inline
- Consistent with System Tools (沙箱环境, 内置工具) pattern

## Data Model

### MemoryBase
```typescript
interface MemoryBase {
  id: string                    // UUID
  name: string                  // User-defined name
  description: string           // User-defined description
  status: 'active' | 'inactive' // Active bases are available for agents
  strategy: MemoryStrategy      // How memories are captured
  memoryCount: number           // Total memories stored
  lastUsedAt: Date              // Last retrieval timestamp
  createdAt: Date
  updatedAt: Date
}
```

### MemoryStrategy
```typescript
interface MemoryStrategy {
  type: 'summarization' | 'user-preferences' | 'custom-prompt'
  prompt?: string              // Custom prompt template (for custom-prompt type)
  config: {
    maxMemories: number        // Max memories to retrieve per query
    similarityThreshold: number // Minimum relevance score (0-1)
  }
}
```

### RecallMetrics
```typescript
interface RecallMetrics {
  memoryBaseId: string
  timestamp: Date
  recallRate: number           // Percentage
  totalRetrievals: number
  successfulRetrievals: number
}
```

## API Integration

### mem0 Client Setup
```typescript
import { MemoryClient } from 'mem0ai'

const memoryClient = new MemoryClient({
  apiKey: process.env.MEM0_API_KEY,
  baseURL: process.env.MEM0_BASE_URL || 'https://api.mem0.ai'
})
```

### Key Operations
```typescript
// Add memory
await memoryClient.add(memoryBaseId, {
  content: "User prefers concise responses",
  metadata: { strategy: 'user-preferences' }
})

// Retrieve memories
const results = await memoryClient.getAll(memoryBaseId, {
  limit: strategy.config.maxMemories,
  threshold: strategy.config.similarityThreshold
})

// Export memory base
const memories = await memoryClient.getAll(memoryBaseId, { limit: -1 })

// Import memory base
for (const memory of importData.memories) {
  await memoryClient.add(memoryBaseId, memory)
}
```

## UI Components

### Page Layout (MemoryPage.vue)
```
┌─────────────────────────────────────────────────────┐
│ Page Header (Title + Description + Actions)        │
├─────────────────────────────────────────────────────┤
│ Status Overview (3 cards)                          │
│ - Total Memories - Active Memories - Recall Rate   │
├─────────────────────────────────────────────────────┤
│ Action Buttons (Create, Import, Export)            │
├─────────────────────────────────────────────────────┤
│ Memory Base List (Cards)                           │
│ - MemoryBaseCard repeated for each base            │
└─────────────────────────────────────────────────────┘
```

### Status Cards (MemoryStatusCards.vue)
- Card 1: Total Memories (all memory bases combined)
- Card 2: Active Memory Bases (count)
- Card 3: 1-Hour Recall Rate (line chart showing trend)

### Memory Base Card (MemoryCard.vue)
```
┌─────────────────────────────────────────────────────┐
│ [Icon] Memory Name            [Active/Inactive]    │
│        Description                                   │
│        UUID: xxx-xxx-xxx                             │
│        Strategies: 3    [Edit] [Delete]             │
└─────────────────────────────────────────────────────┘
```

## Risks / Trade-offs

### Risk: mem0 API Availability
**Risk:** mem0 is a relatively new service; API downtime could break memory functionality.
**Mitigation:**
- Implement exponential backoff for API failures
- Cache frequently accessed memories locally
- Show clear error messages when API is unavailable

### Risk: Memory Recall Accuracy
**Risk:** Poor recall rate if similarity threshold is too high or memory capture is ineffective.
**Mitigation:**
- Provide default thresholds based on mem0 best practices
- Allow users to adjust strategy config
- Show recall metrics prominently for visibility

### Trade-off: Import/Export Format
**Decision:** Export as JSON array of memory objects.
**Trade-off:**
- Pro: Simple, human-readable, easy to version control
- Con: Large memory bases may produce huge files
- Future: Consider adding compressed/optimized export format

## Migration Plan

**Phase 1:** Initial implementation (this change)
- Create UI components
- Implement mem0 integration
- Support basic CRUD operations

**Phase 2:** Enhanced analytics
- Add detailed recall rate breakdowns
- Memory usage trends over time
- Strategy effectiveness comparison

**Phase 3:** Advanced features
- Memory sharing between users (optional)
- Memory base templates
- Bulk memory operations

**Rollback:**
- If mem0 integration fails, UI can fall back to mock data
- No database schema changes (external API)
- Navigation item can be hidden via feature flag

## Open Questions

1. **Memory Base Permissions:** Should memory bases be scoped per-user or shared across organization?
   - Initial: Per-user (simpler)
   - Future: Org-level sharing with permissions

2. **Retention Policy:** Should memories expire after a certain time?
   - Initial: No expiration (user manually deletes)
   - Future: Configurable retention per strategy

3. **Recall Rate Chart Granularity:** Should the chart show data points per minute, per 5 minutes, or per hour?
   - Initial: 5-minute intervals for 1-hour window
   - Adjust based on user feedback
