<template>
  <div>
    <div class="page-header-row">
      <div>
        <h1 class="page-title">Hak Akses Modul per Role</h1>
        <p class="breadcrumb-nav">Home &rsaquo; Manajemen Akses &rsaquo; <span>Hak Akses Modul</span></p>
      </div>
      <div class="flex-row gap-8">
        <button class="btn-gen btn-outline btn-sm" @click="resetAll">
          <i class="fas fa-undo" style="color:#e74c3c"></i> Reset Default
        </button>
        <button v-if="permStore.hasChanges" class="btn-gen btn-teal" @click="save">
          <i class="fas fa-save"></i> Simpan Perubahan
        </button>
      </div>
    </div>

    <div class="panel-gen">
      <div class="panel-gen-heading">
        <h3 class="panel-gen-title">
          <i class="fas fa-table panel-icon"></i>
          Matriks Izin &mdash;
          <span style="color:#26B99A;font-size:13px;font-weight:400;margin-left:4px">{{ auth.activeCompany?.name }}</span>
        </h3>
      </div>
      <div class="panel-gen-body">
        <!-- Role group filter -->
        <div class="role-filter-tabs">
          <button
            v-for="g in roleGroups"
            :key="g.key"
            class="role-tab"
            :class="{ active: activeGroup === g.key }"
            @click="activeGroup = g.key"
          >{{ g.label }}</button>
        </div>

        <!-- Legend -->
        <div class="flex-row gap-12" style="margin-bottom:14px;flex-wrap:wrap">
          <span style="font-size:11px;color:#aaa"><span style="color:#26B99A;font-weight:700">●</span> Diizinkan</span>
          <span style="font-size:11px;color:#aaa"><span style="color:#ccc;font-weight:700">●</span> Tidak Diizinkan</span>
          <span style="font-size:11px;color:#aaa"><i class="fas fa-lock" style="color:#aaa;font-size:10px"></i> Terkunci (tidak bisa diubah)</span>
        </div>

        <div class="perm-matrix-wrap">
          <table class="perm-matrix">
            <thead>
              <tr>
                <th class="module-col">Modul / Fitur</th>
                <th v-for="r in visibleRoles" :key="r.id" style="min-width:64px">
                  <div style="font-size:9px;line-height:1.3;max-width:60px;margin:0 auto">{{ r.name }}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(group, gi) in groupedModules" :key="gi">
                <tr class="group-row">
                  <td :colspan="visibleRoles.length + 1">
                    <i :class="groupIcons[group.name]" style="margin-right:5px"></i>{{ group.name }}
                  </td>
                </tr>
                <tr v-for="m in group.modules" :key="m.id">
                  <td>
                    <div class="module-cell">
                      <i class="fas" :class="m.icon"></i>
                      {{ m.name }}
                    </div>
                  </td>
                  <td v-for="r in visibleRoles" :key="r.id">
                    <div style="display:flex;justify-content:center">
                      <label class="toggle-switch">
                        <input
                          type="checkbox"
                          :checked="getperm(m.id, r.id)"
                          :disabled="r.id <= 2"
                          @change="toggle(m.id, r.id, $event.target.checked)"
                        />
                        <span class="toggle-slider"></span>
                      </label>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Save bar -->
    <div v-if="permStore.hasChanges" class="save-bar" :class="{ collapsed: sidebarCollapsed }">
      <i class="fas fa-exclamation-circle" style="color:#f0ad4e"></i>
      <span>Ada perubahan hak akses yang belum disimpan.</span>
      <button class="btn-gen btn-teal" @click="save">
        <i class="fas fa-save"></i> Simpan Sekarang
      </button>
      <button class="btn-gen btn-outline" @click="permStore.reset(auth.activeCompanyId)">Batal</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { ROLES, MODULES } from '@/data/constants'
import { useAuthStore, usePermissionStore } from '@/store'

const auth = useAuthStore()
const permStore = usePermissionStore()
const showToast = inject('showToast')
const sidebarCollapsed = inject('sidebarCollapsed')

const roleGroups = [
  { key: 'all',         label: 'Semua Role' },
  { key: 'pimpinan',    label: 'Pimpinan' },
  { key: 'procurement', label: 'Procurement' },
  { key: 'gudang',      label: 'Gudang' },
  { key: 'sales',       label: 'Sales' },
  { key: 'keuangan',    label: 'Keuangan' },
  { key: 'operasional', label: 'Operasional' },
]

const groupRoleMap = {
  all:         ROLES.map(r => r.id),
  pimpinan:    [1, 2],
  procurement: [1, 2, 3, 4],
  gudang:      [1, 2, 5, 6],
  sales:       [1, 2, 7, 8, 9],
  keuangan:    [1, 2, 10, 11],
  operasional: [1, 2, 12],
}

const activeGroup = ref('all')

const visibleRoles = computed(() =>
  ROLES.filter(r => groupRoleMap[activeGroup.value].includes(r.id))
)

const groupIcons = {
  Umum: 'fas fa-home',
  Purchasing: 'fas fa-shopping-cart',
  Import: 'fas fa-ship',
  Gudang: 'fas fa-warehouse',
  Sales: 'fas fa-chart-line',
  Finance: 'fas fa-money-bill',
  Accounting: 'fas fa-calculator',
  QC: 'fas fa-microscope',
  Sistem: 'fas fa-cog',
}

const groupedModules = computed(() => {
  const groups = []
  const seen = []
  for (const m of MODULES) {
    if (!seen.includes(m.group)) {
      seen.push(m.group)
      groups.push({ name: m.group, modules: [] })
    }
    groups.find(g => g.name === m.group).modules.push(m)
  }
  return groups
})

function getperm(moduleId, roleId) {
  return permStore.getPerms(auth.activeCompanyId)[moduleId]?.[roleId] ?? false
}

function toggle(moduleId, roleId, value) {
  permStore.toggle(auth.activeCompanyId, moduleId, roleId, value)
}

function save() {
  permStore.save()
  showToast('Hak akses berhasil disimpan')
}

function resetAll() {
  permStore.reset(auth.activeCompanyId)
  showToast('Hak akses direset ke default', 'warning')
}
</script>
