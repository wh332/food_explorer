<template>
  <div class="profile">
    <div class="container">
      <div class="page-header">
        <h1>我的照片</h1>
        <p>上传和管理您的个人照片</p>
      </div>

      <div class="profile-content">
        <!-- 照片上传区域 -->
        <div class="upload-section">
          <div class="upload-area" @click="triggerFileInput" @drop="handleDrop" @dragover.prevent>
            <input 
              ref="fileInput"
              type="file" 
              accept="image/*" 
              @change="handleFileSelect"
              style="display: none"
            >
            <div class="upload-icon">📷</div>
            <h3>点击或拖拽照片到这里</h3>
            <p>支持 JPG、PNG 格式，最大 5MB</p>
          </div>
          
          <div class="upload-progress" v-if="uploadProgress > 0">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
            </div>
            <span>上传中... {{ uploadProgress }}%</span>
          </div>
        </div>

        <!-- 加载状态 -->
        <div class="loading-section" v-if="userStore.isLoading && userStore.userPhotos.length === 0">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>

        <!-- 错误提示 -->
        <div class="error-section" v-if="userStore.error">
          <div class="error-message">
            <span class="error-icon">⚠️</span>
            <p>{{ userStore.error }}</p>
            <button @click="userStore.clearError()" class="retry-btn">重试</button>
          </div>
        </div>

        <!-- 照片预览区域 -->
        <div class="photos-section" v-if="userStore.userPhotos.length > 0">
          <h2>我的照片集</h2>
          <div class="photos-grid">
            <div v-for="(photo, index) in userStore.userPhotos" :key="photo.id" class="photo-card">
              <div class="photo-container">
                <img :src="photo.file_url" :alt="photo.file_name" class="photo-image">
                <div class="photo-overlay">
                  <button @click="deletePhoto(index)" class="delete-btn">🗑️</button>
                  <button @click="setAsAvatar(index)" class="avatar-btn">设为头像</button>
                </div>
              </div>
              <div class="photo-info">
                <span class="photo-name">{{ photo.file_name }}</span>
                <span class="photo-size">{{ formatFileSize(photo.file_size) }}</span>
                <span class="photo-date">{{ formatDate(new Date(photo.upload_date)) }}</span>
                <span v-if="photo.is_avatar" class="avatar-badge">头像</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 当前头像显示 -->
        <div class="avatar-section" v-if="userStore.currentAvatar">
          <h2>当前头像</h2>
          <div class="avatar-display">
            <img :src="userStore.currentAvatar.file_url" alt="头像" class="avatar-image">
            <div class="avatar-info">
              <h3>{{ userStore.currentAvatar.file_name }}</h3>
              <p>上传于 {{ formatDate(new Date(userStore.currentAvatar.upload_date)) }}</p>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div class="empty-state" v-if="!userStore.isLoading && userStore.userPhotos.length === 0">
          <div class="empty-icon">📸</div>
          <h3>还没有上传照片</h3>
          <p>上传您的第一张照片开始个性化您的个人资料</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/userStore'

const userStore = useUserStore()
const fileInput = ref<HTMLInputElement>()
const uploadProgress = ref(0)

// 从Supabase加载照片数据
onMounted(async () => {
  console.log('加载用户照片...')
  await userStore.loadUserPhotos()
  
  // 检查Supabase连接状态
  const { initializeSupabase } = await import('../utils/supabaseSetup')
  const result = await initializeSupabase()
  console.log('Supabase初始化结果:', result)
})

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    processFile(target.files[0])
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer?.files) {
    processFile(event.dataTransfer.files[0])
  }
}

const processFile = async (file: File) => {
  // 检查文件类型和大小
  if (!file.type.startsWith('image/')) {
    alert('请选择图片文件')
    return
  }
  
  if (file.size > 5 * 1024 * 1024) {
    alert('文件大小不能超过 5MB')
    return
  }

  // 直接上传，不使用进度条
  try {
    await userStore.uploadUserPhoto(file)
    // 重新加载照片列表
    await userStore.loadUserPhotos()
  } catch (error) {
    alert('照片上传失败: ' + (error instanceof Error ? error.message : '未知错误'))
    console.error('上传失败:', error)
  }
}

const deletePhoto = async (index: number) => {
  const photo = userStore.userPhotos[index]
  
  if (confirm(`确定要删除照片 "${photo.file_name}" 吗？`)) {
    try {
      await userStore.deleteUserPhoto(photo.id!, photo.file_name)
    } catch (error) {
      alert('删除照片失败，请重试')
      console.error('删除失败:', error)
    }
  }
}

const setAsAvatar = async (index: number) => {
  const photo = userStore.userPhotos[index]
  try {
    await userStore.setUserAvatar(photo.id!)
  } catch (error) {
    alert('设置头像失败，请重试')
    console.error('设置头像失败:', error)
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.profile {
  padding: 40px 0;
  min-height: 100vh;
  background: #f8f9fa;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 3rem;
  color: #333;
  margin-bottom: 10px;
}

.page-header p {
  font-size: 1.2rem;
  color: #666;
}

.profile-content {
  max-width: 1000px;
  margin: 0 auto;
}

.upload-section {
  background: white;
  border-radius: 16px;
  padding: 40px;
  margin-bottom: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.upload-area {
  border: 2px dashed #e9ecef;
  border-radius: 12px;
  padding: 60px 40px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-area:hover {
  border-color: #4CAF50;
  background: #f8fff8;
}

.upload-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.upload-area h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
}

.upload-area p {
  color: #666;
  margin: 0;
}

.upload-progress {
  margin-top: 20px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  transition: width 0.3s ease;
}

.photos-section, .avatar-section {
  background: white;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.photos-section h2, .avatar-section h2 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 20px;
  border-bottom: 2px solid #4CAF50;
  padding-bottom: 10px;
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.photo-card {
  border: 1px solid #e9ecef;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.photo-card:hover {
  transform: translateY(-5px);
}

.photo-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.photo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.photo-card:hover .photo-overlay {
  opacity: 1;
}

.delete-btn, .avatar-btn {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.delete-btn:hover {
  background: #ff6b6b;
  color: white;
}

.avatar-btn:hover {
  background: #4CAF50;
  color: white;
}

.photo-info {
  padding: 15px;
}

.photo-name {
  display: block;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.photo-size, .photo-date {
  display: block;
  font-size: 0.9rem;
  color: #666;
}

.avatar-display {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: #f8fff8;
  border-radius: 12px;
}

.avatar-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #4CAF50;
}

.avatar-info h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.avatar-info p {
  margin: 0;
  color: #666;
}

.avatar-badge {
  background: #4CAF50;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  margin-left: 10px;
}

.loading-section {
  text-align: center;
  padding: 60px 40px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-section {
  background: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 10px;
}

.error-icon {
  font-size: 1.5rem;
}

.retry-btn {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.empty-state {
  text-align: center;
  padding: 60px 40px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
}

.empty-state p {
  color: #666;
  margin: 0;
}

@media (max-width: 768px) {
  .photos-grid {
    grid-template-columns: 1fr;
  }
  
  .avatar-display {
    flex-direction: column;
    text-align: center;
  }
  
  .upload-area {
    padding: 40px 20px;
  }
}
</style>