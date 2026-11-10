<template>
  <div>
    <PageHeader
      title="Purchasing"
      :crumbs="[{ label: 'Modul ERP' }, { label: 'Purchasing' }]"
    />

    <div v-if="!hasAccess" class="panel-gen">
      <div class="panel-gen-body" style="text-align:center;padding:40px">
        <i class="fas fa-lock" style="font-size:40px;color:#e74c3c;margin-bottom:12px;display:block;opacity:.5"></i>
        <h3 style="color:#455464;font-size:16px;margin-bottom:6px">Akses Dibatasi</h3>
        <p style="color:#aaa;font-size:13px">
          Role <strong>{{ auth.currentRole?.name }}</strong> tidak memiliki hak akses ke modul ini.
        </p>
        <router-link to="/dashboard" class="btn-gen btn-teal" style="margin-top:14px;display:inline-flex">
          <i class="fas fa-home"></i> Kembali ke Dashboard
        </router-link>
      </div>
    </div>

    <template v-else>
      <div class="tile-row" style="grid-template-columns:repeat(auto-fit,minmax(210px,1fr))">
        <StatTile :value="suppliers.length" label="Supplier" icon="fa-truck" color="" icon-color="#26B99A" />
        <StatTile :value="purchaseOrders.length" label="Purchase Order" icon="fa-shopping-cart" color="blue" icon-color="#1c84c6" />
        <StatTile :value="invoices.length" label="Invoice Pembelian" icon="fa-file-invoice" color="orange" icon-color="#f0ad4e" />
        <StatTile :value="formatCompactNumber(reportOutstanding)" label="Outstanding" icon="fa-wallet" color="red" icon-color="#e74c3c" />
      </div>

      <PanelBox title="Modul Purchasing" icon="fa-shopping-cart">
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

        <template v-if="activeTab === 'supplier'">
          <div class="search-row">
            <input v-model="supplierSearch" class="search-input" placeholder="Cari supplier / PIC / kota..." />
            <select v-model="supplierStatusFilter" class="search-select">
              <option value="">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
            <button class="btn-gen btn-teal" @click="openSupplierAdd">
              <i class="fas fa-plus"></i> Tambah Supplier
            </button>
          </div>

          <table class="table-gen">
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama Supplier</th>
                <th>Kontak</th>
                <th>Kota</th>
                <th>Term</th>
                <th style="text-align:center">Status</th>
                <th style="text-align:center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredSuppliers.length === 0">
                <td colspan="7" style="text-align:center;color:#aaa;padding:22px">Tidak ada data supplier</td>
              </tr>
              <tr v-for="s in filteredSuppliers" :key="s.id">
                <td>{{ s.code }}</td>
                <td>
                  <div style="font-weight:600;color:#455464;font-size:12px">{{ s.name }}</div>
                  <div style="font-size:10px;color:#aaa">{{ s.address }}</div>
                </td>
                <td>
                  <div style="font-size:12px;color:#738A9C">{{ s.pic }}</div>
                  <div style="font-size:11px;color:#aaa">{{ s.phone }} | {{ s.email }}</div>
                </td>
                <td>{{ s.city }}</td>
                <td>{{ s.paymentTerm }}</td>
                <td style="text-align:center">
                  <span class="status-badge" :class="s.status">{{ s.status }}</span>
                </td>
                <td style="text-align:center">
                  <div class="flex-row gap-5" style="justify-content:center">
                    <button class="btn-gen btn-outline btn-xs" @click="openSupplierEdit(s)">
                      <i class="fas fa-edit" style="color:#1c84c6"></i>
                    </button>
                    <button class="btn-gen btn-outline btn-xs" @click="removeSupplier(s.id)">
                      <i class="fas fa-trash" style="color:#e74c3c"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </template>

        <template v-else-if="activeTab === 'po'">
          <div class="search-row">
            <input v-model="poSearch" class="search-input" placeholder="Cari nomor PO / item..." />
            <select v-model="poStatusFilter" class="search-select">
              <option value="">Semua Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="approved">Approved</option>
              <option value="closed">Closed</option>
            </select>
            <button class="btn-gen btn-teal" @click="openPoAdd">
              <i class="fas fa-plus"></i> Tambah PO
            </button>
          </div>

          <table class="table-gen">
            <thead>
              <tr>
                <th>No. PO</th>
                <th>Supplier</th>
                <th>Tanggal</th>
                <th>Barang</th>
                <th style="text-align:right">Total</th>
                <th style="text-align:center">Status</th>
                <th style="text-align:center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredPurchaseOrders.length === 0">
                <td colspan="7" style="text-align:center;color:#aaa;padding:22px">Tidak ada data PO</td>
              </tr>
              <tr v-for="po in filteredPurchaseOrders" :key="po.id">
                <td>
                  <div style="font-weight:600;color:#455464">{{ po.poNumber }}</div>
                  <div style="font-size:10px;color:#aaa">ETA: {{ po.expectedDate }}</div>
                </td>
                <td>{{ supplierName(po.supplierId) }}</td>
                <td>{{ po.poDate }}</td>
                <td>
                  <div>{{ po.itemName }}</div>
                  <div style="font-size:10px;color:#aaa">Qty {{ po.qty }} x {{ toCurrency(po.unitPrice) }}</div>
                </td>
                <td style="text-align:right">{{ toCurrency(poTotal(po)) }}</td>
                <td style="text-align:center">
                  <span class="status-badge" :class="po.status">{{ po.status }}</span>
                </td>
                <td style="text-align:center">
                  <div class="flex-row gap-5" style="justify-content:center">
                    <button class="btn-gen btn-outline btn-xs" @click="openPoEdit(po)">
                      <i class="fas fa-edit" style="color:#1c84c6"></i>
                    </button>
                    <button class="btn-gen btn-outline btn-xs" @click="removePo(po.id)">
                      <i class="fas fa-trash" style="color:#e74c3c"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </template>

        <template v-else-if="activeTab === 'invoice'">
          <div class="search-row">
            <input v-model="invoiceSearch" class="search-input" placeholder="Cari invoice / no PO..." />
            <select v-model="invoiceStatusFilter" class="search-select">
              <option value="">Semua Status</option>
              <option value="unpaid">Belum Bayar</option>
              <option value="partial">Sebagian</option>
              <option value="paid">Lunas</option>
              <option value="overdue">Jatuh Tempo</option>
            </select>
            <button class="btn-gen btn-teal" @click="openInvoiceAdd">
              <i class="fas fa-plus"></i> Tambah Invoice
            </button>
          </div>

          <table class="table-gen">
            <thead>
              <tr>
                <th>No. Invoice</th>
                <th>No. PO</th>
                <th>Supplier</th>
                <th>Invoice / Jatuh Tempo</th>
                <th style="text-align:right">Total</th>
                <th style="text-align:right">Terbayar</th>
                <th style="text-align:right">Sisa</th>
                <th style="text-align:center">Status</th>
                <th style="text-align:center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredInvoices.length === 0">
                <td colspan="9" style="text-align:center;color:#aaa;padding:22px">Tidak ada data invoice</td>
              </tr>
              <tr v-for="inv in filteredInvoices" :key="inv.id">
                <td>
                  <div style="font-weight:600;color:#455464">{{ inv.invoiceNumber }}</div>
                  <div style="font-size:10px;color:#aaa">ID {{ inv.id }}</div>
                </td>
                <td>{{ poNumber(inv.poId) }}</td>
                <td>{{ supplierName(inv.supplierId) }}</td>
                <td>
                  <div>{{ inv.invoiceDate }}</div>
                  <div style="font-size:10px;color:#aaa">{{ inv.dueDate }}</div>
                </td>
                <td style="text-align:right">{{ toCurrency(inv.total) }}</td>
                <td style="text-align:right">{{ toCurrency(inv.paidAmount) }}</td>
                <td style="text-align:right">{{ toCurrency(invoiceOutstanding(inv)) }}</td>
                <td style="text-align:center">
                  <span class="status-badge" :class="inv.status">{{ inv.status }}</span>
                </td>
                <td style="text-align:center">
                  <div class="flex-row gap-5" style="justify-content:center">
                    <button class="btn-gen btn-outline btn-xs" @click="openInvoiceEdit(inv)">
                      <i class="fas fa-edit" style="color:#1c84c6"></i>
                    </button>
                    <button class="btn-gen btn-outline btn-xs" @click="removeInvoice(inv.id)">
                      <i class="fas fa-trash" style="color:#e74c3c"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </template>

        <template v-else>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:12px">
            <div class="panel-gen" style="padding:12px">
              <div style="font-size:11px;color:#aaa">Total Nilai PO</div>
              <div style="font-size:20px;font-weight:700;color:#455464">{{ toCurrency(reportPoTotal) }}</div>
            </div>
            <div class="panel-gen" style="padding:12px">
              <div style="font-size:11px;color:#aaa">Total Nilai Invoice</div>
              <div style="font-size:20px;font-weight:700;color:#455464">{{ toCurrency(reportInvoiceTotal) }}</div>
            </div>
            <div class="panel-gen" style="padding:12px">
              <div style="font-size:11px;color:#aaa">Outstanding</div>
              <div style="font-size:20px;font-weight:700;color:#e74c3c">{{ toCurrency(reportOutstanding) }}</div>
            </div>
            <div class="panel-gen" style="padding:12px">
              <div style="font-size:11px;color:#aaa">Top Supplier</div>
              <div style="font-size:16px;font-weight:700;color:#455464">{{ reportTopSupplier.name }}</div>
              <div style="font-size:11px;color:#738A9C">{{ toCurrency(reportTopSupplier.total) }}</div>
            </div>
          </div>

          <div class="search-row" style="margin-bottom:8px">
            <select v-model="reportMonth" class="search-select" style="max-width:180px">
              <option value="">Semua Bulan</option>
              <option v-for="m in 12" :key="m" :value="String(m).padStart(2, '0')">Bulan {{ String(m).padStart(2, '0') }}</option>
            </select>
            <select v-model="reportYear" class="search-select" style="max-width:180px">
              <option value="">Semua Tahun</option>
              <option v-for="y in availableYears" :key="y" :value="String(y)">{{ y }}</option>
            </select>
            <button class="btn-gen btn-outline" @click="downloadReportCsv">
              <i class="fas fa-file-download"></i> Unduh CSV
            </button>
          </div>

          <table class="table-gen">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>No. Invoice</th>
                <th>Supplier</th>
                <th>No. PO</th>
                <th style="text-align:right">Total</th>
                <th style="text-align:right">Terbayar</th>
                <th style="text-align:right">Sisa</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="reportRows.length === 0">
                <td colspan="7" style="text-align:center;color:#aaa;padding:22px">Tidak ada data laporan</td>
              </tr>
              <tr v-for="r in reportRows" :key="r.id">
                <td>{{ r.invoiceDate }}</td>
                <td>{{ r.invoiceNumber }}</td>
                <td>{{ supplierName(r.supplierId) }}</td>
                <td>{{ poNumber(r.poId) }}</td>
                <td style="text-align:right">{{ toCurrency(r.total) }}</td>
                <td style="text-align:right">{{ toCurrency(r.paidAmount) }}</td>
                <td style="text-align:right">{{ toCurrency(invoiceOutstanding(r)) }}</td>
              </tr>
            </tbody>
          </table>
        </template>
      </PanelBox>
    </template>

    <AppModal v-model="showSupplierModal" :title="supplierEditId ? 'Edit Supplier' : 'Tambah Supplier'" icon="fa-truck" width="650px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group-gen">
          <label class="form-label">Kode Supplier</label>
          <input v-model="supplierForm.code" class="form-control-gen" placeholder="SUP-006" />
        </div>
        <div class="form-group-gen">
          <label class="form-label">Nama Supplier</label>
          <input v-model="supplierForm.name" class="form-control-gen" placeholder="Nama supplier" />
        </div>
        <div class="form-group-gen">
          <label class="form-label">PIC</label>
          <input v-model="supplierForm.pic" class="form-control-gen" placeholder="Nama PIC" />
        </div>
        <div class="form-group-gen">
          <label class="form-label">Telepon</label>
          <input v-model="supplierForm.phone" class="form-control-gen" placeholder="08xxxxxxxx" />
        </div>
        <div class="form-group-gen">
          <label class="form-label">Email</label>
          <input v-model="supplierForm.email" class="form-control-gen" placeholder="supplier@mail.com" />
        </div>
        <div class="form-group-gen">
          <label class="form-label">Kota</label>
          <input v-model="supplierForm.city" class="form-control-gen" placeholder="Jakarta" />
        </div>
        <div class="form-group-gen">
          <label class="form-label">Term Pembayaran</label>
          <input v-model="supplierForm.paymentTerm" class="form-control-gen" placeholder="30 Hari" />
        </div>
        <div class="form-group-gen">
          <label class="form-label">Status</label>
          <select v-model="supplierForm.status" class="form-control-gen">
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
          </select>
        </div>
        <div class="form-group-gen" style="grid-column:1/-1">
          <label class="form-label">Alamat</label>
          <textarea v-model="supplierForm.address" class="form-control-gen" rows="2" placeholder="Alamat supplier"></textarea>
        </div>
      </div>
      <template #footer>
        <button class="btn-gen btn-outline" @click="showSupplierModal = false">Batal</button>
        <button class="btn-gen btn-teal" @click="saveSupplier"><i class="fas fa-save"></i> Simpan</button>
      </template>
    </AppModal>

    <AppModal v-model="showPoModal" :title="poEditId ? 'Edit Purchase Order' : 'Tambah Purchase Order'" icon="fa-shopping-cart" width="680px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group-gen">
          <label class="form-label">No. PO</label>
          <input v-model="poForm.poNumber" class="form-control-gen" placeholder="PO-2026-0005" />
        </div>
        <div class="form-group-gen">
          <label class="form-label">Supplier</label>
          <select v-model="poForm.supplierId" class="form-control-gen">
            <option v-for="s in suppliers" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
        </div>
        <div class="form-group-gen">
          <label class="form-label">Tanggal PO</label>
          <input v-model="poForm.poDate" type="date" class="form-control-gen" />
        </div>
        <div class="form-group-gen">
          <label class="form-label">Estimasi Datang</label>
          <input v-model="poForm.expectedDate" type="date" class="form-control-gen" />
        </div>
        <div class="form-group-gen" style="grid-column:1/-1">
          <label class="form-label">Nama Barang</label>
          <input v-model="poForm.itemName" class="form-control-gen" placeholder="Nama barang" />
        </div>
        <div class="form-group-gen">
          <label class="form-label">Qty</label>
          <input v-model.number="poForm.qty" type="number" min="1" class="form-control-gen" />
        </div>
        <div class="form-group-gen">
          <label class="form-label">Harga Satuan</label>
          <input v-model.number="poForm.unitPrice" type="number" min="0" class="form-control-gen" />
        </div>
        <div class="form-group-gen">
          <label class="form-label">Status</label>
          <select v-model="poForm.status" class="form-control-gen">
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="approved">Approved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div class="form-group-gen">
          <label class="form-label">Total (estimasi)</label>
          <input :value="toCurrency(poFormTotal)" class="form-control-gen" readonly />
        </div>
        <div class="form-group-gen" style="grid-column:1/-1">
          <label class="form-label">Catatan</label>
          <textarea v-model="poForm.notes" class="form-control-gen" rows="2" placeholder="Catatan pembelian"></textarea>
        </div>
      </div>
      <template #footer>
        <button class="btn-gen btn-outline" @click="showPoModal = false">Batal</button>
        <button class="btn-gen btn-teal" @click="savePo"><i class="fas fa-save"></i> Simpan</button>
      </template>
    </AppModal>

    <AppModal v-model="showInvoiceModal" :title="invoiceEditId ? 'Edit Invoice Pembelian' : 'Tambah Invoice Pembelian'" icon="fa-file-invoice" width="680px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group-gen">
          <label class="form-label">No. Invoice</label>
          <input v-model="invoiceForm.invoiceNumber" class="form-control-gen" placeholder="INV-BELI-2026-004" />
        </div>
        <div class="form-group-gen">
          <label class="form-label">Purchase Order</label>
          <select v-model="invoiceForm.poId" class="form-control-gen" @change="onPoChangeInInvoiceForm">
            <option v-for="po in purchaseOrders" :key="po.id" :value="po.id">{{ po.poNumber }}</option>
          </select>
        </div>
        <div class="form-group-gen">
          <label class="form-label">Supplier</label>
          <select v-model="invoiceForm.supplierId" class="form-control-gen">
            <option v-for="s in suppliers" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
        </div>
        <div class="form-group-gen">
          <label class="form-label">Status</label>
          <select v-model="invoiceForm.status" class="form-control-gen">
            <option value="unpaid">Belum Bayar</option>
            <option value="partial">Sebagian</option>
            <option value="paid">Lunas</option>
            <option value="overdue">Jatuh Tempo</option>
          </select>
        </div>
        <div class="form-group-gen">
          <label class="form-label">Tanggal Invoice</label>
          <input v-model="invoiceForm.invoiceDate" type="date" class="form-control-gen" />
        </div>
        <div class="form-group-gen">
          <label class="form-label">Jatuh Tempo</label>
          <input v-model="invoiceForm.dueDate" type="date" class="form-control-gen" />
        </div>
        <div class="form-group-gen">
          <label class="form-label">Total Tagihan</label>
          <input v-model.number="invoiceForm.total" type="number" min="0" class="form-control-gen" />
        </div>
        <div class="form-group-gen">
          <label class="form-label">Jumlah Dibayar</label>
          <input v-model.number="invoiceForm.paidAmount" type="number" min="0" class="form-control-gen" />
        </div>
        <div class="form-group-gen" style="grid-column:1/-1">
          <label class="form-label">Catatan</label>
          <textarea v-model="invoiceForm.notes" class="form-control-gen" rows="2" placeholder="Catatan invoice"></textarea>
        </div>
      </div>
      <template #footer>
        <button class="btn-gen btn-outline" @click="showInvoiceModal = false">Batal</button>
        <button class="btn-gen btn-teal" @click="saveInvoice"><i class="fas fa-save"></i> Simpan</button>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue'
