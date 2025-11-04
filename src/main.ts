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
  
  app.mount('#app')
}).catch((error) => {
  console.error('应用启动失败:', error)
  app.mount('#app')
})