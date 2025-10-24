import { createClient } from '@supabase/supabase-js'

// Supabase配置 - 使用默认配置
const supabaseUrl = 'https://dpmpxpsbwssmoshpruup.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwbXB4cHNid3NzbW9zaHBydXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NTY2NjUsImV4cCI6MjA3NjEzMjY2NX0.LHByt25fw0XIi4rQkonSsP7Z_rMyG46VspZ0_zkpNV0'

// 创建Supabase客户端
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'apikey': supabaseKey
    }
  }
})

// 数据库表结构定义
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