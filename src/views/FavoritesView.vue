<template>
  <div class="favorites-view">
    <div class="header">
      <h1>我的收藏</h1>
      <button v-if="favorites.length > 0" class="clear-button" @click="clearFavorites">
        清空收藏
      </button>
    </div>

    <div v-if="favorites.length === 0" class="empty-state">
      <div class="empty-icon">🤍</div>
      <h3>暂无收藏</h3>
      <p>去发现一些美食并收藏它们吧！</p>
    </div>

    <div v-else class="favorites-grid">
      <div v-for="item in favorites" :key="`${item.type}-${item.id}`" class="favorite-item">
        <div class="item-image">
          <img :src="item.image" :alt="item.name" />
          <FavoriteButton
            :item-id="item.id"
            :item-type="item.type"
            :item-name="item.name"
            :item-image="item.image"
          />
        </div>
        <div class="item-info">
          <h3>{{ item.name }}</h3>
          <span class="item-type">{{ item.type === 'cuisine' ? '菜系' : '菜品' }}</span>
          <p class="added-date">收藏于 {{ formatDate(item.addedAt) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFavoritesStore } from '../stores/favoritesStore'
import FavoriteButton from '../components/FavoriteButton.vue'

const favoritesStore = useFavoritesStore()

const favorites = computed(() => favoritesStore.favorites)

const clearFavorites = () => {
  if (confirm('确定要清空所有收藏吗？')) {
    favoritesStore.clearFavorites()
  }
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.favorites-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.clear-button {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.clear-button:hover {
  background: #ff5252;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.favorite-item {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.favorite-item:hover {
  transform: translateY(-4px);
}

.item-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-image .favorite-button {
  position: absolute;
  top: 10px;
  right: 10px;
}

.item-info {
  padding: 16px;
}

.item-info h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
}

.item-type {
  background: #4ecdc4;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.added-date {
  margin: 8px 0 0 0;
  font-size: 12px;
  color: #888;
}
</style>