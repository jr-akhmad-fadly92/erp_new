<template>
  <aside class="sidebar" :class="{ collapsed: collapsed }">
    <nav>
      <ul class="sidebar-menu">
        <template v-for="section in visibleMenu" :key="section.section">
          <li class="menu-section-label">{{ section.section }}</li>
          <li v-for="item in section.items" :key="item.to" class="menu-item">
            <router-link :to="item.to" active-class="active" exact-active-class="active">
              <i class="fas menu-icon" :class="item.icon"></i>
              <span class="menu-label">{{ item.label }}</span>
              <span v-if="item.badge" class="badge-pill">{{ item.badge }}</span>
            </router-link>
          </li>
        </template>
      </ul>
    </nav>

    <!-- Sidebar footer -->
    <div class="sidebar-footer">
      <div class="avatar"
        :style="{ background: auth.currentRole?.color, width:'30px', height:'30px', fontSize:'11px', flexShrink:0 }">
        {{ initials }}
      </div>
      <Transition name="fade">
        <div v-if="!collapsed" class="sidebar-footer-info">
          <div style="color:#E7E7E7;font-size:11px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
            {{ auth.currentUser.name }}
          </div>
          <div style="color:#738A9C;font-size:10px">{{ auth.currentRole?.name }}</div>
        </div>
      </Transition>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore, usePermissionStore } from '@/store'

defineProps({ collapsed: Boolean })

const auth      = useAuthStore()
const permStore = usePermissionStore()

const initials  = computed(() =>
  auth.currentUser?.name?.split(' ').slice(0,2).map(n=>n[0]).join('') || '?'
)
const roleId    = computed(() => auth.currentUser?.roleId ?? 99)
const companyId = computed(() => auth.activeCompanyId)
const isAdmin   = computed(() => roleId.value <= 2)

function can(moduleId) {
  return permStore.getPerms(companyId.value)[moduleId]?.[roleId.value] ?? false
}

const allMenu = computed(() => [
  {
    section: 'Utama',
    items: [
      { to:'/dashboard',  icon:'fa-tachometer-alt', label:'Dashboard',  show: true },
      { to:'/perusahaan', icon:'fa-building',        label:'Perusahaan', show: true },
    ]
  },
  {
    section: 'Manajemen Akses',
    show: isAdmin.value,
    items: [
      { to:'/permission', icon:'fa-shield-alt', label:'Hak Akses Modul', badge:'13', show: isAdmin.value },
      { to:'/users',      icon:'fa-users',       label:'Pengguna',                   show: isAdmin.value },
    ]
  },
  {
    section: 'Modul ERP',
    items: [
      { to:'/purchasing', icon:'fa-shopping-cart', label:'Purchasing',      show: can('m03') },
      { to:'/import',     icon:'fa-ship',           label:'Import',          show: can('m06') },
      { to:'/gudang',     icon:'fa-warehouse',      label:'Gudang',          show: can('m09') || can('m10') },
      { to:'/sales',      icon:'fa-chart-line',     label:'Sales',           show: can('m12') },
      { to:'/spv-sales',  icon:'fa-user-tie',       label:'SPV Sales',       show: can('m25') },
      { to:'/finance',    icon:'fa-money-bill',     label:'Finance',         show: can('m16') },
      { to:'/accounting', icon:'fa-calculator',     label:'Accounting',      show: can('m18') },
      { to:'/qc',         icon:'fa-microscope',     label:'Quality Control', show: can('m20') },
    ]
  },
  {
    section: 'Sistem',
    show: isAdmin.value,
    items: [
      { to:'/audit-log', icon:'fa-history', label:'Audit Log', show: isAdmin.value },
    ]
  },
])

const visibleMenu = computed(() =>
  allMenu.value
    .filter(s => s.show !== false)
    .map(s => ({ ...s, items: s.items.filter(i => i.show !== false) }))
    .filter(s => s.items.length > 0)
)
</script>

<style scoped>
.sidebar-footer {
  position: absolute; bottom: 0; left: 0; right: 0;
  background: #1F2E3C; padding: 10px 14px;
  display: flex; align-items: center; gap: 10px;
  border-top: 1px solid rgba(255,255,255,0.05);
}
.sidebar-footer-info { flex: 1; overflow: hidden; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }
</style>
