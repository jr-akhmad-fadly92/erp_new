# README Modul Gudang

## Lokasi View
`frontend/src/views/gudang/GudangPage.vue`

## Tujuan Modul
Modul Gudang dipakai untuk mengelola stok barang, mutasi antar gudang, opname stok, dan laporan pergerakan barang.

## Fitur Utama
- CRUD Stock Barang
- CRUD Mutasi Gudang
- CRUD Opname Stok
- Laporan mutasi gudang
- Export laporan ke CSV
- Ringkasan nilai stok

## Tab di Halaman
1. `Stock Barang`
2. `Mutasi Gudang`
3. `Opname Stok`
4. `Laporan`

## Cara Penggunaan
### 1. Stock Barang
- Buka tab `Stock Barang`.
- Cari data berdasarkan SKU atau nama barang.
- Filter status `aman`, `minimum`, atau `habis`.
- Klik `Tambah Stock` untuk menambahkan stok baru.
- Isi SKU, nama barang, kategori, gudang, jumlah stok, minimum stok, avg cost, dan status.

### 2. Mutasi Gudang
- Buka tab `Mutasi Gudang`.
- Cari data berdasarkan nomor mutasi, SKU, atau nama barang.
- Filter status `draft` atau `posted`.
- Klik `Tambah Mutasi` untuk memindahkan stok antar gudang.
- Isi nomor mutasi, tanggal, SKU, nama barang, gudang asal, gudang tujuan, qty, dan status.

### 3. Opname Stok
- Buka tab `Opname Stok`.
- Cari data berdasarkan nomor opname, SKU, atau barang.
- Filter status `review`, `adjusted`, atau `closed`.
- Klik `Tambah Opname` untuk mencatat hasil stock opname.
- Isi nomor opname, tanggal, gudang, SKU, system qty, physical qty, dan status.

### 4. Laporan
- Buka tab `Laporan`.
- Gunakan filter bulan dan tahun.
- Sistem menampilkan daftar mutasi gudang sebagai laporan utama.
- Klik `Unduh CSV` untuk export laporan.

## Ringkasan Kartu Statistik
- Jumlah stock barang
- Jumlah mutasi gudang
- Jumlah opname stok
- Nilai stok

## Catatan Implementasi
- Data saat ini memakai `frontend/src/data/gudangDummy.js`.
- Struktur gudang masih berbasis nama gudang di frontend; saat backend dibuat, lebih baik gunakan master gudang terpisah.