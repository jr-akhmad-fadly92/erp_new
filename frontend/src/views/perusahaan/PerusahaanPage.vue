<template>
  <div>
    <PageHeader title="Manajemen Perusahaan" :crumbs="[{ label: 'Perusahaan' }]">
      <template #actions>
        <button class="btn-gen btn-teal" @click="openAdd">
          <i class="fas fa-plus"></i> Tambah Perusahaan
        </button>
      </template>
    </PageHeader>

    <!-- Cards -->
    <div class="company-grid mb-20">
      <div
        v-for="c in companies" :key="c.id"
        class="company-card"
        :class="{ selected: selectedId === c.id }"
        @click="selectedId = c.id"
      >
        <div class="flex-between mb-12">
          <div class="flex-row gap-8">
            <div class="avatar" :style="{ background: c.color, width:'36px', height:'36px', fontSize:'13px' }">
              {{ c.name.split(' ').map(w=>w[0]).join('').slice(0,2) }}
            </div>
            <div>
              <h5>{{ c.name }}</h5>
              <p class="company-sub">{{ c.kota }} &bull; {{ c.bidang }}</p>
            </div>
          </div>
          <span class="status-badge" :class="c.status">{{ c.status }}</span>
        </div>
        <hr class="divider">
        <div class="flex-between">
          <div>
            <p class="company-stat-val green">{{ userStore.byCompany(c.id).length }}</p>
            <div class="text-muted-gen">Pengguna</div>
          </div>
          <div style="text-align:right">
            <p class="company-stat-val blue">{{ c.modules }}</p>
            <div class="text-muted-gen">Modul</div>
          </div>
        </div>
        <!-- Quick actions -->
        <div class="flex-row gap-6" style="margin-top:10px" @click.stop>
          <button class="btn-gen btn-outline btn-xs" @click="openEdit(c)">
            <i class="fas fa-edit" style="color:#1c84c6"></i> Edit
          </button>
          <button class="btn-gen btn-outline btn-xs" @click="openDeleteConfirm(c)">
            <i class="fas fa-trash" style="color:#e74c3c"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Detail panel -->
    <template v-if="selected">
      <PanelBox :title="`Detail: ${selected.name}`" icon="fa-info-circle">
        <template #actions>
          <router-link to="/permission" class="btn-gen btn-blue btn-sm">
            <i class="fas fa-shield-alt"></i> Hak Akses
          </router-link>
          <router-link to="/users" class="btn-gen btn-outline btn-sm">
            <i class="fas fa-users"></i> Pengguna
          </router-link>
        </template>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
          <!-- Info detail -->
          <div>
            <h4 class="section-sub-title">Informasi Perusahaan</h4>
            <table class="info-table">
              <tr><td>Nama</td><td>{{ selected.name }}</td></tr>
              <tr><td>Kota</td><td>{{ selected.kota }}</td></tr>
              <tr><td>Bidang</td><td>{{ selected.bidang }}</td></tr>
              <tr><td>Alamat</td><td>{{ selected.alamat || '-' }}</td></tr>
              <tr><td>Telepon</td><td>{{ selected.telepon || '-' }}</td></tr>
              <tr><td>NPWP</td><td>{{ selected.npwp || '-' }}</td></tr>
              <tr><td>Status</td>
                <td><span class="status-badge" :class="selected.status">{{ selected.status }}</span></td>
              </tr>
            </table>
          </div>
          <!-- Role chart -->
          <div>
            <h4 class="section-sub-title">Distribusi Pengguna</h4>
            <div v-if="topRoles.length === 0" style="color:#aaa;font-size:12px">Belum ada pengguna</div>
            <div v-for="r in topRoles" :key="r.id" style="margin-bottom:9px">
              <div class="flex-between" style="margin-bottom:3px">
                <span style="font-size:11px;color:#555">{{ r.name }}</span>
                <span style="font-size:11px;color:#aaa">{{ r.count }} orang</span>
              </div>
              <div class="progress-gen">
                <div class="progress-bar-gen" :style="{ width:(r.count/maxCount*100)+'%', background: r.color }"></div>
              </div>
            </div>
          </div>
        </div>
      </PanelBox>
    </template>

    <!-- ── MODAL: Tambah / Edit Perusahaan ── -->
    <AppModal v-model="showModal" :title="editData ? 'Edit Perusahaan' : 'Tambah Perusahaan'" icon="fa-building" width="560px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group-gen" style="grid-column:1/-1">
          <label class="form-label">Nama Perusahaan <span style="color:#e74c3c">*</span></label>
          <input v-model="form.name" class="form-control-gen" :class="{ error: errors.name }"
            placeholder="PT / CV ..." />
          <div v-if="errors.name" class="form-error">{{ errors.name }}</div>
        </div>
        <div class="form-group-gen">
          <label class="form-label">Kota <span style="color:#e74c3c">*</span></label>
          <input v-model="form.kota" class="form-control-gen" :class="{ error: errors.kota }" placeholder="Jakarta" />
          <div v-if="errors.kota" class="form-error">{{ errors.kota }}</div>
        </div>
        <div class="form-group-gen">
          <label class="form-label">Bidang Usaha</label>
          <input v-model="form.bidang" class="form-control-gen" placeholder="Manufacturing" />
        </div>
        <div class="form-group-gen" style="grid-column:1/-1">
          <label class="form-label">Alamat</label>
          <input v-model="form.alamat" class="form-control-gen" placeholder="Jl. ..." />
        </div>
        <div class="form-group-gen">
          <label class="form-label">Telepon</label>
          <input v-model="form.telepon" class="form-control-gen" placeholder="021-xxxxxxxx" />
        </div>
        <div class="form-group-gen">
          <label class="form-label">NPWP</label>
          <input v-model="form.npwp" class="form-control-gen" placeholder="xx.xxx.xxx.x-xxx.xxx" />
        </div>
        <div class="form-group-gen">
          <label class="form-label">Status</label>
          <select v-model="form.status" class="form-control-gen">
            <option value="aktif">Aktif</option>
            <option value="trial">Trial</option>
            <option value="nonaktif">Nonaktif</option>
          </select>
        </div>
        <div class="form-group-gen">
          <label class="form-label">Warna Identitas</label>
          <div class="flex-row gap-8">
            <input v-model="form.color" type="color" style="width:44px;height:34px;border:1px solid #ddd;border-radius:3px;padding:2px;cursor:pointer" />
            <input v-model="form.color" class="form-control-gen" placeholder="#26B99A" style="flex:1" />
          </div>
        </div>
      </div>
      <template #footer>
        <button class="btn-gen btn-outline" @click="showModal=false">Batal</button>
        <button class="btn-gen btn-teal" @click="save">
          <i class="fas fa-save"></i> Simpan
        </button>
      </template>
    </AppModal>

    <!-- ── MODAL: Konfirmasi Hapus ── -->
    <AppModal v-model="showDeleteModal" title="Konfirmasi Hapus" icon="fa-trash" width="400px">
      <div style="text-align:center;padding:10px 0">
        <i class="fas fa-exclamation-triangle" style="font-size:36px;color:#e74c3c;margin-bottom:12px;display:block"></i>
        <p style="font-size:13px;color:#455464;margin-bottom:6px">
          Hapus perusahaan <strong>{{ deleteTarget?.name }}</strong>?
        </p>
        <p style="font-size:11px;color:#aaa">
          Terdapat <strong>{{ userStore.byCompany(deleteTarget?.id||0).length }}</strong> pengguna terdaftar.
          Data pengguna tidak akan ikut terhapus.
        </p>
      </div>
      <template #footer>
        <button class="btn-gen btn-outline" @click="showDeleteModal=false">Batal</button>
        <button class="btn-gen btn-red" @click="confirmDelete">
          <i class="fas fa-trash"></i> Ya, Hapus
        </button>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { ROLES } from '@/data/constants'
