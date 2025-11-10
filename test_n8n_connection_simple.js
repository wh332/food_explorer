// 测试n8n连接和菜谱生成功能
import { createClient } from '@supabase/supabase-js'

// 使用项目配置
const supabaseUrl = 'https://frodvnbyjnoiwyobklhp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyb2R2bmJ5am5vaXd5b2JrbGhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MzI0NzcsImV4cCI6MjA3NzIwODQ3N30.9SnLhaF2at5-NJShMKWaSF_iJ3tg-m-JBvfAoD0JJN8'

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey)

async function testN8NConnection() {
  console.log('🔍 开始测试n8n连接和菜谱生成功能...')
  
  try {
    // 测试1: 检查n8n服务是否可达
    console.log('\n📊 测试1: 检查n8n服务连接...')
    
    const testData = {
      ingredients: ['猪肉', '白菜', '土豆', '胡萝卜'],
      cuisine: '川菜',
      difficulty: '简单',
      userId: 'test-user-' + Date.now(),
      timestamp: new Date().toISOString()
    }
    
    console.log('发送测试数据:', testData)
    
    // 直接测试n8n连接（使用与前端相同的URL）
    const response = await fetch('http://localhost:5678/webhook/recipe-generator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(testData)
    })
    
    if (!response.ok) {
      console.log('❌ n8n服务连接失败:', response.status, response.statusText)
      console.log('请确保n8n服务在 http://localhost:5678 运行')
    } else {
      const result = await response.json()
      console.log('✅ n8n服务连接成功')
      console.log('响应数据:', result)
    }
    
    // 测试2: 检查前端代理配置
    console.log('\n🌐 测试2: 检查前端代理配置...')
    console.log('前端代理路径: /api/n8n-webhook')
    console.log('实际目标: http://localhost:5678/webhook/recipe-generator')
    console.log('请确保Vite开发服务器正在运行 (npm run dev)')
    
    // 测试3: 检查Supabase连接（确保数据库正常）
    console.log('\n🗄️ 测试3: 检查Supabase连接...')
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1)
    
    if (profilesError) {
      console.log('❌ Supabase连接问题:', profilesError.message)
    } else {
      console.log('✅ Supabase连接正常')
    }
    
    console.log('\n🎉 n8n连接测试完成！')
    console.log('\n📋 下一步操作:')
    console.log('1. 确保n8n服务在 http://localhost:5678 运行')
    console.log('2. 启动前端开发服务器: npm run dev')
    console.log('3. 在浏览器中测试菜谱生成功能')
    
  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error)
    console.log('\n🔧 可能的问题:')
    console.log('- n8n服务未启动')
    console.log('- 端口5678被占用')
    console.log('- 网络连接问题')
  }
}

testN8NConnection()