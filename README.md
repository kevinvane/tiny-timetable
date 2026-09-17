<h1 align="center">📚 小学生课程表</h1>

<p align="center">
  一个为小学生设计的课程表管理 Web 应用
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.5+-42b883?style=flat-square&logo=vue.js" alt="Vue">
  <img src="https://img.shields.io/badge/Vite-8+-646CFF?style=flat-square&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/TypeScript-6.0+-3178C6?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Element_Plus-2.x-409EFF?style=flat-square" alt="Element Plus">
  <img src="https://img.shields.io/badge/License-Apache_2.0-blue?style=flat-square" alt="Apache License 2.0">
</p>

---

## ✨ 功能特性

### 📅 课程表管理
- **周视图 / 日视图** — 灵活切换查看一周或单日课程
- **一键添加课程** — 点击空格位即可选择课程添加到课表
- **打印支持** — 一键打印课程表，自动适配打印样式

### 🎨 多主题支持
- **6 套预设主题** — 珊瑚橙、海洋蓝、森林绿、薰衣紫、樱花粉、阳光橙
- **深色模式** — 每套主题均适配深色模式
- **实时切换** — 主题切换即时生效，无需刷新

### ⚙️ 个性化设置
- **自定义标题** — 修改应用名称，如「三年二班课程表」
- **课程时间管理** — 自定义每节课的开始/结束时间
- **字体大小** — 支持小 / 中 / 大三种字体

### 📋 课程管理
- **课程 CRUD** — 添加、编辑、删除课程
- **课程分类** — 主科、副科、兴趣班、活动
- **彩色标签** — 每门课程独立配色，直观区分

### 🗂️ 数据持久化
- 所有数据自动存储在浏览器 localStorage，刷新不丢失

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | [Vue 3](https://vuejs.org/) (Composition API + `<script setup>`) |
| 构建 | [Vite](https://vitejs.dev/) |
| 语言 | [TypeScript](https://www.typescriptlang.org/) |
| 状态管理 | [Pinia](https://pinia.vuejs.org/) |
| 路由 | [Vue Router 4](https://router.vuejs.org/) |
| UI 组件库 | [Element Plus](https://element-plus.org/) |
| 图标 | [@element-plus/icons-vue](https://github.com/element-plus/element-plus-icons-vue) |
| 日期处理 | [Day.js](https://day.js.org/) |

## 📁 项目结构

```
src/
├── assets/styles/         # 全局样式 & 主题变量
├── components/
│   ├── course/            # 课程卡片、课程表单
│   └── schedule/          # 课程表网格
├── composables/           # 组合式函数
├── constants/             # 常量 & 预设主题
├── router/                # 路由配置
├── stores/                # Pinia 状态管理
│   ├── course.ts          # 课程数据
│   ├── schedule.ts        # 课程表数据
│   └── settings.ts        # 设置 & 主题切换
├── types/                 # TypeScript 类型定义
├── utils/                 # 工具函数 (localStorage 等)
├── views/
│   ├── Home.vue           # 首页
│   ├── Schedule.vue       # 课程表页
│   ├── CourseManage.vue   # 课程管理页
│   ├── Settings.vue       # 设置页
│   └── NotFound.vue       # 404 页面
├── App.vue                # 根组件 (侧边栏布局)
└── main.ts                # 入口文件
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装 & 运行

```bash
# 克隆仓库
git clone https://github.com/kevinvane/tiny-timetable.git
cd tiny-timetable

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

浏览器访问 http://localhost:5173

### 构建 & 部署

```bash
# 构建生产版本
npm run build

# 本地预览构建产物
npm run preview
```

构建产物输出到 `dist/` 目录，可直接部署到任意静态托管服务（Nginx、Vercel、Netlify、GitHub Pages 等）。

## 📝 开发脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | TypeScript 类型检查 + 生产构建 |
| `npm run preview` | 本地预览构建产物 |

## 🌐 浏览器兼容性

| 浏览器 | 最低版本 |
|--------|----------|
| Chrome | 87+ |
| Firefox | 78+ |
| Safari | 14+ |
| Edge | 88+ |

## 📄 License

[Apache License 2.0](LICENSE)
