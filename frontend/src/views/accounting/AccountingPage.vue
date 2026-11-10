<template>
  <div>
    <PageHeader title="Accounting" :crumbs="[{ label: 'Modul ERP' }, { label: 'Accounting' }]" />

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
        <StatTile :value="journals.length" label="Jurnal Akuntansi" icon="fa-book" color="" icon-color="#26B99A" />
        <StatTile :value="chartOfAccounts.length" label="Chart of Accounts" icon="fa-list" color="blue" icon-color="#1c84c6" />
        <StatTile :value="toCompact(totalAsset)" label="Total Aset" icon="fa-coins" color="orange" icon-color="#f0ad4e" />
        <StatTile :value="toCompact(totalEquity)" label="Total Ekuitas" icon="fa-chart-pie" color="red" icon-color="#e74c3c" />
      </div>

      <PanelBox title="Modul Accounting" icon="fa-calculator">
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

        <template v-if="activeTab === 'jurnal'">
          <div class="search-row">
            <input v-model="journalSearch" class="search-input" placeholder="Cari no jurnal / deskripsi / referensi..." />
            <select v-model="journalStatusFilter" class="search-select">
              <option value="">Semua Status</option>
              <option value="draft">Draft</option>
              <option value="posted">Posted</option>
            </select>
            <button class="btn-gen btn-teal" @click="openJournalAdd"><i class="fas fa-plus"></i> Tambah Jurnal</button>
          </div>

          <table class="table-gen">
            <thead>
              <tr><th>No Jurnal</th><th>Tanggal</th><th>Deskripsi</th><th>Debit Akun</th><th>Nominal</th><th>Kredit Akun</th><th>Nominal</th><th>Referensi</th><th>Status</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              <tr v-if="filteredJournals.length === 0"><td colspan="10" style="text-align:center;color:#aaa">Tidak ada data jurnal</td></tr>
              <tr v-for="row in filteredJournals" :key="row.id">
                <td>{{ row.journalNumber }}</td>
                <td>{{ row.journalDate }}</td>
                <td>{{ row.description }}</td>
                <td>{{ row.debitAccount }}</td>
                <td>{{ toCurrency(row.debitAmount) }}</td>
                <td>{{ row.creditAccount }}</td>
                <td>{{ toCurrency(row.creditAmount) }}</td>
                <td>{{ row.reference }}</td>
                <td><span class="status-badge" :class="row.status">{{ row.status }}</span></td>
                <td>
                  <button class="btn-gen btn-outline btn-xs" @click="openJournalEdit(row)"><i class="fas fa-edit" style="color:#1c84c6"></i></button>
                  <button class="btn-gen btn-outline btn-xs" @click="removeJournal(row.id)"><i class="fas fa-trash" style="color:#e74c3c"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </template>

        <template v-else>
          <div class="search-row" style="margin-bottom:10px">
            <select v-model="reportMonth" class="search-select" style="max-width:180px">
              <option value="">Semua Bulan</option>
              <option v-for="m in 12" :key="m" :value="String(m).padStart(2, '0')">Bulan {{ String(m).padStart(2, '0') }}</option>
            </select>
            <button class="btn-gen btn-outline" @click="downloadNeracaCsv"><i class="fas fa-file-csv"></i> Unduh CSV</button>
            <button class="btn-gen btn-outline" @click="downloadNeracaPdf"><i class="fas fa-file-pdf"></i> Unduh PDF</button>
          </div>

          <div class="statement-grid">
            <div class="statement-card">
              <div class="statement-title">Neraca (Balance Sheet)</div>
              <div class="statement-content">
                <div class="section">
                  <div class="section-title">ASET</div>
                  <div class="section-subtitle">Aset Lancar</div>
                  <div v-for="item in balanceSheetAset.lancar" :key="item.name" class="line-item">
                    <span>{{ item.name }}</span>
                    <span>{{ toCurrency(item.amount) }}</span>
                  </div>
                  <div class="line-item" style="border-top:1px solid #ddd;margin-top:4px;padding-top:4px">
                    <span><strong>Total Aset Lancar</strong></span>
                    <span><strong>{{ toCurrency(totalAsetLancar) }}</strong></span>
                  </div>

                  <div class="section-subtitle" style="margin-top:10px">Aset Tetap</div>
                  <div v-for="item in balanceSheetAset.tetap" :key="item.name" class="line-item">
                    <span>{{ item.name }}</span>
                    <span>{{ toCurrency(item.amount) }}</span>
                  </div>

                  <div class="line-item" style="border-top:2px solid #333;margin-top:8px;padding-top:8px">
                    <span><strong>TOTAL ASET</strong></span>
                    <span><strong>{{ toCurrency(totalAsset) }}</strong></span>
                  </div>
                </div>

                <div class="section" style="margin-top:20px">
                  <div class="section-title">LIABILITAS</div>
                  <div class="section-subtitle">Liabilitas Lancar</div>
                  <div v-for="item in balanceSheetLiabilitas.lancar" :key="item.name" class="line-item">
                    <span>{{ item.name }}</span>
                    <span>{{ toCurrency(item.amount) }}</span>
                  </div>
                  <div class="line-item" style="border-top:2px solid #333;margin-top:8px;padding-top:8px">
                    <span><strong>TOTAL LIABILITAS</strong></span>
                    <span><strong>{{ toCurrency(totalLiability) }}</strong></span>
                  </div>
                </div>

                <div class="section" style="margin-top:20px">
                  <div class="section-title">EKUITAS</div>
                  <div v-for="item in balanceSheetEkuitas" :key="item.name" class="line-item">
                    <span>{{ item.name }}</span>
                    <span>{{ toCurrency(item.amount) }}</span>
                  </div>
                  <div class="line-item" style="border-top:2px solid #333;margin-top:8px;padding-top:8px">
                    <span><strong>TOTAL EKUITAS</strong></span>
                    <span><strong>{{ toCurrency(totalEquity) }}</strong></span>
                  </div>
                </div>

                <div class="line-item" style="border-top:2px solid #333;margin-top:20px;padding-top:8px;background:#f9f9f9">
                  <span><strong>TOTAL LIABILITAS & EKUITAS</strong></span>
                  <span><strong>{{ toCurrency(totalLiability + totalEquity) }}</strong></span>
                </div>
              </div>
            </div>

            <div class="statement-card">
              <div class="statement-title">Laporan Laba/Rugi (Income Statement)</div>
              <div class="statement-content">
                <div class="section">
                  <div class="section-title">PENDAPATAN</div>
                  <div v-for="item in incomeStatementPendapatan" :key="item.name" class="line-item">
                    <span>{{ item.name }}</span>
                    <span>{{ toCurrency(item.amount) }}</span>
                  </div>
                  <div class="line-item" style="border-top:1px solid #ddd;margin-top:4px;padding-top:4px">
                    <span><strong>Total Pendapatan</strong></span>
                    <span><strong>{{ toCurrency(totalRevenue) }}</strong></span>
                  </div>
                </div>

                <div class="section" style="margin-top:20px">
                  <div class="section-subtitle">Harga Pokok Penjualan</div>
                  <div v-for="item in incomeStatementCogs" :key="item.name" class="line-item">
                    <span>{{ item.name }}</span>
                    <span>{{ toCurrency(item.amount) }}</span>
                  </div>
                  <div class="line-item" style="border-top:1px solid #ddd;margin-top:4px;padding-top:4px">
                    <span><strong>Laba Kotor</strong></span>
                    <span><strong :style="{ color: totalRevenue + totalCogs >= 0 ? '#1a8a72' : '#e74c3c' }">{{ toCurrency(totalRevenue + totalCogs) }}</strong></span>
                  </div>
                </div>

                <div class="section" style="margin-top:20px">
                  <div class="section-subtitle">Beban Operasional</div>
                  <div v-for="item in incomeStatementBeban" :key="item.name" class="line-item">
                    <span>{{ item.name }}</span>
                    <span>{{ toCurrency(item.amount) }}</span>
                  </div>
                  <div class="line-item" style="border-top:2px solid #333;margin-top:8px;padding-top:8px;background:#f9f9f9">
                    <span><strong>LABA BERSIH</strong></span>
                    <span><strong :style="{ color: totalNetIncome >= 0 ? '#26B99A' : '#e74c3c' }">{{ toCurrency(totalNetIncome) }}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="chart-grid" style="margin-top:14px">
            <div class="chart-card">
              <div class="chart-title">Grafik Laba Bersih Bulanan</div>
              <div class="chart-bars">
                <div v-for="row in reportRows" :key="`net-${row.month}`" class="bar-item">
                  <div class="bar-label-top">{{ toCompact(row.netIncome) }}</div>
                  <div class="bar-track">
                    <div class="bar-fill" :style="{ height: `${netIncomeBarHeight(row)}%`, background: row.netIncome >= 0 ? '#26B99A' : '#e74c3c' }"></div>
                  </div>
                  <div class="bar-label-bottom">{{ row.month.slice(5) }}</div>
                </div>
              </div>
            </div>

            <div class="chart-card">
              <div class="chart-title">Grafik Total Aset vs Ekuitas</div>
              <div class="chart-bars">
                <div v-for="row in reportRows" :key="`asset-${row.month}`" class="bar-group">
                  <div class="bar-item-pair">
                    <div class="bar-label-top" style="font-size:9px">{{ toCompact(row.totalAsset) }}</div>
                    <div class="bar-track-narrow">
                      <div class="bar-fill" style="background:#1c84c6;height:100%"></div>
                    </div>
                  </div>
                  <div class="bar-item-pair">
                    <div class="bar-label-top" style="font-size:9px">{{ toCompact(row.totalEquity) }}</div>
                    <div class="bar-track-narrow">
                      <div class="bar-fill" style="background:#f0ad4e;height:100%"></div>
                    </div>
                  </div>
                  <div class="bar-label-bottom">{{ row.month.slice(5) }}</div>
                </div>
              </div>
              <div style="display:flex;gap:10px;font-size:11px;margin-top:8px">
                <div style="display:flex;align-items:center;gap:4px"><div style="width:12px;height:12px;background:#1c84c6;border-radius:2px"></div> Aset</div>
                <div style="display:flex;align-items:center;gap:4px"><div style="width:12px;height:12px;background:#f0ad4e;border-radius:2px"></div> Ekuitas</div>
              </div>
            </div>
          </div>

          <table class="table-gen" style="margin-top:14px">
            <thead>
              <tr><th>Bulan</th><th>Pendapatan</th><th>COGS</th><th>Laba Kotor</th><th>Beban Operasi</th><th>Laba Bersih</th><th>Total Aset</th><th>Total Liabilitas</th><th>Total Ekuitas</th></tr>
            </thead>
            <tbody>
              <tr v-if="reportRows.length === 0"><td colspan="9" style="text-align:center;color:#aaa">Tidak ada data laporan</td></tr>
              <tr v-for="row in reportRows" :key="row.month">
                <td>{{ formatMonth(row.month) }}</td>
                <td>{{ toCurrency(row.revenue) }}</td>
                <td>{{ toCurrency(row.cogs) }}</td>
                <td>{{ toCurrency(row.grossProfit) }}</td>
                <td>{{ toCurrency(row.operatingExpense) }}</td>
                <td :style="{ color: row.netIncome >= 0 ? '#1a8a72' : '#e74c3c', fontWeight: 600 }">{{ toCurrency(row.netIncome) }}</td>
                <td>{{ toCompact(row.totalAsset) }}</td>
                <td>{{ toCompact(row.totalLiability) }}</td>
                <td>{{ toCompact(row.totalEquity) }}</td>
              </tr>
            </tbody>
          </table>
        </template>
      </PanelBox>
    </template>

    <AppModal v-model="showJournalModal" :title="journalEditId ? 'Edit Jurnal Akuntansi' : 'Tambah Jurnal Akuntansi'" icon="fa-book" width="800px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group-gen"><label class="form-label">No Jurnal</label><input v-model="journalForm.journalNumber" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Tanggal</label><input v-model="journalForm.journalDate" type="date" class="form-control-gen" /></div>
        <div class="form-group-gen" style="grid-column:1/-1"><label class="form-label">Deskripsi</label><input v-model="journalForm.description" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Akun Debit</label><input v-model="journalForm.debitAccount" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Nominal Debit</label><input v-model.number="journalForm.debitAmount" type="number" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Akun Kredit</label><input v-model="journalForm.creditAccount" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Nominal Kredit</label><input v-model.number="journalForm.creditAmount" type="number" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Referensi</label><input v-model="journalForm.reference" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Status</label><select v-model="journalForm.status" class="form-control-gen"><option value="draft">Draft</option><option value="posted">Posted</option></select></div>
      </div>
      <template #footer>
        <button class="btn-gen btn-outline" @click="showJournalModal = false">Batal</button>
        <button class="btn-gen btn-teal" @click="saveJournal"><i class="fas fa-save"></i> Simpan</button>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue'
