<template>
  <div class="search-bar">
    <div class="search-input-container">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索菜系、菜品或食材..."
        class="search-input"
        @input="handleSearch"
      />
      <button class="search-button" @click="handleSearch">
        🔍
      </button>
    </div>
    
    <div v-if="searchResults.length > 0" class="search-results">
      <div v-for="result in searchResults" :key="result.id" class="result-item" @click="selectResult(result)">
        <img :src="result.image" :alt="result.name" class="result-image" />
        <div class="result-info">
          <h4>{{ result.name }}</h4>
          <span class="result-type">{{ result.type }}</span>
          <p class="result-description">{{ result.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { sampleCuisines, sampleDishes } from '../data/sampleData'

interface SearchResult {
  id: number
  name: string
  type: string
  description: string
  image: string
  route: string
}

const searchQuery = ref('')
const searchResults = ref<SearchResult[]>([])

const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  const query = searchQuery.value.toLowerCase()
  
  // 搜索菜系
  const cuisineResults = sampleCuisines
    .filter(cuisine => 
      cuisine.name.toLowerCase().includes(query) ||
      cuisine.description.toLowerCase().includes(query) ||
      cuisine.characteristics.some(char => char.toLowerCase().includes(query))
    )
    .map(cuisine => ({
      id: cuisine.id,
      name: cuisine.name,
      type: '菜系',
      description: cuisine.description,
      image: cuisine.image,
      route: `/cuisine/${cuisine.id}`
    }))

  // 搜索菜品
  const dishResults = sampleDishes
    .filter(dish =>
      dish.name.toLowerCase().includes(query) ||
      dish.description.toLowerCase().includes(query) ||
      dish.ingredients.some(ing => ing.toLowerCase().includes(query))
    )
    .map(dish => ({
      id: dish.id,
      name: dish.name,
      type: '菜品',
      description: dish.description,
      image: dish.image,
      route: `/dish/${dish.id}`
    }))

  searchResults.value = [...cuisineResults, ...dishResults].slice(0, 10)
}

const selectResult = (result: SearchResult) => {
  // 这里可以添加路由跳转逻辑
  console.log('Selected:', result)
  searchQuery.value = ''
  searchResults.value = []
}
</script>

<style scoped>
.search-bar {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.search-input-container {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 25px;
  padding: 8px 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  padding: 8px;
}

.search-button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
}

.result-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;
}

.result-item:hover {
  background-color: #f5f5f5;
}

.result-image {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
  margin-right: 12px;
}

.result-info {
  flex: 1;
}

.result-info h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
}

.result-type {
  background: #ff6b6b;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.result-description {
  margin: 4px 0 0 0;
  font-size: 14px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>