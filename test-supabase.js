// 测试Supabase连接
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://frodvnbyjnoiwyobklhp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyb2R2bmJ5am5vaXd5b2JrbGhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MzI0NzcsImV4cCI6MjA3NzIwODQ3N30.9SnLhaF2at5-NJShMKWaSF_iJ3tg-m-JBvfAoD0JJN8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('正在测试Supabase连接...')
  
  try {
    // 测试获取会话
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('❌ Supabase连接失败:', error.message)
      console.error('错误详情:', error)
    } else {
      console.log('✅ Supabase连接成功!')
      console.log('会话状态:', session ? '已登录' : '未登录')
      if (session) {
        console.log('用户邮箱:', session.user.email)
      }
    }
    
    // 测试数据库查询
    const { data: cuisines, error: dbError } = await supabase
      .from('cuisines')
      .select('*')
      .limit(1)
    
    if (dbError) {
      console.error('❌ 数据库查询失败:', dbError.message)
    } else {
      console.log('✅ 数据库查询成功!')
      console.log('菜系数据:', cuisines)
    }
    
  } catch (err) {
    console.error('❌ 测试过程中发生错误:', err)
  }
}

testConnection()