import { MODULES } from '@/data/constants'
import { DUMMY_ACCOUNTING_JOURNALS, DUMMY_CHART_OF_ACCOUNTS, DUMMY_BALANCE_SHEET, DUMMY_INCOME_STATEMENT, DUMMY_FINANCIAL_STATEMENT_MONTHLY } from '@/data/accountingDummy'
import { useAuthStore, usePermissionStore } from '@/store'
import AppModal from '@/components/common/AppModal.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import PanelBox from '@/components/common/PanelBox.vue'
import StatTile from '@/components/common/StatTile.vue'

const auth = useAuthStore()
const permStore = usePermissionStore()
const showToast = inject('showToast', () => {})

const subModules = computed(() => MODULES.filter(m => ['m18', 'm19'].includes(m.id)))
const hasAccess = computed(() => {
  const perms = permStore.getPerms(auth.activeCompanyId)
  return subModules.value.some(m => perms[m.id]?.[auth.currentUser.roleId])
})

const tabs = [
  { key: 'jurnal', label: 'Jurnal Akuntansi', icon: 'fa-book' },
  { key: 'neracalr', label: 'Neraca & L/R', icon: 'fa-file-invoice-dollar' },
]
const activeTab = ref('jurnal')

const journals = ref(JSON.parse(JSON.stringify(DUMMY_ACCOUNTING_JOURNALS)))
const chartOfAccounts = ref(JSON.parse(JSON.stringify(DUMMY_CHART_OF_ACCOUNTS)))
const balanceSheet = ref(JSON.parse(JSON.stringify(DUMMY_BALANCE_SHEET)))
const incomeStatement = ref(JSON.parse(JSON.stringify(DUMMY_INCOME_STATEMENT)))
const financialMonthly = ref(JSON.parse(JSON.stringify(DUMMY_FINANCIAL_STATEMENT_MONTHLY)))

