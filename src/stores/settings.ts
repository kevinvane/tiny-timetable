import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Settings, TimeSlot, Reminder } from '@/types'
import { getStorage, setStorage } from '@/utils'
import { DEFAULT_TIME_SLOTS } from '@/constants'

const STORAGE_KEY = 'schedule-settings'

const defaultSettings: Settings = {
  theme: 'light',
  fontSize: 'medium',
  reminders: [],
  timeSlots: DEFAULT_TIME_SLOTS
}

export const useSettingsStore = defineStore('settings', () => {
  // 状态
  const settings = ref<Settings>(getStorage<Settings>(STORAGE_KEY, defaultSettings))

  // 计算属性
  const theme = computed(() => settings.value.theme)
  const fontSize = computed(() => settings.value.fontSize)
  const timeSlots = computed(() => settings.value.timeSlots)
  const reminders = computed(() => settings.value.reminders)

  // 主题相关
  const setTheme = (theme: 'light' | 'dark') => {
    settings.value.theme = theme
    applyTheme(theme)
    saveSettings()
  }

  const toggleTheme = () => {
    const newTheme = settings.value.theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  const applyTheme = (theme: 'light' | 'dark') => {
    document.documentElement.setAttribute('data-theme', theme)
  }

  // 字体大小
  const setFontSize = (size: 'small' | 'medium' | 'large') => {
    settings.value.fontSize = size
    applyFontSize(size)
    saveSettings()
  }

  const applyFontSize = (size: 'small' | 'medium' | 'large') => {
    const sizeMap = { small: '12px', medium: '14px', large: '16px' }
    document.documentElement.style.fontSize = sizeMap[size]
  }

  // 时间段管理
  const addTimeSlot = (slot: Omit<TimeSlot, 'id'>) => {
    const newSlot: TimeSlot = {
      ...slot,
      id: Date.now().toString()
    }
    settings.value.timeSlots.push(newSlot)
    saveSettings()
    return newSlot
  }

  const updateTimeSlot = (id: string, slotData: Partial<TimeSlot>) => {
    const index = settings.value.timeSlots.findIndex(slot => slot.id === id)
    if (index !== -1) {
      settings.value.timeSlots[index] = {
        ...settings.value.timeSlots[index],
        ...slotData
      }
      saveSettings()
      return settings.value.timeSlots[index]
    }
    return null
  }

  const deleteTimeSlot = (id: string) => {
    const index = settings.value.timeSlots.findIndex(slot => slot.id === id)
    if (index !== -1) {
      settings.value.timeSlots.splice(index, 1)
      saveSettings()
      return true
    }
    return false
  }

  // 提醒管理
  const addReminder = (reminder: Omit<Reminder, 'id'>) => {
    const newReminder: Reminder = {
      ...reminder,
      id: Date.now().toString()
    }
    settings.value.reminders.push(newReminder)
    saveSettings()
    return newReminder
  }

  const updateReminder = (id: string, reminderData: Partial<Reminder>) => {
    const index = settings.value.reminders.findIndex(r => r.id === id)
    if (index !== -1) {
      settings.value.reminders[index] = {
        ...settings.value.reminders[index],
        ...reminderData
      }
      saveSettings()
      return settings.value.reminders[index]
    }
    return null
  }

  const deleteReminder = (id: string) => {
    const index = settings.value.reminders.findIndex(r => r.id === id)
    if (index !== -1) {
      settings.value.reminders.splice(index, 1)
      saveSettings()
      return true
    }
    return false
  }

  // 初始化
  const initSettings = () => {
    applyTheme(settings.value.theme)
    applyFontSize(settings.value.fontSize)
  }

  const saveSettings = () => {
    setStorage(STORAGE_KEY, settings.value)
  }

  return {
    settings,
    theme,
    fontSize,
    timeSlots,
    reminders,
    setTheme,
    toggleTheme,
    setFontSize,
    addTimeSlot,
    updateTimeSlot,
    deleteTimeSlot,
    addReminder,
    updateReminder,
    deleteReminder,
    initSettings,
    saveSettings
  }
})
