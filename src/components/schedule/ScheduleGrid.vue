<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSchedule } from '@/composables'
import { useScheduleStore, useCourseStore } from '@/stores'
import { DAY_NAMES, DEFAULT_TIME_SLOTS } from '@/constants'
import CourseCard from '@/components/course/CourseCard.vue'
import type { DayOfWeek, ScheduleItem } from '@/types'
import { ElMessage } from 'element-plus'

const { 
  currentView, 
  currentDay, 
  isToday, 
  getDaySchedule,
  setDay,
  setView
} = useSchedule()

const scheduleStore = useScheduleStore()
const courseStore = useCourseStore()

// 添加课程弹窗
const showAddDialog = ref(false)
const addForm = ref<{ courseId: string }>({ courseId: '' })
const addingSlot = ref<{ day: DayOfWeek; timeSlotIndex: number } | null>(null)

// 只显示上课时间段
const classTimeSlots = computed(() => {
  return DEFAULT_TIME_SLOTS.filter(slot => slot.type === 'class')
})

// 获取某天某时间段的课程（按 startTime 匹配）
const getCourseAtSlot = (day: DayOfWeek, slotIndex: number) => {
  const daySchedule = getDaySchedule(day)
  const slot = classTimeSlots.value[slotIndex]
  return daySchedule.find(item => item.startTime === slot.startTime)
}

// 打开添加课程弹窗
const addCourseToSlot = (day: DayOfWeek, slotIndex: number) => {
  addingSlot.value = { day, timeSlotIndex: slotIndex }
  addForm.value.courseId = ''
  showAddDialog.value = true
}

// 确认添加课程
const confirmAddCourse = () => {
  if (!addingSlot.value || !addForm.value.courseId) {
    ElMessage.warning('请选择一门课程')
    return
  }

  const slot = classTimeSlots.value[addingSlot.value.timeSlotIndex]
  
  // 检查是否已有课程
  const existing = getCourseAtSlot(addingSlot.value.day, addingSlot.value.timeSlotIndex)
  if (existing) {
    ElMessage.warning('该时间段已有课程')
    showAddDialog.value = false
    return
  }

  scheduleStore.addScheduleItem({
    courseId: addForm.value.courseId,
    dayOfWeek: addingSlot.value.day,
    startTime: slot.startTime,
    endTime: slot.endTime,
    isRecurring: true
  })

  showAddDialog.value = false
  ElMessage.success('添加成功')
}

// 删除课程
const handleDeleteScheduleItem = (item: ScheduleItem) => {
  scheduleStore.deleteScheduleItem(item.id)
  ElMessage.success('已移除')
}
</script>

