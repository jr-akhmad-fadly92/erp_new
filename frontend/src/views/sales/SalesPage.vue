<template>
  <div>
    <PageHeader title="Sales" :crumbs="[{ label: 'Modul ERP' }, { label: 'Sales' }]" />

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
        <StatTile :value="salesOrders.length" label="Sales Order" icon="fa-cart-plus" color="" icon-color="#26B99A" />
        <StatTile :value="customers.length" label="Pelanggan" icon="fa-user-tie" color="blue" icon-color="#1c84c6" />
        <StatTile :value="salesTargets.length" label="Target Sales" icon="fa-bullseye" color="orange" icon-color="#f0ad4e" />
        <StatTile :value="formatCompactNumber(totalOutstanding)" label="Outstanding" icon="fa-wallet" color="red" icon-color="#e74c3c" />
      </div>

      <PanelBox title="Modul Sales" icon="fa-chart-line">
        <div class="flex-row gap-8" style="flex-wrap:wrap;margin-bottom:14px">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="btn-gen btn-sm"
            :class="activeTab===tab.key ? 'btn-teal':'btn-outline'"
            @click="activeTab=tab.key"
          >
            <i class="fas" :class="tab.icon"></i> {{ tab.label }}
          </button>
        </div>

        <template v-if="activeTab==='so'">
          <div class="search-row">
            <input v-model="soSearch" class="search-input" placeholder="Cari no SO / item..." />
            <select v-model="soStatusFilter" class="search-select">
              <option value="">Semua Status</option>
              <option value="draft">Draft</option>
              <option value="approved">Approved</option>
              <option value="closed">Closed</option>
            </select>
            <button class="btn-gen btn-teal" @click="openSoAdd"><i class="fas fa-plus"></i> Tambah SO</button>
          </div>
          <table class="table-gen">
            <thead>
              <tr><th>No SO</th><th>Tanggal</th><th>Pelanggan</th><th>Item</th><th>Qty</th><th>Total</th><th>Status</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              <tr v-if="filteredSo.length===0"><td colspan="8" style="text-align:center;color:#aaa">Tidak ada data</td></tr>
              <tr v-for="row in filteredSo" :key="row.id">
                <td>{{ row.soNumber }}</td>
                <td>{{ row.soDate }}</td>
                <td>{{ customerName(row.customerId) }}</td>
                <td>{{ row.itemName }}</td>
                <td>{{ row.qty }}</td>
                <td>{{ toCurrency(soTotal(row)) }}</td>
                <td><span class="status-badge" :class="row.status">{{ row.status }}</span></td>
                <td>
                  <button class="btn-gen btn-outline btn-xs" @click="openSoEdit(row)"><i class="fas fa-edit" style="color:#1c84c6"></i></button>
                  <button class="btn-gen btn-outline btn-xs" @click="removeSo(row.id)"><i class="fas fa-trash" style="color:#e74c3c"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </template>

        <template v-else-if="activeTab==='customer'">
          <div class="search-row">
            <input v-model="customerSearch" class="search-input" placeholder="Cari pelanggan / kota / PIC..." />
            <select v-model="customerStatusFilter" class="search-select">
              <option value="">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
            <button class="btn-gen btn-teal" @click="openCustomerAdd"><i class="fas fa-plus"></i> Tambah Pelanggan</button>
          </div>
          <table class="table-gen">
            <thead>
              <tr><th>Kode</th><th>Nama</th><th>Kota</th><th>PIC</th><th>Kontak</th><th>Limit Kredit</th><th>Status</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              <tr v-if="filteredCustomers.length===0"><td colspan="8" style="text-align:center;color:#aaa">Tidak ada data</td></tr>
              <tr v-for="row in filteredCustomers" :key="row.id">
                <td>{{ row.code }}</td>
                <td>{{ row.name }}</td>
                <td>{{ row.city }}</td>
                <td>{{ row.pic }}</td>
                <td>{{ row.phone }}</td>
                <td>{{ toCurrency(row.creditLimit) }}</td>
                <td><span class="status-badge" :class="row.status">{{ row.status }}</span></td>
                <td>
                  <button class="btn-gen btn-outline btn-xs" @click="openCustomerEdit(row)"><i class="fas fa-edit" style="color:#1c84c6"></i></button>
                  <button class="btn-gen btn-outline btn-xs" @click="removeCustomer(row.id)"><i class="fas fa-trash" style="color:#e74c3c"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </template>

        <template v-else-if="activeTab==='target'">
          <div class="search-row">
            <input v-model="targetSearch" class="search-input" placeholder="Cari sales / region / periode..." />
            <select v-model="targetStatusFilter" class="search-select">
              <option value="">Semua Status</option>
              <option value="on-track">On Track</option>
              <option value="under">Under</option>
              <option value="achieved">Achieved</option>
            </select>
            <button class="btn-gen btn-teal" @click="openTargetAdd"><i class="fas fa-plus"></i> Tambah Target</button>
          </div>
          <table class="table-gen">
            <thead>
              <tr><th>Periode</th><th>Sales</th><th>Region</th><th>Target</th><th>Achieved</th><th>%</th><th>Status</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              <tr v-if="filteredTargets.length===0"><td colspan="8" style="text-align:center;color:#aaa">Tidak ada data</td></tr>
              <tr v-for="row in filteredTargets" :key="row.id">
                <td>{{ row.period }}</td>
                <td>{{ row.salesName }}</td>
                <td>{{ row.region }}</td>
                <td>{{ toCurrency(row.targetAmount) }}</td>
                <td>{{ toCurrency(row.achievedAmount) }}</td>
                <td>{{ achievementPct(row) }}%</td>
                <td><span class="status-badge" :class="row.status">{{ row.status }}</span></td>
                <td>
                  <button class="btn-gen btn-outline btn-xs" @click="openTargetEdit(row)"><i class="fas fa-edit" style="color:#1c84c6"></i></button>
                  <button class="btn-gen btn-outline btn-xs" @click="removeTarget(row.id)"><i class="fas fa-trash" style="color:#e74c3c"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </template>

        <template v-else-if="activeTab==='invoice'">
          <div class="search-row">
            <input v-model="invoiceSearch" class="search-input" placeholder="Cari invoice / no SO..." />
            <select v-model="invoiceStatusFilter" class="search-select">
              <option value="">Semua Status</option>
              <option value="unpaid">Unpaid</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
            </select>
            <button class="btn-gen btn-teal" @click="openInvoiceAdd"><i class="fas fa-plus"></i> Tambah Invoice</button>
          </div>
          <table class="table-gen">
            <thead>
              <tr><th>No Invoice</th><th>No SO</th><th>Pelanggan</th><th>Tgl / Due</th><th>Total</th><th>Terbayar</th><th>Sisa</th><th>Status</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              <tr v-if="filteredInvoices.length===0"><td colspan="9" style="text-align:center;color:#aaa">Tidak ada data</td></tr>
              <tr v-for="row in filteredInvoices" :key="row.id">
                <td>{{ row.invoiceNumber }}</td>
                <td>{{ soNumber(row.soId) }}</td>
                <td>{{ customerName(row.customerId) }}</td>
                <td>
                  <div>{{ row.invoiceDate }}</div>
                  <div style="font-size:10px;color:#8899a6">{{ row.dueDate }}</div>
                </td>
                <td>{{ toCurrency(row.total) }}</td>
                <td>{{ toCurrency(row.paidAmount) }}</td>
                <td>{{ toCurrency(invoiceOutstanding(row)) }}</td>
                <td><span class="status-badge" :class="row.status">{{ row.status }}</span></td>
                <td>
                  <button class="btn-gen btn-outline btn-xs" @click="openInvoiceEdit(row)"><i class="fas fa-edit" style="color:#1c84c6"></i></button>
                  <button class="btn-gen btn-outline btn-xs" @click="removeInvoice(row.id)"><i class="fas fa-trash" style="color:#e74c3c"></i></button>
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
            <button class="btn-gen btn-outline" @click="downloadSalesReportCsv"><i class="fas fa-file-download"></i> Unduh CSV</button>
          </div>
          <table class="table-gen">
            <thead>
              <tr><th>Invoice</th><th>SO</th><th>Pelanggan</th><th>Tanggal</th><th>Total</th><th>Terbayar</th><th>Sisa</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr v-if="reportInvoices.length===0"><td colspan="8" style="text-align:center;color:#aaa">Tidak ada data laporan</td></tr>
              <tr v-for="row in reportInvoices" :key="row.id">
                <td>{{ row.invoiceNumber }}</td>
                <td>{{ soNumber(row.soId) }}</td>
                <td>{{ customerName(row.customerId) }}</td>
                <td>{{ row.invoiceDate }}</td>
                <td>{{ toCurrency(row.total) }}</td>
                <td>{{ toCurrency(row.paidAmount) }}</td>
                <td>{{ toCurrency(invoiceOutstanding(row)) }}</td>
                <td><span class="status-badge" :class="row.status">{{ row.status }}</span></td>
              </tr>
            </tbody>
          </table>
        </template>
      </PanelBox>
    </template>

    <AppModal v-model="showSoModal" :title="soEditId ? 'Edit Sales Order' : 'Tambah Sales Order'" icon="fa-cart-plus" width="700px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group-gen"><label class="form-label">No SO</label><input v-model="soForm.soNumber" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Tanggal</label><input v-model="soForm.soDate" type="date" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Pelanggan</label><select v-model="soForm.customerId" class="form-control-gen"><option v-for="c in customers" :key="c.id" :value="c.id">{{ c.name }}</option></select></div>
        <div class="form-group-gen"><label class="form-label">Item</label><input v-model="soForm.itemName" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Qty</label><input v-model.number="soForm.qty" type="number" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Harga</label><input v-model.number="soForm.unitPrice" type="number" class="form-control-gen" /></div>
      </div>
      <template #footer><button class="btn-gen btn-outline" @click="showSoModal=false">Batal</button><button class="btn-gen btn-teal" @click="saveSo"><i class="fas fa-save"></i> Simpan</button></template>
    </AppModal>

    <AppModal v-model="showCustomerModal" :title="customerEditId ? 'Edit Pelanggan' : 'Tambah Pelanggan'" icon="fa-user-tie" width="700px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group-gen"><label class="form-label">Kode</label><input v-model="customerForm.code" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Nama</label><input v-model="customerForm.name" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Kota</label><input v-model="customerForm.city" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">PIC</label><input v-model="customerForm.pic" class="form-control-gen" /></div>
      </div>
      <template #footer><button class="btn-gen btn-outline" @click="showCustomerModal=false">Batal</button><button class="btn-gen btn-teal" @click="saveCustomer"><i class="fas fa-save"></i> Simpan</button></template>
    </AppModal>

    <AppModal v-model="showTargetModal" :title="targetEditId ? 'Edit Target Sales' : 'Tambah Target Sales'" icon="fa-bullseye" width="700px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group-gen"><label class="form-label">Periode</label><input v-model="targetForm.period" class="form-control-gen" placeholder="2026-06" /></div>
        <div class="form-group-gen"><label class="form-label">Nama Sales</label><input v-model="targetForm.salesName" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Region</label><input v-model="targetForm.region" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Target</label><input v-model.number="targetForm.targetAmount" type="number" class="form-control-gen" /></div>
      </div>
      <template #footer><button class="btn-gen btn-outline" @click="showTargetModal=false">Batal</button><button class="btn-gen btn-teal" @click="saveTarget"><i class="fas fa-save"></i> Simpan</button></template>
    </AppModal>

    <AppModal v-model="showInvoiceModal" :title="invoiceEditId ? 'Edit Invoice Penjualan' : 'Tambah Invoice Penjualan'" icon="fa-receipt" width="700px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group-gen"><label class="form-label">No Invoice</label><input v-model="invoiceForm.invoiceNumber" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">No SO</label><select v-model="invoiceForm.soId" class="form-control-gen" @change="syncInvoiceCustomer"><option v-for="s in salesOrders" :key="s.id" :value="s.id">{{ s.soNumber }}</option></select></div>
        <div class="form-group-gen"><label class="form-label">Pelanggan</label><select v-model="invoiceForm.customerId" class="form-control-gen"><option v-for="c in customers" :key="c.id" :value="c.id">{{ c.name }}</option></select></div>
        <div class="form-group-gen"><label class="form-label">Tanggal</label><input v-model="invoiceForm.invoiceDate" type="date" class="form-control-gen" /></div>
      </div>
      <template #footer><button class="btn-gen btn-outline" @click="showInvoiceModal=false">Batal</button><button class="btn-gen btn-teal" @click="saveInvoice"><i class="fas fa-save"></i> Simpan</button></template>
    </AppModal>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue'
