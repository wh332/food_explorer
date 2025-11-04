<template>
  <nav class="navbar">
    <div class="container">
      <div class="nav-brand">
        <router-link to="/" class="brand-link">
          <span class="brand-icon">🍲</span>
          <span class="brand-text">美食探索者</span>
        </router-link>
      </div>
      
      <div class="nav-search">
        <SearchBar />
      </div>
      
      <div class="nav-menu">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/cuisines" class="nav-link">八大菜系</router-link>
        <router-link to="/dishes" class="nav-link">家常菜</router-link>
        
        <!-- 实用工具菜单 -->
        <div class="tools-menu">
          <button class="nav-link tools-toggle" @click="toggleToolsMenu">
            <span class="tools-icon">🛠️</span>
            实用工具
            <span class="dropdown-arrow">▼</span>
          </button>
          
          <div v-if="isToolsMenuOpen" class="tools-dropdown">
            <router-link to="/tools/nutrition" class="dropdown-item" @click="closeToolsMenu">
              <span class="tool-icon">📊</span>
              营养计算器
            </router-link>
            <router-link to="/tools/recipe-generator" class="dropdown-item" @click="closeToolsMenu">
              <span class="tool-icon">🍳</span>
              菜谱生成器
            </router-link>
            <router-link to="/tools/shopping-list" class="dropdown-item" @click="closeToolsMenu">
              <span class="tool-icon">🛒</span>
              购物清单
            </router-link>
            <router-link to="/tools/cooking-timer" class="dropdown-item" @click="closeToolsMenu">
              <span class="tool-icon">⏱️</span>
              烹饪计时器
            </router-link>
          </div>
        </div>
        
        <!-- 已登录用户菜单 -->
        <template v-if="userStore.isAuthenticated">
          <router-link to="/favorites" class="nav-link favorites-link">
            <span class="favorites-icon">❤️</span>
            我的收藏
          </router-link>
          <router-link to="/ai-assistant" class="nav-link ai-assistant">
            <span class="ai-icon">🤖</span>
            AI助手
          </router-link>
          <router-link to="/profile" class="nav-link profile-link">
            <span class="profile-icon">👤</span>
            我的照片
          </router-link>
          
          <!-- 用户下拉菜单 -->
          <div class="user-menu">
            <button class="user-toggle" @click="toggleUserMenu">
              <span class="user-avatar">{{ userInitials }}</span>
              <span class="user-name">{{ userStore.user?.username }}</span>
              <span class="dropdown-arrow">▼</span>
            </button>
            
            <div v-if="isUserMenuOpen" class="user-dropdown">
              <div class="user-info">
                <div class="user-email">{{ userStore.user?.email }}</div>
              </div>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item" @click="handleLogout">
                <span class="logout-icon">🚪</span>
                退出登录
              </button>
            </div>
          </div>
        </template>
        
        <!-- 未登录用户菜单 -->
        <template v-else>
          <router-link to="/login" class="nav-link login-link">
            <span class="login-icon">🔑</span>
            登录
          </router-link>
          <router-link to="/register" class="nav-link register-link">
            <span class="register-icon">📝</span>
            注册
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/userStore'
import SearchBar from '../SearchBar.vue'

const router = useRouter()
const userStore = useUserStore()

const isUserMenuOpen = ref(false)
const isToolsMenuOpen = ref(false)

// 计算用户首字母
const userInitials = computed(() => {
  if (!userStore.user?.username) return 'U'
  return userStore.user.username.charAt(0).toUpperCase()
})

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
  isToolsMenuOpen.value = false
}

const toggleToolsMenu = () => {
  isToolsMenuOpen.value = !isToolsMenuOpen.value
  isUserMenuOpen.value = false
}

const closeToolsMenu = () => {
  isToolsMenuOpen.value = false
}

const handleLogout = async () => {
  try {
    await userStore.signOut()
    isUserMenuOpen.value = false
    router.push('/')
  } catch (error) {
    console.error('退出登录失败:', error)
  }
}

// 点击其他地方关闭用户菜单
const closeUserMenu = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.user-menu')) {
    isUserMenuOpen.value = false
  }
  if (!target.closest('.tools-menu')) {
    isToolsMenuOpen.value = false
  }
}

onMounted(() => {
  // 初始化用户认证状态
  userStore.initializeAuth()
  
  // 添加全局点击事件监听
  document.addEventListener('click', closeUserMenu)
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e9ecef;
  z-index: 1000;
  padding: 0;
}

.navbar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 80px;
}

.brand-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333;
  font-weight: bold;
  font-size: 24px;
}

.brand-icon {
  font-size: 32px;
  margin-right: 8px;
}

.nav-search {
  flex: 1;
  max-width: 400px;
  margin: 0 20px;
}

.nav-menu {
  display: flex;
  gap: 20px;
  align-items: center;
}

.nav-link {
  text-decoration: none;
  color: #666;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
}

.nav-link.router-link-active {
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
}

.ai-assistant {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white !important;
}

.ai-assistant:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.ai-icon {
  margin-right: 4px;
}

.favorites-link {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%);
  color: white !important;
}

.favorites-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

.favorites-icon {
  margin-right: 4px;
}

.profile-link {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white !important;
}

.profile-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.profile-icon {
  margin-right: 4px;
}

/* 登录注册链接样式 */
.login-link, .register-link {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white !important;
}

.login-link:hover, .register-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.login-icon, .register-icon {
  margin-right: 4px;
}

/* 工具菜单样式 */
.tools-menu {
  position: relative;
}

.tools-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #666;
  font-weight: 500;
  text-decoration: none;
}

.tools-toggle:hover {
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
}

.tools-icon {
  margin-right: 4px;
}

.tools-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 1001;
  margin-top: 8px;
}

.tools-dropdown .dropdown-item {
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  transition: all 0.3s ease;
  text-decoration: none;
}

.tools-dropdown .dropdown-item:hover {
  background: #f8f9fa;
  color: #ff6b6b;
}

.tool-icon {
  font-size: 1rem;
}

/* 用户菜单样式 */
.user-menu {
  position: relative;
}

.user-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #666;
}

.user-toggle:hover {
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
}

.user-name {
  font-weight: 500;
}

.dropdown-arrow {
  font-size: 10px;
  transition: transform 0.3s ease;
}

.user-toggle:hover .dropdown-arrow {
  transform: rotate(180deg);
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 1001;
  margin-top: 8px;
}

.user-info {
  padding: 16px;
  border-bottom: 1px solid #e9ecef;
}

.user-email {
  font-size: 0.9rem;
  color: #666;
}

.dropdown-divider {
  height: 1px;
  background: #e9ecef;
}

.dropdown-item {
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  transition: all 0.3s ease;
}

.dropdown-item:hover {
  background: #f8f9fa;
  color: #ff6b6b;
}

.logout-icon {
  font-size: 1rem;
}

@media (max-width: 768px) {
  .nav-search {
    display: none;
  }
  
  .nav-menu {
    gap: 12px;
  }
  
  .user-name {
    display: none;
  }
  
  .user-dropdown {
    right: -50px;
  }
}

@media (max-width: 768px) {
  .nav-menu {
    gap: 16px;
  }
  
  .brand-text {
    display: none;
  }
}
</style>