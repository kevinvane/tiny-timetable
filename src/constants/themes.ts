import type { Theme } from '@/types'

// 预设主题
export const THEMES: Theme[] = [
  {
    id: 'coral',
    name: '珊瑚橙',
    colors: {
      primary: '#FF7043',
      primaryLight: '#FF8A65',
      primaryDark: '#F4511E',
      success: '#66BB6A',
      warning: '#FFA726',
      danger: '#EF5350',
      bgPrimary: '#FFFBF9',
      bgSecondary: '#FFF3EE',
      textPrimary: '#3E2723',
      textSecondary: '#795548',
      borderColor: '#FFCCBC'
    }
  },
  {
    id: 'ocean',
    name: '海洋蓝',
    colors: {
      primary: '#42A5F5',
      primaryLight: '#64B5F6',
      primaryDark: '#1E88E5',
      success: '#66BB6A',
      warning: '#FFA726',
      danger: '#EF5350',
      bgPrimary: '#F8FBFF',
      bgSecondary: '#EEF5FF',
      textPrimary: '#1A237E',
      textSecondary: '#5C6BC0',
      borderColor: '#BBDEFB'
    }
  },
  {
    id: 'forest',
    name: '森林绿',
    colors: {
      primary: '#66BB6A',
      primaryLight: '#81C784',
      primaryDark: '#43A047',
      success: '#26A69A',
      warning: '#FFA726',
      danger: '#EF5350',
      bgPrimary: '#F7FBF7',
      bgSecondary: '#EDF7ED',
      textPrimary: '#1B5E20',
      textSecondary: '#4CAF50',
      borderColor: '#C8E6C9'
    }
  },
  {
    id: 'lavender',
    name: '薰衣紫',
    colors: {
      primary: '#AB47BC',
      primaryLight: '#BA68C8',
      primaryDark: '#8E24AA',
      success: '#66BB6A',
      warning: '#FFA726',
      danger: '#EF5350',
      bgPrimary: '#FDF8FF',
      bgSecondary: '#F5EEFF',
      textPrimary: '#4A148C',
      textSecondary: '#7E57C2',
      borderColor: '#E1BEE7'
    }
  },
  {
    id: 'cherry',
    name: '樱花粉',
    colors: {
      primary: '#EC407A',
      primaryLight: '#F06292',
      primaryDark: '#D81B60',
      success: '#66BB6A',
      warning: '#FFA726',
      danger: '#EF5350',
      bgPrimary: '#FFF8FA',
      bgSecondary: '#FFEEF3',
      textPrimary: '#880E4F',
      textSecondary: '#AD1457',
      borderColor: '#F8BBD0'
    }
  },
  {
    id: 'sunshine',
    name: '阳光橙',
    colors: {
      primary: '#FFA726',
      primaryLight: '#FFB74D',
      primaryDark: '#FB8C00',
      success: '#66BB6A',
      warning: '#FF7043',
      danger: '#EF5350',
      bgPrimary: '#FFFCF5',
      bgSecondary: '#FFF8E1',
      textPrimary: '#E65100',
      textSecondary: '#F57C00',
      borderColor: '#FFE0B2'
    }
  }
]

// 暗色模式变体
export const DARK_OVERRIDES: Record<string, { bgPrimary: string; bgSecondary: string; textPrimary: string; textSecondary: string; borderColor: string }> = {
  coral: { bgPrimary: '#1a1210', bgSecondary: '#2d2018', textPrimary: '#FFFBF9', textSecondary: '#FFCCBC', borderColor: '#4E342E' },
  ocean: { bgPrimary: '#0d1b2a', bgSecondary: '#1b2838', textPrimary: '#E3F2FD', textSecondary: '#90CAF9', borderColor: '#1A3A5C' },
  forest: { bgPrimary: '#0d1a0d', bgSecondary: '#1a2e1a', textPrimary: '#E8F5E9', textSecondary: '#A5D6A7', borderColor: '#2E4E2E' },
  lavender: { bgPrimary: '#1a0d2a', bgSecondary: '#2d1a40', textPrimary: '#F3E5F5', textSecondary: '#CE93D8', borderColor: '#4A2E6E' },
  cherry: { bgPrimary: '#1a0d14', bgSecondary: '#2d1a24', textPrimary: '#FCE4EC', textSecondary: '#F48FB1', borderColor: '#5E2E3E' },
  sunshine: { bgPrimary: '#1a1408', bgSecondary: '#2d2418', textPrimary: '#FFF3E0', textSecondary: '#FFCC80', borderColor: '#4E3E1E' }
}