import { MODULES } from '@/data/constants'
import { DUMMY_PURCHASE_INVOICES, DUMMY_PURCHASE_ORDERS, DUMMY_SUPPLIERS } from '@/data/purchasingDummy'
import { useAuthStore, usePermissionStore } from '@/store'
import AppModal from '@/components/common/AppModal.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import PanelBox from '@/components/common/PanelBox.vue'
import StatTile from '@/components/common/StatTile.vue'

const auth = useAuthStore()
const permStore = usePermissionStore()
const showToast = inject('showToast', () => {})

const moduleIds = ['m03', 'm04', 'm05']
const subModules = computed(() => MODULES.filter(m => moduleIds.includes(m.id)))

const accessibleSubModules = computed(() => {
  const perms = permStore.getPerms(auth.activeCompanyId)
  return subModules.value.filter(m => perms[m.id]?.[auth.currentUser.roleId])
})
const hasAccess = computed(() => accessibleSubModules.value.length > 0)

const tabs = [
  { key: 'supplier', label: 'Supplier', icon: 'fa-truck' },
  { key: 'po', label: 'Purchase Order', icon: 'fa-shopping-cart' },
  { key: 'invoice', label: 'Invoice Pembelian', icon: 'fa-file-invoice' },
  { key: 'report', label: 'Laporan', icon: 'fa-chart-bar' },
]
const activeTab = ref('supplier')

