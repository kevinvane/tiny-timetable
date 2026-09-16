<script setup lang="ts">
import { ref } from 'vue'
import { useSettingsStore } from '@/stores'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { TimeSlot } from '@/types'

const settingsStore = useSettingsStore()

const activeTab = ref('appearance')

// 主题设置
const handleThemeChange = (theme: 'light' | 'dark') => {
  settingsStore.setTheme(theme)
  ElMessage.success('主题已更新')
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
</script>

<template>
  <div class="settings-page">
    <h1>设置</h1>
    
    <el-tabs v-model="activeTab">
      <!-- 外观设置 -->
      <el-tab-pane label="外观" name="appearance">
        <div class="setting-section">
          <h3>主题</h3>
          <p class="setting-desc">选择你喜欢的主题模式</p>
          <el-radio-group 
            :model-value="settingsStore.theme" 
            @change="handleThemeChange"
          >
            <el-radio-button value="light">
              <el-icon><Sunny /></el-icon>
              浅色模式
            </el-radio-button>
            <el-radio-button value="dark">
              <el-icon><Moon /></el-icon>
              深色模式
            </el-radio-button>
          </el-radio-group>
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
          <h3>课程提醒</h3>
          <p class="setting-desc">设置课程开始前的提醒时间</p>
          
          <el-empty description="暂无提醒设置">
            <el-button type="primary">添加提醒</el-button>
          </el-empty>
        </div>
      </el-tab-pane>

      <!-- 数据管理 -->
      <el-tab-pane label="数据" name="data">
        <div class="setting-section">
          <h3>数据管理</h3>
          <p class="setting-desc">管理你的课程表数据</p>
          
          <div class="data-actions">
            <el-button type="primary">
              <el-icon><Download /></el-icon>
              导出数据
            </el-button>
            <el-button>
              <el-icon><Upload /></el-icon>
              导入数据
            </el-button>
            <el-button type="danger">
              <el-icon><Delete /></el-icon>
              清除所有数据
            </el-button>
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

.about-info {
  color: var(--text-secondary);
  line-height: 1.8;
}

.about-info p {
  margin: 0;
}
</style>
