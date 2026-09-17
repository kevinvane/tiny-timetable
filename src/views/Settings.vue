<script setup lang="ts">
import { ref } from 'vue'
import { useSettingsStore, useCourseStore } from '@/stores'
import { THEMES } from '@/constants/themes'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { TimeSlot, Reminder } from '@/types'
import { getStorage, setStorage, removeStorage } from '@/utils'

const settingsStore = useSettingsStore()
const courseStore = useCourseStore()

const activeTab = ref('appearance')
const titleInput = ref(settingsStore.title)

const handleTitleChange = () => {
  if (titleInput.value.trim()) {
    settingsStore.setTitle(titleInput.value.trim())
    ElMessage.success('标题已更新')
  }
}

// 主题切换
const handleThemeSelect = (id: string) => {
  settingsStore.setThemeId(id)
  ElMessage.success('主题已切换')
}

const handleDarkToggle = () => {
  settingsStore.toggleDark()
  ElMessage.success(settingsStore.isDark ? '已切换到深色模式' : '已切换到浅色模式')
}

// 字体大小设置
const handleFontSizeChange = (size: 'small' | 'medium' | 'large') => {
  settingsStore.setFontSize(size)
  ElMessage.success('字体大小已更新')
}

// 时间段编辑
const showSlotDialog = ref(false)
const editingSlot = ref<TimeSlot | null>(null)
const slotForm = ref({
  name: '',
  startTime: '',
  endTime: '',
  type: 'class' as 'class' | 'break' | 'lunch'
})

const openAddSlot = () => {
  editingSlot.value = null
  slotForm.value = { name: '', startTime: '', endTime: '', type: 'class' }
  showSlotDialog.value = true
}

const openEditSlot = (slot: TimeSlot) => {
  editingSlot.value = slot
  slotForm.value = {
    name: slot.name,
    startTime: slot.startTime,
    endTime: slot.endTime,
    type: slot.type
  }
  showSlotDialog.value = true
}

const handleSaveSlot = () => {
  if (!slotForm.value.name || !slotForm.value.startTime || !slotForm.value.endTime) {
    ElMessage.warning('请填写完整信息')
    return
  }
  if (editingSlot.value) {
    settingsStore.updateTimeSlot(editingSlot.value.id, { ...slotForm.value })
    ElMessage.success('修改成功')
  } else {
    settingsStore.addTimeSlot({ ...slotForm.value })
    ElMessage.success('添加成功')
  }
  showSlotDialog.value = false
}

const handleDeleteSlot = async (slot: TimeSlot) => {
  try {
    await ElMessageBox.confirm(`确定要删除"${slot.name}"吗？`, '删除确认', { type: 'warning' })
    settingsStore.deleteTimeSlot(slot.id)
    ElMessage.success('删除成功')
  } catch {
    // 取消
  }
}

// 提醒管理
const showReminderDialog = ref(false)
const editingReminder = ref<Reminder | null>(null)
const reminderForm = ref({
  courseId: '',
  type: 'before_class' as Reminder['type'],
  advanceMinutes: 5,
  isEnabled: true
})

const reminderTypeNames: Record<string, string> = {
  before_class: '课前提醒',
  homework: '作业提醒',
  custom: '自定义'
}

const openAddReminder = () => {
  editingReminder.value = null
  reminderForm.value = { courseId: '', type: 'before_class', advanceMinutes: 5, isEnabled: true }
  showReminderDialog.value = true
}

const openEditReminder = (reminder: Reminder) => {
  editingReminder.value = reminder
  reminderForm.value = {
    courseId: reminder.courseId,
    type: reminder.type,
    advanceMinutes: reminder.advanceMinutes,
    isEnabled: reminder.isEnabled
  }
  showReminderDialog.value = true
}

const handleSaveReminder = () => {
  if (!reminderForm.value.courseId) {
    ElMessage.warning('请选择课程')
    return
  }
  if (editingReminder.value) {
    settingsStore.updateReminder(editingReminder.value.id, { ...reminderForm.value })
    ElMessage.success('修改成功')
  } else {
    settingsStore.addReminder({ ...reminderForm.value })
    ElMessage.success('添加成功')
  }
  showReminderDialog.value = false
}

const handleDeleteReminder = async (reminder: Reminder) => {
  try {
    await ElMessageBox.confirm('确定要删除此提醒吗？', '删除确认', { type: 'warning' })
    settingsStore.deleteReminder(reminder.id)
    ElMessage.success('删除成功')
  } catch {
    // 取消
  }
}

const getReminderCourseName = (courseId: string) => {
  const course = courseStore.getCourseById(courseId)
  return course ? course.name : '未知课程'
}

