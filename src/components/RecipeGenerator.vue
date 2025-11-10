<template>
  <div class="recipe-generator">
    <div class="generator-header">
      <h3>👨‍🍳 智能菜谱生成器</h3>
      <p>根据现有食材生成创意菜谱</p>
    </div>
    
    <div class="generator-form">
      <div class="input-group">
        <label for="available-ingredients">可用食材</label>
        <textarea 
          id="available-ingredients"
          v-model="availableIngredients"
          placeholder="例如：
猪肉
白菜
土豆
胡萝卜
鸡蛋
..."
          rows="4"
        ></textarea>
      </div>
      
      <div class="input-group">
        <label for="cuisine-type">菜系偏好</label>
        <select v-model="selectedCuisine" id="cuisine-type">
          <option value="">不限菜系</option>
          <option value="川菜">川菜（麻辣）</option>
          <option value="粤菜">粤菜（清淡）</option>
          <option value="湘菜">湘菜（香辣）</option>
          <option value="鲁菜">鲁菜（咸鲜）</option>
          <option value="苏菜">苏菜（甜鲜）</option>
          <option value="浙菜">浙菜（清淡）</option>
          <option value="闽菜">闽菜（鲜香）</option>
          <option value="徽菜">徽菜（重油重色）</option>
        </select>
      </div>
      
      <div class="input-group">
        <label for="difficulty">难度级别</label>
        <select v-model="selectedDifficulty" id="difficulty">
          <option value="简单">简单（新手友好）</option>
          <option value="中等">中等（有一定经验）</option>
          <option value="困难">困难（烹饪高手）</option>
        </select>
      </div>
      
      <button @click="generateRecipe" class="btn-generate" :disabled="!availableIngredients || isLoading">
        {{ isLoading ? '生成中...' : '生成菜谱' }}
      </button>
      
      <!-- n8n服务状态显示 -->
      <div v-if="n8nStatus" class="service-status">
        <div class="status-indicator" :class="{ connected: n8nStatus.connected }">
          <span class="status-dot"></span>
          {{ n8nStatus.service }}: {{ n8nStatus.status }}
          <span v-if="n8nStatus.fallback" class="fallback-info">(备用: {{ n8nStatus.fallback }})</span>
        </div>
      </div>
    </div>
    
    <div v-if="generatedRecipe" class="recipe-result">
      <div class="recipe-header">
        <h4>{{ generatedRecipe.name }}</h4>
        <div class="recipe-meta">
          <span class="cuisine-tag">{{ generatedRecipe.cuisine }}</span>
          <span class="difficulty-tag">{{ generatedRecipe.difficulty }}</span>
          <span class="time-tag">{{ generatedRecipe.cookingTime }}</span>
        </div>
      </div>
      
      <div class="recipe-section">
        <h5>📋 食材清单</h5>
        <ul class="ingredients-list">
          <li v-for="(ingredient, index) in generatedRecipe.ingredients" :key="index">
            {{ ingredient }}
          </li>
        </ul>
      </div>
      
      <div class="recipe-section">
        <h5>👨‍🍳 制作步骤</h5>
        <ol class="steps-list">
          <li v-for="(step, index) in generatedRecipe.steps" :key="index">
            {{ step }}
          </li>
        </ol>
      </div>
      
      <div class="recipe-section" v-if="generatedRecipe.tips">
        <h5>💡 小贴士</h5>
        <p>{{ generatedRecipe.tips }}</p>
      </div>
      
      <div class="recipe-actions">
        <button @click="saveRecipe" class="btn-save">💾 保存菜谱</button>
        <button @click="generateRecipe" class="btn-regenerate">🔄 重新生成</button>
      </div>
    </div>
    
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '../stores/userStore'
import { generateRecipeWithN8N } from '../services/n8nService'

