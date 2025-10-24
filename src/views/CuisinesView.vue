<template>
  <div class="cuisines">
    <div class="container">
      <div class="page-header">
        <h1>八大菜系</h1>
        <p>探索中国饮食文化的精髓</p>
      </div>

      <div class="cuisines-grid">
        <div v-for="cuisine in cuisines" :key="cuisine.id" class="cuisine-card">
          <div class="cuisine-image">
            <img :src="getCuisineImage(cuisine.name)" :alt="cuisine.name" class="cuisine-main-image">
            <span class="cuisine-emoji">{{ getCuisineEmoji(cuisine.name) }}</span>
          </div>
          <div class="cuisine-content">
            <h3>{{ cuisine.name }}</h3>
            <p class="cuisine-desc">{{ cuisine.description }}</p>
            
            <div class="characteristics">
              <h4>特色</h4>
              <div class="tags">
                <span v-for="char in cuisine.characteristics" :key="char" class="tag">
                  {{ char }}
                </span>
              </div>
            </div>

            <div class="representative-dishes">
              <h4>代表菜品</h4>
              <div class="dishes-list">
                <span v-for="dish in cuisine.representativeDishes" :key="dish" class="dish-tag">
                  {{ dish }}
                </span>
              </div>
            </div>

            <div class="cuisine-actions">
              <button class="btn btn-outline" @click="viewCuisineDishes(cuisine.name)">
                查看详情
              </button>
              <FavoriteButton
                :item-id="cuisine.id"
                item-type="cuisine"
                :item-name="cuisine.name"
                :item-image="cuisine.image"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useFoodStore } from '../stores/foodStore'
import FavoriteButton from '../components/FavoriteButton.vue'

const router = useRouter()
const foodStore = useFoodStore()

const cuisines = foodStore.cuisines

const getCuisineEmoji = (name: string) => {
  const emojiMap: { [key: string]: string } = {
    '川菜': '🌶️',
    '粤菜': '🍤',
    '鲁菜': '🥬',
    '苏菜': '🦀',
    '浙菜': '🐟',
    '闽菜': '🍲',
    '湘菜': '🔥',
    '徽菜': '🏔️'
  }
  return emojiMap[name] || '🍽️'
}

const getCuisineImage = (name: string) => {
  const cuisine = foodStore.cuisines.find(c => c.name === name)
  return cuisine?.image || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop&auto=format'
}

const viewCuisineDishes = (cuisineName: string) => {
  const cuisine = foodStore.cuisines.find(c => c.name === cuisineName)
  if (cuisine) {
    router.push(`/cuisine/${cuisine.id}`)
  }
}
</script>

<style scoped>
.cuisines {
  padding: 40px 0;
  min-height: 100vh;
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

.cuisines-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.cuisine-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.cuisine-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.cuisine-image {
  height: 200px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cuisine-main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.8);
}

.cuisine-emoji {
  font-size: 4rem;
  position: absolute;
  z-index: 2;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.cuisine-content {
  padding: 30px;
}

.cuisine-content h3 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 15px;
}

.cuisine-desc {
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
}

.characteristics, .representative-dishes {
  margin-bottom: 20px;
}

.characteristics h4, .representative-dishes h4 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 10px;
}

.tags, .dishes-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
}

.dish-tag {
  background: #f3e5f5;
  color: #7b1fa2;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
}

.btn-outline {
  background: transparent;
  color: #ff6b6b;
  border: 2px solid #ff6b6b;
  width: 100%;
  margin-top: 10px;
}

.btn-outline:hover {
  background: #ff6b6b;
  color: white;
}



.cuisine-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  align-items: center;
}

.btn-outline {
  flex: 1;
}

@media (max-width: 768px) {
  .cuisines-grid {
    grid-template-columns: 1fr;
  }
  
  .page-header h1 {
    font-size: 2.5rem;
  }
  
  .cuisine-actions {
    flex-direction: column;
  }
}
</style>