import { MODULES } from '@/data/constants'
import { DUMMY_CUSTOMERS, DUMMY_SALES_INVOICES, DUMMY_SALES_ORDERS, DUMMY_SALES_TARGETS } from '@/data/salesDummy'
import { useAuthStore, usePermissionStore } from '@/store'
import AppModal from '@/components/common/AppModal.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import PanelBox from '@/components/common/PanelBox.vue'
import StatTile from '@/components/common/StatTile.vue'

const auth = useAuthStore()
const permStore = usePermissionStore()
const showToast = inject('showToast', () => {})

const subModules = computed(() => MODULES.filter(m => ['m12', 'm13', 'm14', 'm15'].includes(m.id)))
const hasAccess = computed(() => {
  const perms = permStore.getPerms(auth.activeCompanyId)
  return subModules.value.some(m => perms[m.id]?.[auth.currentUser.roleId])
})

const tabs = [
  { key: 'so', label: 'Sales Order', icon: 'fa-cart-plus' },
  { key: 'customer', label: 'Pelanggan', icon: 'fa-user-tie' },
  { key: 'target', label: 'Target Sales', icon: 'fa-bullseye' },
  { key: 'invoice', label: 'Invoice Penjualan', icon: 'fa-receipt' },
  { key: 'report', label: 'Laporan', icon: 'fa-chart-bar' },
]
const activeTab = ref('so')

