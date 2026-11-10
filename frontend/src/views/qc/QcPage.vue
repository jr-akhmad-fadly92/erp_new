<template>
  <div>
    <PageHeader title="Quality Control" :crumbs="[{ label: 'Modul ERP' }, { label: 'Quality Control' }]" />

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
        <StatTile :value="inspections.length" label="Total Inspeksi" icon="fa-clipboard-check" color="" icon-color="#26B99A" />
        <StatTile :value="certificates.length" label="Sertifikat Aktif" icon="fa-certificate" color="blue" icon-color="#1c84c6" />
        <StatTile :value="passRatePercent + '%'" label="Pass Rate" icon="fa-check-circle" color="orange" icon-color="#f0ad4e" />
        <StatTile :value="defectRatePercent + '%'" label="Defect Rate" icon="fa-times-circle" color="red" icon-color="#e74c3c" />
      </div>

      <PanelBox title="Modul Quality Control" icon="fa-tasks">
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

        <template v-if="activeTab === 'inspeksi'">
          <div class="search-row">
            <input v-model="inspectionSearch" class="search-input" placeholder="Cari no inspeksi / produk / inspector..." />
            <select v-model="inspectionStatusFilter" class="search-select">
              <option value="">Semua Status</option>
              <option value="passed">Passed</option>
              <option value="warning">Warning</option>
              <option value="failed">Failed</option>
            </select>
            <button class="btn-gen btn-teal" @click="openInspectionAdd"><i class="fas fa-plus"></i> Tambah Inspeksi</button>
          </div>

          <table class="table-gen">
            <thead>
              <tr><th>No Inspeksi</th><th>Tanggal</th><th>Produk</th><th>Qty</th><th>Sample</th><th>Defect</th><th>Inspector</th><th>Status</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              <tr v-if="filteredInspections.length === 0"><td colspan="9" style="text-align:center;color:#aaa">Tidak ada data inspeksi</td></tr>
              <tr v-for="row in filteredInspections" :key="row.id">
                <td>{{ row.inspectionNumber }}</td>
                <td>{{ row.inspectionDate }}</td>
                <td>{{ row.productName }}</td>
                <td>{{ row.quantity }}</td>
                <td>{{ row.sampleSize }}</td>
                <td :style="{ fontWeight: 600, color: row.defectFound > 0 ? '#e74c3c' : '#1a8a72' }">{{ row.defectFound }}</td>
                <td>{{ row.inspector }}</td>
                <td><span class="status-badge" :class="row.status">{{ row.status }}</span></td>
                <td>
                  <button class="btn-gen btn-outline btn-xs" @click="openInspectionEdit(row)"><i class="fas fa-edit" style="color:#1c84c6"></i></button>
                  <button class="btn-gen btn-outline btn-xs" @click="removeInspection(row.id)"><i class="fas fa-trash" style="color:#e74c3c"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </template>

        <template v-else>
          <div class="search-row" style="margin-bottom:10px">
            <input v-model="certificateSearch" class="search-input" placeholder="Cari no sertifikat / produk..." style="flex:1" />
            <button class="btn-gen btn-outline" @click="downloadQcCsv"><i class="fas fa-file-csv"></i> Unduh CSV</button>
            <button class="btn-gen btn-outline" @click="downloadQcPdf"><i class="fas fa-file-pdf"></i> Unduh PDF</button>
            <button class="btn-gen btn-teal" @click="openCertificateAdd"><i class="fas fa-plus"></i> Tambah Sertifikat</button>
          </div>

          <div class="chart-grid" style="margin-bottom:14px">
            <div class="chart-card">
              <div class="chart-title">Hasil Inspeksi (Bulan Terakhir)</div>
              <div class="chart-bars" style="display:flex;gap:20px;align-items:flex-end;justify-content:center;min-height:160px">
                <div class="bar-item" style="text-align:center">
                  <div class="bar-label-top">{{ passedCount }}</div>
                  <div class="bar-track" style="width:40px;height:100px;background:#e8f8f5;border-radius:5px;overflow:hidden;display:flex;align-items:flex-end">
                    <div style="width:100%;background:#1a8a72;height:{{ (passedCount / Math.max(passedCount, warningCount, failedCount, 1)) * 100 }}%;border-radius:5px;min-height:8px"></div>
                  </div>
                  <div class="bar-label-bottom">Passed</div>
                </div>
                <div class="bar-item" style="text-align:center">
                  <div class="bar-label-top">{{ warningCount }}</div>
                  <div class="bar-track" style="width:40px;height:100px;background:#fff4dd;border-radius:5px;overflow:hidden;display:flex;align-items:flex-end">
                    <div style="width:100%;background:#f39c12;height:{{ (warningCount / Math.max(passedCount, warningCount, failedCount, 1)) * 100 }}%;border-radius:5px;min-height:8px"></div>
                  </div>
                  <div class="bar-label-bottom">Warning</div>
                </div>
                <div class="bar-item" style="text-align:center">
                  <div class="bar-label-top">{{ failedCount }}</div>
                  <div class="bar-track" style="width:40px;height:100px;background:#fadbd8;border-radius:5px;overflow:hidden;display:flex;align-items:flex-end">
                    <div style="width:100%;background:#e74c3c;height:{{ (failedCount / Math.max(passedCount, warningCount, failedCount, 1)) * 100 }}%;border-radius:5px;min-height:8px"></div>
                  </div>
                  <div class="bar-label-bottom">Failed</div>
                </div>
              </div>
            </div>

            <div class="chart-card">
              <div class="chart-title">Pass Rate Trend (5 Bulan)</div>
              <div class="chart-bars" style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px;align-items:flex-end;min-height:160px">
                <div v-for="row in summarySummary" :key="`pass-${row.month}`" class="bar-item" style="text-align:center">
                  <div class="bar-label-top" style="font-size:9px">{{ row.passRate }}%</div>
                  <div class="bar-track" style="width:100%;height:80px;background:#f5f9fc;border-radius:3px;overflow:hidden;display:flex;align-items:flex-end">
                    <div style="width:100%;background:#1c84c6;height:{{ row.passRate }}%;border-radius:3px;min-height:4px"></div>
                  </div>
                  <div class="bar-label-bottom" style="font-size:9px">{{ row.month.slice(5) }}</div>
                </div>
              </div>
            </div>
          </div>

          <div style="margin-bottom:14px">
            <div style="font-size:12px;font-weight:700;color:#455464;margin-bottom:8px">Daftar Sertifikat QC</div>
            <table class="table-gen">
              <thead>
                <tr><th>No Sertifikat</th><th>Tanggal</th><th>Produk</th><th>Batch</th><th>Grade</th><th>Berlaku Hingga</th><th>Dikeluarkan Oleh</th><th>Status</th><th>Aksi</th></tr>
              </thead>
              <tbody>
                <tr v-if="filteredCertificates.length === 0"><td colspan="9" style="text-align:center;color:#aaa">Tidak ada data sertifikat</td></tr>
                <tr v-for="row in filteredCertificates" :key="row.id">
                  <td>{{ row.certificateNumber }}</td>
                  <td>{{ row.certificateDate }}</td>
                  <td>{{ row.productName }}</td>
                  <td>{{ row.batchNumber }}</td>
                  <td><span style="background:#e3f2fd;color:#1c84c6;padding:2px 8px;border-radius:12px;font-weight:600;font-size:11px">{{ row.grade }}</span></td>
                  <td>{{ row.validUntil }}</td>
                  <td>{{ row.issuedBy }}</td>
                  <td><span class="status-badge" :class="row.status">{{ row.status }}</span></td>
                  <td>
                    <button class="btn-gen btn-outline btn-xs" @click="openCertificateEdit(row)"><i class="fas fa-edit" style="color:#1c84c6"></i></button>
                    <button class="btn-gen btn-outline btn-xs" @click="removeCertificate(row.id)"><i class="fas fa-trash" style="color:#e74c3c"></i></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </PanelBox>
    </template>

    <AppModal v-model="showInspectionModal" :title="inspectionEditId ? 'Edit Inspeksi' : 'Tambah Inspeksi'" icon="fa-clipboard-check" width="800px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group-gen"><label class="form-label">No Inspeksi</label><input v-model="inspectionForm.inspectionNumber" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Tanggal</label><input v-model="inspectionForm.inspectionDate" type="date" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Produk</label><select v-model="inspectionForm.productId" class="form-control-gen"><option v-for="p in products" :key="p.id" :value="p.id">{{ p.name }}</option></select></div>
        <div class="form-group-gen"><label class="form-label">Quantity</label><input v-model.number="inspectionForm.quantity" type="number" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Sample Size</label><input v-model.number="inspectionForm.sampleSize" type="number" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Defect Found</label><input v-model.number="inspectionForm.defectFound" type="number" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Inspector</label><input v-model="inspectionForm.inspector" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Status</label><select v-model="inspectionForm.status" class="form-control-gen"><option value="passed">Passed</option><option value="warning">Warning</option><option value="failed">Failed</option></select></div>
        <div class="form-group-gen" style="grid-column:1/-1"><label class="form-label">Catatan</label><textarea v-model="inspectionForm.notes" class="form-control-gen" style="min-height:60px"></textarea></div>
      </div>
      <template #footer>
        <button class="btn-gen btn-outline" @click="showInspectionModal = false">Batal</button>
        <button class="btn-gen btn-teal" @click="saveInspection"><i class="fas fa-save"></i> Simpan</button>
      </template>
    </AppModal>

    <AppModal v-model="showCertificateModal" :title="certificateEditId ? 'Edit Sertifikat' : 'Tambah Sertifikat'" icon="fa-certificate" width="700px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group-gen"><label class="form-label">No Sertifikat</label><input v-model="certificateForm.certificateNumber" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Tanggal</label><input v-model="certificateForm.certificateDate" type="date" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Produk</label><select v-model="certificateForm.productId" class="form-control-gen"><option v-for="p in products" :key="p.id" :value="p.id">{{ p.name }}</option></select></div>
        <div class="form-group-gen"><label class="form-label">Batch Number</label><input v-model="certificateForm.batchNumber" class="form-control-gen" /></div>
        <div class="form-group-gen"><label class="form-label">Grade</label><select v-model="certificateForm.grade" class="form-control-gen"><option value="A">A</option><option value="B">B</option><option value="C">C</option></select></div>
        <div class="form-group-gen"><label class="form-label">Berlaku Hingga</label><input v-model="certificateForm.validUntil" type="date" class="form-control-gen" /></div>
        <div class="form-group-gen" style="grid-column:1/-1"><label class="form-label">Dikeluarkan Oleh</label><input v-model="certificateForm.issuedBy" class="form-control-gen" /></div>
        <div class="form-group-gen" style="grid-column:1/-1"><label class="form-label">Status</label><select v-model="certificateForm.status" class="form-control-gen"><option value="active">Active</option><option value="expired">Expired</option></select></div>
      </div>
      <template #footer>
        <button class="btn-gen btn-outline" @click="showCertificateModal = false">Batal</button>
        <button class="btn-gen btn-teal" @click="saveCertificate"><i class="fas fa-save"></i> Simpan</button>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue'
