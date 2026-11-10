<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="toast-msg"
        :class="t.type"
        @click="dismiss(t.id)"
      >
        <i :class="t.icon"></i>
        <span>{{ t.message }}</span>
        <i class="fas fa-times" style="margin-left:auto;opacity:.6;font-size:10px;cursor:pointer"></i>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { inject } from 'vue'
const toasts = inject('toasts')

function dismiss(id) {
  toasts.value = toasts.value.filter(t => t.id !== id)
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 68px; right: 18px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}
.toast-msg {
  pointer-events: all;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px 16px;
  border-radius: 3px;
  font-size: 12.5px;
  box-shadow: 0 3px 12px rgba(0,0,0,0.18);
  min-width: 240px;
  max-width: 340px;
  cursor: pointer;
}
.toast-msg.success { background: #26B99A; color: #fff; }
.toast-msg.error   { background: #e74c3c; color: #fff; }
.toast-msg.warning { background: #f0ad4e; color: #fff; }
.toast-msg.info    { background: #1c84c6; color: #fff; }

.toast-enter-active { transition: all .25s ease; }
.toast-leave-active { transition: all .2s ease; }
.toast-enter-from   { opacity: 0; transform: translateX(40px); }
.toast-leave-to     { opacity: 0; transform: translateX(40px); }
</style>
