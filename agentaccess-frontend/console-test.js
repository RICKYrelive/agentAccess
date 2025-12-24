// 在浏览器控制台中运行的测试脚本
// 复制这段代码到浏览器控制台中执行

async function testRealTimeStreaming() {
  console.log('🔥 开始实时流式调试...')

  // 获取当前的设置
  const settingsStore = window.settingsStore || window.Vue?.config?.globalProperties?.$settingsStore
  const selectedProvider = settingsStore?.selectedProvider

  if (!selectedProvider) {
    console.error('❌ 没有选择的模型提供商！')
    return
  }

  console.log('📡 选择的提供商:', selectedProvider.name)
  console.log('🌐 Base URL:', selectedProvider.baseUrl)

  const apiUrl = `/api/chat/completions`
  const requestBody = {
    model: selectedProvider.model,
    messages: [
      { role: 'user', content: '请每秒输出一个数字，从1到10' }
    ],
    max_tokens: 100,
    temperature: 0.7,
    stream: true
  }

  console.log('🚀 发送请求...')
  const startTime = Date.now()

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${selectedProvider.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify(requestBody)
    })

    console.log('📡 响应状态:', response.status, response.statusText)
    console.log('📡 响应头:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API错误:', errorText)
      return
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let contentCount = 0
    let lastContentTime = 0

    console.log('✅ 开始读取流...')

    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        const endTime = Date.now()
        console.log(`🏁 流结束，总耗时: ${endTime - startTime}ms，收到内容片段: ${contentCount}`)
        break
      }

      const chunk = decoder.decode(value, { stream: true })
      const now = Date.now()

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
                contentCount++
                const timeSinceLastContent = lastContentTime ? now - lastContentTime : 0
                console.log(`💬 内容 ${contentCount}: "${content}" (间隔: ${timeSinceLastContent}ms, 总耗时: ${now - startTime}ms)`)
                lastContentTime = now
              }
            } catch (e) {
              console.log('📝 SSE数据:', data)
            }
          }
        }
      }
    }

  } catch (error) {
    console.error('❌ 请求失败:', error)
  }
}

// 执行测试
testRealTimeStreaming()

console.log('💡 脚本已执行，查看上面的输出分析流式响应时间')