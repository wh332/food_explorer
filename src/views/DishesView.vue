<template>
  <div class="dishes">
    <div class="container">
      <div class="page-header">
        <h1>家常菜谱</h1>
        <p>学习制作美味家常菜，享受烹饪乐趣</p>
      </div>

      <!-- 搜索和筛选 -->
      <div class="filters">
        <div class="search-box">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="搜索菜品、食材..."
            class="search-input"
          >
          <span class="search-icon">🔍</span>
        </div>
        
        <div class="filter-options">
          <select v-model="selectedCuisine" class="filter-select">
            <option value="">所有菜系</option>
            <option v-for="cuisine in cuisines" :key="cuisine.id" :value="cuisine.name">
              {{ cuisine.name }}
            </option>
          </select>
          
          <select v-model="selectedDifficulty" class="filter-select">
            <option value="">所有难度</option>
            <option value="简单">简单</option>
            <option value="中等">中等</option>
            <option value="困难">困难</option>
          </select>
        </div>
      </div>

      <!-- 菜品列表 -->
      <div class="dishes-grid">
        <div v-for="dish in filteredDishes" :key="dish.id" class="dish-card" @click="viewDishDetail(dish.id)">
          <div class="dish-image">
            <span class="dish-emoji">🍲</span>
            <div class="dish-overlay">
              <span class="view-details">查看详情</span>
            </div>
          </div>
          <div class="dish-content">
            <div class="dish-header">
              <h3>{{ dish.dish_name }}</h3>
              <span class="rating">⭐ {{ dish.rating }}</span>
            </div>
            <span class="cuisine-tag">{{ dish.cuisine_name }}</span>
            <p class="dish-desc">{{ dish.description }}</p>
            
            <div class="dish-meta">
              <span class="meta-item">
                <span class="meta-icon">⏱️</span>
                {{ dish.time_required }}
              </span>
              <span class="meta-item">
                <span class="meta-icon">📊</span>
                {{ dish.difficulty }}
              </span>
            </div>

            <div class="ingredients-preview">
              <span class="ingredients-label">主要食材:</span>
              <div class="ingredients-tags">
                <span v-for="ingredient in dish.ingredients.slice(0, 3)" :key="ingredient" class="ingredient-tag">
                  {{ ingredient }}
                </span>
                <span v-if="dish.ingredients.length > 3" class="more-ingredients">
                  +{{ dish.ingredients.length - 3 }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredDishes.length === 0" class="no-results">
        <p>没有找到符合条件的菜品</p>
        <button class="btn btn-primary" @click="resetFilters">重置筛选条件</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFoodStore } from '../stores/foodStore'

const router = useRouter()
const foodStore = useFoodStore()

const searchQuery = ref('')
const selectedCuisine = ref('')
const selectedDifficulty = ref('')

const dishes = foodStore.dishes
const cuisines = foodStore.cuisines

const filteredDishes = computed(() => {
  return dishes.filter((dish: any) => {
    const matchesSearch = !searchQuery.value || 
      dish.dish_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      dish.ingredients.some((ing: string) => ing.toLowerCase().includes(searchQuery.value.toLowerCase()))
    
    const matchesCuisine = !selectedCuisine.value || dish.cuisine_name === selectedCuisine.value
    const matchesDifficulty = !selectedDifficulty.value || dish.difficulty === selectedDifficulty.value

    return matchesSearch && matchesCuisine && matchesDifficulty
  })
})

const viewDishDetail = (dishId: string) => {
  router.push(`/dish/${dishId}`)
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedCuisine.value = ''
  selectedDifficulty.value = ''
}
</script>

<style scoped>
.dishes {
  padding: 40px 0;
  min-height: 100vh;
  background: #f8f9fa;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
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

.filters {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.search-input {
  width: 100%;
  padding: 12px 50px 12px 20px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #ff6b6b;
}

.search-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
}

.filter-options {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.filter-select {
  padding: 12px 20px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: #ff6b6b;
}

.dishes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
}

.dish-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.dish-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.dish-image {
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.dish-emoji {
  font-size: 4rem;
}

.dish-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.dish-card:hover .dish-overlay {
  opacity: 1;
}

.view-details {
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
}

.dish-content {
  padding: 24px;
}

.dish-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.dish-header h3 {
  font-size: 1.4rem;
  color: #333;
  margin: 0;
}

.rating {
  background: #ffd700;
  color: #333;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: bold;
}

.cuisine-tag {
  background: #ff6b6b;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  display: inline-block;
  margin-bottom: 15px;
}

.dish-desc {
  color: #666;
  line-height: 1.5;
  margin-bottom: 20px;
}

.dish-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 0.9rem;
}

.ingredients-preview {
  border-top: 1px solid #e9ecef;
  padding-top: 15px;
}

.ingredients-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
  display: block;
}

.ingredients-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.ingredient-tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.more-ingredients {
  color: #666;
  font-size: 0.8rem;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.no-results p {
  font-size: 1.2rem;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    min-width: auto;
  }
  
  .filter-options {
    justify-content: center;
  }
  
  .dishes-grid {
    grid-template-columns: 1fr;
  }
  
  .page-header h1 {
    font-size: 2.5rem;
  }
}
</style>