const suppliers = ref(JSON.parse(JSON.stringify(DUMMY_SUPPLIERS)))
const purchaseOrders = ref(JSON.parse(JSON.stringify(DUMMY_PURCHASE_ORDERS)))
const invoices = ref(JSON.parse(JSON.stringify(DUMMY_PURCHASE_INVOICES)))

const nextSupplierId = ref(Math.max(...suppliers.value.map(s => s.id), 0) + 1)
const nextPoId = ref(Math.max(...purchaseOrders.value.map(po => po.id), 0) + 1)
const nextInvoiceId = ref(Math.max(...invoices.value.map(inv => inv.id), 0) + 1)

const supplierSearch = ref('')
const supplierStatusFilter = ref('')

const filteredSuppliers = computed(() => suppliers.value.filter(s => {
  const q = supplierSearch.value.toLowerCase()
  if (q && !`${s.name} ${s.pic} ${s.city}`.toLowerCase().includes(q)) return false
  if (supplierStatusFilter.value && s.status !== supplierStatusFilter.value) return false
  return true
}))

const showSupplierModal = ref(false)
const supplierEditId = ref(null)
const supplierForm = ref(defaultSupplierForm())

function defaultSupplierForm() {
  return {
    code: '',
    name: '',
    pic: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    paymentTerm: '30 Hari',
    status: 'aktif',
  }
}