import { MODULES } from '@/data/constants'
import { DUMMY_QC_INSPECTIONS, DUMMY_QC_CERTIFICATES, DUMMY_QC_INSPECTION_SUMMARY, DUMMY_PRODUCTS } from '@/data/qcDummy'
import { useAuthStore, usePermissionStore } from '@/store'
import AppModal from '@/components/common/AppModal.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import PanelBox from '@/components/common/PanelBox.vue'
import StatTile from '@/components/common/StatTile.vue'

const auth = useAuthStore()
const permStore = usePermissionStore()
const showToast = inject('showToast', () => {})

const subModules = computed(() => MODULES.filter(m => ['m20', 'm21'].includes(m.id)))
const hasAccess = computed(() => {
  const perms = permStore.getPerms(auth.activeCompanyId)
  return subModules.value.some(m => perms[m.id]?.[auth.currentUser.roleId])
})

const tabs = [
  { key: 'inspeksi', label: 'Inspeksi QC', icon: 'fa-clipboard-check' },
  { key: 'sertifikat', label: 'Sertifikat QC', icon: 'fa-certificate' },
]
const activeTab = ref('inspeksi')

const inspections = ref(JSON.parse(JSON.stringify(DUMMY_QC_INSPECTIONS)))
const certificates = ref(JSON.parse(JSON.stringify(DUMMY_QC_CERTIFICATES)))
const summarySummary = ref(JSON.parse(JSON.stringify(DUMMY_QC_INSPECTION_SUMMARY)))
const products = ref(JSON.parse(JSON.stringify(DUMMY_PRODUCTS)))

