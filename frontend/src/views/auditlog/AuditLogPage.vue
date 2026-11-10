<template>
  <div>
    <PageHeader title="Audit Log" :crumbs="[{ label: 'Modul ERP' }, { label: 'Audit Log' }]" />

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
        <StatTile :value="logs.length" label="Total Log" icon="fa-history" color="" icon-color="#26B99A" />
        <StatTile :value="createCount" label="CREATE" icon="fa-plus-square" color="blue" icon-color="#1c84c6" />
        <StatTile :value="updateCount" label="UPDATE" icon="fa-edit" color="orange" icon-color="#f0ad4e" />
        <StatTile :value="deleteCount" label="DELETE" icon="fa-trash" color="red" icon-color="#e74c3c" />
      </div>

      <PanelBox title="Modul Audit Log" icon="fa-clipboard-list">
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

        <template v-if="activeTab === 'log'">
          <div class="search-row">
            <input v-model="logSearch" class="search-input" placeholder="Cari user / action / module / reference..." />
            <select v-model="logActionFilter" class="search-select">
              <option value="">Semua Action</option>
              <option value="CREATE">CREATE</option>
              <option value="UPDATE">UPDATE</option>
              <option value="DELETE">DELETE</option>
              <option value="VIEW">VIEW</option>
              <option value="EXPORT">EXPORT</option>
            </select>
            <select v-model="logStatusFilter" class="search-select">
              <option value="">Semua Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
            <button class="btn-gen btn-outline" @click="downloadAuditCsv"><i class="fas fa-file-csv"></i> CSV</button>
            <button class="btn-gen btn-outline" @click="downloadAuditPdf"><i class="fas fa-file-pdf"></i> PDF</button>
          </div>

          <table class="table-gen">
            <thead>
              <tr><th>Waktu</th><th>User</th><th>Action</th><th>Module</th><th>Reference</th><th>Deskripsi</th><th>IP Address</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr v-if="filteredLogs.length === 0"><td colspan="8" style="text-align:center;color:#aaa">Tidak ada log</td></tr>
              <tr v-for="row in filteredLogs" :key="row.id">
                <td style="font-size:10px">{{ row.timestamp }}</td>
                <td>{{ row.userName }}</td>
                <td><span class="action-badge" :class="row.action.toLowerCase()">{{ row.action }}</span></td>
                <td>{{ row.module }}</td>
                <td style="font-size:11px">{{ row.reference }}</td>
                <td style="font-size:11px;max-width:200px">{{ row.description }}</td>
                <td style="font-size:10px">{{ row.ipAddress }}</td>
                <td><span class="status-badge" :class="row.status">{{ row.status }}</span></td>
              </tr>
            </tbody>
          </table>
        </template>

        <template v-else>
          <div class="chart-grid" style="margin-bottom:14px">
            <div class="chart-card">
              <div class="chart-title">Aktivitas Bulanan (5 Bulan)</div>
              <div class="chart-bars" style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px;align-items:flex-end;min-height:160px">
                <div v-for="row in activitySummary" :key="`total-${row.month}`" class="bar-item" style="text-align:center">
                  <div class="bar-label-top" style="font-size:9px">{{ toCompact(row.total) }}</div>
                  <div class="bar-track" style="width:100%;height:100px;background:#f5f9fc;border-radius:3px;overflow:hidden;display:flex;align-items:flex-end">
                    <div style="width:100%;background:#1c84c6;height:{{ (row.total / maxActivity) * 100 }}%;border-radius:3px;min-height:4px"></div>
                  </div>
                  <div class="bar-label-bottom" style="font-size:9px">{{ row.month.slice(5) }}</div>
                </div>
              </div>
            </div>

            <div class="chart-card">
              <div class="chart-title">Distribusi Action</div>
              <div style="display:flex;gap:20px;align-items:flex-end;justify-content:center;min-height:160px">
                <div class="bar-item" style="text-align:center">
                  <div class="bar-label-top">{{ createCount }}</div>
                  <div class="bar-track" style="width:30px;height:100px;background:#e3f2fd;border-radius:5px;overflow:hidden;display:flex;align-items:flex-end">
                    <div style="width:100%;background:#1c84c6;height:{{ (createCount / Math.max(createCount, updateCount, deleteCount, 1)) * 100 }}%;border-radius:5px;min-height:8px"></div>
                  </div>
                  <div class="bar-label-bottom">CREATE</div>
                </div>
                <div class="bar-item" style="text-align:center">
                  <div class="bar-label-top">{{ updateCount }}</div>
                  <div class="bar-track" style="width:30px;height:100px;background:#fff3e0;border-radius:5px;overflow:hidden;display:flex;align-items:flex-end">
                    <div style="width:100%;background:#f0ad4e;height:{{ (updateCount / Math.max(createCount, updateCount, deleteCount, 1)) * 100 }}%;border-radius:5px;min-height:8px"></div>
                  </div>
                  <div class="bar-label-bottom">UPDATE</div>
                </div>
                <div class="bar-item" style="text-align:center">
                  <div class="bar-label-top">{{ deleteCount }}</div>
                  <div class="bar-track" style="width:30px;height:100px;background:#fadbd8;border-radius:5px;overflow:hidden;display:flex;align-items:flex-end">
                    <div style="width:100%;background:#e74c3c;height:{{ (deleteCount / Math.max(createCount, updateCount, deleteCount, 1)) * 100 }}%;border-radius:5px;min-height:8px"></div>
                  </div>
                  <div class="bar-label-bottom">DELETE</div>
                </div>
                <div class="bar-item" style="text-align:center">
                  <div class="bar-label-top">{{ viewCount }}</div>
                  <div class="bar-track" style="width:30px;height:100px;background:#f3e5f5;border-radius:5px;overflow:hidden;display:flex;align-items:flex-end">
                    <div style="width:100%;background:#9B59B6;height:{{ (viewCount / Math.max(viewCount, exportCount, 1)) * 100 }}%;border-radius:5px;min-height:8px"></div>
                  </div>
                  <div class="bar-label-bottom">VIEW</div>
                </div>
                <div class="bar-item" style="text-align:center">
                  <div class="bar-label-top">{{ exportCount }}</div>
                  <div class="bar-track" style="width:30px;height:100px;background:#e0f2f1;border-radius:5px;overflow:hidden;display:flex;align-items:flex-end">
                    <div style="width:100%;background:#16a085;height:{{ (exportCount / Math.max(viewCount, exportCount, 1)) * 100 }}%;border-radius:5px;min-height:8px"></div>
                  </div>
                  <div class="bar-label-bottom">EXPORT</div>
                </div>
              </div>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px;margin-bottom:14px">
            <div style="border:1px solid #eef1f5;border-radius:10px;padding:12px;background:#fff">
              <div style="font-size:11px;color:#6b7786;margin-bottom:4px">Module Usage</div>
              <div v-for="mod in moduleUsage" :key="mod.module" style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:11px">
                <span>{{ mod.module }}</span>
                <span style="background:#e3f2fd;color:#1c84c6;padding:1px 6px;border-radius:8px">{{ mod.activities }} ({{ mod.percentage }}%)</span>
              </div>
            </div>

            <div style="border:1px solid #eef1f5;border-radius:10px;padding:12px;background:#fff">
              <div style="font-size:11px;color:#6b7786;margin-bottom:4px">Top Users</div>
              <div v-for="(user, i) in topUsers" :key="i" style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:11px">
                <span>{{ user }}</span>
                <span style="background:#fff3e0;color:#f0ad4e;padding:1px 6px;border-radius:8px">{{ userActivityCount(user) }}</span>
              </div>
            </div>
          </div>

          <div style="font-size:12px;font-weight:700;color:#455464;margin-bottom:8px">Riwayat Aktivitas</div>
          <table class="table-gen">
            <thead>
              <tr><th>Bulan</th><th>CREATE</th><th>UPDATE</th><th>DELETE</th><th>VIEW</th><th>EXPORT</th><th>Total</th></tr>
            </thead>
            <tbody>
              <tr v-for="row in activitySummary" :key="row.month">
                <td>{{ formatMonth(row.month) }}</td>
                <td :style="{ color: '#1c84c6', fontWeight: 600 }">{{ row.creates }}</td>
                <td :style="{ color: '#f0ad4e', fontWeight: 600 }">{{ row.updates }}</td>
                <td :style="{ color: '#e74c3c', fontWeight: 600 }">{{ row.deletes }}</td>
                <td :style="{ color: '#9B59B6', fontWeight: 600 }">{{ row.views }}</td>
                <td :style="{ color: '#16a085', fontWeight: 600 }">{{ row.exports }}</td>
                <td :style="{ fontWeight: 700 }">{{ row.total }}</td>
              </tr>
            </tbody>
          </table>
        </template>
      </PanelBox>
    </template>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { MODULES } from '@/data/constants'
