<template>
  <div>
    <PageHeader title="Import" :crumbs="[{ label: 'Modul ERP' }, { label: 'Import' }]" />

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
        <StatTile :value="goodsReceipts.length" label="Penerimaan Barang" icon="fa-boxes" color="" icon-color="#26B99A" />
        <StatTile :value="clearances.length" label="Clearance Barang" icon="fa-clipboard-check" color="blue" icon-color="#1c84c6" />
        <StatTile :value="importDocs.length" label="Dokumen Impor" icon="fa-file-alt" color="orange" icon-color="#f0ad4e" />
        <StatTile :value="formatCompactNumber(reportTotalCost)" label="Biaya Clearance" icon="fa-money-bill-wave" color="red" icon-color="#e74c3c" />
      </div>

      <PanelBox title="Modul Import" icon="fa-ship">
        <div class="flex-row gap-8" style="flex-wrap:wrap;margin-bottom:14px">
          <button v-for="tab in tabs" :key="tab.key" class="btn-gen btn-sm" :class="activeTab===tab.key ? 'btn-teal':'btn-outline'" @click="activeTab=tab.key">
            <i class="fas" :class="tab.icon"></i> {{ tab.label }}
          </button>
        </div>

        <template v-if="activeTab==='receipt'">
          <div class="search-row">
            <input v-model="receiptSearch" class="search-input" placeholder="Cari no penerimaan / PO / item..." />
            <button class="btn-gen btn-teal" @click="openReceiptAdd"><i class="fas fa-plus"></i> Tambah</button>
          </div>
          <table class="table-gen">
            <thead>
              <tr><th>No Penerimaan</th><th>No PO</th><th>Supplier</th><th>Tanggal</th><th>Item</th><th>Qty</th><th>Status</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              <tr v-if="filteredReceipts.length===0"><td colspan="8" style="text-align:center;color:#aaa">Tidak ada data</td></tr>
              <tr v-for="r in filteredReceipts" :key="r.id">
                <td>{{ r.receiptNumber }}</td><td>{{ r.poNumber }}</td><td>{{ r.supplier }}</td><td>{{ r.receiptDate }}</td><td>{{ r.itemName }}</td><td>{{ r.qtyReceived }} {{ r.unit }}</td>
                <td><span class="status-badge" :class="r.status">{{ r.status }}</span></td>
                <td>
                  <button class="btn-gen btn-outline btn-xs" @click="openReceiptEdit(r)"><i class="fas fa-edit" style="color:#1c84c6"></i></button>
                  <button class="btn-gen btn-outline btn-xs" @click="removeReceipt(r.id)"><i class="fas fa-trash" style="color:#e74c3c"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </template>

        <template v-else-if="activeTab==='clearance'">
          <div class="search-row">
            <input v-model="clearanceSearch" class="search-input" placeholder="Cari clearance / BL / vessel..." />
            <button class="btn-gen btn-teal" @click="openClearanceAdd"><i class="fas fa-plus"></i> Tambah</button>
          </div>
          <table class="table-gen">
            <thead>
              <tr><th>No Clearance</th><th>BL</th><th>Vessel</th><th>ETA</th><th>Release</th><th>Biaya</th><th>Status</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              <tr v-if="filteredClearances.length===0"><td colspan="8" style="text-align:center;color:#aaa">Tidak ada data</td></tr>
              <tr v-for="c in filteredClearances" :key="c.id">
                <td>{{ c.clearanceNumber }}</td><td>{{ c.blNumber }}</td><td>{{ c.vesselName }}</td><td>{{ c.etaDate }}</td><td>{{ c.releaseDate || '-' }}</td><td>{{ toCurrency(c.clearanceCost) }}</td>
                <td><span class="status-badge" :class="c.status">{{ c.status }}</span></td>
                <td>
                  <button class="btn-gen btn-outline btn-xs" @click="openClearanceEdit(c)"><i class="fas fa-edit" style="color:#1c84c6"></i></button>
                  <button class="btn-gen btn-outline btn-xs" @click="removeClearance(c.id)"><i class="fas fa-trash" style="color:#e74c3c"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </template>

        <template v-else-if="activeTab==='document'">
          <div class="search-row">
            <input v-model="docSearch" class="search-input" placeholder="Cari no dokumen / tipe..." />
            <button class="btn-gen btn-teal" @click="openDocAdd"><i class="fas fa-plus"></i> Tambah</button>
          </div>
          <table class="table-gen">
            <thead>
              <tr><th>No Dokumen</th><th>Tipe</th><th>File</th><th>No Clearance</th><th>Tgl Terbit</th><th>Expired</th><th>Status</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              <tr v-if="filteredDocs.length===0"><td colspan="8" style="text-align:center;color:#aaa">Tidak ada data</td></tr>
              <tr v-for="d in filteredDocs" :key="d.id">
                <td>{{ d.docNumber }}</td><td>{{ d.docType }}</td><td>{{ d.fileName }}</td><td>{{ clearanceNumber(d.clearanceId) }}</td><td>{{ d.issueDate }}</td><td>{{ d.expireDate || '-' }}</td>
                <td><span class="status-badge" :class="d.status">{{ d.status }}</span></td>
                <td>
                  <button class="btn-gen btn-outline btn-xs" @click="openDocEdit(d)"><i class="fas fa-edit" style="color:#1c84c6"></i></button>
                  <button class="btn-gen btn-outline btn-xs" @click="removeDoc(d.id)"><i class="fas fa-trash" style="color:#e74c3c"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </template>

        <template v-else>
          <div class="search-row" style="margin-bottom:8px">
            <select v-model="reportMonth" class="search-select" style="max-width:180px">
              <option value="">Semua Bulan</option>
              <option v-for="m in 12" :key="m" :value="String(m).padStart(2, '0')">Bulan {{ String(m).padStart(2, '0') }}</option>
            </select>
            <select v-model="reportYear" class="search-select" style="max-width:180px">
              <option value="">Semua Tahun</option>
              <option v-for="y in reportYears" :key="y" :value="String(y)">{{ y }}</option>
            </select>
            <button class="btn-gen btn-outline" @click="downloadImportReportCsv"><i class="fas fa-file-download"></i> Unduh CSV</button>
          </div>
          <table class="table-gen">
            <thead>
              <tr><th>No Clearance</th><th>BL</th><th>Vessel</th><th>ETA</th><th>Biaya</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr v-if="reportRowsClearance.length===0"><td colspan="6" style="text-align:center;color:#aaa">Tidak ada data laporan</td></tr>
              <tr v-for="r in reportRowsClearance" :key="r.id">
                <td>{{ r.clearanceNumber }}</td><td>{{ r.blNumber }}</td><td>{{ r.vesselName }}</td><td>{{ r.etaDate }}</td><td>{{ toCurrency(r.clearanceCost) }}</td>
                <td><span class="status-badge" :class="r.status">{{ r.status }}</span></td>
              </tr>
            </tbody>
          </table>
        </template>
      </PanelBox>
    </template>

    <AppModal v-model="showReceiptModal" :title="receiptEditId ? 'Edit Penerimaan' : 'Tambah Penerimaan'" icon="fa-boxes" width="680px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group-gen"><label class="form-label">No Penerimaan</label><input v-model="receiptForm.receiptNumber" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">No PO</label><input v-model="receiptForm.poNumber" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Supplier</label><input v-model="receiptForm.supplier" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Tanggal</label><input v-model="receiptForm.receiptDate" type="date" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Item</label><input v-model="receiptForm.itemName" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Qty</label><input v-model.number="receiptForm.qtyReceived" type="number" class="form-control-gen" /></div>
      </div>
      <template #footer>
        <button class="btn-gen btn-outline" @click="showReceiptModal=false">Batal</button>
        <button class="btn-gen btn-teal" @click="saveReceipt"><i class="fas fa-save"></i> Simpan</button>
      </template>
    </AppModal>

    <AppModal v-model="showClearanceModal" :title="clearanceEditId ? 'Edit Clearance' : 'Tambah Clearance'" icon="fa-clipboard-check" width="680px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group-gen"><label class="form-label">No Clearance</label><input v-model="clearanceForm.clearanceNumber" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">BL</label><input v-model="clearanceForm.blNumber" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Vessel</label><input v-model="clearanceForm.vesselName" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">ETA</label><input v-model="clearanceForm.etaDate" type="date" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Release</label><input v-model="clearanceForm.releaseDate" type="date" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Biaya</label><input v-model.number="clearanceForm.clearanceCost" type="number" class="form-control-gen" /></div>
      </div>
      <template #footer>
        <button class="btn-gen btn-outline" @click="showClearanceModal=false">Batal</button>
        <button class="btn-gen btn-teal" @click="saveClearance"><i class="fas fa-save"></i> Simpan</button>
      </template>
    </AppModal>

    <AppModal v-model="showDocModal" :title="docEditId ? 'Edit Dokumen' : 'Tambah Dokumen'" icon="fa-file-alt" width="680px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group-gen"><label class="form-label">No Dokumen</label><input v-model="docForm.docNumber" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">No Clearance</label><select v-model="docForm.clearanceId" class="form-control-gen"><option v-for="c in clearances" :key="c.id" :value="c.id">{{ c.clearanceNumber }}</option></select></div>
        <div class="form-group-gen"><label class="form-label">Tipe</label><input v-model="docForm.docType" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">File</label><input v-model="docForm.fileName" class="form-control-gen" /></div>
      </div>
      <template #footer>
        <button class="btn-gen btn-outline" @click="showDocModal=false">Batal</button>
        <button class="btn-gen btn-teal" @click="saveDoc"><i class="fas fa-save"></i> Simpan</button>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue'
