<?php

return [
    'roles' => [
        1 => 'Super Admin',
        2 => 'Direktur',
        3 => 'Purchasing',
        4 => 'Import',
        5 => 'Kepala Gudang',
        6 => 'Staff Gudang',
        7 => 'Sales Marketing',
        8 => 'Sales Manager',
        9 => 'Admin Penjualan',
        10 => 'Finance',
        11 => 'Accounting',
        12 => 'QC',
    ],
    'modules' => [
        'dashboard' => [
            'label' => 'Dashboard',
            'description' => 'Ringkasan performa operasional lintas modul.',
            'allowed_roles' => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            'actions' => ['view'],
        ],
        'master-data' => [
            'label' => 'Master Data',
            'description' => 'Kelola data inti perusahaan dan referensi sistem.',
            'allowed_roles' => [1, 2],
            'actions' => ['view', 'create', 'update', 'delete', 'export'],
        ],
        'purchasing' => [
            'label' => 'Purchasing',
            'description' => 'Permintaan pembelian, purchase order, dan supplier management.',
            'allowed_roles' => [1, 2, 3],
            'actions' => ['view', 'create', 'update', 'approve', 'print', 'export'],
        ],
        'import' => [
            'label' => 'Import',
            'description' => 'Pemantauan dokumen impor dan status pengiriman.',
            'allowed_roles' => [1, 2, 4],
            'actions' => ['view', 'create', 'update', 'approve', 'track', 'export'],
        ],
        'gudang' => [
            'label' => 'Gudang',
            'description' => 'Penerimaan, transfer, dan stok barang di gudang.',
            'allowed_roles' => [1, 2, 5, 6],
            'actions' => ['view', 'create', 'update', 'adjust-stock', 'approve', 'export'],
        ],
        'sales' => [
            'label' => 'Sales',
            'description' => 'Aktivitas penjualan, order, dan pipeline customer.',
            'allowed_roles' => [1, 2, 7, 8, 9],
            'actions' => ['view', 'create', 'update', 'approve', 'print', 'export'],
        ],
        'spv-sales' => [
            'label' => 'SPV Sales',
            'description' => 'Pengawasan dan pengelolaan tim sales lapangan.',
            'allowed_roles' => [1, 2, 7, 8, 9],
            'actions' => ['view', 'create', 'update', 'approve', 'export'],
        ],
        'finance' => [
            'label' => 'Finance',
            'description' => 'Kas, bank, pembayaran, dan approval finansial.',
            'allowed_roles' => [1, 2, 10, 11],
            'actions' => ['view', 'create', 'update', 'approve', 'posting', 'export'],
        ],
        'accounting' => [
            'label' => 'Accounting',
            'description' => 'Pencatatan jurnal, neraca, dan laporan akuntansi.',
            'allowed_roles' => [1, 2, 11],
            'actions' => ['view', 'create', 'update', 'approve', 'posting', 'export'],
        ],
        'qc' => [
            'label' => 'Quality Control',
            'description' => 'Kontrol kualitas barang masuk, proses, dan hasil akhir.',
            'allowed_roles' => [1, 2, 12],
            'actions' => ['view', 'create', 'update', 'approve', 'release', 'export'],
        ],
        'reporting' => [
            'label' => 'Laporan Direksi',
            'description' => 'Laporan lintas modul untuk monitoring manajemen.',
            'allowed_roles' => [1, 2],
            'actions' => ['view', 'print', 'export'],
        ],
        'settings' => [
            'label' => 'Pengaturan Sistem',
            'description' => 'Konfigurasi aplikasi, role, dan kebijakan akses.',
            'allowed_roles' => [1],
            'actions' => ['view', 'create', 'update', 'delete'],
        ],
    ],
    'export' => [
        'pdf' => [
            'paper' => 'a4',
            'orientation' => 'portrait',
        ],
        'excel' => [
            'default_sheet' => 'Data',
        ],
    ],
    'upload' => [
        'disk' => 'public',
        'directory' => 'uploads',
        'max_kb' => 10240,
        'allowed_mimes' => [
            'jpg', 'jpeg', 'png', 'pdf', 'xlsx', 'xls', 'csv', 'doc', 'docx'
        ],
    ],
];
