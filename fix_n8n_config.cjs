// n8n工作流配置修复脚本
const fs = require('fs');
const path = require('path');

// 检查并修复n8n服务配置
function checkAndFixN8NConfig() {
  console.log('🔧 检查n8n工作流配置...\n');
  
  // 检查环境变量文件
  const envExamplePath = path.join(__dirname, '.env.example');
  const envPath = path.join(__dirname, '.env');
  
  if (fs.existsSync(envExamplePath)) {
    console.log('✅ 找到.env.example文件');
    
    // 检查是否需要创建.env文件
    if (!fs.existsSync(envPath)) {
      console.log('📝 创建.env文件...');
      fs.copyFileSync(envExamplePath, envPath);
      console.log('✅ .env文件已创建');
    } else {
      console.log('✅ .env文件已存在');
    }
  }
  
  // 检查n8n服务配置
  console.log('\n📋 当前n8n配置:');
  console.log('   Webhook URL: http://localhost:5678/webhook-test/webhood/recipe-generator');
  console.log('   备用URL 1: http://localhost:5678/webhook/recipe-generator');
  console.log('   备用URL 2: http://localhost:5678/webhook-test/recipe-generator');
  
  return true;
}

// 测试所有可用的URL
async function testAllURLs() {
  console.log('\n🔄 测试所有可用URL...\n');
  
  const urls = [
    'http://localhost:5678/webhook-test/webhood/recipe-generator',
    'http://localhost:5678/webhook/recipe-generator', 
    'http://localhost:5678/webhook-test/recipe-generator'
  ];
  
  const testData = {
    ingredients: ["猪肉", "白菜", "土豆"],
    cuisine: "川菜", 
    difficulty: "简单",
    userId: "test-user-123"
  };
  
  for (const url of urls) {
    console.log(`🔍 测试URL: ${url}`);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(testData),
        timeout: 10000
      });
      
      console.log(`   HTTP状态码: ${response.status}`);
      
      if (response.ok) {
        try {
          const result = await response.json();
          console.log('   ✅ 请求成功 - JSON响应有效');
          console.log(`      响应类型: ${result.success ? '成功' : '失败'}`);
          return { success: true, url: url, data: result };
        } catch (jsonError) {
          console.log('   ⚠️ 请求成功但JSON解析失败');
          const text = await response.text();
          console.log(`      响应内容: ${text.substring(0, 100)}...`);
        }
      } else {
        const errorText = await response.text();
        console.log(`   ❌ 请求失败: ${errorText}`);
      }
      
    } catch (error) {
      console.log(`   ❌ 连接失败: ${error.message}`);
    }
    
    console.log('');
  }
  
  return { success: false };
}

// 提供n8n工作流配置指南
function provideN8NSetupGuide() {
  console.log('\n📖 n8n工作流配置指南:');
  console.log('='.repeat(50));
  console.log('\n1. 访问n8n界面: http://localhost:5678');
  console.log('2. 创建新工作流 (New Workflow)');
  console.log('3. 添加Webhook触发器节点:');
  console.log('   - HTTP Method: POST');
  console.log('   - Path: /webhook-test/webhood/recipe-generator');
  console.log('   - Response Mode: "Respond to Webhook"');
  console.log('4. 添加AI服务节点 (如OpenAI):');
  console.log('   - 配置API密钥');
  console.log('   - 设置提示词模板');
  console.log('5. 添加响应格式化节点:');
  console.log('   - 确保返回标准JSON格式');
  console.log('   - 包含success字段和recipe数据');
  console.log('6. 激活工作流');
  console.log('\n💡 提示: 工作流被取消的错误通常意味着工作流配置不完整或节点有问题');
}

// 主函数
async function main() {
  console.log('🚀 n8n工作流配置修复工具');
  console.log('='.repeat(50));
  
  // 检查配置
  checkAndFixN8NConfig();
  
  // 测试所有URL
  const testResult = await testAllURLs();
  
  if (!testResult.success) {
    console.log('\n❌ 所有URL测试都失败，需要配置n8n工作流');
    provideN8NSetupGuide();
  } else {
    console.log('\n✅ 找到可用的工作流URL:', testResult.url);
    console.log('🎉 n8n工作流配置成功！');
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📋 修复完成');
}

// 运行修复
main().catch(console.error);