<template>
  <div id="app">
    <NavBar />
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import NavBar from './components/layout/NavBar.vue'
import Footer from './components/layout/Footer.vue'
import { useFoodStore } from './stores/foodStore'
import { useUserStore } from './stores/userStore'

const foodStore = useFoodStore()
const userStore = useUserStore()

onMounted(async () => {
  // 应用启动时初始化用户认证状态
  try {
    await userStore.initializeAuth()
  } catch (error) {
    console.error('初始化用户认证失败:', error)
  }
  
  // 应用启动时初始化数据库数据
  try {
    await foodStore.initializeData()
  } catch (error) {
    console.error('初始化数据失败:', error)
  }
})
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 80px;
}

/* 全局样式 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
}
</style>