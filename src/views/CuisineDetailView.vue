<template>
  <div class="cuisine-detail">
    <div class="container">
      <!-- 返回按钮 -->
      <button class="back-btn" @click="$router.back()">
        ← 返回菜系列表
      </button>

      <!-- 加载状态 -->
      <div v-if="isLoading" class="loading">
        <p>正在从数据库加载菜系信息...</p>
      </div>

      <!-- 错误状态 -->
      <div v-if="error && !cuisine" class="error">
        <p>{{ error }}</p>
        <button @click="loadCuisineFromDatabase" class="retry-btn">重试</button>
      </div>

      <!-- 菜系头部信息 -->
      <div v-if="cuisine" class="cuisine-header">
        <div class="cuisine-image">
          <img :src="cuisine.image_url || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop&auto=format'" :alt="cuisine.name" class="header-image">
        </div>
        <div class="cuisine-info">
          <h1 class="cuisine-title">{{ cuisine.name }}</h1>
          <p class="cuisine-region">{{ cuisine.region }}</p>
          <p class="cuisine-description">{{ cuisine.description }}</p>
          
          <!-- 特色标签 -->
          <div class="characteristics">
            <h3>特色</h3>
            <div class="tags">
              <span v-for="char in cuisine.characteristics" :key="char" class="tag">
                {{ char }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 历史渊源 -->
      <section v-if="cuisine && cuisine.history" class="history-section">
        <h2>历史渊源</h2>
        <div class="history-content">
          <p>{{ cuisine.history }}</p>
        </div>
      </section>

      <!-- 特色介绍 -->
      <section v-if="cuisine" class="features-section">
        <h2>特色介绍</h2>
        <div class="features-content">
          <p>{{ cuisine.features }}</p>
        </div>
      </section>

      <!-- 代表菜品 -->
      <section v-if="cuisine" class="dishes-section">
        <h2>代表菜品</h2>
        <div class="dishes-grid">
          <div v-for="dishName in cuisine.representative_dishes" :key="dishName" class="dish-card">
            <div class="dish-image">
              <span class="dish-emoji">🍲</span>
            </div>
            <div class="dish-info">
              <h3>{{ dishName }}</h3>
              <button class="view-recipe-btn" @click="viewDishRecipe(dishName)">
                查看做法
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 相关菜品 -->
      <section v-if="cuisine" class="related-dishes">
        <h2>相关菜品</h2>
        <div class="dishes-list">
          <div v-for="dish in relatedDishes" :key="dish.id" class="related-dish-card">
            <img :src="dish.image_url || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=150&fit=crop&auto=format'" :alt="dish.dish_name" class="dish-thumb">
            <div class="dish-details">
              <h4>{{ dish.dish_name }}</h4>
              <p>{{ dish.description }}</p>
              <div class="dish-meta">
                <span class="difficulty">{{ dish.difficulty }}</span>
                <span class="time">{{ dish.time_required }}</span>
              </div>
              <button class="btn-primary" @click="viewDishDetail(dish.id)">
                查看详情
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFoodStore } from '../stores/foodStore'
import { supabase } from '../config/supabase'
import type { Cuisine } from '../stores/foodStore'

const route = useRoute()
const router = useRouter()
const foodStore = useFoodStore()

const cuisineId = computed(() => route.params.id as string)
const cuisine = ref<Cuisine | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

