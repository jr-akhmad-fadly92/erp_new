<template>
  <div>
    <div class="page-header-row">
      <div>
        <h1 class="page-title">Manajemen Pengguna</h1>
        <p class="breadcrumb-nav">Home &rsaquo; Manajemen Akses &rsaquo; <span>Pengguna</span></p>
      </div>
      <button class="btn-gen btn-teal" @click="openAdd">
        <i class="fas fa-user-plus"></i> Tambah Pengguna
      </button>
    </div>

    <div class="panel-gen">
      <div class="panel-gen-heading">
        <h3 class="panel-gen-title">
          <i class="fas fa-users panel-icon"></i>
          Daftar Pengguna
          <span class="badge-gen badge-teal" style="margin-left:8px">{{ filtered.length }}</span>
        </h3>
      </div>
      <div class="panel-gen-body">
        <!-- Filters -->
        <div class="search-row">
          <input v-model="search" class="search-input" placeholder="&#xf002; Cari nama / email..." style="font-family:inherit" />
          <select v-model="filterRole" class="search-select">
            <option value="">Semua Role</option>
            <option v-for="r in ROLES" :key="r.id" :value="r.id">{{ r.name }}</option>
          </select>
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
              <th>Pengguna</th>
              <th>Email</th>
              <th>Role</th>
              <th>Perusahaan</th>
              <th style="text-align:center">Status</th>
              <th style="text-align:center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filtered.length === 0">
              <td colspan="6" style="text-align:center;color:#aaa;padding:30px">
                <i class="fas fa-search" style="font-size:24px;display:block;margin-bottom:8px"></i>
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
                <span
                  class="badge-gen"
                  :style="{ background: roleById(u.roleId)?.color, color:'#fff' }"
                >{{ roleById(u.roleId)?.name }}</span>
              </td>
              <td style="color:#738A9C">{{ companyById(u.companyId)?.name }}</td>
              <td style="text-align:center">
                <span class="status-badge" :class="u.status">{{ u.status }}</span>
              </td>
              <td style="text-align:center">
                <div class="flex-row gap-8" style="justify-content:center">
                  <button class="btn-gen btn-outline btn-xs" title="Edit" @click="openEdit(u)">
                    <i class="fas fa-edit" style="color:#1c84c6"></i>
                  </button>
                  <button class="btn-gen btn-outline btn-xs" title="Toggle Status" @click="userStore.toggleStatus(u.id)">
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
      </div>
    </div>

    <!-- Modal Form -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal=false">
      <div class="modal-box">
        <div class="modal-header">
          <h4>{{ editId ? 'Edit Pengguna' : 'Tambah Pengguna' }}</h4>
          <button class="modal-close" @click="showModal=false"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-group-gen">
            <label class="form-label">Nama Lengkap</label>
            <input v-model="form.name" class="form-control-gen" placeholder="Nama Lengkap" />
          </div>
          <div class="form-group-gen">
            <label class="form-label">Email</label>
            <input v-model="form.email" type="email" class="form-control-gen" placeholder="email@perusahaan.co.id" />
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div class="form-group-gen">
              <label class="form-label">Role</label>
              <select v-model="form.roleId" class="form-control-gen">
                <option v-for="r in ROLES" :key="r.id" :value="r.id">{{ r.name }}</option>
              </select>
            </div>
            <div class="form-group-gen">
              <label class="form-label">Perusahaan</label>
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

          <!-- Role preview -->
          <div v-if="form.roleId" style="background:#F8F8F8;border-radius:3px;padding:12px;margin-top:4px">
            <div style="font-size:11px;color:#aaa;margin-bottom:6px">Modul yang bisa diakses oleh role ini:</div>
            <div style="display:flex;flex-wrap:wrap;gap:5px">
              <span
                v-for="m in accessibleModules"
                :key="m.id"
                style="background:#E8F8F5;color:#1a8a72;font-size:10px;padding:2px 8px;border-radius:10px"
              >{{ m.name }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-gen btn-outline" @click="showModal=false">Batal</button>
          <button class="btn-gen btn-teal" @click="saveUser">
            <i class="fas fa-save"></i> Simpan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { ROLES, MODULES } from '@/data/constants'
import { useAuthStore, useUserStore, useCompanyStore, usePermissionStore } from '@/store'

const auth = useAuthStore()
const userStore = useUserStore()
const companyStore = useCompanyStore()
const permStore = usePermissionStore()
const showToast = inject('showToast')

const companies = computed(() => companyStore.companies)

const search = ref('')
const filterRole = ref('')
const filterCompany = ref('')
const filterStatus = ref('')

const filtered = computed(() => userStore.users.filter(u => {
  if (search.value && !u.name.toLowerCase().includes(search.value.toLowerCase()) &&
      !u.email.toLowerCase().includes(search.value.toLowerCase())) return false
  if (filterRole.value && u.roleId !== Number(filterRole.value)) return false
  if (filterCompany.value && u.companyId !== Number(filterCompany.value)) return false
  if (filterStatus.value && u.status !== filterStatus.value) return false
  return true
}))

function roleById(id) { return ROLES.find(r => r.id === id) }
function companyById(id) { return companies.value.find(c => c.id === id) }
function initials(name) { return name.split(' ').slice(0, 2).map(n => n[0]).join('') }

// Modal
const showModal = ref(false)
const editId = ref(null)
const form = ref({ name: '', email: '', roleId: 3, companyId: 1, status: 'aktif' })

const accessibleModules = computed(() => {
  if (!form.value.roleId) return []
  const perms = permStore.getPerms(form.value.companyId || auth.activeCompanyId)
  return MODULES.filter(m => perms[m.id]?.[form.value.roleId])
})

function openAdd() {
  editId.value = null
  form.value = { name: '', email: '', roleId: 3, companyId: auth.activeCompanyId, status: 'aktif' }
  showModal.value = true
}

function openEdit(u) {
  editId.value = u.id
  form.value = { ...u }
  showModal.value = true
}

function saveUser() {
  if (!form.value.name || !form.value.email) return
  if (editId.value) {
    userStore.update(editId.value, form.value)
    showToast('Pengguna berhasil diperbarui')
  } else {
    userStore.add({ ...form.value })
    showToast('Pengguna berhasil ditambahkan')
  }
  showModal.value = false
}

function remove(u) {
  if (confirm(`Hapus pengguna ${u.name}?`)) {
    userStore.remove(u.id)
    showToast('Pengguna dihapus', 'warning')
  }
}
</script>
