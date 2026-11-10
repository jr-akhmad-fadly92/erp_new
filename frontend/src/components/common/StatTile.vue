<template>
  <div class="tile" :class="color">
    <div class="tile-body">
      <div class="tile-value">{{ value }}</div>
      <div class="tile-label">{{ label }}</div>
    </div>
    <i class="fas tile-icon" :class="icon" :style="{ color: iconColor }"></i>
  </div>
</template>

<script setup>
defineProps({
  value:     { type: [String, Number], required: true },
  label:     { type: String, required: true },
  icon:      { type: String, default: 'fa-chart-bar' },
  color:     { type: String, default: '' },     // '', 'blue', 'orange', 'red', 'purple'
  iconColor: { type: String, default: '#26B99A' },
})
</script>
