// 快速调试脚本 - 在控制台中粘贴执行
console.log('🔍 快速诊断开始...');

// 1. 检查store状态
console.log('📊 Settings Store状态:');
console.log('- isInitialized:', window.settingsStore?.isInitialized);
console.log('- providers数量:', window.settingsStore?.providers?.length);
console.log('- selectedProviderId:', window.settingsStore?.selectedProviderId);

if (window.settingsStore?.providers?.length > 0) {
  console.log('- 提供商列表:', window.settingsStore.providers);
} else {
  console.log('- 提供商列表: 空');
}

// 2. 检查数据库状态
console.log('\n🗄️ 数据库状态:');
console.log('- DB initialized:', !!window.dbService?.db);
console.log('- DB initialized flag:', window.dbService?.initialized);

// 3. 直接从数据库读取
(async () => {
  try {
    const dbProviders = await window.dbService.getModelProviders();
    console.log('- 数据库中的提供商:', dbProviders);
    console.log('- 数据库中提供商数量:', dbProviders.length);
  } catch (e) {
    console.error('- 数据库读取失败:', e);
  }
})();

// 4. 检查localStorage
console.log('\n💾 localStorage状态:');
console.log('- agentaccess-db:', !!localStorage.getItem('agentaccess-db'));
console.log('- agentaccess-db-backup:', !!localStorage.getItem('agentaccess-db-backup'));
console.log('- agentaccess-backup (Safari):', !!localStorage.getItem('agentaccess-backup'));

// 5. 尝试创建和添加提供商
console.log('\n🏭 测试创建提供商:');
try {
  const provider = window.settingsStore.createDefaultProvider();
  console.log('✅ 默认提供商创建成功:', provider.id);

  // 添加到store
  window.settingsStore.addProvider(provider).then(() => {
    console.log('✅ 提供商已添加到store');
    console.log('- 现在store中providers数量:', window.settingsStore.providers.length);
  }).catch(e => {
    console.error('❌ 添加提供商失败:', e);
  });
} catch (e) {
  console.error('❌ 创建提供商失败:', e);
}

console.log('🔍 快速诊断完成！请查看上述输出。');