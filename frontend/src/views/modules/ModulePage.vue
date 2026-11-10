<template>
  <div>
    <div class="page-header-row">
      <div>
        <h1 class="page-title">{{ meta.title }}</h1>
        <p class="breadcrumb-nav">Home &rsaquo; Modul ERP &rsaquo; <span>{{ meta.title }}</span></p>
      </div>
    </div>

    <!-- Access check -->
    <div v-if="!hasAccess" class="panel-gen">
      <div class="panel-gen-body" style="text-align:center;padding:40px">
        <i class="fas fa-lock" style="font-size:40px;color:#e74c3c;margin-bottom:12px;display:block"></i>
        <h3 style="color:#455464;font-size:16px;margin-bottom:6px">Akses Dibatasi</h3>
        <p style="color:#aaa;font-size:13px">
          Role <strong>{{ auth.currentRole?.name }}</strong> tidak memiliki hak akses ke modul ini.<br>
          Hubungi Super Admin untuk mengubah hak akses.
        </p>
        <router-link to="/dashboard" class="btn-gen btn-teal" style="margin-top:14px;display:inline-flex">
          <i class="fas fa-home"></i> Kembali ke Dashboard
        </router-link>
      </div>
    </div>

    <template v-else>
      <!-- Sub-module tiles -->
      <div class="tile-row" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">
        <div v-for="(sm, i) in subModules" :key="i" class="tile" :class="sm.tileClass">
          <div class="tile-body">
            <div class="tile-value">{{ sm.count }}</div>
            <div class="tile-label">{{ sm.label }}</div>
          </div>
          <i class="fas tile-icon" :class="sm.icon" :style="{ color: sm.iconColor }"></i>
        </div>
      </div>

      <!-- Access info panel -->
      <div class="panel-gen">
        <div class="panel-gen-heading">
          <h3 class="panel-gen-title">
            <i class="fas panel-icon" :class="moduleIconMap[module] || 'fa-cube'"></i>
            Modul {{ meta.title }}
          </h3>
          <span class="badge-gen badge-teal">
            <i class="fas fa-check-circle" style="margin-right:4px"></i>Akses Aktif
          </span>
        </div>
        <div class="panel-gen-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
            <div>
              <h4 style="font-size:13px;color:#455464;margin-bottom:12px;font-weight:600">
                Sub-modul yang Anda Akses
              </h4>
              <div v-for="m in accessibleSubModules" :key="m.id" style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
                <i class="fas" :class="m.icon" style="color:#26B99A;width:16px"></i>
                <span style="font-size:12.5px;color:#555">{{ m.name }}</span>
                <span style="margin-left:auto;background:#E8F8F5;color:#1a8a72;font-size:10px;padding:1px 7px;border-radius:10px">Aktif</span>
              </div>
            </div>
            <div>
              <h4 style="font-size:13px;color:#455464;margin-bottom:12px;font-weight:600">
                Informasi Role
              </h4>
              <table style="width:100%;font-size:12px">
                <tr><td style="color:#aaa;padding:4px 0;width:110px">Role Aktif</td>
                  <td><span class="badge-gen" :style="{ background: auth.currentRole?.color }">{{ auth.currentRole?.name }}</span></td></tr>
                <tr><td style="color:#aaa;padding:4px 0">Perusahaan</td>
                  <td style="color:#455464">{{ auth.activeCompany?.name }}</td></tr>
                <tr><td style="color:#aaa;padding:4px 0">Total Akses</td>
                  <td style="color:#26B99A;font-weight:600">{{ accessibleSubModules.length }} sub-modul</td></tr>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Placeholder content table -->
      <div class="panel-gen">
        <div class="panel-gen-heading">
          <h3 class="panel-gen-title">
            <i class="fas fa-list panel-icon"></i>
            Data {{ meta.title }}
          </h3>
          <button class="btn-gen btn-teal btn-sm">
            <i class="fas fa-plus"></i> Tambah Baru
          </button>
        </div>
        <div class="panel-gen-body" style="text-align:center;color:#aaa;padding:30px">
          <i class="fas fa-database" style="font-size:32px;margin-bottom:10px;display:block;opacity:.3"></i>
          <p style="font-size:13px">Konten modul <strong>{{ meta.title }}</strong> akan dikembangkan di sini.</p>
          <p style="font-size:11px">Hubungkan dengan API backend untuk data nyata.</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { MODULES } from '@/data/constants'
import { useAuthStore, usePermissionStore } from '@/store'

const route = useRoute()
const auth = useAuthStore()
const permStore = usePermissionStore()
const meta = route.meta
const module = route.meta.module

const moduleGroupMap = {
  purchasing: 'Purchasing',
  import:     'Import',
  gudang:     'Gudang',
  sales:      'Sales',
  finance:    'Finance',
  accounting: 'Accounting',
  qc:         'QC',
  audit:      'Sistem',
}

const moduleIconMap = {
  purchasing: 'fa-shopping-cart',
  import:     'fa-ship',
  gudang:     'fa-warehouse',
  sales:      'fa-chart-line',
  finance:    'fa-money-bill',
  accounting: 'fa-calculator',
  qc:         'fa-microscope',
  audit:      'fa-history',
}

const groupName = computed(() => moduleGroupMap[module] || '')

const allSubModules = computed(() =>
  MODULES.filter(m => m.group === groupName.value)
)

const accessibleSubModules = computed(() => {
  const perms = permStore.getPerms(auth.activeCompanyId)
  return allSubModules.value.filter(m => perms[m.id]?.[auth.currentUser.roleId])
})

const hasAccess = computed(() => accessibleSubModules.value.length > 0)

const tileColors = ['', 'blue', 'orange', 'red', 'purple']
const iconColors = ['#26B99A', '#1c84c6', '#f0ad4e', '#e74c3c', '#9B59B6']

const subModules = computed(() =>
  allSubModules.value.map((m, i) => ({
    label: m.name,
    icon: m.icon,
    count: Math.floor(Math.random() * 90 + 10),
    tileClass: tileColors[i % tileColors.length],
    iconColor: iconColors[i % iconColors.length],
  }))
)
</script>
