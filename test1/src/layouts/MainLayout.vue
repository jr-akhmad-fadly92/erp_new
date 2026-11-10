<template>
  <div id="app-wrapper">
    <AppTopbar
      :sidebar-collapsed="sidebarCollapsed"
      @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed"
    />
    <AppSidebar :collapsed="sidebarCollapsed" />
    <main class="main-content" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <router-view />
    </main>
    <ToastContainer />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import ToastContainer from '@/components/common/ToastContainer.vue'

const sidebarCollapsed = ref(false)

// Toast system — di-provide ke semua child component
const toasts = ref([])
let toastId = 0
function showToast(message, type = 'success') {
  const icons = {
    success: 'fas fa-check-circle',
    error:   'fas fa-times-circle',
    warning: 'fas fa-exclamation-triangle',
    info:    'fas fa-info-circle',
  }
  const id = toastId++
  toasts.value.push({ id, message, type, icon: icons[type] ?? icons.info })
  setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id) }, 3000)
}

provide('showToast', showToast)
provide('toasts', toasts)
provide('sidebarCollapsed', sidebarCollapsed)
</script>
