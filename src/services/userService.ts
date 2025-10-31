import { supabase, UserProfile, SupabaseError } from '../config/supabase'

export class UserService {
  // 创建用户信息
  static async createUserProfile(userId: string, email: string, username: string, additionalData?: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const userProfile: UserProfile = {
        user_id: userId,
        username: username,
        email: email,
        full_name: additionalData?.full_name || '',
        bio: additionalData?.bio || '',
        avatar_url: additionalData?.avatar_url || '',
        location: additionalData?.location || '',
        website: additionalData?.website || '',
        preferences: additionalData?.preferences || {}
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .insert(userProfile)
        .select()
        .single()

      if (error) {
        throw new SupabaseError('创建用户信息失败', error)
      }

      return data
    } catch (error) {
      console.error('创建用户信息失败:', error)
      throw error
    }
  }

  // 获取用户信息
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // 用户信息不存在
          return null
        }
        throw new SupabaseError('获取用户信息失败', error)
      }

      return data
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw error
    }
  }

  // 更新用户信息
  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        throw new SupabaseError('更新用户信息失败', error)
      }

      return data
    } catch (error) {
      console.error('更新用户信息失败:', error)
      throw error
    }
  }

  // 检查用户名是否可用
  static async isUsernameAvailable(username: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('username')
        .eq('username', username)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // 用户名可用
          return true
        }
        throw new SupabaseError('检查用户名失败', error)
      }

      // 用户名已存在
      return false
    } catch (error) {
      console.error('检查用户名失败:', error)
      throw error
    }
  }

  // 根据用户名搜索用户
  static async searchUsersByUsername(username: string, limit: number = 10): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .ilike('username', `%${username}%`)
        .limit(limit)

      if (error) {
        throw new SupabaseError('搜索用户失败', error)
      }

      return data || []
    } catch (error) {
      console.error('搜索用户失败:', error)
      throw error
    }
  }

  // 获取用户统计信息
  static async getUserStats(userId: string): Promise<{
    photoCount: number
    favoriteCount: number
    joinedDays: number
  }> {
    try {
      // 获取用户照片数量
      const { count: photoCount, error: photoError } = await supabase
        .from('user_photos')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      if (photoError) {
        throw new SupabaseError('获取照片统计失败', photoError)
      }

      // 获取用户收藏数量
      const { count: favoriteCount, error: favoriteError } = await supabase
        .from('user_favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      if (favoriteError) {
        throw new SupabaseError('获取收藏统计失败', favoriteError)
      }

      // 获取用户加入天数
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('created_at')
        .eq('user_id', userId)
        .single()

      if (profileError) {
        throw new SupabaseError('获取用户信息失败', profileError)
      }

      const joinedDays = userProfile?.created_at 
        ? Math.floor((Date.now() - new Date(userProfile.created_at).getTime()) / (1000 * 60 * 60 * 24))
        : 0

      return {
        photoCount: photoCount || 0,
        favoriteCount: favoriteCount || 0,
        joinedDays
      }
    } catch (error) {
      console.error('获取用户统计失败:', error)
      throw error
    }
  }

  // 删除用户信息（管理员功能）
  static async deleteUserProfile(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('user_id', userId)

      if (error) {
        throw new SupabaseError('删除用户信息失败', error)
      }
    } catch (error) {
      console.error('删除用户信息失败:', error)
      throw error
    }
  }

  // 批量获取用户信息
  static async getMultipleUserProfiles(userIds: string[]): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .in('user_id', userIds)

      if (error) {
        throw new SupabaseError('批量获取用户信息失败', error)
      }

      return data || []
    } catch (error) {
      console.error('批量获取用户信息失败:', error)
      throw error
    }
  }
}