function openSupplierAdd() {
  supplierEditId.value = null
  supplierForm.value = {
    ...defaultSupplierForm(),
    code: `SUP-${String(nextSupplierId.value).padStart(3, '0')}`,
  }
  showSupplierModal.value = true
}

function openSupplierEdit(supplier) {
  supplierEditId.value = supplier.id
  supplierForm.value = { ...supplier }
  showSupplierModal.value = true
}

function saveSupplier() {
  if (!supplierForm.value.name.trim()) {
    showToast('Nama supplier wajib diisi', 'error')
    return
  }
  if (supplierEditId.value) {
    const idx = suppliers.value.findIndex(s => s.id === supplierEditId.value)
    if (idx !== -1) suppliers.value[idx] = { ...suppliers.value[idx], ...supplierForm.value }
    showToast('Supplier berhasil diperbarui')
  } else {
    suppliers.value.push({ ...supplierForm.value, id: nextSupplierId.value++ })
    showToast('Supplier berhasil ditambahkan')
  }
  showSupplierModal.value = false
}

function removeSupplier(id) {
  if (!confirm('Hapus supplier ini?')) return
  suppliers.value = suppliers.value.filter(s => s.id !== id)
  showToast('Supplier berhasil dihapus')
}

const poSearch = ref('')
const poStatusFilter = ref('')

