import dayjs from 'dayjs'

// 生成唯一ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

// 格式化时间
export const formatTime = (time: string): string => {
  return dayjs(`2000-01-01 ${time}`).format('HH:mm')
}

// 获取当前星期几 (1-7)
export const getCurrentDayOfWeek = (): number => {
  const day = dayjs().day()
  return day === 0 ? 7 : day
}

// 获取星期名称 (1-7, 周一=1, 周日=7)
export const getDayName = (day: number): string => {
  const names = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  return names[day - 1] ?? ''
}

// 判断是否是今天
export const isToday = (day: number): boolean => {
  return day === getCurrentDayOfWeek()
}

// 获取本周日期范围
export const getWeekDateRange = (weekOffset = 0): { start: dayjs.Dayjs; end: dayjs.Dayjs } => {
  const today = dayjs()
  const currentDay = today.day() || 7 // 周日为7
  const start = today.subtract(currentDay - 1, 'day').add(weekOffset, 'week')
  const end = start.add(6, 'day')
  return { start, end }
}

// 格式化日期范围
export const formatDateRange = (start: dayjs.Dayjs, end: dayjs.Dayjs): string => {
  return `${start.format('M月D日')} - ${end.format('M月D日')}`
}

// 存储数据到localStorage
export const setStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

// 从localStorage获取数据
export const getStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('Failed to read from localStorage:', error)
    return defaultValue
  }
}

// 删除localStorage数据
export const removeStorage = (key: string): void => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Failed to remove from localStorage:', error)
  }
}
