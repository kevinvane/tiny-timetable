<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useSettingsStore } from './stores'

const route = useRoute()
const settingsStore = useSettingsStore()
const collapsed = ref(false)

const menuItems = [
  { path: '/', label: '首页', icon: 'HomeFilled' },
  { path: '/schedule', label: '课程表', icon: 'Calendar' },
  { path: '/courses', label: '课程管理', icon: 'Notebook' },
  { path: '/settings', label: '设置', icon: 'Setting' }
]

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const toggleCollapse = () => {
  collapsed.value = !collapsed.value
}

const toggleTheme = () => {
  settingsStore.toggleDark()
}
</script>

<template>
  <div class="app-container">
    <!-- 侧边栏导航 -->
    <aside class="sidebar" :class="{ collapsed }">
      <div class="logo">
        <!-- <el-icon :size="24"><Calendar /></el-icon> -->
        <span v-if="!collapsed" class="logo-text">{{ settingsStore.title }}</span>
        <div class="logo-actions">
          <el-button class="collapse-btn" @click="toggleCollapse" circle>
            <el-icon>
              <Fold v-if="!collapsed" />
              <Expand v-else />
            </el-icon>
          </el-button>
          <el-button class="theme-toggle" @click="toggleTheme" circle>
            <el-icon>
              <Sunny v-if="settingsStore.isDark" />
              <Moon v-else />
            </el-icon>
          </el-button>
        </div>
      </div>
      
      <nav class="nav-menu">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: isActive(item.path) }"
        >
          <el-icon :size="20"><component :is="item.icon" /></el-icon>
          <span v-if="!collapsed" class="nav-label">{{ item.label }}</span>
        </router-link>
      </nav>
    </aside>

    <!-- 主内容区 -->
    <main class="main-content" :class="{ collapsed }">
      <div class="page-actions">
        <a
          class="github-link"
          href="https://github.com/kevinvane/tiny-timetable"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="访问本项目的 GitHub 仓库（在新标签页打开）"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M12 .297C5.37.297 0 5.67 0 12.297c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.043-1.61-4.043-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.838 1.237 1.838 1.237 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.5 11.5 0 0 1 3-.404c1.02.005 2.045.138 3 .404 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          <span>GitHub</span>
        </a>
      </div>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 220px;
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  position: fixed;
  height: 100vh;
  transition: width 0.3s ease;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 64px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px 20px;
  font-size: 18px;
  font-weight: bold;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
  justify-content: space-between;
}

.logo-text {
  white-space: nowrap;
  overflow: hidden;
}

.logo-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.nav-menu {
  flex: 1;
  padding: 20px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.3s;
  white-space: nowrap;
}

.sidebar.collapsed .nav-item {
  justify-content: center;
  padding: 12px 0;
}

.nav-item:hover {
  background-color: var(--bg-primary);
  color: var(--primary-color);
}

.nav-item.active {
  background-color: var(--primary-color);
  color: white;
}

.nav-label {
  overflow: hidden;
}

.main-content {
  flex: 1;
  margin-left: 220px;
  padding: 20px;
  background-color: var(--bg-primary);
  transition: margin-left 0.3s ease;
}

.main-content.collapsed {
  margin-left: 64px;
}

.page-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.github-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s, border-color 0.2s;
}

.github-link:hover {
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.github-link:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

@media print {
  .sidebar,
  .page-actions {
    display: none !important;
  }

  .main-content {
    margin-left: 0 !important;
    padding: 0 !important;
  }
}
</style>
