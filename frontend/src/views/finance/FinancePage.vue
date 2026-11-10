<template>
  <div>
    <PageHeader title="Finance" :crumbs="[{ label: 'Modul ERP' }, { label: 'Finance' }]" />

    <div v-if="!hasAccess" class="panel-gen">
      <div class="panel-gen-body" style="text-align:center;padding:40px">
        <i class="fas fa-lock" style="font-size:40px;color:#e74c3c;margin-bottom:12px;display:block;opacity:.5"></i>
        <h3 style="color:#455464;font-size:16px;margin-bottom:6px">Akses Dibatasi</h3>
        <p style="color:#aaa;font-size:13px">
          Role <strong>{{ auth.currentRole?.name }}</strong> tidak memiliki hak akses ke modul ini.
        </p>
      </div>
    </div>

    <template v-else>
      <div class="tile-row" style="grid-template-columns:repeat(auto-fit,minmax(210px,1fr))">
        <StatTile :value="cashBankAccounts.length" label="Akun Kas & Bank" icon="fa-university" color="" icon-color="#26B99A" />
        <StatTile :value="cashBankTransactions.length" label="Transaksi" icon="fa-money-check-alt" color="blue" icon-color="#1c84c6" />
        <StatTile :value="toCompact(totalCurrentBalance)" label="Total Saldo" icon="fa-wallet" color="orange" icon-color="#f0ad4e" />
        <StatTile :value="toCompact(reportNetProfit)" label="Laba Bersih" icon="fa-chart-line" color="red" icon-color="#e74c3c" />
      </div>

      <PanelBox title="Modul Finance" icon="fa-coins">
        <div class="flex-row gap-8" style="flex-wrap:wrap;margin-bottom:14px">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="btn-gen btn-sm"
            :class="activeTab === tab.key ? 'btn-teal' : 'btn-outline'"
            @click="activeTab = tab.key"
          >
            <i class="fas" :class="tab.icon"></i> {{ tab.label }}
          </button>
        </div>

        <template v-if="activeTab === 'kasbank'">
          <div style="display:grid;grid-template-columns:1fr;gap:14px">
            <div>
              <div class="search-row">
                <input v-model="accountSearch" class="search-input" placeholder="Cari kode / nama akun kas & bank..." />
                <select v-model="accountStatusFilter" class="search-select">
                  <option value="">Semua Status</option>
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
                <button class="btn-gen btn-teal" @click="openAccountAdd"><i class="fas fa-plus"></i> Tambah Akun</button>
              </div>

              <table class="table-gen">
                <thead>
                  <tr><th>Kode</th><th>Nama Akun</th><th>Tipe</th><th>Bank/No Rek</th><th>Saldo</th><th>Status</th><th>Aksi</th></tr>
                </thead>
                <tbody>
                  <tr v-if="filteredAccounts.length === 0"><td colspan="7" style="text-align:center;color:#aaa">Tidak ada data</td></tr>
                  <tr v-for="row in filteredAccounts" :key="row.id">
                    <td>{{ row.accountCode }}</td>
                    <td>{{ row.accountName }}</td>
                    <td><span class="status-badge" :class="row.accountType">{{ row.accountType }}</span></td>
                    <td>
                      <div>{{ row.bankName }}</div>
                      <div style="font-size:10px;color:#8899a6">{{ row.accountNumber }}</div>
                    </td>
                    <td>{{ toCurrency(row.balance) }}</td>
                    <td><span class="status-badge" :class="row.status">{{ row.status }}</span></td>
                    <td>
                      <button class="btn-gen btn-outline btn-xs" @click="openAccountEdit(row)"><i class="fas fa-edit" style="color:#1c84c6"></i></button>
                      <button class="btn-gen btn-outline btn-xs" @click="removeAccount(row.id)"><i class="fas fa-trash" style="color:#e74c3c"></i></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <div class="search-row">
                <input v-model="trxSearch" class="search-input" placeholder="Cari no transaksi / referensi / kategori..." />
                <select v-model="trxTypeFilter" class="search-select">
                  <option value="">Semua Tipe</option>
                  <option value="masuk">Kas Masuk</option>
                  <option value="keluar">Kas Keluar</option>
                </select>
                <select v-model="trxStatusFilter" class="search-select">
                  <option value="">Semua Status</option>
                  <option value="draft">Draft</option>
                  <option value="posted">Posted</option>
                </select>
                <button class="btn-gen btn-teal" @click="openTrxAdd"><i class="fas fa-plus"></i> Tambah Transaksi</button>
              </div>

              <table class="table-gen">
                <thead>
                  <tr><th>No Transaksi</th><th>Tanggal</th><th>Akun</th><th>Kategori</th><th>Referensi</th><th>Tipe</th><th>Nominal</th><th>Status</th><th>Aksi</th></tr>
                </thead>
                <tbody>
                  <tr v-if="filteredTransactions.length === 0"><td colspan="9" style="text-align:center;color:#aaa">Tidak ada data</td></tr>
                  <tr v-for="row in filteredTransactions" :key="row.id">
                    <td>{{ row.trxNumber }}</td>
                    <td>{{ row.trxDate }}</td>
                    <td>{{ accountName(row.accountId) }}</td>
                    <td>{{ row.category }}</td>
                    <td>{{ row.reference }}</td>
                    <td><span class="status-badge" :class="row.trxType">{{ row.trxType }}</span></td>
                    <td :style="{ color: row.trxType === 'keluar' ? '#e74c3c' : '#1a8a72', fontWeight: 600 }">{{ toCurrency(row.amount) }}</td>
                    <td><span class="status-badge" :class="row.status">{{ row.status }}</span></td>
                    <td>
                      <button class="btn-gen btn-outline btn-xs" @click="openTrxEdit(row)"><i class="fas fa-edit" style="color:#1c84c6"></i></button>
                      <button class="btn-gen btn-outline btn-xs" @click="removeTrx(row.id)"><i class="fas fa-trash" style="color:#e74c3c"></i></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="search-row" style="margin-bottom:10px">
            <select v-model="reportYear" class="search-select" style="max-width:180px">
              <option value="">Semua Tahun</option>
              <option v-for="y in reportYears" :key="y" :value="String(y)">{{ y }}</option>
            </select>
            <button class="btn-gen btn-outline" @click="downloadFinanceReportCsv"><i class="fas fa-file-download"></i> Unduh CSV</button>
          </div>

          <div class="finance-grid">
            <div class="finance-card">
              <div class="finance-card-title">Ringkasan Laporan Keuangan</div>
              <div class="summary-list">
                <div class="summary-item"><span>Total Pendapatan</span><strong>{{ toCurrency(reportTotalRevenue) }}</strong></div>
                <div class="summary-item"><span>Total Beban</span><strong>{{ toCurrency(reportTotalExpense) }}</strong></div>
                <div class="summary-item"><span>Laba Bersih</span><strong :style="{ color: reportNetProfit >= 0 ? '#1a8a72' : '#e74c3c' }">{{ toCurrency(reportNetProfit) }}</strong></div>
                <div class="summary-item"><span>Arus Kas Bersih</span><strong :style="{ color: reportNetCashFlow >= 0 ? '#1a8a72' : '#e74c3c' }">{{ toCurrency(reportNetCashFlow) }}</strong></div>
              </div>
            </div>

            <div class="finance-card">
              <div class="finance-card-title">Grafik Laba Bersih Bulanan</div>
              <div class="chart-wrap">
                <div class="chart-bars">
                  <div v-for="row in reportRows" :key="row.month" class="bar-group">
                    <div class="bar-label-top">{{ toCompact(row.revenue - row.expense) }}</div>
                    <div class="bar-track">
                      <div
                        class="bar-fill"
                        :style="{ height: `${profitBarHeight(row)}%`, background: row.revenue - row.expense >= 0 ? '#26B99A' : '#e74c3c' }"
                      ></div>
                    </div>
                    <div class="bar-label-bottom">{{ formatMonth(row.month) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <table class="table-gen" style="margin-top:14px">
            <thead>
              <tr><th>Bulan</th><th>Pendapatan</th><th>Beban</th><th>Laba Bersih</th><th>Kas Masuk</th><th>Kas Keluar</th><th>Net Cash Flow</th></tr>
            </thead>
            <tbody>
              <tr v-if="reportRows.length === 0"><td colspan="7" style="text-align:center;color:#aaa">Tidak ada data laporan</td></tr>
              <tr v-for="row in reportRows" :key="row.month">
                <td>{{ formatMonth(row.month) }}</td>
                <td>{{ toCurrency(row.revenue) }}</td>
                <td>{{ toCurrency(row.expense) }}</td>
                <td :style="{ color: row.revenue - row.expense >= 0 ? '#1a8a72' : '#e74c3c', fontWeight: 600 }">{{ toCurrency(row.revenue - row.expense) }}</td>
                <td>{{ toCurrency(row.cashIn) }}</td>
                <td>{{ toCurrency(row.cashOut) }}</td>
                <td :style="{ color: row.cashIn - row.cashOut >= 0 ? '#1a8a72' : '#e74c3c', fontWeight: 600 }">{{ toCurrency(row.cashIn - row.cashOut) }}</td>
              </tr>
            </tbody>
          </table>
        </template>
      </PanelBox>
    </template>

    <AppModal v-model="showAccountModal" :title="accountEditId ? 'Edit Akun Kas & Bank' : 'Tambah Akun Kas & Bank'" icon="fa-university" width="700px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group-gen"><label class="form-label">Kode Akun</label><input v-model="accountForm.accountCode" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Nama Akun</label><input v-model="accountForm.accountName" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Tipe</label><select v-model="accountForm.accountType" class="form-control-gen"><option value="kas">Kas</option><option value="bank">Bank</option></select></div>
        <div class="form-group-gen"><label class="form-label">Nama Bank</label><input v-model="accountForm.bankName" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">No Rekening</label><input v-model="accountForm.accountNumber" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Saldo</label><input v-model.number="accountForm.balance" type="number" class="form-control-gen" /></div>
      </div>
      <template #footer>
        <button class="btn-gen btn-outline" @click="showAccountModal = false">Batal</button>
        <button class="btn-gen btn-teal" @click="saveAccount"><i class="fas fa-save"></i> Simpan</button>
      </template>
    </AppModal>

    <AppModal v-model="showTrxModal" :title="trxEditId ? 'Edit Transaksi Kas & Bank' : 'Tambah Transaksi Kas & Bank'" icon="fa-money-check-alt" width="700px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group-gen"><label class="form-label">No Transaksi</label><input v-model="trxForm.trxNumber" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Tanggal</label><input v-model="trxForm.trxDate" type="date" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Akun</label><select v-model="trxForm.accountId" class="form-control-gen"><option v-for="a in cashBankAccounts" :key="a.id" :value="a.id">{{ a.accountName }}</option></select></div>
        <div class="form-group-gen"><label class="form-label">Tipe</label><select v-model="trxForm.trxType" class="form-control-gen"><option value="masuk">Kas Masuk</option><option value="keluar">Kas Keluar</option></select></div>
        <div class="form-group-gen"><label class="form-label">Kategori</label><input v-model="trxForm.category" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Referensi</label><input v-model="trxForm.reference" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Nominal</label><input v-model.number="trxForm.amount" type="number" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Status</label><select v-model="trxForm.status" class="form-control-gen"><option value="draft">Draft</option><option value="posted">Posted</option></select></div>
      </div>
      <template #footer>
        <button class="btn-gen btn-outline" @click="showTrxModal = false">Batal</button>
        <button class="btn-gen btn-teal" @click="saveTrx"><i class="fas fa-save"></i> Simpan</button>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue'
import { MODULES } from '@/data/constants'
import { DUMMY_CASH_BANK_ACCOUNTS, DUMMY_CASH_BANK_TRANSACTIONS, DUMMY_FINANCIAL_REPORT_MONTHLY } from '@/data/financeDummy'
import { useAuthStore, usePermissionStore } from '@/store'
import AppModal from '@/components/common/AppModal.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import PanelBox from '@/components/common/PanelBox.vue'
import StatTile from '@/components/common/StatTile.vue'

const auth = useAuthStore()
const permStore = usePermissionStore()
const showToast = inject('showToast', () => {})

const subModules = computed(() => MODULES.filter(m => ['m16', 'm17'].includes(m.id)))
const hasAccess = computed(() => {
  const perms = permStore.getPerms(auth.activeCompanyId)
  return subModules.value.some(m => perms[m.id]?.[auth.currentUser.roleId])
})

const tabs = [
  { key: 'kasbank', label: 'Kas & Bank', icon: 'fa-university' },
  { key: 'laporan', label: 'Laporan Keuangan', icon: 'fa-file-invoice-dollar' },
]
const activeTab = ref('kasbank')

const cashBankAccounts = ref(JSON.parse(JSON.stringify(DUMMY_CASH_BANK_ACCOUNTS)))
const cashBankTransactions = ref(JSON.parse(JSON.stringify(DUMMY_CASH_BANK_TRANSACTIONS)))
const financialMonthly = ref(JSON.parse(JSON.stringify(DUMMY_FINANCIAL_REPORT_MONTHLY)))

const nextAccountId = ref(Math.max(...cashBankAccounts.value.map(v => v.id), 0) + 1)
const nextTrxId = ref(Math.max(...cashBankTransactions.value.map(v => v.id), 0) + 1)

const accountSearch = ref('')
const accountStatusFilter = ref('')

const trxSearch = ref('')
const trxTypeFilter = ref('')
const trxStatusFilter = ref('')

const filteredAccounts = computed(() => cashBankAccounts.value.filter(v => {
  const q = accountSearch.value.toLowerCase()
  if (q && !`${v.accountCode} ${v.accountName}`.toLowerCase().includes(q)) return false
  if (accountStatusFilter.value && v.status !== accountStatusFilter.value) return false
  return true
}))

const filteredTransactions = computed(() => cashBankTransactions.value.filter(v => {
  const q = trxSearch.value.toLowerCase()
  if (q && !`${v.trxNumber} ${v.reference} ${v.category}`.toLowerCase().includes(q)) return false
  if (trxTypeFilter.value && v.trxType !== trxTypeFilter.value) return false
  if (trxStatusFilter.value && v.status !== trxStatusFilter.value) return false
  return true
}))

const showAccountModal = ref(false)
const accountEditId = ref(null)
const accountForm = ref(defaultAccountForm())

const showTrxModal = ref(false)
const trxEditId = ref(null)
const trxForm = ref(defaultTrxForm())

function defaultAccountForm() {
  return {
    accountCode: '',
    accountName: '',
    accountType: 'bank',
    bankName: '',
    accountNumber: '',
    currency: 'IDR',
    balance: 0,
    status: 'aktif',
  }
}

function defaultTrxForm() {
  return {
    trxNumber: '',
    trxDate: new Date().toISOString().slice(0, 10),
    accountId: cashBankAccounts.value[0]?.id ?? null,
    trxType: 'masuk',
    category: '',
    reference: '',
    description: '',
    amount: 0,
    status: 'draft',
  }
}

function openAccountAdd() {
  accountEditId.value = null
  accountForm.value = {
    ...defaultAccountForm(),
    accountCode: `KB-${String(nextAccountId.value).padStart(3, '0')}`,
    bankName: '-',
    accountNumber: '-',
  }
  showAccountModal.value = true
}

function openAccountEdit(row) {
  accountEditId.value = row.id
  accountForm.value = { ...row }
  showAccountModal.value = true
}

function saveAccount() {
  if (!accountForm.value.accountCode || !accountForm.value.accountName) return

  if (accountForm.value.accountType === 'kas') {
    accountForm.value.bankName = '-'
    accountForm.value.accountNumber = '-'
  }

  if (accountEditId.value) {
    const idx = cashBankAccounts.value.findIndex(v => v.id === accountEditId.value)
    if (idx !== -1) cashBankAccounts.value[idx] = { ...cashBankAccounts.value[idx], ...accountForm.value }
    showToast('Akun kas & bank diperbarui')
  } else {
    cashBankAccounts.value.push({ ...accountForm.value, id: nextAccountId.value++ })
    showToast('Akun kas & bank ditambahkan')
  }

  showAccountModal.value = false
}

function removeAccount(id) {
  if (!confirm('Hapus akun kas & bank?')) return
  cashBankAccounts.value = cashBankAccounts.value.filter(v => v.id !== id)
  cashBankTransactions.value = cashBankTransactions.value.filter(v => v.accountId !== id)
}

function openTrxAdd() {
  trxEditId.value = null
  trxForm.value = {
    ...defaultTrxForm(),
    trxNumber: `TRX-FIN-${new Date().getFullYear()}-${String(nextTrxId.value).padStart(4, '0')}`,
  }
  showTrxModal.value = true
}

function openTrxEdit(row) {
  trxEditId.value = row.id
  trxForm.value = { ...row }
  showTrxModal.value = true
}

function saveTrx() {
  if (!trxForm.value.trxNumber || !trxForm.value.accountId || Number(trxForm.value.amount || 0) <= 0) return

  if (trxEditId.value) {
    const idx = cashBankTransactions.value.findIndex(v => v.id === trxEditId.value)
    if (idx !== -1) cashBankTransactions.value[idx] = { ...cashBankTransactions.value[idx], ...trxForm.value }
    showToast('Transaksi kas & bank diperbarui')
  } else {
    cashBankTransactions.value.push({ ...trxForm.value, id: nextTrxId.value++ })
    showToast('Transaksi kas & bank ditambahkan')
  }

  showTrxModal.value = false
}

function removeTrx(id) {
  if (!confirm('Hapus transaksi kas & bank?')) return
  cashBankTransactions.value = cashBankTransactions.value.filter(v => v.id !== id)
}

const reportYear = ref('')

const reportRows = computed(() => financialMonthly.value.filter(v => {
  if (!reportYear.value) return true
  return v.month.slice(0, 4) === reportYear.value
}))

const reportYears = computed(() => {
  const years = new Set(financialMonthly.value.map(v => Number(v.month.slice(0, 4))))
  return [...years].sort((a, b) => b - a)
})

const reportTotalRevenue = computed(() => reportRows.value.reduce((sum, v) => sum + Number(v.revenue || 0), 0))
const reportTotalExpense = computed(() => reportRows.value.reduce((sum, v) => sum + Number(v.expense || 0), 0))
const reportNetProfit = computed(() => reportTotalRevenue.value - reportTotalExpense.value)
const reportNetCashFlow = computed(() => reportRows.value.reduce((sum, v) => sum + Number(v.cashIn || 0) - Number(v.cashOut || 0), 0))

const totalCurrentBalance = computed(() => cashBankAccounts.value.reduce((sum, v) => sum + Number(v.balance || 0), 0))

const maxAbsProfit = computed(() => {
  const maxVal = reportRows.value.reduce((max, v) => {
    const p = Math.abs(Number(v.revenue || 0) - Number(v.expense || 0))
    return p > max ? p : max
  }, 0)
  return maxVal || 1
})

function profitBarHeight(row) {
  const profit = Math.abs(Number(row.revenue || 0) - Number(row.expense || 0))
  return Math.round((profit / maxAbsProfit.value) * 100)
}

function accountName(id) {
  return cashBankAccounts.value.find(v => v.id === Number(id))?.accountName || '-'
}

function toCurrency(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value || 0))
}

