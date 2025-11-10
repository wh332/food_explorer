# n8n营养计算器工作流配置指南

## 概述
本文档指导如何配置n8n工作流来接收营养计算请求并返回详细的营养成分分析。

## 工作流设计

### 1. Webhook触发器
- **节点类型**: Webhook
- **配置**:
  - **HTTP Method**: POST
  - **Path**: `/webhook/nutrition-calculator`
  - **Response Mode**: "Respond to Webhook"

### 2. 请求数据验证
- **节点类型**: Function
- **功能**: 验证请求数据格式
- **输入数据格式**:
```json
{
  "ingredients": [
    {
      "name": "猪肉",
      "amount": 200,
      "unit": "g"
    },
    {
      "name": "白菜", 
      "amount": 300,
      "unit": "g"
    },
    {
      "name": "盐",
      "amount": 5,
      "unit": "g"
    }
  ],
  "servings": 2,
  "userId": "user-123",
  "timestamp": "2024-01-01T10:00:00Z"
}
```

### 3. 营养成分数据库查询
- **节点类型**: HTTP Request 或 数据库查询
- **配置**:
  - **方法**: GET/POST
  - **URL**: `https://api.edamam.com/api/nutrition-data` (示例)
  - **Headers**: 
    - `Content-Type: application/json`
    - `app_id: ${EDAMAM_APP_ID}`
    - `app_key: ${EDAMAM_APP_KEY}`
- **请求体**:
```json
{
  "ingr": [
    "200g 猪肉",
    "300g 白菜",
    "5g 盐"
  ]
}
```

### 4. AI营养分析（可选增强）
- **节点类型**: OpenAI/ChatGPT
- **配置**:
  - **模型**: GPT-4 或 GPT-3.5-turbo
  - **提示词模板**:
```
根据以下食材的营养成分数据，提供专业的营养分析建议：

食材营养成分：
{nutrition_data}

请分析：
1. 总体营养平衡性
2. 主要营养亮点
3. 可能的营养不足
4. 健康饮食建议
5. 适合的饮食类型（减脂、增肌、均衡等）

要求：
- 分析要专业准确
- 建议要实用可操作
- 语言要通俗易懂
- 包含具体数值分析
```

### 5. 响应格式化
- **节点类型**: Function
- **功能**: 格式化营养数据为标准JSON格式
- **输出格式**:
```json
{
  "success": true,
  "nutrition": {
    "calories": 350,
    "protein": 25.5,
    "carbs": 30.2,
    "fat": 15.8,
    "fiber": 5.2,
    "sugar": 8.1,
    "sodium": 1200,
    "cholesterol": 85,
    "vitaminA": 450,
    "vitaminC": 35,
    "calcium": 180,
    "iron": 3.5
  },
  "analysis": {
    "balance": "蛋白质充足，脂肪适中",
    "highlights": ["富含维生素C", "膳食纤维丰富"],
    "recommendations": ["适合减脂饮食", "建议增加蔬菜摄入"],
    "dietType": "均衡饮食"
  },
  "perServing": {
    "calories": 175,
    "protein": 12.8,
    "carbs": 15.1,
    "fat": 7.9
  }
}
```

### 6. 错误处理
- **节点类型**: Function
- **功能**: 处理API服务不可用或请求超时的情况
- **备用响应**:
```json
{
  "success": false,
  "error": "营养计算服务暂时不可用，请稍后重试"
}
```

## 环境变量配置

在n8n中配置以下环境变量：

```env
# 营养成分API配置
EDAMAM_APP_ID=your_edamam_app_id
EDAMAM_APP_KEY=your_edamam_app_key

# 或使用其他营养数据库
NUTRITIONIX_APP_ID=your_nutritionix_id
NUTRITIONIX_APP_KEY=your_nutritionix_key

# OpenAI配置（可选）
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4

# 工作流配置
WEBHOOK_PATH=/webhook/nutrition-calculator
REQUEST_TIMEOUT=30000
```

## 完整的n8n工作流JSON配置

