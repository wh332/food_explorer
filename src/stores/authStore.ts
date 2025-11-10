import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { signIn, signUp, signOut, initializeAuth, setupAuthListener, type AuthState } from '../utils/auth'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const user = ref<any>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 初始化认证状态
  const initialize = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const authState = await initializeAuth()
      
      isAuthenticated.value = authState.isAuthenticated
      user.value = authState.user
      error.value = authState.error
      
      console.log('认证状态初始化完成:', {
        isAuthenticated: isAuthenticated.value,
        userEmail: user.value?.email
      })
    } catch (err) {
      console.error('初始化认证状态失败:', err)
      error.value = err instanceof Error ? err.message : '初始化失败'
    } finally {
      isLoading.value = false
    }
  }

  // 设置认证状态监听器
  const setupListener = () => {
    return setupAuthListener((event, session) => {
      console.log('认证状态监听器触发:', event)
      
      if (event === 'SIGNED_IN' && session?.user) {
        isAuthenticated.value = true
        user.value = session.user
        error.value = null
        console.log('用户已登录:', session.user.email)
      } else if (event === 'SIGNED_OUT') {
        isAuthenticated.value = false
        user.value = null
        error.value = null
        console.log('用户已登出')
      }
    })
  }

  // 登录
  const login = async (email: string, password: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const result = await signIn(email, password)
      
      if (result.user) {
        isAuthenticated.value = true
        user.value = result.user
        console.log('登录成功:', result.user.email)
      }
      
      return result
    } catch (err: any) {
      console.error('登录失败:', err)
      error.value = err.message || '登录失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 注册
  const register = async (email: string, password: string, username?: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const result = await signUp(email, password, username)
      
      if (result.user) {
        isAuthenticated.value = true
        user.value = result.user
        console.log('注册成功:', result.user.email)
      }
      
      return result
    } catch (err: any) {
      console.error('注册失败:', err)
      error.value = err.message || '注册失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 登出
  const logout = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      await signOut()
      
      isAuthenticated.value = false
      user.value = null
      console.log('登出成功')
    } catch (err: any) {
      console.error('登出失败:', err)
      error.value = err.message || '登出失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 清除错误
  const clearError = () => {
    error.value = null
  }

  return {
    // 状态
    isAuthenticated: computed(() => isAuthenticated.value),
    user: computed(() => user.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    
    // 方法
    initialize,
    setupListener,
    login,
    register,
    logout,
    clearError
  }
})