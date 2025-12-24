# 数据存储问题诊断和修复指南

## 🔍 问题症状
- 刷新页面后模型提供商配置丢失
- 设置数据无法持久化保存

## 🔧 快速诊断步骤

### 1. 检查浏览器控制台
1. 打开 http://localhost:5173/
2. 按 F12 打开开发者工具
3. 查看 Console 标签页的错误信息
4. 寻找以下关键词：
   - `localStorage`
   - `SQL.js`
   - `Database`
   - `Quota exceeded`

### 2. 手动检查localStorage
在浏览器控制台中执行以下命令：

```javascript
// 检查数据库是否存在
console.log('Database exists:', !!localStorage.getItem('agentaccess-db'))

// 检查备份数据库是否存在
console.log('Backup exists:', !!localStorage.getItem('agentaccess-db-backup'))

// 查看数据库大小
const dbData = localStorage.getItem('agentaccess-db')
if (dbData) {
  console.log('Database size:', dbData.length, 'bytes')
}

// 列出所有localStorage项目
console.log('All localStorage items:')
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i)
  console.log(`- ${key}:`, localStorage.getItem(key)?.length, 'bytes')
}
```

## 🛠️ 修复方案

### 方案1：清理并重新初始化
在浏览器控制台执行：

```javascript
// 清理所有相关数据
localStorage.removeItem('agentaccess-db')
localStorage.removeItem('agentaccess-db-backup')

// 重新加载页面
location.reload()
```

### 方案2：检查存储配额
执行以下命令检查存储限制：

```javascript
// 检查存储配额
if ('storage' in navigator && 'estimate' in navigator.storage) {
  navigator.storage.estimate().then(estimate => {
    console.log('Storage quota:', estimate.quota / 1024 / 1024, 'MB')
    console.log('Storage usage:', estimate.usage / 1024 / 1024, 'MB')
  })
}
```

### 方案3：手动创建测试数据
如果自动创建失败，可以手动创建：

```javascript
// 创建简单的测试配置
const testProvider = {
  id: 'test-provider',
  name: 'Test Provider',
  type: 'openai',
  baseUrl: 'https://api.openai.com/v1',
  apiKey: 'test-key',
  model: 'gpt-3.5-turbo',
  maxTokens: 4000,
  temperature: 0.7,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
}

// 保存到localStorage（临时测试用）
localStorage.setItem('test-provider', JSON.stringify(testProvider))
console.log('Test provider saved')
```

## 🚨 常见问题

### 1. "Quota exceeded" 错误
**原因**: localStorage容量超出限制（通常5-10MB）
**解决**: 清理不必要的localStorage项目

### 2. "SQL.js加载失败"错误
**原因**: CDN无法访问
**解决**: 检查网络连接，使用本地SQL.js文件

### 3. 数据格式错误
**原因**: 数据序列化/反序列化失败
**解决**: 清理损坏的数据，重新初始化

### 4. 隐私模式限制
**原因**: 浏览器隐私模式限制localStorage
**解决**: 使用普通模式浏览

## 🔄 恢复步骤

1. **备份数据**：如果还有其他重要数据，先备份
2. **清理损坏数据**：删除相关的localStorage项目
3. **刷新页面**：让应用重新初始化
4. **重新配置**：添加你的模型提供商配置
5. **测试持久化**：刷新页面验证配置是否保存

## 📞 长期解决方案

考虑以下改进：

1. **使用IndexedDB**: 更大容量，更好的性能
2. **云端同步**: 将配置保存到云端
3. **导出/导入功能**: 允许用户备份配置
4. **多存储策略**: 同时使用多种存储方式

## 🎯 立即测试

完成上述步骤后：

1. 添加一个模型提供商
2. 刷新页面（F5）
3. 检查配置是否仍然存在
4. 如果仍然丢失，查看控制台错误信息

如果问题持续存在，请提供浏览器控制台中的具体错误信息。