const nextInspectionId = ref(Math.max(...inspections.value.map(v => v.id), 0) + 1)
const nextCertificateId = ref(Math.max(...certificates.value.map(v => v.id), 0) + 1)

const inspectionSearch = ref('')
const inspectionStatusFilter = ref('')
const certificateSearch = ref('')

const filteredInspections = computed(() => inspections.value.filter(v => {
  const q = inspectionSearch.value.toLowerCase()
  if (q && !`${v.inspectionNumber} ${v.productName} ${v.inspector}`.toLowerCase().includes(q)) return false
  if (inspectionStatusFilter.value && v.status !== inspectionStatusFilter.value) return false
  return true
}))

const filteredCertificates = computed(() => certificates.value.filter(v => {
  const q = certificateSearch.value.toLowerCase()
  if (q && !`${v.certificateNumber} ${v.productName}`.toLowerCase().includes(q)) return false
  return true
}))

const passedCount = computed(() => inspections.value.filter(v => v.status === 'passed').length)
const warningCount = computed(() => inspections.value.filter(v => v.status === 'warning').length)
const failedCount = computed(() => inspections.value.filter(v => v.status === 'failed').length)

const passRatePercent = computed(() => {
  if (inspections.value.length === 0) return 0
  return Math.round((passedCount.value / inspections.value.length) * 100)
})