import { MODULES } from '@/data/constants'
import { DUMMY_CLEARANCES, DUMMY_GOODS_RECEIPTS, DUMMY_IMPORT_DOCUMENTS } from '@/data/importDummy'
import { useAuthStore, usePermissionStore } from '@/store'
import AppModal from '@/components/common/AppModal.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import PanelBox from '@/components/common/PanelBox.vue'
import StatTile from '@/components/common/StatTile.vue'

const auth = useAuthStore()
const permStore = usePermissionStore()
const showToast = inject('showToast', () => {})

const subModules = computed(() => MODULES.filter(m => ['m06', 'm07', 'm08'].includes(m.id)))
const hasAccess = computed(() => {
  const perms = permStore.getPerms(auth.activeCompanyId)
  return subModules.value.some(m => perms[m.id]?.[auth.currentUser.roleId])
})

const tabs = [
  { key: 'receipt', label: 'Penerimaan Barang', icon: 'fa-boxes' },
  { key: 'clearance', label: 'Clearance Barang', icon: 'fa-clipboard-check' },
  { key: 'document', label: 'Dokumen Impor', icon: 'fa-file-alt' },
  { key: 'report', label: 'Laporan', icon: 'fa-chart-bar' },
]
const activeTab = ref('receipt')

const goodsReceipts = ref(JSON.parse(JSON.stringify(DUMMY_GOODS_RECEIPTS)))
const clearances = ref(JSON.parse(JSON.stringify(DUMMY_CLEARANCES)))
const importDocs = ref(JSON.parse(JSON.stringify(DUMMY_IMPORT_DOCUMENTS)))

