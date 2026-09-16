<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCourseStore } from '@/stores'
import { useScheduleStore } from '@/stores'
import { CATEGORY_NAMES } from '@/constants'
import CourseCard from '@/components/course/CourseCard.vue'
import CourseForm from '@/components/course/CourseForm.vue'
import type { Course, CourseCategory } from '@/types'
import { ElMessage, ElMessageBox } from 'element-plus'

const courseStore = useCourseStore()
const scheduleStore = useScheduleStore()

const showForm = ref(false)
const editingCourse = ref<Course | null>(null)
const selectedCategory = ref<CourseCategory | 'all'>('all')

// 过滤后的课程列表
const filteredCourses = computed(() => {
  if (selectedCategory.value === 'all') {
    return courseStore.courseList
  }
  return courseStore.getCoursesByCategory(selectedCategory.value)
})

// 添加课程
const handleAdd = () => {
  editingCourse.value = null
  showForm.value = true
}

// 编辑课程
const handleEdit = (course: Course) => {
  editingCourse.value = course
  showForm.value = true
}

// 删除课程
const handleDelete = async (course: Course) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除课程"${course.name}"吗？相关的课程安排也将被删除。`,
      '删除确认',
      { type: 'warning' }
    )
    
    // 删除相关课程安排
    scheduleStore.deleteScheduleItemsByCourse(course.id)
    
    // 删除课程
    courseStore.deleteCourse(course.id)
    
    ElMessage.success('删除成功')
  } catch {
    // 用户取消
  }
}

// 提交表单
const handleSubmit = (data: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => {
  if (editingCourse.value) {
    courseStore.updateCourse(editingCourse.value.id, data)
    ElMessage.success('更新成功')
  } else {
    courseStore.addCourse(data)
    ElMessage.success('添加成功')
  }
  showForm.value = false
}

// 分类选项
const categoryOptions = [
  { label: '全部', value: 'all' },
  ...Object.entries(CATEGORY_NAMES).map(([value, label]) => ({ label, value }))
]
</script>

<template>
  <div class="course-manage-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1>课程管理</h1>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        添加课程
      </el-button>
    </div>

    <!-- 分类筛选 -->
    <div class="filter-section">
      <el-radio-group v-model="selectedCategory">
        <el-radio-button 
          v-for="option in categoryOptions" 
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </el-radio-button>
      </el-radio-group>
    </div>

    <!-- 课程列表 -->
    <div v-if="filteredCourses.length > 0" class="course-list">
      <CourseCard 
        v-for="course in filteredCourses" 
        :key="course.id"
        :course="course"
        :show-actions="true"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>
    
    <div v-else class="empty-state">
      <el-empty description="暂无课程">
        <el-button type="primary" @click="handleAdd">
          添加课程
        </el-button>
      </el-empty>
    </div>

    <!-- 课程表单 -->
    <CourseForm 
      v-model:visible="showForm"
      :course="editingCourse"
      @submit="handleSubmit"
    />
  </div>
</template>

<style scoped>
.course-manage-page {
  max-width: 800px;
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

.filter-section {
  margin-bottom: 20px;
}

.course-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.empty-state {
  padding: 60px;
  background: var(--bg-secondary);
  border-radius: 8px;
}
</style>
