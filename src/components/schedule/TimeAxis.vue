<script setup lang="ts">
import { computed } from 'vue'
import { useSettingsStore } from '@/stores'
import { DEFAULT_TIME_SLOTS } from '@/constants'

const settingsStore = useSettingsStore()

const timeSlots = computed(() => {
  return settingsStore.timeSlots.length > 0 
    ? settingsStore.timeSlots 
    : DEFAULT_TIME_SLOTS
})

const classSlots = computed(() => {
  return timeSlots.value.filter(slot => slot.type === 'class')
})
</script>

<template>
  <div class="time-axis">
    <div 
      v-for="slot in classSlots" 
      :key="slot.id"
      class="time-slot"
    >
      <div class="slot-marker"></div>
      <div class="slot-info">
        <div class="slot-name">{{ slot.name }}</div>
        <div class="slot-time">{{ slot.startTime }} - {{ slot.endTime }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.time-axis {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
}

.time-slot {
  display: flex;
  align-items: center;
  gap: 12px;
}

.slot-marker {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--primary-color);
}

.slot-info {
  flex: 1;
}

.slot-name {
  font-size: 14px;
  font-weight: bold;
  color: var(--text-primary);
}

.slot-time {
  font-size: 12px;
  color: var(--text-secondary);
}
</style>