const salesOrders = ref(JSON.parse(JSON.stringify(DUMMY_SALES_ORDERS)))
const customers = ref(JSON.parse(JSON.stringify(DUMMY_CUSTOMERS)))
const salesTargets = ref(JSON.parse(JSON.stringify(DUMMY_SALES_TARGETS)))
const invoices = ref(JSON.parse(JSON.stringify(DUMMY_SALES_INVOICES)))

const nextSoId = ref(Math.max(...salesOrders.value.map(v => v.id), 0) + 1)
const nextCustomerId = ref(Math.max(...customers.value.map(v => v.id), 0) + 1)
const nextTargetId = ref(Math.max(...salesTargets.value.map(v => v.id), 0) + 1)
const nextInvoiceId = ref(Math.max(...invoices.value.map(v => v.id), 0) + 1)

const soSearch = ref('')
const customerSearch = ref('')
const targetSearch = ref('')
const invoiceSearch = ref('')

const soStatusFilter = ref('')
const customerStatusFilter = ref('')
const targetStatusFilter = ref('')
const invoiceStatusFilter = ref('')

const filteredSo = computed(() => salesOrders.value.filter(v => {
  const q = soSearch.value.toLowerCase()
  if (q && !`${v.soNumber} ${v.itemName}`.toLowerCase().includes(q)) return false
  if (soStatusFilter.value && v.status !== soStatusFilter.value) return false
  return true
}))

