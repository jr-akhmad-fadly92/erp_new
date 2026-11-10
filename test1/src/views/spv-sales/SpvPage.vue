<template>
  <div>
    <PageHeader
      title="Supervisor Sales"
      :crumbs="[{ label: 'Modul ERP' }, { label: 'Supervisor Sales' }]"
    >
      <template #actions>
        <button class="btn-gen btn-teal" @click="openAdd">
          <i class="fas fa-user-plus"></i> Tambah Supervisor
        </button>
      </template>
    </PageHeader>

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
      <!-- Ringkasan Statistik -->
      <div class="tile-row" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr))">
        <StatTile
          value="4"
          label="Total Supervisor"
          icon="fa-users"
          color="#26B99A"
          icon-color="#1ABC9C"
        />
        <StatTile
          value="3"
          label="Status Aktif"
          icon="fa-check-circle"
          color="#27AE60"
          icon-color="#16A085"
        />
        <StatTile
          :value="formatCurrency(totalTarget)"
          label="Total Target"
          icon="fa-bullseye"
          color="#2980B9"
          icon-color="#1c84c6"
        />
        <StatTile
          :value="formatCurrency(totalAchieved)"
          label="Total Tercapai"
          icon="fa-chart-line"
          color="#F39C12"
          icon-color="#E67E22"
        />
      </div>

      <!-- Data Supervisor -->
      <PanelBox title="Daftar Supervisor Sales" icon="fa-users" :badge="filtered.length">
        <!-- Filters -->
        <div class="search-row">
          <input v-model="search" class="search-input" placeholder="Cari nama / nomor HP..." />
          <select v-model="filterCompany" class="search-select">
            <option value="">Semua Perusahaan</option>
            <option v-for="c in companies" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
          <select v-model="filterStatus" class="search-select">
            <option value="">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
          </select>
        </div>

        <table class="table-gen">
          <thead>
            <tr>
              <th>Nama</th><th>No. HP</th><th>Perusahaan</th>
              <th style="text-align:right">Target</th><th style="text-align:right">Tercapai</th>
              <th style="text-align:center">Status</th><th style="text-align:center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filtered.length === 0">
              <td colspan="7" style="text-align:center;color:#aaa;padding:30px">
                <i class="fas fa-search" style="font-size:24px;display:block;margin-bottom:8px;opacity:.3"></i>
                Tidak ada data yang sesuai
              </td>
            </tr>
            <tr v-for="sp in filtered" :key="sp.id">
              <td style="font-weight:600;color:#455464">{{ sp.name }}</td>
              <td style="color:#738A9C">{{ sp.phone }}</td>
              <td style="color:#738A9C">{{ companyById(sp.companyId)?.name }}</td>
              <td style="text-align:right;color:#738A9C">{{ formatCurrency(sp.target) }}</td>
              <td style="text-align:right;color:#738A9C">{{ formatCurrency(sp.achieved) }}</td>
              <td style="text-align:center">
                <span class="status-badge" :class="sp.status">{{ sp.status }}</span>
              </td>
              <td style="text-align:center">
                <div class="flex-row gap-6" style="justify-content:center">
                  <button class="btn-gen btn-outline btn-xs" title="Edit" @click="openEdit(sp)">
                    <i class="fas fa-edit" style="color:#1c84c6"></i>
                  </button>
                  <button class="btn-gen btn-outline btn-xs" title="Toggle Status" @click="toggleStatus(sp)">
                    <i class="fas fa-power-off" :style="{ color: sp.status==='aktif' ? '#27AE60' : '#e74c3c' }"></i>
                  </button>
                  <button class="btn-gen btn-outline btn-xs" title="Hapus" @click="remove(sp)">
                    <i class="fas fa-trash" style="color:#e74c3c"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </PanelBox>
    </template>

    <!-- Modal form -->
    <AppModal v-model="showModal" :title="editId ? 'Edit Supervisor Sales' : 'Tambah Supervisor Sales'" icon="fa-user-tie" width="560px">
      <div class="form-group-gen">
        <label class="form-label">Nama <span style="color:#e74c3c">*</span></label>
        <input v-model="form.name" class="form-control-gen" :class="{ error: errors.name }" placeholder="Nama Supervisor" />
        <div v-if="errors.name" class="form-error">{{ errors.name }}</div>
      </div>
      <div class="form-group-gen">
        <label class="form-label">No. HP <span style="color:#e74c3c">*</span></label>
        <input v-model="form.phone" class="form-control-gen" :class="{ error: errors.phone }" placeholder="08XX-XXXX-XXXX" />
        <div v-if="errors.phone" class="form-error">{{ errors.phone }}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group-gen">
          <label class="form-label">Target (Rp) <span style="color:#e74c3c">*</span></label>
          <input v-model="form.target" type="number" class="form-control-gen" :class="{ error: errors.target }" placeholder="0" />
          <div v-if="errors.target" class="form-error">{{ errors.target }}</div>
        </div>
        <div class="form-group-gen">
          <label class="form-label">Tercapai (Rp) <span style="color:#e74c3c">*</span></label>
          <input v-model="form.achieved" type="number" class="form-control-gen" :class="{ error: errors.achieved }" placeholder="0" />
          <div v-if="errors.achieved" class="form-error">{{ errors.achieved }}</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group-gen">
          <label class="form-label">Perusahaan <span style="color:#e74c3c">*</span></label>
          <select v-model="form.companyId" class="form-control-gen">
            <option v-for="c in companies" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
        <div class="form-group-gen">
          <label class="form-label">Status</label>
          <select v-model="form.status" class="form-control-gen">
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
          </select>
        </div>
      </div>

      <!-- Progress bar -->
      <div v-if="form.target > 0" style="background:#F8F9FA;border-radius:3px;padding:12px;margin-top:12px">
        <div style="font-size:11px;font-weight:600;color:#455464;margin-bottom:7px">
          <i class="fas fa-chart-pie" style="color:#F39C12;margin-right:5px"></i>
          Realisasi: {{ formatPercentage(form.achieved / form.target) }}%
        </div>
        <div style="background:#E0E0E0;height:6px;border-radius:3px;overflow:hidden">
          <div :style="{ width: formatPercentage(form.achieved / form.target) + '%', background: calculateProgressColor(form.achieved / form.target), height: '100%' }"></div>
        </div>
      </div>

      <template #footer>
        <button class="btn-gen btn-outline" @click="showModal = false">Batal</button>
        <button class="btn-gen btn-teal" @click="saveSupervisor">
          <i class="fas fa-save"></i> Simpan
        </button>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { useAuthStore, useSpvSalesStore, useCompanyStore, usePermissionStore } from '@/store'
