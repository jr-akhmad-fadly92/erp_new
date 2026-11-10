# README Modul Import

## Lokasi View
`frontend/src/views/import/ImportPage.vue`

## Tujuan Modul
Modul Import dipakai untuk mencatat penerimaan barang impor, proses clearance barang, dokumen impor, dan laporan biaya clearance.

## Fitur Utama
- CRUD Penerimaan Barang
- CRUD Clearance Barang
- CRUD Dokumen Impor
- Laporan clearance barang
- Export laporan ke CSV
- Ringkasan biaya clearance

## Tab di Halaman
1. `Penerimaan Barang`
2. `Clearance Barang`
3. `Dokumen Impor`
4. `Laporan`

## Cara Penggunaan
### 1. Penerimaan Barang
- Buka tab `Penerimaan Barang`.
- Cari data berdasarkan nomor penerimaan, nomor PO, atau item.
- Klik `Tambah` untuk membuat penerimaan barang baru.
- Isi nomor penerimaan, nomor PO, supplier, tanggal, item, qty, dan status.
- Gunakan tombol edit atau hapus untuk pemeliharaan data.

### 2. Clearance Barang
- Buka tab `Clearance Barang`.
- Cari data berdasarkan nomor clearance, BL, atau vessel.
- Klik `Tambah` untuk menambahkan proses clearance baru.
- Isi nomor clearance, BL, vessel, ETA, release date, biaya clearance, dan status.

### 3. Dokumen Impor
- Buka tab `Dokumen Impor`.
- Cari dokumen berdasarkan nomor dokumen, tipe, atau nama file.
- Klik `Tambah` untuk menambahkan dokumen impor.
- Isi nomor dokumen, clearance terkait, tipe dokumen, nama file, tanggal terbit, tanggal kedaluwarsa, dan status.

### 4. Laporan
- Buka tab `Laporan`.
- Gunakan filter bulan dan tahun jika diperlukan.
- Sistem menampilkan daftar clearance dan biaya clearance.
- Klik `Unduh CSV` untuk export laporan.

## Ringkasan Kartu Statistik
- Jumlah penerimaan barang
- Jumlah clearance barang
- Jumlah dokumen impor
- Total biaya clearance

## Catatan Implementasi
- Data saat ini memakai `frontend/src/data/importDummy.js`.
- Untuk implementasi backend, clearance dan dokumen impor sebaiknya saling terhubung dengan relasi yang jelas.