const filteredPurchaseOrders = computed(() => purchaseOrders.value.filter(po => {
  const q = poSearch.value.toLowerCase()
  if (q && !`${po.poNumber} ${po.itemName}`.toLowerCase().includes(q)) return false
  if (poStatusFilter.value && po.status !== poStatusFilter.value) return false
  return true
}))

const showPoModal = ref(false)
const poEditId = ref(null)
const poForm = ref(defaultPoForm())

function defaultPoForm() {
  return {
    poNumber: '',
    supplierId: suppliers.value[0]?.id ?? null,
    poDate: new Date().toISOString().slice(0, 10),
    expectedDate: new Date().toISOString().slice(0, 10),
    itemName: '',
    qty: 1,
    unitPrice: 0,
    status: 'draft',
    notes: '',
  }
}

const poFormTotal = computed(() => {
  const subtotal = Number(poForm.value.qty || 0) * Number(poForm.value.unitPrice || 0)
  return subtotal * 1.11
})

function openPoAdd() {
  poEditId.value = null
  poForm.value = {
    ...defaultPoForm(),
    poNumber: `PO-${new Date().getFullYear()}-${String(nextPoId.value).padStart(4, '0')}`,
  }
  showPoModal.value = true
}

function openPoEdit(po) {
  poEditId.value = po.id
  poForm.value = { ...po }
  showPoModal.value = true
}

