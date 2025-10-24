import { defineStore } from 'pinia'
import { ref } from 'vue'
import { PhotoService } from '../services/photoService'
import type { UserPhoto } from '../config/supabase'

export const useUserStore = defineStore('user', () => {
  const userPhotos = ref<UserPhoto[]>([])
  const currentAvatar = ref<UserPhoto | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 加载用户照片
  const loadUserPhotos = async (userId: string = 'anonymous') => {
    isLoading.value = true
    error.value = null
    
    try {
      const photos = await PhotoService.getUserPhotos(userId)
      userPhotos.value = photos
      
      // 加载当前头像
      const avatar = await PhotoService.getUserAvatar(userId)
      currentAvatar.value = avatar
    } catch (err: any) {
      error.value = err.message || '加载照片失败'
      console.error('加载用户照片失败:', err)
    } finally {
      isLoading.value = false
    }
  }

  // 上传用户照片
  const uploadUserPhoto = async (file: File, userId: string = 'anonymous') => {
    isLoading.value = true
    error.value = null
    
    try {
      const newPhoto = await PhotoService.uploadUserPhoto(file, userId)
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
  const setUserAvatar = async (photoId: string, userId: string = 'anonymous') => {
    isLoading.value = true
    error.value = null
    
    try {
      await PhotoService.setUserAvatar(photoId, userId)
      
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
  const deleteUserPhoto = async (photoId: string, fileName: string, _userId: string = 'anonymous') => {
    isLoading.value = true
    error.value = null
    
    try {
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

  // 清除错误
  const clearError = () => {
    error.value = null
  }

  return {
    userPhotos,
    currentAvatar,
    isLoading,
    error,
    loadUserPhotos,
    uploadUserPhoto,
    setUserAvatar,
    deleteUserPhoto,
    clearError
  }
})