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

interface Recipe {
  name: string
  cuisine: string
  difficulty: string
  cookingTime: string
  ingredients: string[]
  steps: string[]
  tips?: string
}

const availableIngredients = ref('')
const selectedCuisine = ref('')
const selectedDifficulty = ref('简单')
const generatedRecipe = ref<Recipe | null>(null)
const isLoading = ref(false)
const error = ref('')

// 菜谱模板库
const recipeTemplates = [
  {
    name: '家常炒肉片',
    cuisine: '家常菜',
    difficulty: '简单',
    cookingTime: '20分钟',
    ingredients: ['猪肉片 200g', '青椒 1个', '红椒 1个', '姜蒜适量', '生抽 2勺', '料酒 1勺'],
    steps: [
      '猪肉切片，用生抽、料酒腌制10分钟',
      '青椒、红椒切块，姜蒜切末',
      '热锅凉油，下姜蒜爆香',
      '放入肉片快速翻炒至变色',
      '加入青红椒继续翻炒',
      '调入适量盐和生抽，炒匀即可'
    ],
    tips: '肉片要切薄，火候要快，保持肉质嫩滑'
  },
  {
    name: '酸辣土豆丝',
    cuisine: '川菜',
    difficulty: '简单',
    cookingTime: '15分钟',
    ingredients: ['土豆 2个', '干辣椒 5个', '花椒 1小勺', '醋 2勺', '糖 1勺', '盐适量'],
    steps: [
      '土豆去皮切丝，泡水去除淀粉',
      '干辣椒剪段，准备好花椒',
      '热锅热油，下花椒、干辣椒爆香',
      '放入土豆丝快速翻炒',
      '加入醋、糖、盐调味',
      '炒至土豆丝变软即可出锅'
    ],
    tips: '土豆丝要切细，炒制时间不宜过长'
  },
  {
    name: '番茄炒蛋',
    cuisine: '家常菜',
    difficulty: '简单',
    cookingTime: '10分钟',
    ingredients: ['鸡蛋 3个', '番茄 2个', '葱花适量', '盐适量', '糖少许'],
    steps: [
      '鸡蛋打散，番茄切块',
      '热锅热油，倒入鸡蛋液炒熟盛出',
      '锅中留底油，下番茄块翻炒',
      '加入适量盐和糖，炒出汤汁',
      '倒入炒好的鸡蛋，翻炒均匀',
      '撒上葱花即可出锅'
    ],
    tips: '番茄要炒出汤汁，糖可以中和酸味'
  }
]

const generateRecipe = async () => {
  if (!availableIngredients.value.trim()) {
    error.value = '请输入可用食材'
    return
  }
  
  isLoading.value = true
  error.value = ''
  
  try {
    // 模拟AI生成延迟
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const ingredients = availableIngredients.value.trim().toLowerCase().split('\n')
    
    // 根据输入匹配最合适的菜谱模板
    let bestMatch = recipeTemplates[0]
    let maxMatchCount = 0
    
    for (const template of recipeTemplates) {
      let matchCount = 0
      for (const ingredient of ingredients) {
        if (template.ingredients.some(item => item.toLowerCase().includes(ingredient))) {
          matchCount++
        }
      }
      
      if (matchCount > maxMatchCount) {
        maxMatchCount = matchCount
        bestMatch = template
      }
    }
    
    // 根据用户选择调整菜谱
    const adjustedRecipe = {
      ...bestMatch,
      cuisine: selectedCuisine.value || bestMatch.cuisine,
      difficulty: selectedDifficulty.value
    }
    
    generatedRecipe.value = adjustedRecipe
    
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
</style>