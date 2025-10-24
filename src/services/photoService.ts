import { supabase, BUCKET_NAMES, UserPhoto, SupabaseError } from '../config/supabase'

export class PhotoService {
  // 上传用户照片 - 优先使用本地存储，Supabase作为备用方案
  static async uploadUserPhoto(file: File, userId: string = 'anonymous'): Promise<UserPhoto> {
    try {
      // 首先尝试本地存储
      return await this.uploadToLocalStorage(file, userId)
    } catch (error) {
      console.warn('本地存储上传失败，尝试Supabase:', error)
      // 如果本地存储失败，尝试Supabase
      try {
        // 生成唯一文件名
        const fileName = `${userId}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
        
        // 上传文件到存储桶
        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAMES.USER_PHOTOS)
          .upload(fileName, file)
        
        if (uploadError) {
          throw new SupabaseError('Supabase存储上传失败', uploadError)
        }
        
        // 获取文件公开URL
        const { data: urlData } = supabase.storage
          .from(BUCKET_NAMES.USER_PHOTOS)
          .getPublicUrl(fileName)
        
        // 创建照片记录
        const photoRecord: UserPhoto = {
          id: `supabase_${Date.now()}`,
          user_id: userId,
          file_name: file.name,
          file_url: urlData.publicUrl,
          file_size: file.size,
          upload_date: new Date().toISOString(),
          is_avatar: false,
          created_at: new Date().toISOString()
        }
        
        console.log('照片上传成功到Supabase:', photoRecord)
        return photoRecord
      } catch (supabaseError) {
        console.error('所有上传方式都失败了:', supabaseError)
        throw new SupabaseError('照片上传失败，请检查网络连接或联系管理员', supabaseError)
      }
    }
  }

  // 本地存储方案
  private static async uploadToLocalStorage(file: File, userId: string = 'anonymous'): Promise<UserPhoto> {
    return new Promise((resolve, reject) => {
      try {
        // 检查文件大小
        if (file.size > 5 * 1024 * 1024) {
          reject(new Error('文件大小不能超过5MB'))
          return
        }
        
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const photoData: UserPhoto = {
              id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              user_id: userId,
              file_name: file.name,
              file_url: e.target?.result as string,
              file_size: file.size,
              upload_date: new Date().toISOString(),
              is_avatar: false,
              created_at: new Date().toISOString()
            }
            
            // 保存到本地存储
            const existingPhotos = JSON.parse(localStorage.getItem('supabase_user_photos') || '[]')
            existingPhotos.push(photoData)
            localStorage.setItem('supabase_user_photos', JSON.stringify(existingPhotos))
            
            console.log('照片成功保存到本地存储:', photoData)
            resolve(photoData)
          } catch (storageError) {
            reject(new Error('本地存储保存失败: ' + storageError))
          }
        }
        
        reader.onerror = () => reject(new Error('文件读取失败'))
        reader.onabort = () => reject(new Error('文件读取被中止'))
        reader.readAsDataURL(file)
      } catch (error) {
        reject(new SupabaseError('本地存储上传失败', error))
      }
    })
  }



  // 获取用户照片 - 优先使用本地存储
  static async getUserPhotos(userId: string = 'anonymous'): Promise<UserPhoto[]> {
    try {
      // 首先从本地存储获取
      const localPhotos = JSON.parse(localStorage.getItem('supabase_user_photos') || '[]')
      const userPhotos = localPhotos.filter((photo: UserPhoto) => photo.user_id === userId)
      
      if (userPhotos.length > 0) {
        return userPhotos.sort((a: UserPhoto, b: UserPhoto) => 
          new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime()
        )
      }
      
      // 如果本地存储为空，尝试从Supabase获取
      console.log('本地存储为空，尝试从Supabase获取照片')
      const { data, error } = await supabase
        .from('user_photos')
        .select('*')
        .eq('user_id', userId)
        .order('upload_date', { ascending: false })
      
      if (!error && data) {
        return data
      }
      
      return []
    } catch (error) {
      console.warn('获取照片失败，使用空数组:', error)
      return []
    }
  }



  // 删除照片 - 优先使用本地存储
  static async deletePhoto(photoId: string, bucketName: string, fileName: string): Promise<void> {
    try {
      // 首先从本地存储删除
      const localPhotos = JSON.parse(localStorage.getItem('supabase_user_photos') || '[]')
      const updatedPhotos = localPhotos.filter((photo: UserPhoto) => photo.id !== photoId)
      localStorage.setItem('supabase_user_photos', JSON.stringify(updatedPhotos))
      
      // 如果是Supabase照片，尝试从云端删除
      if (!photoId.startsWith('local_')) {
        try {
          // 从存储桶删除文件
          const { error: storageError } = await supabase.storage
            .from(bucketName)
            .remove([fileName])
          
          if (!storageError) {
            // 从数据库删除记录
            await supabase
              .from(bucketName === BUCKET_NAMES.USER_PHOTOS ? 'user_photos' : 'cuisine_photos')
              .delete()
              .eq('id', photoId)
          }
        } catch (supabaseError) {
          console.warn('Supabase删除失败，但本地存储已删除:', supabaseError)
        }
      }
    } catch (error) {
      throw new SupabaseError('照片删除失败', error)
    }
  }

  // 设置用户头像 - 优先使用本地存储
  static async setUserAvatar(photoId: string, userId: string = 'anonymous'): Promise<void> {
    try {
      // 首先更新本地存储
      const localPhotos = JSON.parse(localStorage.getItem('supabase_user_photos') || '[]')
      const updatedPhotos = localPhotos.map((photo: UserPhoto) => ({
        ...photo,
        is_avatar: photo.id === photoId && photo.user_id === userId
      }))
      
      localStorage.setItem('supabase_user_photos', JSON.stringify(updatedPhotos))
      
      // 如果是Supabase照片，尝试更新云端
      if (!photoId.startsWith('local_')) {
        try {
          // 先取消所有现有头像
          await supabase
            .from('user_photos')
            .update({ is_avatar: false })
            .eq('user_id', userId)
          
          // 设置新头像
          await supabase
            .from('user_photos')
            .update({ is_avatar: true })
            .eq('id', photoId)
        } catch (supabaseError) {
          console.warn('Supabase头像设置失败，但本地存储已更新:', supabaseError)
        }
      }
    } catch (error) {
      throw new SupabaseError('设置头像失败', error)
    }
  }

  // 获取用户头像 - 优先使用本地存储
  static async getUserAvatar(userId: string = 'anonymous'): Promise<UserPhoto | null> {
    try {
      // 首先从本地存储获取
      const localPhotos = JSON.parse(localStorage.getItem('supabase_user_photos') || '[]')
      const avatar = localPhotos.find((photo: UserPhoto) => 
        photo.user_id === userId && photo.is_avatar
      )
      
      if (avatar) {
        return avatar
      }
      
      // 如果本地存储没有头像，尝试从Supabase获取
      const { data, error } = await supabase
        .from('user_photos')
        .select('*')
        .eq('user_id', userId)
        .eq('is_avatar', true)
        .single()
      
      if (!error && data) {
        return data
      }
      
      return null
    } catch (error) {
      console.warn('获取头像失败:', error)
      return null
    }
  }
}