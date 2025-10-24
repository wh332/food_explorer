# 美食探索者 (Food Explorer)

基于Vue 3的美食网站项目，提供八大菜系展示、家常菜教程和AI智能推荐功能。

## 功能特性

- 🍲 **八大菜系展示** - 川菜、粤菜、鲁菜、苏菜、浙菜、闽菜、湘菜、徽菜详细介绍
- 🤖 **AI美食助手** - 智能推荐符合用户口味的菜品
- 📚 **家常菜教程** - 详细的制作步骤和食材清单
- 🔍 **智能搜索** - 按菜名、食材、口味搜索
- 📱 **响应式设计** - 支持移动端和桌面端

## 技术栈

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router
- **样式**: CSS3 + Flexbox/Grid

## 项目结构

```
src/
├── components/          # 公共组件
│   └── layout/         # 布局组件
├── views/              # 页面视图
├── stores/             # 状态管理
├── router/             # 路由配置
└── main.ts             # 入口文件
```

## 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建项目
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

## 页面说明

### 首页 (/)
- 网站介绍和特色功能展示
- 热门菜品推荐
- 快速导航入口

### 八大菜系 (/cuisines)
- 八大菜系详细介绍
- 各菜系特色和代表菜品
- 按菜系筛选菜品

### 家常菜 (/dishes)
- 菜品列表和搜索功能
- 按难度、时间、菜系筛选
- 菜品详情页面入口

### AI助手 (/ai-assistant)
- 智能对话推荐菜品
- 用户口味偏好设置
- 个性化推荐结果

## 数据模型

### 菜品 (Dish)
```typescript
interface Dish {
  id: number
  name: string
  cuisine: string
  image: string
  difficulty: '简单' | '中等' | '困难'
  time: string
  ingredients: string[]
  steps: string[]
  description: string
  rating: number
}
```

### 菜系 (Cuisine)
```typescript
interface Cuisine {
  id: number
  name: string
  description: string
  characteristics: string[]
  representativeDishes: string[]
  image: string
}
```

## 开发计划

- [ ] 用户登录注册系统
- [ ] 菜品收藏功能
- [ ] 用户评论评分系统
- [ ] 购物车功能（食材购买）
- [ ] 视频教程集成
- [ ] 移动端APP开发

## 贡献指南

欢迎提交Issue和Pull Request来改进项目！

## 许可证

MIT License