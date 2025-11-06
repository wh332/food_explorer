<template>
  <div class="nutrition-calculator">
    <div class="calculator-header">
      <h3>🍎 营养计算器</h3>
      <p>计算菜品的营养成分</p>
    </div>
    
    <div class="calculator-form">
      <div class="input-group">
        <label>食材列表</label>
        <div class="ingredients-table">
          <div class="table-header">
            <div class="col-name">食材名称</div>
            <div class="col-amount">数量</div>
            <div class="col-unit">单位</div>
            <div class="col-actions">操作</div>
          </div>
          <div 
            v-for="(ingredient, index) in ingredientsList" 
            :key="index" 
            class="table-row"
          >
            <div class="col-name">
              <input 
                type="text" 
                v-model="ingredient.name" 
                placeholder="如：猪肉"
                @input="validateIngredient(ingredient)"
              >
            </div>
            <div class="col-amount">
              <input 
                type="number" 
                v-model.number="ingredient.amount" 
                min="0" 
                step="0.1"
                placeholder="200"
                @input="validateIngredient(ingredient)"
              >
            </div>
            <div class="col-unit">
              <select v-model="ingredient.unit" @change="validateIngredient(ingredient)">
                <option value="g">g</option>
                <option value="kg">kg</option>
                <option value="ml">ml</option>
                <option value="l">l</option>
                <option value="个">个</option>
                <option value="片">片</option>
                <option value="瓣">瓣</option>
                <option value="根">根</option>
                <option value="把">把</option>
                <option value="勺">勺</option>
                <option value="杯">杯</option>
              </select>
            </div>
            <div class="col-actions">
              <button 
                @click="removeIngredient(index)" 
                class="btn-remove"
                :disabled="ingredientsList.length <= 1"
              >
                ✕
              </button>
            </div>
          </div>
          <button @click="addIngredient" class="btn-add">+ 添加食材</button>
        </div>
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
      
      <button @click="calculateNutrition" class="btn-calculate" :disabled="!hasValidIngredients">
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
      
      <!-- 额外的营养信息 -->
      <div v-if="nutritionResult.sodium || nutritionResult.cholesterol" class="additional-nutrition">
        <h5>其他营养信息</h5>
        <div class="nutrition-grid">
          <div v-if="nutritionResult.sodium" class="nutrition-item">
            <span class="label">钠</span>
            <span class="value">{{ nutritionResult.sodium }}mg</span>
          </div>
          <div v-if="nutritionResult.cholesterol" class="nutrition-item">
            <span class="label">胆固醇</span>
            <span class="value">{{ nutritionResult.cholesterol }}mg</span>
          </div>
          <div v-if="nutritionResult.vitaminA" class="nutrition-item">
            <span class="label">维生素A</span>
            <span class="value">{{ nutritionResult.vitaminA }}μg</span>
          </div>
          <div v-if="nutritionResult.vitaminC" class="nutrition-item">
            <span class="label">维生素C</span>
            <span class="value">{{ nutritionResult.vitaminC }}mg</span>
          </div>
          <div v-if="nutritionResult.calcium" class="nutrition-item">
            <span class="label">钙</span>
            <span class="value">{{ nutritionResult.calcium }}mg</span>
          </div>
          <div v-if="nutritionResult.iron" class="nutrition-item">
            <span class="label">铁</span>
            <span class="value">{{ nutritionResult.iron }}mg</span>
          </div>
        </div>
      </div>

      <!-- 营养分析 -->
      <div v-if="nutritionResult.analysis" class="nutrition-analysis">
        <h5>📊 营养分析</h5>
        
        <!-- 营养平衡总结 -->
        <div v-if="nutritionResult.analysis.balance" class="balance-section">
          <h6>🔄 营养平衡</h6>
          <div class="balance-content">
            <div v-if="nutritionResult.analysis.balance.summary" class="balance-summary">
              <strong>{{ nutritionResult.analysis.balance.summary }}</strong>
            </div>
            <div v-if="nutritionResult.analysis.balance.details" class="balance-details">
              <div v-if="nutritionResult.analysis.balance.details.energy" class="balance-detail">
                <span class="detail-label">能量:</span>
                <span>{{ nutritionResult.analysis.balance.details.energy }}</span>
              </div>
              <div v-if="nutritionResult.analysis.balance.details.macronutrients" class="balance-detail">
                <span class="detail-label">宏量营养素:</span>
                <span>{{ nutritionResult.analysis.balance.details.macronutrients }}</span>
              </div>
              <div v-if="nutritionResult.analysis.balance.details.micronutrients" class="balance-detail">
                <span class="detail-label">微量营养素:</span>
                <span>{{ nutritionResult.analysis.balance.details.micronutrients }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 亮点营养素 -->
        <div v-if="nutritionResult.analysis.highlights && nutritionResult.analysis.highlights.length > 0" class="highlights-section">
          <h6>✨ 亮点营养素</h6>
          <div class="highlights-list">
            <div v-for="(highlight, index) in nutritionResult.analysis.highlights" :key="index" class="highlight-item">
              <div class="highlight-bullet">•</div>
              <div class="highlight-content">{{ highlight }}</div>
            </div>
          </div>
        </div>

        <!-- 饮食建议 -->
        <div v-if="nutritionResult.analysis.recommendations && nutritionResult.analysis.recommendations.length > 0" class="recommendations-section">
          <h6>💡 饮食建议</h6>
          <div class="recommendations-list">
            <div v-for="(recommendation, index) in nutritionResult.analysis.recommendations" :key="index" class="recommendation-item">
              <div class="recommendation-number">{{ index + 1 }}</div>
              <div class="recommendation-content">{{ recommendation }}</div>
            </div>
          </div>
        </div>

        <!-- 适合的饮食类型 -->
        <div v-if="nutritionResult.analysis.dietType && nutritionResult.analysis.dietType.length > 0" class="diet-type-section">
          <h6>🥗 适合的饮食类型</h6>
          <div class="diet-type-list">
            <div v-for="(diet, index) in nutritionResult.analysis.dietType" :key="index" class="diet-type-item">
              <div class="diet-bullet">🥗</div>
              <div class="diet-content">{{ diet }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 每份营养信息 -->
      <div v-if="nutritionResult.perServing" class="per-serving-section">
        <h5>🍽️ 每份营养信息</h5>
        <div class="nutrition-grid">
          <div class="nutrition-item">
            <span class="label">热量</span>
            <span class="value">{{ nutritionResult.perServing.calories }} kcal</span>
          </div>
          <div class="nutrition-item">
            <span class="label">蛋白质</span>
            <span class="value">{{ nutritionResult.perServing.protein }}g</span>
          </div>
          <div class="nutrition-item">
            <span class="label">碳水化合物</span>
            <span class="value">{{ nutritionResult.perServing.carbs }}g</span>
          </div>
          <div class="nutrition-item">
            <span class="label">脂肪</span>
            <span class="value">{{ nutritionResult.perServing.fat }}g</span>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  calculateNutritionWithN8N, 
  validateIngredients
} from '../services/nutritionService'

interface NutritionAnalysis {
  balance?: {
    summary?: string
    details?: {
      energy?: string
      macronutrients?: string
      micronutrients?: string
    }
  }
  highlights?: string[]
  recommendations?: string[]
  dietType?: string[]
}

interface NutritionResult {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sugar: number
  sodium?: number
  cholesterol?: number
  vitaminA?: number
  vitaminC?: number
  calcium?: number
  iron?: number
  analysis?: NutritionAnalysis
  perServing?: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

interface IngredientItem {
  name: string
  amount: number
  unit: string
}

const ingredientsList = ref<IngredientItem[]>([
  { name: '', amount: 0, unit: 'g' }
])
const servings = ref(1)
const nutritionResult = ref<NutritionResult | null>(null)
const isLoading = ref(false)
const error = ref('')

// 计算属性：检查是否有有效的食材
const hasValidIngredients = computed(() => {
  return ingredientsList.value.some(ingredient => 
    ingredient.name.trim() && ingredient.amount > 0
  )
})

const addIngredient = () => {
  ingredientsList.value.push({ name: '', amount: 0, unit: 'g' })
}

const removeIngredient = (index: number) => {
  if (ingredientsList.value.length > 1) {
    ingredientsList.value.splice(index, 1)
  }
}

const validateIngredient = (ingredient: IngredientItem) => {
  // 实时验证食材数据
  if (ingredient.name && ingredient.amount > 0) {
    // 数据有效
  }
}

// 获取适合度样式类
const getSuitabilityClass = (suitability: string) => {
  switch (suitability) {
    case '高': return 'suitability-high'
    case '中高': return 'suitability-medium-high'
    case '中等': return 'suitability-medium'
    case '中低': return 'suitability-medium-low'
    case '低': return 'suitability-low'
    default: return 'suitability-medium'
  }
}

const calculateNutrition = async () => {
  // 过滤掉空行
  const validIngredients = ingredientsList.value.filter(ingredient => 
    ingredient.name.trim() && ingredient.amount > 0
  )
  
  if (validIngredients.length === 0) {
    error.value = '请输入至少一种有效的食材'
    return
  }
  
  isLoading.value = true
  error.value = ''
  nutritionResult.value = null
  
  try {
    // 验证食材格式
    const validation = validateIngredients(validIngredients)
    if (!validation.isValid) {
      error.value = validation.errors.join('，')
      return
    }
    
    // 调用n8n服务计算营养
    const result = await calculateNutritionWithN8N({
      ingredients: validIngredients,
      servings: servings.value
    })
    
    if (result.success && result.nutrition) {
      // 合并nutrition数据以及analysis和perServing数据
      nutritionResult.value = {
        ...result.nutrition,
        analysis: result.analysis,
        perServing: result.perServing
      }
    } else {
      error.value = result.error || '营养计算失败'
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

/* 营养分析样式 */
.nutrition-analysis {
  margin-top: 20px;
}

.nutrition-analysis h5 {
  color: #333;
  margin-bottom: 16px;
  font-size: 18px;
}

.nutrition-analysis h6 {
  color: #555;
  margin: 16px 0 8px 0;
  font-size: 16px;
}

.balance-section {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.balance-summary {
  margin-bottom: 12px;
}

.balance-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.balance-detail {
  display: flex;
  gap: 8px;
}

.detail-label {
  font-weight: 600;
  color: #333;
  min-width: 80px;
}

.highlights-section {
  margin-bottom: 16px;
}

.highlights-list {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.highlight-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.highlight-item:last-child {
  border-bottom: none;
}

.highlight-bullet {
  color: #28a745;
  font-size: 16px;
  margin-right: 12px;
  min-width: 16px;
}

.highlight-content {
  color: #333;
  line-height: 1.5;
  flex: 1;
}

.recommendations-section {
  margin-bottom: 16px;
}

.recommendations-list {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.recommendation-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.recommendation-item:last-child {
  border-bottom: none;
}

.recommendation-number {
  background: #667eea;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin-right: 12px;
  min-width: 24px;
}

.recommendation-content {
  color: #333;
  line-height: 1.5;
  flex: 1;
}

.diet-type-section {
  background: #e3f2fd;
  padding: 16px;
  border-radius: 8px;
}

.diet-type-list {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.diet-type-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.diet-type-item:last-child {
  border-bottom: none;
}

.diet-bullet {
  color: #1565c0;
  font-size: 16px;
  margin-right: 12px;
  min-width: 16px;
}

.diet-content {
  color: #333;
  line-height: 1.5;
  flex: 1;
}

/* 食材表格样式 */
.ingredients-table {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 0.5fr;
  gap: 8px;
  padding: 12px;
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 0.5fr;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
}

.table-row:last-child {
  border-bottom: none;
}

.col-name input,
.col-amount input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.col-unit select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
}

.btn-remove {
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px;
  cursor: pointer;
  font-size: 12px;
  min-width: 24px;
  min-height: 24px;
}

.btn-remove:hover:not(:disabled) {
  background: #ff5252;
}

.btn-remove:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-add {
  width: 100%;
  background: #28a745;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 0 0 8px 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-add:hover {
  background: #218838;
}

/* 营养分析样式 */
.nutrition-analysis {
  margin-top: 20px;
}

.nutrition-analysis h5 {
  color: #333;
  margin-bottom: 16px;
  font-size: 18px;
}

.nutrition-analysis h6 {
  color: #555;
  margin: 16px 0 8px 0;
  font-size: 16px;
}

.balance-section {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.balance-summary {
  margin-bottom: 12px;
}

.balance-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.balance-detail {
  display: flex;
  gap: 8px;
}

.detail-label {
  font-weight: 600;
  color: #333;
  min-width: 80px;
}

.highlights-section {
  margin-bottom: 16px;
}

.highlights-list {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.highlight-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.highlight-item:last-child {
  border-bottom: none;
}

.highlight-bullet {
  color: #28a745;
  font-size: 16px;
  margin-right: 12px;
  min-width: 16px;
}

.highlight-content {
  color: #333;
  line-height: 1.5;
  flex: 1;
}

.recommendations-section {
  margin-bottom: 16px;
}

.recommendations-list {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.recommendation-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.recommendation-item:last-child {
  border-bottom: none;
}

.recommendation-number {
  background: #667eea;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin-right: 12px;
  min-width: 24px;
}

.recommendation-content {
  color: #333;
  line-height: 1.5;
  flex: 1;
}

.diet-type-section {
  background: #e3f2fd;
  padding: 16px;
  border-radius: 8px;
}

.diet-type-list {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.diet-type-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.diet-type-item:last-child {
  border-bottom: none;
}

.diet-bullet {
  color: #1565c0;
  font-size: 16px;
  margin-right: 12px;
  min-width: 16px;
}

.diet-content {
  color: #333;
  line-height: 1.5;
  flex: 1;
}

/* 食材表格样式 */
.ingredients-table {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 0.5fr;
  gap: 8px;
  padding: 12px;
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 0.5fr;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
}

.table-row:last-child {
  border-bottom: none;
}

.col-name input,
.col-amount input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.col-unit select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
}

.btn-remove {
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px;
  cursor: pointer;
  font-size: 12px;
  min-width: 24px;
  min-height: 24px;
}

.btn-remove:hover:not(:disabled) {
  background: #ff5252;
}

.btn-remove:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-add {
  width: 100%;
  background: #28a745;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 0 0 8px 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-add:hover {
  background: #218838;
}
</style>