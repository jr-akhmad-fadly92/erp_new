<template>
  <div>
    <div class="page-header-row">
      <div>
        <h1 class="page-title">Dashboard</h1>
        <p class="breadcrumb-nav">Home &rsaquo; <span>{{ auth.activeCompany?.name }}</span></p>
      </div>
    </div>

    <!-- Tiles -->
    <div class="tile-row">
      <div class="tile">
        <div class="tile-body">
          <div class="tile-value">{{ ROLES.length }}</div>
          <div class="tile-label">Total Role</div>
        </div>
        <i class="fas fa-user-shield tile-icon" style="color:#26B99A"></i>
      </div>
      <div class="tile blue">
        <div class="tile-body">
          <div class="tile-value">{{ totalUsers }}</div>
          <div class="tile-label">Total Pengguna</div>
        </div>
        <i class="fas fa-users tile-icon" style="color:#1c84c6"></i>
      </div>
      <div class="tile red">
        <div class="tile-body">
          <div class="tile-value">{{ companies.length }}</div>
          <div class="tile-label">Perusahaan</div>
        </div>
        <i class="fas fa-building tile-icon" style="color:#e74c3c"></i>
      </div>
      <div class="tile orange">
        <div class="tile-body">
          <div class="tile-value">{{ MODULES.length }}</div>
          <div class="tile-label">Total Modul</div>
        </div>
        <i class="fas fa-cubes tile-icon" style="color:#f0ad4e"></i>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px">
      <!-- Role distribution -->
      <div class="panel-gen">
        <div class="panel-gen-heading">
          <h3 class="panel-gen-title">
            <i class="fas fa-users-cog panel-icon"></i>
            Distribusi Role
            <span style="font-size:11px;color:#aaa;font-weight:400;margin-left:6px">{{ auth.activeCompany?.name }}</span>
          </h3>
        </div>
        <div class="panel-gen-body">
          <table class="table-gen">
            <thead>
              <tr>
                <th>Role</th>
                <th style="text-align:center">Pengguna</th>
                <th style="text-align:center">Modul Diakses</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in ROLES" :key="r.id">
                <td>
                  <span class="badge-gen" :style="{ background: r.color }">{{ r.name }}</span>
                </td>
                <td style="text-align:center">{{ userCountByRole(r.id) }}</td>
                <td style="text-align:center">{{ moduleCountByRole(r.id) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Module usage chart -->
      <div class="panel-gen">
        <div class="panel-gen-heading">
          <h3 class="panel-gen-title">
            <i class="fas fa-chart-bar panel-icon"></i>
            Akses per Modul Grup
          </h3>
        </div>
        <div class="panel-gen-body">
          <div v-for="(g, idx) in moduleGroups" :key="g.name" style="margin-bottom:12px">
            <div class="flex-between mb-0" style="margin-bottom:4px">
              <span style="font-size:12px;color:#555">{{ g.name }}</span>
              <span style="font-size:11px;color:#aaa">{{ g.pct }}%</span>
            </div>
            <div class="progress-gen">
              <div
                class="progress-bar-gen"
                :style="{ width: g.pct + '%', background: barColors[idx % barColors.length] }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Companies summary -->
    <div class="panel-gen">
      <div class="panel-gen-heading">
        <h3 class="panel-gen-title">
          <i class="fas fa-building panel-icon"></i>
          Ringkasan Perusahaan
        </h3>
        <router-link to="/perusahaan" class="btn-gen btn-outline btn-sm">
          Lihat Semua <i class="fas fa-arrow-right" style="font-size:10px"></i>
        </router-link>
      </div>
      <div class="panel-gen-body">
        <table class="table-gen">
          <thead>
            <tr>
              <th>Perusahaan</th>
              <th>Lokasi</th>
              <th>Bidang</th>
              <th style="text-align:center">Pengguna</th>
              <th style="text-align:center">Modul</th>
              <th style="text-align:center">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in companies" :key="c.id">
              <td>
                <div class="flex-row gap-8">
                  <div class="avatar" :style="{ background: c.color }">
                    {{ c.name.split(' ').map(w=>w[0]).join('').slice(0,2) }}
                  </div>
                  <span style="font-weight:600;color:#455464">{{ c.name }}</span>
                </div>
              </td>
              <td style="color:#738A9C">{{ c.kota }}</td>
              <td style="color:#738A9C">{{ c.bidang }}</td>
              <td style="text-align:center">{{ userStore.byCompany(c.id).length }}</td>
              <td style="text-align:center">{{ c.modules }}</td>
              <td style="text-align:center">
                <span class="status-badge" :class="c.status">{{ c.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ROLES, MODULES } from '@/data/constants'
import { useAuthStore, usePermissionStore, useUserStore, useCompanyStore } from '@/store'

const auth = useAuthStore()
const permStore = usePermissionStore()
const userStore = useUserStore()
const companyStore = useCompanyStore()
const companies = computed(() => companyStore.companies)

const totalUsers = computed(() => userStore.users.length)

const barColors = ['#26B99A','#1c84c6','#f0ad4e','#e74c3c','#9B59B6','#2C3E50','#16A085']

function userCountByRole(roleId) {
  return userStore.users.filter(u => u.roleId === roleId && u.companyId === auth.activeCompanyId).length
}

function moduleCountByRole(roleId) {
  const perms = permStore.getPerms(auth.activeCompanyId)
  return MODULES.filter(m => perms[m.id]?.[roleId]).length
}

const moduleGroups = computed(() => {
  const groups = [...new Set(MODULES.map(m => m.group))]
  return groups.map(g => {
    const mods = MODULES.filter(m => m.group === g)
    const perms = permStore.getPerms(auth.activeCompanyId)
    const totalSlots = mods.length * ROLES.length
    const enabled = mods.reduce((acc, m) => {
      return acc + ROLES.filter(r => perms[m.id]?.[r.id]).length
    }, 0)
    return { name: g, pct: Math.round((enabled / totalSlots) * 100) }
  }).sort((a, b) => b.pct - a.pct)
})
</script>
