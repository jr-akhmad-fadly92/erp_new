# README Modul Sales

## Lokasi View
`frontend/src/views/sales/SalesPage.vue`

## Tujuan Modul
Modul ini dipakai untuk mengelola proses penjualan dari pelanggan, sales order, target sales, invoice penjualan, sampai laporan outstanding invoice.

## Fitur Utama
- CRUD Sales Order
- CRUD Pelanggan
- CRUD Target Sales
- CRUD Invoice Penjualan
- Laporan invoice penjualan
- Export laporan ke CSV
- Ringkasan statistik pada bagian atas halaman

## Tab di Halaman
1. `Sales Order`
2. `Pelanggan`
3. `Target Sales`
4. `Invoice Penjualan`
5. `Laporan`

## Cara Penggunaan
### 1. Sales Order
- Buka tab `Sales Order`.
- Gunakan kolom pencarian untuk mencari nomor SO atau item.
- Gunakan filter status untuk melihat data `draft`, `approved`, atau `closed`.
- Klik `Tambah SO` untuk membuat sales order baru.
- Isi nomor SO, tanggal, pelanggan, item, qty, harga, lalu simpan.
- Gunakan tombol edit untuk mengubah data.
- Gunakan tombol hapus untuk menghapus data.

### 2. Pelanggan
- Buka tab `Pelanggan`.
- Cari data berdasarkan nama pelanggan, kota, atau PIC.
- Filter status pelanggan `aktif` atau `nonaktif`.
- Klik `Tambah Pelanggan` untuk menambah master pelanggan.
- Isi kode pelanggan, nama, kota, PIC, telepon, email, limit kredit, dan status.

### 3. Target Sales
- Buka tab `Target Sales`.
- Cari berdasarkan nama sales, region, atau periode.
- Filter status target seperti `on-track`, `under`, atau `achieved`.
- Klik `Tambah Target` untuk menambahkan target penjualan baru.
- Isi periode, nama sales, region, target, dan pencapaian.

### 4. Invoice Penjualan
- Buka tab `Invoice Penjualan`.
- Cari invoice berdasarkan nomor invoice atau nomor SO.
- Filter status `unpaid`, `partial`, atau `paid`.
- Klik `Tambah Invoice` untuk membuat invoice baru.
- Isi nomor invoice, relasi SO, pelanggan, tanggal invoice, due date, total, dan nominal terbayar.

### 5. Laporan
- Buka tab `Laporan`.
- Pilih filter bulan dan tahun bila diperlukan.
- Sistem menampilkan daftar invoice, total tagihan, pembayaran, dan outstanding.
- Klik `Unduh CSV` untuk export laporan.

## Ringkasan Kartu Statistik
- Jumlah Sales Order
- Jumlah Pelanggan
- Jumlah Target Sales
- Nilai Outstanding Invoice

## Catatan Implementasi
- Halaman menggunakan data dummy dari `frontend/src/data/salesDummy.js`.
- Access control mengikuti permission store dan module ID.
- Export saat ini tersedia dalam format CSV.