function toCompact(value) {
  return new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 }).format(Number(value || 0))
}

function formatMonth(monthString) {
  const [year, month] = String(monthString || '').split('-')
  const date = new Date(Number(year), Number(month) - 1, 1)
  return date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
}

function downloadFinanceReportCsv() {
  const header = ['Bulan', 'Pendapatan', 'Beban', 'Laba Bersih', 'Kas Masuk', 'Kas Keluar', 'Net Cash Flow']
  const rows = reportRows.value.map(v => [
    formatMonth(v.month),
    String(v.revenue),
    String(v.expense),
    String(v.revenue - v.expense),
    String(v.cashIn),
    String(v.cashOut),
    String(v.cashIn - v.cashOut),
  ])
  const csv = [header, ...rows].map(cols => cols.map(v => `"${String(v).replaceAll('"', '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `laporan-keuangan-${Date.now()}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.finance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 14px;
}

.finance-card {
  border: 1px solid #eef1f5;
  border-radius: 12px;
  background: #fff;
  padding: 14px;
}

.finance-card-title {
  font-size: 13px;
  font-weight: 700;
  color: #455464;
  margin-bottom: 10px;
}

.summary-list {
  display: grid;
  gap: 8px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #f2f4f8;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 12px;
  color: #6b7786;
}

.summary-item strong {
  color: #34495e;
  font-size: 12px;
}

.chart-wrap {
  border: 1px dashed #dfe6ee;
  border-radius: 10px;
  padding: 10px;
  min-height: 220px;
}

.chart-bars {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(52px, 1fr));
  gap: 10px;
  align-items: end;
  min-height: 190px;
}

.bar-group {
  display: grid;
  gap: 6px;
  justify-items: center;
}

.bar-label-top {
  font-size: 10px;
  color: #7b8b9b;
  white-space: nowrap;
}

.bar-track {
  width: 26px;
  height: 130px;
  border-radius: 7px;
  background: linear-gradient(180deg, #f5f9fc 0%, #eef3f7 100%);
  display: flex;
  align-items: end;
  overflow: hidden;
}

.bar-fill {
  width: 100%;
  border-radius: 7px;
  transition: height 0.3s ease;
}

.bar-label-bottom {
  font-size: 10px;
  color: #6b7786;
}

.status-badge.kas,
.status-badge.masuk,
.status-badge.aktif,
.status-badge.posted {
  background: #e8f8f5;
  color: #1a8a72;
}

.status-badge.bank,
.status-badge.draft {
  background: #fff4dd;
  color: #f39c12;
}

.status-badge.keluar,
.status-badge.nonaktif {
  background: #fdecec;
  color: #e74c3c;
}
</style>