<template>
  <div class="schedule-grid">
    <!-- 周视图 -->
    <div v-if="currentView === 'week'" class="week-view">
      <div class="header-row">
        <div class="time-column">时间</div>
        <div 
          v-for="day in 5" 
          :key="day"
          class="day-column"
          :class="{ 'is-today': isToday(day as DayOfWeek) }"
          @click="setDay(day as DayOfWeek); setView('day')"
        >
          {{ DAY_NAMES[day - 1] }}
        </div>
      </div>
      
      <div 
        v-for="(slot, slotIndex) in classTimeSlots" 
        :key="slot.id"
        class="schedule-row"
      >
        <div class="time-column">
          <div class="slot-name">{{ slot.name }}</div>
          <div class="slot-time">{{ slot.startTime }}-{{ slot.endTime }}</div>
        </div>
        
        <div 
          v-for="day in 5" 
          :key="`${day}-${slot.id}`"
          class="day-column"
          :class="{ 'is-today': isToday(day as DayOfWeek) }"
        >
          <div 
            v-if="getCourseAtSlot(day as DayOfWeek, slotIndex)"
            class="course-slot"
          >
            <CourseCard 
              :course="getCourseAtSlot(day as DayOfWeek, slotIndex)!.course!"
              :schedule-item="getCourseAtSlot(day as DayOfWeek, slotIndex)"
            />
            <el-button 
              class="delete-btn" 
              size="small" 
              circle 
              type="danger"
              @click.stop="handleDeleteScheduleItem(getCourseAtSlot(day as DayOfWeek, slotIndex)!)"
            >
              <el-icon><Close /></el-icon>
            </el-button>
          </div>
          <div 
            v-else 
            class="empty-slot"
            @click="addCourseToSlot(day as DayOfWeek, slotIndex)"
          >
            <el-icon><Plus /></el-icon>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 日视图 -->
    <div v-else class="day-view">
      <div class="day-header">
        {{ DAY_NAMES[currentDay - 1] }}
      </div>
      
      <div class="day-schedule">
        <div 
          v-for="(slot, slotIndex) in classTimeSlots" 
          :key="slot.id"
          class="time-slot"
        >
          <div class="slot-info">
            <div class="slot-name">{{ slot.name }}</div>
            <div class="slot-time">{{ slot.startTime }}-{{ slot.endTime }}</div>
          </div>
          
          <div class="slot-content">
            <div 
              v-if="getCourseAtSlot(currentDay, slotIndex)"
              class="course-slot"
            >
              <CourseCard 
                :course="getCourseAtSlot(currentDay, slotIndex)!.course!"
                :schedule-item="getCourseAtSlot(currentDay, slotIndex)"
              />
              <el-button 
                class="delete-btn" 
                size="small" 
                circle 
                type="danger"
                @click.stop="handleDeleteScheduleItem(getCourseAtSlot(currentDay, slotIndex)!)"
              >
                <el-icon><Close /></el-icon>
              </el-button>
            </div>
            <div 
              v-else 
              class="empty-slot"
              @click="addCourseToSlot(currentDay, slotIndex)"
            >
              <el-icon><Plus /></el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加课程弹窗 -->
    <el-dialog
      v-model="showAddDialog"
      title="添加课程到课程表"
      width="400px"
    >
      <el-form label-width="80px">
        <el-form-item label="选择课程">
          <el-select v-model="addForm.courseId" placeholder="请选择课程" style="width: 100%">
            <el-option
              v-for="course in courseStore.courseList"
              :key="course.id"
              :label="course.name"
              :value="course.id"
            >
              <div style="display: flex; align-items: center; gap: 8px;">
                <span 
                  style="width: 12px; height: 12px; border-radius: 2px; display: inline-block;"
                  :style="{ backgroundColor: course.color }"
                ></span>
                {{ course.name }}
              </div>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmAddCourse">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.schedule-grid {
  background: var(--bg-primary);
  border-radius: 8px;
  overflow: hidden;
}

.week-view {
  display: flex;
  flex-direction: column;
}

.header-row {
  display: flex;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.header-row .day-column {
  flex: 1;
  padding: 12px;
  text-align: center;
  font-weight: bold;
  color: var(--text-primary);
  cursor: pointer;
}

.header-row .day-column.is-today {
  background: var(--primary-color);
  color: white;
}

.time-column {
  width: 100px;
  padding: 12px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
}

.schedule-row {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  min-height: 80px;
}

.schedule-row .day-column {
  flex: 1;
  padding: 8px;
  border-right: 1px solid var(--border-color);
}

.schedule-row .day-column.is-today {
  background: rgba(64, 158, 255, 0.05);
}

.slot-name {
  font-size: 14px;
  font-weight: bold;
  color: var(--text-primary);
}

.slot-time {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.course-slot {
  height: 100%;
  position: relative;
}

.delete-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.course-slot:hover .delete-btn {
  opacity: 1;
}

.empty-slot {
  height: 100%;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s;
}

.empty-slot:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.day-view {
  padding: 20px;
}

.day-header {
  font-size: 24px;
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 20px;
}

.day-schedule {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.time-slot {
  display: flex;
  gap: 16px;
}

.slot-info {
  width: 120px;
  text-align: right;
}

.slot-content {
  flex: 1;
}
</style>
