<template>
  <div>
    <PageHeader title="Gudang" :crumbs="[{ label: 'Modul ERP' }, { label: 'Gudang' }]" />

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
        <StatTile :value="stockItems.length" label="Stock Barang" icon="fa-box" color="" icon-color="#26B99A" />
        <StatTile :value="mutations.length" label="Mutasi Gudang" icon="fa-exchange-alt" color="blue" icon-color="#1c84c6" />
        <StatTile :value="opnames.length" label="Opname Stok" icon="fa-clipboard-list" color="orange" icon-color="#f0ad4e" />
        <StatTile :value="formatCompactNumber(reportStockValue)" label="Nilai Stok" icon="fa-coins" color="red" icon-color="#e74c3c" />
      </div>

      <PanelBox title="Modul Gudang" icon="fa-warehouse">
        <div class="flex-row gap-8" style="flex-wrap:wrap;margin-bottom:14px">
          <button v-for="tab in tabs" :key="tab.key" class="btn-gen btn-sm" :class="activeTab===tab.key ? 'btn-teal' : 'btn-outline'" @click="activeTab=tab.key">
            <i class="fas" :class="tab.icon"></i> {{ tab.label }}
          </button>
        </div>

        <template v-if="activeTab==='stock'">
          <div class="search-row">
            <input v-model="stockSearch" class="search-input" placeholder="Cari SKU / nama barang..." />
            <select v-model="stockStatusFilter" class="search-select">
              <option value="">Semua Status</option>
              <option value="aman">Aman</option>
              <option value="minimum">Minimum</option>
              <option value="habis">Habis</option>
            </select>
            <button class="btn-gen btn-teal" @click="openStockAdd"><i class="fas fa-plus"></i> Tambah Stock</button>
          </div>
          <table class="table-gen">
            <thead>
              <tr><th>SKU</th><th>Barang</th><th>Gudang</th><th>Stok</th><th>Min</th><th>Avg Cost</th><th>Status</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              <tr v-if="filteredStocks.length===0"><td colspan="8" style="text-align:center;color:#aaa">Tidak ada data</td></tr>
              <tr v-for="row in filteredStocks" :key="row.id">
                <td>{{ row.sku }}</td>
                <td>
                  <div style="font-weight:600;color:#455464">{{ row.itemName }}</div>
                  <div style="font-size:10px;color:#8899a6">{{ row.category }}</div>
                </td>
                <td>{{ row.warehouse }}</td>
                <td>{{ row.stockQty }} {{ row.unit }}</td>
                <td>{{ row.minStock }}</td>
                <td>{{ toCurrency(row.avgCost) }}</td>
                <td><span class="status-badge" :class="row.status">{{ row.status }}</span></td>
                <td>
                  <button class="btn-gen btn-outline btn-xs" @click="openStockEdit(row)"><i class="fas fa-edit" style="color:#1c84c6"></i></button>
                  <button class="btn-gen btn-outline btn-xs" @click="removeStock(row.id)"><i class="fas fa-trash" style="color:#e74c3c"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </template>

        <template v-else-if="activeTab==='mutation'">
          <div class="search-row">
            <input v-model="mutationSearch" class="search-input" placeholder="Cari no mutasi / SKU / barang..." />
            <select v-model="mutationStatusFilter" class="search-select">
              <option value="">Semua Status</option>
              <option value="draft">Draft</option>
              <option value="posted">Posted</option>
            </select>
            <button class="btn-gen btn-teal" @click="openMutationAdd"><i class="fas fa-plus"></i> Tambah Mutasi</button>
          </div>
          <table class="table-gen">
            <thead>
              <tr><th>No Mutasi</th><th>Tanggal</th><th>SKU</th><th>Barang</th><th>Asal</th><th>Tujuan</th><th>Qty</th><th>Status</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              <tr v-if="filteredMutations.length===0"><td colspan="9" style="text-align:center;color:#aaa">Tidak ada data</td></tr>
              <tr v-for="row in filteredMutations" :key="row.id">
                <td>{{ row.mutationNumber }}</td>
                <td>{{ row.mutationDate }}</td>
                <td>{{ row.sku }}</td>
                <td>{{ row.itemName }}</td>
                <td>{{ row.fromWarehouse }}</td>
                <td>{{ row.toWarehouse }}</td>
                <td>{{ row.qty }} {{ row.unit }}</td>
                <td><span class="status-badge" :class="row.status">{{ row.status }}</span></td>
                <td>
                  <button class="btn-gen btn-outline btn-xs" @click="openMutationEdit(row)"><i class="fas fa-edit" style="color:#1c84c6"></i></button>
                  <button class="btn-gen btn-outline btn-xs" @click="removeMutation(row.id)"><i class="fas fa-trash" style="color:#e74c3c"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </template>

        <template v-else-if="activeTab==='opname'">
          <div class="search-row">
            <input v-model="opnameSearch" class="search-input" placeholder="Cari no opname / SKU / barang..." />
            <select v-model="opnameStatusFilter" class="search-select">
              <option value="">Semua Status</option>
              <option value="review">Review</option>
              <option value="adjusted">Adjusted</option>
              <option value="closed">Closed</option>
            </select>
            <button class="btn-gen btn-teal" @click="openOpnameAdd"><i class="fas fa-plus"></i> Tambah Opname</button>
          </div>
          <table class="table-gen">
            <thead>
              <tr><th>No Opname</th><th>Tanggal</th><th>Gudang</th><th>SKU</th><th>System</th><th>Fisik</th><th>Selisih</th><th>Status</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              <tr v-if="filteredOpnames.length===0"><td colspan="9" style="text-align:center;color:#aaa">Tidak ada data</td></tr>
              <tr v-for="row in filteredOpnames" :key="row.id">
                <td>{{ row.opnameNumber }}</td>
                <td>{{ row.opnameDate }}</td>
                <td>{{ row.warehouse }}</td>
                <td>{{ row.sku }}</td>
                <td>{{ row.systemQty }}</td>
                <td>{{ row.physicalQty }}</td>
                <td :style="{ color: row.differenceQty < 0 ? '#e74c3c' : '#1a8a72' }">{{ row.differenceQty }}</td>
                <td><span class="status-badge" :class="row.status">{{ row.status }}</span></td>
                <td>
                  <button class="btn-gen btn-outline btn-xs" @click="openOpnameEdit(row)"><i class="fas fa-edit" style="color:#1c84c6"></i></button>
                  <button class="btn-gen btn-outline btn-xs" @click="removeOpname(row.id)"><i class="fas fa-trash" style="color:#e74c3c"></i></button>
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
            <button class="btn-gen btn-outline" @click="downloadGudangReportCsv"><i class="fas fa-file-download"></i> Unduh CSV</button>
          </div>
          <table class="table-gen">
            <thead>
              <tr><th>No Mutasi</th><th>Tanggal</th><th>SKU</th><th>Barang</th><th>Asal</th><th>Tujuan</th><th>Qty</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr v-if="reportRowsMutation.length===0"><td colspan="8" style="text-align:center;color:#aaa">Tidak ada data laporan</td></tr>
              <tr v-for="row in reportRowsMutation" :key="row.id">
                <td>{{ row.mutationNumber }}</td>
                <td>{{ row.mutationDate }}</td>
                <td>{{ row.sku }}</td>
                <td>{{ row.itemName }}</td>
                <td>{{ row.fromWarehouse }}</td>
                <td>{{ row.toWarehouse }}</td>
                <td>{{ row.qty }} {{ row.unit }}</td>
                <td><span class="status-badge" :class="row.status">{{ row.status }}</span></td>
              </tr>
            </tbody>
          </table>
        </template>
      </PanelBox>
    </template>

    <AppModal v-model="showStockModal" :title="stockEditId ? 'Edit Stock Barang' : 'Tambah Stock Barang'" icon="fa-box" width="700px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group-gen"><label class="form-label">SKU</label><input v-model="stockForm.sku" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Nama Barang</label><input v-model="stockForm.itemName" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Kategori</label><input v-model="stockForm.category" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Gudang</label><input v-model="stockForm.warehouse" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Stok</label><input v-model.number="stockForm.stockQty" type="number" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Minimum</label><input v-model.number="stockForm.minStock" type="number" class="form-control-gen" /></div>
      </div>
      <template #footer>
        <button class="btn-gen btn-outline" @click="showStockModal=false">Batal</button>
        <button class="btn-gen btn-teal" @click="saveStock"><i class="fas fa-save"></i> Simpan</button>
      </template>
    </AppModal>

    <AppModal v-model="showMutationModal" :title="mutationEditId ? 'Edit Mutasi Gudang' : 'Tambah Mutasi Gudang'" icon="fa-exchange-alt" width="700px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group-gen"><label class="form-label">No Mutasi</label><input v-model="mutationForm.mutationNumber" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Tanggal</label><input v-model="mutationForm.mutationDate" type="date" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">SKU</label><input v-model="mutationForm.sku" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Nama Barang</label><input v-model="mutationForm.itemName" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Asal</label><input v-model="mutationForm.fromWarehouse" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Tujuan</label><input v-model="mutationForm.toWarehouse" class="form-control-gen" /></div>
      </div>
      <template #footer>
        <button class="btn-gen btn-outline" @click="showMutationModal=false">Batal</button>
        <button class="btn-gen btn-teal" @click="saveMutation"><i class="fas fa-save"></i> Simpan</button>
      </template>
    </AppModal>

    <AppModal v-model="showOpnameModal" :title="opnameEditId ? 'Edit Opname Stok' : 'Tambah Opname Stok'" icon="fa-clipboard-list" width="700px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group-gen"><label class="form-label">No Opname</label><input v-model="opnameForm.opnameNumber" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Tanggal</label><input v-model="opnameForm.opnameDate" type="date" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Gudang</label><input v-model="opnameForm.warehouse" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">SKU</label><input v-model="opnameForm.sku" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">System Qty</label><input v-model.number="opnameForm.systemQty" type="number" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Physical Qty</label><input v-model.number="opnameForm.physicalQty" type="number" class="form-control-gen" /></div>
      </div>
      <template #footer>
        <button class="btn-gen btn-outline" @click="showOpnameModal=false">Batal</button>
        <button class="btn-gen btn-teal" @click="saveOpname"><i class="fas fa-save"></i> Simpan</button>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue'