const nextReceiptId = ref(Math.max(...goodsReceipts.value.map(v => v.id), 0) + 1)
const nextClearanceId = ref(Math.max(...clearances.value.map(v => v.id), 0) + 1)
const nextDocId = ref(Math.max(...importDocs.value.map(v => v.id), 0) + 1)

const receiptSearch = ref('')
const clearanceSearch = ref('')
const docSearch = ref('')

const receiptStatusFilter = ref('')
const clearanceStatusFilter = ref('')
const docStatusFilter = ref('')

const filteredReceipts = computed(() => goodsReceipts.value.filter(r => {
  const q = receiptSearch.value.toLowerCase()
  if (q && !`${r.receiptNumber} ${r.poNumber} ${r.itemName}`.toLowerCase().includes(q)) return false
  if (receiptStatusFilter.value && r.status !== receiptStatusFilter.value) return false
  return true
}))

const filteredClearances = computed(() => clearances.value.filter(c => {
  const q = clearanceSearch.value.toLowerCase()
  if (q && !`${c.clearanceNumber} ${c.blNumber} ${c.vesselName}`.toLowerCase().includes(q)) return false
  if (clearanceStatusFilter.value && c.status !== clearanceStatusFilter.value) return false
  return true
}))

const filteredDocs = computed(() => importDocs.value.filter(d => {
  const q = docSearch.value.toLowerCase()
  if (q && !`${d.docNumber} ${d.docType} ${d.fileName}`.toLowerCase().includes(q)) return false
  if (docStatusFilter.value && d.status !== docStatusFilter.value) return false
  return true
}))