interface Recipe {
  name: string
  cuisine: string
  difficulty: string
  cookingTime: string
  ingredients: string[]
  steps: string[]
  tips?: string
  nutritionInfo?: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

const userStore = useUserStore()
const availableIngredients = ref('')
const selectedCuisine = ref('')
const selectedDifficulty = ref('简单')
const generatedRecipe = ref<Recipe | null>(null)
const isLoading = ref(false)
const error = ref('')
const n8nStatus = ref<any>(null)

const generateRecipe = async () => {
  if (!availableIngredients.value.trim()) {
    error.value = '请输入可用食材'
    return
  }
  
  isLoading.value = true
  error.value = ''
  
  try {
    // 过滤空行和非空食材
    const ingredients = availableIngredients.value
      .trim()
      .split('\n')
      .filter(ingredient => ingredient.trim() !== '')
    
    // 调用n8n服务生成菜谱，即使userId获取失败也继续
    const result = await generateRecipeWithN8N({
      ingredients: ingredients,
      cuisine: selectedCuisine.value,
      difficulty: selectedDifficulty.value,
      userId: userStore.user?.id
    })
    
    if (result.success && result.recipe) {
      generatedRecipe.value = result.recipe
    } else {
      throw new Error(result.error || '生成菜谱失败')
    }
    
  } catch (err) {
    error.value = '生成菜谱失败，请重试'
    console.error('菜谱生成错误:', err)
  } finally {
    isLoading.value = false
  }
}

const saveRecipe = () => {
  if (generatedRecipe.value) {
    // 这里可以集成到收藏功能
    alert('菜谱已保存到收藏夹！')
    console.log('保存菜谱:', generatedRecipe.value)
  }
}
</script>

<style scoped>
.recipe-generator {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.generator-header {
  text-align: center;
  margin-bottom: 24px;
}

.generator-header h3 {
  color: #333;
  margin-bottom: 8px;
}

.generator-header p {
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
.input-group select {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.input-group textarea:focus,
.input-group select:focus {
  outline: none;
  border-color: #667eea;
}

.btn-generate {
  width: 100%;
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-generate:hover:not(:disabled) {
  background: #ff5252;
}

.btn-generate:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.recipe-result {
  margin-top: 24px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.recipe-header {
  text-align: center;
  margin-bottom: 20px;
}

.recipe-header h4 {
  color: #333;
  margin-bottom: 12px;
  font-size: 1.5rem;
}

.recipe-meta {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.cuisine-tag,
.difficulty-tag,
.time-tag {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.cuisine-tag {
  background: #667eea;
  color: white;
}

.difficulty-tag {
  background: #ff6b6b;
  color: white;
}

.time-tag {
  background: #51cf66;
  color: white;
}

.recipe-section {
  margin-bottom: 20px;
}

.recipe-section h5 {
  color: #333;
  margin-bottom: 12px;
  font-size: 1.1rem;
}

.ingredients-list,
.steps-list {
  margin: 0;
  padding-left: 20px;
}

.ingredients-list li,
.steps-list li {
  margin-bottom: 8px;
  line-height: 1.5;
}

.recipe-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 20px;
}

.btn-save,
.btn-regenerate {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-save {
  background: #51cf66;
  color: white;
}

.btn-save:hover {
  background: #40c057;
}

.btn-regenerate {
  background: #868e96;
  color: white;
}

.btn-regenerate:hover {
  background: #6c757d;
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

/* n8n服务状态样式 */
.service-status {
  margin-top: 16px;
  text-align: center;
}

.status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
}

.status-indicator.connected {
  background: #e8f5e8;
  border-color: #51cf66;
  color: #2b8a3e;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #868e96;
}

.status-indicator.connected .status-dot {
  background: #51cf66;
  animation: pulse 2s infinite;
}

.fallback-info {
  font-size: 10px;
  color: #868e96;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

/* n8n服务状态样式 */
.service-status {
  margin-top: 16px;
  text-align: center;
}

.status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
}

.status-indicator.connected {
  background: #e8f5e8;
  border-color: #51cf66;
  color: #2b8a3e;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #868e96;
}

.status-indicator.connected .status-dot {
  background: #51cf66;
  animation: pulse 2s infinite;
}

.fallback-info {
  font-size: 10px;
  color: #868e96;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
</style>