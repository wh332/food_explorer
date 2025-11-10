<template>
  <div class="shopping-list-view">
    <div class="container">
      <div class="page-header">
        <h1>购物清单</h1>
        <p>管理您的食材采购清单，避免遗漏</p>
      </div>
      
      <div class="tool-container">
        <ShoppingList />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ShoppingList from '../../components/ShoppingList.vue'
</script>

<style scoped>
.shopping-list-view {
  min-height: calc(100vh - 80px);
  padding: 40px 0;
  background: #f8f9fa;
}

.page-header {
  text-align: center;
  margin-bottom: 50px;
}

.page-header h1 {
  font-size: 3rem;
  color: #333;
  margin-bottom: 10px;
}

.page-header p {
  font-size: 1.2rem;
  color: #666;
}

.tool-container {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

@media (max-width: 768px) {
  .shopping-list-view {
    padding: 20px 0;
  }
  
  .page-header h1 {
    font-size: 2.5rem;
  }
  
  .tool-container {
    margin: 0 20px;
  }
}
</style>