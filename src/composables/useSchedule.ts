import { computed } from 'vue'
import { useScheduleStore } from '@/stores'
import { useCourseStore } from '@/stores'
import { getCurrentDayOfWeek } from '@/utils'
import { DAY_NAMES } from '@/constants'
import type { DayOfWeek } from '@/types'

export const useSchedule = () => {
  const scheduleStore = useScheduleStore()
  const courseStore = useCourseStore()

  const today = getCurrentDayOfWeek()

  // 获取某天的课程（包含课程详情）
  const getDaySchedule = (day: DayOfWeek) => {
    const items = scheduleStore.getItemsByDay(day)
    return items.map(item => {
      const course = courseStore.getCourseById(item.courseId)
      return {
        ...item,
        course
      }
    })
  }

  // 获取今天的课程
  const todaySchedule = computed(() => {
    return getDaySchedule(today as DayOfWeek)
  })

  // 获取星期名称
  const getDayName = (day: DayOfWeek) => DAY_NAMES[day - 1]

  // 判断是否是今天
  const isToday = (day: DayOfWeek) => day === today

  // 切换视图
  const setView = (view: 'week' | 'day') => {
    scheduleStore.setView(view)
  }

  // 切换日期
  const setDay = (day: DayOfWeek) => {
    scheduleStore.setDay(day)
  }

  return {
    today,
    currentView: computed(() => scheduleStore.currentView),
    currentDay: computed(() => scheduleStore.currentDay),
    todaySchedule,
    getDayName,
    isToday,
    getDaySchedule,
    setView,
    setDay
  }
}