import { DUMMY_AUDIT_LOGS, DUMMY_AUDIT_ACTIVITY_SUMMARY, DUMMY_MODULES_USAGE, DUMMY_ACTION_TYPES } from '@/data/auditLogDummy'
import { useAuthStore, usePermissionStore } from '@/store'
import PageHeader from '@/components/common/PageHeader.vue'
import PanelBox from '@/components/common/PanelBox.vue'
import StatTile from '@/components/common/StatTile.vue'

const auth = useAuthStore()
const permStore = usePermissionStore()

const subModules = computed(() => MODULES.filter(m => ['m22', 'm23'].includes(m.id)))
const hasAccess = computed(() => {
  const perms = permStore.getPerms(auth.activeCompanyId)
  return subModules.value.some(m => perms[m.id]?.[auth.currentUser.roleId])
})

const tabs = [
  { key: 'log', label: 'Audit Log', icon: 'fa-history' },
  { key: 'report', label: 'Laporan Aktivitas', icon: 'fa-chart-bar' },
]
const activeTab = ref('log')

const logs = ref(JSON.parse(JSON.stringify(DUMMY_AUDIT_LOGS)))
const activitySummary = ref(JSON.parse(JSON.stringify(DUMMY_AUDIT_ACTIVITY_SUMMARY)))
const moduleUsage = ref(JSON.parse(JSON.stringify(DUMMY_MODULES_USAGE)))
const actionTypes = ref(JSON.parse(JSON.stringify(DUMMY_ACTION_TYPES)))