// 数据管理
const handleExportData = () => {
  const data = {
    courses: getStorage('schedule-courses', []),
    scheduleItems: getStorage('schedule-items', []),
    settings: getStorage('schedule-settings', {}),
  }
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `课程表数据_${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('数据已导出')
}

const importInputRef = ref<HTMLInputElement | null>(null)

const handleImportData = () => {
  importInputRef.value?.click()
}

const handleImportFile = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string)
      if (data.courses) setStorage('schedule-courses', data.courses)
      if (data.scheduleItems) setStorage('schedule-items', data.scheduleItems)
      if (data.settings) setStorage('schedule-settings', data.settings)
      ElMessage.success('数据已导入，即将刷新页面')
      setTimeout(() => window.location.reload(), 1000)
    } catch {
      ElMessage.error('导入失败：文件格式无效')
    }
  }
  reader.readAsText(file)
  // 重置 input 以便可以重复导入同一文件
  target.value = ''
}

const handleClearData = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要清除所有数据吗？此操作不可恢复！',
      '危险操作',
      { type: 'error', confirmButtonText: '确认清除', cancelButtonText: '取消' }
    )
    removeStorage('schedule-courses')
    removeStorage('schedule-items')
    removeStorage('schedule-settings')
    removeStorage('schedule-dark')
    ElMessage.success('所有数据已清除，即将刷新页面')
    setTimeout(() => window.location.reload(), 1000)
  } catch {
    // 取消
  }
}
</script>

<template>
  <div class="settings-page">
    <h1>设置</h1>

    <el-tabs v-model="activeTab">
      <!-- 外观设置 -->
      <el-tab-pane label="外观" name="appearance">
        <div class="setting-section">
          <h3>应用标题</h3>
          <p class="setting-desc">自定义显示在侧边栏的名称</p>
          <div class="title-input-row">
            <el-input
              v-model="titleInput"
              placeholder="请输入标题"
              maxlength="20"
              show-word-limit
              @blur="handleTitleChange"
              @keyup.enter="handleTitleChange"
            />
            <el-button type="primary" @click="handleTitleChange">保存</el-button>
          </div>
        </div>

        <div class="setting-section">
          <h3>主题配色</h3>
          <p class="setting-desc">选择你喜欢的主题颜色</p>
          <div class="theme-grid">
            <div
              v-for="theme in THEMES"
              :key="theme.id"
              class="theme-card"
              :class="{ active: settingsStore.themeId === theme.id }"
              @click="handleThemeSelect(theme.id)"
            >
              <div class="theme-colors">
                <span class="color-dot" :style="{ backgroundColor: theme.colors.primary }"></span>
                <span class="color-dot" :style="{ backgroundColor: theme.colors.success }"></span>
                <span class="color-dot" :style="{ backgroundColor: theme.colors.warning }"></span>
              </div>
              <span class="theme-name">{{ theme.name }}</span>
            </div>
          </div>
        </div>

        <div class="setting-section">
          <h3>深色模式</h3>
          <p class="setting-desc">切换浅色/深色显示模式</p>
          <el-switch
            :model-value="settingsStore.isDark"
            @change="handleDarkToggle"
            active-text="深色"
            inactive-text="浅色"
          />
        </div>

        <div class="setting-section">
          <h3>字体大小</h3>
          <p class="setting-desc">调整应用中的字体大小</p>
          <el-radio-group
            :model-value="settingsStore.fontSize"
            @change="handleFontSizeChange"
          >
            <el-radio-button value="small">小</el-radio-button>
            <el-radio-button value="medium">中</el-radio-button>
            <el-radio-button value="large">大</el-radio-button>
          </el-radio-group>
        </div>
      </el-tab-pane>

      <!-- 时间设置 -->
      <el-tab-pane label="时间" name="time">
        <div class="setting-section">
          <div class="section-header">
            <div>
              <h3>课程时间安排</h3>
              <p class="setting-desc">自定义每节课的时间</p>
            </div>
            <el-button type="primary" @click="openAddSlot">
              <el-icon><Plus /></el-icon>
              添加时段
            </el-button>
          </div>

          <el-table :data="settingsStore.timeSlots" style="width: 100%">
            <el-table-column prop="name" label="时段名称" />
            <el-table-column prop="startTime" label="开始时间" />
            <el-table-column prop="endTime" label="结束时间" />
            <el-table-column prop="type" label="类型" width="100">
              <template #default="{ row }">
                <el-tag :type="row.type === 'class' ? 'primary' : row.type === 'lunch' ? 'warning' : 'info'">
                  {{ row.type === 'class' ? '课程' : row.type === 'lunch' ? '午休' : '课间' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="140" fixed="right">
              <template #default="{ row }">
                <el-button size="small" @click="openEditSlot(row)">编辑</el-button>
                <el-button size="small" type="danger" @click="handleDeleteSlot(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <!-- 提醒设置 -->
      <el-tab-pane label="提醒" name="reminder">
        <div class="setting-section">
          <div class="section-header">
            <div>
              <h3>课程提醒</h3>
              <p class="setting-desc">设置课程开始前的提醒时间</p>
            </div>
            <el-button type="primary" @click="openAddReminder">
              <el-icon><Plus /></el-icon>
              添加提醒
            </el-button>
          </div>

          <el-table v-if="settingsStore.reminders.length > 0" :data="settingsStore.reminders" style="width: 100%">
            <el-table-column label="课程" min-width="120">
              <template #default="{ row }">
                {{ getReminderCourseName(row.courseId) }}
              </template>
            </el-table-column>
            <el-table-column label="类型" width="120">
              <template #default="{ row }">
                {{ reminderTypeNames[row.type] || row.type }}
              </template>
            </el-table-column>
            <el-table-column prop="advanceMinutes" label="提前分钟" width="120" />
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.isEnabled ? 'success' : 'info'">
                  {{ row.isEnabled ? '已启用' : '已禁用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="140" fixed="right">
              <template #default="{ row }">
                <el-button size="small" @click="openEditReminder(row)">编辑</el-button>
                <el-button size="small" type="danger" @click="handleDeleteReminder(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-empty v-else description="暂无提醒设置" />
        </div>
      </el-tab-pane>

      <!-- 数据管理 -->
      <el-tab-pane label="数据" name="data">
        <div class="setting-section">
          <h3>数据管理</h3>
          <p class="setting-desc">管理你的课程表数据</p>

          <div class="data-actions">
            <el-button type="primary" @click="handleExportData">
              <el-icon><Download /></el-icon>
              导出数据
            </el-button>
            <el-button @click="handleImportData">
              <el-icon><Upload /></el-icon>
              导入数据
            </el-button>
            <el-button type="danger" @click="handleClearData">
              <el-icon><Delete /></el-icon>
              清除所有数据
            </el-button>
            <input
              ref="importInputRef"
              type="file"
              accept=".json"
              style="display: none"
              @change="handleImportFile"
            />
          </div>
        </div>
      </el-tab-pane>

      <!-- 关于 -->
      <el-tab-pane label="关于" name="about">
        <div class="setting-section">
          <h3>关于应用</h3>
          <p class="setting-desc">小学生课程表 v1.0.0</p>

          <div class="about-info">
            <p>这是一个为小学生设计的课程表管理应用，帮助你轻松管理课程安排。</p>
            <p>技术栈：Vue 3 + Vite + TypeScript + Element Plus</p>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 编辑/添加时段弹窗 -->
    <el-dialog
      v-model="showSlotDialog"
      :title="editingSlot ? '编辑时段' : '添加时段'"
      width="400px"
    >
      <el-form :model="slotForm" label-width="80px">
        <el-form-item label="时段名称">
          <el-input v-model="slotForm.name" placeholder="如：第一节" />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-time-picker v-model="slotForm.startTime" format="HH:mm" value-format="HH:mm" placeholder="选择开始时间" style="width: 100%" />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-time-picker v-model="slotForm.endTime" format="HH:mm" value-format="HH:mm" placeholder="选择结束时间" style="width: 100%" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="slotForm.type" style="width: 100%">
            <el-option label="课程" value="class" />
            <el-option label="课间" value="break" />
            <el-option label="午休" value="lunch" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showSlotDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSaveSlot">确定</el-button>
      </template>
    </el-dialog>

    <!-- 编辑/添加提醒弹窗 -->
    <el-dialog
      v-model="showReminderDialog"
      :title="editingReminder ? '编辑提醒' : '添加提醒'"
      width="400px"
    >
      <el-form :model="reminderForm" label-width="80px">
        <el-form-item label="选择课程">
          <el-select v-model="reminderForm.courseId" placeholder="请选择课程" style="width: 100%">
            <el-option
              v-for="course in courseStore.courseList"
              :key="course.id"
              :label="course.name"
              :value="course.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="提醒类型">
          <el-select v-model="reminderForm.type" style="width: 100%">
            <el-option label="课前提醒" value="before_class" />
            <el-option label="作业提醒" value="homework" />
            <el-option label="自定义" value="custom" />
          </el-select>
        </el-form-item>
        <el-form-item label="提前分钟">
          <el-input-number v-model="reminderForm.advanceMinutes" :min="1" :max="120" />
        </el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="reminderForm.isEnabled" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showReminderDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSaveReminder">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.settings-page {
  max-width: 800px;
  margin: 0 auto;
}

.settings-page h1 {
  font-size: 24px;
  color: var(--text-primary);
  margin-bottom: 20px;
}

.setting-section {
  padding: 20px;
  background: var(--bg-secondary);
  border-radius: 8px;
  margin-bottom: 20px;
}

.setting-section h3 {
  font-size: 16px;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.setting-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 16px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.section-header h3,
.section-header .setting-desc {
  margin-bottom: 0;
}

.data-actions {
  display: flex;
  gap: 12px;
}

.title-input-row {
  display: flex;
  gap: 12px;
}

.title-input-row .el-input {
  flex: 1;
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.theme-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.theme-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

.theme-card.active {
  border-color: var(--primary-color);
  background: var(--bg-secondary);
}

.theme-colors {
  display: flex;
  gap: 6px;
}

.color-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid rgba(0, 0, 0, 0.1);
}

.theme-name {
  font-size: 13px;
  color: var(--text-primary);
  font-weight: 500;
}

.about-info {
  color: var(--text-secondary);
  line-height: 1.8;
}

.about-info p {
  margin: 0;
}
</style>
