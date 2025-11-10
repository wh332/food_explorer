<template>
  <div class="nutrition-calculator-view">
    <div class="container">
      <div class="page-header">
        <h1>营养计算器</h1>
        <p>计算食材的营养成分，制定健康的饮食计划</p>
      </div>
      
      <div class="tool-container">
        <NutritionCalculator />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NutritionCalculator from '../../components/NutritionCalculator.vue'
</script>

<style scoped>
.nutrition-calculator-view {
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
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

@media (max-width: 768px) {
  .nutrition-calculator-view {
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