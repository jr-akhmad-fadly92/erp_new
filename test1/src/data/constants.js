// ─────────────────────────────────────────
//  ROLES
// ─────────────────────────────────────────
export const ROLES = [
  { id: 1,  name: 'Super Admin',     short: 'SA',  color: '#8E44AD', group: 'Admin'      },
  { id: 2,  name: 'Direktur',        short: 'Dir', color: '#2980B9', group: 'Pimpinan'   },
  { id: 3,  name: 'Purchasing',      short: 'Pur', color: '#27AE60', group: 'Procurement' },
  { id: 4,  name: 'Import',          short: 'Imp', color: '#F39C12', group: 'Procurement' },
  { id: 5,  name: 'Kepala Gudang',   short: 'KG',  color: '#E74C3C', group: 'Gudang'     },
  { id: 6,  name: 'Staff Gudang',    short: 'SG',  color: '#16A085', group: 'Gudang'     },
  { id: 7,  name: 'Sales Marketing', short: 'SM',  color: '#2C3E50', group: 'Sales'      },
  { id: 8,  name: 'Sales Manager',   short: 'SMg', color: '#C0392B', group: 'Sales'      },
  { id: 9,  name: 'Admin Penjualan', short: 'AP',  color: '#7F8C8D', group: 'Sales'      },
  { id: 10, name: 'Finance',         short: 'Fin', color: '#1ABC9C', group: 'Keuangan'   },
  { id: 11, name: 'Accounting',      short: 'Acc', color: '#D35400', group: 'Keuangan'   },
  { id: 12, name: 'QC',              short: 'QC',  color: '#2980B9', group: 'Operasional' },
]

// ─────────────────────────────────────────
//  MODULES
// ─────────────────────────────────────────
export const MODULES = [
  // Umum
  { id: 'm01', name: 'Dashboard',          icon: 'fa-tachometer-alt', group: 'Umum' },
  { id: 'm02', name: 'Master Data',        icon: 'fa-database',       group: 'Umum' },
  { id: 'm22', name: 'Laporan Management', icon: 'fa-chart-pie',      group: 'Umum' },
  // Purchasing
  { id: 'm03', name: 'Purchase Order',     icon: 'fa-shopping-cart',  group: 'Purchasing' },
  { id: 'm04', name: 'Supplier',           icon: 'fa-truck',          group: 'Purchasing' },
  { id: 'm05', name: 'Invoice Pembelian',  icon: 'fa-file-invoice',   group: 'Purchasing' },
  // Import
  { id: 'm06', name: 'Penerimaan Barang',  icon: 'fa-boxes',          group: 'Import' },
  { id: 'm07', name: 'Clearance Barang',   icon: 'fa-clipboard-check',group: 'Import' },
  { id: 'm08', name: 'Dokumen Impor',      icon: 'fa-file-alt',       group: 'Import' },
  // Gudang
  { id: 'm09', name: 'Stock Barang',       icon: 'fa-box',            group: 'Gudang' },
  { id: 'm10', name: 'Mutasi Gudang',      icon: 'fa-exchange-alt',   group: 'Gudang' },
  { id: 'm11', name: 'Opname Stok',        icon: 'fa-clipboard-list', group: 'Gudang' },
  // Sales
  { id: 'm12', name: 'Sales Order',        icon: 'fa-cart-plus',      group: 'Sales' },
  { id: 'm13', name: 'Pelanggan',          icon: 'fa-user-tie',       group: 'Sales' },
  { id: 'm14', name: 'Target Sales',       icon: 'fa-bullseye',       group: 'Sales' },
  { id: 'm15', name: 'Invoice Penjualan',  icon: 'fa-receipt',        group: 'Sales' },
  // Finance
  { id: 'm16', name: 'Kas & Bank',         icon: 'fa-money-bill',     group: 'Finance' },
  { id: 'm17', name: 'Laporan Keuangan',   icon: 'fa-chart-bar',      group: 'Finance' },
  // Accounting
  { id: 'm18', name: 'Jurnal Akuntansi',   icon: 'fa-book',           group: 'Accounting' },
  { id: 'm19', name: 'Neraca & L/R',       icon: 'fa-balance-scale',  group: 'Accounting' },
  // QC
  { id: 'm20', name: 'Inspeksi QC',        icon: 'fa-microscope',     group: 'QC' },
  { id: 'm21', name: 'Sertifikat QC',      icon: 'fa-certificate',    group: 'QC' },
  // Sistem
  { id: 'm23', name: 'Audit Log',          icon: 'fa-history',        group: 'Sistem' },
  { id: 'm24', name: 'Manajemen User',     icon: 'fa-users-cog',      group: 'Sistem' },
]

// ─────────────────────────────────────────
//  COMPANIES
// ─────────────────────────────────────────
export const COMPANIES = [
  { id: 1, name: 'PT Maju Bersama',  kota: 'Jakarta Utara', bidang: 'Manufacturing', status: 'aktif',    modules: 18, color: '#26B99A' },
  { id: 2, name: 'CV Sinar Jaya',    kota: 'Surabaya',      bidang: 'Trading',       status: 'aktif',    modules: 12, color: '#1c84c6' },
  { id: 3, name: 'PT Karya Mandiri', kota: 'Bandung',       bidang: 'Distribution',  status: 'trial',    modules: 8,  color: '#f0ad4e' },
]

