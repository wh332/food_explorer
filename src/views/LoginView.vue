<template>
  <div class="login">
    <div class="container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>登录美食探索者</h1>
          <p>欢迎回来，请登录您的账户</p>
        </div>

        <form @submit.prevent="handleLogin" class="auth-form">
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

          <div class="form-group">
            <label for="password">密码</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              placeholder="请输入您的密码"
              :class="{ error: errors.password }"
            >
            <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
          </div>

          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" v-model="rememberMe">
              <span>记住我</span>
            </label>
            <router-link to="/forgot-password" class="forgot-password">忘记密码？</router-link>
          </div>

          <button type="submit" class="btn btn-primary" :disabled="authStore.isLoading">
            <span v-if="authStore.isLoading" class="loading-spinner"></span>
            {{ authStore.isLoading ? '登录中...' : '登录' }}
          </button>

          <div v-if="authStore.error" class="error-message">
            <span class="error-icon">⚠️</span>
            {{ authStore.error }}
          </div>
        </form>

        <div class="auth-footer">
          <p>还没有账户？ <router-link to="/register" class="auth-link">立即注册</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: ''
})

const errors = reactive({
  email: '',
  password: ''
})

const rememberMe = ref(false)

const validateForm = () => {
  let isValid = true
  
  // 清除之前的错误
  errors.email = ''
  errors.password = ''
  
  // 邮箱验证
  if (!form.email) {
    errors.email = '请输入邮箱地址'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = '请输入有效的邮箱地址'
    isValid = false
  }
  
  // 密码验证
  if (!form.password) {
    errors.password = '请输入密码'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = '密码长度至少6位'
    isValid = false
  }
  
  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) return
  
  try {
    const result = await authStore.login(form.email, form.password)
    
    if (result && result.user) {
      console.log('登录成功，用户信息:', result.user.email)
      // 登录成功后跳转到首页
      router.push('/')
    } else {
      console.error('登录返回结果异常')
      // 错误信息已经在store中设置，这里不需要额外设置
    }
  } catch (error) {
    // 错误处理已经在store中完成
    console.error('登录失败:', error)
  }
}

onMounted(() => {
  // 清除之前的错误
  authStore.clearError()
})
</script>

<style scoped>
.login {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  margin-top: -80px; /* 抵消App.vue中的padding-top */
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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  cursor: pointer;
}

.remember-me input {
  margin: 0;
}

.forgot-password {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
}

.forgot-password:hover {
  text-decoration: underline;
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

.error-icon {
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
  
  .form-options {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
}
</style>