function savePo() {
  if (!poForm.value.poNumber.trim() || !poForm.value.itemName.trim()) {
    showToast('No PO dan nama barang wajib diisi', 'error')
    return
  }
  if (poEditId.value) {
    const idx = purchaseOrders.value.findIndex(po => po.id === poEditId.value)
    if (idx !== -1) purchaseOrders.value[idx] = { ...purchaseOrders.value[idx], ...poForm.value }
    showToast('Purchase Order berhasil diperbarui')
  } else {
    purchaseOrders.value.push({ ...poForm.value, id: nextPoId.value++ })
    showToast('Purchase Order berhasil ditambahkan')
  }
  showPoModal.value = false
}

function removePo(id) {
  if (!confirm('Hapus Purchase Order ini?')) return
  purchaseOrders.value = purchaseOrders.value.filter(po => po.id !== id)
  invoices.value = invoices.value.filter(inv => inv.poId !== id)
  showToast('Purchase Order berhasil dihapus')
}

const invoiceSearch = ref('')
const invoiceStatusFilter = ref('')

const filteredInvoices = computed(() => invoices.value.filter(inv => {
  const q = invoiceSearch.value.toLowerCase()
  const po = poNumber(inv.poId)
  if (q && !`${inv.invoiceNumber} ${po}`.toLowerCase().includes(q)) return false
  if (invoiceStatusFilter.value && inv.status !== invoiceStatusFilter.value) return false
  return true
}))