const showReceiptModal = ref(false)
const showClearanceModal = ref(false)
const showDocModal = ref(false)

const receiptEditId = ref(null)
const clearanceEditId = ref(null)
const docEditId = ref(null)

const receiptForm = ref(defaultReceiptForm())
const clearanceForm = ref(defaultClearanceForm())
const docForm = ref(defaultDocForm())

function defaultReceiptForm() {
  return {
    receiptNumber: '',
    poNumber: '',
    supplier: '',
    receiptDate: new Date().toISOString().slice(0, 10),
    warehouse: 'Gudang Import',
    itemName: '',
    qtyReceived: 0,
    unit: 'PCS',
    status: 'pending',
  }
}

function defaultClearanceForm() {
  return {
    clearanceNumber: '',
    blNumber: '',
    vesselName: '',
    etaDate: new Date().toISOString().slice(0, 10),
    releaseDate: '',
    clearanceCost: 0,
    status: 'on-progress',
  }
}

function defaultDocForm() {
  return {
    docNumber: '',
    clearanceId: clearances.value[0]?.id ?? null,
    docType: '',
    fileName: '',
    issueDate: new Date().toISOString().slice(0, 10),
    expireDate: '',
    status: 'valid',
  }
}

function openReceiptAdd() {
  receiptEditId.value = null
  receiptForm.value = { ...defaultReceiptForm(), receiptNumber: `GR-${new Date().getFullYear()}-${String(nextReceiptId.value).padStart(4, '0')}` }
  showReceiptModal.value = true
}

function openReceiptEdit(row) {
  receiptEditId.value = row.id
  receiptForm.value = { ...row }
  showReceiptModal.value = true
}

function saveReceipt() {
  if (!receiptForm.value.receiptNumber || !receiptForm.value.poNumber) return
  if (receiptEditId.value) {
    const idx = goodsReceipts.value.findIndex(v => v.id === receiptEditId.value)
    if (idx !== -1) goodsReceipts.value[idx] = { ...goodsReceipts.value[idx], ...receiptForm.value }
    showToast('Penerimaan barang diperbarui')
  } else {
    goodsReceipts.value.push({ ...receiptForm.value, id: nextReceiptId.value++ })
    showToast('Penerimaan barang ditambahkan')
  }
  showReceiptModal.value = false
}

function removeReceipt(id) {
  if (!confirm('Hapus data penerimaan?')) return
  goodsReceipts.value = goodsReceipts.value.filter(v => v.id !== id)
}

function openClearanceAdd() {
  clearanceEditId.value = null
  clearanceForm.value = { ...defaultClearanceForm(), clearanceNumber: `CL-${new Date().getFullYear()}-${String(nextClearanceId.value).padStart(4, '0')}` }
  showClearanceModal.value = true
}

function openClearanceEdit(row) {
  clearanceEditId.value = row.id
  clearanceForm.value = { ...row }
  showClearanceModal.value = true
}

function saveClearance() {
  if (!clearanceForm.value.clearanceNumber || !clearanceForm.value.blNumber) return
  if (clearanceEditId.value) {
    const idx = clearances.value.findIndex(v => v.id === clearanceEditId.value)
    if (idx !== -1) clearances.value[idx] = { ...clearances.value[idx], ...clearanceForm.value }
    showToast('Clearance diperbarui')
  } else {
    clearances.value.push({ ...clearanceForm.value, id: nextClearanceId.value++ })
    showToast('Clearance ditambahkan')
  }
  showClearanceModal.value = false
}