// ─────────────────────────────────────────
//  DEFAULT PERMISSIONS helper
// ─────────────────────────────────────────
export function buildDefaultPermissions() {
  const roleDefaults = {
    1:  () => true,  // Super Admin — semua
    2:  () => true,  // Direktur — semua
    3:  (m) => ['m01','m02','m03','m04','m05','m22'].includes(m),
    4:  (m) => ['m01','m02','m06','m07','m08'].includes(m),
    5:  (m) => ['m01','m02','m06','m09','m10','m11','m22'].includes(m),
    6:  (m) => ['m01','m09','m10'].includes(m),
    7:  (m) => ['m01','m12','m13','m15'].includes(m),
    8:  (m) => ['m01','m02','m12','m13','m14','m15','m22'].includes(m),
    9:  (m) => ['m01','m12','m13','m15'].includes(m),
    10: (m) => ['m01','m05','m15','m16','m17'].includes(m),
    11: (m) => ['m01','m16','m17','m18','m19'].includes(m),
    12: (m) => ['m01','m20','m21'].includes(m),
  }
  const perms = {}
  for (const mod of MODULES) {
    perms[mod.id] = {}
    for (const role of ROLES) {
      perms[mod.id][role.id] = roleDefaults[role.id]?.(mod.id) ?? false
    }
  }
  return perms
}

// ─────────────────────────────────────────
//  SAMPLE USERS (with passwords)
// ─────────────────────────────────────────
export const SAMPLE_USERS = [
  { id:1,  name:'Ahmad Fauzi',    email:'a.fauzi@majubersama.co.id',    password:'Admin@123', roleId:1,  companyId:1, status:'aktif'    },
  { id:2,  name:'Budi Santoso',   email:'b.santoso@majubersama.co.id',  password:'Dir@123',   roleId:2,  companyId:1, status:'aktif'    },
  { id:3,  name:'Citra Dewi',     email:'c.dewi@majubersama.co.id',     password:'Fin@123',   roleId:10, companyId:1, status:'aktif'    },
  { id:4,  name:'Doni Prasetyo',  email:'d.prasetyo@majubersama.co.id', password:'Pur@123',   roleId:3,  companyId:1, status:'aktif'    },
  { id:5,  name:'Eka Wijaya',     email:'e.wijaya@sinarjaya.co.id',     password:'SMgr@123',  roleId:8,  companyId:2, status:'aktif'    },
  { id:6,  name:'Fitra Nurul',    email:'f.nurul@sinarjaya.co.id',      password:'SG@123',    roleId:6,  companyId:2, status:'aktif'    },
  { id:7,  name:'Gilang Rizky',   email:'g.rizky@karyamandiri.co.id',   password:'QC@123',    roleId:12, companyId:3, status:'nonaktif' },
  { id:8,  name:'Hani Susanti',   email:'h.susanti@majubersama.co.id',  password:'Acc@123',   roleId:11, companyId:1, status:'aktif'    },
  { id:9,  name:'Irwan Syah',     email:'i.syah@majubersama.co.id',     password:'Imp@123',   roleId:4,  companyId:1, status:'aktif'    },
  { id:10, name:'Julia Rahmah',   email:'j.rahmah@sinarjaya.co.id',     password:'AP@123',    roleId:9,  companyId:2, status:'aktif'    },
  { id:11, name:'Krisna Putra',   email:'k.putra@majubersama.co.id',    password:'KG@123',    roleId:5,  companyId:1, status:'aktif'    },
  { id:12, name:'Laila Indah',    email:'l.indah@karyamandiri.co.id',   password:'SM@123',    roleId:7,  companyId:3, status:'aktif'    },
  { id:13, name:'Mario Sanjaya',  email:'m.sanjaya@majubersama.co.id',  password:'SG@123',    roleId:6,  companyId:1, status:'aktif'    },
  { id:14, name:'Nadia Putri',    email:'n.putri@sinarjaya.co.id',      password:'Pur@123',   roleId:3,  companyId:2, status:'nonaktif' },
  { id:15, name:'Oscar Firmansyah',email:'o.firmansyah@majubersama.co.id',password:'QC@123',   roleId:12,companyId:1,status:'aktif'   },
]

// ─────────────────────────────────────────
//  SPV SALES (Supervisor Sales) Data
// ─────────────────────────────────────────
export const SAMPLE_SPV_SALES = [
  { id:1,  name:'Supervisor Sales 1', phone:'0812-3456-7890', target:500000000, achieved:480000000, companyId:1, status:'aktif'    },
  { id:2,  name:'Supervisor Sales 2', phone:'0812-3456-7891', target:450000000, achieved:425000000, companyId:1, status:'aktif'    },
  { id:3,  name:'Supervisor Sales 3', phone:'0812-3456-7892', target:400000000, achieved:380000000, companyId:2, status:'aktif'    },
  { id:4,  name:'Supervisor Sales 4', phone:'0812-3456-7893', target:350000000, achieved:340000000, companyId:3, status:'nonaktif' },
]
