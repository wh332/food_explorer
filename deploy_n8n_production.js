// n8n工作流生产环境部署脚本

// 生产环境配置
const PRODUCTION_CONFIG = {
  // n8n服务配置
  n8nService: {
    // 生产环境n8n服务URL（需要根据实际部署修改）
    baseUrl: process.env.N8N_BASE_URL || 'http://localhost:5678',
    
    // Webhook路径
    webhookPath: '/webhook-test/webhood/recipe-generator',
    
    // 生产环境API密钥（需要配置）
    apiKey: process.env.N8N_API_KEY || 'your-production-api-key'
  },
  
  // 前端应用配置
  frontend: {
    // 生产环境域名
    domain: process.env.FRONTEND_DOMAIN || 'https://your-domain.com',
    
    // 构建输出目录
    buildDir: 'dist',
    
    // 静态资源CDN（可选）
    cdnUrl: process.env.CDN_URL || ''
  }
};

// 检查生产环境配置
function checkProductionConfig() {
  console.log('🔍 检查生产环境配置...\n');
  
  const requiredEnvVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_N8N_WEBHOOK_URL'
  ];
  
  let allConfigured = true;
  
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      console.log(`❌ 缺少环境变量: ${varName}`);
      allConfigured = false;
    } else {
      console.log(`✅ ${varName}: 已配置`);
    }
  });
  
  return allConfigured;
}

// 测试生产环境n8n连接
async function testProductionN8N() {
  console.log('\n🔗 测试生产环境n8n连接...');
  
  const testData = {
    ingredients: ["猪肉", "白菜", "土豆"],
    cuisine: "川菜", 
    difficulty: "简单",
    userId: "production-test-user"
  };
  
  try {
    const response = await fetch(PRODUCTION_CONFIG.n8nService.baseUrl + PRODUCTION_CONFIG.n8nService.webhookPath, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${PRODUCTION_CONFIG.n8nService.apiKey}`
      },
      body: JSON.stringify(testData)
    });
    
    console.log(`📊 生产环境测试结果:`);
    console.log(`   HTTP状态码: ${response.status}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ 生产环境n8n工作流测试成功');
      console.log(`   响应类型: ${result.success ? '成功' : '失败'}`);
      return true;
    } else {
      console.log('❌ 生产环境n8n工作流测试失败');
      return false;
    }
    
  } catch (error) {
    console.log('❌ 生产环境n8n连接失败:', error.message);
    return false;
  }
}

// 生成生产环境部署报告
function generateDeploymentReport() {
  console.log('\n📋 生产环境部署报告');
  console.log('='.repeat(50));
  
  console.log('\n🏗️ 部署配置:');
  console.log(`   前端域名: ${PRODUCTION_CONFIG.frontend.domain}`);
  console.log(`   n8n服务: ${PRODUCTION_CONFIG.n8nService.baseUrl}`);
  console.log(`   Webhook路径: ${PRODUCTION_CONFIG.n8nService.webhookPath}`);
  
  console.log('\n🔧 需要完成的任务:');
  console.log('   1. 配置生产环境n8n服务URL');
  console.log('   2. 设置n8n API密钥');
  console.log('   3. 配置前端域名和CDN');
  console.log('   4. 部署构建产物到服务器');
  
  console.log('\n🚀 部署命令:');
  console.log('   # 构建生产版本');
  console.log('   npm run build');
  console.log('');
  console.log('   # 部署到Netlify (如果使用Netlify)');
  console.log('   netlify deploy --prod --dir=dist');
  console.log('');
  console.log('   # 或使用其他部署平台');
  console.log('   # Vercel, GitHub Pages, 阿里云OSS等');
}

// 创建生产环境部署指南
function createProductionDeploymentGuide() {
  console.log('\n📖 生产环境部署指南');
  console.log('='.repeat(50));
  
  console.log('\n1. 🏗️ 服务器准备');
  console.log('   - 准备Web服务器 (Nginx, Apache等)');
  console.log('   - 配置域名和SSL证书');
  console.log('   - 设置反向代理到n8n服务');
  
  console.log('\n2. 🔧 n8n服务部署');
  console.log('   - 部署n8n到生产服务器或云服务');
  console.log('   - 配置生产环境Webhook URL');
  console.log('   - 设置API密钥和访问控制');
  
  console.log('\n3. 🌐 前端部署');
  console.log('   - 将dist目录内容上传到Web服务器');
  console.log('   - 配置SPA路由重定向');
  console.log('   - 设置缓存和CDN加速');
  
  console.log('\n4. ✅ 验证部署');
  console.log('   - 测试前端功能');
  console.log('   - 验证n8n工作流连接');
  console.log('   - 检查性能和安全性');
}

// 主部署函数
async function main() {
  console.log('🚀 n8n工作流生产环境部署工具');
  console.log('='.repeat(50));
  
  // 检查配置
  const configValid = checkProductionConfig();
  
  if (!configValid) {
    console.log('\n❌ 生产环境配置不完整，请检查环境变量');
    generateDeploymentReport();
    return;
  }
  
  // 测试n8n连接
  const n8nTestResult = await testProductionN8N();
  
  if (n8nTestResult) {
    console.log('\n🎉 生产环境n8n工作流配置成功！');
    console.log('✅ 可以开始部署到生产环境');
  } else {
    console.log('\n⚠️ 生产环境n8n连接测试失败');
    console.log('💡 请检查n8n服务配置和网络连接');
  }
  
  // 生成部署报告
  generateDeploymentReport();
  
  // 创建部署指南
  createProductionDeploymentGuide();
  
  console.log('\n' + '='.repeat(50));
  console.log('📋 部署准备完成');
  console.log('💡 请根据上述指南完成生产环境部署');
}

// 运行部署工具
main().catch(console.error);