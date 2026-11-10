<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click.self="$emit('update:modelValue', false)">
        <div class="modal-box" :style="{ width: width }">
          <div class="modal-header">
            <h4>
              <i v-if="icon" class="fas" :class="icon" style="margin-right:7px;color:#26B99A"></i>
              {{ title }}
            </h4>
            <button class="modal-close" @click="$emit('update:modelValue', false)">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <slot />
          </div>
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, required: true },
  title:      { type: String, default: '' },
  icon:       { type: String, default: '' },
  width:      { type: String, default: '520px' },
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all .2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-box, .modal-leave-to .modal-box { transform: scale(.96) translateY(-12px); }
</style>
