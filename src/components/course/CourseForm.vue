<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Course, CourseCategory } from '@/types'
import { COURSE_COLORS, CATEGORY_NAMES } from '@/constants'

interface Props {
  course?: Course | null
  visible: boolean
}

const props = withDefaults(defineProps<Props>(), {
  course: null
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  submit: [data: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>]
}>()

const formRef = ref()
const formData = ref({
  name: '',
  teacher: '',
  classroom: '',
  color: COURSE_COLORS.chinese,
  category: 'main' as CourseCategory
})

const rules = {
  name: [
    { required: true, message: '请输入课程名称', trigger: 'blur' }
  ]
}

const resetForm = () => {
  formData.value = {
    name: '',
    teacher: '',
    classroom: '',
    color: COURSE_COLORS.chinese,
    category: 'main'
  }
}

watch(() => props.course, (newCourse) => {
  if (newCourse) {
    formData.value = {
      name: newCourse.name,
      teacher: newCourse.teacher,
      classroom: newCourse.classroom,
      color: newCourse.color,
      category: newCourse.category
    }
  } else {
    resetForm()
  }
}, { immediate: true })

const handleClose = () => {
  emit('update:visible', false)
  resetForm()
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    emit('submit', { ...formData.value })
    handleClose()
  } catch (error) {
    // 验证失败
  }
}

const categoryOptions = Object.entries(CATEGORY_NAMES).map(([value, label]) => ({
  label,
  value
}))
</script>

<template>
  <el-dialog
    :model-value="visible"
    :title="course ? '编辑课程' : '添加课程'"
    width="500px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="课程名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入课程名称" />
      </el-form-item>
      
      <el-form-item label="授课教师">
        <el-input v-model="formData.teacher" placeholder="请输入授课教师" />
      </el-form-item>
      
      <el-form-item label="教室">
        <el-input v-model="formData.classroom" placeholder="请输入教室" />
      </el-form-item>
      
      <el-form-item label="课程分类">
        <el-select v-model="formData.category" placeholder="请选择课程分类">
          <el-option
            v-for="option in categoryOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="课程颜色">
        <div class="color-picker-wrapper">
          <input 
            type="color" 
            v-model="formData.color" 
            class="color-input"
          />
          <span class="color-value">{{ formData.color }}</span>
        </div>
      </el-form-item>
    </el-form>
    
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.color-picker-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-input {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 0;
}

.color-value {
  color: var(--text-secondary);
  font-size: 14px;
}
</style>
