<template>
  <div>
    <div class="page-header-row">
      <div>
        <h1 class="page-title">Manajemen Perusahaan</h1>
        <p class="breadcrumb-nav">Home &rsaquo; <span>Perusahaan</span></p>
      </div>
      <button class="btn-gen btn-teal" @click="openModal()">
        <i class="fas fa-plus"></i> Tambah Perusahaan
      </button>
    </div>

    <!-- Cards -->
    <div class="company-grid mb-20">
      <div
        v-for="c in companies"
        :key="c.id"
        class="company-card"
        :class="{ selected: selected === c.id }"
        @click="selected = c.id"
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
    <div v-if="selectedCompany" class="panel-gen">
      <div class="panel-gen-heading">
        <h3 class="panel-gen-title">
          <i class="fas fa-info-circle panel-icon"></i>
          Detail: {{ selectedCompany.name }}
        </h3>
        <div class="flex-row gap-8">
          <router-link to="/permission" class="btn-gen btn-blue btn-sm">
            <i class="fas fa-shield-alt"></i> Kelola Hak Akses
          </router-link>
          <router-link to="/users" class="btn-gen btn-outline btn-sm">
            <i class="fas fa-users"></i> Lihat Pengguna
          </router-link>
        </div>
      </div>
      <div class="panel-gen-body">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
          <div>
            <h4 style="font-size:13px;color:#455464;margin-bottom:12px;font-weight:600">Informasi Perusahaan</h4>
            <table style="width:100%;font-size:12.5px">
              <tr><td style="color:#aaa;padding:5px 0;width:120px">Nama</td><td style="font-weight:500">{{ selectedCompany.name }}</td></tr>
              <tr><td style="color:#aaa;padding:5px 0">Kota</td><td>{{ selectedCompany.kota }}</td></tr>
              <tr><td style="color:#aaa;padding:5px 0">Bidang</td><td>{{ selectedCompany.bidang }}</td></tr>
              <tr><td style="color:#aaa;padding:5px 0">Status</td>
                <td><span class="status-badge" :class="selectedCompany.status">{{ selectedCompany.status }}</span></td>
              </tr>
            </table>
          </div>
          <div>
            <h4 style="font-size:13px;color:#455464;margin-bottom:12px;font-weight:600">Pengguna per Role</h4>
            <div v-for="r in topRoles" :key="r.id" style="margin-bottom:8px">
              <div class="flex-between" style="margin-bottom:3px">
                <span style="font-size:11px;color:#555">{{ r.name }}</span>
                <span style="font-size:11px;color:#aaa">{{ r.count }} orang</span>
              </div>
              <div class="progress-gen">
                <div class="progress-bar-gen" :style="{ width: (r.count / maxRoleCount * 100) + '%', background: r.color }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal tambah perusahaan -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal=false">
      <div class="modal-box">
        <div class="modal-header">
          <h4>Tambah Perusahaan</h4>
          <button class="modal-close" @click="showModal=false"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-group-gen">
            <label class="form-label">Nama Perusahaan</label>
            <input v-model="form.name" class="form-control-gen" placeholder="contoh: PT Sejahtera Abadi" />
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
        </div>
        <div class="modal-footer">
          <button class="btn-gen btn-outline" @click="showModal=false">Batal</button>
          <button class="btn-gen btn-teal" @click="save()">
            <i class="fas fa-save"></i> Simpan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { ROLES } from '@/data/constants'
import { useAuthStore, useUserStore, useCompanyStore } from '@/store'

const auth = useAuthStore()
const userStore = useUserStore()
const companyStore = useCompanyStore()
const showToast = inject('showToast')

const companies = computed(() => companyStore.companies)
const selected = ref(companies.value[0]?.id)

const selectedCompany = computed(() => companies.value.find(c => c.id === selected.value))

const topRoles = computed(() => {
  if (!selected.value) return []
  return ROLES.map(r => ({
    ...r,
    count: userStore.users.filter(u => u.roleId === r.id && u.companyId === selected.value).length,
  })).filter(r => r.count > 0).sort((a, b) => b.count - a.count).slice(0, 6)
})

const maxRoleCount = computed(() => Math.max(...topRoles.value.map(r => r.count), 1))

const showModal = ref(false)
const form = ref({ name: '', kota: '', bidang: '', status: 'aktif' })

function openModal() {
  form.value = { name: '', kota: '', bidang: '', status: 'aktif' }
  showModal.value = true
}

function save() {
  if (!form.value.name) return
  companyStore.add({ ...form.value, modules: 0, color: '#26B99A' })
  showModal.value = false
  showToast('Perusahaan berhasil ditambahkan')
}
</script>
