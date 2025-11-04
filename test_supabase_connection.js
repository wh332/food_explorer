// 测试Supabase数据库连接
import { createClient } from '@supabase/supabase-js'

// 使用项目配置
const supabaseUrl = 'https://frodvnbyjnoiwyobklhp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyb2R2bmJ5am5vaXd5b2JrbGhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MzI0NzcsImV4cCI6MjA3NzIwODQ3N30.9SnLhaF2at5-NJShMKWaSF_iJ3tg-m-JBvfAoD0JJN8'

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storageKey: 'food-explorer-auth-v2'
  },
  global: {
    headers: {
      'Cache-Control': 'no-cache',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'apikey': supabaseKey
    }
  }
})

async function testConnection() {
  console.log('🔍 开始测试Supabase数据库连接...')
  console.log('项目URL:', supabaseUrl)
  console.log('API密钥:', supabaseKey.substring(0, 20) + '...')
  
  try {
    // 测试1: 检查数据库连接
    console.log('\n📊 测试1: 检查数据库连接...')
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(5)
    
    if (tablesError) {
      console.error('❌ 数据库连接失败:', tablesError)
      return
    }
    
    console.log('✅ 数据库连接成功')
    console.log('可用的表:', tables?.map(t => t.table_name).join(', ') || '无')
    
    // 测试2: 检查user_profiles表
    console.log('\n👤 测试2: 检查user_profiles表...')
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1)
    
    if (profilesError) {
      console.error('❌ user_profiles表查询失败:', profilesError)
    } else {
      console.log('✅ user_profiles表访问成功')
      console.log('表中有记录数:', profiles?.length || 0)
    }
    
    // 测试3: 检查认证状态
    console.log('\n🔐 测试3: 检查认证状态...')
    const { data: authData, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.error('❌ 认证检查失败:', authError)
    } else {
      console.log('✅ 认证服务正常')
      console.log('当前会话:', authData.session ? '已登录' : '未登录')
    }
    
    // 测试4: 测试插入操作（只测试，不实际插入）
    console.log('\n📝 测试4: 测试插入权限...')
    const testData = {
      user_id: 'test-user-id-' + Date.now(),
      email: 'test@example.com',
      username: 'testuser'
    }
    
    const { error: insertError } = await supabase
      .from('user_profiles')
      .insert(testData)
      .select()
    
    if (insertError) {
      if (insertError.code === '23505') {
        console.log('✅ 插入权限正常（主键冲突是预期的）')
      } else {
        console.log('插入测试结果:', insertError.message)
      }
    }
    
    console.log('\n🎉 Supabase数据库连接测试完成！')
    
  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error)
  }
}

testConnection()