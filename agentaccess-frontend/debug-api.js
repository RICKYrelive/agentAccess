// API连接调试脚本
console.log('🔍 开始API连接调试...')

async function debugAPIConnection() {
  console.log('='.repeat(60))
  console.log('📊 步骤1: 检查模型提供商配置')
  console.log('='.repeat(60))

  // 检查settings store状态
  console.log('Settings Store状态:')
  console.log('- isInitialized:', window.settingsStore?.isInitialized)
  console.log('- providers数量:', window.settingsStore?.providers?.length)
  console.log('- selectedProviderId:', window.settingsStore?.selectedProviderId)

  const selectedProvider = window.settingsStore?.selectedProvider
  if (!selectedProvider) {
    console.error('❌ 没有选择的模型提供商！')
    return
  }

  console.log('✅ 选择的模型提供商:')
  console.log('- ID:', selectedProvider.id)
  console.log('- 名称:', selectedProvider.name)
  console.log('- 类型:', selectedProvider.type)
  console.log('- Base URL:', selectedProvider.baseUrl)
  console.log('- 模型:', selectedProvider.model)
  console.log('- API Key:', selectedProvider.apiKey ? '已设置 (' + selectedProvider.apiKey.substring(0, 10) + '...)' : '❌ 未设置')
  console.log('- Max Tokens:', selectedProvider.maxTokens)
  console.log('- Temperature:', selectedProvider.temperature)
  console.log('- Active:', selectedProvider.isActive)

  console.log('\n' + '='.repeat(60))
  console.log('🌐 步骤2: 测试API连接')
  console.log('='.repeat(60))

  const apiUrl = `${selectedProvider.baseUrl}/chat/completions`
  console.log('API URL:', apiUrl)

  // 首先测试模型列表API（通常更简单）
  const modelsUrl = `${selectedProvider.baseUrl}/models`
  console.log('测试模型列表API:', modelsUrl)

  try {
    const modelsResponse = await fetch(modelsUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${selectedProvider.apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    console.log('模型API响应状态:', modelsResponse.status, modelsResponse.statusText)

    if (modelsResponse.ok) {
      const modelsData = await modelsResponse.json()
      console.log('✅ 模型列表获取成功:')
      console.log('- 可用模型数量:', modelsData.data?.length || 0)
      if (modelsData.data?.length > 0) {
        console.log('- 前5个模型:', modelsData.data.slice(0, 5).map(m => m.id))
      }
    } else {
      const errorText = await modelsResponse.text()
      console.error('❌ 模型API错误:', errorText)
    }
  } catch (e) {
    console.error('❌ 模型API请求失败:', e)
    if (e instanceof TypeError) {
      console.error('💡 这可能是CORS或网络连接问题')
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('💬 步骤3: 测试聊天API')
  console.log('='.repeat(60))

  const testRequest = {
    model: selectedProvider.model,
    messages: [
      { role: 'user', content: '你好，请回复"测试成功"' }
    ],
    max_tokens: 50,
    temperature: 0.7,
    stream: false  // 先用非流式测试
  }

  console.log('测试请求体:', JSON.stringify(testRequest, null, 2))

  try {
    const chatResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${selectedProvider.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testRequest)
    })

    console.log('聊天API响应状态:', chatResponse.status, chatResponse.statusText)
    console.log('响应头:', Object.fromEntries(chatResponse.headers.entries()))

    if (chatResponse.ok) {
      const chatData = await chatResponse.json()
      console.log('✅ 聊天API测试成功:')
      console.log('- 响应ID:', chatData.id)
      console.log('- 模型:', chatData.model)
      console.log('- 回复内容:', chatData.choices?.[0]?.message?.content)
    } else {
      const errorText = await chatResponse.text()
      console.error('❌ 聊天API错误:')
      console.error('- 状态码:', chatResponse.status)
      console.error('- 错误内容:', errorText)

      // 分析常见错误
      if (chatResponse.status === 401) {
        console.error('💡 API Key可能无效或过期')
      } else if (chatResponse.status === 404) {
        console.error('💡 API URL不正确，请检查baseUrl配置')
      } else if (chatResponse.status === 429) {
        console.error('💡 API调用频率限制')
      }
    }
  } catch (e) {
    console.error('❌ 聊天API请求失败:', e)
    if (e instanceof TypeError) {
      console.error('💡 网络连接错误，可能的原因:')
      console.error('   1. CORS策略阻止了跨域请求')
      console.error('   2. 网络连接问题')
      console.error('   3. API URL不正确')
      console.error('   4. SSL证书问题')
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('🔧 步骤4: 环境信息')
  console.log('='.repeat(60))

  console.log('浏览器信息:')
  console.log('- User Agent:', navigator.userAgent)
  console.log('- 当前域名:', window.location.origin)
  console.log('- API域名:', new URL(selectedProvider.baseUrl).origin)

  if (window.location.origin !== new URL(selectedProvider.baseUrl).origin) {
    console.warn('⚠️ 跨域请求 detected - 可能存在CORS问题')
    console.warn('💡 解决方案:')
    console.warn('   1. 服务器需要配置CORS允许当前域名')
    console.warn('   2. 或者使用代理服务器')
  }

  console.log('\n🎯 调试建议:')
  console.log('1. 检查API Key是否正确有效')
  console.log('2. 检查Base URL是否正确')
  console.log('3. 确认模型名称是否正确')
  console.log('4. 检查网络连接')
  console.log('5. 查看浏览器开发者工具的Network标签')
}

// 自动执行调试
debugAPIConnection()

// 也可以手动调用
window.debugAPIConnection = debugAPIConnection
console.log('💡 可以随时调用 window.debugAPIConnection() 重新调试')