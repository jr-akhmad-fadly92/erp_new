<template>
  <div>
    <PageHeader title="Manajemen Pengguna" :crumbs="[{ label: 'Manajemen Akses' }, { label: 'Pengguna' }]">
      <template #actions>
        <button class="btn-gen btn-teal" @click="openAdd">
          <i class="fas fa-user-plus"></i> Tambah Pengguna
        </button>
      </template>
    </PageHeader>

    <!-- Stat tiles -->
    <div class="tile-row">
      <StatTile :value="userStore.users.length"                         label="Total Pengguna"  icon="fa-users"       color=""       icon-color="#26B99A" />
      <StatTile :value="userStore.users.filter(u=>u.status==='aktif').length"    label="Aktif"           icon="fa-user-check"  color="blue"   icon-color="#1c84c6" />
      <StatTile :value="userStore.users.filter(u=>u.status==='nonaktif').length" label="Nonaktif"        icon="fa-user-times"  color="red"    icon-color="#e74c3c" />
      <StatTile :value="companies.length"                               label="Perusahaan"      icon="fa-building"    color="orange" icon-color="#f0ad4e" />
    </div>

    <PanelBox title="Daftar Pengguna" icon="fa-users" :badge="filtered.length">
      <!-- Filters -->
      <div class="search-row">
        <input v-model="search"         class="search-input" placeholder="Cari nama / email / telepon..." />
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
            <th>Pengguna</th><th>Email / Telepon</th><th>Role</th>
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
                <div>
                  <div style="font-weight:600;color:#455464;font-size:12.5px">{{ u.name }}</div>
                  <div style="font-size:10px;color:#aaa">ID: {{ u.id }}</div>
                </div>
              </div>
            </td>
            <td>
              <div style="font-size:12px;color:#738A9C">{{ u.email }}</div>
              <div style="font-size:11px;color:#aaa">{{ u.phone || '-' }}</div>
            </td>
            <td>
              <span class="badge-gen" :style="{ background: roleById(u.roleId)?.color }">
                {{ roleById(u.roleId)?.name }}
              </span>
            </td>
            <td style="color:#738A9C;font-size:12px">{{ companyById(u.companyId)?.name }}</td>
            <td style="text-align:center">
              <span class="status-badge" :class="u.status">{{ u.status }}</span>
            </td>
            <td style="text-align:center">
              <div class="flex-row gap-5" style="justify-content:center">
                <button class="btn-gen btn-outline btn-xs" title="Edit" @click="openEdit(u)">
                  <i class="fas fa-edit" style="color:#1c84c6"></i>
                </button>
                <button class="btn-gen btn-outline btn-xs" title="Ubah Password" @click="openPassword(u)">
                  <i class="fas fa-key" style="color:#f0ad4e"></i>
                </button>
                <button class="btn-gen btn-outline btn-xs" title="Pindah Perusahaan" @click="openMoveCompany(u)">
                  <i class="fas fa-building" style="color:#26B99A"></i>
                </button>
                <button class="btn-gen btn-outline btn-xs" title="Toggle Status" @click="toggleStatus(u)">
                  <i class="fas fa-power-off" :style="{ color: u.status==='aktif'?'#27AE60':'#e74c3c' }"></i>
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

    <!-- ── MODAL: Tambah / Edit Pengguna ── -->
    <AppModal v-model="showUserModal" :title="editId ? 'Edit Pengguna' : 'Tambah Pengguna'" icon="fa-user" width="600px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group-gen" style="grid-column:1/-1">
          <label class="form-label">Nama Lengkap <span style="color:#e74c3c">*</span></label>
          <input v-model="userForm.name" class="form-control-gen" :class="{ error: formErrors.name }" placeholder="Nama Lengkap" />
          <div v-if="formErrors.name" class="form-error">{{ formErrors.name }}</div>
        </div>
        <div class="form-group-gen">
          <label class="form-label">Email <span style="color:#e74c3c">*</span></label>
          <input v-model="userForm.email" type="email" class="form-control-gen" :class="{ error: formErrors.email }" placeholder="email@perusahaan.co.id" />
          <div v-if="formErrors.email" class="form-error">{{ formErrors.email }}</div>
        </div>
        <div class="form-group-gen">
          <label class="form-label">Telepon</label>
          <input v-model="userForm.phone" class="form-control-gen" placeholder="08xx-xxxx-xxxx" />
        </div>
        <div class="form-group-gen">
          <label class="form-label">Role <span style="color:#e74c3c">*</span></label>
          <select v-model="userForm.roleId" class="form-control-gen">
            <option v-for="r in ROLES" :key="r.id" :value="r.id">{{ r.name }}</option>
          </select>
        </div>
        <div class="form-group-gen">
          <label class="form-label">Perusahaan <span style="color:#e74c3c">*</span></label>
          <select v-model="userForm.companyId" class="form-control-gen">
            <option v-for="c in companies" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
        <div class="form-group-gen">
          <label class="form-label">Status</label>
          <select v-model="userForm.status" class="form-control-gen">
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
          </select>
        </div>
        <!-- Password hanya saat tambah baru -->
        <template v-if="!editId">
          <div class="form-group-gen">
            <label class="form-label">Password <span style="color:#e74c3c">*</span></label>
            <div style="position:relative">
              <input v-model="userForm.password" :type="showPw1?'text':'password'" class="form-control-gen"
                :class="{ error: formErrors.password }" placeholder="Min. 8 karakter" style="padding-right:34px"/>
              <button type="button" @click="showPw1=!showPw1" class="pw-toggle-btn">
                <i class="fas" :class="showPw1?'fa-eye-slash':'fa-eye'"></i>
              </button>
            </div>
            <div v-if="formErrors.password" class="form-error">{{ formErrors.password }}</div>
          </div>
          <div class="form-group-gen">
            <label class="form-label">Konfirmasi Password <span style="color:#e74c3c">*</span></label>
            <div style="position:relative">
              <input v-model="userForm.passwordConfirm" :type="showPw2?'text':'password'" class="form-control-gen"
                :class="{ error: formErrors.passwordConfirm }" placeholder="Ulangi password" style="padding-right:34px"/>
              <button type="button" @click="showPw2=!showPw2" class="pw-toggle-btn">
                <i class="fas" :class="showPw2?'fa-eye-slash':'fa-eye'"></i>
              </button>
            </div>
            <div v-if="formErrors.passwordConfirm" class="form-error">{{ formErrors.passwordConfirm }}</div>
          </div>
        </template>
      </div>

      <!-- Preview modul akses -->
      <div v-if="userForm.roleId && userForm.companyId" style="background:#F8F9FA;border-radius:3px;padding:12px;margin-top:4px">
        <div style="font-size:11px;font-weight:600;color:#455464;margin-bottom:7px">
          <i class="fas fa-shield-alt" style="color:#26B99A;margin-right:5px"></i>
          Modul yang dapat diakses ({{ accessibleModules.length }} modul):
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:5px">
          <span v-for="m in accessibleModules" :key="m.id"
            style="background:#E8F8F5;color:#1a8a72;font-size:10px;padding:2px 8px;border-radius:10px">
            {{ m.name }}
          </span>
          <span v-if="accessibleModules.length===0" style="font-size:11px;color:#aaa">
            Tidak ada akses modul
          </span>
        </div>
      </div>

      <template #footer>
        <button class="btn-gen btn-outline" @click="showUserModal=false">Batal</button>
        <button class="btn-gen btn-teal" @click="saveUser">
          <i class="fas fa-save"></i> Simpan
        </button>
      </template>
    </AppModal>

    <!-- ── MODAL: Ubah Password ── -->
    <AppModal v-model="showPwModal" title="Ubah Password" icon="fa-key" width="420px">
      <div v-if="pwTarget" class="flex-row gap-8" style="margin-bottom:14px;background:#F8F9FA;padding:10px 12px;border-radius:3px">
        <div class="avatar" :style="{ background: roleById(pwTarget.roleId)?.color, width:'30px', height:'30px', fontSize:'11px' }">
          {{ initials(pwTarget.name) }}
        </div>
        <div>
          <div style="font-size:12.5px;font-weight:600;color:#455464">{{ pwTarget.name }}</div>
          <div style="font-size:11px;color:#aaa">{{ pwTarget.email }}</div>
        </div>
      </div>
      <div class="form-group-gen">
        <label class="form-label">Password Baru <span style="color:#e74c3c">*</span></label>
        <div style="position:relative">
          <input v-model="pwForm.newPassword" :type="showPw3?'text':'password'" class="form-control-gen"
            :class="{ error: pwErrors.newPassword }" placeholder="Min. 8 karakter" style="padding-right:34px"/>
          <button type="button" @click="showPw3=!showPw3" class="pw-toggle-btn">
            <i class="fas" :class="showPw3?'fa-eye-slash':'fa-eye'"></i>
          </button>
        </div>
        <div v-if="pwErrors.newPassword" class="form-error">{{ pwErrors.newPassword }}</div>
      </div>
      <div class="form-group-gen">
        <label class="form-label">Konfirmasi Password <span style="color:#e74c3c">*</span></label>
        <div style="position:relative">
          <input v-model="pwForm.confirmPassword" :type="showPw4?'text':'password'" class="form-control-gen"
            :class="{ error: pwErrors.confirmPassword }" placeholder="Ulangi password baru" style="padding-right:34px"/>
          <button type="button" @click="showPw4=!showPw4" class="pw-toggle-btn">
            <i class="fas" :class="showPw4?'fa-eye-slash':'fa-eye'"></i>
          </button>
        </div>
        <div v-if="pwErrors.confirmPassword" class="form-error">{{ pwErrors.confirmPassword }}</div>
      </div>
      <!-- Strength bar -->
      <div v-if="pwForm.newPassword" style="margin-top:4px">
        <div class="flex-between" style="margin-bottom:3px">
          <span style="font-size:10px;color:#aaa">Kekuatan password</span>
          <span style="font-size:10px" :style="{ color: pwStrength.color }">{{ pwStrength.label }}</span>
        </div>
        <div class="progress-gen">
          <div class="progress-bar-gen" :style="{ width: pwStrength.pct+'%', background: pwStrength.color }"></div>
        </div>
      </div>
      <template #footer>
        <button class="btn-gen btn-outline" @click="showPwModal=false">Batal</button>
        <button class="btn-gen btn-teal" @click="savePassword">
          <i class="fas fa-key"></i> Ubah Password
        </button>
      </template>
    </AppModal>

    <!-- ── MODAL: Pindah Perusahaan ── -->
    <AppModal v-model="showMoveModal" title="Pindah Perusahaan" icon="fa-building" width="420px">
      <div v-if="moveTarget" class="flex-row gap-8" style="margin-bottom:14px;background:#F8F9FA;padding:10px 12px;border-radius:3px">
        <div class="avatar" :style="{ background: roleById(moveTarget.roleId)?.color, width:'30px', height:'30px', fontSize:'11px' }">
          {{ initials(moveTarget.name) }}
        </div>
        <div>
          <div style="font-size:12.5px;font-weight:600;color:#455464">{{ moveTarget.name }}</div>
          <div style="font-size:11px;color:#aaa">
            Saat ini: <strong>{{ companyById(moveTarget.companyId)?.name }}</strong>
          </div>
        </div>
      </div>
      <div class="form-group-gen">
        <label class="form-label">Perusahaan Tujuan <span style="color:#e74c3c">*</span></label>
        <select v-model="moveCompanyId" class="form-control-gen">
          <option v-for="c in companies" :key="c.id" :value="c.id"
            :disabled="moveTarget && c.id === moveTarget.companyId">
            {{ c.name }}{{ moveTarget && c.id === moveTarget.companyId ? ' (saat ini)' : '' }}
          </option>
        </select>
      </div>
      <div style="background:#FEF9E7;border-radius:3px;padding:10px 12px;font-size:11px;color:#ca8a04">
        <i class="fas fa-exclamation-triangle" style="margin-right:5px"></i>
        Hak akses pengguna akan disesuaikan dengan permission di perusahaan tujuan.
      </div>
      <template #footer>
        <button class="btn-gen btn-outline" @click="showMoveModal=false">Batal</button>
        <button class="btn-gen btn-teal" @click="saveMove">
          <i class="fas fa-exchange-alt"></i> Pindahkan
        </button>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { ROLES, MODULES } from '@/data/constants'
