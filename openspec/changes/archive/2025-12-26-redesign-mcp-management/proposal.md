# Proposal: redesign-mcp-management

## Summary

重新设计 MCP 工具菜单为"MCP 管理"，包含两个子页面：1) MCP 工具 - 管理内置和自定义 MCP 工具；2) MCP 网关 - 管理网关部署和 OpenAPI 导入。

## Motivation

当前应用的 MCP 工具只是一个简单的侧边栏展开菜单，没有独立的管理页面。用户无法：
1. 方便地浏览和导入内置 MCP 工具
2. 配置和管理自定义第三方 MCP 工具（需要 URL、认证）
3. 部署 npx/uvx 类型的 MCP 镜像
4. 创建和管理 MCP 网关
5. 通过 OpenAPI 文件一键导入 API 封装成 MCP 调用

## Proposed Solution

### 1. 菜单结构变更

将侧边栏中的"MCP 工具"菜单改名为"MCP 管理"，并添加两个子菜单：
- **MCP 工具**：管理内置和自定义 MCP 工具
- **MCP 网关**：管理网关部署和 API 封装

### 2. MCP 工具页面

#### 页面结构
- **顶部**：标题 "MCP 工具管理"
- **中间**：创建 MCP 工具区域，包含三种创建方式
- **底部**：现有 MCP 工具列表（卡片形式）

#### 创建 MCP 工具的三种方式

1. **从官方商店导入内置 MCP 工具**
   - 提供工具列表选择器
   - 显示工具名称、描述、分类
   - 一键启用/禁用

2. **自定义第三方 MCP 工具**
   - 配置工具名称、描述
   - 配置 MCP 服务器 URL
   - 配置认证方式（API Key、Bearer Token、无认证）
   - 测试连接功能

3. **导入 Node/Python 软件站的 MCP 镜像**
   - 支持 `npx` 和 `uvx` 命令
   - 输入包名和版本
   - 显示镜像信息（作者、描述、版本）
   - 平台自动部署

#### MCP 工具卡片显示
- 工具名称和图标
- 类型标签（内置/自定义/镜像）
- 状态指示（已启用/已禁用/连接失败）
- 操作按钮（编辑、删除、启用/禁用）

### 3. MCP 网关页面

#### 页面结构
- **顶部**：标题 "MCP 网关管理"，创建网关按钮
- **中间**：网关创建/编辑表单（模态框）
- **底部**：网关列表（表格形式）

#### 创建网关功能
- 网关名称
- 网关描述
- 关联的 MCP 工具配置
- 基础 URL 配置

#### OpenAPI 文件导入功能
- 支持 YAML/JSON 格式的 OpenAPI 文件上传
- 自动解析 API 端点
- 一键生成 MCP 工具封装
- 显示生成的工具列表

#### 网关列表表格
- 网关名称
- 描述
- 关联 MCP 工具数量
- 状态（运行中/已停止）
- 操作按钮（编辑、删除、查看详情）

## Scope

### In Scope
- 侧边栏菜单结构变更
- MCP 工具管理页面
- MCP 网关管理页面
- 内置工具商店导入
- 自定义工具配置
- npx/uvx 镜像部署
- 网关 CRUD 操作
- OpenAPI 文件解析和导入
- 模态框和表单验证

### Out of Scope
- 实际的 MCP 服务器连接和调用（保持现有模拟实现）
- 真实的 npx/uvx 进程管理（仅配置界面）
- 真实的网关部署（仅配置界面）
- 网关的实时状态监控

## Dependencies

- 现有 Vue 3 + TypeScript 架构
- 现有侧边栏和视图切换机制
- 现有 MCP 类型定义 (`src/types/mcp.ts`)

## Impact on Existing Specifications

### MODIFIED Specifications
- `frontend`: 更新侧边栏菜单结构，添加两个新视图

### ADDED Capabilities
- `mcp-tool-management`: MCP 工具的 CRUD 操作和分类管理
- `mcp-gateway-management`: MCP 网关的 CRUD 操作和 OpenAPI 导入

## Success Criteria

1. 用户可以在侧边栏看到"MCP 管理"菜单和两个子菜单
2. 用户可以进入 MCP 工具页面并查看现有工具
3. 用户可以通过三种方式创建新的 MCP 工具
4. 用户可以编辑、删除、启用/禁用 MCP 工具
5. 用户可以进入 MCP 网关页面并查看现有网关
6. 用户可以创建新的 MCP 网关
7. 用户可以上传 OpenAPI 文件并自动生成 MCP 工具
8. 用户可以编辑、删除 MCP 网关
9. 所有操作都有适当的表单验证和错误提示
10. 页面响应式设计，与现有 UI 风格一致
