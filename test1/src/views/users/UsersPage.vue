<template>
  <div>
    <PageHeader title="Manajemen Pengguna" :crumbs="[{ label: 'Manajemen Akses' }, { label: 'Pengguna' }]">
      <template #actions>
        <button class="btn-gen btn-teal" @click="openAdd">
          <i class="fas fa-user-plus"></i> Tambah Pengguna
        </button>
      </template>
    </PageHeader>

    <PanelBox title="Daftar Pengguna" icon="fa-users" :badge="filtered.length">
      <!-- Filters -->
      <div class="search-row">
        <input v-model="search" class="search-input" placeholder="Cari nama / email..." />
        <select v-model="filterRole"    class="search-select">
          <option value="">Semua Role</option>
          <option v-for="r in ROLES" :key="r.id" :value="r.id">{{ r.name }}</option>
        </select>
        <select v-model="filterCompany" class="search-select">
          <option value="">Semua Perusahaan</option>
          <option v-for="c in companies" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
        <select v-model="filterStatus"  class="search-select">
          <option value="">Semua Status</option>
          <option value="aktif">Aktif</option>
          <option value="nonaktif">Nonaktif</option>
        </select>
      </div>

      <table class="table-gen">
        <thead>
          <tr>
            <th>Pengguna</th><th>Email</th><th>Role</th>
            <th>Perusahaan</th><th style="text-align:center">Status</th>
            <th style="text-align:center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filtered.length === 0">
            <td colspan="6" style="text-align:center;color:#aaa;padding:30px">
              <i class="fas fa-search" style="font-size:24px;display:block;margin-bottom:8px;opacity:.3"></i>
              Tidak ada data yang sesuai
            </td>
          </tr>
          <tr v-for="u in filtered" :key="u.id">
            <td>
              <div class="flex-row gap-8">
                <div class="avatar" :style="{ background: roleById(u.roleId)?.color || '#aaa' }">
                  {{ initials(u.name) }}
                </div>
                <span style="font-weight:600;color:#455464">{{ u.name }}</span>
              </div>
            </td>
            <td style="color:#738A9C">{{ u.email }}</td>
            <td>
              <span class="badge-gen" :style="{ background: roleById(u.roleId)?.color }">
                {{ roleById(u.roleId)?.name }}
              </span>
            </td>
            <td style="color:#738A9C">{{ companyById(u.companyId)?.name }}</td>
            <td style="text-align:center">
              <span class="status-badge" :class="u.status">{{ u.status }}</span>
            </td>
            <td style="text-align:center">
              <div class="flex-row gap-6" style="justify-content:center">
                <button class="btn-gen btn-outline btn-xs" title="Edit" @click="openEdit(u)">
                  <i class="fas fa-edit" style="color:#1c84c6"></i>
                </button>
                <button class="btn-gen btn-outline btn-xs" title="Toggle Status" @click="toggleStatus(u)">
                  <i class="fas fa-power-off" :style="{ color: u.status==='aktif' ? '#27AE60' : '#e74c3c' }"></i>
                </button>
                <button class="btn-gen btn-outline btn-xs" title="Hapus" @click="remove(u)">
                  <i class="fas fa-trash" style="color:#e74c3c"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </PanelBox>

    <!-- Modal form -->
    <AppModal v-model="showModal" :title="editId ? 'Edit Pengguna' : 'Tambah Pengguna'" icon="fa-user" width="560px">
      <div class="form-group-gen">
        <label class="form-label">Nama Lengkap <span style="color:#e74c3c">*</span></label>
        <input v-model="form.name" class="form-control-gen" :class="{ error: errors.name }" placeholder="Nama Lengkap" />
        <div v-if="errors.name" class="form-error">{{ errors.name }}</div>
      </div>
      <div class="form-group-gen">
        <label class="form-label">Email <span style="color:#e74c3c">*</span></label>
        <input v-model="form.email" type="email" class="form-control-gen" :class="{ error: errors.email }" placeholder="email@perusahaan.co.id" />
        <div v-if="errors.email" class="form-error">{{ errors.email }}</div>
      </div>
      <div class="form-group-gen">
        <label class="form-label">Password <span style="color:#e74c3c">*</span></label>
        <input v-model="form.password" type="password" class="form-control-gen" :class="{ error: errors.password }" placeholder="Masukkan password" />
        <div v-if="errors.password" class="form-error">{{ errors.password }}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group-gen">
          <label class="form-label">Role <span style="color:#e74c3c">*</span></label>
          <select v-model="form.roleId" class="form-control-gen">
            <option v-for="r in ROLES" :key="r.id" :value="r.id">{{ r.name }}</option>
          </select>
        </div>
        <div class="form-group-gen">
          <label class="form-label">Perusahaan <span style="color:#e74c3c">*</span></label>
          <select v-model="form.companyId" class="form-control-gen">
            <option v-for="c in companies" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
      </div>
      <div class="form-group-gen">
        <label class="form-label">Status</label>
        <select v-model="form.status" class="form-control-gen">
          <option value="aktif">Aktif</option>
          <option value="nonaktif">Nonaktif</option>
        </select>
      </div>

      <!-- Module access preview -->
      <div v-if="form.roleId" style="background:#F8F9FA;border-radius:3px;padding:12px">
        <div style="font-size:11px;font-weight:600;color:#455464;margin-bottom:7px">
          <i class="fas fa-shield-alt" style="color:#26B99A;margin-right:5px"></i>
          Modul yang dapat diakses ({{ accessibleModules.length }} modul):
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:5px">
          <span
            v-for="m in accessibleModules" :key="m.id"
            style="background:#E8F8F5;color:#1a8a72;font-size:10px;padding:2px 8px;border-radius:10px"
          >{{ m.name }}</span>
          <span v-if="accessibleModules.length === 0" style="font-size:11px;color:#aaa">Tidak ada akses modul</span>
        </div>
      </div>

      <template #footer>
        <button class="btn-gen btn-outline" @click="showModal = false">Batal</button>
        <button class="btn-gen btn-teal" @click="saveUser">
          <i class="fas fa-save"></i> Simpan
        </button>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { ROLES, MODULES } from '@/data/constants'