import { useAuthStore, useUserStore, useCompanyStore, usePermissionStore } from '@/store'
import { UserService } from '@/api'
import PageHeader from '@/components/common/PageHeader.vue'
import PanelBox   from '@/components/common/PanelBox.vue'
import StatTile   from '@/components/common/StatTile.vue'
import AppModal   from '@/components/common/AppModal.vue'

const auth        = useAuthStore()
const userStore   = useUserStore()
const companyStore = useCompanyStore()
const permStore   = usePermissionStore()
const showToast   = inject('showToast')

const companies   = computed(() => companyStore.companies)

// ── Filters ───────────────────────────────────────────────────
const search        = ref('')
const filterRole    = ref('')
const filterCompany = ref('')
const filterStatus  = ref('')

const filtered = computed(() => userStore.users.filter(u => {
  const s = search.value.toLowerCase()
  if (s && !u.name.toLowerCase().includes(s) &&
      !u.email.toLowerCase().includes(s) &&
      !(u.phone||'').includes(s)) return false
  if (filterRole.value    && u.roleId    !== Number(filterRole.value))    return false
  if (filterCompany.value && u.companyId !== Number(filterCompany.value)) return false
  if (filterStatus.value  && u.status    !== filterStatus.value)          return false
  return true
}))

function roleById(id)    { return ROLES.find(r => r.id === id) }
function companyById(id) { return companies.value.find(c => c.id === id) }
function initials(name)  { return name?.split(' ').slice(0,2).map(n=>n[0]).join('') || '?' }

