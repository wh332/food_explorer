// 测试特定的n8n webhook URL
const testUrl = 'http://localhost:5678/webhook-test/webhood/recipe-generator'

async function testSpecificUrl() {
  console.log('🔍 开始测试特定URL:', testUrl)
  
  // 测试数据
  const testData = {
    ingredients: ["猪肉", "白菜", "土豆"],
    cuisine: "川菜", 
    difficulty: "简单",
    userId: "test-user-123"
  }

  try {
    console.log('📤 发送测试请求...')
    
    const response = await fetch(testUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(testData),
      timeout: 10000
    })

    console.log('📥 收到响应:')
    console.log('   HTTP状态码:', response.status)
    console.log('   HTTP状态文本:', response.statusText)
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ 请求成功!')
      console.log('   响应数据:', JSON.stringify(result, null, 2))
    } else {
      console.log('❌ 请求失败')
      
      // 尝试读取错误信息
      try {
        const errorText = await response.text()
        console.log('   错误信息:', errorText)
      } catch (e) {
        console.log('   无法读取错误详情')
      }
    }
    
  } catch (error) {
    console.log('❌ 请求异常:')
    console.log('   错误类型:', error.name)
    console.log('   错误信息:', error.message)
    
    if (error.code) {
      console.log('   错误代码:', error.code)
    }
  }
}

// 先检查n8n服务是否运行
async function checkN8NService() {
  console.log('🔍 检查n8n服务状态...')
  
  try {
    // 简单的HTTP请求检查服务是否可达
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    
    const response = await fetch('http://localhost:5678', {
      method: 'GET',
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (response.ok) {
      console.log('✅ n8n服务正在运行')
      return true
    } else {
      console.log('❌ n8n服务返回错误状态:', response.status)
      return false
    }
    
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('❌ n8n服务连接超时')
    } else {
      console.log('❌ n8n服务不可达:', error.message)
    }
    return false
  }
}

// 主测试函数
async function main() {
  console.log('🚀 开始n8n webhook URL测试')
  console.log('='.repeat(50))
  
  // 检查服务状态
  const isServiceRunning = await checkN8NService()
  
  if (!isServiceRunning) {
    console.log('\n💡 建议:')
    console.log('   1. 确保n8n服务已启动')
    console.log('   2. 检查端口5678是否被占用')
    console.log('   3. 确认n8n工作流已正确配置')
    return
  }
  
  console.log('\n' + '='.repeat(50))
  
  // 测试特定URL
  await testSpecificUrl()
  
  console.log('\n' + '='.repeat(50))
  console.log('📋 测试完成')
}

// 运行测试
main().catch(console.error)