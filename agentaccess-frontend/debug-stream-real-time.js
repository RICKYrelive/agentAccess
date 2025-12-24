// 实时流式调试脚本
console.log('🔥 开始实时流式调试...')

async function debugRealTimeStreaming() {
  console.log('='.repeat(60))
  console.log('📡 测试真实的流式响应时间')
  console.log('='.repeat(60))

  const selectedProvider = window.settingsStore?.selectedProvider
  if (!selectedProvider) {
    console.error('❌ 没有选择的模型提供商！')
    return
  }

  console.log('选择的提供商:', selectedProvider.name)
  console.log('Base URL:', selectedProvider.baseUrl)

  const apiUrl = `/api/chat/completions`
  const requestBody = {
    model: selectedProvider.model,
    messages: [
      { role: 'user', content: '请用3句话分别回答1+1等于几，2+2等于几，3+3等于几，每句话间隔1秒' }
    ],
    max_tokens: 200,
    temperature: 0.7,
    stream: true
  }

  console.log('请求URL:', apiUrl)

  try {
    console.log('🚀 发送请求...')
    const startTime = Date.now()

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
    console.log('📡 Content-Type:', response.headers.get('content-type'))
    console.log('📡 Transfer-Encoding:', response.headers.get('transfer-encoding'))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API错误:', errorText)
      return
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let fullResponse = ''
    let chunkCount = 0
    let lastContentTime = 0

    console.log('✅ 开始读取流...')

    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        const endTime = Date.now()
        console.log(`🏁 流结束，总耗时: ${endTime - startTime}ms，总chunks: ${chunkCount}`)
        break
      }

      const now = Date.now()
      const chunk = decoder.decode(value, { stream: true })
      chunkCount++

      console.log(`📦 Chunk ${chunkCount} 到达时间: ${now - startTime}ms`)
      console.log(`📦 Chunk 大小: ${chunk.length} 字符`)
      console.log(`📦 Chunk 内容: ${chunk.substring(0, 100)}${chunk.length > 100 ? '...' : ''}`)

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
                const contentTime = Date.now()
                console.log(`💬 内容: "${content}" (间隔: ${lastContentTime ? contentTime - lastContentTime : 0}ms)`)
                lastContentTime = contentTime
              }
            } catch (e) {
              console.log('📝 SSE数据:', data)
            }
          }
        }
      }

      fullResponse += chunk
    }

    console.log('✅ 流式请求完成')
    console.log('完整响应长度:', fullResponse.length)

  } catch (error) {
    console.error('❌ 请求失败:', error)
  }
}

// 自动执行
debugRealTimeStreaming()

window.debugRealTimeStreaming = debugRealTimeStreaming
console.log('💡 可以随时调用 window.debugRealTimeStreaming() 重新调试')