// 简化的n8n工作流服务
// 直接使用测试成功的URL连接

interface RecipeGenerationRequest {
  ingredients: string[]
  cuisine?: string
  difficulty?: string
  userId?: string
}

interface RecipeGenerationResponse {
  success: boolean
  recipe?: {
    name: string
    cuisine: string
    difficulty: string
    cookingTime: string
    ingredients: string[]
    steps: string[]
    tips?: string
  }
  error?: string
}

// 测试成功的webhook URL - 使用本地n8n服务地址
const N8N_WEBHOOK_URL = 'http://localhost:5678/webhook/recipe-generator'

/**
 * 调用n8n工作流生成菜谱
 */
export async function generateRecipeWithN8N(request: RecipeGenerationRequest): Promise<RecipeGenerationResponse> {
  try {
    console.log('发送数据到n8n:', request)
    
    // 构建请求数据（与测试脚本一致）
    const requestData = {
      ingredients: request.ingredients,
      cuisine: request.cuisine || '不限',
      difficulty: request.difficulty || '简单',
      userId: request.userId,
      timestamp: new Date().toISOString()
    }

    // 直接发送到n8n（与测试脚本一致）
    const response = await fetch(N8N_WEBHOOK_URL, {
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
      recipe: result.recipe
    }

  } catch (error) {
    console.error('n8n调用失败:', error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : '生成菜谱失败'
    }
  }
}