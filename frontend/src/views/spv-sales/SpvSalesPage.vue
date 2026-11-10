<template>
  <div>
    <PageHeader title="SPV Sales" :crumbs="[{ label: 'Modul ERP' }, { label: 'SPV Sales' }]">
      <template #actions>
        <button class="btn-gen btn-outline btn-sm" @click="refresh">
          <i class="fas fa-sync-alt"></i> Refresh
        </button>
      </template>
    </PageHeader>

    <!-- Tiles -->
    <div class="tile-row">
      <StatTile :value="stats.totalOrder"    label="Total SO Bulan Ini"  icon="fa-cart-plus"     color=""       icon-color="#26B99A" />
      <StatTile :value="fmtCurrency(stats.totalRevenue)" label="Total Omzet" icon="fa-money-bill" color="blue"   icon-color="#1c84c6" />
      <StatTile :value="stats.teamCount"     label="Anggota Tim"         icon="fa-users"         color="orange" icon-color="#f0ad4e" />
      <StatTile :value="stats.achievementPct + '%'" label="Pencapaian Target" icon="fa-bullseye" color="red"    icon-color="#e74c3c" />
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px">
      <!-- Tim Sales -->
      <PanelBox title="Performa Tim Sales" icon="fa-users">
        <template #actions>
          <button class="btn-gen btn-teal btn-sm" @click="openSetTarget">
            <i class="fas fa-bullseye"></i> Set Target
          </button>
        </template>
        <table class="table-gen">
          <thead>
            <tr>
              <th>Nama</th><th>Role</th><th style="text-align:right">SO</th>
              <th style="text-align:right">Omzet</th><th style="text-align:center">Target</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="m in teamMembers" :key="m.id">
              <td>
                <div class="flex-row gap-8">
                  <div class="avatar" :style="{ background: roleColor(m.roleId), width:'26px', height:'26px', fontSize:'10px' }">
                    {{ initials(m.name) }}
                  </div>
                  <span style="font-size:12px;font-weight:500">{{ m.name }}</span>
                </div>
              </td>
              <td><span class="badge-gen" :style="{ background: roleColor(m.roleId) }">{{ roleName(m.roleId) }}</span></td>
              <td style="text-align:right;color:#455464">{{ m.totalOrder }}</td>
              <td style="text-align:right;color:#455464">{{ fmtCurrency(m.revenue) }}</td>
              <td style="min-width:100px">
                <div class="flex-between" style="margin-bottom:2px">
                  <span style="font-size:10px;color:#aaa">{{ m.pct }}%</span>
                </div>
                <div class="progress-gen">
                  <div class="progress-bar-gen"
                    :style="{ width: Math.min(m.pct,100)+'%', background: m.pct>=100?'#27AE60':m.pct>=70?'#f0ad4e':'#e74c3c' }">
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </PanelBox>

      <!-- Approval SO -->
      <PanelBox title="Sales Order Menunggu Approval" icon="fa-check-circle">
        <div v-if="pendingSO.length === 0" style="text-align:center;color:#aaa;padding:20px;font-size:12px">
          <i class="fas fa-check-circle" style="font-size:28px;display:block;margin-bottom:8px;color:#26B99A;opacity:.5"></i>
          Tidak ada SO menunggu approval
        </div>
        <div v-for="so in pendingSO" :key="so.id" class="so-card">
          <div class="flex-between mb-0">
            <div>
              <div style="font-weight:600;font-size:12.5px;color:#455464">{{ so.noSO }}</div>
              <div style="font-size:11px;color:#aaa">{{ so.customer }} &bull; {{ so.sales }}</div>
            </div>
            <div style="text-align:right">
              <div style="font-weight:600;color:#1c84c6;font-size:13px">{{ fmtCurrency(so.amount) }}</div>
              <div style="font-size:10px;color:#aaa">{{ so.date }}</div>
            </div>
          </div>
          <div class="flex-row gap-6" style="margin-top:8px">
            <button class="btn-gen btn-teal btn-xs" @click="approveOrder(so, 'approve')">
              <i class="fas fa-check"></i> Approve
            </button>
            <button class="btn-gen btn-red btn-xs" @click="openReject(so)">
              <i class="fas fa-times"></i> Reject
            </button>
            <span class="badge-gen badge-orange" style="margin-left:auto">Pending</span>
          </div>
        </div>
      </PanelBox>
    </div>

    <!-- Laporan Performa -->
    <PanelBox title="Laporan Performa Sales" icon="fa-chart-line">
      <template #actions>
        <div class="flex-row gap-8">
          <select v-model="filterMonth" class="search-select">
            <option v-for="m in months" :key="m.v" :value="m.v">{{ m.l }}</option>
          </select>
          <select v-model="filterYear"  class="search-select">
            <option v-for="y in years"  :key="y"   :value="y">{{ y }}</option>
          </select>
          <button class="btn-gen btn-outline btn-sm">
            <i class="fas fa-download"></i> Export
          </button>
        </div>
      </template>
      <table class="table-gen">
        <thead>
          <tr>
            <th>Sales</th><th>Role</th><th style="text-align:right">SO Dibuat</th>
            <th style="text-align:right">SO Approved</th><th style="text-align:right">Omzet</th>
            <th style="text-align:right">Target</th><th style="text-align:center">Pencapaian</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in performanceData" :key="r.id">
            <td>
              <div class="flex-row gap-8">
                <div class="avatar" :style="{ background: roleColor(r.roleId), width:'26px', height:'26px', fontSize:'10px' }">
                  {{ initials(r.name) }}
                </div>
                <span style="font-size:12px;font-weight:500">{{ r.name }}</span>
              </div>
            </td>
            <td><span class="badge-gen" :style="{ background: roleColor(r.roleId) }">{{ roleName(r.roleId) }}</span></td>
            <td style="text-align:right;color:#455464">{{ r.soTotal }}</td>
            <td style="text-align:right;color:#27AE60;font-weight:600">{{ r.soApproved }}</td>
            <td style="text-align:right;color:#1c84c6;font-weight:600">{{ fmtCurrency(r.omzet) }}</td>
            <td style="text-align:right;color:#738A9C">{{ fmtCurrency(r.target) }}</td>
            <td style="text-align:center;min-width:80px">
              <span
                class="badge-gen"
                :class="r.pct>=100?'badge-green':r.pct>=70?'badge-orange':'badge-red'"
              >{{ r.pct }}%</span>
            </td>
          </tr>
        </tbody>
      </table>
    </PanelBox>

    <!-- Modal: Set Target -->
    <AppModal v-model="showTargetModal" title="Set Target Sales" icon="fa-bullseye" width="480px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group-gen">
          <label class="form-label">Anggota Tim</label>
          <select v-model="targetForm.userId" class="form-control-gen">
            <option v-for="m in teamMembers" :key="m.id" :value="m.id">{{ m.name }}</option>
          </select>
        </div>
        <div class="form-group-gen">
          <label class="form-label">Bulan</label>
          <select v-model="targetForm.month" class="form-control-gen">
            <option v-for="m in months" :key="m.v" :value="m.v">{{ m.l }}</option>
          </select>
        </div>
        <div class="form-group-gen">
          <label class="form-label">Tahun</label>
          <select v-model="targetForm.year" class="form-control-gen">
            <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>
        <div class="form-group-gen">
          <label class="form-label">Target (Rp)</label>
          <input v-model="targetForm.amount" type="number" class="form-control-gen" placeholder="50000000" />
        </div>
      </div>
      <template #footer>
        <button class="btn-gen btn-outline" @click="showTargetModal=false">Batal</button>
        <button class="btn-gen btn-teal" @click="saveTarget">
          <i class="fas fa-save"></i> Simpan Target
        </button>
      </template>
    </AppModal>

    <!-- Modal: Reject SO -->
    <AppModal v-model="showRejectModal" title="Reject Sales Order" icon="fa-times-circle" width="420px">
      <div v-if="rejectSO" style="background:#FDF2F2;border-radius:3px;padding:10px 14px;margin-bottom:14px;font-size:12px">
        <strong>{{ rejectSO.noSO }}</strong> — {{ rejectSO.customer }}<br>
        <span style="color:#aaa">{{ fmtCurrency(rejectSO.amount) }}</span>
      </div>
      <div class="form-group-gen">
        <label class="form-label">Alasan Penolakan <span style="color:#e74c3c">*</span></label>
        <textarea v-model="rejectNotes" class="form-control-gen" rows="3"
          placeholder="Tuliskan alasan penolakan..."></textarea>
        <div v-if="rejectError" class="form-error">{{ rejectError }}</div>
      </div>
      <template #footer>
        <button class="btn-gen btn-outline" @click="showRejectModal=false">Batal</button>
        <button class="btn-gen btn-red" @click="confirmReject">
          <i class="fas fa-times"></i> Reject SO
        </button>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { ROLES, SAMPLE_USERS } from '@/data/constants'
