<template>
  <div class="home">
    <div class="hero-section">
      <div class="hero-content">
        <h1>欢迎来到美食探索者</h1>
        <p>发现中国八大菜系的魅力，学习家常菜做法，探索美食文化</p>
        <div class="hero-actions">
          <router-link to="/cuisines" class="btn btn-primary">探索菜系</router-link>
          <router-link to="/dishes" class="btn btn-secondary">家常菜谱</router-link>
        </div>
      </div>
      <div class="hero-image">
        <img src="https://picsum.photos/600/400?random=100" alt="美食展示" />
      </div>
    </div>

    <div class="features-section">
      <div class="container">
        <h2>特色功能</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🔍</div>
            <h3>智能搜索</h3>
            <p>快速搜索菜系、菜品和食材，轻松找到你想要的美食</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">❤️</div>
            <h3>收藏功能</h3>
            <p>收藏你喜欢的菜系和菜品，随时查看和管理</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🛒</div>
            <h3>购物清单</h3>
            <p>自动生成食材清单，方便采购和准备</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">⏱️</div>
            <h3>烹饪计时</h3>
            <p>精准计时，帮助你掌握烹饪火候</p>
          </div>
        </div>
      </div>
    </div>

    <div class="quick-access">
      <div class="container">
        <h2>快速访问</h2>
        <div class="quick-grid">
          <router-link to="/cuisines" class="quick-card">
            <div class="quick-icon">🍲</div>
            <h3>八大菜系</h3>
            <p>探索中国饮食文化的精髓</p>
          </router-link>
          <router-link to="/dishes" class="quick-card">
            <div class="quick-icon">🍳</div>
            <h3>家常菜谱</h3>
            <p>学习简单美味的家常菜做法</p>
          </router-link>
          <router-link to="/favorites" class="quick-card">
            <div class="quick-icon">❤️</div>
            <h3>我的收藏</h3>
            <p>查看你收藏的美食</p>
          </router-link>
          <router-link to="/ai-assistant" class="quick-card">
            <div class="quick-icon">🤖</div>
            <h3>AI助手</h3>
            <p>获取个性化美食推荐</p>
          </router-link>
        </div>
      </div>
    </div>

    <!-- 工具组件 -->
    <div class="tools-section">
      <div class="container">
        <h2>实用工具</h2>
        <div class="tools-grid">
          <div class="tool-card">
            <ShoppingList />
          </div>
          <div class="tool-card">
            <CookingTimer />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ShoppingList from '../components/ShoppingList.vue'
import CookingTimer from '../components/CookingTimer.vue'
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.hero-section {
  display: flex;
  align-items: center;
  min-height: 80vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 20px;
}

.hero-content {
  flex: 1;
  max-width: 600px;
  margin: 0 auto;
}

.hero-content h1 {
  font-size: 3.5rem;
  margin-bottom: 20px;
}

.hero-content p {
  font-size: 1.3rem;
  margin-bottom: 30px;
  opacity: 0.9;
}

.hero-actions {
  display: flex;
  gap: 20px;
}

.btn {
  padding: 12px 30px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #ff6b6b;
  color: white;
}

.btn-primary:hover {
  background: #ff5252;
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-secondary:hover {
  background: white;
  color: #667eea;
}

.hero-image {
  flex: 1;
  text-align: center;
}

.hero-image img {
  max-width: 100%;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}

.features-section {
  padding: 80px 20px;
  background: #f8f9fa;
}

.features-section h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 50px;
  color: #333;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #333;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

.quick-access {
  padding: 80px 20px;
}

.quick-access h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 50px;
  color: #333;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.quick-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.quick-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}

.quick-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.quick-card h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #333;
}

.quick-card p {
  color: #666;
  line-height: 1.6;
}

.tools-section {
  padding: 80px 20px;
  background: #f8f9fa;
}

.tools-section h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 50px;
  color: #333;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.tool-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
  }
  
  .hero-content h1 {
    font-size: 2.5rem;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .features-grid,
  .quick-grid,
  .tools-grid {
    grid-template-columns: 1fr;
  }
}
</style>