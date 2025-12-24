// 🪄 Debug Script for Model Provider Issues
// 使用方法：在Safari浏览器控制台中复制粘贴整个脚本并执行

console.log('🚀 开始模型提供商插入调试流程...')

async function debugModelProviderInsertion() {
  console.log('='.repeat(60))
  console.log('📊 步骤 1: 检查当前状态')
  console.log('='.repeat(60))

  // 检查stores
  console.log('🔍 Settings Store状态:')
  console.log('- initialized:', window.settingsStore?.isInitialized)
  console.log('- loading:', window.settingsStore?.isLoading)
  console.log('- providers count:', window.settingsStore?.providers?.length)
  console.log('- selectedProviderId:', window.settingsStore?.selectedProviderId)

  console.log('🔍 DB Service状态:')
  console.log('- db initialized:', !!window.dbService?.db)
  console.log('- init flag:', window.dbService?.initialized)

  console.log('\n' + '='.repeat(60))
  console.log('🧹 步骤 2: 清理所有数据')
  console.log('='.repeat(60))

  try {
    localStorage.clear()
    sessionStorage.clear()
    console.log('✅ 所有存储已清理')
  } catch (e) {
    console.error('❌ 清理失败:', e)
  }

  console.log('\n' + '='.repeat(60))
  console.log('🔄 步骤 3: 重置stores和服务')
  console.log('='.repeat(60))

  try {
    // 重置settings store
    if (window.settingsStore) {
      window.settingsStore.isInitialized = false
      window.settingsStore.isLoading = false
      window.settingsStore.providers = []
      window.settingsStore.selectedProviderId = ''
      console.log('✅ Settings store已重置')
    }

    // 重置db service
    if (window.dbService) {
      window.dbService.initialized = false
      window.dbService.db = null
      window.dbService.initPromise = null
      console.log('✅ DB service已重置')
    }
  } catch (e) {
    console.error('❌ 重置失败:', e)
  }

  console.log('\n' + '='.repeat(60))
  console.log('🚀 步骤 4: 重新初始化')
  console.log('='.repeat(60))

  try {
    await window.settingsStore.initialize()
    console.log('✅ Settings store初始化完成')
    console.log('- providers count:', window.settingsStore.providers.length)
    console.log('- initialized:', window.settingsStore.isInitialized)
  } catch (e) {
    console.error('❌ 初始化失败:', e)
    return
  }

  console.log('\n' + '='.repeat(60))
  console.log('🏭 步骤 5: 手动创建默认提供商')
  console.log('='.repeat(60))

  try {
    const defaultProvider = window.settingsStore.createDefaultProvider()
    console.log('✅ 默认提供商创建成功:')
    console.log('- ID:', defaultProvider.id)
    console.log('- Name:', defaultProvider.name)
    console.log('- Type:', defaultProvider.type)
    console.log('- Base URL:', defaultProvider.baseUrl)
    console.log('- API Key:', defaultProvider.apiKey ? '已设置' : '未设置')
    console.log('- Model:', defaultProvider.model)
    console.log('- Active:', defaultProvider.isActive)
  } catch (e) {
    console.error('❌ 创建默认提供商失败:', e)
    return
  }

  console.log('\n' + '='.repeat(60))
  console.log('💾 步骤 6: 保存提供商到数据库')
  console.log('='.repeat(60))

  try {
    await window.settingsStore.addProvider(defaultProvider)
    console.log('✅ 提供商已添加到store')
    console.log('- store中providers数量:', window.settingsStore.providers.length)
  } catch (e) {
    console.error('❌ 添加提供商到store失败:', e)
    return
  }

  console.log('\n' + '='.repeat(60))
  console.log('🔍 步骤 7: 直接从数据库验证')
  console.log('='.repeat(60))

  try {
    const dbProviders = await window.dbService.getModelProviders()
    console.log('✅ 从数据库获取提供商成功:')
    console.log('- 数据库中providers数量:', dbProviders.length)
    if (dbProviders.length > 0) {
      console.log('- 第一个提供商:', dbProviders[0])
    }
  } catch (e) {
    console.error('❌ 从数据库获取提供商失败:', e)
  }

  console.log('\n' + '='.repeat(60))
  console.log('💾 步骤 8: 检查localStorage状态')
  console.log('='.repeat(60))

  const dbData = localStorage.getItem('agentaccess-db')
  if (dbData) {
    console.log('✅ 找到数据库数据:')
    console.log('- 数据大小:', dbData.length, 'bytes')
    console.log('- 数据预览:', dbData.substring(0, 100) + '...')
  } else {
    console.log('❌ 未找到数据库数据')
  }

  const backupData = localStorage.getItem('agentaccess-db-backup')
  if (backupData) {
    console.log('✅ 找到备份数据:')
    console.log('- 备份数据大小:', backupData.length, 'bytes')
  } else {
    console.log('⚠️ 未找到备份数据')
  }

  console.log('\n' + '='.repeat(60))
  console.log('🔄 步骤 9: 模拟页面刷新')
  console.log('='.repeat(60))

  try {
    // 保存当前状态
    const currentProviders = window.settingsStore.providers.length
    const currentSelectedId = window.settingsStore.selectedProviderId

    console.log('刷新前状态:')
    console.log('- providers数量:', currentProviders)
    console.log('- selectedProviderId:', currentSelectedId)

    // 重置store（模拟刷新）
    window.settingsStore.isInitialized = false
    window.settingsStore.isLoading = false
    window.settingsStore.providers = []
    window.settingsStore.selectedProviderId = ''

    // 重新初始化
    await window.settingsStore.initialize()

    console.log('刷新后状态:')
    console.log('- providers数量:', window.settingsStore.providers.length)
    console.log('- selectedProviderId:', window.settingsStore.selectedProviderId)

    if (window.settingsStore.providers.length > 0) {
      console.log('✅ 数据持久化成功！')
    } else {
      console.log('❌ 数据持久化失败！')
    }
  } catch (e) {
    console.error('❌ 模拟刷新失败:', e)
  }

  console.log('\n' + '='.repeat(60))
  console.log('🎯 步骤 10: 最终状态报告')
  console.log('='.repeat(60))

  console.log('📊 最终状态:')
  console.log('- Settings Store initialized:', window.settingsStore?.isInitialized)
  console.log('- Providers in store:', window.settingsStore?.providers?.length)
  console.log('- Selected provider:', window.settingsStore?.selectedProviderId)
  console.log('- DB Service initialized:', !!window.dbService?.db)
  console.log('- Data in localStorage:', !!localStorage.getItem('agentaccess-db'))

  const success = window.settingsStore?.providers?.length > 0 && !!window.dbService?.db
  console.log('\n🎉 调试结果:', success ? '✅ 成功' : '❌ 失败')

  if (success) {
    console.log('✅ 模型提供商插入功能正常工作！')
  } else {
    console.log('❌ 模型提供商插入存在问题，请查看上述日志找出具体原因')
  }
}

// 等待页面加载完成
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', debugModelProviderInsertion)
} else {
  debugModelProviderInsertion()
}

// 也可以手动调用
window.debugModelProviderInsertion = debugModelProviderInsertion
console.log('💡 调试脚本已加载，可随时调用 window.debugModelProviderInsertion()')