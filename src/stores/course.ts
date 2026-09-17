import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Course, CourseCategory } from '@/types'
import { generateId, getStorage, setStorage } from '@/utils'
import { DEFAULT_COURSES } from '@/constants'

const STORAGE_KEY = 'schedule-courses'

export const useCourseStore = defineStore('course', () => {
  // 状态
  const courses = ref<Course[]>(getStorage<Course[]>(STORAGE_KEY, DEFAULT_COURSES))

  // 计算属性
  const courseList = computed(() => courses.value)

  const getCoursesByCategory = (category: CourseCategory) => {
    return courses.value.filter(course => course.category === category)
  }

  const getCourseById = (id: string) => {
    return courses.value.find(course => course.id === id)
  }

  // 方法
  const addCourse = (courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString()
    const newCourse: Course = {
      ...courseData,
      id: generateId(),
      createdAt: now,
      updatedAt: now
    }
    courses.value.push(newCourse)
    saveCourses()
    return newCourse
  }

  const updateCourse = (id: string, courseData: Partial<Course>) => {
    const index = courses.value.findIndex(course => course.id === id)
    if (index !== -1) {
      courses.value[index] = {
        ...courses.value[index],
        ...courseData,
        updatedAt: new Date().toISOString()
      }
      saveCourses()
      return courses.value[index]
    }
    return null
  }

  const deleteCourse = (id: string) => {
    const index = courses.value.findIndex(course => course.id === id)
    if (index !== -1) {
      courses.value.splice(index, 1)
      saveCourses()
      return true
    }
    return false
  }

  const saveCourses = () => {
    setStorage(STORAGE_KEY, courses.value)
  }

  return {
    courses,
    courseList,
    getCoursesByCategory,
    getCourseById,
    addCourse,
    updateCourse,
    deleteCourse
  }
})
