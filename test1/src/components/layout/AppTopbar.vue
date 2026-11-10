<template>
  <nav class="navbar-top">
    <!-- Toggle sidebar -->
    <button class="navbar-toggle-btn" @click="$emit('toggle-sidebar')">
      <i class="fas fa-bars"></i>
    </button>

    <!-- Brand -->
    <a class="navbar-brand">
      <i class="fas fa-building brand-icon"></i>
      MultiCorp ERP
    </a>

    <!-- Right side -->
    <div class="navbar-right-items">
      <!-- Company switcher -->
      <div class="company-switcher">
        <i class="fas fa-building" style="color:#26B99A"></i>
        <select v-model="selectedCompany" @change="onCompanyChange">
          <option v-for="c in companies" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </div>

      <!-- User badge + dropdown -->
      <div class="user-info" @click.stop="userMenuOpen = !userMenuOpen" style="position:relative">
        <div class="avatar-sm">{{ initials }}</div>
        <div>
          <div style="color:#fff;font-size:12px;font-weight:600">{{ auth.currentUser.name }}</div>
          <div style="color:#738A9C;font-size:10px">{{ auth.currentRole?.name }}</div>
        </div>
        <i class="fas fa-caret-down" style="color:#738A9C;font-size:10px;margin-left:2px"></i>

        <!-- Dropdown menu -->
        <Transition name="fade-down">
          <div v-if="userMenuOpen" class="user-dropdown" @click.stop>
            <div class="user-dropdown-header">
              <div class="avatar" :style="{ background: auth.currentRole?.color, width:'36px', height:'36px', fontSize:'13px' }">
                {{ initials }}
              </div>
              <div>
                <div style="font-weight:600;color:#455464;font-size:13px">{{ auth.currentUser.name }}</div>
                <div style="color:#aaa;font-size:11px">{{ auth.currentUser.email }}</div>
                <span class="badge-gen" :style="{ background: auth.currentRole?.color, marginTop:'3px', display:'inline-block' }">
                  {{ auth.currentRole?.name }}
                </span>
              </div>
            </div>
            <hr class="divider" style="margin:6px 0">
            <router-link to="/profile" class="user-dropdown-item">
              <i class="fas fa-user"></i> Profil Saya
            </router-link>
            <router-link v-if="auth.currentUser.roleId <= 2" to="/users" class="user-dropdown-item">
              <i class="fas fa-users-cog"></i> Kelola Pengguna
            </router-link>
            <hr class="divider" style="margin:6px 0">
            <button class="user-dropdown-item" style="color:#e74c3c;width:100%" @click="logout">
              <i class="fas fa-sign-out-alt"></i> Keluar
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore, useCompanyStore } from '@/store'

defineProps({ sidebarCollapsed: Boolean })
defineEmits(['toggle-sidebar'])

const auth      = useAuthStore()
const companyStore = useCompanyStore()
const router    = useRouter()

const companies      = computed(() => companyStore.companies)
const selectedCompany = ref(auth.activeCompanyId)
const userMenuOpen   = ref(false)

const initials = computed(() =>
  auth.currentUser?.name?.split(' ').slice(0, 2).map(n => n[0]).join('') || '?'
)

function onCompanyChange() {
  auth.setCompany(Number(selectedCompany.value))
}

function logout() {
  auth.currentUser = {}
  router.push('/login')
}

// Close dropdown when clicking outside
function handleOutsideClick() { userMenuOpen.value = false }
onMounted(()    => document.addEventListener('click', handleOutsideClick))
onBeforeUnmount(()=> document.removeEventListener('click', handleOutsideClick))
</script>

<style scoped>
.user-dropdown {
  position: absolute;
  top: 48px; right: 0;
  background: #fff;
  border-radius: 3px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  min-width: 220px;
  z-index: 1100;
  overflow: hidden;
}
.user-dropdown-header {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 16px;
  background: #f9f9f9;
}
.user-dropdown-item {
  display: flex; align-items: center; gap: 9px;
  padding: 9px 16px;
  font-size: 12.5px;
  color: #455464;
  text-decoration: none;
  background: none; border: none; cursor: pointer;
  transition: background 0.1s;
}
.user-dropdown-item:hover { background: #f5f5f5; }
.user-dropdown-item i { width: 14px; text-align: center; color: #aaa; }

.fade-down-enter-active, .fade-down-leave-active { transition: all 0.15s ease; }
.fade-down-enter-from { opacity: 0; transform: translateY(-6px); }
.fade-down-leave-to   { opacity: 0; transform: translateY(-6px); }
</style>
