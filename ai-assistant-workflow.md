# AI助手工作流文档

## 概述

AI助手工作流为美食探索者网站的AI助手功能提供完整的开发、测试和部署自动化流程。

## 工作流文件结构

```
.github/workflows/
├── ai-assistant.yml          # AI助手CI/CD工作流

tests/
├── ai-assistant.test.ts      # AI助手单元测试

src/
├── services/aiService.ts      # AI助手服务层
├── utils/aiUtils.ts           # AI助手工具函数
```

## 工作流触发条件

### 自动触发
- **代码推送**：当 `main` 或 `develop` 分支的AI相关文件被修改时
- **Pull Request**：针对 `main` 分支的PR中包含AI相关文件时
- **定时任务**：每周一早上6点自动运行测试

### 触发文件路径
```yaml
paths:
  - 'src/views/AIAssistantView.vue'
  - 'src/services/aiService.ts'
  - 'src/utils/aiUtils.ts'
```

## 工作流任务

### 1. AI助手测试 (ai-assistant-test)
- **运行环境**：Ubuntu最新版，Node.js 18.x 和 20.x
- **测试内容**：
  - TypeScript类型检查
  - 项目构建
  - AI助手单元测试
  - AI助手集成测试
- **产物**：构建产物上传为Artifact

### 2. AI助手部署 (ai-assistant-deploy)
- **依赖**：测试任务成功
- **条件**：仅针对 `main` 分支
- **部署目标**：Netlify生产环境

### 3. AI助手监控 (ai-assistant-monitor)
- **依赖**：部署任务
- **功能**：部署状态监控和失败通知

## 环境变量配置

### Netlify部署
```bash
NETLIFY_AUTH_TOKEN=${{ secrets.NETLIFY_AUTH_TOKEN }}
NETLIFY_SITE_ID=${{ secrets.NETLIFY_SITE_ID }}
```

### AI API配置
```bash
VITE_AI_API_URL=https://api.deepseek.com
VITE_AI_API_KEY=${{ secrets.AI_API_KEY }}
```

## 测试策略

### 单元测试
- **测试框架**：Vitest
- **测试范围**：AI响应验证、推荐生成、API调用
- **Mock策略**：模拟外部API调用

### 集成测试
- **测试内容**：AI助手完整工作流程
- **数据验证**：响应格式、推荐准确性

### 性能测试
- **响应时间**：API调用超时设置30秒
- **重试机制**：最大重试3次，延迟1秒

## 错误处理策略

### API调用失败
- **降级处理**：返回本地生成的推荐
- **错误日志**：详细记录错误信息
- **用户提示**：友好的错误消息

### 构建失败
- **自动回滚**：保持上次成功构建
- **通知机制**：GitHub Issues通知

## 监控和日志

### 性能监控
- 响应时间统计
- 推荐准确率跟踪
- 用户满意度反馈

### 错误监控
- API调用失败率
- 构建失败统计
- 用户报告问题

## 安全考虑

### API密钥安全
- 使用GitHub Secrets存储敏感信息
- 不在代码中硬编码API密钥
- 定期轮换密钥

### 数据隐私
- 用户对话历史本地存储
- 不收集个人身份信息
- 符合GDPR要求

## 扩展性设计

### 多AI提供商支持
- 可配置的API端点
- 统一的响应格式
- 供应商切换机制

### 功能扩展
- 食谱推荐
- 营养分析
- 饮食计划

## 维护指南

### 定期任务
- 更新依赖包
- 检查API配额
- 优化推荐算法

### 故障排除
- 检查API连接状态
- 验证环境变量配置
- 查看工作流日志

## 版本历史

### v1.0.0 (2025-10-24)
- 初始AI助手工作流实现
- 基础测试和部署流程
- 降级处理机制

## 联系方式

如有问题或建议，请联系：
- 项目维护者：wanghao
- 技术支持：通过GitHub Issues

---
*文档最后更新：2025年10月24日*