const nextJournalId = ref(Math.max(...journals.value.map(v => v.id), 0) + 1)

const journalSearch = ref('')
const journalStatusFilter = ref('')

const filteredJournals = computed(() => journals.value.filter(v => {
  const q = journalSearch.value.toLowerCase()
  if (q && !`${v.journalNumber} ${v.description} ${v.reference}`.toLowerCase().includes(q)) return false
  if (journalStatusFilter.value && v.status !== journalStatusFilter.value) return false
  return true
}))

const showJournalModal = ref(false)
const journalEditId = ref(null)
const journalForm = ref(defaultJournalForm())

function defaultJournalForm() {
  return {
    journalNumber: '',
    journalDate: new Date().toISOString().slice(0, 10),
    description: '',
    debitAccount: '',
    debitAmount: 0,
    creditAccount: '',
    creditAmount: 0,
    reference: '',
    status: 'draft',
  }
}

function openJournalAdd() {
  journalEditId.value = null
  journalForm.value = {
    ...defaultJournalForm(),
    journalNumber: `JU-${new Date().getFullYear()}-${String(nextJournalId.value).padStart(4, '0')}`,
  }
  showJournalModal.value = true
}

function openJournalEdit(row) {
  journalEditId.value = row.id
  journalForm.value = { ...row }
  showJournalModal.value = true
}

