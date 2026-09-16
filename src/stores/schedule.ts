import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ScheduleItem, ViewType, DayOfWeek } from '@/types'
import { generateId, getStorage, setStorage, getCurrentDayOfWeek } from '@/utils'

const STORAGE_KEY = 'schedule-items'

export const useScheduleStore = defineStore('schedule', () => {
  const scheduleItems = ref<ScheduleItem[]>(getStorage<ScheduleItem[]>(STORAGE_KEY, []))
  const currentView = ref<ViewType>('week')
  const currentDay = ref<DayOfWeek>(getCurrentDayOfWeek() as DayOfWeek)

  const items = computed(() => scheduleItems.value)

  const getItemsByDay = (day: DayOfWeek) => {
    return scheduleItems.value
      .filter(item => item.dayOfWeek === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  const getItemsByCourse = (courseId: string) => {
    return scheduleItems.value.filter(item => item.courseId === courseId)
  }

  const addScheduleItem = (itemData: Omit<ScheduleItem, 'id'>) => {
    const newItem: ScheduleItem = {
      ...itemData,
      id: generateId()
    }
    scheduleItems.value.push(newItem)
    saveScheduleItems()
    return newItem
  }

  const updateScheduleItem = (id: string, itemData: Partial<ScheduleItem>) => {
    const index = scheduleItems.value.findIndex(item => item.id === id)
    if (index !== -1) {
      scheduleItems.value[index] = {
        ...scheduleItems.value[index],
        ...itemData
      }
      saveScheduleItems()
      return scheduleItems.value[index]
    }
    return null
  }

  const deleteScheduleItem = (id: string) => {
    const index = scheduleItems.value.findIndex(item => item.id === id)
    if (index !== -1) {
      scheduleItems.value.splice(index, 1)
      saveScheduleItems()
      return true
    }
    return false
  }

  const deleteScheduleItemsByCourse = (courseId: string) => {
    scheduleItems.value = scheduleItems.value.filter(item => item.courseId !== courseId)
    saveScheduleItems()
  }

  const setView = (view: ViewType) => {
    currentView.value = view
  }

  const setDay = (day: DayOfWeek) => {
    currentDay.value = day
  }

  const saveScheduleItems = () => {
    setStorage(STORAGE_KEY, scheduleItems.value)
  }

  return {
    scheduleItems,
    currentView,
    currentDay,
    items,
    getItemsByDay,
    getItemsByCourse,
    addScheduleItem,
    updateScheduleItem,
    deleteScheduleItem,
    deleteScheduleItemsByCourse,
    setView,
    setDay,
    saveScheduleItems
  }
})
