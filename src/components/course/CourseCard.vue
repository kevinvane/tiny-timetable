<script setup lang="ts">
import type { Course, ScheduleItem } from '@/types'

interface Props {
  course: Course
  scheduleItem?: ScheduleItem
  showActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showActions: false
})

const emit = defineEmits<{
  edit: [course: Course]
  delete: [course: Course]
}>()
</script>

<template>
  <div 
    class="course-card"
    :style="{ backgroundColor: course.color + '20', borderColor: course.color }"
  >
    <div class="course-header">
      <span class="course-name">{{ course.name }}</span>
      <div v-if="showActions" class="course-actions">
        <el-button size="small" circle @click="emit('edit', course)">
          <el-icon><Edit /></el-icon>
        </el-button>
        <el-button size="small" circle type="danger" @click="emit('delete', course)">
          <el-icon><Delete /></el-icon>
        </el-button>
      </div>
    </div>
    
    <div v-if="scheduleItem" class="course-time">
      {{ scheduleItem.startTime }} - {{ scheduleItem.endTime }}
    </div>
    
    <div v-if="course.teacher" class="course-teacher">
      <el-icon><User /></el-icon>
      {{ course.teacher }}
    </div>
    
    <div v-if="course.classroom" class="course-classroom">
      <el-icon><Location /></el-icon>
      {{ course.classroom }}
    </div>
  </div>
</template>

<style scoped>
.course-card {
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid;
  margin-bottom: 8px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.course-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.course-name {
  font-weight: bold;
  font-size: 16px;
  color: var(--text-primary);
}

.course-actions {
  display: flex;
  gap: 4px;
}

.course-time {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.course-teacher,
.course-classroom {
  font-size: 12px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}
</style>
