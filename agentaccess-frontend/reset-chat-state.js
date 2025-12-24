// 重置聊天状态的脚本
// 在浏览器控制台中运行这个脚本来重置卡住的"正在思考..."状态

function resetChatState() {
  try {
    // 尝试获取 Vue 应用实例
    const app = document.querySelector('#app').__vue_app__
    const chatStore = app?.config?.globalProperties?.$chatStore

    if (chatStore) {
      console.log('🔄 重置聊天状态...')
      chatStore.isLoading = false
      chatStore.streamingMessage = ''
      chatStore.streamingReasoning = ''
      chatStore.abortController = null

      console.log('✅ 聊天状态已重置')
      console.log('isLoading:', chatStore.isLoading)
      console.log('streamingMessage:', chatStore.streamingMessage)
      console.log('streamingReasoning:', chatStore.streamingReasoning)
    } else {
      console.error('❌ 无法找到 chatStore')

      // 尝试通过 window 对象访问
      if (window.Vue && window.Vue.config && window.Vue.config.globalProperties) {
        const store = window.Vue.config.globalProperties.$chatStore
        if (store) {
          store.isLoading = false
          store.streamingMessage = ''
          store.streamingReasoning = ''
          console.log('✅ 通过 window 对象重置成功')
        }
      }
    }
  } catch (error) {
    console.error('❌ 重置失败:', error)

    // 最后的尝试：直接刷新页面
    if (confirm('无法自动重置，是否刷新页面？')) {
      location.reload()
    }
  }
}

// 自动执行
resetChatState()

console.log('💡 如果状态仍然卡住，请手动调用 resetChatState() 或刷新页面')