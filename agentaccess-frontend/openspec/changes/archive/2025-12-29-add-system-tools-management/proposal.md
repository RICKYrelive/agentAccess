# Proposal: Add System Tools Management

## Summary
Add a new "System Tools" (系统工具) main menu item with two sub-pages: Sandboxed Environments (沙箱环境) and Built-in Tools (内置工具). This feature allows users to manage sandboxed execution environments and import/enable built-in tools from an official store.

## Motivation
Currently, the platform lacks a centralized way to manage sandboxed execution environments and built-in tools. Users need:
1. A way to create and manage different types of sandboxed environments (Python, Node.js, etc.)
2. Ability to run multiple instances of each sandbox type
3. Monitor resource usage (CPU, memory, disk) across all sandboxes
4. Import and enable/disable built-in tools from an official store

## Proposed Solution

### 1. Navigation Structure
- Add "System Tools" (系统工具) as a new expandable section in the sidebar
- Two sub-menu items:
  - Sandboxed Environments (沙箱环境)
  - Built-in Tools (内置工具)

### 2. Sandboxed Environments Page
Layout (similar to MCP Tools page):
- **Top**: Page header with title and "Create Sandbox" button
- **Middle**: Status cards showing:
  - Total sandbox types count
  - Total running instances count
  - Resource usage percentage (CPU + Memory + Disk)
- **Bottom**: Sandbox cards, each showing:
  - Sandbox name
  - Sandbox status (running/stopped/error)
  - Instance count
  - Delete button

### 3. Built-in Tools Page
Layout:
- **Top**: Page header with title and "Import from Store" button
- **Bottom**: Built-in tool cards with enable/disable toggle

### 4. Official Store Dialog
- **Top**: Search bar to filter all available sandbox images and built-in tools
- **Content**: Compact list layout showing:
  - Icon/Thumbnail
  - Name
  - Description
  - Install/Import button

## User Stories
1. As a user, I want to create multiple sandbox instances of different types (Python, Node.js, etc.)
2. As a user, I want to monitor resource usage across all my sandboxes
3. As a user, I want to easily import and enable built-in tools from an official store
4. As a user, I want to search and discover new sandbox images and tools

## Success Criteria
- Users can create and manage multiple sandbox environments
- Users can monitor CPU, memory, and disk usage across sandboxes
- Users can import built-in tools from the official store
- Official store dialog supports search and filtering
- All pages follow existing UI patterns (MCP Tools page as reference)