const logSearch = ref('')
const logActionFilter = ref('')
const logStatusFilter = ref('')

const filteredLogs = computed(() => logs.value.filter(v => {
  const q = logSearch.value.toLowerCase()
  if (q && !`${v.userName} ${v.action} ${v.module} ${v.reference} ${v.description}`.toLowerCase().includes(q)) return false
  if (logActionFilter.value && v.action !== logActionFilter.value) return false
  if (logStatusFilter.value && v.status !== logStatusFilter.value) return false
  return true
}))

const createCount = computed(() => logs.value.filter(v => v.action === 'CREATE').length)
const updateCount = computed(() => logs.value.filter(v => v.action === 'UPDATE').length)
const deleteCount = computed(() => logs.value.filter(v => v.action === 'DELETE').length)
const viewCount = computed(() => logs.value.filter(v => v.action === 'VIEW').length)
const exportCount = computed(() => logs.value.filter(v => v.action === 'EXPORT').length)

const maxActivity = computed(() => Math.max(...activitySummary.value.map(v => v.total), 1))

const topUsers = computed(() => {
  const userMap = {}
  logs.value.forEach(log => {
    userMap[log.userName] = (userMap[log.userName] || 0) + 1
  })
  return Object.keys(userMap).sort((a, b) => userMap[b] - userMap[a]).slice(0, 3)
})

function userActivityCount(userName) {
  return logs.value.filter(v => v.userName === userName).length
}

function formatMonth(monthString) {
  const [year, month] = String(monthString || '').split('-')
  const date = new Date(Number(year), Number(month) - 1, 1)
  return date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
}

function toCompact(value) {
  return new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 }).format(Number(value || 0))
}

