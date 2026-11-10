<template>
  <div class="panel-gen" :class="{ 'mb-0': noMargin }">
    <div v-if="title || $slots.actions" class="panel-gen-heading">
      <h3 class="panel-gen-title">
        <i v-if="icon" class="fas panel-icon" :class="icon"></i>
        {{ title }}
        <span v-if="badge" class="badge-gen badge-teal" style="margin-left:6px">{{ badge }}</span>
      </h3>
      <div v-if="$slots.actions" class="flex-row gap-8">
        <slot name="actions" />
      </div>
    </div>
    <div class="panel-gen-body" :style="bodyStyle">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title:    { type: String,  default: '' },
  icon:     { type: String,  default: '' },
  badge:    { type: [String, Number], default: '' },
  noMargin: { type: Boolean, default: false },
  bodyStyle:{ type: Object,  default: () => ({}) },
})
</script>
