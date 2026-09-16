<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useSettingsStore } from './stores'

const route = useRoute()
const settingsStore = useSettingsStore()

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

const toggleTheme = () => {
  settingsStore.toggleTheme()
}
</script>

<template>
  <div class="app-container" :data-theme="settingsStore.theme">
    <!-- 侧边栏导航 -->
    <aside class="sidebar">
      <div class="logo">
        <el-icon :size="24"><Calendar /></el-icon>
        <span>课程表</span>
        <el-button class="theme-toggle" @click="toggleTheme" circle>
          <el-icon>
            <Sunny v-if="settingsStore.theme === 'dark'" />
            <Moon v-else />
          </el-icon>
        </el-button>
      </div>
      
      <nav class="nav-menu">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: isActive(item.path) }"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </router-link>
      </nav>
    </aside>

    <!-- 主内容区 -->
    <main class="main-content">
      <router-view />
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
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px 20px;
  font-size: 18px;
  font-weight: bold;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
}

.theme-toggle {
  margin-left: auto;
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
}

.nav-item:hover {
  background-color: var(--bg-primary);
  color: var(--primary-color);
}

.nav-item.active {
  background-color: var(--primary-color);
  color: white;
}

.main-content {
  flex: 1;
  margin-left: 220px;
  padding: 20px;
  background-color: var(--bg-primary);
}

@media print {
  .sidebar {
    display: none !important;
  }

  .main-content {
    margin-left: 0 !important;
    padding: 0 !important;
  }
}
</style>
