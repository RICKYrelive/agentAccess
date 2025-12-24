# Change: Integrate FastGPT Workflow Engine

## Why
The current workflow implementation in AgentAccess uses a simulated execution engine that only returns mock results. To provide actual AI-powered workflow capabilities, the system needs to integrate with FastGPT, an open-source LLM application development platform that provides workflow orchestration, node execution, and knowledge base integration.

## What Changes
- Integrate FastGPT JavaScript SDK into the Vue.js frontend
- Replace simulated workflow execution with actual FastGPT API calls
- Map existing workflow node types to FastGPT node templates
- Implement workflow sync between local state and FastGPT backend
- Add workflow import/export functionality for FastGPT compatibility
- Update workflow editor UI to support FastGPT-specific features

## Impact
- Affected specs: `fastgpt-workflow` (new capability)
- Enables real AI workflow execution through FastGPT engine
- Maintains backward compatibility with existing workflow UI
- Requires FastGPT server deployment or cloud service connection
- Adds new dependency: @fastgpt/sdk (or equivalent FastGPT client library)