import PageHeader from '@/components/common/PageHeader.vue'
import PanelBox   from '@/components/common/PanelBox.vue'
import AppModal   from '@/components/common/AppModal.vue'
import StatTile   from '@/components/common/StatTile.vue'

const auth         = useAuthStore()
const spvStore     = useSpvSalesStore()
const companyStore = useCompanyStore()
const permStore    = usePermissionStore()
const showToast    = inject('showToast')

const companies = computed(() => companyStore.companies)

// Check module access
const hasAccess = computed(() => {
  const perms = permStore.getPerms(auth.activeCompanyId)
  return perms['m12']?.[auth.currentUser.roleId] || auth.isSuperAdmin
})

// Filters
const search        = ref('')
const filterCompany = ref('')
const filterStatus  = ref('')

const filtered = computed(() => spvStore.spvSales.filter(sp => {
  if (search.value && !sp.name.toLowerCase().includes(search.value.toLowerCase()) &&
      !sp.phone.toLowerCase().includes(search.value.toLowerCase())) return false
  if (filterCompany.value && sp.companyId !== Number(filterCompany.value)) return false
  if (filterStatus.value  && sp.status !== filterStatus.value) return false
  return true
}))

// Statistics
const totalTarget = computed(() => spvStore.spvSales.reduce((sum, sp) => sum + (sp.target || 0), 0))
const totalAchieved = computed(() => spvStore.spvSales.reduce((sum, sp) => sum + (sp.achieved || 0), 0))

function companyById(id) { return companies.value.find(c => c.id === id) }
function formatCurrency(val) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val || 0).replace('IDR', 'Rp').trim()
}
function formatPercentage(val) { return Math.round((val || 0) * 100) }
function calculateProgressColor(ratio) {
  if (ratio >= 0.9) return '#27AE60'
  if (ratio >= 0.7) return '#F39C12'
  return '#e74c3c'
}

// Modal
const showModal = ref(false)
const editId    = ref(null)
const form      = ref({ name: '', phone: '', target: 0, achieved: 0, companyId: 1, status: 'aktif' })
const errors    = ref({})

function openAdd() {
  editId.value = null
  form.value   = { name: '', phone: '', target: 0, achieved: 0, companyId: auth.activeCompanyId, status: 'aktif' }
  errors.value = {}
  showModal.value = true
}
function openEdit(sp) {
  editId.value = sp.id
  form.value   = { ...sp }
  errors.value = {}
  showModal.value = true
}
function validate() {
  errors.value = {}
  if (!form.value.name.trim())  errors.value.name  = 'Nama wajib diisi'
  if (!form.value.phone.trim()) errors.value.phone = 'No. HP wajib diisi'
  if (form.value.target < 0)    errors.value.target = 'Target tidak boleh negatif'
  if (form.value.achieved < 0)  errors.value.achieved = 'Tercapai tidak boleh negatif'
  return Object.keys(errors.value).length === 0
}
function saveSupervisor() {
  if (!validate()) return
  if (editId.value) {
    spvStore.update(editId.value, form.value)
    showToast('Supervisor berhasil diperbarui')
  } else {
    spvStore.add({ ...form.value })
    showToast('Supervisor berhasil ditambahkan')
  }
  showModal.value = false
}
function toggleStatus(sp) {
  spvStore.toggleStatus(sp.id)
  showToast(sp.status === 'aktif' ? 'Status dinonaktifkan' : 'Status diaktifkan', 'warning')
}
function remove(sp) {
  if (confirm(`Hapus supervisor ${sp.name}?`)) {
    spvStore.remove(sp.id)
    showToast('Supervisor dihapus', 'warning')
  }
}
</script>