// ── Accessible modules preview ────────────────────────────────
const accessibleModules = computed(() => {
  if (!userForm.value.roleId || !userForm.value.companyId) return []
  const perms = permStore.getPerms(userForm.value.companyId)
  return MODULES.filter(m => perms[m.id]?.[userForm.value.roleId])
})

// ════════════════════════════════════════
//  MODAL: ADD / EDIT USER
// ════════════════════════════════════════
const showUserModal = ref(false)
const editId        = ref(null)
const showPw1       = ref(false)
const showPw2       = ref(false)
const userForm      = ref(defaultUserForm())
const formErrors    = ref({})

function defaultUserForm() {
  return { name:'', email:'', phone:'', roleId:3, companyId:auth.activeCompanyId, status:'aktif', password:'', passwordConfirm:'' }
}

function openAdd() {
  editId.value   = null
  userForm.value = defaultUserForm()
  formErrors.value = {}
  showPw1.value = showPw2.value = false
  showUserModal.value = true
}
function openEdit(u) {
  editId.value   = u.id
  userForm.value = { name:u.name, email:u.email, phone:u.phone||'', roleId:u.roleId, companyId:u.companyId, status:u.status, password:'', passwordConfirm:'' }
  formErrors.value = {}
  showPw1.value = showPw2.value = false
  showUserModal.value = true
}

