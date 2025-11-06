// 营养计算器服务 - 连接到n8n工作流

interface NutritionCalculationRequest {
  ingredients: IngredientItem[]
  servings?: number
  userId?: string
}

interface IngredientItem {
  name: string
  amount: number
  unit: string
}

interface NutritionCalculationResponse {
  success: boolean
  nutrition?: NutritionInfo
  analysis?: {
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
  perServing?: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  error?: string
}

interface NutritionInfo {
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
  analysis?: {
    balance?: string
    highlights?: string[]
    recommendations?: string[]
    dietType?: string
  }
  perServing?: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

// n8n webhook URL - 营养计算工作流
const N8N_NUTRITION_WEBHOOK_URL = 'http://localhost:5678/webhook/nutrition-calculator'

/**
 * 调用n8n工作流计算营养信息
 */
export async function calculateNutritionWithN8N(request: NutritionCalculationRequest): Promise<NutritionCalculationResponse> {
  try {
    console.log('发送营养计算请求到n8n:', request)
    
    // 构建请求数据
    const requestData = {
      ingredients: request.ingredients,
      servings: request.servings || 1,
      userId: request.userId,
      timestamp: new Date().toISOString()
    }

    // 发送到n8n工作流
    const response = await fetch(N8N_NUTRITION_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestData)
    })

    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`)
    }

    const result = await response.json()
    
    // 返回n8n的响应
    return {
      success: true,
      nutrition: result.nutrition,
      analysis: result.analysis,
      perServing: result.perServing
    }

  } catch (error) {
    console.error('n8n营养计算失败:', error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : '营养计算失败'
    }
  }
}

/**
 * 解析食材输入文本为结构化数据
 */
export function parseIngredients(input: string): IngredientItem[] {
  const lines = input.trim().split('\n')
  const ingredients: IngredientItem[] = []
  
  for (const line of lines) {
    if (!line.trim()) continue
    
    console.log('解析行:', line)
    
    // 支持多种格式：
    // 1. "食材名 数量单位" 如："猪肉 200g"
    // 2. "数量单位 食材名" 如："200g 猪肉"
    // 3. "食材名: 数量单位" 如："猪肉: 200g"
    
    // 更精确的正则表达式，支持中文食材名包含空格
    const match1 = line.match(/([\u4e00-\u9fff\w\s]+)[\s:]*(\d+(?:\.\d+)?)\s*(g|kg|ml|l|个|片|瓣|根|把|勺|杯)?/i)
    const match2 = line.match(/(\d+(?:\.\d+)?)\s*(g|kg|ml|l|个|片|瓣|根|把|勺|杯)?\s*([\u4e00-\u9fff\w\s]+)/i)
    
    let match = match1 || match2
    
    if (match) {
      console.log('匹配成功:', match)
      
      let name, amount, unit
      
      if (match1) {
        // 格式1或3：食材名 数量单位 或 食材名: 数量单位
        name = match[1].trim()
        amount = parseFloat(match[2])
        unit = match[3] || 'g'
      } else {
        // 格式2：数量单位 食材名
        amount = parseFloat(match[1])
        unit = match[2] || 'g'
        name = match[3].trim()
      }
      
      console.log('解析结果:', { name, amount, unit })
      
      ingredients.push({
        name,
        amount,
        unit
      })
    } else {
      console.log('匹配失败，尝试简单解析')
      // 简单解析：空格分隔
      const parts = line.trim().split(/\s+/)
      if (parts.length >= 2) {
        // 尝试解析最后一个部分是否为数字
        const lastPart = parts[parts.length - 1]
        const numMatch = lastPart.match(/^(\d+(?:\.\d+)?)(g|kg|ml|l|个|片|瓣|根|把|勺|杯)?$/i)
        
        if (numMatch) {
          const amount = parseFloat(numMatch[1])
          const unit = numMatch[2] || 'g'
          const name = parts.slice(0, parts.length - 1).join(' ').trim()
          
          ingredients.push({
            name,
            amount,
            unit
          })
        }
      }
    }
  }
  
  console.log('最终解析结果:', ingredients)
  return ingredients
}

/**
 * 验证食材数据格式
 */
export function validateIngredients(ingredients: IngredientItem[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (ingredients.length === 0) {
    errors.push('请输入至少一种食材')
  }
  
  ingredients.forEach((ingredient, index) => {
    if (!ingredient.name.trim()) {
      errors.push(`第${index + 1}行：食材名称不能为空`)
    }
    
    if (ingredient.amount <= 0) {
      errors.push(`第${index + 1}行：食材数量必须大于0`)
    }
    
    if (ingredient.amount > 10000) {
      errors.push(`第${index + 1}行：食材数量过大，请检查单位`)
    }
  })
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * 获取支持的食材单位列表
 */
export function getSupportedUnits(): string[] {
  return ['g', 'kg', 'ml', 'l', '个', '片', '瓣', '根', '把', '勺', '杯']
}

/**
 * 单位转换函数（如果需要）
 */
export function convertUnit(amount: number, fromUnit: string, toUnit: string): number {
  const conversionRates: Record<string, Record<string, number>> = {
    'g': { 'kg': 0.001, 'g': 1 },
    'kg': { 'g': 1000, 'kg': 1 },
    'ml': { 'l': 0.001, 'ml': 1 },
    'l': { 'ml': 1000, 'l': 1 }
  }
  
  const rate = conversionRates[fromUnit]?.[toUnit]
  return rate ? amount * rate : amount
}