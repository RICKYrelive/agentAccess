# API连接测试指南

## 问题诊断

你遇到的"Load failed"错误通常是由以下原因之一引起的：

### 1. API Key问题
默认配置的MiniMax API Key可能已过期或无效。

### 2. 网络连接问题
CORS、防火墙或网络连接问题。

### 3. API端点问题
服务提供商的API可能暂时不可用。

## 解决方案

### 方案1：使用自己的API Key（推荐）

1. **获取DeepSeek API Key**:
   - 访问 https://platform.deepseek.com/
   - 注册并获取API Key
   - 每个新用户通常有免费额度

2. **在应用中配置**:
   - 打开 http://localhost:5173/
   - 点击右侧设置按钮
   - 切换到"模型提供商"选项卡
   - 选择"DeepSeek V3 (备用)"
   - 点击编辑按钮，填入你的API Key
   - 点击激活按钮

### 方案2：使用其他OpenAI兼容的服务

1. **OpenAI官方API**:
   ```
   名称: OpenAI GPT-4
   类型: OpenAI
   Base URL: https://api.openai.com/v1
   API Key: sk-your-openai-key
   模型: gpt-4 或 gpt-3.5-turbo
   ```

2. **其他服务选项**:
   - **智谱AI**: Base URL: `https://open.bigmodel.cn/api/paas/v4`
   - **月之暗面**: Base URL: `https://api.moonshot.cn/v1`
   - **Silicon Flow**: Base URL: `https://api.siliconflow.cn/v1`

### 方案3：测试当前配置

1. 打开浏览器开发者工具（F12）
2. 切换到Console标签
3. 尝试发送消息
4. 查看详细的错误日志信息

## 详细步骤

### 立即测试连接

1. 访问 http://localhost:5173/
2. 点击设置按钮（齿轮图标）
3. 选择"模型提供商"选项卡
4. 点击默认MiniMax提供商旁的⚡按钮测试连接
5. 查看测试结果

### 添加新的API提供商

1. 点击"添加模型提供商"按钮
2. 填入配置信息：
   - 名称：自定义名称
   - 类型：OpenAI
   - Base URL：API服务地址
   - API Key：你的API密钥
   - 模型：模型名称
3. 保存后点击⚡按钮测试连接
4. 连接成功后点击激活按钮

## 故障排除

### 检查网络连接
```bash
curl -I https://www.aiping.cn/api/v1/chat/completions
```

### 检查API Key有效性
- 确认API Key没有过期
- 确认账户有足够的余额
- 确认API权限正确

### 检查CORS设置
- 如果使用自定义API端点，确保CORS设置正确
- API服务器需要允许来自 `http://localhost:5173` 的请求

## 获取帮助

如果仍然遇到问题：

1. 查看浏览器控制台的详细错误信息
2. 确认API配置正确
3. 尝试不同的API提供商
4. 检查网络和防火墙设置

## 推荐的免费/低成本选择

1. **DeepSeek** - 新用户有免费额度
2. **智谱AI** - 提供免费试用
3. **本地模型** - 使用Ollama运行本地模型（需要较强硬件）

选择适合你需求和预算的方案即可。