// ─────────────────────────────────────────
//  ROLES
// ─────────────────────────────────────────
export const ROLES = [
  { id: 1,  name: 'Super Admin',     short: 'SA',  color: '#8E44AD', group: 'Admin'       },
  { id: 2,  name: 'Direktur',        short: 'Dir', color: '#2980B9', group: 'Pimpinan'    },
  { id: 3,  name: 'Purchasing',      short: 'Pur', color: '#27AE60', group: 'Procurement' },
  { id: 4,  name: 'Import',          short: 'Imp', color: '#F39C12', group: 'Procurement' },
  { id: 5,  name: 'Kepala Gudang',   short: 'KG',  color: '#E74C3C', group: 'Gudang'      },
  { id: 6,  name: 'Staff Gudang',    short: 'SG',  color: '#16A085', group: 'Gudang'      },
  { id: 7,  name: 'Sales Marketing', short: 'SM',  color: '#2C3E50', group: 'Sales'       },
  { id: 8,  name: 'Sales Manager',   short: 'SMg', color: '#C0392B', group: 'Sales'       },
  { id: 9,  name: 'Admin Penjualan', short: 'AP',  color: '#7F8C8D', group: 'Sales'       },
  { id: 10, name: 'Finance',         short: 'Fin', color: '#1ABC9C', group: 'Keuangan'    },
  { id: 11, name: 'Accounting',      short: 'Acc', color: '#D35400', group: 'Keuangan'    },
  { id: 12, name: 'QC',              short: 'QC',  color: '#2980B9', group: 'Operasional' },
  { id: 13, name: 'SPV Sales',       short: 'SPV', color: '#8B0000', group: 'Sales'       },
]

// ─────────────────────────────────────────
//  MODULES
// ─────────────────────────────────────────
export const MODULES = [
  // Umum
  { id: 'm01', name: 'Dashboard',             icon: 'fa-tachometer-alt',  group: 'Umum'      },
  { id: 'm02', name: 'Master Data',           icon: 'fa-database',        group: 'Umum'      },
  { id: 'm22', name: 'Laporan Management',    icon: 'fa-chart-pie',       group: 'Umum'      },
  // Purchasing
  { id: 'm03', name: 'Purchase Order',        icon: 'fa-shopping-cart',   group: 'Purchasing'},
  { id: 'm04', name: 'Supplier',              icon: 'fa-truck',           group: 'Purchasing'},
  { id: 'm05', name: 'Invoice Pembelian',     icon: 'fa-file-invoice',    group: 'Purchasing'},
  // Import
  { id: 'm06', name: 'Penerimaan Barang',     icon: 'fa-boxes',           group: 'Import'    },
  { id: 'm07', name: 'Clearance Barang',      icon: 'fa-clipboard-check', group: 'Import'    },
  { id: 'm08', name: 'Dokumen Impor',         icon: 'fa-file-alt',        group: 'Import'    },
  // Gudang
  { id: 'm09', name: 'Stock Barang',          icon: 'fa-box',             group: 'Gudang'    },
  { id: 'm10', name: 'Mutasi Gudang',         icon: 'fa-exchange-alt',    group: 'Gudang'    },
  { id: 'm11', name: 'Opname Stok',           icon: 'fa-clipboard-list',  group: 'Gudang'    },
  // Sales
  { id: 'm12', name: 'Sales Order',           icon: 'fa-cart-plus',       group: 'Sales'     },
  { id: 'm13', name: 'Pelanggan',             icon: 'fa-user-tie',        group: 'Sales'     },
  { id: 'm14', name: 'Target Sales',          icon: 'fa-bullseye',        group: 'Sales'     },
  { id: 'm15', name: 'Invoice Penjualan',     icon: 'fa-receipt',         group: 'Sales'     },
  // SPV Sales
  { id: 'm25', name: 'Dashboard SPV',         icon: 'fa-tachometer-alt',  group: 'SPV Sales' },
  { id: 'm26', name: 'Tim Sales',             icon: 'fa-users',           group: 'SPV Sales' },
  { id: 'm27', name: 'Performa Sales',        icon: 'fa-chart-line',      group: 'SPV Sales' },
  { id: 'm28', name: 'Approval SO',           icon: 'fa-check-circle',    group: 'SPV Sales' },
  { id: 'm29', name: 'Target Tim',            icon: 'fa-bullseye',        group: 'SPV Sales' },
  // Finance
  { id: 'm16', name: 'Kas & Bank',            icon: 'fa-money-bill',      group: 'Finance'   },
  { id: 'm17', name: 'Laporan Keuangan',      icon: 'fa-chart-bar',       group: 'Finance'   },
  // Accounting
  { id: 'm18', name: 'Jurnal Akuntansi',      icon: 'fa-book',            group: 'Accounting'},
  { id: 'm19', name: 'Neraca & L/R',          icon: 'fa-balance-scale',   group: 'Accounting'},
  // QC
  { id: 'm20', name: 'Inspeksi QC',           icon: 'fa-microscope',      group: 'QC'        },
  { id: 'm21', name: 'Sertifikat QC',         icon: 'fa-certificate',     group: 'QC'        },
  // Sistem
  { id: 'm23', name: 'Audit Log',             icon: 'fa-history',         group: 'Sistem'    },
  { id: 'm24', name: 'Manajemen User',        icon: 'fa-users-cog',       group: 'Sistem'    },
]

