<template>
  <div class="ai-assistant">
    <div class="container">
      <div class="page-header">
        <h1>AI美食助手</h1>
        <p>智能推荐适合您口味的美食</p>
      </div>

      <div class="assistant-container">
        <!-- AI助手界面 -->
        <div class="assistant-interface">
          <div class="assistant-header">
            <div class="assistant-avatar">
              <span class="avatar-emoji">🤖</span>
            </div>
            <div class="assistant-info">
              <h3>美食小助手</h3>
              <p>随时为您推荐美味菜品</p>
            </div>
          </div>

          <!-- 聊天区域 -->
          <div class="chat-container">
            <div class="chat-messages">
              <div v-for="(message, index) in chatHistory" :key="index" 
                   :class="['message', message.type]">
                <div class="message-content">
                  <p>{{ message.content }}</p>
                  <span class="message-time">{{ message.time }}</span>
                </div>
              </div>
              <div v-if="isLoading" class="loading-indicator">
                <div class="typing-animation">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span>AI助手正在思考...</span>
              </div>
            </div>

            <!-- 用户输入 -->
            <div class="input-area">
              <div class="quick-questions">
                <button v-for="question in quickQuestions" :key="question" 
                        @click="sendQuickQuestion(question)" class="quick-question-btn">
                  {{ question }}
                </button>
              </div>
              
              <div class="input-container">
                <input 
                  v-model="userInput" 
                  @keyup.enter="sendMessage"
                  type="text" 
                  placeholder="输入您的问题或需求..."
                  class="message-input"
                >
                <button @click="sendMessage" class="send-btn">
                  <span class="send-icon">📤</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 推荐结果 -->
        <div class="recommendation-sidebar">
          <h3>推荐结果</h3>
          <div v-if="recommendedDishes.length > 0" class="recommendation-list">
            <div v-for="dish in recommendedDishes" :key="dish.id" 
                 class="recommendation-card" @click="viewDishDetail(dish.id)">
              <div class="rec-image">
                <span class="rec-emoji">🍲</span>
              </div>
              <div class="rec-info">
                <h4>{{ dish.name }}</h4>
                <span class="rec-cuisine">{{ dish.cuisine }}</span>
                <p class="rec-desc">{{ dish.description }}</p>
                <div class="rec-meta">
                  <span class="rec-time">{{ dish.time }}</span>
                  <span class="rec-difficulty">{{ dish.difficulty }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="no-recommendations">
            <p>暂无推荐，请与AI助手交流获取个性化推荐</p>
          </div>
        </div>
      </div>

      <!-- 偏好设置 -->
      <div class="preference-section">
        <h3>口味偏好设置</h3>
        <div class="preference-grid">
          <div class="preference-card">
            <h4>口味偏好</h4>
            <div class="preference-options">
              <label v-for="flavor in flavorPreferences" :key="flavor.value" class="preference-option">
                <input type="checkbox" v-model="userPreferences.flavors" :value="flavor.value">
                <span class="checkmark"></span>
                {{ flavor.label }}
              </label>
            </div>
          </div>

          <div class="preference-card">
            <h4>烹饪难度</h4>
            <div class="preference-options">
              <label v-for="level in difficultyLevels" :key="level.value" class="preference-option">
                <input type="radio" v-model="userPreferences.difficulty" :value="level.value">
                <span class="checkmark radio"></span>
                {{ level.label }}
              </label>
            </div>
          </div>

          <div class="preference-card">
            <h4>可用时间</h4>
            <select v-model="userPreferences.availableTime" class="time-select">
              <option value="">不限时间</option>
              <option value="15分钟">15分钟以内</option>
              <option value="30分钟">30分钟以内</option>
              <option value="1小时">1小时以内</option>
              <option value="2小时">2小时以上</option>
            </select>
          </div>
        </div>
        
        <button @click="updatePreferences" class="btn btn-primary save-prefs">
          保存偏好设置
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFoodStore } from '../stores/foodStore'

const router = useRouter()
const foodStore = useFoodStore()

interface ChatMessage {
  type: 'user' | 'assistant'
  content: string
  time: string
}

interface UserPreferences {
  flavors: string[]
  difficulty: string
  availableTime: string
}

const userInput = ref('')
const chatHistory = ref<ChatMessage[]>([])
const recommendedDishes = ref<any[]>([])
const userPreferences = ref<UserPreferences>({
  flavors: [],
  difficulty: '',
  availableTime: ''
})
const isLoading = ref(false)

