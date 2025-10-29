<template>
  <div class="dish-detail" v-if="dish">
    <div class="container">
      <!-- 返回按钮 -->
      <button class="back-btn" @click="goBack">
        <span class="back-icon">←</span>
        返回列表
      </button>

      <!-- 菜品详情 -->
      <div class="dish-hero">
        <div class="dish-image-large">
          <span class="dish-emoji-large">🍲</span>
        </div>
        
        <div class="dish-info">
          <div class="dish-header">
            <h1>{{ dish.dish_name }}</h1>
            <div class="dish-rating">
              <span class="rating-stars">⭐⭐⭐⭐⭐</span>
              <span class="rating-value">{{ dish.rating }}</span>
            </div>
          </div>
          
          <div class="dish-meta-large">
            <span class="cuisine-badge">{{ dish.cuisine_name }}</span>
            <span class="meta-item">
              <span class="meta-icon">⏱️</span>
              烹饪时间: {{ dish.time_required }}
            </span>
            <span class="meta-item">
              <span class="meta-icon">📊</span>
              难度: {{ dish.difficulty }}
            </span>
          </div>
          
          <p class="dish-description">{{ dish.description }}</p>
        </div>
      </div>

      <!-- 食材和步骤 -->
      <div class="dish-content">
        <div class="ingredients-section">
          <h2>所需食材</h2>
          <ul class="ingredients-list">
            <li v-for="(ingredient, index) in dish.ingredients" :key="index" class="ingredient-item">
              <span class="ingredient-checkbox">□</span>
              {{ ingredient }}
            </li>
          </ul>
        </div>

        <div class="steps-section">
          <h2>制作步骤</h2>
          <div class="steps-list">
            <div v-for="(step, index) in dish.steps" :key="index" class="step-item">
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-content">
                <p>{{ step }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 相关菜品 -->
      <div class="related-dishes">
        <h2>相关菜品</h2>
        <div class="related-grid">
          <div v-for="relatedDish in relatedDishes" :key="relatedDish.id" class="related-card" @click="viewRelatedDish(relatedDish.id)">
            <div class="related-image">
              <span class="related-emoji">🍲</span>
            </div>
            <div class="related-info">
              <h4>{{ relatedDish.dish_name }}</h4>
              <span class="related-cuisine">{{ relatedDish.cuisine_name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div v-else class="loading">
    <p>加载中...</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFoodStore, type Dish } from '../stores/foodStore'

const route = useRoute()
const router = useRouter()
const foodStore = useFoodStore()

const dish = ref<Dish | null>(null)

onMounted(() => {
  const dishId = route.params.id as string
  dish.value = foodStore.dishes.find(d => d.id === dishId) || null
})

const relatedDishes = computed(() => {
  if (!dish.value) return []
  return foodStore.dishes
    .filter((d: any) => d.cuisine_name === dish.value!.cuisine_name && d.id !== dish.value!.id)
    .slice(0, 3)
})

const goBack = () => {
  router.back()
}

const viewRelatedDish = (dishId: string) => {
  router.push(`/dish/${dishId}`)
}
</script>

<style scoped>
.dish-detail {
  padding: 40px 0;
  min-height: 100vh;
  background: #f8f9fa;
}

.back-btn {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: #666;
  transition: all 0.3s ease;
  margin-bottom: 30px;
}

.back-btn:hover {
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.back-icon {
  font-size: 18px;
}

.dish-hero {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
  display: grid;
  grid-template-columns: 300px 1fr;
}

.dish-image-large {
  height: 300px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dish-emoji-large {
  font-size: 8rem;
}

.dish-info {
  padding: 40px;
}

.dish-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.dish-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin: 0;
}

.dish-rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating-stars {
  font-size: 1.2rem;
}

.rating-value {
  background: #ffd700;
  color: #333;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: bold;
}

.dish-meta-large {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.cuisine-badge {
  background: #ff6b6b;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: bold;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 1rem;
}

.meta-icon {
  font-size: 1.2rem;
}

.dish-description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #666;
}

.dish-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 40px;
  margin-bottom: 40px;
}

.ingredients-section, .steps-section {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.ingredients-section h2, .steps-section h2 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 20px;
  border-bottom: 3px solid #ff6b6b;
  padding-bottom: 10px;
}

.ingredients-list {
  list-style: none;
  padding: 0;
}

.ingredient-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #e9ecef;
  font-size: 1.1rem;
}

.ingredient-item:last-child {
  border-bottom: none;
}

.ingredient-checkbox {
  font-size: 1.2rem;
  color: #ff6b6b;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.step-item {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.step-number {
  background: #ff6b6b;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #ff6b6b;
}

.step-content p {
  margin: 0;
  line-height: 1.6;
  color: #333;
}

.related-dishes {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.related-dishes h2 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 20px;
  border-bottom: 3px solid #ff6b6b;
  padding-bottom: 10px;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.related-card {
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.related-card:hover {
  transform: translateY(-3px);
}

.related-image {
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.related-emoji {
  font-size: 3rem;
}

.related-info {
  padding: 15px;
}

.related-info h4 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.1rem;
}

.related-cuisine {
  background: #ff6b6b;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  font-size: 1.2rem;
  color: #666;
}

@media (max-width: 768px) {
  .dish-hero {
    grid-template-columns: 1fr;
  }
  
  .dish-image-large {
    height: 200px;
  }
  
  .dish-info {
    padding: 20px;
  }
  
  .dish-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .dish-header h1 {
    font-size: 2rem;
  }
  
  .dish-content {
    grid-template-columns: 1fr;
  }
  
  .related-grid {
    grid-template-columns: 1fr;
  }
}
</style>