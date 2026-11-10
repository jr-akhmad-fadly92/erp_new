<template>
  <div>
    <PageHeader
      title="Dashboard"
      :crumbs="[{ label: auth.activeCompany?.name }]"
    />

    <!-- Stat Tiles -->
    <div class="tile-row">
      <StatTile :value="ROLES.length"    label="Total Role"     icon="fa-user-shield" color=""       icon-color="#26B99A" />
      <StatTile :value="totalUsers"       label="Total Pengguna" icon="fa-users"        color="blue"   icon-color="#1c84c6" />
      <StatTile :value="companies.length" label="Perusahaan"     icon="fa-building"     color="red"    icon-color="#e74c3c" />
      <StatTile :value="MODULES.length"  label="Total Modul"    icon="fa-cubes"        color="orange" icon-color="#f0ad4e" />
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px">
      <!-- Role distribution -->
      <PanelBox title="Distribusi Role" icon="fa-users-cog">
        <template #actions>
          <span style="font-size:11px;color:#aaa">{{ auth.activeCompany?.name }}</span>
        </template>
        <table class="table-gen">
          <thead>
            <tr>
              <th>Role</th>
              <th style="text-align:center">Pengguna</th>
              <th style="text-align:center">Modul</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in ROLES" :key="r.id">
              <td>
                <span class="badge-gen" :style="{ background: r.color }">{{ r.name }}</span>
              </td>
              <td style="text-align:center;color:#455464">{{ userCountByRole(r.id) }}</td>
              <td style="text-align:center;color:#455464">{{ moduleCountByRole(r.id) }}</td>
            </tr>
          </tbody>
        </table>
      </PanelBox>

      <!-- Module usage bars -->
      <PanelBox title="Akses per Grup Modul" icon="fa-chart-bar">
        <div v-for="(g, i) in moduleGroupStats" :key="g.name" style="margin-bottom:13px">
          <div class="flex-between" style="margin-bottom:4px">
            <span style="font-size:12px;color:#555">{{ g.name }}</span>
            <span style="font-size:11px;color:#aaa">{{ g.pct }}%</span>
          </div>
          <div class="progress-gen">
            <div class="progress-bar-gen" :style="{ width: g.pct + '%', background: barColors[i % barColors.length] }"></div>
          </div>
        </div>
      </PanelBox>
    </div>

    <!-- Companies table -->
    <PanelBox title="Ringkasan Perusahaan" icon="fa-building">
      <template #actions>
        <router-link to="/perusahaan" class="btn-gen btn-outline btn-sm">
          Lihat Semua <i class="fas fa-arrow-right" style="font-size:10px"></i>
        </router-link>
      </template>
      <table class="table-gen">
        <thead>
          <tr>
            <th>Perusahaan</th><th>Lokasi</th><th>Bidang</th>
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
    </PanelBox>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ROLES, MODULES } from '@/data/constants'
import { useAuthStore, usePermissionStore, useUserStore, useCompanyStore } from '@/store'
import PageHeader from '@/components/common/PageHeader.vue'
import PanelBox   from '@/components/common/PanelBox.vue'
import StatTile   from '@/components/common/StatTile.vue'

const auth        = useAuthStore()
const permStore   = usePermissionStore()
const userStore   = useUserStore()
const companyStore = useCompanyStore()

const companies  = computed(() => companyStore.companies)
const totalUsers = computed(() => userStore.users.length)
const barColors  = ['#26B99A','#1c84c6','#f0ad4e','#e74c3c','#9B59B6','#2C3E50','#16A085']

function userCountByRole(roleId) {
  return userStore.users.filter(u => u.roleId === roleId && u.companyId === auth.activeCompanyId).length
}
function moduleCountByRole(roleId) {
  const perms = permStore.getPerms(auth.activeCompanyId)
  return MODULES.filter(m => perms[m.id]?.[roleId]).length
}

const moduleGroupStats = computed(() => {
  const groups = [...new Set(MODULES.map(m => m.group))]
  const perms  = permStore.getPerms(auth.activeCompanyId)
  return groups.map(g => {
    const mods = MODULES.filter(m => m.group === g)
    const total = mods.length * ROLES.length
    const enabled = mods.reduce((acc, m) =>
      acc + ROLES.filter(r => perms[m.id]?.[r.id]).length, 0)
    return { name: g, pct: Math.round(enabled / total * 100) }
  }).sort((a, b) => b.pct - a.pct)
})
</script>