function removeClearance(id) {
  if (!confirm('Hapus data clearance?')) return
  clearances.value = clearances.value.filter(v => v.id !== id)
  importDocs.value = importDocs.value.filter(v => v.clearanceId !== id)
}

function openDocAdd() {
  docEditId.value = null
  docForm.value = { ...defaultDocForm(), docNumber: `DOC-IMP-${new Date().getFullYear()}-${String(nextDocId.value).padStart(3, '0')}` }
  showDocModal.value = true
}

function openDocEdit(row) {
  docEditId.value = row.id
  docForm.value = { ...row }
  showDocModal.value = true
}

function saveDoc() {
  if (!docForm.value.docNumber || !docForm.value.docType) return
  if (docEditId.value) {
    const idx = importDocs.value.findIndex(v => v.id === docEditId.value)
    if (idx !== -1) importDocs.value[idx] = { ...importDocs.value[idx], ...docForm.value }
    showToast('Dokumen impor diperbarui')
  } else {
    importDocs.value.push({ ...docForm.value, id: nextDocId.value++ })
    showToast('Dokumen impor ditambahkan')
  }
  showDocModal.value = false
}

function removeDoc(id) {
  if (!confirm('Hapus dokumen impor?')) return
  importDocs.value = importDocs.value.filter(v => v.id !== id)
}

const reportMonth = ref('')
const reportYear = ref('')

function passPeriod(dateValue) {
  if (!dateValue) return false
  const dt = new Date(dateValue)
  const month = String(dt.getMonth() + 1).padStart(2, '0')
  const year = String(dt.getFullYear())
  if (reportMonth.value && month !== reportMonth.value) return false
  if (reportYear.value && year !== reportYear.value) return false
  return true
}

const reportRowsClearance = computed(() => clearances.value.filter(v => passPeriod(v.etaDate)))
const reportRowsReceipt = computed(() => goodsReceipts.value.filter(v => passPeriod(v.receiptDate)))
const reportRowsDocs = computed(() => importDocs.value.filter(v => passPeriod(v.issueDate)))

const reportTotalCost = computed(() => reportRowsClearance.value.reduce((sum, row) => sum + Number(row.clearanceCost || 0), 0))
const reportValidDocCount = computed(() => reportRowsDocs.value.filter(v => v.status === 'valid').length)

const reportYears = computed(() => {
  const years = new Set([
    ...goodsReceipts.value.map(v => new Date(v.receiptDate).getFullYear()),
    ...clearances.value.map(v => new Date(v.etaDate).getFullYear()),
    ...importDocs.value.map(v => new Date(v.issueDate).getFullYear()),
  ])
  return [...years].sort((a, b) => b - a)
})

function clearanceNumber(id) {
  return clearances.value.find(v => v.id === Number(id))?.clearanceNumber || '-'
}

function toCurrency(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value || 0))
}

function formatCompactNumber(value) {
  return new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 }).format(Number(value || 0))
}

function downloadImportReportCsv() {
  const header = ['No Clearance', 'BL', 'Vessel', 'ETA', 'Biaya', 'Status']
  const rows = reportRowsClearance.value.map(v => [v.clearanceNumber, v.blNumber, v.vesselName, v.etaDate, String(v.clearanceCost || 0), v.status])
  const csv = [header, ...rows].map(cols => cols.map(v => `"${String(v).replaceAll('"', '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `laporan-import-${Date.now()}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.status-badge.pending,
.status-badge.on-progress,
.status-badge.review {
  background: #fff4dd;
  color: #f39c12;
}

.status-badge.partial,
.status-badge.hold,
.status-badge.expired {
  background: #fdecec;
  color: #e74c3c;
}

.status-badge.completed,
.status-badge.released,
.status-badge.valid {
  background: #e8f8f5;
  color: #1a8a72;
}
</style>
