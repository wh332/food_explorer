<template>
  <div class="shopping-list">
    <div class="list-header">
      <h3>购物清单</h3>
      <button class="clear-button" @click="clearList">清空</button>
    </div>
    
    <div class="ingredients-list">
      <div v-for="ingredient in groupedIngredients" :key="ingredient.name" class="ingredient-item">
        <label class="ingredient-checkbox">
          <input 
            type="checkbox" 
            :checked="ingredient.checked"
            @change="toggleIngredient(ingredient.name)"
          />
          <span class="checkmark"></span>
        </label>
        <span class="ingredient-name" :class="{ 'checked': ingredient.checked }">
          {{ ingredient.name }}
        </span>
        <span class="ingredient-quantity">{{ ingredient.quantity }}</span>
      </div>
    </div>
    
    <div v-if="groupedIngredients.length === 0" class="empty-state">
      <p>暂无食材</p>
    </div>
    
    <div class="list-actions">
      <button class="action-button" @click="printList">打印清单</button>
      <button class="action-button" @click="shareList">分享</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Ingredient {
  name: string
  quantity: string
  checked: boolean
}

const ingredients = ref<Ingredient[]>([])

// 添加食材到购物清单
const addIngredients = (newIngredients: string[]) => {
  newIngredients.forEach(ingredient => {
    // 解析食材和数量（例如："草鱼片 300g" -> ["草鱼片", "300g"]）
    const match = ingredient.match(/(.+?)\s+(\d+[a-zA-Z]*)/)
    if (match) {
      const name = match[1].trim()
      const quantity = match[2]
      
      const existing = ingredients.value.find(ing => ing.name === name)
      if (existing) {
        // 如果已存在，合并数量
        existing.quantity = quantity
      } else {
        ingredients.value.push({
          name,
          quantity,
          checked: false
        })
      }
    } else {
      // 如果没有数量信息，直接添加名称
      ingredients.value.push({
        name: ingredient.trim(),
        quantity: '',
        checked: false
      })
    }
  })
}

// 按食材名称分组
const groupedIngredients = computed(() => {
  const grouped: { [key: string]: Ingredient } = {}
  
  ingredients.value.forEach(ingredient => {
    if (!grouped[ingredient.name]) {
      grouped[ingredient.name] = { ...ingredient }
    }
  })
  
  return Object.values(grouped)
})

// 切换食材选中状态
const toggleIngredient = (name: string) => {
  const ingredient = ingredients.value.find(ing => ing.name === name)
  if (ingredient) {
    ingredient.checked = !ingredient.checked
  }
}

// 清空购物清单
const clearList = () => {
  if (confirm('确定要清空购物清单吗？')) {
    ingredients.value = []
  }
}

// 打印清单
const printList = () => {
  const printContent = groupedIngredients.value
    .map(ing => `${ing.checked ? '✅' : '⬜'} ${ing.name} ${ing.quantity}`)
    .join('\n')
  
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head><title>购物清单</title></head>
        <body>
          <h1>购物清单</h1>
          <pre>${printContent}</pre>
        </body>
      </html>
    `)
    printWindow.print()
  }
}

// 分享清单
const shareList = async () => {
  const shareText = groupedIngredients.value
    .map(ing => `${ing.name} ${ing.quantity}`)
    .join('\n')
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: '我的购物清单',
        text: shareText
      })
    } catch (error) {
      console.log('分享取消')
    }
  } else {
    // 备用方案：复制到剪贴板
    navigator.clipboard.writeText(shareText)
    alert('清单已复制到剪贴板！')
  }
}

// 暴露方法给父组件
defineExpose({
  addIngredients
})
</script>

<style scoped>
.shopping-list {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.list-header h3 {
  margin: 0;
  font-size: 18px;
}

.clear-button {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.ingredients-list {
  max-height: 300px;
  overflow-y: auto;
}

.ingredient-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.ingredient-checkbox {
  display: flex;
  align-items: center;
  margin-right: 12px;
}

.ingredient-checkbox input {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #ddd;
  border-radius: 3px;
  display: inline-block;
  position: relative;
}

.ingredient-checkbox input:checked + .checkmark {
  background: #4ecdc4;
  border-color: #4ecdc4;
}

.ingredient-checkbox input:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  color: white;
  font-size: 12px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.ingredient-name {
  flex: 1;
  font-size: 14px;
}

.ingredient-name.checked {
  text-decoration: line-through;
  color: #888;
}

.ingredient-quantity {
  font-size: 12px;
  color: #666;
  margin-left: 8px;
}

.empty-state {
  text-align: center;
  padding: 20px;
  color: #888;
}

.list-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

.action-button {
  flex: 1;
  background: #4ecdc4;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.action-button:hover {
  background: #3dbeb4;
}
</style>