import { useUserStore, useCompanyStore } from '@/store'
import { CompanyService } from '@/api'
import PageHeader from '@/components/common/PageHeader.vue'
import PanelBox   from '@/components/common/PanelBox.vue'
import AppModal   from '@/components/common/AppModal.vue'

const userStore    = useUserStore()
const companyStore = useCompanyStore()
const showToast    = inject('showToast')

const companies  = computed(() => companyStore.companies)
const selectedId = ref(companies.value[0]?.id)
const selected   = computed(() => companies.value.find(c => c.id === selectedId.value))

const topRoles = computed(() => {
  if (!selectedId.value) return []
  return ROLES
    .map(r => ({ ...r, count: userStore.users.filter(u=>u.roleId===r.id && u.companyId===selectedId.value).length }))
    .filter(r => r.count > 0).sort((a,b)=>b.count-a.count).slice(0,7)
})
const maxCount = computed(() => Math.max(...topRoles.value.map(r=>r.count), 1))

// ── Modal: Tambah / Edit ─────────────────────────────────────
const showModal  = ref(false)
const editData   = ref(null)
const errors     = ref({})
const form       = ref(defaultForm())

function defaultForm() {
  return { name:'', kota:'', bidang:'', alamat:'', telepon:'', npwp:'', status:'aktif', color:'#26B99A' }
}
function openAdd() {
  editData.value = null
  form.value     = defaultForm()
  errors.value   = {}
  showModal.value = true
}
function openEdit(c) {
  editData.value = c
  form.value     = { name:c.name, kota:c.kota, bidang:c.bidang, alamat:c.alamat||'', telepon:c.telepon||'', npwp:c.npwp||'', status:c.status, color:c.color||'#26B99A' }
  errors.value   = {}
  showModal.value = true
}
function validate() {
  const e = {}
  if (!form.value.name.trim()) e.name = 'Nama perusahaan wajib diisi'
  if (!form.value.kota.trim()) e.kota = 'Kota wajib diisi'
  errors.value = e
  return Object.keys(e).length === 0
}
async function save() {
  if (!validate()) return
  const payload = { ...form.value }

  // API call — uncomment saat backend tersedia:
  // const { data, error } = editData.value
  //   ? await CompanyService.update(editData.value.id, payload)
  //   : await CompanyService.create(payload)
  // if (error) { showToast(error, 'error'); return }

  if (editData.value) {
    companyStore.update(editData.value.id, payload)
    showToast('Perusahaan berhasil diperbarui')
  } else {
    companyStore.add({ ...payload, modules: 0 })
    showToast('Perusahaan berhasil ditambahkan')
  }
  showModal.value = false
}

// ── Modal: Hapus ──────────────────────────────────────────────
const showDeleteModal = ref(false)
const deleteTarget    = ref(null)

function openDeleteConfirm(c) {
  deleteTarget.value    = c
  showDeleteModal.value = true
}
async function confirmDelete() {
  // await CompanyService.delete(deleteTarget.value.id)
  companyStore.companies.splice(
    companyStore.companies.findIndex(c=>c.id===deleteTarget.value.id), 1
  )
  if (selectedId.value === deleteTarget.value.id) {
    selectedId.value = companies.value[0]?.id || null
  }
  showDeleteModal.value = false
  showToast('Perusahaan dihapus', 'warning')
}
</script>

<style scoped>
.section-sub-title {
  font-size: 13px; color: #455464; margin-bottom: 12px; font-weight: 600;
}
.info-table { width: 100%; font-size: 12.5px; }
.info-table td { padding: 5px 0; vertical-align: top; }
.info-table td:first-child { color: #aaa; width: 90px; }
.info-table td:last-child  { color: #455464; font-weight: 500; }
.gap-6 { gap: 6px; }
</style>
