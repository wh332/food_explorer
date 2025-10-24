import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { sampleDishes, sampleCuisines } from '../data/sampleData'

export interface Dish {
  id: number
  name: string
  cuisine: string
  image: string
  difficulty: '简单' | '中等' | '困难'
  time: string
  ingredients: string[]
  steps: string[]
  description: string
  rating: number
}

export interface Cuisine {
  id: number
  name: string
  description: string
  characteristics: string[]
  representativeDishes: string[]
  image: string
  region: string
  history: string
  features: string
}

export const useFoodStore = defineStore('food', () => {
  const dishes = ref<Dish[]>(sampleDishes)
  const cuisines = ref<Cuisine[]>(sampleCuisines)

  const searchDishes = computed(() => (query: string) => {
    return dishes.value.filter(dish => 
      dish.name.toLowerCase().includes(query.toLowerCase()) || 
      dish.cuisine.toLowerCase().includes(query.toLowerCase()) ||
      dish.ingredients.some(ing => ing.toLowerCase().includes(query.toLowerCase()))
    )
  })

  const getDishesByCuisine = computed(() => (cuisine: string) => {
    return dishes.value.filter(dish => dish.cuisine === cuisine)
  })

  const getCuisineByName = computed(() => (name: string) => {
    return cuisines.value.find(c => c.name === name)
  })

  return {
    dishes,
    cuisines,
    searchDishes,
    getDishesByCuisine,
    getCuisineByName
  }
})