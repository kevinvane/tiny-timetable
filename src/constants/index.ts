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

// 课程颜色映射 - 温暖活泼配色
export const COURSE_COLORS: CourseColorMap = {
  chinese: '#FF7043',    // 语文 - 珊瑚橙
  math: '#66BB6A',       // 数学 - 清新绿
  english: '#42A5F5',    // 英语 - 天空蓝
  pe: '#EF5350',         // 体育 - 活力红
  music: '#AB47BC',      // 音乐 - 梦幻紫
  art: '#26C6DA',        // 美术 - 清凉青
  science: '#FFA726',    // 科学 - 阳光橙
  moral: '#EC407A',      // 品德 - 甜蜜粉
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
  { id: '1', name: '语文', teacher: '', classroom: '', color: COURSE_COLORS.chinese, category: 'main' as const, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', name: '数学', teacher: '', classroom: '', color: COURSE_COLORS.math, category: 'main' as const, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', name: '英语', teacher: '', classroom: '', color: COURSE_COLORS.english, category: 'main' as const, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '4', name: '体育', teacher: '', classroom: '', color: COURSE_COLORS.pe, category: 'secondary' as const, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '5', name: '音乐', teacher: '', classroom: '', color: COURSE_COLORS.music, category: 'secondary' as const, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '6', name: '美术', teacher: '', classroom: '', color: COURSE_COLORS.art, category: 'secondary' as const, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '7', name: '科学', teacher: '', classroom: '', color: COURSE_COLORS.science, category: 'secondary' as const, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '8', name: '品德', teacher: '', classroom: '', color: COURSE_COLORS.moral, category: 'secondary' as const, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
]
