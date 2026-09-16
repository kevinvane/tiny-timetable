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
  settingsStore.toggleTheme()
}
</script>

<template>
  <div class="app-container" :data-theme="settingsStore.theme">
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
              <Sunny v-if="settingsStore.theme === 'dark'" />
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