import { MODULES } from '@/data/constants'
import { DUMMY_STOCK_ITEMS, DUMMY_STOCK_OPNAMES, DUMMY_WAREHOUSE_MUTATIONS } from '@/data/gudangDummy'
import { useAuthStore, usePermissionStore } from '@/store'
import AppModal from '@/components/common/AppModal.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import PanelBox from '@/components/common/PanelBox.vue'
import StatTile from '@/components/common/StatTile.vue'

const auth = useAuthStore()
const permStore = usePermissionStore()
const showToast = inject('showToast', () => {})

const subModules = computed(() => MODULES.filter(m => ['m09', 'm10', 'm11'].includes(m.id)))
const hasAccess = computed(() => {
  const perms = permStore.getPerms(auth.activeCompanyId)
  return subModules.value.some(m => perms[m.id]?.[auth.currentUser.roleId])
})

const tabs = [
  { key: 'stock', label: 'Stock Barang', icon: 'fa-box' },
  { key: 'mutation', label: 'Mutasi Gudang', icon: 'fa-exchange-alt' },
  { key: 'opname', label: 'Opname Stok', icon: 'fa-clipboard-list' },
  { key: 'report', label: 'Laporan', icon: 'fa-chart-bar' },
]
const activeTab = ref('stock')

const stockItems = ref(JSON.parse(JSON.stringify(DUMMY_STOCK_ITEMS)))
const mutations = ref(JSON.parse(JSON.stringify(DUMMY_WAREHOUSE_MUTATIONS)))
const opnames = ref(JSON.parse(JSON.stringify(DUMMY_STOCK_OPNAMES)))

