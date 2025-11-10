import { supabase } from '../config/supabase'

// 认证状态管理
export interface AuthState {
  isAuthenticated: boolean
  user: any | null
  isLoading: boolean
  error: string | null
}

// 初始化认证状态
export const initializeAuth = async (): Promise<AuthState> => {
  try {
    console.log('初始化认证状态...')
    
    // 获取当前会话
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('获取会话失败:', error)
      return {
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: error.message
      }
    }
    
    if (session?.user) {
      console.log('检测到已登录用户:', session.user.email)
      return {
        isAuthenticated: true,
        user: session.user,
        isLoading: false,
        error: null
      }
    }
    
    console.log('未检测到登录用户')
    return {
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null
    }
  } catch (error) {
    console.error('初始化认证失败:', error)
    return {
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
}

// 监听认证状态变化
export const setupAuthListener = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    console.log('认证状态变化:', event, session?.user?.email)
    callback(event, session)
  })
}

// 登录函数
export const signIn = async (email: string, password: string) => {
  try {
    console.log('开始登录:', email)
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) {
      console.error('登录失败:', error)
      throw error
    }
    
    console.log('登录成功:', data.user?.email)
    return data
  } catch (error) {
    console.error('登录过程出错:', error)
    throw error
  }
}

// 注册函数
export const signUp = async (email: string, password: string, username?: string) => {
  try {
    console.log('开始注册:', email)
    
    const finalUsername = username || email.split('@')[0]
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: finalUsername
        }
      }
    })
    
    if (error) {
      console.error('注册失败:', error)
      throw error
    }
    
    console.log('注册成功:', data.user?.email)
    return data
  } catch (error) {
    console.error('注册过程出错:', error)
    throw error
  }
}

// 登出函数
export const signOut = async () => {
  try {
    console.log('开始登出')
    
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('登出失败:', error)
      throw error
    }
    
    console.log('登出成功')
  } catch (error) {
    console.error('登出过程出错:', error)
    throw error
  }
}

// 检查是否需要认证重定向
export const shouldRedirectToLogin = async (toPath: string): Promise<boolean> => {
  // 如果是登录或注册页面，不需要重定向
  if (toPath === '/login' || toPath === '/register' || toPath === '/forgot-password') {
    return false
  }
  
  // 检查认证状态
  const authState = await initializeAuth()
  return !authState.isAuthenticated
}