const defectRatePercent = computed(() => {
  if (inspections.value.length === 0) return 0
  const totalDefects = inspections.value.reduce((sum, v) => sum + v.defectFound, 0)
  return Math.round((totalDefects / (inspections.value.length * 10)) * 100)
})

const showInspectionModal = ref(false)
const inspectionEditId = ref(null)
const inspectionForm = ref(defaultInspectionForm())

function defaultInspectionForm() {
  const prod = products.value[0]
  return {
    inspectionNumber: '',
    inspectionDate: new Date().toISOString().slice(0, 10),
    productId: prod?.id || '',
    productName: prod?.name || '',
    quantity: 0,
    sampleSize: 0,
    defectFound: 0,
    status: 'passed',
    inspector: '',
    notes: '',
  }
}

function openInspectionAdd() {
  inspectionEditId.value = null
  const prod = products.value[0]
  inspectionForm.value = {
    ...defaultInspectionForm(),
    inspectionNumber: `INS-${new Date().getFullYear()}-${String(nextInspectionId.value).padStart(4, '0')}`,
    productId: prod?.id || '',
    productName: prod?.name || '',
  }
  showInspectionModal.value = true
}

function openInspectionEdit(row) {
  inspectionEditId.value = row.id
  inspectionForm.value = { ...row }
  showInspectionModal.value = true
}

