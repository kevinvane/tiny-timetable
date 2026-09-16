<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSchedule } from '@/composables'
import { useCourseStore } from '@/stores'
import CourseCard from '@/components/course/CourseCard.vue'

const router = useRouter()
const { todaySchedule, getDayName, today } = useSchedule()
const courseStore = useCourseStore()

const todayName = getDayName(today as any)

const courseCount = computed(() => courseStore.courseList.length)

const navigateToSchedule = () => {
  router.push('/schedule')
}

const navigateToCourses = () => {
  router.push('/courses')
}
</script>

<template>
  <div class="home-page">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <h1>欢迎使用小学生课程表</h1>
      <p>轻松管理你的课程安排</p>
    </div>

    <!-- 今日课程 -->
    <div class="section">
      <div class="section-header">
        <h2>{{ todayName }}课程</h2>
        <el-button type="primary" @click="navigateToSchedule">
          查看完整课程表
        </el-button>
      </div>
      
      <div v-if="todaySchedule.length > 0" class="today-courses">
        <CourseCard 
          v-for="item in todaySchedule" 
          :key="item.id"
          :course="item.course!"
          :schedule-item="item"
        />
      </div>
      
      <div v-else class="empty-state">
        <el-empty description="今天没有课程安排">
          <el-button type="primary" @click="navigateToSchedule">
            添加课程
          </el-button>
        </el-empty>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="section">
      <h2>快捷操作</h2>
      <div class="quick-actions">
        <el-card class="action-card" shadow="hover" @click="navigateToSchedule">
          <el-icon :size="40"><Calendar /></el-icon>
          <h3>课程表</h3>
          <p>查看和管理课程安排</p>
        </el-card>
        
        <el-card class="action-card" shadow="hover" @click="navigateToCourses">
          <el-icon :size="40"><Notebook /></el-icon>
          <h3>课程管理</h3>
          <p>管理课程信息</p>
        </el-card>
        
        <el-card class="action-card" shadow="hover" @click="router.push('/settings')">
          <el-icon :size="40"><Setting /></el-icon>
          <h3>设置</h3>
          <p>个性化你的课程表</p>
        </el-card>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="section">
      <h2>统计信息</h2>
      <div class="stats">
        <el-statistic title="课程总数" :value="courseCount" />
        <el-statistic title="今日课程" :value="todaySchedule.length" />
        <el-statistic title="本周课程" :value="todaySchedule.length * 5" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  text-align: center;
  padding: 40px 0;
  background: linear-gradient(135deg, var(--primary-color), #67C23A);
  border-radius: 12px;
  color: white;
  margin-bottom: 30px;
}

.welcome-section h1 {
  font-size: 32px;
  margin-bottom: 10px;
}

.welcome-section p {
  font-size: 16px;
  opacity: 0.9;
}

.section {
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section h2 {
  font-size: 20px;
  color: var(--text-primary);
  margin: 0;
}

.today-courses {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.empty-state {
  padding: 40px;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.action-card {
  cursor: pointer;
  text-align: center;
  transition: transform 0.3s;
}

.action-card:hover {
  transform: translateY(-5px);
}

.action-card .el-icon {
  color: var(--primary-color);
  margin-bottom: 12px;
}

.action-card h3 {
  font-size: 18px;
  margin: 0 0 8px 0;
  color: var(--text-primary);
}

.action-card p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.stats .el-statistic {
  padding: 20px;
  background: var(--bg-secondary);
  border-radius: 8px;
}
</style>