const filteredCustomers = computed(() => customers.value.filter(v => {
  const q = customerSearch.value.toLowerCase()
  if (q && !`${v.code} ${v.name} ${v.city} ${v.pic}`.toLowerCase().includes(q)) return false
  if (customerStatusFilter.value && v.status !== customerStatusFilter.value) return false
  return true
}))

const filteredTargets = computed(() => salesTargets.value.filter(v => {
  const q = targetSearch.value.toLowerCase()
  if (q && !`${v.period} ${v.salesName} ${v.region}`.toLowerCase().includes(q)) return false
  if (targetStatusFilter.value && v.status !== targetStatusFilter.value) return false
  return true
}))

const filteredInvoices = computed(() => invoices.value.filter(v => {
  const q = invoiceSearch.value.toLowerCase()
  if (q && !`${v.invoiceNumber} ${soNumber(v.soId)}`.toLowerCase().includes(q)) return false
  if (invoiceStatusFilter.value && v.status !== invoiceStatusFilter.value) return false
  return true
}))

const showSoModal = ref(false)
const showCustomerModal = ref(false)
const showTargetModal = ref(false)
const showInvoiceModal = ref(false)

const soEditId = ref(null)
const customerEditId = ref(null)
const targetEditId = ref(null)
const invoiceEditId = ref(null)

const soForm = ref(defaultSoForm())
const customerForm = ref(defaultCustomerForm())
const targetForm = ref(defaultTargetForm())
const invoiceForm = ref(defaultInvoiceForm())

