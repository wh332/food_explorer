// 简单测试Supabase连接
import { createClient } from '@supabase/supabase-js'

// 使用项目配置
const supabaseUrl = 'https://frodvnbyjnoiwyobklhp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyb2R2bmJ5am5vaXd5b2JrbGhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MzI0NzcsImV4cCI6MjA3NzIwODQ3N30.9SnLhaF2at5-NJShMKWaSF_iJ3tg-m-JBvfAoD0JJN8'

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔍 开始测试Supabase数据库连接...')
  console.log('项目URL:', supabaseUrl)
  
  try {
    // 测试1: 检查基础连接
    console.log('\n📊 测试1: 检查基础连接...')
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1)
    
    if (profilesError) {
      if (profilesError.code === 'PGRST116') {
        console.log('✅ 连接正常 - 表存在但为空')
      } else if (profilesError.code === 'PGRST301') {
        console.log('❌ 权限问题 - 需要检查RLS策略')
      } else {
        console.log('❌ 连接问题:', profilesError.message)
      }
    } else {
      console.log('✅ 连接成功 - 表中有数据')
    }
    
    // 测试2: 检查认证服务
    console.log('\n🔐 测试2: 检查认证服务...')
    const { data: authData, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.log('❌ 认证服务问题:', authError.message)
    } else {
      console.log('✅ 认证服务正常')
      console.log('当前会话:', authData.session ? '已登录' : '未登录')
    }
    
    console.log('\n🎉 Supabase连接测试完成！')
    
  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error)
  }
}

testConnection()