const showInvoiceModal = ref(false)
const invoiceEditId = ref(null)
const invoiceForm = ref(defaultInvoiceForm())

function defaultInvoiceForm() {
  return {
    invoiceNumber: '',
    poId: purchaseOrders.value[0]?.id ?? null,
    supplierId: purchaseOrders.value[0]?.supplierId ?? suppliers.value[0]?.id ?? null,
    invoiceDate: new Date().toISOString().slice(0, 10),
    dueDate: new Date().toISOString().slice(0, 10),
    total: 0,
    paidAmount: 0,
    status: 'unpaid',
    notes: '',
  }
}

function onPoChangeInInvoiceForm() {
  const po = purchaseOrders.value.find(item => item.id === Number(invoiceForm.value.poId))
  if (!po) return
  invoiceForm.value.supplierId = po.supplierId
  if (!invoiceEditId.value) invoiceForm.value.total = poTotal(po)
}

function openInvoiceAdd() {
  invoiceEditId.value = null
  invoiceForm.value = {
    ...defaultInvoiceForm(),
    invoiceNumber: `INV-BELI-${new Date().getFullYear()}-${String(nextInvoiceId.value).padStart(3, '0')}`,
  }
  onPoChangeInInvoiceForm()
  showInvoiceModal.value = true
}

function openInvoiceEdit(inv) {
  invoiceEditId.value = inv.id
  invoiceForm.value = { ...inv }
  showInvoiceModal.value = true
}

