# 数据存储流程调试指南

## 🔍 步骤调试流程

请在Safari浏览器控制台中按顺序执行以下步骤，并观察每一步的输出：

### 步骤1: 清理所有数据
```javascript
console.log('🧹 步骤1: 清理所有数据')
localStorage.clear()
sessionStorage.clear()
console.log('✅ 所有存储已清理')
```

### 步骤2: 检查当前状态
```javascript
console.log('📊 步骤2: 检查当前状态')
console.log('settingsStore:', settingsStore)
console.log('providers count:', settingsStore.providers.length)
console.log('isInitialized:', settingsStore.isInitialized)
```

### 步骤3: 强制重新初始化
```javascript
console.log('🚀 步骤3: 强制重新初始化')
settingsStore.isInitialized = false
settingsStore.isLoading = false
await settingsStore.initialize()
```

### 步骤4: 检查初始化结果
```javascript
console.log('📋 步骤4: 检查初始化结果')
console.log('providers after init:', settingsStore.providers)
console.log('providers count:', settingsStore.providers.length)
console.log('selectedProviderId:', settingsStore.selectedProviderId)
```

### 步骤5: 手动创建默认提供商
```javascript
console.log('🏭 步骤5: 手动创建默认提供商')
const defaultProvider = settingsStore.createDefaultProvider()
console.log('Created provider:', defaultProvider)
await settingsStore.addProvider(defaultProvider)
console.log('Provider added to store')
```

### 步骤6: 检查存储状态
```javascript
console.log('💾 步骤6: 检查存储状态')
settingsStore.logStorageInfo()

// 手动检查DB服务
console.log('DB service initialized:', !!dbService.db)
console.log('Trying to get providers from DB:')
try {
  const dbProviders = await dbService.getModelProviders()
  console.log('DB providers:', dbProviders)
} catch (e) {
  console.error('DB get providers error:', e)
}
```

### 步骤7: 强制保存
```javascript
console.log('💾 步骤7: 强制保存')
try {
  await dbService.saveModelProvider(defaultProvider)
  console.log('✅ Provider saved to DB')
} catch (e) {
  console.error('❌ Save failed:', e)
}
```

### 步骤8: 验证保存结果
```javascript
console.log('🔍 步骤8: 验证保存结果')
settingsStore.logStorageInfo()

// 检查localStorage中的DB数据
const dbData = localStorage.getItem('agentaccess-db')
if (dbData) {
  console.log('DB data size:', dbData.length, 'bytes')
  console.log('DB data preview:', dbData.substring(0, 100) + '...')
} else {
  console.log('❌ No DB data found in localStorage')
}
```

### 步骤9: 模拟页面刷新
```javascript
console.log('🔄 步骤9: 模拟页面刷新')
// 重置状态
settingsStore.providers = []
settingsStore.selectedProviderId = ''
settingsStore.isInitialized = false

// 重新初始化
await settingsStore.initialize()

console.log('📋 After refresh simulation:')
console.log('providers count:', settingsStore.providers.length)
console.log('selectedProviderId:', settingsStore.selectedProviderId)
```

### 步骤10: 深度调试
```javascript
console.log('🔬 步骤10: 深度调试')

// 检查SQL.js加载
console.log('SQL.js available:', typeof initSqlJs)

// 检查数据库创建
try {
  const SQL = await initSqlJs()
  const testDb = new SQL.Database()
  testDb.run('CREATE TABLE test (id INTEGER)')
  testDb.run('INSERT INTO test (id) VALUES (1)')
  const result = testDb.exec('SELECT * FROM test')
  console.log('SQL.js test result:', result)
  testDb.close()
} catch (e) {
  console.error('SQL.js test failed:', e)
}
```

## 🎯 预期结果

如果一切正常，你应该看到：
1. ✅ 清理成功
2. ✅ 初始化后创建默认提供商
3. ✅ 提供商保存到DB
4. ✅ localStorage中存在agentaccess-db数据
5. ✅ 刷新模拟后数据仍然存在

## ❓ 如果失败，请报告：

1. 哪个步骤失败了？
2. 具体的错误信息是什么？
3. localStorage中有什么数据？
4. Safari版本是多少？

## 🔧 快速修复命令

如果需要快速清理并重新开始：
```javascript
// 清理并重启
localStorage.clear()
sessionStorage.clear()
location.reload()
```