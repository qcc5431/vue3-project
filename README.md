# 旅行笔记

一个旅行笔记分享社交平台。

## 在线演示

暂无

## 功能介绍

用户可以在平台上创建和分享旅行笔记，支持图文和视频内容，可以关注其他旅行者、点赞收藏喜欢的内容。编辑器支持 Markdown 语法，并提供 AI 辅助写作功能。

## 技术栈

Vue 3 + TypeScript + Vite + Pinia + Vue Router + Element Plus + Axios + SCSS

## 本地运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 构建部署

```bash
# 生产环境构建
npm run build:prod

# 开发环境构建
npm run build:dev
```

## 后端接口

项目已部署后端服务，API 地址配置在 `.env.production` 中。

## 目录说明

```
src/
├── api/          # 接口请求和类型定义
├── assets/       # 静态资源
├── components/   # 公共组件
├── layout/       # 页面布局
├── router/       # 路由
├── store/        # 状态管理
├── utils/        # 工具函数
└── views/        # 页面
```

## License

MIT