import { useAuthStore, useUserStore, useCompanyStore, usePermissionStore } from '@/store'
import PageHeader from '@/components/common/PageHeader.vue'
import PanelBox   from '@/components/common/PanelBox.vue'
import AppModal   from '@/components/common/AppModal.vue'

const auth        = useAuthStore()
const userStore   = useUserStore()
const companyStore = useCompanyStore()
const permStore   = usePermissionStore()
const showToast   = inject('showToast')

const companies = computed(() => companyStore.companies)

// Filters
const search        = ref('')
const filterRole    = ref('')
const filterCompany = ref('')
const filterStatus  = ref('')

const filtered = computed(() => userStore.users.filter(u => {
  if (search.value && !u.name.toLowerCase().includes(search.value.toLowerCase()) &&
      !u.email.toLowerCase().includes(search.value.toLowerCase())) return false
  if (filterRole.value    && u.roleId    !== Number(filterRole.value))    return false
  if (filterCompany.value && u.companyId !== Number(filterCompany.value)) return false
  if (filterStatus.value  && u.status    !== filterStatus.value)          return false
  return true
}))

function roleById(id)    { return ROLES.find(r => r.id === id) }
function companyById(id) { return companies.value.find(c => c.id === id) }
function initials(name)  { return name.split(' ').slice(0, 2).map(n => n[0]).join('') }

// Modal
const showModal = ref(false)
const editId    = ref(null)
const form      = ref({ name: '', email: '', roleId: 3, companyId: 1, status: 'aktif' })
const errors    = ref({})

const accessibleModules = computed(() => {
  const perms = permStore.getPerms(form.value.companyId || auth.activeCompanyId)
  return MODULES.filter(m => perms[m.id]?.[form.value.roleId])
})

function openAdd() {
  editId.value = null
  form.value   = { name: '', email: '', password: '', roleId: 3, companyId: auth.activeCompanyId, status: 'aktif' }
  errors.value = {}
  showModal.value = true
}
function openEdit(u) {
  editId.value = u.id
  form.value   = { ...u }
  errors.value = {}
  showModal.value = true
}
function validate() {
  errors.value = {}
  if (!form.value.name.trim())  errors.value.name  = 'Nama wajib diisi'
  if (!form.value.email.trim()) errors.value.email = 'Email wajib diisi'
  if (!form.value.password.trim()) errors.value.password = 'Password wajib diisi'
  return Object.keys(errors.value).length === 0
}
function saveUser() {
  if (!validate()) return
  if (editId.value) {
    userStore.update(editId.value, form.value)
    showToast('Pengguna berhasil diperbarui')
  } else {
    userStore.add({ ...form.value })
    showToast('Pengguna berhasil ditambahkan')
  }
  showModal.value = false
}
function toggleStatus(u) {
  userStore.toggleStatus(u.id)
  showToast(u.status === 'aktif' ? 'Akun dinonaktifkan' : 'Akun diaktifkan', 'warning')
}
function remove(u) {
  if (confirm(`Hapus pengguna ${u.name}?`)) {
    userStore.remove(u.id)
    showToast('Pengguna dihapus', 'warning')
  }
}
</script>
