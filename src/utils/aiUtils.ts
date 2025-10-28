// AI助手工具函数

export interface AIResponse {
  message: string
  recommendations: string[]
  confidence: number
  cuisineType?: string
  cookingTime?: string
  difficulty?: 'easy' | 'medium' | 'hard'
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export interface UserPreferences {
  spicyLevel?: 'none' | 'mild' | 'medium' | 'high'
  cuisineType?: string
  dietaryRestrictions?: string[]
  favoriteIngredients?: string[]
  cookingTime?: string
  difficulty?: 'easy' | 'medium' | 'hard'
}

// AI助手API配置
export const AI_CONFIG = {
  baseURL: process.env.VITE_AI_API_URL || 'https://api.deepseek.com',
  timeout: 30000,
  maxRetries: 3,
  retryDelay: 1000
}

// 验证AI响应格式
export function validateAIResponse(response: any): ValidationResult {
  const errors: string[] = []

  if (!response) {
    errors.push('Response is null or undefined')
    return { isValid: false, errors }
  }

  if (typeof response.message !== 'string') {
    errors.push('Message must be a string')
  }

  if (!Array.isArray(response.recommendations)) {
    errors.push('Recommendations must be an array')
  }

  if (typeof response.confidence !== 'number' || response.confidence < 0 || response.confidence > 1) {
    errors.push('Confidence must be a number between 0 and 1')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// 生成推荐菜品
export function generateRecommendations(preferences: UserPreferences): AIResponse {
  const baseRecommendations = {
    message: '根据您的偏好为您推荐以下菜品：',
    recommendations: [],
    confidence: 0.8
  }

  // 根据用户偏好生成推荐
  if (preferences.cuisineType === '川菜' && preferences.spicyLevel === 'high') {
    baseRecommendations.recommendations = ['水煮鱼', '麻婆豆腐', '夫妻肺片']
    baseRecommendations.confidence = 0.9
  } else if (preferences.cuisineType === '粤菜') {
    baseRecommendations.recommendations = ['白切鸡', '叉烧', '清蒸鱼']
    baseRecommendations.confidence = 0.85
  } else {
    // 默认推荐
    baseRecommendations.recommendations = ['番茄炒蛋', '红烧肉', '宫保鸡丁']
    baseRecommendations.confidence = 0.7
  }

  return baseRecommendations as AIResponse
}

// 调用AI助手API
export async function callAIAssistant(userMessage: string): Promise<AIResponse> {
  try {
    const response = await fetch(`${AI_CONFIG.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.VITE_AI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的美食助手，根据用户的口味偏好推荐合适的菜品。请用中文回答。'
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`)
    }

    const data = await response.json()
    
    // 解析AI响应
    const aiMessage = data.choices[0]?.message?.content || '抱歉，暂时无法提供推荐。'
    
    return {
      message: aiMessage,
      recommendations: extractRecommendations(aiMessage),
      confidence: 0.8
    }
  } catch (error) {
    console.error('AI助手调用失败:', error)
    
    // 降级处理：返回默认推荐
    return {
      message: '网络连接问题，为您推荐一些经典菜品：',
      recommendations: ['水煮鱼', '麻婆豆腐', '宫保鸡丁'],
      confidence: 0.6
    }
  }
}

// 从AI响应中提取推荐菜品
function extractRecommendations(message: string): string[] {
  const recommendations: string[] = []
  
  // 简单的菜品名称匹配
  const dishPatterns = [
    /水煮鱼/g,
    /麻婆豆腐/g,
    /宫保鸡丁/g,
    /白切鸡/g,
    /叉烧/g,
    /清蒸鱼/g,
    /红烧肉/g,
    /番茄炒蛋/g
  ]

  dishPatterns.forEach(pattern => {
    const matches = message.match(pattern)
    if (matches) {
      recommendations.push(...matches)
    }
  })

  // 去重
  return [...new Set(recommendations)]
}

// 计算推荐置信度
export function calculateConfidence(preferences: UserPreferences, recommendations: string[]): number {
  let confidence = 0.5 // 基础置信度

  // 根据匹配程度调整置信度
  if (preferences.cuisineType && recommendations.some(dish => 
    dish.includes(preferences.cuisineType.substring(0, 1))
  )) {
    confidence += 0.2
  }

  if (preferences.spicyLevel === 'high' && recommendations.some(dish => 
    ['辣', '麻', '重口味'].some(keyword => dish.includes(keyword))
  )) {
    confidence += 0.15
  }

  return Math.min(confidence, 1.0)
}