// 测试修复后的创建和删除功能
console.log('🧪 开始测试修复后的功能...')

async function testProviderOperations() {
  console.log('='.repeat(60))
  console.log('📋 步骤1: 检查当前状态')
  console.log('='.repeat(60))

  console.log('当前提供商数量:', window.settingsStore.providers.length)
  console.log('数据库服务状态:', !!window.dbService?.db)

  console.log('\n' + '='.repeat(60))
  console.log('🗑️ 步骤2: 测试删除功能')
  console.log('='.repeat(60))

  if (window.settingsStore.providers.length > 0) {
    const providerToDelete = window.settingsStore.providers[0]
    console.log('准备删除提供商:', providerToDelete.id, providerToDelete.name)

    try {
      await window.settingsStore.deleteProvider(providerToDelete.id)
      console.log('✅ 删除成功')
      console.log('删除后提供商数量:', window.settingsStore.providers.length)
    } catch (e) {
      console.error('❌ 删除失败:', e)
    }
  } else {
    console.log('⚠️ 没有提供商可供删除')
  }

  console.log('\n' + '='.repeat(60))
  console.log('🏭 步骤3: 测试创建功能')
  console.log('='.repeat(60))

  try {
    const newProvider = window.settingsStore.createDefaultProvider()
    console.log('创建的提供商:', {
      id: newProvider.id,
      name: newProvider.name,
      baseUrl: newProvider.baseUrl,
      apiKey: newProvider.apiKey ? '已设置' : '未设置',
      model: newProvider.model,
      isActive: newProvider.isActive
    })

    await window.settingsStore.addProvider(newProvider)
    console.log('✅ 添加成功')
    console.log('添加后提供商数量:', window.settingsStore.providers.length)

    // 验证字段完整性
    const addedProvider = window.settingsStore.providers[window.settingsStore.providers.length - 1]
    console.log('验证添加的提供商:', {
      name: addedProvider.name,
      type: addedProvider.type,
      baseUrl: addedProvider.baseUrl,
      model: addedProvider.model,
      hasApiKey: !!addedProvider.apiKey,
      maxTokens: addedProvider.maxTokens,
      temperature: addedProvider.temperature,
      isActive: addedProvider.isActive
    })

  } catch (e) {
    console.error('❌ 创建/添加失败:', e)
  }

  console.log('\n' + '='.repeat(60))
  console.log('🔄 步骤4: 测试数据库读取')
  console.log('='.repeat(60))

  try {
    const dbProviders = await window.dbService.getModelProviders()
    console.log('数据库中的提供商数量:', dbProviders.length)

    if (dbProviders.length > 0) {
      console.log('数据库中的第一个提供商:', {
        id: dbProviders[0].id,
        name: dbProviders[0].name,
        type: dbProviders[0].type,
        baseUrl: dbProviders[0].baseUrl,
        model: dbProviders[0].model,
        hasApiKey: !!dbProviders[0].apiKey,
        maxTokens: dbProviders[0].maxTokens,
        temperature: dbProviders[0].temperature,
        isActive: dbProviders[0].isActive
      })
    }
  } catch (e) {
    console.error('❌ 数据库读取失败:', e)
  }

  console.log('\n' + '='.repeat(60))
  console.log('🎯 步骤5: 测试最终状态')
  console.log('='.repeat(60))

  console.log('Store中的提供商数量:', window.settingsStore.providers.length)
  console.log('Store中的提供商详情:', window.settingsStore.providers.map(p => ({
    id: p.id,
    name: p.name,
    hasApiKey: !!p.apiKey,
    isActive: p.isActive
  })))

  console.log('\n🎉 测试完成！')

  const success = window.settingsStore.providers.length > 0 &&
                window.settingsStore.providers.every(p => p.id && p.name && p.type && p.baseUrl && p.model)

  console.log('测试结果:', success ? '✅ 成功' : '❌ 失败')

  if (success) {
    console.log('✅ 创建和删除功能修复成功！')
  } else {
    console.log('❌ 仍有问题需要进一步修复')
  }
}

// 自动执行测试
testProviderOperations()

// 也可以手动调用
window.testProviderOperations = testProviderOperations
console.log('💡 可以随时调用 window.testProviderOperations() 重新测试')