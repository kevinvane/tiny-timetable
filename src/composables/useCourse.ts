import { computed } from 'vue'
import { useCourseStore } from '@/stores'
import type { Course, CourseCategory } from '@/types'

export const useCourse = () => {
  const courseStore = useCourseStore()

  const allCourses = computed(() => courseStore.courseList)

  const getCoursesByCategory = (category: CourseCategory) => {
    return courseStore.getCoursesByCategory(category)
  }

  const getCourseById = (id: string) => {
    return courseStore.getCourseById(id)
  }

  const addCourse = (courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => {
    return courseStore.addCourse(courseData)
  }

  const updateCourse = (id: string, courseData: Partial<Course>) => {
    return courseStore.updateCourse(id, courseData)
  }

  const deleteCourse = (id: string) => {
    return courseStore.deleteCourse(id)
  }

  return {
    allCourses,
    getCoursesByCategory,
    getCourseById,
    addCourse,
    updateCourse,
    deleteCourse
  }
}
