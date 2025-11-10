// 测试菜谱生成功能 - CommonJS版本
const fetch = require('node-fetch');

// 使用正确的URL
const N8N_URL = 'http://localhost:5678/webhook-test/webhood/recipe-generator';

async function testRecipeGeneration() {
  console.log('🍳 测试菜谱生成功能...');
  console.log('目标URL:', N8N_URL);
  
  const testData = {
    ingredients: ['猪肉', '白菜', '土豆'],
    cuisine: '川菜',
    difficulty: '中等',
    userId: 'test-user-123',
    timestamp: new Date().toISOString()
  };

  try {
    console.log('\n📤 发送测试数据:', JSON.stringify(testData, null, 2));
    
    const response = await fetch(N8N_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    console.log('📥 响应状态:', response.status, response.statusText);
    
    if (!response.ok) {
      console.error('❌ HTTP错误:', response.status);
      const errorText = await response.text();
      console.error('错误详情:', errorText);
      return;
    }

    const result = await response.json();
    console.log('✅ 菜谱生成成功!');
    console.log('生成结果:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ 请求失败:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 提示: n8n服务可能没有启动');
      console.error('请确保n8n在 http://localhost:5678 运行');
    }
  }
}

// 运行测试
testRecipeGeneration();