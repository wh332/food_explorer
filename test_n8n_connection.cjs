// 测试n8n连接 - CommonJS版本
const http = require('http');

// 使用正确的URL
const N8N_URL = 'http://localhost:5678/webhook-test/webhood/recipe-generator';

function testN8NConnection() {
  console.log('🔗 测试n8n连接...');
  console.log('目标URL:', N8N_URL);
  
  const testData = {
    ingredients: ['猪肉', '白菜', '土豆'],
    cuisine: '川菜',
    difficulty: '中等',
    userId: 'test-user-123',
    timestamp: new Date().toISOString()
  };

  const data = JSON.stringify(testData);
  
  const url = new URL(N8N_URL);
  const options = {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
      'Accept': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log('📥 响应状态:', res.statusCode, res.statusMessage);
    
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('✅ n8n连接成功!');
        console.log('响应数据:', responseData);
      } else {
        console.error('❌ HTTP错误:', res.statusCode);
        console.error('错误详情:', responseData);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ 请求失败:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 提示: n8n服务可能没有启动');
      console.error('请确保n8n在 http://localhost:5678 运行');
    }
  });

  req.write(data);
  req.end();
}

// 运行测试
testN8NConnection();