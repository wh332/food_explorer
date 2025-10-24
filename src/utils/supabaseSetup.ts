import { supabase } from '../config/supabase'

// Supabase初始化检查
export async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('user_photos').select('count').limit(1)
    
    if (error) {
      console.warn('Supabase连接检查失败:', error)
      return {
        connected: false,
        error: error.message
      }
    }
    
    console.log('Supabase连接成功')
    return {
      connected: true,
      data: data
    }
  } catch (error) {
    console.error('Supabase连接异常:', error)
    return {
      connected: false,
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
}

// 检查存储桶权限
export async function checkStoragePermissions() {
  try {
    const testFile = new File(['test'], 'test.txt', { type: 'text/plain' })
    const { error } = await supabase.storage
      .from('user-photos')
      .upload('test-file.txt', testFile)
    
    if (error && error.message.includes('Bucket not found')) {
      return {
        hasPermission: false,
        error: '存储桶不存在，请在Supabase控制台创建存储桶'
      }
    }
    
    return {
      hasPermission: true
    }
  } catch (error) {
    return {
      hasPermission: false,
      error: error instanceof Error ? error.message : '权限检查失败'
    }
  }
}

// 初始化检查
export async function initializeSupabase() {
  console.log('正在初始化Supabase连接...')
  
  const connectionResult = await checkSupabaseConnection()
  const storageResult = await checkStoragePermissions()
  
  return {
    database: connectionResult,
    storage: storageResult
  }
}