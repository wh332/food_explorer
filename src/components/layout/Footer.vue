<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>美食探索者</h3>
          <p>发现中华美食的无限魅力，探索八大菜系的独特风味</p>
        </div>
        
        <div class="footer-section">
          <h4>快速链接</h4>
          <router-link to="/" class="footer-link">首页</router-link>
          <router-link to="/cuisines" class="footer-link">八大菜系</router-link>
          <router-link to="/dishes" class="footer-link">家常菜</router-link>
        </div>
        
        <div class="footer-section">
          <h4>联系我们</h4>
          <p>邮箱: contact@foodexplorer.com</p>
          <p>电话: 400-123-4567</p>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2024 美食探索者. 保留所有权利.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  padding: 40px 0 20px;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 30px;
}

.footer-section h3 {
  color: #ff6b6b;
  margin-bottom: 16px;
  font-size: 24px;
}

.footer-section h4 {
  margin-bottom: 16px;
  color: #ecf0f1;
}

.footer-section p {
  line-height: 1.6;
  color: #bdc3c7;
}

.footer-link {
  display: block;
  color: #bdc3c7;
  text-decoration: none;
  margin-bottom: 8px;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #ff6b6b;
}

.footer-bottom {
  border-top: 1px solid #34495e;
  padding-top: 20px;
  text-align: center;
  color: #95a5a6;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}
</style>