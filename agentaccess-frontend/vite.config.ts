import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      // 代理API请求来解决CORS问题
      '/api': {
        target: 'https://www.aiping.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
        // 确保流式响应不被缓冲
        configure: (proxy, options) => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('🔄 Proxy response headers:', proxyRes.headers)

            // 确保流式响应不被缓冲
            delete proxyRes.headers['content-length'];
            delete proxyRes.headers['x-content-type-options'];
            proxyRes.headers['transfer-encoding'] = 'chunked';
            proxyRes.headers['cache-control'] = 'no-cache, no-transform, must-revalidate';
            proxyRes.headers['connection'] = 'keep-alive';

            // 禁用各种缓冲
            proxyRes.headers['x-accel-buffering'] = 'no';
            proxyRes.headers['x-buffered'] = 'no';

            // 设置流式相关头部
            proxyRes.headers['content-type'] = 'text/event-stream; charset=utf-8';
          });

          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🔄 Proxy request headers:', proxyReq.getHeaders())
            // 确保请求也支持流式
            proxyReq.setHeader('Accept', 'text/event-stream');
            proxyReq.setHeader('Cache-Control', 'no-cache');
          });
        }
      }
    }
  }
})
