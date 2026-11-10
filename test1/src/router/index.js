import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/store'

// Layouts
import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

const routes = [
  // ── Auth (tanpa sidebar/topbar) ─────────────────────
  {
    path: '/',
    component: AuthLayout,
    children: [
      { path: '',      redirect: '/login' },
      { path: 'login', name: 'login', component: () => import('@/views/auth/LoginPage.vue'), meta: { public: true, title: 'Login' } },
    ]
  },

  // ── Main app (dengan sidebar & topbar) ──────────────
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      // Utama
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/DashboardPage.vue'),
        meta: { title: 'Dashboard' }
      },
      {
        path: 'perusahaan',
        name: 'perusahaan',
        component: () => import('@/views/perusahaan/PerusahaanPage.vue'),
        meta: { title: 'Perusahaan' }
      },

      // Manajemen Akses (hanya Admin)
      {
        path: 'permission',
        name: 'permission',
        component: () => import('@/views/permission/PermissionPage.vue'),
        meta: { title: 'Hak Akses Modul', requiresAdmin: true }
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('@/views/users/UsersPage.vue'),
        meta: { title: 'Pengguna', requiresAdmin: true }
      },

      // Modul ERP
      {
        path: 'purchasing',
        name: 'purchasing',
        component: () => import('@/views/purchasing/PurchasingPage.vue'),
        meta: { title: 'Purchasing', module: 'm03' }
      },
      {
        path: 'import',
        name: 'import',
        component: () => import('@/views/import/ImportPage.vue'),
        meta: { title: 'Import', module: 'm06' }
      },
      {
        path: 'gudang',
        name: 'gudang',
        component: () => import('@/views/gudang/GudangPage.vue'),
        meta: { title: 'Gudang', module: 'm09' }
      },
      {
        path: 'sales',
        name: 'sales',
        component: () => import('@/views/sales/SalesPage.vue'),
        meta: { title: 'Sales', module: 'm12' }
      },
      
      {
        path: 'finance',
        name: 'finance',
        component: () => import('@/views/finance/FinancePage.vue'),
        meta: { title: 'Finance', module: 'm16' }
      },
      {
        path: 'accounting',
        name: 'accounting',
        component: () => import('@/views/accounting/AccountingPage.vue'),
        meta: { title: 'Accounting', module: 'm18' }
      },
      {
        path: 'qc',
        name: 'qc',
        component: () => import('@/views/qc/QcPage.vue'),
        meta: { title: 'Quality Control', module: 'm20' }
      },
      {
        path: 'spv',
        name: 'spv',
        component: () => import('@/views/spv-sales/SpvPage.vue'),
        meta: { title: 'Sales', module: 'm22' }
      },
      // Sistem
      {
        path: 'audit-log',
        name: 'audit-log',
        component: () => import('@/views/audit-log/AuditLogPage.vue'),
        meta: { title: 'Audit Log', requiresAdmin: true }
      },
      
      // Fallback
      { path: ':pathMatch(.*)*', redirect: '/dashboard' },
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

// ── Navigation Guard ─────────────────────────────────
router.beforeEach((to) => {
  const auth = useAuthStore()
  const loggedIn = !!auth.currentUser?.id

  // Halaman public (login)
  if (to.meta.public) {
    return loggedIn ? '/dashboard' : true
  }

  // Belum login
  if (!loggedIn) return '/login'

  // Hanya Super Admin & Direktur yang bisa akses permission & users
  if (to.meta.requiresAdmin && auth.currentUser.roleId > 2) {
    return '/dashboard'
  }

  // Update document title
  document.title = to.meta.title ? `${to.meta.title} — MultiCorp ERP` : 'MultiCorp ERP'
})

export default router