// ─────────────────────────────────────────
//  COMPANIES
// ─────────────────────────────────────────
export const COMPANIES = [
  { id: 1, name: 'PT Maju Bersama',  kota: 'Jakarta Utara', bidang: 'Manufacturing', status: 'aktif', modules: 18, color: '#26B99A', npwp: '01.234.567.8-901.000', telepon: '021-12345678', alamat: 'Jl. Industri No. 1' },
  { id: 2, name: 'CV Sinar Jaya',    kota: 'Surabaya',      bidang: 'Trading',       status: 'aktif', modules: 12, color: '#1c84c6', npwp: '02.345.678.9-012.000', telepon: '031-87654321', alamat: 'Jl. Raya Darmo No. 5' },
  { id: 3, name: 'PT Karya Mandiri', kota: 'Bandung',       bidang: 'Distribution',  status: 'trial', modules: 8,  color: '#f0ad4e', npwp: '03.456.789.0-123.000', telepon: '022-11223344', alamat: 'Jl. Merdeka No. 10' },
]

// ─────────────────────────────────────────
//  DEFAULT PERMISSIONS
// ─────────────────────────────────────────
export function buildDefaultPermissions() {
  const roleDefaults = {
    1:  () => true,
    2:  () => true,
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
    13: (m) => ['m01','m12','m13','m14','m15','m22','m25','m26','m27','m28','m29'].includes(m),
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
//  SAMPLE USERS
// ─────────────────────────────────────────
export const SAMPLE_USERS = [
  { id:1,  name:'Ahmad Fauzi',      email:'a.fauzi@majubersama.co.id',    roleId:1,  companyId:1, status:'aktif',    phone:'08111000001', password:'demo123' },
  { id:2,  name:'Budi Santoso',     email:'b.santoso@majubersama.co.id',  roleId:2,  companyId:1, status:'aktif',    phone:'08111000002', password:'demo123' },
  { id:3,  name:'Citra Dewi',       email:'c.dewi@majubersama.co.id',     roleId:10, companyId:1, status:'aktif',    phone:'08111000003', password:'demo123' },
  { id:4,  name:'Doni Prasetyo',    email:'d.prasetyo@majubersama.co.id', roleId:3,  companyId:1, status:'aktif',    phone:'08111000004', password:'demo123' },
  { id:5,  name:'Eka Wijaya',       email:'e.wijaya@sinarjaya.co.id',     roleId:8,  companyId:2, status:'aktif',    phone:'08111000005', password:'demo123' },
  { id:6,  name:'Fitra Nurul',      email:'f.nurul@sinarjaya.co.id',      roleId:6,  companyId:2, status:'aktif',    phone:'08111000006', password:'demo123' },
  { id:7,  name:'Gilang Rizky',     email:'g.rizky@karyamandiri.co.id',   roleId:12, companyId:3, status:'nonaktif', phone:'08111000007', password:'demo123' },
  { id:8,  name:'Hani Susanti',     email:'h.susanti@majubersama.co.id',  roleId:11, companyId:1, status:'aktif',    phone:'08111000008', password:'demo123' },
  { id:9,  name:'Irwan Syah',       email:'i.syah@majubersama.co.id',     roleId:4,  companyId:1, status:'aktif',    phone:'08111000009', password:'demo123' },
  { id:10, name:'Julia Rahmah',     email:'j.rahmah@sinarjaya.co.id',     roleId:9,  companyId:2, status:'aktif',    phone:'08111000010', password:'demo123' },
  { id:11, name:'Krisna Putra',     email:'k.putra@majubersama.co.id',    roleId:5,  companyId:1, status:'aktif',    phone:'08111000011', password:'demo123' },
  { id:12, name:'Laila Indah',      email:'l.indah@karyamandiri.co.id',   roleId:7,  companyId:3, status:'aktif',    phone:'08111000012', password:'demo123' },
  { id:13, name:'Mario Sanjaya',    email:'m.sanjaya@majubersama.co.id',  roleId:6,  companyId:1, status:'aktif',    phone:'08111000013', password:'demo123' },
  { id:14, name:'Nadia Putri',      email:'n.putri@sinarjaya.co.id',      roleId:3,  companyId:2, status:'nonaktif', phone:'08111000014', password:'demo123' },
  { id:15, name:'Oscar Firmansyah', email:'o.firmansyah@majubersama.co.id',roleId:12,companyId:1, status:'aktif',    phone:'08111000015', password:'demo123' },
  { id:16, name:'Pandu Wibowo',     email:'p.wibowo@majubersama.co.id',   roleId:13, companyId:1, status:'aktif',    phone:'08111000016', password:'demo123' },
  { id:17, name:'Reni Kusuma',      email:'r.kusuma@sinarjaya.co.id',     roleId:13, companyId:2, status:'aktif',    phone:'08111000017', password:'demo123' },
]