function saveInspection() {
  if (!inspectionForm.value.inspectionNumber || !inspectionForm.value.inspector) {
    showToast('Data tidak valid')
    return
  }

  if (inspectionEditId.value) {
    const idx = inspections.value.findIndex(v => v.id === inspectionEditId.value)
    if (idx !== -1) inspections.value[idx] = { ...inspections.value[idx], ...inspectionForm.value }
    showToast('Inspeksi diperbarui')
  } else {
    const prod = products.value.find(p => p.id === inspectionForm.value.productId)
    inspections.value.push({ ...inspectionForm.value, id: nextInspectionId.value++, productName: prod?.name })
    showToast('Inspeksi ditambahkan')
  }

  showInspectionModal.value = false
}

function removeInspection(id) {
  if (!confirm('Hapus inspeksi?')) return
  inspections.value = inspections.value.filter(v => v.id !== id)
}

const showCertificateModal = ref(false)
const certificateEditId = ref(null)
const certificateForm = ref(defaultCertificateForm())

function defaultCertificateForm() {
  const prod = products.value[0]
  return {
    certificateNumber: '',
    certificateDate: new Date().toISOString().slice(0, 10),
    productId: prod?.id || '',
    productName: prod?.name || '',
    batchNumber: '',
    grade: 'A',
    validUntil: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()).toISOString().slice(0, 10),
    issuedBy: '',
    status: 'active',
  }
}

function openCertificateAdd() {
  certificateEditId.value = null
  const prod = products.value[0]
  certificateForm.value = {
    ...defaultCertificateForm(),
    certificateNumber: `CRT-${new Date().getFullYear()}-${String(nextCertificateId.value).padStart(4, '0')}`,
    productId: prod?.id || '',
    productName: prod?.name || '',
  }
  showCertificateModal.value = true
}

function openCertificateEdit(row) {
  certificateEditId.value = row.id
  certificateForm.value = { ...row }
  showCertificateModal.value = true
}

function saveCertificate() {
  if (!certificateForm.value.certificateNumber || !certificateForm.value.issuedBy) {
    showToast('Data tidak valid')
    return
  }

  if (certificateEditId.value) {
    const idx = certificates.value.findIndex(v => v.id === certificateEditId.value)
    if (idx !== -1) certificates.value[idx] = { ...certificates.value[idx], ...certificateForm.value }
    showToast('Sertifikat diperbarui')
  } else {
    const prod = products.value.find(p => p.id === certificateForm.value.productId)
    certificates.value.push({ ...certificateForm.value, id: nextCertificateId.value++, productName: prod?.name })
    showToast('Sertifikat ditambahkan')
  }

  showCertificateModal.value = false
}

function removeCertificate(id) {
  if (!confirm('Hapus sertifikat?')) return
  certificates.value = certificates.value.filter(v => v.id !== id)
}