const nextStockId = ref(Math.max(...stockItems.value.map(v => v.id), 0) + 1)
const nextMutationId = ref(Math.max(...mutations.value.map(v => v.id), 0) + 1)
const nextOpnameId = ref(Math.max(...opnames.value.map(v => v.id), 0) + 1)

const stockSearch = ref('')
const stockStatusFilter = ref('')
const mutationSearch = ref('')
const mutationStatusFilter = ref('')
const opnameSearch = ref('')
const opnameStatusFilter = ref('')

const filteredStocks = computed(() => stockItems.value.filter(v => {
  const q = stockSearch.value.toLowerCase()
  if (q && !`${v.sku} ${v.itemName}`.toLowerCase().includes(q)) return false
  if (stockStatusFilter.value && v.status !== stockStatusFilter.value) return false
  return true
}))

const filteredMutations = computed(() => mutations.value.filter(v => {
  const q = mutationSearch.value.toLowerCase()
  if (q && !`${v.mutationNumber} ${v.sku} ${v.itemName}`.toLowerCase().includes(q)) return false
  if (mutationStatusFilter.value && v.status !== mutationStatusFilter.value) return false
  return true
}))

const filteredOpnames = computed(() => opnames.value.filter(v => {
  const q = opnameSearch.value.toLowerCase()
  if (q && !`${v.opnameNumber} ${v.sku} ${v.itemName}`.toLowerCase().includes(q)) return false
  if (opnameStatusFilter.value && v.status !== opnameStatusFilter.value) return false
  return true
}))

