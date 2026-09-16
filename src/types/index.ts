// 课程类型
export interface Course {
  id: string
  name: string
  teacher: string
  classroom: string
  color: string
  category: CourseCategory
  createdAt: Date
  updatedAt: Date
}

// 课程分类
export type CourseCategory = 'main' | 'secondary' | 'interest' | 'activity'

// 课程表项
export interface ScheduleItem {
  id: string
  courseId: string
  dayOfWeek: number // 1-7
  startTime: string // "08:00"
  endTime: string   // "08:45"
  weekRange?: string // "1-16周"
  isRecurring: boolean
}

// 时间段
export interface TimeSlot {
  id: string
  name: string // "第一节"
  startTime: string
  endTime: string
  type: 'class' | 'break' | 'lunch'
}

// 提醒
export interface Reminder {
  id: string
  courseId: string
  type: 'before_class' | 'homework' | 'custom'
  advanceMinutes: number
  isEnabled: boolean
}

// 设置
export interface Settings {
  theme: 'light' | 'dark'
  fontSize: 'small' | 'medium' | 'large'
  reminders: Reminder[]
  timeSlots: TimeSlot[]
}

// 视图类型
export type ViewType = 'week' | 'day'

// 星期几
export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7

// 课程颜色映射
export interface CourseColorMap {
  [key: string]: string
}

// 课程表数据
export interface ScheduleData {
  courses: Course[]
  scheduleItems: ScheduleItem[]
  timeSlots: TimeSlot[]
}
