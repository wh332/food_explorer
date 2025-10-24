<template>
  <div class="cooking-timer">
    <div class="timer-header">
      <h3>烹饪计时器</h3>
      <button class="reset-button" @click="resetTimer">重置</button>
    </div>
    
    <div class="timer-display">
      <div class="time-circle">
        <span class="time-text">{{ formattedTime }}</span>
        <div class="timer-progress" :style="progressStyle"></div>
      </div>
    </div>
    
    <div class="timer-controls">
      <button class="control-button" @click="startTimer" :disabled="isRunning">
        {{ isRunning ? '计时中...' : '开始计时' }}
      </button>
      <button class="control-button" @click="pauseTimer" :disabled="!isRunning">
        暂停
      </button>
      <button class="control-button" @click="stopTimer" :disabled="!isRunning && elapsedTime === 0">
        停止
      </button>
    </div>
    
    <div class="preset-times">
      <h4>常用时间</h4>
      <div class="preset-buttons">
        <button 
          v-for="time in presetTimes" 
          :key="time"
          class="preset-button"
          @click="setPresetTime(time)"
        >
          {{ time }}分钟
        </button>
      </div>
    </div>
    
    <div class="custom-time">
      <h4>自定义时间</h4>
      <div class="time-inputs">
        <input 
          v-model.number="customMinutes" 
          type="number" 
          min="0" 
          max="59" 
          placeholder="分"
          class="time-input"
        />
        <span>:</span>
        <input 
          v-model.number="customSeconds" 
          type="number" 
          min="0" 
          max="59" 
          placeholder="秒"
          class="time-input"
        />
        <button class="set-button" @click="setCustomTime">设置</button>
      </div>
    </div>
    
    <div v-if="isFinished" class="timer-alert">
      <div class="alert-content">
        <span class="alert-icon">🔔</span>
        <p>时间到！</p>
        <button class="alert-button" @click="dismissAlert">知道了</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

const totalTime = ref(0) // 总时间（秒）
const elapsedTime = ref(0) // 已过时间（秒）
const isRunning = ref(false)
const isFinished = ref(false)
const timerInterval = ref<NodeJS.Timeout | null>(null)

const customMinutes = ref(0)
const customSeconds = ref(0)

const presetTimes = [5, 10, 15, 20, 30, 45, 60]

// 格式化时间显示
const formattedTime = computed(() => {
  const minutes = Math.floor(elapsedTime.value / 60)
  const seconds = elapsedTime.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// 进度条样式
const progressStyle = computed(() => {
  const progress = totalTime.value > 0 ? (elapsedTime.value / totalTime.value) * 100 : 0
  return {
    '--progress': `${progress}%`
  }
})

// 开始计时
const startTimer = () => {
  if (totalTime.value === 0) {
    alert('请先设置计时时间')
    return
  }
  
  isRunning.value = true
  isFinished.value = false
  
  timerInterval.value = setInterval(() => {
    elapsedTime.value++
    
    if (elapsedTime.value >= totalTime.value) {
      stopTimer()
      isFinished.value = true
      // 播放提示音
      playAlertSound()
    }
  }, 1000)
}

// 暂停计时
const pauseTimer = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
  isRunning.value = false
}

// 停止计时
const stopTimer = () => {
  pauseTimer()
  elapsedTime.value = totalTime.value
}

// 重置计时器
const resetTimer = () => {
  pauseTimer()
  totalTime.value = 0
  elapsedTime.value = 0
  isFinished.value = false
}

// 设置预设时间
const setPresetTime = (minutes: number) => {
  resetTimer()
  totalTime.value = minutes * 60
  elapsedTime.value = 0
}

// 设置自定义时间
const setCustomTime = () => {
  const minutes = customMinutes.value || 0
  const seconds = customSeconds.value || 0
  const totalSeconds = minutes * 60 + seconds
  
  if (totalSeconds > 0) {
    resetTimer()
    totalTime.value = totalSeconds
  } else {
    alert('请输入有效的时间')
  }
}

// 播放提示音
const playAlertSound = () => {
  // 创建简单的提示音
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  oscillator.frequency.value = 800
  gainNode.gain.value = 0.1
  
  oscillator.start()
  setTimeout(() => {
    oscillator.stop()
  }, 1000)
}

// 关闭提示
const dismissAlert = () => {
  isFinished.value = false
}

// 组件卸载时清理定时器
onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
})
</script>

<style scoped>
.cooking-timer {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.timer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.timer-header h3 {
  margin: 0;
  font-size: 18px;
}

.reset-button {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.timer-display {
  text-align: center;
  margin-bottom: 20px;
}

.time-circle {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
  border-radius: 50%;
  background: conic-gradient(#4ecdc4 var(--progress), #eee var(--progress));
  display: flex;
  align-items: center;
  justify-content: center;
}

.time-circle::before {
  content: '';
  position: absolute;
  width: 100px;
  height: 100px;
  background: white;
  border-radius: 50%;
}

.time-text {
  position: relative;
  z-index: 1;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.timer-controls {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.control-button {
  flex: 1;
  background: #4ecdc4;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.control-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.preset-times h4,
.custom-time h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
}

.preset-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 16px;
}

.preset-button {
  background: #f8f9fa;
  border: 1px solid #ddd;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.preset-button:hover {
  background: #e9ecef;
}

.time-inputs {
  display: flex;
  align-items: center;
  gap: 4px;
}

.time-input {
  width: 60px;
  padding: 4px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
}

.set-button {
  background: #4ecdc4;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.timer-alert {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.alert-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

.alert-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 10px;
}

.alert-button {
  background: #4ecdc4;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}
</style>