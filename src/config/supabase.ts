import { createClient } from '@supabase/supabase-js'

// Supabase配置 - 使用正确的项目配置
const supabaseUrl = 'https://frodvnbyjnoiwyobklhp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyb2R2bmJ5am5vaXd5b2JrbGhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MzI0NzcsImV4cCI6MjA3NzIwODQ3N30.9SnLhaF2at5-NJShMKWaSF_iJ3tg-m-JBvfAoD0JJN8'

// 创建Supabase客户端
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true, // 启用自动刷新
    persistSession: true, // 启用持久化会话
    detectSessionInUrl: true,
    flowType: 'pkce', // 使用更安全的PKCE流程
    storageKey: 'food-explorer-auth-v2' // 使用新的存储键避免缓存冲突
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'Cache-Control': 'no-cache'
    }
  }
})

// 数据库表结构定义
export interface UserProfile {
  id?: string
  user_id: string
  username: string
  email: string
  full_name?: string
  bio?: string
  avatar_url?: string
  location?: string
  website?: string
  preferences?: Record<string, any>
  created_at?: string
  updated_at?: string
}

export interface UserPhoto {
  id?: string
  user_id?: string
  cuisine_name?: string
  file_name: string
  file_url: string
  file_size: number
  upload_date: string
  is_avatar: boolean
  created_at?: string
}

export interface CuisineData {
  id?: string
  name: string
  description: string
  characteristics: string[]
  representative_dishes: string[]
  created_at?: string
}

// 存储桶名称
export const BUCKET_NAMES = {
  USER_PHOTOS: 'user-photos',
  CUISINE_PHOTOS: 'cuisine-photos'
}

// 错误处理
export class SupabaseError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message)
    this.name = 'SupabaseError'
  }
}