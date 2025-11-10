<template>
  <div class="shopping-list">
    <!-- 添加食材输入区域 -->
    <div class="add-section">
      <h4>添加食材</h4>
      <div class="input-group">
        <input 
          v-model="newIngredientName" 
          type="text" 
          placeholder="食材名称"
          class="name-input"
          @keyup.enter="addIngredient"
        />
        <input 
          v-model="newIngredientQuantity" 
          type="text" 
          placeholder="数量（如：200g）"
          class="quantity-input"
          @keyup.enter="addIngredient"
        />
        <button class="add-button" @click="addIngredient">添加</button>
      </div>
      <div class="quick-add-section">
        <p class="quick-add-label">快速添加：</p>
        <div class="quick-add-buttons">
          <button 
            v-for="item in quickAddItems" 
            :key="item"
            class="quick-add-button"
            @click="quickAdd(item)"
          >
            {{ item }}
          </button>
        </div>
      </div>
    </div>

    <div class="list-header">
      <h3>购物清单</h3>
      <div class="header-actions">
        <span class="item-count">{{ groupedIngredients.length }} 项</span>
        <button class="clear-button" @click="clearList">清空</button>
      </div>
    </div>
    
    <div class="ingredients-list">
      <div v-for="ingredient in groupedIngredients" :key="ingredient.id" class="ingredient-item">
        <label class="ingredient-checkbox">
          <input 
            type="checkbox" 
            :checked="ingredient.checked"
            @change="toggleIngredient(ingredient.id)"
          />
          <span class="checkmark"></span>
        </label>
        <span class="ingredient-name" :class="{ 'checked': ingredient.checked }">
          {{ ingredient.name }}
        </span>
        <span class="ingredient-quantity">{{ ingredient.quantity }}</span>
        <button class="delete-button" @click="removeIngredient(ingredient.id)" title="删除">×</button>
      </div>
    </div>
    
    <div v-if="groupedIngredients.length === 0" class="empty-state">
      <p>暂无食材，请先添加食材到购物清单</p>
    </div>
    
    <div class="list-actions">
      <button class="action-button" @click="clearCompleted">清除已选</button>
      <button class="action-button" @click="printList">打印清单</button>
      <button class="action-button" @click="saveListToFile">保存到文件</button>
      <button class="action-button" @click="shareList">分享</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Ingredient {
  id: string
  name: string
  quantity: string
  checked: boolean
}

const ingredients = ref<Ingredient[]>([])
const newIngredientName = ref('')
const newIngredientQuantity = ref('')

// 快速添加的常用食材
const quickAddItems = [
  '鸡蛋 6个',
  '猪肉 200g', 
  '鸡肉 300g',
  '牛肉 250g',
  '大米 500g',
  '西红柿 2个',
  '土豆 3个',
  '青菜 300g',
  '胡萝卜 1根',
  '豆腐 1块'
]

// 生成唯一ID
const generateId = () => Math.random().toString(36).substr(2, 9)

// 从本地存储加载数据
onMounted(() => {
  const saved = localStorage.getItem('shoppingList')
  if (saved) {
    ingredients.value = JSON.parse(saved)
  }
})

// 保存到本地存储
const saveToLocalStorage = () => {
  localStorage.setItem('shoppingList', JSON.stringify(ingredients.value))
}

// 手动添加食材
const addIngredient = () => {
  if (!newIngredientName.value.trim()) {
    alert('请输入食材名称')
    return
  }

  const name = newIngredientName.value.trim()
  const quantity = newIngredientQuantity.value.trim()
  
  ingredients.value.push({
    id: generateId(),
    name,
    quantity,
    checked: false
  })
  
  // 清空输入框
  newIngredientName.value = ''
  newIngredientQuantity.value = ''
  
  saveToLocalStorage()
}

// 快速添加
const quickAdd = (item: string) => {
  const match = item.match(/(.+?)\s+(\d+[a-zA-Z\u4e00-\u9fff]*)/)
  if (match) {
    const name = match[1].trim()
    const quantity = match[2]
    
    ingredients.value.push({
      id: generateId(),
      name,
      quantity,
      checked: false
    })
    
    saveToLocalStorage()
  }
}

