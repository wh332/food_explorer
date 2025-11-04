// n8n工作流配置和测试脚本
const fs = require('fs');
const path = require('path');

// 测试n8n工作流连接
const testN8NConnection = async () => {
  const testUrls = [
    'http://localhost:5678/webhook-test/webhood/recipe-generator',
    'http://localhost:5678/webhook/recipe-generator',
    'http://localhost:5678/webhook-test/recipe-generator'
  ];

  console.log('🔍 开始测试n8n工作流连接...\n');

  for (const url of testUrls) {
    console.log(`📡 测试URL: ${url}`);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: ['猪肉', '白菜', '土豆'],
          cuisine: '川菜',
          difficulty: '简单',
          userId: 'test-user'
        })
      });

      console.log(`📊 状态码: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ 连接成功!');
        console.log('📋 响应数据:', JSON.stringify(data, null, 2));
        console.log('🎉 恭喜！n8n工作流配置正确！\n');
        return { success: true, url, data };
      } else {
        const errorText = await response.text();
        console.log(`❌ 请求失败: ${response.statusText}`);
        console.log(`📝 错误详情: ${errorText}\n`);
      }
    } catch (error) {
      console.log(`❌ 连接错误: ${error.message}\n`);
    }
  }

  console.log('💥 所有URL测试失败，请检查n8n工作流配置');
  return { success: false };
};

// 检查n8n服务状态
const checkN8NStatus = async () => {
  console.log('🔍 检查n8n服务状态...\n');
  
  try {
    const response = await fetch('http://localhost:5678', {
      method: 'GET',
      timeout: 5000
    });
    
    if (response.ok) {
      console.log('✅ n8n服务正在运行');
      console.log('🌐 访问地址: http://localhost:5678\n');
      return true;
    }
  } catch (error) {
    console.log('❌ n8n服务未运行或无法访问');
    console.log('💡 请确保n8n服务已启动\n');
    return false;
  }
};

// 创建环境配置文件
const createEnvFile = () => {
  const envContent = `# n8n工作流配置
# 复制此文件为 .env 并根据实际情况修改

# n8n工作流Webhook URL - 测试URL
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook-test/webhood/recipe-generator

# 备用API端点（如果n8n不可用）
VITE_FALLBACK_API_URL=https://api.example.com/recipes/generate

# Supabase配置（已存在）
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
`;

  const envPath = path.join(__dirname, '.env');
  
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, envContent);
    console.log('📄 已创建 .env 配置文件');
    console.log('💡 请根据实际情况修改配置\n');
  } else {
    console.log('📄 .env 文件已存在\n');
  }
};

// 显示配置指南
const showConfigurationGuide = () => {
  console.log('📋 n8n工作流配置指南\n');
  console.log('1. 🚀 启动n8n服务:');
  console.log('   n8n start 或 npx n8n start\n');
  
  console.log('2. 🌐 访问n8n界面:');
  console.log('   打开浏览器访问 http://localhost:5678\n');
  
  console.log('3. ⚙️ 创建工作流:');
  console.log('   - 点击 "New Workflow"');
  console.log('   - 添加 "Webhook" 触发器');
  console.log('   - 设置路径为: /webhook-test/webhood/recipe-generator');
  console.log('   - 添加AI服务节点（如OpenAI）');
  console.log('   - 配置响应格式\n');
  
  console.log('4. 🔧 测试工作流:');
  console.log('   - 点击 "Execute Workflow" 按钮');
  console.log('   - 使用此脚本测试连接\n');
  
  console.log('5. 📝 工作流数据格式:');
  console.log(JSON.stringify({
    ingredients: ['猪肉', '白菜', '土豆'],
    cuisine: '川菜',
    difficulty: '简单',
    userId: 'test-user',
    timestamp: '2024-01-01T10:00:00Z',
    source: 'food-explorer-web'
  }, null, 2));
  console.log('');
};

// 主函数
const main = async () => {
  console.log('🍳 美食探索者 - n8n工作流配置助手\n');
  
  // 检查n8n服务状态
  const isN8NRunning = await checkN8NStatus();
  
  if (!isN8NRunning) {
    console.log('💡 请先启动n8n服务，然后重新运行此脚本\n');
    showConfigurationGuide();
    return;
  }
  
  // 测试连接
  const result = await testN8NConnection();
  
  if (!result.success) {
    console.log('🔧 需要配置n8n工作流\n');
    showConfigurationGuide();
  }
  
  // 创建环境配置文件
  createEnvFile();
  
  console.log('🎯 下一步操作:');
  console.log('1. 按照上述指南配置n8n工作流');
  console.log('2. 修改 .env 文件中的配置');
  console.log('3. 重新运行此脚本测试连接');
  console.log('4. 启动前端应用测试菜谱生成功能\n');
};

// 运行主函数
main().catch(error => {
  console.error('❌ 脚本执行错误:', error);
});