function validateUser() {
  const e = {}
  if (!userForm.value.name.trim())  e.name  = 'Nama wajib diisi'
  if (!userForm.value.email.trim()) e.email = 'Email wajib diisi'
  else if (!/\S+@\S+\.\S+/.test(userForm.value.email)) e.email = 'Format email tidak valid'
  if (!editId.value) {
    if (!userForm.value.password)                   e.password        = 'Password wajib diisi'
    else if (userForm.value.password.length < 8)    e.password        = 'Password minimal 8 karakter'
    if (userForm.value.password !== userForm.value.passwordConfirm) e.passwordConfirm = 'Password tidak cocok'
  }
  formErrors.value = e
  return Object.keys(e).length === 0
}

async function saveUser() {
  if (!validateUser()) return

  const payload = {
    name:       userForm.value.name,
    email:      userForm.value.email,
    phone:      userForm.value.phone,
    role_id:    userForm.value.roleId,
    company_id: userForm.value.companyId,
    status:     userForm.value.status,
    ...(!editId.value ? {
      password:              userForm.value.password,
      password_confirmation: userForm.value.passwordConfirm,
    } : {}),
  }

  // API call — uncomment saat backend tersedia:
  // const { data, error } = editId.value
  //   ? await UserService.update(editId.value, payload)
  //   : await UserService.create(payload)
  // if (error) { showToast(error, 'error'); return }

  // Local store (mock):
  if (editId.value) {
    userStore.update(editId.value, { name:userForm.value.name, email:userForm.value.email, phone:userForm.value.phone, roleId:userForm.value.roleId, companyId:userForm.value.companyId, status:userForm.value.status })
    showToast('Pengguna berhasil diperbarui')
  } else {
    userStore.add({ name:userForm.value.name, email:userForm.value.email, phone:userForm.value.phone, roleId:userForm.value.roleId, companyId:userForm.value.companyId, status:userForm.value.status, password:userForm.value.password })
    showToast('Pengguna berhasil ditambahkan')
  }
  showUserModal.value = false
}