function downloadAuditCsv() {
  const lines = []
  lines.push('LAPORAN AUDIT LOG')
  lines.push(`Periode: ${new Date().toLocaleDateString('id-ID')}`)
  lines.push('')
  lines.push('DETAIL LOG')
  lines.push('Waktu,User,Action,Module,Reference,Deskripsi,IP Address,Status')
  logs.value.forEach(row => {
    const desc = row.description.replace(/,/g, ';')
    lines.push(`${row.timestamp},${row.userName},${row.action},${row.module},${row.reference},${desc},${row.ipAddress},${row.status}`)
  })
  lines.push('')
  lines.push('RINGKASAN AKTIVITAS')
  lines.push('Bulan,CREATE,UPDATE,DELETE,VIEW,EXPORT,Total')
  activitySummary.value.forEach(row => {
    lines.push(`${row.month},${row.creates},${row.updates},${row.deletes},${row.views},${row.exports},${row.total}`)
  })

  const csv = lines.join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `audit-log-${Date.now()}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

function downloadAuditPdf() {
  const htmlContent = `
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial; margin: 20px; font-size: 11px; }
          .header { text-align: center; font-weight: bold; font-size: 14px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #333; padding: 6px; text-align: left; }
          th { background: #f0f0f0; font-weight: bold; }
          .summary { margin-bottom: 20px; }
          .summary-row { display: flex; gap: 15px; margin-bottom: 10px; }
          .summary-item { flex: 1; padding: 8px; background: #f9f9f9; border-radius: 3px; }
          .create { background: #e3f2fd; }
          .update { background: #fff3e0; }
          .delete { background: #fadbd8; }
          .view { background: #f3e5f5; }
          .export { background: #e0f2f1; }
          .success { background: #e8f8f5; }
          .failed { background: #fadbd8; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>LAPORAN AUDIT LOG</div>
          <div>${new Date().toLocaleDateString('id-ID')}</div>
        </div>

        <div class="summary">
          <div style="font-weight:bold;margin-bottom:10px">RINGKASAN</div>
          <div class="summary-row">
            <div class="summary-item create">Total CREATE: ${createCount.value}</div>
            <div class="summary-item update">Total UPDATE: ${updateCount.value}</div>
            <div class="summary-item delete">Total DELETE: ${deleteCount.value}</div>
            <div class="summary-item view">Total VIEW: ${viewCount.value}</div>
            <div class="summary-item export">Total EXPORT: ${exportCount.value}</div>
          </div>
        </div>

        <div style="page-break-inside: avoid;">
          <div style="font-weight:bold;margin-bottom:10px;margin-top:20px">AUDIT LOG DETAIL</div>
          <table>
            <tr>
              <th>Waktu</th><th>User</th><th>Action</th><th>Module</th><th>Reference</th><th>Deskripsi</th><th>IP</th><th>Status</th>
            </tr>
            ${logs.value.slice(0, 50).map(row => `<tr class="${row.status}"><td style="font-size:10px">${row.timestamp}</td><td>${row.userName}</td><td class="${row.action.toLowerCase()}">${row.action}</td><td>${row.module}</td><td>${row.reference}</td><td style="font-size:10px">${row.description}</td><td style="font-size:9px">${row.ipAddress}</td><td>${row.status}</td></tr>`).join('')}
          </table>
          <div style="font-size:9px;margin-top:10px;color:#666">${logs.value.length > 50 ? `(Menampilkan 50 dari ${logs.value.length} log)` : ''}</div>
        </div>

        <div style="page-break-inside: avoid;margin-top:20px">
          <div style="font-weight:bold;margin-bottom:10px">RINGKASAN AKTIVITAS BULANAN</div>
          <table>
            <tr>
              <th>Bulan</th><th>CREATE</th><th>UPDATE</th><th>DELETE</th><th>VIEW</th><th>EXPORT</th><th>Total</th>
            </tr>
            ${activitySummary.value.map(row => `<tr><td>${row.month}</td><td class="create">${row.creates}</td><td class="update">${row.updates}</td><td class="delete">${row.deletes}</td><td class="view">${row.views}</td><td class="export">${row.exports}</td><td style="font-weight:bold">${row.total}</td></tr>`).join('')}
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
.action-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
}

.action-badge.create {
  background: #e3f2fd;
  color: #1c84c6;
}

.action-badge.update {
  background: #fff3e0;
  color: #f0ad4e;
}

.action-badge.delete {
  background: #fadbd8;
  color: #e74c3c;
}

.action-badge.view {
  background: #f3e5f5;
  color: #9B59B6;
}

.action-badge.export {
  background: #e0f2f1;
  color: #16a085;
}

.status-badge.success {
  background: #e8f8f5;
  color: #1a8a72;
}

.status-badge.failed {
  background: #fadbd8;
  color: #e74c3c;
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
