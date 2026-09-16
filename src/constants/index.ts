import type { TimeSlot, CourseColorMap } from '@/types'

// 星期名称
export const DAY_NAMES = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

// 默认时间段
export const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  { id: '1', name: '第一节', startTime: '08:00', endTime: '08:45', type: 'class' },
  { id: '2', name: '第二节', startTime: '08:55', endTime: '09:40', type: 'class' },
  { id: '3', name: '第三节', startTime: '10:00', endTime: '10:45', type: 'class' },
  { id: '4', name: '第四节', startTime: '10:55', endTime: '11:40', type: 'class' },
  { id: '5', name: '午休', startTime: '11:40', endTime: '14:00', type: 'lunch' },
  { id: '6', name: '第五节', startTime: '14:00', endTime: '14:45', type: 'class' },
  { id: '7', name: '第六节', startTime: '14:55', endTime: '15:40', type: 'class' },
  { id: '8', name: '第七节', startTime: '16:00', endTime: '16:45', type: 'class' },
]

// 课程颜色映射
export const COURSE_COLORS: CourseColorMap = {
  chinese: '#409EFF',    // 语文 - 蓝色
  math: '#67C23A',       // 数学 - 绿色
  english: '#E6A23C',    // 英语 - 橙色
  pe: '#F56C6C',         // 体育 - 红色
  music: '#909399',      // 音乐 - 灰色
  art: '#B37FEB',        // 美术 - 紫色
  science: '#36CFC9',    // 科学 - 青色
  moral: '#FF85C0',      // 品德 - 粉色
}

// 课程分类名称
export const CATEGORY_NAMES: Record<string, string> = {
  main: '主科',
  secondary: '副科',
  interest: '兴趣班',
  activity: '活动',
}

// 默认课程列表
export const DEFAULT_COURSES = [
  { id: '1', name: '语文', teacher: '', classroom: '', color: COURSE_COLORS.chinese, category: 'main' as const, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', name: '数学', teacher: '', classroom: '', color: COURSE_COLORS.math, category: 'main' as const, createdAt: new Date(), updatedAt: new Date() },
  { id: '3', name: '英语', teacher: '', classroom: '', color: COURSE_COLORS.english, category: 'main' as const, createdAt: new Date(), updatedAt: new Date() },
  { id: '4', name: '体育', teacher: '', classroom: '', color: COURSE_COLORS.pe, category: 'secondary' as const, createdAt: new Date(), updatedAt: new Date() },
  { id: '5', name: '音乐', teacher: '', classroom: '', color: COURSE_COLORS.music, category: 'secondary' as const, createdAt: new Date(), updatedAt: new Date() },
  { id: '6', name: '美术', teacher: '', classroom: '', color: COURSE_COLORS.art, category: 'secondary' as const, createdAt: new Date(), updatedAt: new Date() },
  { id: '7', name: '科学', teacher: '', classroom: '', color: COURSE_COLORS.science, category: 'secondary' as const, createdAt: new Date(), updatedAt: new Date() },
  { id: '8', name: '品德', teacher: '', classroom: '', color: COURSE_COLORS.moral, category: 'secondary' as const, createdAt: new Date(), updatedAt: new Date() },
]