// ════════════════════════════════════════
//  MODAL: PASSWORD
// ════════════════════════════════════════
const showPwModal  = ref(false)
const pwTarget     = ref(null)
const showPw3      = ref(false)
const showPw4      = ref(false)
const pwForm       = ref({ newPassword:'', confirmPassword:'' })
const pwErrors     = ref({})

const pwStrength = computed(() => {
  const p = pwForm.value.newPassword
  if (!p) return { pct:0, label:'', color:'#ccc' }
  let score = 0
  if (p.length >= 8)   score++
  if (p.length >= 12)  score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  const map = [
    { pct:20, label:'Sangat Lemah', color:'#e74c3c' },
    { pct:40, label:'Lemah',        color:'#e74c3c' },
    { pct:60, label:'Cukup',        color:'#f0ad4e' },
    { pct:80, label:'Kuat',         color:'#26B99A' },
    { pct:100,label:'Sangat Kuat',  color:'#27AE60' },
  ]
  return map[Math.min(score, 4)]
})

function openPassword(u) {
  pwTarget.value = u
  pwForm.value   = { newPassword:'', confirmPassword:'' }
  pwErrors.value = {}
  showPw3.value = showPw4.value = false
  showPwModal.value = true
}

async function savePassword() {
  const e = {}
  if (!pwForm.value.newPassword)               e.newPassword     = 'Password baru wajib diisi'
  else if (pwForm.value.newPassword.length < 8) e.newPassword     = 'Minimal 8 karakter'
  if (pwForm.value.newPassword !== pwForm.value.confirmPassword) e.confirmPassword = 'Password tidak cocok'
  pwErrors.value = e
  if (Object.keys(e).length) return

  // API call — uncomment saat backend tersedia:
  // const { error } = await UserService.resetPassword(pwTarget.value.id, {
  //   new_password:              pwForm.value.newPassword,
  //   new_password_confirmation: pwForm.value.confirmPassword,
  // })
  // if (error) { showToast(error, 'error'); return }

  // Local mock:
  userStore.update(pwTarget.value.id, { password: pwForm.value.newPassword })
  showPwModal.value = false
  showToast(`Password ${pwTarget.value.name} berhasil diubah`)
}

// ════════════════════════════════════════
//  MODAL: PINDAH PERUSAHAAN
// ════════════════════════════════════════
const showMoveModal = ref(false)
const moveTarget    = ref(null)
const moveCompanyId = ref(null)

function openMoveCompany(u) {
  moveTarget.value    = u
  moveCompanyId.value = u.companyId
  showMoveModal.value = true
}

async function saveMove() {
  if (!moveCompanyId.value || moveCompanyId.value === moveTarget.value.companyId) return

  // API call — uncomment saat backend tersedia:
  // const { error } = await UserService.update(moveTarget.value.id, { company_id: moveCompanyId.value })
  // if (error) { showToast(error, 'error'); return }

  const oldName = companyById(moveTarget.value.companyId)?.name
  const newName = companyById(moveCompanyId.value)?.name
  userStore.update(moveTarget.value.id, { companyId: moveCompanyId.value })
  showMoveModal.value = false
  showToast(`${moveTarget.value.name} dipindah ke ${newName}`)
}

// ── Toggle & Delete ───────────────────────────────────────────
async function toggleStatus(u) {
  const newStatus = u.status === 'aktif' ? 'nonaktif' : 'aktif'
  // await UserService.toggleStatus(u.id, newStatus)
  userStore.toggleStatus(u.id)
  showToast(newStatus === 'aktif' ? 'Akun diaktifkan' : 'Akun dinonaktifkan', 'warning')
}

async function remove(u) {
  if (!confirm(`Hapus pengguna "${u.name}"? Tindakan ini tidak bisa dibatalkan.`)) return
  // await UserService.delete(u.id)
  userStore.remove(u.id)
  showToast('Pengguna dihapus', 'warning')
}
</script>

<style scoped>
.pw-toggle-btn {
  position: absolute; right: 8px; top: 50%;
  transform: translateY(-50%);
  background: none; border: none; cursor: pointer; color: #aaa;
  padding: 0 2px;
}
.pw-toggle-btn:hover { color: #555; }
.gap-5 { gap: 5px; }
</style>