// AI助手API配置
const AI_API_CONFIG = {
  baseURL: 'https://api.deepseek.com',
  accessToken: 'sbp_0ee58c64c0621d5636d7ce352f22956caa83b785',
  model: 'deepseek-chat'
}

const quickQuestions = [
  '推荐简单的家常菜',
  '我想吃辣的菜品',
  '30分钟能完成的菜',
  '适合新手的菜品'
]

const flavorPreferences = [
  { value: 'spicy', label: '麻辣' },
  { value: 'sweet', label: '甜味' },
  { value: 'sour', label: '酸味' },
  { value: 'salty', label: '咸鲜' },
  { value: 'light', label: '清淡' }
]

const difficultyLevels = [
  { value: '简单', label: '简单' },
  { value: '中等', label: '中等' },
  { value: '困难', label: '困难' }
]

onMounted(() => {
  addMessage('assistant', '您好！我是美食小助手，请问您今天想吃什么？我可以根据您的口味偏好为您推荐合适的菜品。')
})

const addMessage = (type: 'user' | 'assistant', content: string) => {
  const now = new Date()
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  
  chatHistory.value.push({
    type,
    content,
    time
  })
}

const sendMessage = async () => {
  if (!userInput.value.trim()) return

  const userMessage = userInput.value
  addMessage('user', userMessage)
  userInput.value = ''
  isLoading.value = true

  try {
    const aiResponse = await callN8NAssistant(userMessage)
    addMessage('assistant', aiResponse)
    updateRecommendationsBasedOnAI(aiResponse)
  } catch (error) {
    console.error('n8n助手调用失败:', error)
    addMessage('assistant', '抱歉，AI助手暂时无法响应。为您推荐一些热门菜品：')
    updateRecommendations()
  } finally {
    isLoading.value = false
  }
}

const callN8NAssistant = async (userMessage: string): Promise<string> => {
  const n8nUrl = 'http://localhost:5678/webhook-test/food'
  
  try {
    console.log('发送请求到n8n:', { question: userMessage })
    
    const response = await fetch(n8nUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: userMessage
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // 首先尝试解析为JSON，如果失败则作为纯文本处理
    const responseText = await response.text()
    console.log('n8n返回原始文本:', responseText)
    
    try {
      // 尝试解析为JSON
      const data = JSON.parse(responseText)
      console.log('n8n返回JSON数据:', data)
      
      // 处理JSON格式的响应
      if (typeof data === 'string') {
        return data
      } else if (data && typeof data === 'object') {
        // 尝试从常见字段中提取回答内容
        const possibleAnswerFields = ['answer', 'response', 'text', 'content', 'message', 'result']
        for (const field of possibleAnswerFields) {
          if (data[field] && typeof data[field] === 'string') {
            return data[field]
          }
        }
        
        // 如果找不到特定字段，尝试返回整个响应的字符串表示
        return JSON.stringify(data, null, 2)
      }
    } catch (jsonError) {
      // 如果JSON解析失败，说明返回的是纯文本
      console.log('n8n返回的是纯文本响应')
      return responseText
    }
    
    return '收到您的提问，正在处理中...'
  } catch (error) {
    console.error('调用n8n服务失败:', error)
    // 如果n8n服务不可用，返回一个友好的提示
    const errorMessage = error instanceof Error ? error.message : '未知错误'
    return `抱歉，AI助手暂时无法响应。请检查n8n服务是否正常运行。错误信息：${errorMessage}`
  }
}

const updateRecommendationsBasedOnAI = (aiResponse: string) => {
  // 根据AI响应内容智能推荐
  const lowerResponse = aiResponse.toLowerCase()
  
  let filteredDishes = foodStore.dishes
  
  if (lowerResponse.includes('辣') || userInput.value.includes('辣')) {
    filteredDishes = filteredDishes.filter(dish => 
      dish.name.includes('辣') || dish.name.includes('麻') || dish.cuisine === '川菜' || dish.cuisine === '湘菜'
    )
  }
  
  if (lowerResponse.includes('简单') || userInput.value.includes('简单')) {
    filteredDishes = filteredDishes.filter(dish => dish.difficulty === '简单')
  }
  
  if (lowerResponse.includes('时间') || userInput.value.includes('时间')) {
    filteredDishes = filteredDishes.filter(dish => dish.time.includes('30') || dish.time.includes('15'))
  }
  
  recommendedDishes.value = filteredDishes.slice(0, 3)
}

const sendQuickQuestion = (question: string) => {
  userInput.value = question
  sendMessage()
}

// 保留原有的快速响应函数作为备用
const generateAIResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase()
  
  if (lowerMessage.includes('简单') || lowerMessage.includes('新手')) {
    return '为您推荐一些简单易学的家常菜，适合烹饪新手尝试！'
  } else if (lowerMessage.includes('辣') || lowerMessage.includes('麻辣')) {
    return '发现您喜欢辣味菜品，为您推荐一些麻辣鲜香的川菜和湘菜！'
  } else if (lowerMessage.includes('时间') || lowerMessage.includes('快速')) {
    return '为您筛选了一些快速完成的菜品，节省您的烹饪时间！'
  } else {
    return '根据您的需求，我为您推荐以下菜品，希望您会喜欢！'
  }
}

