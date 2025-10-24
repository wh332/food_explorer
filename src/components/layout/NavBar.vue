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
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import SearchBar from '../SearchBar.vue'
</script>

<script setup lang="ts">
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

@media (max-width: 768px) {
  .nav-search {
    display: none;
  }
  
  .nav-menu {
    gap: 12px;
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