function downloadQcCsv() {
  const lines = []
  lines.push('LAPORAN QUALITY CONTROL')
  lines.push(`Periode: ${new Date().toLocaleDateString('id-ID')}`)
  lines.push('')
  lines.push('INSPEKSI QC')
  lines.push('No Inspeksi,Tanggal,Produk,Quantity,Sample,Defect,Inspector,Status')
  inspections.value.forEach(row => {
    lines.push(`${row.inspectionNumber},${row.inspectionDate},${row.productName},${row.quantity},${row.sampleSize},${row.defectFound},${row.inspector},${row.status}`)
  })
  lines.push('')
  lines.push('SERTIFIKAT QC')
  lines.push('No Sertifikat,Tanggal,Produk,Batch,Grade,Berlaku Hingga,Dikeluarkan Oleh,Status')
  certificates.value.forEach(row => {
    lines.push(`${row.certificateNumber},${row.certificateDate},${row.productName},${row.batchNumber},${row.grade},${row.validUntil},${row.issuedBy},${row.status}`)
  })

  const csv = lines.join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `qc-report-${Date.now()}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

function downloadQcPdf() {
  const htmlContent = `
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial; margin: 20px; font-size: 12px; }
          .header { text-align: center; font-weight: bold; font-size: 14px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #333; padding: 8px; text-align: left; }
          th { background: #f0f0f0; font-weight: bold; }
          .section-title { font-weight: bold; background: #f5f5f5; }
          .passed { background: #e8f8f5; }
          .warning { background: #fff4dd; }
          .failed { background: #fadbd8; }
          .summary { margin-bottom: 20px; }
          .summary-row { display: flex; gap: 20px; margin-bottom: 10px; }
          .summary-item { flex: 1; padding: 10px; background: #f9f9f9; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>LAPORAN QUALITY CONTROL</div>
          <div>${new Date().toLocaleDateString('id-ID')}</div>
        </div>

        <div class="summary">
          <div style="font-weight:bold;margin-bottom:10px">RINGKASAN</div>
          <div class="summary-row">
            <div class="summary-item">Total Inspeksi: ${inspections.value.length}</div>
            <div class="summary-item">Passed: ${passedCount.value}</div>
            <div class="summary-item">Warning: ${warningCount.value}</div>
            <div class="summary-item">Failed: ${failedCount.value}</div>
          </div>
          <div class="summary-row">
            <div class="summary-item">Pass Rate: ${passRatePercent.value}%</div>
            <div class="summary-item">Defect Rate: ${defectRatePercent.value}%</div>
            <div class="summary-item">Total Sertifikat: ${certificates.value.length}</div>
          </div>
        </div>

        <div style="page-break-inside: avoid;">
          <div style="font-weight:bold;margin-bottom:10px;margin-top:20px">INSPEKSI QC</div>
          <table>
            <tr class="section-title">
              <th>No Inspeksi</th><th>Tanggal</th><th>Produk</th><th>Qty</th><th>Sample</th><th>Defect</th><th>Inspector</th><th>Status</th>
            </tr>
            ${inspections.value.map(row => `<tr class="${row.status}"><td>${row.inspectionNumber}</td><td>${row.inspectionDate}</td><td>${row.productName}</td><td>${row.quantity}</td><td>${row.sampleSize}</td><td>${row.defectFound}</td><td>${row.inspector}</td><td>${row.status}</td></tr>`).join('')}
          </table>
        </div>

        <div style="page-break-inside: avoid;">
          <div style="font-weight:bold;margin-bottom:10px;margin-top:20px">SERTIFIKAT QC</div>
          <table>
            <tr class="section-title">
              <th>No Sertifikat</th><th>Tanggal</th><th>Produk</th><th>Batch</th><th>Grade</th><th>Berlaku Hingga</th><th>Dikeluarkan Oleh</th><th>Status</th>
            </tr>
            ${certificates.value.map(row => `<tr><td>${row.certificateNumber}</td><td>${row.certificateDate}</td><td>${row.productName}</td><td>${row.batchNumber}</td><td>${row.grade}</td><td>${row.validUntil}</td><td>${row.issuedBy}</td><td>${row.status}</td></tr>`).join('')}
          </table>
        </div>
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
.status-badge.passed {
  background: #e8f8f5;
  color: #1a8a72;
}

.status-badge.warning {
  background: #fff4dd;
  color: #f39c12;
}

.status-badge.failed {
  background: #fadbd8;
  color: #e74c3c;
}

.status-badge.active {
  background: #e8f8f5;
  color: #1a8a72;
}

.status-badge.expired {
  background: #fff4dd;
  color: #f39c12;
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
  margin-bottom: 12px;
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
  font-weight: 600;
}

.bar-label-bottom {
  font-size: 9px;
  color: #6b7786;
  white-space: nowrap;
}
</style>
