<template>
  <div class="login-wrapper">
    <div class="login-card">
      <div class="login-header">
        <i class="fas fa-building" style="font-size:32px;color:#26B99A;margin-bottom:10px;display:block"></i>
        <h1 style="font-size:22px;font-weight:300;color:#fff;margin:0 0 4px">MultiCorp ERP</h1>
        <p style="color:#738A9C;font-size:12px;margin:0">Sistem Manajemen Multi Perusahaan</p>
      </div>

      <div class="login-body">
        <!-- Email -->
        <div class="form-group-gen">
          <label class="form-label">Email</label>
          <div style="position:relative">
            <i class="fas fa-user" style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:#aaa;font-size:13px"></i>
            <input
              v-model="form.email"
              class="form-control-gen"
              style="padding-left:32px"
              placeholder="email@perusahaan.co.id"
              @keyup.enter="login"
            />
          </div>
        </div>

        <!-- Password -->
        <div class="form-group-gen">
          <label class="form-label">Password</label>
          <div style="position:relative">
            <i class="fas fa-lock" style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:#aaa;font-size:13px"></i>
            <input
              v-model="form.password"
              :type="showPw ? 'text' : 'password'"
              class="form-control-gen"
              style="padding-left:32px;padding-right:36px"
              placeholder="••••••••"
              @keyup.enter="login"
            />
            <button @click="showPw = !showPw" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#aaa">
              <i class="fas" :class="showPw ? 'fa-eye-slash' : 'fa-eye'"></i>
            </button>
          </div>
        </div>

        <!-- Demo accounts -->
        <div class="demo-box">
          <div class="demo-box-title">Demo Akun <span style="font-weight:400">(password: <code>demo123</code>)</span></div>
          <div style="display:flex;flex-wrap:wrap;gap:5px">
            <button
              v-for="d in demoAccounts" :key="d.email"
              class="demo-btn"
              :style="{ borderColor: d.color }"
              @click="fillDemo(d)"
            >
              <span :style="{ color: d.color }">●</span> {{ d.label }}
            </button>
          </div>
        </div>

        <!-- Error -->
        <div v-if="error" class="login-error">
          <i class="fas fa-exclamation-circle"></i> {{ error }}
        </div>

        <!-- Submit -->
        <button class="btn-gen btn-teal" style="width:100%;justify-content:center;padding:10px;font-size:13px" @click="login">
          <i class="fas fa-sign-in-alt"></i> Masuk
        </button>
      </div>

      <div style="text-align:center;padding:12px;font-size:11px;color:#738A9C">
        MultiCorp ERP v1.0 &bull; &copy; 2024
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store'
import { SAMPLE_USERS } from '@/data/constants'

const router = useRouter()
const auth   = useAuthStore()

const form   = ref({ email: '', password: '' })
const showPw = ref(false)
const error  = ref('')

const demoAccounts = [
  { email: 'a.fauzi@majubersama.co.id',    label: 'Super Admin',  color: '#8E44AD' },
  { email: 'b.santoso@majubersama.co.id',  label: 'Direktur',     color: '#2980B9' },
  { email: 'd.prasetyo@majubersama.co.id', label: 'Purchasing',   color: '#27AE60' },
  { email: 'i.syah@majubersama.co.id',     label: 'Import',       color: '#F39C12' },
  { email: 'k.putra@majubersama.co.id',    label: 'Kep. Gudang',  color: '#E74C3C' },
  { email: 'm.sanjaya@majubersama.co.id',  label: 'Staff Gudang', color: '#16A085' },
  { email: 'e.wijaya@sinarjaya.co.id',     label: 'Sales Mgr',    color: '#C0392B' },
  { email: 'c.dewi@majubersama.co.id',     label: 'Finance',      color: '#1ABC9C' },
  { email: 'h.susanti@majubersama.co.id',  label: 'Accounting',   color: '#D35400' },
  { email: 'g.rizky@karyamandiri.co.id',   label: 'QC',           color: '#2980B9' },
]

function fillDemo(d) {
  form.value.email    = d.email
  form.value.password = 'demo123'
  error.value = ''
}

function login() {
  error.value = ''
  if (!form.value.email || !form.value.password) {
    error.value = 'Email dan password wajib diisi'; return
  }
  const user = SAMPLE_USERS.find(u => u.email === form.value.email)
  if (!user || form.value.password !== 'demo123') {
    error.value = 'Email atau password salah'; return
  }
  if (user.status === 'nonaktif') {
    error.value = 'Akun Anda tidak aktif. Hubungi administrator.'; return
  }
  auth.currentUser    = { ...user }
  auth.activeCompanyId = user.companyId
  router.push('/dashboard')
}
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  background: #2A3F54;
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
}
.login-card {
  width: 440px; max-width: 100%;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  overflow: hidden;
}
.login-header {
  background: #2A3F54;
  padding: 28px 24px 20px;
  text-align: center;
}
.login-body { padding: 24px; }
.demo-box {
  background: #F8F8F8;
  border-radius: 3px;
  padding: 10px 12px;
  margin-bottom: 14px;
  font-size: 11px;
}
.demo-box-title { font-weight: 600; color: #555; margin-bottom: 6px; }
.demo-btn {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 3px 9px;
  font-size: 10px;
  cursor: pointer;
  color: #555;
  transition: background .1s;
}
.demo-btn:hover { background: #f0f0f0; }
.login-error {
  background: #FDF2F2;
  color: #c0392b;
  padding: 8px 12px;
  border-radius: 3px;
  font-size: 12px;
  margin-bottom: 12px;
}
</style>
