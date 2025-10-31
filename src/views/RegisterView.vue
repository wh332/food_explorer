<template>
  <div class="register">
    <div class="container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>注册美食探索者</h1>
          <p>创建您的账户，开始探索美食世界</p>
        </div>

        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="form-group">
            <label for="username">用户名</label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              placeholder="请输入用户名"
              :class="{ error: errors.username }"
            >
            <span v-if="errors.username" class="error-text">{{ errors.username }}</span>
          </div>

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
              placeholder="请输入密码（至少6位）"
              :class="{ error: errors.password }"
            >
            <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
          </div>

          <div class="form-group">
            <label for="confirmPassword">确认密码</label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              required
              placeholder="请再次输入密码"
              :class="{ error: errors.confirmPassword }"
            >
            <span v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</span>
          </div>

          <div class="form-options">
            <label class="agree-terms">
              <input type="checkbox" v-model="agreeTerms" required>
              <span>我已阅读并同意 <a href="#" class="terms-link">服务条款</a> 和 <a href="#" class="terms-link">隐私政策</a></span>
            </label>
          </div>

          <button type="submit" class="btn btn-primary" :disabled="userStore.isLoading">
            <span v-if="userStore.isLoading" class="loading-spinner"></span>
            {{ userStore.isLoading ? '注册中...' : '注册' }}
          </button>

          <div v-if="userStore.error" class="error-message">
            <span class="error-icon">⚠️</span>
            {{ userStore.error }}
          </div>

          <div v-if="registrationSuccess" class="success-message">
            <span class="success-icon">✅</span>
            注册成功！请检查您的邮箱以验证账户。
          </div>
        </form>

        <div class="auth-footer">
          <p>已有账户？ <router-link to="/login" class="auth-link">立即登录</router-link></p>
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
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const errors = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const agreeTerms = ref(false)
const registrationSuccess = ref(false)

const validateForm = () => {
  let isValid = true
  
  // 清除之前的错误
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
  
  // 用户名验证
  if (!form.username) {
    errors.username = '请输入用户名'
    isValid = false
  } else if (form.username.length < 2) {
    errors.username = '用户名至少2个字符'
    isValid = false
  }
  
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
  
  // 确认密码验证
  if (!form.confirmPassword) {
    errors.confirmPassword = '请确认密码'
    isValid = false
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = '两次输入的密码不一致'
    isValid = false
  }
  
  // 条款同意验证
  if (!agreeTerms.value) {
    isValid = false
  }
  
  return isValid
}

const handleRegister = async () => {
  if (!validateForm()) return
  
  try {
    await userStore.signUp(form.email, form.password, form.username)
    
    // 注册成功，显示提示信息
    registrationSuccess.value = true
    
    // 3秒后跳转到登录页面
    setTimeout(() => {
      router.push('/login')
    }, 3000)
  } catch (error) {
    // 错误处理已经在store中完成
    console.error('注册失败:', error)
  }
}

onMounted(() => {
  // 清除之前的错误
  userStore.clearError()
})
</script>

<style scoped>
.register {
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
  margin-bottom: 20px;
}

.agree-terms {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: #666;
  cursor: pointer;
  font-size: 0.9rem;
  line-height: 1.4;
}

.agree-terms input {
  margin-top: 2px;
  flex-shrink: 0;
}

.terms-link {
  color: #667eea;
  text-decoration: none;
}

.terms-link:hover {
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
  
  .agree-terms {
    font-size: 0.85rem;
  }
}
</style>