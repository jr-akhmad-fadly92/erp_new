<template>
  <div>
    <PageHeader
      title="Gudang"
      :crumbs="[{ label: 'Modul ERP' }, { label: 'Gudang' }]"
    />

    <!-- Akses ditolak -->
    <div v-if="!hasAccess" class="panel-gen">
      <div class="panel-gen-body" style="text-align:center;padding:40px">
        <i class="fas fa-lock" style="font-size:40px;color:#e74c3c;margin-bottom:12px;display:block;opacity:.5"></i>
        <h3 style="color:#455464;font-size:16px;margin-bottom:6px">Akses Dibatasi</h3>
        <p style="color:#aaa;font-size:13px">
          Role <strong>{{ auth.currentRole?.name }}</strong> tidak memiliki hak akses ke modul ini.
        </p>
        <router-link to="/dashboard" class="btn-gen btn-teal" style="margin-top:14px;display:inline-flex">
          <i class="fas fa-home"></i> Kembali ke Dashboard
        </router-link>
      </div>
    </div>

    <template v-else>
      <!-- Tile ringkasan -->
      <div class="tile-row" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">
        <StatTile
          v-for="(sm, i) in subModuleStats" :key="sm.id"
          :value="sm.count"
          :label="sm.name"
          :icon="sm.icon"
          :color="tileColors[i % tileColors.length]"
          :icon-color="iconColors[i % iconColors.length]"
        />
      </div>

      <!-- Sub-modul yang dapat diakses -->
      <div style="display:grid;grid-template-columns:2fr 1fr;gap:18px">
        <PanelBox title="Data Gudang" icon="fa-warehouse">
          <template #actions>
            <button class="btn-gen btn-teal btn-sm">
              <i class="fas fa-plus"></i> Tambah Baru
            </button>
          </template>
          <div style="text-align:center;color:#aaa;padding:30px">
            <i class="fas fa-warehouse" style="font-size:36px;display:block;margin-bottom:10px;opacity:.2"></i>
            <p style="font-size:13px">Data modul <strong>Gudang</strong> akan ditampilkan di sini.</p>
            <p style="font-size:11px">Hubungkan dengan API backend untuk data nyata.</p>
          </div>
        </PanelBox>

        <PanelBox title="Hak Akses" icon="fa-shield-alt">
          <div v-for="sm in accessibleSubModules" :key="sm.id" class="flex-row gap-8" style="margin-bottom:10px">
            <i class="fas" :class="sm.icon" style="color:#26B99A;width:16px"></i>
            <span style="font-size:12px;color:#555;flex:1">{{ sm.name }}</span>
            <span style="background:#E8F8F5;color:#1a8a72;font-size:10px;padding:1px 7px;border-radius:10px">Aktif</span>
          </div>
          <div v-if="accessibleSubModules.length === 0" style="color:#aaa;font-size:12px">
            Tidak ada sub-modul aktif
          </div>
          <hr class="divider">
          <div style="font-size:11px;color:#aaa">
            <i class="fas fa-user" style="margin-right:5px"></i>
            Role: <strong style="color:#455464">{{ auth.currentRole?.name }}</strong>
          </div>
        </PanelBox>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { MODULES } from '@/data/constants'
import { useAuthStore, usePermissionStore } from '@/store'
import PageHeader from '@/components/common/PageHeader.vue'
import PanelBox   from '@/components/common/PanelBox.vue'
import StatTile   from '@/components/common/StatTile.vue'

const auth      = useAuthStore()
const permStore = usePermissionStore()

const moduleIds     = ['m09', 'm10', 'm11']
const tileColors    = ['', 'blue', 'orange', 'red', 'purple']
const iconColors    = ['#26B99A', '#1c84c6', '#f0ad4e', '#e74c3c', '#9B59B6']

const subModules    = computed(() => MODULES.filter(m => moduleIds.includes(m.id)))

const accessibleSubModules = computed(() => {
  const perms = permStore.getPerms(auth.activeCompanyId)
  return subModules.value.filter(m => perms[m.id]?.[auth.currentUser.roleId])
})

const hasAccess = computed(() => accessibleSubModules.value.length > 0)

const subModuleStats = computed(() =>
  subModules.value.map(m => ({
    ...m,
    count: Math.floor(Math.random() * 90 + 10),
  }))
)
</script>
