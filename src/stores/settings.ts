import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Settings, TimeSlot, Reminder } from '@/types'
import { getStorage, setStorage } from '@/utils'
import { DEFAULT_TIME_SLOTS } from '@/constants'
import { THEMES, DARK_OVERRIDES } from '@/constants/themes'

const STORAGE_KEY = 'schedule-settings'

const defaultSettings: Settings = {
  title: '小学生课程表',
  themeId: 'coral',
  fontSize: 'medium',
  reminders: [],
  timeSlots: DEFAULT_TIME_SLOTS
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<Settings>({
    ...defaultSettings,
    ...getStorage<Settings>(STORAGE_KEY, defaultSettings)
  })

  const isDark = ref(getStorage<boolean>('schedule-dark', false))

  const title = computed(() => settings.value.title)
  const themeId = computed(() => settings.value.themeId)
  const fontSize = computed(() => settings.value.fontSize)
  const timeSlots = computed(() => settings.value.timeSlots)
  const reminders = computed(() => settings.value.reminders)

  const currentTheme = computed(() => {
    return THEMES.find(t => t.id === settings.value.themeId) || THEMES[0]
  })

  const setTitle = (newTitle: string) => {
    settings.value.title = newTitle
    document.title = newTitle
    saveSettings()
  }

  // 主题切换
  const setThemeId = (id: string) => {
    settings.value.themeId = id
    applyTheme()
    saveSettings()
  }

  const toggleDark = () => {
    isDark.value = !isDark.value
    setStorage('schedule-dark', isDark.value)
    applyTheme()
  }

  const applyTheme = () => {
    const theme = currentTheme.value
    const root = document.documentElement
    const c = theme.colors
    const dark = isDark.value

    // 基础色
    root.style.setProperty('--primary-color', dark ? c.primaryLight : c.primary)
    root.style.setProperty('--primary-light', c.primaryLight)
    root.style.setProperty('--primary-dark', c.primaryDark)
    root.style.setProperty('--success-color', c.success)
    root.style.setProperty('--warning-color', c.warning)
    root.style.setProperty('--danger-color', c.danger)

    // 背景和文字
    const darkBg = DARK_OVERRIDES[theme.id]
    root.style.setProperty('--bg-primary', dark && darkBg ? darkBg.bgPrimary : c.bgPrimary)
    root.style.setProperty('--bg-secondary', dark && darkBg ? darkBg.bgSecondary : c.bgSecondary)
    root.style.setProperty('--text-primary', dark && darkBg ? darkBg.textPrimary : c.textPrimary)
    root.style.setProperty('--text-secondary', dark && darkBg ? darkBg.textSecondary : c.textSecondary)
    root.style.setProperty('--border-color', dark && darkBg ? darkBg.borderColor : c.borderColor)

    // Element Plus 主色
    root.style.setProperty('--el-color-primary', dark ? c.primaryLight : c.primary)
    root.style.setProperty('--el-color-primary-light-3', c.primaryLight)
    root.style.setProperty('--el-color-primary-light-5', c.primaryLight + '80')
    root.style.setProperty('--el-color-primary-light-7', c.primaryLight + '40')
    root.style.setProperty('--el-color-primary-light-8', c.primaryLight + '30')
    root.style.setProperty('--el-color-primary-light-9', c.primaryLight + '20')
    root.style.setProperty('--el-color-primary-dark-2', c.primaryDark)

    root.style.setProperty('--el-color-success', c.success)
    root.style.setProperty('--el-color-warning', c.warning)
    root.style.setProperty('--el-color-danger', c.danger)

    // body 背景
    root.style.setProperty('--el-bg-color', dark && darkBg ? darkBg.bgPrimary : c.bgPrimary)
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
    applyTheme()
    applyFontSize(settings.value.fontSize)
  }

  const saveSettings = () => {
    setStorage(STORAGE_KEY, settings.value)
  }

  return {
    settings,
    title,
    themeId,
    isDark,
    currentTheme,
    fontSize,
    timeSlots,
    reminders,
    setTitle,
    setThemeId,
    toggleDark,
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
