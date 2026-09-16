<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useSchedule } from '@/composables'
import { DAY_NAMES } from '@/constants'
import ScheduleGrid from '@/components/schedule/ScheduleGrid.vue'
import type { DayOfWeek, ViewType } from '@/types'

const route = useRoute()
const router = useRouter()

const { 
  currentView, 
  currentDay, 
  setView, 
  setDay
} = useSchedule()

const initView = () => {
  const viewParam = route.params.view as string
  if (viewParam === 'day') {
    setView('day')
  } else if (viewParam === 'week') {
    setView('week')
  }
}

initView()

const handleViewChange = (view: ViewType) => {
  setView(view)
  router.replace(`/schedule/${view}`)
}

const handleDayChange = (day: DayOfWeek) => {
  setDay(day)
}

const handlePrint = () => {
  window.print()
}
</script>

<template>
  <div class="schedule-page">
    <!-- 页面头部 -->
    <div class="page-header no-print">
      <h1>课程表</h1>
      
      <div class="header-actions">
        <el-button @click="handlePrint">
          <el-icon><Printer /></el-icon>
          打印课程表
        </el-button>
        <el-button-group>
          <el-button 
            :type="currentView === 'week' ? 'primary' : ''"
            @click="handleViewChange('week')"
          >
            <el-icon><Grid /></el-icon>
            周视图
          </el-button>
          <el-button 
            :type="currentView === 'day' ? 'primary' : ''"
            @click="handleViewChange('day')"
          >
            <el-icon><Calendar /></el-icon>
            日视图
          </el-button>
        </el-button-group>
      </div>
    </div>

    <!-- 打印标题 -->
    <div class="print-title print-only">
      <h1>小学生课程表</h1>
    </div>

    <!-- 日视图时的日期选择 -->
    <div v-if="currentView === 'day'" class="day-selector no-print">
      <el-button 
        v-for="day in 5" 
        :key="day"
        :type="currentDay === day ? 'primary' : ''"
        @click="handleDayChange(day as DayOfWeek)"
      >
        {{ DAY_NAMES[day - 1] }}
      </el-button>
    </div>

    <!-- 课程表网格 -->
    <ScheduleGrid />
  </div>
</template>

<style scoped>
.schedule-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h1 {
  font-size: 24px;
  color: var(--text-primary);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.day-selector {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.print-title {
  display: none;
}

@media print {
  .no-print {
    display: none !important;
  }

  .print-only {
    display: block !important;
    text-align: center;
    margin-bottom: 20px;
  }

  .print-title h1 {
    font-size: 22px;
    margin: 0;
  }
}
</style>
