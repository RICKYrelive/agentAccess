// 流式API调试脚本
console.log('🌊 开始流式API调试...')

async function debugStreamingAPI() {
  console.log('='.repeat(60))
  console.log('📊 步骤1: 检查当前配置')
  console.log('='.repeat(60))

  const selectedProvider = window.settingsStore?.selectedProvider
  if (!selectedProvider) {
    console.error('❌ 没有选择的模型提供商！')
    return
  }

  console.log('选择的提供商:', selectedProvider.name)
  console.log('Base URL:', selectedProvider.baseUrl)
  console.log('API Key:', selectedProvider.apiKey ? '已设置' : '未设置')

  console.log('\n' + '='.repeat(60))
  console.log('🌊 步骤2: 测试流式API请求')
  console.log('='.repeat(60))

  const apiUrl = `${selectedProvider.baseUrl}/chat/completions`
  const requestBody = {
    model: selectedProvider.model,
    messages: [
      { role: 'user', content: '你好，请简短回复' }
    ],
    max_tokens: 100,
    temperature: 0.7,
    stream: true  // 关键：启用流式
  }

  console.log('请求URL:', apiUrl)
  console.log('请求体:', JSON.stringify(requestBody, null, 2))

  try {
    console.log('🚀 发送流式请求...')

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${selectedProvider.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',  // 关键：接受流式响应
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify(requestBody)
    })

    console.log('📡 响应状态:', response.status, response.statusText)
    console.log('📡 响应头:', Object.fromEntries(response.headers.entries()))
    console.log('📡 Content-Type:', response.headers.get('content-type'))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ 流式API错误:', errorText)
      return
    }

    console.log('✅ 开始读取流式响应...')

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let fullResponse = ''

    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        console.log('🏁 流式响应结束')
        break
      }

      const chunk = decoder.decode(value, { stream: true })
      fullResponse += chunk

      // 处理SSE格式
      const lines = chunk.split('\n')
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') {
            console.log('📝 流结束标记 [DONE]')
          } else {
            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices?.[0]?.delta?.content
              if (content) {
                console.log('💬 收到内容:', content)
              }
            } catch (e) {
              console.log('📝 SSE数据:', data)
            }
          }
        }
      }
    }

    console.log('✅ 流式请求测试成功')
    console.log('完整响应长度:', fullResponse.length)

  } catch (error) {
    console.error('❌ 流式API请求失败:', error)

    if (error instanceof TypeError) {
      console.error('💡 网络错误分析:')
      console.error('   1. 可能是流式请求不被支持')
      console.error('   2. CORS策略可能阻止了流式请求')
      console.error('   3. 网络连接问题')
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('🔄 步骤3: 测试非流式对比')
  console.log('='.repeat(60))

  try {
    const nonStreamRequest = { ...requestBody, stream: false }
    console.log('测试非流式请求...')

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${selectedProvider.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nonStreamRequest)
    })

    console.log('非流式响应状态:', response.status, response.statusText)

    if (response.ok) {
      const data = await response.json()
      console.log('✅ 非流式请求成功')
      console.log('回复:', data.choices?.[0]?.message?.content)
    } else {
      console.error('❌ 非流式请求失败')
    }

  } catch (error) {
    console.error('❌ 非流式请求失败:', error)
  }

  console.log('\n' + '='.repeat(60))
  console.log('💡 诊断建议')
  console.log('='.repeat(60))

  console.log('如果流式请求失败但非流式成功:')
  console.log('1. API可能不支持流式响应')
  console.log('2. 流式请求的CORS配置可能不同')
  console.log('3. 可能需要修改应用代码使用非流式请求')

  console.log('\n如果都失败:')
  console.log('1. 检查API服务器状态')
  console.log('2. 验证API密钥权限')
  console.log('3. 检查网络防火墙设置')
}

// 自动执行调试
debugStreamingAPI()

// 也可以手动调用
window.debugStreamingAPI = debugStreamingAPI
console.log('💡 可以随时调用 window.debugStreamingAPI() 重新调试')