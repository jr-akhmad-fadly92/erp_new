# README Modul Purchasing

## Lokasi View
`frontend/src/views/purchasing/PurchasingPage.vue`

## Tujuan Modul
Modul Purchasing dipakai untuk mengelola supplier, purchase order, invoice pembelian, dan laporan outstanding pembelian.

## Fitur Utama
- CRUD Supplier
- CRUD Purchase Order
- CRUD Invoice Pembelian
- Laporan pembelian
- Export laporan ke CSV
- Ringkasan nilai PO, invoice, dan outstanding

## Tab di Halaman
1. `Supplier`
2. `Purchase Order`
3. `Invoice Pembelian`
4. `Laporan`

## Cara Penggunaan
### 1. Supplier
- Buka tab `Supplier`.
- Cari data berdasarkan nama supplier, PIC, atau kota.
- Filter status `aktif` atau `nonaktif`.
- Klik `Tambah Supplier` untuk menambahkan supplier baru.
- Isi kode supplier, nama, PIC, kontak, kota, alamat, payment term, dan status.

### 2. Purchase Order
- Buka tab `Purchase Order`.
- Cari data berdasarkan nomor PO atau item.
- Filter status `draft`, `sent`, `approved`, atau `closed`.
- Klik `Tambah PO` untuk membuat purchase order baru.
- Isi nomor PO, supplier, tanggal PO, ETA, item, qty, harga satuan, dan status.

### 3. Invoice Pembelian
- Buka tab `Invoice Pembelian`.
- Cari data berdasarkan nomor invoice atau nomor PO.
- Filter status `unpaid`, `partial`, `paid`, atau `overdue`.
- Klik `Tambah Invoice` untuk membuat invoice pembelian baru.
- Isi nomor invoice, PO terkait, supplier, tanggal invoice, jatuh tempo, total, pembayaran, dan status.

### 4. Laporan
- Buka tab `Laporan`.
- Sistem menampilkan ringkasan total PO, total invoice, outstanding, dan top supplier.
- Gunakan filter bulan dan tahun jika diperlukan.
- Klik `Unduh CSV` untuk export laporan.

## Ringkasan Kartu Statistik
- Jumlah supplier
- Jumlah purchase order
- Jumlah invoice pembelian
- Outstanding pembelian

## Catatan Implementasi
- Data saat ini memakai `frontend/src/data/purchasingDummy.js`.
- Relasi utama modul ini adalah supplier -> PO -> invoice pembelian.