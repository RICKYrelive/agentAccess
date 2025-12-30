# Change: Memory Management

## Why

Agents need long-term memory capabilities to maintain context across sessions, remember user preferences, and provide personalized experiences. Currently, the system lacks persistent memory storage, forcing agents to rely solely on conversation history which limits their effectiveness for multi-session workflows.

## What Changes

- Add Memory (记忆库) navigation item to main sidebar (no sub-menu)
- Create Memory Management page with status overview (total memories, active memories, 1-hour retrieval recall rate chart)
- Implement CRUD operations for memory bases (create, import, export, edit, delete)
- Support multiple memory strategies: summarization, user preferences, custom prompts
- Integrate with mem0 API for long-term memory storage and retrieval
- Display memory base list with name, description, UUID, status, strategy count, and action buttons

## Impact

- Affected specs: `memory-management` (new spec)
- Affected code:
  - New components: `MemoryPage.vue`, `MemoryStatusCards.vue`, `MemoryCard.vue`, `CreateMemoryBaseDialog.vue`, `ImportExportDialog.vue`
  - New store: `stores/memory.ts`
  - New types: `components/memory-management/types.ts`
  - Modified: Navigation sidebar to add Memory menu item
