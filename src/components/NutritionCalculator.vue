<template>
  <div class="nutrition-calculator">
    <div class="calculator-header">
      <h3>🍎 营养计算器</h3>
      <p>计算菜品的营养成分</p>
    </div>
    
    <div class="calculator-form">
      <div class="input-group">
        <label for="ingredients">食材列表（每行一个）</label>
        <textarea 
          id="ingredients"
          v-model="ingredients"
          placeholder="例如：
猪肉 200g
白菜 300g
盐 5g
..."
          rows="6"
        ></textarea>
      </div>
      
      <div class="input-group">
        <label for="servings">份数</label>
        <input 
          id="servings"
          type="number" 
          v-model.number="servings" 
          min="1" 
          max="20"
        >
      </div>
      
      <button @click="calculateNutrition" class="btn-calculate" :disabled="!ingredients">
        {{ isLoading ? '计算中...' : '计算营养' }}
      </button>
    </div>
    
    <div v-if="nutritionResult" class="nutrition-result">
      <h4>营养成分（每份）</h4>
      <div class="nutrition-grid">
        <div class="nutrition-item">
          <span class="label">热量</span>
          <span class="value">{{ nutritionResult.calories }} kcal</span>
        </div>
        <div class="nutrition-item">
          <span class="label">蛋白质</span>
          <span class="value">{{ nutritionResult.protein }}g</span>
        </div>
        <div class="nutrition-item">
          <span class="label">碳水化合物</span>
          <span class="value">{{ nutritionResult.carbs }}g</span>
        </div>
        <div class="nutrition-item">
          <span class="label">脂肪</span>
          <span class="value">{{ nutritionResult.fat }}g</span>
        </div>
        <div class="nutrition-item">
          <span class="label">纤维</span>
          <span class="value">{{ nutritionResult.fiber }}g</span>
        </div>
        <div class="nutrition-item">
          <span class="label">糖分</span>
          <span class="value">{{ nutritionResult.sugar }}g</span>
        </div>
      </div>
    </div>
    
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface NutritionResult {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sugar: number
}

const ingredients = ref('')
const servings = ref(1)
const nutritionResult = ref<NutritionResult | null>(null)
const isLoading = ref(false)
const error = ref('')

// 模拟营养数据库
const nutritionDatabase = {
  '猪肉': { calories: 242, protein: 25, carbs: 0, fat: 16, fiber: 0, sugar: 0 },
  '牛肉': { calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0, sugar: 0 },
  '鸡肉': { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0 },
  '白菜': { calories: 13, protein: 1.5, carbs: 2.3, fat: 0.1, fiber: 1, sugar: 1.2 },
  '土豆': { calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2, sugar: 0.8 },
  '米饭': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sugar: 0.1 },
  '盐': { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 },
  '油': { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, sugar: 0 },
  '糖': { calories: 387, protein: 0, carbs: 100, fat: 0, fiber: 0, sugar: 100 }
}

const calculateNutrition = async () => {
  if (!ingredients.value.trim()) {
    error.value = '请输入食材列表'
    return
  }
  
  isLoading.value = true
  error.value = ''
  nutritionResult.value = null
  
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const lines = ingredients.value.trim().split('\n')
    let totalNutrition = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 }
    let foundIngredients = 0
    
    for (const line of lines) {
      const match = line.match(/([\u4e00-\u9fff\w\s]+)\s*(\d+)(g|kg|ml|l)?/i)
      if (match) {
        const ingredientName = match[1].trim().toLowerCase()
        const amount = parseInt(match[2])
        const unit = match[3] || 'g'
        
        // 查找匹配的食材
        for (const [name, nutrition] of Object.entries(nutritionDatabase)) {
          if (name.toLowerCase().includes(ingredientName) || ingredientName.includes(name.toLowerCase())) {
            const multiplier = unit === 'kg' ? 1000 : 1
            const normalizedAmount = amount * multiplier
            
            totalNutrition.calories += (nutrition.calories * normalizedAmount) / 100
            totalNutrition.protein += (nutrition.protein * normalizedAmount) / 100
            totalNutrition.carbs += (nutrition.carbs * normalizedAmount) / 100
            totalNutrition.fat += (nutrition.fat * normalizedAmount) / 100
            totalNutrition.fiber += (nutrition.fiber * normalizedAmount) / 100
            totalNutrition.sugar += (nutrition.sugar * normalizedAmount) / 100
            
            foundIngredients++
            break
          }
        }
      }
    }
    
    if (foundIngredients === 0) {
      error.value = '未找到匹配的食材数据，请检查输入格式'
      return
    }
    
    // 按份数计算
    nutritionResult.value = {
      calories: Math.round(totalNutrition.calories / servings.value),
      protein: Math.round(totalNutrition.protein / servings.value * 10) / 10,
      carbs: Math.round(totalNutrition.carbs / servings.value * 10) / 10,
      fat: Math.round(totalNutrition.fat / servings.value * 10) / 10,
      fiber: Math.round(totalNutrition.fiber / servings.value * 10) / 10,
      sugar: Math.round(totalNutrition.sugar / servings.value * 10) / 10
    }
    
  } catch (err) {
    error.value = '计算失败，请重试'
    console.error('营养计算错误:', err)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.nutrition-calculator {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.calculator-header {
  text-align: center;
  margin-bottom: 24px;
}

.calculator-header h3 {
  color: #333;
  margin-bottom: 8px;
}

.calculator-header p {
  color: #666;
  margin: 0;
}

.input-group {
  margin-bottom: 16px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.input-group textarea,
.input-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.input-group textarea:focus,
.input-group input:focus {
  outline: none;
  border-color: #667eea;
}

.btn-calculate {
  width: 100%;
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-calculate:hover:not(:disabled) {
  background: #5a6fd8;
}

.btn-calculate:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.nutrition-result {
  margin-top: 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.nutrition-result h4 {
  margin: 0 0 16px 0;
  color: #333;
}

.nutrition-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.nutrition-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
}

.nutrition-item .label {
  color: #666;
  font-size: 14px;
}

.nutrition-item .value {
  color: #333;
  font-weight: 600;
}

.error-message {
  margin-top: 16px;
  padding: 12px;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 6px;
  color: #c33;
  text-align: center;
}
</style>