function saveJournal() {
  if (!journalForm.value.journalNumber || journalForm.value.debitAmount !== journalForm.value.creditAmount) {
    showToast('Data tidak valid atau debit tidak sama dengan kredit')
    return
  }

  if (journalEditId.value) {
    const idx = journals.value.findIndex(v => v.id === journalEditId.value)
    if (idx !== -1) journals.value[idx] = { ...journals.value[idx], ...journalForm.value }
    showToast('Jurnal akuntansi diperbarui')
  } else {
    journals.value.push({ ...journalForm.value, id: nextJournalId.value++ })
    showToast('Jurnal akuntansi ditambahkan')
  }

  showJournalModal.value = false
}

function removeJournal(id) {
  if (!confirm('Hapus jurnal akuntansi?')) return
  journals.value = journals.value.filter(v => v.id !== id)
}

const reportMonth = ref('')

const reportRows = computed(() => financialMonthly.value)

const balanceSheetAset = computed(() => balanceSheet.value.aset)
const balanceSheetLiabilitas = computed(() => balanceSheet.value.liabilitas)
const balanceSheetEkuitas = computed(() => balanceSheet.value.ekuitas)

const incomeStatementPendapatan = computed(() => incomeStatement.value.pendapatan)
const incomeStatementCogs = computed(() => incomeStatement.value.hargaPokok)
const incomeStatementBeban = computed(() => incomeStatement.value.beban)

