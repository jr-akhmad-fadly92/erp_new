<template>
  <div>
    <PageHeader title="Audit Log" :crumbs="[{ label: 'Sistem' }, { label: 'Audit Log' }]">
      <template #actions>
        <button class="btn-gen btn-outline btn-sm">
          <i class="fas fa-download"></i> Export CSV
        </button>
      </template>
    </PageHeader>

    <div class="tile-row">
      <StatTile :value="logs.length"  label="Total Log"   icon="fa-history"              color=""       icon-color="#26B99A" />
      <StatTile :value="todayCount"   label="Hari Ini"    icon="fa-calendar-day"          color="blue"   icon-color="#1c84c6" />
      <StatTile :value="warnCount"    label="Peringatan"  icon="fa-exclamation-triangle"  color="orange" icon-color="#f0ad4e" />
      <StatTile :value="errorCount"   label="Error"       icon="fa-times-circle"          color="red"    icon-color="#e74c3c" />
    </div>

    <PanelBox title="Riwayat Aktivitas" icon="fa-list">
      <div class="search-row">
        <input v-model="search"     class="search-input"  placeholder="Cari aktivitas / pengguna..." />
        <select v-model="filterType" class="search-select">
          <option value="">Semua Tipe</option>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
        </select>
      </div>
      <table class="table-gen">
        <thead>
          <tr>
            <th>Waktu</th><th>Pengguna</th><th>Aksi</th>
            <th>Modul</th><th>IP</th><th style="text-align:center">Tipe</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in filteredLogs" :key="log.id">
            <td style="color:#738A9C;font-size:11px;white-space:nowrap">{{ log.time }}</td>
            <td>
              <div class="flex-row gap-8">
                <div class="avatar" :style="{ background: log.color, width:'24px', height:'24px', fontSize:'9px' }">{{ log.initials }}</div>
                <span style="font-size:12px">{{ log.user }}</span>
              </div>
            </td>
            <td style="font-size:12px">{{ log.action }}</td>
            <td><span style="background:#eee;color:#555;font-size:10px;padding:2px 7px;border-radius:10px">{{ log.module }}</span></td>
            <td style="color:#aaa;font-size:11px;font-family:monospace">{{ log.ip }}</td>
            <td style="text-align:center">
              <span class="badge-gen" :class="badgeMap[log.type]">{{ log.type }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </PanelBox>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import PanelBox   from '@/components/common/PanelBox.vue'
import StatTile   from '@/components/common/StatTile.vue'

const search     = ref('')
const filterType = ref('')
const badgeMap   = { info: 'badge-teal', warning: 'badge-orange', error: 'badge-red' }

const now = new Date()
const fmt = (d) => d.toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })

const logs = ref([
  { id:1,  time: fmt(new Date(now-1*60000)),   user:'Ahmad Fauzi',     initials:'AF', color:'#8E44AD', action:'Login berhasil',                 module:'Sistem',     ip:'192.168.1.10', type:'info'    },
  { id:2,  time: fmt(new Date(now-5*60000)),   user:'Ahmad Fauzi',     initials:'AF', color:'#8E44AD', action:'Ubah hak akses role Purchasing',  module:'Permission', ip:'192.168.1.10', type:'warning' },
  { id:3,  time: fmt(new Date(now-12*60000)),  user:'Doni Prasetyo',   initials:'DP', color:'#27AE60', action:'Buat Purchase Order #PO-2024-089',module:'Purchasing', ip:'192.168.1.22', type:'info'    },
  { id:4,  time: fmt(new Date(now-18*60000)),  user:'Citra Dewi',      initials:'CD', color:'#1ABC9C', action:'Lihat Laporan Keuangan Q4',       module:'Finance',    ip:'192.168.1.15', type:'info'    },
  { id:5,  time: fmt(new Date(now-25*60000)),  user:'Krisna Putra',    initials:'KP', color:'#E74C3C', action:'Update stok barang #SKU-4421',    module:'Gudang',     ip:'192.168.1.31', type:'info'    },
  { id:6,  time: fmt(new Date(now-35*60000)),  user:'Eka Wijaya',      initials:'EW', color:'#C0392B', action:'Login gagal (salah password)',     module:'Sistem',     ip:'10.0.0.54',    type:'error'   },
  { id:7,  time: fmt(new Date(now-48*60000)),  user:'Hani Susanti',    initials:'HS', color:'#D35400', action:'Posting Jurnal #JRN-2024-441',    module:'Accounting', ip:'192.168.1.18', type:'info'    },
  { id:8,  time: fmt(new Date(now-60*60000)),  user:'Irwan Syah',      initials:'IS', color:'#F39C12', action:'Upload Dokumen Impor',             module:'Import',     ip:'192.168.1.25', type:'info'    },
  { id:9,  time: fmt(new Date(now-75*60000)),  user:'Julia Rahmah',    initials:'JR', color:'#7F8C8D', action:'Buat Invoice #INV-2024-221',      module:'Sales',      ip:'192.168.1.42', type:'info'    },
  { id:10, time: fmt(new Date(now-90*60000)),  user:'Ahmad Fauzi',     initials:'AF', color:'#8E44AD', action:'Tambah pengguna baru',             module:'Pengguna',   ip:'192.168.1.10', type:'warning' },
  { id:11, time: fmt(new Date(now-110*60000)), user:'Budi Santoso',    initials:'BS', color:'#2980B9', action:'Lihat Laporan Management',         module:'Dashboard',  ip:'192.168.1.11', type:'info'    },
  { id:12, time: fmt(new Date(now-130*60000)), user:'Gilang Rizky',    initials:'GR', color:'#2980B9', action:'Coba akses modul Finance (ditolak)',module:'Finance',   ip:'192.168.1.55', type:'error'   },
])

const todayCount  = computed(() => logs.value.length)
const warnCount   = computed(() => logs.value.filter(l => l.type === 'warning').length)
const errorCount  = computed(() => logs.value.filter(l => l.type === 'error').length)

const filteredLogs = computed(() => logs.value.filter(l => {
  if (search.value && !l.action.toLowerCase().includes(search.value.toLowerCase()) &&
      !l.user.toLowerCase().includes(search.value.toLowerCase())) return false
  if (filterType.value && l.type !== filterType.value) return false
  return true
}))
</script>