const updateRecommendations = () => {
  recommendedDishes.value = foodStore.dishes
    .filter((dish: any) => {
      let match = true
      
      if (userPreferences.value.difficulty) {
        match = match && dish.difficulty === userPreferences.value.difficulty
      }
      
      if (userPreferences.value.availableTime) {
        const timeMatch = dish.time.includes(userPreferences.value.availableTime.replace('以内', ''))
        match = match && timeMatch
      }
      
      return match
    })
    .slice(0, 3)
}

const updatePreferences = () => {
  addMessage('assistant', '偏好设置已更新！将根据您的新偏好为您推荐菜品。')
  updateRecommendations()
}

const viewDishDetail = (dishId: number) => {
  router.push(`/dish/${dishId}`)
}
</script>

<style scoped>
.ai-assistant {
  padding: 40px 0;
  min-height: 100vh;
  background: #f8f9fa;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 3rem;
  color: #333;
  margin-bottom: 10px;
}

.page-header p {
  font-size: 1.2rem;
  color: #666;
}

.assistant-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  margin-bottom: 60px;
}

.assistant-interface {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.assistant-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.assistant-avatar {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-emoji {
  font-size: 2rem;
}

.assistant-info h3 {
  font-size: 1.5rem;
  margin: 0 0 5px 0;
}

.assistant-info p {
  margin: 0;
  opacity: 0.9;
}

.chat-container {
  height: 500px;
  display: flex;
  flex-direction: column;
}

.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  max-height: 400px;
}

.message {
  margin-bottom: 20px;
  display: flex;
}

.message.user {
  justify-content: flex-end;
}

.message.assistant {
  justify-content: flex-start;
}

.message-content {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 12px;
  position: relative;
}

.message.user .message-content {
  background: #007bff;
  color: white;
}

.message.assistant .message-content {
  background: #f1f3f4;
  color: #333;
}

.message-time {
  font-size: 0.8rem;
  opacity: 0.7;
  display: block;
  margin-top: 5px;
}

.loading-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #f1f3f4;
  border-radius: 12px;
  margin: 10px 0;
}

.typing-animation {
  display: flex;
  gap: 4px;
}

.typing-animation span {
  height: 8px;
  width: 8px;
  background: #666;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-animation span:nth-child(1) { animation-delay: -0.32s; }
.typing-animation span:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.input-area {
  padding: 20px;
  border-top: 1px solid #e9ecef;
}

.quick-questions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.quick-question-btn {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-question-btn:hover {
  background: #007bff;
  color: white;
}

.input-container {
  display: flex;
  gap: 10px;
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
}

.message-input:focus {
  outline: none;
  border-color: #007bff;
}

.send-btn {
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0 20px;
  cursor: pointer;
  font-size: 1.2rem;
}

.recommendation-sidebar {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.recommendation-sidebar h3 {
  margin: 0 0 20px 0;
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
}

.recommendation-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.recommendation-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.recommendation-card:hover {
  transform: translateY(-2px);
}

.rec-image {
  text-align: center;
  margin-bottom: 10px;
}

.rec-emoji {
  font-size: 2rem;
}

.rec-info h4 {
  margin: 0 0 5px 0;
  font-size: 1.1rem;
}

.rec-cuisine {
  background: #007bff;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.rec-desc {
  font-size: 0.9rem;
  color: #666;
  margin: 8px 0;
}

.rec-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #999;
}

.no-recommendations {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.preference-section {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.preference-section h3 {
  margin: 0 0 20px 0;
  color: #333;
}

.preference-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 20px;
}

.preference-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.preference-card h4 {
  margin: 0 0 15px 0;
  color: #333;
}

.preference-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.preference-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.time-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e9ecef;
  border-radius: 4px;
}

.save-prefs {
  width: 100%;
}

@media (max-width: 768px) {
  .assistant-container {
    grid-template-columns: 1fr;
  }
  
  .preference-grid {
    grid-template-columns: 1fr;
  }
}
</style>