import { useAuthStore } from '@/store'
import { SpvSalesService, SalesTargetService } from '@/api'
import PageHeader from '@/components/common/PageHeader.vue'
import PanelBox   from '@/components/common/PanelBox.vue'
import StatTile   from '@/components/common/StatTile.vue'
import AppModal   from '@/components/common/AppModal.vue'

const auth      = useAuthStore()
const showToast = inject('showToast')

// ── Helpers ──────────────────────────────────────────────────
function initials(name)   { return name.split(' ').slice(0,2).map(n=>n[0]).join('') }
function roleColor(rid)   { return ROLES.find(r=>r.id===rid)?.color || '#aaa' }
function roleName(rid)    { return ROLES.find(r=>r.id===rid)?.name  || '-' }
function fmtCurrency(v)   {
  if (!v && v !== 0) return '-'
  return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(v)
}

// ── Filter state ──────────────────────────────────────────────
const now = new Date()
const filterMonth = ref(now.getMonth() + 1)
const filterYear  = ref(now.getFullYear())
const months = [
  {v:1,l:'Januari'},{v:2,l:'Februari'},{v:3,l:'Maret'},{v:4,l:'April'},
  {v:5,l:'Mei'},{v:6,l:'Juni'},{v:7,l:'Juli'},{v:8,l:'Agustus'},
  {v:9,l:'September'},{v:10,l:'Oktober'},{v:11,l:'November'},{v:12,l:'Desember'},
]
const years = [now.getFullYear()-1, now.getFullYear(), now.getFullYear()+1]

