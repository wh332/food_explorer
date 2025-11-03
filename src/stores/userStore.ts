import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { PhotoService } from '../services/photoService'
import { UserService } from '../services/userService'
import { supabase } from '../config/supabase'
import type { UserPhoto, UserProfile } from '../config/supabase'

export interface User {
  id: string
  email: string
  username?: string
  avatar_url?: string
  created_at?: string
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const userPhotos = ref<UserPhoto[]>([])
  const currentAvatar = ref<UserPhoto | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isAuthenticated = computed(() => !!user.value)

  // 初始化用户状态
  const initializeAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('获取会话失败:', error)
        return
      }
      
      if (session?.user) {
        console.log('检测到已登录用户:', session.user.email)
        // 加载用户信息
        try {
          const userProfile = await UserService.getUserProfile(session.user.id)
          
          user.value = {
            id: session.user.id,
            email: session.user.email!,
            username: userProfile?.username || session.user.user_metadata?.username
          }
          console.log('用户信息加载成功')
        } catch (profileError) {
          console.error('加载用户信息失败:', profileError)
          // 即使加载失败，也设置基本用户信息
          user.value = {
            id: session.user.id,
            email: session.user.email!,
            username: session.user.user_metadata?.username
          }
        }
      } else {
        console.log('未检测到登录用户')
        user.value = null
      }
    } catch (err) {
      console.error('初始化认证失败:', err)
    }
  }

  // 监听认证状态变化
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      try {
        // 加载用户信息
        const userProfile = await UserService.getUserProfile(session.user.id)
        
        user.value = {
          id: session.user.id,
          email: session.user.email!,
          username: userProfile?.username || session.user.user_metadata?.username
        }
      } catch (error) {
        console.error('加载用户信息失败:', error)
        // 即使加载失败，也设置基本用户信息
        user.value = {
          id: session.user.id,
          email: session.user.email!,
          username: session.user.user_metadata?.username
        }
      }
    } else if (event === 'SIGNED_OUT') {
      user.value = null
      userPhotos.value = []
      currentAvatar.value = null
    }
  })

  // 用户注册
  const signUp = async (email: string, password: string, username?: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const finalUsername = username || email.split('@')[0]
      
      // 检查用户名是否可用
      const isAvailable = await UserService.isUsernameAvailable(finalUsername)
      if (!isAvailable) {
        throw new Error('用户名已被使用，请选择其他用户名')
      }
      
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: finalUsername
          }
        }
      })
      
      if (authError) throw authError
      
      if (data.user) {
        // 创建用户信息记录
        await UserService.createUserProfile(data.user.id, email, finalUsername)
        
        user.value = {
          id: data.user.id,
          email: data.user.email!,
          username: finalUsername
        }
      }
      
      return data
    } catch (err: any) {
      error.value = err.message || '注册失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 用户登录
  const signIn = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      // 如果是因为邮箱未确认导致的错误，提供明确的解决方案
      if (authError && authError.message === 'Email not confirmed') {
        // 提供两种解决方案给用户
        throw new Error('邮箱未确认。请：1) 检查邮箱并点击确认链接，或 2) 在Supabase控制台禁用邮箱确认功能')
      }
      
      if (authError) throw authError
      
      if (data.user) {
        // 加载用户信息
        const userProfile = await UserService.getUserProfile(data.user.id)
        
        user.value = {
          id: data.user.id,
          email: data.user.email!,
          username: userProfile?.username || data.user.user_metadata?.username
        }
      }
      
      return data
    } catch (err: any) {
      error.value = err.message || '登录失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 用户登出
  const signOut = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const { error: authError } = await supabase.auth.signOut()
      if (authError) throw authError
      
      user.value = null
      userPhotos.value = []
      currentAvatar.value = null
    } catch (err: any) {
      error.value = err.message || '登出失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 重置密码
  const resetPassword = async (email: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email)
      if (authError) throw authError
    } catch (err: any) {
      error.value = err.message || '密码重置邮件发送失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 加载用户照片
  const loadUserPhotos = async (userId?: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const currentUserId = userId || user.value?.id
      if (!currentUserId) {
        userPhotos.value = []
        currentAvatar.value = null
        return
      }
      
      const photos = await PhotoService.getUserPhotos(currentUserId)
      userPhotos.value = photos
      
      // 加载当前头像
      const avatar = await PhotoService.getUserAvatar(currentUserId)
      currentAvatar.value = avatar
    } catch (err: any) {
      error.value = err.message || '加载照片失败'
      console.error('加载用户照片失败:', err)
    } finally {
      isLoading.value = false
    }
  }

  // 上传用户照片
  const uploadUserPhoto = async (file: File, userId?: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const currentUserId = userId || user.value?.id
      if (!currentUserId) {
        throw new Error('请先登录后再上传照片')
      }
      
      const newPhoto = await PhotoService.uploadUserPhoto(file, currentUserId)
      userPhotos.value.unshift(newPhoto)
      return newPhoto
    } catch (err: any) {
      error.value = err.message || '上传照片失败'
      console.error('上传用户照片失败:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 设置用户头像
  const setUserAvatar = async (photoId: string, userId?: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const currentUserId = userId || user.value?.id
      if (!currentUserId) {
        throw new Error('请先登录后再设置头像')
      }
      
      await PhotoService.setUserAvatar(photoId, currentUserId)
      
      // 更新本地状态
      userPhotos.value.forEach((photo: UserPhoto) => {
        photo.is_avatar = photo.id === photoId
      })
      
      currentAvatar.value = userPhotos.value.find((photo: UserPhoto) => photo.id === photoId) || null
    } catch (err: any) {
      error.value = err.message || '设置头像失败'
      console.error('设置用户头像失败:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 删除用户照片
  const deleteUserPhoto = async (photoId: string, fileName: string, userId?: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const currentUserId = userId || user.value?.id
      if (!currentUserId) {
        throw new Error('请先登录后再删除照片')
      }
      
      await PhotoService.deletePhoto(photoId, 'user-photos', fileName)
      
      // 更新本地状态
      const index = userPhotos.value.findIndex((photo: UserPhoto) => photo.id === photoId)
      if (index !== -1) {
        userPhotos.value.splice(index, 1)
      }
      
      // 如果删除的是当前头像，清空头像
      if (currentAvatar.value?.id === photoId) {
        currentAvatar.value = null
      }
    } catch (err: any) {
      error.value = err.message || '删除照片失败'
      console.error('删除用户照片失败:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 更新用户信息
  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    isLoading.value = true
    error.value = null
    
    try {
      if (!user.value) {
        throw new Error('请先登录后再更新用户信息')
      }
      
      const updatedProfile = await UserService.updateUserProfile(user.value.id, updates)
      
      // 更新本地用户状态
      if (updatedProfile.username) {
        user.value.username = updatedProfile.username
      }
      
      return updatedProfile
    } catch (err: any) {
      error.value = err.message || '更新用户信息失败'
      console.error('更新用户信息失败:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 检查用户名是否可用
  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    try {
      return await UserService.isUsernameAvailable(username)
    } catch (err: any) {
      error.value = err.message || '检查用户名失败'
      console.error('检查用户名失败:', err)
      throw err
    }
  }

  // 获取用户统计信息
  const getUserStats = async (userId?: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const currentUserId = userId || user.value?.id
      if (!currentUserId) {
        throw new Error('请先登录后再获取统计信息')
      }
      
      return await UserService.getUserStats(currentUserId)
    } catch (err: any) {
      error.value = err.message || '获取用户统计失败'
      console.error('获取用户统计失败:', err)
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
    user,
    userPhotos,
    currentAvatar,
    isLoading,
    error,
    isAuthenticated,
    initializeAuth,
    signUp,
    signIn,
    signOut,
    resetPassword,
    loadUserPhotos,
    uploadUserPhoto,
    setUserAvatar,
    deleteUserPhoto,
    updateUserProfile,
    checkUsernameAvailability,
    getUserStats,
    clearError
  }
})