// 从数据库加载菜系详情
const loadCuisineFromDatabase = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    // 首先尝试从数据库加载
    const { data, error: dbError } = await supabase
      .from('cuisine_data')
      .select('*')
      .eq('id', cuisineId.value)
      .single()
    
    if (dbError) throw dbError
    
    if (data) {
      // 将数据库数据转换为前端接口格式
      cuisine.value = {
        id: data.id,
        name: data.name,  // 数据库中是name字段
        description: data.description,
        characteristics: data.characteristics || [],
        representative_dishes: data.representative_dishes || [],
        image_url: data.image_url,
        region: data.region || '',
        history: data.history || '',
        features: data.features || '',
        time_required: data.time_required,
        created_at: data.created_at
      }
    } else {
      // 如果数据库中没有，尝试从本地数据中查找
      const localCuisine = foodStore.cuisines.find(c => c.id === cuisineId.value)
      if (localCuisine) {
        cuisine.value = localCuisine
      } else {
        error.value = '未找到该菜系信息'
      }
    }
  } catch (err) {
    console.error('加载菜系详情失败:', err)
    error.value = '加载菜系详情失败'
    
    // 降级到本地数据
    const localCuisine = foodStore.cuisines.find(c => c.id === cuisineId.value)
    if (localCuisine) {
      cuisine.value = localCuisine
    }
  } finally {
    isLoading.value = false
  }
}

// 获取相关菜品（从数据库或本地数据）
const relatedDishes = computed(() => {
  if (!cuisine.value) return []
  
  // 优先使用数据库中的菜品数据
  return foodStore.dishes.filter(dish => dish.cuisine_name === cuisine.value?.name)
})

const viewDishRecipe = (dishName: string) => {
  const dish = foodStore.dishes.find(d => d.dish_name === dishName)
  if (dish) {
    router.push(`/dish/${dish.id}`)
  }
}

const viewDishDetail = (dishId: string) => {
  router.push(`/dish/${dishId}`)
}

onMounted(async () => {
  await loadCuisineFromDatabase()
  
  // 如果加载失败且没有本地数据，跳转回菜系列表
  if (!cuisine.value && error.value) {
    router.push('/cuisines')
  }
})
</script>

<style scoped>
.cuisine-detail {
  padding: 40px 0;
  min-height: 100vh;
  background: #f8f9fa;
}

.back-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 30px;
  font-size: 16px;
}

.back-btn:hover {
  background: #5a6268;
}

.cuisine-header {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 40px;
  margin-bottom: 50px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.header-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.cuisine-info {
  padding: 40px;
}

.cuisine-title {
  font-size: 3rem;
  color: #333;
  margin-bottom: 10px;
}

.cuisine-region {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 20px;
}

.cuisine-description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #555;
  margin-bottom: 30px;
}

.characteristics h3 {
  font-size: 1.3rem;
  margin-bottom: 15px;
  color: #333;
}

.tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tag {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
}

section {
  background: white;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

section h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
  border-bottom: 2px solid #ff6b6b;
  padding-bottom: 10px;
}

.history-content p,
.features-content p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
}

.dishes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.dish-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: transform 0.3s ease;
}

.dish-card:hover {
  transform: translateY(-5px);
}

.dish-image {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}

.dish-emoji {
  font-size: 3rem;
}

.dish-info h3 {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #333;
}

.view-recipe-btn {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
}

.view-recipe-btn:hover {
  background: #45a049;
}

.related-dishes .dishes-list {
  display: grid;
  gap: 20px;
}

.related-dish-card {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  align-items: center;
}

.dish-thumb {
  width: 120px;
  height: 90px;
  border-radius: 8px;
  object-fit: cover;
}

.dish-details h4 {
  font-size: 1.3rem;
  margin-bottom: 10px;
  color: #333;
}

.dish-details p {
  color: #666;
  margin-bottom: 10px;
  line-height: 1.5;
}

.dish-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.difficulty, .time {
  background: #e9ecef;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.9rem;
  color: #495057;
}

.btn-primary {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
}

.btn-primary:hover {
  transform: translateY(-2px);
}

/* 错误状态样式 */
.error {
  text-align: center;
  padding: 40px 20px;
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 8px;
  margin: 20px 0;
}

.error p {
  color: #c53030;
  font-size: 1.1rem;
  margin-bottom: 20px;
}

.retry-btn {
  background: #3182ce;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

.retry-btn:hover {
  background: #2c5aa0;
}

@media (max-width: 768px) {
  .cuisine-header {
    grid-template-columns: 1fr;
  }
  
  .cuisine-title {
    font-size: 2.5rem;
  }
  
  .dishes-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  .related-dish-card {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
</style>