const showStockModal = ref(false)
const showMutationModal = ref(false)
const showOpnameModal = ref(false)

const stockEditId = ref(null)
const mutationEditId = ref(null)
const opnameEditId = ref(null)

const stockForm = ref(defaultStockForm())
const mutationForm = ref(defaultMutationForm())
const opnameForm = ref(defaultOpnameForm())

function defaultStockForm() {
  return {
    sku: '', itemName: '', category: '', warehouse: 'Gudang Utama', stockQty: 0, minStock: 0, unit: 'PCS', avgCost: 0, status: 'aman',
  }
}
function defaultMutationForm() {
  return {
    mutationNumber: '', mutationDate: new Date().toISOString().slice(0, 10), sku: '', itemName: '', fromWarehouse: 'Gudang Utama', toWarehouse: 'Gudang Transit', qty: 0, unit: 'PCS', status: 'draft',
  }
}
function defaultOpnameForm() {
  return {
    opnameNumber: '', opnameDate: new Date().toISOString().slice(0, 10), warehouse: 'Gudang Utama', sku: '', itemName: '', systemQty: 0, physicalQty: 0, differenceQty: 0, status: 'review',
  }
}

function openStockAdd() {
  stockEditId.value = null
  stockForm.value = { ...defaultStockForm(), sku: `SKU-${String(nextStockId.value).padStart(3, '0')}` }
  showStockModal.value = true
}
function openStockEdit(row) {
  stockEditId.value = row.id
  stockForm.value = { ...row }
  showStockModal.value = true
}
function saveStock() {
  if (!stockForm.value.sku || !stockForm.value.itemName) return
  if (stockEditId.value) {
    const idx = stockItems.value.findIndex(v => v.id === stockEditId.value)
    if (idx !== -1) stockItems.value[idx] = { ...stockItems.value[idx], ...stockForm.value }
    showToast('Stock barang diperbarui')
  } else {
    stockItems.value.push({ ...stockForm.value, id: nextStockId.value++ })
    showToast('Stock barang ditambahkan')
  }
  showStockModal.value = false
}
function removeStock(id) {
  if (!confirm('Hapus stock barang?')) return
  stockItems.value = stockItems.value.filter(v => v.id !== id)
}

