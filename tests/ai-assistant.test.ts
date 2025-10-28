import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { callAIAssistant, validateAIResponse, generateRecommendations } from '../src/utils/aiUtils'

// Mock AI助手API调用
global.fetch = vi.fn()

describe('AI Assistant Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('AI Response Validation', () => {
    it('should validate successful AI response', () => {
      const validResponse = {
        message: '根据您的口味偏好，我推荐尝试川菜的水煮鱼，这道菜麻辣鲜香，非常适合喜欢重口味的朋友。',
        recommendations: ['水煮鱼', '麻婆豆腐', '宫保鸡丁'],
        confidence: 0.85
      }

      const result = validateAIResponse(validResponse)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should detect invalid AI response format', () => {
      const invalidResponse = {
        message: '推荐菜品',
        // 缺少必要的字段
      }

      const result = validateAIResponse(invalidResponse)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Missing required fields')
    })
  })

  describe('Recommendation Generation', () => {
    it('should generate recommendations based on user preferences', () => {
      const userPreferences = {
        spicyLevel: 'high',
        cuisineType: '川菜',
        dietaryRestrictions: [],
        favoriteIngredients: ['鱼', '豆腐', '鸡肉']
      }

      const recommendations = generateRecommendations(userPreferences)
      
      expect(recommendations).toHaveLength(3)
      expect(recommendations[0].cuisine).toBe('川菜')
      expect(recommendations[0].spicyLevel).toBe('high')
    })

    it('should handle empty preferences gracefully', () => {
      const emptyPreferences = {}
      const recommendations = generateRecommendations(emptyPreferences)
      
      expect(recommendations).toBeDefined()
      expect(recommendations.length).toBeGreaterThan(0)
    })
  })

  describe('AI API Integration', () => {
    it('should handle successful API call', async () => {
      const mockResponse = {
        message: '推荐成功',
        recommendations: ['水煮鱼', '麻婆豆腐']
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response)

      const result = await callAIAssistant('我想吃辣的菜')
      expect(result.message).toBe('推荐成功')
      expect(result.recommendations).toHaveLength(2)
    })

    it('should handle API errors gracefully', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('API unavailable'))

      await expect(callAIAssistant('test message')).rejects.toThrow('API unavailable')
    })
  })
})