<template>
  <div class="forgot-password">
    <div class="container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>重置密码</h1>
          <p>请输入您的邮箱地址，我们将发送重置密码的链接</p>
        </div>

        <form @submit.prevent="handleResetPassword" class="auth-form">
          <div class="form-group">
            <label for="email">邮箱地址</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="请输入您的邮箱"
              :class="{ error: errors.email }"
            >
            <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
          </div>

          <button type="submit" class="btn btn-primary" :disabled="userStore.isLoading">
            <span v-if="userStore.isLoading" class="loading-spinner"></span>
            {{ userStore.isLoading ? '发送中...' : '发送重置链接' }}
          </button>

          <div v-if="userStore.error" class="error-message">
            <span class="error-icon">⚠️</span>
            {{ userStore.error }}
          </div>

          <div v-if="resetSuccess" class="success-message">
            <span class="success-icon">✅</span>
            重置密码链接已发送到您的邮箱，请检查您的收件箱。
          </div>
        </form>

        <div class="auth-footer">
          <p>想起密码了？ <router-link to="/login" class="auth-link">返回登录</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'

const router = useRouter()
const userStore = useUserStore()

const form = reactive({
  email: ''
})

const errors = reactive({
  email: ''
})

const resetSuccess = ref(false)

const validateForm = () => {
  let isValid = true
  
  // 清除之前的错误
  errors.email = ''
  
  // 邮箱验证
  if (!form.email) {
    errors.email = '请输入邮箱地址'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = '请输入有效的邮箱地址'
    isValid = false
  }
  
  return isValid
}

const handleResetPassword = async () => {
  if (!validateForm()) return
  
  try {
    await userStore.resetPassword(form.email)
    
    // 重置成功，显示提示信息
    resetSuccess.value = true
    
    // 3秒后跳转到登录页面
    setTimeout(() => {
      router.push('/login')
    }, 5000)
  } catch (error) {
    // 错误处理已经在store中完成
    console.error('重置密码失败:', error)
  }
}

onMounted(() => {
  // 清除之前的错误
  userStore.clearError()
})
</script>

<style scoped>
.forgot-password {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.container {
  width: 100%;
  max-width: 400px;
}

.auth-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.auth-header {
  text-align: center;
  margin-bottom: 30px;
}

.auth-header h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 10px;
}

.auth-header p {
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.auth-form {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input.error {
  border-color: #ff6b6b;
}

.error-text {
  color: #ff6b6b;
  font-size: 0.9rem;
  margin-top: 5px;
  display: block;
}

.btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  background: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 8px;
  padding: 12px;
  margin-top: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #d32f2f;
}

.success-message {
  background: #e8f5e8;
  border: 1px solid #c8e6c9;
  border-radius: 8px;
  padding: 12px;
  margin-top: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #2e7d32;
  line-height: 1.5;
}

.error-icon, .success-icon {
  font-size: 1.2rem;
}

.auth-footer {
  text-align: center;
  border-top: 1px solid #e9ecef;
  padding-top: 20px;
}

.auth-footer p {
  color: #666;
  margin: 0;
}

.auth-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.auth-link:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 30px 20px;
  }
}
</style>