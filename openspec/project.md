# Project Context

## Purpose
AgentAccess - A web-based AI agent management and interaction platform. The project provides a unified interface for managing AI agents, configuring workflows, integrating knowledge bases, and leveraging Model Context Protocol (MCP) services for enhanced AI capabilities.

## Tech Stack
- **Frontend**: Vue 3 + TypeScript + Vite
- **State Management**: Pinia
- **Styling**: Tailwind CSS + tailwind-scrollbar
- **Routing**: Vue Router
- **Build Tool**: Vite
- **Testing**: Vitest + Vue Test Utils
- **Linting**: ESLint + Prettier
- **Specification Framework**: OpenSpec

## Project Conventions

### Code Style
- Follow TypeScript best practices with strict type checking
- Use Vue 3 Composition API (`<script setup>`)
- Use kebab-case for component file names (`MyComponent.vue`)
- Use PascalCase for TypeScript interfaces and types
- Use camelCase for variables and functions
- Verb-led naming for change IDs (add-, update-, remove-, refactor-)

### Architecture Patterns
- Specification-driven development using OpenSpec
- Component-based architecture with Vue 3
- Centralized state management with Pinia stores
- Three-stage workflow: Creating Changes → Implementing Changes → Archiving Changes
- Delta-based specification management

### Directory Structure
```
agentaccess-frontend/
├── src/
│   ├── api/           # API client modules
│   ├── assets/        # Static assets (images, styles)
│   ├── components/    # Reusable Vue components
│   ├── router/        # Vue Router configuration
│   ├── stores/        # Pinia state stores
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions
│   ├── views/         # Page-level components
│   └── main.ts        # Application entry point
├── public/            # Public static files
└── package.json       # Dependencies and scripts
```

### Testing Strategy
- Write unit tests for components using Vitest
- Test user interactions and state changes
- Run `npm run test:unit` to execute tests
- Type-check with `npm run type-check`
- Validate specifications with `openspec validate --strict`

### Git Workflow
- Feature-based development with OpenSpec proposals
- Use `/openspec:proposal` to create new change proposals
- Use `/openspec:apply` to implement approved changes
- Use `/openspec:archive` to archive deployed changes
- Maintain clean commit history

## Domain Context

### Core Concepts
- **Agents**: AI assistants that can be specialized for different tasks (writing, analysis, finance, etc.)
- **Conversations**: Chat sessions between users and AI agents
- **Knowledge Bases**: Domain-specific data repositories for grounding AI responses
- **Workflows**: Visual question-answering pipelines with configurable nodes
- **MCP Services**: Model Context Protocol services for extending AI capabilities

### UI Architecture
- **Three-Column Layout**: Left navigation sidebar, central content area, right settings panel
- **Home Page**: Dashboard showing current conversation, recent history, and available agents
- **Chat Interface**: Real-time conversation interface with streaming responses
- **Workflow Editor**: Visual drag-and-drop editor for creating QA workflows
- **Settings Panel**: Configuration interface for MCP services and user preferences

## Important Constraints
- All changes must have proposals before implementation
- Requirements MUST have at least one scenario
- Use SHALL/MUST for normative requirements
- Keep changes simple and focused
- Maintain type safety across the codebase
- Ensure responsive design for different screen sizes

## Development Commands

### Frontend Development
```bash
cd agentaccess-frontend
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run test:unit    # Run unit tests
npm run type-check   # Type-check TypeScript
npm run lint         # Run ESLint
npm run format       # Format with Prettier
```

### OpenSpec Commands
```bash
openspec list                # List all changes
openspec list --specs        # List all specifications
openspec show <change-id>    # Show change details
openspec validate --strict   # Validate specifications
/openspec:proposal           # Create new change proposal
/openspec:apply              # Implement approved change
/openspec:archive            # Archive deployed change
```

## External Dependencies
- **OpenSpec CLI**: For specification management
- **Claude Code CLI**: For AI-assisted development
- **Node.js**: ^20.19.0 || >=22.12.0
- **npm**: For package management