const totalAsetLancar = computed(() => balanceSheetAset.value.lancar.reduce((sum, v) => sum + Number(v.amount || 0), 0))
const totalAsetTetap = computed(() => balanceSheetAset.value.tetap.reduce((sum, v) => sum + Number(v.amount || 0), 0))
const totalAsset = computed(() => totalAsetLancar.value + totalAsetTetap.value)

const totalLiability = computed(() => balanceSheetLiabilitas.value.lancar.reduce((sum, v) => sum + Number(v.amount || 0), 0))
const totalEquity = computed(() => balanceSheetEkuitas.value.reduce((sum, v) => sum + Number(v.amount || 0), 0))

const totalRevenue = computed(() => incomeStatementPendapatan.value.reduce((sum, v) => sum + Number(v.amount || 0), 0))
const totalCogs = computed(() => incomeStatementCogs.value.reduce((sum, v) => sum + Number(v.amount || 0), 0))
const totalBeban = computed(() => incomeStatementBeban.value.reduce((sum, v) => sum + Number(v.amount || 0), 0))
const totalNetIncome = computed(() => totalRevenue.value + totalCogs + totalBeban.value)

const maxNetIncome = computed(() => Math.max(...reportRows.value.map(v => Math.abs(v.netIncome)), 1))

function netIncomeBarHeight(row) {
  return Math.max(8, Math.round((Math.abs(row.netIncome) / maxNetIncome.value) * 100))
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

function downloadNeracaCsv() {
  const lines = []
  lines.push('NERACA (BALANCE SHEET)')
  lines.push(`Periode: ${formatMonth(balanceSheet.value.period)}`)
  lines.push('')
  lines.push('ASET')
  lines.push('Aset Lancar')
  balanceSheetAset.value.lancar.forEach(item => {
    lines.push(`${item.name},${item.amount}`)
  })
  lines.push(`Total Aset Lancar,${totalAsetLancar.value}`)
  lines.push('Aset Tetap')
  balanceSheetAset.value.tetap.forEach(item => {
    lines.push(`${item.name},${item.amount}`)
  })
  lines.push(`TOTAL ASET,${totalAsset.value}`)
  lines.push('')
  lines.push('LIABILITAS')
  balanceSheetLiabilitas.value.lancar.forEach(item => {
    lines.push(`${item.name},${item.amount}`)
  })
  lines.push(`TOTAL LIABILITAS,${totalLiability.value}`)
  lines.push('')
  lines.push('EKUITAS')
  balanceSheetEkuitas.value.forEach(item => {
    lines.push(`${item.name},${item.amount}`)
  })
  lines.push(`TOTAL EKUITAS,${totalEquity.value}`)
  lines.push('')
  lines.push('LAPORAN LABA/RUGI (INCOME STATEMENT)')
  lines.push('PENDAPATAN')
  incomeStatementPendapatan.value.forEach(item => {
    lines.push(`${item.name},${item.amount}`)
  })
  lines.push(`Total Pendapatan,${totalRevenue.value}`)
  lines.push('HARGA POKOK PENJUALAN')
  incomeStatementCogs.value.forEach(item => {
    lines.push(`${item.name},${item.amount}`)
  })
  lines.push(`Laba Kotor,${totalRevenue.value + totalCogs}`)
  lines.push('BEBAN OPERASIONAL')
  incomeStatementBeban.value.forEach(item => {
    lines.push(`${item.name},${item.amount}`)
  })
  lines.push(`LABA BERSIH,${totalNetIncome.value}`)

  const csv = lines.join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `neraca-lr-${Date.now()}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

function downloadNeracaPdf() {
  const htmlContent = `
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial; margin: 20px; font-size: 12px; }
          .header { text-align: center; font-weight: bold; font-size: 14px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #333; padding: 8px; text-align: left; }
          .section-title { font-weight: bold; background: #f0f0f0; }
          .amount { text-align: right; }
          .total { font-weight: bold; border-top: 2px solid #333; border-bottom: 2px solid #333; }
          .grand-total { font-weight: bold; border-top: 3px solid #333; background: #f9f9f9; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>NERACA (BALANCE SHEET)</div>
          <div>Periode: ${formatMonth(balanceSheet.value.period)}</div>
        </div>
        <table>
          <tr class="section-title">
            <td colspan="2">ASET</td>
          </tr>
          <tr>
            <td colspan="2" style="background:#fafafa;font-weight:bold">Aset Lancar</td>
          </tr>
          ${balanceSheetAset.value.lancar.map(item => `<tr><td>${item.name}</td><td class="amount">${toCurrency(item.amount)}</td></tr>`).join('')}
          <tr class="total">
            <td>Total Aset Lancar</td>
            <td class="amount">${toCurrency(totalAsetLancar.value)}</td>
          </tr>
          <tr>
            <td colspan="2" style="background:#fafafa;font-weight:bold">Aset Tetap</td>
          </tr>
          ${balanceSheetAset.value.tetap.map(item => `<tr><td>${item.name}</td><td class="amount">${toCurrency(item.amount)}</td></tr>`).join('')}
          <tr class="total">
            <td><strong>TOTAL ASET</strong></td>
            <td class="amount"><strong>${toCurrency(totalAsset.value)}</strong></td>
          </tr>
        </table>

        <table>
          <tr class="section-title">
            <td colspan="2">LIABILITAS & EKUITAS</td>
          </tr>
          <tr>
            <td colspan="2" style="background:#fafafa;font-weight:bold">Liabilitas</td>
          </tr>
          ${balanceSheetLiabilitas.value.lancar.map(item => `<tr><td>${item.name}</td><td class="amount">${toCurrency(item.amount)}</td></tr>`).join('')}
          <tr class="total">
            <td>Total Liabilitas</td>
            <td class="amount">${toCurrency(totalLiability.value)}</td>
          </tr>
          <tr>
            <td colspan="2" style="background:#fafafa;font-weight:bold">Ekuitas</td>
          </tr>
          ${balanceSheetEkuitas.value.map(item => `<tr><td>${item.name}</td><td class="amount">${toCurrency(item.amount)}</td></tr>`).join('')}
          <tr class="total">
            <td>Total Ekuitas</td>
            <td class="amount">${toCurrency(totalEquity.value)}</td>
          </tr>
        </table>

        <div class="header" style="margin-top:40px;font-size:12px">
          <div>LAPORAN LABA/RUGI (INCOME STATEMENT)</div>
          <div>Periode: ${formatMonth(incomeStatement.value.period)}</div>
        </div>
        <table>
          <tr class="section-title">
            <td colspan="2">PENDAPATAN & BEBAN</td>
          </tr>
          ${incomeStatementPendapatan.value.map(item => `<tr><td>${item.name}</td><td class="amount">${toCurrency(item.amount)}</td></tr>`).join('')}
          <tr class="total">
            <td>Total Pendapatan</td>
            <td class="amount">${toCurrency(totalRevenue.value)}</td>
          </tr>
          <tr>
            <td colspan="2" style="background:#fafafa;font-weight:bold">Harga Pokok Penjualan</td>
          </tr>
          ${incomeStatementCogs.value.map(item => `<tr><td>${item.name}</td><td class="amount">${toCurrency(item.amount)}</td></tr>`).join('')}
          <tr class="total">
            <td>Laba Kotor</td>
            <td class="amount">${toCurrency(totalRevenue.value + totalCogs)}</td>
          </tr>
          <tr>
            <td colspan="2" style="background:#fafafa;font-weight:bold">Beban Operasional</td>
          </tr>
          ${incomeStatementBeban.value.map(item => `<tr><td>${item.name}</td><td class="amount">${toCurrency(item.amount)}</td></tr>`).join('')}
          <tr class="grand-total">
            <td><strong>LABA BERSIH</strong></td>
            <td class="amount"><strong>${toCurrency(totalNetIncome.value)}</strong></td>
          </tr>
        </table>
      </body>
    </html>
  `

  const printWindow = window.open('', '_blank')
  printWindow.document.write(htmlContent)
  printWindow.document.close()
  setTimeout(() => printWindow.print(), 250)
}
</script>

<style scoped>
.statement-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 14px;
}

.statement-card {
  border: 1px solid #eef1f5;
  border-radius: 10px;
  background: #fff;
  overflow: hidden;
}

.statement-title {
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #455464 0%, #34495e 100%);
  padding: 10px 12px;
}

.statement-content {
  padding: 12px;
  font-size: 11px;
  font-family: 'Courier New', monospace;
}

.section {
  margin-bottom: 16px;
}

.section-title {
  font-weight: 700;
  color: #455464;
  margin-bottom: 6px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-subtitle {
  font-weight: 600;
  color: #6b7786;
  margin-bottom: 4px;
  font-size: 10px;
  margin-top: 8px;
}

.line-item {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 14px;
}

.chart-card {
  border: 1px solid #eef1f5;
  border-radius: 10px;
  background: #fff;
  padding: 12px;
}

.chart-title {
  font-size: 12px;
  font-weight: 700;
  color: #455464;
  margin-bottom: 8px;
}

.chart-bars {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(48px, 1fr));
  gap: 8px;
  align-items: end;
  min-height: 150px;
}

.bar-item {
  display: grid;
  gap: 4px;
  justify-items: center;
}

.bar-label-top {
  font-size: 9px;
  color: #7b8b9b;
  white-space: nowrap;
}

.bar-track {
  width: 22px;
  height: 100px;
  border-radius: 5px;
  background: linear-gradient(180deg, #f5f9fc 0%, #eef3f7 100%);
  display: flex;
  align-items: end;
  overflow: hidden;
}

.bar-fill {
  width: 100%;
  border-radius: 5px;
  transition: height 0.3s ease;
  min-height: 2px;
}

.bar-label-bottom {
  font-size: 9px;
  color: #6b7786;
}

.bar-group {
  display: grid;
  gap: 3px;
  justify-items: center;
  align-items: end;
}

.bar-item-pair {
  display: grid;
  gap: 2px;
  justify-items: center;
}

.bar-track-narrow {
  width: 10px;
  height: 60px;
  border-radius: 3px;
  background: linear-gradient(180deg, #f5f9fc 0%, #eef3f7 100%);
  display: flex;
  align-items: end;
  overflow: hidden;
}

.status-badge.draft,
.status-badge.nonaktif {
  background: #fff4dd;
  color: #f39c12;
}

.status-badge.posted,
.status-badge.aktif {
  background: #e8f8f5;
  color: #1a8a72;
}
</style>
