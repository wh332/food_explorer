// n8n工作流连接测试脚本
const testN8NConnection = async () => {
  const testUrls = [
    'http://localhost:5678/webhook-test/webhood/recipe-generator',
    'http://localhost:5678/webhook/recipe-generator',
    'http://localhost:5678/webhook-test/recipe-generator'
  ];

  console.log('开始测试n8n工作流连接...\n');

  for (const url of testUrls) {
    console.log(`测试URL: ${url}`);
    
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

      console.log(`状态码: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('响应数据:', JSON.stringify(data, null, 2));
        console.log('✅ 连接成功!\n');
        return { success: true, url, data };
      } else {
        console.log(`❌ 请求失败: ${response.statusText}\n`);
      }
    } catch (error) {
      console.log(`❌ 连接错误: ${error.message}\n`);
    }
  }

  console.log('所有URL测试失败，请检查n8n工作流配置');
  return { success: false };
};

// 运行测试
testN8NConnection().then(result => {
  if (result.success) {
    console.log('🎉 n8n工作流连接测试成功！');
    console.log(`可用URL: ${result.url}`);
  } else {
    console.log('💥 n8n工作流连接测试失败');
    console.log('请按照以下步骤配置n8n工作流:');
    console.log('1. 启动n8n服务: n8n start');
    console.log('2. 访问 http://localhost:5678');
    console.log('3. 创建Webhook触发器，路径设置为 /webhook/recipe-generator');
    console.log('4. 配置AI服务节点处理菜谱生成');
  }
});