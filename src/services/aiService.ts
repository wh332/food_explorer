import { AIResponse, UserPreferences, callAIAssistant, generateRecommendations } from '../utils/aiUtils'

// AI助手服务类
export class AIService {
  private conversationHistory: Array<{ role: 'user' | 'assistant'; content: string; timestamp: Date }> = []
  private userPreferences: UserPreferences = {}

  // 设置用户偏好
  setUserPreferences(preferences: UserPreferences): void {
    this.userPreferences = { ...this.userPreferences, ...preferences }
    this.savePreferences()
  }

  // 获取用户偏好
  getUserPreferences(): UserPreferences {
    return this.userPreferences
  }

  // 保存偏好到本地存储
  private savePreferences(): void {
    try {
      localStorage.setItem('aiAssistantPreferences', JSON.stringify(this.userPreferences))
    } catch (error) {
      console.warn('无法保存用户偏好到本地存储:', error)
    }
  }

  // 从本地存储加载偏好
  loadPreferences(): void {
    try {
      const saved = localStorage.getItem('aiAssistantPreferences')
      if (saved) {
        this.userPreferences = JSON.parse(saved)
      }
    } catch (error) {
      console.warn('无法从本地存储加载用户偏好:', error)
    }
  }

  // 发送消息给AI助手
  async sendMessage(userMessage: string): Promise<AIResponse> {
    // 添加到对话历史
    this.conversationHistory.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    })

    try {
      // 调用AI助手API
      const aiResponse = await callAIAssistant(userMessage)
      
      // 添加到对话历史
      this.conversationHistory.push({
        role: 'assistant',
        content: aiResponse.message,
        timestamp: new Date()
      })

      // 保存对话历史（限制大小）
      this.trimConversationHistory()
      
      return aiResponse
    } catch (error) {
      console.error('AI助手服务错误:', error)
      
      // 降级处理：使用本地推荐生成
      const fallbackResponse = generateRecommendations(this.userPreferences)
      
      this.conversationHistory.push({
        role: 'assistant',
        content: fallbackResponse.message,
        timestamp: new Date()
      })

      return fallbackResponse
    }
  }

  // 获取对话历史
  getConversationHistory() {
    return this.conversationHistory
  }

  // 清空对话历史
  clearConversationHistory(): void {
    this.conversationHistory = []
  }

  // 限制对话历史大小
  private trimConversationHistory(): void {
    const MAX_HISTORY = 50 // 最大对话记录数
    if (this.conversationHistory.length > MAX_HISTORY) {
      this.conversationHistory = this.conversationHistory.slice(-MAX_HISTORY)
    }
  }

  // 分析用户消息中的偏好信息
  analyzeUserPreferences(message: string): Partial<UserPreferences> {
    const preferences: Partial<UserPreferences> = {}

    // 分析辣度偏好
    if (message.includes('辣') || message.includes('麻辣') || message.includes('重口味')) {
      preferences.spicyLevel = 'high'
    } else if (message.includes('微辣') || message.includes('清淡')) {
      preferences.spicyLevel = 'mild'
    } else if (message.includes('不辣')) {
      preferences.spicyLevel = 'none'
    }

    // 分析菜系偏好
    const cuisineKeywords = {
      '川菜': '川菜',
      '粤菜': '粤菜', 
      '鲁菜': '鲁菜',
      '苏菜': '苏菜',
      '闽菜': '闽菜',
      '浙菜': '浙菜',
      '湘菜': '湘菜',
      '徽菜': '徽菜'
    }

    for (const [keyword, cuisine] of Object.entries(cuisineKeywords)) {
      if (message.includes(keyword)) {
        preferences.cuisineType = cuisine
        break
      }
    }

    // 分析食材偏好
    const ingredientKeywords = ['鱼', '鸡', '牛', '猪', '豆腐', '蔬菜', '海鲜']
    const favoriteIngredients: string[] = []
    
    ingredientKeywords.forEach(ingredient => {
      if (message.includes(ingredient)) {
        favoriteIngredients.push(ingredient)
      }
    })

    if (favoriteIngredients.length > 0) {
      preferences.favoriteIngredients = favoriteIngredients
    }

    return preferences
  }

  // 获取智能推荐（基于历史对话和用户偏好）
  async getSmartRecommendations(): Promise<AIResponse> {
    // 基于用户偏好和历史对话生成更精准的推荐
    const context = this.buildRecommendationContext()
    
    try {
      return await callAIAssistant(context)
    } catch (error) {
      // 降级到本地推荐
      return generateRecommendations(this.userPreferences)
    }
  }

  // 构建推荐上下文
  private buildRecommendationContext(): string {
    let context = '根据以下信息推荐菜品：\n'
    
    // 添加用户偏好
    if (this.userPreferences.spicyLevel) {
      context += `- 辣度偏好：${this.userPreferences.spicyLevel}\n`
    }
    if (this.userPreferences.cuisineType) {
      context += `- 菜系偏好：${this.userPreferences.cuisineType}\n`
    }
    if (this.userPreferences.favoriteIngredients) {
      context += `- 喜欢的食材：${this.userPreferences.favoriteIngredients.join('、')}\n`
    }

    // 添加上下文信息
    if (this.conversationHistory.length > 0) {
      const recentMessages = this.conversationHistory.slice(-3)
      context += '\n最近的对话：\n'
      recentMessages.forEach(msg => {
        context += `${msg.role === 'user' ? '用户' : '助手'}: ${msg.content}\n`
      })
    }

    context += '\n请推荐3个合适的菜品，并说明推荐理由。'
    
    return context
  }
}

// 创建全局AI服务实例
export const aiService = new AIService()

// 初始化AI服务
export function initializeAIService(): void {
  aiService.loadPreferences()
}