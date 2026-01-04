# AgentAccessDemo

<div align="center">

一个功能强大的 AI Agent 管理平台Demo，提供统一的访问控制、工作流编辑器、工具管理和知识库集成。

[在线演示](https://rickyrelive.github.io/agentAccess/) • [快速开始](#快速开始) • [功能特性](#功能特性)

</div>

---

## ✨ 功能特性

### 🔐 Access 会话管理
- 支持创建和管理多个 AI Agent 会话
- 灵活的会话配置和模板系统
- 实时会话状态监控

### 📋 Access 模板
- 预置多种场景模板（个人、团队、公开）
- 支持自定义模板创建和分享
- 模板权限管理和访问控制

### 🔄 AgentFlow 工作流
- 可视化工作流编辑器
- 拖拽式节点连接
- 支持多种节点类型（输入、LLM 调用、数据处理、条件分支等）
- 工作流测试和调试功能
- 支持 FastGPT 工作流导入

### 🛠️ 工具管理
#### MCP Tools
- 内置工具库集成
- 自定义第三方工具配置
- 工具状态监控和管理
- 支持 npx/uvx 镜像导入
- OpenAPI 规范自动生成工具

#### MCP Gateways
- 统一 API 网关管理
- 负载均衡配置
- 健康检查和故障转移
- 网关性能监控

#### Sandbox 沙箱环境
- 代码解释器（Python、JavaScript）
- Browser 自动化
- 终端命令执行
- 资源使用监控

#### Memory 记忆管理
- 多个记忆库创建和管理
- 记忆导入/导出
- 记忆检索和召回率统计

#### 📚 知识库
- 文本导入支持
- Excel/CSV 表格导入
- 数据库连接导入
- 向量化嵌入配置
- 知识库检索和测试

---

## 📸 界面预览

### Access 会话
![Access 会话](.assert/new_access.png)

### Access 模板管理
![Access 模板](.assert/access_template.png)

### AgentFlow 工作流编辑器
![工作流编辑](.assert/agentflow.png)

### MCP 工具管理
![MCP 工具](.assert/mcptools.png)

### MCP 网关管理
![MCP 网关](.assert/mcpgateway.png)

### 沙箱环境
![沙箱环境](.assert/Sandbox.png)

### 记忆管理
![记忆管理](.assert/memory.png)

### 知识库
![知识库](.assert/kb.png)

---

## 🔧 配置说明

### 模型提供商配置

在 **设置 > 模型配置** 中添加您的 API Provider：

- **OpenAI**: 需要 API Key 和 Base URL
- **Anthropic**: 需要 API Key
- **Ollama**: 本地部署的 Ollama 地址
- **自定义**: 支持兼容 OpenAI API 的任何服务

### MCP 工具配置

支持多种方式添加 MCP 工具：

1. **官方商店导入**: 从预置工具库直接导入
2. **自定义第三方工具**: 配置 URL 和认证信息
3. **镜像导入**: 从 npx 或 uvx 仓库导入
4. **OpenAPI 导入**: 上传 JSON/YAML 规范自动生成

### 知识库配置

支持多种数据源导入：

- **文本文件**: txt, md, pdf 等
- **电子表格**: Excel, CSV
- **数据库**: MySQL, PostgreSQL 等关系型数据库

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

<div align="center">

**Built with ❤️ by Ricky**

</div>
