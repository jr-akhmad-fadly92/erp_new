<template>
  <div>
    <PageHeader title="Manajemen Perusahaan" :crumbs="[{ label: 'Perusahaan' }]">
      <template #actions>
        <button class="btn-gen btn-teal" @click="openAdd">
          <i class="fas fa-plus"></i> Tambah Perusahaan
        </button>
      </template>
    </PageHeader>

    <!-- Company cards -->
    <div class="company-grid mb-20">
      <div
        v-for="c in companies" :key="c.id"
        class="company-card"
        :class="{ selected: selectedId === c.id }"
        @click="selectedId = c.id"
      >
        <div class="flex-between mb-12">
          <div>
            <h5>{{ c.name }}</h5>
            <p class="company-sub">{{ c.kota }} &bull; {{ c.bidang }}</p>
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
      </div>
    </div>

    <!-- Detail panel -->
    <template v-if="selected">
      <PanelBox :title="`Detail: ${selected.name}`" icon="fa-info-circle">
        <template #actions>
          <router-link to="/permission" class="btn-gen btn-blue btn-sm">
            <i class="fas fa-shield-alt"></i> Kelola Hak Akses
          </router-link>
          <router-link to="/users" class="btn-gen btn-outline btn-sm">
            <i class="fas fa-users"></i> Lihat Pengguna
          </router-link>
          <button class="btn-gen btn-outline btn-sm" @click="openEdit(selected)">
            <i class="fas fa-edit" style="color:#1c84c6"></i> Edit
          </button>
        </template>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
          <!-- Info -->
          <div>
            <h4 style="font-size:13px;color:#455464;margin-bottom:12px;font-weight:600">Informasi</h4>
            <table style="width:100%;font-size:12.5px">
              <tr><td style="color:#aaa;padding:5px 0;width:120px">Nama</td><td style="font-weight:500">{{ selected.name }}</td></tr>
              <tr><td style="color:#aaa;padding:5px 0">Kota</td><td>{{ selected.kota }}</td></tr>
              <tr><td style="color:#aaa;padding:5px 0">Bidang</td><td>{{ selected.bidang }}</td></tr>
              <tr><td style="color:#aaa;padding:5px 0">Status</td>
                <td><span class="status-badge" :class="selected.status">{{ selected.status }}</span></td>
              </tr>
              <tr><td style="color:#aaa;padding:5px 0">Total User</td>
                <td style="color:#26B99A;font-weight:600">{{ userStore.byCompany(selected.id).length }} pengguna</td>
              </tr>
            </table>
          </div>
          <!-- Role chart -->
          <div>
            <h4 style="font-size:13px;color:#455464;margin-bottom:12px;font-weight:600">Pengguna per Role</h4>
            <div v-if="topRoles.length === 0" style="color:#aaa;font-size:12px">Belum ada pengguna</div>
            <div v-for="r in topRoles" :key="r.id" style="margin-bottom:9px">
              <div class="flex-between" style="margin-bottom:3px">
                <span style="font-size:11px;color:#555">{{ r.name }}</span>
                <span style="font-size:11px;color:#aaa">{{ r.count }} orang</span>
              </div>
              <div class="progress-gen">
                <div class="progress-bar-gen" :style="{ width: (r.count / maxCount * 100) + '%', background: r.color }"></div>
              </div>
            </div>
          </div>
        </div>
      </PanelBox>
    </template>

    <!-- Modal -->
    <AppModal v-model="showModal" :title="editData ? 'Edit Perusahaan' : 'Tambah Perusahaan'" icon="fa-building">
      <div class="form-group-gen">
        <label class="form-label">Nama Perusahaan <span style="color:#e74c3c">*</span></label>
        <input v-model="form.name" class="form-control-gen" :class="{ error: errors.name }" placeholder="PT / CV ..." />
        <div v-if="errors.name" class="form-error">{{ errors.name }}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group-gen">
          <label class="form-label">Kota</label>
          <input v-model="form.kota" class="form-control-gen" placeholder="Jakarta" />
        </div>
        <div class="form-group-gen">
          <label class="form-label">Bidang Usaha</label>
          <input v-model="form.bidang" class="form-control-gen" placeholder="Manufacturing" />
        </div>
      </div>
      <div class="form-group-gen">
        <label class="form-label">Status</label>
        <select v-model="form.status" class="form-control-gen">
          <option value="aktif">Aktif</option>
          <option value="trial">Trial</option>
          <option value="nonaktif">Nonaktif</option>
        </select>
      </div>
      <template #footer>
        <button class="btn-gen btn-outline" @click="showModal = false">Batal</button>
        <button class="btn-gen btn-teal" @click="save">
          <i class="fas fa-save"></i> Simpan
        </button>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { ROLES } from '@/data/constants'
import { useUserStore, useCompanyStore } from '@/store'
import PageHeader from '@/components/common/PageHeader.vue'
import PanelBox   from '@/components/common/PanelBox.vue'
import AppModal   from '@/components/common/AppModal.vue'

const userStore    = useUserStore()
const companyStore = useCompanyStore()
const showToast    = inject('showToast')

const companies = computed(() => companyStore.companies)
const selectedId = ref(companies.value[0]?.id)
const selected   = computed(() => companies.value.find(c => c.id === selectedId.value))

const topRoles = computed(() => {
  if (!selectedId.value) return []
  return ROLES
    .map(r => ({ ...r, count: userStore.users.filter(u => u.roleId === r.id && u.companyId === selectedId.value).length }))
    .filter(r => r.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
})
const maxCount = computed(() => Math.max(...topRoles.value.map(r => r.count), 1))

// Modal
const showModal = ref(false)
const editData  = ref(null)
const form      = ref({ name: '', kota: '', bidang: '', status: 'aktif' })
const errors    = ref({})

function openAdd() {
  editData.value = null
  form.value = { name: '', kota: '', bidang: '', status: 'aktif' }
  errors.value = {}
  showModal.value = true
}
function openEdit(c) {
  editData.value = c
  form.value = { name: c.name, kota: c.kota, bidang: c.bidang, status: c.status }
  errors.value = {}
  showModal.value = true
}
function validate() {
  errors.value = {}
  if (!form.value.name.trim()) errors.value.name = 'Nama perusahaan wajib diisi'
  return Object.keys(errors.value).length === 0
}
function save() {
  if (!validate()) return
  if (editData.value) {
    companyStore.update(editData.value.id, { ...form.value })
    showToast('Perusahaan berhasil diperbarui')
  } else {
    companyStore.add({ ...form.value, modules: 0, color: '#26B99A' })
    showToast('Perusahaan berhasil ditambahkan')
  }
  showModal.value = false
}
</script>