function defaultSoForm() {
  return {
    soNumber: '',
    soDate: new Date().toISOString().slice(0, 10),
    customerId: customers.value[0]?.id ?? null,
    itemName: '',
    qty: 0,
    unitPrice: 0,
    status: 'draft',
  }
}

function defaultCustomerForm() {
  return {
    code: '', name: '', city: '', pic: '', phone: '', email: '', status: 'aktif', creditLimit: 0,
  }
}

function defaultTargetForm() {
  return {
    period: '', salesName: '', region: '', targetAmount: 0, achievedAmount: 0, status: 'under',
  }
}

function defaultInvoiceForm() {
  return {
    invoiceNumber: '',
    soId: salesOrders.value[0]?.id ?? null,
    customerId: salesOrders.value[0]?.customerId ?? customers.value[0]?.id ?? null,
    invoiceDate: new Date().toISOString().slice(0, 10),
    dueDate: new Date().toISOString().slice(0, 10),
    total: 0,
    paidAmount: 0,
    status: 'unpaid',
  }
}

function openSoAdd() {
  soEditId.value = null
  soForm.value = { ...defaultSoForm(), soNumber: `SO-${new Date().getFullYear()}-${String(nextSoId.value).padStart(4, '0')}` }
  showSoModal.value = true
}
function openSoEdit(row) {
  soEditId.value = row.id
  soForm.value = { ...row }
  showSoModal.value = true
}
function saveSo() {
  if (!soForm.value.soNumber || !soForm.value.itemName) return
  if (soEditId.value) {
    const idx = salesOrders.value.findIndex(v => v.id === soEditId.value)
    if (idx !== -1) salesOrders.value[idx] = { ...salesOrders.value[idx], ...soForm.value }
    showToast('Sales order diperbarui')
  } else {
    salesOrders.value.push({ ...soForm.value, id: nextSoId.value++ })
    showToast('Sales order ditambahkan')
  }
  showSoModal.value = false
}
function removeSo(id) {
  if (!confirm('Hapus sales order?')) return
  salesOrders.value = salesOrders.value.filter(v => v.id !== id)
  invoices.value = invoices.value.filter(v => v.soId !== id)
}

function openCustomerAdd() {
  customerEditId.value = null
  customerForm.value = { ...defaultCustomerForm(), code: `CUST-${String(nextCustomerId.value).padStart(3, '0')}` }
  showCustomerModal.value = true
}
function openCustomerEdit(row) {
  customerEditId.value = row.id
  customerForm.value = { ...row }
  showCustomerModal.value = true
}
function saveCustomer() {
  if (!customerForm.value.code || !customerForm.value.name) return
  if (customerEditId.value) {
    const idx = customers.value.findIndex(v => v.id === customerEditId.value)
    if (idx !== -1) customers.value[idx] = { ...customers.value[idx], ...customerForm.value }
    showToast('Pelanggan diperbarui')
  } else {
    customers.value.push({ ...customerForm.value, id: nextCustomerId.value++ })
    showToast('Pelanggan ditambahkan')
  }
  showCustomerModal.value = false
}
function removeCustomer(id) {
  if (!confirm('Hapus pelanggan?')) return
  customers.value = customers.value.filter(v => v.id !== id)
}

