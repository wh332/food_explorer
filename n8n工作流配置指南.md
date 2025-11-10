# n8n工作流配置指南

## 概述
本文档指导如何配置n8n工作流来接收菜谱生成请求并返回AI生成的菜谱。

## 工作流设计

### 1. Webhook触发器
- **节点类型**: Webhook
- **配置**:
  - **HTTP Method**: POST
  - **Path**: `/webhook/recipe-generator`
  - **Response Mode**: "Respond to Webhook"

### 2. 请求数据验证
- **节点类型**: Function
- **功能**: 验证请求数据格式
- **输入数据格式**:
```json
{
  "ingredients": ["猪肉", "白菜", "土豆"],
  "cuisine": "川菜",
  "difficulty": "简单",
  "userId": "user-123",
  "timestamp": "2024-01-01T10:00:00Z",
  "source": "food-explorer-web"
}
```

### 3. AI菜谱生成
- **节点类型**: OpenAI/ChatGPT 或 其他AI服务
- **配置**:
  - **模型**: GPT-4 或 GPT-3.5-turbo
  - **提示词模板**:
```
根据以下信息生成一个菜谱：

食材：{ingredients}
菜系：{cuisine}
难度：{difficulty}

请生成包含以下内容的菜谱：
1. 菜名
2. 所需食材及用量
3. 详细制作步骤
4. 烹饪时间
5. 小贴士
6. 营养信息（可选）

要求：
- 菜名要吸引人
- 步骤要详细易懂
- 用量要具体
- 适合家庭制作
```

### 4. 响应格式化
- **节点类型**: Function
- **功能**: 格式化AI响应为标准JSON格式
- **输出格式**:
```json
{
  "success": true,
  "recipe": {
    "name": "川味猪肉白菜炖土豆",
    "cuisine": "川菜",
    "difficulty": "简单",
    "cookingTime": "30分钟",
    "ingredients": [
      "猪肉 200g",
      "白菜 300g", 
      "土豆 2个",
      "干辣椒 5个",
      "花椒 1小勺",
      "生抽 2勺",
      "料酒 1勺"
    ],
    "steps": [
      "猪肉切块，用生抽、料酒腌制10分钟",
      "白菜切块，土豆去皮切块",
      "热锅凉油，下花椒、干辣椒爆香",
      "放入猪肉翻炒至变色",
      "加入白菜、土豆和适量水",
      "炖煮20分钟至食材软烂",
      "调味后即可出锅"
    ],
    "tips": "可根据个人口味调整辣度",
    "nutritionInfo": {
      "calories": 350,
      "protein": 25,
      "carbs": 30,
      "fat": 15
    }
  }
}
```

### 5. 错误处理
- **节点类型**: Function
- **功能**: 处理AI服务不可用或请求超时的情况
- **备用响应**:
```json
{
  "success": false,
  "error": "AI服务暂时不可用，请稍后重试"
}
```

## 环境变量配置

在n8n中配置以下环境变量：

```env
# OpenAI配置
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4

# 工作流配置
WEBHOOK_PATH=/webhook/recipe-generator
REQUEST_TIMEOUT=30000
```

## 部署说明

### 本地部署
1. 安装n8n: `npm install -g n8n`
2. 启动n8n: `n8n`
3. 访问: http://localhost:5678

### 云部署
1. 部署到n8n.cloud
2. 或部署到VPS/Docker
3. 配置域名和SSL证书

### 反向代理配置（可选）
```nginx
location /webhook/recipe-generator {
    proxy_pass http://localhost:5678;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

## 前端配置

在项目根目录创建 `.env` 文件：

```env
# n8n工作流URL
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/recipe-generator

# 备用API（可选）
VITE_FALLBACK_API_URL=https://api.example.com/recipes/generate
```

## 测试工作流

### 使用curl测试
```bash
curl -X POST http://localhost:5678/webhook/recipe-generator \
  -H "Content-Type: application/json" \
  -d '{
    "ingredients": ["猪肉", "白菜", "土豆"],
    "cuisine": "川菜",
    "difficulty": "简单",
    "userId": "test-user"
  }'
```

### 使用Postman测试
1. 方法: POST
2. URL: `http://localhost:5678/webhook/recipe-generator`
3. Headers: `Content-Type: application/json`
4. Body: 使用上面的JSON数据

## 监控和日志

### 建议的监控指标
- 请求成功率
- 响应时间
- AI服务可用性
- 错误率

### 日志记录
- 请求/响应日志
- AI服务调用日志
- 错误日志

## 安全考虑

1. **API密钥安全**: 使用环境变量存储敏感信息
2. **请求验证**: 验证请求来源和格式
3. **速率限制**: 防止API滥用
4. **错误处理**: 不泄露敏感信息

## 故障排除

### 常见问题
1. **Webhook不可达**: 检查防火墙和网络配置
2. **AI服务超时**: 调整超时设置或使用备用方案
3. **响应格式错误**: 检查响应格式化函数
4. **认证失败**: 验证API密钥配置

### 调试技巧
1. 使用n8n的调试模式
2. 检查节点执行日志
3. 验证数据流经每个节点
4. 测试单个节点的输入输出