# MultiCorp ERP — Vue 3 + Gentelella v4

Sistem manajemen multi-perusahaan dengan Role-Based Access Control (RBAC),
dibangun dengan **Vue 3 + Pinia + Vue Router 4**, bergaya **Gentelella v4**.

---

## Cara Menjalankan

**Prasyarat:** Node.js v16 atau lebih baru — https://nodejs.org

```bash
cd multicorp-erp
npm install
npm run dev
# Buka: http://localhost:5173
```

Build production:
```bash
npm run build
npm run preview
```

---

## Struktur Proyek

```
src/
├── layouts/                  ← MASTER LAYOUT
│   ├── MainLayout.vue        ← Layout utama: Topbar + Sidebar + <router-view>
│   └── AuthLayout.vue        ← Layout login (kosong, tanpa sidebar)
│
├── components/
│   ├── layout/               ← Komponen bagian layout
│   │   ├── AppTopbar.vue     ← Navbar atas: brand, company switcher, user menu
│   │   └── AppSidebar.vue    ← Sidebar: menu dinamis sesuai role & permission
│   └── common/               ← Komponen reusable lintas halaman
│       ├── PageHeader.vue    ← Judul halaman + breadcrumb + slot actions
│       ├── PanelBox.vue      ← Card/panel dengan heading + slot content
│       ├── StatTile.vue      ← Tile statistik (value + label + icon)
│       ├── AppModal.vue      ← Modal dialog reusable (v-model)
│       └── ToastContainer.vue← Notifikasi toast (inject dari MainLayout)
│
├── views/                    ← HALAMAN — 1 folder per modul
│   ├── auth/
│   │   └── LoginPage.vue     ← Halaman login + demo accounts
│   ├── dashboard/
│   │   └── DashboardPage.vue ← Statistik, distribusi role, grafik modul
│   ├── perusahaan/
│   │   └── PerusahaanPage.vue← CRUD perusahaan + statistik per perusahaan
│   ├── permission/
│   │   └── PermissionPage.vue← Matriks 12 role × 24 modul + filter group
│   ├── users/
│   │   └── UsersPage.vue     ← CRUD pengguna + filter + preview akses
│   ├── purchasing/
│   │   └── PurchasingPage.vue
│   ├── import/
│   │   └── ImportPage.vue
│   ├── gudang/
│   │   └── GudangPage.vue
│   ├── sales/
│   │   └── SalesPage.vue
│   ├── finance/
│   │   └── FinancePage.vue
│   ├── accounting/
│   │   └── AccountingPage.vue
│   ├── qc/
│   │   └── QcPage.vue
│   └── audit-log/
│       └── AuditLogPage.vue
│
├── router/
│   └── index.js              ← Route groups: AuthLayout vs MainLayout + guards
│
├── store/
│   └── index.js              ← Pinia: useAuthStore, usePermissionStore,
│                                       useUserStore, useCompanyStore
│
├── data/
│   └── constants.js          ← ROLES, MODULES, COMPANIES, SAMPLE_USERS,
│                                buildDefaultPermissions()
│
├── assets/css/
│   └── gentelella.css        ← Semua styling Gentelella (navbar, sidebar,
│                                tile, panel, table, toggle, modal, toast...)
│
├── App.vue                   ← Root: hanya <router-view /> (layout di layouts/)
└── main.js
```

---

## Role & Default Akses

| ID | Role           | Modul Default                                      |
|----|----------------|----------------------------------------------------|
|  1 | Super Admin    | Semua (tidak bisa diubah)                          |
|  2 | Direktur       | Semua (tidak bisa diubah)                          |
|  3 | Purchasing     | PO, Supplier, Invoice Pembelian                    |
|  4 | Import         | Penerimaan, Clearance, Dokumen Impor               |
|  5 | Kepala Gudang  | Stock, Mutasi, Opname, Penerimaan, Lap. Management |
|  6 | Staff Gudang   | Stock, Mutasi Gudang                               |
|  7 | Sales Marketing| Sales Order, Pelanggan, Invoice Penjualan          |
|  8 | Sales Manager  | + Target Sales, Laporan Management                 |
|  9 | Admin Penjualan| Sales Order, Pelanggan, Invoice                    |
| 10 | Finance        | Kas & Bank, Laporan Keuangan, Invoice              |
| 11 | Accounting     | Kas & Bank, Jurnal, Neraca                         |
| 12 | QC             | Inspeksi QC, Sertifikat QC                         |

---

## Demo Login

Buka http://localhost:5173 → klik tombol role yang tersedia → password: `demo123`

---

## Cara Menambah Modul Baru

1. Buat folder: `src/views/namamodul/`
2. Buat file: `src/views/namamodul/NamamodulPage.vue`
   - Gunakan `<PageHeader>`, `<PanelBox>`, `<StatTile>` dari `@/components/common`
   - Inject `showToast` dari MainLayout untuk notifikasi
3. Tambahkan route di `src/router/index.js` dalam children MainLayout
4. Tambahkan menu di `src/components/layout/AppSidebar.vue`
5. Tambahkan data modul di `src/data/constants.js` (array MODULES)

---

*Vue 3 + Pinia + Vue Router 4 + Vite | Style: Gentelella v4*