function openMutationAdd() {
  mutationEditId.value = null
  mutationForm.value = { ...defaultMutationForm(), mutationNumber: `MUT-${new Date().getFullYear()}-${String(nextMutationId.value).padStart(4, '0')}` }
  showMutationModal.value = true
}
function openMutationEdit(row) {
  mutationEditId.value = row.id
  mutationForm.value = { ...row }
  showMutationModal.value = true
}
function saveMutation() {
  if (!mutationForm.value.mutationNumber || !mutationForm.value.sku) return
  if (mutationEditId.value) {
    const idx = mutations.value.findIndex(v => v.id === mutationEditId.value)
    if (idx !== -1) mutations.value[idx] = { ...mutations.value[idx], ...mutationForm.value }
    showToast('Mutasi gudang diperbarui')
  } else {
    mutations.value.push({ ...mutationForm.value, id: nextMutationId.value++ })
    showToast('Mutasi gudang ditambahkan')
  }
  showMutationModal.value = false
}
function removeMutation(id) {
  if (!confirm('Hapus mutasi gudang?')) return
  mutations.value = mutations.value.filter(v => v.id !== id)
}

function openOpnameAdd() {
  opnameEditId.value = null
  opnameForm.value = { ...defaultOpnameForm(), opnameNumber: `OPN-${new Date().getFullYear()}-${String(nextOpnameId.value).padStart(4, '0')}` }
  showOpnameModal.value = true
}
function openOpnameEdit(row) {
  opnameEditId.value = row.id
  opnameForm.value = { ...row }
  showOpnameModal.value = true
}
function saveOpname() {
  if (!opnameForm.value.opnameNumber || !opnameForm.value.sku) return
  opnameForm.value.differenceQty = Number(opnameForm.value.physicalQty || 0) - Number(opnameForm.value.systemQty || 0)
  if (opnameEditId.value) {
    const idx = opnames.value.findIndex(v => v.id === opnameEditId.value)
    if (idx !== -1) opnames.value[idx] = { ...opnames.value[idx], ...opnameForm.value }
    showToast('Opname stok diperbarui')
  } else {
    opnames.value.push({ ...opnameForm.value, id: nextOpnameId.value++ })
    showToast('Opname stok ditambahkan')
  }
  showOpnameModal.value = false
}
function removeOpname(id) {
  if (!confirm('Hapus opname stok?')) return
  opnames.value = opnames.value.filter(v => v.id !== id)
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

const reportRowsMutation = computed(() => mutations.value.filter(v => passPeriod(v.mutationDate)))
const reportYears = computed(() => {
  const years = new Set([
    ...mutations.value.map(v => new Date(v.mutationDate).getFullYear()),
    ...opnames.value.map(v => new Date(v.opnameDate).getFullYear()),
  ])
  return [...years].sort((a, b) => b - a)
})

const reportStockValue = computed(() =>
  stockItems.value.reduce((sum, item) => sum + (Number(item.stockQty || 0) * Number(item.avgCost || 0)), 0)
)

function toCurrency(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value || 0))
}

function formatCompactNumber(value) {
  return new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 }).format(Number(value || 0))
}

function downloadGudangReportCsv() {
  const header = ['No Mutasi', 'Tanggal', 'SKU', 'Barang', 'Asal', 'Tujuan', 'Qty', 'Status']
  const rows = reportRowsMutation.value.map(v => [v.mutationNumber, v.mutationDate, v.sku, v.itemName, v.fromWarehouse, v.toWarehouse, String(v.qty), v.status])
  const csv = [header, ...rows].map(cols => cols.map(v => `"${String(v).replaceAll('"', '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `laporan-gudang-${Date.now()}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.status-badge.aman,
.status-badge.posted,
.status-badge.closed,
.status-badge.adjusted {
  background: #e8f8f5;
  color: #1a8a72;
}

.status-badge.minimum,
.status-badge.draft,
.status-badge.review {
  background: #fff4dd;
  color: #f39c12;
}

.status-badge.habis {
  background: #fdecec;
  color: #e74c3c;
}
</style>
