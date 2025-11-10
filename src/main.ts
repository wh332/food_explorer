import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/authStore'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 初始化认证状态
const authStore = useAuthStore()
authStore.initialize().then(() => {
  console.log('应用启动完成，认证状态:', authStore.isAuthenticated)
  
  // 设置认证状态监听器
  authStore.setupListener()
  
  // 现在挂载应用，路由守卫可以正确获取认证状态
  app.mount('#app')
}).catch((error) => {
  console.error('应用启动失败:', error)
  // 即使初始化失败也挂载应用，让用户至少能看到登录页面
  app.mount('#app')
})