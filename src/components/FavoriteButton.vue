<template>
  <button 
    :class="['favorite-button', { 'favorited': isFavorited }]"
    @click="toggleFavorite"
    :title="isFavorited ? '取消收藏' : '添加收藏'"
  >
    {{ isFavorited ? '❤️' : '🤍' }}
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFavoritesStore } from '../stores/favoritesStore'

interface Props {
  itemId: number
  itemType: 'cuisine' | 'dish'
  itemName: string
  itemImage: string
}

const props = defineProps<Props>()

const favoritesStore = useFavoritesStore()

const isFavorited = computed(() => 
  favoritesStore.isFavorite(props.itemId, props.itemType)
)

const toggleFavorite = () => {
  favoritesStore.toggleFavorite({
    id: props.itemId,
    type: props.itemType,
    name: props.itemName,
    image: props.itemImage
  })
}
</script>

<style scoped>
.favorite-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.favorite-button:hover {
  background-color: rgba(255, 107, 107, 0.1);
  transform: scale(1.1);
}

.favorite-button.favorited {
  color: #ff6b6b;
}
</style>