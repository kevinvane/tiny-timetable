# 中国小学生课程表 Web App

一个为小学生设计的课程表管理应用，支持课程安排、时间管理、提醒功能等。

## 项目概述

本项目是一个基于 Vue3 + Vite + TypeScript 的前端应用，旨在为小学生提供一个直观、易用的课程表管理工具。应用将支持多视图展示（周视图、日视图）、课程管理、提醒功能等。

## 技术栈

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **编程语言**: TypeScript
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **UI组件库**: Element Plus
- **样式方案**: SCSS + CSS Variables
- **日期处理**: Day.js
- **图标**: @element-plus/icons-vue

## 功能特性

### 核心功能
1. **课程表展示**
   - 周视图：显示一周七天的课程安排
   - 日视图：显示单日详细课程安排
   - 时间轴展示：显示每节课的时间

2. **课程管理**
   - 添加/编辑/删除课程
   - 课程信息：名称、教师、教室、时间、颜色标签
   - 课程分类（主科、副科、兴趣班等）

3. **时间管理**
   - 自定义上课时间
   - 支持不同作息时间表

4. **个性化设置**
   - 主题切换（浅色/深色模式）
   - 自定义课程颜色
   - 字体大小调整

## 项目结构

```
src/
├── assets/              # 静态资源
│   ├── images/
│   └── styles/
├── components/          # 公共组件
│   ├── common/          # 通用组件
│   ├── course/          # 课程相关组件
│   └── schedule/        # 课程表相关组件
├── composables/         # 组合式函数
├── constants/           # 常量定义
├── layouts/             # 布局组件
├── router/              # 路由配置
├── stores/              # Pinia 状态管理
├── types/               # TypeScript 类型定义
├── utils/               # 工具函数
├── views/               # 页面组件
│   ├── Home.vue
│   ├── Schedule.vue
│   ├── CourseManage.vue
│   └── Settings.vue
├── App.vue
└── main.ts
```

## 安装与运行

### 环境要求
- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```npm run preview
```

## 开发脚本

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview"
  }
}
```

## 浏览器兼容性

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 许可证

本项目使用 MIT 许可证。
