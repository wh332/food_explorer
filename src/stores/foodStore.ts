import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../config/supabase'
import { sampleDishes, sampleCuisines } from '../data/sampleData'

export interface Dish {
  id: string
  dish_name: string
  cuisine_name: string
  image_url: string
  difficulty: '简单' | '中等' | '困难'
  time_required: string
  ingredients: string[]
  steps: string[]
  description: string
  rating: number
  created_at?: string
}

export interface Cuisine {
  id: string
  name: string
  description: string
  characteristics: string[]
  representative_dishes: string[]
  image_url: string
  region: string
  history: string
  features: string
  time_required?: string
  created_at?: string
}

export const useFoodStore = defineStore('food', () => {
  const dishes = ref<Dish[]>(sampleDishes)
  const cuisines = ref<Cuisine[]>(sampleCuisines)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 从数据库加载菜品数据
  const loadDishesFromDatabase = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const { data, error: dbError } = await supabase
        .from('dish_data')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (dbError) throw dbError
      
      if (data && data.length > 0) {
        dishes.value = data.map(item => ({
          id: item.id,
          dish_name: item.name,  // 数据库中是name字段
          cuisine_name: item.cuisine_name,
          image_url: item.image_url,
          difficulty: item.difficulty,
          time_required: item.time_required,
          ingredients: item.ingredients || [],
          steps: item.steps || [],
          description: item.description,
          rating: item.rating || 0,
          created_at: item.created_at
        }))
      }
    } catch (err) {
      console.error('获取菜品数据失败:', err)
      error.value = '获取菜品数据失败，使用本地数据'
      // 降级到本地数据
      dishes.value = sampleDishes
    } finally {
      isLoading.value = false
    }
  }

  // 从数据库加载菜系数据
  const loadCuisinesFromDatabase = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const { data, error: dbError } = await supabase
        .from('cuisine_data')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (dbError) throw dbError
      
      if (data && data.length > 0) {
        cuisines.value = data.map(item => ({
          id: item.id,
          name: item.name,  // 数据库中是name字段
          description: item.description,
          characteristics: item.characteristics || [],
          representative_dishes: item.representative_dishes || [],
          image_url: item.image_url,
          region: item.region || '',
          history: item.history || '',
          features: item.features || '',
          time_required: item.time_required,
          created_at: item.created_at
        }))
      }
    } catch (err) {
      console.error('获取菜系数据失败:', err)
      error.value = '获取菜系数据失败，使用本地数据'
      // 降级到本地数据
      cuisines.value = sampleCuisines
    } finally {
      isLoading.value = false
    }
  }

  // 初始化加载数据
  const initializeData = async () => {
    await Promise.all([
      loadDishesFromDatabase(),
      loadCuisinesFromDatabase()
    ])
  }

  // 搜索菜品（支持数据库搜索）
  const searchDishes = computed(() => (query: string) => {
    return dishes.value.filter(dish => 
      dish.dish_name.toLowerCase().includes(query.toLowerCase()) || 
      dish.cuisine_name.toLowerCase().includes(query.toLowerCase()) ||
      dish.ingredients.some(ing => ing.toLowerCase().includes(query.toLowerCase()))
    )
  })

  const getDishesByCuisine = computed(() => (cuisine: string) => {
    return dishes.value.filter(dish => dish.cuisine_name === cuisine)
  })

  const getCuisineByName = computed(() => (name: string) => {
    return cuisines.value.find(c => c.name === name)
  })

  // 添加菜品到数据库
  const addDish = async (dishData: Omit<Dish, 'id' | 'created_at'>) => {
    try {
      const { data, error: dbError } = await supabase
        .from('dish_data')
        .insert([{
          name: dishData.dish_name,  // 数据库中是name字段
          cuisine_name: dishData.cuisine_name,
          image_url: dishData.image_url,
          difficulty: dishData.difficulty,
          time_required: dishData.time_required,
          ingredients: dishData.ingredients,
          steps: dishData.steps,
          description: dishData.description,
          rating: dishData.rating
        }])
        .select()
      
      if (dbError) throw dbError
      
      if (data && data.length > 0) {
        // 更新本地数据
        dishes.value.unshift({
          ...data[0],
          id: data[0].id,
          created_at: data[0].created_at
        })
        return data[0]
      }
    } catch (err) {
      console.error('添加菜品失败:', err)
      throw err
    }
  }

  return {
    dishes,
    cuisines,
    isLoading,
    error,
    searchDishes,
    getDishesByCuisine,
    getCuisineByName,
    loadDishesFromDatabase,
    loadCuisinesFromDatabase,
    initializeData,
    addDish
  }
})