function saveInvoice() {
  if (!invoiceForm.value.invoiceNumber.trim()) {
    showToast('No Invoice wajib diisi', 'error')
    return
  }
  const normalized = {
    ...invoiceForm.value,
    paidAmount: Math.min(Number(invoiceForm.value.paidAmount || 0), Number(invoiceForm.value.total || 0)),
  }
  if (normalized.paidAmount >= normalized.total && normalized.total > 0) normalized.status = 'paid'
  else if (normalized.paidAmount > 0) normalized.status = 'partial'

  if (invoiceEditId.value) {
    const idx = invoices.value.findIndex(inv => inv.id === invoiceEditId.value)
    if (idx !== -1) invoices.value[idx] = { ...invoices.value[idx], ...normalized }
    showToast('Invoice berhasil diperbarui')
  } else {
    invoices.value.push({ ...normalized, id: nextInvoiceId.value++ })
    showToast('Invoice berhasil ditambahkan')
  }
  showInvoiceModal.value = false
}

function removeInvoice(id) {
  if (!confirm('Hapus invoice ini?')) return
  invoices.value = invoices.value.filter(inv => inv.id !== id)
  showToast('Invoice berhasil dihapus')
}

const reportMonth = ref('')
const reportYear = ref('')

const reportRows = computed(() => invoices.value.filter(inv => {
  const d = new Date(inv.invoiceDate)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = String(d.getFullYear())
  if (reportMonth.value && month !== reportMonth.value) return false
  if (reportYear.value && year !== reportYear.value) return false
  return true
}))

const reportPoTotal = computed(() => purchaseOrders.value.reduce((sum, po) => sum + poTotal(po), 0))
const reportInvoiceTotal = computed(() => invoices.value.reduce((sum, inv) => sum + Number(inv.total), 0))
const reportOutstanding = computed(() => invoices.value.reduce((sum, inv) => sum + invoiceOutstanding(inv), 0))

const reportTopSupplier = computed(() => {
  const map = {}
  for (const inv of invoices.value) {
    map[inv.supplierId] = (map[inv.supplierId] || 0) + Number(inv.total)
  }
  const entries = Object.entries(map)
  if (!entries.length) return { name: '-', total: 0 }
  const [supplierId, total] = entries.sort((a, b) => b[1] - a[1])[0]
  return { name: supplierName(Number(supplierId)), total }
})

const availableYears = computed(() => {
  const years = new Set(invoices.value.map(inv => new Date(inv.invoiceDate).getFullYear()))
  return [...years].sort((a, b) => b - a)
})

function supplierName(id) {
  return suppliers.value.find(s => s.id === Number(id))?.name || '-'
}

function poNumber(id) {
  return purchaseOrders.value.find(po => po.id === Number(id))?.poNumber || '-'
}

function poTotal(po) {
  const subtotal = Number(po.qty || 0) * Number(po.unitPrice || 0)
  return subtotal * 1.11
}

function invoiceOutstanding(inv) {
  return Math.max(Number(inv.total || 0) - Number(inv.paidAmount || 0), 0)
}

function toCurrency(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value || 0))
}

function formatCompactNumber(value) {
  return new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 }).format(Number(value || 0))
}

function downloadReportCsv() {
  const header = ['Tanggal', 'Invoice', 'Supplier', 'PO', 'Total', 'Terbayar', 'Sisa']
  const rows = reportRows.value.map(r => [
    r.invoiceDate,
    r.invoiceNumber,
    supplierName(r.supplierId),
    poNumber(r.poId),
    String(r.total),
    String(r.paidAmount),
    String(invoiceOutstanding(r)),
  ])
  const csv = [header, ...rows].map(cols => cols.map(v => `"${String(v).replaceAll('"', '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `laporan-purchasing-${Date.now()}.csv`
  link.click()
  URL.revokeObjectURL(url)
  showToast('Laporan berhasil diunduh')
}
</script>

<style scoped>
.status-badge.unpaid,
.status-badge.draft,
.status-badge.overdue,
.status-badge.nonaktif {
  background: #fdecec;
  color: #e74c3c;
}

.status-badge.partial,
.status-badge.sent {
  background: #fff4dd;
  color: #f39c12;
}

.status-badge.paid,
.status-badge.approved,
.status-badge.closed,
.status-badge.aktif {
  background: #e8f8f5;
  color: #1a8a72;
}
</style>