function openTargetAdd() {
  targetEditId.value = null
  targetForm.value = { ...defaultTargetForm(), period: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}` }
  showTargetModal.value = true
}
function openTargetEdit(row) {
  targetEditId.value = row.id
  targetForm.value = { ...row }
  showTargetModal.value = true
}
function saveTarget() {
  if (!targetForm.value.period || !targetForm.value.salesName) return
  const pct = targetForm.value.targetAmount ? (targetForm.value.achievedAmount / targetForm.value.targetAmount) * 100 : 0
  if (pct >= 100) targetForm.value.status = 'achieved'
  else if (pct >= 75) targetForm.value.status = 'on-track'
  else targetForm.value.status = 'under'

  if (targetEditId.value) {
    const idx = salesTargets.value.findIndex(v => v.id === targetEditId.value)
    if (idx !== -1) salesTargets.value[idx] = { ...salesTargets.value[idx], ...targetForm.value }
    showToast('Target sales diperbarui')
  } else {
    salesTargets.value.push({ ...targetForm.value, id: nextTargetId.value++ })
    showToast('Target sales ditambahkan')
  }
  showTargetModal.value = false
}
function removeTarget(id) {
  if (!confirm('Hapus target sales?')) return
  salesTargets.value = salesTargets.value.filter(v => v.id !== id)
}

function syncInvoiceCustomer() {
  const so = salesOrders.value.find(v => v.id === Number(invoiceForm.value.soId))
  if (!so) return
  invoiceForm.value.customerId = so.customerId
  if (!invoiceEditId.value) invoiceForm.value.total = soTotal(so)
}

function openInvoiceAdd() {
  invoiceEditId.value = null
  invoiceForm.value = { ...defaultInvoiceForm(), invoiceNumber: `INV-SLS-${new Date().getFullYear()}-${String(nextInvoiceId.value).padStart(3, '0')}` }
  syncInvoiceCustomer()
  showInvoiceModal.value = true
}
function openInvoiceEdit(row) {
  invoiceEditId.value = row.id
  invoiceForm.value = { ...row }
  showInvoiceModal.value = true
}
function saveInvoice() {
  if (!invoiceForm.value.invoiceNumber) return
  const normalized = { ...invoiceForm.value }
  normalized.paidAmount = Math.min(Number(normalized.paidAmount || 0), Number(normalized.total || 0))
  if (normalized.paidAmount >= normalized.total && normalized.total > 0) normalized.status = 'paid'
  else if (normalized.paidAmount > 0) normalized.status = 'partial'
  else normalized.status = 'unpaid'

  if (invoiceEditId.value) {
    const idx = invoices.value.findIndex(v => v.id === invoiceEditId.value)
    if (idx !== -1) invoices.value[idx] = { ...invoices.value[idx], ...normalized }
    showToast('Invoice diperbarui')
  } else {
    invoices.value.push({ ...normalized, id: nextInvoiceId.value++ })
    showToast('Invoice ditambahkan')
  }
  showInvoiceModal.value = false
}
function removeInvoice(id) {
  if (!confirm('Hapus invoice?')) return
  invoices.value = invoices.value.filter(v => v.id !== id)
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

const reportInvoices = computed(() => invoices.value.filter(v => passPeriod(v.invoiceDate)))

const reportYears = computed(() => {
  const years = new Set([
    ...invoices.value.map(v => new Date(v.invoiceDate).getFullYear()),
    ...salesOrders.value.map(v => new Date(v.soDate).getFullYear()),
  ])
  return [...years].sort((a, b) => b - a)
})

const totalOutstanding = computed(() => invoices.value.reduce((sum, inv) => sum + invoiceOutstanding(inv), 0))

function customerName(id) {
  return customers.value.find(v => v.id === Number(id))?.name || '-'
}

function soNumber(id) {
  return salesOrders.value.find(v => v.id === Number(id))?.soNumber || '-'
}

function soTotal(so) {
  const subtotal = Number(so.qty || 0) * Number(so.unitPrice || 0)
  return subtotal * 1.11
}

function invoiceOutstanding(inv) {
  return Math.max(Number(inv.total || 0) - Number(inv.paidAmount || 0), 0)
}

function achievementPct(target) {
  const pct = target.targetAmount ? (target.achievedAmount / target.targetAmount) * 100 : 0
  return Math.round(pct)
}

function toCurrency(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value || 0))
}

function formatCompactNumber(value) {
  return new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 }).format(Number(value || 0))
}

function downloadSalesReportCsv() {
  const header = ['Invoice', 'SO', 'Pelanggan', 'Tanggal', 'Total', 'Terbayar', 'Sisa', 'Status']
  const rows = reportInvoices.value.map(v => [v.invoiceNumber, soNumber(v.soId), customerName(v.customerId), v.invoiceDate, String(v.total), String(v.paidAmount), String(invoiceOutstanding(v)), v.status])
  const csv = [header, ...rows].map(cols => cols.map(v => `"${String(v).replaceAll('"', '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `laporan-sales-${Date.now()}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.status-badge.draft,
.status-badge.unpaid,
.status-badge.under,
.status-badge.nonaktif {
  background: #fdecec;
  color: #e74c3c;
}

.status-badge.partial,
.status-badge.on-track {
  background: #fff4dd;
  color: #f39c12;
}

.status-badge.approved,
.status-badge.closed,
.status-badge.paid,
.status-badge.achieved,
.status-badge.aktif {
  background: #e8f8f5;
  color: #1a8a72;
}
</style>