```json
{
  "name": "营养计算器工作流",
  "nodes": [
    {
      "parameters": {
        "path": "nutrition-calculator",
        "responseMode": "responseNode"
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "functionCode": "// 验证请求数据\nconst { ingredients, servings } = $input.first().json;\n\nif (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {\n  throw new Error('食材列表不能为空');\n}\n\nfor (const ingredient of ingredients) {\n  if (!ingredient.name || !ingredient.amount || ingredient.amount <= 0) {\n    throw new Error('食材数据格式错误');\n}\n}\n\nreturn $input.first().json;"
      },
      "name": "数据验证",
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [460, 300]
    },
    {
      "parameters": {
        "authentication": "headerAuth",
        "url": "https://api.edamam.com/api/nutrition-data",
        "options": {},
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            },
            {
              "name": "app_id",
              "value": "{{ $env.EDAMAM_APP_ID }}"
            },
            {
              "name": "app_key", 
              "value": "{{ $env.EDAMAM_APP_KEY }}"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "ingr",
              "value": "={{ $('数据验证').first().json.ingredients.map(i => i.amount + i.unit + ' ' + i.name) }}"
            }
          ]
        }
      },
      "name": "营养成分API",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [680, 300]
    },
    {
      "parameters": {
        "functionCode": "// 格式化营养数据\nconst apiResponse = $input.first().json;\nconst servings = $('数据验证').first().json.servings || 1;\n\nconst nutrition = {\n  calories: apiResponse.calories || 0,\n  protein: apiResponse.totalNutrients?.PROCNT?.quantity || 0,\n  carbs: apiResponse.totalNutrients?.CHOCDF?.quantity || 0,\n  fat: apiResponse.totalNutrients?.FAT?.quantity || 0,\n  fiber: apiResponse.totalNutrients?.FIBTG?.quantity || 0,\n  sugar: apiResponse.totalNutrients?.SUGAR?.quantity || 0,\n  sodium: apiResponse.totalNutrients?.NA?.quantity || 0,\n  cholesterol: apiResponse.totalNutrients?.CHOLE?.quantity || 0\n};\n\n// 按份数计算\nconst perServing = {\n  calories: Math.round(nutrition.calories / servings),\n  protein: Math.round((nutrition.protein / servings) * 10) / 10,\n  carbs: Math.round((nutrition.carbs / servings) * 10) / 10,\n  fat: Math.round((nutrition.fat / servings) * 10) / 10\n};\n\nreturn {\n  json: {\n    success: true,\n    nutrition: nutrition,\n    perServing: perServing\n  }\n};"
      },
      "name": "格式化响应",
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [900, 300]
    },
    {
      "parameters": {},
      "name": "成功响应",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [1120, 300],
      "webhookId": "={{ $node['Webhook'].webhookId }}"
    }
  ],
  "connections": {
    "Webhook": {
      "main": [
        [
          {
            "node": "数据验证",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "数据验证": {
      "main": [
        [
          {
            "node": "营养成分API",
            "type": "main", 
            "index": 0
          }
        ]
      ]
    },
    "营养成分API": {
      "main": [
        [
          {
            "node": "格式化响应",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "格式化响应": {
      "main": [
        [
          {
            "node": "成功响应",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "settings": {},
  "staticData": null,
  "triggerCount": 1
}
```

## 前端配置

在项目根目录创建或更新 `.env` 文件：

```env
# n8n营养计算器工作流URL
VITE_N8N_NUTRITION_URL=http://localhost:5678/webhook/nutrition-calculator

# 备用营养API（可选）
VITE_FALLBACK_NUTRITION_API=https://api.edamam.com/api/nutrition-data
```

## 测试工作流

### 使用curl测试
```bash
curl -X POST http://localhost:5678/webhook/nutrition-calculator \
  -H "Content-Type: application/json" \
  -d '{
    "ingredients": [
      {"name": "猪肉", "amount": 200, "unit": "g"},
      {"name": "白菜", "amount": 300, "unit": "g"},
      {"name": "盐", "amount": 5, "unit": "g"}
    ],
    "servings": 2,
    "userId": "test-user"
  }'
```

### 使用Postman测试
1. 方法: POST
2. URL: `http://localhost:5678/webhook/nutrition-calculator`
3. Headers: `Content-Type: application/json`
4. Body: 使用上面的JSON数据

## 监控和日志

### 建议的监控指标
- 请求成功率
- 营养成分API响应时间
- 错误率
- 用户使用频率

### 日志记录
- 请求/响应日志
- API调用日志
- 营养计算错误日志

## 安全考虑

1. **API密钥安全**: 使用环境变量存储敏感信息
2. **请求验证**: 验证请求来源和食材数据格式
3. **数据隐私**: 不记录敏感的用户饮食数据
4. **速率限制**: 防止API滥用

## 故障排除

### 常见问题
1. **Webhook不可达**: 检查防火墙和网络配置
2. **营养成分API超时**: 调整超时设置或使用备用API
3. **食材识别失败**: 检查食材名称格式
4. **单位转换错误**: 验证单位转换逻辑

### 调试技巧
1. 使用n8n的调试模式检查数据流
2. 验证每个节点的输入输出
3. 检查API响应格式
4. 测试单个食材的计算结果

## 扩展功能建议

1. **饮食建议**: 基于计算结果提供个性化饮食建议
2. **历史记录**: 保存用户的营养计算历史
3. **比较功能**: 比较不同菜品的营养成分
4. **目标跟踪**: 根据用户目标跟踪营养摄入
5. **多语言支持**: 支持国际食材和单位系统