// 添加食材到购物清单（从外部导入）
const addIngredients = (newIngredients: string[]) => {
  newIngredients.forEach(ingredient => {
    const match = ingredient.match(/(.+?)\s+(\d+[a-zA-Z\u4e00-\u9fff]*)/)
    if (match) {
      const name = match[1].trim()
      const quantity = match[2]
      
      ingredients.value.push({
        id: generateId(),
        name,
        quantity,
        checked: false
      })
    } else {
      // 如果没有数量信息，直接添加名称
      ingredients.value.push({
        id: generateId(),
        name: ingredient.trim(),
        quantity: '',
        checked: false
      })
    }
  })
  
  saveToLocalStorage()
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
const toggleIngredient = (id: string) => {
  const ingredient = ingredients.value.find(ing => ing.id === id)
  if (ingredient) {
    ingredient.checked = !ingredient.checked
    saveToLocalStorage()
  }
}

// 删除单个食材
const removeIngredient = (id: string) => {
  ingredients.value = ingredients.value.filter(ing => ing.id !== id)
  saveToLocalStorage()
}

// 清除已选中的食材
const clearCompleted = () => {
  ingredients.value = ingredients.value.filter(ing => !ing.checked)
  saveToLocalStorage()
}

// 清空购物清单
const clearList = () => {
  if (confirm('确定要清空购物清单吗？')) {
    ingredients.value = []
    saveToLocalStorage()
  }
}

// 打印清单
const printList = () => {
  const currentDate = new Date().toLocaleDateString('zh-CN')
  const printContent = groupedIngredients.value
    .map(ing => `<tr><td style="text-align: center; padding: 4px;">${ing.checked ? '✅' : '⬜'}</td><td style="padding: 8px;">${ing.name}</td><td style="padding: 8px;">${ing.quantity}</td></tr>`)
    .join('')
  
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>购物清单</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; text-align: center; }
            .date { text-align: center; color: #666; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background: #f5f5f5; padding: 12px; text-align: left; border-bottom: 2px solid #ddd; }
            td { border-bottom: 1px solid #eee; }
            .footer { text-align: center; margin-top: 30px; color: #888; font-size: 12px; }
            @media print {
              body { margin: 0; }
              @page { margin: 1cm; }
            }
          </style>
        </head>
        <body>
          <h1>购物清单</h1>
          <div class="date">生成时间: ${currentDate}</div>
          <table>
            <thead>
              <tr>
                <th style="width: 60px; text-align: center;">状态</th>
                <th style="width: 200px;">食材名称</th>
                <th style="width: 100px;">数量</th>
              </tr>
            </thead>
            <tbody>${printContent}</tbody>
          </table>
          <div class="footer">共 ${groupedIngredients.value.length} 项食材</div>
        </body>
      </html>
    `)
    printWindow.document.close()
    
    // 延迟打印以确保样式加载完成
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 500)
  }
}

// 保存清单到本地文件
const saveListToFile = async () => {
  const currentDate = new Date().toLocaleDateString('zh-CN')
  const fileName = `购物清单_${currentDate}.txt`
  
  // 构建文件内容
  const fileContent = `购物清单\n生成时间: ${currentDate}\n\n` + 
    groupedIngredients.value
      .map(ing => `${ing.checked ? '[✓]' : '[ ]'} ${ing.name} ${ing.quantity}`)
      .join('\n') + 
    `\n\n共 ${groupedIngredients.value.length} 项食材`
  
  try {
    // 检查是否支持 File System Access API
    if ('showSaveFilePicker' in window) {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: fileName,
        types: [{
          description: '文本文件',
          accept: {'text/plain': ['.txt']}
        }]
      })
      
      const writable = await handle.createWritable()
      await writable.write(fileContent)
      await writable.close()
      
      alert('购物清单已保存到本地文件！')
    } else {
      // 备用方案：使用下载链接
      const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      alert('购物清单下载完成！')
    }
  } catch (error) {
    console.error('保存文件失败:', error)
    
    // 最后备用方案：用户手动复制
    const finalContent = `购物清单 (${currentDate})\n\n` + 
      groupedIngredients.value
        .map(ing => `${ing.checked ? '✅' : '⬜'} ${ing.name} ${ing.quantity}`)
        .join('\n') + 
      `\n\n共 ${groupedIngredients.value.length} 项食材`
    
    if (confirm('浏览器不支持直接保存文件。是否复制内容到剪贴板？')) {
      try {
        await navigator.clipboard.writeText(finalContent)
        alert('购物清单已复制到剪贴板！您可以粘贴到文本编辑器中保存。')
      } catch (clipboardError) {
        alert('复制失败，请手动复制以下内容：\n\n' + finalContent)
      }
    }
  }
}

// 分享清单
const shareList = async () => {
  const shareText = groupedIngredients.value
    .map(ing => `${ing.checked ? '✅' : '⬜'} ${ing.name} ${ing.quantity}`)
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
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

/* 添加食材区域 */
.add-section {
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.add-section h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #333;
}

.input-group {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.name-input, .quantity-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.add-button {
  background: #4ecdc4;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  min-width: 60px;
}

.add-button:hover {
  background: #3dbeb4;
}

.quick-add-section {
  margin-top: 12px;
}

.quick-add-label {
  font-size: 12px;
  color: #666;
  margin: 0 0 8px 0;
}

.quick-add-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.quick-add-button {
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 16px;
  padding: 4px 12px;
  font-size: 12px;
  cursor: pointer;
  color: #333;
}

.quick-add-button:hover {
  background: #e9ecef;
}

/* 列表头部 */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.list-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.item-count {
  font-size: 12px;
  color: #666;
}

.clear-button {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.clear-button:hover {
  background: #ff5252;
}

/* 食材列表 */
.ingredients-list {
  max-height: 300px;
  overflow-y: auto;
}

.ingredient-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.ingredient-item:last-child {
  border-bottom: none;
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
  cursor: pointer;
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
  color: #333;
}

.ingredient-name.checked {
  text-decoration: line-through;
  color: #888;
}

.ingredient-quantity {
  font-size: 12px;
  color: #666;
  margin-left: 8px;
  min-width: 60px;
}

.delete-button {
  background: none;
  border: none;
  color: #ff6b6b;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 3px;
}

.delete-button:hover {
  background: #ffeaea;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #888;
  font-size: 14px;
}

/* 列表操作按钮 */
.list-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-top: 20px;
}

.action-button {
  background: #4ecdc4;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.action-button:hover {
  background: #3dbeb4;
}

.action-button:nth-child(1) {
  background: #6c757d;
}

.action-button:nth-child(1):hover {
  background: #5a6268;
}

.action-button:nth-child(3) {
  background: #28a745;
}

.action-button:nth-child(3):hover {
  background: #218838;
}

@media (max-width: 480px) {
  .list-actions {
    grid-template-columns: 1fr;
  }
}
</style>