// ── Mock data (diganti dengan API call ke SpvSalesService) ────
const stats = ref({ totalOrder: 47, totalRevenue: 1_250_000_000, teamCount: 4, achievementPct: 78 })

const salesRoleIds = [7, 8, 9, 13]
const teamMembers = ref(
  SAMPLE_USERS
    .filter(u => salesRoleIds.includes(u.roleId) && u.companyId === auth.activeCompanyId)
    .map((u, i) => ({
      ...u,
      totalOrder: [12, 8, 15, 9][i] || 5,
      revenue:    [320_000_000, 180_000_000, 420_000_000, 230_000_000][i] || 100_000_000,
      target:     350_000_000,
      pct:        Math.round(([320,180,420,230][i]||100) / 350 * 100),
    }))
)

const pendingSO = ref([
  { id:1, noSO:'SO-2024-0089', customer:'PT Sumber Rejeki',   sales:'Mario Sanjaya',  amount:45_000_000, date:'04 Jun 2024' },
  { id:2, noSO:'SO-2024-0090', customer:'CV Berkah Abadi',    sales:'Laila Indah',    amount:28_500_000, date:'04 Jun 2024' },
  { id:3, noSO:'SO-2024-0091', customer:'PT Cahaya Nusantara',sales:'Mario Sanjaya',  amount:72_000_000, date:'03 Jun 2024' },
])

const performanceData = computed(() =>
  teamMembers.value.map(m => ({
    id: m.id, name: m.name, roleId: m.roleId,
    soTotal:    m.totalOrder + 3,
    soApproved: m.totalOrder,
    omzet:      m.revenue,
    target:     m.target,
    pct:        m.pct,
  }))
)

// ── Actions ───────────────────────────────────────────────────
function refresh() {
  showToast('Data diperbarui', 'info')
  // Ganti dengan: SpvSalesService.dashboard({company_id: auth.activeCompanyId, ...})
}

function approveOrder(so, action) {
  pendingSO.value = pendingSO.value.filter(s => s.id !== so.id)
  showToast(`SO ${so.noSO} berhasil di-approve`)
  // Ganti dengan: SpvSalesService.approveOrder(so.id, action)
}

const showRejectModal = ref(false)
const rejectSO    = ref(null)
const rejectNotes = ref('')
const rejectError = ref('')

function openReject(so) {
  rejectSO.value    = so
  rejectNotes.value = ''
  rejectError.value = ''
  showRejectModal.value = true
}
function confirmReject() {
  if (!rejectNotes.value.trim()) { rejectError.value = 'Alasan wajib diisi'; return }
  pendingSO.value = pendingSO.value.filter(s => s.id !== rejectSO.value.id)
  showRejectModal.value = false
  showToast(`SO ${rejectSO.value.noSO} ditolak`, 'warning')
  // Ganti dengan: SpvSalesService.approveOrder(rejectSO.value.id, 'reject', rejectNotes.value)
}

// ── Set Target ────────────────────────────────────────────────
const showTargetModal = ref(false)
const targetForm = ref({ userId: '', month: filterMonth.value, year: filterYear.value, amount: '' })

function openSetTarget() {
  if (teamMembers.value.length) targetForm.value.userId = teamMembers.value[0].id
  showTargetModal.value = true
}
function saveTarget() {
  if (!targetForm.value.amount) return
  showTargetModal.value = false
  showToast('Target berhasil disimpan')
  // Ganti dengan: SpvSalesService.setTarget({
  //   user_id:       targetForm.value.userId,
  //   year:          targetForm.value.year,
  //   month:         targetForm.value.month,
  //   target_amount: targetForm.value.amount,
  //   company_id:    auth.activeCompanyId,
  // })
}
</script>

<style scoped>
.so-card {
  border: 1px solid #F0F0F0;
  border-radius: 3px;
  padding: 10px 12px;
  margin-bottom: 8px;
  transition: border-color .15s;
}
.so-card:hover { border-color: #26B99A; }
.so-card:last-child { margin-bottom: 0; }
</style>
