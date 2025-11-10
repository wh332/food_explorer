import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface FavoriteItem {
  id: string
  type: 'cuisine' | 'dish'
  name: string
  image: string
  addedAt: Date
}

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref<FavoriteItem[]>([])

  // 从本地存储加载收藏
  const loadFavorites = () => {
    const saved = localStorage.getItem('food-favorites')
    if (saved) {
      favorites.value = JSON.parse(saved).map((item: any) => ({
        ...item,
        addedAt: new Date(item.addedAt)
      }))
    }
  }

  // 保存到本地存储
  const saveFavorites = () => {
    localStorage.setItem('food-favorites', JSON.stringify(favorites.value))
  }

  // 添加收藏
  const addFavorite = (item: Omit<FavoriteItem, 'addedAt'>) => {
    const existing = favorites.value.find(fav => 
      fav.id === item.id && fav.type === item.type
    )
    
    if (!existing) {
      favorites.value.push({
        ...item,
        addedAt: new Date()
      })
      saveFavorites()
    }
  }

  // 移除收藏
  const removeFavorite = (id: string, type: 'cuisine' | 'dish') => {
    const index = favorites.value.findIndex(fav => 
      fav.id === id && fav.type === type
    )
    
    if (index > -1) {
      favorites.value.splice(index, 1)
      saveFavorites()
    }
  }

  // 检查是否已收藏
  const isFavorite = (id: string, type: 'cuisine' | 'dish') => {
    return favorites.value.some(fav => 
      fav.id === id && fav.type === type
    )
  }

  // 切换收藏状态
  const toggleFavorite = (item: Omit<FavoriteItem, 'addedAt'>) => {
    if (isFavorite(item.id, item.type)) {
      removeFavorite(item.id, item.type)
    } else {
      addFavorite(item)
    }
  }

  // 清空收藏
  const clearFavorites = () => {
    favorites.value = []
    saveFavorites()
  }

  // 初始化时加载收藏
  loadFavorites()

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    clearFavorites
    
  }
})