#!/usr/bin/env node

// 简单的API连接测试脚本
const https = require('https');
const http = require('http');

const testEndpoints = [
  {
    name: 'MiniMax API',
    url: 'https://www.aiping.cn/api/v1/models',
    method: 'GET'
  },
  {
    name: 'DeepSeek API',
    url: 'https://api.deepseek.com/v1/models',
    method: 'GET'
  },
  {
    name: 'OpenAI API',
    url: 'https://api.openai.com/v1/models',
    method: 'GET'
  }
];

function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    console.log(`\n🔍 Testing ${endpoint.name}...`);

    const protocol = endpoint.url.startsWith('https') ? https : http;
    const url = new URL(endpoint.url);

    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      method: endpoint.method,
      headers: {
        'User-Agent': 'AgentAccess-API-Test/1.0'
      }
    };

    const req = protocol.request(options, (res) => {
      console.log(`✅ ${endpoint.name}: ${res.statusCode} ${res.statusMessage}`);
      console.log(`📋 Headers:`, res.headers);
      resolve({ name: endpoint.name, success: true, status: res.statusCode });
    });

    req.on('error', (error) => {
      console.log(`❌ ${endpoint.name}: ${error.message}`);
      resolve({ name: endpoint.name, success: false, error: error.message });
    });

    req.setTimeout(10000, () => {
      req.abort();
      console.log(`⏰ ${endpoint.name}: Request timeout`);
      resolve({ name: endpoint.name, success: false, error: 'Timeout' });
    });

    req.end();
  });
}

async function runTests() {
  console.log('🚀 Starting API connectivity tests...\n');

  for (const endpoint of testEndpoints) {
    await testEndpoint(endpoint);
  }

  console.log('\n📊 Test Summary:');
  console.log('If most tests fail, the issue is likely network connectivity.');
  console.log('If specific endpoints fail, the issue is with those APIs.');
  console.log('\n💡 Recommendations:');
  console.log('1. Check your internet connection');
  console.log('2. Try using a different API provider');
  console.log('3. Configure your own API key in the application');
}

runTests().catch(console.error);